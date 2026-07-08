// import React, { useState, useEffect } from 'react';
// import { 
//   CBadge, 
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
//   CAlert,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../../utils/tableImports';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import AddInsurance from './AddInsurance';
// import ViewInsuranceModal from './ViewInsurance';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilZoom, cilPencil } from '@coreui/icons';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { enIN } from 'date-fns/locale';
// import TextField from '@mui/material/TextField';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../../utils/modulePermissions';
// import { useAuth } from '../../../context/AuthContext';

// function InsuranceReport() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedInsurance, setSelectedInsurance] = useState(null);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [exportError, setExportError] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);

//   const { permissions } = useAuth();
  
//   // Page-level VIEW permission check
//   const canViewInsuranceDetails = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW
//   );
  
//   // Tab-level VIEW permission checks
//   const canViewPendingInsuranceTab = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW,
//     TABS.INSURANCE_DETAILS.PENDING_INSURANCE
//   );
  
//   const canViewCompleteInsuranceTab = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW,
//     TABS.INSURANCE_DETAILS.COMPLETE_INSURANCE
//   );
  
//   const canViewUpdateLaterTab = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW,
//     TABS.INSURANCE_DETAILS.UPDATE_LATER
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingInsuranceTab || canViewCompleteInsuranceTab || canViewUpdateLaterTab;
  
//   // Tab-level CREATE permission for PENDING INSURANCE tab (for Add button)
//   const canCreatePendingInsurance = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.CREATE,
//     TABS.INSURANCE_DETAILS.PENDING_INSURANCE
//   );
  
//   // Tab-level CREATE permission for UPDATE LATER tab (for Update button)
//   const canCreateUpdateLater = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.CREATE,
//     TABS.INSURANCE_DETAILS.UPDATE_LATER
//   );

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingInsuranceTab) visibleTabs.push(0);
//     if (canViewCompleteInsuranceTab) visibleTabs.push(1);
//     if (canViewUpdateLaterTab) visibleTabs.push(2);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingInsuranceTab, canViewCompleteInsuranceTab, canViewUpdateLaterTab, activeTab]);

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: laterData,
//     setData: setLaterData,
//     filteredData: filteredLater,
//     setFilteredData: setFilteredLater,
//     handleFilter: handleLaterFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   useEffect(() => {
//     fetchBranches();
//   }, []);

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//     }
//   };

//   const fetchData = async () => {
//     if (!canViewInsuranceDetails) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings/insurance-status/AWAITING`);
//       setPendingData(response.data.data.docs);
//       setFilteredPendings(response.data.data.docs);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCompleteData = async () => {
//     if (!canViewInsuranceDetails) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/insurance/status/COMPLETED`);
//       setApprovedData(response.data.data);
//       setFilteredApproved(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchLaterData = async () => {
//     if (!canViewInsuranceDetails) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/insurance/status/LATER`);
//       setLaterData(response.data.data);
//       setFilteredLater(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!canViewInsuranceDetails) {
//       showError('You do not have permission to view Insurance Details');
//       return;
//     }
    
//     fetchData();
//     fetchCompleteData();
//     fetchLaterData();
//   }, [refreshKey, canViewInsuranceDetails]);

//   // Format date to DD-MM-YYYY for display
//   const formatDateDDMMYYYY = (date) => {
//     if (!date) return '';
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Format date to YYYY-MM-DD for API
//   const formatDateForAPI = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const handleExportToExcel = async () => {
//     // Check for add permission based on active tab
//     if (activeTab === 0 && !canCreatePendingInsurance) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for complete tab - anyone can export if they can view
//     if (activeTab === 1 && !canViewCompleteInsuranceTab) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for update later tab - need create permission
//     if (activeTab === 2 && !canCreateUpdateLater) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }

//     // Clear previous errors
//     setExportError('');
    
//     if (!selectedBranchId) {
//       setExportError('Please select a branch');
//       return;
//     }

//     if (!startDate || !endDate) {
//       setExportError('Please select both start and end dates');
//       return;
//     }

//     if (startDate > endDate) {
//       setExportError('Start date cannot be after end date');
//       return;
//     }

//     try {
//       setExportLoading(true);
      
//       const formattedStartDate = formatDateForAPI(startDate);
//       const formattedEndDate = formatDateForAPI(endDate);

//       // Determine API endpoint based on active tab
//       let apiEndpoint = '';
//       if (activeTab === 0) {
//         apiEndpoint = '/reports/insurance/pending'; // Pending Insurance
//       } else if (activeTab === 1) {
//         apiEndpoint = '/reports/insurance/complete'; // Complete Insurance
//       } else if (activeTab === 2) {
//         apiEndpoint = '/reports/insurance/later'; // Update Later
//       }

//       // Build query parameters
//       const params = new URLSearchParams({
//         branchId: selectedBranchId,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         format: 'excel'
//       });

//       const response = await axiosInstance.get(
//         `${apiEndpoint}?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       // Check content type to see if it's an error
//       const contentType = response.headers['content-type'];
      
//       if (contentType && contentType.includes('application/json')) {
//         // It's a JSON error response, parse it
//         const text = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsText(response.data);
//         });
        
//         const errorData = JSON.parse(text);
        
//         // Show the exact error message from API
//         if (!errorData.success && errorData.message) {
//           setExportError(errorData.message);
//           return;
//         }
//       }

//       // Handle Excel file download
//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Generate filename
//       const branchName = branches.find(b => b._id === selectedBranchId)?.name || 'Branch';
//       const startDateStr = formatDateDDMMYYYY(startDate);
//       const endDateStr = formatDateDDMMYYYY(endDate);
      
//       let tabName = '';
//       if (activeTab === 0) tabName = 'Pending_Insurance';
//       else if (activeTab === 1) tabName = 'Complete_Insurance';
//       else if (activeTab === 2) tabName = 'Update_Later';
      
//       const fileName = `${tabName}_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       window.URL.revokeObjectURL(url);
      
//       // Show success message
//       showError('Excel exported successfully!');
//       handleCloseExportModal();
      
//     } catch (error) {
//       console.error('Error exporting report:', error);
      
//       // For blob errors, we need to read the blob
//       if (error.response && error.response.data instanceof Blob) {
//         try {
//           const text = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsText(error.response.data);
//           });
          
//           const errorData = JSON.parse(text);
          
//           // Show the exact error message from API
//           if (errorData.message) {
//             setExportError(errorData.message);
//           }
//         } catch (parseError) {
//           console.error('Error parsing error response:', parseError);
//           setExportError('Failed to export report');
//         }
//       } else if (error.response?.data?.message) {
//         // Regular error with message in response
//         setExportError(error.response.data.message);
//       } else if (error.message) {
//         // Network or other errors
//         setExportError(error.message);
//       } else {
//         setExportError('Failed to export report');
//       }
      
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreatePendingInsurance) {
//       showError('You do not have permission to add insurance');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setSelectedInsurance(null);
//     setShowModal(true);
//   };

//   const handleViewClick = async (item) => {
//     try {
//       const response = await axiosInstance.get(`/insurance/${item.id}`);
//       setSelectedInsurance(response.data.data);
//       setShowViewModal(true);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleUpdateClick = async (item) => {
//     if (!canCreateUpdateLater) {
//       showError('You do not have permission to update insurance');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/insurance/${item.id}`);
//       setSelectedInsurance(response.data.data);
//       setSelectedBooking(response.data.data.booking);
//       setShowModal(true);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setSelectedInsurance(null);
//     setSelectedBooking(null);
//     handleRefresh();
//   };

//   const handleTabChange = (tab) => {
//     if (!canViewInsuranceDetails) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleOpenExportModal = () => {
//     // Check for add permission based on active tab
//     if (activeTab === 0 && !canCreatePendingInsurance) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for complete tab - anyone can export if they can view
//     if (activeTab === 1 && !canViewCompleteInsuranceTab) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for update later tab - need create permission
//     if (activeTab === 2 && !canCreateUpdateLater) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     setShowExportModal(true);
//     setExportError('');
//   };

//   const handleCloseExportModal = () => {
//     setShowExportModal(false);
//     setSelectedBranchId('');
//     setStartDate(null);
//     setEndDate(null);
//     setExportError('');
//   };

//   const renderPendingTable = () => {
//     if (!canViewPendingInsuranceTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Pending Insurance tab.
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
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
//               {canCreatePendingInsurance && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendings.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreatePendingInsurance ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendings.map((booking, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                   <CTableDataCell>{booking.modelDetails?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                   <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'danger' : 'success'} shape="rounded-pill">
//                       {booking.insuranceStatus}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canCreatePendingInsurance && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleAddClick(booking)}
//                       >
//                         <CIcon icon={cilPlus} className="me-1" />
//                         Add
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

//   const renderCompletedTable = () => {
//     if (!canViewCompleteInsuranceTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Complete Insurance tab.
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
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Insurance Provider</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredApproved.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredApproved.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                   <CTableDataCell>{item.insuranceProviderDetails?.provider_name || ''}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'} shape="rounded-pill">
//                       {item.status}
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CButton 
//                       size="sm" 
//                       className="action-btn"
//                       onClick={() => handleViewClick(item)}
//                     >
//                       <CIcon icon={cilZoom} className="me-1" />
//                       View
//                     </CButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderLaterTable = () => {
//     if (!canViewUpdateLaterTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Update Later tab.
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
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
//               {canCreateUpdateLater && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredLater.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreateUpdateLater ? "8" : "7"} style={{ color: 'red', textAlign: 'center' }}>
//                   No data available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredLater.map((item, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
//                   <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
//                   <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={item.status === 'LATER' ? 'warning' : 'success'} shape="rounded-pill">
//                       {item.status}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canCreateUpdateLater && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleUpdateClick(item)}
//                       >
//                         <CIcon icon={cilPencil} className="me-1" />
//                         Update
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

//   if (!canViewInsuranceDetails) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Insurance Details.
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
//       <div className='title'>Insurance Report</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {/* Export Excel Button - Moved to left end */}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleOpenExportModal}
//               title="Export to Excel"
//             >
            
//               Export Excel
//             </CButton>
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingInsuranceTab && (
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
//                       Pending Insurance
//                       {!canCreatePendingInsurance && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompleteInsuranceTab && (
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
//                       Complete Insurance
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewUpdateLaterTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 2}
//                       onClick={() => handleTabChange(2)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Update Later
//                       {!canCreateUpdateLater && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
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
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('insurance'));
//                       else handleLaterFilter(e.target.value, getDefaultSearchFields('insurance'));
//                     }}
//                     disabled={!canViewAnyTab}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingInsuranceTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompleteInsuranceTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderCompletedTable()}
//                   </CTabPane>
//                 )}
//                 {canViewUpdateLaterTab && (
//                   <CTabPane visible={activeTab === 2}>
//                     {renderLaterTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Insurance Details.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add Insurance Modal */}
//       <AddInsurance
//         show={showModal}
//         onClose={handleModalClose}
//         bookingData={selectedBooking}
//         insuranceData={selectedInsurance}
//         onSuccess={handleRefresh}
//       />
      
//       {/* View Insurance Modal */}
//       <ViewInsuranceModal 
//         show={showViewModal} 
//         onClose={() => setShowViewModal(false)} 
//         insuranceData={selectedInsurance} 
//       />

//       {/* Export Excel Modal */}
//       <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal}>
//         <CModalHeader>
//           <CModalTitle>
//             <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
//             Select Date Range for Export
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {/* Display export error */}
//           {exportError && (
//             <CAlert color="warning" className="mb-3">
//               {exportError}
//             </CAlert>
//           )}
          
//           <div className="mb-3">
//             <CFormLabel>Branch:</CFormLabel>
//             <CFormSelect
//               value={selectedBranchId}
//               onChange={(e) => {
//                 setSelectedBranchId(e.target.value);
//                 setExportError('');
//               }}
//               disabled={branches.length === 0}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
          
//           <LocalizationProvider 
//             dateAdapter={AdapterDateFns} 
//             adapterLocale={enIN}
//           >
//             <div className="mb-3">
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => {
//                   setStartDate(newValue);
//                   setExportError('');
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy"
//                 mask="__/__/____"
//                 views={['day', 'month', 'year']}
//               />
//             </div>
//             <div className="mb-3">
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(newValue) => {
//                   setEndDate(newValue);
//                   setExportError('');
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy"
//                 mask="__/__/____"
//                 minDate={startDate}
//                 views={['day', 'month', 'year']}
//               />
//             </div>
//           </LocalizationProvider>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseExportModal}>
//             Cancel
//           </CButton>
//           <CButton 
//             className="submit-button"
//             onClick={handleExportToExcel}
//             disabled={!startDate || !endDate || !selectedBranchId || exportLoading}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// }

// export default InsuranceReport;








// import React, { useState, useEffect } from 'react';
// import { 
//   CBadge, 
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
//   CAlert,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../../utils/tableImports';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import AddInsurance from './AddInsurance';
// import ViewInsuranceModal from './ViewInsurance';
// import ViewPendingBookingModal from './ViewPendingBookingModal';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilZoom, cilPencil, cilChevronLeft, cilChevronRight } from '@coreui/icons';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { enIN } from 'date-fns/locale';
// import TextField from '@mui/material/TextField';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../../utils/modulePermissions';
// import { useAuth } from '../../../context/AuthContext';

// function InsuranceReport() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showViewBookingModal, setShowViewBookingModal] = useState(false);
//   const [selectedInsurance, setSelectedInsurance] = useState(null);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [selectedBookingForView, setSelectedBookingForView] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [exportError, setExportError] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(100);
//   const [totalPages, setTotalPages] = useState(1);
//   const [displayedPages, setDisplayedPages] = useState([]);

//   const { permissions } = useAuth();
  
//   // Page-level VIEW permission check
//   const canViewInsuranceDetails = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW
//   );
  
//   // Tab-level VIEW permission checks
//   const canViewPendingInsuranceTab = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW,
//     TABS.INSURANCE_DETAILS.PENDING_INSURANCE
//   );
  
//   const canViewCompleteInsuranceTab = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW,
//     TABS.INSURANCE_DETAILS.COMPLETE_INSURANCE
//   );
  
//   const canViewUpdateLaterTab = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.VIEW,
//     TABS.INSURANCE_DETAILS.UPDATE_LATER
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingInsuranceTab || canViewCompleteInsuranceTab || canViewUpdateLaterTab;
  
//   // Tab-level CREATE permission for PENDING INSURANCE tab (for Add button)
//   const canCreatePendingInsurance = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.CREATE,
//     TABS.INSURANCE_DETAILS.PENDING_INSURANCE
//   );
  
//   // Tab-level CREATE permission for UPDATE LATER tab (for Update button)
//   const canCreateUpdateLater = hasSafePagePermission(
//     permissions, 
//     MODULES.INSURANCE, 
//     PAGES.INSURANCE.INSURANCE_DETAILS, 
//     ACTIONS.CREATE,
//     TABS.INSURANCE_DETAILS.UPDATE_LATER
//   );

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPendings,
//     setFilteredData: setFilteredPendings,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: laterData,
//     setData: setLaterData,
//     filteredData: filteredLater,
//     setFilteredData: setFilteredLater,
//     handleFilter: handleLaterFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingInsuranceTab) visibleTabs.push(0);
//     if (canViewCompleteInsuranceTab) visibleTabs.push(1);
//     if (canViewUpdateLaterTab) visibleTabs.push(2);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingInsuranceTab, canViewCompleteInsuranceTab, canViewUpdateLaterTab, activeTab]);

//   useEffect(() => {
//     fetchBranches();
//   }, []);

//   // Recalculate pagination when filtered data changes or tab changes
//   useEffect(() => {
//     const getFilteredData = () => {
//       switch(activeTab) {
//         case 0: return filteredPendings;
//         case 1: return filteredApproved;
//         case 2: return filteredLater;
//         default: return [];
//       }
//     };
    
//     calculatePagination(getFilteredData());
//     setCurrentPage(1); // Reset to first page when tab changes
//   }, [filteredPendings, filteredApproved, filteredLater, activeTab]);

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//     }
//   };

//   const fetchData = async () => {
//     if (!canViewInsuranceDetails) {
//       setError('Permission denied');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings/insurance-status/AWAITING`);
//       // Remove pagination - assuming response.data.data.docs contains the array
//       setPendingData(response.data.data.docs || response.data.data || []);
//       setFilteredPendings(response.data.data.docs || response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCompleteData = async () => {
//     if (!canViewInsuranceDetails) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/insurance/status/COMPLETED`);
//       setApprovedData(response.data.data || []);
//       setFilteredApproved(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchLaterData = async () => {
//     if (!canViewInsuranceDetails) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/insurance/status/LATER`);
//       setLaterData(response.data.data || []);
//       setFilteredLater(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!canViewInsuranceDetails) {
//       showError('You do not have permission to view Insurance Details');
//       return;
//     }
    
//     fetchData();
//     fetchCompleteData();
//     fetchLaterData();
//   }, [refreshKey, canViewInsuranceDetails]);

//   // Calculate pagination
//   const calculatePagination = (filteredData) => {
//     const total = filteredData.length;
//     const totalPages = Math.ceil(total / recordsPerPage);
//     setTotalPages(totalPages);
    
//     // Calculate displayed page numbers (max 5 pages shown)
//     const pages = [];
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, currentPage + 2);
    
//     // Adjust if we're near the beginning
//     if (currentPage <= 3) {
//       endPage = Math.min(5, totalPages);
//     }
    
//     // Adjust if we're near the end
//     if (currentPage >= totalPages - 2) {
//       startPage = Math.max(1, totalPages - 4);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     setDisplayedPages(pages);
//   };

//   // Get current records for the page
//   const getCurrentRecords = (filteredData) => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
//   };

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     // Scroll to top when page changes
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Format date to DD-MM-YYYY for display
//   const formatDateDDMMYYYY = (date) => {
//     if (!date) return '';
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Format date to YYYY-MM-DD for API
//   const formatDateForAPI = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const handleExportToExcel = async () => {
//     // Check for add permission based on active tab
//     if (activeTab === 0 && !canCreatePendingInsurance) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for complete tab - anyone can export if they can view
//     if (activeTab === 1 && !canViewCompleteInsuranceTab) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for update later tab - need create permission
//     if (activeTab === 2 && !canCreateUpdateLater) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }

//     // Clear previous errors
//     setExportError('');
    
//     if (!selectedBranchId) {
//       setExportError('Please select a branch');
//       return;
//     }

//     if (!startDate || !endDate) {
//       setExportError('Please select both start and end dates');
//       return;
//     }

//     if (startDate > endDate) {
//       setExportError('Start date cannot be after end date');
//       return;
//     }

//     try {
//       setExportLoading(true);
      
//       const formattedStartDate = formatDateForAPI(startDate);
//       const formattedEndDate = formatDateForAPI(endDate);

//       // Determine API endpoint based on active tab
//       let apiEndpoint = '';
//       if (activeTab === 0) {
//         apiEndpoint = '/reports/insurance/pending'; // Pending Insurance
//       } else if (activeTab === 1) {
//         apiEndpoint = '/reports/insurance/complete'; // Complete Insurance
//       } else if (activeTab === 2) {
//         apiEndpoint = '/reports/insurance/later'; // Update Later
//       }

//       // Build query parameters
//       const params = new URLSearchParams({
//         branchId: selectedBranchId,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         format: 'excel'
//       });

//       const response = await axiosInstance.get(
//         `${apiEndpoint}?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       // Check content type to see if it's an error
//       const contentType = response.headers['content-type'];
      
//       if (contentType && contentType.includes('application/json')) {
//         // It's a JSON error response, parse it
//         const text = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsText(response.data);
//         });
        
//         const errorData = JSON.parse(text);
        
//         // Show the exact error message from API
//         if (!errorData.success && errorData.message) {
//           setExportError(errorData.message);
//           return;
//         }
//       }

//       // Handle Excel file download
//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Generate filename
//       const branchName = branches.find(b => b._id === selectedBranchId)?.name || 'Branch';
//       const startDateStr = formatDateDDMMYYYY(startDate);
//       const endDateStr = formatDateDDMMYYYY(endDate);
      
//       let tabName = '';
//       if (activeTab === 0) tabName = 'Pending_Insurance';
//       else if (activeTab === 1) tabName = 'Complete_Insurance';
//       else if (activeTab === 2) tabName = 'Update_Later';
      
//       const fileName = `${tabName}_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       window.URL.revokeObjectURL(url);
      
//       // Show success message
//       showError('Excel exported successfully!');
//       handleCloseExportModal();
      
//     } catch (error) {
//       console.error('Error exporting report:', error);
      
//       // For blob errors, we need to read the blob
//       if (error.response && error.response.data instanceof Blob) {
//         try {
//           const text = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsText(error.response.data);
//           });
          
//           const errorData = JSON.parse(text);
          
//           // Show the exact error message from API
//           if (errorData.message) {
//             setExportError(errorData.message);
//           }
//         } catch (parseError) {
//           console.error('Error parsing error response:', parseError);
//           setExportError('Failed to export report');
//         }
//       } else if (error.response?.data?.message) {
//         // Regular error with message in response
//         setExportError(error.response.data.message);
//       } else if (error.message) {
//         // Network or other errors
//         setExportError(error.message);
//       } else {
//         setExportError('Failed to export report');
//       }
      
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreatePendingInsurance) {
//       showError('You do not have permission to add insurance');
//       return;
//     }
    
//     setSelectedBooking(booking);
//     setSelectedInsurance(null);
//     setShowModal(true);
//   };

//   const handleViewBookingClick = (booking) => {
//     setSelectedBookingForView(booking);
//     setShowViewBookingModal(true);
//   };

//   const handleViewClick = async (item) => {
//     try {
//       const response = await axiosInstance.get(`/insurance/${item.id}`);
//       setSelectedInsurance(response.data.data);
//       setShowViewModal(true);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleUpdateClick = async (item) => {
//     if (!canCreateUpdateLater) {
//       showError('You do not have permission to update insurance');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/insurance/${item.id}`);
//       setSelectedInsurance(response.data.data);
//       setSelectedBooking(response.data.data.booking);
//       setShowModal(true);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setSelectedInsurance(null);
//     setSelectedBooking(null);
//     handleRefresh();
//   };

//   const handleTabChange = (tab) => {
//     if (!canViewInsuranceDetails) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setSearchTerm('');
//     setCurrentPage(1); // Reset to first page when tab changes
//   };

//   const handleOpenExportModal = () => {
//     // Check for add permission based on active tab
//     if (activeTab === 0 && !canCreatePendingInsurance) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for complete tab - anyone can export if they can view
//     if (activeTab === 1 && !canViewCompleteInsuranceTab) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     // Check for update later tab - need create permission
//     if (activeTab === 2 && !canCreateUpdateLater) {
//       showError('You do not have permission to export from this tab');
//       return;
//     }
    
//     setShowExportModal(true);
//     setExportError('');
//   };

//   const handleCloseExportModal = () => {
//     setShowExportModal(false);
//     setSelectedBranchId('');
//     setStartDate(null);
//     setEndDate(null);
//     setExportError('');
//   };

//   // Handle search with page reset
//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     if (activeTab === 0) handlePendingFilter(value, getDefaultSearchFields('booking'));
//     else if (activeTab === 1) handleApprovedFilter(value, getDefaultSearchFields('insurance'));
//     else handleLaterFilter(value, getDefaultSearchFields('insurance'));
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const renderPendingTable = () => {
//     if (!canViewPendingInsuranceTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Pending Insurance tab.
//           </CAlert>
//         </div>
//       );
//     }

//     const currentRecords = getCurrentRecords(filteredPendings);
//     const startRecord = (currentPage - 1) * recordsPerPage + 1;
//     const endRecord = Math.min(currentPage * recordsPerPage, filteredPendings.length);

//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
//                 {canCreatePendingInsurance && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {currentRecords.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={canCreatePendingInsurance ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                     No data available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 currentRecords.map((booking, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{startRecord + index}</CTableDataCell>
//                     <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                     <CTableDataCell>{booking.modelDetails?.model_name || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
//                     <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                     <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
//                     <CTableDataCell>{booking.engineNumber || booking.vehicle?.engineNumber || ''}</CTableDataCell>
//                     <CTableDataCell>
//                       <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'danger' : 'success'} shape="rounded-pill">
//                         {booking.insuranceStatus}
//                       </CBadge>
//                     </CTableDataCell>
//                     {canCreatePendingInsurance && (
//                       <CTableDataCell>
//                         <div className="d-flex gap-1">
//                           <CButton 
//                             size="sm" 
//                             className="action-btn"
//                             onClick={() => handleViewBookingClick(booking)}
//                             title="View Details"
//                           >
//                             <CIcon icon={cilZoom} className="me-1" />
//                             View
//                           </CButton>
//                           <CButton 
//                             size="sm" 
//                             className="action-btn"
//                             onClick={() => handleAddClick(booking)}
//                             title="Add Insurance"
//                           >
//                             <CIcon icon={cilPlus} className="me-1" />
//                             Add
//                           </CButton>
//                         </div>
//                       </CTableDataCell>
//                     )}
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>

//         {/* Pagination for Pending Table */}
//         {filteredPendings.length > recordsPerPage && renderPagination(filteredPendings.length, startRecord, endRecord)}
//       </>
//     );
//   };

//   const renderCompletedTable = () => {
//     if (!canViewCompleteInsuranceTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Complete Insurance tab.
//           </CAlert>
//         </div>
//       );
//     }

//     const currentRecords = getCurrentRecords(filteredApproved);
//     const startRecord = (currentPage - 1) * recordsPerPage + 1;
//     const endRecord = Math.min(currentPage * recordsPerPage, filteredApproved.length);

//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Insurance Provider</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {currentRecords.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
//                     No data available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 currentRecords.map((item, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{startRecord + index}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
//                     <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                     <CTableDataCell>{item.insuranceProviderDetails?.provider_name || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.engineNumber || item.booking?.vehicle?.engineNumber || ''}</CTableDataCell>
//                     <CTableDataCell>
//                       <CBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'} shape="rounded-pill">
//                         {item.status}
//                       </CBadge>
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleViewClick(item)}
//                       >
//                         <CIcon icon={cilZoom} className="me-1" />
//                         View
//                       </CButton>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>

//         {/* Pagination for Completed Table */}
//         {filteredApproved.length > recordsPerPage && renderPagination(filteredApproved.length, startRecord, endRecord)}
//       </>
//     );
//   };

//   const renderLaterTable = () => {
//     if (!canViewUpdateLaterTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Update Later tab.
//           </CAlert>
//         </div>
//       );
//     }

//     const currentRecords = getCurrentRecords(filteredLater);
//     const startRecord = (currentPage - 1) * recordsPerPage + 1;
//     const endRecord = Math.min(currentPage * recordsPerPage, filteredLater.length);

//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
//                 {canCreateUpdateLater && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {currentRecords.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={canCreateUpdateLater ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                     No data available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 currentRecords.map((item, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{startRecord + index}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
//                     <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{item.booking?.engineNumber || item.booking?.vehicle?.engineNumber || ''}</CTableDataCell>
//                     <CTableDataCell>
//                       <CBadge color={item.status === 'LATER' ? 'warning' : 'success'} shape="rounded-pill">
//                         {item.status}
//                       </CBadge>
//                     </CTableDataCell>
//                     {canCreateUpdateLater && (
//                       <CTableDataCell>
//                         <CButton 
//                           size="sm" 
//                           className="action-btn"
//                           onClick={() => handleUpdateClick(item)}
//                         >
//                           <CIcon icon={cilPencil} className="me-1" />
//                           Update
//                         </CButton>
//                       </CTableDataCell>
//                     )}
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>

//         {/* Pagination for Later Table */}
//         {filteredLater.length > recordsPerPage && renderPagination(filteredLater.length, startRecord, endRecord)}
//       </>
//     );
//   };

//   // Reusable pagination component
//   const renderPagination = (totalRecords, startRecord, endRecord) => (
//     <div className="mt-4">
//       <CPagination align="center" aria-label="Page navigation example">
//         {/* Previous Button */}
//         <CPaginationItem 
//           aria-label="Previous" 
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={currentPage === 1 ? 'disabled' : ''}
//         >
//           <CIcon icon={cilChevronLeft} />
//         </CPaginationItem>
        
//         {/* First Page */}
//         {currentPage > 3 && totalPages > 5 && (
//           <>
//             <CPaginationItem 
//               onClick={() => handlePageChange(1)}
//               active={currentPage === 1}
//             >
//               1
//             </CPaginationItem>
//             {currentPage > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//           </>
//         )}
        
//         {/* Page Numbers */}
//         {displayedPages.map(page => (
//           <CPaginationItem 
//             key={page}
//             onClick={() => handlePageChange(page)}
//             active={currentPage === page}
//           >
//             {page}
//           </CPaginationItem>
//         ))}
        
//         {/* Last Page */}
//         {currentPage < totalPages - 2 && totalPages > 5 && (
//           <>
//             {currentPage < totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//             <CPaginationItem 
//               onClick={() => handlePageChange(totalPages)}
//               active={currentPage === totalPages}
//             >
//               {totalPages}
//             </CPaginationItem>
//           </>
//         )}
        
//         {/* Next Button */}
//         <CPaginationItem 
//           aria-label="Next" 
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={currentPage === totalPages ? 'disabled' : ''}
//         >
//           <CIcon icon={cilChevronRight} />
//         </CPaginationItem>
//       </CPagination>
      
//       {/* Pagination Info */}
//       <div className="text-center text-muted mt-2">
//         Showing {startRecord} to {endRecord} of {totalRecords} entries
//       </div>
//     </div>
//   );

//   if (!canViewInsuranceDetails) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Insurance Details.
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
//       <div className='title'>Insurance Report</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {/* Export Excel Button - Moved to left end */}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleOpenExportModal}
//               title="Export to Excel"
//             >
//               Export Excel
//             </CButton>
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingInsuranceTab && (
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
//                       Pending Insurance
//                       {!canCreatePendingInsurance && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
//                       )}
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCompleteInsuranceTab && (
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
//                       Complete Insurance
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewUpdateLaterTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 2}
//                       onClick={() => handleTabChange(2)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Update Later
//                       {!canCreateUpdateLater && (
//                         <span className="ms-1 text-muted small">(View Only)</span>
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
//                     onChange={(e) => handleSearchChange(e.target.value)}
//                     disabled={!canViewAnyTab}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingInsuranceTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderPendingTable()}
//                   </CTabPane>
//                 )}
//                 {canViewCompleteInsuranceTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderCompletedTable()}
//                   </CTabPane>
//                 )}
//                 {canViewUpdateLaterTab && (
//                   <CTabPane visible={activeTab === 2}>
//                     {renderLaterTable()}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in Insurance Details.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Add Insurance Modal */}
//       <AddInsurance
//         show={showModal}
//         onClose={handleModalClose}
//         bookingData={selectedBooking}
//         insuranceData={selectedInsurance}
//         onSuccess={handleRefresh}
//       />
      
//       {/* View Insurance Modal */}
//       <ViewInsuranceModal 
//         show={showViewModal} 
//         onClose={() => setShowViewModal(false)} 
//         insuranceData={selectedInsurance} 
//       />

//       {/* View Booking Modal */}
//       <ViewPendingBookingModal
//         show={showViewBookingModal}
//         onClose={() => {
//           setShowViewBookingModal(false);
//           setSelectedBookingForView(null);
//         }}
//         bookingData={selectedBookingForView}
//       />

//       {/* Export Excel Modal */}
//       <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal}>
//         <CModalHeader>
//           <CModalTitle>
//             <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
//             Select Date Range for Export
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {/* Display export error */}
//           {exportError && (
//             <CAlert color="warning" className="mb-3">
//               {exportError}
//             </CAlert>
//           )}
          
//           <div className="mb-3">
//             <CFormLabel>Branch:</CFormLabel>
//             <CFormSelect
//               value={selectedBranchId}
//               onChange={(e) => {
//                 setSelectedBranchId(e.target.value);
//                 setExportError('');
//               }}
//               disabled={branches.length === 0}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
          
//           <LocalizationProvider 
//             dateAdapter={AdapterDateFns} 
//             adapterLocale={enIN}
//           >
//             <div className="mb-3">
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => {
//                   setStartDate(newValue);
//                   setExportError('');
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy"
//                 mask="__/__/____"
//                 views={['day', 'month', 'year']}
//               />
//             </div>
//             <div className="mb-3">
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(newValue) => {
//                   setEndDate(newValue);
//                   setExportError('');
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy"
//                 mask="__/__/____"
//                 minDate={startDate}
//                 views={['day', 'month', 'year']}
//               />
//             </div>
//           </LocalizationProvider>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseExportModal}>
//             Cancel
//           </CButton>
//           <CButton 
//             className="submit-button"
//             onClick={handleExportToExcel}
//             disabled={!startDate || !endDate || !selectedBranchId || exportLoading}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// }

// export default InsuranceReport;









import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CBadge, 
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
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { axiosInstance, showError } from '../../../utils/tableImports';
import '../../../css/invoice.css';
import '../../../css/table.css';
import AddInsurance from './AddInsurance';
import ViewInsuranceModal from './ViewInsurance';
import ViewPendingBookingModal from './ViewPendingBookingModal';
import ViewRenewalModal from './ViewRenewalModal';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilZoom, cilPencil, cilChevronLeft, cilChevronRight, cilReload, cilUserPlus, cilPrint } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import Select from 'react-select';
import { numberToWords } from '../../../utils/numberToWords';
import tvsLogo from '../../../assets/images/logo.png';

// Import the permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../../utils/modulePermissions';

// Tab constants
const TAB = {
  PENDING_INSURANCE: 0,
  COMPLETE_INSURANCE: 1,
  UPDATE_LATER: 2,
  INSURANCE_RENEWAL: 3
};

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
const DEFAULT_LIMIT = 100;

// Each tab gets its own fully independent state slice
const emptyTab = () => ({
  docs: [],
  total: 0,
  pages: 0,
  currentPage: 1,
  limit: DEFAULT_LIMIT,
  loading: false,
  search: '',
});

// Custom styles for react-select
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
    '&:hover': {
      borderColor: '#86b7fe'
    }
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : 'white',
    color: state.isSelected ? 'white' : '#212529',
    '&:active': {
      backgroundColor: '#0d6efd'
    }
  })
};

function InsuranceReport() {
  const [activeTab, setActiveTab] = useState(TAB.PENDING_INSURANCE);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showViewBookingModal, setShowViewBookingModal] = useState(false);
  const [showViewRenewalModal, setShowViewRenewalModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingForView, setSelectedBookingForView] = useState(null);
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Models state for dropdown
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  
  // Insurance Providers state for dropdown
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  
  // Bank Sub Payment Modes state
  const [bankSubPaymentModes, setBankSubPaymentModes] = useState([]);
  const [loadingBankSubPaymentModes, setLoadingBankSubPaymentModes] = useState(false);
  
  // Banks state
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  
  // Insurance Renewal Modal states (for existing customer - from Complete Insurance tab)
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalFormData, setRenewalFormData] = useState({
    originalInsurance: '',
    customerName: '',
    newPolicyNumber: '',
    newInsuranceCompany: '',
    newPremium: '',
    newStartDate: '',
    newExpiryDate: '',
    paymentMode: '',
    paymentSubMode: '',
    bankLocation: '',
    paymentReference: '',
    remarks: ''
  });
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [renewalError, setRenewalError] = useState('');

  // New Customer Insurance Renewal Modal states
  const [showNewCustomerRenewalModal, setShowNewCustomerRenewalModal] = useState(false);
  const [newCustomerRenewalFormData, setNewCustomerRenewalFormData] = useState({
    customerName: '',
    newPolicyNumber: '',
    newInsuranceCompany: '',
    newPremium: '',
    newStartDate: '',
    newExpiryDate: '',
    paymentMode: '',
    paymentSubMode: '',
    bankLocation: '',
    paymentReference: '',
    remarks: ''
  });
  const [newCustomerRenewalLoading, setNewCustomerRenewalLoading] = useState(false);
  const [newCustomerRenewalError, setNewCustomerRenewalError] = useState('');
  
  // Per-tab independent state
  const [tabData, setTabData] = useState(() => ({
    [TAB.PENDING_INSURANCE]: emptyTab(),
    [TAB.COMPLETE_INSURANCE]: emptyTab(),
    [TAB.UPDATE_LATER]: emptyTab(),
    [TAB.INSURANCE_RENEWAL]: emptyTab()
  }));
  
  // LOCAL search state (display only — input is UNCONTROLLED)
  const [localSearch, setLocalSearch] = useState('');
  
  // Export modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [exportError, setExportError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  
  // Refs for debouncing
  const searchTimer = useRef(null);
  const searchInputRef = useRef(null);
  const activeTabRef = useRef(activeTab);
  
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  const { permissions = [], user } = useAuth();
  const hasAllBranchAccess = user?.branchAccess === "ALL";
  
  // ===== PERMISSION CHECKS =====
  // Page-level VIEW permission check
  const canViewInsuranceDetails = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW
  );
  
  // Tab-level VIEW permission checks
  const canViewPendingInsuranceTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW,
    TABS.INSURANCE_DETAILS.PENDING_INSURANCE
  );
  
  const canViewCompleteInsuranceTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW,
    TABS.INSURANCE_DETAILS.COMPLETE_INSURANCE
  );
  
  const canViewUpdateLaterTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW,
    TABS.INSURANCE_DETAILS.UPDATE_LATER
  );
  
  // Insurance Renewal tab VIEW permission
  const canViewRenewalTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW,
    TABS.INSURANCE_DETAILS.INSURANCE_RENEWAL
  );
  
  // Tab-level CREATE permission for PENDING INSURANCE tab (for Add button)
  const canCreatePendingInsurance = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.CREATE,
    TABS.INSURANCE_DETAILS.PENDING_INSURANCE
  );
  
  // Tab-level CREATE permission for UPDATE LATER tab (for Update button)
  const canCreateUpdateLater = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.CREATE,
    TABS.INSURANCE_DETAILS.UPDATE_LATER
  );
  
  // Insurance Renewal tab CREATE permission
  const canCreateRenewalTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.CREATE,
    TABS.INSURANCE_DETAILS.INSURANCE_RENEWAL
  );
  
  // Insurance Renewal tab UPDATE permission
  const canUpdateRenewalTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.UPDATE,
    TABS.INSURANCE_DETAILS.INSURANCE_RENEWAL
  );
  
  // Insurance Renewal tab DELETE permission
  const canDeleteRenewalTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.DELETE,
    TABS.INSURANCE_DETAILS.INSURANCE_RENEWAL
  );
  
  // Check if user can view any tab
  const canViewAnyTab = canViewPendingInsuranceTab || 
    canViewCompleteInsuranceTab || 
    canViewUpdateLaterTab || 
    canViewRenewalTab;
  
  // Check if user has any renewal-related permission (for buttons)
  const canManageRenewals = canViewRenewalTab || 
    canCreateRenewalTab || 
    canUpdateRenewalTab || 
    canDeleteRenewalTab;

  // Helper: update a single tab's slice
  const setTab = useCallback((tabIndex, updates) =>
    setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
  []);

  // Fetch models
  const fetchModels = useCallback(async () => {
    setLoadingModels(true);
    try {
      const response = await axiosInstance.get('/models/list/names');
      
      if (response.data.status === 'success') {
        const modelOptions = (response.data.data.models || []).map(model => ({
          value: model.id,
          label: model.name
        }));
        setModels(modelOptions);
      } else {
        showError(response.data.message || 'Failed to load models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Failed to load models');
      }
    } finally {
      setLoadingModels(false);
    }
  }, []);

  // Fetch Insurance Providers - Updated
  const fetchInsuranceProviders = useCallback(async () => {
    setLoadingProviders(true);
    try {
      const response = await axiosInstance.get('/insurance-providers');
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const providerOptions = response.data.data.map(provider => ({
          value: provider._id,
          label: provider.provider_name
        }));
        setInsuranceProviders(providerOptions);
      } else if (response.data && Array.isArray(response.data)) {
        const providerOptions = response.data.map(provider => ({
          value: provider._id,
          label: provider.provider_name
        }));
        setInsuranceProviders(providerOptions);
      } else {
        console.error('Unexpected response structure:', response.data);
        showError('Failed to load insurance providers');
      }
    } catch (error) {
      console.error('Error fetching insurance providers:', error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Failed to load insurance providers');
      }
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  // Fetch Bank Sub Payment Modes
  const fetchBankSubPaymentModes = useCallback(async () => {
    setLoadingBankSubPaymentModes(true);
    try {
      const response = await axiosInstance.get('/banksubpaymentmodes');
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const options = response.data.data.map(mode => ({
          value: mode._id,
          label: mode.payment_mode
        }));
        setBankSubPaymentModes(options);
      } else {
        console.error('Unexpected response structure:', response.data);
        showError('Failed to load bank sub payment modes');
      }
    } catch (error) {
      console.error('Error fetching bank sub payment modes:', error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Failed to load bank sub payment modes');
      }
    } finally {
      setLoadingBankSubPaymentModes(false);
    }
  }, []);

  // Fetch Banks
  const fetchBanks = useCallback(async () => {
    setLoadingBanks(true);
    try {
      const response = await axiosInstance.get('/banks');
      
      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.banks) {
        const options = response.data.data.banks.map(bank => ({
          value: bank._id,
          label: bank.name
        }));
        setBanks(options);
      } else {
        console.error('Unexpected response structure:', response.data);
        showError('Failed to load banks');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Failed to load banks');
      }
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  // Fetch functions with server-side pagination and search
  const fetchCompleteInsurance = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewCompleteInsuranceTab) return;
    setTab(tabIndex, { loading: true });
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const response = await axiosInstance.get(`/insurance/status/COMPLETED`, { params });
      
      let docs = [];
      let total = 0;
      let pages = 1;
      
      if (response.data) {
        docs = response.data.data || [];
        total = response.data.totalCount || response.data.count || docs.length;
        
        if (response.data.pagination) {
          pages = response.data.pagination.totalPages || 1;
          total = response.data.pagination.total || docs.length;
        } else {
          pages = Math.ceil(total / limit);
        }
      }
      
      setTab(tabIndex, {
        docs,
        total,
        pages,
        currentPage: page,
        limit,
        loading: false,
        search
      });
    } catch (error) {
      console.error('Error fetching complete insurance:', error);
      showError(error);
      setTab(tabIndex, { loading: false, docs: [], total: 0, pages: 1 });
    }
  }, [canViewCompleteInsuranceTab, setTab]);

  const fetchPendingInsurance = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewPendingInsuranceTab) return;
    setTab(tabIndex, { loading: true });
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const response = await axiosInstance.get(`/bookings/insurance-status/AWAITING`, { params });
      
      let docs = [];
      let total = 0;
      let pages = 1;
      
      if (response.data) {
        if (response.data.data) {
          if (response.data.data.docs) {
            docs = response.data.data.docs;
            total = response.data.data.totalDocs || response.data.data.total || docs.length;
            pages = response.data.data.totalPages || Math.ceil(total / limit);
          } else if (Array.isArray(response.data.data)) {
            docs = response.data.data;
            total = response.data.totalCount || response.data.count || docs.length;
            if (response.data.pagination) {
              pages = response.data.pagination.totalPages || 1;
            } else {
              pages = Math.ceil(total / limit);
            }
          } else {
            docs = response.data.data;
            total = docs.length;
            pages = Math.ceil(total / limit);
          }
        } else if (Array.isArray(response.data)) {
          docs = response.data;
          total = docs.length;
          pages = Math.ceil(total / limit);
        } else {
          docs = response.data?.docs || [];
          total = response.data?.totalDocs || docs.length;
          pages = response.data?.totalPages || Math.ceil(total / limit);
        }
      }
      
      setTab(tabIndex, {
        docs,
        total,
        pages,
        currentPage: page,
        limit,
        loading: false,
        search
      });
    } catch (error) {
      console.error('Error fetching pending insurance:', error);
      showError(error);
      setTab(tabIndex, { loading: false, docs: [], total: 0, pages: 1 });
    }
  }, [canViewPendingInsuranceTab, setTab]);

  const fetchUpdateLater = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewUpdateLaterTab) return;
    setTab(tabIndex, { loading: true });
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const response = await axiosInstance.get(`/insurance/status/LATER`, { params });
      
      let docs = [];
      let total = 0;
      let pages = 1;
      
      if (response.data) {
        docs = response.data.data || [];
        total = response.data.totalCount || response.data.count || docs.length;
        
        if (response.data.pagination) {
          pages = response.data.pagination.totalPages || 1;
          total = response.data.pagination.total || docs.length;
        } else {
          pages = Math.ceil(total / limit);
        }
      }
      
      setTab(tabIndex, {
        docs,
        total,
        pages,
        currentPage: page,
        limit,
        loading: false,
        search
      });
    } catch (error) {
      console.error('Error fetching update later:', error);
      showError(error);
      setTab(tabIndex, { loading: false, docs: [], total: 0, pages: 1 });
    }
  }, [canViewUpdateLaterTab, setTab]);

  // Fetch Insurance Renewals - with permission check
  const fetchInsuranceRenewals = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewRenewalTab) {
      console.warn('User does not have permission to view Insurance Renewals');
      return;
    }
    setTab(tabIndex, { loading: true });
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const response = await axiosInstance.get(`/insurance-renewals`, { params });
      
      let docs = [];
      let total = 0;
      let pages = 1;
      
      if (response.data) {
        docs = response.data.data || [];
        total = response.data.total || response.data.count || docs.length;
        pages = response.data.pages || Math.ceil(total / limit);
      }
      
      setTab(tabIndex, {
        docs,
        total,
        pages,
        currentPage: page,
        limit,
        loading: false,
        search
      });
    } catch (error) {
      console.error('Error fetching insurance renewals:', error);
      showError(error);
      setTab(tabIndex, { loading: false, docs: [], total: 0, pages: 1 });
    }
  }, [canViewRenewalTab, setTab]);

  // Central dispatcher for fetching
  const fetchTab = useCallback((tabIndex, page, limit, search) => {
    setTabData(prev => {
      const td = prev[tabIndex];
      const p = page !== undefined ? page : td.currentPage;
      const l = limit !== undefined ? limit : td.limit;
      const s = search !== undefined ? search : td.search;
      
      switch (tabIndex) {
        case TAB.PENDING_INSURANCE:
          fetchPendingInsurance(tabIndex, p, l, s);
          break;
        case TAB.COMPLETE_INSURANCE:
          fetchCompleteInsurance(tabIndex, p, l, s);
          break;
        case TAB.UPDATE_LATER:
          fetchUpdateLater(tabIndex, p, l, s);
          break;
        case TAB.INSURANCE_RENEWAL:
          fetchInsuranceRenewals(tabIndex, p, l, s);
          break;
        default:
          break;
      }
      return prev;
    });
  }, [fetchPendingInsurance, fetchCompleteInsurance, fetchUpdateLater, fetchInsuranceRenewals]);

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }, []);

  // Initial data load - fetch all tabs once on mount
  useEffect(() => {
    if (!canViewInsuranceDetails) {
      showError('You do not have permission to view Insurance Details');
      return;
    }
    
    fetchBranches();
    fetchModels();
    fetchInsuranceProviders();
    fetchBankSubPaymentModes();
    fetchBanks();
    
    if (canViewPendingInsuranceTab) {
      fetchPendingInsurance(TAB.PENDING_INSURANCE, 1, DEFAULT_LIMIT, '');
    }
    if (canViewCompleteInsuranceTab) {
      fetchCompleteInsurance(TAB.COMPLETE_INSURANCE, 1, DEFAULT_LIMIT, '');
    }
    if (canViewUpdateLaterTab) {
      fetchUpdateLater(TAB.UPDATE_LATER, 1, DEFAULT_LIMIT, '');
    }
    if (canViewRenewalTab) {
      fetchInsuranceRenewals(TAB.INSURANCE_RENEWAL, 1, DEFAULT_LIMIT, '');
    }
  }, [canViewInsuranceDetails, canViewPendingInsuranceTab, canViewCompleteInsuranceTab, 
      canViewUpdateLaterTab, canViewRenewalTab, fetchPendingInsurance, fetchCompleteInsurance, 
      fetchUpdateLater, fetchInsuranceRenewals, fetchBranches, fetchModels, 
      fetchInsuranceProviders, fetchBankSubPaymentModes, fetchBanks]);

  // Refresh on refreshKey change
  useEffect(() => {
    if (refreshKey > 0 && canViewInsuranceDetails) {
      const currentTab = activeTab;
      const tabState = tabData[currentTab];
      fetchTab(currentTab, tabState.currentPage, tabState.limit, tabState.search);
    }
  }, [refreshKey, activeTab, tabData, fetchTab, canViewInsuranceDetails]);

  // Adjust activeTab based on tab-level permissions
  useEffect(() => {
    if (!canViewAnyTab) return;
    
    const visibleTabs = [];
    if (canViewPendingInsuranceTab) visibleTabs.push(TAB.PENDING_INSURANCE);
    if (canViewCompleteInsuranceTab) visibleTabs.push(TAB.COMPLETE_INSURANCE);
    if (canViewUpdateLaterTab) visibleTabs.push(TAB.UPDATE_LATER);
    if (canViewRenewalTab) visibleTabs.push(TAB.INSURANCE_RENEWAL);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingInsuranceTab, canViewCompleteInsuranceTab, 
      canViewUpdateLaterTab, canViewRenewalTab, activeTab]);

  // Pagination handlers
  const handlePageChange = useCallback((tabIndex, newPage) => {
    setTabData(prev => {
      const td = prev[tabIndex];
      if (newPage < 1 || newPage > td.pages) return prev;
      
      switch (tabIndex) {
        case TAB.PENDING_INSURANCE:
          fetchPendingInsurance(tabIndex, newPage, td.limit, td.search);
          break;
        case TAB.COMPLETE_INSURANCE:
          fetchCompleteInsurance(tabIndex, newPage, td.limit, td.search);
          break;
        case TAB.UPDATE_LATER:
          fetchUpdateLater(tabIndex, newPage, td.limit, td.search);
          break;
        case TAB.INSURANCE_RENEWAL:
          fetchInsuranceRenewals(tabIndex, newPage, td.limit, td.search);
          break;
        default:
          break;
      }
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchPendingInsurance, fetchCompleteInsurance, fetchUpdateLater, fetchInsuranceRenewals]);

  const handleLimitChange = useCallback((tabIndex, newLimit) => {
    const limit = parseInt(newLimit, 10);
    setTabData(prev => {
      const td = prev[tabIndex];
      switch (tabIndex) {
        case TAB.PENDING_INSURANCE:
          fetchPendingInsurance(tabIndex, 1, limit, td.search);
          break;
        case TAB.COMPLETE_INSURANCE:
          fetchCompleteInsurance(tabIndex, 1, limit, td.search);
          break;
        case TAB.UPDATE_LATER:
          fetchUpdateLater(tabIndex, 1, limit, td.search);
          break;
        case TAB.INSURANCE_RENEWAL:
          fetchInsuranceRenewals(tabIndex, 1, limit, td.search);
          break;
        default:
          break;
      }
      return prev;
    });
  }, [fetchPendingInsurance, fetchCompleteInsurance, fetchUpdateLater, fetchInsuranceRenewals]);

  // Search handler with debounce
  const handleSearch = useCallback((value) => {
    setLocalSearch(value);
    
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const tab = activeTabRef.current;
      const tabState = tabData[tab];
      const limit = tabState?.limit || DEFAULT_LIMIT;
      fetchTab(tab, 1, limit, value);
    }, 400);
  }, [tabData, fetchTab]);

  // Tab change handler - always re-fetch fresh data with empty search
  const handleTabChange = useCallback((tab) => {
    clearTimeout(searchTimer.current);
    setActiveTab(tab);
    setLocalSearch('');
    
    if (searchInputRef.current) searchInputRef.current.value = '';
    
    setTabData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], search: '' }
    }));
    
    const limit = tabData[tab]?.limit || DEFAULT_LIMIT;
    fetchTab(tab, 1, limit, '');
  }, [tabData, fetchTab]);

  // Refresh helper
  const refreshTab = useCallback((tabIndex) => {
    const td = tabData[tabIndex];
    const limit = td?.limit || DEFAULT_LIMIT;
    const search = td?.search || '';
    
    if (tabIndex === activeTab) {
      setLocalSearch('');
      if (searchInputRef.current) searchInputRef.current.value = '';
    }
    
    switch (tabIndex) {
      case TAB.PENDING_INSURANCE:
        fetchPendingInsurance(tabIndex, 1, limit, '');
        break;
      case TAB.COMPLETE_INSURANCE:
        fetchCompleteInsurance(tabIndex, 1, limit, search);
        break;
      case TAB.UPDATE_LATER:
        fetchUpdateLater(tabIndex, 1, limit, search);
        break;
      case TAB.INSURANCE_RENEWAL:
        if (canViewRenewalTab) {
          fetchInsuranceRenewals(tabIndex, 1, limit, search);
        }
        break;
      default:
        break;
    }
  }, [activeTab, tabData, fetchPendingInsurance, fetchCompleteInsurance, fetchUpdateLater, 
      fetchInsuranceRenewals, canViewRenewalTab]);

  const handleRefresh = useCallback(() => {
    refreshTab(activeTab);
  }, [activeTab, refreshTab]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedInsurance(null);
    setSelectedBooking(null);
    refreshTab(activeTab);
  }, [activeTab, refreshTab]);

  // Insurance Renewal Handlers (for existing customer - from Complete Insurance tab)
  const handleOpenRenewalModal = (insuranceItem) => {
    if (!canCreateRenewalTab && !canCreatePendingInsurance && !canCreateUpdateLater) {
      showError('You do not have permission to renew insurance');
      return;
    }
    
    // Pre-fill form with data from the insurance item
    setRenewalFormData({
      originalInsurance: insuranceItem.id || '',
      customerName: insuranceItem.customerName || '',
      newPolicyNumber: '',
      newInsuranceCompany: insuranceItem.originalInsurance?.InsuranceCompany || '',
      newPremium: insuranceItem.originalInsurance?.PremiumAmount?.toString() || '',
      newStartDate: '',
      newExpiryDate: '',
      paymentMode: '',
      paymentSubMode: '',
      bankLocation: '',
      paymentReference: '',
      remarks: ''
    });
    
    setRenewalError('');
    setShowRenewalModal(true);
  };

  const handleCloseRenewalModal = () => {
    setShowRenewalModal(false);
    setRenewalFormData({
      originalInsurance: '',
      customerName: '',
      newPolicyNumber: '',
      newInsuranceCompany: '',
      newPremium: '',
      newStartDate: '',
      newExpiryDate: '',
      paymentMode: '',
      paymentSubMode: '',
      bankLocation: '',
      paymentReference: '',
      remarks: ''
    });
    setRenewalError('');
  };

  const handleRenewalFormChange = (e) => {
    const { name, value } = e.target;
    setRenewalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setRenewalError('');
  };

  // Handle payment mode change for renewal form
  const handleRenewalPaymentModeChange = (e) => {
    const { value } = e.target;
    setRenewalFormData(prev => ({
      ...prev,
      paymentMode: value,
      paymentSubMode: '',
      bankLocation: '',
      paymentReference: ''
    }));
    setRenewalError('');
  };

  // Handle payment sub mode change for renewal form
  const handleRenewalSubModeChange = (selectedOption) => {
    setRenewalFormData(prev => ({
      ...prev,
      paymentSubMode: selectedOption ? selectedOption.label : ''
    }));
    setRenewalError('');
  };

  // Handle bank location change for renewal form
  const handleRenewalBankChange = (selectedOption) => {
    setRenewalFormData(prev => ({
      ...prev,
      bankLocation: selectedOption ? selectedOption.label : ''
    }));
    setRenewalError('');
  };

  const handleSubmitRenewal = async () => {
    // Validate required fields
    const requiredFields = ['customerName', 'newPolicyNumber', 'newInsuranceCompany', 'newPremium', 'newStartDate', 'newExpiryDate', 'paymentMode'];
    const missingFields = requiredFields.filter(field => !renewalFormData[field]);
    
    if (missingFields.length > 0) {
      setRenewalError('Please fill in all required fields');
      return;
    }

    // If payment mode is Bank, validate additional fields
    if (renewalFormData.paymentMode === 'Bank') {
      if (!renewalFormData.paymentSubMode) {
        setRenewalError('Please select Payment Sub Mode for Bank payment');
        return;
      }
      if (!renewalFormData.bankLocation) {
        setRenewalError('Please select Bank Location for Bank payment');
        return;
      }
      if (!renewalFormData.paymentReference) {
        setRenewalError('Please enter Payment Reference for Bank payment');
        return;
      }
    }

    try {
      setRenewalLoading(true);
      
      const payload = {
        originalInsurance: renewalFormData.originalInsurance || '',
        customerName: renewalFormData.customerName,
        newPolicyNumber: renewalFormData.newPolicyNumber,
        newInsuranceCompany: renewalFormData.newInsuranceCompany,
        newPremium: parseFloat(renewalFormData.newPremium),
        newStartDate: renewalFormData.newStartDate,
        newExpiryDate: renewalFormData.newExpiryDate,
        paymentMode: renewalFormData.paymentMode,
        paymentSubMode: renewalFormData.paymentSubMode || '',
        bankLocation: renewalFormData.bankLocation || '',
        paymentReference: renewalFormData.paymentReference || '',
        remarks: renewalFormData.remarks || ''
      };
      
      await axiosInstance.post('/insurance-renewals', payload);
      
      showError('Insurance renewed successfully!');
      handleCloseRenewalModal();
      refreshTab(TAB.INSURANCE_RENEWAL);
      
    } catch (error) {
      console.error('Error renewing insurance:', error);
      setRenewalError(error.response?.data?.message || 'Failed to renew insurance');
    } finally {
      setRenewalLoading(false);
    }
  };

  // New Customer Insurance Renewal Handlers
  const handleOpenNewCustomerRenewalModal = () => {
    if (!canCreateRenewalTab && !canCreatePendingInsurance && !canCreateUpdateLater) {
      showError('You do not have permission to create insurance renewal');
      return;
    }
    setNewCustomerRenewalFormData({
      customerName: '',
      newPolicyNumber: '',
      newInsuranceCompany: '',
      newPremium: '',
      newStartDate: '',
      newExpiryDate: '',
      paymentMode: '',
      paymentSubMode: '',
      bankLocation: '',
      paymentReference: '',
      remarks: ''
    });
    setNewCustomerRenewalError('');
    setShowNewCustomerRenewalModal(true);
  };

  const handleCloseNewCustomerRenewalModal = () => {
    setShowNewCustomerRenewalModal(false);
    setNewCustomerRenewalFormData({
      customerName: '',
      newPolicyNumber: '',
      newInsuranceCompany: '',
      newPremium: '',
      newStartDate: '',
      newExpiryDate: '',
      paymentMode: '',
      paymentSubMode: '',
      bankLocation: '',
      paymentReference: '',
      remarks: ''
    });
    setNewCustomerRenewalError('');
  };

  const handleNewCustomerRenewalFormChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerRenewalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setNewCustomerRenewalError('');
  };

  // Handle payment mode change for new customer renewal form
  const handleNewCustomerPaymentModeChange = (e) => {
    const { value } = e.target;
    setNewCustomerRenewalFormData(prev => ({
      ...prev,
      paymentMode: value,
      paymentSubMode: '',
      bankLocation: '',
      paymentReference: ''
    }));
    setNewCustomerRenewalError('');
  };

  // Handle payment sub mode change for new customer renewal form
  const handleNewCustomerSubModeChange = (selectedOption) => {
    setNewCustomerRenewalFormData(prev => ({
      ...prev,
      paymentSubMode: selectedOption ? selectedOption.label : ''
    }));
    setNewCustomerRenewalError('');
  };

  // Handle bank location change for new customer renewal form
  const handleNewCustomerBankChange = (selectedOption) => {
    setNewCustomerRenewalFormData(prev => ({
      ...prev,
      bankLocation: selectedOption ? selectedOption.label : ''
    }));
    setNewCustomerRenewalError('');
  };

  // Handle insurance provider change for new customer renewal
  const handleNewCustomerProviderChange = (selectedOption) => {
    const providerName = selectedOption ? selectedOption.label : '';
    setNewCustomerRenewalFormData(prev => ({
      ...prev,
      newInsuranceCompany: providerName
    }));
    setNewCustomerRenewalError('');
  };

  const handleSubmitNewCustomerRenewal = async () => {
    // Validate required fields
    const requiredFields = ['customerName', 'newPolicyNumber', 'newInsuranceCompany', 'newPremium', 'newStartDate', 'newExpiryDate', 'paymentMode'];
    const missingFields = requiredFields.filter(field => !newCustomerRenewalFormData[field]);
    
    if (missingFields.length > 0) {
      setNewCustomerRenewalError('Please fill in all required fields');
      return;
    }

    // If payment mode is Bank, validate additional fields
    if (newCustomerRenewalFormData.paymentMode === 'Bank') {
      if (!newCustomerRenewalFormData.paymentSubMode) {
        setNewCustomerRenewalError('Please select Payment Sub Mode for Bank payment');
        return;
      }
      if (!newCustomerRenewalFormData.bankLocation) {
        setNewCustomerRenewalError('Please select Bank Location for Bank payment');
        return;
      }
      if (!newCustomerRenewalFormData.paymentReference) {
        setNewCustomerRenewalError('Please enter Payment Reference for Bank payment');
        return;
      }
    }

    try {
      setNewCustomerRenewalLoading(true);
      
      const payload = {
        customerName: newCustomerRenewalFormData.customerName,
        newPolicyNumber: newCustomerRenewalFormData.newPolicyNumber,
        newInsuranceCompany: newCustomerRenewalFormData.newInsuranceCompany,
        newPremium: parseFloat(newCustomerRenewalFormData.newPremium),
        newStartDate: newCustomerRenewalFormData.newStartDate,
        newExpiryDate: newCustomerRenewalFormData.newExpiryDate,
        paymentMode: newCustomerRenewalFormData.paymentMode,
        paymentSubMode: newCustomerRenewalFormData.paymentSubMode || '',
        bankLocation: newCustomerRenewalFormData.bankLocation || '',
        paymentReference: newCustomerRenewalFormData.paymentReference || '',
        remarks: newCustomerRenewalFormData.remarks || ''
      };
      
      await axiosInstance.post('/insurance-renewals', payload);
      
      showError('New customer insurance renewal created successfully!');
      handleCloseNewCustomerRenewalModal();
      refreshTab(TAB.INSURANCE_RENEWAL);
      
    } catch (error) {
      console.error('Error creating new customer insurance renewal:', error);
      setNewCustomerRenewalError(error.response?.data?.message || 'Failed to create insurance renewal');
    } finally {
      setNewCustomerRenewalLoading(false);
    }
  };

  // View Renewal Handler
  const handleViewRenewalClick = async (item) => {
    if (!canViewRenewalTab) {
      showError('You do not have permission to view renewal details');
      return;
    }
    try {
      const response = await axiosInstance.get(`/insurance-renewals/${item.id}`);
      if (response.data.success) {
        setSelectedRenewal(response.data.data);
        setShowViewRenewalModal(true);
      } else {
        showError('Failed to fetch renewal details');
      }
    } catch (error) {
      console.error('Error fetching renewal details:', error);
      showError(error);
    }
  };

  // Print Renewal Receipt Handler
  const handlePrintRenewalReceipt = (renewalItem) => {
    if (!canViewRenewalTab && !canCreateRenewalTab) {
      showError('You do not have permission to print renewal receipt');
      return;
    }
    try {
      const receiptHTML = generateRenewalReceiptHTML(renewalItem);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };
    } catch (error) {
      console.error('Error printing renewal receipt:', error);
      showError('Failed to print renewal receipt');
    }
  };

  // Generate Renewal Receipt HTML - Black & White only, with Logo
  const generateRenewalReceiptHTML = (renewalData) => {
    const {
      customerName = '',
      newPolicyNumber = '',
      newInsuranceCompany = '',
      newPremium = 0,
      newStartDate = '',
      newExpiryDate = '',
      paymentMode = '',
      paymentSubMode = '',
      bankLocation = '',
      paymentReference = '',
      remarks = '',
      createdAt = new Date().toISOString(),
      createdBy = { name: 'N/A' },
      branch = {},
      paymentDate = new Date().toISOString()
    } = renewalData;

    const premiumInWords = numberToWords(newPremium);
    const receiptDate = new Date(paymentDate).toLocaleDateString('en-GB');
    const receiptNumber = `REN-${new Date(createdAt).getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const status = renewalData.status || 'PENDING';
    const daysUntilExpiry = renewalData.daysUntilExpiry || 0;
    const isExpired = renewalData.isExpired || false;
    
    // Use branch data from API response
    const branchName = branch?.name || 'GANDHI TVS';
    const branchAddress = branch?.address || '';
    const branchCity = branch?.city || '';
    const branchState = branch?.state || '';
    const branchPincode = branch?.pincode || '';
    const branchPhone = branch?.phone || '7498903672';
    const branchGST = branch?.gst_number || '';

    // Build full address
    const fullAddress = [branchAddress, branchCity, branchState, branchPincode].filter(Boolean).join(', ');

    // Create a single receipt block
    const receiptBlock = (isDuplicate) => `
      <div class="receipt-copy">
        <div class="header-container">
          <div class="header-left">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo">
            <div class="header-text">${branchName}</div>
            <div class="dealer-info">
              Authorised Main Dealer: TVS Motor Company Ltd.<br>
              ${fullAddress || 'N/A'}<br>
              Phone: ${branchPhone}${branchGST ? ` | GSTIN: ${branchGST}` : ''}
            </div>
          </div>
          <div class="header-right">
            <div class="receipt-title">INSURANCE RENEWAL RECEIPT</div>
            <div><strong>Date:</strong> ${receiptDate}</div>
            <div><strong>Receipt No:</strong> ${receiptNumber}</div>
            <div><strong>Status:</strong> ${status}</div>
            <div><strong>Expiry:</strong> ${isExpired ? 'EXPIRED' : daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'N/A'}</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="customer-info-container">
          <div class="customer-info-left">
            <div class="customer-info-row"><strong>Customer Name:</strong> ${customerName || 'N/A'}</div>
            <div class="customer-info-row"><strong>Created By:</strong> ${createdBy?.name || 'N/A'}</div>
          </div>
          <div class="customer-info-right">
            <div class="customer-info-row"><strong>New Policy Number:</strong> ${newPolicyNumber || 'N/A'}</div>
            <div class="customer-info-row"><strong>New Insurance Company:</strong> ${newInsuranceCompany || 'N/A'}</div>
            <div class="customer-info-row"><strong>Start Date:</strong> ${newStartDate ? new Date(newStartDate).toLocaleDateString('en-GB') : 'N/A'}</div>
            <div class="customer-info-row"><strong>Expiry Date:</strong> ${newExpiryDate ? new Date(newExpiryDate).toLocaleDateString('en-GB') : 'N/A'}</div>
            <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode || 'N/A'}${paymentSubMode ? ` (${paymentSubMode})` : ''}${bankLocation ? ` - ${bankLocation}` : ''}</div>
            ${paymentReference ? `<div class="customer-info-row"><strong>Payment Reference:</strong> ${paymentReference}</div>` : ''}
          </div>
        </div>
        <div class="amount-box">
          <div class="amount-label">Premium Amount</div>
          <div class="amount">₹${(newPremium || 0).toFixed(2)}</div>
          <div class="amount-in-words">${premiumInWords || 'Zero'} Only</div>
        </div>
        ${remarks ? `
          <div class="remarks">
            <strong>Remarks:</strong> ${remarks}
          </div>
        ` : ''}
        <div class="divider"></div>
        <div class="signature-box">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div style="text-align:center; width: 22%;"><div class="signature-line"></div><div>Customer's Signature</div></div>
            <div style="text-align:center; width: 22%;"><div class="signature-line"></div><div>Insurance Executive</div></div>
            <div style="text-align:center; width: 22%;"><div class="signature-line"></div><div>Branch Manager</div></div>
            <div style="text-align:center; width: 22%;"><div class="signature-line"></div><div>Accountant</div></div>
          </div>
        </div>
        <div class="footer-text">Thank you for choosing ${branchName}</div>
      </div>
    `;

    return `<!DOCTYPE html>
    <html>
      <head>
        <title>Insurance Renewal Receipt - ${receiptNumber}</title>
        <style>
          @page { size: A4; margin: 10mm 12mm; }
          body { 
            font-family: Arial; 
            width: 100%; 
            margin: 0; 
            padding: 0; 
            font-size: 13px; 
            line-height: 1.3; 
            color: #333; 
          }
          .page { 
            width: 100%; 
            max-width: 190mm; 
            margin: 0 auto; 
          }
          .receipt-copy { 
            page-break-inside: avoid; 
            margin-bottom: 3mm;
            border: 1px solid #ddd;
            padding: 4mm;
          }
          .header-container { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 3mm; 
            align-items: flex-start; 
          }
          .header-left { 
            width: 55%; 
          }
          .header-right { 
            width: 45%; 
            text-align: right; 
            display: flex; 
            flex-direction: column; 
            align-items: flex-end; 
          }
          .logo { 
            width: 25mm; 
            height: auto; 
            margin-bottom: 2px; 
          }
          .header-text { 
            font-size: 16px; 
            font-weight: bold; 
            margin: 2px 0;
          }
          .dealer-info { 
            text-align: left; 
            font-size: 10px; 
            line-height: 1.2; 
            color: #555;
          }
          .receipt-title { 
            font-size: 14px; 
            font-weight: bold; 
            margin-bottom: 3px;
          }
          .divider { 
            border-top: 1px solid #AAAAAA; 
            margin: 2mm 0; 
          }
          .customer-info-container { 
            display: flex; 
            font-size: 12px; 
            margin: 3px 0;
          }
          .customer-info-left { 
            width: 50%; 
            padding-right: 5px;
          }
          .customer-info-right { 
            width: 50%; 
            padding-left: 5px;
          }
          .customer-info-row { 
            margin: 1.5px 0; 
            line-height: 1.3; 
          }
          .customer-info-row strong { 
            font-weight: 600; 
            display: inline-block;
            min-width: 100px;
          }
          .amount-box {
            text-align: center;
            padding: 8px;
            margin: 5px 0;
            border: 2px solid #333;
          }
          .amount-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
          }
          .amount {
            font-size: 24px;
            font-weight: 700;
          }
          .amount-in-words {
            font-size: 13px;
            margin-top: 3px;
            font-style: italic;
            color: #555;
          }
          .remarks {
            padding: 4px 8px;
            margin: 4px 0;
            background-color: #f8f9fa;
            border-left: 3px solid #333;
            font-size: 12px;
          }
          .signature-box { 
            margin-top: 3mm; 
            font-size: 9pt; 
          }
          .signature-line { 
            border-top: 1px dashed #000; 
            width: 36mm; 
            display: inline-block; 
            margin: 0 3mm; 
          }
          .footer-text {
            text-align: center;
            font-size: 10px;
            color: #666;
            margin-top: 3mm;
            font-style: italic;
          }
          .cutting-line { 
            border-top: 2px dashed #333; 
            margin: 6mm 0 4mm 0; 
            text-align: center; 
            position: relative; 
          }
          .cutting-line::before { 
            content: "✂ Cut Here ✂"; 
            position: absolute; 
            top: -11px; 
            left: 50%; 
            transform: translateX(-50%); 
            background: white; 
            padding: 0 12px; 
            font-size: 11px; 
            color: #666; 
            font-weight: bold;
          }
          @media print { 
            body { width: 100%; } 
            .no-print { display: none; } 
          }
          .receipt-copy { 
            page-break-inside: avoid; 
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${receiptBlock(false)}
          <div class="cutting-line"></div>
          ${receiptBlock(true)}
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 500); };
        </script>
      </body>
    </html>`;
  };

  // Export handlers
  const handleOpenExportModal = () => {
    if (activeTab === TAB.PENDING_INSURANCE && !canCreatePendingInsurance) {
      showError('You do not have permission to export from this tab');
      return;
    }
    if (activeTab === TAB.COMPLETE_INSURANCE && !canViewCompleteInsuranceTab) {
      showError('You do not have permission to export from this tab');
      return;
    }
    if (activeTab === TAB.UPDATE_LATER && !canCreateUpdateLater) {
      showError('You do not have permission to export from this tab');
      return;
    }
    if (activeTab === TAB.INSURANCE_RENEWAL && !canViewRenewalTab) {
      showError('You do not have permission to export from this tab');
      return;
    }
    setShowExportModal(true);
    setExportError('');
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setSelectedBranchId('');
    setExportError('');
  };

  const handleExportToExcel = async () => {
    if (activeTab === TAB.PENDING_INSURANCE && !canCreatePendingInsurance) {
      showError('You do not have permission to export from this tab');
      return;
    }
    if (activeTab === TAB.COMPLETE_INSURANCE && !canViewCompleteInsuranceTab) {
      showError('You do not have permission to export from this tab');
      return;
    }
    if (activeTab === TAB.UPDATE_LATER && !canCreateUpdateLater) {
      showError('You do not have permission to export from this tab');
      return;
    }
    if (activeTab === TAB.INSURANCE_RENEWAL && !canViewRenewalTab) {
      showError('You do not have permission to export from this tab');
      return;
    }

    setExportError('');
    
    if (!selectedBranchId) {
      setExportError('Please select a branch');
      return;
    }

    try {
      setExportLoading(true);
      
      let apiEndpoint = '';
      if (activeTab === TAB.PENDING_INSURANCE) {
        apiEndpoint = '/reports/insurance/pending';
      } else if (activeTab === TAB.COMPLETE_INSURANCE) {
        apiEndpoint = '/reports/insurance/complete';
      } else if (activeTab === TAB.UPDATE_LATER) {
        apiEndpoint = '/reports/insurance/later';
      } else if (activeTab === TAB.INSURANCE_RENEWAL) {
        apiEndpoint = '/reports/insurance/renewals';
      }

      const params = new URLSearchParams({
        branchId: selectedBranchId,
        format: 'excel'
      });

      const response = await axiosInstance.get(
        `${apiEndpoint}?${params.toString()}`,
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        if (!errorData.success && errorData.message) {
          setExportError(errorData.message);
          return;
        }
      }

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const branchName = branches.find(b => b._id === selectedBranchId)?.name || 'Branch';
      
      let tabName = '';
      if (activeTab === TAB.PENDING_INSURANCE) tabName = 'Pending_Insurance';
      else if (activeTab === TAB.COMPLETE_INSURANCE) tabName = 'Complete_Insurance';
      else if (activeTab === TAB.UPDATE_LATER) tabName = 'Update_Later';
      else if (activeTab === TAB.INSURANCE_RENEWAL) tabName = 'Insurance_Renewals';
      
      const fileName = `${tabName}_${branchName}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      showError('Excel exported successfully!');
      handleCloseExportModal();
      
    } catch (error) {
      console.error('Error exporting report:', error);
      
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(error.response.data);
          });
          
          const errorData = JSON.parse(text);
          
          if (errorData.message) {
            setExportError(errorData.message);
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setExportError('Failed to export report');
        }
      } else if (error.response?.data?.message) {
        setExportError(error.response.data.message);
      } else if (error.message) {
        setExportError(error.message);
      } else {
        setExportError('Failed to export report');
      }
      
    } finally {
      setExportLoading(false);
    }
  };

  const handleAddClick = (booking) => {
    if (!canCreatePendingInsurance) {
      showError('You do not have permission to add insurance');
      return;
    }
    setSelectedBooking(booking);
    setSelectedInsurance(null);
    setShowModal(true);
  };

  const handleViewBookingClick = (booking) => {
    setSelectedBookingForView(booking);
    setShowViewBookingModal(true);
  };

  const handleViewClick = async (item) => {
    try {
      const response = await axiosInstance.get(`/insurance/${item.id}`);
      setSelectedInsurance(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleUpdateClick = async (item) => {
    if (!canCreateUpdateLater) {
      showError('You do not have permission to update insurance');
      return;
    }
    try {
      const response = await axiosInstance.get(`/insurance/${item.id}`);
      setSelectedInsurance(response.data.data);
      setSelectedBooking(response.data.data.booking);
      setShowModal(true);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  // Pagination renderer
  const renderPagination = (tabIndex) => {
    const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
    if (!total || pages <= 1) return null;
    
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);
    
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
              onChange={e => handleLimitChange(tabIndex, e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            
            {pageNums.map(p => (
              <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(tabIndex, p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}
            
            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}
            
            <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // Table renderers
  const renderPendingTable = () => {
    if (!canViewPendingInsuranceTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Pending Insurance tab.
          </CAlert>
        </div>
      );
    }
    
    const { docs: currentRecords, loading, currentPage, limit, search } = tabData[TAB.PENDING_INSURANCE];
    const startRecord = (currentPage - 1) * limit + 1;
    
    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
                {canCreatePendingInsurance && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={canCreatePendingInsurance ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((booking, index) => (
                  <CTableRow key={booking._id || index}>
                    <CTableDataCell>{startRecord + index}</CTableDataCell>
                    <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                    <CTableDataCell>{booking.modelDetails?.model_name || ''}</CTableDataCell>
                    <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                    <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
                    <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
                    <CTableDataCell>{booking.engineNumber || booking.vehicle?.engineNumber || ''}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'danger' : 'success'} shape="rounded-pill">
                        {booking.insuranceStatus}
                      </CBadge>
                    </CTableDataCell>
                    {canCreatePendingInsurance && (
                      <CTableDataCell>
                        <div className="d-flex gap-1">
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handleViewBookingClick(booking)}
                            title="View Details"
                          >
                            <CIcon icon={cilZoom} className="me-1" />
                            View
                          </CButton>
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handleAddClick(booking)}
                            title="Add Insurance"
                          >
                            <CIcon icon={cilPlus} className="me-1" />
                            Add
                          </CButton>
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(TAB.PENDING_INSURANCE)}
      </>
    );
  };

  const renderCompletedTable = () => {
    if (!canViewCompleteInsuranceTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Complete Insurance tab.
          </CAlert>
        </div>
      );
    }
    
    const { docs: currentRecords, loading, currentPage, limit, search } = tabData[TAB.COMPLETE_INSURANCE];
    const startRecord = (currentPage - 1) * limit + 1;
    
    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Provider</CTableHeaderCell>
                <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((item, index) => (
                  <CTableRow key={item._id || index}>
                    <CTableDataCell>{startRecord + index}</CTableDataCell>
                    <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
                    <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                    <CTableDataCell>{item.insuranceProviderDetails?.provider_name || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.engineNumber || item.booking?.vehicle?.engineNumber || ''}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'} shape="rounded-pill">
                        {item.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-1">
                        <CButton 
                          size="sm" 
                          className="action-btn"
                          onClick={() => handleViewClick(item)}
                          title="View Details"
                        >
                          <CIcon icon={cilZoom} className="me-1" />
                          View
                        </CButton>
                        {(canCreateRenewalTab || canCreatePendingInsurance || canCreateUpdateLater) && (
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handleOpenRenewalModal({
                              id: item._id,
                              customerName: item.booking?.customerName || '',
                              customerMobile: item.booking?.customerMobile || '',
                              vehicleNumber: item.booking?.vehicleNumber || '',
                              chassisNumber: item.booking?.chassisNumber || '',
                              model: item.booking?.model?.model_name || '',
                              originalInsurance: {
                                PolicyNo: item.policyNumber || '',
                                PremiumAmount: item.premiumAmount || 0,
                                validUpto: item.validUpto || '',
                                InsuranceCompany: item.insuranceProviderDetails?.provider_name || ''
                              }
                            })}
                            title="Insurance Renewal"
                            color="info"
                          >
                            <CIcon icon={cilReload} className="me-1" />
                            Insurance Renewal
                          </CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(TAB.COMPLETE_INSURANCE)}
      </>
    );
  };

  const renderLaterTable = () => {
    if (!canViewUpdateLaterTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Update Later tab.
          </CAlert>
        </div>
      );
    }
    
    const { docs: currentRecords, loading, currentPage, limit, search } = tabData[TAB.UPDATE_LATER];
    const startRecord = (currentPage - 1) * limit + 1;
    
    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
                {canCreateUpdateLater && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={canCreateUpdateLater ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((item, index) => (
                  <CTableRow key={item._id || index}>
                    <CTableDataCell>{startRecord + index}</CTableDataCell>
                    <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
                    <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
                    <CTableDataCell>{item.booking?.engineNumber || item.booking?.vehicle?.engineNumber || ''}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={item.status === 'LATER' ? 'warning' : 'success'} shape="rounded-pill">
                        {item.status}
                      </CBadge>
                    </CTableDataCell>
                    {canCreateUpdateLater && (
                      <CTableDataCell>
                        <CButton 
                          size="sm" 
                          className="action-btn"
                          onClick={() => handleUpdateClick(item)}
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          Update
                        </CButton>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(TAB.UPDATE_LATER)}
      </>
    );
  };

  const renderRenewalTable = () => {
    // Check VIEW permission for Renewal tab
    if (!canViewRenewalTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Insurance Renewal tab.
          </CAlert>
        </div>
      );
    }
    
    const { docs: currentRecords, loading, currentPage, limit, search } = tabData[TAB.INSURANCE_RENEWAL];
    const startRecord = (currentPage - 1) * limit + 1;
    
    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">New Policy Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Insurance Company</CTableHeaderCell>
                <CTableHeaderCell scope="col">Premium Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Expiry Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((item, index) => (
                  <CTableRow key={item.id || item._id || index}>
                    <CTableDataCell>{startRecord + index}</CTableDataCell>
                    <CTableDataCell>{item.customerName || ''}</CTableDataCell>
                    <CTableDataCell>{item.newPolicyNumber || ''}</CTableDataCell>
                    <CTableDataCell>{item.newInsuranceCompany || ''}</CTableDataCell>
                    <CTableDataCell>{item.newPremium || ''}</CTableDataCell>
                    <CTableDataCell>{item.newStartDate ? new Date(item.newStartDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                    <CTableDataCell>{item.newExpiryDate ? new Date(item.newExpiryDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                    <CTableDataCell>{item.paymentMode || ''}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-1">
                        {canViewRenewalTab && (
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handleViewRenewalClick(item)}
                            title="View Details"
                          >
                            <CIcon icon={cilZoom} className="me-1" />
                            View
                          </CButton>
                        )}
                        {(canViewRenewalTab || canCreateRenewalTab) && (
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handlePrintRenewalReceipt(item)}
                            title="Print Receipt"
                            color="success"
                          >
                            <CIcon icon={cilPrint} className="me-1" />
                            Print Receipt
                          </CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(TAB.INSURANCE_RENEWAL)}
      </>
    );
  };

  if (!canViewInsuranceDetails) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Insurance Details.
      </div>
    );
  }

  // Check if any tab is loading for initial loading state
  const isAnyTabLoading = tabData[TAB.PENDING_INSURANCE].loading && 
    tabData[TAB.COMPLETE_INSURANCE].loading && 
    tabData[TAB.UPDATE_LATER].loading &&
    tabData[TAB.INSURANCE_RENEWAL].loading;

  if (isAnyTabLoading && !tabData[activeTab].docs.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Insurance Report</div>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className="d-flex gap-2">
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleOpenExportModal}
              title="Export to Excel"
            >
              <FontAwesomeIcon icon={faFileExcel} className='me-1' />
              Export Excel
            </CButton>
            {(canCreateRenewalTab || canCreatePendingInsurance || canCreateUpdateLater) && (
              <CButton 
                size="sm" 
                className="action-btn"
                onClick={handleOpenNewCustomerRenewalModal}
                title="New Customer Insurance Renewal"
                color="success"
              >
                <CIcon icon={cilUserPlus} className="me-1" />
                New Customer Insurance Renewal
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewPendingInsuranceTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === TAB.PENDING_INSURANCE}
                      onClick={() => handleTabChange(TAB.PENDING_INSURANCE)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === TAB.PENDING_INSURANCE ? '4px solid #2759a2' : '3px solid transparent',
                        color: 'black',
                        borderBottom: 'none'
                      }}
                    >
                      Pending Insurance
                      {!canCreatePendingInsurance && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompleteInsuranceTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === TAB.COMPLETE_INSURANCE}
                      onClick={() => handleTabChange(TAB.COMPLETE_INSURANCE)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === TAB.COMPLETE_INSURANCE ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Complete Insurance
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewUpdateLaterTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === TAB.UPDATE_LATER}
                      onClick={() => handleTabChange(TAB.UPDATE_LATER)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === TAB.UPDATE_LATER ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Update Later
                      {!canCreateUpdateLater && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewRenewalTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === TAB.INSURANCE_RENEWAL}
                      onClick={() => handleTabChange(TAB.INSURANCE_RENEWAL)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === TAB.INSURANCE_RENEWAL ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Insurance Renewal
                      {!canCreateRenewalTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              {/* Search bar - UNCONTROLLED input */}
              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <input
                    ref={searchInputRef}
                    type="text"
                    defaultValue=""
                    style={{
                      maxWidth: '350px',
                      height: '30px',
                      borderRadius: '0',
                      border: '1px solid #ced4da',
                      padding: '0 8px',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                    className="d-inline-block square-search"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search..."
                    autoComplete="off"
                    disabled={!canViewAnyTab}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewPendingInsuranceTab && (
                  <CTabPane visible={activeTab === TAB.PENDING_INSURANCE}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewCompleteInsuranceTab && (
                  <CTabPane visible={activeTab === TAB.COMPLETE_INSURANCE}>
                    {renderCompletedTable()}
                  </CTabPane>
                )}
                {canViewUpdateLaterTab && (
                  <CTabPane visible={activeTab === TAB.UPDATE_LATER}>
                    {renderLaterTable()}
                  </CTabPane>
                )}
                {canViewRenewalTab && (
                  <CTabPane visible={activeTab === TAB.INSURANCE_RENEWAL}>
                    {renderRenewalTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in Insurance Details.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {/* Add Insurance Modal */}
      <AddInsurance
        show={showModal}
        onClose={handleModalClose}
        bookingData={selectedBooking}
        insuranceData={selectedInsurance}
        onSuccess={handleRefresh}
      />
      
      {/* View Insurance Modal */}
      <ViewInsuranceModal 
        show={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        insuranceData={selectedInsurance} 
      />

      {/* View Booking Modal */}
      <ViewPendingBookingModal
        show={showViewBookingModal}
        onClose={() => {
          setShowViewBookingModal(false);
          setSelectedBookingForView(null);
        }}
        bookingData={selectedBookingForView}
      />

      {/* View Renewal Modal */}
      <ViewRenewalModal
        show={showViewRenewalModal}
        onClose={() => {
          setShowViewRenewalModal(false);
          setSelectedRenewal(null);
        }}
        renewalData={selectedRenewal}
      />

      {/* Insurance Renewal Modal (Existing Customer) */}
      <CModal alignment="center" visible={showRenewalModal} onClose={handleCloseRenewalModal} size="lg">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilReload} className="me-2" />
            Insurance Renewal
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {renewalError && (
            <CAlert color="danger" className="mb-3">
              {renewalError}
            </CAlert>
          )}
          
          <div className="row">
            {/* Original Insurance ID - Hidden field */}
            <input
              type="hidden"
              name="originalInsurance"
              value={renewalFormData.originalInsurance}
            />
            
            <div className="col-md-6 mb-3">
              <CFormLabel>Customer Name <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="text"
                name="customerName"
                value={renewalFormData.customerName}
                onChange={handleRenewalFormChange}
                placeholder="Enter customer name"
                required
                readOnly
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <CFormLabel>New Policy Number <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="text"
                name="newPolicyNumber"
                value={renewalFormData.newPolicyNumber}
                onChange={handleRenewalFormChange}
                placeholder="Enter new policy number"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <CFormLabel>New Insurance Company <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="text"
                name="newInsuranceCompany"
                value={renewalFormData.newInsuranceCompany}
                onChange={handleRenewalFormChange}
                placeholder="Enter new insurance company"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <CFormLabel>New Premium Amount <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="number"
                name="newPremium"
                value={renewalFormData.newPremium}
                onChange={handleRenewalFormChange}
                placeholder="Enter new premium amount"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-md-6 mb-3">
              <CFormLabel>New Start Date <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="date"
                name="newStartDate"
                value={renewalFormData.newStartDate}
                onChange={handleRenewalFormChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <CFormLabel>New Expiry Date <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="date"
                name="newExpiryDate"
                value={renewalFormData.newExpiryDate}
                onChange={handleRenewalFormChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <CFormLabel>Payment Mode <span className="text-danger">*</span></CFormLabel>
              <CFormSelect
                name="paymentMode"
                value={renewalFormData.paymentMode}
                onChange={handleRenewalPaymentModeChange}
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Cheque">Cheque</option>
              </CFormSelect>
            </div>

            {/* Bank Sub Payment Mode - Only shown when paymentMode is Bank */}
            {renewalFormData.paymentMode === 'Bank' && (
              <>
                <div className="col-md-6 mb-3">
                  <CFormLabel>Payment Sub Mode <span className="text-danger">*</span></CFormLabel>
                  <Select
                    classNamePrefix="react-select"
                    placeholder="-- Select Payment Sub Mode --"
                    isClearable
                    options={bankSubPaymentModes}
                    value={renewalFormData.paymentSubMode ? { value: renewalFormData.paymentSubMode, label: renewalFormData.paymentSubMode } : null}
                    onChange={handleRenewalSubModeChange}
                    styles={customSelectStyles}
                    isDisabled={loadingBankSubPaymentModes}
                    isLoading={loadingBankSubPaymentModes}
                    noOptionsMessage={() => "No payment sub modes available"}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <CFormLabel>Bank Location <span className="text-danger">*</span></CFormLabel>
                  <Select
                    classNamePrefix="react-select"
                    placeholder="-- Select Bank Location --"
                    isClearable
                    options={banks}
                    value={renewalFormData.bankLocation ? { value: renewalFormData.bankLocation, label: renewalFormData.bankLocation } : null}
                    onChange={handleRenewalBankChange}
                    styles={customSelectStyles}
                    isDisabled={loadingBanks}
                    isLoading={loadingBanks}
                    noOptionsMessage={() => "No banks available"}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <CFormLabel>Payment Reference <span className="text-danger">*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    name="paymentReference"
                    value={renewalFormData.paymentReference}
                    onChange={handleRenewalFormChange}
                    placeholder="Enter payment reference"
                    required
                  />
                </div>
              </>
            )}

            {/* Payment Reference for Cash and Cheque - optional */}
            {renewalFormData.paymentMode !== 'Bank' && renewalFormData.paymentMode !== '' && (
              <div className="col-md-6 mb-3">
                <CFormLabel>Payment Reference</CFormLabel>
                <CFormInput
                  type="text"
                  name="paymentReference"
                  value={renewalFormData.paymentReference}
                  onChange={handleRenewalFormChange}
                  placeholder="Enter payment reference (optional)"
                />
              </div>
            )}
            
            <div className="col-md-12 mb-3">
              <CFormLabel>Remarks</CFormLabel>
              <CFormInput
                type="text"
                name="remarks"
                value={renewalFormData.remarks}
                onChange={handleRenewalFormChange}
                placeholder="Enter any remarks"
              />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseRenewalModal}>
            Cancel
          </CButton>
          <CButton 
            className="submit-button"
            onClick={handleSubmitRenewal}
            disabled={renewalLoading}
          >
            {renewalLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Submitting...
              </>
            ) : 'Renew Insurance'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* New Customer Insurance Renewal Modal */}
      <CModal alignment="center" visible={showNewCustomerRenewalModal} onClose={handleCloseNewCustomerRenewalModal} size="lg">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilUserPlus} className="me-2" />
            New Customer Insurance Renewal
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {newCustomerRenewalError && (
            <CAlert color="danger" className="mb-3">
              {newCustomerRenewalError}
            </CAlert>
          )}
          
          {loadingModels || loadingProviders ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading data...</p>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabel>Customer Name <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  name="customerName"
                  value={newCustomerRenewalFormData.customerName}
                  onChange={handleNewCustomerRenewalFormChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel>New Policy Number <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  name="newPolicyNumber"
                  value={newCustomerRenewalFormData.newPolicyNumber}
                  onChange={handleNewCustomerRenewalFormChange}
                  placeholder="Enter new policy number"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel>New Insurance Company <span className="text-danger">*</span></CFormLabel>
                <Select
                  classNamePrefix="react-select"
                  placeholder="-- Select Insurance Provider --"
                  isClearable
                  options={insuranceProviders}
                  value={newCustomerRenewalFormData.newInsuranceCompany ? { value: newCustomerRenewalFormData.newInsuranceCompany, label: newCustomerRenewalFormData.newInsuranceCompany } : null}
                  onChange={handleNewCustomerProviderChange}
                  styles={customSelectStyles}
                  isDisabled={loadingProviders}
                  isLoading={loadingProviders}
                  noOptionsMessage={() => "No insurance providers available"}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel>New Premium Amount <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  name="newPremium"
                  value={newCustomerRenewalFormData.newPremium}
                  onChange={handleNewCustomerRenewalFormChange}
                  placeholder="Enter new premium amount"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel>New Start Date <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="date"
                  name="newStartDate"
                  value={newCustomerRenewalFormData.newStartDate}
                  onChange={handleNewCustomerRenewalFormChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel>New Expiry Date <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="date"
                  name="newExpiryDate"
                  value={newCustomerRenewalFormData.newExpiryDate}
                  onChange={handleNewCustomerRenewalFormChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel>Payment Mode <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="paymentMode"
                  value={newCustomerRenewalFormData.paymentMode}
                  onChange={handleNewCustomerPaymentModeChange}
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Cheque">Cheque</option>
                </CFormSelect>
              </div>

              {/* Bank Sub Payment Mode - Only shown when paymentMode is Bank */}
              {newCustomerRenewalFormData.paymentMode === 'Bank' && (
                <>
                  <div className="col-md-6 mb-3">
                    <CFormLabel>Payment Sub Mode <span className="text-danger">*</span></CFormLabel>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="-- Select Payment Sub Mode --"
                      isClearable
                      options={bankSubPaymentModes}
                      value={newCustomerRenewalFormData.paymentSubMode ? { value: newCustomerRenewalFormData.paymentSubMode, label: newCustomerRenewalFormData.paymentSubMode } : null}
                      onChange={handleNewCustomerSubModeChange}
                      styles={customSelectStyles}
                      isDisabled={loadingBankSubPaymentModes}
                      isLoading={loadingBankSubPaymentModes}
                      noOptionsMessage={() => "No payment sub modes available"}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <CFormLabel>Bank Location <span className="text-danger">*</span></CFormLabel>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="-- Select Bank Location --"
                      isClearable
                      options={banks}
                      value={newCustomerRenewalFormData.bankLocation ? { value: newCustomerRenewalFormData.bankLocation, label: newCustomerRenewalFormData.bankLocation } : null}
                      onChange={handleNewCustomerBankChange}
                      styles={customSelectStyles}
                      isDisabled={loadingBanks}
                      isLoading={loadingBanks}
                      noOptionsMessage={() => "No banks available"}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <CFormLabel>Payment Reference <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      type="text"
                      name="paymentReference"
                      value={newCustomerRenewalFormData.paymentReference}
                      onChange={handleNewCustomerRenewalFormChange}
                      placeholder="Enter payment reference"
                      required
                    />
                  </div>
                </>
              )}

              {/* Payment Reference for Cash and Cheque - optional */}
              {newCustomerRenewalFormData.paymentMode !== 'Bank' && newCustomerRenewalFormData.paymentMode !== '' && (
                <div className="col-md-6 mb-3">
                  <CFormLabel>Payment Reference</CFormLabel>
                  <CFormInput
                    type="text"
                    name="paymentReference"
                    value={newCustomerRenewalFormData.paymentReference}
                    onChange={handleNewCustomerRenewalFormChange}
                    placeholder="Enter payment reference (optional)"
                  />
                </div>
              )}
              
              <div className="col-md-12 mb-3">
                <CFormLabel>Remarks</CFormLabel>
                <CFormInput
                  type="text"
                  name="remarks"
                  value={newCustomerRenewalFormData.remarks}
                  onChange={handleNewCustomerRenewalFormChange}
                  placeholder="Enter any remarks"
                />
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseNewCustomerRenewalModal}>
            Cancel
          </CButton>
          <CButton 
            className="submit-button"
            onClick={handleSubmitNewCustomerRenewal}
            disabled={newCustomerRenewalLoading || loadingModels || loadingProviders}
          >
            {newCustomerRenewalLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Submitting...
              </>
            ) : 'Create Renewal'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Export Excel Modal */}
      <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal}>
        <CModalHeader>
          <CModalTitle>
            <FontAwesomeIcon icon={faFileExcel} className="me-2" />
            Select Branch for Export
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {exportError && (
            <CAlert color="warning" className="mb-3">
              {exportError}
            </CAlert>
          )}
          
          <div className="mb-3">
            <CFormLabel>Branch: <span className="text-danger">*</span></CFormLabel>
            <CFormSelect
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setExportError('');
              }}
              disabled={branches.length === 0}
            >
              <option value="">-- Select Branch --</option>
              {hasAllBranchAccess && <option value="all">All Branch</option>}
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseExportModal}>
            Cancel
          </CButton>
          <CButton 
            className="submit-button"
            onClick={handleExportToExcel}
            disabled={!selectedBranchId || exportLoading}
          >
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default InsuranceReport;