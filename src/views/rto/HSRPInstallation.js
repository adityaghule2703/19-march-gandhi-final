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

function HSRPInstallation() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewRtoPendingHSRPInstallationTab && activeTab === 0 && canViewCompletedHSRPInstallationTab) {
      // If RTO PENDING HSRP INSTALLATION tab is hidden and activeTab is 0, switch to COMPLETED HSRP INSTALLATION tab
      setActiveTab(1);
    }
  }, [canViewRtoPendingHSRPInstallationTab, canViewCompletedHSRPInstallationTab, activeTab]);

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
    if (!canViewHSRPInstallation) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
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
                <CTableRow key={index}>
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
                    <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
                      {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
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
          <CNav variant="tabs" className="mb-3 border-bottom">
            {/* Only show RTO PENDING HSRP INSTALLATION tab if user has VIEW permission for it */}
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
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show COMPLETED HSRP INSTALLATION tab if user has VIEW permission for it */}
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
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderPendingTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderCompletedTable()}
            </CTabPane>
          </CTabContent>
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






// import React, { useState, useEffect, useCallback } from 'react';
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
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError } from '../../utils/tableImports';
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
// import { showSuccess } from '../../utils/sweetAlerts';

// function HSRPInstallation() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoadingId, setActionLoadingId] = useState(null);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchTimeout, setSearchTimeout] = useState(null);
//   const { permissions } = useAuth();

//   // Pagination states for Pending tab
//   const [pendingData, setPendingData] = useState([]);
//   const [pendingPagination, setPendingPagination] = useState({
//     page: 1,
//     limit: 10,
//     totalRecords: 0,
//     totalPages: 0,
//     hasNextPage: false,
//     hasPrevPage: false
//   });

//   // Pagination states for Completed tab
//   const [approvedData, setApprovedData] = useState([]);
//   const [approvedPagination, setApprovedPagination] = useState({
//     page: 1,
//     limit: 10,
//     totalRecords: 0,
//     totalPages: 0,
//     hasNextPage: false,
//     hasPrevPage: false
//   });

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

//   // Tab-level CREATE permission for COMPLETED HSRP INSTALLATION tab (for OK button)
//   const canCreateInCompletedHSRPInstallationTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.HSRP_INSTALLATION,
//     ACTIONS.CREATE,
//     TABS.HSRP_INSTALLATION.COMPLETED_HSRP_INSTALLATION
//   );

//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewRtoPendingHSRPInstallationTab || canViewCompletedHSRPInstallationTab;

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     const visibleTabs = [];
//     if (canViewRtoPendingHSRPInstallationTab) visibleTabs.push(0);
//     if (canViewCompletedHSRPInstallationTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewRtoPendingHSRPInstallationTab, canViewCompletedHSRPInstallationTab, activeTab]);

//   // Fetch pending data with pagination and search
//   const fetchPendingData = useCallback(async (page = 1, search = '') => {
//     if (!canViewRtoPendingHSRPInstallationTab) return;
    
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: page,
//         limit: pendingPagination.limit
//       });
      
//       if (search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallationpending?${params.toString()}`);
      
//       if (response.data.success) {
//         setPendingData(response.data.data || []);
//         if (response.data.pagination) {
//           setPendingPagination({
//             page: response.data.pagination.page || 1,
//             limit: response.data.pagination.limit || 10,
//             totalRecords: response.data.pagination.totalRecords || 0,
//             totalPages: response.data.pagination.totalPages || 0,
//             hasNextPage: response.data.pagination.hasNextPage || false,
//             hasPrevPage: response.data.pagination.hasPrevPage || false
//           });
//         }
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [canViewRtoPendingHSRPInstallationTab, pendingPagination.limit]);

//   // Fetch completed data with pagination and search
//   const fetchCompletedData = useCallback(async (page = 1, search = '') => {
//     if (!canViewCompletedHSRPInstallationTab) return;
    
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: page,
//         limit: approvedPagination.limit
//       });
      
//       if (search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation?${params.toString()}`);
      
//       if (response.data.success) {
//         setApprovedData(response.data.data || []);
//         if (response.data.pagination) {
//           setApprovedPagination({
//             page: response.data.pagination.page || 1,
//             limit: response.data.pagination.limit || 10,
//             totalRecords: response.data.pagination.totalRecords || 0,
//             totalPages: response.data.pagination.totalPages || 0,
//             hasNextPage: response.data.pagination.hasNextPage || false,
//             hasPrevPage: response.data.pagination.hasPrevPage || false
//           });
//         }
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [canViewCompletedHSRPInstallationTab, approvedPagination.limit]);

//   // Initial data fetch
//   useEffect(() => {
//     if (!canViewHSRPInstallation) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     const fetchInitialData = async () => {
//       if (canViewRtoPendingHSRPInstallationTab) {
//         await fetchPendingData(1, '');
//       }
//       if (canViewCompletedHSRPInstallationTab) {
//         await fetchCompletedData(1, '');
//       }
//     };
    
//     fetchInitialData();
//   }, [canViewHSRPInstallation, canViewRtoPendingHSRPInstallationTab, canViewCompletedHSRPInstallationTab]);

//   const handleAddClick = (hsrpRecord) => {
//     if (!canCreateInRtoPendingHSRPInstallationTab) {
//       showError('You do not have permission to update HSRP installation in RTO PENDING HSRP INSTALLATION tab');
//       return;
//     }
    
//     setSelectedBooking(hsrpRecord);
//     setShowModal(true);
//   };

//   const handleApproveHSRPInstall = async (rtoId) => {
//     if (!canCreateInCompletedHSRPInstallationTab) {
//       showError('You do not have permission to approve HSRP Installation');
//       return;
//     }
    
//     try {
//       setActionLoadingId(rtoId);
//       const response = await axiosInstance.post(`/rtoProcess/approve/${rtoId}/hsrpInstall`);
      
//       if (response.data.success) {
//         showSuccess('HSRP Installation approved successfully!');
//         // Refresh the current page data
//         if (activeTab === 1) {
//           await fetchCompletedData(approvedPagination.page, searchTerm);
//         }
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to approve HSRP Installation';
//       showError(errorMessage);
//       if (errorMessage) {
//         setError(errorMessage);
//       }
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const refreshAllData = () => {
//     if (canViewRtoPendingHSRPInstallationTab) {
//       fetchPendingData(pendingPagination.page, searchTerm);
//     }
//     if (canViewCompletedHSRPInstallationTab) {
//       fetchCompletedData(approvedPagination.page, searchTerm);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//     // Reset to page 1 when changing tabs
//     if (tab === 0 && canViewRtoPendingHSRPInstallationTab) {
//       fetchPendingData(1, '');
//     } else if (tab === 1 && canViewCompletedHSRPInstallationTab) {
//       fetchCompletedData(1, '');
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
    
//     // Clear previous timeout
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }
    
//     // Debounce search
//     const timeout = setTimeout(() => {
//       if (activeTab === 0 && canViewRtoPendingHSRPInstallationTab) {
//         fetchPendingData(1, value);
//       } else if (activeTab === 1 && canViewCompletedHSRPInstallationTab) {
//         fetchCompletedData(1, value);
//       }
//     }, 500);
    
//     setSearchTimeout(timeout);
//   };

//   const handlePageChange = (page) => {
//     if (activeTab === 0 && canViewRtoPendingHSRPInstallationTab) {
//       fetchPendingData(page, searchTerm);
//     } else if (activeTab === 1 && canViewCompletedHSRPInstallationTab) {
//       fetchCompletedData(page, searchTerm);
//     }
//   };

//   const renderPagination = () => {
//     const pagination = activeTab === 0 ? pendingPagination : approvedPagination;
    
//     // Safety check - if pagination is undefined or totalPages is 0 or 1, don't render
//     if (!pagination || pagination.totalPages <= 1) return null;
    
//     const pages = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
//     let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);
    
//     if (endPage - startPage + 1 < maxVisible) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     return (
//       <div className="d-flex justify-content-end mt-3">
//         <CPagination size="sm" aria-label="Page navigation">
//           <CPaginationItem 
//             onClick={() => handlePageChange(pagination.page - 1)}
//             disabled={!pagination.hasPrevPage}
//           >
//             Previous
//           </CPaginationItem>
          
//           {startPage > 1 && (
//             <>
//               <CPaginationItem onClick={() => handlePageChange(1)}>1</CPaginationItem>
//               {startPage > 2 && <CPaginationItem disabled>...</CPaginationItem>}
//             </>
//           )}
          
//           {pages.map(page => (
//             <CPaginationItem
//               key={page}
//               active={page === pagination.page}
//               onClick={() => handlePageChange(page)}
//             >
//               {page}
//             </CPaginationItem>
//           ))}
          
//           {endPage < pagination.totalPages && (
//             <>
//               {endPage < pagination.totalPages - 1 && <CPaginationItem disabled>...</CPaginationItem>}
//               <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)}>
//                 {pagination.totalPages}
//               </CPaginationItem>
//             </>
//           )}
          
//           <CPaginationItem 
//             onClick={() => handlePageChange(pagination.page + 1)}
//             disabled={!pagination.hasNextPage}
//           >
//             Next
//           </CPaginationItem>
//         </CPagination>
//       </div>
//     );
//   };

//   const renderPendingTable = () => {
//     if (!canViewRtoPendingHSRPInstallationTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the RTO PENDING HSRP INSTALLATION tab.
//           </CAlert>
//         </div>
//       );
//     }
    
//     const canUpdateInThisTab = canCreateInRtoPendingHSRPInstallationTab;
//     const startIndex = ((pendingPagination.page || 1) - 1) * (pendingPagination.limit || 10);
    
//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">HSRP Inward Index</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
//                 {canUpdateInThisTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {pendingData.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={canUpdateInThisTab ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                     No data available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 pendingData.map((item, index) => (
//                   <CTableRow key={item._id || index}>
//                     <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
//                     <CTableDataCell>
//                       {item.hsrpInwardIndex ? (
//                         <CBadge color="info" shape="rounded-pill">
//                           {item.hsrpInwardIndex}
//                         </CBadge>
//                       ) : (
//                         <span className="text-muted">-</span>
//                       )}
//                     </CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>
//                       <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
//                         {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
//                       </CBadge>
//                     </CTableDataCell>
//                     {canUpdateInThisTab && (
//                       <CTableDataCell>
//                         <CButton 
//                           size="sm" 
//                           className="action-btn"
//                           onClick={() => handleAddClick(item)}
//                         >
//                           <CIcon icon={cilPencil} className="me-1" />
//                           Update
//                         </CButton>
//                       </CTableDataCell>
//                     )}
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination()}
//       </>
//     );
//   };

//   const renderCompletedTable = () => {
//     if (!canViewCompletedHSRPInstallationTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the COMPLETED HSRP INSTALLATION tab.
//           </CAlert>
//         </div>
//       );
//     }
    
//     const startIndex = ((approvedPagination.page || 1) - 1) * (approvedPagination.limit || 10);
    
//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">RC Dispatch Date</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">RTO HSRP Installation</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {approvedData.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
//                     No data available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 approvedData.map((item, index) => (
//                   <CTableRow key={item._id || index}>
//                     <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>
//                       {item.rcDispatchDate ? new Date(item.rcDispatchDate).toLocaleDateString('en-GB') : 'N/A'}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       <CBadge color={item.hsrbInstallation === false ? 'danger' : 'success'} shape="rounded-pill">
//                         {item.hsrbInstallation === false ? 'PENDING' : 'INSTALLED'}
//                       </CBadge>
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {item.displayStatus?.hsrpInstall === 'Verified' ? (
//                         <span className="text-success fw-bold">Verified</span>
//                       ) : (
//                         canCreateInCompletedHSRPInstallationTab ? (
//                           <CButton 
//                             size="sm" 
//                             color="success"
//                             onClick={() => handleApproveHSRPInstall(item._id)}
//                             disabled={actionLoadingId === item._id}
//                           >
//                             {actionLoadingId === item._id ? (
//                               <>
//                                 <CSpinner size="sm" className="me-1" />
//                                 Processing...
//                               </>
//                             ) : (
//                               'OK'
//                             )}
//                           </CButton>
//                         ) : (
//                           <span className="text-muted">No permission</span>
//                         )
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination()}
//       </>
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

//   if (loading && pendingData.length === 0 && approvedData.length === 0) {
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
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewRtoPendingHSRPInstallationTab && (
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
//                       RTO PENDING HSRP INSTALLATION
//                       {!canCreateInRtoPendingHSRPInstallationTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompletedHSRPInstallationTab && (
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
//                       COMPLETED HSRP INSTALLATION
//                       {!canCreateInCompletedHSRPInstallationTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div>
//                   {activeTab === 0 && pendingPagination && pendingPagination.totalRecords > 0 && (
//                     <span className="text-muted">
//                       Showing {((pendingPagination.page - 1) * pendingPagination.limit) + 1} to{' '}
//                       {Math.min(pendingPagination.page * pendingPagination.limit, pendingPagination.totalRecords)} of{' '}
//                       {pendingPagination.totalRecords} entries
//                     </span>
//                   )}
//                   {activeTab === 1 && approvedPagination && approvedPagination.totalRecords > 0 && (
//                     <span className="text-muted">
//                       Showing {((approvedPagination.page - 1) * approvedPagination.limit) + 1} to{' '}
//                       {Math.min(approvedPagination.page * approvedPagination.limit, approvedPagination.totalRecords)} of{' '}
//                       {approvedPagination.totalRecords} entries
//                     </span>
//                   )}
//                 </div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     disabled={!canViewAnyTab}
//                     placeholder="Search by booking ID, customer name, chassis number..."
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewRtoPendingHSRPInstallationTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompletedHSRPInstallationTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderCompletedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in HSRP Installation.
//             </CAlert>
//           )}
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