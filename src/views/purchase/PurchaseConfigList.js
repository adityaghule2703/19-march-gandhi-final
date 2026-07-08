import React, { useState, useEffect, useRef } from 'react';
import '../../css/table.css';
import '../../css/form.css';
import {
  axiosInstance,
  showError,
  showSuccess
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilInfo,
  cilBell,
  cilChartLine,
  cilCloudDownload,
  cilCalendar,
  cilTask,
  cilMoney,
  cilWarning,
  cilCheckCircle,
  cilX,
  cilZoom,
  cilTrash
} from '@coreui/icons';
import { Menu, MenuItem } from '@mui/material';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const PurchaseConfigList = () => {
  const [activeTab, setActiveTab] = useState('both');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuConfigId, setMenuConfigId] = useState(null);
  
  // Data state
  const [configs, setConfigs] = useState([]);
  const [summary, setSummary] = useState({
    totalConfigs: 0,
    globalConfigs: 0,
    branchConfigs: 0,
    modelConfigs: 0,
    thirtyDayConfigs: 0,
    hundredTwentyDayConfigs: 0
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);
  const searchInputRef = useRef(null);
  const activeTabRef = useRef(activeTab);
  
  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  // Fetch data when tab or pagination changes
  useEffect(() => {
    fetchConfigs();
  }, [pagination.page, pagination.limit, activeTab]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchConfigs(1, pagination.limit, searchTerm);
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchConfigs = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (activeTab !== 'both') {
        params.append('configType', activeTab === 'thirtyDay' ? '30_DAYS' : '120_DAYS');
      }
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/low-stock/configurations?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setConfigs(response.data.data || []);
        setPagination({
          page: page,
          limit: limit,
          totalCount: response.data.count || response.data.data.length,
          totalPages: Math.ceil((response.data.count || response.data.data.length) / limit)
        });
        
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching configurations:', error);
      setError(error.response?.data?.message || 'Failed to fetch configurations');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchTerm('');
    if (searchInputRef.current) searchInputRef.current.value = '';
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

  const handleMenuClick = (event, configId) => {
    setAnchorEl(event.currentTarget);
    setMenuConfigId(configId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConfigId(null);
  };

  const handleViewDetails = (config) => {
    setSelectedConfig(config);
    setViewModalVisible(true);
    handleMenuClose();
  };

  const handleDeleteClick = (config) => {
    setConfigToDelete(config);
    setDeleteModalVisible(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!configToDelete) return;
    
    try {
      const response = await axiosInstance.delete(`/low-stock/config/${configToDelete._id}`);
      if (response.data.success) {
        showSuccess('Configuration deleted successfully!');
        fetchConfigs(1, pagination.limit, searchTerm);
        setDeleteModalVisible(false);
        setConfigToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      showError(error.response?.data?.message || 'Failed to delete configuration');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getConfigTypeBadge = (configType) => {
    switch (configType) {
      case 'BOTH':
        return <CBadge color="primary">Both</CBadge>;
      case '30_DAYS':
        return <CBadge color="info">30 Days</CBadge>;
      case '120_DAYS':
        return <CBadge color="success">120 Days</CBadge>;
      default:
        return <CBadge color="secondary">{configType}</CBadge>;
    }
  };

  const getReorderMethodBadge = (method) => {
    switch (method) {
      case 'PERCENTAGE':
        return <CBadge color="info">Percentage</CBadge>;
      case 'ABSOLUTE':
        return <CBadge color="warning">Absolute</CBadge>;
      case 'DAYS_OF_INVENTORY':
        return <CBadge color="primary">Days of Inventory</CBadge>;
      case 'SMART':
        return <CBadge color="success">Smart</CBadge>;
      default:
        return <CBadge color="secondary">{method || '-'}</CBadge>;
    }
  };

  const getAlertLevelBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <CBadge color="danger">Critical</CBadge>;
      case 'HIGH':
        return <CBadge color="warning">High</CBadge>;
      case 'MEDIUM':
        return <CBadge color="info">Medium</CBadge>;
      case 'INFO':
        return <CBadge color="secondary">Info</CBadge>;
      default:
        return <CBadge color="secondary">{level || '-'}</CBadge>;
    }
  };

  // Pagination calculation
  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);
  
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  if (pagination.page <= 3) endPage = Math.min(5, pagination.totalPages);
  if (pagination.page >= pagination.totalPages - 2) startPage = Math.max(1, pagination.totalPages - 4);
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

  // Render pagination component
  const renderPagination = () => {
    if (!pagination.totalCount || pagination.totalPages <= 1) return null;

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={pagination.limit}
              onChange={e => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} entries`}
          </span>
        </div>
        {pagination.totalPages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={pagination.page === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {displayedPages.map(p => (
              <CPaginationItem key={p} active={p === pagination.page} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}

            {endPage < pagination.totalPages && (
              <>
                {endPage < pagination.totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={loading}>{pagination.totalPages}</CPaginationItem>
              </>
            )}

            <CPaginationItem onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // Render main table based on active tab
  const renderTable = () => {
    const currentRecords = configs;
    
    return (
      <>
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
                <CTableHeaderCell>Model Name</CTableHeaderCell>
                <CTableHeaderCell>Config Type</CTableHeaderCell>
                <CTableHeaderCell>Reorder Method</CTableHeaderCell>
                <CTableHeaderCell>Auto Reorder</CTableHeaderCell>
                <CTableHeaderCell>Min Alert Level</CTableHeaderCell>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableHeaderCell>Created By</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={9} style={{ color: 'red', textAlign: 'center' }}>
                    {searchTerm ? `No results found for "${searchTerm}"` : 'No configurations found.'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((config, index) => {
                  const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                  const modelName = config.modelId?.model_name || config.modelId?.name || '-';
                  const isAutoReorderEnabled = config.settings?.autoReorder?.enabled || false;
                  const reorderMethod = config.configType === '30_DAYS' 
                    ? config.settings?.thirtyDayConfig?.reorderMethod 
                    : config.settings?.hundredTwentyDayConfig?.reorderMethod;
                  
                  return (
                    <CTableRow key={config._id}>
                      <CTableDataCell>{globalIndex}</CTableDataCell>
                      <CTableDataCell><strong>{modelName}</strong></CTableDataCell>
                      <CTableDataCell>{getConfigTypeBadge(config.configType)}</CTableDataCell>
                      <CTableDataCell>{getReorderMethodBadge(reorderMethod)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={isAutoReorderEnabled ? 'success' : 'secondary'}>
                          {isAutoReorderEnabled ? 'Enabled' : 'Disabled'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getAlertLevelBadge(config.settings?.notifications?.minimumAlertLevel)}
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(config.createdAt)}</CTableDataCell>
                      <CTableDataCell>{config.createdBy?.name || '-'}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(e) => handleMenuClick(e, config._id)}
                        >
                          <CIcon icon={cilOptions} /> Options
                        </CButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={menuConfigId === config._id}
                          onClose={handleMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <MenuItem onClick={() => handleViewDetails(config)}>
                            <CIcon icon={cilZoom} className="me-2" /> View Details
                          </MenuItem>
                          <MenuItem onClick={() => handleDeleteClick(config)}>
                            <CIcon icon={cilTrash} className="me-2" /> Delete
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
        {renderPagination()}
      </>
    );
  };

  if (error && configs.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Purchase Order Configurations</div>

      

      <CCard className='table-container mt-2'>
        <CCardBody>
          {/* Tabs */}
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'both'}
                onClick={() => handleTabChange('both')}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === 'both' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                All
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'thirtyDay'}
                onClick={() => handleTabChange('thirtyDay')}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === 'thirtyDay' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                30 Days
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'hundredTwentyDay'}
                onClick={() => handleTabChange('hundredTwentyDay')}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === 'hundredTwentyDay' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                120 Days
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* Search Bar */}
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <input
                ref={searchInputRef}
                type="text"
                defaultValue=""
                style={{
                  maxWidth: '350px',
                  height: '30px',
                  borderRadius: '0',
                  border: '1px solid #ced4da',
                  padding: '0 8px',
                  outline: 'none',
                  fontSize: '14px'
                }}
                className="d-inline-block square-search"
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by model name..."
                autoComplete="off"
              />
            </div>
          </div>

          {/* Tab Content */}
          <CTabContent>
            <CTabPane visible={activeTab === 'both'}>
              {activeTab === 'both' && renderTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'thirtyDay'}>
              {activeTab === 'thirtyDay' && renderTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'hundredTwentyDay'}>
              {activeTab === 'hundredTwentyDay' && renderTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* View Details Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilInfo} className="me-2" />
            Configuration Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedConfig && (
            <div>
              <h6>Model: {selectedConfig.modelId?.model_name || selectedConfig.modelId?.name || '-'}</h6>
              <p className="text-muted">Config Type: {selectedConfig.configType}</p>
              
              <hr />
              
              {/* 30-Day Config */}
              {(selectedConfig.configType === 'BOTH' || selectedConfig.configType === '30_DAYS') && (
                <>
                  <h6 className="mt-3"><CIcon icon={cilCalendar} className="me-2" />30-Day Configuration</h6>
                  <div className="row mb-3">
                    <div className="col-md-6"><small className="text-muted">Safety Stock Percentage</small><div><strong>{selectedConfig.settings?.thirtyDayConfig?.safetyStockPercentage || 0}%</strong></div></div>
                    <div className="col-md-6"><small className="text-muted">Lead Time Days</small><div><strong>{selectedConfig.settings?.thirtyDayConfig?.leadTimeDays || 0} days</strong></div></div>
                    <div className="col-md-6 mt-2"><small className="text-muted">Min Stock Level</small><div><strong>{selectedConfig.settings?.thirtyDayConfig?.minStockLevel || 0} units</strong></div></div>
                    <div className="col-md-6 mt-2"><small className="text-muted">Reorder Method</small><div>{getReorderMethodBadge(selectedConfig.settings?.thirtyDayConfig?.reorderMethod)}</div></div>
                    <div className="col-md-12 mt-2"><small className="text-muted">Alert Thresholds</small><div>Critical: {selectedConfig.settings?.thirtyDayConfig?.alertThresholds?.critical || 0} | High: {selectedConfig.settings?.thirtyDayConfig?.alertThresholds?.high || 0} | Medium: {selectedConfig.settings?.thirtyDayConfig?.alertThresholds?.medium || 0}</div></div>
                  </div>
                </>
              )}
              
              {/* 120-Day Config */}
              {(selectedConfig.configType === 'BOTH' || selectedConfig.configType === '120_DAYS') && (
                <>
                  <h6 className="mt-3"><CIcon icon={cilChartLine} className="me-2" />120-Day Configuration</h6>
                  <div className="row mb-3">
                    <div className="col-md-6"><small className="text-muted">Trend Analysis Days</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.trendAnalysisDays || 0} days</strong></div></div>
                    <div className="col-md-6"><small className="text-muted">Safety Stock Percentage</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.safetyStockPercentage || 0}%</strong></div></div>
                    <div className="col-md-6 mt-2"><small className="text-muted">Lead Time Days</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.leadTimeDays || 0} days</strong></div></div>
                    <div className="col-md-6 mt-2"><small className="text-muted">Min Stock Level</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.minStockLevel || 0} units</strong></div></div>
                    <div className="col-md-6 mt-2"><small className="text-muted">Reorder Method</small><div>{getReorderMethodBadge(selectedConfig.settings?.hundredTwentyDayConfig?.reorderMethod)}</div></div>
                    <div className="col-md-6 mt-2"><small className="text-muted">Trend Weight</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.trendWeight || 0}</strong></div></div>
                    <div className="col-md-12 mt-2"><small className="text-muted">Seasonal Adjustment</small><div><CBadge color={selectedConfig.settings?.hundredTwentyDayConfig?.seasonalAdjustment ? 'success' : 'secondary'}>{selectedConfig.settings?.hundredTwentyDayConfig?.seasonalAdjustment ? 'Enabled' : 'Disabled'}</CBadge></div></div>
                    <div className="col-md-12 mt-2"><small className="text-muted">Alert Thresholds</small><div>Critical: {selectedConfig.settings?.hundredTwentyDayConfig?.alertThresholds?.critical || 0} | High: {selectedConfig.settings?.hundredTwentyDayConfig?.alertThresholds?.high || 0} | Medium: {selectedConfig.settings?.hundredTwentyDayConfig?.alertThresholds?.medium || 0}</div></div>
                  </div>
                </>
              )}
              
              {/* Auto Reorder Settings */}
              <h6 className="mt-3"><CIcon icon={cilCloudDownload} className="me-2" />Auto Reorder Settings</h6>
              <div className="row mb-3">
                <div className="col-md-6"><small className="text-muted">Status</small><div><CBadge color={selectedConfig.settings?.autoReorder?.enabled ? 'success' : 'secondary'}>{selectedConfig.settings?.autoReorder?.enabled ? 'Enabled' : 'Disabled'}</CBadge></div></div>
                <div className="col-md-6"><small className="text-muted">Reorder Frequency</small><div><strong>{selectedConfig.settings?.autoReorder?.reorderFrequency || '-'}</strong></div></div>
                <div className="col-md-6 mt-2"><small className="text-muted">Min Order Quantity</small><div><strong>{selectedConfig.settings?.autoReorder?.minOrderQuantity || 0} units</strong></div></div>
                <div className="col-md-6 mt-2"><small className="text-muted">Max Order Quantity</small><div><strong>{selectedConfig.settings?.autoReorder?.maxOrderQuantity || 0} units</strong></div></div>
              </div>
              
              {/* Notification Settings */}
              <h6 className="mt-3"><CIcon icon={cilBell} className="me-2" />Notification Settings</h6>
              <div className="row mb-3">
                <div className="col-md-4"><small className="text-muted">Email Alerts</small><div><CBadge color={selectedConfig.settings?.notifications?.emailAlerts ? 'success' : 'secondary'}>{selectedConfig.settings?.notifications?.emailAlerts ? 'Enabled' : 'Disabled'}</CBadge></div></div>
                <div className="col-md-4"><small className="text-muted">Dashboard Alerts</small><div><CBadge color={selectedConfig.settings?.notifications?.dashboardAlerts ? 'success' : 'secondary'}>{selectedConfig.settings?.notifications?.dashboardAlerts ? 'Enabled' : 'Disabled'}</CBadge></div></div>
                <div className="col-md-4"><small className="text-muted">Minimum Alert Level</small><div>{getAlertLevelBadge(selectedConfig.settings?.notifications?.minimumAlertLevel)}</div></div>
              </div>
              
              {/* Metadata */}
              <hr />
              <div className="row">
                <div className="col-md-6"><small className="text-muted">Created By</small><div><strong>{selectedConfig.createdBy?.name || '-'}</strong></div><small className="text-muted">Created At</small><div><strong>{formatDate(selectedConfig.createdAt)}</strong></div></div>
                <div className="col-md-6"><small className="text-muted">Updated By</small><div><strong>{selectedConfig.updatedBy?.name || '-'}</strong></div><small className="text-muted">Updated At</small><div><strong>{formatDate(selectedConfig.updatedAt)}</strong></div></div>
                {selectedConfig.notes && <div className="col-md-12 mt-2"><small className="text-muted">Notes</small><div><strong>{selectedConfig.notes}</strong></div></div>}
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader><CModalTitle>Confirm Delete</CModalTitle></CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this configuration for <strong>{configToDelete?.modelId?.model_name || configToDelete?.modelId?.name}</strong>?</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}><CIcon icon={cilTrash} className="me-1" />Delete</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PurchaseConfigList;




// import React, { useState, useEffect, useRef } from 'react';
// import '../../css/table.css';
// import '../../css/form.css';
// import {
//   axiosInstance,
//   showError,
//   showSuccess
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
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CPagination,
//   CPaginationItem,
//   CFormSelect,
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilOptions,
//   cilChevronLeft,
//   cilChevronRight,
//   cilInfo,
//   cilBell,
//   cilChartLine,
//   cilCloudDownload,
//   cilCalendar,
//   cilTask,
//   cilMoney,
//   cilWarning,
//   cilCheckCircle,
//   cilX,
//   cilZoom,
//   cilTrash
// } from '@coreui/icons';
// import { Menu, MenuItem } from '@mui/material';
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

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const PurchaseConfigList = () => {
//   const [activeTab, setActiveTab] = useState('both');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Menu state
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuConfigId, setMenuConfigId] = useState(null);
  
//   // Data state
//   const [configs, setConfigs] = useState([]);
//   const [summary, setSummary] = useState({
//     totalConfigs: 0,
//     globalConfigs: 0,
//     branchConfigs: 0,
//     modelConfigs: 0,
//     thirtyDayConfigs: 0,
//     hundredTwentyDayConfigs: 0
//   });
  
//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: DEFAULT_LIMIT,
//     totalCount: 0,
//     totalPages: 1
//   });
  
//   // Search state
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchTimer = useRef(null);
//   const searchInputRef = useRef(null);
//   const activeTabRef = useRef(activeTab);
  
//   // Modal states
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedConfig, setSelectedConfig] = useState(null);
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [configToDelete, setConfigToDelete] = useState(null);

//   const { permissions = [] } = useAuth();

//   // Permission checks for Purchase module - Purchase Config List page
//   // Using PAGES.PURCHASE constants for page-level permissions
//   const canViewPurchaseConfigList = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.PURCHASE_CONFIG_LIST);
//   const canDeletePurchaseConfigList = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.PURCHASE_CONFIG_LIST);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasViewPermission = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.PURCHASE_CONFIG_LIST, 
//     ACTIONS.VIEW
//   );
  
//   const hasDeletePermission = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.PURCHASE_CONFIG_LIST, 
//     ACTIONS.DELETE
//   );
  
//   // Combined permission checks
//   const canPerformView = canViewPurchaseConfigList || hasViewPermission;
//   const canPerformDelete = canDeletePurchaseConfigList || hasDeletePermission;

//   useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

//   // Fetch data when tab or pagination changes
//   useEffect(() => {
//     if (canViewPurchaseConfigList) {
//       fetchConfigs();
//     }
//   }, [pagination.page, pagination.limit, activeTab]);

//   // Debounced search
//   useEffect(() => {
//     if (!canViewPurchaseConfigList) return;
    
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchConfigs(1, pagination.limit, searchTerm);
//     }, 400);
    
//     return () => clearTimeout(searchTimer.current);
//   }, [searchTerm]);

//   const fetchConfigs = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     // Check if user has permission to view purchase config list
//     if (!canViewPurchaseConfigList) {
//       setError('You do not have permission to view Purchase Config List');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
      
//       if (activeTab !== 'both') {
//         params.append('configType', activeTab === 'thirtyDay' ? '30_DAYS' : '120_DAYS');
//       }
      
//       if (search && search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       const url = `/low-stock/configurations?${params.toString()}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setConfigs(response.data.data || []);
//         setPagination({
//           page: page,
//           limit: limit,
//           totalCount: response.data.count || response.data.data.length,
//           totalPages: Math.ceil((response.data.count || response.data.data.length) / limit)
//         });
        
//         if (response.data.summary) {
//           setSummary(response.data.summary);
//         }
//       }
      
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching configurations:', error);
//       setError(error.response?.data?.message || 'Failed to fetch configurations');
//       showError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setPagination(prev => ({ ...prev, page: 1 }));
//     setSearchTerm('');
//     if (searchInputRef.current) searchInputRef.current.value = '';
//   };

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

//   const handleMenuClick = (event, configId) => {
//     setAnchorEl(event.currentTarget);
//     setMenuConfigId(configId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMenuConfigId(null);
//   };

//   const handleViewDetails = (config) => {
//     // Check view permission before viewing details
//     if (!canPerformView) {
//       showError('You do not have permission to view configuration details');
//       return;
//     }
//     setSelectedConfig(config);
//     setViewModalVisible(true);
//     handleMenuClose();
//   };

//   const handleDeleteClick = (config) => {
//     // Check delete permission before deleting
//     if (!canPerformDelete) {
//       showError('You do not have permission to delete configurations');
//       return;
//     }
//     setConfigToDelete(config);
//     setDeleteModalVisible(true);
//     handleMenuClose();
//   };

//   const handleDeleteConfirm = async () => {
//     if (!configToDelete) return;
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         const response = await axiosInstance.delete(`/low-stock/config/${configToDelete._id}`);
//         if (response.data.success) {
//           showSuccess('Configuration deleted successfully!');
//           fetchConfigs(1, pagination.limit, searchTerm);
//           setDeleteModalVisible(false);
//           setConfigToDelete(null);
//         }
//       } catch (error) {
//         console.error('Error deleting config:', error);
//         showError(error.response?.data?.message || 'Failed to delete configuration');
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const getConfigTypeBadge = (configType) => {
//     switch (configType) {
//       case 'BOTH':
//         return <CBadge color="primary">Both</CBadge>;
//       case '30_DAYS':
//         return <CBadge color="info">30 Days</CBadge>;
//       case '120_DAYS':
//         return <CBadge color="success">120 Days</CBadge>;
//       default:
//         return <CBadge color="secondary">{configType}</CBadge>;
//     }
//   };

//   const getReorderMethodBadge = (method) => {
//     switch (method) {
//       case 'PERCENTAGE':
//         return <CBadge color="info">Percentage</CBadge>;
//       case 'ABSOLUTE':
//         return <CBadge color="warning">Absolute</CBadge>;
//       case 'DAYS_OF_INVENTORY':
//         return <CBadge color="primary">Days of Inventory</CBadge>;
//       case 'SMART':
//         return <CBadge color="success">Smart</CBadge>;
//       default:
//         return <CBadge color="secondary">{method || '-'}</CBadge>;
//     }
//   };

//   const getAlertLevelBadge = (level) => {
//     switch (level) {
//       case 'CRITICAL':
//         return <CBadge color="danger">Critical</CBadge>;
//       case 'HIGH':
//         return <CBadge color="warning">High</CBadge>;
//       case 'MEDIUM':
//         return <CBadge color="info">Medium</CBadge>;
//       case 'INFO':
//         return <CBadge color="secondary">Info</CBadge>;
//       default:
//         return <CBadge color="secondary">{level || '-'}</CBadge>;
//     }
//   };

//   // Pagination calculation
//   const startRecord = (pagination.page - 1) * pagination.limit + 1;
//   const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);
  
//   let startPage = Math.max(1, pagination.page - 2);
//   let endPage = Math.min(pagination.totalPages, pagination.page + 2);
//   if (pagination.page <= 3) endPage = Math.min(5, pagination.totalPages);
//   if (pagination.page >= pagination.totalPages - 2) startPage = Math.max(1, pagination.totalPages - 4);
  
//   const displayedPages = [];
//   for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

//   // Render pagination component
//   const renderPagination = () => {
//     if (!pagination.totalCount || pagination.totalPages <= 1) return null;

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
//             <CFormSelect
//               value={pagination.limit}
//               onChange={e => handleLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={loading}
//             >
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} entries`}
//           </span>
//         </div>
//         {pagination.totalPages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => handlePageChange(1)} disabled={pagination.page === 1 || loading}>«</CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>

//             {startPage > 1 && (
//               <>
//                 <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}

//             {displayedPages.map(p => (
//               <CPaginationItem key={p} active={p === pagination.page} onClick={() => handlePageChange(p)} disabled={loading}>
//                 {p}
//               </CPaginationItem>
//             ))}

//             {endPage < pagination.totalPages && (
//               <>
//                 {endPage < pagination.totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={loading}>{pagination.totalPages}</CPaginationItem>
//               </>
//             )}

//             <CPaginationItem onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages || loading}>»</CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   // If user doesn't have permission to view purchase config list, show access denied message
//   if (!canViewPurchaseConfigList) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Purchase Config List.
//       </div>
//     );
//   }

//   // Render main table based on active tab
//   const renderTable = () => {
//     const currentRecords = configs;
    
//     return (
//       <>
//         {loading && (
//           <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//             <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//           </div>
//         )}
//         <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                 <CTableHeaderCell>Config Type</CTableHeaderCell>
//                 <CTableHeaderCell>Reorder Method</CTableHeaderCell>
//                 <CTableHeaderCell>Auto Reorder</CTableHeaderCell>
//                 <CTableHeaderCell>Min Alert Level</CTableHeaderCell>
//                 <CTableHeaderCell>Created At</CTableHeaderCell>
//                 <CTableHeaderCell>Created By</CTableHeaderCell>
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {currentRecords.length === 0 && !loading ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={9} style={{ color: 'red', textAlign: 'center' }}>
//                     {searchTerm ? `No results found for "${searchTerm}"` : 'No configurations found.'}
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 currentRecords.map((config, index) => {
//                   const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                   const modelName = config.modelId?.model_name || config.modelId?.name || '-';
//                   const isAutoReorderEnabled = config.settings?.autoReorder?.enabled || false;
//                   const reorderMethod = config.configType === '30_DAYS' 
//                     ? config.settings?.thirtyDayConfig?.reorderMethod 
//                     : config.settings?.hundredTwentyDayConfig?.reorderMethod;
                  
//                   return (
//                     <CTableRow key={config._id}>
//                       <CTableDataCell>{globalIndex}</CTableDataCell>
//                       <CTableDataCell><strong>{modelName}</strong></CTableDataCell>
//                       <CTableDataCell>{getConfigTypeBadge(config.configType)}</CTableDataCell>
//                       <CTableDataCell>{getReorderMethodBadge(reorderMethod)}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={isAutoReorderEnabled ? 'success' : 'secondary'}>
//                           {isAutoReorderEnabled ? 'Enabled' : 'Disabled'}
//                         </CBadge>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {getAlertLevelBadge(config.settings?.notifications?.minimumAlertLevel)}
//                       </CTableDataCell>
//                       <CTableDataCell>{formatDate(config.createdAt)}</CTableDataCell>
//                       <CTableDataCell>{config.createdBy?.name || '-'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CButton
//                           size="sm"
//                           className='option-button btn-sm'
//                           onClick={(e) => handleMenuClick(e, config._id)}
//                         >
//                           <CIcon icon={cilOptions} /> Options
//                         </CButton>
//                         <Menu
//                           anchorEl={anchorEl}
//                           open={menuConfigId === config._id}
//                           onClose={handleMenuClose}
//                           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                           transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//                         >
//                           {/* View Details option - requires VIEW permission */}
//                           {canPerformView && (
//                             <MenuItem onClick={() => handleViewDetails(config)}>
//                               <CIcon icon={cilZoom} className="me-2" /> View Details
//                             </MenuItem>
//                           )}
                          
//                           {/* Delete option - requires DELETE permission */}
//                           {canPerformDelete && (
//                             <MenuItem onClick={() => handleDeleteClick(config)}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}
                          
//                           {!canPerformView && !canPerformDelete && (
//                             <MenuItem disabled>
//                               No actions available
//                             </MenuItem>
//                           )}
//                         </Menu>
//                       </CTableDataCell>
//                     </CTableRow>
//                   );
//                 })
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination()}
//       </>
//     );
//   };

//   if (error && configs.length === 0) {
//     return <div className="alert alert-danger m-3">{error}</div>;
//   }

//   return (
//     <div>
//       <div className='title'>Purchase Order Configurations</div>

//       <CCard className='table-container mt-2'>
//         <CCardBody>
//           {/* Tabs */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'both'}
//                 onClick={() => handleTabChange('both')}
//                 style={{
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'both' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 All
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'thirtyDay'}
//                 onClick={() => handleTabChange('thirtyDay')}
//                 style={{
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'thirtyDay' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 30 Days
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 'hundredTwentyDay'}
//                 onClick={() => handleTabChange('hundredTwentyDay')}
//                 style={{
//                   cursor: 'pointer',
//                   borderTop: activeTab === 'hundredTwentyDay' ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 120 Days
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           {/* Search Bar */}
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 defaultValue=""
//                 style={{
//                   maxWidth: '350px',
//                   height: '30px',
//                   borderRadius: '0',
//                   border: '1px solid #ced4da',
//                   padding: '0 8px',
//                   outline: 'none',
//                   fontSize: '14px'
//                 }}
//                 className="d-inline-block square-search"
//                 onChange={e => handleSearch(e.target.value)}
//                 placeholder="Search by model name..."
//                 autoComplete="off"
//               />
//             </div>
//           </div>

//           {/* Tab Content */}
//           <CTabContent>
//             <CTabPane visible={activeTab === 'both'}>
//               {activeTab === 'both' && renderTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 'thirtyDay'}>
//               {activeTab === 'thirtyDay' && renderTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 'hundredTwentyDay'}>
//               {activeTab === 'hundredTwentyDay' && renderTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* View Details Modal */}
//       <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} scrollable>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilInfo} className="me-2" />
//             Configuration Details
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedConfig && (
//             <div>
//               <h6>Model: {selectedConfig.modelId?.model_name || selectedConfig.modelId?.name || '-'}</h6>
//               <p className="text-muted">Config Type: {selectedConfig.configType}</p>
              
//               <hr />
              
//               {/* 30-Day Config */}
//               {(selectedConfig.configType === 'BOTH' || selectedConfig.configType === '30_DAYS') && (
//                 <>
//                   <h6 className="mt-3"><CIcon icon={cilCalendar} className="me-2" />30-Day Configuration</h6>
//                   <div className="row mb-3">
//                     <div className="col-md-6"><small className="text-muted">Safety Stock Percentage</small><div><strong>{selectedConfig.settings?.thirtyDayConfig?.safetyStockPercentage || 0}%</strong></div></div>
//                     <div className="col-md-6"><small className="text-muted">Lead Time Days</small><div><strong>{selectedConfig.settings?.thirtyDayConfig?.leadTimeDays || 0} days</strong></div></div>
//                     <div className="col-md-6 mt-2"><small className="text-muted">Min Stock Level</small><div><strong>{selectedConfig.settings?.thirtyDayConfig?.minStockLevel || 0} units</strong></div></div>
//                     <div className="col-md-6 mt-2"><small className="text-muted">Reorder Method</small><div>{getReorderMethodBadge(selectedConfig.settings?.thirtyDayConfig?.reorderMethod)}</div></div>
//                     <div className="col-md-12 mt-2"><small className="text-muted">Alert Thresholds</small><div>Critical: {selectedConfig.settings?.thirtyDayConfig?.alertThresholds?.critical || 0} | High: {selectedConfig.settings?.thirtyDayConfig?.alertThresholds?.high || 0} | Medium: {selectedConfig.settings?.thirtyDayConfig?.alertThresholds?.medium || 0}</div></div>
//                   </div>
//                 </>
//               )}
              
//               {/* 120-Day Config */}
//               {(selectedConfig.configType === 'BOTH' || selectedConfig.configType === '120_DAYS') && (
//                 <>
//                   <h6 className="mt-3"><CIcon icon={cilChartLine} className="me-2" />120-Day Configuration</h6>
//                   <div className="row mb-3">
//                     <div className="col-md-6"><small className="text-muted">Trend Analysis Days</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.trendAnalysisDays || 0} days</strong></div></div>
//                     <div className="col-md-6"><small className="text-muted">Safety Stock Percentage</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.safetyStockPercentage || 0}%</strong></div></div>
//                     <div className="col-md-6 mt-2"><small className="text-muted">Lead Time Days</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.leadTimeDays || 0} days</strong></div></div>
//                     <div className="col-md-6 mt-2"><small className="text-muted">Min Stock Level</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.minStockLevel || 0} units</strong></div></div>
//                     <div className="col-md-6 mt-2"><small className="text-muted">Reorder Method</small><div>{getReorderMethodBadge(selectedConfig.settings?.hundredTwentyDayConfig?.reorderMethod)}</div></div>
//                     <div className="col-md-6 mt-2"><small className="text-muted">Trend Weight</small><div><strong>{selectedConfig.settings?.hundredTwentyDayConfig?.trendWeight || 0}</strong></div></div>
//                     <div className="col-md-12 mt-2"><small className="text-muted">Seasonal Adjustment</small><div><CBadge color={selectedConfig.settings?.hundredTwentyDayConfig?.seasonalAdjustment ? 'success' : 'secondary'}>{selectedConfig.settings?.hundredTwentyDayConfig?.seasonalAdjustment ? 'Enabled' : 'Disabled'}</CBadge></div></div>
//                     <div className="col-md-12 mt-2"><small className="text-muted">Alert Thresholds</small><div>Critical: {selectedConfig.settings?.hundredTwentyDayConfig?.alertThresholds?.critical || 0} | High: {selectedConfig.settings?.hundredTwentyDayConfig?.alertThresholds?.high || 0} | Medium: {selectedConfig.settings?.hundredTwentyDayConfig?.alertThresholds?.medium || 0}</div></div>
//                   </div>
//                 </>
//               )}
              
//               {/* Auto Reorder Settings */}
//               <h6 className="mt-3"><CIcon icon={cilCloudDownload} className="me-2" />Auto Reorder Settings</h6>
//               <div className="row mb-3">
//                 <div className="col-md-6"><small className="text-muted">Status</small><div><CBadge color={selectedConfig.settings?.autoReorder?.enabled ? 'success' : 'secondary'}>{selectedConfig.settings?.autoReorder?.enabled ? 'Enabled' : 'Disabled'}</CBadge></div></div>
//                 <div className="col-md-6"><small className="text-muted">Reorder Frequency</small><div><strong>{selectedConfig.settings?.autoReorder?.reorderFrequency || '-'}</strong></div></div>
//                 <div className="col-md-6 mt-2"><small className="text-muted">Min Order Quantity</small><div><strong>{selectedConfig.settings?.autoReorder?.minOrderQuantity || 0} units</strong></div></div>
//                 <div className="col-md-6 mt-2"><small className="text-muted">Max Order Quantity</small><div><strong>{selectedConfig.settings?.autoReorder?.maxOrderQuantity || 0} units</strong></div></div>
//               </div>
              
//               {/* Notification Settings */}
//               <h6 className="mt-3"><CIcon icon={cilBell} className="me-2" />Notification Settings</h6>
//               <div className="row mb-3">
//                 <div className="col-md-4"><small className="text-muted">Email Alerts</small><div><CBadge color={selectedConfig.settings?.notifications?.emailAlerts ? 'success' : 'secondary'}>{selectedConfig.settings?.notifications?.emailAlerts ? 'Enabled' : 'Disabled'}</CBadge></div></div>
//                 <div className="col-md-4"><small className="text-muted">Dashboard Alerts</small><div><CBadge color={selectedConfig.settings?.notifications?.dashboardAlerts ? 'success' : 'secondary'}>{selectedConfig.settings?.notifications?.dashboardAlerts ? 'Enabled' : 'Disabled'}</CBadge></div></div>
//                 <div className="col-md-4"><small className="text-muted">Minimum Alert Level</small><div>{getAlertLevelBadge(selectedConfig.settings?.notifications?.minimumAlertLevel)}</div></div>
//               </div>
              
//               {/* Metadata */}
//               <hr />
//               <div className="row">
//                 <div className="col-md-6"><small className="text-muted">Created By</small><div><strong>{selectedConfig.createdBy?.name || '-'}</strong></div><small className="text-muted">Created At</small><div><strong>{formatDate(selectedConfig.createdAt)}</strong></div></div>
//                 <div className="col-md-6"><small className="text-muted">Updated By</small><div><strong>{selectedConfig.updatedBy?.name || '-'}</strong></div><small className="text-muted">Updated At</small><div><strong>{formatDate(selectedConfig.updatedAt)}</strong></div></div>
//                 {selectedConfig.notes && <div className="col-md-12 mt-2"><small className="text-muted">Notes</small><div><strong>{selectedConfig.notes}</strong></div></div>}
//               </div>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Delete Confirmation Modal - only shown if user has delete permission */}
//       {canPerformDelete && (
//         <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
//           <CModalHeader><CModalTitle>Confirm Delete</CModalTitle></CModalHeader>
//           <CModalBody>
//             <p>Are you sure you want to delete this configuration for <strong>{configToDelete?.modelId?.model_name || configToDelete?.modelId?.name}</strong>?</p>
//             <p className="text-muted small">This action cannot be undone.</p>
//           </CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
//             <CButton color="danger" onClick={handleDeleteConfirm}><CIcon icon={cilTrash} className="me-1" />Delete</CButton>
//           </CModalFooter>
//         </CModal>
//       )}
//     </div>
//   );
// };

// export default PurchaseConfigList;