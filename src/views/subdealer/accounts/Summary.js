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
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CBadge,
//   CCol,
//   CRow,
//   CButton
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { cilMagnifyingGlass } from '@coreui/icons';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage
// } from '../../../utils/modulePermissions';

// function Summary() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for Summary page under Subdealer Account module
//   const hasSummaryView = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.SUMMARY, 
//     ACTIONS.VIEW
//   );

//   // Using convenience function for cleaner code
//   const canViewSummary = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.SUMMARY);

//   const {
//     data: bookingsData,
//     setData: setBookingsData,
//     filteredData: filteredBookings,
//     setFilteredData: setFilteredBookings,
//     handleFilter: handleBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: subdealerData,
//     setData: setSubdealerData,
//     filteredData: filteredSubdealer,
//     setFilteredData: setFilteredSubdealer,
//     handleFilter: handleSubdealerFilter
//   } = useTableFilter([]);

//   const [completePayments, setCompletePayments] = useState([]);
//   const [filteredCompletePayments, setFilteredCompletePayments] = useState([]);

//   const [pendingPayments, setPendingPayments] = useState([]);
//   const [filteredPendingPayments, setFilteredPendingPayments] = useState([]);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     if (!canViewSummary) {
//       showError('You do not have permission to view Summary');
//       return;
//     }
    
//     fetchData();
//   }, [canViewSummary]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings`);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setBookingsData(subdealerBookings);
//       setFilteredBookings(subdealerBookings);

//       const complete = subdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0);
//       setCompletePayments(complete);
//       setFilteredCompletePayments(complete);

//       const pending = subdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0);
//       setPendingPayments(pending);
//       setFilteredPendingPayments(pending);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }    
//     }
//   };

//   useEffect(() => {
//     fetchSubdealerData();
//   }, []);

//   const fetchSubdealerData = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers/financials/all`);
//       setSubdealerData(response.data.data.subdealers);
//       setFilteredSubdealer(response.data.data.subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//     if (tab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
//     else if (tab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
//     else if (tab === 2) handleCompleteSearch('');
//     else if (tab === 3) handlePendingSearch('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
//     else if (activeTab === 2) handleCompleteSearch('');
//     else if (activeTab === 3) handlePendingSearch('');
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     if (activeTab === 0) {
//       handleBookingsFilter(searchValue, getDefaultSearchFields('booking'));
//     } else if (activeTab === 1) {
//       handleSubdealerFilter(searchValue, getDefaultSearchFields('subdealer'));
//     } else if (activeTab === 2) {
//       handleCompleteSearch(searchValue);
//     } else if (activeTab === 3) {
//       handlePendingSearch(searchValue);
//     }
//   };

//   const handleCompleteSearch = (searchValue) => {
//     const filtered = completePayments.filter(booking => 
//       getDefaultSearchFields('booking').some(field => {
//         const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
//         return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
//       })
//     );
//     setFilteredCompletePayments(filtered);
//   };

//   const handlePendingSearch = (searchValue) => {
//     const filtered = pendingPayments.filter(booking => 
//       getDefaultSearchFields('booking').some(field => {
//         const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
//         return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
//       })
//     );
//     setFilteredPendingPayments(filtered);
//   };

//   const getTotalSummary = () => {
//     const totalBookings = bookingsData.length;
//     const totalComplete = completePayments.length;
//     const totalPending = pendingPayments.length;
//     const totalSubdealers = subdealerData.length;

//     return { totalBookings, totalComplete, totalPending, totalSubdealers };
//   };

//   const summary = getTotalSummary();

//   if (!canViewSummary) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Summary.
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

//   const renderTable = () => {
//     switch (activeTab) {
//       case 0:
//         return (
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
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredBookings.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       {searchTerm ? 'No matching bookings found' : 'No bookings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredBookings.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={booking.balanceAmount === 0 ? 'success' : 'warning'}>
//                           ₹{booking.balanceAmount || '0'}
//                         </CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
//                   <CTableHeaderCell>Total Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Total Received</CTableHeaderCell>
//                   <CTableHeaderCell>Total Balance</CTableHeaderCell>
//                   <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredSubdealer.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="7" className="text-center">
//                       {searchTerm ? 'No matching subdealers found' : 'No subdealers available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredSubdealer.map((subdealer, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{subdealer.name}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="primary">{subdealer.financials?.bookingSummary?.totalBookings || '0'}</CBadge>
//                       </CTableDataCell>
//                       <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalBookingAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalReceivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="warning">₹{subdealer.financials?.bookingSummary?.totalBalanceAmount || '0'}</CBadge>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="info">₹{subdealer.financials?.onAccountSummary?.totalBalance || '0'}</CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       case 2:
//         return (
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
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredCompletePayments.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       {searchTerm ? 'No matching complete payments found' : 'No complete payments available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredCompletePayments.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       case 3:
//         return (
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
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredPendingPayments.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredPendingPayments.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <div className='title'>Summary Dashboard</div>
//       <CRow className="mb-4">
//         <CCol md={3}>
//           <CCard className="text-center bg-primary text-white">
//             <CCardBody>
//               <h4>{summary.totalBookings}</h4>
//               <p>Total Bookings</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center bg-success text-white">
//             <CCardBody>
//               <h4>{summary.totalComplete}</h4>
//               <p>Complete Payments</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center bg-warning text-white">
//             <CCardBody>
//               <h4>{summary.totalPending}</h4>
//               <p>Pending Payments</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center bg-info text-white">
//             <CCardBody>
//               <h4>{summary.totalSubdealers}</h4>
//               <p>Total Subdealers</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
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
//                 Customer
//                 <CBadge color="primary" className="ms-2">
//                   {bookingsData.length}
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
//                 Sub Dealer
//                 <CBadge color="info" className="ms-2">
//                   {subdealerData.length}
//                 </CBadge>
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 2}
//                 onClick={() => handleTabChange(2)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Complete Payment
//                 <CBadge color="success" className="ms-2">
//                   {completePayments.length}
//                 </CBadge>
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 3}
//                 onClick={() => handleTabChange(3)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Pending List
//                 <CBadge color="warning" className="ms-2">
//                   {pendingPayments.length}
//                 </CBadge>
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0} className="p-3">
//               {renderTable()}
//             </CTabPane>

//             <CTabPane visible={activeTab === 1} className="p-3">
//               {renderTable()}
//             </CTabPane>

//             <CTabPane visible={activeTab === 2} className="p-3">
//               {renderTable()}
//             </CTabPane>

//             <CTabPane visible={activeTab === 3} className="p-3">
//               {renderTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default Summary;




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
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CBadge,
//   CCol,
//   CRow,
//   CButton
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { cilMagnifyingGlass } from '@coreui/icons';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS, // Add TABS import
//   ACTIONS,
//   canViewPage
// } from '../../../utils/modulePermissions';

// function Summary() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for Summary page under Subdealer Account module
//   const canViewSummary = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.SUMMARY);

//   // Tab-level VIEW permission checks
//   const canViewCustomerTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_ACCOUNT,
//     PAGES.SUBDEALER_ACCOUNT.SUMMARY,
//     ACTIONS.VIEW,
//     TABS.SUMMARY.CUSTOMER // Assuming this constant exists in TABS
//   );
  
//   const canViewSubDealerTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_ACCOUNT,
//     PAGES.SUBDEALER_ACCOUNT.SUMMARY,
//     ACTIONS.VIEW,
//     TABS.SUMMARY.SUB_DEALER // Assuming this constant exists in TABS
//   );
  
//   const canViewCompletePaymentTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_ACCOUNT,
//     PAGES.SUBDEALER_ACCOUNT.SUMMARY,
//     ACTIONS.VIEW,
//     TABS.SUMMARY.COMPLETE_PAYMENT // Assuming this constant exists in TABS
//   );
  
//   const canViewPendingListTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_ACCOUNT,
//     PAGES.SUBDEALER_ACCOUNT.SUMMARY,
//     ACTIONS.VIEW,
//     TABS.SUMMARY.PENDING_LIST // Assuming this constant exists in TABS
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewCustomerTab) availableTabs.push(0);
//     if (canViewSubDealerTab) availableTabs.push(1);
//     if (canViewCompletePaymentTab) availableTabs.push(2);
//     if (canViewPendingListTab) availableTabs.push(3);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewCustomerTab, canViewSubDealerTab, canViewCompletePaymentTab, canViewPendingListTab, activeTab]);

//   const {
//     data: bookingsData,
//     setData: setBookingsData,
//     filteredData: filteredBookings,
//     setFilteredData: setFilteredBookings,
//     handleFilter: handleBookingsFilter
//   } = useTableFilter([]);

//   const {
//     data: subdealerData,
//     setData: setSubdealerData,
//     filteredData: filteredSubdealer,
//     setFilteredData: setFilteredSubdealer,
//     handleFilter: handleSubdealerFilter
//   } = useTableFilter([]);

//   const [completePayments, setCompletePayments] = useState([]);
//   const [filteredCompletePayments, setFilteredCompletePayments] = useState([]);

//   const [pendingPayments, setPendingPayments] = useState([]);
//   const [filteredPendingPayments, setFilteredPendingPayments] = useState([]);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     if (!canViewSummary) {
//       showError('You do not have permission to view Summary');
//       return;
//     }
    
//     fetchData();
//   }, [canViewSummary]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings`);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setBookingsData(subdealerBookings);
//       setFilteredBookings(subdealerBookings);

//       const complete = subdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0);
//       setCompletePayments(complete);
//       setFilteredCompletePayments(complete);

//       const pending = subdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0);
//       setPendingPayments(pending);
//       setFilteredPendingPayments(pending);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }    
//     }
//   };

//   useEffect(() => {
//     fetchSubdealerData();
//   }, []);

//   const fetchSubdealerData = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers/financials/all`);
//       setSubdealerData(response.data.data.subdealers);
//       setFilteredSubdealer(response.data.data.subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//     if (tab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
//     else if (tab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
//     else if (tab === 2) handleCompleteSearch('');
//     else if (tab === 3) handlePendingSearch('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
//     else if (activeTab === 2) handleCompleteSearch('');
//     else if (activeTab === 3) handlePendingSearch('');
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     if (activeTab === 0) {
//       handleBookingsFilter(searchValue, getDefaultSearchFields('booking'));
//     } else if (activeTab === 1) {
//       handleSubdealerFilter(searchValue, getDefaultSearchFields('subdealer'));
//     } else if (activeTab === 2) {
//       handleCompleteSearch(searchValue);
//     } else if (activeTab === 3) {
//       handlePendingSearch(searchValue);
//     }
//   };

//   const handleCompleteSearch = (searchValue) => {
//     const filtered = completePayments.filter(booking => 
//       getDefaultSearchFields('booking').some(field => {
//         const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
//         return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
//       })
//     );
//     setFilteredCompletePayments(filtered);
//   };

//   const handlePendingSearch = (searchValue) => {
//     const filtered = pendingPayments.filter(booking => 
//       getDefaultSearchFields('booking').some(field => {
//         const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
//         return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
//       })
//     );
//     setFilteredPendingPayments(filtered);
//   };

//   const getTotalSummary = () => {
//     const totalBookings = bookingsData.length;
//     const totalComplete = completePayments.length;
//     const totalPending = pendingPayments.length;
//     const totalSubdealers = subdealerData.length;

//     return { totalBookings, totalComplete, totalPending, totalSubdealers };
//   };

//   const summary = getTotalSummary();

//   if (!canViewSummary) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Summary.
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

//   const renderTable = () => {
//     switch (activeTab) {
//       case 0:
//         return (
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
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredBookings.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       {searchTerm ? 'No matching bookings found' : 'No bookings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredBookings.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={booking.balanceAmount === 0 ? 'success' : 'warning'}>
//                           ₹{booking.balanceAmount || '0'}
//                         </CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
//                   <CTableHeaderCell>Total Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Total Received</CTableHeaderCell>
//                   <CTableHeaderCell>Total Balance</CTableHeaderCell>
//                   <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredSubdealer.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="7" className="text-center">
//                       {searchTerm ? 'No matching subdealers found' : 'No subdealers available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredSubdealer.map((subdealer, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{subdealer.name}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="primary">{subdealer.financials?.bookingSummary?.totalBookings || '0'}</CBadge>
//                       </CTableDataCell>
//                       <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalBookingAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalReceivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="warning">₹{subdealer.financials?.bookingSummary?.totalBalanceAmount || '0'}</CBadge>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="info">₹{subdealer.financials?.onAccountSummary?.totalBalance || '0'}</CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       case 2:
//         return (
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
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredCompletePayments.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       {searchTerm ? 'No matching complete payments found' : 'No complete payments available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredCompletePayments.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       case 3:
//         return (
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
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredPendingPayments.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
//                       {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredPendingPayments.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <div className='title'>Summary Dashboard</div>
//       <CRow className="mb-4">
//         <CCol md={3}>
//           <CCard className="text-center bg-primary text-white">
//             <CCardBody>
//               <h4>{summary.totalBookings}</h4>
//               <p>Total Bookings</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center bg-success text-white">
//             <CCardBody>
//               <h4>{summary.totalComplete}</h4>
//               <p>Complete Payments</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center bg-warning text-white">
//             <CCardBody>
//               <h4>{summary.totalPending}</h4>
//               <p>Pending Payments</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center bg-info text-white">
//             <CCardBody>
//               <h4>{summary.totalSubdealers}</h4>
//               <p>Total Subdealers</p>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show Customer tab if user has VIEW permission for it */}
//             {canViewCustomerTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 0}
//                   onClick={() => handleTabChange(0)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                     color: 'black',
//                     borderBottom: 'none'
//                   }}
//                 >
//                   Customer
//                   <CBadge color="primary" className="ms-2">
//                     {bookingsData.length}
//                   </CBadge>
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Sub Dealer tab if user has VIEW permission for it */}
//             {canViewSubDealerTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 1}
//                   onClick={() => handleTabChange(1)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Sub Dealer
//                   <CBadge color="info" className="ms-2">
//                     {subdealerData.length}
//                   </CBadge>
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Complete Payment tab if user has VIEW permission for it */}
//             {canViewCompletePaymentTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 2}
//                   onClick={() => handleTabChange(2)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Complete Payment
//                   <CBadge color="success" className="ms-2">
//                     {completePayments.length}
//                   </CBadge>
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Pending List tab if user has VIEW permission for it */}
//             {canViewPendingListTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 3}
//                   onClick={() => handleTabChange(3)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Pending List
//                   <CBadge color="warning" className="ms-2">
//                     {pendingPayments.length}
//                   </CBadge>
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             {/* Only render Customer tab if user has VIEW permission for it */}
//             {canViewCustomerTab && (
//               <CTabPane visible={activeTab === 0} className="p-3">
//                 {renderTable()}
//               </CTabPane>
//             )}
//             {/* Only render Sub Dealer tab if user has VIEW permission for it */}
//             {canViewSubDealerTab && (
//               <CTabPane visible={activeTab === 1} className="p-3">
//                 {renderTable()}
//               </CTabPane>
//             )}
//             {/* Only render Complete Payment tab if user has VIEW permission for it */}
//             {canViewCompletePaymentTab && (
//               <CTabPane visible={activeTab === 2} className="p-3">
//                 {renderTable()}
//               </CTabPane>
//             )}
//             {/* Only render Pending List tab if user has VIEW permission for it */}
//             {canViewPendingListTab && (
//               <CTabPane visible={activeTab === 3} className="p-3">
//                 {renderTable()}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default Summary;







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
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CCol,
  CRow,
  CButton
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'src/utils/tableImports';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';
import { showError } from '../../../utils/sweetAlerts';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS, // Add TABS import
  ACTIONS,
  canViewPage
} from '../../../utils/modulePermissions';

function Summary() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: authUser } = useAuth();
  const permissions = authUser?.permissions || [];
  
  // Check if user is a subdealer
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  const userSubdealer = authUser?.subdealer;

  // Page-level permission checks for Summary page under Subdealer Account module
  const canViewSummary = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.SUMMARY);

  // Tab-level VIEW permission checks
  const canViewCustomerTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_ACCOUNT,
    PAGES.SUBDEALER_ACCOUNT.SUMMARY,
    ACTIONS.VIEW,
    TABS.SUMMARY.CUSTOMER // Assuming this constant exists in TABS
  );
  
  const canViewSubDealerTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_ACCOUNT,
    PAGES.SUBDEALER_ACCOUNT.SUMMARY,
    ACTIONS.VIEW,
    TABS.SUMMARY.SUB_DEALER // Assuming this constant exists in TABS
  );
  
  const canViewCompletePaymentTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_ACCOUNT,
    PAGES.SUBDEALER_ACCOUNT.SUMMARY,
    ACTIONS.VIEW,
    TABS.SUMMARY.COMPLETE_PAYMENT // Assuming this constant exists in TABS
  );
  
  const canViewPendingListTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_ACCOUNT,
    PAGES.SUBDEALER_ACCOUNT.SUMMARY,
    ACTIONS.VIEW,
    TABS.SUMMARY.PENDING_LIST // Assuming this constant exists in TABS
  );

  // Adjust activeTab when permissions change
  useEffect(() => {
    const availableTabs = [];
    if (canViewCustomerTab) availableTabs.push(0);
    if (canViewSubDealerTab) availableTabs.push(1);
    if (canViewCompletePaymentTab) availableTabs.push(2);
    if (canViewPendingListTab) availableTabs.push(3);
    
    // If current activeTab is not in availableTabs, switch to first available tab
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [canViewCustomerTab, canViewSubDealerTab, canViewCompletePaymentTab, canViewPendingListTab, activeTab]);

  const {
    data: bookingsData,
    setData: setBookingsData,
    filteredData: filteredBookings,
    setFilteredData: setFilteredBookings,
    handleFilter: handleBookingsFilter
  } = useTableFilter([]);

  const {
    data: subdealerData,
    setData: setSubdealerData,
    filteredData: filteredSubdealer,
    setFilteredData: setFilteredSubdealer,
    handleFilter: handleSubdealerFilter
  } = useTableFilter([]);

  const [completePayments, setCompletePayments] = useState([]);
  const [filteredCompletePayments, setFilteredCompletePayments] = useState([]);

  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPendingPayments, setFilteredPendingPayments] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!canViewSummary) {
      showError('You do not have permission to view Summary');
      return;
    }
    
    fetchData();
  }, [canViewSummary]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      let allSubdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

      // Filter bookings by subdealer if user is a subdealer
      if (isSubdealer && userSubdealer) {
        allSubdealerBookings = allSubdealerBookings.filter((booking) => 
          booking.subdealer?._id === userSubdealer._id || booking.subdealer?.id === userSubdealer._id
        );
      }

      setBookingsData(allSubdealerBookings);
      setFilteredBookings(allSubdealerBookings);

      const complete = allSubdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0);
      setCompletePayments(complete);
      setFilteredCompletePayments(complete);

      const pending = allSubdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0);
      setPendingPayments(pending);
      setFilteredPendingPayments(pending);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }    
    }
  };

  useEffect(() => {
    fetchSubdealerData();
  }, []);

  const fetchSubdealerData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers/financials/all`);
      let allSubdealers = response.data.data.subdealers || [];
      
      // Filter subdealers by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealer) {
        allSubdealers = allSubdealers.filter(subdealer => 
          subdealer._id === userSubdealer._id || subdealer.id === userSubdealer._id
        );
      }
      
      setSubdealerData(allSubdealers);
      setFilteredSubdealer(allSubdealers);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    if (tab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
    else if (tab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
    else if (tab === 2) handleCompleteSearch('');
    else if (tab === 3) handlePendingSearch('');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    if (activeTab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
    else if (activeTab === 2) handleCompleteSearch('');
    else if (activeTab === 3) handlePendingSearch('');
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (activeTab === 0) {
      handleBookingsFilter(searchValue, getDefaultSearchFields('booking'));
    } else if (activeTab === 1) {
      handleSubdealerFilter(searchValue, getDefaultSearchFields('subdealer'));
    } else if (activeTab === 2) {
      handleCompleteSearch(searchValue);
    } else if (activeTab === 3) {
      handlePendingSearch(searchValue);
    }
  };

  const handleCompleteSearch = (searchValue) => {
    const filtered = completePayments.filter(booking => 
      getDefaultSearchFields('booking').some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
        return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
      })
    );
    setFilteredCompletePayments(filtered);
  };

  const handlePendingSearch = (searchValue) => {
    const filtered = pendingPayments.filter(booking => 
      getDefaultSearchFields('booking').some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
        return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
      })
    );
    setFilteredPendingPayments(filtered);
  };

  const getTotalSummary = () => {
    const totalBookings = bookingsData.length;
    const totalComplete = completePayments.length;
    const totalPending = pendingPayments.length;
    const totalSubdealers = subdealerData.length;

    return { totalBookings, totalComplete, totalPending, totalSubdealers };
  };

  const summary = getTotalSummary();

  if (!canViewSummary) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Summary.
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

  const renderTable = () => {
    switch (activeTab) {
      case 0:
        return (
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredBookings.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {isSubdealer 
                        ? (searchTerm ? 'No matching bookings found for your account' : 'No bookings available for your account') 
                        : (searchTerm ? 'No matching bookings found' : 'No bookings available')}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredBookings.map((booking, index) => (
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
                        <CBadge color={booking.balanceAmount === 0 ? 'success' : 'warning'}>
                          ₹{booking.balanceAmount || '0'}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      case 1:
        return (
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Total Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Total Received</CTableHeaderCell>
                  <CTableHeaderCell>Total Balance</CTableHeaderCell>
                  <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredSubdealer.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      {isSubdealer 
                        ? (searchTerm ? 'No matching data found for your account' : 'No financial data available for your account') 
                        : (searchTerm ? 'No matching subdealers found' : 'No subdealers available')}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredSubdealer.map((subdealer, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{subdealer.name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{subdealer.financials?.bookingSummary?.totalBookings || '0'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalBookingAmount || '0'}</CTableDataCell>
                      <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalReceivedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">₹{subdealer.financials?.bookingSummary?.totalBalanceAmount || '0'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">₹{subdealer.financials?.onAccountSummary?.totalBalance || '0'}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      case 2:
        return (
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredCompletePayments.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {isSubdealer 
                        ? (searchTerm ? 'No matching complete payments found for your account' : 'No complete payments available for your account') 
                        : (searchTerm ? 'No matching complete payments found' : 'No complete payments available')}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredCompletePayments.map((booking, index) => (
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

      case 3:
        return (
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredPendingPayments.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {isSubdealer 
                        ? (searchTerm ? 'No matching pending payments found for your account' : 'No pending payments available for your account') 
                        : (searchTerm ? 'No matching pending payments found' : 'No pending payments available')}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredPendingPayments.map((booking, index) => (
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
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className='title'>Summary Dashboard</div>
     
      
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="text-center bg-primary text-white">
            <CCardBody>
              <h4>{summary.totalBookings}</h4>
              <p>Total Bookings</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center bg-success text-white">
            <CCardBody>
              <h4>{summary.totalComplete}</h4>
              <p>Complete Payments</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center bg-warning text-white">
            <CCardBody>
              <h4>{summary.totalPending}</h4>
              <p>Pending Payments</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center bg-info text-white">
            <CCardBody>
              <h4>{summary.totalSubdealers}</h4>
              <p>Total Subdealers</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {searchTerm && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                Reset Search
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            {/* Only show Customer tab if user has VIEW permission for it */}
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
                  <CBadge color="primary" className="ms-2">
                    {bookingsData.length}
                  </CBadge>
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Sub Dealer tab if user has VIEW permission for it */}
            {canViewSubDealerTab && (
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
                  Sub Dealer
                  <CBadge color="info" className="ms-2">
                    {subdealerData.length}
                  </CBadge>
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Complete Payment tab if user has VIEW permission for it */}
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
                  <CBadge color="success" className="ms-2">
                    {completePayments.length}
                  </CBadge>
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Pending List tab if user has VIEW permission for it */}
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
                  <CBadge color="warning" className="ms-2">
                    {pendingPayments.length}
                  </CBadge>
                </CNavLink>
              </CNavItem>
            )}
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <CTabContent>
            {/* Only render Customer tab if user has VIEW permission for it */}
            {canViewCustomerTab && (
              <CTabPane visible={activeTab === 0} className="p-3">
                {renderTable()}
              </CTabPane>
            )}
            {/* Only render Sub Dealer tab if user has VIEW permission for it */}
            {canViewSubDealerTab && (
              <CTabPane visible={activeTab === 1} className="p-3">
                {renderTable()}
              </CTabPane>
            )}
            {/* Only render Complete Payment tab if user has VIEW permission for it */}
            {canViewCompletePaymentTab && (
              <CTabPane visible={activeTab === 2} className="p-3">
                {renderTable()}
              </CTabPane>
            )}
            {/* Only render Pending List tab if user has VIEW permission for it */}
            {canViewPendingListTab && (
              <CTabPane visible={activeTab === 3} className="p-3">
                {renderTable()}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Summary;