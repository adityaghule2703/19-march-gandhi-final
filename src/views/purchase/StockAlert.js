import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CBadge,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormLabel,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CProgress
} from '@coreui/react';
import { 
  cilZoomOut, 
  cilChevronLeft, 
  cilChevronRight,
  cilSearch,
  cilWarning,
  cilInfo,
  cilBell,
  cilChartLine,
  cilCalculator,
  cilCart
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { axiosInstance, showError } from '../../utils/tableImports';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Alert level colors and icons
const ALERT_CONFIG = {
  'CRITICAL': { color: 'danger', icon: cilWarning, label: 'CRITICAL' },
  'HIGH': { color: 'warning', icon: cilWarning, label: 'HIGH' },
  'MEDIUM': { color: 'info', icon: cilBell, label: 'MEDIUM' },
  'INFO': { color: 'secondary', icon: cilInfo, label: 'INFO' }
};

const StockAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertLevelFilter, setAlertLevelFilter] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Debounce timer for search
  const searchTimer = useRef(null);
  
  // Search input ref
  const searchInputRef = useRef(null);

  // Fetch alerts data
  const fetchAlerts = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '', alertLevel = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit,
        ...(search && { search: search.trim() }),
        ...(alertLevel && { alertLevel })
      };
      
      const response = await axiosInstance.get('/low-stock/alerts', { params });
      
      if (response.data?.success && response.data?.data) {
        setAlerts(response.data.data.alerts || []);
        setSummary(response.data.data.summary || null);
        
        const paginationData = response.data.data.pagination;
        if (paginationData) {
          setPagination({
            currentPage: paginationData.page || page,
            limit: paginationData.limit || limit,
            total: paginationData.total || 0,
            pages: paginationData.pages || 0,
            hasNextPage: paginationData.hasNextPage || false,
            hasPrevPage: paginationData.hasPrevPage || false
          });
        } else {
          // If no pagination from API, calculate from alerts array
          const filteredAlerts = response.data.data.alerts || [];
          setPagination(prev => ({
            ...prev,
            total: filteredAlerts.length,
            pages: Math.ceil(filteredAlerts.length / limit),
            currentPage: page,
            limit: limit
          }));
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      const errorMsg = showError(err);
      setError(errorMsg || 'Failed to fetch stock alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchAlerts(1, DEFAULT_LIMIT, '', '');
  }, [fetchAlerts]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  // Handle search with debounce
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      fetchAlerts(1, pagination.limit, value, alertLevelFilter);
    }, 500);
  }, [fetchAlerts, pagination.limit, alertLevelFilter]);

  const resetSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setAlertLevelFilter('');
    fetchAlerts(1, pagination.limit, '', '');
  };

  const handleAlertLevelFilter = (level) => {
    setAlertLevelFilter(level);
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    fetchAlerts(1, pagination.limit, '', level);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchAlerts(newPage, pagination.limit, searchTerm, alertLevelFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    fetchAlerts(1, parseInt(newLimit, 10), searchTerm, alertLevelFilter);
  };

  // View alert details
  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setAlertModalVisible(true);
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  // Get alert badge
  const getAlertBadge = (level) => {
    const config = ALERT_CONFIG[level] || ALERT_CONFIG['INFO'];
    return (
      <CBadge color={config.color} className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
        <CIcon icon={config.icon} size="sm" />
        <span>{config.label}</span>
      </CBadge>
    );
  };

  // Get stock status color
  const getStockStatusColor = (currentStock, safetyStockLevel) => {
    if (currentStock <= safetyStockLevel / 2) return 'danger';
    if (currentStock <= safetyStockLevel) return 'warning';
    return 'success';
  };

  // Pagination calculations for display
  const startRecord = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.currentPage * pagination.limit, pagination.total);

  // Render pagination component
  const renderPagination = () => {
    if (pagination.total === 0 || pagination.pages <= 1) return null;
    
    let startPage = Math.max(1, pagination.currentPage - 2);
    let endPage = Math.min(pagination.pages, pagination.currentPage + 2);
    
    if (pagination.currentPage <= 3) {
      endPage = Math.min(5, pagination.pages);
    }
    if (pagination.currentPage >= pagination.pages - 2) {
      startPage = Math.max(1, pagination.pages - 4);
    }
    
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
              Rows per page:
            </CFormLabel>
            <CFormSelect
              value={pagination.limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} alerts`}
          </span>
        </div>
        
        {pagination.pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1 || loading}
            >
              «
            </CPaginationItem>
            <CPaginationItem
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>
                  1
                </CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            
            {pageNumbers.map(page => (
              <CPaginationItem
                key={page}
                active={page === pagination.currentPage}
                onClick={() => handlePageChange(page)}
                disabled={loading}
              >
                {page}
              </CPaginationItem>
            ))}
            
            {endPage < pagination.pages && (
              <>
                {endPage < pagination.pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pagination.pages)} disabled={loading}>
                  {pagination.pages}
                </CPaginationItem>
              </>
            )}
            
            <CPaginationItem
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.pages || loading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem
              onClick={() => handlePageChange(pagination.pages)}
              disabled={pagination.currentPage === pagination.pages || loading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="title">Low Stock Alerts</div>

      {/* Summary Cards */}
      {summary && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Alerts</h5>
                <h2 className="mb-0 text-primary">{summary.totalAlerts}</h2>
                <small className="text-muted">
                  High: {summary.highAlerts} | Info: {summary.infoAlerts}
                </small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-warning">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Stock</h5>
                <h2 className="mb-0 text-warning">{formatNumber(summary.totalStockAcrossAlerts)}</h2>
                <small className="text-muted">Units across all alerts</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Monthly Sales</h5>
                <h2 className="mb-0 text-info">{formatNumber(summary.totalMonthlySalesAcrossAlerts)}</h2>
                <small className="text-muted">Units sold last month</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Stock Turnover</h5>
                <h2 className="mb-0 text-success">{summary.averageStockTurnover}</h2>
                <small className="text-muted">Average turnover rate</small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CCard className="table-container">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          {/* <div className="d-flex gap-2">
            <CButton 
              size="sm" 
              variant={alertLevelFilter === '' ? 'solid' : 'outline'}
              color="secondary"
              onClick={() => handleAlertLevelFilter('')}
            >
              All Alerts
            </CButton>
            <CButton 
              size="sm" 
              variant={alertLevelFilter === 'HIGH' ? 'solid' : 'outline'}
              color="warning"
              onClick={() => handleAlertLevelFilter('HIGH')}
            >
              High Priority
            </CButton>
            <CButton 
              size="sm" 
              variant={alertLevelFilter === 'INFO' ? 'solid' : 'outline'}
              color="secondary"
              onClick={() => handleAlertLevelFilter('INFO')}
            >
              Information
            </CButton>
            {(searchTerm || alertLevelFilter) && (
              <CButton size="sm" variant="outline" onClick={resetSearch}>
                <CIcon icon={cilZoomOut} className="me-1" /> Reset
              </CButton>
            )}
          </div> */}
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0">Search:</CFormLabel>
            <input
              ref={searchInputRef}
              type="text"
              style={{ 
                width: '250px', 
                height: '32px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da', 
                padding: '0 8px', 
                outline: 'none', 
                fontSize: '14px' 
              }}
              className="d-inline-block"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by model name, color..."
              autoComplete="off"
            />
            {loading && <CSpinner size="sm" color="primary" />}
          </div>
        </CCardHeader>

        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Current Stock</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Safety Stock</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Monthly Sales</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Days Until OOS</CTableHeaderCell>
                  <CTableHeaderCell>Alert Level</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {alerts.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center text-danger">
                      {searchTerm ? `No alerts found matching "${searchTerm}"` : 'No stock alerts available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  alerts.map((alert, index) => {
                    const stockStatusColor = getStockStatusColor(alert.currentStock, alert.safetyStockLevel);
                    const progressPercentage = (alert.currentStock / alert.safetyStockLevel) * 100;
                    
                    return (
                      <CTableRow key={`${alert.modelId}-${alert.colorId}`}>
                        <CTableDataCell>{startRecord + index}</CTableDataCell>
                        <CTableDataCell>
                          <strong>{alert.modelName}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{alert.colorName}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <div className="d-flex flex-column">
                            <span className={`fw-bold text-${stockStatusColor}`}>
                              {alert.currentStock}
                            </span>
                            <CProgress 
                              value={Math.min(progressPercentage, 100)} 
                              color={stockStatusColor}
                              style={{ height: '4px', width: '80px' }}
                              className="mt-1"
                            />
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-end text-muted">
                          {alert.safetyStockLevel}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          {formatNumber(alert.totalSoldLastMonth)}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CBadge color={alert.estimatedDaysUntilOutOfStock <= 7 ? 'danger' : 'warning'}>
                            {alert.estimatedDaysUntilOutOfStock} days
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {getAlertBadge(alert.alertLevel)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton 
                            size="sm" 
                            color="info" 
                            variant="outline"
                            onClick={() => handleViewAlert(alert)}
                          >
                            View Details
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {renderPagination()}
        </CCardBody>
      </CCard>

      {/* Alert Details Modal */}
      <CModal 
        visible={alertModalVisible} 
        onClose={() => setAlertModalVisible(false)} 
        size="lg"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            Stock Alert Details - {selectedAlert?.modelName}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedAlert && (
            <>
              {/* Alert Header */}
              <div className={`mb-3 p-3 rounded bg-${ALERT_CONFIG[selectedAlert.alertLevel]?.color || 'secondary'}-subtle`}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CIcon icon={ALERT_CONFIG[selectedAlert.alertLevel]?.icon || cilInfo} size="lg" />
                  <h5 className="mb-0">{selectedAlert.alertMessage}</h5>
                </div>
              </div>

              {/* Stock Information */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">
                  <CIcon icon={cilChartLine} className="me-2" />
                  Stock Information
                </h6>
                <CRow>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Model Name</small>
                    <div className="fw-bold">{selectedAlert.modelName}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Color</small>
                    <div className="fw-bold">{selectedAlert.colorName}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Alert Level</small>
                    <div>{getAlertBadge(selectedAlert.alertLevel)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Current Stock</small>
                    <div className={`fw-bold text-${getStockStatusColor(selectedAlert.currentStock, selectedAlert.safetyStockLevel)}`}>
                      {selectedAlert.currentStock} units
                    </div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Safety Stock Level</small>
                    <div className="fw-bold">{selectedAlert.safetyStockLevel} units</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Reorder Point</small>
                    <div className="fw-bold">{selectedAlert.reorderPoint} units</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Stock Status</small>
                    <div>
                      <CBadge color={getStockStatusColor(selectedAlert.currentStock, selectedAlert.safetyStockLevel)}>
                        {selectedAlert.currentStock <= selectedAlert.safetyStockLevel ? 'Below Safety Stock' : 'Above Safety Stock'}
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Sales Information */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">
                  <CIcon icon={cilCalculator} className="me-2" />
                  Sales Analysis
                </h6>
                <CRow>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Total Sold (Last Month)</small>
                    <div className="fw-bold text-info">{formatNumber(selectedAlert.totalSoldLastMonth)} units</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Average Daily Sales</small>
                    <div className="fw-bold">{selectedAlert.averageDailySales?.toFixed(2)} units/day</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Est. Days Until Out of Stock</small>
                    <div className={`fw-bold ${selectedAlert.estimatedDaysUntilOutOfStock <= 7 ? 'text-danger' : 'text-warning'}`}>
                      {selectedAlert.estimatedDaysUntilOutOfStock} days
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Recommendation */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">
                  <CIcon icon={cilCart} className="me-2" />
                  Recommendation
                </h6>
                <div className="p-2 bg-white rounded border">
                  <CIcon icon={cilInfo} className="me-2 text-info" />
                  {selectedAlert.recommendation}
                </div>
              </div>

              {/* Scenario */}
              {selectedAlert.scenario && (
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="mb-3">Analysis Scenario</h6>
                  <div className="p-2 bg-white rounded border text-muted small">
                    {selectedAlert.scenario}
                  </div>
                </div>
              )}

              {/* Progress Bar for Stock Level */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">Stock Level vs Safety Stock</h6>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ flex: 1 }}>
                    <CProgress
                      value={(selectedAlert.currentStock / selectedAlert.safetyStockLevel) * 100}
                      color={getStockStatusColor(selectedAlert.currentStock, selectedAlert.safetyStockLevel)}
                      style={{ height: '20px' }}
                    />
                  </div>
                  <div className="text-center" style={{ minWidth: '100px' }}>
                    <small className="text-muted">Safety Stock</small>
                    <div className="fw-bold">{selectedAlert.safetyStockLevel} units</div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <small className="text-muted">Current Stock: {selectedAlert.currentStock} units</small>
                </div>
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAlertModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockAlert;





// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CSpinner,
//   CAlert,
//   CBadge,
//   CButton,
//   CPagination,
//   CPaginationItem,
//   CFormSelect,
//   CFormLabel,
//   CRow,
//   CCol,
//   CInputGroup,
//   CInputGroupText,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane,
//   CProgress
// } from '@coreui/react';
// import { 
//   cilZoomOut, 
//   cilChevronLeft, 
//   cilChevronRight,
//   cilSearch,
//   cilWarning,
//   cilInfo,
//   cilBell,
//   cilChartLine,
//   cilCalculator,
//   cilCart
// } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';
// import { axiosInstance, showError } from '../../utils/tableImports';
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
// import { useAuth } from '../../context/AuthContext';

// // Pagination constants
// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// // Alert level colors and icons
// const ALERT_CONFIG = {
//   'CRITICAL': { color: 'danger', icon: cilWarning, label: 'CRITICAL' },
//   'HIGH': { color: 'warning', icon: cilWarning, label: 'HIGH' },
//   'MEDIUM': { color: 'info', icon: cilBell, label: 'MEDIUM' },
//   'INFO': { color: 'secondary', icon: cilInfo, label: 'INFO' }
// };

// const StockAlert = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [alertLevelFilter, setAlertLevelFilter] = useState('');
//   const [selectedAlert, setSelectedAlert] = useState(null);
//   const [alertModalVisible, setAlertModalVisible] = useState(false);
  
//   // Pagination state
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 0,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
  
//   // Debounce timer for search
//   const searchTimer = useRef(null);
  
//   // Search input ref
//   const searchInputRef = useRef(null);

//   const { permissions = [] } = useAuth();

//   // Permission checks for Purchase module - Stock Alert page
//   // Using PAGES.PURCHASE constants for page-level permissions
//   const canViewStockAlert = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_ALERT);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasViewPermission = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_ALERT, 
//     ACTIONS.VIEW
//   );
  
//   // Combined permission check for view action
//   const canPerformView = canViewStockAlert || hasViewPermission;

//   // Fetch alerts data
//   const fetchAlerts = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '', alertLevel = '') => {
//     // Check if user has permission to view stock alerts
//     if (!canViewStockAlert && !hasViewPermission) {
//       setError('You do not have permission to view stock alerts');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = {
//         page,
//         limit,
//         ...(search && { search: search.trim() }),
//         ...(alertLevel && { alertLevel })
//       };
      
//       const response = await axiosInstance.get('/low-stock/alerts', { params });
      
//       if (response.data?.success && response.data?.data) {
//         setAlerts(response.data.data.alerts || []);
//         setSummary(response.data.data.summary || null);
        
//         const paginationData = response.data.data.pagination;
//         if (paginationData) {
//           setPagination({
//             currentPage: paginationData.page || page,
//             limit: paginationData.limit || limit,
//             total: paginationData.total || 0,
//             pages: paginationData.pages || 0,
//             hasNextPage: paginationData.hasNextPage || false,
//             hasPrevPage: paginationData.hasPrevPage || false
//           });
//         } else {
//           // If no pagination from API, calculate from alerts array
//           const filteredAlerts = response.data.data.alerts || [];
//           setPagination(prev => ({
//             ...prev,
//             total: filteredAlerts.length,
//             pages: Math.ceil(filteredAlerts.length / limit),
//             currentPage: page,
//             limit: limit
//           }));
//         }
//       } else {
//         setError('Invalid response format from server');
//       }
//     } catch (err) {
//       console.error('Error fetching alerts:', err);
//       const errorMsg = showError(err);
//       setError(errorMsg || 'Failed to fetch stock alerts');
//     } finally {
//       setLoading(false);
//     }
//   }, [canViewStockAlert, hasViewPermission]);

//   // Initial data load
//   useEffect(() => {
//     if (canViewStockAlert || hasViewPermission) {
//       fetchAlerts(1, DEFAULT_LIMIT, '', '');
//     } else {
//       setLoading(false);
//       setError('You do not have permission to view stock alerts');
//     }
//   }, [fetchAlerts, canViewStockAlert, hasViewPermission]);

//   // Cleanup timer on unmount
//   useEffect(() => {
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, []);

//   // Handle search with debounce
//   const handleSearch = useCallback((value) => {
//     setSearchTerm(value);
    
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     searchTimer.current = setTimeout(() => {
//       fetchAlerts(1, pagination.limit, value, alertLevelFilter);
//     }, 500);
//   }, [fetchAlerts, pagination.limit, alertLevelFilter]);

//   const resetSearch = () => {
//     setSearchTerm('');
//     if (searchInputRef.current) {
//       searchInputRef.current.value = '';
//     }
//     setAlertLevelFilter('');
//     fetchAlerts(1, pagination.limit, '', '');
//   };

//   const handleAlertLevelFilter = (level) => {
//     setAlertLevelFilter(level);
//     setSearchTerm('');
//     if (searchInputRef.current) {
//       searchInputRef.current.value = '';
//     }
//     fetchAlerts(1, pagination.limit, '', level);
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     fetchAlerts(newPage, pagination.limit, searchTerm, alertLevelFilter);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleLimitChange = (newLimit) => {
//     fetchAlerts(1, parseInt(newLimit, 10), searchTerm, alertLevelFilter);
//   };

//   // View alert details - requires VIEW permission
//   const handleViewAlert = (alert) => {
//     // Check view permission before viewing details
//     if (!canPerformView) {
//       showError('You do not have permission to view alert details');
//       return;
//     }
//     setSelectedAlert(alert);
//     setAlertModalVisible(true);
//   };

//   // Format number with commas
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return '0';
//     return num.toLocaleString();
//   };

//   // Get alert badge
//   const getAlertBadge = (level) => {
//     const config = ALERT_CONFIG[level] || ALERT_CONFIG['INFO'];
//     return (
//       <CBadge color={config.color} className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
//         <CIcon icon={config.icon} size="sm" />
//         <span>{config.label}</span>
//       </CBadge>
//     );
//   };

//   // Get stock status color
//   const getStockStatusColor = (currentStock, safetyStockLevel) => {
//     if (currentStock <= safetyStockLevel / 2) return 'danger';
//     if (currentStock <= safetyStockLevel) return 'warning';
//     return 'success';
//   };

//   // Pagination calculations for display
//   const startRecord = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.currentPage * pagination.limit, pagination.total);

//   // Render pagination component
//   const renderPagination = () => {
//     if (pagination.total === 0 || pagination.pages <= 1) return null;
    
//     let startPage = Math.max(1, pagination.currentPage - 2);
//     let endPage = Math.min(pagination.pages, pagination.currentPage + 2);
    
//     if (pagination.currentPage <= 3) {
//       endPage = Math.min(5, pagination.pages);
//     }
//     if (pagination.currentPage >= pagination.pages - 2) {
//       startPage = Math.max(1, pagination.pages - 4);
//     }
    
//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
    
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
//               Rows per page:
//             </CFormLabel>
//             <CFormSelect
//               value={pagination.limit}
//               onChange={(e) => handleLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={loading}
//             >
//               {PAGE_SIZE_OPTIONS.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.total} alerts`}
//           </span>
//         </div>
        
//         {pagination.pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem
//               onClick={() => handlePageChange(1)}
//               disabled={pagination.currentPage === 1 || loading}
//             >
//               «
//             </CPaginationItem>
//             <CPaginationItem
//               onClick={() => handlePageChange(pagination.currentPage - 1)}
//               disabled={pagination.currentPage === 1 || loading}
//             >
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>
            
//             {startPage > 1 && (
//               <>
//                 <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>
//                   1
//                 </CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}
            
//             {pageNumbers.map(page => (
//               <CPaginationItem
//                 key={page}
//                 active={page === pagination.currentPage}
//                 onClick={() => handlePageChange(page)}
//                 disabled={loading}
//               >
//                 {page}
//               </CPaginationItem>
//             ))}
            
//             {endPage < pagination.pages && (
//               <>
//                 {endPage < pagination.pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem onClick={() => handlePageChange(pagination.pages)} disabled={loading}>
//                   {pagination.pages}
//                 </CPaginationItem>
//               </>
//             )}
            
//             <CPaginationItem
//               onClick={() => handlePageChange(pagination.currentPage + 1)}
//               disabled={pagination.currentPage === pagination.pages || loading}
//             >
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem
//               onClick={() => handlePageChange(pagination.pages)}
//               disabled={pagination.currentPage === pagination.pages || loading}
//             >
//               »
//             </CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   // If user doesn't have permission to view stock alerts, show access denied message
//   if (!canViewStockAlert && !hasViewPermission && !loading) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Stock Alerts.
//       </div>
//     );
//   }

//   if (loading && alerts.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="title">Low Stock Alerts</div>

//       {/* Summary Cards */}
//       {summary && canPerformView && (
//         <CRow className="mt-3 mb-4">
//           <CCol md={3} sm={6} className="mb-3">
//             <CCard className="text-center border-primary">
//               <CCardBody>
//                 <h5 className="text-muted mb-2">Total Alerts</h5>
//                 <h2 className="mb-0 text-primary">{summary.totalAlerts}</h2>
//                 <small className="text-muted">
//                   High: {summary.highAlerts} | Info: {summary.infoAlerts}
//                 </small>
//               </CCardBody>
//             </CCard>
//           </CCol>
//           <CCol md={3} sm={6} className="mb-3">
//             <CCard className="text-center border-warning">
//               <CCardBody>
//                 <h5 className="text-muted mb-2">Total Stock</h5>
//                 <h2 className="mb-0 text-warning">{formatNumber(summary.totalStockAcrossAlerts)}</h2>
//                 <small className="text-muted">Units across all alerts</small>
//               </CCardBody>
//             </CCard>
//           </CCol>
//           <CCol md={3} sm={6} className="mb-3">
//             <CCard className="text-center border-info">
//               <CCardBody>
//                 <h5 className="text-muted mb-2">Monthly Sales</h5>
//                 <h2 className="mb-0 text-info">{formatNumber(summary.totalMonthlySalesAcrossAlerts)}</h2>
//                 <small className="text-muted">Units sold last month</small>
//               </CCardBody>
//             </CCard>
//           </CCol>
//           <CCol md={3} sm={6} className="mb-3">
//             <CCard className="text-center border-success">
//               <CCardBody>
//                 <h5 className="text-muted mb-2">Stock Turnover</h5>
//                 <h2 className="mb-0 text-success">{summary.averageStockTurnover}</h2>
//                 <small className="text-muted">Average turnover rate</small>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       )}

//       <CCard className="table-container">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
//           {/* Filter buttons can be uncommented if needed */}
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0">Search:</CFormLabel>
//             <input
//               ref={searchInputRef}
//               type="text"
//               style={{ 
//                 width: '250px', 
//                 height: '32px', 
//                 borderRadius: '4px', 
//                 border: '1px solid #ced4da', 
//                 padding: '0 8px', 
//                 outline: 'none', 
//                 fontSize: '14px' 
//               }}
//               className="d-inline-block"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder="Search by model name, color..."
//               autoComplete="off"
//             />
//             {(searchTerm || alertLevelFilter) && (
//               <CButton size="sm" variant="outline" onClick={resetSearch}>
//                 <CIcon icon={cilZoomOut} className="me-1" /> Reset
//               </CButton>
//             )}
//             {loading && <CSpinner size="sm" color="primary" />}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           {error && <CAlert color="danger">{error}</CAlert>}

//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell className="text-end">Current Stock</CTableHeaderCell>
//                   <CTableHeaderCell className="text-end">Safety Stock</CTableHeaderCell>
//                   <CTableHeaderCell className="text-end">Monthly Sales</CTableHeaderCell>
//                   <CTableHeaderCell className="text-end">Days Until OOS</CTableHeaderCell>
//                   <CTableHeaderCell>Alert Level</CTableHeaderCell>
//                   <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {alerts.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center text-danger">
//                       {searchTerm ? `No alerts found matching "${searchTerm}"` : 'No stock alerts available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   alerts.map((alert, index) => {
//                     const stockStatusColor = getStockStatusColor(alert.currentStock, alert.safetyStockLevel);
//                     const progressPercentage = (alert.currentStock / alert.safetyStockLevel) * 100;
                    
//                     return (
//                       <CTableRow key={`${alert.modelId}-${alert.colorId}`}>
//                         <CTableDataCell>{startRecord + index}</CTableDataCell>
//                         <CTableDataCell>
//                           <strong>{alert.modelName}</strong>
//                         </CTableDataCell>
//                         <CTableDataCell>{alert.colorName}</CTableDataCell>
//                         <CTableDataCell className="text-end">
//                           <div className="d-flex flex-column">
//                             <span className={`fw-bold text-${stockStatusColor}`}>
//                               {alert.currentStock}
//                             </span>
//                             <CProgress 
//                               value={Math.min(progressPercentage, 100)} 
//                               color={stockStatusColor}
//                               style={{ height: '4px', width: '80px' }}
//                               className="mt-1"
//                             />
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell className="text-end text-muted">
//                           {alert.safetyStockLevel}
//                         </CTableDataCell>
//                         <CTableDataCell className="text-end">
//                           {formatNumber(alert.totalSoldLastMonth)}
//                         </CTableDataCell>
//                         <CTableDataCell className="text-end">
//                           <CBadge color={alert.estimatedDaysUntilOutOfStock <= 7 ? 'danger' : 'warning'}>
//                             {alert.estimatedDaysUntilOutOfStock} days
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {getAlertBadge(alert.alertLevel)}
//                         </CTableDataCell>
//                         <CTableDataCell className="text-center">
//                           {/* View Details button - requires VIEW permission */}
//                           {canPerformView && (
//                             <CButton 
//                               size="sm" 
//                               color="info" 
//                               variant="outline"
//                               onClick={() => handleViewAlert(alert)}
//                               title="View Alert Details"
//                             >
//                               View Details
//                             </CButton>
//                           )}
//                           {!canPerformView && (
//                             <CButton 
//                               size="sm" 
//                               color="secondary" 
//                               variant="outline"
//                               disabled
//                               title="You do not have permission to view alert details"
//                             >
//                               No Permission
//                             </CButton>
//                           )}
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {renderPagination()}
//         </CCardBody>
//       </CCard>

//       {/* Alert Details Modal - only shown if user has view permission */}
//       {canPerformView && (
//         <CModal 
//           visible={alertModalVisible} 
//           onClose={() => setAlertModalVisible(false)} 
//           size="lg"
//           scrollable
//         >
//           <CModalHeader>
//             <CModalTitle>
//               Stock Alert Details - {selectedAlert?.modelName}
//             </CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             {selectedAlert && (
//               <>
//                 {/* Alert Header */}
//                 <div className={`mb-3 p-3 rounded bg-${ALERT_CONFIG[selectedAlert.alertLevel]?.color || 'secondary'}-subtle`}>
//                   <div className="d-flex align-items-center gap-2 mb-2">
//                     <CIcon icon={ALERT_CONFIG[selectedAlert.alertLevel]?.icon || cilInfo} size="lg" />
//                     <h5 className="mb-0">{selectedAlert.alertMessage}</h5>
//                   </div>
//                 </div>

//                 {/* Stock Information */}
//                 <div className="mb-3 p-3 bg-light rounded">
//                   <h6 className="mb-3">
//                     <CIcon icon={cilChartLine} className="me-2" />
//                     Stock Information
//                   </h6>
//                   <CRow>
//                     <CCol md={4} sm={6}>
//                       <small className="text-muted">Model Name</small>
//                       <div className="fw-bold">{selectedAlert.modelName}</div>
//                     </CCol>
//                     <CCol md={4} sm={6}>
//                       <small className="text-muted">Color</small>
//                       <div className="fw-bold">{selectedAlert.colorName}</div>
//                     </CCol>
//                     <CCol md={4} sm={6}>
//                       <small className="text-muted">Alert Level</small>
//                       <div>{getAlertBadge(selectedAlert.alertLevel)}</div>
//                     </CCol>
//                     <CCol md={3} sm={6}>
//                       <small className="text-muted">Current Stock</small>
//                       <div className={`fw-bold text-${getStockStatusColor(selectedAlert.currentStock, selectedAlert.safetyStockLevel)}`}>
//                         {selectedAlert.currentStock} units
//                       </div>
//                     </CCol>
//                     <CCol md={3} sm={6}>
//                       <small className="text-muted">Safety Stock Level</small>
//                       <div className="fw-bold">{selectedAlert.safetyStockLevel} units</div>
//                     </CCol>
//                     <CCol md={3} sm={6}>
//                       <small className="text-muted">Reorder Point</small>
//                       <div className="fw-bold">{selectedAlert.reorderPoint} units</div>
//                     </CCol>
//                     <CCol md={3} sm={6}>
//                       <small className="text-muted">Stock Status</small>
//                       <div>
//                         <CBadge color={getStockStatusColor(selectedAlert.currentStock, selectedAlert.safetyStockLevel)}>
//                           {selectedAlert.currentStock <= selectedAlert.safetyStockLevel ? 'Below Safety Stock' : 'Above Safety Stock'}
//                         </CBadge>
//                       </div>
//                     </CCol>
//                   </CRow>
//                 </div>

//                 {/* Sales Information */}
//                 <div className="mb-3 p-3 bg-light rounded">
//                   <h6 className="mb-3">
//                     <CIcon icon={cilCalculator} className="me-2" />
//                     Sales Analysis
//                   </h6>
//                   <CRow>
//                     <CCol md={4} sm={6}>
//                       <small className="text-muted">Total Sold (Last Month)</small>
//                       <div className="fw-bold text-info">{formatNumber(selectedAlert.totalSoldLastMonth)} units</div>
//                     </CCol>
//                     <CCol md={4} sm={6}>
//                       <small className="text-muted">Average Daily Sales</small>
//                       <div className="fw-bold">{selectedAlert.averageDailySales?.toFixed(2)} units/day</div>
//                     </CCol>
//                     <CCol md={4} sm={6}>
//                       <small className="text-muted">Est. Days Until Out of Stock</small>
//                       <div className={`fw-bold ${selectedAlert.estimatedDaysUntilOutOfStock <= 7 ? 'text-danger' : 'text-warning'}`}>
//                         {selectedAlert.estimatedDaysUntilOutOfStock} days
//                       </div>
//                     </CCol>
//                   </CRow>
//                 </div>

//                 {/* Recommendation */}
//                 <div className="mb-3 p-3 bg-light rounded">
//                   <h6 className="mb-3">
//                     <CIcon icon={cilCart} className="me-2" />
//                     Recommendation
//                   </h6>
//                   <div className="p-2 bg-white rounded border">
//                     <CIcon icon={cilInfo} className="me-2 text-info" />
//                     {selectedAlert.recommendation}
//                   </div>
//                 </div>

//                 {/* Scenario */}
//                 {selectedAlert.scenario && (
//                   <div className="mb-3 p-3 bg-light rounded">
//                     <h6 className="mb-3">Analysis Scenario</h6>
//                     <div className="p-2 bg-white rounded border text-muted small">
//                       {selectedAlert.scenario}
//                     </div>
//                   </div>
//                 )}

//                 {/* Progress Bar for Stock Level */}
//                 <div className="mb-3 p-3 bg-light rounded">
//                   <h6 className="mb-3">Stock Level vs Safety Stock</h6>
//                   <div className="d-flex align-items-center gap-3">
//                     <div style={{ flex: 1 }}>
//                       <CProgress
//                         value={(selectedAlert.currentStock / selectedAlert.safetyStockLevel) * 100}
//                         color={getStockStatusColor(selectedAlert.currentStock, selectedAlert.safetyStockLevel)}
//                         style={{ height: '20px' }}
//                       />
//                     </div>
//                     <div className="text-center" style={{ minWidth: '100px' }}>
//                       <small className="text-muted">Safety Stock</small>
//                       <div className="fw-bold">{selectedAlert.safetyStockLevel} units</div>
//                     </div>
//                   </div>
//                   <div className="mt-2 text-center">
//                     <small className="text-muted">Current Stock: {selectedAlert.currentStock} units</small>
//                   </div>
//                 </div>
//               </>
//             )}
//           </CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={() => setAlertModalVisible(false)}>
//               Close
//             </CButton>
//           </CModalFooter>
//         </CModal>
//       )}
//     </div>
//   );
// };

// export default StockAlert;