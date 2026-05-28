import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  React as ReactImport,
  useState as useStateImport,
  useEffect as useEffectImport,
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
import { useAuth } from '../../../context/AuthContext';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilChart,
  cilChevronLeft,
  cilChevronRight
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Analytics Modal Component
const AnalyticsDetailModal = ({ visible, onClose, modelId, modelName }) => {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && modelId) {
      fetchAnalytics();
    }
  }, [visible, modelId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/low-stock/model/${modelId}/analytics`);
      setApiResponse(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!visible) return null;

  return (
    <CModal size="xl" visible={visible} onClose={onClose} scrollable>
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilChart} className="me-2" />
          Stock Analytics - {modelName || `Model ${modelId}`}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-2">Loading analytics data...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        ) : apiResponse?.data ? (
          <>
            {/* Model Info */}
            <div className="mb-3">
              <h6>Model: {apiResponse.data.model?.name}</h6>
              <p className="text-muted small">Type: {apiResponse.data.model?.type}</p>
            </div>

            {/* Period Information */}
            <div className="mb-3 text-muted small">
              Period Type: {apiResponse.data.periodType}
              <br />
              Period: {formatDate(apiResponse.data.period?.start)} to {formatDate(apiResponse.data.period?.end)}
              <br />
              Days in Period: {apiResponse.data.period?.daysInPeriod}
              <br />
              Generated At: {formatDate(apiResponse.data.generatedAt)}
            </div>

            {/* Overall Metrics */}
            {apiResponse.data.overall && (
              <CCard className="mb-4">
                <CCardBody>
                  <h5 className="mb-3">Overall Metrics</h5>
                  <CRow>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Total Sold</div>
                        <div className="h4 mb-0">{apiResponse.data.overall.totalSold}</div>
                      </div>
                    </CCol>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Average Daily Sales</div>
                        <div className="h4 mb-0">{apiResponse.data.overall.averageDailySales}</div>
                      </div>
                    </CCol>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Sales Velocity</div>
                        <div className="h4 mb-0">{apiResponse.data.overall.salesVelocity}</div>
                      </div>
                    </CCol>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Current Stock</div>
                        <div className="h4 mb-0">{apiResponse.data.overall.currentStock}</div>
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md={4} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Days of Inventory</div>
                        <div className="h5 mb-0">{apiResponse.data.overall.daysOfInventory}</div>
                      </div>
                    </CCol>
                    <CCol md={4} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Status</div>
                        <div className="h5 mb-0">{apiResponse.data.overall.status}</div>
                      </div>
                    </CCol>
                    <CCol md={4} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Recommendation</div>
                        <div className="small">{apiResponse.data.overall.recommendation}</div>
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md={6} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Total Colors With Stock</div>
                        <div className="h5 mb-0">{apiResponse.data.overall.totalColorsWithStock}</div>
                      </div>
                    </CCol>
                    <CCol md={6} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Total Colors With Sales</div>
                        <div className="h5 mb-0">{apiResponse.data.overall.totalColorsWithSales}</div>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}

            {/* Summary Statistics */}
            {/* {apiResponse.data.summary && (
              <CCard className="mb-4">
                <CCardBody>
                  <h5 className="mb-3">Summary Statistics</h5>
                  <CRow>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Total Stock</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.totalStock}</div>
                      </div>
                    </CCol>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Total Monthly Sales</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.totalMonthlySales}</div>
                      </div>
                    </CCol>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Average Stock Per Color</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.averageStockPerColor}</div>
                      </div>
                    </CCol>
                    <CCol md={3} className="mb-2">
                      <div className="border rounded p-2 text-center">
                        <div className="text-muted small">Average Sales Per Color</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.averageSalesPerColor}</div>
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md={4} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Colors with Low Stock</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.colorsWithLowStock}</div>
                      </div>
                    </CCol>
                    <CCol md={4} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Best Selling Color</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.bestSellingColor || '-'}</div>
                      </div>
                    </CCol>
                    <CCol md={4} className="mb-2">
                      <div className="border rounded p-2">
                        <div className="text-muted small">Worst Stock Color</div>
                        <div className="h5 mb-0">{apiResponse.data.summary.worstStockColor || '-'}</div>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )} */}

            {/* Color Breakdown Table */}
            {apiResponse.data.colorBreakdown && apiResponse.data.colorBreakdown.length > 0 && (
              <CCard>
                <CCardBody>
                  <h5 className="mb-3">Color-wise Breakdown</h5>
                  <div className="responsive-table-wrapper">
                    <CTable striped bordered hover size="sm">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Color Name</CTableHeaderCell>
                          <CTableHeaderCell>Total Sold</CTableHeaderCell>
                          <CTableHeaderCell>Current Stock</CTableHeaderCell>
                          <CTableHeaderCell>Average Daily Sales</CTableHeaderCell>
                          <CTableHeaderCell>Days of Inventory</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Alert Level</CTableHeaderCell>
                          <CTableHeaderCell>Recommendation</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {apiResponse.data.colorBreakdown.map((color, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{color.colorName}</CTableDataCell>
                            <CTableDataCell>{color.totalSold}</CTableDataCell>
                            <CTableDataCell>{color.currentStock}</CTableDataCell>
                            <CTableDataCell>{color.averageDailySales}</CTableDataCell>
                            <CTableDataCell>{color.daysOfInventory}</CTableDataCell>
                            <CTableDataCell>{color.status}</CTableDataCell>
                            <CTableDataCell>{color.alertLevel}</CTableDataCell>
                            <CTableDataCell>{color.recommendation}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                </CCardBody>
              </CCard>
            )}
          </>
        ) : (
          <div className="text-center text-muted py-5">
            No analytics data available
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

// Main ModalAnalytics Component with Server-Side Pagination
const ModalAnalytics = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Server-side state
  const [models, setModels] = useState([]);
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
  
  // Modal state
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  
  const { permissions } = useAuth();

  // Permission checks
  const canViewModels = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.VEHICLES);

  // Initial data fetch
  useEffect(() => {
    if (!canViewModels) {
      showError('You do not have permission to view Models');
      setLoading(false);
      return;
    }
    fetchModels();
  }, [pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    if (!canViewModels) return;
    
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchModels(1, pagination.limit, searchTerm);
    }, 500);
    
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchTerm]);

  const fetchModels = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/models?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      let modelsData = response.data.data?.models || response.data.data || [];
      
      // Format the models data (verticle_name is already in the response)
      modelsData = modelsData.map((model) => ({
        ...model,
        _id: model._id || model.id
      }));
      
      setModels(modelsData);
      setPagination({
        page: response.data.data?.pagination?.page || page,
        limit: response.data.data?.pagination?.limit || limit,
        totalCount: response.data.data?.pagination?.totalCount || response.data.results || modelsData.length,
        totalPages: response.data.data?.pagination?.totalPages || 1,
        hasNextPage: response.data.data?.pagination?.hasNextPage || false,
        hasPrevPage: response.data.data?.pagination?.hasPrevPage || false
      });
      
      setError(null);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleAnalyticsClick = (model) => {
    setSelectedModel(model);
    setAnalyticsModalVisible(true);
    handleClose();
  };

  if (!canViewModels) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Models.
      </div>
    );
  }

  if (error && models.length === 0) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

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
      <div className='title'>Model Analytics</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
         
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
                placeholder="Search by model name..."
                style={{ width: '250px' }}
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
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Model name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Verticle</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {models.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={5} className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No models found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  models.map((model, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={model._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{model.model_name}</CTableDataCell>
                        <CTableDataCell>{model.type || '-'}</CTableDataCell>
                        <CTableDataCell>{model.verticle_name || '-'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, model._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${model._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === model._id} 
                            onClose={handleClose}
                          >
                            <MenuItem onClick={() => handleAnalyticsClick(model)}>
                              <CIcon icon={cilChart} className="me-2" />
                              View Analytics
                            </MenuItem>
                          </Menu>
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

      {/* Analytics Detail Modal */}
      <AnalyticsDetailModal
        visible={analyticsModalVisible}
        onClose={() => setAnalyticsModalVisible(false)}
        modelId={selectedModel?._id}
        modelName={selectedModel?.model_name}
      />
    </div>
  );
};

export default ModalAnalytics;