// import '../../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance,
// } from '../../../utils/tableImports';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../../utils/modulePermissions';
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
// import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';

// const DeclarationList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Declaration page under Masters module
//   const hasDeclarationView = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.DECLARATION, 
//     ACTIONS.VIEW
//   );
  
//   const hasDeclarationCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.DECLARATION, 
//     ACTIONS.CREATE
//   );
  
//   const hasDeclarationUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.DECLARATION, 
//     ACTIONS.UPDATE
//   );
  
//   const hasDeclarationDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.DECLARATION, 
//     ACTIONS.DELETE
//   );

//   // Using convenience functions for cleaner code
//   const canViewDeclaration = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
//   const canCreateDeclaration = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
//   const canUpdateDeclaration = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
//   const canDeleteDeclaration = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
  
//   const showActionColumn = canUpdateDeclaration || canDeleteDeclaration;

//   useEffect(() => {
//     if (!canViewDeclaration) {
//       showError('You do not have permission to view Declarations');
//       return;
//     }
    
//     fetchData();
//   }, [canViewDeclaration]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/declarations`);
//       setData(response.data.data.declarations);
//       setFilteredData(response.data.data.declarations);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
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

//   const handleToggleActive = async (declarationId, currentStatus) => {
//     if (!canUpdateDeclaration) {
//       showError('You do not have permission to update declaration status');
//       return;
//     }
    
//     try {
//       const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       await axiosInstance.patch(`/declarations/${declarationId}/status`, {
//         status: newStatus
//       });

//       const updateStatus = (declarations) =>
//         declarations.map((declaration) => (declaration.id === declarationId ? { ...declaration, status: newStatus } : declaration));

//       setData((prev) => updateStatus(prev));
//       setFilteredData((prev) => updateStatus(prev));

//       showSuccess(`Declaration ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteDeclaration) {
//       showError('You do not have permission to delete declarations');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/declarations/${id}`);
//         setData(data.filter((condition) => condition.id !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('conditions'));
//   };

//   if (!canViewDeclaration) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Declarations.
//       </div>
//     );
//   }

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
//       <div className='title'>Declarations</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateDeclaration && (
//               <Link to="/add-declaration">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Declaration
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
//                   <CTableHeaderCell>Title</CTableHeaderCell>
//                   <CTableHeaderCell>Content</CTableHeaderCell>
//                   <CTableHeaderCell>Form Type</CTableHeaderCell>
//                   <CTableHeaderCell>Priority</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "7" : "6"} className="text-center">
//                       No declarations available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((declaration, index) => (
//                     <CTableRow key={declaration._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{declaration.title}</CTableDataCell>
//                       <CTableDataCell>
//                         {declaration.content && declaration.content.substring(0, 50)}
//                         {declaration.content && declaration.content.length > 50 ? '...' : ''}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                        {declaration.formType}
//                       </CTableDataCell>
//                       <CTableDataCell>{declaration.priority}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={declaration.status === 'active' ? 'success' : 'secondary'}>
//                           {declaration.status === 'active' ? (
//                             <>
//                               <CIcon icon={cilCheckCircle} className="me-1" />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <CIcon icon={cilXCircle} className="me-1" />
//                               Inactive
//                             </>
//                           )}
//                         </CBadge>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, declaration._id)}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu
//                             id={`action-menu-${declaration._id}`}
//                             anchorEl={anchorEl}
//                             open={menuId === declaration._id}
//                             onClose={handleClose}
//                           >
//                             {canUpdateDeclaration && (
//                               <Link className="Link" to={`/update-declaration/${declaration._id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />
//                                   Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                             {canDeleteDeclaration && (
//                               <MenuItem onClick={() => handleDelete(declaration._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />
//                                 Delete
//                               </MenuItem>
//                             )}
//                             {canUpdateDeclaration && (
//                               <MenuItem onClick={() => handleToggleActive(declaration._id, declaration.status)}>
//                                 <CIcon icon={declaration.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" />
//                                 {declaration.status === 'active' ? 'Deactivate' : 'Activate'}
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

// export default DeclarationList;



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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const DeclarationList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Declaration page under Masters module
  const hasDeclarationView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DECLARATION, 
    ACTIONS.VIEW
  );
  
  const hasDeclarationCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DECLARATION, 
    ACTIONS.CREATE
  );
  
  const hasDeclarationUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DECLARATION, 
    ACTIONS.UPDATE
  );
  
  const hasDeclarationDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.DECLARATION, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewDeclaration = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
  const canCreateDeclaration = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
  const canUpdateDeclaration = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
  const canDeleteDeclaration = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.DECLARATION);
  
  const showActionColumn = canUpdateDeclaration || canDeleteDeclaration || canCreateDeclaration;

  useEffect(() => {
    if (!canViewDeclaration) {
      showError('You do not have permission to view Declarations');
      return;
    }
    
    fetchData();
  }, [canViewDeclaration]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/declarations`);
      setData(response.data.data.declarations);
      setFilteredData(response.data.data.declarations);
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

  const handleToggleActive = async (declarationId, currentStatus) => {
    if (!canCreateDeclaration) {
      showError('You do not have permission to update declaration status');
      return;
    }
    
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axiosInstance.patch(`/declarations/${declarationId}/status`, {
        status: newStatus
      });

      const updateStatus = (declarations) =>
        declarations.map((declaration) => (declaration.id === declarationId ? { ...declaration, status: newStatus } : declaration));

      setData((prev) => updateStatus(prev));
      setFilteredData((prev) => updateStatus(prev));

      showSuccess(`Declaration ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      handleClose();
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteDeclaration) {
      showError('You do not have permission to delete declarations');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/declarations/${id}`);
        setData(data.filter((condition) => condition.id !== id));
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
    handleFilter(value, getDefaultSearchFields('conditions'));
  };

  if (!canViewDeclaration) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Declarations.
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
      <div className='title'>Declarations</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateDeclaration && (
              <Link to="/add-declaration">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Declaration
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
                  <CTableHeaderCell>Form Type</CTableHeaderCell>
                  <CTableHeaderCell>Priority</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "7" : "6"} className="text-center">
                      No declarations available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((declaration, index) => (
                    <CTableRow key={declaration._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{declaration.title}</CTableDataCell>
                      <CTableDataCell>
                        {declaration.content && declaration.content.substring(0, 50)}
                        {declaration.content && declaration.content.length > 50 ? '...' : ''}
                      </CTableDataCell>
                      <CTableDataCell>
                       {declaration.formType}
                      </CTableDataCell>
                      <CTableDataCell>{declaration.priority}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={declaration.status === 'active' ? 'success' : 'secondary'}>
                          {declaration.status === 'active' ? (
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
                            onClick={(event) => handleClick(event, declaration._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu
                            id={`action-menu-${declaration._id}`}
                            anchorEl={anchorEl}
                            open={menuId === declaration._id}
                            onClose={handleClose}
                          >
                            {canUpdateDeclaration && (
                              <Link className="Link" to={`/update-declaration/${declaration._id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canDeleteDeclaration && (
                              <MenuItem onClick={() => handleDelete(declaration._id)}>
                                <CIcon icon={cilTrash} className="me-2" />
                                Delete
                              </MenuItem>
                            )}
                            {canCreateDeclaration && (
                              <MenuItem onClick={() => handleToggleActive(declaration._id, declaration.status)}>
                                <CIcon icon={declaration.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" />
                                {declaration.status === 'active' ? 'Deactivate' : 'Activate'}
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

export default DeclarationList;