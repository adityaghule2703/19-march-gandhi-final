// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CBadge
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields,useTableFilter } from 'src/utils/tableImports';
// import SubdealerReceiptModal from './SubdealerReceiptModel';
// import CIcon from '@coreui/icons-react';
// import { cilPlus} from '@coreui/icons';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage
// } from '../../../utils/modulePermissions';

// function SubdealerReceipts() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [allBookings, setAllBookings] = useState([]);
//   const [pendingSearchTerm, setPendingSearchTerm] = useState('');
//   const [completedSearchTerm, setCompletedSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Finance Payment page under Subdealer Account module
//   const hasFinancePaymentView = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
//     ACTIONS.VIEW
//   );
  
//   const hasFinancePaymentCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
//     ACTIONS.CREATE
//   );

//   // Using convenience functions for cleaner code
//   const canViewFinancePayment = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT);
//   const canCreateFinancePayment = canCreateInPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT);

//   const {
//     data: pendingBookingsData,
//     setData: setPendingBookingsData,
//     filteredData: filteredPendingBookings,
//     setFilteredData: setFilteredPendingBookings,
//     handleFilter: handlePendingBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: completedBookingsData,
//     setData: setCompletedBookingsData,
//     filteredData: filteredCompletedBookings,
//     setFilteredData: setFilteredCompletedBookings,
//     handleFilter: handleCompletedBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: ledgerData,
//     setData: setLedgerData,
//     filteredData: filteredLedger,
//     setFilteredData: setFilteredLedger,
//     handleFilter: handleLedgerFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     if (!canViewFinancePayment) {
//       showError('You do not have permission to view Subdealer Receipts');
//       return;
//     }
    
//     fetchData();
//   }, [canViewFinancePayment]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings`);
//       const bookings = response.data.data.bookings.filter(
//         (booking) => booking.bookingType === 'SUBDEALER' && booking.payment.type === 'FINANCE'
//       );
//       setAllBookings(bookings);

//       const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
//       setPendingBookingsData(pendingBookings);
//       setFilteredPendingBookings(pendingBookings);

//       const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
//       setCompletedBookingsData(completedBookings);
//       setFilteredCompletedBookings(completedBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchLocationData();
//   }, []);

//   const fetchLocationData = async () => {
//     try {
//       const response = await axiosInstance.get(`/ledger/summary/branch`);
//       setLedgerData(response.data.data.byBranch);
//       setFilteredLedger(response.data.data.byBranch);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleAddClick = (booking) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handlePendingSearch = (searchValue) => {
//     setPendingSearchTerm(searchValue);
//     handlePendingBookingsFilter(searchValue, getDefaultSearchFields('booking'));
//   };

//   const handleCompletedSearch = (searchValue) => {
//     setCompletedSearchTerm(searchValue);
//     handleCompletedBookingsFilter(searchValue, getDefaultSearchFields('booking'));
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setPendingSearchTerm('');
//     setCompletedSearchTerm('');
//   };

//   const handleResetPendingSearch = () => {
//     setPendingSearchTerm('');
//     handlePendingBookingsFilter('', getDefaultSearchFields('booking'));
//   };

//   const handleResetCompletedSearch = () => {
//     setCompletedSearchTerm('');
//     handleCompletedBookingsFilter('', getDefaultSearchFields('booking'));
//   };

//   if (!canViewFinancePayment) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer Receipts.
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
//       <div className='title'>Subdealer Receipts</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <CNav variant="tabs" className="mb-0 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 0}
//                 onClick={() => handleTabChange(0)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                   color: 'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 Pending Payment
//                 <CBadge color="warning" className="ms-2">
//                   {pendingBookingsData.length}
//                 </CBadge>
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 1}
//                 onClick={() => handleTabChange(1)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Complete Payment
//                 <CBadge color="success" className="ms-2">
//                   {completedBookingsData.length}
//                 </CBadge>
//               </CNavLink>
//             </CNavItem>
//           </CNav>
//         </CCardHeader>
        
//         <CCardBody>
//           <CTabContent>
//             <CTabPane visible={activeTab === 0} className="p-0">
//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={pendingSearchTerm}
//                     onChange={(e) => handlePendingSearch(e.target.value)}
                  
//                   />
//                   {pendingSearchTerm && (
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       className="action-btn ms-2"
//                       onClick={handleResetPendingSearch}
//                     >
//                       Reset
//                     </CButton>
//                   )}
//                 </div>
//               </div>
              
//               <div className="responsive-table-wrapper">
//                 <CTable striped bordered hover className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//                       {canCreateFinancePayment && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredPendingBookings.length === 0 ? (
//                       <CTableRow>
//                         <CTableDataCell colSpan={canCreateFinancePayment ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
//                           {pendingSearchTerm ? 'No matching pending bookings found' : 'No pending bookings available'}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ) : (
//                       filteredPendingBookings.map((booking, index) => (
//                         <CTableRow key={index}>
//                           <CTableDataCell>{index + 1}</CTableDataCell>
//                           <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                           <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                           <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                           <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
//                           </CTableDataCell>
//                           {canCreateFinancePayment && (
//                             <CTableDataCell>
//                               <CButton 
//                                 size="sm" 
//                                 className="action-btn"
//                                 onClick={() => handleAddClick(booking)}
//                               >
//                                 <CIcon icon={cilPlus} className='icon'/> Add
//                               </CButton>
//                             </CTableDataCell>
//                           )}
//                         </CTableRow>
//                       ))
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </CTabPane>
            
//             <CTabPane visible={activeTab === 1} className="p-0">
//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={completedSearchTerm}
//                     onChange={(e) => handleCompletedSearch(e.target.value)}
                  
//                   />
//                   {completedSearchTerm && (
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       className="action-btn ms-2"
//                       onClick={handleResetCompletedSearch}
//                     >
//                       Reset
//                     </CButton>
//                   )}
//                 </div>
//               </div>
              
//               <div className="responsive-table-wrapper">
//                 <CTable striped bordered hover className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredCompletedBookings.length === 0 ? (
//                       <CTableRow>
//                         <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
//                           {completedSearchTerm ? 'No matching completed payments found' : 'No completed payments available'}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ) : (
//                       filteredCompletedBookings.map((booking, index) => (
//                         <CTableRow key={index}>
//                           <CTableDataCell>{index + 1}</CTableDataCell>
//                           <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                           <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                           <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                           <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
//     </div>
//   );
// }

// export default SubdealerReceipts;




// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CBadge
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields,useTableFilter } from 'src/utils/tableImports';
// import SubdealerReceiptModal from './SubdealerReceiptModel';
// import CIcon from '@coreui/icons-react';
// import { cilPlus} from '@coreui/icons';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage
// } from '../../../utils/modulePermissions';

// function SubdealerReceipts() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [allBookings, setAllBookings] = useState([]);
//   const [pendingSearchTerm, setPendingSearchTerm] = useState('');
//   const [completedSearchTerm, setCompletedSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const { permissions } = useAuth();
  
//   // Tab-level VIEW permission checks
//   const canViewPendingPaymentTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
//     ACTIONS.VIEW,
//     TABS.FINANCE_PAYMENT.PENDING_PAYMENT
//   );
  
//   const canViewCompletePaymentTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
//     ACTIONS.VIEW,
//     TABS.FINANCE_PAYMENT.COMPLETE_PAYMENT
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingPaymentTab || canViewCompletePaymentTab;

//   // Tab-level CREATE permission for PENDING PAYMENT tab
//   const canCreatePendingPayment = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
//     ACTIONS.CREATE,
//     TABS.FINANCE_PAYMENT.PENDING_PAYMENT
//   );

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingPaymentTab) visibleTabs.push(0);
//     if (canViewCompletePaymentTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingPaymentTab, canViewCompletePaymentTab, activeTab]);

//   const {
//     data: pendingBookingsData,
//     setData: setPendingBookingsData,
//     filteredData: filteredPendingBookings,
//     setFilteredData: setFilteredPendingBookings,
//     handleFilter: handlePendingBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: completedBookingsData,
//     setData: setCompletedBookingsData,
//     filteredData: filteredCompletedBookings,
//     setFilteredData: setFilteredCompletedBookings,
//     handleFilter: handleCompletedBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: ledgerData,
//     setData: setLedgerData,
//     filteredData: filteredLedger,
//     setFilteredData: setFilteredLedger,
//     handleFilter: handleLedgerFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Subdealer Receipts tabs');
//       return;
//     }
    
//     fetchData();
//   }, [canViewAnyTab]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings`);
//       const bookings = response.data.data.bookings.filter(
//         (booking) => booking.bookingType === 'SUBDEALER' && booking.payment.type === 'FINANCE'
//       );
//       setAllBookings(bookings);

//       const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
//       setPendingBookingsData(pendingBookings);
//       setFilteredPendingBookings(pendingBookings);

//       const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
//       setCompletedBookingsData(completedBookings);
//       setFilteredCompletedBookings(completedBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchLocationData();
//   }, []);

//   const fetchLocationData = async () => {
//     try {
//       const response = await axiosInstance.get(`/ledger/summary/branch`);
//       setLedgerData(response.data.data.byBranch);
//       setFilteredLedger(response.data.data.byBranch);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreatePendingPayment) {
//       showError('You do not have permission to add payments');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handlePendingSearch = (searchValue) => {
//     setPendingSearchTerm(searchValue);
//     handlePendingBookingsFilter(searchValue, getDefaultSearchFields('booking'));
//   };

//   const handleCompletedSearch = (searchValue) => {
//     setCompletedSearchTerm(searchValue);
//     handleCompletedBookingsFilter(searchValue, getDefaultSearchFields('booking'));
//   };

//   const handleTabChange = (tab) => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setPendingSearchTerm('');
//     setCompletedSearchTerm('');
//   };

//   const handleResetPendingSearch = () => {
//     setPendingSearchTerm('');
//     handlePendingBookingsFilter('', getDefaultSearchFields('booking'));
//   };

//   const handleResetCompletedSearch = () => {
//     setCompletedSearchTerm('');
//     handleCompletedBookingsFilter('', getDefaultSearchFields('booking'));
//   };

//   const renderPendingPaymentTab = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPendingPaymentTab) {
//       return (
//         <div className="text-center py-4">
//           <div className="alert alert-warning" role="alert">
//             You do not have permission to view the Pending Payment tab.
//           </div>
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
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//               {canCreatePendingPayment && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendingBookings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreatePendingPayment ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
//                   {pendingSearchTerm ? 'No matching pending bookings found' : 'No pending bookings available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendingBookings.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
//                   </CTableDataCell>
//                   {canCreatePendingPayment && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(booking)}
//                       >
//                         <CIcon icon={cilPlus} className='icon'/> Add
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

//   const renderCompletePaymentTab = () => {
//     // Check if user has permission to view this tab
//     if (!canViewCompletePaymentTab) {
//       return (
//         <div className="text-center py-4">
//           <div className="alert alert-warning" role="alert">
//             You do not have permission to view the Complete Payment tab.
//           </div>
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
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredCompletedBookings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
//                   {completedSearchTerm ? 'No matching completed payments found' : 'No completed payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredCompletedBookings.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any Subdealer Receipts tabs.
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
//       <div className='title'>Subdealer Receipts</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <CNav variant="tabs" className="mb-0 border-bottom">
//               {canViewPendingPaymentTab && (
//                 <CNavItem>
//                   <CNavLink
//                     active={activeTab === 0}
//                     onClick={() => handleTabChange(0)}
//                     style={{ 
//                       cursor: 'pointer',
//                       borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                       color: 'black',
//                       borderBottom: 'none'
//                     }}
//                   >
//                     Pending Payment
//                     <CBadge color="warning" className="ms-2">
//                       {pendingBookingsData.length}
//                     </CBadge>
//                     {!canCreatePendingPayment && (
//                       <span className="ms-1 text-muted small">(View Only)</span>
//                     )}
//                   </CNavLink>
//                 </CNavItem>
//               )}
//               {canViewCompletePaymentTab && (
//                 <CNavItem>
//                   <CNavLink
//                     active={activeTab === 1}
//                     onClick={() => handleTabChange(1)}
//                     style={{ 
//                       cursor: 'pointer',
//                       borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                       borderBottom: 'none',
//                       color: 'black'
//                     }}
//                   >
//                     Complete Payment
//                     <CBadge color="success" className="ms-2">
//                       {completedBookingsData.length}
//                     </CBadge>
//                   </CNavLink>
//                 </CNavItem>
//               )}
//             </CNav>
//           ) : (
//             <div className="alert alert-warning py-2 mb-0" role="alert">
//               You don't have permission to view any tabs in Subdealer Receipts.
//             </div>
//           )}
//         </CCardHeader>
        
//         <CCardBody>
//           <CTabContent>
//             {canViewPendingPaymentTab && (
//               <CTabPane visible={activeTab === 0} className="p-0">
//                 <div className="d-flex justify-content-between mb-3">
//                   <div></div>
//                   <div className='d-flex'>
//                     <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                       className="d-inline-block square-search"
//                       value={pendingSearchTerm}
//                       onChange={(e) => handlePendingSearch(e.target.value)}
//                       disabled={!canViewAnyTab}
//                     />
//                     {pendingSearchTerm && (
//                       <CButton 
//                         size="sm" 
//                         color="secondary" 
//                         className="action-btn ms-2"
//                         onClick={handleResetPendingSearch}
//                         disabled={!canViewAnyTab}
//                       >
//                         Reset
//                       </CButton>
//                     )}
//                   </div>
//                 </div>
                
//                 {renderPendingPaymentTab()}
//               </CTabPane>
//             )}
            
//             {canViewCompletePaymentTab && (
//               <CTabPane visible={activeTab === 1} className="p-0">
//                 <div className="d-flex justify-content-between mb-3">
//                   <div></div>
//                   <div className='d-flex'>
//                     <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                       className="d-inline-block square-search"
//                       value={completedSearchTerm}
//                       onChange={(e) => handleCompletedSearch(e.target.value)}
//                       disabled={!canViewAnyTab}
//                     />
//                     {completedSearchTerm && (
//                       <CButton 
//                         size="sm" 
//                         color="secondary" 
//                         className="action-btn ms-2"
//                         onClick={handleResetCompletedSearch}
//                         disabled={!canViewAnyTab}
//                       >
//                         Reset
//                       </CButton>
//                     )}
//                   </div>
//                 </div>
                
//                 {renderCompletePaymentTab()}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
//     </div>
//   );
// }

// export default SubdealerReceipts;








import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import '../../../css/table.css';
import '../../../css/form.css';
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields,useTableFilter } from 'src/utils/tableImports';
import SubdealerReceiptModal from './SubdealerReceiptModel';
import CIcon from '@coreui/icons-react';
import { cilPlus} from '@coreui/icons';
import { showError } from '../../../utils/sweetAlerts';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  canViewPage,
  canCreateInPage
} from '../../../utils/modulePermissions';

function SubdealerReceipts() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');
  const [completedSearchTerm, setCompletedSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const { permissions } = useAuth();
  
  // Tab-level VIEW permission checks
  const canViewPendingPaymentTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
    ACTIONS.VIEW,
    TABS.FINANCE_PAYMENT.PENDING_PAYMENT
  );
  
  const canViewCompletePaymentTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
    ACTIONS.VIEW,
    TABS.FINANCE_PAYMENT.COMPLETE_PAYMENT
  );
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPendingPaymentTab || canViewCompletePaymentTab;

  // Tab-level CREATE permission for PENDING PAYMENT tab
  const canCreatePendingPayment = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
    ACTIONS.CREATE,
    TABS.FINANCE_PAYMENT.PENDING_PAYMENT
  );

  // Adjust activeTab based on tab-level permissions
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewPendingPaymentTab) visibleTabs.push(0);
    if (canViewCompletePaymentTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingPaymentTab, canViewCompletePaymentTab, activeTab]);

  const {
    data: pendingBookingsData,
    setData: setPendingBookingsData,
    filteredData: filteredPendingBookings,
    setFilteredData: setFilteredPendingBookings,
    handleFilter: handlePendingBookingsFilter
  } = useTableFilter([]);

  const {
    data: completedBookingsData,
    setData: setCompletedBookingsData,
    filteredData: filteredCompletedBookings,
    setFilteredData: setFilteredCompletedBookings,
    handleFilter: handleCompletedBookingsFilter
  } = useTableFilter([]);

  const {
    data: ledgerData,
    setData: setLedgerData,
    filteredData: filteredLedger,
    setFilteredData: setFilteredLedger,
    handleFilter: handleLedgerFilter
  } = useTableFilter([]);

  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Subdealer Receipts tabs');
      return;
    }
    
    fetchData();
  }, [canViewAnyTab]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      const bookings = response.data.data.bookings.filter(
        (booking) => booking.bookingType === 'SUBDEALER' && booking.payment.type === 'FINANCE'
      );
      setAllBookings(bookings);

      const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
      setPendingBookingsData(pendingBookings);
      setFilteredPendingBookings(pendingBookings);

      const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
      setCompletedBookingsData(completedBookings);
      setFilteredCompletedBookings(completedBookings);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  useEffect(() => {
    if (!canViewAnyTab) return;
    fetchLocationData();
  }, [canViewAnyTab]);

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/ledger/summary/branch`);
      setLedgerData(response.data.data.byBranch);
      setFilteredLedger(response.data.data.byBranch);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleAddClick = (booking) => {
    // Check CREATE permission in PENDING PAYMENT tab
    if (!canCreatePendingPayment) {
      showError('You do not have permission to add payments in PENDING PAYMENT tab');
      return;
    }
    
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handlePendingSearch = (searchValue) => {
    setPendingSearchTerm(searchValue);
    handlePendingBookingsFilter(searchValue, getDefaultSearchFields('booking'));
  };

  const handleCompletedSearch = (searchValue) => {
    setCompletedSearchTerm(searchValue);
    handleCompletedBookingsFilter(searchValue, getDefaultSearchFields('booking'));
  };

  const handleTabChange = (tab) => {
    if (!canViewAnyTab) {
      return;
    }
    
    setActiveTab(tab);
    setPendingSearchTerm('');
    setCompletedSearchTerm('');
  };

  const handleResetPendingSearch = () => {
    setPendingSearchTerm('');
    handlePendingBookingsFilter('', getDefaultSearchFields('booking'));
  };

  const handleResetCompletedSearch = () => {
    setCompletedSearchTerm('');
    handleCompletedBookingsFilter('', getDefaultSearchFields('booking'));
  };

  const renderPendingPaymentTab = () => {
    // Check if user has permission to view this tab
    if (!canViewPendingPaymentTab) {
      return (
        <div className="text-center py-4">
          <div className="alert alert-warning" role="alert">
            You do not have permission to view the Pending Payment tab.
          </div>
        </div>
      );
    }

    // Check if user has CREATE permission for add action in this tab
    const canAddInThisTab = canCreatePendingPayment;

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
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Received</CTableHeaderCell>
              <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
              {canAddInThisTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendingBookings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canAddInThisTab ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
                  {pendingSearchTerm ? 'No matching pending bookings found' : 'No pending bookings available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendingBookings.map((booking, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                  <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
                  </CTableDataCell>
                  {canAddInThisTab && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleAddClick(booking)}
                      >
                        <CIcon icon={cilPlus} className='icon'/> Add
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderCompletePaymentTab = () => {
    // Check if user has permission to view this tab
    if (!canViewCompletePaymentTab) {
      return (
        <div className="text-center py-4">
          <div className="alert alert-warning" role="alert">
            You do not have permission to view the Complete Payment tab.
          </div>
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
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Received</CTableHeaderCell>
              <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredCompletedBookings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                  {completedSearchTerm ? 'No matching completed payments found' : 'No completed payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredCompletedBookings.map((booking, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                  <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any Subdealer Receipts tabs.
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
      <div className='title'>Subdealer Receipts</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          {/* Show tabs only if user has permission to view at least one */}
          {canViewAnyTab ? (
            <CNav variant="tabs" className="mb-0 border-bottom">
              {canViewPendingPaymentTab && (
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
                    Pending Payment
                    <CBadge color="warning" className="ms-2">
                      {pendingBookingsData.length}
                    </CBadge>
                    {!canCreatePendingPayment && (
                      <span className="ms-1 text-muted small">(View Only)</span>
                    )}
                  </CNavLink>
                </CNavItem>
              )}
              {canViewCompletePaymentTab && (
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
                    Complete Payment
                    <CBadge color="success" className="ms-2">
                      {completedBookingsData.length}
                    </CBadge>
                  </CNavLink>
                </CNavItem>
              )}
            </CNav>
          ) : (
            <div className="alert alert-warning py-2 mb-0" role="alert">
              You don't have permission to view any tabs in Subdealer Receipts.
            </div>
          )}
        </CCardHeader>
        
        <CCardBody>
          <CTabContent>
            {canViewPendingPaymentTab && (
              <CTabPane visible={activeTab === 0} className="p-0">
                <div className="d-flex justify-content-between mb-3">
                  <div></div>
                  <div className='d-flex'>
                    <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                    <CFormInput
                      type="text"
                      style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                      className="d-inline-block square-search"
                      value={pendingSearchTerm}
                      onChange={(e) => handlePendingSearch(e.target.value)}
                      disabled={!canViewAnyTab}
                    />
                    {pendingSearchTerm && (
                      <CButton 
                        size="sm" 
                        color="secondary" 
                        className="action-btn ms-2"
                        onClick={handleResetPendingSearch}
                        disabled={!canViewAnyTab}
                      >
                        Reset
                      </CButton>
                    )}
                  </div>
                </div>
                
                {renderPendingPaymentTab()}
              </CTabPane>
            )}
            
            {canViewCompletePaymentTab && (
              <CTabPane visible={activeTab === 1} className="p-0">
                <div className="d-flex justify-content-between mb-3">
                  <div></div>
                  <div className='d-flex'>
                    <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                    <CFormInput
                      type="text"
                      style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                      className="d-inline-block square-search"
                      value={completedSearchTerm}
                      onChange={(e) => handleCompletedSearch(e.target.value)}
                      disabled={!canViewAnyTab}
                    />
                    {completedSearchTerm && (
                      <CButton 
                        size="sm" 
                        color="secondary" 
                        className="action-btn ms-2"
                        onClick={handleResetCompletedSearch}
                        disabled={!canViewAnyTab}
                      >
                        Reset
                      </CButton>
                    )}
                  </div>
                </div>
                
                {renderCompletePaymentTab()}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>

      <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
    </div>
  );
}

export default SubdealerReceipts;