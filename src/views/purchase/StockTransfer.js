// import React, { useState, useEffect, useRef } from 'react';
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
//   CForm,
//   CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilUser, cilSearch, cilShieldAlt } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import TransferChallan from './StockChallan';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function StockTransfer() {
//   const [formData, setFormData] = useState({
//     fromBranch: '',
//     toType: 'branch',
//     toBranch: '',
//     toSubdealer: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [challanData, setChallanData] = useState(null);
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
//   const navigate = useNavigate();
  
//   const { permissions = [] } = useAuth();
  
//   // Page-level permission checks for Stock Transfer page under Purchase module
//   const hasStockTransferView = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_TRANSFER, 
//     ACTIONS.VIEW
//   );
  
//   const hasStockTransferCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_TRANSFER, 
//     ACTIONS.CREATE
//   );
  
//   const hasStockTransferDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_TRANSFER, 
//     ACTIONS.DELETE
//   );
  
//   // Using convenience functions
//   const canViewStockTransfer = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
//   const canCreateStockTransfer = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
//   const canDeleteStockTransfer = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewStockTransfer) {
//       showError('You do not have permission to view Stock Transfer');
//       return;
//     }
    
//     fetchBranches();
//   }, []);

//   useEffect(() => {
//     if (!canViewStockTransfer) return;
    
//     const fetchSubdealers = async () => {
//       if (formData.fromBranch) {
//         try {
//           const response = await axiosInstance.get(`/subdealers/branch/${formData.fromBranch}`);
//           setSubdealers(response.data.data?.subdealers || []);
//         } catch (error) {
//           const message = showError(error); 
//           if (message) setError(message);
//         }
//       } else {
//         setSubdealers([]);
//       }
//     };

//     fetchSubdealers();
//   }, [formData.fromBranch]);

//   useEffect(() => {
//     if (!canViewStockTransfer) return;
    
//     if (formData.fromBranch) {
//       fetchOtpUsersForBranch(formData.fromBranch);
//     } else {
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpData({ otp: '', otpMethod: 'SMS' });
//     }
//   }, [formData.fromBranch]);

//   const fetchBranches = async () => {
//     if (!canViewStockTransfer) return;
    
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchOtpUsersForBranch = async (branchId) => {
//     if (!canViewStockTransfer) return;
    
//     try {
//       const response = await axiosInstance.get('/users');
//       const allUsers = response.data.data || [];
      
//       // Filter users who belong to the selected branch AND have isStockTransferOTP = true
//       const filteredUsers = allUsers.filter(user => 
//         user.branch === branchId && 
//         user.isStockTransferOTP === true
//       );
      
//       setOtpUsers(filteredUsers);
      
//       // If there are no OTP users for this branch, don't show OTP section
//       if (filteredUsers.length === 0) {
//         setShowOtpSection(false);
//         setOtpVerified(true); // No OTP required if no users are configured
//       } else {
//         setShowOtpSection(true);
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//       setOtpUsers([]);
//     }
//   };

//   const fetchVehiclesForBranch = async (branchId) => {
//     if (!canViewStockTransfer) return;
    
//     try {
//       const res = await axiosInstance.get(`/vehicles/branch/${branchId}?locationType=branch`);
//       const inStockVehicles = (res.data.data.vehicles || []).filter((vehicle) => vehicle.status === 'in_stock');
//       setVehicles(inStockVehicles);
//       setFilteredVehicles(inStockVehicles);
//       setSelectedVehicles([]);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   useEffect(() => {
//     if (!canViewStockTransfer) return;
    
//     if (searchTerm) {
//       const filtered = vehicles.filter((vehicle) => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//           (vehicle.chassisNumber && vehicle.chassisNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.engineNumber && vehicle.engineNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.motorNumber && vehicle.motorNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.model?.model_name && vehicle.model.model_name.toLowerCase().includes(searchLower)) ||
//           (vehicle.type && vehicle.type.toLowerCase().includes(searchLower)) ||
//           (vehicle.batteryNumber && vehicle.batteryNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.keyNumber && vehicle.keyNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.chargerNumber && vehicle.chargerNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.unloadLocation?.name && vehicle.unloadLocation.name.toLowerCase().includes(searchLower))
//         );
//       });
//       setFilteredVehicles(filtered);
//     } else {
//       setFilteredVehicles(vehicles);
//     }
//   }, [searchTerm, vehicles]);

//   const handleChange = (e) => {
//     if (!canViewStockTransfer) return;
    
//     const { name, value } = e.target;

//     if (name === 'toType') {
//       setFormData(prevData => ({ 
//         ...prevData, 
//         [name]: value,
//         toBranch: '',
//         toSubdealer: ''
//       }));
//     } else if (name === 'fromBranch') {
//       setFormData(prevData => ({ 
//         ...prevData, 
//         [name]: value,
//         toBranch: '',
//         toSubdealer: ''
//       }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     }
    
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'fromBranch' && value) {
//       fetchVehiclesForBranch(value);
//     } else if (name === 'fromBranch') {
//       setVehicles([]);
//       setFilteredVehicles([]);
//       setSelectedVehicles([]);
//       setSubdealers([]);
//     }
//   };

//   const handleVehicleSelect = (vehicleId, isSelected) => {
//     if (!canCreateStockTransfer) {
//       showError('You do not have permission to select vehicles for transfer');
//       return;
//     }
    
//     setSelectedVehicles((prev) => {
//       if (isSelected) {
//         return [...prev, vehicleId];
//       } else {
//         return prev.filter((id) => id !== vehicleId);
//       }
//     });
//   };

//   const handleSendOtp = async () => {
//     if (!selectedOtpUser) {
//       showError('Please select a user to send OTP');
//       return;
//     }

//     setIsSendingOtp(true);
//     try {
//       const response = await axiosInstance.post('/transfers/request-otp', {
//         userId: selectedOtpUser
//       });

//       showSuccess('OTP sent successfully!');
//       setOtpSent(true);
//       setOtpVerified(false);
//       setOtpData({ ...otpData, otpMethod: getSelectedUserOtpMethod() });
//     } catch (error) {
//       showError(error);
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
//     try {
//       const response = await axiosInstance.post('/transfers/verify-otp', {
//         userId: selectedOtpUser,
//         otp: otpData.otp,
//         otpMethod: getSelectedUserOtpMethod()
//       });

//       showSuccess('OTP verified successfully!');
//       setOtpVerified(true);
//     } catch (error) {
//       showError(error);
//       setOtpVerified(false);
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const getSelectedUserOtpMethod = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.otpMethod || 'SMS';
//   };

//   const getSelectedUserName = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.name || '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!canCreateStockTransfer) {
//       showError('You do not have permission to transfer stock');
//       return;
//     }
    
//     // Check OTP requirement
//     if (otpUsers.length > 0 && !otpVerified) {
//       showError('Please complete OTP verification before transferring stock');
//       return;
//     }
    
//     setIsSubmitting(true);
//     const newErrors = {};
    
//     if (!formData.fromBranch) newErrors.fromBranch = 'From branch is required';
//     if (!formData.toType) newErrors.toType = 'Type is required';
    
//     if (formData.toType === 'branch' && !formData.toBranch) {
//       newErrors.toBranch = 'To branch is required';
//     } else if (formData.toType === 'subdealer' && !formData.toSubdealer) {
//       newErrors.toSubdealer = 'Subdealer is required';
//     }
    
//     if (selectedVehicles.length === 0) newErrors.vehicles = 'Please select at least one vehicle';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const payload = {
//         fromBranch: formData.fromBranch,
//         toType: formData.toType,
//         toBranch: formData.toType === 'branch' ? formData.toBranch : undefined,
//         toSubdealer: formData.toType === 'subdealer' ? formData.toSubdealer : undefined,
//         items: selectedVehicles.map((vehicleId) => ({ vehicle: vehicleId }))
//       };

//       // Add OTP data if OTP is required and verified
//       if (otpUsers.length > 0 && otpVerified && selectedOtpUser) {
//         payload.otpData = {
//           userId: selectedOtpUser,
//           otp: otpData.otp,
//           otpMethod: getSelectedUserOtpMethod()
//         };
//       }

//       const response = await axiosInstance.post('/transfers', payload);

//       const fromBranchData = branches.find((b) => b._id === formData.fromBranch);
      
//       let toBranchData = null;
//       let toSubdealerData = null;
//       let destinationName = '';
      
//       if (formData.toType === 'branch') {
//         toBranchData = branches.find((b) => b._id === formData.toBranch);
//         destinationName = toBranchData?.name || '';
//       } else {
//         toSubdealerData = subdealers.find((s) => s._id === formData.toSubdealer);
//         destinationName = toSubdealerData?.name || '';
//       }
      
//       const selectedVehicleData = vehicles.filter((v) => selectedVehicles.includes(v._id));

//       setChallanData({
//         transferDetails: response.data,
//         fromBranch: fromBranchData,
//         toBranch: toBranchData,
//         toSubdealer: toSubdealerData,
//         toType: formData.toType,
//         vehicles: selectedVehicleData,
//         destinationName: destinationName
//       });

//       showSuccess('Stock transferred successfully!').then(() => {
//         setShowChallanModal(true);
//       });

//       // Reset form but keep fromBranch
//       setFormData({ 
//         fromBranch: formData.fromBranch, 
//         toType: 'branch',
//         toBranch: '', 
//         toSubdealer: '' 
//       });
      
//       // Reset OTP state
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpData({ otp: '', otpMethod: 'SMS' });
      
//       fetchVehiclesForBranch(formData.fromBranch);
//       setSelectedVehicles([]);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/upload-challan');
//   };

//   const handleCloseModal = () => {
//     setShowChallanModal(false);
//   };

//   // Check permission before rendering
//   if (!canViewStockTransfer) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Stock Transfer.
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       <div className="title">TRANSFER STOCK TO NETWORK</div>
//       {error && <CAlert color="danger">{error}</CAlert>}
//       <div className="form-card">
//         <div className="form-body">
//           {/* READ-ONLY VIEW FOR USERS WITHOUT CREATE PERMISSION */}
//           {!canCreateStockTransfer ? (
//             <div className="alert alert-warning mb-4">
//               <strong>Note:</strong> You have VIEW permission only. You can view stock transfer information but cannot create new transfers.
//             </div>
//           ) : null}
          
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               {/* First Row: From Branch and Transfer Type */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">From Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="fromBranch" 
//                     value={formData.fromBranch} 
//                     onChange={handleChange} 
//                     invalid={!!errors.fromBranch}
//                     disabled={isSubmitting || !canCreateStockTransfer}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.fromBranch && <div className="invalid-feedback">{errors.fromBranch}</div>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Transfer Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="toType" 
//                     value={formData.toType} 
//                     onChange={handleChange} 
//                     invalid={!!errors.toType}
//                     disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
//                   >
//                     <option value="branch">Branch</option>
//                     <option value="subdealer">Subdealer</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.toType && <div className="invalid-feedback">{errors.toType}</div>}
//               </div>

//               {/* OTP User Selection Field (3rd field in first row when OTP is required) */}
//               {showOtpSection && otpUsers.length > 0 && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">OTP User</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilShieldAlt} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       value={selectedOtpUser}
//                       onChange={(e) => {
//                         setSelectedOtpUser(e.target.value);
//                         setOtpSent(false);
//                         setOtpVerified(false);
//                         setOtpData({ otp: '', otpMethod: getSelectedUserOtpMethod() });
//                       }}
//                       disabled={otpSent || isSubmitting}
//                       invalid={!selectedOtpUser && otpUsers.length > 0}
//                     >
//                       <option value="">-Select User-</option>
//                       {otpUsers.map((user) => (
//                         <option key={user._id} value={user._id}>
//                           {user.name} ({user.otpMethod})
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   <div className="mt-2">
//                     <CButton 
//                       color="primary" 
//                       size="sm"
//                       onClick={handleSendOtp}
//                       disabled={!selectedOtpUser || isSendingOtp || otpSent}
//                     >
//                       {isSendingOtp ? 'Sending...' : 'Send OTP'}
//                     </CButton>
//                   </div>
//                 </div>
//               )}

//               {/* Second Row: To Branch/Subdealer based on type */}
//               {formData.toType === 'branch' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">To Branch</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="toBranch" 
//                       value={formData.toBranch} 
//                       onChange={handleChange} 
//                       invalid={!!errors.toBranch}
//                       disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
//                     >
//                       <option value="">-Select-</option>
//                       {branches
//                         .filter(branch => branch._id !== formData.fromBranch) // Exclude from branch
//                         .map((branch) => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.toBranch && <div className="invalid-feedback">{errors.toBranch}</div>}
//                 </div>
//               )}

//               {formData.toType === 'subdealer' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">To Subdealer</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="toSubdealer" 
//                       value={formData.toSubdealer} 
//                       onChange={handleChange} 
//                       invalid={!!errors.toSubdealer}
//                       disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
//                     >
//                       <option value="">-Select-</option>
//                       {subdealers.map((subdealer) => (
//                         <option key={subdealer._id} value={subdealer._id}>
//                           {subdealer.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.toSubdealer && <div className="invalid-feedback">{errors.toSubdealer}</div>}
//                 </div>
//               )}

//               {/* OTP Input Field (appears after OTP is sent) */}
//               {otpSent && !otpVerified && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Enter OTP</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilShieldAlt} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       maxLength="6"
//                       placeholder="6-digit OTP"
//                       value={otpData.otp}
//                       onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
//                       disabled={isVerifyingOtp}
//                     />
//                     <CButton 
//                       color="success" 
//                       onClick={handleVerifyOtp}
//                       disabled={!otpData.otp || otpData.otp.length < 6 || isVerifyingOtp}
//                     >
//                       {isVerifyingOtp ? 'Verifying...' : 'Verify'}
//                     </CButton>
//                   </CInputGroup>
//                   <small className="text-muted d-block mt-1">
//                     OTP sent to {getSelectedUserName()} via {getSelectedUserOtpMethod()}
//                   </small>
//                 </div>
//               )}

//               {/* OTP Verified Status */}
//               {otpVerified && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">OTP Status</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon bg-success text-white">
//                       <CIcon icon={cilShieldAlt} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       value="✓ OTP Verified"
//                       readOnly
//                       className="bg-success bg-opacity-25 text-success border-success"
//                     />
//                   </CInputGroup>
//                   <small className="text-success d-block mt-1">
//                     You can now proceed with stock transfer
//                   </small>
//                 </div>
//               )}

//               {/* Empty placeholders to maintain grid layout */}
//               {!otpSent && !otpVerified && formData.toType === 'branch' && (
//                 <div className="input-box">
//                   {/* Empty placeholder to maintain 3-column layout */}
//                 </div>
//               )}

//               {!otpSent && !otpVerified && formData.toType === 'subdealer' && (
//                 <div className="input-box">
//                   {/* Empty placeholder to maintain 3-column layout */}
//                 </div>
//               )}

//             </div>

//             {/* Vehicles selection error message */}
//             {errors.vehicles && (
//               <div className="row">
//                 <div className="col-12">
//                   <div className="alert alert-danger mt-2">{errors.vehicles}</div>
//                 </div>
//               </div>
//             )}

//             <div className="form-footer">
//               {canCreateStockTransfer ? (
//                 <>
//                   <button 
//                     type="submit" 
//                     className="submit-button" 
//                     disabled={isSubmitting || (otpUsers.length > 0 && !otpVerified)}
//                     title={otpUsers.length > 0 && !otpVerified ? "Please complete OTP verification first" : ""}
//                   >
//                     {isSubmitting ? 'Transferring...' : 'Transfer'}
//                   </button>
//                   <button 
//                     type="button" 
//                     className="cancel-button" 
//                     onClick={handleCancel} 
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <div className="alert alert-info">
//                   <strong>View Mode:</strong> You have VIEW permission only. To create transfers, contact your administrator.
//                 </div>
//               )}
//             </div>
//           </form>

//           {vehicles.length > 0 && formData.fromBranch ? (
//             <div className="vehicle-table mt-4 p-3">
//               <h5>In-Stock Vehicle Details ({vehicles.length} vehicles available)</h5>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CInputGroup>
//                     <CInputGroupText>
//                       <CIcon icon={cilSearch} style={{ width: '20px' }} />
//                     </CInputGroupText>
//                     <CFormInput
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search by chassis, model, type..."
//                       disabled={!canCreateStockTransfer}
//                     />
//                   </CInputGroup>
//                 </CCol>
//                 <CCol md={6} className="text-end">
//                   <span className="badge bg-info">
//                     Selected: {selectedVehicles.length} vehicles
//                   </span>
//                 </CCol>
//               </CRow>

//               <CTable striped bordered hover responsive>
//                 <CTableHead className="table-header-fixed">
//                   <CTableRow>
//                     {canCreateStockTransfer && (
//                       <CTableHeaderCell>
//                         Select
//                       </CTableHeaderCell>
//                     )}
//                     <CTableHeaderCell>Sr. No</CTableHeaderCell>
//                     <CTableHeaderCell>Unload Location</CTableHeaderCell>
//                     <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                     <CTableHeaderCell>Type</CTableHeaderCell>
//                     <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
//                     <CTableHeaderCell>Color</CTableHeaderCell>
//                     <CTableHeaderCell>Chassis No</CTableHeaderCell>
//                     <CTableHeaderCell>Current Status</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {filteredVehicles.length > 0 ? (
//                     filteredVehicles.map((vehicle, index) => (
//                       <CTableRow key={vehicle._id}>
//                         {canCreateStockTransfer && (
//                           <CTableDataCell>
//                             <CFormCheck
//                               onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
//                               checked={selectedVehicles.includes(vehicle._id)}
//                               disabled={isSubmitting || (otpUsers.length > 0 && !otpVerified)}
//                             />
//                           </CTableDataCell>
//                         )}
//                         <CTableDataCell>{index + 1}</CTableDataCell>
//                         <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                         <CTableDataCell>{new Date(vehicle.createdAt).toLocaleDateString()}</CTableDataCell>
//                         <CTableDataCell>{vehicle.type}</CTableDataCell>
//                         <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                         <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                         <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                         <CTableDataCell>{vehicle.status}</CTableDataCell>
//                       </CTableRow>
//                     ))
//                   ) : (
//                     <CTableRow>
//                       <CTableDataCell colSpan={canCreateStockTransfer ? 9 : 8} className="text-center">
//                         {searchTerm ? 'No vehicles match your search criteria' : 'No in-stock vehicles found'}
//                       </CTableDataCell>
//                     </CTableRow>
//                   )}
//                 </CTableBody>
//               </CTable>
//             </div>
//           ) : formData.fromBranch ? (
//             <div className="alert alert-info mt-4">No in-stock vehicles found for the selected branch.</div>
//           ) : null}
//         </div>
//       </div>

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
// }

// export default StockTransfer;











// import React, { useState, useEffect, useRef } from 'react';
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
//   CForm,
//   CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilUser, cilSearch, cilShieldAlt } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import TransferChallan from './StockChallan';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function StockTransfer() {
//   const [formData, setFormData] = useState({
//     fromBranch: '',
//     toType: 'branch',
//     toBranch: '',
//     toSubdealer: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [challanData, setChallanData] = useState(null);
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
//   const navigate = useNavigate();
  
//   const { permissions = [] } = useAuth();
  
//   // Page-level permission checks for Stock Transfer page under Purchase module
//   const hasStockTransferView = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_TRANSFER, 
//     ACTIONS.VIEW
//   );
  
//   const hasStockTransferCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_TRANSFER, 
//     ACTIONS.CREATE
//   );
  
//   const hasStockTransferDelete = hasSafePagePermission(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.STOCK_TRANSFER, 
//     ACTIONS.DELETE
//   );
  
//   // Using convenience functions
//   const canViewStockTransfer = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
//   const canCreateStockTransfer = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
//   const canDeleteStockTransfer = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);

//   // Format date to DD-MM-YYYY
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

//   useEffect(() => {
//     // Check permission before loading data
//     if (!canViewStockTransfer) {
//       showError('You do not have permission to view Stock Transfer');
//       return;
//     }
    
//     fetchBranches();
//   }, []);

//   useEffect(() => {
//     if (!canViewStockTransfer) return;
    
//     const fetchSubdealers = async () => {
//       if (formData.fromBranch) {
//         try {
//           const response = await axiosInstance.get(`/subdealers/branch/${formData.fromBranch}`);
//           setSubdealers(response.data.data?.subdealers || []);
//         } catch (error) {
//           const message = showError(error); 
//           if (message) setError(message);
//         }
//       } else {
//         setSubdealers([]);
//       }
//     };

//     fetchSubdealers();
//   }, [formData.fromBranch]);

//   useEffect(() => {
//     if (!canViewStockTransfer) return;
    
//     if (formData.fromBranch) {
//       fetchOtpUsersForBranch(formData.fromBranch);
//     } else {
//       setOtpUsers([]);
//       setShowOtpSection(false);
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpData({ otp: '', otpMethod: 'SMS' });
//     }
//   }, [formData.fromBranch]);

//   const fetchBranches = async () => {
//     if (!canViewStockTransfer) return;
    
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchOtpUsersForBranch = async (branchId) => {
//     if (!canViewStockTransfer) return;
    
//     try {
//       const response = await axiosInstance.get('/users');
//       const allUsers = response.data.data || [];
      
//       // Filter users who belong to the selected branch AND have isStockTransferOTP = true
//       const filteredUsers = allUsers.filter(user => 
//         user.branch === branchId && 
//         user.isStockTransferOTP === true
//       );
      
//       setOtpUsers(filteredUsers);
      
//       // If there are no OTP users for this branch, don't show OTP section
//       if (filteredUsers.length === 0) {
//         setShowOtpSection(false);
//         setOtpVerified(true); // No OTP required if no users are configured
//       } else {
//         setShowOtpSection(true);
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//       setOtpUsers([]);
//     }
//   };

//   const fetchVehiclesForBranch = async (branchId) => {
//     if (!canViewStockTransfer) return;
    
//     try {
//       const res = await axiosInstance.get(`/vehicles/branch/${branchId}?locationType=branch`);
//       const inStockVehicles = (res.data.data.vehicles || []).filter((vehicle) => vehicle.status === 'in_stock');
//       setVehicles(inStockVehicles);
//       setFilteredVehicles(inStockVehicles);
//       setSelectedVehicles([]);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   useEffect(() => {
//     if (!canViewStockTransfer) return;
    
//     if (searchTerm) {
//       const filtered = vehicles.filter((vehicle) => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//           (vehicle.chassisNumber && vehicle.chassisNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.engineNumber && vehicle.engineNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.motorNumber && vehicle.motorNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.model?.model_name && vehicle.model.model_name.toLowerCase().includes(searchLower)) ||
//           (vehicle.type && vehicle.type.toLowerCase().includes(searchLower)) ||
//           (vehicle.batteryNumber && vehicle.batteryNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.keyNumber && vehicle.keyNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.chargerNumber && vehicle.chargerNumber.toLowerCase().includes(searchLower)) ||
//           (vehicle.unloadLocation?.name && vehicle.unloadLocation.name.toLowerCase().includes(searchLower))
//         );
//       });
//       setFilteredVehicles(filtered);
//     } else {
//       setFilteredVehicles(vehicles);
//     }
//   }, [searchTerm, vehicles]);

//   const handleChange = (e) => {
//     if (!canViewStockTransfer) return;
    
//     const { name, value } = e.target;

//     if (name === 'toType') {
//       setFormData(prevData => ({ 
//         ...prevData, 
//         [name]: value,
//         toBranch: '',
//         toSubdealer: ''
//       }));
//     } else if (name === 'fromBranch') {
//       setFormData(prevData => ({ 
//         ...prevData, 
//         [name]: value,
//         toBranch: '',
//         toSubdealer: ''
//       }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     }
    
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'fromBranch' && value) {
//       fetchVehiclesForBranch(value);
//     } else if (name === 'fromBranch') {
//       setVehicles([]);
//       setFilteredVehicles([]);
//       setSelectedVehicles([]);
//       setSubdealers([]);
//     }
//   };

//   const handleVehicleSelect = (vehicleId, isSelected) => {
//     if (!canCreateStockTransfer) {
//       showError('You do not have permission to select vehicles for transfer');
//       return;
//     }
    
//     setSelectedVehicles((prev) => {
//       if (isSelected) {
//         return [...prev, vehicleId];
//       } else {
//         return prev.filter((id) => id !== vehicleId);
//       }
//     });
//   };

//   const handleSendOtp = async () => {
//     if (!selectedOtpUser) {
//       showError('Please select a user to send OTP');
//       return;
//     }

//     setIsSendingOtp(true);
//     try {
//       const response = await axiosInstance.post('/transfers/request-otp', {
//         userId: selectedOtpUser
//       });

//       showSuccess('OTP sent successfully!');
//       setOtpSent(true);
//       setOtpVerified(false);
//       setOtpData({ ...otpData, otpMethod: getSelectedUserOtpMethod() });
//     } catch (error) {
//       showError(error);
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
//     try {
//       const response = await axiosInstance.post('/transfers/verify-otp', {
//         userId: selectedOtpUser,
//         otp: otpData.otp,
//         otpMethod: getSelectedUserOtpMethod()
//       });

//       showSuccess('OTP verified successfully!');
//       setOtpVerified(true);
//     } catch (error) {
//       showError(error);
//       setOtpVerified(false);
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const getSelectedUserOtpMethod = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.otpMethod || 'SMS';
//   };

//   const getSelectedUserName = () => {
//     const user = otpUsers.find(u => u._id === selectedOtpUser);
//     return user?.name || '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!canCreateStockTransfer) {
//       showError('You do not have permission to transfer stock');
//       return;
//     }
    
//     // Check OTP requirement
//     if (otpUsers.length > 0 && !otpVerified) {
//       showError('Please complete OTP verification before transferring stock');
//       return;
//     }
    
//     setIsSubmitting(true);
//     const newErrors = {};
    
//     if (!formData.fromBranch) newErrors.fromBranch = 'From branch is required';
//     if (!formData.toType) newErrors.toType = 'Type is required';
    
//     if (formData.toType === 'branch' && !formData.toBranch) {
//       newErrors.toBranch = 'To branch is required';
//     } else if (formData.toType === 'subdealer' && !formData.toSubdealer) {
//       newErrors.toSubdealer = 'Subdealer is required';
//     }
    
//     if (selectedVehicles.length === 0) newErrors.vehicles = 'Please select at least one vehicle';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const payload = {
//         fromBranch: formData.fromBranch,
//         toType: formData.toType,
//         toBranch: formData.toType === 'branch' ? formData.toBranch : undefined,
//         toSubdealer: formData.toType === 'subdealer' ? formData.toSubdealer : undefined,
//         items: selectedVehicles.map((vehicleId) => ({ vehicle: vehicleId }))
//       };

//       // Add OTP data if OTP is required and verified
//       if (otpUsers.length > 0 && otpVerified && selectedOtpUser) {
//         payload.otpData = {
//           userId: selectedOtpUser,
//           otp: otpData.otp,
//           otpMethod: getSelectedUserOtpMethod()
//         };
//       }

//       const response = await axiosInstance.post('/transfers', payload);

//       const fromBranchData = branches.find((b) => b._id === formData.fromBranch);
      
//       let toBranchData = null;
//       let toSubdealerData = null;
//       let destinationName = '';
      
//       if (formData.toType === 'branch') {
//         toBranchData = branches.find((b) => b._id === formData.toBranch);
//         destinationName = toBranchData?.name || '';
//       } else {
//         toSubdealerData = subdealers.find((s) => s._id === formData.toSubdealer);
//         destinationName = toSubdealerData?.name || '';
//       }
      
//       const selectedVehicleData = vehicles.filter((v) => selectedVehicles.includes(v._id));

//       setChallanData({
//         transferDetails: response.data,
//         fromBranch: fromBranchData,
//         toBranch: toBranchData,
//         toSubdealer: toSubdealerData,
//         toType: formData.toType,
//         vehicles: selectedVehicleData,
//         destinationName: destinationName
//       });

//       showSuccess('Stock transferred successfully!').then(() => {
//         setShowChallanModal(true);
//       });

//       // Reset form but keep fromBranch
//       setFormData({ 
//         fromBranch: formData.fromBranch, 
//         toType: 'branch',
//         toBranch: '', 
//         toSubdealer: '' 
//       });
      
//       // Reset OTP state
//       setSelectedOtpUser('');
//       setOtpSent(false);
//       setOtpVerified(false);
//       setOtpData({ otp: '', otpMethod: 'SMS' });
      
//       fetchVehiclesForBranch(formData.fromBranch);
//       setSelectedVehicles([]);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/upload-challan');
//   };

//   const handleCloseModal = () => {
//     setShowChallanModal(false);
//   };

//   // Check permission before rendering
//   if (!canViewStockTransfer) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Stock Transfer.
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       <div className="title">TRANSFER STOCK TO NETWORK</div>
//       {error && <CAlert color="danger">{error}</CAlert>}
//       <div className="form-card">
//         <div className="form-body">
//           {/* READ-ONLY VIEW FOR USERS WITHOUT CREATE PERMISSION */}
//           {!canCreateStockTransfer ? (
//             <div className="alert alert-warning mb-4">
//               <strong>Note:</strong> You have VIEW permission only. You can view stock transfer information but cannot create new transfers.
//             </div>
//           ) : null}
          
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               {/* First Row: From Branch and Transfer Type */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">From Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="fromBranch" 
//                     value={formData.fromBranch} 
//                     onChange={handleChange} 
//                     invalid={!!errors.fromBranch}
//                     disabled={isSubmitting || !canCreateStockTransfer}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.fromBranch && <div className="invalid-feedback">{errors.fromBranch}</div>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Transfer Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="toType" 
//                     value={formData.toType} 
//                     onChange={handleChange} 
//                     invalid={!!errors.toType}
//                     disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
//                   >
//                     <option value="branch">Branch</option>
//                     <option value="subdealer">Subdealer</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.toType && <div className="invalid-feedback">{errors.toType}</div>}
//               </div>

//               {/* OTP User Selection Field (3rd field in first row when OTP is required) */}
//               {showOtpSection && otpUsers.length > 0 && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">OTP User</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilShieldAlt} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       value={selectedOtpUser}
//                       onChange={(e) => {
//                         setSelectedOtpUser(e.target.value);
//                         setOtpSent(false);
//                         setOtpVerified(false);
//                         setOtpData({ otp: '', otpMethod: getSelectedUserOtpMethod() });
//                       }}
//                       disabled={otpSent || isSubmitting}
//                       invalid={!selectedOtpUser && otpUsers.length > 0}
//                     >
//                       <option value="">-Select User-</option>
//                       {otpUsers.map((user) => (
//                         <option key={user._id} value={user._id}>
//                           {user.name} ({user.otpMethod})
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   <div className="mt-2">
//                     <CButton 
//                       color="primary" 
//                       size="sm"
//                       onClick={handleSendOtp}
//                       disabled={!selectedOtpUser || isSendingOtp || otpSent}
//                     >
//                       {isSendingOtp ? 'Sending...' : 'Send OTP'}
//                     </CButton>
//                   </div>
//                 </div>
//               )}

//               {/* Second Row: To Branch/Subdealer based on type */}
//               {formData.toType === 'branch' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">To Branch</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="toBranch" 
//                       value={formData.toBranch} 
//                       onChange={handleChange} 
//                       invalid={!!errors.toBranch}
//                       disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
//                     >
//                       <option value="">-Select-</option>
//                       {branches
//                         .filter(branch => branch._id !== formData.fromBranch) // Exclude from branch
//                         .map((branch) => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.toBranch && <div className="invalid-feedback">{errors.toBranch}</div>}
//                 </div>
//               )}

//               {formData.toType === 'subdealer' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">To Subdealer</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="toSubdealer" 
//                       value={formData.toSubdealer} 
//                       onChange={handleChange} 
//                       invalid={!!errors.toSubdealer}
//                       disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
//                     >
//                       <option value="">-Select-</option>
//                       {subdealers.map((subdealer) => (
//                         <option key={subdealer._id} value={subdealer._id}>
//                           {subdealer.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.toSubdealer && <div className="invalid-feedback">{errors.toSubdealer}</div>}
//                 </div>
//               )}

//               {/* OTP Input Field (appears after OTP is sent) */}
//               {otpSent && !otpVerified && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Enter OTP</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilShieldAlt} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       maxLength="6"
//                       placeholder="6-digit OTP"
//                       value={otpData.otp}
//                       onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
//                       disabled={isVerifyingOtp}
//                     />
//                     <CButton 
//                       color="success" 
//                       onClick={handleVerifyOtp}
//                       disabled={!otpData.otp || otpData.otp.length < 6 || isVerifyingOtp}
//                     >
//                       {isVerifyingOtp ? 'Verifying...' : 'Verify'}
//                     </CButton>
//                   </CInputGroup>
//                   <small className="text-muted d-block mt-1">
//                     OTP sent to {getSelectedUserName()} via {getSelectedUserOtpMethod()}
//                   </small>
//                 </div>
//               )}

//               {/* OTP Verified Status */}
//               {otpVerified && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">OTP Status</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon bg-success text-white">
//                       <CIcon icon={cilShieldAlt} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       value="✓ OTP Verified"
//                       readOnly
//                       className="bg-success bg-opacity-25 text-success border-success"
//                     />
//                   </CInputGroup>
//                   <small className="text-success d-block mt-1">
//                     You can now proceed with stock transfer
//                   </small>
//                 </div>
//               )}

//               {/* Empty placeholders to maintain grid layout */}
//               {!otpSent && !otpVerified && formData.toType === 'branch' && (
//                 <div className="input-box">
//                   {/* Empty placeholder to maintain 3-column layout */}
//                 </div>
//               )}

//               {!otpSent && !otpVerified && formData.toType === 'subdealer' && (
//                 <div className="input-box">
//                   {/* Empty placeholder to maintain 3-column layout */}
//                 </div>
//               )}

//             </div>

//             {/* Vehicles selection error message */}
//             {errors.vehicles && (
//               <div className="row">
//                 <div className="col-12">
//                   <div className="alert alert-danger mt-2">{errors.vehicles}</div>
//                 </div>
//               </div>
//             )}

//             <div className="form-footer">
//               {canCreateStockTransfer ? (
//                 <>
//                   <button 
//                     type="submit" 
//                     className="submit-button" 
//                     disabled={isSubmitting || (otpUsers.length > 0 && !otpVerified)}
//                     title={otpUsers.length > 0 && !otpVerified ? "Please complete OTP verification first" : ""}
//                   >
//                     {isSubmitting ? 'Transferring...' : 'Transfer'}
//                   </button>
//                   <button 
//                     type="button" 
//                     className="cancel-button" 
//                     onClick={handleCancel} 
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <div className="alert alert-info">
//                   <strong>View Mode:</strong> You have VIEW permission only. To create transfers, contact your administrator.
//                 </div>
//               )}
//             </div>
//           </form>

//           {vehicles.length > 0 && formData.fromBranch ? (
//             <div className="vehicle-table mt-4 p-3">
//               <h5>In-Stock Vehicle Details ({vehicles.length} vehicles available)</h5>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CInputGroup>
//                     <CInputGroupText>
//                       <CIcon icon={cilSearch} style={{ width: '20px' }} />
//                     </CInputGroupText>
//                     <CFormInput
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search by chassis, model, type..."
//                       disabled={!canCreateStockTransfer}
//                     />
//                   </CInputGroup>
//                 </CCol>
//                 <CCol md={6} className="text-end">
//                   <span className="badge bg-info">
//                     Selected: {selectedVehicles.length} vehicles
//                   </span>
//                 </CCol>
//               </CRow>

//               <CTable striped bordered hover responsive>
//                 <CTableHead className="table-header-fixed">
//                   <CTableRow>
//                     {canCreateStockTransfer && (
//                       <CTableHeaderCell>
//                         Select
//                       </CTableHeaderCell>
//                     )}
//                     <CTableHeaderCell>Sr. No</CTableHeaderCell>
//                     <CTableHeaderCell>Unload Location</CTableHeaderCell>
//                     <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                     <CTableHeaderCell>Type</CTableHeaderCell>
//                     <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
//                     <CTableHeaderCell>Color</CTableHeaderCell>
//                     <CTableHeaderCell>Chassis No</CTableHeaderCell>
//                     <CTableHeaderCell>Current Status</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {filteredVehicles.length > 0 ? (
//                     filteredVehicles.map((vehicle, index) => (
//                       <CTableRow key={vehicle._id}>
//                         {canCreateStockTransfer && (
//                           <CTableDataCell>
//                             <CFormCheck
//                               onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
//                               checked={selectedVehicles.includes(vehicle._id)}
//                               disabled={isSubmitting || (otpUsers.length > 0 && !otpVerified)}
//                             />
//                           </CTableDataCell>
//                         )}
//                         <CTableDataCell>{index + 1}</CTableDataCell>
//                         <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                         <CTableDataCell>{formatDate(vehicle.createdAt)}</CTableDataCell>
//                         <CTableDataCell>{vehicle.type}</CTableDataCell>
//                         <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                         <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
//                         <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                         <CTableDataCell>{vehicle.status}</CTableDataCell>
//                       </CTableRow>
//                     ))
//                   ) : (
//                     <CTableRow>
//                       <CTableDataCell colSpan={canCreateStockTransfer ? 9 : 8} className="text-center">
//                         {searchTerm ? 'No vehicles match your search criteria' : 'No in-stock vehicles found'}
//                       </CTableDataCell>
//                     </CTableRow>
//                   )}
//                 </CTableBody>
//               </CTable>
//             </div>
//           ) : formData.fromBranch ? (
//             <div className="alert alert-info mt-4">No in-stock vehicles found for the selected branch.</div>
//           ) : null}
//         </div>
//       </div>

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
// }

// export default StockTransfer;




import React, { useState, useEffect } from 'react';
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
  CForm,
  CFormLabel,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilSearch, cilShieldAlt, cilFile } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import TransferChallan from './StockChallan';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

// Import date picker components
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { enIN } from 'date-fns/locale';

function StockTransfer() {
  const [formData, setFormData] = useState({
    fromBranch: '',
    toType: 'branch',
    toBranch: '',
    toSubdealer: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanData, setChallanData] = useState(null);
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
  
  // States for Export Report functionality
  const [exportReportModalOpen, setExportReportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedReportBranchId, setSelectedReportBranchId] = useState('');
  const [exportReportError, setExportReportError] = useState('');
  const [exportReportLoading, setExportReportLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const { permissions = [] } = useAuth();
  
  // Page-level permission checks for Stock Transfer page under Purchase module
  const hasStockTransferView = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.STOCK_TRANSFER, 
    ACTIONS.VIEW
  );
  
  const hasStockTransferCreate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.STOCK_TRANSFER, 
    ACTIONS.CREATE
  );
  
  const hasStockTransferDelete = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.STOCK_TRANSFER, 
    ACTIONS.DELETE
  );
  
  // Using convenience functions
  const canViewStockTransfer = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
  const canCreateStockTransfer = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
  const canDeleteStockTransfer = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.STOCK_TRANSFER);
  const canExportReport = canCreateStockTransfer; // Using CREATE permission for report export

  // Format date to DD-MM-YYYY
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

  useEffect(() => {
    // Check permission before loading data
    if (!canViewStockTransfer) {
      showError('You do not have permission to view Stock Transfer');
      return;
    }
    
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!canViewStockTransfer) return;
    
    const fetchSubdealers = async () => {
      if (formData.fromBranch) {
        try {
          const response = await axiosInstance.get(`/subdealers/branch/${formData.fromBranch}`);
          setSubdealers(response.data.data?.subdealers || []);
        } catch (error) {
          const message = showError(error); 
          if (message) setError(message);
        }
      } else {
        setSubdealers([]);
      }
    };

    fetchSubdealers();
  }, [formData.fromBranch]);

  useEffect(() => {
    if (!canViewStockTransfer) return;
    
    if (formData.fromBranch) {
      fetchOtpUsersForBranch(formData.fromBranch);
    } else {
      setOtpUsers([]);
      setShowOtpSection(false);
      setSelectedOtpUser('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpData({ otp: '', otpMethod: 'SMS' });
    }
  }, [formData.fromBranch]);

  const fetchBranches = async () => {
    if (!canViewStockTransfer) return;
    
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchOtpUsersForBranch = async (branchId) => {
    if (!canViewStockTransfer) return;
    
    try {
      const response = await axiosInstance.get('/users');
      const allUsers = response.data.data || [];
      
      // Filter users who belong to the selected branch AND have isStockTransferOTP = true
      const filteredUsers = allUsers.filter(user => 
        user.branch === branchId && 
        user.isStockTransferOTP === true
      );
      
      setOtpUsers(filteredUsers);
      
      // If there are no OTP users for this branch, don't show OTP section
      if (filteredUsers.length === 0) {
        setShowOtpSection(false);
        setOtpVerified(true); // No OTP required if no users are configured
      } else {
        setShowOtpSection(true);
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
      setOtpUsers([]);
    }
  };

  const fetchVehiclesForBranch = async (branchId) => {
    if (!canViewStockTransfer) return;
    
    try {
      const res = await axiosInstance.get(`/vehicles/branch/${branchId}?locationType=branch`);
      const inStockVehicles = (res.data.data.vehicles || []).filter((vehicle) => vehicle.status === 'in_stock');
      setVehicles(inStockVehicles);
      setFilteredVehicles(inStockVehicles);
      setSelectedVehicles([]);
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  useEffect(() => {
    if (!canViewStockTransfer) return;
    
    if (searchTerm) {
      const filtered = vehicles.filter((vehicle) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (vehicle.chassisNumber && vehicle.chassisNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.engineNumber && vehicle.engineNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.motorNumber && vehicle.motorNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.model?.model_name && vehicle.model.model_name.toLowerCase().includes(searchLower)) ||
          (vehicle.type && vehicle.type.toLowerCase().includes(searchLower)) ||
          (vehicle.batteryNumber && vehicle.batteryNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.keyNumber && vehicle.keyNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.chargerNumber && vehicle.chargerNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.unloadLocation?.name && vehicle.unloadLocation.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  const handleChange = (e) => {
    if (!canViewStockTransfer) return;
    
    const { name, value } = e.target;

    if (name === 'toType') {
      setFormData(prevData => ({ 
        ...prevData, 
        [name]: value,
        toBranch: '',
        toSubdealer: ''
      }));
    } else if (name === 'fromBranch') {
      setFormData(prevData => ({ 
        ...prevData, 
        [name]: value,
        toBranch: '',
        toSubdealer: ''
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'fromBranch' && value) {
      fetchVehiclesForBranch(value);
    } else if (name === 'fromBranch') {
      setVehicles([]);
      setFilteredVehicles([]);
      setSelectedVehicles([]);
      setSubdealers([]);
    }
  };

  const handleVehicleSelect = (vehicleId, isSelected) => {
    if (!canCreateStockTransfer) {
      showError('You do not have permission to select vehicles for transfer');
      return;
    }
    
    setSelectedVehicles((prev) => {
      if (isSelected) {
        return [...prev, vehicleId];
      } else {
        return prev.filter((id) => id !== vehicleId);
      }
    });
  };

  const handleSendOtp = async () => {
    if (!selectedOtpUser) {
      showError('Please select a user to send OTP');
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await axiosInstance.post('/transfers/request-otp', {
        userId: selectedOtpUser
      });

      showSuccess('OTP sent successfully!');
      setOtpSent(true);
      setOtpVerified(false);
      setOtpData({ ...otpData, otpMethod: getSelectedUserOtpMethod() });
    } catch (error) {
      showError(error);
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
    try {
      const response = await axiosInstance.post('/transfers/verify-otp', {
        userId: selectedOtpUser,
        otp: otpData.otp,
        otpMethod: getSelectedUserOtpMethod()
      });

      showSuccess('OTP verified successfully!');
      setOtpVerified(true);
    } catch (error) {
      showError(error);
      setOtpVerified(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const getSelectedUserOtpMethod = () => {
    const user = otpUsers.find(u => u._id === selectedOtpUser);
    return user?.otpMethod || 'SMS';
  };

  const getSelectedUserName = () => {
    const user = otpUsers.find(u => u._id === selectedOtpUser);
    return user?.name || '';
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

  // Reset Export Report modal
  const resetExportReportModal = () => {
    setStartDate(null);
    setEndDate(null);
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

    if (!startDate || !endDate) {
      setExportReportError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setExportReportError('Start date cannot be after end date');
      return;
    }

    try {
      setExportReportLoading(true);
      
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      // Build query parameters for the transfers report API
      const params = new URLSearchParams({
        branchId: selectedReportBranchId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        format: 'excel'
      });

      const response = await axiosInstance.get(
        `/reports/stock/transfers?${params.toString()}`,
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
      const fileName = `Stock_Transfers_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      // Show success message
      showSuccess('Stock transfers report exported successfully!');

      resetExportReportModal();
      
    } catch (error) {
      console.error('Error exporting stock transfers report:', error);
      
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
          setExportReportError('Failed to export stock transfers report');
          showError('Failed to export stock transfers report');
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
        setExportReportError('Failed to export stock transfers report');
        showError('Failed to export stock transfers report');
      }
      
    } finally {
      setExportReportLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canCreateStockTransfer) {
      showError('You do not have permission to transfer stock');
      return;
    }
    
    // Check OTP requirement
    if (otpUsers.length > 0 && !otpVerified) {
      showError('Please complete OTP verification before transferring stock');
      return;
    }
    
    setIsSubmitting(true);
    const newErrors = {};
    
    if (!formData.fromBranch) newErrors.fromBranch = 'From branch is required';
    if (!formData.toType) newErrors.toType = 'Type is required';
    
    if (formData.toType === 'branch' && !formData.toBranch) {
      newErrors.toBranch = 'To branch is required';
    } else if (formData.toType === 'subdealer' && !formData.toSubdealer) {
      newErrors.toSubdealer = 'Subdealer is required';
    }
    
    if (selectedVehicles.length === 0) newErrors.vehicles = 'Please select at least one vehicle';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        fromBranch: formData.fromBranch,
        toType: formData.toType,
        toBranch: formData.toType === 'branch' ? formData.toBranch : undefined,
        toSubdealer: formData.toType === 'subdealer' ? formData.toSubdealer : undefined,
        items: selectedVehicles.map((vehicleId) => ({ vehicle: vehicleId }))
      };

      // Add OTP data if OTP is required and verified
      if (otpUsers.length > 0 && otpVerified && selectedOtpUser) {
        payload.otpData = {
          userId: selectedOtpUser,
          otp: otpData.otp,
          otpMethod: getSelectedUserOtpMethod()
        };
      }

      const response = await axiosInstance.post('/transfers', payload);

      const fromBranchData = branches.find((b) => b._id === formData.fromBranch);
      
      let toBranchData = null;
      let toSubdealerData = null;
      let destinationName = '';
      
      if (formData.toType === 'branch') {
        toBranchData = branches.find((b) => b._id === formData.toBranch);
        destinationName = toBranchData?.name || '';
      } else {
        toSubdealerData = subdealers.find((s) => s._id === formData.toSubdealer);
        destinationName = toSubdealerData?.name || '';
      }
      
      const selectedVehicleData = vehicles.filter((v) => selectedVehicles.includes(v._id));

      setChallanData({
        transferDetails: response.data,
        fromBranch: fromBranchData,
        toBranch: toBranchData,
        toSubdealer: toSubdealerData,
        toType: formData.toType,
        vehicles: selectedVehicleData,
        destinationName: destinationName
      });

      showSuccess('Stock transferred successfully!').then(() => {
        setShowChallanModal(true);
      });

      // Reset form but keep fromBranch
      setFormData({ 
        fromBranch: formData.fromBranch, 
        toType: 'branch',
        toBranch: '', 
        toSubdealer: '' 
      });
      
      // Reset OTP state
      setSelectedOtpUser('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpData({ otp: '', otpMethod: 'SMS' });
      
      fetchVehiclesForBranch(formData.fromBranch);
      setSelectedVehicles([]);
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/upload-challan');
  };

  const handleCloseModal = () => {
    setShowChallanModal(false);
  };

  // Check permission before rendering
  if (!canViewStockTransfer) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Stock Transfer.
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Transfer Stock to Network</div>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {/* Export Report Button - with same styling as UploadChallan */}
            {canExportReport && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleOpenExportReport}
                title="Export Stock Transfers Report"
                style={{
                  backgroundColor: '#321fdb',
                  borderColor: '#321fdb',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2a1ab8';
                  e.target.style.borderColor = '#2a1ab8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#321fdb';
                  e.target.style.borderColor = '#321fdb';
                }}
              >
                <CIcon icon={cilFile} className='me-1' /> Export Report
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="form-container">
            {error && <CAlert color="danger">{error}</CAlert>}
            <div className="form-card">
              <div className="form-body">
                {/* READ-ONLY VIEW FOR USERS WITHOUT CREATE PERMISSION */}
                {!canCreateStockTransfer ? (
                  <div className="alert alert-warning mb-4">
                    <strong>Note:</strong> You have VIEW permission only. You can view stock transfer information but cannot create new transfers.
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="user-details">
                    {/* First Row: From Branch and Transfer Type */}
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">From Branch</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormSelect 
                          name="fromBranch" 
                          value={formData.fromBranch} 
                          onChange={handleChange} 
                          invalid={!!errors.fromBranch}
                          disabled={isSubmitting || !canCreateStockTransfer}
                        >
                          <option value="">-Select-</option>
                          {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.fromBranch && <div className="invalid-feedback">{errors.fromBranch}</div>}
                    </div>

                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Transfer Type</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormSelect 
                          name="toType" 
                          value={formData.toType} 
                          onChange={handleChange} 
                          invalid={!!errors.toType}
                          disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
                        >
                          <option value="branch">Branch</option>
                          <option value="subdealer">Subdealer</option>
                        </CFormSelect>
                      </CInputGroup>
                      {errors.toType && <div className="invalid-feedback">{errors.toType}</div>}
                    </div>

                    {/* OTP User Selection Field (3rd field in first row when OTP is required) */}
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
                      </div>
                    )}

                    {/* Second Row: To Branch/Subdealer based on type */}
                    {formData.toType === 'branch' && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">To Branch</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormSelect 
                            name="toBranch" 
                            value={formData.toBranch} 
                            onChange={handleChange} 
                            invalid={!!errors.toBranch}
                            disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
                          >
                            <option value="">-Select-</option>
                            {branches
                              .filter(branch => branch._id !== formData.fromBranch) // Exclude from branch
                              .map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                  {branch.name}
                                </option>
                              ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.toBranch && <div className="invalid-feedback">{errors.toBranch}</div>}
                      </div>
                    )}

                    {formData.toType === 'subdealer' && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">To Subdealer</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormSelect 
                            name="toSubdealer" 
                            value={formData.toSubdealer} 
                            onChange={handleChange} 
                            invalid={!!errors.toSubdealer}
                            disabled={!formData.fromBranch || isSubmitting || !canCreateStockTransfer}
                          >
                            <option value="">-Select-</option>
                            {subdealers.map((subdealer) => (
                              <option key={subdealer._id} value={subdealer._id}>
                                {subdealer.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.toSubdealer && <div className="invalid-feedback">{errors.toSubdealer}</div>}
                      </div>
                    )}

                    {/* OTP Input Field (appears after OTP is sent) */}
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
                            onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                            disabled={isVerifyingOtp}
                          />
                          <CButton 
                            color="success" 
                            onClick={handleVerifyOtp}
                            disabled={!otpData.otp || otpData.otp.length < 6 || isVerifyingOtp}
                          >
                            {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                          </CButton>
                        </CInputGroup>
                        <small className="text-muted d-block mt-1">
                          OTP sent to {getSelectedUserName()} via {getSelectedUserOtpMethod()}
                        </small>
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

                    {/* Empty placeholders to maintain grid layout */}
                    {!otpSent && !otpVerified && formData.toType === 'branch' && (
                      <div className="input-box">
                        {/* Empty placeholder to maintain 3-column layout */}
                      </div>
                    )}

                    {!otpSent && !otpVerified && formData.toType === 'subdealer' && (
                      <div className="input-box">
                        {/* Empty placeholder to maintain 3-column layout */}
                      </div>
                    )}

                  </div>

                  {/* Vehicles selection error message */}
                  {errors.vehicles && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger mt-2">{errors.vehicles}</div>
                      </div>
                    </div>
                  )}

                  <div className="form-footer">
                    {canCreateStockTransfer ? (
                      <>
                        <button 
                          type="submit" 
                          className="submit-button" 
                          disabled={isSubmitting || (otpUsers.length > 0 && !otpVerified)}
                          title={otpUsers.length > 0 && !otpVerified ? "Please complete OTP verification first" : ""}
                        >
                          {isSubmitting ? 'Transferring...' : 'Transfer'}
                        </button>
                        <button 
                          type="button" 
                          className="cancel-button" 
                          onClick={handleCancel} 
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="alert alert-info">
                        <strong>View Mode:</strong> You have VIEW permission only. To create transfers, contact your administrator.
                      </div>
                    )}
                  </div>
                </form>

                {vehicles.length > 0 && formData.fromBranch ? (
                  <div className="vehicle-table mt-4 p-3">
                    <h5>In-Stock Vehicle Details ({vehicles.length} vehicles available)</h5>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilSearch} style={{ width: '20px' }} />
                          </CInputGroupText>
                          <CFormInput
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by chassis, model, type..."
                            disabled={!canCreateStockTransfer}
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol md={6} className="text-end">
                        <span className="badge bg-info">
                          Selected: {selectedVehicles.length} vehicles
                        </span>
                      </CCol>
                    </CRow>

                    <CTable striped bordered hover responsive>
                      <CTableHead className="table-header-fixed">
                        <CTableRow>
                          {canCreateStockTransfer && (
                            <CTableHeaderCell>
                              Select
                            </CTableHeaderCell>
                          )}
                          <CTableHeaderCell>Sr. No</CTableHeaderCell>
                          <CTableHeaderCell>Unload Location</CTableHeaderCell>
                          <CTableHeaderCell>Inward Date</CTableHeaderCell>
                          <CTableHeaderCell>Type</CTableHeaderCell>
                          <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
                          <CTableHeaderCell>Color</CTableHeaderCell>
                          <CTableHeaderCell>Chassis No</CTableHeaderCell>
                          <CTableHeaderCell>Current Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredVehicles.length > 0 ? (
                          filteredVehicles.map((vehicle, index) => (
                            <CTableRow key={vehicle._id}>
                              {canCreateStockTransfer && (
                                <CTableDataCell>
                                  <CFormCheck
                                    onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
                                    checked={selectedVehicles.includes(vehicle._id)}
                                    disabled={isSubmitting || (otpUsers.length > 0 && !otpVerified)}
                                  />
                                </CTableDataCell>
                              )}
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
                              <CTableDataCell>{formatDate(vehicle.createdAt)}</CTableDataCell>
                              <CTableDataCell>{vehicle.type}</CTableDataCell>
                              <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                              <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
                              <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                              <CTableDataCell>{vehicle.status}</CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={canCreateStockTransfer ? 9 : 8} className="text-center">
                              {searchTerm ? 'No vehicles match your search criteria' : 'No in-stock vehicles found'}
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>
                ) : formData.fromBranch ? (
                  <div className="alert alert-info mt-4">No in-stock vehicles found for the selected branch.</div>
                ) : null}
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* Export Report Modal */}
      <CModal alignment="center" visible={exportReportModalOpen} onClose={resetExportReportModal}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Export Stock Transfers Report
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Display export error */}
          {exportReportError && (
            <CAlert color="warning" className="mb-3">
              {exportReportError}
            </CAlert>
          )}
          
          <LocalizationProvider 
            dateAdapter={AdapterDateFns} 
            adapterLocale={enIN} // Add Indian locale
          >
            <div className="mb-3">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setExportReportError(''); // Clear error when user changes date
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                inputFormat="dd/MM/yyyy" // Use slash format for display
                mask="__/__/____" // Add mask for better UX
                views={['day', 'month', 'year']} // Show day-month-year in that order
                disabled={!canExportReport}
              />
            </div>
            <div className="mb-3">
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setExportReportError(''); // Clear error when user changes date
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                inputFormat="dd/MM/yyyy" // Use slash format for display
                mask="__/__/____" // Add mask for better UX
                minDate={startDate}
                views={['day', 'month', 'year']} // Show day-month-year in that order
                disabled={!canExportReport}
              />
            </div>
          </LocalizationProvider>
          
          <TextField
            select
            value={selectedReportBranchId}
            onChange={(e) => {
              setSelectedReportBranchId(e.target.value);
              setExportReportError(''); // Clear error when user changes branch
            }}
            fullWidth
            size="small"
            SelectProps={{ native: true }}
            disabled={!canExportReport}
          >
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </TextField>
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
            disabled={!startDate || !endDate || !selectedReportBranchId || !canExportReport || exportReportLoading}
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
}

export default StockTransfer;