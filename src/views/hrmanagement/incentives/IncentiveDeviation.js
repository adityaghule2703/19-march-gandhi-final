import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  axiosInstance,
  showError,
  showSuccess,
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
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CCloseButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilPlus,
  cilTrash,
  cilSearch,
  cilChartPie,
  cilUser,
  cilWarning,
  cilCheckCircle,
  cilMoney,
  cilFile,
  cilCalendar,
  cilList,
  cilBuilding,
  cilReload,
  cilCart
} from '@coreui/icons';
import Select from 'react-select';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Deviation Type options
const DEVIATION_TYPE_OPTIONS = [
  { value: 'price_discount', label: 'Price Discount' },
  { value: 'addon_discount', label: 'Addon Discount' },
  { value: 'scheme_override', label: 'Scheme Override' },
  { value: 'special_bonus', label: 'Special Bonus' },
  { value: 'other', label: 'Other' }
];

// Status options
const STATUS_OPTIONS = [
  { value: 'used', label: 'Used', color: 'warning' },
  { value: 'recovered', label: 'Recovered', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'secondary' }
];

const IncentiveDeviation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Branch state
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Data state
  const [deviations, setDeviations] = useState([]);
  const [summary, setSummary] = useState(null);
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
  
  // Dropdown data
  const [schemes, setSchemes] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedDeviation, setSelectedDeviation] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Apply to Sale state
  const [applyBookings, setApplyBookings] = useState([]);
  const [applyBookingsLoading, setApplyBookingsLoading] = useState(false);
  const [selectedBookingForApply, setSelectedBookingForApply] = useState(null);
  const [applyFormData, setApplyFormData] = useState({
    vehicleId: '',
    chassisNumber: ''
  });
  const [applyFormErrors, setApplyFormErrors] = useState({});
  const [applyApiError, setApplyApiError] = useState(null);
  const [applySubmitting, setApplySubmitting] = useState(false);
  
  // Form state - vehicleId and bookingId are stored but not displayed
  const [formData, setFormData] = useState({
    incentiveSchemeId: '',
    forExecutiveId: '',
    deviationType: '',
    schemeAmount: '',
    deviationAmount: '',
    vehicleId: '',      // Hidden field - passed in payload
    bookingId: '',      // Hidden field - passed in payload
    chassisNumber: '',
    bookingNumber: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch deviations when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchDeviations();
      fetchSchemes();
      fetchUsers();
      fetchBookings();
    }
  }, [selectedBranchId, pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchDeviations(1, pagination.limit, searchTerm);
      }
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      if (response.data.success) {
        setBranches(response.data.data || []);
        setIsSuperAdmin(response.data.isSuperAdmin || false);
        
        if (response.data.isSuperAdmin) {
          setSelectedBranchId('');
        } else if (response.data.userBranch && response.data.userBranch._id) {
          setSelectedBranchId(response.data.userBranch._id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError('Failed to fetch branches');
    }
  };

  const fetchDeviations = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    if (!selectedBranchId) {
      setDeviations([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      params.append('branchId', selectedBranchId);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/incentives/deviations?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        setDeviations(response.data.data?.deviations || []);
        setSummary(response.data.summary || null);
        setPagination({
          page: response.data.page || page,
          limit: limit,
          totalCount: response.data.total || response.data.data?.deviations?.length || 0,
          totalPages: response.data.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching deviations:', error);
      setError(error.response?.data?.message || 'Failed to fetch deviations');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemes = async () => {
    if (!selectedBranchId) return;
    
    try {
      setSchemesLoading(true);
      const response = await axiosInstance.get(`/incentives/schemes?branchId=${selectedBranchId}`);
      if (response.data.status === 'success') {
        // Filter only ACTIVE schemes
        const activeSchemes = response.data.data?.schemes?.filter(s => s.status === 'ACTIVE') || [];
        setSchemes(activeSchemes);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
      showError('Failed to fetch schemes');
    } finally {
      setSchemesLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axiosInstance.get('/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!selectedBranchId) return;
    
    try {
      setBookingsLoading(true);
      const response = await axiosInstance.get('/bookings/with-incentive');
      if (response.data.success) {
        setBookings(response.data.data?.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError('Failed to fetch bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch bookings for Apply to Sale modal
  const fetchApplyBookings = async () => {
    if (!selectedBranchId) return;
    
    try {
      setApplyBookingsLoading(true);
      const response = await axiosInstance.get('/bookings/with-incentive');
      if (response.data.success) {
        setApplyBookings(response.data.data?.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError('Failed to fetch bookings');
    } finally {
      setApplyBookingsLoading(false);
    }
  };

  // Format users for react-select
  const userOptions = users.map(user => ({
    value: user._id,
    label: `${user.name} (${user.email})`
  }));

  // Format bookings for react-select
  const bookingOptions = bookings.map(booking => ({
    value: booking._id,
    label: `${booking.bookingNumber} - ${booking.model?.model_name || 'N/A'} (${booking.chassisNumber || 'N/A'})`
  }));

  // Format bookings for Apply to Sale modal
  const applyBookingOptions = applyBookings.map(booking => ({
    value: booking._id,
    label: `${booking.bookingNumber} - ${booking.customerDetails?.name || 'N/A'} - ${booking.model?.model_name || 'N/A'}`
  }));

  const handleUserSelect = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        forExecutiveId: selectedOption.value
      });
      if (formErrors.forExecutiveId) {
        const newErrors = { ...formErrors };
        delete newErrors.forExecutiveId;
        setFormErrors(newErrors);
      }
      setApiError(null);
    } else {
      setFormData({
        ...formData,
        forExecutiveId: ''
      });
    }
  };

  const handleBookingSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedBooking = bookings.find(b => b._id === selectedOption.value);
      if (selectedBooking) {
        setFormData({
          ...formData,
          bookingId: selectedBooking._id,
          vehicleId: selectedBooking.vehicleRef?._id || selectedBooking.vehicle?._id || '',
          chassisNumber: selectedBooking.chassisNumber || '',
          bookingNumber: selectedBooking.bookingNumber || ''
        });
        if (formErrors.bookingNumber) {
          const newErrors = { ...formErrors };
          delete newErrors.bookingNumber;
          setFormErrors(newErrors);
        }
        setApiError(null);
      }
    } else {
      setFormData({
        ...formData,
        bookingId: '',
        vehicleId: '',
        chassisNumber: '',
        bookingNumber: ''
      });
    }
  };

  // Handle booking selection for Apply to Sale
  const handleApplyBookingSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedBooking = applyBookings.find(b => b._id === selectedOption.value);
      if (selectedBooking) {
        setSelectedBookingForApply(selectedBooking);
        setApplyFormData({
          vehicleId: selectedBooking.vehicleRef?._id || selectedBooking.vehicle?._id || '',
          chassisNumber: selectedBooking.chassisNumber || ''
        });
        setApplyFormErrors({});
        setApplyApiError(null);
      }
    } else {
      setSelectedBookingForApply(null);
      setApplyFormData({
        vehicleId: '',
        chassisNumber: ''
      });
    }
  };

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
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

  const handleAddClick = () => {
    if (!selectedBranchId && isSuperAdmin) {
      showError('Please select a branch first');
      return;
    }
    resetForm();
    setAddModalVisible(true);
  };

  const handleViewClick = (deviation) => {
    setSelectedDeviation(deviation);
    setViewModalVisible(true);
    handleClose();
  };

  const handleApplyToSaleClick = (deviation) => {
    setSelectedDeviation(deviation);
    setApplyFormData({
      vehicleId: '',
      chassisNumber: ''
    });
    setSelectedBookingForApply(null);
    setApplyFormErrors({});
    setApplyApiError(null);
    fetchApplyBookings();
    setApplyModalVisible(true);
    handleClose();
  };

  const resetForm = () => {
    setFormData({
      incentiveSchemeId: '',
      forExecutiveId: '',
      deviationType: '',
      schemeAmount: '',
      deviationAmount: '',
      vehicleId: '',
      bookingId: '',
      chassisNumber: '',
      bookingNumber: '',
      remarks: ''
    });
    setFormErrors({});
    setApiError(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.incentiveSchemeId) errors.incentiveSchemeId = 'Incentive scheme is required';
    if (!formData.forExecutiveId) errors.forExecutiveId = 'Executive is required';
    if (!formData.deviationType) errors.deviationType = 'Deviation type is required';
    if (!formData.deviationAmount) errors.deviationAmount = 'Deviation amount is required';
    if (!formData.bookingNumber) errors.bookingNumber = 'Booking number is required';
    
    setFormErrors(errors);
    setApiError(null);
    return Object.keys(errors).length === 0;
  };

  const validateApplyForm = () => {
    const errors = {};
    
    if (!selectedBookingForApply) {
      errors.booking = 'Please select a booking';
    }
    if (!applyFormData.chassisNumber) {
      errors.chassisNumber = 'Chassis number is required';
    }
    
    setApplyFormErrors(errors);
    setApplyApiError(null);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setFormLoading(true);
    setApiError(null);
    
    try {
      const payload = {
        incentiveSchemeId: formData.incentiveSchemeId,
        forExecutiveId: formData.forExecutiveId,
        deviationType: formData.deviationType,
        schemeAmount: parseFloat(formData.schemeAmount) || 0,
        deviationAmount: parseFloat(formData.deviationAmount),
        vehicleId: formData.vehicleId || undefined,
        bookingId: formData.bookingId || undefined,
        chassisNumber: formData.chassisNumber || undefined,
        bookingNumber: formData.bookingNumber,
        remarks: formData.remarks || undefined
      };
      
      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });
      
      const response = await axiosInstance.post('/incentives/deviations', payload);
      if (response.data.status === 'success') {
        showSuccess('Deviation created successfully!');
        setAddModalVisible(false);
        resetForm();
        fetchDeviations(1, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error creating deviation:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create deviation';
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleApplySubmit = async () => {
    if (!validateApplyForm()) return;
    if (!selectedDeviation) return;
    
    setApplySubmitting(true);
    setApplyApiError(null);
    
    try {
      const payload = {
        vehicleId: applyFormData.vehicleId,
        chassisNumber: applyFormData.chassisNumber
      };
      
      const response = await axiosInstance.patch(`/incentives/deviations/${selectedDeviation._id}/use`, payload);
      if (response.data.status === 'success') {
        showSuccess('Deviation applied to sale successfully!');
        setApplyModalVisible(false);
        setSelectedDeviation(null);
        setSelectedBookingForApply(null);
        fetchDeviations(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error applying deviation to sale:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to apply deviation to sale';
      setApplyApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setApplySubmitting(false);
    }
  };

  const formatDate = (dateString) => {
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

  const getStatusBadge = (status) => {
    const option = STATUS_OPTIONS.find(s => s.value === status);
    return <CBadge color={option?.color || 'secondary'}>{option?.label || status}</CBadge>;
  };

  const getDeviationTypeLabel = (type) => {
    const option = DEVIATION_TYPE_OPTIONS.find(t => t.value === type);
    return option?.label || type;
  };

  // Check if deviation can be applied to sale
  const canApplyToSale = (status) => {
    // Show for all statuses except 'closed' and 'recovered'
    return status !== 'closed' && status !== 'recovered';
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

  if (error && deviations.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Incentive Deviations</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
              <CIcon icon={cilPlus} className='icon' /> Add Deviation
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Branch Selection - Only show for Super Admin */}
          {isSuperAdmin && (
            <div className="mb-3">
              <CFormLabel className="fw-bold">Select Branch <span className="required">*</span></CFormLabel>
              <CFormSelect
                value={selectedBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                style={{ maxWidth: '400px' }}
              >
                <option value="">-- Select Branch --</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </CFormSelect>
              {!selectedBranchId && (
                <small className="text-danger d-block mt-1">Please select a branch to view deviations</small>
              )}
            </div>
          )}

          {/* Branch Info for non-super admin */}
          {!isSuperAdmin && branches.length > 0 && (
            <div className="mb-3">
              <CAlert color="info" className="mb-0">
                <CIcon icon={cilBuilding} className="me-2" />
                <strong>Branch:</strong> {branches[0]?.name} - {branches[0]?.city}
              </CAlert>
            </div>
          )}

          {/* Summary Cards */}
          {selectedBranchId && summary && (
            <CRow className="mb-3">
              <CCol md={3}>
                <CCard className="text-center bg-light">
                  <CCardBody>
                    <h5>{summary.countUsed || 0}</h5>
                    <small className="text-muted">Used</small>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard className="text-center bg-light">
                  <CCardBody>
                    <h5>{summary.countRecovered || 0}</h5>
                    <small className="text-muted">Recovered</small>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard className="text-center bg-light">
                  <CCardBody>
                    <h5>{summary.countClosed || 0}</h5>
                    <small className="text-muted">Closed</small>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard className="text-center bg-light">
                  <CCardBody>
                    <h5 className="text-danger">{formatCurrency(summary.totalExcess || 0)}</h5>
                    <small className="text-muted">Total Excess</small>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}

          {/* Search Bar */}
          {selectedBranchId && (
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
                  placeholder="Search by booking number, chassis..."
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && selectedBranchId && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          {/* No Branch Selected Message */}
          {!selectedBranchId && isSuperAdmin && (
            <div className="text-center py-5">
              <CIcon icon={cilBuilding} style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5 className="text-muted">Please select a branch to view deviations</h5>
              <p className="text-muted">Select a branch from the dropdown above to manage incentive deviations for that branch</p>
            </div>
          )}

          {/* Deviations Table */}
          {selectedBranchId && (
            <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Deviation #</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Booking #</CTableHeaderCell>
                    <CTableHeaderCell>Chassis #</CTableHeaderCell>
                    <CTableHeaderCell>Executive</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Recovered</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {deviations.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={11} style={{ color: 'red', textAlign: 'center' }}>
                        {searchTerm ? `No results found for "${searchTerm}"` : 'No deviations found for this branch.'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    deviations.map((deviation, index) => {
                      const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                      const canApply = canApplyToSale(deviation.status);
                      return (
                        <CTableRow key={deviation._id}>
                          <CTableDataCell>{globalIndex}</CTableDataCell>
                          <CTableDataCell><strong>{deviation.deviationNumber || '-'}</strong></CTableDataCell>
                          <CTableDataCell>{getDeviationTypeLabel(deviation.deviationType)}</CTableDataCell>
                          <CTableDataCell>{deviation.bookingNumber || '-'}</CTableDataCell>
                          <CTableDataCell>{deviation.chassisNumber || '-'}</CTableDataCell>
                          <CTableDataCell>{deviation.salesExecutiveName || deviation.salesExecutive?.name || '-'}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(deviation.deviationAmount)}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(deviation.recoveredAmount || 0)}</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(deviation.status)}</CTableDataCell>
                          <CTableDataCell>{formatDate(deviation.createdAt)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, deviation._id)}
                            >
                              <CIcon icon={cilOptions} /> Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${deviation._id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === deviation._id} 
                              onClose={handleClose}
                            >
                              <MenuItem onClick={() => handleViewClick(deviation)}>
                                <CIcon icon={cilSearch} className="me-2" /> View Details
                              </MenuItem>
                              {canApply && (
                                <MenuItem onClick={() => handleApplyToSaleClick(deviation)}>
                                  <CIcon icon={cilCart} className="me-2" /> Apply to Sale
                                </MenuItem>
                              )}
                            </Menu>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}

          {/* Pagination */}
          {selectedBranchId && renderPagination()}
        </CCardBody>
      </CCard>

      {/* Add Deviation Modal */}
      <CModal size="lg" visible={addModalVisible} onClose={() => {
        setAddModalVisible(false);
        setApiError(null);
        setFormErrors({});
      }} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Add Incentive Deviation
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* API Error Alert */}
          {apiError && (
            <CAlert color="danger" className="mb-3" onClose={() => setApiError(null)} dismissible>
              <div className="d-flex align-items-start">
                <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                <div>
                  <strong>Error!</strong>
                  <p className="mb-0 mt-1">{apiError}</p>
                </div>
              </div>
            </CAlert>
          )}
          
          {/* Form Validation Errors */}
          {Object.keys(formErrors).length > 0 && (
            <CAlert color="danger" className="mb-3">
              <strong>Please fix the following errors:</strong>
              <ul className="mb-0 mt-1">
                {Object.values(formErrors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </CAlert>
          )}

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Incentive Scheme <span className="required">*</span></label>
              <CFormSelect
                value={formData.incentiveSchemeId}
                onChange={(e) => {
                  setFormData({ ...formData, incentiveSchemeId: e.target.value });
                  if (formErrors.incentiveSchemeId) {
                    const newErrors = { ...formErrors };
                    delete newErrors.incentiveSchemeId;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.incentiveSchemeId ? 'is-invalid' : ''}
                disabled={schemesLoading}
              >
                <option value="">{schemesLoading ? 'Loading schemes...' : '-- Select Scheme --'}</option>
                {schemes.map(scheme => (
                  <option key={scheme._id} value={scheme._id}>
                    {scheme.title} ({scheme.totalIncentivePool ? formatCurrency(scheme.totalIncentivePool) : ''})
                  </option>
                ))}
              </CFormSelect>
              {formErrors.incentiveSchemeId && <small className="text-danger">{formErrors.incentiveSchemeId}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Sales Executive <span className="required">*</span></label>
              <Select
                classNamePrefix="react-select"
                placeholder={usersLoading ? 'Loading users...' : '-- Select Executive --'}
                isDisabled={usersLoading || formLoading}
                options={userOptions}
                isLoading={usersLoading}
                value={userOptions.find(option => option.value === formData.forExecutiveId) || null}
                onChange={handleUserSelect}
                isClearable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: formErrors.forExecutiveId ? '#dc3545' : base.borderColor,
                    '&:hover': {
                      borderColor: formErrors.forExecutiveId ? '#dc3545' : base.borderColor,
                    },
                    boxShadow: formErrors.forExecutiveId ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : base.boxShadow,
                  }),
                }}
              />
              {formErrors.forExecutiveId && <small className="text-danger">{formErrors.forExecutiveId}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Deviation Type <span className="required">*</span></label>
              <CFormSelect
                value={formData.deviationType}
                onChange={(e) => {
                  setFormData({ ...formData, deviationType: e.target.value });
                  if (formErrors.deviationType) {
                    const newErrors = { ...formErrors };
                    delete newErrors.deviationType;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.deviationType ? 'is-invalid' : ''}
              >
                <option value="">-- Select Type --</option>
                {DEVIATION_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.deviationType && <small className="text-danger">{formErrors.deviationType}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Scheme Amount (₹)</label>
              <CFormInput
                type="number"
                step="1"
                value={formData.schemeAmount}
                onChange={(e) => {
                  setFormData({ ...formData, schemeAmount: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter scheme amount"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Deviation Amount (₹) <span className="required">*</span></label>
              <CFormInput
                type="number"
                step="1"
                value={formData.deviationAmount}
                onChange={(e) => {
                  setFormData({ ...formData, deviationAmount: e.target.value });
                  if (formErrors.deviationAmount) {
                    const newErrors = { ...formErrors };
                    delete newErrors.deviationAmount;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                placeholder="Enter deviation amount"
                className={formErrors.deviationAmount ? 'is-invalid' : ''}
              />
              {formErrors.deviationAmount && <small className="text-danger">{formErrors.deviationAmount}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Booking <span className="required">*</span></label>
              <Select
                classNamePrefix="react-select"
                placeholder={bookingsLoading ? 'Loading bookings...' : '-- Select Booking --'}
                isDisabled={bookingsLoading || formLoading}
                options={bookingOptions}
                isLoading={bookingsLoading}
                value={bookingOptions.find(option => option.value === formData.bookingId) || null}
                onChange={handleBookingSelect}
                isClearable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: formErrors.bookingNumber ? '#dc3545' : base.borderColor,
                    '&:hover': {
                      borderColor: formErrors.bookingNumber ? '#dc3545' : base.borderColor,
                    },
                    boxShadow: formErrors.bookingNumber ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : base.boxShadow,
                  }),
                }}
              />
              {formErrors.bookingNumber && <small className="text-danger">{formErrors.bookingNumber}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput
                type="text"
                value={formData.chassisNumber}
                onChange={(e) => {
                  setFormData({ ...formData, chassisNumber: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter chassis number"
                readOnly
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Remarks</label>
              <CFormTextarea
                value={formData.remarks}
                onChange={(e) => {
                  setFormData({ ...formData, remarks: e.target.value });
                  setApiError(null);
                }}
                rows={3}
                placeholder="Enter remarks (optional)"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {
            setAddModalVisible(false);
            setApiError(null);
            setFormErrors({});
          }}>Cancel</CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={formLoading}>
            {formLoading ? <><CSpinner size="sm" className="me-2" />Creating...</> : 'Create Deviation'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Deviation Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilSearch} className="me-2" />
            Deviation Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedDeviation && (
            <div>
              {/* Header */}
              <CRow className="mb-3">
                <CCol md={8}>
                  <h5>{selectedDeviation.deviationNumber || 'Deviation'}</h5>
                </CCol>
                <CCol md={4} className="text-end">
                  {getStatusBadge(selectedDeviation.status)}
                </CCol>
              </CRow>

              {/* Basic Information */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Basic Information</h6>
              </div>
              <CRow className="mb-2">
                <CCol md={4}><strong>Deviation Type:</strong></CCol>
                <CCol md={8}>{getDeviationTypeLabel(selectedDeviation.deviationType)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Description:</strong></CCol>
                <CCol md={8}>{selectedDeviation.description || '-'}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Booking Number:</strong></CCol>
                <CCol md={8}>{selectedDeviation.bookingNumber || '-'}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Chassis Number:</strong></CCol>
                <CCol md={8}>{selectedDeviation.chassisNumber || '-'}</CCol>
              </CRow>

              {/* Financial Details */}
              <div className="border-bottom pb-2 mb-3 mt-4">
                <h6>Financial Details</h6>
              </div>
              <CRow className="mb-2">
                <CCol md={4}><strong>Deviation Amount:</strong></CCol>
                <CCol md={8}>{formatCurrency(selectedDeviation.deviationAmount)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Recovered Amount:</strong></CCol>
                <CCol md={8}>{formatCurrency(selectedDeviation.recoveredAmount || 0)}</CCol>
              </CRow>

              {/* People */}
              <div className="border-bottom pb-2 mb-3 mt-4">
                <h6>People</h6>
              </div>
              <CRow className="mb-2">
                <CCol md={4}><strong>Sales Executive:</strong></CCol>
                <CCol md={8}>
                  <CIcon icon={cilUser} className="me-1" />
                  {selectedDeviation.salesExecutiveName || selectedDeviation.salesExecutive?.name || '-'}
                </CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Approved By:</strong></CCol>
                <CCol md={8}>
                  {selectedDeviation.approvedByName || selectedDeviation.approvedBy?.name || '-'}
                </CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Created By:</strong></CCol>
                <CCol md={8}>{selectedDeviation.createdBy?.name || '-'}</CCol>
              </CRow>

              {/* Additional Information */}
              <div className="border-bottom pb-2 mb-3 mt-4">
                <h6>Additional Information</h6>
              </div>
              {selectedDeviation.remarks && (
                <CRow className="mb-2">
                  <CCol md={4}><strong>Remarks:</strong></CCol>
                  <CCol md={8}>{selectedDeviation.remarks}</CCol>
                </CRow>
              )}
              <CRow className="mb-2">
                <CCol md={4}><strong>Created At:</strong></CCol>
                <CCol md={8}>{formatDate(selectedDeviation.createdAt)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Last Updated:</strong></CCol>
                <CCol md={8}>{formatDate(selectedDeviation.updatedAt)}</CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Apply to Sale Modal */}
      <CModal size="lg" visible={applyModalVisible} onClose={() => {
        setApplyModalVisible(false);
        setSelectedDeviation(null);
        setSelectedBookingForApply(null);
        setApplyApiError(null);
        setApplyFormErrors({});
      }} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilCart} className="me-2" />
            Apply Deviation to Sale
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {applyApiError && (
            <CAlert color="danger" className="mb-3" onClose={() => setApplyApiError(null)} dismissible>
              <div className="d-flex align-items-start">
                <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                <div>
                  <strong>Error!</strong>
                  <p className="mb-0 mt-1">{applyApiError}</p>
                </div>
              </div>
            </CAlert>
          )}

          {selectedDeviation && (
            <div>
              <div className="border-bottom pb-2 mb-3">
                <h6>Deviation Details</h6>
              </div>
              <CRow className="mb-2">
                <CCol md={4}><strong>Deviation Number:</strong></CCol>
                <CCol md={8}>{selectedDeviation.deviationNumber || '-'}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Deviation Type:</strong></CCol>
                <CCol md={8}>{getDeviationTypeLabel(selectedDeviation.deviationType)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Deviation Amount:</strong></CCol>
                <CCol md={8}>{formatCurrency(selectedDeviation.deviationAmount)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Status:</strong></CCol>
                <CCol md={8}>{getStatusBadge(selectedDeviation.status)}</CCol>
              </CRow>

              <div className="border-bottom pb-2 mb-3 mt-4">
                <h6>Select Booking for Sale</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={12}>
                  <label className="form-label">Booking <span className="required">*</span></label>
                  <Select
                    classNamePrefix="react-select"
                    placeholder={applyBookingsLoading ? 'Loading bookings...' : '-- Select Booking --'}
                    isDisabled={applyBookingsLoading || applySubmitting}
                    options={applyBookingOptions}
                    isLoading={applyBookingsLoading}
                    value={selectedBookingForApply ? {
                      value: selectedBookingForApply._id,
                      label: `${selectedBookingForApply.bookingNumber} - ${selectedBookingForApply.customerDetails?.name || 'N/A'} - ${selectedBookingForApply.model?.model_name || 'N/A'}`
                    } : null}
                    onChange={handleApplyBookingSelect}
                    isClearable
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: applyFormErrors.booking ? '#dc3545' : base.borderColor,
                        '&:hover': {
                          borderColor: applyFormErrors.booking ? '#dc3545' : base.borderColor,
                        },
                        boxShadow: applyFormErrors.booking ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : base.boxShadow,
                      }),
                    }}
                  />
                  {applyFormErrors.booking && <small className="text-danger">{applyFormErrors.booking}</small>}
                </CCol>
              </CRow>

              {selectedBookingForApply && (
                <>
                  <div className="border-bottom pb-2 mb-3">
                    <h6>Booking Details</h6>
                  </div>
                  <CRow className="mb-2">
                    <CCol md={6}>
                      <small className="text-muted">Booking Number</small>
                      <div><strong>{selectedBookingForApply.bookingNumber}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Customer Name</small>
                      <div><strong>{selectedBookingForApply.customerDetails?.name || 'N/A'}</strong></div>
                    </CCol>
                  </CRow>
                  <CRow className="mb-2">
                    <CCol md={6}>
                      <small className="text-muted">Model</small>
                      <div><strong>{selectedBookingForApply.model?.model_name || 'N/A'}</strong></div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-muted">Color</small>
                      <div><strong>{selectedBookingForApply.color?.name || 'N/A'}</strong></div>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={12}>
                      <label className="form-label">Chassis Number <span className="required">*</span></label>
                      <CFormInput
                        type="text"
                        value={applyFormData.chassisNumber}
                        onChange={(e) => {
                          setApplyFormData({ ...applyFormData, chassisNumber: e.target.value });
                          if (applyFormErrors.chassisNumber) {
                            const newErrors = { ...applyFormErrors };
                            delete newErrors.chassisNumber;
                            setApplyFormErrors(newErrors);
                          }
                          setApplyApiError(null);
                        }}
                        placeholder="Chassis number will be auto-filled"
                        className={applyFormErrors.chassisNumber ? 'is-invalid' : ''}
                        readOnly
                      />
                      {applyFormErrors.chassisNumber && <small className="text-danger">{applyFormErrors.chassisNumber}</small>}
                    </CCol>
                  </CRow>

                  <CAlert color="info" className="mt-3">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    <small>This will apply the deviation to the selected booking and mark it as used.</small>
                  </CAlert>
                </>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {
            setApplyModalVisible(false);
            setSelectedDeviation(null);
            setSelectedBookingForApply(null);
            setApplyApiError(null);
            setApplyFormErrors({});
          }}>Cancel</CButton>
          <CButton 
            color="primary" 
            onClick={handleApplySubmit} 
            disabled={applySubmitting || !selectedBookingForApply}
          >
            {applySubmitting ? <><CSpinner size="sm" className="me-2" />Applying...</> : <><CIcon icon={cilCart} className="me-1" />Confirm Apply</>}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default IncentiveDeviation;