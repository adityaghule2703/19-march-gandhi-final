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
//   cilWarning
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
//       // Extract subdealers from response.data.data.subdealers
//       let subdealers = response.data?.data?.subdealers || [];
      
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
//     // Update search fields to include all relevant fields
//     const searchFields = [
//       'name', 
//       'type', 
//       'branchDetails.name', 
//       'creditPeriodDays',
//       'latLong.address',
//       'rateOfInterest',
//       'discount'
//     ];
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
      
//       // Update both data and filteredData
//       setData((prevData) => 
//         prevData?.map((subdealer) => 
//           subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer
//         ) || []
//       );
//       setFilteredData((prevData) =>
//         prevData?.map((subdealer) => 
//           subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer
//         ) || []
//       );
      
//       showSuccess(`Subdealer ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
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
//     if (subdealer.latLong?.coordinates && 
//         Array.isArray(subdealer.latLong.coordinates) && 
//         subdealer.latLong.coordinates.length === 2) {
//       // API returns [longitude, latitude]
//       const [longitude, latitude] = subdealer.latLong.coordinates;
//       return `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
//     }
//     return 'N/A';
//   };

//   // Helper function to get credit period display
//   const getCreditPeriodDisplay = (subdealer) => {
//     if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
//       return `${subdealer.creditPeriodDays} days`;
//     }
//     return '0 days';
//   };

//   // Helper function to get branch display
//   const getBranchDisplay = (subdealer) => {
//     if (subdealer.branchDetails?.name) {
//       return subdealer.branchDetails.name;
//     } else if (subdealer.branch) {
//       return `Branch ID: ${subdealer.branch}`;
//     }
//     return 'N/A';
//   };

//   // Helper function to get headers display - shows all headers without truncation
//   const getHeadersDisplay = (subdealer) => {
//     if (subdealer.headerDetails && subdealer.headerDetails.length > 0) {
//       return subdealer.headerDetails.map(header => header.header_key).join(', ');
//     } else if (subdealer.headers && subdealer.headers.length > 0) {
//       return `${subdealer.headers.length} headers selected`;
//     }
//     return 'No headers';
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
//                 <CButton size="sm" className="action-btn me-1">
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
//                   <CTableHeaderCell>Credit Period</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Headers</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData && filteredData.length > 0 ? (
//                   filteredData.map((subdealer, index) => (
//                     <CTableRow key={subdealer?._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>
//                         <strong>{subdealer?.name || ''}</strong>
//                       </CTableDataCell>
//                       <CTableDataCell>{getBranchDisplay(subdealer)}</CTableDataCell>
//                       <CTableDataCell>
//                         {getLocationDisplay(subdealer)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {getCoordinatesDisplay(subdealer)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {getCreditPeriodDisplay(subdealer)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CBadge color={subdealer?.type === 'B2B' ? 'primary' : 'success'}>
//                           {subdealer?.type || ''}
//                         </CBadge>
//                       </CTableDataCell>
//                       <CTableDataCell style={{ maxWidth: '300px' }}>
//                         <div className="headers-cell">
//                           {getHeadersDisplay(subdealer)}
//                         </div>
//                       </CTableDataCell>
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
//                     <CTableDataCell colSpan={showActionColumn ? "13" : "12"} className="text-center">
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

//       <style jsx>{`
//         .headers-cell {
//           max-width: 300px;
//           white-space: normal;
//           word-wrap: break-word;
//           line-height: 1.4;
//         }
//       `}</style>
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
  CFormLabel,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilPrint,
  cilCloudDownload,
  cilChevronLeft,
  cilChevronRight
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
} from 'src/utils/tableImports';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';
import QRCode from 'qrcode';
import tvsLogo from '../../assets/images/logo.png';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const SubdealerList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions, user: authUser } = useAuth();
  
  // Pagination states
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: '',
    totalRecords: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Penalty modal states
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [penaltyData, setPenaltyData] = useState({
    amount: '',
    reason: '',
    penaltyType: 'DIRECT_DEBIT',
    bookingId: '',
    penaltyDate: new Date().toISOString().split('T')[0]
  });
  const [submittingPenalty, setSubmittingPenalty] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  // Receipts/Penalties state
  const [penaltiesData, setPenaltiesData] = useState({});
  const [loadingPenalties, setLoadingPenalties] = useState({});
  const [penaltiesFetched, setPenaltiesFetched] = useState({});
  
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
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewSubdealer]);

  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const response = await axiosInstance.get(`/subdealers?${params.toString()}`);
      let subdealers = response.data?.data?.subdealers || [];
      const paginationInfo = response.data?.data?.pagination || {
        current: page,
        total: 1,
        count: subdealers.length,
        totalRecords: subdealers.length,
        hasNext: false,
        hasPrev: false
      };
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        subdealers = subdealers.filter(subdealer => 
          subdealer._id === userSubdealerId
        );
      }
      
      setPagination({
        docs: subdealers,
        total: paginationInfo.totalRecords || subdealers.length,
        pages: paginationInfo.total || 1,
        currentPage: paginationInfo.current || page,
        limit: limit,
        loading: false,
        search: search,
        totalRecords: paginationInfo.totalRecords || subdealers.length,
        hasNext: paginationInfo.hasNext || false,
        hasPrev: paginationInfo.hasPrev || false
      });
      
      setData(subdealers);
      setFilteredData(subdealers);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setData([]);
      setFilteredData([]);
      setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0, totalRecords: 0 }));
    }
  };

  // Fetch penalties for a subdealer
  const fetchPenaltiesForSubdealer = async (subdealerId) => {
    if (!subdealerId) return;
    
    const key = subdealerId;
    
    if (penaltiesFetched[key] || loadingPenalties[key]) return;
    
    try {
      setLoadingPenalties(prev => ({ ...prev, [key]: true }));
      const response = await axiosInstance.get(`/penalty/subdealer/${subdealerId}/complete-details`);
      
      const penalties = response.data?.data?.penalties?.list || [];
      const summary = response.data?.data?.summary || {};
      const subdealerData = response.data?.data?.subdealer || {};
      
      setPenaltiesData(prev => ({ 
        ...prev, 
        [key]: { 
          penalties, 
          summary,
          subdealer: subdealerData
        } 
      }));
      setPenaltiesFetched(prev => ({ ...prev, [key]: true }));
    } catch (error) {
      console.error(`Error fetching penalties for subdealer ${subdealerId}:`, error);
      setPenaltiesData(prev => ({ 
        ...prev, 
        [key]: { 
          penalties: [], 
          summary: {},
          subdealer: null 
        } 
      }));
      setPenaltiesFetched(prev => ({ ...prev, [key]: true }));
    } finally {
      setLoadingPenalties(prev => ({ ...prev, [key]: false }));
    }
  };

  // Format date for display
  const formatDateDDMMYYYY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const numberToWordsSimple = (num) => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const numToWords = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };
    return numToWords(Math.floor(num)) + (num % 1 ? ' point ' + num.toString().split('.')[1] : '');
  };

  // Generate receipt HTML for penalty - Clean version without duplicate branch details
const generatePenaltyReceiptHTML = async (penalty, subdealerData) => {
  const amount = penalty.amount || 0;
  const penaltyDate = formatDateDDMMYYYY(penalty.penaltyDate);
  const currentDate = formatDateDDMMYYYY(new Date());
  const referenceNumber = penalty.referenceNumber || 'N/A';
  const reason = penalty.reason || 'No reason provided';
  const penaltyType = penalty.penaltyType === 'DIRECT_DEBIT' ? 'Direct Debit' : 'Against Booking';
  const status = penalty.status || 'ACTIVE';
  const approvalStatus = penalty.approvalStatus || 'PENDING';
  const bookingNumber = penalty.linkedBooking?.bookingNumber || 'N/A';
  const customerName = penalty.linkedBooking?.customerDetails?.name || 'N/A';
  
  // Get branch/dealer details from subdealerData for header
  const branchName = subdealerData.branch?.name || 'GANDHI TVS';
  const branchAddress = subdealerData.branch?.address || 'N/A';
  const branchPhone = subdealerData.branch?.phone || 'N/A';
  const branchEmail = subdealerData.branch?.email || '';
  
  // Get subdealer location address
  const subdealerAddress = subdealerData.location?.address || subdealerData.latLong?.address || 'N/A';
  const subdealerName = subdealerData.name || 'N/A';
  
  const qrText = `${branchName}\nPenalty Receipt\nSubdealer: ${subdealerName}\nReference: ${referenceNumber}\nAmount: ₹${amount}\nType: ${penaltyType}\nDate: ${penaltyDate}`;
  
  let qrCodeImage = '';
  try {
    qrCodeImage = await QRCode.toDataURL(qrText, {
      width: 150,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'H'
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    qrCodeImage = '';
  }
  
  const amountInWords = numberToWordsSimple(amount);
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>Penalty Receipt - ${referenceNumber}</title>
  <style>
    body { font-family: "Courier New", Courier, monospace; margin: 0; padding: 10mm; font-size: 15px; color: #333; }
    .page { width: 210mm; margin: 0 auto; }
    .receipt-copy { height: auto; min-height: 130mm; page-break-inside: avoid; }
    .header-container { display: flex; justify-content: space-between; margin-bottom: 2mm; align-items: flex-start; }
    .header-left { width: 60%; }
    .header-right { width: 40%; text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
    .logo-qr-container { display: flex; align-items: center; gap: 10px; justify-content: flex-end; margin-bottom: 5px; width: 100%; }
    .logo { height: 51px; }
    .qr-code-small { width: 81px; height: 81px; border: 1px solid #ccc; }
    .dealer-info { text-align: left; font-size: 13px; line-height: 1.2; }
    .dealer-name { font-size: 17px; font-weight: bold; margin: 0 0 3px 0; }
    .subdealer-info-container { display: flex; font-size: 14px; margin: 10px 0; }
    .subdealer-info-left { width: 50%; }
    .subdealer-info-right { width: 50%; }
    .info-row { margin: 2mm 0; line-height: 1.2; }
    .info-row .value { font-weight: 700; }
    .divider { border-top: 2px solid #AAAAAA; margin: 3mm 0; }
    .receipt-info { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 9px; margin: 11px 0; font-size: 14px; }
    .receipt-info .value { font-weight: 700; }
    .payment-info-box { margin: 11px 0; }
    .signature-box { margin-top: 16mm; font-size: 11pt; }
    .signature-line { border-top: 1px dashed #000; width: 41mm; display: inline-block; margin: 0 5mm; }
    .cutting-line { border-top: 2px dashed #333; margin: 16mm 0 11mm 0; text-align: center; position: relative; }
    .cutting-line::before { content: "✂ Cut Here ✂"; position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: white; padding: 0 11px; font-size: 13px; color: #666; }
    .note { padding: 2px; margin: 3px; font-size: 12px; }
    .amount-in-words { font-style: italic; margin-top: 9px; padding: 6px; font-size: 13px; border-top: 1px dashed #ccc; }
    .status-badge { display: inline-block; padding: 4px 9px; border-radius: 12px; font-size: 12px; font-weight: bold; background-color: ${status === 'ACTIVE' ? '#d4edda' : '#f8d7da'}; color: ${status === 'ACTIVE' ? '#155724' : '#721c24'}; }
    .footer-note { font-size: 10px; color: #777; text-align: center; margin-top: 5mm; }
    .remark-box { margin-top: 10px; padding: 8px; background-color: #f8f9fa; border-left: 3px solid #6c757d; font-size: 13px; }
    @page { size: A4; margin: 10mm; }
    @media print { body { padding: 0; } .receipt-copy { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <div class="dealer-name">${branchName}</div>
          <div class="dealer-info">Authorized Main Dealer: TVS Motor Company Ltd.<br>${branchAddress}<br>Phone: ${branchPhone}${branchEmail ? ` | Email: ${branchEmail}` : ''}</div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
            ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
          </div>
          <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
          <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${referenceNumber}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="receipt-info">
        <div><strong>PENALTY RECEIPT</strong></div>
        <div><strong>Penalty Date:</strong> <span class="value">${penaltyDate}</span></div>
      </div>
      <div class="subdealer-info-container">
        <div class="subdealer-info-left">
          <div class="info-row"><strong>Subdealer Name:</strong> <span class="value">${subdealerName}</span></div>
          <div class="info-row"><strong>Subdealer Address:</strong> <span class="value">${subdealerAddress}</span></div>
        </div>
        <div class="subdealer-info-right">
          <div class="info-row"><strong>Penalty Type:</strong> <span class="value">${penaltyType}</span></div>
          ${penaltyType === 'Against Booking' ? `<div class="info-row"><strong>Booking Number:</strong> <span class="value">${bookingNumber}</span></div>` : ''}
          ${penaltyType === 'Against Booking' ? `<div class="info-row"><strong>Customer Name:</strong> <span class="value">${customerName}</span></div>` : ''}
          <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
        </div>
      </div>
      <div class="payment-info-box">
        <div class="receipt-info" style="padding: 5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div><strong>Penalty Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
            
            <div><strong>Balance:</strong> <span class="value">₹${(penalty.balance || amount).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
        <div class="amount-in-words">
          <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
        </div>
      </div>
      
      <div class="info-row">
        <strong>Status:</strong> 
        <span class="status-badge">
          ${status === 'ACTIVE' ? 'Active' : 'Cancelled'}
          ${approvalStatus !== 'PENDING' ? ` (${approvalStatus})` : ''}
        </span>
      </div>
      
      ${reason && reason !== 'No reason provided' ? `
      <div class="remark-box">
        <strong>Reason for Penalty:</strong><br>
        ${reason}
      </div>
      ` : ''}
      
      <div class="note">
        <strong>Notes:</strong> <span class="value">This penalty amount will be adjusted against the subdealer's account.</span>
      </div>
      
      <div class="divider"></div>
      <div class="signature-box">
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align:center; width: 30%;"><div class="signature-line"></div><div>Subdealer's Signature</div></div>
          <div style="text-align:center; width: 30%;"><div class="signature-line"></div><div>Authorised Signatory</div></div>
          <div style="text-align:center; width: 30%;"><div class="signature-line"></div><div>Accountant</div></div>
        </div>
      </div>
      <div class="footer-note">This is a computer generated receipt - valid without signature</div>
    </div>
    <div class="cutting-line"></div>
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <div class="dealer-name">${branchName}</div>
          <div class="dealer-info">Authorized Main Dealer: TVS Motor Company Ltd.<br>${branchAddress}<br>Phone: ${branchPhone}${branchEmail ? ` | Email: ${branchEmail}` : ''}</div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
            ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
          </div>
          <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
          <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${referenceNumber}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="receipt-info">
        <div><strong>PENALTY RECEIPT (DUPLICATE)</strong></div>
        <div><strong>Penalty Date:</strong> <span class="value">${penaltyDate}</span></div>
      </div>
      <div class="subdealer-info-container">
        <div class="subdealer-info-left">
          <div class="info-row"><strong>Subdealer Name:</strong> <span class="value">${subdealerName}</span></div>
          <div class="info-row"><strong>Subdealer Address:</strong> <span class="value">${subdealerAddress}</span></div>
        </div>
        <div class="subdealer-info-right">
          <div class="info-row"><strong>Penalty Type:</strong> <span class="value">${penaltyType}</span></div>
          ${penaltyType === 'Against Booking' ? `<div class="info-row"><strong>Booking Number:</strong> <span class="value">${bookingNumber}</span></div>` : ''}
          <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
        </div>
      </div>
      <div class="payment-info-box">
        <div class="receipt-info" style="padding: 5px;">
          <div><strong>Penalty Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
        </div>
        <div class="amount-in-words">
          <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
        </div>
      </div>
      
      ${reason && reason !== 'No reason provided' ? `
      <div class="remark-box">
        <strong>Reason for Penalty:</strong><br>
        ${reason}
      </div>
      ` : ''}
      
      <div class="note">
        <strong>Notes:</strong> <span class="value">This penalty amount will be adjusted against the subdealer's account.</span>
      </div>
      
      <div class="divider"></div>
      <div class="signature-box">
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align:center; width: 30%;"><div class="signature-line"></div><div>Subdealer's Signature</div></div>
          <div style="text-align:center; width: 30%;"><div class="signature-line"></div><div>Authorised Signatory</div></div>
          <div style="text-align:center; width: 30%;"><div class="signature-line"></div><div>Accountant</div></div>
        </div>
      </div>
      <div class="footer-note">This is a computer generated receipt - valid without signature</div>
    </div>
  </div>
</body>
</html>`;
};

  const printPenaltyReceipt = async (penalty, subdealerId) => {
    try {
      const subdealerData = penaltiesData[subdealerId]?.subdealer;
      if (!subdealerData) {
        showError('Subdealer data not available');
        return;
      }
      
      const receiptHTML = await generatePenaltyReceiptHTML(penalty, subdealerData);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.onload = function() { 
        printWindow.focus(); 
        printWindow.print(); 
      };
    } catch (err) {
      console.error('Error generating receipt:', err);
      showError('Failed to generate receipt. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchData(newPage, pagination.limit, pagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchData(1, limit, pagination.search);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    fetchData(1, pagination.limit, searchValue);
  };

  // Fetch bookings for selected subdealer
  const fetchBookingsForSubdealer = async (subdealerId) => {
    try {
      setLoadingBookings(true);
      const response = await axiosInstance.get(`/subdealers/${subdealerId}/financial-summary`);
      
      const recentTransactions = response.data?.data?.recentTransactions || [];
      
      const formattedBookings = recentTransactions.map(booking => ({
        _id: booking._id,
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        totalAmount: booking.totalAmount,
        balanceAmount: booking.balanceAmount,
        status: booking.status,
        displayText: `${booking.bookingNumber} - ${booking.customerName} (${booking.status}) - ₹${booking.balanceAmount?.toLocaleString() || 0}`
      }));
      
      setBookings(formattedBookings);
      return formattedBookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError('Failed to fetch bookings for this subdealer');
      setBookings([]);
      return [];
    } finally {
      setLoadingBookings(false);
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

  // Penalty Functions
  const handleOpenPenaltyModal = async (subdealer) => {
    if (!canCreateSubdealer) {
      showError('You do not have permission to apply penalty');
      return;
    }
    
    setSelectedSubdealer(subdealer);
    setPenaltyData({
      amount: '',
      reason: '',
      penaltyType: 'DIRECT_DEBIT',
      bookingId: '',
      penaltyDate: new Date().toISOString().split('T')[0]
    });
    
    setBookings([]);
    
    await fetchBookingsForSubdealer(subdealer._id);
    
    setShowPenaltyModal(true);
    handleClose();
  };

  const handleClosePenaltyModal = () => {
    setShowPenaltyModal(false);
    setSelectedSubdealer(null);
    setPenaltyData({
      amount: '',
      reason: '',
      penaltyType: 'DIRECT_DEBIT',
      bookingId: '',
      penaltyDate: new Date().toISOString().split('T')[0]
    });
    setBookings([]);
    setLoadingBookings(false);
  };

  const handlePenaltyInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
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

  const handlePenaltyTypeChange = (e) => {
    const penaltyType = e.target.value;
    setPenaltyData(prev => ({
      ...prev,
      penaltyType: penaltyType,
      bookingId: penaltyType === 'DIRECT_DEBIT' ? '' : prev.bookingId
    }));
  };

 const handleSubmitPenalty = async () => {
  if (!selectedSubdealer || !canCreateSubdealer) {
    showError('Invalid subdealer or insufficient permissions');
    return;
  }

  if (!penaltyData.amount || parseFloat(penaltyData.amount) <= 0) {
    showError('Please enter a valid penalty amount');
    return;
  }

  if (!penaltyData.reason || penaltyData.reason.trim() === '') {
    showError('Please enter a reason for the penalty');
    return;
  }

  if (penaltyData.penaltyType === 'AGAINST_BOOKING' && !penaltyData.bookingId) {
    showError('Please select a booking for the penalty');
    return;
  }

  try {
    setSubmittingPenalty(true);
    
    let payload = {
      subdealerId: selectedSubdealer._id,
      amount: parseFloat(penaltyData.amount),
      reason: penaltyData.reason.trim(),
      penaltyType: penaltyData.penaltyType,
      penaltyDate: penaltyData.penaltyDate
    };
    
    if (penaltyData.penaltyType === 'AGAINST_BOOKING') {
      payload.bookingId = penaltyData.bookingId;
    }
    
    await axiosInstance.post('/penalty/create', payload);
    
    showSuccess(`Penalty of ₹${penaltyData.amount} applied successfully to ${selectedSubdealer.name}`);
    
    // Clear the fetched flag for this subdealer to force refresh
    setPenaltiesFetched(prev => ({ 
      ...prev, 
      [selectedSubdealer._id]: false 
    }));
    
    // Clear existing penalties data for this subdealer
    setPenaltiesData(prev => ({ 
      ...prev, 
      [selectedSubdealer._id]: null 
    }));
    
    // Fetch fresh penalties for this subdealer
    await fetchPenaltiesForSubdealer(selectedSubdealer._id);
    
    // Close the modal
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
      
      setPagination(prev => ({
        ...prev,
        docs: prev.docs.map((subdealer) => 
          subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer
        )
      }));
      
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
        setPagination(prev => ({
          ...prev,
          docs: prev.docs.filter((subdealer) => subdealer._id !== id),
          totalRecords: prev.totalRecords - 1
        }));
        showSuccess('Subdealer deleted successfully!');
        handleClose();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const renderPagination = () => {
    const { currentPage, pages, totalRecords, limit, loading } = pagination;
    if (!totalRecords || pages <= 1) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalRecords);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(5, pages);
    if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

    const pageNums = [];
    for (let i = startPage; i <= endPage; i++) pageNums.push(i);

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={limit}
              onChange={e => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${totalRecords} entries`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            {pageNums.map(p => (
              <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}
            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}
            <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // Helper functions for display
  const getLocationDisplay = (subdealer) => {
    if (subdealer.latLong?.address) {
      return subdealer.latLong.address;
    } else if (subdealer.location) {
      return subdealer.location;
    }
    return 'N/A';
  };

  const getCoordinatesDisplay = (subdealer) => {
    if (subdealer.latLong?.coordinates && 
        Array.isArray(subdealer.latLong.coordinates) && 
        subdealer.latLong.coordinates.length === 2) {
      const [longitude, latitude] = subdealer.latLong.coordinates;
      return `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    }
    return 'N/A';
  };

  const getCreditPeriodDisplay = (subdealer) => {
    if (subdealer.creditPeriodDays !== undefined && subdealer.creditPeriodDays !== null) {
      return `${subdealer.creditPeriodDays} days`;
    }
    return '0 days';
  };

  const getBranchDisplay = (subdealer) => {
    if (subdealer.branchDetails?.name) {
      return subdealer.branchDetails.name;
    } else if (subdealer.branch) {
      return `Branch ID: ${subdealer.branch}`;
    }
    return 'N/A';
  };

  const getHeadersDisplay = (subdealer) => {
    if (subdealer.headerDetails && subdealer.headerDetails.length > 0) {
      return subdealer.headerDetails.map(header => header.header_key).join(', ');
    } else if (subdealer.headers && subdealer.headers.length > 0) {
      return `${subdealer.headers.length} headers selected`;
    }
    return 'No headers';
  };

  // Render Receipts cell content
  const renderReceiptsCell = (subdealer) => {
    const subdealerId = subdealer._id;
    const isLoading = loadingPenalties[subdealerId];
    const penalties = penaltiesData[subdealerId]?.penalties || [];
    const summary = penaltiesData[subdealerId]?.summary || {};
    
    if (isLoading) {
      return (
        <CTableDataCell>
          <div className="d-flex justify-content-center">
            <CSpinner size="sm" color="primary" />
          </div>
        </CTableDataCell>
      );
    }
    
    if (penalties.length > 0) {
      return (
        <CTableDataCell>
          <CDropdown>
            <CDropdownToggle size="sm" color="info" variant="outline">
              {penalties.length} Receipt{penalties.length > 1 ? 's' : ''}
            </CDropdownToggle>
            <CDropdownMenu>
              {penalties.map((penalty, index) => {
                const amount = penalty.amount || 0;
                const penaltyDate = formatDateDDMMYYYY(penalty.penaltyDate);
                const penaltyType = penalty.penaltyType === 'DIRECT_DEBIT' ? 'Direct Debit' : 'Against Booking';
                const bookingNumber = penalty.linkedBooking?.bookingNumber || '';
                const isPaid = penalty.isPaid || false;
                const balance = penalty.balance || amount;
                
                return (
                  <CDropdownItem 
                    key={penalty._id || index} 
                    onClick={() => printPenaltyReceipt(penalty, subdealerId)}
                  >
                    <div className="d-flex align-items-start">
                      <CIcon icon={cilPrint} className="me-2 mt-1" />
                      <div>
                        <div>
                          <strong>Receipt #{index + 1}</strong> - 
                          <small className="text-muted ms-1">{penalty.referenceNumber}</small>
                        </div>
                        <small>
                          ₹{amount.toLocaleString('en-IN')} - {penaltyDate}
                          {penaltyType === 'Against Booking' && bookingNumber && (
                            <span className="ms-1">- Booking: {bookingNumber}</span>
                          )}
                        </small>
                        <div>
                          <small className="text-muted">
                            Type: {penaltyType}
                            {!isPaid && balance > 0 && (
                              <span className="ms-2 text-warning">
                                Balance: ₹{balance.toLocaleString('en-IN')}
                              </span>
                            )}
                            {isPaid && (
                              <CBadge color="success" size="sm" className="ms-2">Paid</CBadge>
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  </CDropdownItem>
                );
              })}
              {summary.totalAmount > 0 && (
                <CDropdownItem divider />
              )}
              {summary.totalAmount > 0 && (
                <CDropdownItem className="text-muted">
                  <div className="d-flex justify-content-between w-100">
                    <small><strong>Total:</strong> ₹{summary.totalAmount?.toLocaleString('en-IN')}</small>
                    <small><strong>Outstanding:</strong> ₹{summary.totalOutstanding?.toLocaleString('en-IN')}</small>
                  </div>
                </CDropdownItem>
              )}
            </CDropdownMenu>
          </CDropdown>
        </CTableDataCell>
      );
    }
    
    if (penaltiesFetched[subdealerId]) {
      return (
        <CTableDataCell>
          <span className="text-muted">No penalties</span>
        </CTableDataCell>
      );
    }
    
    return (
      <CTableDataCell>
        <CButton 
          size="sm" 
          color="light" 
          onClick={() => fetchPenaltiesForSubdealer(subdealerId)}
        >
          <CIcon icon={cilCloudDownload} className="me-1" /> Load Receipts
        </CButton>
      </CTableDataCell>
    );
  };

  if (!canViewSubdealer) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer List.
      </div>
    );
  }

  if (loading && pagination.docs.length === 0 && !pagination.search) {
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
          <div className="text-muted">
            Total Records: {pagination.totalRecords || 0}
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
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search by name, branch, type..."
              />
            </div>
          </div>
          
          {pagination.loading && pagination.docs.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Searching records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
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
                  <CTableHeaderCell>Receipts</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs && pagination.docs.length > 0 ? (
                  pagination.docs.map((subdealer, index) => (
                    <CTableRow key={subdealer?._id || index}>
                      <CTableDataCell>{(pagination.currentPage - 1) * pagination.limit + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{subdealer?.name || ''}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{getBranchDisplay(subdealer)}</CTableDataCell>
                      <CTableDataCell>{getLocationDisplay(subdealer)}</CTableDataCell>
                      <CTableDataCell>{getCoordinatesDisplay(subdealer)}</CTableDataCell>
                      <CTableDataCell>
                        {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
                      </CTableDataCell>
                      <CTableDataCell>{getCreditPeriodDisplay(subdealer)}</CTableDataCell>
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
                      {renderReceiptsCell(subdealer)}
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
                      {pagination.search ? `No subdealers found for "${pagination.search}"` : 'No subdealers available'}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
          {renderPagination()}
        </CCardBody>
      </CCard>

      {/* Penalty Modal */}
      <CModal visible={showPenaltyModal} onClose={handleClosePenaltyModal} size="lg">
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
                  Penalty Type <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="penaltyType"
                  value={penaltyData.penaltyType}
                  onChange={handlePenaltyTypeChange}
                  required
                >
                  <option value="DIRECT_DEBIT">Direct Debit</option>
                  <option value="AGAINST_BOOKING">Against Booking</option>
                </CFormSelect>
              </div>
              
              {penaltyData.penaltyType === 'AGAINST_BOOKING' && (
                <div className="mb-3">
                  <CFormLabel>
                    Select Booking <span className="text-danger">*</span>
                  </CFormLabel>
                  {loadingBookings ? (
                    <div className="text-center p-3">
                      <CSpinner size="sm" color="primary" />
                      <span className="ms-2">Loading bookings...</span>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="alert alert-warning">
                      No approved bookings found for this subdealer
                    </div>
                  ) : (
                    <CFormSelect
                      name="bookingId"
                      value={penaltyData.bookingId}
                      onChange={handlePenaltyInputChange}
                      required
                    >
                      <option value="">Select a booking</option>
                      {bookings.map((booking) => (
                        <option key={booking._id} value={booking._id}>
                          {booking.displayText}
                        </option>
                      ))}
                    </CFormSelect>
                  )}
                </div>
              )}
              
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
              
              <div className="mb-3">
                <CFormLabel>Penalty Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="penaltyDate"
                  value={penaltyData.penaltyDate}
                  onChange={handlePenaltyInputChange}
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
            disabled={submittingPenalty || !penaltyData.amount || !penaltyData.reason || (penaltyData.penaltyType === 'AGAINST_BOOKING' && (!penaltyData.bookingId || loadingBookings))}
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
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
};

export default SubdealerList;