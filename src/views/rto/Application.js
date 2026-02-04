// import React, { useState, useEffect } from 'react';
// import { 
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
//   CCardHeader,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import UpdateRTO from './UpdateRTO';
// import DeviationModal from './DeviationModal';
// import CIcon from '@coreui/icons-react';
// import { cilPencil, cilDollar } from '@coreui/icons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function Application() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeviationModal, setShowDeviationModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for Application page under RTO module
//   const canViewApplication = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION
//   );
  
//   const canCreateInApplication = canCreateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION
//   );
  
//   const canUpdateInApplication = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION
//   );

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   const fetchData = async () => {
//     if (!canViewApplication) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings/pfbookings`);
//       setPendingData(response.data.data);
//       setFilteredPendings(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewApplication) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/application-numbers`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchLocationData();
//   }, [refreshKey, canViewApplication]);

//   const handleAddClick = (booking) => {
//     if (!canUpdateInApplication) {
//       showError('You do not have permission to update RTO applications');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleDeviationClick = () => {
//     if (!canCreateInApplication) {
//       showError('You do not have permission to add deviation');
//       return;
//     }
    
//     setShowDeviationModal(true);
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     handleRefresh();
//   };

//   const handleDeviationModalClose = () => {
//     setShowDeviationModal(false);
//     handleRefresh();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const renderPendingTable = () => {
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
//               <CTableHeaderCell scope="col">Line Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//               {canUpdateInApplication && (
//                 <CTableHeaderCell scope="col" className="text-center">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canUpdateInApplication ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                   <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.discountedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>{booking.receivedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>{booking.balanceAmount || '0'}</CTableDataCell>
//                   {canUpdateInApplication && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(booking)}
//                       >
//                         <CIcon icon={cilPencil} className="me-1" />
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

//   const renderAppliedTable = () => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO Application</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile}</CTableDataCell>
//                   <CTableDataCell>{item.applicationNumber}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   // Check if user has permission to view the page
//   if (!canViewApplication) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Application Management.
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
//       <div className='title'>RTO Application Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateInApplication && activeTab === 0 && (
//               <CButton
//                 size="sm" 
//                 color="info"
//                 className="action-btn"
//                 onClick={handleDeviationClick}
//               >
//                 <CIcon icon={cilDollar} className='icon' /> Add Deviation
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
//                 RTO PENDING
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
//                 APPLIED FOR
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderPendingTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderAppliedTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       <UpdateRTO 
//         show={showModal} 
//         onClose={handleModalClose} 
//         bookingData={selectedBooking} 
//         onSuccess={handleRefresh} 
//       />
      
//       <DeviationModal
//         show={showDeviationModal}
//         onClose={handleDeviationModalClose}
//         bookings={filteredPendings} 
//         onSuccess={handleRefresh}
//       />
//     </div>
//   );
// }

// export default Application;





// import React, { useState, useEffect } from 'react';
// import { 
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
//   CCardHeader,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import UpdateRTO from './UpdateRTO';
// import DeviationModal from './DeviationModal';
// import CIcon from '@coreui/icons-react';
// import { cilPencil, cilDollar } from '@coreui/icons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function Application() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeviationModal, setShowDeviationModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for Application page under RTO module
//   const canViewApplication = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION
//   );
  
//   const canCreateInApplication = canCreateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION
//   );
  
//   const canUpdateInApplication = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.APPLICATION,
//     ACTIONS.VIEW,
//     TABS.APPLICATION.RTO_PENDING
//   );
  
//   const canViewAppliedForTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.APPLICATION,
//     ACTIONS.VIEW,
//     TABS.APPLICATION.APPLIED_FOR
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewRtoPendingTab && activeTab === 0 && canViewAppliedForTab) {
//       // If RTO PENDING tab is hidden and activeTab is 0, switch to APPLIED FOR tab
//       setActiveTab(1);
//     }
//   }, [canViewRtoPendingTab, canViewAppliedForTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   const fetchData = async () => {
//     if (!canViewApplication) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings/pfbookings`);
//       setPendingData(response.data.data);
//       setFilteredPendings(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewApplication) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/application-numbers`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchLocationData();
//   }, [refreshKey, canViewApplication]);

//   const handleAddClick = (booking) => {
//     if (!canUpdateInApplication) {
//       showError('You do not have permission to update RTO applications');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleDeviationClick = () => {
//     if (!canCreateInApplication) {
//       showError('You do not have permission to add deviation');
//       return;
//     }
    
//     setShowDeviationModal(true);
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     handleRefresh();
//   };

//   const handleDeviationModalClose = () => {
//     setShowDeviationModal(false);
//     handleRefresh();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const renderPendingTable = () => {
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
//               <CTableHeaderCell scope="col">Line Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//               {canUpdateInApplication && (
//                 <CTableHeaderCell scope="col" className="text-center">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canUpdateInApplication ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                   <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.discountedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>{booking.receivedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>{booking.balanceAmount || '0'}</CTableDataCell>
//                   {canUpdateInApplication && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(booking)}
//                       >
//                         <CIcon icon={cilPencil} className="me-1" />
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

//   const renderAppliedTable = () => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO Application</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile}</CTableDataCell>
//                   <CTableDataCell>{item.applicationNumber}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   // Check if user has permission to view the page
//   if (!canViewApplication) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Application Management.
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
//       <div className='title'>RTO Application Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateInApplication && activeTab === 0 && (
//               <CButton
//                 size="sm" 
//                 color="info"
//                 className="action-btn"
//                 onClick={handleDeviationClick}
//               >
//                 <CIcon icon={cilDollar} className='icon' /> Add Deviation
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show RTO PENDING tab if user has VIEW permission for it */}
//             {canViewRtoPendingTab && (
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
//                   RTO PENDING
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show APPLIED FOR tab if user has VIEW permission for it */}
//             {canViewAppliedForTab && (
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
//                   APPLIED FOR
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderPendingTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderAppliedTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       <UpdateRTO 
//         show={showModal} 
//         onClose={handleModalClose} 
//         bookingData={selectedBooking} 
//         onSuccess={handleRefresh} 
//       />
      
//       <DeviationModal
//         show={showDeviationModal}
//         onClose={handleDeviationModalClose}
//         bookings={filteredPendings} 
//         onSuccess={handleRefresh}
//       />
//     </div>
//   );
// }

// export default Application;




// import React, { useState, useEffect } from 'react';
// import { 
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
//   CCardHeader,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import UpdateRTO from './UpdateRTO';
// import DeviationModal from './DeviationModal';
// import CIcon from '@coreui/icons-react';
// import { cilPencil, cilDollar } from '@coreui/icons';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function Application() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeviationModal, setShowDeviationModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level VIEW permission check for Application page
//   const canViewApplication = hasSafePagePermission(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.APPLICATION, 
//     ACTIONS.VIEW
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.APPLICATION,
//     ACTIONS.VIEW,
//     TABS.APPLICATION.RTO_PENDING
//   );
  
//   const canViewAppliedForTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.APPLICATION,
//     ACTIONS.VIEW,
//     TABS.APPLICATION.APPLIED_FOR
//   );
  
//   // Tab-level CREATE permission for RTO PENDING tab (for Edit button)
//   const canCreateInRtoPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.APPLICATION,
//     ACTIONS.CREATE,
//     TABS.APPLICATION.RTO_PENDING
//   );

//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewRtoPendingTab || canViewAppliedForTab;

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewRtoPendingTab) visibleTabs.push(0);
//     if (canViewAppliedForTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewRtoPendingTab, canViewAppliedForTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   const fetchData = async () => {
//     if (!canViewApplication) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings/pfbookings`);
//       setPendingData(response.data.data);
//       setFilteredPendings(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewApplication) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/application-numbers`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!canViewApplication) {
//       showError('You do not have permission to view RTO Application');
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [refreshKey, canViewApplication]);

//   const handleAddClick = (booking) => {
//     // Check ONLY CREATE permission for the RTO PENDING tab
//     if (!canCreateInRtoPendingTab) {
//       showError('You do not have permission to update RTO applications');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const handleDeviationClick = () => {
//     // Check for separate deviation permission (not tied to tab)
//     // Assuming deviation has its own permission in the system
//     const canAddDeviation = hasSafePagePermission(
//       permissions,
//       MODULES.RTO,
//       PAGES.RTO.APPLICATION,
//       ACTIONS.CREATE // Using CREATE for deviation
//       // Note: If deviation has separate permission, you might need to adjust this
//     );
    
//     if (!canAddDeviation) {
//       showError('You do not have permission to add deviation');
//       return;
//     }
    
//     setShowDeviationModal(true);
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     handleRefresh();
//   };

//   const handleDeviationModalClose = () => {
//     setShowDeviationModal(false);
//     handleRefresh();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewRtoPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the RTO PENDING tab.
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
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Line Total</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Received</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
//               {canCreateInRtoPendingTab && (
//                 <CTableHeaderCell scope="col" className="text-center">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreateInRtoPendingTab ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                   <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.discountedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>{booking.receivedAmount || '0'}</CTableDataCell>
//                   <CTableDataCell>{booking.balanceAmount || '0'}</CTableDataCell>
//                   {canCreateInRtoPendingTab && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(booking)}
//                       >
//                         <CIcon icon={cilPencil} className="me-1" />
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

//   const renderAppliedTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewAppliedForTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the APPLIED FOR tab.
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
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO Application</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile}</CTableDataCell>
//                   <CTableDataCell>{item.applicationNumber}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   // Check if user has permission to view the page
//   if (!canViewApplication) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Application Management.
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
//       <div className='title'>RTO Application Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {/* Add Deviation button - NOT tied to tab permission */}
//             {activeTab === 0 && (
//               <CButton
//                 size="sm" 
//                 color="info"
//                 className="action-btn"
//                 onClick={handleDeviationClick}
//               >
//                 <CIcon icon={cilDollar} className='icon' /> Add Deviation
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one tab */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewRtoPendingTab && (
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
//                       RTO PENDING
//                       {!canCreateInRtoPendingTab && canViewRtoPendingTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewAppliedForTab && (
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
//                       APPLIED FOR
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
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
//                     }}
//                     disabled={!canViewAnyTab}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewRtoPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewAppliedForTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderAppliedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in RTO Application.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       <UpdateRTO 
//         show={showModal} 
//         onClose={handleModalClose} 
//         bookingData={selectedBooking} 
//         onSuccess={handleRefresh} 
//       />
      
//       <DeviationModal
//         show={showDeviationModal}
//         onClose={handleDeviationModalClose}
//         bookings={filteredPendings} 
//         onSuccess={handleRefresh}
//       />
//     </div>
//   );
// }

// export default Application;







import React, { useState, useEffect } from 'react';
import { 
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
  CCardHeader,
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import UpdateRTO from './UpdateRTO';
import DeviationModal from './DeviationModal';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilDollar } from '@coreui/icons';

// Import the permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function Application() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeviationModal, setShowDeviationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions } = useAuth();

  // Page-level VIEW permission check for Application page
  const canViewApplication = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.APPLICATION, 
    ACTIONS.VIEW
  );

  // Tab-level VIEW permission checks
  const canViewRtoPendingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.APPLICATION,
    ACTIONS.VIEW,
    TABS.APPLICATION.RTO_PENDING
  );
  
  const canViewAppliedForTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.APPLICATION,
    ACTIONS.VIEW,
    TABS.APPLICATION.APPLIED_FOR
  );
  
  // Tab-level CREATE permission for RTO PENDING tab (for Edit button)
  const canCreateInRtoPendingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.APPLICATION,
    ACTIONS.CREATE,
    TABS.APPLICATION.RTO_PENDING
  );

  // Check if user can view at least one tab
  const canViewAnyTab = canViewRtoPendingTab || canViewAppliedForTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewRtoPendingTab) visibleTabs.push(0);
    if (canViewAppliedForTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewRtoPendingTab, canViewAppliedForTab, activeTab]);

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);

  const {
    data: approvedData,
    setData: setApprovedData,
    filteredData: filteredApproved,
    setFilteredData: setFilteredApproved,
    handleFilter: handleApprovedFilter
  } = useTableFilter([]);

  const fetchData = async () => {
    if (!canViewApplication) {
      setError('Permission denied');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings/pfbookings`);
      setPendingData(response.data.data);
      setFilteredPendings(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    if (!canViewApplication) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/rtoProcess/application-numbers`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  useEffect(() => {
    if (!canViewApplication) {
      showError('You do not have permission to view RTO Application');
      return;
    }
    
    fetchData();
    fetchLocationData();
  }, [refreshKey, canViewApplication]);

  const handleAddClick = (booking) => {
    // Check ONLY CREATE permission for the RTO PENDING tab
    if (!canCreateInRtoPendingTab) {
      showError('You do not have permission to update RTO applications');
      return;
    }
    
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeviationClick = () => {
    // Check for separate deviation permission (not tied to tab)
    // Assuming deviation has its own permission in the system
    const canAddDeviation = hasSafePagePermission(
      permissions,
      MODULES.RTO,
      PAGES.RTO.APPLICATION,
      ACTIONS.CREATE // Using CREATE for deviation
      // Note: If deviation has separate permission, you might need to adjust this
    );
    
    if (!canAddDeviation) {
      showError('You do not have permission to add deviation');
      return;
    }
    
    setShowDeviationModal(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setShowModal(false);
    handleRefresh();
  };

  const handleDeviationModalClose = () => {
    setShowDeviationModal(false);
    handleRefresh();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewRtoPendingTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the RTO PENDING tab.
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
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Line Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Received</CTableHeaderCell>
              <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
              {canCreateInRtoPendingTab && (
                <CTableHeaderCell scope="col" className="text-center">Action</CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canCreateInRtoPendingTab ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((booking, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                  <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                  <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
                  <CTableDataCell>{booking.discountedAmount || '0'}</CTableDataCell>
                  <CTableDataCell>{booking.receivedAmount || '0'}</CTableDataCell>
                  <CTableDataCell>
                    {(booking.balanceAmount || 0).toFixed(2)}
                  </CTableDataCell>
                  {canCreateInRtoPendingTab && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleAddClick(booking)}
                      >
                        <CIcon icon={cilPencil} className="me-1" />
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

  const renderAppliedTable = () => {
    // Check if user has permission to view this tab
    if (!canViewAppliedForTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the APPLIED FOR tab.
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
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
              <CTableHeaderCell scope="col">RTO Application</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredApproved.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredApproved.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile}</CTableDataCell>
                  <CTableDataCell>{item.applicationNumber}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  // Check if user has permission to view the page
  if (!canViewApplication) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view RTO Application Management.
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
      <div className='title'>RTO Application Management</div>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {/* Add Deviation button - NOT tied to tab permission */}
            {activeTab === 0 && (
              <CButton
                size="sm" 
                color="info"
                className="action-btn"
                onClick={handleDeviationClick}
              >
                <CIcon icon={cilDollar} className='icon' /> Add Deviation
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one tab */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewRtoPendingTab && (
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
                      RTO PENDING
                      {!canCreateInRtoPendingTab && canViewRtoPendingTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewAppliedForTab && (
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
                      APPLIED FOR
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
                      else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
                    }}
                    disabled={!canViewAnyTab}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewRtoPendingTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewAppliedForTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderAppliedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in RTO Application.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <UpdateRTO 
        show={showModal} 
        onClose={handleModalClose} 
        bookingData={selectedBooking} 
        onSuccess={handleRefresh} 
      />
      
      <DeviationModal
        show={showDeviationModal}
        onClose={handleDeviationModalClose}
        bookings={filteredPendings} 
        onSuccess={handleRefresh}
      />
    </div>
  );
}

export default Application;