import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
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
  CBadge,
  CImage
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const Wallpaper = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const baseURL = 'https://gmplmis.com/dealership-api';

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Documents page under Masters module
  const hasDocumentsView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.VIEW
  );
  
  const hasDocumentsCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.CREATE
  );
  
  const hasDocumentsUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.UPDATE
  );
  
  const hasDocumentsDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewDocuments = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  const canCreateDocuments = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  const canUpdateDocuments = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  const canDeleteDocuments = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  
  const showActionColumn = canUpdateDocuments || canDeleteDocuments;

  useEffect(() => {
    if (!canViewDocuments) {
      showError('You do not have permission to view Wallpapers');
      return;
    }
    
    fetchData();
  }, [canViewDocuments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/wallpaper');
      setData(response.data.data.wallpapers);
      setFilteredData(response.data.data.wallpapers);
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
    if (!canDeleteDocuments) {
      showError('You do not have permission to delete wallpapers');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/wallpaper/${id}`);
        fetchData();
        showSuccess('Wallpaper deleted successfully!');
      } catch (error) {
        console.log(error);
        showError();
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('wallpapers'));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!canViewDocuments) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Wallpapers.
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
      <div className='title'>Wallpapers</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateDocuments && (
              <Link to="/wallpaper/add-wallpaper">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Wallpaper
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
                  <CTableHeaderCell>Image</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Display Order</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "9" : "8"} className="text-center">
                      No wallpapers available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((wallpaper, index) => (
                    <CTableRow key={wallpaper._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <CImage 
                          src={`${baseURL}${wallpaper.image}`} 
                          alt={wallpaper.title}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          rounded
                        />
                      </CTableDataCell>
                      <CTableDataCell>{wallpaper.title}</CTableDataCell>
                      <CTableDataCell>{wallpaper.description}</CTableDataCell>
                      <CTableDataCell>{wallpaper.displayOrder}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={wallpaper.isActive ? 'success' : 'secondary'}>
                          {wallpaper.isActive ? (
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
                      <CTableDataCell>{wallpaper.createdBy?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{formatDate(wallpaper.createdAt)}</CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, wallpaper._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${wallpaper._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === wallpaper._id} 
                            onClose={handleClose}
                          >
                            {canUpdateDocuments && (
                              <Link className="Link" to={`/wallpaper/update-wallpaper/${wallpaper._id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canDeleteDocuments && (
                              <MenuItem onClick={() => handleDelete(wallpaper._id)}>
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

export default Wallpaper;