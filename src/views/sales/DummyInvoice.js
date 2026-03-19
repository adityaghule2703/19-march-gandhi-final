// import React, { useState, useEffect } from 'react';
// import '../../css/invoice.css';
// import '../../css/form.css';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableBody,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CAlert,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CInputGroup,
//   CInputGroupText,
//   CFormSelect
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPrint, cilSearch, cilCarAlt, cilSave, cilCloudDownload } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import tvsLogo from '../../assets/images/logo1.png';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS 
// } from '../../utils/modulePermissions';

// const DummyInvoice = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Invoice Modal States
//   const [invoiceModal, setInvoiceModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [invoiceItems, setInvoiceItems] = useState([]);
//   const [loadingInvoice, setLoadingInvoice] = useState(false);
//   const [savingInvoice, setSavingInvoice] = useState(false);
//   const [exportingExcel, setExportingExcel] = useState(false);
  
//   // Customer Type for GST calculation
//   const [customerType, setCustomerType] = useState('B2C');

//   const navigate = useNavigate();
//   const { permissions = [] } = useAuth();

//   // ============ DUMMY INVOICE PERMISSIONS ============
//   const canViewDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.VIEW
//   );

//   const canCreateDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.CREATE
//   );

//   const canUpdateDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.UPDATE
//   );

//   const canDeleteDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.DELETE
//   );

//   const canExportDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.EXPORT
//   );

//   // Combined permissions
//   const canGenerateInvoice = canCreateDummyInvoice; // Only CREATE permission for generating new invoices
//   const canPrintInvoice = canViewDummyInvoice; // Print is considered part of view
//   const canExportExcel = canExportDummyInvoice || canCreateDummyInvoice; // Export permission or fallback to create
//   const canEditInvoice = canCreateDummyInvoice || canUpdateDummyInvoice; // For editing capabilities

//   useEffect(() => {
//     if (!canViewDummyInvoice) {
//       showError('You do not have permission to view Tax Invoice Generator');
//       setLoading(false);
//       return;
//     }
//     fetchAllocatedBookings();
//   }, [canViewDummyInvoice]);

//   const fetchAllocatedBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/bookings');
      
//       // Filter bookings that are allocated and have chassis number
//       const allocatedBookings = response.data.data.bookings.filter(
//         (booking) => booking.status === 'ALLOCATED' && booking.chassisNumber
//       );
      
//       setBookings(allocatedBookings);
//       setFilteredBookings(allocatedBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     if (value.trim() === '') {
//       setFilteredBookings(bookings);
//     } else {
//       const filtered = bookings.filter(booking => 
//         booking.bookingNumber?.toLowerCase().includes(value.toLowerCase()) ||
//         booking.chassisNumber?.toLowerCase().includes(value.toLowerCase()) ||
//         booking.customerDetails?.name?.toLowerCase().includes(value.toLowerCase()) ||
//         booking.model?.model_name?.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredBookings(filtered);
//     }
//   };

//   const handleOpenInvoiceModal = async (booking) => {
//     // Check permission before opening modal - require at least VIEW permission
//     if (!canViewDummyInvoice) {
//       showError('You do not have permission to view tax invoices');
//       return;
//     }

//     try {
//       setLoadingInvoice(true);
      
//       // Fetch complete booking data with all details
//       const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${booking._id}`);
//       const bookingData = bookingResponse.data.data.bookingDetails;
//       const finalStatus = bookingResponse.data.data.finalStatus || '';
      
//       // Merge the fetched data with the original booking
//       const completeBooking = {
//         ...booking,
//         ...bookingData,
//         finalStatus
//       };
      
//       setSelectedBooking(completeBooking);
//       setCustomerType(completeBooking.customerType || 'B2C');
      
//       // Define ONLY summary headers to exclude (not the individual components)
//       const excludedHeaders = [
//         'ON ROAD PRICE',
//         'ON ROAD PRICE (A)',
//         'TOTAL ONROAD + ADDON SERVICES',
//         'TOTAL ONROAD+ADDON SERVICES',
//         'ADDON SERVICES TOTAL',
//         'ADD ON SERVICES TOTAL',
//         'ADDON SERVICES TOTAL (B)',
//         'ACCESSORIES TOTAL',
//         'TOTAL AMOUNT',
//         'GRAND TOTAL',
//         'FINAL AMOUNT',
//         'TOTAL',
//         'ON-ROAD PRICE',
//         'FINAL PRICE',
//         'LESS:- CENTER SUBSIDY(FAME-II)',
//         'COMPLETE PRICE'
//       ];
      
//       // Include ALL price components - no filtering except summary headers
//       let items = [];
      
//       if (completeBooking.priceComponents && Array.isArray(completeBooking.priceComponents)) {
//         items = completeBooking.priceComponents
//           // Only filter out summary headers, NOT insurance/rto/hpa
//           .filter(comp => comp.header && comp.header.header_key)
//           .filter(comp => !excludedHeaders.includes(comp.header.header_key))
//           .map(comp => {
//             const headerKey = comp.header.header_key || 'Unknown';
            
//             // Get HSN code from header.metadata
//             const hsnCode = comp.header?.metadata?.hsn_code || 'N/A';
            
//             // Get GST rate from header.metadata
//             let gstRatePercentage = 0;
//             if (comp.header?.metadata?.gst_rate) {
//               const gstStr = comp.header.metadata.gst_rate.toString();
//               gstRatePercentage = parseFloat(gstStr.replace('%', '')) || 0;
//             }
            
//             // Check if this is an HPA-related header
//             const isHPAHeader = headerKey.startsWith('HP') || 
//                                 headerKey.startsWith('HPA') ||
//                                 headerKey.toLowerCase().includes('hypothecation') ||
//                                 headerKey.toLowerCase().includes('loan');
            
//             // Check if this is Insurance header
//             const isInsuranceHeader = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
            
//             // Check if this is RTO header
//             const isRTOHeader = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES|RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES/i.test(headerKey);
            
//             // Check if this is Accessory
//             const isAccessory = headerKey.toLowerCase().includes('accessories') || 
//                                headerKey.toLowerCase().includes('accessory') ||
//                                comp.category_key === 'ACCESSORIES';
            
//             // Apply HPA filter - only skip if HPA is disabled AND it's an HPA header
//             if (isHPAHeader && !completeBooking.hpa) {
//               return null;
//             }
            
//             return {
//               id: comp.header?._id || comp.header?.id || `item-${Math.random()}`,
//               header_key: headerKey,
//               header_id: comp.header?._id || comp.header?.id, // Store header ID for API
//               hsn_code: hsnCode,
//               unitCost: 0, // Set default to 0
//               originalUnitCost: comp.originalValue || 0,
//               discount: 0, // Keep but will be ignored
//               gst_rate: gstRatePercentage,
//               is_mandatory: comp.isMandatory || false,
//               is_discount: comp.isDiscountable || false,
//               category_key: comp.header?.category_key || '',
//               is_hpa_header: isHPAHeader,
//               is_insurance_header: isInsuranceHeader,
//               is_rto_header: isRTOHeader,
//               is_accessory: isAccessory,
//               // Store calculated values
//               taxableValue: 0, // Will be calculated in render
//               cgstAmount: 0,
//               sgstAmount: 0,
//               lineTotal: 0, // Set to 0
//               header: comp.header
//             };
//           })
//           .filter(item => item !== null);
//       }
      
//       // Sort items: mandatory first, then by header_key
//       items.sort((a, b) => {
//         if (a.is_mandatory && !b.is_mandatory) return -1;
//         if (!a.is_mandatory && b.is_mandatory) return 1;
//         return (a.header_key || '').localeCompare(b.header_key || '');
//       });
      
//       console.log('Dummy Invoice Items - ALL INCLUDED:', items);
//       setInvoiceItems(items);
//       setInvoiceModal(true);
      
//     } catch (error) {
//       console.error('Error preparing invoice:', error);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setLoadingInvoice(false);
//     }
//   };

//   const handleUnitCostChange = (itemId, value) => {
//     // Check if user has permission to edit (CREATE or UPDATE)
//     if (!canEditInvoice) {
//       showError('You do not have permission to edit invoice amounts');
//       return;
//     }

//     setInvoiceItems(prevItems => 
//       prevItems.map(item => {
//         if (item.id === itemId) {
//           const newUnitCost = parseFloat(value) || 0;
//           return {
//             ...item,
//             unitCost: newUnitCost
//           };
//         }
//         return item;
//       })
//     );
//   };

//   const handleCustomerTypeChange = (e) => {
//     // Check if user has permission to edit (CREATE or UPDATE)
//     if (!canEditInvoice) {
//       showError('You do not have permission to change customer type');
//       return;
//     }
//     setCustomerType(e.target.value);
//   };

//   // API Integration: Save Dummy Invoice and then Print
//   const handleSaveAndPrintInvoice = async () => {
//     if (!canCreateDummyInvoice) {
//       showError('You do not have permission to save invoices');
//       return;
//     }

//     if (!selectedBooking) {
//       showError('No booking selected');
//       return;
//     }

//     // Validate that at least one item has unit cost > 0
//     const hasValidItems = invoiceItems.some(item => (item.unitCost || 0) > 0);
//     if (!hasValidItems) {
//       showError('Please enter at least one unit cost value before saving');
//       return;
//     }

//     try {
//       setSavingInvoice(true);

//       // Prepare headerPrices object - ONLY include items with unitCost > 0
//       const headerPrices = {};
      
//       invoiceItems.forEach(item => {
//         // Only include if header_id exists and unitCost is greater than 0
//         if (item.header_id && item.unitCost > 0) {
//           headerPrices[item.header_id] = item.unitCost;
//         }
//       });

//       // Check if we have any valid header prices
//       if (Object.keys(headerPrices).length === 0) {
//         showError('No valid header prices to save');
//         setSavingInvoice(false);
//         return;
//       }

//       const payload = {
//         bookingId: selectedBooking._id,
//         headerPrices: headerPrices
//       };

//       console.log('Saving dummy invoice with ONLY non-zero items:', payload);

//       const response = await axiosInstance.post('/dummy-invoices', payload);

//       if (response.data.success) {
//         showSuccess('Invoice saved successfully');
        
//         // After successful save, automatically print the invoice
//         handlePrintInvoice();
        
//         // Close the modal after a short delay
//         setTimeout(() => {
//           setInvoiceModal(false);
//           handleResetModal();
//         }, 1000);
//       } else {
//         throw new Error(response.data.message || 'Failed to save invoice');
//       }

//     } catch (error) {
//       console.error('Error saving invoice:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to save invoice';
//       showError(errorMessage);
//     } finally {
//       setSavingInvoice(false);
//     }
//   };

//   // API Integration: Export to Excel
//   const handleExportExcel = async () => {
//     if (!canExportExcel) {
//       showError('You do not have EXPORT permission for Dummy Invoice');
//       return;
//     }

//     try {
//       setExportingExcel(true);
      
//       // Make the API call with responseType blob to handle file download
//       const response = await axiosInstance.get('/reports/dummy-Invoice', {
//         params: {
//           format: 'excel'
//         },
//         responseType: 'blob' // Important for file download
//       });

//       // Create a blob from the response data
//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       // Create a download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Set filename from Content-Disposition header or use default
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = 'dummy_invoice_report.xlsx';
      
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }
      
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       // Clean up the blob URL
//       window.URL.revokeObjectURL(url);
      
//       showSuccess('Report exported successfully');

//     } catch (error) {
//       console.error('Error exporting to Excel:', error);
      
//       // Handle error response as blob
//       if (error.response && error.response.data instanceof Blob) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           try {
//             const errorData = JSON.parse(reader.result);
//             showError(errorData.message || 'Failed to export report');
//           } catch (e) {
//             showError('Failed to export report');
//           }
//         };
//         reader.readAsText(error.response.data);
//       } else {
//         showError(error.response?.data?.message || error.message || 'Failed to export report');
//       }
//     } finally {
//       setExportingExcel(false);
//     }
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     if (customerType === 'CSD') {
//       return netAmount;
//     }
    
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     if (customerType === 'CSD') {
//       const halfRate = gstRate / 2;
//       const cgstAmount = 0;
//       const sgstAmount = taxable * (halfRate / 100);
//       return { cgstAmount, sgstAmount, halfRate, cgstRate: 0, sgstRate: halfRate };
//     }
    
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   const calculateSubtotal = () => {
//     return invoiceItems.reduce((sum, item) => {
//       const unitCost = parseFloat(item.unitCost) || 0;
//       const discount = parseFloat(item.discount) || 0;
//       const gstRate = parseFloat(item.gst_rate) || 0;
//       const lineTotal = unitCost - discount;
      
//       let taxableValue;
//       if (customerType === 'CSD') {
//         taxableValue = lineTotal;
//       } else if (gstRate === 0) {
//         taxableValue = lineTotal;
//       } else {
//         taxableValue = (lineTotal * 100) / (100 + gstRate);
//       }
      
//       const totalGST = lineTotal - taxableValue;
//       let cgstAmount, sgstAmount;
      
//       if (customerType === 'CSD') {
//         cgstAmount = 0;
//         sgstAmount = totalGST;
//       } else {
//         cgstAmount = totalGST / 2;
//         sgstAmount = totalGST / 2;
//       }
      
//       return sum + taxableValue + cgstAmount + sgstAmount;
//     }, 0);
//   };

//   // Generate Print HTML - Only include items with unitCost > 0
//   const generateInvoiceHTML = (booking, items, custType) => {
//     // Check print permission
//     if (!canPrintInvoice) {
//       showError('You do not have permission to print tax invoices');
//       return '';
//     }

//     // Filter out items with unitCost = 0
//     const nonZeroItems = items.filter(item => (item.unitCost || 0) > 0);
    
//     if (nonZeroItems.length === 0) {
//       showError('No items with positive values to print');
//       return '';
//     }

//     const currentDate = new Date().toLocaleDateString('en-GB');
//     const dob = booking.customerDetails.dob ? new Date(booking.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
//     // FILTER OUT insurance, RTO, and HPA items for the main table
//     const mainItems = nonZeroItems.filter(item => 
//       !item.is_insurance_header && 
//       !item.is_rto_header && 
//       !item.is_hpa_header
//     );
    
//     // Get insurance, RTO, HP items for separate display
//     const insuranceItems = nonZeroItems.filter(item => item.is_insurance_header);
//     const rtoItems = nonZeroItems.filter(item => item.is_rto_header);
//     const hpItems = nonZeroItems.filter(item => item.is_hpa_header);
    
//     // Calculate totals for main items
//     const mainItemsWithCalculations = mainItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     // Calculate totals for insurance items
//     const insuranceItemsWithCalculations = insuranceItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     // Calculate totals for RTO items
//     const rtoItemsWithCalculations = rtoItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     // Calculate totals for HP items
//     const hpItemsWithCalculations = hpItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     const totalAmount = mainItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
//     const insuranceCharges = insuranceItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
//     const rtoCharges = rtoItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
//     const hpCharges = booking.hpa ? hpItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0) : 0;

//     const totalB = insuranceCharges + rtoCharges + hpCharges;
//     const grandTotal = totalAmount + totalB;

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Tax Invoice - ${booking.bookingNumber}</title>
//         <style>
//           body {
//             font-family: "Courier New", Courier, monospace;
//             margin: 0;
//             padding: 10mm;
//             font-size: 14px;
//             color: #555555;
//           }
//           .page {
//             width: 210mm;
//             min-height: 297mm;
//             margin: 0 auto;
//           }
//           .invoice-title {
//             text-align: center;
//             font-size: 25px;
//             font-weight: bold;
//             margin-bottom: 5mm;
//           }
//           .header {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 2mm;
//           }
//           .header-left {
//             width: 70%;
//           }
//           .header-right {
//             width: 30%;
//             text-align: right;
//           }
//           .logo {
//             height: 50px;
//             margin-bottom: 2mm;
//           }
//           .dealer-info {
//             text-align: left;
//             font-size: 14px;
//             line-height: 1.2;
//           }
//           .rto-type {
//             text-align: left;
//             margin: 1mm 0;
//             font-weight: bold;
//           }
//           .customer-info-container {
//             display: flex;
//             font-size: 14px;
//           }
//           .customer-info-left, .customer-info-right {
//             width: 50%;
//           }
//           .customer-info-row {
//             margin: 1mm 0;
//             line-height: 1.2;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 9pt;
//             margin: 2mm 0;
//           }
//           th, td {
//             padding: 1mm;
//             border: 1px solid #000;
//             vertical-align: top;
//           }
//           .no-border { 
//             border: none !important; 
//             font-size: 14px;
//           }
//           .text-right { text-align: right; }
//           .text-center { text-align: center; }
//           .bold { 
//             font-weight: bold; 
//           }
//           .section-title {
//             font-weight: bold;
//             margin: 1mm 0;
//           }
//           .signature-box {
//             margin-top: 5mm;
//             font-size: 9pt;
//           }
//           .signature-line {
//             border-top: 1px dashed #000;
//             width: 40mm;
//             display: inline-block;
//             margin: 0 5mm;
//           }
//           .divider {
//             border-top: 2px solid #AAAAAA;
//             margin: 2mm 0;
//           }
//           .totals-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 2mm 0;
//           }
//           .totals-table td {
//             border: none;
//             padding: 1mm;
//           }
//           .total-divider {
//             border-top: 2px solid #AAAAAA;
//             height: 1px;
//             margin: 2px 0;
//           }
//           .broker-info {
//             display: flex;
//             justify-content: space-between;
//             padding: 1px;
//           }
//           .dummy-badge {
//             display: inline-block;
//             background-color: #ff9800;
//             color: white;
//             padding: 2px 8px;
//             border-radius: 4px;
//             font-size: 12px;
//             font-weight: bold;
//             margin-left: 10px;
//           }
//           .badge {
//             display: inline-block;
//             padding: 2px 6px;
//             border-radius: 3px;
//             font-size: 9px;
//             font-weight: bold;
//             margin-left: 4px;
//           }
//           @page {
//             size: A4;
//             margin: 0;
//           }
//           @media print {
//             body {
//               padding: 5mm;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="page">
//           <!-- Header Section -->
//           <div class="invoice-title">
//             TAX INVOICE
           
//           </div>
          
//           <div class="header">
//             <div class="header-left">
//               <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
//               <div class="dealer-info">
//                 Authorized Main Dealer: TVS Motor Company Ltd.<br>
//                 Registered office: ${booking.branch?.address || 'N/A'}<br>
//                 GSTIN: ${booking.branch?.gst_number || ''}<br>
//                 ${booking.branch?.name || ''}
//               </div>
//             </div>
//             <div class="header-right">
//               <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//               <div>Date: ${currentDate}</div>
//               ${booking.bookingType === 'SUBDEALER' ? `
//                 <div><b>Subdealer:</b> ${booking.subdealer?.name || ''}</div>
//                 <div><b>Address:</b> ${booking.subdealer?.location || ''}</div>
//               ` : ''}
//             </div>
//           </div>
          
//           <div class="divider"></div>
//           <div class="rto-type">RTO TYPE: ${booking.rto || 'MH'}</div>
//           <div class="divider"></div>

//           <!-- Customer Information -->
//           <div class="customer-info-container">
//             <div class="customer-info-left">
//               <div class="customer-info-row"><strong>Invoice Number:</strong> ${booking.bookingNumber}</div>
//               <div class="customer-info-row"><strong>Customer Name:</strong> ${booking.customerDetails.name}</div>
//               <div class="customer-info-row"><strong>Address:</strong> ${booking.customerDetails.address}, ${booking.customerDetails.taluka || ''}</div>
//               <div class="customer-info-row"><strong>Taluka:</strong> ${booking.customerDetails.taluka || 'N/A'}</div>
//               <div class="customer-info-row"><strong>Mobile No.:</strong> ${booking.customerDetails.mobile1}</div>
//               <div class="customer-info-row"><strong>Exchange Mode:</strong> ${booking.exchange ? 'YES' : 'NO'}</div>
//               <div class="customer-info-row"><strong>Aadhar No.:</strong> ${booking.customerDetails.aadharNumber || 'N/A'}</div>
//               <div class="customer-info-row"><strong>HPA:</strong> ${booking.hpa ? 'YES' : 'NO'}</div>
//             </div>
//             <div class="customer-info-right">
//               <div class="customer-info-row"><strong>GSTIN:</strong> ${booking.gstin || 'N/A'}</div>
//               <div class="customer-info-row"><strong>District:</strong> ${booking.customerDetails.district || 'N/A'}</div>
//               <div class="customer-info-row"><strong>Pincode:</strong> ${booking.customerDetails.pincode || 'N/A'}</div>
//               <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
//               <div class="customer-info-row"><strong>Payment Mode:</strong> ${booking.payment?.type || 'CASH'}</div>
//               <div class="customer-info-row"><strong>Financer:</strong> ${booking.payment?.financer?.name || ''}</div>
//               <div class="customer-info-row"><strong>Sales Representative:</strong> ${booking.salesExecutive?.name || 'N/A'}</div>
//               <div class="customer-info-row"><strong>Customer Type:</strong> ${custType}</div>
//             </div>
//           </div>
          
//           <div class="divider"></div>

//           <!-- Vehicle Details -->
//           <div class="section-title">Vehicle Details:</div>
//           <table class="no-border">
//             <tr>
//               <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${booking.model.model_name}</td>
//               <td class="no-border"><strong>Battery No:</strong> ${booking.batteryNumber || '000'}</td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>Chasis No:</strong> ${booking.chassisNumber}</td>
//               <td class="no-border"><strong>Colour:</strong> ${booking.color?.name || ''}</td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>Engine No:</strong> ${booking.vehicleRef?.engineNumber}</td>
//               <td class="no-border"><strong>Key No.:</strong> ${booking.keyNumber || '000'}</td>
//             </tr>
//           </table>

//           <!-- Price Breakdown Table - EXCLUDING Insurance, RTO, HPA -->
//           <div class="section-title">Price Breakdown:</div>
//           <table>
//             <tr>
//               <th style="width:25%">Particulars</th>
//               <th style="width:8%">HSN CODE</th>
//               <th style="width:8%">Unit Cost</th>
//               <th style="width:8%">Taxable</th>
//               <th style="width:5%">CGST%</th>
//               <th style="width:8%">CGST Amt</th>
//               <th style="width:5%">SGST%</th>
//               <th style="width:8%">SGST Amt</th>
//               <th style="width:10%">Line Total</th>
//             </tr>

//             ${mainItemsWithCalculations.map(item => `
//               <tr>
//                 <td>${item.header_key}</td>
//                 <td>${item.hsn_code}</td>
//                 <td>${item.unitCost.toFixed(2)}</td>
//                 <td>${item.taxable.toFixed(2)}</td>
//                 <td>${(item.cgstRate || 0).toFixed(2)}%</td>
//                 <td>${item.cgstAmount.toFixed(2)}</td>
//                 <td>${(item.sgstRate || 0).toFixed(2)}%</td>
//                 <td>${item.sgstAmount.toFixed(2)}</td>
//                 <td>${item.lineTotal.toFixed(2)}</td>
//               </tr>
//             `).join('')}
            
//             ${mainItemsWithCalculations.length === 0 ? `
//               <tr>
//                 <td colspan="9" class="text-center">No items available</td>
//               </tr>
//             ` : ''}
//           </table>

//           <!-- Totals Section - Show Insurance, RTO, HPA separately -->
//           <table class="totals-table">
//             <tr>
//               <td class="no-border" style="width:80%"><strong>Total (A) - Vehicle & Accessories</strong></td>
//               <td class="no-border text-right"><strong>${totalAmount.toFixed(2)}</strong></td>
//             </tr>
//             <tr>
//               <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//             </tr>
//             ${insuranceCharges > 0 ? `
//             <tr>
//               <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
//               <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
//             </tr>
//             ` : ''}
//             ${rtoCharges > 0 ? `
//             <tr>
//               <td class="no-border"><strong>RTO TAX & REGISTRATION</strong></td>
//               <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
//             </tr>
//             ` : ''}
//             ${booking.hpa && hpCharges > 0 ? `
//             <tr>
//               <td class="no-border"><strong>HP CHARGES</strong></td>
//               <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
//             </tr>
//             ` : ''}
//             <tr>
//               <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>TOTAL (B) - Other Charges</strong></td>
//               <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
//             </tr>
//             <tr>
//               <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>GRAND TOTAL (A) + (B)</strong></td>
//               <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
//             </tr>
//           </table>

//           <!-- Exchange Details -->
//           ${booking.exchange ? `
//             <div class="broker-info">
//               <div><strong>Ex. Broker/Sub Dealer:</strong> ${booking.exchangeDetails?.broker?.name || ''}</div>
//               <div><strong>Ex. Veh No:</strong> ${booking.exchangeDetails?.vehicleNumber || ''}</div>
//             </div>
//           ` : ''}

//           <!-- Accessories -->
//           ${booking.accessories && booking.accessories.length > 0 ? `
//             <div style="margin-top:2mm;">
//               <div><strong>ACC.DETAILS:</strong>
//                 ${booking.accessories
//                   .map(acc => acc.accessory ? acc.accessory.name : '')
//                   .filter(name => name)
//                   .join(', ')}
//               </div>
//             </div>
//           ` : ''}

//           <div class="divider"></div>

//           <!-- Signature Section -->
//           <div class="signature-box">
//             <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Customer's Signature</div>
//               </div>
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Sales Executive</div>
//               </div>
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Manager</div>
//               </div>
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Accountant</div>
//               </div>
//             </div>
//           </div>

//           <div style="text-align: center; margin-top: 5mm; font-size: 10px; color: #999;">
//             * This is a computer generated Tax invoice - not for commercial use *
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   const handlePrintInvoice = () => {
//     if (!canPrintInvoice) {
//       showError('You do not have permission to print tax invoices');
//       return;
//     }

//     if (!selectedBooking || invoiceItems.length === 0) {
//       setError('No invoice data available');
//       return;
//     }

//     // Filter out items with zero value for printing
//     const nonZeroItems = invoiceItems.filter(item => (item.unitCost || 0) > 0);
    
//     if (nonZeroItems.length === 0) {
//       showError('No items with positive values to print');
//       return;
//     }

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(generateInvoiceHTML(selectedBooking, invoiceItems, customerType));
//     printWindow.document.close();
//     printWindow.focus();
//   };

//   const handleResetModal = () => {
//     setSelectedBooking(null);
//     setInvoiceItems([]);
//     setCustomerType('B2C');
//   };

//   // Early return if no permission to view
//   if (!canViewDummyInvoice) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Proforma Invoice Generator.
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="title">Proforma Invoice Generator</div>
      
//       {error && (
//         <CAlert color="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//           {error}
//         </CAlert>
//       )}

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="badge bg-warning text-dark me-3">Tax INVOICE</span>
//           </div>
//           <div className="d-flex">
//             <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder="Booking ID, Chassis, Customer..."
//             />
//             <CButton 
//               color="success" 
//               className="ms-2"
//               onClick={handleExportExcel}
//               disabled={exportingExcel || !canExportExcel}
//               title={!canExportExcel ? "You don't have export permission" : ""}
//             >
//               {exportingExcel ? (
//                 <>
//                   <CSpinner size="sm" className="me-1" />
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilCloudDownload} className="me-1" />
//                   Export Excel
//                 </>
//               )}
//             </CButton>
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredBookings.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="8" className="text-center">
//                       No allocated bookings available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredBookings.map((booking, index) => (
//                     <CTableRow key={booking._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <span className="badge bg-success">{booking.status}</span>
//                       </CTableDataCell>
//                       <CTableDataCell className="text-center">
//                         <CButton
//                           size="sm"
//                           color="warning"
//                           className="action-btn"
//                           onClick={() => handleOpenInvoiceModal(booking)}
//                           disabled={!canCreateDummyInvoice}
//                           title={!canCreateDummyInvoice ? "You don't have permission to generate invoices" : "Generate Tax Invoice"}
//                         >
//                           <CIcon icon={cilPrint} className="me-1" />
//                           Generate Tax Invoice
//                         </CButton>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Dummy Invoice Modal */}
//       <CModal 
//         visible={invoiceModal} 
//         onClose={() => {
//           setInvoiceModal(false);
//           handleResetModal();
//         }}
//         size="xl"
//         backdrop="static"
//         scrollable
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <div className="d-flex align-items-center">
//               <CIcon icon={cilCarAlt} className="me-2" />
//               Tax Invoice - {selectedBooking?.bookingNumber}
//               {!canEditInvoice && (
//                 <span className="badge bg-warning text-dark ms-3">VIEW ONLY</span>
//               )}
//               {canEditInvoice && (
//                 <span className="badge bg-success ms-3">EDIT MODE</span>
//               )}
//             </div>
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingInvoice ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading invoice details...</p>
//             </div>
//           ) : (
//             <div>
//               {/* Booking Summary */}
//               {selectedBooking && (
//                 <div className="border rounded p-3 mb-4 bg-light">
//                   <div className="row">
//                     <div className="col-md-6">
//                       <p className="mb-1"><strong>Customer:</strong> {selectedBooking.customerDetails?.name}</p>
//                       <p className="mb-1"><strong>Model:</strong> {selectedBooking.model?.model_name}</p>
//                       <p className="mb-1"><strong>Chassis:</strong> {selectedBooking.chassisNumber}</p>
//                       <p className="mb-1"><strong>HPA:</strong> {selectedBooking.hpa ? 'YES' : 'NO'}</p>
//                     </div>
//                     <div className="col-md-6">
//                       <p className="mb-1"><strong>Engine:</strong> {selectedBooking.engineNumber}</p>
//                       <p className="mb-1"><strong>Color:</strong> {selectedBooking.color?.name}</p>
//                       <p className="mb-1"><strong>Booking Date:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
//                       <p className="mb-1"><strong>Customer Type:</strong> {selectedBooking.customerType || 'B2C'}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Customer Type Selector */}
//               <div className="row mb-3">
//                 <div className="col-md-3">
//                   <CFormLabel>Customer Type</CFormLabel>
//                   <CFormSelect 
//                     value={customerType} 
//                     onChange={handleCustomerTypeChange}
//                     disabled={!canEditInvoice}
//                   >
//                     <option value="B2C">B2C</option>
//                     <option value="CSD">CSD</option>
//                   </CFormSelect>
//                   {!canEditInvoice && (
//                     <small className="text-muted">(View only - cannot change)</small>
//                   )}
//                 </div>
//               </div>

//               {/* Invoice Items Table */}
//               <div className="table-responsive">
//                 <CTable striped bordered hover>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell>Particulars</CTableHeaderCell>
//                       <CTableHeaderCell>HSN CODE</CTableHeaderCell>
//                       <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                       <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                       <CTableHeaderCell>CGST %</CTableHeaderCell>
//                       <CTableHeaderCell>CGST Amt</CTableHeaderCell>
//                       <CTableHeaderCell>SGST %</CTableHeaderCell>
//                       <CTableHeaderCell>SGST Amt</CTableHeaderCell>
//                       <CTableHeaderCell>Line Total</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {invoiceItems.map((item) => {
//                       const gstRate = item.gst_rate || 0;
//                       const unitCost = parseFloat(item.unitCost) || 0;
//                       const discount = 0; // Always use 0 discount
//                       const lineTotal = unitCost - discount;
                      
//                       // Calculate taxable amount based on customer type
//                       let taxableValue;
//                       if (customerType === 'CSD') {
//                         taxableValue = lineTotal;
//                       } else if (gstRate === 0) {
//                         taxableValue = lineTotal;
//                       } else {
//                         taxableValue = (lineTotal * 100) / (100 + gstRate);
//                       }
                      
//                       const totalGST = lineTotal - taxableValue;
//                       let cgstAmount, sgstAmount, cgstRate, sgstRate;
                      
//                       if (customerType === 'CSD') {
//                         cgstAmount = 0;
//                         sgstAmount = totalGST;
//                         cgstRate = 0;
//                         sgstRate = gstRate;
//                       } else {
//                         cgstAmount = totalGST / 2;
//                         sgstAmount = totalGST / 2;
//                         cgstRate = gstRate / 2;
//                         sgstRate = gstRate / 2;
//                       }
                      
//                       return (
//                         <CTableRow key={item.id}>
//                           <CTableDataCell>
//                             <div className="d-flex align-items-center">
//                               {item.header_key}
//                               {item.is_insurance_header && (
//                                 <span className="badge bg-info ms-2">Insurance</span>
//                               )}
//                               {item.is_rto_header && (
//                                 <span className="badge bg-secondary ms-2">RTO</span>
//                               )}
//                               {item.is_hpa_header && (
//                                 <span className="badge bg-primary ms-2">HPA</span>
//                               )}
//                             </div>
//                           </CTableDataCell>
//                           <CTableDataCell>{item.hsn_code}</CTableDataCell>
//                           <CTableDataCell>
//                             <CFormInput
//                               type="number"
//                               size="sm"
//                               min="0"
//                               step="0.01"
//                               value={item.unitCost}
//                               onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
//                               style={{ width: '120px' }}
//                               disabled={!canEditInvoice}
//                               readOnly={!canEditInvoice}
//                               placeholder={!canEditInvoice ? "Read only" : ""}
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>₹{taxableValue.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                           <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                           <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>
//                             <strong>₹{lineTotal.toFixed(2)}</strong>
//                           </CTableDataCell>
//                         </CTableRow>
//                       );
//                     })}
                    
//                     {invoiceItems.length === 0 && (
//                       <CTableRow>
//                         <CTableDataCell colSpan="9" className="text-center">
//                           No invoice items found
//                         </CTableDataCell>
//                       </CTableRow>
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>

//               {/* Summary Section */}
//               <div className="row mt-4">
//                 <div className="col-md-6 offset-md-6">
//                   <div className="border rounded p-3 bg-light">
//                     <h6 className="fw-bold mb-3">Summary</h6>
                    
//                     {/* Calculate total A (all items with unitCost > 0) */}
//                     <div className="d-flex justify-content-between mb-2">
//                       <span>Total (A):</span>
//                       <span className="fw-bold">₹{invoiceItems.reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0).toFixed(2)}</span>
//                     </div>
                    
//                     {/* Find and show Insurance charges (only if > 0) */}
//                     {invoiceItems.some(item => item.is_insurance_header && (item.unitCost || 0) > 0) && (
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>INSURANCE CHARGES:</span>
//                         <span className="fw-bold">₹{
//                           invoiceItems
//                             .filter(item => item.is_insurance_header)
//                             .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
//                             .toFixed(2)
//                         }</span>
//                       </div>
//                     )}
                    
//                     {/* Find and show RTO charges (only if > 0) */}
//                     {invoiceItems.some(item => item.is_rto_header && (item.unitCost || 0) > 0) && (
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>RTO TAX & REGISTRATION:</span>
//                         <span className="fw-bold">₹{
//                           invoiceItems
//                             .filter(item => item.is_rto_header)
//                             .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
//                             .toFixed(2)
//                         }</span>
//                       </div>
//                     )}
                    
//                     {/* Find and show HPA/HP charges (only if > 0) */}
//                     {selectedBooking?.hpa && invoiceItems.some(item => item.is_hpa_header && (item.unitCost || 0) > 0) && (
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>HP CHARGES:</span>
//                         <span className="fw-bold">₹{
//                           invoiceItems
//                             .filter(item => item.is_hpa_header)
//                             .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
//                             .toFixed(2)
//                         }</span>
//                       </div>
//                     )}
                    
//                     <div className="border-top pt-2 mt-2">
//                       <div className="d-flex justify-content-between">
//                         <span className="fw-bold">GRAND TOTAL:</span>
//                         <span className="fw-bold fs-5">₹{calculateSubtotal().toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setInvoiceModal(false);
//               handleResetModal();
//             }}
//           >
//             Cancel
//           </CButton>
          
//           {/* Export Excel Button inside modal */}
//           <CButton 
//             color="info" 
//             onClick={handleExportExcel}
//             disabled={exportingExcel || !canExportExcel}
//             title={!canExportExcel ? "You don't have export permission" : ""}
//           >
//             {exportingExcel ? (
//               <>
//                 <CSpinner size="sm" className="me-1" />
//                 Exporting...
//               </>
//             ) : (
//               <>
//                 <CIcon icon={cilCloudDownload} className="me-1" />
//                 Export Excel
//               </>
//             )}
//           </CButton>
          
//           {/* Save & Print Button - Only show if user has create permission */}
//           {canCreateDummyInvoice && (
//             <CButton 
//               color="success" 
//               onClick={handleSaveAndPrintInvoice}
//               disabled={savingInvoice || invoiceItems.length === 0 || loadingInvoice}
//             >
//               {savingInvoice ? (
//                 <>
//                   <CSpinner size="sm" className="me-2" />
//                   Saving & Printing...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilSave} className="me-1" />
//                   Save & Print Invoice
//                 </>
//               )}
//             </CButton>
//           )}
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default DummyInvoice;




// import React, { useState, useEffect } from 'react';
// import '../../css/invoice.css';
// import '../../css/form.css';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableBody,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CAlert,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CInputGroup,
//   CInputGroupText,
//   CFormSelect,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPrint, cilSearch, cilCarAlt, cilSave, cilCloudDownload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import tvsLogo from '../../assets/images/logo1.png';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS 
// } from '../../utils/modulePermissions';

// // Pagination constants
// const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
// const DEFAULT_LIMIT = 50;

// const DummyInvoice = () => {
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Invoice Modal States
//   const [invoiceModal, setInvoiceModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [invoiceItems, setInvoiceItems] = useState([]);
//   const [loadingInvoice, setLoadingInvoice] = useState(false);
//   const [savingInvoice, setSavingInvoice] = useState(false);
//   const [exportingExcel, setExportingExcel] = useState(false);
  
//   // Customer Type for GST calculation
//   const [customerType, setCustomerType] = useState('B2C');

//   // Pagination states - similar to DeliveryChallan and Receipt
//   const [pagination, setPagination] = useState({
//     docs: [],
//     total: 0,
//     pages: 1,
//     currentPage: 1,
//     limit: DEFAULT_LIMIT,
//     loading: false,
//     search: ''
//   });

//   const navigate = useNavigate();
//   const { permissions = [] } = useAuth();

//   // Debounce timer for search
//   const searchTimer = React.useRef(null);

//   // ============ DUMMY INVOICE PERMISSIONS ============
//   const canViewDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.VIEW
//   );

//   const canCreateDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.CREATE
//   );

//   const canUpdateDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.UPDATE
//   );

//   const canDeleteDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.DELETE
//   );

//   const canExportDummyInvoice = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.DUMMY_INVOICE, 
//     ACTIONS.EXPORT
//   );

//   // Combined permissions
//   const canGenerateInvoice = canCreateDummyInvoice; // Only CREATE permission for generating new invoices
//   const canPrintInvoice = canViewDummyInvoice; // Print is considered part of view
//   const canExportExcel = canExportDummyInvoice || canCreateDummyInvoice; // Export permission or fallback to create
//   const canEditInvoice = canCreateDummyInvoice || canUpdateDummyInvoice; // For editing capabilities

//   useEffect(() => {
//     if (!canViewDummyInvoice) {
//       showError('You do not have permission to view Tax Invoice Generator');
//       setLoading(false);
//       return;
//     }
//     fetchAllocatedBookings(1, DEFAULT_LIMIT, '');
//   }, [canViewDummyInvoice]);

//   // Fetch data with pagination and search - similar to DeliveryChallan
//   const fetchAllocatedBookings = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
//     try {
//       setPagination(prev => ({ ...prev, loading: true }));
      
//       const params = { 
//         status: 'ALLOCATED',
//         hasChassis: true, // Add this param if your API supports it
//         page, 
//         limit 
//       };
      
//       // Add search parameter if provided
//       if (search) {
//         params.search = search;
//       }
      
//       const response = await axiosInstance.get('/bookings', { params });
      
//       const responseData = response.data.data;
//       const bookings = responseData.bookings || [];
//       const total = responseData.total || bookings.length;
//       const pages = responseData.pages || Math.ceil(total / limit);

//       setPagination({
//         docs: bookings,
//         total: total,
//         pages: pages,
//         currentPage: page,
//         limit: limit,
//         loading: false,
//         search: search
//       });
      
//       // Also update filteredBookings for backward compatibility
//       setFilteredBookings(bookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//       setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
//     }
//   };

//   // Handle search with debounce - similar to DeliveryChallan
//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, search: value }));
    
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       fetchAllocatedBookings(1, pagination.limit, value);
//     }, 400);
//   };

//   // Handle page change - similar to DeliveryChallan
//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     fetchAllocatedBookings(newPage, pagination.limit, pagination.search);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle limit change - similar to DeliveryChallan
//   const handleLimitChange = (newLimit) => {
//     const limit = parseInt(newLimit, 10);
//     fetchAllocatedBookings(1, limit, pagination.search);
//   };

//   // Render pagination component - similar to DeliveryChallan
//   const renderPagination = () => {
//     const { currentPage, pages, total, limit, loading } = pagination;
//     if (!total || pages <= 1) return null;

//     const start = (currentPage - 1) * limit + 1;
//     const end = Math.min(currentPage * limit, total);

//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3) endPage = Math.min(5, pages);
//     if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

//     const pageNums = [];
//     for (let i = startPage; i <= endPage; i++) pageNums.push(i);

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
//             <CFormSelect
//               value={limit}
//               onChange={e => handleLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={loading}
//             >
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem 
//               onClick={() => handlePageChange(1)} 
//               disabled={currentPage === 1 || loading}
//             >
//               «
//             </CPaginationItem>
//             <CPaginationItem 
//               onClick={() => handlePageChange(currentPage - 1)} 
//               disabled={currentPage === 1 || loading}
//             >
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>

//             {startPage > 1 && (
//               <>
//                 <CPaginationItem 
//                   onClick={() => handlePageChange(1)} 
//                   disabled={loading}
//                 >
//                   1
//                 </CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}

//             {pageNums.map(p => (
//               <CPaginationItem 
//                 key={p} 
//                 active={p === currentPage} 
//                 onClick={() => handlePageChange(p)} 
//                 disabled={loading}
//               >
//                 {p}
//               </CPaginationItem>
//             ))}

//             {endPage < pages && (
//               <>
//                 {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem 
//                   onClick={() => handlePageChange(pages)} 
//                   disabled={loading}
//                 >
//                   {pages}
//                 </CPaginationItem>
//               </>
//             )}

//             <CPaginationItem 
//               onClick={() => handlePageChange(currentPage + 1)} 
//               disabled={currentPage === pages || loading}
//             >
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem 
//               onClick={() => handlePageChange(pages)} 
//               disabled={currentPage === pages || loading}
//             >
//               »
//             </CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   const handleOpenInvoiceModal = async (booking) => {
//     // Check permission before opening modal - require at least VIEW permission
//     if (!canViewDummyInvoice) {
//       showError('You do not have permission to view tax invoices');
//       return;
//     }

//     try {
//       setLoadingInvoice(true);
      
//       // Fetch complete booking data with all details
//       const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${booking._id}`);
//       const bookingData = bookingResponse.data.data.bookingDetails;
//       const finalStatus = bookingResponse.data.data.finalStatus || '';
      
//       // Merge the fetched data with the original booking
//       const completeBooking = {
//         ...booking,
//         ...bookingData,
//         finalStatus
//       };
      
//       setSelectedBooking(completeBooking);
//       setCustomerType(completeBooking.customerType || 'B2C');
      
//       // Define ONLY summary headers to exclude (not the individual components)
//       const excludedHeaders = [
//         'ON ROAD PRICE',
//         'ON ROAD PRICE (A)',
//         'TOTAL ONROAD + ADDON SERVICES',
//         'TOTAL ONROAD+ADDON SERVICES',
//         'ADDON SERVICES TOTAL',
//         'ADD ON SERVICES TOTAL',
//         'ADDON SERVICES TOTAL (B)',
//         'ACCESSORIES TOTAL',
//         'TOTAL AMOUNT',
//         'GRAND TOTAL',
//         'FINAL AMOUNT',
//         'TOTAL',
//         'ON-ROAD PRICE',
//         'FINAL PRICE',
//         'LESS:- CENTER SUBSIDY(FAME-II)',
//         'COMPLETE PRICE'
//       ];
      
//       // Include ALL price components - no filtering except summary headers
//       let items = [];
      
//       if (completeBooking.priceComponents && Array.isArray(completeBooking.priceComponents)) {
//         items = completeBooking.priceComponents
//           // Only filter out summary headers, NOT insurance/rto/hpa
//           .filter(comp => comp.header && comp.header.header_key)
//           .filter(comp => !excludedHeaders.includes(comp.header.header_key))
//           .map(comp => {
//             const headerKey = comp.header.header_key || 'Unknown';
            
//             // Get HSN code from header.metadata
//             const hsnCode = comp.header?.metadata?.hsn_code || 'N/A';
            
//             // Get GST rate from header.metadata
//             let gstRatePercentage = 0;
//             if (comp.header?.metadata?.gst_rate) {
//               const gstStr = comp.header.metadata.gst_rate.toString();
//               gstRatePercentage = parseFloat(gstStr.replace('%', '')) || 0;
//             }
            
//             // Check if this is an HPA-related header
//             const isHPAHeader = headerKey.startsWith('HP') || 
//                                 headerKey.startsWith('HPA') ||
//                                 headerKey.toLowerCase().includes('hypothecation') ||
//                                 headerKey.toLowerCase().includes('loan');
            
//             // Check if this is Insurance header
//             const isInsuranceHeader = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
            
//             // Check if this is RTO header
//             const isRTOHeader = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES|RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES/i.test(headerKey);
            
//             // Check if this is Accessory
//             const isAccessory = headerKey.toLowerCase().includes('accessories') || 
//                                headerKey.toLowerCase().includes('accessory') ||
//                                comp.category_key === 'ACCESSORIES';
            
//             // Apply HPA filter - only skip if HPA is disabled AND it's an HPA header
//             if (isHPAHeader && !completeBooking.hpa) {
//               return null;
//             }
            
//             return {
//               id: comp.header?._id || comp.header?.id || `item-${Math.random()}`,
//               header_key: headerKey,
//               header_id: comp.header?._id || comp.header?.id, // Store header ID for API
//               hsn_code: hsnCode,
//               unitCost: 0, // Set default to 0
//               originalUnitCost: comp.originalValue || 0,
//               discount: 0, // Keep but will be ignored
//               gst_rate: gstRatePercentage,
//               is_mandatory: comp.isMandatory || false,
//               is_discount: comp.isDiscountable || false,
//               category_key: comp.header?.category_key || '',
//               is_hpa_header: isHPAHeader,
//               is_insurance_header: isInsuranceHeader,
//               is_rto_header: isRTOHeader,
//               is_accessory: isAccessory,
//               // Store calculated values
//               taxableValue: 0, // Will be calculated in render
//               cgstAmount: 0,
//               sgstAmount: 0,
//               lineTotal: 0, // Set to 0
//               header: comp.header
//             };
//           })
//           .filter(item => item !== null);
//       }
      
//       // Sort items: mandatory first, then by header_key
//       items.sort((a, b) => {
//         if (a.is_mandatory && !b.is_mandatory) return -1;
//         if (!a.is_mandatory && b.is_mandatory) return 1;
//         return (a.header_key || '').localeCompare(b.header_key || '');
//       });
      
//       console.log('Dummy Invoice Items - ALL INCLUDED:', items);
//       setInvoiceItems(items);
//       setInvoiceModal(true);
      
//     } catch (error) {
//       console.error('Error preparing invoice:', error);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setLoadingInvoice(false);
//     }
//   };

//   const handleUnitCostChange = (itemId, value) => {
//     // Check if user has permission to edit (CREATE or UPDATE)
//     if (!canEditInvoice) {
//       showError('You do not have permission to edit invoice amounts');
//       return;
//     }

//     setInvoiceItems(prevItems => 
//       prevItems.map(item => {
//         if (item.id === itemId) {
//           const newUnitCost = parseFloat(value) || 0;
//           return {
//             ...item,
//             unitCost: newUnitCost
//           };
//         }
//         return item;
//       })
//     );
//   };

//   const handleCustomerTypeChange = (e) => {
//     // Check if user has permission to edit (CREATE or UPDATE)
//     if (!canEditInvoice) {
//       showError('You do not have permission to change customer type');
//       return;
//     }
//     setCustomerType(e.target.value);
//   };

//   // API Integration: Save Dummy Invoice and then Print
//   const handleSaveAndPrintInvoice = async () => {
//     if (!canCreateDummyInvoice) {
//       showError('You do not have permission to save invoices');
//       return;
//     }

//     if (!selectedBooking) {
//       showError('No booking selected');
//       return;
//     }

//     // Validate that at least one item has unit cost > 0
//     const hasValidItems = invoiceItems.some(item => (item.unitCost || 0) > 0);
//     if (!hasValidItems) {
//       showError('Please enter at least one unit cost value before saving');
//       return;
//     }

//     try {
//       setSavingInvoice(true);

//       // Prepare headerPrices object - ONLY include items with unitCost > 0
//       const headerPrices = {};
      
//       invoiceItems.forEach(item => {
//         // Only include if header_id exists and unitCost is greater than 0
//         if (item.header_id && item.unitCost > 0) {
//           headerPrices[item.header_id] = item.unitCost;
//         }
//       });

//       // Check if we have any valid header prices
//       if (Object.keys(headerPrices).length === 0) {
//         showError('No valid header prices to save');
//         setSavingInvoice(false);
//         return;
//       }

//       const payload = {
//         bookingId: selectedBooking._id,
//         headerPrices: headerPrices
//       };

//       console.log('Saving dummy invoice with ONLY non-zero items:', payload);

//       const response = await axiosInstance.post('/dummy-invoices', payload);

//       if (response.data.success) {
//         showSuccess('Invoice saved successfully');
        
//         // After successful save, automatically print the invoice
//         handlePrintInvoice();
        
//         // Close the modal after a short delay
//         setTimeout(() => {
//           setInvoiceModal(false);
//           handleResetModal();
//         }, 1000);
//       } else {
//         throw new Error(response.data.message || 'Failed to save invoice');
//       }

//     } catch (error) {
//       console.error('Error saving invoice:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to save invoice';
//       showError(errorMessage);
//     } finally {
//       setSavingInvoice(false);
//     }
//   };

//   // API Integration: Export to Excel
//   const handleExportExcel = async () => {
//     if (!canExportExcel) {
//       showError('You do not have EXPORT permission for Dummy Invoice');
//       return;
//     }

//     try {
//       setExportingExcel(true);
      
//       // Make the API call with responseType blob to handle file download
//       const response = await axiosInstance.get('/reports/dummy-Invoice', {
//         params: {
//           format: 'excel'
//         },
//         responseType: 'blob' // Important for file download
//       });

//       // Create a blob from the response data
//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       // Create a download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Set filename from Content-Disposition header or use default
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = 'dummy_invoice_report.xlsx';
      
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }
      
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       // Clean up the blob URL
//       window.URL.revokeObjectURL(url);
      
//       showSuccess('Report exported successfully');

//     } catch (error) {
//       console.error('Error exporting to Excel:', error);
      
//       // Handle error response as blob
//       if (error.response && error.response.data instanceof Blob) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           try {
//             const errorData = JSON.parse(reader.result);
//             showError(errorData.message || 'Failed to export report');
//           } catch (e) {
//             showError('Failed to export report');
//           }
//         };
//         reader.readAsText(error.response.data);
//       } else {
//         showError(error.response?.data?.message || error.message || 'Failed to export report');
//       }
//     } finally {
//       setExportingExcel(false);
//     }
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     if (customerType === 'CSD') {
//       return netAmount;
//     }
    
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     if (customerType === 'CSD') {
//       const halfRate = gstRate / 2;
//       const cgstAmount = 0;
//       const sgstAmount = taxable * (halfRate / 100);
//       return { cgstAmount, sgstAmount, halfRate, cgstRate: 0, sgstRate: halfRate };
//     }
    
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   const calculateSubtotal = () => {
//     return invoiceItems.reduce((sum, item) => {
//       const unitCost = parseFloat(item.unitCost) || 0;
//       const discount = parseFloat(item.discount) || 0;
//       const gstRate = parseFloat(item.gst_rate) || 0;
//       const lineTotal = unitCost - discount;
      
//       let taxableValue;
//       if (customerType === 'CSD') {
//         taxableValue = lineTotal;
//       } else if (gstRate === 0) {
//         taxableValue = lineTotal;
//       } else {
//         taxableValue = (lineTotal * 100) / (100 + gstRate);
//       }
      
//       const totalGST = lineTotal - taxableValue;
//       let cgstAmount, sgstAmount;
      
//       if (customerType === 'CSD') {
//         cgstAmount = 0;
//         sgstAmount = totalGST;
//       } else {
//         cgstAmount = totalGST / 2;
//         sgstAmount = totalGST / 2;
//       }
      
//       return sum + taxableValue + cgstAmount + sgstAmount;
//     }, 0);
//   };

//   // Generate Print HTML - Only include items with unitCost > 0
//   const generateInvoiceHTML = (booking, items, custType) => {
//     // Check print permission
//     if (!canPrintInvoice) {
//       showError('You do not have permission to print tax invoices');
//       return '';
//     }

//     // Filter out items with unitCost = 0
//     const nonZeroItems = items.filter(item => (item.unitCost || 0) > 0);
    
//     if (nonZeroItems.length === 0) {
//       showError('No items with positive values to print');
//       return '';
//     }

//     const currentDate = new Date().toLocaleDateString('en-GB');
//     const dob = booking.customerDetails.dob ? new Date(booking.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
//     // FILTER OUT insurance, RTO, and HPA items for the main table
//     const mainItems = nonZeroItems.filter(item => 
//       !item.is_insurance_header && 
//       !item.is_rto_header && 
//       !item.is_hpa_header
//     );
    
//     // Get insurance, RTO, HP items for separate display
//     const insuranceItems = nonZeroItems.filter(item => item.is_insurance_header);
//     const rtoItems = nonZeroItems.filter(item => item.is_rto_header);
//     const hpItems = nonZeroItems.filter(item => item.is_hpa_header);
    
//     // Calculate totals for main items
//     const mainItemsWithCalculations = mainItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     // Calculate totals for insurance items
//     const insuranceItemsWithCalculations = insuranceItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     // Calculate totals for RTO items
//     const rtoItemsWithCalculations = rtoItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     // Calculate totals for HP items
//     const hpItemsWithCalculations = hpItems.map(item => {
//       const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
//       const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
//       const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       return {
//         ...item,
//         taxable,
//         cgstAmount,
//         sgstAmount,
//         cgstRate,
//         sgstRate,
//         lineTotal
//       };
//     });

//     const totalAmount = mainItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
//     const insuranceCharges = insuranceItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
//     const rtoCharges = rtoItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
//     const hpCharges = booking.hpa ? hpItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0) : 0;

//     const totalB = insuranceCharges + rtoCharges + hpCharges;
//     const grandTotal = totalAmount + totalB;

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Tax Invoice - ${booking.bookingNumber}</title>
//         <style>
//           body {
//             font-family: "Courier New", Courier, monospace;
//             margin: 0;
//             padding: 10mm;
//             font-size: 14px;
//             color: #555555;
//           }
//           .page {
//             width: 210mm;
//             min-height: 297mm;
//             margin: 0 auto;
//           }
//           .invoice-title {
//             text-align: center;
//             font-size: 25px;
//             font-weight: bold;
//             margin-bottom: 5mm;
//           }
//           .header {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 2mm;
//           }
//           .header-left {
//             width: 70%;
//           }
//           .header-right {
//             width: 30%;
//             text-align: right;
//           }
//           .logo {
//             height: 50px;
//             margin-bottom: 2mm;
//           }
//           .dealer-info {
//             text-align: left;
//             font-size: 14px;
//             line-height: 1.2;
//           }
//           .rto-type {
//             text-align: left;
//             margin: 1mm 0;
//             font-weight: bold;
//           }
//           .customer-info-container {
//             display: flex;
//             font-size: 14px;
//           }
//           .customer-info-left, .customer-info-right {
//             width: 50%;
//           }
//           .customer-info-row {
//             margin: 1mm 0;
//             line-height: 1.2;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 9pt;
//             margin: 2mm 0;
//           }
//           th, td {
//             padding: 1mm;
//             border: 1px solid #000;
//             vertical-align: top;
//           }
//           .no-border { 
//             border: none !important; 
//             font-size: 14px;
//           }
//           .text-right { text-align: right; }
//           .text-center { text-align: center; }
//           .bold { 
//             font-weight: bold; 
//           }
//           .section-title {
//             font-weight: bold;
//             margin: 1mm 0;
//           }
//           .signature-box {
//             margin-top: 5mm;
//             font-size: 9pt;
//           }
//           .signature-line {
//             border-top: 1px dashed #000;
//             width: 40mm;
//             display: inline-block;
//             margin: 0 5mm;
//           }
//           .divider {
//             border-top: 2px solid #AAAAAA;
//             margin: 2mm 0;
//           }
//           .totals-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 2mm 0;
//           }
//           .totals-table td {
//             border: none;
//             padding: 1mm;
//           }
//           .total-divider {
//             border-top: 2px solid #AAAAAA;
//             height: 1px;
//             margin: 2px 0;
//           }
//           .broker-info {
//             display: flex;
//             justify-content: space-between;
//             padding: 1px;
//           }
//           .dummy-badge {
//             display: inline-block;
//             background-color: #ff9800;
//             color: white;
//             padding: 2px 8px;
//             border-radius: 4px;
//             font-size: 12px;
//             font-weight: bold;
//             margin-left: 10px;
//           }
//           .badge {
//             display: inline-block;
//             padding: 2px 6px;
//             border-radius: 3px;
//             font-size: 9px;
//             font-weight: bold;
//             margin-left: 4px;
//           }
//           @page {
//             size: A4;
//             margin: 0;
//           }
//           @media print {
//             body {
//               padding: 5mm;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="page">
//           <!-- Header Section -->
//           <div class="invoice-title">
//             TAX INVOICE
           
//           </div>
          
//           <div class="header">
//             <div class="header-left">
//               <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
//               <div class="dealer-info">
//                 Authorized Main Dealer: TVS Motor Company Ltd.<br>
//                 Registered office: ${booking.branch?.address || 'N/A'}<br>
//                 GSTIN: ${booking.branch?.gst_number || ''}<br>
//                 ${booking.branch?.name || ''}
//               </div>
//             </div>
//             <div class="header-right">
//               <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//               <div>Date: ${currentDate}</div>
//               ${booking.bookingType === 'SUBDEALER' ? `
//                 <div><b>Subdealer:</b> ${booking.subdealer?.name || ''}</div>
//                 <div><b>Address:</b> ${booking.subdealer?.location || ''}</div>
//               ` : ''}
//             </div>
//           </div>
          
//           <div class="divider"></div>
//           <div class="rto-type">RTO TYPE: ${booking.rto || 'MH'}</div>
//           <div class="divider"></div>

//           <!-- Customer Information -->
//           <div class="customer-info-container">
//             <div class="customer-info-left">
//               <div class="customer-info-row"><strong>Invoice Number:</strong> ${booking.bookingNumber}</div>
//               <div class="customer-info-row"><strong>Customer Name:</strong> ${booking.customerDetails.name}</div>
//               <div class="customer-info-row"><strong>Address:</strong> ${booking.customerDetails.address}, ${booking.customerDetails.taluka || ''}</div>
//               <div class="customer-info-row"><strong>Taluka:</strong> ${booking.customerDetails.taluka || 'N/A'}</div>
//               <div class="customer-info-row"><strong>Mobile No.:</strong> ${booking.customerDetails.mobile1}</div>
//               <div class="customer-info-row"><strong>Exchange Mode:</strong> ${booking.exchange ? 'YES' : 'NO'}</div>
//               <div class="customer-info-row"><strong>Aadhar No.:</strong> ${booking.customerDetails.aadharNumber || 'N/A'}</div>
//               <div class="customer-info-row"><strong>HPA:</strong> ${booking.hpa ? 'YES' : 'NO'}</div>
//             </div>
//             <div class="customer-info-right">
//               <div class="customer-info-row"><strong>GSTIN:</strong> ${booking.gstin || 'N/A'}</div>
//               <div class="customer-info-row"><strong>District:</strong> ${booking.customerDetails.district || 'N/A'}</div>
//               <div class="customer-info-row"><strong>Pincode:</strong> ${booking.customerDetails.pincode || 'N/A'}</div>
//               <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
//               <div class="customer-info-row"><strong>Payment Mode:</strong> ${booking.payment?.type || 'CASH'}</div>
//               <div class="customer-info-row"><strong>Financer:</strong> ${booking.payment?.financer?.name || ''}</div>
//               <div class="customer-info-row"><strong>Sales Representative:</strong> ${booking.salesExecutive?.name || 'N/A'}</div>
//               <div class="customer-info-row"><strong>Customer Type:</strong> ${custType}</div>
//             </div>
//           </div>
          
//           <div class="divider"></div>

//           <!-- Vehicle Details -->
//           <div class="section-title">Vehicle Details:</div>
//           <table class="no-border">
//             <tr>
//               <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${booking.model.model_name}</td>
//               <td class="no-border"><strong>Battery No:</strong> ${booking.batteryNumber || '000'}</td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>Chasis No:</strong> ${booking.chassisNumber}</td>
//               <td class="no-border"><strong>Colour:</strong> ${booking.color?.name || ''}</td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>Engine No:</strong> ${booking.vehicleRef?.engineNumber}</td>
//               <td class="no-border"><strong>Key No.:</strong> ${booking.keyNumber || '000'}</td>
//             </tr>
//           </table>

//           <!-- Price Breakdown Table - EXCLUDING Insurance, RTO, HPA -->
//           <div class="section-title">Price Breakdown:</div>
//           <table>
//             <tr>
//               <th style="width:25%">Particulars</th>
//               <th style="width:8%">HSN CODE</th>
//               <th style="width:8%">Unit Cost</th>
//               <th style="width:8%">Taxable</th>
//               <th style="width:5%">CGST%</th>
//               <th style="width:8%">CGST Amt</th>
//               <th style="width:5%">SGST%</th>
//               <th style="width:8%">SGST Amt</th>
//               <th style="width:10%">Line Total</th>
//             </tr>

//             ${mainItemsWithCalculations.map(item => `
//               <tr>
//                 <td>${item.header_key}</td>
//                 <td>${item.hsn_code}</td>
//                 <td>${item.unitCost.toFixed(2)}</td>
//                 <td>${item.taxable.toFixed(2)}</td>
//                 <td>${(item.cgstRate || 0).toFixed(2)}%</td>
//                 <td>${item.cgstAmount.toFixed(2)}</td>
//                 <td>${(item.sgstRate || 0).toFixed(2)}%</td>
//                 <td>${item.sgstAmount.toFixed(2)}</td>
//                 <td>${item.lineTotal.toFixed(2)}</td>
//               </tr>
//             `).join('')}
            
//             ${mainItemsWithCalculations.length === 0 ? `
//               <tr>
//                 <td colspan="9" class="text-center">No items available</td>
//               </tr>
//             ` : ''}
//           </table>

//           <!-- Totals Section - Show Insurance, RTO, HPA separately -->
//           <table class="totals-table">
//             <tr>
//               <td class="no-border" style="width:80%"><strong>Total (A) - Vehicle & Accessories</strong></td>
//               <td class="no-border text-right"><strong>${totalAmount.toFixed(2)}</strong></td>
//             </tr>
//             <tr>
//               <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//             </tr>
//             ${insuranceCharges > 0 ? `
//             <tr>
//               <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
//               <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
//             </tr>
//             ` : ''}
//             ${rtoCharges > 0 ? `
//             <tr>
//               <td class="no-border"><strong>RTO TAX & REGISTRATION</strong></td>
//               <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
//             </tr>
//             ` : ''}
//             ${booking.hpa && hpCharges > 0 ? `
//             <tr>
//               <td class="no-border"><strong>HP CHARGES</strong></td>
//               <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
//             </tr>
//             ` : ''}
//             <tr>
//               <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>TOTAL (B) - Other Charges</strong></td>
//               <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
//             </tr>
//             <tr>
//               <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//             </tr>
//             <tr>
//               <td class="no-border"><strong>GRAND TOTAL (A) + (B)</strong></td>
//               <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
//             </tr>
//           </table>

//           <!-- Exchange Details -->
//           ${booking.exchange ? `
//             <div class="broker-info">
//               <div><strong>Ex. Broker/Sub Dealer:</strong> ${booking.exchangeDetails?.broker?.name || ''}</div>
//               <div><strong>Ex. Veh No:</strong> ${booking.exchangeDetails?.vehicleNumber || ''}</div>
//             </div>
//           ` : ''}

//           <!-- Accessories -->
//           ${booking.accessories && booking.accessories.length > 0 ? `
//             <div style="margin-top:2mm;">
//               <div><strong>ACC.DETAILS:</strong>
//                 ${booking.accessories
//                   .map(acc => acc.accessory ? acc.accessory.name : '')
//                   .filter(name => name)
//                   .join(', ')}
//               </div>
//             </div>
//           ` : ''}

//           <div class="divider"></div>

//           <!-- Signature Section -->
//           <div class="signature-box">
//             <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Customer's Signature</div>
//               </div>
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Sales Executive</div>
//               </div>
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Manager</div>
//               </div>
//               <div style="text-align:center; width: 22%;">
//                 <div class="signature-line"></div>
//                 <div>Accountant</div>
//               </div>
//             </div>
//           </div>

//           <div style="text-align: center; margin-top: 5mm; font-size: 10px; color: #999;">
//             * This is a computer generated Tax invoice - not for commercial use *
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   const handlePrintInvoice = () => {
//     if (!canPrintInvoice) {
//       showError('You do not have permission to print tax invoices');
//       return;
//     }

//     if (!selectedBooking || invoiceItems.length === 0) {
//       setError('No invoice data available');
//       return;
//     }

//     // Filter out items with zero value for printing
//     const nonZeroItems = invoiceItems.filter(item => (item.unitCost || 0) > 0);
    
//     if (nonZeroItems.length === 0) {
//       showError('No items with positive values to print');
//       return;
//     }

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(generateInvoiceHTML(selectedBooking, invoiceItems, customerType));
//     printWindow.document.close();
//     printWindow.focus();
//   };

//   const handleResetModal = () => {
//     setSelectedBooking(null);
//     setInvoiceItems([]);
//     setCustomerType('B2C');
//   };

//   // Early return if no permission to view
//   if (!canViewDummyInvoice) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Proforma Invoice Generator.
//       </div>
//     );
//   }

//   if (loading && pagination.docs.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="title">Proforma Invoice Generator</div>
      
//       {error && (
//         <CAlert color="danger" className="mb-3" onClose={() => setError(null)} dismissible>
//           {error}
//         </CAlert>
//       )}

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="badge bg-warning text-dark me-3">Tax INVOICE</span>
//           </div>
//           <div className="d-flex">
//             <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder="Booking ID, Chassis, Customer..."
//               style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
//             />
//             <CButton 
//               color="success" 
//               className="ms-2"
//               onClick={handleExportExcel}
//               disabled={exportingExcel || !canExportExcel}
//               title={!canExportExcel ? "You don't have export permission" : ""}
//             >
//               {exportingExcel ? (
//                 <>
//                   <CSpinner size="sm" className="me-1" />
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilCloudDownload} className="me-1" />
//                   Export Excel
//                 </>
//               )}
//             </CButton>
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           {pagination.loading && pagination.docs.length > 0 && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}
          
//           <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {pagination.docs.length === 0 && !pagination.loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="8" className="text-center">
//                       {pagination.search ? 'No matching bookings found' : 'No allocated bookings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   pagination.docs.map((booking, index) => {
//                     const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={booking._id || index}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                         <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                         <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <span className="badge bg-success">{booking.status}</span>
//                         </CTableDataCell>
//                         <CTableDataCell className="text-center">
//                           <CButton
//                             size="sm"
//                             color="warning"
//                             className="action-btn"
//                             onClick={() => handleOpenInvoiceModal(booking)}
//                             disabled={!canCreateDummyInvoice}
//                             title={!canCreateDummyInvoice ? "You don't have permission to generate invoices" : "Generate Tax Invoice"}
//                           >
//                             <CIcon icon={cilPrint} className="me-1" />
//                             Generate Tax Invoice
//                           </CButton>
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {/* Pagination Component */}
//           {renderPagination()}
//         </CCardBody>
//       </CCard>

//       {/* Dummy Invoice Modal */}
//       <CModal 
//         visible={invoiceModal} 
//         onClose={() => {
//           setInvoiceModal(false);
//           handleResetModal();
//         }}
//         size="xl"
//         backdrop="static"
//         scrollable
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <div className="d-flex align-items-center">
//               <CIcon icon={cilCarAlt} className="me-2" />
//               Tax Invoice - {selectedBooking?.bookingNumber}
//               {!canEditInvoice && (
//                 <span className="badge bg-warning text-dark ms-3">VIEW ONLY</span>
//               )}
//               {canEditInvoice && (
//                 <span className="badge bg-success ms-3">EDIT MODE</span>
//               )}
//             </div>
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingInvoice ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading invoice details...</p>
//             </div>
//           ) : (
//             <div>
//               {/* Booking Summary */}
//               {selectedBooking && (
//                 <div className="border rounded p-3 mb-4 bg-light">
//                   <div className="row">
//                     <div className="col-md-6">
//                       <p className="mb-1"><strong>Customer:</strong> {selectedBooking.customerDetails?.name}</p>
//                       <p className="mb-1"><strong>Model:</strong> {selectedBooking.model?.model_name}</p>
//                       <p className="mb-1"><strong>Chassis:</strong> {selectedBooking.chassisNumber}</p>
//                       <p className="mb-1"><strong>HPA:</strong> {selectedBooking.hpa ? 'YES' : 'NO'}</p>
//                     </div>
//                     <div className="col-md-6">
//                       <p className="mb-1"><strong>Engine:</strong> {selectedBooking.engineNumber}</p>
//                       <p className="mb-1"><strong>Color:</strong> {selectedBooking.color?.name}</p>
//                       <p className="mb-1"><strong>Booking Date:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
//                       <p className="mb-1"><strong>Customer Type:</strong> {selectedBooking.customerType || 'B2C'}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Customer Type Selector */}
//               <div className="row mb-3">
//                 <div className="col-md-3">
//                   <CFormLabel>Customer Type</CFormLabel>
//                   <CFormSelect 
//                     value={customerType} 
//                     onChange={handleCustomerTypeChange}
//                     disabled={!canEditInvoice}
//                   >
//                     <option value="B2C">B2C</option>
//                     <option value="CSD">CSD</option>
//                   </CFormSelect>
//                   {!canEditInvoice && (
//                     <small className="text-muted">(View only - cannot change)</small>
//                   )}
//                 </div>
//               </div>

//               {/* Invoice Items Table */}
//               <div className="table-responsive">
//                 <CTable striped bordered hover>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell>Particulars</CTableHeaderCell>
//                       <CTableHeaderCell>HSN CODE</CTableHeaderCell>
//                       <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                       <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                       <CTableHeaderCell>CGST %</CTableHeaderCell>
//                       <CTableHeaderCell>CGST Amt</CTableHeaderCell>
//                       <CTableHeaderCell>SGST %</CTableHeaderCell>
//                       <CTableHeaderCell>SGST Amt</CTableHeaderCell>
//                       <CTableHeaderCell>Line Total</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {invoiceItems.map((item) => {
//                       const gstRate = item.gst_rate || 0;
//                       const unitCost = parseFloat(item.unitCost) || 0;
//                       const discount = 0; // Always use 0 discount
//                       const lineTotal = unitCost - discount;
                      
//                       // Calculate taxable amount based on customer type
//                       let taxableValue;
//                       if (customerType === 'CSD') {
//                         taxableValue = lineTotal;
//                       } else if (gstRate === 0) {
//                         taxableValue = lineTotal;
//                       } else {
//                         taxableValue = (lineTotal * 100) / (100 + gstRate);
//                       }
                      
//                       const totalGST = lineTotal - taxableValue;
//                       let cgstAmount, sgstAmount, cgstRate, sgstRate;
                      
//                       if (customerType === 'CSD') {
//                         cgstAmount = 0;
//                         sgstAmount = totalGST;
//                         cgstRate = 0;
//                         sgstRate = gstRate;
//                       } else {
//                         cgstAmount = totalGST / 2;
//                         sgstAmount = totalGST / 2;
//                         cgstRate = gstRate / 2;
//                         sgstRate = gstRate / 2;
//                       }
                      
//                       return (
//                         <CTableRow key={item.id}>
//                           <CTableDataCell>
//                             <div className="d-flex align-items-center">
//                               {item.header_key}
//                               {item.is_insurance_header && (
//                                 <span className="badge bg-info ms-2">Insurance</span>
//                               )}
//                               {item.is_rto_header && (
//                                 <span className="badge bg-secondary ms-2">RTO</span>
//                               )}
//                               {item.is_hpa_header && (
//                                 <span className="badge bg-primary ms-2">HPA</span>
//                               )}
//                             </div>
//                           </CTableDataCell>
//                           <CTableDataCell>{item.hsn_code}</CTableDataCell>
//                           <CTableDataCell>
//                             <CFormInput
//                               type="number"
//                               size="sm"
//                               min="0"
//                               step="0.01"
//                               value={item.unitCost}
//                               onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
//                               style={{ width: '120px' }}
//                               disabled={!canEditInvoice}
//                               readOnly={!canEditInvoice}
//                               placeholder={!canEditInvoice ? "Read only" : ""}
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>₹{taxableValue.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                           <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                           <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>
//                             <strong>₹{lineTotal.toFixed(2)}</strong>
//                           </CTableDataCell>
//                         </CTableRow>
//                       );
//                     })}
                    
//                     {invoiceItems.length === 0 && (
//                       <CTableRow>
//                         <CTableDataCell colSpan="9" className="text-center">
//                           No invoice items found
//                         </CTableDataCell>
//                       </CTableRow>
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>

//               {/* Summary Section */}
//               <div className="row mt-4">
//                 <div className="col-md-6 offset-md-6">
//                   <div className="border rounded p-3 bg-light">
//                     <h6 className="fw-bold mb-3">Summary</h6>
                    
//                     {/* Calculate total A (all items with unitCost > 0) */}
//                     <div className="d-flex justify-content-between mb-2">
//                       <span>Total (A):</span>
//                       <span className="fw-bold">₹{invoiceItems.reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0).toFixed(2)}</span>
//                     </div>
                    
//                     {/* Find and show Insurance charges (only if > 0) */}
//                     {invoiceItems.some(item => item.is_insurance_header && (item.unitCost || 0) > 0) && (
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>INSURANCE CHARGES:</span>
//                         <span className="fw-bold">₹{
//                           invoiceItems
//                             .filter(item => item.is_insurance_header)
//                             .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
//                             .toFixed(2)
//                         }</span>
//                       </div>
//                     )}
                    
//                     {/* Find and show RTO charges (only if > 0) */}
//                     {invoiceItems.some(item => item.is_rto_header && (item.unitCost || 0) > 0) && (
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>RTO TAX & REGISTRATION:</span>
//                         <span className="fw-bold">₹{
//                           invoiceItems
//                             .filter(item => item.is_rto_header)
//                             .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
//                             .toFixed(2)
//                         }</span>
//                       </div>
//                     )}
                    
//                     {/* Find and show HPA/HP charges (only if > 0) */}
//                     {selectedBooking?.hpa && invoiceItems.some(item => item.is_hpa_header && (item.unitCost || 0) > 0) && (
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>HP CHARGES:</span>
//                         <span className="fw-bold">₹{
//                           invoiceItems
//                             .filter(item => item.is_hpa_header)
//                             .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
//                             .toFixed(2)
//                         }</span>
//                       </div>
//                     )}
                    
//                     <div className="border-top pt-2 mt-2">
//                       <div className="d-flex justify-content-between">
//                         <span className="fw-bold">GRAND TOTAL:</span>
//                         <span className="fw-bold fs-5">₹{calculateSubtotal().toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setInvoiceModal(false);
//               handleResetModal();
//             }}
//           >
//             Cancel
//           </CButton>
          
//           {/* Export Excel Button inside modal */}
//           <CButton 
//             color="info" 
//             onClick={handleExportExcel}
//             disabled={exportingExcel || !canExportExcel}
//             title={!canExportExcel ? "You don't have export permission" : ""}
//           >
//             {exportingExcel ? (
//               <>
//                 <CSpinner size="sm" className="me-1" />
//                 Exporting...
//               </>
//             ) : (
//               <>
//                 <CIcon icon={cilCloudDownload} className="me-1" />
//                 Export Excel
//               </>
//             )}
//           </CButton>
          
//           {/* Save & Print Button - Only show if user has create permission */}
//           {canCreateDummyInvoice && (
//             <CButton 
//               color="success" 
//               onClick={handleSaveAndPrintInvoice}
//               disabled={savingInvoice || invoiceItems.length === 0 || loadingInvoice}
//             >
//               {savingInvoice ? (
//                 <>
//                   <CSpinner size="sm" className="me-2" />
//                   Saving & Printing...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilSave} className="me-1" />
//                   Save & Print Invoice
//                 </>
//               )}
//             </CButton>
//           )}
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default DummyInvoice;


import React, { useState, useEffect } from 'react';
import '../../css/invoice.css';
import '../../css/form.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPrint, cilSearch, cilCarAlt, cilSave, cilCloudDownload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import tvsLogo from '../../assets/images/logo1.png';
import { useAuth } from '../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS 
} from '../../utils/modulePermissions';

// Pagination constants
const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
const DEFAULT_LIMIT = 50;

const DummyInvoice = () => {
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Invoice Modal States
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  
  // Customer Type for GST calculation
  const [customerType, setCustomerType] = useState('B2C');

  // Pagination states - similar to DeliveryChallan and Receipt
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: ''
  });

  const navigate = useNavigate();
  const { permissions = [] } = useAuth();

  // Add this ref to track component mount status
  const isMounted = React.useRef(true);
  
  // Debounce timer for search
  const searchTimer = React.useRef(null);

  // ============ DUMMY INVOICE PERMISSIONS ============
  const canViewDummyInvoice = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.DUMMY_INVOICE, 
    ACTIONS.VIEW
  );

  const canCreateDummyInvoice = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.DUMMY_INVOICE, 
    ACTIONS.CREATE
  );

  const canUpdateDummyInvoice = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.DUMMY_INVOICE, 
    ACTIONS.UPDATE
  );

  const canDeleteDummyInvoice = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.DUMMY_INVOICE, 
    ACTIONS.DELETE
  );

  const canExportDummyInvoice = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.DUMMY_INVOICE, 
    ACTIONS.EXPORT
  );

  // Combined permissions
  const canGenerateInvoice = canCreateDummyInvoice; // Only CREATE permission for generating new invoices
  const canPrintInvoice = canViewDummyInvoice; // Print is considered part of view
  const canExportExcel = canExportDummyInvoice || canCreateDummyInvoice; // Export permission or fallback to create
  const canEditInvoice = canCreateDummyInvoice || canUpdateDummyInvoice; // For editing capabilities

  // Add this to your useEffect that fetches data initially
  useEffect(() => {
    isMounted.current = true;
    
    if (!canViewDummyInvoice) {
      showError('You do not have permission to view Tax Invoice Generator');
      setLoading(false);
      return;
    }
    
    fetchAllocatedBookings(1, DEFAULT_LIMIT, '');
    
    return () => {
      isMounted.current = false;
      // Clear any pending search timers
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [canViewDummyInvoice]);

  // Fetch data with pagination and search - similar to DeliveryChallan
  const fetchAllocatedBookings = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    // Don't set loading if component is unmounting
    if (!isMounted.current) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      setError(null); // Clear any previous errors
      
      const params = { 
        status: 'ALLOCATED',
        hasChassis: true, // Add this param if your API supports it
        page, 
        limit 
      };
      
      // Add search parameter if provided
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const response = await axiosInstance.get('/bookings', { params });
      
      if (!isMounted.current) return;
      
      const responseData = response.data.data || {};
      const bookings = responseData.bookings || [];
      const total = responseData.total || bookings.length;
      const pages = responseData.pages || Math.ceil(total / limit) || 1;

      // CRITICAL: Always set loading to false, even with empty results
      setPagination({
        docs: bookings,
        total: total,
        pages: pages,
        currentPage: page,
        limit: limit,
        loading: false, // ALWAYS set loading to false
        search: search
      });
      
      // Also update filteredBookings for backward compatibility
      setFilteredBookings(bookings);
      
    } catch (error) {
      if (!isMounted.current) return;
      
      const message = showError(error);
      if (message) setError(message);
      
      // CRITICAL: Always set loading to false and provide empty docs
      setPagination({
        docs: [],
        total: 0,
        pages: 1,
        currentPage: 1,
        limit: limit,
        loading: false, // ALWAYS set loading to false
        search: search
      });
    }
  };

  // Handle search with debounce - similar to DeliveryChallan
  const handleSearch = (value) => {
    if (!canViewDummyInvoice) {
      return;
    }
    
    setSearchTerm(value);
    setError(null); // Clear any previous errors when starting new search
    
    // Clear any pending search timer
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      // Only fetch if component is still mounted
      if (isMounted.current) {
        // If search is empty or just spaces, fetch without search parameter
        if (!value.trim()) {
          fetchAllocatedBookings(1, pagination.limit, '');
        } else {
          fetchAllocatedBookings(1, pagination.limit, value);
        }
      }
    }, 400);
  };

  // Handle page change - similar to DeliveryChallan
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchAllocatedBookings(newPage, pagination.limit, pagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change - similar to DeliveryChallan
  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchAllocatedBookings(1, limit, pagination.search);
  };

  // Render pagination component - similar to DeliveryChallan
  const renderPagination = () => {
    const { currentPage, pages, total, limit, loading } = pagination;
    if (!total || pages <= 1) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(5, pages);
    if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

    const pageNums = [];
    for (let i = startPage; i <= endPage; i++) pageNums.push(i);

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={limit}
              onChange={e => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1 || loading}
            >
              «
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem 
                  onClick={() => handlePageChange(1)} 
                  disabled={loading}
                >
                  1
                </CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {pageNums.map(p => (
              <CPaginationItem 
                key={p} 
                active={p === currentPage} 
                onClick={() => handlePageChange(p)} 
                disabled={loading}
              >
                {p}
              </CPaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem 
                  onClick={() => handlePageChange(pages)} 
                  disabled={loading}
                >
                  {pages}
                </CPaginationItem>
              </>
            )}

            <CPaginationItem 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === pages || loading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handlePageChange(pages)} 
              disabled={currentPage === pages || loading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const handleOpenInvoiceModal = async (booking) => {
    // Check permission before opening modal - require at least VIEW permission
    if (!canViewDummyInvoice) {
      showError('You do not have permission to view tax invoices');
      return;
    }

    try {
      setLoadingInvoice(true);
      
      // Fetch complete booking data with all details
      const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${booking._id}`);
      const bookingData = bookingResponse.data.data.bookingDetails;
      const finalStatus = bookingResponse.data.data.finalStatus || '';
      
      // Merge the fetched data with the original booking
      const completeBooking = {
        ...booking,
        ...bookingData,
        finalStatus
      };
      
      setSelectedBooking(completeBooking);
      setCustomerType(completeBooking.customerType || 'B2C');
      
      // Define ONLY summary headers to exclude (not the individual components)
      const excludedHeaders = [
        'ON ROAD PRICE',
        'ON ROAD PRICE (A)',
        'TOTAL ONROAD + ADDON SERVICES',
        'TOTAL ONROAD+ADDON SERVICES',
        'ADDON SERVICES TOTAL',
        'ADD ON SERVICES TOTAL',
        'ADDON SERVICES TOTAL (B)',
        'ACCESSORIES TOTAL',
        'TOTAL AMOUNT',
        'GRAND TOTAL',
        'FINAL AMOUNT',
        'TOTAL',
        'ON-ROAD PRICE',
        'FINAL PRICE',
        'LESS:- CENTER SUBSIDY(FAME-II)',
        'COMPLETE PRICE'
      ];
      
      // Include ALL price components - no filtering except summary headers
      let items = [];
      
      if (completeBooking.priceComponents && Array.isArray(completeBooking.priceComponents)) {
        items = completeBooking.priceComponents
          // Only filter out summary headers, NOT insurance/rto/hpa
          .filter(comp => comp.header && comp.header.header_key)
          .filter(comp => !excludedHeaders.includes(comp.header.header_key))
          .map(comp => {
            const headerKey = comp.header.header_key || 'Unknown';
            
            // Get HSN code from header.metadata
            const hsnCode = comp.header?.metadata?.hsn_code || 'N/A';
            
            // Get GST rate from header.metadata
            let gstRatePercentage = 0;
            if (comp.header?.metadata?.gst_rate) {
              const gstStr = comp.header.metadata.gst_rate.toString();
              gstRatePercentage = parseFloat(gstStr.replace('%', '')) || 0;
            }
            
            // Check if this is an HPA-related header
            const isHPAHeader = headerKey.startsWith('HP') || 
                                headerKey.startsWith('HPA') ||
                                headerKey.toLowerCase().includes('hypothecation') ||
                                headerKey.toLowerCase().includes('loan');
            
            // Check if this is Insurance header
            const isInsuranceHeader = /INSURANCE|INSURCANCE|INSUR|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
            
            // Check if this is RTO header
            const isRTOHeader = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES|RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES/i.test(headerKey);
            
            // Check if this is Accessory
            const isAccessory = headerKey.toLowerCase().includes('accessories') || 
                               headerKey.toLowerCase().includes('accessory') ||
                               comp.category_key === 'ACCESSORIES';
            
            // Apply HPA filter - only skip if HPA is disabled AND it's an HPA header
            if (isHPAHeader && !completeBooking.hpa) {
              return null;
            }
            
            return {
              id: comp.header?._id || comp.header?.id || `item-${Math.random()}`,
              header_key: headerKey,
              header_id: comp.header?._id || comp.header?.id, // Store header ID for API
              hsn_code: hsnCode,
              unitCost: 0, // Set default to 0
              originalUnitCost: comp.originalValue || 0,
              discount: 0, // Keep but will be ignored
              gst_rate: gstRatePercentage,
              is_mandatory: comp.isMandatory || false,
              is_discount: comp.isDiscountable || false,
              category_key: comp.header?.category_key || '',
              is_hpa_header: isHPAHeader,
              is_insurance_header: isInsuranceHeader,
              is_rto_header: isRTOHeader,
              is_accessory: isAccessory,
              // Store calculated values
              taxableValue: 0, // Will be calculated in render
              cgstAmount: 0,
              sgstAmount: 0,
              lineTotal: 0, // Set to 0
              header: comp.header
            };
          })
          .filter(item => item !== null);
      }
      
      // Sort items: mandatory first, then by header_key
      items.sort((a, b) => {
        if (a.is_mandatory && !b.is_mandatory) return -1;
        if (!a.is_mandatory && b.is_mandatory) return 1;
        return (a.header_key || '').localeCompare(b.header_key || '');
      });
      
      console.log('Dummy Invoice Items - ALL INCLUDED:', items);
      setInvoiceItems(items);
      setInvoiceModal(true);
      
    } catch (error) {
      console.error('Error preparing invoice:', error);
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleUnitCostChange = (itemId, value) => {
    // Check if user has permission to edit (CREATE or UPDATE)
    if (!canEditInvoice) {
      showError('You do not have permission to edit invoice amounts');
      return;
    }

    setInvoiceItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const newUnitCost = parseFloat(value) || 0;
          return {
            ...item,
            unitCost: newUnitCost
          };
        }
        return item;
      })
    );
  };

  const handleCustomerTypeChange = (e) => {
    // Check if user has permission to edit (CREATE or UPDATE)
    if (!canEditInvoice) {
      showError('You do not have permission to change customer type');
      return;
    }
    setCustomerType(e.target.value);
  };

  // API Integration: Save Dummy Invoice and then Print
  const handleSaveAndPrintInvoice = async () => {
    if (!canCreateDummyInvoice) {
      showError('You do not have permission to save invoices');
      return;
    }

    if (!selectedBooking) {
      showError('No booking selected');
      return;
    }

    // Validate that at least one item has unit cost > 0
    const hasValidItems = invoiceItems.some(item => (item.unitCost || 0) > 0);
    if (!hasValidItems) {
      showError('Please enter at least one unit cost value before saving');
      return;
    }

    try {
      setSavingInvoice(true);

      // Prepare headerPrices object - ONLY include items with unitCost > 0
      const headerPrices = {};
      
      invoiceItems.forEach(item => {
        // Only include if header_id exists and unitCost is greater than 0
        if (item.header_id && item.unitCost > 0) {
          headerPrices[item.header_id] = item.unitCost;
        }
      });

      // Check if we have any valid header prices
      if (Object.keys(headerPrices).length === 0) {
        showError('No valid header prices to save');
        setSavingInvoice(false);
        return;
      }

      const payload = {
        bookingId: selectedBooking._id,
        headerPrices: headerPrices
      };

      console.log('Saving dummy invoice with ONLY non-zero items:', payload);

      const response = await axiosInstance.post('/dummy-invoices', payload);

      if (response.data.success) {
        showSuccess('Invoice saved successfully');
        
        // After successful save, automatically print the invoice
        handlePrintInvoice();
        
        // Close the modal after a short delay
        setTimeout(() => {
          setInvoiceModal(false);
          handleResetModal();
        }, 1000);
      } else {
        throw new Error(response.data.message || 'Failed to save invoice');
      }

    } catch (error) {
      console.error('Error saving invoice:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save invoice';
      showError(errorMessage);
    } finally {
      setSavingInvoice(false);
    }
  };

  // API Integration: Export to Excel
  const handleExportExcel = async () => {
    if (!canExportExcel) {
      showError('You do not have EXPORT permission for Dummy Invoice');
      return;
    }

    try {
      setExportingExcel(true);
      
      // Make the API call with responseType blob to handle file download
      const response = await axiosInstance.get('/reports/dummy-Invoice', {
        params: {
          format: 'excel'
        },
        responseType: 'blob' // Important for file download
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'dummy_invoice_report.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
      
      showSuccess('Report exported successfully');

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      
      // Handle error response as blob
      if (error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            showError(errorData.message || 'Failed to export report');
          } catch (e) {
            showError('Failed to export report');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        showError(error.response?.data?.message || error.message || 'Failed to export report');
      }
    } finally {
      setExportingExcel(false);
    }
  };

  const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
    const netAmount = unitCost - (discount || 0);
    const gstRateDecimal = gstRate / 100;
    
    if (customerType === 'CSD') {
      return netAmount;
    }
    
    if (gstRateDecimal === 0) {
      return netAmount;
    }
    
    return netAmount / (1 + gstRateDecimal);
  };

  const calculateGST = (taxable, gstRate, customerType) => {
    if (customerType === 'CSD') {
      const halfRate = gstRate / 2;
      const cgstAmount = 0;
      const sgstAmount = taxable * (halfRate / 100);
      return { cgstAmount, sgstAmount, halfRate, cgstRate: 0, sgstRate: halfRate };
    }
    
    const halfRate = gstRate / 2;
    const cgstAmount = taxable * (halfRate / 100);
    const sgstAmount = taxable * (halfRate / 100);
    return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
  };

  const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
    return taxable + cgstAmount + sgstAmount;
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => {
      const unitCost = parseFloat(item.unitCost) || 0;
      const discount = parseFloat(item.discount) || 0;
      const gstRate = parseFloat(item.gst_rate) || 0;
      const lineTotal = unitCost - discount;
      
      let taxableValue;
      if (customerType === 'CSD') {
        taxableValue = lineTotal;
      } else if (gstRate === 0) {
        taxableValue = lineTotal;
      } else {
        taxableValue = (lineTotal * 100) / (100 + gstRate);
      }
      
      const totalGST = lineTotal - taxableValue;
      let cgstAmount, sgstAmount;
      
      if (customerType === 'CSD') {
        cgstAmount = 0;
        sgstAmount = totalGST;
      } else {
        cgstAmount = totalGST / 2;
        sgstAmount = totalGST / 2;
      }
      
      return sum + taxableValue + cgstAmount + sgstAmount;
    }, 0);
  };

  // Generate Print HTML - Only include items with unitCost > 0
  const generateInvoiceHTML = (booking, items, custType) => {
    // Check print permission
    if (!canPrintInvoice) {
      showError('You do not have permission to print tax invoices');
      return '';
    }

    // Filter out items with unitCost = 0
    const nonZeroItems = items.filter(item => (item.unitCost || 0) > 0);
    
    if (nonZeroItems.length === 0) {
      showError('No items with positive values to print');
      return '';
    }

    const currentDate = new Date().toLocaleDateString('en-GB');
    const dob = booking.customerDetails.dob ? new Date(booking.customerDetails.dob).toLocaleDateString('en-GB') : 'N/A';
    
    // FILTER OUT insurance, RTO, and HPA items for the main table
    const mainItems = nonZeroItems.filter(item => 
      !item.is_insurance_header && 
      !item.is_rto_header && 
      !item.is_hpa_header
    );
    
    // Get insurance, RTO, HP items for separate display
    const insuranceItems = nonZeroItems.filter(item => item.is_insurance_header);
    const rtoItems = nonZeroItems.filter(item => item.is_rto_header);
    const hpItems = nonZeroItems.filter(item => item.is_hpa_header);
    
    // Calculate totals for main items
    const mainItemsWithCalculations = mainItems.map(item => {
      const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
      const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
      const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
      return {
        ...item,
        taxable,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate,
        lineTotal
      };
    });

    // Calculate totals for insurance items
    const insuranceItemsWithCalculations = insuranceItems.map(item => {
      const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
      const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
      const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
      return {
        ...item,
        taxable,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate,
        lineTotal
      };
    });

    // Calculate totals for RTO items
    const rtoItemsWithCalculations = rtoItems.map(item => {
      const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
      const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
      const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
      return {
        ...item,
        taxable,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate,
        lineTotal
      };
    });

    // Calculate totals for HP items
    const hpItemsWithCalculations = hpItems.map(item => {
      const taxable = calculateTaxableAmount(item.unitCost, item.discount, item.gst_rate, custType);
      const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, item.gst_rate, custType);
      const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
      return {
        ...item,
        taxable,
        cgstAmount,
        sgstAmount,
        cgstRate,
        sgstRate,
        lineTotal
      };
    });

    const totalAmount = mainItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
    const insuranceCharges = insuranceItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
    const rtoCharges = rtoItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0);
    const hpCharges = booking.hpa ? hpItemsWithCalculations.reduce((sum, item) => sum + item.lineTotal, 0) : 0;

    const totalB = insuranceCharges + rtoCharges + hpCharges;
    const grandTotal = totalAmount + totalB;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${booking.bookingNumber}</title>
        <style>
          body {
            font-family: "Courier New", Courier, monospace;
            margin: 0;
            padding: 10mm;
            font-size: 14px;
            color: #555555;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
          }
          .invoice-title {
            text-align: center;
            font-size: 25px;
            font-weight: bold;
            margin-bottom: 5mm;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2mm;
          }
          .header-left {
            width: 70%;
          }
          .header-right {
            width: 30%;
            text-align: right;
          }
          .logo {
            height: 50px;
            margin-bottom: 2mm;
          }
          .dealer-info {
            text-align: left;
            font-size: 14px;
            line-height: 1.2;
          }
          .rto-type {
            text-align: left;
            margin: 1mm 0;
            font-weight: bold;
          }
          .customer-info-container {
            display: flex;
            font-size: 14px;
          }
          .customer-info-left, .customer-info-right {
            width: 50%;
          }
          .customer-info-row {
            margin: 1mm 0;
            line-height: 1.2;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin: 2mm 0;
          }
          th, td {
            padding: 1mm;
            border: 1px solid #000;
            vertical-align: top;
          }
          .no-border { 
            border: none !important; 
            font-size: 14px;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .bold { 
            font-weight: bold; 
          }
          .section-title {
            font-weight: bold;
            margin: 1mm 0;
          }
          .signature-box {
            margin-top: 5mm;
            font-size: 9pt;
          }
          .signature-line {
            border-top: 1px dashed #000;
            width: 40mm;
            display: inline-block;
            margin: 0 5mm;
          }
          .divider {
            border-top: 2px solid #AAAAAA;
            margin: 2mm 0;
          }
          .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin: 2mm 0;
          }
          .totals-table td {
            border: none;
            padding: 1mm;
          }
          .total-divider {
            border-top: 2px solid #AAAAAA;
            height: 1px;
            margin: 2px 0;
          }
          .broker-info {
            display: flex;
            justify-content: space-between;
            padding: 1px;
          }
          .dummy-badge {
            display: inline-block;
            background-color: #ff9800;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            margin-left: 4px;
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
          <div class="invoice-title">
            TAX INVOICE
           
          </div>
          
          <div class="header">
            <div class="header-left">
              <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
              <div class="dealer-info">
                Authorized Main Dealer: TVS Motor Company Ltd.<br>
                Registered office: ${booking.branch?.address || 'N/A'}<br>
                GSTIN: ${booking.branch?.gst_number || ''}<br>
                ${booking.branch?.name || ''}
              </div>
            </div>
            <div class="header-right">
              <img src="${tvsLogo}" class="logo" alt="TVS Logo">
              <div>Date: ${currentDate}</div>
              ${booking.bookingType === 'SUBDEALER' ? `
                <div><b>Subdealer:</b> ${booking.subdealer?.name || ''}</div>
                <div><b>Address:</b> ${booking.subdealer?.location || ''}</div>
              ` : ''}
            </div>
          </div>
          
          <div class="divider"></div>
          <div class="rto-type">RTO TYPE: ${booking.rto || 'MH'}</div>
          <div class="divider"></div>

          <!-- Customer Information -->
          <div class="customer-info-container">
            <div class="customer-info-left">
              <div class="customer-info-row"><strong>Invoice Number:</strong> ${booking.bookingNumber}</div>
              <div class="customer-info-row"><strong>Customer Name:</strong> ${booking.customerDetails.name}</div>
              <div class="customer-info-row"><strong>Address:</strong> ${booking.customerDetails.address}, ${booking.customerDetails.taluka || ''}</div>
              <div class="customer-info-row"><strong>Taluka:</strong> ${booking.customerDetails.taluka || 'N/A'}</div>
              <div class="customer-info-row"><strong>Mobile No.:</strong> ${booking.customerDetails.mobile1}</div>
              <div class="customer-info-row"><strong>Exchange Mode:</strong> ${booking.exchange ? 'YES' : 'NO'}</div>
              <div class="customer-info-row"><strong>Aadhar No.:</strong> ${booking.customerDetails.aadharNumber || 'N/A'}</div>
              <div class="customer-info-row"><strong>HPA:</strong> ${booking.hpa ? 'YES' : 'NO'}</div>
            </div>
            <div class="customer-info-right">
              <div class="customer-info-row"><strong>GSTIN:</strong> ${booking.gstin || 'N/A'}</div>
              <div class="customer-info-row"><strong>District:</strong> ${booking.customerDetails.district || 'N/A'}</div>
              <div class="customer-info-row"><strong>Pincode:</strong> ${booking.customerDetails.pincode || 'N/A'}</div>
              <div class="customer-info-row"><strong>D.O.B:</strong> ${dob}</div>
              <div class="customer-info-row"><strong>Payment Mode:</strong> ${booking.payment?.type || 'CASH'}</div>
              <div class="customer-info-row"><strong>Financer:</strong> ${booking.payment?.financer?.name || ''}</div>
              <div class="customer-info-row"><strong>Sales Representative:</strong> ${booking.salesExecutive?.name || 'N/A'}</div>
              <div class="customer-info-row"><strong>Customer Type:</strong> ${custType}</div>
            </div>
          </div>
          
          <div class="divider"></div>

          <!-- Vehicle Details -->
          <div class="section-title">Vehicle Details:</div>
          <table class="no-border">
            <tr>
              <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${booking.model.model_name}</td>
              <td class="no-border"><strong>Battery No:</strong> ${booking.batteryNumber || '000'}</td>
            </tr>
            <tr>
              <td class="no-border"><strong>Chasis No:</strong> ${booking.chassisNumber}</td>
              <td class="no-border"><strong>Colour:</strong> ${booking.color?.name || ''}</td>
            </tr>
            <tr>
              <td class="no-border"><strong>Engine No:</strong> ${booking.vehicleRef?.engineNumber}</td>
              <td class="no-border"><strong>Key No.:</strong> ${booking.keyNumber || '000'}</td>
            </tr>
          </table>

          <!-- Price Breakdown Table - EXCLUDING Insurance, RTO, HPA -->
          <div class="section-title">Price Breakdown:</div>
          <table>
            <tr>
              <th style="width:25%">Particulars</th>
              <th style="width:8%">HSN CODE</th>
              <th style="width:8%">Unit Cost</th>
              <th style="width:8%">Taxable</th>
              <th style="width:5%">CGST%</th>
              <th style="width:8%">CGST Amt</th>
              <th style="width:5%">SGST%</th>
              <th style="width:8%">SGST Amt</th>
              <th style="width:10%">Line Total</th>
            </tr>

            ${mainItemsWithCalculations.map(item => `
              <tr>
                <td>${item.header_key}</td>
                <td>${item.hsn_code}</td>
                <td>${item.unitCost.toFixed(2)}</td>
                <td>${item.taxable.toFixed(2)}</td>
                <td>${(item.cgstRate || 0).toFixed(2)}%</td>
                <td>${item.cgstAmount.toFixed(2)}</td>
                <td>${(item.sgstRate || 0).toFixed(2)}%</td>
                <td>${item.sgstAmount.toFixed(2)}</td>
                <td>${item.lineTotal.toFixed(2)}</td>
              </tr>
            `).join('')}
            
            ${mainItemsWithCalculations.length === 0 ? `
              <tr>
                <td colspan="9" class="text-center">No items available</td>
              </tr>
            ` : ''}
          </table>

          <!-- Totals Section - Show Insurance, RTO, HPA separately -->
          <table class="totals-table">
            <tr>
              <td class="no-border" style="width:80%"><strong>Total (A) - Vehicle & Accessories</strong></td>
              <td class="no-border text-right"><strong>${totalAmount.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td colspan="2" class="no-border"><div class="total-divider"></div></td>
            </tr>
            ${insuranceCharges > 0 ? `
            <tr>
              <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
              <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
            </tr>
            ` : ''}
            ${rtoCharges > 0 ? `
            <tr>
              <td class="no-border"><strong>RTO TAX & REGISTRATION</strong></td>
              <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
            </tr>
            ` : ''}
            ${booking.hpa && hpCharges > 0 ? `
            <tr>
              <td class="no-border"><strong>HP CHARGES</strong></td>
              <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="2" class="no-border"><div class="total-divider"></div></td>
            </tr>
            <tr>
              <td class="no-border"><strong>TOTAL (B) - Other Charges</strong></td>
              <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td colspan="2" class="no-border"><div class="total-divider"></div></td>
            </tr>
            <tr>
              <td class="no-border"><strong>GRAND TOTAL (A) + (B)</strong></td>
              <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
            </tr>
          </table>

          <!-- Exchange Details -->
          ${booking.exchange ? `
            <div class="broker-info">
              <div><strong>Ex. Broker/Sub Dealer:</strong> ${booking.exchangeDetails?.broker?.name || ''}</div>
              <div><strong>Ex. Veh No:</strong> ${booking.exchangeDetails?.vehicleNumber || ''}</div>
            </div>
          ` : ''}

          <!-- Accessories -->
          ${booking.accessories && booking.accessories.length > 0 ? `
            <div style="margin-top:2mm;">
              <div><strong>ACC.DETAILS:</strong>
                ${booking.accessories
                  .map(acc => acc.accessory ? acc.accessory.name : '')
                  .filter(name => name)
                  .join(', ')}
              </div>
            </div>
          ` : ''}

          <div class="divider"></div>

          <!-- Signature Section -->
          <div class="signature-box">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <div style="text-align:center; width: 22%;">
                <div class="signature-line"></div>
                <div>Customer's Signature</div>
              </div>
              <div style="text-align:center; width: 22%;">
                <div class="signature-line"></div>
                <div>Sales Executive</div>
              </div>
              <div style="text-align:center; width: 22%;">
                <div class="signature-line"></div>
                <div>Manager</div>
              </div>
              <div style="text-align:center; width: 22%;">
                <div class="signature-line"></div>
                <div>Accountant</div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 5mm; font-size: 10px; color: #999;">
            * This is a computer generated Tax invoice - not for commercial use *
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintInvoice = () => {
    if (!canPrintInvoice) {
      showError('You do not have permission to print tax invoices');
      return;
    }

    if (!selectedBooking || invoiceItems.length === 0) {
      setError('No invoice data available');
      return;
    }

    // Filter out items with zero value for printing
    const nonZeroItems = invoiceItems.filter(item => (item.unitCost || 0) > 0);
    
    if (nonZeroItems.length === 0) {
      showError('No items with positive values to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateInvoiceHTML(selectedBooking, invoiceItems, customerType));
    printWindow.document.close();
    printWindow.focus();
  };

  const handleResetModal = () => {
    setSelectedBooking(null);
    setInvoiceItems([]);
    setCustomerType('B2C');
  };

  // Early return if no permission to view
  if (!canViewDummyInvoice) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Proforma Invoice Generator.
      </div>
    );
  }

  // Show initial loading only on first load
  if (loading && pagination.docs.length === 0 && !pagination.search) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="title">Proforma Invoice Generator</div>
      
      {error && (
        <CAlert color="danger" className="mb-3" onClose={() => setError(null)} dismissible>
          {error}
        </CAlert>
      )}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-warning text-dark me-3">Tax INVOICE</span>
            <span className="text-muted">Total Records: {pagination.total}</span>
          </div>
          <div className="d-flex">
            <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Booking ID, Chassis, Customer..."
              style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
            />
            <CButton 
              color="success" 
              className="ms-2"
              onClick={handleExportExcel}
              disabled={exportingExcel || !canExportExcel}
              title={!canExportExcel ? "You don't have export permission" : ""}
            >
              {exportingExcel ? (
                <>
                  <CSpinner size="sm" className="me-1" />
                  Exporting...
                </>
              ) : (
                <>
                  <CIcon icon={cilCloudDownload} className="me-1" />
                  Export Excel
                </>
              )}
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {pagination.loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Searching records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 && !pagination.loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      {pagination.search ? `No matching bookings found for "${pagination.search}"` : 'No allocated bookings available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((booking, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={booking._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
                        <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>
                        <CTableDataCell>
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-success">{booking.status}</span>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            size="sm"
                            color="warning"
                            className="action-btn"
                            onClick={() => handleOpenInvoiceModal(booking)}
                            disabled={!canCreateDummyInvoice}
                            title={!canCreateDummyInvoice ? "You don't have permission to generate invoices" : "Generate Tax Invoice"}
                          >
                            <CIcon icon={cilPrint} className="me-1" />
                            Generate Tax Invoice
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component - only show if there are records */}
          {pagination.total > 0 && renderPagination()}
        </CCardBody>
      </CCard>

      {/* Dummy Invoice Modal */}
      <CModal 
        visible={invoiceModal} 
        onClose={() => {
          setInvoiceModal(false);
          handleResetModal();
        }}
        size="xl"
        backdrop="static"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            <div className="d-flex align-items-center">
              <CIcon icon={cilCarAlt} className="me-2" />
              Tax Invoice - {selectedBooking?.bookingNumber}
              {!canEditInvoice && (
                <span className="badge bg-warning text-dark ms-3">VIEW ONLY</span>
              )}
              {canEditInvoice && (
                <span className="badge bg-success ms-3">EDIT MODE</span>
              )}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingInvoice ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading invoice details...</p>
            </div>
          ) : (
            <div>
              {/* Booking Summary */}
              {selectedBooking && (
                <div className="border rounded p-3 mb-4 bg-light">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Customer:</strong> {selectedBooking.customerDetails?.name}</p>
                      <p className="mb-1"><strong>Model:</strong> {selectedBooking.model?.model_name}</p>
                      <p className="mb-1"><strong>Chassis:</strong> {selectedBooking.chassisNumber}</p>
                      <p className="mb-1"><strong>HPA:</strong> {selectedBooking.hpa ? 'YES' : 'NO'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Engine:</strong> {selectedBooking.engineNumber}</p>
                      <p className="mb-1"><strong>Color:</strong> {selectedBooking.color?.name}</p>
                      <p className="mb-1"><strong>Booking Date:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>Customer Type:</strong> {selectedBooking.customerType || 'B2C'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Type Selector */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <CFormLabel>Customer Type</CFormLabel>
                  <CFormSelect 
                    value={customerType} 
                    onChange={handleCustomerTypeChange}
                    disabled={!canEditInvoice}
                  >
                    <option value="B2C">B2C</option>
                    <option value="CSD">CSD</option>
                  </CFormSelect>
                  {!canEditInvoice && (
                    <small className="text-muted">(View only - cannot change)</small>
                  )}
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="table-responsive">
                <CTable striped bordered hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Particulars</CTableHeaderCell>
                      <CTableHeaderCell>HSN CODE</CTableHeaderCell>
                      <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
                      <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
                      <CTableHeaderCell>CGST %</CTableHeaderCell>
                      <CTableHeaderCell>CGST Amt</CTableHeaderCell>
                      <CTableHeaderCell>SGST %</CTableHeaderCell>
                      <CTableHeaderCell>SGST Amt</CTableHeaderCell>
                      <CTableHeaderCell>Line Total</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {invoiceItems.map((item) => {
                      const gstRate = item.gst_rate || 0;
                      const unitCost = parseFloat(item.unitCost) || 0;
                      const discount = 0; // Always use 0 discount
                      const lineTotal = unitCost - discount;
                      
                      // Calculate taxable amount based on customer type
                      let taxableValue;
                      if (customerType === 'CSD') {
                        taxableValue = lineTotal;
                      } else if (gstRate === 0) {
                        taxableValue = lineTotal;
                      } else {
                        taxableValue = (lineTotal * 100) / (100 + gstRate);
                      }
                      
                      const totalGST = lineTotal - taxableValue;
                      let cgstAmount, sgstAmount, cgstRate, sgstRate;
                      
                      if (customerType === 'CSD') {
                        cgstAmount = 0;
                        sgstAmount = totalGST;
                        cgstRate = 0;
                        sgstRate = gstRate;
                      } else {
                        cgstAmount = totalGST / 2;
                        sgstAmount = totalGST / 2;
                        cgstRate = gstRate / 2;
                        sgstRate = gstRate / 2;
                      }
                      
                      return (
                        <CTableRow key={item.id}>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              {item.header_key}
                              {item.is_insurance_header && (
                                <span className="badge bg-info ms-2">Insurance</span>
                              )}
                              {item.is_rto_header && (
                                <span className="badge bg-secondary ms-2">RTO</span>
                              )}
                              {item.is_hpa_header && (
                                <span className="badge bg-primary ms-2">HPA</span>
                              )}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>{item.hsn_code}</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="number"
                              size="sm"
                              min="0"
                              step="0.01"
                              value={item.unitCost}
                              onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                              style={{ width: '120px' }}
                              disabled={!canEditInvoice}
                              readOnly={!canEditInvoice}
                              placeholder={!canEditInvoice ? "Read only" : ""}
                            />
                          </CTableDataCell>
                          <CTableDataCell>₹{taxableValue.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
                          <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
                          <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>
                            <strong>₹{lineTotal.toFixed(2)}</strong>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                    
                    {invoiceItems.length === 0 && (
                      <CTableRow>
                        <CTableDataCell colSpan="9" className="text-center">
                          No invoice items found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>

              {/* Summary Section */}
              <div className="row mt-4">
                <div className="col-md-6 offset-md-6">
                  <div className="border rounded p-3 bg-light">
                    <h6 className="fw-bold mb-3">Summary</h6>
                    
                    {/* Calculate total A (all items with unitCost > 0) */}
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total (A):</span>
                      <span className="fw-bold">₹{invoiceItems.reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0).toFixed(2)}</span>
                    </div>
                    
                    {/* Find and show Insurance charges (only if > 0) */}
                    {invoiceItems.some(item => item.is_insurance_header && (item.unitCost || 0) > 0) && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>INSURANCE CHARGES:</span>
                        <span className="fw-bold">₹{
                          invoiceItems
                            .filter(item => item.is_insurance_header)
                            .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
                            .toFixed(2)
                        }</span>
                      </div>
                    )}
                    
                    {/* Find and show RTO charges (only if > 0) */}
                    {invoiceItems.some(item => item.is_rto_header && (item.unitCost || 0) > 0) && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>RTO TAX & REGISTRATION:</span>
                        <span className="fw-bold">₹{
                          invoiceItems
                            .filter(item => item.is_rto_header)
                            .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
                            .toFixed(2)
                        }</span>
                      </div>
                    )}
                    
                    {/* Find and show HPA/HP charges (only if > 0) */}
                    {selectedBooking?.hpa && invoiceItems.some(item => item.is_hpa_header && (item.unitCost || 0) > 0) && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>HP CHARGES:</span>
                        <span className="fw-bold">₹{
                          invoiceItems
                            .filter(item => item.is_hpa_header)
                            .reduce((sum, item) => sum + (parseFloat(item.unitCost) || 0), 0)
                            .toFixed(2)
                        }</span>
                      </div>
                    )}
                    
                    <div className="border-top pt-2 mt-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">GRAND TOTAL:</span>
                        <span className="fw-bold fs-5">₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setInvoiceModal(false);
              handleResetModal();
            }}
          >
            Cancel
          </CButton>
          
          {/* Export Excel Button inside modal */}
          <CButton 
            color="info" 
            onClick={handleExportExcel}
            disabled={exportingExcel || !canExportExcel}
            title={!canExportExcel ? "You don't have export permission" : ""}
          >
            {exportingExcel ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Exporting...
              </>
            ) : (
              <>
                <CIcon icon={cilCloudDownload} className="me-1" />
                Export Excel
              </>
            )}
          </CButton>
          
          {/* Save & Print Button - Only show if user has create permission */}
          {canCreateDummyInvoice && (
            <CButton 
              color="success" 
              onClick={handleSaveAndPrintInvoice}
              disabled={savingInvoice || invoiceItems.length === 0 || loadingInvoice}
            >
              {savingInvoice ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Saving & Printing...
                </>
              ) : (
                <>
                  <CIcon icon={cilSave} className="me-1" />
                  Save & Print Invoice
                </>
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default DummyInvoice;