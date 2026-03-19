// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   confirmDelete,
//   showError,
//   showSuccess,
//   axiosInstance
// } from '../../utils/tableImports';
// import '../../css/importCsv.css';
// import '../../css/form.css';
// import ImportInwardCSV from '../../views/csv/ImportInwardCSV';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CFormTextarea,
//   CFormCheck,
//   CAlert,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSearch, cilSettings, cilPencil, cilTrash, cilCloudDownload, cilZoomOut, cilLockUnlocked, cilShare, cilPrint, cilCheck, cilX, cilInfo, cilWarning, cilCheckCircle, cilFile, cilChevronLeft, cilChevronRight } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import config from '../../config';
// import { useAuth } from '../../context/AuthContext';
// import AllocateVehicleModal from './AllocateVehicleModal';
// import tvsLogo from '../../assets/images/logo1.png';

// // Import date picker components
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import TextField from '@mui/material/TextField';
// import { enIN } from 'date-fns/locale';

// const StockList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [csvDialogOpen, setCsvDialogOpen] = useState(false);

//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [filterModalOpen, setFilterModalOpen] = useState(false);
//   const [filterType, setFilterType] = useState('');
//   const [filterBranchId, setFilterBranchId] = useState('');
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(100);
//   const [totalPages, setTotalPages] = useState(1);
//   const [displayedPages, setDisplayedPages] = useState([]);

//   const [unblockModalOpen, setUnblockModalOpen] = useState(false);
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);
//   const [unblockReason, setUnblockReason] = useState('');
//   const [unblockLoading, setUnblockLoading] = useState(false);
//   const [allocateModalOpen, setAllocateModalOpen] = useState(false);
//   const [selectedVehicleForAllocation, setSelectedVehicleForAllocation] = useState(null);
//   const [vehicleAllocationDetails, setVehicleAllocationDetails] = useState(null);

//   // New states for Print QR functionality
//   const [printQrModalOpen, setPrintQrModalOpen] = useState(false);
//   const [qrChassisModalOpen, setQrChassisModalOpen] = useState(false);
//   const [selectedChassisNumbers, setSelectedChassisNumbers] = useState([]);
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [qrPreviewData, setQrPreviewData] = useState([]);
//   const [qrLoading, setQrLoading] = useState(false);

//   // New state for import response modal
//   const [importResponseModalOpen, setImportResponseModalOpen] = useState(false);
//   const [importResponse, setImportResponse] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);

//   // States for Export Report functionality
//   const [exportReportModalOpen, setExportReportModalOpen] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedReportBranchId, setSelectedReportBranchId] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [exportReportError, setExportReportError] = useState('');
//   const [exportReportLoading, setExportReportLoading] = useState(false);

//   const { permissions = [], user } = useAuth();
//   const hasAllBranchAccess = user?.branchAccess === "ALL";
//   const navigate = useNavigate();

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '';
      
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return '';
//     }
//   };

//   // Format date to YYYY-MM-DD for API
//   const formatDateForAPI = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

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
//   const getCurrentRecords = () => {
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

//   // Page-level permission checks for Inward Stock page under Purchase module
//   const hasInwardStockView = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.VIEW
//   );
  
//   const hasInwardStockCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.CREATE
//   );
  
//   const hasInwardStockUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.UPDATE
//   );
  
//   const hasInwardStockDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.DELETE
//   );

//   // Using convenience functions for cleaner code
//   const canViewInwardStock = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
//   const canCreateInwardStock = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
//   const canUpdateInwardStock = canUpdateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
//   const canDeleteInwardStock = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  
//   // For export, you might need a specific permission or use CREATE permission
//   const canExportInwardStock = hasInwardStockCreate || canCreateInwardStock;
//   const canExportReport = canCreateInwardStock; // Using CREATE permission for report export

//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = localStorage.getItem('userRole') || 
//                    (storedUser.roles?.[0]?.name || '').toUpperCase();

//   // Check if user is SUPERADMIN
//   const isSuperAdmin = userRole === 'SUPERADMIN' || 
//                        (storedUser.roles?.[0]?.isSuperAdmin === true);

//   useEffect(() => {
//     if (!canViewInwardStock) {
//       showError('You do not have permission to view Inward Stock');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchData();
//     fetchBranches();
//   }, []);

//   useEffect(() => {
//     // Recalculate pagination when filteredData changes
//     calculatePagination(filteredData);
//   }, [filteredData, currentPage]);

//   const fetchData = async (type = '', filterBranchId = '') => {
//     try {
//       setLoading(true);
//       let url = '/vehicles';
//       const params = new URLSearchParams();
      
//       // Apply type filter if provided
//       if (type) {
//         params.append('type', type);
//       }
      
//       // Apply branch filter if explicitly provided in the modal
//       if (filterBranchId) {
//         // Only apply branch filter if explicitly selected in filter modal
//         params.append('location', filterBranchId);
//       }
      
//       // Add params to URL if any exist
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       const response = await axiosInstance.get(url);
//       const nonSoldVehicles = response.data.data.vehicles.filter(
//         (vehicle) => vehicle.status !== 'sold' && vehicle.status !== 'Sold' && vehicle.status !== 'SOLD'
//       );

//       setData(nonSoldVehicles);
//       setFilteredData(nonSoldVehicles);
//       setCurrentPage(1); // Reset to first page when data changes
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.log('Error fetching branches', error);
//     }
//   };

//   // Modified handleImportSuccess function to show response modal
//   const handleImportSuccess = (response) => {
//     if (!canCreateInwardStock) {
//       showError('You do not have permission to import vehicles');
//       return;
//     }
    
//     // Set import response and show modal
//     setImportResponse(response);
//     setImportResponseModalOpen(true);
    
//     // Refresh data if any vehicles were imported or updated
//     if (response?.data?.imported > 0 || response?.data?.updated > 0) {
//       fetchData();
//     }
//   };

//   // Reset functions
//   const resetExportModal = () => {
//     setSelectedType('');
//     setSelectedBranchId('');
//     setCsvDialogOpen(false);
//   };

//   const resetFilterModal = () => {
//     setFilterType('');
//     setFilterBranchId('');
//     setFilterModalOpen(false);
//   };

//   const resetUnblockModal = () => {
//     setUnblockReason('');
//     setSelectedVehicleId(null);
//     setUnblockModalOpen(false);
//   };

//   // Reset Print QR modal
//   const resetPrintQRModal = () => {
//     setPrintQrModalOpen(false);
//     setAvailableChassisNumbers([]);
//     setSelectedChassisNumbers([]);
//   };

//   // Reset QR Preview modal
//   const resetQRPreviewModal = () => {
//     setQrChassisModalOpen(false);
//     setQrPreviewData([]);
//   };

//   // Reset Import Response modal
//   const resetImportResponseModal = () => {
//     setImportResponse(null);
//     setImportResponseModalOpen(false);
//   };

//   // Reset Export Report modal
//   const resetExportReportModal = () => {
//     // setStartDate(null);
//     // setEndDate(null);
//     setSelectedReportBranchId('');
//     setExportReportError('');
//     setExportReportModalOpen(false);
//   };

//   // Handle Export Report
//   const handleExportReport = async () => {
//     if (!canExportReport) {
//       showError('You do not have permission to export reports');
//       return;
//     }
    
//     // Clear previous errors
//     setExportReportError('');
    
//     if (!selectedReportBranchId) {
//       setExportReportError('Please select a branch');
//       return;
//     }

//     // if (!startDate || !endDate) {
//     //   setExportReportError('Please select both start and end dates');
//     //   return;
//     // }

//     if (startDate > endDate) {
//       setExportReportError('Start date cannot be after end date');
//       return;
//     }

//     try {
//       setExportReportLoading(true);
      
//       const formattedStartDate = formatDateForAPI(startDate);
//       const formattedEndDate = formatDateForAPI(endDate);

//       // Build query parameters for the stock report API
//       const params = new URLSearchParams({
//         branchId: selectedReportBranchId,
//         modelType:selectedType,
//         // startDate: formattedStartDate,
//         // endDate: formattedEndDate,
//         format: 'excel'
//       });
//       const response = await axiosInstance.get(
//         `/reports/stock/current?${params.toString()}`,
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
//           setExportReportError(errorData.message);
//           showError(errorData.message);
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
      
//       // Generate filename with DD-MM-YYYY format
//       const branchName = branches.find(b => b._id === selectedReportBranchId)?.name || 'Branch';
//       const startDateStr = formatDate(startDate);
//       const endDateStr = formatDate(endDate);
//       const fileName = `Stock_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       window.URL.revokeObjectURL(url);

//       resetExportReportModal();
      
//     } catch (error) {
//       console.error('Error exporting stock report:', error);
      
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
//             setExportReportError(errorData.message);
//             showError(errorData.message);
//           }
//         } catch (parseError) {
//           console.error('Error parsing error response:', parseError);
//           setExportReportError('Failed to export stock report');
//           showError('Failed to export stock report');
//         }
//       } else if (error.response?.data?.message) {
//         // Regular error with message in response
//         setExportReportError(error.response.data.message);
//         showError(error.response.data.message);
//       } else if (error.message) {
//         // Network or other errors
//         setExportReportError(error.message);
//         showError(error.message);
//       } else {
//         setExportReportError('Failed to export stock report');
//         showError('Failed to export stock report');
//       }
      
//     } finally {
//       setExportReportLoading(false);
//     }
//   };

//   // Custom Import CSV component with response handling
//   const CustomImportCSV = () => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [importType, setImportType] = useState('ICE');
//     const [importBranchId, setImportBranchId] = useState('');

//     const handleFileChange = (e) => {
//       setSelectedFile(e.target.files[0]);
//     };

//     const handleImport = async () => {
//       if (!selectedFile) {
//         showError('Please select a file');
//         return;
//       }

//       if (!importBranchId) {
//         showError('Please select a branch');
//         return;
//       }

//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       setImportLoading(true);
//       try {
//         const response = await axiosInstance.post(
//           `/vehicles/import-excel?type=${importType}&branch_id=${importBranchId}`,
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
        
//         // Call the success handler with the response
//         handleImportSuccess(response.data);
        
//         // Reset file input
//         setSelectedFile(null);
//         document.getElementById('import-file-input').value = '';
        
//         // Reset import form
//         setImportType('ICE');
//         setImportBranchId('');
//       } catch (error) {
//         console.error('Import failed:', error);
//         showError(error.response?.data?.message || 'Failed to import Excel file');
//       } finally {
//         setImportLoading(false);
//       }
//     };

//     return (
//       <>
//         <CButton 
//           size="sm" 
//           className="action-btn me-1"
//           onClick={() => setCsvDialogOpen(true)}
//         >
//           <CIcon icon={cilCloudDownload} className='icon' /> Export Excel
//         </CButton>

//         <CButton 
//           size="sm" 
//           className="action-btn me-1"
//           onClick={() => {
//             // Clear any previous import response before opening modal
//             setImportResponse(null);
//             setImportResponseModalOpen(true);
//           }}
//         >
//           <CIcon icon={cilCloudDownload} className='icon' /> Import Excel
//         </CButton>

//         {/* Import Modal */}
//         <CModal visible={importResponseModalOpen} onClose={resetImportResponseModal}>
//           <CModalHeader>
//             <CModalTitle>Import Excel File</CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             <div className="mb-3">
//               <label className="form-label">Model Type:</label>
//               <CFormSelect
//                 value={importType}
//                 onChange={(e) => setImportType(e.target.value)}
//               >
//                 <option value="EV">EV</option>
//                 <option value="ICE">ICE</option>
//               </CFormSelect>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Branch:</label>
//               <CFormSelect
//                 value={importBranchId}
//                 onChange={(e) => setImportBranchId(e.target.value)}
//               >
//                 <option value="">-- Select Branch --</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Select Excel File:</label>
//               <CFormInput
//                 type="file"
//                 id="import-file-input"
//                 accept=".xlsx,.xls"
//                 onChange={handleFileChange}
//               />
//               <small className="text-muted">
//                 Supported formats: .xlsx, .xls
//               </small>
//             </div>

//             {selectedFile && (
//               <CAlert color="info">
//                 Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
//               </CAlert>
//             )}
//           </CModalBody>
//           <CModalFooter>
//             <CButton 
//               color="secondary" 
//               onClick={resetImportResponseModal}
//               disabled={importLoading}
//             >
//               Cancel
//             </CButton>
//             <CButton 
//               className='submit-button' 
//               onClick={handleImport}
//               disabled={!selectedFile || !importBranchId || importLoading}
//             >
//               {importLoading ? (
//                 <>
//                   <CSpinner size="sm" className="me-2" />
//                   Importing...
//                 </>
//               ) : (
//                 'Import'
//               )}
//             </CButton>
//           </CModalFooter>
//         </CModal>
//       </>
//     );
//   };

//   // Import Response Modal
//   const ImportResponseModal = () => {
//     if (!importResponse) return null;

//     const { status, message, data } = importResponse;
//     const isSuccess = status === 'success';
    
//     const stats = [
//       { label: 'Total Processed', value: data.totalProcessed, icon: cilInfo, color: 'info' },
//       { label: 'Successfully Imported', value: data.imported, icon: cilCheckCircle, color: 'success' },
//       { label: 'Updated', value: data.updated, icon: cilPencil, color: 'warning' },
//       { label: 'Skipped', value: data.skipped, icon: cilWarning, color: 'danger' },
//       { label: 'Model Color Validations', value: data.modelColorValidations, icon: cilCheck, color: 'primary' },
//       { label: 'Cache Size', value: data.cacheSize, icon: cilCloudDownload, color: 'secondary' }
//     ];

//     return (
//       <CModal visible={importResponseModalOpen} onClose={resetImportResponseModal} size="lg">
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={isSuccess ? cilCheckCircle : cilWarning} className={`me-2 text-${isSuccess ? 'success' : 'warning'}`} />
//             Import Results
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CAlert color={isSuccess ? 'success' : 'warning'} className="mb-4">
//             <h5 className="alert-heading">{message}</h5>
//             <p className="mb-0">Import process completed. Below are the details:</p>
//           </CAlert>

//           {/* Statistics Grid */}
//           <div className="row mb-4">
//             {stats.map((stat, index) => (
//               <div key={index} className="col-md-4 mb-3">
//                 <div className="card border-0 shadow-sm">
//                   <div className="card-body text-center">
//                     <CIcon icon={stat.icon} size="xl" className={`text-${stat.color} mb-2`} />
//                     <h3 className="card-title">{stat.value}</h3>
//                     <p className="card-text text-muted mb-0">{stat.label}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Errors Section */}
//           {data.errors && data.errors.length > 0 && (
//             <CAccordion className="mb-3">
//               <CAccordionItem itemKey="errors">
//                 <CAccordionHeader>
//                   <CIcon icon={cilWarning} className="me-2 text-danger" />
//                   Errors ({data.errors.length})
//                 </CAccordionHeader>
//                 <CAccordionBody>
//                   <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                     <ul className="list-group list-group-flush">
//                       {data.errors.map((error, index) => (
//                         <li key={index} className="list-group-item">
//                           <div className="d-flex">
//                             <span className="badge bg-danger me-2">{index + 1}</span>
//                             <span className="text-danger">{error}</span>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </CAccordionBody>
//               </CAccordionItem>
//             </CAccordion>
//           )}

//           {/* Summary */}
//           <div className="alert alert-info">
//             <h6 className="alert-heading">Summary:</h6>
//             <ul className="mb-0">
//               <li>Total rows processed: <strong>{data.totalProcessed}</strong></li>
//               <li>New vehicles imported: <strong>{data.imported}</strong></li>
//               <li>Existing vehicles updated: <strong>{data.updated}</strong></li>
//               <li>Rows skipped due to errors: <strong>{data.skipped}</strong></li>
//               {data.errors && data.errors.length > 0 && (
//                 <li>Please review the errors above and fix them in your Excel file before re-importing.</li>
//               )}
//             </ul>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={resetImportResponseModal}
//           >
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     );
//   };

//   // Function to open chassis selection modal for Print QR
//   const handleOpenPrintQR = () => {
//     if (!canViewInwardStock) {
//       showError('You do not have permission to print QR codes');
//       return;
//     }
    
//     // Get all available chassis numbers from filteredData
//     const chassisList = filteredData.map(vehicle => ({
//       chassisNumber: vehicle.chassisNumber,
//       id: vehicle._id || vehicle.id,
//       modelName: vehicle.modelName || '',
//       selected: false
//     }));
    
//     setAvailableChassisNumbers(chassisList);
//     setSelectedChassisNumbers([]);
//     setPrintQrModalOpen(true);
//   };

//   // Function to toggle chassis selection
//   const toggleChassisSelection = (chassisNumber) => {
//     setAvailableChassisNumbers(prev => 
//       prev.map(item => 
//         item.chassisNumber === chassisNumber 
//           ? { ...item, selected: !item.selected }
//           : item
//       )
//     );

//     setSelectedChassisNumbers(prev => {
//       if (prev.includes(chassisNumber)) {
//         return prev.filter(num => num !== chassisNumber);
//       } else {
//         if (prev.length < 9) {
//           return [...prev, chassisNumber];
//         } else {
//           showError('Maximum 9 chassis numbers can be selected');
//           return prev;
//         }
//       }
//     });
//   };

//   // Function to select all chassis (max 9)
//   const selectAllChassis = () => {
//     const maxSelect = Math.min(availableChassisNumbers.length, 9);
//     const selected = availableChassisNumbers.slice(0, maxSelect).map(item => item.chassisNumber);
    
//     setAvailableChassisNumbers(prev => 
//       prev.map((item, index) => ({
//         ...item,
//         selected: index < maxSelect
//       }))
//     );
    
//     setSelectedChassisNumbers(selected);
//   };

//   // Function to clear all selections
//   const clearAllSelections = () => {
//     setAvailableChassisNumbers(prev => 
//       prev.map(item => ({ ...item, selected: false }))
//     );
//     setSelectedChassisNumbers([]);
//   };

//   // Function to proceed to QR preview
//   const handleProceedToQRPreview = () => {
//     if (selectedChassisNumbers.length === 0) {
//       showError('Please select at least one chassis number');
//       return;
//     }
    
//     // Find the vehicle data for selected chassis numbers
//     const selectedVehicles = filteredData.filter(vehicle => 
//       selectedChassisNumbers.includes(vehicle.chassisNumber)
//     );
    
//     setQrPreviewData(selectedVehicles);
//     setPrintQrModalOpen(false);
//     setQrChassisModalOpen(true);
//   };

//   // Function to generate QR print HTML
//   const generateQRPrintHTML = (vehicles) => {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Print QR Codes</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 20px;
//             background-color: #fff;
//           }
//           .page {
//             width: 210mm;
//             margin: 0 auto;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 20px;
//             padding-bottom: 10px;
//             border-bottom: 2px solid #000;
//           }
//           .header img {
//             height: 60px;
//           }
//           .header h1 {
//             margin: 10px 0;
//             color: #333;
//             font-size: 24px;
//           }
//           .qr-grid {
//             display: grid;
//             grid-template-columns: repeat(3, 1fr);
//             gap: 20px;
//             margin-bottom: 20px;
//           }
//           .qr-item {
//             text-align: center;
//             padding: 10px;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//             page-break-inside: avoid;
//           }
//           .qr-image {
//             width: 120px;
//             height: 120px;
//             object-fit: contain;
//             margin-bottom: 10px;
//           }
//           .chassis-number {
//             font-weight: bold;
//             color: #333;
//             margin-top: 5px;
//             font-size: 12px;
//             word-break: break-all;
//           }
//           .model-name {
//             color: #666;
//             font-size: 11px;
//             margin-bottom: 5px;
//           }
//           .footer {
//             text-align: center;
//             margin-top: 30px;
//             padding-top: 10px;
//             border-top: 1px solid #ddd;
//             color: #666;
//             font-size: 12px;
//           }
//           @media print {
//             body {
//               padding: 0;
//             }
//             .page {
//               width: 100%;
//             }
//             .qr-grid {
//               page-break-inside: avoid;
//             }
//             .qr-item {
//               border: 1px solid #000;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="page">
//           <div class="header">
//             <img src="${tvsLogo}" alt="TVS Logo" />
//             <h1>QR Codes - Inward Stock</h1>
//             <p>Total QR Codes: ${vehicles.length} | Printed on: ${new Date().toLocaleDateString()}</p>
//           </div>
          
//           <div class="qr-grid">
//             ${vehicles.map((vehicle, index) => {
//               const qrUrl = vehicle.qrCode ? `${config.baseURL || ''}${vehicle.qrCode}` : '';
//               return `
//                 <div class="qr-item">
//                   ${qrUrl ? `<img src="${qrUrl}" class="qr-image" alt="QR Code" />` : '<div class="qr-image">No QR</div>'}
//                   <div class="model-name">${vehicle.modelName || ''}</div>
//                   <div class="chassis-number">${vehicle.chassisNumber || '-'}</div>
//                 </div>
//               `;
//             }).join('')}
//           </div>
          
//           <div class="footer">
//             <p>Generated by TVS Inventory Management System</p>
//           </div>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(function() {
//               window.close();
//             }, 100);
//           };
//         </script>
//       </body>
//       </html>
//     `;
//   };

//   // Function to handle QR printing
//   const handlePrintQRs = () => {
//     if (qrPreviewData.length === 0) {
//       showError('No QR codes to print');
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=800,height=600');
//     printWindow.document.write(generateQRPrintHTML(qrPreviewData));
//     printWindow.document.close();
//   };

//   const handlePrintQR = (vehicle) => {
//     if (!canViewInwardStock) {
//       showError('You do not have permission to print QR codes');
//       return;
//     }
    
//     const qrUrl = vehicle.qrCode
//       ? `${config.baseURL || ''}${vehicle.qrCode}`
//       : '';
  
//     const printWindow = window.open('', '_blank', 'width=400,height=500');
  
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print QR</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               text-align: center,
//               padding: 20px,
//             }
//             .qr-container {
//               border: 1px solid #000,
//               padding: 15px,
//               width: 400px,
//               margin: auto,
//             }
//             img {
//               width: 250px,
//               height: 250px,
//               margin-bottom: 10px,
//             }
//             .label {
//               font-weight: bold,
//               margin-top: 8px,
//             }
//             .value {
//               margin-bottom: 6px,
//             }
//           </style>
//         </head>
//         <body>
//           <div class="qr-container">
//             ${qrUrl ? `<img src="${qrUrl}" />` : '<p>No QR Available</p>'}

//             <div class="label">Chassis Number</div>
//             <div class="value">${vehicle.chassisNumber || '-'}</div>

//             <div class="label">Model Name</div>
//             <div class="value">${vehicle.modelName || '-'}</div>

//             <div class="label">Key Number</div>
//             <div class="value">${vehicle.keyNumber || '-'}</div>
//           </div>

//           <script>
//             window.onload = function () {
//               window.print();
//               window.onafterprint = window.close;
//             }
//           </script>
//         </body>
//       </html>
//     `);
  
//     printWindow.document.close();
//   };

//   const handleClick = (event, id) => {
//     if (!canViewInwardStock && !canUpdateInwardStock && !canDeleteInwardStock) {
//       showError('You do not have permission to access this menu');
//       return;
//     }
    
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleUnblockClick = (vehicleId) => {
//     if (!canUpdateInwardStock) {
//       showError('You do not have permission to unblock vehicles');
//       return;
//     }
//     setSelectedVehicleId(vehicleId);
//     setUnblockModalOpen(true);
//     handleClose();
//   };

//   const handleUnblockSubmit = async () => {
//     if (!canUpdateInwardStock) {
//       showError('You do not have permission to unblock vehicles');
//       return;
//     }

//     if (!unblockReason.trim()) {
//       showError('Please enter a reason for unblocking');
//       return;
//     }

//     setUnblockLoading(true);
//     try {
//       await axiosInstance.put(
//         `/vehicles/unblock-and-assign/${selectedVehicleId}`,
//         {
//           reason: unblockReason
//         }
//       );
      
//       showSuccess('Vehicle unblocked successfully!');

//       setUnblockReason('');
//       setUnblockModalOpen(false);
//       setSelectedVehicleId(null);
//       fetchData();
//     } catch (error) {
//       console.error('Error unblocking vehicle:', error);
//       showError(error.response?.data?.message || 'Failed to unblock vehicle');
//     } finally {
//       setUnblockLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!canDeleteInwardStock) {
//       showError('You do not have permission to delete vehicles');
//       return;
//     }

//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/vehicles/${id}`);
//         setData(data.filter((vehicle) => (vehicle._id || vehicle.id) !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const applyFilter = () => {
//     if (filterType && filterBranchId) {
//       fetchData(filterType, filterBranchId);
//       setIsFilterApplied(true);
//       setFilterModalOpen(false);
//     } else {
//       showError('Please select both type and branch to apply filter');
//     }
//   };

//   const clearFilter = () => {
//     setFilterType('');
//     setFilterBranchId('');
//     setIsFilterApplied(false);
//     fetchData();
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('inward'));
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const addNewStock = () => {
//     if (!canCreateInwardStock) {
//       showError('You do not have permission to add new stock');
//       return;
//     }
//     navigate('/inward-stock');
//   };

//   const handleExportExcel = async () => {
//     if (!canExportInwardStock) {
//       showError('You do not have permission to export data');
//       return;
//     }

//     if (!selectedType) {
//       showError('Please select a type.');
//       return;
//     }
//     if (!selectedBranchId) {
//       showError('Please select a branch.');
//       return;
//     }

//     setExportLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         `/vehicles/export-excel?&type=${selectedType}&branch_id=${selectedBranchId}`,
//         {
//           responseType: 'blob'
//         }
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `exported_data_${selectedType}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       setCsvDialogOpen(false);
//       setSelectedType('');
//       setSelectedBranchId('');
//       showSuccess('Excel exported successfully!');
//     } catch (error) {
//       console.error('Excel export failed:', error);
//       showError('Failed to export Excel.');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Function to open Export Report modal
//   const handleOpenExportReport = () => {
//     if (!canExportReport) {
//       showError('You do not have permission to export reports');
//       return;
//     }
    
//     setExportReportModalOpen(true);
//     setExportReportError('');
//   };

//   const isVehicleBlocked = (status) => {
//     return status?.toLowerCase() === 'blocked';
//   };
  
//   const isVehicleBooked = (status) => {
//     return status?.toLowerCase() === 'booked';
//   };
  
//   const isVehicleBlockedOrBooked = (status) => {
//     return isVehicleBlocked(status) || isVehicleBooked(status);
//   };
  
//   const isVehicleFriz = (status) => {
//     return status?.toUpperCase() === 'FROZEN';
//   };

//   const handleAllocateClick = (vehicle) => {
//     if (!canUpdateInwardStock) {
//       showError('You do not have permission to allocate vehicles');
//       return;
//     }

//     const extractId = (item) => {
//       if (!item) return '';
//       if (typeof item === 'object') {
//         return item._id || item.id || '';
//       }
//       return item;
//     };

//     const vehicleDetails = {
//       vehicleId: vehicle._id || vehicle.id,
//       modelName: vehicle.modelName || '',
//       colorName: vehicle.color?.name || vehicle.color?.id || vehicle.color || '',
//       chassisNumber: vehicle.chassisNumber || '',
//       locationName: vehicle.unloadLocation?.name || vehicle.subdealerLocation?.name || '',
//       modelId: extractId(vehicle.model),
//       colorId: extractId(vehicle.color),
//       locationId: extractId(vehicle.unloadLocation || vehicle.subdealerLocation)
//     };
    
//     console.log('Vehicle details for allocation:', vehicleDetails);
    
//     setVehicleAllocationDetails(vehicleDetails);
//     setSelectedVehicleForAllocation(vehicle._id || vehicle.id);
//     setAllocateModalOpen(true);
//     handleClose();
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewInwardStock) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Inward Stock.
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
//       <div className='title'>Inwarded Stock</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateInwardStock && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={addNewStock}
//               >
//                 <CIcon icon={cilPlus} className='icon' /> New Stock
//               </CButton>
//             )}
            
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setFilterModalOpen(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
            
//             {isFilterApplied && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={clearFilter}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
           
//             {canCreateInwardStock && (
//               <CustomImportCSV />
//             )}

//             {/* Print QR Button */}
//             {canCreateInwardStock && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleOpenPrintQR}
//               >
//                 <CIcon icon={cilPrint} className='icon' /> Print QR
//               </CButton>
//             )}

//             {/* Export Report Button */}
//             {canExportReport && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleOpenExportReport}
//                 title="Export Stock Report"
//               >
//                 <CIcon icon={cilFile} className='icon' /> Export Report
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
//                   <CTableHeaderCell>Unload Location</CTableHeaderCell>
//                   <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis No</CTableHeaderCell>
//                   <CTableHeaderCell>QR Code</CTableHeaderCell>
//                   <CTableHeaderCell>Current Status</CTableHeaderCell>
//                   {(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) && (
//                     <CTableHeaderCell>Action</CTableHeaderCell>
//                   )}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {getCurrentRecords().length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell 
//                       colSpan={(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) ? "11" : "10"} 
//                       className="text-center"
//                     >
//                       No inward details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   getCurrentRecords().map((vehicle, index) => {
//                     const vehicleId = vehicle._id || vehicle.id;
//                     const globalIndex = (currentPage - 1) * recordsPerPage + index + 1;
//                     return (
//                       <CTableRow key={index}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{vehicle.unloadLocation?.name || vehicle.subdealerLocation?.name}</CTableDataCell>
//                         <CTableDataCell>{formatDate(vehicle.createdAt)}</CTableDataCell>
//                         <CTableDataCell>{vehicle.type}</CTableDataCell>
//                         <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                         <CTableDataCell>{vehicle.color?.name || vehicle.color?.id}</CTableDataCell>
//                         <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                         <CTableDataCell>
//                           {vehicle.qrCode && (
//                             <a
//                               href={`${config.baseURL || ''}${vehicle.qrCode}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               style={{ display: 'inline-block' }}
//                             >
//                               <img
//                                 src={`${config.baseURL || ''}${vehicle.qrCode}`}
//                                 alt="QR Code"
//                                 style={{
//                                   maxWidth: '100px',
//                                   maxHeight: '50px',
//                                   objectFit: 'contain',
//                                   cursor: 'pointer'
//                                 }}
//                               />
//                             </a>
//                           )}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge color={
//                             vehicle.status?.toLowerCase() === 'available' ? 'success' :
//                             vehicle.status?.toLowerCase() === 'blocked' ? 'danger' :
//                             vehicle.status?.toLowerCase() === 'booked' ? 'warning' :
//                             'warning'
//                           }>
//                             {vehicle.status}
//                           </CBadge>
//                         </CTableDataCell>
                        
//                         {(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) && (
//                           <CTableDataCell>
//                             <CButton
//                               size="sm"
//                               className='option-button btn-sm'
//                               onClick={(event) => handleClick(event, vehicleId)}
//                               disabled={!canViewInwardStock && !canUpdateInwardStock && !canDeleteInwardStock}
//                             >
//                               <CIcon icon={cilSettings} />
//                               Options
//                             </CButton>
//                             <Menu 
//                               id={`action-menu-${vehicleId}`} 
//                               anchorEl={anchorEl} 
//                               open={menuId === vehicleId} 
//                               onClose={handleClose}
//                             >
//                               {/* Updated: Show Unblock for both Blocked and Booked status */}
//                               {canUpdateInwardStock && isVehicleBlockedOrBooked(vehicle.status) && (
//                                 <MenuItem onClick={() => handleUnblockClick(vehicleId)}>
//                                   <CIcon icon={cilLockUnlocked} className="me-2" />Unblock
//                                 </MenuItem>
//                               )}
                              
//                               {canUpdateInwardStock && isVehicleFriz(vehicle.status) && (
//                                 <MenuItem onClick={() => handleAllocateClick(vehicle)}>
//                                   <CIcon icon={cilShare} className="me-2" />Allocate
//                                 </MenuItem>
//                               )}
                              
//                               {canDeleteInwardStock && (
//                                 <MenuItem onClick={() => handleDelete(vehicleId)}>
//                                   <CIcon icon={cilTrash} className="me-2" />Delete
//                                 </MenuItem>
//                               )}
                              
//                               {canCreateInwardStock && (
//                                 <MenuItem onClick={() => handlePrintQR(vehicle)}>
//                                   <CIcon icon={cilPrint} className="me-2" />
//                                   Print QR
//                                 </MenuItem>
//                               )}
//                             </Menu>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {/* Pagination Component */}
//           {filteredData.length > recordsPerPage && (
//             <div className="mt-4">
//               <CPagination align="center" aria-label="Page navigation example">
//                 {/* Previous Button */}
//                 <CPaginationItem 
//                   aria-label="Previous" 
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={currentPage === 1 ? 'disabled' : ''}
//                 >
//                   <CIcon icon={cilChevronLeft} />
//                 </CPaginationItem>
                
//                 {/* First Page */}
//                 {currentPage > 3 && totalPages > 5 && (
//                   <>
//                     <CPaginationItem 
//                       onClick={() => handlePageChange(1)}
//                       active={currentPage === 1}
//                     >
//                       1
//                     </CPaginationItem>
//                     {currentPage > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//                   </>
//                 )}
                
//                 {/* Page Numbers */}
//                 {displayedPages.map(page => (
//                   <CPaginationItem 
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     active={currentPage === page}
//                   >
//                     {page}
//                   </CPaginationItem>
//                 ))}
                
//                 {/* Last Page */}
//                 {currentPage < totalPages - 2 && totalPages > 5 && (
//                   <>
//                     {currentPage < totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//                     <CPaginationItem 
//                       onClick={() => handlePageChange(totalPages)}
//                       active={currentPage === totalPages}
//                     >
//                       {totalPages}
//                     </CPaginationItem>
//                   </>
//                 )}
                
//                 {/* Next Button */}
//                 <CPaginationItem 
//                   aria-label="Next" 
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={currentPage === totalPages ? 'disabled' : ''}
//                 >
//                   <CIcon icon={cilChevronRight} />
//                 </CPaginationItem>
//               </CPagination>
              
//               {/* Pagination Info */}
//               <div className="text-center text-muted mt-2">
//                 Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} entries
//               </div>
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Unblock Modal */}
//       <CModal visible={unblockModalOpen} onClose={resetUnblockModal}>
//         <CModalHeader>
//           <CModalTitle>Unblock Vehicle</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Reason for Unblocking<span className='required'>*</span></label>
//             <CFormTextarea
//               value={unblockReason}
//               onChange={(e) => setUnblockReason(e.target.value)}
//               rows={3}
//               required
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={resetUnblockModal}
//             disabled={unblockLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             className='submit-button'
//             onClick={handleUnblockSubmit}
//             disabled={unblockLoading}
//           >
//             {unblockLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Unblocking...
//               </>
//             ) : (
//               'Unblock Vehicle'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Filter Modal */}
//       <CModal visible={filterModalOpen} onClose={resetFilterModal}>
//         <CModalHeader>
//           <CModalTitle>Filter Vehicles</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Type:</label>
//             <CFormSelect
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//             >
//               <option value="">-- Select Type --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Branch:</label>
//             <CFormSelect
//               value={filterBranchId}
//               onChange={(e) => setFilterBranchId(e.target.value)}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className='submit-button' onClick={applyFilter}>
//             Search
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Excel Modal */}
//       <CModal visible={csvDialogOpen} onClose={resetExportModal}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Model Type:</label>
//             <CFormSelect
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//             >
//               <option value="">-- Select Model Type --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Branch:</label>
//             <CFormSelect
//               value={selectedBranchId}
//               onChange={(e) => setSelectedBranchId(e.target.value)}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className='submit-button' 
//             onClick={handleExportExcel}
//             disabled={exportLoading}
//           >
//             {exportLoading ? 'Exporting...' : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Export Report Modal */}
//       <CModal alignment="center" visible={exportReportModalOpen} onClose={resetExportReportModal}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Export Stock Report
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>

//           {exportReportError && (
//             <CAlert color="warning" className="mb-3">
//               {exportReportError}
//             </CAlert>
//           )}
          
//           <LocalizationProvider 
//             dateAdapter={AdapterDateFns} 
//             adapterLocale={enIN} 
//           >
    
//           </LocalizationProvider>
//           <div className="mb-3">
//       <label className="form-label">Model Type:</label>
//       <CFormSelect
//         value={selectedType}
//         onChange={(e) => {
//           setSelectedType(e.target.value);
//           setExportReportError('');
//         }}
//         disabled={!canExportReport}
//       >
//         <option value="">-- Select Model Type --</option>
//         <option value="EV">EV</option>
//         <option value="ICE">ICE</option>
//       </CFormSelect>
//     </div>
          


//            <div className="mb-3">
//       <label className="form-label">Branch:</label>
//       <CFormSelect
//         value={selectedReportBranchId}
//         onChange={(e) => {
//           setSelectedReportBranchId(e.target.value);
//           setExportReportError('');
//         }}
//         disabled={!canExportReport}
//       >
//         <option value="">-- Select Branch --</option>
//         {hasAllBranchAccess && (
//           <option value="all">All Branches</option>
//         )}
//         {branches.map((branch) => (
//           <option key={branch._id} value={branch._id}>
//             {branch.name}
//           </option>
//         ))}
//       </CFormSelect>
//     </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={resetExportReportModal}
//             disabled={exportReportLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             className="submit-button"
//             onClick={handleExportReport}
//             disabled={!selectedReportBranchId || !canExportReport || exportReportLoading}
//           >
//             {exportReportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : 'Export'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Response Modal */}
//       <ImportResponseModal />

//       {/* Print QR Selection Modal */}
//       <CModal visible={printQrModalOpen} onClose={resetPrintQRModal} size="lg">
//         <CModalHeader>
//           <CModalTitle>Select Chassis Numbers for QR Printing</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <span className="badge bg-primary">Selected: {selectedChassisNumbers.length}/9</span>
//                 <small className="text-muted ms-2">(Maximum 9 chassis numbers allowed)</small>
//               </div>
//               <div>
//                 <CButton size="sm" className="me-2" onClick={selectAllChassis}>
//                   <CIcon icon={cilCheck} className="me-1" /> Select All (Max 9)
//                 </CButton>
//                 <CButton size="sm" color="secondary" onClick={clearAllSelections}>
//                   <CIcon icon={cilX} className="me-1" /> Clear All
//                 </CButton>
//               </div>
//             </div>
            
//             {availableChassisNumbers.length === 0 ? (
//               <div className="alert alert-info">
//                 No chassis numbers available for selection.
//               </div>
//             ) : (
//               <div className="chassis-selection-grid" style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
//                 gap: '10px',
//                 maxHeight: '400px',
//                 overflowY: 'auto',
//                 padding: '10px',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '5px'
//               }}>
//                 {availableChassisNumbers.map((item, index) => (
//                   <div 
//                     key={index} 
//                     className={`chassis-item p-3 border rounded ${item.selected ? 'border-primary bg-light' : ''}`}
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => toggleChassisSelection(item.chassisNumber)}
//                   >
//                     <div className="d-flex align-items-center">
//                       <CFormCheck
//                         checked={item.selected}
//                         onChange={() => toggleChassisSelection(item.chassisNumber)}
//                         className="me-2"
//                       />
//                       <div>
//                         <div className="fw-bold">{item.chassisNumber}</div>
//                         <small className="text-muted">{item.modelName}</small>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetPrintQRModal}>
//             Cancel
//           </CButton>
//           <CButton 
//             className='submit-button' 
//             onClick={handleProceedToQRPreview}
//             disabled={selectedChassisNumbers.length === 0}
//           >
//             Next <CIcon icon={cilPrint} className="ms-1" />
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* QR Preview and Print Modal */}
//       <CModal visible={qrChassisModalOpen} onClose={resetQRPreviewModal} fullscreen>
//         <CModalHeader>
//           <CModalTitle>QR Codes Preview ({qrPreviewData.length} items)</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {qrLoading ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading QR codes...</p>
//             </div>
//           ) : (
//             <div className="qr-preview-container">
//               <div className="qr-grid" style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(3, 1fr)',
//                 gap: '20px',
//                 marginBottom: '20px'
//               }}>
//                 {qrPreviewData.map((vehicle, index) => {
//                   const qrUrl = vehicle.qrCode ? `${config.baseURL || ''}${vehicle.qrCode}` : '';
//                   return (
//                     <div key={index} className="qr-preview-item text-center p-3 border rounded">
//                       {qrUrl ? (
//                         <img 
//                           src={qrUrl} 
//                           alt="QR Code" 
//                           style={{
//                             width: '150px',
//                             height: '150px',
//                             objectFit: 'contain',
//                             marginBottom: '10px'
//                           }}
//                         />
//                       ) : (
//                         <div className="d-flex align-items-center justify-content-center" style={{
//                           width: '150px',
//                           height: '150px',
//                           backgroundColor: '#f8f9fa',
//                           margin: '0 auto 10px',
//                           border: '1px dashed #dee2e6'
//                         }}>
//                           <span className="text-muted">No QR</span>
//                         </div>
//                       )}
//                       <div className="fw-bold text-truncate">{vehicle.chassisNumber}</div>
//                       <small className="text-muted">{vehicle.modelName || ''}</small>
//                     </div>
//                   );
//                 })}
//               </div>
              
//               {/* Fill remaining slots if less than 9 */}
//               {qrPreviewData.length < 9 && (
//                 <div className="alert alert-info">
//                   <CIcon icon={cilPrint} className="me-2" />
//                   Preview shows {qrPreviewData.length} QR codes. You can add up to {9 - qrPreviewData.length} more.
//                 </div>
//               )}
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={resetQRPreviewModal}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               resetQRPreviewModal();
//               setPrintQrModalOpen(true);
//             }}
//           >
//             <CIcon icon={cilSettings} className="me-1" /> Change Selection
//           </CButton>
//           <CButton 
//             className='submit-button' 
//             onClick={handlePrintQRs}
//             disabled={qrPreviewData.length === 0}
//           >
//             <CIcon icon={cilPrint} className="me-1" /> Print QR Codes
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <AllocateVehicleModal
//         vehicleId={selectedVehicleForAllocation}
//         visible={allocateModalOpen}
//         onClose={() => {
//           setAllocateModalOpen(false);
//           setVehicleAllocationDetails(null);
//         }}
//         onSuccess={() => {
//           fetchData(); 
//           setAllocateModalOpen(false);
//         }}
//         vehicleDetails={vehicleAllocationDetails}
//       />
//     </div>
//   );
// };

// export default StockList;











import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from '../../utils/tableImports';
import '../../css/importCsv.css';
import '../../css/form.css';
import ImportInwardCSV from '../../views/csv/ImportInwardCSV';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CAlert,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSearch, cilSettings, cilPencil, cilTrash, cilCloudDownload, cilZoomOut, cilLockUnlocked, cilShare, cilPrint, cilCheck, cilX, cilInfo, cilWarning, cilCheckCircle, cilFile, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import { useAuth } from '../../context/AuthContext';
import AllocateVehicleModal from './AllocateVehicleModal';
import tvsLogo from '../../assets/images/logo1.png';

// Import date picker components
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { enIN } from 'date-fns/locale';
import { useRef } from 'react';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT = 100;

const StockList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Server-side state
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Search state - separate from UI to prevent unnecessary re-renders
  const [searchTerm, setSearchTerm] = useState('');
  // Debounce timer ref
  const searchTimer = useRef(null);
  
  const [branches, setBranches] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterBranchId, setFilterBranchId] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [unblockReason, setUnblockReason] = useState('');
  const [unblockLoading, setUnblockLoading] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [selectedVehicleForAllocation, setSelectedVehicleForAllocation] = useState(null);
  const [vehicleAllocationDetails, setVehicleAllocationDetails] = useState(null);

  // New states for Print QR functionality
  const [printQrModalOpen, setPrintQrModalOpen] = useState(false);
  const [qrChassisModalOpen, setQrChassisModalOpen] = useState(false);
  const [selectedChassisNumbers, setSelectedChassisNumbers] = useState([]);
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [qrPreviewData, setQrPreviewData] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  // New state for import response modal
  const [importResponseModalOpen, setImportResponseModalOpen] = useState(false);
  const [importResponse, setImportResponse] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // States for Export Report functionality
  const [exportReportModalOpen, setExportReportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedReportBranchId, setSelectedReportBranchId] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [exportReportError, setExportReportError] = useState('');
  const [exportReportLoading, setExportReportLoading] = useState(false);

  const { permissions = [], user } = useAuth();
  const hasAllBranchAccess = user?.branchAccess === "ALL";
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Page-level permission checks for Inward Stock page under Purchase module
  const hasInwardStockView = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.VIEW
  );
  
  const hasInwardStockCreate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.CREATE
  );
  
  const hasInwardStockUpdate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.UPDATE
  );
  
  const hasInwardStockDelete = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewInwardStock = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canCreateInwardStock = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canUpdateInwardStock = canUpdateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canDeleteInwardStock = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  
  // For export, you might need a specific permission or use CREATE permission
  const canExportInwardStock = hasInwardStockCreate || canCreateInwardStock;
  const canExportReport = canCreateInwardStock; // Using CREATE permission for report export

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = storedUser.branch?._id;
  const userRole = localStorage.getItem('userRole') || 
                   (storedUser.roles?.[0]?.name || '').toUpperCase();

  // Check if user is SUPERADMIN
  const isSuperAdmin = userRole === 'SUPERADMIN' || 
                       (storedUser.roles?.[0]?.isSuperAdmin === true);

  useEffect(() => {
    if (!canViewInwardStock) {
      showError('You do not have permission to view Inward Stock');
      navigate('/dashboard');
      return;
    }
    
    fetchBranches();
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (canViewInwardStock) {
      fetchData();
    }
  }, [pagination.page, pagination.limit, filterType, filterBranchId]);

  // Debounced search
  useEffect(() => {
    if (!canViewInwardStock) return;
    
    // Clear previous timer
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    // Set new timer
    searchTimer.current = setTimeout(() => {
      // Reset to page 1 when searching
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchData(1, pagination.limit, searchTerm);
    }, 500);
    
    // Cleanup
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchTerm]);

  const fetchData = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      
      // Build URL with query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Apply search if provided
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      // Apply type filter if provided
      if (filterType) {
        params.append('type', filterType);
      }
      
      // Apply branch filter if provided
      if (filterBranchId) {
        params.append('location', filterBranchId);
      }
      
      const url = `/vehicles?${params.toString()}`;
      
      const response = await axiosInstance.get(url);
      
      // Filter out sold vehicles from the response
      const nonSoldVehicles = response.data.data.vehicles.filter(
        (vehicle) => vehicle.status !== 'sold' && vehicle.status !== 'Sold' && vehicle.status !== 'SOLD'
      );
      
      setVehicles(nonSoldVehicles);
      setPagination({
        page: response.data.data.pagination.page,
        limit: response.data.data.pagination.limit,
        totalCount: response.data.data.pagination.totalCount,
        totalPages: response.data.data.pagination.totalPages,
        hasNextPage: response.data.data.pagination.hasNextPage,
        hasPrevPage: response.data.data.pagination.hasPrevPage
      });
      
      setError(null);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.log('Error fetching branches', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setPagination(prev => ({ ...prev, page: newPage }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle rows per page change
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit, 10),
      page: 1 // Reset to first page when changing limit
    }));
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Modified handleImportSuccess function to show response modal
  const handleImportSuccess = (response) => {
    if (!canCreateInwardStock) {
      showError('You do not have permission to import vehicles');
      return;
    }
    
    // Set import response and show modal
    setImportResponse(response);
    setImportResponseModalOpen(true);
    
    // Refresh data if any vehicles were imported or updated
    if (response?.data?.imported > 0 || response?.data?.updated > 0) {
      fetchData();
    }
  };

  // Reset functions
  const resetExportModal = () => {
    setSelectedType('');
    setSelectedBranchId('');
    setCsvDialogOpen(false);
  };

  const resetFilterModal = () => {
    setFilterType('');
    setFilterBranchId('');
    setFilterModalOpen(false);
  };

  const resetUnblockModal = () => {
    setUnblockReason('');
    setSelectedVehicleId(null);
    setUnblockModalOpen(false);
  };

  // Reset Print QR modal
  const resetPrintQRModal = () => {
    setPrintQrModalOpen(false);
    setAvailableChassisNumbers([]);
    setSelectedChassisNumbers([]);
  };

  // Reset QR Preview modal
  const resetQRPreviewModal = () => {
    setQrChassisModalOpen(false);
    setQrPreviewData([]);
  };

  // Reset Import Response modal
  const resetImportResponseModal = () => {
    setImportResponse(null);
    setImportResponseModalOpen(false);
  };

  // Reset Export Report modal
  const resetExportReportModal = () => {
    setSelectedReportBranchId('');
    setExportReportError('');
    setExportReportModalOpen(false);
  };

  // Handle Export Report
  const handleExportReport = async () => {
    if (!canExportReport) {
      showError('You do not have permission to export reports');
      return;
    }
    
    // Clear previous errors
    setExportReportError('');
    
    if (!selectedReportBranchId) {
      setExportReportError('Please select a branch');
      return;
    }

    try {
      setExportReportLoading(true);
      
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      // Build query parameters for the stock report API
      const params = new URLSearchParams({
        branchId: selectedReportBranchId,
        modelType: selectedType,
        format: 'excel'
      });
      
      const response = await axiosInstance.get(
        `/reports/stock/current?${params.toString()}`,
        { responseType: 'blob' }
      );

      // Check content type to see if it's an error
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        // It's a JSON error response, parse it
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        // Show the exact error message from API
        if (!errorData.success && errorData.message) {
          setExportReportError(errorData.message);
          showError(errorData.message);
          return;
        }
      }

      // Handle Excel file download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with DD-MM-YYYY format
      const branchName = branches.find(b => b._id === selectedReportBranchId)?.name || 'Branch';
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);
      const fileName = `Stock_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);

      resetExportReportModal();
      
    } catch (error) {
      console.error('Error exporting stock report:', error);
      
      // For blob errors, we need to read the blob
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(error.response.data);
          });
          
          const errorData = JSON.parse(text);
          
          // Show the exact error message from API
          if (errorData.message) {
            setExportReportError(errorData.message);
            showError(errorData.message);
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setExportReportError('Failed to export stock report');
          showError('Failed to export stock report');
        }
      } else if (error.response?.data?.message) {
        // Regular error with message in response
        setExportReportError(error.response.data.message);
        showError(error.response.data.message);
      } else if (error.message) {
        // Network or other errors
        setExportReportError(error.message);
        showError(error.message);
      } else {
        setExportReportError('Failed to export stock report');
        showError('Failed to export stock report');
      }
      
    } finally {
      setExportReportLoading(false);
    }
  };

  // Custom Import CSV component with response handling
  const CustomImportCSV = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [importType, setImportType] = useState('ICE');
    const [importBranchId, setImportBranchId] = useState('');

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    const handleImport = async () => {
      if (!selectedFile) {
        showError('Please select a file');
        return;
      }

      if (!importBranchId) {
        showError('Please select a branch');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      setImportLoading(true);
      try {
        const response = await axiosInstance.post(
          `/vehicles/import-excel?type=${importType}&branch_id=${importBranchId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        // Call the success handler with the response
        handleImportSuccess(response.data);
        
        // Reset file input
        setSelectedFile(null);
        document.getElementById('import-file-input').value = '';
        
        // Reset import form
        setImportType('ICE');
        setImportBranchId('');
      } catch (error) {
        console.error('Import failed:', error);
        showError(error.response?.data?.message || 'Failed to import Excel file');
      } finally {
        setImportLoading(false);
      }
    };

    return (
      <>
        <CButton 
          size="sm" 
          className="action-btn me-1"
          onClick={() => setCsvDialogOpen(true)}
        >
          <CIcon icon={cilCloudDownload} className='icon' /> Export Excel
        </CButton>

        <CButton 
          size="sm" 
          className="action-btn me-1"
          onClick={() => {
            // Clear any previous import response before opening modal
            setImportResponse(null);
            setImportResponseModalOpen(true);
          }}
        >
          <CIcon icon={cilCloudDownload} className='icon' /> Import Excel
        </CButton>

        {/* Import Modal */}
        <CModal visible={importResponseModalOpen} onClose={resetImportResponseModal}>
          <CModalHeader>
            <CModalTitle>Import Excel File</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <label className="form-label">Model Type:</label>
              <CFormSelect
                value={importType}
                onChange={(e) => setImportType(e.target.value)}
              >
                <option value="EV">EV</option>
                <option value="ICE">ICE</option>
              </CFormSelect>
            </div>

            <div className="mb-3">
              <label className="form-label">Branch:</label>
              <CFormSelect
                value={importBranchId}
                onChange={(e) => setImportBranchId(e.target.value)}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
            </div>

            <div className="mb-3">
              <label className="form-label">Select Excel File:</label>
              <CFormInput
                type="file"
                id="import-file-input"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <small className="text-muted">
                Supported formats: .xlsx, .xls
              </small>
            </div>

            {selectedFile && (
              <CAlert color="info">
                Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </CAlert>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton 
              color="secondary" 
              onClick={resetImportResponseModal}
              disabled={importLoading}
            >
              Cancel
            </CButton>
            <CButton 
              className='submit-button' 
              onClick={handleImport}
              disabled={!selectedFile || !importBranchId || importLoading}
            >
              {importLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  };

  // Import Response Modal
  const ImportResponseModal = () => {
    if (!importResponse) return null;

    const { status, message, data } = importResponse;
    const isSuccess = status === 'success';
    
    const stats = [
      { label: 'Total Processed', value: data.totalProcessed, icon: cilInfo, color: 'info' },
      { label: 'Successfully Imported', value: data.imported, icon: cilCheckCircle, color: 'success' },
      { label: 'Updated', value: data.updated, icon: cilPencil, color: 'warning' },
      { label: 'Skipped', value: data.skipped, icon: cilWarning, color: 'danger' },
      { label: 'Model Color Validations', value: data.modelColorValidations, icon: cilCheck, color: 'primary' },
      { label: 'Cache Size', value: data.cacheSize, icon: cilCloudDownload, color: 'secondary' }
    ];

    return (
      <CModal visible={importResponseModalOpen} onClose={resetImportResponseModal} size="lg">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={isSuccess ? cilCheckCircle : cilWarning} className={`me-2 text-${isSuccess ? 'success' : 'warning'}`} />
            Import Results
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color={isSuccess ? 'success' : 'warning'} className="mb-4">
            <h5 className="alert-heading">{message}</h5>
            <p className="mb-0">Import process completed. Below are the details:</p>
          </CAlert>

          {/* Statistics Grid */}
          <div className="row mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <CIcon icon={stat.icon} size="xl" className={`text-${stat.color} mb-2`} />
                    <h3 className="card-title">{stat.value}</h3>
                    <p className="card-text text-muted mb-0">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Errors Section */}
          {data.errors && data.errors.length > 0 && (
            <CAccordion className="mb-3">
              <CAccordionItem itemKey="errors">
                <CAccordionHeader>
                  <CIcon icon={cilWarning} className="me-2 text-danger" />
                  Errors ({data.errors.length})
                </CAccordionHeader>
                <CAccordionBody>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <ul className="list-group list-group-flush">
                      {data.errors.map((error, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex">
                            <span className="badge bg-danger me-2">{index + 1}</span>
                            <span className="text-danger">{error}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          )}

          {/* Summary */}
          <div className="alert alert-info">
            <h6 className="alert-heading">Summary:</h6>
            <ul className="mb-0">
              <li>Total rows processed: <strong>{data.totalProcessed}</strong></li>
              <li>New vehicles imported: <strong>{data.imported}</strong></li>
              <li>Existing vehicles updated: <strong>{data.updated}</strong></li>
              <li>Rows skipped due to errors: <strong>{data.skipped}</strong></li>
              {data.errors && data.errors.length > 0 && (
                <li>Please review the errors above and fix them in your Excel file before re-importing.</li>
              )}
            </ul>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetImportResponseModal}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // Function to open chassis selection modal for Print QR
  const handleOpenPrintQR = () => {
    if (!canViewInwardStock) {
      showError('You do not have permission to print QR codes');
      return;
    }
    
    // Get all available chassis numbers from current page data
    const chassisList = vehicles.map(vehicle => ({
      chassisNumber: vehicle.chassisNumber,
      id: vehicle._id || vehicle.id,
      modelName: vehicle.modelName || '',
      selected: false
    }));
    
    setAvailableChassisNumbers(chassisList);
    setSelectedChassisNumbers([]);
    setPrintQrModalOpen(true);
  };

  // Function to toggle chassis selection
  const toggleChassisSelection = (chassisNumber) => {
    setAvailableChassisNumbers(prev => 
      prev.map(item => 
        item.chassisNumber === chassisNumber 
          ? { ...item, selected: !item.selected }
          : item
      )
    );

    setSelectedChassisNumbers(prev => {
      if (prev.includes(chassisNumber)) {
        return prev.filter(num => num !== chassisNumber);
      } else {
        if (prev.length < 9) {
          return [...prev, chassisNumber];
        } else {
          showError('Maximum 9 chassis numbers can be selected');
          return prev;
        }
      }
    });
  };

  // Function to select all chassis (max 9)
  const selectAllChassis = () => {
    const maxSelect = Math.min(availableChassisNumbers.length, 9);
    const selected = availableChassisNumbers.slice(0, maxSelect).map(item => item.chassisNumber);
    
    setAvailableChassisNumbers(prev => 
      prev.map((item, index) => ({
        ...item,
        selected: index < maxSelect
      }))
    );
    
    setSelectedChassisNumbers(selected);
  };

  // Function to clear all selections
  const clearAllSelections = () => {
    setAvailableChassisNumbers(prev => 
      prev.map(item => ({ ...item, selected: false }))
    );
    setSelectedChassisNumbers([]);
  };

  // Function to proceed to QR preview
  const handleProceedToQRPreview = () => {
    if (selectedChassisNumbers.length === 0) {
      showError('Please select at least one chassis number');
      return;
    }
    
    // Find the vehicle data for selected chassis numbers from current page
    const selectedVehicles = vehicles.filter(vehicle => 
      selectedChassisNumbers.includes(vehicle.chassisNumber)
    );
    
    setQrPreviewData(selectedVehicles);
    setPrintQrModalOpen(false);
    setQrChassisModalOpen(true);
  };

  // Function to generate QR print HTML
  const generateQRPrintHTML = (vehicles) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print QR Codes</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #fff;
          }
          .page {
            width: 210mm;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          .header img {
            height: 60px;
          }
          .header h1 {
            margin: 10px 0;
            color: #333;
            font-size: 24px;
          }
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          .qr-item {
            text-align: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            page-break-inside: avoid;
          }
          .qr-image {
            width: 120px;
            height: 120px;
            object-fit: contain;
            margin-bottom: 10px;
          }
          .chassis-number {
            font-weight: bold;
            color: #333;
            margin-top: 5px;
            font-size: 12px;
            word-break: break-all;
          }
          .model-name {
            color: #666;
            font-size: 11px;
            margin-bottom: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body {
              padding: 0;
            }
            .page {
              width: 100%;
            }
            .qr-grid {
              page-break-inside: avoid;
            }
            .qr-item {
              border: 1px solid #000;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <img src="${tvsLogo}" alt="TVS Logo" />
            <h1>QR Codes - Inward Stock</h1>
            <p>Total QR Codes: ${vehicles.length} | Printed on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="qr-grid">
            ${vehicles.map((vehicle, index) => {
              const qrUrl = vehicle.qrCode ? `${config.baseURL || ''}${vehicle.qrCode}` : '';
              return `
                <div class="qr-item">
                  ${qrUrl ? `<img src="${qrUrl}" class="qr-image" alt="QR Code" />` : '<div class="qr-image">No QR</div>'}
                  <div class="model-name">${vehicle.modelName || ''}</div>
                  <div class="chassis-number">${vehicle.chassisNumber || '-'}</div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="footer">
            <p>Generated by TVS Inventory Management System</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          };
        </script>
      </body>
      </html>
    `;
  };

  // Function to handle QR printing
  const handlePrintQRs = () => {
    if (qrPreviewData.length === 0) {
      showError('No QR codes to print');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(generateQRPrintHTML(qrPreviewData));
    printWindow.document.close();
  };

  const handlePrintQR = (vehicle) => {
    if (!canViewInwardStock) {
      showError('You do not have permission to print QR codes');
      return;
    }
    
    const qrUrl = vehicle.qrCode
      ? `${config.baseURL || ''}${vehicle.qrCode}`
      : '';
  
    const printWindow = window.open('', '_blank', 'width=400,height=500');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center,
              padding: 20px,
            }
            .qr-container {
              border: 1px solid #000,
              padding: 15px,
              width: 400px,
              margin: auto,
            }
            img {
              width: 250px,
              height: 250px,
              margin-bottom: 10px,
            }
            .label {
              font-weight: bold,
              margin-top: 8px,
            }
            .value {
              margin-bottom: 6px,
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrUrl ? `<img src="${qrUrl}" />` : '<p>No QR Available</p>'}

            <div class="label">Chassis Number</div>
            <div class="value">${vehicle.chassisNumber || '-'}</div>

            <div class="label">Model Name</div>
            <div class="value">${vehicle.modelName || '-'}</div>

            <div class="label">Key Number</div>
            <div class="value">${vehicle.keyNumber || '-'}</div>
          </div>

          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = window.close;
            }
          </script>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  };

  const handleClick = (event, id) => {
    if (!canViewInwardStock && !canUpdateInwardStock && !canDeleteInwardStock) {
      showError('You do not have permission to access this menu');
      return;
    }
    
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleUnblockClick = (vehicleId) => {
    if (!canUpdateInwardStock) {
      showError('You do not have permission to unblock vehicles');
      return;
    }
    setSelectedVehicleId(vehicleId);
    setUnblockModalOpen(true);
    handleClose();
  };

  const handleUnblockSubmit = async () => {
    if (!canUpdateInwardStock) {
      showError('You do not have permission to unblock vehicles');
      return;
    }

    if (!unblockReason.trim()) {
      showError('Please enter a reason for unblocking');
      return;
    }

    setUnblockLoading(true);
    try {
      await axiosInstance.put(
        `/vehicles/unblock-and-assign/${selectedVehicleId}`,
        {
          reason: unblockReason
        }
      );
      
      showSuccess('Vehicle unblocked successfully!');

      setUnblockReason('');
      setUnblockModalOpen(false);
      setSelectedVehicleId(null);
      fetchData();
    } catch (error) {
      console.error('Error unblocking vehicle:', error);
      showError(error.response?.data?.message || 'Failed to unblock vehicle');
    } finally {
      setUnblockLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteInwardStock) {
      showError('You do not have permission to delete vehicles');
      return;
    }

    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/vehicles/${id}`);
        fetchData(); // Refresh the current page after delete
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const applyFilter = () => {
    if (filterType || filterBranchId) {
      setIsFilterApplied(true);
      setFilterModalOpen(false);
      // Reset to page 1 when applying filters
      setPagination(prev => ({ ...prev, page: 1 }));
      // fetchData will be triggered by useEffect dependency on filterType/filterBranchId
    } else {
      showError('Please select type or branch to apply filter');
    }
  };

  const clearFilter = () => {
    setFilterType('');
    setFilterBranchId('');
    setIsFilterApplied(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const addNewStock = () => {
    if (!canCreateInwardStock) {
      showError('You do not have permission to add new stock');
      return;
    }
    navigate('/inward-stock');
  };

  const handleExportExcel = async () => {
    if (!canExportInwardStock) {
      showError('You do not have permission to export data');
      return;
    }

    if (!selectedType) {
      showError('Please select a type.');
      return;
    }
    if (!selectedBranchId) {
      showError('Please select a branch.');
      return;
    }

    setExportLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vehicles/export-excel?&type=${selectedType}&branch_id=${selectedBranchId}`,
        {
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exported_data_${selectedType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setCsvDialogOpen(false);
      setSelectedType('');
      setSelectedBranchId('');
      showSuccess('Excel exported successfully!');
    } catch (error) {
      console.error('Excel export failed:', error);
      showError('Failed to export Excel.');
    } finally {
      setExportLoading(false);
    }
  };

  // Function to open Export Report modal
  const handleOpenExportReport = () => {
    if (!canExportReport) {
      showError('You do not have permission to export reports');
      return;
    }
    
    setExportReportModalOpen(true);
    setExportReportError('');
  };

  const isVehicleBlocked = (status) => {
    return status?.toLowerCase() === 'blocked';
  };
  
  const isVehicleBooked = (status) => {
    return status?.toLowerCase() === 'booked';
  };
  
  const isVehicleBlockedOrBooked = (status) => {
    return isVehicleBlocked(status) || isVehicleBooked(status);
  };
  
  const isVehicleFriz = (status) => {
    return status?.toUpperCase() === 'FROZEN';
  };

  const handleAllocateClick = (vehicle) => {
    if (!canUpdateInwardStock) {
      showError('You do not have permission to allocate vehicles');
      return;
    }

    const extractId = (item) => {
      if (!item) return '';
      if (typeof item === 'object') {
        return item._id || item.id || '';
      }
      return item;
    };

    const vehicleDetails = {
      vehicleId: vehicle._id || vehicle.id,
      modelName: vehicle.modelName || '',
      colorName: vehicle.color?.name || vehicle.color?.id || vehicle.color || '',
      chassisNumber: vehicle.chassisNumber || '',
      locationName: vehicle.unloadLocation?.name || vehicle.subdealerLocation?.name || '',
      modelId: extractId(vehicle.model),
      colorId: extractId(vehicle.color),
      locationId: extractId(vehicle.unloadLocation || vehicle.subdealerLocation)
    };
    
    console.log('Vehicle details for allocation:', vehicleDetails);
    
    setVehicleAllocationDetails(vehicleDetails);
    setSelectedVehicleForAllocation(vehicle._id || vehicle.id);
    setAllocateModalOpen(true);
    handleClose();
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!canViewInwardStock) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Inward Stock.
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

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  // Calculate displayed page numbers (max 5 pages shown)
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
  if (pagination.page <= 3) {
    endPage = Math.min(5, pagination.totalPages);
  }
  
  if (pagination.page >= pagination.totalPages - 2) {
    startPage = Math.max(1, pagination.totalPages - 4);
  }
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) {
    displayedPages.push(i);
  }

  return (
    <div>
      <div className='title'>Inwarded Stock</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateInwardStock && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={addNewStock}
              >
                <CIcon icon={cilPlus} className='icon' /> New Stock
              </CButton>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Filter
            </CButton>
            
            {isFilterApplied && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={clearFilter}
              >
                <CIcon icon={cilZoomOut} className='icon' /> Clear Filters
              </CButton>
            )}
           
            {canCreateInwardStock && (
              <CustomImportCSV />
            )}

            {/* Print QR Button */}
            {canCreateInwardStock && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleOpenPrintQR}
              >
                <CIcon icon={cilPrint} className='icon' /> Print QR
              </CButton>
            )}

            {/* Export Report Button */}
            {canExportReport && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleOpenExportReport}
                title="Export Stock Report"
              >
                <CIcon icon={cilFile} className='icon' /> Export Report
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <div className="d-flex align-items-center">
              <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
              <CFormSelect 
                value={pagination.limit} 
                onChange={(e) => handleLimitChange(e.target.value)}
                style={{ width: '80px' }}
                size="sm"
              >
                {PAGE_SIZE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </CFormSelect>
            </div>
            <div className='d-flex align-items-center'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by chassis, model..."
                style={{ width: '250px' }}
              />
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Unload Location</CTableHeaderCell>
                  <CTableHeaderCell>Inward Date</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Chassis No</CTableHeaderCell>
                  <CTableHeaderCell>QR Code</CTableHeaderCell>
                  <CTableHeaderCell>Current Status</CTableHeaderCell>
                  {(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) && (
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vehicles.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell 
                      colSpan={(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) ? "11" : "10"} 
                      className="text-center"
                    >
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No inward details available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  vehicles.map((vehicle, index) => {
                    const vehicleId = vehicle._id || vehicle.id;
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={vehicleId}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{vehicle.unloadLocation?.name || vehicle.subdealerLocation?.name}</CTableDataCell>
                        <CTableDataCell>{formatDate(vehicle.createdAt)}</CTableDataCell>
                        <CTableDataCell>{vehicle.type}</CTableDataCell>
                        <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                        <CTableDataCell>{vehicle.color?.name || vehicle.color?.id}</CTableDataCell>
                        <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                        <CTableDataCell>
                          {vehicle.qrCode && (
                            <a
                              href={`${config.baseURL || ''}${vehicle.qrCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-block' }}
                            >
                              <img
                                src={`${config.baseURL || ''}${vehicle.qrCode}`}
                                alt="QR Code"
                                style={{
                                  maxWidth: '100px',
                                  maxHeight: '50px',
                                  objectFit: 'contain',
                                  cursor: 'pointer'
                                }}
                              />
                            </a>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={
                            vehicle.status?.toLowerCase() === 'available' ? 'success' :
                            vehicle.status?.toLowerCase() === 'blocked' ? 'danger' :
                            vehicle.status?.toLowerCase() === 'booked' ? 'warning' :
                            vehicle.status?.toLowerCase() === 'sold' ? 'secondary' :
                            'warning'
                          }>
                            {vehicle.status}
                          </CBadge>
                        </CTableDataCell>
                        
                        {(canUpdateInwardStock || canDeleteInwardStock || canViewInwardStock) && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className='option-button btn-sm'
                              onClick={(event) => handleClick(event, vehicleId)}
                              disabled={!canViewInwardStock && !canUpdateInwardStock && !canDeleteInwardStock}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${vehicleId}`} 
                              anchorEl={anchorEl} 
                              open={menuId === vehicleId} 
                              onClose={handleClose}
                            >
                              {/* Updated: Show Unblock for both Blocked and Booked status */}
                              {canUpdateInwardStock && isVehicleBlockedOrBooked(vehicle.status) && (
                                <MenuItem onClick={() => handleUnblockClick(vehicleId)}>
                                  <CIcon icon={cilLockUnlocked} className="me-2" />Unblock
                                </MenuItem>
                              )}
                              
                              {canUpdateInwardStock && isVehicleFriz(vehicle.status) && (
                                <MenuItem onClick={() => handleAllocateClick(vehicle)}>
                                  <CIcon icon={cilShare} className="me-2" />Allocate
                                </MenuItem>
                              )}
                              
                              {canDeleteInwardStock && (
                                <MenuItem onClick={() => handleDelete(vehicleId)}>
                                  <CIcon icon={cilTrash} className="me-2" />Delete
                                </MenuItem>
                              )}
                              
                              {canCreateInwardStock && (
                                <MenuItem onClick={() => handlePrintQR(vehicle)}>
                                  <CIcon icon={cilPrint} className="me-2" />
                                  Print QR
                                </MenuItem>
                              )}
                            </Menu>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component */}
          {pagination.totalCount > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
                </span>
              </div>
              
              {pagination.totalPages > 1 && (
                <CPagination align="center" aria-label="Page navigation example">
                  {/* Previous Button */}
                  <CPaginationItem 
                    aria-label="Previous" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className={pagination.page === 1 ? 'disabled' : ''}
                  >
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>
                  
                  {/* First Page */}
                  {pagination.page > 3 && pagination.totalPages > 5 && (
                    <>
                      <CPaginationItem 
                        onClick={() => handlePageChange(1)}
                        active={pagination.page === 1}
                        disabled={loading}
                      >
                        1
                      </CPaginationItem>
                      {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
                    </>
                  )}
                  
                  {/* Page Numbers */}
                  {displayedPages.map(page => (
                    <CPaginationItem 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      active={pagination.page === page}
                      disabled={loading}
                    >
                      {page}
                    </CPaginationItem>
                  ))}
                  
                  {/* Last Page */}
                  {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
                      <CPaginationItem 
                        onClick={() => handlePageChange(pagination.totalPages)}
                        active={pagination.page === pagination.totalPages}
                        disabled={loading}
                      >
                        {pagination.totalPages}
                      </CPaginationItem>
                    </>
                  )}
                  
                  {/* Next Button */}
                  <CPaginationItem 
                    aria-label="Next" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className={pagination.page === pagination.totalPages ? 'disabled' : ''}
                  >
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Unblock Modal */}
      <CModal visible={unblockModalOpen} onClose={resetUnblockModal}>
        <CModalHeader>
          <CModalTitle>Unblock Vehicle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Reason for Unblocking<span className='required'>*</span></label>
            <CFormTextarea
              value={unblockReason}
              onChange={(e) => setUnblockReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetUnblockModal}
            disabled={unblockLoading}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            onClick={handleUnblockSubmit}
            disabled={unblockLoading}
          >
            {unblockLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Unblocking...
              </>
            ) : (
              'Unblock Vehicle'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Filter Modal */}
      <CModal visible={filterModalOpen} onClose={resetFilterModal}>
        <CModalHeader>
          <CModalTitle>Filter Vehicles</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Type:</label>
            <CFormSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- All Types --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={filterBranchId}
              onChange={(e) => setFilterBranchId(e.target.value)}
            >
              <option value="">-- All Branches --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetFilterModal}>Cancel</CButton>
          <CButton className='submit-button' onClick={applyFilter}>
            Apply Filters
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Export Excel Modal */}
      <CModal visible={csvDialogOpen} onClose={resetExportModal}>
        <CModalHeader>
          <CModalTitle>Export Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Model Type:</label>
            <CFormSelect
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className='submit-button' 
            onClick={handleExportExcel}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Export Report Modal */}
      <CModal alignment="center" visible={exportReportModalOpen} onClose={resetExportReportModal}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Export Stock Report
          </CModalTitle>
        </CModalHeader>
        <CModalBody>

          {exportReportError && (
            <CAlert color="warning" className="mb-3">
              {exportReportError}
            </CAlert>
          )}
          
          <LocalizationProvider 
            dateAdapter={AdapterDateFns} 
            adapterLocale={enIN} 
          >
    
          </LocalizationProvider>
          <div className="mb-3">
            <label className="form-label">Model Type:</label>
            <CFormSelect
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setExportReportError('');
              }}
              disabled={!canExportReport}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={selectedReportBranchId}
              onChange={(e) => {
                setSelectedReportBranchId(e.target.value);
                setExportReportError('');
              }}
              disabled={!canExportReport}
            >
              <option value="">-- Select Branch --</option>
              {hasAllBranchAccess && (
                <option value="all">All Branches</option>
              )}
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetExportReportModal}
            disabled={exportReportLoading}
          >
            Cancel
          </CButton>
          <CButton 
            className="submit-button"
            onClick={handleExportReport}
            disabled={!selectedReportBranchId || !canExportReport || exportReportLoading}
          >
            {exportReportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Import Response Modal */}
      <ImportResponseModal />

      {/* Print QR Selection Modal */}
      <CModal visible={printQrModalOpen} onClose={resetPrintQRModal} size="lg">
        <CModalHeader>
          <CModalTitle>Select Chassis Numbers for QR Printing</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="badge bg-primary">Selected: {selectedChassisNumbers.length}/9</span>
                <small className="text-muted ms-2">(Maximum 9 chassis numbers allowed)</small>
              </div>
              <div>
                <CButton size="sm" className="me-2" onClick={selectAllChassis}>
                  <CIcon icon={cilCheck} className="me-1" /> Select All (Max 9)
                </CButton>
                <CButton size="sm" color="secondary" onClick={clearAllSelections}>
                  <CIcon icon={cilX} className="me-1" /> Clear All
                </CButton>
              </div>
            </div>
            
            {availableChassisNumbers.length === 0 ? (
              <div className="alert alert-info">
                No chassis numbers available for selection.
              </div>
            ) : (
              <div className="chassis-selection-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '10px',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '10px',
                border: '1px solid #dee2e6',
                borderRadius: '5px'
              }}>
                {availableChassisNumbers.map((item, index) => (
                  <div 
                    key={index} 
                    className={`chassis-item p-3 border rounded ${item.selected ? 'border-primary bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleChassisSelection(item.chassisNumber)}
                  >
                    <div className="d-flex align-items-center">
                      <CFormCheck
                        checked={item.selected}
                        onChange={() => toggleChassisSelection(item.chassisNumber)}
                        className="me-2"
                      />
                      <div>
                        <div className="fw-bold">{item.chassisNumber}</div>
                        <small className="text-muted">{item.modelName}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetPrintQRModal}>
            Cancel
          </CButton>
          <CButton 
            className='submit-button' 
            onClick={handleProceedToQRPreview}
            disabled={selectedChassisNumbers.length === 0}
          >
            Next <CIcon icon={cilPrint} className="ms-1" />
          </CButton>
        </CModalFooter>
      </CModal>

      {/* QR Preview and Print Modal */}
      <CModal visible={qrChassisModalOpen} onClose={resetQRPreviewModal} fullscreen>
        <CModalHeader>
          <CModalTitle>QR Codes Preview ({qrPreviewData.length} items)</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {qrLoading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading QR codes...</p>
            </div>
          ) : (
            <div className="qr-preview-container">
              <div className="qr-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {qrPreviewData.map((vehicle, index) => {
                  const qrUrl = vehicle.qrCode ? `${config.baseURL || ''}${vehicle.qrCode}` : '';
                  return (
                    <div key={index} className="qr-preview-item text-center p-3 border rounded">
                      {qrUrl ? (
                        <img 
                          src={qrUrl} 
                          alt="QR Code" 
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'contain',
                            marginBottom: '10px'
                          }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center" style={{
                          width: '150px',
                          height: '150px',
                          backgroundColor: '#f8f9fa',
                          margin: '0 auto 10px',
                          border: '1px dashed #dee2e6'
                        }}>
                          <span className="text-muted">No QR</span>
                        </div>
                      )}
                      <div className="fw-bold text-truncate">{vehicle.chassisNumber}</div>
                      <small className="text-muted">{vehicle.modelName || ''}</small>
                    </div>
                  );
                })}
              </div>
              
              {/* Fill remaining slots if less than 9 */}
              {qrPreviewData.length < 9 && (
                <div className="alert alert-info">
                  <CIcon icon={cilPrint} className="me-2" />
                  Preview shows {qrPreviewData.length} QR codes. You can add up to {9 - qrPreviewData.length} more.
                </div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetQRPreviewModal}>
            Cancel
          </CButton>
          <CButton 
            color="secondary" 
            onClick={() => {
              resetQRPreviewModal();
              setPrintQrModalOpen(true);
            }}
          >
            <CIcon icon={cilSettings} className="me-1" /> Change Selection
          </CButton>
          <CButton 
            className='submit-button' 
            onClick={handlePrintQRs}
            disabled={qrPreviewData.length === 0}
          >
            <CIcon icon={cilPrint} className="me-1" /> Print QR Codes
          </CButton>
        </CModalFooter>
      </CModal>

      <AllocateVehicleModal
        vehicleId={selectedVehicleForAllocation}
        visible={allocateModalOpen}
        onClose={() => {
          setAllocateModalOpen(false);
          setVehicleAllocationDetails(null);
        }}
        onSuccess={() => {
          fetchData(); 
          setAllocateModalOpen(false);
        }}
        vehicleDetails={vehicleAllocationDetails}
      />
    </div>
  );
};

export default StockList;