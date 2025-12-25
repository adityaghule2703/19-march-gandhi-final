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
import RefundModel from './RefundModel';
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
  CAlert
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

const Refund = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { permissions } = useAuth();

  // Page-level permission checks for Refund under ACCOUNT module
  const canViewRefund = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  const canCreateRefund = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  const canUpdateRefund = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  const canDeleteRefund = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.REFUND);
  
  const showActionColumn = canCreateRefund;

  useEffect(() => {
    if (!canViewRefund) {
      return;
    }
    
    fetchData();
  }, [canViewRefund]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings`);

      const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
      setData(branchBookings);
      setFilteredData(branchBookings);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (booking) => {
    if (!canCreateRefund) {
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

  const handleRefundSaved = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    fetchData();
  };

  if (!canViewRefund) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Refunds.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Customer Refund</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
      
      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}
          
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div></div>
          <div className='d-flex'>
            <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={!canViewRefund}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
                      No booking details available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((booking, index) => (
                    <CTableRow key={booking._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                          ? (booking.chassisNumber || 'N/A')
                          : 'N/A'
                        }
                      </CTableDataCell>
                      <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            className="action-btn"
                            onClick={() => handleAddClick(booking)}
                            disabled={!canCreateRefund}
                          >
                            Add
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
      
      <RefundModel 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        bookingData={selectedBooking}
        onRefundSaved={handleRefundSaved}
        canCreateRefund={canCreateRefund}
      />
    </div>
  );
};

export default Refund;