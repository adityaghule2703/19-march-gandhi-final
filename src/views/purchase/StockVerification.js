// import React, { useState, useEffect } from 'react';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CFormCheck
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import Swal from 'sweetalert2';
// import { 
//   hasSafePagePermission, 
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage 
// } from '../../utils/modulePermissions';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle, cilZoomOut } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';

// function StockVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions = [] } = useAuth();
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = (localStorage.getItem('userRole') || '').toUpperCase();

//   // Page-level permission checks for Stock Verification
//   const hasStockVerificationView = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW
//   );
  
//   const hasStockVerificationCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.CREATE
//   );

//   // Using convenience functions
//   const canViewStockVerification = canViewPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION
//   );
  
//   const canVerifyStock = canCreateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION
//   );

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewStockVerification) {
//       showError('You do not have permission to view Stock Verification');
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, []);

//   const fetchData = async () => {
//     if (!canViewStockVerification) return;
    
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get('/vehicles/status/not_approved');
//       let vehicles = res.data?.data?.vehicles || [];
//       setPendingData(vehicles);
//       setFilteredPendings(vehicles);
//     } catch (err) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewStockVerification) return;
    
//     try {
//       const res = await axiosInstance.get('/vehicles/status/in_stock');
//       let vehicles = res.data?.data?.vehicles || [];
//       setApprovedData(vehicles);
//       setFilteredApproved(vehicles);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleSelectVehicle = (vehicleId, isChecked) => {
//     if (!canVerifyStock) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }
    
//     if (isChecked) {
//       setSelectedVehicles([...selectedVehicles, vehicleId]);
//     } else {
//       setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
//     }
//   };

//   const verifyVehicles = async () => {
//     if (!canVerifyStock) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }

//     if (selectedVehicles.length === 0) {
//       showError('Please select at least one vehicle to verify');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify them!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: selectedVehicles
//       });

//       showSuccess('Vehicles verified successfully!');
//       setSelectedVehicles([]);
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicles:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleVerifySingle = async (vehicleId) => {
//     if (!canVerifyStock) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Confirm Verification',
//       html: `Are you sure you want to verify this vehicle?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify it!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: [vehicleId]
//       });

//       showSuccess('Vehicle verified successfully!');
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicle:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('inward'));
//     else handleApprovedFilter('', getDefaultSearchFields('inward'));
//   };

//   const renderPendingTable = () => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {canVerifyStock && (
//                 <CTableHeaderCell scope="col">
//                   Select
//                 </CTableHeaderCell>
//               )}
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//               {canVerifyStock && (
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={canVerifyStock ? "8" : "7"} 
//                   style={{ color: 'red', textAlign: 'center' }}
//                 >
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   {canVerifyStock && (
//                     <CTableDataCell>
//                       <CFormCheck
//                         checked={selectedVehicles.includes(vehicle._id)}
//                         onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
//                       />
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                   {canVerifyStock && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifySingle(vehicle._id)} 
//                         disabled={isVerifying}
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         {isVerifying ? 'Verifying...' : 'Verify'}
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedTable = () => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="6" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewStockVerification) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Stock Verification.
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
//       <div className='title'>Inward Stock Verification</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {activeTab === 0 && canVerifyStock && selectedVehicles.length > 0 && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={verifyVehicles} 
//                 disabled={isVerifying}
//               >
//                 <CIcon icon={cilCheckCircle} className='icon'/>
//                 {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
//               </CButton>
//             )}
            
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 0}
//                 onClick={() => handleTabChange(0)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                   color: 'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 PENDING VERIFICATION
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 1}
//                 onClick={() => handleTabChange(1)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 VERIFIED STOCK
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
//                   else handleApprovedFilter(e.target.value, getDefaultSearchFields('inward'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderPendingTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderVerifiedTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default StockVerification;




// import React, { useState, useEffect } from 'react';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CFormCheck,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import Swal from 'sweetalert2';
// import { 
//   hasSafePagePermission, 
//   MODULES, 
//   PAGES,
//   TABS,  // Added TABS import
//   ACTIONS,
//   canViewPage,
//   canCreateInPage 
// } from '../../utils/modulePermissions';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle, cilZoomOut } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';

// function StockVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions = [] } = useAuth();
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = (localStorage.getItem('userRole') || '').toUpperCase();

//   // Tab-level VIEW permission checks
//   const canViewPendingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );
  
//   const canViewVerifiedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.VERIFIED_STOCK
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingTab || canViewVerifiedTab;

//   // Tab-level CREATE permission checks (for actions on tabs)
//   const canVerifyInPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.PURCHASE,
//     PAGES.PURCHASE.STOCK_VERIFICATION,
//     ACTIONS.CREATE,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );

//   // For backward compatibility - check if user has any CREATE permission on the page
//   const canVerifyStock = canCreateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION
//   ) || canVerifyInPendingTab;

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingTab) visibleTabs.push(0);
//     if (canViewVerifiedTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingTab, canViewVerifiedTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Stock Verification tabs');
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, []);

//   const fetchData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get('/vehicles/status/not_approved');
//       let vehicles = res.data?.data?.vehicles || [];
//       setPendingData(vehicles);
//       setFilteredPendings(vehicles);
//     } catch (err) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       const res = await axiosInstance.get('/vehicles/status/in_stock');
//       let vehicles = res.data?.data?.vehicles || [];
//       setApprovedData(vehicles);
//       setFilteredApproved(vehicles);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleSelectVehicle = (vehicleId, isChecked) => {
//     if (!canVerifyStock) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }
    
//     if (isChecked) {
//       setSelectedVehicles([...selectedVehicles, vehicleId]);
//     } else {
//       setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
//     }
//   };

//   const verifyVehicles = async () => {
//     // Check both tab-level and page-level permission
//     const hasPermission = canVerifyInPendingTab || canVerifyStock;
    
//     if (!hasPermission) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     if (selectedVehicles.length === 0) {
//       showError('Please select at least one vehicle to verify');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify them!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: selectedVehicles
//       });

//       showSuccess('Vehicles verified successfully!');
//       setSelectedVehicles([]);
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicles:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleVerifySingle = async (vehicleId) => {
//     // Check both tab-level and page-level permission
//     const hasPermission = canVerifyInPendingTab || canVerifyStock;
    
//     if (!hasPermission) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Confirm Verification',
//       html: `Are you sure you want to verify this vehicle?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify it!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: [vehicleId]
//       });

//       showSuccess('Vehicle verified successfully!');
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicle:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('inward'));
//     else handleApprovedFilter('', getDefaultSearchFields('inward'));
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the PENDING VERIFICATION tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {(canVerifyInPendingTab || canVerifyStock) && (
//                 <CTableHeaderCell scope="col">
//                   Select
//                 </CTableHeaderCell>
//               )}
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//               {(canVerifyInPendingTab || canVerifyStock) && (
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={(canVerifyInPendingTab || canVerifyStock) ? "8" : "7"} 
//                   style={{ color: 'red', textAlign: 'center' }}
//                 >
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   {(canVerifyInPendingTab || canVerifyStock) && (
//                     <CTableDataCell>
//                       <CFormCheck
//                         checked={selectedVehicles.includes(vehicle._id)}
//                         onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
//                       />
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                   {(canVerifyInPendingTab || canVerifyStock) && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifySingle(vehicle._id)} 
//                         disabled={isVerifying}
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         {isVerifying ? 'Verifying...' : 'Verify'}
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the VERIFIED STOCK tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="6" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in Stock Verification.
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
//       <div className='title'>Inward Stock Verification</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {activeTab === 0 && (canVerifyInPendingTab || canVerifyStock) && selectedVehicles.length > 0 && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={verifyVehicles} 
//                 disabled={isVerifying}
//               >
//                 <CIcon icon={cilCheckCircle} className='icon'/>
//                 {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
//               </CButton>
//             )}
            
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       PENDING VERIFICATION
//                       {!(canVerifyInPendingTab || canVerifyStock) && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       VERIFIED STOCK
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('inward'));
//                     }}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderVerifiedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Stock Verification.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default StockVerification;









// import React, { useState, useEffect } from 'react';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CFormCheck,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import Swal from 'sweetalert2';
// import { 
//   hasSafePagePermission, 
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage 
// } from '../../utils/modulePermissions';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle, cilZoomOut } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';

// function StockVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions = [] } = useAuth();
  
//   // Get user data from localStorage
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = localStorage.getItem('userRole') || 
//                    (storedUser.roles?.[0]?.name || '').toUpperCase();

//   // Check if user is SUPERADMIN
//   const isSuperAdmin = userRole === 'SUPERADMIN' || 
//                        (storedUser.roles?.[0]?.isSuperAdmin === true);

//   // Tab-level VIEW permission checks
//   const canViewPendingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );
  
//   const canViewVerifiedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.VERIFIED_STOCK
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingTab || canViewVerifiedTab;

//   // Tab-level CREATE permission checks (for actions on tabs)
//   const canVerifyInPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.PURCHASE,
//     PAGES.PURCHASE.STOCK_VERIFICATION,
//     ACTIONS.CREATE,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );

//   // For backward compatibility - check if user has any CREATE permission on the page
//   const canVerifyStock = canCreateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION
//   ) || canVerifyInPendingTab;

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingTab) visibleTabs.push(0);
//     if (canViewVerifiedTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingTab, canViewVerifiedTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Stock Verification tabs');
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, []);

//   const fetchData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       setLoading(true);
//       let url = '/vehicles/status/not_approved';
      
//       // Apply branch filter for non-super admins
//       if (!isSuperAdmin && branchId) {
//         url += `?location=${branchId}`;
//       }
      
//       const res = await axiosInstance.get(url);
//       let vehicles = res.data?.data?.vehicles || [];
      
//       // Additional client-side filtering for non-super admins
//       if (!isSuperAdmin && branchId) {
//         vehicles = vehicles.filter(vehicle => 
//           vehicle.unloadLocation?._id === branchId || 
//           vehicle.unloadLocation === branchId ||
//           vehicle.subdealerLocation?._id === branchId ||
//           vehicle.subdealerLocation === branchId
//         );
//       }
      
//       setPendingData(vehicles);
//       setFilteredPendings(vehicles);
//     } catch (err) {
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       let url = '/vehicles/status/in_stock';
      
//       // Apply branch filter for non-super admins
//       if (!isSuperAdmin && branchId) {
//         url += `?location=${branchId}`;
//       }
      
//       const res = await axiosInstance.get(url);
//       let vehicles = res.data?.data?.vehicles || [];
      
//       // Additional client-side filtering for non-super admins
//       if (!isSuperAdmin && branchId) {
//         vehicles = vehicles.filter(vehicle => 
//           vehicle.unloadLocation?._id === branchId || 
//           vehicle.unloadLocation === branchId ||
//           vehicle.subdealerLocation?._id === branchId ||
//           vehicle.subdealerLocation === branchId
//         );
//       }
      
//       setApprovedData(vehicles);
//       setFilteredApproved(vehicles);
//     } catch (err) {
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleSelectVehicle = (vehicleId, isChecked) => {
//     if (!canVerifyStock) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }
    
//     if (isChecked) {
//       setSelectedVehicles([...selectedVehicles, vehicleId]);
//     } else {
//       setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
//     }
//   };

//   const verifyVehicles = async () => {
//     // Check both tab-level and page-level permission
//     const hasPermission = canVerifyInPendingTab || canVerifyStock;
    
//     if (!hasPermission) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     if (selectedVehicles.length === 0) {
//       showError('Please select at least one vehicle to verify');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify them!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: selectedVehicles
//       });

//       showSuccess('Vehicles verified successfully!');
//       setSelectedVehicles([]);
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicles:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleVerifySingle = async (vehicleId) => {
//     // Check both tab-level and page-level permission
//     const hasPermission = canVerifyInPendingTab || canVerifyStock;
    
//     if (!hasPermission) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Confirm Verification',
//       html: `Are you sure you want to verify this vehicle?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify it!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: [vehicleId]
//       });

//       showSuccess('Vehicle verified successfully!');
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicle:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('inward'));
//     else handleApprovedFilter('', getDefaultSearchFields('inward'));
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the PENDING VERIFICATION tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {(canVerifyInPendingTab || canVerifyStock) && (
//                 <CTableHeaderCell scope="col">
//                   Select
//                 </CTableHeaderCell>
//               )}
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//               {(canVerifyInPendingTab || canVerifyStock) && (
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={(canVerifyInPendingTab || canVerifyStock) ? "8" : "7"} 
//                   style={{ color: 'red', textAlign: 'center' }}
//                 >
//                   No pending verification data available for your branch
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   {(canVerifyInPendingTab || canVerifyStock) && (
//                     <CTableDataCell>
//                       <CFormCheck
//                         checked={selectedVehicles.includes(vehicle._id)}
//                         onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
//                       />
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                   {(canVerifyInPendingTab || canVerifyStock) && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifySingle(vehicle._id)} 
//                         disabled={isVerifying}
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         {isVerifying ? 'Verifying...' : 'Verify'}
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the VERIFIED STOCK tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="6" style={{ color: 'red', textAlign: 'center' }}>
//                   No verified stock data available for your branch
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in Stock Verification.
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
//       <div className='title'>Inward Stock Verification</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {activeTab === 0 && (canVerifyInPendingTab || canVerifyStock) && selectedVehicles.length > 0 && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={verifyVehicles} 
//                 disabled={isVerifying}
//               >
//                 <CIcon icon={cilCheckCircle} className='icon'/>
//                 {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
//               </CButton>
//             )}
            
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
          
          
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       PENDING VERIFICATION
//                       {!(canVerifyInPendingTab || canVerifyStock) && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       VERIFIED STOCK
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('inward'));
//                     }}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderVerifiedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Stock Verification.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default StockVerification;








// import React, { useState, useEffect } from 'react';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CFormCheck,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import Swal from 'sweetalert2';
// import { 
//   hasSafePagePermission, 
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage 
// } from '../../utils/modulePermissions';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle, cilZoomOut } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';

// function StockVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions = [] } = useAuth();
  
//   // Get user data from localStorage
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const userRole = localStorage.getItem('userRole') || 
//                    (storedUser.roles?.[0]?.name || '').toUpperCase();

//   // Check if user is SUPERADMIN
//   const isSuperAdmin = userRole === 'SUPERADMIN' || 
//                        (storedUser.roles?.[0]?.isSuperAdmin === true);

//   // Tab-level VIEW permission checks
//   const canViewPendingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );
  
//   const canViewVerifiedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.VERIFIED_STOCK
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingTab || canViewVerifiedTab;

//   // Tab-level CREATE permission checks (for actions on tabs)
//   const canVerifyInPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.PURCHASE,
//     PAGES.PURCHASE.STOCK_VERIFICATION,
//     ACTIONS.CREATE,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );

//   // For backward compatibility - check if user has any CREATE permission on the page
//   const canVerifyStock = canCreateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION
//   ) || canVerifyInPendingTab;

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingTab) visibleTabs.push(0);
//     if (canViewVerifiedTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingTab, canViewVerifiedTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Stock Verification tabs');
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, []);

//   const fetchData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       setLoading(true);
//       let url = '/vehicles/status/not_approved';
      
//       // REMOVED: Branch filter for non-super admins
//       // All users can see all data regardless of role
      
//       const res = await axiosInstance.get(url);
//       let vehicles = res.data?.data?.vehicles || [];
      
//       // REMOVED: Client-side filtering for non-super admins
//       // All vehicles are shown to all users
      
//       setPendingData(vehicles);
//       setFilteredPendings(vehicles);
//     } catch (err) {
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       let url = '/vehicles/status/in_stock';
      
//       // REMOVED: Branch filter for non-super admins
//       // All users can see all data regardless of role
      
//       const res = await axiosInstance.get(url);
//       let vehicles = res.data?.data?.vehicles || [];
      
//       // REMOVED: Client-side filtering for non-super admins
//       // All vehicles are shown to all users
      
//       setApprovedData(vehicles);
//       setFilteredApproved(vehicles);
//     } catch (err) {
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleSelectVehicle = (vehicleId, isChecked) => {
//     if (!canVerifyStock) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }
    
//     if (isChecked) {
//       setSelectedVehicles([...selectedVehicles, vehicleId]);
//     } else {
//       setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
//     }
//   };

//   const verifyVehicles = async () => {
//     // Check both tab-level and page-level permission
//     const hasPermission = canVerifyInPendingTab || canVerifyStock;
    
//     if (!hasPermission) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     if (selectedVehicles.length === 0) {
//       showError('Please select at least one vehicle to verify');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify them!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: selectedVehicles
//       });

//       showSuccess('Vehicles verified successfully!');
//       setSelectedVehicles([]);
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicles:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleVerifySingle = async (vehicleId) => {
//     // Check both tab-level and page-level permission
//     const hasPermission = canVerifyInPendingTab || canVerifyStock;
    
//     if (!hasPermission) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Confirm Verification',
//       html: `Are you sure you want to verify this vehicle?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify it!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: [vehicleId]
//       });

//       showSuccess('Vehicle verified successfully!');
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicle:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('inward'));
//     else handleApprovedFilter('', getDefaultSearchFields('inward'));
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the PENDING VERIFICATION tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {(canVerifyInPendingTab || canVerifyStock) && (
//                 <CTableHeaderCell scope="col">
//                   Select
//                 </CTableHeaderCell>
//               )}
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//               {(canVerifyInPendingTab || canVerifyStock) && (
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               )}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={(canVerifyInPendingTab || canVerifyStock) ? "8" : "7"} 
//                   style={{ color: 'red', textAlign: 'center' }}
//                 >
//                   No pending verification data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   {(canVerifyInPendingTab || canVerifyStock) && (
//                     <CTableDataCell>
//                       <CFormCheck
//                         checked={selectedVehicles.includes(vehicle._id)}
//                         onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
//                       />
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                   {(canVerifyInPendingTab || canVerifyStock) && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifySingle(vehicle._id)} 
//                         disabled={isVerifying}
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         {isVerifying ? 'Verifying...' : 'Verify'}
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the VERIFIED STOCK tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="6" style={{ color: 'red', textAlign: 'center' }}>
//                   No verified stock data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in Stock Verification.
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
//       <div className='title'>Inward Stock Verification</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {activeTab === 0 && (canVerifyInPendingTab || canVerifyStock) && selectedVehicles.length > 0 && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={verifyVehicles} 
//                 disabled={isVerifying}
//               >
//                 <CIcon icon={cilCheckCircle} className='icon'/>
//                 {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
//               </CButton>
//             )}
            
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
          
          
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       PENDING VERIFICATION
//                       {!(canVerifyInPendingTab || canVerifyStock) && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       VERIFIED STOCK
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('inward'));
//                     }}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderVerifiedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Stock Verification.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default StockVerification;








// import React, { useState, useEffect } from 'react';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CFormCheck,
//   CAlert,
//   CBadge
// } from '@coreui/react';
// import { 
//   axiosInstance, 
//   getDefaultSearchFields, 
//   showError, 
//   showSuccess, 
//   useTableFilter,
//   Menu,
//   MenuItem
// } from '../../utils/tableImports';
// import '../../css/invoice.css';
// import '../../css/table.css';
// import Swal from 'sweetalert2';
// import { 
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS,
//   hasSafePagePermission
// } from '../../utils/modulePermissions';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle, cilZoomOut, cilSettings, cilPencil } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// function StockVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // New states for options menu
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
  
//   const { permissions = [] } = useAuth();
//   const navigate = useNavigate();
  
//   // Get user data from localStorage
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const userRole = localStorage.getItem('userRole') || 
//                    (storedUser.roles?.[0]?.name || '').toUpperCase();

//   // Check if user is SUPERADMIN
//   const isSuperAdmin = userRole === 'SUPERADMIN' || 
//                        (storedUser.roles?.[0]?.isSuperAdmin === true);

//   // Tab-level VIEW permission checks
//   const canViewPendingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );
  
//   const canViewVerifiedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.STOCK_VERIFICATION.VERIFIED_STOCK
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingTab || canViewVerifiedTab;

//   // Tab-level CREATE permission checks (for actions on tabs)
//   const canVerifyInPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.PURCHASE,
//     PAGES.PURCHASE.STOCK_VERIFICATION,
//     ACTIONS.CREATE,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );

//   // Check if user can update in PENDING VERIFICATION tab
//   const canUpdateInPendingTab = hasSafePagePermission(
//     permissions,
//     MODULES.PURCHASE,
//     PAGES.PURCHASE.STOCK_VERIFICATION,
//     ACTIONS.UPDATE,
//     TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
//   );

//   // Final permission check: ONLY tab-level CREATE permission
//   const canVerify = canVerifyInPendingTab;

//   // Determine if verification button should be shown
//   const shouldShowVerifyButton = canVerify;

//   // Check if user can edit in pending tab
//   const canEditInPendingTab = canUpdateInPendingTab;

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingTab) visibleTabs.push(0);
//     if (canViewVerifiedTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingTab, canViewVerifiedTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);

//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Stock Verification tabs');
//       return;
//     }
    
//     fetchData();
//     fetchLocationData();
//   }, []);

//   const fetchData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       setLoading(true);
//       let url = '/vehicles/status/not_approved';
      
//       const res = await axiosInstance.get(url);
//       let vehicles = res.data?.data?.vehicles || [];
      
//       setPendingData(vehicles);
//       setFilteredPendings(vehicles);
//     } catch (err) {
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     if (!canViewAnyTab) return;
    
//     try {
//       let url = '/vehicles/status/in_stock';
      
//       const res = await axiosInstance.get(url);
//       let vehicles = res.data?.data?.vehicles || [];
      
//       setApprovedData(vehicles);
//       setFilteredApproved(vehicles);
//     } catch (err) {
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleSelectVehicle = (vehicleId, isChecked) => {
//     if (!canVerify) {
//       showError('You do not have permission to verify vehicles');
//       return;
//     }
    
//     if (isChecked) {
//       setSelectedVehicles([...selectedVehicles, vehicleId]);
//     } else {
//       setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
//     }
//   };

//   // Options menu handlers
//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const verifyVehicles = async () => {
//     if (!canVerify) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     if (selectedVehicles.length === 0) {
//       showError('Please select at least one vehicle to verify');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify them!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: selectedVehicles
//       });

//       showSuccess('Vehicles verified successfully!');
//       setSelectedVehicles([]);
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicles:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleVerifySingle = async (vehicleId) => {
//     if (!canVerify) {
//       showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
//       return;
//     }

//     const result = await Swal.fire({
//       title: 'Confirm Verification',
//       html: `Are you sure you want to verify this vehicle?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, verify it!'
//     });

//     if (!result.isConfirmed) return;

//     setIsVerifying(true);
//     try {
//       await axiosInstance.post('/vehicles/approve', {
//         vehicleIds: [vehicleId]
//       });

//       showSuccess('Vehicle verified successfully!');
//       fetchData();
//       fetchLocationData();
//     } catch (error) {
//       console.error('Error verifying vehicle:', error);
//       showError(error);
//     } finally {
//       setIsVerifying(false);
//       handleClose();
//     }
//   };

//   // Function to handle edit click - ALWAYS redirects back to stock verification
//   const handleEditClick = (vehicleId) => {
//     if (!canEditInPendingTab) {
//       showError('You do not have permission to edit vehicles in PENDING VERIFICATION tab');
//       return;
//     }
    
//     // ALWAYS pass returnUrl as stock-verification so after edit we come back here
//     navigate(`/update-inward/${vehicleId}`, {
//       state: { returnUrl: '/stock-verification' }
//     });
//     handleClose();
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('inward'));
//     else handleApprovedFilter('', getDefaultSearchFields('inward'));
//   };

//   const renderPendingTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPendingTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the PENDING VERIFICATION tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {shouldShowVerifyButton && (
//                 <CTableHeaderCell scope="col">
//                   Select
//                 </CTableHeaderCell>
//               )}
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell 
//                   colSpan={shouldShowVerifyButton ? "9" : "8"} 
//                   style={{ color: 'red', textAlign: 'center' }}
//                 >
//                   No pending verification data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   {shouldShowVerifyButton && (
//                     <CTableDataCell>
//                       <CFormCheck
//                         checked={selectedVehicles.includes(vehicle._id)}
//                         onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
//                       />
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="warning">
//                       Pending
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={(event) => handleClick(event, vehicle._id)}
//                       disabled={!canVerify && !canEditInPendingTab}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     <Menu 
//                       id={`action-menu-${vehicle._id}`} 
//                       anchorEl={anchorEl} 
//                       open={menuId === vehicle._id} 
//                       onClose={handleClose}
//                     >
//                       {canVerify && (
//                         <MenuItem onClick={() => handleVerifySingle(vehicle._id)}>
//                           <CIcon icon={cilCheckCircle} className="me-2" />Verify
//                         </MenuItem>
//                       )}
                      
//                       {canEditInPendingTab && (
//                         <MenuItem onClick={() => handleEditClick(vehicle._id)}>
//                           <CIcon icon={cilPencil} className="me-2" />Edit
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedTable = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the VERIFIED STOCK tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                   No verified stock data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((vehicle, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{vehicle.type}</CTableDataCell>
//                   <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="success">
//                       Verified
//                     </CBadge>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in Stock Verification.
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
//       <div className='title'>Inward Stock Verification</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {activeTab === 0 && shouldShowVerifyButton && selectedVehicles.length > 0 && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={verifyVehicles} 
//                 disabled={isVerifying}
//               >
//                 <CIcon icon={cilCheckCircle} className='icon'/>
//                 {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
//               </CButton>
//             )}
            
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       PENDING VERIFICATION
//                       {!shouldShowVerifyButton && canViewPendingTab && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                       {!canViewPendingTab && (
//                         <span className="ms-1 text-muted small">(No View)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       VERIFIED STOCK
//                       {!canViewVerifiedTab && (
//                         <span className="ms-1 text-muted small">(No View)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
//                       else handleApprovedFilter(e.target.value, getDefaultSearchFields('inward'));
//                     }}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewVerifiedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderVerifiedTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Stock Verification.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default StockVerification;



import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
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
  CFormLabel,
  CFormCheck,
  CAlert,
  CBadge,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import { 
  axiosInstance, 
  getDefaultSearchFields, 
  showError, 
  showSuccess, 
  useTableFilter,
  Menu,
  MenuItem
} from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import Swal from 'sweetalert2';
import { 
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  hasSafePagePermission
} from '../../utils/modulePermissions';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilZoomOut, cilSettings, cilPencil, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Pagination constants
const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT = 25;

function StockVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifiedLoading, setVerifiedLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New states for options menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Debounce timer ref for search
  const searchTimer = useRef(null);
  
  // Ref for search input to prevent focus loss
  const searchInputRef = useRef(null);
  
  // Verified tab pagination state
  const [verifiedData, setVerifiedData] = useState({
    docs: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    search: ''
  });
  
  const { permissions = [] } = useAuth();
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('userRole') || 
                   (storedUser.roles?.[0]?.name || '').toUpperCase();

  // Check if user is SUPERADMIN
  const isSuperAdmin = userRole === 'SUPERADMIN' || 
                       (storedUser.roles?.[0]?.isSuperAdmin === true);

  // Tab-level VIEW permission checks
  const canViewPendingTab = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.STOCK_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
  );
  
  const canViewVerifiedTab = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.STOCK_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.STOCK_VERIFICATION.VERIFIED_STOCK
  );
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPendingTab || canViewVerifiedTab;

  // Tab-level CREATE permission checks (for actions on tabs)
  const canVerifyInPendingTab = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.STOCK_VERIFICATION,
    ACTIONS.CREATE,
    TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
  );

  // Check if user can update in PENDING VERIFICATION tab
  const canUpdateInPendingTab = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.STOCK_VERIFICATION,
    ACTIONS.UPDATE,
    TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
  );

  // Final permission check: ONLY tab-level CREATE permission
  const canVerify = canVerifyInPendingTab;

  // Determine if verification button should be shown
  const shouldShowVerifyButton = canVerify;

  // Check if user can edit in pending tab
  const canEditInPendingTab = canUpdateInPendingTab;

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);

  // Adjust activeTab based on tab-level permissions
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewPendingTab) visibleTabs.push(0);
    if (canViewVerifiedTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingTab, canViewVerifiedTab, activeTab]);

  useEffect(() => {
    // Check permission before loading data
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Stock Verification tabs');
      return;
    }
    
    fetchPendingData();
    if (canViewVerifiedTab) {
      fetchVerifiedData(1, verifiedData.limit, '');
    }
  }, []);

  // Fetch pending data (unchanged)
  const fetchPendingData = async () => {
    if (!canViewPendingTab) return;
    
    try {
      setLoading(true);
      let url = '/vehicles/status/not_approved';
      
      const res = await axiosInstance.get(url);
      let vehicles = res.data?.data?.vehicles || [];
      
      setPendingData(vehicles);
      setFilteredPendings(vehicles);
    } catch (err) {
      const message = showError(err);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch verified data with server-side pagination and search
  const fetchVerifiedData = async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewVerifiedTab) return;
    
    try {
      setVerifiedLoading(true);
      
      // Build query parameters
      const params = {
        page,
        limit,
        status: 'in_stock'
      };
      
      // Add search parameter if provided
      const trimmedSearch = search ? search.trim() : '';
      if (trimmedSearch) {
        params.search = trimmedSearch;
        // Specify which fields to search on (adjust based on your API capabilities)
        params.searchFields = 'chassisNumber,modelName,color.name,unloadLocation.name';
      }
      
      const res = await axiosInstance.get('/vehicles/status/in_stock', { params });
      
      // Update verified data state based on API response structure
      setVerifiedData({
        docs: res.data?.data?.vehicles || [],
        total: res.data?.total || 0,
        totalPages: res.data?.totalPages || 1,
        currentPage: res.data?.currentPage || page,
        limit: limit,
        search: search
      });
      
    } catch (err) {
      const message = showError(err);
      if (message) {
        setError(message);
      }
    } finally {
      setVerifiedLoading(false);
    }
  };

  // Debounced search handler for verified tab
  const handleVerifiedSearch = useCallback((value) => {
    // Update local search term for display
    setSearchTerm(value);
    
    // Clear previous timer
    clearTimeout(searchTimer.current);
    
    // Set new timer for debouncing
    searchTimer.current = setTimeout(() => {
      fetchVerifiedData(1, verifiedData.limit, value);
    }, 500);
  }, [verifiedData.limit]);

  // Handle page change for verified tab
  const handleVerifiedPageChange = (newPage) => {
    if (newPage < 1 || newPage > verifiedData.totalPages || verifiedLoading) return;
    
    fetchVerifiedData(newPage, verifiedData.limit, verifiedData.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change for verified tab
  const handleVerifiedLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchVerifiedData(1, limit, verifiedData.search);
  };

  // Reset search for verified tab
  const handleVerifiedResetSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    fetchVerifiedData(1, verifiedData.limit, '');
  };

  const handleSelectVehicle = (vehicleId, isChecked) => {
    if (!canVerify) {
      showError('You do not have permission to verify vehicles');
      return;
    }
    
    if (isChecked) {
      setSelectedVehicles([...selectedVehicles, vehicleId]);
    } else {
      setSelectedVehicles(selectedVehicles.filter((id) => id !== vehicleId));
    }
  };

  // Options menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const verifyVehicles = async () => {
    if (!canVerify) {
      showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
      return;
    }

    if (selectedVehicles.length === 0) {
      showError('Please select at least one vehicle to verify');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to verify ${selectedVehicles.length} vehicle(s). This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify them!'
    });

    if (!result.isConfirmed) return;

    setIsVerifying(true);
    try {
      await axiosInstance.post('/vehicles/approve', {
        vehicleIds: selectedVehicles
      });

      showSuccess('Vehicles verified successfully!');
      setSelectedVehicles([]);
      
      // Refresh both tabs
      fetchPendingData();
      if (canViewVerifiedTab) {
        fetchVerifiedData(1, verifiedData.limit, '');
      }
    } catch (error) {
      console.error('Error verifying vehicles:', error);
      showError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifySingle = async (vehicleId) => {
    if (!canVerify) {
      showError('You do not have permission to verify vehicles in PENDING VERIFICATION tab');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Verification',
      html: `Are you sure you want to verify this vehicle?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify it!'
    });

    if (!result.isConfirmed) return;

    setIsVerifying(true);
    try {
      await axiosInstance.post('/vehicles/approve', {
        vehicleIds: [vehicleId]
      });

      showSuccess('Vehicle verified successfully!');
      
      // Refresh both tabs
      fetchPendingData();
      if (canViewVerifiedTab) {
        fetchVerifiedData(1, verifiedData.limit, '');
      }
    } catch (error) {
      console.error('Error verifying vehicle:', error);
      showError(error);
    } finally {
      setIsVerifying(false);
      handleClose();
    }
  };

  // Function to handle edit click - ALWAYS redirects back to stock verification
  const handleEditClick = (vehicleId) => {
    if (!canEditInPendingTab) {
      showError('You do not have permission to edit vehicles in PENDING VERIFICATION tab');
      return;
    }
    
    // ALWAYS pass returnUrl as stock-verification so after edit we come back here
    navigate(`/update-inward/${vehicleId}`, {
      state: { returnUrl: '/stock-verification' }
    });
    handleClose();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    
    // Clear search input value
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    
    // If switching to verified tab, refresh data with current pagination but clear search
    if (tab === 1 && canViewVerifiedTab) {
      fetchVerifiedData(1, verifiedData.limit, '');
    }
  };

  const handleResetSearch = () => {
    if (activeTab === 0) {
      setSearchTerm('');
      handlePendingFilter('', getDefaultSearchFields('inward'));
    } else {
      handleVerifiedResetSearch();
    }
  };

  // Render pagination for verified tab
  const renderVerifiedPagination = () => {
    const { currentPage, totalPages, total, limit, search } = verifiedData;
    
    if (total === 0) return null;
    
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);
    
    // Calculate page numbers to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }
    
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
              Rows per page:
            </CFormLabel>
            <CFormSelect
              value={limit}
              onChange={(e) => handleVerifiedLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={verifiedLoading}
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {verifiedLoading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
            {search && <span> (filtered)</span>}
          </span>
        </div>
        
        {totalPages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem
              onClick={() => handleVerifiedPageChange(1)}
              disabled={currentPage === 1 || verifiedLoading}
            >
              «
            </CPaginationItem>
            <CPaginationItem
              onClick={() => handleVerifiedPageChange(currentPage - 1)}
              disabled={currentPage === 1 || verifiedLoading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem
                  onClick={() => handleVerifiedPageChange(1)}
                  disabled={verifiedLoading}
                >
                  1
                </CPaginationItem>
                {startPage > 2 && (
                  <CPaginationItem disabled>…</CPaginationItem>
                )}
              </>
            )}
            
            {pageNumbers.map(page => (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={() => handleVerifiedPageChange(page)}
                disabled={verifiedLoading}
              >
                {page}
              </CPaginationItem>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <CPaginationItem disabled>…</CPaginationItem>
                )}
                <CPaginationItem
                  onClick={() => handleVerifiedPageChange(totalPages)}
                  disabled={verifiedLoading}
                >
                  {totalPages}
                </CPaginationItem>
              </>
            )}
            
            <CPaginationItem
              onClick={() => handleVerifiedPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || verifiedLoading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem
              onClick={() => handleVerifiedPageChange(totalPages)}
              disabled={currentPage === totalPages || verifiedLoading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewPendingTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the PENDING VERIFICATION tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              {shouldShowVerifyButton && (
                <CTableHeaderCell scope="col">
                  Select
                </CTableHeaderCell>
              )}
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Type</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Color</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell 
                  colSpan={shouldShowVerifyButton ? "9" : "8"} 
                  style={{ color: 'red', textAlign: 'center' }}
                >
                  No pending verification data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((vehicle, index) => (
                <CTableRow key={index}>
                  {shouldShowVerifyButton && (
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedVehicles.includes(vehicle._id)}
                        onChange={(e) => handleSelectVehicle(vehicle._id, e.target.checked)}
                      />
                    </CTableDataCell>
                  )}
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{vehicle.type}</CTableDataCell>
                  <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                  <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
                  <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                  <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="warning">
                      Pending
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      className='option-button btn-sm'
                      onClick={(event) => handleClick(event, vehicle._id)}
                      disabled={!canVerify && !canEditInPendingTab}
                    >
                      <CIcon icon={cilSettings} />
                      Options
                    </CButton>
                    <Menu 
                      id={`action-menu-${vehicle._id}`} 
                      anchorEl={anchorEl} 
                      open={menuId === vehicle._id} 
                      onClose={handleClose}
                    >
                      {canVerify && (
                        <MenuItem onClick={() => handleVerifySingle(vehicle._id)}>
                          <CIcon icon={cilCheckCircle} className="me-2" />Verify
                        </MenuItem>
                      )}
                      
                      {canEditInPendingTab && (
                        <MenuItem onClick={() => handleEditClick(vehicle._id)}>
                          <CIcon icon={cilPencil} className="me-2" />Edit
                        </MenuItem>
                      )}
                    </Menu>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderVerifiedTable = () => {
    // Check if user has permission to view this tab
    if (!canViewVerifiedTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the VERIFIED STOCK tab.
          </CAlert>
        </div>
      );
    }

    const { docs, search } = verifiedData;

    return (
      <>
        {verifiedLoading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: verifiedLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {docs.length === 0 && !verifiedLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No verified stock data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                docs.map((vehicle, index) => (
                  <CTableRow key={vehicle._id || index}>
                    <CTableDataCell>{(verifiedData.currentPage - 1) * verifiedData.limit + index + 1}</CTableDataCell>
                    <CTableDataCell>{vehicle.type}</CTableDataCell>
                    <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                    <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
                    <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                    <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">
                        Verified
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderVerifiedPagination()}
      </>
    );
  };

  if (loading && activeTab === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any tabs in Stock Verification.
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
      <div className='title'>Inward Stock Verification</div>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {activeTab === 0 && shouldShowVerifyButton && selectedVehicles.length > 0 && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={verifyVehicles} 
                disabled={isVerifying}
              >
                <CIcon icon={cilCheckCircle} className='icon'/>
                {isVerifying ? 'Verifying...' : `Verify Selected (${selectedVehicles.length})`}
              </CButton>
            )}
            
            {searchTerm && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                <CIcon icon={cilZoomOut} className='icon' /> Reset Search
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewPendingTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 0}
                      onClick={() => handleTabChange(0)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                        color: 'black',
                        borderBottom: 'none'
                      }}
                    >
                      PENDING VERIFICATION
                      {!shouldShowVerifyButton && canViewPendingTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewVerifiedTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 1}
                      onClick={() => handleTabChange(1)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      VERIFIED STOCK
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <input
                    ref={searchInputRef}
                    type="text"
                    style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
                    className="d-inline-block square-search"
                    defaultValue=""
                    onChange={(e) => {
                      if (activeTab === 0) {
                        setSearchTerm(e.target.value);
                        handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
                      } else {
                        handleVerifiedSearch(e.target.value);
                      }
                    }}
                    placeholder={activeTab === 0 ? "Search..." : "Search by Chassis, Model, Color, Location..."}
                    autoComplete="off"
                  />
                </div>
              </div>

              <CTabContent>
                {canViewPendingTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewVerifiedTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderVerifiedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in Stock Verification.
            </CAlert>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default StockVerification;