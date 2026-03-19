// import { CFormSwitch } from '@coreui/react';
// import '../../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
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
//   CBadge,
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
// import AddProvider from './AddProvider';
// import { useAuth } from '../../../context/AuthContext';

// const ProviderList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingProvider, setEditingProvider] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Insurance Providers page under Masters module
//   const hasInsuranceProvidersView = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PROVIDERS, 
//     ACTIONS.VIEW
//   );
  
//   const hasInsuranceProvidersCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PROVIDERS, 
//     ACTIONS.CREATE
//   );
  
//   const hasInsuranceProvidersUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PROVIDERS, 
//     ACTIONS.UPDATE
//   );
  
//   const hasInsuranceProvidersDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PROVIDERS, 
//     ACTIONS.DELETE
//   );

//   // Using convenience functions for cleaner code
//   const canViewInsuranceProviders = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
//   const canCreateInsuranceProviders = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
//   const canUpdateInsuranceProviders = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
//   const canDeleteInsuranceProviders = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
  
//   const showActionColumn = canUpdateInsuranceProviders || canDeleteInsuranceProviders;

//   useEffect(() => {
//     if (!canViewInsuranceProviders) {
//       showError('You do not have permission to view Insurance Providers');
//       return;
//     }
    
//     fetchData();
//   }, [canViewInsuranceProviders]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/insurance-providers`);
//       setData(response.data.data);
//       setFilteredData(response.data.data);
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

//   const handleToggleActive = async (providerId, currentStatus) => {
//     if (!canUpdateInsuranceProviders) {
//       showError('You do not have permission to update insurance provider status');
//       return;
//     }
    
//     const newStatus = !currentStatus;

//     try {
//       await axiosInstance.patch(`/insurance-providers/${providerId}/status`, {
//         is_active: newStatus
//       });

//       setData((prevData) => prevData.map((provider) => (provider.id === providerId ? { ...provider, is_active: newStatus } : provider)));

//       setFilteredData((prevData) =>
//         prevData.map((provider) => (provider.id === providerId ? { ...provider, is_active: newStatus } : provider))
//       );
      
//       setSuccessMessage(`Insurance provider ${newStatus ? 'activated' : 'deactivated'} successfully`);
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Error toggling provider status:', error);
//       showError('Failed to update provider status');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteInsuranceProviders) {
//       showError('You do not have permission to delete insurance providers');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/insurance-providers/${id}`);
//         setData(data.filter((branch) => branch.id !== id));
//         fetchData();
//         setSuccessMessage('Insurance provider deleted successfully');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('insurance_provider'));
//   };

//   const handleShowAddModal = () => {
//     if (!canCreateInsuranceProviders) {
//       showError('You do not have permission to add insurance providers');
//       return;
//     }
    
//     setEditingProvider(null);
//     setShowModal(true);
//   };

//   const handleShowEditModal = (provider) => {
//     if (!canUpdateInsuranceProviders) {
//       showError('You do not have permission to edit insurance providers');
//       return;
//     }
    
//     setEditingProvider(provider);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingProvider(null);
//   };

//   const handleProviderSaved = (message) => {
//     fetchData();
//     handleCloseModal();
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   if (!canViewInsuranceProviders) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Insurance Providers.
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
//       <div className='title'>Insurance Providers</div>
      
//       {/* Success Alert */}
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateInsuranceProviders && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleShowAddModal}
//               >
//                 <CIcon icon={cilPlus} className='icon'/> New Provider
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
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
//                       <CBadge color="secondary">No insurance providers available</CBadge>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((provider, index) => (
//                     <CTableRow key={provider.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>
//                        {provider.provider_name}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <CFormSwitch
//                             checked={provider.is_active}
//                             onChange={() => handleToggleActive(provider.id, provider.is_active)}
//                             className="ms-2"
//                             disabled={!canUpdateInsuranceProviders}
//                           />
//                         </div>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, provider.id)}
//                             disabled={!canUpdateInsuranceProviders && !canDeleteInsuranceProviders}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${provider.id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === provider.id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateInsuranceProviders && (
//                               <MenuItem 
//                                 onClick={() => handleShowEditModal(provider)}
//                                 style={{ color: 'black' }}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" />
//                                 Edit
//                               </MenuItem>
//                             )}
//                             {canDeleteInsuranceProviders && (
//                               <MenuItem onClick={() => handleDelete(provider.id)}>
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

//       <AddProvider
//         show={showModal}
//         onClose={handleCloseModal}
//         onProviderSaved={handleProviderSaved}
//         editingProvider={editingProvider}
//       />
//     </div>
//   );
// };

// export default ProviderList;






import { CFormSwitch } from '@coreui/react';
import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
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
  CBadge,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import AddProvider from './AddProvider';
import { useAuth } from '../../../context/AuthContext';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const ProviderList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
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
  
  // Page-level permission checks for Insurance Providers page under Masters module
  const hasInsuranceProvidersView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.INSURANCE_PROVIDERS, 
    ACTIONS.VIEW
  );
  
  const hasInsuranceProvidersCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.INSURANCE_PROVIDERS, 
    ACTIONS.CREATE
  );
  
  const hasInsuranceProvidersUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.INSURANCE_PROVIDERS, 
    ACTIONS.UPDATE
  );
  
  const hasInsuranceProvidersDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.INSURANCE_PROVIDERS, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewInsuranceProviders = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
  const canCreateInsuranceProviders = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
  const canUpdateInsuranceProviders = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
  const canDeleteInsuranceProviders = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PROVIDERS);
  
  const showActionColumn = canUpdateInsuranceProviders || canDeleteInsuranceProviders;

  useEffect(() => {
    if (!canViewInsuranceProviders) {
      showError('You do not have permission to view Insurance Providers');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewInsuranceProviders]);

  // Fetch data with pagination and search
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    if (!canViewInsuranceProviders) return;
    
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
      
      const response = await axiosInstance.get(`/insurance-providers?${params.toString()}`);

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
        throw new Error('Failed to fetch insurance providers');
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

  const handleToggleActive = async (providerId, currentStatus) => {
    if (!canUpdateInsuranceProviders) {
      showError('You do not have permission to update insurance provider status');
      return;
    }
    
    const newStatus = !currentStatus;

    try {
      await axiosInstance.patch(`/insurance-providers/${providerId}/status`, {
        is_active: newStatus
      });

      // Refresh current page after status update
      fetchData(pagination.currentPage, pagination.limit, pagination.search);
      
      setSuccessMessage(`Insurance provider ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling provider status:', error);
      showError('Failed to update provider status');
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteInsuranceProviders) {
      showError('You do not have permission to delete insurance providers');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/insurance-providers/${id}`);
        // Refresh current page after delete
        fetchData(pagination.currentPage, pagination.limit, pagination.search);
        setSuccessMessage('Insurance provider deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleShowAddModal = () => {
    if (!canCreateInsuranceProviders) {
      showError('You do not have permission to add insurance providers');
      return;
    }
    
    setEditingProvider(null);
    setShowModal(true);
  };

  const handleShowEditModal = (provider) => {
    if (!canUpdateInsuranceProviders) {
      showError('You do not have permission to edit insurance providers');
      return;
    }
    
    setEditingProvider(provider);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProvider(null);
  };

  const handleProviderSaved = (message) => {
    // Refresh current page after save
    fetchData(pagination.currentPage, pagination.limit, pagination.search);
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!canViewInsuranceProviders) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Insurance Providers.
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
      <div className='title'>Insurance Providers</div>
      
      {/* Success Alert */}
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateInsuranceProviders && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
              >
                <CIcon icon={cilPlus} className='icon'/> New Provider
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
                placeholder="Search by provider name..."
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
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
                      <CBadge color="secondary">
                        {pagination.search ? 'No matching insurance providers found' : 'No insurance providers available'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((provider, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={provider.id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          {provider.provider_name}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CFormSwitch
                              checked={provider.is_active}
                              onChange={() => handleToggleActive(provider.id, provider.is_active)}
                              className="ms-2"
                              disabled={!canUpdateInsuranceProviders}
                            />
                          </div>
                        </CTableDataCell>
                        {showActionColumn && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className='option-button btn-sm'
                              onClick={(event) => handleClick(event, provider.id)}
                              disabled={!canUpdateInsuranceProviders && !canDeleteInsuranceProviders}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${provider.id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === provider.id} 
                              onClose={handleClose}
                            >
                              {canUpdateInsuranceProviders && (
                                <MenuItem 
                                  onClick={() => handleShowEditModal(provider)}
                                  style={{ color: 'black' }}
                                >
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              )}
                              {canDeleteInsuranceProviders && (
                                <MenuItem onClick={() => handleDelete(provider.id)}>
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

      <AddProvider
        show={showModal}
        onClose={handleCloseModal}
        onProviderSaved={handleProviderSaved}
        editingProvider={editingProvider}
      />
    </div>
  );
};

export default ProviderList;