import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  showError,
  showSuccess,
  axiosInstance
} from '../../../utils/tableImports';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilBan } from '@coreui/icons';

const GrantBuffer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [revokingId, setRevokingId] = useState(null);

  // Revoke modal state
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeError, setRevokeError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/kyc-buffer/allocations?status=ACTIVE&page=1&limit=20`
      );
      setAllocations(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Open revoke modal
  const openRevokeModal = (item) => {
    setRevokeTarget(item);
    setRevokeReason('');
    setRevokeError('');
    setRevokeModalOpen(true);
  };

  // Close revoke modal
  const closeRevokeModal = () => {
    setRevokeModalOpen(false);
    setRevokeTarget(null);
    setRevokeReason('');
    setRevokeError('');
  };

  // Confirm revoke
  const confirmRevoke = async () => {
    if (!revokeReason.trim()) {
      setRevokeError('Reason is required');
      return;
    }

    try {
      setRevokingId(revokeTarget._id);
      await axiosInstance.put(
        `/kyc-buffer/allocations/${revokeTarget._id}/revoke`,
        { reason: revokeReason.trim() }
      );
      showSuccess();
      closeRevokeModal();
      fetchData();
    } catch (error) {
      console.log(error);
      showError(error);
    } finally {
      setRevokingId(null);
    }
  };

  // Simple client-side search
  const filteredAllocations = allocations.filter((a) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      (a.booking?.bookingNumber || '').toLowerCase().includes(s) ||
      (a.booking?.fullCustomerName || '').toLowerCase().includes(s) ||
      (a.salesExecutive?.name || '').toLowerCase().includes(s) ||
      (a.grantedBy?.name || '').toLowerCase().includes(s) ||
      (a.branch?.name || '').toLowerCase().includes(s)
    );
  });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB') : '—';

  // -------- Stat computations --------
  const totalAllocations = allocations.length;

  const activeAllocations = allocations.filter(
    (a) => a.status === 'ACTIVE'
  ).length;

  const totalBufferDays = allocations.reduce(
    (sum, a) => sum + (Number(a.bufferDays) || 0),
    0
  );

  // Unique "appliedLimit" values across allocations
  const uniqueLimits = Array.from(
    new Set(allocations.map((a) => a.appliedLimit).filter(Boolean))
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>KYC Buffer Allocations</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to="/kyc-buffer-master/grant-buffer/add">
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Grant Buffer
              </CButton>
            </Link>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* ---------- STAT CARDS ---------- */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <div className="text-muted small">Total Allocations</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  {totalAllocations}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 border rounded">
                <div className="text-muted small">Active</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  <CBadge color="success">{activeAllocations}</CBadge>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 border rounded">
                <div className="text-muted small">Total Buffer Days</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  <CBadge color="info">{totalBufferDays} days</CBadge>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- LIMITS CARD ---------- */}
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="p-3 border rounded d-flex flex-wrap align-items-center gap-3">
                <div className="text-muted small mb-0">Applied Limits:</div>
                {uniqueLimits.length === 0 ? (
                  <CBadge color="secondary">—</CBadge>
                ) : (
                  uniqueLimits.map((limit, i) => (
                    <CBadge key={i} color="primary">
                      {limit}
                    </CBadge>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ---------- SEARCH ---------- */}
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* ---------- TABLE ---------- */}
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking No</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Sales Executive</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Buffer Days</CTableHeaderCell>
                  <CTableHeaderCell>Original Deadline</CTableHeaderCell>
                  <CTableHeaderCell>Extended Deadline</CTableHeaderCell>
                  <CTableHeaderCell>Limit</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredAllocations.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
                      No allocations available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredAllocations.map((item, index) => (
                    <CTableRow key={item._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{item.booking?.bookingNumber || '—'}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.booking?.fullCustomerName || (
                          <CBadge color="secondary">—</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.salesExecutive?.name || (
                          <CBadge color="secondary">—</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.branch?.name || (
                          <CBadge color="secondary">—</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{item.bufferDays} days</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(item.originalDeadline)}</CTableDataCell>
                      <CTableDataCell>{formatDate(item.extendedDeadline)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{item.appliedLimit || '—'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {item.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.status === 'ACTIVE' ? (
                          <CButton
                            size="sm"
                            color="danger"
                            className="option-button btn-sm"
                            disabled={revokingId === item._id}
                            onClick={() => openRevokeModal(item)}
                          >
                            <CIcon icon={cilBan} className="me-1" />
                            Revoke
                          </CButton>
                        ) : (
                          <CBadge color="secondary">—</CBadge>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* ============ REVOKE MODAL ============ */}
      <CModal
        visible={revokeModalOpen}
        onClose={closeRevokeModal}
        alignment="center"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Revoke Buffer Allocation</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <div className="mb-3">
            <div className="mb-2">
              <span className="text-muted">Booking No: </span>
              <strong>{revokeTarget?.booking?.bookingNumber || '—'}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Customer: </span>
              <strong>{revokeTarget?.booking?.fullCustomerName || '—'}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Buffer Days: </span>
              <strong>{revokeTarget?.bufferDays || '—'}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Applied Limit: </span>
              <strong>{revokeTarget?.appliedLimit || '—'}</strong>
            </div>
          </div>

          <div className="input-box">
            <div className="details-container">
              <span className="details">Reason</span>
              <span className="required">*</span>
            </div>
            <CFormInput
              type="text"
              value={revokeReason}
              onChange={(e) => {
                setRevokeReason(e.target.value);
                setRevokeError('');
              }}
              placeholder="e.g. Customer uploaded KYC, buffer not required"
              autoFocus
            />
            {revokeError && <p className="error">{revokeError}</p>}
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={closeRevokeModal}
            disabled={revokingId === revokeTarget?._id}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            size="sm"
            onClick={confirmRevoke}
            disabled={revokingId === revokeTarget?._id}
          >
            {revokingId === revokeTarget?._id ? (
              <>
                <CSpinner size="sm" className="me-2" /> Revoking…
              </>
            ) : (
              <>
                <CIcon icon={cilBan} className="me-1" /> Revoke
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default GrantBuffer;