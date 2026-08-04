// import React, { useState, useEffect, useRef } from 'react';
// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableBody,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CInputGroup,
//   CInputGroupText
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSearch, 
//   cilInfo, 
//   cilFilter, 
//   cilReload, 
//   cilChevronLeft, 
//   cilChevronRight,
//   cilCheckCircle,
//   cilWarning,
//   cilTransfer,
//   cilCloudUpload,
//   cilPaperclip,
//   cilFile
// } from '@coreui/icons';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import { format } from 'date-fns';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const StockMovementHistory = () => {
//   const [transfers, setTransfers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Server-side state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     totalCount: 0,
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
  
//   // Search and filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchTimer = useRef(null);
  
//   // Filter state
//   const [filterModalOpen, setFilterModalOpen] = useState(false);
//   const [sourceDatabaseFilter, setSourceDatabaseFilter] = useState('');
//   const [targetDatabaseFilter, setTargetDatabaseFilter] = useState('');
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
  
//   // Detail modal state
//   const [selectedTransfer, setSelectedTransfer] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
  
//   // Upload challan state
//   const [fileInputs, setFileInputs] = useState({});
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef({});
  
//   // Database options
//   const [databaseOptions, setDatabaseOptions] = useState([]);
//   const [locations, setLocations] = useState({});
  
//   const { permissions = [] } = useAuth();

//   // Permission checks for Stock Movement module (IDT)
//   // Using the PAGES.STOCK_MOVEMENT constants for page-level permissions
//   const canViewIDTList = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_LIST);
//   const canViewIDTHistory = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_HISTORY);
//   const canViewIDTRequests = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_REQUESTS);
  
//   // For Challan operations - using CREATE permission for uploading and VIEW for viewing
//   const canUploadChallan = canCreateInPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_HISTORY);
//   const canViewChallan = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_HISTORY);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasUploadChallanPermission = hasSafePagePermission(
//     permissions, 
//     MODULES.STOCK_MOVEMENT, 
//     PAGES.STOCK_MOVEMENT.IDT_HISTORY, 
//     ACTIONS.CREATE
//   );
  
//   const hasViewChallanPermission = hasSafePagePermission(
//     permissions, 
//     MODULES.STOCK_MOVEMENT, 
//     PAGES.STOCK_MOVEMENT.IDT_HISTORY, 
//     ACTIONS.VIEW
//   );

//   // Database display names mapping
//   const databaseDisplayNames = {
//     'db1': 'Gandhi TVS Nashik',
//     'db2': 'Gandhi TVS Sangamner'
//   };

//   const getDatabaseDisplayName = (dbKey) => {
//     return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
//   };

//   // Fetch locations for filter dropdowns
//   const fetchLocations = async () => {
//     // Check if user has permission to view IDT History
//     if (!canViewIDTHistory && !canViewIDTList && !canViewIDTRequests) {
//       console.warn('User does not have permission to view IDT history');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get('/crossData/locations');
//       if (response.data.status === 'success') {
//         setLocations(response.data.data);
//         const dbKeys = Object.keys(response.data.data);
//         setDatabaseOptions(dbKeys);
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };

//   // Fetch transfer history with server-side pagination and search
//   const fetchTransferHistory = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     // Check if user has permission to view IDT History
//     if (!canViewIDTHistory) {
//       showError('You do not have permission to view IDT history');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
      
//       if (search && search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       if (sourceDatabaseFilter) {
//         params.append('sourceDatabase', sourceDatabaseFilter);
//       }
      
//       if (targetDatabaseFilter) {
//         params.append('targetDatabase', targetDatabaseFilter);
//       }
      
//       const url = `/crossData/transfer-history${params.toString() ? `?${params.toString()}` : ''}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.status === 'success') {
//         setTransfers(response.data.data.transfers || []);
        
//         // Initialize file inputs for each transfer
//         const inputs = {};
//         (response.data.data.transfers || []).forEach((transfer) => {
//           inputs[transfer._id] = null;
//         });
//         setFileInputs(inputs);
        
//         setPagination({
//           page: response.data.data.pagination?.page || page,
//           limit: response.data.data.pagination?.limit || limit,
//           totalCount: response.data.data.pagination?.total || 0,
//           totalPages: response.data.data.pagination?.pages || 1,
//           hasNextPage: response.data.data.pagination?.page < response.data.data.pagination?.pages,
//           hasPrevPage: response.data.data.pagination?.page > 1
//         });
//         setError(null);
//       } else {
//         showError('Failed to fetch transfer history');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   useEffect(() => {
//     if (canViewIDTHistory) {
//       fetchTransferHistory();
//     }
//   }, [pagination.page, pagination.limit, sourceDatabaseFilter, targetDatabaseFilter]);

//   // Debounced search
//   useEffect(() => {
//     if (!canViewIDTHistory) return;
    
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchTransferHistory(1, pagination.limit, searchTerm);
//     }, 500);
    
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, [searchTerm]);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.totalPages) return;
//     setPagination(prev => ({ ...prev, page: newPage }));
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination(prev => ({
//       ...prev,
//       limit: parseInt(newLimit, 10),
//       page: 1
//     }));
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//   };

//   const applyFilter = () => {
//     setIsFilterApplied(!!(sourceDatabaseFilter || targetDatabaseFilter));
//     setFilterModalOpen(false);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const clearFilter = () => {
//     setSourceDatabaseFilter('');
//     setTargetDatabaseFilter('');
//     setIsFilterApplied(false);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleViewDetails = (transfer) => {
//     // Check if user has view permission for details
//     if (!canViewIDTHistory) {
//       showError('You do not have permission to view transfer details');
//       return;
//     }
//     setSelectedTransfer(transfer);
//     setShowDetailModal(true);
//   };

//   // Upload challan handlers with permission checks
//   const handleFileChange = (transferId, e) => {
//     if (!canUploadChallan && !hasUploadChallanPermission) {
//       showError('You do not have permission to upload challan');
//       return;
//     }
//     setFileInputs((prev) => ({
//       ...prev,
//       [transferId]: e.target.files[0]
//     }));
//   };

//   const handleUploadClick = (transferId) => {
//     if (!canUploadChallan && !hasUploadChallanPermission) {
//       showError('You do not have permission to upload challan');
//       return;
//     }
//     fileInputRef.current[transferId]?.click();
//   };

//   const handleUploadChallan = async (transferId) => {
//     // Check upload permission
//     if (!canUploadChallan && !hasUploadChallanPermission) {
//       showError('You do not have permission to upload challan');
//       return;
//     }
    
//     if (!fileInputs[transferId]) {
//       showError('Please select a file first');
//       return;
//     }

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('challan', fileInputs[transferId]);

//       await axiosInstance.post(`/crossData/transfer-requests/${transferId}/challan`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess('Challan uploaded successfully!');
      
//       // Clear the file input for this transfer
//       setFileInputs((prev) => ({
//         ...prev,
//         [transferId]: null
//       }));
      
//       // Refresh the data
//       fetchTransferHistory();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   // View challan handler with permission check
//   const handleViewChallan = (challanDocument) => {
//     if (!canViewChallan && !hasViewChallanPermission) {
//       showError('You do not have permission to view challan');
//       return;
//     }
//     window.open(`${axiosInstance.defaults.baseURL}/${challanDocument}`, '_blank');
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss');
//     } catch (error) {
//       return '-';
//     }
//   };

//   const getStatusBadge = (summary) => {
//     if (summary.failed > 0 && summary.success === 0) {
//       return <CBadge color="danger">Failed</CBadge>;
//     } else if (summary.failed > 0) {
//       return <CBadge color="warning">Partial Failure</CBadge>;
//     } else {
//       return <CBadge color="success">Success</CBadge>;
//     }
//   };

//   const getChallanStatusBadge = (challanStatus) => {
//     if (challanStatus === 'uploaded') {
//       return <CBadge color="success">Uploaded</CBadge>;
//     } else if (challanStatus === 'pending') {
//       return <CBadge color="warning">Pending</CBadge>;
//     }
//     return <CBadge color="secondary">Not Available</CBadge>;
//   };

//   const startRecord = (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

//   // Calculate displayed page numbers (max 5 pages shown)
//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
//   if (pagination.page <= 3) {
//     endPage = Math.min(5, pagination.totalPages);
//   }
  
//   if (pagination.page >= pagination.totalPages - 2) {
//     startPage = Math.max(1, pagination.totalPages - 4);
//   }
  
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) {
//     displayedPages.push(i);
//   }

//   // If user doesn't have permission to view IDT History, show access denied message
//   if (!canViewIDTHistory && !canViewIDTList && !canViewIDTRequests) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view IDT Transfer History.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>
//         INTER DEALER TRANSFER History
//       </div>

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setFilterModalOpen(true)}
//             >
//               <CIcon icon={cilFilter} className='icon' /> Filter
//             </CButton>
            
//             {isFilterApplied && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={clearFilter}
//               >
//                 <CIcon icon={cilReload} className='icon' /> Clear Filters
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3 align-items-center">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect 
//                 value={pagination.limit} 
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </CFormSelect>
//             </div>
//             <div className='d-flex align-items-center'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search by Transfer ID, Chassis, Model..."
//                 style={{ width: '300px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell style={{ width: '60px' }}>#</CTableHeaderCell>
//                   <CTableHeaderCell>Transfer ID</CTableHeaderCell>
//                   <CTableHeaderCell>Source</CTableHeaderCell>
//                   <CTableHeaderCell>Target</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicles</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell>Challan Status</CTableHeaderCell>
//                   <CTableHeaderCell>Transferred By</CTableHeaderCell>
//                   <CTableHeaderCell>Transferred At</CTableHeaderCell>
//                   <CTableHeaderCell style={{ width: '140px' }}>Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {transfers.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={10} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No transfer records available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   transfers.map((transfer, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={transfer._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <span className="fw-mono small">{transfer.transferId}</span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div>
//                             <strong>{transfer.sourceLocationName}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {getDatabaseDisplayName(transfer.sourceDatabase)} ({transfer.sourceLocationType})
//                             </small>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div>
//                             <strong>{transfer.targetLocationName}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {getDatabaseDisplayName(transfer.targetDatabase)} ({transfer.targetLocationType})
//                             </small>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="text-center">
//                             <CBadge color="primary" className="me-1">
//                               Total: {transfer.summary.total}
//                             </CBadge>
//                             <div className="mt-1">
//                               <CBadge color="success" className="me-1">
//                                 S: {transfer.summary.success}
//                               </CBadge>
//                               {transfer.summary.failed > 0 && (
//                                 <CBadge color="danger">
//                                   F: {transfer.summary.failed}
//                                 </CBadge>
//                               )}
//                             </div>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {getStatusBadge(transfer.summary)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {getChallanStatusBadge(transfer.challanStatus)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {transfer.transferredByUserName}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {formatDate(transfer.transferredAt)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="d-flex gap-1 flex-wrap">
//                             {/* View Details - requires VIEW permission */}
//                             {canViewIDTHistory && (
//                               <CButton
//                                 color="info"
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => handleViewDetails(transfer)}
//                                 title="View Details"
//                               >
//                                 <CIcon icon={cilInfo} />
//                               </CButton>
//                             )}
                            
//                             {/* Upload Challan - requires CREATE permission */}
//                             {transfer.challanStatus === 'pending' && (canUploadChallan || hasUploadChallanPermission) && (
//                               <>
//                                 <CButton
//                                   color="primary"
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => handleUploadClick(transfer._id)}
//                                   disabled={uploading}
//                                   title="Upload Challan"
//                                 >
//                                   <CIcon icon={cilCloudUpload} />
//                                 </CButton>
                                
//                                 {/* Hidden file input for challan upload */}
//                                 <input
//                                   type="file"
//                                   ref={(el) => (fileInputRef.current[transfer._id] = el)}
//                                   onChange={(e) => handleFileChange(transfer._id, e)}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                   style={{ display: 'none' }}
//                                 />
                                
//                                 {/* Show file selection and upload button if file is selected */}
//                                 {fileInputs[transfer._id] && (
//                                   <div className="mt-2 d-flex flex-column gap-1" style={{ position: 'absolute', zIndex: 10, background: 'white', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                                     <small className="text-muted">
//                                       <CIcon icon={cilPaperclip} className="me-1" />
//                                       {fileInputs[transfer._id].name}
//                                     </small>
//                                     <CButton
//                                       size="sm"
//                                       color="success"
//                                       onClick={() => handleUploadChallan(transfer._id)}
//                                       disabled={uploading}
//                                     >
//                                       {uploading ? 'Uploading...' : 'Confirm Upload'}
//                                     </CButton>
//                                   </div>
//                                 )}
//                               </>
//                             )}
                            
//                             {/* View Challan - requires VIEW permission */}
//                             {transfer.challanStatus === 'uploaded' && transfer.challanDocument && (canViewChallan || hasViewChallanPermission) && (
//                               <CButton
//                                 color="success"
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => handleViewChallan(transfer.challanDocument)}
//                                 title="View Challan"
//                               >
//                                 <CIcon icon={cilFile} />
//                               </CButton>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {/* Pagination Component */}
//           {pagination.totalCount > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
//                 </span>
//               </div>
              
//               {pagination.totalPages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation example">
//                   <CPaginationItem 
//                     aria-label="Previous" 
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>
                  
//                   {pagination.page > 3 && pagination.totalPages > 5 && (
//                     <>
//                       <CPaginationItem 
//                         onClick={() => handlePageChange(1)}
//                         active={pagination.page === 1}
//                         disabled={loading}
//                       >
//                         1
//                       </CPaginationItem>
//                       {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//                     </>
//                   )}
                  
//                   {displayedPages.map(page => (
//                     <CPaginationItem 
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}
                  
//                   {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
//                     <>
//                       {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//                       <CPaginationItem 
//                         onClick={() => handlePageChange(pagination.totalPages)}
//                         active={pagination.page === pagination.totalPages}
//                         disabled={loading}
//                       >
//                         {pagination.totalPages}
//                       </CPaginationItem>
//                     </>
//                   )}
                  
//                   <CPaginationItem 
//                     aria-label="Next" 
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.totalPages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Filter Modal */}
//       <CModal visible={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Filter Transfers</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Source Database:</label>
//             <CFormSelect
//               value={sourceDatabaseFilter}
//               onChange={(e) => setSourceDatabaseFilter(e.target.value)}
//             >
//               <option value="">-- All Source Databases --</option>
//               {databaseOptions.map(db => (
//                 <option key={db} value={db}>{getDatabaseDisplayName(db)}</option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Target Database:</label>
//             <CFormSelect
//               value={targetDatabaseFilter}
//               onChange={(e) => setTargetDatabaseFilter(e.target.value)}
//             >
//               <option value="">-- All Target Databases --</option>
//               {databaseOptions.map(db => (
//                 <option key={db} value={db}>{getDatabaseDisplayName(db)}</option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setFilterModalOpen(false)}>Cancel</CButton>
//           <CButton className='submit-button' onClick={applyFilter}>
//             Apply Filters
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Transfer Details Modal */}
//       <CModal visible={showDetailModal} onClose={() => setShowDetailModal(false)} size="xl" scrollable>
//         <CModalHeader closeButton>
//           <CModalTitle>
//             <CIcon icon={cilInfo} className="me-2" />
//             Transfer Details - {selectedTransfer?.transferId}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedTransfer && (
//             <div>
//               {/* Transfer Summary */}
//               <div className="transfer-summary mb-4">
//                 <h6 className="text-primary mb-3">Transfer Summary</h6>
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <div className="border rounded p-3">
//                       <div className="text-muted small">Source</div>
//                       <div className="fw-bold">{selectedTransfer.sourceLocationName}</div>
//                       <div className="small">
//                         {getDatabaseDisplayName(selectedTransfer.sourceDatabase)} ({selectedTransfer.sourceLocationType})
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="border rounded p-3">
//                       <div className="text-muted small">Target</div>
//                       <div className="fw-bold">{selectedTransfer.targetLocationName}</div>
//                       <div className="small">
//                         {getDatabaseDisplayName(selectedTransfer.targetDatabase)} ({selectedTransfer.targetLocationType})
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center">
//                       <div className="text-muted small">Total Vehicles</div>
//                       <div className="h4 mb-0">{selectedTransfer.summary.total}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center bg-success bg-opacity-10">
//                       <div className="text-muted small">Successful</div>
//                       <div className="h4 mb-0 text-success">{selectedTransfer.summary.success}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center bg-danger bg-opacity-10">
//                       <div className="text-muted small">Failed</div>
//                       <div className="h4 mb-0 text-danger">{selectedTransfer.summary.failed}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Transfer Metadata */}
//               <div className="transfer-metadata mb-4">
//                 <h6 className="text-primary mb-3">Transfer Information</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Transfer ID:</span>
//                       <span className="fw-mono">{selectedTransfer.transferId}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Request ID:</span>
//                       <span className="fw-mono">{selectedTransfer.requestId || '-'}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Transferred By:</span>
//                       <span>{selectedTransfer.transferredByUserName}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Transferred At:</span>
//                       <span>{formatDate(selectedTransfer.transferredAt)}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Validate Uniqueness:</span>
//                       <CBadge color={selectedTransfer.validateUniqueness ? 'success' : 'secondary'}>
//                         {selectedTransfer.validateUniqueness ? 'Yes' : 'No'}
//                       </CBadge>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Challan Status:</span>
//                       {getChallanStatusBadge(selectedTransfer.challanStatus)}
//                     </div>
//                   </div>
//                   {selectedTransfer.challanStatus === 'uploaded' && selectedTransfer.challanDocument && (canViewChallan || hasViewChallanPermission) && (
//                     <div className="col-md-12">
//                       <div className="d-flex justify-content-between border-bottom py-2">
//                         <span className="text-muted">Challan Document:</span>
//                         <CButton
//                           size="sm"
//                           color="info"
//                           onClick={() => handleViewChallan(selectedTransfer.challanDocument)}
//                         >
//                           <CIcon icon={cilFile} className="me-1" />
//                           View Challan
//                         </CButton>
//                       </div>
//                     </div>
//                   )}
//                   {selectedTransfer.notes && (
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between border-bottom py-2">
//                         <span className="text-muted">Notes:</span>
//                         <span>{selectedTransfer.notes}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Transferred Vehicles List */}
//               <div className="transferred-vehicles">
//                 <h6 className="text-primary mb-3">Transferred Vehicles</h6>
//                 <div className="table-responsive">
//                   <CTable striped bordered hover size="sm">
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
//                         <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                         <CTableHeaderCell>Model Name</CTableHeaderCell>
//                         <CTableHeaderCell style={{ width: '100px' }}>Status</CTableHeaderCell>
//                         <CTableHeaderCell>Error (if any)</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {selectedTransfer.transferredVehicles.map((vehicle, idx) => (
//                         <CTableRow key={vehicle._id}>
//                           <CTableDataCell>{idx + 1}</CTableDataCell>
//                           <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
//                           <CTableDataCell>{vehicle.modelName}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color={vehicle.status === 'success' ? 'success' : 'danger'}>
//                               {vehicle.status === 'success' ? 'Success' : 'Failed'}
//                             </CBadge>
//                           </CTableDataCell>
//                           <CTableDataCell className="text-danger">
//                             {vehicle.error || '-'}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowDetailModal(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockMovementHistory;






// import React, { useState, useEffect, useRef } from 'react';
// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableBody,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CInputGroup,
//   CInputGroupText
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSearch, 
//   cilInfo, 
//   cilFilter, 
//   cilReload, 
//   cilChevronLeft, 
//   cilChevronRight,
//   cilCheckCircle,
//   cilWarning,
//   cilTransfer,
//   cilCloudUpload,
//   cilPaperclip,
//   cilFile
// } from '@coreui/icons';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import { format } from 'date-fns';

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const StockMovementHistory = () => {
//   const [transfers, setTransfers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Server-side state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     totalCount: 0,
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
  
//   // Search and filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchTimer = useRef(null);
  
//   // Filter state
//   const [filterModalOpen, setFilterModalOpen] = useState(false);
//   const [sourceDatabaseFilter, setSourceDatabaseFilter] = useState('');
//   const [targetDatabaseFilter, setTargetDatabaseFilter] = useState('');
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
  
//   // Detail modal state
//   const [selectedTransfer, setSelectedTransfer] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
  
//   // Upload challan state
//   const [fileInputs, setFileInputs] = useState({});
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef({});
  
//   // Database options
//   const [databaseOptions, setDatabaseOptions] = useState([]);
//   const [locations, setLocations] = useState({});
  
//   const { permissions = [] } = useAuth();

//   // Database display names mapping
//   const databaseDisplayNames = {
//     'db1': 'Gandhi TVS Nashik',
//     'db2': 'Gandhi TVS Sangamner'
//   };

//   const getDatabaseDisplayName = (dbKey) => {
//     return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
//   };

//   // Fetch locations for filter dropdowns
//   const fetchLocations = async () => {
//     try {
//       const response = await axiosInstance.get('/crossData/locations');
//       if (response.data.status === 'success') {
//         setLocations(response.data.data);
//         const dbKeys = Object.keys(response.data.data);
//         setDatabaseOptions(dbKeys);
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };

//   // Fetch transfer history with server-side pagination and search
//   const fetchTransferHistory = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
      
//       if (search && search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       if (sourceDatabaseFilter) {
//         params.append('sourceDatabase', sourceDatabaseFilter);
//       }
      
//       if (targetDatabaseFilter) {
//         params.append('targetDatabase', targetDatabaseFilter);
//       }
      
//       const url = `/crossData/transfer-history${params.toString() ? `?${params.toString()}` : ''}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.status === 'success') {
//         setTransfers(response.data.data.transfers || []);
        
//         // Initialize file inputs for each transfer
//         const inputs = {};
//         (response.data.data.transfers || []).forEach((transfer) => {
//           inputs[transfer._id] = null;
//         });
//         setFileInputs(inputs);
        
//         setPagination({
//           page: response.data.data.pagination?.page || page,
//           limit: response.data.data.pagination?.limit || limit,
//           totalCount: response.data.data.pagination?.total || 0,
//           totalPages: response.data.data.pagination?.pages || 1,
//           hasNextPage: response.data.data.pagination?.page < response.data.data.pagination?.pages,
//           hasPrevPage: response.data.data.pagination?.page > 1
//         });
//         setError(null);
//       } else {
//         showError('Failed to fetch transfer history');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   useEffect(() => {
//     fetchTransferHistory();
//   }, [pagination.page, pagination.limit, sourceDatabaseFilter, targetDatabaseFilter]);

//   // Debounced search
//   useEffect(() => {
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchTransferHistory(1, pagination.limit, searchTerm);
//     }, 500);
    
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, [searchTerm]);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.totalPages) return;
//     setPagination(prev => ({ ...prev, page: newPage }));
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleLimitChange = (newLimit) => {
//     setPagination(prev => ({
//       ...prev,
//       limit: parseInt(newLimit, 10),
//       page: 1
//     }));
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//   };

//   const applyFilter = () => {
//     setIsFilterApplied(!!(sourceDatabaseFilter || targetDatabaseFilter));
//     setFilterModalOpen(false);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const clearFilter = () => {
//     setSourceDatabaseFilter('');
//     setTargetDatabaseFilter('');
//     setIsFilterApplied(false);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleViewDetails = (transfer) => {
//     setSelectedTransfer(transfer);
//     setShowDetailModal(true);
//   };

//   // Upload challan handlers
//   const handleFileChange = (transferId, e) => {
//     setFileInputs((prev) => ({
//       ...prev,
//       [transferId]: e.target.files[0]
//     }));
//   };

//   const handleUploadClick = (transferId) => {
//     fileInputRef.current[transferId]?.click();
//   };

//   const handleUploadChallan = async (transferId) => {
//     if (!fileInputs[transferId]) {
//       showError('Please select a file first');
//       return;
//     }

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('challan', fileInputs[transferId]);

//       await axiosInstance.post(`/crossData/transfer-requests/${transferId}/challan`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess('Challan uploaded successfully!');
      
//       // Clear the file input for this transfer
//       setFileInputs((prev) => ({
//         ...prev,
//         [transferId]: null
//       }));
      
//       // Refresh the data
//       fetchTransferHistory();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss');
//     } catch (error) {
//       return '-';
//     }
//   };

//   const getStatusBadge = (summary) => {
//     if (summary.failed > 0 && summary.success === 0) {
//       return <CBadge color="danger">Failed</CBadge>;
//     } else if (summary.failed > 0) {
//       return <CBadge color="warning">Partial Failure</CBadge>;
//     } else {
//       return <CBadge color="success">Success</CBadge>;
//     }
//   };

//   const getChallanStatusBadge = (challanStatus) => {
//     if (challanStatus === 'uploaded') {
//       return <CBadge color="success">Uploaded</CBadge>;
//     } else if (challanStatus === 'pending') {
//       return <CBadge color="warning">Pending</CBadge>;
//     }
//     return <CBadge color="secondary">Not Available</CBadge>;
//   };

//   const startRecord = (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

//   // Calculate displayed page numbers (max 5 pages shown)
//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
//   if (pagination.page <= 3) {
//     endPage = Math.min(5, pagination.totalPages);
//   }
  
//   if (pagination.page >= pagination.totalPages - 2) {
//     startPage = Math.max(1, pagination.totalPages - 4);
//   }
  
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) {
//     displayedPages.push(i);
//   }

//   return (
//     <div>
//       <div className='title'>
//         INTER DEALER TRANSFER History
//       </div>

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           {/* Header content if needed */}
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3 align-items-center">
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
//               <CFormSelect 
//                 value={pagination.limit} 
//                 onChange={(e) => handleLimitChange(e.target.value)}
//                 style={{ width: '80px' }}
//                 size="sm"
//               >
//                 {PAGE_SIZE_OPTIONS.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </CFormSelect>
//             </div>
//             <div className='d-flex align-items-center'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search by Transfer ID, Chassis, Model..."
//                 style={{ width: '300px' }}
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell style={{ width: '60px' }}>#</CTableHeaderCell>
//                   <CTableHeaderCell>Transfer ID</CTableHeaderCell>
//                   <CTableHeaderCell>Source</CTableHeaderCell>
//                   <CTableHeaderCell>Target</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicles</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell>Challan Status</CTableHeaderCell>
//                   <CTableHeaderCell>Transferred By</CTableHeaderCell>
//                   <CTableHeaderCell>Transferred At</CTableHeaderCell>
//                   <CTableHeaderCell style={{ width: '140px' }}>Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {transfers.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={10} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No transfer records available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   transfers.map((transfer, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={transfer._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <span className="fw-mono small">{transfer.transferId}</span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div>
//                             <strong>{transfer.sourceLocationName}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {getDatabaseDisplayName(transfer.sourceDatabase)} ({transfer.sourceLocationType})
//                             </small>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div>
//                             <strong>{transfer.targetLocationName}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {getDatabaseDisplayName(transfer.targetDatabase)} ({transfer.targetLocationType})
//                             </small>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="text-center">
//                             <CBadge color="primary" className="me-1">
//                               Total: {transfer.summary.total}
//                             </CBadge>
//                             <div className="mt-1">
//                               <CBadge color="success" className="me-1">
//                                 S: {transfer.summary.success}
//                               </CBadge>
//                               {transfer.summary.failed > 0 && (
//                                 <CBadge color="danger">
//                                   F: {transfer.summary.failed}
//                                 </CBadge>
//                               )}
//                             </div>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {getStatusBadge(transfer.summary)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {getChallanStatusBadge(transfer.challanStatus)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {transfer.transferredByUserName}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {formatDate(transfer.transferredAt)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="d-flex gap-1 flex-wrap">
//                             <CButton
//                               color="info"
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleViewDetails(transfer)}
//                               title="View Details"
//                             >
//                               <CIcon icon={cilInfo} />
//                             </CButton>
                            
//                             {transfer.challanStatus === 'pending' ? (
//                               <>
//                                 <CButton
//                                   color="primary"
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => handleUploadClick(transfer._id)}
//                                   disabled={uploading}
//                                   title="Upload Challan"
//                                 >
//                                   <CIcon icon={cilCloudUpload} />
//                                 </CButton>
                                
//                                 {/* Hidden file input for challan upload */}
//                                 <input
//                                   type="file"
//                                   ref={(el) => (fileInputRef.current[transfer._id] = el)}
//                                   onChange={(e) => handleFileChange(transfer._id, e)}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                   style={{ display: 'none' }}
//                                 />
                                
//                                 {/* Show file selection and upload button if file is selected */}
//                                 {fileInputs[transfer._id] && (
//                                   <div className="mt-2 d-flex flex-column gap-1" style={{ position: 'absolute', zIndex: 10, background: 'white', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                                     <small className="text-muted">
//                                       <CIcon icon={cilPaperclip} className="me-1" />
//                                       {fileInputs[transfer._id].name}
//                                     </small>
//                                     <CButton
//                                       size="sm"
//                                       color="success"
//                                       onClick={() => handleUploadChallan(transfer._id)}
//                                       disabled={uploading}
//                                     >
//                                       {uploading ? 'Uploading...' : 'Confirm Upload'}
//                                     </CButton>
//                                   </div>
//                                 )}
//                               </>
//                             ) : transfer.challanDocument ? (
//                               <CButton
//                                 color="success"
//                                 size="sm"
//                                 variant="outline"
//                                 href={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 title="View Challan"
//                               >
//                                 <CIcon icon={cilFile} />
//                               </CButton>
//                             ) : null}
//                           </div>
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {/* Pagination Component */}
//           {pagination.totalCount > 0 && (
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '13px' }}>
//                   {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
//                 </span>
//               </div>
              
//               {pagination.totalPages > 1 && (
//                 <CPagination align="center" aria-label="Page navigation example">
//                   <CPaginationItem 
//                     aria-label="Previous" 
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>
                  
//                   {pagination.page > 3 && pagination.totalPages > 5 && (
//                     <>
//                       <CPaginationItem 
//                         onClick={() => handlePageChange(1)}
//                         active={pagination.page === 1}
//                         disabled={loading}
//                       >
//                         1
//                       </CPaginationItem>
//                       {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//                     </>
//                   )}
                  
//                   {displayedPages.map(page => (
//                     <CPaginationItem 
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       active={pagination.page === page}
//                       disabled={loading}
//                     >
//                       {page}
//                     </CPaginationItem>
//                   ))}
                  
//                   {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
//                     <>
//                       {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//                       <CPaginationItem 
//                         onClick={() => handlePageChange(pagination.totalPages)}
//                         active={pagination.page === pagination.totalPages}
//                         disabled={loading}
//                       >
//                         {pagination.totalPages}
//                       </CPaginationItem>
//                     </>
//                   )}
                  
//                   <CPaginationItem 
//                     aria-label="Next" 
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.totalPages || loading}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Filter Modal */}
//       <CModal visible={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>Filter Transfers</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Source Database:</label>
//             <CFormSelect
//               value={sourceDatabaseFilter}
//               onChange={(e) => setSourceDatabaseFilter(e.target.value)}
//             >
//               <option value="">-- All Source Databases --</option>
//               {databaseOptions.map(db => (
//                 <option key={db} value={db}>{getDatabaseDisplayName(db)}</option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Target Database:</label>
//             <CFormSelect
//               value={targetDatabaseFilter}
//               onChange={(e) => setTargetDatabaseFilter(e.target.value)}
//             >
//               <option value="">-- All Target Databases --</option>
//               {databaseOptions.map(db => (
//                 <option key={db} value={db}>{getDatabaseDisplayName(db)}</option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setFilterModalOpen(false)}>Cancel</CButton>
//           <CButton className='submit-button' onClick={applyFilter}>
//             Apply Filters
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Transfer Details Modal */}
//       <CModal visible={showDetailModal} onClose={() => setShowDetailModal(false)} size="xl" scrollable>
//         <CModalHeader closeButton>
//           <CModalTitle>
//             <CIcon icon={cilInfo} className="me-2" />
//             Transfer Details - {selectedTransfer?.transferId}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedTransfer && (
//             <div>
//               {/* Transfer Summary */}
//               <div className="transfer-summary mb-4">
//                 <h6 className="text-primary mb-3">Transfer Summary</h6>
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <div className="border rounded p-3">
//                       <div className="text-muted small">Source</div>
//                       <div className="fw-bold">{selectedTransfer.sourceLocationName}</div>
//                       <div className="small">
//                         {getDatabaseDisplayName(selectedTransfer.sourceDatabase)} ({selectedTransfer.sourceLocationType})
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="border rounded p-3">
//                       <div className="text-muted small">Target</div>
//                       <div className="fw-bold">{selectedTransfer.targetLocationName}</div>
//                       <div className="small">
//                         {getDatabaseDisplayName(selectedTransfer.targetDatabase)} ({selectedTransfer.targetLocationType})
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center">
//                       <div className="text-muted small">Total Vehicles</div>
//                       <div className="h4 mb-0">{selectedTransfer.summary.total}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center bg-success bg-opacity-10">
//                       <div className="text-muted small">Successful</div>
//                       <div className="h4 mb-0 text-success">{selectedTransfer.summary.success}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center bg-danger bg-opacity-10">
//                       <div className="text-muted small">Failed</div>
//                       <div className="h4 mb-0 text-danger">{selectedTransfer.summary.failed}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Transfer Metadata */}
//               <div className="transfer-metadata mb-4">
//                 <h6 className="text-primary mb-3">Transfer Information</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Transfer ID:</span>
//                       <span className="fw-mono">{selectedTransfer.transferId}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Request ID:</span>
//                       <span className="fw-mono">{selectedTransfer.requestId || '-'}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Transferred By:</span>
//                       <span>{selectedTransfer.transferredByUserName}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Transferred At:</span>
//                       <span>{formatDate(selectedTransfer.transferredAt)}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Validate Uniqueness:</span>
//                       <CBadge color={selectedTransfer.validateUniqueness ? 'success' : 'secondary'}>
//                         {selectedTransfer.validateUniqueness ? 'Yes' : 'No'}
//                       </CBadge>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Challan Status:</span>
//                       {getChallanStatusBadge(selectedTransfer.challanStatus)}
//                     </div>
//                   </div>
//                   {selectedTransfer.challanStatus === 'uploaded' && selectedTransfer.challanDocument && (
//                     <div className="col-md-12">
//                       <div className="d-flex justify-content-between border-bottom py-2">
//                         <span className="text-muted">Challan Document:</span>
//                         <CButton
//                           size="sm"
//                           color="info"
//                           href={`${axiosInstance.defaults.baseURL}/${selectedTransfer.challanDocument}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <CIcon icon={cilFile} className="me-1" />
//                           View Challan
//                         </CButton>
//                       </div>
//                     </div>
//                   )}
//                   {selectedTransfer.notes && (
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between border-bottom py-2">
//                         <span className="text-muted">Notes:</span>
//                         <span>{selectedTransfer.notes}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Transferred Vehicles List */}
//               <div className="transferred-vehicles">
//                 <h6 className="text-primary mb-3">Transferred Vehicles</h6>
//                 <div className="table-responsive">
//                   <CTable striped bordered hover size="sm">
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
//                         <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                         <CTableHeaderCell>Model Name</CTableHeaderCell>
//                         <CTableHeaderCell style={{ width: '100px' }}>Status</CTableHeaderCell>
//                         <CTableHeaderCell>Error (if any)</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {selectedTransfer.transferredVehicles.map((vehicle, idx) => (
//                         <CTableRow key={vehicle._id}>
//                           <CTableDataCell>{idx + 1}</CTableDataCell>
//                           <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
//                           <CTableDataCell>{vehicle.modelName}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color={vehicle.status === 'success' ? 'success' : 'danger'}>
//                               {vehicle.status === 'success' ? 'Success' : 'Failed'}
//                             </CBadge>
//                           </CTableDataCell>
//                           <CTableDataCell className="text-danger">
//                             {vehicle.error || '-'}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowDetailModal(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockMovementHistory;






import React, { useState, useEffect, useRef } from 'react';
import '../../css/table.css';
import '../../css/form.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CAlert,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSearch, 
  cilInfo, 
  cilFilter, 
  cilReload, 
  cilChevronLeft, 
  cilChevronRight,
  cilCheckCircle,
  cilWarning,
  cilTransfer,
  cilCloudUpload,
  cilPaperclip,
  cilFile
} from '@coreui/icons';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import TransferChallan from '../purchase/StockChallan';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const StockMovementHistory = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Server-side state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);
  
  // Filter state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sourceDatabaseFilter, setSourceDatabaseFilter] = useState('');
  const [targetDatabaseFilter, setTargetDatabaseFilter] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  // Detail modal state
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Challan modal state
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [isLoadingChallan, setIsLoadingChallan] = useState(false);
  
  // Upload challan state
  const [fileInputs, setFileInputs] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef({});
  
  // Database options
  const [databaseOptions, setDatabaseOptions] = useState([]);
  const [locations, setLocations] = useState({});
  
  const { permissions = [] } = useAuth();

  // Database display names mapping
  const databaseDisplayNames = {
    'db1': 'Gandhi TVS Nashik',
    'db2': 'Gandhi TVS Sangamner'
  };

  const getDatabaseDisplayName = (dbKey) => {
    return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
  };

  // Fetch locations for filter dropdowns
  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get('/crossData/locations');
      if (response.data.status === 'success') {
        setLocations(response.data.data);
        const dbKeys = Object.keys(response.data.data);
        setDatabaseOptions(dbKeys);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch transfer history with server-side pagination and search
  const fetchTransferHistory = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      if (sourceDatabaseFilter) {
        params.append('sourceDatabase', sourceDatabaseFilter);
      }
      
      if (targetDatabaseFilter) {
        params.append('targetDatabase', targetDatabaseFilter);
      }
      
      const url = `/crossData/transfer-history${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        setTransfers(response.data.data.transfers || []);
        
        // Initialize file inputs for each transfer
        const inputs = {};
        (response.data.data.transfers || []).forEach((transfer) => {
          inputs[transfer._id] = null;
        });
        setFileInputs(inputs);
        
        setPagination({
          page: response.data.data.pagination?.page || page,
          limit: response.data.data.pagination?.limit || limit,
          totalCount: response.data.data.pagination?.total || 0,
          totalPages: response.data.data.pagination?.pages || 1,
          hasNextPage: response.data.data.pagination?.page < response.data.data.pagination?.pages,
          hasPrevPage: response.data.data.pagination?.page > 1
        });
        setError(null);
      } else {
        showError('Failed to fetch transfer history');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchTransferHistory();
  }, [pagination.page, pagination.limit, sourceDatabaseFilter, targetDatabaseFilter]);

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTransferHistory(1, pagination.limit, searchTerm);
    }, 500);
    
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit, 10),
      page: 1
    }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const applyFilter = () => {
    setIsFilterApplied(!!(sourceDatabaseFilter || targetDatabaseFilter));
    setFilterModalOpen(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilter = () => {
    setSourceDatabaseFilter('');
    setTargetDatabaseFilter('');
    setIsFilterApplied(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setShowDetailModal(true);
  };

  // Helper function to get location ID from name
  const getLocationIdFromName = async (database, locationType, locationName) => {
    try {
      const response = await axiosInstance.get('/crossData/locations');
      if (response.data.status === 'success') {
        const locationsData = response.data.data;
        const locationData = locationsData[database];
        if (locationData) {
          const items = locationType === 'branch' ? locationData.branches : locationData.subdealers;
          const found = items.find(item => item.name === locationName);
          return found?._id || found?.id || null;
        }
      }
    } catch (error) {
      console.error('Error fetching location ID:', error);
    }
    return null;
  };

  // Handle viewing challan with full vehicle details using the same /crossData/vehicles API
  const handleViewChallan = async (transfer) => {
    setIsLoadingChallan(true);
    
    try {
      // Get vehicle chassis numbers from the transfer
      const transferredVehicles = transfer.transferredVehicles || [];
      const chassisNumbers = transferredVehicles.map(v => v.chassisNumber).filter(Boolean);
      
      console.log('Transfer vehicles:', transferredVehicles);
      console.log('Chassis numbers to match:', chassisNumbers);
      
      let fullVehicles = [];
      
      // Get source location ID if not available
      let sourceLocationId = transfer.sourceLocationId;
      if (!sourceLocationId) {
        sourceLocationId = await getLocationIdFromName(
          transfer.sourceDatabase,
          transfer.sourceLocationType,
          transfer.sourceLocationName
        );
        console.log('Fetched sourceLocationId from name:', sourceLocationId);
      }
      
      if (chassisNumbers.length > 0 && sourceLocationId) {
        // Fetch all vehicles from the source location
        const response = await axiosInstance.get('/crossData/vehicles', { 
          params: {
            database: transfer.sourceDatabase,
            locationType: transfer.sourceLocationType || 'branch',
            locationId: sourceLocationId,
            limit: 1000 // Get all vehicles
          }
        });
        
        console.log('Vehicles API Response:', response.data);
        
        if (response.data.status === 'success') {
          const allVehicles = response.data.data.vehicles || [];
          
          // Create a set of chassis numbers for faster lookup
          const chassisSet = new Set(chassisNumbers);
          
          // Filter vehicles that match the chassis numbers from the transfer
          fullVehicles = allVehicles.filter(vehicle => {
            const vehicleChassis = vehicle.chassisNumber?.trim();
            return chassisSet.has(vehicleChassis);
          });
          
          console.log('Filtered full vehicles:', fullVehicles);
          console.log('Found vehicles:', fullVehicles.length);
          
          // If no vehicles found, try case-insensitive match
          if (fullVehicles.length === 0) {
            const lowerCaseChassis = chassisNumbers.map(c => c?.toLowerCase().trim());
            fullVehicles = allVehicles.filter(vehicle => {
              const vehicleChassis = vehicle.chassisNumber?.toLowerCase().trim();
              return lowerCaseChassis.includes(vehicleChassis);
            });
            console.log('Case-insensitive match found:', fullVehicles.length);
          }
          
          // If still no vehicles found, try partial match or fallback
          if (fullVehicles.length === 0) {
            // Try to match by model or other fields
            const modelNames = transferredVehicles.map(v => v.modelName).filter(Boolean);
            fullVehicles = allVehicles.filter(vehicle => {
              return modelNames.some(model => 
                vehicle.modelName?.toLowerCase().includes(model?.toLowerCase()) ||
                model?.toLowerCase().includes(vehicle.modelName?.toLowerCase())
              );
            });
            console.log('Model name fallback match found:', fullVehicles.length);
          }
        }
      }

      // If no vehicles found, use the transfer vehicles as fallback
      if (fullVehicles.length === 0) {
        console.log('Using fallback vehicles from transfer');
        fullVehicles = transferredVehicles;
      }

      // Map the transfer data to the format expected by TransferChallan
      const challanData = {
        transferDetails: {
          createdAt: transfer.transferredAt
        },
        fromType: transfer.sourceLocationType || 'branch',
        fromBranch: null,
        fromSubdealer: null,
        toType: transfer.targetLocationType || 'branch',
        toBranch: null,
        toSubdealer: null,
        vehicles: fullVehicles,
        destinationName: transfer.targetLocationName || ''
      };

      // Determine source location type
      if (transfer.sourceLocationType === 'branch') {
        challanData.fromBranch = {
          name: transfer.sourceLocationName
        };
      } else {
        challanData.fromSubdealer = {
          name: transfer.sourceLocationName
        };
      }

      // Determine target location type
      if (transfer.targetLocationType === 'branch') {
        challanData.toBranch = {
          name: transfer.targetLocationName
        };
      } else {
        challanData.toSubdealer = {
          name: transfer.targetLocationName
        };
      }

      setChallanData(challanData);
      setShowChallanModal(true);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      
      // Fallback: use the vehicles data from the transfer
      const challanData = {
        transferDetails: {
          createdAt: transfer.transferredAt
        },
        fromType: transfer.sourceLocationType || 'branch',
        fromBranch: null,
        fromSubdealer: null,
        toType: transfer.targetLocationType || 'branch',
        toBranch: null,
        toSubdealer: null,
        vehicles: transfer.transferredVehicles || [],
        destinationName: transfer.targetLocationName || ''
      };

      if (transfer.sourceLocationType === 'branch') {
        challanData.fromBranch = {
          name: transfer.sourceLocationName
        };
      } else {
        challanData.fromSubdealer = {
          name: transfer.sourceLocationName
        };
      }

      if (transfer.targetLocationType === 'branch') {
        challanData.toBranch = {
          name: transfer.targetLocationName
        };
      } else {
        challanData.toSubdealer = {
          name: transfer.targetLocationName
        };
      }

      setChallanData(challanData);
      setShowChallanModal(true);
      showError('Some vehicle details may be incomplete');
    } finally {
      setIsLoadingChallan(false);
    }
  };

  // Upload challan handlers
  const handleFileChange = (transferId, e) => {
    setFileInputs((prev) => ({
      ...prev,
      [transferId]: e.target.files[0]
    }));
  };

  const handleUploadClick = (transferId) => {
    fileInputRef.current[transferId]?.click();
  };

  const handleUploadChallan = async (transferId) => {
    if (!fileInputs[transferId]) {
      showError('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('challan', fileInputs[transferId]);

      await axiosInstance.post(`/crossData/transfer-requests/${transferId}/challan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Challan uploaded successfully!');
      
      // Clear the file input for this transfer
      setFileInputs((prev) => ({
        ...prev,
        [transferId]: null
      }));
      
      // Refresh the data
      fetchTransferHistory();
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss');
    } catch (error) {
      return '-';
    }
  };

  const getStatusBadge = (summary) => {
    if (summary.failed > 0 && summary.success === 0) {
      return <CBadge color="danger">Failed</CBadge>;
    } else if (summary.failed > 0) {
      return <CBadge color="warning">Partial Failure</CBadge>;
    } else {
      return <CBadge color="success">Success</CBadge>;
    }
  };

  const getChallanStatusBadge = (challanStatus) => {
    if (challanStatus === 'uploaded') {
      return <CBadge color="success">Uploaded</CBadge>;
    } else if (challanStatus === 'pending') {
      return <CBadge color="warning">Pending</CBadge>;
    }
    return <CBadge color="secondary">Not Available</CBadge>;
  };

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  // Calculate displayed page numbers (max 5 pages shown)
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
  if (pagination.page <= 3) {
    endPage = Math.min(5, pagination.totalPages);
  }
  
  if (pagination.page >= pagination.totalPages - 2) {
    startPage = Math.max(1, pagination.totalPages - 4);
  }
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) {
    displayedPages.push(i);
  }

  return (
    <div>
      <div className='title'>
        INTER DEALER TRANSFER History
      </div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          {/* Header content if needed */}
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <div className="d-flex align-items-center">
              <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
              <CFormSelect 
                value={pagination.limit} 
                onChange={(e) => handleLimitChange(e.target.value)}
                style={{ width: '80px' }}
                size="sm"
              >
                {PAGE_SIZE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </CFormSelect>
            </div>
            <div className='d-flex align-items-center'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by Transfer ID, Chassis, Model..."
                style={{ width: '300px' }}
              />
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '60px' }}>#</CTableHeaderCell>
                  <CTableHeaderCell>Transfer ID</CTableHeaderCell>
                  <CTableHeaderCell>Source</CTableHeaderCell>
                  <CTableHeaderCell>Target</CTableHeaderCell>
                  <CTableHeaderCell>Vehicles</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Challan Status</CTableHeaderCell>
                  <CTableHeaderCell>Transferred By</CTableHeaderCell>
                  <CTableHeaderCell>Transferred At</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '180px' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transfers.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No transfer records available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  transfers.map((transfer, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={transfer._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-mono small">{transfer.transferId}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <strong>{transfer.sourceLocationName}</strong>
                            <br />
                            <small className="text-muted">
                              {getDatabaseDisplayName(transfer.sourceDatabase)} ({transfer.sourceLocationType})
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <strong>{transfer.targetLocationName}</strong>
                            <br />
                            <small className="text-muted">
                              {getDatabaseDisplayName(transfer.targetDatabase)} ({transfer.targetLocationType})
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-center">
                            <CBadge color="primary" className="me-1">
                              Total: {transfer.summary.total}
                            </CBadge>
                            <div className="mt-1">
                              <CBadge color="success" className="me-1">
                                S: {transfer.summary.success}
                              </CBadge>
                              {transfer.summary.failed > 0 && (
                                <CBadge color="danger">
                                  F: {transfer.summary.failed}
                                </CBadge>
                              )}
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(transfer.summary)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getChallanStatusBadge(transfer.challanStatus)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {transfer.transferredByUserName}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatDate(transfer.transferredAt)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1 flex-wrap">
                            {/* View Details button */}
                            <CButton
                              color="info"
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(transfer)}
                              title="View Details"
                            >
                              <CIcon icon={cilInfo} />
                            </CButton>
                            
                            {/* View Challan button - shows the sales/delivery challan */}
                            <CButton
                              color="primary"
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewChallan(transfer)}
                              title="View Delivery Challan"
                              disabled={!transfer.transferredVehicles || transfer.transferredVehicles.length === 0 || isLoadingChallan}
                            >
                              {isLoadingChallan ? (
                                <CSpinner size="sm" color="primary" />
                              ) : (
                                <CIcon icon={cilFile} />
                              )}
                            </CButton>
                            
                            {/* Upload Challan functionality for pending challans */}
                            {transfer.challanStatus === 'pending' ? (
                              <>
                                <CButton
                                  color="warning"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUploadClick(transfer._id)}
                                  disabled={uploading}
                                  title="Upload Challan"
                                >
                                  <CIcon icon={cilCloudUpload} />
                                </CButton>
                                
                                <input
                                  type="file"
                                  ref={(el) => (fileInputRef.current[transfer._id] = el)}
                                  onChange={(e) => handleFileChange(transfer._id, e)}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  style={{ display: 'none' }}
                                />
                                
                                {fileInputs[transfer._id] && (
                                  <div className="mt-2 d-flex flex-column gap-1" style={{ position: 'absolute', zIndex: 10, background: 'white', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    <small className="text-muted">
                                      <CIcon icon={cilPaperclip} className="me-1" />
                                      {fileInputs[transfer._id].name}
                                    </small>
                                    <CButton
                                      size="sm"
                                      color="success"
                                      onClick={() => handleUploadChallan(transfer._id)}
                                      disabled={uploading}
                                    >
                                      {uploading ? 'Uploading...' : 'Confirm Upload'}
                                    </CButton>
                                  </div>
                                )}
                              </>
                            ) : transfer.challanDocument ? (
                              <CButton
                                color="success"
                                size="sm"
                                variant="outline"
                                href={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Uploaded Challan"
                              >
                                <CIcon icon={cilFile} />
                              </CButton>
                            ) : null}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component */}
          {pagination.totalCount > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
                </span>
              </div>
              
              {pagination.totalPages > 1 && (
                <CPagination align="center" aria-label="Page navigation example">
                  <CPaginationItem 
                    aria-label="Previous" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                  >
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>
                  
                  {pagination.page > 3 && pagination.totalPages > 5 && (
                    <>
                      <CPaginationItem 
                        onClick={() => handlePageChange(1)}
                        active={pagination.page === 1}
                        disabled={loading}
                      >
                        1
                      </CPaginationItem>
                      {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
                    </>
                  )}
                  
                  {displayedPages.map(page => (
                    <CPaginationItem 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      active={pagination.page === page}
                      disabled={loading}
                    >
                      {page}
                    </CPaginationItem>
                  ))}
                  
                  {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
                      <CPaginationItem 
                        onClick={() => handlePageChange(pagination.totalPages)}
                        active={pagination.page === pagination.totalPages}
                        disabled={loading}
                      >
                        {pagination.totalPages}
                      </CPaginationItem>
                    </>
                  )}
                  
                  <CPaginationItem 
                    aria-label="Next" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                  >
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Filter Modal */}
      <CModal visible={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Filter Transfers</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Source Database:</label>
            <CFormSelect
              value={sourceDatabaseFilter}
              onChange={(e) => setSourceDatabaseFilter(e.target.value)}
            >
              <option value="">-- All Source Databases --</option>
              {databaseOptions.map(db => (
                <option key={db} value={db}>{getDatabaseDisplayName(db)}</option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Target Database:</label>
            <CFormSelect
              value={targetDatabaseFilter}
              onChange={(e) => setTargetDatabaseFilter(e.target.value)}
            >
              <option value="">-- All Target Databases --</option>
              {databaseOptions.map(db => (
                <option key={db} value={db}>{getDatabaseDisplayName(db)}</option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setFilterModalOpen(false)}>Cancel</CButton>
          <CButton className='submit-button' onClick={applyFilter}>
            Apply Filters
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Transfer Details Modal */}
      <CModal visible={showDetailModal} onClose={() => setShowDetailModal(false)} size="xl" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilInfo} className="me-2" />
            Transfer Details - {selectedTransfer?.transferId}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTransfer && (
            <div>
              {/* Transfer Summary */}
              <div className="transfer-summary mb-4">
                <h6 className="text-primary mb-3">Transfer Summary</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="text-muted small">Source</div>
                      <div className="fw-bold">{selectedTransfer.sourceLocationName}</div>
                      <div className="small">
                        {getDatabaseDisplayName(selectedTransfer.sourceDatabase)} ({selectedTransfer.sourceLocationType})
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="text-muted small">Target</div>
                      <div className="fw-bold">{selectedTransfer.targetLocationName}</div>
                      <div className="small">
                        {getDatabaseDisplayName(selectedTransfer.targetDatabase)} ({selectedTransfer.targetLocationType})
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <div className="text-muted small">Total Vehicles</div>
                      <div className="h4 mb-0">{selectedTransfer.summary.total}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center bg-success bg-opacity-10">
                      <div className="text-muted small">Successful</div>
                      <div className="h4 mb-0 text-success">{selectedTransfer.summary.success}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center bg-danger bg-opacity-10">
                      <div className="text-muted small">Failed</div>
                      <div className="h4 mb-0 text-danger">{selectedTransfer.summary.failed}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Metadata */}
              <div className="transfer-metadata mb-4">
                <h6 className="text-primary mb-3">Transfer Information</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Transfer ID:</span>
                      <span className="fw-mono">{selectedTransfer.transferId}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Request ID:</span>
                      <span className="fw-mono">{selectedTransfer.requestId || '-'}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Transferred By:</span>
                      <span>{selectedTransfer.transferredByUserName}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Transferred At:</span>
                      <span>{formatDate(selectedTransfer.transferredAt)}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Validate Uniqueness:</span>
                      <CBadge color={selectedTransfer.validateUniqueness ? 'success' : 'secondary'}>
                        {selectedTransfer.validateUniqueness ? 'Yes' : 'No'}
                      </CBadge>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Challan Status:</span>
                      {getChallanStatusBadge(selectedTransfer.challanStatus)}
                    </div>
                  </div>
                  {selectedTransfer.challanStatus === 'uploaded' && selectedTransfer.challanDocument && (
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between border-bottom py-2">
                        <span className="text-muted">Challan Document:</span>
                        <CButton
                          size="sm"
                          color="info"
                          href={`${axiosInstance.defaults.baseURL}/${selectedTransfer.challanDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CIcon icon={cilFile} className="me-1" />
                          View Challan
                        </CButton>
                      </div>
                    </div>
                  )}
                  {selectedTransfer.notes && (
                    <div className="col-12">
                      <div className="d-flex justify-content-between border-bottom py-2">
                        <span className="text-muted">Notes:</span>
                        <span>{selectedTransfer.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transferred Vehicles List */}
              <div className="transferred-vehicles">
                <h6 className="text-primary mb-3">Transferred Vehicles</h6>
                <div className="table-responsive">
                  <CTable striped bordered hover size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                        <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                        <CTableHeaderCell>Model Name</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '100px' }}>Status</CTableHeaderCell>
                        <CTableHeaderCell>Error (if any)</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedTransfer.transferredVehicles.map((vehicle, idx) => (
                        <CTableRow key={vehicle._id}>
                          <CTableDataCell>{idx + 1}</CTableDataCell>
                          <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
                          <CTableDataCell>{vehicle.modelName}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={vehicle.status === 'success' ? 'success' : 'danger'}>
                              {vehicle.status === 'success' ? 'Success' : 'Failed'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-danger">
                            {vehicle.error || '-'}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Transfer Challan Modal */}
      <CModal 
        visible={showChallanModal} 
        onClose={() => setShowChallanModal(false)} 
        size="xl" 
        scrollable
      >
        <CModalHeader closeButton>
          <CModalTitle>Delivery Challan Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {isLoadingChallan ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
              <div className="text-center">
                <CSpinner color="primary" size="lg" />
                <p className="mt-3 text-muted">Loading vehicle details...</p>
              </div>
            </div>
          ) : (
            challanData && <TransferChallan {...challanData} />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowChallanModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockMovementHistory;