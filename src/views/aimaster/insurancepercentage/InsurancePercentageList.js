import '../../../css/table.css';
import { useRef } from 'react';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  axiosInstance,
  confirmDelete,
  showError,
  showSuccess
} from '../../../utils/tableImports';
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
  CFormSelect,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilChevronLeft, cilChevronRight } from '@coreui/icons';

const API_ENDPOINT = '/insurancePercentage';
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const InsurancePercentageList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Server-side state
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);
  
  const showActionColumn = true; // Always show action column

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    // Clear previous timer
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    // Set new timer
    searchTimer.current = setTimeout(() => {
      // Reset to page 1 when searching
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchData(1, pagination.limit, searchTerm);
    }, 500);
    
    // Cleanup
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchTerm]);

  // Normalizer to keep response shape handling consistent
  const normalizeResponse = (response) => {
    let recordsData = [];

    // Handle the actual API response structure
    if (response.data?.data && Array.isArray(response.data.data)) {
      recordsData = response.data.data;
    } else if (response.data?.data?.records && Array.isArray(response.data.data.records)) {
      recordsData = response.data.data.records;
    } else if (Array.isArray(response.data)) {
      recordsData = response.data;
    } else if (response.data?.records && Array.isArray(response.data.records)) {
      recordsData = response.data.records;
    }

    if (!Array.isArray(recordsData)) {
      recordsData = [];
    }

    return recordsData.map((record) => ({
      ...record,
      _id: record._id || record.id
    }));
  };

  const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      // Build URL with query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Apply search if provided
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `${API_ENDPOINT}?${params.toString()}`;
      
      const response = await axiosInstance.get(url);
      
      // Normalize response
      let recordsData = normalizeResponse(response);
      
      // Extract pagination data
      let paginationData = response.data?.data?.pagination || response.data?.pagination || {};
      
      // If pagination data is not in the response, calculate it
      if (!paginationData.totalCount && recordsData.length > 0) {
        paginationData = {
          page: page,
          limit: limit,
          totalCount: response.data?.totalCount || response.data?.data?.totalCount || response.data?.count || recordsData.length,
          totalPages: Math.ceil((response.data?.totalCount || response.data?.data?.totalCount || response.data?.count || recordsData.length) / limit),
          hasNextPage: recordsData.length === limit,
          hasPrevPage: page > 1
        };
      }
      
      setRecords(recordsData);
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        totalCount: paginationData.totalCount || response.data?.count || recordsData.length,
        totalPages: paginationData.totalPages || Math.ceil((paginationData.totalCount || response.data?.count || recordsData.length) / limit),
        hasNextPage: paginationData.hasNextPage || (recordsData.length === limit),
        hasPrevPage: paginationData.hasPrevPage || (page > 1)
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching insurance percentages:', error);
      const message = showError(error);
      if (message) setError(message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle rows per page change
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit, 10),
      page: 1 // Reset to first page when changing limit
    }));
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
        // Refresh current page after deletion
        fetchData(pagination.page, pagination.limit, searchTerm);
        showSuccess();
      } catch (error) {
        showError(error);
      }
    }
  };

  if (loading && records.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
        <span className="ms-2">Loading insurance percentages...</span>
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

  // Calculate displayed page numbers (max 5 pages shown)
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

  return (
    <div>
      <div className="title">Insurance Percentage</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <Link to="/insurance-percentage/add-insurance-percentage">
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className="icon" /> New Insurance Percentage
              </CButton>
            </Link>
          </div>
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
            <div className="d-flex align-items-center">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search insurance company..."
                style={{ width: '250px' }}
              />
              {loading && <CSpinner size="sm" className="ms-2" />}
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Insurance Company</CTableHeaderCell>
                  <CTableHeaderCell>Motor %</CTableHeaderCell>
                  <CTableHeaderCell>Scooter %</CTableHeaderCell>
                  <CTableHeaderCell>EV %</CTableHeaderCell>
                  <CTableHeaderCell>Priority</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {records.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No insurance percentages found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  records.map((record, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={record._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{record.insuranceCompany || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {record.percentages?.motor != null ? `${record.percentages.motor}%` : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {record.percentages?.scooter != null ? `${record.percentages.scooter}%` : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {record.percentages?.ev != null ? `${record.percentages.ev}%` : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={record.priority === 1 ? 'primary' : 'info'}>
                            {record.priority != null ? record.priority : 'N/A'}
                          </CBadge>
                          {record.priority === 1 && (
                            <span className="ms-1 text-primary" title="Highest Priority">
                              ⭐
                            </span>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={record.isActive ? 'success' : 'secondary'}>
                            {record.isActive ? (
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
                        <CTableDataCell>
                          {record.description ? (
                            <span title={record.description}>
                              {record.description.length > 30 
                                ? `${record.description.substring(0, 30)}...` 
                                : record.description}
                            </span>
                          ) : 'N/A'}
                        </CTableDataCell>
                        {showActionColumn && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, record._id)}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu
                              id={`action-menu-${record._id}`}
                              anchorEl={anchorEl}
                              open={menuId === record._id}
                              onClose={handleClose}
                            >
                              <Link className="Link" to={`/insurance-percentage/update-insurance-percentage/${record._id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>

                              <MenuItem onClick={() => handleDelete(record._id)}>
                                <CIcon icon={cilTrash} className="me-2" />
                                Delete
                              </MenuItem>
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
          {pagination.totalCount > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
                </span>
              </div>
              
              {pagination.totalPages > 1 && (
                <CPagination align="center" aria-label="Page navigation example">
                  {/* Previous Button */}
                  <CPaginationItem 
                    aria-label="Previous" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className={pagination.page === 1 ? 'disabled' : ''}
                  >
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>
                  
                  {/* First Page */}
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
                  
                  {/* Page Numbers */}
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
                  
                  {/* Last Page */}
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
                  
                  {/* Next Button */}
                  <CPaginationItem 
                    aria-label="Next" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className={pagination.page === pagination.totalPages ? 'disabled' : ''}
                  >
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default InsurancePercentageList;






// import '../../../css/table.css';
// import { useRef } from 'react';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   axiosInstance,
//   confirmDelete,
//   showError,
//   showSuccess
// } from '../../../utils/tableImports';
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
//   CFormSelect,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilChevronLeft, cilChevronRight } from '@coreui/icons';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   useSafePagePermissions
// } from '../../../utils/modulePermissions';
// import { useAuth } from '../../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const API_ENDPOINT = '/insurancePercentage';
// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const InsurancePercentageList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Server-side state
//   const [records, setRecords] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     totalCount: 0,
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
  
//   // Search state
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchTimer = useRef(null);
  
//   const showActionColumn = true; // Always show action column

//   // Permission checks
//   const { permissions = [], user } = useAuth();
//   const navigate = useNavigate();

//   // Page-level permission checks for Insurance Percentage page under Masters module
//   const hasInsurancePercentageView = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PERCENTAGE, 
//     ACTIONS.VIEW
//   );
  
//   const hasInsurancePercentageCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PERCENTAGE, 
//     ACTIONS.CREATE
//   );
  
//   const hasInsurancePercentageUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PERCENTAGE, 
//     ACTIONS.UPDATE
//   );
  
//   const hasInsurancePercentageDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.INSURANCE_PERCENTAGE, 
//     ACTIONS.DELETE
//   );

//   // Using convenience functions for cleaner code
//   const canViewInsurancePercentage = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PERCENTAGE);
//   const canCreateInsurancePercentage = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PERCENTAGE);
//   const canUpdateInsurancePercentage = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PERCENTAGE);
//   const canDeleteInsurancePercentage = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.INSURANCE_PERCENTAGE);

//   // Check if user has any action permission (not just VIEW) on this page
//   const canAccessInsurancePercentage = canViewInsurancePercentage || 
//     canCreateInsurancePercentage || 
//     canUpdateInsurancePercentage || 
//     canDeleteInsurancePercentage;

//   useEffect(() => {
//     // Check if user has permission to view this page
//     if (!canViewInsurancePercentage) {
//       showError('You do not have permission to view Insurance Percentage');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchData();
//   }, [pagination.page, pagination.limit]);

//   // Debounced search
//   useEffect(() => {
//     // Clear previous timer
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     // Set new timer
//     searchTimer.current = setTimeout(() => {
//       // Reset to page 1 when searching
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchData(1, pagination.limit, searchTerm);
//     }, 500);
    
//     // Cleanup
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, [searchTerm]);

//   // Normalizer to keep response shape handling consistent
//   const normalizeResponse = (response) => {
//     let recordsData = [];

//     if (response.data?.data?.records && Array.isArray(response.data.data.records)) {
//       recordsData = response.data.data.records;
//     } else if (response.data?.data && Array.isArray(response.data.data)) {
//       recordsData = response.data.data;
//     } else if (Array.isArray(response.data)) {
//       recordsData = response.data;
//     } else if (response.data?.records && Array.isArray(response.data.records)) {
//       recordsData = response.data.records;
//     }

//     if (!Array.isArray(recordsData)) {
//       recordsData = [];
//     }

//     return recordsData.map((record) => ({
//       ...record,
//       _id: record._id || record.id
//     }));
//   };

//   const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     try {
//       setLoading(true);
      
//       // Build URL with query parameters
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
      
//       // Apply search if provided
//       if (search && search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       const url = `${API_ENDPOINT}?${params.toString()}`;
      
//       const response = await axiosInstance.get(url);
      
//       // Normalize response
//       let recordsData = normalizeResponse(response);
      
//       // Extract pagination data
//       let paginationData = response.data?.data?.pagination || response.data?.pagination || {};
      
//       // If pagination data is not in the response, calculate it
//       if (!paginationData.totalCount && recordsData.length > 0) {
//         paginationData = {
//           page: page,
//           limit: limit,
//           totalCount: response.data?.totalCount || response.data?.data?.totalCount || recordsData.length,
//           totalPages: Math.ceil((response.data?.totalCount || response.data?.data?.totalCount || recordsData.length) / limit),
//           hasNextPage: recordsData.length === limit,
//           hasPrevPage: page > 1
//         };
//       }
      
//       setRecords(recordsData);
//       setPagination({
//         page: paginationData.page || page,
//         limit: paginationData.limit || limit,
//         totalCount: paginationData.totalCount || recordsData.length,
//         totalPages: paginationData.totalPages || Math.ceil((paginationData.totalCount || recordsData.length) / limit),
//         hasNextPage: paginationData.hasNextPage || (recordsData.length === limit),
//         hasPrevPage: paginationData.hasPrevPage || (page > 1)
//       });
      
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching insurance percentages:', error);
//       const message = showError(error);
//       if (message) setError(message);
//       setRecords([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//   };

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.totalPages) return;
    
//     setPagination(prev => ({ ...prev, page: newPage }));
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle rows per page change
//   const handleLimitChange = (newLimit) => {
//     setPagination(prev => ({ 
//       ...prev, 
//       limit: parseInt(newLimit, 10),
//       page: 1 // Reset to first page when changing limit
//     }));
//   };

//   const handleClick = (event, id) => {
//     // Check if user has permission to access options menu
//     if (!canUpdateInsurancePercentage && !canDeleteInsurancePercentage) {
//       showError('You do not have permission to access this menu');
//       return;
//     }
    
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleDelete = async (id) => {
//     // Check delete permission before proceeding
//     if (!canDeleteInsurancePercentage) {
//       showError('You do not have permission to delete insurance percentage records');
//       return;
//     }

//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
//         // Refresh current page after deletion
//         fetchData(pagination.page, pagination.limit, searchTerm);
//         showSuccess();
//       } catch (error) {
//         showError(error);
//       }
//     }
//   };

//   // Check permission before rendering
//   if (!canAccessInsurancePercentage && !loading) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to access Insurance Percentage.
//       </div>
//     );
//   }

//   if (loading && records.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//         <span className="ms-2">Loading insurance percentages...</span>
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

//   // Calculate displayed page numbers (max 5 pages shown)
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
//       <div className="title">Insurance Percentage</div>

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {/* Only show New button if user has create permission */}
//             {canCreateInsurancePercentage && (
//               <Link to="/insurance-percentage/add-insurance-percentage">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className="icon" /> New Insurance Percentage
//                 </CButton>
//               </Link>
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
//             <div className="d-flex align-items-center">
//               <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search insurance company..."
//                 style={{ width: '250px' }}
//                 disabled={!canViewInsurancePercentage}
//               />
//               {loading && <CSpinner size="sm" className="ms-2" />}
//             </div>
//           </div>

//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Insurance Company</CTableHeaderCell>
//                   <CTableHeaderCell>Percentage</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {/* Only show Action column if user has update or delete permissions */}
//                   {(canUpdateInsurancePercentage || canDeleteInsurancePercentage) && (
//                     <CTableHeaderCell>Action</CTableHeaderCell>
//                   )}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {records.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell 
//                       colSpan={(canUpdateInsurancePercentage || canDeleteInsurancePercentage) ? 5 : 4} 
//                       className="text-center"
//                     >
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No insurance percentages found.'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   records.map((record, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={record._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{record.insuranceCompany || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{record.percentage != null ? `${record.percentage}%` : 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={record.isActive ? 'success' : 'secondary'}>
//                             {record.isActive ? (
//                               <>
//                                 <CIcon icon={cilCheckCircle} className="me-1" />
//                                 Active
//                               </>
//                             ) : (
//                               <>
//                                 <CIcon icon={cilXCircle} className="me-1" />
//                                 Inactive
//                               </>
//                             )}
//                           </CBadge>
//                         </CTableDataCell>
//                         {/* Only show Action column if user has update or delete permissions */}
//                         {(canUpdateInsurancePercentage || canDeleteInsurancePercentage) && (
//                           <CTableDataCell>
//                             <CButton
//                               size="sm"
//                               className="option-button btn-sm"
//                               onClick={(event) => handleClick(event, record._id)}
//                               disabled={!canUpdateInsurancePercentage && !canDeleteInsurancePercentage}
//                             >
//                               <CIcon icon={cilSettings} />
//                               Options
//                             </CButton>
//                             <Menu
//                               id={`action-menu-${record._id}`}
//                               anchorEl={anchorEl}
//                               open={menuId === record._id}
//                               onClose={handleClose}
//                             >
//                               {/* Only show Edit option if user has update permission */}
//                               {canUpdateInsurancePercentage && (
//                                 <Link className="Link" to={`/insurance-percentage/update-insurance-percentage/${record._id}`}>
//                                   <MenuItem style={{ color: 'black' }}>
//                                     <CIcon icon={cilPencil} className="me-2" />
//                                     Edit
//                                   </MenuItem>
//                                 </Link>
//                               )}

//                               {/* Only show Delete option if user has delete permission */}
//                               {canDeleteInsurancePercentage && (
//                                 <MenuItem onClick={() => handleDelete(record._id)}>
//                                   <CIcon icon={cilTrash} className="me-2" />
//                                   Delete
//                                 </MenuItem>
//                               )}
//                             </Menu>
//                           </CTableDataCell>
//                         )}
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
//                   {/* Previous Button */}
//                   <CPaginationItem 
//                     aria-label="Previous" 
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page === 1 || loading}
//                     className={pagination.page === 1 ? 'disabled' : ''}
//                   >
//                     <CIcon icon={cilChevronLeft} />
//                   </CPaginationItem>
                  
//                   {/* First Page */}
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
                  
//                   {/* Page Numbers */}
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
                  
//                   {/* Last Page */}
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
                  
//                   {/* Next Button */}
//                   <CPaginationItem 
//                     aria-label="Next" 
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page === pagination.totalPages || loading}
//                     className={pagination.page === pagination.totalPages ? 'disabled' : ''}
//                   >
//                     <CIcon icon={cilChevronRight} />
//                   </CPaginationItem>
//                 </CPagination>
//               )}
//             </div>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default InsurancePercentageList;