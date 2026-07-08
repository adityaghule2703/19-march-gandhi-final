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
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilChevronLeft,
  cilChevronRight,
  cilSearch,
  cilMoney,
  cilWarning,
  cilCheckCircle,
  cilXCircle
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const ApplyIncentive = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [bookings, setBookings] = useState([]);
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
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch bookings when page, limit, or search changes
  useEffect(() => {
    fetchBookings();
  }, [pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchBookings(1, pagination.limit, searchTerm);
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchBookings = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
        params.append('searchFields', 'bookingNumber,customerDetails.name');
      }
      
      const url = `/bookings/with-incentive?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        const responseData = response.data.data;
        setBookings(responseData.bookings || []);
        setPagination({
          page: responseData.currentPage || page,
          limit: limit,
          totalCount: responseData.total || 0,
          totalPages: responseData.pages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
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

  const handleApplyClick = (booking) => {
    setSelectedBooking(booking);
    setApiError(null);
    setApplyModalVisible(true);
  };

  const handleCloseModal = () => {
    setApplyModalVisible(false);
    setSelectedBooking(null);
    setApiError(null);
  };

  const handleSubmitIncentive = async () => {
    if (!selectedBooking) return;

    const vehicleId = selectedBooking.vehicleRef?._id || selectedBooking.vehicleId;
    const salesExecutiveId = selectedBooking.salesExecutive?._id;
    const bookingId = selectedBooking._id;

    if (!vehicleId) {
      setApiError('Vehicle ID not found for this booking');
      return;
    }

    if (!salesExecutiveId) {
      setApiError('Sales Executive ID not found for this booking');
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        vehicleId: vehicleId,
        salesExecutiveId: salesExecutiveId,
        bookingId: bookingId
      };

      // Updated API endpoint
      const response = await axiosInstance.post('/incentives/apply-on-sale', payload);
      
      if (response.data.status === 'success') {
        showSuccess('Incentive applied successfully!');
        handleCloseModal();
        fetchBookings(pagination.page, pagination.limit, searchTerm);
      } else {
        setApiError(response.data.message || 'Failed to apply incentive');
      }
    } catch (error) {
      console.error('Error applying incentive:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          setApiError(errorData.error);
        } else if (errorData.message) {
          setApiError(errorData.message);
        } else {
          setApiError('Failed to apply incentive');
        }
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('Failed to apply incentive');
      }
    } finally {
      setSubmitting(false);
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

  const getIncentiveStatusBadge = (incentive) => {
    if (!incentive) {
      return <CBadge color="secondary">Not Available</CBadge>;
    }
    if (incentive.applied) {
      return <CBadge color="success"><CIcon icon={cilCheckCircle} className="me-1" />Applied</CBadge>;
    }
    return <CBadge color="warning"><CIcon icon={cilMoney} className="me-1" />Not Applied</CBadge>;
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

  if (error && bookings.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Apply Incentive</div>

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
                placeholder="Search by Booking ID or Customer Name..."
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

          {/* Bookings Table */}
          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Chassis No</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Sales Executive</CTableHeaderCell>
                  <CTableHeaderCell>Incentive Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {bookings.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={12} style={{ color: 'red', textAlign: 'center' }}>
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No bookings found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  bookings.map((booking, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    const incentive = booking.incentive;
                    const canApplyIncentive = incentive && !incentive.applied;
                    
                    return (
                      <CTableRow key={booking._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell><strong>{booking.bookingNumber}</strong></CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.mobile1}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name}</CTableDataCell>
                        <CTableDataCell>{booking.color?.name}</CTableDataCell>
                        <CTableDataCell>{booking.chassisNumber || '-'}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(booking.totalAmount)}</CTableDataCell>
                        <CTableDataCell>{formatDate(booking.createdAt)}</CTableDataCell>
                        <CTableDataCell>{booking.salesExecutive?.name || '-'}</CTableDataCell>
                        <CTableDataCell>{getIncentiveStatusBadge(incentive)}</CTableDataCell>
                        <CTableDataCell>
                          {canApplyIncentive ? (
                            <CButton
                              size="sm"
                              color="success"
                              onClick={() => handleApplyClick(booking)}
                            >
                              <CIcon icon={cilMoney} className="me-1" /> Apply Incentive
                            </CButton>
                          ) : (
                            <CButton
                              size="sm"
                              color="secondary"
                              disabled
                              title={incentive?.applied ? "Incentive already applied" : "Incentive not available"}
                            >
                              <CIcon icon={cilXCircle} className="me-1" /> Not Available
                            </CButton>
                          )}
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

      {/* Apply Incentive Modal */}
      <CModal size="lg" visible={applyModalVisible} onClose={handleCloseModal} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilMoney} className="me-2" />
            Apply Incentive
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {apiError && (
            <CAlert color="danger" className="mb-3">
              <div className="d-flex align-items-start">
                <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                <div>
                  <strong>Error!</strong>
                  <p className="mb-0 mt-1">{apiError}</p>
                </div>
              </div>
            </CAlert>
          )}

          {selectedBooking && (
            <div>
              <h6 className="mb-3">Booking Details</h6>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Booking Number</small>
                  <div><strong>{selectedBooking.bookingNumber}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Booking Date</small>
                  <div><strong>{formatDate(selectedBooking.createdAt)}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Customer Name</small>
                  <div><strong>{selectedBooking.customerDetails?.name}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Mobile Number</small>
                  <div><strong>{selectedBooking.customerDetails?.mobile1}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Model</small>
                  <div><strong>{selectedBooking.model?.model_name}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Color</small>
                  <div><strong>{selectedBooking.color?.name}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Chassis Number</small>
                  <div><strong>{selectedBooking.chassisNumber || '-'}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Total Amount</small>
                  <div><strong>{formatCurrency(selectedBooking.totalAmount)}</strong></div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Sales Executive</small>
                  <div><strong>{selectedBooking.salesExecutive?.name}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Vehicle ID</small>
                  <div><strong>{selectedBooking.vehicleRef?._id || selectedBooking.vehicleId || '-'}</strong></div>
                </CCol>
              </CRow>

              <CAlert color="info" className="mt-3">
                <CIcon icon={cilCheckCircle} className="me-2" />
                <small>Click "Confirm Apply" to apply incentive for this booking.</small>
              </CAlert>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>Cancel</CButton>
          <CButton color="primary" onClick={handleSubmitIncentive} disabled={submitting}>
            {submitting ? <><CSpinner size="sm" className="me-2" />Applying...</> : <><CIcon icon={cilMoney} className="me-1" />Confirm Apply</>}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ApplyIncentive;





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
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilChevronLeft,
//   cilChevronRight,
//   cilSearch,
//   cilMoney,
//   cilWarning,
//   cilCheckCircle,
//   cilXCircle
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

// const ApplyIncentive = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Data state
//   const [bookings, setBookings] = useState([]);
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
  
//   // Modal state
//   const [applyModalVisible, setApplyModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   const { permissions = [] } = useAuth();

//   // Permission checks for HR Management - Apply Incentive page
//   // Using PAGES.HR_MANAGEMENT constants for page-level permissions
//   const canViewApplyIncentive = canViewPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.APPLY_INCENTIVE);
//   const canApplyIncentive = canCreateInPage(permissions, MODULES.HR_MANAGEMENT, PAGES.HR_MANAGEMENT.APPLY_INCENTIVE);
  
//   // Also check using hasSafePagePermission for more granular control
//   const hasApplyPermission = hasSafePagePermission(
//     permissions, 
//     MODULES.HR_MANAGEMENT, 
//     PAGES.HR_MANAGEMENT.APPLY_INCENTIVE, 
//     ACTIONS.CREATE
//   );
  
//   // Combined permission check for apply action
//   const canPerformApply = canApplyIncentive || hasApplyPermission;

//   // Fetch bookings when page, limit, or search changes
//   useEffect(() => {
//     if (canViewApplyIncentive) {
//       fetchBookings();
//     }
//   }, [pagination.page, pagination.limit]);

//   // Debounced search
//   useEffect(() => {
//     if (!canViewApplyIncentive) return;
    
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPagination(prev => ({ ...prev, page: 1 }));
//       fetchBookings(1, pagination.limit, searchTerm);
//     }, 400);
    
//     return () => clearTimeout(searchTimer.current);
//   }, [searchTerm]);

//   const fetchBookings = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
//     // Check if user has permission to view apply incentive page
//     if (!canViewApplyIncentive) {
//       setError('You do not have permission to view apply incentive page');
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
//         params.append('searchFields', 'bookingNumber,customerDetails.name');
//       }
      
//       const url = `/bookings/with-incentive?${params.toString()}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         const responseData = response.data.data;
//         setBookings(responseData.bookings || []);
//         setPagination({
//           page: responseData.currentPage || page,
//           limit: limit,
//           totalCount: responseData.total || 0,
//           totalPages: responseData.pages || 1
//         });
//       }
      
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//       setError(error.response?.data?.message || 'Failed to fetch bookings');
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

//   const handleApplyClick = (booking) => {
//     // Check apply permission before opening modal
//     if (!canPerformApply) {
//       showError('You do not have permission to apply incentives');
//       return;
//     }
//     setSelectedBooking(booking);
//     setApiError(null);
//     setApplyModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setApplyModalVisible(false);
//     setSelectedBooking(null);
//     setApiError(null);
//   };

//   const handleSubmitIncentive = async () => {
//     // Check apply permission before submitting
//     if (!canPerformApply) {
//       setApiError('You do not have permission to apply incentives');
//       return;
//     }
    
//     if (!selectedBooking) return;

//     const vehicleId = selectedBooking.vehicleRef?._id || selectedBooking.vehicleId;
//     const salesExecutiveId = selectedBooking.salesExecutive?._id;
//     const bookingId = selectedBooking._id;

//     if (!vehicleId) {
//       setApiError('Vehicle ID not found for this booking');
//       return;
//     }

//     if (!salesExecutiveId) {
//       setApiError('Sales Executive ID not found for this booking');
//       return;
//     }

//     setSubmitting(true);
//     setApiError(null);

//     try {
//       const payload = {
//         vehicleId: vehicleId,
//         salesExecutiveId: salesExecutiveId,
//         bookingId: bookingId
//       };

//       const response = await axiosInstance.post('/incentives/apply', payload);
      
//       if (response.data.status === 'success') {
//         showSuccess('Incentive applied successfully!');
//         handleCloseModal();
//         fetchBookings(pagination.page, pagination.limit, searchTerm);
//       } else {
//         setApiError(response.data.message || 'Failed to apply incentive');
//       }
//     } catch (error) {
//       console.error('Error applying incentive:', error);
//       if (error.response?.data) {
//         const errorData = error.response.data;
//         if (errorData.error) {
//           setApiError(errorData.error);
//         } else if (errorData.message) {
//           setApiError(errorData.message);
//         } else {
//           setApiError('Failed to apply incentive');
//         }
//       } else if (error.message) {
//         setApiError(error.message);
//       } else {
//         setApiError('Failed to apply incentive');
//       }
//     } finally {
//       setSubmitting(false);
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

//   const getIncentiveStatusBadge = (incentive) => {
//     if (!incentive) {
//       return <CBadge color="secondary">Not Available</CBadge>;
//     }
//     if (incentive.applied) {
//       return <CBadge color="success"><CIcon icon={cilCheckCircle} className="me-1" />Applied</CBadge>;
//     }
//     return <CBadge color="warning"><CIcon icon={cilMoney} className="me-1" />Not Applied</CBadge>;
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

//   // If user doesn't have permission to view apply incentive page, show access denied message
//   if (!canViewApplyIncentive) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Apply Incentive page.
//       </div>
//     );
//   }

//   if (error && bookings.length === 0) {
//     return <div className="alert alert-danger m-3">{error}</div>;
//   }

//   return (
//     <div>
//       <div className='title'>Apply Incentive</div>

//       <CCard className='table-container mt-4'>
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
//                 placeholder="Search by Booking ID or Customer Name..."
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

//           {/* Bookings Table */}
//           <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Mobile</CTableHeaderCell>
//                   <CTableHeaderCell>Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis No</CTableHeaderCell>
//                   <CTableHeaderCell>Total Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Sales Executive</CTableHeaderCell>
//                   <CTableHeaderCell>Incentive Status</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {bookings.length === 0 && !loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={12} style={{ color: 'red', textAlign: 'center' }}>
//                       {searchTerm ? `No results found for "${searchTerm}"` : 'No bookings found.'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   bookings.map((booking, index) => {
//                     const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
//                     const incentive = booking.incentive;
//                     const canApplyIncentiveForBooking = incentive && !incentive.applied;
                    
//                     return (
//                       <CTableRow key={booking._id}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell><strong>{booking.bookingNumber}</strong></CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.mobile1}</CTableDataCell>
//                         <CTableDataCell>{booking.model?.model_name}</CTableDataCell>
//                         <CTableDataCell>{booking.color?.name}</CTableDataCell>
//                         <CTableDataCell>{booking.chassisNumber || '-'}</CTableDataCell>
//                         <CTableDataCell>{formatCurrency(booking.totalAmount)}</CTableDataCell>
//                         <CTableDataCell>{formatDate(booking.createdAt)}</CTableDataCell>
//                         <CTableDataCell>{booking.salesExecutive?.name || '-'}</CTableDataCell>
//                         <CTableDataCell>{getIncentiveStatusBadge(incentive)}</CTableDataCell>
//                         <CTableDataCell>
//                           {/* Apply Incentive button - requires CREATE permission */}
//                           {canApplyIncentiveForBooking && canPerformApply ? (
//                             <CButton
//                               size="sm"
//                               color="success"
//                               onClick={() => handleApplyClick(booking)}
//                               title="Apply Incentive"
//                             >
//                               <CIcon icon={cilMoney} className="me-1" /> Apply Incentive
//                             </CButton>
//                           ) : canApplyIncentiveForBooking && !canPerformApply ? (
//                             <CButton
//                               size="sm"
//                               color="secondary"
//                               disabled
//                               title="You do not have permission to apply incentives"
//                             >
//                               <CIcon icon={cilXCircle} className="me-1" /> No Permission
//                             </CButton>
//                           ) : (
//                             <CButton
//                               size="sm"
//                               color="secondary"
//                               disabled
//                               title={incentive?.applied ? "Incentive already applied" : "Incentive not available"}
//                             >
//                               <CIcon icon={cilXCircle} className="me-1" /> Not Available
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

//           {/* Pagination */}
//           {renderPagination()}
//         </CCardBody>
//       </CCard>

//       {/* Apply Incentive Modal - only shown if user has apply permission */}
//       {canPerformApply && (
//         <CModal size="lg" visible={applyModalVisible} onClose={handleCloseModal} alignment="center">
//           <CModalHeader>
//             <CModalTitle>
//               <CIcon icon={cilMoney} className="me-2" />
//               Apply Incentive
//             </CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             {apiError && (
//               <CAlert color="danger" className="mb-3">
//                 <div className="d-flex align-items-start">
//                   <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
//                   <div>
//                     <strong>Error!</strong>
//                     <p className="mb-0 mt-1">{apiError}</p>
//                   </div>
//                 </div>
//               </CAlert>
//             )}

//             {selectedBooking && (
//               <div>
//                 <h6 className="mb-3">Booking Details</h6>
//                 <CRow className="mb-3">
//                   <CCol md={6}>
//                     <small className="text-muted">Booking Number</small>
//                     <div><strong>{selectedBooking.bookingNumber}</strong></div>
//                   </CCol>
//                   <CCol md={6}>
//                     <small className="text-muted">Booking Date</small>
//                     <div><strong>{formatDate(selectedBooking.createdAt)}</strong></div>
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md={6}>
//                     <small className="text-muted">Customer Name</small>
//                     <div><strong>{selectedBooking.customerDetails?.name}</strong></div>
//                   </CCol>
//                   <CCol md={6}>
//                     <small className="text-muted">Mobile Number</small>
//                     <div><strong>{selectedBooking.customerDetails?.mobile1}</strong></div>
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md={6}>
//                     <small className="text-muted">Model</small>
//                     <div><strong>{selectedBooking.model?.model_name}</strong></div>
//                   </CCol>
//                   <CCol md={6}>
//                     <small className="text-muted">Color</small>
//                     <div><strong>{selectedBooking.color?.name}</strong></div>
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md={6}>
//                     <small className="text-muted">Chassis Number</small>
//                     <div><strong>{selectedBooking.chassisNumber || '-'}</strong></div>
//                   </CCol>
//                   <CCol md={6}>
//                     <small className="text-muted">Total Amount</small>
//                     <div><strong>{formatCurrency(selectedBooking.totalAmount)}</strong></div>
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md={6}>
//                     <small className="text-muted">Sales Executive</small>
//                     <div><strong>{selectedBooking.salesExecutive?.name}</strong></div>
//                   </CCol>
//                   <CCol md={6}>
//                     <small className="text-muted">Vehicle ID</small>
//                     <div><strong>{selectedBooking.vehicleRef?._id || selectedBooking.vehicleId || '-'}</strong></div>
//                   </CCol>
//                 </CRow>

//                 <CAlert color="info" className="mt-3">
//                   <CIcon icon={cilCheckCircle} className="me-2" />
//                   <small>Click "Confirm Apply" to apply incentive for this booking.</small>
//                 </CAlert>
//               </div>
//             )}
//           </CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={handleCloseModal}>Cancel</CButton>
//             <CButton color="primary" onClick={handleSubmitIncentive} disabled={submitting}>
//               {submitting ? <><CSpinner size="sm" className="me-2" />Applying...</> : <><CIcon icon={cilMoney} className="me-1" />Confirm Apply</>}
//             </CButton>
//           </CModalFooter>
//         </CModal>
//       )}
//     </div>
//   );
// };

// export default ApplyIncentive;