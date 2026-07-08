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
// // import { Link } from 'react-router-dom';
// // import CIcon from '@coreui/icons-react';
// // import { cilCloudUpload, cilZoom } from '@coreui/icons';
// // import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// // import '../../css/invoice.css';
// // import '../../css/table.css';
// // import KYCDocuments from './KYCDocuments';

// // // Import the new permission utilities
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   ACTIONS,
// //   canViewPage,
// //   canUpdateInPage,
// //   canCreateInPage
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // function RTOPaper() {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showKycModal, setShowKycModal] = useState(false);
// //   const [kycData, setKycData] = useState(null);
// //   const [selectedRtoId, setSelectedRtoId] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for RTO Paper page under RTO module
// //   const canViewRTOPaper = canViewPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.RTO_PAPER
// //   );
  
// //   const canUpdateRTOPaper = canUpdateInPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.RTO_PAPER
// //   );
  
// //   const canCreateRTOPaper = canCreateInPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.RTO_PAPER
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
// //     if (!canViewRTOPaper) {
// //       setError('Permission denied');
// //       setLoading(false);
// //       return;
// //     }
    
// //     fetchData();
// //     fetchLocationData();
// //   }, [canViewRTOPaper]);

// //   const fetchData = async () => {
// //     if (!canViewRTOPaper) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
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
// //     if (!canViewRTOPaper) {
// //       return;
// //     }
    
// //     try {
// //       const response = await axiosInstance.get(`/rtoProcess/rtopaperapproved`);
// //       setApprovedData(response.data.data);
// //       setFilteredApproved(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const handleViewKYC = async (rtoItem) => {
// //     if (!canViewRTOPaper) {  // Changed from canUpdateRTOPaper to canViewRTOPaper
// //       showError('You do not have permission to view KYC documents');
// //       return;
// //     }
    
// //     try {
// //       const bookingId = rtoItem.bookingId?.id;
// //       setSelectedRtoId(rtoItem._id);

// //       if (!bookingId) {
// //         showError('Booking ID not found');
// //         return;
// //       }

// //       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);

// //       const kycDataWithStatus = {
// //         ...response.data.data,
// //         status: rtoItem.documentStatus?.kyc?.status || 'PENDING',
// //         chassisNumber: rtoItem.bookingId?.chassisNumber,
// //         bookingNumber: rtoItem.bookingId?.bookingNumber,
// //         customerName: rtoItem.bookingId?.customerName
// //       };

// //       setKycData(kycDataWithStatus);
// //       setShowKycModal(true);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const refreshData = () => {
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
// //               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>
// //               {canViewRTOPaper && <CTableHeaderCell scope="col">Action</CTableHeaderCell>} {/* Changed to canViewRTOPaper */}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredPendings.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canViewRTOPaper ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}> {/* Changed to canViewRTOPaper */}
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredPendings.map((rtoItem, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={rtoItem.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
// //                       {rtoItem.rtoPaperStatus || 'Pending'}
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     {!rtoItem.kycStatus || rtoItem.kycStatus === 'NOT_UPLOADED' || rtoItem.kycStatus === 'REJECTED' ? (
// //                       canCreateRTOPaper ? (
// //                         <Link
// //                           to={`/upload-kyc/${rtoItem.bookingId?.id}`}
// //                           state={{
// //                             bookingId: rtoItem.bookingId?.id,
// //                             customerName: rtoItem.bookingId?.customerName,
// //                             address: `${rtoItem.bookingId?.customerAddress || ''}`,
// //                             chassisNumber: rtoItem.bookingId?.chassisNumber
// //                           }}
// //                         >
// //                           <CButton size="sm" className="upload-kyc-btn icon-only">
// //                             <CIcon icon={cilCloudUpload} />
// //                           </CButton>
// //                         </Link>
// //                       ) : (
// //                         <span className="text-muted">No permission</span>
// //                       )
// //                     ) : (
// //                       <span className={`status-badge ${(rtoItem.kycStatus || '').toLowerCase()}`}>
// //                         {rtoItem.kycStatus || 'N/A'}
// //                       </span>
// //                     )}
// //                   </CTableDataCell>
// //                   {canViewRTOPaper && (  // Changed to canViewRTOPaper
// //                     <CTableDataCell>
// //                       <CButton 
// //                         size="sm" 
// //                         className="action-btn"
// //                         onClick={() => handleViewKYC(rtoItem)}
// //                       >
// //                         <CIcon icon={cilZoom} className="me-1" />
// //                         View
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
// //               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredApproved.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredApproved.map((rtoItem, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={rtoItem.rtoPaperStatus === 'Submitted' ? 'success' : 'danger'} shape="rounded-pill">
// //                       {rtoItem.rtoPaperStatus || 'Pending'}
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
// //   if (!canViewRTOPaper) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view RTO Paper Management.
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
// //       <div className='title'>RTO Paper Management</div>
      
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
// //                 RTO PAPER PENDING
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
// //                 COMPLETED
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

// //       <KYCDocuments
// //         open={showKycModal}
// //         onClose={() => setShowKycModal(false)}
// //         kycData={kycData}
// //         refreshData={refreshData}
// //         rtoId={selectedRtoId}
// //       />
// //     </div>
// //   );
// // }

// // export default RTOPaper;




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
// // import { Link } from 'react-router-dom';
// // import CIcon from '@coreui/icons-react';
// // import { cilCloudUpload, cilZoom } from '@coreui/icons';
// // import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// // import '../../css/invoice.css';
// // import '../../css/table.css';
// // import KYCDocuments from './KYCDocuments';

// // // Import the new permission utilities
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   TABS,
// //   ACTIONS,
// //   canViewPage,
// //   canUpdateInPage,
// //   canCreateInPage
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // function RTOPaper() {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [showKycModal, setShowKycModal] = useState(false);
// //   const [kycData, setKycData] = useState(null);
// //   const [selectedRtoId, setSelectedRtoId] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for RTO Paper page under RTO module
// //   const canViewRTOPaper = canViewPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.RTO_PAPER
// //   );
  
// //   const canUpdateRTOPaper = canUpdateInPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.RTO_PAPER
// //   );
  
// //   const canCreateRTOPaper = canCreateInPage(
// //     permissions, 
// //     MODULES.RTO, 
// //     PAGES.RTO.RTO_PAPER
// //   );

// //   // Tab-level VIEW permission checks
// //   const canViewRtoPaperPendingTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.RTO,
// //     PAGES.RTO.RTO_PAPER,
// //     ACTIONS.VIEW,
// //     TABS.RTO_PAPER.RTO_PAPER_PENDING
// //   );
  
// //   const canViewCompletedTab = hasSafePagePermission(
// //     permissions,
// //     MODULES.RTO,
// //     PAGES.RTO.RTO_PAPER,
// //     ACTIONS.VIEW,
// //     TABS.RTO_PAPER.COMPLETED
// //   );

// //   // Adjust activeTab when permissions change
// //   useEffect(() => {
// //     if (!canViewRtoPaperPendingTab && activeTab === 0 && canViewCompletedTab) {
// //       // If RTO PAPER PENDING tab is hidden and activeTab is 0, switch to COMPLETED tab
// //       setActiveTab(1);
// //     }
// //   }, [canViewRtoPaperPendingTab, canViewCompletedTab, activeTab]);

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
// //     if (!canViewRTOPaper) {
// //       setError('Permission denied');
// //       setLoading(false);
// //       return;
// //     }
    
// //     fetchData();
// //     fetchLocationData();
// //   }, [canViewRTOPaper]);

// //   const fetchData = async () => {
// //     if (!canViewRTOPaper) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
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
// //     if (!canViewRTOPaper) {
// //       return;
// //     }
    
// //     try {
// //       const response = await axiosInstance.get(`/rtoProcess/rtopaperapproved`);
// //       setApprovedData(response.data.data);
// //       setFilteredApproved(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const handleViewKYC = async (rtoItem) => {
// //     if (!canViewRTOPaper) {  // Changed from canUpdateRTOPaper to canViewRTOPaper
// //       showError('You do not have permission to view KYC documents');
// //       return;
// //     }
    
// //     try {
// //       const bookingId = rtoItem.bookingId?.id;
// //       setSelectedRtoId(rtoItem._id);

// //       if (!bookingId) {
// //         showError('Booking ID not found');
// //         return;
// //       }

// //       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);

// //       const kycDataWithStatus = {
// //         ...response.data.data,
// //         status: rtoItem.documentStatus?.kyc?.status || 'PENDING',
// //         chassisNumber: rtoItem.bookingId?.chassisNumber,
// //         bookingNumber: rtoItem.bookingId?.bookingNumber,
// //         customerName: rtoItem.bookingId?.customerName
// //       };

// //       setKycData(kycDataWithStatus);
// //       setShowKycModal(true);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const refreshData = () => {
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
// //               <CTableHeaderCell scope="col">Contact Number1</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
// //               <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>
// //               {canViewRTOPaper && <CTableHeaderCell scope="col">Action</CTableHeaderCell>} {/* Changed to canViewRTOPaper */}
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredPendings.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan={canViewRTOPaper ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}> {/* Changed to canViewRTOPaper */}
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredPendings.map((rtoItem, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={rtoItem.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
// //                       {rtoItem.rtoPaperStatus || 'Pending'}
// //                     </CBadge>
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     {!rtoItem.kycStatus || rtoItem.kycStatus === 'NOT_UPLOADED' || rtoItem.kycStatus === 'REJECTED' ? (
// //                       canCreateRTOPaper ? (
// //                         <Link
// //                           to={`/upload-kyc/${rtoItem.bookingId?.id}`}
// //                           state={{
// //                             bookingId: rtoItem.bookingId?.id,
// //                             customerName: rtoItem.bookingId?.customerName,
// //                             address: `${rtoItem.bookingId?.customerAddress || ''}`,
// //                             chassisNumber: rtoItem.bookingId?.chassisNumber
// //                           }}
// //                         >
// //                           <CButton size="sm" className="upload-kyc-btn icon-only">
// //                             <CIcon icon={cilCloudUpload} />
// //                           </CButton>
// //                         </Link>
// //                       ) : (
// //                         <span className="text-muted">No permission</span>
// //                       )
// //                     ) : (
// //                       <span className={`status-badge ${(rtoItem.kycStatus || '').toLowerCase()}`}>
// //                         {rtoItem.kycStatus || 'N/A'}
// //                       </span>
// //                     )}
// //                   </CTableDataCell>
// //                   {canViewRTOPaper && (  // Changed to canViewRTOPaper
// //                     <CTableDataCell>
// //                       <CButton 
// //                         size="sm" 
// //                         className="action-btn"
// //                         onClick={() => handleViewKYC(rtoItem)}
// //                       >
// //                         <CIcon icon={cilZoom} className="me-1" />
// //                         View
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
// //               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
// //             </CTableRow>
// //           </CTableHead>
// //           <CTableBody>
// //             {filteredApproved.length === 0 ? (
// //               <CTableRow>
// //                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
// //                   No data available
// //                 </CTableDataCell>
// //               </CTableRow>
// //             ) : (
// //               filteredApproved.map((rtoItem, index) => (
// //                 <CTableRow key={index}>
// //                   <CTableDataCell>{index + 1}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
// //                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
// //                   <CTableDataCell>
// //                     <CBadge color={rtoItem.rtoPaperStatus === 'Submitted' ? 'success' : 'danger'} shape="rounded-pill">
// //                       {rtoItem.rtoPaperStatus || 'Pending'}
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
// //   if (!canViewRTOPaper) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view RTO Paper Management.
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
// //       <div className='title'>RTO Paper Management</div>
      
// //       <CCard className='table-container mt-4'>
// //         <CCardBody>
// //           <CNav variant="tabs" className="mb-3 border-bottom">
// //             {/* Only show RTO PAPER PENDING tab if user has VIEW permission for it */}
// //             {canViewRtoPaperPendingTab && (
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
// //                   RTO PAPER PENDING
// //                 </CNavLink>
// //               </CNavItem>
// //             )}
// //             {/* Only show COMPLETED tab if user has VIEW permission for it */}
// //             {canViewCompletedTab && (
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
// //                   COMPLETED
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

// //       <KYCDocuments
// //         open={showKycModal}
// //         onClose={() => setShowKycModal(false)}
// //         kycData={kycData}
// //         refreshData={refreshData}
// //         rtoId={selectedRtoId}
// //       />
// //     </div>
// //   );
// // }

// // export default RTOPaper;



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
// import { Link } from 'react-router-dom';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilZoom } from '@coreui/icons';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import KYCDocuments from './KYCDocuments';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext'; // FIXED IMPORT PATH

// function RTOPaper() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showKycModal, setShowKycModal] = useState(false);
//   const [kycData, setKycData] = useState(null);
//   const [selectedRtoId, setSelectedRtoId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level VIEW permission check for RTO Paper page
//   const canViewRTOPaper = hasSafePagePermission(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RTO_PAPER, 
//     ACTIONS.VIEW
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPaperPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.VIEW,
//     TABS.RTO_PAPER.RTO_PAPER_PENDING
//   );
  
//   const canViewCompletedTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.VIEW,
//     TABS.RTO_PAPER.COMPLETED
//   );
  
//   // Tab-level CREATE permission for RTO PAPER PENDING tab (for Upload KYC)
//   const canCreateInRtoPaperPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.CREATE,
//     TABS.RTO_PAPER.RTO_PAPER_PENDING
//   );
  
//   // Tab-level VIEW permission for RTO PAPER PENDING tab (for View button)
//   const canViewInRtoPaperPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.VIEW,
//     TABS.RTO_PAPER.RTO_PAPER_PENDING
//   );

//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewRtoPaperPendingTab || canViewCompletedTab;

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewRtoPaperPendingTab) visibleTabs.push(0);
//     if (canViewCompletedTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewRtoPaperPendingTab, canViewCompletedTab, activeTab]);

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
//     if (!canViewRTOPaper) {
//       showError('You do not have permission to view RTO Paper');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewRTOPaper]);

//   const fetchData = async () => {
//     if (!canViewRTOPaper) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
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
//     if (!canViewRTOPaper) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/rtopaperapproved`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleViewKYC = async (rtoItem) => {
//     // Check VIEW permission for the RTO PAPER PENDING tab
//     if (!canViewInRtoPaperPendingTab) {
//       showError('You do not have permission to view KYC documents');
//       return;
//     }
    
//     try {
//       const bookingId = rtoItem.bookingId?.id;
//       setSelectedRtoId(rtoItem._id);

//       if (!bookingId) {
//         showError('Booking ID not found');
//         return;
//       }

//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: rtoItem.documentStatus?.kyc?.status || 'PENDING',
//         chassisNumber: rtoItem.bookingId?.chassisNumber,
//         bookingNumber: rtoItem.bookingId?.bookingNumber,
//         customerName: rtoItem.bookingId?.customerName
//       };

//       setKycData(kycDataWithStatus);
//       setShowKycModal(true);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const refreshData = () => {
//     fetchData();
//     fetchLocationData();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewRtoPaperPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the RTO PAPER PENDING tab.
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
//               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>
//               {canViewInRtoPaperPendingTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canViewInRtoPaperPendingTab ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((rtoItem, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={rtoItem.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
//                       {rtoItem.rtoPaperStatus || 'Pending'}
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {!rtoItem.kycStatus || rtoItem.kycStatus === 'NOT_UPLOADED' || rtoItem.kycStatus === 'REJECTED' ? (
//                       canCreateInRtoPaperPendingTab ? (
//                         <Link
//                           to={`/upload-kyc/${rtoItem.bookingId?.id}`}
//                           state={{
//                             bookingId: rtoItem.bookingId?.id,
//                             customerName: rtoItem.bookingId?.customerName,
//                             address: `${rtoItem.bookingId?.customerAddress || ''}`,
//                             chassisNumber: rtoItem.bookingId?.chassisNumber
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <span className="text-muted">No permission</span>
//                       )
//                     ) : (
//                       <span className={`status-badge ${(rtoItem.kycStatus || '').toLowerCase()}`}>
//                         {rtoItem.kycStatus || 'N/A'}
//                       </span>
//                     )}
//                   </CTableDataCell>
//                   {canViewInRtoPaperPendingTab && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleViewKYC(rtoItem)}
//                       >
//                         <CIcon icon={cilZoom} className="me-1" />
//                         View
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
//     if (!canViewCompletedTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the COMPLETED tab.
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
//               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
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
//               filteredApproved.map((rtoItem, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={rtoItem.rtoPaperStatus === 'Submitted' ? 'success' : 'danger'} shape="rounded-pill">
//                       {rtoItem.rtoPaperStatus || 'Pending'}
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
//   if (!canViewRTOPaper) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Paper Management.
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
//       <div className='title'>RTO Paper Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one tab */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewRtoPaperPendingTab && (
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
//                       RTO PAPER PENDING
//                       {!canCreateInRtoPaperPendingTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompletedTab && (
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
//                       COMPLETED
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
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
//                     }}
//                     disabled={!canViewAnyTab}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewRtoPaperPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompletedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderCompletedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in RTO Paper.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       <KYCDocuments
//         open={showKycModal}
//         onClose={() => setShowKycModal(false)}
//         kycData={kycData}
//         refreshData={refreshData}
//         rtoId={selectedRtoId}
//       />
//     </div>
//   );
// }

// export default RTOPaper;







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
// import { Link } from 'react-router-dom';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilZoom } from '@coreui/icons';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import KYCDocuments from './KYCDocuments';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function RTOPaper() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showKycModal, setShowKycModal] = useState(false);
//   const [kycData, setKycData] = useState(null);
//   const [selectedRtoId, setSelectedRtoId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoadingId, setActionLoadingId] = useState(null);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level VIEW permission check for RTO Paper page
//   const canViewRTOPaper = hasSafePagePermission(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.RTO_PAPER, 
//     ACTIONS.VIEW
//   );

//   // Tab-level VIEW permission checks
//   const canViewRtoPaperPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.VIEW,
//     TABS.RTO_PAPER.RTO_PAPER_PENDING
//   );
  
//   const canViewCompletedTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.VIEW,
//     TABS.RTO_PAPER.COMPLETED
//   );
  
//   // Tab-level CREATE permission for RTO PAPER PENDING tab (for Upload KYC)
//   const canCreateInRtoPaperPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.CREATE,
//     TABS.RTO_PAPER.RTO_PAPER_PENDING
//   );
  
//   // Tab-level CREATE permission for COMPLETED tab (for OK button)
//   const canCreateInCompletedTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.CREATE,
//     TABS.RTO_PAPER.COMPLETED
//   );
  
//   // Tab-level VIEW permission for RTO PAPER PENDING tab (for View button)
//   const canViewInRtoPaperPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.RTO,
//     PAGES.RTO.RTO_PAPER,
//     ACTIONS.VIEW,
//     TABS.RTO_PAPER.RTO_PAPER_PENDING
//   );

//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewRtoPaperPendingTab || canViewCompletedTab;

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewRtoPaperPendingTab) visibleTabs.push(0);
//     if (canViewCompletedTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewRtoPaperPendingTab, canViewCompletedTab, activeTab]);

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
//     if (!canViewRTOPaper) {
//       showError('You do not have permission to view RTO Paper');
//       setLoading(false);
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, [canViewRTOPaper]);

//   const fetchData = async () => {
//     if (!canViewRTOPaper) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
//       setPendingData(response.data.data || []);
//       setFilteredPendings(response.data.data || []);
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
//     if (!canViewRTOPaper) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/rtoProcess/rtopaperapproved`);
//       setApprovedData(response.data.data || []);
//       setFilteredApproved(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleViewKYC = async (rtoItem) => {
//     // Check VIEW permission for the RTO PAPER PENDING tab
//     if (!canViewInRtoPaperPendingTab) {
//       showError('You do not have permission to view KYC documents');
//       return;
//     }
    
//     try {
//       const bookingId = rtoItem.bookingId?.id;
//       setSelectedRtoId(rtoItem._id);

//       if (!bookingId) {
//         showError('Booking ID not found');
//         return;
//       }

//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: rtoItem.documentStatus?.kyc?.status || 'PENDING',
//         chassisNumber: rtoItem.bookingId?.chassisNumber,
//         bookingNumber: rtoItem.bookingId?.bookingNumber,
//         customerName: rtoItem.bookingId?.customerName
//       };

//       setKycData(kycDataWithStatus);
//       setShowKycModal(true);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleApprovePaper = async (rtoId) => {
//     // Check CREATE permission for the COMPLETED tab
//     if (!canCreateInCompletedTab) {
//       showError('You do not have permission to approve papers');
//       return;
//     }
    
//     try {
//       setActionLoadingId(rtoId);
//       const response = await axiosInstance.post(`/rtoProcess/approve/${rtoId}/paper`);
      
//       if (response.data.success) {
//         showSuccess('Paper approved successfully!');
//         // Refresh the data after successful approval
//         await fetchLocationData();
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to approve paper';
//       showError(errorMessage);
//       if (errorMessage) {
//         setError(errorMessage);
//       }
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const refreshData = () => {
//     fetchData();
//     fetchLocationData();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewRtoPaperPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the RTO PAPER PENDING tab.
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
//               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>
//               {canViewInRtoPaperPendingTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canViewInRtoPaperPendingTab ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((rtoItem, index) => (
//                 <CTableRow key={rtoItem._id || index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={rtoItem.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
//                       {rtoItem.rtoPaperStatus || 'Pending'}
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {!rtoItem.kycStatus || rtoItem.kycStatus === 'NOT_UPLOADED' || rtoItem.kycStatus === 'REJECTED' ? (
//                       canCreateInRtoPaperPendingTab ? (
//                         <Link
//                           to={`/upload-kyc-rto/${rtoItem.bookingId?.id}`}
//                           state={{
//                             bookingId: rtoItem.bookingId?.id,
//                             customerName: rtoItem.bookingId?.customerName,
//                             address: `${rtoItem.bookingId?.customerAddress || ''}`,
//                             chassisNumber: rtoItem.bookingId?.chassisNumber
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <span className="text-muted">No permission</span>
//                       )
//                     ) : (
//                       <span className={`status-badge ${(rtoItem.kycStatus || '').toLowerCase()}`}>
//                         {rtoItem.kycStatus || 'N/A'}
//                       </span>
//                     )}
//                   </CTableDataCell>
//                   {canViewInRtoPaperPendingTab && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleViewKYC(rtoItem)}
//                       >
//                         <CIcon icon={cilZoom} className="me-1" />
//                         View
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
//     if (!canViewCompletedTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the COMPLETED tab.
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
//               <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
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
//               filteredApproved.map((rtoItem, index) => (
//                 <CTableRow key={rtoItem._id || index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
//                   <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={rtoItem.rtoPaperStatus === 'Submitted' ? 'success' : 'danger'} shape="rounded-pill">
//                       {rtoItem.rtoPaperStatus || 'Pending'}
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {rtoItem.displayStatus?.paper === 'Verified' ? (
//                       <span className="text-success fw-bold">Verified</span>
//                     ) : (
//                       canCreateInCompletedTab ? (
//                         <CButton 
//                           size="sm" 
//                           color="success"
//                           onClick={() => handleApprovePaper(rtoItem._id)}
//                           disabled={actionLoadingId === rtoItem._id}
//                         >
//                           {actionLoadingId === rtoItem._id ? (
//                             <>
//                               <CSpinner size="sm" className="me-1" />
//                               Processing...
//                             </>
//                           ) : (
//                             'OK'
//                           )}
//                         </CButton>
//                       ) : (
//                         <span className="text-muted">No permission</span>
//                       )
//                     )}
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
//   if (!canViewRTOPaper) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Paper Management.
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
//       <div className='title'>RTO Paper Management</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one tab */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewRtoPaperPendingTab && (
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
//                       RTO PAPER PENDING
//                       {!canCreateInRtoPaperPendingTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompletedTab && (
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
//                       COMPLETED
//                       {!canCreateInCompletedTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
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
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('rto'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('rto'));
//                     }}
//                     disabled={!canViewAnyTab}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewRtoPaperPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompletedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderCompletedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in RTO Paper.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       <KYCDocuments
//         open={showKycModal}
//         onClose={() => setShowKycModal(false)}
//         kycData={kycData}
//         refreshData={refreshData}
//         rtoId={selectedRtoId}
//       />
//     </div>
//   );
// }

// export default RTOPaper;





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
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol
} from '@coreui/react';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilZoom, cilSettings, cilList } from '@coreui/icons'; // Changed to cilSettings
import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import KYCDocuments from './KYCDocuments';

// Import the permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function RTOPaper() {
  const [activeTab, setActiveTab] = useState(0);
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycData, setKycData] = useState(null);
  const [selectedRtoId, setSelectedRtoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVahanModal, setShowVahanModal] = useState(false);
  const [vahanData, setVahanData] = useState(null);
  const [vahanLoading, setVahanLoading] = useState(false);
  const [vahanError, setVahanError] = useState(null);
  const [feedingLoading, setFeedingLoading] = useState(false);
  const { permissions } = useAuth();

  // Page-level VIEW permission check for RTO Paper page
  const canViewRTOPaper = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.RTO_PAPER, 
    ACTIONS.VIEW
  );

  // Tab-level VIEW permission checks
  const canViewRtoPaperPendingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RTO_PAPER,
    ACTIONS.VIEW,
    TABS.RTO_PAPER.RTO_PAPER_PENDING
  );
  
  const canViewCompletedTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RTO_PAPER,
    ACTIONS.VIEW,
    TABS.RTO_PAPER.COMPLETED
  );
  
  // Tab-level CREATE permission for RTO PAPER PENDING tab (for Upload KYC)
  const canCreateInRtoPaperPendingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RTO_PAPER,
    ACTIONS.CREATE,
    TABS.RTO_PAPER.RTO_PAPER_PENDING
  );
  
  // Tab-level CREATE permission for COMPLETED tab (for OK button)
  const canCreateInCompletedTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RTO_PAPER,
    ACTIONS.CREATE,
    TABS.RTO_PAPER.COMPLETED
  );
  
  // Tab-level VIEW permission for RTO PAPER PENDING tab (for View button)
  const canViewInRtoPaperPendingTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RTO_PAPER,
    ACTIONS.VIEW,
    TABS.RTO_PAPER.RTO_PAPER_PENDING
  );

  // Check if user can view at least one tab
  const canViewAnyTab = canViewRtoPaperPendingTab || canViewCompletedTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewRtoPaperPendingTab) visibleTabs.push(0);
    if (canViewCompletedTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewRtoPaperPendingTab, canViewCompletedTab, activeTab]);

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
    if (!canViewRTOPaper) {
      showError('You do not have permission to view RTO Paper');
      setLoading(false);
      return;
    }
    
    fetchData();
    fetchLocationData();
  }, [canViewRTOPaper]);

  const fetchData = async () => {
    if (!canViewRTOPaper) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/rtoProcess/rtopaperspending`);
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
    if (!canViewRTOPaper) {
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/rtoProcess/rtopaperapproved`);
      setApprovedData(response.data.data || []);
      setFilteredApproved(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleViewKYC = async (rtoItem) => {
    // Check VIEW permission for the RTO PAPER PENDING tab
    if (!canViewInRtoPaperPendingTab) {
      showError('You do not have permission to view KYC documents');
      return;
    }
    
    try {
      const bookingId = rtoItem.bookingId?.id;
      setSelectedRtoId(rtoItem._id);

      if (!bookingId) {
        showError('Booking ID not found');
        return;
      }

      const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);

      const kycDataWithStatus = {
        ...response.data.data,
        status: rtoItem.documentStatus?.kyc?.status || 'PENDING',
        chassisNumber: rtoItem.bookingId?.chassisNumber,
        bookingNumber: rtoItem.bookingId?.bookingNumber,
        customerName: rtoItem.bookingId?.customerName
      };

      setKycData(kycDataWithStatus);
      setShowKycModal(true);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleApprovePaper = async (rtoId) => {
    // Check CREATE permission for the COMPLETED tab
    if (!canCreateInCompletedTab) {
      showError('You do not have permission to approve papers');
      return;
    }
    
    try {
      setActionLoadingId(rtoId);
      const response = await axiosInstance.post(`/rtoProcess/approve/${rtoId}/paper`);
      
      if (response.data.success) {
        showSuccess('Paper approved successfully!');
        // Refresh the data after successful approval
        await fetchLocationData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve paper';
      showError(errorMessage);
      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Vahan Feeding button click
  const handleVahanFeeding = async (rtoItem) => {
    try {
      const bookingId = rtoItem.bookingId?.id;
      
      if (!bookingId) {
        showError('Booking ID not found');
        return;
      }

      setVahanLoading(true);
      setVahanError(null);
      
      // Fetch booking details for Vahan feeding
      const response = await axiosInstance.get(`/bookings/${bookingId}/vahan-feeding`);
      
      if (response.data.success) {
        setVahanData(response.data.data);
        setShowVahanModal(true);
      } else {
        showError('Failed to fetch Vahan feeding data');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch Vahan feeding data';
      setVahanError(errorMessage);
      showError(errorMessage);
    } finally {
      setVahanLoading(false);
    }
  };

  // Handle Vahan feed submit
  const handleFeedToVahan = async () => {
    try {
      setFeedingLoading(true);
      
      // You would call your API endpoint here to actually feed to Vahan
      // For example:
      // const response = await axiosInstance.post(`/bookings/${vahanData.bookingId}/feed-to-vahan`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess('Vehicle fed to VAHAN successfully!');
      setShowVahanModal(false);
      setVahanData(null);
      
      // Refresh the data
      refreshData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to feed to VAHAN';
      showError(errorMessage);
    } finally {
      setFeedingLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
    fetchLocationData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewRtoPaperPendingTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the RTO PAPER PENDING tab.
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
              <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
              <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>
              {canViewInRtoPaperPendingTab && (
                <CTableHeaderCell scope="col" colSpan="2">Actions</CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canViewInRtoPaperPendingTab ? "10" : "8"} style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((rtoItem, index) => (
                <CTableRow key={rtoItem._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={rtoItem.rtoPaperStatus === 'Not Submitted' ? 'danger' : 'secondary'} shape="rounded-pill">
                      {rtoItem.rtoPaperStatus || 'Pending'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {!rtoItem.kycStatus || rtoItem.kycStatus === 'NOT_UPLOADED' || rtoItem.kycStatus === 'REJECTED' ? (
                      canCreateInRtoPaperPendingTab ? (
                        <Link
                          to={`/upload-kyc-rto/${rtoItem.bookingId?.id}`}
                          state={{
                            bookingId: rtoItem.bookingId?.id,
                            customerName: rtoItem.bookingId?.customerName,
                            address: `${rtoItem.bookingId?.customerAddress || ''}`,
                            chassisNumber: rtoItem.bookingId?.chassisNumber
                          }}
                        >
                          <CButton size="sm" className="upload-kyc-btn icon-only">
                            <CIcon icon={cilCloudUpload} />
                          </CButton>
                        </Link>
                      ) : (
                        <span className="text-muted">No permission</span>
                      )
                    ) : (
                      <span className={`status-badge ${(rtoItem.kycStatus || '').toLowerCase()}`}>
                        {rtoItem.kycStatus || 'N/A'}
                      </span>
                    )}
                  </CTableDataCell>
                  {canViewInRtoPaperPendingTab && (
                    <>
                      <CTableDataCell>
                        <CButton 
                          size="sm" 
                          className="action-btn"
                          onClick={() => handleViewKYC(rtoItem)}
                        >
                          <CIcon icon={cilZoom} className="me-1" />
                          View
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          size="sm" 
                          color="info"
                          className="action-btn"
                          onClick={() => handleVahanFeeding(rtoItem)}
                          disabled={vahanLoading}
                        >
                          <CIcon icon={cilSettings} className="me-1" />
                          Vahan Feeding
                        </CButton>
                      </CTableDataCell>
                    </>
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
    if (!canViewCompletedTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the COMPLETED tab.
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
              <CTableHeaderCell scope="col">RTO Paper</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
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
              filteredApproved.map((rtoItem, index) => (
                <CTableRow key={rtoItem._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.model?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.chassisNumber || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.customerName || ''}</CTableDataCell>
                  <CTableDataCell>{rtoItem.bookingId?.customerMobile || ''}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={rtoItem.rtoPaperStatus === 'Submitted' ? 'success' : 'danger'} shape="rounded-pill">
                      {rtoItem.rtoPaperStatus || 'Pending'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {rtoItem.displayStatus?.paper === 'Verified' ? (
                      <span className="text-success fw-bold">Verified</span>
                    ) : (
                      canCreateInCompletedTab ? (
                        <CButton 
                          size="sm" 
                          color="success"
                          onClick={() => handleApprovePaper(rtoItem._id)}
                          disabled={actionLoadingId === rtoItem._id}
                        >
                          {actionLoadingId === rtoItem._id ? (
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
  if (!canViewRTOPaper) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view RTO Paper Management.
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
      <div className='title'>RTO Paper Management</div>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one tab */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewRtoPaperPendingTab && (
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
                      RTO PAPER PENDING
                      {!canCreateInRtoPaperPendingTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletedTab && (
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
                      COMPLETED
                      {!canCreateInCompletedTab && (
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
                {canViewRtoPaperPendingTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewCompletedTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderCompletedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in RTO Paper.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <KYCDocuments
        open={showKycModal}
        onClose={() => setShowKycModal(false)}
        kycData={kycData}
        refreshData={refreshData}
        rtoId={selectedRtoId}
      />

      {/* Vahan Feeding Modal */}
      <CModal
        visible={showVahanModal}
        onClose={() => {
          setShowVahanModal(false);
          setVahanData(null);
          setVahanError(null);
        }}
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilSettings} className="me-2" />
            Vahan Feeding Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {vahanLoading && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Loading booking details...</p>
            </div>
          )}
          
          {vahanError && (
            <CAlert color="danger">
              {vahanError}
            </CAlert>
          )}

          {vahanData && (
            <>
              {/* Eligibility Warning */}
              {vahanData.warnings && vahanData.warnings.length > 0 && (
                <CAlert color="warning">
                  <strong>Warning:</strong> {vahanData.warnings[0]}
                </CAlert>
              )}

              <CRow className="mb-3">
                <CCol md="6">
                  <h6 className="text-muted mb-1">Booking Information</h6>
                  <div className="bg-light p-2 rounded">
                    <div><strong>Booking Number:</strong> {vahanData.bookingNumber}</div>
                    <div><strong>Booking Type:</strong> {vahanData.bookingType}</div>
                    <div><strong>Status:</strong> {vahanData.bookingStatus}</div>
                    <div><strong>Created:</strong> {new Date(vahanData.createdAt).toLocaleDateString()}</div>
                  </div>
                </CCol>
                <CCol md="6">
                  <h6 className="text-muted mb-1">Vehicle Information</h6>
                  <div className="bg-light p-2 rounded">
                    <div><strong>Model:</strong> {vahanData.vehicle?.modelName}</div>
                    <div><strong>Chassis:</strong> {vahanData.vehicle?.chassisNumber}</div>
                    <div><strong>Engine:</strong> {vahanData.vehicle?.engineNumber}</div>
                    <div><strong>Color:</strong> {vahanData.vehicle?.colorName}</div>
                  </div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md="6">
                  <h6 className="text-muted mb-1">Customer Information</h6>
                  <div className="bg-light p-2 rounded">
                    <div><strong>Name:</strong> {vahanData.customer?.fullName || vahanData.customer?.name}</div>
                    <div><strong>Mobile:</strong> {vahanData.customer?.mobile1}</div>
                    <div><strong>Address:</strong> {vahanData.customer?.address}</div>
                    <div><strong>District:</strong> {vahanData.customer?.district}</div>
                    <div><strong>Pincode:</strong> {vahanData.customer?.pincode}</div>
                  </div>
                </CCol>
                <CCol md="6">
                  <h6 className="text-muted mb-1">RTO Information</h6>
                  <div className="bg-light p-2 rounded">
                    <div><strong>RTO Type:</strong> {vahanData.rto?.type}</div>
                    <div><strong>RTO Code:</strong> {vahanData.rto?.code}</div>
                    <div><strong>Status:</strong> 
                      <CBadge color={vahanData.rto?.status === 'completed' ? 'success' : 'warning'} className="ms-2">
                        {vahanData.rto?.status}
                      </CBadge>
                    </div>
                    <div><strong>Amount:</strong> ₹{vahanData.rto?.amount?.toLocaleString()}</div>
                  </div>
                </CCol>
              </CRow>

              {/* Payment Information */}
              <CRow className="mb-3">
                <CCol md="6">
                  <h6 className="text-muted mb-1">Payment Details</h6>
                  <div className="bg-light p-2 rounded">
                    <div><strong>Total:</strong> ₹{vahanData.payment?.totalAmount?.toLocaleString()}</div>
                    <div><strong>Discounted:</strong> ₹{vahanData.payment?.discountedAmount?.toLocaleString()}</div>
                    <div><strong>Received:</strong> ₹{vahanData.payment?.receivedAmount?.toLocaleString()}</div>
                    <div><strong>Balance:</strong> ₹{vahanData.payment?.balanceAmount?.toLocaleString()}</div>
                    <div><strong>GC Amount:</strong> ₹{vahanData.payment?.gcAmount?.toLocaleString()}</div>
                  </div>
                </CCol>
                <CCol md="6">
                  <h6 className="text-muted mb-1">Financing Information</h6>
                  <div className="bg-light p-2 rounded">
                    <div><strong>Type:</strong> {vahanData.payment?.type}</div>
                    {vahanData.payment?.isFinance && (
                      <>
                        <div>
                          <strong>HPA:</strong>
                          {vahanData.payment?.hpa?.applicable ? (
                            <span className="text-success ms-2">
                              ✓ Applicable
                            </span>
                          ) : (
                            <span className="text-danger fw-bold ms-2">
                              NO HPA
                            </span>
                          )}
                        </div>
                        {vahanData.payment?.hpa?.applicable && vahanData.payment?.hpa?.financer && (
                          <div>
                            <strong>Financer:</strong> {vahanData.payment.hpa.financer.name}
                          </div>
                        )}
                      </>
                    )}
                    {vahanData.payment?.hpa?.display?.message && (
                      <div className="text-muted small mt-1">
                        <CIcon icon={cilList} className="me-1" />
                        {vahanData.payment.hpa.display.message}
                      </div>
                    )}
                  </div>
                </CCol>
              </CRow>

              {/* Eligibility */}
              {vahanData.eligibility && (
                <CRow className="mb-3">
                  <CCol md="12">
                    <h6 className="text-muted mb-1">Eligibility</h6>
                    <div className="bg-light p-2 rounded">
                      <div>
                        <strong>Can feed to VAHAN:</strong>
                        {vahanData.eligibility.canFeedToVAHAN ? (
                          <CBadge color="success" className="ms-2">Yes</CBadge>
                        ) : (
                          <CBadge color="danger" className="ms-2">No</CBadge>
                        )}
                      </div>
                      <div className="small mt-1">
                        <div>✓ RTO Complete: {vahanData.eligibility.isRTOComplete ? 'Yes' : 'No'}</div>
                        <div>✓ Has Chassis: {vahanData.eligibility.hasChassis ? 'Yes' : 'No'}</div>
                        <div>✓ Has Customer Details: {vahanData.eligibility.hasCustomerDetails ? 'Yes' : 'No'}</div>
                        <div>✓ Has Model: {vahanData.eligibility.hasModel ? 'Yes' : 'No'}</div>
                        <div>✓ Is Approved: {vahanData.eligibility.isApproved ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setShowVahanModal(false);
              setVahanData(null);
              setVahanError(null);
            }}
          >
            Close
          </CButton>
          {vahanData && vahanData.eligibility?.canFeedToVAHAN && (
            <CButton 
              color="success" 
              onClick={handleFeedToVahan}
              disabled={feedingLoading}
            >
              {feedingLoading ? (
                <>
                  <CSpinner size="sm" className="me-1" />
                  Feeding...
                </>
              ) : (
                'Feed to VAHAN'
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default RTOPaper;