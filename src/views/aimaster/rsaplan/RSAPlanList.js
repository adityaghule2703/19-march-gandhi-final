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
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
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
  CPagination,
  CPaginationItem,
  CFormSelect,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilChevronLeft, cilChevronRight, cilInfo } from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const RSAPlanList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Server-side state
  const [plans, setPlans] = useState([]);
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
      
      const url = `/rsa-plans?${params.toString()}`;
      
      const response = await axiosInstance.get(url);
      
      // Normalize response - handle the actual API response structure
      let plansData = [];
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        plansData = response.data.data;
      } else if (response.data?.data?.plans && Array.isArray(response.data.data.plans)) {
        plansData = response.data.data.plans;
      } else if (Array.isArray(response.data)) {
        plansData = response.data;
      } else if (response.data?.plans && Array.isArray(response.data.plans)) {
        plansData = response.data.plans;
      }
      
      // Set pagination from response
      setPagination({
        page: response.data?.page || page,
        limit: response.data?.limit || limit,
        totalCount: response.data?.total || response.data?.count || plansData.length,
        totalPages: response.data?.pages || Math.ceil((response.data?.total || response.data?.count || plansData.length) / limit),
        hasNextPage: response.data?.page < response.data?.pages,
        hasPrevPage: response.data?.page > 1
      });
      
      setPlans(plansData);
      setError(null);
    } catch (error) {
      console.error('Error fetching RSA plans:', error);
      const message = showError(error);
      if (message) setError(message);
      setPlans([]);
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
        await axiosInstance.delete(`/rsa-plans/${id}`);
        // Refresh current page after deletion
        fetchData(pagination.page, pagination.limit, searchTerm);
        showSuccess();
      } catch (error) {
        showError(error);
      }
    }
  };

  // Helper function to get model names from the models array
  const getModelNames = (models) => {
    if (!models || !Array.isArray(models) || models.length === 0) {
      return 'N/A';
    }
    
    const names = models
      .map(m => m.model_name || m.display_name || m.name || m)
      .filter(name => name);
    
    return names.length > 0 ? names.join(', ') : 'N/A';
  };

  // Helper function to get verticle names from the verticles array (for backward compatibility)
  const getVerticleNames = (verticles) => {
    if (!verticles || !Array.isArray(verticles) || verticles.length === 0) {
      return 'N/A';
    }
    
    const names = verticles
      .map(v => v.name || v)
      .filter(name => name);
    
    return names.length > 0 ? names.join(', ') : 'N/A';
  };

  if (loading && plans.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
        <span className="ms-2">Loading RSA plans...</span>
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
      <div className="title">RSA Plans</div>

      {/* Note Alert */}
      <CAlert color="info" className="mt-3">
        <div className="d-flex align-items-start">
          <CIcon icon={cilInfo} className="me-2 mt-1" />
          <div>
            <strong>Note:</strong> Please enter the plan name exactly as shown on the RSA website. This ensures consistency and proper identification across the system.
          </div>
        </div>
      </CAlert>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <Link to="/rsa-plan/add-rsa-plan">
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className="icon" /> New RSA Plan
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
                placeholder="Search plans..."
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
                  <CTableHeaderCell>Plan Name</CTableHeaderCell>
                  <CTableHeaderCell>Sum Insured</CTableHeaderCell>
                  <CTableHeaderCell>Tenure</CTableHeaderCell>
                  <CTableHeaderCell>Benefits</CTableHeaderCell>
                  <CTableHeaderCell>Price</CTableHeaderCell>
                  <CTableHeaderCell>Models</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {plans.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No RSA plans found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  plans.map((plan, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    
                    // Get model names from the plan
                    let modelDisplay = 'N/A';
                    if (plan.models && Array.isArray(plan.models) && plan.models.length > 0) {
                      const modelNames = plan.models
                        .map(m => m.model_name || m.display_name || m.name)
                        .filter(name => name);
                      modelDisplay = modelNames.length > 0 ? modelNames.join(', ') : 'N/A';
                    } else if (plan.verticles && Array.isArray(plan.verticles) && plan.verticles.length > 0) {
                      // Fallback to verticles for backward compatibility
                      const verticleNames = plan.verticles
                        .map(v => v.name || v)
                        .filter(name => name);
                      modelDisplay = verticleNames.length > 0 ? verticleNames.join(', ') : 'N/A';
                    }
                    
                    return (
                      <CTableRow key={plan._id || plan.id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{plan.planName || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{plan.sumInsured || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{plan.tenure || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {plan.benefits ? (
                            <span title={plan.benefits}>
                              {plan.benefits.length > 50 
                                ? `${plan.benefits.substring(0, 50)}...` 
                                : plan.benefits}
                            </span>
                          ) : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>₹{plan.price || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {modelDisplay !== 'N/A' ? (
                            <span title={modelDisplay}>
                              {modelDisplay.length > 30 
                                ? `${modelDisplay.substring(0, 30)}...` 
                                : modelDisplay}
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={plan.status === 'active' ? 'success' : 'secondary'}>
                            {plan.status === 'active' ? (
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
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, plan._id || plan.id)}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu
                              id={`action-menu-${plan._id || plan.id}`}
                              anchorEl={anchorEl}
                              open={menuId === (plan._id || plan.id)}
                              onClose={handleClose}
                            >
                              <Link className="Link" to={`/rsa-plan/update-rsa-plan/${plan._id || plan.id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>

                              <MenuItem onClick={() => handleDelete(plan._id || plan.id)}>
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

export default RSAPlanList;