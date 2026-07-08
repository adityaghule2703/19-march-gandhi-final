import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  axiosInstance,
  showError,
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
  cilSearch,
  cilUser,
  cilChartPie,
  cilMoney,
  cilBook,
  cilCheckCircle,
  cilWarning,
  cilInfo,
  cilFile
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const IncentivePerformance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Data state
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(null);
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
  
  // Modal state
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch performance data
  useEffect(() => {
    fetchPerformance();
  }, [pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchPerformance(1, pagination.limit, searchTerm);
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchPerformance = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/incentives/performance?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setUsers(response.data.data?.users || []);
        setSummary(response.data.summary || null);
        setFilters(response.data.filters || null);
        setPagination({
          page: response.data.page || page,
          limit: limit,
          totalCount: response.data.total || response.data.data?.users?.length || 0,
          totalPages: response.data.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching performance:', error);
      setError(error.response?.data?.message || 'Failed to fetch performance data');
      showError(error);
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

  // Menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setViewModalVisible(true);
    handleClose();
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString();
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE') {
      return <CBadge color="success">Active</CBadge>;
    } else if (status === 'INACTIVE') {
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

  if (error && users.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Incentive Performance</div>

      {/* Summary Cards */}
      {summary && (
        <CRow className="mb-3">
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatNumber(summary.totalUsers)}</h5>
                <small className="text-muted">Total Users</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatNumber(summary.totalBookings)}</h5>
                <small className="text-muted">Total Bookings</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatNumber(summary.totalApprovedBookings)}</h5>
                <small className="text-muted">Approved Bookings</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatCurrency(summary.totalDeviationUsed)}</h5>
                <small className="text-muted">Deviation Used</small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CCard className='table-container mt-4'>
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
                placeholder="Search by name, email, role..."
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

          {/* Users Table */}
          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Total Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Approved</CTableHeaderCell>
                  <CTableHeaderCell>Incentive Earned</CTableHeaderCell>
                  <CTableHeaderCell>Deviation Used</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} style={{ color: 'red', textAlign: 'center' }}>
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No users found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  users.map((user, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    const perf = user.performance || {};
                    const bookings = perf.bookings || {};
                    const incentives = perf.incentives || {};
                    const deviation = perf.deviation || {};
                    
                    return (
                      <CTableRow key={user.userId}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          <div><strong>{user.name}</strong></div>
                          <small className="text-muted">{user.email}</small>
                        </CTableDataCell>
                        <CTableDataCell>{user.role || '-'}</CTableDataCell>
                        <CTableDataCell>{user.branch || '-'}</CTableDataCell>
                        <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                        <CTableDataCell>{formatNumber(bookings.total)}</CTableDataCell>
                        <CTableDataCell>{formatNumber(bookings.approved)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(incentives.totalEarned)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(deviation.currentUsage)}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={(event) => handleClick(event, user.userId)}
                          >
                            <CIcon icon={cilOptions} /> Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${user.userId}`} 
                            anchorEl={anchorEl} 
                            open={menuId === user.userId} 
                            onClose={handleClose}
                          >
                            <MenuItem onClick={() => handleViewClick(user)}>
                              <CIcon icon={cilSearch} className="me-2" /> View Details
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

      {/* View Details Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilUser} className="me-2" />
            User Performance Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <div>
              {/* User Info */}
              <div className="border-bottom pb-2 mb-3">
                <h6>User Information</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Name</small>
                  <div><strong>{selectedUser.name}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Email</small>
                  <div><strong>{selectedUser.email}</strong></div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Role</small>
                  <div><strong>{selectedUser.role || '-'}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Branch</small>
                  <div><strong>{selectedUser.branch || '-'}</strong></div>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Status</small>
                  <div>{getStatusBadge(selectedUser.status)}</div>
                </CCol>
              </CRow>

              {/* Bookings Performance */}
              {selectedUser.performance?.bookings && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6><CIcon icon={cilBook} className="me-2" />Bookings Performance</h6>
                  </div>
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CCard className="text-center bg-light">
                        <CCardBody>
                          <h5>{formatNumber(selectedUser.performance.bookings.total)}</h5>
                          <small className="text-muted">Total</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-success text-white">
                        <CCardBody>
                          <h5>{formatNumber(selectedUser.performance.bookings.approved)}</h5>
                          <small className="text-white">Approved</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-info text-white">
                        <CCardBody>
                          <h5>{formatNumber(selectedUser.performance.bookings.allocated)}</h5>
                          <small className="text-white">Allocated</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-warning text-white">
                        <CCardBody>
                          <h5>{formatNumber(selectedUser.performance.bookings.pending)}</h5>
                          <small className="text-white">Pending</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </>
              )}

              {/* Incentives Performance */}
              {selectedUser.performance?.incentives && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6><CIcon icon={cilMoney} className="me-2" />Incentives Performance</h6>
                  </div>
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CCard className="text-center bg-light">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.incentives.totalEarned)}</h5>
                          <small className="text-muted">Total Earned</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-success text-white">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.incentives.paid)}</h5>
                          <small className="text-white">Paid</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-warning text-white">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.incentives.pending)}</h5>
                          <small className="text-white">Pending</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-secondary text-white">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.incentives.onHold)}</h5>
                          <small className="text-white">On Hold</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <small className="text-muted">Transactions</small>
                      <div><strong>{formatNumber(selectedUser.performance.incentives.transactionCount)}</strong></div>
                    </CCol>
                  </CRow>
                </>
              )}

              {/* Deviation Performance */}
              {selectedUser.performance?.deviation && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6><CIcon icon={cilWarning} className="me-2" />Deviation Performance</h6>
                  </div>
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CCard className="text-center bg-light">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.deviation.totalLimit)}</h5>
                          <small className="text-muted">Total Limit</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-danger text-white">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.deviation.currentUsage)}</h5>
                          <small className="text-white">Used</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-success text-white">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.deviation.available)}</h5>
                          <small className="text-white">Available</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol md={3}>
                      <CCard className="text-center bg-light">
                        <CCardBody>
                          <h5>{formatCurrency(selectedUser.performance.deviation.perTransactionLimit)}</h5>
                          <small className="text-muted">Per Transaction</small>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  
                  {/* Deviation Usage Progress */}
                  {selectedUser.performance.deviation.totalLimit > 0 && (
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <small className="text-muted">Deviation Usage</small>
                        <div className="d-flex align-items-center mt-1">
                          <CProgress 
                            value={(selectedUser.performance.deviation.currentUsage / selectedUser.performance.deviation.totalLimit) * 100}
                            color={(selectedUser.performance.deviation.currentUsage / selectedUser.performance.deviation.totalLimit) > 80 ? 'danger' : 'info'}
                            className="flex-grow-1"
                            style={{ height: '20px' }}
                          />
                          <span className="ms-2 fw-bold">
                            {((selectedUser.performance.deviation.currentUsage / selectedUser.performance.deviation.totalLimit) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </CCol>
                    </CRow>
                  )}
                </>
              )}

              {/* Discounts Performance */}
              {selectedUser.performance?.discounts && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6><CIcon icon={cilCheckCircle} className="me-2" />Discounts Performance</h6>
                  </div>
                  <CRow className="mb-3">
                    <CCol md={4}>
                      <small className="text-muted">On Road Price Discount</small>
                      <div>
                        <strong>
                          {formatCurrency(selectedUser.performance.discounts.available?.onRoadPrice || 0)} 
                          <span className="text-muted ms-1">/ {formatCurrency(selectedUser.performance.discounts.limits?.onRoadPrice || 0)}</span>
                        </strong>
                      </div>
                      <CProgress 
                        value={selectedUser.performance.discounts.limits?.onRoadPrice > 0 ? 
                          (selectedUser.performance.discounts.currentUsage?.onRoadPrice || 0) / selectedUser.performance.discounts.limits.onRoadPrice * 100 : 0}
                        color="info"
                        style={{ height: '8px' }}
                        className="mt-1"
                      />
                    </CCol>
                    <CCol md={4}>
                      <small className="text-muted">Add On Services Discount</small>
                      <div>
                        <strong>
                          {formatCurrency(selectedUser.performance.discounts.available?.addOnServices || 0)} 
                          <span className="text-muted ms-1">/ {formatCurrency(selectedUser.performance.discounts.limits?.addOnServices || 0)}</span>
                        </strong>
                      </div>
                      <CProgress 
                        value={selectedUser.performance.discounts.limits?.addOnServices > 0 ? 
                          (selectedUser.performance.discounts.currentUsage?.addOnServices || 0) / selectedUser.performance.discounts.limits.addOnServices * 100 : 0}
                        color="info"
                        style={{ height: '8px' }}
                        className="mt-1"
                      />
                    </CCol>
                    <CCol md={4}>
                      <small className="text-muted">Accessories Discount</small>
                      <div>
                        <strong>
                          {formatCurrency(selectedUser.performance.discounts.available?.accessories || 0)} 
                          <span className="text-muted ms-1">/ {formatCurrency(selectedUser.performance.discounts.limits?.accessories || 0)}</span>
                        </strong>
                      </div>
                      <CProgress 
                        value={selectedUser.performance.discounts.limits?.accessories > 0 ? 
                          (selectedUser.performance.discounts.currentUsage?.accessories || 0) / selectedUser.performance.discounts.limits.accessories * 100 : 0}
                        color="info"
                        style={{ height: '8px' }}
                        className="mt-1"
                      />
                    </CCol>
                  </CRow>
                </>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default IncentivePerformance;