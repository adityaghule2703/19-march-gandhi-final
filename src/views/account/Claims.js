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
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import { 
  cilZoomOut, 
  cilChevronLeft, 
  cilChevronRight,
  cilSearch,
  cilFile,
  cilImage,
  cilMoney,
  cilDescription,
  cilPrint,
  cilSettings,
  cilCheckCircle,
  cilXCircle,
  cilCloudDownload,
  cilPlus,
  cilInfo
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { axiosInstance, showError, showSuccess } from '../../utils/tableImports';
import { confirmVerify } from '../../utils/sweetAlerts';
import { Menu, MenuItem } from '@mui/material';

// Tab constants
const TAB = {
  PENDING: 0,
  PARTIALLY_PAID: 1,
  PAID: 2
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Payment mode options
const PAYMENT_MODES = ['Cash', 'Bank', 'Finance Disbursement', 'Exchange', 'Pay Order'];

// Empty tab state
const emptyTab = () => ({
  claims: [],
  total: 0,
  pages: 0,
  currentPage: 1,
  limit: DEFAULT_LIMIT,
  loading: false,
  search: '',
});

const Claims = () => {
  const [activeTab, setActiveTab] = useState(TAB.PENDING);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Per-tab independent state
  const [tabData, setTabData] = useState(() => ({
    [TAB.PENDING]: emptyTab(),
    [TAB.PARTIALLY_PAID]: emptyTab(),
    [TAB.PAID]: emptyTab()
  }));
  
  // Local search state for display
  const [localSearch, setLocalSearch] = useState('');
  
  // Update Claim modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdateClaim, setSelectedUpdateClaim] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    amountReceived: '',
    claimReceivedNo: '',
    claimReceivedDate: '',
    claimReceivedRemarks: '',
    paymentMode: '',
    transactionReference: ''
  });
  
  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuClaimId, setMenuClaimId] = useState(null);
  
  // Debounce timer
  const searchTimer = useRef(null);
  // Uncontrolled search input ref
  const searchInputRef = useRef(null);
  // Active tab ref for debounce
  const activeTabRef = useRef(activeTab);
  
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  // Helper: update a single tab's slice
  const setTab = useCallback((tabIndex, updates) => {
    setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } }));
  }, []);

  // Fetch claims for specific tab
  const fetchClaims = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
    setTab(tabIndex, { loading: true });
    
    // Map tab to claim status
    let claimStatus = '';
    switch (tabIndex) {
      case TAB.PENDING:
        claimStatus = 'PENDING';
        break;
      case TAB.PARTIALLY_PAID:
        claimStatus = 'PARTIALLY_PAID';
        break;
      case TAB.PAID:
        claimStatus = 'PAID';
        break;
      default:
        claimStatus = 'PENDING';
    }
    
    try {
      const params = {
        page,
        limit,
        claimStatus,
        ...(search && { search: search.trim() })
      };
      
      const response = await axiosInstance.get('/claims', { params });
      
      if (response.data?.success && response.data?.data) {
        const claimsData = response.data.data.claims || [];
        const pagination = response.data.data.pagination || {};
        
        setTab(tabIndex, {
          claims: claimsData,
          total: pagination.total || 0,
          pages: pagination.pages || 0,
          currentPage: pagination.page || page,
          limit: pagination.limit || limit,
          loading: false,
          search
        });
      } else {
        setTab(tabIndex, { loading: false, claims: [], total: 0 });
        showError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
      showError(err);
      setTab(tabIndex, { loading: false, claims: [], total: 0 });
    }
  }, [setTab]);

  // Handle search with debounce
  const handleSearch = useCallback((value) => {
    setLocalSearch(value);
    
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const tab = activeTabRef.current;
      const limit = tabData[tab]?.limit || DEFAULT_LIMIT;
      fetchClaims(tab, 1, limit, value);
    }, 500);
  }, [fetchClaims, tabData]);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    clearTimeout(searchTimer.current);
    setActiveTab(tab);
    setLocalSearch('');
    if (searchInputRef.current) searchInputRef.current.value = '';
    
    setTabData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], search: '' }
    }));
    
    const limit = tabData[tab]?.limit || DEFAULT_LIMIT;
    fetchClaims(tab, 1, limit, '');
  }, [fetchClaims, tabData]);

  // Refresh current tab
  const refreshTab = useCallback(() => {
    const tab = activeTab;
    const limit = tabData[tab]?.limit || DEFAULT_LIMIT;
    const search = tabData[tab]?.search || '';
    fetchClaims(tab, 1, limit, search);
  }, [activeTab, fetchClaims, tabData]);

  // Initial load
  useEffect(() => {
    fetchClaims(TAB.PENDING, 1, DEFAULT_LIMIT, '');
    fetchClaims(TAB.PARTIALLY_PAID, 1, DEFAULT_LIMIT, '');
    fetchClaims(TAB.PAID, 1, DEFAULT_LIMIT, '');
  }, [fetchClaims]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((tabIndex, newPage) => {
    const td = tabData[tabIndex];
    if (newPage < 1 || newPage > td.pages) return;
    fetchClaims(tabIndex, newPage, td.limit, td.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchClaims, tabData]);

  const handleLimitChange = useCallback((tabIndex, newLimit) => {
    const limit = parseInt(newLimit, 10);
    const td = tabData[tabIndex];
    fetchClaims(tabIndex, 1, limit, td.search);
  }, [fetchClaims, tabData]);

  // Update Claim (Receive Payment)
  const handleUpdateClaim = (claim) => {
    setSelectedUpdateClaim(claim);
    setUpdateFormData({
      amountReceived: claim.claimDetails?.pendingAmount?.toString() || '',
      claimReceivedNo: '',
      claimReceivedDate: new Date().toISOString().split('T')[0],
      claimReceivedRemarks: '',
      paymentMode: '',
      transactionReference: ''
    });
    setShowUpdateModal(true);
    handleMenuClose();
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({ ...prev, [name]: value }));
  };

  const confirmUpdateClaim = async () => {
    // Validation
    if (!updateFormData.amountReceived || parseFloat(updateFormData.amountReceived) <= 0) {
      showError('Please enter a valid amount received');
      return;
    }
    if (!updateFormData.claimReceivedNo) {
      showError('Please enter a claim received number');
      return;
    }
    if (!updateFormData.claimReceivedDate) {
      showError('Please select a claim received date');
      return;
    }
    if (!updateFormData.paymentMode) {
      showError('Please select a payment mode');
      return;
    }

    setUpdateLoading(true);
    try {
      const payload = {
        amountReceived: parseFloat(updateFormData.amountReceived),
        claimReceivedNo: updateFormData.claimReceivedNo,
        claimReceivedDate: updateFormData.claimReceivedDate,
        claimReceivedRemarks: updateFormData.claimReceivedRemarks || '',
        paymentMode: updateFormData.paymentMode,
        transactionReference: updateFormData.transactionReference || ''
      };

      await axiosInstance.put(`/claims/${selectedUpdateClaim._id}/receive`, payload);
      showSuccess('Claim payment received successfully!');
      setShowUpdateModal(false);
      setSelectedUpdateClaim(null);
      setUpdateFormData({
        amountReceived: '',
        claimReceivedNo: '',
        claimReceivedDate: '',
        claimReceivedRemarks: '',
        paymentMode: '',
        transactionReference: ''
      });
      refreshTab();
    } catch (error) {
      console.error('Error updating claim:', error);
      showError(error, 'Failed to update claim');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Menu handlers
  const handleMenuClick = (event, claimId) => {
    setAnchorEl(event.currentTarget);
    setMenuClaimId(claimId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuClaimId(null);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get claim status badge
  const getClaimStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'warning', label: 'PENDING' },
      'PARTIALLY_PAID': { color: 'info', label: 'PARTIALLY PAID' },
      'PAID': { color: 'success', label: 'PAID' },
      'REJECTED': { color: 'danger', label: 'REJECTED' }
    };
    const config = statusConfig[status] || { color: 'secondary', label: status || 'N/A' };
    return <CBadge color={config.color}>{config.label}</CBadge>;
  };

  // Render pagination
  const renderPagination = (tabIndex) => {
    const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
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
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
              Rows per page:
            </CFormLabel>
            <CFormSelect
              value={limit}
              onChange={(e) => handleLimitChange(tabIndex, e.target.value)}
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
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} claims`}
          </span>
        </div>
        
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            
            {pageNums.map(page => (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(tabIndex, page)}
                disabled={loading}
              >
                {page}
              </CPaginationItem>
            ))}
            
            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}
            
            <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // Render table for a specific tab
  const renderClaimsTable = (tabIndex) => {
    const { claims, loading, search } = tabData[tabIndex];
    const startRecord = (tabData[tabIndex].currentPage - 1) * tabData[tabIndex].limit + 1;
    
    // Show update option only for PENDING and PARTIALLY_PAID tabs
    const showUpdateOption = tabIndex === TAB.PENDING || tabIndex === TAB.PARTIALLY_PAID;
    
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
                <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                <CTableHeaderCell>Booking No.</CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Mobile</CTableHeaderCell>
                <CTableHeaderCell>Model</CTableHeaderCell>
                <CTableHeaderCell>Chassis No.</CTableHeaderCell>
                <CTableHeaderCell>Branch</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Claim Amount</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Amount Received</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Pending Amount</CTableHeaderCell>
                <CTableHeaderCell>Claim Status</CTableHeaderCell>
                <CTableHeaderCell>Claim Date</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '80px' }}>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {claims.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={13} className="text-center text-danger">
                    {search ? `No claims found matching "${search}"` : 'No claims available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                claims.map((claim, index) => (
                  <CTableRow key={claim._id}>
                    <CTableDataCell>{startRecord + index}</CTableDataCell>
                    <CTableDataCell>
                      <strong>{claim.bookingNumber}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{claim.customerName}</CTableDataCell>
                    <CTableDataCell>{claim.customerMobile}</CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div><small>{claim.modelName}</small></div>
                        <div><small className="text-muted">{claim.modelType}</small></div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="fw-mono">{claim.chassisNumber}</CTableDataCell>
                    <CTableDataCell>{claim.branch}</CTableDataCell>
                    <CTableDataCell className="text-end fw-bold">
                      {formatCurrency(claim.claimDetails?.priceClaim)}
                    </CTableDataCell>
                    <CTableDataCell className="text-end text-success">
                      {formatCurrency(claim.claimDetails?.amountReceived)}
                    </CTableDataCell>
                    <CTableDataCell className="text-end text-warning">
                      {formatCurrency(claim.claimDetails?.pendingAmount)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {getClaimStatusBadge(claim.claimDetails?.status)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(claim.claimDetails?.createdAt)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className='option-button btn-sm' 
                        onClick={(e) => handleMenuClick(e, claim._id)}
                      >
                        <CIcon icon={cilSettings} /> Options
                      </CButton>
                      <Menu 
                        anchorEl={anchorEl} 
                        open={menuClaimId === claim._id} 
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={() => handleViewClaim(claim)}>
                          <CIcon icon={cilFile} className="me-2" /> View Details
                        </MenuItem>
                        {showUpdateOption && claim.claimDetails?.status !== 'PAID' && (
                          <MenuItem onClick={() => handleUpdateClaim(claim)}>
                            <CIcon icon={cilPlus} className="me-2" style={{ color: 'blue' }} /> Update Claim
                          </MenuItem>
                        )}
                      </Menu>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(tabIndex)}
      </>
    );
  };

  // View claim details
  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setClaimModalVisible(true);
    handleMenuClose();
  };

  return (
    <div>
      <div className='title'>Claims Management</div>
      
      {successMessage && <CAlert color="success" className="mb-3">{successMessage}</CAlert>}

      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Tabs */}
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === TAB.PENDING}
                onClick={() => handleTabChange(TAB.PENDING)}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === TAB.PENDING ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Pending ({tabData[TAB.PENDING]?.total || 0})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === TAB.PARTIALLY_PAID}
                onClick={() => handleTabChange(TAB.PARTIALLY_PAID)}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === TAB.PARTIALLY_PAID ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Partially Paid ({tabData[TAB.PARTIALLY_PAID]?.total || 0})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === TAB.PAID}
                onClick={() => handleTabChange(TAB.PAID)}
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === TAB.PAID ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Paid ({tabData[TAB.PAID]?.total || 0})
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* Search Bar - Uncontrolled input */}
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
                placeholder="Search by booking no, chassis, customer..."
                autoComplete="off"
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === TAB.PENDING}>
              {renderClaimsTable(TAB.PENDING)}
            </CTabPane>
            <CTabPane visible={activeTab === TAB.PARTIALLY_PAID}>
              {renderClaimsTable(TAB.PARTIALLY_PAID)}
            </CTabPane>
            <CTabPane visible={activeTab === TAB.PAID}>
              {renderClaimsTable(TAB.PAID)}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Claim Details Modal */}
      <CModal 
        visible={claimModalVisible} 
        onClose={() => setClaimModalVisible(false)} 
        size="lg"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            Claim Details - {selectedClaim?.bookingNumber}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedClaim && (
            <>
              {/* Booking Information */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">Booking Information</h6>
                <CRow>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Booking Number</small>
                    <div className="fw-bold">{selectedClaim.bookingNumber}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Customer Name</small>
                    <div className="fw-bold">{selectedClaim.customerName}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Mobile</small>
                    <div className="fw-bold">{selectedClaim.customerMobile}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Customer ID</small>
                    <div className="fw-bold">{selectedClaim.customerCustId}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Branch</small>
                    <div className="fw-bold">{selectedClaim.branch}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Booking Type</small>
                    <div>
                      <CBadge color={selectedClaim.bookingType === 'BRANCH' ? 'success' : 'info'}>
                        {selectedClaim.bookingType}
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Vehicle Information */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">Vehicle Information</h6>
                <CRow>
                  <CCol md={6} sm={6}>
                    <small className="text-muted">Model Name</small>
                    <div className="fw-bold">{selectedClaim.modelName}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Type</small>
                    <div>
                      <CBadge color={selectedClaim.modelType === 'ICE' ? 'primary' : 'success'}>
                        {selectedClaim.modelType}
                      </CBadge>
                    </div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Color</small>
                    <div className="fw-bold">{selectedClaim.colorName}</div>
                  </CCol>
                  <CCol md={12}>
                    <small className="text-muted">Chassis Number</small>
                    <div className="fw-bold fw-mono">{selectedClaim.chassisNumber}</div>
                  </CCol>
                </CRow>
              </div>

              {/* Claim Information */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">Claim Information</h6>
                <CRow>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Claim Amount</small>
                    <div className="fw-bold text-info">
                      {formatCurrency(selectedClaim.claimDetails?.priceClaim)}
                    </div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Amount Received</small>
                    <div className="fw-bold text-success">
                      {formatCurrency(selectedClaim.claimDetails?.amountReceived)}
                    </div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Pending Amount</small>
                    <div className="fw-bold text-warning">
                      {formatCurrency(selectedClaim.claimDetails?.pendingAmount)}
                    </div>
                  </CCol>
                  <CCol md={6} sm={6}>
                    <small className="text-muted">Claim Status</small>
                    <div>
                      {getClaimStatusBadge(selectedClaim.claimDetails?.status)}
                    </div>
                  </CCol>
                  <CCol md={6} sm={6}>
                    <small className="text-muted">Claim Date</small>
                    <div className="fw-bold">{formatDate(selectedClaim.claimDetails?.createdAt)}</div>
                  </CCol>
                  {selectedClaim.claimDetails?.rejectionReason && (
                    <CCol md={12}>
                      <small className="text-muted">Rejection Reason</small>
                      <div className="mt-1 p-2 bg-white rounded border text-danger">
                        {selectedClaim.claimDetails.rejectionReason}
                      </div>
                    </CCol>
                  )}
                  <CCol md={12}>
                    <small className="text-muted">Description</small>
                    <div className="mt-1 p-2 bg-white rounded border">
                      <CIcon icon={cilDescription} className="me-2 text-muted" />
                      {selectedClaim.claimDetails?.description || 'No description provided'}
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Documents */}
              {selectedClaim.claimDetails?.documents?.length > 0 && (
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="mb-3">
                    <CIcon icon={cilFile} className="me-2" />
                    Documents ({selectedClaim.claimDetails.documents.length})
                  </h6>
                  <div className="d-flex flex-wrap gap-3">
                    {selectedClaim.claimDetails.documents.map((doc, idx) => (
                      <div key={idx} className="text-center">
                        {doc.mimetype?.startsWith('image/') ? (
                          <a 
                            href={`${axiosInstance.defaults.baseURL}${doc.path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <div 
                              className="border rounded p-2 text-center"
                              style={{ width: '100px', cursor: 'pointer' }}
                            >
                              <CIcon icon={cilImage} size="2xl" className="text-primary mb-1" />
                              <div className="small text-truncate" style={{ maxWidth: '90px' }}>
                                {doc.originalName}
                              </div>
                            </div>
                          </a>
                        ) : (
                          <a 
                            href={`${axiosInstance.defaults.baseURL}${doc.path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <div 
                              className="border rounded p-2 text-center"
                              style={{ width: '100px', cursor: 'pointer' }}
                            >
                              <CIcon icon={cilFile} size="2xl" className="text-danger mb-1" />
                              <div className="small text-truncate" style={{ maxWidth: '90px' }}>
                                {doc.originalName}
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Information */}
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-3">
                  <CIcon icon={cilMoney} className="me-2" />
                  Financial Details
                </h6>
                <CRow>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Total Amount</small>
                    <div className="fw-bold">{formatCurrency(selectedClaim.financials?.totalAmount)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Discounted Amount</small>
                    <div className="fw-bold">{formatCurrency(selectedClaim.financials?.discountedAmount)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Received Amount</small>
                    <div className="fw-bold text-success">{formatCurrency(selectedClaim.financials?.receivedAmount)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Balance Amount</small>
                    <div className="fw-bold text-warning">{formatCurrency(selectedClaim.financials?.balanceAmount)}</div>
                  </CCol>
                </CRow>
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setClaimModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Update Claim Modal - Receive Payment - Wider with side by side layout */}
      <CModal 
        alignment="center" 
        visible={showUpdateModal} 
        onClose={() => setShowUpdateModal(false)} 
        size="xl"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>Update Claim - Receive Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUpdateClaim && (
            <>
              {/* Summary Cards */}
              <div className="mb-4 p-3 bg-light rounded">
                <CRow>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Booking Number</small>
                    <div className="fw-bold h5 mb-0">{selectedUpdateClaim.bookingNumber}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Customer Name</small>
                    <div className="fw-bold h5 mb-0">{selectedUpdateClaim.customerName}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Claim Amount</small>
                    <div className="fw-bold h5 mb-0 text-info">{formatCurrency(selectedUpdateClaim.claimDetails?.priceClaim)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Pending Amount</small>
                    <div className="fw-bold h5 mb-0 text-warning">{formatCurrency(selectedUpdateClaim.claimDetails?.pendingAmount)}</div>
                  </CCol>
                </CRow>
              </div>

              {/* Form Fields - Side by side layout */}
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Amount Received <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      type="number"
                      name="amountReceived"
                      value={updateFormData.amountReceived}
                      onChange={handleUpdateFormChange}
                      placeholder="Enter amount received"
                      disabled={updateLoading}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Claim Received No. <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      type="text"
                      name="claimReceivedNo"
                      value={updateFormData.claimReceivedNo}
                      onChange={handleUpdateFormChange}
                      placeholder="e.g., CR-2024-001"
                      disabled={updateLoading}
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Claim Received Date <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      type="date"
                      name="claimReceivedDate"
                      value={updateFormData.claimReceivedDate}
                      onChange={handleUpdateFormChange}
                      disabled={updateLoading}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Payment Mode <span className="text-danger">*</span></CFormLabel>
                    <CFormSelect
                      name="paymentMode"
                      value={updateFormData.paymentMode}
                      onChange={handleUpdateFormChange}
                      disabled={updateLoading}
                    >
                      <option value="">Select Payment Mode</option>
                      {PAYMENT_MODES.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Transaction Reference</CFormLabel>
                    <CFormInput
                      type="text"
                      name="transactionReference"
                      value={updateFormData.transactionReference}
                      onChange={handleUpdateFormChange}
                      placeholder="e.g., NEFT123456789, Cheque No, etc."
                      disabled={updateLoading}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Remarks</CFormLabel>
                    <CFormInput
                      type="text"
                      name="claimReceivedRemarks"
                      value={updateFormData.claimReceivedRemarks}
                      onChange={handleUpdateFormChange}
                      placeholder="Any additional remarks"
                      disabled={updateLoading}
                    />
                  </div>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowUpdateModal(false)} disabled={updateLoading}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={confirmUpdateClaim} 
            disabled={
              !updateFormData.amountReceived || 
              parseFloat(updateFormData.amountReceived) <= 0 ||
              !updateFormData.claimReceivedNo ||
              !updateFormData.claimReceivedDate ||
              !updateFormData.paymentMode ||
              updateLoading
            }
          >
            {updateLoading ? <><CSpinner size="sm" className="me-2" />Processing...</> : 'Submit Payment'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Claims;