// // import React, { useState, useEffect } from 'react';
// // import '../../../css/invoice.css';
// // import '../../../css/table.css';
// // import '../../../css/form.css';
// // import { 
// //   CNav, 
// //   CNavItem, 
// //   CNavLink, 
// //   CTabContent, 
// //   CTabPane,
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CButton,
// //   CFormInput,
// //   CFormLabel,
// //   CTable,
// //   CTableHead,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableBody,
// //   CTableDataCell,
// //   CBadge
// // } from '@coreui/react';
// // import { axiosInstance, getDefaultSearchFields,useTableFilter } from 'src/utils/tableImports';
// // import SubdealerReceiptModal from './SubdealerReceiptModel';
// // import CIcon from '@coreui/icons-react';
// // import { cilPlus} from '@coreui/icons';
// // import { showError } from '../../../utils/sweetAlerts';
// // import { useAuth } from '../../../context/AuthContext';
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   ACTIONS,
// //   canViewPage,
// //   canCreateInPage
// // } from '../../../utils/modulePermissions';

// // function SubdealerReceipts() {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const [allBookings, setAllBookings] = useState([]);
// //   const [pendingSearchTerm, setPendingSearchTerm] = useState('');
// //   const [completedSearchTerm, setCompletedSearchTerm] = useState('');
// //   const [error, setError] = useState(null);
// //   const { permissions } = useAuth();
  
// //   // Page-level permission checks for Finance Payment page under Subdealer Account module
// //   const hasFinancePaymentView = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
// //     ACTIONS.VIEW
// //   );
  
// //   const hasFinancePaymentCreate = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
// //     ACTIONS.CREATE
// //   );

// //   // Using convenience functions for cleaner code
// //   const canViewFinancePayment = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT);
// //   const canCreateFinancePayment = canCreateInPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT);

// //   const {
// //     data: pendingBookingsData,
// //     setData: setPendingBookingsData,
// //     filteredData: filteredPendingBookings,
// //     setFilteredData: setFilteredPendingBookings,
// //     handleFilter: handlePendingBookingsFilter
// //   } = useTableFilter([]);

// //   const {
// //     data: completedBookingsData,
// //     setData: setCompletedBookingsData,
// //     filteredData: filteredCompletedBookings,
// //     setFilteredData: setFilteredCompletedBookings,
// //     handleFilter: handleCompletedBookingsFilter
// //   } = useTableFilter([]);

// //   const {
// //     data: ledgerData,
// //     setData: setLedgerData,
// //     filteredData: filteredLedger,
// //     setFilteredData: setFilteredLedger,
// //     handleFilter: handleLedgerFilter
// //   } = useTableFilter([]);

// //   useEffect(() => {
// //     if (!canViewFinancePayment) {
// //       showError('You do not have permission to view Subdealer Receipts');
// //       return;
// //     }
    
// //     fetchData();
// //   }, [canViewFinancePayment]);

// //   const fetchData = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/bookings`);
// //       const bookings = response.data.data.bookings.filter(
// //         (booking) => booking.bookingType === 'SUBDEALER' && booking.payment.type === 'FINANCE'
// //       );
// //       setAllBookings(bookings);

// //       const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
// //       setPendingBookingsData(pendingBookings);
// //       setFilteredPendingBookings(pendingBookings);

// //       const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
// //       setCompletedBookingsData(completedBookings);
// //       setFilteredCompletedBookings(completedBookings);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     fetchLocationData();
// //   }, []);

// //   const fetchLocationData = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/ledger/summary/branch`);
// //       setLedgerData(response.data.data.byBranch);
// //       setFilteredLedger(response.data.data.byBranch);
// //     } catch (error) {
// //       console.log('Error fetching data', error);
// //     }
// //   };

// //   const handleAddClick = (booking) => {
// //     setSelectedBooking(booking);
// //     setShowModal(true);
// //   };

// //   const handlePendingSearch = (searchValue) => {
// //     setPendingSearchTerm(searchValue);
// //     handlePendingBookingsFilter(searchValue, getDefaultSearchFields('booking'));
// //   };

// //   const handleCompletedSearch = (searchValue) => {
// //     setCompletedSearchTerm(searchValue);
// //     handleCompletedBookingsFilter(searchValue, getDefaultSearchFields('booking'));
// //   };

// //   const handleTabChange = (tab) => {
// //     setActiveTab(tab);
// //     setPendingSearchTerm('');
// //     setCompletedSearchTerm('');
// //   };

// //   const handleResetPendingSearch = () => {
// //     setPendingSearchTerm('');
// //     handlePendingBookingsFilter('', getDefaultSearchFields('booking'));
// //   };

// //   const handleResetCompletedSearch = () => {
// //     setCompletedSearchTerm('');
// //     handleCompletedBookingsFilter('', getDefaultSearchFields('booking'));
// //   };

// //   if (!canViewFinancePayment) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Subdealer Receipts.
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         {error}
// //       </div>
// //     );
// //   }
  
// //   return (
// //     <div>
// //       <div className='title'>Subdealer Receipts</div>
    
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <CNav variant="tabs" className="mb-0 border-bottom">
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
// //               >
// //                 Pending Payment
// //                 <CBadge color="warning" className="ms-2">
// //                   {pendingBookingsData.length}
// //                 </CBadge>
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
// //               >
// //                 Complete Payment
// //                 <CBadge color="success" className="ms-2">
// //                   {completedBookingsData.length}
// //                 </CBadge>
// //               </CNavLink>
// //             </CNavItem>
// //           </CNav>
// //         </CCardHeader>
        
// //         <CCardBody>
// //           <CTabContent>
// //             <CTabPane visible={activeTab === 0} className="p-0">
// //               <div className="d-flex justify-content-between mb-3">
// //                 <div></div>
// //                 <div className='d-flex'>
// //                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //                   <CFormInput
// //                     type="text"
// //                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                     className="d-inline-block square-search"
// //                     value={pendingSearchTerm}
// //                     onChange={(e) => handlePendingSearch(e.target.value)}
                  
// //                   />
// //                   {pendingSearchTerm && (
// //                     <CButton 
// //                       size="sm" 
// //                       color="secondary" 
// //                       className="action-btn ms-2"
// //                       onClick={handleResetPendingSearch}
// //                     >
// //                       Reset
// //                     </CButton>
// //                   )}
// //                 </div>
// //               </div>
              
// //               <div className="responsive-table-wrapper">
// //                 <CTable striped bordered hover className='responsive-table'>
// //                   <CTableHead>
// //                     <CTableRow>
// //                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Total</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Received</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
// //                       {canCreateFinancePayment && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
// //                     </CTableRow>
// //                   </CTableHead>
// //                   <CTableBody>
// //                     {filteredPendingBookings.length === 0 ? (
// //                       <CTableRow>
// //                         <CTableDataCell colSpan={canCreateFinancePayment ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
// //                           {pendingSearchTerm ? 'No matching pending bookings found' : 'No pending bookings available'}
// //                         </CTableDataCell>
// //                       </CTableRow>
// //                     ) : (
// //                       filteredPendingBookings.map((booking, index) => (
// //                         <CTableRow key={index}>
// //                           <CTableDataCell>{index + 1}</CTableDataCell>
// //                           <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
// //                           <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
// //                           <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
// //                           <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
// //                           <CTableDataCell>
// //                             <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
// //                           </CTableDataCell>
// //                           {canCreateFinancePayment && (
// //                             <CTableDataCell>
// //                               <CButton 
// //                                 size="sm" 
// //                                 className="action-btn"
// //                                 onClick={() => handleAddClick(booking)}
// //                               >
// //                                 <CIcon icon={cilPlus} className='icon'/> Add
// //                               </CButton>
// //                             </CTableDataCell>
// //                           )}
// //                         </CTableRow>
// //                       ))
// //                     )}
// //                   </CTableBody>
// //                 </CTable>
// //               </div>
// //             </CTabPane>
            
// //             <CTabPane visible={activeTab === 1} className="p-0">
// //               <div className="d-flex justify-content-between mb-3">
// //                 <div></div>
// //                 <div className='d-flex'>
// //                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //                   <CFormInput
// //                     type="text"
// //                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                     className="d-inline-block square-search"
// //                     value={completedSearchTerm}
// //                     onChange={(e) => handleCompletedSearch(e.target.value)}
                  
// //                   />
// //                   {completedSearchTerm && (
// //                     <CButton 
// //                       size="sm" 
// //                       color="secondary" 
// //                       className="action-btn ms-2"
// //                       onClick={handleResetCompletedSearch}
// //                     >
// //                       Reset
// //                     </CButton>
// //                   )}
// //                 </div>
// //               </div>
              
// //               <div className="responsive-table-wrapper">
// //                 <CTable striped bordered hover className='responsive-table'>
// //                   <CTableHead>
// //                     <CTableRow>
// //                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Total</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Received</CTableHeaderCell>
// //                       <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
// //                     </CTableRow>
// //                   </CTableHead>
// //                   <CTableBody>
// //                     {filteredCompletedBookings.length === 0 ? (
// //                       <CTableRow>
// //                         <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
// //                           {completedSearchTerm ? 'No matching completed payments found' : 'No completed payments available'}
// //                         </CTableDataCell>
// //                       </CTableRow>
// //                     ) : (
// //                       filteredCompletedBookings.map((booking, index) => (
// //                         <CTableRow key={index}>
// //                           <CTableDataCell>{index + 1}</CTableDataCell>
// //                           <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
// //                           <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
// //                           <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
// //                           <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
// //                           <CTableDataCell>
// //                             <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
// //                           </CTableDataCell>
// //                         </CTableRow>
// //                       ))
// //                     )}
// //                   </CTableBody>
// //                 </CTable>
// //               </div>
// //             </CTabPane>
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>

// //       <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
// //     </div>
// //   );
// // }

// // export default SubdealerReceipts;




// // import React, { useState, useEffect } from 'react';
// // import '../../../css/invoice.css';
// // import '../../../css/table.css';
// // import '../../../css/form.css';
// // import { 
// //   CNav, 
// //   CNavItem, 
// //   CNavLink, 
// //   CTabContent, 
// //   CTabPane,
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CButton,
// //   CFormInput,
// //   CFormLabel,
// //   CTable,
// //   CTableHead,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableBody,
// //   CTableDataCell,
// //   CBadge
// // } from '@coreui/react';
// // import { axiosInstance, getDefaultSearchFields,useTableFilter } from 'src/utils/tableImports';
// // import SubdealerReceiptModal from './SubdealerReceiptModel';
// // import CIcon from '@coreui/icons-react';
// // import { cilPlus} from '@coreui/icons';
// // import { showError } from '../../../utils/sweetAlerts';
// // import { useAuth } from '../../../context/AuthContext';
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   TABS,
// //   ACTIONS,
// //   canViewPage,
// //   canCreateInPage
// // } from '../../../utils/modulePermissions';

// // function SubdealerReceipts() {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const [allBookings, setAllBookings] = useState([]);
// //   const [pendingSearchTerm, setPendingSearchTerm] = useState('');
// //   const [completedSearchTerm, setCompletedSearchTerm] = useState('');
// //   const [error, setError] = useState(null);
// //   const { permissions } = useAuth();
  
// //   // Tab-level VIEW permission checks
// //   const canViewPendingPaymentTab = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
// //     ACTIONS.VIEW,
// //     TABS.FINANCE_PAYMENT.PENDING_PAYMENT
// //   );
  
// //   const canViewCompletePaymentTab = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
// //     ACTIONS.VIEW,
// //     TABS.FINANCE_PAYMENT.COMPLETE_PAYMENT
// //   );
  
// //   // Check if user can view at least one tab
// //   const canViewAnyTab = canViewPendingPaymentTab || canViewCompletePaymentTab;

// //   // Tab-level CREATE permission for PENDING PAYMENT tab
// //   const canCreatePendingPayment = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
// //     ACTIONS.CREATE,
// //     TABS.FINANCE_PAYMENT.PENDING_PAYMENT
// //   );

// //   // Adjust activeTab based on tab-level permissions
// //   useEffect(() => {
// //     if (!canViewAnyTab) {
// //       return;
// //     }
    
// //     // If current active tab is hidden due to permissions, find first visible tab
// //     const visibleTabs = [];
// //     if (canViewPendingPaymentTab) visibleTabs.push(0);
// //     if (canViewCompletePaymentTab) visibleTabs.push(1);
    
// //     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
// //       setActiveTab(visibleTabs[0]);
// //     }
// //   }, [canViewAnyTab, canViewPendingPaymentTab, canViewCompletePaymentTab, activeTab]);

// //   const {
// //     data: pendingBookingsData,
// //     setData: setPendingBookingsData,
// //     filteredData: filteredPendingBookings,
// //     setFilteredData: setFilteredPendingBookings,
// //     handleFilter: handlePendingBookingsFilter
// //   } = useTableFilter([]);

// //   const {
// //     data: completedBookingsData,
// //     setData: setCompletedBookingsData,
// //     filteredData: filteredCompletedBookings,
// //     setFilteredData: setFilteredCompletedBookings,
// //     handleFilter: handleCompletedBookingsFilter
// //   } = useTableFilter([]);

// //   const {
// //     data: ledgerData,
// //     setData: setLedgerData,
// //     filteredData: filteredLedger,
// //     setFilteredData: setFilteredLedger,
// //     handleFilter: handleLedgerFilter
// //   } = useTableFilter([]);

// //   useEffect(() => {
// //     if (!canViewAnyTab) {
// //       showError('You do not have permission to view any Subdealer Receipts tabs');
// //       return;
// //     }
    
// //     fetchData();
// //   }, [canViewAnyTab]);

// //   const fetchData = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/bookings`);
// //       const bookings = response.data.data.bookings.filter(
// //         (booking) => booking.bookingType === 'SUBDEALER' && booking.payment.type === 'FINANCE'
// //       );
// //       setAllBookings(bookings);

// //       const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
// //       setPendingBookingsData(pendingBookings);
// //       setFilteredPendingBookings(pendingBookings);

// //       const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
// //       setCompletedBookingsData(completedBookings);
// //       setFilteredCompletedBookings(completedBookings);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     fetchLocationData();
// //   }, []);

// //   const fetchLocationData = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/ledger/summary/branch`);
// //       setLedgerData(response.data.data.byBranch);
// //       setFilteredLedger(response.data.data.byBranch);
// //     } catch (error) {
// //       console.log('Error fetching data', error);
// //     }
// //   };

// //   const handleAddClick = (booking) => {
// //     if (!canCreatePendingPayment) {
// //       showError('You do not have permission to add payments');
// //       return;
// //     }
    
// //     setSelectedBooking(booking);
// //     setShowModal(true);
// //   };

// //   const handlePendingSearch = (searchValue) => {
// //     setPendingSearchTerm(searchValue);
// //     handlePendingBookingsFilter(searchValue, getDefaultSearchFields('booking'));
// //   };

// //   const handleCompletedSearch = (searchValue) => {
// //     setCompletedSearchTerm(searchValue);
// //     handleCompletedBookingsFilter(searchValue, getDefaultSearchFields('booking'));
// //   };

// //   const handleTabChange = (tab) => {
// //     if (!canViewAnyTab) {
// //       return;
// //     }
    
// //     setActiveTab(tab);
// //     setPendingSearchTerm('');
// //     setCompletedSearchTerm('');
// //   };

// //   const handleResetPendingSearch = () => {
// //     setPendingSearchTerm('');
// //     handlePendingBookingsFilter('', getDefaultSearchFields('booking'));
// //   };

// //   const handleResetCompletedSearch = () => {
// //     setCompletedSearchTerm('');
// //     handleCompletedBookingsFilter('', getDefaultSearchFields('booking'));
// //   };

// //   const renderPendingPaymentTab = () => {
// //     // Check if user has permission to view this tab
// //     if (!canViewPendingPaymentTab) {
// //       return (
// //         <div className="text-center py-4">
// //           <div className="alert alert-warning" role="alert">
// //             You do not have permission to view the Pending Payment tab.
// //           </div>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Total</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
// //               {canCreatePendingPayment && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredPendingBookings.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canCreatePendingPayment ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
// //                   {pendingSearchTerm ? 'No matching pending bookings found' : 'No pending bookings available'}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredPendingBookings.map((booking, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
// //                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
// //                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
// //                   </CTableDataCell>
// //                   {canCreatePendingPayment && (
// //                     <CTableDataCell>
// //                       <CButton 
// //                         size="sm" 
// //                         className="action-btn"
// //                         onClick={() => handleAddClick(booking)}
// //                       >
// //                         <CIcon icon={cilPlus} className='icon'/> Add
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

// //   const renderCompletePaymentTab = () => {
// //     // Check if user has permission to view this tab
// //     if (!canViewCompletePaymentTab) {
// //       return (
// //         <div className="text-center py-4">
// //           <div className="alert alert-warning" role="alert">
// //             You do not have permission to view the Complete Payment tab.
// //           </div>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Total</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredCompletedBookings.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
// //                   {completedSearchTerm ? 'No matching completed payments found' : 'No completed payments available'}
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredCompletedBookings.map((booking, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
// //                   <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
// //                   <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
// //                   <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   if (!canViewAnyTab) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view any Subdealer Receipts tabs.
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         {error}
// //       </div>
// //     );
// //   }
  
// //   return (
// //     <div>
// //       <div className='title'>Subdealer Receipts</div>
    
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           {/* Show tabs only if user has permission to view at least one */}
// //           {canViewAnyTab ? (
// //             <CNav variant="tabs" className="mb-0 border-bottom">
// //               {canViewPendingPaymentTab && (
// //                 <CNavItem>
// //                   <CNavLink
// //                     active={activeTab === 0}
// //                     onClick={() => handleTabChange(0)}
// //                     style={{ 
// //                       cursor: 'pointer',
// //                       borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
// //                       color: 'black',
// //                       borderBottom: 'none'
// //                     }}
// //                   >
// //                     Pending Payment
// //                     <CBadge color="warning" className="ms-2">
// //                       {pendingBookingsData.length}
// //                     </CBadge>
// //                     {!canCreatePendingPayment && (
// //                       <span className="ms-1 text-muted small">(View Only)</span>
// //                     )}
// //                   </CNavLink>
// //                 </CNavItem>
// //               )}
// //               {canViewCompletePaymentTab && (
// //                 <CNavItem>
// //                   <CNavLink
// //                     active={activeTab === 1}
// //                     onClick={() => handleTabChange(1)}
// //                     style={{ 
// //                       cursor: 'pointer',
// //                       borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
// //                       borderBottom: 'none',
// //                       color: 'black'
// //                     }}
// //                   >
// //                     Complete Payment
// //                     <CBadge color="success" className="ms-2">
// //                       {completedBookingsData.length}
// //                     </CBadge>
// //                   </CNavLink>
// //                 </CNavItem>
// //               )}
// //             </CNav>
// //           ) : (
// //             <div className="alert alert-warning py-2 mb-0" role="alert">
// //               You don't have permission to view any tabs in Subdealer Receipts.
// //             </div>
// //           )}
// //         </CCardHeader>
        
// //         <CCardBody>
// //           <CTabContent>
// //             {canViewPendingPaymentTab && (
// //               <CTabPane visible={activeTab === 0} className="p-0">
// //                 <div className="d-flex justify-content-between mb-3">
// //                   <div></div>
// //                   <div className='d-flex'>
// //                     <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //                     <CFormInput
// //                       type="text"
// //                       style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                       className="d-inline-block square-search"
// //                       value={pendingSearchTerm}
// //                       onChange={(e) => handlePendingSearch(e.target.value)}
// //                       disabled={!canViewAnyTab}
// //                     />
// //                     {pendingSearchTerm && (
// //                       <CButton 
// //                         size="sm" 
// //                         color="secondary" 
// //                         className="action-btn ms-2"
// //                         onClick={handleResetPendingSearch}
// //                         disabled={!canViewAnyTab}
// //                       >
// //                         Reset
// //                       </CButton>
// //                     )}
// //                   </div>
// //                 </div>
                
// //                 {renderPendingPaymentTab()}
// //               </CTabPane>
// //             )}
            
// //             {canViewCompletePaymentTab && (
// //               <CTabPane visible={activeTab === 1} className="p-0">
// //                 <div className="d-flex justify-content-between mb-3">
// //                   <div></div>
// //                   <div className='d-flex'>
// //                     <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //                     <CFormInput
// //                       type="text"
// //                       style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                       className="d-inline-block square-search"
// //                       value={completedSearchTerm}
// //                       onChange={(e) => handleCompletedSearch(e.target.value)}
// //                       disabled={!canViewAnyTab}
// //                     />
// //                     {completedSearchTerm && (
// //                       <CButton 
// //                         size="sm" 
// //                         color="secondary" 
// //                         className="action-btn ms-2"
// //                         onClick={handleResetCompletedSearch}
// //                         disabled={!canViewAnyTab}
// //                       >
// //                         Reset
// //                       </CButton>
// //                     )}
// //                   </div>
// //                 </div>
                
// //                 {renderCompletePaymentTab()}
// //               </CTabPane>
// //             )}
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>

// //       <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
// //     </div>
// //   );
// // }

// // export default SubdealerReceipts;








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
//     if (!canViewAnyTab) return;
//     fetchLocationData();
//   }, [canViewAnyTab]);

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
//     // Check CREATE permission in PENDING PAYMENT tab
//     if (!canCreatePendingPayment) {
//       showError('You do not have permission to add payments in PENDING PAYMENT tab');
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

//     // Check if user has CREATE permission for add action in this tab
//     const canAddInThisTab = canCreatePendingPayment;

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
//               {canAddInThisTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendingBookings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canAddInThisTab ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
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
//                   {canAddInThisTab && (
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







import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import { axiosInstance } from 'src/utils/tableImports';
import SubdealerReceiptModal from './SubdealerReceiptModel';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { showError } from '../../../utils/sweetAlerts';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
} from '../../../utils/modulePermissions';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT = 50;

const emptyTabState = () => ({
  docs: [],
  total: 0,
  pages: 0,
  currentPage: 1,
  limit: DEFAULT_LIMIT,
  loading: false,
  search: ''
});

function SubdealerReceipts() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  const { permissions } = useAuth();

  // ── Separate local search state — NEVER tied to async tab state ──
  const [localSearch, setLocalSearch] = useState('');

  // Per-tab paginated state
  const [pendingTabState, setPendingTabState] = useState(emptyTabState);
  const [completedTabState, setCompletedTabState] = useState(emptyTabState);

  // Debounce timer ref
  const searchTimer = useRef(null);

  // ── Stable ref for the search input so it NEVER loses focus on re-render ──
  const searchInputRef = useRef(null);

  // ── Stable ref tracking the active tab (avoids stale closures in debounced handler) ──
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

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

  const canViewAnyTab = canViewPendingPaymentTab || canViewCompletePaymentTab;

  const canCreatePendingPayment = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT, 
    ACTIONS.CREATE,
    TABS.FINANCE_PAYMENT.PENDING_PAYMENT
  );

  // Helper to update pending tab state
  const setPendingTab = useCallback((updates) => {
    setPendingTabState(prev => ({ ...prev, ...updates }));
  }, []);

  // Helper to update completed tab state
  const setCompletedTab = useCallback((updates) => {
    setCompletedTabState(prev => ({ ...prev, ...updates }));
  }, []);

  // Fetch pending payments
  const fetchPendingPayments = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    setPendingTab({ loading: true });
    try {
      const trimmed = search ? search.trim() : '';
      const params = {
        bookingType: 'SUBDEALER',
        paymentType: 'FINANCE',
        balanceAmount: { $gt: 0 },
        page,
        limit
      };
      if (trimmed) {
        params.search = trimmed;
        params.searchFields = 'bookingNumber,customerDetails.name';
      }
      const response = await axiosInstance.get('/bookings', { params });
      const data = response.data.data;
      setPendingTab({
        docs: data.bookings || [],
        total: data.total || 0,
        pages: data.pages || 1,
        currentPage: page,
        limit,
        loading: false,
        search
      });
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      showError(err);
      setPendingTab({ loading: false, docs: [], total: 0, pages: 0 });
    }
  }, [setPendingTab]);

  // Fetch completed payments
  const fetchCompletedPayments = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    setCompletedTab({ loading: true });
    try {
      const trimmed = search ? search.trim() : '';
      const params = {
        bookingType: 'SUBDEALER',
        paymentType: 'FINANCE',
        balanceAmount: 0,
        page,
        limit
      };
      if (trimmed) {
        params.search = trimmed;
        params.searchFields = 'bookingNumber,customerDetails.name';
      }
      const response = await axiosInstance.get('/bookings', { params });
      const data = response.data.data;
      setCompletedTab({
        docs: data.bookings || [],
        total: data.total || 0,
        pages: data.pages || 1,
        currentPage: page,
        limit,
        loading: false,
        search
      });
    } catch (err) {
      console.error('Error fetching completed payments:', err);
      showError(err);
      setCompletedTab({ loading: false, docs: [], total: 0, pages: 0 });
    }
  }, [setCompletedTab]);

  // Initial data fetch
  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Subdealer Receipts tabs');
      return;
    }
    if (canViewPendingPaymentTab) fetchPendingPayments(1, DEFAULT_LIMIT, '');
    if (canViewCompletePaymentTab) fetchCompletedPayments(1, DEFAULT_LIMIT, '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Adjust activeTab based on permissions
  useEffect(() => {
    if (!canViewAnyTab) return;
    const visibleTabs = [];
    if (canViewPendingPaymentTab) visibleTabs.push(0);
    if (canViewCompletePaymentTab) visibleTabs.push(1);
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingPaymentTab, canViewCompletePaymentTab, activeTab]);

  // ── Search handler: uses activeTabRef + reads limit from state inside timeout
  //    so the callback identity is stable and never causes re-renders that lose focus ──
  const handleSearch = useCallback((value) => {
    setLocalSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const tab = activeTabRef.current;
      if (tab === 0 && canViewPendingPaymentTab) {
        setPendingTabState(prev => {
          fetchPendingPayments(1, prev.limit, value);
          return prev;
        });
      } else if (tab === 1 && canViewCompletePaymentTab) {
        setCompletedTabState(prev => {
          fetchCompletedPayments(1, prev.limit, value);
          return prev;
        });
      }
    }, 500);
  }, [canViewPendingPaymentTab, canViewCompletePaymentTab, fetchPendingPayments, fetchCompletedPayments]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    if (activeTabRef.current === 0 && canViewPendingPaymentTab) {
      setPendingTabState(prev => {
        if (newPage >= 1 && newPage <= prev.pages) {
          fetchPendingPayments(newPage, prev.limit, prev.search);
        }
        return prev;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTabRef.current === 1 && canViewCompletePaymentTab) {
      setCompletedTabState(prev => {
        if (newPage >= 1 && newPage <= prev.pages) {
          fetchCompletedPayments(newPage, prev.limit, prev.search);
        }
        return prev;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [canViewPendingPaymentTab, canViewCompletePaymentTab, fetchPendingPayments, fetchCompletedPayments]);

  // Handle rows per page change
  const handleLimitChange = useCallback((newLimit) => {
    const limit = parseInt(newLimit, 10);
    if (activeTabRef.current === 0 && canViewPendingPaymentTab) {
      setPendingTabState(prev => {
        fetchPendingPayments(1, limit, prev.search);
        return prev;
      });
    } else if (activeTabRef.current === 1 && canViewCompletePaymentTab) {
      setCompletedTabState(prev => {
        fetchCompletedPayments(1, limit, prev.search);
        return prev;
      });
    }
  }, [canViewPendingPaymentTab, canViewCompletePaymentTab, fetchPendingPayments, fetchCompletedPayments]);

  // Reset search
  const handleResetSearch = useCallback(() => {
    setLocalSearch('');
    if (searchInputRef.current) searchInputRef.current.value = '';
    if (activeTabRef.current === 0 && canViewPendingPaymentTab) {
      setPendingTabState(prev => {
        fetchPendingPayments(1, prev.limit, '');
        return prev;
      });
    } else if (activeTabRef.current === 1 && canViewCompletePaymentTab) {
      setCompletedTabState(prev => {
        fetchCompletedPayments(1, prev.limit, '');
        return prev;
      });
    }
  }, [canViewPendingPaymentTab, canViewCompletePaymentTab, fetchPendingPayments, fetchCompletedPayments]);

  // Tab change handler
  const handleTabChange = useCallback((tab) => {
    if (!canViewAnyTab) return;
    clearTimeout(searchTimer.current);
    setActiveTab(tab);
    setLocalSearch('');
    if (searchInputRef.current) searchInputRef.current.value = '';

    if (tab === 0 && canViewPendingPaymentTab) {
      setPendingTabState(prev => {
        setTimeout(() => fetchPendingPayments(1, prev.limit, ''), 0);
        return { ...prev, search: '' };
      });
    } else if (tab === 1 && canViewCompletePaymentTab) {
      setCompletedTabState(prev => {
        setTimeout(() => fetchCompletedPayments(1, prev.limit, ''), 0);
        return { ...prev, search: '' };
      });
    }
  }, [canViewAnyTab, canViewPendingPaymentTab, canViewCompletePaymentTab, fetchPendingPayments, fetchCompletedPayments]);

  const handleAddClick = (booking) => {
    if (!canCreatePendingPayment) {
      showError('You do not have permission to add payments in PENDING PAYMENT tab');
      return;
    }
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Render pagination
  const renderPagination = (tabState) => {
    const { currentPage, pages, total, limit, loading } = tabState;
    if (!total || total === 0) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    let sp = Math.max(1, currentPage - 2);
    let ep = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) ep = Math.min(5, pages);
    if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
    const pageNums = [];
    for (let i = sp; i <= ep; i++) pageNums.push(i);

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
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
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            {sp > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            {pageNums.map(p => (
              <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}
            {ep < pages && (
              <>
                {ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}
            <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const renderPendingPaymentTab = () => {
    if (!canViewPendingPaymentTab) {
      return (
        <div className="text-center py-4">
          <div className="alert alert-warning" role="alert">
            You do not have permission to view the Pending Payment tab.
          </div>
        </div>
      );
    }

    const { docs, loading, search, total } = pendingTabState;

    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
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
                {canCreatePendingPayment && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {docs.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={canCreatePendingPayment ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
                    {search ? 'No matching pending bookings found' : 'No pending bookings available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                docs.map((booking, index) => {
                  const globalIndex = (pendingTabState.currentPage - 1) * pendingTabState.limit + index + 1;
                  return (
                    <CTableRow key={booking._id || index}>
                      <CTableDataCell>{globalIndex}</CTableDataCell>
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
                      {canCreatePendingPayment && (
                        <CTableDataCell>
                          <CButton size="sm" className="action-btn" onClick={() => handleAddClick(booking)}>
                            <CIcon icon={cilPlus} className='icon' /> Add
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
        {renderPagination(pendingTabState)}
      </>
    );
  };

  const renderCompletePaymentTab = () => {
    if (!canViewCompletePaymentTab) {
      return (
        <div className="text-center py-4">
          <div className="alert alert-warning" role="alert">
            You do not have permission to view the Complete Payment tab.
          </div>
        </div>
      );
    }

    const { docs, loading, search } = completedTabState;

    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
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
              {docs.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                    {search ? 'No matching completed payments found' : 'No completed payments available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                docs.map((booking, index) => {
                  const globalIndex = (completedTabState.currentPage - 1) * completedTabState.limit + index + 1;
                  return (
                    <CTableRow key={booking._id || index}>
                      <CTableDataCell>{globalIndex}</CTableDataCell>
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
                  );
                })
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(completedTabState)}
      </>
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
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  const currentTabLoading = activeTab === 0 ? pendingTabState.loading : completedTabState.loading;

  return (
    <div>
      <div className='title'>Subdealer Receipts</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
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
                    <CBadge color="warning" className="ms-2">{pendingTabState.total}</CBadge>
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
                    <CBadge color="success" className="ms-2">{completedTabState.total}</CBadge>
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
          {/* Search Bar — uncontrolled input to prevent focus loss */}
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <input
                ref={searchInputRef}
                type="text"
                defaultValue=""
                style={{
                  maxWidth: '350px',
                  height: '30px',
                  borderRadius: '0',
                  border: '1px solid #ced4da',
                  padding: '0 8px',
                  outline: 'none',
                  fontSize: '14px'
                }}
                className="d-inline-block square-search"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by Booking ID or Customer Name..."
                autoComplete="off"
                disabled={currentTabLoading}
              />
              {localSearch && (
                <CButton
                  size="sm"
                  color="secondary"
                  className="action-btn ms-2"
                  onClick={handleResetSearch}
                  disabled={currentTabLoading}
                >
                  Reset
                </CButton>
              )}
            </div>
          </div>

          <CTabContent>
            {canViewPendingPaymentTab && (
              <CTabPane visible={activeTab === 0} className="p-0">
                {activeTab === 0 && renderPendingPaymentTab()}
              </CTabPane>
            )}
            {canViewCompletePaymentTab && (
              <CTabPane visible={activeTab === 1} className="p-0">
                {activeTab === 1 && renderCompletePaymentTab()}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>

      <SubdealerReceiptModal
        show={showModal}
        onClose={() => setShowModal(false)}
        bookingData={selectedBooking}
      />
    </div>
  );
}

export default SubdealerReceipts;