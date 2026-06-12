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
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSearch, 
//   cilInfo, 
//   cilFilter, 
//   cilReload, 
//   cilChevronLeft, 
//   cilChevronRight,
//   cilCheck,
//   cilX,
//   cilTransfer,
//   cilWarning
// } from '@coreui/icons';
// import { showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import { format } from 'date-fns';

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const StockMovementRequests = () => {
//   const [requests, setRequests] = useState([]);
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
//   const [statusFilter, setStatusFilter] = useState('');
//   const [sourceDatabaseFilter, setSourceDatabaseFilter] = useState('');
//   const [targetDatabaseFilter, setTargetDatabaseFilter] = useState('');
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
  
//   // Detail modal state
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
  
//   // Accept modal state
//   const [acceptModalOpen, setAcceptModalOpen] = useState(false);
//   const [acceptRequestId, setAcceptRequestId] = useState(null);
//   const [actionNote, setActionNote] = useState('');
//   const [acceptLoading, setAcceptLoading] = useState(false);
//   const [acceptError, setAcceptError] = useState('');
  
//   // Reject modal state
//   const [rejectModalOpen, setRejectModalOpen] = useState(false);
//   const [rejectRequestId, setRejectRequestId] = useState(null);
//   const [rejectReason, setRejectReason] = useState('');
//   const [rejectLoading, setRejectLoading] = useState(false);
//   const [rejectError, setRejectError] = useState('');
  
//   // Database options
//   const [databaseOptions, setDatabaseOptions] = useState([]);
  
//   const { permissions = [], user } = useAuth();

//   // Database display names mapping
//   const databaseDisplayNames = {
//     'db1': 'Gandhi TVS Nashik',
//     'db2': 'Gandhi TVS Sangamner'
//   };

//   const getDatabaseDisplayName = (dbKey) => {
//     return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
//   };

//   // Fetch transfer requests with server-side pagination and search
//   const fetchTransferRequests = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
      
//       if (search && search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       if (statusFilter) {
//         params.append('status', statusFilter);
//       }
      
//       if (sourceDatabaseFilter) {
//         params.append('sourceDatabase', sourceDatabaseFilter);
//       }
      
//       if (targetDatabaseFilter) {
//         params.append('targetDatabase', targetDatabaseFilter);
//       }
      
//       const url = `/crossData/transfer-requests${params.toString() ? `?${params.toString()}` : ''}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.status === 'success') {
//         setRequests(response.data.data.requests || []);
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
//         setError(response.data.message || 'Failed to fetch transfer requests');
//       }
//     } catch (error) {
//       let errorMessage = 'Failed to fetch transfer requests';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch database options from locations
//   const fetchDatabaseOptions = async () => {
//     try {
//       const response = await axiosInstance.get('/crossData/locations');
//       if (response.data.status === 'success') {
//         const dbKeys = Object.keys(response.data.data);
//         setDatabaseOptions(dbKeys);
//       }
//     } catch (error) {
//       console.error('Error fetching database options:', error);
//     }
//   };

//   useEffect(() => {
//     fetchDatabaseOptions();
//   }, []);

//   useEffect(() => {
//     fetchTransferRequests();
//   }, [pagination.page, pagination.limit, statusFilter, sourceDatabaseFilter, targetDatabaseFilter]);

//   // Debounced search
//   useEffect(() => {
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchTransferRequests(1, pagination.limit, searchTerm);
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
//     setIsFilterApplied(!!(statusFilter || sourceDatabaseFilter || targetDatabaseFilter));
//     setFilterModalOpen(false);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const clearFilter = () => {
//     setStatusFilter('');
//     setSourceDatabaseFilter('');
//     setTargetDatabaseFilter('');
//     setIsFilterApplied(false);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleAcceptClick = (requestId) => {
//     setAcceptRequestId(requestId);
//     setActionNote('');
//     setAcceptError('');
//     setAcceptModalOpen(true);
//   };

//   const handleAcceptSubmit = async () => {
//     if (!actionNote.trim()) {
//       setAcceptError('Please provide an action note for accepting this transfer');
//       return;
//     }

//     setAcceptLoading(true);
//     setAcceptError('');
    
//     try {
//       // Using requestId (like TRQ-1779172001070-7SBF82) in the URL
//       const response = await axiosInstance.post(`/crossData/transfer-requests/${acceptRequestId}/accept`, {
//         actionNote: actionNote
//       });
      
//       if (response.data.status === 'success') {
//         showSuccess('Transfer request accepted successfully! Vehicles have been transferred.');
//         setAcceptModalOpen(false);
//         setAcceptRequestId(null);
//         setActionNote('');
//         fetchTransferRequests();
//         if (showDetailModal) {
//           setShowDetailModal(false);
//         }
//       } else {
//         setAcceptError(response.data.message || 'Failed to accept transfer request');
//       }
//     } catch (error) {
//       let errorMessage = 'Failed to accept transfer request';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//       setAcceptError(errorMessage);
//     } finally {
//       setAcceptLoading(false);
//     }
//   };

//   const handleRejectClick = (requestId) => {
//     setRejectRequestId(requestId);
//     setRejectReason('');
//     setRejectError('');
//     setRejectModalOpen(true);
//   };

//   const handleRejectSubmit = async () => {
//     if (!rejectReason.trim()) {
//       setRejectError('Please provide a reason for rejection');
//       return;
//     }

//     setRejectLoading(true);
//     setRejectError('');
    
//     try {
//       // Using requestId (like TRQ-1779172001070-7SBF82) in the URL
//       const response = await axiosInstance.post(`/crossData/transfer-requests/${rejectRequestId}/reject`, {
//         reason: rejectReason
//       });
      
//       if (response.data.status === 'success') {
//         showSuccess('Transfer request rejected successfully!');
//         setRejectModalOpen(false);
//         setRejectRequestId(null);
//         setRejectReason('');
//         fetchTransferRequests();
//         if (showDetailModal) {
//           setShowDetailModal(false);
//         }
//       } else {
//         setRejectError(response.data.message || 'Failed to reject transfer request');
//       }
//     } catch (error) {
//       let errorMessage = 'Failed to reject transfer request';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//       setRejectError(errorMessage);
//     } finally {
//       setRejectLoading(false);
//     }
//   };

//   const handleViewDetails = (request) => {
//     setSelectedRequest(request);
//     setShowDetailModal(true);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss');
//     } catch (error) {
//       return '-';
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return <CBadge color="warning">Pending</CBadge>;
//       case 'accepted':
//         return <CBadge color="success">Accepted</CBadge>;
//       case 'rejected':
//         return <CBadge color="danger">Rejected</CBadge>;
//       case 'completed':
//         return <CBadge color="info">Completed</CBadge>;
//       default:
//         return <CBadge color="secondary">{status || 'Unknown'}</CBadge>;
//     }
//   };

//   const startRecord = (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

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
       
//         INTER DEALER TRANSFER Requests
//       </div>

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           {/* <div>
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
            
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => fetchTransferRequests()}
//               disabled={loading}
//             >
//               <CIcon icon={cilReload} className='icon' /> Refresh
//             </CButton>
//           </div> */}
//         </CCardHeader>
        
//         <CCardBody>
//           {error && (
//             <CAlert color="danger" dismissible onClose={() => setError(null)}>
//               {error}
//             </CAlert>
//           )}

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
//                 placeholder="Search by Request ID, Chassis, Model..."
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
//                   <CTableHeaderCell>Request ID</CTableHeaderCell>
//                   <CTableHeaderCell>Source</CTableHeaderCell>
//                   <CTableHeaderCell>Target</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicles</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell>Requested By</CTableHeaderCell>
//                   <CTableHeaderCell>Requested At</CTableHeaderCell>
//                   <CTableHeaderCell style={{ width: '120px' }}>Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {requests.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={9} className="text-center">
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No transfer requests available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   requests.map((request, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     const isPending = request.status?.toLowerCase() === 'pending';
                    
//                     return (
//                       <CTableRow key={request._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>
//                           <span className="fw-mono small">{request.requestId}</span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div>
//                             <strong>{request.sourceLocationName}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {getDatabaseDisplayName(request.sourceDatabase)} ({request.sourceLocationType})
//                             </small>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div>
//                             <strong>{request.targetLocationName}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {getDatabaseDisplayName(request.targetDatabase)} ({request.targetLocationType})
//                             </small>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="text-center">
//                             <CBadge color="primary">
//                               Total: {request.summary.total}
//                             </CBadge>
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {getStatusBadge(request.status)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {request.requestedByUserName}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {formatDate(request.requestedAt)}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="d-flex gap-1">
//                             <CButton
//                               color="info"
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleViewDetails(request)}
//                               title="View Details"
//                             >
//                               <CIcon icon={cilInfo} />
//                             </CButton>
                            
//                             {isPending && (
//                               <>
//                                 <CButton
//                                   color="success"
//                                   size="sm"
//                                   onClick={() => handleAcceptClick(request.requestId)}
//                                   title="Accept Request"
//                                 >
//                                   <CIcon icon={cilCheck} />
//                                 </CButton>
                                
//                                 <CButton
//                                   color="danger"
//                                   size="sm"
//                                   onClick={() => handleRejectClick(request.requestId)}
//                                   title="Reject Request"
//                                 >
//                                   <CIcon icon={cilX} />
//                                 </CButton>
//                               </>
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
//           <CModalTitle>Filter Transfer Requests</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Status:</label>
//             <CFormSelect
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">-- All Statuses --</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="rejected">Rejected</option>
//               <option value="completed">Completed</option>
//             </CFormSelect>
//           </div>

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

//       {/* Request Details Modal */}
//       <CModal visible={showDetailModal} onClose={() => setShowDetailModal(false)} size="xl" scrollable>
//         <CModalHeader closeButton>
//           <CModalTitle>
//             <CIcon icon={cilInfo} className="me-2" />
//             Transfer Request Details - {selectedRequest?.requestId}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedRequest && (
//             <div>
//               <div className="request-summary mb-4">
//                 <h6 className="text-primary mb-3">Request Summary</h6>
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <div className="border rounded p-3">
//                       <div className="text-muted small">Source</div>
//                       <div className="fw-bold">{selectedRequest.sourceLocationName}</div>
//                       <div className="small">
//                         {getDatabaseDisplayName(selectedRequest.sourceDatabase)} ({selectedRequest.sourceLocationType})
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="border rounded p-3">
//                       <div className="text-muted small">Target</div>
//                       <div className="fw-bold">{selectedRequest.targetLocationName}</div>
//                       <div className="small">
//                         {getDatabaseDisplayName(selectedRequest.targetDatabase)} ({selectedRequest.targetLocationType})
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center">
//                       <div className="text-muted small">Total Vehicles</div>
//                       <div className="h4 mb-0">{selectedRequest.summary.total}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center">
//                       <div className="text-muted small">Status</div>
//                       <div>{getStatusBadge(selectedRequest.status)}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="border rounded p-3 text-center">
//                       <div className="text-muted small">Validate Uniqueness</div>
//                       <CBadge color={selectedRequest.validateUniqueness ? 'success' : 'secondary'}>
//                         {selectedRequest.validateUniqueness ? 'Yes' : 'No'}
//                       </CBadge>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="request-metadata mb-4">
//                 <h6 className="text-primary mb-3">Request Information</h6>
//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Request ID:</span>
//                       <span className="fw-mono">{selectedRequest.requestId}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Requested By:</span>
//                       <span>{selectedRequest.requestedByUserName}</span>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="d-flex justify-content-between border-bottom py-2">
//                       <span className="text-muted">Requested At:</span>
//                       <span>{formatDate(selectedRequest.requestedAt)}</span>
//                     </div>
//                   </div>
//                   {selectedRequest.notes && (
//                     <div className="col-12">
//                       <div className="d-flex justify-content-between border-bottom py-2">
//                         <span className="text-muted">Notes:</span>
//                         <span>{selectedRequest.notes}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="requested-vehicles">
//                 <h6 className="text-primary mb-3">Requested Vehicles</h6>
//                 <div className="table-responsive">
//                   <CTable striped bordered hover size="sm">
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
//                         <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                         <CTableHeaderCell>Model Name</CTableHeaderCell>
//                         <CTableHeaderCell>Type</CTableHeaderCell>
//                         <CTableHeaderCell>Color</CTableHeaderCell>
//                         <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                         <CTableHeaderCell>Transfer Status</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {selectedRequest.requestedVehicles.map((vehicle, idx) => (
//                         <CTableRow key={vehicle._id}>
//                           <CTableDataCell>{idx + 1}</CTableDataCell>
//                           <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
//                           <CTableDataCell>{vehicle.modelName}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color="secondary">{vehicle.type}</CBadge>
//                           </CTableDataCell>
//                           <CTableDataCell>{vehicle.color?.name || '-'}</CTableDataCell>
//                           <CTableDataCell>{formatDate(vehicle.inwardDate)}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color={
//                               vehicle.transferStatus === 'pending' ? 'warning' :
//                               vehicle.transferStatus === 'success' ? 'success' :
//                               'danger'
//                             }>
//                               {vehicle.transferStatus || 'Pending'}
//                             </CBadge>
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
//           {selectedRequest?.status?.toLowerCase() === 'pending' && (
//             <>
//               <CButton 
//                 color="success" 
//                 onClick={() => {
//                   setShowDetailModal(false);
//                   handleAcceptClick(selectedRequest.requestId);
//                 }}
//               >
//                 <CIcon icon={cilCheck} className="me-1" /> Accept
//               </CButton>
//               <CButton 
//                 color="danger" 
//                 onClick={() => {
//                   setShowDetailModal(false);
//                   handleRejectClick(selectedRequest.requestId);
//                 }}
//               >
//                 <CIcon icon={cilX} className="me-1" /> Reject
//               </CButton>
//             </>
//           )}
//         </CModalFooter>
//       </CModal>

//       {/* Accept Modal with Action Note */}
//       <CModal visible={acceptModalOpen} onClose={() => setAcceptModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilCheck} className="me-2 text-success" />
//             Accept Transfer Request
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {acceptError && (
//             <CAlert color="danger" className="mb-3">
//               {acceptError}
//             </CAlert>
//           )}
//           <div className="mb-3">
//             <label className="form-label">Action Note <span className='required'>*</span></label>
//             <CFormTextarea
//               value={actionNote}
//               onChange={(e) => {
//                 setActionNote(e.target.value);
//                 setAcceptError('');
//               }}
//               rows={4}
//               placeholder="Please provide an action note for accepting this transfer request..."
//               required
//             />
//             <small className="text-muted">This note will be recorded with the transfer</small>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => setAcceptModalOpen(false)}
//             disabled={acceptLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="success"
//             onClick={handleAcceptSubmit}
//             disabled={acceptLoading}
//           >
//             {acceptLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Accepting...
//               </>
//             ) : (
//               <>
//                 <CIcon icon={cilCheck} className="me-1" />
//                 Accept Request
//               </>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Reject Modal */}
//       <CModal visible={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilWarning} className="me-2 text-danger" />
//             Reject Transfer Request
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {rejectError && (
//             <CAlert color="danger" className="mb-3">
//               {rejectError}
//             </CAlert>
//           )}
//           <div className="mb-3">
//             <label className="form-label">Reason for Rejection <span className='required'>*</span></label>
//             <CFormTextarea
//               value={rejectReason}
//               onChange={(e) => {
//                 setRejectReason(e.target.value);
//                 setRejectError('');
//               }}
//               rows={4}
//               placeholder="Please provide a reason for rejecting this transfer request..."
//               required
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => setRejectModalOpen(false)}
//             disabled={rejectLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="danger"
//             onClick={handleRejectSubmit}
//             disabled={rejectLoading}
//           >
//             {rejectLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Rejecting...
//               </>
//             ) : (
//               <>
//                 <CIcon icon={cilX} className="me-1" />
//                 Reject Request
//               </>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockMovementRequests;



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
  CFormTextarea,
  CAlert,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSearch, 
  cilInfo, 
  cilFilter, 
  cilReload, 
  cilChevronLeft, 
  cilChevronRight,
  cilCheck,
  cilX,
  cilTransfer,
  cilWarning
} from '@coreui/icons';
import { showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const StockMovementRequests = () => {
  const [requests, setRequests] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceDatabaseFilter, setSourceDatabaseFilter] = useState('');
  const [targetDatabaseFilter, setTargetDatabaseFilter] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  // Detail modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Accept modal state
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [acceptRequestId, setAcceptRequestId] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState('');
  
  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectError, setRejectError] = useState('');
  
  // Database options
  const [databaseOptions, setDatabaseOptions] = useState([]);
  
  const { permissions = [], user } = useAuth();

  // Permission checks for Stock Movement module (IDT Requests)
  // Using the PAGES.STOCK_MOVEMENT constants for page-level permissions
  const canViewIDTList = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_LIST);
  const canViewIDTHistory = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_HISTORY);
  const canViewIDTRequests = canViewPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_REQUESTS);
  
  // For Accept/Reject operations - using CREATE permission (since these are actions that modify data)
  // Also checking with hasSafePagePermission for more granular control
  const canAcceptRequest = canCreateInPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_REQUESTS);
  const canRejectRequest = canCreateInPage(permissions, MODULES.STOCK_MOVEMENT, PAGES.STOCK_MOVEMENT.IDT_REQUESTS);
  
  const hasAcceptPermission = hasSafePagePermission(
    permissions, 
    MODULES.STOCK_MOVEMENT, 
    PAGES.STOCK_MOVEMENT.IDT_REQUESTS, 
    ACTIONS.CREATE
  );
  
  const hasRejectPermission = hasSafePagePermission(
    permissions, 
    MODULES.STOCK_MOVEMENT, 
    PAGES.STOCK_MOVEMENT.IDT_REQUESTS, 
    ACTIONS.CREATE
  );
  
  // Combined permission check for accept/reject actions
  const canPerformAction = canAcceptRequest || canRejectRequest || hasAcceptPermission || hasRejectPermission;

  // Database display names mapping
  const databaseDisplayNames = {
    'db1': 'Gandhi TVS Nashik',
    'db2': 'Gandhi TVS Sangamner'
  };

  const getDatabaseDisplayName = (dbKey) => {
    return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
  };

  // Fetch transfer requests with server-side pagination and search
  const fetchTransferRequests = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    // Check if user has permission to view IDT Requests
    if (!canViewIDTRequests) {
      setError('You do not have permission to view transfer requests');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      if (sourceDatabaseFilter) {
        params.append('sourceDatabase', sourceDatabaseFilter);
      }
      
      if (targetDatabaseFilter) {
        params.append('targetDatabase', targetDatabaseFilter);
      }
      
      const url = `/crossData/transfer-requests${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        setRequests(response.data.data.requests || []);
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
        setError(response.data.message || 'Failed to fetch transfer requests');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch transfer requests';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch database options from locations
  const fetchDatabaseOptions = async () => {
    try {
      const response = await axiosInstance.get('/crossData/locations');
      if (response.data.status === 'success') {
        const dbKeys = Object.keys(response.data.data);
        setDatabaseOptions(dbKeys);
      }
    } catch (error) {
      console.error('Error fetching database options:', error);
    }
  };

  useEffect(() => {
    fetchDatabaseOptions();
  }, []);

  useEffect(() => {
    if (canViewIDTRequests) {
      fetchTransferRequests();
    }
  }, [pagination.page, pagination.limit, statusFilter, sourceDatabaseFilter, targetDatabaseFilter]);

  // Debounced search
  useEffect(() => {
    if (!canViewIDTRequests) return;
    
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTransferRequests(1, pagination.limit, searchTerm);
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
    setIsFilterApplied(!!(statusFilter || sourceDatabaseFilter || targetDatabaseFilter));
    setFilterModalOpen(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilter = () => {
    setStatusFilter('');
    setSourceDatabaseFilter('');
    setTargetDatabaseFilter('');
    setIsFilterApplied(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAcceptClick = (requestId) => {
    // Check permission before allowing accept action
    if (!canAcceptRequest && !hasAcceptPermission) {
      setError('You do not have permission to accept transfer requests');
      return;
    }
    setAcceptRequestId(requestId);
    setActionNote('');
    setAcceptError('');
    setAcceptModalOpen(true);
  };

  const handleAcceptSubmit = async () => {
    if (!actionNote.trim()) {
      setAcceptError('Please provide an action note for accepting this transfer');
      return;
    }

    setAcceptLoading(true);
    setAcceptError('');
    
    try {
      const response = await axiosInstance.post(`/crossData/transfer-requests/${acceptRequestId}/accept`, {
        actionNote: actionNote
      });
      
      if (response.data.status === 'success') {
        showSuccess('Transfer request accepted successfully! Vehicles have been transferred.');
        setAcceptModalOpen(false);
        setAcceptRequestId(null);
        setActionNote('');
        fetchTransferRequests();
        if (showDetailModal) {
          setShowDetailModal(false);
        }
      } else {
        setAcceptError(response.data.message || 'Failed to accept transfer request');
      }
    } catch (error) {
      let errorMessage = 'Failed to accept transfer request';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setAcceptError(errorMessage);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleRejectClick = (requestId) => {
    // Check permission before allowing reject action
    if (!canRejectRequest && !hasRejectPermission) {
      setError('You do not have permission to reject transfer requests');
      return;
    }
    setRejectRequestId(requestId);
    setRejectReason('');
    setRejectError('');
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setRejectError('Please provide a reason for rejection');
      return;
    }

    setRejectLoading(true);
    setRejectError('');
    
    try {
      const response = await axiosInstance.post(`/crossData/transfer-requests/${rejectRequestId}/reject`, {
        reason: rejectReason
      });
      
      if (response.data.status === 'success') {
        showSuccess('Transfer request rejected successfully!');
        setRejectModalOpen(false);
        setRejectRequestId(null);
        setRejectReason('');
        fetchTransferRequests();
        if (showDetailModal) {
          setShowDetailModal(false);
        }
      } else {
        setRejectError(response.data.message || 'Failed to reject transfer request');
      }
    } catch (error) {
      let errorMessage = 'Failed to reject transfer request';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setRejectError(errorMessage);
    } finally {
      setRejectLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    // View details requires VIEW permission
    if (!canViewIDTRequests) {
      setError('You do not have permission to view request details');
      return;
    }
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss');
    } catch (error) {
      return '-';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <CBadge color="warning">Pending</CBadge>;
      case 'accepted':
        return <CBadge color="success">Accepted</CBadge>;
      case 'rejected':
        return <CBadge color="danger">Rejected</CBadge>;
      case 'completed':
        return <CBadge color="info">Completed</CBadge>;
      default:
        return <CBadge color="secondary">{status || 'Unknown'}</CBadge>;
    }
  };

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

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

  // If user doesn't have permission to view IDT Requests, show access denied message
  if (!canViewIDTRequests) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view IDT Transfer Requests.
      </div>
    );
  }

  return (
    <div>
      <div className='title'>
        INTER DEALER TRANSFER Requests
      </div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          {/* Filter buttons - can be uncommented if needed */}
        </CCardHeader>
        
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

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
                placeholder="Search by Request ID, Chassis, Model..."
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
                  <CTableHeaderCell>Request ID</CTableHeaderCell>
                  <CTableHeaderCell>Source</CTableHeaderCell>
                  <CTableHeaderCell>Target</CTableHeaderCell>
                  <CTableHeaderCell>Vehicles</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Requested By</CTableHeaderCell>
                  <CTableHeaderCell>Requested At</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '120px' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {requests.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No transfer requests available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  requests.map((request, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    const isPending = request.status?.toLowerCase() === 'pending';
                    
                    return (
                      <CTableRow key={request._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-mono small">{request.requestId}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <strong>{request.sourceLocationName}</strong>
                            <br />
                            <small className="text-muted">
                              {getDatabaseDisplayName(request.sourceDatabase)} ({request.sourceLocationType})
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <strong>{request.targetLocationName}</strong>
                            <br />
                            <small className="text-muted">
                              {getDatabaseDisplayName(request.targetDatabase)} ({request.targetLocationType})
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-center">
                            <CBadge color="primary">
                              Total: {request.summary.total}
                            </CBadge>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(request.status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {request.requestedByUserName}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatDate(request.requestedAt)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            {/* View Details button - requires VIEW permission */}
                            {canViewIDTRequests && (
                              <CButton
                                color="info"
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(request)}
                                title="View Details"
                              >
                                <CIcon icon={cilInfo} />
                              </CButton>
                            )}
                            
                            {/* Accept button - requires CREATE permission */}
                            {isPending && (canAcceptRequest || hasAcceptPermission) && (
                              <CButton
                                color="success"
                                size="sm"
                                onClick={() => handleAcceptClick(request.requestId)}
                                title="Accept Request"
                              >
                                <CIcon icon={cilCheck} />
                              </CButton>
                            )}
                            
                            {/* Reject button - requires CREATE permission */}
                            {isPending && (canRejectRequest || hasRejectPermission) && (
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleRejectClick(request.requestId)}
                                title="Reject Request"
                              >
                                <CIcon icon={cilX} />
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

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
          <CModalTitle>Filter Transfer Requests</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Status:</label>
            <CFormSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">-- All Statuses --</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </CFormSelect>
          </div>

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

      {/* Request Details Modal */}
      <CModal visible={showDetailModal} onClose={() => setShowDetailModal(false)} size="xl" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilInfo} className="me-2" />
            Transfer Request Details - {selectedRequest?.requestId}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRequest && (
            <div>
              <div className="request-summary mb-4">
                <h6 className="text-primary mb-3">Request Summary</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="text-muted small">Source</div>
                      <div className="fw-bold">{selectedRequest.sourceLocationName}</div>
                      <div className="small">
                        {getDatabaseDisplayName(selectedRequest.sourceDatabase)} ({selectedRequest.sourceLocationType})
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <div className="text-muted small">Target</div>
                      <div className="fw-bold">{selectedRequest.targetLocationName}</div>
                      <div className="small">
                        {getDatabaseDisplayName(selectedRequest.targetDatabase)} ({selectedRequest.targetLocationType})
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <div className="text-muted small">Total Vehicles</div>
                      <div className="h4 mb-0">{selectedRequest.summary.total}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <div className="text-muted small">Status</div>
                      <div>{getStatusBadge(selectedRequest.status)}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <div className="text-muted small">Validate Uniqueness</div>
                      <CBadge color={selectedRequest.validateUniqueness ? 'success' : 'secondary'}>
                        {selectedRequest.validateUniqueness ? 'Yes' : 'No'}
                      </CBadge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="request-metadata mb-4">
                <h6 className="text-primary mb-3">Request Information</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Request ID:</span>
                      <span className="fw-mono">{selectedRequest.requestId}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Requested By:</span>
                      <span>{selectedRequest.requestedByUserName}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Requested At:</span>
                      <span>{formatDate(selectedRequest.requestedAt)}</span>
                    </div>
                  </div>
                  {selectedRequest.notes && (
                    <div className="col-12">
                      <div className="d-flex justify-content-between border-bottom py-2">
                        <span className="text-muted">Notes:</span>
                        <span>{selectedRequest.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="requested-vehicles">
                <h6 className="text-primary mb-3">Requested Vehicles</h6>
                <div className="table-responsive">
                  <CTable striped bordered hover size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                        <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                        <CTableHeaderCell>Model Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Color</CTableHeaderCell>
                        <CTableHeaderCell>Inward Date</CTableHeaderCell>
                        <CTableHeaderCell>Transfer Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedRequest.requestedVehicles.map((vehicle, idx) => (
                        <CTableRow key={vehicle._id}>
                          <CTableDataCell>{idx + 1}</CTableDataCell>
                          <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
                          <CTableDataCell>{vehicle.modelName}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="secondary">{vehicle.type}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{vehicle.color?.name || '-'}</CTableDataCell>
                          <CTableDataCell>{formatDate(vehicle.inwardDate)}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={
                              vehicle.transferStatus === 'pending' ? 'warning' :
                              vehicle.transferStatus === 'success' ? 'success' :
                              'danger'
                            }>
                              {vehicle.transferStatus || 'Pending'}
                            </CBadge>
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
          {/* Accept and Reject buttons in modal - require CREATE permission */}
          {selectedRequest?.status?.toLowerCase() === 'pending' && (canAcceptRequest || hasAcceptPermission) && (
            <CButton 
              color="success" 
              onClick={() => {
                setShowDetailModal(false);
                handleAcceptClick(selectedRequest.requestId);
              }}
            >
              <CIcon icon={cilCheck} className="me-1" /> Accept
            </CButton>
          )}
          {selectedRequest?.status?.toLowerCase() === 'pending' && (canRejectRequest || hasRejectPermission) && (
            <CButton 
              color="danger" 
              onClick={() => {
                setShowDetailModal(false);
                handleRejectClick(selectedRequest.requestId);
              }}
            >
              <CIcon icon={cilX} className="me-1" /> Reject
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* Accept Modal with Action Note */}
      <CModal visible={acceptModalOpen} onClose={() => setAcceptModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilCheck} className="me-2 text-success" />
            Accept Transfer Request
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {acceptError && (
            <CAlert color="danger" className="mb-3">
              {acceptError}
            </CAlert>
          )}
          <div className="mb-3">
            <label className="form-label">Action Note <span className='required'>*</span></label>
            <CFormTextarea
              value={actionNote}
              onChange={(e) => {
                setActionNote(e.target.value);
                setAcceptError('');
              }}
              rows={4}
              placeholder="Please provide an action note for accepting this transfer request..."
              required
            />
            <small className="text-muted">This note will be recorded with the transfer</small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setAcceptModalOpen(false)}
            disabled={acceptLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color="success"
            onClick={handleAcceptSubmit}
            disabled={acceptLoading}
          >
            {acceptLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Accepting...
              </>
            ) : (
              <>
                <CIcon icon={cilCheck} className="me-1" />
                Accept Request
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Reject Modal */}
      <CModal visible={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilWarning} className="me-2 text-danger" />
            Reject Transfer Request
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {rejectError && (
            <CAlert color="danger" className="mb-3">
              {rejectError}
            </CAlert>
          )}
          <div className="mb-3">
            <label className="form-label">Reason for Rejection <span className='required'>*</span></label>
            <CFormTextarea
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                setRejectError('');
              }}
              rows={4}
              placeholder="Please provide a reason for rejecting this transfer request..."
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setRejectModalOpen(false)}
            disabled={rejectLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color="danger"
            onClick={handleRejectSubmit}
            disabled={rejectLoading}
          >
            {rejectLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Rejecting...
              </>
            ) : (
              <>
                <CIcon icon={cilX} className="me-1" />
                Reject Request
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockMovementRequests;