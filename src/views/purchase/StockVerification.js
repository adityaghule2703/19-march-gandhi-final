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








import React, { useState, useEffect } from 'react';
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
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, showSuccess, useTableFilter } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import Swal from 'sweetalert2';
import { 
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  hasSafePagePermission,
  canCreateInPage
} from '../../utils/modulePermissions';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilZoomOut } from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';

function StockVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions = [] } = useAuth();
  
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

  // Check if user can delete in PENDING VERIFICATION tab
  const canDeleteInPendingTab = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.STOCK_VERIFICATION,
    ACTIONS.DELETE,
    TABS.STOCK_VERIFICATION.PENDING_VERIFICATION
  );

  // Check specific actions for VERIFIED STOCK tab
  const canCreateInVerifiedTab = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.STOCK_VERIFICATION,
    ACTIONS.CREATE,
    TABS.STOCK_VERIFICATION.VERIFIED_STOCK
  );

  const canUpdateInVerifiedTab = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.STOCK_VERIFICATION,
    ACTIONS.UPDATE,
    TABS.STOCK_VERIFICATION.VERIFIED_STOCK
  );

  const canDeleteInVerifiedTab = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.STOCK_VERIFICATION,
    ACTIONS.DELETE,
    TABS.STOCK_VERIFICATION.VERIFIED_STOCK
  );

  // Only check page-level CREATE permission if we don't want it to be a fallback
  // Remove this line if you don't want page-level fallback
  // const canVerifyStock = canCreateInPage(
  //   permissions, 
  //   MODULES.PURCHASE, 
  //   PAGES.PURCHASE.STOCK_VERIFICATION
  // );

  // Final permission check: ONLY tab-level CREATE permission
  const canVerify = canVerifyInPendingTab; // NOT using page-level fallback

  // Determine if verification button should be shown
  const shouldShowVerifyButton = canVerify;

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

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);

  const {
    data: approvedData,
    setData: setApprovedData,
    filteredData: filteredApproved,
    setFilteredData: setFilteredApproved,
    handleFilter: handleApprovedFilter
  } = useTableFilter([]);

  useEffect(() => {
    // Check permission before loading data
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Stock Verification tabs');
      return;
    }
    
    fetchData();
    fetchLocationData();
  }, []);

  const fetchData = async () => {
    if (!canViewAnyTab) return;
    
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

  const fetchLocationData = async () => {
    if (!canViewAnyTab) return;
    
    try {
      let url = '/vehicles/status/in_stock';
      
      const res = await axiosInstance.get(url);
      let vehicles = res.data?.data?.vehicles || [];
      
      setApprovedData(vehicles);
      setFilteredApproved(vehicles);
    } catch (err) {
      const message = showError(err);
      if (message) {
        setError(message);
      }
    }
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
      fetchData();
      fetchLocationData();
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
      fetchData();
      fetchLocationData();
    } catch (error) {
      console.error('Error verifying vehicle:', error);
      showError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('inward'));
    else handleApprovedFilter('', getDefaultSearchFields('inward'));
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
              {shouldShowVerifyButton && (
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell 
                  colSpan={shouldShowVerifyButton ? "8" : "7"} 
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
                  {shouldShowVerifyButton && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleVerifySingle(vehicle._id)} 
                        disabled={isVerifying}
                      >
                        <CIcon icon={cilCheckCircle} className="me-1" />
                        {isVerifying ? 'Verifying...' : 'Verify'}
                      </CButton>
                    </CTableDataCell>
                  )}
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

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Type</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Color</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Load Location</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredApproved.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="6" style={{ color: 'red', textAlign: 'center' }}>
                  No verified stock data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredApproved.map((vehicle, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{vehicle.type}</CTableDataCell>
                  <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                  <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
                  <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                  <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (loading) {
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
                      {!canViewPendingTab && (
                        <span className="ms-1 text-muted small">(No View)</span>
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
                      {!canViewVerifiedTab && (
                        <span className="ms-1 text-muted small">(No View)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('inward'));
                      else handleApprovedFilter(e.target.value, getDefaultSearchFields('inward'));
                    }}
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