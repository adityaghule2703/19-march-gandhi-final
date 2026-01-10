// import '../../css/table.css';
// import '../../css/form.css';
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
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CListGroup,
//   CListGroupItem,
//   CRow,
//   CCol,
//   CFormTextarea,
//   CFormLabel,
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCheckCircle,
//   cilXCircle,
//   cilImage,
//   cilCalendar,
//   cilLocationPin,
//   cilViewColumn,
//   cilReload
// } from '@coreui/icons';
// import {
//   useTableFilter,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import {
//   Menu,
//   MenuItem,
//   IconButton
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const StockAuditList = () => {
//   // Tab states
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Menu states
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
  
//   // Loading states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [verifyingId, setVerifyingId] = useState(null);
  
//   // Photo viewer modal states
//   const [showPhotoModal, setShowPhotoModal] = useState(false);
//   const [selectedAuditPhotos, setSelectedAuditPhotos] = useState([]);
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
//   // Review modal states
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [selectedAuditId, setSelectedAuditId] = useState(null);
//   const [reviewAction, setReviewAction] = useState('');
//   const [verificationNotes, setVerificationNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
  
//   // Message states
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
//   // Permissions
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Subdealer Stock Audit page under Subdealer module
//   const canViewStockAudit = canViewPage(permissions, MODULES.SUBDEALER, PAGES.SUBDEALER.STOCK_AUDIT);
//   // Approve action = CREATE permission (creating approval record)
//   const canApproveStockAudit = canCreateInPage(permissions, MODULES.SUBDEALER, PAGES.SUBDEALER.STOCK_AUDIT);
//   // Reject action = DELETE permission (rejecting/removing audit)
//   const canRejectStockAudit = canDeleteInPage(permissions, MODULES.SUBDEALER, PAGES.SUBDEALER.STOCK_AUDIT);
  
//   // Show action column if user can approve OR reject
//   const showActionColumn = canApproveStockAudit || canRejectStockAudit;

//   // Data for different tabs
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: verifiedData,
//     setData: setVerifiedData,
//     filteredData: filteredVerified,
//     setFilteredData: setFilteredVerified,
//     handleFilter: handleVerifiedFilter
//   } = useTableFilter([]);

//   const {
//     data: rejectedData,
//     setData: setRejectedData,
//     filteredData: filteredRejected,
//     setFilteredData: setFilteredRejected,
//     handleFilter: handleRejectedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     if (!canViewStockAudit) {
//       showError('You do not have permission to view Stock Audit List');
//       return;
//     }
    
//     fetchData();
//   }, [refreshTrigger, canViewStockAudit]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setMessage({ type: '', text: '' });
//       const response = await axiosInstance.get('/stock-audits');
//       const stockAudits = response.data.data.stockAudits || [];
      
//       // Filter data by status
//       const pendingAudits = stockAudits.filter(audit => 
//         audit.status === 'pending' || audit.status === 'draft' || audit.status === 'submitted'
//       );
//       const verifiedAudits = stockAudits.filter(audit => audit.status === 'verified');
//       const rejectedAudits = stockAudits.filter(audit => audit.status === 'rejected');
      
//       setPendingData(pendingAudits);
//       setFilteredPending(pendingAudits);
      
//       setVerifiedData(verifiedAudits);
//       setFilteredVerified(verifiedAudits);
      
//       setRejectedData(rejectedAudits);
//       setFilteredRejected(rejectedAudits);
      
//     } catch (error) {
//       console.log('Error fetching stock audit data', error);
//       const errorMsg = error.message || 'Failed to fetch stock audits';
//       setError(errorMsg);
//       showError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = () => {
//     setRefreshTrigger(prev => prev + 1);
//     setMessage({ type: 'info', text: 'Refreshing data...' });
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     const searchFields = ['subdealerDetails.name', 'subdealerDetails.location', 'address', 'userDetails.name'];
    
//     switch(activeTab) {
//       case 0: // Submitted tab
//         handlePendingFilter(searchValue, searchFields);
//         break;
//       case 1: // Verified tab
//         handleVerifiedFilter(searchValue, searchFields);
//         break;
//       case 2: // Rejected tab
//         handleRejectedFilter(searchValue, searchFields);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleMenuClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const openReviewModal = (auditId, action) => {
//     // Check permissions based on action
//     if (action === 'approve' && !canApproveStockAudit) {
//       showError('You do not have permission to approve stock audits');
//       return;
//     }
    
//     if (action === 'reject' && !canRejectStockAudit) {
//       showError('You do not have permission to reject stock audits');
//       return;
//     }
    
//     setSelectedAuditId(auditId);
//     setReviewAction(action);
//     setVerificationNotes('');
//     setRejectionReason('');
//     setShowReviewModal(true);
//     handleMenuClose();
//   };

//   const closeReviewModal = () => {
//     setShowReviewModal(false);
//     setSelectedAuditId(null);
//     setReviewAction('');
//     setVerificationNotes('');
//     setRejectionReason('');
//   };

//   const handleSubmitReview = async () => {
//     if (!selectedAuditId) return;

//     // Check permissions based on action
//     if (reviewAction === 'approve' && !canApproveStockAudit) {
//       showError('You do not have permission to approve stock audits');
//       return;
//     }
    
//     if (reviewAction === 'reject' && !canRejectStockAudit) {
//       showError('You do not have permission to reject stock audits');
//       return;
//     }

//     try {
//       setVerifyingId(selectedAuditId);
//       setMessage({ type: 'info', text: `${reviewAction === 'approve' ? 'Approving' : 'Rejecting'} stock audit...` });
      
//       const reviewData = {
//         action: reviewAction,
//         verificationNotes: verificationNotes
//       };

//       if (reviewAction === 'reject' && rejectionReason) {
//         reviewData.rejectionReason = rejectionReason;
//       }

//       // Use PATCH instead of POST as shown in your code
//       await axiosInstance.patch(`/stock-audits/${selectedAuditId}/review`, reviewData);
      
//       // Show success message
//       const successMsg = `Stock audit ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`;
//       showSuccess(successMsg);
//       setMessage({ type: 'success', text: successMsg });
      
//       // Close modal
//       closeReviewModal();
      
//       // Refresh data to get updated status
//       setTimeout(() => {
//         refreshData();
//       }, 500);
      
//     } catch (error) {
//       console.error('Error reviewing stock audit:', error);
//       const errorMsg = error.response?.data?.message || 'Failed to update stock audit status';
//       showError(errorMsg);
//       setMessage({ type: 'danger', text: errorMsg });
//     } finally {
//       setVerifyingId(null);
//     }
//   };

//   // Photo viewer functions
//   const openPhotoViewer = (audit) => {
//     if (!canViewStockAudit) {
//       showError('You do not have permission to view photos');
//       return;
//     }
    
//     const photos = audit.vehiclesPhotos || [];
//     if (photos.length > 0) {
//       setSelectedAuditPhotos(photos);
//       setCurrentPhotoIndex(0);
//       setShowPhotoModal(true);
//     }
//   };

//   const closePhotoViewer = () => {
//     setShowPhotoModal(false);
//     setSelectedAuditPhotos([]);
//     setCurrentPhotoIndex(0);
//   };

//   const goToNextPhoto = () => {
//     setCurrentPhotoIndex(prev => 
//       prev === selectedAuditPhotos.length - 1 ? 0 : prev + 1
//     );
//   };

//   const goToPreviousPhoto = () => {
//     setCurrentPhotoIndex(prev => 
//       prev === 0 ? selectedAuditPhotos.length - 1 : prev - 1
//     );
//   };

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case 'verified':
//         return <CBadge color="success">Verified</CBadge>;
//       case 'pending':
//       case 'draft':
//       case 'submitted':
//         return <CBadge color="warning">Pending</CBadge>;
//       case 'rejected':
//         return <CBadge color="danger">Rejected</CBadge>;
//       default:
//         return <CBadge color="secondary">{status}</CBadge>;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return '';
    
//     // Check if imagePath is already a full URL
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }
    
//     // Remove leading slash if present to avoid double slashes
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
//     // Use a direct base URL - replace with your actual API URL
//     const baseUrl = 'https://gandhitvs.in/dealership/api/v1';
    
//     // Construct the full URL
//     return `${baseUrl}/${cleanPath}`;
//   };

//   // Render photo details
//   const renderPhotoDetails = (photo) => {
//     if (!photo) return null;
    
//     return (
//       <CListGroup flush className="mt-3">
//         <CListGroupItem className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="fw-semibold">Address:</span>
//           </div>
//           <span className="text-end" style={{ maxWidth: '70%' }}>
//             {photo.address || 'N/A'}
//           </span>
//         </CListGroupItem>
        
//         <CListGroupItem className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="fw-semibold">Timestamp:</span>
//           </div>
//           <span>{formatDateTime(photo.timestamp)}</span>
//         </CListGroupItem>
        
//         <CListGroupItem className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="fw-semibold">Chassis No:</span>
//           </div>
//           <span>{photo.chassisNumber || 'N/A'}</span>
//         </CListGroupItem>
        
//         {photo.remarks && (
//           <CListGroupItem className="d-flex justify-content-between align-items-start">
//             <div className="d-flex align-items-center">
//               <span className="fw-semibold">Remarks:</span>
//             </div>
//             <span className="text-end" style={{ maxWidth: '70%' }}>
//               {photo.remarks}
//             </span>
//           </CListGroupItem>
//         )}
//       </CListGroup>
//     );
//   };

//   // Common table rendering function
//   const renderTable = (data, showActions = false) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell>Sr.no</CTableHeaderCell>
//               <CTableHeaderCell>Audit Date</CTableHeaderCell>
//               <CTableHeaderCell>Subdealer</CTableHeaderCell>
//               <CTableHeaderCell>Location</CTableHeaderCell>
//               <CTableHeaderCell>Total Vehicles</CTableHeaderCell>
//               <CTableHeaderCell>Photos</CTableHeaderCell>
//               <CTableHeaderCell>Status</CTableHeaderCell>
//               <CTableHeaderCell>Conducted By</CTableHeaderCell>
//               {showActions && <CTableHeaderCell>Actions</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {data.length > 0 ? (
//               data.map((audit, index) => (
//                 <CTableRow key={audit._id}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>
//                     <strong>{formatDate(audit.auditDate)}</strong>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="fw-semibold">{audit.subdealerDetails?.name || 'N/A'}</div>
//                     <div className="text-muted small">{audit.subdealerDetails?.type || ''}</div>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="text-truncate" style={{ maxWidth: '200px' }} title={audit.address}>
//                       {audit.address?.split(',')[0] || 'N/A'}
//                     </div>
//                     {audit.subdealerDetails?.location && (
//                       <div className="text-muted small">{audit.subdealerDetails.location}</div>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <span className="badge bg-primary rounded-pill px-3 py-1">
//                       {audit.totalVehicles || 0}
//                     </span>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="d-flex">
//                       {audit.vehiclesPhotos?.length > 0 ? (
//                         <CButton 
//                           size="sm" 
//                           color="primary" 
//                           variant="outline"
//                           onClick={() => openPhotoViewer(audit)}
//                           className="d-flex align-items-center"
//                           disabled={!canViewStockAudit}
//                         >
//                           <CIcon icon={cilImage} className="me-1" />
//                           View Photos ({audit.vehiclesPhotos.length})
//                         </CButton>
//                       ) : (
//                         <span className="text-muted small">No photos</span>
//                       )}
//                     </div>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {getStatusBadge(audit.status)}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="small">
//                       <div>{audit.userDetails?.name || 'N/A'}</div>
//                     </div>
//                   </CTableDataCell>
//                   {showActions && (
//                     <CTableDataCell>
//                       <div className="d-flex align-items-center">
//                         <IconButton
//                           size="small"
//                           onClick={(event) => handleMenuClick(event, audit._id)}
//                           disabled={
//                             verifyingId === audit._id || 
//                             (!canApproveStockAudit && !canRejectStockAudit)
//                           }
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                         <Menu
//                           anchorEl={anchorEl}
//                           open={menuId === audit._id}
//                           onClose={handleMenuClose}
//                         >
//                           {canApproveStockAudit && (
//                             <MenuItem 
//                               onClick={() => openReviewModal(audit._id, 'approve')}
//                               disabled={verifyingId === audit._id}
//                             >
//                               <CIcon icon={cilCheckCircle} className="me-2 text-success" />
//                               {verifyingId === audit._id ? 'Approving...' : 'Approve'}
//                             </MenuItem>
//                           )}
//                           {canRejectStockAudit && (
//                             <MenuItem 
//                               onClick={() => openReviewModal(audit._id, 'reject')}
//                               disabled={verifyingId === audit._id}
//                             >
//                               <CIcon icon={cilXCircle} className="me-2 text-danger" />
//                               {verifyingId === audit._id ? 'Rejecting...' : 'Reject'}
//                             </MenuItem>
//                           )}
//                         </Menu>
//                       </div>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             ) : (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={showActions ? "10" : "9"} 
//                   className="text-center py-4"
//                 >
//                   No stock audits found
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (!canViewStockAudit) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Stock Audit List.
//       </div>
//     );
//   }

//   if (loading && !refreshTrigger) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Stock Audit List</div>
    
//       {/* Message Alert */}
//       {message.text && (
//         <CAlert 
//           color={message.type} 
//           className="mb-3"
//           dismissible
//           onClose={() => setMessage({ type: '', text: '' })}
//         >
//           {message.text}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div className='d-flex align-items-center'>
//             <CIcon icon={cilViewColumn} className='me-2' />
//             <h5 className='mb-0'>Stock Audits</h5>
//           </div>
//           <div className='d-flex align-items-center'>
//             <CButton 
//               color="light" 
//               variant="outline" 
//               size="sm" 
//               onClick={refreshData}
//               className="me-2"
//               disabled={loading && refreshTrigger > 0}
//             >
//               <CIcon icon={cilReload} className={loading && refreshTrigger > 0 ? 'spin' : ''} />
//             </CButton>
//             <CFormLabel className='me-2 mb-0'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               placeholder="Search..."
//               className="square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               style={{ width: '250px' }}
//               disabled={!canViewStockAudit}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {error && !loading && (
//             <CAlert color="danger" className="mb-3">
//               Error loading stock audits: {error}
//               <CButton 
//                 color="link" 
//                 size="sm" 
//                 onClick={refreshData}
//                 className="p-0 ms-2"
//               >
//                 Try Again
//               </CButton>
//             </CAlert>
//           )}
          
//           {/* Permissions Alert */}
//           {canViewStockAudit && !showActionColumn && (
//             <CAlert color="warning" className="mb-3">
//               You have VIEW permission but cannot approve or reject stock audits.
//             </CAlert>
//           )}
          
//           {/* Tabs Navigation */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 0}
//                 onClick={() => handleTabChange(0)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                   color: 'black',
//                   borderBottom: 'none',
//                   fontWeight: activeTab === 0 ? '600' : 'normal'
//                 }}
//               >
//                 SUBMITTED ({filteredPending.length})
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
//                   color: 'black',
//                   fontWeight: activeTab === 1 ? '600' : 'normal'
//                 }}
//               >
//                 APPROVED ({filteredVerified.length})
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
//                   color: 'black',
//                   fontWeight: activeTab === 2 ? '600' : 'normal'
//                 }}
//               >
//                 REJECTED ({filteredRejected.length})
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           {/* Loading indicator for refresh */}
//           {loading && refreshTrigger > 0 && (
//             <div className="text-center mb-3">
//               <CSpinner size="sm" color="primary" className="me-2" />
//               <small>Refreshing data...</small>
//             </div>
//           )}

//           {/* Tab Content */}
//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderTable(filteredPending, true)}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderTable(filteredVerified, false)}
//             </CTabPane>
//             <CTabPane visible={activeTab === 2}>
//               {renderTable(filteredRejected, false)}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Photo Viewer Modal */}
//       <CModal 
//         visible={showPhotoModal} 
//         onClose={closePhotoViewer}
//         size="xl"
//         backdrop="static"
//         className="photo-viewer-modal"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             Stock Audit Photos ({currentPhotoIndex + 1} of {selectedAuditPhotos.length})
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedAuditPhotos[currentPhotoIndex] && (
//             <>
//               <CRow>
//                 <CCol lg="8">
//                   <div className="photo-container text-center mb-4">
//                     <img
//                       src={getImageUrl(selectedAuditPhotos[currentPhotoIndex].imageUrl)}
//                       alt={`Photo ${currentPhotoIndex + 1}`}
//                       style={{
//                         maxWidth: '100%',
//                         maxHeight: '600px',
//                         minHeight: '400px',
//                         width: 'auto',
//                         height: 'auto',
//                         objectFit: 'contain',
//                         borderRadius: '8px'
//                       }}
//                       className="img-fluid shadow"
//                     />
//                   </div>
                  
//                   <div className="photo-navigation d-flex justify-content-center mb-4">
//                     <CButton 
//                       color="secondary" 
//                       variant="outline" 
//                       onClick={goToPreviousPhoto}
//                       className="me-3 px-4"
//                     >
//                       Previous
//                     </CButton>
//                     <CButton 
//                       color="secondary" 
//                       variant="outline" 
//                       onClick={goToNextPhoto}
//                       className="px-4"
//                     >
//                       Next
//                     </CButton>
//                   </div>
//                 </CCol>
                
//                 <CCol lg="4">
//                   <div className="photo-details-card">
//                     <h6 className="mb-3">Photo Details</h6>
//                     {renderPhotoDetails(selectedAuditPhotos[currentPhotoIndex])}
//                   </div>
//                 </CCol>
//               </CRow>
              
//               {/* Thumbnails */}
//               <div className="photo-thumbnails mt-4">
//                 <h6 className="mb-2">All Photos</h6>
//                 <div className="d-flex flex-wrap gap-2">
//                   {selectedAuditPhotos.map((photo, index) => (
//                     <CButton
//                       key={photo._id}
//                       color={index === currentPhotoIndex ? "primary" : "light"}
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPhotoIndex(index)}
//                       className="p-1"
//                     >
//                       <img
//                         src={getImageUrl(photo.imageUrl)}
//                         alt={`Thumbnail ${index + 1}`}
//                         style={{
//                           width: '80px',
//                           height: '80px',
//                           objectFit: 'cover',
//                           borderRadius: '4px'
//                         }}
//                       />
//                     </CButton>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={closePhotoViewer}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Review Modal */}
//       <CModal 
//         visible={showReviewModal} 
//         onClose={closeReviewModal}
//         backdrop="static"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             {reviewAction === 'approve' ? 'Approve' : 'Reject'} Stock Audit
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">
//               Verification Notes
//               <span className="text-muted"> (Optional)</span>
//             </label>
//             <CFormTextarea
//               placeholder="Enter verification notes..."
//               value={verificationNotes}
//               onChange={(e) => setVerificationNotes(e.target.value)}
//               rows={3}
//             />
//           </div>
          
//           {reviewAction === 'reject' && (
//             <div className="mb-3">
//               <label className="form-label">
//                 Rejection Reason
//                 <span className="text-danger"> *</span>
//               </label>
//               <CFormTextarea
//                 placeholder="Enter reason for rejection..."
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//                 rows={3}
//                 required
//               />
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={closeReviewModal} disabled={verifyingId === selectedAuditId}>
//             Cancel
//           </CButton>
//           <CButton 
//             color={reviewAction === 'approve' ? 'success' : 'danger'} 
//             onClick={handleSubmitReview}
//             disabled={
//               verifyingId === selectedAuditId || 
//               (reviewAction === 'reject' && !rejectionReason.trim())
//             }
//           >
//             {verifyingId === selectedAuditId ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 {reviewAction === 'approve' ? 'Approving...' : 'Rejecting...'}
//               </>
//             ) : (
//               reviewAction === 'approve' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockAuditList;










// import '../../css/table.css';
// import '../../css/form.css';
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
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CListGroup,
//   CListGroupItem,
//   CRow,
//   CCol,
//   CFormTextarea,
//   CFormLabel,
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCheckCircle,
//   cilXCircle,
//   cilImage,
//   cilCalendar,
//   cilLocationPin,
//   cilViewColumn,
//   cilReload
// } from '@coreui/icons';
// import {
//   useTableFilter,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import {
//   Menu,
//   MenuItem,
//   IconButton
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES,
//   TABS, // Add TABS import
//   ACTIONS
// } from '../../utils/modulePermissions';

// const StockAuditList = () => {
//   // Tab states
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Menu states
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
  
//   // Loading states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [verifyingId, setVerifyingId] = useState(null);
  
//   // Photo viewer modal states
//   const [showPhotoModal, setShowPhotoModal] = useState(false);
//   const [selectedAuditPhotos, setSelectedAuditPhotos] = useState([]);
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
//   // Review modal states
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [selectedAuditId, setSelectedAuditId] = useState(null);
//   const [reviewAction, setReviewAction] = useState('');
//   const [verificationNotes, setVerificationNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
  
//   // Message states
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
//   // Permissions
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Subdealer Stock Audit page under Subdealer module
//   const canViewStockAudit = canViewPage(permissions, MODULES.SUBDEALER, PAGES.SUBDEALER.STOCK_AUDIT);
  
//   // Tab-level VIEW permission checks
//   const canViewSubmittedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER,
//     PAGES.SUBDEALER.STOCK_AUDIT,
//     ACTIONS.VIEW,
//     TABS.STOCK_AUDIT.SUBMITTED // Assuming this constant exists in TABS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER,
//     PAGES.SUBDEALER.STOCK_AUDIT,
//     ACTIONS.VIEW,
//     TABS.STOCK_AUDIT.APPROVED // Assuming this constant exists in TABS
//   );
  
//   const canViewRejectedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER,
//     PAGES.SUBDEALER.STOCK_AUDIT,
//     ACTIONS.VIEW,
//     TABS.STOCK_AUDIT.REJECTED // Assuming this constant exists in TABS
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewSubmittedTab) availableTabs.push(0);
//     if (canViewApprovedTab) availableTabs.push(1);
//     if (canViewRejectedTab) availableTabs.push(2);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewSubmittedTab, canViewApprovedTab, canViewRejectedTab, activeTab]);

//   // Approve action = CREATE permission (creating approval record)
//   const canApproveStockAudit = canCreateInPage(permissions, MODULES.SUBDEALER, PAGES.SUBDEALER.STOCK_AUDIT);
//   // Reject action = DELETE permission (rejecting/removing audit)
//   const canRejectStockAudit = canDeleteInPage(permissions, MODULES.SUBDEALER, PAGES.SUBDEALER.STOCK_AUDIT);
  
//   // Show action column if user can approve OR reject
//   const showActionColumn = canApproveStockAudit || canRejectStockAudit;

//   // Data for different tabs
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: verifiedData,
//     setData: setVerifiedData,
//     filteredData: filteredVerified,
//     setFilteredData: setFilteredVerified,
//     handleFilter: handleVerifiedFilter
//   } = useTableFilter([]);

//   const {
//     data: rejectedData,
//     setData: setRejectedData,
//     filteredData: filteredRejected,
//     setFilteredData: setFilteredRejected,
//     handleFilter: handleRejectedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     if (!canViewStockAudit) {
//       showError('You do not have permission to view Stock Audit List');
//       return;
//     }
    
//     fetchData();
//   }, [refreshTrigger, canViewStockAudit]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setMessage({ type: '', text: '' });
//       const response = await axiosInstance.get('/stock-audits');
//       const stockAudits = response.data.data.stockAudits || [];
      
//       // Filter data by status
//       const pendingAudits = stockAudits.filter(audit => 
//         audit.status === 'pending' || audit.status === 'draft' || audit.status === 'submitted'
//       );
//       const verifiedAudits = stockAudits.filter(audit => audit.status === 'verified');
//       const rejectedAudits = stockAudits.filter(audit => audit.status === 'rejected');
      
//       setPendingData(pendingAudits);
//       setFilteredPending(pendingAudits);
      
//       setVerifiedData(verifiedAudits);
//       setFilteredVerified(verifiedAudits);
      
//       setRejectedData(rejectedAudits);
//       setFilteredRejected(rejectedAudits);
      
//     } catch (error) {
//       console.log('Error fetching stock audit data', error);
//       const errorMsg = error.message || 'Failed to fetch stock audits';
//       setError(errorMsg);
//       showError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = () => {
//     setRefreshTrigger(prev => prev + 1);
//     setMessage({ type: 'info', text: 'Refreshing data...' });
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     const searchFields = ['subdealerDetails.name', 'subdealerDetails.location', 'address', 'userDetails.name'];
    
//     switch(activeTab) {
//       case 0: // Submitted tab
//         handlePendingFilter(searchValue, searchFields);
//         break;
//       case 1: // Verified tab
//         handleVerifiedFilter(searchValue, searchFields);
//         break;
//       case 2: // Rejected tab
//         handleRejectedFilter(searchValue, searchFields);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleMenuClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const openReviewModal = (auditId, action) => {
//     // Check permissions based on action
//     if (action === 'approve' && !canApproveStockAudit) {
//       showError('You do not have permission to approve stock audits');
//       return;
//     }
    
//     if (action === 'reject' && !canRejectStockAudit) {
//       showError('You do not have permission to reject stock audits');
//       return;
//     }
    
//     setSelectedAuditId(auditId);
//     setReviewAction(action);
//     setVerificationNotes('');
//     setRejectionReason('');
//     setShowReviewModal(true);
//     handleMenuClose();
//   };

//   const closeReviewModal = () => {
//     setShowReviewModal(false);
//     setSelectedAuditId(null);
//     setReviewAction('');
//     setVerificationNotes('');
//     setRejectionReason('');
//   };

//   const handleSubmitReview = async () => {
//     if (!selectedAuditId) return;

//     // Check permissions based on action
//     if (reviewAction === 'approve' && !canApproveStockAudit) {
//       showError('You do not have permission to approve stock audits');
//       return;
//     }
    
//     if (reviewAction === 'reject' && !canRejectStockAudit) {
//       showError('You do not have permission to reject stock audits');
//       return;
//     }

//     try {
//       setVerifyingId(selectedAuditId);
//       setMessage({ type: 'info', text: `${reviewAction === 'approve' ? 'Approving' : 'Rejecting'} stock audit...` });
      
//       const reviewData = {
//         action: reviewAction,
//         verificationNotes: verificationNotes
//       };

//       if (reviewAction === 'reject' && rejectionReason) {
//         reviewData.rejectionReason = rejectionReason;
//       }

//       // Use PATCH instead of POST as shown in your code
//       await axiosInstance.patch(`/stock-audits/${selectedAuditId}/review`, reviewData);
      
//       // Show success message
//       const successMsg = `Stock audit ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`;
//       showSuccess(successMsg);
//       setMessage({ type: 'success', text: successMsg });
      
//       // Close modal
//       closeReviewModal();
      
//       // Refresh data to get updated status
//       setTimeout(() => {
//         refreshData();
//       }, 500);
      
//     } catch (error) {
//       console.error('Error reviewing stock audit:', error);
//       const errorMsg = error.response?.data?.message || 'Failed to update stock audit status';
//       showError(errorMsg);
//       setMessage({ type: 'danger', text: errorMsg });
//     } finally {
//       setVerifyingId(null);
//     }
//   };

//   // Photo viewer functions
//   const openPhotoViewer = (audit) => {
//     if (!canViewStockAudit) {
//       showError('You do not have permission to view photos');
//       return;
//     }
    
//     const photos = audit.vehiclesPhotos || [];
//     if (photos.length > 0) {
//       setSelectedAuditPhotos(photos);
//       setCurrentPhotoIndex(0);
//       setShowPhotoModal(true);
//     }
//   };

//   const closePhotoViewer = () => {
//     setShowPhotoModal(false);
//     setSelectedAuditPhotos([]);
//     setCurrentPhotoIndex(0);
//   };

//   const goToNextPhoto = () => {
//     setCurrentPhotoIndex(prev => 
//       prev === selectedAuditPhotos.length - 1 ? 0 : prev + 1
//     );
//   };

//   const goToPreviousPhoto = () => {
//     setCurrentPhotoIndex(prev => 
//       prev === 0 ? selectedAuditPhotos.length - 1 : prev - 1
//     );
//   };

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case 'verified':
//         return <CBadge color="success">Verified</CBadge>;
//       case 'pending':
//       case 'draft':
//       case 'submitted':
//         return <CBadge color="warning">Pending</CBadge>;
//       case 'rejected':
//         return <CBadge color="danger">Rejected</CBadge>;
//       default:
//         return <CBadge color="secondary">{status}</CBadge>;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return '';
    
//     // Check if imagePath is already a full URL
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }
    
//     // Remove leading slash if present to avoid double slashes
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
//     // Use a direct base URL - replace with your actual API URL
//     const baseUrl = 'https://gandhitvs.in/dealership/api/v1';
    
//     // Construct the full URL
//     return `${baseUrl}/${cleanPath}`;
//   };

//   // Render photo details
//   const renderPhotoDetails = (photo) => {
//     if (!photo) return null;
    
//     return (
//       <CListGroup flush className="mt-3">
//         <CListGroupItem className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="fw-semibold">Address:</span>
//           </div>
//           <span className="text-end" style={{ maxWidth: '70%' }}>
//             {photo.address || 'N/A'}
//           </span>
//         </CListGroupItem>
        
//         <CListGroupItem className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="fw-semibold">Timestamp:</span>
//           </div>
//           <span>{formatDateTime(photo.timestamp)}</span>
//         </CListGroupItem>
        
//         <CListGroupItem className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <span className="fw-semibold">Chassis No:</span>
//           </div>
//           <span>{photo.chassisNumber || 'N/A'}</span>
//         </CListGroupItem>
        
//         {photo.remarks && (
//           <CListGroupItem className="d-flex justify-content-between align-items-start">
//             <div className="d-flex align-items-center">
//               <span className="fw-semibold">Remarks:</span>
//             </div>
//             <span className="text-end" style={{ maxWidth: '70%' }}>
//               {photo.remarks}
//             </span>
//           </CListGroupItem>
//         )}
//       </CListGroup>
//     );
//   };

//   // Common table rendering function
//   const renderTable = (data, showActions = false) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell>Sr.no</CTableHeaderCell>
//               <CTableHeaderCell>Audit Date</CTableHeaderCell>
//               <CTableHeaderCell>Subdealer</CTableHeaderCell>
//               <CTableHeaderCell>Location</CTableHeaderCell>
//               <CTableHeaderCell>Total Vehicles</CTableHeaderCell>
//               <CTableHeaderCell>Photos</CTableHeaderCell>
//               <CTableHeaderCell>Status</CTableHeaderCell>
//               <CTableHeaderCell>Conducted By</CTableHeaderCell>
//               {showActions && <CTableHeaderCell>Actions</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {data.length > 0 ? (
//               data.map((audit, index) => (
//                 <CTableRow key={audit._id}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>
//                     <strong>{formatDate(audit.auditDate)}</strong>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="fw-semibold">{audit.subdealerDetails?.name || 'N/A'}</div>
//                     <div className="text-muted small">{audit.subdealerDetails?.type || ''}</div>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="text-truncate" style={{ maxWidth: '200px' }} title={audit.address}>
//                       {audit.address?.split(',')[0] || 'N/A'}
//                     </div>
//                     {audit.subdealerDetails?.location && (
//                       <div className="text-muted small">{audit.subdealerDetails.location}</div>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <span className="badge bg-primary rounded-pill px-3 py-1">
//                       {audit.totalVehicles || 0}
//                     </span>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="d-flex">
//                       {audit.vehiclesPhotos?.length > 0 ? (
//                         <CButton 
//                           size="sm" 
//                           color="primary" 
//                           variant="outline"
//                           onClick={() => openPhotoViewer(audit)}
//                           className="d-flex align-items-center"
//                           disabled={!canViewStockAudit}
//                         >
//                           <CIcon icon={cilImage} className="me-1" />
//                           View Photos ({audit.vehiclesPhotos.length})
//                         </CButton>
//                       ) : (
//                         <span className="text-muted small">No photos</span>
//                       )}
//                     </div>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {getStatusBadge(audit.status)}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="small">
//                       <div>{audit.userDetails?.name || 'N/A'}</div>
//                     </div>
//                   </CTableDataCell>
//                   {showActions && (
//                     <CTableDataCell>
//                       <div className="d-flex align-items-center">
//                         <IconButton
//                           size="small"
//                           onClick={(event) => handleMenuClick(event, audit._id)}
//                           disabled={
//                             verifyingId === audit._id || 
//                             (!canApproveStockAudit && !canRejectStockAudit)
//                           }
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                         <Menu
//                           anchorEl={anchorEl}
//                           open={menuId === audit._id}
//                           onClose={handleMenuClose}
//                         >
//                           {canApproveStockAudit && (
//                             <MenuItem 
//                               onClick={() => openReviewModal(audit._id, 'approve')}
//                               disabled={verifyingId === audit._id}
//                             >
//                               <CIcon icon={cilCheckCircle} className="me-2 text-success" />
//                               {verifyingId === audit._id ? 'Approving...' : 'Approve'}
//                             </MenuItem>
//                           )}
//                           {canRejectStockAudit && (
//                             <MenuItem 
//                               onClick={() => openReviewModal(audit._id, 'reject')}
//                               disabled={verifyingId === audit._id}
//                             >
//                               <CIcon icon={cilXCircle} className="me-2 text-danger" />
//                               {verifyingId === audit._id ? 'Rejecting...' : 'Reject'}
//                             </MenuItem>
//                           )}
//                         </Menu>
//                       </div>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             ) : (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={showActions ? "10" : "9"} 
//                   className="text-center py-4"
//                 >
//                   No stock audits found
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (!canViewStockAudit) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Stock Audit List.
//       </div>
//     );
//   }

//   if (loading && !refreshTrigger) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Stock Audit List</div>
    
//       {/* Message Alert */}
//       {message.text && (
//         <CAlert 
//           color={message.type} 
//           className="mb-3"
//           dismissible
//           onClose={() => setMessage({ type: '', text: '' })}
//         >
//           {message.text}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div className='d-flex align-items-center'>
//             <CIcon icon={cilViewColumn} className='me-2' />
//             <h5 className='mb-0'>Stock Audits</h5>
//           </div>
//           <div className='d-flex align-items-center'>
//             <CButton 
//               color="light" 
//               variant="outline" 
//               size="sm" 
//               onClick={refreshData}
//               className="me-2"
//               disabled={loading && refreshTrigger > 0}
//             >
//               <CIcon icon={cilReload} className={loading && refreshTrigger > 0 ? 'spin' : ''} />
//             </CButton>
//             <CFormLabel className='me-2 mb-0'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               placeholder="Search..."
//               className="square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               style={{ width: '250px' }}
//               disabled={!canViewStockAudit}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {error && !loading && (
//             <CAlert color="danger" className="mb-3">
//               Error loading stock audits: {error}
//               <CButton 
//                 color="link" 
//                 size="sm" 
//                 onClick={refreshData}
//                 className="p-0 ms-2"
//               >
//                 Try Again
//               </CButton>
//             </CAlert>
//           )}
          
//           {/* Permissions Alert */}
//           {canViewStockAudit && !showActionColumn && (
//             <CAlert color="warning" className="mb-3">
//               You have VIEW permission but cannot approve or reject stock audits.
//             </CAlert>
//           )}
          
//           {/* Tabs Navigation */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show Submitted tab if user has VIEW permission for it */}
//             {canViewSubmittedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 0}
//                   onClick={() => handleTabChange(0)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                     color: 'black',
//                     borderBottom: 'none',
//                     fontWeight: activeTab === 0 ? '600' : 'normal'
//                   }}
//                 >
//                   SUBMITTED ({filteredPending.length})
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 1}
//                   onClick={() => handleTabChange(1)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black',
//                     fontWeight: activeTab === 1 ? '600' : 'normal'
//                   }}
//                 >
//                   APPROVED ({filteredVerified.length})
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Rejected tab if user has VIEW permission for it */}
//             {canViewRejectedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 2}
//                   onClick={() => handleTabChange(2)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black',
//                     fontWeight: activeTab === 2 ? '600' : 'normal'
//                   }}
//                 >
//                   REJECTED ({filteredRejected.length})
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           {/* Loading indicator for refresh */}
//           {loading && refreshTrigger > 0 && (
//             <div className="text-center mb-3">
//               <CSpinner size="sm" color="primary" className="me-2" />
//               <small>Refreshing data...</small>
//             </div>
//           )}

//           {/* Tab Content */}
//           <CTabContent>
//             {/* Only render Submitted tab if user has VIEW permission for it */}
//             {canViewSubmittedTab && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderTable(filteredPending, true)}
//               </CTabPane>
//             )}
//             {/* Only render Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
//               <CTabPane visible={activeTab === 1}>
//                 {renderTable(filteredVerified, false)}
//               </CTabPane>
//             )}
//             {/* Only render Rejected tab if user has VIEW permission for it */}
//             {canViewRejectedTab && (
//               <CTabPane visible={activeTab === 2}>
//                 {renderTable(filteredRejected, false)}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Photo Viewer Modal */}
//       <CModal 
//         visible={showPhotoModal} 
//         onClose={closePhotoViewer}
//         size="xl"
//         backdrop="static"
//         className="photo-viewer-modal"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             Stock Audit Photos ({currentPhotoIndex + 1} of {selectedAuditPhotos.length})
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedAuditPhotos[currentPhotoIndex] && (
//             <>
//               <CRow>
//                 <CCol lg="8">
//                   <div className="photo-container text-center mb-4">
//                     <img
//                       src={getImageUrl(selectedAuditPhotos[currentPhotoIndex].imageUrl)}
//                       alt={`Photo ${currentPhotoIndex + 1}`}
//                       style={{
//                         maxWidth: '100%',
//                         maxHeight: '600px',
//                         minHeight: '400px',
//                         width: 'auto',
//                         height: 'auto',
//                         objectFit: 'contain',
//                         borderRadius: '8px'
//                       }}
//                       className="img-fluid shadow"
//                     />
//                   </div>
                  
//                   <div className="photo-navigation d-flex justify-content-center mb-4">
//                     <CButton 
//                       color="secondary" 
//                       variant="outline" 
//                       onClick={goToPreviousPhoto}
//                       className="me-3 px-4"
//                     >
//                       Previous
//                     </CButton>
//                     <CButton 
//                       color="secondary" 
//                       variant="outline" 
//                       onClick={goToNextPhoto}
//                       className="px-4"
//                     >
//                       Next
//                     </CButton>
//                   </div>
//                 </CCol>
                
//                 <CCol lg="4">
//                   <div className="photo-details-card">
//                     <h6 className="mb-3">Photo Details</h6>
//                     {renderPhotoDetails(selectedAuditPhotos[currentPhotoIndex])}
//                   </div>
//                 </CCol>
//               </CRow>
              
//               {/* Thumbnails */}
//               <div className="photo-thumbnails mt-4">
//                 <h6 className="mb-2">All Photos</h6>
//                 <div className="d-flex flex-wrap gap-2">
//                   {selectedAuditPhotos.map((photo, index) => (
//                     <CButton
//                       key={photo._id}
//                       color={index === currentPhotoIndex ? "primary" : "light"}
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCurrentPhotoIndex(index)}
//                       className="p-1"
//                     >
//                       <img
//                         src={getImageUrl(photo.imageUrl)}
//                         alt={`Thumbnail ${index + 1}`}
//                         style={{
//                           width: '80px',
//                           height: '80px',
//                           objectFit: 'cover',
//                           borderRadius: '4px'
//                         }}
//                       />
//                     </CButton>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={closePhotoViewer}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Review Modal */}
//       <CModal 
//         visible={showReviewModal} 
//         onClose={closeReviewModal}
//         backdrop="static"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             {reviewAction === 'approve' ? 'Approve' : 'Reject'} Stock Audit
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">
//               Verification Notes
//               <span className="text-muted"> (Optional)</span>
//             </label>
//             <CFormTextarea
//               placeholder="Enter verification notes..."
//               value={verificationNotes}
//               onChange={(e) => setVerificationNotes(e.target.value)}
//               rows={3}
//             />
//           </div>
          
//           {reviewAction === 'reject' && (
//             <div className="mb-3">
//               <label className="form-label">
//                 Rejection Reason
//                 <span className="text-danger"> *</span>
//               </label>
//               <CFormTextarea
//                 placeholder="Enter reason for rejection..."
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//                 rows={3}
//                 required
//               />
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={closeReviewModal} disabled={verifyingId === selectedAuditId}>
//             Cancel
//           </CButton>
//           <CButton 
//             color={reviewAction === 'approve' ? 'success' : 'danger'} 
//             onClick={handleSubmitReview}
//             disabled={
//               verifyingId === selectedAuditId || 
//               (reviewAction === 'reject' && !rejectionReason.trim())
//             }
//           >
//             {verifyingId === selectedAuditId ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 {reviewAction === 'approve' ? 'Approving...' : 'Rejecting...'}
//               </>
//             ) : (
//               reviewAction === 'approve' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockAuditList;












// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge,
//   CAlert,
//   CFormLabel,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CRow,
//   CCol
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash,
//   cilCheckCircle,
//   cilXCircle,
//   cilSearch,
//   cilZoomOut
// } from '@coreui/icons';
// import {
//   Menu,
//   MenuItem,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import AddSubdealerAuditModal from './AddSubdealerAuditModal';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const SubdealerAuditList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingAudit, setEditingAudit] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [subdealers, setSubdealers] = useState([]);
  
//   // Filter states
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [selectedSubdealer, setSelectedSubdealer] = useState(null);
//   const [selectedAuditType, setSelectedAuditType] = useState('daily');
//   const [tempSelectedSubdealer, setTempSelectedSubdealer] = useState(null);
//   const [tempSelectedAuditType, setTempSelectedAuditType] = useState('daily');
//   const [isFiltered, setIsFiltered] = useState(false);

//   // Permissions
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   // Page-level permission checks for Subdealer Audit List page under Subdealer Master module
//   const canViewAuditList = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
//   const canCreateAudit = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
//   const canUpdateAudit = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
//   const canDeleteAudit = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
  
//   const showActionColumn = canUpdateAudit || canDeleteAudit;

//   useEffect(() => {
//     if (!canViewAuditList) {
//       showError('You do not have permission to view Subdealer Audit List');
//       return;
//     }
    
//     fetchData();
//     fetchSubdealers();
//   }, [canViewAuditList]);

//   useEffect(() => {
//     filterData();
//   }, [selectedSubdealer, selectedAuditType, data]);

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get('/subdealer-audits');
//       let audits = response.data.data?.subdealerAudits || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         audits = audits.filter(audit => 
//           audit.subdealer === userSubdealerId || 
//           audit.subdealerDetails?._id === userSubdealerId
//         );
        
//         // Automatically set the filter to the subdealer's own ID
//         setSelectedSubdealer(userSubdealerId);
//       }
      
//       setData(audits);
//       setFilteredData(audits);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterData = () => {
//     let filtered = data;

//     // Filter by audit type
//     if (selectedAuditType !== 'all') {
//       filtered = filtered.filter(audit => audit.auditType === selectedAuditType);
//     }

//     // Filter by subdealer
//     if (selectedSubdealer) {
//       filtered = filtered.filter(audit => 
//         audit.subdealer === selectedSubdealer || 
//         audit.subdealerDetails?._id === selectedSubdealer
//       );
//     }

//     setFilteredData(filtered);
    
//     // Check if any filter is active
//     const hasActiveFilter = selectedAuditType !== 'daily' || selectedSubdealer !== null;
//     setIsFiltered(hasActiveFilter);
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
    
//     let dataToFilter = data;
    
//     // Apply current filters first
//     if (selectedAuditType !== 'all') {
//       dataToFilter = dataToFilter.filter(audit => audit.auditType === selectedAuditType);
//     }
    
//     if (selectedSubdealer) {
//       dataToFilter = dataToFilter.filter(audit => 
//         audit.subdealer === selectedSubdealer || 
//         audit.subdealerDetails?._id === selectedSubdealer
//       );
//     }
    
//     handleFilter(searchValue, [
//       'subdealerDetails.name',
//       'day',
//       'timeSlot',
//       'remarks',
//       'createdByDetails.name',
//       'scheduleDescription'
//     ], dataToFilter);
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleToggleStatus = async (auditId, currentStatus) => {
//     if (!canUpdateAudit) {
//       showError('You do not have permission to update audit status');
//       return;
//     }
    
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

//     try {
//       await axiosInstance.patch(`/subdealer-audits/${auditId}/status`, {
//         status: newStatus
//       });
      
//       setData(prevData => prevData.map(audit => 
//         audit._id === auditId ? { ...audit, status: newStatus } : audit
//       ));
//       setFilteredData(prevData => prevData.map(audit => 
//         audit._id === auditId ? { ...audit, status: newStatus } : audit
//       ));
      
//       showSuccess('Audit status updated successfully!');
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteAudit) {
//       showError('You do not have permission to delete audit');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/subdealer-audits/${id}`);
        
//         setData(prevData => prevData.filter(audit => audit._id !== id));
//         setFilteredData(prevData => prevData.filter(audit => audit._id !== id));
        
//         showSuccess('Audit deleted successfully!');
//         setSuccessMessage('Audit deleted successfully');
//         setTimeout(() => setSuccessMessage(''), 3000);
//         handleClose();
//       } catch (error) {
//         console.log('Delete error:', error);
//         showError(error);
//       }
//     }
//   };

//   const handleShowAddModal = () => {
//     if (!canCreateAudit) {
//       showError('You do not have permission to create audit schedule');
//       return;
//     }
    
//     setEditingAudit(null);
//     setShowModal(true);
//   };

//   const handleShowEditModal = (audit) => {
//     if (!canUpdateAudit) {
//       showError('You do not have permission to edit audit schedule');
//       return;
//     }
    
//     setEditingAudit(audit);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingAudit(null);
//   };

//   const handleSaved = (message) => {
//     fetchData();
//     handleCloseModal();
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Filter modal handlers
//   const handleFilterClick = () => {
//     setTempSelectedSubdealer(selectedSubdealer);
//     setTempSelectedAuditType(selectedAuditType);
//     setShowFilterModal(true);
//   };

//   const handleApplyFilter = () => {
//     setSelectedSubdealer(tempSelectedSubdealer);
//     setSelectedAuditType(tempSelectedAuditType);
//     setShowFilterModal(false);
//   };

//   const handleCancelFilter = () => {
//     setShowFilterModal(false);
//     setTempSelectedSubdealer(selectedSubdealer);
//     setTempSelectedAuditType(selectedAuditType);
//   };

//   const clearFilters = () => {
//     setSelectedSubdealer(null);
//     setSelectedAuditType('daily');
//     setIsFiltered(false);
//   };

//   const getSubdealerNameById = (subdealerId) => {
//     const subdealer = subdealers.find(s => s._id === subdealerId);
//     return subdealer ? `${subdealer.name} - ${subdealer.location || 'N/A'}` : '';
//   };

//   const getFilterText = () => {
//     let filterText = '';
    
//     if (selectedAuditType !== 'daily') {
//       filterText += `(Type: ${selectedAuditType})`;
//     }
    
//     if (selectedSubdealer) {
//       if (filterText) filterText += ' ';
//       filterText += `(Subdealer: ${getSubdealerNameById(selectedSubdealer)})`;
//     }
    
//     return filterText;
//   };

//   const getAuditTypeBadge = (type) => {
//     const typeColors = {
//       daily: 'primary',
//       weekly: 'info',
//       monthly: 'success'
//     };
    
//     const typeLabels = {
//       daily: 'Daily',
//       weekly: 'Weekly',
//       monthly: 'Monthly'
//     };
    
//     return (
//       <CBadge color={typeColors[type] || 'secondary'}>
//         {typeLabels[type] || type}
//       </CBadge>
//     );
//   };

//   if (!canViewAuditList) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer Audit List.
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
//        {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer Audit Schedule {getFilterText()}</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateAudit && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleShowAddModal}
//                 disabled={!canCreateAudit}
//               >
//                 <CIcon icon={cilPlus} className='icon'/> New Audit Schedule
//               </CButton>
//             )}
            
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleFilterClick}
//               disabled={!canViewAuditList}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Filter
//             </CButton>

//             {isFiltered && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={clearFilters}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> 
//                 Reset Filter
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div>
//               <span className="text-muted">
               
//               </span>
//             </div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   handleSearch(e.target.value);
//                 }}
//                 placeholder="Search by subdealer, day, remarks..."
//                 disabled={!canViewAuditList}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Audit Type</CTableHeaderCell>
//                   <CTableHeaderCell>Subdealer</CTableHeaderCell>
//                   <CTableHeaderCell>Schedule</CTableHeaderCell>
//                   <CTableHeaderCell>Next Audit Date</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Created By</CTableHeaderCell>
//                   <CTableHeaderCell>Created Date</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData && filteredData.length > 0 ? (
//                   filteredData.map((audit, index) => (
//                     <CTableRow key={audit?._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>
//                         {getAuditTypeBadge(audit?.auditType)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {audit?.subdealerDetails?.name || 'N/A'}
//                         <div className="text-muted small">
//                           {audit?.subdealerDetails?.location || ''}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="mb-1">
//                           {audit?.scheduleDescription || 
//                             (audit?.auditType === 'daily' ? `Daily (${audit?.frequency})` : 
//                              audit?.auditType === 'weekly' ? `Weekly on ${audit?.dayFormatted || audit?.day}` :
//                              audit?.auditType === 'monthly' ? `Monthly on day ${audit?.dayOfMonth}` : '')}
//                         </div>
//                         {audit?.frequency && audit?.auditType !== 'daily' && (
//                           <div className="text-muted small">
//                             Frequency: {audit?.frequency}
//                           </div>
//                         )}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex flex-column">
//                           <span>
//                             {audit?.nextAuditDate ? 
//                               new Date(audit.nextAuditDate).toLocaleDateString('en-US', {
//                                 day: '2-digit',
//                                 month: 'short',
//                                 year: 'numeric'
//                               }) : 'N/A'
//                             }
//                           </span>
//                           {audit?.auditStatus === 'due-tomorrow' && (
//                             <CBadge color="warning" className="mt-1">
//                               Due Tomorrow
//                             </CBadge>
//                           )}
//                           {audit?.daysUntil !== undefined && audit.daysUntil > 0 && (
//                             <span className="text-muted small">
//                               in {audit.daysUntil} day{audit.daysUntil !== 1 ? 's' : ''}
//                             </span>
//                           )}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {audit?.remarks || '-'}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {audit?.createdByDetails?.name || 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {formatDate(audit?.createdAt)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={audit?.status === 'active' ? 'success' : 'secondary'}>
//                           {audit?.status === 'active' ? (
//                             <>
//                               <CIcon icon={cilCheckCircle} className="me-1" />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <CIcon icon={cilXCircle} className="me-1" />
//                               Inactive
//                             </>
//                           )}
//                         </CBadge>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, audit?._id)}
//                             disabled={!canUpdateAudit && !canDeleteAudit}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${audit?._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === audit?._id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateAudit && (
//                               <MenuItem 
//                                 onClick={() => handleShowEditModal(audit)}
//                                 style={{ color: 'black' }}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" />
//                                 Edit
//                               </MenuItem>
//                             )}
//                             {canUpdateAudit && (
//                               <MenuItem onClick={() => handleToggleStatus(audit?._id, audit?.status)}>
//                                 <CIcon icon={audit?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
//                                 {audit?.status === 'active' ? 'Deactivate' : 'Activate'}
//                               </MenuItem>
//                             )}
//                             {canDeleteAudit && (
//                               <MenuItem onClick={() => handleDelete(audit?._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />
//                                 Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
//                       {data?.length === 0 
//                         ? 'No audit schedules available. Click "New Audit Schedule" to create one.'
//                         : `No audit schedules found for the selected filters. Try changing the filter or search term.`
//                       }
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Filter Modal */}
//       <CModal size='lg' visible={showFilterModal} onClose={handleCancelFilter}>
//         <CModalHeader>
//           <CModalTitle>Filter Audit Schedules</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CRow className="mb-3">
//             <CCol md={6}>
//               <label className="form-label">Select Audit Type:</label>
//               <CFormSelect
//                 value={tempSelectedAuditType || 'daily'}
//                 onChange={(e) => setTempSelectedAuditType(e.target.value)}
//                 disabled={!canViewAuditList}
//               >
//                 <option value="all">All Types</option>
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//               </CFormSelect>
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Select Subdealer:</label>
//               {isSubdealer ? (
//                 <div>
//                   <CFormInput
//                     type="text"
//                     value={`${userSubdealerName || 'Your Subdealer Account'}`}
//                     readOnly
//                     disabled
//                     className="mb-2"
//                   />
//                   <div className="text-muted small">
//                     Subdealers can only view their own audit schedules
//                   </div>
//                 </div>
//               ) : (
//                 <CFormSelect
//                   value={tempSelectedSubdealer || ''}
//                   onChange={(e) => setTempSelectedSubdealer(e.target.value || null)}
//                   disabled={!canViewAuditList}
//                 >
//                   <option value="">All Subdealers</option>
//                   {subdealers
//                     .filter(subdealer => subdealer.status === 'active')
//                     .map(subdealer => (
//                       <option key={subdealer._id} value={subdealer._id}>
//                         {subdealer.name} - {subdealer.location || 'N/A'}
//                       </option>
//                     ))}
//                 </CFormSelect>
//               )}
//             </CCol>
//           </CRow>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCancelFilter}>
//             Cancel
//           </CButton>
//           <CButton className='submit-button' onClick={handleApplyFilter}>
//             Apply Filter
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <AddSubdealerAuditModal
//         show={showModal}
//         onClose={handleCloseModal}
//         onSaved={handleSaved}
//         editingAudit={editingAudit}
//         subdealers={subdealers}
//         isSubdealer={isSubdealer}
//         userSubdealerId={userSubdealerId}
//         userSubdealerName={userSubdealerName}
//       />
//     </div>
//   );
// };

// export default SubdealerAuditList;







import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CBadge,
  CAlert,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilSearch,
  cilZoomOut
} from '@coreui/icons';
import {
  Menu,
  MenuItem,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import AddSubdealerAuditModal from './AddSubdealerAuditModal';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

const SubdealerAuditList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAudit, setEditingAudit] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [subdealers, setSubdealers] = useState([]);
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [selectedAuditType, setSelectedAuditType] = useState('daily');
  const [tempSelectedSubdealer, setTempSelectedSubdealer] = useState(null);
  const [tempSelectedAuditType, setTempSelectedAuditType] = useState('daily');
  const [isFiltered, setIsFiltered] = useState(false);

  // Permissions
  const { permissions, user: authUser } = useAuth();
  
  // Check if user has SUBDEALER role
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
  // Get subdealer ID from user data if user is a subdealer
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;
  
  // Page-level permission checks for Subdealer Audit List page under Subdealer Master module
  const canViewAuditList = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
  const canCreateAudit = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
  const canUpdateAudit = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
  const canDeleteAudit = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST);
  
  const showActionColumn = canUpdateAudit || canDeleteAudit;

  useEffect(() => {
    if (!canViewAuditList) {
      showError('You do not have permission to view Subdealer Audit List');
      return;
    }
    
    fetchData();
    fetchSubdealers();
  }, [canViewAuditList]);

  useEffect(() => {
    filterData();
  }, [selectedSubdealer, selectedAuditType, data]);

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data?.subdealers || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/subdealer-audits');
      let audits = response.data.data?.subdealerAudits || [];
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        audits = audits.filter(audit => 
          audit.subdealer === userSubdealerId || 
          audit.subdealerDetails?._id === userSubdealerId
        );
        
        // Automatically set the filter to the subdealer's own ID
        setSelectedSubdealer(userSubdealerId);
      }
      
      setData(audits);
      setFilteredData(audits);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = data;

    // Filter by audit type
    if (selectedAuditType !== 'all') {
      filtered = filtered.filter(audit => audit.auditType === selectedAuditType);
    }

    // Filter by subdealer
    if (selectedSubdealer) {
      filtered = filtered.filter(audit => 
        audit.subdealer === selectedSubdealer || 
        audit.subdealerDetails?._id === selectedSubdealer
      );
    }

    setFilteredData(filtered);
    
    // Check if any filter is active
    const hasActiveFilter = selectedAuditType !== 'daily' || selectedSubdealer !== null;
    setIsFiltered(hasActiveFilter);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    let dataToFilter = data;
    
    // Apply current filters first
    if (selectedAuditType !== 'all') {
      dataToFilter = dataToFilter.filter(audit => audit.auditType === selectedAuditType);
    }
    
    if (selectedSubdealer) {
      dataToFilter = dataToFilter.filter(audit => 
        audit.subdealer === selectedSubdealer || 
        audit.subdealerDetails?._id === selectedSubdealer
      );
    }
    
    handleFilter(searchValue, [
      'subdealerDetails.name',
      'day',
      'timeSlot',
      'remarks',
      'createdByDetails.name',
      'scheduleDescription'
    ], dataToFilter);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleToggleStatus = async (auditId, currentStatus) => {
    if (!canCreateAudit) {
      showError('You do not have permission to change audit status');
      return;
    }
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.patch(`/subdealer-audits/${auditId}/status`, {
        status: newStatus
      });
      
      setData(prevData => prevData.map(audit => 
        audit._id === auditId ? { ...audit, status: newStatus } : audit
      ));
      setFilteredData(prevData => prevData.map(audit => 
        audit._id === auditId ? { ...audit, status: newStatus } : audit
      ));
      
      showSuccess('Audit status updated successfully!');
      handleClose();
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteAudit) {
      showError('You do not have permission to delete audit');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/subdealer-audits/${id}`);
        
        setData(prevData => prevData.filter(audit => audit._id !== id));
        setFilteredData(prevData => prevData.filter(audit => audit._id !== id));
        
        showSuccess('Audit deleted successfully!');
        setSuccessMessage('Audit deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleClose();
      } catch (error) {
        console.log('Delete error:', error);
        showError(error);
      }
    }
  };

  const handleShowAddModal = () => {
    if (!canCreateAudit) {
      showError('You do not have permission to create audit schedule');
      return;
    }
    
    setEditingAudit(null);
    setShowModal(true);
  };

  const handleShowEditModal = (audit) => {
    if (!canUpdateAudit) {
      showError('You do not have permission to edit audit schedule');
      return;
    }
    
    setEditingAudit(audit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAudit(null);
  };

  const handleSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter modal handlers
  const handleFilterClick = () => {
    setTempSelectedSubdealer(selectedSubdealer);
    setTempSelectedAuditType(selectedAuditType);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setSelectedSubdealer(tempSelectedSubdealer);
    setSelectedAuditType(tempSelectedAuditType);
    setShowFilterModal(false);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setTempSelectedSubdealer(selectedSubdealer);
    setTempSelectedAuditType(selectedAuditType);
  };

  const clearFilters = () => {
    setSelectedSubdealer(null);
    setSelectedAuditType('daily');
    setIsFiltered(false);
  };

  const getSubdealerNameById = (subdealerId) => {
    const subdealer = subdealers.find(s => s._id === subdealerId);
    return subdealer ? `${subdealer.name} - ${subdealer.location || 'N/A'}` : '';
  };

  const getFilterText = () => {
    let filterText = '';
    
    if (selectedAuditType !== 'daily') {
      filterText += `(Type: ${selectedAuditType})`;
    }
    
    if (selectedSubdealer) {
      if (filterText) filterText += ' ';
      filterText += `(Subdealer: ${getSubdealerNameById(selectedSubdealer)})`;
    }
    
    return filterText;
  };

  const getAuditTypeBadge = (type) => {
    const typeColors = {
      daily: 'primary',
      weekly: 'info',
      monthly: 'success'
    };
    
    const typeLabels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    };
    
    return (
      <CBadge color={typeColors[type] || 'secondary'}>
        {typeLabels[type] || type}
      </CBadge>
    );
  };

  if (!canViewAuditList) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer Audit List.
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
      <div className='title'>Subdealer Audit Schedule {getFilterText()}</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateAudit && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
                disabled={!canCreateAudit}
              >
                <CIcon icon={cilPlus} className='icon'/> New Audit Schedule
              </CButton>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleFilterClick}
              disabled={!canViewAuditList}
            >
              <CIcon icon={cilSearch} className='icon' /> Filter
            </CButton>

            {isFiltered && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={clearFilters}
              >
                <CIcon icon={cilZoomOut} className='icon' /> 
                Reset Filter
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <span className="text-muted">
               
              </span>
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                placeholder="Search by subdealer, day, remarks..."
                disabled={!canViewAuditList}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Audit Type</CTableHeaderCell>
                  <CTableHeaderCell>Subdealer</CTableHeaderCell>
                  <CTableHeaderCell>Schedule</CTableHeaderCell>
                  <CTableHeaderCell>Next Audit Date</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((audit, index) => (
                    <CTableRow key={audit?._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        {getAuditTypeBadge(audit?.auditType)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit?.subdealerDetails?.name || 'N/A'}
                        <div className="text-muted small">
                          {audit?.subdealerDetails?.location || ''}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="mb-1">
                          {audit?.scheduleDescription || 
                            (audit?.auditType === 'daily' ? `Daily (${audit?.frequency})` : 
                             audit?.auditType === 'weekly' ? `Weekly on ${audit?.dayFormatted || audit?.day}` :
                             audit?.auditType === 'monthly' ? `Monthly on day ${audit?.dayOfMonth}` : '')}
                        </div>
                        {audit?.frequency && audit?.auditType !== 'daily' && (
                          <div className="text-muted small">
                            Frequency: {audit?.frequency}
                          </div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex flex-column">
                          <span>
                            {audit?.nextAuditDate ? 
                              new Date(audit.nextAuditDate).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : 'N/A'
                            }
                          </span>
                          {audit?.auditStatus === 'due-tomorrow' && (
                            <CBadge color="warning" className="mt-1">
                              Due Tomorrow
                            </CBadge>
                          )}
                          {audit?.daysUntil !== undefined && audit.daysUntil > 0 && (
                            <span className="text-muted small">
                              in {audit.daysUntil} day{audit.daysUntil !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit?.remarks || '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit?.createdByDetails?.name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(audit?.createdAt)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={audit?.status === 'active' ? 'success' : 'secondary'}>
                          {audit?.status === 'active' ? (
                            <>
                              <CIcon icon={cilCheckCircle} className="me-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilXCircle} className="me-1" />
                              Inactive
                            </>
                          )}
                        </CBadge>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, audit?._id)}
                            disabled={!canUpdateAudit && !canDeleteAudit}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${audit?._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === audit?._id} 
                            onClose={handleClose}
                          >
                            {canUpdateAudit && (
                              <MenuItem 
                                onClick={() => handleShowEditModal(audit)}
                                style={{ color: 'black' }}
                              >
                                <CIcon icon={cilPencil} className="me-2" />
                                Edit
                              </MenuItem>
                            )}
                            {canCreateAudit && (
                              <MenuItem 
                                onClick={() => handleToggleStatus(audit?._id, audit?.status)}
                              >
                                <CIcon icon={audit?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
                                {audit?.status === 'active' ? 'Deactivate' : 'Activate'}
                              </MenuItem>
                            )}
                            {canDeleteAudit && (
                              <MenuItem onClick={() => handleDelete(audit?._id)}>
                                <CIcon icon={cilTrash} className="me-2" />
                                Delete
                              </MenuItem>
                            )}
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
                      {data?.length === 0 
                        ? 'No audit schedules available. Click "New Audit Schedule" to create one.'
                        : `No audit schedules found for the selected filters. Try changing the filter or search term.`
                      }
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Filter Modal */}
      <CModal size='lg' visible={showFilterModal} onClose={handleCancelFilter}>
        <CModalHeader>
          <CModalTitle>Filter Audit Schedules</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Select Audit Type:</label>
              <CFormSelect
                value={tempSelectedAuditType || 'daily'}
                onChange={(e) => setTempSelectedAuditType(e.target.value)}
                disabled={!canViewAuditList}
              >
                <option value="all">All Types</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Select Subdealer:</label>
              {isSubdealer ? (
                <div>
                  <CFormInput
                    type="text"
                    value={`${userSubdealerName || 'Your Subdealer Account'}`}
                    readOnly
                    disabled
                    className="mb-2"
                  />
                  <div className="text-muted small">
                    Subdealers can only view their own audit schedules
                  </div>
                </div>
              ) : (
                <CFormSelect
                  value={tempSelectedSubdealer || ''}
                  onChange={(e) => setTempSelectedSubdealer(e.target.value || null)}
                  disabled={!canViewAuditList}
                >
                  <option value="">All Subdealers</option>
                  {subdealers
                    .filter(subdealer => subdealer.status === 'active')
                    .map(subdealer => (
                      <option key={subdealer._id} value={subdealer._id}>
                        {subdealer.name} - {subdealer.location || 'N/A'}
                      </option>
                    ))}
                </CFormSelect>
              )}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelFilter}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleApplyFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>

      <AddSubdealerAuditModal
        show={showModal}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        editingAudit={editingAudit}
        subdealers={subdealers}
        isSubdealer={isSubdealer}
        userSubdealerId={userSubdealerId}
        userSubdealerName={userSubdealerName}
      />
    </div>
  );
};

export default SubdealerAuditList;