// // import React, { useState, useEffect } from 'react';
// // import { 
// //   CBadge, 
// //   CNav, 
// //   CNavItem, 
// //   CNavLink, 
// //   CTabContent, 
// //   CTabPane,
// //   CTable,
// //   CTableHead,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableBody,
// //   CTableDataCell,
// //   CCard,
// //   CCardBody,
// //   CButton,
// //   CFormInput,
// //   CSpinner,
// //   CFormLabel,
// //   CAlert
// // } from '@coreui/react';
// // import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// // import '../../css/invoice.css';
// // import '../../css/table.css';
// // import UpdateHSRPInstallation from './UpdateHSRPInstallation';
// // import CIcon from '@coreui/icons-react';
// // import { cilPencil } from '@coreui/icons';

// // // Import the new permission utilities
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   ACTIONS,
// //   canViewPage,
// //   canUpdateInPage
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // function HSRPInstallation() {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for HSRP Installation page under RTO module
// //   const canViewHSRPInstallation = canViewPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.HSRP_INSTALLATION
// //   );
  
// //   const canUpdateHSRPInstallation = canUpdateInPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.HSRP_INSTALLATION
// //   );

// //   const {
// //     data: pendingData,
// //     setData: setPendingData,
// //     filteredData: filteredPendings,
// //     setFilteredData: setFilteredPendings,
// //     handleFilter: handlePendingFilter
// //   } = useTableFilter([]);

// //   const {
// //     data: approvedData,
// //     setData: setApprovedData,
// //     filteredData: filteredApproved,
// //     setFilteredData: setFilteredApproved,
// //     handleFilter: handleApprovedFilter
// //   } = useTableFilter([]);

// //   useEffect(() => {
// //     if (!canViewHSRPInstallation) {
// //       setError('Permission denied');
// //       setLoading(false);
// //       return;
// //     }
    
// //     fetchData();
// //     fetchLocationData();
// //   }, [canViewHSRPInstallation]);

// //   const fetchData = async () => {
// //     if (!canViewHSRPInstallation) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallationpending`);
// //       setPendingData(response.data.data);
// //       setFilteredPendings(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchLocationData = async () => {
// //     if (!canViewHSRPInstallation) {
// //       return;
// //     }
    
// //     try {
// //       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation`);
// //       setApprovedData(response.data.data);
// //       setFilteredApproved(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const handleAddClick = (hsrpRecord) => {
// //     if (!canUpdateHSRPInstallation) {
// //       showError('You do not have permission to update HSRP installation');
// //       return;
// //     }
    
// //     setSelectedBooking(hsrpRecord);
// //     setShowModal(true);
// //   };

// //   const refreshAllData = () => {
// //     fetchData();
// //     fetchLocationData();
// //   };

// //   const handleTabChange = (tab) => {
// //     setActiveTab(tab);
// //     setSearchTerm('');
// //   };

// //   const renderPendingTable = () => {
// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
// //               {canUpdateHSRPInstallation && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredPendings.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canUpdateHSRPInstallation ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredPendings.map((item, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
// //                       {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   {canUpdateHSRPInstallation && (
// //                     <CTableDataCell>
// //                       <CButton 
// //                         size="sm" 
// //                         className="action-btn"
// //                         onClick={() => handleAddClick(item)}
// //                       >
// //                         <CIcon icon={cilPencil} className="me-1" />
// //                         Update
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

// //   const renderCompletedTable = () => {
// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredApproved.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredApproved.map((item, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {item.rcDispatchDate ? new Date(item.rcDispatchDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
// //                       {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
// //                     </CBadge>
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   // Check if user has permission to view the page
// //   if (!canViewHSRPInstallation) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view HSRP Installation Management.
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
// //         <CSpinner color="primary" />
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
// //       <div className='title'>HSRP Installation Management</div>
      
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
// //               >
// //                 RTO PENDING HSRP INSTALLATION
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
// //                 COMPLETED HSRP INSTALLATION
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
// //                 onChange={(e) => {
// //                   setSearchTerm(e.target.value);
// //                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
// //                   else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
// //                 }}
// //               />
// //             </div>
// //           </div>

// //           <CTabContent>
// //             <CTabPane visible={activeTab === 0}>
// //               {renderPendingTable()}
// //             </CTabPane>
// //             <CTabPane visible={activeTab === 1}>
// //               {renderCompletedTable()}
// //             </CTabPane>
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>

// //       <UpdateHSRPInstallation
// //         show={showModal}
// //         onClose={() => setShowModal(false)}
// //         hsrpData={selectedBooking}
// //         onUpdateSuccess={refreshAllData}
// //       />
// //     </div>
// //   );
// // }

// // export default HSRPInstallation;





// // import React, { useState, useEffect } from 'react';
// // import { 
// //   CBadge, 
// //   CNav, 
// //   CNavItem, 
// //   CNavLink, 
// //   CTabContent, 
// //   CTabPane,
// //   CTable,
// //   CTableHead,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableBody,
// //   CTableDataCell,
// //   CCard,
// //   CCardBody,
// //   CButton,
// //   CFormInput,
// //   CSpinner,
// //   CFormLabel,
// //   CAlert
// // } from '@coreui/react';
// // import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// // import '../../css/invoice.css';
// // import '../../css/table.css';
// // import UpdateHSRPInstallation from './UpdateHSRPInstallation';
// // import CIcon from '@coreui/icons-react';
// // import { cilPencil } from '@coreui/icons';

// // // Import the new permission utilities
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   TABS,
// //   ACTIONS,
// //   canViewPage,
// //   canUpdateInPage
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // function HSRPInstallation() {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for HSRP Installation page under RTO module
// //   const canViewHSRPInstallation = canViewPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.HSRP_INSTALLATION
// //   );
  
// //   const canUpdateHSRPInstallation = canUpdateInPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.HSRP_INSTALLATION
// //   );

// //   // Tab-level VIEW permission checks
// //   const canViewRtoPendingHSRPInstallationTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.RTO,
// //     PAGES.RTO.HSRP_INSTALLATION,
// //     ACTIONS.VIEW,
// //     TABS.HSRP_INSTALLATION.RTO_PENDING_HSRP_INSTALLATION
// //   );
  
// //   const canViewCompletedHSRPInstallationTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.RTO,
// //     PAGES.RTO.HSRP_INSTALLATION,
// //     ACTIONS.VIEW,
// //     TABS.HSRP_INSTALLATION.COMPLETED_HSRP_INSTALLATION
// //   );

// //   // Adjust activeTab when permissions change
// //   useEffect(() => {
// //     if (!canViewRtoPendingHSRPInstallationTab && activeTab === 0 && canViewCompletedHSRPInstallationTab) {
// //       // If RTO PENDING HSRP INSTALLATION tab is hidden and activeTab is 0, switch to COMPLETED HSRP INSTALLATION tab
// //       setActiveTab(1);
// //     }
// //   }, [canViewRtoPendingHSRPInstallationTab, canViewCompletedHSRPInstallationTab, activeTab]);

// //   const {
// //     data: pendingData,
// //     setData: setPendingData,
// //     filteredData: filteredPendings,
// //     setFilteredData: setFilteredPendings,
// //     handleFilter: handlePendingFilter
// //   } = useTableFilter([]);

// //   const {
// //     data: approvedData,
// //     setData: setApprovedData,
// //     filteredData: filteredApproved,
// //     setFilteredData: setFilteredApproved,
// //     handleFilter: handleApprovedFilter
// //   } = useTableFilter([]);

// //   useEffect(() => {
// //     if (!canViewHSRPInstallation) {
// //       setError('Permission denied');
// //       setLoading(false);
// //       return;
// //     }
    
// //     fetchData();
// //     fetchLocationData();
// //   }, [canViewHSRPInstallation]);

// //   const fetchData = async () => {
// //     if (!canViewHSRPInstallation) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallationpending`);
// //       setPendingData(response.data.data);
// //       setFilteredPendings(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchLocationData = async () => {
// //     if (!canViewHSRPInstallation) {
// //       return;
// //     }
    
// //     try {
// //       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation`);
// //       setApprovedData(response.data.data);
// //       setFilteredApproved(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const handleAddClick = (hsrpRecord) => {
// //     if (!canUpdateHSRPInstallation) {
// //       showError('You do not have permission to update HSRP installation');
// //       return;
// //     }
    
// //     setSelectedBooking(hsrpRecord);
// //     setShowModal(true);
// //   };

// //   const refreshAllData = () => {
// //     fetchData();
// //     fetchLocationData();
// //   };

// //   const handleTabChange = (tab) => {
// //     setActiveTab(tab);
// //     setSearchTerm('');
// //   };

// //   const renderPendingTable = () => {
// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
// //               {canUpdateHSRPInstallation && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredPendings.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canUpdateHSRPInstallation ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredPendings.map((item, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
// //                       {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   {canUpdateHSRPInstallation && (
// //                     <CTableDataCell>
// //                       <CButton 
// //                         size="sm" 
// //                         className="action-btn"
// //                         onClick={() => handleAddClick(item)}
// //                       >
// //                         <CIcon icon={cilPencil} className="me-1" />
// //                         Update
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

// //   const renderCompletedTable = () => {
// //     return (
// //       <div className="responsive-table-wrapper">
// //         <CTable striped bordered hover className='responsive-table'>
// //           <CTableHead>
// //             <CTableRow>
// //               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredApproved.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredApproved.map((item, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {item.rcDispatchDate ? new Date(item.rcDispatchDate).toLocaleDateString('en-GB') : 'N/A'}
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
// //                       {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
// //                     </CBadge>
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))
// //             )}
// //           </CTableBody>
// //         </CTable>
// //       </div>
// //     );
// //   };

// //   // Check if user has permission to view the page
// //   if (!canViewHSRPInstallation) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view HSRP Installation Management.
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
// //         <CSpinner color="primary" />
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
// //       <div className='title'>HSRP Installation Management</div>
      
// //       <CCard className='table-container mt-4'>
// //         <CCardBody>
// //           <CNav variant="tabs" className="mb-3 border-bottom">
// //             {/* Only show RTO PENDING HSRP INSTALLATION tab if user has VIEW permission for it */}
// //             {canViewRtoPendingHSRPInstallationTab && (
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
// //                 >
// //                   RTO PENDING HSRP INSTALLATION
// //                 </CNavLink>
// //               </CNavItem>
// //             )}
// //             {/* Only show COMPLETED HSRP INSTALLATION tab if user has VIEW permission for it */}
// //             {canViewCompletedHSRPInstallationTab && (
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
// //                 >
// //                   COMPLETED HSRP INSTALLATION
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
// //                 onChange={(e) => {
// //                   setSearchTerm(e.target.value);
// //                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
// //                   else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
// //                 }}
// //               />
// //             </div>
// //           </div>

// //           <CTabContent>
// //             <CTabPane visible={activeTab === 0}>
// //               {renderPendingTable()}
// //             </CTabPane>
// //             <CTabPane visible={activeTab === 1}>
// //               {renderCompletedTable()}
// //             </CTabPane>
// //           </CTabContent>
// //         </CCardBody>
// //       </CCard>

// //       <UpdateHSRPInstallation
// //         show={showModal}
// //         onClose={() => setShowModal(false)}
// //         hsrpData={selectedBooking}
// //         onUpdateSuccess={refreshAllData}
// //       />
// //     </div>
// //   );
// // }

// // export default HSRPInstallation;








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
// import UpdateHSRPInstallation from './UpdateHSRPInstallation';
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
//   canUpdateInPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function HSRPInstallation() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for HSRP Installation page under RTO module
//   const canViewHSRPInstallation = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_INSTALLATION
//   );
  
//   const canUpdateHSRPInstallation = canUpdateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_INSTALLATION
//   );
  
//   const canCreateHSRPInstallation = canCreateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.HSRP_INSTALLATION
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPendingHSRPInstallationTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.HSRP_INSTALLATION,
//     ACTIONS.VIEW,
//     TABS.HSRP_INSTALLATION.RTO_PENDING_HSRP_INSTALLATION
//   );
  
//   const canViewCompletedHSRPInstallationTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.HSRP_INSTALLATION,
//     ACTIONS.VIEW,
//     TABS.HSRP_INSTALLATION.COMPLETED_HSRP_INSTALLATION
//   );

//   // Tab-level CREATE permission checks (for update actions)
//   const canCreateInRtoPendingHSRPInstallationTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.HSRP_INSTALLATION,
//     ACTIONS.CREATE,
//     TABS.HSRP_INSTALLATION.RTO_PENDING_HSRP_INSTALLATION
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewRtoPendingHSRPInstallationTab && activeTab === 0 && canViewCompletedHSRPInstallationTab) {
//       // If RTO PENDING HSRP INSTALLATION tab is hidden and activeTab is 0, switch to COMPLETED HSRP INSTALLATION tab
//       setActiveTab(1);
//     }
//   }, [canViewRtoPendingHSRPInstallationTab, canViewCompletedHSRPInstallationTab, activeTab]);

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
//     if (!canViewHSRPInstallation) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewHSRPInstallation]);

//   const fetchData = async () => {
//     if (!canViewHSRPInstallation) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallationpending`);
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
//     if (!canViewHSRPInstallation) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleAddClick = (hsrpRecord) => {
//     // Check CREATE permission in RTO PENDING HSRP INSTALLATION tab for update action
//     if (!canCreateInRtoPendingHSRPInstallationTab) {
//       showError('You do not have permission to update HSRP installation in RTO PENDING HSRP INSTALLATION tab');
//       return;
//     }
    
//     setSelectedBooking(hsrpRecord);
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

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewRtoPendingHSRPInstallationTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the RTO PENDING HSRP INSTALLATION tab.
//           </CAlert>
//         </div>
//       );
//     }
    
//     // Check if user has CREATE permission for update action in this tab
//     const canUpdateInThisTab = canCreateInRtoPendingHSRPInstallationTab;
    
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
//               <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
//               {canUpdateInThisTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canUpdateInThisTab ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
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
//                     <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
//                       {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canUpdateInThisTab && (
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
//     // Check if user has permission to view this tab
//     if (!canViewCompletedHSRPInstallationTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the COMPLETED HSRP INSTALLATION tab.
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
//               <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
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
//                     <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
//                       {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
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
//   if (!canViewHSRPInstallation) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view HSRP Installation Management.
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
//       <div className='title'>HSRP Installation Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show RTO PENDING HSRP INSTALLATION tab if user has VIEW permission for it */}
//             {canViewRtoPendingHSRPInstallationTab && (
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
//                   RTO PENDING HSRP INSTALLATION
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show COMPLETED HSRP INSTALLATION tab if user has VIEW permission for it */}
//             {canViewCompletedHSRPInstallationTab && (
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
//                   COMPLETED HSRP INSTALLATION
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

//       <UpdateHSRPInstallation
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         hsrpData={selectedBooking}
//         onUpdateSuccess={refreshAllData}
//       />
//     </div>
//   );
// }

// export default HSRPInstallation;






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
import UpdateHSRPInstallation from './UpdateHSRPInstallation';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

// Import the new permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  canViewPage,
  canUpdateInPage,
  canCreateInPage
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';
import { showSuccess } from '../../utils/sweetAlerts'; // Make sure to import showSuccess

function HSRPInstallation() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions } = useAuth();

  // Page-level permission checks for HSRP Installation page under RTO module
  const canViewHSRPInstallation = canViewPage(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.HSRP_INSTALLATION
  );
  
  const canUpdateHSRPInstallation = canUpdateInPage(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.HSRP_INSTALLATION
  );
  
  const canCreateHSRPInstallation = canCreateInPage(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.HSRP_INSTALLATION
  );

  // Tab-level VIEW permission checks
  const canViewRtoPendingHSRPInstallationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_INSTALLATION,
    ACTIONS.VIEW,
    TABS.HSRP_INSTALLATION.RTO_PENDING_HSRP_INSTALLATION
  );
  
  const canViewCompletedHSRPInstallationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_INSTALLATION,
    ACTIONS.VIEW,
    TABS.HSRP_INSTALLATION.COMPLETED_HSRP_INSTALLATION
  );

  // Tab-level CREATE permission checks (for update actions)
  const canCreateInRtoPendingHSRPInstallationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_INSTALLATION,
    ACTIONS.CREATE,
    TABS.HSRP_INSTALLATION.RTO_PENDING_HSRP_INSTALLATION
  );

  // Tab-level CREATE permission for COMPLETED HSRP INSTALLATION tab (for OK button)
  const canCreateInCompletedHSRPInstallationTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.HSRP_INSTALLATION,
    ACTIONS.CREATE,
    TABS.HSRP_INSTALLATION.COMPLETED_HSRP_INSTALLATION
  );

  // Check if user can view at least one tab
  const canViewAnyTab = canViewRtoPendingHSRPInstallationTab || canViewCompletedHSRPInstallationTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewRtoPendingHSRPInstallationTab) visibleTabs.push(0);
    if (canViewCompletedHSRPInstallationTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewRtoPendingHSRPInstallationTab, canViewCompletedHSRPInstallationTab, activeTab]);

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
    if (!canViewHSRPInstallation) {
      setError('Permission denied');
      setLoading(false);
      return;
    }
    
    fetchData();
    fetchLocationData();
  }, [canViewHSRPInstallation]);

  const fetchData = async () => {
    if (!canViewHSRPInstallation) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/rtoProcess/hsrpinstallationpending`);
      setPendingData(response.data.data || []);
      setFilteredPendings(response.data.data || []);
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
    if (!canViewHSRPInstallation) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation`);
      setApprovedData(response.data.data || []);
      setFilteredApproved(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleAddClick = (hsrpRecord) => {
    // Check CREATE permission in RTO PENDING HSRP INSTALLATION tab for update action
    if (!canCreateInRtoPendingHSRPInstallationTab) {
      showError('You do not have permission to update HSRP installation in RTO PENDING HSRP INSTALLATION tab');
      return;
    }
    
    setSelectedBooking(hsrpRecord);
    setShowModal(true);
  };

  const handleApproveHSRPInstall = async (rtoId) => {
    // Check CREATE permission for the COMPLETED HSRP INSTALLATION tab
    if (!canCreateInCompletedHSRPInstallationTab) {
      showError('You do not have permission to approve HSRP Installation');
      return;
    }
    
    try {
      setActionLoadingId(rtoId);
      const response = await axiosInstance.post(`/rtoProcess/approve/${rtoId}/hsrpInstall`);
      
      if (response.data.success) {
        showSuccess('HSRP Installation approved successfully!');
        // Refresh the data after successful approval
        await fetchLocationData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve HSRP Installation';
      showError(errorMessage);
      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const refreshAllData = () => {
    fetchData();
    fetchLocationData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewRtoPendingHSRPInstallationTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the RTO PENDING HSRP INSTALLATION tab.
          </CAlert>
        </div>
      );
    }
    
    // Check if user has CREATE permission for update action in this tab
    const canUpdateInThisTab = canCreateInRtoPendingHSRPInstallationTab;
    
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
              <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
              {canUpdateInThisTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canUpdateInThisTab ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((item, index) => (
                <CTableRow key={item._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
                      {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
                    </CBadge>
                  </CTableDataCell>
                  {canUpdateInThisTab && (
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
    if (!canViewCompletedHSRPInstallationTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the COMPLETED HSRP INSTALLATION tab.
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
              <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredApproved.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredApproved.map((item, index) => (
                <CTableRow key={item._id || index}>
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
                    <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
                      {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.displayStatus?.hsrpInstall === 'Verified' ? (
                      <span className="text-success fw-bold">Verified</span>
                    ) : (
                      canCreateInCompletedHSRPInstallationTab ? (
                        <CButton 
                          size="sm" 
                          color="success"
                          onClick={() => handleApproveHSRPInstall(item._id)}
                          disabled={actionLoadingId === item._id}
                        >
                          {actionLoadingId === item._id ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Processing...
                            </>
                          ) : (
                            'OK'
                          )}
                        </CButton>
                      ) : (
                        <span className="text-muted">No permission</span>
                      )
                    )}
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
  if (!canViewHSRPInstallation) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view HSRP Installation Management.
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
      <div className='title'>HSRP Installation Management</div>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one tab */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewRtoPendingHSRPInstallationTab && (
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
                      RTO PENDING HSRP INSTALLATION
                      {!canCreateInRtoPendingHSRPInstallationTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletedHSRPInstallationTab && (
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
                      COMPLETED HSRP INSTALLATION
                      {!canCreateInCompletedHSRPInstallationTab && (
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
                {canViewRtoPendingHSRPInstallationTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewCompletedHSRPInstallationTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderCompletedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in HSRP Installation.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <UpdateHSRPInstallation
        show={showModal}
        onClose={() => setShowModal(false)}
        hsrpData={selectedBooking}
        onUpdateSuccess={refreshAllData}
      />
    </div>
  );
}

export default HSRPInstallation;