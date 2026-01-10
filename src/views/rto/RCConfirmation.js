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
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import UpdateRCConfirmation from './UpdateRCConfirmation';
// import CIcon from '@coreui/icons-react';
// import { cilPencil } from '@coreui/icons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canUpdateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function RCConfirmation() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for RC Confirmation page under RTO module
//   const canViewRCConfirmation = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RC_CONFIRMATION
//   );
  
//   const canUpdateRCConfirmation = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RC_CONFIRMATION
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

//   useEffect(() => {
//     if (!canViewRCConfirmation) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewRCConfirmation]);

//   const fetchData = async () => {
//     if (!canViewRCConfirmation) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/rcpending`);
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
//     if (!canViewRCConfirmation) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/rccompleted`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleAddClick = (rcRecord) => {
//     if (!canUpdateRCConfirmation) {
//       showError('You do not have permission to update RC confirmation');
//       return;
//     }
    
//     setSelectedBooking(rcRecord);
//     setShowModal(true);
//   };

//   const refreshAllData = () => {
//     fetchData();
//     fetchLocationData();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('rto'));
//     else handleApprovedFilter('', getDefaultSearchFields('rto'));
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
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO RC Confirmation</CTableHeaderCell>
//               {canUpdateRCConfirmation && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canUpdateRCConfirmation ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
//                       {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canUpdateRCConfirmation && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(item)}
//                       >
//                         <CIcon icon={cilPencil} className="me-1" />
//                         Update
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

//   const renderCompletedTable = () => {
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
//               <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO RC Confirmation</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {item.rcDispatchDate ? new Date(item.rcDispatchDate).toLocaleDateString('en-GB') : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
//                       {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
//                     </CBadge>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   // Check if user has permission to view the page
//   if (!canViewRCConfirmation) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RC Confirmation Management.
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
//       <div className='title'>RC Confirmation Management</div>
      
//       <CCard className='table-container mt-4'>
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
//                 RTO PENDING RC CONFIRMATION
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
//                 COMPLETED RC
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
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
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
//               {renderCompletedTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       <UpdateRCConfirmation
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         rcData={selectedBooking}
//         onUpdateSuccess={refreshAllData}
//       />
//     </div>
//   );
// }

// export default RCConfirmation;





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
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import UpdateRCConfirmation from './UpdateRCConfirmation';
// import CIcon from '@coreui/icons-react';
// import { cilPencil } from '@coreui/icons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canUpdateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function RCConfirmation() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for RC Confirmation page under RTO module
//   const canViewRCConfirmation = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RC_CONFIRMATION
//   );
  
//   const canUpdateRCConfirmation = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RC_CONFIRMATION
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPendingRCConfirmationTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RC_CONFIRMATION,
//     ACTIONS.VIEW,
//     TABS.RC_CONFIRMATION.RTO_PENDING_RC_CONFIRMATION
//   );
  
//   const canViewCompletedRCTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RC_CONFIRMATION,
//     ACTIONS.VIEW,
//     TABS.RC_CONFIRMATION.COMPLETED_RC
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewRtoPendingRCConfirmationTab && activeTab === 0 && canViewCompletedRCTab) {
//       // If RTO PENDING RC CONFIRMATION tab is hidden and activeTab is 0, switch to COMPLETED RC tab
//       setActiveTab(1);
//     }
//   }, [canViewRtoPendingRCConfirmationTab, canViewCompletedRCTab, activeTab]);

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

//   useEffect(() => {
//     if (!canViewRCConfirmation) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewRCConfirmation]);

//   const fetchData = async () => {
//     if (!canViewRCConfirmation) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/rcpending`);
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
//     if (!canViewRCConfirmation) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/rccompleted`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleAddClick = (rcRecord) => {
//     if (!canUpdateRCConfirmation) {
//       showError('You do not have permission to update RC confirmation');
//       return;
//     }
    
//     setSelectedBooking(rcRecord);
//     setShowModal(true);
//   };

//   const refreshAllData = () => {
//     fetchData();
//     fetchLocationData();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('rto'));
//     else handleApprovedFilter('', getDefaultSearchFields('rto'));
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
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO RC Confirmation</CTableHeaderCell>
//               {canUpdateRCConfirmation && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canUpdateRCConfirmation ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
//                       {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canUpdateRCConfirmation && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(item)}
//                       >
//                         <CIcon icon={cilPencil} className="me-1" />
//                         Update
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

//   const renderCompletedTable = () => {
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
//               <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO RC Confirmation</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {item.rcDispatchDate ? new Date(item.rcDispatchDate).toLocaleDateString('en-GB') : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
//                       {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
//                     </CBadge>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   // Check if user has permission to view the page
//   if (!canViewRCConfirmation) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RC Confirmation Management.
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
//       <div className='title'>RC Confirmation Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show RTO PENDING RC CONFIRMATION tab if user has VIEW permission for it */}
//             {canViewRtoPendingRCConfirmationTab && (
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
//                   RTO PENDING RC CONFIRMATION
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show COMPLETED RC tab if user has VIEW permission for it */}
//             {canViewCompletedRCTab && (
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
//                   COMPLETED RC
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
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
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
//               {renderCompletedTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       <UpdateRCConfirmation
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         rcData={selectedBooking}
//         onUpdateSuccess={refreshAllData}
//       />
//     </div>
//   );
// }

// export default RCConfirmation;






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
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import UpdateRCConfirmation from './UpdateRCConfirmation';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

// Import the new permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function RCConfirmation() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions } = useAuth();

  // Page-level VIEW permission check for RC Confirmation page
  const canViewRCConfirmation = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.RC_CONFIRMATION, 
    ACTIONS.VIEW
  );

  // Tab-level VIEW permission checks
  const canViewRtoPendingRCConfirmationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.VIEW,
    TABS.RC_CONFIRMATION.RTO_PENDING_RC_CONFIRMATION
  );
  
  const canViewCompletedRCTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.VIEW,
    TABS.RC_CONFIRMATION.COMPLETED_RC
  );
  
  // Tab-level CREATE permission for RTO PENDING RC CONFIRMATION tab (for Update/Create button)
  const canCreateInRtoPendingRCConfirmationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.CREATE,
    TABS.RC_CONFIRMATION.RTO_PENDING_RC_CONFIRMATION
  );
  
  // Tab-level UPDATE permission for RTO PENDING RC CONFIRMATION tab
  const canUpdateInRtoPendingRCConfirmationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.UPDATE,
    TABS.RC_CONFIRMATION.RTO_PENDING_RC_CONFIRMATION
  );
  
  // Tab-level CREATE permission for COMPLETED RC tab
  const canCreateInCompletedRCTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.CREATE,
    TABS.RC_CONFIRMATION.COMPLETED_RC
  );
  
  // Tab-level UPDATE permission for COMPLETED RC tab
  const canUpdateInCompletedRCTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.UPDATE,
    TABS.RC_CONFIRMATION.COMPLETED_RC
  );
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewRtoPendingRCConfirmationTab || canViewCompletedRCTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewRtoPendingRCConfirmationTab) visibleTabs.push(0);
    if (canViewCompletedRCTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewRtoPendingRCConfirmationTab, canViewCompletedRCTab, activeTab]);

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

  useEffect(() => {
    if (!canViewRCConfirmation) {
      showError('You do not have permission to view RC Confirmation');
      setLoading(false);
      return;
    }
    
    fetchData();
    fetchLocationData();
  }, [canViewRCConfirmation]);

  const fetchData = async () => {
    if (!canViewRCConfirmation) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/rtoProcess/rcpending`);
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
    if (!canViewRCConfirmation) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/rtoProcess/rccompleted`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleAddClick = (rcRecord) => {
    // Check CREATE permission for the RTO PENDING RC CONFIRMATION tab
    // Since this is likely creating a new RC confirmation record
    if (!canCreateInRtoPendingRCConfirmationTab) {
      showError('You do not have permission to create/update RC confirmation');
      return;
    }
    
    setSelectedBooking(rcRecord);
    setShowModal(true);
  };

  const refreshAllData = () => {
    fetchData();
    fetchLocationData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('rto'));
    else handleApprovedFilter('', getDefaultSearchFields('rto'));
  };

  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewRtoPendingRCConfirmationTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the RTO PENDING RC CONFIRMATION tab.
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
              <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">RTO RC Confirmation</CTableHeaderCell>
              {canCreateInRtoPendingRCConfirmationTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canCreateInRtoPendingRCConfirmationTab ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
                      {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
                    </CBadge>
                  </CTableDataCell>
                  {canCreateInRtoPendingRCConfirmationTab && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleAddClick(item)}
                      >
                        <CIcon icon={cilPencil} className="me-1" />
                        Update
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

  const renderCompletedTable = () => {
    // Check if user has permission to view this tab
    if (!canViewCompletedRCTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the COMPLETED RC tab.
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
              <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">RTO RC Confirmation</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredApproved.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredApproved.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {item.rcDispatchDate ? new Date(item.rcDispatchDate).toLocaleDateString('en-GB') : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.rcConfirmation === false ? 'danger' : 'success'} shape="rounded-pill">
                      {item.rcConfirmation === false ? 'PENDING' : 'CONFIRMED'}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  // Check if user has permission to view the page
  if (!canViewRCConfirmation) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view RC Confirmation Management.
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
      <div className='title'>RC Confirmation Management</div>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one tab */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewRtoPendingRCConfirmationTab && (
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
                      RTO PENDING RC CONFIRMATION
                      {!canCreateInRtoPendingRCConfirmationTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletedRCTab && (
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
                      COMPLETED RC
                      {!canCreateInCompletedRCTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
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
                      if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
                      else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
                    }}
                    disabled={!canViewAnyTab}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewRtoPendingRCConfirmationTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewCompletedRCTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderCompletedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in RC Confirmation.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <UpdateRCConfirmation
        show={showModal}
        onClose={() => setShowModal(false)}
        rcData={selectedBooking}
        onUpdateSuccess={refreshAllData}
      />
    </div>
  );
}

export default RCConfirmation;