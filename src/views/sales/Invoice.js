
// // import React, { useState, useEffect } from 'react';
// // import '../../css/invoice.css';
// // import '../../css/form.css';
// // import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCarAlt, cilPrint, cilReload } from '@coreui/icons';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   hasSafePagePermission,
// //   ACTIONS
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';

// // function Invoice() {
// //   const [formData, setFormData] = useState({
// //     chassisNumber: '',
// //     amount: ''
// //   });
// //   const [invoiceData, setInvoiceData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [typingTimeout, setTypingTimeout] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for GST Invoice page under Sales module
// //   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
// //   // For printing, we need CREATE permission
// //   const canCreateGSTInvoice = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SALES, 
// //     PAGES.SALES.GST_INVOICE, 
// //     ACTIONS.CREATE
// //   );

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewGSTInvoice) {
// //       showError('You do not have permission to view GST Invoice');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     return () => {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //     };
// //   }, [typingTimeout, canViewGSTInvoice, navigate]);

// //   const fetchInvoiceDetails = async (chassisNumber) => {
// //     if (!chassisNumber) {
// //       setError('Please enter a chassis number');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
// //       if (response.data.success) {
// //         setInvoiceData(response.data.data);
// //       } else {
// //         setError('No booking found for this chassis number');
// //         setInvoiceData(null);
// //       }
// //     } catch (err) {
// //       setError('Failed to fetch invoice details');
// //       setInvoiceData(null);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     if (name === 'chassisNumber') {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //       setTypingTimeout(
// //         setTimeout(() => {
// //           if (value.trim().length > 0) {
// //             fetchInvoiceDetails(value);
// //           } else {
// //             setInvoiceData(null);
// //             setError('');
// //           }
// //         }, 500)
// //       );
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ chassisNumber: '', amount: '' });
// //     setInvoiceData(null);
// //     setError('');
// //   };

// //   const generateInvoiceHTML = (data) => {
// //     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';

// //     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';

// //     const currentDate = new Date().toLocaleDateString('en-GB');
// //     const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
// //     const filteredPriceComponents = data.priceComponents.filter((comp) => {
// //       const headerKey = comp.header.header_key.toUpperCase();

// //       const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES	/i.test(headerKey);
// //       const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //       const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

// //       return !(isInsurance || isRTO || isHypothecation);
// //     });

// //     const priceComponentsWithGST = filteredPriceComponents.map((component) => {
// //       const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;

// //       const unitCost = component.originalValue;
// //       const discount = component.discountedValue < component.originalValue ? component.originalValue - component.discountedValue : 0;
// //       const lineTotal = component.discountedValue;

// //       const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);

// //       const totalGST = lineTotal - taxableValue;
// //       const cgstAmount = totalGST / 2;
// //       const sgstAmount = totalGST / 2;
// //       const gstAmount = cgstAmount + sgstAmount;

// //       return {
// //         ...component,
// //         unitCost,
// //         taxableValue,
// //         cgstAmount,
// //         sgstAmount,
// //         gstAmount,
// //         gstRatePercentage: gstRatePercentage,
// //         discount,
// //         lineTotal
// //       };
// //     });
// //     const findComponentByKeywords = (keywords) => {
// //       return data.priceComponents.find((comp) => {
// //         const headerKey = comp.header.header_key.toUpperCase();
// //         return keywords.some((keyword) => headerKey.includes(keyword));
// //       });
// //     };

// //     const insuranceComponent = findComponentByKeywords([
// //       'INSURANCE',
// //       'INSURCANCE',
// //       'INSURANCE CHARGES',
// //       'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
// //     ]);
// //     const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

// //     // const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
// //     // const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;
// //     const rtoCharges = data.rtoAmount || 0; 

// //     // const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
// //     // const hpCharges = hpComponent ? hpComponent.originalValue : data.hypothecationCharges || 0;

// //     const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
// // const hpCharges = data.hpa && hpComponent ? hpComponent.originalValue : 0;

// // // If hpa is false, hpCharges remains 0

// //     const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
// //     const totalB = insuranceCharges + rtoCharges + hpCharges;
// //     const grandTotal = totalA + totalB;

// //     return `
// //  <!DOCTYPE html>
// // <html>
// // <head>
// //   <title>GST Invoice</title>
// //   <style>
// //     body {
// //       font-family: "Courier New", Courier, monospace;
// //       margin: 0;
// //       padding: 10mm;
// //       font-size: 14px;
// //       color: ##555555;;
// //     }
// //     .page {
// //       width: 210mm;
// //       height: 297mm;
// //       margin: 0 auto;
// //     }
// //     .invoice-title{
// //       text-align:center;
// //       font-size:25px;
// //       font-weight:bold;
// //       }
// //     .header {
// //       display: flex;
// //       justify-content: space-between;
// //       margin-bottom: 2mm;
// //     }
// //     .header-left {
// //       width: 70%;
// //     }
// //     .header-right {
// //       width: 30%;
// //       text-align: right;
// //     }
// //     .logo {
// //       height: 50px;
// //       margin-bottom: 2mm;
// //     }
// //     .dealer-info {
// //       text-align: left;
// //       font-size: 14px;
// //       line-height: 1.2;
// //     }
// //     .rto-type {
// //       text-align: left;
// //       margin: 1mm 0;
// //       font-weight: bold;
// //     }
// //     .customer-info-container {
// //       display: flex;
// //       font-size:14px;
// //     }

// //     .customer-info-left {
// //       width: 50%;
// //     }
// //     .customer-info-right {
// //       width: 50%;
// //     }
// //     .customer-info-row {
// //       margin: 1mm 0;
// //       line-height: 1.2;
// //     }
// //     table {
// //       width: 100%;
// //       border-collapse: collapse;
// //       font-size: 9pt;
// //       margin: 2mm 0;
// //     }
// //     th, td {
// //       padding: 1mm;
// //       border: 1px solid #000;
// //       vertical-align: top;
// //     }
// //     .no-border { 
// //       border: none !important; 
// //       font-size:14px;
// //     }
// //     .text-right { text-align: right; }
// //     .text-center { text-align: center; }
// //     .bold { 
// //     font-weight: bold; 
// //     }
// //     .section-title {
// //       font-weight: bold;
// //       margin: 1mm 0;
// //     }
// //     .signature-box {
// //       margin-top: 5mm;
// //       font-size: 9pt;
// //     }
// //     .signature-line {
// //       border-top: 1px dashed #000;
// //       width: 40mm;
// //       display: inline-block;
// //       margin: 0 5mm;
// //     }
// //     .footer {
// //       font-size: 8pt;
// //       text-align: justify;
// //       line-height: 1.2;
// //       margin-top: 3mm;
// //     }
// //     .divider {
// //       border-top: 2px solid #AAAAAA;
// //     }
// //     .totals-table {
// //       width: 100%;
// //       border-collapse: collapse;
// //       margin: 2mm 0;
// //     }
// //     .totals-table td {
// //       border: none;
// //       padding: 1mm;
// //     }
// //       .total-divider {
// //       border-top: 2px solid #AAAAAA;
// //       height: 1px;
// //       margin: 2px 0;
// //     }
// //     .broker-info{
// //        display:flex;
// //        justify-content:space-between;
// //        padding:1px;
// //     }
// //     .note{
// //        padding:1px
// //        margin:2px;
// //        }
// //     @page {
// //       size: A4;
// //       margin: 0;
// //     }
// //     @media print {
// //       body {
// //         padding: 5mm;
// //       }
// //     }
// //   </style>
// // </head>
// // <body>
// //   <div class="page">
// //     <!-- Header Section -->
// //     <div class="invoice-title">GST Invoice</div>
// //     <div class="header">
// //       <div class="header-left">
// //         <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
// //         <div class="dealer-info">
// //           Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //           Registered office: ${data.branch?.address}
// //           GSTIN: ${data.branch?.gst_number || ''}<br>
// //           ${data.branch?.name}
// //         </div>
// //       </div>
// //       <div class="header-right">
// //         <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
// //         <div>Date: ${currentDate}</div>

// //         ${
// //           data.bookingType === 'SUBDEALER'
// //             ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
// //         <div><b>Address:</b> ${data.subdealer?.location || ''}</div>
          
// //           `
// //             : ''
// //         }
        
// //       </div>
// //     </div>
// //     <div class="divider"></div>
// //     <div class="rto-type">RTO TYPE: ${data.rto}</div>
// //     <div class="divider"></div>

// //     <!-- Customer Information -->
// //     <div class="customer-info-container">
// //       <div class="customer-info-left">
// //         <div class="customer-info-row"><strong>Invoice Number:</strong> ${data.bookingNumber}</div>
// //         <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
// //         <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
// //         <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
// //         <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
// //          <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
// //           <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
// //           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
// //       </div>
// //       <div class="customer-info-right">
// //         <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
// //        <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
// //         <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
// //         <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
// //         <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
// //          <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
// //         <div class="customer-info-row"><strong>Sales Representative Name:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
// //       </div>
// //     </div>
// //     <div class="divider"></div>

// //     <!-- Purchase Details -->
// //     <div class="section-title">Purchase Details:</div>
// //     <table class="no-border">
// //       <tr>
// //         <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
// //          <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>Chasis No:</strong> ${data.chassisNumber}</td>
// //         <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
// //       </tr>
// //        <tr>
// //         <td class="no-border"><strong>Engine No:</strong> ${data.engineNumber}</td>
// //         <td class="no-border"><strong>Key No.:</strong> ${data.keyNumber || '000'}</td>
// //       </tr>
// //     </table>
// //     <!-- Price Breakdown Table -->
// //     <table>
// //       <tr>
// //         <th style="width:25%">Particulars</th>
// //         <th style="width:8%">HSN CODE</th>
// //         <th style="width:8%">Unit Cost</th>
// //         <th style="width:8%">Taxable</th>
// //         <th style="width:5%">CGST</th>
// //         <th style="width:8%">CGST AMOUNT</th>
// //         <th style="width:5%">SGST</th>
// //         <th style="width:8%">SGST AMOUNT</th>
// //         <th style="width:7%">DISCOUNT</th>
// //         <th style="width:10%">LINE TOTAL</th>
// //       </tr>

// //       ${priceComponentsWithGST
// //         .map(
// //           (component) => `
// //         <tr>
// //           <td>${component.header.header_key}</td>
// //           <td>${component.header.metadata.hsn_code}</td>
// //           <td >${component.originalValue.toFixed(2)}</td>
// //           <td >${component.taxableValue.toFixed(2)}</td>
// //           <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// // <td >${component.cgstAmount.toFixed(2)}</td>
// // <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// // <td >${component.sgstAmount.toFixed(2)}</td>
// //           <td >${Math.round(component.discount || '0.00')}</td>
// //           <td >${component.lineTotal.toFixed(2)}</td>
// //         </tr>
// //       `
// //         )
// //         .join('')}
// //     </table>

// //     <!-- Totals Section - No Borders -->
// //      <table class="totals-table">
// //       <tr>
// //         <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
// //         <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
// //         <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
// //         <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>HP CHARGES</strong></td>
// //         <td class="no-border text-right"><strong>${data.hpa ? hpCharges.toFixed(2) : '0.00'}</strong></td>
// //       </tr>
// //       <tr>
// //         <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>TOTAL(B)</strong></td>
// //         <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
// //         <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
// //       </tr>
// //     </table>
// //     <div class="broker-info">
// //       <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
// //       <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
// //     </div>
// //     <div class="note"><strong>Notes:</strong></div>
// //    <div class="divider"></div>
// //    <div style="margin-top:2mm;">
// //   <div><strong>ACC.DETAILS: </strong>
// //     ${data.accessories
// //       .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
// //       .filter((name) => name)
// //       .join(', ')}
// //   </div>
// // </div>
// //     <div class="divider"></div>

// //     <!-- Removed Declarations Section -->

// //     <!-- Signature Section - Adjusted to fit properly -->
// //     <div class="signature-box">
// //       <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
// //         <div style="text-align:center; width: 22%;">
// //           <div class="signature-line"></div>
// //           <div>Customer's Signature</div>
// //         </div>
// //         <div style="text-align:center; width: 22%;">
// //           <div class="signature-line"></div>
// //           <div>Sales Executive</div>
// //         </div>
// //         <div style="text-align:center; width: 22%;">
// //           <div class="signature-line"></div>
// //           <div>Manager</div>
// //         </div>
// //         <div style="text-align:center; width: 22%;">
// //           <div class="signature-line"></div>
// //           <div>Accountant</div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </body>
// // </html>
// //   `;
// //   };

// //   const handlePrint = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to print GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewGSTInvoice) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view GST Invoice.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="invoice-container">
// //       <h4 className="mb-4">Invoice</h4>

// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}

// //       <div className="p-3">
// //         <h5>Customer GST Invoice</h5>
// //         <CInputGroup className="mb-3">
// //           <CInputGroupText>
// //             <CIcon className="icon" icon={cilCarAlt} />
// //           </CInputGroupText>
// //           <CFormInput
// //             placeholder="Enter Chassis Number"
// //             name="chassisNumber"
// //             value={formData.chassisNumber}
// //             onChange={handleChange}
// //             disabled={loading}
// //           />
// //           {loading && (
// //             <CInputGroupText>
// //               <CSpinner size="sm" color="primary" />
// //             </CInputGroupText>
// //           )}
// //         </CInputGroup>

// //         <div className="d-flex gap-2">
// //           {canCreateGSTInvoice ? (
// //             <CButton className='submit-button' onClick={handlePrint} disabled={!invoiceData || loading}>
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print
// //             </CButton>
// //           ) : (
// //             <CButton className='submit-button' disabled={true} title="You don't have permission to print">
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print (No Permission)
// //             </CButton>
// //           )}
// //           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
// //             <CIcon icon={cilReload} className="me-2" />
// //             Clear
// //           </CButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Invoice;





// // import React, { useState, useEffect } from 'react';
// // import '../../css/invoice.css';
// // import '../../css/form.css';
// // import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCarAlt, cilPrint, cilReload } from '@coreui/icons';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   hasSafePagePermission,
// //   ACTIONS
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';

// // function Invoice() {
// //   const [formData, setFormData] = useState({
// //     chassisNumber: '',
// //     amount: ''
// //   });
// //   const [invoiceData, setInvoiceData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [typingTimeout, setTypingTimeout] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for GST Invoice page under Sales module
// //   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
// //   // For printing, we need CREATE permission
// //   const canCreateGSTInvoice = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SALES, 
// //     PAGES.SALES.GST_INVOICE, 
// //     ACTIONS.CREATE
// //   );

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewGSTInvoice) {
// //       showError('You do not have permission to view GST Invoice');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     return () => {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //     };
// //   }, [typingTimeout, canViewGSTInvoice, navigate]);

// //   const fetchInvoiceDetails = async (chassisNumber) => {
// //     if (!chassisNumber) {
// //       setError('Please enter a chassis number');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
// //       if (response.data.success) {
// //         setInvoiceData(response.data.data);
// //       } else {
// //         setError('No booking found for this chassis number');
// //         setInvoiceData(null);
// //       }
// //     } catch (err) {
// //       setError('Failed to fetch invoice details');
// //       setInvoiceData(null);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     if (name === 'chassisNumber') {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //       setTypingTimeout(
// //         setTimeout(() => {
// //           if (value.trim().length > 0) {
// //             fetchInvoiceDetails(value);
// //           } else {
// //             setInvoiceData(null);
// //             setError('');
// //           }
// //         }, 500)
// //       );
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ chassisNumber: '', amount: '' });
// //     setInvoiceData(null);
// //     setError('');
// //   };

// //    const generateInvoiceHTML = (data) => {
// //     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';

// //     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';

// //     const currentDate = new Date().toLocaleDateString('en-GB');
// //     const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
// //     const filteredPriceComponents = data.priceComponents.filter((comp) => {
// //       const headerKey = comp.header.header_key.toUpperCase();

// //       const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES	/i.test(headerKey);
// //       const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //       const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

// //       return !(isInsurance || isRTO || isHypothecation);
// //     });

// //     const priceComponentsWithGST = filteredPriceComponents.map((component) => {
// //       const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;

// //       const unitCost = component.originalValue;
// //       const discount = component.discountedValue < component.originalValue ? component.originalValue - component.discountedValue : 0;
// //       const lineTotal = component.discountedValue;

// //       const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);

// //       const totalGST = lineTotal - taxableValue;
// //       const cgstAmount = totalGST / 2;
// //       const sgstAmount = totalGST / 2;
// //       const gstAmount = cgstAmount + sgstAmount;

// //       return {
// //         ...component,
// //         unitCost,
// //         taxableValue,
// //         cgstAmount,
// //         sgstAmount,
// //         gstAmount,
// //         gstRatePercentage: gstRatePercentage,
// //         discount,
// //         lineTotal
// //       };
// //     });
// //     const findComponentByKeywords = (keywords) => {
// //       return data.priceComponents.find((comp) => {
// //         const headerKey = comp.header.header_key.toUpperCase();
// //         return keywords.some((keyword) => headerKey.includes(keyword));
// //       });
// //     };

// //     const insuranceComponent = findComponentByKeywords([
// //       'INSURANCE',
// //       'INSURCANCE',
// //       'INSURANCE CHARGES',
// //       'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
// //     ]);
// //     const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

// //     // const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
// //     // const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;
// //     const rtoCharges = data.rtoAmount || 0; 

// //     // const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
// //     // const hpCharges = hpComponent ? hpComponent.originalValue : data.hypothecationCharges || 0;

// //     const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
// // const hpCharges = data.hpa && hpComponent ? hpComponent.originalValue : 0;

// // // If hpa is false, hpCharges remains 0

// //     const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
// //     const totalB = insuranceCharges + rtoCharges + hpCharges;
// //     const grandTotal = totalA + totalB;

// //     return `
// //  <!DOCTYPE html>
// // <html>
// // <head>
// //   <title>TAX Invoice</title>
// //   <style>
// //     body {
// //       font-family: "Courier New", Courier, monospace;
// //       margin: 0;
// //       padding: 10mm;
// //       font-size: 14px;
// //       color: ##555555;;
// //     }
// //     .page {
// //       width: 210mm;
// //       height: 297mm;
// //       margin: 0 auto;
// //     }
// //     .invoice-title{
// //       text-align:center;
// //       font-size:25px;
// //       font-weight:bold;
// //       }
// //     .header {
// //       display: flex;
// //       justify-content: space-between;
// //       margin-bottom: 2mm;
// //     }
// //     .header-left {
// //       width: 70%;
// //     }
// //     .header-right {
// //       width: 30%;
// //       text-align: right;
// //     }
// //     .logo {
// //       height: 50px;
// //       margin-bottom: 2mm;
// //     }
// //     .dealer-info {
// //       text-align: left;
// //       font-size: 14px;
// //       line-height: 1.2;
// //     }
// //     .rto-type {
// //       text-align: left;
// //       margin: 1mm 0;
// //       font-weight: bold;
// //     }
// //     .customer-info-container {
// //       display: flex;
// //       font-size:14px;
// //     }

// //     .customer-info-left {
// //       width: 50%;
// //     }
// //     .customer-info-right {
// //       width: 50%;
// //     }
// //     .customer-info-row {
// //       margin: 1mm 0;
// //       line-height: 1.2;
// //     }
// //     table {
// //       width: 100%;
// //       border-collapse: collapse;
// //       font-size: 9pt;
// //       margin: 2mm 0;
// //     }
// //     th, td {
// //       padding: 1mm;
// //       border: 1px solid #000;
// //       vertical-align: top;
// //     }
// //     .no-border { 
// //       border: none !important; 
// //       font-size:14px;
// //     }
// //     .text-right { text-align: right; }
// //     .text-center { text-align: center; }
// //     .bold { 
// //     font-weight: bold; 
// //     }
// //     .section-title {
// //       font-weight: bold;
// //       margin: 1mm 0;
// //     }
// //     .signature-box {
// //       margin-top: 10mm;
// //       display: flex;
// //       justify-content: flex-end;
// //       font-size: 9pt;
// //     }
// //     .signature-line {
// //       border-top: 1px dashed #000;
// //       width: 50mm;
// //       display: inline-block;
// //       margin-bottom: 2px;
// //     }
// //     .signature-item {
// //       text-align: center;
// //       width: 60mm;
// //     }
// //     .footer {
// //       font-size: 8pt;
// //       text-align: justify;
// //       line-height: 1.2;
// //       margin-top: 3mm;
// //     }
// //     .divider {
// //       border-top: 2px solid #AAAAAA;
// //     }
// //     .totals-table {
// //       width: 100%;
// //       border-collapse: collapse;
// //       margin: 2mm 0;
// //     }
// //     .totals-table td {
// //       border: none;
// //       padding: 1mm;
// //     }
// //       .total-divider {
// //       border-top: 2px solid #AAAAAA;
// //       height: 1px;
// //       margin: 2px 0;
// //     }
// //     .broker-info{
// //        display:flex;
// //        justify-content:space-between;
// //        padding:1px;
// //     }
// //     .note{
// //        padding:1px
// //        margin:2px;
// //        }
// //     @page {
// //       size: A4;
// //       margin: 0;
// //     }
// //     @media print {
// //       body {
// //         padding: 5mm;
// //       }
// //     }
// //   </style>
// // </head>
// // <body>
// //   <div class="page">
// //     <!-- Header Section -->
// //     <div class="invoice-title">TAX Invoice</div>
// //     <div class="header">
// //       <div class="header-left">
// //         <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
// //         <div class="dealer-info">
// //           Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //           Registered office: ${data.branch?.address}
// //           GSTIN: ${data.branch?.gst_number || ''}<br>
// //           ${data.branch?.name}
// //         </div>
// //       </div>
// //       <div class="header-right">
// //         <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
// //         <div>Date: ${currentDate}</div>

// //         ${
// //           data.bookingType === 'SUBDEALER'
// //             ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
// //         <div><b>Address:</b> ${data.subdealer?.location || ''}</div>
          
// //           `
// //             : ''
// //         }
        
// //       </div>
// //     </div>
// //     <div class="divider"></div>
// //     <div class="rto-type">RTO TYPE: ${data.rto}</div>
// //     <div class="divider"></div>

// //     <!-- Customer Information -->
// //     <div class="customer-info-container">
// //       <div class="customer-info-left">
// //         <div class="customer-info-row"><strong>Invoice Number:</strong> ${data.bookingNumber}</div>
// //         <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
// //         <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
// //         <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
// //         <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
// //          <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
// //           <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
// //           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
// //       </div>
// //       <div class="customer-info-right">
// //         <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
// //        <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
// //         <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
// //         <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
// //         <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
// //          <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
// //         <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
// //       </div>
// //     </div>
// //     <div class="divider"></div>

// //     <!-- Purchase Details -->
// //     <div class="section-title">Purchase Details:</div>
// //     <table class="no-border">
// //       <tr>
// //         <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
// //          <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>Chasis No:${data.chassisNumber}</strong> </td>
// //         <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
// //       </tr>
// //        <tr>
// //         <td class="no-border"><strong>Engine No:</strong> ${data.engineNumber}</td>
// //         <td class="no-border"><strong>Key No.:</strong> ${data.keyNumber || '000'}</td>
// //       </tr>
// //     </table>
// //     <!-- Price Breakdown Table -->
// //     <table>
// //       <tr>
// //         <th style="width:25%">Particulars</th>
// //         <th style="width:8%">HSN CODE</th>
// //         <th style="width:8%">Unit Cost</th>
// //         <th style="width:8%">Taxable</th>
// //         <th style="width:5%">CGST</th>
// //         <th style="width:8%">CGST AMOUNT</th>
// //         <th style="width:5%">SGST</th>
// //         <th style="width:8%">SGST AMOUNT</th>
// //         <th style="width:7%">DISCOUNT</th>
// //         <th style="width:10%">LINE TOTAL</th>
// //       </tr>

// //       ${priceComponentsWithGST
// //         .map(
// //           (component) => `
// //         <tr>
// //           <td>${component.header.header_key}</td>
// //           <td>${component.header.metadata.hsn_code}</td>
// //           <td >${component.originalValue.toFixed(2)}</td>
// //           <td >${component.taxableValue.toFixed(2)}</td>
// //           <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// // <td >${component.cgstAmount.toFixed(2)}</td>
// // <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// // <td >${component.sgstAmount.toFixed(2)}</td>
// //           <td >${Math.round(component.discount || '0.00')}</td>
// //           <td >${component.lineTotal.toFixed(2)}</td>
// //         </tr>
// //       `
// //         )
// //         .join('')}
// //     </table>

// //     <!-- Totals Section - No Borders -->
// //      <table class="totals-table">
// //       <tr>
// //         <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
// //         <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
// //         <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
// //         <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>HP CHARGES</strong></td>
// //         <td class="no-border text-right"><strong>${data.hpa ? hpCharges.toFixed(2) : '0.00'}</strong></td>
// //       </tr>
// //       <tr>
// //         <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>TOTAL(B)</strong></td>
// //         <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
// //       </tr>
// //       <tr>
// //         <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
// //         <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
// //       </tr>
// //     </table>
// //     <div class="broker-info">
// //       <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
// //       <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
// //     </div>
// //     <div class="note"><strong>Notes:</strong></div>
// //    <div class="divider"></div>
// //    <div style="margin-top:2mm;">
// //   <div><strong>ACC.DETAILS: </strong>
// //     ${data.accessories
// //       .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
// //       .filter((name) => name)
// //       .join(', ')}
// //   </div>
// // </div>
// //     <div class="divider"></div>

// //     <!-- Signature Section - Updated with single authorized signatory -->
// //     <div class="signature-box">
// //       <div class="signature-item">
// //         <div class="signature-line"></div>
// //         <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
// //       </div>
// //     </div>
// //   </div>
// // </body>
// // </html>
// //   `;
// //   };

// //   const handlePrint = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to print GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewGSTInvoice) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view GST Invoice.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="invoice-container">
// //       <h4 className="mb-4">Invoice</h4>

// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}

// //       <div className="p-3">
// //         <h5>Customer TAX Invoice</h5>
// //         <CInputGroup className="mb-3">
// //           <CInputGroupText>
// //             <CIcon className="icon" icon={cilCarAlt} />
// //           </CInputGroupText>
// //           <CFormInput
// //             placeholder="Enter Chassis Number"
// //             name="chassisNumber"
// //             value={formData.chassisNumber}
// //             onChange={handleChange}
// //             disabled={loading}
// //           />
// //           {loading && (
// //             <CInputGroupText>
// //               <CSpinner size="sm" color="primary" />
// //             </CInputGroupText>
// //           )}
// //         </CInputGroup>

// //         <div className="d-flex gap-2">
// //           {canCreateGSTInvoice ? (
// //             <CButton className='submit-button' onClick={handlePrint} disabled={!invoiceData || loading}>
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print
// //             </CButton>
// //           ) : (
// //             <CButton className='submit-button' disabled={true} title="You don't have permission to print">
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print (No Permission)
// //             </CButton>
// //           )}
// //           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
// //             <CIcon icon={cilReload} className="me-2" />
// //             Clear
// //           </CButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Invoice;




// // import React, { useState, useEffect } from 'react';
// // import '../../css/invoice.css';
// // import '../../css/form.css';
// // import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCarAlt, cilPrint, cilReload } from '@coreui/icons';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   hasSafePagePermission,
// //   ACTIONS
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';

// // function Invoice() {
// //   const [formData, setFormData] = useState({
// //     chassisNumber: '',
// //     amount: ''
// //   });
// //   const [invoiceData, setInvoiceData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [typingTimeout, setTypingTimeout] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for GST Invoice page under Sales module
// //   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
// //   // For printing, we need CREATE permission
// //   const canCreateGSTInvoice = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SALES, 
// //     PAGES.SALES.GST_INVOICE, 
// //     ACTIONS.CREATE
// //   );

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewGSTInvoice) {
// //       showError('You do not have permission to view GST Invoice');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     return () => {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //     };
// //   }, [typingTimeout, canViewGSTInvoice, navigate]);

// //   const fetchInvoiceDetails = async (chassisNumber) => {
// //     if (!chassisNumber) {
// //       setError('Please enter a chassis number');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
// //       if (response.data.success) {
// //         setInvoiceData(response.data.data);
// //       } else {
// //         setError('No booking found for this chassis number');
// //         setInvoiceData(null);
// //       }
// //     } catch (err) {
// //       setError('Failed to fetch invoice details');
// //       setInvoiceData(null);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     if (name === 'chassisNumber') {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //       setTypingTimeout(
// //         setTimeout(() => {
// //           if (value.trim().length > 0) {
// //             fetchInvoiceDetails(value);
// //           } else {
// //             setInvoiceData(null);
// //             setError('');
// //           }
// //         }, 500)
// //       );
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ chassisNumber: '', amount: '' });
// //     setInvoiceData(null);
// //     setError('');
// //   };

// //   const generateInvoiceHTML = (data) => {
// //   const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
// //   const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
// //   const currentDate = new Date().toLocaleDateString('en-GB');
// //   const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
  
// //   // Get subsidy amount directly from the data (from API response)
// //   const subsidyAmount = data.subsidyAmount || 0;
  
// //   // Find the ex-showroom component to identify it for special handling
// //   let exShowroomComponent = null;
// //   data.priceComponents.forEach(comp => {
// //     const headerKey = comp.header.header_key.toUpperCase();
// //     if (headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM')) {
// //       exShowroomComponent = comp;
// //     }
// //   });

// //   // Filter out insurance, RTO, hypothecation components
// //   const filteredPriceComponents = data.priceComponents.filter((comp) => {
// //     const headerKey = comp.header.header_key.toUpperCase();
    
// //     const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
// //     const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //     const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA \(IF APPLICABLE\)|HYPOTHECATION CHARGES \(IF APPLICABLE\)/i.test(headerKey);
    
// //     return !(isInsurance || isRTO || isHypothecation);
// //   });

// //   const priceComponentsWithGST = filteredPriceComponents.map((component) => {
// //     const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;
    
// //     const unitCost = component.originalValue;
    
// //     // Calculate discount - for ex-showroom, we set discount to 0 since subsidy is handled separately
// //     // For other components, calculate actual discount if any
// //     let discount = 0;
// //     if (component === exShowroomComponent) {
// //       // Don't show subsidy as discount
// //       discount = 0;
// //     } else {
// //       discount = component.discountedValue < component.originalValue ? 
// //                  component.originalValue - component.discountedValue : 0;
// //     }
    
// //     const lineTotal = component.discountedValue;
    
// //     const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
    
// //     const totalGST = lineTotal - taxableValue;
// //     const cgstAmount = totalGST / 2;
// //     const sgstAmount = totalGST / 2;
    
// //     return {
// //       ...component,
// //       unitCost,
// //       taxableValue,
// //       cgstAmount,
// //       sgstAmount,
// //       gstRatePercentage,
// //       discount,
// //       lineTotal,
// //       isExShowroom: component === exShowroomComponent
// //     };
// //   });
  
// //   const findComponentByKeywords = (keywords) => {
// //     return data.priceComponents.find((comp) => {
// //       const headerKey = comp.header.header_key.toUpperCase();
// //       return keywords.some((keyword) => headerKey.includes(keyword));
// //     });
// //   };
  
// //   const insuranceComponent = findComponentByKeywords([
// //     'INSURANCE',
// //     'INSURCANCE',
// //     'INSURANCE CHARGES',
// //     'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
// //   ]);
// //   const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;
  
// //   const rtoCharges = data.rtoAmount || 0; 
  
// //   const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
// //   const hpCharges = data.hpa && hpComponent ? hpComponent.originalValue : 0;
  
// //   const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
// //   const totalB = insuranceCharges + rtoCharges + hpCharges;
  
// //   // Grand total calculation (subsidy is already applied in discountedValue)
// //   const grandTotal = totalA + totalB;

// //   return `
// //   <!DOCTYPE html>
// //   <html>
// //   <head>
// //     <title>TAX Invoice</title>
// //     <style>
// //       body {
// //         font-family: "Courier New", Courier, monospace;
// //         margin: 0;
// //         padding: 10mm;
// //         font-size: 14px;
// //         color: #555555;
// //       }
// //       .page {
// //         width: 210mm;
// //         height: 297mm;
// //         margin: 0 auto;
// //       }
// //       .invoice-title{
// //         text-align:center;
// //         font-size:25px;
// //         font-weight:bold;
// //       }
// //       .header {
// //         display: flex;
// //         justify-content: space-between;
// //         margin-bottom: 2mm;
// //       }
// //       .header-left {
// //         width: 70%;
// //       }
// //       .header-right {
// //         width: 30%;
// //         text-align: right;
// //       }
// //       .logo {
// //         height: 50px;
// //         margin-bottom: 2mm;
// //       }
// //       .dealer-info {
// //         text-align: left;
// //         font-size: 14px;
// //         line-height: 1.2;
// //       }
// //       .rto-type {
// //         text-align: left;
// //         margin: 1mm 0;
// //         font-weight: bold;
// //       }
// //       .customer-info-container {
// //         display: flex;
// //         font-size:14px;
// //       }
// //       .customer-info-left {
// //         width: 50%;
// //       }
// //       .customer-info-right {
// //         width: 50%;
// //       }
// //       .customer-info-row {
// //         margin: 1mm 0;
// //         line-height: 1.2;
// //       }
// //       table {
// //         width: 100%;
// //         border-collapse: collapse;
// //         font-size: 9pt;
// //         margin: 2mm 0;
// //       }
// //       th, td {
// //         padding: 1mm;
// //         border: 1px solid #000;
// //         vertical-align: top;
// //       }
// //       .no-border { 
// //         border: none !important; 
// //         font-size:14px;
// //       }
// //       .text-right { text-align: right; }
// //       .text-center { text-align: center; }
// //       .bold { 
// //         font-weight: bold; 
// //       }
// //       .section-title {
// //         font-weight: bold;
// //         margin: 1mm 0;
// //       }
// //       .signature-box {
// //         margin-top: 10mm;
// //         display: flex;
// //         justify-content: flex-end;
// //         font-size: 9pt;
// //       }
// //       .signature-line {
// //         border-top: 1px dashed #000;
// //         width: 50mm;
// //         display: inline-block;
// //         margin-bottom: 2px;
// //       }
// //       .signature-item {
// //         text-align: center;
// //         width: 60mm;
// //       }
// //       .footer {
// //         font-size: 8pt;
// //         text-align: justify;
// //         line-height: 1.2;
// //         margin-top: 3mm;
// //       }
// //       .divider {
// //         border-top: 2px solid #AAAAAA;
// //       }
// //       .totals-table {
// //         width: 100%;
// //         border-collapse: collapse;
// //         margin: 2mm 0;
// //       }
// //       .totals-table td {
// //         border: none;
// //         padding: 1mm;
// //       }
// //       .total-divider {
// //         border-top: 2px solid #AAAAAA;
// //         height: 1px;
// //         margin: 2px 0;
// //       }
// //       .broker-info{
// //         display:flex;
// //         justify-content:space-between;
// //         padding:1px;
// //       }
// //       .note{
// //         padding:1px
// //         margin:2px;
// //       }
// //       .subsidy-row {
// //         color: #28a745;
// //         font-weight: bold;
// //       }
// //       @page {
// //         size: A4;
// //         margin: 0;
// //       }
// //       @media print {
// //         body {
// //           padding: 5mm;
// //         }
// //       }
// //     </style>
// //   </head>
// //   <body>
// //     <div class="page">
// //       <!-- Header Section -->
// //       <div class="invoice-title">TAX Invoice</div>
// //       <div class="header">
// //         <div class="header-left">
// //           <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
// //           <div class="dealer-info">
// //             Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //             Registered office: ${data.branch?.address}
// //             GSTIN: ${data.branch?.gst_number || ''}<br>
// //             ${data.branch?.name}
// //           </div>
// //         </div>
// //         <div class="header-right">
// //           <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
// //           <div>Date: ${currentDate}</div>
// //           ${
// //             data.bookingType === 'SUBDEALER'
// //               ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
// //                  <div><b>Address:</b> ${data.subdealer?.location || ''}</div>`
// //               : ''
// //           }
// //         </div>
// //       </div>
// //       <div class="divider"></div>
// //       <div class="rto-type">RTO TYPE: ${data.rto}</div>
// //       <div class="divider"></div>

// //       <!-- Customer Information -->
// //       <div class="customer-info-container">
// //         <div class="customer-info-left">
// //           <div class="customer-info-row"><strong>Invoice Number:</strong> ${data.bookingNumber}</div>
// //           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
// //           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
// //           <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
// //           <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
// //           <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
// //           <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
// //           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
// //         </div>
// //         <div class="customer-info-right">
// //           <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
// //           <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
// //           <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
// //           <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
// //           <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
// //           <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
// //           <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
// //         </div>
// //       </div>
// //       <div class="divider"></div>

// //       <!-- Purchase Details -->
// //       <div class="section-title">Purchase Details:</div>
// //       <table class="no-border">
// //         <tr>
// //           <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
// //           <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>Chasis No:${data.chassisNumber}</strong> </td>
// //           <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>Engine No:</strong> ${data.engineNumber}</td>
// //           <td class="no-border"><strong>Key No.:</strong> ${data.keyNumber || '000'}</td>
// //         </tr>
// //       </table>
      
// //       <!-- Price Breakdown Table -->
// //       <table>
// //         <tr>
// //           <th style="width:25%">Particulars</th>
// //           <th style="width:8%">HSN CODE</th>
// //           <th style="width:8%">Unit Cost</th>
// //           <th style="width:8%">Taxable</th>
// //           <th style="width:5%">CGST</th>
// //           <th style="width:8%">CGST AMOUNT</th>
// //           <th style="width:5%">SGST</th>
// //           <th style="width:8%">SGST AMOUNT</th>
// //           <th style="width:7%">DISCOUNT</th>
// //           <th style="width:10%">LINE TOTAL</th>
// //         </tr>

// //         ${priceComponentsWithGST
// //           .map(
// //             (component) => `
// //           <tr>
// //             <td>${component.header.header_key}</td>
// //             <td>${component.header.metadata.hsn_code}</td>
// //             <td>${component.originalValue.toFixed(2)}</td>
// //             <td>${component.taxableValue.toFixed(2)}</td>
// //             <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //             <td>${component.cgstAmount.toFixed(2)}</td>
// //             <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //             <td>${component.sgstAmount.toFixed(2)}</td>
// //             <td>${component.isExShowroom ? '0' : Math.round(component.discount || 0)}</td>
// //             <td>${component.lineTotal.toFixed(2)}</td>
// //           </tr>
// //         `
// //           )
// //           .join('')}
// //       </table>

// //       <!-- Totals Section -->
// //       <table class="totals-table">
// //         <tr>
// //           <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
// //           <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
// //           <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
// //           <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>HP CHARGES</strong></td>
// //           <td class="no-border text-right"><strong>${data.hpa ? hpCharges.toFixed(2) : '0.00'}</strong></td>
// //         </tr>
        
// //         <!-- Add Subsidy row if applicable -->
// //         ${subsidyAmount > 0 ? `
// //         <tr class="subsidy-row">
// //           <td class="no-border"><strong>EV SUBSIDY / INCENTIVE</strong></td>
// //           <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
// //         </tr>
// //         ` : ''}
        
// //         <tr>
// //           <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>TOTAL(B) [Insurance + RTO + HP]</strong></td>
// //           <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>GRAND TOTAL (A + B)</strong></td>
// //           <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
// //         </tr>
// //       </table>
      
// //       <div class="broker-info">
// //         <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
// //         <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
// //       </div>
      
// //       <div class="note"><strong>Notes:</strong></div>
// //       <div class="divider"></div>
// //       <div style="margin-top:2mm;">
// //         <div><strong>ACC.DETAILS: </strong>
// //           ${data.accessories
// //             .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
// //             .filter((name) => name)
// //             .join(', ')}
// //         </div>
// //       </div>
// //       <div class="divider"></div>

// //       <!-- Signature Section -->
// //       <div class="signature-box">
// //         <div class="signature-item">
// //           <div class="signature-line"></div>
// //           <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
// //         </div>
// //       </div>
// //     </div>
// //   </body>
// //   </html>
// //   `;
// // };

// //   const handlePrint = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to print GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewGSTInvoice) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view GST Invoice.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="invoice-container">
// //       <h4 className="mb-4">Invoice</h4>

// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}

// //       <div className="p-3">
// //         <h5>Customer TAX Invoice</h5>
// //         <CInputGroup className="mb-3">
// //           <CInputGroupText>
// //             <CIcon className="icon" icon={cilCarAlt} />
// //           </CInputGroupText>
// //           <CFormInput
// //             placeholder="Enter Chassis Number"
// //             name="chassisNumber"
// //             value={formData.chassisNumber}
// //             onChange={handleChange}
// //             disabled={loading}
// //           />
// //           {loading && (
// //             <CInputGroupText>
// //               <CSpinner size="sm" color="primary" />
// //             </CInputGroupText>
// //           )}
// //         </CInputGroup>

// //         <div className="d-flex gap-2">
// //           {canCreateGSTInvoice ? (
// //             <CButton className='submit-button' onClick={handlePrint} disabled={!invoiceData || loading}>
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print
// //             </CButton>
// //           ) : (
// //             <CButton className='submit-button' disabled={true} title="You don't have permission to print">
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print (No Permission)
// //             </CButton>
// //           )}
// //           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
// //             <CIcon icon={cilReload} className="me-2" />
// //             Clear
// //           </CButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Invoice;





// // import React, { useState, useEffect } from 'react';
// // import '../../css/invoice.css';
// // import '../../css/form.css';
// // import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCarAlt, cilPrint, cilReload } from '@coreui/icons';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   hasSafePagePermission,
// //   ACTIONS
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';

// // function Invoice() {
// //   const [formData, setFormData] = useState({
// //     chassisNumber: '',
// //     amount: ''
// //   });
// //   const [invoiceData, setInvoiceData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [typingTimeout, setTypingTimeout] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for GST Invoice page under Sales module
// //   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
// //   // For printing, we need CREATE permission
// //   const canCreateGSTInvoice = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SALES, 
// //     PAGES.SALES.GST_INVOICE, 
// //     ACTIONS.CREATE
// //   );

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewGSTInvoice) {
// //       showError('You do not have permission to view GST Invoice');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     return () => {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //     };
// //   }, [typingTimeout, canViewGSTInvoice, navigate]);

// //   const fetchInvoiceDetails = async (chassisNumber) => {
// //     if (!chassisNumber) {
// //       setError('Please enter a chassis number');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
// //       if (response.data.success) {
// //         setInvoiceData(response.data.data);
// //       } else {
// //         setError('No booking found for this chassis number');
// //         setInvoiceData(null);
// //       }
// //     } catch (err) {
// //       setError('Failed to fetch invoice details');
// //       setInvoiceData(null);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     if (name === 'chassisNumber') {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //       setTypingTimeout(
// //         setTimeout(() => {
// //           if (value.trim().length > 0) {
// //             fetchInvoiceDetails(value);
// //           } else {
// //             setInvoiceData(null);
// //             setError('');
// //           }
// //         }, 500)
// //       );
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ chassisNumber: '', amount: '' });
// //     setInvoiceData(null);
// //     setError('');
// //   };

// //  const generateInvoiceHTML = (data) => {
// //   const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
// //   const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
// //   const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
// //   const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
  
// //   // Get subsidy amount directly from the data (from API response)
// //   const subsidyAmount = data.subsidyAmount || 0;
  
// //   // Find the ex-showroom component to identify it for special handling
// //   let exShowroomComponent = null;
// //   data.priceComponents.forEach(comp => {
// //     const headerKey = comp.header.header_key.toUpperCase();
// //     if (headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM')) {
// //       exShowroomComponent = comp;
// //     }
// //   });

// //   // Filter out insurance, RTO, hypothecation components
// //   const filteredPriceComponents = data.priceComponents.filter((comp) => {
// //     const headerKey = comp.header.header_key.toUpperCase();
    
// //     const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
// //     const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //     const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA \(IF APPLICABLE\)|HYPOTHECATION CHARGES \(IF APPLICABLE\)/i.test(headerKey);
    
// //     return !(isInsurance || isRTO || isHypothecation);
// //   });

// //   const priceComponentsWithGST = filteredPriceComponents.map((component) => {
// //     const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;
    
// //     const unitCost = component.originalValue;
    
// //     // Calculate discount - for ex-showroom, calculate as originalValue - discountedValue + subsidyAmount
// //     // For other components, calculate actual discount if any
// //     let discount = 0;
// //     if (component === exShowroomComponent) {
// //       // For Ex-Showroom: originalValue - discountedValue + subsidyAmount
// //       discount = component.originalValue - component.discountedValue - subsidyAmount;
// //     } else {
// //       discount = component.discountedValue < component.originalValue ? 
// //                  component.originalValue - component.discountedValue : 0;
// //     }
    
// //     const lineTotal = component.discountedValue;
    
// //     const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
    
// //     const totalGST = lineTotal - taxableValue;
// //     const cgstAmount = totalGST / 2;
// //     const sgstAmount = totalGST / 2;
    
// //     return {
// //       ...component,
// //       unitCost,
// //       taxableValue,
// //       cgstAmount,
// //       sgstAmount,
// //       gstRatePercentage,
// //       discount,
// //       lineTotal,
// //       isExShowroom: component === exShowroomComponent
// //     };
// //   });
  
// //   const findComponentByKeywords = (keywords) => {
// //     return data.priceComponents.find((comp) => {
// //       const headerKey = comp.header.header_key.toUpperCase();
// //       return keywords.some((keyword) => headerKey.includes(keyword));
// //     });
// //   };
  
// //   const insuranceComponent = findComponentByKeywords([
// //     'INSURANCE',
// //     'INSURCANCE',
// //     'INSURANCE CHARGES',
// //     'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
// //   ]);
// //   const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;
  
// //   const rtoCharges = data.rtoAmount || 0; 
  
// //   const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
// //   const hpCharges = data.hpa && hpComponent ? hpComponent.originalValue : 0;
  
// //   const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
// //   const totalB = insuranceCharges + rtoCharges + hpCharges;
  
// //   // Grand total calculation (subsidy is already applied in discountedValue)
// //   const grandTotal = totalA + totalB;

// //   return `
// //   <!DOCTYPE html>
// //   <html>
// //   <head>
// //     <title>TAX Invoice</title>
// //     <style>
// //       body {
// //         font-family: "Courier New", Courier, monospace;
// //         margin: 0;
// //         padding: 10mm;
// //         font-size: 14px;
// //         color: #555555;
// //       }
// //       .page {
// //         width: 210mm;
// //         height: 297mm;
// //         margin: 0 auto;
// //       }
// //       .invoice-title{
// //         text-align:center;
// //         font-size:25px;
// //         font-weight:bold;
// //       }
// //       .header {
// //         display: flex;
// //         justify-content: space-between;
// //         margin-bottom: 2mm;
// //       }
// //       .header-left {
// //         width: 70%;
// //       }
// //       .header-right {
// //         width: 30%;
// //         text-align: right;
// //       }
// //       .logo {
// //         height: 50px;
// //         margin-bottom: 2mm;
// //       }
// //       .dealer-info {
// //         text-align: left;
// //         font-size: 14px;
// //         line-height: 1.2;
// //       }
// //       .rto-type {
// //         text-align: left;
// //         margin: 1mm 0;
// //         font-weight: bold;
// //       }
// //       .customer-info-container {
// //         display: flex;
// //         font-size:14px;
// //       }
// //       .customer-info-left {
// //         width: 50%;
// //       }
// //       .customer-info-right {
// //         width: 50%;
// //       }
// //       .customer-info-row {
// //         margin: 1mm 0;
// //         line-height: 1.2;
// //       }
// //       table {
// //         width: 100%;
// //         border-collapse: collapse;
// //         font-size: 9pt;
// //         margin: 2mm 0;
// //       }
// //       th, td {
// //         padding: 1mm;
// //         border: 1px solid #000;
// //         vertical-align: top;
// //       }
// //       .no-border { 
// //         border: none !important; 
// //         font-size:14px;
// //       }
// //       .text-right { text-align: right; }
// //       .text-center { text-align: center; }
// //       .bold { 
// //         font-weight: bold; 
// //       }
// //       .section-title {
// //         font-weight: bold;
// //         margin: 1mm 0;
// //       }
// //       .signature-box {
// //         margin-top: 10mm;
// //         display: flex;
// //         justify-content: flex-end;
// //         font-size: 9pt;
// //       }
// //       .signature-line {
// //         border-top: 1px dashed #000;
// //         width: 50mm;
// //         display: inline-block;
// //         margin-bottom: 2px;
// //       }
// //       .signature-item {
// //         text-align: center;
// //         width: 60mm;
// //       }
// //       .footer {
// //         font-size: 8pt;
// //         text-align: justify;
// //         line-height: 1.2;
// //         margin-top: 3mm;
// //       }
// //       .divider {
// //         border-top: 2px solid #AAAAAA;
// //       }
// //       .totals-table {
// //         width: 100%;
// //         border-collapse: collapse;
// //         margin: 2mm 0;
// //       }
// //       .totals-table td {
// //         border: none;
// //         padding: 1mm;
// //       }
// //       .total-divider {
// //         border-top: 2px solid #AAAAAA;
// //         height: 1px;
// //         margin: 2px 0;
// //       }
// //       .broker-info{
// //         display:flex;
// //         justify-content:space-between;
// //         padding:1px;
// //       }
// //       .note{
// //         padding:1px
// //         margin:2px;
// //       }
// //       .subsidy-row {
// //         color: #28a745;
// //         font-weight: bold;
// //       }
// //       @page {
// //         size: A4;
// //         margin: 0;
// //       }
// //       @media print {
// //         body {
// //           padding: 5mm;
// //         }
// //       }
// //     </style>
// //   </head>
// //   <body>
// //     <div class="page">
// //       <!-- Header Section -->
// //       <div class="invoice-title">TAX Invoice</div>
// //       <div class="header">
// //         <div class="header-left">
// //           <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
// //           <div class="dealer-info">
// //             Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //             Registered office: ${data.branch?.address}
// //             GSTIN: ${data.branch?.gst_number || ''}<br>
// //             ${data.branch?.name}
// //           </div>
// //         </div>
// //         <div class="header-right">
// //           <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
// //           <div>Date: ${currentDate}</div>
// //           ${
// //             data.bookingType === 'SUBDEALER'
// //               ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
// //                  <div><b>Address:</b> ${data.subdealer?.location || ''}</div>`
// //               : ''
// //           }
// //         </div>
// //       </div>
// //       <div class="divider"></div>
// //       <div class="rto-type">RTO TYPE: ${data.rto}</div>
// //       <div class="divider"></div>

// //       <!-- Customer Information -->
// //       <div class="customer-info-container">
// //         <div class="customer-info-left">
// //           <div class="customer-info-row"><strong>Invoice Number:</strong> ${data.bookingNumber}</div>
// //           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
// //           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
// //           <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
// //           <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
// //           <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
// //           <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
// //           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
// //         </div>
// //         <div class="customer-info-right">
// //           <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
// //           <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
// //           <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
// //           <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
// //           <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
// //           <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
// //           <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
// //         </div>
// //       </div>
// //       <div class="divider"></div>

// //       <!-- Purchase Details -->
// //       <div class="section-title">Purchase Details:</div>
// //       <table class="no-border">
// //         <tr>
// //           <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
// //           <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>Chasis No:${data.chassisNumber}</strong> </td>
// //           <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>Engine No:</strong> ${data.engineNumber}</td>
// //           <td class="no-border"><strong>Key No.:</strong> ${data.keyNumber || '000'}</td>
// //         </tr>
// //       </table>
      
// //       <!-- Price Breakdown Table -->
// //       <table>
// //         <tr>
// //           <th style="width:25%">Particulars</th>
// //           <th style="width:8%">HSN CODE</th>
// //           <th style="width:8%">Unit Cost</th>
// //           <th style="width:8%">Taxable</th>
// //           <th style="width:5%">CGST</th>
// //           <th style="width:8%">CGST AMOUNT</th>
// //           <th style="width:5%">SGST</th>
// //           <th style="width:8%">SGST AMOUNT</th>
// //           <th style="width:7%">DISCOUNT</th>
// //           <th style="width:10%">LINE TOTAL</th>
// //         </tr>

// //         ${priceComponentsWithGST
// //           .map(
// //             (component) => `
// //           <tr>
// //             <td>${component.header.header_key}</td>
// //             <td>${component.header.metadata.hsn_code}</td>
// //             <td>${component.unitCost.toFixed(2)}</td>
// //             <td>${component.taxableValue.toFixed(2)}</td>
// //             <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //             <td>${component.cgstAmount.toFixed(2)}</td>
// //             <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //             <td>${component.sgstAmount.toFixed(2)}</td>
// //             <td>${component.discount.toFixed(2)}</td>
// //             <td>${component.lineTotal.toFixed(2)}</td>
// //           </tr>
// //         `
// //           )
// //           .join('')}
// //       </table>

// //       <!-- Totals Section -->
// //       <table class="totals-table">
// //         <tr>
// //           <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
// //           <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
// //           <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
// //           <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>HP CHARGES</strong></td>
// //           <td class="no-border text-right"><strong>${data.hpa ? hpCharges.toFixed(2) : '0.00'}</strong></td>
// //         </tr>
        
// //         <!-- Add Subsidy row if applicable -->
// //         ${subsidyAmount > 0 ? `
// //         <tr class="subsidy-row">
// //           <td class="no-border"><strong>EV SUBSIDY / INCENTIVE</strong></td>
// //           <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
// //         </tr>
// //         ` : ''}
        
// //         <tr>
// //           <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>TOTAL(B) [Insurance + RTO + HP]</strong></td>
// //           <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
// //         </tr>
// //         <tr>
// //           <td class="no-border"><strong>GRAND TOTAL (A + B)</strong></td>
// //           <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
// //         </tr>
// //       </table>
      
// //       <div class="broker-info">
// //         <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
// //         <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
// //       </div>
      
// //       <div class="note"><strong>Notes:</strong></div>
// //       <div class="divider"></div>
// //       <div style="margin-top:2mm;">
// //         <div><strong>ACC.DETAILS: </strong>
// //           ${data.accessories
// //             .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
// //             .filter((name) => name)
// //             .join(', ')}
// //         </div>
// //       </div>
// //       <div class="divider"></div>

// //       <!-- Signature Section -->
// //       <div class="signature-box">
// //         <div class="signature-item">
// //           <div class="signature-line"></div>
// //           <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
// //         </div>
// //       </div>
// //     </div>
// //   </body>
// //   </html>
// //   `;
// // };

// //   const handlePrint = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to print GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewGSTInvoice) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view GST Invoice.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="invoice-container">
// //       <h4 className="mb-4">Invoice</h4>

// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}

// //       <div className="p-3">
// //         <h5>Customer TAX Invoice</h5>
// //         <CInputGroup className="mb-3">
// //           <CInputGroupText>
// //             <CIcon className="icon" icon={cilCarAlt} />
// //           </CInputGroupText>
// //           <CFormInput
// //             placeholder="Enter Chassis Number"
// //             name="chassisNumber"
// //             value={formData.chassisNumber}
// //             onChange={handleChange}
// //             disabled={loading}
// //           />
// //           {loading && (
// //             <CInputGroupText>
// //               <CSpinner size="sm" color="primary" />
// //             </CInputGroupText>
// //           )}
// //         </CInputGroup>

// //         <div className="d-flex gap-2">
// //           {canCreateGSTInvoice ? (
// //             <CButton className='submit-button' onClick={handlePrint} disabled={!invoiceData || loading}>
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print
// //             </CButton>
// //           ) : (
// //             <CButton className='submit-button' disabled={true} title="You don't have permission to print">
// //               <CIcon icon={cilPrint} className="me-2" />
// //               Print (No Permission)
// //             </CButton>
// //           )}
// //           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
// //             <CIcon icon={cilReload} className="me-2" />
// //             Clear
// //           </CButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Invoice;







// // import React, { useState, useEffect } from 'react';
// // import '../../css/invoice.css';
// // import '../../css/form.css';
// // import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCarAlt, cilPrint, cilReload, cilMoney, cilGift } from '@coreui/icons';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   hasSafePagePermission,
// //   ACTIONS
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';

// // function Invoice() {
// //   const [formData, setFormData] = useState({
// //     chassisNumber: '',
// //     amount: ''
// //   });
// //   const [invoiceData, setInvoiceData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [typingTimeout, setTypingTimeout] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for GST Invoice page under Sales module
// //   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
// //   // For printing, we need CREATE permission
// //   const canCreateGSTInvoice = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SALES, 
// //     PAGES.SALES.GST_INVOICE, 
// //     ACTIONS.CREATE
// //   );

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewGSTInvoice) {
// //       showError('You do not have permission to view GST Invoice');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     return () => {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //     };
// //   }, [typingTimeout, canViewGSTInvoice, navigate]);

// //   const fetchInvoiceDetails = async (chassisNumber) => {
// //     if (!chassisNumber) {
// //       setError('Please enter a chassis number');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
// //       if (response.data.success) {
// //         setInvoiceData(response.data.data);
// //       } else {
// //         setError('No booking found for this chassis number');
// //         setInvoiceData(null);
// //       }
// //     } catch (err) {
// //       setError('Failed to fetch invoice details');
// //       setInvoiceData(null);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     if (name === 'chassisNumber') {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //       setTypingTimeout(
// //         setTimeout(() => {
// //           if (value.trim().length > 0) {
// //             fetchInvoiceDetails(value);
// //           } else {
// //             setInvoiceData(null);
// //             setError('');
// //           }
// //         }, 500)
// //       );
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ chassisNumber: '', amount: '' });
// //     setInvoiceData(null);
// //     setError('');
// //   };

// //   const generateVehicleInvoiceHTML = (data) => {
// //     // Filter price components - only show those with category_key = "vehicle_price"
// //     const vehiclePriceComponents = data.priceComponents.filter(
// //       (comp) => comp.header.category_key === "vehicle_price"
// //     );
    
// //     return generateInvoiceHTML(data, vehiclePriceComponents, true);
// //   };

// //   const generateAddOnServicesInvoiceHTML = (data) => {
// //     // Filter price components - only show those with category_key = "AddONservices" or "Accesories"
// //     const addOnComponents = data.priceComponents.filter(
// //       (comp) => comp.header.category_key === "AddONservices" || comp.header.category_key === "Accesories"
// //     );
    
// //     return generateInvoiceHTML(data, addOnComponents, false);
// //   };

// //  const generateInvoiceHTML = (data, filteredComponents, showBottomCharges) => {
// //     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
// //     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
// //     const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
// //     const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
// //     // Get subsidy amount directly from the data (from API response)
// //     const subsidyAmount = data.subsidyAmount || 0;
    
// //     // Find the ex-showroom component to identify it for special handling
// //     let exShowroomComponent = null;
// //     filteredComponents.forEach(comp => {
// //       const headerKey = comp.header.header_key.toUpperCase();
// //       if (headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM')) {
// //         exShowroomComponent = comp;
// //       }
// //     });

// //     // Filter out insurance, RTO, hypothecation components from the main table
// //     const priceComponentsWithGST = filteredComponents
// //       .filter((comp) => {
// //         const headerKey = comp.header.header_key.toUpperCase();
        
// //         const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
// //         const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //         const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA \(IF APPLICABLE\)|HYPOTHECATION CHARGES \(IF APPLICABLE\)/i.test(headerKey);
        
// //         return !(isInsurance || isRTO || isHypothecation);
// //       })
// //       .map((component) => {
// //         const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;
        
// //         const unitCost = component.originalValue;
        
// //         // Calculate discount - for ex-showroom, calculate as originalValue - discountedValue + subsidyAmount
// //         // For other components, calculate actual discount if any
// //         let discount = 0;
// //         if (component === exShowroomComponent && showBottomCharges) {
// //           // Only apply subsidy to ex-showroom in vehicle invoice
// //           discount = component.originalValue - component.discountedValue - subsidyAmount;
// //         } else {
// //           discount = component.discountedValue < component.originalValue ? 
// //                      component.originalValue - component.discountedValue : 0;
// //         }
        
// //         const lineTotal = component.discountedValue;
        
// //         const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
        
// //         const totalGST = lineTotal - taxableValue;
// //         const cgstAmount = totalGST / 2;
// //         const sgstAmount = totalGST / 2;
        
// //         return {
// //           ...component,
// //           unitCost,
// //           taxableValue,
// //           cgstAmount,
// //           sgstAmount,
// //           gstRatePercentage,
// //           discount,
// //           lineTotal,
// //           isExShowroom: component === exShowroomComponent
// //         };
// //       });
    
// //     const findComponentByKeywords = (keywords) => {
// //       return data.priceComponents.find((comp) => {
// //         const headerKey = comp.header.header_key.toUpperCase();
// //         return keywords.some((keyword) => headerKey.includes(keyword));
// //       });
// //     };
    
// //     const insuranceComponent = findComponentByKeywords([
// //       'INSURANCE',
// //       'INSURCANCE',
// //       'INSURANCE CHARGES',
// //       'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
// //     ]);
// //     const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;
    
// //     const rtoCharges = data.rtoAmount || 0; 
    
// //     // Only calculate hpCharges if hpa is true
// //     let hpCharges = 0;
// //     if (data.hpa) {
// //       const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
// //       hpCharges = hpComponent ? hpComponent.originalValue : 0;
// //     }
    
// //     const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
    
// //     // Grand total calculation - only include bottom charges if showBottomCharges is true
// //     const grandTotal = showBottomCharges ? totalA + insuranceCharges + rtoCharges + hpCharges : totalA;

// //     // Rest of your HTML template...
// //     return `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //       <title>TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</title>
// //       <style>
// //         /* Your existing styles remain the same */
// //         body {
// //           font-family: "Courier New", Courier, monospace;
// //           margin: 0;
// //           padding: 10mm;
// //           font-size: 14px;
// //           color: #555555;
// //         }
// //         .page {
// //           width: 210mm;
// //           height: 297mm;
// //           margin: 0 auto;
// //         }
// //         .invoice-title{
// //           text-align:center;
// //           font-size:25px;
// //           font-weight:bold;
// //         }
// //         .header {
// //           display: flex;
// //           justify-content: space-between;
// //           margin-bottom: 2mm;
// //         }
// //         .header-left {
// //           width: 70%;
// //         }
// //         .header-right {
// //           width: 30%;
// //           text-align: right;
// //         }
// //         .logo {
// //           height: 50px;
// //           margin-bottom: 2mm;
// //         }
// //         .dealer-info {
// //           text-align: left;
// //           font-size: 14px;
// //           line-height: 1.2;
// //         }
// //         .rto-type {
// //           text-align: left;
// //           margin: 1mm 0;
// //           font-weight: bold;
// //         }
// //         .customer-info-container {
// //           display: flex;
// //           font-size:14px;
// //         }
// //         .customer-info-left {
// //           width: 50%;
// //         }
// //         .customer-info-right {
// //           width: 50%;
// //         }
// //         .customer-info-row {
// //           margin: 1mm 0;
// //           line-height: 1.2;
// //         }
// //         table {
// //           width: 100%;
// //           border-collapse: collapse;
// //           font-size: 9pt;
// //           margin: 2mm 0;
// //         }
// //         th, td {
// //           padding: 1mm;
// //           border: 1px solid #000;
// //           vertical-align: top;
// //         }
// //         .no-border { 
// //           border: none !important; 
// //           font-size:14px;
// //         }
// //         .text-right { text-align: right; }
// //         .text-center { text-align: center; }
// //         .bold { 
// //           font-weight: bold; 
// //         }
// //         .section-title {
// //           font-weight: bold;
// //           margin: 1mm 0;
// //         }
// //         .signature-box {
// //           margin-top: 10mm;
// //           display: flex;
// //           justify-content: flex-end;
// //           font-size: 9pt;
// //         }
// //         .signature-line {
// //           border-top: 1px dashed #000;
// //           width: 50mm;
// //           display: inline-block;
// //           margin-bottom: 2px;
// //         }
// //         .signature-item {
// //           text-align: center;
// //           width: 60mm;
// //         }
// //         .footer {
// //           font-size: 8pt;
// //           text-align: justify;
// //           line-height: 1.2;
// //           margin-top: 3mm;
// //         }
// //         .divider {
// //           border-top: 2px solid #AAAAAA;
// //         }
// //         .totals-table {
// //           width: 100%;
// //           border-collapse: collapse;
// //           margin: 2mm 0;
// //         }
// //         .totals-table td {
// //           border: none;
// //           padding: 1mm;
// //         }
// //         .total-divider {
// //           border-top: 2px solid #AAAAAA;
// //           height: 1px;
// //           margin: 2px 0;
// //         }
// //         .broker-info{
// //           display:flex;
// //           justify-content:space-between;
// //           padding:1px;
// //         }
// //         .note{
// //           padding:1px
// //           margin:2px;
// //         }
// //         .subsidy-row {
// //           color: #28a745;
// //           font-weight: bold;
// //         }
// //         @page {
// //           size: A4;
// //           margin: 0;
// //         }
// //         @media print {
// //           body {
// //             padding: 5mm;
// //           }
// //         }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="page">
// //         <!-- Header Section -->
// //         <div class="invoice-title">TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</div>
// //         <div class="header">
// //           <div class="header-left">
// //             <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
// //             <div class="dealer-info">
// //               Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //               Registered office: ${data.branch?.address}
// //               GSTIN: ${data.branch?.gst_number || ''}<br>
// //               ${data.branch?.name}
// //             </div>
// //           </div>
// //           <div class="header-right">
// //             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
// //             <div>Date: ${currentDate}</div>
// //             ${
// //               data.bookingType === 'SUBDEALER'
// //                 ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
// //                    <div><b>Address:</b> ${data.subdealer?.location || ''}</div>`
// //                 : ''
// //             }
// //           </div>
// //         </div>
// //         <div class="divider"></div>
// //         <div class="rto-type">RTO TYPE: ${data.rto}</div>
// //         <div class="divider"></div>

// //         <!-- Customer Information -->
// //         <div class="customer-info-container">
// //           <div class="customer-info-left">
// //             <div class="customer-info-row"><strong>Invoice Number:</strong> ${data.bookingNumber}</div>
// //             <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
// //             <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
// //             <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
// //             <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
// //             <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
// //             <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
// //             <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
// //           </div>
// //           <div class="customer-info-right">
// //             <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
// //             <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
// //             <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
// //             <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
// //             <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
// //             <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
// //             <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
// //           </div>
// //         </div>
// //         <div class="divider"></div>

// //         <!-- Purchase Details -->
// //         <div class="section-title">Purchase Details:</div>
// //         <table class="no-border">
// //           <tr>
// //             <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
// //             <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
// //           </tr>
// //           <tr>
// //             <td class="no-border"><strong>Chasis No: ${data.chassisNumber}</strong> </td>
// //             <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
// //           </tr>
// //           <tr>
// //             <td class="no-border"><strong>Engine No:</strong> ${data.engineNumber}</td>
// //             <td class="no-border"><strong>Key No.:</strong> ${data.keyNumber || '000'}</td>
// //           </tr>
// //         </table>
        
// //         <!-- Price Breakdown Table -->
// //         <table>
// //           <tr>
// //             <th style="width:25%">Particulars</th>
// //             <th style="width:8%">HSN CODE</th>
// //             <th style="width:8%">Unit Cost</th>
// //             <th style="width:8%">Taxable</th>
// //             <th style="width:5%">CGST</th>
// //             <th style="width:8%">CGST AMOUNT</th>
// //             <th style="width:5%">SGST</th>
// //             <th style="width:8%">SGST AMOUNT</th>
// //             <th style="width:7%">DISCOUNT</th>
// //             <th style="width:10%">LINE TOTAL</th>
// //           </tr>

// //           ${priceComponentsWithGST
// //             .map(
// //               (component) => `
// //             <tr>
// //               <td>${component.header.header_key}</td>
// //               <td>${component.header.metadata.hsn_code}</td>
// //               <td>${component.unitCost.toFixed(2)}</td>
// //               <td>${component.taxableValue.toFixed(2)}</td>
// //               <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //               <td>${component.cgstAmount.toFixed(2)}</td>
// //               <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //               <td>${component.sgstAmount.toFixed(2)}</td>
// //               <td>${component.discount.toFixed(2)}</td>
// //               <td>${component.lineTotal.toFixed(2)}</td>
// //             </tr>
// //           `
// //             )
// //             .join('')}
// //         </table>

// //         <!-- Totals Section -->
// //         <table class="totals-table">
// //           <tr>
// //             <td class="no-border" style="width:80%"><strong>Total</strong></td>
// //             <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
// //           </tr>
// //           <tr>
// //             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //           </tr>
          
// //           ${showBottomCharges ? `
// //           <tr>
// //             <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
// //             <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
// //           </tr>
// //           <tr>
// //             <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
// //             <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
// //           </tr>
// //           ${data.hpa ? `
// //           <tr>
// //             <td class="no-border"><strong>HP CHARGES</strong></td>
// //             <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
// //           </tr>
// //           ` : ''}
          
// //           <!-- Add Subsidy row if applicable -->
// //           ${subsidyAmount > 0 ? `
// //           <tr class="subsidy-row">
// //             <td class="no-border"><strong>EV SUBSIDY / INCENTIVE</strong></td>
// //             <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
// //           </tr>
// //           ` : ''}
          
// //           <tr>
// //             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //           </tr>
// //           ` : ''}
          
// //           <tr>
// //             <td class="no-border"><strong>GRAND TOTAL</strong></td>
// //             <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
// //           </tr>
// //         </table>
        
// //         <div class="broker-info">
// //           <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
// //           <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
// //         </div>
        
// //         <div class="note"><strong>Notes:</strong></div>
// //         <div class="divider"></div>
// //         <div style="margin-top:2mm;">
// //           <div><strong>ACC.DETAILS: </strong>
// //             ${data.accessories
// //               .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
// //               .filter((name) => name)
// //               .join(', ')}
// //           </div>
// //         </div>
// //         <div class="divider"></div>

// //         <!-- Signature Section -->
// //         <div class="signature-box">
// //           <div class="signature-item">
// //             <div class="signature-line"></div>
// //             <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
// //           </div>
// //         </div>
// //       </div>
// //     </body>
// //     </html>
// //     `;
// //   };

// //   const handlePrintVehicleInvoice = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to generate GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateVehicleInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   const handlePrintAddOnServicesInvoice = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to generate GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateAddOnServicesInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewGSTInvoice) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view GST Invoice.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="invoice-container">
// //       <h4 className="mb-4">Invoice</h4>

// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}

// //       <div className="p-3">
// //         <h5>Customer TAX Invoice</h5>
// //         <CInputGroup className="mb-3">
// //           <CInputGroupText>
// //             <CIcon className="icon" icon={cilCarAlt} />
// //           </CInputGroupText>
// //           <CFormInput
// //             placeholder="Enter Chassis Number"
// //             name="chassisNumber"
// //             value={formData.chassisNumber}
// //             onChange={handleChange}
// //             disabled={loading}
// //           />
// //           {loading && (
// //             <CInputGroupText>
// //               <CSpinner size="sm" color="primary" />
// //             </CInputGroupText>
// //           )}
// //         </CInputGroup>

// //         <div className="d-flex gap-2 flex-wrap">
// //           {canCreateGSTInvoice ? (
// //             <>
// //               <CButton 
// //                 className='submit-button' 
// //                 onClick={handlePrintVehicleInvoice} 
// //                 disabled={!invoiceData || loading}
// //                 title="Generate Vehicle Invoice"
// //               >
// //                 <CIcon icon={cilCarAlt} className="me-2" />
// //                 Vehicle Invoice
// //               </CButton>
// //               <CButton 
// //                 className='submit-button' 
// //                 onClick={handlePrintAddOnServicesInvoice} 
// //                 disabled={!invoiceData || loading}
// //                 title="Generate Add-on Services & Accessories Invoice"
// //               >
// //                 <CIcon icon={cilGift} className="me-2" />
// //                 Add-on Services & Accessories
// //               </CButton>
// //             </>
// //           ) : (
// //             <>
// //               <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
// //                 <CIcon icon={cilCarAlt} className="me-2" />
// //                 Vehicle Invoice (No Permission)
// //               </CButton>
// //               <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
// //                 <CIcon icon={cilGift} className="me-2" />
// //                 Add-on Services & Accessories (No Permission)
// //               </CButton>
// //             </>
// //           )}
// //           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
// //             <CIcon icon={cilReload} className="me-2" />
// //             Clear
// //           </CButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Invoice;







// import React, { useState, useEffect } from 'react';
// import '../../css/invoice.css';
// import '../../css/form.css';
// import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilCarAlt, cilPrint, cilReload, cilMoney, cilGift } from '@coreui/icons';
// import axiosInstance from '../../axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   hasSafePagePermission,
//   ACTIONS
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';
// import { showError } from '../../utils/sweetAlerts';

// function Invoice() {
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

//   // Permission checks for GST Invoice page under Sales module
//   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
//   // For printing, we need CREATE permission
//   const canCreateGSTInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.GST_INVOICE, 
//     ACTIONS.CREATE
//   );

//   useEffect(() => {
//     // Check if user has permission to view this page
//     if (!canViewGSTInvoice) {
//       showError('You do not have permission to view GST Invoice');
//       navigate('/dashboard');
//       return;
//     }
    
//     return () => {
//       if (typingTimeout) {
//         clearTimeout(typingTimeout);
//       }
//     };
//   }, [typingTimeout, canViewGSTInvoice, navigate]);

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
//       if (typingTimeout) {
//         clearTimeout(typingTimeout);
//       }
//       setTypingTimeout(
//         setTimeout(() => {
//           if (value.trim().length > 0) {
//             fetchInvoiceDetails(value);
//           } else {
//             setInvoiceData(null);
//             setError('');
//           }
//         }, 500)
//       );
//     }
//   };

//   const handleClear = () => {
//     setFormData({ chassisNumber: '', amount: '' });
//     setInvoiceData(null);
//     setError('');
//   };

//   const generateVehicleInvoiceHTML = (data) => {
//     // Filter price components - only show those with category_key = "vehicle_price"
//     const vehiclePriceComponents = data.priceComponents.filter(
//       (comp) => comp.header.category_key === "vehicle_price"
//     );
    
//     return generateInvoiceHTML(data, vehiclePriceComponents, true);
//   };

//   const generateAddOnServicesInvoiceHTML = (data) => {
//     // Filter price components - only show those with category_key = "AddONservices" or "Accesories"
//     const addOnComponents = data.priceComponents.filter(
//       (comp) => comp.header.category_key === "AddONservices" || comp.header.category_key === "Accesories"
//     );
    
//     return generateInvoiceHTML(data, addOnComponents, false);
//   };

//  const generateInvoiceHTML = (data, filteredComponents, showBottomCharges) => {
//     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
//     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
//     const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
//     const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
//     // Check if vehicle is EV using the type field from model
//     const isEV = data.model?.type === "EV" || false;
    
//     // Get subsidy amount directly from the data (from API response)
//     const subsidyAmount = data.subsidyAmount || 0;
    
//     // Find the ex-showroom component to identify it for special handling
//     let exShowroomComponent = null;
//     filteredComponents.forEach(comp => {
//       const headerKey = comp.header.header_key.toUpperCase();
//       if (headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM')) {
//         exShowroomComponent = comp;
//       }
//     });

//     // Filter out insurance, RTO, hypothecation components from the main table
//     const priceComponentsWithGST = filteredComponents
//       .filter((comp) => {
//         const headerKey = comp.header.header_key.toUpperCase();
        
//         const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
//         const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
//         const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA \(IF APPLICABLE\)|HYPOTHECATION CHARGES \(IF APPLICABLE\)/i.test(headerKey);
        
//         return !(isInsurance || isRTO || isHypothecation);
//       })
//       .map((component) => {
//         const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;
        
//         // For Ex-Showroom component in EV vehicles, use originalValue instead of discountedValue
//         let unitCost;
//         let lineTotal;
//         let discountedValue;
        
//         const isExShowroom = component === exShowroomComponent;
        
//         if (isExShowroom && isEV) {
//           // For EV Ex-Showroom, use original value instead of discounted value
//           unitCost = component.originalValue;
//           lineTotal = component.originalValue;
//           discountedValue = component.originalValue;
//         } else {
//           unitCost = component.originalValue;
//           lineTotal = component.discountedValue;
//           discountedValue = component.discountedValue;
//         }
        
//         // Calculate discount - for ex-showroom in EV, discount should be 0 since we're using original value
//         // For other components, calculate actual discount if any
//         let discount = 0;
//         if (isExShowroom && isEV) {
//           discount = 0; // No discount shown for EV Ex-Showroom
//         } else {
//           discount = component.discountedValue < component.originalValue ? 
//                      component.originalValue - component.discountedValue : 0;
//         }
        
//         const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
        
//         const totalGST = lineTotal - taxableValue;
//         const cgstAmount = totalGST / 2;
//         const sgstAmount = totalGST / 2;
        
//         return {
//           ...component,
//           unitCost,
//           taxableValue,
//           cgstAmount,
//           sgstAmount,
//           gstRatePercentage,
//           discount,
//           lineTotal,
//           isExShowroom,
//           // Store the discounted value for subsidy calculation but use original for display
//           originalDiscountedValue: component.discountedValue
//         };
//       });
    
//     const findComponentByKeywords = (keywords) => {
//       return data.priceComponents.find((comp) => {
//         const headerKey = comp.header.header_key.toUpperCase();
//         return keywords.some((keyword) => headerKey.includes(keyword));
//       });
//     };
    
//     const insuranceComponent = findComponentByKeywords([
//       'INSURANCE',
//       'INSURCANCE',
//       'INSURANCE CHARGES',
//       'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
//     ]);
//     const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;
    
//     const rtoCharges = data.rtoAmount || 0; 
    
//     // Only calculate hpCharges if hpa is true
//     let hpCharges = 0;
//     if (data.hpa) {
//       const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
//       hpCharges = hpComponent ? hpComponent.originalValue : 0;
//     }
    
//     const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
    
//     // Grand total calculation - only include bottom charges if showBottomCharges is true
//     const grandTotal = showBottomCharges ? totalA + insuranceCharges + rtoCharges - subsidyAmount + hpCharges : totalA;

//     // HTML template with increased font sizes and specific bold fields
//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</title>
//       <style>
//         /* Updated styles with increased font sizes */
//         body {
//           font-family: "Courier New", Courier, monospace;
//           margin: 0;
//           padding: 8mm; /* Slightly reduced padding to accommodate larger fonts */
//           font-size: 15px; /* Increased from 14px */
//           color: #555555;
//         }
//         .page {
//           width: 210mm;
//           height: 297mm;
//           margin: 0 auto;
//         }
//         .invoice-title{
//           text-align:center;
//           font-size:26px; /* Increased from 25px */
//           font-weight:bold;
//         }
//         .header {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 3mm; /* Slightly increased */
//         }
//         .header-left {
//           width: 70%;
//         }
//         .header-right {
//           width: 30%;
//           text-align: right;
//         }
//         .logo {
//           height: 55px; /* Slightly reduced from 50px to maintain balance */
//           margin-bottom: 2mm;
//         }
//         .dealer-info {
//           text-align: left;
//           font-size: 15px; /* Increased from 14px */
//           line-height: 1.3; /* Slightly increased */
//         }
//         .rto-type {
//           text-align: left;
//           margin: 2mm 0; /* Increased */
//           font-weight: bold;
//           font-size: 16px; /* Added specific size */
//         }
//         .customer-info-container {
//           display: flex;
//           font-size:15px; /* Increased from 14px */
//           line-height: 1.4; /* Added for better readability */
//         }
//         .customer-info-left {
//           width: 50%;
//         }
//         .customer-info-right {
//           width: 50%;
//         }
//         .customer-info-row {
//           margin: 1.5mm 0; /* Slightly increased */
//           line-height: 1.4;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 10pt; /* Increased from 9pt */
//           margin: 3mm 0; /* Increased */
//         }
//         th, td {
//           padding: 1.5mm; /* Slightly increased */
//           border: 1px solid #000;
//           vertical-align: top;
//         }
//         th {
//           font-size: 10.5pt; /* Slightly larger than td */
//           font-weight: bold;
//         }
//         .no-border { 
//           border: none !important; 
//           font-size:15px; /* Increased from 14px */
//         }
//         .text-right { text-align: right; }
//         .text-center { text-align: center; }
//         .bold, .customer-info-row strong, .section-title strong, .dealer-info strong { 
//           font-weight: bold; 
//         }
//         .section-title {
//           font-weight: bold;
//           margin: 2mm 0; /* Increased */
//           font-size: 16px; /* Added specific size */
//         }
//         .signature-box {
//           margin-top: 12mm; /* Increased */
//           display: flex;
//           justify-content: flex-end;
//           font-size: 10pt; /* Increased from 9pt */
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
//         .footer {
//           font-size: 9pt; /* Increased from 8pt */
//           text-align: justify;
//           line-height: 1.3;
//           margin-top: 4mm; /* Increased */
//         }
//         .divider {
//           border-top: 2px solid #AAAAAA;
//           margin: 2mm 0; /* Added margin */
//         }
//         .totals-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 3mm 0; /* Increased */
//           font-size: 15px; /* Added specific size */
//         }
//         .totals-table td {
//           border: none;
//           padding: 1.5mm; /* Increased */
//         }
//         .total-divider {
//           border-top: 2px solid #AAAAAA;
//           height: 1px;
//           margin: 3px 0; /* Increased */
//         }
//         .broker-info{
//           display:flex;
//           justify-content:space-between;
//           padding:2px;
//           font-size: 15px; /* Added specific size */
//           margin: 2mm 0; /* Added margin */
//         }
//         .note{
//           padding:1px;
//           margin:2px;
//           font-size: 15px; /* Added specific size */
//         }
//         .subsidy-row {
//           color: #28a745;
//           font-weight: bold;
//           font-size: 15px; /* Added specific size */
//         }
        
//         /* Special styling for invoice number to make it bold */
//         .invoice-number-bold {
//           font-weight: bold;
//         }
        
//         /* Make specific fields bold in the purchase details table - only chassis, engine, and key no */
//         .purchase-detail-bold {
//           font-weight: bold;
//         }
        
//         /* Ensure all important fields are bold */
//         .customer-info-row strong {
//           font-weight: bold;
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
//         <div class="invoice-title">TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</div>
//         <div class="header">
//           <div class="header-left">
//             <h2 style="margin:3;font-size:16pt;">GANDHI MOTORS PVT LTD</h2> <!-- Increased from 15pt -->
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
//           <div class="customer-info-right">
//             <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
//             <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
//             <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
//             <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
//             <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
//             <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
//             <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
//           </div>
//         </div>
//         <div class="divider"></div>

//         <!-- Purchase Details with bold values only for engine no, chassis no, key no -->
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
        
//         <!-- Price Breakdown Table -->
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

//           ${priceComponentsWithGST
//             .map(
//               (component) => `
//             <tr>
//               <td>${component.header.header_key}</td>
//               <td>${component.header.metadata.hsn_code}</td>
//               <td>${component.unitCost.toFixed(2)}</td>
//               <td>${component.taxableValue.toFixed(2)}</td>
//               <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
//               <td>${component.cgstAmount.toFixed(2)}</td>
//               <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
//               <td>${component.sgstAmount.toFixed(2)}</td>
//               <td>${component.discount.toFixed(2)}</td>
//               <td>${component.lineTotal.toFixed(2)}</td>
//             </tr>
//           `
//             )
//             .join('')}
//         </table>

//         <!-- Totals Section -->
//         <table class="totals-table">
//           <tr>
//             <td class="no-border" style="width:80%"><strong>Total</strong></td>
//             <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
//           </tr>
//           <tr>
//             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//           </tr>
          
//           ${showBottomCharges ? `
//           <tr>
//             <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
//             <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
//           </tr>
//           <tr>
//             <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
//             <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
//           </tr>
//           ${data.hpa ? `
//           <tr>
//             <td class="no-border"><strong>HP CHARGES</strong></td>
//             <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
//           </tr>
//           ` : ''}
          
//           <!-- Add Subsidy row if applicable -->
//           ${subsidyAmount > 0 ? `
//           <tr class="subsidy-row">
//             <td class="no-border"><strong>EV SUBSIDY</strong></td>
//             <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
//           </tr>
//           ` : ''}
          
//           <tr>
//             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//           </tr>
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

//   const handlePrintVehicleInvoice = () => {
//     if (!invoiceData) {
//       setError('Please fetch invoice details first');
//       return;
//     }

//     // Check CREATE permission before printing
//     if (!canCreateGSTInvoice) {
//       showError('You do not have permission to generate GST Invoice');
//       return;
//     }

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(generateVehicleInvoiceHTML(invoiceData));
//     printWindow.document.close();
//     printWindow.focus();
//   };

//   const handlePrintAddOnServicesInvoice = () => {
//     if (!invoiceData) {
//       setError('Please fetch invoice details first');
//       return;
//     }

//     // Check CREATE permission before printing
//     if (!canCreateGSTInvoice) {
//       showError('You do not have permission to generate GST Invoice');
//       return;
//     }

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(generateAddOnServicesInvoiceHTML(invoiceData));
//     printWindow.document.close();
//     printWindow.focus();
//   };

//   // Check if user has permission to view this page
//   if (!canViewGSTInvoice) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view GST Invoice.
//       </div>
//     );
//   }

//   return (
//     <div className="invoice-container">
//       <h4 className="mb-4">Invoice</h4>

//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}

//       <div className="p-3">
//         <h5>Customer TAX Invoice</h5>
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
//           {canCreateGSTInvoice ? (
//             <>
//               <CButton 
//                 className='submit-button' 
//                 onClick={handlePrintVehicleInvoice} 
//                 disabled={!invoiceData || loading}
//                 title="Generate Vehicle Invoice"
//               >
//                 <CIcon icon={cilCarAlt} className="me-2" />
//                 Vehicle Invoice
//               </CButton>
//               <CButton 
//                 className='submit-button' 
//                 onClick={handlePrintAddOnServicesInvoice} 
//                 disabled={!invoiceData || loading}
//                 title="Generate Add-on Services & Accessories Invoice"
//               >
//                 <CIcon icon={cilGift} className="me-2" />
//                 Add-on Services & Accessories
//               </CButton>
//             </>
//           ) : (
//             <>
//               <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
//                 <CIcon icon={cilCarAlt} className="me-2" />
//                 Vehicle Invoice (No Permission)
//               </CButton>
//               <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
//                 <CIcon icon={cilGift} className="me-2" />
//                 Add-on Services & Accessories (No Permission)
//               </CButton>
//             </>
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

// export default Invoice;







// // import React, { useState, useEffect } from 'react';
// // import '../../css/invoice.css';
// // import '../../css/form.css';
// // import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCarAlt, cilPrint, cilReload, cilMoney, cilGift } from '@coreui/icons';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   hasSafePagePermission,
// //   ACTIONS
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';

// // function Invoice() {
// //   const [formData, setFormData] = useState({
// //     chassisNumber: '',
// //     amount: ''
// //   });
// //   const [invoiceData, setInvoiceData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [typingTimeout, setTypingTimeout] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for GST Invoice page under Sales module
// //   const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
// //   // For printing, we need CREATE permission
// //   const canCreateGSTInvoice = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SALES, 
// //     PAGES.SALES.GST_INVOICE, 
// //     ACTIONS.CREATE
// //   );

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewGSTInvoice) {
// //       showError('You do not have permission to view GST Invoice');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     return () => {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //     };
// //   }, [typingTimeout, canViewGSTInvoice, navigate]);

// //   const fetchInvoiceDetails = async (chassisNumber) => {
// //     if (!chassisNumber) {
// //       setError('Please enter a chassis number');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
// //       if (response.data.success) {
// //         setInvoiceData(response.data.data);
// //       } else {
// //         setError('No booking found for this chassis number');
// //         setInvoiceData(null);
// //       }
// //     } catch (err) {
// //       setError('Failed to fetch invoice details');
// //       setInvoiceData(null);
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     if (name === 'chassisNumber') {
// //       if (typingTimeout) {
// //         clearTimeout(typingTimeout);
// //       }
// //       setTypingTimeout(
// //         setTimeout(() => {
// //           if (value.trim().length > 0) {
// //             fetchInvoiceDetails(value);
// //           } else {
// //             setInvoiceData(null);
// //             setError('');
// //           }
// //         }, 500)
// //       );
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ chassisNumber: '', amount: '' });
// //     setInvoiceData(null);
// //     setError('');
// //   };

// //   const generateVehicleInvoiceHTML = (data) => {
// //     // Filter price components - only show those with category_key = "vehicle_price"
// //     const vehiclePriceComponents = data.priceComponents.filter(
// //       (comp) => comp.header.category_key === "vehicle_price"
// //     );
    
// //     return generateInvoiceHTML(data, vehiclePriceComponents, true);
// //   };

// //   const generateAddOnServicesInvoiceHTML = (data) => {
// //     // Filter price components - only show those with category_key = "AddONservices" or "Accesories"
// //     const addOnComponents = data.priceComponents.filter(
// //       (comp) => comp.header.category_key === "AddONservices" || comp.header.category_key === "Accesories"
// //     );
    
// //     return generateInvoiceHTML(data, addOnComponents, false);
// //   };

// // const generateInvoiceHTML = (data, filteredComponents, showBottomCharges) => {
// //     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
// //     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
// //     const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
// //     const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
// //     // Get subsidy amount directly from the data (from API response)
// //     const subsidyAmount = data.subsidyAmount || 0;
    
// //     // Find the ex-showroom component to identify it for special handling
// //     let exShowroomComponent = null;
// //     filteredComponents.forEach(comp => {
// //       const headerKey = comp.header.header_key.toUpperCase();
// //       if (headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM')) {
// //         exShowroomComponent = comp;
// //       }
// //     });

// //     // Filter out insurance, RTO, hypothecation components from the main table
// //     // This includes both zero-rated insurance AND the new "Insurance: 5 + 5 Years"
// //     const priceComponentsWithGST = filteredComponents
// //       .filter((comp) => {
// //         const headerKey = comp.header.header_key.toUpperCase();
        
// //         // Check if it's any type of insurance component
// //         const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES|INSURANCE:\s*5\s*\+\s*5\s*YEARS/i.test(headerKey);
// //         const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //         const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA \(IF APPLICABLE\)|HYPOTHECATION CHARGES \(IF APPLICABLE\)/i.test(headerKey);
        
// //         // Exclude all insurance, RTO, and hypothecation from main table
// //         return !(isInsurance || isRTO || isHypothecation);
// //       })
// //       .map((component) => {
// //         const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;
        
// //         const unitCost = component.originalValue;
        
// //         // Calculate discount - for ex-showroom, calculate as originalValue - discountedValue + subsidyAmount
// //         // For other components, calculate actual discount if any
// //         let discount = 0;
// //         if (component === exShowroomComponent && showBottomCharges) {
// //           // Only apply subsidy to ex-showroom in vehicle invoice
// //           discount = component.originalValue - component.discountedValue - subsidyAmount;
// //         } else {
// //           discount = component.discountedValue < component.originalValue ? 
// //                      component.originalValue - component.discountedValue : 0;
// //         }
        
// //         const lineTotal = component.discountedValue;
        
// //         const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
        
// //         const totalGST = lineTotal - taxableValue;
// //         const cgstAmount = totalGST / 2;
// //         const sgstAmount = totalGST / 2;
        
// //         return {
// //           ...component,
// //           unitCost,
// //           taxableValue,
// //           cgstAmount,
// //           sgstAmount,
// //           gstRatePercentage,
// //           discount,
// //           lineTotal,
// //           isExShowroom: component === exShowroomComponent
// //         };
// //       });
    
// //     const findComponentByKeywords = (keywords) => {
// //       return data.priceComponents.find((comp) => {
// //         const headerKey = comp.header.header_key.toUpperCase();
// //         return keywords.some((keyword) => headerKey.includes(keyword));
// //       });
// //     };
    
// //     // Find regular insurance components (excluding the 5+5 years one)
// //     const regularInsuranceComponents = data.priceComponents.filter((comp) => {
// //       const headerKey = comp.header.header_key.toUpperCase();
// //       return /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey) && 
// //              !headerKey.includes('5') && !headerKey.includes('+') && !headerKey.includes('YEARS');
// //     });
    
// //     // Find the 5+5 years insurance component specifically
// //     const fivePlusFiveInsuranceComponent = data.priceComponents.find((comp) => {
// //       const headerKey = comp.header.header_key.toUpperCase();
// //       return /INSURANCE:\s*5\s*\+\s*5\s*YEARS/i.test(headerKey);
// //     });
    
// //     // Calculate regular insurance charges
// //     const regularInsuranceCharges = regularInsuranceComponents.reduce((total, comp) => total + comp.originalValue, 0);
    
// //     // Get 5+5 years insurance value if it exists
// //     const fivePlusFiveInsuranceValue = fivePlusFiveInsuranceComponent ? fivePlusFiveInsuranceComponent.originalValue : 0;
    
// //     const rtoCharges = data.rtoAmount || 0; 
    
// //     // Only calculate hpCharges if hpa is true
// //     let hpCharges = 0;
// //     if (data.hpa) {
// //       const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
// //       hpCharges = hpComponent ? hpComponent.originalValue : 0;
// //     }
    
// //     const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
    
// //     // Calculate total of all bottom charges for grand total
// //     // If 5+5 insurance exists, only include that (as it already includes regular insurance)
// //     const totalBottomCharges = fivePlusFiveInsuranceValue > 0 
// //         ? fivePlusFiveInsuranceValue + rtoCharges + hpCharges
// //         : regularInsuranceCharges + rtoCharges + hpCharges;
    
// //     // Grand total calculation - only include bottom charges if showBottomCharges is true
// //     const grandTotal = showBottomCharges ? totalA + totalBottomCharges : totalA;

// //     // Rest of the HTML template with updated bottom charges section
// //     return `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //       <title>TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</title>
// //       <style>
// //         /* All your existing styles remain exactly the same */
// //         body {
// //           font-family: "Courier New", Courier, monospace;
// //           margin: 0;
// //           padding: 8mm;
// //           font-size: 15px;
// //           color: #555555;
// //         }
// //         .page {
// //           width: 210mm;
// //           height: 297mm;
// //           margin: 0 auto;
// //         }
// //         .invoice-title{
// //           text-align:center;
// //           font-size:26px;
// //           font-weight:bold;
// //         }
// //         .header {
// //           display: flex;
// //           justify-content: space-between;
// //           margin-bottom: 3mm;
// //         }
// //         .header-left {
// //           width: 70%;
// //         }
// //         .header-right {
// //           width: 30%;
// //           text-align: right;
// //         }
// //         .logo {
// //           height: 55px;
// //           margin-bottom: 2mm;
// //         }
// //         .dealer-info {
// //           text-align: left;
// //           font-size: 15px;
// //           line-height: 1.3;
// //         }
// //         .rto-type {
// //           text-align: left;
// //           margin: 2mm 0;
// //           font-weight: bold;
// //           font-size: 16px;
// //         }
// //         .customer-info-container {
// //           display: flex;
// //           font-size:15px;
// //           line-height: 1.4;
// //         }
// //         .customer-info-left {
// //           width: 50%;
// //         }
// //         .customer-info-right {
// //           width: 50%;
// //         }
// //         .customer-info-row {
// //           margin: 1.5mm 0;
// //           line-height: 1.4;
// //         }
// //         table {
// //           width: 100%;
// //           border-collapse: collapse;
// //           font-size: 10pt;
// //           margin: 3mm 0;
// //         }
// //         th, td {
// //           padding: 1.5mm;
// //           border: 1px solid #000;
// //           vertical-align: top;
// //         }
// //         th {
// //           font-size: 10.5pt;
// //           font-weight: bold;
// //         }
// //         .no-border { 
// //           border: none !important; 
// //           font-size:15px;
// //         }
// //         .text-right { text-align: right; }
// //         .text-center { text-align: center; }
// //         .bold, .customer-info-row strong, .section-title strong, .dealer-info strong { 
// //           font-weight: bold; 
// //         }
// //         .section-title {
// //           font-weight: bold;
// //           margin: 2mm 0;
// //           font-size: 16px;
// //         }
// //         .signature-box {
// //           margin-top: 12mm;
// //           display: flex;
// //           justify-content: flex-end;
// //           font-size: 10pt;
// //         }
// //         .signature-line {
// //           border-top: 1px dashed #000;
// //           width: 50mm;
// //           display: inline-block;
// //           margin-bottom: 2px;
// //         }
// //         .signature-item {
// //           text-align: center;
// //           width: 60mm;
// //         }
// //         .footer {
// //           font-size: 9pt;
// //           text-align: justify;
// //           line-height: 1.3;
// //           margin-top: 4mm;
// //         }
// //         .divider {
// //           border-top: 2px solid #AAAAAA;
// //           margin: 2mm 0;
// //         }
// //         .totals-table {
// //           width: 100%;
// //           border-collapse: collapse;
// //           margin: 3mm 0;
// //           font-size: 15px;
// //         }
// //         .totals-table td {
// //           border: none;
// //           padding: 1.5mm;
// //         }
// //         .total-divider {
// //           border-top: 2px solid #AAAAAA;
// //           height: 1px;
// //           margin: 3px 0;
// //         }
// //         .broker-info{
// //           display:flex;
// //           justify-content:space-between;
// //           padding:2px;
// //           font-size: 15px;
// //           margin: 2mm 0;
// //         }
// //         .note{
// //           padding:1px;
// //           margin:2px;
// //           font-size: 15px;
// //         }
// //         .subsidy-row {
// //           color: #28a745;
// //           font-weight: bold;
// //           font-size: 15px;
// //         }
        
// //         .invoice-number-bold {
// //           font-weight: bold;
// //         }
        
// //         .purchase-detail-bold {
// //           font-weight: bold;
// //         }
        
// //         .customer-info-row strong {
// //           font-weight: bold;
// //         }
        
// //         @page {
// //           size: A4;
// //           margin: 0;
// //         }
// //         @media print {
// //           body {
// //             padding: 5mm;
// //           }
// //         }
// //       </style>
// //     </head>
// //     <body>
// //       <div class="page">
// //         <!-- Header Section -->
// //         <div class="invoice-title">TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</div>
// //         <div class="header">
// //           <div class="header-left">
// //             <h2 style="margin:3;font-size:16pt;">GANDHI MOTORS PVT LTD</h2>
// //             <div class="dealer-info">
// //               Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //               Registered office: ${data.branch?.address}
// //               GSTIN: ${data.branch?.gst_number || ''}<br>
// //               ${data.branch?.name}
// //             </div>
// //           </div>
// //           <div class="header-right">
// //             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
// //             <div>Date: ${currentDate}</div>
// //             ${
// //               data.bookingType === 'SUBDEALER'
// //                 ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
// //                    <div><b>Address:</b> ${data.subdealer?.location || ''}</div>`
// //                 : ''
// //             }
// //           </div>
// //         </div>
// //         <div class="divider"></div>
// //         <div class="rto-type">RTO TYPE: ${data.rto}</div>
// //         <div class="divider"></div>

// //         <!-- Customer Information -->
// //         <div class="customer-info-container">
// //           <div class="customer-info-left">
// //             <div class="customer-info-row"><strong>Invoice Number:</strong> <span class="invoice-number-bold">${data.bookingNumber}</span></div>
// //             <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
// //             <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
// //             <div class="customer-info-row"><strong>Taluka:</strong> ${data.customerDetails.taluka}</div>
// //             <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
// //             <div class="customer-info-row"><strong>Exchange Mode:</strong> ${data.exchange ? 'YES' : 'NO'}</div>
// //             <div class="customer-info-row"><strong>Aadhar No.:</strong> ${data.customerDetails.aadharNumber}</div>
// //             <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
// //           </div>
// //           <div class="customer-info-right">
// //             <div class="customer-info-row"><strong>GSTIN:</strong> ${data.gstin || ' '}</div>
// //             <div class="customer-info-row"><strong>District:</strong> ${data.customerDetails.district || 'N/A'}</div>
// //             <div class="customer-info-row"><strong>Pincode:</strong> ${data.customerDetails.pincode || 'N/A'}</div>
// //             <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
// //             <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
// //             <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
// //             <div class="customer-info-row"><strong>Sales Representative Name:</strong> <strong>${data.salesExecutive?.name || 'N/A'}</strong></div>
// //           </div>
// //         </div>
// //         <div class="divider"></div>

// //         <!-- Purchase Details with bold values only for engine no, chassis no, key no -->
// //         <div class="section-title">Purchase Details:</div>
// //         <table class="no-border">
// //           <tr>
// //             <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${data.model.model_name}</td>
// //             <td class="no-border"><strong>Battery No:</strong> ${data.batteryNumber || '000'}</td>
// //           </tr>
// //           <tr>
// //             <td class="no-border"><strong>Chasis No:</strong> <span class="purchase-detail-bold">${data.chassisNumber}</span></td>
// //             <td class="no-border"><strong>Colour:</strong> ${data.color?.name || ''}</td>
// //           </tr>
// //           <tr>
// //             <td class="no-border"><strong>Engine No:</strong> <span class="purchase-detail-bold">${data.engineNumber}</span></td>
// //             <td class="no-border"><strong>Key No.:</strong> <span class="purchase-detail-bold">${data.keyNumber || '000'}</span></td>
// //           </tr>
// //         </table>
        
// //         <!-- Price Breakdown Table -->
// //         <table>
// //           <tr>
// //             <th style="width:25%">Particulars</th>
// //             <th style="width:8%">HSN CODE</th>
// //             <th style="width:8%">Unit Cost</th>
// //             <th style="width:8%">Taxable</th>
// //             <th style="width:5%">CGST</th>
// //             <th style="width:8%">CGST AMOUNT</th>
// //             <th style="width:5%">SGST</th>
// //             <th style="width:8%">SGST AMOUNT</th>
// //             <th style="width:7%">DISCOUNT</th>
// //             <th style="width:10%">LINE TOTAL</th>
// //           </tr>

// //           ${priceComponentsWithGST
// //             .map(
// //               (component) => `
// //             <tr>
// //               <td>${component.header.header_key}</td>
// //               <td>${component.header.metadata.hsn_code}</td>
// //               <td>${component.unitCost.toFixed(2)}</td>
// //               <td>${component.taxableValue.toFixed(2)}</td>
// //               <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //               <td>${component.cgstAmount.toFixed(2)}</td>
// //               <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
// //               <td>${component.sgstAmount.toFixed(2)}</td>
// //               <td>${component.discount.toFixed(2)}</td>
// //               <td>${component.lineTotal.toFixed(2)}</td>
// //             </tr>
// //           `
// //             )
// //             .join('')}
// //         </table>

// //         <!-- Totals Section -->
// //         <table class="totals-table">
// //           <tr>
// //             <td class="no-border" style="width:80%"><strong>Total</strong></td>
// //             <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
// //           </tr>
// //           <tr>
// //             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //           </tr>
          
// //           ${showBottomCharges ? `
// //             ${fivePlusFiveInsuranceValue > 0 ? `
// //               <!-- Show only the 5+5 years insurance (which already includes regular insurance) -->
// //               <tr>
// //                 <td class="no-border"><strong>Insurance: 5 + 5 Years</strong></td>
// //                 <td class="no-border text-right"><strong>${fivePlusFiveInsuranceValue.toFixed(2)}</strong></td>
// //               </tr>
// //             ` : `
// //               <!-- Show regular insurance charges only if 5+5 years insurance is not present -->
// //               ${regularInsuranceCharges > 0 ? `
// //               <tr>
// //                 <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
// //                 <td class="no-border text-right"><strong>${regularInsuranceCharges.toFixed(2)}</strong></td>
// //               </tr>
// //               ` : ''}
// //             `}
          
// //           <tr>
// //             <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
// //             <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
// //           </tr>
// //           ${data.hpa ? `
// //           <tr>
// //             <td class="no-border"><strong>HP CHARGES</strong></td>
// //             <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
// //           </tr>
// //           ` : ''}
          
// //           <!-- Add Subsidy row if applicable -->
// //           ${subsidyAmount > 0 ? `
// //           <tr class="subsidy-row">
// //             <td class="no-border"><strong>EV SUBSIDY / INCENTIVE</strong></td>
// //             <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
// //           </tr>
// //           ` : ''}
          
// //           <tr>
// //             <td colspan="2" class="no-border"><div class="total-divider"></div></td>
// //           </tr>
// //           ` : ''}
          
// //           <tr>
// //             <td class="no-border"><strong>GRAND TOTAL</strong></td>
// //             <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
// //           </tr>
// //         </table>
        
// //         <div class="broker-info">
// //           <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
// //           <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
// //         </div>
        
// //         <div class="note"><strong>Notes:</strong></div>
// //         <div class="divider"></div>
// //         <div style="margin-top:2mm;">
// //           <div><strong>ACC.DETAILS: </strong>
// //             ${data.accessories
// //               .map((accessory) => (accessory.accessory ? accessory.accessory.name : ''))
// //               .filter((name) => name)
// //               .join(', ')}
// //           </div>
// //         </div>
// //         <div class="divider"></div>

// //         <!-- Signature Section -->
// //         <div class="signature-box">
// //           <div class="signature-item">
// //             <div class="signature-line"></div>
// //             <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
// //           </div>
// //         </div>
// //       </div>
// //     </body>
// //     </html>
// //     `;
// //   };

// //   const handlePrintVehicleInvoice = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to generate GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateVehicleInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   const handlePrintAddOnServicesInvoice = () => {
// //     if (!invoiceData) {
// //       setError('Please fetch invoice details first');
// //       return;
// //     }

// //     // Check CREATE permission before printing
// //     if (!canCreateGSTInvoice) {
// //       showError('You do not have permission to generate GST Invoice');
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(generateAddOnServicesInvoiceHTML(invoiceData));
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewGSTInvoice) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view GST Invoice.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="invoice-container">
// //       <h4 className="mb-4">Invoice</h4>

// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}

// //       <div className="p-3">
// //         <h5>Customer TAX Invoice</h5>
// //         <CInputGroup className="mb-3">
// //           <CInputGroupText>
// //             <CIcon className="icon" icon={cilCarAlt} />
// //           </CInputGroupText>
// //           <CFormInput
// //             placeholder="Enter Chassis Number"
// //             name="chassisNumber"
// //             value={formData.chassisNumber}
// //             onChange={handleChange}
// //             disabled={loading}
// //           />
// //           {loading && (
// //             <CInputGroupText>
// //               <CSpinner size="sm" color="primary" />
// //             </CInputGroupText>
// //           )}
// //         </CInputGroup>

// //         <div className="d-flex gap-2 flex-wrap">
// //           {canCreateGSTInvoice ? (
// //             <>
// //               <CButton 
// //                 className='submit-button' 
// //                 onClick={handlePrintVehicleInvoice} 
// //                 disabled={!invoiceData || loading}
// //                 title="Generate Vehicle Invoice"
// //               >
// //                 <CIcon icon={cilCarAlt} className="me-2" />
// //                 Vehicle Invoice
// //               </CButton>
// //               <CButton 
// //                 className='submit-button' 
// //                 onClick={handlePrintAddOnServicesInvoice} 
// //                 disabled={!invoiceData || loading}
// //                 title="Generate Add-on Services & Accessories Invoice"
// //               >
// //                 <CIcon icon={cilGift} className="me-2" />
// //                 Add-on Services & Accessories
// //               </CButton>
// //             </>
// //           ) : (
// //             <>
// //               <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
// //                 <CIcon icon={cilCarAlt} className="me-2" />
// //                 Vehicle Invoice (No Permission)
// //               </CButton>
// //               <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
// //                 <CIcon icon={cilGift} className="me-2" />
// //                 Add-on Services & Accessories (No Permission)
// //               </CButton>
// //             </>
// //           )}
// //           <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
// //             <CIcon icon={cilReload} className="me-2" />
// //             Clear
// //           </CButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Invoice;









import React, { useState, useEffect } from 'react';
import '../../css/invoice.css';
import '../../css/form.css';
import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilPrint, cilReload, cilMoney, cilGift } from '@coreui/icons';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage,
  hasSafePagePermission,
  ACTIONS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';
import { showError } from '../../utils/sweetAlerts';

function Invoice() {
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

  // Permission checks for GST Invoice page under Sales module
  const canViewGSTInvoice = canViewPage(permissions, MODULES.SALES, PAGES.SALES.GST_INVOICE);
  
  // For printing, we need CREATE permission
  const canCreateGSTInvoice = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.GST_INVOICE, 
    ACTIONS.CREATE
  );

  useEffect(() => {
    // Check if user has permission to view this page
    if (!canViewGSTInvoice) {
      showError('You do not have permission to view GST Invoice');
      navigate('/dashboard');
      return;
    }
    
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout, canViewGSTInvoice, navigate]);

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
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(
        setTimeout(() => {
          if (value.trim().length > 0) {
            fetchInvoiceDetails(value);
          } else {
            setInvoiceData(null);
            setError('');
          }
        }, 500)
      );
    }
  };

  const handleClear = () => {
    setFormData({ chassisNumber: '', amount: '' });
    setInvoiceData(null);
    setError('');
  };

  const generateVehicleInvoiceHTML = (data) => {
    // Filter price components - only show those with category_key = "vehicle_price"
    const vehiclePriceComponents = data.priceComponents.filter(
      (comp) => comp.header.category_key === "vehicle_price"
    );
    
    return generateInvoiceHTML(data, vehiclePriceComponents, true);
  };

  const generateAddOnServicesInvoiceHTML = (data) => {
    // Filter price components - only show those with category_key = "AddONservices" or "Accesories"
    const addOnComponents = data.priceComponents.filter(
      (comp) => comp.header.category_key === "AddONservices" || comp.header.category_key === "Accesories"
    );
    
    return generateInvoiceHTML(data, addOnComponents, false);
  };

 const generateInvoiceHTML = (data, filteredComponents, showBottomCharges) => {
    const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
    const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';
    const currentDate = data.allocatedDate ? new Date(data.allocatedDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
    const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
    // Check if vehicle is EV using the type field from model
    const isEV = data.model?.type === "EV" || false;
    
    // Get subsidy amount directly from the data (from API response)
    const subsidyAmount = data.subsidyAmount || 0;
    
    // Find the ex-showroom component to identify it for special handling
    let exShowroomComponent = null;
    filteredComponents.forEach(comp => {
      const headerKey = comp.header.header_key.toUpperCase();
      if (headerKey.includes('EX-SHOWROOM') || headerKey.includes('EX SHOWROOM')) {
        exShowroomComponent = comp;
      }
    });

    // Filter out insurance, RTO, hypothecation components from the main table
    const priceComponentsWithGST = filteredComponents
      .filter((comp) => {
        const headerKey = comp.header.header_key.toUpperCase();
        
        const isInsurance = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
        const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
        const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA \(IF APPLICABLE\)|HYPOTHECATION CHARGES \(IF APPLICABLE\)/i.test(headerKey);
        
        return !(isInsurance || isRTO || isHypothecation);
      })
      .map((component) => {
        const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;
        
        // For Ex-Showroom component in EV vehicles, use originalValue instead of discountedValue
        let unitCost;
        let lineTotal;
        let discountedValue;
        
        const isExShowroom = component === exShowroomComponent;
        
        if (isExShowroom && isEV) {
          // For EV Ex-Showroom, use original value instead of discounted value
          unitCost = component.originalValue;
          lineTotal = component.originalValue;
          discountedValue = component.originalValue;
        } else {
          unitCost = component.originalValue;
          lineTotal = component.discountedValue;
          discountedValue = component.discountedValue;
        }
        
        // Calculate discount - for ex-showroom in EV, discount should be 0 since we're using original value
        // For other components, calculate actual discount if any
        let discount = 0;
        if (isExShowroom && isEV) {
          discount = 0; // No discount shown for EV Ex-Showroom
        } else {
          discount = component.discountedValue < component.originalValue ? 
                     component.originalValue - component.discountedValue : 0;
        }
        
        const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);
        
        const totalGST = lineTotal - taxableValue;
        const cgstAmount = totalGST / 2;
        const sgstAmount = totalGST / 2;
        
        return {
          ...component,
          unitCost,
          taxableValue,
          cgstAmount,
          sgstAmount,
          gstRatePercentage,
          discount,
          lineTotal,
          isExShowroom,
          // Store the discounted value for subsidy calculation but use original for display
          originalDiscountedValue: component.discountedValue
        };
      });
    
    const findComponentByKeywords = (keywords) => {
      return data.priceComponents.find((comp) => {
        const headerKey = comp.header.header_key.toUpperCase();
        return keywords.some((keyword) => headerKey.includes(keyword));
      });
    };
    
    const insuranceComponent = findComponentByKeywords([
      'INSURANCE',
      'INSURCANCE',
      'INSURANCE CHARGES',
      'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
    ]);
    const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;
    
    const rtoCharges = data.rtoAmount || 0; 
    
    // Only calculate hpCharges if hpa is true
    let hpCharges = 0;
    if (data.hpa) {
      const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)', 'HP CHARGES']);
      hpCharges = hpComponent ? hpComponent.originalValue : 0;
    }
    
    const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
    
    // Grand total calculation - only include bottom charges if showBottomCharges is true
    const grandTotal = showBottomCharges ? totalA + insuranceCharges + rtoCharges - subsidyAmount + hpCharges : totalA;

    // HTML template with increased font sizes and specific bold fields
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</title>
      <style>
        /* Updated styles with increased font sizes */
        body {
          font-family: "Courier New", Courier, monospace;
          margin: 0;
          padding: 8mm; /* Slightly reduced padding to accommodate larger fonts */
          font-size: 15px; /* Increased from 14px */
          color: #555555;
        }
        .page {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
        }
        .invoice-title{
          text-align:center;
          font-size:26px; /* Increased from 25px */
          font-weight:bold;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3mm; /* Slightly increased */
        }
        .header-left {
          width: 70%;
        }
        .header-right {
          width: 30%;
          text-align: right;
        }
        .logo {
          height: 55px; /* Slightly reduced from 50px to maintain balance */
          margin-bottom: 2mm;
        }
        .dealer-info {
          text-align: left;
          font-size: 15px; /* Increased from 14px */
          line-height: 1.3; /* Slightly increased */
        }
        .rto-type {
          text-align: left;
          margin: 2mm 0; /* Increased */
          font-weight: bold;
          font-size: 16px; /* Added specific size */
        }
        .customer-info-container {
          display: flex;
          font-size:15px; /* Increased from 14px */
          line-height: 1.4; /* Added for better readability */
        }
        .customer-info-left {
          width: 50%;
        }
        .customer-info-right {
          width: 50%;
        }
        .customer-info-row {
          margin: 1.5mm 0; /* Slightly increased */
          line-height: 1.4;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10pt; /* Increased from 9pt */
          margin: 3mm 0; /* Increased */
        }
        th, td {
          padding: 1.5mm; /* Slightly increased */
          border: 1px solid #000;
          vertical-align: top;
        }
        th {
          font-size: 10.5pt; /* Slightly larger than td */
          font-weight: bold;
        }
        .no-border { 
          border: none !important; 
          font-size:15px; /* Increased from 14px */
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold, .customer-info-row strong, .section-title strong, .dealer-info strong { 
          font-weight: bold; 
        }
        .section-title {
          font-weight: bold;
          margin: 2mm 0; /* Increased */
          font-size: 16px; /* Added specific size */
        }
        .signature-box {
          margin-top: 12mm; /* Increased */
          display: flex;
          justify-content: flex-end;
          font-size: 10pt; /* Increased from 9pt */
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
        .footer {
          font-size: 9pt; /* Increased from 8pt */
          text-align: justify;
          line-height: 1.3;
          margin-top: 4mm; /* Increased */
        }
        .divider {
          border-top: 2px solid #AAAAAA;
          margin: 2mm 0; /* Added margin */
        }
        .totals-table {
          width: 100%;
          border-collapse: collapse;
          margin: 3mm 0; /* Increased */
          font-size: 15px; /* Added specific size */
        }
        .totals-table td {
          border: none;
          padding: 1.5mm; /* Increased */
        }
        .total-divider {
          border-top: 2px solid #AAAAAA;
          height: 1px;
          margin: 3px 0; /* Increased */
        }
        .broker-info{
          display:flex;
          justify-content:space-between;
          padding:2px;
          font-size: 15px; /* Added specific size */
          margin: 2mm 0; /* Added margin */
        }
        .note{
          padding:1px;
          margin:2px;
          font-size: 15px; /* Added specific size */
        }
        .subsidy-row {
          color: #28a745;
          font-weight: bold;
          font-size: 15px; /* Added specific size */
        }
        
        /* Special styling for invoice number to make it bold */
        .invoice-number-bold {
          font-weight: bold;
        }
        
        /* Make specific fields bold in the purchase details table - only chassis, engine, and key no */
        .purchase-detail-bold {
          font-weight: bold;
        }
        
        /* Ensure all important fields are bold */
        .customer-info-row strong {
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
        <div class="invoice-title">TAX Invoice - ${showBottomCharges ? 'Vehicle' : 'Add-on Services & Accessories'}</div>
        <div class="header">
          <div class="header-left">
            <h2 style="margin:3;font-size:16pt;">GANDHI MOTORS PVT LTD</h2> <!-- Increased from 15pt -->
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

        <!-- Purchase Details with bold values only for engine no, chassis no, key no -->
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
        
        <!-- Price Breakdown Table -->
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

          ${priceComponentsWithGST
            .map(
              (component) => `
            <tr>
              <td>${component.header.header_key}</td>
              <td>${component.header.metadata.hsn_code}</td>
              <td>${component.unitCost.toFixed(2)}</td>
              <td>${component.taxableValue.toFixed(2)}</td>
              <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
              <td>${component.cgstAmount.toFixed(2)}</td>
              <td>${(component.gstRatePercentage / 2).toFixed(2)}%</td>
              <td>${component.sgstAmount.toFixed(2)}</td>
              <td>${component.discount.toFixed(2)}</td>
              <td>${component.lineTotal.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </table>

        <!-- Totals Section -->
        <table class="totals-table">
          <tr>
            <td class="no-border" style="width:80%"><strong>Total</strong></td>
            <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td colspan="2" class="no-border"><div class="total-divider"></div></td>
          </tr>
          
          ${showBottomCharges ? `
          <tr>
            <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
            <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
            <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
          </tr>
          ${data.hpa ? `
          <tr>
            <td class="no-border"><strong>HP CHARGES</strong></td>
            <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
          </tr>
          ` : ''}
          
          <!-- Add Subsidy row if applicable -->
          ${subsidyAmount > 0 ? `
          <tr class="subsidy-row">
            <td class="no-border"><strong>EV SUBSIDY</strong></td>
            <td class="no-border text-right"><strong>- ${subsidyAmount.toFixed(2)}</strong></td>
          </tr>
          ` : ''}
          
          <tr>
            <td colspan="2" class="no-border"><div class="total-divider"></div></td>
          </tr>
          ` : ''}
          
          <tr>
            <td class="no-border"><strong>GRAND TOTAL</strong></td>
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

  const handlePrintVehicleInvoice = () => {
    if (!invoiceData) {
      setError('Please fetch invoice details first');
      return;
    }

    // Check CREATE permission before printing
    if (!canCreateGSTInvoice) {
      showError('You do not have permission to generate GST Invoice');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateVehicleInvoiceHTML(invoiceData));
    printWindow.document.close();
    printWindow.focus();
  };

  const handlePrintAddOnServicesInvoice = () => {
    if (!invoiceData) {
      setError('Please fetch invoice details first');
      return;
    }

    // Check CREATE permission before printing
    if (!canCreateGSTInvoice) {
      showError('You do not have permission to generate GST Invoice');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateAddOnServicesInvoiceHTML(invoiceData));
    printWindow.document.close();
    printWindow.focus();
  };

  // Check if user has permission to view this page
  if (!canViewGSTInvoice) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view GST Invoice.
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <h4 className="mb-4">Invoice</h4>

      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}

      <div className="p-3">
        <h5>Customer TAX Invoice</h5>
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
          {canCreateGSTInvoice ? (
            <>
              <CButton 
                className='submit-button' 
                onClick={handlePrintVehicleInvoice} 
                disabled={!invoiceData || loading}
                title="Generate Vehicle Invoice"
              >
                <CIcon icon={cilCarAlt} className="me-2" />
                Vehicle Invoice
              </CButton>
              <CButton 
                className='submit-button' 
                onClick={handlePrintAddOnServicesInvoice} 
                disabled={!invoiceData || loading}
                title="Generate Add-on Services & Accessories Invoice"
              >
                <CIcon icon={cilGift} className="me-2" />
                Add-on Services & Accessories
              </CButton>
            </>
          ) : (
            <>
              <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
                <CIcon icon={cilCarAlt} className="me-2" />
                Vehicle Invoice (No Permission)
              </CButton>
              <CButton className='submit-button' disabled={true} title="You don't have permission to generate invoice">
                <CIcon icon={cilGift} className="me-2" />
                Add-on Services & Accessories (No Permission)
              </CButton>
            </>
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

export default Invoice;