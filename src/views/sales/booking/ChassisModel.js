
// // import React, { useState, useEffect } from 'react';
// // import {
// //   CModal,
// //   CModalHeader,
// //   CModalBody,
// //   CModalFooter,
// //   CFormLabel,
// //   CButton,
// //   CFormSelect,
// //   CSpinner,
// //   CFormInput,
// //   CFormTextarea,
// //   CFormCheck
// // } from '@coreui/react';
// // import axiosInstance from '../../../axiosInstance';
// // import '../../../css/form.css';
// // import { showError } from '../../../utils/sweetAlerts';

// // const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
// //   const [chassisNumber, setChassisNumber] = useState('');
// //   const [reason, setReason] = useState('');
// //   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
// //   const [availableChassisData, setAvailableChassisData] = useState([]); 
// //   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
// //   const [hasClaim, setHasClaim] = useState(null);
// //   const [claimDetails, setClaimDetails] = useState({
// //     price: '',
// //     description: '',
// //     documents: []
// //   });
// //   const [documentPreviews, setDocumentPreviews] = useState([]);
// //   const [isDeviation, setIsDeviation] = useState('NO');
// //   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
// //   const [nonFifoReason, setNonFifoReason] = useState('');
// //   const [showReasonField, setShowReasonField] = useState(false);

// //   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';

// //   useEffect(() => {
// //     if (show) {
// //       setChassisNumber(booking?.chassisNumber || '');
// //       setReason('');
// //       setHasClaim(null);
// //       setClaimDetails({
// //         price: '',
// //         description: '',
// //         documents: []
// //       });
// //       setDocumentPreviews([]);
// //       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
// //       setShowNonFifoNote(false);
// //       setNonFifoReason('');
// //       setShowReasonField(false);
      
// //       if (booking) {
// //         fetchAvailableChassisNumbers();
// //       }
// //     }
// //   }, [show, booking]);
// //   useEffect(() => {
// //     if (chassisNumber && availableChassisData.length > 0) {
// //       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
// //       console.log('Selected Chassis:', selectedChassis);
// //       console.log('Booking ID:', booking?._id);
// //       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
// //       if (selectedChassis) {
// //         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;

// //         if (selectedChassis.status === 'booked') {
// //           console.log('Booked chassis - no note or reason field');
// //           setShowNonFifoNote(false);
// //           setShowReasonField(false);
// //           return;
// //         }

// //         if (selectedChassis.status === 'in_stock') {

// //           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
// //           console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
// //           if (hasCurrentChassisInList) {
// //             if (isCurrentChassis) {
// //               console.log('Current chassis selected - show note field only');
// //               setShowNonFifoNote(true);
// //               setShowReasonField(false);
// //             } else {
// //               console.log('Non-current chassis selected (current exists) - show BOTH fields');
// //               setShowNonFifoNote(true);
// //               setShowReasonField(true);
// //             }
// //           } else {
// //             console.log('No current chassis in list');
// //             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
// //             if (inStockChassis.length > 0) {
// //               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
// //               const oldestInStockChassis = sortedInStock[0];
              
// //               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
// //               setShowNonFifoNote(true);
// //               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
// //               console.log('Should show reason field?', shouldShowReason);
              
// //               setShowReasonField(shouldShowReason);
// //               if (!shouldShowReason) {
// //                 setNonFifoReason('');
// //               }
// //             }
// //           }
// //         } else {
// //           setShowNonFifoNote(false);
// //           setShowReasonField(false);
// //         }
// //       }
// //     } else {
// //       setShowNonFifoNote(false);
// //       setShowReasonField(false);
// //     }
// //   }, [chassisNumber, availableChassisData, booking]);

// //   const fetchAvailableChassisNumbers = async () => {
// //     try {
// //       setLoadingChassisNumbers(true);
// //       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
// //       const availableData = response.data.data.chassisNumbers || [];

// //       console.log('API Response:', availableData);
// //       const sortedData = [...availableData].sort((a, b) => b.ageInDays - a.ageInDays);
// //       setAvailableChassisData(sortedData);
// //       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
// //       setAvailableChassisNumbers(chassisNumberStrings);
// //       if (!isUpdate && sortedData.length > 0) {
// //         setChassisNumber(sortedData[0].chassisNumber);
// //       }

// //       if (isUpdate && booking.chassisNumber && !chassisNumberStrings.includes(booking.chassisNumber)) {
// //         setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
// //         const currentChassisData = {
// //           chassisNumber: booking.chassisNumber, 
// //           age: 'Current', 
// //           ageInDays: 0, 
// //           addedDate: 'Current',
// //           status: 'allocated',
// //           isBookedOrBlocked: false,
// //           eligibilityMessage: 'Current Allocation',
// //           allocatedBooking: booking._id
// //         };
        
// //         setAvailableChassisData((prev) => [currentChassisData, ...prev]);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching chassis numbers:', error);
// //       showError(error);
// //     } finally {
// //       setLoadingChassisNumbers(false);
// //     }
// //   };

// //   const handleDocumentUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     if (files.length + claimDetails.documents.length > 6) {
// //       showError('You can upload a maximum of 6 documents');
// //       return;
// //     }

// //     const newDocuments = [...claimDetails.documents, ...files];
// //     setClaimDetails({ ...claimDetails, documents: newDocuments });

// //     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
// //     imageFiles.forEach((file) => {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
// //       };
// //       reader.readAsDataURL(file);
// //     });
// //   };

// //   const removeDocument = (index) => {
// //     const newDocuments = [...claimDetails.documents];
// //     newDocuments.splice(index, 1);
// //     setClaimDetails({ ...claimDetails, documents: newDocuments });

// //     if (documentPreviews[index]) {
// //       const newPreviews = [...documentPreviews];
// //       newPreviews.splice(index, 1);
// //       setDocumentPreviews(newPreviews);
// //     }
// //   };

// //   const handleSubmit = () => {
// //     if (!chassisNumber.trim()) {
// //       showError('Please select a chassis number');
// //       return;
// //     }
// //     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);

// //     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
// //     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);

// //     if (showNonFifoNote && !nonFifoReason.trim()) {
// //       showError('Please enter a reason in the note field');
// //       return;
// //     }
// //     if (showReasonField && !reason.trim()) {
// //       showError('Please enter a reason for selecting this chassis');
// //       return;
// //     }
// //     if (isUpdate && !reason.trim()) {
// //       showError('Please enter a reason for updating');
// //       return;
// //     }
// //     if (selectedChassis && selectedChassis.status === 'in_stock') {
// //       if (hasCurrentChassisInList) {
// //         if (isCurrentChassis) {
// //           if (!nonFifoReason.trim()) {
// //             showError('Please enter a note for the current chassis');
// //             return;
// //           }
// //         } else {
// //           if (!nonFifoReason.trim()) {
// //             showError('Please enter a note for selecting this chassis');
// //             return;
// //           }
// //           if (!reason.trim()) {
// //             showError('Please enter a reason for selecting this chassis');
// //             return;
// //           }
// //         }
// //       } else {
// //         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
// //         if (inStockChassis.length > 0) {
// //           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
// //           const oldestInStockChassis = sortedInStock[0];
// //           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
// //             if (!nonFifoReason.trim()) {
// //               showError('Please enter a note for selecting this chassis');
// //               return;
// //             }
// //           } else {
// //             if (!nonFifoReason.trim()) {
// //               showError('Please enter a note for selecting this chassis');
// //               return;
// //             }
// //             if (!reason.trim()) {
// //               showError('Please enter a reason for selecting this chassis');
// //               return;
// //             }
// //           }
// //         }
// //       }
// //     }

// //     const payload = {
// //       chassisNumber: chassisNumber.trim(),
// //       ...(reason.trim() && { reason: reason.trim() }),
// //       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
// //       ...(hasClaim && {
// //         claimDetails: {
// //           price: claimDetails.price,
// //           description: claimDetails.description,
// //           documents: claimDetails.documents
// //         }
// //       }),
// //       ...(isCashPayment && { is_deviation: isDeviation })
// //     };

// //     console.log('Final Payload:', payload);

// //     onSave(payload);
// //   };

// //   const getChassisDisplayText = (chassis) => {
// //     const isCurrentChassis = chassis.allocatedBooking === booking?._id;
    
// //     if (isCurrentChassis) {
// //       return `${chassis.chassisNumber} (Current)`;
// //     }
    
// //     let displayText = chassis.chassisNumber;
// //     let ageText = '';
    
// //     if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
// //       const days = chassis.ageInDays;
// //       ageText = ` (${days} day${days !== 1 ? 's' : ''})`;
// //     }
// //     if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
// //       displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
// //     } else {
// //       displayText = `${chassis.chassisNumber}${ageText}`;
// //     }
    
// //     return displayText;
// //   };

// //   const handleCloseModal = () => {
// //     setHasClaim(null);
// //     setShowNonFifoNote(false);
// //     setShowReasonField(false);
// //     setNonFifoReason('');
// //     setClaimDetails({
// //       price: '',
// //       description: '',
// //       documents: []
// //     });
// //     setDocumentPreviews([]);
// //     onClose();
// //   };

// //   return (
// //     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
// //       <CModalHeader>
// //         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
// //       </CModalHeader>
// //       <CModalBody>
// //         {hasClaim === null ? (
// //           <div className="text-center">
// //             <h5>Is there any claim?</h5>
// //             <div className="d-flex justify-content-center mt-3">
// //               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
// //                 Yes
// //               </CButton>
// //               <CButton color="secondary" onClick={() => setHasClaim(false)}>
// //                 No
// //               </CButton>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="mb-3">
// //               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
// //             </div>
// //             <div className="mb-3">
// //               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
// //             </div>

// //             {isCashPayment && (
// //               <div
// //                 className="mb-3"
// //                 style={{
// //                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
// //                   padding: '12px',
// //                   borderRadius: '8px',
// //                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
// //                   transition: 'all 0.3s ease'
// //                 }}
// //               >
// //                 <CFormCheck
// //                   id="isDeviation"
// //                   label="Is Deviation?"
// //                   checked={isDeviation === 'YES'}
// //                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
// //                   style={{
// //                     fontWeight: '600',
// //                     fontSize: '1.1rem',
// //                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
// //                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
// //                   }}
// //                 />
// //               </div>
// //             )}

// //             <div className="mb-3">
// //               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
// //               {loadingChassisNumbers ? (
// //                 <div className="text-center">
// //                   <CSpinner size="sm" />
// //                   <span className="ms-2">Loading chassis numbers...</span>
// //                 </div>
// //               ) : availableChassisNumbers.length > 0 ? (
// //                 <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
// //                   <option value="">Select a chassis number</option>
// //                   {availableChassisData.map((chassis) => (
// //                     <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
// //                       {getChassisDisplayText(chassis)}
// //                     </option>
// //                   ))}
// //                 </CFormSelect>
// //               ) : (
// //                 <div className="text-danger">No chassis numbers available for this model and color combination</div>
// //               )}
// //             </div>
// //             {showNonFifoNote && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea 
// //                   id="nonFifoReason" 
// //                   value={nonFifoReason} 
// //                   onChange={(e) => setNonFifoReason(e.target.value)} 
// //                   required 
// //                   rows={3}
// //                 />
// //               </div>
// //             )}
// //             {showReasonField && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea 
// //                   id="reason" 
// //                   value={reason} 
// //                   onChange={(e) => setReason(e.target.value)} 
// //                   required 
// //                   rows={3}
// //                 />
// //               </div>
// //             )}
// //             {isUpdate && !showReasonField && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
// //               </div>
// //             )}

// //             {hasClaim && (
// //               <div className="mt-4 border-top pt-3">
// //                 <h5>Claim Details</h5>
// //                 <div className="mb-3">
// //                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
// //                   <CFormInput
// //                     type="number"
// //                     id="claimPrice"
// //                     value={claimDetails.price}
// //                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
// //                     placeholder="Enter claim amount"
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
// //                   <CFormTextarea
// //                     id="claimDescription"
// //                     value={claimDetails.description}
// //                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
// //                     placeholder="Enter claim description"
// //                     rows={3}
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <CFormLabel>Documents (Max 6)</CFormLabel>
// //                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
// //                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

// //                   {documentPreviews.length > 0 && (
// //                     <div className="mt-2">
// //                       <h6>Uploaded Documents:</h6>
// //                       <div className="d-flex flex-wrap gap-2">
// //                         {documentPreviews.map((doc, index) => (
// //                           <div key={index} className="position-relative" style={{ width: '100px' }}>
// //                             <img
// //                               src={doc.url}
// //                               alt={doc.name}
// //                               className="img-thumbnail"
// //                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
// //                             />
// //                             <button
// //                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
// //                               onClick={() => removeDocument(index)}
// //                               style={{ transform: 'translate(50%, -50%)' }}
// //                             >
// //                               ×
// //                             </button>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
// //                     <div className="mt-2">
// //                       <h6>Other Files:</h6>
// //                       <ul>
// //                         {claimDetails.documents
// //                           .filter((d) => !d.type.startsWith('image/'))
// //                           .map((doc, index) => (
// //                             <li key={index} className="d-flex align-items-center">
// //                               {doc.name}
// //                               <button
// //                                 className="btn btn-sm btn-danger ms-2"
// //                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
// //                               >
// //                                 ×
// //                               </button>
// //                             </li>
// //                           ))}
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </CModalBody>
// //       {hasClaim !== null && (
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
// //             Cancel
// //           </CButton>
// //           <CButton
// //             className='submit-button'
// //             onClick={handleSubmit}
// //             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
// //           >
// //             {isLoading ? 'Saving...' : 'Save'}
// //           </CButton>
// //         </CModalFooter>
// //       )}
// //     </CModal>
// //   );
// // };

// // export default ChassisNumberModal;



// // import React, { useState, useEffect } from 'react';
// // import {
// //   CModal,
// //   CModalHeader,
// //   CModalBody,
// //   CModalFooter,
// //   CFormLabel,
// //   CButton,
// //   CFormSelect,
// //   CSpinner,
// //   CFormInput,
// //   CFormTextarea,
// //   CFormCheck
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilLocationPin, cilWarning } from '@coreui/icons';
// // import axiosInstance from '../../../axiosInstance';
// // import '../../../css/form.css';
// // import { showError } from '../../../utils/sweetAlerts';

// // const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
// //   const [chassisNumber, setChassisNumber] = useState('');
// //   const [reason, setReason] = useState('');
// //   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
// //   const [availableChassisData, setAvailableChassisData] = useState([]); 
// //   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
// //   const [hasClaim, setHasClaim] = useState(null);
// //   const [claimDetails, setClaimDetails] = useState({
// //     price: '',
// //     description: '',
// //     documents: []
// //   });
// //   const [documentPreviews, setDocumentPreviews] = useState([]);
// //   const [isDeviation, setIsDeviation] = useState('NO');
// //   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
// //   const [nonFifoReason, setNonFifoReason] = useState('');
// //   const [showReasonField, setShowReasonField] = useState(false);

// //   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
// //   const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance'; 

// //   useEffect(() => {
// //     if (show) {
// //       setChassisNumber(booking?.chassisNumber || '');
// //       setReason('');
// //       setHasClaim(null);
// //       setClaimDetails({
// //         price: '',
// //         description: '',
// //         documents: []
// //       });
// //       setDocumentPreviews([]);
// //       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
// //       setShowNonFifoNote(false);
// //       setNonFifoReason('');
// //       setShowReasonField(false);
      
// //       if (booking) {
// //         fetchAvailableChassisNumbers();
// //       }
// //     }
// //   }, [show, booking]);

// //   useEffect(() => {
// //     if (chassisNumber && availableChassisData.length > 0) {
// //       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
// //       console.log('Selected Chassis:', selectedChassis);
// //       console.log('Booking ID:', booking?._id);
// //       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
// //       if (selectedChassis) {
// //         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
// //         if (selectedChassis.status === 'booked') {
// //           console.log('Booked chassis - no note or reason field');
// //           setShowNonFifoNote(false);
// //           setShowReasonField(false);
// //           return;
// //         }
        
// //         if (selectedChassis.status === 'in_stock') {
// //           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
// //           console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
// //           if (hasCurrentChassisInList) {
// //             if (isCurrentChassis) {
// //               console.log('Current chassis selected - show note field only');
// //               setShowNonFifoNote(true);
// //               setShowReasonField(false);
// //             } else {
// //               console.log('Non-current chassis selected (current exists) - show BOTH fields');
// //               setShowNonFifoNote(true);
// //               setShowReasonField(true);
// //             }
// //           } else {
// //             console.log('No current chassis in list');
            
// //             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
// //             if (inStockChassis.length > 0) {
// //               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
// //               const oldestInStockChassis = sortedInStock[0];
              
// //               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
// //               setShowNonFifoNote(true);
              
// //               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
// //               console.log('Should show reason field?', shouldShowReason);
              
// //               setShowReasonField(shouldShowReason);
              
// //               if (!shouldShowReason) {
// //                 setNonFifoReason('');
// //               }
// //             }
// //           }
// //         } else {
// //           setShowNonFifoNote(false);
// //           setShowReasonField(false);
// //         }
// //       }
// //     } else {
// //       setShowNonFifoNote(false);
// //       setShowReasonField(false);
// //     }
// //   }, [chassisNumber, availableChassisData, booking]);

// //   const fetchAvailableChassisNumbers = async () => {
// //     try {
// //       setLoadingChassisNumbers(true);
// //       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
// //       const availableData = response.data.data.chassisNumbers || [];

// //       console.log('API Response:', availableData);
      
// //       // Get the booking's branch ID
// //       const bookingBranchId = booking.branch?._id;
// //       console.log('Booking Branch ID:', bookingBranchId);

// //       // Filter chassis numbers to only show those from the same branch
// //       const filteredData = availableData.filter((chassis) => {
// //         // Check if location exists and has id, then compare with booking's branch ID
// //         const chassisBranchId = chassis.location?.id;
// //         const isSameBranch = chassisBranchId === bookingBranchId;
        
// //         console.log(`Chassis ${chassis.chassisNumber}:`, {
// //           chassisBranchId,
// //           bookingBranchId,
// //           isSameBranch
// //         });
        
// //         return isSameBranch;
// //       });

// //       console.log('Filtered Chassis Numbers (Same Branch):', filteredData);

// //       // Sort by ageInDays (descending) - oldest first (FIFO)
// //       const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);
      
// //       // Store the full data
// //       setAvailableChassisData(sortedData);

// //       // Extract just the chassis number strings from the objects
// //       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
// //       setAvailableChassisNumbers(chassisNumberStrings);

// //       // Auto-select the oldest chassis (FIFO) if not in update mode
// //       if (!isUpdate && sortedData.length > 0) {
// //         setChassisNumber(sortedData[0].chassisNumber);
// //       }

// //       // If in update mode and the current chassis is not in the filtered list,
// //       // we should still include it (it might be from a different branch or location)
// //       if (isUpdate && booking.chassisNumber) {
// //         // Check if current chassis is in the filtered list
// //         const currentChassisInFiltered = filteredData.some(
// //           (chassis) => chassis.chassisNumber === booking.chassisNumber
// //         );
        
// //         if (!currentChassisInFiltered) {
// //           // Add current chassis to the list
// //           setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
          
// //           // Also add current chassis to the data array for display
// //           const currentChassisData = {
// //             chassisNumber: booking.chassisNumber, 
// //             age: 'Current', 
// //             ageInDays: 0, 
// //             addedDate: 'Current',
// //             status: 'allocated',
// //             isBookedOrBlocked: false,
// //             eligibilityMessage: 'Current Allocation',
// //             allocatedBooking: booking._id,
// //             location: {
// //               id: booking.branch?._id,
// //               name: booking.branch?.name,
// //               type: 'branch'
// //             }
// //           };
          
// //           setAvailableChassisData((prev) => [currentChassisData, ...prev]);
// //         }
// //       }

// //       // Show a warning if no chassis numbers are available in the same branch
// //       if (filteredData.length === 0 && !isUpdate) {
// //         console.warn('No chassis numbers available in the same branch');
// //       }

// //     } catch (error) {
// //       console.error('Error fetching chassis numbers:', error);
// //       showError(error);
// //     } finally {
// //       setLoadingChassisNumbers(false);
// //     }
// //   };

// //   const getChassisDisplayText = (chassis) => {
// //     const isCurrentChassis = chassis.allocatedBooking === booking?._id;
    
// //     if (isCurrentChassis) {
// //       return `${chassis.chassisNumber} (Current)`;
// //     }
    
// //     let displayText = chassis.chassisNumber;
// //     let ageText = '';
// //     let locationText = '';

// //     // Add location info if available
// //     if (chassis.location?.name) {
// //       locationText = ` - ${chassis.location.name}`;
// //     }

// //     if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
// //       const days = chassis.ageInDays;
// //       ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
// //     } else if (locationText) {
// //       // If no age but has location, show just location
// //       ageText = locationText;
// //     }
    
// //     if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
// //       displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
// //     } else {
// //       displayText = `${chassis.chassisNumber}${ageText}`;
// //     }
    
// //     return displayText;
// //   };

// //   const handleDocumentUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     if (files.length + claimDetails.documents.length > 6) {
// //       showError('You can upload a maximum of 6 documents');
// //       return;
// //     }

// //     const newDocuments = [...claimDetails.documents, ...files];
// //     setClaimDetails({ ...claimDetails, documents: newDocuments });

// //     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
// //     imageFiles.forEach((file) => {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
// //       };
// //       reader.readAsDataURL(file);
// //     });
// //   };

// //   const removeDocument = (index) => {
// //     const newDocuments = [...claimDetails.documents];
// //     newDocuments.splice(index, 1);
// //     setClaimDetails({ ...claimDetails, documents: newDocuments });

// //     if (documentPreviews[index]) {
// //       const newPreviews = [...documentPreviews];
// //       newPreviews.splice(index, 1);
// //       setDocumentPreviews(newPreviews);
// //     }
// //   };

// //   const handleSubmit = () => {
// //     if (!chassisNumber.trim()) {
// //       showError('Please select a chassis number');
// //       return;
// //     }
    
// //     // Get selected chassis
// //     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    
// //     // Check if it's current chassis (allocatedBooking matches bookingId)
// //     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
    
// //     // Check if there's any current chassis in the ENTIRE list
// //     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
    
// //     // Validate note field (always required when shown)
// //     if (showNonFifoNote && !nonFifoReason.trim()) {
// //       showError('Please enter a reason in the note field');
// //       return;
// //     }
    
// //     // Validate reason param field (when shown)
// //     if (showReasonField && !reason.trim()) {
// //       showError('Please enter a reason for selecting this chassis');
// //       return;
// //     }
    
// //     // In update mode, always require update reason
// //     if (isUpdate && !reason.trim()) {
// //       showError('Please enter a reason for updating');
// //       return;
// //     }
    
// //     // Additional validation based on scenario
// //     if (selectedChassis && selectedChassis.status === 'in_stock') {
// //       // Scenario 1: When there is current chassis in list
// //       if (hasCurrentChassisInList) {
// //         if (isCurrentChassis) {
// //           // Current chassis: requires note only
// //           if (!nonFifoReason.trim()) {
// //             showError('Please enter a note for the current chassis');
// //             return;
// //           }
// //         } else {
// //           // Non-current chassis (after current): requires both note AND reason
// //           if (!nonFifoReason.trim()) {
// //             showError('Please enter a note for selecting this chassis');
// //             return;
// //           }
// //           if (!reason.trim()) {
// //             showError('Please enter a reason for selecting this chassis');
// //             return;
// //           }
// //         }
// //       } else {
// //         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
// //         if (inStockChassis.length > 0) {
// //           // Sort to find the oldest
// //           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
// //           const oldestInStockChassis = sortedInStock[0];
          
// //           // Oldest chassis: requires note only
// //           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
// //             if (!nonFifoReason.trim()) {
// //               showError('Please enter a note for selecting this chassis');
// //               return;
// //             }
// //           } else {
// //             // Non-oldest chassis: requires both note AND reason
// //             if (!nonFifoReason.trim()) {
// //               showError('Please enter a note for selecting this chassis');
// //               return;
// //             }
// //             if (!reason.trim()) {
// //               showError('Please enter a reason for selecting this chassis');
// //               return;
// //             }
// //           }
// //         }
// //       }
// //     }

// //     const payload = {
// //       chassisNumber: chassisNumber.trim(),
// //       ...(reason.trim() && { reason: reason.trim() }), 
// //       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
// //       ...(hasClaim && {
// //         claimDetails: {
// //           price: claimDetails.price,
// //           description: claimDetails.description,
// //           documents: claimDetails.documents
// //         }
// //       }),
// //       ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation })
// //     };

// //     console.log('Final Payload:', payload);

// //     onSave(payload);
// //   };

// //   const handleCloseModal = () => {
// //     // Reset form state
// //     setHasClaim(null);
// //     setShowNonFifoNote(false);
// //     setShowReasonField(false);
// //     setNonFifoReason('');
// //     setClaimDetails({
// //       price: '',
// //       description: '',
// //       documents: []
// //     });
// //     setDocumentPreviews([]);
// //     onClose();
// //   };

// //   return (
// //     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
// //       <CModalHeader>
// //         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
// //       </CModalHeader>
// //       <CModalBody>
// //         {hasClaim === null ? (
// //           <div className="text-center">
// //             <h5>Is there any claim?</h5>
// //             <div className="d-flex justify-content-center mt-3">
// //               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
// //                 Yes
// //               </CButton>
// //               <CButton color="secondary" onClick={() => setHasClaim(false)}>
// //                 No
// //               </CButton>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="mb-3">
// //               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
// //             </div>
// //             <div className="mb-3">
// //               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
// //             </div>

// //             {/* Show is_deviation field for both CASH and FINANCE payment types */}
// //             {(isCashPayment || isFinanceBooking) && (
// //               <div
// //                 className="mb-3"
// //                 style={{
// //                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
// //                   padding: '12px',
// //                   borderRadius: '8px',
// //                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
// //                   transition: 'all 0.3s ease'
// //                 }}
// //               >
// //                 <CFormCheck
// //                   id="isDeviation"
// //                   label="Is Deviation?"
// //                   checked={isDeviation === 'YES'}
// //                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
// //                   style={{
// //                     fontWeight: '600',
// //                     fontSize: '1.1rem',
// //                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
// //                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
// //                   }}
// //                 />
// //               </div>
// //             )}

// //             <div className="mb-3">
// //               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              
// //               {/* Show branch info */}
// //               {!loadingChassisNumbers && availableChassisNumbers.length > 0 && (
// //                 <div className="mb-2">
// //                   <small className="text-info">
// //                     <CIcon icon={cilLocationPin} className="me-1" />
// //                     Showing chassis numbers from {booking.branch?.name} branch only
// //                   </small>
// //                 </div>
// //               )}
              
// //               {loadingChassisNumbers ? (
// //                 <div className="text-center">
// //                   <CSpinner size="sm" />
// //                   <span className="ms-2">Loading chassis numbers...</span>
// //                 </div>
// //               ) : availableChassisNumbers.length > 0 ? (
// //                 <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
// //                   <option value="">Select a chassis number</option>
// //                   {availableChassisData.map((chassis) => (
// //                     <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
// //                       {getChassisDisplayText(chassis)}
// //                     </option>
// //                   ))}
// //                 </CFormSelect>
// //               ) : (
// //                 <>
// //                   <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
// //                   {!isUpdate && (
// //                     <div className="alert alert-warning mt-2">
// //                       <CIcon icon={cilWarning} className="me-2" />
// //                       No chassis numbers available in {booking.branch?.name} branch for this model and color combination.
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </div>

// //             {/* Non-FIFO Selection Note */}
// //             {showNonFifoNote && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea 
// //                   id="nonFifoReason" 
// //                   value={nonFifoReason} 
// //                   onChange={(e) => setNonFifoReason(e.target.value)} 
// //                   required 
// //                   rows={3}
// //                 />
// //               </div>
// //             )}

// //             {/* Reason Field (param) - Show only for certain conditions */}
// //             {showReasonField && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea 
// //                   id="reason" 
// //                   value={reason} 
// //                   onChange={(e) => setReason(e.target.value)} 
// //                   required 
// //                   rows={3}
// //                 />
// //               </div>
// //             )}

// //             {/* Update Reason Field (only for update mode and not shown above) */}
// //             {isUpdate && !showReasonField && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
// //               </div>
// //             )}

// //             {hasClaim && (
// //               <div className="mt-4 border-top pt-3">
// //                 <h5>Claim Details</h5>
// //                 <div className="mb-3">
// //                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
// //                   <CFormInput
// //                     type="number"
// //                     id="claimPrice"
// //                     value={claimDetails.price}
// //                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
// //                     placeholder="Enter claim amount"
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
// //                   <CFormTextarea
// //                     id="claimDescription"
// //                     value={claimDetails.description}
// //                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
// //                     placeholder="Enter claim description"
// //                     rows={3}
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <CFormLabel>Documents (Max 6)</CFormLabel>
// //                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
// //                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

// //                   {documentPreviews.length > 0 && (
// //                     <div className="mt-2">
// //                       <h6>Uploaded Documents:</h6>
// //                       <div className="d-flex flex-wrap gap-2">
// //                         {documentPreviews.map((doc, index) => (
// //                           <div key={index} className="position-relative" style={{ width: '100px' }}>
// //                             <img
// //                               src={doc.url}
// //                               alt={doc.name}
// //                               className="img-thumbnail"
// //                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
// //                             />
// //                             <button
// //                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
// //                               onClick={() => removeDocument(index)}
// //                               style={{ transform: 'translate(50%, -50%)' }}
// //                             >
// //                               ×
// //                             </button>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
// //                     <div className="mt-2">
// //                       <h6>Other Files:</h6>
// //                       <ul>
// //                         {claimDetails.documents
// //                           .filter((d) => !d.type.startsWith('image/'))
// //                           .map((doc, index) => (
// //                             <li key={index} className="d-flex align-items-center">
// //                               {doc.name}
// //                               <button
// //                                 className="btn btn-sm btn-danger ms-2"
// //                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
// //                               >
// //                                 ×
// //                               </button>
// //                             </li>
// //                           ))}
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </CModalBody>
// //       {hasClaim !== null && (
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
// //             Cancel
// //           </CButton>
// //           <CButton
// //             className='submit-button'
// //             onClick={handleSubmit}
// //             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
// //           >
// //             {isLoading ? 'Saving...' : 'Save'}
// //           </CButton>
// //         </CModalFooter>
// //       )}
// //     </CModal>
// //   );
// // };

// // export default ChassisNumberModal;






// // import React, { useState, useEffect } from 'react';
// // import {
// //   CModal,
// //   CModalHeader,
// //   CModalBody,
// //   CModalFooter,
// //   CFormLabel,
// //   CButton,
// //   CFormSelect,
// //   CSpinner,
// //   CFormInput,
// //   CFormTextarea,
// //   CFormCheck
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilLocationPin, cilWarning } from '@coreui/icons';
// // import axiosInstance from '../../../axiosInstance';
// // import '../../../css/form.css';
// // import { showError } from '../../../utils/sweetAlerts';

// // const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
// //   const [chassisNumber, setChassisNumber] = useState('');
// //   const [reason, setReason] = useState('');
// //   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
// //   const [availableChassisData, setAvailableChassisData] = useState([]); 
// //   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
// //   const [hasClaim, setHasClaim] = useState(null);
// //   const [claimDetails, setClaimDetails] = useState({
// //     price: '',
// //     description: '',
// //     documents: []
// //   });
// //   const [documentPreviews, setDocumentPreviews] = useState([]);
// //   const [isDeviation, setIsDeviation] = useState('NO');
// //   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
// //   const [nonFifoReason, setNonFifoReason] = useState('');
// //   const [showReasonField, setShowReasonField] = useState(false);
// //   const [nonFifoError, setNonFifoError] = useState(false); // ADDED: Error state for note field

// //   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
// //   const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance'; 

// //   useEffect(() => {
// //     if (show) {
// //       setChassisNumber(booking?.chassisNumber || '');
// //       setReason('');
// //       setHasClaim(null);
// //       setClaimDetails({
// //         price: '',
// //         description: '',
// //         documents: []
// //       });
// //       setDocumentPreviews([]);
// //       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
// //       setShowNonFifoNote(false);
// //       setNonFifoReason('');
// //       setShowReasonField(false);
// //       setNonFifoError(false); // ADDED: Reset error state
      
// //       if (booking) {
// //         fetchAvailableChassisNumbers();
// //       }
// //     }
// //   }, [show, booking]);

// //   useEffect(() => {
// //     if (chassisNumber && availableChassisData.length > 0) {
// //       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
// //       console.log('Selected Chassis:', selectedChassis);
// //       console.log('Booking ID:', booking?._id);
// //       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
// //       if (selectedChassis) {
// //         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
// //         if (selectedChassis.status === 'booked') {
// //           console.log('Booked chassis - no note or reason field');
// //           setShowNonFifoNote(false);
// //           setShowReasonField(false);
// //           return;
// //         }
        
// //         if (selectedChassis.status === 'in_stock') {
// //           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
// //           console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
// //           if (hasCurrentChassisInList) {
// //             if (isCurrentChassis) {
// //               console.log('Current chassis selected - show note field only');
// //               setShowNonFifoNote(true);
// //               setShowReasonField(false);
// //             } else {
// //               console.log('Non-current chassis selected (current exists) - show BOTH fields');
// //               setShowNonFifoNote(true);
// //               setShowReasonField(true);
// //             }
// //           } else {
// //             console.log('No current chassis in list');
            
// //             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
// //             if (inStockChassis.length > 0) {
// //               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
// //               const oldestInStockChassis = sortedInStock[0];
              
// //               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
// //               setShowNonFifoNote(true);
              
// //               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
// //               console.log('Should show reason field?', shouldShowReason);
              
// //               setShowReasonField(shouldShowReason);
              
// //               if (!shouldShowReason) {
// //                 setNonFifoReason('');
// //               }
// //             }
// //           }
// //         } else {
// //           setShowNonFifoNote(false);
// //           setShowReasonField(false);
// //         }
// //       }
// //     } else {
// //       setShowNonFifoNote(false);
// //       setShowReasonField(false);
// //     }
// //   }, [chassisNumber, availableChassisData, booking]);

// //   const fetchAvailableChassisNumbers = async () => {
// //     try {
// //       setLoadingChassisNumbers(true);
// //       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
// //       const availableData = response.data.data.chassisNumbers || [];

// //       console.log('API Response:', availableData);
      
// //       // Get the booking's branch ID
// //       const bookingBranchId = booking.branch?._id;
// //       console.log('Booking Branch ID:', bookingBranchId);

// //       // Filter chassis numbers to only show those from the same branch
// //       const filteredData = availableData.filter((chassis) => {
// //         // Check if location exists and has id, then compare with booking's branch ID
// //         const chassisBranchId = chassis.location?.id;
// //         const isSameBranch = chassisBranchId === bookingBranchId;
        
// //         console.log(`Chassis ${chassis.chassisNumber}:`, {
// //           chassisBranchId,
// //           bookingBranchId,
// //           isSameBranch
// //         });
        
// //         return isSameBranch;
// //       });

// //       console.log('Filtered Chassis Numbers (Same Branch):', filteredData);

// //       // Sort by ageInDays (descending) - oldest first (FIFO)
// //       const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);
      
// //       // Store the full data
// //       setAvailableChassisData(sortedData);

// //       // Extract just the chassis number strings from the objects
// //       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
// //       setAvailableChassisNumbers(chassisNumberStrings);

// //       // Auto-select the oldest chassis (FIFO) if not in update mode
// //       if (!isUpdate && sortedData.length > 0) {
// //         setChassisNumber(sortedData[0].chassisNumber);
// //       }

// //       // If in update mode and the current chassis is not in the filtered list,
// //       // we should still include it (it might be from a different branch or location)
// //       if (isUpdate && booking.chassisNumber) {
// //         // Check if current chassis is in the filtered list
// //         const currentChassisInFiltered = filteredData.some(
// //           (chassis) => chassis.chassisNumber === booking.chassisNumber
// //         );
        
// //         if (!currentChassisInFiltered) {
// //           // Add current chassis to the list
// //           setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
          
// //           // Also add current chassis to the data array for display
// //           const currentChassisData = {
// //             chassisNumber: booking.chassisNumber, 
// //             age: 'Current', 
// //             ageInDays: 0, 
// //             addedDate: 'Current',
// //             status: 'allocated',
// //             isBookedOrBlocked: false,
// //             eligibilityMessage: 'Current Allocation',
// //             allocatedBooking: booking._id,
// //             location: {
// //               id: booking.branch?._id,
// //               name: booking.branch?.name,
// //               type: 'branch'
// //             }
// //           };
          
// //           setAvailableChassisData((prev) => [currentChassisData, ...prev]);
// //         }
// //       }

// //       // Show a warning if no chassis numbers are available in the same branch
// //       if (filteredData.length === 0 && !isUpdate) {
// //         console.warn('No chassis numbers available in the same branch');
// //       }

// //     } catch (error) {
// //       console.error('Error fetching chassis numbers:', error);
// //       showError(error);
// //     } finally {
// //       setLoadingChassisNumbers(false);
// //     }
// //   };

// //   const getChassisDisplayText = (chassis) => {
// //     const isCurrentChassis = chassis.allocatedBooking === booking?._id;
    
// //     if (isCurrentChassis) {
// //       return `${chassis.chassisNumber} (Current)`;
// //     }
    
// //     let displayText = chassis.chassisNumber;
// //     let ageText = '';
// //     let locationText = '';

// //     // Add location info if available
// //     if (chassis.location?.name) {
// //       locationText = ` - ${chassis.location.name}`;
// //     }

// //     if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
// //       const days = chassis.ageInDays;
// //       ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
// //     } else if (locationText) {
// //       // If no age but has location, show just location
// //       ageText = locationText;
// //     }
    
// //     if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
// //       displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
// //     } else {
// //       displayText = `${chassis.chassisNumber}${ageText}`;
// //     }
    
// //     return displayText;
// //   };

// //   const handleDocumentUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     if (files.length + claimDetails.documents.length > 6) {
// //       showError('You can upload a maximum of 6 documents');
// //       return;
// //     }

// //     const newDocuments = [...claimDetails.documents, ...files];
// //     setClaimDetails({ ...claimDetails, documents: newDocuments });

// //     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
// //     imageFiles.forEach((file) => {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
// //       };
// //       reader.readAsDataURL(file);
// //     });
// //   };

// //   const removeDocument = (index) => {
// //     const newDocuments = [...claimDetails.documents];
// //     newDocuments.splice(index, 1);
// //     setClaimDetails({ ...claimDetails, documents: newDocuments });

// //     if (documentPreviews[index]) {
// //       const newPreviews = [...documentPreviews];
// //       newPreviews.splice(index, 1);
// //       setDocumentPreviews(newPreviews);
// //     }
// //   };

// //   const handleSubmit = () => {
// //     if (!chassisNumber.trim()) {
// //       showError('Please select a chassis number');
// //       return;
// //     }
    
// //     // Check note field when it's visible
// //     if (showNonFifoNote && (!nonFifoReason || !nonFifoReason.trim())) {
// //       setNonFifoError(true); // Set error state
// //       showError('Please enter note'); // Also show toast
// //       return;
// //     } else {
// //       setNonFifoError(false); // Clear error if note is filled
// //     }
    
// //     // Get selected chassis
// //     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    
// //     // Check if it's current chassis (allocatedBooking matches bookingId)
// //     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
    
// //     // Check if there's any current chassis in the ENTIRE list
// //     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
    
// //     // Validate reason param field (when shown)
// //     if (showReasonField && !reason.trim()) {
// //       showError('Please enter a reason for selecting this chassis');
// //       return;
// //     }
    
// //     // In update mode, always require update reason
// //     if (isUpdate && !reason.trim()) {
// //       showError('Please enter a reason for updating');
// //       return;
// //     }
    
// //     // Additional validation based on scenario
// //     if (selectedChassis && selectedChassis.status === 'in_stock') {
// //       // Scenario 1: When there is current chassis in list
// //       if (hasCurrentChassisInList) {
// //         if (isCurrentChassis) {
// //           // Current chassis: requires note only
// //           if (!nonFifoReason.trim()) {
// //             setNonFifoError(true);
// //             showError('Please enter note');
// //             return;
// //           }
// //         } else {
// //           // Non-current chassis (after current): requires both note AND reason
// //           if (!nonFifoReason.trim()) {
// //             setNonFifoError(true);
// //             showError('Please enter note');
// //             return;
// //           }
// //           if (!reason.trim()) {
// //             showError('Please enter a reason for selecting this chassis');
// //             return;
// //           }
// //         }
// //       } else {
// //         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
// //         if (inStockChassis.length > 0) {
// //           // Sort to find the oldest
// //           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
// //           const oldestInStockChassis = sortedInStock[0];
          
// //           // Oldest chassis: requires note only
// //           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
// //             if (!nonFifoReason.trim()) {
// //               setNonFifoError(true);
// //               showError('Please enter note');
// //               return;
// //             }
// //           } else {
// //             // Non-oldest chassis: requires both note AND reason
// //             if (!nonFifoReason.trim()) {
// //               setNonFifoError(true);
// //               showError('Please enter note');
// //               return;
// //             }
// //             if (!reason.trim()) {
// //               showError('Please enter a reason for selecting this chassis');
// //               return;
// //             }
// //           }
// //         }
// //       }
// //     }

// //     const payload = {
// //       chassisNumber: chassisNumber.trim(),
// //       ...(reason.trim() && { reason: reason.trim() }), 
// //       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
// //       ...(hasClaim && {
// //         claimDetails: {
// //           price: claimDetails.price,
// //           description: claimDetails.description,
// //           documents: claimDetails.documents
// //         }
// //       }),
// //       ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation })
// //     };

// //     console.log('Final Payload:', payload);

// //     onSave(payload);
// //   };

// //   const handleCloseModal = () => {
// //     // Reset form state
// //     setHasClaim(null);
// //     setShowNonFifoNote(false);
// //     setShowReasonField(false);
// //     setNonFifoReason('');
// //     setNonFifoError(false); // ADDED: Clear error
// //     setClaimDetails({
// //       price: '',
// //       description: '',
// //       documents: []
// //     });
// //     setDocumentPreviews([]);
// //     onClose();
// //   };

// //   return (
// //     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
// //       <CModalHeader>
// //         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
// //       </CModalHeader>
// //       <CModalBody>
// //         {hasClaim === null ? (
// //           <div className="text-center">
// //             <h5>Is there any claim?</h5>
// //             <div className="d-flex justify-content-center mt-3">
// //               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
// //                 Yes
// //               </CButton>
// //               <CButton color="secondary" onClick={() => setHasClaim(false)}>
// //                 No
// //               </CButton>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="mb-3">
// //               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
// //             </div>
// //             <div className="mb-3">
// //               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
// //             </div>

// //             {/* Show is_deviation field for both CASH and FINANCE payment types */}
// //             {(isCashPayment || isFinanceBooking) && (
// //               <div
// //                 className="mb-3"
// //                 style={{
// //                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
// //                   padding: '12px',
// //                   borderRadius: '8px',
// //                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
// //                   transition: 'all 0.3s ease'
// //                 }}
// //               >
// //                 <CFormCheck
// //                   id="isDeviation"
// //                   label="Is Deviation?"
// //                   checked={isDeviation === 'YES'}
// //                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
// //                   style={{
// //                     fontWeight: '600',
// //                     fontSize: '1.1rem',
// //                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
// //                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
// //                   }}
// //                 />
// //               </div>
// //             )}

// //             <div className="mb-3">
// //               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              
// //               {/* Show branch info */}
// //               {!loadingChassisNumbers && availableChassisNumbers.length > 0 && (
// //                 <div className="mb-2">
// //                   <small className="text-info">
// //                     <CIcon icon={cilLocationPin} className="me-1" />
// //                     Showing chassis numbers from {booking.branch?.name} branch only
// //                   </small>
// //                 </div>
// //               )}
              
// //               {loadingChassisNumbers ? (
// //                 <div className="text-center">
// //                   <CSpinner size="sm" />
// //                   <span className="ms-2">Loading chassis numbers...</span>
// //                 </div>
// //               ) : availableChassisNumbers.length > 0 ? (
// //                 <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
// //                   <option value="">Select a chassis number</option>
// //                   {availableChassisData.map((chassis) => (
// //                     <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
// //                       {getChassisDisplayText(chassis)}
// //                     </option>
// //                   ))}
// //                 </CFormSelect>
// //               ) : (
// //                 <>
// //                   <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
// //                   {!isUpdate && (
// //                     <div className="alert alert-warning mt-2">
// //                       <CIcon icon={cilWarning} className="me-2" />
// //                       No chassis numbers available in {booking.branch?.name} branch for this model and color combination.
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </div>

// //             {/* Non-FIFO Selection Note */}
// //             {showNonFifoNote && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea 
// //                   id="nonFifoReason" 
// //                   value={nonFifoReason} 
// //                   onChange={(e) => {
// //                     setNonFifoReason(e.target.value);
// //                     if (e.target.value.trim()) {
// //                       setNonFifoError(false); // Clear error when user types
// //                     }
// //                   }} 
// //                   required 
// //                   rows={3}
// //                 />
// //                 {/* ADDED: Error message below note field */}
// //                 {nonFifoError && (
// //                   <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
// //                     Please enter note
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Reason Field (param) - Show only for certain conditions */}
// //             {showReasonField && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea 
// //                   id="reason" 
// //                   value={reason} 
// //                   onChange={(e) => setReason(e.target.value)} 
// //                   required 
// //                   rows={3}
// //                 />
// //               </div>
// //             )}

// //             {/* Update Reason Field (only for update mode and not shown above) */}
// //             {isUpdate && !showReasonField && (
// //               <div className="mb-3">
// //                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
// //                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
// //               </div>
// //             )}

// //             {hasClaim && (
// //               <div className="mt-4 border-top pt-3">
// //                 <h5>Claim Details</h5>
// //                 <div className="mb-3">
// //                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
// //                   <CFormInput
// //                     type="number"
// //                     id="claimPrice"
// //                     value={claimDetails.price}
// //                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
// //                     placeholder="Enter claim amount"
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
// //                   <CFormTextarea
// //                     id="claimDescription"
// //                     value={claimDetails.description}
// //                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
// //                     placeholder="Enter claim description"
// //                     rows={3}
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <CFormLabel>Documents (Max 6)</CFormLabel>
// //                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
// //                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

// //                   {documentPreviews.length > 0 && (
// //                     <div className="mt-2">
// //                       <h6>Uploaded Documents:</h6>
// //                       <div className="d-flex flex-wrap gap-2">
// //                         {documentPreviews.map((doc, index) => (
// //                           <div key={index} className="position-relative" style={{ width: '100px' }}>
// //                             <img
// //                               src={doc.url}
// //                               alt={doc.name}
// //                               className="img-thumbnail"
// //                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
// //                             />
// //                             <button
// //                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
// //                               onClick={() => removeDocument(index)}
// //                               style={{ transform: 'translate(50%, -50%)' }}
// //                             >
// //                               ×
// //                             </button>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
// //                     <div className="mt-2">
// //                       <h6>Other Files:</h6>
// //                       <ul>
// //                         {claimDetails.documents
// //                           .filter((d) => !d.type.startsWith('image/'))
// //                           .map((doc, index) => (
// //                             <li key={index} className="d-flex align-items-center">
// //                               {doc.name}
// //                               <button
// //                                 className="btn btn-sm btn-danger ms-2"
// //                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
// //                               >
// //                                 ×
// //                               </button>
// //                             </li>
// //                           ))}
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </CModalBody>
// //       {hasClaim !== null && (
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
// //             Cancel
// //           </CButton>
// //           <CButton
// //             className='submit-button'
// //             onClick={handleSubmit}
// //             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
// //           >
// //             {isLoading ? 'Saving...' : 'Save'}
// //           </CButton>
// //         </CModalFooter>
// //       )}
// //     </CModal>
// //   );
// // };

// // export default ChassisNumberModal;







// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CButton,
//   CFormSelect,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CFormCheck,
//   CAlert,
//   CCloseButton
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLocationPin, cilWarning } from '@coreui/icons';
// import axiosInstance from '../../../axiosInstance';
// import '../../../css/form.css';

// const ChassisNumberModal = ({ 
//   show, 
//   onClose, 
//   onSave, 
//   isLoading, 
//   booking, 
//   isUpdate = false,
//   errorMessage = '',
//   onClearError = () => {}
// }) => {
//   const [chassisNumber, setChassisNumber] = useState('');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]); 
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);
//   const [isDeviation, setIsDeviation] = useState('NO');
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');
//   const [showReasonField, setShowReasonField] = useState(false);
//   const [nonFifoError, setNonFifoError] = useState(false);

//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
//   const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance'; 

//   useEffect(() => {
//     if (show) {
//       setChassisNumber(booking?.chassisNumber || '');
//       setReason('');
//       setHasClaim(null);
//       setClaimDetails({
//         price: '',
//         description: '',
//         documents: []
//       });
//       setDocumentPreviews([]);
//       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
//       setShowNonFifoNote(false);
//       setNonFifoReason('');
//       setShowReasonField(false);
//       setNonFifoError(false);
      
//       if (booking) {
//         fetchAvailableChassisNumbers();
//       }
//     }
//   }, [show, booking]);

//   // Auto-clear error after 10 seconds
//   useEffect(() => {
//     if (errorMessage && show) {
//       const timer = setTimeout(() => {
//         onClearError();
//       }, 10000); // 10 seconds
      
//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage, show, onClearError]);

//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
//       console.log('Selected Chassis:', selectedChassis);
//       console.log('Booking ID:', booking?._id);
//       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
//       if (selectedChassis) {
//         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
//         if (selectedChassis.status === 'booked') {
//           console.log('Booked chassis - no note or reason field');
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//           return;
//         }
        
//         if (selectedChassis.status === 'in_stock') {
//           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
//           console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
//           if (hasCurrentChassisInList) {
//             if (isCurrentChassis) {
//               console.log('Current chassis selected - show note field only');
//               setShowNonFifoNote(true);
//               setShowReasonField(false);
//             } else {
//               console.log('Non-current chassis selected (current exists) - show BOTH fields');
//               setShowNonFifoNote(true);
//               setShowReasonField(true);
//             }
//           } else {
//             console.log('No current chassis in list');
            
//             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
//             if (inStockChassis.length > 0) {
//               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//               const oldestInStockChassis = sortedInStock[0];
              
//               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
//               setShowNonFifoNote(true);
              
//               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
//               console.log('Should show reason field?', shouldShowReason);
              
//               setShowReasonField(shouldShowReason);
              
//               if (!shouldShowReason) {
//                 setNonFifoReason('');
//               }
//             }
//           }
//         } else {
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//         }
//       }
//     } else {
//       setShowNonFifoNote(false);
//       setShowReasonField(false);
//     }
//   }, [chassisNumber, availableChassisData, booking]);

//   const fetchAvailableChassisNumbers = async () => {
//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       console.log('API Response:', availableData);
      
//       // Get the booking's branch ID
//       const bookingBranchId = booking.branch?._id;
//       console.log('Booking Branch ID:', bookingBranchId);

//       // Filter chassis numbers to only show those from the same branch
//       const filteredData = availableData.filter((chassis) => {
//         // Check if location exists and has id, then compare with booking's branch ID
//         const chassisBranchId = chassis.location?.id;
//         const isSameBranch = chassisBranchId === bookingBranchId;
        
//         console.log(`Chassis ${chassis.chassisNumber}:`, {
//           chassisBranchId,
//           bookingBranchId,
//           isSameBranch
//         });
        
//         return isSameBranch;
//       });

//       console.log('Filtered Chassis Numbers (Same Branch):', filteredData);

//       // Sort by ageInDays (descending) - oldest first (FIFO)
//       const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);
      
//       // Store the full data
//       setAvailableChassisData(sortedData);

//       // Extract just the chassis number strings from the objects
//       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

//       // Auto-select the oldest chassis (FIFO) if not in update mode
//       if (!isUpdate && sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }

//       // If in update mode and the current chassis is not in the filtered list,
//       // we should still include it (it might be from a different branch or location)
//       if (isUpdate && booking.chassisNumber) {
//         // Check if current chassis is in the filtered list
//         const currentChassisInFiltered = filteredData.some(
//           (chassis) => chassis.chassisNumber === booking.chassisNumber
//         );
        
//         if (!currentChassisInFiltered) {
//           // Add current chassis to the list
//           setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
          
//           // Also add current chassis to the data array for display
//           const currentChassisData = {
//             chassisNumber: booking.chassisNumber, 
//             age: 'Current', 
//             ageInDays: 0, 
//             addedDate: 'Current',
//             status: 'allocated',
//             isBookedOrBlocked: false,
//             eligibilityMessage: 'Current Allocation',
//             allocatedBooking: booking._id,
//             location: {
//               id: booking.branch?._id,
//               name: booking.branch?.name,
//               type: 'branch'
//             }
//           };
          
//           setAvailableChassisData((prev) => [currentChassisData, ...prev]);
//         }
//       }

//       // Show a warning if no chassis numbers are available in the same branch
//       if (filteredData.length === 0 && !isUpdate) {
//         console.warn('No chassis numbers available in the same branch');
//       }

//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   const getChassisDisplayText = (chassis) => {
//     const isCurrentChassis = chassis.allocatedBooking === booking?._id;
    
//     if (isCurrentChassis) {
//       return `${chassis.chassisNumber} (Current)`;
//     }
    
//     let displayText = chassis.chassisNumber;
//     let ageText = '';
//     let locationText = '';

//     // Add location info if available
//     if (chassis.location?.name) {
//       locationText = ` - ${chassis.location.name}`;
//     }

//     if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
//       const days = chassis.ageInDays;
//       ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
//     } else if (locationText) {
//       // If no age but has location, show just location
//       ageText = locationText;
//     }
    
//     if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
//       displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
//     } else {
//       displayText = `${chassis.chassisNumber}${ageText}`;
//     }
    
//     return displayText;
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       return;
//     }

//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
//     imageFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!chassisNumber.trim()) {
//       return;
//     }
    
//     // Check note field when it's visible
//     if (showNonFifoNote && (!nonFifoReason || !nonFifoReason.trim())) {
//       setNonFifoError(true);
//       return;
//     } else {
//       setNonFifoError(false);
//     }
    
//     // Get selected chassis
//     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    
//     // Check if it's current chassis (allocatedBooking matches bookingId)
//     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
    
//     // Check if there's any current chassis in the ENTIRE list
//     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
    
//     // Validate reason param field (when shown)
//     if (showReasonField && !reason.trim()) {
//       return;
//     }
    
//     // In update mode, always require update reason
//     if (isUpdate && !reason.trim()) {
//       return;
//     }
    
//     // Additional validation based on scenario
//     if (selectedChassis && selectedChassis.status === 'in_stock') {
//       // Scenario 1: When there is current chassis in list
//       if (hasCurrentChassisInList) {
//         if (isCurrentChassis) {
//           // Current chassis: requires note only
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//         } else {
//           // Non-current chassis (after current): requires both note AND reason
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//           if (!reason.trim()) {
//             return;
//           }
//         }
//       } else {
//         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
//         if (inStockChassis.length > 0) {
//           // Sort to find the oldest
//           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//           const oldestInStockChassis = sortedInStock[0];
          
//           // Oldest chassis: requires note only
//           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//           } else {
//             // Non-oldest chassis: requires both note AND reason
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//             if (!reason.trim()) {
//               return;
//             }
//           }
//         }
//       }
//     }

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(reason.trim() && { reason: reason.trim() }), 
//       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
//       ...(hasClaim && {
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       }),
//       ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation })
//     };

//     console.log('Final Payload:', payload);

//     onSave(payload);
//   };

//   const handleCloseModal = () => {
//     // Reset form state
//     setHasClaim(null);
//     setShowNonFifoNote(false);
//     setShowReasonField(false);
//     setNonFifoReason('');
//     setNonFifoError(false);
//     setClaimDetails({
//       price: '',
//       description: '',
//       documents: []
//     });
//     setDocumentPreviews([]);
//     onClose();
//   };

//   return (
//     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>
      
//       {/* Error message display at the top */}
//       {errorMessage && (
//         <div className="p-3 border-bottom">
//           <CAlert 
//             color="danger" 
//             className="mb-0 position-relative"
//             style={{ paddingRight: '40px' }}
//           >
//             {errorMessage}
//             <CCloseButton 
//               className="position-absolute" 
//               style={{ top: '10px', right: '10px' }}
//               onClick={onClearError}
//             />
//           </CAlert>
//         </div>
//       )}
      
//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
//                 Yes
//               </CButton>
//               <CButton color="secondary" onClick={() => setHasClaim(false)}>
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
//             </div>

//             {/* Show is_deviation field for both CASH and FINANCE payment types */}
//             {(isCashPayment || isFinanceBooking) && (
//               <div
//                 className="mb-3"
//                 style={{
//                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <CFormCheck
//                   id="isDeviation"
//                   label="Is Deviation?"
//                   checked={isDeviation === 'YES'}
//                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: '1.1rem',
//                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
//                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
//                   }}
//                 />
//               </div>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              
//               {/* Show branch info */}
//               {!loadingChassisNumbers && availableChassisNumbers.length > 0 && (
//                 <div className="mb-2">
//                   <small className="text-info">
//                     <CIcon icon={cilLocationPin} className="me-1" />
//                     Showing chassis numbers from {booking.branch?.name} branch only
//                   </small>
//                 </div>
//               )}
              
//               {loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
//                   <option value="">Select a chassis number</option>
//                   {availableChassisData.map((chassis) => (
//                     <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
//                       {getChassisDisplayText(chassis)}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               ) : (
//                 <>
//                   <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
//                   {!isUpdate && (
//                     <div className="alert alert-warning mt-2">
//                       <CIcon icon={cilWarning} className="me-2" />
//                       No chassis numbers available in {booking.branch?.name} branch for this model and color combination.
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Non-FIFO Selection Note */}
//             {showNonFifoNote && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="nonFifoReason" 
//                   value={nonFifoReason} 
//                   onChange={(e) => {
//                     setNonFifoReason(e.target.value);
//                     if (e.target.value.trim()) {
//                       setNonFifoError(false);
//                     }
//                   }} 
//                   required 
//                   rows={3}
//                 />
//                 {nonFifoError && (
//                   <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
//                     Please enter note
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Reason Field (param) - Show only for certain conditions */}
//             {showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="reason" 
//                   value={reason} 
//                   onChange={(e) => setReason(e.target.value)} 
//                   required 
//                   rows={3}
//                 />
//               </div>
//             )}

//             {/* Update Reason Field (only for update mode and not shown above) */}
//             {isUpdate && !showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
//               </div>
//             )}

//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{ width: '100px' }}>
//                             <img
//                               src={doc.url}
//                               alt={doc.name}
//                               className="img-thumbnail"
//                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{ transform: 'translate(50%, -50%)' }}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter((d) => !d.type.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             className='submit-button'
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;


// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CButton,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CFormCheck,
//   CAlert,
//   CCloseButton,
//   CInputGroup,
//   CInputGroupText,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLocationPin, cilWarning, cilSearch } from '@coreui/icons';
// import axiosInstance from '../../../axiosInstance';
// import Select from 'react-select';
// import '../../../css/form.css';

// const ChassisNumberModal = ({ 
//   show, 
//   onClose, 
//   onSave, 
//   isLoading, 
//   booking, 
//   isUpdate = false,
//   errorMessage = '',
//   onClearError = () => {}
// }) => {
//   const [chassisNumber, setChassisNumber] = useState('');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]); 
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);
//   const [isDeviation, setIsDeviation] = useState('NO');
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');
//   const [showReasonField, setShowReasonField] = useState(false);
//   const [nonFifoError, setNonFifoError] = useState(false);
  
//   // State for selected chassis details
//   const [selectedChassisDetails, setSelectedChassisDetails] = useState(null);

//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
//   const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance'; 

//   useEffect(() => {
//     if (show) {
//       setChassisNumber(booking?.chassisNumber || '');
//       setReason('');
//       setHasClaim(null);
//       setClaimDetails({
//         price: '',
//         description: '',
//         documents: []
//       });
//       setDocumentPreviews([]);
//       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
//       setShowNonFifoNote(false);
//       setNonFifoReason('');
//       setShowReasonField(false);
//       setNonFifoError(false);
//       setSelectedChassisDetails(null);
      
//       if (booking) {
//         fetchAvailableChassisNumbers();
//       }
//     }
//   }, [show, booking]);

//   // Auto-clear error after 10 seconds
//   useEffect(() => {
//     if (errorMessage && show) {
//       const timer = setTimeout(() => {
//         onClearError();
//       }, 10000); // 10 seconds
      
//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage, show, onClearError]);

//   // Update selected chassis details when chassisNumber changes
//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selected = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//       setSelectedChassisDetails(selected || null);
//     } else {
//       setSelectedChassisDetails(null);
//     }
//   }, [chassisNumber, availableChassisData]);

//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
//       console.log('Selected Chassis:', selectedChassis);
//       console.log('Booking ID:', booking?._id);
//       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
//       if (selectedChassis) {
//         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
//         if (selectedChassis.status === 'booked') {
//           console.log('Booked chassis - no note or reason field');
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//           return;
//         }
        
//         if (selectedChassis.status === 'in_stock') {
//           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
//           console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
//           if (hasCurrentChassisInList) {
//             if (isCurrentChassis) {
//               console.log('Current chassis selected - show note field only');
//               setShowNonFifoNote(true);
//               setShowReasonField(false);
//             } else {
//               console.log('Non-current chassis selected (current exists) - show BOTH fields');
//               setShowNonFifoNote(true);
//               setShowReasonField(true);
//             }
//           } else {
//             console.log('No current chassis in list');
            
//             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
//             if (inStockChassis.length > 0) {
//               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//               const oldestInStockChassis = sortedInStock[0];
              
//               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
//               setShowNonFifoNote(true);
              
//               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
//               console.log('Should show reason field?', shouldShowReason);
              
//               setShowReasonField(shouldShowReason);
              
//               if (!shouldShowReason) {
//                 setNonFifoReason('');
//               }
//             }
//           }
//         } else {
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//         }
//       }
//     } else {
//       setShowNonFifoNote(false);
//       setShowReasonField(false);
//     }
//   }, [chassisNumber, availableChassisData, booking]);

//   const fetchAvailableChassisNumbers = async () => {
//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       console.log('API Response:', availableData);
      
//       // Get the booking's branch ID
//       const bookingBranchId = booking.branch?._id;
//       console.log('Booking Branch ID:', bookingBranchId);

//       // Filter chassis numbers to only show those from the same branch
//       const filteredData = availableData.filter((chassis) => {
//         // Check if location exists and has id, then compare with booking's branch ID
//         const chassisBranchId = chassis.location?.id;
//         const isSameBranch = chassisBranchId === bookingBranchId;
        
//         console.log(`Chassis ${chassis.chassisNumber}:`, {
//           chassisBranchId,
//           bookingBranchId,
//           isSameBranch
//         });
        
//         return isSameBranch;
//       });

//       console.log('Filtered Chassis Numbers (Same Branch):', filteredData);

//       // Sort by ageInDays (descending) - oldest first (FIFO)
//       const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);
      
//       // Store the full data
//       setAvailableChassisData(sortedData);

//       // Extract just the chassis number strings from the objects
//       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

//       // Auto-select the oldest chassis (FIFO) if not in update mode
//       if (!isUpdate && sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }

//       // If in update mode and the current chassis is not in the filtered list,
//       // we should still include it (it might be from a different branch or location)
//       if (isUpdate && booking.chassisNumber) {
//         // Check if current chassis is in the filtered list
//         const currentChassisInFiltered = filteredData.some(
//           (chassis) => chassis.chassisNumber === booking.chassisNumber
//         );
        
//         if (!currentChassisInFiltered) {
//           // Add current chassis to the list
//           setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
          
//           // Also add current chassis to the data array for display
//           const currentChassisData = {
//             chassisNumber: booking.chassisNumber, 
//             age: 'Current', 
//             ageInDays: 0, 
//             addedDate: 'Current',
//             status: 'allocated',
//             isBookedOrBlocked: false,
//             eligibilityMessage: 'Current Allocation',
//             allocatedBooking: booking._id,
//             location: {
//               id: booking.branch?._id,
//               name: booking.branch?.name,
//               type: 'branch'
//             },
//             engineNumber: booking.engineNumber || 'N/A'
//           };
          
//           setAvailableChassisData((prev) => [currentChassisData, ...prev]);
//         }
//       }

//       // Show a warning if no chassis numbers are available in the same branch
//       if (filteredData.length === 0 && !isUpdate) {
//         console.warn('No chassis numbers available in the same branch');
//       }

//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   // Prepare options for react-select
//   const chassisOptions = useMemo(() => {
//     return availableChassisData.map(chassis => {
//       const isCurrentChassis = chassis.allocatedBooking === booking?._id;
      
//       let displayText;
//       let ageText = '';
//       let locationText = '';

//       // Add location info if available
//       if (chassis.location?.name) {
//         locationText = ` - ${chassis.location.name}`;
//       }

//       if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
//         const days = chassis.ageInDays;
//         ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
//       } else if (locationText) {
//         // If no age but has location, show just location
//         ageText = locationText;
//       }
      
//       if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
//         displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
//       } else {
//         displayText = `${chassis.chassisNumber}${ageText}`;
//       }
      
//       if (isCurrentChassis) {
//         displayText = `${chassis.chassisNumber} (Current)${ageText}`;
//       }
      
//       return {
//         value: chassis.chassisNumber,
//         label: displayText,
//         engineNumber: chassis.engineNumber || 'N/A',
//         isCurrent: isCurrentChassis
//       };
//     });
//   }, [availableChassisData, booking]);

//   // Custom styles for react-select
//   const selectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? '#80bdff' : '#ced4da',
//       boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
//       '&:hover': {
//         borderColor: '#80bdff'
//       }
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected 
//         ? '#007bff' 
//         : state.isFocused 
//           ? '#f8f9fa' 
//           : null,
//       color: state.isSelected ? 'white' : '#495057',
//       cursor: 'pointer',
//       ':active': {
//         backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
//       }
//     }),
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999
//     })
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       return;
//     }

//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
//     imageFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!chassisNumber.trim()) {
//       return;
//     }
    
//     // Check note field when it's visible
//     if (showNonFifoNote && (!nonFifoReason || !nonFifoReason.trim())) {
//       setNonFifoError(true);
//       return;
//     } else {
//       setNonFifoError(false);
//     }
    
//     // Get selected chassis
//     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    
//     // Check if it's current chassis (allocatedBooking matches bookingId)
//     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
    
//     // Check if there's any current chassis in the ENTIRE list
//     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
    
//     // Validate reason param field (when shown)
//     if (showReasonField && !reason.trim()) {
//       return;
//     }
    
//     // In update mode, always require update reason
//     if (isUpdate && !reason.trim()) {
//       return;
//     }
    
//     // Additional validation based on scenario
//     if (selectedChassis && selectedChassis.status === 'in_stock') {
//       // Scenario 1: When there is current chassis in list
//       if (hasCurrentChassisInList) {
//         if (isCurrentChassis) {
//           // Current chassis: requires note only
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//         } else {
//           // Non-current chassis (after current): requires both note AND reason
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//           if (!reason.trim()) {
//             return;
//           }
//         }
//       } else {
//         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
//         if (inStockChassis.length > 0) {
//           // Sort to find the oldest
//           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//           const oldestInStockChassis = sortedInStock[0];
          
//           // Oldest chassis: requires note only
//           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//           } else {
//             // Non-oldest chassis: requires both note AND reason
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//             if (!reason.trim()) {
//               return;
//             }
//           }
//         }
//       }
//     }

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(reason.trim() && { reason: reason.trim() }), 
//       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
//       ...(hasClaim && {
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       }),
//       ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation }),
//       // Include engine number if available
//       ...(selectedChassisDetails?.engineNumber && { engineNumber: selectedChassisDetails.engineNumber })
//     };

//     console.log('Final Payload:', payload);

//     onSave(payload);
//   };

//   const handleCloseModal = () => {
//     // Reset form state
//     setHasClaim(null);
//     setShowNonFifoNote(false);
//     setShowReasonField(false);
//     setNonFifoReason('');
//     setNonFifoError(false);
//     setClaimDetails({
//       price: '',
//       description: '',
//       documents: []
//     });
//     setDocumentPreviews([]);
//     setSelectedChassisDetails(null);
//     onClose();
//   };

//   return (
//     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>
      
//       {/* Error message display at the top */}
//       {errorMessage && (
//         <div className="p-3 border-bottom">
//           <CAlert 
//             color="danger" 
//             className="mb-0 position-relative"
//             style={{ paddingRight: '40px' }}
//           >
//             {errorMessage}
//             <CCloseButton 
//               className="position-absolute" 
//               style={{ top: '10px', right: '10px' }}
//               onClick={onClearError}
//             />
//           </CAlert>
//         </div>
//       )}
      
//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
//                 Yes
//               </CButton>
//               <CButton color="secondary" onClick={() => setHasClaim(false)}>
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
//             </div>

//             {/* Show is_deviation field for both CASH and FINANCE payment types */}
//             {(isCashPayment || isFinanceBooking) && (
//               <div
//                 className="mb-3"
//                 style={{
//                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <CFormCheck
//                   id="isDeviation"
//                   label="Is Deviation?"
//                   checked={isDeviation === 'YES'}
//                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: '1.1rem',
//                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
//                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
//                   }}
//                 />
//               </div>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              
//               {/* Show branch info */}
//               {!loadingChassisNumbers && availableChassisNumbers.length > 0 && (
//                 <div className="mb-2">
//                   <small className="text-info">
//                     <CIcon icon={cilLocationPin} className="me-1" />
//                     Showing chassis numbers from {booking.branch?.name} branch only
//                   </small>
//                 </div>
//               )}
              
//               {loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <>
//                   <Select
//                     id="chassisNumber"
//                     name="chassisNumber"
//                     placeholder="Search chassis number..."
//                     value={chassisOptions.find(option => option.value === chassisNumber) || null}
//                     onChange={(selected) => setChassisNumber(selected ? selected.value : '')}
//                     options={chassisOptions}
//                     styles={selectStyles}
//                     isClearable
//                     isSearchable
//                     noOptionsMessage={() => "No chassis numbers available"}
//                     classNamePrefix="react-select"
//                     className={`react-select-container ${chassisNumber ? 'valid-input' : ''}`}
//                   />
                  
//                   {/* Display Engine Number when chassis is selected */}
//                   {selectedChassisDetails && (
//                     <div className="mt-2 p-2 bg-light border rounded">
//                       <div className="d-flex align-items-center">
//                         <strong className="me-2">Engine Number:</strong>
//                         <span className="text-primary fw-bold">
//                           {selectedChassisDetails.engineNumber || 'N/A'}
//                         </span>
//                       </div>
//                       {selectedChassisDetails.location?.name && (
//                         <div className="mt-1 small text-muted">
//                           Location: {selectedChassisDetails.location.name}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
//                   {!isUpdate && (
//                     <div className="alert alert-warning mt-2">
//                       <CIcon icon={cilWarning} className="me-2" />
//                       No chassis numbers available in {booking.branch?.name} branch for this model and color combination.
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Non-FIFO Selection Note */}
//             {showNonFifoNote && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="nonFifoReason" 
//                   value={nonFifoReason} 
//                   onChange={(e) => {
//                     setNonFifoReason(e.target.value);
//                     if (e.target.value.trim()) {
//                       setNonFifoError(false);
//                     }
//                   }} 
//                   required 
//                   rows={3}
//                 />
//                 {nonFifoError && (
//                   <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
//                     Please enter note
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Reason Field (param) - Show only for certain conditions */}
//             {showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="reason" 
//                   value={reason} 
//                   onChange={(e) => setReason(e.target.value)} 
//                   required 
//                   rows={3}
//                 />
//               </div>
//             )}

//             {/* Update Reason Field (only for update mode and not shown above) */}
//             {isUpdate && !showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
//               </div>
//             )}

//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{ width: '100px' }}>
//                             <img
//                               src={doc.url}
//                               alt={doc.name}
//                               className="img-thumbnail"
//                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{ transform: 'translate(50%, -50%)' }}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter((d) => !d.type.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             className='submit-button'
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;



// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CButton,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CFormCheck,
//   CAlert,
//   CCloseButton,
//   CInputGroup,
//   CInputGroupText,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLocationPin, cilWarning, cilSearch, cilCloudDownload } from '@coreui/icons';
// import axiosInstance from '../../../axiosInstance';
// import Select from 'react-select';
// import '../../../css/form.css';

// const ChassisNumberModal = ({
//   show,
//   onClose,
//   onSave,
//   isLoading,
//   booking,
//   isUpdate = false,
//   errorMessage = '',
//   onClearError = () => {}
// }) => {
//   const [chassisNumber, setChassisNumber] = useState('');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]);
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);
//   const [isDeviation, setIsDeviation] = useState('NO');
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');
//   const [showReasonField, setShowReasonField] = useState(false);
//   const [nonFifoError, setNonFifoError] = useState(false);

//   // Additional fields
//   const [rsaOptIn, setRsaOptIn] = useState('YES');
//   const [extendedWarranty, setExtendedWarranty] = useState('NO');
//   const [insuranceAddons, setInsuranceAddons] = useState([]);

//   // State for selected chassis details
//   const [selectedChassisDetails, setSelectedChassisDetails] = useState(null);

//   // State for scheme form PDF generation (disable button while working)
//   const [isGeneratingSchemeForm, setIsGeneratingSchemeForm] = useState(false);

//   // ── NEW: Controls whether the "Download Scheme Form" button is shown ──
//   // Defaults to 'YES'. This is UI-only and NOT included in the save payload.
//   const [showSchemeDownload, setShowSchemeDownload] = useState('YES');

//   // Insurance Addon options
//   const insuranceAddonOptions = [
//     { value: 'ZERO_DEPRECIATION', label: 'Zero Depreciation' },
//     { value: 'RETURN_TO_INVOICE', label: 'Return to Invoice' },
//     { value: 'CONSUMABLES', label: 'Consumables' },
//     { value: 'KEY_PROTECT', label: 'Key Protect' },
//     { value: 'TYRE_WHEEL_RIM_PROTECT', label: 'Tyre & Wheel Rim Protect' },
//     { value: 'EXTRA_TOWING', label: 'Extra Towing' },
//   ];

//   // Add safe access for booking properties
//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
//   const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance';

//   // Safe branch name access
//   const branchName = booking?.branch?.name || '';

//   // Whether the Scratch & Win scheme form should be available
//   const hasScheme = booking?.scheme?.toLowerCase() === 'yes';

//   useEffect(() => {
//     if (show && booking) {
//       setChassisNumber(booking?.chassisNumber || '');
//       setReason('');
//       setHasClaim(null);
//       setClaimDetails({
//         price: '',
//         description: '',
//         documents: []
//       });
//       setDocumentPreviews([]);
//       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
//       setShowNonFifoNote(false);
//       setNonFifoReason('');
//       setShowReasonField(false);
//       setNonFifoError(false);
//       setSelectedChassisDetails(null);

//       // Reset additional fields
//       setRsaOptIn(booking?.rsaOptIn || 'YES');
//       setExtendedWarranty(booking?.extendedWarranty || 'NO');
//       setInsuranceAddons(booking?.insuranceAddons || []);

//       // Reset scheme download toggle to default YES
//       setShowSchemeDownload('YES');

//       fetchAvailableChassisNumbers();
//     }
//   }, [show, booking]);

//   // Auto-clear error after 10 seconds
//   useEffect(() => {
//     if (errorMessage && show) {
//       const timer = setTimeout(() => {
//         onClearError();
//       }, 10000); // 10 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage, show, onClearError]);

//   // Update selected chassis details when chassisNumber changes
//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selected = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//       setSelectedChassisDetails(selected || null);
//     } else {
//       setSelectedChassisDetails(null);
//     }
//   }, [chassisNumber, availableChassisData]);

//   useEffect(() => {
//     if (booking && chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);

//       console.log('Selected Chassis:', selectedChassis);
//       console.log('Booking ID:', booking?._id);
//       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);

//       if (selectedChassis) {
//         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;

//         if (selectedChassis.status === 'booked') {
//           console.log('Booked chassis - no note or reason field');
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//           return;
//         }

//         if (selectedChassis.status === 'in_stock') {
//           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);

//           console.log('Has current chassis in entire list?', hasCurrentChassisInList);

//           if (hasCurrentChassisInList) {
//             if (isCurrentChassis) {
//               console.log('Current chassis selected - show note field only');
//               setShowNonFifoNote(true);
//               setShowReasonField(false);
//             } else {
//               console.log('Non-current chassis selected (current exists) - show BOTH fields');
//               setShowNonFifoNote(true);
//               setShowReasonField(true);
//             }
//           } else {
//             console.log('No current chassis in list');

//             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');

//             if (inStockChassis.length > 0) {
//               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//               const oldestInStockChassis = sortedInStock[0];

//               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);

//               setShowNonFifoNote(true);

//               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
//               console.log('Should show reason field?', shouldShowReason);

//               setShowReasonField(shouldShowReason);

//               if (!shouldShowReason) {
//                 setNonFifoReason('');
//               }
//             }
//           }
//         } else {
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//         }
//       }
//     } else {
//       setShowNonFifoNote(false);
//       setShowReasonField(false);
//     }
//   }, [chassisNumber, availableChassisData, booking]);

//   const fetchAvailableChassisNumbers = async () => {
//     // Don't fetch if booking is not available
//     if (!booking || !booking.model || !booking.color) {
//       console.log('Booking data not available yet');
//       return;
//     }

//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       console.log('API Response:', availableData);

//       // Get the booking's branch ID (handle branch being object or plain string id)
//       const bookingBranchId =
//         booking.branch && typeof booking.branch === 'object'
//           ? booking.branch?._id
//           : booking.branch;
//       console.log('Booking Branch ID:', bookingBranchId);

//       // Filter chassis numbers.
//       //
//       // Inclusion rules:
//       //   branch    → include IFF location.id === booking branch id
//       //   godown    → include IFF location.branch._id === booking branch id
//       //   subdealer → ALWAYS EXCLUDE
//       //
//       const filteredData = availableData.filter((chassis) => {
//         const loc = chassis.location;
//         if (!loc) return false;

//         // Never include subdealer stock
//         if (loc.type === 'subdealer') {
//           console.log(`Chassis ${chassis.chassisNumber}: skipped (subdealer)`);
//           return false;
//         }

//         const chassisBranchId =
//           loc.type === 'branch'
//             ? loc.id
//             : loc.branch?._id; // godown

//         const isSameBranch = chassisBranchId === bookingBranchId;

//         console.log(`Chassis ${chassis.chassisNumber}:`, {
//           locationType: loc.type,
//           chassisBranchId,
//           bookingBranchId,
//           isSameBranch
//         });

//         return isSameBranch;
//       });

//       console.log('Filtered Chassis Numbers (branch + godown only, same branch):', filteredData);

//       // Sort by ageInDays (descending) - oldest first (FIFO)
//       const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);

//       // Store the full data
//       setAvailableChassisData(sortedData);

//       // Extract just the chassis number strings from the objects
//       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

//       // Auto-select the oldest chassis (FIFO) if not in update mode
//       if (!isUpdate && sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }

//       // If in update mode and the current chassis is not in the filtered list,
//       // we should still include it (it might be from a different branch or location)
//       if (isUpdate && booking.chassisNumber) {
//         // Check if current chassis is in the filtered list
//         const currentChassisInFiltered = filteredData.some(
//           (chassis) => chassis.chassisNumber === booking.chassisNumber
//         );

//         if (!currentChassisInFiltered) {
//           // Add current chassis to the list
//           setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);

//           // Also add current chassis to the data array for display
//           const currentChassisData = {
//             chassisNumber: booking.chassisNumber,
//             age: 'Current',
//             ageInDays: 0,
//             addedDate: 'Current',
//             status: 'allocated',
//             isBookedOrBlocked: false,
//             eligibilityMessage: 'Current Allocation',
//             allocatedBooking: booking._id,
//             location: {
//               id: booking.branch?._id,
//               name: booking.branch?.name,
//               type: 'branch'
//             },
//             engineNumber: booking.engineNumber || 'N/A'
//           };

//           setAvailableChassisData((prev) => [currentChassisData, ...prev]);
//         }
//       }

//       // Show a warning if no chassis numbers are available in the same branch
//       if (filteredData.length === 0 && !isUpdate) {
//         console.warn('No chassis numbers available in the same branch (branch + godown)');
//       }

//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   // Prepare options for react-select
//   const chassisOptions = useMemo(() => {
//     return availableChassisData.map(chassis => {
//       const isCurrentChassis = booking ? chassis.allocatedBooking === booking?._id : false;

//       let displayText;
//       let ageText = '';
//       let locationText = '';

//       // Add location info if available (godown gets a tag; subdealer never appears)
//       if (chassis.location?.name) {
//         const typeTag = chassis.location.type === 'godown' ? ' [Godown]' : '';
//         locationText = ` - ${chassis.location.name}${typeTag}`;
//       }

//       if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
//         const days = chassis.ageInDays;
//         ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
//       } else if (locationText) {
//         // If no age but has location, show just location
//         ageText = locationText;
//       }

//       if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
//         displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
//       } else {
//         displayText = `${chassis.chassisNumber}${ageText}`;
//       }

//       if (isCurrentChassis) {
//         displayText = `${chassis.chassisNumber} (Current)${ageText}`;
//       }

//       return {
//         value: chassis.chassisNumber,
//         label: displayText,
//         engineNumber: chassis.engineNumber || 'N/A',
//         isCurrent: isCurrentChassis
//       };
//     });
//   }, [availableChassisData, booking]);

//   // Custom styles for react-select
//   const selectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? '#80bdff' : '#ced4da',
//       boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
//       '&:hover': {
//         borderColor: '#80bdff'
//       }
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? '#007bff'
//         : state.isFocused
//           ? '#f8f9fa'
//           : null,
//       color: state.isSelected ? 'white' : '#495057',
//       cursor: 'pointer',
//       ':active': {
//         backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
//       }
//     }),
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999
//     })
//   };

//   // Styles for insurance addon select
//   const insuranceSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? '#80bdff' : '#ced4da',
//       boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
//       '&:hover': {
//         borderColor: '#80bdff'
//       }
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? '#007bff'
//         : state.isFocused
//           ? '#f8f9fa'
//           : null,
//       color: state.isSelected ? 'white' : '#495057',
//       cursor: 'pointer',
//       ':active': {
//         backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
//       }
//     }),
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999
//     }),
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: '#e9ecef',
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       color: '#495057',
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       color: '#6c757d',
//       ':hover': {
//         backgroundColor: '#dc3545',
//         color: 'white',
//       }
//     }),
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       return;
//     }

//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
//     imageFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!booking) {
//       console.error('Booking data is missing');
//       return;
//     }

//     if (!chassisNumber.trim()) {
//       return;
//     }

//     // Check note field when it's visible
//     if (showNonFifoNote && (!nonFifoReason || !nonFifoReason.trim())) {
//       setNonFifoError(true);
//       return;
//     } else {
//       setNonFifoError(false);
//     }

//     // Get selected chassis
//     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);

//     // Check if it's current chassis (allocatedBooking matches bookingId)
//     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;

//     // Check if there's any current chassis in the ENTIRE list
//     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);

//     // Validate reason param field (when shown)
//     if (showReasonField && !reason.trim()) {
//       return;
//     }

//     // In update mode, always require update reason
//     if (isUpdate && !reason.trim()) {
//       return;
//     }

//     // Additional validation based on scenario
//     if (selectedChassis && selectedChassis.status === 'in_stock') {
//       // Scenario 1: When there is current chassis in list
//       if (hasCurrentChassisInList) {
//         if (isCurrentChassis) {
//           // Current chassis: requires note only
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//         } else {
//           // Non-current chassis (after current): requires both note AND reason
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//           if (!reason.trim()) {
//             return;
//           }
//         }
//       } else {
//         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');

//         if (inStockChassis.length > 0) {
//           // Sort to find the oldest
//           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//           const oldestInStockChassis = sortedInStock[0];

//           // Oldest chassis: requires note only
//           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//           } else {
//             // Non-oldest chassis: requires both note AND reason
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//             if (!reason.trim()) {
//               return;
//             }
//           }
//         }
//       }
//     }

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(reason.trim() && { reason: reason.trim() }),
//       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
//       ...(hasClaim && {
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       }),
//       ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation }),
//       // Include engine number if available
//       ...(selectedChassisDetails?.engineNumber && { engineNumber: selectedChassisDetails.engineNumber }),
//       // Additional fields
//       rsaOptIn: rsaOptIn,
//       extendedWarranty: extendedWarranty,
//       ...(insuranceAddons.length > 0 && { insuranceAddons: insuranceAddons }),
//       hasClaim: hasClaim || false,
//       // NOTE: showSchemeDownload is intentionally NOT included — it's UI-only.
//     };

//     console.log('Final Payload:', payload);

//     onSave(payload);
//   };

//   const handleCloseModal = () => {
//     // Reset form state
//     setHasClaim(null);
//     setShowNonFifoNote(false);
//     setShowReasonField(false);
//     setNonFifoReason('');
//     setNonFifoError(false);
//     setClaimDetails({
//       price: '',
//       description: '',
//       documents: []
//     });
//     setDocumentPreviews([]);
//     setSelectedChassisDetails(null);

//     // Reset additional fields
//     setRsaOptIn('YES');
//     setExtendedWarranty('NO');
//     setInsuranceAddons([]);

//     // Reset scheme download toggle
//     setShowSchemeDownload('YES');

//     onClose();
//   };

//   // ─── Download Scheme Form (as a real PDF via html2pdf.js — no browser print header/footer/date) ────────────────

//   // Lazily loads html2pdf.js from a CDN once and caches it on window.html2pdf
//   const loadHtml2Pdf = () => {
//     return new Promise((resolve, reject) => {
//       if (window.html2pdf) {
//         resolve(window.html2pdf);
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
//       script.onload = () => resolve(window.html2pdf);
//       script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
//       document.body.appendChild(script);
//     });
//   };

//   const handleDownloadSchemeForm = async () => {
//     if (!booking) return;
//     if (booking?.scheme?.toLowerCase() !== 'yes') return;

//     const customerName = booking?.customerDetails?.name || '';
//     const address = [
//       booking?.customerDetails?.address,
//       booking?.customerDetails?.taluka,
//       booking?.customerDetails?.district,
//       booking?.customerDetails?.pincode,
//     ].filter(Boolean).join(', ');

//     const contactNumber = booking?.customerDetails?.mobile1 || booking?.customerDetails?.mobile || '';
//     const vehicleModel = booking?.model?.model_name || booking?.model?.name || '';
//     const bookingNumber = booking?.bookingNumber || '';
//     const financierName = booking?.payment?.financer?.name || '';
//     const today = new Date().toLocaleDateString('en-GB');

//     // Two explicit A4 pages. min-height set to 290mm (safely under A4's 297mm)
//     // so neither page overflows the html2canvas canvas and creates a phantom page.
//     const innerHtml = `
//       <div id="scheme-form-page">
//         <!-- ================= PAGE 1 ================= -->
//         <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto 0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;">

//           <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;">
//             <p style="font-size:20px;font-weight:bold;letter-spacing:0.5px;margin:0;">GANDHI MOTORS PVT. LTD.</p>
//             <p style="font-size:16px;font-weight:bold;margin:6px 0 2px;text-decoration:underline;">"SCRATCH &amp; WIN" OFFER</p>
//             <p style="font-size:13px;font-style:italic;margin:0 0 4px;">Customer Acknowledgment &amp; Consent Form</p>
//           </div>

//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Customer Name:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Address:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${address}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Contact Number:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${contactNumber}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Vehicle Model / Variant:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${vehicleModel}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Booking / Invoice No.:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${bookingNumber}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Financier (Bank / NBFC) Name:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${financierName}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
//           </div>

//           <div style="font-weight:bold;font-size:14px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Terms &amp; Conditions of the Offer</div>
//           <ol style="padding-left:20px;margin:0 0 10px;">
//             <li style="margin-bottom:6px;text-align:justify;">This "Scratch &amp; Win" offer ("the Offer") is available only to customers who purchase a vehicle through select bank/NBFC finance (loan) from GANDHI MOTORS PVT. LTD. ("the Dealership").</li>
//             <li style="margin-bottom:6px;text-align:justify;">Participation in the Offer is entirely free. No separate fee, charge, deposit, or additional amount is payable by the customer to become eligible for, or to participate in, the Offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The price of the vehicle is identical for every customer, whether the vehicle is purchased on cash or on finance. The vehicle's price has not been increased or altered in any way on account of the Offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The customer will select one scratch card from multiple cards placed in a pot/box at the time of purchase. Every card carries a guaranteed discount of not less than ₹3,000 and not more than ₹10,000. No card carries a nil or "try again" outcome — every participating customer receives a discount within this range.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The discount amount is determined entirely by random selection at the time the card is drawn, and bears no relation to the vehicle model, variant, colour, accessories, or any other factor.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The discount amount shown on the scratch card will be applied as a discount in the customer's final deal form / tax invoice for the vehicle.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The Offer is limited to one scratch card per customer, per vehicle booking.</li>
//             <li style="margin-bottom:6px;text-align:justify;">Once revealed, the discount amount is final. It is not transferable, not exchangeable for cash or any other benefit, and cannot be combined with any other offer unless the Dealership states otherwise in writing.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The Offer is valid from 16/09/2026 to 30/11/2026, or until withdrawn earlier at the Dealership's discretion.</li>
//             <li style="margin-bottom:6px;text-align:justify;">This is a promotional discount scheme offered voluntarily by the Dealership, funded entirely from its own margin, to make vehicle finance more attractive to customers. As no payment, fee, or other consideration is charged to the customer for the chance to receive a discount, the Offer does not constitute a lottery, prize competition, or game of chance for consideration.</li>
//           </ol>
//         </div>

//         <!-- ================= PAGE 2 ================= -->
//         <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;page-break-before:always;break-before:page;">

//           <ol start="11" style="padding-left:20px;margin:0 0 10px;">
//             <li style="margin-bottom:6px;text-align:justify;">For any queries or grievances relating to the Offer, customers may write to us contact us at gandhitvsnashik@gmail.com.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The Dealership may amend these terms at any time. Any such change will apply prospectively only and will not affect a discount already confirmed to a customer.</li>
//             <li style="margin-bottom:6px;text-align:justify;">Nothing in these terms, or in the acknowledgment below, limits or affects any right available to the customer under the Consumer Protection Act, 2019, or any other applicable law.</li>
//           </ol>

//           <div style="font-weight:bold;font-size:13px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Customer Acknowledgment &amp; Declaration</div>
//           <p style="margin-bottom:8px;">I, the undersigned, confirm and declare that:</p>
//           <ul style="list-style:none;padding-left:0;margin:0 0 12px;">
//             <li style="margin-bottom:6px;text-align:justify;"><b>(a)</b> I have been shown and explained the above Terms &amp; Conditions, in a language I understand, before participating in the Offer &amp; I have voluntarily participated in the Dealer Scratch &amp; Win offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(b)</b> I have not paid, and have not been asked to pay, any amount over and above the standard price of the vehicle in order to participate in the Offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(c)</b> My decision to purchase this vehicle on finance was made independently, and my participation in the Offer is entirely voluntary.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(d)</b> I selected my scratch card of my own free will, and understand that the discount amount shown on it — between ₹3,000 and ₹10,000 — was determined randomly.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(e)</b> The discount amount revealed on my card is ₹_______________________, which I accept as final and understand will be deducted from the deal amount / price in my vehicle's tax invoice.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(f)</b> I understand and acknowledge that, as no fee or other consideration was charged to me for the Offer, it is a promotional discount and not a lottery, prize competition, or game of chance requiring payment.</li>
//           </ul>

//           <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
//             <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;"></div>
//             <div style="font-size:11.5px;font-weight:bold;">Signature of Customer</div>
//             <div style="display:flex;align-items:flex-end;margin-top:10px;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Full Name (Block Letters):</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span>
//             </div>
//             <div style="display:flex;align-items:flex-end;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Date:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
//               <span style="font-weight:bold;white-space:nowrap;margin:0 6px 0 10px;min-width:60px;">Place:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">Sangamner</span>
//             </div>
//           </div>

//           <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
//             <p style="font-weight:bold;margin-bottom:8px;">For GANDHI MOTORS PVT. LTD.</p>
//             <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;width:60%;"></div>
//             <div style="font-size:11.5px;font-weight:bold;">Signature of Dealership Manager / Representative</div>
//             <div style="display:flex;align-items:flex-end;margin-top:10px;width:60%;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Name &amp; Designation:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;"></span>
//             </div>
//             <div style="display:flex;align-items:flex-end;width:60%;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;

//     // Isolated iframe (off-screen horizontally, NOT vertically) so html2canvas
//     // measures the form at its natural size, uncontaminated by the modal's
//     // body-lock transform on the parent document.
//     const iframe = document.createElement('iframe');
//     iframe.style.position = 'fixed';
//     iframe.style.left = '-10000px';
//     iframe.style.top = '0';
//     iframe.style.border = '0';
//     iframe.style.width = '900px';
//     iframe.style.height = '1400px';
//     iframe.style.visibility = 'hidden';
//     document.body.appendChild(iframe);

//     const frameDoc = iframe.contentDocument;
//     frameDoc.open();
//     frameDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;">${innerHtml}</body></html>`);
//     frameDoc.close();

//     // Wait for layout to settle
//     await new Promise((resolve) => setTimeout(resolve, 100));

//     // Find the form element (the wrapper we wrote in)
//     const pageEl = frameDoc.getElementById('scheme-form-page');

//     setIsGeneratingSchemeForm(true);
//     try {
//       const html2pdf = await loadHtml2Pdf();
//       await html2pdf()
//         .set({
//           margin: 0,
//           filename: `Scratch_Win_Customer_Acknowledgment_${bookingNumber || 'form'}.pdf`,
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: {
//             scale: 2,
//             useCORS: true,
//             backgroundColor: '#ffffff',
//             scrollX: 0,
//             scrollY: 0,
//           },
//           jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//           pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page + .pdf-page', avoid: '.pdf-page' },
//         })
//         .from(pageEl)
//         .save();
//     } catch (err) {
//       console.error('Scheme form PDF generation failed:', err);
//       alert('Could not generate the scheme form PDF. Please try again.');
//     } finally {
//       document.body.removeChild(iframe);
//       setIsGeneratingSchemeForm(false);
//     }
//   };

//   // If booking is not available, don't render the modal content
//   if (!booking) {
//     return null;
//   }

//   return (
//     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title mb-0">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>

//       {/* Error message display at the top */}
//       {errorMessage && (
//         <div className="p-3 border-bottom">
//           <CAlert
//             color="danger"
//             className="mb-0 position-relative"
//             style={{ paddingRight: '40px' }}
//           >
//             {errorMessage}
//             <CCloseButton
//               className="position-absolute"
//               style={{ top: '10px', right: '10px' }}
//               onClick={onClearError}
//             />
//           </CAlert>
//         </div>
//       )}

//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
//                 Yes
//               </CButton>
//               <CButton color="secondary" onClick={() => setHasClaim(false)}>
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name || 'N/A'}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name || 'N/A'}</CFormLabel>
//             </div>

//             {/* Show scheme badge + Yes/No toggle + Download button (only when scheme is active) */}
//             {hasScheme && (
//               <div className="mb-3">
//                 <span
//                   style={{
//                     backgroundColor: '#28a745',
//                     color: '#fff',
//                     padding: '3px 10px',
//                     borderRadius: '12px',
//                     fontSize: '12px',
//                     fontWeight: '600',
//                     display: 'inline-block'
//                   }}
//                 >
//                   Scratch &amp; Win Scheme Active
//                 </span>

//                 {/* Scheme download toggle + button */}
//                 <div
//                   className="mt-3 p-3 border rounded d-flex flex-wrap align-items-center justify-content-between"
//                   style={{ backgroundColor: '#f8fff9', borderColor: '#c3e6cb' }}
//                 >
//                   <div className="d-flex align-items-center gap-3">
//                     <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
//                       Download Scheme Form?
//                     </span>
//                     <div className="d-flex align-items-center gap-2">
//                       <CFormCheck
//                         inline
//                         type="radio"
//                         name="showSchemeDownload"
//                         id="showSchemeDownloadYes"
//                         label="Yes"
//                         checked={showSchemeDownload === 'YES'}
//                         onChange={() => setShowSchemeDownload('YES')}
//                         style={{ fontSize: '13px' }}
//                       />
//                       <CFormCheck
//                         inline
//                         type="radio"
//                         name="showSchemeDownload"
//                         id="showSchemeDownloadNo"
//                         label="No"
//                         checked={showSchemeDownload === 'NO'}
//                         onChange={() => setShowSchemeDownload('NO')}
//                         style={{ fontSize: '13px' }}
//                       />
//                     </div>
//                   </div>

//                   {showSchemeDownload === 'YES' && (
//                     <CButton
//                       size="sm"
//                       onClick={handleDownloadSchemeForm}
//                       disabled={isGeneratingSchemeForm}
//                       title="Download Scratch & Win Scheme Form"
//                       style={{
//                         backgroundColor: '#28a745',
//                         borderColor: '#28a745',
//                         color: '#fff',
//                         fontWeight: '600',
//                         fontSize: '13px',
//                         padding: '6px 14px',
//                         borderRadius: '20px',
//                         display: 'inline-flex',
//                         alignItems: 'center',
//                         gap: '6px',
//                         boxShadow: '0 2px 8px rgba(40, 167, 69, 0.35)',
//                         whiteSpace: 'nowrap',
//                         opacity: isGeneratingSchemeForm ? 0.7 : 1
//                       }}
//                     >
//                       {isGeneratingSchemeForm ? (
//                         <CSpinner size="sm" />
//                       ) : (
//                         <CIcon icon={cilCloudDownload} />
//                       )}
//                       {isGeneratingSchemeForm ? 'Preparing PDF...' : 'Download Scheme Form'}
//                     </CButton>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Show is_deviation field for both CASH and FINANCE payment types */}
//             {(isCashPayment || isFinanceBooking) && (
//               <div
//                 className="mb-3"
//                 style={{
//                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <CFormCheck
//                   id="isDeviation"
//                   label="Is Deviation?"
//                   checked={isDeviation === 'YES'}
//                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: '1.1rem',
//                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
//                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
//                   }}
//                 />
//               </div>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>

//               {/* Show branch info */}
//               {!loadingChassisNumbers && availableChassisNumbers.length > 0 && branchName && (
//                 <div className="mb-2">
//                   <small className="text-info">
//                     <CIcon icon={cilLocationPin} className="me-1" />
//                     Showing chassis numbers from {branchName} branch only
//                   </small>
//                 </div>
//               )}

//               {loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <>
//                   <Select
//                     id="chassisNumber"
//                     name="chassisNumber"
//                     placeholder="Search chassis number..."
//                     value={chassisOptions.find(option => option.value === chassisNumber) || null}
//                     onChange={(selected) => setChassisNumber(selected ? selected.value : '')}
//                     options={chassisOptions}
//                     styles={selectStyles}
//                     isClearable
//                     isSearchable
//                     noOptionsMessage={() => "No chassis numbers available"}
//                     classNamePrefix="react-select"
//                     className={`react-select-container ${chassisNumber ? 'valid-input' : ''}`}
//                   />

//                   {/* Display Engine Number when chassis is selected */}
//                   {selectedChassisDetails && (
//                     <div className="mt-2 p-2 bg-light border rounded">
//                       <div className="d-flex align-items-center">
//                         <strong className="me-2">Engine Number:</strong>
//                         <span className="text-primary fw-bold">
//                           {selectedChassisDetails.engineNumber || 'N/A'}
//                         </span>
//                       </div>
//                       {selectedChassisDetails.location?.name && (
//                         <div className="mt-1 small text-muted">
//                           Location: {selectedChassisDetails.location.name}
//                           {selectedChassisDetails.location?.type === 'godown' ? ' (Godown)' : ''}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
//                   {!isUpdate && branchName && (
//                     <div className="alert alert-warning mt-2">
//                       <CIcon icon={cilWarning} className="me-2" />
//                       No chassis numbers available in {branchName} branch for this model and color combination.
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Non-FIFO Selection Note */}
//             {showNonFifoNote && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea
//                   id="nonFifoReason"
//                   value={nonFifoReason}
//                   onChange={(e) => {
//                     setNonFifoReason(e.target.value);
//                     if (e.target.value.trim()) {
//                       setNonFifoError(false);
//                     }
//                   }}
//                   required
//                   rows={3}
//                 />
//                 {nonFifoError && (
//                   <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
//                     Please enter note
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Reason Field (param) - Show only for certain conditions */}
//             {showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea
//                   id="reason"
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   required
//                   rows={3}
//                 />
//               </div>
//             )}

//             {/* Update Reason Field (only for update mode and not shown above) */}
//             {isUpdate && !showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
//               </div>
//             )}

//             {/* Additional Fields Section */}
//             <div className="mt-4 border-top pt-3">
//               <h6>Additional Details</h6>

//               {/* RSA Opt In */}
//               <div className="mb-3">
//                 <CFormLabel>RSA Opt In</CFormLabel>
//                 <div className="d-flex gap-3 mt-1">
//                   <CFormCheck
//                     id="rsaOptInYes"
//                     label="Yes"
//                     checked={rsaOptIn === 'YES'}
//                     onChange={() => setRsaOptIn('YES')}
//                   />
//                   <CFormCheck
//                     id="rsaOptInNo"
//                     label="No"
//                     checked={rsaOptIn === 'NO'}
//                     onChange={() => setRsaOptIn('NO')}
//                   />
//                 </div>
//               </div>

//               {/* Extended Warranty */}
//               <div className="mb-3">
//                 <CFormLabel>Extended Warranty</CFormLabel>
//                 <div className="d-flex gap-3 mt-1">
//                   <CFormCheck
//                     id="extendedWarrantyYes"
//                     label="Yes"
//                     checked={extendedWarranty === 'YES'}
//                     onChange={() => setExtendedWarranty('YES')}
//                   />
//                   <CFormCheck
//                     id="extendedWarrantyNo"
//                     label="No"
//                     checked={extendedWarranty === 'NO'}
//                     onChange={() => setExtendedWarranty('NO')}
//                   />
//                 </div>
//               </div>

//               {/* Insurance Addons - Always visible */}
//               <div className="mb-3">
//                 <CFormLabel htmlFor="insuranceAddons">Insurance Addons</CFormLabel>
//                 <Select
//                   id="insuranceAddons"
//                   name="insuranceAddons"
//                   placeholder="Select insurance addons..."
//                   value={insuranceAddonOptions.filter(option => insuranceAddons.includes(option.value))}
//                   onChange={(selected) => {
//                     setInsuranceAddons(selected ? selected.map(opt => opt.value) : []);
//                   }}
//                   options={insuranceAddonOptions}
//                   styles={insuranceSelectStyles}
//                   isMulti
//                   isClearable
//                   isSearchable
//                   noOptionsMessage={() => "No addons available"}
//                   classNamePrefix="react-select"
//                 />
//                 <small className="text-muted mt-1 d-block">
//                   Select one or more insurance addons
//                 </small>
//               </div>
//             </div>

//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{ width: '100px' }}>
//                             <img
//                               src={doc.url}
//                               alt={doc.name}
//                               className="img-thumbnail"
//                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{ transform: 'translate(50%, -50%)' }}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {claimDetails.documents.filter((d) => !d.type?.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter((d) => !d.type?.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             className='submit-button'
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;







//  ------------------   new updated code where reason field is removed   ---------------






import React, { useState, useEffect, useMemo } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CButton,
  CSpinner,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CAlert,
  CCloseButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLocationPin, cilWarning, cilSearch, cilCloudDownload } from '@coreui/icons';
import axiosInstance from '../../../axiosInstance';
import Select from 'react-select';
import '../../../css/form.css';

const ChassisNumberModal = ({
  show,
  onClose,
  onSave,
  isLoading,
  booking,
  isUpdate = false,
  errorMessage = '',
  onClearError = () => {}
}) => {
  const [chassisNumber, setChassisNumber] = useState('');
  const [reason, setReason] = useState('');
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [availableChassisData, setAvailableChassisData] = useState([]);
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
  const [hasClaim, setHasClaim] = useState(null);
  const [claimDetails, setClaimDetails] = useState({
    price: '',
    description: '',
    documents: []
  });
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [isDeviation, setIsDeviation] = useState('NO');
  const [showNonFifoNote, setShowNonFifoNote] = useState(false);
  const [nonFifoReason, setNonFifoReason] = useState('');
  const [nonFifoError, setNonFifoError] = useState(false);

  // Additional fields
  const [rsaOptIn, setRsaOptIn] = useState('YES');
  const [extendedWarranty, setExtendedWarranty] = useState('NO');
  const [insuranceAddons, setInsuranceAddons] = useState([]);

  // State for selected chassis details
  const [selectedChassisDetails, setSelectedChassisDetails] = useState(null);

  // State for scheme form PDF generation (disable button while working)
  const [isGeneratingSchemeForm, setIsGeneratingSchemeForm] = useState(false);

  // ── NEW: Controls whether the "Download Scheme Form" button is shown ──
  // Defaults to 'YES'. This is UI-only and NOT included in the save payload.
  const [showSchemeDownload, setShowSchemeDownload] = useState('YES');

  // Insurance Addon options
  const insuranceAddonOptions = [
    { value: 'ZERO_DEPRECIATION', label: 'Zero Depreciation' },
    { value: 'RETURN_TO_INVOICE', label: 'Return to Invoice' },
    { value: 'CONSUMABLES', label: 'Consumables' },
    { value: 'KEY_PROTECT', label: 'Key Protect' },
    { value: 'TYRE_WHEEL_RIM_PROTECT', label: 'Tyre & Wheel Rim Protect' },
    { value: 'EXTRA_TOWING', label: 'Extra Towing' },
  ];

  // Add safe access for booking properties
  const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
  const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance';

  // Safe branch name access
  const branchName = booking?.branch?.name || '';

  // Whether the Scratch & Win scheme form should be available
  const hasScheme = booking?.scheme?.toLowerCase() === 'yes';

  useEffect(() => {
    if (show && booking) {
      setChassisNumber(booking?.chassisNumber || '');
      setReason('');
      setHasClaim(null);
      setClaimDetails({
        price: '',
        description: '',
        documents: []
      });
      setDocumentPreviews([]);
      setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
      setShowNonFifoNote(false);
      setNonFifoReason('');
      setNonFifoError(false);
      setSelectedChassisDetails(null);

      // Reset additional fields
      setRsaOptIn(booking?.rsaOptIn || 'YES');
      setExtendedWarranty(booking?.extendedWarranty || 'NO');
      setInsuranceAddons(booking?.insuranceAddons || []);

      // Reset scheme download toggle to default YES
      setShowSchemeDownload('YES');

      fetchAvailableChassisNumbers();
    }
  }, [show, booking]);

  // Auto-clear error after 10 seconds
  useEffect(() => {
    if (errorMessage && show) {
      const timer = setTimeout(() => {
        onClearError();
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage, show, onClearError]);

  // Update selected chassis details when chassisNumber changes
  useEffect(() => {
    if (chassisNumber && availableChassisData.length > 0) {
      const selected = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      setSelectedChassisDetails(selected || null);
    } else {
      setSelectedChassisDetails(null);
    }
  }, [chassisNumber, availableChassisData]);

  // Determine whether the "Note" field should be shown.
  // The separate "Reason" field has been removed — selecting a different
  // (non-FIFO) chassis now only requires a Note.
  useEffect(() => {
    if (booking && chassisNumber && availableChassisData.length > 0) {
      const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);

      console.log('Selected Chassis:', selectedChassis);
      console.log('Booking ID:', booking?._id);
      console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);

      if (selectedChassis) {
        if (selectedChassis.status === 'booked') {
          console.log('Booked chassis - no note field');
          setShowNonFifoNote(false);
          return;
        }

        if (selectedChassis.status === 'in_stock') {
          console.log('In-stock chassis selected - show note field');
          setShowNonFifoNote(true);
        } else {
          setShowNonFifoNote(false);
        }
      }
    } else {
      setShowNonFifoNote(false);
    }
  }, [chassisNumber, availableChassisData, booking]);

  const fetchAvailableChassisNumbers = async () => {
    // Don't fetch if booking is not available
    if (!booking || !booking.model || !booking.color) {
      console.log('Booking data not available yet');
      return;
    }

    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
      const availableData = response.data.data.chassisNumbers || [];

      console.log('API Response:', availableData);

      // Get the booking's branch ID (handle branch being object or plain string id)
      const bookingBranchId =
        booking.branch && typeof booking.branch === 'object'
          ? booking.branch?._id
          : booking.branch;
      console.log('Booking Branch ID:', bookingBranchId);

      // Filter chassis numbers.
      //
      // Inclusion rules:
      //   branch    → include IFF location.id === booking branch id
      //   godown    → include IFF location.branch._id === booking branch id
      //   subdealer → ALWAYS EXCLUDE
      //
      const filteredData = availableData.filter((chassis) => {
        const loc = chassis.location;
        if (!loc) return false;

        // Never include subdealer stock
        if (loc.type === 'subdealer') {
          console.log(`Chassis ${chassis.chassisNumber}: skipped (subdealer)`);
          return false;
        }

        const chassisBranchId =
          loc.type === 'branch'
            ? loc.id
            : loc.branch?._id; // godown

        const isSameBranch = chassisBranchId === bookingBranchId;

        console.log(`Chassis ${chassis.chassisNumber}:`, {
          locationType: loc.type,
          chassisBranchId,
          bookingBranchId,
          isSameBranch
        });

        return isSameBranch;
      });

      console.log('Filtered Chassis Numbers (branch + godown only, same branch):', filteredData);

      // Sort by ageInDays (descending) - oldest first (FIFO)
      const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);

      // Store the full data
      setAvailableChassisData(sortedData);

      // Extract just the chassis number strings from the objects
      const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
      setAvailableChassisNumbers(chassisNumberStrings);

      // Auto-select the oldest chassis (FIFO) if not in update mode
      if (!isUpdate && sortedData.length > 0) {
        setChassisNumber(sortedData[0].chassisNumber);
      }

      // If in update mode and the current chassis is not in the filtered list,
      // we should still include it (it might be from a different branch or location)
      if (isUpdate && booking.chassisNumber) {
        // Check if current chassis is in the filtered list
        const currentChassisInFiltered = filteredData.some(
          (chassis) => chassis.chassisNumber === booking.chassisNumber
        );

        if (!currentChassisInFiltered) {
          // Add current chassis to the list
          setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);

          // Also add current chassis to the data array for display
          const currentChassisData = {
            chassisNumber: booking.chassisNumber,
            age: 'Current',
            ageInDays: 0,
            addedDate: 'Current',
            status: 'allocated',
            isBookedOrBlocked: false,
            eligibilityMessage: 'Current Allocation',
            allocatedBooking: booking._id,
            location: {
              id: booking.branch?._id,
              name: booking.branch?.name,
              type: 'branch'
            },
            engineNumber: booking.engineNumber || 'N/A'
          };

          setAvailableChassisData((prev) => [currentChassisData, ...prev]);
        }
      }

      // Show a warning if no chassis numbers are available in the same branch
      if (filteredData.length === 0 && !isUpdate) {
        console.warn('No chassis numbers available in the same branch (branch + godown)');
      }

    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  // Prepare options for react-select
  const chassisOptions = useMemo(() => {
    return availableChassisData.map(chassis => {
      const isCurrentChassis = booking ? chassis.allocatedBooking === booking?._id : false;

      let displayText;
      let ageText = '';
      let locationText = '';

      // Add location info if available (godown gets a tag; subdealer never appears)
      if (chassis.location?.name) {
        const typeTag = chassis.location.type === 'godown' ? ' [Godown]' : '';
        locationText = ` - ${chassis.location.name}${typeTag}`;
      }

      if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
        const days = chassis.ageInDays;
        ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
      } else if (locationText) {
        // If no age but has location, show just location
        ageText = locationText;
      }

      if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
        displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
      } else {
        displayText = `${chassis.chassisNumber}${ageText}`;
      }

      if (isCurrentChassis) {
        displayText = `${chassis.chassisNumber} (Current)${ageText}`;
      }

      return {
        value: chassis.chassisNumber,
        label: displayText,
        engineNumber: chassis.engineNumber || 'N/A',
        isCurrent: isCurrentChassis
      };
    });
  }, [availableChassisData, booking]);

  // Custom styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#80bdff' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
      '&:hover': {
        borderColor: '#80bdff'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#007bff'
        : state.isFocused
          ? '#f8f9fa'
          : null,
      color: state.isSelected ? 'white' : '#495057',
      cursor: 'pointer',
      ':active': {
        backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  // Styles for insurance addon select
  const insuranceSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#80bdff' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
      '&:hover': {
        borderColor: '#80bdff'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#007bff'
        : state.isFocused
          ? '#f8f9fa'
          : null,
      color: state.isSelected ? 'white' : '#495057',
      cursor: 'pointer',
      ':active': {
        backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e9ecef',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#495057',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#6c757d',
      ':hover': {
        backgroundColor: '#dc3545',
        color: 'white',
      }
    }),
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + claimDetails.documents.length > 6) {
      return;
    }

    const newDocuments = [...claimDetails.documents, ...files];
    setClaimDetails({ ...claimDetails, documents: newDocuments });

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index) => {
    const newDocuments = [...claimDetails.documents];
    newDocuments.splice(index, 1);
    setClaimDetails({ ...claimDetails, documents: newDocuments });

    if (documentPreviews[index]) {
      const newPreviews = [...documentPreviews];
      newPreviews.splice(index, 1);
      setDocumentPreviews(newPreviews);
    }
  };

  const handleSubmit = () => {
    if (!booking) {
      console.error('Booking data is missing');
      return;
    }

    if (!chassisNumber.trim()) {
      return;
    }

    // Check note field when it's visible
    if (showNonFifoNote && (!nonFifoReason || !nonFifoReason.trim())) {
      setNonFifoError(true);
      return;
    } else {
      setNonFifoError(false);
    }

    // In update mode, always require update reason
    if (isUpdate && !reason.trim()) {
      return;
    }

    const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);

    const payload = {
      chassisNumber: chassisNumber.trim(),
      ...(reason.trim() && { reason: reason.trim() }),
      ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
      ...(hasClaim && {
        claimDetails: {
          price: claimDetails.price,
          description: claimDetails.description,
          documents: claimDetails.documents
        }
      }),
      ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation }),
      // Include engine number if available
      ...(selectedChassisDetails?.engineNumber && { engineNumber: selectedChassisDetails.engineNumber }),
      // Additional fields
      rsaOptIn: rsaOptIn,
      extendedWarranty: extendedWarranty,
      ...(insuranceAddons.length > 0 && { insuranceAddons: insuranceAddons }),
      hasClaim: hasClaim || false,
      // NOTE: showSchemeDownload is intentionally NOT included — it's UI-only.
    };

    console.log('Final Payload:', payload);

    onSave(payload);
  };

  const handleCloseModal = () => {
    // Reset form state
    setHasClaim(null);
    setShowNonFifoNote(false);
    setNonFifoReason('');
    setNonFifoError(false);
    setClaimDetails({
      price: '',
      description: '',
      documents: []
    });
    setDocumentPreviews([]);
    setSelectedChassisDetails(null);

    // Reset additional fields
    setRsaOptIn('YES');
    setExtendedWarranty('NO');
    setInsuranceAddons([]);

    // Reset scheme download toggle
    setShowSchemeDownload('YES');

    onClose();
  };

  // ─── Download Scheme Form (as a real PDF via html2pdf.js — no browser print header/footer/date) ────────────────

  // Lazily loads html2pdf.js from a CDN once and caches it on window.html2pdf
  const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
      document.body.appendChild(script);
    });
  };

  const handleDownloadSchemeForm = async () => {
    if (!booking) return;
    if (booking?.scheme?.toLowerCase() !== 'yes') return;

    const customerName = booking?.customerDetails?.name || '';
    const address = [
      booking?.customerDetails?.address,
      booking?.customerDetails?.taluka,
      booking?.customerDetails?.district,
      booking?.customerDetails?.pincode,
    ].filter(Boolean).join(', ');

    const contactNumber = booking?.customerDetails?.mobile1 || booking?.customerDetails?.mobile || '';
    const vehicleModel = booking?.model?.model_name || booking?.model?.name || '';
    const bookingNumber = booking?.bookingNumber || '';
    const financierName = booking?.payment?.financer?.name || '';
    const today = new Date().toLocaleDateString('en-GB');

    // Two explicit A4 pages. min-height set to 290mm (safely under A4's 297mm)
    // so neither page overflows the html2canvas canvas and creates a phantom page.
    const innerHtml = `
      <div id="scheme-form-page">
        <!-- ================= PAGE 1 ================= -->
        <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto 0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;">

          <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;">
            <p style="font-size:20px;font-weight:bold;letter-spacing:0.5px;margin:0;">GANDHI MOTORS PVT. LTD.</p>
            <p style="font-size:16px;font-weight:bold;margin:6px 0 2px;text-decoration:underline;">"SCRATCH &amp; WIN" OFFER</p>
            <p style="font-size:13px;font-style:italic;margin:0 0 4px;">Customer Acknowledgment &amp; Consent Form</p>
          </div>

          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Customer Name:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Address:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${address}</span>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Contact Number:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${contactNumber}</span>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Vehicle Model / Variant:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${vehicleModel}</span>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Booking / Invoice No.:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${bookingNumber}</span>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Financier (Bank / NBFC) Name:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${financierName}</span>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
            <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span>
            <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
          </div>

          <div style="font-weight:bold;font-size:14px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Terms &amp; Conditions of the Offer</div>
          <ol style="padding-left:20px;margin:0 0 10px;">
            <li style="margin-bottom:6px;text-align:justify;">This "Scratch &amp; Win" offer ("the Offer") is available only to customers who purchase a vehicle through select bank/NBFC finance (loan) from GANDHI MOTORS PVT. LTD. ("the Dealership").</li>
            <li style="margin-bottom:6px;text-align:justify;">Participation in the Offer is entirely free. No separate fee, charge, deposit, or additional amount is payable by the customer to become eligible for, or to participate in, the Offer.</li>
            <li style="margin-bottom:6px;text-align:justify;">The price of the vehicle is identical for every customer, whether the vehicle is purchased on cash or on finance. The vehicle's price has not been increased or altered in any way on account of the Offer.</li>
            <li style="margin-bottom:6px;text-align:justify;">The customer will select one scratch card from multiple cards placed in a pot/box at the time of purchase. Every card carries a guaranteed discount of not less than ₹3,000 and not more than ₹10,000. No card carries a nil or "try again" outcome — every participating customer receives a discount within this range.</li>
            <li style="margin-bottom:6px;text-align:justify;">The discount amount is determined entirely by random selection at the time the card is drawn, and bears no relation to the vehicle model, variant, colour, accessories, or any other factor.</li>
            <li style="margin-bottom:6px;text-align:justify;">The discount amount shown on the scratch card will be applied as a discount in the customer's final deal form / tax invoice for the vehicle.</li>
            <li style="margin-bottom:6px;text-align:justify;">The Offer is limited to one scratch card per customer, per vehicle booking.</li>
            <li style="margin-bottom:6px;text-align:justify;">Once revealed, the discount amount is final. It is not transferable, not exchangeable for cash or any other benefit, and cannot be combined with any other offer unless the Dealership states otherwise in writing.</li>
            <li style="margin-bottom:6px;text-align:justify;">The Offer is valid from 16/09/2026 to 30/11/2026, or until withdrawn earlier at the Dealership's discretion.</li>
            <li style="margin-bottom:6px;text-align:justify;">This is a promotional discount scheme offered voluntarily by the Dealership, funded entirely from its own margin, to make vehicle finance more attractive to customers. As no payment, fee, or other consideration is charged to the customer for the chance to receive a discount, the Offer does not constitute a lottery, prize competition, or game of chance for consideration.</li>
          </ol>
        </div>

        <!-- ================= PAGE 2 ================= -->
        <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;page-break-before:always;break-before:page;">

          <ol start="11" style="padding-left:20px;margin:0 0 10px;">
            <li style="margin-bottom:6px;text-align:justify;">For any queries or grievances relating to the Offer, customers may write to us contact us at gandhitvsnashik@gmail.com.</li>
            <li style="margin-bottom:6px;text-align:justify;">The Dealership may amend these terms at any time. Any such change will apply prospectively only and will not affect a discount already confirmed to a customer.</li>
            <li style="margin-bottom:6px;text-align:justify;">Nothing in these terms, or in the acknowledgment below, limits or affects any right available to the customer under the Consumer Protection Act, 2019, or any other applicable law.</li>
          </ol>

          <div style="font-weight:bold;font-size:13px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Customer Acknowledgment &amp; Declaration</div>
          <p style="margin-bottom:8px;">I, the undersigned, confirm and declare that:</p>
          <ul style="list-style:none;padding-left:0;margin:0 0 12px;">
            <li style="margin-bottom:6px;text-align:justify;"><b>(a)</b> I have been shown and explained the above Terms &amp; Conditions, in a language I understand, before participating in the Offer &amp; I have voluntarily participated in the Dealer Scratch &amp; Win offer.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(b)</b> I have not paid, and have not been asked to pay, any amount over and above the standard price of the vehicle in order to participate in the Offer.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(c)</b> My decision to purchase this vehicle on finance was made independently, and my participation in the Offer is entirely voluntary.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(d)</b> I selected my scratch card of my own free will, and understand that the discount amount shown on it — between ₹3,000 and ₹10,000 — was determined randomly.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(e)</b> The discount amount revealed on my card is ₹_______________________, which I accept as final and understand will be deducted from the deal amount / price in my vehicle's tax invoice.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(f)</b> I understand and acknowledge that, as no fee or other consideration was charged to me for the Offer, it is a promotional discount and not a lottery, prize competition, or game of chance requiring payment.</li>
          </ul>

          <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
            <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;"></div>
            <div style="font-size:11.5px;font-weight:bold;">Signature of Customer</div>
            <div style="display:flex;align-items:flex-end;margin-top:10px;">
              <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Full Name (Block Letters):</span>
              <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span>
            </div>
            <div style="display:flex;align-items:flex-end;">
              <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Date:</span>
              <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
              <span style="font-weight:bold;white-space:nowrap;margin:0 6px 0 10px;min-width:60px;">Place:</span>
              <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">Sangamner</span>
            </div>
          </div>

          <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
            <p style="font-weight:bold;margin-bottom:8px;">For GANDHI MOTORS PVT. LTD.</p>
            <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;width:60%;"></div>
            <div style="font-size:11.5px;font-weight:bold;">Signature of Dealership Manager / Representative</div>
            <div style="display:flex;align-items:flex-end;margin-top:10px;width:60%;">
              <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Name &amp; Designation:</span>
              <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;"></span>
            </div>
            <div style="display:flex;align-items:flex-end;width:60%;">
              <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span>
              <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Isolated iframe (off-screen horizontally, NOT vertically) so html2canvas
    // measures the form at its natural size, uncontaminated by the modal's
    // body-lock transform on the parent document.
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.style.top = '0';
    iframe.style.border = '0';
    iframe.style.width = '900px';
    iframe.style.height = '1400px';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentDocument;
    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;">${innerHtml}</body></html>`);
    frameDoc.close();

    // Wait for layout to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find the form element (the wrapper we wrote in)
    const pageEl = frameDoc.getElementById('scheme-form-page');

    setIsGeneratingSchemeForm(true);
    try {
      const html2pdf = await loadHtml2Pdf();
      await html2pdf()
        .set({
          margin: 0,
          filename: `Scratch_Win_Customer_Acknowledgment_${bookingNumber || 'form'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page + .pdf-page', avoid: '.pdf-page' },
        })
        .from(pageEl)
        .save();
    } catch (err) {
      console.error('Scheme form PDF generation failed:', err);
      alert('Could not generate the scheme form PDF. Please try again.');
    } finally {
      document.body.removeChild(iframe);
      setIsGeneratingSchemeForm(false);
    }
  };

  // If booking is not available, don't render the modal content
  if (!booking) {
    return null;
  }

  return (
    <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
      <CModalHeader>
        <h5 className="modal-title mb-0">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
      </CModalHeader>

      {/* Error message display at the top */}
      {errorMessage && (
        <div className="p-3 border-bottom">
          <CAlert
            color="danger"
            className="mb-0 position-relative"
            style={{ paddingRight: '40px' }}
          >
            {errorMessage}
            <CCloseButton
              className="position-absolute"
              style={{ top: '10px', right: '10px' }}
              onClick={onClearError}
            />
          </CAlert>
        </div>
      )}

      <CModalBody>
        {hasClaim === null ? (
          <div className="text-center">
            <h5>Is there any claim?</h5>
            <div className="d-flex justify-content-center mt-3">
              <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
                Yes
              </CButton>
              <CButton color="secondary" onClick={() => setHasClaim(false)}>
                No
              </CButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <CFormLabel>Model: {booking?.model?.model_name || 'N/A'}</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Color: {booking?.color?.name || 'N/A'}</CFormLabel>
            </div>

            {/* Show scheme badge + Yes/No toggle + Download button (only when scheme is active) */}
            {hasScheme && (
              <div className="mb-3">
                <span
                  style={{
                    backgroundColor: '#28a745',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}
                >
                  Scratch &amp; Win Scheme Active
                </span>

                {/* Scheme download toggle + button */}
                <div
                  className="mt-3 p-3 border rounded d-flex flex-wrap align-items-center justify-content-between"
                  style={{ backgroundColor: '#f8fff9', borderColor: '#c3e6cb' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
                      Download Scheme Form?
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <CFormCheck
                        inline
                        type="radio"
                        name="showSchemeDownload"
                        id="showSchemeDownloadYes"
                        label="Yes"
                        checked={showSchemeDownload === 'YES'}
                        onChange={() => setShowSchemeDownload('YES')}
                        style={{ fontSize: '13px' }}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="showSchemeDownload"
                        id="showSchemeDownloadNo"
                        label="No"
                        checked={showSchemeDownload === 'NO'}
                        onChange={() => setShowSchemeDownload('NO')}
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  {showSchemeDownload === 'YES' && (
                    <CButton
                      size="sm"
                      onClick={handleDownloadSchemeForm}
                      disabled={isGeneratingSchemeForm}
                      title="Download Scratch & Win Scheme Form"
                      style={{
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: '13px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(40, 167, 69, 0.35)',
                        whiteSpace: 'nowrap',
                        opacity: isGeneratingSchemeForm ? 0.7 : 1
                      }}
                    >
                      {isGeneratingSchemeForm ? (
                        <CSpinner size="sm" />
                      ) : (
                        <CIcon icon={cilCloudDownload} />
                      )}
                      {isGeneratingSchemeForm ? 'Preparing PDF...' : 'Download Scheme Form'}
                    </CButton>
                  )}
                </div>
              </div>
            )}

            {/* Show is_deviation field for both CASH and FINANCE payment types */}
            {(isCashPayment || isFinanceBooking) && (
              <div
                className="mb-3"
                style={{
                  border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
                  transition: 'all 0.3s ease'
                }}
              >
                <CFormCheck
                  id="isDeviation"
                  label="Is Deviation?"
                  checked={isDeviation === 'YES'}
                  onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
                  style={{
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    color: isDeviation === 'YES' ? '#28a745' : '#d93025',
                    accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
                  }}
                />
              </div>
            )}

            <div className="mb-3">
              <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>

              {/* Show branch info */}
              {!loadingChassisNumbers && availableChassisNumbers.length > 0 && branchName && (
                <div className="mb-2">
                  <small className="text-info">
                    <CIcon icon={cilLocationPin} className="me-1" />
                    Showing chassis numbers from {branchName} branch only
                  </small>
                </div>
              )}

              {loadingChassisNumbers ? (
                <div className="text-center">
                  <CSpinner size="sm" />
                  <span className="ms-2">Loading chassis numbers...</span>
                </div>
              ) : availableChassisNumbers.length > 0 ? (
                <>
                  <Select
                    id="chassisNumber"
                    name="chassisNumber"
                    placeholder="Search chassis number..."
                    value={chassisOptions.find(option => option.value === chassisNumber) || null}
                    onChange={(selected) => setChassisNumber(selected ? selected.value : '')}
                    options={chassisOptions}
                    styles={selectStyles}
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No chassis numbers available"}
                    classNamePrefix="react-select"
                    className={`react-select-container ${chassisNumber ? 'valid-input' : ''}`}
                  />

                  {/* Display Engine Number when chassis is selected */}
                  {selectedChassisDetails && (
                    <div className="mt-2 p-2 bg-light border rounded">
                      <div className="d-flex align-items-center">
                        <strong className="me-2">Engine Number:</strong>
                        <span className="text-primary fw-bold">
                          {selectedChassisDetails.engineNumber || 'N/A'}
                        </span>
                      </div>
                      {selectedChassisDetails.location?.name && (
                        <div className="mt-1 small text-muted">
                          Location: {selectedChassisDetails.location.name}
                          {selectedChassisDetails.location?.type === 'godown' ? ' (Godown)' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
                  {!isUpdate && branchName && (
                    <div className="alert alert-warning mt-2">
                      <CIcon icon={cilWarning} className="me-2" />
                      No chassis numbers available in {branchName} branch for this model and color combination.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Non-FIFO Selection Note (the only extra field now — Reason field removed) */}
            {showNonFifoNote && (
              <div className="mb-3">
                <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
                <CFormTextarea
                  id="nonFifoReason"
                  value={nonFifoReason}
                  onChange={(e) => {
                    setNonFifoReason(e.target.value);
                    if (e.target.value.trim()) {
                      setNonFifoError(false);
                    }
                  }}
                  required
                  rows={3}
                />
                {nonFifoError && (
                  <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
                    Please enter note
                  </div>
                )}
              </div>
            )}

            {/* Update Reason Field (only for update mode) */}
            {isUpdate && (
              <div className="mb-3">
                <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
                <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
              </div>
            )}

            {/* Additional Fields Section */}
            <div className="mt-4 border-top pt-3">
              <h6>Additional Details</h6>

              {/* RSA Opt In */}
              <div className="mb-3">
                <CFormLabel>RSA Opt In</CFormLabel>
                <div className="d-flex gap-3 mt-1">
                  <CFormCheck
                    id="rsaOptInYes"
                    label="Yes"
                    checked={rsaOptIn === 'YES'}
                    onChange={() => setRsaOptIn('YES')}
                  />
                  <CFormCheck
                    id="rsaOptInNo"
                    label="No"
                    checked={rsaOptIn === 'NO'}
                    onChange={() => setRsaOptIn('NO')}
                  />
                </div>
              </div>

              {/* Extended Warranty */}
              <div className="mb-3">
                <CFormLabel>Extended Warranty</CFormLabel>
                <div className="d-flex gap-3 mt-1">
                  <CFormCheck
                    id="extendedWarrantyYes"
                    label="Yes"
                    checked={extendedWarranty === 'YES'}
                    onChange={() => setExtendedWarranty('YES')}
                  />
                  <CFormCheck
                    id="extendedWarrantyNo"
                    label="No"
                    checked={extendedWarranty === 'NO'}
                    onChange={() => setExtendedWarranty('NO')}
                  />
                </div>
              </div>

              {/* Insurance Addons - Always visible */}
              <div className="mb-3">
                <CFormLabel htmlFor="insuranceAddons">Insurance Addons</CFormLabel>
                <Select
                  id="insuranceAddons"
                  name="insuranceAddons"
                  placeholder="Select insurance addons..."
                  value={insuranceAddonOptions.filter(option => insuranceAddons.includes(option.value))}
                  onChange={(selected) => {
                    setInsuranceAddons(selected ? selected.map(opt => opt.value) : []);
                  }}
                  options={insuranceAddonOptions}
                  styles={insuranceSelectStyles}
                  isMulti
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "No addons available"}
                  classNamePrefix="react-select"
                />
                <small className="text-muted mt-1 d-block">
                  Select one or more insurance addons
                </small>
              </div>
            </div>

            {hasClaim && (
              <div className="mt-4 border-top pt-3">
                <h5>Claim Details</h5>
                <div className="mb-3">
                  <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="claimPrice"
                    value={claimDetails.price}
                    onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
                    placeholder="Enter claim amount"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
                  <CFormTextarea
                    id="claimDescription"
                    value={claimDetails.description}
                    onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
                    placeholder="Enter claim description"
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Documents (Max 6)</CFormLabel>
                  <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
                  <small className="text-muted">You can upload images, PDFs, or Word documents</small>

                  {documentPreviews.length > 0 && (
                    <div className="mt-2">
                      <h6>Uploaded Documents:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {documentPreviews.map((doc, index) => (
                          <div key={index} className="position-relative" style={{ width: '100px' }}>
                            <img
                              src={doc.url}
                              alt={doc.name}
                              className="img-thumbnail"
                              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                            />
                            <button
                              className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                              onClick={() => removeDocument(index)}
                              style={{ transform: 'translate(50%, -50%)' }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {claimDetails.documents.filter((d) => !d.type?.startsWith('image/')).length > 0 && (
                    <div className="mt-2">
                      <h6>Other Files:</h6>
                      <ul>
                        {claimDetails.documents
                          .filter((d) => !d.type?.startsWith('image/'))
                          .map((doc, index) => (
                            <li key={index} className="d-flex align-items-center">
                              {doc.name}
                              <button
                                className="btn btn-sm btn-danger ms-2"
                                onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CModalBody>
      {hasClaim !== null && (
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
            Cancel
          </CButton>
          <CButton
            className='submit-button'
            onClick={handleSubmit}
            disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </CButton>
        </CModalFooter>
      )}
    </CModal>
  );
};

export default ChassisNumberModal;










// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CButton,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CFormCheck,
//   CAlert,
//   CCloseButton,
//   CInputGroup,
//   CInputGroupText,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLocationPin, cilWarning, cilSearch } from '@coreui/icons';
// import axiosInstance from '../../../axiosInstance';
// import Select from 'react-select';
// import '../../../css/form.css';

// const ChassisNumberModal = ({ 
//   show, 
//   onClose, 
//   onSave, 
//   isLoading, 
//   booking, 
//   isUpdate = false,
//   errorMessage = '',
//   onClearError = () => {}
// }) => {
//   const [chassisNumber, setChassisNumber] = useState('');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]); 
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);
//   const [isDeviation, setIsDeviation] = useState('NO');
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');
//   const [showReasonField, setShowReasonField] = useState(false);
//   const [nonFifoError, setNonFifoError] = useState(false);
  
//   // NEW STATE for additional fields
//   const [rsaOptIn, setRsaOptIn] = useState('YES');
//   const [extendedWarranty, setExtendedWarranty] = useState('NO');
//   const [insuranceAddons, setInsuranceAddons] = useState([]);
  
//   // State for selected chassis details
//   const [selectedChassisDetails, setSelectedChassisDetails] = useState(null);

//   // Insurance Addon options
//   const insuranceAddonOptions = [
//     { value: 'ZERO_DEPRECIATION', label: 'Zero Depreciation' },
//     { value: 'RETURN_TO_INVOICE', label: 'Return to Invoice' },
//     { value: 'CONSUMABLES', label: 'Consumables' },
//     { value: 'KEY_PROTECT', label: 'Key Protect' },
//     { value: 'TYRE_WHEEL_RIM_PROTECT', label: 'Tyre & Wheel Rim Protect' },
//     { value: 'EXTRA_TOWING', label: 'Extra Towing' },
//   ];

//   // Add safe access for booking properties
//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';
//   const isFinanceBooking = booking?.payment?.type?.toLowerCase() === 'finance';
  
//   // Safe branch name access
//   const branchName = booking?.branch?.name || '';

//   useEffect(() => {
//     if (show && booking) {
//       setChassisNumber(booking?.chassisNumber || '');
//       setReason('');
//       setHasClaim(null);
//       setClaimDetails({
//         price: '',
//         description: '',
//         documents: []
//       });
//       setDocumentPreviews([]);
//       setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
//       setShowNonFifoNote(false);
//       setNonFifoReason('');
//       setShowReasonField(false);
//       setNonFifoError(false);
//       setSelectedChassisDetails(null);
      
//       // NEW: Reset additional fields
//       setRsaOptIn(booking?.rsaOptIn || 'YES');
//       setExtendedWarranty(booking?.extendedWarranty || 'NO');
//       setInsuranceAddons(booking?.insuranceAddons || []);
      
//       fetchAvailableChassisNumbers();
//     }
//   }, [show, booking]);

//   // Auto-clear error after 10 seconds
//   useEffect(() => {
//     if (errorMessage && show) {
//       const timer = setTimeout(() => {
//         onClearError();
//       }, 10000); // 10 seconds
      
//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage, show, onClearError]);

//   // Update selected chassis details when chassisNumber changes
//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selected = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//       setSelectedChassisDetails(selected || null);
//     } else {
//       setSelectedChassisDetails(null);
//     }
//   }, [chassisNumber, availableChassisData]);

//   useEffect(() => {
//     if (booking && chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
//       console.log('Selected Chassis:', selectedChassis);
//       console.log('Booking ID:', booking?._id);
//       console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
//       if (selectedChassis) {
//         const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
//         if (selectedChassis.status === 'booked') {
//           console.log('Booked chassis - no note or reason field');
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//           return;
//         }
        
//         if (selectedChassis.status === 'in_stock') {
//           const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
//           console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
//           if (hasCurrentChassisInList) {
//             if (isCurrentChassis) {
//               console.log('Current chassis selected - show note field only');
//               setShowNonFifoNote(true);
//               setShowReasonField(false);
//             } else {
//               console.log('Non-current chassis selected (current exists) - show BOTH fields');
//               setShowNonFifoNote(true);
//               setShowReasonField(true);
//             }
//           } else {
//             console.log('No current chassis in list');
            
//             const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
//             if (inStockChassis.length > 0) {
//               const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//               const oldestInStockChassis = sortedInStock[0];
              
//               console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
//               setShowNonFifoNote(true);
              
//               const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
//               console.log('Should show reason field?', shouldShowReason);
              
//               setShowReasonField(shouldShowReason);
              
//               if (!shouldShowReason) {
//                 setNonFifoReason('');
//               }
//             }
//           }
//         } else {
//           setShowNonFifoNote(false);
//           setShowReasonField(false);
//         }
//       }
//     } else {
//       setShowNonFifoNote(false);
//       setShowReasonField(false);
//     }
//   }, [chassisNumber, availableChassisData, booking]);

//   const fetchAvailableChassisNumbers = async () => {
//     // Don't fetch if booking is not available
//     if (!booking || !booking.model || !booking.color) {
//       console.log('Booking data not available yet');
//       return;
//     }

//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       console.log('API Response:', availableData);
      
//       // Get the booking's branch ID
//       const bookingBranchId = booking.branch?._id;
//       console.log('Booking Branch ID:', bookingBranchId);

//       // Filter chassis numbers to only show those from the same branch
//       const filteredData = availableData.filter((chassis) => {
//         // Check if location exists and has id, then compare with booking's branch ID
//         const chassisBranchId = chassis.location?.id;
//         const isSameBranch = chassisBranchId === bookingBranchId;
        
//         console.log(`Chassis ${chassis.chassisNumber}:`, {
//           chassisBranchId,
//           bookingBranchId,
//           isSameBranch
//         });
        
//         return isSameBranch;
//       });

//       console.log('Filtered Chassis Numbers (Same Branch):', filteredData);

//       // Sort by ageInDays (descending) - oldest first (FIFO)
//       const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);
      
//       // Store the full data
//       setAvailableChassisData(sortedData);

//       // Extract just the chassis number strings from the objects
//       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

//       // Auto-select the oldest chassis (FIFO) if not in update mode
//       if (!isUpdate && sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }

//       // If in update mode and the current chassis is not in the filtered list,
//       // we should still include it (it might be from a different branch or location)
//       if (isUpdate && booking.chassisNumber) {
//         // Check if current chassis is in the filtered list
//         const currentChassisInFiltered = filteredData.some(
//           (chassis) => chassis.chassisNumber === booking.chassisNumber
//         );
        
//         if (!currentChassisInFiltered) {
//           // Add current chassis to the list
//           setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
          
//           // Also add current chassis to the data array for display
//           const currentChassisData = {
//             chassisNumber: booking.chassisNumber, 
//             age: 'Current', 
//             ageInDays: 0, 
//             addedDate: 'Current',
//             status: 'allocated',
//             isBookedOrBlocked: false,
//             eligibilityMessage: 'Current Allocation',
//             allocatedBooking: booking._id,
//             location: {
//               id: booking.branch?._id,
//               name: booking.branch?.name,
//               type: 'branch'
//             },
//             engineNumber: booking.engineNumber || 'N/A'
//           };
          
//           setAvailableChassisData((prev) => [currentChassisData, ...prev]);
//         }
//       }

//       // Show a warning if no chassis numbers are available in the same branch
//       if (filteredData.length === 0 && !isUpdate) {
//         console.warn('No chassis numbers available in the same branch');
//       }

//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   // Prepare options for react-select
//   const chassisOptions = useMemo(() => {
//     return availableChassisData.map(chassis => {
//       const isCurrentChassis = booking ? chassis.allocatedBooking === booking?._id : false;
      
//       let displayText;
//       let ageText = '';
//       let locationText = '';

//       // Add location info if available
//       if (chassis.location?.name) {
//         locationText = ` - ${chassis.location.name}`;
//       }

//       if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
//         const days = chassis.ageInDays;
//         ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
//       } else if (locationText) {
//         // If no age but has location, show just location
//         ageText = locationText;
//       }
      
//       if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
//         displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
//       } else {
//         displayText = `${chassis.chassisNumber}${ageText}`;
//       }
      
//       if (isCurrentChassis) {
//         displayText = `${chassis.chassisNumber} (Current)${ageText}`;
//       }
      
//       return {
//         value: chassis.chassisNumber,
//         label: displayText,
//         engineNumber: chassis.engineNumber || 'N/A',
//         isCurrent: isCurrentChassis
//       };
//     });
//   }, [availableChassisData, booking]);

//   // Custom styles for react-select
//   const selectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? '#80bdff' : '#ced4da',
//       boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
//       '&:hover': {
//         borderColor: '#80bdff'
//       }
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected 
//         ? '#007bff' 
//         : state.isFocused 
//           ? '#f8f9fa' 
//           : null,
//       color: state.isSelected ? 'white' : '#495057',
//       cursor: 'pointer',
//       ':active': {
//         backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
//       }
//     }),
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999
//     })
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       return;
//     }

//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
//     imageFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!booking) {
//       console.error('Booking data is missing');
//       return;
//     }

//     if (!chassisNumber.trim()) {
//       return;
//     }
    
//     // Check note field when it's visible
//     if (showNonFifoNote && (!nonFifoReason || !nonFifoReason.trim())) {
//       setNonFifoError(true);
//       return;
//     } else {
//       setNonFifoError(false);
//     }
    
//     // Get selected chassis
//     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    
//     // Check if it's current chassis (allocatedBooking matches bookingId)
//     const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
    
//     // Check if there's any current chassis in the ENTIRE list
//     const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
    
//     // Validate reason param field (when shown)
//     if (showReasonField && !reason.trim()) {
//       return;
//     }
    
//     // In update mode, always require update reason
//     if (isUpdate && !reason.trim()) {
//       return;
//     }
    
//     // Additional validation based on scenario
//     if (selectedChassis && selectedChassis.status === 'in_stock') {
//       // Scenario 1: When there is current chassis in list
//       if (hasCurrentChassisInList) {
//         if (isCurrentChassis) {
//           // Current chassis: requires note only
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//         } else {
//           // Non-current chassis (after current): requires both note AND reason
//           if (!nonFifoReason.trim()) {
//             setNonFifoError(true);
//             return;
//           }
//           if (!reason.trim()) {
//             return;
//           }
//         }
//       } else {
//         const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
//         if (inStockChassis.length > 0) {
//           // Sort to find the oldest
//           const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
//           const oldestInStockChassis = sortedInStock[0];
          
//           // Oldest chassis: requires note only
//           if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//           } else {
//             // Non-oldest chassis: requires both note AND reason
//             if (!nonFifoReason.trim()) {
//               setNonFifoError(true);
//               return;
//             }
//             if (!reason.trim()) {
//               return;
//             }
//           }
//         }
//       }
//     }

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(reason.trim() && { reason: reason.trim() }), 
//       ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
//       ...(hasClaim && {
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       }),
//       ...((isCashPayment || isFinanceBooking) && { is_deviation: isDeviation }),
//       // Include engine number if available
//       ...(selectedChassisDetails?.engineNumber && { engineNumber: selectedChassisDetails.engineNumber }),
//       // NEW: Include additional fields - ALWAYS include these fields
//       rsaOptIn: rsaOptIn,
//       extendedWarranty: extendedWarranty,
//       insuranceAddons: insuranceAddons.length > 0 ? insuranceAddons : [],
//       hasClaim: hasClaim || false,
//     };

//     console.log('Final Payload:', payload);

//     onSave(payload);
//   };

//   const handleCloseModal = () => {
//     // Reset form state
//     setHasClaim(null);
//     setShowNonFifoNote(false);
//     setShowReasonField(false);
//     setNonFifoReason('');
//     setNonFifoError(false);
//     setClaimDetails({
//       price: '',
//       description: '',
//       documents: []
//     });
//     setDocumentPreviews([]);
//     setSelectedChassisDetails(null);
    
//     // NEW: Reset additional fields
//     setRsaOptIn('YES');
//     setExtendedWarranty('NO');
//     setInsuranceAddons([]);
    
//     onClose();
//   };

//   // If booking is not available, don't render the modal content
//   if (!booking) {
//     return null;
//   }

//   return (
//     <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>
      
//       {/* Error message display at the top */}
//       {errorMessage && (
//         <div className="p-3 border-bottom">
//           <CAlert 
//             color="danger" 
//             className="mb-0 position-relative"
//             style={{ paddingRight: '40px' }}
//           >
//             {errorMessage}
//             <CCloseButton 
//               className="position-absolute" 
//               style={{ top: '10px', right: '10px' }}
//               onClick={onClearError}
//             />
//           </CAlert>
//         </div>
//       )}
      
//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
//                 Yes
//               </CButton>
//               <CButton color="secondary" onClick={() => setHasClaim(false)}>
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name || 'N/A'}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name || 'N/A'}</CFormLabel>
//             </div>

//             {/* NEW: Additional Fields Section - MOVED ABOVE CHASSIS DROPDOWN */}
//             <div className="mb-3 p-3 border rounded bg-light">
//               <h6 className="mb-3">Additional Details</h6>
              
//               {/* RSA Opt In and Extended Warranty - SIDE BY SIDE */}
//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <CFormLabel>RSA Opt In</CFormLabel>
//                   <div className="d-flex gap-3 mt-1">
//                     <CFormCheck
//                       id="rsaOptInYes"
//                       label="Yes"
//                       checked={rsaOptIn === 'YES'}
//                       onChange={() => setRsaOptIn('YES')}
//                     />
//                     <CFormCheck
//                       id="rsaOptInNo"
//                       label="No"
//                       checked={rsaOptIn === 'NO'}
//                       onChange={() => setRsaOptIn('NO')}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <CFormLabel>Extended Warranty</CFormLabel>
//                   <div className="d-flex gap-3 mt-1">
//                     <CFormCheck
//                       id="extendedWarrantyYes"
//                       label="Yes"
//                       checked={extendedWarranty === 'YES'}
//                       onChange={() => setExtendedWarranty('YES')}
//                     />
//                     <CFormCheck
//                       id="extendedWarrantyNo"
//                       label="No"
//                       checked={extendedWarranty === 'NO'}
//                       onChange={() => setExtendedWarranty('NO')}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Insurance Addons - 3 per row */}
//               <div className="mb-3">
//                 <CFormLabel>Insurance Addons</CFormLabel>
//                 <div className="row mt-2">
//                   {insuranceAddonOptions.map((option) => (
//                     <div className="col-md-4 col-6" key={option.value}>
//                       <CFormCheck
//                         id={`insurance-${option.value}`}
//                         label={option.label}
//                         checked={insuranceAddons.includes(option.value)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setInsuranceAddons([...insuranceAddons, option.value]);
//                           } else {
//                             setInsuranceAddons(insuranceAddons.filter(item => item !== option.value));
//                           }
//                         }}
//                         className="mb-1"
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <small className="text-muted mt-1 d-block">
//                   Select one or more insurance addons
//                 </small>
//               </div>
//             </div>

//             {/* Show is_deviation field for both CASH and FINANCE payment types */}
//             {(isCashPayment || isFinanceBooking) && (
//               <div
//                 className="mb-3"
//                 style={{
//                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <CFormCheck
//                   id="isDeviation"
//                   label="Is Deviation?"
//                   checked={isDeviation === 'YES'}
//                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: '1.1rem',
//                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
//                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
//                   }}
//                 />
//               </div>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              
//               {/* Show branch info */}
//               {!loadingChassisNumbers && availableChassisNumbers.length > 0 && branchName && (
//                 <div className="mb-2">
//                   <small className="text-info">
//                     <CIcon icon={cilLocationPin} className="me-1" />
//                     Showing chassis numbers from {branchName} branch only
//                   </small>
//                 </div>
//               )}
              
//               {loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <>
//                   <Select
//                     id="chassisNumber"
//                     name="chassisNumber"
//                     placeholder="Search chassis number..."
//                     value={chassisOptions.find(option => option.value === chassisNumber) || null}
//                     onChange={(selected) => setChassisNumber(selected ? selected.value : '')}
//                     options={chassisOptions}
//                     styles={selectStyles}
//                     isClearable
//                     isSearchable
//                     noOptionsMessage={() => "No chassis numbers available"}
//                     classNamePrefix="react-select"
//                     className={`react-select-container ${chassisNumber ? 'valid-input' : ''}`}
//                   />
                  
//                   {/* Display Engine Number when chassis is selected */}
//                   {selectedChassisDetails && (
//                     <div className="mt-2 p-2 bg-light border rounded">
//                       <div className="d-flex align-items-center">
//                         <strong className="me-2">Engine Number:</strong>
//                         <span className="text-primary fw-bold">
//                           {selectedChassisDetails.engineNumber || 'N/A'}
//                         </span>
//                       </div>
//                       {selectedChassisDetails.location?.name && (
//                         <div className="mt-1 small text-muted">
//                           Location: {selectedChassisDetails.location.name}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="text-danger mb-2">No chassis numbers available for this model and color combination</div>
//                   {!isUpdate && branchName && (
//                     <div className="alert alert-warning mt-2">
//                       <CIcon icon={cilWarning} className="me-2" />
//                       No chassis numbers available in {branchName} branch for this model and color combination.
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Non-FIFO Selection Note */}
//             {showNonFifoNote && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="nonFifoReason" 
//                   value={nonFifoReason} 
//                   onChange={(e) => {
//                     setNonFifoReason(e.target.value);
//                     if (e.target.value.trim()) {
//                       setNonFifoError(false);
//                     }
//                   }} 
//                   required 
//                   rows={3}
//                 />
//                 {nonFifoError && (
//                   <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
//                     Please enter note
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Reason Field (param) - Show only for certain conditions */}
//             {showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="reason" 
//                   value={reason} 
//                   onChange={(e) => setReason(e.target.value)} 
//                   required 
//                   rows={3}
//                 />
//               </div>
//             )}

//             {/* Update Reason Field (only for update mode and not shown above) */}
//             {isUpdate && !showReasonField && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
//               </div>
//             )}

//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{ width: '100px' }}>
//                             <img
//                               src={doc.url}
//                               alt={doc.name}
//                               className="img-thumbnail"
//                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{ transform: 'translate(50%, -50%)' }}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {claimDetails.documents.filter((d) => !d.type?.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter((d) => !d.type?.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             className='submit-button'
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;