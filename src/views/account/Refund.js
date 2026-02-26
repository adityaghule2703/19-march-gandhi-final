// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   showError
// } from '../../utils/tableImports';
// import RefundModel from './RefundModel';
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
//   CAlert
// } from '@coreui/react';

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const Refund = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const { permissions } = useAuth();

//   // Page-level permission checks for Refund under ACCOUNT module
//   const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canUpdateRefund = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canDeleteRefund = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
//   const showActionColumn = canCreateRefund;

//   useEffect(() => {
//     if (!canViewRefund) {
//       return;
//     }
    
//     fetchData();
//   }, [canViewRefund]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);

//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setData(branchBookings);
//       setFilteredData(branchBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreateRefund) {
//       showError('You do not have permission to process refunds');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('booking'));
//   };

//   const handleRefundSaved = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     fetchData();
//   };

//   if (!canViewRefund) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Refunds.
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
//       <div className='title'>Customer Refund</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div></div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewRefund}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
//                       No booking details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((booking, index) => (
//                     <CTableRow key={booking._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                           ? (booking.chassisNumber || 'N/A')
//                           : 'N/A'
//                         }
//                       </CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             className="action-btn"
//                             onClick={() => handleAddClick(booking)}
//                             disabled={!canCreateRefund}
//                           >
//                             Add
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
      
//       <RefundModel 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         bookingData={selectedBooking}
//         onRefundSaved={handleRefundSaved}
//         canCreateRefund={canCreateRefund}
//       />
//     </div>
//   );
// };

// export default Refund;






// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   axiosInstance,
//   showError
// } from '../../utils/tableImports';
// import RefundModel from './RefundModel';
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
//   CAlert
// } from '@coreui/react';

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const Refund = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const { permissions } = useAuth();

//   // Page-level permission checks for Refund under ACCOUNT module
//   const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canUpdateRefund = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canDeleteRefund = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
//   const showActionColumn = canCreateRefund;

//   useEffect(() => {
//     if (!canViewRefund) {
//       return;
//     }
    
//     fetchData();
//   }, [canViewRefund]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);

//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setData(branchBookings);
//       setFilteredData(branchBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreateRefund) {
//       showError('You do not have permission to process refunds');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('booking'));
//   };

//   const handleRefundSaved = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     fetchData();
//   };

//   if (!canViewRefund) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Refunds.
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
//       <div className='title'>Customer Refund</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div></div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewRefund}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
//                       No booking details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredData.map((booking, index) => (
//                     <CTableRow key={booking._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                           ? (booking.chassisNumber || 'N/A')
//                           : 'N/A'
//                         }
//                       </CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             className="action-btn"
//                             onClick={() => handleAddClick(booking)}
//                             disabled={!canCreateRefund}
//                           >
//                             Add
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
      
//       <RefundModel 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         bookingData={selectedBooking}
//         onRefundSaved={handleRefundSaved}
//         canCreateRefund={canCreateRefund}
//       />
//     </div>
//   );
// };

// export default Refund;

// import '../../css/table.css';
// import React, { useState, useEffect } from 'react';
// import RefundModel from './RefundModel';
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
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPrint, cilCloudDownload } from '@coreui/icons';
// import QRCode from 'qrcode';
// import tvsLogo from '../../assets/images/logo.png';
// import config from '../../config';
// import { numberToWords } from '../../utils/numberToWords';
// import axios from 'axios';

// // Import utility functions directly
// import { getDefaultSearchFields, showError } from '../../utils/tableImports';

// // Create axios instance
// const axiosInstance = axios.create({
//   baseURL: config.baseURL || 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Custom hook for table filtering
// const useTableFilter = (initialData) => {
//   const [data, setData] = useState(initialData);
//   const [filteredData, setFilteredData] = useState(initialData);

//   const handleFilter = (searchTerm, searchFields) => {
//     if (!searchTerm) {
//       setFilteredData(data);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const filtered = data.filter((row) =>
//       searchFields.some((field) => {
//         const value = field.split('.').reduce((obj, key) => {
//           if (!obj) return '';
//           if (key.match(/^\d+$/)) return obj[parseInt(key)];
//           return obj[key];
//         }, row);

//         if (value === undefined || value === null) return false;
//         return String(value).toLowerCase().includes(term);
//       })
//     );
//     setFilteredData(filtered);
//   };

//   return { data, setData, filteredData, setFilteredData, handleFilter };
// };

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const Refund = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
  
//   // State for receipts
//   const [bookingReceipts, setBookingReceipts] = useState({});
//   const [loadingReceipts, setLoadingReceipts] = useState({});
//   const [receiptsFetched, setReceiptsFetched] = useState({});

//   const { permissions } = useAuth();

//   // Page-level permission checks for Refund under ACCOUNT module
//   const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canUpdateRefund = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canDeleteRefund = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
//   const showActionColumn = canCreateRefund;

//   useEffect(() => {
//     if (!canViewRefund) {
//       return;
//     }
    
//     fetchData();
//   }, [canViewRefund]);

//   // Fetch receipts for a specific booking
//   const fetchReceiptsForBooking = async (bookingId) => {
//     if (receiptsFetched[bookingId] || loadingReceipts[bookingId]) {
//       return;
//     }

//     try {
//       setLoadingReceipts(prev => ({ ...prev, [bookingId]: true }));
      
//       const receiptsResponse = await axiosInstance.get(`/ledger/booking/${bookingId}`);
//       const receipts = receiptsResponse.data.data.allReceipts || [];
      
//       setBookingReceipts(prev => ({
//         ...prev,
//         [bookingId]: receipts
//       }));
      
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [bookingId]: true
//       }));
//     } catch (error) {
//       console.error(`Error fetching receipts for booking ${bookingId}:`, error);
//       setBookingReceipts(prev => ({
//         ...prev,
//         [bookingId]: []
//       }));
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [bookingId]: true
//       }));
//     } finally {
//       setLoadingReceipts(prev => ({ ...prev, [bookingId]: false }));
//     }
//   };

//   // Load receipts for visible bookings
//   useEffect(() => {
//     if (filteredData.length > 0) {
//       filteredData.forEach(booking => {
//         if (!receiptsFetched[booking._id] && !loadingReceipts[booking._id]) {
//           fetchReceiptsForBooking(booking._id);
//         }
//       });
//     }
//   }, [filteredData, receiptsFetched, loadingReceipts]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);

//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setData(branchBookings);
//       setFilteredData(branchBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreateRefund) {
//       showError('You do not have permission to process refunds');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('booking'));
//   };

//   const handleRefundSaved = async (message, newReceiptId) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     await fetchData();
    
//     // If a specific booking was selected, reset its receipts cache and print the new refund receipt
//     if (selectedBooking) {
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [selectedBooking._id]: false
//       }));
//       setBookingReceipts(prev => ({
//         ...prev,
//         [selectedBooking._id]: []
//       }));
      
//       // Auto-print the new refund receipt if receipt ID is provided
//       if (newReceiptId) {
//         setTimeout(() => {
//           printReceiptInvoice(newReceiptId, selectedBooking._id, 0);
//         }, 500); // Small delay to ensure data is loaded
//       }
//     }
    
//     setSelectedBooking(null);
//   };

//   // Print receipt invoice (using the 2nd receipt design with cut line)
//   const printReceiptInvoice = async (receiptId, bookingId, receiptIndex = 0) => {
//     try {
//       const receiptResponse = await axiosInstance.get(`/ledger/receipt/${receiptId}`);
//       const receiptData = receiptResponse.data.data.receipt;
      
//       const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${bookingId}`);
//       const bookingData = bookingResponse.data.data.bookingDetails;
//       const finalStatus = bookingResponse.data.data.finalStatus || '';
//       const qrCodeData = receiptData.qrCodeData || {};
      
//       const subsidyAmount = bookingData.subsidyAmount || 0;
//       const isEV = bookingData.model?.type === 'EV';
      
//       const qrText = `GANDHI MOTORS PVT LTD
// Booking Number: ${qrCodeData.bookingNumber || bookingData.bookingNumber}
// Customer: ${qrCodeData.customerName || bookingData.customerDetails?.name}
// Mobile: ${qrCodeData.mobileNo || bookingData.customerDetails?.mobile1}
// Model: ${qrCodeData.modelName || bookingData.model?.model_name}
// Type: ${bookingData.model?.type || 'N/A'}
// Chassis: ${qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated'}
// Payment Type: ${qrCodeData.paymentType || bookingData.payment?.type}
// Total Amount: ₹${bookingData.discountedAmount?.toFixed(2) || '0'}
// ${isEV && subsidyAmount > 0 ? `Subsidy: -₹${subsidyAmount.toFixed(2)}` : ''}
// Refund: ${receiptData.receiptNumber || 'N/A'}
// Amount: ${receiptData.display?.amount || `₹${receiptData.amount?.toFixed(2) || '0'}`}
// Payment Mode: ${receiptData.paymentMode || 'Cash'}
// Reference: ${receiptData.transactionReference || 'N/A'}
// Date: ${new Date(receiptData.receiptDate).toLocaleDateString('en-GB')}`;

//       let qrCodeImage = '';
//       try {
//         qrCodeImage = await QRCode.toDataURL(qrText, {
//           width: 100,
//           margin: 2,
//           color: {
//             dark: '#000000',
//             light: '#FFFFFF'
//           },
//           errorCorrectionLevel: 'H'
//         });
//       } catch (error) {
//         console.error('Error generating QR code:', error);
//         qrCodeImage = '';
//       }

//       const transformedData = {
//         bookingNumber: bookingData.bookingNumber,
//         bookingType: bookingData.bookingType,
//         rto: bookingData.rto,
//         hpa: bookingData.hpa,
//         gstin: bookingData.branch?.gst_number || '',
//         model: {
//           model_name: bookingData.model?.model_name || 'N/A',
//           type: bookingData.model?.type || 'N/A'
//         },
//         chassisNumber: qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated',
//         customerDetails: {
//           name: bookingData.customerDetails?.name || 'N/A',
//           address: `${bookingData.customerDetails?.address || ''}, ${bookingData.customerDetails?.taluka || ''}`,
//           mobile1: bookingData.customerDetails?.mobile1 || '',
//         },
//         payment: {
//           type: bookingData.payment?.type || 'CASH',
//           financer: bookingData.payment?.financer
//         },
//         salesExecutive: bookingData.salesExecutive,
//         branch: {
//           gst_number: bookingData.branch?.gst_number || ''
//         },
//         recentPayment: receiptData,
//         qrCodeImage: qrCodeImage,
//         recentPaymentAmount: receiptData.amount || 0,
//         bookingDetails: bookingData,
//       };

//       // Always use the 2nd receipt design (with cut line)
//       const invoiceHTML = generateRefundReceiptHTML(transformedData);

//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(invoiceHTML);
//       printWindow.document.close();
      
//       printWindow.onload = function() {
//         printWindow.focus();
//         printWindow.print();
//       };
      
//     } catch (error) {
//       console.error('Error generating refund receipt:', error);
//       showError(error, 'Failed to generate refund receipt');
//     }
//   };

//   // Generate refund receipt HTML - EXACTLY like the 2nd receipt design from Receipts page
//   const generateRefundReceiptHTML = (data) => {
//     const currentDate = new Date().toLocaleDateString('en-GB');
//     const receiptDate = data.recentPayment?.receiptDate 
//       ? new Date(data.recentPayment.receiptDate).toLocaleDateString('en-GB')
//       : currentDate;
    
//     const recentPaymentAmount = data.recentPaymentAmount || 0;
//     const recentPaymentAmountRef = data.recentPayment?.transactionReference || "-";
//     const recentPaymentAmountInWords = numberToWords(recentPaymentAmount);
//     const recentPaymentAmountType = data.recentPayment?.paymentMode || "-";
//     const receiptNumber = data.recentPayment?.receiptNumber || "-";
//     const refundReason = data.recentPayment?.refundReason || data.recentPayment?.paymentDetails?.refundDetails?.reason || 'N/A';

//     const qrCodeImage = data.qrCodeImage || '';

//     return `<!DOCTYPE html>
// <html>
// <head>
//   <title>Refund Receipt - ${receiptNumber}</title>
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
//       height: 138mm;
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
//     .refund-badge {
//       color: #d32f2f;
//       font-weight: bold;
//       font-size: 12px;
//       margin-left: 5px;
//     }
//     .amount-in-words {
//       font-style: italic;
//       margin-top: 5px;
//       color: #333;
//       padding: 5px;
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
//     <!-- FIRST COPY (TOP) -->
//     <div class="receipt-copy">
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
//           <div class="logo-qr-container">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             ${
//               qrCodeImage 
//                 ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
//                 : ''
//             }
//           </div>
          
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Refund No:</strong> ${receiptNumber}</div>

//           ${
//             data.bookingType === 'SUBDEALER'
//               ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//           <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//               : ''
//           }
//         </div>
//       </div>
//       <div class="divider"></div>

//       <div class="receipt-info">
//         <div><strong>Refund Receipt <span class="refund-badge">(REFUND)</span></strong></div>
//         <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>

//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}</div>
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

//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div><strong>Refund Amount (Rs):</strong> ₹${recentPaymentAmount.toFixed(2)}</div>
//           <div><strong>Refund Number:</strong> ${receiptNumber}</div>
//           <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//           <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//           <div><strong>Refund Date:</strong> ${receiptDate}</div>
//           <div><strong>Refund Reason:</strong> ${refundReason}</div>
//         </div>
//         <div class="amount-in-words">
//           <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
//         </div>
//       </div>

//       <div class="note"><strong>Notes: This is a refund transaction against booking ${data.bookingNumber}</strong></div>
//       <div class="divider"></div>

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

//     <!-- CUTTING LINE -->
//     <div class="cutting-line"></div>

//     <!-- DUPLICATE COPY (BOTTOM) -->
//     <div class="receipt-copy">
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
//           <div class="logo-qr-container">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             ${
//               qrCodeImage 
//                 ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
//                 : ''
//             }
//           </div>
          
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Refund No:</strong> ${receiptNumber}</div>

//           ${
//             data.bookingType === 'SUBDEALER'
//               ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//           <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//               : ''
//           }
//         </div>
//       </div>
//       <div class="divider"></div>

//       <div class="receipt-info">
//         <div><strong>Refund Receipt (DUPLICATE) <span class="refund-badge">(REFUND)</span></strong></div>
//         <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>

//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}</div>
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

//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div><strong>Refund Amount (Rs):</strong> ₹${recentPaymentAmount.toFixed(2)}</div>
//           <div><strong>Refund Number:</strong> ${receiptNumber}</div>
//           <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//           <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//           <div><strong>Refund Date:</strong> ${receiptDate}</div>
//           <div><strong>Refund Reason:</strong> ${refundReason}</div>
//         </div>
//         <div class="amount-in-words">
//           <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
//         </div>
//       </div>

//       <div class="note"><strong>Notes: This is a refund transaction against booking ${data.bookingNumber}</strong></div>
//       <div class="divider"></div>

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
// </html>`;
//   };

//   if (!canViewRefund) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Refunds.
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
//       <div className='title'>Customer Refund</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div></div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewRefund}
//               style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   <CTableHeaderCell>Refund Receipts</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
//                       No booking details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredData.map((booking, index) => {
//                     const hasReceipts = receiptsFetched[booking._id] && bookingReceipts[booking._id]?.length > 0;
//                     const isLoading = loadingReceipts[booking._id];
//                     const receipts = bookingReceipts[booking._id] || [];
                    
//                     // Filter receipts to show ONLY those with isRefund: true
//                     const refundReceipts = receipts.filter(receipt => receipt.isRefund === true);
                    
//                     const sortedRefundReceipts = [...refundReceipts].sort((a, b) => {
//                       const dateA = new Date(a.receiptDate || a.createdAt || 0);
//                       const dateB = new Date(b.receiptDate || b.createdAt || 0);
//                       return dateB - dateA; // Newest first
//                     });
                    
//                     return (
//                       <CTableRow key={booking._id || index}>
//                         <CTableDataCell>{index + 1}</CTableDataCell>
//                         <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
//                         </CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                             ? (booking.chassisNumber || 'N/A')
//                             : 'N/A'
//                           }
//                         </CTableDataCell>
//                         <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                         <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                         <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                         <CTableDataCell>
//                           {isLoading ? (
//                             <CSpinner size="sm" color="info" />
//                           ) : sortedRefundReceipts.length > 0 ? (
//                             <CDropdown>
//                               <CDropdownToggle size="sm" color="info" variant="outline">
//                                 {sortedRefundReceipts.length} Refund Receipt{sortedRefundReceipts.length > 1 ? 's' : ''}
//                               </CDropdownToggle>
//                               <CDropdownMenu>
//                                 {sortedRefundReceipts.map((receipt, receiptIndex) => (
//                                   <CDropdownItem 
//                                     key={receipt.id} 
//                                     onClick={() => printReceiptInvoice(receipt.id, booking._id, receiptIndex)}
//                                   >
//                                     <div className="d-flex align-items-center">
//                                       <CIcon icon={cilPrint} className="me-2" />
//                                       <div>
//                                         <div><strong>Refund Receipt #{receiptIndex + 1}</strong></div>
//                                         <small>
//                                           {receipt.display?.amount || `₹${receipt.amount}`} - 
//                                           {receipt.display?.date || new Date(receipt.receiptDate).toLocaleDateString('en-GB')}
//                                         </small>
//                                       </div>
//                                     </div>
//                                   </CDropdownItem>
//                                 ))}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           ) : receiptsFetched[booking._id] ? (
//                             <span className="text-muted">No refund receipts</span>
//                           ) : (
//                             <CButton
//                               size="sm"
//                               color="light"
//                               onClick={() => fetchReceiptsForBooking(booking._id)}
//                               disabled={isLoading}
//                             >
//                               <CIcon icon={cilCloudDownload} className="me-1" />
//                               Load Receipts
//                             </CButton>
//                           )}
//                         </CTableDataCell>
//                         {showActionColumn && (
//                           <CTableDataCell>
//                             <CButton
//                               size="sm"
//                               color="primary"
//                               className="action-btn"
//                               onClick={() => handleAddClick(booking)}
//                               disabled={!canCreateRefund}
//                             >
//                               Add Refund
//                             </CButton>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
      
//       <RefundModel 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         bookingData={selectedBooking}
//         onRefundSaved={handleRefundSaved}
//         canCreateRefund={canCreateRefund}
//       />
//     </div>
//   );
// };

// export default Refund;









// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   axiosInstance,
//   showError
// } from '../../utils/tableImports';
// import RefundModel from './RefundModel';
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
//   CAlert
// } from '@coreui/react';

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const Refund = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const { permissions } = useAuth();

//   // Page-level permission checks for Refund under ACCOUNT module
//   const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canUpdateRefund = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canDeleteRefund = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
//   const showActionColumn = canCreateRefund;

//   useEffect(() => {
//     if (!canViewRefund) {
//       return;
//     }
    
//     fetchData();
//   }, [canViewRefund]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);

//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setData(branchBookings);
//       setFilteredData(branchBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreateRefund) {
//       showError('You do not have permission to process refunds');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('booking'));
//   };

//   const handleRefundSaved = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     fetchData();
//   };

//   if (!canViewRefund) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Refunds.
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
//       <div className='title'>Customer Refund</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div></div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewRefund}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
//                       No booking details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredData.map((booking, index) => (
//                     <CTableRow key={booking._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                           ? (booking.chassisNumber || 'N/A')
//                           : 'N/A'
//                         }
//                       </CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             className="action-btn"
//                             onClick={() => handleAddClick(booking)}
//                             disabled={!canCreateRefund}
//                           >
//                             Add
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
      
//       <RefundModel 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         bookingData={selectedBooking}
//         onRefundSaved={handleRefundSaved}
//         canCreateRefund={canCreateRefund}
//       />
//     </div>
//   );
// };

// export default Refund;











// import '../../css/table.css';
// import '../../css/receipt.css';
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormSelect,
//   CRow,
//   CCol,
//   CBackdrop
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPrint, cilCloudDownload } from '@coreui/icons';
// import QRCode from 'qrcode';
// import tvsLogo from '../../assets/images/logo.png';
// import config from '../../config';
// import { numberToWords } from '../../utils/numberToWords';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

// // Import utility functions directly
// import { getDefaultSearchFields, showError } from '../../utils/tableImports';

// // Create axios instance
// const axiosInstance = axios.create({
//   baseURL: config.baseURL || 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Custom hook for table filtering
// const useTableFilter = (initialData) => {
//   const [data, setData] = useState(initialData);
//   const [filteredData, setFilteredData] = useState(initialData);

//   const handleFilter = (searchTerm, searchFields) => {
//     if (!searchTerm) {
//       setFilteredData(data);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const filtered = data.filter((row) =>
//       searchFields.some((field) => {
//         const value = field.split('.').reduce((obj, key) => {
//           if (!obj) return '';
//           if (key.match(/^\d+$/)) return obj[parseInt(key)];
//           return obj[key];
//         }, row);

//         if (value === undefined || value === null) return false;
//         return String(value).toLowerCase().includes(term);
//       })
//     );
//     setFilteredData(filtered);
//   };

//   return { data, setData, filteredData, setFilteredData, handleFilter };
// };

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';

// const Refund = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
  
//   // ============ REFUND MODAL STATES ============
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     bookingId: '',
//     modeOfPayment: '',
//     amount: '',
//     remark: '',
//     cashLocation: '',
//     bank: '',
//     subPaymentMode: '',
//     transactionReference: '',
//     refundReason: ''
//   });
//   const [cashLocations, setCashLocations] = useState([]);
//   const [bankLocations, setBankLocations] = useState([]);
//   const [paymentSubModes, setPaymentSubModes] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formError, setFormError] = useState(null);
  
//   // ============ ON-DEMAND RECEIPTS FETCHING ============
//   const [bookingReceipts, setBookingReceipts] = useState({});
//   const [loadingReceipts, setLoadingReceipts] = useState({});
//   const [receiptsFetched, setReceiptsFetched] = useState({});

//   const { permissions } = useAuth();

//   // Page-level permission checks
//   const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
//   const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
//   const showActionColumn = canCreateRefund;

//   // ============ FILTER FUNCTIONS ============
//   const filterData = (data, searchTerm) => {
//     if (!searchTerm) return data;

//     const searchFields = ['bookingNumber', 'customerDetails.name', 'model.model_name', 'chassisNumber'];
//     const term = searchTerm.toLowerCase();

//     return data.filter((row) =>
//       searchFields.some((field) => {
//         const value = field.split('.').reduce((obj, key) => {
//           if (!obj) return '';
//           return obj[key];
//         }, row);

//         if (value === undefined || value === null) return false;
//         return String(value).toLowerCase().includes(term);
//       })
//     );
//   };

//   // ============ DERIVED DATA ============
//   const filteredBookings = useMemo(() => 
//     filterData(data, searchTerm), 
//     [data, searchTerm]
//   );

//   // ============ EFFECTS ============
//   useEffect(() => {
//     if (!canViewRefund) {
//       return;
//     }
//     fetchData();
//   }, [canViewRefund]);

//   // Fetch receipts for visible bookings
//   useEffect(() => {
//     if (filteredBookings.length > 0) {
//       filteredBookings.forEach(booking => {
//         if (!receiptsFetched[booking._id] && !loadingReceipts[booking._id]) {
//           fetchReceiptsForBooking(booking._id);
//         }
//       });
//     }
//   }, [filteredBookings, receiptsFetched, loadingReceipts]);

//   // ============ FETCH FUNCTIONS ============
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);

//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setData(branchBookings);
//       setFilteredData(branchBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReceiptsForBooking = async (bookingId) => {
//     if (receiptsFetched[bookingId] || loadingReceipts[bookingId]) {
//       return;
//     }

//     try {
//       setLoadingReceipts(prev => ({ ...prev, [bookingId]: true }));
      
//       const receiptsResponse = await axiosInstance.get(`/ledger/booking/${bookingId}`);
//       const receipts = receiptsResponse.data.data.allReceipts || [];
      
//       setBookingReceipts(prev => ({
//         ...prev,
//         [bookingId]: receipts
//       }));
      
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [bookingId]: true
//       }));
//     } catch (error) {
//       console.error(`Error fetching receipts for booking ${bookingId}:`, error);
//       setBookingReceipts(prev => ({
//         ...prev,
//         [bookingId]: []
//       }));
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [bookingId]: true
//       }));
//     } finally {
//       setLoadingReceipts(prev => ({ ...prev, [bookingId]: false }));
//     }
//   };

//   const fetchCashLocations = async () => {
//     try {
//       const response = await axiosInstance.get('/cash-locations');
//       setCashLocations(response.data.data.cashLocations || []);
//     } catch (error) {
//       console.error('Error fetching cash locations:', error);
//       setCashLocations([]);
//     }
//   };

//   const fetchBankLocations = async () => {
//     try {
//       const response = await axiosInstance.get('/banks');
//       setBankLocations(response.data.data.banks || []);
//     } catch (error) {
//       console.error('Error fetching bank locations:', error);
//       setBankLocations([]);
//     }
//   };

//   const fetchPaymentSubModes = async () => {
//     try {
//       const response = await axiosInstance.get('/banksubpaymentmodes');
//       setPaymentSubModes(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching payment sub-modes:', error);
//       setPaymentSubModes([]);
//     }
//   };

//   // ============ HANDLERS ============
//   const handleAddClick = (booking) => {
//     if (!canCreateRefund) {
//       showError('You do not have permission to process refunds');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setFormData({
//       bookingId: booking._id,
//       modeOfPayment: '',
//       amount: '',
//       remark: '',
//       cashLocation: '',
//       bank: '',
//       subPaymentMode: '',
//       transactionReference: '',
//       refundReason: ''
//     });
//     setFormError(null);
    
//     // Fetch dropdown data
//     fetchCashLocations();
//     fetchBankLocations();
//     fetchPaymentSubModes();
    
//     setShowModal(true);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // TEST FUNCTION - Direct print test
//   const testPrint = () => {
//     console.log("=== TEST PRINT FUNCTION CALLED ===");
//     const testWindow = window.open('', '_blank');
//     testWindow.document.write('<html><head><title>Test Print</title></head><body><h1>Test Print - If you see this, printing works!</h1></body></html>');
//     testWindow.document.close();
//     testWindow.print();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setFormError(null);

//     console.log("=== SUBMITTING REFUND ===");
//     console.log("Form data:", formData);
//     console.log("Selected booking:", selectedBooking);

//     try {
//       let paymentData = {
//         bookingId: formData.bookingId,
//         paymentMode: formData.modeOfPayment,
//         amount: parseFloat(formData.amount),
//         remark: formData.remark,
//         transactionReference: formData.transactionReference,
//         refundReason: formData.refundReason
//       };

//       switch (formData.modeOfPayment) {
//         case 'Cash':
//           paymentData.cashLocation = formData.cashLocation;
//           break;
//         case 'Bank':
//           paymentData.bank = formData.bank;
//           paymentData.subPaymentMode = formData.subPaymentMode;
//           break;
//         default:
//           break;
//       }

//       console.log("Sending payment data:", paymentData);
//       const response = await axiosInstance.post('/ledger/refund', paymentData);
      
//       console.log("=== REFUND RESPONSE ===");
//       console.log("Full response:", response);
//       console.log("Response data:", response.data);
      
//       // Try multiple ways to extract receipt ID
//       let receiptId = null;
//       let receiptData = null;
      
//       // Method 1: Check direct receipt object
//       if (response.data.data?.receipt?._id) {
//         receiptId = response.data.data.receipt._id;
//         receiptData = response.data.data.receipt;
//         console.log("Method 1 - Found receipt._id:", receiptId);
//       }
//       // Method 2: Check refund object
//       else if (response.data.data?.refund?._id) {
//         receiptId = response.data.data.refund._id;
//         receiptData = response.data.data.refund;
//         console.log("Method 2 - Found refund._id:", receiptId);
//       }
//       // Method 3: Check data._id
//       else if (response.data.data?._id) {
//         receiptId = response.data.data._id;
//         receiptData = response.data.data;
//         console.log("Method 3 - Found data._id:", receiptId);
//       }
//       // Method 4: Check allReceipts array
//       else if (response.data.data?.allReceipts?.length > 0) {
//         const receipts = response.data.data.allReceipts;
//         console.log("Method 4 - Found allReceipts:", receipts);
//         // Get the most recent receipt
//         const latestReceipt = receipts.sort((a, b) => 
//           new Date(b.receiptDate || b.createdAt) - new Date(a.receiptDate || a.createdAt)
//         )[0];
//         receiptId = latestReceipt?.id || latestReceipt?._id;
//         receiptData = latestReceipt;
//         console.log("Method 4 - Latest receipt:", latestReceipt);
//       }

//       console.log("=== EXTRACTED RECEIPT ID ===");
//       console.log("Receipt ID:", receiptId);
//       console.log("Receipt Data:", receiptData);

//       setSuccessMessage('Refund successfully recorded!');

//       // Close modal
//       setShowModal(false);
      
//       // Refresh data
//       await fetchData();
      
//       // Clear cache for this booking
//       if (selectedBooking) {
//         setReceiptsFetched(prev => ({
//           ...prev,
//           [selectedBooking._id]: false
//         }));
//         setBookingReceipts(prev => ({
//           ...prev,
//           [selectedBooking._id]: []
//         }));
//       }
      
//       // Auto-print the receipt if ID is available
//       if (receiptId && selectedBooking) {
//         console.log("=== ATTEMPTING TO AUTO-PRINT ===");
//         console.log("Calling printReceiptInvoice with:", receiptId, selectedBooking._id);
        
//         // Try immediate print
//         setTimeout(() => {
//           console.log("Timeout 1 - Attempting print");
//           printReceiptInvoice(receiptId, selectedBooking._id);
//         }, 500);
        
//         // Try again after longer delay
//         setTimeout(() => {
//           console.log("Timeout 2 - Attempting print again");
//           printReceiptInvoice(receiptId, selectedBooking._id);
//         }, 2000);
//       } else {
//         console.log("=== CANNOT AUTO-PRINT ===");
//         console.log("receiptId:", receiptId);
//         console.log("selectedBooking:", selectedBooking);
        
//         // If no receipt ID but we have a response, try to fetch the latest receipt
//         if (selectedBooking && response.data.data) {
//           console.log("Attempting to fetch latest receipt for booking");
//           setTimeout(async () => {
//             try {
//               const receiptsRes = await axiosInstance.get(`/ledger/booking/${selectedBooking._id}`);
//               const receipts = receiptsRes.data.data.allReceipts || [];
//               const refundReceipts = receipts.filter(r => r.isRefund === true);
//               if (refundReceipts.length > 0) {
//                 const latestRefund = refundReceipts.sort((a, b) => 
//                   new Date(b.receiptDate) - new Date(a.receiptDate)
//                 )[0];
//                 console.log("Found latest refund receipt:", latestRefund);
//                 if (latestRefund?.id) {
//                   printReceiptInvoice(latestRefund.id, selectedBooking._id);
//                 }
//               }
//             } catch (err) {
//               console.error("Error fetching latest receipt:", err);
//             }
//           }, 3000);
//         }
//       }
      
//       setTimeout(() => setSuccessMessage(''), 3000);
      
//     } catch (err) {
//       console.error('=== REFUND ERROR ===');
//       console.error('Error details:', err);
//       console.error('Error response:', err.response?.data);
//       setFormError(err.response?.data?.error || 'Failed to process refund. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ============ PRINT FUNCTIONS ============
//   const printReceiptInvoice = async (receiptId, bookingId) => {
//     console.log("=== PRINT RECEIPT INVOICE CALLED ===");
//     console.log("receiptId:", receiptId);
//     console.log("bookingId:", bookingId);
    
//     if (!receiptId || !bookingId) {
//       console.error("Missing receiptId or bookingId");
//       return;
//     }

//     try {
//       console.log("Fetching receipt data from:", `/ledger/receipt/${receiptId}`);
//       const receiptResponse = await axiosInstance.get(`/ledger/receipt/${receiptId}`);
//       console.log("Receipt response:", receiptResponse.data);
//       const receiptData = receiptResponse.data.data.receipt;
      
//       console.log("Fetching booking data from:", `/bookings/booking-payment-status/${bookingId}`);
//       const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${bookingId}`);
//       console.log("Booking response:", bookingResponse.data);
      
//       // Extract booking details and branch data correctly
//       const bookingData = bookingResponse.data.data.bookingDetails;
//       const branchData = bookingResponse.data.data.branch; // Branch data is at the root level
      
//       const qrCodeData = receiptData.qrCodeData || {};
      
//       const qrText = `GANDHI MOTORS PVT LTD
// Booking Number: ${qrCodeData.bookingNumber || bookingData.bookingNumber}
// Customer: ${qrCodeData.customerName || bookingData.customerDetails?.name}
// Mobile: ${qrCodeData.mobileNo || bookingData.customerDetails?.mobile1}
// Model: ${qrCodeData.modelName || bookingData.model?.model_name}
// Chassis: ${qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated'}
// Refund: ${receiptData.receiptNumber || 'N/A'}
// Amount: ${receiptData.display?.amount || `₹${receiptData.amount?.toFixed(2) || '0'}`}
// Payment Mode: ${receiptData.paymentMode || 'Cash'}
// Reference: ${receiptData.transactionReference || 'N/A'}
// Date: ${new Date(receiptData.receiptDate).toLocaleDateString('en-GB')}`;

//       let qrCodeImage = '';
//       try {
//         qrCodeImage = await QRCode.toDataURL(qrText, {
//           width: 100,
//           margin: 2,
//           color: {
//             dark: '#000000',
//             light: '#FFFFFF'
//           },
//           errorCorrectionLevel: 'H'
//         });
//         console.log("QR Code generated successfully");
//       } catch (error) {
//         console.error('Error generating QR code:', error);
//         qrCodeImage = '';
//       }

//       const transformedData = {
//         bookingNumber: bookingData.bookingNumber,
//         bookingType: bookingData.bookingType,
//         hpa: bookingData.hpa,
//         gstin: branchData?.gst_number || bookingData.branch?.gst_number || '',
//         model: {
//           model_name: bookingData.model?.model_name || 'N/A'
//         },
//         chassisNumber: qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated',
//         customerDetails: {
//           name: bookingData.customerDetails?.name || 'N/A',
//           address: `${bookingData.customerDetails?.address || ''}, ${bookingData.customerDetails?.taluka || ''}`,
//           mobile1: bookingData.customerDetails?.mobile1 || '',
//         },
//         payment: {
//           type: bookingData.payment?.type || 'CASH',
//           financer: bookingData.payment?.financer
//         },
//         salesExecutive: bookingData.salesExecutive,
//         branch: {
//           gst_number: branchData?.gst_number || bookingData.branch?.gst_number || '',
//           name: branchData?.name || bookingData.branch?.name || 'GANDHI TVS' // Add branch name here
//         },
//         recentPayment: receiptData,
//         qrCodeImage: qrCodeImage,
//         recentPaymentAmount: receiptData.amount || 0,
//         // Include bookingDetails for fallback
//         bookingDetails: {
//           branch: branchData || bookingData.branch
//         }
//       };

//       console.log("Transformed data with branch:", transformedData.branch);
//       console.log("Generating HTML for receipt");
//       const invoiceHTML = generateRefundReceiptHTML(transformedData);

//       console.log("Opening new window for print");
//       const printWindow = window.open('', '_blank');
//       if (!printWindow) {
//         console.error("Popup blocked! Please allow popups for this site.");
//         alert("Popup blocked! Please allow popups to print receipts.");
//         return;
//       }
      
//       printWindow.document.write(invoiceHTML);
//       printWindow.document.close();
      
//       printWindow.onload = function() {
//         console.log("Print window loaded, focusing and printing");
//         printWindow.focus();
//         setTimeout(() => {
//           printWindow.print();
//         }, 500);
//       };
      
//     } catch (error) {
//       console.error('=== ERROR GENERATING REFUND RECEIPT ===');
//       console.error('Error details:', error);
//       console.error('Error response:', error.response?.data);
//       showError(error, 'Failed to generate refund receipt');
//     }
//   };

//   // Generate refund receipt HTML - exactly like the 2nd receipt design
//   // Generate refund receipt HTML - exactly like the 2nd receipt design
// const generateRefundReceiptHTML = (data) => {
//   const currentDate = new Date().toLocaleDateString('en-GB');
//   const receiptDate = data.recentPayment?.receiptDate 
//     ? new Date(data.recentPayment.receiptDate).toLocaleDateString('en-GB')
//     : currentDate;
  
//   const recentPaymentAmount = data.recentPaymentAmount || 0;
//   const recentPaymentAmountRef = data.recentPayment?.transactionReference || "-";
//   const recentPaymentAmountInWords = numberToWords(recentPaymentAmount);
//   const recentPaymentAmountType = data.recentPayment?.paymentMode || "-";
//   const receiptNumber = data.recentPayment?.receiptNumber || "-";
//   const refundReason = data.recentPayment?.refundReason || data.recentPayment?.paymentDetails?.refundDetails?.reason || 'N/A';

//   const qrCodeImage = data.qrCodeImage || '';
  
//   // Get branch name dynamically from the data
//   const branchName = data.branch?.name || data.bookingDetails?.branch?.name || 'GANDHI TVS';

//   return `<!DOCTYPE html>
// <html>
// <head>
//   <title>Refund Receipt - ${receiptNumber}</title>
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
//       height: 138mm;
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
//     .refund-badge {
//       color: #d32f2f;
//       font-weight: bold;
//       font-size: 12px;
//       margin-left: 5px;
//     }
//     .amount-in-words {
//       font-style: italic;
//       margin-top: 5px;
//       color: #333;
//       padding: 5px;
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
//     <!-- FIRST COPY (TOP) -->
//     <div class="receipt-copy">
//       <div class="header-container">
//         <div class="header-left">
//           <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
//           <div class="dealer-info">
//             Authorized Main Dealer: TVS Motor Company Ltd.<br>
//             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//             Upnagar, Nashik Road, Nashik, 7498993672<br>
//             GSTIN: ${data.branch?.gst_number || ''}<br>
//             ${branchName}
//           </div>
//         </div>
//         <div class="header-right">
//           <div class="logo-qr-container">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             ${
//               qrCodeImage 
//                 ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
//                 : ''
//             }
//           </div>
          
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Refund No:</strong> ${receiptNumber}</div>
//         </div>
//       </div>
//       <div class="divider"></div>

//       <div class="receipt-info">
//         <div><strong>Refund Receipt <span class="refund-badge">(REFUND)</span></strong></div>
//         <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>

//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}</div>
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

//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div><strong>Refund Amount:</strong> ₹${recentPaymentAmount.toFixed(2)}</div>
//           <div><strong>Refund Number:</strong> ${receiptNumber}</div>
//           <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//           <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//           <div><strong>Refund Date:</strong> ${receiptDate}</div>
//           <div><strong>Refund Reason:</strong> ${refundReason}</div>
//         </div>
//         <div class="amount-in-words">
//           <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
//         </div>
//       </div>

//       <div class="note"><strong>Notes: This is a refund transaction against booking ${data.bookingNumber}</strong></div>
//       <div class="divider"></div>

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

//     <!-- CUTTING LINE -->
//     <div class="cutting-line"></div>

//     <!-- DUPLICATE COPY (BOTTOM) -->
//     <div class="receipt-copy">
//       <div class="header-container">
//         <div class="header-left">
//           <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
//           <div class="dealer-info">
//             Authorized Main Dealer: TVS Motor Company Ltd.<br>
//             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//             Upnagar, Nashik Road, Nashik, 7498993672<br>
//             GSTIN: ${data.branch?.gst_number || ''}<br>
//             ${branchName}
//           </div>
//         </div>
//         <div class="header-right">
//           <div class="logo-qr-container">
//             <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
//             ${
//               qrCodeImage 
//                 ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
//                 : ''
//             }
//           </div>
          
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Refund No:</strong> ${receiptNumber}</div>
//         </div>
//       </div>
//       <div class="divider"></div>

//       <div class="receipt-info">
//         <div><strong>Refund Receipt <span class="refund-badge">(REFUND)</span></strong></div>
//         <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//         <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//       </div>

//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
//           <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}</div>
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

//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div><strong>Refund Amount:</strong> ₹${recentPaymentAmount.toFixed(2)}</div>
//           <div><strong>Refund Number:</strong> ${receiptNumber}</div>
//           <div><strong>Reference No:</strong> ${recentPaymentAmountRef}</div>
//           <div><strong>Payment Mode:</strong> ${recentPaymentAmountType}</div>
//           <div><strong>Refund Date:</strong> ${receiptDate}</div>
//           <div><strong>Refund Reason:</strong> ${refundReason}</div>
//         </div>
//         <div class="amount-in-words">
//           <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
//         </div>
//       </div>

//       <div class="note"><strong>Notes: This is a refund transaction against booking ${data.bookingNumber}</strong></div>
//       <div class="divider"></div>

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
// </html>`;
// };

//   // ============ RENDER PAYMENT SPECIFIC FIELDS ============
//   const renderPaymentSpecificFields = () => {
//     switch (formData.modeOfPayment) {
//       case 'Cash':
//         return (
//           <CCol md={6}>
//             <label className="form-label">Cash Location <span className="text-danger">*</span></label>
//             <CFormSelect 
//               name="cashLocation" 
//               value={formData.cashLocation} 
//               onChange={handleChange} 
//               required 
//               disabled={isSubmitting}
//             >
//               <option value="">Select Cash Location</option>
//               {cashLocations.map((location) => (
//                 <option key={location.id} value={location.id}>
//                   {location.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </CCol>
//         );
//       case 'Bank':
//         return (
//           <>
//             <CCol md={6}>
//               <label className="form-label">Payment Sub Mode <span className="text-danger">*</span></label>
//               <CFormSelect 
//                 name="subPaymentMode" 
//                 value={formData.subPaymentMode} 
//                 onChange={handleChange} 
//                 required 
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select Payment Sub Mode</option>
//                 {paymentSubModes.map((subMode) => (
//                   <option key={subMode.id} value={subMode.id}>
//                     {subMode.payment_mode}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Bank Location <span className="text-danger">*</span></label>
//               <CFormSelect 
//                 name="bank" 
//                 value={formData.bank} 
//                 onChange={handleChange} 
//                 required 
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select Bank Location</option>
//                 {bankLocations.map((location) => (
//                   <option key={location.id} value={location.id}>
//                     {location.name}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   // ============ RENDER TABLE ============
//   const renderTable = () => {
//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                 <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                 <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                 <CTableHeaderCell>Total</CTableHeaderCell>
//                 <CTableHeaderCell>Received</CTableHeaderCell>
//                 <CTableHeaderCell>Balance</CTableHeaderCell>
//                 <CTableHeaderCell>Refund Receipts</CTableHeaderCell>
//                 {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredBookings.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
//                     No booking details available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 filteredBookings.map((booking, index) => {
//                   const receipts = bookingReceipts[booking._id] || [];
                  
//                   // Filter receipts to show ONLY those with isRefund: true
//                   const refundReceipts = receipts.filter(receipt => receipt.isRefund === true);
                  
//                   const sortedRefundReceipts = [...refundReceipts].sort((a, b) => {
//                     const dateA = new Date(a.receiptDate || a.createdAt || 0);
//                     const dateB = new Date(b.receiptDate || b.createdAt || 0);
//                     return dateB - dateA; // Newest first
//                   });
                  
//                   return (
//                     <CTableRow key={booking._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                           ? (booking.chassisNumber || 'N/A')
//                           : 'N/A'
//                         }
//                       </CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         {loadingReceipts[booking._id] ? (
//                           <CSpinner size="sm" color="info" />
//                         ) : sortedRefundReceipts.length > 0 ? (
//                           <CDropdown>
//                             <CDropdownToggle size="sm" color="info" variant="outline">
//                               {sortedRefundReceipts.length} Refund Receipt{sortedRefundReceipts.length > 1 ? 's' : ''}
//                             </CDropdownToggle>
//                             <CDropdownMenu>
//                               {sortedRefundReceipts.map((receipt, receiptIndex) => (
//                                 <CDropdownItem 
//                                   key={receipt.id} 
//                                   onClick={() => printReceiptInvoice(receipt.id, booking._id)}
//                                 >
//                                   <div className="d-flex align-items-center">
//                                     <CIcon icon={cilPrint} className="me-2" />
//                                     <div>
//                                       <div><strong>Refund Receipt #{receiptIndex + 1}</strong></div>
//                                       <small>
//                                         {receipt.display?.amount || `₹${receipt.amount}`} - 
//                                         {receipt.display?.date || new Date(receipt.receiptDate).toLocaleDateString('en-GB')}
//                                       </small>
//                                     </div>
//                                   </div>
//                                 </CDropdownItem>
//                               ))}
//                             </CDropdownMenu>
//                           </CDropdown>
//                         ) : receiptsFetched[booking._id] ? (
//                           <span className="text-muted">No refund receipts</span>
//                         ) : (
//                           <CButton
//                             size="sm"
//                             color="light"
//                             onClick={() => fetchReceiptsForBooking(booking._id)}
//                             disabled={loadingReceipts[booking._id]}
//                           >
//                             <CIcon icon={cilCloudDownload} className="me-1" />
//                             Load Receipts
//                           </CButton>
//                         )}
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             className="action-btn"
//                             onClick={() => handleAddClick(booking)}
//                             disabled={!canCreateRefund}
//                           >
//                             Add Refund
//                           </CButton>
//                           {/* <CButton
//                             size="sm"
//                             color="warning"
//                             className="action-btn ms-2"
//                             onClick={testPrint}
//                           >
//                             Test Print
//                           </CButton> */}
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 })
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//       </>
//     );
//   };

//   if (!canViewRefund) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Refunds.
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
//       <div className='title'>Customer Refund</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div className="d-flex align-items-center">
//             <span className="me-3">Refund Management</span>
//             {/* <CButton
//               size="sm"
//               color="info"
//               onClick={testPrint}
//             >
//               Test Print Popup
//             </CButton> */}
//           </div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewRefund}
//               style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {renderTable()}
//         </CCardBody>
//       </CCard>

//       {/* Refund Modal - Integrated directly */}
//       <CBackdrop visible={showModal} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
//       <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg" alignment="center">
//         <CModalHeader>
//           <CModalTitle>Process Refund</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {formError && <CAlert color="danger">{formError}</CAlert>}
//           <CRow className="mb-3">
//             <CCol md={6}>
//               <label className="form-label">Customer Name</label>
//               <CFormInput 
//                 type="text" 
//                 value={selectedBooking?.customerDetails?.name || ''} 
//                 readOnly 
//                 className="bg-light" 
//               />
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Chassis Number</label>
//               <CFormInput 
//                 type="text" 
//                 value={selectedBooking?.chassisNumber || ''} 
//                 readOnly 
//                 className="bg-light" 
//               />
//             </CCol>
//           </CRow>

//           <CForm onSubmit={handleSubmit}>
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <label className="form-label">Refund Amount (₹) <span className="text-danger">*</span></label>
//                 <CFormInput
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   required
//                   min="0"
//                   step="0.01"
//                   disabled={isSubmitting}
//                   placeholder="Enter refund amount"
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <label className="form-label">Mode of Payment <span className="text-danger">*</span></label>
//                 <CFormSelect 
//                   name="modeOfPayment" 
//                   value={formData.modeOfPayment} 
//                   onChange={handleChange} 
//                   required 
//                   disabled={isSubmitting}
//                 >
//                   <option value="">--Select--</option>
//                   <option value="Cash">Cash</option>
//                   <option value="Bank">Bank</option>
//                 </CFormSelect>
//               </CCol>
//             </CRow>

//             <CRow className="mb-3">{renderPaymentSpecificFields()}</CRow>
            
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <label className="form-label">Refund Reason <span className="text-danger">*</span></label>
//                 <CFormInput 
//                   type="text" 
//                   name="refundReason" 
//                   value={formData.refundReason} 
//                   onChange={handleChange} 
//                   required
//                   placeholder="Enter reason for refund"
//                   disabled={isSubmitting}
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <label className="form-label">Reference Number</label>
//                 <CFormInput 
//                   type="text" 
//                   name="transactionReference" 
//                   value={formData.transactionReference} 
//                   onChange={handleChange} 
//                   placeholder="Optional reference number"
//                   disabled={isSubmitting}
//                 />
//               </CCol>
//             </CRow>
            
//             <CRow>
//               <CCol md={6}>
//                 <label className="form-label">Remark</label>
//                 <CFormInput 
//                   type="text" 
//                   name="remark" 
//                   value={formData.remark} 
//                   onChange={handleChange} 
//                   placeholder="Enter any remarks..."
//                   disabled={isSubmitting}
//                 />
//               </CCol>
//             </CRow>
//           </CForm>
//         </CModalBody>
//         <CModalFooter className="d-flex justify-content-between">
//           <div>
//             <CButton 
//               color="primary" 
//               onClick={handleSubmit} 
//               className="me-2" 
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Processing...' : 'Process Refund'}
//             </CButton>
//           </div>
//           <CButton 
//             color="secondary" 
//             onClick={() => setShowModal(false)} 
//             disabled={isSubmitting}
//           >
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default Refund;









import '../../css/table.css';
import '../../css/receipt.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CRow,
  CCol,
  CBackdrop
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPrint, cilCloudDownload } from '@coreui/icons';
import QRCode from 'qrcode';
import tvsLogo from '../../assets/images/logo.png';
import config from '../../config';
import { numberToWords } from '../../utils/numberToWords';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Import utility functions directly
import { getDefaultSearchFields, showError } from '../../utils/tableImports';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: config.baseURL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Custom hook for table filtering
const useTableFilter = (initialData) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  const handleFilter = (searchTerm, searchFields) => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          if (key.match(/^\d+$/)) return obj[parseInt(key)];
          return obj[key];
        }, row);

        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
    setFilteredData(filtered);
  };

  return { data, setData, filteredData, setFilteredData, handleFilter };
};

// Import permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage
} from '../../utils/modulePermissions';

const Refund = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // ============ REFUND MODAL STATES ============
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: '',
    modeOfPayment: '',
    amount: '',
    remark: '',
    cashLocation: '',
    bank: '',
    subPaymentMode: '',
    transactionReference: '',
    refundReason: ''
  });
  const [cashLocations, setCashLocations] = useState([]);
  const [bankLocations, setBankLocations] = useState([]);
  const [paymentSubModes, setPaymentSubModes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // ============ ON-DEMAND RECEIPTS FETCHING ============
  const [bookingReceipts, setBookingReceipts] = useState({});
  const [loadingReceipts, setLoadingReceipts] = useState({});
  const [receiptsFetched, setReceiptsFetched] = useState({});

  const { permissions } = useAuth();

  // Page-level permission checks
  const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
  const showActionColumn = canCreateRefund;

  // ============ FILTER FUNCTIONS ============
  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data;

    const searchFields = ['bookingNumber', 'customerDetails.name', 'model.model_name', 'chassisNumber'];
    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          return obj[key];
        }, row);

        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  };

  // ============ DERIVED DATA ============
  const filteredBookings = useMemo(() => 
    filterData(data, searchTerm), 
    [data, searchTerm]
  );

  // ============ EFFECTS ============
  useEffect(() => {
    if (!canViewRefund) {
      return;
    }
    fetchData();
  }, [canViewRefund]);

  // Fetch receipts for visible bookings
  useEffect(() => {
    if (filteredBookings.length > 0) {
      filteredBookings.forEach(booking => {
        if (!receiptsFetched[booking._id] && !loadingReceipts[booking._id]) {
          fetchReceiptsForBooking(booking._id);
        }
      });
    }
  }, [filteredBookings, receiptsFetched, loadingReceipts]);

  // ============ FETCH FUNCTIONS ============
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings`);

      const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
      setData(branchBookings);
      setFilteredData(branchBookings);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiptsForBooking = async (bookingId) => {
    if (receiptsFetched[bookingId] || loadingReceipts[bookingId]) {
      return;
    }

    try {
      setLoadingReceipts(prev => ({ ...prev, [bookingId]: true }));
      
      const receiptsResponse = await axiosInstance.get(`/ledger/booking/${bookingId}`);
      const receipts = receiptsResponse.data.data.allReceipts || [];
      
      setBookingReceipts(prev => ({
        ...prev,
        [bookingId]: receipts
      }));
      
      setReceiptsFetched(prev => ({
        ...prev,
        [bookingId]: true
      }));
    } catch (error) {
      console.error(`Error fetching receipts for booking ${bookingId}:`, error);
      setBookingReceipts(prev => ({
        ...prev,
        [bookingId]: []
      }));
      setReceiptsFetched(prev => ({
        ...prev,
        [bookingId]: true
      }));
    } finally {
      setLoadingReceipts(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const fetchCashLocations = async () => {
    try {
      const response = await axiosInstance.get('/cash-locations');
      setCashLocations(response.data.data.cashLocations || []);
    } catch (error) {
      console.error('Error fetching cash locations:', error);
      setCashLocations([]);
    }
  };

  const fetchBankLocations = async () => {
    try {
      const response = await axiosInstance.get('/banks');
      setBankLocations(response.data.data.banks || []);
    } catch (error) {
      console.error('Error fetching bank locations:', error);
      setBankLocations([]);
    }
  };

  const fetchPaymentSubModes = async () => {
    try {
      const response = await axiosInstance.get('/banksubpaymentmodes');
      setPaymentSubModes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payment sub-modes:', error);
      setPaymentSubModes([]);
    }
  };

  // ============ HANDLERS ============
  const handleAddClick = (booking) => {
    if (!canCreateRefund) {
      showError('You do not have permission to process refunds');
      return;
    }
    
    setSelectedBooking(booking);
    setFormData({
      bookingId: booking._id,
      modeOfPayment: '',
      amount: '',
      remark: '',
      cashLocation: '',
      bank: '',
      subPaymentMode: '',
      transactionReference: '',
      refundReason: ''
    });
    setFormError(null);
    
    // Fetch dropdown data
    fetchCashLocations();
    fetchBankLocations();
    fetchPaymentSubModes();
    
    setShowModal(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // TEST FUNCTION - Direct print test
  const testPrint = () => {
    console.log("=== TEST PRINT FUNCTION CALLED ===");
    const testWindow = window.open('', '_blank');
    testWindow.document.write('<html><head><title>Test Print</title></head><body><h1>Test Print - If you see this, printing works!</h1></body></html>');
    testWindow.document.close();
    testWindow.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    console.log("=== SUBMITTING REFUND ===");
    console.log("Form data:", formData);
    console.log("Selected booking:", selectedBooking);

    try {
      let paymentData = {
        bookingId: formData.bookingId,
        paymentMode: formData.modeOfPayment,
        amount: parseFloat(formData.amount),
        remark: formData.remark,
        transactionReference: formData.transactionReference,
        refundReason: formData.refundReason
      };

      switch (formData.modeOfPayment) {
        case 'Cash':
          paymentData.cashLocation = formData.cashLocation;
          break;
        case 'Bank':
          paymentData.bank = formData.bank;
          paymentData.subPaymentMode = formData.subPaymentMode;
          break;
        default:
          break;
      }

      console.log("Sending payment data:", paymentData);
      const response = await axiosInstance.post('/ledger/refund', paymentData);
      
      console.log("=== REFUND RESPONSE ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      
      // Try multiple ways to extract receipt ID
      let receiptId = null;
      let receiptData = null;
      
      // Method 1: Check direct receipt object
      if (response.data.data?.receipt?._id) {
        receiptId = response.data.data.receipt._id;
        receiptData = response.data.data.receipt;
        console.log("Method 1 - Found receipt._id:", receiptId);
      }
      // Method 2: Check refund object
      else if (response.data.data?.refund?._id) {
        receiptId = response.data.data.refund._id;
        receiptData = response.data.data.refund;
        console.log("Method 2 - Found refund._id:", receiptId);
      }
      // Method 3: Check data._id
      else if (response.data.data?._id) {
        receiptId = response.data.data._id;
        receiptData = response.data.data;
        console.log("Method 3 - Found data._id:", receiptId);
      }
      // Method 4: Check allReceipts array
      else if (response.data.data?.allReceipts?.length > 0) {
        const receipts = response.data.data.allReceipts;
        console.log("Method 4 - Found allReceipts:", receipts);
        // Get the most recent receipt
        const latestReceipt = receipts.sort((a, b) => 
          new Date(b.receiptDate || b.createdAt) - new Date(a.receiptDate || a.createdAt)
        )[0];
        receiptId = latestReceipt?.id || latestReceipt?._id;
        receiptData = latestReceipt;
        console.log("Method 4 - Latest receipt:", latestReceipt);
      }

      console.log("=== EXTRACTED RECEIPT ID ===");
      console.log("Receipt ID:", receiptId);
      console.log("Receipt Data:", receiptData);

      setSuccessMessage('Refund successfully recorded!');

      // Close modal
      setShowModal(false);
      
      // Refresh data
      await fetchData();
      
      // Clear cache for this booking
      if (selectedBooking) {
        setReceiptsFetched(prev => ({
          ...prev,
          [selectedBooking._id]: false
        }));
        setBookingReceipts(prev => ({
          ...prev,
          [selectedBooking._id]: []
        }));
      }
      
      // Auto-print the receipt if ID is available
      if (receiptId && selectedBooking) {
        console.log("=== ATTEMPTING TO AUTO-PRINT ===");
        console.log("Calling printReceiptInvoice with:", receiptId, selectedBooking._id);
        
        // Try immediate print
        setTimeout(() => {
          console.log("Timeout 1 - Attempting print");
          printReceiptInvoice(receiptId, selectedBooking._id);
        }, 500);
        
        // Try again after longer delay
        setTimeout(() => {
          console.log("Timeout 2 - Attempting print again");
          printReceiptInvoice(receiptId, selectedBooking._id);
        }, 2000);
      } else {
        console.log("=== CANNOT AUTO-PRINT ===");
        console.log("receiptId:", receiptId);
        console.log("selectedBooking:", selectedBooking);
        
        // If no receipt ID but we have a response, try to fetch the latest receipt
        if (selectedBooking && response.data.data) {
          console.log("Attempting to fetch latest receipt for booking");
          setTimeout(async () => {
            try {
              const receiptsRes = await axiosInstance.get(`/ledger/booking/${selectedBooking._id}`);
              const receipts = receiptsRes.data.data.allReceipts || [];
              const refundReceipts = receipts.filter(r => r.isRefund === true);
              if (refundReceipts.length > 0) {
                const latestRefund = refundReceipts.sort((a, b) => 
                  new Date(b.receiptDate) - new Date(a.receiptDate)
                )[0];
                console.log("Found latest refund receipt:", latestRefund);
                if (latestRefund?.id) {
                  printReceiptInvoice(latestRefund.id, selectedBooking._id);
                }
              }
            } catch (err) {
              console.error("Error fetching latest receipt:", err);
            }
          }, 3000);
        }
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('=== REFUND ERROR ===');
      console.error('Error details:', err);
      console.error('Error response:', err.response?.data);
      setFormError(err.response?.data?.error || 'Failed to process refund. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ PRINT FUNCTIONS ============
  const printReceiptInvoice = async (receiptId, bookingId) => {
    console.log("=== PRINT RECEIPT INVOICE CALLED ===");
    console.log("receiptId:", receiptId);
    console.log("bookingId:", bookingId);
    
    if (!receiptId || !bookingId) {
      console.error("Missing receiptId or bookingId");
      return;
    }

    try {
      console.log("Fetching receipt data from:", `/ledger/receipt/${receiptId}`);
      const receiptResponse = await axiosInstance.get(`/ledger/receipt/${receiptId}`);
      console.log("Receipt response:", receiptResponse.data);
      const receiptData = receiptResponse.data.data.receipt;
      
      console.log("Fetching booking data from:", `/bookings/booking-payment-status/${bookingId}`);
      const bookingResponse = await axiosInstance.get(`/bookings/booking-payment-status/${bookingId}`);
      console.log("Booking response:", bookingResponse.data);
      
      // Extract booking details and branch data correctly
      const bookingData = bookingResponse.data.data.bookingDetails;
      const branchData = bookingResponse.data.data.branch; // Branch data is at the root level
      
      const qrCodeData = receiptData.qrCodeData || {};
      
      const qrText = `GANDHI MOTORS PVT LTD
Booking Number: ${qrCodeData.bookingNumber || bookingData.bookingNumber}
Customer: ${qrCodeData.customerName || bookingData.customerDetails?.name}
Mobile: ${qrCodeData.mobileNo || bookingData.customerDetails?.mobile1}
Model: ${qrCodeData.modelName || bookingData.model?.model_name}
Chassis: ${qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated'}
Refund: ${receiptData.receiptNumber || 'N/A'}
Amount: ${receiptData.display?.amount || `₹${receiptData.amount?.toFixed(2) || '0'}`}
Payment Mode: ${receiptData.paymentMode || 'Cash'}
Reference: ${receiptData.transactionReference || 'N/A'}
Date: ${new Date(receiptData.receiptDate).toLocaleDateString('en-GB')}`;

      let qrCodeImage = '';
      try {
        qrCodeImage = await QRCode.toDataURL(qrText, {
          width: 100,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
        console.log("QR Code generated successfully");
      } catch (error) {
        console.error('Error generating QR code:', error);
        qrCodeImage = '';
      }

      const transformedData = {
        bookingNumber: bookingData.bookingNumber,
        bookingType: bookingData.bookingType,
        hpa: bookingData.hpa,
        gstin: branchData?.gst_number || bookingData.branch?.gst_number || '',
        model: {
          model_name: bookingData.model?.model_name || 'N/A'
        },
        chassisNumber: qrCodeData.chassisNo || bookingData.chassisNumber || 'Not allocated',
        customerDetails: {
          name: bookingData.customerDetails?.name || 'N/A',
          address: `${bookingData.customerDetails?.address || ''}, ${bookingData.customerDetails?.taluka || ''}`,
          mobile1: bookingData.customerDetails?.mobile1 || '',
        },
        payment: {
          type: bookingData.payment?.type || 'CASH',
          financer: bookingData.payment?.financer
        },
        salesExecutive: bookingData.salesExecutive,
        branch: {
          gst_number: branchData?.gst_number || bookingData.branch?.gst_number || '',
          name: branchData?.name || bookingData.branch?.name || 'GANDHI TVS' // Add branch name here
        },
        recentPayment: receiptData,
        qrCodeImage: qrCodeImage,
        recentPaymentAmount: receiptData.amount || 0,
        // Include bookingDetails for fallback
        bookingDetails: {
          branch: branchData || bookingData.branch
        }
      };

      console.log("Transformed data with branch:", transformedData.branch);
      console.log("Generating HTML for receipt");
      const invoiceHTML = generateRefundReceiptHTML(transformedData);

      console.log("Opening new window for print");
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error("Popup blocked! Please allow popups for this site.");
        alert("Popup blocked! Please allow popups to print receipts.");
        return;
      }
      
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        console.log("Print window loaded, focusing and printing");
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
    } catch (error) {
      console.error('=== ERROR GENERATING REFUND RECEIPT ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data);
      showError(error, 'Failed to generate refund receipt');
    }
  };

// Generate refund receipt HTML - exactly like the 2nd receipt design
// Generate refund receipt HTML - exactly like the 2nd receipt design
const generateRefundReceiptHTML = (data) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const receiptDate = data.recentPayment?.receiptDate 
    ? new Date(data.recentPayment.receiptDate).toLocaleDateString('en-GB')
    : currentDate;
  
  const recentPaymentAmount = data.recentPaymentAmount || 0;
  const recentPaymentAmountRef = data.recentPayment?.transactionReference || "-";
  const recentPaymentAmountInWords = numberToWords(recentPaymentAmount);
  const recentPaymentAmountType = data.recentPayment?.paymentMode || "-";
  const receiptNumber = data.recentPayment?.receiptNumber || "-";
  const refundReason = data.recentPayment?.refundReason || data.recentPayment?.paymentDetails?.refundDetails?.reason || 'N/A';

  const qrCodeImage = data.qrCodeImage || '';
  
  // Get branch name dynamically from the data
  const branchName = data.branch?.name || data.bookingDetails?.branch?.name || 'GANDHI TVS';

  return `<!DOCTYPE html>
<html>
<head>
  <title>Refund Receipt - ${receiptNumber}</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 8mm;
      font-size: 15px;  /* Increased by 1px from 14px */
      color: #555555;
    }
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
    }
    .receipt-copy {
      height: 138mm;
      page-break-inside: avoid;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1mm;
      align-items: flex-start;
      font-size: 14px;  /* Increased by 1px from 13px */
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
      gap: 8px;
      justify-content: flex-end;
      margin-bottom: 3px;
      width: 100%;
    }
    .logo {
      height: 61px;  /* Increased by 1px from 60px */
    }
    .qr-code-small {
      width: 91px;  /* Increased by 1px from 90px */
      height: 91px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 13px;  /* Increased by 1px from 12px */
      line-height: 1.2;
    }
    .customer-info-container {
      display: flex;
      font-size: 14px;  /* Increased by 1px from 13px */
      margin: 1mm 0;
    }
    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 0.5mm 0;
      line-height: 1.2;
    }
    /* Style for labels (keys) */
    .customer-info-row strong {
      font-weight: 600;
      margin-right: 4px;
    }
    /* Style for values - ONLY font weight increased, color unchanged */
    .customer-info-row .value {
      font-weight: 700;  /* Bold/thick values only */
    }
    .divider {
      border-top: 1px solid #AAAAAA;
      margin: 2mm 0;
    }
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 5px;  /* Increased by 1px from 4px */
      margin: 5px 0;  /* Increased by 1px from 4px */
      font-size: 14px;  /* Increased by 1px from 13px */
    }
    .receipt-info-row {
      margin: 2px 0;  /* Increased by 1px from 1px */
    }
    .receipt-info-row strong {
      font-weight: 600;
      margin-right: 4px;
    }
    .receipt-info-row .value {
      font-weight: 700;  /* Bold/thick values only */
    }
    .payment-info-box {
      margin: 4px 0;  /* Increased by 1px from 3px */
    }
    .signature-box {
      margin-top: 4mm;  /* Increased by 1mm from 3mm */
      font-size: 13px;  /* Increased by 1px from 12px */
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 33mm;  /* Increased by 1mm from 32mm */
      display: inline-block;
      margin: 0 2mm;
    }
    .cutting-line {
      border-top: 2px dashed #333;
      margin: 6mm 0;  /* Increased by 1mm from 5mm */
      text-align: center;
      position: relative;
    }
    .cutting-line::before {
      content: "✂ Cut Here ✂";
      position: absolute;
      top: -9px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0 8px;
      font-size: 11px;  /* Increased by 1px from 10px */
      color: #666;
    }
    .note{
      padding: 2px;  /* Increased by 1px from 1px */
      margin: 3px 0;  /* Increased by 1px from 2px */
      font-size: 13px;  /* Increased by 1px from 12px */
    }
    .note .value {
      font-weight: 700;  /* Bold/thick values only */
    }
    .refund-badge {
      color: #d32f2f;
      font-weight: bold;
      font-size: 13px;  /* Increased by 1px from 12px */
      margin-left: 4px;
    }
    .amount-in-words {
      font-style: italic;
      margin-top: 4px;  /* Increased by 1px from 3px */
      color: #333;
      padding: 4px;  /* Increased by 1px from 3px */
      font-size: 13px;  /* Increased by 1px from 12px */
      background-color: #f0f0f0;
      border-radius: 4px;
    }
    .amount-in-words .value {
      font-weight: 700;  /* Bold/thick values only */
      font-style: normal;
    }
    /* 2-column grid for payment info */
    .payment-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 10px;  /* Increased row gap by 1px from 2px */
      padding: 3px;  /* Increased by 1px from 2px */
      font-size: 14px;  /* Increased by 1px from 13px */
    }
    .payment-grid-item {
      padding: 2px 0;  /* Increased by 1px from 1px */
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .payment-grid-item strong {
      font-weight: 600;
      margin-right: 4px;
      min-width: 101px;  /* Increased by 1px from 100px */
      display: inline-block;
    }
    .payment-grid-item .value {
      font-weight: 700;  /* Bold/thick values only */
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
    <!-- FIRST COPY (TOP) -->
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <h2 style="margin:0 0 1px 0;font-size:17px;">GANDHI MOTORS PVT LTD</h2>  <!-- Increased by 1px from 16px -->
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${data.branch?.gst_number || ''}<br>
            ${branchName}
          </div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            ${
              qrCodeImage 
                ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
                : ''
            }
          </div>
          
          <div style="margin-top: 2px; font-size: 13px;">Date: ${receiptDate}</div>
          <div style="margin-top: 2px; font-size: 14px;"><strong>Refund No:</strong> ${receiptNumber}</div>
        </div>
      </div>
      <div class="divider"></div>

      <div class="receipt-info" style="padding: 5px;">
        <div style="font-size: 15px; margin-bottom: 3px;"><strong>Refund Receipt <span class="refund-badge">(REFUND)</span></strong></div>
        <div class="receipt-info-row"><strong>Booking Number:</strong> <span class="value">${data.bookingNumber}</span></div>
        <div class="receipt-info-row"><strong>Receipt Date:</strong> <span class="value">${receiptDate}</span></div>
      </div>

      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Booking Number:</strong> <span class="value">${data.bookingNumber}</span></div>
          <div class="customer-info-row"><strong>Customer Name:</strong> <span class="value">${data.customerDetails.name}</span></div>
          <div class="customer-info-row"><strong>Address:</strong> <span class="value">${data.customerDetails.address}</span></div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> <span class="value">${data.customerDetails.mobile1}</span></div>
          <div class="customer-info-row"><strong>HPA:</strong> <span class="value">${data.hpa ? 'YES' : 'NO'}</span></div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Model Name:</strong> <span class="value">${data.model.model_name}</span></div>
          <div class="customer-info-row"><strong>Chassis No:</strong> <span class="value">${data.chassisNumber}</span></div>
          <div class="customer-info-row"><strong>Payment Type:</strong> <span class="value">${data.payment?.type || 'CASH'}</span></div>
          <div class="customer-info-row"><strong>Financer:</strong> <span class="value">${data.payment?.financer?.name || ''}</span></div>
          <div class="customer-info-row"><strong>Sales Executive:</strong> <span class="value">${data.salesExecutive?.name || 'N/A'}</span></div>
        </div>
      </div>

      <div class="payment-info-box">
        <div class="receipt-info" style="padding: 4px;">
          <!-- Payment Information Grid - 2 columns (3 rows) -->
          <div class="payment-grid-2col">
            <div class="payment-grid-item"><strong>Refund Amount:</strong> <span class="value">₹${recentPaymentAmount.toFixed(2)}</span></div>
            <div class="payment-grid-item"><strong>Payment Mode:</strong> <span class="value">${recentPaymentAmountType}</span></div>
            
            <div class="payment-grid-item"><strong>Refund Number:</strong> <span class="value">${receiptNumber}</span></div>
            <div class="payment-grid-item"><strong>Refund Date:</strong> <span class="value">${receiptDate}</span></div>
            
            <div class="payment-grid-item"><strong>Reference No:</strong> <span class="value">${recentPaymentAmountRef}</span></div>
            <div class="payment-grid-item"><strong>Refund Reason:</strong> <span class="value">${refundReason}</span></div>
          </div>
        </div>
        <div class="amount-in-words">
          <strong>(In Words):</strong> <span class="value">${recentPaymentAmountInWords} Only</span>
        </div>
      </div>

      <div class="note"><strong>Notes:</strong> <span class="value">This is a refund transaction against booking ${data.bookingNumber}</span></div>
      <div class="divider"></div>

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

    <!-- CUTTING LINE -->
    <div class="cutting-line"></div>

    <!-- DUPLICATE COPY (BOTTOM) -->
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <h2 style="margin:0 0 1px 0;font-size:17px;">GANDHI MOTORS PVT LTD</h2>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${data.branch?.gst_number || ''}<br>
            ${branchName}
          </div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            ${
              qrCodeImage 
                ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />`
                : ''
            }
          </div>
          
          <div style="margin-top: 2px; font-size: 13px;">Date: ${receiptDate}</div>
          <div style="margin-top: 2px; font-size: 14px;"><strong>Refund No:</strong> ${receiptNumber}</div>
        </div>
      </div>
      <div class="divider"></div>

      <div class="receipt-info" style="padding: 5px;">
        <div style="font-size: 15px; margin-bottom: 3px;"><strong>Refund Receipt <span class="refund-badge">(REFUND)</span></strong></div>
        <div class="receipt-info-row"><strong>Booking Number:</strong> <span class="value">${data.bookingNumber}</span></div>
        <div class="receipt-info-row"><strong>Receipt Date:</strong> <span class="value">${receiptDate}</span></div>
      </div>

      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Booking Number:</strong> <span class="value">${data.bookingNumber}</span></div>
          <div class="customer-info-row"><strong>Customer Name:</strong> <span class="value">${data.customerDetails.name}</span></div>
          <div class="customer-info-row"><strong>Address:</strong> <span class="value">${data.customerDetails.address}</span></div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> <span class="value">${data.customerDetails.mobile1}</span></div>
          <div class="customer-info-row"><strong>HPA:</strong> <span class="value">${data.hpa ? 'YES' : 'NO'}</span></div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Model Name:</strong> <span class="value">${data.model.model_name}</span></div>
          <div class="customer-info-row"><strong>Chassis No:</strong> <span class="value">${data.chassisNumber}</span></div>
          <div class="customer-info-row"><strong>Payment Type:</strong> <span class="value">${data.payment?.type || 'CASH'}</span></div>
          <div class="customer-info-row"><strong>Financer:</strong> <span class="value">${data.payment?.financer?.name || ''}</span></div>
          <div class="customer-info-row"><strong>Sales Executive:</strong> <span class="value">${data.salesExecutive?.name || 'N/A'}</span></div>
        </div>
      </div>

      <div class="payment-info-box">
        <div class="receipt-info" style="padding: 4px;">
          <!-- Payment Information Grid - 2 columns (3 rows) -->
          <div class="payment-grid-2col">
            <div class="payment-grid-item"><strong>Refund Amount:</strong> <span class="value">₹${recentPaymentAmount.toFixed(2)}</span></div>
            <div class="payment-grid-item"><strong>Payment Mode:</strong> <span class="value">${recentPaymentAmountType}</span></div>
            
            <div class="payment-grid-item"><strong>Refund Number:</strong> <span class="value">${receiptNumber}</span></div>
            <div class="payment-grid-item"><strong>Refund Date:</strong> <span class="value">${receiptDate}</span></div>
            
            <div class="payment-grid-item"><strong>Reference No:</strong> <span class="value">${recentPaymentAmountRef}</span></div>
            <div class="payment-grid-item"><strong>Refund Reason:</strong> <span class="value">${refundReason}</span></div>
          </div>
        </div>
        <div class="amount-in-words">
          <strong>(In Words):</strong> <span class="value">${recentPaymentAmountInWords} Only</span>
        </div>
      </div>

      <div class="note"><strong>Notes:</strong> <span class="value">This is a refund transaction against booking ${data.bookingNumber}</span></div>
      <div class="divider"></div>

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
</html>`;
};

  // ============ RENDER PAYMENT SPECIFIC FIELDS ============
  const renderPaymentSpecificFields = () => {
    switch (formData.modeOfPayment) {
      case 'Cash':
        return (
          <CCol md={6}>
            <label className="form-label">Cash Location <span className="text-danger">*</span></label>
            <CFormSelect 
              name="cashLocation" 
              value={formData.cashLocation} 
              onChange={handleChange} 
              required 
              disabled={isSubmitting}
            >
              <option value="">Select Cash Location</option>
              {cashLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        );
      case 'Bank':
        return (
          <>
            <CCol md={6}>
              <label className="form-label">Payment Sub Mode <span className="text-danger">*</span></label>
              <CFormSelect 
                name="subPaymentMode" 
                value={formData.subPaymentMode} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting}
              >
                <option value="">Select Payment Sub Mode</option>
                {paymentSubModes.map((subMode) => (
                  <option key={subMode.id} value={subMode.id}>
                    {subMode.payment_mode}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Bank Location <span className="text-danger">*</span></label>
              <CFormSelect 
                name="bank" 
                value={formData.bank} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting}
              >
                <option value="">Select Bank Location</option>
                {bankLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </>
        );
      default:
        return null;
    }
  };

  // ============ RENDER TABLE ============
  const renderTable = () => {
    return (
      <>
        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr.no</CTableHeaderCell>
                <CTableHeaderCell>Booking ID</CTableHeaderCell>
                <CTableHeaderCell>Model Name</CTableHeaderCell>
                <CTableHeaderCell>Booking Date</CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
                <CTableHeaderCell>Received</CTableHeaderCell>
                <CTableHeaderCell>Balance</CTableHeaderCell>
                <CTableHeaderCell>Refund Receipts</CTableHeaderCell>
                {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredBookings.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
                    No booking details available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                filteredBookings.map((booking, index) => {
                  const receipts = bookingReceipts[booking._id] || [];
                  
                  // Filter receipts to show ONLY those with isRefund: true
                  const refundReceipts = receipts.filter(receipt => receipt.isRefund === true);
                  
                  const sortedRefundReceipts = [...refundReceipts].sort((a, b) => {
                    const dateA = new Date(a.receiptDate || a.createdAt || 0);
                    const dateB = new Date(b.receiptDate || b.createdAt || 0);
                    return dateB - dateA; // Newest first
                  });
                  
                  return (
                    <CTableRow key={booking._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                          ? (booking.chassisNumber || 'N/A')
                          : 'N/A'
                        }
                      </CTableDataCell>
                      <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>
                        {loadingReceipts[booking._id] ? (
                          <CSpinner size="sm" color="info" />
                        ) : sortedRefundReceipts.length > 0 ? (
                          <CDropdown>
                            <CDropdownToggle size="sm" color="info" variant="outline">
                              {sortedRefundReceipts.length} Refund Receipt{sortedRefundReceipts.length > 1 ? 's' : ''}
                            </CDropdownToggle>
                            <CDropdownMenu>
                              {sortedRefundReceipts.map((receipt, receiptIndex) => (
                                <CDropdownItem 
                                  key={receipt.id} 
                                  onClick={() => printReceiptInvoice(receipt.id, booking._id)}
                                >
                                  <div className="d-flex align-items-center">
                                    <CIcon icon={cilPrint} className="me-2" />
                                    <div>
                                      <div><strong>Refund Receipt #{receiptIndex + 1}</strong></div>
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
                        ) : receiptsFetched[booking._id] ? (
                          <span className="text-muted">No refund receipts</span>
                        ) : (
                          <CButton
                            size="sm"
                            color="light"
                            onClick={() => fetchReceiptsForBooking(booking._id)}
                            disabled={loadingReceipts[booking._id]}
                          >
                            <CIcon icon={cilCloudDownload} className="me-1" />
                            Load Receipts
                          </CButton>
                        )}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            className="action-btn"
                            onClick={() => handleAddClick(booking)}
                            disabled={!canCreateRefund}
                          >
                            Add Refund
                          </CButton>
                          {/* <CButton
                            size="sm"
                            color="warning"
                            className="action-btn ms-2"
                            onClick={testPrint}
                          >
                            Test Print
                          </CButton> */}
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                })
              )}
            </CTableBody>
          </CTable>
        </div>
      </>
    );
  };

  if (!canViewRefund) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Refunds.
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

  return (
    <div>
      <div className='title'>Customer Refund</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
      
      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}
          
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className="d-flex align-items-center">
            <span className="me-3">Refund Management</span>
            {/* <CButton
              size="sm"
              color="info"
              onClick={testPrint}
            >
              Test Print Popup
            </CButton> */}
          </div>
          <div className='d-flex'>
            <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={!canViewRefund}
              style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          {renderTable()}
        </CCardBody>
      </CCard>

      {/* Refund Modal - Integrated directly */}
      <CBackdrop visible={showModal} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg" alignment="center">
        <CModalHeader>
          <CModalTitle>Process Refund</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {formError && <CAlert color="danger">{formError}</CAlert>}
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput 
                type="text" 
                value={selectedBooking?.customerDetails?.name || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput 
                type="text" 
                value={selectedBooking?.chassisNumber || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
          </CRow>

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Refund Amount (₹) <span className="text-danger">*</span></label>
                <CFormInput
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                  placeholder="Enter refund amount"
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Mode of Payment <span className="text-danger">*</span></label>
                <CFormSelect 
                  name="modeOfPayment" 
                  value={formData.modeOfPayment} 
                  onChange={handleChange} 
                  required 
                  disabled={isSubmitting}
                >
                  <option value="">--Select--</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">{renderPaymentSpecificFields()}</CRow>
            
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Refund Reason <span className="text-danger">*</span></label>
                <CFormInput 
                  type="text" 
                  name="refundReason" 
                  value={formData.refundReason} 
                  onChange={handleChange} 
                  required
                  placeholder="Enter reason for refund"
                  disabled={isSubmitting}
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Reference Number</label>
                <CFormInput 
                  type="text" 
                  name="transactionReference" 
                  value={formData.transactionReference} 
                  onChange={handleChange} 
                  placeholder="Optional reference number"
                  disabled={isSubmitting}
                />
              </CCol>
            </CRow>
            
            <CRow>
              <CCol md={6}>
                <label className="form-label">Remark</label>
                <CFormInput 
                  type="text" 
                  name="remark" 
                  value={formData.remark} 
                  onChange={handleChange} 
                  placeholder="Enter any remarks..."
                  disabled={isSubmitting}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between">
          <div>
            <CButton 
              color="primary" 
              onClick={handleSubmit} 
              className="me-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Process Refund'}
            </CButton>
          </div>
          <CButton 
            color="secondary" 
            onClick={() => setShowModal(false)} 
            disabled={isSubmitting}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Refund;