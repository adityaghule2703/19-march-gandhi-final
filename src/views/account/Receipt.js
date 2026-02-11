
// import React, { useState, useEffect } from 'react';
// import { 
//   CBadge, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CFormLabel,
//   CAlert,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import ReceiptModal from './ReceiptModal';
// import { confirmVerify } from '../../utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle, cilPrint, cilSettings, cilPlus } from '@coreui/icons';
// import { numberToWords } from '../../utils/numberToWords';
// import { Menu, MenuItem } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import QRCode from 'qrcode';
// import { faFileExcel, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Swal from 'sweetalert2';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import TextField from '@mui/material/TextField';
// import { enIN } from 'date-fns/locale';

// // Import permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   SafePagePermissionGuard 
// } from '../../utils/modulePermissions';

// function Receipt() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [bookingsData, setBookingsData] = useState([]);
//   const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
//   const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuBookingId, setMenuBookingId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [bookingReceipts, setBookingReceipts] = useState({}); // Store receipts for each booking
//   const [cashLocations, setCashLocations] = useState([]); // Add state for cash locations
  
//   // Excel Export states
//   const [openExportModal, setOpenExportModal] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);
//   const [exportError, setExportError] = useState('');
//   const [branches, setBranches] = useState([]);

// //   const { permissions } = useAuth();
//   const { permissions = [], user } = useAuth();
//   const hasAllBranchAccess = user?.branchAccess === "ALL";
//   // Page-level VIEW permission check for Receipts page
//   const canViewReceipts = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW
//   );

//   // Page-level CREATE permission check for Excel export
//   const canCreateReceipts = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.CREATE
//   );

//   // Tab-level VIEW permission checks (based on TABS.RECEIPTS constants)
//   const canViewCustomerTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW,
//     TABS.RECEIPTS.CUSTOMER
//   );
  
//   const canViewPaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW,
//     TABS.RECEIPTS.PAYMENT_VERIFICATION
//   );
  
//   const canViewCompletePaymentTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW,
//     TABS.RECEIPTS.COMPLETE_PAYMENT
//   );
  
//   const canViewPendingListTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW,
//     TABS.RECEIPTS.PENDING_LIST
//   );
  
//   const canViewVerifiedListTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW,
//     TABS.RECEIPTS.VERIFIED_LIST
//   );
  
//   // Tab-level CREATE permission checks
//   const canCreateInCustomerTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.CREATE,
//     TABS.RECEIPTS.CUSTOMER
//   );
  
//   const canCreateInPaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.CREATE,
//     TABS.RECEIPTS.PAYMENT_VERIFICATION
//   );
  
//   const canCreateInCompletePaymentTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.CREATE,
//     TABS.RECEIPTS.COMPLETE_PAYMENT
//   );
  
//   const canCreateInPendingListTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.CREATE,
//     TABS.RECEIPTS.PENDING_LIST
//   );
  
//   const canCreateInVerifiedListTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.CREATE,
//     TABS.RECEIPTS.VERIFIED_LIST
//   );
  
//   // Tab-level UPDATE permission checks (if needed for Update buttons)
//   const canUpdateInCustomerTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.UPDATE,
//     TABS.RECEIPTS.CUSTOMER
//   );
  
//   const canUpdateInPaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.UPDATE,
//     TABS.RECEIPTS.PAYMENT_VERIFICATION
//   );
  
//   // Tab-level VIEW permission for Print functionality
//   const canPrintInCustomerTab = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.RECEIPTS, 
//     ACTIONS.VIEW,
//     TABS.RECEIPTS.CUSTOMER
//   ) || canViewCustomerTab; // VIEW permission includes print/view capabilities
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewCustomerTab || canViewPaymentVerificationTab || 
//                        canViewCompletePaymentTab || canViewPendingListTab || 
//                        canViewVerifiedListTab;

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewCustomerTab) visibleTabs.push(0);
//     if (canViewPaymentVerificationTab) visibleTabs.push(1);
//     if (canViewCompletePaymentTab) visibleTabs.push(2);
//     if (canViewPendingListTab) visibleTabs.push(3);
//     if (canViewVerifiedListTab) visibleTabs.push(4);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewCustomerTab, canViewPaymentVerificationTab, 
//       canViewCompletePaymentTab, canViewPendingListTab, canViewVerifiedListTab, activeTab]);

//   useEffect(() => {
//     if (!canViewReceipts) {
//       showError('You do not have permission to view Receipts');
//       setLoading(false);
//       return;
//     }
    
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Receipt tabs');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchPendingPayments();
//     fetchVerifiedPayments();
//     fetchCashLocations(); // Fetch cash locations when component loads
//     fetchBranches(); // Fetch branches for export
//   }, [canViewReceipts, canViewAnyTab]);

//   useEffect(() => {
//     // Make the printReceiptInvoice function available globally for ReceiptModal to call
//     window.printReceiptCallback = printReceiptInvoice;
    
//     return () => {
//       // Clean up when component unmounts
//       delete window.printReceiptCallback;
//     };
//   }, []); // Empty dependency array ensures this runs only once

//   const fetchCashLocations = async () => {
//     try {
//       // Try different endpoints - adjust based on your API
//       const endpoints = [
//         '/cash-locations',
//         '/cashlocations',
//         '/settings/cash-locations',
//         '/master/cash-locations'
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await axiosInstance.get(endpoint);
//           if (response.data.success && response.data.data) {
//             setCashLocations(response.data.data);
//             console.log('Cash locations loaded:', response.data.data);
//             return;
//           }
//         } catch (err) {
//           // Continue to next endpoint
//           console.log(`Endpoint ${endpoint} not available`);
//         }
//       }
      
//       // If no endpoint works, create a fallback
//       console.warn('Could not fetch cash locations from any endpoint');
//       setCashLocations([]);
//     } catch (error) {
//       console.error('Error fetching cash locations:', error);
//       setCashLocations([]);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);
//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setBookingsData(branchBookings);
      
//       // Fetch receipts for each booking
//       const receiptsPromises = branchBookings.map(async (booking) => {
//         try {
//           const receiptsResponse = await axiosInstance.get(`/ledger/booking/${booking._id}`);
//           return {
//             bookingId: booking._id,
//             receipts: receiptsResponse.data.data.allReceipts || []
//           };
//         } catch (error) {
//           console.error(`Error fetching receipts for booking ${booking._id}:`, error);
//           return {
//             bookingId: booking._id,
//             receipts: []
//           };
//         }
//       });
      
//       const receiptsResults = await Promise.all(receiptsPromises);
//       const receiptsMap = {};
//       receiptsResults.forEach(result => {
//         receiptsMap[result.bookingId] = result.receipts;
//       });
      
//       setBookingReceipts(receiptsMap);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPendingPayments = async () => {
//     if (!canViewReceipts || !canViewPaymentVerificationTab) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/ledger/pending`);
//       setPendingPaymentsData(response.data.data.ledgerEntries);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchVerifiedPayments = async () => {
//     if (!canViewReceipts || !canViewVerifiedListTab) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/payment/verified/bank/ledger`);
//       setVerifiedPaymentsData(response.data.data.ledgerEntries);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   // Format date to DD-MM-YYYY for display
//   const formatDateDDMMYYYY = (date) => {
//     if (!date) return '';
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Format date to YYYY-MM-DD for API
//   const formatDateForAPI = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };


//   const filterData = (data, searchTerm) => {
//     if (!searchTerm) return data;

//     const searchFields = getDefaultSearchFields('receipts');
//     const term = searchTerm.toLowerCase();

//     return data.filter((row) =>
//       searchFields.some((field) => {
//         const value = field.split('.').reduce((obj, key) => {
//           if (!obj) return '';
//           if (key.match(/^\d+$/)) return obj[parseInt(key)];
//           return obj[key];
//         }, row);

//         if (value === undefined || value === null) return false;

//         if (typeof value === 'boolean') {
//           return (value ? 'yes' : 'no').includes(term);
//         }
//         if (field === 'createdAt' && value instanceof Date) {
//           return value.toLocaleDateString('en-GB').includes(term);
//         }
//         if (typeof value === 'number') {
//           return String(value).includes(term);
//         }
//         return String(value).toLowerCase().includes(term);
//       })
//     );
//   };


//   const filterPendingPayments = (data, searchTerm) => {
//   if (!searchTerm) return data;
  
//   const term = searchTerm.toLowerCase();
  
//   return data.filter((entry) => {
//     return (
//       (entry.bookingDetails?.bookingNumber || '').toLowerCase().includes(term) ||
//       (entry.bookingDetails?.customerDetails?.name || '').toLowerCase().includes(term) ||
//       (entry.paymentMode || '').toLowerCase().includes(term) ||
//       String(entry.amount || '').includes(term) ||
//       (entry.transactionReference || '').toLowerCase().includes(term)
//     );
//   });
// };

// const filterVerifiedPayments = (data, searchTerm) => {
//   if (!searchTerm) return data;
  
//   const term = searchTerm.toLowerCase();
  
//   return data.filter((entry) => {
//     return (
//       (entry.booking || '').toLowerCase().includes(term) ||
//       (entry.bookingDetails?.customerDetails?.name || '').toLowerCase().includes(term) ||
//       (entry.paymentMode || '').toLowerCase().includes(term) ||
//       String(entry.amount || '').includes(term) ||
//       (entry.transactionReference || '').toLowerCase().includes(term) ||
//       (entry.receivedByDetails?.name || '').toLowerCase().includes(term)
//     );
//   });
// };
//   const filteredBookings = filterData(bookingsData, searchTerm);
//   const completePayments = filterData(
//     bookingsData.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0),
//     searchTerm
//   );
//   const pendingPayments = filterData(
//     bookingsData.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0),
//     searchTerm
//   );
//   // const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchTerm);

//   const filteredPendingLedgerEntries = filterPendingPayments(pendingPaymentsData, searchTerm);
//   const filteredVerifiedLedgerEntries = filterVerifiedPayments(verifiedPaymentsData, searchTerm);

//   const handleMenuClick = (event, bookingId) => {
//     setAnchorEl(event.currentTarget);
//     setMenuBookingId(bookingId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMenuBookingId(null);
//   };

//   const handleAddClick = (booking) => {
//     // Check CREATE permission for the CUSTOMER tab
//     if (!canCreateInCustomerTab) {
//       showError('You do not have permission to add payments');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//     handleMenuClose();
//   };

//   const handleVerifyPayment = async (entry) => {
//     // Check CREATE permission for the PAYMENT VERIFICATION tab
//     if (!canCreateInPaymentVerificationTab) {
//       showError('You do not have permission to verify payments');
//       return;
//     }
    
//     try {
//       const result = await confirmVerify({
//         title: 'Confirm Payment Verification',
//         text: `Are you sure you want to verify the payment of ₹${entry.amount} for booking ${entry.bookingDetails?.bookingNumber || entry.booking}?`,
//         confirmButtonText: 'Yes, verify it!'
//       });

//       if (result.isConfirmed) {
//         await axiosInstance.patch(`/ledger/approve/${entry._id}`, {
//           remark: ''
//         });
//         setSuccessMessage('Payment verified successfully!');
//         setTimeout(() => setSuccessMessage(''), 3000);
//         fetchPendingPayments();
//         fetchVerifiedPayments();
//       }
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       showError(error, 'Failed to verify payment');
//     }
//   };

//   const handleTabChange = (tab) => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setSearchTerm('');
//   };
//   const handleOpenExportModal = () => {

//     if (!canCreateReceipts) {
//       showError('You do not have permission to export data');
//       return;
//     }
    
//     setOpenExportModal(true);
//     setExportError('');
//   };

//   const handleCloseExportModal = () => {
//     setOpenExportModal(false);
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedBranchId('');
//     setExportError('');
//   };

//   const handleExcelExport = async () => {
//     // Check CREATE permission for Excel export
//     if (!canCreateReceipts) {
//       showError('You do not have permission to export data');
//       return;
//     }
    
//     // Clear previous errors
//     setExportError('');
    
//     if (!selectedBranchId) {
//       setExportError('Please select a branch');
//       return;
//     }

//     if (!startDate || !endDate) {
//       setExportError('Please select both start and end dates');
//       return;
//     }

//     if (startDate > endDate) {
//       setExportError('Start date cannot be after end date');
//       return;
//     }

//     try {
//       setExportLoading(true);
      
//       const formattedStartDate = formatDateForAPI(startDate);
//       const formattedEndDate = formatDateForAPI(endDate);

//       // Build query parameters for the receipts API
//       const params = new URLSearchParams({
//         branchId: selectedBranchId,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         format: 'excel'
//       });

//       // Use the provided API endpoint for receipts
//       const response = await axiosInstance.get(
//         `/reports/receipts?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       // Check content type to see if it's an error
//       const contentType = response.headers['content-type'];
      
//       if (contentType && contentType.includes('application/json')) {
//         // It's a JSON error response, parse it
//         const text = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsText(response.data);
//         });
        
//         const errorData = JSON.parse(text);
        
//         // Show the exact error message from API
//         if (!errorData.success && errorData.message) {
//           setExportError(errorData.message);
//           Swal.fire({
//             icon: 'error',
//             title: 'Export Failed',
//             text: errorData.message,
//           });
//           return;
//         }
//       }

//       // Handle Excel file download
//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Generate filename with DD-MM-YYYY format
//       const branchName = branches.find(b => b._id === selectedBranchId)?.name || 'Branch';
//       const startDateStr = formatDateDDMMYYYY(startDate);
//       const endDateStr = formatDateDDMMYYYY(endDate);
//       const fileName = `Receipts_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       window.URL.revokeObjectURL(url);
      
//       // Show success message
//       Swal.fire({
//         toast: true,
//         position: 'top-end',
//         icon: 'success',
//         title: 'Excel exported successfully!',
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true
//       });

//       handleCloseExportModal();
      
//     } catch (error) {
//       console.error('Error exporting report:', error);
      
//       // For blob errors, we need to read the blob
//       if (error.response && error.response.data instanceof Blob) {
//         try {
//           const text = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsText(error.response.data);
//           });
          
//           const errorData = JSON.parse(text);
          
//           // Show the exact error message from API
//           if (errorData.message) {
//             setExportError(errorData.message);
//             Swal.fire({
//               icon: 'error',
//               title: 'Export Failed',
//               text: errorData.message,
//             });
//           }
//         } catch (parseError) {
//           console.error('Error parsing error response:', parseError);
//           setExportError('Failed to export report');
//           Swal.fire({
//             icon: 'error',
//             title: 'Export Failed',
//             text: 'Failed to export report',
//           });
//         }
//       } else if (error.response?.data?.message) {
//         // Regular error with message in response
//         setExportError(error.response.data.message);
//         Swal.fire({
//           icon: 'error',
//           title: 'Export Failed',
//           text: error.response.data.message,
//         });
//       } else if (error.message) {
//         // Network or other errors
//         setExportError(error.message);
//         Swal.fire({
//           icon: 'error',
//           title: 'Export Failed',
//           text: error.message,
//         });
//       } else {
//         setExportError('Failed to export report');
//         Swal.fire({
//           icon: 'error',
//           title: 'Export Failed',
//           text: 'Failed to export report',
//         });
//       }
      
//     } finally {
//       setExportLoading(false);
//     }
//   };

  
// //   const printReceiptInvoice = async (receiptId, bookingId, receiptIndex = 0) => {
// //     // Check VIEW permission for the CUSTOMER tab (print is a view action)
// //     if (!canPrintInCustomerTab) {
// //       showError('You do not have permission to print invoices');
// //       return;
// //     }
    
// //     try {
// //       // Fetch receipt details
// //       const receiptResponse = await axiosInstance.get(`/ledger/receipt/${receiptId}`);
// //       const receiptData = receiptResponse.data.data.receipt;
      
// //       // Fetch booking details
// //       const bookingResponse = await axiosInstance.get(`/ledger/booking/${bookingId}`);
// //       const bookingData = bookingResponse.data.data.bookingDetails;
// //       const finalStatus = bookingResponse.data.data.finalStatus || '';
// //       const qrCodeData = receiptData.qrCodeData || {};
      
// //       // Get booking totals
// //       const priceComponents = bookingData.priceComponents || [];
// //       const filteredPriceComponents = priceComponents.filter((comp) => {
// //         const headerKey = comp.header?.header_key?.toUpperCase() || '';

// //         const isInsurance = /INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
// //         const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
// //         const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

// //         return !(isInsurance || isRTO || isHypothecation);
// //       });

// //       const totalA = filteredPriceComponents.reduce((sum, item) => sum + (item.discountedValue || 0), 0);
      
// //       const findComponentByKeywords = (keywords) => {
// //         return priceComponents.find((comp) => {
// //           const headerKey = comp.header?.header_key?.toUpperCase() || '';
// //           return keywords.some((keyword) => headerKey.includes(keyword));
// //         });
// //       };

// //       const insuranceComponent = findComponentByKeywords([
// //         'INSURANCE', 'INSURCANCE', 'INSURANCE CHARGES', 'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
// //       ]);
// //       const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

// //       const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
// //       const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;

// //       const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
// //       const hpCharges = hpComponent ? hpComponent.originalValue : bookingData.hypothecationCharges || 0;

// //       const totalB = insuranceCharges + rtoCharges + hpCharges;
// //       const grandTotal = totalA + totalB;

// //       // Create QR code text data
// //       const qrText = `GANDHI MOTORS PVT LTD
// // Booking Number: ${qrCodeData.bookingNumber || bookingData.bookingNumber}
// // Customer: ${qrCodeData.customerName || bookingData.customerDetails?.name}
// // Mobile: ${qrCodeData.mobileNo || bookingData.customerDetails?.mobile1}
// // Model: ${qrCodeData.modelName || bookingData.model?.model_name}
// // Chassis: ${qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated'}
// // Payment Type: ${qrCodeData.paymentType || bookingData.payment?.type}
// // Total Amount: ₹${grandTotal.toFixed(2)}
// // Receipt: ${receiptData.receiptNumber || 'N/A'}
// // Amount: ${receiptData.display?.amount || `₹${receiptData.amount?.toFixed(2) || '0'}`}
// // Payment Mode: ${receiptData.paymentMode || 'Cash'}
// // Reference: ${receiptData.transactionReference || 'N/A'}
// // Date: ${new Date(receiptData.receiptDate).toLocaleDateString('en-GB')}`;

// //       // Generate QR code as data URL
// //       let qrCodeImage = '';
// //       try {
// //         qrCodeImage = await QRCode.toDataURL(qrText, {
// //           width: 250,
// //           margin: 3,
// //           color: {
// //             dark: '#000000',
// //             light: '#FFFFFF'
// //           },
// //           errorCorrectionLevel: 'H'
// //         });
// //       } catch (error) {
// //         console.error('Error generating QR code:', error);
// //         qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
// //           <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250">
// //             <rect width="250" height="250" fill="white"/>
// //             <rect x="20" y="20" width="210" height="210" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
// //             <text x="125" y="115" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">QR CODE</text>
// //             <text x="125" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">Receipt: ${receiptData.receiptNumber}</text>
// //             <text x="125" y="160" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">Scan for details</text>
// //           </svg>
// //         `);
// //       }

// //       const transformedData = {
// //         bookingNumber: bookingData.bookingNumber,
// //         bookingType: bookingData.bookingType,
// //         rto: bookingData.rto,
// //         hpa: bookingData.hpa,
// //         hypothecationCharges: bookingData.hypothecationCharges || 0,
// //         gstin: bookingData.gstin || '',
// //         model: {
// //           model_name: bookingData.model?.model_name || 'N/A'
// //         },
// //         chassisNumber: qrCodeData.chassisNo || bookingData.chassisNumber,
// //         engineNumber: bookingData.vehicle?.engineNumber || bookingData.engineNumber,
// //         batteryNumber: bookingData.vehicle?.batteryNumber || '',
// //         keyNumber: bookingData.vehicle?.keyNumber || '',
// //         color: {
// //           name: bookingData.color?.name || ''
// //         },
// //         customerDetails: {
// //           name: bookingData.customerDetails?.name || 'N/A',
// //           address: bookingData.customerDetails?.address || '',
// //           taluka: bookingData.customerDetails?.taluka || '',
// //           district: bookingData.customerDetails?.district || '',
// //           pincode: bookingData.customerDetails?.pincode || '',
// //           mobile1: bookingData.customerDetails?.mobile1 || '',
// //           dob: bookingData.customerDetails?.dob || '',
// //           aadharNumber: bookingData.customerDetails?.aadharNumber || ''
// //         },
// //         exchange: bookingData.exchange,
// //         exchangeDetails: bookingData.exchangeDetails,
// //         payment: {
// //           type: bookingData.payment?.type || 'CASH',
// //           financer: bookingData.payment?.financer
// //         },
// //         salesExecutive: bookingData.salesExecutive,
// //         branch: {
// //           gst_number: bookingData.branch?.gst_number || ''
// //         },
// //         accessories: bookingData.accessories || [],
// //         priceComponents: bookingData.priceComponents || [],
// //         subdealer: bookingData.subdealer || '',
// //         receivedAmount: bookingData.receivedAmount || 0,
// //         finalStatus: finalStatus || '',
// //         recentPayment: receiptData,
// //         qrCodeData: qrCodeData,
// //         qrCodeImage: qrCodeImage,
// //         qrCodeText: qrText,
// //         recentPaymentAmount: receiptData.amount || 0,
// //         calculatedTotals: {
// //           totalA,
// //           totalB,
// //           grandTotal,
// //           insuranceCharges,
// //           rtoCharges,
// //           hpCharges
// //         }
// //       };

// //       // Check if this is the first receipt or subsequent receipts
// //       const isFirstReceipt = receiptIndex === 0;
      
// //       const invoiceHTML = generateReceiptInvoiceHTML(transformedData, isFirstReceipt);

// //       const printWindow = window.open('', '_blank');
// //       printWindow.document.write(invoiceHTML);
// //       printWindow.document.close();
      
// //       // Wait for content to load then trigger browser print dialog
// //       printWindow.onload = function() {
// //         printWindow.focus();
// //         printWindow.print();
// //       };
      
// //     } catch (error) {
// //       console.error('Error generating receipt invoice:', error);
// //       showError(error, 'Failed to generate receipt invoice');
// //     }
// //   };

 
// const printReceiptInvoice = async (receiptId, bookingId, receiptIndex = 0) => {
//   if (!canPrintInCustomerTab) {
//     showError('You do not have permission to print invoices');
//     return;
//   }
  
//   try {
//     const receiptResponse = await axiosInstance.get(`/ledger/receipt/${receiptId}`);
//     const receiptData = receiptResponse.data.data.receipt;
    
//     const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${bookingId}`);
//     const bookingData = bookingResponse.data.data.bookingDetails;
//     const finalStatus = bookingResponse.data.data.finalStatus || '';
//     const qrCodeData = receiptData.qrCodeData || {};
    
//     const subsidyAmount = bookingData.subsidyAmount || 0;
//     const isEV = bookingData.model?.type === 'EV';
    
//     // Get booking totals
//     const priceComponents = bookingData.priceComponents || [];
//     const filteredPriceComponents = priceComponents.filter((comp) => {
//       const headerKey = comp.header?.header_key?.toUpperCase() || '';

//       const isInsurance = /INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
//       const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
//       const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

//       return !(isInsurance || isRTO || isHypothecation);
//     });

//     const totalA = filteredPriceComponents.reduce((sum, item) => sum + (item.discountedValue || 0), 0);
    
//     const findComponentByKeywords = (keywords) => {
//       return priceComponents.find((comp) => {
//         const headerKey = comp.header?.header_key?.toUpperCase() || '';
//         return keywords.some((keyword) => headerKey.includes(keyword));
//       });
//     };

//     const insuranceComponent = findComponentByKeywords([
//       'INSURANCE', 'INSURCANCE', 'INSURANCE CHARGES', 'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
//     ]);
//     const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

//     const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
//     const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;

//     const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
//     const hpCharges = hpComponent ? hpComponent.originalValue : bookingData.hypothecationCharges || 0;

//     const totalB = insuranceCharges + rtoCharges + hpCharges;
    
//     // Apply subsidy only for EV models
//     const subsidyDisplay = isEV && subsidyAmount > 0 ? subsidyAmount : 0;
//     const grandTotal = totalA + totalB - subsidyDisplay;

//     // Create QR code text data
//     const qrText = `GANDHI MOTORS PVT LTD
// Booking Number: ${qrCodeData.bookingNumber || bookingData.bookingNumber}
// Customer: ${qrCodeData.customerName || bookingData.customerDetails?.name}
// Mobile: ${qrCodeData.mobileNo || bookingData.customerDetails?.mobile1}
// Model: ${qrCodeData.modelName || bookingData.model?.model_name}
// Type: ${bookingData.model?.type || 'N/A'}
// Chassis: ${qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated'}
// Payment Type: ${qrCodeData.paymentType || bookingData.payment?.type}
// Total Amount: ₹${grandTotal.toFixed(2)}
// ${isEV && subsidyAmount > 0 ? `Subsidy: -₹${subsidyAmount.toFixed(2)}` : ''}
// Receipt: ${receiptData.receiptNumber || 'N/A'}
// Amount: ${receiptData.display?.amount || `₹${receiptData.amount?.toFixed(2) || '0'}`}
// Payment Mode: ${receiptData.paymentMode || 'Cash'}
// Reference: ${receiptData.transactionReference || 'N/A'}
// Date: ${new Date(receiptData.receiptDate).toLocaleDateString('en-GB')}`;

//     // Generate QR code as data URL
//     let qrCodeImage = '';
//     try {
//       qrCodeImage = await QRCode.toDataURL(qrText, {
//         width: 250,
//         margin: 3,
//         color: {
//           dark: '#000000',
//           light: '#FFFFFF'
//         },
//         errorCorrectionLevel: 'H'
//       });
//     } catch (error) {
//       console.error('Error generating QR code:', error);
//       qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
//         <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250">
//           <rect width="250" height="250" fill="white"/>
//           <rect x="20" y="20" width="210" height="210" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
//           <text x="125" y="115" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">QR CODE</text>
//           <text x="125" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">Receipt: ${receiptData.receiptNumber}</text>
//           <text x="125" y="160" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">Scan for details</text>
//         </svg>
//       `);
//     }

//     const transformedData = {
//       bookingNumber: bookingData.bookingNumber,
//       bookingType: bookingData.bookingType,
//       rto: bookingData.rto,
//       hpa: bookingData.hpa,
//       hypothecationCharges: bookingData.hypothecationCharges || 0,
//       gstin: bookingData.gstin || '',
//       model: {
//         model_name: bookingData.model?.model_name || 'N/A',
//         type: bookingData.model?.type || 'N/A' // Add type to model
//       },
//       chassisNumber: qrCodeData.chassisNo || bookingData.chassisNumber,
//       engineNumber: bookingData.vehicle?.engineNumber || bookingData.engineNumber,
//       batteryNumber: bookingData.vehicle?.batteryNumber || '',
//       keyNumber: bookingData.vehicle?.keyNumber || '',
//       color: {
//         name: bookingData.color?.name || ''
//       },
//       customerDetails: {
//         name: bookingData.customerDetails?.name || 'N/A',
//         address: bookingData.customerDetails?.address || '',
//         taluka: bookingData.customerDetails?.taluka || '',
//         district: bookingData.customerDetails?.district || '',
//         pincode: bookingData.customerDetails?.pincode || '',
//         mobile1: bookingData.customerDetails?.mobile1 || '',
//         dob: bookingData.customerDetails?.dob || '',
//         aadharNumber: bookingData.customerDetails?.aadharNumber || ''
//       },
//       exchange: bookingData.exchange,
//       exchangeDetails: bookingData.exchangeDetails,
//       payment: {
//         type: bookingData.payment?.type || 'CASH',
//         financer: bookingData.payment?.financer
//       },
//       salesExecutive: bookingData.salesExecutive,
//       branch: {
//         gst_number: bookingData.branch?.gst_number || ''
//       },
//       accessories: bookingData.accessories || [],
//       priceComponents: bookingData.priceComponents || [],
//       subdealer: bookingData.subdealer || '',
//       receivedAmount: bookingData.receivedAmount || 0,
//       finalStatus: finalStatus || '',
//       recentPayment: receiptData,
//       qrCodeData: qrCodeData,
//       qrCodeImage: qrCodeImage,
//       qrCodeText: qrText,
//       recentPaymentAmount: receiptData.amount || 0,
//       bookingDetails: bookingData, // Pass entire booking details
//       subsidyAmount: subsidyAmount, // Add subsidy amount
//       calculatedTotals: {
//         totalA,
//         totalB,
//         grandTotal,
//         insuranceCharges,
//         rtoCharges,
//         hpCharges,
//         subsidyDisplay
//       }
//     };

//     // Check if this is the first receipt or subsequent receipts
//     const isFirstReceipt = receiptIndex === 0;
    
//     const invoiceHTML = generateReceiptInvoiceHTML(transformedData, isFirstReceipt);

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(invoiceHTML);
//     printWindow.document.close();
    
//     printWindow.onload = function() {
//       printWindow.focus();
//       printWindow.print();
//     };
    
//   } catch (error) {
//     console.error('Error generating receipt invoice:', error);
//     showError(error, 'Failed to generate receipt invoice');
//   }
// };
//   const generateReceiptInvoiceHTML = (data, isFirstReceipt = true) => {


//     const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
//     const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';

//     const currentDate = new Date().toLocaleDateString('en-GB');
//     const receiptDate = data.recentPayment?.receiptDate 
//       ? new Date(data.recentPayment.receiptDate).toLocaleDateString('en-GB')
//       : currentDate;
    
//     const recentPaymentAmount = data.recentPaymentAmount || 0;
//     const recentPaymentAmountRef = data.recentPayment?.transactionReference || "-";
//     const recentPaymentAmountInWords = numberToWords(recentPaymentAmount);
//     const recentPaymentAmountType = data.recentPayment?.paymentMode || "-";
//     const receiptNumber = data.recentPayment?.receiptNumber || "-";

//     // Get QR code data
//     const qrCodeData = data.qrCodeData || {};
//     const qrCodeImage = data.qrCodeImage || '';
    
//      const subsidyAmount = data.bookingDetails?.subsidyAmount || data.subsidyAmount || 0;
//      const isEV = data.bookingDetails?.model?.type === 'EV' || data.model?.type === 'EV';
  
//     if (isFirstReceipt) {
//       const filteredPriceComponents = data.priceComponents.filter((comp) => {
//         const headerKey = comp.header?.header_key?.toUpperCase() || '';

//         const isInsurance = /INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
//         const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
//         const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

//         return !(isInsurance || isRTO || isHypothecation);
//       });

//       const priceComponentsWithGST = filteredPriceComponents.map((component) => {
//         const gstRatePercentage = parseFloat(component.header?.metadata?.gst_rate) || 0;

//         const unitCost = component.originalValue;
//         // const discount = component.discountedValue < component.originalValue ? component.originalValue - component.discountedValue : 0;
//         const discount = 0;
//         // const lineTotal = component.discountedValue;
//          const lineTotal = component.originalValue;
//         const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);

//         const totalGST = lineTotal - taxableValue;
//         const cgstAmount = totalGST / 2;
//         const sgstAmount = totalGST / 2;
//         const gstAmount = cgstAmount + sgstAmount;

//         return {
//           ...component,
//           unitCost,
//           taxableValue,
//           cgstAmount,
//           sgstAmount,
//           gstAmount,
//           gstRatePercentage: gstRatePercentage,
//           discount,
//           lineTotal
//         };
//       });
      
 

//       const findComponentByKeywords = (keywords) => {
//         return data.priceComponents.find((comp) => {
//           const headerKey = comp.header?.header_key?.toUpperCase() || '';
//           return keywords.some((keyword) => headerKey.includes(keyword));
//         });
//       };

//       const insuranceComponent = findComponentByKeywords([
//         'INSURANCE',
//         'INSURCANCE',
//         'INSURANCE CHARGES',
//         'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
//       ]);
//       const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

//       const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
//       const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;

//       const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
//       const hpCharges = hpComponent ? hpComponent.originalValue : data.hypothecationCharges || 0;

//       const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
//       const totalB = insuranceCharges + rtoCharges + hpCharges;
//       const subsidyDisplay = isEV && subsidyAmount > 0 ? subsidyAmount : 0;
//       const grandTotal = totalA + totalB;

//       return `
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Payment Receipt - ${receiptNumber}</title>
//   <style>
//     body {
//       font-family: "Courier New", Courier, monospace;
//       margin: 0;
//       padding: 10mm;
//       font-size: 14px;
//       color: #555555;
//     }
//     .page {
//       width: 210mm;
//       height: 297mm;
//       margin: 0 auto;
//     }
//     .header-container {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 2mm;
//       align-items: flex-start;
//     }
//     .header-left {
//       width: 60%;
//     }
//     .header-right {
//       width: 40%;
//       text-align: right;
//       display: flex;
//       flex-direction: column;
//       align-items: flex-end;
//     }
//     .logo-qr-container {
//       display: flex;
//       align-items: center;
//       gap: 20px;
//       justify-content: flex-end;
//       margin-bottom: 10px;
//       width: 100%;
//     }
//     .logo {
//       height: 80px;
//     }
//     .qr-code-extra-big {
//       width: 150px;
//       height: 150px;
//       border: 1px solid #ccc;
//     }
//     .dealer-info {
//       text-align: left;
//       font-size: 14px;
//       line-height: 1.2;
//     }
//     .customer-info-container {
//       display: flex;
//       font-size:14px;
//     }

//     .customer-info-left {
//       width: 50%;
//     }
//     .customer-info-right {
//       width: 50%;
//     }
//     .customer-info-row {
//       margin: 1mm 0;
//       line-height: 1.2;
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       font-size: 9pt;
//       margin: 2mm 0;
//     }
//     th, td {
//       padding: 1mm;
//       border: 1px solid #000;
//       vertical-align: top;
//     }
//     .no-border { 
//       border: none !important; 
//       font-size:14px;
//     }
//     .text-right { text-align: right; }
//     .text-center { text-align: center; }
//     .bold { 
//       font-weight: bold; 
//     }
//     .section-title {
//       font-weight: bold;
//       margin: 1mm 0;
//     }
//     .signature-box {
//       margin-top: 5mm;
//       font-size: 9pt;
//     }
//     .signature-line {
//       border-top: 1px dashed #000;
//       width: 40mm;
//       display: inline-block;
//       margin: 0 5mm;
//     }
//     .footer {
//       font-size: 8pt;
//       text-align: justify;
//       line-height: 1.2;
//       margin-top: 3mm;
//     }
//     .divider {
//       border-top: 2px solid #AAAAAA;
//     }
//     .totals-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 2mm 0;
//     }
//     .totals-table td {
//       border: none;
//       padding: 1mm;
//     }
//     .total-divider {
//       border-top: 2px solid #AAAAAA;
//       height: 1px;
//       margin: 2px 0;
//     }
//     .broker-info{
//       display:flex;
//       justify-content:space-between;
//       padding:1px;
//     }
//     .status-box {
//       background-color: #e8f5e8;
//       border: 2px solid #c3e6c3;
//       border-radius: 4px;
//       padding: 15px;
//       margin: 10px 0;
//       text-align: center;
//       font-weight: bold;
//       font-size: 20px;
//       color: #495057;
//     }
//     .payment-info-title {
//       font-weight: bold;
//       margin-bottom: 5px;
//       color: #155724;
//       font-size: 16px;
//     }
//     .amount-in-words {
//       font-style: italic;
//       margin-top: 5px;
//       color: #333;
//       padding: 5px;
//     }

//     .note{
//       padding:1px;
//       margin:2px;
//     }
    
//     /* QR Code at bottom - even bigger */
//     .qr-bottom-section {
//       margin-top: 10mm;
//       text-align: center;
//       page-break-inside: avoid;
//     }
//     .qr-bottom-big {
//       width: 180px;
//       height: 180px;
//       border: 1px solid #ccc;
//       margin: 0 auto;
//       display: block;
//     }
//     .qr-scan-text {
//       font-size: 10pt;
//       color: #777;
//       margin-top: 3mm;
//     }
    
//     .receipt-info {
//       background-color: #f8f9fa;
//       border: 1px solid #dee2e6;
//       border-radius: 4px;
//       padding: 10px;
//       margin: 10px 0;
//     }
    
//     @page {
//       size: A4;
//       margin: 0;
//     }
//     @media print {
//       body {
//         padding: 5mm;
//       }
//       .qr-bottom-section {
//         page-break-inside: avoid;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <!-- Header Section with QR Code -->
//     <div class="header-container">
//       <div class="header-left">
//         <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
//         <div class="dealer-info">
//           Authorized Main Dealer: TVS Motor Company Ltd.<br>
//           Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//           Upnagar, Nashik Road, Nashik, 7498993672<br>
//           GSTIN: ${data.branch?.gst_number || ''}<br>
//           GANDHI TVS PIMPALGAON
//         </div>
//       </div>
//       <div class="header-right">
//         <!-- Logo and QR code side by side -->
//         <div class="logo-qr-container">
//           <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//           ${
//             qrCodeImage 
//               ? `<img src="${qrCodeImage}" class="qr-code-extra-big" alt="QR Code" />`
//               : ''
//           }
//         </div>
        
//         <div style="margin-top: 5px; font-size: 13px;">Date: ${receiptDate}</div>
//         <div style="margin-top: 5px; font-size: 13px;"><strong>Receipt No:</strong> ${receiptNumber}</div>

//         ${
//           data.bookingType === 'SUBDEALER'
//             ? `<div style="font-size: 12px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//         <div style="font-size: 11px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>
          
//           `
//             : ''
//         }
        
//       </div>
//     </div>
//     <div class="divider"></div>

//     <!-- Receipt Information -->
//     <div class="receipt-info">
//       <div><strong>Payment Receipt</strong></div>
//       <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//       <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//     </div>

//     <!-- Customer Information -->
//     <div class="customer-info-container">
//       <div class="customer-info-left">
//         <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//         <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka},${data.customerDetails.pincode || ''}</div>
//         <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
//           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
//       </div>
//       <div class="customer-info-right">
//         <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
//        <div class="customer-info-row"><strong>Chassis No:</strong> ${data.chassisNumber}</div>
//         <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || 'CASH'}</div>
//          <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
//         <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
//       </div>
//     </div>

//     <!-- Received Amount Section -->
//     <div class="payment-info-box">
//       <div class="receipt-info">
//         <div><strong>Receipt Amount (Rs):</strong> ₹${data.recentPaymentAmount.toFixed(2)}</div>
//         <div><strong>Receipt Number:</strong> ${receiptNumber}</div>
//         <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//         <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>
//       <div class="amount-in-words">
//         <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
//       </div>
//     </div>
//     <!-- Price Breakdown Table -->
//     <table>
//       <tr>
//         <th style="width:25%">Particulars</th>
//         <th style="width:8%">HSN CODE</th>
//         <th style="width:8%">Unit Cost</th>
//         <th style="width:8%">Taxable</th>
//         <th style="width:5%">CGST</th>
//         <th style="width:8%">CGST AMOUNT</th>
//         <th style="width:5%">SGST</th>
//         <th style="width:8%">SGST AMOUNT</th>
//         <th style="width:7%">DISCOUNT</th>
//         <th style="width:10%">LINE TOTAL</th>
//       </tr>

//       ${priceComponentsWithGST
//         .map(
//           (component) => `
//         <tr>
//           <td>${component.header?.header_key || ''}</td>
//           <td>${component.header?.metadata?.hsn_code || ''}</td>
//           <td >${component.unitCost.toFixed(2)}</td>
//           <td >${component.taxableValue.toFixed(2)}</td>
//           <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
//           <td >${component.cgstAmount.toFixed(2)}</td>
//           <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
//           <td >${component.sgstAmount.toFixed(2)}</td>
//           <td >${component.discount.toFixed(2)}</td>
//           <td >${component.lineTotal.toFixed(2)}</td>
//         </tr>
//       `
//         )
//         .join('')}
//     </table>

//     <!-- Totals Section - No Borders -->
//      <table class="totals-table">
//       <tr>
//         <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
//         <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
//       </tr>
//       <tr>
//         <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//       </tr>
//       <tr>
//         <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
//         <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
//       </tr>
//       <tr>
//         <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
//         <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
//       </tr>
//       <tr>
//         <td class="no-border"><strong>HP CHARGES</strong></td>
//         <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
//       </tr>
//         ${isEV && subsidyAmount > 0 ? `
//       <tr>
//         <td class="no-border"><strong>SUBSIDY AMOUNT</strong></td>
//         <td class="no-border text-right" style="color: green;"><strong>-${subsidyAmount.toFixed(2)}</strong></td>
//       </tr>
//       ` : ''}
//       <tr>
//         <td colspan="2" class="no-border"><div class="total-divider"></div></td>
//       </tr>
//       <tr>
//         <td class="no-border"><strong>TOTAL(B)</strong></td>
//         <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
//       </tr>
//       <tr>
//         <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
//         <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
//       </tr>
//     </table>
//     <div class="broker-info">
//       <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
//       <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
//     </div>
//     <div class="note"><strong>Notes:Booking Awaiting approval as discount exceed</strong></div>
//     <div class="divider"></div>
//     <div style="margin-top:2mm;">
//       <div><strong>Booking Status: </strong>
//       </div>
//       <div class="status-box">
//         ${data.finalStatus || 'Status: Not Available'}
//       </div>
//     </div>
//     <div class="divider"></div>

//     <!-- BIG QR Code at Bottom -->
    
//     <div class="divider" style="margin-top: 5mm;"></div>

//     <!-- Signature Section - Adjusted to fit properly -->
//     <div class="signature-box">
//       <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
//         <div style="text-align:center; width: 22%;">
//           <div class="signature-line"></div>
//           <div>Customer's Signature</div>
//         </div>
//         <div style="text-align:center; width: 22%;">
//           <div class="signature-line"></div>
//           <div>Sales Executive</div>
//         </div>
//         <div style="text-align:center; width: 22%;">
//           <div class="signature-line"></div>
//           <div>Manager</div>
//         </div>
//         <div style="text-align:center; width: 22%;">
//           <div class="signature-line"></div>
//           <div>Accountant</div>
//         </div>
//       </div>
//     </div>
//   </div>
// </body>
// </html>
//   `;
//     } else {
//      // For subsequent receipts (2nd onwards) - Simplified version without price breakdown
// // Show the same receipt twice with cutting line in between
// return `
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Payment Receipt - ${receiptNumber}</title>
//   <style>
//     body {
//       font-family: "Courier New", Courier, monospace;
//       margin: 0;
//       padding: 10mm;
//       font-size: 14px;
//       color: #555555;
//     }
//     .page {
//       width: 210mm;
//       height: 297mm;
//       margin: 0 auto;
//     }
//     .receipt-copy {
//       height: 138mm; /* Half of A4 page */
//       page-break-inside: avoid;
//     }
//     .header-container {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 2mm;
//       align-items: flex-start;
//     }
//     .header-left {
//       width: 60%;
//     }
//     .header-right {
//       width: 40%;
//       text-align: right;
//       display: flex;
//       flex-direction: column;
//       align-items: flex-end;
//     }
//     .logo-qr-container {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       justify-content: flex-end;
//       margin-bottom: 5px;
//       width: 100%;
//     }
//     .logo {
//       height: 60px;
//     }
//     .qr-code-small {
//       width: 100px;
//       height: 100px;
//       border: 1px solid #ccc;
//     }
//     .dealer-info {
//       text-align: left;
//       font-size: 12px;
//       line-height: 1.1;
//     }
//     .customer-info-container {
//       display: flex;
//       font-size:12px;
//     }
//     .customer-info-left {
//       width: 50%;
//     }
//     .customer-info-right {
//       width: 50%;
//     }
//     .customer-info-row {
//       margin: 0.5mm 0;
//       line-height: 1.1;
//     }
//     .divider {
//       border-top: 1px solid #AAAAAA;
//       margin: 2mm 0;
//     }
//     .receipt-info {
//       background-color: #f8f9fa;
//       border: 1px solid #dee2e6;
//       border-radius: 4px;
//       padding: 8px;
//       margin: 8px 0;
//       font-size: 12px;
//     }
//     .payment-info-box {
//       margin: 5px 0;
//     }
//     .signature-box {
//       margin-top: 3mm;
//       font-size: 8pt;
//     }
//     .signature-line {
//       border-top: 1px dashed #000;
//       width: 35mm;
//       display: inline-block;
//       margin: 0 3mm;
//     }
//     .cutting-line {
//       border-top: 2px dashed #333;
//       margin: 10mm 0;
//       text-align: center;
//       position: relative;
//     }
//     .cutting-line::before {
//       content: "✂ Cut Here ✂";
//       position: absolute;
//       top: -10px;
//       left: 50%;
//       transform: translateX(-50%);
//       background: white;
//       padding: 0 10px;
//       font-size: 10px;
//       color: #666;
//     }
//     .note{
//       padding:1px;
//       margin:2px;
//       font-size: 11px;
//     }
    
//     @page {
//       size: A4;
//       margin: 0;
//     }
//     @media print {
//       body {
//         padding: 5mm;
//       }
//       .receipt-copy {
//         page-break-inside: avoid;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <!-- First Copy -->
//     <div class="receipt-copy">
//       <!-- Header Section with QR Code -->
//       <div class="header-container">
//         <div class="header-left">
//           <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
//           <div class="dealer-info">
//             Authorized Main Dealer: TVS Motor Company Ltd.<br>
//             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//             Upnagar, Nashik Road, Nashik, 7498993672<br>
//             GSTIN: ${data.branch?.gst_number || ''}<br>
//             GANDHI TVS PIMPALGAON
//           </div>
//         </div>
//         <div class="header-right">
//           <!-- Logo and QR code side by side -->
//           <div class="logo-qr-container">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             ${
//               qrCodeImage 
//                 ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
//                 : ''
//             }
//           </div>
          
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>

//           ${
//             data.bookingType === 'SUBDEALER'
//               ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//           <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//               : ''
//           }
//         </div>
//       </div>
//       <div class="divider"></div>

//       <!-- Receipt Information -->
//       <div class="receipt-info">
//         <div><strong>Payment Receipt</strong></div>
//         <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>

//       <!-- Customer Information -->
//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
//           <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
//           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
//         </div>
//         <div class="customer-info-right">
//           <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
//           <div class="customer-info-row"><strong>Chassis No:</strong> ${data.chassisNumber}</div>
//           <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || 'CASH'}</div>
//           <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
//           <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
//         </div>
//       </div>

//       <!-- Received Amount Section -->
//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div><strong>Receipt Amount (Rs):</strong> ₹${data.recentPaymentAmount.toFixed(2)}</div>
//           <div><strong>Receipt Number:</strong> ${receiptNumber}</div>
//           <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//           <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//           <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//         </div>
//       </div>

//       <div class="note"><strong>Notes:</strong></div>
//       <div class="divider"></div>

//       <!-- Signature Section -->
//       <div class="signature-box">
//         <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Customer's Signature</div>
//           </div>
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Sales Executive</div>
//           </div>
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Manager</div>
//           </div>
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Accountant</div>
//           </div>
//         </div>
//       </div>
//     </div>

//     <!-- Cutting Line -->
//     <div class="cutting-line"></div>

//     <!-- Second Copy (Duplicate) -->
//     <div class="receipt-copy">
//       <!-- Header Section with QR Code -->
//       <div class="header-container">
//         <div class="header-left">
//           <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
//           <div class="dealer-info">
//             Authorized Main Dealer: TVS Motor Company Ltd.<br>
//             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//             Upnagar, Nashik Road, Nashik, 7498993672<br>
//             GSTIN: ${data.branch?.gst_number || ''}<br>
//             GANDHI TVS PIMPALGAON
//           </div>
//         </div>
//         <div class="header-right">
//           <!-- Logo and QR code side by side -->
//           <div class="logo-qr-container">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             ${
//               qrCodeImage 
//                 ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
//                 : ''
//             }
//           </div>
          
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>

//           ${
//             data.bookingType === 'SUBDEALER'
//               ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//           <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//               : ''
//           }
//         </div>
//       </div>
//       <div class="divider"></div>

//       <!-- Receipt Information -->
//       <div class="receipt-info">
//         <div><strong>Payment Receipt (DUPLICATE)</strong></div>
//         <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>

//       <!-- Customer Information -->
//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
//           <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
//           <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
//         </div>
//         <div class="customer-info-right">
//           <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
//           <div class="customer-info-row"><strong>Chassis No:</strong> ${data.chassisNumber}</div>
//           <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || 'CASH'}</div>
//           <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
//           <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
//         </div>
//       </div>

//       <!-- Received Amount Section -->
//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div><strong>Receipt Amount (Rs):</strong> ₹${data.recentPaymentAmount.toFixed(2)}</div>
//           <div><strong>Receipt Number:</strong> ${receiptNumber}</div>
//           <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//           <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//           <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//         </div>
//       </div>

//       <div class="note"><strong>Notes:</strong></div>
//       <div class="divider"></div>

//       <!-- Signature Section -->
//       <div class="signature-box">
//         <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Customer's Signature</div>
//           </div>
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Sales Executive</div>
//           </div>
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Manager</div>
//           </div>
//           <div style="text-align:center; width: 22%;">
//             <div class="signature-line"></div>
//             <div>Accountant</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </body>
// </html>
//   `;
// }
//   };


//  const renderCustomerTable = () => {
//   // Check if user has permission to view this tab
//   if (!canViewCustomerTab) {
//     return (
//       <div className="text-center py-4">
//         <CAlert color="warning">
//           You do not have permission to view the Customer tab.
//         </CAlert>
//       </div>
//     );
//   }

//   // Check if user has permission to add payments (CREATE permission) or view receipts (VIEW permission)
//   const canShowActionColumn = canCreateInCustomerTab || canPrintInCustomerTab;
//   const canShowAddPayment = canCreateInCustomerTab;
//   const canShowPrint = canPrintInCustomerTab;

//   return (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Receipts</CTableHeaderCell>
//             {canShowActionColumn && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredBookings.length === 0 ? (
//             <CTableRow>
//               <CTableDataCell colSpan={canShowActionColumn ? "12" : "11"} style={{ color: 'red', textAlign: 'center' }}>
//                 {searchTerm ? 'No matching bookings found' : 'No booking available'}
//               </CTableDataCell>
//             </CTableRow>
//           ) : (
//             filteredBookings.map((booking, index) => {
//               const receipts = bookingReceipts[booking._id] || [];
              
//               // Sort receipts by date in ascending order (oldest first)
//               const sortedReceipts = [...receipts].sort((a, b) => {
//                 const dateA = new Date(a.receiptDate || a.createdAt || 0);
//                 const dateB = new Date(b.receiptDate || b.createdAt || 0);
//                 return dateA - dateB; // Ascending order
//               });
              
//               return (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                       ? (booking.chassisNumber || '')
//                       : ''
//                     }
//                   </CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell>
//                     {sortedReceipts.length > 0 ? (
//                       <CDropdown>
//                         <CDropdownToggle size="sm" color="info" variant="outline" disabled={!canShowPrint}>
//                           {sortedReceipts.length} Receipt{sortedReceipts.length > 1 ? 's' : ''}
//                         </CDropdownToggle>
//                         <CDropdownMenu>
//                           {sortedReceipts.map((receipt, receiptIndex) => (
//                             <CDropdownItem 
//                               key={receipt.id} 
//                               onClick={() => printReceiptInvoice(receipt.id, booking._id, receiptIndex)}
//                             >
//                               <div className="d-flex align-items-center">
//                                 <CIcon icon={cilPrint} className="me-2" />
//                                 <div>
//                                   <div><strong>Receipt #{receiptIndex + 1}</strong></div>
//                                   <small>
//                                     {receipt.display?.amount || `₹${receipt.amount}`} - 
//                                     {receipt.display?.date || new Date(receipt.receiptDate).toLocaleDateString('en-GB')}
//                                   </small>
//                                 </div>
//                               </div>
//                             </CDropdownItem>
//                           ))}
//                         </CDropdownMenu>
//                       </CDropdown>
//                     ) : (
//                       <span className="text-muted">No receipts</span>
//                     )}
//                   </CTableDataCell>

//                   {canShowActionColumn && (
//                     <CTableDataCell>
//                       <CButton
//                         size="sm"
//                         className='option-button btn-sm'
//                         onClick={(event) => handleMenuClick(event, booking._id)}
//                         disabled={!canShowAddPayment}
//                       >
//                         <CIcon icon={cilSettings} />
//                         Options
//                       </CButton>

//                       <Menu
//                         id={`action-menu-${booking._id}`}
//                         anchorEl={anchorEl}
//                         open={menuBookingId === booking._id}
//                         onClose={handleMenuClose}
//                         anchorOrigin={{
//                           vertical: 'bottom',
//                           horizontal: 'right',
//                         }}
//                         transformOrigin={{
//                           vertical: 'top',
//                           horizontal: 'right',
//                         }}
//                       >
//                         {canShowAddPayment && (
//                           <MenuItem onClick={() => {
//                             handleAddClick(booking);
//                             handleMenuClose();
//                           }}>
//                             <CIcon icon={cilPlus} className="me-2" />
//                             Add Payment
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               );
//             })
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );
// };

//   // const renderPaymentVerificationTable = () => {
   
//   //   if (!canViewPaymentVerificationTab) {
//   //     return (
//   //       <div className="text-center py-4">
//   //         <CAlert color="warning">
//   //           You do not have permission to view the Payment Verification tab.
//   //         </CAlert>
//   //       </div>
//   //     );
//   //   }

//   //   return (
//   //     <div className="responsive-table-wrapper">
//   //       <CTable striped bordered hover className='responsive-table'>
//   //         <CTableHead>
//   //           <CTableRow>
//   //             <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//   //             <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//   //             {canCreateInPaymentVerificationTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//   //           </CTableRow>
//   //         </CTableHead>
//   //         <CTableBody>
//   //           {filteredPendingLedgerEntries.length === 0 ? (
//   //             <CTableRow>
//   //               <CTableDataCell colSpan={canCreateInPaymentVerificationTab ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
//   //                 {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
//   //               </CTableDataCell>
//   //             </CTableRow>
//   //           ) : (
//   //             filteredPendingLedgerEntries.map((entry, index) => (
//   //               <CTableRow key={index}>
//   //                 <CTableDataCell>{index + 1}</CTableDataCell>
//   //                 <CTableDataCell>{entry.bookingDetails?.bookingNumber || entry.booking || ''}</CTableDataCell>
//   //                  <CTableDataCell>{entry.bookingDetails?.customerDetails?.name || ''}</CTableDataCell>
//   //                 <CTableDataCell>{entry.paymentMode || ''}</CTableDataCell>
//   //                 <CTableDataCell>{entry.amount || ''}</CTableDataCell>
//   //                 <CTableDataCell>{entry.transactionReference || ''}</CTableDataCell>
//   //                 <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//   //                 <CTableDataCell>
//   //                   <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
//   //                     {entry.approvalStatus === 'Pending' ? 'PENDING' : 'VERIFIED'}
//   //                   </CBadge>
//   //                 </CTableDataCell>
//   //                 {canCreateInPaymentVerificationTab && (
//   //                   <CTableDataCell>
//   //                     {entry.approvalStatus === 'Pending' ? (
//   //                       <CButton
//   //                         size="sm"
//   //                         className="action-btn"
//   //                         onClick={() => handleVerifyPayment(entry)}
//   //                       >
//   //                         <CIcon icon={cilCheckCircle} className="me-1" />
//   //                         Verify
//   //                       </CButton>
//   //                     ) : (
//   //                       <span className="text-muted">Verified</span>
//   //                     )}
//   //                   </CTableDataCell>
//   //                 )}
//   //               </CTableRow>
//   //             ))
//   //           )}
//   //         </CTableBody>
//   //       </CTable>
//   //     </div>
//   //   );
//   // };

// const renderPaymentVerificationTable = () => {
//   // Check if user has permission to view this tab
//   if (!canViewPaymentVerificationTab) {
//     return (
//       <div className="text-center py-4">
//         <CAlert color="warning">
//           You do not have permission to view the Payment Verification tab.
//         </CAlert>
//       </div>
//     );
//   }

//   return (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Bank Receipts</CTableHeaderCell>
//             <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//             {canCreateInPaymentVerificationTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredPendingLedgerEntries.length === 0 ? (
//             <CTableRow>
//               <CTableDataCell colSpan={canCreateInPaymentVerificationTab ? "11" : "10"} style={{ color: 'red', textAlign: 'center' }}>
//                 {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
//               </CTableDataCell>
//             </CTableRow>
//           ) : (
//             filteredPendingLedgerEntries.map((entry, index) => {
//               // Fetch receipts for the booking associated with this ledger entry
//               const bookingId = entry.bookingDetails?._id || entry.booking;
//               const receipts = bookingReceipts[bookingId] || [];
              
//               // Filter only BANK payment mode receipts
//               const bankReceipts = receipts.filter(receipt => 
//                 receipt.paymentMode && 
//                 receipt.paymentMode.toUpperCase() === 'BANK'
//               );
              
//               // Sort bank receipts by date in ascending order (oldest first)
//               const sortedBankReceipts = [...bankReceipts].sort((a, b) => {
//                 const dateA = new Date(a.receiptDate || a.createdAt || 0);
//                 const dateB = new Date(b.receiptDate || b.createdAt || 0);
//                 return dateA - dateB; // Ascending order
//               });
              
//               return (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.bookingDetails?.bookingNumber || entry.booking || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.bookingDetails?.customerDetails?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.paymentMode || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.amount || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.transactionReference || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>
//                     {sortedBankReceipts.length > 0 ? (
//                       <CDropdown>
//                         <CDropdownToggle size="sm" color="info" variant="outline">
//                           {sortedBankReceipts.length} Bank Receipt{sortedBankReceipts.length > 1 ? 's' : ''}
//                         </CDropdownToggle>
//                         <CDropdownMenu>
//                           {sortedBankReceipts.map((receipt, receiptIndex) => (
//                             <CDropdownItem 
//                               key={receipt.id} 
//                               onClick={() => printReceiptInvoice(receipt.id, bookingId, receiptIndex)}
//                               disabled={!canPrintInCustomerTab} // Use same print permission
//                             >
//                               <div className="d-flex align-items-center">
//                                 <CIcon icon={cilPrint} className="me-2" />
//                                 <div>
//                                   <div><strong>Bank Receipt #{receiptIndex + 1}</strong></div>
//                                   <small>
//                                     {receipt.display?.amount || `₹${receipt.amount}`} - 
//                                     {receipt.display?.date || (receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString('en-GB') : 'N/A')}
//                                   </small>
//                                 </div>
//                               </div>
//                             </CDropdownItem>
//                           ))}
//                         </CDropdownMenu>
//                       </CDropdown>
//                     ) : (
//                       <span className="text-muted">No bank receipts</span>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
//                       {entry.approvalStatus === 'Pending' ? 'PENDING' : 'VERIFIED'}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canCreateInPaymentVerificationTab && (
//                     <CTableDataCell>
//                       {entry.approvalStatus === 'Pending' ? (
//                         <CButton
//                           size="sm"
//                           className="action-btn"
//                           onClick={() => handleVerifyPayment(entry)}
//                         >
//                           <CIcon icon={cilCheckCircle} className="me-1" />
//                           Verify
//                         </CButton>
//                       ) : (
//                         <span className="text-muted">Verified</span>
//                       )}
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               );
//             })
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );
// };

//  const renderCompletePaymentTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewCompletePaymentTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Complete Payment tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {completePayments.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
//                   {searchTerm ? 'No matching complete payments found' : 'No complete payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               completePayments.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                       ? (booking.chassisNumber || '')
//                       : ''
//                     }
//                   </CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell style={{ color: 'green' }}>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

// const renderPendingListTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPendingListTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Pending List tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {pendingPayments.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
//                   {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               pendingPayments.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                       ? (booking.chassisNumber || '')
//                       : ''
//                     }
//                   </CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
//                   <CTableDataCell style={{ color: 'red' }}>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedListTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedListTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Verified List tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredVerifiedLedgerEntries.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
//                   {searchTerm ? 'No matching verified payments found' : 'No verified payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredVerifiedLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.bookingDetails?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.bookingDetails?.customerDetails?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{entry.paymentMode}</CTableDataCell>
//                   <CTableDataCell>{entry.amount}</CTableDataCell>
//                   <CTableDataCell>{entry.transactionReference}</CTableDataCell>
//                   <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{entry.receivedByDetails?.name || ''}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (!canViewReceipts) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Receipts.
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in Receipts.
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

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Receipt Management</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               {/* Excel Export Button - MOVED TO LEFT SIDE */}
//               {canCreateReceipts && (
//                 <div className="d-flex mb-3">
//                   <CButton 
//                     size="sm" 
//                     className="action-btn"
//                     onClick={handleOpenExportModal}
//                     title="Export Excel"
//                   >
//                     <FontAwesomeIcon icon={faFileExcel} className='me-1' />
//                     Export Excel
//                   </CButton>
//                 </div>
//               )}

//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewCustomerTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       Customer
//                       {!canCreateInCustomerTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {/* Payment Verification tab - Only show if user has VIEW permission */}
//                 {canViewPaymentVerificationTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Payment Verification
//                       {!canCreateInPaymentVerificationTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompletePaymentTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 2}
//                       onClick={() => handleTabChange(2)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                           borderBottom: 'none',
//                           color: 'black'
//                       }}
//                     >
//                       Complete Payment
//                       {!canCreateInCompletePaymentTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewPendingListTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 3}
//                       onClick={() => handleTabChange(3)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Pending List
//                       {!canCreateInPendingListTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewVerifiedListTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 4}
//                       onClick={() => handleTabChange(4)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Verified List
//                       {!canCreateInVerifiedListTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div>
//                   {/* This div is now empty since Excel button moved above */}
//                 </div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     disabled={!canViewAnyTab}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewCustomerTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderCustomerTable()}
//                   </CTabPane>
//                 )}
//                 {canViewPaymentVerificationTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderPaymentVerificationTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompletePaymentTab && (
//                   <CTabPane visible={activeTab === 2}>
//                     {renderCompletePaymentTable()}
//                   </CTabPane>
//                 )}
//                 {canViewPendingListTab && (
//                   <CTabPane visible={activeTab === 3}>
//                     {renderPendingListTable()}
//                   </CTabPane>
//                 )}
//                 {canViewVerifiedListTab && (
//                   <CTabPane visible={activeTab === 4}>
//                     {renderVerifiedListTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Receipts.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       <ReceiptModal 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         bookingData={selectedBooking} 
//         canCreateReceipts={canCreateInCustomerTab} // Pass tab-specific CREATE permission
//         cashLocations={cashLocations} // Pass cash locations to modal
//       />

//       {/* Date Range Modal for Excel Export */}
//       <CModal alignment="center" visible={openExportModal} onClose={handleCloseExportModal}>
//         <CModalHeader>
//           <CModalTitle>
//             <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
//             Select Date Range for Receipts Export
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {/* Display export error */}
//           {exportError && (
//             <CAlert color="warning" className="mb-3">
//               {exportError}
//             </CAlert>
//           )}
          
//           <LocalizationProvider 
//             dateAdapter={AdapterDateFns} 
//             adapterLocale={enIN} // Add Indian locale
//           >
//             <div className="mb-3">
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => {
//                   setStartDate(newValue);
//                   setExportError(''); // Clear error when user changes date
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy" // Use slash format for display
//                 mask="__/__/____" // Add mask for better UX
//                 views={['day', 'month', 'year']} // Show day-month-year in that order
//                 disabled={!canCreateReceipts}
//               />
//             </div>
//             <div className="mb-3">
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(newValue) => {
//                   setEndDate(newValue);
//                   setExportError(''); // Clear error when user changes date
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy" // Use slash format for display
//                 mask="__/__/____" // Add mask for better UX
//                 minDate={startDate}
//                 views={['day', 'month', 'year']} // Show day-month-year in that order
//                 disabled={!canCreateReceipts}
//               />
//             </div>
//           </LocalizationProvider>
          
//           <TextField
//             select
//             value={selectedBranchId}
//             onChange={(e) => {
//               setSelectedBranchId(e.target.value);
//               setExportError(''); // Clear error when user changes branch
//             }}
//             fullWidth
//             size="small"
//             SelectProps={{ native: true }}
//             disabled={!canCreateReceipts}
//           >
//             <option value="">-- Select Branch --</option>
//              {hasAllBranchAccess && (
//                   <option value="all">All Branch</option>
//                 )}
//             {branches.map((branch) => (
//               <option key={branch._id} value={branch._id}>
//                 {branch.name}
//               </option>
//             ))}
//           </TextField>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseExportModal}>
//             Cancel
//           </CButton>
//           <CButton 
//             className="submit-button"
//             onClick={handleExcelExport}
//             disabled={!startDate || !endDate || !selectedBranchId || !canCreateReceipts || exportLoading}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// }

// export default Receipt;


//**************************** Harshali Changes *********/


import React, { useState, useEffect } from 'react';
import { 
  CBadge, 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, showSuccess } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import ReceiptModal from './ReceiptModal';
import { confirmVerify } from '../../utils/sweetAlerts';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilPrint, cilSettings, cilPlus } from '@coreui/icons';
import { numberToWords } from '../../utils/numberToWords';
import { Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'qrcode';
import { faFileExcel, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { enIN } from 'date-fns/locale';

import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../utils/modulePermissions';

function Receipt() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
  const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuBookingId, setMenuBookingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [bookingReceipts, setBookingReceipts] = useState({}); 
  const [cashLocations, setCashLocations] = useState([]);
   
  const [openExportModal, setOpenExportModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState('');
  const [branches, setBranches] = useState([]);

  const { permissions = [], user } = useAuth();
  const hasAllBranchAccess = user?.branchAccess === "ALL";
  const canViewReceipts = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW
  );

  const canCreateReceipts = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.CREATE
  );

  const canViewCustomerTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW,
    TABS.RECEIPTS.CUSTOMER
  );
  
  const canViewPaymentVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW,
    TABS.RECEIPTS.PAYMENT_VERIFICATION
  );
  
  const canViewCompletePaymentTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW,
    TABS.RECEIPTS.COMPLETE_PAYMENT
  );
  
  const canViewPendingListTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW,
    TABS.RECEIPTS.PENDING_LIST
  );
  
  const canViewVerifiedListTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW,
    TABS.RECEIPTS.VERIFIED_LIST
  );
  
  const canCreateInCustomerTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.CREATE,
    TABS.RECEIPTS.CUSTOMER
  );
  
  const canCreateInPaymentVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.CREATE,
    TABS.RECEIPTS.PAYMENT_VERIFICATION
  );
  
  const canCreateInCompletePaymentTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.CREATE,
    TABS.RECEIPTS.COMPLETE_PAYMENT
  );
  
  const canCreateInPendingListTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.CREATE,
    TABS.RECEIPTS.PENDING_LIST
  );
  
  const canCreateInVerifiedListTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.CREATE,
    TABS.RECEIPTS.VERIFIED_LIST
  );
  
  const canUpdateInCustomerTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.UPDATE,
    TABS.RECEIPTS.CUSTOMER
  );
  
  const canUpdateInPaymentVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.UPDATE,
    TABS.RECEIPTS.PAYMENT_VERIFICATION
  );
  
  const canPrintInCustomerTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.RECEIPTS, 
    ACTIONS.VIEW,
    TABS.RECEIPTS.CUSTOMER
  ) || canViewCustomerTab; 
  const canViewAnyTab = canViewCustomerTab || canViewPaymentVerificationTab || 
                       canViewCompletePaymentTab || canViewPendingListTab || 
                       canViewVerifiedListTab;

  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
   
    const visibleTabs = [];
    if (canViewCustomerTab) visibleTabs.push(0);
    if (canViewPaymentVerificationTab) visibleTabs.push(1);
    if (canViewCompletePaymentTab) visibleTabs.push(2);
    if (canViewPendingListTab) visibleTabs.push(3);
    if (canViewVerifiedListTab) visibleTabs.push(4);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewCustomerTab, canViewPaymentVerificationTab, 
      canViewCompletePaymentTab, canViewPendingListTab, canViewVerifiedListTab, activeTab]);

  useEffect(() => {
    if (!canViewReceipts) {
      showError('You do not have permission to view Receipts');
      setLoading(false);
      return;
    }
    
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Receipt tabs');
      setLoading(false);
      return;
    }
    
    fetchData();
    fetchPendingPayments();
    fetchVerifiedPayments();
    fetchCashLocations();
    fetchBranches();
  }, [canViewReceipts, canViewAnyTab]);

  useEffect(() => {
  
    window.printReceiptCallback = printReceiptInvoice;
    
    return () => {
      delete window.printReceiptCallback;
    };
  }, []);

  const fetchCashLocations = async () => {
    try {
      const endpoints = [
        // '/cash-locations',
        // '/cashlocations',
        '/settings/cash-locations',
        '/master/cash-locations'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await axiosInstance.get(endpoint);
          if (response.data.success && response.data.data) {
            setCashLocations(response.data.data);
            console.log('Cash locations loaded:', response.data.data);
            return;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} not available`);
        }
      }
      console.warn('Could not fetch cash locations from any endpoint');
      setCashLocations([]);
    } catch (error) {
      console.error('Error fetching cash locations:', error);
      setCashLocations([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings`);
      const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
      setBookingsData(branchBookings);
      
      const receiptsPromises = branchBookings.map(async (booking) => {
        try {
          const receiptsResponse = await axiosInstance.get(`/ledger/booking/${booking._id}`);
          return {
            bookingId: booking._id,
            receipts: receiptsResponse.data.data.allReceipts || []
          };
        } catch (error) {
          console.error(`Error fetching receipts for booking ${booking._id}:`, error);
          return {
            bookingId: booking._id,
            receipts: []
          };
        }
      });
      
      const receiptsResults = await Promise.all(receiptsPromises);
      const receiptsMap = {};
      receiptsResults.forEach(result => {
        receiptsMap[result.bookingId] = result.receipts;
      });
      
      setBookingReceipts(receiptsMap);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    if (!canViewReceipts || !canViewPaymentVerificationTab) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/ledger/pending`);
      setPendingPaymentsData(response.data.data.ledgerEntries);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchVerifiedPayments = async () => {
    if (!canViewReceipts || !canViewVerifiedListTab) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/payment/verified/bank/ledger`);
      setVerifiedPaymentsData(response.data.data.ledgerEntries);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  // Format date to DD-MM-YYYY for display
  const formatDateDDMMYYYY = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data;

    const searchFields = getDefaultSearchFields('receipts');
    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          if (key.match(/^\d+$/)) return obj[parseInt(key)];
          return obj[key];
        }, row);

        if (value === undefined || value === null) return false;

        if (typeof value === 'boolean') {
          return (value ? 'yes' : 'no').includes(term);
        }
        if (field === 'createdAt' && value instanceof Date) {
          return value.toLocaleDateString('en-GB').includes(term);
        }
        if (typeof value === 'number') {
          return String(value).includes(term);
        }
        return String(value).toLowerCase().includes(term);
      })
    );
  };


  const filterPendingPayments = (data, searchTerm) => {
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  
  return data.filter((entry) => {
    return (
      (entry.bookingDetails?.bookingNumber || '').toLowerCase().includes(term) ||
      (entry.bookingDetails?.customerDetails?.name || '').toLowerCase().includes(term) ||
      (entry.paymentMode || '').toLowerCase().includes(term) ||
      String(entry.amount || '').includes(term) ||
      (entry.transactionReference || '').toLowerCase().includes(term)
    );
  });
};

const filterVerifiedPayments = (data, searchTerm) => {
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  
  return data.filter((entry) => {
    return (
      (entry.booking || '').toLowerCase().includes(term) ||
      (entry.bookingDetails?.customerDetails?.name || '').toLowerCase().includes(term) ||
      (entry.paymentMode || '').toLowerCase().includes(term) ||
      String(entry.amount || '').includes(term) ||
      (entry.transactionReference || '').toLowerCase().includes(term) ||
      (entry.receivedByDetails?.name || '').toLowerCase().includes(term)
    );
  });
};
  const filteredBookings = filterData(bookingsData, searchTerm);
  const completePayments = filterData(
    bookingsData.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0),
    searchTerm
  );
  const pendingPayments = filterData(
    bookingsData.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0),
    searchTerm
  );
  // const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchTerm);

  const filteredPendingLedgerEntries = filterPendingPayments(pendingPaymentsData, searchTerm);
  const filteredVerifiedLedgerEntries = filterVerifiedPayments(verifiedPaymentsData, searchTerm);

  const handleMenuClick = (event, bookingId) => {
    setAnchorEl(event.currentTarget);
    setMenuBookingId(bookingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBookingId(null);
  };

  const handleAddClick = (booking) => {
    // Check CREATE permission for the CUSTOMER tab
    if (!canCreateInCustomerTab) {
      showError('You do not have permission to add payments');
      return;
    }
    
    setSelectedBooking(booking);
    setShowModal(true);
    handleMenuClose();
  };

  const handleVerifyPayment = async (entry) => {
    // Check CREATE permission for the PAYMENT VERIFICATION tab
    if (!canCreateInPaymentVerificationTab) {
      showError('You do not have permission to verify payments');
      return;
    }
    
    try {
      const result = await confirmVerify({
        title: 'Confirm Payment Verification',
        text: `Are you sure you want to verify the payment of ₹${entry.amount} for booking ${entry.bookingDetails?.bookingNumber || entry.booking}?`,
        confirmButtonText: 'Yes, verify it!'
      });

      if (result.isConfirmed) {
        await axiosInstance.patch(`/ledger/approve/${entry._id}`, {
          remark: ''
        });
        setSuccessMessage('Payment verified successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchPendingPayments();
        fetchVerifiedPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showError(error, 'Failed to verify payment');
    }
  };

  const handleTabChange = (tab) => {
    if (!canViewAnyTab) {
      return;
    }
    
    setActiveTab(tab);
    setSearchTerm('');
  };
  const handleOpenExportModal = () => {

    if (!canCreateReceipts) {
      showError('You do not have permission to export data');
      return;
    }
    
    setOpenExportModal(true);
    setExportError('');
  };

  const handleCloseExportModal = () => {
    setOpenExportModal(false);
    setStartDate(null);
    setEndDate(null);
    setSelectedBranchId('');
    setExportError('');
  };

  const handleExcelExport = async () => {
    // Check CREATE permission for Excel export
    if (!canCreateReceipts) {
      showError('You do not have permission to export data');
      return;
    }
    
    // Clear previous errors
    setExportError('');
    
    if (!selectedBranchId) {
      setExportError('Please select a branch');
      return;
    }

    if (!startDate || !endDate) {
      setExportError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setExportError('Start date cannot be after end date');
      return;
    }

    try {
      setExportLoading(true);
      
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      // Build query parameters for the receipts API
      const params = new URLSearchParams({
        branchId: selectedBranchId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        format: 'excel'
      });

      // Use the provided API endpoint for receipts
      const response = await axiosInstance.get(
        `/reports/receipts?${params.toString()}`,
        { responseType: 'blob' }
      );

      // Check content type to see if it's an error
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        // It's a JSON error response, parse it
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        // Show the exact error message from API
        if (!errorData.success && errorData.message) {
          setExportError(errorData.message);
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: errorData.message,
          });
          return;
        }
      }

      // Handle Excel file download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with DD-MM-YYYY format
      const branchName = branches.find(b => b._id === selectedBranchId)?.name || 'Branch';
      const startDateStr = formatDateDDMMYYYY(startDate);
      const endDateStr = formatDateDDMMYYYY(endDate);
      const fileName = `Receipts_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      // Show success message
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Excel exported successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      handleCloseExportModal();
      
    } catch (error) {
      console.error('Error exporting report:', error);
      
      // For blob errors, we need to read the blob
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(error.response.data);
          });
          
          const errorData = JSON.parse(text);
          
          // Show the exact error message from API
          if (errorData.message) {
            setExportError(errorData.message);
            Swal.fire({
              icon: 'error',
              title: 'Export Failed',
              text: errorData.message,
            });
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setExportError('Failed to export report');
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'Failed to export report',
          });
        }
      } else if (error.response?.data?.message) {
        // Regular error with message in response
        setExportError(error.response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: error.response.data.message,
        });
      } else if (error.message) {
        // Network or other errors
        setExportError(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: error.message,
        });
      } else {
        setExportError('Failed to export report');
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: 'Failed to export report',
        });
      }
      
    } finally {
      setExportLoading(false);
    }
  };
 

  const handlePaymentSuccess = () => {
  fetchData();
  fetchPendingPayments();
  fetchVerifiedPayments();
};

const printReceiptInvoice = async (receiptId, bookingId, receiptIndex = 0) => {
  if (!canPrintInCustomerTab) {
    showError('You do not have permission to print invoices');
    return;
  }
  
  try {
    const receiptResponse = await axiosInstance.get(`/ledger/receipt/${receiptId}`);
    const receiptData = receiptResponse.data.data.receipt;
    
    const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${bookingId}`);
    const bookingData = bookingResponse.data.data.bookingDetails;
    const finalStatus = bookingResponse.data.data.finalStatus || '';
    const qrCodeData = receiptData.qrCodeData || {};
    
    const subsidyAmount = bookingData.subsidyAmount || 0;
    const isEV = bookingData.model?.type === 'EV';
    
    // Get booking totals
    const priceComponents = bookingData.priceComponents || [];
    const filteredPriceComponents = priceComponents.filter((comp) => {
      const headerKey = comp.header?.header_key?.toUpperCase() || '';

      const isInsurance = /INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
      const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
      const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

      return !(isInsurance || isRTO || isHypothecation);
    });

    const totalA = filteredPriceComponents.reduce((sum, item) => sum + (item.discountedValue || 0), 0);
    
    const findComponentByKeywords = (keywords) => {
      return priceComponents.find((comp) => {
        const headerKey = comp.header?.header_key?.toUpperCase() || '';
        return keywords.some((keyword) => headerKey.includes(keyword));
      });
    };

    const insuranceComponent = findComponentByKeywords([
      'INSURANCE', 'INSURCANCE', 'INSURANCE CHARGES', 'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
    ]);
    const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

    const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
    const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;

    const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
    const hpCharges = hpComponent ? hpComponent.originalValue : bookingData.hypothecationCharges || 0;

    const totalB = insuranceCharges + rtoCharges + hpCharges;
    
    // Apply subsidy only for EV models
    const subsidyDisplay = isEV && subsidyAmount > 0 ? subsidyAmount : 0;
    const grandTotal = totalA + totalB - subsidyDisplay;

    // Create QR code text data
    const qrText = `GANDHI MOTORS PVT LTD
Booking Number: ${qrCodeData.bookingNumber || bookingData.bookingNumber}
Customer: ${qrCodeData.customerName || bookingData.customerDetails?.name}
Mobile: ${qrCodeData.mobileNo || bookingData.customerDetails?.mobile1}
Model: ${qrCodeData.modelName || bookingData.model?.model_name}
Type: ${bookingData.model?.type || 'N/A'}
Chassis: ${qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated'}
Payment Type: ${qrCodeData.paymentType || bookingData.payment?.type}
Total Amount: ₹${grandTotal.toFixed(2)}
${isEV && subsidyAmount > 0 ? `Subsidy: -₹${subsidyAmount.toFixed(2)}` : ''}
Receipt: ${receiptData.receiptNumber || 'N/A'}
Amount: ${receiptData.display?.amount || `₹${receiptData.amount?.toFixed(2) || '0'}`}
Payment Mode: ${receiptData.paymentMode || 'Cash'}
Reference: ${receiptData.transactionReference || 'N/A'}
Date: ${new Date(receiptData.receiptDate).toLocaleDateString('en-GB')}`;

    // Generate QR code as data URL
    let qrCodeImage = '';
    try {
      qrCodeImage = await QRCode.toDataURL(qrText, {
        width: 250,
        margin: 3,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250">
          <rect width="250" height="250" fill="white"/>
          <rect x="20" y="20" width="210" height="210" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
          <text x="125" y="115" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">QR CODE</text>
          <text x="125" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">Receipt: ${receiptData.receiptNumber}</text>
          <text x="125" y="160" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">Scan for details</text>
        </svg>
      `);
    }

    const transformedData = {
      bookingNumber: bookingData.bookingNumber,
      bookingType: bookingData.bookingType,
      rto: bookingData.rto,
      hpa: bookingData.hpa,
      hypothecationCharges: bookingData.hypothecationCharges || 0,
      gstin: bookingData.gstin || '',
      model: {
        model_name: bookingData.model?.model_name || 'N/A',
        type: bookingData.model?.type || 'N/A' // Add type to model
      },
      chassisNumber: qrCodeData.chassisNo || bookingData.chassisNumber,
      engineNumber: bookingData.vehicle?.engineNumber || bookingData.engineNumber,
      batteryNumber: bookingData.vehicle?.batteryNumber || '',
      keyNumber: bookingData.vehicle?.keyNumber || '',
      color: {
        name: bookingData.color?.name || ''
      },
      customerDetails: {
        name: bookingData.customerDetails?.name || 'N/A',
        address: bookingData.customerDetails?.address || '',
        taluka: bookingData.customerDetails?.taluka || '',
        district: bookingData.customerDetails?.district || '',
        pincode: bookingData.customerDetails?.pincode || '',
        mobile1: bookingData.customerDetails?.mobile1 || '',
        dob: bookingData.customerDetails?.dob || '',
        aadharNumber: bookingData.customerDetails?.aadharNumber || ''
      },
      exchange: bookingData.exchange,
      exchangeDetails: bookingData.exchangeDetails,
      payment: {
        type: bookingData.payment?.type || 'CASH',
        financer: bookingData.payment?.financer
      },
      salesExecutive: bookingData.salesExecutive,
      branch: {
        gst_number: bookingData.branch?.gst_number || ''
      },
      accessories: bookingData.accessories || [],
      priceComponents: bookingData.priceComponents || [],
      subdealer: bookingData.subdealer || '',
      receivedAmount: bookingData.receivedAmount || 0,
      finalStatus: finalStatus || '',
      recentPayment: receiptData,
      qrCodeData: qrCodeData,
      qrCodeImage: qrCodeImage,
      qrCodeText: qrText,
      recentPaymentAmount: receiptData.amount || 0,
      bookingDetails: bookingData, // Pass entire booking details
      subsidyAmount: subsidyAmount, // Add subsidy amount
      calculatedTotals: {
        totalA,
        totalB,
        grandTotal,
        insuranceCharges,
        rtoCharges,
        hpCharges,
        subsidyDisplay
      }
    };

    // Check if this is the first receipt or subsequent receipts
    const isFirstReceipt = receiptIndex === 0;
    
    const invoiceHTML = generateReceiptInvoiceHTML(transformedData, isFirstReceipt);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
    };
    
  } catch (error) {
    console.error('Error generating receipt invoice:', error);
    showError(error, 'Failed to generate receipt invoice');
  }
};
  const generateReceiptInvoiceHTML = (data, isFirstReceipt = true) => {


    const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';
    const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';

    const currentDate = new Date().toLocaleDateString('en-GB');
    const receiptDate = data.recentPayment?.receiptDate 
      ? new Date(data.recentPayment.receiptDate).toLocaleDateString('en-GB')
      : currentDate;
    
    const recentPaymentAmount = data.recentPaymentAmount || 0;
    const recentPaymentAmountRef = data.recentPayment?.transactionReference || "-";
    const recentPaymentAmountInWords = numberToWords(recentPaymentAmount);
    const recentPaymentAmountType = data.recentPayment?.paymentMode || "-";
    const receiptNumber = data.recentPayment?.receiptNumber || "-";

    // Get QR code data
    const qrCodeData = data.qrCodeData || {};
    const qrCodeImage = data.qrCodeImage || '';
    
     const subsidyAmount = data.bookingDetails?.subsidyAmount || data.subsidyAmount || 0;
     const isEV = data.bookingDetails?.model?.type === 'EV' || data.model?.type === 'EV';
  
    if (isFirstReceipt) {
      const filteredPriceComponents = data.priceComponents.filter((comp) => {
        const headerKey = comp.header?.header_key?.toUpperCase() || '';

        const isInsurance = /INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(headerKey);
        const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
        const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

        return !(isInsurance || isRTO || isHypothecation);
      });

      const priceComponentsWithGST = filteredPriceComponents.map((component) => {
        const gstRatePercentage = parseFloat(component.header?.metadata?.gst_rate) || 0;

        const unitCost = component.originalValue;
        // const discount = component.discountedValue < component.originalValue ? component.originalValue - component.discountedValue : 0;
        const discount = 0;
        // const lineTotal = component.discountedValue;
         const lineTotal = component.originalValue;
        const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);

        const totalGST = lineTotal - taxableValue;
        const cgstAmount = totalGST / 2;
        const sgstAmount = totalGST / 2;
        const gstAmount = cgstAmount + sgstAmount;

        return {
          ...component,
          unitCost,
          taxableValue,
          cgstAmount,
          sgstAmount,
          gstAmount,
          gstRatePercentage: gstRatePercentage,
          discount,
          lineTotal
        };
      });
      
 

      const findComponentByKeywords = (keywords) => {
        return data.priceComponents.find((comp) => {
          const headerKey = comp.header?.header_key?.toUpperCase() || '';
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

      const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
      const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;

      const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
      const hpCharges = hpComponent ? hpComponent.originalValue : data.hypothecationCharges || 0;

      const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
      const totalB = insuranceCharges + rtoCharges + hpCharges;
      const subsidyDisplay = isEV && subsidyAmount > 0 ? subsidyAmount : 0;
      const grandTotal = totalA + totalB;

      return `
<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${receiptNumber}</title>
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
      height: 297mm;
      margin: 0 auto;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      align-items: flex-start;
    }
    .header-left {
      width: 60%;
    }
    .header-right {
      width: 40%;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo-qr-container {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: flex-end;
      margin-bottom: 10px;
      width: 100%;
    }
    .logo {
      height: 80px;
    }
    .qr-code-extra-big {
      width: 150px;
      height: 150px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 14px;
      line-height: 1.2;
    }
    .customer-info-container {
      display: flex;
      font-size:14px;
    }

    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
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
      font-size:14px;
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
    .footer {
      font-size: 8pt;
      text-align: justify;
      line-height: 1.2;
      margin-top: 3mm;
    }
    .divider {
      border-top: 2px solid #AAAAAA;
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
    .broker-info{
      display:flex;
      justify-content:space-between;
      padding:1px;
    }
    .status-box {
      background-color: #e8f5e8;
      border: 2px solid #c3e6c3;
      border-radius: 4px;
      padding: 15px;
      margin: 10px 0;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      color: #495057;
    }
    .payment-info-title {
      font-weight: bold;
      margin-bottom: 5px;
      color: #155724;
      font-size: 16px;
    }
    .amount-in-words {
      font-style: italic;
      margin-top: 5px;
      color: #333;
      padding: 5px;
    }

    .note{
      padding:1px;
      margin:2px;
    }
    
    /* QR Code at bottom - even bigger */
    .qr-bottom-section {
      margin-top: 10mm;
      text-align: center;
      page-break-inside: avoid;
    }
    .qr-bottom-big {
      width: 180px;
      height: 180px;
      border: 1px solid #ccc;
      margin: 0 auto;
      display: block;
    }
    .qr-scan-text {
      font-size: 10pt;
      color: #777;
      margin-top: 3mm;
    }
    
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
      }
      .qr-bottom-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header Section with QR Code -->
    <div class="header-container">
      <div class="header-left">
        <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
        <div class="dealer-info">
          Authorized Main Dealer: TVS Motor Company Ltd.<br>
          Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
          Upnagar, Nashik Road, Nashik, 7498993672<br>
          GSTIN: ${data.branch?.gst_number || ''}<br>
          GANDHI TVS PIMPALGAON
        </div>
      </div>
      <div class="header-right">
        <!-- Logo and QR code side by side -->
        <div class="logo-qr-container">
          <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
          ${
            qrCodeImage 
              ? `<img src="${qrCodeImage}" class="qr-code-extra-big" alt="QR Code" />`
              : ''
          }
        </div>
        
        <div style="margin-top: 5px; font-size: 13px;">Date: ${receiptDate}</div>
        <div style="margin-top: 5px; font-size: 13px;"><strong>Receipt No:</strong> ${receiptNumber}</div>

        ${
          data.bookingType === 'SUBDEALER'
            ? `<div style="font-size: 12px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
        <div style="font-size: 11px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>
          
          `
            : ''
        }
        
      </div>
    </div>
    <div class="divider"></div>

    <!-- Receipt Information -->
    <div class="receipt-info">
      <div><strong>Payment Receipt</strong></div>
      <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
      <div><strong>Receipt Date:</strong> ${receiptDate}</div>
    </div>

    <!-- Customer Information -->
    <div class="customer-info-container">
      <div class="customer-info-left">
        <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
        <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
        <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka},${data.customerDetails.pincode || ''}</div>
        <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
      </div>
      <div class="customer-info-right">
        <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
       <div class="customer-info-row"><strong>Chassis No:</strong> ${data.chassisNumber}</div>
        <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || 'CASH'}</div>
         <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
        <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
      </div>
    </div>

    <!-- Received Amount Section -->
    <div class="payment-info-box">
      <div class="receipt-info">
        <div><strong>Receipt Amount (Rs):</strong> ₹${data.recentPaymentAmount.toFixed(2)}</div>
        <div><strong>Receipt Number:</strong> ${receiptNumber}</div>
        <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
        <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
        <div><strong>Receipt Date:</strong> ${receiptDate}</div>
      </div>
      <div class="amount-in-words">
        <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
      </div>
    </div>
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
          <td>${component.header?.header_key || ''}</td>
          <td>${component.header?.metadata?.hsn_code || ''}</td>
          <td >${component.unitCost.toFixed(2)}</td>
          <td >${component.taxableValue.toFixed(2)}</td>
          <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
          <td >${component.cgstAmount.toFixed(2)}</td>
          <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
          <td >${component.sgstAmount.toFixed(2)}</td>
          <td >${component.discount.toFixed(2)}</td>
          <td >${component.lineTotal.toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </table>

    <!-- Totals Section - No Borders -->
     <table class="totals-table">
      <tr>
        <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
        <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
        <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
        <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>HP CHARGES</strong></td>
        <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
      </tr>
        ${isEV && subsidyAmount > 0 ? `
      <tr>
        <td class="no-border"><strong>SUBSIDY AMOUNT</strong></td>
        <td class="no-border text-right" style="color: green;"><strong>-${subsidyAmount.toFixed(2)}</strong></td>
      </tr>
      ` : ''}
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>TOTAL(B)</strong></td>
        <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
        <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
      </tr>
    </table>
    <div class="broker-info">
      <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
      <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
    </div>
    <div class="note"><strong>Notes:Booking Awaiting approval as discount exceed</strong></div>
    <div class="divider"></div>
    <div style="margin-top:2mm;">
      <div><strong>Booking Status: </strong>
      </div>
      <div class="status-box">
        ${data.finalStatus || 'Status: Not Available'}
      </div>
    </div>
    <div class="divider"></div>

    <!-- BIG QR Code at Bottom -->
    
    <div class="divider" style="margin-top: 5mm;"></div>

    <!-- Signature Section - Adjusted to fit properly -->
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
  </div>
</body>
</html>
  `;
    } else {
     // For subsequent receipts (2nd onwards) - Simplified version without price breakdown
// Show the same receipt twice with cutting line in between
return `
<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${receiptNumber}</title>
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
      height: 297mm;
      margin: 0 auto;
    }
    .receipt-copy {
      height: 138mm; /* Half of A4 page */
      page-break-inside: avoid;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      align-items: flex-start;
    }
    .header-left {
      width: 60%;
    }
    .header-right {
      width: 40%;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo-qr-container {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-end;
      margin-bottom: 5px;
      width: 100%;
    }
    .logo {
      height: 60px;
    }
    .qr-code-small {
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 12px;
      line-height: 1.1;
    }
    .customer-info-container {
      display: flex;
      font-size:12px;
    }
    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 0.5mm 0;
      line-height: 1.1;
    }
    .divider {
      border-top: 1px solid #AAAAAA;
      margin: 2mm 0;
    }
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 8px;
      margin: 8px 0;
      font-size: 12px;
    }
    .payment-info-box {
      margin: 5px 0;
    }
    .signature-box {
      margin-top: 3mm;
      font-size: 8pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 35mm;
      display: inline-block;
      margin: 0 3mm;
    }
    .cutting-line {
      border-top: 2px dashed #333;
      margin: 10mm 0;
      text-align: center;
      position: relative;
    }
    .cutting-line::before {
      content: "✂ Cut Here ✂";
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0 10px;
      font-size: 10px;
      color: #666;
    }
    .note{
      padding:1px;
      margin:2px;
      font-size: 11px;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
      }
      .receipt-copy {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- First Copy -->
    <div class="receipt-copy">
      <!-- Header Section with QR Code -->
      <div class="header-container">
        <div class="header-left">
          <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${data.branch?.gst_number || ''}<br>
            GANDHI TVS PIMPALGAON
          </div>
        </div>
        <div class="header-right">
          <!-- Logo and QR code side by side -->
          <div class="logo-qr-container">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            ${
              qrCodeImage 
                ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
                : ''
            }
          </div>
          
          <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>

          ${
            data.bookingType === 'SUBDEALER'
              ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
          <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
              : ''
          }
        </div>
      </div>
      <div class="divider"></div>

      <!-- Receipt Information -->
      <div class="receipt-info">
        <div><strong>Payment Receipt</strong></div>
        <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
        <div><strong>Receipt Date:</strong> ${receiptDate}</div>
      </div>

      <!-- Customer Information -->
      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
          <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
          <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
          <div class="customer-info-row"><strong>Chassis No:</strong> ${data.chassisNumber}</div>
          <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || 'CASH'}</div>
          <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
          <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
        </div>
      </div>

      <!-- Received Amount Section -->
      <div class="payment-info-box">
        <div class="receipt-info">
          <div><strong>Receipt Amount (Rs):</strong> ₹${data.recentPaymentAmount.toFixed(2)}</div>
          <div><strong>Receipt Number:</strong> ${receiptNumber}</div>
          <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
          <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
          <div><strong>Receipt Date:</strong> ${receiptDate}</div>
        </div>
      </div>

      <div class="note"><strong>Notes:</strong></div>
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
    </div>

    <!-- Cutting Line -->
    <div class="cutting-line"></div>

    <!-- Second Copy (Duplicate) -->
    <div class="receipt-copy">
      <!-- Header Section with QR Code -->
      <div class="header-container">
        <div class="header-left">
          <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${data.branch?.gst_number || ''}<br>
            GANDHI TVS PIMPALGAON
          </div>
        </div>
        <div class="header-right">
          <!-- Logo and QR code side by side -->
          <div class="logo-qr-container">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            ${
              qrCodeImage 
                ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
                : ''
            }
          </div>
          
          <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>

          ${
            data.bookingType === 'SUBDEALER'
              ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
          <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
              : ''
          }
        </div>
      </div>
      <div class="divider"></div>

      <!-- Receipt Information -->
      <div class="receipt-info">
        <div><strong>Payment Receipt (DUPLICATE)</strong></div>
        <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
        <div><strong>Receipt Date:</strong> ${receiptDate}</div>
      </div>

      <!-- Customer Information -->
      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
          <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
          <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka}</div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
          <div class="customer-info-row"><strong>Chassis No:</strong> ${data.chassisNumber}</div>
          <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || 'CASH'}</div>
          <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
          <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
        </div>
      </div>

      <!-- Received Amount Section -->
      <div class="payment-info-box">
        <div class="receipt-info">
          <div><strong>Receipt Amount (Rs):</strong> ₹${data.recentPaymentAmount.toFixed(2)}</div>
          <div><strong>Receipt Number:</strong> ${receiptNumber}</div>
          <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
          <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
          <div><strong>Receipt Date:</strong> ${receiptDate}</div>
        </div>
      </div>

      <div class="note"><strong>Notes:</strong></div>
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
    </div>
  </div>
</body>
</html>
  `;
}
  };


 const renderCustomerTable = () => {
  // Check if user has permission to view this tab
  if (!canViewCustomerTab) {
    return (
      <div className="text-center py-4">
        <CAlert color="warning">
          You do not have permission to view the Customer tab.
        </CAlert>
      </div>
    );
  }

  // Check if user has permission to add payments (CREATE permission) or view receipts (VIEW permission)
  const canShowActionColumn = canCreateInCustomerTab || canPrintInCustomerTab;
  const canShowAddPayment = canCreateInCustomerTab;
  const canShowPrint = canPrintInCustomerTab;

  return (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            <CTableHeaderCell scope="col">Received</CTableHeaderCell>
            <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
            <CTableHeaderCell scope="col">Receipts</CTableHeaderCell>
            {canShowActionColumn && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredBookings.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={canShowActionColumn ? "12" : "11"} style={{ color: 'red', textAlign: 'center' }}>
                {searchTerm ? 'No matching bookings found' : 'No booking available'}
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredBookings.map((booking, index) => {
              const receipts = bookingReceipts[booking._id] || [];
              
              // Sort receipts by date in ascending order (oldest first)
              const sortedReceipts = [...receipts].sort((a, b) => {
                const dateA = new Date(a.receiptDate || a.createdAt || 0);
                const dateB = new Date(b.receiptDate || b.createdAt || 0);
                return dateA - dateB; // Ascending order
              });
              
              return (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                  <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                      ? (booking.chassisNumber || '')
                      : ''
                    }
                  </CTableDataCell>
                  <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
                  <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
                  <CTableDataCell>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
                  <CTableDataCell>
                    {sortedReceipts.length > 0 ? (
                      <CDropdown>
                        <CDropdownToggle size="sm" color="info" variant="outline" disabled={!canShowPrint}>
                          {sortedReceipts.length} Receipt{sortedReceipts.length > 1 ? 's' : ''}
                        </CDropdownToggle>
                        <CDropdownMenu>
                          {sortedReceipts.map((receipt, receiptIndex) => (
                            <CDropdownItem 
                              key={receipt.id} 
                              onClick={() => printReceiptInvoice(receipt.id, booking._id, receiptIndex)}
                            >
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilPrint} className="me-2" />
                                <div>
                                  <div><strong>Receipt #{receiptIndex + 1}</strong></div>
                                  <small>
                                    {receipt.display?.amount || `₹${receipt.amount}`} - 
                                    {receipt.display?.date || new Date(receipt.receiptDate).toLocaleDateString('en-GB')}
                                  </small>
                                </div>
                              </div>
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    ) : (
                      <span className="text-muted">No receipts</span>
                    )}
                  </CTableDataCell>

                  {canShowActionColumn && (
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        className='option-button btn-sm'
                        onClick={(event) => handleMenuClick(event, booking._id)}
                        disabled={!canShowAddPayment}
                      >
                        <CIcon icon={cilSettings} />
                        Options
                      </CButton>

                      <Menu
                        id={`action-menu-${booking._id}`}
                        anchorEl={anchorEl}
                        open={menuBookingId === booking._id}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        {canShowAddPayment && (
                          <MenuItem onClick={() => {
                            handleAddClick(booking);
                            handleMenuClose();
                          }}>
                            <CIcon icon={cilPlus} className="me-2" />
                            Add Payment
                          </MenuItem>
                        )}
                      </Menu>
                    </CTableDataCell>
                  )}
                </CTableRow>
              );
            })
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};
const renderPaymentVerificationTable = () => {
 
  if (!canViewPaymentVerificationTab) {
    return (
      <div className="text-center py-4">
        <CAlert color="warning">
          You do not have permission to view the Payment Verification tab.
        </CAlert>
      </div>
    );
  }

  return (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
            <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
            <CTableHeaderCell scope="col">Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Bank Receipts</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            {canCreateInPaymentVerificationTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredPendingLedgerEntries.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={canCreateInPaymentVerificationTab ? "11" : "10"} style={{ color: 'red', textAlign: 'center' }}>
                {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredPendingLedgerEntries.map((entry, index) => {
              // Fetch receipts for the booking associated with this ledger entry
              const bookingId = entry.bookingDetails?._id || entry.booking;
              const receipts = bookingReceipts[bookingId] || [];
              
              // Filter only BANK payment mode receipts
              const bankReceipts = receipts.filter(receipt => 
                receipt.paymentMode && 
                receipt.paymentMode.toUpperCase() === 'BANK'
              );
              
              // Sort bank receipts by date in ascending order (oldest first)
              const sortedBankReceipts = [...bankReceipts].sort((a, b) => {
                const dateA = new Date(a.receiptDate || a.createdAt || 0);
                const dateB = new Date(b.receiptDate || b.createdAt || 0);
                return dateA - dateB; // Ascending order
              });
              
              return (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.bookingDetails?.bookingNumber || entry.booking || ''}</CTableDataCell>
                  <CTableDataCell>{entry.bookingDetails?.customerDetails?.name || ''}</CTableDataCell>
                  <CTableDataCell>{entry.paymentMode || ''}</CTableDataCell>
                  <CTableDataCell>{entry.amount || ''}</CTableDataCell>
                  <CTableDataCell>{entry.transactionReference || ''}</CTableDataCell>
                  <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>
                    {sortedBankReceipts.length > 0 ? (
                      <CDropdown>
                        <CDropdownToggle size="sm" color="info" variant="outline">
                          {sortedBankReceipts.length} Bank Receipt{sortedBankReceipts.length > 1 ? 's' : ''}
                        </CDropdownToggle>
                        <CDropdownMenu>
                          {sortedBankReceipts.map((receipt, receiptIndex) => (
                            <CDropdownItem 
                              key={receipt.id} 
                              onClick={() => printReceiptInvoice(receipt.id, bookingId, receiptIndex)}
                              disabled={!canPrintInCustomerTab} // Use same print permission
                            >
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilPrint} className="me-2" />
                                <div>
                                  <div><strong>Bank Receipt #{receiptIndex + 1}</strong></div>
                                  <small>
                                    {receipt.display?.amount || `₹${receipt.amount}`} - 
                                    {receipt.display?.date || (receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString('en-GB') : 'N/A')}
                                  </small>
                                </div>
                              </div>
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    ) : (
                      <span className="text-muted">No bank receipts</span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
                      {entry.approvalStatus === 'Pending' ? 'PENDING' : 'VERIFIED'}
                    </CBadge>
                  </CTableDataCell>
                  {canCreateInPaymentVerificationTab && (
                    <CTableDataCell>
                      {entry.approvalStatus === 'Pending' ? (
                        <CButton
                          size="sm"
                          className="action-btn"
                          onClick={() => handleVerifyPayment(entry)}
                        >
                          <CIcon icon={cilCheckCircle} className="me-1" />
                          Verify
                        </CButton>
                      ) : (
                        <span className="text-muted">Verified</span>
                      )}
                    </CTableDataCell>
                  )}
                </CTableRow>
              );
            })
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

 const renderCompletePaymentTable = () => {
    if (!canViewCompletePaymentTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Complete Payment tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Received</CTableHeaderCell>
              <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {completePayments.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching complete payments found' : 'No complete payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              completePayments.map((booking, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                      ? (booking.chassisNumber || '')
                      : ''
                    }
                  </CTableDataCell>
                  <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
                  <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
                  <CTableDataCell style={{ color: 'green' }}>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

const renderPendingListTable = () => {
    // Check if user has permission to view this tab
    if (!canViewPendingListTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Pending List tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Received</CTableHeaderCell>
              <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {pendingPayments.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              pendingPayments.map((booking, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                      ? (booking.chassisNumber || '')
                      : ''
                    }
                  </CTableDataCell>
                  <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
                  <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
                  <CTableDataCell style={{ color: 'red' }}>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderVerifiedListTable = () => {
    // Check if user has permission to view this tab
    if (!canViewVerifiedListTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Verified List tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredVerifiedLedgerEntries.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching verified payments found' : 'No verified payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredVerifiedLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.bookingDetails?.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{entry.bookingDetails?.customerDetails?.name || ''}</CTableDataCell>
                  <CTableDataCell>{entry.paymentMode}</CTableDataCell>
                  <CTableDataCell>{entry.amount}</CTableDataCell>
                  <CTableDataCell>{entry.transactionReference}</CTableDataCell>
                  <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{entry.receivedByDetails?.name || ''}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (!canViewReceipts) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Receipts.
      </div>
    );
  }

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any tabs in Receipts.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Receipt Management</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one */}
          {canViewAnyTab ? (
            <>
              {/* Excel Export Button - MOVED TO LEFT SIDE */}
              {canCreateReceipts && (
                <div className="d-flex mb-3">
                  <CButton 
                    size="sm" 
                    className="action-btn"
                    onClick={handleOpenExportModal}
                    title="Export Excel"
                  >
                    <FontAwesomeIcon icon={faFileExcel} className='me-1' />
                    Export Excel
                  </CButton>
                </div>
              )}

              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewCustomerTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 0}
                      onClick={() => handleTabChange(0)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                        color: 'black',
                        borderBottom: 'none'
                      }}
                    >
                      Customer
                      {!canCreateInCustomerTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {/* Payment Verification tab - Only show if user has VIEW permission */}
                {canViewPaymentVerificationTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 1}
                      onClick={() => handleTabChange(1)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Payment Verification
                      {!canCreateInPaymentVerificationTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletePaymentTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 2}
                      onClick={() => handleTabChange(2)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                          borderBottom: 'none',
                          color: 'black'
                      }}
                    >
                      Complete Payment
                      {!canCreateInCompletePaymentTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewPendingListTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 3}
                      onClick={() => handleTabChange(3)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Pending List
                      {!canCreateInPendingListTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewVerifiedListTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 4}
                      onClick={() => handleTabChange(4)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Verified List
                      {!canCreateInVerifiedListTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <div className="d-flex justify-content-between mb-3">
                <div>
                  {/* This div is now empty since Excel button moved above */}
                </div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!canViewAnyTab}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewCustomerTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderCustomerTable()}
                  </CTabPane>
                )}
                {canViewPaymentVerificationTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderPaymentVerificationTable()}
                  </CTabPane>
                )}
                {canViewCompletePaymentTab && (
                  <CTabPane visible={activeTab === 2}>
                    {renderCompletePaymentTable()}
                  </CTabPane>
                )}
                {canViewPendingListTab && (
                  <CTabPane visible={activeTab === 3}>
                    {renderPendingListTable()}
                  </CTabPane>
                )}
                {canViewVerifiedListTab && (
                  <CTabPane visible={activeTab === 4}>
                    {renderVerifiedListTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in Receipts.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <ReceiptModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        bookingData={selectedBooking} 
        canCreateReceipts={canCreateInCustomerTab} // Pass tab-specific CREATE permission
        cashLocations={cashLocations} // Pass cash locations to modal
        onPaymentSuccess={handlePaymentSuccess} 
      />

      {/* Date Range Modal for Excel Export */}
      <CModal alignment="center" visible={openExportModal} onClose={handleCloseExportModal}>
        <CModalHeader>
          <CModalTitle>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Select Date Range for Receipts Export
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Display export error */}
          {exportError && (
            <CAlert color="warning" className="mb-3">
              {exportError}
            </CAlert>
          )}
          
          <LocalizationProvider 
            dateAdapter={AdapterDateFns} 
            adapterLocale={enIN} // Add Indian locale
          >
            <div className="mb-3">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setExportError(''); // Clear error when user changes date
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                inputFormat="dd/MM/yyyy" // Use slash format for display
                mask="__/__/____" // Add mask for better UX
                views={['day', 'month', 'year']} // Show day-month-year in that order
                disabled={!canCreateReceipts}
              />
            </div>
            <div className="mb-3">
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setExportError(''); // Clear error when user changes date
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                inputFormat="dd/MM/yyyy" // Use slash format for display
                mask="__/__/____" // Add mask for better UX
                minDate={startDate}
                views={['day', 'month', 'year']} // Show day-month-year in that order
                disabled={!canCreateReceipts}
              />
            </div>
          </LocalizationProvider>
          
          <TextField
            select
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setExportError(''); // Clear error when user changes branch
            }}
            fullWidth
            size="small"
            SelectProps={{ native: true }}
            disabled={!canCreateReceipts}
          >
            <option value="">-- Select Branch --</option>
             {hasAllBranchAccess && (
                  <option value="all">All Branch</option>
                )}
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </TextField>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseExportModal}>
            Cancel
          </CButton>
          <CButton 
            className="submit-button"
            onClick={handleExcelExport}
            disabled={!startDate || !endDate || !selectedBranchId || !canCreateReceipts || exportLoading}
          >
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default Receipt;
