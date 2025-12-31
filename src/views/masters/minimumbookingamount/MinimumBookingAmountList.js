import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  useTableFilter,
  confirmDelete,
  showError,
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
  CAlert,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import AddMinimumBookingAmount from './AddMinimumBookingAmount';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../../utils/modulePermissions';

const MinimumBookingAmountList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Minimum Booking Amount page under Masters module
  const hasMinimumBookingAmountView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT, 
    ACTIONS.VIEW
  );
  
  const hasMinimumBookingAmountCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT, 
    ACTIONS.CREATE
  );
  
  const hasMinimumBookingAmountUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT, 
    ACTIONS.UPDATE
  );
  
  const hasMinimumBookingAmountDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewMinimumBookingAmount = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT);
  const canCreateMinimumBookingAmount = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT);
  const canUpdateMinimumBookingAmount = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT);
  const canDeleteMinimumBookingAmount = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT);
  
  const showActionColumn = canUpdateMinimumBookingAmount || canDeleteMinimumBookingAmount;

  useEffect(() => {
    if (!canViewMinimumBookingAmount) {
      showError('You do not have permission to view Minimum Booking Amount');
      return;
    }
    
    fetchData();
  }, [canViewMinimumBookingAmount]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/booking-min-amount');
      setData(response.data?.data?.items || []);
      setFilteredData(response.data?.data?.items || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    if (!canDeleteMinimumBookingAmount) {
      showError('You do not have permission to delete minimum booking amounts');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/booking-min-amount/${id}`);
        fetchData();
        setSuccessMessage('Minimum booking amount deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, ['model_id.model_name', 'type', 'min_amount']);
  };

  const handleShowAddModal = () => {
    if (!canCreateMinimumBookingAmount) {
      showError('You do not have permission to add minimum booking amounts');
      return;
    }
    
    setEditingItem(null);
    setShowModal(true);
  };

  const handleShowEditModal = (item) => {
    if (!canUpdateMinimumBookingAmount) {
      showError('You do not have permission to edit minimum booking amounts');
      return;
    }
    
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (!canViewMinimumBookingAmount) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Minimum Booking Amount.
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
      {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Minimum Booking Amount</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
          {canCreateMinimumBookingAmount && (
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleShowAddModal}
            >
              <CIcon icon={cilPlus} className='icon'/> Add
            </CButton>
          )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Minimum Amount (₹)</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!filteredData?.length ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "5" : "4"} className="text-center">
                      No minimum booking amounts available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <CTableRow key={item?._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        {item?.model_id?.model_name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item?.type === 'EV' ? 'success' : 
                                   item?.type === 'ICE' ? 'primary' : 
                                   item?.type === 'CSD' ? 'warning' : 'secondary'}>
                          {item?.type || 'N/A'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatAmount(item?.min_amount || 0)}
                      </CTableDataCell>
                      {showActionColumn && (
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, item?._id)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        <Menu 
                          id={`action-menu-${item?._id}`} 
                          anchorEl={anchorEl} 
                          open={menuId === item?._id} 
                          onClose={handleClose}
                        >
                           {canUpdateMinimumBookingAmount && (
                          <MenuItem 
                            onClick={() => handleShowEditModal(item)}
                            style={{ color: 'black' }}
                          >
                            <CIcon icon={cilPencil} className="me-2" />
                            Edit
                          </MenuItem>
                           )}
                          {canDeleteMinimumBookingAmount && (
                          <MenuItem onClick={() => handleDelete(item?._id)}>
                            <CIcon icon={cilTrash} className="me-2" />
                            Delete
                          </MenuItem>
                          )}
                        </Menu>
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

      <AddMinimumBookingAmount
        show={showModal}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        editingItem={editingItem}
      />
    </div>
  );
};

export default MinimumBookingAmountList;