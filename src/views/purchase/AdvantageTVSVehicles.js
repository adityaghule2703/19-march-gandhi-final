
// import '../../css/table.css';
// import { useRef } from 'react';
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
// } from '../../utils/tableImports';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES, 
//   ACTIONS, 
//   TABS, 
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
//   CModalBody,
//   CModalTitle,
//   CModalFooter,
//   CPagination,
//   CPaginationItem,
//   CFormSelect,
//   CAlert,
//   CFormTextarea,
//   CForm,
//   CRow,
//   CCol,
//   CNav,
//   CNavItem,
//   CNavLink
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilTrash, 
//   cilCheckCircle, 
//   cilXCircle,
//   cilCloudDownload,
//   cilChevronLeft,
//   cilChevronRight,
//   cilCheck,
//   cilX,
//   cilPencil,
//   cilInfo,
//   cilWarning,
//   cilThumbUp,
//   cilThumbDown,
//   cilSearch,
//   cilSave
// } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';
// import Select from 'react-select';

// // Constants
// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 10;

// // Tab keys
// const TAB_PENDING = 'pending';
// const TAB_REJECTED = 'rejected';
// const TAB_MISMATCH = 'Model/Color Mismatch';

// // Treat placeholder values like "-" as empty
// const cleanValue = (v) => {
//   const s = (v || '').toString().trim();
//   return s === '-' ? '' : s;
// };

// const AdvantageTVSVehicles = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [actionLoadingId, setActionLoadingId] = useState(null);
  
//   // ========== TAB STATE ==========
//   const [activeTab, setActiveTab] = useState(TAB_PENDING);

//   // ========== STATISTICS (tab badges) ==========
//   const [stats, setStats] = useState({
//     readyToApprove: 0,
//     mismatch: 0,
//     colorMismatch: 0,
//     modelMismatch: 0,
//     rejected: 0
//   });

//   // Server-side pagination state
//   const [vehicleData, setVehicleData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(DEFAULT_LIMIT);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredCount, setFilteredCount] = useState(0);
  
//   // Export loading state
//   const [exportLoading, setExportLoading] = useState(false);
  
//   // Modal states
//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
  
//   // Action Modal States
//   const [actionModalVisible, setActionModalVisible] = useState(false);
//   const [actionType, setActionType] = useState(null);
//   const [actionVehicle, setActionVehicle] = useState(null);
//   const [actionNotes, setActionNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [actionModalLoading, setActionModalLoading] = useState(false);
//   const [actionError, setActionError] = useState(null);

//   // Edit Modal States
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editVehicle, setEditVehicle] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     modelName: '',
//     modelId: '',
//     colorName: '',
//     type: 'ICE',
//     unloadLocation: '',
//     engineNumber: '',
//     batteryNumber: '',
//     keyNumber: '',
//     noOfDaysInStockDLR: 0,
//     notes: ''
//   });
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState(null);

//   // names we still need to resolve into option objects once their
//   // corresponding option lists have loaded (fixes async race conditions)
//   const [pendingColorName, setPendingColorName] = useState('');
//   const [pendingBranchName, setPendingBranchName] = useState('');
  
//   // Branches state for dropdown
//   const [branches, setBranches] = useState([]);
//   const [branchesLoading, setBranchesLoading] = useState(false);
  
//   // Models and Colors states for dropdown
//   const [models, setModels] = useState([]);
//   const [modelsLoading, setModelsLoading] = useState(false);
//   const [colors, setColors] = useState([]);
//   const [colorsLoading, setColorsLoading] = useState(false);
//   const [selectedModelForColors, setSelectedModelForColors] = useState(null);
  
//   // React-Select options
//   const [modelOptions, setModelOptions] = useState([]);
//   const [colorOptions, setColorOptions] = useState([]);
//   const [selectedModelOption, setSelectedModelOption] = useState(null);
//   const [selectedColorOption, setSelectedColorOption] = useState(null);
  
//   const { permissions } = useAuth();
  
//   // ========== PAGE-LEVEL PERMISSION CHECKS USING PURCHASE MODULE ==========
//   const hasAdvantageTVSView = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.VIEW
//   );
  
//   const hasAdvantageTVSCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.CREATE
//   );
  
//   const hasAdvantageTVSUpdate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.UPDATE
//   );
  
//   const hasAdvantageTVSDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.INWARD_STOCK, 
//     ACTIONS.DELETE
//   );

//   const canViewAdvantageTVS = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
//   const canCreateAdvantageTVS = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
//   const canUpdateAdvantageTVS = canUpdateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
//   const canDeleteAdvantageTVS = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);

//   // Tabs that use the pending-style table and rows
//   const isPendingStyleTab = activeTab === TAB_PENDING || activeTab === TAB_MISMATCH;

//   // ========== HELPER: GET API ENDPOINT BASED ON TAB ==========
//   const getApiEndpoint = (tab) => {
//     if (tab === TAB_REJECTED) return '/advantage-approval';
//     if (tab === TAB_MISMATCH) return '/advantage-approval/mismatch';
//     return '/advantage-approval/pending';
//   };

//   // ========== HELPER: GET API PARAMS BASED ON TAB ==========
//   const getApiParams = (page, pageLimit, search, tab) => {
//     const params = { page, limit: pageLimit };
//     if (tab === TAB_REJECTED) {
//       params.status = 'rejected';
//     }
//     if (search) params.search = search;
//     return params;
//   };

//   // ========== HELPER: CHASSIS NUMBER FROM ANY ITEM SHAPE ==========
//   const getChassis = (item) =>
//     item?.stockData?.chassisNumber || item?.chassisNumber || item?.stockDetails?.chassisNumber;

//   // ========== TAB CHANGE HANDLER ==========
//   const handleTabChange = (tab) => {
//     if (tab === activeTab) return;
//     setActiveTab(tab);
//     setSearchTerm('');
//     setSearchQuery('');
//     setError(null);
//     // Reset to page 1 when switching tabs
//     fetchData(1, limit, '', tab);
//   };

//   // ========== FETCH STATISTICS (tab badge counts) ==========
//   const fetchStatistics = async () => {
//     try {
//       const response = await axiosInstance.get('/advantage-approval/statistics');
//       const d = response.data?.data || {};
//       setStats({
//         readyToApprove: d.readyToApprove || 0,
//         mismatch: d.mismatch || 0,
//         colorMismatch: d.colorMismatch || 0,
//         modelMismatch: d.modelMismatch || 0,
//         rejected: d.rejected || 0
//       });
//     } catch (e) {
//       // Non-fatal - badges just won't update
//       console.error('Error fetching statistics:', e);
//     }
//   };

//   useEffect(() => {
//     if (!canViewAdvantageTVS) {
//       showError('You do not have permission to view Advantage TVS Vehicles');
//       return;
//     }
//     fetchData(1, limit, '', TAB_PENDING);
//     fetchStatistics();
//     fetchBranches();
//     fetchModels();
//   }, [canViewAdvantageTVS]);

//   // Resolve MIS Color selection once colorOptions finish loading
//   useEffect(() => {
//     if (!editModalVisible) return;
//     if (!pendingColorName) return;
//     if (!colorOptions || colorOptions.length === 0) return;

//     const match =
//       colorOptions.find(
//         opt => opt.label.trim().toLowerCase() === pendingColorName.trim().toLowerCase()
//       ) || null;

//     setSelectedColorOption(match);
//     if (match) {
//       setEditFormData(prev => ({ ...prev, colorName: match.label }));
//       setPendingColorName('');
//     }
//   }, [colorOptions, pendingColorName, editModalVisible]);

//   // Resolve branch/unload-location selection once branches finish
//   useEffect(() => {
//     if (!editModalVisible) return;
//     if (!pendingBranchName) return;
//     if (!Array.isArray(branches) || branches.length === 0) return;

//     const target = pendingBranchName.trim().toLowerCase();
//     const match =
//       branches.find(b => (b.name || '').trim().toLowerCase() === target) ||
//       branches.find(b => (b.name || '').trim().toLowerCase().includes(target)) ||
//       branches.find(b => target.includes((b.name || '').trim().toLowerCase()) && b.name);

//     if (match) {
//       setEditFormData(prev => ({ ...prev, unloadLocation: match._id || match.id }));
//       setPendingBranchName('');
//     }
//   }, [branches, pendingBranchName, editModalVisible]);

//   // Fetch branches for dropdown
//   const fetchBranches = async () => {
//     try {
//       setBranchesLoading(true);
//       const response = await axiosInstance.get('/branches');
//       if (response.data && response.data.data) {
//         setBranches(response.data.data);
//       } else if (response.data && Array.isArray(response.data)) {
//         setBranches(response.data);
//       } else {
//         setBranches([]);
//       }
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       setBranches([]);
//     } finally {
//       setBranchesLoading(false);
//     }
//   };

//   // Fetch models for dropdown
//   const fetchModels = async () => {
//     try {
//       setModelsLoading(true);
//       const response = await axiosInstance.get('/models');
      
//       let modelsData = [];
//       if (response.data?.data?.models) {
//         modelsData = response.data.data.models;
//       } else if (response.data?.models) {
//         modelsData = response.data.models;
//       } else if (Array.isArray(response.data?.data)) {
//         modelsData = response.data.data;
//       } else if (Array.isArray(response.data)) {
//         modelsData = response.data;
//       }
      
//       modelsData = Array.isArray(modelsData) ? modelsData : [];
//       setModels(modelsData);
      
//       const options = modelsData.map(model => ({
//         value: model._id || model.id,
//         label: model.model_name || model.name || ''
//       }));
//       setModelOptions(options);
      
//     } catch (error) {
//       console.error('Error fetching models:', error);
//       setModels([]);
//       setModelOptions([]);
//     } finally {
//       setModelsLoading(false);
//     }
//   };

//   // Fetch colors for a specific model (uses /advantage-approval/model-colors/:modelId)
//   const fetchColorsForModel = async (modelId) => {
//     if (!modelId) {
//       setColors([]);
//       setColorOptions([]);
//       return;
//     }
    
//     try {
//       setColorsLoading(true);
//       const response = await axiosInstance.get(`/advantage-approval/model-colors/${modelId}`);
      
//       let colorsData = [];
//       if (response.data?.data?.colors) {
//         colorsData = response.data.data.colors;
//       } else if (response.data?.colors) {
//         colorsData = response.data.colors;
//       } else if (Array.isArray(response.data?.data)) {
//         colorsData = response.data.data;
//       } else if (Array.isArray(response.data)) {
//         colorsData = response.data;
//       }
      
//       colorsData = Array.isArray(colorsData) ? colorsData : [];
//       setColors(colorsData);
      
//       const options = colorsData.map(color => ({
//         value: color._id || color.id,
//         label: color.name || color.color_name || ''
//       }));
//       setColorOptions(options);
      
//     } catch (error) {
//       console.error('Error fetching colors for model:', error);
//       setColors([]);
//       setColorOptions([]);
//     } finally {
//       setColorsLoading(false);
//     }
//   };

//   // ========== FETCH DATA with tab support ==========
//   const fetchData = async (page = 1, pageLimit = DEFAULT_LIMIT, search = '', tab = activeTab) => {
//     if (!canViewAdvantageTVS) {
//       showError('You do not have permission to view Advantage TVS Vehicles');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const params = getApiParams(page, pageLimit, search, tab);
//       const endpoint = getApiEndpoint(tab);
//       const response = await axiosInstance.get(endpoint, { params });

//       let docs = [];
//       let totalCount = 0;
//       let totalPages = 1;

//       if (tab === TAB_REJECTED) {
//         if (response.data) {
//           if (response.data.data?.approvals && Array.isArray(response.data.data.approvals)) {
//             docs = response.data.data.approvals;
//           } else if (response.data.data && Array.isArray(response.data.data)) {
//             docs = response.data.data;
//           } else if (Array.isArray(response.data)) {
//             docs = response.data;
//           }
//           totalCount = response.data.total || response.data.results || docs.length;
//           totalPages = response.data.totalPages || Math.ceil(totalCount / pageLimit);
//         }
//       } else {
//         if (response.data) {
//           docs = response.data.data?.vehicles || response.data.data || [];
//           totalCount = response.data.total || response.data.results || docs.length;
//           totalPages = response.data.totalPages || Math.ceil(totalCount / pageLimit);
//         }
//       }

//       setVehicleData(docs);
//       setTotal(totalCount);
//       setPages(totalPages);
//       setCurrentPage(page);
//       setLimit(pageLimit);
//       setSearchQuery(search);
//       setFilteredCount(totalCount);
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//       setVehicleData([]);
//       setTotal(0);
//       setPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle export to Excel
//   const handleExport = async () => {
//     if (!canViewAdvantageTVS) {
//       showError('You do not have permission to export Advantage TVS Vehicles');
//       return;
//     }

//     try {
//       setExportLoading(true);
      
//       const params = {};
//       if (searchQuery) params.search = searchQuery;
//       if (activeTab === TAB_REJECTED) params.status = 'rejected';

//       const exportEndpoint = activeTab === TAB_REJECTED
//         ? '/advantage-approval/export-excel-rejected'
//         : '/advantage-approval/export-excel';

//       const response = await axiosInstance.get(exportEndpoint, {
//         params,
//         responseType: 'blob'
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
      
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = activeTab === TAB_REJECTED 
//         ? 'Rejected_TVS_Vehicles.xlsx' 
//         : 'Advantage_TVS_Vehicles.xlsx';
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       showSuccess('Export completed successfully');
//     } catch (err) {
//       console.error('Error exporting Advantage TVS Vehicles:', err);
//       const errorMsg = err.response?.data?.message || 'Failed to export Advantage TVS Vehicles';
//       showError(errorMsg);
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Handle search with debounce
//   const handleSearch = (value) => {
//     if (!canViewAdvantageTVS) {
//       showError('You do not have permission to search Advantage TVS Vehicles');
//       return;
//     }
    
//     setSearchTerm(value);
//     clearTimeout(window.searchTimeout);
//     window.searchTimeout = setTimeout(() => {
//       fetchData(1, limit, value, activeTab);
//     }, 400);
//   };

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (!canViewAdvantageTVS) return;
//     if (newPage < 1 || newPage > pages) return;
//     fetchData(newPage, limit, searchQuery, activeTab);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle limit change
//   const handleLimitChange = (newLimit) => {
//     if (!canViewAdvantageTVS) return;
//     const newLimitValue = parseInt(newLimit, 10);
//     fetchData(1, newLimitValue, searchQuery, activeTab);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: '2-digit',
//           year: 'numeric'
//         });
//       }
//     } catch (e) {
//       return 'N/A';
//     }
//     return 'N/A';
//   };

//   // Format date-time
//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleString('en-IN', {
//           day: '2-digit',
//           month: '2-digit',
//           year: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit'
//         });
//       }
//     } catch (e) {
//       return 'N/A';
//     }
//     return 'N/A';
//   };

//   // Handle view vehicle details
//   const handleViewVehicle = (vehicle, event) => {
//     if (event) {
//       event.stopPropagation();
//     }
    
//     if (!canViewAdvantageTVS) {
//       showError('You do not have permission to view vehicle details');
//       return;
//     }
//     setSelectedVehicle(vehicle);
//     setViewModalVisible(true);
//   };

//   // Open action modal for approve/reject
//   const openActionModal = (vehicle, type, event) => {
//     if (event) {
//       event.stopPropagation();
//     }
    
//     if (type === 'approve' && !canUpdateAdvantageTVS) {
//       showError('You do not have permission to approve vehicles');
//       return;
//     }
    
//     if (type === 'reject' && !canUpdateAdvantageTVS) {
//       showError('You do not have permission to reject vehicles');
//       return;
//     }
    
//     setActionVehicle(vehicle);
//     setActionType(type);
//     setActionNotes('');
//     setRejectionReason('');
//     setActionError(null);
//     setActionModalVisible(true);
//   };

//   // Handle approve vehicle from modal with proper error handling
//   const handleApproveFromModal = async () => {
//     if (!actionVehicle) return;
    
//     setActionModalLoading(true);
//     setActionError(null);
    
//     try {
//       const chassisNumber = getChassis(actionVehicle);
      
//       const response = await axiosInstance.post(`/advantage-approval/approve/${chassisNumber}`, {
//         notes: actionNotes || 'Approved'
//       });
      
//       if (response.data && response.data.success === false) {
//         const errorMessage = response.data.message || 'Failed to approve vehicle';
//         const errorDetail = response.data.error || '';
        
//         setActionError(`${errorMessage}${errorDetail ? `: ${errorDetail}` : ''}`);
//         showError(errorMessage);
//         return;
//       }
      
//       showSuccess(response.data?.message || 'Vehicle approved successfully!');
//       setActionModalVisible(false);
//       setActionVehicle(null);
//       setActionType(null);
//       setActionError(null);
//       // Vehicle moved buckets - go to page 1
//       fetchData(1, limit, searchQuery, activeTab);
//       fetchStatistics();
      
//     } catch (error) {
//       console.error('Error approving vehicle:', error);
      
//       let errorMessage = 'Failed to approve vehicle';
//       let errorDetail = '';
      
//       if (error.response) {
//         const responseData = error.response.data;
        
//         if (responseData) {
//           if (responseData.message) {
//             errorMessage = responseData.message;
//           }
//           if (responseData.error) {
//             errorDetail = responseData.error;
//           }
//         }
        
//         const fullErrorMessage = errorDetail 
//           ? `${errorMessage}: ${errorDetail}` 
//           : errorMessage;
          
//         setActionError(fullErrorMessage);
//         showError(errorMessage);
        
//       } else if (error.request) {
//         setActionError('No response from server. Please check your network connection.');
//         showError('Network error: Could not reach the server');
        
//       } else {
//         setActionError(error.message || 'An unexpected error occurred');
//         showError(error.message || 'An unexpected error occurred');
//       }
      
//     } finally {
//       setActionModalLoading(false);
//     }
//   };

//   // Handle reject vehicle from modal
//   const handleRejectFromModal = async () => {
//     if (!actionVehicle) return;
    
//     if (!rejectionReason.trim()) {
//       showError('Please provide a rejection reason');
//       return;
//     }
    
//     setActionModalLoading(true);
//     setActionError(null);
    
//     try {
//       const chassisNumber = getChassis(actionVehicle);
      
//       const response = await axiosInstance.post(`/advantage-approval/reject/${chassisNumber}`, {
//         rejectionReason: rejectionReason,
//         notes: actionNotes || 'Rejected'
//       });
      
//       if (response.data && response.data.success === false) {
//         const errorMessage = response.data.message || 'Failed to reject vehicle';
//         const errorDetail = response.data.error || '';
        
//         setActionError(`${errorMessage}${errorDetail ? `: ${errorDetail}` : ''}`);
//         showError(errorMessage);
//         return;
//       }
      
//       showSuccess(response.data?.message || 'Vehicle rejected successfully!');
//       setActionModalVisible(false);
//       setActionVehicle(null);
//       setActionType(null);
//       setActionError(null);
//       // Vehicle moved buckets - go to page 1
//       fetchData(1, limit, searchQuery, activeTab);
//       fetchStatistics();
      
//     } catch (error) {
//       console.error('Error rejecting vehicle:', error);
      
//       let errorMessage = 'Failed to reject vehicle';
//       let errorDetail = '';
      
//       if (error.response) {
//         const responseData = error.response.data;
//         if (responseData) {
//           if (responseData.message) errorMessage = responseData.message;
//           if (responseData.error) errorDetail = responseData.error;
//         }
//         const fullErrorMessage = errorDetail 
//           ? `${errorMessage}: ${errorDetail}` 
//           : errorMessage;
//         setActionError(fullErrorMessage);
//         showError(errorMessage);
//       } else if (error.request) {
//         setActionError('No response from server. Please check your network connection.');
//         showError('Network error: Could not reach the server');
//       } else {
//         setActionError(error.message || 'An unexpected error occurred');
//         showError(error.message || 'An unexpected error occurred');
//       }
      
//     } finally {
//       setActionModalLoading(false);
//     }
//   };

//   // ========== EDIT FUNCTIONS ==========
  
//   const openEditModal = (vehicle, event) => {
//     if (event) {
//       event.stopPropagation();
//     }
    
//     if (!canUpdateAdvantageTVS) {
//       showError('You do not have permission to edit vehicles');
//       return;
//     }
    
//     const chassisNumber = getChassis(vehicle);
//     if (!chassisNumber) {
//       showError('Vehicle chassis number not found');
//       return;
//     }
    
//     const preview = vehicle.approvalPreview || {};
//     const modelInfo = preview.model || {};
//     const colorInfo = preview.color || {};
//     const branchInfo = preview.branch || {};
//     const vehiclePreviewData = preview.vehicleData || {};
//     const stockData = vehicle.stockData || vehicle.stockDetails || {};
//     const mapping = vehicle.dmsToMisMapping || {};
    
//     let modelId = modelInfo.id || stockData.modelId || '';

//     // Mismatch tab: preview model may have found:false, but if the backend
//     // returned an id we can still use it. Otherwise try to resolve by name.
//     if (!modelId && modelInfo.suggestedName && modelOptions.length > 0) {
//       const target = String(modelInfo.suggestedName).trim().toLowerCase();
//       const m = modelOptions.find(o => (o.label || '').trim().toLowerCase() === target);
//       if (m) modelId = m.value;
//     }

//     // ---- MIS Model value (priority order) ----
//     // 1. existing MIS override (misModelOverride)
//     // 2. matched model from preview
//     // 3. mapping final (only if not "-")
//     // 4. suggested name from preview
//     // ❌ NOT the DMS vehicleModel
//     const misModelOverride = stockData.misModelOverride || '';
//     const modelName = misModelOverride || (
//       modelInfo.found
//         ? (modelInfo.name || '')
//         : (mapping.model?.final && mapping.model.final !== '-'
//             ? mapping.model.final
//             : (modelInfo.suggestedName || ''))
//     );

//     // ---- MIS Colour value (priority order) ----
//     // 1. existing MIS override (misColorOverride)
//     // 2. matched colour from preview
//     // 3. mapping final (only if not "-")
//     // 4. suggested name from preview
//     // ❌ NOT the DMS vehicleColor
//     const misColorOverride = stockData.misColorOverride || '';
//     const misColorFinal = mapping.color?.final && mapping.color.final !== '-'
//       ? mapping.color.final
//       : '';
//     const colorName = cleanValue(
//       misColorOverride ||
//       (colorInfo.found ? colorInfo.name : '') ||
//       misColorFinal ||
//       colorInfo.suggestedName ||
//       ''
//     );

//     const branchNameCandidate =
//       branchInfo.name || branchInfo.suggestedName || stockData.branch || stockData.location || '';

//     let unloadLocationValue = branchInfo.id || '';
//     if (!unloadLocationValue && branchNameCandidate && Array.isArray(branches) && branches.length > 0) {
//       const target = branchNameCandidate.trim().toLowerCase();
//       const matched =
//         branches.find(b => (b.name || '').trim().toLowerCase() === target) ||
//         branches.find(b => (b.name || '').trim().toLowerCase().includes(target)) ||
//         branches.find(b => target.includes((b.name || '').trim().toLowerCase()) && b.name);
//       if (matched) {
//         unloadLocationValue = matched._id || matched.id;
//       }
//     }
    
//     setEditVehicle(vehicle);
//     setEditFormData({
//       modelName: modelName,
//       modelId: modelId,
//       colorName: colorName,
//       type: modelInfo.type || vehiclePreviewData.type || 'ICE',
//       unloadLocation: unloadLocationValue,
//       engineNumber: vehiclePreviewData.engineNumber || stockData.engineNo || '',
//       batteryNumber: vehiclePreviewData.batteryNumber || '',
//       keyNumber: vehiclePreviewData.keyNumber || '',
//       noOfDaysInStockDLR: vehiclePreviewData.noOfDaysInStockDLR || stockData.noOfDaysInStockDLR || 0,
//       notes: vehiclePreviewData.notes || ''
//     });
    
//     if (modelId && modelOptions.length > 0) {
//       const selected = modelOptions.find(opt => opt.value === modelId);
//       setSelectedModelOption(selected || null);
//     } else {
//       setSelectedModelOption(null);
//     }
    
//     if (colorName && colorOptions.length > 0) {
//       const selected = colorOptions.find(
//         opt => opt.label.trim().toLowerCase() === colorName.trim().toLowerCase()
//       );
//       setSelectedColorOption(selected || null);
//     } else {
//       setSelectedColorOption(null);
//     }
//     setPendingColorName(colorName || '');

//     if (!unloadLocationValue && branchNameCandidate) {
//       setPendingBranchName(branchNameCandidate);
//     } else {
//       setPendingBranchName('');
//     }
    
//     if (modelId) {
//       setSelectedModelForColors(modelId);
//       fetchColorsForModel(modelId);
//     } else {
//       setSelectedModelForColors(null);
//       setColors([]);
//       setColorOptions([]);
//     }
    
//     setEditError(null);
//     setEditModalVisible(true);
//   };

//   const handleEditInputChange = (field, value) => {
//     setEditFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleModelChange = (selectedOption) => {
//     const modelId = selectedOption ? selectedOption.value : null;
//     const modelName = selectedOption ? selectedOption.label : '';
    
//     setSelectedModelOption(selectedOption);
//     setSelectedModelForColors(modelId);
//     setSelectedColorOption(null);
//     setPendingColorName('');
    
//     setEditFormData(prev => ({
//       ...prev,
//       modelId: modelId || '',
//       modelName: modelName,
//       colorName: ''
//     }));
    
//     if (modelId) {
//       fetchColorsForModel(modelId);
//     } else {
//       setColors([]);
//       setColorOptions([]);
//     }
//   };

//   const handleColorChange = (selectedOption) => {
//     const colorName = selectedOption ? selectedOption.label : '';
    
//     setSelectedColorOption(selectedOption);
//     setPendingColorName('');
//     setEditFormData(prev => ({
//       ...prev,
//       colorName: colorName
//     }));
//   };

//   // ========== EDIT SUBMIT ==========
//   // ONLY misModel / misColor go to the backend.
//   // vehicleModel / vehicleColor are DMS values and are NEVER sent.
//   const handleEditSubmit = async () => {
//     if (!editVehicle) return;
    
//     if (!editFormData.modelName.trim()) {
//       setEditError('Model Name is required');
//       return;
//     }
    
//     if (!editFormData.colorName.trim()) {
//       setEditError('Color is required');
//       return;
//     }
    
//     const chassisNumber = getChassis(editVehicle);
//     if (!chassisNumber) {
//       setEditError('Chassis number not found');
//       return;
//     }
    
//     try {
//       setEditLoading(true);
//       setEditError(null);
      
//       const payload = {
//         misModel: editFormData.modelName,      // ✅ MIS override only
//         misColor: editFormData.colorName,      // ✅ MIS override only

//         // Non-MIS fields (safe)
//         unloadLocation: editFormData.unloadLocation,
//         engineNumber: editFormData.engineNumber,
//         batteryNumber: editFormData.batteryNumber,
//         keyNumber: editFormData.keyNumber,
//         noOfDaysInStockDLR: Number(editFormData.noOfDaysInStockDLR) || 0,
//         notes: editFormData.notes
//       };
      
//       console.log('[EDIT-SUBMIT] Payload:', payload);
      
//       const response = await axiosInstance.post(
//         `/advantage-approval/edit-and-save/${chassisNumber}`, 
//         payload
//       );
      
//       console.log('[EDIT-SUBMIT] Response:', response.data);
      
//       showSuccess('Vehicle updated successfully!');
//       setEditModalVisible(false);
//       setEditVehicle(null);
//       // Vehicle may have moved buckets - go to page 1
//       fetchData(1, limit, searchQuery, activeTab);
//       fetchStatistics();
//     } catch (error) {
//       console.error('Error updating vehicle:', error);
//       const errorMsg = error.response?.data?.message || 'Failed to update vehicle';
//       setEditError(errorMsg);
//       showError(errorMsg);
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // Render pagination
//   const renderPagination = () => {
//     if (!total || pages <= 1) return null;
    
//     const start = (currentPage - 1) * limit + 1;
//     const end = Math.min(currentPage * limit, total);
    
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3) endPage = Math.min(5, pages);
//     if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);
    
//     const pageNums = [];
//     for (let i = startPage; i <= endPage; i++) pageNums.push(i);
    
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
//             <CFormSelect
//               value={limit}
//               onChange={(e) => handleLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={loading}
//             >
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>
            
//             {startPage > 1 && (
//               <>
//                 <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}
            
//             {pageNums.map(p => (
//               <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(p)} disabled={loading}>
//                 {p}
//               </CPaginationItem>
//             ))}
            
//             {endPage < pages && (
//               <>
//                 {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem onClick={() => handlePageChange(pages)} disabled={loading}>{pages}</CPaginationItem>
//               </>
//             )}
            
//             <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pages || loading}>
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   if (!canViewAdvantageTVS) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Advantage TVS Vehicles.
//       </div>
//     );
//   }

//   if (loading && !vehicleData.length) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         {error}
//       </div>
//     );
//   }

//   // ========== RENDER: PENDING / MISMATCH TAB TABLE ROW ==========
//   const renderPendingRow = (item, index, startRecord) => {
//     const vehicle = item.stockData || item;
//     const preview = item.approvalPreview || {};
//     const mapping = item.dmsToMisMapping || {};
//     const summary = item.summary || {};
//     const approvalStatus = item.approvalStatus || vehicle.approvalStatus || 'pending';
//     const chassisNumber = vehicle.chassisNumber || item.chassisNumber;

//     const dmsModel = mapping.model?.dms || 'N/A';
//     const dmsColor = mapping.color?.dms || 'N/A';
//     const misModel = mapping.model?.final || '-';
//     const misColor = mapping.color?.final || '-';

//     const isModelMismatch = summary.modelMismatch === true;
//     const isColorMismatch = summary.colorMismatch === true;
//     const hasMismatch = summary.hasMismatch === true;

//     const willCreateModel = preview.model?.found === false;
//     const willCreateColor = preview.color?.found === false;
    
//     return (
//       <CTableRow key={chassisNumber || index}>
//         <CTableDataCell>{startRecord + index}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           <CBadge color="primary">
//             {chassisNumber || 'N/A'}
//           </CBadge>
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           {vehicle.engineNo || vehicle.engineNumber || 'N/A'}
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>{dmsModel}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>{dmsColor}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           {misModel}
//           {isModelMismatch && <CBadge color="warning" className="ms-1">model mismatch</CBadge>}
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           {misColor}
//           {isColorMismatch && <CBadge color="danger" className="ms-1">color mismatch</CBadge>}
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>{vehicle.branch || 'N/A'}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>{vehicle.location || 'N/A'}</CTableDataCell>
//         <CTableDataCell>
//           <CBadge color={approvalStatus === 'pending' ? 'warning' : 'success'}>
//             {approvalStatus || 'PENDING'}
//           </CBadge>
//         </CTableDataCell>
//         <CTableDataCell>
//           <div className="d-flex gap-1 flex-wrap">
//             <CButton
//               color="info"
//               size="sm"
//               onClick={(e) => handleViewVehicle(item, e)}
//               disabled={!canViewAdvantageTVS}
//               className="px-2 py-1"
//               title="View Vehicle Details"
//             >
//               <CIcon icon={cilSearch} size="sm" />
//             </CButton>
//             <CButton
//               color="warning"
//               size="sm"
//               onClick={(e) => openEditModal(item, e)}
//               disabled={!canUpdateAdvantageTVS}
//               className="px-2 py-1"
//               title={hasMismatch ? 'Edit Vehicle (fix mismatch)' : 'Edit Vehicle'}
//             >
//               <CIcon icon={cilPencil} size="sm" />
//             </CButton>
//             <CButton
//               color="success"
//               size="sm"
//               onClick={(e) => openActionModal(item, 'approve', e)}
//               disabled={!canUpdateAdvantageTVS || actionLoadingId === chassisNumber || hasMismatch}
//               className="px-2 py-1"
//               title={hasMismatch ? 'Fix mismatch before approving' : 'Approve Vehicle'}
//             >
//               <CIcon icon={cilThumbUp} size="sm" />
//             </CButton>
//             <CButton
//               color="danger"
//               size="sm"
//               onClick={(e) => openActionModal(item, 'reject', e)}
//               disabled={!canUpdateAdvantageTVS || actionLoadingId === chassisNumber}
//               className="px-2 py-1"
//               title="Reject Vehicle"
//             >
//               <CIcon icon={cilThumbDown} size="sm" />
//             </CButton>
//           </div>
//         </CTableDataCell>
//       </CTableRow>
//     );
//   };

//   // ========== RENDER: REJECTED TAB TABLE ROW ==========
//   const renderRejectedRow = (item, index, startRecord) => {
//     const stockDetails = item.stockDetails || {};
//     const chassisNumber = item.chassisNumber || stockDetails.chassisNumber;
//     const category = stockDetails.vehicleCategory || 'N/A';
//     const model = item.vehicleModel || stockDetails.vehicleModel || 'N/A';

//     return (
//       <CTableRow key={item._id || chassisNumber || index}>
//         <CTableDataCell>{startRecord + index}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           <CBadge color="primary">{chassisNumber || 'N/A'}</CBadge>
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>{category}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>{model}</CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           <CBadge color="danger">{item.status || 'rejected'}</CBadge>
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           {item.rejectionReason || 'N/A'}
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           {item.notes || 'N/A'}
//         </CTableDataCell>
//         <CTableDataCell style={{ fontSize: '12px' }}>
//           {item.rejectedAt ? formatDateTime(item.rejectedAt) : 'N/A'}
//         </CTableDataCell>
//         <CTableDataCell>
//           <div className="d-flex gap-1 flex-wrap">
//             <CButton
//               color="info"
//               size="sm"
//               onClick={(e) => handleViewVehicle(item, e)}
//               disabled={!canViewAdvantageTVS}
//               className="px-2 py-1"
//               title="View Vehicle Details"
//             >
//               <CIcon icon={cilSearch} size="sm" />
//             </CButton>
//           </div>
//         </CTableDataCell>
//       </CTableRow>
//     );
//   };

//   return (
//     <div>
//       <div className='title'>Advantage TVS Vehicles</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header'>
//           {/* ========== TABS ========== */}
//           <CNav variant="tabs" className="card-header-tabs mb-2">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === TAB_PENDING}
//                 onClick={() => handleTabChange(TAB_PENDING)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Pending
//                 {stats.readyToApprove > 0 && (
//                   <CBadge color="warning" className="ms-2">{stats.readyToApprove}</CBadge>
//                 )}
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === TAB_REJECTED}
//                 onClick={() => handleTabChange(TAB_REJECTED)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Rejected
//                 {stats.rejected > 0 && (
//                   <CBadge color="danger" className="ms-2">{stats.rejected}</CBadge>
//                 )}
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === TAB_MISMATCH}
//                 onClick={() => handleTabChange(TAB_MISMATCH)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 Model/Color Mismatch
//                 {stats.mismatch > 0 && (
//                   <CBadge color="info" className="ms-2">{stats.mismatch}</CBadge>
//                 )}
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           {/* ========== HEADER INFO + EXPORT ========== */}
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
//             <div>
//               <CBadge color={activeTab === TAB_PENDING ? 'info' : 'secondary'} className="me-2">
//                 Total: {total || 0}
//               </CBadge>
//               {searchQuery && (
//                 <CBadge color="secondary" className="me-2">
//                   Filtered: {filteredCount}
//                 </CBadge>
//               )}
//               <CBadge
//                 color={
//                   activeTab === TAB_PENDING
//                     ? 'warning'
//                     : activeTab === TAB_MISMATCH
//                       ? 'info'
//                       : 'danger'
//                 }
//                 className="me-2"
//               >
//                 Status: {
//                   activeTab === TAB_PENDING
//                     ? 'Pending'
//                     : activeTab === TAB_MISMATCH
//                       ? 'Model/Color Mismatch'
//                       : 'Rejected'
//                 }
//               </CBadge>
//               {activeTab === TAB_MISMATCH && (stats.modelMismatch > 0 || stats.colorMismatch > 0) && (
//                 <>
//                   <CBadge color="warning" className="me-2">
//                     Model: {stats.modelMismatch}
//                   </CBadge>
//                   <CBadge color="danger" className="me-2">
//                     Color: {stats.colorMismatch}
//                   </CBadge>
//                 </>
//               )}
//             </div>
//             <div className="d-flex align-items-center gap-2">
//               {activeTab === TAB_PENDING && (
//                 <CButton
//                   color="success"
//                   size="sm"
//                   onClick={handleExport}
//                   disabled={exportLoading || loading}
//                 >
//                   {exportLoading ? <CSpinner size="sm" /> : <CIcon icon={cilCloudDownload} className="me-1" />}
//                   Export
//                 </CButton>
//               )}
//             </div>
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
//                 placeholder={
//                   activeTab === TAB_REJECTED
//                     ? "Search by chassis, make, model..."
//                     : activeTab === TAB_MISMATCH
//                       ? "Search by chassis, model, color..."
//                       : "Search by chassis, model, branch..."
//                 }
//               />
//             </div>
//           </div>
          
//           {loading && vehicleData.length > 0 && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}
          
//           <div
//             className="responsive-table-wrapper"
//             style={{
//               opacity: loading && vehicleData.length > 0 ? 0.6 : 1,
//               transition: 'opacity 0.2s'
//             }}
//           >
//             {/* ========== PENDING / MISMATCH COLOR TABLE ========== */}
//             {isPendingStyleTab && (
//               <CTable striped bordered hover className='responsive-table'>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                     <CTableHeaderCell>Chassis #</CTableHeaderCell>
//                     <CTableHeaderCell>Engine #</CTableHeaderCell>
//                     <CTableHeaderCell>DMS Model</CTableHeaderCell>
//                     <CTableHeaderCell>DMS Color</CTableHeaderCell>
//                     <CTableHeaderCell>MIS Model</CTableHeaderCell>
//                     <CTableHeaderCell>MIS Color</CTableHeaderCell>
//                     <CTableHeaderCell>Branch</CTableHeaderCell>
//                     <CTableHeaderCell>Location</CTableHeaderCell>
//                     <CTableHeaderCell>Approval Status</CTableHeaderCell>
//                     <CTableHeaderCell>Actions</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {vehicleData.length === 0 && !loading ? (
//                     <CTableRow>
//                       <CTableDataCell colSpan="11" className="text-center">
//                         {searchQuery
//                           ? `No results found for "${searchQuery}"`
//                           : activeTab === TAB_MISMATCH
//                             ? 'No Model/Color Mismatch vehicles available'
//                             : 'No pending vehicles available'}
//                       </CTableDataCell>
//                     </CTableRow>
//                   ) : (
//                     vehicleData.map((item, index) => {
//                       const startRecord = (currentPage - 1) * limit + 1;
//                       return renderPendingRow(item, index, startRecord);
//                     })
//                   )}
//                 </CTableBody>
//               </CTable>
//             )}

//             {/* ========== REJECTED TABLE ========== */}
//             {activeTab === TAB_REJECTED && (
//               <CTable striped bordered hover className='responsive-table'>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                     <CTableHeaderCell>Chassis #</CTableHeaderCell>
//                     <CTableHeaderCell>Category</CTableHeaderCell>
//                     <CTableHeaderCell>Model</CTableHeaderCell>
//                     <CTableHeaderCell>Status</CTableHeaderCell>
//                     <CTableHeaderCell>Rejection Reason</CTableHeaderCell>
//                     <CTableHeaderCell>Notes</CTableHeaderCell>
//                     <CTableHeaderCell>Rejected At</CTableHeaderCell>
//                     <CTableHeaderCell>Actions</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {vehicleData.length === 0 && !loading ? (
//                     <CTableRow>
//                       <CTableDataCell colSpan="9" className="text-center">
//                         {searchQuery
//                           ? `No results found for "${searchQuery}"`
//                           : 'No rejected vehicles available'}
//                       </CTableDataCell>
//                     </CTableRow>
//                   ) : (
//                     vehicleData.map((item, index) => {
//                       const startRecord = (currentPage - 1) * limit + 1;
//                       return renderRejectedRow(item, index, startRecord);
//                     })
//                   )}
//                 </CTableBody>
//               </CTable>
//             )}
//           </div>
          
//           {renderPagination()}
//         </CCardBody>
//       </CCard>

//       {/* ========== ACTION MODAL (Approve/Reject) ========== */}
//       <CModal 
//         visible={actionModalVisible} 
//         onClose={() => {
//           setActionModalVisible(false);
//           setActionVehicle(null);
//           setActionType(null);
//           setActionNotes('');
//           setRejectionReason('');
//           setActionError(null);
//         }}
//         size="md"
//       >
//         <CModalHeader className="border-bottom">
//           <CModalTitle className="d-flex align-items-center">
//             <CIcon 
//               icon={actionType === 'approve' ? cilThumbUp : cilThumbDown} 
//               className={`me-2 ${actionType === 'approve' ? 'text-success' : 'text-danger'}`} 
//             />
//             {actionType === 'approve' ? 'Approve Vehicle' : 'Reject Vehicle'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {actionVehicle && (
//             <div>
//               {actionError && (
//                 <CAlert color="danger" className="mb-3">
//                   <div className="d-flex align-items-start">
//                     <CIcon icon={cilWarning} className="me-2 mt-1 flex-shrink-0" />
//                     <div>
//                       <strong>Error:</strong> {actionError}
//                     </div>
//                   </div>
//                 </CAlert>
//               )}

//               <div className="card border-0 bg-light mb-3">
//                 <div className="card-body">
//                   <h6 className="card-title mb-3">Vehicle Details</h6>
//                   <div className="row">
//                     <div className="col-6">
//                       <label className="text-muted small fw-bold">Chassis Number</label>
//                       <p className="mb-1 fw-bold">
//                         {getChassis(actionVehicle) || 'N/A'}
//                       </p>
//                     </div>
//                     <div className="col-6">
//                       <label className="text-muted small fw-bold">DMS Model</label>
//                       <p className="mb-1">{actionVehicle.dmsToMisMapping?.model?.dms || actionVehicle.stockDetails?.vehicleModel || 'N/A'}</p>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-6">
//                       <label className="text-muted small fw-bold">MIS Model</label>
//                       <p className="mb-1">{actionVehicle.dmsToMisMapping?.model?.final || '-'}</p>
//                     </div>
//                     <div className="col-6">
//                       <label className="text-muted small fw-bold">MIS Color</label>
//                       <p className="mb-1">{actionVehicle.dmsToMisMapping?.color?.final || '-'}</p>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-6">
//                       <label className="text-muted small fw-bold">Branch</label>
//                       <p className="mb-1">{actionVehicle.stockData?.branch || actionVehicle.stockDetails?.branch || 'N/A'}</p>
//                     </div>
//                     <div className="col-6">
//                       <label className="text-muted small fw-bold">Location</label>
//                       <p className="mb-1">{actionVehicle.stockData?.location || actionVehicle.stockDetails?.location || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {actionType === 'reject' && (
//                 <div className="mb-3">
//                   <CFormLabel className="fw-bold">
//                     Rejection Reason <span className="text-danger">*</span>
//                   </CFormLabel>
//                   <CFormSelect
//                     value={rejectionReason}
//                     onChange={(e) => setRejectionReason(e.target.value)}
//                     className="mb-2"
//                   >
//                     <option value="">Select rejection reason...</option>
//                     <option value="Missing required documents">Missing required documents</option>
//                     <option value="Invalid vehicle details">Invalid vehicle details</option>
//                     <option value="Duplicate entry">Duplicate entry</option>
//                     <option value="Customer requested cancellation">Customer requested cancellation</option>
//                     <option value="Model/Color mismatch">Model/Color mismatch</option>
//                     <option value="Incomplete information">Incomplete information</option>
//                     <option value="Other">Other</option>
//                   </CFormSelect>
//                   {!rejectionReason && (
//                     <div className="text-danger small">Please select a rejection reason</div>
//                   )}
//                 </div>
//               )}

//               <div className="mb-3">
//                 <CFormLabel className="fw-bold">
//                   {actionType === 'approve' ? 'Approval Notes' : 'Additional Notes'}
//                 </CFormLabel>
//                 <CFormTextarea
//                   rows={3}
//                   value={actionNotes}
//                   onChange={(e) => setActionNotes(e.target.value)}
//                   placeholder={actionType === 'approve' 
//                     ? 'Add notes for approval (optional)' 
//                     : 'Add additional notes for rejection (optional)'
//                   }
//                   className="form-control"
//                 />
//               </div>

//               {actionType === 'approve' && (
//                 <CAlert color="info" className="mt-3">
//                   <CIcon icon={cilInfo} className="me-2" />
//                   <span>
//                     <strong>Approve:</strong> This will create the vehicle in the system.
//                     The model and colour must already exist in master data.
//                   </span>
//                 </CAlert>
//               )}

//               {actionType === 'reject' && (
//                 <CAlert color="warning" className="mt-3">
//                   <CIcon icon={cilWarning} className="me-2" />
//                   <span>
//                     <strong>Reject:</strong> This will reject the vehicle and it will not be added to the system.
//                     The vehicle record will be marked as rejected.
//                   </span>
//                 </CAlert>
//               )}
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setActionModalVisible(false);
//               setActionVehicle(null);
//               setActionType(null);
//               setActionNotes('');
//               setRejectionReason('');
//               setActionError(null);
//             }}
//             disabled={actionModalLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color={actionType === 'approve' ? 'success' : 'danger'}
//             onClick={actionType === 'approve' ? handleApproveFromModal : handleRejectFromModal}
//             disabled={actionModalLoading || (actionType === 'reject' && !rejectionReason.trim())}
//           >
//             {actionModalLoading ? (
//               <><CSpinner size="sm" className="me-2" /> Processing...</>
//             ) : (
//               <><CIcon icon={actionType === 'approve' ? cilCheck : cilX} className="me-1" /> 
//               {actionType === 'approve' ? 'Approve' : 'Reject'}
//               </>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* ========== EDIT MODAL ========== */}
//       <CModal 
//         visible={editModalVisible} 
//         onClose={() => {
//           setEditModalVisible(false);
//           setEditVehicle(null);
//           setEditError(null);
//           setColors([]);
//           setColorOptions([]);
//           setSelectedModelForColors(null);
//           setSelectedModelOption(null);
//           setSelectedColorOption(null);
//           setPendingColorName('');
//           setPendingBranchName('');
//         }}
//         size="lg"
//         scrollable
//       >
//         <CModalHeader className="border-bottom">
//           <CModalTitle className="d-flex align-items-center">
//             <CIcon icon={cilPencil} className="me-2 text-warning" />
//             Edit Vehicle Details
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {editVehicle && (
//             <div>
//               <div className="alert alert-info d-flex align-items-center mb-4">
//                 <CIcon icon={cilInfo} className="me-2" />
//                 <span>
//                   <strong>Editing:</strong> Chassis #{getChassis(editVehicle) || 'N/A'}
//                 </span>
//               </div>

//               {editVehicle.dmsToMisMapping && (
//                 <div className="card border-0 bg-light mb-4">
//                   <div className="card-body">
//                     <h6 className="card-title mb-3">
//                       <CIcon icon={cilInfo} className="me-2 text-primary" />
//                       DMS vs MIS Mapping
//                     </h6>
//                     <div className="row">
//                       <div className="col-md-6">
//                         <label className="text-muted small fw-bold">DMS Model (Read-only)</label>
//                         <p className="mb-2">{editVehicle.dmsToMisMapping.model?.dms || 'N/A'}</p>
//                         <label className="text-muted small fw-bold">DMS Color (Read-only)</label>
//                         <p className="mb-2">{editVehicle.dmsToMisMapping.color?.dms || 'N/A'}</p>
//                       </div>
//                       <div className="col-md-6">
//                         <label className="text-muted small fw-bold">MIS Model (Final)</label>
//                         <p className="mb-2 fw-bold text-success">
//                           {editVehicle.dmsToMisMapping.model?.final || '-'}
//                         </p>
//                         <label className="text-muted small fw-bold">MIS Color (Final)</label>
//                         <p className="mb-2 fw-bold text-success">
//                           {editVehicle.dmsToMisMapping.color?.final || '-'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="alert alert-secondary mb-0 py-2 small">
//                       <CIcon icon={cilInfo} className="me-1" />
//                       DMS values are never changed. Your edits below set the MIS override.
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {editError && (
//                 <CAlert color="danger" className="mb-3">
//                   <CIcon icon={cilWarning} className="me-2" />
//                   {editError}
//                 </CAlert>
//               )}

//               <CForm>
//                 <CRow className="mb-3">
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">MIS Model <span className="text-danger">*</span></CFormLabel>
//                     <Select
//                       classNamePrefix="react-select"
//                       placeholder={modelsLoading ? 'Loading models...' : 'Select MIS Model'}
//                       isLoading={modelsLoading}
//                       isClearable
//                       options={modelOptions}
//                       value={selectedModelOption}
//                       onChange={handleModelChange}
//                       isDisabled={editLoading}
//                     />
//                     {!selectedModelOption && !modelsLoading && (
//                       <div className="text-muted small mt-1">Please select a model</div>
//                     )}
//                   </CCol>
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">MIS Color <span className="text-danger">*</span></CFormLabel>
//                     <Select
//                       classNamePrefix="react-select"
//                       placeholder={
//                         colorsLoading 
//                           ? 'Loading colors...' 
//                           : (selectedModelForColors 
//                             ? 'Select MIS Color' 
//                             : 'Select model first')
//                       }
//                       isLoading={colorsLoading}
//                       isClearable
//                       options={colorOptions}
//                       value={selectedColorOption}
//                       onChange={handleColorChange}
//                       isDisabled={!selectedModelForColors || editLoading}
//                       noOptionsMessage={() => {
//                         if (!selectedModelForColors) return 'Select a model first';
//                         if (colorOptions.length === 0) return 'No colors available';
//                         return 'No options';
//                       }}
//                     />
//                     {selectedModelForColors && colorOptions.length === 0 && !colorsLoading && (
//                       <div className="text-muted small mt-1">No colors available for this model</div>
//                     )}
//                     {!selectedModelForColors && !modelsLoading && (
//                       <div className="text-muted small mt-1">Select a model to load colors</div>
//                     )}
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">Vehicle Type</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       value={editFormData.type}
//                       disabled={true}
//                       className="bg-light"
//                     />
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md="12">
//                     <CFormLabel className="fw-bold">Unload Location / Branch</CFormLabel>
//                     <CFormSelect
//                       value={editFormData.unloadLocation}
//                       onChange={(e) => {
//                         setPendingBranchName('');
//                         handleEditInputChange('unloadLocation', e.target.value);
//                       }}
//                       disabled={branchesLoading || editLoading}
//                     >
//                       <option value="">Select a branch...</option>
//                       {Array.isArray(branches) && branches.map((branch) => (
//                         <option key={branch._id || branch.id} value={branch._id || branch.id}>
//                           {branch.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                     {branchesLoading && (
//                       <div className="text-muted small mt-1">
//                         <CSpinner size="sm" className="me-1" /> Loading branches...
//                       </div>
//                     )}
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">Engine Number</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       value={editFormData.engineNumber}
//                       onChange={(e) => handleEditInputChange('engineNumber', e.target.value)}
//                       placeholder="Enter engine number"
//                       disabled={editLoading}
//                     />
//                   </CCol>
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">Battery Number</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       value={editFormData.batteryNumber}
//                       onChange={(e) => handleEditInputChange('batteryNumber', e.target.value)}
//                       placeholder="Enter battery number"
//                       disabled={editLoading}
//                     />
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">Key Number</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       value={editFormData.keyNumber}
//                       onChange={(e) => handleEditInputChange('keyNumber', e.target.value)}
//                       placeholder="Enter key number"
//                       disabled={editLoading}
//                     />
//                   </CCol>
//                   <CCol md="6">
//                     <CFormLabel className="fw-bold">Days in Stock DLR</CFormLabel>
//                     <CFormInput
//                       type="number"
//                       value={editFormData.noOfDaysInStockDLR}
//                       onChange={(e) => handleEditInputChange('noOfDaysInStockDLR', e.target.value)}
//                       placeholder="Enter days in stock"
//                       min="0"
//                       disabled={editLoading}
//                     />
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3">
//                   <CCol md="12">
//                     <CFormLabel className="fw-bold">Notes</CFormLabel>
//                     <CFormTextarea
//                       rows={3}
//                       value={editFormData.notes}
//                       onChange={(e) => handleEditInputChange('notes', e.target.value)}
//                       placeholder="Enter any additional notes"
//                       disabled={editLoading}
//                     />
//                   </CCol>
//                 </CRow>

//                 <CAlert color="secondary" className="mt-3">
//                   <h6 className="mb-2">
//                     <CIcon icon={cilInfo} className="me-2" />
//                     Summary of Changes
//                   </h6>
//                   <div className="small">
//                     <p className="mb-1"><strong>MIS Model:</strong> {editFormData.modelName || '(not selected)'}</p>
//                     <p className="mb-1"><strong>MIS Color:</strong> {editFormData.colorName || '(not selected)'}</p>
//                     <p className="mb-1"><strong>Type:</strong> {editFormData.type}</p>
//                     <p className="mb-1"><strong>Branch:</strong> {
//                       Array.isArray(branches) && branches.find(b => (b._id || b.id) === editFormData.unloadLocation)?.name || 
//                       editFormData.unloadLocation || 
//                       '(not selected)'
//                     }</p>
//                     <p className="mb-0"><strong>Engine:</strong> {editFormData.engineNumber || '(empty)'}</p>
//                   </div>
//                 </CAlert>
//               </CForm>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setEditModalVisible(false);
//               setEditVehicle(null);
//               setEditError(null);
//               setColors([]);
//               setColorOptions([]);
//               setSelectedModelForColors(null);
//               setSelectedModelOption(null);
//               setSelectedColorOption(null);
//               setPendingColorName('');
//               setPendingBranchName('');
//             }}
//             disabled={editLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="warning" 
//             onClick={handleEditSubmit}
//             disabled={editLoading || !editFormData.modelName.trim() || !editFormData.colorName.trim()}
//           >
//             {editLoading ? (
//               <><CSpinner size="sm" className="me-2" /> Saving...</>
//             ) : (
//               <><CIcon icon={cilSave} className="me-1" /> Save Changes</>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* ========== VIEW VEHICLE MODAL ========== */}
//       <CModal 
//         visible={viewModalVisible} 
//         onClose={() => {
//           setViewModalVisible(false);
//           setSelectedVehicle(null);
//         }}
//         size="lg"
//         scrollable
//       >
//         <CModalHeader className="border-bottom-0">
//           <CModalTitle className="d-flex align-items-center">
//             <CIcon icon={cilInfo} className="me-2 text-primary" />
//             Vehicle {activeTab === TAB_REJECTED ? 'Rejection Details' : 'Preview After Approval'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody className="pt-0">
//           {selectedVehicle && (
//             <div className="vehicle-details">
//               {activeTab === TAB_REJECTED ? (
//                 <>
//                   <div className="alert alert-danger d-flex align-items-center mb-4">
//                     <CIcon icon={cilXCircle} className="me-2" />
//                     <span>
//                       <strong>Rejected:</strong> This vehicle was rejected and is not part of active inventory.
//                     </span>
//                   </div>

//                   <div className="card border-0 shadow-sm mb-4">
//                     <div className="card-header bg-danger text-white">
//                       <h6 className="mb-0">
//                         <CIcon icon={cilXCircle} className="me-2" />
//                         Rejection Details
//                       </h6>
//                     </div>
//                     <div className="card-body">
//                       <div className="row">
//                         <div className="col-md-6">
//                           <label className="text-muted small fw-bold">Chassis Number</label>
//                           <p className="mb-3 fw-bold">
//                             {selectedVehicle.chassisNumber || selectedVehicle.stockData?.chassisNumber || selectedVehicle.stockDetails?.chassisNumber || 'N/A'}
//                           </p>
//                           <label className="text-muted small fw-bold">Category</label>
//                           <p className="mb-3">{selectedVehicle.vehicleCategory || selectedVehicle.stockDetails?.vehicleCategory || 'N/A'}</p>
//                           <label className="text-muted small fw-bold">Model</label>
//                           <p className="mb-0">{selectedVehicle.vehicleModel || selectedVehicle.stockDetails?.vehicleModel || 'N/A'}</p>
//                         </div>
//                         <div className="col-md-6">
//                           <label className="text-muted small fw-bold">Status</label>
//                           <p className="mb-3">
//                             <CBadge color="danger">
//                               {selectedVehicle.status || 'rejected'}
//                             </CBadge>
//                           </p>
//                           <label className="text-muted small fw-bold">Rejected At</label>
//                           <p className="mb-3">
//                             {selectedVehicle.rejectedAt 
//                               ? formatDateTime(selectedVehicle.rejectedAt) 
//                               : 'N/A'}
//                           </p>
//                           <label className="text-muted small fw-bold">Rejection Reason</label>
//                           <p className="mb-0 text-danger fw-bold">
//                             {selectedVehicle.rejectionReason || 'N/A'}
//                           </p>
//                         </div>
//                       </div>
//                       {selectedVehicle.notes && (
//                         <>
//                           <hr />
//                           <label className="text-muted small fw-bold">Notes</label>
//                           <p className="mb-0">{selectedVehicle.notes}</p>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {selectedVehicle.stockDetails && (
//                     <div className="card border-0 shadow-sm mb-4">
//                       <div className="card-header bg-light">
//                         <h6 className="mb-0">
//                           <CIcon icon={cilCloudDownload} className="me-2 text-secondary" />
//                           Source Stock Data (From Excel)
//                         </h6>
//                       </div>
//                       <div className="card-body">
//                         <div className="row">
//                           <div className="col-md-6">
//                             <label className="text-muted small fw-bold">Branch</label>
//                             <p className="mb-2">{selectedVehicle.stockDetails.branch || 'N/A'}</p>
//                           </div>
//                           <div className="col-md-6">
//                             <label className="text-muted small fw-bold">Location</label>
//                             <p className="mb-2">{selectedVehicle.stockDetails.location || 'N/A'}</p>
//                           </div>
//                         </div>
//                         <div className="row">
//                           <div className="col-md-6">
//                             <label className="text-muted small fw-bold">Engine No</label>
//                             <p className="mb-2">{selectedVehicle.stockDetails.engineNo || 'N/A'}</p>
//                           </div>
//                           <div className="col-md-6">
//                             <label className="text-muted small fw-bold">Vehicle Color</label>
//                             <p className="mb-2">{selectedVehicle.stockDetails.vehicleColor || 'N/A'}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 (() => {
//                   const preview = selectedVehicle.approvalPreview || {};
//                   const stockData = selectedVehicle.stockData || selectedVehicle.stockDetails || {};
//                   const approvalInfo = selectedVehicle.summary || {};
//                   const mapping = selectedVehicle.dmsToMisMapping || {};

//                   const vehiclePreviewData = preview.vehicleData || {};
//                   const modelInfo = preview.model || {};
//                   const colorInfo = preview.color || {};
//                   const branchInfo = preview.branch || {};

//                   const isModelMismatch = approvalInfo.modelMismatch === true;
//                   const isColorMismatch = approvalInfo.colorMismatch === true;

//                   return (
//                     <>
//                       {isModelMismatch && (
//                         <div className="alert alert-warning d-flex align-items-center mb-4">
//                           <CIcon icon={cilWarning} className="me-2" />
//                           <span>
//                             <strong>Model mismatch:</strong> DMS model "{mapping.model?.dms || 'N/A'}" is not available in Model Master.
//                             Edit the vehicle and pick a valid model before approving.
//                           </span>
//                         </div>
//                       )}

//                       {isColorMismatch && (
//                         <div className="alert alert-danger d-flex align-items-center mb-4">
//                           <CIcon icon={cilWarning} className="me-2" />
//                           <span>
//                             <strong>Color mismatch:</strong> DMS color "{mapping.color?.dms || 'N/A'}" is not mapped to a colour on this MIS model.
//                             Edit the vehicle and pick a valid colour before approving.
//                           </span>
//                         </div>
//                       )}

//                       {!isModelMismatch && !isColorMismatch && (
//                         <div className="alert alert-info d-flex align-items-center mb-4">
//                           <CIcon icon={cilCheck} className="me-2" />
//                           <span>
//                             <strong>Preview:</strong> This is how the vehicle will appear in the system after approval.
//                           </span>
//                         </div>
//                       )}

//                       <div className="card border-0 shadow-sm mb-4">
//                         <div className="card-header bg-primary text-white">
//                           <h6 className="mb-0">
//                             <CIcon icon={cilInfo} className="me-2" />
//                             DMS → MIS Mapping
//                           </h6>
//                         </div>
//                         <div className="card-body">
//                           <div className="row">
//                             <div className="col-md-6">
//                               <label className="text-muted small fw-bold">DMS Model</label>
//                               <p className="mb-3">{mapping.model?.dms || 'N/A'}</p>
//                               <label className="text-muted small fw-bold">DMS Color</label>
//                               <p className="mb-0">{mapping.color?.dms || 'N/A'}</p>
//                             </div>
//                             <div className="col-md-6">
//                               <label className="text-muted small fw-bold">MIS Model (Final)</label>
//                               <p className="mb-3 fw-bold text-success">
//                                 {mapping.model?.final || '-'}
//                               </p>
//                               <label className="text-muted small fw-bold">MIS Color (Final)</label>
//                               <p className="mb-0 fw-bold text-success">
//                                 {mapping.color?.final || '-'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="card border-0 shadow-sm mb-4">
//                         <div className="card-header bg-light">
//                           <h5 className="mb-0">
//                             <CIcon icon={cilCheckCircle} className="me-2 text-success" />
//                             Vehicle Preview
//                           </h5>
//                         </div>
//                         <div className="card-body">
//                           <div className="row">
//                             <div className="col-md-6">
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Chassis Number</label>
//                                 <p className="fw-bold mb-0">{vehiclePreviewData.chassisNumber || stockData.chassisNumber || 'N/A'}</p>
//                               </div>
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Engine Number</label>
//                                 <p className="mb-0">{vehiclePreviewData.engineNumber || stockData.engineNo || 'N/A'}</p>
//                               </div>
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Model Name (MIS)</label>
//                                 <p className="mb-0">{vehiclePreviewData.modelName || '-'}</p>
//                               </div>
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Type</label>
//                                 <p className="mb-0">
//                                   <CBadge color={vehiclePreviewData.type === 'EV' ? 'success' : 'primary'}>
//                                     {vehiclePreviewData.type || 'N/A'}
//                                   </CBadge>
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="col-md-6">
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Color (MIS)</label>
//                                 <p className="mb-0">{vehiclePreviewData.colorName || '-'}</p>
//                               </div>
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Location Type</label>
//                                 <p className="mb-0">
//                                   <CBadge color="secondary">
//                                     {vehiclePreviewData.locationType || 'N/A'}
//                                   </CBadge>
//                                 </p>
//                               </div>
//                               <div className="mb-3">
//                                 <label className="text-muted small fw-bold">Status</label>
//                                 <p className="mb-0">
//                                   <CBadge color={vehiclePreviewData.status === 'in_stock' ? 'success' : 'warning'}>
//                                     {vehiclePreviewData.status || 'N/A'}
//                                   </CBadge>
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="row g-3 mb-4">
//                         <div className="col-md-4">
//                           <div className={`card border-0 shadow-sm h-100 ${modelInfo.found ? 'border-success border-2' : 'border-danger border-2'}`}>
//                             <div className="card-body text-center">
//                               <CIcon icon={modelInfo.found ? cilCheckCircle : cilXCircle} 
//                                 size="2xl" 
//                                 className={`mb-2 ${modelInfo.found ? 'text-success' : 'text-danger'}`} 
//                               />
//                               <h6 className="fw-bold">Model Match</h6>
//                               <CBadge color={modelInfo.found ? 'success' : 'danger'}>
//                                 {modelInfo.found ? 'Found ✓' : 'Not Found ✗'}
//                               </CBadge>
//                               {(modelInfo.name || modelInfo.suggestedName) && (
//                                 <p className="small text-muted mt-2 mb-0">{modelInfo.name || modelInfo.suggestedName}</p>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="col-md-4">
//                           <div className={`card border-0 shadow-sm h-100 ${colorInfo.found ? 'border-success border-2' : 'border-danger border-2'}`}>
//                             <div className="card-body text-center">
//                               <CIcon icon={colorInfo.found ? cilCheckCircle : cilXCircle} 
//                                 size="2xl" 
//                                 className={`mb-2 ${colorInfo.found ? 'text-success' : 'text-danger'}`} 
//                               />
//                               <h6 className="fw-bold">Color Match</h6>
//                               <CBadge color={colorInfo.found ? 'success' : 'danger'}>
//                                 {colorInfo.found ? 'Found ✓' : 'Not Found ✗'}
//                               </CBadge>
//                               {(colorInfo.name || colorInfo.suggestedName) && (
//                                 <p className="small text-muted mt-2 mb-0">{colorInfo.name || colorInfo.suggestedName}</p>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="col-md-4">
//                           <div className={`card border-0 shadow-sm h-100 ${branchInfo?.found ? 'border-success border-2' : 'border-warning border-2'}`}>
//                             <div className="card-body text-center">
//                               <CIcon icon={branchInfo?.found ? cilCheckCircle : cilWarning} 
//                                 size="2xl" 
//                                 className={`mb-2 ${branchInfo?.found ? 'text-success' : 'text-warning'}`} 
//                               />
//                               <h6 className="fw-bold">Branch Match</h6>
//                               <CBadge color={branchInfo?.found ? 'success' : 'warning'}>
//                                 {branchInfo?.found ? 'Found ✓' : 'Will Need Create'}
//                               </CBadge>
//                               {(branchInfo?.name || branchInfo?.suggestedName) && (
//                                 <p className="small text-muted mt-2 mb-0">{branchInfo.name || branchInfo.suggestedName}</p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {stockData && Object.keys(stockData).length > 0 && (
//                         <div className="card border-0 shadow-sm">
//                           <div className="card-header bg-light">
//                             <h6 className="mb-0">
//                               <CIcon icon={cilCloudDownload} className="me-2 text-secondary" />
//                               Source Stock Data (From Excel)
//                             </h6>
//                           </div>
//                           <div className="card-body">
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">Chassis</label>
//                                 <p className="mb-2">{stockData.chassisNumber || 'N/A'}</p>
//                               </div>
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">Engine</label>
//                                 <p className="mb-2">{stockData.engineNo || 'N/A'}</p>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">DMS Vehicle Model</label>
//                                 <p className="mb-2">{stockData.vehicleModel || 'N/A'}</p>
//                               </div>
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">DMS Vehicle Color</label>
//                                 <p className="mb-2">{stockData.vehicleColor || 'N/A'}</p>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">Branch</label>
//                                 <p className="mb-2">{stockData.branch || 'N/A'}</p>
//                               </div>
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">Location</label>
//                                 <p className="mb-2">{stockData.location || 'N/A'}</p>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">TVS Invoice No</label>
//                                 <p className="mb-2">{stockData.tvsInvoiceNo || 'N/A'}</p>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">TVS Invoice Date</label>
//                                 <p className="mb-2">{formatDate(stockData.tvsInvoiceDate)}</p>
//                               </div>
//                               <div className="col-md-6">
//                                 <label className="text-muted small fw-bold">Series</label>
//                                 <p className="mb-2">{stockData.series || 'N/A'}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {canUpdateAdvantageTVS && (
//                         <div className="mt-4 d-flex gap-2 justify-content-end border-top pt-3">
//                           <CButton 
//                             color="success" 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setViewModalVisible(false);
//                               openActionModal(selectedVehicle, 'approve', e);
//                             }}
//                             disabled={actionLoadingId === (selectedVehicle._id || selectedVehicle.id) || isModelMismatch || isColorMismatch}
//                             title={isModelMismatch || isColorMismatch ? 'Fix mismatch before approving' : 'Approve'}
//                             className="px-4"
//                           >
//                             <CIcon icon={cilCheck} className="me-1" /> Approve
//                           </CButton>
//                           <CButton 
//                             color="danger" 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setViewModalVisible(false);
//                               openActionModal(selectedVehicle, 'reject', e);
//                             }}
//                             disabled={actionLoadingId === (selectedVehicle._id || selectedVehicle.id)}
//                             className="px-4"
//                           >
//                             <CIcon icon={cilX} className="me-1" /> Reject
//                           </CButton>
//                         </div>
//                       )}
//                     </>
//                   );
//                 })()
//               )}
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter className="border-top-0">
//           <CButton color="secondary" onClick={() => {
//             setViewModalVisible(false);
//             setSelectedVehicle(null);
//           }}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default AdvantageTVSVehicles;






import '../../css/table.css';
import { useRef } from 'react';
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
} from '../../utils/tableImports';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES, 
  ACTIONS, 
  TABS, 
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
  CModalBody,
  CModalTitle,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CAlert,
  CFormTextarea,
  CForm,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilTrash, 
  cilCheckCircle, 
  cilXCircle,
  cilCloudDownload,
  cilChevronLeft,
  cilChevronRight,
  cilCheck,
  cilX,
  cilPencil,
  cilInfo,
  cilWarning,
  cilThumbUp,
  cilThumbDown,
  cilSearch,
  cilSave
} from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';
import Select from 'react-select';

// Constants
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];
const DEFAULT_LIMIT = 5;

// Tab keys
const TAB_PENDING = 'pending';
const TAB_REJECTED = 'rejected';
const TAB_MISMATCH = 'Model/Color Mismatch';

// Treat placeholder values like "-" as empty
const cleanValue = (v) => {
  const s = (v || '').toString().trim();
  return s === '-' ? '' : s;
};

const AdvantageTVSVehicles = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  // ========== TAB STATE ==========
  const [activeTab, setActiveTab] = useState(TAB_PENDING);

  // ========== STATISTICS (tab badges) ==========
  const [stats, setStats] = useState({
    readyToApprove: 0,
    mismatch: 0,
    colorMismatch: 0,
    modelMismatch: 0,
    rejected: 0
  });

  // Server-side pagination state (shared by ALL tabs - Pending, Rejected, Mismatch)
  const [vehicleData, setVehicleData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCount, setFilteredCount] = useState(0);
  
  // Export loading state
  const [exportLoading, setExportLoading] = useState(false);
  
  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Action Modal States
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionVehicle, setActionVehicle] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionModalLoading, setActionModalLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Edit Modal States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editFormData, setEditFormData] = useState({
    modelName: '',
    modelId: '',
    colorName: '',
    type: 'ICE',
    unloadLocation: '',
    engineNumber: '',
    batteryNumber: '',
    keyNumber: '',
    noOfDaysInStockDLR: 0,
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // names we still need to resolve into option objects once their
  // corresponding option lists have loaded (fixes async race conditions)
  const [pendingColorName, setPendingColorName] = useState('');
  const [pendingBranchName, setPendingBranchName] = useState('');
  
  // Branches state for dropdown
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  
  // Models and Colors states for dropdown
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [colorsLoading, setColorsLoading] = useState(false);
  const [selectedModelForColors, setSelectedModelForColors] = useState(null);
  
  // React-Select options
  const [modelOptions, setModelOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [selectedModelOption, setSelectedModelOption] = useState(null);
  const [selectedColorOption, setSelectedColorOption] = useState(null);
  
  const { permissions } = useAuth();
  
  // ========== PAGE-LEVEL PERMISSION CHECKS USING PURCHASE MODULE ==========
  const hasAdvantageTVSView = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.VIEW
  );
  
  const hasAdvantageTVSCreate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.CREATE
  );
  
  const hasAdvantageTVSUpdate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.UPDATE
  );
  
  const hasAdvantageTVSDelete = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.DELETE
  );

  const canViewAdvantageTVS = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canCreateAdvantageTVS = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canUpdateAdvantageTVS = canUpdateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canDeleteAdvantageTVS = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);

  // Tabs that use the pending-style table and rows
  const isPendingStyleTab = activeTab === TAB_PENDING || activeTab === TAB_MISMATCH;

  // ========== HELPER: GET API ENDPOINT BASED ON TAB ==========
  const getApiEndpoint = (tab) => {
    if (tab === TAB_REJECTED) return '/advantage-approval';
    if (tab === TAB_MISMATCH) return '/advantage-approval/mismatch';
    return '/advantage-approval/pending';
  };

  // ========== HELPER: GET API PARAMS BASED ON TAB ==========
  const getApiParams = (page, pageLimit, search, tab) => {
    const params = { page, limit: pageLimit };
    if (tab === TAB_REJECTED) {
      params.status = 'rejected';
    }
    if (search) params.search = search;
    return params;
  };

  // ========== HELPER: CHASSIS NUMBER FROM ANY ITEM SHAPE ==========
  const getChassis = (item) =>
    item?.stockData?.chassisNumber || item?.chassisNumber || item?.stockDetails?.chassisNumber;

  // ========== TAB CHANGE HANDLER ==========
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSearchTerm('');
    setSearchQuery('');
    setError(null);
    // Reset to page 1 when switching tabs
    fetchData(1, limit, '', tab);
  };

  // ========== FETCH STATISTICS (tab badge counts) ==========
  const fetchStatistics = async () => {
    try {
      const response = await axiosInstance.get('/advantage-approval/statistics');
      const d = response.data?.data || {};
      setStats({
        readyToApprove: d.readyToApprove || 0,
        mismatch: d.mismatch || 0,
        colorMismatch: d.colorMismatch || 0,
        modelMismatch: d.modelMismatch || 0,
        rejected: d.rejected || 0
      });
    } catch (e) {
      // Non-fatal - badges just won't update
      console.error('Error fetching statistics:', e);
    }
  };

  useEffect(() => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to view Advantage TVS Vehicles');
      return;
    }
    fetchData(1, limit, '', TAB_PENDING);
    fetchStatistics();
    fetchBranches();
    fetchModels();
  }, [canViewAdvantageTVS]);

  // Resolve MIS Color selection once colorOptions finish loading
  useEffect(() => {
    if (!editModalVisible) return;
    if (!pendingColorName) return;
    if (!colorOptions || colorOptions.length === 0) return;

    const match =
      colorOptions.find(
        opt => opt.label.trim().toLowerCase() === pendingColorName.trim().toLowerCase()
      ) || null;

    setSelectedColorOption(match);
    if (match) {
      setEditFormData(prev => ({ ...prev, colorName: match.label }));
      setPendingColorName('');
    }
  }, [colorOptions, pendingColorName, editModalVisible]);

  // Resolve branch/unload-location selection once branches finish
  useEffect(() => {
    if (!editModalVisible) return;
    if (!pendingBranchName) return;
    if (!Array.isArray(branches) || branches.length === 0) return;

    const target = pendingBranchName.trim().toLowerCase();
    const match =
      branches.find(b => (b.name || '').trim().toLowerCase() === target) ||
      branches.find(b => (b.name || '').trim().toLowerCase().includes(target)) ||
      branches.find(b => target.includes((b.name || '').trim().toLowerCase()) && b.name);

    if (match) {
      setEditFormData(prev => ({ ...prev, unloadLocation: match._id || match.id }));
      setPendingBranchName('');
    }
  }, [branches, pendingBranchName, editModalVisible]);

  // Fetch branches for dropdown
  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      const response = await axiosInstance.get('/branches');
      if (response.data && response.data.data) {
        setBranches(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setBranches(response.data);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    } finally {
      setBranchesLoading(false);
    }
  };

  // Fetch models for dropdown
  const fetchModels = async () => {
    try {
      setModelsLoading(true);
      const response = await axiosInstance.get('/models');
      
      let modelsData = [];
      if (response.data?.data?.models) {
        modelsData = response.data.data.models;
      } else if (response.data?.models) {
        modelsData = response.data.models;
      } else if (Array.isArray(response.data?.data)) {
        modelsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        modelsData = response.data;
      }
      
      modelsData = Array.isArray(modelsData) ? modelsData : [];
      setModels(modelsData);
      
      const options = modelsData.map(model => ({
        value: model._id || model.id,
        label: model.model_name || model.name || ''
      }));
      setModelOptions(options);
      
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
      setModelOptions([]);
    } finally {
      setModelsLoading(false);
    }
  };

  // Fetch colors for a specific model (uses /advantage-approval/model-colors/:modelId)
  const fetchColorsForModel = async (modelId) => {
    if (!modelId) {
      setColors([]);
      setColorOptions([]);
      return;
    }
    
    try {
      setColorsLoading(true);
      const response = await axiosInstance.get(`/advantage-approval/model-colors/${modelId}`);
      
      let colorsData = [];
      if (response.data?.data?.colors) {
        colorsData = response.data.data.colors;
      } else if (response.data?.colors) {
        colorsData = response.data.colors;
      } else if (Array.isArray(response.data?.data)) {
        colorsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        colorsData = response.data;
      }
      
      colorsData = Array.isArray(colorsData) ? colorsData : [];
      setColors(colorsData);
      
      const options = colorsData.map(color => ({
        value: color._id || color.id,
        label: color.name || color.color_name || ''
      }));
      setColorOptions(options);
      
    } catch (error) {
      console.error('Error fetching colors for model:', error);
      setColors([]);
      setColorOptions([]);
    } finally {
      setColorsLoading(false);
    }
  };

  // ========== FETCH DATA with tab support ==========
  // ALL THREE TABS (Pending, Rejected, Mismatch) go through this single function.
  // Each just uses a different endpoint (see getApiEndpoint), but they all set
  // vehicleData / total / pages / currentPage / limit the same way, so the same
  // pagination UI (renderPagination) works identically for all three.
  const fetchData = async (page = 1, pageLimit = DEFAULT_LIMIT, search = '', tab = activeTab) => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to view Advantage TVS Vehicles');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = getApiParams(page, pageLimit, search, tab);
      const endpoint = getApiEndpoint(tab);
      const response = await axiosInstance.get(endpoint, { params });

      let docs = [];
      let totalCount = 0;
      let totalPages = 1;

      if (tab === TAB_REJECTED) {
        if (response.data) {
          if (response.data.data?.approvals && Array.isArray(response.data.data.approvals)) {
            docs = response.data.data.approvals;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            docs = response.data.data;
          } else if (Array.isArray(response.data)) {
            docs = response.data;
          }
          totalCount = response.data.total || response.data.results || docs.length;
          totalPages = response.data.totalPages || Math.ceil(totalCount / pageLimit);
        }
      } else {
        // Pending AND Mismatch tabs share this response shape
        if (response.data) {
          docs = response.data.data?.vehicles || response.data.data || [];
          totalCount = response.data.total || response.data.results || docs.length;
          totalPages = response.data.totalPages || Math.ceil(totalCount / pageLimit);
        }
      }

      setVehicleData(docs);
      setTotal(totalCount);
      setPages(totalPages);
      setCurrentPage(page);
      setLimit(pageLimit);
      setSearchQuery(search);
      setFilteredCount(totalCount);
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
      setVehicleData([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle export to Excel
  const handleExport = async () => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to export Advantage TVS Vehicles');
      return;
    }

    try {
      setExportLoading(true);
      
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (activeTab === TAB_REJECTED) params.status = 'rejected';

      const exportEndpoint = activeTab === TAB_REJECTED
        ? '/advantage-approval/export-excel-rejected'
        : '/advantage-approval/export-excel';

      const response = await axiosInstance.get(exportEndpoint, {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = activeTab === TAB_REJECTED 
        ? 'Rejected_TVS_Vehicles.xlsx' 
        : 'Advantage_TVS_Vehicles.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Export completed successfully');
    } catch (err) {
      console.error('Error exporting Advantage TVS Vehicles:', err);
      const errorMsg = err.response?.data?.message || 'Failed to export Advantage TVS Vehicles';
      showError(errorMsg);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to search Advantage TVS Vehicles');
      return;
    }
    
    setSearchTerm(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchData(1, limit, value, activeTab);
    }, 400);
  };

  // Handle page change (used by all 3 tabs)
  const handlePageChange = (newPage) => {
    if (!canViewAdvantageTVS) return;
    if (newPage < 1 || newPage > pages) return;
    fetchData(newPage, limit, searchQuery, activeTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change (used by all 3 tabs)
  const handleLimitChange = (newLimit) => {
    if (!canViewAdvantageTVS) return;
    const newLimitValue = parseInt(newLimit, 10);
    fetchData(1, newLimitValue, searchQuery, activeTab);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      return 'N/A';
    }
    return 'N/A';
  };

  // Format date-time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (e) {
      return 'N/A';
    }
    return 'N/A';
  };

  // Handle view vehicle details
  const handleViewVehicle = (vehicle, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to view vehicle details');
      return;
    }
    setSelectedVehicle(vehicle);
    setViewModalVisible(true);
  };

  // Open action modal for approve/reject
  const openActionModal = (vehicle, type, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (type === 'approve' && !canUpdateAdvantageTVS) {
      showError('You do not have permission to approve vehicles');
      return;
    }
    
    if (type === 'reject' && !canUpdateAdvantageTVS) {
      showError('You do not have permission to reject vehicles');
      return;
    }
    
    setActionVehicle(vehicle);
    setActionType(type);
    setActionNotes('');
    setRejectionReason('');
    setActionError(null);
    setActionModalVisible(true);
  };

  // Handle approve vehicle from modal with proper error handling
  const handleApproveFromModal = async () => {
    if (!actionVehicle) return;
    
    setActionModalLoading(true);
    setActionError(null);
    
    try {
      const chassisNumber = getChassis(actionVehicle);
      
      const response = await axiosInstance.post(`/advantage-approval/approve/${chassisNumber}`, {
        notes: actionNotes || 'Approved'
      });
      
      if (response.data && response.data.success === false) {
        const errorMessage = response.data.message || 'Failed to approve vehicle';
        const errorDetail = response.data.error || '';
        
        setActionError(`${errorMessage}${errorDetail ? `: ${errorDetail}` : ''}`);
        showError(errorMessage);
        return;
      }
      
      showSuccess(response.data?.message || 'Vehicle approved successfully!');
      setActionModalVisible(false);
      setActionVehicle(null);
      setActionType(null);
      setActionError(null);
      // Vehicle moved buckets - go to page 1
      fetchData(1, limit, searchQuery, activeTab);
      fetchStatistics();
      
    } catch (error) {
      console.error('Error approving vehicle:', error);
      
      let errorMessage = 'Failed to approve vehicle';
      let errorDetail = '';
      
      if (error.response) {
        const responseData = error.response.data;
        
        if (responseData) {
          if (responseData.message) {
            errorMessage = responseData.message;
          }
          if (responseData.error) {
            errorDetail = responseData.error;
          }
        }
        
        const fullErrorMessage = errorDetail 
          ? `${errorMessage}: ${errorDetail}` 
          : errorMessage;
          
        setActionError(fullErrorMessage);
        showError(errorMessage);
        
      } else if (error.request) {
        setActionError('No response from server. Please check your network connection.');
        showError('Network error: Could not reach the server');
        
      } else {
        setActionError(error.message || 'An unexpected error occurred');
        showError(error.message || 'An unexpected error occurred');
      }
      
    } finally {
      setActionModalLoading(false);
    }
  };

  // Handle reject vehicle from modal
  const handleRejectFromModal = async () => {
    if (!actionVehicle) return;
    
    if (!rejectionReason.trim()) {
      showError('Please provide a rejection reason');
      return;
    }
    
    setActionModalLoading(true);
    setActionError(null);
    
    try {
      const chassisNumber = getChassis(actionVehicle);
      
      const response = await axiosInstance.post(`/advantage-approval/reject/${chassisNumber}`, {
        rejectionReason: rejectionReason,
        notes: actionNotes || 'Rejected'
      });
      
      if (response.data && response.data.success === false) {
        const errorMessage = response.data.message || 'Failed to reject vehicle';
        const errorDetail = response.data.error || '';
        
        setActionError(`${errorMessage}${errorDetail ? `: ${errorDetail}` : ''}`);
        showError(errorMessage);
        return;
      }
      
      showSuccess(response.data?.message || 'Vehicle rejected successfully!');
      setActionModalVisible(false);
      setActionVehicle(null);
      setActionType(null);
      setActionError(null);
      // Vehicle moved buckets - go to page 1
      fetchData(1, limit, searchQuery, activeTab);
      fetchStatistics();
      
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
      
      let errorMessage = 'Failed to reject vehicle';
      let errorDetail = '';
      
      if (error.response) {
        const responseData = error.response.data;
        if (responseData) {
          if (responseData.message) errorMessage = responseData.message;
          if (responseData.error) errorDetail = responseData.error;
        }
        const fullErrorMessage = errorDetail 
          ? `${errorMessage}: ${errorDetail}` 
          : errorMessage;
        setActionError(fullErrorMessage);
        showError(errorMessage);
      } else if (error.request) {
        setActionError('No response from server. Please check your network connection.');
        showError('Network error: Could not reach the server');
      } else {
        setActionError(error.message || 'An unexpected error occurred');
        showError(error.message || 'An unexpected error occurred');
      }
      
    } finally {
      setActionModalLoading(false);
    }
  };

  // ========== EDIT FUNCTIONS ==========
  
  const openEditModal = (vehicle, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!canUpdateAdvantageTVS) {
      showError('You do not have permission to edit vehicles');
      return;
    }
    
    const chassisNumber = getChassis(vehicle);
    if (!chassisNumber) {
      showError('Vehicle chassis number not found');
      return;
    }
    
    const preview = vehicle.approvalPreview || {};
    const modelInfo = preview.model || {};
    const colorInfo = preview.color || {};
    const branchInfo = preview.branch || {};
    const vehiclePreviewData = preview.vehicleData || {};
    const stockData = vehicle.stockData || vehicle.stockDetails || {};
    const mapping = vehicle.dmsToMisMapping || {};
    
    let modelId = modelInfo.id || stockData.modelId || '';

    // Mismatch tab: preview model may have found:false, but if the backend
    // returned an id we can still use it. Otherwise try to resolve by name.
    if (!modelId && modelInfo.suggestedName && modelOptions.length > 0) {
      const target = String(modelInfo.suggestedName).trim().toLowerCase();
      const m = modelOptions.find(o => (o.label || '').trim().toLowerCase() === target);
      if (m) modelId = m.value;
    }

    // ---- MIS Model value (priority order) ----
    // 1. existing MIS override (misModelOverride)
    // 2. matched model from preview
    // 3. mapping final (only if not "-")
    // 4. suggested name from preview
    // ❌ NOT the DMS vehicleModel
    const misModelOverride = stockData.misModelOverride || '';
    const modelName = misModelOverride || (
      modelInfo.found
        ? (modelInfo.name || '')
        : (mapping.model?.final && mapping.model.final !== '-'
            ? mapping.model.final
            : (modelInfo.suggestedName || ''))
    );

    // ---- MIS Colour value (priority order) ----
    // 1. existing MIS override (misColorOverride)
    // 2. matched colour from preview
    // 3. mapping final (only if not "-")
    // 4. suggested name from preview
    // ❌ NOT the DMS vehicleColor
    const misColorOverride = stockData.misColorOverride || '';
    const misColorFinal = mapping.color?.final && mapping.color.final !== '-'
      ? mapping.color.final
      : '';
    const colorName = cleanValue(
      misColorOverride ||
      (colorInfo.found ? colorInfo.name : '') ||
      misColorFinal ||
      colorInfo.suggestedName ||
      ''
    );

    const branchNameCandidate =
      branchInfo.name || branchInfo.suggestedName || stockData.branch || stockData.location || '';

    let unloadLocationValue = branchInfo.id || '';
    if (!unloadLocationValue && branchNameCandidate && Array.isArray(branches) && branches.length > 0) {
      const target = branchNameCandidate.trim().toLowerCase();
      const matched =
        branches.find(b => (b.name || '').trim().toLowerCase() === target) ||
        branches.find(b => (b.name || '').trim().toLowerCase().includes(target)) ||
        branches.find(b => target.includes((b.name || '').trim().toLowerCase()) && b.name);
      if (matched) {
        unloadLocationValue = matched._id || matched.id;
      }
    }
    
    setEditVehicle(vehicle);
    setEditFormData({
      modelName: modelName,
      modelId: modelId,
      colorName: colorName,
      type: modelInfo.type || vehiclePreviewData.type || 'ICE',
      unloadLocation: unloadLocationValue,
      engineNumber: vehiclePreviewData.engineNumber || stockData.engineNo || '',
      batteryNumber: vehiclePreviewData.batteryNumber || '',
      keyNumber: vehiclePreviewData.keyNumber || '',
      noOfDaysInStockDLR: vehiclePreviewData.noOfDaysInStockDLR || stockData.noOfDaysInStockDLR || 0,
      notes: vehiclePreviewData.notes || ''
    });
    
    if (modelId && modelOptions.length > 0) {
      const selected = modelOptions.find(opt => opt.value === modelId);
      setSelectedModelOption(selected || null);
    } else {
      setSelectedModelOption(null);
    }
    
    if (colorName && colorOptions.length > 0) {
      const selected = colorOptions.find(
        opt => opt.label.trim().toLowerCase() === colorName.trim().toLowerCase()
      );
      setSelectedColorOption(selected || null);
    } else {
      setSelectedColorOption(null);
    }
    setPendingColorName(colorName || '');

    if (!unloadLocationValue && branchNameCandidate) {
      setPendingBranchName(branchNameCandidate);
    } else {
      setPendingBranchName('');
    }
    
    if (modelId) {
      setSelectedModelForColors(modelId);
      fetchColorsForModel(modelId);
    } else {
      setSelectedModelForColors(null);
      setColors([]);
      setColorOptions([]);
    }
    
    setEditError(null);
    setEditModalVisible(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModelChange = (selectedOption) => {
    const modelId = selectedOption ? selectedOption.value : null;
    const modelName = selectedOption ? selectedOption.label : '';
    
    setSelectedModelOption(selectedOption);
    setSelectedModelForColors(modelId);
    setSelectedColorOption(null);
    setPendingColorName('');
    
    setEditFormData(prev => ({
      ...prev,
      modelId: modelId || '',
      modelName: modelName,
      colorName: ''
    }));
    
    if (modelId) {
      fetchColorsForModel(modelId);
    } else {
      setColors([]);
      setColorOptions([]);
    }
  };

  const handleColorChange = (selectedOption) => {
    const colorName = selectedOption ? selectedOption.label : '';
    
    setSelectedColorOption(selectedOption);
    setPendingColorName('');
    setEditFormData(prev => ({
      ...prev,
      colorName: colorName
    }));
  };

  // ========== EDIT SUBMIT ==========
  // ONLY misModel / misColor go to the backend.
  // vehicleModel / vehicleColor are DMS values and are NEVER sent.
  const handleEditSubmit = async () => {
    if (!editVehicle) return;
    
    if (!editFormData.modelName.trim()) {
      setEditError('Model Name is required');
      return;
    }
    
    if (!editFormData.colorName.trim()) {
      setEditError('Color is required');
      return;
    }
    
    const chassisNumber = getChassis(editVehicle);
    if (!chassisNumber) {
      setEditError('Chassis number not found');
      return;
    }
    
    try {
      setEditLoading(true);
      setEditError(null);
      
      const payload = {
        misModel: editFormData.modelName,      // ✅ MIS override only
        misColor: editFormData.colorName,      // ✅ MIS override only

        // Non-MIS fields (safe)
        unloadLocation: editFormData.unloadLocation,
        engineNumber: editFormData.engineNumber,
        batteryNumber: editFormData.batteryNumber,
        keyNumber: editFormData.keyNumber,
        noOfDaysInStockDLR: Number(editFormData.noOfDaysInStockDLR) || 0,
        notes: editFormData.notes
      };
      
      console.log('[EDIT-SUBMIT] Payload:', payload);
      
      const response = await axiosInstance.post(
        `/advantage-approval/edit-and-save/${chassisNumber}`, 
        payload
      );
      
      console.log('[EDIT-SUBMIT] Response:', response.data);
      
      showSuccess('Vehicle updated successfully!');
      setEditModalVisible(false);
      setEditVehicle(null);
      // Vehicle may have moved buckets - go to page 1
      fetchData(1, limit, searchQuery, activeTab);
      fetchStatistics();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update vehicle';
      setEditError(errorMsg);
      showError(errorMsg);
    } finally {
      setEditLoading(false);
    }
  };

  // ========== RENDER PAGINATION (shared by ALL 3 TABS) ==========
  // This one function is called once, unconditionally, at the bottom of
  // CCardBody - not nested inside any per-tab table block. It always reads
  // the tab-agnostic total/pages/currentPage/limit state, which fetchData
  // sets the same way regardless of which endpoint (pending / rejected /
  // mismatch) was called. That's what makes pagination identical on all
  // three tabs, exactly like the Pending tab.
  const renderPagination = () => {
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
              onChange={(e) => handleLimitChange(e.target.value)}
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

  if (!canViewAdvantageTVS) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Advantage TVS Vehicles.
      </div>
    );
  }

  if (loading && !vehicleData.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  // ========== RENDER: PENDING / MISMATCH TAB TABLE ROW ==========
  const renderPendingRow = (item, index, startRecord) => {
    const vehicle = item.stockData || item;
    const preview = item.approvalPreview || {};
    const mapping = item.dmsToMisMapping || {};
    const summary = item.summary || {};
    const approvalStatus = item.approvalStatus || vehicle.approvalStatus || 'pending';
    const chassisNumber = vehicle.chassisNumber || item.chassisNumber;

    const dmsModel = mapping.model?.dms || 'N/A';
    const dmsColor = mapping.color?.dms || 'N/A';
    const misModel = mapping.model?.final || '-';
    const misColor = mapping.color?.final || '-';

    const isModelMismatch = summary.modelMismatch === true;
    const isColorMismatch = summary.colorMismatch === true;
    const hasMismatch = summary.hasMismatch === true;

    const willCreateModel = preview.model?.found === false;
    const willCreateColor = preview.color?.found === false;
    
    return (
      <CTableRow key={chassisNumber || index}>
        <CTableDataCell>{startRecord + index}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          <CBadge color="primary">
            {chassisNumber || 'N/A'}
          </CBadge>
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          {vehicle.engineNo || vehicle.engineNumber || 'N/A'}
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>{dmsModel}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>{dmsColor}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          {misModel}
          {isModelMismatch && <CBadge color="warning" className="ms-1">model mismatch</CBadge>}
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          {misColor}
          {isColorMismatch && <CBadge color="danger" className="ms-1">color mismatch</CBadge>}
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>{vehicle.branch || 'N/A'}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>{vehicle.location || 'N/A'}</CTableDataCell>
        <CTableDataCell>
          <CBadge color={approvalStatus === 'pending' ? 'warning' : 'success'}>
            {approvalStatus || 'PENDING'}
          </CBadge>
        </CTableDataCell>
        <CTableDataCell>
          <div className="d-flex gap-1 flex-wrap">
            <CButton
              color="info"
              size="sm"
              onClick={(e) => handleViewVehicle(item, e)}
              disabled={!canViewAdvantageTVS}
              className="px-2 py-1"
              title="View Vehicle Details"
            >
              <CIcon icon={cilSearch} size="sm" />
            </CButton>
            <CButton
              color="warning"
              size="sm"
              onClick={(e) => openEditModal(item, e)}
              disabled={!canUpdateAdvantageTVS}
              className="px-2 py-1"
              title={hasMismatch ? 'Edit Vehicle (fix mismatch)' : 'Edit Vehicle'}
            >
              <CIcon icon={cilPencil} size="sm" />
            </CButton>
            <CButton
              color="success"
              size="sm"
              onClick={(e) => openActionModal(item, 'approve', e)}
              disabled={!canUpdateAdvantageTVS || actionLoadingId === chassisNumber || hasMismatch}
              className="px-2 py-1"
              title={hasMismatch ? 'Fix mismatch before approving' : 'Approve Vehicle'}
            >
              <CIcon icon={cilThumbUp} size="sm" />
            </CButton>
            <CButton
              color="danger"
              size="sm"
              onClick={(e) => openActionModal(item, 'reject', e)}
              disabled={!canUpdateAdvantageTVS || actionLoadingId === chassisNumber}
              className="px-2 py-1"
              title="Reject Vehicle"
            >
              <CIcon icon={cilThumbDown} size="sm" />
            </CButton>
          </div>
        </CTableDataCell>
      </CTableRow>
    );
  };

  // ========== RENDER: REJECTED TAB TABLE ROW ==========
  const renderRejectedRow = (item, index, startRecord) => {
    const stockDetails = item.stockDetails || {};
    const chassisNumber = item.chassisNumber || stockDetails.chassisNumber;
    const category = stockDetails.vehicleCategory || 'N/A';
    const model = item.vehicleModel || stockDetails.vehicleModel || 'N/A';

    return (
      <CTableRow key={item._id || chassisNumber || index}>
        <CTableDataCell>{startRecord + index}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          <CBadge color="primary">{chassisNumber || 'N/A'}</CBadge>
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>{category}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>{model}</CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          <CBadge color="danger">{item.status || 'rejected'}</CBadge>
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          {item.rejectionReason || 'N/A'}
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          {item.notes || 'N/A'}
        </CTableDataCell>
        <CTableDataCell style={{ fontSize: '12px' }}>
          {item.rejectedAt ? formatDateTime(item.rejectedAt) : 'N/A'}
        </CTableDataCell>
        <CTableDataCell>
          <div className="d-flex gap-1 flex-wrap">
            <CButton
              color="info"
              size="sm"
              onClick={(e) => handleViewVehicle(item, e)}
              disabled={!canViewAdvantageTVS}
              className="px-2 py-1"
              title="View Vehicle Details"
            >
              <CIcon icon={cilSearch} size="sm" />
            </CButton>
          </div>
        </CTableDataCell>
      </CTableRow>
    );
  };

  return (
    <div>
      <div className='title'>Advantage TVS Vehicles</div>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header'>
          {/* ========== TABS ========== */}
          <CNav variant="tabs" className="card-header-tabs mb-2">
            <CNavItem>
              <CNavLink
                active={activeTab === TAB_PENDING}
                onClick={() => handleTabChange(TAB_PENDING)}
                style={{ cursor: 'pointer' }}
              >
                Pending
                {stats.readyToApprove > 0 && (
                  <CBadge color="warning" className="ms-2">{stats.readyToApprove}</CBadge>
                )}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === TAB_REJECTED}
                onClick={() => handleTabChange(TAB_REJECTED)}
                style={{ cursor: 'pointer' }}
              >
                Rejected
                {stats.rejected > 0 && (
                  <CBadge color="danger" className="ms-2">{stats.rejected}</CBadge>
                )}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === TAB_MISMATCH}
                onClick={() => handleTabChange(TAB_MISMATCH)}
                style={{ cursor: 'pointer' }}
              >
                Model/Color Mismatch
                {stats.mismatch > 0 && (
                  <CBadge color="info" className="ms-2">{stats.mismatch}</CBadge>
                )}
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* ========== HEADER INFO + EXPORT ========== */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
            <div>
              <CBadge color={activeTab === TAB_PENDING ? 'info' : 'secondary'} className="me-2">
                Total: {total || 0}
              </CBadge>
              {searchQuery && (
                <CBadge color="secondary" className="me-2">
                  Filtered: {filteredCount}
                </CBadge>
              )}
              <CBadge
                color={
                  activeTab === TAB_PENDING
                    ? 'warning'
                    : activeTab === TAB_MISMATCH
                      ? 'info'
                      : 'danger'
                }
                className="me-2"
              >
                Status: {
                  activeTab === TAB_PENDING
                    ? 'Pending'
                    : activeTab === TAB_MISMATCH
                      ? 'Model/Color Mismatch'
                      : 'Rejected'
                }
              </CBadge>
              {activeTab === TAB_MISMATCH && (stats.modelMismatch > 0 || stats.colorMismatch > 0) && (
                <>
                  <CBadge color="warning" className="me-2">
                    Model: {stats.modelMismatch}
                  </CBadge>
                  <CBadge color="danger" className="me-2">
                    Color: {stats.colorMismatch}
                  </CBadge>
                </>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              {activeTab === TAB_PENDING && (
                <CButton
                  color="success"
                  size="sm"
                  onClick={handleExport}
                  disabled={exportLoading || loading}
                >
                  {exportLoading ? <CSpinner size="sm" /> : <CIcon icon={cilCloudDownload} className="me-1" />}
                  Export
                </CButton>
              )}
            </div>
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
                placeholder={
                  activeTab === TAB_REJECTED
                    ? "Search by chassis, make, model..."
                    : activeTab === TAB_MISMATCH
                      ? "Search by chassis, model, color..."
                      : "Search by chassis, model, branch..."
                }
              />
            </div>
          </div>
          
          {loading && vehicleData.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}
          
          <div
            className="responsive-table-wrapper"
            style={{
              opacity: loading && vehicleData.length > 0 ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {/* ========== PENDING / MISMATCH COLOR TABLE ========== */}
            {isPendingStyleTab && (
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Chassis #</CTableHeaderCell>
                    <CTableHeaderCell>Engine #</CTableHeaderCell>
                    <CTableHeaderCell>DMS Model</CTableHeaderCell>
                    <CTableHeaderCell>DMS Color</CTableHeaderCell>
                    <CTableHeaderCell>MIS Model</CTableHeaderCell>
                    <CTableHeaderCell>MIS Color</CTableHeaderCell>
                    <CTableHeaderCell>Branch</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Approval Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vehicleData.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan="11" className="text-center">
                        {searchQuery
                          ? `No results found for "${searchQuery}"`
                          : activeTab === TAB_MISMATCH
                            ? 'No Model/Color Mismatch vehicles available'
                            : 'No pending vehicles available'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    vehicleData.map((item, index) => {
                      const startRecord = (currentPage - 1) * limit + 1;
                      return renderPendingRow(item, index, startRecord);
                    })
                  )}
                </CTableBody>
              </CTable>
            )}

            {/* ========== REJECTED TABLE ========== */}
            {activeTab === TAB_REJECTED && (
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Chassis #</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Model</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Rejection Reason</CTableHeaderCell>
                    <CTableHeaderCell>Notes</CTableHeaderCell>
                    <CTableHeaderCell>Rejected At</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vehicleData.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan="9" className="text-center">
                        {searchQuery
                          ? `No results found for "${searchQuery}"`
                          : 'No rejected vehicles available'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    vehicleData.map((item, index) => {
                      const startRecord = (currentPage - 1) * limit + 1;
                      return renderRejectedRow(item, index, startRecord);
                    })
                  )}
                </CTableBody>
              </CTable>
            )}
          </div>
          
          {/* Single shared pagination bar - identical behavior on Pending, Rejected and Mismatch */}
          {renderPagination()}
        </CCardBody>
      </CCard>

      {/* ========== ACTION MODAL (Approve/Reject) ========== */}
      <CModal 
        visible={actionModalVisible} 
        onClose={() => {
          setActionModalVisible(false);
          setActionVehicle(null);
          setActionType(null);
          setActionNotes('');
          setRejectionReason('');
          setActionError(null);
        }}
        size="md"
      >
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center">
            <CIcon 
              icon={actionType === 'approve' ? cilThumbUp : cilThumbDown} 
              className={`me-2 ${actionType === 'approve' ? 'text-success' : 'text-danger'}`} 
            />
            {actionType === 'approve' ? 'Approve Vehicle' : 'Reject Vehicle'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {actionVehicle && (
            <div>
              {actionError && (
                <CAlert color="danger" className="mb-3">
                  <div className="d-flex align-items-start">
                    <CIcon icon={cilWarning} className="me-2 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Error:</strong> {actionError}
                    </div>
                  </div>
                </CAlert>
              )}

              <div className="card border-0 bg-light mb-3">
                <div className="card-body">
                  <h6 className="card-title mb-3">Vehicle Details</h6>
                  <div className="row">
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Chassis Number</label>
                      <p className="mb-1 fw-bold">
                        {getChassis(actionVehicle) || 'N/A'}
                      </p>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small fw-bold">DMS Model</label>
                      <p className="mb-1">{actionVehicle.dmsToMisMapping?.model?.dms || actionVehicle.stockDetails?.vehicleModel || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label className="text-muted small fw-bold">MIS Model</label>
                      <p className="mb-1">{actionVehicle.dmsToMisMapping?.model?.final || '-'}</p>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small fw-bold">MIS Color</label>
                      <p className="mb-1">{actionVehicle.dmsToMisMapping?.color?.final || '-'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Branch</label>
                      <p className="mb-1">{actionVehicle.stockData?.branch || actionVehicle.stockDetails?.branch || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Location</label>
                      <p className="mb-1">{actionVehicle.stockData?.location || actionVehicle.stockDetails?.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {actionType === 'reject' && (
                <div className="mb-3">
                  <CFormLabel className="fw-bold">
                    Rejection Reason <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mb-2"
                  >
                    <option value="">Select rejection reason...</option>
                    <option value="Missing required documents">Missing required documents</option>
                    <option value="Invalid vehicle details">Invalid vehicle details</option>
                    <option value="Duplicate entry">Duplicate entry</option>
                    <option value="Customer requested cancellation">Customer requested cancellation</option>
                    <option value="Model/Color mismatch">Model/Color mismatch</option>
                    <option value="Incomplete information">Incomplete information</option>
                    <option value="Other">Other</option>
                  </CFormSelect>
                  {!rejectionReason && (
                    <div className="text-danger small">Please select a rejection reason</div>
                  )}
                </div>
              )}

              <div className="mb-3">
                <CFormLabel className="fw-bold">
                  {actionType === 'approve' ? 'Approval Notes' : 'Additional Notes'}
                </CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={actionType === 'approve' 
                    ? 'Add notes for approval (optional)' 
                    : 'Add additional notes for rejection (optional)'
                  }
                  className="form-control"
                />
              </div>

              {actionType === 'approve' && (
                <CAlert color="info" className="mt-3">
                  <CIcon icon={cilInfo} className="me-2" />
                  <span>
                    <strong>Approve:</strong> This will create the vehicle in the system.
                    The model and colour must already exist in master data.
                  </span>
                </CAlert>
              )}

              {actionType === 'reject' && (
                <CAlert color="warning" className="mt-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  <span>
                    <strong>Reject:</strong> This will reject the vehicle and it will not be added to the system.
                    The vehicle record will be marked as rejected.
                  </span>
                </CAlert>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setActionModalVisible(false);
              setActionVehicle(null);
              setActionType(null);
              setActionNotes('');
              setRejectionReason('');
              setActionError(null);
            }}
            disabled={actionModalLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color={actionType === 'approve' ? 'success' : 'danger'}
            onClick={actionType === 'approve' ? handleApproveFromModal : handleRejectFromModal}
            disabled={actionModalLoading || (actionType === 'reject' && !rejectionReason.trim())}
          >
            {actionModalLoading ? (
              <><CSpinner size="sm" className="me-2" /> Processing...</>
            ) : (
              <><CIcon icon={actionType === 'approve' ? cilCheck : cilX} className="me-1" /> 
              {actionType === 'approve' ? 'Approve' : 'Reject'}
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ========== EDIT MODAL ========== */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => {
          setEditModalVisible(false);
          setEditVehicle(null);
          setEditError(null);
          setColors([]);
          setColorOptions([]);
          setSelectedModelForColors(null);
          setSelectedModelOption(null);
          setSelectedColorOption(null);
          setPendingColorName('');
          setPendingBranchName('');
        }}
        size="lg"
        scrollable
      >
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilPencil} className="me-2 text-warning" />
            Edit Vehicle Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editVehicle && (
            <div>
              <div className="alert alert-info d-flex align-items-center mb-4">
                <CIcon icon={cilInfo} className="me-2" />
                <span>
                  <strong>Editing:</strong> Chassis #{getChassis(editVehicle) || 'N/A'}
                </span>
              </div>

              {editVehicle.dmsToMisMapping && (
                <div className="card border-0 bg-light mb-4">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <CIcon icon={cilInfo} className="me-2 text-primary" />
                      DMS vs MIS Mapping
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="text-muted small fw-bold">DMS Model (Read-only)</label>
                        <p className="mb-2">{editVehicle.dmsToMisMapping.model?.dms || 'N/A'}</p>
                        <label className="text-muted small fw-bold">DMS Color (Read-only)</label>
                        <p className="mb-2">{editVehicle.dmsToMisMapping.color?.dms || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small fw-bold">MIS Model (Final)</label>
                        <p className="mb-2 fw-bold text-success">
                          {editVehicle.dmsToMisMapping.model?.final || '-'}
                        </p>
                        <label className="text-muted small fw-bold">MIS Color (Final)</label>
                        <p className="mb-2 fw-bold text-success">
                          {editVehicle.dmsToMisMapping.color?.final || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="alert alert-secondary mb-0 py-2 small">
                      <CIcon icon={cilInfo} className="me-1" />
                      DMS values are never changed. Your edits below set the MIS override.
                    </div>
                  </div>
                </div>
              )}

              {editError && (
                <CAlert color="danger" className="mb-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  {editError}
                </CAlert>
              )}

              <CForm>
                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">MIS Model <span className="text-danger">*</span></CFormLabel>
                    <Select
                      classNamePrefix="react-select"
                      placeholder={modelsLoading ? 'Loading models...' : 'Select MIS Model'}
                      isLoading={modelsLoading}
                      isClearable
                      options={modelOptions}
                      value={selectedModelOption}
                      onChange={handleModelChange}
                      isDisabled={editLoading}
                    />
                    {!selectedModelOption && !modelsLoading && (
                      <div className="text-muted small mt-1">Please select a model</div>
                    )}
                  </CCol>
                  <CCol md="6">
                    <CFormLabel className="fw-bold">MIS Color <span className="text-danger">*</span></CFormLabel>
                    <Select
                      classNamePrefix="react-select"
                      placeholder={
                        colorsLoading 
                          ? 'Loading colors...' 
                          : (selectedModelForColors 
                            ? 'Select MIS Color' 
                            : 'Select model first')
                      }
                      isLoading={colorsLoading}
                      isClearable
                      options={colorOptions}
                      value={selectedColorOption}
                      onChange={handleColorChange}
                      isDisabled={!selectedModelForColors || editLoading}
                      noOptionsMessage={() => {
                        if (!selectedModelForColors) return 'Select a model first';
                        if (colorOptions.length === 0) return 'No colors available';
                        return 'No options';
                      }}
                    />
                    {selectedModelForColors && colorOptions.length === 0 && !colorsLoading && (
                      <div className="text-muted small mt-1">No colors available for this model</div>
                    )}
                    {!selectedModelForColors && !modelsLoading && (
                      <div className="text-muted small mt-1">Select a model to load colors</div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Vehicle Type</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.type}
                      disabled={true}
                      className="bg-light"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="12">
                    <CFormLabel className="fw-bold">Unload Location / Branch</CFormLabel>
                    <CFormSelect
                      value={editFormData.unloadLocation}
                      onChange={(e) => {
                        setPendingBranchName('');
                        handleEditInputChange('unloadLocation', e.target.value);
                      }}
                      disabled={branchesLoading || editLoading}
                    >
                      <option value="">Select a branch...</option>
                      {Array.isArray(branches) && branches.map((branch) => (
                        <option key={branch._id || branch.id} value={branch._id || branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </CFormSelect>
                    {branchesLoading && (
                      <div className="text-muted small mt-1">
                        <CSpinner size="sm" className="me-1" /> Loading branches...
                      </div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Engine Number</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.engineNumber}
                      onChange={(e) => handleEditInputChange('engineNumber', e.target.value)}
                      placeholder="Enter engine number"
                      disabled={editLoading}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Battery Number</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.batteryNumber}
                      onChange={(e) => handleEditInputChange('batteryNumber', e.target.value)}
                      placeholder="Enter battery number"
                      disabled={editLoading}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Key Number</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.keyNumber}
                      onChange={(e) => handleEditInputChange('keyNumber', e.target.value)}
                      placeholder="Enter key number"
                      disabled={editLoading}
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Days in Stock DLR</CFormLabel>
                    <CFormInput
                      type="number"
                      value={editFormData.noOfDaysInStockDLR}
                      onChange={(e) => handleEditInputChange('noOfDaysInStockDLR', e.target.value)}
                      placeholder="Enter days in stock"
                      min="0"
                      disabled={editLoading}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="12">
                    <CFormLabel className="fw-bold">Notes</CFormLabel>
                    <CFormTextarea
                      rows={3}
                      value={editFormData.notes}
                      onChange={(e) => handleEditInputChange('notes', e.target.value)}
                      placeholder="Enter any additional notes"
                      disabled={editLoading}
                    />
                  </CCol>
                </CRow>

                <CAlert color="secondary" className="mt-3">
                  <h6 className="mb-2">
                    <CIcon icon={cilInfo} className="me-2" />
                    Summary of Changes
                  </h6>
                  <div className="small">
                    <p className="mb-1"><strong>MIS Model:</strong> {editFormData.modelName || '(not selected)'}</p>
                    <p className="mb-1"><strong>MIS Color:</strong> {editFormData.colorName || '(not selected)'}</p>
                    <p className="mb-1"><strong>Type:</strong> {editFormData.type}</p>
                    <p className="mb-1"><strong>Branch:</strong> {
                      Array.isArray(branches) && branches.find(b => (b._id || b.id) === editFormData.unloadLocation)?.name || 
                      editFormData.unloadLocation || 
                      '(not selected)'
                    }</p>
                    <p className="mb-0"><strong>Engine:</strong> {editFormData.engineNumber || '(empty)'}</p>
                  </div>
                </CAlert>
              </CForm>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setEditModalVisible(false);
              setEditVehicle(null);
              setEditError(null);
              setColors([]);
              setColorOptions([]);
              setSelectedModelForColors(null);
              setSelectedModelOption(null);
              setSelectedColorOption(null);
              setPendingColorName('');
              setPendingBranchName('');
            }}
            disabled={editLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color="warning" 
            onClick={handleEditSubmit}
            disabled={editLoading || !editFormData.modelName.trim() || !editFormData.colorName.trim()}
          >
            {editLoading ? (
              <><CSpinner size="sm" className="me-2" /> Saving...</>
            ) : (
              <><CIcon icon={cilSave} className="me-1" /> Save Changes</>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ========== VIEW VEHICLE MODAL ========== */}
      <CModal 
        visible={viewModalVisible} 
        onClose={() => {
          setViewModalVisible(false);
          setSelectedVehicle(null);
        }}
        size="lg"
        scrollable
      >
        <CModalHeader className="border-bottom-0">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilInfo} className="me-2 text-primary" />
            Vehicle {activeTab === TAB_REJECTED ? 'Rejection Details' : 'Preview After Approval'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-0">
          {selectedVehicle && (
            <div className="vehicle-details">
              {activeTab === TAB_REJECTED ? (
                <>
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <CIcon icon={cilXCircle} className="me-2" />
                    <span>
                      <strong>Rejected:</strong> This vehicle was rejected and is not part of active inventory.
                    </span>
                  </div>

                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-danger text-white">
                      <h6 className="mb-0">
                        <CIcon icon={cilXCircle} className="me-2" />
                        Rejection Details
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold">Chassis Number</label>
                          <p className="mb-3 fw-bold">
                            {selectedVehicle.chassisNumber || selectedVehicle.stockData?.chassisNumber || selectedVehicle.stockDetails?.chassisNumber || 'N/A'}
                          </p>
                          <label className="text-muted small fw-bold">Category</label>
                          <p className="mb-3">{selectedVehicle.vehicleCategory || selectedVehicle.stockDetails?.vehicleCategory || 'N/A'}</p>
                          <label className="text-muted small fw-bold">Model</label>
                          <p className="mb-0">{selectedVehicle.vehicleModel || selectedVehicle.stockDetails?.vehicleModel || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold">Status</label>
                          <p className="mb-3">
                            <CBadge color="danger">
                              {selectedVehicle.status || 'rejected'}
                            </CBadge>
                          </p>
                          <label className="text-muted small fw-bold">Rejected At</label>
                          <p className="mb-3">
                            {selectedVehicle.rejectedAt 
                              ? formatDateTime(selectedVehicle.rejectedAt) 
                              : 'N/A'}
                          </p>
                          <label className="text-muted small fw-bold">Rejection Reason</label>
                          <p className="mb-0 text-danger fw-bold">
                            {selectedVehicle.rejectionReason || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {selectedVehicle.notes && (
                        <>
                          <hr />
                          <label className="text-muted small fw-bold">Notes</label>
                          <p className="mb-0">{selectedVehicle.notes}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedVehicle.stockDetails && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <CIcon icon={cilCloudDownload} className="me-2 text-secondary" />
                          Source Stock Data (From Excel)
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Branch</label>
                            <p className="mb-2">{selectedVehicle.stockDetails.branch || 'N/A'}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Location</label>
                            <p className="mb-2">{selectedVehicle.stockDetails.location || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Engine No</label>
                            <p className="mb-2">{selectedVehicle.stockDetails.engineNo || 'N/A'}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Vehicle Color</label>
                            <p className="mb-2">{selectedVehicle.stockDetails.vehicleColor || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                (() => {
                  const preview = selectedVehicle.approvalPreview || {};
                  const stockData = selectedVehicle.stockData || selectedVehicle.stockDetails || {};
                  const approvalInfo = selectedVehicle.summary || {};
                  const mapping = selectedVehicle.dmsToMisMapping || {};

                  const vehiclePreviewData = preview.vehicleData || {};
                  const modelInfo = preview.model || {};
                  const colorInfo = preview.color || {};
                  const branchInfo = preview.branch || {};

                  const isModelMismatch = approvalInfo.modelMismatch === true;
                  const isColorMismatch = approvalInfo.colorMismatch === true;

                  return (
                    <>
                      {isModelMismatch && (
                        <div className="alert alert-warning d-flex align-items-center mb-4">
                          <CIcon icon={cilWarning} className="me-2" />
                          <span>
                            <strong>Model mismatch:</strong> DMS model "{mapping.model?.dms || 'N/A'}" is not available in Model Master.
                            Edit the vehicle and pick a valid model before approving.
                          </span>
                        </div>
                      )}

                      {isColorMismatch && (
                        <div className="alert alert-danger d-flex align-items-center mb-4">
                          <CIcon icon={cilWarning} className="me-2" />
                          <span>
                            <strong>Color mismatch:</strong> DMS color "{mapping.color?.dms || 'N/A'}" is not mapped to a colour on this MIS model.
                            Edit the vehicle and pick a valid colour before approving.
                          </span>
                        </div>
                      )}

                      {!isModelMismatch && !isColorMismatch && (
                        <div className="alert alert-info d-flex align-items-center mb-4">
                          <CIcon icon={cilCheck} className="me-2" />
                          <span>
                            <strong>Preview:</strong> This is how the vehicle will appear in the system after approval.
                          </span>
                        </div>
                      )}

                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">
                            <CIcon icon={cilInfo} className="me-2" />
                            DMS → MIS Mapping
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">DMS Model</label>
                              <p className="mb-3">{mapping.model?.dms || 'N/A'}</p>
                              <label className="text-muted small fw-bold">DMS Color</label>
                              <p className="mb-0">{mapping.color?.dms || 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">MIS Model (Final)</label>
                              <p className="mb-3 fw-bold text-success">
                                {mapping.model?.final || '-'}
                              </p>
                              <label className="text-muted small fw-bold">MIS Color (Final)</label>
                              <p className="mb-0 fw-bold text-success">
                                {mapping.color?.final || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">
                            <CIcon icon={cilCheckCircle} className="me-2 text-success" />
                            Vehicle Preview
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Chassis Number</label>
                                <p className="fw-bold mb-0">{vehiclePreviewData.chassisNumber || stockData.chassisNumber || 'N/A'}</p>
                              </div>
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Engine Number</label>
                                <p className="mb-0">{vehiclePreviewData.engineNumber || stockData.engineNo || 'N/A'}</p>
                              </div>
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Model Name (MIS)</label>
                                <p className="mb-0">{vehiclePreviewData.modelName || '-'}</p>
                              </div>
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Type</label>
                                <p className="mb-0">
                                  <CBadge color={vehiclePreviewData.type === 'EV' ? 'success' : 'primary'}>
                                    {vehiclePreviewData.type || 'N/A'}
                                  </CBadge>
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Color (MIS)</label>
                                <p className="mb-0">{vehiclePreviewData.colorName || '-'}</p>
                              </div>
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Location Type</label>
                                <p className="mb-0">
                                  <CBadge color="secondary">
                                    {vehiclePreviewData.locationType || 'N/A'}
                                  </CBadge>
                                </p>
                              </div>
                              <div className="mb-3">
                                <label className="text-muted small fw-bold">Status</label>
                                <p className="mb-0">
                                  <CBadge color={vehiclePreviewData.status === 'in_stock' ? 'success' : 'warning'}>
                                    {vehiclePreviewData.status || 'N/A'}
                                  </CBadge>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <div className={`card border-0 shadow-sm h-100 ${modelInfo.found ? 'border-success border-2' : 'border-danger border-2'}`}>
                            <div className="card-body text-center">
                              <CIcon icon={modelInfo.found ? cilCheckCircle : cilXCircle} 
                                size="2xl" 
                                className={`mb-2 ${modelInfo.found ? 'text-success' : 'text-danger'}`} 
                              />
                              <h6 className="fw-bold">Model Match</h6>
                              <CBadge color={modelInfo.found ? 'success' : 'danger'}>
                                {modelInfo.found ? 'Found ✓' : 'Not Found ✗'}
                              </CBadge>
                              {(modelInfo.name || modelInfo.suggestedName) && (
                                <p className="small text-muted mt-2 mb-0">{modelInfo.name || modelInfo.suggestedName}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className={`card border-0 shadow-sm h-100 ${colorInfo.found ? 'border-success border-2' : 'border-danger border-2'}`}>
                            <div className="card-body text-center">
                              <CIcon icon={colorInfo.found ? cilCheckCircle : cilXCircle} 
                                size="2xl" 
                                className={`mb-2 ${colorInfo.found ? 'text-success' : 'text-danger'}`} 
                              />
                              <h6 className="fw-bold">Color Match</h6>
                              <CBadge color={colorInfo.found ? 'success' : 'danger'}>
                                {colorInfo.found ? 'Found ✓' : 'Not Found ✗'}
                              </CBadge>
                              {(colorInfo.name || colorInfo.suggestedName) && (
                                <p className="small text-muted mt-2 mb-0">{colorInfo.name || colorInfo.suggestedName}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className={`card border-0 shadow-sm h-100 ${branchInfo?.found ? 'border-success border-2' : 'border-warning border-2'}`}>
                            <div className="card-body text-center">
                              <CIcon icon={branchInfo?.found ? cilCheckCircle : cilWarning} 
                                size="2xl" 
                                className={`mb-2 ${branchInfo?.found ? 'text-success' : 'text-warning'}`} 
                              />
                              <h6 className="fw-bold">Branch Match</h6>
                              <CBadge color={branchInfo?.found ? 'success' : 'warning'}>
                                {branchInfo?.found ? 'Found ✓' : 'Will Need Create'}
                              </CBadge>
                              {(branchInfo?.name || branchInfo?.suggestedName) && (
                                <p className="small text-muted mt-2 mb-0">{branchInfo.name || branchInfo.suggestedName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {stockData && Object.keys(stockData).length > 0 && (
                        <div className="card border-0 shadow-sm">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">
                              <CIcon icon={cilCloudDownload} className="me-2 text-secondary" />
                              Source Stock Data (From Excel)
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Chassis</label>
                                <p className="mb-2">{stockData.chassisNumber || 'N/A'}</p>
                              </div>
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Engine</label>
                                <p className="mb-2">{stockData.engineNo || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">DMS Vehicle Model</label>
                                <p className="mb-2">{stockData.vehicleModel || 'N/A'}</p>
                              </div>
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">DMS Vehicle Color</label>
                                <p className="mb-2">{stockData.vehicleColor || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Branch</label>
                                <p className="mb-2">{stockData.branch || 'N/A'}</p>
                              </div>
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Location</label>
                                <p className="mb-2">{stockData.location || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">TVS Invoice No</label>
                                <p className="mb-2">{stockData.tvsInvoiceNo || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">TVS Invoice Date</label>
                                <p className="mb-2">{formatDate(stockData.tvsInvoiceDate)}</p>
                              </div>
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Series</label>
                                <p className="mb-2">{stockData.series || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {canUpdateAdvantageTVS && (
                        <div className="mt-4 d-flex gap-2 justify-content-end border-top pt-3">
                          <CButton 
                            color="success" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewModalVisible(false);
                              openActionModal(selectedVehicle, 'approve', e);
                            }}
                            disabled={actionLoadingId === (selectedVehicle._id || selectedVehicle.id) || isModelMismatch || isColorMismatch}
                            title={isModelMismatch || isColorMismatch ? 'Fix mismatch before approving' : 'Approve'}
                            className="px-4"
                          >
                            <CIcon icon={cilCheck} className="me-1" /> Approve
                          </CButton>
                          <CButton 
                            color="danger" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewModalVisible(false);
                              openActionModal(selectedVehicle, 'reject', e);
                            }}
                            disabled={actionLoadingId === (selectedVehicle._id || selectedVehicle.id)}
                            className="px-4"
                          >
                            <CIcon icon={cilX} className="me-1" /> Reject
                          </CButton>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="secondary" onClick={() => {
            setViewModalVisible(false);
            setSelectedVehicle(null);
          }}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdvantageTVSVehicles;