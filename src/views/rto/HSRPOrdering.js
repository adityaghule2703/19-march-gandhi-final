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
// import { axiosInstance, getDefaultSearchFields, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import { confirmVerify, showError, showSuccess } from '../../utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle } from '@coreui/icons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canUpdateInPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function HSRPOrdering() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for HSRP Ordering page under RTO module
//   const canViewHSRPOrdering = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_ORDERING
//   );
  
//   const canUpdateHSRPOrdering = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_ORDERING
//   );

//   const canCreateHSRPOrdering = canCreateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_ORDERING
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
//     if (!canViewHSRPOrdering) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewHSRPOrdering]);

//   const fetchData = async () => {
//     if (!canViewHSRPOrdering) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/hsrporderedpending`);
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
//     if (!canViewHSRPOrdering) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/hsrpordered`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleVerify = async (item) => {
//     if (!canCreateHSRPOrdering) {
//       showError('You do not have permission to verify HSRP Ordering');
//       return;
//     }
    
//     try {
//       const result = await confirmVerify();

//       if (result.isConfirmed) {
//         await axiosInstance.patch(`/rtoProcess/${item._id}`, {
//           hsrbOrdering: true
//         });
//         await fetchData();
//         await fetchLocationData();

//         await showSuccess('HSRP Ordering verified successfully!');
//       }
//     } catch (error) {
//       console.error('Error verifying HSRP Ordering:', error);
//       showError(error, 'Failed to verify HSRP Ordering');
//     }
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
//               <CTableHeaderCell scope="col">RTO Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Number Plate</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
//               {canCreateHSRPOrdering && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreateHSRPOrdering ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.rtoAmount || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.numberPlate || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   {canCreateHSRPOrdering && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerify(item)}
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         Verify
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
//               <CTableHeaderCell scope="col">RTO HSRP Ordering</CTableHeaderCell>
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
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.hsrbOrdering ? 'success' : 'warning'} shape="rounded-pill">
//                       {item.hsrbOrdering ? 'ORDERED' : 'PENDING'}
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
//   if (!canViewHSRPOrdering) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view HSRP Ordering Management.
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
//       <div className='title'>HSRP Ordering Management</div>
      
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
//                 RTO PENDING HSRP ORDERING
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
//                 COMPLETED HSRP ORDERING
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
//     </div>
//   );
// }

// export default HSRPOrdering;





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
// import { axiosInstance, getDefaultSearchFields, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import { confirmVerify, showError, showSuccess } from '../../utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle } from '@coreui/icons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canUpdateInPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function HSRPOrdering() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for HSRP Ordering page under RTO module
//   const canViewHSRPOrdering = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_ORDERING
//   );
  
//   const canUpdateHSRPOrdering = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_ORDERING
//   );

//   const canCreateHSRPOrdering = canCreateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_ORDERING
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPendingHSRPOrderingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.HSRP_ORDERING,
//     ACTIONS.VIEW,
//     TABS.HSRP_ORDERING.RTO_PENDING_HSRP_ORDERING
//   );
  
//   const canViewCompletedHSRPOrderingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.HSRP_ORDERING,
//     ACTIONS.VIEW,
//     TABS.HSRP_ORDERING.COMPLETED_HSRP_ORDERING
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewRtoPendingHSRPOrderingTab && activeTab === 0 && canViewCompletedHSRPOrderingTab) {
//       // If RTO PENDING HSRP ORDERING tab is hidden and activeTab is 0, switch to COMPLETED HSRP ORDERING tab
//       setActiveTab(1);
//     }
//   }, [canViewRtoPendingHSRPOrderingTab, canViewCompletedHSRPOrderingTab, activeTab]);

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
//     if (!canViewHSRPOrdering) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewHSRPOrdering]);

//   const fetchData = async () => {
//     if (!canViewHSRPOrdering) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/hsrporderedpending`);
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
//     if (!canViewHSRPOrdering) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/hsrpordered`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data', error);
//     }
//   };

//   const handleVerify = async (item) => {
//     if (!canCreateHSRPOrdering) {
//       showError('You do not have permission to verify HSRP Ordering');
//       return;
//     }
    
//     try {
//       const result = await confirmVerify();

//       if (result.isConfirmed) {
//         await axiosInstance.patch(`/rtoProcess/${item._id}`, {
//           hsrbOrdering: true
//         });
//         await fetchData();
//         await fetchLocationData();

//         await showSuccess('HSRP Ordering verified successfully!');
//       }
//     } catch (error) {
//       console.error('Error verifying HSRP Ordering:', error);
//       showError(error, 'Failed to verify HSRP Ordering');
//     }
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
//               <CTableHeaderCell scope="col">RTO Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Number Plate</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
//               {canCreateHSRPOrdering && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreateHSRPOrdering ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.rtoAmount || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.numberPlate || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   {canCreateHSRPOrdering && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerify(item)}
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         Verify
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
//               <CTableHeaderCell scope="col">RTO HSRP Ordering</CTableHeaderCell>
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
//                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.hsrbOrdering ? 'success' : 'warning'} shape="rounded-pill">
//                       {item.hsrbOrdering ? 'ORDERED' : 'PENDING'}
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
//   if (!canViewHSRPOrdering) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view HSRP Ordering Management.
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
//       <div className='title'>HSRP Ordering Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show RTO PENDING HSRP ORDERING tab if user has VIEW permission for it */}
//             {canViewRtoPendingHSRPOrderingTab && (
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
//                   RTO PENDING HSRP ORDERING
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show COMPLETED HSRP ORDERING tab if user has VIEW permission for it */}
//             {canViewCompletedHSRPOrderingTab && (
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
//                   COMPLETED HSRP ORDERING
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
//     </div>
//   );
// }

// export default HSRPOrdering;








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
import { axiosInstance, getDefaultSearchFields, useTableFilter } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import { confirmVerify, showError, showSuccess } from '../../utils/sweetAlerts';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle } from '@coreui/icons';

// Import the new permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  canViewPage,
  canUpdateInPage,
  canCreateInPage,
  canDeleteInPage
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function HSRPOrdering() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions } = useAuth();

  // Page-level VIEW permission check for HSRP Ordering page
  const canViewHSRPOrdering = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.HSRP_ORDERING, 
    ACTIONS.VIEW
  );

  // Tab-level VIEW permission checks
  const canViewRtoPendingHSRPOrderingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_ORDERING,
    ACTIONS.VIEW,
    TABS.HSRP_ORDERING.RTO_PENDING_HSRP_ORDERING
  );
  
  const canViewCompletedHSRPOrderingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_ORDERING,
    ACTIONS.VIEW,
    TABS.HSRP_ORDERING.COMPLETED_HSRP_ORDERING
  );
  
  // Tab-level CREATE permission for RTO PENDING HSRP ORDERING tab (for Verify button)
  const canCreateInRtoPendingHSRPOrderingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_ORDERING,
    ACTIONS.CREATE,
    TABS.HSRP_ORDERING.RTO_PENDING_HSRP_ORDERING
  );
  
  // Tab-level UPDATE permission for RTO PENDING HSRP ORDERING tab
  const canUpdateInRtoPendingHSRPOrderingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_ORDERING,
    ACTIONS.UPDATE,
    TABS.HSRP_ORDERING.RTO_PENDING_HSRP_ORDERING
  );
  
  // Tab-level DELETE permission for RTO PENDING HSRP ORDERING tab
  const canDeleteInRtoPendingHSRPOrderingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_ORDERING,
    ACTIONS.DELETE,
    TABS.HSRP_ORDERING.RTO_PENDING_HSRP_ORDERING
  );

  // Check if user can view at least one tab
  const canViewAnyTab = canViewRtoPendingHSRPOrderingTab || canViewCompletedHSRPOrderingTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewRtoPendingHSRPOrderingTab) visibleTabs.push(0);
    if (canViewCompletedHSRPOrderingTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewRtoPendingHSRPOrderingTab, canViewCompletedHSRPOrderingTab, activeTab]);

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
    if (!canViewHSRPOrdering) {
      showError('You do not have permission to view HSRP Ordering');
      setLoading(false);
      return;
    }
    
    fetchData();
    fetchLocationData();
  }, [canViewHSRPOrdering]);

  const fetchData = async () => {
    if (!canViewHSRPOrdering) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/rtoProcess/hsrporderedpending`);
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
    if (!canViewHSRPOrdering) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/rtoProcess/hsrpordered`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleVerify = async (item) => {
    // Check CREATE permission for the RTO PENDING HSRP ORDERING tab
    if (!canCreateInRtoPendingHSRPOrderingTab) {
      showError('You do not have permission to verify HSRP Ordering');
      return;
    }
    
    try {
      const result = await confirmVerify();

      if (result.isConfirmed) {
        await axiosInstance.patch(`/rtoProcess/${item._id}`, {
          hsrbOrdering: true
        });
        await fetchData();
        await fetchLocationData();

        await showSuccess('HSRP Ordering verified successfully!');
      }
    } catch (error) {
      console.error('Error verifying HSRP Ordering:', error);
      showError(error, 'Failed to verify HSRP Ordering');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };
  
  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewRtoPendingHSRPOrderingTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the RTO PENDING HSRP ORDERING tab.
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
              <CTableHeaderCell scope="col">RTO Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Number Plate</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
              {canCreateInRtoPendingHSRPOrderingTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canCreateInRtoPendingHSRPOrderingTab ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.rtoAmount || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.numberPlate || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  {canCreateInRtoPendingHSRPOrderingTab && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleVerify(item)}
                      >
                        <CIcon icon={cilCheckCircle} className="me-1" />
                        Verify
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
    if (!canViewCompletedHSRPOrderingTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the COMPLETED HSRP ORDERING tab.
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
              <CTableHeaderCell scope="col">RTO HSRP Ordering</CTableHeaderCell>
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
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.hsrbOrdering ? 'success' : 'warning'} shape="rounded-pill">
                      {item.hsrbOrdering ? 'ORDERED' : 'PENDING'}
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
  if (!canViewHSRPOrdering) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view HSRP Ordering Management.
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
      <div className='title'>HSRP Ordering Management</div>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one tab */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewRtoPendingHSRPOrderingTab && (
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
                      RTO PENDING HSRP ORDERING
                      {!canCreateInRtoPendingHSRPOrderingTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletedHSRPOrderingTab && (
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
                      COMPLETED HSRP ORDERING
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
                {canViewRtoPendingHSRPOrderingTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewCompletedHSRPOrderingTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderCompletedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in HSRP Ordering.
            </CAlert>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default HSRPOrdering;