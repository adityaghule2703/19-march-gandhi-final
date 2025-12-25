import '../../../css/table.css';
import '../../../css/form.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance,
  confirmDelete,
  showError,
  showSuccess
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
  CModalFooter,
  CFormSelect,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilSearch, cilZoomOut } from '@coreui/icons';

// Import permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  SafePagePermissionGuard 
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';

const VerticalMasterList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState('all');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { permissions } = useAuth();
  const { handleFilter: tableFilter } = useTableFilter([]);

  // Page-level permission checks for Vertical Masters page under Masters module
  const hasVerticalMasterView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.VERTICAL_MASTERS, 
    ACTIONS.VIEW
  );
  
  const hasVerticalMasterCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.VERTICAL_MASTERS, 
    ACTIONS.CREATE
  );
  
  const hasVerticalMasterUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.VERTICAL_MASTERS, 
    ACTIONS.UPDATE
  );
  
  const hasVerticalMasterDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.VERTICAL_MASTERS, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewVerticalMasters = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.VERTICAL_MASTERS);
  const canCreateVerticalMasters = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.VERTICAL_MASTERS);
  const canUpdateVerticalMasters = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.VERTICAL_MASTERS);
  const canDeleteVerticalMasters = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.VERTICAL_MASTERS);
  
  const showActionColumn = canUpdateVerticalMasters || canDeleteVerticalMasters;

  useEffect(() => {
    if (!canViewVerticalMasters) {
      showError('You do not have permission to view Vertical Masters');
      return;
    }
    
    fetchData();
  }, [canViewVerticalMasters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/verticle-masters');
      const verticals = response.data.data?.verticleMasters || response.data.data || [];

      setData(verticals);
      setFilteredData(verticals);
      setError(null);
    } catch (error) {
      const message = showError(error);
      if (message) {
          setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = () => {
    if (!canViewVerticalMasters) {
      showError('You do not have permission to view Vertical Masters');
      return;
    }
    
    setTempStatusFilter(statusFilter);
    setTempSearchTerm(searchTerm);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setStatusFilter(tempStatusFilter);
    setSearchTerm(tempSearchTerm);
    
    applyFiltersToData(tempStatusFilter, tempSearchTerm);
    setShowFilterModal(false);
  };

  const applyFiltersToData = (status = statusFilter, search = searchTerm) => {
    let filtered = [...data];
    
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    if (search) {
      filtered = filtered.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(search.toLowerCase()) || false;
        const createdByMatch = item.createdByDetails?.name?.toLowerCase().includes(search.toLowerCase()) || false;
        return nameMatch || createdByMatch;
      });
    }
    
    setFilteredData(filtered);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setTempStatusFilter(statusFilter);
    setTempSearchTerm(searchTerm);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setTempStatusFilter('all');
    setTempSearchTerm('');
    setFilteredData(data);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFiltersToData(statusFilter, value);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!canUpdateVerticalMasters) {
      showError('You do not have permission to update Vertical Master status');
      return;
    }
    
    try {
      await axiosInstance.patch(`/verticle-masters/${id}/status`, {
        status: newStatus
      });
      
      setData(prevData => 
        prevData.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      
      setFilteredData(prevData => 
        prevData.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        )
      );

      setSuccessMessage(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      handleClose();
    } catch (error) {
      console.log('Error updating status', error);
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteVerticalMasters) {
      showError('You do not have permission to delete Vertical Masters');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/verticle-masters/${id}`);
        
        setData(prevData => prevData.filter(item => item._id !== id));
        setFilteredData(prevData => prevData.filter(item => item._id !== id));
        
        setSuccessMessage('Vertical master deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleClose();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const getFilterText = () => {
    let text = '';
    if (statusFilter !== 'all') {
      text += `(Filtered by Status: ${statusFilter})`;
    }
    return text;
  };

  if (!canViewVerticalMasters) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Vertical Masters.
      </div>
    );
  }

  if (loading && data.length === 0) {
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
      <div className='title'>Vertical Masters {getFilterText()}</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {/* Only show New button if user has CREATE permission */}
            <SafePagePermissionGuard
              permissions={permissions}
              module={MODULES.MASTERS}
              page={PAGES.MASTERS.VERTICAL_MASTERS}
              action={ACTIONS.CREATE}
            >
              <Link to="/vertical-master/add-vertical-master">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Vertical Master
                </CButton>
              </Link>
            </SafePagePermissionGuard>
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleFilterClick}
              disabled={!canViewVerticalMasters}
            >
              <CIcon icon={cilSearch} className='icon' /> Filter
            </CButton>

            {(statusFilter !== 'all' || searchTerm) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={clearFilters}
                disabled={!canViewVerticalMasters}
              >
                <CIcon icon={cilZoomOut} className='icon' /> 
                Clear Filters
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
                disabled={!canViewVerticalMasters}
                // placeholder="Search by name or creator..."
              />
            </div>
          </div>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "6" : "5"} className="text-center">
                      No vertical masters found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((vertical, index) => (
                    <CTableRow key={vertical._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{vertical.name}</CTableDataCell>
                      <CTableDataCell>{vertical.createdByDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(vertical.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vertical.status === 'active' ? 'success' : 'secondary'}>
                          {vertical.status === 'active' ? (
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
                            onClick={(event) => handleClick(event, vertical._id)}
                            disabled={!canUpdateVerticalMasters && !canDeleteVerticalMasters}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${vertical._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === vertical._id} 
                            onClose={handleClose}
                          >
                            {canUpdateVerticalMasters && (
                              <Link
                                className="Link"
                                to={`/vertical-master/update-vertical-master/${vertical._id}`}
                              >
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}

                            {canUpdateVerticalMasters && (
                              vertical.status === 'active' ? (
                                <MenuItem
                                  onClick={() => handleStatusUpdate(vertical._id, 'inactive')}
                                >
                                  <CIcon icon={cilXCircle} className="me-2" />
                                  Mark as Inactive
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={() => handleStatusUpdate(vertical._id, 'active')}
                                >
                                  <CIcon icon={cilCheckCircle} className="me-2" />
                                  Mark as Active
                                </MenuItem>
                              )
                            )}

                            {canDeleteVerticalMasters && (
                              <MenuItem onClick={() => handleDelete(vertical._id)}>
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

      <CModal visible={showFilterModal} onClose={handleCancelFilter}>
        <CModalHeader>
          <CModalTitle>Filter Vertical Masters</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Search:</label>
            <CFormInput
              type="text"
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              disabled={!canViewVerticalMasters}
            //   placeholder="Search by name or creator..."
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Select Status:</label>
            <CFormSelect
              value={tempStatusFilter}
              onChange={(e) => setTempStatusFilter(e.target.value)}
              disabled={!canViewVerticalMasters}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelFilter}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleApplyFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default VerticalMasterList;