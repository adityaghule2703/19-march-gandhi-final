// import { CFormSwitch } from '@coreui/react';
// import '../../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   axiosInstance
// } from '../../../utils/tableImports';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../../utils/modulePermissions';
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
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash} from '@coreui/icons';
// import AddRto from './AddRto';
// import { useAuth } from '../../../context/AuthContext';


// const RtoList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingRto, setEditingRto] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for RTO page under Masters module
//   const hasRTOView = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.RTO_MASTER, 
//     ACTIONS.VIEW
//   );
  
//   const hasRTOCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.RTO_MASTER, 
//     ACTIONS.CREATE
//   );
  
//   const hasRTOUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.RTO_MASTER, 
//     ACTIONS.UPDATE
//   );
  
//   const hasRTODelete = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.RTO_MASTER, 
//     ACTIONS.DELETE
//   );

//   // Using convenience functions for cleaner code
//   const canViewRTO = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
//   const canCreateRTO = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
//   const canUpdateRTO = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
//   const canDeleteRTO = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
  
//   const showActionColumn = canUpdateRTO || canDeleteRTO;

//   useEffect(() => {
//     if (!canViewRTO) {
//       showError('You do not have permission to view RTO');
//       return;
//     }
    
//     fetchData();
//   }, [canViewRTO]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/rtos`);
//       setData(response.data?.data || []);
//       setFilteredData(response.data?.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setData([]);
//       setFilteredData([]);
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

//   const handleToggleRtoStatus = async (id, currentStatus) => {
//     if (!canUpdateRTO) {
//       showError('You do not have permission to update RTO status');
//       return;
//     }
    
//     const newStatus = !currentStatus;

//     try {
//       await axiosInstance.patch(`/rtos/${id}/status`, {
//         is_active: newStatus
//       });
//       fetchData();
//       setSuccessMessage(`RTO ${newStatus ? 'activated' : 'deactivated'} successfully`);
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteRTO) {
//       showError('You do not have permission to delete RTO');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/rtos/${id}`);
//         setData(data.filter((rto) => rto?.id !== id));
//         fetchData();
//         setSuccessMessage('RTO deleted successfully');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('rto'));
//   };

//   const handleShowAddModal = () => {
//     if (!canCreateRTO) {
//       showError('You do not have permission to add RTO');
//       return;
//     }
    
//     setEditingRto(null);
//     setShowModal(true);
//   };

//   const handleShowEditModal = (rto) => {
//     if (!canUpdateRTO) {
//       showError('You do not have permission to edit RTO');
//       return;
//     }
    
//     setEditingRto(rto);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingRto(null);
//   };

//   const handleRtoSaved = (message) => {
//     fetchData();
//     handleCloseModal();
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   if (!canViewRTO) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO.
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
//    {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>RTO</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateRTO && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleShowAddModal}
//               >
//                 <CIcon icon={cilPlus} className='icon'/> New RTO
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
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>RTO Code</CTableHeaderCell>
//                   <CTableHeaderCell>RTO Name</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {!currentRecords?.length ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "5" : "4"} className="text-center">
//                       No RTO details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((rto, index) => (
//                     <CTableRow key={rto?.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{rto?.rto_code || ''}</CTableDataCell>
//                       <CTableDataCell>{rto?.rto_name || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <CFormSwitch 
//                             checked={rto.is_active} 
//                             onChange={() => handleToggleRtoStatus(rto.id, rto.is_active)}
//                             className="ms-2"
//                             disabled={!canUpdateRTO}
//                           />
//                         </div>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, rto?.id)}
//                             disabled={!canUpdateRTO && !canDeleteRTO}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${rto?.id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === rto?.id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateRTO && (
//                               <MenuItem 
//                                 onClick={() => handleShowEditModal(rto)}
//                                 style={{ color: 'black' }}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" />
//                                 Edit
//                               </MenuItem>
//                             )}
//                             {canDeleteRTO && (
//                               <MenuItem onClick={() => handleDelete(rto?.id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />
//                                 Delete
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

//       <AddRto
//         show={showModal}
//         onClose={handleCloseModal}
//         onRtoSaved={handleRtoSaved}
//         editingRto={editingRto}
//       />
//     </div>
//   );
// };

// export default RtoList;



import { CFormSwitch } from '@coreui/react';
import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  axiosInstance
} from '../../../utils/tableImports';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../../utils/modulePermissions';
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
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import AddRto from './AddRto';
import { useAuth } from '../../../context/AuthContext';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const RtoList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRto, setEditingRto] = useState(null);
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
  
  // Page-level permission checks for RTO page under Masters module
  const hasRTOView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.RTO_MASTER, 
    ACTIONS.VIEW
  );
  
  const hasRTOCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.RTO_MASTER, 
    ACTIONS.CREATE
  );
  
  const hasRTOUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.RTO_MASTER, 
    ACTIONS.UPDATE
  );
  
  const hasRTODelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.RTO_MASTER, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewRTO = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
  const canCreateRTO = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
  const canUpdateRTO = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
  const canDeleteRTO = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.RTO_MASTER);
  
  const showActionColumn = canUpdateRTO || canDeleteRTO;

  useEffect(() => {
    if (!canViewRTO) {
      showError('You do not have permission to view RTO');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewRTO]);

  // Fetch data with pagination and search
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    if (!canViewRTO) return;
    
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
      
      const response = await axiosInstance.get(`/rtos?${params.toString()}`);

      if (response.data.success) {
        const items = response.data.data || [];
        const total = response.data.total || items.length;
        const pages = response.data.pages || Math.ceil(total / limit);
        const count = response.data.count || items.length;

        setPagination({
          docs: items,
          total: total,
          pages: pages,
          currentPage: response.data.page || page,
          limit: limit,
          loading: false,
          search: search,
          count: count
        });
        
        setData(items);
        setFilteredData(items);
      } else {
        throw new Error('Failed to fetch RTOs');
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

  const handleToggleRtoStatus = async (id, currentStatus) => {
    if (!canUpdateRTO) {
      showError('You do not have permission to update RTO status');
      return;
    }
    
    const newStatus = !currentStatus;

    try {
      await axiosInstance.patch(`/rtos/${id}/status`, {
        is_active: newStatus
      });
      // Refresh current page after status update
      fetchData(pagination.currentPage, pagination.limit, pagination.search);
      setSuccessMessage(`RTO ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteRTO) {
      showError('You do not have permission to delete RTO');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/rtos/${id}`);
        // Refresh current page after delete
        fetchData(pagination.currentPage, pagination.limit, pagination.search);
        setSuccessMessage('RTO deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleShowAddModal = () => {
    if (!canCreateRTO) {
      showError('You do not have permission to add RTO');
      return;
    }
    
    setEditingRto(null);
    setShowModal(true);
  };

  const handleShowEditModal = (rto) => {
    if (!canUpdateRTO) {
      showError('You do not have permission to edit RTO');
      return;
    }
    
    setEditingRto(rto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRto(null);
  };

  const handleRtoSaved = (message) => {
    // Refresh current page after save
    fetchData(pagination.currentPage, pagination.limit, pagination.search);
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!canViewRTO) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view RTO.
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
      <div className='title'>RTO</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateRTO && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
              >
                <CIcon icon={cilPlus} className='icon'/> New RTO
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
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search by RTO code or name..."
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
                  <CTableHeaderCell>RTO Code</CTableHeaderCell>
                  <CTableHeaderCell>RTO Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!pagination.docs?.length ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "5" : "4"} className="text-center">
                      {pagination.search ? 'No matching RTOs found' : 'No RTO details available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((rto, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={rto?.id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{rto?.rto_code || ''}</CTableDataCell>
                        <CTableDataCell>{rto?.rto_name || ''}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CFormSwitch 
                              checked={rto.is_active} 
                              onChange={() => handleToggleRtoStatus(rto.id, rto.is_active)}
                              className="ms-2"
                              disabled={!canUpdateRTO}
                            />
                          </div>
                        </CTableDataCell>
                        {showActionColumn && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className='option-button btn-sm'
                              onClick={(event) => handleClick(event, rto?.id)}
                              disabled={!canUpdateRTO && !canDeleteRTO}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${rto?.id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === rto?.id} 
                              onClose={handleClose}
                            >
                              {canUpdateRTO && (
                                <MenuItem 
                                  onClick={() => handleShowEditModal(rto)}
                                  style={{ color: 'black' }}
                                >
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              )}
                              {canDeleteRTO && (
                                <MenuItem onClick={() => handleDelete(rto?.id)}>
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
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component */}
          {renderPagination()}
        </CCardBody>
      </CCard>

      <AddRto
        show={showModal}
        onClose={handleCloseModal}
        onRtoSaved={handleRtoSaved}
        editingRto={editingRto}
      />
    </div>
  );
};

export default RtoList;