import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance,
} from '../../../utils/tableImports';
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
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const ConditionList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  
  const { permissions } = useAuth();
  
  // Page-level permission checks for Terms & Conditions page under Masters module
  const hasTermsConditionsView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.TERMS_CONDITIONS, 
    ACTIONS.VIEW
  );
  
  const hasTermsConditionsCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.TERMS_CONDITIONS, 
    ACTIONS.CREATE
  );
  
  const hasTermsConditionsUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.TERMS_CONDITIONS, 
    ACTIONS.UPDATE
  );
  
  const hasTermsConditionsDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.TERMS_CONDITIONS, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewTermsConditions = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.TERMS_CONDITIONS);
  const canCreateTermsConditions = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.TERMS_CONDITIONS);
  const canUpdateTermsConditions = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.TERMS_CONDITIONS);
  const canDeleteTermsConditions = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.TERMS_CONDITIONS);
  
  const showActionColumn = canUpdateTermsConditions || canDeleteTermsConditions;

  useEffect(() => {
    if (!canViewTermsConditions) {
      showError('You do not have permission to view Terms & Conditions');
      return;
    }
    
    fetchData();
  }, [canViewTermsConditions]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/terms-conditions`);
      setData(response.data.data);
      setFilteredData(response.data.data);
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
    if (!canDeleteTermsConditions) {
      showError('You do not have permission to delete terms & conditions');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/terms-conditions/${id}`);
        setData(data.filter((condition) => condition.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('conditions'));
  };

  if (!canViewTermsConditions) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Terms & Conditions.
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
      <div className='title'>Terms and Conditions for Quotation</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateTermsConditions && (
              <Link to="/conditions/add-condition">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Condition
                </CButton>
              </Link>
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
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Content</CTableHeaderCell>
                  <CTableHeaderCell>Order</CTableHeaderCell>
                  <CTableHeaderCell>Is active</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "6" : "5"} className="text-center">
                      No terms and conditions available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((condition, index) => (
                    <CTableRow key={condition._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{condition.title}</CTableDataCell>
                      <CTableDataCell>{condition.content}</CTableDataCell>
                      <CTableDataCell>{condition.order}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={condition.isActive ? 'success' : 'secondary'}>
                          {condition.isActive ? (
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
                            onClick={(event) => handleClick(event, condition._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu
                            id={`action-menu-${condition._id}`}
                            anchorEl={anchorEl}
                            open={menuId === condition._id}
                            onClose={handleClose}
                          >
                            {canUpdateTermsConditions && (
                              <Link className="Link" to={`/conditions/update-condition/${condition._id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canDeleteTermsConditions && (
                              <MenuItem onClick={() => handleDelete(condition._id)}>
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
    </div>
  );
};

export default ConditionList;