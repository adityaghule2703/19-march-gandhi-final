// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormLabel,
//   CButton,
//   CFormSelect,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CForm,
//   CAlert,
//   CRow,
//   CCol
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowLeft, cilCheck, cilWarning } from '@coreui/icons';
// import axiosInstance from 'src/axiosInstance.js';
// import { showError, showSuccess } from 'src/utils/sweetAlerts';
// import '../../../css/form.css';

// const ChassisAllocation = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // booking ID from URL
  
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [submitError, setSubmitError] = useState('');
  
//   // Form states
//   const [chassisNumber, setChassisNumber] = useState('');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]);
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');
//   const [isUpdate, setIsUpdate] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchBookingDetails();
//     }
//   }, [id]);

//   useEffect(() => {
//     if (booking) {
//       // Check if this is an update (booking already has a chassis number)
//       setIsUpdate(!!booking.chassisNumber);
      
//       if (!booking.chassisNumber) {
//         // New allocation - fetch available chassis numbers
//         fetchAvailableChassisNumbers();
//       } else {
//         // Update existing - set current chassis number
//         setChassisNumber(booking.chassisNumber);
//       }
//     }
//   }, [booking]);

//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//       const oldestChassis = getOldestChassis();
      
//       // Show note if selected chassis is not the oldest one (non-FIFO selection)
//       const shouldShowNote = 
//         selectedChassis && 
//         oldestChassis && 
//         selectedChassis.chassisNumber !== oldestChassis.chassisNumber;
      
//       setShowNonFifoNote(shouldShowNote);
      
//       // Reset reason when switching back to FIFO chassis
//       if (selectedChassis && oldestChassis && selectedChassis.ageInDays === oldestChassis.ageInDays) {
//         setNonFifoReason('');
//       }
//     }
//   }, [chassisNumber, availableChassisData]);

//   const fetchBookingDetails = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       const bookingData = response.data.data;
      
//       console.log('Booking Data:', bookingData); // Debug log
      
//       // Verify this is a subdealer booking
//       if (bookingData.bookingType !== 'SUBDEALER') {
//         setError('Invalid booking type. This page is for subdealer bookings only.');
//         return;
//       }
      
//       // Verify booking is in APPROVED state for allocation
//       if (!bookingData.chassisNumber && bookingData.status !== 'APPROVED') {
//         setError('Chassis can only be allocated to APPROVED bookings.');
//         return;
//       }
      
//       setBooking(bookingData);
      
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to load booking details';
//       setError(errorMessage);
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableChassisNumbers = async () => {
//     if (!booking) return;
    
//     try {
//       setError('');
//       setLoadingChassisNumbers(true);
      
//       // Get the correct model ID and color ID from the booking object
//       const modelId = booking.model?._id || booking.model?.id || booking.model;
//       const colorId = booking.color?._id || booking.color?.id || booking.color;
      
//       // Get subdealer ID
//       const subdealerId = booking.subdealer?._id || booking.subdealer;
      
//       console.log('Fetching chassis with params:', {
//         modelId,
//         colorId,
//         subdealerId,
//         booking
//       }); // Debug log
      
//       if (!modelId || !colorId || !subdealerId) {
//         setError('Missing required information (model, color, or subdealer)');
//         return;
//       }
      
//       const response = await axiosInstance.get(
//         `/vehicles/model/${modelId}/${colorId}/chassis-numbers?subdealerId=${subdealerId}`
//       );
      
//       // Store the full chassis data objects
//       const chassisData = response.data.data.chassisNumbers || [];
      
//       if (chassisData.length === 0) {
//         setError('No chassis numbers available for this model and color combination.');
//         return;
//       }
      
//       // Sort by ageInDays (descending) - oldest first for FIFO
//       const sortedData = [...chassisData].sort((a, b) => b.ageInDays - a.ageInDays);
//       setAvailableChassisData(sortedData);
      
//       // Extract chassis numbers from the objects
//       const chassisNumbers = sortedData.map(item => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumbers);

//       // Auto-select the oldest chassis (FIFO)
//       if (sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }
      
//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to fetch chassis numbers. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   // Get the oldest chassis (FIFO - first in first out)
//   const getOldestChassis = () => {
//     if (availableChassisData.length === 0) return null;
//     return availableChassisData[0];
//   };

//   // Helper function to format display text for chassis numbers
//   const getChassisDisplayText = (chassis) => {
//     const oldestChassis = getOldestChassis();
//     const isOldest = oldestChassis && chassis.chassisNumber === oldestChassis.chassisNumber;
    
//     let displayText = chassis.chassisNumber;
    
//     // Show age/days information
//     if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
//       const days = chassis.ageInDays;
//       displayText += ` - ${days} days old`;
//     }
    
//     // Add indicators
//     if (isOldest) {
//       displayText += ' (Recommended - FIFO)';
//     }
    
//     return displayText;
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   // Clear previous errors
//   setSubmitError('');
  
//   // Validation
//   if (!chassisNumber.trim()) {
//     setSubmitError('Please select a chassis number');
//     return;
//   }
  
//   if (isUpdate && !reason.trim()) {
//     setSubmitError('Please enter a reason for updating the chassis number');
//     return;
//   }
  
//   if (showNonFifoNote && !nonFifoReason.trim()) {
//     setSubmitError('Please provide a reason for selecting a newer chassis while older chassis are available');
//     return;
//   }

//   const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//   const oldestChassis = getOldestChassis();
//   const isNonFifoSelection = selectedChassis && oldestChassis && selectedChassis.ageInDays !== oldestChassis.ageInDays;

//   try {
//     setSaving(true);
    
//     // FIXED: Use the id from useParams() instead of booking._id
//     let url = `/bookings/${id}/allocate`;
//     const queryParams = [];
    
//     if (isUpdate && reason) {
//       queryParams.push(`reason=${encodeURIComponent(reason)}`);
//     }

//     if (queryParams.length > 0) {
//       url += `?${queryParams.join('&')}`;
//     }

//     const formData = new FormData();
//     formData.append('chassisNumber', chassisNumber.trim());
//     formData.append('is_deviation', false); // Default to false

//     // Add note if non-FIFO selection
//     if (isNonFifoSelection && nonFifoReason.trim()) {
//       formData.append('note', nonFifoReason.trim());
//     } else if (reason) {
//       formData.append('note', reason);
//     }
    
//     // Add claim handling if needed in the future
//     formData.append('hasClaim', 'false');

//     const response = await axiosInstance.put(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     if (response.data.success) {
//       const successMessage = isUpdate 
//         ? 'Chassis number updated successfully!' 
//         : 'Chassis number allocated successfully!';
      
//       await showSuccess(successMessage);
      
//       // Navigate back to all bookings
//       navigate('/subdealer-all-bookings');
//     } else {
//       setSubmitError(response.data.message || 'Failed to save chassis number');
//     }
    
//   } catch (error) {
//     console.error(`Error ${isUpdate ? 'updating' : 'allocating'} chassis number:`, error);
    
//     // Extract error message
//     let errorMessage = 'Failed to save chassis number';
    
//     if (error.response) {
//       errorMessage = error.response.data?.message || 
//                     error.response.data?.error || 
//                     error.response.statusText;
      
//       // Check for specific error message
//       if (error.response.data?.message === "Vehicle not found in inventory") {
//         errorMessage = `Vehicle ${chassisNumber} not found in inventory`;
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     setSubmitError(errorMessage);
//     showError(errorMessage);
//   } finally {
//     setSaving(false);
//   }
// };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error && !booking) {
//     return (
//       <div className="form-container">
//         <div className="title">Chassis Allocation</div>
//         <CCard>
//           <CCardBody>
//             <CAlert color="danger">{error}</CAlert>
//             <CButton 
//               color="secondary" 
//               onClick={() => navigate('/subdealer-all-bookings')}
//             >
//               <CIcon icon={cilArrowLeft} className="me-2" />
//               Back to Bookings
//             </CButton>
//           </CCardBody>
//         </CCard>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       <div className="title">
//         {isUpdate ? 'Update Chassis Number' : 'Allocate Chassis Number'}
//       </div>
      
//       <CCard>
//         <CCardHeader className="d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">Booking Details</h5>
//           <CButton 
//             color="secondary" 
//             size="sm"
//             onClick={() => navigate('/subdealer-all-bookings')}
//           >
//             <CIcon icon={cilArrowLeft} className="me-2" />
//             Back to Bookings
//           </CButton>
//         </CCardHeader>
        
//         <CCardBody>
//           {error && (
//             <CAlert color="warning" className="mb-4">
//               <CIcon icon={cilWarning} className="me-2" />
//               {error}
//             </CAlert>
//           )}
          
//           {submitError && (
//             <CAlert color="danger" className="mb-4">
//               <strong>Error:</strong> {submitError}
//             </CAlert>
//           )}
          
//           <CForm onSubmit={handleSubmit}>
//             <CRow>
//               <CCol md={6}>
//                 <div className="mb-4">
//                   <CFormLabel className="fw-bold">Booking Number</CFormLabel>
//                   <div className="form-control bg-light">{booking?.bookingNumber || 'N/A'}</div>
//                 </div>
//               </CCol>
//               <CCol md={6}>
//                 <div className="mb-4">
//                   <CFormLabel className="fw-bold">Customer Name</CFormLabel>
//                   <div className="form-control bg-light">{booking?.customerDetails?.name || 'N/A'}</div>
//                 </div>
//               </CCol>
//             </CRow>
            
//             <CRow>
//               <CCol md={4}>
//                 <div className="mb-4">
//                   <CFormLabel className="fw-bold">Model</CFormLabel>
//                   <div className="form-control bg-light">{booking?.model?.model_name || booking?.model?.name || 'N/A'}</div>
//                 </div>
//               </CCol>
//               <CCol md={4}>
//                 <div className="mb-4">
//                   <CFormLabel className="fw-bold">Color</CFormLabel>
//                   <div className="form-control bg-light">{booking?.color?.name || 'N/A'}</div>
//                 </div>
//               </CCol>
//               <CCol md={4}>
//                 <div className="mb-4">
//                   <CFormLabel className="fw-bold">Subdealer</CFormLabel>
//                   <div className="form-control bg-light">{booking?.subdealer?.name || 'N/A'}</div>
//                 </div>
//               </CCol>
//             </CRow>
            
//             {isUpdate && booking.chassisNumber && (
//               <CRow>
//                 <CCol md={6}>
//                   <div className="mb-4">
//                     <CFormLabel className="fw-bold">Currently Allocated Chassis</CFormLabel>
//                     <div className="form-control bg-light">{booking.chassisNumber}</div>
//                   </div>
//                 </CCol>
//               </CRow>
//             )}
            
//             <CRow>
//               <CCol md={12}>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="chassisNumber" className="fw-bold">
//                     {isUpdate ? 'New Chassis Number' : 'Select Chassis Number'} <span className="text-danger">*</span>
//                   </CFormLabel>
                  
//                   {loadingChassisNumbers ? (
//                     <div className="text-center py-3">
//                       <CSpinner size="sm" />
//                       <span className="ms-2">Loading available chassis numbers...</span>
//                     </div>
//                   ) : availableChassisNumbers.length > 0 ? (
//                     <CFormSelect 
//                       id="chassisNumber"
//                       value={chassisNumber} 
//                       onChange={(e) => setChassisNumber(e.target.value)} 
//                       required
//                       disabled={saving}
//                     >
//                       <option value="">-- Select a chassis number --</option>
//                       {availableChassisData.map((chassis) => (
//                         <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
//                           {getChassisDisplayText(chassis)}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   ) : (
//                     <CFormInput
//                       type="text"
//                       id="chassisNumber"
//                       value={chassisNumber}
//                       onChange={(e) => setChassisNumber(e.target.value)}
//                       placeholder="Enter chassis number manually"
//                       required
//                       disabled={saving}
//                     />
//                   )}
                  
//                   {availableChassisData.length > 0 && (
//                     <small className="text-muted d-block mt-1">
//                       <CIcon icon={cilCheck} className="text-success me-1" />
//                       {availableChassisData.length} chassis number(s) available for this model/color
//                     </small>
//                   )}
//                 </div>
//               </CCol>
//             </CRow>
            
//             {showNonFifoNote && (
//               <CRow>
//                 <CCol md={12}>
//                   <div className="mb-3">
//                     <CFormLabel htmlFor="nonFifoReason" className="fw-bold">
//                       Reason for Non-FIFO Selection <span className="text-danger">*</span>
//                     </CFormLabel>
//                     <CFormTextarea
//                       id="nonFifoReason"
//                       value={nonFifoReason}
//                       onChange={(e) => setNonFifoReason(e.target.value)}
//                       required
//                       rows={3}
//                       placeholder="Please provide a valid reason for selecting a newer chassis while older chassis are available"
//                       disabled={saving}
//                     />
//                     <small className="text-warning">
//                       Selecting a newer chassis while older ones are available requires justification.
//                     </small>
//                   </div>
//                 </CCol>
//               </CRow>
//             )}
            
//             {isUpdate && (
//               <CRow>
//                 <CCol md={12}>
//                   <div className="mb-3">
//                     <CFormLabel htmlFor="reason" className="fw-bold">
//                       Reason for Update <span className="text-danger">*</span>
//                     </CFormLabel>
//                     <CFormTextarea
//                       id="reason"
//                       value={reason}
//                       onChange={(e) => setReason(e.target.value)}
//                       required
//                       rows={3}
//                       placeholder="Enter reason for changing the chassis number"
//                       disabled={saving}
//                     />
//                   </div>
//                 </CCol>
//               </CRow>
//             )}
            
//             <div className="d-flex justify-content-end gap-2 mt-4">
//               <CButton 
//                 type="button"
//                 color="secondary" 
//                 onClick={() => navigate('/subdealer-all-bookings')}
//                 disabled={saving}
//               >
//                 Cancel
//               </CButton>
//               <CButton
//                 type="submit"
//                 color="primary"
//                 disabled={saving || (loadingChassisNumbers && availableChassisNumbers.length === 0)}
//               >
//                 {saving ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {isUpdate ? 'Updating...' : 'Allocating...'}
//                   </>
//                 ) : (
//                   isUpdate ? 'Update Chassis Number' : 'Allocate Chassis Number'
//                 )}
//               </CButton>
//             </div>
//           </CForm>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default ChassisAllocation;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CButton,
  CFormSelect,
  CSpinner,
  CFormInput,
  CFormTextarea,
  CForm,
  CAlert,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilCheck, cilWarning, cilLocationPin } from '@coreui/icons';
import axiosInstance from 'src/axiosInstance.js';
import { showError, showSuccess } from 'src/utils/sweetAlerts';
import '../../../css/form.css';

const ChassisAllocation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // booking ID from URL
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  
  // Form states
  const [chassisNumber, setChassisNumber] = useState('');
  const [reason, setReason] = useState('');
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [availableChassisData, setAvailableChassisData] = useState([]);
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
  const [showNonFifoNote, setShowNonFifoNote] = useState(false);
  const [nonFifoReason, setNonFifoReason] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [nonFifoError, setNonFifoError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  useEffect(() => {
    if (booking) {
      // Check if this is an update (booking already has a chassis number)
      setIsUpdate(!!booking.chassisNumber);
      
      if (!booking.chassisNumber) {
        // New allocation - fetch available chassis numbers
        fetchAvailableChassisNumbers();
      } else {
        // Update existing - set current chassis number
        setChassisNumber(booking.chassisNumber);
      }
    }
  }, [booking]);

  useEffect(() => {
    if (chassisNumber && availableChassisData.length > 0) {
      const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
      console.log('Selected Chassis:', selectedChassis);
      console.log('Booking ID:', booking?._id);
      console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
      if (selectedChassis) {
        const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
        if (selectedChassis.status === 'booked') {
          console.log('Booked chassis - no note or reason field');
          setShowNonFifoNote(false);
          return;
        }
        
        if (selectedChassis.status === 'in_stock') {
          const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
          console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
          if (hasCurrentChassisInList) {
            if (isCurrentChassis) {
              console.log('Current chassis selected - show note field only');
              setShowNonFifoNote(true);
            } else {
              console.log('Non-current chassis selected (current exists) - show note field');
              setShowNonFifoNote(true);
            }
          } else {
            console.log('No current chassis in list');
            
            const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
            if (inStockChassis.length > 0) {
              const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
              const oldestInStockChassis = sortedInStock[0];
              
              console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
              setShowNonFifoNote(true);
              
              // Reset reason if selecting the oldest chassis
              if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
                setNonFifoReason('');
              }
            }
          }
        } else {
          setShowNonFifoNote(false);
        }
      }
    } else {
      setShowNonFifoNote(false);
    }
  }, [chassisNumber, availableChassisData, booking]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axiosInstance.get(`/bookings/${id}`);
      const bookingData = response.data.data;
      
      console.log('Booking Data:', bookingData); // Debug log
      
      // Verify this is a subdealer booking
      if (bookingData.bookingType !== 'SUBDEALER') {
        setError('Invalid booking type. This page is for subdealer bookings only.');
        return;
      }
      
      // Verify booking is in APPROVED state for allocation
      if (!bookingData.chassisNumber && bookingData.status !== 'APPROVED') {
        setError('Chassis can only be allocated to APPROVED bookings.');
        return;
      }
      
      setBooking(bookingData);
      
    } catch (error) {
      console.error('Error fetching booking details:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load booking details';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableChassisNumbers = async () => {
    if (!booking) return;
    
    try {
      setError('');
      setLoadingChassisNumbers(true);
      
      // Get the correct model ID and color ID from the booking object
      const modelId = booking.model?._id || booking.model?.id || booking.model;
      const colorId = booking.color?._id || booking.color?.id || booking.color;
      
      // Get subdealer ID
      const subdealerId = booking.subdealer?._id || booking.subdealer;
      
      console.log('Fetching chassis with params:', {
        modelId,
        colorId,
        subdealerId,
        booking
      }); // Debug log
      
      if (!modelId || !colorId || !subdealerId) {
        setError('Missing required information (model, color, or subdealer)');
        return;
      }
      
      const response = await axiosInstance.get(
        `/vehicles/model/${modelId}/${colorId}/chassis-numbers?subdealerId=${subdealerId}`
      );
      
      // Store the full chassis data objects
      let chassisData = response.data.data.chassisNumbers || [];
      
      console.log('API Response:', chassisData);
      
      // Get the booking's branch ID (if available)
      const bookingBranchId = booking.branch?._id;
      console.log('Booking Branch ID:', bookingBranchId);

      // Filter chassis numbers to only show those from the same branch (if branch info exists)
      if (bookingBranchId) {
        chassisData = chassisData.filter((chassis) => {
          // Check if location exists and has id, then compare with booking's branch ID
          const chassisBranchId = chassis.location?.id;
          const isSameBranch = chassisBranchId === bookingBranchId;
          
          console.log(`Chassis ${chassis.chassisNumber}:`, {
            chassisBranchId,
            bookingBranchId,
            isSameBranch
          });
          
          return isSameBranch;
        });
      }

      if (chassisData.length === 0) {
        setError('No chassis numbers available for this model and color combination in your branch.');
        return;
      }
      
      // Sort by ageInDays (descending) - oldest first for FIFO
      const sortedData = [...chassisData].sort((a, b) => b.ageInDays - a.ageInDays);
      setAvailableChassisData(sortedData);
      
      // Extract chassis numbers from the objects
      const chassisNumbers = sortedData.map(item => item.chassisNumber);
      setAvailableChassisNumbers(chassisNumbers);

      // Auto-select the oldest chassis (FIFO)
      if (sortedData.length > 0) {
        setChassisNumber(sortedData[0].chassisNumber);
      }
      
      // Show a warning if no chassis numbers are available in the same branch
      if (chassisData.length === 0 && !isUpdate) {
        console.warn('No chassis numbers available in the same branch');
      }
      
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch chassis numbers. Please try again.';
      setError(errorMessage);
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  // Get the oldest chassis (FIFO - first in first out)
  const getOldestChassis = () => {
    if (availableChassisData.length === 0) return null;
    return availableChassisData[0];
  };

 // Helper function to format display text for chassis numbers
const getChassisDisplayText = (chassis) => {
  let displayText = chassis.chassisNumber;
  let detailsText = '';

  // Add location info if available
  if (chassis.location?.name) {
    detailsText += ` - ${chassis.location.name}`;
  }

  // Add age/days information for ALL chassis (including current)
  if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
    const days = chassis.ageInDays;
    detailsText += ` (${days} day${days !== 1 ? 's' : ''} old)`;
  }
  
  // Check if chassis is booked or blocked (for other bookings)
  if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
    displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${detailsText}`;
  } else {
    displayText = `${chassis.chassisNumber}${detailsText}`;
  }
  
  // Add status indicator for booked chassis (for other bookings)
  if (chassis.status === 'booked') {
    displayText += ' (Booked for another customer)';
  } else if (chassis.status === 'in_stock') {
    // Add FIFO indicator for oldest in_stock chassis
    const oldestChassis = getOldestChassis();
    if (oldestChassis && chassis.chassisNumber === oldestChassis.chassisNumber) {
      displayText += ' (Recommended - FIFO)';
    }
  }
  
  return displayText;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setSubmitError('');
    setNonFifoError(false);
    
    // Validation
    if (!chassisNumber.trim()) {
      setSubmitError('Please select a chassis number');
      return;
    }
    
    if (isUpdate && !reason.trim()) {
      setSubmitError('Please enter a reason for updating the chassis number');
      return;
    }
    
    if (showNonFifoNote && !nonFifoReason.trim()) {
      setNonFifoError(true);
      setSubmitError('Please provide a reason for selecting a newer chassis while older chassis are available');
      return;
    }

    const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    const oldestChassis = getOldestChassis();
    const isNonFifoSelection = selectedChassis && oldestChassis && selectedChassis.ageInDays !== oldestChassis.ageInDays;

    try {
      setSaving(true);
      
      // FIXED: Use the id from useParams() instead of booking._id
      let url = `/bookings/${id}/allocate`;
      const queryParams = [];
      
      if (isUpdate && reason) {
        queryParams.push(`reason=${encodeURIComponent(reason)}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const formData = new FormData();
      formData.append('chassisNumber', chassisNumber.trim());
      formData.append('is_deviation', false); // Default to false

      // Add note if non-FIFO selection
      if (isNonFifoSelection && nonFifoReason.trim()) {
        formData.append('note', nonFifoReason.trim());
      } else if (reason) {
        formData.append('note', reason);
      }
      
      // Add claim handling if needed in the future
      formData.append('hasClaim', 'false');

      const response = await axiosInstance.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const successMessage = isUpdate 
          ? 'Chassis number updated successfully!' 
          : 'Chassis number allocated successfully!';
        
        await showSuccess(successMessage);
        
        // Navigate back to all bookings
        navigate('/subdealer-all-bookings');
      } else {
        setSubmitError(response.data.message || 'Failed to save chassis number');
      }
      
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'allocating'} chassis number:`, error);
      
      // Extract error message
      let errorMessage = 'Failed to save chassis number';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      error.response.statusText;
        
        // Check for specific error message
        if (error.response.data?.message === "Vehicle not found in inventory") {
          errorMessage = `Vehicle ${chassisNumber} not found in inventory`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="form-container">
        <div className="title">Chassis Allocation</div>
        <CCard>
          <CCardBody>
            <CAlert color="danger">{error}</CAlert>
            <CButton 
              color="secondary" 
              onClick={() => navigate('/subdealer-all-bookings')}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to Bookings
            </CButton>
          </CCardBody>
        </CCard>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">
        {isUpdate ? 'Update Chassis Number' : 'Allocate Chassis Number'}
      </div>
      
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Booking Details</h5>
          <CButton 
            color="secondary" 
            size="sm"
            onClick={() => navigate('/subdealer-all-bookings')}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Back to Bookings
          </CButton>
        </CCardHeader>
        
        <CCardBody>
          {error && (
            <CAlert color="warning" className="mb-4">
              <CIcon icon={cilWarning} className="me-2" />
              {error}
            </CAlert>
          )}
          
          {submitError && (
            <CAlert color="danger" className="mb-4">
              <strong>Error:</strong> {submitError}
            </CAlert>
          )}
          
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={6}>
                <div className="mb-4">
                  <CFormLabel className="fw-bold">Booking Number</CFormLabel>
                  <div className="form-control bg-light">{booking?.bookingNumber || 'N/A'}</div>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-4">
                  <CFormLabel className="fw-bold">Customer Name</CFormLabel>
                  <div className="form-control bg-light">{booking?.customerDetails?.name || 'N/A'}</div>
                </div>
              </CCol>
            </CRow>
            
            <CRow>
              <CCol md={4}>
                <div className="mb-4">
                  <CFormLabel className="fw-bold">Model</CFormLabel>
                  <div className="form-control bg-light">{booking?.model?.model_name || booking?.model?.name || 'N/A'}</div>
                </div>
              </CCol>
              <CCol md={4}>
                <div className="mb-4">
                  <CFormLabel className="fw-bold">Color</CFormLabel>
                  <div className="form-control bg-light">{booking?.color?.name || 'N/A'}</div>
                </div>
              </CCol>
              <CCol md={4}>
                <div className="mb-4">
                  <CFormLabel className="fw-bold">Subdealer</CFormLabel>
                  <div className="form-control bg-light">{booking?.subdealer?.name || 'N/A'}</div>
                </div>
              </CCol>
            </CRow>
            
            {isUpdate && booking.chassisNumber && (
              <CRow>
                <CCol md={6}>
                  <div className="mb-4">
                    <CFormLabel className="fw-bold">Currently Allocated Chassis</CFormLabel>
                    <div className="form-control bg-light">{booking.chassisNumber}</div>
                  </div>
                </CCol>
              </CRow>
            )}
            
            <CRow>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel htmlFor="chassisNumber" className="fw-bold">
                    {isUpdate ? 'New Chassis Number' : 'Select Chassis Number'} <span className="text-danger">*</span>
                  </CFormLabel>
                  
                  {/* Show branch info if available */}
                  {!loadingChassisNumbers && availableChassisData.length > 0 && booking?.branch?.name && (
                    <div className="mb-2">
                      <small className="text-info">
                        <CIcon icon={cilLocationPin} className="me-1" />
                        Showing chassis numbers from {booking.branch.name} branch only
                      </small>
                    </div>
                  )}
                  
                  {loadingChassisNumbers ? (
                    <div className="text-center py-3">
                      <CSpinner size="sm" />
                      <span className="ms-2">Loading available chassis numbers...</span>
                    </div>
                  ) : availableChassisNumbers.length > 0 ? (
                    <CFormSelect 
                      id="chassisNumber"
                      value={chassisNumber} 
                      onChange={(e) => setChassisNumber(e.target.value)} 
                      required
                      disabled={saving}
                    >
                      <option value="">-- Select a chassis number --</option>
                      {availableChassisData.map((chassis) => (
                        <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
                          {getChassisDisplayText(chassis)}
                        </option>
                      ))}
                    </CFormSelect>
                  ) : (
                    <>
                      <CFormInput
                        type="text"
                        id="chassisNumber"
                        value={chassisNumber}
                        onChange={(e) => setChassisNumber(e.target.value)}
                        placeholder="Enter chassis number manually"
                        required
                        disabled={saving}
                      />
                      {!isUpdate && (
                        <div className="alert alert-warning mt-2">
                          <CIcon icon={cilWarning} className="me-2" />
                          No chassis numbers available in {booking?.branch?.name || 'your'} branch for this model and color combination.
                        </div>
                      )}
                    </>
                  )}
                  
                  {availableChassisData.length > 0 && (
                    <small className="text-muted d-block mt-1">
                      <CIcon icon={cilCheck} className="text-success me-1" />
                      {availableChassisData.length} chassis number(s) available for this model/color
                    </small>
                  )}
                </div>
              </CCol>
            </CRow>
            
            {showNonFifoNote && (
              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="nonFifoReason" className="fw-bold">
                      Reason for Non-FIFO Selection <span className="text-danger">*</span>
                    </CFormLabel>
                    <CFormTextarea
                      id="nonFifoReason"
                      value={nonFifoReason}
                      onChange={(e) => {
                        setNonFifoReason(e.target.value);
                        if (e.target.value.trim()) {
                          setNonFifoError(false);
                          setSubmitError('');
                        }
                      }}
                      required
                      rows={3}
                      placeholder="Please provide a valid reason for selecting a newer chassis while older chassis are available"
                      disabled={saving}
                      className={nonFifoError ? 'is-invalid' : ''}
                    />
                    {nonFifoError && (
                      <div className="invalid-feedback d-block">
                        Please provide a reason for non-FIFO selection
                      </div>
                    )}
                    <small className="text-warning">
                      Selecting a newer chassis while older ones are available requires justification.
                    </small>
                  </div>
                </CCol>
              </CRow>
            )}
            
            {isUpdate && (
              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="reason" className="fw-bold">
                      Reason for Update <span className="text-danger">*</span>
                    </CFormLabel>
                    <CFormTextarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      rows={3}
                      placeholder="Enter reason for changing the chassis number"
                      disabled={saving}
                    />
                  </div>
                </CCol>
              </CRow>
            )}
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton 
                type="button"
                color="secondary" 
                onClick={() => navigate('/subdealer-all-bookings')}
                disabled={saving}
              >
                Cancel
              </CButton>
              <CButton
                type="submit"
                color="primary"
                disabled={saving || (loadingChassisNumbers && availableChassisNumbers.length === 0)}
              >
                {saving ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {isUpdate ? 'Updating...' : 'Allocating...'}
                  </>
                ) : (
                  isUpdate ? 'Update Chassis Number' : 'Allocate Chassis Number'
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ChassisAllocation;