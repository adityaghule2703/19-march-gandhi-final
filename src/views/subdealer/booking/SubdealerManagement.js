import '../../../css/table.css';
import '../../../css/form.css';
import '../../../css/invoice.css';
import {
  React,
  useState,
  useEffect,
  Link,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  showError,
  axiosInstance,
  showSuccess
} from 'src/utils/tableImports';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilCheck, 
  cilX,
  cilArrowLeft
} from '@coreui/icons';
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CAlert,
} from '@coreui/react';
import { useAuth } from 'src/context/AuthContext';
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from 'src/utils/modulePermissions';

const SubdealerManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cancellation states
  const [cancelledLoading, setCancelledLoading] = useState(false);
  
  // Cancellation Approval/Reject Modal States
  const [cancelApprovalModal, setCancelApprovalModal] = useState(false);
  const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
  const [cancelApprovalAction, setCancelApprovalAction] = useState('');
  const [editedReason, setEditedReason] = useState('');
  const [cancellationCharges, setCancellationCharges] = useState(0);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [cancelActionLoading, setCancelActionLoading] = useState(false);
  
  // Restore Booking Modal States
  const [restoreBookingModal, setRestoreBookingModal] = useState(false);
  const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
  const [restoreReason, setRestoreReason] = useState('');
  const [restoreNotes, setRestoreNotes] = useState('');
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreType, setRestoreType] = useState('');

  // Data states
  const [allData, setAllData] = useState([]);
  const {
    data: rejectedData,
    setData: setRejectedData,
    filteredData: filteredRejected,
    setFilteredData: setFilteredRejected,
    handleFilter: handleRejectedFilter
  } = useTableFilter([]);
  
  const {
    data: cancelledPendingData,
    setData: setCancelledPendingData,
    filteredData: filteredCancelledPending,
    setFilteredData: setFilteredCancelledPending,
    handleFilter: handleCancelledPendingFilter
  } = useTableFilter([]);
  const {
    data: cancelledRejectedData,
    setData: setCancelledRejectedData,
    filteredData: filteredCancelledRejected,
    setFilteredData: setFilteredCancelledRejected,
    handleFilter: handleCancelledRejectedFilter
  } = useTableFilter([]);

  const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
  const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
  const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);
  
  const { permissions } = useAuth();
  
  // Page-level permission checks for Subdealer Management page
  const hasViewPermission = canViewPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  const hasCreatePermission = canCreateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  const hasUpdatePermission = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  const hasDeletePermission = canDeleteInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  
  // Check for cancellation management permission
  const hasCancellationApprovePermission = hasCreatePermission; // Approving cancellation is CREATE
  const hasCancellationRejectPermission = hasDeletePermission; // Rejecting cancellation is DELETE
  
  // Check for restore booking permission (using CREATE permission since restoring creates a new status)
  const hasRestorePermission = hasCreatePermission;

  useEffect(() => {
    if (!hasViewPermission) {
      showError('You do not have permission to view Subdealer Management');
      return;
    }
    fetchAllData();
  }, [hasViewPermission]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setCancelledLoading(true);
      await Promise.all([
        fetchData(),
        fetchCancellationData()
      ]);
      
      setLoading(false);
      setCancelledLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
      setLoading(false);
      setCancelledLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings?bookingType=SUBDEALER`);
      const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

      setAllData(subdealerBookings);
      
      const rejectedBookings = subdealerBookings.filter((booking) => booking.status === 'REJECTED');
      setRejectedData(rejectedBookings);
      setFilteredRejected(rejectedBookings);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchCancellationData = async () => {
    try {
      const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: { status: 'PENDING', bookingType: 'SUBDEALER' }
      });
      setCancelledPendingData(pendingResponse.data.data);
      setFilteredCancelledPending(pendingResponse.data.data);
      
      const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: { status: 'REJECTED', bookingType: 'SUBDEALER' }
      });
      setCancelledRejectedData(rejectedResponse.data.data);
      setFilteredCancelledRejected(rejectedResponse.data.data);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleOpenRestoreModal = (bookingId, type) => {
    if (!hasRestorePermission) {
      showError('You do not have permission to restore bookings');
      return;
    }
    
    setSelectedRestoreBooking(bookingId);
    setRestoreType(type);
    setRestoreReason('');
    setRestoreNotes('');
    setRestoreBookingModal(true);
  };

  const handleRestoreBooking = async () => {
    if (!selectedRestoreBooking) return;

    try {
      setRestoreLoading(true);
      
      const payload = {
        reason: restoreReason.trim() || undefined,
        notes: restoreNotes.trim() || undefined
      };

      let apiUrl = '';
      
      if (restoreType === 'cancelled') {
        apiUrl = `/bookings/${selectedRestoreBooking}/restore`;
      } else if (restoreType === 'rejected_discount') {
        apiUrl = `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
      }

      await axiosInstance.put(apiUrl, payload);
      
      showSuccess('Booking restored successfully!');
      setRestoreBookingModal(false);
      setSelectedRestoreBooking(null);
      setRestoreReason('');
      setRestoreNotes('');
      
      await fetchAllData();
      
    } catch (error) {
      console.error('Error restoring booking:', error);
      showError(error.response?.data?.message || 'Failed to restore booking');
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleApproveCancellation = (cancellation) => {
    if (!hasCancellationApprovePermission) {
      showError('You do not have permission to approve cancellations');
      return;
    }
    
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('APPROVE');
    setEditedReason(cancellation.cancellationRequest?.reason || '');
    setCancellationCharges(cancellation.cancellationRequest?.cancellationCharges || 0);
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleRejectCancellation = (cancellation) => {
    if (!hasCancellationRejectPermission) {
      showError('You do not have permission to reject cancellations');
      return;
    }
    
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('REJECT');
    setRejectionReason('');
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleCancelActionSubmit = async () => {
    if (!selectedCancellationForApproval) return;

    try {
      setCancelActionLoading(true);
      
      if (cancelApprovalAction === 'APPROVE') {
        const payload = {
          reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
          editedReason: editedReason,
          cancellationCharges: cancellationCharges,
          notes: notes
        };

        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, payload);
        showSuccess('Cancellation approved successfully!');
      } else {
        const payload = {
          rejectionReason: rejectionReason,
          notes: notes
        };

        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, payload);
        showSuccess('Cancellation rejected successfully!');
      }

      setCancelApprovalModal(false);
      setSelectedCancellationForApproval(null);
      setEditedReason('');
      setCancellationCharges(0);
      setNotes('');
      setRejectionReason('');

      await fetchAllData();
      
    } catch (error) {
      console.error(`Error ${cancelApprovalAction === 'APPROVE' ? 'approving' : 'rejecting'} cancellation:`, error);
      showError(error.response?.data?.message || `Failed to ${cancelApprovalAction === 'APPROVE' ? 'approve' : 'reject'} cancellation`);
    } finally {
      setCancelActionLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Early return if no view permission
  if (!hasViewPermission) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer Management.
      </div>
    );
  }

  const renderManagementTable = (records, tabIndex) => {
    const showCancelOptionsColumn = tabIndex === 1 && (hasCancellationApprovePermission || hasCancellationRejectPermission);
    const showRestoreActionsColumn = (tabIndex === 0 && hasRestorePermission) || (tabIndex === 2 && hasRestorePermission);
    
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
              {tabIndex === 1 || tabIndex === 2 ? (
                <>
                  <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
                </>
              ) : (
                <>
                  <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                </>
              )}
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              {tabIndex === 2 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
              {showCancelOptionsColumn && <CTableHeaderCell scope="col">Options</CTableHeaderCell>}
              {showRestoreActionsColumn && <CTableHeaderCell scope="col">Actions</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {records.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={
                  5 + // Base columns
                  (tabIndex === 1 || tabIndex === 2 ? 5 : 4) + // Additional columns based on tab
                  (tabIndex === 2 ? 1 : 0) + // Rejection reason column
                  (showCancelOptionsColumn ? 1 : 0) + // Cancel options column
                  (showRestoreActionsColumn ? 1 : 0) // Restore actions column
                } style={{ color: 'red', textAlign: 'center' }}>
                  {tabIndex === 0 ? 'No rejected discount bookings available' : 
                   tabIndex === 1 ? 'No cancellation requests available' : 
                   'No rejected cancellation requests available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              records.map((record, index) => {
                if (tabIndex === 1 || tabIndex === 2) {
                  // Cancellation records
                  const cancellation = record;
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
                      <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
                      <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
                          {cancellation.cancellationRequest?.status || 'N/A'}
                        </span>
                      </CTableDataCell>
                      {tabIndex === 2 && (
                        <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
                      )}
                      {showCancelOptionsColumn && (
                        <CTableDataCell>
                          <div className="d-flex">
                            {hasCancellationApprovePermission && (
                              <CButton
                                size="sm"
                                className="me-2"
                                color="success"
                                onClick={() => handleApproveCancellation(cancellation)}
                              >
                                <CIcon icon={cilCheck} /> Approve
                              </CButton>
                            )}
                            {hasCancellationRejectPermission && (
                              <CButton
                                size="sm"
                                color="danger"
                                onClick={() => handleRejectCancellation(cancellation)}
                              >
                                <CIcon icon={cilX} /> Reject
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                      )}
                      {showRestoreActionsColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled')}
                          >
                            Back to Normal
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                } else {
                  // Rejected discount booking records
                  const booking = record;
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails.mobile1 || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
                      <CTableDataCell>{booking.model.type}</CTableDataCell>
                      <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                      <CTableDataCell>
                        <span 
                          className="status-badge" 
                          style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block'
                          }}
                        >
                          {booking.status}
                        </span>
                      </CTableDataCell>
                      {showRestoreActionsColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => handleOpenRestoreModal(booking._id, 'rejected_discount')}
                          >
                            Back to Normal
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                }
              })
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Subdealer Management</div>
      {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
    
      <CCard className='table-container mt-4'>
        {/* <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to="/all-subdealer-booking">
              <CButton size="sm" color="secondary" className="me-1">
                <CIcon icon={cilArrowLeft} className='icon'/> Back to Bookings
              </CButton>
            </Link>
          </div>
        </CCardHeader> */}
        
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => handleTabChange(0)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none'
                }}
              >
                Rejected Discount
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => handleTabChange(1)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Cancelled Booking
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => handleTabChange(2)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Rejected Cancelled Booking
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (activeTab === 0) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 1) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
                  else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
                }}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderManagementTable(rejectedRecords, 0)}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {cancelledLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                  <CSpinner color="primary" />
                </div>
              ) : (
                renderManagementTable(cancelledPendingRecords, 1)
              )}
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              {cancelledLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                  <CSpinner color="primary" />
                </div>
              ) : (
                renderManagementTable(cancelledRejectedRecords, 2)
              )}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Restore Booking Modal */}
      <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon className="me-2" />
            Restore Booking to Normal
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Reason:</CFormLabel>
            <CFormTextarea
              value={restoreReason}
              onChange={(e) => setRestoreReason(e.target.value)}
              rows={2}
              placeholder="Enter reason for restoring booking"
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Notes (Optional):</CFormLabel>
            <CFormTextarea
              value={restoreNotes}
              onChange={(e) => setRestoreNotes(e.target.value)}
              rows={2}
              placeholder="Enter any additional notes"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleRestoreBooking}
            disabled={restoreLoading}
          >
            {restoreLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Restore Booking'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Cancellation Approval Modal */}
      <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation Request' : 'Reject Cancellation Request'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {cancelApprovalAction === 'APPROVE' ? (
            <>
              <div className="mb-3">
                <CFormLabel>Original Reason:</CFormLabel>
                <CFormInput
                  type="text"
                  value={selectedCancellationForApproval?.cancellationRequest?.reason || ''}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Edited Reason (Optional):</CFormLabel>
                <CFormTextarea
                  value={editedReason}
                  onChange={(e) => setEditedReason(e.target.value)}
                  rows={2}
                  placeholder="Enter edited reason if needed"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Cancellation Charges:</CFormLabel>
                <CFormInput
                  type="number"
                  value={cancellationCharges}
                  onChange={(e) => setCancellationCharges(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Notes (Optional):</CFormLabel>
                <CFormTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter any additional notes"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <CFormLabel>Rejection Reason:</CFormLabel>
                <CFormTextarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                  placeholder="Enter reason for rejection"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Notes (Optional):</CFormLabel>
                <CFormTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter any additional notes"
                />
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
            onClick={handleCancelActionSubmit}
            disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}
          >
            {cancelActionLoading ? (
              <CSpinner size="sm" />
            ) : (
              cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default SubdealerManagement;