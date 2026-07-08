import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  axiosInstance,
  showError,
  showSuccess,
  confirmDelete,
  Menu,
  MenuItem
} from '../../../utils/tableImports';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CAlert,
  CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilChart,
  cilChartPie,
  cilChartLine,
  cilMoney,
  cilUser,
  cilCheckCircle,
  cilWarning,
  cilWallet
} from '@coreui/icons';
import EditIncentive from './EditIncentive';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const Incentives = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Data state
  const [plans, setPlans] = useState([]);
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
  
  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Summary data state
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Check Pool state
  const [poolModalVisible, setPoolModalVisible] = useState(false);
  const [poolData, setPoolData] = useState(null);
  const [poolLoading, setPoolLoading] = useState(false);
  const [poolError, setPoolError] = useState(null);

  // Fetch incentives when page or limit changes
  useEffect(() => {
    fetchIncentives();
  }, [pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchIncentives(1, pagination.limit, searchTerm);
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchIncentives = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/incentives/master?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        setPlans(response.data.data?.plans || []);
        setPagination({
          page: response.data.page || page,
          limit: limit,
          totalCount: response.data.total || response.data.data?.plans?.length || 0,
          totalPages: response.data.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching incentives:', error);
      setError(error.response?.data?.message || 'Failed to fetch incentives');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const response = await axiosInstance.get('/incentives/summary');
      if (response.data.status === 'success') {
        setSummaryData(response.data.data);
        setSummaryModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummaryError(error.response?.data?.message || 'Failed to fetch summary');
      showError(error);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Fetch pool details
  const fetchPoolDetails = async (plan) => {
    setPoolLoading(true);
    setPoolError(null);
    setPoolData(null);
    
    try {
      // Extract modelId and colorId from the plan
      const modelId = plan.model?._id || plan.modelId;
      const colorId = plan.color?.id?._id || plan.color?._id || plan.colorId;
      
      if (!modelId || !colorId) {
        setPoolError('Model ID or Color ID not available for this plan');
        setPoolLoading(false);
        setPoolModalVisible(true);
        return;
      }

      const response = await axiosInstance.get(`/incentives/check-pool?modelId=${modelId}&colorId=${colorId}`);
      
      if (response.data.status === 'success') {
        setPoolData(response.data.data);
        setPoolModalVisible(true);
      } else {
        setPoolError('Failed to fetch pool details');
        setPoolModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching pool details:', error);
      setPoolError(error.response?.data?.message || 'Failed to fetch pool details');
      setPoolModalVisible(true);
    } finally {
      setPoolLoading(false);
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

  // Menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleViewClick = (plan) => {
    setSelectedPlan(plan);
    setViewModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalVisible(true);
    handleClose();
  };

  // New handler for Check Pool
  const handleCheckPoolClick = (plan) => {
    setSelectedPlan(plan);
    handleClose();
    fetchPoolDetails(plan);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return;
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/incentives/master/${selectedPlan._id}`);
        if (response.data.status === 'success') {
          showSuccess('Incentive plan deleted successfully!');
          setDeleteModalVisible(false);
          setSelectedPlan(null);
          fetchIncentives(pagination.page, pagination.limit, searchTerm);
        }
      } catch (error) {
        console.error('Error deleting incentive plan:', error);
        showError(error.response?.data?.message || 'Failed to delete incentive plan');
      }
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

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <CBadge color="success">Active</CBadge>;
    } else if (status === 'inactive') {
      return <CBadge color="danger">Inactive</CBadge>;
    } else {
      return <CBadge color="secondary">{status || 'Unknown'}</CBadge>;
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

  if (error && plans.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Incentive Plans Management</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={fetchSummary}>
              <CIcon icon={cilChartPie} className='icon' /> Summary
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
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
                placeholder="Search by model name, color..."
                autoComplete="off"
              />
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          {/* Incentives Table */}
          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Incentive/Vehicle</CTableHeaderCell>
                  <CTableHeaderCell>Total Pool</CTableHeaderCell>
                  <CTableHeaderCell>Remaining Pool</CTableHeaderCell>
                  <CTableHeaderCell>Utilized %</CTableHeaderCell>
                  <CTableHeaderCell>Valid From</CTableHeaderCell>
                  <CTableHeaderCell>Valid To</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {plans.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={12} style={{ color: 'red', textAlign: 'center' }}>
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No incentive plans found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  plans.map((plan, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={plan._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{plan.model?.model_name || plan.modelName || '-'}</CTableDataCell>
                        <CTableDataCell>{plan.color?.name || plan.color?.id?.name || '-'}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(plan.incentivePerVehicle)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(plan.totalIncentivePool)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(plan.remainingPool || plan.totalIncentivePool - (plan.utilizedAmount || 0))}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={plan.utilizationPercentage && parseFloat(plan.utilizationPercentage) > 80 ? 'warning' : 'info'}>
                            {plan.utilizationPercentage || '0'}%
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(plan.validFrom)}</CTableDataCell>
                        <CTableDataCell>{formatDate(plan.validTo)}</CTableDataCell>
                        <CTableDataCell>{getStatusBadge(plan.status)}</CTableDataCell>
                        <CTableDataCell>{plan.createdBy?.name || '-'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={(event) => handleClick(event, plan._id)}
                          >
                            <CIcon icon={cilOptions} /> Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${plan._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === plan._id} 
                            onClose={handleClose}
                          >
                            <MenuItem onClick={() => handleViewClick(plan)}>
                              <CIcon icon={cilSearch} className="me-2" /> View Details
                            </MenuItem>
                            <MenuItem onClick={() => handleCheckPoolClick(plan)}>
                              <CIcon icon={cilWallet} className="me-2" /> Check Pool
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteClick(plan)}>
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

          {/* Pagination */}
          {renderPagination()}
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      <EditIncentive 
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSuccess={() => {
          fetchIncentives(pagination.page, pagination.limit, searchTerm);
        }}
        planId={selectedPlan?._id}
      />

      {/* View Incentive Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilSearch} className="me-2" />
            Incentive Plan Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPlan && (
            <div>
              {/* Basic Information */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Basic Information</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Model</small>
                  <div><strong>{selectedPlan.model?.model_name || selectedPlan.modelName || '-'}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Model Type</small>
                  <div><strong>{selectedPlan.model?.type || '-'}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Color</small>
                  <div><strong>{selectedPlan.color?.name || selectedPlan.color?.id?.name || '-'}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Status</small>
                  <div>{getStatusBadge(selectedPlan.status)}</div>
                </CCol>
              </CRow>

              {/* Financial Details */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Financial Details</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Incentive per Vehicle</small>
                  <div><strong>{formatCurrency(selectedPlan.incentivePerVehicle)}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Total Incentive Pool</small>
                  <div><strong>{formatCurrency(selectedPlan.totalIncentivePool)}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Utilized Amount</small>
                  <div><strong>{formatCurrency(selectedPlan.utilizedAmount || 0)}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Remaining Pool</small>
                  <div><strong>{formatCurrency(selectedPlan.remainingPool || selectedPlan.totalIncentivePool - (selectedPlan.utilizedAmount || 0))}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Utilization Percentage</small>
                  <div>
                    <CBadge color={selectedPlan.utilizationPercentage && parseFloat(selectedPlan.utilizationPercentage) > 80 ? 'warning' : 'info'}>
                      {selectedPlan.utilizationPercentage || '0'}%
                    </CBadge>
                  </div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Max Vehicles Coverable</small>
                  <div><strong>{selectedPlan.maxVehiclesCoverable || Math.floor(selectedPlan.totalIncentivePool / selectedPlan.incentivePerVehicle)}</strong></div>
                </CCol>
              </CRow>

              {/* Validity Period */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Validity Period</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Valid From</small>
                  <div><strong>{formatDate(selectedPlan.validFrom)}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Valid To</small>
                  <div><strong>{formatDate(selectedPlan.validTo)}</strong></div>
                </CCol>
              </CRow>

              {/* Additional Information */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Additional Information</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Created By</small>
                  <div><strong>{selectedPlan.createdBy?.name || '-'}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Created At</small>
                  <div><strong>{formatDate(selectedPlan.createdAt)}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <small className="text-muted">Remarks</small>
                  <div><strong>{selectedPlan.remarks || '-'}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <small className="text-muted">Last Updated</small>
                  <div>{formatDate(selectedPlan.updatedAt)}</div>
                </CCol>
              </CRow>

              {/* Utilization Progress Bar */}
              {selectedPlan.utilizationPercentage && (
                <div className="border-bottom pb-2 mb-3">
                  <h6>Utilization Progress</h6>
                </div>
              )}
              {selectedPlan.utilizationPercentage && (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <div className="d-flex align-items-center mt-1">
                      <CProgress 
                        value={parseFloat(selectedPlan.utilizationPercentage)} 
                        color={parseFloat(selectedPlan.utilizationPercentage) > 80 ? 'warning' : 'info'}
                        className="flex-grow-1"
                        style={{ height: '20px' }}
                      />
                      <span className="ms-2 fw-bold">{selectedPlan.utilizationPercentage}%</span>
                    </div>
                  </CCol>
                </CRow>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Check Pool Modal */}
      <CModal size="lg" visible={poolModalVisible} onClose={() => {
        setPoolModalVisible(false);
        setPoolData(null);
        setPoolError(null);
      }} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilWallet} className="me-2" />
            Incentive Pool Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {poolLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" size="lg" />
              <span className="ms-3">Loading pool details...</span>
            </div>
          ) : poolError ? (
            <CAlert color="danger">
              <CIcon icon={cilWarning} className="me-2" />
              {poolError}
            </CAlert>
          ) : poolData ? (
            <div>
              {/* Status Banner */}
              <CAlert color={poolData.hasActivePlan ? 'success' : 'warning'} className="mb-4">
                <CIcon icon={poolData.hasActivePlan ? cilCheckCircle : cilWarning} className="me-2" />
                {poolData.hasActivePlan 
                  ? 'Active incentive plan exists for this model and color combination'
                  : 'No active incentive plan found for this model and color combination'
                }
              </CAlert>

              {poolData.hasActivePlan && (
                <>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <small className="text-muted">Model</small>
                      <div><strong>{poolData.model}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Color</small>
                      <div><strong>{poolData.color}</strong></div>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <small className="text-muted">Incentive per Vehicle</small>
                      <div><strong>{formatCurrency(poolData.incentivePerVehicle)}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Total Pool</small>
                      <div><strong>{formatCurrency(poolData.totalPool)}</strong></div>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <small className="text-muted">Utilized Amount</small>
                      <div><strong>{formatCurrency(poolData.utilizedAmount)}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Remaining Pool</small>
                      <div><strong>{formatCurrency(poolData.remainingPool)}</strong></div>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <small className="text-muted">Max Vehicles Coverable</small>
                      <div><strong>{poolData.maxVehiclesCoverable}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Can Apply Next</small>
                      <div>
                        <CBadge color={poolData.canApplyNext ? 'success' : 'danger'}>
                          {poolData.canApplyNext ? 'Yes' : 'No'}
                        </CBadge>
                      </div>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <small className="text-muted">Valid From</small>
                      <div><strong>{formatDate(poolData.validFrom)}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Valid To</small>
                      <div><strong>{formatDate(poolData.validTo)}</strong></div>
                    </CCol>
                  </CRow>

                  {/* Utilization Progress */}
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <small className="text-muted">Utilization Progress</small>
                      <div className="d-flex align-items-center mt-1">
                        <CProgress 
                          value={parseFloat(poolData.utilizationPercentage)} 
                          color={parseFloat(poolData.utilizationPercentage) > 80 ? 'warning' : 'info'}
                          className="flex-grow-1"
                          style={{ height: '20px' }}
                        />
                        <span className="ms-2 fw-bold">{poolData.utilizationPercentage}%</span>
                      </div>
                    </CCol>
                  </CRow>
                </>
              )}
            </div>
          ) : (
            <p className="text-muted">No pool data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {
            setPoolModalVisible(false);
            setPoolData(null);
            setPoolError(null);
          }}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Summary Modal */}
      <CModal size="lg" visible={summaryModalVisible} onClose={() => {
        setSummaryModalVisible(false);
        setSummaryData(null);
        setSummaryError(null);
      }} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilChartPie} className="me-2" />
            Incentive Summary
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {summaryLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" size="lg" />
              <span className="ms-3">Loading summary data...</span>
            </div>
          ) : summaryError ? (
            <CAlert color="danger">
              <CIcon icon={cilWarning} className="me-2" />
              {summaryError}
            </CAlert>
          ) : summaryData ? (
            <div>
              {/* Plans Summary */}
              <h6 className="mb-3">Plan Summary</h6>
              {summaryData.plans && summaryData.plans.length > 0 ? (
                <CTable striped bordered hover size="sm" className="mb-4">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">No. of Plans</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Total Pool (₹)</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Total Utilized (₹)</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {summaryData.plans.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CBadge color={item._id === 'active' ? 'success' : 'secondary'}>
                            {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{item.count}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatCurrency(item.totalPool)}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatCurrency(item.totalUtilized)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p className="text-muted">No plan data available</p>
              )}

              {/* Transactions Summary */}
              <h6 className="mb-3">Transaction Summary</h6>
              {summaryData.transactions && summaryData.transactions.length > 0 ? (
                <CTable striped bordered hover size="sm" className="mb-4">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Count</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Total Amount (₹)</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {summaryData.transactions.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CBadge color={item._id === 'paid' ? 'success' : 'warning'}>
                            {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{item.count}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatCurrency(item.totalAmount)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p className="text-muted">No transaction data available</p>
              )}

              {/* Top Earning Executives */}
              <h6 className="mb-3">Top Earning Executives</h6>
              {summaryData.topEarningExecutives && summaryData.topEarningExecutives.length > 0 ? (
                <CTable striped bordered hover size="sm">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Executive Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Vehicles Count</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Total Earned (₹)</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {summaryData.topEarningExecutives.map((item, index) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CIcon icon={cilUser} className="me-2" />
                          {item.name || 'Unknown'}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{item.vehicleCount}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatCurrency(item.totalEarned)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p className="text-muted">No executive data available</p>
              )}
            </div>
          ) : (
            <p className="text-muted">No summary data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {
            setSummaryModalVisible(false);
            setSummaryData(null);
            setSummaryError(null);
          }}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this incentive plan?</p>
          <p><strong>Model:</strong> {selectedPlan?.model?.model_name || selectedPlan?.modelName || '-'}</p>
          <p><strong>Color:</strong> {selectedPlan?.color?.name || selectedPlan?.color?.id?.name || '-'}</p>
          <p><strong>Incentive:</strong> {formatCurrency(selectedPlan?.incentivePerVehicle)} per vehicle</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            <CIcon icon={cilTrash} className="me-1" /> Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Incentives;





// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import {
//   axiosInstance,
//   showError,
//   showSuccess,
//   confirmDelete,
//   Menu,
//   MenuItem
// } from '../../../utils/tableImports';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCardHeader, 
//   CFormLabel, 
//   CTable, 
//   CTableBody, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge,
//   CPagination,
//   CPaginationItem,
//   CFormSelect,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CRow,
//   CCol
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilOptions,
//   cilChevronLeft,
//   cilChevronRight,
//   cilPlus,
//   cilPencil,
//   cilTrash,
//   cilSearch
// } from '@coreui/icons';
// import AddIncentive from './AddIncentive';
// import EditIncentive from './EditIncentive';
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
// import { useAuth } from '../../../context/AuthContext';

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// const Incentives = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Menu state for dropdown
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
  
//   // Data state
//   const [plans, setPlans] = useState([]);
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
  
//   // Modal states
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const { permissions = [] } = useAuth();

//   // Permission checks for HR Management - Incentives List page
//   // Using PAGES.HR_MANAGEMENT constants for page-level permissions
//   const canViewIncentives = canViewPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.INCENTIVES_LIST);
//   const canCreateIncentive = canCreateInPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.APPLY_INCENTIVE);
//   const canUpdateIncentive = canUpdateInPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.INCENTIVES_LIST);
//   const canDeleteIncentive = canDeleteInPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.INCENTIVES_LIST);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasCreatePermission = hasSafePagePermission(
//     permissions, 
//     MODULES.HR_MANAGEMENT, 
//     PAGES.HR_MANAGEMENT.APPLY_INCENTIVE, 
//     ACTIONS.CREATE
//   );
  
//   const hasUpdatePermission = hasSafePagePermission(
//     permissions, 
//     MODULES.HR_MANAGEMENT, 
//     PAGES.HR_MANAGEMENT.INCENTIVES_LIST, 
//     ACTIONS.UPDATE
//   );
  
//   const hasDeletePermission = hasSafePagePermission(
//     permissions, 
//     MODULES.HR_MANAGEMENT, 
//     PAGES.HR_MANAGEMENT.INCENTIVES_LIST, 
//     ACTIONS.DELETE
//   );
  
//   const hasViewPermission = hasSafePagePermission(
//     permissions, 
//     MODULES.HR_MANAGEMENT, 
//     PAGES.HR_MANAGEMENT.INCENTIVES_LIST, 
//     ACTIONS.VIEW
//   );
  
//   // Combined permission checks
//   const canPerformCreate = canCreateIncentive || hasCreatePermission;
//   const canPerformUpdate = canUpdateIncentive || hasUpdatePermission;
//   const canPerformDelete = canDeleteIncentive || hasDeletePermission;
//   const canPerformView = canViewIncentives || hasViewPermission;

//   // Fetch incentives when page or limit changes
//   useEffect(() => {
//     if (canPerformView) {
//       fetchIncentives();
//     }
//   }, [pagination.page, pagination.limit]);

//   // Debounced search
//   useEffect(() => {
//     if (!canPerformView) return;
    
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchIncentives(1, pagination.limit, searchTerm);
//     }, 400);
    
//     return () => clearTimeout(searchTimer.current);
//   }, [searchTerm]);

//   const fetchIncentives = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     // Check if user has permission to view incentives
//     if (!canPerformView) {
//       setError('You do not have permission to view incentive plans');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', limit);
      
//       if (search && search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       const url = `/incentives/master?${params.toString()}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.status === 'success') {
//         setPlans(response.data.data.plans || []);
//         setPagination({
//           page: response.data.page || page,
//           limit: limit,
//           totalCount: response.data.total || response.data.data.plans?.length || 0,
//           totalPages: response.data.totalPages || 1
//         });
//       }
      
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching incentives:', error);
//       setError(error.response?.data?.message || 'Failed to fetch incentives');
//       showError(error);
//     } finally {
//       setLoading(false);
//     }
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

//   // Menu handlers
//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleAddClick = () => {
//     // Check create permission before opening add modal
//     if (!canPerformCreate) {
//       showError('You do not have permission to add incentive plans');
//       return;
//     }
//     setAddModalVisible(true);
//   };

//   const handleViewClick = (plan) => {
//     // Check view permission before viewing details
//     if (!canPerformView) {
//       showError('You do not have permission to view incentive plan details');
//       return;
//     }
//     setSelectedPlan(plan);
//     setViewModalVisible(true);
//     handleClose();
//   };

//   const handleEditClick = (plan) => {
//     // Check update permission before editing
//     if (!canPerformUpdate) {
//       showError('You do not have permission to edit incentive plans');
//       return;
//     }
//     setSelectedPlan(plan);
//     setEditModalVisible(true);
//     handleClose();
//   };

//   const handleDeleteClick = (plan) => {
//     // Check delete permission before deleting
//     if (!canPerformDelete) {
//       showError('You do not have permission to delete incentive plans');
//       return;
//     }
//     setSelectedPlan(plan);
//     setDeleteModalVisible(true);
//     handleClose();
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedPlan) return;
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         const response = await axiosInstance.delete(`/incentives/master/${selectedPlan._id}`);
//         if (response.data.status === 'success') {
//           showSuccess('Incentive plan deleted successfully!');
//           setDeleteModalVisible(false);
//           setSelectedPlan(null);
//           fetchIncentives(pagination.page, pagination.limit, searchTerm);
//         }
//       } catch (error) {
//         console.error('Error deleting incentive plan:', error);
//         showError(error.response?.data?.message || 'Failed to delete incentive plan');
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

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '-';
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

//   const getStatusBadge = (status) => {
//     if (status === 'active') {
//       return <CBadge color="success">Active</CBadge>;
//     } else {
//       return <CBadge color="danger">Inactive</CBadge>;
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

//   // If user doesn't have permission to view incentives, show access denied message
//   if (!canPerformView) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Incentive Plans.
//       </div>
//     );
//   }

//   if (error && plans.length === 0) {
//     return <div className="alert alert-danger m-3">{error}</div>;
//   }

//   return (
//     <div>
//       <div className='title'>Incentive Plans Management</div>

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {/* Add Incentive Plan button - requires CREATE permission */}
//             {canPerformCreate && (
//               <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
//                 <CIcon icon={cilPlus} className='icon' /> Add Incentive Plan
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
//         <CCardBody>
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
//                 placeholder="Search by model name, color..."
//                 autoComplete="off"
//               />
//             </div>
//           </div>

//           {/* Loading Indicator */}
//           {loading && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}

//           {/* Incentives Table */}
//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Incentive/Vehicle</CTableHeaderCell>
//                   <CTableHeaderCell>Total Pool</CTableHeaderCell>
//                   <CTableHeaderCell>Remaining Pool</CTableHeaderCell>
//                   <CTableHeaderCell>Utilized %</CTableHeaderCell>
//                   <CTableHeaderCell>Valid From</CTableHeaderCell>
//                   <CTableHeaderCell>Valid To</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   <CTableHeaderCell>Created By</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {plans.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={12} style={{ color: 'red', textAlign: 'center' }}>
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No incentive plans found.'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   plans.map((plan, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={plan._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{plan.modelName || plan.model?.model_name || '-'}</CTableDataCell>
//                         <CTableDataCell>{plan.color?.name || plan.color?.id?.name || '-'}</CTableDataCell>
//                         <CTableDataCell>{formatCurrency(plan.incentivePerVehicle)}</CTableDataCell>
//                         <CTableDataCell>{formatCurrency(plan.totalIncentivePool)}</CTableDataCell>
//                         <CTableDataCell>{formatCurrency(plan.remainingPool || plan.totalIncentivePool - (plan.utilizedAmount || 0))}</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={plan.utilizationPercentage && parseFloat(plan.utilizationPercentage) > 80 ? 'warning' : 'info'}>
//                             {plan.utilizationPercentage || '0'}%
//                           </CBadge>
//                         </CTableDataCell>
//                         <CTableDataCell>{formatDate(plan.validFrom)}</CTableDataCell>
//                         <CTableDataCell>{formatDate(plan.validTo)}</CTableDataCell>
//                         <CTableDataCell>{getStatusBadge(plan.status)}</CTableDataCell>
//                         <CTableDataCell>{plan.createdBy?.name || '-'}</CTableDataCell>
//                         <CTableDataCell>
//                           {/* Options button - show if user has any action permission */}
//                           {(canPerformView || canPerformUpdate || canPerformDelete) && (
//                             <CButton
//                               size="sm"
//                               className="option-button btn-sm"
//                               onClick={(event) => handleClick(event, plan._id)}
//                             >
//                               <CIcon icon={cilOptions} /> Options
//                             </CButton>
//                           )}
//                           <Menu 
//                             id={`action-menu-${plan._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === plan._id} 
//                             onClose={handleClose}
//                           >
//                             {/* View Details - requires VIEW permission */}
//                             {canPerformView && (
//                               <MenuItem onClick={() => handleViewClick(plan)}>
//                                 <CIcon icon={cilSearch} className="me-2" /> View Details
//                               </MenuItem>
//                             )}
                            
//                             {/* Edit - requires UPDATE permission */}
//                             {canPerformUpdate && (
//                               <MenuItem onClick={() => handleEditClick(plan)}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             )}
                            
//                             {/* Delete - requires DELETE permission */}
//                             {canPerformDelete && (
//                               <MenuItem onClick={() => handleDeleteClick(plan)}>
//                                 <CIcon icon={cilTrash} className="me-2" /> Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {/* Pagination */}
//           {renderPagination()}
//         </CCardBody>
//       </CCard>

//       {/* Add Modal - only shown if user has create permission */}
//       {canPerformCreate && (
//         <AddIncentive 
//           visible={addModalVisible}
//           onClose={() => setAddModalVisible(false)}
//           onSuccess={() => {
//             fetchIncentives(1, pagination.limit, searchTerm);
//           }}
//         />
//       )}

//       {/* Edit Modal - only shown if user has update permission */}
//       {canPerformUpdate && (
//         <EditIncentive 
//           visible={editModalVisible}
//           onClose={() => setEditModalVisible(false)}
//           onSuccess={() => {
//             fetchIncentives(pagination.page, pagination.limit, searchTerm);
//           }}
//           planId={selectedPlan?._id}
//         />
//       )}

//       {/* View Incentive Modal - always show if user has view permission */}
//       <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center">
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilSearch} className="me-2" />
//             Incentive Plan Details
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedPlan && (
//             <div>
//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Model</small>
//                   <div><strong>{selectedPlan.modelName || selectedPlan.model?.model_name}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Color</small>
//                   <div><strong>{selectedPlan.color?.name || selectedPlan.color?.id?.name}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Incentive per Vehicle</small>
//                   <div><strong>{formatCurrency(selectedPlan.incentivePerVehicle)}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Total Incentive Pool</small>
//                   <div><strong>{formatCurrency(selectedPlan.totalIncentivePool)}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Utilized Amount</small>
//                   <div><strong>{formatCurrency(selectedPlan.utilizedAmount)}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Remaining Pool</small>
//                   <div><strong>{formatCurrency(selectedPlan.remainingPool || selectedPlan.totalIncentivePool - selectedPlan.utilizedAmount)}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Utilization Percentage</small>
//                   <div><strong>{selectedPlan.utilizationPercentage || '0'}%</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Max Vehicles Coverable</small>
//                   <div><strong>{selectedPlan.maxVehiclesCoverable || Math.floor(selectedPlan.totalIncentivePool / selectedPlan.incentivePerVehicle)}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Valid From</small>
//                   <div><strong>{formatDate(selectedPlan.validFrom)}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Valid To</small>
//                   <div><strong>{formatDate(selectedPlan.validTo)}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Status</small>
//                   <div>{getStatusBadge(selectedPlan.status)}</div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Created By</small>
//                   <div><strong>{selectedPlan.createdBy?.name}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={12}>
//                   <small className="text-muted">Remarks</small>
//                   <div><strong>{selectedPlan.remarks || '-'}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={12}>
//                   <small className="text-muted">Created At</small>
//                   <div>{formatDate(selectedPlan.createdAt)}</div>
//                 </CCol>
//               </CRow>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Delete Confirmation Modal - only shown if user has delete permission */}
//       {canPerformDelete && (
//         <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
//           <CModalHeader>
//             <CModalTitle>Confirm Delete</CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             <p>Are you sure you want to delete this incentive plan?</p>
//             <p><strong>Model:</strong> {selectedPlan?.modelName || selectedPlan?.model?.model_name}</p>
//             <p><strong>Color:</strong> {selectedPlan?.color?.name || selectedPlan?.color?.id?.name}</p>
//             <p><strong>Incentive:</strong> {formatCurrency(selectedPlan?.incentivePerVehicle)} per vehicle</p>
//             <p className="text-muted small">This action cannot be undone.</p>
//           </CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
//             <CButton color="danger" onClick={handleDeleteConfirm}>
//               <CIcon icon={cilTrash} className="me-1" /> Delete
//             </CButton>
//           </CModalFooter>
//         </CModal>
//       )}
//     </div>
//   );
// };

// export default Incentives;