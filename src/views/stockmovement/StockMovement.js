//  --------------GENERAL--------------



// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import '../../css/form.css';
// import './challan.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormSelect,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CFormCheck,
//   CFormInput,
//   CCol,
//   CRow,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CAlert,
//   CCard,
//   CCardBody,
//   CSpinner,
//   CFormLabel,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilUser, cilSearch, cilTransfer, cilLocationPin, cilShieldAlt, cilChevronLeft, cilChevronRight, cilZoomOut } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import TransferChallan from '../purchase/StockChallan';

// // Pagination constants
// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 20;

// const StockMovement = () => {
//   const [formData, setFormData] = useState({
//     sourceDatabase: '',
//     sourceLocationType: 'branch',
//     sourceLocationId: '',
//     targetDatabase: '',
//     targetLocationType: 'branch',
//     targetLocationId: '',
//     notes: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [locations, setLocations] = useState({});
//   const [databases, setDatabases] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
//   const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [challanData, setChallanData] = useState(null);
  
//   // Server-side pagination states for vehicles
//   const [vehiclePagination, setVehiclePagination] = useState({
//     currentPage: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 0,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
  
//   // Debounce timer for search
//   const searchTimer = useRef(null);
  
//   // Search input ref to maintain focus
//   const searchInputRef = useRef(null);
  
//   // OTP related states
//   const [otpUsers, setOtpUsers] = useState([]);
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [selectedOtpUser, setSelectedOtpUser] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpData, setOtpData] = useState({
//     otp: '',
//     otpMethod: 'SMS'
//   });
//   const [isSendingOtp, setIsSendingOtp] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpError, setOtpError] = useState('');

//   const navigate = useNavigate();
//   const { permissions = [] } = useAuth();

//   // Database display names mapping
//   const databaseDisplayNames = {
//     'db1': '14588',
//     'db2': '14589'
//   };

//   // Get database display name
//   const getDatabaseDisplayName = (dbKey) => {
//     return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
//   };

//   // Format date to DD-MM-YYYY
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '';
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       return '';
//     }
//   };

//   // Fetch locations
//   const fetchLocations = async () => {
//     setIsLoadingLocations(true);
//     try {
//       const response = await axiosInstance.get('/crossData/locations');
//       if (response.data.status === 'success') {
//         setLocations(response.data.data);
//       } else {
//         showError('Failed to fetch locations');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsLoadingLocations(false);
//     }
//   };

//   // Fetch vehicles with server-side pagination and search
//   const fetchVehicles = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
//     const { sourceDatabase, sourceLocationType, sourceLocationId } = formData;
    
//     if (!sourceDatabase || !sourceLocationType || !sourceLocationId) {
//       return;
//     }
    
//     setIsLoadingVehicles(true);
//     try {
//       const params = {
//         database: sourceDatabase,
//         locationType: sourceLocationType,
//         locationId: sourceLocationId,
//         page,
//         limit,
//         ...(search && { search: search.trim() })
//       };
      
//       const response = await axiosInstance.get('/crossData/vehicles', { params });
      
//       if (response.data.status === 'success') {
//         const vehiclesData = response.data.data.vehicles || [];
//         const pagination = response.data.data.pagination || {};
        
//         setVehicles(vehiclesData);
//         setVehiclePagination({
//           currentPage: pagination.page || page,
//           limit: pagination.limit || limit,
//           total: pagination.total || 0,
//           pages: pagination.pages || 0,
//           hasNextPage: pagination.hasNextPage || false,
//           hasPrevPage: pagination.hasPrevPage || false
//         });
        
//         // Clear selected vehicles when data changes
//         setSelectedVehicles([]);
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsLoadingVehicles(false);
//     }
//   }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

//   // Fetch OTP users for location
//   const fetchOtpUsersForLocation = async () => {
//     try {
//       const { sourceLocationType, sourceLocationId } = formData;
      
//       const response = await axiosInstance.get('/users');
//       const allUsers = response.data.data || [];
      
//       let filteredUsers = [];
      
//       if (sourceLocationType === 'branch') {
//         filteredUsers = allUsers.filter(user => 
//           user.branch === sourceLocationId && 
//           user.isStockTransferOTP === true
//         );
//       } else if (sourceLocationType === 'subdealer') {
//         filteredUsers = allUsers.filter(user => 
//           user.subdealer === sourceLocationId && 
//           user.isStockTransferOTP === true
//         );
//       }
      
//       setOtpUsers(filteredUsers);
      
//       if (filteredUsers.length === 0) {
//         setShowOtpSection(false);
//         setOtpVerified(true);
//       } else {
//         setShowOtpSection(true);
//         setOtpVerified(false);
//         setSelectedOtpUser('');
//         setOtpSent(false);
//         setOtpError('');
//       }
//     } catch (error) {
//       console.error('Error fetching OTP users:', error);
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setOtpVerified(true);
//     }
//   };

//   // Initial fetch locations
//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   // Update databases when locations change
//   useEffect(() => {
//     if (locations && Object.keys(locations).length > 0) {
//       const dbKeys = Object.keys(locations).filter(key => locations[key] && (locations[key].branches || locations[key].subdealers));
//       setDatabases(dbKeys);
//     }
//   }, [locations]);

//   // Trigger fetch when source location changes
//   useEffect(() => {
//     if (formData.sourceDatabase && formData.sourceLocationType && formData.sourceLocationId) {
//       fetchVehicles(1, DEFAULT_LIMIT, searchTerm);
//     }
//   }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

//   // Cleanup timer on unmount
//   useEffect(() => {
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, []);

//   // Handle search with debounce - exactly like SalesDetailedReport
//   const handleSearch = useCallback((value) => {
//     setSearchTerm(value);
    
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     searchTimer.current = setTimeout(() => {
//       fetchVehicles(1, vehiclePagination.limit, value);
//     }, 500);
//   }, [fetchVehicles, vehiclePagination.limit]);

//   const resetSearch = () => {
//     setSearchTerm('');
//     if (searchInputRef.current) {
//       searchInputRef.current.value = '';
//     }
//     fetchVehicles(1, vehiclePagination.limit, '');
//   };

//   const getSelectedUserOtpMethod = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.otpMethod || 'SMS';
//   };

//   const getSelectedUserName = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.name || '';
//   };

//   const handleSendOtp = async () => {
//     if (!selectedOtpUser) {
//       showError('Please select a user to send OTP');
//       return;
//     }

//     setIsSendingOtp(true);
//     setOtpError('');
    
//     try {
//       const response = await axiosInstance.post('/crossData/request-otp', {
//         userId: selectedOtpUser,
//         otpMethod: getSelectedUserOtpMethod()
//       });

//       if (response.data.status === 'success') {
//         showSuccess('OTP sent successfully!');
//         setOtpSent(true);
//         setOtpVerified(false);
//         setOtpData({ ...otpData, otp: '', otpMethod: getSelectedUserOtpMethod() });
//       } else {
//         showError(response.data.message || 'Failed to send OTP');
//         setOtpError(response.data.message || 'Failed to send OTP');
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         if (error.response.data.message) {
//           showError(error.response.data.message);
//           setOtpError(error.response.data.message);
//         } else if (error.response.data.error) {
//           showError(error.response.data.error);
//           setOtpError(error.response.data.error);
//         } else {
//           showError('Failed to send OTP. Please try again.');
//           setOtpError('Failed to send OTP. Please try again.');
//         }
//       } else if (error.message) {
//         showError(error.message);
//         setOtpError(error.message);
//       } else {
//         showError('Failed to send OTP. Please try again.');
//         setOtpError('Failed to send OTP. Please try again.');
//       }
//       setOtpSent(false);
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otpData.otp || otpData.otp.length < 6) {
//       showError('Please enter a valid 6-digit OTP');
//       return;
//     }

//     setIsVerifyingOtp(true);
//     setOtpError('');
    
//     try {
//       const response = await axiosInstance.post('/crossData/verify-otp', {
//         userId: selectedOtpUser,
//         otp: otpData.otp,
//         otpMethod: getSelectedUserOtpMethod()
//       });

//       if (response.data.status === 'success') {
//         showSuccess('OTP verified successfully!');
//         setOtpVerified(true);
//         setOtpError('');
//       } else {
//         showError(response.data.message || 'OTP verification failed');
//         setOtpError(response.data.message || 'OTP verification failed');
//         setOtpData({ ...otpData, otp: '' });
//       }
//     } catch (error) {
//       setOtpData({ ...otpData, otp: '' });
//       setOtpVerified(false);
      
//       if (error.response && error.response.data) {
//         if (error.response.data.error === "Invalid OTP or expired") {
//           showError('Invalid OTP or expired. Please try again.');
//           setOtpError('Invalid OTP or expired. Please try again.');
//         } else if (error.response.data.message) {
//           showError(error.response.data.message);
//           setOtpError(error.response.data.message);
//         } else if (error.response.data.error) {
//           showError(error.response.data.error);
//           setOtpError(error.response.data.error);
//         } else {
//           showError('OTP verification failed. Please try again.');
//           setOtpError('OTP verification failed. Please try again.');
//         }
//       } else if (error.message) {
//         showError(error.message);
//         setOtpError(error.message);
//       } else {
//         showError('OTP verification failed. Please try again.');
//         setOtpError('OTP verification failed. Please try again.');
//       }
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (name === 'sourceDatabase') {
//       setFormData(prevData => ({
//         ...prevData,
//         sourceLocationId: '',
//         targetDatabase: '',
//         targetLocationId: ''
//       }));
//       setVehicles([]);
//       setSelectedVehicles([]);
//       setSearchTerm('');
//       if (searchInputRef.current) {
//         searchInputRef.current.value = '';
//       }
//       setVehiclePagination(prev => ({
//         ...prev,
//         currentPage: 1,
//         total: 0,
//         pages: 0
//       }));
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpError('');
//       setOtpData({ otp: '', otpMethod: 'SMS' });
//     }

//     if (name === 'sourceLocationType') {
//       setFormData(prevData => ({
//         ...prevData,
//         sourceLocationId: ''
//       }));
//       setVehicles([]);
//       setSelectedVehicles([]);
//       setSearchTerm('');
//       if (searchInputRef.current) {
//         searchInputRef.current.value = '';
//       }
//       setVehiclePagination(prev => ({
//         ...prev,
//         currentPage: 1,
//         total: 0,
//         pages: 0
//       }));
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpError('');
//       setOtpData({ otp: '', otpMethod: 'SMS' });
//     }

//     if (name === 'sourceLocationId') {
//       if (value) {
//         fetchOtpUsersForLocation();
//       }
//     }

//     if (name === 'targetDatabase') {
//       setFormData(prevData => ({
//         ...prevData,
//         targetLocationId: ''
//       }));
//     }

//     if (name === 'targetLocationType') {
//       setFormData(prevData => ({
//         ...prevData,
//         targetLocationId: ''
//       }));
//     }

//     setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleVehicleSelect = (vehicleId, isSelected) => {
//     if (isSelected) {
//       setSelectedVehicles(prev => [...prev, vehicleId]);
//     } else {
//       setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
//     }
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allVehicleIds = vehicles.map(vehicle => vehicle._id);
//       setSelectedVehicles(allVehicleIds);
//     } else {
//       setSelectedVehicles([]);
//     }
//   };

//   // Handle vehicle pagination
//   const handleVehiclePageChange = (newPage) => {
//     if (newPage < 1 || newPage > vehiclePagination.pages) return;
//     fetchVehicles(newPage, vehiclePagination.limit, searchTerm);
//     const vehicleTable = document.querySelector('.vehicle-table');
//     if (vehicleTable) {
//       vehicleTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const handleVehicleLimitChange = (newLimit) => {
//     fetchVehicles(1, parseInt(newLimit, 10), searchTerm);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.sourceDatabase) {
//       newErrors.sourceDatabase = 'Source database is required';
//     }

//     if (!formData.sourceLocationId) {
//       newErrors.sourceLocationId = 'Source location is required';
//     }

//     if (!formData.targetDatabase) {
//       newErrors.targetDatabase = 'Target database is required';
//     }

//     if (!formData.targetLocationId) {
//       newErrors.targetLocationId = 'Target location is required';
//     }

//     if (selectedVehicles.length === 0) {
//       newErrors.vehicles = 'Please select at least one vehicle to transfer';
//     }

//     if (formData.sourceDatabase === formData.targetDatabase && 
//         formData.sourceLocationId === formData.targetLocationId &&
//         formData.sourceDatabase && formData.targetDatabase) {
//       newErrors.targetLocationId = 'Source and target locations cannot be the same';
//     }

//     if (otpUsers.length > 0 && !otpVerified) {
//       newErrors.otp = 'Please complete OTP verification before transferring vehicles';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         sourceDatabase: formData.sourceDatabase,
//         targetDatabase: formData.targetDatabase,
//         sourceLocationType: formData.sourceLocationType,
//         sourceLocationId: formData.sourceLocationId,
//         targetLocationType: formData.targetLocationType,
//         targetLocationId: formData.targetLocationId,
//         vehicleIds: selectedVehicles,
//         notes: formData.notes || ''
//       };

//       if (otpUsers.length > 0 && otpVerified && selectedOtpUser) {
//         payload.otpData = {
//           userId: selectedOtpUser,
//           otp: otpData.otp,
//           otpMethod: getSelectedUserOtpMethod()
//         };
//       }

//       const response = await axiosInstance.post('/crossData/transfer-requests', payload);

//       if (response.data.status === 'success') {
//         showSuccess('Vehicles transferred successfully!');
        
//         const sourceLocationData = getSourceLocationDetails();
//         const targetLocationData = getTargetLocationDetails();
//         const transferredVehicles = getTransferredVehiclesDetails();
        
//         setChallanData({
//           transferDetails: response.data,
//           fromType: formData.sourceLocationType,
//           fromBranch: formData.sourceLocationType === 'branch' ? sourceLocationData : null,
//           fromSubdealer: formData.sourceLocationType === 'subdealer' ? sourceLocationData : null,
//           toType: formData.targetLocationType,
//           toBranch: formData.targetLocationType === 'branch' ? targetLocationData : null,
//           toSubdealer: formData.targetLocationType === 'subdealer' ? targetLocationData : null,
//           vehicles: transferredVehicles,
//           destinationName: targetLocationData?.name || '',
//         });
        
//         setShowChallanModal(true);
        
//         setFormData({
//           sourceDatabase: '',
//           sourceLocationType: 'branch',
//           sourceLocationId: '',
//           targetDatabase: '',
//           targetLocationType: 'branch',
//           targetLocationId: '',
//           notes: ''
//         });
//         setSelectedVehicles([]);
//         setVehicles([]);
//         setSearchTerm('');
//         if (searchInputRef.current) {
//           searchInputRef.current.value = '';
//         }
//         setVehiclePagination({
//           currentPage: 1,
//           limit: DEFAULT_LIMIT,
//           total: 0,
//           pages: 0,
//           hasNextPage: false,
//           hasPrevPage: false
//         });
        
//         setOtpUsers([]);
//         setShowOtpSection(false);
//         setSelectedOtpUser('');
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtpError('');
//         setOtpData({ otp: '', otpMethod: 'SMS' });
//       } else {
//         showError(response.data.message || 'Failed to transfer vehicles');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getSourceLocationDetails = () => {
//     if (!formData.sourceDatabase || !formData.sourceLocationId) return null;
//     const locationsData = locations[formData.sourceDatabase];
//     if (!locationsData) return null;
    
//     const branches = locationsData.branches || [];
//     const subdealers = locationsData.subdealers || [];
    
//     const branch = branches.find(b => b._id === formData.sourceLocationId || b.id === formData.sourceLocationId);
//     if (branch) return branch;
    
//     const subdealer = subdealers.find(s => s._id === formData.sourceLocationId || s.id === formData.sourceLocationId);
//     return subdealer || null;
//   };

//   const getTargetLocationDetails = () => {
//     if (!formData.targetDatabase || !formData.targetLocationId) return null;
//     const locationsData = locations[formData.targetDatabase];
//     if (!locationsData) return null;
    
//     const branches = locationsData.branches || [];
//     const subdealers = locationsData.subdealers || [];
    
//     const branch = branches.find(b => b._id === formData.targetLocationId || b.id === formData.targetLocationId);
//     if (branch) return branch;
    
//     const subdealer = subdealers.find(s => s._id === formData.targetLocationId || s.id === formData.targetLocationId);
//     return subdealer || null;
//   };

//   const getTransferredVehiclesDetails = () => {
//     return vehicles.filter(v => selectedVehicles.includes(v._id));
//   };

//   const handleCancel = () => {
//     navigate('/dashboard');
//   };

//   const handleCloseModal = () => {
//     setShowChallanModal(false);
//     setChallanData(null);
//   };

//   const getLocationOptions = (databaseKey, locationType) => {
//     if (!databaseKey || !locations[databaseKey]) return [];
//     const locationsData = locations[databaseKey][locationType === 'branch' ? 'branches' : 'subdealers'] || [];
//     return locationsData;
//   };

//   const isSourceSelected = formData.sourceDatabase && formData.sourceLocationId;
//   const isTargetSelected = formData.targetDatabase && formData.targetLocationId;

//   // Pagination calculations for display
//   const vehicleStart = vehiclePagination.total === 0 ? 0 : (vehiclePagination.currentPage - 1) * vehiclePagination.limit + 1;
//   const vehicleEnd = Math.min(vehiclePagination.currentPage * vehiclePagination.limit, vehiclePagination.total);

//   // Render pagination component - exactly like SalesDetailedReport
//   const renderPagination = (currentPage, totalPages, onPageChange, onLimitChange, currentLimit, total, start, end, isLoading = false) => {
//     if (total === 0) return null;
    
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, currentPage + 2);
    
//     if (currentPage <= 3) {
//       endPage = Math.min(5, totalPages);
//     }
//     if (currentPage >= totalPages - 2) {
//       startPage = Math.max(1, totalPages - 4);
//     }
    
//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
    
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
//               Rows per page:
//             </CFormLabel>
//             <CFormSelect
//               value={currentLimit}
//               onChange={(e) => onLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={isLoading}
//             >
//               {PAGE_SIZE_OPTIONS.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {isLoading ? 'Loading…' : `Showing ${start}–${end} of ${total} vehicles`}
//           </span>
//         </div>
        
//         {totalPages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem
//               onClick={() => onPageChange(1)}
//               disabled={currentPage === 1 || isLoading}
//             >
//               «
//             </CPaginationItem>
//             <CPaginationItem
//               onClick={() => onPageChange(currentPage - 1)}
//               disabled={currentPage === 1 || isLoading}
//             >
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>
            
//             {startPage > 1 && (
//               <>
//                 <CPaginationItem onClick={() => onPageChange(1)} disabled={isLoading}>
//                   1
//                 </CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}
            
//             {pageNumbers.map(page => (
//               <CPaginationItem
//                 key={page}
//                 active={page === currentPage}
//                 onClick={() => onPageChange(page)}
//                 disabled={isLoading}
//               >
//                 {page}
//               </CPaginationItem>
//             ))}
            
//             {endPage < totalPages && (
//               <>
//                 {endPage < totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem onClick={() => onPageChange(totalPages)} disabled={isLoading}>
//                   {totalPages}
//                 </CPaginationItem>
//               </>
//             )}
            
//             <CPaginationItem
//               onClick={() => onPageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || isLoading}
//             >
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem
//               onClick={() => onPageChange(totalPages)}
//               disabled={currentPage === totalPages || isLoading}
//             >
//               »
//             </CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className='title'>INTER DEALER TRANSFER</div>

//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <div className="form-container">
//             {error && <CAlert color="danger">{error}</CAlert>}
//             <div className="form-card">
//               <div className="form-body">
//                 <form onSubmit={handleSubmit}>
//                   <div className="user-details">
//                     {/* Source Database */}
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Source Database</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilLocationPin} />
//                         </CInputGroupText>
//                         <CFormSelect
//                           name="sourceDatabase"
//                           value={formData.sourceDatabase}
//                           onChange={handleChange}
//                           invalid={!!errors.sourceDatabase}
//                           disabled={isLoadingLocations || isSubmitting}
//                         >
//                           <option value="">-Select Source Database-</option>
//                           {databases.map((db) => (
//                             <option key={db} value={db}>
//                               {getDatabaseDisplayName(db)}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       </CInputGroup>
//                       {errors.sourceDatabase && <div className="invalid-feedback">{errors.sourceDatabase}</div>}
//                     </div>

//                     {/* Source Location Type */}
//                     {formData.sourceDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Source Location Type</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilUser} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="sourceLocationType"
//                             value={formData.sourceLocationType}
//                             onChange={handleChange}
//                             disabled={isSubmitting}
//                           >
//                             <option value="branch">Branch</option>
//                             <option value="subdealer">Subdealer</option>
//                           </CFormSelect>
//                         </CInputGroup>
//                       </div>
//                     )}

//                     {/* Source Location */}
//                     {formData.sourceDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Source Location</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilLocationPin} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="sourceLocationId"
//                             value={formData.sourceLocationId}
//                             onChange={handleChange}
//                             invalid={!!errors.sourceLocationId}
//                             disabled={isSubmitting}
//                           >
//                             <option value="">-Select Source Location-</option>
//                             {getLocationOptions(formData.sourceDatabase, formData.sourceLocationType).map((location) => (
//                               <option key={location._id || location.id} value={location._id || location.id}>
//                                 {location.name} {location.city ? `(${location.city})` : ''}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.sourceLocationId && <div className="invalid-feedback">{errors.sourceLocationId}</div>}
//                       </div>
//                     )}

//                     {/* OTP User Selection Field */}
//                     {showOtpSection && otpUsers.length > 0 && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">OTP User</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilShieldAlt} />
//                           </CInputGroupText>
//                           <CFormSelect 
//                             value={selectedOtpUser}
//                             onChange={(e) => {
//                               setSelectedOtpUser(e.target.value);
//                               setOtpSent(false);
//                               setOtpVerified(false);
//                               setOtpError('');
//                               setOtpData({ otp: '', otpMethod: getSelectedUserOtpMethod() });
//                             }}
//                             disabled={otpSent || isSubmitting}
//                             invalid={!selectedOtpUser && otpUsers.length > 0}
//                           >
//                             <option value="">-Select User-</option>
//                             {otpUsers.map((user) => (
//                               <option key={user._id} value={user._id}>
//                                 {user.name} ({user.otpMethod})
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         <div className="mt-2">
//                           <CButton 
//                             color="primary" 
//                             size="sm"
//                             onClick={handleSendOtp}
//                             disabled={!selectedOtpUser || isSendingOtp || otpSent}
//                           >
//                             {isSendingOtp ? 'Sending...' : 'Send OTP'}
//                           </CButton>
//                         </div>
//                         {otpError && !otpSent && (
//                           <small className="text-danger d-block mt-1">{otpError}</small>
//                         )}
//                       </div>
//                     )}

//                     {/* Target Database */}
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Target Database</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilLocationPin} />
//                         </CInputGroupText>
//                         <CFormSelect
//                           name="targetDatabase"
//                           value={formData.targetDatabase}
//                           onChange={handleChange}
//                           invalid={!!errors.targetDatabase}
//                           disabled={isLoadingLocations || isSubmitting || !formData.sourceDatabase}
//                         >
//                           <option value="">-Select Target Database-</option>
//                           {databases
//                             .filter(db => db !== formData.sourceDatabase)
//                             .map((db) => (
//                               <option key={db} value={db}>
//                                 {getDatabaseDisplayName(db)}
//                               </option>
//                             ))}
//                         </CFormSelect>
//                       </CInputGroup>
//                       {errors.targetDatabase && <div className="invalid-feedback">{errors.targetDatabase}</div>}
//                     </div>

//                     {/* Target Location Type */}
//                     {formData.targetDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Target Location Type</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilUser} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="targetLocationType"
//                             value={formData.targetLocationType}
//                             onChange={handleChange}
//                             disabled={isSubmitting}
//                           >
//                             <option value="branch">Branch</option>
//                             <option value="subdealer">Subdealer</option>
//                           </CFormSelect>
//                         </CInputGroup>
//                       </div>
//                     )}

//                     {/* Target Location */}
//                     {formData.targetDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Target Location</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilLocationPin} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="targetLocationId"
//                             value={formData.targetLocationId}
//                             onChange={handleChange}
//                             invalid={!!errors.targetLocationId}
//                             disabled={isSubmitting}
//                           >
//                             <option value="">-Select Target Location-</option>
//                             {getLocationOptions(formData.targetDatabase, formData.targetLocationType).map((location) => (
//                               <option key={location._id || location.id} value={location._id || location.id}>
//                                 {location.name} {location.city ? `(${location.city})` : ''}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.targetLocationId && <div className="invalid-feedback">{errors.targetLocationId}</div>}
//                       </div>
//                     )}

//                     {/* OTP Input Field */}
//                     {otpSent && !otpVerified && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Enter OTP</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilShieldAlt} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="text"
//                             maxLength="6"
//                             placeholder="6-digit OTP"
//                             value={otpData.otp}
//                             onChange={(e) => {
//                               setOtpData({ ...otpData, otp: e.target.value });
//                               setOtpError('');
//                             }}
//                             disabled={isVerifyingOtp}
//                             invalid={!!otpError}
//                           />
//                           <CButton 
//                             color="success" 
//                             onClick={handleVerifyOtp}
//                             disabled={!otpData.otp || otpData.otp.length < 6 || isVerifyingOtp}
//                           >
//                             {isVerifyingOtp ? 'Verifying...' : 'Verify'}
//                           </CButton>
//                         </CInputGroup>
//                         {otpError && (
//                           <small className="text-danger d-block mt-1">{otpError}</small>
//                         )}
//                         <div className="d-flex justify-content-between align-items-center mt-2">
//                           <small className="text-muted">
//                             OTP sent to {getSelectedUserName()} via {getSelectedUserOtpMethod()}
//                           </small>
//                           <CButton 
//                             color="link" 
//                             size="sm" 
//                             onClick={handleSendOtp}
//                             disabled={isSendingOtp}
//                             className="p-0"
//                           >
//                             Resend OTP
//                           </CButton>
//                         </div>
//                       </div>
//                     )}

//                     {/* OTP Verified Status */}
//                     {otpVerified && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">OTP Status</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon bg-success text-white">
//                             <CIcon icon={cilShieldAlt} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="text"
//                             value="✓ OTP Verified"
//                             readOnly
//                             className="bg-success bg-opacity-25 text-success border-success"
//                           />
//                         </CInputGroup>
//                         <small className="text-success d-block mt-1">
//                           You can now proceed with stock transfer
//                         </small>
//                       </div>
//                     )}

//                     {/* Notes */}
//                     <div className="input-box full-width">
//                       <div className="details-container">
//                         <span className="details">Notes (Optional)</span>
//                       </div>
//                       <CFormInput
//                         type="text"
//                         name="notes"
//                         value={formData.notes}
//                         onChange={handleChange}
//                         placeholder="Add any notes about this transfer"
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>

//                   {/* Vehicles selection error message */}
//                   {errors.vehicles && (
//                     <div className="row">
//                       <div className="col-12">
//                         <div className="alert alert-danger mt-2">{errors.vehicles}</div>
//                       </div>
//                     </div>
//                   )}

//                   {/* OTP error message */}
//                   {errors.otp && (
//                     <div className="row">
//                       <div className="col-12">
//                         <div className="alert alert-warning mt-2">{errors.otp}</div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="form-footer">
//                     <button 
//                       type="submit" 
//                       className="submit-button" 
//                       disabled={isSubmitting || !isSourceSelected || !isTargetSelected || (otpUsers.length > 0 && !otpVerified)}
//                       title={otpUsers.length > 0 && !otpVerified ? "Please complete OTP verification first" : ""}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <CSpinner size="sm" className="me-2" />
//                           Transferring...
//                         </>
//                       ) : (
//                         <>
//                           <CIcon icon={cilTransfer} className="me-2" />
//                           Transfer Vehicles
//                         </>
//                       )}
//                     </button>
//                     <button 
//                       type="button" 
//                       className="cancel-button" 
//                       onClick={handleCancel} 
//                       disabled={isSubmitting}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>

//                 {/* Vehicles Table */}
//                 {isSourceSelected && (
//                   <div className="vehicle-table mt-4 p-3">
//                     <h5>In-Stock Vehicle Details ({vehiclePagination.total} vehicles available)</h5>

//                     <div className="d-flex justify-content-between mb-3">
//                       <div>
//                         {searchTerm && (
//                           <CButton size="sm" variant="outline" onClick={resetSearch}>
//                             <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
//                           </CButton>
//                         )}
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         <CFormLabel className="mb-0">Search:</CFormLabel>
//                         <input
//                           ref={searchInputRef}
//                           type="text"
//                           style={{ 
//                             width: '250px', 
//                             height: '32px', 
//                             borderRadius: '4px', 
//                             border: '1px solid #ced4da', 
//                             padding: '0 8px', 
//                             outline: 'none', 
//                             fontSize: '14px' 
//                           }}
//                           className="d-inline-block"
//                           value={searchTerm}
//                           onChange={(e) => handleSearch(e.target.value)}
//                           placeholder="Search by chassis, model, type..."
//                           autoComplete="off"
//                         />
//                         {isLoadingVehicles && <CSpinner size="sm" color="primary" />}
//                       </div>
//                     </div>

//                     <div className="text-end mb-2">
//                       <span className="badge bg-info me-3">
//                         Selected: {selectedVehicles.length} vehicles
//                       </span>
//                       {vehicles.length > 0 && (
//                         <CFormCheck
//                           label={`Select All (${vehicles.length})`}
//                           onChange={handleSelectAll}
//                           checked={selectedVehicles.length === vehicles.length && vehicles.length > 0}
//                           indeterminate={selectedVehicles.length > 0 && selectedVehicles.length < vehicles.length}
//                           className="d-inline-block"
//                         />
//                       )}
//                     </div>

//                     {isLoadingVehicles && vehicles.length === 0 ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="responsive-table-wrapper">
//                           <CTable striped bordered hover responsive>
//                             <CTableHead className="table-header-fixed">
//                               <CTableRow>
//                                 <CTableHeaderCell style={{ width: '50px' }}>Select</CTableHeaderCell>
//                                 <CTableHeaderCell style={{ width: '60px' }}>Sr. No</CTableHeaderCell>
//                                 <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                                 <CTableHeaderCell>Type</CTableHeaderCell>
//                                 <CTableHeaderCell>Color</CTableHeaderCell>
//                                 <CTableHeaderCell>Status</CTableHeaderCell>
//                                 <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                               </CTableRow>
//                             </CTableHead>
//                             <CTableBody>
//                               {vehicles.length > 0 ? (
//                                 vehicles.map((vehicle, index) => (
//                                   <CTableRow key={vehicle._id}>
//                                     <CTableDataCell>
//                                       <CFormCheck
//                                         onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
//                                         checked={selectedVehicles.includes(vehicle._id)}
//                                         disabled={isSubmitting}
//                                       />
//                                     </CTableDataCell>
//                                     <CTableDataCell>{vehicleStart + index}</CTableDataCell>
//                                     <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
//                                     <CTableDataCell>{vehicle.modelName}</CTableDataCell>
//                                     <CTableDataCell>
//                                       <span className="badge bg-secondary">{vehicle.type}</span>
//                                     </CTableDataCell>
//                                     <CTableDataCell>{vehicle.color?.name || '-'}</CTableDataCell>
//                                     <CTableDataCell>
//                                       <span className={`badge bg-${vehicle.status === 'in_stock' ? 'success' : 'warning'}`}>
//                                         {vehicle.status?.replace('_', ' ') || vehicle.status}
//                                       </span>
//                                     </CTableDataCell>
//                                     <CTableDataCell>
//                                       {formatDate(vehicle.inwardDate)}
//                                     </CTableDataCell>
//                                   </CTableRow>
//                                 ))
//                               ) : (
//                                 <CTableRow>
//                                   <CTableDataCell colSpan={8} className="text-center text-danger">
//                                     {searchTerm ? `No vehicles match your search criteria "${searchTerm}"` : 'No in-stock vehicles found'}
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               )}
//                             </CTableBody>
//                           </CTable>
//                         </div>

//                         {renderPagination(
//                           vehiclePagination.currentPage,
//                           vehiclePagination.pages,
//                           handleVehiclePageChange,
//                           handleVehicleLimitChange,
//                           vehiclePagination.limit,
//                           vehiclePagination.total,
//                           vehicleStart,
//                           vehicleEnd,
//                           isLoadingVehicles
//                         )}
//                       </>
//                     )}
//                   </div>
//                 )}

//                 {isSourceSelected && vehiclePagination.total === 0 && !isLoadingVehicles && !searchTerm && (
//                   <div className="alert alert-info mt-4">
//                     No in-stock vehicles found at the selected source location.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Transfer Challan Modal */}
//       <CModal visible={showChallanModal} onClose={handleCloseModal} size="xl" scrollable>
//         <CModalHeader closeButton>
//           <CModalTitle>Transfer Challan Preview</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {challanData && <TransferChallan {...challanData} />}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseModal}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockMovement;





//   -----------------GMPL-----------------



// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import '../../css/form.css';
// import './challan.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormSelect,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CFormCheck,
//   CFormInput,
//   CCol,
//   CRow,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CAlert,
//   CCard,
//   CCardBody,
//   CSpinner,
//   CFormLabel,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilUser, cilSearch, cilTransfer, cilLocationPin, cilShieldAlt, cilChevronLeft, cilChevronRight, cilZoomOut } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import TransferChallan from '../purchase/StockChallan';

// // Pagination constants
// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// const DEFAULT_LIMIT = 20;

// const StockMovement = () => {
//   const [formData, setFormData] = useState({
//     sourceDatabase: 'db1', // Auto-set to db1 (14588)
//     sourceLocationType: 'branch',
//     sourceLocationId: '',
//     targetDatabase: 'db2', // Auto-set to db2 (14589)
//     targetLocationType: 'branch',
//     targetLocationId: '',
//     notes: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [locations, setLocations] = useState({});
//   const [databases, setDatabases] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
//   const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [challanData, setChallanData] = useState(null);
  
//   // Server-side pagination states for vehicles
//   const [vehiclePagination, setVehiclePagination] = useState({
//     currentPage: 1,
//     limit: DEFAULT_LIMIT,
//     total: 0,
//     pages: 0,
//     hasNextPage: false,
//     hasPrevPage: false
//   });
  
//   // Debounce timer for search
//   const searchTimer = useRef(null);
  
//   // Search input ref to maintain focus
//   const searchInputRef = useRef(null);
  
//   // OTP related states
//   const [otpUsers, setOtpUsers] = useState([]);
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [selectedOtpUser, setSelectedOtpUser] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpData, setOtpData] = useState({
//     otp: '',
//     otpMethod: 'SMS'
//   });
//   const [isSendingOtp, setIsSendingOtp] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpError, setOtpError] = useState('');

//   const navigate = useNavigate();
//   const { permissions = [] } = useAuth();

//   // Database display names mapping
//   const databaseDisplayNames = {
//     'db1': '14588',
//     'db2': '14589'
//   };

//   // Get database display name
//   const getDatabaseDisplayName = (dbKey) => {
//     return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
//   };

//   // Format date to DD-MM-YYYY
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '';
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       return '';
//     }
//   };

//   // Fetch locations
//   const fetchLocations = async () => {
//     setIsLoadingLocations(true);
//     try {
//       const response = await axiosInstance.get('/crossData/locations');
//       if (response.data.status === 'success') {
//         setLocations(response.data.data);
//       } else {
//         showError('Failed to fetch locations');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsLoadingLocations(false);
//     }
//   };

//   // Fetch vehicles with server-side pagination and search
//   const fetchVehicles = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
//     const { sourceDatabase, sourceLocationType, sourceLocationId } = formData;
    
//     if (!sourceDatabase || !sourceLocationType || !sourceLocationId) {
//       return;
//     }
    
//     setIsLoadingVehicles(true);
//     try {
//       const params = {
//         database: sourceDatabase,
//         locationType: sourceLocationType,
//         locationId: sourceLocationId,
//         page,
//         limit,
//         ...(search && { search: search.trim() })
//       };
      
//       const response = await axiosInstance.get('/crossData/vehicles', { params });
      
//       if (response.data.status === 'success') {
//         const vehiclesData = response.data.data.vehicles || [];
//         const pagination = response.data.data.pagination || {};
        
//         setVehicles(vehiclesData);
//         setVehiclePagination({
//           currentPage: pagination.page || page,
//           limit: pagination.limit || limit,
//           total: pagination.total || 0,
//           pages: pagination.pages || 0,
//           hasNextPage: pagination.hasNextPage || false,
//           hasPrevPage: pagination.hasPrevPage || false
//         });
        
//         // Clear selected vehicles when data changes
//         setSelectedVehicles([]);
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsLoadingVehicles(false);
//     }
//   }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

//   // Fetch OTP users for location
//   const fetchOtpUsersForLocation = async () => {
//     try {
//       const { sourceLocationType, sourceLocationId } = formData;
      
//       const response = await axiosInstance.get('/users');
//       const allUsers = response.data.data || [];
      
//       let filteredUsers = [];
      
//       if (sourceLocationType === 'branch') {
//         filteredUsers = allUsers.filter(user => 
//           user.branch === sourceLocationId && 
//           user.isStockTransferOTP === true
//         );
//       } else if (sourceLocationType === 'subdealer') {
//         filteredUsers = allUsers.filter(user => 
//           user.subdealer === sourceLocationId && 
//           user.isStockTransferOTP === true
//         );
//       }
      
//       setOtpUsers(filteredUsers);
      
//       if (filteredUsers.length === 0) {
//         setShowOtpSection(false);
//         setOtpVerified(true);
//       } else {
//         setShowOtpSection(true);
//         setOtpVerified(false);
//         setSelectedOtpUser('');
//         setOtpSent(false);
//         setOtpError('');
//       }
//     } catch (error) {
//       console.error('Error fetching OTP users:', error);
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setOtpVerified(true);
//     }
//   };

//   // Initial fetch locations
//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   // Update databases when locations change
//   useEffect(() => {
//     if (locations && Object.keys(locations).length > 0) {
//       const dbKeys = Object.keys(locations).filter(key => locations[key] && (locations[key].branches || locations[key].subdealers));
//       setDatabases(dbKeys);
//     }
//   }, [locations]);

//   // Trigger fetch when source location changes
//   useEffect(() => {
//     if (formData.sourceDatabase && formData.sourceLocationType && formData.sourceLocationId) {
//       fetchVehicles(1, DEFAULT_LIMIT, searchTerm);
//     }
//   }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

//   // Cleanup timer on unmount
//   useEffect(() => {
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, []);

//   // Handle search with debounce - exactly like SalesDetailedReport
//   const handleSearch = useCallback((value) => {
//     setSearchTerm(value);
    
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
    
//     searchTimer.current = setTimeout(() => {
//       fetchVehicles(1, vehiclePagination.limit, value);
//     }, 500);
//   }, [fetchVehicles, vehiclePagination.limit]);

//   const resetSearch = () => {
//     setSearchTerm('');
//     if (searchInputRef.current) {
//       searchInputRef.current.value = '';
//     }
//     fetchVehicles(1, vehiclePagination.limit, '');
//   };

//   const getSelectedUserOtpMethod = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.otpMethod || 'SMS';
//   };

//   const getSelectedUserName = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.name || '';
//   };

//   const handleSendOtp = async () => {
//     if (!selectedOtpUser) {
//       showError('Please select a user to send OTP');
//       return;
//     }

//     setIsSendingOtp(true);
//     setOtpError('');
    
//     try {
//       const response = await axiosInstance.post('/crossData/request-otp', {
//         userId: selectedOtpUser,
//         otpMethod: getSelectedUserOtpMethod()
//       });

//       if (response.data.status === 'success') {
//         showSuccess('OTP sent successfully!');
//         setOtpSent(true);
//         setOtpVerified(false);
//         setOtpData({ ...otpData, otp: '', otpMethod: getSelectedUserOtpMethod() });
//       } else {
//         showError(response.data.message || 'Failed to send OTP');
//         setOtpError(response.data.message || 'Failed to send OTP');
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         if (error.response.data.message) {
//           showError(error.response.data.message);
//           setOtpError(error.response.data.message);
//         } else if (error.response.data.error) {
//           showError(error.response.data.error);
//           setOtpError(error.response.data.error);
//         } else {
//           showError('Failed to send OTP. Please try again.');
//           setOtpError('Failed to send OTP. Please try again.');
//         }
//       } else if (error.message) {
//         showError(error.message);
//         setOtpError(error.message);
//       } else {
//         showError('Failed to send OTP. Please try again.');
//         setOtpError('Failed to send OTP. Please try again.');
//       }
//       setOtpSent(false);
//     } finally {
//       setIsSendingOtp(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otpData.otp || otpData.otp.length < 6) {
//       showError('Please enter a valid 6-digit OTP');
//       return;
//     }

//     setIsVerifyingOtp(true);
//     setOtpError('');
    
//     try {
//       const response = await axiosInstance.post('/crossData/verify-otp', {
//         userId: selectedOtpUser,
//         otp: otpData.otp,
//         otpMethod: getSelectedUserOtpMethod()
//       });

//       if (response.data.status === 'success') {
//         showSuccess('OTP verified successfully!');
//         setOtpVerified(true);
//         setOtpError('');
//       } else {
//         showError(response.data.message || 'OTP verification failed');
//         setOtpError(response.data.message || 'OTP verification failed');
//         setOtpData({ ...otpData, otp: '' });
//       }
//     } catch (error) {
//       setOtpData({ ...otpData, otp: '' });
//       setOtpVerified(false);
      
//       if (error.response && error.response.data) {
//         if (error.response.data.error === "Invalid OTP or expired") {
//           showError('Invalid OTP or expired. Please try again.');
//           setOtpError('Invalid OTP or expired. Please try again.');
//         } else if (error.response.data.message) {
//           showError(error.response.data.message);
//           setOtpError(error.response.data.message);
//         } else if (error.response.data.error) {
//           showError(error.response.data.error);
//           setOtpError(error.response.data.error);
//         } else {
//           showError('OTP verification failed. Please try again.');
//           setOtpError('OTP verification failed. Please try again.');
//         }
//       } else if (error.message) {
//         showError(error.message);
//         setOtpError(error.message);
//       } else {
//         showError('OTP verification failed. Please try again.');
//         setOtpError('OTP verification failed. Please try again.');
//       }
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     // Prevent changes to sourceDatabase and targetDatabase
//     if (name === 'sourceDatabase' || name === 'targetDatabase') {
//       return;
//     }
    
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (name === 'sourceLocationType') {
//       setFormData(prevData => ({
//         ...prevData,
//         sourceLocationId: ''
//       }));
//       setVehicles([]);
//       setSelectedVehicles([]);
//       setSearchTerm('');
//       if (searchInputRef.current) {
//         searchInputRef.current.value = '';
//       }
//       setVehiclePagination(prev => ({
//         ...prev,
//         currentPage: 1,
//         total: 0,
//         pages: 0
//       }));
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpError('');
//       setOtpData({ otp: '', otpMethod: 'SMS' });
//     }

//     if (name === 'sourceLocationId') {
//       if (value) {
//         fetchOtpUsersForLocation();
//       }
//     }

//     if (name === 'targetLocationType') {
//       setFormData(prevData => ({
//         ...prevData,
//         targetLocationId: ''
//       }));
//     }

//     setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleVehicleSelect = (vehicleId, isSelected) => {
//     if (isSelected) {
//       setSelectedVehicles(prev => [...prev, vehicleId]);
//     } else {
//       setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
//     }
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allVehicleIds = vehicles.map(vehicle => vehicle._id);
//       setSelectedVehicles(allVehicleIds);
//     } else {
//       setSelectedVehicles([]);
//     }
//   };

//   // Handle vehicle pagination
//   const handleVehiclePageChange = (newPage) => {
//     if (newPage < 1 || newPage > vehiclePagination.pages) return;
//     fetchVehicles(newPage, vehiclePagination.limit, searchTerm);
//     const vehicleTable = document.querySelector('.vehicle-table');
//     if (vehicleTable) {
//       vehicleTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const handleVehicleLimitChange = (newLimit) => {
//     fetchVehicles(1, parseInt(newLimit, 10), searchTerm);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.sourceDatabase) {
//       newErrors.sourceDatabase = 'Source database is required';
//     }

//     if (!formData.sourceLocationId) {
//       newErrors.sourceLocationId = 'Source location is required';
//     }

//     if (!formData.targetDatabase) {
//       newErrors.targetDatabase = 'Target database is required';
//     }

//     if (!formData.targetLocationId) {
//       newErrors.targetLocationId = 'Target location is required';
//     }

//     if (selectedVehicles.length === 0) {
//       newErrors.vehicles = 'Please select at least one vehicle to transfer';
//     }

//     if (formData.sourceDatabase === formData.targetDatabase && 
//         formData.sourceLocationId === formData.targetLocationId &&
//         formData.sourceDatabase && formData.targetDatabase) {
//       newErrors.targetLocationId = 'Source and target locations cannot be the same';
//     }

//     if (otpUsers.length > 0 && !otpVerified) {
//       newErrors.otp = 'Please complete OTP verification before transferring vehicles';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         sourceDatabase: formData.sourceDatabase,
//         targetDatabase: formData.targetDatabase,
//         sourceLocationType: formData.sourceLocationType,
//         sourceLocationId: formData.sourceLocationId,
//         targetLocationType: formData.targetLocationType,
//         targetLocationId: formData.targetLocationId,
//         vehicleIds: selectedVehicles,
//         notes: formData.notes || ''
//       };

//       if (otpUsers.length > 0 && otpVerified && selectedOtpUser) {
//         payload.otpData = {
//           userId: selectedOtpUser,
//           otp: otpData.otp,
//           otpMethod: getSelectedUserOtpMethod()
//         };
//       }

//       const response = await axiosInstance.post('/crossData/transfer-requests', payload);

//       if (response.data.status === 'success') {
//         showSuccess('Vehicles transferred successfully!');
        
//         const sourceLocationData = getSourceLocationDetails();
//         const targetLocationData = getTargetLocationDetails();
//         const transferredVehicles = getTransferredVehiclesDetails();
        
//         setChallanData({
//           transferDetails: response.data,
//           fromType: formData.sourceLocationType,
//           fromBranch: formData.sourceLocationType === 'branch' ? sourceLocationData : null,
//           fromSubdealer: formData.sourceLocationType === 'subdealer' ? sourceLocationData : null,
//           toType: formData.targetLocationType,
//           toBranch: formData.targetLocationType === 'branch' ? targetLocationData : null,
//           toSubdealer: formData.targetLocationType === 'subdealer' ? targetLocationData : null,
//           vehicles: transferredVehicles,
//           destinationName: targetLocationData?.name || '',
//         });
        
//         setShowChallanModal(true);
        
//         setFormData({
//           sourceDatabase: 'db1',
//           sourceLocationType: 'branch',
//           sourceLocationId: '',
//           targetDatabase: 'db2',
//           targetLocationType: 'branch',
//           targetLocationId: '',
//           notes: ''
//         });
//         setSelectedVehicles([]);
//         setVehicles([]);
//         setSearchTerm('');
//         if (searchInputRef.current) {
//           searchInputRef.current.value = '';
//         }
//         setVehiclePagination({
//           currentPage: 1,
//           limit: DEFAULT_LIMIT,
//           total: 0,
//           pages: 0,
//           hasNextPage: false,
//           hasPrevPage: false
//         });
        
//         setOtpUsers([]);
//         setShowOtpSection(false);
//         setSelectedOtpUser('');
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtpError('');
//         setOtpData({ otp: '', otpMethod: 'SMS' });
//       } else {
//         showError(response.data.message || 'Failed to transfer vehicles');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getSourceLocationDetails = () => {
//     if (!formData.sourceDatabase || !formData.sourceLocationId) return null;
//     const locationsData = locations[formData.sourceDatabase];
//     if (!locationsData) return null;
    
//     const branches = locationsData.branches || [];
//     const subdealers = locationsData.subdealers || [];
    
//     const branch = branches.find(b => b._id === formData.sourceLocationId || b.id === formData.sourceLocationId);
//     if (branch) return branch;
    
//     const subdealer = subdealers.find(s => s._id === formData.sourceLocationId || s.id === formData.sourceLocationId);
//     return subdealer || null;
//   };

//   const getTargetLocationDetails = () => {
//     if (!formData.targetDatabase || !formData.targetLocationId) return null;
//     const locationsData = locations[formData.targetDatabase];
//     if (!locationsData) return null;
    
//     const branches = locationsData.branches || [];
//     const subdealers = locationsData.subdealers || [];
    
//     const branch = branches.find(b => b._id === formData.targetLocationId || b.id === formData.targetLocationId);
//     if (branch) return branch;
    
//     const subdealer = subdealers.find(s => s._id === formData.targetLocationId || s.id === formData.targetLocationId);
//     return subdealer || null;
//   };

//   const getTransferredVehiclesDetails = () => {
//     return vehicles.filter(v => selectedVehicles.includes(v._id));
//   };

//   const handleCancel = () => {
//     navigate('/dashboard');
//   };

//   const handleCloseModal = () => {
//     setShowChallanModal(false);
//     setChallanData(null);
//   };

//   const getLocationOptions = (databaseKey, locationType) => {
//     if (!databaseKey || !locations[databaseKey]) return [];
//     const locationsData = locations[databaseKey][locationType === 'branch' ? 'branches' : 'subdealers'] || [];
//     return locationsData;
//   };

//   const isSourceSelected = formData.sourceDatabase && formData.sourceLocationId;
//   const isTargetSelected = formData.targetDatabase && formData.targetLocationId;

//   // Pagination calculations for display
//   const vehicleStart = vehiclePagination.total === 0 ? 0 : (vehiclePagination.currentPage - 1) * vehiclePagination.limit + 1;
//   const vehicleEnd = Math.min(vehiclePagination.currentPage * vehiclePagination.limit, vehiclePagination.total);

//   // Render pagination component - exactly like SalesDetailedReport
//   const renderPagination = (currentPage, totalPages, onPageChange, onLimitChange, currentLimit, total, start, end, isLoading = false) => {
//     if (total === 0) return null;
    
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, currentPage + 2);
    
//     if (currentPage <= 3) {
//       endPage = Math.min(5, totalPages);
//     }
//     if (currentPage >= totalPages - 2) {
//       startPage = Math.max(1, totalPages - 4);
//     }
    
//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
    
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
//               Rows per page:
//             </CFormLabel>
//             <CFormSelect
//               value={currentLimit}
//               onChange={(e) => onLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={isLoading}
//             >
//               {PAGE_SIZE_OPTIONS.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {isLoading ? 'Loading…' : `Showing ${start}–${end} of ${total} vehicles`}
//           </span>
//         </div>
        
//         {totalPages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem
//               onClick={() => onPageChange(1)}
//               disabled={currentPage === 1 || isLoading}
//             >
//               «
//             </CPaginationItem>
//             <CPaginationItem
//               onClick={() => onPageChange(currentPage - 1)}
//               disabled={currentPage === 1 || isLoading}
//             >
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>
            
//             {startPage > 1 && (
//               <>
//                 <CPaginationItem onClick={() => onPageChange(1)} disabled={isLoading}>
//                   1
//                 </CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}
            
//             {pageNumbers.map(page => (
//               <CPaginationItem
//                 key={page}
//                 active={page === currentPage}
//                 onClick={() => onPageChange(page)}
//                 disabled={isLoading}
//               >
//                 {page}
//               </CPaginationItem>
//             ))}
            
//             {endPage < totalPages && (
//               <>
//                 {endPage < totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem onClick={() => onPageChange(totalPages)} disabled={isLoading}>
//                   {totalPages}
//                 </CPaginationItem>
//               </>
//             )}
            
//             <CPaginationItem
//               onClick={() => onPageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || isLoading}
//             >
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem
//               onClick={() => onPageChange(totalPages)}
//               disabled={currentPage === totalPages || isLoading}
//             >
//               »
//             </CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className='title'>INTER DEALER TRANSFER</div>

//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <div className="form-container">
//             {error && <CAlert color="danger">{error}</CAlert>}
//             <div className="form-card">
//               <div className="form-body">
//                 <form onSubmit={handleSubmit}>
//                   <div className="user-details">
//                     {/* Source Database - Disabled and auto-selected */}
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Source Database</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilLocationPin} />
//                         </CInputGroupText>
//                         <CFormSelect
//                           name="sourceDatabase"
//                           value={formData.sourceDatabase}
//                           onChange={handleChange}
//                           invalid={!!errors.sourceDatabase}
//                           disabled={true} // Disabled to prevent changes
//                           className="bg-light"
//                         >
//                           <option value="db1">14588</option>
//                         </CFormSelect>
//                       </CInputGroup>
//                       {errors.sourceDatabase && <div className="invalid-feedback">{errors.sourceDatabase}</div>}
//                     </div>

//                     {/* Source Location Type */}
//                     {formData.sourceDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Source Location Type</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilUser} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="sourceLocationType"
//                             value={formData.sourceLocationType}
//                             onChange={handleChange}
//                             disabled={isSubmitting}
//                           >
//                             <option value="branch">Branch</option>
//                             <option value="subdealer">Subdealer</option>
//                           </CFormSelect>
//                         </CInputGroup>
//                       </div>
//                     )}

//                     {/* Source Location */}
//                     {formData.sourceDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Source Location</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilLocationPin} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="sourceLocationId"
//                             value={formData.sourceLocationId}
//                             onChange={handleChange}
//                             invalid={!!errors.sourceLocationId}
//                             disabled={isSubmitting}
//                           >
//                             <option value="">-Select Source Location-</option>
//                             {getLocationOptions(formData.sourceDatabase, formData.sourceLocationType).map((location) => (
//                               <option key={location._id || location.id} value={location._id || location.id}>
//                                 {location.name} {location.city ? `(${location.city})` : ''}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.sourceLocationId && <div className="invalid-feedback">{errors.sourceLocationId}</div>}
//                       </div>
//                     )}

//                     {/* OTP User Selection Field */}
//                     {showOtpSection && otpUsers.length > 0 && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">OTP User</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilShieldAlt} />
//                           </CInputGroupText>
//                           <CFormSelect 
//                             value={selectedOtpUser}
//                             onChange={(e) => {
//                               setSelectedOtpUser(e.target.value);
//                               setOtpSent(false);
//                               setOtpVerified(false);
//                               setOtpError('');
//                               setOtpData({ otp: '', otpMethod: getSelectedUserOtpMethod() });
//                             }}
//                             disabled={otpSent || isSubmitting}
//                             invalid={!selectedOtpUser && otpUsers.length > 0}
//                           >
//                             <option value="">-Select User-</option>
//                             {otpUsers.map((user) => (
//                               <option key={user._id} value={user._id}>
//                                 {user.name} ({user.otpMethod})
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         <div className="mt-2">
//                           <CButton 
//                             color="primary" 
//                             size="sm"
//                             onClick={handleSendOtp}
//                             disabled={!selectedOtpUser || isSendingOtp || otpSent}
//                           >
//                             {isSendingOtp ? 'Sending...' : 'Send OTP'}
//                           </CButton>
//                         </div>
//                         {otpError && !otpSent && (
//                           <small className="text-danger d-block mt-1">{otpError}</small>
//                         )}
//                       </div>
//                     )}

//                     {/* Target Database - Disabled and auto-selected */}
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Target Database</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilLocationPin} />
//                         </CInputGroupText>
//                         <CFormSelect
//                           name="targetDatabase"
//                           value={formData.targetDatabase}
//                           onChange={handleChange}
//                           invalid={!!errors.targetDatabase}
//                           disabled={true} // Disabled to prevent changes
//                           className="bg-light"
//                         >
//                           <option value="db2">14589</option>
//                         </CFormSelect>
//                       </CInputGroup>
//                       {errors.targetDatabase && <div className="invalid-feedback">{errors.targetDatabase}</div>}
//                     </div>

//                     {/* Target Location Type */}
//                     {formData.targetDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Target Location Type</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilUser} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="targetLocationType"
//                             value={formData.targetLocationType}
//                             onChange={handleChange}
//                             disabled={isSubmitting}
//                           >
//                             <option value="branch">Branch</option>
//                             <option value="subdealer">Subdealer</option>
//                           </CFormSelect>
//                         </CInputGroup>
//                       </div>
//                     )}

//                     {/* Target Location */}
//                     {formData.targetDatabase && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Target Location</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilLocationPin} />
//                           </CInputGroupText>
//                           <CFormSelect
//                             name="targetLocationId"
//                             value={formData.targetLocationId}
//                             onChange={handleChange}
//                             invalid={!!errors.targetLocationId}
//                             disabled={isSubmitting}
//                           >
//                             <option value="">-Select Target Location-</option>
//                             {getLocationOptions(formData.targetDatabase, formData.targetLocationType).map((location) => (
//                               <option key={location._id || location.id} value={location._id || location.id}>
//                                 {location.name} {location.city ? `(${location.city})` : ''}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.targetLocationId && <div className="invalid-feedback">{errors.targetLocationId}</div>}
//                       </div>
//                     )}

//                     {/* OTP Input Field */}
//                     {otpSent && !otpVerified && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Enter OTP</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilShieldAlt} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="text"
//                             maxLength="6"
//                             placeholder="6-digit OTP"
//                             value={otpData.otp}
//                             onChange={(e) => {
//                               setOtpData({ ...otpData, otp: e.target.value });
//                               setOtpError('');
//                             }}
//                             disabled={isVerifyingOtp}
//                             invalid={!!otpError}
//                           />
//                           <CButton 
//                             color="success" 
//                             onClick={handleVerifyOtp}
//                             disabled={!otpData.otp || otpData.otp.length < 6 || isVerifyingOtp}
//                           >
//                             {isVerifyingOtp ? 'Verifying...' : 'Verify'}
//                           </CButton>
//                         </CInputGroup>
//                         {otpError && (
//                           <small className="text-danger d-block mt-1">{otpError}</small>
//                         )}
//                         <div className="d-flex justify-content-between align-items-center mt-2">
//                           <small className="text-muted">
//                             OTP sent to {getSelectedUserName()} via {getSelectedUserOtpMethod()}
//                           </small>
//                           <CButton 
//                             color="link" 
//                             size="sm" 
//                             onClick={handleSendOtp}
//                             disabled={isSendingOtp}
//                             className="p-0"
//                           >
//                             Resend OTP
//                           </CButton>
//                         </div>
//                       </div>
//                     )}

//                     {/* OTP Verified Status */}
//                     {otpVerified && (
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">OTP Status</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon bg-success text-white">
//                             <CIcon icon={cilShieldAlt} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="text"
//                             value="✓ OTP Verified"
//                             readOnly
//                             className="bg-success bg-opacity-25 text-success border-success"
//                           />
//                         </CInputGroup>
//                         <small className="text-success d-block mt-1">
//                           You can now proceed with stock transfer
//                         </small>
//                       </div>
//                     )}

//                     {/* Notes */}
//                     <div className="input-box full-width">
//                       <div className="details-container">
//                         <span className="details">Notes (Optional)</span>
//                       </div>
//                       <CFormInput
//                         type="text"
//                         name="notes"
//                         value={formData.notes}
//                         onChange={handleChange}
//                         placeholder="Add any notes about this transfer"
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>

//                   {/* Vehicles selection error message */}
//                   {errors.vehicles && (
//                     <div className="row">
//                       <div className="col-12">
//                         <div className="alert alert-danger mt-2">{errors.vehicles}</div>
//                       </div>
//                     </div>
//                   )}

//                   {/* OTP error message */}
//                   {errors.otp && (
//                     <div className="row">
//                       <div className="col-12">
//                         <div className="alert alert-warning mt-2">{errors.otp}</div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="form-footer">
//                     <button 
//                       type="submit" 
//                       className="submit-button" 
//                       disabled={isSubmitting || !isSourceSelected || !isTargetSelected || (otpUsers.length > 0 && !otpVerified)}
//                       title={otpUsers.length > 0 && !otpVerified ? "Please complete OTP verification first" : ""}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <CSpinner size="sm" className="me-2" />
//                           Transferring...
//                         </>
//                       ) : (
//                         <>
//                           <CIcon icon={cilTransfer} className="me-2" />
//                           Transfer Vehicles
//                         </>
//                       )}
//                     </button>
//                     <button 
//                       type="button" 
//                       className="cancel-button" 
//                       onClick={handleCancel} 
//                       disabled={isSubmitting}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>

//                 {/* Vehicles Table */}
//                 {isSourceSelected && (
//                   <div className="vehicle-table mt-4 p-3">
//                     <h5>In-Stock Vehicle Details ({vehiclePagination.total} vehicles available)</h5>

//                     <div className="d-flex justify-content-between mb-3">
//                       <div>
//                         {searchTerm && (
//                           <CButton size="sm" variant="outline" onClick={resetSearch}>
//                             <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
//                           </CButton>
//                         )}
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         <CFormLabel className="mb-0">Search:</CFormLabel>
//                         <input
//                           ref={searchInputRef}
//                           type="text"
//                           style={{ 
//                             width: '250px', 
//                             height: '32px', 
//                             borderRadius: '4px', 
//                             border: '1px solid #ced4da', 
//                             padding: '0 8px', 
//                             outline: 'none', 
//                             fontSize: '14px' 
//                           }}
//                           className="d-inline-block"
//                           value={searchTerm}
//                           onChange={(e) => handleSearch(e.target.value)}
//                           placeholder="Search by chassis, model, type..."
//                           autoComplete="off"
//                         />
//                         {isLoadingVehicles && <CSpinner size="sm" color="primary" />}
//                       </div>
//                     </div>

//                     <div className="text-end mb-2">
//                       <span className="badge bg-info me-3">
//                         Selected: {selectedVehicles.length} vehicles
//                       </span>
//                       {vehicles.length > 0 && (
//                         <CFormCheck
//                           label={`Select All (${vehicles.length})`}
//                           onChange={handleSelectAll}
//                           checked={selectedVehicles.length === vehicles.length && vehicles.length > 0}
//                           indeterminate={selectedVehicles.length > 0 && selectedVehicles.length < vehicles.length}
//                           className="d-inline-block"
//                         />
//                       )}
//                     </div>

//                     {isLoadingVehicles && vehicles.length === 0 ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="responsive-table-wrapper">
//                           <CTable striped bordered hover responsive>
//                             <CTableHead className="table-header-fixed">
//                               <CTableRow>
//                                 <CTableHeaderCell style={{ width: '50px' }}>Select</CTableHeaderCell>
//                                 <CTableHeaderCell style={{ width: '60px' }}>Sr. No</CTableHeaderCell>
//                                 <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                                 <CTableHeaderCell>Type</CTableHeaderCell>
//                                 <CTableHeaderCell>Color</CTableHeaderCell>
//                                 <CTableHeaderCell>Status</CTableHeaderCell>
//                                 <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                               </CTableRow>
//                             </CTableHead>
//                             <CTableBody>
//                               {vehicles.length > 0 ? (
//                                 vehicles.map((vehicle, index) => (
//                                   <CTableRow key={vehicle._id}>
//                                     <CTableDataCell>
//                                       <CFormCheck
//                                         onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
//                                         checked={selectedVehicles.includes(vehicle._id)}
//                                         disabled={isSubmitting}
//                                       />
//                                     </CTableDataCell>
//                                     <CTableDataCell>{vehicleStart + index}</CTableDataCell>
//                                     <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
//                                     <CTableDataCell>{vehicle.modelName}</CTableDataCell>
//                                     <CTableDataCell>
//                                       <span className="badge bg-secondary">{vehicle.type}</span>
//                                     </CTableDataCell>
//                                     <CTableDataCell>{vehicle.color?.name || '-'}</CTableDataCell>
//                                     <CTableDataCell>
//                                       <span className={`badge bg-${vehicle.status === 'in_stock' ? 'success' : 'warning'}`}>
//                                         {vehicle.status?.replace('_', ' ') || vehicle.status}
//                                       </span>
//                                     </CTableDataCell>
//                                     <CTableDataCell>
//                                       {formatDate(vehicle.inwardDate)}
//                                     </CTableDataCell>
//                                   </CTableRow>
//                                 ))
//                               ) : (
//                                 <CTableRow>
//                                   <CTableDataCell colSpan={8} className="text-center text-danger">
//                                     {searchTerm ? `No vehicles match your search criteria "${searchTerm}"` : 'No in-stock vehicles found'}
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               )}
//                             </CTableBody>
//                           </CTable>
//                         </div>

//                         {renderPagination(
//                           vehiclePagination.currentPage,
//                           vehiclePagination.pages,
//                           handleVehiclePageChange,
//                           handleVehicleLimitChange,
//                           vehiclePagination.limit,
//                           vehiclePagination.total,
//                           vehicleStart,
//                           vehicleEnd,
//                           isLoadingVehicles
//                         )}
//                       </>
//                     )}
//                   </div>
//                 )}

//                 {isSourceSelected && vehiclePagination.total === 0 && !isLoadingVehicles && !searchTerm && (
//                   <div className="alert alert-info mt-4">
//                     No in-stock vehicles found at the selected source location.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Transfer Challan Modal */}
//       <CModal visible={showChallanModal} onClose={handleCloseModal} size="xl" scrollable>
//         <CModalHeader closeButton>
//           <CModalTitle>Transfer Challan Preview</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {challanData && <TransferChallan {...challanData} />}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseModal}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockMovement;






// -------------------SGM---------------------




import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../css/form.css';
import './challan.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CFormInput,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CCard,
  CCardBody,
  CSpinner,
  CFormLabel,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilSearch, cilTransfer, cilLocationPin, cilShieldAlt, cilChevronLeft, cilChevronRight, cilZoomOut } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';
import TransferChallan from '../purchase/StockChallan';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 20;

const StockMovement = () => {
  const [formData, setFormData] = useState({
    sourceDatabase: '',
    sourceLocationType: 'branch',
    sourceLocationId: '',
    targetDatabase: '',
    targetLocationType: 'branch',
    targetLocationId: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState({});
  const [databases, setDatabases] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanData, setChallanData] = useState(null);
  
  // Server-side pagination states for vehicles
  const [vehiclePagination, setVehiclePagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Debounce timer for search
  const searchTimer = useRef(null);
  
  // Search input ref to maintain focus
  const searchInputRef = useRef(null);
  
  // OTP related states
  const [otpUsers, setOtpUsers] = useState([]);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [selectedOtpUser, setSelectedOtpUser] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState({
    otp: '',
    otpMethod: 'SMS'
  });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();
  const { permissions = [] } = useAuth();

  // Database display names mapping
  const databaseDisplayNames = {
    'db1': '14588',
    'db2': '14589'
  };

  // Get database display name
  const getDatabaseDisplayName = (dbKey) => {
    return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return '';
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await axiosInstance.get('/crossData/locations');
      if (response.data.status === 'success') {
        setLocations(response.data.data);
      } else {
        showError('Failed to fetch locations');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch vehicles with server-side pagination and search
  const fetchVehicles = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    const { sourceDatabase, sourceLocationType, sourceLocationId } = formData;
    
    if (!sourceDatabase || !sourceLocationType || !sourceLocationId) {
      return;
    }
    
    setIsLoadingVehicles(true);
    try {
      const params = {
        database: sourceDatabase,
        locationType: sourceLocationType,
        locationId: sourceLocationId,
        page,
        limit,
        ...(search && { search: search.trim() })
      };
      
      const response = await axiosInstance.get('/crossData/vehicles', { params });
      
      if (response.data.status === 'success') {
        const vehiclesData = response.data.data.vehicles || [];
        const pagination = response.data.data.pagination || {};
        
        setVehicles(vehiclesData);
        setVehiclePagination({
          currentPage: pagination.page || page,
          limit: pagination.limit || limit,
          total: pagination.total || 0,
          pages: pagination.pages || 0,
          hasNextPage: pagination.hasNextPage || false,
          hasPrevPage: pagination.hasPrevPage || false
        });
        
        // Clear selected vehicles when data changes
        setSelectedVehicles([]);
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

  // Fetch OTP users for location
  const fetchOtpUsersForLocation = async () => {
    try {
      const { sourceLocationType, sourceLocationId } = formData;
      
      const response = await axiosInstance.get('/users');
      const allUsers = response.data.data || [];
      
      let filteredUsers = [];
      
      if (sourceLocationType === 'branch') {
        filteredUsers = allUsers.filter(user => 
          user.branch === sourceLocationId && 
          user.isStockTransferOTP === true
        );
      } else if (sourceLocationType === 'subdealer') {
        filteredUsers = allUsers.filter(user => 
          user.subdealer === sourceLocationId && 
          user.isStockTransferOTP === true
        );
      }
      
      setOtpUsers(filteredUsers);
      
      if (filteredUsers.length === 0) {
        setShowOtpSection(false);
        setOtpVerified(true);
      } else {
        setShowOtpSection(true);
        setOtpVerified(false);
        setSelectedOtpUser('');
        setOtpSent(false);
        setOtpError('');
      }
    } catch (error) {
      console.error('Error fetching OTP users:', error);
      setOtpUsers([]);
      setShowOtpSection(false);
      setOtpVerified(true);
    }
  };

  // Initial fetch locations
  useEffect(() => {
    fetchLocations();
  }, []);

  // Update databases when locations change
  useEffect(() => {
    if (locations && Object.keys(locations).length > 0) {
      const dbKeys = Object.keys(locations).filter(key => locations[key] && (locations[key].branches || locations[key].subdealers));
      setDatabases(dbKeys);
    }
  }, [locations]);

  // Auto-select databases on component mount
  useEffect(() => {
    if (databases.length > 0) {
      // Find "14589" (db2) for source
      const sourceDb = databases.find(db => db === 'db2');
      // Find "14588" (db1) for target
      const targetDb = databases.find(db => db === 'db1');
      
      if (sourceDb) {
        setFormData(prevData => ({
          ...prevData,
          sourceDatabase: sourceDb
        }));
      }
      
      if (targetDb) {
        setFormData(prevData => ({
          ...prevData,
          targetDatabase: targetDb
        }));
      }
    }
  }, [databases]);

  // Trigger fetch when source location changes
  useEffect(() => {
    if (formData.sourceDatabase && formData.sourceLocationType && formData.sourceLocationId) {
      fetchVehicles(1, DEFAULT_LIMIT, searchTerm);
    }
  }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  // Handle search with debounce - exactly like SalesDetailedReport
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      fetchVehicles(1, vehiclePagination.limit, value);
    }, 500);
  }, [fetchVehicles, vehiclePagination.limit]);

  const resetSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    fetchVehicles(1, vehiclePagination.limit, '');
  };

  const getSelectedUserOtpMethod = () => {
    const user = otpUsers.find(u => u._id === selectedOtpUser);
    return user?.otpMethod || 'SMS';
  };

  const getSelectedUserName = () => {
    const user = otpUsers.find(u => u._id === selectedOtpUser);
    return user?.name || '';
  };

  const handleSendOtp = async () => {
    if (!selectedOtpUser) {
      showError('Please select a user to send OTP');
      return;
    }

    setIsSendingOtp(true);
    setOtpError('');
    
    try {
      const response = await axiosInstance.post('/crossData/request-otp', {
        userId: selectedOtpUser,
        otpMethod: getSelectedUserOtpMethod()
      });

      if (response.data.status === 'success') {
        showSuccess('OTP sent successfully!');
        setOtpSent(true);
        setOtpVerified(false);
        setOtpData({ ...otpData, otp: '', otpMethod: getSelectedUserOtpMethod() });
      } else {
        showError(response.data.message || 'Failed to send OTP');
        setOtpError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          showError(error.response.data.message);
          setOtpError(error.response.data.message);
        } else if (error.response.data.error) {
          showError(error.response.data.error);
          setOtpError(error.response.data.error);
        } else {
          showError('Failed to send OTP. Please try again.');
          setOtpError('Failed to send OTP. Please try again.');
        }
      } else if (error.message) {
        showError(error.message);
        setOtpError(error.message);
      } else {
        showError('Failed to send OTP. Please try again.');
        setOtpError('Failed to send OTP. Please try again.');
      }
      setOtpSent(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpData.otp || otpData.otp.length < 6) {
      showError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');
    
    try {
      const response = await axiosInstance.post('/crossData/verify-otp', {
        userId: selectedOtpUser,
        otp: otpData.otp,
        otpMethod: getSelectedUserOtpMethod()
      });

      if (response.data.status === 'success') {
        showSuccess('OTP verified successfully!');
        setOtpVerified(true);
        setOtpError('');
      } else {
        showError(response.data.message || 'OTP verification failed');
        setOtpError(response.data.message || 'OTP verification failed');
        setOtpData({ ...otpData, otp: '' });
      }
    } catch (error) {
      setOtpData({ ...otpData, otp: '' });
      setOtpVerified(false);
      
      if (error.response && error.response.data) {
        if (error.response.data.error === "Invalid OTP or expired") {
          showError('Invalid OTP or expired. Please try again.');
          setOtpError('Invalid OTP or expired. Please try again.');
        } else if (error.response.data.message) {
          showError(error.response.data.message);
          setOtpError(error.response.data.message);
        } else if (error.response.data.error) {
          showError(error.response.data.error);
          setOtpError(error.response.data.error);
        } else {
          showError('OTP verification failed. Please try again.');
          setOtpError('OTP verification failed. Please try again.');
        }
      } else if (error.message) {
        showError(error.message);
        setOtpError(error.message);
      } else {
        showError('OTP verification failed. Please try again.');
        setOtpError('OTP verification failed. Please try again.');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'sourceDatabase') {
      setFormData(prevData => ({
        ...prevData,
        sourceLocationId: '',
        targetDatabase: '',
        targetLocationId: ''
      }));
      setVehicles([]);
      setSelectedVehicles([]);
      setSearchTerm('');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
      setVehiclePagination(prev => ({
        ...prev,
        currentPage: 1,
        total: 0,
        pages: 0
      }));
      setOtpUsers([]);
      setShowOtpSection(false);
      setSelectedOtpUser('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpError('');
      setOtpData({ otp: '', otpMethod: 'SMS' });
    }

    if (name === 'sourceLocationType') {
      setFormData(prevData => ({
        ...prevData,
        sourceLocationId: ''
      }));
      setVehicles([]);
      setSelectedVehicles([]);
      setSearchTerm('');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
      setVehiclePagination(prev => ({
        ...prev,
        currentPage: 1,
        total: 0,
        pages: 0
      }));
      setOtpUsers([]);
      setShowOtpSection(false);
      setSelectedOtpUser('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpError('');
      setOtpData({ otp: '', otpMethod: 'SMS' });
    }

    if (name === 'sourceLocationId') {
      if (value) {
        fetchOtpUsersForLocation();
      }
    }

    if (name === 'targetDatabase') {
      setFormData(prevData => ({
        ...prevData,
        targetLocationId: ''
      }));
    }

    if (name === 'targetLocationType') {
      setFormData(prevData => ({
        ...prevData,
        targetLocationId: ''
      }));
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleVehicleSelect = (vehicleId, isSelected) => {
    if (isSelected) {
      setSelectedVehicles(prev => [...prev, vehicleId]);
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVehicleIds = vehicles.map(vehicle => vehicle._id);
      setSelectedVehicles(allVehicleIds);
    } else {
      setSelectedVehicles([]);
    }
  };

  // Handle vehicle pagination
  const handleVehiclePageChange = (newPage) => {
    if (newPage < 1 || newPage > vehiclePagination.pages) return;
    fetchVehicles(newPage, vehiclePagination.limit, searchTerm);
    const vehicleTable = document.querySelector('.vehicle-table');
    if (vehicleTable) {
      vehicleTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleVehicleLimitChange = (newLimit) => {
    fetchVehicles(1, parseInt(newLimit, 10), searchTerm);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sourceDatabase) {
      newErrors.sourceDatabase = 'Source database is required';
    }

    if (!formData.sourceLocationId) {
      newErrors.sourceLocationId = 'Source location is required';
    }

    if (!formData.targetDatabase) {
      newErrors.targetDatabase = 'Target database is required';
    }

    if (!formData.targetLocationId) {
      newErrors.targetLocationId = 'Target location is required';
    }

    if (selectedVehicles.length === 0) {
      newErrors.vehicles = 'Please select at least one vehicle to transfer';
    }

    if (formData.sourceDatabase === formData.targetDatabase && 
        formData.sourceLocationId === formData.targetLocationId &&
        formData.sourceDatabase && formData.targetDatabase) {
      newErrors.targetLocationId = 'Source and target locations cannot be the same';
    }

    if (otpUsers.length > 0 && !otpVerified) {
      newErrors.otp = 'Please complete OTP verification before transferring vehicles';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        sourceDatabase: formData.sourceDatabase,
        targetDatabase: formData.targetDatabase,
        sourceLocationType: formData.sourceLocationType,
        sourceLocationId: formData.sourceLocationId,
        targetLocationType: formData.targetLocationType,
        targetLocationId: formData.targetLocationId,
        vehicleIds: selectedVehicles,
        notes: formData.notes || ''
      };

      if (otpUsers.length > 0 && otpVerified && selectedOtpUser) {
        payload.otpData = {
          userId: selectedOtpUser,
          otp: otpData.otp,
          otpMethod: getSelectedUserOtpMethod()
        };
      }

      const response = await axiosInstance.post('/crossData/transfer-requests', payload);

      if (response.data.status === 'success') {
        showSuccess('Vehicles transferred successfully!');
        
        const sourceLocationData = getSourceLocationDetails();
        const targetLocationData = getTargetLocationDetails();
        const transferredVehicles = getTransferredVehiclesDetails();
        
        setChallanData({
          transferDetails: response.data,
          fromType: formData.sourceLocationType,
          fromBranch: formData.sourceLocationType === 'branch' ? sourceLocationData : null,
          fromSubdealer: formData.sourceLocationType === 'subdealer' ? sourceLocationData : null,
          toType: formData.targetLocationType,
          toBranch: formData.targetLocationType === 'branch' ? targetLocationData : null,
          toSubdealer: formData.targetLocationType === 'subdealer' ? targetLocationData : null,
          vehicles: transferredVehicles,
          destinationName: targetLocationData?.name || '',
        });
        
        setShowChallanModal(true);
        
        setFormData({
          sourceDatabase: formData.sourceDatabase,
          sourceLocationType: 'branch',
          sourceLocationId: '',
          targetDatabase: formData.targetDatabase,
          targetLocationType: 'branch',
          targetLocationId: '',
          notes: ''
        });
        setSelectedVehicles([]);
        setVehicles([]);
        setSearchTerm('');
        if (searchInputRef.current) {
          searchInputRef.current.value = '';
        }
        setVehiclePagination({
          currentPage: 1,
          limit: DEFAULT_LIMIT,
          total: 0,
          pages: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
        
        setOtpUsers([]);
        setShowOtpSection(false);
        setSelectedOtpUser('');
        setOtpSent(false);
        setOtpVerified(false);
        setOtpError('');
        setOtpData({ otp: '', otpMethod: 'SMS' });
      } else {
        showError(response.data.message || 'Failed to transfer vehicles');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSourceLocationDetails = () => {
    if (!formData.sourceDatabase || !formData.sourceLocationId) return null;
    const locationsData = locations[formData.sourceDatabase];
    if (!locationsData) return null;
    
    const branches = locationsData.branches || [];
    const subdealers = locationsData.subdealers || [];
    
    const branch = branches.find(b => b._id === formData.sourceLocationId || b.id === formData.sourceLocationId);
    if (branch) return branch;
    
    const subdealer = subdealers.find(s => s._id === formData.sourceLocationId || s.id === formData.sourceLocationId);
    return subdealer || null;
  };

  const getTargetLocationDetails = () => {
    if (!formData.targetDatabase || !formData.targetLocationId) return null;
    const locationsData = locations[formData.targetDatabase];
    if (!locationsData) return null;
    
    const branches = locationsData.branches || [];
    const subdealers = locationsData.subdealers || [];
    
    const branch = branches.find(b => b._id === formData.targetLocationId || b.id === formData.targetLocationId);
    if (branch) return branch;
    
    const subdealer = subdealers.find(s => s._id === formData.targetLocationId || s.id === formData.targetLocationId);
    return subdealer || null;
  };

  const getTransferredVehiclesDetails = () => {
    return vehicles.filter(v => selectedVehicles.includes(v._id));
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleCloseModal = () => {
    setShowChallanModal(false);
    setChallanData(null);
  };

  const getLocationOptions = (databaseKey, locationType) => {
    if (!databaseKey || !locations[databaseKey]) return [];
    const locationsData = locations[databaseKey][locationType === 'branch' ? 'branches' : 'subdealers'] || [];
    return locationsData;
  };

  const isSourceSelected = formData.sourceDatabase && formData.sourceLocationId;
  const isTargetSelected = formData.targetDatabase && formData.targetLocationId;

  // Pagination calculations for display
  const vehicleStart = vehiclePagination.total === 0 ? 0 : (vehiclePagination.currentPage - 1) * vehiclePagination.limit + 1;
  const vehicleEnd = Math.min(vehiclePagination.currentPage * vehiclePagination.limit, vehiclePagination.total);

  // Render pagination component - exactly like SalesDetailedReport
  const renderPagination = (currentPage, totalPages, onPageChange, onLimitChange, currentLimit, total, start, end, isLoading = false) => {
    if (total === 0) return null;
    
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
              value={currentLimit}
              onChange={(e) => onLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={isLoading}
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {isLoading ? 'Loading…' : `Showing ${start}–${end} of ${total} vehicles`}
          </span>
        </div>
        
        {totalPages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || isLoading}
            >
              «
            </CPaginationItem>
            <CPaginationItem
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => onPageChange(1)} disabled={isLoading}>
                  1
                </CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            
            {pageNumbers.map(page => (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
              >
                {page}
              </CPaginationItem>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => onPageChange(totalPages)} disabled={isLoading}>
                  {totalPages}
                </CPaginationItem>
              </>
            )}
            
            <CPaginationItem
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className='title'>INTER DEALER TRANSFER</div>

      <CCard className='table-container mt-4'>
        <CCardBody>
          <div className="form-container">
            {error && <CAlert color="danger">{error}</CAlert>}
            <div className="form-card">
              <div className="form-body">
                <form onSubmit={handleSubmit}>
                  <div className="user-details">
                    {/* Source Database */}
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Source Database</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilLocationPin} />
                        </CInputGroupText>
                        <CFormSelect
                          name="sourceDatabase"
                          value={formData.sourceDatabase}
                          onChange={handleChange}
                          invalid={!!errors.sourceDatabase}
                          disabled={true}
                        >
                          <option value="">-Select Source Database-</option>
                          {databases.map((db) => (
                            <option key={db} value={db}>
                              {getDatabaseDisplayName(db)}
                            </option>
                          ))}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.sourceDatabase && <div className="invalid-feedback">{errors.sourceDatabase}</div>}
                    </div>

                    {/* Source Location Type */}
                    {formData.sourceDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Source Location Type</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormSelect
                            name="sourceLocationType"
                            value={formData.sourceLocationType}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="branch">Branch</option>
                            <option value="subdealer">Subdealer</option>
                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    )}

                    {/* Source Location */}
                    {formData.sourceDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Source Location</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilLocationPin} />
                          </CInputGroupText>
                          <CFormSelect
                            name="sourceLocationId"
                            value={formData.sourceLocationId}
                            onChange={handleChange}
                            invalid={!!errors.sourceLocationId}
                            disabled={isSubmitting}
                          >
                            <option value="">-Select Source Location-</option>
                            {getLocationOptions(formData.sourceDatabase, formData.sourceLocationType).map((location) => (
                              <option key={location._id || location.id} value={location._id || location.id}>
                                {location.name} {location.city ? `(${location.city})` : ''}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.sourceLocationId && <div className="invalid-feedback">{errors.sourceLocationId}</div>}
                      </div>
                    )}

                    {/* OTP User Selection Field */}
                    {showOtpSection && otpUsers.length > 0 && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">OTP User</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilShieldAlt} />
                          </CInputGroupText>
                          <CFormSelect 
                            value={selectedOtpUser}
                            onChange={(e) => {
                              setSelectedOtpUser(e.target.value);
                              setOtpSent(false);
                              setOtpVerified(false);
                              setOtpError('');
                              setOtpData({ otp: '', otpMethod: getSelectedUserOtpMethod() });
                            }}
                            disabled={otpSent || isSubmitting}
                            invalid={!selectedOtpUser && otpUsers.length > 0}
                          >
                            <option value="">-Select User-</option>
                            {otpUsers.map((user) => (
                              <option key={user._id} value={user._id}>
                                {user.name} ({user.otpMethod})
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        <div className="mt-2">
                          <CButton 
                            color="primary" 
                            size="sm"
                            onClick={handleSendOtp}
                            disabled={!selectedOtpUser || isSendingOtp || otpSent}
                          >
                            {isSendingOtp ? 'Sending...' : 'Send OTP'}
                          </CButton>
                        </div>
                        {otpError && !otpSent && (
                          <small className="text-danger d-block mt-1">{otpError}</small>
                        )}
                      </div>
                    )}

                    {/* Target Database */}
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Target Database</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilLocationPin} />
                        </CInputGroupText>
                        <CFormSelect
                          name="targetDatabase"
                          value={formData.targetDatabase}
                          onChange={handleChange}
                          invalid={!!errors.targetDatabase}
                          disabled={true}
                        >
                          <option value="">-Select Target Database-</option>
                          {databases
                            .filter(db => db !== formData.sourceDatabase)
                            .map((db) => (
                              <option key={db} value={db}>
                                {getDatabaseDisplayName(db)}
                              </option>
                            ))}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.targetDatabase && <div className="invalid-feedback">{errors.targetDatabase}</div>}
                    </div>

                    {/* Target Location Type */}
                    {formData.targetDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Target Location Type</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormSelect
                            name="targetLocationType"
                            value={formData.targetLocationType}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="branch">Branch</option>
                            <option value="subdealer">Subdealer</option>
                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    )}

                    {/* Target Location */}
                    {formData.targetDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Target Location</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilLocationPin} />
                          </CInputGroupText>
                          <CFormSelect
                            name="targetLocationId"
                            value={formData.targetLocationId}
                            onChange={handleChange}
                            invalid={!!errors.targetLocationId}
                            disabled={isSubmitting}
                          >
                            <option value="">-Select Target Location-</option>
                            {getLocationOptions(formData.targetDatabase, formData.targetLocationType).map((location) => (
                              <option key={location._id || location.id} value={location._id || location.id}>
                                {location.name} {location.city ? `(${location.city})` : ''}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.targetLocationId && <div className="invalid-feedback">{errors.targetLocationId}</div>}
                      </div>
                    )}

                    {/* OTP Input Field */}
                    {otpSent && !otpVerified && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Enter OTP</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilShieldAlt} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            maxLength="6"
                            placeholder="6-digit OTP"
                            value={otpData.otp}
                            onChange={(e) => {
                              setOtpData({ ...otpData, otp: e.target.value });
                              setOtpError('');
                            }}
                            disabled={isVerifyingOtp}
                            invalid={!!otpError}
                          />
                          <CButton 
                            color="success" 
                            onClick={handleVerifyOtp}
                            disabled={!otpData.otp || otpData.otp.length < 6 || isVerifyingOtp}
                          >
                            {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                          </CButton>
                        </CInputGroup>
                        {otpError && (
                          <small className="text-danger d-block mt-1">{otpError}</small>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className="text-muted">
                            OTP sent to {getSelectedUserName()} via {getSelectedUserOtpMethod()}
                          </small>
                          <CButton 
                            color="link" 
                            size="sm" 
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="p-0"
                          >
                            Resend OTP
                          </CButton>
                        </div>
                      </div>
                    )}

                    {/* OTP Verified Status */}
                    {otpVerified && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">OTP Status</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon bg-success text-white">
                            <CIcon icon={cilShieldAlt} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            value="✓ OTP Verified"
                            readOnly
                            className="bg-success bg-opacity-25 text-success border-success"
                          />
                        </CInputGroup>
                        <small className="text-success d-block mt-1">
                          You can now proceed with stock transfer
                        </small>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="input-box full-width">
                      <div className="details-container">
                        <span className="details">Notes (Optional)</span>
                      </div>
                      <CFormInput
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any notes about this transfer"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Vehicles selection error message */}
                  {errors.vehicles && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger mt-2">{errors.vehicles}</div>
                      </div>
                    </div>
                  )}

                  {/* OTP error message */}
                  {errors.otp && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-warning mt-2">{errors.otp}</div>
                      </div>
                    </div>
                  )}

                  <div className="form-footer">
                    <button 
                      type="submit" 
                      className="submit-button" 
                      disabled={isSubmitting || !isSourceSelected || !isTargetSelected || (otpUsers.length > 0 && !otpVerified)}
                      title={otpUsers.length > 0 && !otpVerified ? "Please complete OTP verification first" : ""}
                    >
                      {isSubmitting ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Transferring...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilTransfer} className="me-2" />
                          Transfer Vehicles
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button" 
                      onClick={handleCancel} 
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Vehicles Table */}
                {isSourceSelected && (
                  <div className="vehicle-table mt-4 p-3">
                    <h5>In-Stock Vehicle Details ({vehiclePagination.total} vehicles available)</h5>

                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        {searchTerm && (
                          <CButton size="sm" variant="outline" onClick={resetSearch}>
                            <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
                          </CButton>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <CFormLabel className="mb-0">Search:</CFormLabel>
                        <input
                          ref={searchInputRef}
                          type="text"
                          style={{ 
                            width: '250px', 
                            height: '32px', 
                            borderRadius: '4px', 
                            border: '1px solid #ced4da', 
                            padding: '0 8px', 
                            outline: 'none', 
                            fontSize: '14px' 
                          }}
                          className="d-inline-block"
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search by chassis, model, type..."
                          autoComplete="off"
                        />
                        {isLoadingVehicles && <CSpinner size="sm" color="primary" />}
                      </div>
                    </div>

                    <div className="text-end mb-2">
                      <span className="badge bg-info me-3">
                        Selected: {selectedVehicles.length} vehicles
                      </span>
                      {vehicles.length > 0 && (
                        <CFormCheck
                          label={`Select All (${vehicles.length})`}
                          onChange={handleSelectAll}
                          checked={selectedVehicles.length === vehicles.length && vehicles.length > 0}
                          indeterminate={selectedVehicles.length > 0 && selectedVehicles.length < vehicles.length}
                          className="d-inline-block"
                        />
                      )}
                    </div>

                    {isLoadingVehicles && vehicles.length === 0 ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                        <CSpinner color="primary" />
                      </div>
                    ) : (
                      <>
                        <div className="responsive-table-wrapper">
                          <CTable striped bordered hover responsive>
                            <CTableHead className="table-header-fixed">
                              <CTableRow>
                                <CTableHeaderCell style={{ width: '50px' }}>Select</CTableHeaderCell>
                                <CTableHeaderCell style={{ width: '60px' }}>Sr. No</CTableHeaderCell>
                                <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                                <CTableHeaderCell>Model Name</CTableHeaderCell>
                                <CTableHeaderCell>Type</CTableHeaderCell>
                                <CTableHeaderCell>Color</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Inward Date</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {vehicles.length > 0 ? (
                                vehicles.map((vehicle, index) => (
                                  <CTableRow key={vehicle._id}>
                                    <CTableDataCell>
                                      <CFormCheck
                                        onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
                                        checked={selectedVehicles.includes(vehicle._id)}
                                        disabled={isSubmitting}
                                      />
                                    </CTableDataCell>
                                    <CTableDataCell>{vehicleStart + index}</CTableDataCell>
                                    <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
                                    <CTableDataCell>{vehicle.modelName}</CTableDataCell>
                                    <CTableDataCell>
                                      <span className="badge bg-secondary">{vehicle.type}</span>
                                    </CTableDataCell>
                                    <CTableDataCell>{vehicle.color?.name || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      <span className={`badge bg-${vehicle.status === 'in_stock' ? 'success' : 'warning'}`}>
                                        {vehicle.status?.replace('_', ' ') || vehicle.status}
                                      </span>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {formatDate(vehicle.inwardDate)}
                                    </CTableDataCell>
                                  </CTableRow>
                                ))
                              ) : (
                                <CTableRow>
                                  <CTableDataCell colSpan={8} className="text-center text-danger">
                                    {searchTerm ? `No vehicles match your search criteria "${searchTerm}"` : 'No in-stock vehicles found'}
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            </CTableBody>
                          </CTable>
                        </div>

                        {renderPagination(
                          vehiclePagination.currentPage,
                          vehiclePagination.pages,
                          handleVehiclePageChange,
                          handleVehicleLimitChange,
                          vehiclePagination.limit,
                          vehiclePagination.total,
                          vehicleStart,
                          vehicleEnd,
                          isLoadingVehicles
                        )}
                      </>
                    )}
                  </div>
                )}

                {isSourceSelected && vehiclePagination.total === 0 && !isLoadingVehicles && !searchTerm && (
                  <div className="alert alert-info mt-4">
                    No in-stock vehicles found at the selected source location.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* Transfer Challan Modal */}
      <CModal visible={showChallanModal} onClose={handleCloseModal} size="xl" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>Transfer Challan Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {challanData && <TransferChallan {...challanData} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockMovement;