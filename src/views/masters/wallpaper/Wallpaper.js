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
  CImage,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash, 
  cilCheckCircle, 
  cilXCircle, 
  cilMediaPlay,
  cilZoom
} from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const Wallpaper = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const baseURL = 'https://gmplmis.com/dealership-api';

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Wallpaper page under Masters module
  const hasWallpaperView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.VIEW
  );
  
  const hasWallpaperCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.CREATE
  );
  
  const hasWallpaperUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.UPDATE
  );
  
  const hasWallpaperDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DOCUMENTS, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewWallpapers = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  const canCreateWallpapers = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  const canUpdateWallpapers = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  const canDeleteWallpapers = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DOCUMENTS);
  
  const showActionColumn = canUpdateWallpapers || canDeleteWallpapers;

  useEffect(() => {
    if (!canViewWallpapers) {
      showError('You do not have permission to view Wallpapers');
      return;
    }
    
    fetchData();
  }, [canViewWallpapers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/wallpapers');
      // Access the data array from response.data.data
      const wallpapersData = response.data.data || [];
      setData(wallpapersData);
      setFilteredData(wallpapersData);
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
  if (!canDeleteWallpapers) {
    showError('You do not have permission to delete wallpapers');
    return;
  }
  
  const result = await confirmDelete();
  if (result.isConfirmed) {
    try {
      await axiosInstance.delete(`/wallpapers/${id}`);
      handleClose();
      await fetchData();
      showSuccess('Wallpaper deleted successfully!');
    } catch (error) {
      console.log(error);
      
      // Use alert for testing
      if (error.response?.data?.message) {
        alert(error.response.data.message); // This will show a browser alert
      } else {
        alert("Failed to delete wallpaper");
      }
      
      // Also try showError with the message
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      }
    }
  }
};

  const handleActivate = async (id) => {
    if (!canUpdateWallpapers) {
      showError('You do not have permission to activate wallpapers');
      return;
    }
    
    try {
      await axiosInstance.put(`/wallpapers/${id}/activate`);
      handleClose(); // Close menu immediately
      await fetchData(); // Refresh data
      showSuccess('Wallpaper activated successfully!');
    } catch (error) {
      console.error('Error activating wallpaper:', error);
      showError(error.response?.data?.message || 'Failed to activate wallpaper');
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

  // Get uploaded by name from the uploaded_by object
  const getUploadedByName = (uploadedBy) => {
    if (!uploadedBy) return 'N/A';
    if (typeof uploadedBy === 'object' && uploadedBy.name) {
      return uploadedBy.name;
    }
    return uploadedBy || 'N/A';
  };

  // Handle image click to open popup
  const handleImageClick = (imageUrl, imageName) => {
    setSelectedImage({ url: imageUrl, name: imageName });
    setModalVisible(true);
  };

  if (!canViewWallpapers) {
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
            {canCreateWallpapers && (
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
                  <CTableHeaderCell>Screen Name</CTableHeaderCell>
                  <CTableHeaderCell>Image Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Uploaded By</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "8" : "7"} className="text-center">
                      No wallpapers available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((wallpaper, index) => (
                    <CTableRow key={wallpaper._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div 
                          style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
                          onClick={() => handleImageClick(wallpaper.image_url, wallpaper.image_name)}
                        >
                          <CImage 
                            src={wallpaper.image_url} 
                            alt={wallpaper.image_name || 'Wallpaper'}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            rounded
                          />
                          <div 
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s',
                              pointerEvents: 'none'
                            }}
                            className="zoom-icon"
                          >
                            <CIcon icon={cilZoom} style={{ color: 'white', width: '16px', height: '16px' }} />
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{wallpaper.screen_name}</CTableDataCell>
                      <CTableDataCell>{wallpaper.image_name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={wallpaper.is_active ? 'success' : 'secondary'}>
                          {wallpaper.is_active ? (
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
                      <CTableDataCell>{getUploadedByName(wallpaper.uploaded_by)}</CTableDataCell>
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
                            {canUpdateWallpapers && (
                              <Link className="Link" to={`/wallpaper/update-wallpaper/${wallpaper._id}`}>
                                <MenuItem style={{ color: 'black' }} onClick={handleClose}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canUpdateWallpapers && !wallpaper.is_active && (
                              <MenuItem onClick={() => handleActivate(wallpaper._id)}>
                                <CIcon icon={cilMediaPlay} className="me-2" />
                                Activate
                              </MenuItem>
                            )}
                            {canDeleteWallpapers && (
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

      {/* Image Popup Modal */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        size="lg"
        alignment="center"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            {selectedImage?.name || 'Wallpaper Preview'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          {selectedImage && (
            <CImage 
              src={selectedImage.url} 
              alt={selectedImage.name}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '70vh', 
                objectFit: 'contain' 
              }}
              fluid
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add CSS for zoom icon hover effect */}
      <style jsx>{`
        div[style*="cursor: pointer"]:hover .zoom-icon {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Wallpaper;