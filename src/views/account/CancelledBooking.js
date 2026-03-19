// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   getDefaultSearchFields,
// //   useTableFilter,
// //   usePagination,
// //   axiosInstance,
// //   showError
// // } from '../../utils/tableImports';
// // import CancelledBookingModel from './CancelledBookingModel';
// // import { 
// //   CBadge,
// //   CButton, 
// //   CCard, 
// //   CCardBody, 
// //   CCardHeader, 
// //   CFormInput, 
// //   CFormLabel, 
// //   CTable, 
// //   CTableBody, 
// //   CTableHead, 
// //   CTableHeaderCell, 
// //   CTableRow,
// //   CTableDataCell,
// //   CSpinner,
// //   CAlert,
// //   CNav,
// //   CNavItem,
// //   CNavLink,
// //   CTabContent,
// //   CTabPane
// // } from '@coreui/react';

// // // Import permission utilities
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   canCreateInPage,
// //   canUpdateInPage,
// //   canDeleteInPage 
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // const CancelledBooking = () => {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [processRefundData, setProcessRefundData] = useState([]);
// //   const [completedRefundData, setCompletedRefundData] = useState([]);
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState({
// //     processRefund: true,
// //     completedRefund: true
// //   });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');

// //   const { permissions } = useAuth();

// //   // Page-level permission checks for Cancelled Booking under ACCOUNT module
// //   const canViewCancelledBooking = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canCreateCancelledBooking = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canUpdateCancelledBooking = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canDeleteCancelledBooking = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  
// //   // Check if user can process refunds (usually tied to CREATE or UPDATE permission)
// //   const canProcessRefund = canCreateCancelledBooking || canUpdateCancelledBooking;

// //   useEffect(() => {
// //     if (!canViewCancelledBooking) {
// //       return;
// //     }
    
// //     fetchData();
// //   }, [activeTab, canViewCancelledBooking]);

// //   const fetchData = async () => {
// //     try {
// //       if (activeTab === 0) {
// //         setLoading(prev => ({ ...prev, processRefund: true }));
// //       } else {
// //         setLoading(prev => ({ ...prev, completedRefund: true }));
// //       }
      
// //       let url = '';
// //       if (activeTab === 0) {
// //         url = `/cancelbooking/cancellations?status=APPROVED_BY_GM`;
// //       } else {
// //         url = `/cancelbooking/cancellations?status=REFUND_PROCESSED`;
// //       }

// //       const response = await axiosInstance.get(url);

// //       if (response.data.success) {
// //         if (activeTab === 0) {
// //           setProcessRefundData(response.data.data);
// //           setData(response.data.data);
// //           setFilteredData(response.data.data);
// //         } else {
// //           setCompletedRefundData(response.data.data);
// //           setData(response.data.data);
// //           setFilteredData(response.data.data);
// //         }
// //       } else {
// //         throw new Error('Failed to fetch cancelled bookings');
// //       }
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       if (activeTab === 0) {
// //         setLoading(prev => ({ ...prev, processRefund: false }));
// //       } else {
// //         setLoading(prev => ({ ...prev, completedRefund: false }));
// //       }
// //     }
// //   };

// //   const handleAddClick = (booking) => {
// //     if (!canProcessRefund) {
// //       showError('You do not have permission to process refunds');
// //       return;
// //     }
    
// //     setSelectedBooking(booking);
// //     setShowModal(true);
// //   };

// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //     handleFilter(value, getDefaultSearchFields('booking'));
// //   };

// //   const handleTabChange = (tab) => {
// //     if (!canViewCancelledBooking) {
// //       return;
// //     }
    
// //     setActiveTab(tab);
// //     setSearchTerm('');
// //     if (tab === 0) {
// //       setData(processRefundData);
// //       setFilteredData(processRefundData);
// //     } else {
// //       setData(completedRefundData);
// //       setFilteredData(completedRefundData);
// //     }
// //   };

// //   const handleRefundProcessed = (message) => {
// //     setSuccessMessage(message);
// //     setTimeout(() => setSuccessMessage(''), 3000);
// //     fetchData();
// //   };

// //   const renderProcessRefundTable = () => {
// //     const currentLoading = loading.processRefund;

// //     if (currentLoading) {
// //       return (
// //         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
// //           <CSpinner color="primary" />
// //         </div>
// //       );
// //     }

// //     if (error && activeTab === 0) {
// //       return (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       );
// //     }

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell>Model Name</CTableHeaderCell>
// //               <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell>Phone</CTableHeaderCell>
// //               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
// //               <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Received</CTableHeaderCell>
// //               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
// //               {canProcessRefund && <CTableHeaderCell>Action</CTableHeaderCell>}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {currentRecords.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canProcessRefund ? "11" : "10"} className="text-center">
// //                   {searchTerm ? 'No matching bookings found' : 'No pending refund bookings available'}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               currentRecords.map((booking, index) => (
// //                 <CTableRow key={booking._id || index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   {canProcessRefund && (
// //                     <CTableDataCell>
// //                       <CButton
// //                         size="sm"
// //                         color="primary"
// //                         className="action-btn"
// //                         onClick={() => handleAddClick(booking)}
// //                         disabled={!canProcessRefund}
// //                       >
// //                         Process Refund
// //                       </CButton>
// //                     </CTableDataCell>
// //                   )}
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   const renderCompletedRefundTable = () => {
// //     const currentLoading = loading.completedRefund;

// //     if (currentLoading) {
// //       return (
// //         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
// //           <CSpinner color="primary" />
// //         </div>
// //       );
// //     }

// //     if (error && activeTab === 1) {
// //       return (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       );
// //     }

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell>Model Name</CTableHeaderCell>
// //               <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell>Phone</CTableHeaderCell>
// //               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
// //               <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Received</CTableHeaderCell>
// //               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Status</CTableHeaderCell>
// //               <CTableHeaderCell>Processed At</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {currentRecords.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="12" className="text-center">
// //                   {searchTerm ? 'No matching bookings found' : 'No completed refund bookings available'}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               currentRecords.map((booking, index) => (
// //                 <CTableRow key={booking._id || index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color="success" shape="rounded-pill">
// //                       REFUND PROCESSED
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.cancellationRequest?.accountantProcessedAt 
// //                       ? new Date(booking.cancellationRequest.accountantProcessedAt).toLocaleDateString('en-GB')
// //                       : 'N/A'
// //                     }
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   if (!canViewCancelledBooking) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Cancelled Bookings.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className='title'>Cancelled Bookings</div>
      
// //       {successMessage && (
// //         <CAlert color="success" className="mb-3">
// //           {successMessage}
// //         </CAlert>
// //       )}
    
// //       <CCard className='table-container mt-4'>
// //         <CCardBody>
// //           <CNav variant="tabs" className="mb-3 border-bottom">
// //             <CNavItem>
// //               <CNavLink
// //                 active={activeTab === 0}
// //                 onClick={() => handleTabChange(0)}
// //                 style={{ 
// //                   cursor: 'pointer',
// //                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
// //                   color: 'black',
// //                   borderBottom: 'none'
// //                 }}
// //                 disabled={!canViewCancelledBooking}
// //               >
// //                 Process Refund
// //               </CNavLink>
// //             </CNavItem>
// //             <CNavItem>
// //               <CNavLink
// //                 active={activeTab === 1}
// //                 onClick={() => handleTabChange(1)}
// //                 style={{ 
// //                   cursor: 'pointer',
// //                   borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
// //                   borderBottom: 'none',
// //                   color: 'black'
// //                 }}
// //                 disabled={!canViewCancelledBooking}
// //               >
// //                 Completed Refund
// //               </CNavLink>
// //             </CNavItem>
// //           </CNav>

// //           <div className="d-flex justify-content-between mb-3">
// //             <div></div>
// //             <div className='d-flex'>
// //               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //               <CFormInput
// //                 type="text"
// //                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                 className="d-inline-block square-search"
// //                 value={searchTerm}
// //                 onChange={(e) => handleSearch(e.target.value)}
// //                 placeholder="Search bookings..."
// //                 disabled={!canViewCancelledBooking}
// //               />
// //             </div>
// //           </div>

// //           <CTabContent>
// //             <CTabPane visible={activeTab === 0}>
// //               {renderProcessRefundTable()}
// //             </CTabPane>
// //             <CTabPane visible={activeTab === 1}>
// //               {renderCompletedRefundTable()}
// //             </CTabPane>
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>
      
// //       <CancelledBookingModel 
// //         show={showModal} 
// //         onClose={() => setShowModal(false)} 
// //         bookingData={selectedBooking} 
// //         onSuccess={handleRefundProcessed}
// //         canProcessRefund={canProcessRefund}
// //       />
// //     </div>
// //   );
// // };

// // export default CancelledBooking;















// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   getDefaultSearchFields,
// //   useTableFilter,
// //   usePagination,
// //   axiosInstance,
// //   showError
// // } from '../../utils/tableImports';
// // import CancelledBookingModel from './CancelledBookingModel';
// // import { 
// //   CBadge,
// //   CButton, 
// //   CCard, 
// //   CCardBody, 
// //   CCardHeader, 
// //   CFormInput, 
// //   CFormLabel, 
// //   CTable, 
// //   CTableBody, 
// //   CTableHead, 
// //   CTableHeaderCell, 
// //   CTableRow,
// //   CTableDataCell,
// //   CSpinner,
// //   CAlert,
// //   CNav,
// //   CNavItem,
// //   CNavLink,
// //   CTabContent,
// //   CTabPane
// // } from '@coreui/react';

// // // Import permission utilities
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   TABS, // Add TABS import
// //   ACTIONS,
// //   canViewPage,
// //   canCreateInPage,
// //   canUpdateInPage,
// //   canDeleteInPage 
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // const CancelledBooking = () => {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [processRefundData, setProcessRefundData] = useState([]);
// //   const [completedRefundData, setCompletedRefundData] = useState([]);
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState({
// //     processRefund: true,
// //     completedRefund: true
// //   });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');

// //   const { permissions } = useAuth();

// //   // Page-level permission checks for Cancelled Booking under ACCOUNT module
// //   const canViewCancelledBooking = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canCreateCancelledBooking = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canUpdateCancelledBooking = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canDeleteCancelledBooking = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  
// //   // Tab-level VIEW permission checks
// //   const canViewProcessRefundTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.ACCOUNT,
// //     PAGES.ACCOUNT.CANCELLED_BOOKING,
// //     ACTIONS.VIEW,
// //     TABS.CANCELLED_BOOKING.PROCESS_REFUND // Assuming this constant exists in TABS
// //   );
  
// //   const canViewCompletedRefundTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.ACCOUNT,
// //     PAGES.ACCOUNT.CANCELLED_BOOKING,
// //     ACTIONS.VIEW,
// //     TABS.CANCELLED_BOOKING.COMPLETED_REFUND // Assuming this constant exists in TABS
// //   );

// //   // Adjust activeTab when permissions change
// //   useEffect(() => {
// //     const availableTabs = [];
// //     if (canViewProcessRefundTab) availableTabs.push(0);
// //     if (canViewCompletedRefundTab) availableTabs.push(1);
    
// //     // If current activeTab is not in availableTabs, switch to first available tab
// //     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
// //       setActiveTab(availableTabs[0]);
// //     }
// //   }, [canViewProcessRefundTab, canViewCompletedRefundTab, activeTab]);

// //   // Check if user can process refunds (usually tied to CREATE or UPDATE permission)
// //   const canProcessRefund = canCreateCancelledBooking || canUpdateCancelledBooking;

// //   useEffect(() => {
// //     if (!canViewCancelledBooking) {
// //       return;
// //     }
    
// //     fetchData();
// //   }, [activeTab, canViewCancelledBooking]);

// //   const fetchData = async () => {
// //     try {
// //       if (activeTab === 0) {
// //         setLoading(prev => ({ ...prev, processRefund: true }));
// //       } else {
// //         setLoading(prev => ({ ...prev, completedRefund: true }));
// //       }
      
// //       let url = '';
// //       if (activeTab === 0) {
// //         url = `/cancelbooking/cancellations?status=APPROVED_BY_GM`;
// //       } else {
// //         url = `/cancelbooking/cancellations?status=REFUND_PROCESSED`;
// //       }

// //       const response = await axiosInstance.get(url);

// //       if (response.data.success) {
// //         if (activeTab === 0) {
// //           setProcessRefundData(response.data.data);
// //           setData(response.data.data);
// //           setFilteredData(response.data.data);
// //         } else {
// //           setCompletedRefundData(response.data.data);
// //           setData(response.data.data);
// //           setFilteredData(response.data.data);
// //         }
// //       } else {
// //         throw new Error('Failed to fetch cancelled bookings');
// //       }
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       if (activeTab === 0) {
// //         setLoading(prev => ({ ...prev, processRefund: false }));
// //       } else {
// //         setLoading(prev => ({ ...prev, completedRefund: false }));
// //       }
// //     }
// //   };

// //   const handleAddClick = (booking) => {
// //     if (!canProcessRefund) {
// //       showError('You do not have permission to process refunds');
// //       return;
// //     }
    
// //     setSelectedBooking(booking);
// //     setShowModal(true);
// //   };

// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //     handleFilter(value, getDefaultSearchFields('booking'));
// //   };

// //   const handleTabChange = (tab) => {
// //     if (!canViewCancelledBooking) {
// //       return;
// //     }
    
// //     setActiveTab(tab);
// //     setSearchTerm('');
// //     if (tab === 0) {
// //       setData(processRefundData);
// //       setFilteredData(processRefundData);
// //     } else {
// //       setData(completedRefundData);
// //       setFilteredData(completedRefundData);
// //     }
// //   };

// //   const handleRefundProcessed = (message) => {
// //     setSuccessMessage(message);
// //     setTimeout(() => setSuccessMessage(''), 3000);
// //     fetchData();
// //   };

// //   const renderProcessRefundTable = () => {
// //     const currentLoading = loading.processRefund;

// //     if (currentLoading) {
// //       return (
// //         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
// //           <CSpinner color="primary" />
// //         </div>
// //       );
// //     }

// //     if (error && activeTab === 0) {
// //       return (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       );
// //     }

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell>Model Name</CTableHeaderCell>
// //               <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell>Phone</CTableHeaderCell>
// //               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
// //               <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Received</CTableHeaderCell>
// //               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
// //               {canProcessRefund && <CTableHeaderCell>Action</CTableHeaderCell>}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {currentRecords.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canProcessRefund ? "11" : "10"} className="text-center">
// //                   {searchTerm ? 'No matching bookings found' : 'No pending refund bookings available'}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               currentRecords.map((booking, index) => (
// //                 <CTableRow key={booking._id || index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   {canProcessRefund && (
// //                     <CTableDataCell>
// //                       <CButton
// //                         size="sm"
// //                         color="primary"
// //                         className="action-btn"
// //                         onClick={() => handleAddClick(booking)}
// //                         disabled={!canProcessRefund}
// //                       >
// //                         Process Refund
// //                       </CButton>
// //                     </CTableDataCell>
// //                   )}
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   const renderCompletedRefundTable = () => {
// //     const currentLoading = loading.completedRefund;

// //     if (currentLoading) {
// //       return (
// //         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
// //           <CSpinner color="primary" />
// //         </div>
// //       );
// //     }

// //     if (error && activeTab === 1) {
// //       return (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       );
// //     }

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell>Model Name</CTableHeaderCell>
// //               <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell>Phone</CTableHeaderCell>
// //               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
// //               <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Received</CTableHeaderCell>
// //               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Status</CTableHeaderCell>
// //               <CTableHeaderCell>Processed At</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {currentRecords.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="12" className="text-center">
// //                   {searchTerm ? 'No matching bookings found' : 'No completed refund bookings available'}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               currentRecords.map((booking, index) => (
// //                 <CTableRow key={booking._id || index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color="success" shape="rounded-pill">
// //                       REFUND PROCESSED
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.cancellationRequest?.accountantProcessedAt 
// //                       ? new Date(booking.cancellationRequest.accountantProcessedAt).toLocaleDateString('en-GB')
// //                       : 'N/A'
// //                     }
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   if (!canViewCancelledBooking) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Cancelled Bookings.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className='title'>Cancelled Bookings</div>
      
// //       {successMessage && (
// //         <CAlert color="success" className="mb-3">
// //           {successMessage}
// //         </CAlert>
// //       )}
    
// //       <CCard className='table-container mt-4'>
// //         <CCardBody>
// //           <CNav variant="tabs" className="mb-3 border-bottom">
// //             {/* Only show Process Refund tab if user has VIEW permission for it */}
// //             {canViewProcessRefundTab && (
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 0}
// //                   onClick={() => handleTabChange(0)}
// //                   style={{ 
// //                     cursor: 'pointer',
// //                     borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
// //                     color: 'black',
// //                     borderBottom: 'none'
// //                   }}
// //                   disabled={!canViewCancelledBooking}
// //                 >
// //                   Process Refund
// //                 </CNavLink>
// //               </CNavItem>
// //             )}
// //             {/* Only show Completed Refund tab if user has VIEW permission for it */}
// //             {canViewCompletedRefundTab && (
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 1}
// //                   onClick={() => handleTabChange(1)}
// //                   style={{ 
// //                     cursor: 'pointer',
// //                     borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
// //                     borderBottom: 'none',
// //                     color: 'black'
// //                   }}
// //                   disabled={!canViewCancelledBooking}
// //                 >
// //                   Completed Refund
// //                 </CNavLink>
// //               </CNavItem>
// //             )}
// //           </CNav>

// //           <div className="d-flex justify-content-between mb-3">
// //             <div></div>
// //             <div className='d-flex'>
// //               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //               <CFormInput
// //                 type="text"
// //                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                 className="d-inline-block square-search"
// //                 value={searchTerm}
// //                 onChange={(e) => handleSearch(e.target.value)}
// //                 placeholder="Search bookings..."
// //                 disabled={!canViewCancelledBooking}
// //               />
// //             </div>
// //           </div>

// //           <CTabContent>
// //             {/* Only render Process Refund tab if user has VIEW permission for it */}
// //             {canViewProcessRefundTab && (
// //               <CTabPane visible={activeTab === 0}>
// //                 {renderProcessRefundTable()}
// //               </CTabPane>
// //             )}
// //             {/* Only render Completed Refund tab if user has VIEW permission for it */}
// //             {canViewCompletedRefundTab && (
// //               <CTabPane visible={activeTab === 1}>
// //                 {renderCompletedRefundTable()}
// //               </CTabPane>
// //             )}
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>
      
// //       <CancelledBookingModel 
// //         show={showModal} 
// //         onClose={() => setShowModal(false)} 
// //         bookingData={selectedBooking} 
// //         onSuccess={handleRefundProcessed}
// //         canProcessRefund={canProcessRefund}
// //       />
// //     </div>
// //   );
// // };

// // export default CancelledBooking;






// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   getDefaultSearchFields,
// //   useTableFilter,
// //   usePagination,
// //   axiosInstance,
// //   showError
// // } from '../../utils/tableImports';
// // import CancelledBookingModel from './CancelledBookingModel';
// // import { 
// //   CBadge,
// //   CButton, 
// //   CCard, 
// //   CCardBody, 
// //   CCardHeader, 
// //   CFormInput, 
// //   CFormLabel, 
// //   CTable, 
// //   CTableBody, 
// //   CTableHead, 
// //   CTableHeaderCell, 
// //   CTableRow,
// //   CTableDataCell,
// //   CSpinner,
// //   CAlert,
// //   CNav,
// //   CNavItem,
// //   CNavLink,
// //   CTabContent,
// //   CTabPane
// // } from '@coreui/react';

// // // Import permission utilities
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   TABS,
// //   ACTIONS,
// //   canViewPage,
// //   canCreateInPage,
// //   canUpdateInPage,
// //   canDeleteInPage 
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // const CancelledBooking = () => {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [processRefundData, setProcessRefundData] = useState([]);
// //   const [completedRefundData, setCompletedRefundData] = useState([]);
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState({
// //     processRefund: true,
// //     completedRefund: true
// //   });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');

// //   const { permissions, user } = useAuth(); // Get user from AuthContext

// //   // Check if user is superadmin
// //   const isSuperAdmin = user?.roles?.some(role => role.isSuperAdmin === true) || false;
  
// //   // Get user's branch name if not superadmin
// //   const userBranchName = !isSuperAdmin && user?.branch?.name ? user.branch.name : null;

// //   // Page-level permission checks for Cancelled Booking under ACCOUNT module
// //   const canViewCancelledBooking = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canCreateCancelledBooking = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canUpdateCancelledBooking = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
// //   const canDeleteCancelledBooking = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  
// //   // Tab-level VIEW permission checks
// //   const canViewProcessRefundTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.ACCOUNT,
// //     PAGES.ACCOUNT.CANCELLED_BOOKING,
// //     ACTIONS.VIEW,
// //     TABS.CANCELLED_BOOKING.PROCESS_REFUND
// //   );
  
// //   const canViewCompletedRefundTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.ACCOUNT,
// //     PAGES.ACCOUNT.CANCELLED_BOOKING,
// //     ACTIONS.VIEW,
// //     TABS.CANCELLED_BOOKING.COMPLETED_REFUND
// //   );

// //   // Adjust activeTab when permissions change
// //   useEffect(() => {
// //     const availableTabs = [];
// //     if (canViewProcessRefundTab) availableTabs.push(0);
// //     if (canViewCompletedRefundTab) availableTabs.push(1);
    
// //     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
// //       setActiveTab(availableTabs[0]);
// //     }
// //   }, [canViewProcessRefundTab, canViewCompletedRefundTab, activeTab]);

// //   // Check if user can process refunds
// //   const canProcessRefund = canCreateCancelledBooking || canUpdateCancelledBooking;

// //   useEffect(() => {
// //     if (!canViewCancelledBooking) {
// //       return;
// //     }
    
// //     fetchData();
// //   }, [activeTab, canViewCancelledBooking]);

// //   const fetchData = async () => {
// //     try {
// //       if (activeTab === 0) {
// //         setLoading(prev => ({ ...prev, processRefund: true }));
// //       } else {
// //         setLoading(prev => ({ ...prev, completedRefund: true }));
// //       }
      
// //       let url = '';
// //       if (activeTab === 0) {
// //         url = `/cancelbooking/cancellations?status=APPROVED_BY_GM`;
// //       } else {
// //         url = `/cancelbooking/cancellations?status=REFUND_PROCESSED`;
// //       }

// //       const response = await axiosInstance.get(url);

// //       if (response.data.success) {
// //         let filteredData = response.data.data;
        
// //         // If user is not superadmin, filter data by their branch
// //         if (!isSuperAdmin && userBranchName) {
// //           filteredData = filteredData.filter(booking => 
// //             booking.branch === userBranchName
// //           );
// //         }

// //         if (activeTab === 0) {
// //           setProcessRefundData(filteredData);
// //           setData(filteredData);
// //           setFilteredData(filteredData);
// //         } else {
// //           setCompletedRefundData(filteredData);
// //           setData(filteredData);
// //           setFilteredData(filteredData);
// //         }
// //       } else {
// //         throw new Error('Failed to fetch cancelled bookings');
// //       }
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       if (activeTab === 0) {
// //         setLoading(prev => ({ ...prev, processRefund: false }));
// //       } else {
// //         setLoading(prev => ({ ...prev, completedRefund: false }));
// //       }
// //     }
// //   };

// //   const handleAddClick = (booking) => {
// //     if (!canProcessRefund) {
// //       showError('You do not have permission to process refunds');
// //       return;
// //     }
    
// //     setSelectedBooking(booking);
// //     setShowModal(true);
// //   };

// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //     handleFilter(value, getDefaultSearchFields('booking'));
// //   };

// //   const handleTabChange = (tab) => {
// //     if (!canViewCancelledBooking) {
// //       return;
// //     }
    
// //     setActiveTab(tab);
// //     setSearchTerm('');
// //     if (tab === 0) {
// //       setData(processRefundData);
// //       setFilteredData(processRefundData);
// //     } else {
// //       setData(completedRefundData);
// //       setFilteredData(completedRefundData);
// //     }
// //   };

// //   const handleRefundProcessed = (message) => {
// //     setSuccessMessage(message);
// //     setTimeout(() => setSuccessMessage(''), 3000);
// //     fetchData();
// //   };

// //   // Helper function to check if booking belongs to user's branch
// //   const isBookingAccessible = (booking) => {
// //     // Super admin can access all bookings
// //     if (isSuperAdmin) return true;
    
// //     // Non-super admin can only access bookings from their branch
// //     if (!userBranchName) return false;
    
// //     return booking.branch === userBranchName;
// //   };

// //   const renderProcessRefundTable = () => {
// //     const currentLoading = loading.processRefund;

// //     if (currentLoading) {
// //       return (
// //         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
// //           <CSpinner color="primary" />
// //         </div>
// //       );
// //     }

// //     if (error && activeTab === 0) {
// //       return (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       );
// //     }

// //     // Filter current records based on branch access for non-super admin users
// //     const accessibleRecords = currentRecords.filter(booking => 
// //       isBookingAccessible(booking)
// //     );

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell>Model Name</CTableHeaderCell>
// //               <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell>Phone</CTableHeaderCell>
// //               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
// //               <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Received</CTableHeaderCell>
// //               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
// //               {canProcessRefund && <CTableHeaderCell>Action</CTableHeaderCell>}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {accessibleRecords.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canProcessRefund ? "11" : "10"} className="text-center">
// //                   {searchTerm ? 'No matching bookings found' : 
// //                    isSuperAdmin ? 'No pending refund bookings available' : 
// //                    `No pending refund bookings available for ${userBranchName}`}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               accessibleRecords.map((booking, index) => (
// //                 <CTableRow key={booking._id || index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   {canProcessRefund && (
// //                     <CTableDataCell>
// //                       <CButton
// //                         size="sm"
// //                         color="primary"
// //                         className="action-btn"
// //                         onClick={() => handleAddClick(booking)}
// //                         disabled={!canProcessRefund || !isBookingAccessible(booking)}
// //                         title={!isBookingAccessible(booking) ? "You can only process refunds for bookings from your branch" : ""}
// //                       >
// //                         Process Refund
// //                       </CButton>
// //                     </CTableDataCell>
// //                   )}
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   const renderCompletedRefundTable = () => {
// //     const currentLoading = loading.completedRefund;

// //     if (currentLoading) {
// //       return (
// //         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
// //           <CSpinner color="primary" />
// //         </div>
// //       );
// //     }

// //     if (error && activeTab === 1) {
// //       return (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       );
// //     }

// //     // Filter current records based on branch access for non-super admin users
// //     const accessibleRecords = currentRecords.filter(booking => 
// //       isBookingAccessible(booking)
// //     );

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell>Model Name</CTableHeaderCell>
// //               <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell>Phone</CTableHeaderCell>
// //               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
// //               <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Received</CTableHeaderCell>
// //               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
// //               <CTableHeaderCell>Status</CTableHeaderCell>
// //               <CTableHeaderCell>Processed At</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {accessibleRecords.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="12" className="text-center">
// //                   {searchTerm ? 'No matching bookings found' : 
// //                    isSuperAdmin ? 'No completed refund bookings available' : 
// //                    `No completed refund bookings available for ${userBranchName}`}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               accessibleRecords.map((booking, index) => (
// //                 <CTableRow key={booking._id || index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color="success" shape="rounded-pill">
// //                       REFUND PROCESSED
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     {booking.cancellationRequest?.accountantProcessedAt 
// //                       ? new Date(booking.cancellationRequest.accountantProcessedAt).toLocaleDateString('en-GB')
// //                       : 'N/A'
// //                     }
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   if (!canViewCancelledBooking) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Cancelled Bookings.
// //       </div>
// //     );
// //   }

 

// //   return (
// //     <div>
// //       <div className='title'>Cancelled Bookings</div>
      
// //       {successMessage && (
// //         <CAlert color="success" className="mb-3">
// //           {successMessage}
// //         </CAlert>
// //       )}
      
  
    
// //       <CCard className='table-container mt-4'>
// //         <CCardBody>
// //           <CNav variant="tabs" className="mb-3 border-bottom">
// //             {canViewProcessRefundTab && (
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 0}
// //                   onClick={() => handleTabChange(0)}
// //                   style={{ 
// //                     cursor: 'pointer',
// //                     borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
// //                     color: 'black',
// //                     borderBottom: 'none'
// //                   }}
// //                   disabled={!canViewCancelledBooking}
// //                 >
// //                   Process Refund
// //                 </CNavLink>
// //               </CNavItem>
// //             )}
// //             {canViewCompletedRefundTab && (
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 1}
// //                   onClick={() => handleTabChange(1)}
// //                   style={{ 
// //                     cursor: 'pointer',
// //                     borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
// //                     borderBottom: 'none',
// //                     color: 'black'
// //                   }}
// //                   disabled={!canViewCancelledBooking}
// //                 >
// //                   Completed Refund
// //                 </CNavLink>
// //               </CNavItem>
// //             )}
// //           </CNav>

// //           <div className="d-flex justify-content-between mb-3">
// //             <div></div>
// //             <div className='d-flex'>
// //               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //               <CFormInput
// //                 type="text"
// //                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                 className="d-inline-block square-search"
// //                 value={searchTerm}
// //                 onChange={(e) => handleSearch(e.target.value)}
// //                 placeholder="Search bookings..."
// //                 disabled={!canViewCancelledBooking}
// //               />
// //             </div>
// //           </div>

// //           <CTabContent>
// //             {canViewProcessRefundTab && (
// //               <CTabPane visible={activeTab === 0}>
// //                 {renderProcessRefundTable()}
// //               </CTabPane>
// //             )}
// //             {canViewCompletedRefundTab && (
// //               <CTabPane visible={activeTab === 1}>
// //                 {renderCompletedRefundTable()}
// //               </CTabPane>
// //             )}
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>
      
// //       <CancelledBookingModel 
// //         show={showModal} 
// //         onClose={() => setShowModal(false)} 
// //         bookingData={selectedBooking} 
// //         onSuccess={handleRefundProcessed}
// //         canProcessRefund={canProcessRefund}
// //         // Pass branch restriction info to modal
// //         isSuperAdmin={isSuperAdmin}
// //         userBranchName={userBranchName}
// //       />
// //     </div>
// //   );
// // };

// // export default CancelledBooking;









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
// import CancelledBookingModel from './CancelledBookingModel';
// import { 
//   CBadge,
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
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane
// } from '@coreui/react';

// // Import permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const CancelledBooking = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [processRefundData, setProcessRefundData] = useState([]);
//   const [completedRefundData, setCompletedRefundData] = useState([]);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState({
//     processRefund: true,
//     completedRefund: true
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const { permissions, user } = useAuth(); // Get user from AuthContext

//   // Check if user is superadmin
//   const isSuperAdmin = user?.roles?.some(role => role.isSuperAdmin === true) || false;
  
//   // Get user's branch name if not superadmin
//   const userBranchName = !isSuperAdmin && user?.branch?.name ? user.branch.name : null;

//   // Page-level VIEW permission check - for accessing the page at all
//   const canViewCancelledBooking = hasSafePagePermission(
//     permissions,
//     MODULES.ACCOUNT,
//     PAGES.ACCOUNT.CANCELLED_BOOKING,
//     ACTIONS.VIEW
//   );
  
//   // Tab-level VIEW permission checks
//   const canViewProcessRefundTab = hasSafePagePermission(
//     permissions,
//     MODULES.ACCOUNT,
//     PAGES.ACCOUNT.CANCELLED_BOOKING,
//     ACTIONS.VIEW,
//     TABS.CANCELLED_BOOKING.PROCESS_REFUND
//   );
  
//   const canViewCompletedRefundTab = hasSafePagePermission(
//     permissions,
//     MODULES.ACCOUNT,
//     PAGES.ACCOUNT.CANCELLED_BOOKING,
//     ACTIONS.VIEW,
//     TABS.CANCELLED_BOOKING.COMPLETED_REFUND
//   );
  
//   // Tab-level CREATE permission check for PROCESS REFUND tab
//   const canCreateInProcessRefundTab = hasSafePagePermission(
//     permissions,
//     MODULES.ACCOUNT,
//     PAGES.ACCOUNT.CANCELLED_BOOKING,
//     ACTIONS.CREATE,
//     TABS.CANCELLED_BOOKING.PROCESS_REFUND
//   );
  
//   // Check if user can process refunds - ONLY CREATE permission (not UPDATE)
//   const canProcessRefund = canCreateInProcessRefundTab;

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewProcessRefundTab) availableTabs.push(0);
//     if (canViewCompletedRefundTab) availableTabs.push(1);
    
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewProcessRefundTab, canViewCompletedRefundTab, activeTab]);

//   useEffect(() => {
//     if (!canViewCancelledBooking) {
//       return;
//     }
    
//     fetchData();
//   }, [activeTab, canViewCancelledBooking]);

//   const fetchData = async () => {
//     try {
//       if (activeTab === 0) {
//         setLoading(prev => ({ ...prev, processRefund: true }));
//       } else {
//         setLoading(prev => ({ ...prev, completedRefund: true }));
//       }
      
//       let url = '';
//       if (activeTab === 0) {
//         url = `/cancelbooking/cancellations?status=APPROVED_BY_GM`;
//       } else {
//         url = `/cancelbooking/cancellations?status=REFUND_PROCESSED`;
//       }

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         let filteredData = response.data.data;
        
//         // If user is not superadmin, filter data by their branch
//         if (!isSuperAdmin && userBranchName) {
//           filteredData = filteredData.filter(booking => 
//             booking.branch === userBranchName
//           );
//         }

//         if (activeTab === 0) {
//           setProcessRefundData(filteredData);
//           setData(filteredData);
//           setFilteredData(filteredData);
//         } else {
//           setCompletedRefundData(filteredData);
//           setData(filteredData);
//           setFilteredData(filteredData);
//         }
//       } else {
//         throw new Error('Failed to fetch cancelled bookings');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       if (activeTab === 0) {
//         setLoading(prev => ({ ...prev, processRefund: false }));
//       } else {
//         setLoading(prev => ({ ...prev, completedRefund: false }));
//       }
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canProcessRefund) {
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

//   const handleTabChange = (tab) => {
//     if (!canViewCancelledBooking) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setSearchTerm('');
//     if (tab === 0) {
//       setData(processRefundData);
//       setFilteredData(processRefundData);
//     } else {
//       setData(completedRefundData);
//       setFilteredData(completedRefundData);
//     }
//   };

//   const handleRefundProcessed = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     fetchData();
//   };

//   // Helper function to check if booking belongs to user's branch
//   const isBookingAccessible = (booking) => {
//     // Super admin can access all bookings
//     if (isSuperAdmin) return true;
    
//     // Non-super admin can only access bookings from their branch
//     if (!userBranchName) return false;
    
//     return booking.branch === userBranchName;
//   };

//   const renderProcessRefundTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewProcessRefundTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Process Refund tab.
//           </CAlert>
//         </div>
//       );
//     }

//     const currentLoading = loading.processRefund;

//     if (currentLoading) {
//       return (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//           <CSpinner color="primary" />
//         </div>
//       );
//     }

//     if (error && activeTab === 0) {
//       return (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       );
//     }

//     // Filter current records based on branch access for non-super admin users
//     const accessibleRecords = currentRecords.filter(booking => 
//       isBookingAccessible(booking)
//     );

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell>Sr.no</CTableHeaderCell>
//               <CTableHeaderCell>Booking ID</CTableHeaderCell>
//               <CTableHeaderCell>Model Name</CTableHeaderCell>
//               <CTableHeaderCell>Booking Date</CTableHeaderCell>
//               <CTableHeaderCell>Customer Name</CTableHeaderCell>
//               <CTableHeaderCell>Phone</CTableHeaderCell>
//               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
//               <CTableHeaderCell>Total Amount</CTableHeaderCell>
//               <CTableHeaderCell>Received</CTableHeaderCell>
//               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
//               {canProcessRefund && <CTableHeaderCell>Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {accessibleRecords.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canProcessRefund ? "11" : "10"} className="text-center">
//                   {searchTerm ? 'No matching bookings found' : 
//                    isSuperAdmin ? 'No pending refund bookings available' : 
//                    `No pending refund bookings available for ${userBranchName}`}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               accessibleRecords.map((booking, index) => (
//                 <CTableRow key={booking._id || index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   {canProcessRefund && (
//                     <CTableDataCell>
//                       <CButton
//                         size="sm"
//                         color="primary"
//                         className="action-btn"
//                         onClick={() => handleAddClick(booking)}
//                         disabled={!canProcessRefund || !isBookingAccessible(booking)}
//                         title={!isBookingAccessible(booking) ? "You can only process refunds for bookings from your branch" : ""}
//                       >
//                         Process Refund
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderCompletedRefundTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewCompletedRefundTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Completed Refund tab.
//           </CAlert>
//         </div>
//       );
//     }

//     const currentLoading = loading.completedRefund;

//     if (currentLoading) {
//       return (
//         <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//           <CSpinner color="primary" />
//         </div>
//       );
//     }

//     if (error && activeTab === 1) {
//       return (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       );
//     }

//     // Filter current records based on branch access for non-super admin users
//     const accessibleRecords = currentRecords.filter(booking => 
//       isBookingAccessible(booking)
//     );

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell>Sr.no</CTableHeaderCell>
//               <CTableHeaderCell>Booking ID</CTableHeaderCell>
//               <CTableHeaderCell>Model Name</CTableHeaderCell>
//               <CTableHeaderCell>Booking Date</CTableHeaderCell>
//               <CTableHeaderCell>Customer Name</CTableHeaderCell>
//               <CTableHeaderCell>Phone</CTableHeaderCell>
//               <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
//               <CTableHeaderCell>Total Amount</CTableHeaderCell>
//               <CTableHeaderCell>Received</CTableHeaderCell>
//               <CTableHeaderCell>Refund Amount</CTableHeaderCell>
//               <CTableHeaderCell>Status</CTableHeaderCell>
//               <CTableHeaderCell>Processed At</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {accessibleRecords.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="12" className="text-center">
//                   {searchTerm ? 'No matching bookings found' : 
//                    isSuperAdmin ? 'No completed refund bookings available' : 
//                    `No completed refund bookings available for ${userBranchName}`}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               accessibleRecords.map((booking, index) => (
//                 <CTableRow key={booking._id || index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="success" shape="rounded-pill">
//                       REFUND PROCESSED
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {booking.cancellationRequest?.accountantProcessedAt 
//                       ? new Date(booking.cancellationRequest.accountantProcessedAt).toLocaleDateString('en-GB')
//                       : 'N/A'
//                     }
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (!canViewCancelledBooking) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Cancelled Bookings.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Cancelled Bookings</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           {/* Only show tabs if user has permission to view at least one tab */}
//           {(canViewProcessRefundTab || canViewCompletedRefundTab) ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewProcessRefundTab && (
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
//                       Process Refund
//                       {!canProcessRefund && canViewProcessRefundTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompletedRefundTab && (
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
//                       Completed Refund
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     placeholder="Search bookings..."
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewProcessRefundTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderProcessRefundTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompletedRefundTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderCompletedRefundTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Cancelled Bookings.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>
      
//       <CancelledBookingModel 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         bookingData={selectedBooking} 
//         onSuccess={handleRefundProcessed}
//         canProcessRefund={canProcessRefund}
//         // Pass branch restriction info to modal
//         isSuperAdmin={isSuperAdmin}
//         userBranchName={userBranchName}
//       />
//     </div>
//   );
// };

// export default CancelledBooking;








import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
  showError
} from '../../utils/tableImports';
import CancelledBookingModel from './CancelledBookingModel';
import { 
  CBadge,
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronLeft, cilChevronRight } from '@coreui/icons';

// Import permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const CancelledBooking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [processRefundData, setProcessRefundData] = useState([]);
  const [completedRefundData, setCompletedRefundData] = useState([]);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    processRefund: true,
    completedRefund: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pagination states for Process Refund tab
  const [processRefundPagination, setProcessRefundPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: ''
  });

  // Pagination states for Completed Refund tab
  const [completedRefundPagination, setCompletedRefundPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: ''
  });

  const { permissions, user } = useAuth(); // Get user from AuthContext

  // Debounce timer for search
  const searchTimer = React.useRef(null);

  // Check if user is superadmin
  const isSuperAdmin = user?.roles?.some(role => role.isSuperAdmin === true) || false;
  
  // Get user's branch name if not superadmin
  const userBranchName = !isSuperAdmin && user?.branch?.name ? user.branch.name : null;

  // Page-level VIEW permission check - for accessing the page at all
  const canViewCancelledBooking = hasSafePagePermission(
    permissions,
    MODULES.ACCOUNT,
    PAGES.ACCOUNT.CANCELLED_BOOKING,
    ACTIONS.VIEW
  );
  
  // Tab-level VIEW permission checks
  const canViewProcessRefundTab = hasSafePagePermission(
    permissions,
    MODULES.ACCOUNT,
    PAGES.ACCOUNT.CANCELLED_BOOKING,
    ACTIONS.VIEW,
    TABS.CANCELLED_BOOKING.PROCESS_REFUND
  );
  
  const canViewCompletedRefundTab = hasSafePagePermission(
    permissions,
    MODULES.ACCOUNT,
    PAGES.ACCOUNT.CANCELLED_BOOKING,
    ACTIONS.VIEW,
    TABS.CANCELLED_BOOKING.COMPLETED_REFUND
  );
  
  // Tab-level CREATE permission check for PROCESS REFUND tab
  const canCreateInProcessRefundTab = hasSafePagePermission(
    permissions,
    MODULES.ACCOUNT,
    PAGES.ACCOUNT.CANCELLED_BOOKING,
    ACTIONS.CREATE,
    TABS.CANCELLED_BOOKING.PROCESS_REFUND
  );
  
  // Check if user can process refunds - ONLY CREATE permission (not UPDATE)
  const canProcessRefund = canCreateInProcessRefundTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    const availableTabs = [];
    if (canViewProcessRefundTab) availableTabs.push(0);
    if (canViewCompletedRefundTab) availableTabs.push(1);
    
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [canViewProcessRefundTab, canViewCompletedRefundTab, activeTab]);

  useEffect(() => {
    if (!canViewCancelledBooking) {
      return;
    }
    
    // Fetch initial data for both tabs
    fetchProcessRefundData(1, processRefundPagination.limit, '');
    fetchCompletedRefundData(1, completedRefundPagination.limit, '');
  }, [canViewCancelledBooking]);

  // Fetch Process Refund data with pagination
  const fetchProcessRefundData = async (page = processRefundPagination.currentPage, limit = processRefundPagination.limit, search = processRefundPagination.search) => {
    if (!canViewProcessRefundTab) return;
    
    try {
      setProcessRefundPagination(prev => ({ ...prev, loading: true }));
      
      const params = { 
        status: 'APPROVED_BY_GM',
        page, 
        limit 
      };
      
      // Add search parameter if provided (if API supports search)
      if (search) {
        params.search = search;
      }
      
      const response = await axiosInstance.get(`/cancelbooking/cancellations`, { params });

      if (response.data.success) {
        let bookings = response.data.data || [];
        const paginationInfo = response.data.pagination || {
          page: page,
          limit: limit,
          total: bookings.length,
          pages: Math.ceil(bookings.length / limit)
        };
        
        // If user is not superadmin, filter data by their branch
        if (!isSuperAdmin && userBranchName) {
          bookings = bookings.filter(booking => 
            booking.branch === userBranchName
          );
          // Recalculate pagination after filtering
          paginationInfo.total = bookings.length;
          paginationInfo.pages = Math.ceil(bookings.length / limit);
        }

        setProcessRefundPagination({
          docs: bookings,
          total: paginationInfo.total,
          pages: paginationInfo.pages,
          currentPage: page,
          limit: limit,
          loading: false,
          search: search
        });

        setProcessRefundData(bookings);
        
        // Update data and filteredData for current tab
        if (activeTab === 0) {
          setData(bookings);
          setFilteredData(bookings);
        }
      } else {
        throw new Error('Failed to fetch cancelled bookings');
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setProcessRefundPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, processRefund: false }));
    }
  };

  // Fetch Completed Refund data with pagination
  const fetchCompletedRefundData = async (page = completedRefundPagination.currentPage, limit = completedRefundPagination.limit, search = completedRefundPagination.search) => {
    if (!canViewCompletedRefundTab) return;
    
    try {
      setCompletedRefundPagination(prev => ({ ...prev, loading: true }));
      
      const params = { 
        status: 'REFUND_PROCESSED',
        page, 
        limit 
      };
      
      // Add search parameter if provided (if API supports search)
      if (search) {
        params.search = search;
      }
      
      const response = await axiosInstance.get(`/cancelbooking/cancellations`, { params });

      if (response.data.success) {
        let bookings = response.data.data || [];
        const paginationInfo = response.data.pagination || {
          page: page,
          limit: limit,
          total: bookings.length,
          pages: Math.ceil(bookings.length / limit)
        };
        
        // If user is not superadmin, filter data by their branch
        if (!isSuperAdmin && userBranchName) {
          bookings = bookings.filter(booking => 
            booking.branch === userBranchName
          );
          // Recalculate pagination after filtering
          paginationInfo.total = bookings.length;
          paginationInfo.pages = Math.ceil(bookings.length / limit);
        }

        setCompletedRefundPagination({
          docs: bookings,
          total: paginationInfo.total,
          pages: paginationInfo.pages,
          currentPage: page,
          limit: limit,
          loading: false,
          search: search
        });

        setCompletedRefundData(bookings);
        
        // Update data and filteredData for current tab
        if (activeTab === 1) {
          setData(bookings);
          setFilteredData(bookings);
        }
      } else {
        throw new Error('Failed to fetch cancelled bookings');
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setCompletedRefundPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, completedRefund: false }));
    }
  };

  const handleAddClick = (booking) => {
    if (!canProcessRefund) {
      showError('You do not have permission to process refunds');
      return;
    }
    
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (activeTab === 0) {
        setProcessRefundPagination(prev => ({ ...prev, search: value }));
        fetchProcessRefundData(1, processRefundPagination.limit, value);
      } else {
        setCompletedRefundPagination(prev => ({ ...prev, search: value }));
        fetchCompletedRefundData(1, completedRefundPagination.limit, value);
      }
    }, 400);
  };

  const handleTabChange = (tab) => {
    if (!canViewCancelledBooking) {
      return;
    }
    
    setActiveTab(tab);
    setSearchTerm('');
    
    if (tab === 0) {
      setData(processRefundPagination.docs);
      setFilteredData(processRefundPagination.docs);
    } else {
      setData(completedRefundPagination.docs);
      setFilteredData(completedRefundPagination.docs);
    }
  };

  const handleRefundProcessed = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Refresh current tab data
    if (activeTab === 0) {
      fetchProcessRefundData(processRefundPagination.currentPage, processRefundPagination.limit, processRefundPagination.search);
    }
  };

  // Page change handlers
  const handleProcessRefundPageChange = (newPage) => {
    if (newPage < 1 || newPage > processRefundPagination.pages) return;
    fetchProcessRefundData(newPage, processRefundPagination.limit, processRefundPagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessRefundLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchProcessRefundData(1, limit, processRefundPagination.search);
  };

  const handleCompletedRefundPageChange = (newPage) => {
    if (newPage < 1 || newPage > completedRefundPagination.pages) return;
    fetchCompletedRefundData(newPage, completedRefundPagination.limit, completedRefundPagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompletedRefundLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchCompletedRefundData(1, limit, completedRefundPagination.search);
  };

  // Helper function to check if booking belongs to user's branch
  const isBookingAccessible = (booking) => {
    // Super admin can access all bookings
    if (isSuperAdmin) return true;
    
    // Non-super admin can only access bookings from their branch
    if (!userBranchName) return false;
    
    return booking.branch === userBranchName;
  };

  // Render pagination for Process Refund tab
  const renderProcessRefundPagination = () => {
    const { currentPage, pages, total, limit, loading } = processRefundPagination;
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
              onChange={e => handleProcessRefundLimitChange(e.target.value)}
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
              onClick={() => handleProcessRefundPageChange(1)} 
              disabled={currentPage === 1 || loading}
            >
              «
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handleProcessRefundPageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem 
                  onClick={() => handleProcessRefundPageChange(1)} 
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
                onClick={() => handleProcessRefundPageChange(p)} 
                disabled={loading}
              >
                {p}
              </CPaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem 
                  onClick={() => handleProcessRefundPageChange(pages)} 
                  disabled={loading}
                >
                  {pages}
                </CPaginationItem>
              </>
            )}

            <CPaginationItem 
              onClick={() => handleProcessRefundPageChange(currentPage + 1)} 
              disabled={currentPage === pages || loading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handleProcessRefundPageChange(pages)} 
              disabled={currentPage === pages || loading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // Render pagination for Completed Refund tab
  const renderCompletedRefundPagination = () => {
    const { currentPage, pages, total, limit, loading } = completedRefundPagination;
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
              onChange={e => handleCompletedRefundLimitChange(e.target.value)}
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
              onClick={() => handleCompletedRefundPageChange(1)} 
              disabled={currentPage === 1 || loading}
            >
              «
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handleCompletedRefundPageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem 
                  onClick={() => handleCompletedRefundPageChange(1)} 
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
                onClick={() => handleCompletedRefundPageChange(p)} 
                disabled={loading}
              >
                {p}
              </CPaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem 
                  onClick={() => handleCompletedRefundPageChange(pages)} 
                  disabled={loading}
                >
                  {pages}
                </CPaginationItem>
              </>
            )}

            <CPaginationItem 
              onClick={() => handleCompletedRefundPageChange(currentPage + 1)} 
              disabled={currentPage === pages || loading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handleCompletedRefundPageChange(pages)} 
              disabled={currentPage === pages || loading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const renderProcessRefundTable = () => {
    // Check if user has permission to view this tab
    if (!canViewProcessRefundTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Process Refund tab.
          </CAlert>
        </div>
      );
    }

    const currentLoading = processRefundPagination.loading;

    if (currentLoading && processRefundPagination.docs.length === 0) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (error && activeTab === 0) {
      return (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      );
    }

    // Filter current docs based on branch access for non-super admin users
    const accessibleDocs = processRefundPagination.docs.filter(booking => 
      isBookingAccessible(booking)
    );

    return (
      <>
        {currentLoading && processRefundPagination.docs.length > 0 && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        
        <div className="responsive-table-wrapper" style={{ opacity: currentLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr.no</CTableHeaderCell>
                <CTableHeaderCell>Booking ID</CTableHeaderCell>
                <CTableHeaderCell>Model Name</CTableHeaderCell>
                <CTableHeaderCell>Booking Date</CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
                <CTableHeaderCell>Total Amount</CTableHeaderCell>
                <CTableHeaderCell>Received</CTableHeaderCell>
                <CTableHeaderCell>Refund Amount</CTableHeaderCell>
                {canProcessRefund && <CTableHeaderCell>Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {accessibleDocs.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={canProcessRefund ? "11" : "10"} className="text-center">
                    {processRefundPagination.search ? 'No matching bookings found' : 
                     isSuperAdmin ? 'No pending refund bookings available' : 
                     `No pending refund bookings available for ${userBranchName}`}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                accessibleDocs.map((booking, index) => {
                  const globalIndex = (processRefundPagination.currentPage - 1) * processRefundPagination.limit + index + 1;
                  return (
                    <CTableRow key={booking._id || index}>
                      <CTableDataCell>{globalIndex}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      {canProcessRefund && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            className="action-btn"
                            onClick={() => handleAddClick(booking)}
                            disabled={!canProcessRefund || !isBookingAccessible(booking)}
                            title={!isBookingAccessible(booking) ? "You can only process refunds for bookings from your branch" : ""}
                          >
                            Process Refund
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                })
              )}
            </CTableBody>
          </CTable>
        </div>
        
        {renderProcessRefundPagination()}
      </>
    );
  };

  const renderCompletedRefundTable = () => {
    // Check if user has permission to view this tab
    if (!canViewCompletedRefundTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Completed Refund tab.
          </CAlert>
        </div>
      );
    }

    const currentLoading = completedRefundPagination.loading;

    if (currentLoading && completedRefundPagination.docs.length === 0) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (error && activeTab === 1) {
      return (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      );
    }

    // Filter current docs based on branch access for non-super admin users
    const accessibleDocs = completedRefundPagination.docs.filter(booking => 
      isBookingAccessible(booking)
    );

    return (
      <>
        {currentLoading && completedRefundPagination.docs.length > 0 && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        
        <div className="responsive-table-wrapper" style={{ opacity: currentLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr.no</CTableHeaderCell>
                <CTableHeaderCell>Booking ID</CTableHeaderCell>
                <CTableHeaderCell>Model Name</CTableHeaderCell>
                <CTableHeaderCell>Booking Date</CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
                <CTableHeaderCell>Total Amount</CTableHeaderCell>
                <CTableHeaderCell>Received</CTableHeaderCell>
                <CTableHeaderCell>Refund Amount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Processed At</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {accessibleDocs.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="12" className="text-center">
                    {completedRefundPagination.search ? 'No matching bookings found' : 
                     isSuperAdmin ? 'No completed refund bookings available' : 
                     `No completed refund bookings available for ${userBranchName}`}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                accessibleDocs.map((booking, index) => {
                  const globalIndex = (completedRefundPagination.currentPage - 1) * completedRefundPagination.limit + index + 1;
                  return (
                    <CTableRow key={booking._id || index}>
                      <CTableDataCell>{globalIndex}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="success" shape="rounded-pill">
                          REFUND PROCESSED
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {booking.cancellationRequest?.accountantProcessedAt 
                          ? new Date(booking.cancellationRequest.accountantProcessedAt).toLocaleDateString('en-GB')
                          : 'N/A'
                        }
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              )}
            </CTableBody>
          </CTable>
        </div>
        
        {renderCompletedRefundPagination()}
      </>
    );
  };

  if (!canViewCancelledBooking) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Cancelled Bookings.
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Cancelled Bookings</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Only show tabs if user has permission to view at least one tab */}
          {(canViewProcessRefundTab || canViewCompletedRefundTab) ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewProcessRefundTab && (
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
                      Process Refund
                      {!canProcessRefund && canViewProcessRefundTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletedRefundTab && (
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
                      Completed Refund
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <div className="d-flex justify-content-between mb-3">
                <div className="text-muted">
                  Total Records: {activeTab === 0 ? processRefundPagination.total : completedRefundPagination.total}
                </div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search bookings..."
                  />
                </div>
              </div>

              <CTabContent>
                {canViewProcessRefundTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderProcessRefundTable()}
                  </CTabPane>
                )}
                {canViewCompletedRefundTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderCompletedRefundTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in Cancelled Bookings.
            </CAlert>
          )}
        </CCardBody>
      </CCard>
      
      <CancelledBookingModel 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        bookingData={selectedBooking} 
        onSuccess={handleRefundProcessed}
        canProcessRefund={canProcessRefund}
        // Pass branch restriction info to modal
        isSuperAdmin={isSuperAdmin}
        userBranchName={userBranchName}
      />
    </div>
  );
};

export default CancelledBooking;