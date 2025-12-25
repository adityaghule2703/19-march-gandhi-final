import '../../css/table.css'
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  axiosInstance,
  getDefaultSearchFields
} from '../../utils/tableImports';
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilCheckCircle, cilXCircle, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import AddCash from './AddCash';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

const CashList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCash, setEditingCash] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Cash Account Master page under Fund Master module
  const canViewCash = canViewPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.CASH_ACCOUNT_MASTER);
  const canCreateCash = canCreateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.CASH_ACCOUNT_MASTER);
  const canUpdateCash = canUpdateInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.CASH_ACCOUNT_MASTER);
  const canDeleteCash = canDeleteInPage(permissions, MODULES.FUND_MASTER, PAGES.FUND_MASTER.CASH_ACCOUNT_MASTER);
  
  const showActionColumn = canUpdateCash || canDeleteCash;
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = storedUser.branch?._id;
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!canViewCash) {
      showError('You do not have permission to view Cash Account Master');
      return;
    }
    
    fetchData();
  }, [canViewCash]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cash-locations`);
      const allCashLocations = response.data.data.cashLocations;

      let filtered = allCashLocations;
      if (userRole !== 'SUPERADMIN' && branchId) {
        filtered = allCashLocations.filter((loc) => loc.branchDetails?._id === branchId);
      }

      setData(filtered);
      setFilteredData(filtered);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
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
    if (!canDeleteCash) {
      showError('You do not have permission to delete cash account');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/cash-locations/${id}`);
        setData(data.filter((cash) => cash.id !== id));
        fetchData();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleToggleStatus = async (cashId, currentStatus) => {
    if (!canUpdateCash) {
      showError('You do not have permission to update cash account status');
      return;
    }
    
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axiosInstance.patch(`/cash-locations/${cashId}/status`, {
        status: newStatus
      });
      
      const updateStatus = (cashLocations) => cashLocations.map((cash) => 
        cash.id === cashId ? { ...cash, status: newStatus } : cash
      );

      setData((prev) => updateStatus(prev));
      setFilteredData((prev) => updateStatus(prev));

      handleClose();
    } catch (error) {
      showError(error.message || 'Failed to update cash location status');
    }
  };

  const handleShowAddModal = () => {
    if (!canCreateCash) {
      showError('You do not have permission to add cash account');
      return;
    }
    
    setEditingCash(null);
    setShowModal(true);
  };

  const handleShowEditModal = (cash) => {
    if (!canUpdateCash) {
      showError('You do not have permission to edit cash account');
      return;
    }
    
    setEditingCash(cash);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCash(null);
  };

  const handleCashSaved = () => {
    fetchData();
    handleCloseModal();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('cash_bank_allocation'));
  };

  if (!canViewCash) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Cash Account Master.
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
      <div className='title'>Cash Account Master</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateCash && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
              >
                <CIcon icon={cilPlus} className='icon' /> New 
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
                  <CTableHeaderCell>Account Name</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "5" : "4"} className="text-center">
                      No cash locations available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((cash, index) => (
                    <CTableRow key={cash.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{cash.name || ''}</CTableDataCell>
                      <CTableDataCell>{cash.branchDetails?.name || ''}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={cash.status === 'active' ? 'success' : 'secondary'}>
                          {cash.status === 'active' ? (
                            <>
                              <CIcon icon={cilCheckCircle} className="me-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilXCircle} className="me-1" />
                              Inactive
                            </>
                          )}
                        </CBadge>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, cash.id)}
                            disabled={!canUpdateCash && !canDeleteCash}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${cash.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === cash.id} 
                            onClose={handleClose}
                          >
                            {canUpdateCash && (
                              <MenuItem 
                                onClick={() => handleShowEditModal(cash)}
                                style={{ color: 'black' }}
                              >
                                <CIcon icon={cilPencil} className="me-2" />Edit
                              </MenuItem>
                            )}
                            {canUpdateCash && (
                              <MenuItem onClick={() => handleToggleStatus(cash.id, cash.status)}>
                                <CIcon icon={cash.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
                                {cash.status === 'active' ? 'Deactivate' : 'Activate'}
                              </MenuItem>
                            )}
                            {canDeleteCash && (
                              <MenuItem onClick={() => handleDelete(cash.id)}>
                                <CIcon icon={cilTrash} className="me-2" />Delete
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

      <AddCash
        show={showModal}
        onClose={handleCloseModal}
        onCashSaved={handleCashSaved}
        editingCash={editingCash}
      />
    </div>
  );
};

export default CashList;