// // import React from 'react';
// // import {
// //   CModal,
// //   CModalHeader,
// //   CModalTitle,
// //   CModalBody,
// //   CModalFooter,
// //   CButton,
// //   CRow,
// //   CCol,
// //   CCard,
// //   CCardBody,
// //   CBadge
// // } from '@coreui/react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import {
// //   faUser,
// //   faMapMarkerAlt,
// //   faPhone,
// //   faIdCard,
// //   faFileInvoice,
// //   faPalette,
// //   faCog,
// //   faCar,
// //   faBarcode,
// //   faQrcode,
// //   faUserTie,
// //   faCalendarAlt
// // } from '@fortawesome/free-solid-svg-icons';
// // import '../../../css/viewBookingModal.css'; // Create this CSS file for custom styles

// // function ViewPendingBookingModal({ show, onClose, bookingData }) {
// //   if (!bookingData) return null;

// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString('en-GB', {
// //       day: '2-digit',
// //       month: '2-digit',
// //       year: 'numeric'
// //     });
// //   };

// //   const calculateAge = (dobString) => {
// //     if (!dobString) return null;
    
// //     const dob = new Date(dobString);
// //     const today = new Date();
    
// //     let age = today.getFullYear() - dob.getFullYear();
// //     const monthDiff = today.getMonth() - dob.getMonth();
    
// //     // Adjust age if birthday hasn't occurred this year
// //     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
// //       age--;
// //     }
    
// //     return age;
// //   };

// //   const getNomineeAge = () => {
// //     if (!bookingData.customerDetails?.nomineeDob) return null;
    
// //     const age = calculateAge(bookingData.customerDetails.nomineeDob);
// //     return age !== null ? `${age} years` : null;
// //   };

// //   return (
// //     <CModal 
// //       alignment="center" 
// //       visible={show} 
// //       onClose={onClose}
// //       size="lg"
// //       className="view-booking-modal"
// //     >
// //       <CModalHeader className="bg-primary text-white">
// //         <CModalTitle>
// //           <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
// //           Booking Details - {bookingData.bookingNumber}
// //         </CModalTitle>
// //       </CModalHeader>
      
// //       <CModalBody>
// //         {/* Customer Information Card */}
// //         <CCard className="mb-3 border-0 shadow-sm">
// //           <CCardBody>
// //             <h5 className="card-title text-primary mb-3">
// //               <FontAwesomeIcon icon={faUser} className="me-2" />
// //               Customer Information
// //             </h5>
            
// //             <CRow className="g-3">
// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>Customer Name</label>
// //                   <p className="fw-bold">
// //                     {bookingData.customerDetails?.salutation || ''} {bookingData.customerDetails?.name || 'N/A'}
// //                   </p>
// //                 </div>
// //               </CCol>
              
// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>Customer ID</label>
// //                   <p className="fw-bold">{bookingData.customerDetails?.custId || 'N/A'}</p>
// //                 </div>
// //               </CCol>

// //               <CCol md={12}>
// //                 <div className="info-group">
// //                   <label>
// //                     <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 text-secondary" />
// //                     Address
// //                   </label>
// //                   <p>{bookingData.customerDetails?.address || 'N/A'}</p>
// //                   <small className="text-muted">
// //                     {bookingData.customerDetails?.taluka || ''} {bookingData.customerDetails?.district || ''} - {bookingData.customerDetails?.pincode || ''}
// //                   </small>
// //                 </div>
// //               </CCol>

// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>
// //                     <FontAwesomeIcon icon={faPhone} className="me-1 text-success" />
// //                     Mobile Numbers
// //                   </label>
// //                   <p className="mb-1">{bookingData.customerDetails?.mobile1 || 'N/A'}</p>
// //                   {bookingData.customerDetails?.mobile2 && (
// //                     <p className="mb-0">{bookingData.customerDetails.mobile2}</p>
// //                   )}
// //                 </div>
// //               </CCol>

// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>
// //                     <FontAwesomeIcon icon={faIdCard} className="me-1 text-info" />
// //                     Identity Documents
// //                   </label>
// //                   <p className="mb-1">
// //                     <span className="badge bg-light text-dark me-2">PAN:</span> 
// //                     {bookingData.customerDetails?.panNo || 'N/A'}
// //                   </p>
// //                   <p className="mb-0">
// //                     <span className="badge bg-light text-dark me-2">Aadhar:</span> 
// //                     {bookingData.customerDetails?.aadharNumber || 'N/A'}
// //                   </p>
// //                 </div>
// //               </CCol>
// //             </CRow>
// //           </CCardBody>
// //         </CCard>

// //         {/* Vehicle Information Card */}
// //         <CCard className="mb-3 border-0 shadow-sm">
// //           <CCardBody>
// //             <h5 className="card-title text-success mb-3">
// //               <FontAwesomeIcon icon={faCar} className="me-2" />
// //               Vehicle Information
// //             </h5>
            
// //             <CRow className="g-3">
// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>Model Name</label>
// //                   <p className="fw-bold">{bookingData.modelDetails?.model_name || 'N/A'}</p>
// //                 </div>
// //               </CCol>

// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>
// //                     <FontAwesomeIcon icon={faPalette} className="me-1" />
// //                     Color
// //                   </label>
// //                   <p>
// //                     <CBadge color="info" className="px-3 py-1">
// //                       {bookingData.colorDetails?.name || 'N/A'}
// //                     </CBadge>
// //                   </p>
// //                 </div>
// //               </CCol>

// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>
// //                     <FontAwesomeIcon icon={faBarcode} className="me-1" />
// //                     Chassis Number
// //                   </label>
// //                   <p className="font-monospace">{bookingData.chassisNumber || 'N/A'}</p>
// //                 </div>
// //               </CCol>

// //               <CCol md={6}>
// //                 <div className="info-group">
// //                   <label>
// //                     <FontAwesomeIcon icon={faCog} className="me-1" />
// //                     Engine Number
// //                   </label>
// //                   <p className="font-monospace">{bookingData.engineNumber || 'N/A'}</p>
// //                 </div>
// //               </CCol>
// //             </CRow>
// //           </CCardBody>
// //         </CCard>

// //         {/* Additional Information Card */}
// //         {(bookingData.customerDetails?.nomineeName || 
// //           bookingData.customerDetails?.occupation || 
// //           bookingData.customerDetails?.dob ||
// //           bookingData.customerDetails?.nomineeDob) && (
// //           <CCard className="border-0 shadow-sm">
// //             <CCardBody>
// //               <h5 className="card-title text-secondary mb-3">
// //                 <FontAwesomeIcon icon={faUserTie} className="me-2" />
// //                 Additional Information
// //               </h5>
              
// //               <CRow className="g-3">
// //                 {bookingData.customerDetails?.occupation && (
// //                   <CCol md={4}>
// //                     <div className="info-group">
// //                       <label>
// //                         <FontAwesomeIcon icon={faUserTie} className="me-1" />
// //                         Occupation
// //                       </label>
// //                       <p>{bookingData.customerDetails.occupation}</p>
// //                     </div>
// //                   </CCol>
// //                 )}
                
// //                 {bookingData.customerDetails?.dob && (
// //                   <CCol md={4}>
// //                     <div className="info-group">
// //                       <label>
// //                         <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
// //                         Date of Birth
// //                       </label>
// //                       <p className="mb-1">{formatDate(bookingData.customerDetails.dob)}</p>
// //                       <small className="text-muted">
// //                         Age: {calculateAge(bookingData.customerDetails.dob)} years
// //                       </small>
// //                     </div>
// //                   </CCol>
// //                 )}
                
// //                 {bookingData.customerDetails?.nomineeName && (
// //                   <CCol md={4}>
// //                     <div className="info-group">
// //                       <label>
// //                         <FontAwesomeIcon icon={faUser} className="me-1" />
// //                         Nominee
// //                       </label>
// //                       <p className="mb-1">
// //                         {bookingData.customerDetails.nomineeName}
// //                         {bookingData.customerDetails.nomineeRelation && (
// //                           <span className="text-muted ms-1">
// //                             ({bookingData.customerDetails.nomineeRelation})
// //                           </span>
// //                         )}
// //                       </p>
// //                       {bookingData.customerDetails?.nomineeDob && (
// //                         <small className="text-muted d-block">
// //                           DOB: {formatDate(bookingData.customerDetails.nomineeDob)} | 
// //                           Age: {calculateAge(bookingData.customerDetails.nomineeDob)} years
// //                         </small>
// //                       )}
// //                     </div>
// //                   </CCol>
// //                 )}
// //               </CRow>
// //             </CCardBody>
// //           </CCard>
// //         )}
// //       </CModalBody>
      
// //       <CModalFooter>
// //         <CButton 
// //           color="secondary" 
// //           onClick={onClose}
// //           variant="outline"
// //         >
// //           Close
// //         </CButton>
// //       </CModalFooter>
// //     </CModal>
// //   );
// // }

// // export default ViewPendingBookingModal;




// import React from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CBadge
// } from '@coreui/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faUser,
//   faMapMarkerAlt,
//   faPhone,
//   faIdCard,
//   faFileInvoice,
//   faPalette,
//   faCog,
//   faCar,
//   faBarcode,
//   faQrcode,
//   faUserTie,
//   faCalendarAlt,
//   faMoneyBillWave,
//   faUniversity
// } from '@fortawesome/free-solid-svg-icons';
// import '../../../css/viewBookingModal.css'; // Create this CSS file for custom styles

// function ViewPendingBookingModal({ show, onClose, bookingData }) {
//   if (!bookingData) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const calculateAge = (dobString) => {
//     if (!dobString) return null;
    
//     const dob = new Date(dobString);
//     const today = new Date();
    
//     let age = today.getFullYear() - dob.getFullYear();
//     const monthDiff = today.getMonth() - dob.getMonth();
    
//     // Adjust age if birthday hasn't occurred this year
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//       age--;
//     }
    
//     return age;
//   };

//   const getPaymentTypeDisplay = () => {
//     if (!bookingData.payment) return 'N/A';
    
//     const { type, financer } = bookingData.payment;
    
//     if (type === 'CASH') {
//       return (
//         <div>
//           <CBadge color="success" className="px-3 py-1">
//             <FontAwesomeIcon icon={faMoneyBillWave} className="me-1" />
//             Cash
//           </CBadge>
//         </div>
//       );
//     } else if (type === 'FINANCE') {
//       return (
//         <div>
//           <CBadge color="primary" className="px-3 py-1 mb-2">
//             <FontAwesomeIcon icon={faUniversity} className="me-1" />
//             Finance
//           </CBadge>
//           {financer && (
//             <p className="mt-2 mb-0">
//               <strong>Financer:</strong> {financer}
//             </p>
//           )}
//         </div>
//       );
//     }
    
//     return type || 'N/A';
//   };

//   return (
//     <CModal 
//       alignment="center" 
//       visible={show} 
//       onClose={onClose}
//       size="lg"
//       className="view-booking-modal"
//     >
//       <CModalHeader className="bg-primary text-white">
//         <CModalTitle>
//           <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
//           Booking Details - {bookingData.bookingNumber}
//         </CModalTitle>
//       </CModalHeader>
      
//       <CModalBody>
//         {/* Payment Information Card - New Card */}
//         <CCard className="mb-3 border-0 shadow-sm">
//           <CCardBody>
//             <h5 className="card-title text-warning mb-3">
//               <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
//               Payment Information
//             </h5>
            
//             <CRow className="g-3">
//               <CCol md={12}>
//                 <div className="info-group">
//                   <label>Payment Type</label>
//                   {getPaymentTypeDisplay()}
//                 </div>
//               </CCol>
//             </CRow>
//           </CCardBody>
//         </CCard>

//         {/* Customer Information Card */}
//         <CCard className="mb-3 border-0 shadow-sm">
//           <CCardBody>
//             <h5 className="card-title text-primary mb-3">
//               <FontAwesomeIcon icon={faUser} className="me-2" />
//               Customer Information
//             </h5>
            
//             <CRow className="g-3">
//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>Customer Name</label>
//                   <p className="fw-bold">
//                     {bookingData.customerDetails?.salutation || ''} {bookingData.customerDetails?.name || 'N/A'}
//                   </p>
//                 </div>
//               </CCol>
              
//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>Customer ID</label>
//                   <p className="fw-bold">{bookingData.customerDetails?.custId || 'N/A'}</p>
//                 </div>
//               </CCol>

//               <CCol md={12}>
//                 <div className="info-group">
//                   <label>
//                     <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 text-secondary" />
//                     Address
//                   </label>
//                   <p>{bookingData.customerDetails?.address || 'N/A'}</p>
//                   <small className="text-muted">
//                     {bookingData.customerDetails?.taluka || ''} {bookingData.customerDetails?.district || ''} - {bookingData.customerDetails?.pincode || ''}
//                   </small>
//                 </div>
//               </CCol>

//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>
//                     <FontAwesomeIcon icon={faPhone} className="me-1 text-success" />
//                     Mobile Numbers
//                   </label>
//                   <p className="mb-1">{bookingData.customerDetails?.mobile1 || 'N/A'}</p>
//                   {bookingData.customerDetails?.mobile2 && (
//                     <p className="mb-0">{bookingData.customerDetails.mobile2}</p>
//                   )}
//                 </div>
//               </CCol>

//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>
//                     <FontAwesomeIcon icon={faIdCard} className="me-1 text-info" />
//                     Identity Documents
//                   </label>
//                   <p className="mb-1">
//                     <span className="badge bg-light text-dark me-2">PAN:</span> 
//                     {bookingData.customerDetails?.panNo || 'N/A'}
//                   </p>
//                   <p className="mb-0">
//                     <span className="badge bg-light text-dark me-2">Aadhar:</span> 
//                     {bookingData.customerDetails?.aadharNumber || 'N/A'}
//                   </p>
//                 </div>
//               </CCol>

//               {bookingData.customerDetails?.dob && (
//                 <CCol md={6}>
//                   <div className="info-group">
//                     <label>
//                       <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
//                       Date of Birth
//                     </label>
//                     <p>{formatDate(bookingData.customerDetails.dob)}</p>
//                   </div>
//                 </CCol>
//               )}
//             </CRow>
//           </CCardBody>
//         </CCard>

//         {/* Vehicle Information Card */}
//         <CCard className="mb-3 border-0 shadow-sm">
//           <CCardBody>
//             <h5 className="card-title text-success mb-3">
//               <FontAwesomeIcon icon={faCar} className="me-2" />
//               Vehicle Information
//             </h5>
            
//             <CRow className="g-3">
//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>Model Name</label>
//                   <p className="fw-bold">{bookingData.modelDetails?.model_name || 'N/A'}</p>
//                 </div>
//               </CCol>

//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>
//                     <FontAwesomeIcon icon={faPalette} className="me-1" />
//                     Color
//                   </label>
//                   <p>
//                     <CBadge color="info" className="px-3 py-1">
//                       {bookingData.colorDetails?.name || 'N/A'}
//                     </CBadge>
//                   </p>
//                 </div>
//               </CCol>

//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>
//                     <FontAwesomeIcon icon={faBarcode} className="me-1" />
//                     Chassis Number
//                   </label>
//                   <p className="font-monospace">{bookingData.chassisNumber || 'N/A'}</p>
//                 </div>
//               </CCol>

//               <CCol md={6}>
//                 <div className="info-group">
//                   <label>
//                     <FontAwesomeIcon icon={faCog} className="me-1" />
//                     Engine Number
//                   </label>
//                   <p className="font-monospace">{bookingData.engineNumber || 'N/A'}</p>
//                 </div>
//               </CCol>
//             </CRow>
//           </CCardBody>
//         </CCard>

//         {/* Additional Information Card */}
//         {(bookingData.customerDetails?.nomineeName || 
//           bookingData.customerDetails?.occupation) && (
//           <CCard className="border-0 shadow-sm">
//             <CCardBody>
//               <h5 className="card-title text-secondary mb-3">
//                 <FontAwesomeIcon icon={faUserTie} className="me-2" />
//                 Additional Information
//               </h5>
              
//               <CRow className="g-3">
//                 {bookingData.customerDetails?.occupation && (
//                   <CCol md={4}>
//                     <div className="info-group">
//                       <label>
//                         <FontAwesomeIcon icon={faUserTie} className="me-1" />
//                         Occupation
//                       </label>
//                       <p>{bookingData.customerDetails.occupation}</p>
//                     </div>
//                   </CCol>
//                 )}
                
//                 {bookingData.customerDetails?.nomineeName && (
//                   <CCol md={4}>
//                     <div className="info-group">
//                       <label>
//                         <FontAwesomeIcon icon={faUser} className="me-1" />
//                         Nominee
//                       </label>
//                       <p className="mb-1">
//                         {bookingData.customerDetails.nomineeName}
//                         {bookingData.customerDetails.nomineeRelation && (
//                           <span className="text-muted ms-1">
//                             ({bookingData.customerDetails.nomineeRelation})
//                           </span>
//                         )}
//                       </p>
//                       {bookingData.customerDetails?.nomineeAge && (
//                         <small className="text-muted d-block">
//                           Age: {bookingData.customerDetails.nomineeAge} years
//                         </small>
//                       )}
//                       {bookingData.customerDetails?.nomineeDob && !bookingData.customerDetails?.nomineeAge && (
//                         <small className="text-muted d-block">
//                           DOB: {formatDate(bookingData.customerDetails.nomineeDob)} | 
//                           Age: {calculateAge(bookingData.customerDetails.nomineeDob)} years
//                         </small>
//                       )}
//                     </div>
//                   </CCol>
//                 )}
//               </CRow>
//             </CCardBody>
//           </CCard>
//         )}
//       </CModalBody>
      
//       <CModalFooter>
//         <CButton 
//           color="secondary" 
//           onClick={onClose}
//           variant="outline"
//         >
//           Close
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   );
// }

// export default ViewPendingBookingModal;





import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CBadge
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faPhone,
  faIdCard,
  faFileInvoice,
  faPalette,
  faCog,
  faCar,
  faBarcode,
  faQrcode,
  faUserTie,
  faCalendarAlt,
  faMoneyBillWave,
  faUniversity
} from '@fortawesome/free-solid-svg-icons';
import '../../../css/viewBookingModal.css'; // Create this CSS file for custom styles

function ViewPendingBookingModal({ show, onClose, bookingData }) {
  if (!bookingData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    
    const dob = new Date(dobString);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  const getPaymentTypeDisplay = () => {
    if (!bookingData.payment) return 'N/A';
    
    const { type, financer } = bookingData.payment;
    
    if (type === 'CASH') {
      return (
        <div>
          <CBadge color="success" className="px-3 py-1">
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-1" />
            Cash
          </CBadge>
        </div>
      );
    } else if (type === 'FINANCE') {
      // Safely get financer name
      const financerName = financer ? (typeof financer === 'object' ? financer.name : financer) : null;
      
      return (
        <div>
          <CBadge color="primary" className="px-3 py-1 mb-2">
            <FontAwesomeIcon icon={faUniversity} className="me-1" />
            Finance
          </CBadge>
          {financerName && (
            <p className="mt-2 mb-0">
              <strong>Financer:</strong> {financerName}
            </p>
          )}
        </div>
      );
    }
    
    return type || 'N/A';
  };

  // Helper function to safely get color name
  const getColorName = () => {
    if (!bookingData.colorDetails) return 'N/A';
    
    // If colorDetails is an object with name property
    if (typeof bookingData.colorDetails === 'object' && bookingData.colorDetails.name) {
      return bookingData.colorDetails.name;
    }
    
    // If colorDetails is a string
    if (typeof bookingData.colorDetails === 'string') {
      return bookingData.colorDetails;
    }
    
    return 'N/A';
  };

  // Helper function to safely get model name
  const getModelName = () => {
    if (!bookingData.modelDetails) return 'N/A';
    
    // If modelDetails is an object with model_name property
    if (typeof bookingData.modelDetails === 'object' && bookingData.modelDetails.model_name) {
      return bookingData.modelDetails.model_name;
    }
    
    // If modelDetails is a string
    if (typeof bookingData.modelDetails === 'string') {
      return bookingData.modelDetails;
    }
    
    return 'N/A';
  };

  return (
    <CModal 
      alignment="center" 
      visible={show} 
      onClose={onClose}
      size="lg"
      className="view-booking-modal"
    >
      <CModalHeader className="bg-primary text-white">
        <CModalTitle>
          <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
          Booking Details - {bookingData.bookingNumber}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        {/* Payment Information Card */}
        <CCard className="mb-3 border-0 shadow-sm">
          <CCardBody>
            <h5 className="card-title text-warning mb-3">
              <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
              Payment Information
            </h5>
            
            <CRow className="g-3">
              <CCol md={12}>
                <div className="info-group">
                  <label>Payment Type</label>
                  {getPaymentTypeDisplay()}
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Customer Information Card */}
        <CCard className="mb-3 border-0 shadow-sm">
          <CCardBody>
            <h5 className="card-title text-primary mb-3">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Customer Information
            </h5>
            
            <CRow className="g-3">
              <CCol md={6}>
                <div className="info-group">
                  <label>Customer Name</label>
                  <p className="fw-bold">
                    {bookingData.customerDetails?.salutation || ''} {bookingData.customerDetails?.name || 'N/A'}
                  </p>
                </div>
              </CCol>
              
              <CCol md={6}>
                <div className="info-group">
                  <label>Customer ID</label>
                  <p className="fw-bold">{bookingData.customerDetails?.custId || 'N/A'}</p>
                </div>
              </CCol>

              <CCol md={12}>
                <div className="info-group">
                  <label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 text-secondary" />
                    Address
                  </label>
                  <p>{bookingData.customerDetails?.address || 'N/A'}</p>
                  <small className="text-muted">
                    {bookingData.customerDetails?.taluka || ''} {bookingData.customerDetails?.district || ''} - {bookingData.customerDetails?.pincode || ''}
                  </small>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="info-group">
                  <label>
                    <FontAwesomeIcon icon={faPhone} className="me-1 text-success" />
                    Mobile Numbers
                  </label>
                  <p className="mb-1">{bookingData.customerDetails?.mobile1 || 'N/A'}</p>
                  {bookingData.customerDetails?.mobile2 && (
                    <p className="mb-0">{bookingData.customerDetails.mobile2}</p>
                  )}
                </div>
              </CCol>

              <CCol md={6}>
                <div className="info-group">
                  <label>
                    <FontAwesomeIcon icon={faIdCard} className="me-1 text-info" />
                    Identity Documents
                  </label>
                  <p className="mb-1">
                    <span className="badge bg-light text-dark me-2">PAN:</span> 
                    {bookingData.customerDetails?.panNo || 'N/A'}
                  </p>
                  <p className="mb-0">
                    <span className="badge bg-light text-dark me-2">Aadhar:</span> 
                    {bookingData.customerDetails?.aadharNumber || 'N/A'}
                  </p>
                </div>
              </CCol>

              {bookingData.customerDetails?.dob && (
                <CCol md={6}>
                  <div className="info-group">
                    <label>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                      Date of Birth
                    </label>
                    <p>{formatDate(bookingData.customerDetails.dob)}</p>
                  </div>
                </CCol>
              )}
            </CRow>
          </CCardBody>
        </CCard>

        {/* Vehicle Information Card */}
        <CCard className="mb-3 border-0 shadow-sm">
          <CCardBody>
            <h5 className="card-title text-success mb-3">
              <FontAwesomeIcon icon={faCar} className="me-2" />
              Vehicle Information
            </h5>
            
            <CRow className="g-3">
              <CCol md={6}>
                <div className="info-group">
                  <label>Model Name</label>
                  <p className="fw-bold">{getModelName()}</p>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="info-group">
                  <label>
                    <FontAwesomeIcon icon={faPalette} className="me-1" />
                    Color
                  </label>
                  <p>
                    <CBadge color="info" className="px-3 py-1">
                      {getColorName()}
                    </CBadge>
                  </p>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="info-group">
                  <label>
                    <FontAwesomeIcon icon={faBarcode} className="me-1" />
                    Chassis Number
                  </label>
                  <p className="font-monospace">{bookingData.chassisNumber || 'N/A'}</p>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="info-group">
                  <label>
                    <FontAwesomeIcon icon={faCog} className="me-1" />
                    Engine Number
                  </label>
                  <p className="font-monospace">{bookingData.engineNumber || 'N/A'}</p>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Additional Information Card */}
        {(bookingData.customerDetails?.nomineeName || 
          bookingData.customerDetails?.occupation) && (
          <CCard className="border-0 shadow-sm">
            <CCardBody>
              <h5 className="card-title text-secondary mb-3">
                <FontAwesomeIcon icon={faUserTie} className="me-2" />
                Additional Information
              </h5>
              
              <CRow className="g-3">
                {bookingData.customerDetails?.occupation && (
                  <CCol md={4}>
                    <div className="info-group">
                      <label>
                        <FontAwesomeIcon icon={faUserTie} className="me-1" />
                        Occupation
                      </label>
                      <p>{bookingData.customerDetails.occupation}</p>
                    </div>
                  </CCol>
                )}
                
                {bookingData.customerDetails?.nomineeName && (
                  <CCol md={4}>
                    <div className="info-group">
                      <label>
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        Nominee
                      </label>
                      <p className="mb-1">
                        {bookingData.customerDetails.nomineeName}
                        {bookingData.customerDetails.nomineeRelation && (
                          <span className="text-muted ms-1">
                            ({bookingData.customerDetails.nomineeRelation})
                          </span>
                        )}
                      </p>
                      {bookingData.customerDetails?.nomineeAge && (
                        <small className="text-muted d-block">
                          Age: {bookingData.customerDetails.nomineeAge} years
                        </small>
                      )}
                      {bookingData.customerDetails?.nomineeDob && !bookingData.customerDetails?.nomineeAge && (
                        <small className="text-muted d-block">
                          DOB: {formatDate(bookingData.customerDetails.nomineeDob)} | 
                          Age: {calculateAge(bookingData.customerDetails.nomineeDob)} years
                        </small>
                      )}
                    </div>
                  </CCol>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        )}
      </CModalBody>
      
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          variant="outline"
        >
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default ViewPendingBookingModal;