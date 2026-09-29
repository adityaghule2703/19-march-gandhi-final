import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import '../../../css/form.css';
import { CFormInput, CInputGroup, CInputGroupText, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilPrint, cilReload, cilMoney, cilGift } from '@coreui/icons';
import axiosInstance from '../../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage,
  hasSafePagePermission,
  ACTIONS
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';
import { showError } from '../../../utils/sweetAlerts';

function SubdealerTaxInvoice() {
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
      const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}?bookingType=SUBDEALER`);
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
        
        // Optional: Show a helpful message
        
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
              Registered office: ${data.branch?.address}<br>
              GSTIN: ${data.branch?.gst_number || ''}<br>
              ${data.branch?.name}
            </div>
          </div>
          <div class="header-right">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            <div>Date: ${currentDate}</div>
            
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

export default SubdealerTaxInvoice;