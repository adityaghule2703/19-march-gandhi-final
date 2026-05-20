// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilCamera, cilCarAlt, cilCreditCard, cilFingerprint, cilHome, cilLocationPin, cilTag, cilUser } from '@coreui/icons';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import FormButtons from '../../utils/FormButtons';

// function UploadKYC() {
//   const [formData, setFormData] = useState({
//     bookingId: '',
//     customerName: '',
//     address: '',
//     aadharFront: null,
//     aadharBack: null,
//     panCard: null,
//     vPhoto: null,
//     chasisNoPhoto: null,
//     addressProof1: null,
//     addressProof2: null,
//     bookingType: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state) {
//       setFormData((prev) => ({
//         ...prev,
//         bookingId: location.state.bookingId,
//         customerName: location.state.customerName,
//         address: location.state.address,
//         bookingType: location.state.bookingType
//       }));
//     }
//   }, [location.state]);

//   console.log(formData.bookingType);
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleTextChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate required fields
//     const requiredFields = {
//       aadharFront: 'Aadhar Front is required',
//       aadharBack: 'Aadhar Back is required',
//       panCard: 'PAN Card is required',
//       vPhoto: 'Voter Photo is required',
//       chasisNoPhoto: 'Chassis Photo is required',
//       addressProof1: 'Address Proof is required'
//     };

//     let formErrors = {};
//     Object.entries(requiredFields).forEach(([field, message]) => {
//       if (!formData[field]) {
//         formErrors[field] = message;
//       }
//     });

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           formDataToSend.append(key, value);
//         }
//       });

//       await axiosInstance.post(`/kyc/${formData.bookingId}/submit`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       await showFormSubmitToast('KYC documents uploaded successfully!');

//       if (formData.bookingType === 'SUBDEALER') {
//         navigate('/subdealer-all-bookings');
//       } else {
//         navigate('/booking-list');
//       }
//     } catch (error) {
//       console.error('Error uploading KYC:', error);
//       showFormSubmitError(error.response?.data?.message || 'Failed to upload KYC documents');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/booking-list');
//   };

//   return (
//     <div className="form-container">
//       <div className='title'>Customer KYC Details</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Booking ID</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilTag} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="bookingId" value={formData.bookingId} onChange={handleTextChange} readOnly />
//                 </CInputGroup>
//                 {errors.bookingId && <p className="error">{errors.bookingId}</p>}
//               </div>

//               <div className="input-box">
//                 <span className="details">Customer Name</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="customerName" value={formData.customerName} onChange={handleTextChange} readOnly />
//                 </CInputGroup>
//               </div>

//               <div className="input-box">
//                 <span className="details">Address</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="address" value={formData.address} onChange={handleTextChange} readOnly />
//                 </CInputGroup>
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Aadhar Front</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilFingerprint} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="aadharFront" onChange={handleFileChange} accept="image/*,.pdf" />
//                 </CInputGroup>
//                 {errors.aadharFront && <p className="error">{errors.aadharFront}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Aadhar Back</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilFingerprint} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="aadharBack" onChange={handleFileChange} accept="image/*,.pdf" />
//                 </CInputGroup>
//                 {errors.aadharBack && <p className="error">{errors.aadharBack}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Pan Card</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilCreditCard} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="panCard" onChange={handleFileChange} accept="image/*,.pdf" />
//                 </CInputGroup>
//                 {errors.panCard && <p className="error">{errors.panCard}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">V_Photo</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilCamera} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="vPhoto" onChange={handleFileChange} accept="image/*" />
//                 </CInputGroup>
//                 {errors.vPhoto && <p className="error">{errors.vPhoto}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Chassis No.Photo</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilCarAlt} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="chasisNoPhoto" onChange={handleFileChange} accept="image/*" />
//                 </CInputGroup>
//                 {errors.chasisNoPhoto && <p className="error">{errors.chasisNoPhoto}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Address Proof</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilHome} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="addressProof1" onChange={handleFileChange} accept="image/*,.pdf" />
//                 </CInputGroup>
//                 {errors.addressProof1 && <p className="error">{errors.addressProof1}</p>}
//               </div>

//               <div className="input-box">
//                 <span className="details">Address Proof 2</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilHome} />
//                   </CInputGroupText>
//                   <CFormInput type="file" name="addressProof2" onChange={handleFileChange} accept="image/*,.pdf" />
//                 </CInputGroup>
//               </div>
//             </div>
//             <FormButtons onCancel={handleCancel} submitText={isSubmitting ? 'Uploading...' : 'Submit'} disabled={isSubmitting} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UploadKYC;







import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCamera, cilCarAlt, cilCreditCard, cilFingerprint, cilHome, cilLocationPin, cilTag, cilUser, cilFile, cilCloudDownload } from '@coreui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import FormButtons from '../../utils/FormButtons';

function UploadKYCRto() {
  const [formData, setFormData] = useState({
    bookingId: '',
    customerName: '',
    address: '',
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    vPhoto: null,
    chasisNoPhoto: null,
    addressProof1: null,
    addressProof2: null,
    bookingType: ''
  });

  const [existingDocuments, setExistingDocuments] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        bookingId: location.state.bookingId,
        customerName: location.state.customerName,
        address: location.state.address,
        bookingType: location.state.bookingType
      }));
      
      // Fetch existing documents if bookingId exists
      if (location.state.bookingId) {
        fetchExistingDocuments(location.state.bookingId);
      }
    }
  }, [location.state]);

  const fetchExistingDocuments = async (bookingId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
      
      if (response.data.success && response.data.data.kycDocuments) {
        const kycDocs = response.data.data.kycDocuments;
        setExistingDocuments(kycDocs);
      }
    } catch (error) {
      console.error('Error fetching existing documents:', error);
      // Don't show error to user as this is just for display
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setApiError('');
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError('');

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      await axiosInstance.post(`/kyc/${formData.bookingId}/submit`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      await showFormSubmitToast('KYC documents uploaded successfully!');

      if (formData.bookingType === 'SUBDEALER') {
        navigate('/subdealer-all-bookings');
      } else {
        navigate('/rto/rto-paper');
      }
    } catch (error) {
      console.error('Error uploading KYC:', error);
      
      let errorMessage = 'Failed to upload KYC documents';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        if (data.message) {
          errorMessage = data.message;
        }
        
        if (data.error && typeof data.error === 'string') {
          const errorParts = data.error.split(': ');
          if (errorParts.length > 1) {
            errorMessage = errorParts[errorParts.length - 1];
          } else {
            errorMessage = data.error;
          }
        }
      }
      
      setApiError(errorMessage);
      showFormSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/booking-list');
  };

  const getFileName = (filePath) => {
    if (!filePath) return '';
    return filePath.split('/').pop();
  };

  const renderFileUploadField = (label, name, icon, isRequired = false) => {
    const existingFile = existingDocuments[name];
    const hasExistingFile = existingFile && existingFile.original;
    
    return (
      <div className="input-box">
        <div className="details-container">
          <span className="details">{label}</span>
          {isRequired && <span className="required">*</span>}
        </div>
        <CInputGroup>
          <CInputGroupText className="input-icon">
            <CIcon icon={icon} />
          </CInputGroupText>
          <CFormInput 
            type="file" 
            name={name} 
            onChange={handleFileChange} 
          />
        </CInputGroup>
        
        {hasExistingFile && (
          <div className="existing-document-info mt-2">
            <small className="text-muted">
              <CIcon icon={cilFile} className="me-1" />
              Currently uploaded: 
              <a 
                href={`${axiosInstance.defaults.baseURL}${existingFile.original}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ms-1 text-primary"
              >
                {getFileName(existingFile.original)}
                <CIcon icon={cilCloudDownload} className="ms-1" size="sm" />
              </a>
            </small>
            <small className="text-warning d-block">
              Upload new file to replace existing one
            </small>
          </div>
        )}
        
        {errors[name] && <p className="error">{errors[name]}</p>}
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className='title'>Customer KYC Details</div>
      
      {apiError && (
        <div className="alert alert-danger mb-3">
          <strong>Error:</strong> {apiError}
        </div>
      )}
      
      {isLoading && (
        <div className="alert alert-info mb-3">
          Loading existing documents...
        </div>
      )}
      
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Booking ID</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="bookingId" 
                    value={formData.bookingId} 
                    onChange={handleTextChange} 
                    readOnly 
                  />
                </CInputGroup>
              </div>

              <div className="input-box">
                <span className="details">Customer Name</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="customerName" 
                    value={formData.customerName} 
                    onChange={handleTextChange} 
                    readOnly 
                  />
                </CInputGroup>
              </div>

              <div className="input-box">
                <span className="details">Address</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleTextChange} 
                    readOnly 
                  />
                </CInputGroup>
              </div>

              {renderFileUploadField('Aadhar Front', 'aadharFront', cilFingerprint)}
              {renderFileUploadField('Aadhar Back', 'aadharBack', cilFingerprint)}
              {renderFileUploadField('Pan Card', 'panCard', cilCreditCard)}
              {renderFileUploadField('V_Photo', 'vPhoto', cilCamera)}
              {renderFileUploadField('Chassis No.Photo', 'chasisNoPhoto', cilCarAlt)}
              {renderFileUploadField('Address Proof', 'addressProof1', cilHome)}
              
              <div className="input-box">
                <span className="details">Address Proof 2</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormInput 
                    type="file" 
                    name="addressProof2" 
                    onChange={handleFileChange} 
                  />
                </CInputGroup>
                {existingDocuments.addressProof2 && existingDocuments.addressProof2.original && (
                  <div className="existing-document-info mt-2">
                    <small className="text-muted">
                      <CIcon icon={cilFile} className="me-1" />
                      Currently uploaded: 
                      <a 
                        href={`${axiosInstance.defaults.baseURL}${existingDocuments.addressProof2.original}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ms-1 text-primary"
                      >
                        {getFileName(existingDocuments.addressProof2.original)}
                        <CIcon icon={cilCloudDownload} className="ms-1" size="sm" />
                      </a>
                    </small>
                    <small className="text-warning d-block">
                      Upload new file to replace existing one
                    </small>
                  </div>
                )}
              </div>
            </div>
            <FormButtons 
              onCancel={handleCancel} 
              submitText={isSubmitting ? 'Uploading...' : 'Submit'} 
              disabled={isSubmitting} 
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadKYCRto;