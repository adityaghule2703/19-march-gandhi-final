import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
  showError
} from '../../utils/tableImports';
import CancelledBookingModel from './CancelledBookingModel';
import { 
  CBadge,
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';

// Import permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

const CancelledBooking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [processRefundData, setProcessRefundData] = useState([]);
  const [completedRefundData, setCompletedRefundData] = useState([]);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    processRefund: true,
    completedRefund: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { permissions } = useAuth();

  // Page-level permission checks for Cancelled Booking under ACCOUNT module
  const canViewCancelledBooking = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  const canCreateCancelledBooking = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  const canUpdateCancelledBooking = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  const canDeleteCancelledBooking = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.CANCELLED_BOOKING);
  
  // Check if user can process refunds (usually tied to CREATE or UPDATE permission)
  const canProcessRefund = canCreateCancelledBooking || canUpdateCancelledBooking;

  useEffect(() => {
    if (!canViewCancelledBooking) {
      return;
    }
    
    fetchData();
  }, [activeTab, canViewCancelledBooking]);

  const fetchData = async () => {
    try {
      if (activeTab === 0) {
        setLoading(prev => ({ ...prev, processRefund: true }));
      } else {
        setLoading(prev => ({ ...prev, completedRefund: true }));
      }
      
      let url = '';
      if (activeTab === 0) {
        url = `/cancelbooking/cancellations?status=APPROVED_BY_GM`;
      } else {
        url = `/cancelbooking/cancellations?status=REFUND_PROCESSED`;
      }

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        if (activeTab === 0) {
          setProcessRefundData(response.data.data);
          setData(response.data.data);
          setFilteredData(response.data.data);
        } else {
          setCompletedRefundData(response.data.data);
          setData(response.data.data);
          setFilteredData(response.data.data);
        }
      } else {
        throw new Error('Failed to fetch cancelled bookings');
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      if (activeTab === 0) {
        setLoading(prev => ({ ...prev, processRefund: false }));
      } else {
        setLoading(prev => ({ ...prev, completedRefund: false }));
      }
    }
  };

  const handleAddClick = (booking) => {
    if (!canProcessRefund) {
      showError('You do not have permission to process refunds');
      return;
    }
    
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('booking'));
  };

  const handleTabChange = (tab) => {
    if (!canViewCancelledBooking) {
      return;
    }
    
    setActiveTab(tab);
    setSearchTerm('');
    if (tab === 0) {
      setData(processRefundData);
      setFilteredData(processRefundData);
    } else {
      setData(completedRefundData);
      setFilteredData(completedRefundData);
    }
  };

  const handleRefundProcessed = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    fetchData();
  };

  const renderProcessRefundTable = () => {
    const currentLoading = loading.processRefund;

    if (currentLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (error && activeTab === 0) {
      return (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Sr.no</CTableHeaderCell>
              <CTableHeaderCell>Booking ID</CTableHeaderCell>
              <CTableHeaderCell>Model Name</CTableHeaderCell>
              <CTableHeaderCell>Booking Date</CTableHeaderCell>
              <CTableHeaderCell>Customer Name</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
              <CTableHeaderCell>Total Amount</CTableHeaderCell>
              <CTableHeaderCell>Received</CTableHeaderCell>
              <CTableHeaderCell>Refund Amount</CTableHeaderCell>
              {canProcessRefund && <CTableHeaderCell>Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentRecords.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canProcessRefund ? "11" : "10"} className="text-center">
                  {searchTerm ? 'No matching bookings found' : 'No pending refund bookings available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              currentRecords.map((booking, index) => (
                <CTableRow key={booking._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  {canProcessRefund && (
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="primary"
                        className="action-btn"
                        onClick={() => handleAddClick(booking)}
                        disabled={!canProcessRefund}
                      >
                        Process Refund
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderCompletedRefundTable = () => {
    const currentLoading = loading.completedRefund;

    if (currentLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (error && activeTab === 1) {
      return (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Sr.no</CTableHeaderCell>
              <CTableHeaderCell>Booking ID</CTableHeaderCell>
              <CTableHeaderCell>Model Name</CTableHeaderCell>
              <CTableHeaderCell>Booking Date</CTableHeaderCell>
              <CTableHeaderCell>Customer Name</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
              <CTableHeaderCell>Total Amount</CTableHeaderCell>
              <CTableHeaderCell>Received</CTableHeaderCell>
              <CTableHeaderCell>Refund Amount</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Processed At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentRecords.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="12" className="text-center">
                  {searchTerm ? 'No matching bookings found' : 'No completed refund bookings available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              currentRecords.map((booking, index) => (
                <CTableRow key={booking._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.vehicle?.model || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{booking.customer?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{booking.customer?.phone || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.total?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.received?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>₹{booking.financials?.refundAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="success" shape="rounded-pill">
                      REFUND PROCESSED
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {booking.cancellationRequest?.accountantProcessedAt 
                      ? new Date(booking.cancellationRequest.accountantProcessedAt).toLocaleDateString('en-GB')
                      : 'N/A'
                    }
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (!canViewCancelledBooking) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Cancelled Bookings.
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Cancelled Bookings</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
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
                disabled={!canViewCancelledBooking}
              >
                Process Refund
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
                disabled={!canViewCancelledBooking}
              >
                Completed Refund
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search bookings..."
                disabled={!canViewCancelledBooking}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderProcessRefundTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderCompletedRefundTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
      
      <CancelledBookingModel 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        bookingData={selectedBooking} 
        onSuccess={handleRefundProcessed}
        canProcessRefund={canProcessRefund}
      />
    </div>
  );
};

export default CancelledBooking;