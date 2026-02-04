// import '../../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   confirmDelete,
//   showError,
//   axiosInstance
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
//   CBadge,
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
// import AddRates from './AddRates';
// import { useAuth } from '../../../context/AuthContext';


// const RatesList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingRate, setEditingRate] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Finance Rates page under Masters module
//   const hasFinanceRatesView = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.FINANCE_RATES, 
//     ACTIONS.VIEW
//   );
  
//   const hasFinanceRatesCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.FINANCE_RATES, 
//     ACTIONS.CREATE
//   );
  
//   const hasFinanceRatesUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.FINANCE_RATES, 
//     ACTIONS.UPDATE
//   );
  
//   const hasFinanceRatesDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.MASTERS, 
//     PAGES.MASTERS.FINANCE_RATES, 
//     ACTIONS.DELETE
//   );

//   // Using convenience functions for cleaner code
//   const canViewFinanceRates = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
//   const canCreateFinanceRates = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
//   const canUpdateFinanceRates = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
//   const canDeleteFinanceRates = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
  
//   const showActionColumn = canUpdateFinanceRates || canDeleteFinanceRates;

//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
  
//   // Check if user is superadmin from roles array
//   const isSuperAdmin = storedUser.roles?.some(role => role.isSuperAdmin === true);
  
//   // Alternative: You could also check from meta.isSuperAdmin if available
//   // const isSuperAdmin = storedUser.meta?.isSuperAdmin || storedUser.roles?.some(role => role.isSuperAdmin === true);
  
//   useEffect(() => {
//     if (!canViewFinanceRates) {
//       showError('You do not have permission to view Finance Rates');
//       return;
//     }
    
//     fetchData();
//   }, [canViewFinanceRates]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/financers/rates`);
//       const allRates = response.data.data;

//       let filtered = allRates;

//       // Only filter by branch if user is NOT a superadmin AND has a branch
//       if (!isSuperAdmin && branchId) {
//         filtered = allRates.filter((rate) => rate.branchDetails?._id === branchId);
//       }

//       setData(filtered);
//       setFilteredData(filtered);
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

//   const handleDelete = async (id) => {
//     if (!canDeleteFinanceRates) {
//       showError('You do not have permission to delete finance rates');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/financers/rates/${id}`);
//         setData(data.filter((financer) => financer.id !== id));
//         fetchData();
//         setSuccessMessage('Finance rate deleted successfully');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('finance_rates'));
//   };

//   const handleShowAddModal = () => {
//     if (!canCreateFinanceRates) {
//       showError('You do not have permission to add finance rates');
//       return;
//     }
    
//     setEditingRate(null);
//     setShowModal(true);
//   };

//   const handleShowEditModal = (rate) => {
//     if (!canUpdateFinanceRates) {
//       showError('You do not have permission to edit finance rates');
//       return;
//     }
    
//     setEditingRate(rate);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingRate(null);
//   };

//   const handleRateSaved = (message) => {
//     fetchData();
//     handleCloseModal();
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//   };

//   if (!canViewFinanceRates) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Finance Rates.
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
//       <div className='title'>Finance Rates</div>
      
//       {/* Success Alert */}
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateFinanceRates && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleShowAddModal}
//               >
//                 <CIcon icon={cilPlus} className='icon'/> New Rates
//               </CButton>
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
//                   <CTableHeaderCell>Location</CTableHeaderCell>
//                   <CTableHeaderCell>Financer Name</CTableHeaderCell>
//                   <CTableHeaderCell>GC Rate</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "5" : "4"} className="text-center">
//                       <CBadge color="secondary">No finance rates available</CBadge>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((rate, index) => (
//                     <CTableRow key={rate.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>
//                        {rate.branchDetails?.name || ''}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                        {rate.financeProviderDetails?.name || ''}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                       {rate.gcRate || ''}
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, rate.id)}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${rate.id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === rate.id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateFinanceRates && (
//                               <MenuItem 
//                                 onClick={() => handleShowEditModal(rate)}
//                                 style={{ color: 'black' }}
//                               >
//                                 <CIcon icon={cilPencil} className="me-2" />
//                                 Edit
//                               </MenuItem>
//                             )}
//                             {canDeleteFinanceRates && (
//                               <MenuItem onClick={() => handleDelete(rate.id)}>
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

//       <AddRates
//         show={showModal}
//         onClose={handleCloseModal}
//         onRateSaved={handleRateSaved}
//         editingRate={editingRate}
//       />
//     </div>
//   );
// };

// export default RatesList;



import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
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
  CBadge,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import AddRates from './AddRates';
import { useAuth } from '../../../context/AuthContext';


const RatesList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const { permissions } = useAuth();
  
  // Page-level permission checks for Finance Rates page under Masters module
  const hasFinanceRatesView = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.FINANCE_RATES, 
    ACTIONS.VIEW
  );
  
  const hasFinanceRatesCreate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.FINANCE_RATES, 
    ACTIONS.CREATE
  );
  
  const hasFinanceRatesUpdate = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.FINANCE_RATES, 
    ACTIONS.UPDATE
  );
  
  const hasFinanceRatesDelete = hasSafePagePermission(
    permissions, 
    MODULES.MASTERS, 
    PAGES.MASTERS.FINANCE_RATES, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewFinanceRates = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
  const canCreateFinanceRates = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
  const canUpdateFinanceRates = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
  const canDeleteFinanceRates = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.FINANCE_RATES);
  
  const showActionColumn = canUpdateFinanceRates || canDeleteFinanceRates;
  
  // REMOVED: Branch filtering logic for superadmin check

  useEffect(() => {
    if (!canViewFinanceRates) {
      showError('You do not have permission to view Finance Rates');
      return;
    }
    
    fetchData();
  }, [canViewFinanceRates]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/financers/rates`);
      const allRates = response.data.data;

      // REMOVED: Branch filtering logic
      // Show all rates for all users
      setData(allRates);
      setFilteredData(allRates);
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
    if (!canDeleteFinanceRates) {
      showError('You do not have permission to delete finance rates');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/financers/rates/${id}`);
        setData(data.filter((financer) => financer.id !== id));
        fetchData();
        setSuccessMessage('Finance rate deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('finance_rates'));
  };

  const handleShowAddModal = () => {
    if (!canCreateFinanceRates) {
      showError('You do not have permission to add finance rates');
      return;
    }
    
    setEditingRate(null);
    setShowModal(true);
  };

  const handleShowEditModal = (rate) => {
    if (!canUpdateFinanceRates) {
      showError('You do not have permission to edit finance rates');
      return;
    }
    
    setEditingRate(rate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRate(null);
  };

  const handleRateSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!canViewFinanceRates) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Finance Rates.
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
      <div className='title'>Finance Rates</div>
      
      {/* Success Alert */}
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateFinanceRates && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
              >
                <CIcon icon={cilPlus} className='icon'/> New Rates
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
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Financer Name</CTableHeaderCell>
                  <CTableHeaderCell>GC Rate</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "5" : "4"} className="text-center">
                      <CBadge color="secondary">No finance rates available</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((rate, index) => (
                    <CTableRow key={rate.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                       {rate.branchDetails?.name || ''}
                      </CTableDataCell>
                      <CTableDataCell>
                       {rate.financeProviderDetails?.name || ''}
                      </CTableDataCell>
                      <CTableDataCell>
                      {rate.gcRate || ''}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, rate.id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${rate.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === rate.id} 
                            onClose={handleClose}
                          >
                            {canUpdateFinanceRates && (
                              <MenuItem 
                                onClick={() => handleShowEditModal(rate)}
                                style={{ color: 'black' }}
                              >
                                <CIcon icon={cilPencil} className="me-2" />
                                Edit
                              </MenuItem>
                            )}
                            {canDeleteFinanceRates && (
                              <MenuItem onClick={() => handleDelete(rate.id)}>
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

      <AddRates
        show={showModal}
        onClose={handleCloseModal}
        onRateSaved={handleRateSaved}
        editingRate={editingRate}
      />
    </div>
  );
};

export default RatesList;