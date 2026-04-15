// import React, { useState, useEffect } from 'react';
// import '../../css/invoice.css';
// import '../../css/form.css';
// import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilCarAlt, cilReload, cilPrint } from '@coreui/icons';
// import axiosInstance from '../../axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   hasSafePagePermission,
//   ACTIONS,
//   TABS
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';
// import { showError } from '../../utils/sweetAlerts';

// function RtoInvoice() {
//   const [formData, setFormData] = useState({
//     chassisNumber: '',
//     amount: ''
//   });
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const navigate = useNavigate();

//   // Get permissions from auth context
//   const { permissions = [] } = useAuth();

//   // Permission checks for RTO Invoice page under RTO module
//   const canViewRTOInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RTO_INVOICE, 
//     ACTIONS.VIEW
//   );
  
//   // For generating/printing invoice, we need CREATE permission
//   const canCreateRTOInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RTO_INVOICE, 
//     ACTIONS.CREATE
//   );

//   // Permission check for specific tab if needed (similar to RTOPaper structure)
//   const canViewRTOInvoiceTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_INVOICE,
//     ACTIONS.VIEW,
//     TABS.RTO_INVOICE?.GENERATE || 'generate' // Adjust tab name as needed
//   );

//   useEffect(() => {
//     // Check if user has permission to view this page
//     if (!canViewRTOInvoice) {
//       showError('You do not have permission to view RTO Invoice');
//       navigate('/dashboard');
//       return;
//     }
    
//     return () => {
//       if (typingTimeout) {
//         clearTimeout(typingTimeout);
//       }
//     };
//   }, [typingTimeout, canViewRTOInvoice, navigate]);

//   const fetchInvoiceDetails = async (chassisNumber) => {
//     if (!chassisNumber) {
//       setError('Please enter a chassis number');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
//       if (response.data.success) {
//         setInvoiceData(response.data.data);
//       } else {
//         setError('No booking found for this chassis number');
//         setInvoiceData(null);
//       }
//     } catch (err) {
//       setError('Failed to fetch invoice details');
//       setInvoiceData(null);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
    
//     if (name === 'chassisNumber') {
//       // Clear any existing timeout
//       if (typingTimeout) {
//         clearTimeout(typingTimeout);
//       }
      
//       // Only proceed if value is not empty
//       if (value.trim().length > 0) {
//         // Check if chassis number has exactly 17 characters
//         if (value.trim().length === 17) {
//           // Immediately fetch if we have 17 characters
//           fetchInvoiceDetails(value);
//         } else if (value.trim().length < 17) {
//           // Clear any existing data and error when typing incomplete chassis
//           setInvoiceData(null);
//           setError('');
//         }
//       } else {
//         // Clear everything if input is empty
//         setInvoiceData(null);
//         setError('');
//       }
//     }
//   };

//   const handleClear = () => {
//     setFormData({ chassisNumber: '', amount: '' });
//     setInvoiceData(null);
//     setError('');
//   };

//   const generateRTOInvoiceHTML = (data) => {
//     // Find ONLY the Ex-Showroom component
//     const exShowroomComponent = data.priceComponents.find((comp) => {
//       const headerKey = comp.header.header_key.toUpperCase();
//       return headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM');
//     });
    
//     if (!exShowroomComponent) {
//       return generateErrorHTML(data, 'Ex-Showroom price component not found');
//     }
    
//     return generateInvoiceHTML(data, exShowroomComponent);
//   };

//   const generateErrorHTML = (data, errorMessage) => {
//     const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
    
//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>RTO Invoice Error</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           padding: 20px;
//         }
//         .error {
//           color: red;
//           text-align: center;
//           margin-top: 50px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="error">
//         <h2>Error Generating RTO Invoice</h2>
//         <p>${errorMessage}</p>
//         <p>Booking Number: ${data.bookingNumber}</p>
//         <p>Date: ${currentDate}</p>
//       </div>
//     </body>
//     </html>
//     `;
//   };

//   const generateInvoiceHTML = (data, exShowroomComponent) => {
//     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
//     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
//     const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
//     const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
//     // Check if vehicle is EV using the type field from model
//     const isEV = data.model?.type === "EV" || false;
    
//     // Get subsidy amount directly from the data (from API response)
//     const subsidyAmount = data.subsidyAmount || 0;
    
//     // Calculate GST for Ex-Showroom component only
//     const gstRatePercentage = parseFloat(exShowroomComponent.header.metadata.gst_rate) || 0;
    
//     // For Ex-Showroom component - LINE TOTAL always equals Unit Cost
//     let unitCost;
//     let lineTotal;
    
//     if (isEV) {
//       // For EV Ex-Showroom, use original value
//       unitCost = exShowroomComponent.originalValue;
//       lineTotal = exShowroomComponent.originalValue; // LINE TOTAL = Unit Cost
//     } else {
//       unitCost = exShowroomComponent.originalValue;
//       lineTotal = exShowroomComponent.originalValue; // LINE TOTAL = Unit Cost (always, even if discount exists)
//     }
    
//     // Discount always 0 - never show discount even if present in data
//     const discount = 0;
    
//     const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
//     const totalGST = lineTotal - taxableValue;
//     const cgstAmount = totalGST / 2;
//     const sgstAmount = totalGST / 2;
    
//     // Grand total - subtract subsidy amount if vehicle is EV
//     const grandTotal = isEV ? lineTotal - subsidyAmount : lineTotal;

//     // HTML template
//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>RTO Invoice - ${data.bookingNumber}</title>
//       <style>
//         body {
//           font-family: "Courier New", Courier, monospace;
//           margin: 0;
//           padding: 8mm;
//           font-size: 15px;
//           color: #555555;
//         }
//         .page {
//           width: 210mm;
//           height: 297mm;
//           margin: 0 auto;
//         }
//         .invoice-title{
//           text-align:center;
//           font-size:26px;
//           font-weight:bold;
//         }
//         .header {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 3mm;
//         }
//         .header-left {
//           width: 70%;
//         }
//         .header-right {
//           width: 30%;
//           text-align: right;
//         }
//         .logo {
//           height: 55px;
//           margin-bottom: 2mm;
//         }
//         .dealer-info {
//           text-align: left;
//           font-size: 15px;
//           line-height: 1.3;
//         }
//         .rto-type {
//           text-align: left;
//           margin: 2mm 0;
//           font-weight: bold;
//           font-size: 16px;
//         }
//         .customer-info-container {
//           display: flex;
//           font-size:15px;
//           line-height: 1.4;
//         }
//         .customer-info-left {
//           width: 50%;
//         }
//         .customer-info-right {
//           width: 50%;
//         }
//         .customer-info-row {
//           margin: 1.5mm 0;
//           line-height: 1.4;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 10pt;
//           margin: 3mm 0;
//         }
//         th, td {
//           padding: 1.5mm;
//           border: 1px solid #000;
//           vertical-align: top;
//         }
//         th {
//           font-size: 10.5pt;
//           font-weight: bold;
//         }
//         .no-border { 
//           border: none !important; 
//           font-size:15px;
//         }
//         .text-right { text-align: right; }
//         .text-center { text-align: center; }
//         .bold, .customer-info-row strong, .section-title strong, .dealer-info strong { 
//           font-weight: bold; 
//         }
//         .section-title {
//           font-weight: bold;
//           margin: 2mm 0;
//           font-size: 16px;
//         }
//         .signature-box {
//           margin-top: 12mm;
//           display: flex;
//           justify-content: flex-end;
//           font-size: 10pt;
//         }
//         .signature-line {
//           border-top: 1px dashed #000;
//           width: 50mm;
//           display: inline-block;
//           margin-bottom: 2px;
//         }
//         .signature-item {
//           text-align: center;
//           width: 60mm;
//         }
//         .divider {
//           border-top: 2px solid #AAAAAA;
//           margin: 2mm 0;
//         }
//         .totals-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 3mm 0;
//           font-size: 15px;
//         }
//         .totals-table td {
//           border: none;
//           padding: 1.5mm;
//         }
//         .total-divider {
//           border-top: 2px solid #AAAAAA;
//           height: 1px;
//           margin: 3px 0;
//         }
//         .broker-info{
//           display:flex;
//           justify-content:space-between;
//           padding:2px;
//           font-size: 15px;
//           margin: 2mm 0;
//         }
//         .note{
//           padding:1px;
//           margin:2px;
//           font-size: 15px;
//         }
//         .invoice-number-bold {
//           font-weight: bold;
//         }
//         .purchase-detail-bold {
//           font-weight: bold;
//         }
//         .subsidy-row {
//           color: #28a745;
//           font-weight: bold;
//           font-size: 15px;
//         }
        
//         @page {
//           size: A4;
//           margin: 0;
//         }
//         @media print {
//           body {
//             padding: 5mm;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="page">
//         <!-- Header Section -->
//         <div class="invoice-title">RTO Invoice</div>
//         <div class="header">
//           <div class="header-left">
//             <h2 style="margin:3;font-size:16pt;">GANDHI MOTORS PVT LTD</h2>
//             <div class="dealer-info">
//               Authorized Main Dealer: TVS Motor Company Ltd.<br>
//               Registered office: ${data.branch?.address}
//               GSTIN: ${data.branch?.gst_number || ''}<br>
//               ${data.branch?.name}
//             </div>
//           </div>
//           <div class="header-right">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             <div>Date: ${currentDate}</div>
//             ${
//               data.bookingType === 'SUBDEALER'
//                 ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//                    <div><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//                 : ''
//             }
//           </div>
//         </div>
//         <div class="divider"></div>
//         <div class="rto-type">RTO TYPE: ${data.rto}</div>
//         <div class="divider"></div>

//         <!-- Customer Information -->
//         <div class="customer-info-container">
//           <div class="customer-info-left">
//             <div class="customer-info-row"><strong>Invoice Number:</strong> <span class="invoice-number-bold">${data.bookingNumber}</span></div>
//             <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//             <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
//             <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
//             <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
//             <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
//             <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
//             <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
//           </div>
        

// <div class="customer-info-right">
//   <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
//   <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
//   <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
//   <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
//   <div class="customer-info-row">
//     <strong>Payment Mode:</strong> 
//     ${data.payment?.type === 'FINANCE' && !data.hpa 
//       ? `${data.payment?.type || 'CASH'} (NO HPA SCHEME APPLICABLE)`
//       : data.payment?.type || 'CASH'
//     }
//   </div>
//   ${data.hpa && data.payment?.type === 'FINANCE' && data.payment?.financer?.name ? `
//     <div class="customer-info-row">
//       <strong>Financer:</strong> ${data.payment.financer.name}
//     </div>
//   ` : ''}
//   <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
// </div>
//         </div>
//         <div class="divider"></div>

//         <!-- Purchase Details -->
//         <div class="section-title">Purchase Details:</div>
//         <table class="no-border">
//           <tr>
//             <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
//             <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
//           </tr>
//           <tr>
//             <td class="no-border"><strong>Chasis No:</strong> <span class="purchase-detail-bold">${data.chassisNumber}</span></td>
//             <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
//           </tr>
//           <tr>
//             <td class="no-border"><strong>Engine No:</strong> <span class="purchase-detail-bold">${data.engineNumber}</span></td>
//             <td class="no-border"><strong>Key No.:</strong> <span class="purchase-detail-bold">${data.keyNumber || '000'}</span></td>
//           </tr>
//         </table>
        
//         <!-- Price Breakdown Table - Only Ex-Showroom -->
//         <table>
//           <tr>
//             <th style="width:25%">Particulars</th>
//             <th style="width:8%">HSN CODE</th>
//             <th style="width:8%">Unit Cost</th>
//             <th style="width:8%">Taxable</th>
//             <th style="width:5%">CGST</th>
//             <th style="width:8%">CGST AMOUNT</th>
//             <th style="width:5%">SGST</th>
//             <th style="width:8%">SGST AMOUNT</th>
//             <th style="width:7%">DISCOUNT</th>
//             <th style="width:10%">LINE TOTAL</th>
//           </tr>
//           <tr>
//             <td>${exShowroomComponent.header.header_key}</td>
//             <td>${exShowroomComponent.header.metadata.hsn_code}</td>
//             <td>${unitCost.toFixed(2)}</td>
//             <td>${taxableValue.toFixed(2)}</td>
//             <td>${(gstRatePercentage / 2).toFixed(2)}%</td>
//             <td>${cgstAmount.toFixed(2)}</td>
//             <td>${(gstRatePercentage / 2).toFixed(2)}%</td>
//             <td>${sgstAmount.toFixed(2)}</td>
//             <td>${discount.toFixed(2)}</td>
//             <td>${lineTotal.toFixed(2)}</td>
//           </tr>
//         </table>

//         <!-- Totals Section -->
//         <table class="totals-table">
//           <tr>
//             <td class="no-border" style="width:80%"><strong>Total</strong></td>
//             <td class="no-border text-right"><strong>${lineTotal.toFixed(2)}</strong></td>
//           </tr>
          
//           ${isEV && subsidyAmount > 0 ? `
//           <tr class="subsidy-row">
//             <td class="no-border"><strong>EV SUBSIDY</strong></td>
//             <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
//            </tr>
//            <tr>
//             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//            </tr>
//           ` : ''}
          
//           <tr>
//             <td class="no-border"><strong>GRAND TOTAL</strong></td>
//             <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
//           </tr>
//         </table>
        
//         <div class="broker-info">
//           <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
//           <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
//         </div>
        
//         <div class="note"><strong>Notes:</strong></div>
//         <div class="divider"></div>
//         <div style="margin-top:2mm;">
//           <div><strong>ACC.DETAILS: </strong>
//             ${data.accessories
//               .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
//               .filter((name) => name)
//               .join(', ')}
//           </div>
//         </div>
//         <div class="divider"></div>

//         <!-- Signature Section -->
//         <div class="signature-box">
//           <div class="signature-item">
//             <div class="signature-line"></div>
//             <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//     `;
//   };

//   const handlePrintRTOInvoice = () => {
//     if (!invoiceData) {
//       setError('Please fetch invoice details first');
//       return;
//     }

//     // Check CREATE permission before printing/generating invoice
//     if (!canCreateRTOInvoice) {
//       showError('You do not have permission to generate RTO Invoice');
//       return;
//     }

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(generateRTOInvoiceHTML(invoiceData));
//     printWindow.document.close();
//     printWindow.focus();
//   };

//   // Check if user has permission to view this page
//   if (!canViewRTOInvoice) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Invoice.
//       </div>
//     );
//   }

//   return (
//     <div className="invoice-container">
//       <h4 className="mb-4">RTO Invoice</h4>

//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}

//       <div className="p-3">
//         <h5>RTO Invoice</h5>
//         <CInputGroup className="mb-3">
//           <CInputGroupText>
//             <CIcon className="icon" icon={cilCarAlt} />
//           </CInputGroupText>
//           <CFormInput
//             placeholder="Enter Chassis Number"
//             name="chassisNumber"
//             value={formData.chassisNumber}
//             onChange={handleChange}
//             disabled={loading}
//           />
//           {loading && (
//             <CInputGroupText>
//               <CSpinner size="sm" color="primary" />
//             </CInputGroupText>
//           )}
//         </CInputGroup>

//         <div className="d-flex gap-2 flex-wrap">
//           {canCreateRTOInvoice ? (
//             <CButton 
//               className='submit-button' 
//               onClick={handlePrintRTOInvoice} 
//               disabled={!invoiceData || loading}
//               title="Generate RTO Invoice"
//             >
//               <CIcon icon={cilPrint} className="me-2" />
//               RTO Invoice
//             </CButton>
//           ) : (
//             <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
//               <CIcon icon={cilPrint} className="me-2" />
//               RTO Invoice (No Permission)
//             </CButton>
//           )}
//           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
//             <CIcon icon={cilReload} className="me-2" />
//             Clear
//           </CButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RtoInvoice;




import React, { useState, useEffect } from 'react';
import '../../css/invoice.css';
import '../../css/form.css';
import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilReload, cilPrint } from '@coreui/icons';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage,
  hasSafePagePermission,
  ACTIONS,
  TABS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';
import { showError } from '../../utils/sweetAlerts';

function RtoInvoice() {
  const [formData, setFormData] = useState({
    chassisNumber: '',
    amount: ''
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

  // Get permissions from auth context
  const { permissions = [] } = useAuth();

  // Permission checks for RTO Invoice page under RTO module
  const canViewRTOInvoice = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.RTO_INVOICE, 
    ACTIONS.VIEW
  );
  
  // For generating/printing invoice, we need CREATE permission
  const canCreateRTOInvoice = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.RTO_INVOICE, 
    ACTIONS.CREATE
  );

  // Permission check for specific tab if needed (similar to RTOPaper structure)
  const canViewRTOInvoiceTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RTO_INVOICE,
    ACTIONS.VIEW,
    TABS.RTO_INVOICE?.GENERATE || 'generate' // Adjust tab name as needed
  );

  useEffect(() => {
    // Check if user has permission to view this page
    if (!canViewRTOInvoice) {
      showError('You do not have permission to view RTO Invoice');
      navigate('/dashboard');
      return;
    }
    
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout, canViewRTOInvoice, navigate]);

  const fetchInvoiceDetails = async (chassisNumber) => {
    if (!chassisNumber) {
      setError('Please enter a chassis number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
      if (response.data.success) {
        setInvoiceData(response.data.data);
      } else {
        setError('No booking found for this chassis number');
        setInvoiceData(null);
      }
    } catch (err) {
      setError('Failed to fetch invoice details');
      setInvoiceData(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'chassisNumber') {
      // Clear any existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Only proceed if value is not empty
      if (value.trim().length > 0) {
        // Check if chassis number has exactly 17 characters
        if (value.trim().length === 17) {
          // Immediately fetch if we have 17 characters
          fetchInvoiceDetails(value);
        } else if (value.trim().length < 17) {
          // Clear any existing data and error when typing incomplete chassis
          setInvoiceData(null);
          setError('');
        }
      } else {
        // Clear everything if input is empty
        setInvoiceData(null);
        setError('');
      }
    }
  };

  const handleClear = () => {
    setFormData({ chassisNumber: '', amount: '' });
    setInvoiceData(null);
    setError('');
  };

  const generateRTOInvoiceHTML = (data) => {
    // Find ONLY the Ex-Showroom component
    const exShowroomComponent = data.priceComponents.find((comp) => {
      const headerKey = comp.header.header_key.toUpperCase();
      return headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM');
    });
    
    if (!exShowroomComponent) {
      return generateErrorHTML(data, 'Ex-Showroom price component not found');
    }
    
    return generateInvoiceHTML(data, exShowroomComponent);
  };

  const generateErrorHTML = (data, errorMessage) => {
    const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>RTO Invoice Error</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .error {
          color: red;
          text-align: center;
          margin-top: 50px;
        }
      </style>
    </head>
    <body>
      <div class="error">
        <h2>Error Generating RTO Invoice</h2>
        <p>${errorMessage}</p>
        <p>Booking Number: ${data.bookingNumber}</p>
        <p>Date: ${currentDate}</p>
      </div>
    </body>
    </html>
    `;
  };

  const generateInvoiceHTML = (data, exShowroomComponent) => {
    const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
    const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
    const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
    const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
    // Calculate GST for Ex-Showroom component only
    const gstRatePercentage = parseFloat(exShowroomComponent.header.metadata.gst_rate) || 0;
    
    // For Ex-Showroom component - LINE TOTAL always equals Unit Cost
    let unitCost;
    let lineTotal;
    
    unitCost = exShowroomComponent.originalValue;
    lineTotal = exShowroomComponent.originalValue; // LINE TOTAL = Unit Cost (always, even if discount exists)
    
    // Discount always 0 - never show discount even if present in data
    const discount = 0;
    
    const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
    const totalGST = lineTotal - taxableValue;
    const cgstAmount = totalGST / 2;
    const sgstAmount = totalGST / 2;
    
    // Grand total is just the line total (no subsidy deduction)
    const grandTotal = lineTotal;

    // HTML template
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>RTO Invoice - ${data.bookingNumber}</title>
      <style>
        body {
          font-family: "Courier New", Courier, monospace;
          margin: 0;
          padding: 8mm;
          font-size: 15px;
          color: #555555;
        }
        .page {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
        }
        .invoice-title{
          text-align:center;
          font-size:26px;
          font-weight:bold;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3mm;
        }
        .header-left {
          width: 70%;
        }
        .header-right {
          width: 30%;
          text-align: right;
        }
        .logo {
          height: 55px;
          margin-bottom: 2mm;
        }
        .dealer-info {
          text-align: left;
          font-size: 15px;
          line-height: 1.3;
        }
        .rto-type {
          text-align: left;
          margin: 2mm 0;
          font-weight: bold;
          font-size: 16px;
        }
        .customer-info-container {
          display: flex;
          font-size:15px;
          line-height: 1.4;
        }
        .customer-info-left {
          width: 50%;
        }
        .customer-info-right {
          width: 50%;
        }
        .customer-info-row {
          margin: 1.5mm 0;
          line-height: 1.4;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10pt;
          margin: 3mm 0;
        }
        th, td {
          padding: 1.5mm;
          border: 1px solid #000;
          vertical-align: top;
        }
        th {
          font-size: 10.5pt;
          font-weight: bold;
        }
        .no-border { 
          border: none !important; 
          font-size:15px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold, .customer-info-row strong, .section-title strong, .dealer-info strong { 
          font-weight: bold; 
        }
        .section-title {
          font-weight: bold;
          margin: 2mm 0;
          font-size: 16px;
        }
        .signature-box {
          margin-top: 12mm;
          display: flex;
          justify-content: flex-end;
          font-size: 10pt;
        }
        .signature-line {
          border-top: 1px dashed #000;
          width: 50mm;
          display: inline-block;
          margin-bottom: 2px;
        }
        .signature-item {
          text-align: center;
          width: 60mm;
        }
        .divider {
          border-top: 2px solid #AAAAAA;
          margin: 2mm 0;
        }
        .totals-table {
          width: 100%;
          border-collapse: collapse;
          margin: 3mm 0;
          font-size: 15px;
        }
        .totals-table td {
          border: none;
          padding: 1.5mm;
        }
        .total-divider {
          border-top: 2px solid #AAAAAA;
          height: 1px;
          margin: 3px 0;
        }
        .broker-info{
          display:flex;
          justify-content:space-between;
          padding:2px;
          font-size: 15px;
          margin: 2mm 0;
        }
        .note{
          padding:1px;
          margin:2px;
          font-size: 15px;
        }
        .invoice-number-bold {
          font-weight: bold;
        }
        .purchase-detail-bold {
          font-weight: bold;
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            padding: 5mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Header Section -->
        <div class="invoice-title">RTO Invoice</div>
        <div class="header">
          <div class="header-left">
            <h2 style="margin:3;font-size:16pt;">GANDHI MOTORS PVT LTD</h2>
            <div class="dealer-info">
              Authorized Main Dealer: TVS Motor Company Ltd.<br>
              Registered office: ${data.branch?.address}
              GSTIN: ${data.branch?.gst_number || ''}<br>
              ${data.branch?.name}
            </div>
          </div>
          <div class="header-right">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            <div>Date: ${currentDate}</div>
            ${
              data.bookingType === 'SUBDEALER'
                ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
                   <div><b>Address:</b> ${data.subdealer?.location || ''}</div>`
                : ''
            }
          </div>
        </div>
        <div class="divider"></div>
        <div class="rto-type">RTO TYPE: ${data.rto}</div>
        <div class="divider"></div>

        <!-- Customer Information -->
        <div class="customer-info-container">
          <div class="customer-info-left">
            <div class="customer-info-row"><strong>Invoice Number:</strong> <span class="invoice-number-bold">${data.bookingNumber}</span></div>
            <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
            <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
            <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
            <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
            <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
            <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
            <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
          </div>
        

<div class="customer-info-right">
  <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
  <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
  <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
  <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
  <div class="customer-info-row">
    <strong>Payment Mode:</strong> 
    ${data.payment?.type === 'FINANCE' && !data.hpa 
      ? `${data.payment?.type || 'CASH'} (NO HPA SCHEME APPLICABLE)`
      : data.payment?.type || 'CASH'
    }
  </div>
  ${data.hpa && data.payment?.type === 'FINANCE' && data.payment?.financer?.name ? `
    <div class="customer-info-row">
      <strong>Financer:</strong> ${data.payment.financer.name}
    </div>
  ` : ''}
  <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
</div>
        </div>
        <div class="divider"></div>

        <!-- Purchase Details -->
        <div class="section-title">Purchase Details:</div>
        <table class="no-border">
          <tr>
            <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
            <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
          </tr>
          <tr>
            <td class="no-border"><strong>Chasis No:</strong> <span class="purchase-detail-bold">${data.chassisNumber}</span></td>
            <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
          </tr>
          <tr>
            <td class="no-border"><strong>Engine No:</strong> <span class="purchase-detail-bold">${data.engineNumber}</span></td>
            <td class="no-border"><strong>Key No.:</strong> <span class="purchase-detail-bold">${data.keyNumber || '000'}</span></td>
          </tr>
        </table>
        
        <!-- Price Breakdown Table - Only Ex-Showroom -->
        <table>
          <tr>
            <th style="width:25%">Particulars</th>
            <th style="width:8%">HSN CODE</th>
            <th style="width:8%">Unit Cost</th>
            <th style="width:8%">Taxable</th>
            <th style="width:5%">CGST</th>
            <th style="width:8%">CGST AMOUNT</th>
            <th style="width:5%">SGST</th>
            <th style="width:8%">SGST AMOUNT</th>
            <th style="width:7%">DISCOUNT</th>
            <th style="width:10%">LINE TOTAL</th>
          </tr>
          <tr>
            <td>${exShowroomComponent.header.header_key}</td>
            <td>${exShowroomComponent.header.metadata.hsn_code}</td>
            <td>${unitCost.toFixed(2)}</td>
            <td>${taxableValue.toFixed(2)}</td>
            <td>${(gstRatePercentage / 2).toFixed(2)}%</td>
            <td>${cgstAmount.toFixed(2)}</td>
            <td>${(gstRatePercentage / 2).toFixed(2)}%</td>
            <td>${sgstAmount.toFixed(2)}</td>
            <td>${discount.toFixed(2)}</td>
            <td>${lineTotal.toFixed(2)}</td>
          </tr>
        </table>

        <!-- Grand Total Section -->
        <table class="totals-table">
          <tr>
            <td class="no-border" style="width:80%"><strong>GRAND TOTAL</strong></td>
            <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </table>
        
        <div class="broker-info">
          <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
          <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
        </div>
        
        <div class="note"><strong>Notes:</strong></div>
        <div class="divider"></div>
        <div style="margin-top:2mm;">
          <div><strong>ACC.DETAILS: </strong>
            ${data.accessories
              .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
              .filter((name) => name)
              .join(', ')}
          </div>
        </div>
        <div class="divider"></div>

        <!-- Signature Section -->
        <div class="signature-box">
          <div class="signature-item">
            <div class="signature-line"></div>
            <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  };

  const handlePrintRTOInvoice = () => {
    if (!invoiceData) {
      setError('Please fetch invoice details first');
      return;
    }

    // Check CREATE permission before printing/generating invoice
    if (!canCreateRTOInvoice) {
      showError('You do not have permission to generate RTO Invoice');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateRTOInvoiceHTML(invoiceData));
    printWindow.document.close();
    printWindow.focus();
  };

  // Check if user has permission to view this page
  if (!canViewRTOInvoice) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view RTO Invoice.
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <h4 className="mb-4">RTO Invoice</h4>

      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}

      <div className="p-3">
        <h5>RTO Invoice</h5>
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon className="icon" icon={cilCarAlt} />
          </CInputGroupText>
          <CFormInput
            placeholder="Enter Chassis Number"
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={handleChange}
            disabled={loading}
          />
          {loading && (
            <CInputGroupText>
              <CSpinner size="sm" color="primary" />
            </CInputGroupText>
          )}
        </CInputGroup>

        <div className="d-flex gap-2 flex-wrap">
          {canCreateRTOInvoice ? (
            <CButton 
              className='submit-button' 
              onClick={handlePrintRTOInvoice} 
              disabled={!invoiceData || loading}
              title="Generate RTO Invoice"
            >
              <CIcon icon={cilPrint} className="me-2" />
              RTO Invoice
            </CButton>
          ) : (
            <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
              <CIcon icon={cilPrint} className="me-2" />
              RTO Invoice (No Permission)
            </CButton>
          )}
          <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
            <CIcon icon={cilReload} className="me-2" />
            Clear
          </CButton>
        </div>
      </div>
    </div>
  );
}

export default RtoInvoice;