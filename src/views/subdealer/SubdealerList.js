// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash,
//   cilCheckCircle,
//   cilXCircle,
//   cilLocationPin,
//   cilGlobeAlt,
//   cilDollar,
//   cilCalendar
// } from '@coreui/icons';
// import { Link } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react';
// import {
//   React as ReactHook,
//   useState as useStateHook,
//   useEffect as useEffectHook,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const SubdealerList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Subdealer List page under Subdealer Master module
//   const canViewSubdealer = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canCreateSubdealer = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canUpdateSubdealer = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canDeleteSubdealer = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  
//   const showActionColumn = canUpdateSubdealer || canDeleteSubdealer;

//   useEffect(() => {
//     if (!canViewSubdealer) {
//       showError('You do not have permission to view Subdealer List');
//       return;
//     }
    
//     fetchData();
//   }, [canViewSubdealer]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/subdealers`);
//       const subdealers = response.data.data?.subdealers || [];
//       setData(subdealers);
//       setFilteredData(subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (searchValue) => {
//     // Update search fields to include new structure
//     const searchFields = ['name', 'type', 'branchDetails.name', 'creditPeriodDays'];
//     handleFilter(searchValue, searchFields);
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleToggleActive = async (subdealerId, currentStatus) => {
//     if (!canUpdateSubdealer) {
//       showError('You do not have permission to update subdealer status');
//       return;
//     }
    
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

//     try {
//       await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
//         status: newStatus
//       });
//       setData((prevData) => prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []);
//       setFilteredData((prevData) =>
//         prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []
//       );
//       showSuccess('Subdealer status updated successfully!');
//       handleClose();
//     } catch (error) {
//       console.error('Error toggling subdealer status:', error);
//       showError('Failed to update subdealer status');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteSubdealer) {
//       showError('You do not have permission to delete subdealer');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/subdealers/${id}`);
//         setData(data?.filter((subdealer) => subdealer._id !== id) || []);
//         setFilteredData(filteredData?.filter((subdealer) => subdealer._id !== id) || []);
//         showSuccess('Subdealer deleted successfully!');
//         handleClose();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   // Helper function to get location display
//   const getLocationDisplay = (subdealer) => {
//     if (subdealer.latLong?.address) {
//       return subdealer.latLong.address;
//     } else if (subdealer.location) {
//       return subdealer.location; // Fallback for old data
//     }
//     return 'N/A';
//   };

//   // Helper function to get coordinates display
//   const getCoordinatesDisplay = (subdealer) => {
//     if (subdealer.latLong?.coordinates && subdealer.latLong.coordinates.length === 2) {
//       return `(${subdealer.latLong.coordinates[1]}, ${subdealer.latLong.coordinates[0]})`;
//     }
//     return 'N/A';
//   };

//   // Helper function to get credit period display
//   const getCreditPeriodDisplay = (subdealer) => {
//     if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
//       return `${subdealer.creditPeriodDays} days`;
//     }
//     return '0 days'; // Default value for old records
//   };

//   if (!canViewSubdealer) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer List.
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
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer List</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateSubdealer && (
//               <Link to='/add-subdealer'>
//                 <CButton size="sm" className="action-btn me-1" disabled={!canCreateSubdealer}>
//                   <CIcon icon={cilPlus} className='icon'/> New Subdealer
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   handleSearch(e.target.value);
//                 }}
//                 disabled={!canViewSubdealer}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Address</CTableHeaderCell>
//                   <CTableHeaderCell>Coordinates</CTableHeaderCell>
//                   <CTableHeaderCell>Rate Of Interest (%)</CTableHeaderCell>
//                {/*   <CTableHeaderCell>Discount (%)</CTableHeaderCell>*/}
//                   <CTableHeaderCell>Credit Period (Days)</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData && filteredData.length > 0 ? (
//                   filteredData.map((subdealer, index) => (
//                     <CTableRow key={subdealer?._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.branchDetails?.name || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <CIcon icon={cilLocationPin} className="me-1" />
//                           {getLocationDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {getCoordinatesDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
//                         </div>
//                       </CTableDataCell>
//                     {/*  <CTableDataCell>
//                         {subdealer?.discount ? `${subdealer.discount}%` : '0%'}
//                       </CTableDataCell>*/}
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
                       
//                           {getCreditPeriodDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>{subdealer?.type || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={subdealer?.status === 'active' ? 'success' : 'secondary'}>
//                           {subdealer?.status === 'active' ? (
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
//                             onClick={(event) => handleClick(event, subdealer?._id)}
//                             disabled={!canUpdateSubdealer && !canDeleteSubdealer}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${subdealer?._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === subdealer?._id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateSubdealer && (
//                               <Link className="Link" to={`/update-subdealer/${subdealer?._id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                             {canUpdateSubdealer && (
//                               <MenuItem onClick={() => handleToggleActive(subdealer?._id, subdealer?.status)}>
//                                 <CIcon icon={subdealer?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
//                                 {subdealer?.status === 'active' ? 'Deactivate' : 'Activate'}
//                               </MenuItem>
//                             )}
//                             {canDeleteSubdealer && (
//                               <MenuItem onClick={() => handleDelete(subdealer?._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
//                       No subdealers available
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default SubdealerList;






// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash,
//   cilCheckCircle,
//   cilXCircle,
//   cilLocationPin,
//   cilGlobeAlt,
//   cilDollar,
//   cilCalendar
// } from '@coreui/icons';
// import { Link } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react';
// import {
//   React as ReactHook,
//   useState as useStateHook,
//   useEffect as useEffectHook,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const SubdealerList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
  
//   // Page-level permission checks for Subdealer List page under Subdealer Master module
//   const canViewSubdealer = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canCreateSubdealer = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canUpdateSubdealer = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canDeleteSubdealer = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  
//   const showActionColumn = canUpdateSubdealer || canDeleteSubdealer;

//   useEffect(() => {
//     if (!canViewSubdealer) {
//       showError('You do not have permission to view Subdealer List');
//       return;
//     }
    
//     fetchData();
//   }, [canViewSubdealer]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/subdealers`);
//       let subdealers = response.data.data?.subdealers || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         subdealers = subdealers.filter(subdealer => 
//           subdealer._id === userSubdealerId
//         );
//       }
      
//       setData(subdealers);
//       setFilteredData(subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (searchValue) => {
//     // Update search fields to include new structure
//     const searchFields = ['name', 'type', 'branchDetails.name', 'creditPeriodDays'];
//     handleFilter(searchValue, searchFields);
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleToggleActive = async (subdealerId, currentStatus) => {
//     if (!canUpdateSubdealer) {
//       showError('You do not have permission to update subdealer status');
//       return;
//     }
    
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

//     try {
//       await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
//         status: newStatus
//       });
//       setData((prevData) => prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []);
//       setFilteredData((prevData) =>
//         prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []
//       );
//       showSuccess('Subdealer status updated successfully!');
//       handleClose();
//     } catch (error) {
//       console.error('Error toggling subdealer status:', error);
//       showError('Failed to update subdealer status');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteSubdealer) {
//       showError('You do not have permission to delete subdealer');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/subdealers/${id}`);
//         setData(data?.filter((subdealer) => subdealer._id !== id) || []);
//         setFilteredData(filteredData?.filter((subdealer) => subdealer._id !== id) || []);
//         showSuccess('Subdealer deleted successfully!');
//         handleClose();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   // Helper function to get location display
//   const getLocationDisplay = (subdealer) => {
//     if (subdealer.latLong?.address) {
//       return subdealer.latLong.address;
//     } else if (subdealer.location) {
//       return subdealer.location; // Fallback for old data
//     }
//     return 'N/A';
//   };

//   // Helper function to get coordinates display
//   const getCoordinatesDisplay = (subdealer) => {
//     if (subdealer.latLong?.coordinates && subdealer.latLong.coordinates.length === 2) {
//       return `(${subdealer.latLong.coordinates[1]}, ${subdealer.latLong.coordinates[0]})`;
//     }
//     return 'N/A';
//   };

//   // Helper function to get credit period display
//   const getCreditPeriodDisplay = (subdealer) => {
//     if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
//       return `${subdealer.creditPeriodDays} days`;
//     }
//     return '0 days'; // Default value for old records
//   };

//   if (!canViewSubdealer) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer List.
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
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer List</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateSubdealer && (
//               <Link to='/add-subdealer'>
//                 <CButton size="sm" className="action-btn me-1" disabled={!canCreateSubdealer}>
//                   <CIcon icon={cilPlus} className='icon'/> New Subdealer
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   handleSearch(e.target.value);
//                 }}
//                 disabled={!canViewSubdealer}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Address</CTableHeaderCell>
//                   <CTableHeaderCell>Coordinates</CTableHeaderCell>
//                   <CTableHeaderCell>Rate Of Interest (%)</CTableHeaderCell>
//                {/*   <CTableHeaderCell>Discount (%)</CTableHeaderCell>*/}
//                   <CTableHeaderCell>Credit Period (Days)</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData && filteredData.length > 0 ? (
//                   filteredData.map((subdealer, index) => (
//                     <CTableRow key={subdealer?._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.branchDetails?.name || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <CIcon icon={cilLocationPin} className="me-1" />
//                           {getLocationDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {getCoordinatesDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
//                         </div>
//                       </CTableDataCell>
//                     {/*  <CTableDataCell>
//                         {subdealer?.discount ? `${subdealer.discount}%` : '0%'}
//                       </CTableDataCell>*/}
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
                       
//                           {getCreditPeriodDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>{subdealer?.type || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={subdealer?.status === 'active' ? 'success' : 'secondary'}>
//                           {subdealer?.status === 'active' ? (
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
//                             onClick={(event) => handleClick(event, subdealer?._id)}
//                             disabled={!canUpdateSubdealer && !canDeleteSubdealer}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${subdealer?._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === subdealer?._id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateSubdealer && (
//                               <Link className="Link" to={`/update-subdealer/${subdealer?._id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                             {canUpdateSubdealer && (
//                               <MenuItem onClick={() => handleToggleActive(subdealer?._id, subdealer?.status)}>
//                                 <CIcon icon={subdealer?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
//                                 {subdealer?.status === 'active' ? 'Deactivate' : 'Activate'}
//                               </MenuItem>
//                             )}
//                             {canDeleteSubdealer && (
//                               <MenuItem onClick={() => handleDelete(subdealer?._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
//                       No subdealers available
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default SubdealerList;









// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormTextarea,
//   CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash,
//   cilCheckCircle,
//   cilXCircle,
//   cilLocationPin,
//   cilGlobeAlt,
//   cilDollar,
//   cilCalendar,
//   cilWarning // Add penalty icon
// } from '@coreui/icons';
// import { Link } from 'react-router-dom';
// import {
//   React as ReactHook,
//   useState as useStateHook,
//   useEffect as useEffectHook,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const SubdealerList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions, user: authUser } = useAuth();
  
//   // Penalty modal states
//   const [showPenaltyModal, setShowPenaltyModal] = useState(false);
//   const [selectedSubdealer, setSelectedSubdealer] = useState(null);
//   const [penaltyData, setPenaltyData] = useState({
//     amount: '',
//     reason: ''
//   });
//   const [submittingPenalty, setSubmittingPenalty] = useState(false);
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
  
//   // Page-level permission checks for Subdealer List page under Subdealer Master module
//   const canViewSubdealer = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canCreateSubdealer = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canUpdateSubdealer = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canDeleteSubdealer = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  
//   // Check if user has permission to add penalty (you may want to create a separate permission for this)
//   const canAddPenalty = canUpdateSubdealer; // Using update permission for now, adjust as needed
  
//   const showActionColumn = canUpdateSubdealer || canDeleteSubdealer || canAddPenalty;

//   useEffect(() => {
//     if (!canViewSubdealer) {
//       showError('You do not have permission to view Subdealer List');
//       return;
//     }
    
//     fetchData();
//   }, [canViewSubdealer]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/subdealers`);
//       let subdealers = response.data.data?.subdealers || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         subdealers = subdealers.filter(subdealer => 
//           subdealer._id === userSubdealerId
//         );
//       }
      
//       setData(subdealers);
//       setFilteredData(subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (searchValue) => {
//     // Update search fields to include new structure
//     const searchFields = ['name', 'type', 'branchDetails.name', 'creditPeriodDays'];
//     handleFilter(searchValue, searchFields);
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   // Penalty Functions
//   const handleOpenPenaltyModal = (subdealer) => {
//     setSelectedSubdealer(subdealer);
//     setPenaltyData({
//       amount: '',
//       reason: ''
//     });
//     setShowPenaltyModal(true);
//     handleClose(); // Close the action menu
//   };

//   const handleClosePenaltyModal = () => {
//     setShowPenaltyModal(false);
//     setSelectedSubdealer(null);
//     setPenaltyData({
//       amount: '',
//       reason: ''
//     });
//   };

//   const handlePenaltyInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Validate amount field to accept only numbers
//     if (name === 'amount') {
//       // Allow only numbers and decimal point
//       if (value === '' || /^\d*\.?\d*$/.test(value)) {
//         setPenaltyData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//     } else {
//       setPenaltyData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmitPenalty = async () => {
//     if (!selectedSubdealer || !canAddPenalty) {
//       showError('Invalid subdealer or insufficient permissions');
//       return;
//     }

//     // Validate inputs
//     if (!penaltyData.amount || parseFloat(penaltyData.amount) <= 0) {
//       showError('Please enter a valid penalty amount');
//       return;
//     }

//     if (!penaltyData.reason || penaltyData.reason.trim() === '') {
//       showError('Please enter a reason for the penalty');
//       return;
//     }

//     try {
//       setSubmittingPenalty(true);
      
//       const payload = {
//         subdealerId: selectedSubdealer._id,
//         amount: parseFloat(penaltyData.amount),
//         reason: penaltyData.reason.trim()
//       };

//       await axiosInstance.post('/penalty/create', payload);
      
//       showSuccess(`Penalty of ₹${penaltyData.amount} applied successfully to ${selectedSubdealer.name}`);
      
//       // Close modal and reset form
//       handleClosePenaltyModal();
      
//       // Refresh data if needed
//       // fetchData();
      
//     } catch (error) {
//       console.error('Error applying penalty:', error);
//       showError(error.response?.data?.message || 'Failed to apply penalty. Please try again.');
//     } finally {
//       setSubmittingPenalty(false);
//     }
//   };

//   const handleToggleActive = async (subdealerId, currentStatus) => {
//     if (!canUpdateSubdealer) {
//       showError('You do not have permission to update subdealer status');
//       return;
//     }
    
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

//     try {
//       await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
//         status: newStatus
//       });
//       setData((prevData) => prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []);
//       setFilteredData((prevData) =>
//         prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []
//       );
//       showSuccess('Subdealer status updated successfully!');
//       handleClose();
//     } catch (error) {
//       console.error('Error toggling subdealer status:', error);
//       showError('Failed to update subdealer status');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteSubdealer) {
//       showError('You do not have permission to delete subdealer');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/subdealers/${id}`);
//         setData(data?.filter((subdealer) => subdealer._id !== id) || []);
//         setFilteredData(filteredData?.filter((subdealer) => subdealer._id !== id) || []);
//         showSuccess('Subdealer deleted successfully!');
//         handleClose();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   // Helper function to get location display
//   const getLocationDisplay = (subdealer) => {
//     if (subdealer.latLong?.address) {
//       return subdealer.latLong.address;
//     } else if (subdealer.location) {
//       return subdealer.location; // Fallback for old data
//     }
//     return 'N/A';
//   };

//   // Helper function to get coordinates display
//   const getCoordinatesDisplay = (subdealer) => {
//     if (subdealer.latLong?.coordinates && subdealer.latLong.coordinates.length === 2) {
//       return `(${subdealer.latLong.coordinates[1]}, ${subdealer.latLong.coordinates[0]})`;
//     }
//     return 'N/A';
//   };

//   // Helper function to get credit period display
//   const getCreditPeriodDisplay = (subdealer) => {
//     if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
//       return `${subdealer.creditPeriodDays} days`;
//     }
//     return '0 days'; // Default value for old records
//   };

//   if (!canViewSubdealer) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer List.
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
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer List</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateSubdealer && (
//               <Link to='/add-subdealer'>
//                 <CButton size="sm" className="action-btn me-1" disabled={!canCreateSubdealer}>
//                   <CIcon icon={cilPlus} className='icon'/> New Subdealer
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   handleSearch(e.target.value);
//                 }}
//                 disabled={!canViewSubdealer}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Address</CTableHeaderCell>
//                   <CTableHeaderCell>Coordinates</CTableHeaderCell>
//                   <CTableHeaderCell>Rate Of Interest (%)</CTableHeaderCell>
//                   <CTableHeaderCell>Credit Period (Days)</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData && filteredData.length > 0 ? (
//                   filteredData.map((subdealer, index) => (
//                     <CTableRow key={subdealer?._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.branchDetails?.name || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <CIcon icon={cilLocationPin} className="me-1" />
//                           {getLocationDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {getCoordinatesDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {getCreditPeriodDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>{subdealer?.type || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={subdealer?.status === 'active' ? 'success' : 'secondary'}>
//                           {subdealer?.status === 'active' ? (
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
//                             onClick={(event) => handleClick(event, subdealer?._id)}
//                             disabled={!canUpdateSubdealer && !canDeleteSubdealer && !canAddPenalty}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${subdealer?._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === subdealer?._id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateSubdealer && (
//                               <Link className="Link" to={`/update-subdealer/${subdealer?._id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                             {canAddPenalty && (
//                               <MenuItem onClick={() => handleOpenPenaltyModal(subdealer)}>
//                                 <CIcon icon={cilWarning} className="me-2" /> 
//                                 Apply Penalty
//                               </MenuItem>
//                             )}
//                             {canUpdateSubdealer && (
//                               <MenuItem onClick={() => handleToggleActive(subdealer?._id, subdealer?.status)}>
//                                 <CIcon icon={subdealer?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
//                                 {subdealer?.status === 'active' ? 'Deactivate' : 'Activate'}
//                               </MenuItem>
//                             )}
//                             {canDeleteSubdealer && (
//                               <MenuItem onClick={() => handleDelete(subdealer?._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
//                       No subdealers available
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Penalty Modal */}
//       <CModal visible={showPenaltyModal} onClose={handleClosePenaltyModal}>
//         <CModalHeader>
//           <CModalTitle>Apply Penalty</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedSubdealer && (
//             <CForm>
//               <div className="mb-3">
//                 <CFormLabel>Subdealer Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   value={selectedSubdealer.name}
//                   readOnly
//                   disabled
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <CFormLabel>
//                   Penalty Amount (₹) <span className="text-danger">*</span>
//                 </CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="amount"
//                   value={penaltyData.amount}
//                   onChange={handlePenaltyInputChange}
//                   placeholder="Enter penalty amount"
//                   required
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <CFormLabel>
//                   Reason <span className="text-danger">*</span>
//                 </CFormLabel>
//                 <CFormTextarea
//                   name="reason"
//                   value={penaltyData.reason}
//                   onChange={handlePenaltyInputChange}
//                   placeholder="Enter reason for penalty"
//                   rows="4"
//                   required
//                 />
//               </div>
//             </CForm>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={handleClosePenaltyModal}
//             disabled={submittingPenalty}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="warning" 
//             onClick={handleSubmitPenalty}
//             disabled={submittingPenalty || !penaltyData.amount || !penaltyData.reason}
//           >
//             {submittingPenalty ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Applying...
//               </>
//             ) : (
//               'Apply Penalty'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default SubdealerList;






// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormTextarea,
//   CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash,
//   cilCheckCircle,
//   cilXCircle,
//   cilLocationPin,
//   cilGlobeAlt,
//   cilDollar,
//   cilCalendar,
//   cilWarning // Add penalty icon
// } from '@coreui/icons';
// import { Link } from 'react-router-dom';
// import {
//   React as ReactHook,
//   useState as useStateHook,
//   useEffect as useEffectHook,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from 'src/utils/tableImports.js';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const SubdealerList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions, user: authUser } = useAuth();
  
//   // Penalty modal states
//   const [showPenaltyModal, setShowPenaltyModal] = useState(false);
//   const [selectedSubdealer, setSelectedSubdealer] = useState(null);
//   const [penaltyData, setPenaltyData] = useState({
//     amount: '',
//     reason: ''
//   });
//   const [submittingPenalty, setSubmittingPenalty] = useState(false);
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
  
//   // Page-level permission checks for Subdealer List page under Subdealer Master module
//   const canViewSubdealer = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canCreateSubdealer = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canUpdateSubdealer = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
//   const canDeleteSubdealer = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  
//   // Check if user has permission to add penalty (using update permission for now, adjust as needed)
//   const canAddPenalty = canUpdateSubdealer;
  
//   const showActionColumn = canUpdateSubdealer || canDeleteSubdealer || canAddPenalty;

//   useEffect(() => {
//     if (!canViewSubdealer) {
//       showError('You do not have permission to view Subdealer List');
//       return;
//     }
    
//     fetchData();
//   }, [canViewSubdealer]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/subdealers`);
//       let subdealers = response.data.data?.subdealers || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         subdealers = subdealers.filter(subdealer => 
//           subdealer._id === userSubdealerId
//         );
//       }
      
//       setData(subdealers);
//       setFilteredData(subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (searchValue) => {
//     // Update search fields to include new structure
//     const searchFields = ['name', 'type', 'branchDetails.name', 'creditPeriodDays'];
//     handleFilter(searchValue, searchFields);
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   // Penalty Functions
//   const handleOpenPenaltyModal = (subdealer) => {
//     if (!canCreateSubdealer) {
//       showError('You do not have permission to apply penalty');
//       return;
//     }
    
//     setSelectedSubdealer(subdealer);
//     setPenaltyData({
//       amount: '',
//       reason: ''
//     });
//     setShowPenaltyModal(true);
//     handleClose(); // Close the action menu
//   };

//   const handleClosePenaltyModal = () => {
//     setShowPenaltyModal(false);
//     setSelectedSubdealer(null);
//     setPenaltyData({
//       amount: '',
//       reason: ''
//     });
//   };

//   const handlePenaltyInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Validate amount field to accept only numbers
//     if (name === 'amount') {
//       // Allow only numbers and decimal point
//       if (value === '' || /^\d*\.?\d*$/.test(value)) {
//         setPenaltyData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//     } else {
//       setPenaltyData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmitPenalty = async () => {
//     if (!selectedSubdealer || !canCreateSubdealer) {
//       showError('Invalid subdealer or insufficient permissions');
//       return;
//     }

//     // Validate inputs
//     if (!penaltyData.amount || parseFloat(penaltyData.amount) <= 0) {
//       showError('Please enter a valid penalty amount');
//       return;
//     }

//     if (!penaltyData.reason || penaltyData.reason.trim() === '') {
//       showError('Please enter a reason for the penalty');
//       return;
//     }

//     try {
//       setSubmittingPenalty(true);
      
//       const payload = {
//         subdealerId: selectedSubdealer._id,
//         amount: parseFloat(penaltyData.amount),
//         reason: penaltyData.reason.trim()
//       };

//       await axiosInstance.post('/penalty/create', payload);
      
//       showSuccess(`Penalty of ₹${penaltyData.amount} applied successfully to ${selectedSubdealer.name}`);
      
//       // Close modal and reset form
//       handleClosePenaltyModal();
      
//       // Refresh data if needed
//       // fetchData();
      
//     } catch (error) {
//       console.error('Error applying penalty:', error);
//       showError(error.response?.data?.message || 'Failed to apply penalty. Please try again.');
//     } finally {
//       setSubmittingPenalty(false);
//     }
//   };

//   const handleToggleActive = async (subdealerId, currentStatus) => {
//     if (!canCreateSubdealer) {
//       showError('You do not have permission to update subdealer status');
//       return;
//     }
    
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

//     try {
//       await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
//         status: newStatus
//       });
//       setData((prevData) => prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []);
//       setFilteredData((prevData) =>
//         prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []
//       );
//       showSuccess('Subdealer status updated successfully!');
//       handleClose();
//     } catch (error) {
//       console.error('Error toggling subdealer status:', error);
//       showError('Failed to update subdealer status');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteSubdealer) {
//       showError('You do not have permission to delete subdealer');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/subdealers/${id}`);
//         setData(data?.filter((subdealer) => subdealer._id !== id) || []);
//         setFilteredData(filteredData?.filter((subdealer) => subdealer._id !== id) || []);
//         showSuccess('Subdealer deleted successfully!');
//         handleClose();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   // Helper function to get location display
//   const getLocationDisplay = (subdealer) => {
//     if (subdealer.latLong?.address) {
//       return subdealer.latLong.address;
//     } else if (subdealer.location) {
//       return subdealer.location; // Fallback for old data
//     }
//     return 'N/A';
//   };

//   // Helper function to get coordinates display
//   const getCoordinatesDisplay = (subdealer) => {
//     if (subdealer.latLong?.coordinates && subdealer.latLong.coordinates.length === 2) {
//       return `(${subdealer.latLong.coordinates[1]}, ${subdealer.latLong.coordinates[0]})`;
//     }
//     return 'N/A';
//   };

//   // Helper function to get credit period display
//   const getCreditPeriodDisplay = (subdealer) => {
//     if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
//       return `${subdealer.creditPeriodDays} days`;
//     }
//     return '0 days'; // Default value for old records
//   };

//   if (!canViewSubdealer) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer List.
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
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer List</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateSubdealer && (
//               <Link to='/add-subdealer'>
//                 <CButton size="sm" className="action-btn me-1" disabled={!canCreateSubdealer}>
//                   <CIcon icon={cilPlus} className='icon'/> New Subdealer
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   handleSearch(e.target.value);
//                 }}
//                 disabled={!canViewSubdealer}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Address</CTableHeaderCell>
//                   <CTableHeaderCell>Coordinates</CTableHeaderCell>
//                   <CTableHeaderCell>Rate Of Interest (%)</CTableHeaderCell>
//                   <CTableHeaderCell>Credit Period (Days)</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData && filteredData.length > 0 ? (
//                   filteredData.map((subdealer, index) => (
//                     <CTableRow key={subdealer?._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{subdealer?.branchDetails?.name || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           <CIcon icon={cilLocationPin} className="me-1" />
//                           {getLocationDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {getCoordinatesDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <div className="d-flex align-items-center">
//                           {getCreditPeriodDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
//                       <CTableDataCell>{subdealer?.type || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={subdealer?.status === 'active' ? 'success' : 'secondary'}>
//                           {subdealer?.status === 'active' ? (
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
//                             onClick={(event) => handleClick(event, subdealer?._id)}
//                             disabled={!canUpdateSubdealer && !canDeleteSubdealer && !canAddPenalty}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${subdealer?._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === subdealer?._id} 
//                             onClose={handleClose}
//                           >
//                             {canUpdateSubdealer && (
//                               <Link className="Link" to={`/update-subdealer/${subdealer?._id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                             {canAddPenalty && canCreateSubdealer && (
//                               <MenuItem onClick={() => handleOpenPenaltyModal(subdealer)}>
//                                 <CIcon icon={cilWarning} className="me-2" /> 
//                                 Apply Penalty
//                               </MenuItem>
//                             )}
//                             {canUpdateSubdealer && canCreateSubdealer && (
//                               <MenuItem onClick={() => handleToggleActive(subdealer?._id, subdealer?.status)}>
//                                 <CIcon icon={subdealer?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
//                                 {subdealer?.status === 'active' ? 'Deactivate' : 'Activate'}
//                               </MenuItem>
//                             )}
//                             {canDeleteSubdealer && (
//                               <MenuItem onClick={() => handleDelete(subdealer?._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "12" : "11"} className="text-center">
//                       No subdealers available
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Penalty Modal */}
//       <CModal visible={showPenaltyModal} onClose={handleClosePenaltyModal}>
//         <CModalHeader>
//           <CModalTitle>Apply Penalty</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedSubdealer && (
//             <CForm>
//               <div className="mb-3">
//                 <CFormLabel>Subdealer Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   value={selectedSubdealer.name}
//                   readOnly
//                   disabled
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <CFormLabel>
//                   Penalty Amount (₹) <span className="text-danger">*</span>
//                 </CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="amount"
//                   value={penaltyData.amount}
//                   onChange={handlePenaltyInputChange}
//                   placeholder="Enter penalty amount"
//                   required
//                 />
//               </div>
              
//               <div className="mb-3">
//                 <CFormLabel>
//                   Reason <span className="text-danger">*</span>
//                 </CFormLabel>
//                 <CFormTextarea
//                   name="reason"
//                   value={penaltyData.reason}
//                   onChange={handlePenaltyInputChange}
//                   placeholder="Enter reason for penalty"
//                   rows="4"
//                   required
//                 />
//               </div>
//             </CForm>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={handleClosePenaltyModal}
//             disabled={submittingPenalty}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="warning" 
//             onClick={handleSubmitPenalty}
//             disabled={submittingPenalty || !penaltyData.amount || !penaltyData.reason}
//           >
//             {submittingPenalty ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Applying...
//               </>
//             ) : (
//               'Apply Penalty'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default SubdealerList;










import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormTextarea,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilWarning
} from '@coreui/icons';
import { Link } from 'react-router-dom';
import {
  React as ReactHook,
  useState as useStateHook,
  useEffect as useEffectHook,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

const SubdealerList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions, user: authUser } = useAuth();
  
  // Penalty modal states
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [penaltyData, setPenaltyData] = useState({
    amount: '',
    reason: ''
  });
  const [submittingPenalty, setSubmittingPenalty] = useState(false);
  
  // Check if user has SUBDEALER role
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
  // Get subdealer ID from user data if user is a subdealer
  const userSubdealerId = authUser?.subdealer?._id;
  
  // Page-level permission checks for Subdealer List page under Subdealer Master module
  const canViewSubdealer = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  const canCreateSubdealer = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  const canUpdateSubdealer = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  const canDeleteSubdealer = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  
  // Check if user has permission to add penalty (using update permission for now, adjust as needed)
  const canAddPenalty = canUpdateSubdealer;
  
  const showActionColumn = canUpdateSubdealer || canDeleteSubdealer || canAddPenalty;

  useEffect(() => {
    if (!canViewSubdealer) {
      showError('You do not have permission to view Subdealer List');
      return;
    }
    
    fetchData();
  }, [canViewSubdealer]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/subdealers`);
      // Extract subdealers from response.data.data.subdealers
      let subdealers = response.data?.data?.subdealers || [];
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        subdealers = subdealers.filter(subdealer => 
          subdealer._id === userSubdealerId
        );
      }
      
      setData(subdealers);
      setFilteredData(subdealers);
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

  const handleSearch = (searchValue) => {
    // Update search fields to include all relevant fields
    const searchFields = [
      'name', 
      'type', 
      'branchDetails.name', 
      'creditPeriodDays',
      'latLong.address',
      'rateOfInterest',
      'discount'
    ];
    handleFilter(searchValue, searchFields);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  // Penalty Functions
  const handleOpenPenaltyModal = (subdealer) => {
    if (!canCreateSubdealer) {
      showError('You do not have permission to apply penalty');
      return;
    }
    
    setSelectedSubdealer(subdealer);
    setPenaltyData({
      amount: '',
      reason: ''
    });
    setShowPenaltyModal(true);
    handleClose(); // Close the action menu
  };

  const handleClosePenaltyModal = () => {
    setShowPenaltyModal(false);
    setSelectedSubdealer(null);
    setPenaltyData({
      amount: '',
      reason: ''
    });
  };

  const handlePenaltyInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate amount field to accept only numbers
    if (name === 'amount') {
      // Allow only numbers and decimal point
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setPenaltyData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setPenaltyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitPenalty = async () => {
    if (!selectedSubdealer || !canCreateSubdealer) {
      showError('Invalid subdealer or insufficient permissions');
      return;
    }

    // Validate inputs
    if (!penaltyData.amount || parseFloat(penaltyData.amount) <= 0) {
      showError('Please enter a valid penalty amount');
      return;
    }

    if (!penaltyData.reason || penaltyData.reason.trim() === '') {
      showError('Please enter a reason for the penalty');
      return;
    }

    try {
      setSubmittingPenalty(true);
      
      const payload = {
        subdealerId: selectedSubdealer._id,
        amount: parseFloat(penaltyData.amount),
        reason: penaltyData.reason.trim()
      };

      await axiosInstance.post('/penalty/create', payload);
      
      showSuccess(`Penalty of ₹${penaltyData.amount} applied successfully to ${selectedSubdealer.name}`);
      
      // Close modal and reset form
      handleClosePenaltyModal();
      
    } catch (error) {
      console.error('Error applying penalty:', error);
      showError(error.response?.data?.message || 'Failed to apply penalty. Please try again.');
    } finally {
      setSubmittingPenalty(false);
    }
  };

  const handleToggleActive = async (subdealerId, currentStatus) => {
    if (!canUpdateSubdealer) {
      showError('You do not have permission to update subdealer status');
      return;
    }
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
        status: newStatus
      });
      
      // Update both data and filteredData
      setData((prevData) => 
        prevData?.map((subdealer) => 
          subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer
        ) || []
      );
      setFilteredData((prevData) =>
        prevData?.map((subdealer) => 
          subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer
        ) || []
      );
      
      showSuccess(`Subdealer ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      handleClose();
    } catch (error) {
      console.error('Error toggling subdealer status:', error);
      showError('Failed to update subdealer status');
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteSubdealer) {
      showError('You do not have permission to delete subdealer');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/subdealers/${id}`);
        setData(data?.filter((subdealer) => subdealer._id !== id) || []);
        setFilteredData(filteredData?.filter((subdealer) => subdealer._id !== id) || []);
        showSuccess('Subdealer deleted successfully!');
        handleClose();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  // Helper function to get location display
  const getLocationDisplay = (subdealer) => {
    if (subdealer.latLong?.address) {
      return subdealer.latLong.address;
    } else if (subdealer.location) {
      return subdealer.location; // Fallback for old data
    }
    return 'N/A';
  };

  // Helper function to get coordinates display
  const getCoordinatesDisplay = (subdealer) => {
    if (subdealer.latLong?.coordinates && 
        Array.isArray(subdealer.latLong.coordinates) && 
        subdealer.latLong.coordinates.length === 2) {
      // API returns [longitude, latitude]
      const [longitude, latitude] = subdealer.latLong.coordinates;
      return `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    }
    return 'N/A';
  };

  // Helper function to get credit period display
  const getCreditPeriodDisplay = (subdealer) => {
    if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
      return `${subdealer.creditPeriodDays} days`;
    }
    return '0 days';
  };

  // Helper function to get branch display
  const getBranchDisplay = (subdealer) => {
    if (subdealer.branchDetails?.name) {
      return subdealer.branchDetails.name;
    } else if (subdealer.branch) {
      return `Branch ID: ${subdealer.branch}`;
    }
    return 'N/A';
  };

  // Helper function to get headers display - shows all headers without truncation
  const getHeadersDisplay = (subdealer) => {
    if (subdealer.headerDetails && subdealer.headerDetails.length > 0) {
      return subdealer.headerDetails.map(header => header.header_key).join(', ');
    } else if (subdealer.headers && subdealer.headers.length > 0) {
      return `${subdealer.headers.length} headers selected`;
    }
    return 'No headers';
  };

  if (!canViewSubdealer) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer List.
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
      <div className='title'>Subdealer List</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateSubdealer && (
              <Link to='/add-subdealer'>
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Subdealer
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                disabled={!canViewSubdealer}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>Coordinates</CTableHeaderCell>
                  <CTableHeaderCell>Rate Of Interest (%)</CTableHeaderCell>
                  <CTableHeaderCell>Credit Period</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Headers</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((subdealer, index) => (
                    <CTableRow key={subdealer?._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{subdealer?.name || ''}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{getBranchDisplay(subdealer)}</CTableDataCell>
                      <CTableDataCell>
                        {getLocationDisplay(subdealer)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getCoordinatesDisplay(subdealer)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getCreditPeriodDisplay(subdealer)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={subdealer?.type === 'B2B' ? 'primary' : 'success'}>
                          {subdealer?.type || ''}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ maxWidth: '300px' }}>
                        <div className="headers-cell">
                          {getHeadersDisplay(subdealer)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={subdealer?.status === 'active' ? 'success' : 'secondary'}>
                          {subdealer?.status === 'active' ? (
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
                            onClick={(event) => handleClick(event, subdealer?._id)}
                            disabled={!canUpdateSubdealer && !canDeleteSubdealer && !canAddPenalty}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${subdealer?._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === subdealer?._id} 
                            onClose={handleClose}
                          >
                            {canUpdateSubdealer && (
                              <Link className="Link" to={`/update-subdealer/${subdealer?._id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canAddPenalty && canCreateSubdealer && (
                              <MenuItem onClick={() => handleOpenPenaltyModal(subdealer)}>
                                <CIcon icon={cilWarning} className="me-2" /> 
                                Apply Penalty
                              </MenuItem>
                            )}
                            {canUpdateSubdealer && (
                              <MenuItem onClick={() => handleToggleActive(subdealer?._id, subdealer?.status)}>
                                <CIcon icon={subdealer?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
                                {subdealer?.status === 'active' ? 'Deactivate' : 'Activate'}
                              </MenuItem>
                            )}
                            {canDeleteSubdealer && (
                              <MenuItem onClick={() => handleDelete(subdealer?._id)}>
                                <CIcon icon={cilTrash} className="me-2" />Delete
                              </MenuItem>
                            )}
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "13" : "12"} className="text-center">
                      No subdealers available
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Penalty Modal */}
      <CModal visible={showPenaltyModal} onClose={handleClosePenaltyModal}>
        <CModalHeader>
          <CModalTitle>Apply Penalty</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedSubdealer && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Subdealer Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={selectedSubdealer.name}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="mb-3">
                <CFormLabel>
                  Penalty Amount (₹) <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="amount"
                  value={penaltyData.amount}
                  onChange={handlePenaltyInputChange}
                  placeholder="Enter penalty amount"
                  required
                />
              </div>
              
              <div className="mb-3">
                <CFormLabel>
                  Reason <span className="text-danger">*</span>
                </CFormLabel>
                <CFormTextarea
                  name="reason"
                  value={penaltyData.reason}
                  onChange={handlePenaltyInputChange}
                  placeholder="Enter reason for penalty"
                  rows="4"
                  required
                />
              </div>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={handleClosePenaltyModal}
            disabled={submittingPenalty}
          >
            Cancel
          </CButton>
          <CButton 
            color="warning" 
            onClick={handleSubmitPenalty}
            disabled={submittingPenalty || !penaltyData.amount || !penaltyData.reason}
          >
            {submittingPenalty ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Applying...
              </>
            ) : (
              'Apply Penalty'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      <style jsx>{`
        .headers-cell {
          max-width: 300px;
          white-space: normal;
          word-wrap: break-word;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default SubdealerList;