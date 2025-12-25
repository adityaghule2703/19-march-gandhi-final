import { CFormSwitch } from '@coreui/react';
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
  axiosInstance
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
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const AccessoriesList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Accessories page under Masters module
  const hasAccessoriesView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.ACCESSORIES, 
    ACTIONS.VIEW
  );
  
  const hasAccessoriesCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.ACCESSORIES, 
    ACTIONS.CREATE
  );
  
  const hasAccessoriesUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.ACCESSORIES, 
    ACTIONS.UPDATE
  );
  
  const hasAccessoriesDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.ACCESSORIES, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewAccessories = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.ACCESSORIES);
  const canCreateAccessories = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.ACCESSORIES);
  const canUpdateAccessories = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.ACCESSORIES);
  const canDeleteAccessories = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.ACCESSORIES);
  
  const showActionColumn = canUpdateAccessories || canDeleteAccessories;

  useEffect(() => {
    if (!canViewAccessories) {
      showError('You do not have permission to view Accessories');
      return;
    }
    
    fetchData();
  }, [canViewAccessories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/accessories`);
      setData(response.data.data.accessories);
      setFilteredData(response.data.data.accessories);
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

  const handleTogglePartStatus = async (id, currentStatus) => {
    if (!canUpdateAccessories) {
      showError('You do not have permission to update accessory status');
      return;
    }
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.put(`/accessories/${id}/part-number-status`, {
        part_number_status: newStatus
      });
      fetchData();
      showSuccess(`Part number status updated to ${newStatus}`);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteAccessories) {
      showError('You do not have permission to delete accessories');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/accessories/${id}`);
        setData(data.filter((accessories) => accessories.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('accessories'));
  };

  if (!canViewAccessories) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Accessories.
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
      <div className='title'>Accessories</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateAccessories && (
              <Link to="/accessories/add-accessories">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Accessory
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
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Price</CTableHeaderCell>
                  <CTableHeaderCell>GST Rate</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Part Number</CTableHeaderCell>
                  <CTableHeaderCell>Part Number Status</CTableHeaderCell>
                  <CTableHeaderCell>Compatible Models</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
                      No accessories available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((accessories, index) => (
                    <CTableRow key={accessories.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{accessories.name}</CTableDataCell>
                      <CTableDataCell>{accessories.description}</CTableDataCell>
                      <CTableDataCell>{accessories.price}</CTableDataCell>
                      <CTableDataCell>{accessories.gst_rate}</CTableDataCell>
                      <CTableDataCell>{accessories.categoryDetails?.header_key || ''}</CTableDataCell>
                      <CTableDataCell>{accessories.part_number}</CTableDataCell>
                      <CTableDataCell>
                        <CFormSwitch
                          className="custom-switch-toggle ms-2"
                          checked={accessories.part_number_status === 'active'}
                          onChange={() =>
                            handleTogglePartStatus(accessories.id, accessories.part_number_status === 'active' ? 'active' : 'inactive')
                          }
                          disabled={!canUpdateAccessories}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        {accessories.applicableModelsDetails?.map((model) => model.model_name).join(', ')}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, accessories.id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu
                            id={`action-menu-${accessories.id}`}
                            anchorEl={anchorEl}
                            open={menuId === accessories.id}
                            onClose={handleClose}
                          >
                            {canUpdateAccessories && (
                              <Link className="Link" to={`/accessories/update-accessories/${accessories.id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canDeleteAccessories && (
                              <MenuItem onClick={() => handleDelete(accessories.id)}>
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

export default AccessoriesList;




// import { CFormSwitch } from '@coreui/react';
// import '../../../css/table.css';
// import {
//   React,
//   useState,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   showSuccess,
// } from '../../../utils/tableImports';
// import {
//   fetchAccessoriesService,
//   deleteAccessoryService,
//   togglePartNumberStatusService,
// } from '../../../services/accessories.service';
// import { hasPermission } from '../../../utils/permissionUtils';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCardHeader, 
//   CFormInput, 
//   CFormLabel, 
//   CTable, 
//   CTableBody, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';

// const AccessoriesList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const { permissions} = useAuth();
//   const hasEditPermission = hasPermission(permissions,'ACCESSORIES_UPDATE');
//   const hasDeletePermission = hasPermission(permissions,'ACCESSORIES_DELETE');
//   const hasCreatePermission = hasPermission(permissions,'ACCESSORIES_CREATE');
//   const showActionColumn = hasEditPermission || hasDeletePermission;

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const accessories = await fetchAccessoriesService();
//       setData(accessories);
//       setFilteredData(accessories);
//     } catch (error) {
//       setError(showError(error));
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleTogglePartStatus = async (id, currentStatus) => {
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//     try {
//       await togglePartNumberStatusService(id, newStatus);
//       showSuccess(`Part number status updated to ${newStatus}`);
//       fetchData();
//     } catch (error) {
//       showError(error);
//     }
//   };
  

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (!result.isConfirmed) return;
  
//     try {
//       await deleteAccessoryService(id);
//       showSuccess();
//       fetchData();
//     } catch (error) {
//       showError(error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('accessories'));
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//       {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Accessories</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/accessories/add-accessories">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Accessory
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Description</CTableHeaderCell>
//                   <CTableHeaderCell>Price</CTableHeaderCell>
//                   <CTableHeaderCell>GST Rate</CTableHeaderCell>
//                   <CTableHeaderCell>Category</CTableHeaderCell>
//                   <CTableHeaderCell>Part Number</CTableHeaderCell>
//                   <CTableHeaderCell>Part Number Status</CTableHeaderCell>
//                   <CTableHeaderCell>Compatible Models</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
//                       No accessories available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((accessories, index) => (
//                     <CTableRow key={accessories.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{accessories.name}</CTableDataCell>
//                       <CTableDataCell>{accessories.description}</CTableDataCell>
//                       <CTableDataCell>{accessories.price}</CTableDataCell>
//                       <CTableDataCell>{accessories.gst_rate}</CTableDataCell>
//                       <CTableDataCell>{accessories.categoryDetails?.header_key || ''}</CTableDataCell>
//                       <CTableDataCell>{accessories.part_number}</CTableDataCell>
//                       <CTableDataCell>
//                         <CFormSwitch
//                           className="custom-switch-toggle ms-2"
//                           checked={accessories.part_number_status === 'active'}
//                           onChange={() =>
//                             handleTogglePartStatus(accessories.id, accessories.part_number_status === 'active' ? 'active' : 'inactive')
//                           }
//                         />
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {accessories.applicableModelsDetails?.map((model) => model.model_name).join(', ')}
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, accessories.id)}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu
//                             id={`action-menu-${accessories.id}`}
//                             anchorEl={anchorEl}
//                             open={menuId === accessories.id}
//                             onClose={handleClose}
//                           >
//                             {hasEditPermission && (
//                               <Link className="Link" to={`/accessories/update-accessories/${accessories.id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />
//                                   Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                             {hasDeletePermission && (
//                               <MenuItem onClick={() => handleDelete(accessories.id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />
//                                 Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default AccessoriesList;