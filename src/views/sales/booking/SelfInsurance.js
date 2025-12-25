import '../../../css/table.css'
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance,
  Menu,
  MenuItem,
  showError,
  showSuccess,
} from '../../../utils/tableImports'
import CIcon from '@coreui/icons-react'
import { 
  cilCheckCircle, 
  cilXCircle,
  cilSettings
} from '@coreui/icons'
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
  CAlert, 
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormTextarea,
  CModalFooter,
} from '@coreui/react'
// Import permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../../utils/modulePermissions'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SelfInsurance = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [actionType, setActionType] = useState('')
  const [note, setNote] = useState('')
  const [processing, setProcessing] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuId, setMenuId] = useState(null)

  // Get user permissions from auth context
  const { permissions = [] } = useAuth()
  const navigate = useNavigate()

  // Page-level permission checks for Self Insurance page under Sales module
  const canViewSelfInsurance = canViewPage(permissions, MODULES.SALES, PAGES.SALES.SELF_INSURANCE)
  const canCreateSelfInsurance = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.SELF_INSURANCE)
  const canUpdateSelfInsurance = canUpdateInPage(permissions, MODULES.SALES, PAGES.SALES.SELF_INSURANCE)
  const canDeleteSelfInsurance = canDeleteInPage(permissions, MODULES.SALES, PAGES.SALES.SELF_INSURANCE)

  // Specific action permissions - Approve/Reject use CREATE permission (POST method)
  const canApproveSelfInsurance = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.SELF_INSURANCE, 
    ACTIONS.CREATE
  )
  
  const canRejectSelfInsurance = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.SELF_INSURANCE, 
    ACTIONS.CREATE
  )

  // Show action column if user can approve or reject
  const showActionColumn = canApproveSelfInsurance || canRejectSelfInsurance

  useEffect(() => {
    // Check if user has permission to view the page
    if (!canViewSelfInsurance) {
      showError('You do not have permission to view Self Insurance')
      navigate('/dashboard')
      return
    }
    
    fetchData()
  }, [canViewSelfInsurance])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/bookings?status=FREEZZED')

      const selfInsuranceBookings = response.data.data.bookings.filter(
        (booking) => booking.selfInsurance === true
      )
      setData(selfInsuranceBookings)
      setFilteredData(selfInsuranceBookings)
    } catch (error) {
      console.log('Error fetching data', error)
      const message = showError(error);
  if (message) {
    setError(message);
  }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    if (!canViewSelfInsurance) {
      showError('You do not have permission to search self insurance')
      return
    }
    
    setSearchTerm(value)
    handleFilter(value, getDefaultSearchFields('booking'))
  }

  const handleApproveReject = (booking, decision) => {
    if (decision === 'APPROVE' && !canApproveSelfInsurance) {
      showError('You do not have permission to approve self insurance')
      return
    }
    
    if (decision === 'REJECT' && !canRejectSelfInsurance) {
      showError('You do not have permission to reject self insurance')
      return
    }
    
    setSelectedBooking(booking)
    setActionType(decision)
    setNote('')
    setModalVisible(true)
    handleClose()
  }

  const handleSubmitDecision = async () => {
    if (!selectedBooking || !note.trim()) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
      return
    }

    // Check permission based on action type
    if (actionType === 'APPROVE' && !canApproveSelfInsurance) {
      showError('You do not have permission to approve self insurance')
      return
    }
    
    if (actionType === 'REJECT' && !canRejectSelfInsurance) {
      showError('You do not have permission to reject self insurance')
      return
    }

    try {
      setProcessing(true)
      
      const payload = {
        bookingId: selectedBooking._id,
        decision: actionType,
        note: note.trim()
      }

      await axiosInstance.post('/freeze/freeze-decision', payload)
      
      await fetchData()
      
      setModalVisible(false)
      setSelectedBooking(null)
      setActionType('')
      setNote('')
      setError(null)
      
      showSuccess(`Self insurance request ${actionType.toLowerCase()}d successfully`)
      
    } catch (err) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setProcessing(false)
    }
  }

  const handleClick = (event, id) => {
    if (!showActionColumn) {
      showError('You do not have permission to perform actions on self insurance')
      return
    }
    
    setAnchorEl(event.currentTarget)
    setMenuId(id)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setMenuId(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FREEZZED':
        return (
          <CBadge color="warning">
            <CIcon icon={cilXCircle} className="me-1" />
            Frozen
          </CBadge>
        )
      case 'PENDING_APPROVAL':
        return (
          <CBadge color="info">
            <CIcon icon={cilXCircle} className="me-1" />
            Pending Approval
          </CBadge>
        )
      case 'ALLOCATED':
        return (
          <CBadge color="success">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Allocated
          </CBadge>
        )
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  const getCancellationBadge = (cancellationStatus) => {
    switch (cancellationStatus) {
      case 'PENDING':
        return (
          <CBadge color="warning">
            <CIcon icon={cilXCircle} className="me-1" />
            Pending
          </CBadge>
        )
      case 'APPROVED':
        return (
          <CBadge color="success">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Approved
          </CBadge>
        )
      case 'REJECTED':
        return (
          <CBadge color="danger">
            <CIcon icon={cilXCircle} className="me-1" />
            Rejected
          </CBadge>
        )
      default:
        return (
          <CBadge color="secondary">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Not Requested
          </CBadge>
        )
    }
  }

  // Check if user has permission to view the page
  if (!canViewSelfInsurance) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Self Insurance.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="title">Self Insurance Bookings</div>

      {error && (
        <CAlert 
          color={error.type === 'success' ? 'success' : 'danger'} 
          className="mb-3"
          dismissible
          onClose={() => setError(null)}
        >
          {error.message || error}
        </CAlert>
      )}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div></div>
          <div className="d-flex">
            {/* Search field - Requires VIEW permission */}
            {canViewSelfInsurance && (
              <>
                <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
                <CFormInput
                  type="text"
                  className="d-inline-block square-search"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search bookings..."
                />
              </>
            )}
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Booking Status</CTableHeaderCell>
                  <CTableHeaderCell>Insurance Status</CTableHeaderCell>
                  <CTableHeaderCell>Cancellation Status</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Balance Amount</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((booking, index) => (
                    <CTableRow key={booking._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{booking.bookingNumber}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
                      <CTableDataCell>
                        {booking.customerDetails?.name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {booking.customerDetails?.mobile1 || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </CTableDataCell>
                      <CTableDataCell>{getStatusBadge(booking.status)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'warning' : 'info'}>
                          {booking.insuranceStatus === 'AWAITING' ? (
                            <CIcon icon={cilXCircle} className="me-1" />
                          ) : (
                            <CIcon icon={cilCheckCircle} className="me-1" />
                          )}
                          {booking.insuranceStatus}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getCancellationBadge(booking.cancellationRequest?.status)}
                      </CTableDataCell>
                      <CTableDataCell>
                        ₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}
                      </CTableDataCell>
                      <CTableDataCell>
                        ₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, booking._id)}
                            disabled={!canApproveSelfInsurance && !canRejectSelfInsurance}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          
                          {/* Material-UI Menu Component */}
                          <Menu 
                            id={`action-menu-${booking._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === booking._id} 
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            style={{
                              marginTop: '8px',
                            }}
                          >
                            {/* Approve option - Requires CREATE permission */}
                            {canApproveSelfInsurance && (
                              <MenuItem 
                                onClick={() => handleApproveReject(booking, 'APPROVE')}
                                style={{ 
                                  padding: '8px 16px',
                                  minWidth: '140px',
                                  fontSize: '14px',
                                  color: '#198754',
                                }}
                              >
                                <CIcon icon={cilCheckCircle} className="me-2" />
                                Approve
                              </MenuItem>
                            )}
                            
                            {/* Reject option - Requires CREATE permission */}
                            {canRejectSelfInsurance && (
                              <MenuItem 
                                onClick={() => handleApproveReject(booking, 'REJECT')}
                                style={{ 
                                  padding: '8px 16px',
                                  minWidth: '140px',
                                  fontSize: '14px',
                                  color: '#dc3545',
                                }}
                              >
                                <CIcon icon={cilXCircle} className="me-2" />
                                Reject
                              </MenuItem>
                            )}
                            
                            {(canApproveSelfInsurance || canRejectSelfInsurance) && (
                              <div style={{ 
                                height: '1px', 
                                backgroundColor: '#e9ecef', 
                                margin: '4px 0'
                              }}/>
                            )}
                            
                            <MenuItem 
                              onClick={handleClose}
                              style={{ 
                                padding: '8px 16px',
                                minWidth: '140px',
                                fontSize: '14px',
                                color: '#6c757d',
                              }}
                            >
                              Close
                            </MenuItem>
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
                      No self insurance bookings found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Decision Modal - Only shown if user has CREATE permission */}
      {(canApproveSelfInsurance || canRejectSelfInsurance) && (
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalHeader onClose={() => setModalVisible(false)}>
            <CModalTitle>
              {actionType === 'APPROVE' ? 'Approve' : 'Reject'} Self Insurance Request
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <strong>Booking Details:</strong>
              <div className="mt-2">
                <p><strong>Booking ID:</strong> {selectedBooking?.bookingNumber}</p>
                <p><strong>Customer:</strong> {selectedBooking?.customerDetails?.name}</p>
                <p><strong>Model:</strong> {selectedBooking?.model?.model_name}</p>
                <p><strong>Total Amount:</strong> ₹{selectedBooking?.discountedAmount?.toLocaleString('en-IN')}</p>
                <p><strong>Cancellation Status:</strong> {selectedBooking?.cancellationRequest?.status || 'Not Requested'}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <CFormLabel htmlFor="note">
                <strong>Note *</strong> 
                <span className="text-muted ms-1">
                  (Please provide reason for {actionType === 'APPROVE' ? 'approval' : 'rejection'})
                </span>
              </CFormLabel>
              <CFormTextarea
                id="note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  actionType === 'APPROVE' 
                    ? "Enter note for approval. Example: Customer will arrange their own insurance policy..."
                    : "Enter note for rejection. Example: Insurance must be purchased through dealer as per policy..."
                }
                required
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton 
              color="secondary" 
              onClick={() => {
                setModalVisible(false)
                setSelectedBooking(null)
                setNote('')
              }}
              disabled={processing}
            >
              Cancel
            </CButton>
            <CButton 
              color={actionType === 'APPROVE' ? 'success' : 'danger'}
              onClick={handleSubmitDecision}
              disabled={!note.trim() || processing || 
                (actionType === 'APPROVE' && !canApproveSelfInsurance) ||
                (actionType === 'REJECT' && !canRejectSelfInsurance)}
            >
              {processing ? (
                <>
                  <CSpinner component="span" size="sm" />
                  <span className="ms-1">Processing...</span>
                </>
              ) : (
                <>
                  <CIcon icon={actionType === 'APPROVE' ? cilCheckCircle : cilXCircle} className="me-2" />
                  {actionType === 'APPROVE' ? 'Approve Request' : 'Reject Request'}
                </>
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default SelfInsurance