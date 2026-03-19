// import '../../css/table.css'
// import {
//   React,
//   useState,
//   useEffect,
//   Menu,
//   MenuItem,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   axiosInstance,
//   getDefaultSearchFields
// } from '../../utils/tableImports';
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
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash, cilInfo } from '@coreui/icons';
// import AddOpeningBalance from './AddOpeningBalance';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const OpeningBalanceList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [historyModalOpen, setHistoryModalOpen] = useState(false);
//   const [editingBranch, setEditingBranch] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Add Opening Balance page under Fund Master module
//   const canViewOpeningBalance = canViewPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
//   const canCreateOpeningBalance = canCreateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
//   const canUpdateOpeningBalance = canUpdateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
//   const canDeleteOpeningBalance = canDeleteInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
  
//   const showActionColumn = canUpdateOpeningBalance || canDeleteOpeningBalance;

//   useEffect(() => {
//     if (!canViewOpeningBalance) {
//       showError('You do not have permission to view Opening Balance');
//       return;
//     }
    
//     fetchData();
//   }, [canViewOpeningBalance]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get('/branches');
//       const branches = response.data.data.map((b) => ({
//         ...b,
//         id: b.id || b._id
//       }));
//       setData(branches);
//       setFilteredData(branches);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewHistory = (branchId) => {
//     const branch = data.find((b) => b.id === branchId);
//     setSelectedBranch(branch);
//     setHistoryModalOpen(true);
//     handleClose();
//   };

//   const closeHistoryModal = () => {
//     setHistoryModalOpen(false);
//     setSelectedBranch(null);
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteOpeningBalance) {
//       showError('You do not have permission to reset opening balance');
//       return;
//     }
    
//     const branch = data.find((b) => b.id === id);
//     const result = await confirmDelete(`Are you sure you want to reset the opening balance for ${branch.name}?`);

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/branches/${id}/opening-balance`);
//         fetchData();
//         setSuccessMessage(`Opening balance for ${branch.name} has been reset`);
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } catch (error) {
//         showError(error.response?.data?.message || 'Failed to reset balance');
//       }
//     }
//   };

//   const handleShowAddModal = () => {
//     if (!canCreateOpeningBalance) {
//       showError('You do not have permission to add opening balance');
//       return;
//     }
    
//     setEditingBranch(null);
//     setShowModal(true);
//   };

//   const handleShowEditModal = (branch) => {
//     if (!canUpdateOpeningBalance) {
//       showError('You do not have permission to edit opening balance');
//       return;
//     }
    
//     setEditingBranch(branch);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingBranch(null);
//   };

//   const handleBalanceSaved = (message) => {
//     fetchData();
//     handleCloseModal();
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('branch'));
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   if (!canViewOpeningBalance) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Opening Balance.
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
//       {error}
//       </div>
//     );
//   }
  
//   return (
//     <div>
//       <div className='title'>Opening Balance</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateOpeningBalance && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleShowAddModal}
//                 disabled={!canCreateOpeningBalance}
//               >
//                 <CIcon icon={cilPlus} className='icon' /> New
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 disabled={!canViewOpeningBalance}
//               />
//             </div>
//           </div>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Location</CTableHeaderCell>
//                   <CTableHeaderCell>Opening Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {!currentRecords?.length ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
//                       <CBadge color="secondary">No branches available</CBadge>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((branch, index) => (
//                     <CTableRow key={branch.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{branch.name}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <span>₹{branch.opening_balance || 0}</span>
//                           {branch.opening_balance_history?.length > 0 && (
//                             <CButton
//                               size="sm"
//                               color="link"
//                               className="ms-2 p-0"
//                               onClick={() => handleViewHistory(branch.id)}
//                               title={`View history (last updated: ${formatDate(branch.opening_balance_history[0].date)})`}
//                             >
//                               <CIcon icon={cilInfo} className="text-info" />
//                             </CButton>
//                           )}
//                         </div>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, branch.id)}
//                             disabled={!canUpdateOpeningBalance && !canDeleteOpeningBalance}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${branch.id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === branch.id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateOpeningBalance && (
//                               <MenuItem 
//                                 onClick={() => handleShowEditModal(branch)}
//                                 style={{ color: 'black' }}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" />Edit
//                               </MenuItem>
//                             )}
//                             <MenuItem onClick={() => handleViewHistory(branch.id)}>
//                               <CIcon icon={cilInfo} className="me-2" />View History
//                             </MenuItem>
//                             {canDeleteOpeningBalance && (
//                               <MenuItem onClick={() => handleDelete(branch.id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />Reset Balance
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       <AddOpeningBalance
//         show={showModal}
//         onClose={handleCloseModal}
//         onBalanceSaved={handleBalanceSaved}
//         editingBranch={editingBranch}
//       />
//       <CModal alignment="center" visible={historyModalOpen} onClose={closeHistoryModal}>
//         <CModalHeader>
//           <CModalTitle>
//             Opening Balance History for {selectedBranch?.name}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedBranch?.opening_balance_history?.length > 0 ? (
//             <div className="list-group">
//               {selectedBranch.opening_balance_history.map((entry, index) => (
//                 <div key={index} className="list-group-item">
//                   <div className="d-flex w-100 justify-content-between">
//                     <h6 className="mb-1">₹{entry.amount}</h6>
//                     <small>{formatDate(entry.date)}</small>
//                   </div>
//                   {entry.note && (
//                     <p className="mb-1 text-muted">{entry.note}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-muted p-3">
//               No history available for this branch
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={closeHistoryModal}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default OpeningBalanceList;





// import '../../css/table.css'
// import {
//   React,
//   useState,
//   useEffect,
//   Menu,
//   MenuItem,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   axiosInstance,
//   getDefaultSearchFields
// } from '../../utils/tableImports';
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
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash, cilInfo } from '@coreui/icons';
// import AddOpeningBalance from './AddOpeningBalance';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const OpeningBalanceList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [historyModalOpen, setHistoryModalOpen] = useState(false);
//   const [editingBranch, setEditingBranch] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Add Opening Balance page under Fund Master module
//   const canViewOpeningBalance = canViewPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
//   const canCreateOpeningBalance = canCreateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
//   const canUpdateOpeningBalance = canUpdateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
//   const canDeleteOpeningBalance = canDeleteInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
  
//   const showActionColumn = canUpdateOpeningBalance || canDeleteOpeningBalance || canCreateOpeningBalance;

//   useEffect(() => {
//     if (!canViewOpeningBalance) {
//       showError('You do not have permission to view Opening Balance');
//       return;
//     }
    
//     fetchData();
//   }, [canViewOpeningBalance]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get('/branches');
//       const branches = response.data.data.map((b) => ({
//         ...b,
//         id: b.id || b._id
//       }));
//       setData(branches);
//       setFilteredData(branches);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewHistory = (branchId) => {
//     const branch = data.find((b) => b.id === branchId);
//     setSelectedBranch(branch);
//     setHistoryModalOpen(true);
//     handleClose();
//   };

//   const closeHistoryModal = () => {
//     setHistoryModalOpen(false);
//     setSelectedBranch(null);
//   };

//   const handleDelete = async (id) => {
//     if (!canCreateOpeningBalance) {
//       showError('You do not have permission to reset opening balance');
//       return;
//     }
    
//     const branch = data.find((b) => b.id === id);
//     const result = await confirmDelete(`Are you sure you want to reset the opening balance for ${branch.name}?`);

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/branches/${id}/opening-balance`);
//         fetchData();
//         setSuccessMessage(`Opening balance for ${branch.name} has been reset`);
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } catch (error) {
//         showError(error.response?.data?.message || 'Failed to reset balance');
//       }
//     }
//   };

//   const handleShowAddModal = () => {
//     if (!canCreateOpeningBalance) {
//       showError('You do not have permission to add opening balance');
//       return;
//     }
    
//     setEditingBranch(null);
//     setShowModal(true);
//   };

//   const handleShowEditModal = (branch) => {
//     if (!canUpdateOpeningBalance) {
//       showError('You do not have permission to edit opening balance');
//       return;
//     }
    
//     setEditingBranch(branch);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingBranch(null);
//   };

//   const handleBalanceSaved = (message) => {
//     fetchData();
//     handleCloseModal();
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('branch'));
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   if (!canViewOpeningBalance) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Opening Balance.
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
//       {error}
//       </div>
//     );
//   }
  
//   return (
//     <div>
//       <div className='title'>Opening Balance</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateOpeningBalance && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleShowAddModal}
//                 disabled={!canCreateOpeningBalance}
//               >
//                 <CIcon icon={cilPlus} className='icon' /> New
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 disabled={!canViewOpeningBalance}
//               />
//             </div>
//           </div>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Location</CTableHeaderCell>
//                   <CTableHeaderCell>Opening Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {!currentRecords?.length ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
//                       <CBadge color="secondary">No branches available</CBadge>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((branch, index) => (
//                     <CTableRow key={branch.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{branch.name}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <span>₹{branch.opening_balance || 0}</span>
//                           {branch.opening_balance_history?.length > 0 && (
//                             <CButton
//                               size="sm"
//                               color="link"
//                               className="ms-2 p-0"
//                               onClick={() => handleViewHistory(branch.id)}
//                               title={`View history (last updated: ${formatDate(branch.opening_balance_history[0].date)})`}
//                             >
//                               <CIcon icon={cilInfo} className="text-info" />
//                             </CButton>
//                           )}
//                         </div>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, branch.id)}
//                             disabled={!canUpdateOpeningBalance && !canDeleteOpeningBalance && !canCreateOpeningBalance}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${branch.id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === branch.id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateOpeningBalance && (
//                               <MenuItem 
//                                 onClick={() => handleShowEditModal(branch)}
//                                 style={{ color: 'black' }}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" />Edit
//                               </MenuItem>
//                             )}
//                             <MenuItem onClick={() => handleViewHistory(branch.id)}>
//                               <CIcon icon={cilInfo} className="me-2" />View History
//                             </MenuItem>
//                             {canCreateOpeningBalance && (
//                               <MenuItem onClick={() => handleDelete(branch.id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />Reset Balance
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       <AddOpeningBalance
//         show={showModal}
//         onClose={handleCloseModal}
//         onBalanceSaved={handleBalanceSaved}
//         editingBranch={editingBranch}
//       />
//       <CModal alignment="center" visible={historyModalOpen} onClose={closeHistoryModal}>
//         <CModalHeader>
//           <CModalTitle>
//             Opening Balance History for {selectedBranch?.name}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedBranch?.opening_balance_history?.length > 0 ? (
//             <div className="list-group">
//               {selectedBranch.opening_balance_history.map((entry, index) => (
//                 <div key={index} className="list-group-item">
//                   <div className="d-flex w-100 justify-content-between">
//                     <h6 className="mb-1">₹{entry.amount}</h6>
//                     <small>{formatDate(entry.date)}</small>
//                   </div>
//                   {entry.note && (
//                     <p className="mb-1 text-muted">{entry.note}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-muted p-3">
//               No history available for this branch
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={closeHistoryModal}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default OpeningBalanceList;






import '../../css/table.css'
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  axiosInstance,
  getDefaultSearchFields
} from '../../utils/tableImports';
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
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilInfo, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import AddOpeningBalance from './AddOpeningBalance';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const OpeningBalanceList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { permissions } = useAuth();

  // Pagination states
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: '',
    count: 0
  });

  // Debounce timer for search
  const searchTimer = React.useRef(null);
  
  // Page-level permission checks for Add Opening Balance page under Fund Master module
  const canViewOpeningBalance = canViewPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
  const canCreateOpeningBalance = canCreateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
  const canUpdateOpeningBalance = canUpdateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
  const canDeleteOpeningBalance = canDeleteInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.ADD_OPENING_BALANCE);
  
  const showActionColumn = canUpdateOpeningBalance || canDeleteOpeningBalance || canCreateOpeningBalance;

  useEffect(() => {
    if (!canViewOpeningBalance) {
      showError('You do not have permission to view Opening Balance');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewOpeningBalance]);

  // Fetch data with pagination and search
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    if (!canViewOpeningBalance) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Add search parameter if provided (if API supports it)
      if (search) {
        params.append('search', search);
      }
      
      const response = await axiosInstance.get(`/branches?${params.toString()}`);

      if (response.data.success) {
        const items = response.data.data || [];
        // Process items to ensure they have id field
        const processedItems = items.map(b => ({
          ...b,
          id: b.id || b._id
        }));
        
        const total = response.data.total || processedItems.length;
        const pages = response.data.pages || Math.ceil(total / limit);
        const count = response.data.count || processedItems.length;

        setPagination({
          docs: processedItems,
          total: total,
          pages: pages,
          currentPage: response.data.page || page,
          limit: limit,
          loading: false,
          search: search,
          count: count
        });
        
        setData(processedItems);
        setFilteredData(processedItems);
      } else {
        throw new Error('Failed to fetch branches');
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchData(newPage, pagination.limit, pagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchData(1, limit, pagination.search);
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, search: value }));
    
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchData(1, pagination.limit, value);
    }, 400);
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

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleViewHistory = (branchId) => {
    const branch = pagination.docs.find((b) => b.id === branchId);
    setSelectedBranch(branch);
    setHistoryModalOpen(true);
    handleClose();
  };

  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedBranch(null);
  };

  const handleDelete = async (id) => {
    if (!canCreateOpeningBalance) {
      showError('You do not have permission to reset opening balance');
      return;
    }
    
    const branch = pagination.docs.find((b) => b.id === id);
    const result = await confirmDelete(`Are you sure you want to reset the opening balance for ${branch.name}?`);

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/branches/${id}/opening-balance`);
        // Refresh current page after delete
        fetchData(pagination.currentPage, pagination.limit, pagination.search);
        setSuccessMessage(`Opening balance for ${branch.name} has been reset`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        showError(error.response?.data?.message || 'Failed to reset balance');
      }
    }
  };

  const handleShowAddModal = () => {
    if (!canCreateOpeningBalance) {
      showError('You do not have permission to add opening balance');
      return;
    }
    
    setEditingBranch(null);
    setShowModal(true);
  };

  const handleShowEditModal = (branch) => {
    if (!canUpdateOpeningBalance) {
      showError('You do not have permission to edit opening balance');
      return;
    }
    
    setEditingBranch(branch);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
  };

  const handleBalanceSaved = (message) => {
    // Refresh current page after save
    fetchData(pagination.currentPage, pagination.limit, pagination.search);
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  if (!canViewOpeningBalance) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Opening Balance.
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
      <div className='title'>Opening Balance</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateOpeningBalance && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
                disabled={!canCreateOpeningBalance}
              >
                <CIcon icon={cilPlus} className='icon' /> New
              </CButton>
            )}
          </div>
          <div className="text-muted">
            Total Records: {pagination.total || 0}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={!canViewOpeningBalance}
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search by branch name..."
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
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Opening Balance</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!pagination.docs?.length ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
                      <CBadge color="secondary">
                        {pagination.search ? 'No matching branches found' : 'No branches available'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((branch, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={branch.id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{branch.name}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <span>₹{branch.opening_balance || 0}</span>
                            {branch.opening_balance_history?.length > 0 && (
                              <CButton
                                size="sm"
                                color="link"
                                className="ms-2 p-0"
                                onClick={() => handleViewHistory(branch.id)}
                                title={`View history (last updated: ${formatDate(branch.opening_balance_history[0].date)})`}
                              >
                                <CIcon icon={cilInfo} className="text-info" />
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                        {showActionColumn && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className='option-button btn-sm'
                              onClick={(event) => handleClick(event, branch.id)}
                              disabled={!canUpdateOpeningBalance && !canDeleteOpeningBalance && !canCreateOpeningBalance}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${branch.id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === branch.id} 
                              onClose={handleClose}
                            >
                              {canUpdateOpeningBalance && (
                                <MenuItem 
                                  onClick={() => handleShowEditModal(branch)}
                                  style={{ color: 'black' }}
                                >
                                  <CIcon icon={cilPencil} className="me-2" />Edit
                                </MenuItem>
                              )}
                              <MenuItem onClick={() => handleViewHistory(branch.id)}>
                                <CIcon icon={cilInfo} className="me-2" />View History
                              </MenuItem>
                              {canCreateOpeningBalance && (
                                <MenuItem onClick={() => handleDelete(branch.id)}>
                                  <CIcon icon={cilTrash} className="me-2" />Reset Balance
                                </MenuItem>
                              )}
                            </Menu>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component */}
          {renderPagination()}
        </CCardBody>
      </CCard>

      <AddOpeningBalance
        show={showModal}
        onClose={handleCloseModal}
        onBalanceSaved={handleBalanceSaved}
        editingBranch={editingBranch}
      />
      <CModal alignment="center" visible={historyModalOpen} onClose={closeHistoryModal}>
        <CModalHeader>
          <CModalTitle>
            Opening Balance History for {selectedBranch?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBranch?.opening_balance_history?.length > 0 ? (
            <div className="list-group">
              {selectedBranch.opening_balance_history.map((entry, index) => (
                <div key={index} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">₹{entry.amount}</h6>
                    <small>{formatDate(entry.date)}</small>
                  </div>
                  {entry.note && (
                    <p className="mb-1 text-muted">{entry.note}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted p-3">
              No history available for this branch
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeHistoryModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default OpeningBalanceList;