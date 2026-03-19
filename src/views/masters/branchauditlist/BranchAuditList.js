// import '../../../css/table.css';
// import '../../../css/form.css';
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
// import AddBranchAuditModal from './AddBranchAuditModal';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../../utils/modulePermissions';

// const BranchAuditList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingAudit, setEditingAudit] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [branches, setBranches] = useState([]);
  
//   // Filter states
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [selectedAuditType, setSelectedAuditType] = useState('all');
//   const [tempSelectedBranch, setTempSelectedBranch] = useState(null);
//   const [tempSelectedAuditType, setTempSelectedAuditType] = useState('all');
//   const [isFiltered, setIsFiltered] = useState(false);

//   // Permissions
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user has BRANCH role
//   const isBranchUser = authUser?.roles?.some(role => role.name === 'BRANCH');
  
//   // Get branch ID from user data if user is a branch user
//   const userBranchId = authUser?.branch?._id;
//   const userBranchName = authUser?.branch?.name;
  
//   // Page-level permission checks for Branch Audit List page
//   // You need to define MODULES and PAGES for Branch Audit in your modulePermissions file
//   // Temporary fix in BranchAuditList.js:
// const canViewAuditList = canViewPage(permissions, 'MASTERS', 'Branch Audit List');
// const canCreateAudit = canCreateInPage(permissions, 'MASTERS', 'Branch Audit List');
// const canUpdateAudit = canUpdateInPage(permissions, 'MASTERS', 'Branch Audit List');
// const canDeleteAudit = canDeleteInPage(permissions, 'MASTERS', 'Branch Audit List');
//   const showActionColumn = canUpdateAudit || canDeleteAudit;

//   useEffect(() => {
//     if (!canViewAuditList) {
//       showError('You do not have permission to view Branch Audit List');
//       return;
//     }
    
//     fetchData();
//     fetchBranches();
//   }, [canViewAuditList]);

//   useEffect(() => {
//     filterData();
//   }, [selectedBranch, selectedAuditType, data]);

//   const fetchBranches = async () => {
//     try {
//       // Assuming you have an API endpoint to fetch branches
//       // Replace with your actual API endpoint
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data?.branches || response.data?.data || []);
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
//       const response = await axiosInstance.get('/branch-audits/schedule');
//       let audits = response.data.data?.branchAudits || response.data?.data || [];
      
//       // Filter by branch ID if user is a branch user
//       if (isBranchUser && userBranchId) {
//         audits = audits.filter(audit => 
//           audit.branch === userBranchId || 
//           audit.branchDetails?._id === userBranchId
//         );
        
//         // Automatically set the filter to the branch's own ID
//         setSelectedBranch(userBranchId);
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

//     // Filter by branch
//     if (selectedBranch) {
//       filtered = filtered.filter(audit => 
//         audit.branch === selectedBranch || 
//         audit.branchDetails?._id === selectedBranch
//       );
//     }

//     setFilteredData(filtered);
    
//     // Check if any filter is active
//     const hasActiveFilter = selectedAuditType !== 'all' || selectedBranch !== null;
//     setIsFiltered(hasActiveFilter);
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
    
//     let dataToFilter = data;
    
//     // Apply current filters first
//     if (selectedAuditType !== 'all') {
//       dataToFilter = dataToFilter.filter(audit => audit.auditType === selectedAuditType);
//     }
    
//     if (selectedBranch) {
//       dataToFilter = dataToFilter.filter(audit => 
//         audit.branch === selectedBranch || 
//         audit.branchDetails?._id === selectedBranch
//       );
//     }
    
//     handleFilter(searchValue, [
//       'branchDetails.name',
//       'day',
//       'dayFormatted',
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
//       await axiosInstance.patch(`/branch-audits/schedule/${auditId}`, {
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
//         await axiosInstance.delete(`/branch-audits/schedule/${id}`);
        
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
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Filter modal handlers
//   const handleFilterClick = () => {
//     setTempSelectedBranch(selectedBranch);
//     setTempSelectedAuditType(selectedAuditType);
//     setShowFilterModal(true);
//   };

//   const handleApplyFilter = () => {
//     setSelectedBranch(tempSelectedBranch);
//     setSelectedAuditType(tempSelectedAuditType);
//     setShowFilterModal(false);
//   };

//   const handleCancelFilter = () => {
//     setShowFilterModal(false);
//     setTempSelectedBranch(selectedBranch);
//     setTempSelectedAuditType(selectedAuditType);
//   };

//   const clearFilters = () => {
//     setSelectedBranch(null);
//     setSelectedAuditType('all');
//     setIsFiltered(false);
//   };

//   const getBranchNameById = (branchId) => {
//     const branch = branches.find(b => b._id === branchId);
//     return branch ? `${branch.name} - ${branch.city || 'N/A'}` : '';
//   };

//   const getFilterText = () => {
//     let filterText = '';
    
//     if (selectedAuditType !== 'all') {
//       filterText += `(Type: ${selectedAuditType})`;
//     }
    
//     if (selectedBranch) {
//       if (filterText) filterText += ' ';
//       filterText += `(Branch: ${getBranchNameById(selectedBranch)})`;
//     }
    
//     return filterText;
//   };

//   const getAuditTypeBadge = (type) => {
//     const typeColors = {
//       daily: 'primary',
//       weekly: 'info',
//       monthly: 'success',
//       quarterly: 'warning',
//       annual: 'danger'
//     };
    
//     const typeLabels = {
//       daily: 'Daily',
//       weekly: 'Weekly',
//       monthly: 'Monthly',
//       quarterly: 'Quarterly',
//       annual: 'Annual'
//     };
    
//     return (
//       <CBadge color={typeColors[type] || 'secondary'}>
//         {typeLabels[type] || type}
//       </CBadge>
//     );
//   };

//   const getStatusBadge = (audit) => {
//     if (audit?.scheduleAdjustment?.status === 'pending') {
//       return (
//         <CBadge color="warning">
//           Adjustment Pending
//         </CBadge>
//       );
//     }
    
//     if (audit?.auditStatus === 'overdue') {
//       return (
//         <CBadge color="danger">
//           Overdue
//         </CBadge>
//       );
//     }
    
//     return (
//       <CBadge color={audit?.status === 'active' ? 'success' : 'secondary'}>
//         {audit?.status === 'active' ? (
//           <>
//             <CIcon icon={cilCheckCircle} className="me-1" />
//             Active
//           </>
//         ) : (
//           <>
//             <CIcon icon={cilXCircle} className="me-1" />
//             Inactive
//           </>
//         )}
//       </CBadge>
//     );
//   };

//   if (!canViewAuditList) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Branch Audit List.
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
//       <div className='title'>Branch Audit Schedule {getFilterText()}</div>
      
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
//                 Total: {filteredData.length} audit schedule(s)
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
//                 placeholder="Search by branch, day, remarks..."
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
//                   <CTableHeaderCell>Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Schedule</CTableHeaderCell>
//                   <CTableHeaderCell>Next Audit Date</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Created By</CTableHeaderCell>
//                   <CTableHeaderCell>Created Date</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell>Audit Status</CTableHeaderCell>
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
//                         {audit?.branchDetails?.name || 'N/A'}
//                         <div className="text-muted small">
//                           {audit?.branchDetails?.city || ''}, {audit?.branchDetails?.state || ''}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="mb-1">
//                           {audit?.scheduleDescription || 
//                             (audit?.auditType === 'weekly' ? `Weekly on ${audit?.dayFormatted || audit?.day}` :
//                              audit?.auditType === 'monthly' ? `Monthly on day ${audit?.dayOfMonth}` : 'N/A')}
//                         </div>
//                         {audit?.scheduleAdjustment?.status === 'pending' && (
//                           <CBadge color="warning" className="mt-1">
//                             Schedule Adjustment Pending
//                           </CBadge>
//                         )}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex flex-column">
//                           <span>
//                             {audit?.effectiveNextAuditDate ? 
//                               formatDate(audit.effectiveNextAuditDate) : 
//                               audit?.nextAuditDate ? 
//                                 formatDate(audit.nextAuditDate) : 'N/A'
//                             }
//                           </span>
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
//                         {getStatusBadge(audit)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={
//                           audit?.auditStatus === 'upcoming' ? 'info' :
//                           audit?.auditStatus === 'overdue' ? 'danger' :
//                           audit?.auditStatus === 'completed' ? 'success' : 'secondary'
//                         }>
//                           {audit?.auditStatus?.toUpperCase() || 'N/A'}
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
//                             {/* {canUpdateAudit && (
//                               <MenuItem onClick={() => handleToggleStatus(audit?._id, audit?.status)}>
//                                 <CIcon icon={audit?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
//                                 {audit?.status === 'active' ? 'Deactivate' : 'Activate'}
//                               </MenuItem>
//                             )} */}
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
//                     <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
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
//                 value={tempSelectedAuditType || 'all'}
//                 onChange={(e) => setTempSelectedAuditType(e.target.value)}
//                 disabled={!canViewAuditList}
//               >
//                 <option value="all">All Types</option>
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//                 <option value="quarterly">Quarterly</option>
//                 <option value="annual">Annual</option>
//               </CFormSelect>
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Select Branch:</label>
//               {isBranchUser ? (
//                 <div>
//                   <CFormInput
//                     type="text"
//                     value={`${userBranchName || 'Your Branch Account'}`}
//                     readOnly
//                     disabled
//                     className="mb-2"
//                   />
//                   <div className="text-muted small">
//                     Branch users can only view their own audit schedules
//                   </div>
//                 </div>
//               ) : (
//                 <CFormSelect
//                   value={tempSelectedBranch || ''}
//                   onChange={(e) => setTempSelectedBranch(e.target.value || null)}
//                   disabled={!canViewAuditList}
//                 >
//                   <option value="">All Branches</option>
//                   {branches
//                     .filter(branch => branch.is_active !== false)
//                     .map(branch => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name} - {branch.city || 'N/A'}, {branch.state || 'N/A'}
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

//       <AddBranchAuditModal
//         show={showModal}
//         onClose={handleCloseModal}
//         onSaved={handleSaved}
//         editingAudit={editingAudit}
//         branches={branches}
//         isBranchUser={isBranchUser}
//         userBranchId={userBranchId}
//         userBranchName={userBranchName}
//       />
//     </div>
//   );
// };

// export default BranchAuditList;







import '../../../css/table.css';
import '../../../css/form.css';
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
  CCol,
  CPagination,
  CPaginationItem
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
  cilZoomOut,
  cilChevronLeft,
  cilChevronRight
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
import AddBranchAuditModal from './AddBranchAuditModal';
import { useAuth } from '../../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../../utils/modulePermissions';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const BranchAuditList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAudit, setEditingAudit] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [branches, setBranches] = useState([]);
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedAuditType, setSelectedAuditType] = useState('all');
  const [tempSelectedBranch, setTempSelectedBranch] = useState(null);
  const [tempSelectedAuditType, setTempSelectedAuditType] = useState('all');
  const [isFiltered, setIsFiltered] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: '',
    results: 0,
    totalPages: 1,
    total: 0
  });

  // Permissions
  const { permissions, user: authUser } = useAuth();
  
  // Check if user has BRANCH role
  const isBranchUser = authUser?.roles?.some(role => role.name === 'BRANCH');
  
  // Get branch ID from user data if user is a branch user
  const userBranchId = authUser?.branch?._id;
  const userBranchName = authUser?.branch?.name;
  
  // Page-level permission checks for Branch Audit List page
  // You need to define MODULES and PAGES for Branch Audit in your modulePermissions file
  // Temporary fix in BranchAuditList.js:
  const canViewAuditList = canViewPage(permissions, 'MASTERS', 'Branch Audit List');
  const canCreateAudit = canCreateInPage(permissions, 'MASTERS', 'Branch Audit List');
  const canUpdateAudit = canUpdateInPage(permissions, 'MASTERS', 'Branch Audit List');
  const canDeleteAudit = canDeleteInPage(permissions, 'MASTERS', 'Branch Audit List');
  const showActionColumn = canUpdateAudit || canDeleteAudit;

  // Debounce timer for search
  const searchTimer = React.useRef(null);

  useEffect(() => {
    if (!canViewAuditList) {
      showError('You do not have permission to view Branch Audit List');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT);
    fetchBranches();
  }, [canViewAuditList]);

  useEffect(() => {
    filterData();
  }, [selectedBranch, selectedAuditType, data]);

  const fetchBranches = async () => {
    try {
      // Assuming you have an API endpoint to fetch branches
      // Replace with your actual API endpoint
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data?.branches || response.data?.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  // Fetch data with pagination
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit) => {
    if (!canViewAuditList) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await axiosInstance.get(`/branch-audits/schedule?${params.toString()}`);

      let audits = response.data.data?.branchAudits || response.data?.data || [];
      
      // Filter by branch ID if user is a branch user (client-side filtering since API doesn't support branch filter)
      if (isBranchUser && userBranchId) {
        audits = audits.filter(audit => 
          audit.branch === userBranchId || 
          audit.branchDetails?._id === userBranchId
        );
      }

      setPagination({
        docs: audits,
        total: response.data.total || audits.length,
        pages: response.data.totalPages || Math.ceil((response.data.total || audits.length) / limit),
        currentPage: response.data.currentPage || page,
        limit: limit,
        loading: false,
        search: pagination.search,
        results: response.data.results || audits.length,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || audits.length
      });
      
      setData(audits);
      setFilteredData(audits);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPagination(prev => ({ ...prev, loading: false, docs: [] }));
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchData(newPage, pagination.limit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchData(1, limit);
  };

  // Render pagination component
  const renderPagination = () => {
    const { currentPage, pages, total, limit, loading } = pagination;
    if (!total || pages <= 1) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(5, pages);
    if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

    const pageNums = [];
    for (let i = startPage; i <= endPage; i++) pageNums.push(i);

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={limit}
              onChange={e => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1 || loading}
            >
              «
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem 
                  onClick={() => handlePageChange(1)} 
                  disabled={loading}
                >
                  1
                </CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {pageNums.map(p => (
              <CPaginationItem 
                key={p} 
                active={p === currentPage} 
                onClick={() => handlePageChange(p)} 
                disabled={loading}
              >
                {p}
              </CPaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem 
                  onClick={() => handlePageChange(pages)} 
                  disabled={loading}
                >
                  {pages}
                </CPaginationItem>
              </>
            )}

            <CPaginationItem 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === pages || loading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handlePageChange(pages)} 
              disabled={currentPage === pages || loading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const filterData = () => {
    let filtered = pagination.docs; // Use pagination.docs instead of data

    // Filter by audit type
    if (selectedAuditType !== 'all') {
      filtered = filtered.filter(audit => audit.auditType === selectedAuditType);
    }

    // Filter by branch
    if (selectedBranch) {
      filtered = filtered.filter(audit => 
        audit.branch === selectedBranch || 
        audit.branchDetails?._id === selectedBranch
      );
    }

    setFilteredData(filtered);
    
    // Check if any filter is active
    const hasActiveFilter = selectedAuditType !== 'all' || selectedBranch !== null;
    setIsFiltered(hasActiveFilter);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    let dataToFilter = pagination.docs; // Use pagination.docs instead of data
    
    // Apply current filters first
    if (selectedAuditType !== 'all') {
      dataToFilter = dataToFilter.filter(audit => audit.auditType === selectedAuditType);
    }
    
    if (selectedBranch) {
      dataToFilter = dataToFilter.filter(audit => 
        audit.branch === selectedBranch || 
        audit.branchDetails?._id === selectedBranch
      );
    }
    
    handleFilter(searchValue, [
      'branchDetails.name',
      'day',
      'dayFormatted',
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
    if (!canUpdateAudit) {
      showError('You do not have permission to update audit status');
      return;
    }
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.patch(`/branch-audits/schedule/${auditId}`, {
        status: newStatus
      });
      
      // Refresh current page after update
      fetchData(pagination.currentPage, pagination.limit);
      
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
        await axiosInstance.delete(`/branch-audits/schedule/${id}`);
        
        // Refresh current page after delete
        fetchData(pagination.currentPage, pagination.limit);
        
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
    fetchData(pagination.currentPage, pagination.limit);
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter modal handlers
  const handleFilterClick = () => {
    setTempSelectedBranch(selectedBranch);
    setTempSelectedAuditType(selectedAuditType);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setSelectedBranch(tempSelectedBranch);
    setSelectedAuditType(tempSelectedAuditType);
    setShowFilterModal(false);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setTempSelectedBranch(selectedBranch);
    setTempSelectedAuditType(selectedAuditType);
  };

  const clearFilters = () => {
    setSelectedBranch(null);
    setSelectedAuditType('all');
    setIsFiltered(false);
  };

  const getBranchNameById = (branchId) => {
    const branch = branches.find(b => b._id === branchId);
    return branch ? `${branch.name} - ${branch.city || 'N/A'}` : '';
  };

  const getFilterText = () => {
    let filterText = '';
    
    if (selectedAuditType !== 'all') {
      filterText += `(Type: ${selectedAuditType})`;
    }
    
    if (selectedBranch) {
      if (filterText) filterText += ' ';
      filterText += `(Branch: ${getBranchNameById(selectedBranch)})`;
    }
    
    return filterText;
  };

  const getAuditTypeBadge = (type) => {
    const typeColors = {
      daily: 'primary',
      weekly: 'info',
      monthly: 'success',
      quarterly: 'warning',
      annual: 'danger'
    };
    
    const typeLabels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      annual: 'Annual'
    };
    
    return (
      <CBadge color={typeColors[type] || 'secondary'}>
        {typeLabels[type] || type}
      </CBadge>
    );
  };

  const getStatusBadge = (audit) => {
    if (audit?.scheduleAdjustment?.status === 'pending') {
      return (
        <CBadge color="warning">
          Adjustment Pending
        </CBadge>
      );
    }
    
    if (audit?.auditStatus === 'overdue') {
      return (
        <CBadge color="danger">
          Overdue
        </CBadge>
      );
    }
    
    return (
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
    );
  };

  if (!canViewAuditList) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Branch Audit List.
      </div>
    );
  }

  if (loading && pagination.docs.length === 0) {
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
      <div className='title'>Branch Audit Schedule {getFilterText()}</div>
      
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
          <div className="text-muted">
            Total Records: {pagination.total || 0}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <span className="text-muted">
                Showing: {filteredData.length} of {pagination.total} audit schedule(s)
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
                placeholder="Search by branch, day, remarks..."
                disabled={!canViewAuditList}
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
              />
            </div>
          </div>
          
          {pagination.loading && pagination.docs.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Audit Type</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Schedule</CTableHeaderCell>
                  <CTableHeaderCell>Next Audit Date</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Audit Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((audit, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={audit?._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          {getAuditTypeBadge(audit?.auditType)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {audit?.branchDetails?.name || 'N/A'}
                          <div className="text-muted small">
                            {audit?.branchDetails?.city || ''}, {audit?.branchDetails?.state || ''}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="mb-1">
                            {audit?.scheduleDescription || 
                              (audit?.auditType === 'weekly' ? `Weekly on ${audit?.dayFormatted || audit?.day}` :
                               audit?.auditType === 'monthly' ? `Monthly on day ${audit?.dayOfMonth}` : 'N/A')}
                          </div>
                          {audit?.scheduleAdjustment?.status === 'pending' && (
                            <CBadge color="warning" className="mt-1">
                              Schedule Adjustment Pending
                            </CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-column">
                            <span>
                              {audit?.effectiveNextAuditDate ? 
                                formatDate(audit.effectiveNextAuditDate) : 
                                audit?.nextAuditDate ? 
                                  formatDate(audit.nextAuditDate) : 'N/A'
                              }
                            </span>
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
                          {getStatusBadge(audit)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={
                            audit?.auditStatus === 'upcoming' ? 'info' :
                            audit?.auditStatus === 'overdue' ? 'danger' :
                            audit?.auditStatus === 'completed' ? 'success' : 'secondary'
                          }>
                            {audit?.auditStatus?.toUpperCase() || 'N/A'}
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
                              {/* {canUpdateAudit && (
                                <MenuItem onClick={() => handleToggleStatus(audit?._id, audit?.status)}>
                                  <CIcon icon={audit?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
                                  {audit?.status === 'active' ? 'Deactivate' : 'Activate'}
                                </MenuItem>
                              )} */}
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
                    );
                  })
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
                      {pagination.total === 0 
                        ? 'No audit schedules available. Click "New Audit Schedule" to create one.'
                        : `No audit schedules found for the selected filters. Try changing the filter or search term.`
                      }
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component */}
          {renderPagination()}
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
                value={tempSelectedAuditType || 'all'}
                onChange={(e) => setTempSelectedAuditType(e.target.value)}
                disabled={!canViewAuditList}
              >
                <option value="all">All Types</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Select Branch:</label>
              {isBranchUser ? (
                <div>
                  <CFormInput
                    type="text"
                    value={`${userBranchName || 'Your Branch Account'}`}
                    readOnly
                    disabled
                    className="mb-2"
                  />
                  <div className="text-muted small">
                    Branch users can only view their own audit schedules
                  </div>
                </div>
              ) : (
                <CFormSelect
                  value={tempSelectedBranch || ''}
                  onChange={(e) => setTempSelectedBranch(e.target.value || null)}
                  disabled={!canViewAuditList}
                >
                  <option value="">All Branches</option>
                  {branches
                    .filter(branch => branch.is_active !== false)
                    .map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name} - {branch.city || 'N/A'}, {branch.state || 'N/A'}
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

      <AddBranchAuditModal
        show={showModal}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        editingAudit={editingAudit}
        branches={branches}
        isBranchUser={isBranchUser}
        userBranchId={userBranchId}
        userBranchName={userBranchName}
      />
    </div>
  );
};

export default BranchAuditList;