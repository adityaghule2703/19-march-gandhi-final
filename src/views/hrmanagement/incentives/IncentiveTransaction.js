import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  axiosInstance,
  showError,
  showSuccess
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
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilChevronLeft,
  cilChevronRight,
  cilSearch,
  cilMoney,
  cilUser,
  cilCarAlt,
  cilCalendar,
  cilFile,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilPrint
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const IncentiveTransaction = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncentive: 0,
    totalPaid: 0,
    totalPending: 0,
    count: 0
  });
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
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedTransactionForStatus, setSelectedTransactionForStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState('');
  const [statusError, setStatusError] = useState(''); // Error state for status modal

  // Fetch transactions when page or limit changes
  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTransactions(1, pagination.limit, searchTerm);
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchTransactions = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
        params.append('searchFields', 'bookingNumber,modelName,salesExecutiveName,chassisNumber');
      }
      
      const url = `/incentives/transactions?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        setTransactions(response.data.data.transactions || []);
        setPagination({
          page: response.data.page || page,
          limit: limit,
          totalCount: response.data.total || 0,
          totalPages: response.data.totalPages || 1
        });
        
        // Set summary data
        if (response.data.summary) {
          setSummary({
            totalIncentive: response.data.summary.totalIncentive || 0,
            totalPaid: response.data.summary.totalPaid || 0,
            totalPending: response.data.summary.totalPending || 0,
            count: response.data.summary.count || 0
          });
        }
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.response?.data?.message || 'Failed to fetch transactions');
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

  const handleViewClick = (transaction) => {
    setSelectedTransaction(transaction);
    setViewModalVisible(true);
  };

  const handleStatusClick = (transaction, currentStatus) => {
    setSelectedTransactionForStatus(transaction);
    setPayoutStatus(currentStatus);
    setStatusError(''); // Clear any previous error when opening modal
    setStatusModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTransactionForStatus) return;
    
    setUpdatingStatus(true);
    setStatusError(''); // Clear previous error before request
    
    try {
      const response = await axiosInstance.patch(`/incentives/transactions/${selectedTransactionForStatus._id}/status`, {
        payoutStatus: payoutStatus
      });
      
      if (response.data.status === 'success') {
        showSuccess('Payout status updated successfully!');
        setStatusModalVisible(false);
        setSelectedTransactionForStatus(null);
        setStatusError('');
        fetchTransactions(pagination.page, pagination.limit, searchTerm);
      } else {
        // Handle case where status is not success but no error thrown
        const errorMessage = response.data.message || 'Failed to update status';
        setStatusError(errorMessage);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Extract error message from response
      let errorMessage = 'Failed to update status';
      
      if (error.response && error.response.data) {
        // First check for 'error' field, then 'message' field
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      setStatusError(errorMessage);
    } finally {
      setUpdatingStatus(false);
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

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getPayoutStatusBadge = (status) => {
    if (status === 'paid') {
      return <CBadge color="success"><CIcon icon={cilCheckCircle} className="me-1" />Paid</CBadge>;
    } else if (status === 'pending') {
      return <CBadge color="warning"><CIcon icon={cilWarning} className="me-1" />Pending</CBadge>;
    } else {
      return <CBadge color="secondary">{status}</CBadge>;
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

  if (error && transactions.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Incentive Transactions</div>

      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5 className="text-muted">Total Incentive</h5>
              <h3 className="text-primary">{formatCurrency(summary.totalIncentive)}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5 className="text-muted">Total Paid</h5>
              <h3 className="text-success">{formatCurrency(summary.totalPaid)}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5 className="text-muted">Total Pending</h5>
              <h3 className="text-warning">{formatCurrency(summary.totalPending)}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5 className="text-muted">Total Transactions</h5>
              <h3 className="text-info">{summary.count}</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className='table-container mt-2'>
        <CCardHeader className='card-header'>
          <h6 className="mb-0">Incentive Transactions List</h6>
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
                placeholder="Search by Booking ID, Model, Sales Executive..."
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

          {/* Transactions Table */}
          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Chassis No</CTableHeaderCell>
                  <CTableHeaderCell>Sales Executive</CTableHeaderCell>
                  <CTableHeaderCell>Incentive Amount</CTableHeaderCell>
                  <CTableHeaderCell>Payout Status</CTableHeaderCell>
                  <CTableHeaderCell>Sale Date</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transactions.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={10} style={{ color: 'red', textAlign: 'center' }}>
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No incentive transactions found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  transactions.map((transaction, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={transaction._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell><strong>{transaction.bookingNumber}</strong></CTableDataCell>
                        <CTableDataCell>{transaction.modelName}</CTableDataCell>
                        <CTableDataCell>{transaction.color?.name || '-'}</CTableDataCell>
                        <CTableDataCell>{transaction.chassisNumber}</CTableDataCell>
                        <CTableDataCell>{transaction.salesExecutiveName}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(transaction.incentiveAmount)}</CTableDataCell>
                        <CTableDataCell>{getPayoutStatusBadge(transaction.payoutStatus)}</CTableDataCell>
                        <CTableDataCell>{formatDate(transaction.saleDate)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            <CButton
                              size="sm"
                              color="info"
                              variant="outline"
                              onClick={() => handleViewClick(transaction)}
                              title="View Details"
                            >
                              <CIcon icon={cilFile} />
                            </CButton>
                            <CButton
                              size="sm"
                              color="primary"
                              variant="outline"
                              onClick={() => handleStatusClick(transaction, transaction.payoutStatus)}
                              title="Update Status"
                            >
                              <CIcon icon={cilMoney} />
                            </CButton>
                          </div>
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

      {/* View Transaction Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Transaction Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTransaction && (
            <div>
              <h6 className="mb-3">Incentive Transaction Information</h6>
              
              <CRow className="mb-3">
                
                <CCol md={6}>
                  <small className="text-muted">Booking Number</small>
                  <div><strong>{selectedTransaction.bookingNumber}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Model Name</small>
                  <div><strong>{selectedTransaction.modelName}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Color</small>
                  <div><strong>{selectedTransaction.color?.name}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Chassis Number</small>
                  <div><strong>{selectedTransaction.chassisNumber}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Vehicle Status</small>
                  <div><strong>{selectedTransaction.vehicle?.status}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Sales Executive</small>
                  <div><strong>{selectedTransaction.salesExecutiveName}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Sales Executive Email</small>
                  <div><strong>{selectedTransaction.salesExecutive?.email}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Incentive Amount</small>
                  <div><strong className="text-success">{formatCurrency(selectedTransaction.incentiveAmount)}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Payout Status</small>
                  <div>{getPayoutStatusBadge(selectedTransaction.payoutStatus)}</div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Sale Date</small>
                  <div><strong>{formatDateTime(selectedTransaction.saleDate)}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Created At</small>
                  <div><strong>{formatDateTime(selectedTransaction.createdAt)}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <small className="text-muted">Incentive Plan Details</small>
                  <div className="border rounded p-2 mt-1">
                  
                    <div><strong>Model:</strong> {selectedTransaction.incentivePlan?.modelName}</div>
                    <div><strong>Incentive per Vehicle:</strong> {formatCurrency(selectedTransaction.incentivePlan?.incentivePerVehicle)}</div>
                    <div><strong>Total Pool:</strong> {formatCurrency(selectedTransaction.incentivePlan?.totalIncentivePool)}</div>
                  </div>
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Update Status Modal */}
      <CModal visible={statusModalVisible} onClose={() => {
        setStatusModalVisible(false);
        setStatusError(''); // Clear error when closing modal
      }} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilMoney} className="me-2" />
            Update Payout Status
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTransactionForStatus && (
            <div>
              <p><strong>Booking Number:</strong> {selectedTransactionForStatus.bookingNumber}</p>
              <p><strong>Sales Executive:</strong> {selectedTransactionForStatus.salesExecutiveName}</p>
              <p><strong>Incentive Amount:</strong> {formatCurrency(selectedTransactionForStatus.incentiveAmount)}</p>
              
              {/* Display error message inside modal */}
              {statusError && (
                <CAlert color="danger" className="mt-3 mb-3">
                  <CIcon icon={cilXCircle} className="me-2" />
                  {statusError}
                </CAlert>
              )}
              
              <div className="mb-3">
                <label className="form-label">Payout Status <span className="required">*</span></label>
                <CFormSelect
                  value={payoutStatus}
                  onChange={(e) => {
                    setPayoutStatus(e.target.value);
                    setStatusError(''); // Clear error when user changes selection
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </CFormSelect>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {
            setStatusModalVisible(false);
            setStatusError(''); // Clear error on cancel
          }}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateStatus} disabled={updatingStatus}>
            {updatingStatus ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Status'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default IncentiveTransaction;




// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import {
//   axiosInstance,
//   showError,
//   showSuccess
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
//   CCol,
//   CAlert,
//   CInputGroup,
//   CInputGroupText
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilChevronLeft,
//   cilChevronRight,
//   cilSearch,
//   cilMoney,
//   cilUser,
//   cilCarAlt,
//   cilCalendar,
//   cilFile,
//   cilCheckCircle,
//   cilXCircle,
//   cilWarning,
//   cilPrint
// } from '@coreui/icons';
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

// const IncentiveTransaction = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Data state
//   const [transactions, setTransactions] = useState([]);
//   const [summary, setSummary] = useState({
//     totalIncentive: 0,
//     totalPaid: 0,
//     totalPending: 0,
//     count: 0
//   });
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
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
//   const [selectedTransactionForStatus, setSelectedTransactionForStatus] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [payoutStatus, setPayoutStatus] = useState('');

//   const { permissions = [] } = useAuth();

//   // Permission checks for HR Management - Incentive Transactions page
//   // Using PAGES.HR_MANAGEMENT constants for page-level permissions
//   const canViewIncentiveTransactions = canViewPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.INCENTIVE_TRANSACTIONS);
//   const canUpdateIncentiveTransactions = canUpdateInPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.INCENTIVE_TRANSACTIONS);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasUpdatePermission = hasSafePagePermission(
//     permissions, 
//     MODULES.HR_MANAGEMENT, 
//     PAGES.HR_MANAGEMENT.INCENTIVE_TRANSACTIONS, 
//     ACTIONS.UPDATE
//   );
  
//   // Combined permission check for update action
//   const canPerformUpdate = canUpdateIncentiveTransactions || hasUpdatePermission;

//   // Fetch transactions when page or limit changes
//   useEffect(() => {
//     if (canViewIncentiveTransactions) {
//       fetchTransactions();
//     }
//   }, [pagination.page, pagination.limit]);

//   // Debounced search
//   useEffect(() => {
//     if (!canViewIncentiveTransactions) return;
    
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchTransactions(1, pagination.limit, searchTerm);
//     }, 400);
    
//     return () => clearTimeout(searchTimer.current);
//   }, [searchTerm]);

//   const fetchTransactions = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     // Check if user has permission to view incentive transactions
//     if (!canViewIncentiveTransactions) {
//       setError('You do not have permission to view incentive transactions');
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
//         params.append('searchFields', 'bookingNumber,modelName,salesExecutiveName,chassisNumber');
//       }
      
//       const url = `/incentives/transactions?${params.toString()}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.status === 'success') {
//         setTransactions(response.data.data.transactions || []);
//         setPagination({
//           page: response.data.page || page,
//           limit: limit,
//           totalCount: response.data.total || 0,
//           totalPages: response.data.totalPages || 1
//         });
        
//         // Set summary data
//         if (response.data.summary) {
//           setSummary({
//             totalIncentive: response.data.summary.totalIncentive || 0,
//             totalPaid: response.data.summary.totalPaid || 0,
//             totalPending: response.data.summary.totalPending || 0,
//             count: response.data.summary.count || 0
//           });
//         }
//       }
      
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       setError(error.response?.data?.message || 'Failed to fetch transactions');
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

//   const handleViewClick = (transaction) => {
//     // Check view permission before viewing details
//     if (!canViewIncentiveTransactions) {
//       showError('You do not have permission to view transaction details');
//       return;
//     }
//     setSelectedTransaction(transaction);
//     setViewModalVisible(true);
//   };

//   const handleStatusClick = (transaction, currentStatus) => {
//     // Check update permission before updating status
//     if (!canPerformUpdate) {
//       showError('You do not have permission to update payout status');
//       return;
//     }
//     setSelectedTransactionForStatus(transaction);
//     setPayoutStatus(currentStatus);
//     setStatusModalVisible(true);
//   };

//   const handleUpdateStatus = async () => {
//     // Check update permission before updating
//     if (!canPerformUpdate) {
//       showError('You do not have permission to update payout status');
//       return;
//     }
    
//     if (!selectedTransactionForStatus) return;
    
//     setUpdatingStatus(true);
//     try {
//       const response = await axiosInstance.patch(`/incentives/transactions/${selectedTransactionForStatus._id}/status`, {
//         payoutStatus: payoutStatus
//       });
      
//       if (response.data.status === 'success') {
//         showSuccess('Payout status updated successfully!');
//         setStatusModalVisible(false);
//         setSelectedTransactionForStatus(null);
//         fetchTransactions(pagination.page, pagination.limit, searchTerm);
//       } else {
//         showError(response.data.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       showError(error.response?.data?.message || 'Failed to update status');
//     } finally {
//       setUpdatingStatus(false);
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

//   const formatDateTime = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatCurrency = (amount) => {
//     if (!amount && amount !== 0) return '-';
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

//   const getPayoutStatusBadge = (status) => {
//     if (status === 'paid') {
//       return <CBadge color="success"><CIcon icon={cilCheckCircle} className="me-1" />Paid</CBadge>;
//     } else if (status === 'pending') {
//       return <CBadge color="warning"><CIcon icon={cilWarning} className="me-1" />Pending</CBadge>;
//     } else {
//       return <CBadge color="secondary">{status}</CBadge>;
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

//   // If user doesn't have permission to view incentive transactions, show access denied message
//   if (!canViewIncentiveTransactions) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Incentive Transactions.
//       </div>
//     );
//   }

//   if (error && transactions.length === 0) {
//     return <div className="alert alert-danger m-3">{error}</div>;
//   }

//   return (
//     <div>
//       <div className='title'>Incentive Transactions</div>

//       {/* Summary Cards */}
//       <CRow className="mb-4">
//         <CCol md={3}>
//           <CCard className="text-center">
//             <CCardBody>
//               <h5 className="text-muted">Total Incentive</h5>
//               <h3 className="text-primary">{formatCurrency(summary.totalIncentive)}</h3>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center">
//             <CCardBody>
//               <h5 className="text-muted">Total Paid</h5>
//               <h3 className="text-success">{formatCurrency(summary.totalPaid)}</h3>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center">
//             <CCardBody>
//               <h5 className="text-muted">Total Pending</h5>
//               <h3 className="text-warning">{formatCurrency(summary.totalPending)}</h3>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol md={3}>
//           <CCard className="text-center">
//             <CCardBody>
//               <h5 className="text-muted">Total Transactions</h5>
//               <h3 className="text-info">{summary.count}</h3>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       <CCard className='table-container mt-2'>
//         <CCardHeader className='card-header'>
//           <h6 className="mb-0">Incentive Transactions List</h6>
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
//                 placeholder="Search by Booking ID, Model, Sales Executive..."
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

//           {/* Transactions Table */}
//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis No</CTableHeaderCell>
//                   <CTableHeaderCell>Sales Executive</CTableHeaderCell>
//                   <CTableHeaderCell>Incentive Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Payout Status</CTableHeaderCell>
//                   <CTableHeaderCell>Sale Date</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {transactions.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={10} style={{ color: 'red', textAlign: 'center' }}>
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No incentive transactions found.'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   transactions.map((transaction, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={transaction._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell><strong>{transaction.bookingNumber}</strong></CTableDataCell>
//                         <CTableDataCell>{transaction.modelName}</CTableDataCell>
//                         <CTableDataCell>{transaction.color?.name || '-'}</CTableDataCell>
//                         <CTableDataCell>{transaction.chassisNumber}</CTableDataCell>
//                         <CTableDataCell>{transaction.salesExecutiveName}</CTableDataCell>
//                         <CTableDataCell>{formatCurrency(transaction.incentiveAmount)}</CTableDataCell>
//                         <CTableDataCell>{getPayoutStatusBadge(transaction.payoutStatus)}</CTableDataCell>
//                         <CTableDataCell>{formatDate(transaction.saleDate)}</CTableDataCell>
//                         <CTableDataCell>
//                           <div className="d-flex gap-1">
//                             {/* View Details button - requires VIEW permission */}
//                             {canViewIncentiveTransactions && (
//                               <CButton
//                                 size="sm"
//                                 color="info"
//                                 variant="outline"
//                                 onClick={() => handleViewClick(transaction)}
//                                 title="View Details"
//                               >
//                                 <CIcon icon={cilFile} />
//                               </CButton>
//                             )}
                            
//                             {/* Update Status button - requires UPDATE permission */}
//                             {canPerformUpdate && (
//                               <CButton
//                                 size="sm"
//                                 color="primary"
//                                 variant="outline"
//                                 onClick={() => handleStatusClick(transaction, transaction.payoutStatus)}
//                                 title="Update Status"
//                               >
//                                 <CIcon icon={cilMoney} />
//                               </CButton>
//                             )}
//                           </div>
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

//       {/* View Transaction Modal - only shown if user has view permission */}
//       <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center">
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Transaction Details
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedTransaction && (
//             <div>
//               <h6 className="mb-3">Incentive Transaction Information</h6>
              
//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Booking Number</small>
//                   <div><strong>{selectedTransaction.bookingNumber}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Model Name</small>
//                   <div><strong>{selectedTransaction.modelName}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Color</small>
//                   <div><strong>{selectedTransaction.color?.name}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Chassis Number</small>
//                   <div><strong>{selectedTransaction.chassisNumber}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Vehicle Status</small>
//                   <div><strong>{selectedTransaction.vehicle?.status}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Sales Executive</small>
//                   <div><strong>{selectedTransaction.salesExecutiveName}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Sales Executive Email</small>
//                   <div><strong>{selectedTransaction.salesExecutive?.email}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Incentive Amount</small>
//                   <div><strong className="text-success">{formatCurrency(selectedTransaction.incentiveAmount)}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Payout Status</small>
//                   <div>{getPayoutStatusBadge(selectedTransaction.payoutStatus)}</div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <small className="text-muted">Sale Date</small>
//                   <div><strong>{formatDateTime(selectedTransaction.saleDate)}</strong></div>
//                 </CCol>
//                 <CCol md={6}>
//                   <small className="text-muted">Created At</small>
//                   <div><strong>{formatDateTime(selectedTransaction.createdAt)}</strong></div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={12}>
//                   <small className="text-muted">Incentive Plan Details</small>
//                   <div className="border rounded p-2 mt-1">
//                     <div><strong>Model:</strong> {selectedTransaction.incentivePlan?.modelName}</div>
//                     <div><strong>Incentive per Vehicle:</strong> {formatCurrency(selectedTransaction.incentivePlan?.incentivePerVehicle)}</div>
//                     <div><strong>Total Pool:</strong> {formatCurrency(selectedTransaction.incentivePlan?.totalIncentivePool)}</div>
//                   </div>
//                 </CCol>
//               </CRow>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Update Status Modal - only shown if user has update permission */}
//       {canPerformUpdate && (
//         <CModal visible={statusModalVisible} onClose={() => setStatusModalVisible(false)} alignment="center">
//           <CModalHeader>
//             <CModalTitle>
//               <CIcon icon={cilMoney} className="me-2" />
//               Update Payout Status
//             </CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             {selectedTransactionForStatus && (
//               <div>
//                 <p><strong>Booking Number:</strong> {selectedTransactionForStatus.bookingNumber}</p>
//                 <p><strong>Sales Executive:</strong> {selectedTransactionForStatus.salesExecutiveName}</p>
//                 <p><strong>Incentive Amount:</strong> {formatCurrency(selectedTransactionForStatus.incentiveAmount)}</p>
                
//                 <div className="mb-3">
//                   <label className="form-label">Payout Status <span className="required">*</span></label>
//                   <CFormSelect
//                     value={payoutStatus}
//                     onChange={(e) => setPayoutStatus(e.target.value)}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="paid">Paid</option>
//                   </CFormSelect>
//                 </div>
//               </div>
//             )}
//           </CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={() => setStatusModalVisible(false)}>Cancel</CButton>
//             <CButton color="primary" onClick={handleUpdateStatus} disabled={updatingStatus}>
//               {updatingStatus ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Status'}
//             </CButton>
//           </CModalFooter>
//         </CModal>
//       )}
//     </div>
//   );
// };

// export default IncentiveTransaction;