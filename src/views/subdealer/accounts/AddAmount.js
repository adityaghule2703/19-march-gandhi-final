// import React, { useState, useEffect } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBank, cilUser } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import FormButtons from 'src/utils/FormButtons';
// import { showError } from '../../../utils/sweetAlerts';

// function AddAmount() {
//   const [formData, setFormData] = useState({
//     subdealerId: '',
//     refNumber: '',
//     amount: '',
//     paymentMode: '',
//     bank: '',
//     remark: '',
//     subPaymentMode: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [subdealers, setSubdealers] = useState([]);
//   const [banks, setBanks] = useState([]);
//   const [submodes, setSubModes] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       fetchInsuranceProvider(id);
//     }
//     fetchSubdealers();
//     fetchPaymentSubmodes();
//   }, [id]);

//   // const fetchInsuranceProvider = async (id) => {
//   //   try {
//   //     const res = await axiosInstance.get(`/insurance-providers/${id}`);
//   //     setFormData(res.data.data);
//   //   } catch (error) {
//   //     console.error('Error fetching insurance providers:', error);
//   //   }
//   // };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data.subdealers || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchPaymentSubmodes = async () => {
//     try {
//       const response = await axiosInstance.get('/banksubpaymentmodes');
//       setSubModes(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await axiosInstance.get('/banks');
//         setBanks(response.data.data.banks || []);
//       } catch (error) {
//         console.error('Error fetching banks:', error);
//         showError(error);
//       }
//     };

//     fetchBanks();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     let formErrors = {};

//     if (!formData.subdealerId) formErrors.subdealerId = 'Subdealer is required';
//     if (!formData.refNumber) formErrors.refNumber = 'UTR Number is required';
//     if (!formData.amount || formData.amount <= 0) formErrors.amount = 'Valid amount is required';
//     if (!formData.paymentMode) formErrors.paymentMode = 'Payment mode is required';
//     // if (formData.paymentMode === 'Bank' && !formData.bank)
//     //   formErrors.bank = 'Bank is required for bank payments';
//     if (formData.paymentMode === 'Bank') {
//       if (!formData.bank) formErrors.bank = 'Bank location is required for bank payments';
//       if (!formData.subPaymentMode) formErrors.subPaymentMode = 'Subpayment mode is required for bank payments';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const submissionData = {
//         subdealerId: formData.subdealerId,
//         refNumber: formData.refNumber,
//         amount: parseFloat(formData.amount),
//         paymentMode: formData.paymentMode,
//         bank: formData.bank || null,
//         subPaymentMode: formData.subPaymentMode,
//         remark: formData.remark || ''
//       };
//       await axiosInstance.post(`/subdealersonaccount/${formData.subdealerId}/on-account/receipts`, submissionData);

//       await showFormSubmitToast('Account balance added successfully!');
//       navigate('/subdealer-account/onaccount-balance');
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/subdealer-account/onaccount-balance');
//   };

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//       {error}
//       </div>
//     );
//   }
//   return (
//     <div className="form-container">
//       <div className='title'>{id ? 'Edit' : 'Add'} On Account Balance</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Subdealer Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect name="subdealerId" value={formData.subdealerId} onChange={handleChange} invalid={!!errors.subdealerId}>
//                     <option value="">-Select-</option>
//                     {subdealers.map((subdealer) => (
//                       <option key={subdealer._id} value={subdealer._id}>
//                         {subdealer.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.subdealerId && <p className="error">{errors.subdealerId}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Reference Number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     name="refNumber"
//                     value={formData.refNumber}
//                     onChange={handleChange}
//                     invalid={!!errors.refNumber}
//                   />
//                 </CInputGroup>
//                 {errors.refNumber && <p className="error">{errors.refNumber}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Amount</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     onChange={handleChange}
//                     min="0"
//                     step="0.01"
//                     invalid={!!errors.amount}
//                   />
//                 </CInputGroup>
//                 {errors.amount && <p className="error">{errors.amount}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Payment Mode</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect name="paymentMode" value={formData.paymentMode} onChange={handleChange} invalid={!!errors.paymentMode}>
//                     <option value="">-Select-</option>
//                     <option value="Cash">Cash</option>
//                     <option value="Bank">Bank</option>
//                     <option value="UPI">UPI</option>
//                     <option value="RTGS">RTGS</option>
//                     <option value="Cheque">Cheque</option>
//                     <option value="Pay Order">Pay Order</option>
//                     <option value="Other">Other</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.paymentMode && <p className="error">{errors.paymentMode}</p>}
//               </div>

//               {formData.paymentMode === 'Bank' && (
//                 <>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Submode</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="subPaymentMode" value={formData.subPaymentMode} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {submodes.map((submode) => (
//                           <option key={submode._id} value={submode._id}>
//                             {submode.payment_mode}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subPaymentMode && <p className="error">{errors.subPaymentMode}</p>}
//                   </div>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Bank Location</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="bank" value={formData.bank} onChange={handleChange} invalid={!!errors.bank}>
//                         <option value="">-Select-</option>
//                         {banks.map((bank) => (
//                           <option key={bank._id} value={bank._id}>
//                             {bank.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.bank && <p className="error">{errors.bank}</p>}
//                   </div>
//                 </>
//               )}

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Remarks</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="remark" value={formData.remark} onChange={handleChange} placeholder="Optional remarks" />
//                 </CInputGroup>
//               </div>
//             </div>

//             <FormButtons onCancel={handleCancel} isSubmitting={isSubmitting} submitText={id ? 'Update' : 'Add'} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddAmount;








// import React, { useState, useEffect } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBank, cilUser } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import FormButtons from 'src/utils/FormButtons';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';

// function AddAmount() {
//   const [formData, setFormData] = useState({
//     subdealerId: '',
//     refNumber: '',
//     amount: '',
//     paymentMode: '',
//     bank: '',
//     remark: '',
//     subPaymentMode: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [subdealers, setSubdealers] = useState([]);
//   const [banks, setBanks] = useState([]);
//   const [submodes, setSubModes] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Get user from auth context
//   const { user: authUser } = useAuth();
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;

//   useEffect(() => {
//     if (id) {
//       fetchInsuranceProvider(id);
//     }
//     fetchSubdealers();
//     fetchPaymentSubmodes();
//   }, [id]);

//   // const fetchInsuranceProvider = async (id) => {
//   //   try {
//   //     const res = await axiosInstance.get(`/insurance-providers/${id}`);
//   //     setFormData(res.data.data);
//   //   } catch (error) {
//   //     console.error('Error fetching insurance providers:', error);
//   //   }
//   // };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data.subdealers || []);
      
//       // If user is a subdealer, automatically set the subdealer to their own account
//       if (isSubdealer && userSubdealerId) {
//         setFormData(prevData => ({
//           ...prevData,
//           subdealerId: userSubdealerId
//         }));
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchPaymentSubmodes = async () => {
//     try {
//       const response = await axiosInstance.get('/banksubpaymentmodes');
//       setSubModes(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await axiosInstance.get('/banks');
//         setBanks(response.data.data.banks || []);
//       } catch (error) {
//         console.error('Error fetching banks:', error);
//         showError(error);
//       }
//     };

//     fetchBanks();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // If user is a subdealer, prevent changing the subdealer field
//     if (isSubdealer && name === 'subdealerId') {
//       return;
//     }
    
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     let formErrors = {};

//     if (!formData.subdealerId) formErrors.subdealerId = 'Subdealer is required';
//     if (!formData.refNumber) formErrors.refNumber = 'UTR Number is required';
//     if (!formData.amount || formData.amount <= 0) formErrors.amount = 'Valid amount is required';
//     if (!formData.paymentMode) formErrors.paymentMode = 'Payment mode is required';
//     if (formData.paymentMode === 'Bank') {
//       if (!formData.bank) formErrors.bank = 'Bank location is required for bank payments';
//       if (!formData.subPaymentMode) formErrors.subPaymentMode = 'Subpayment mode is required for bank payments';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const submissionData = {
//         subdealerId: formData.subdealerId,
//         refNumber: formData.refNumber,
//         amount: parseFloat(formData.amount),
//         paymentMode: formData.paymentMode,
//         bank: formData.bank || null,
//         subPaymentMode: formData.subPaymentMode,
//         remark: formData.remark || ''
//       };
//       await axiosInstance.post(`/subdealersonaccount/${formData.subdealerId}/on-account/receipts`, submissionData);

//       await showFormSubmitToast('Account balance added successfully!');
//       navigate('/subdealer-account/onaccount-balance');
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/subdealer-account/onaccount-balance');
//   };

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//       {error}
//       </div>
//     );
//   }
//   return (
//     <div className="form-container">
//       <div className='title'>{id ? 'Edit' : 'Add'} On Account Balance</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Subdealer Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 {isSubdealer ? (
//                   <div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="text"
//                         value={`${userSubdealerName || 'Your Subdealer Account'}`}
//                         readOnly
//                         disabled
//                       />
//                     </CInputGroup>
//                     <div className="text-muted small mt-1">
//                       Subdealers can only add balance to their own account
//                     </div>
//                   </div>
//                 ) : (
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect name="subdealerId" value={formData.subdealerId} onChange={handleChange} invalid={!!errors.subdealerId}>
//                       <option value="">-Select-</option>
//                       {subdealers.map((subdealer) => (
//                         <option key={subdealer._id} value={subdealer._id}>
//                           {subdealer.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                 )}
//                 {errors.subdealerId && <p className="error">{errors.subdealerId}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Reference Number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     name="refNumber"
//                     value={formData.refNumber}
//                     onChange={handleChange}
//                     invalid={!!errors.refNumber}
//                   />
//                 </CInputGroup>
//                 {errors.refNumber && <p className="error">{errors.refNumber}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Amount</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     onChange={handleChange}
//                     min="0"
//                     step="0.01"
//                     invalid={!!errors.amount}
//                   />
//                 </CInputGroup>
//                 {errors.amount && <p className="error">{errors.amount}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Payment Mode</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect name="paymentMode" value={formData.paymentMode} onChange={handleChange} invalid={!!errors.paymentMode}>
//                     <option value="">-Select-</option>
//                     <option value="Cash">Cash</option>
//                     <option value="Bank">Bank</option>
//                     <option value="UPI">UPI</option>
//                     <option value="RTGS">RTGS</option>
//                     <option value="Cheque">Cheque</option>
//                     <option value="Pay Order">Pay Order</option>
//                     <option value="Other">Other</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.paymentMode && <p className="error">{errors.paymentMode}</p>}
//               </div>

//               {formData.paymentMode === 'Bank' && (
//                 <>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Submode</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="subPaymentMode" value={formData.subPaymentMode} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {submodes.map((submode) => (
//                           <option key={submode._id} value={submode._id}>
//                             {submode.payment_mode}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subPaymentMode && <p className="error">{errors.subPaymentMode}</p>}
//                   </div>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Bank Location</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="bank" value={formData.bank} onChange={handleChange} invalid={!!errors.bank}>
//                         <option value="">-Select-</option>
//                         {banks.map((bank) => (
//                           <option key={bank._id} value={bank._id}>
//                             {bank.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.bank && <p className="error">{errors.bank}</p>}
//                   </div>
//                 </>
//               )}

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Remarks</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="remark" value={formData.remark} onChange={handleChange} placeholder="Optional remarks" />
//                 </CInputGroup>
//               </div>
//             </div>

//             <FormButtons onCancel={handleCancel} isSubmitting={isSubmitting} submitText={id ? 'Update' : 'Add'} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddAmount;






import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBank, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
import axiosInstance from 'src/axiosInstance';
import FormButtons from 'src/utils/FormButtons';
import { showError } from '../../../utils/sweetAlerts';
import { useAuth } from '../../../context/AuthContext';
import QRCode from 'qrcode';
import tvsLogo from '../../../assets/images/logo.png';

function AddAmount() {
  const [formData, setFormData] = useState({
    subdealerId: '',
    refNumber: '',
    amount: '',
    paymentMode: '',
    bank: '',
    remark: '',
    subPaymentMode: ''
  });
  const [errors, setErrors] = useState({});
  const [subdealers, setSubdealers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [submodes, setSubModes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Get user from auth context
  const { user: authUser } = useAuth();
  
  // Check if user has SUBDEALER role
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
  // Get subdealer ID from user data if user is a subdealer
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;

  useEffect(() => {
    if (id) {
      fetchInsuranceProvider(id);
    }
    fetchSubdealers();
    fetchPaymentSubmodes();
  }, [id]);

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
      
      // If user is a subdealer, automatically set the subdealer to their own account
      if (isSubdealer && userSubdealerId) {
        setFormData(prevData => ({
          ...prevData,
          subdealerId: userSubdealerId
        }));
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchPaymentSubmodes = async () => {
    try {
      const response = await axiosInstance.get('/banksubpaymentmodes');
      setSubModes(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        setBanks(response.data.data.banks || []);
      } catch (error) {
        console.error('Error fetching banks:', error);
        showError(error);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If user is a subdealer, prevent changing the subdealer field
    if (isSubdealer && name === 'subdealerId') {
      return;
    }
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // ============ PRINT RECEIPT FUNCTION ============
  const printSubdealerReceipt = async (receiptId) => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/receipts/${receiptId}`);
      const receiptData = response.data.data;
      
      // Format dates
      const receivedDate = receiptData.receivedDateFormatted || 
                          new Date(receiptData.receivedDate || receiptData.createdAt).toLocaleDateString('en-GB');
      
      const currentDate = new Date().toLocaleDateString('en-GB');
      
      // Generate QR Code
      const qrText = `GANDHI MOTORS PVT LTD
Subdealer: ${receiptData.subdealer?.name || 'N/A'}
Receipt No: ${receiptData.refNumber || receiptData._id}
Amount: ₹${receiptData.amount || 0}
Payment Mode: ${receiptData.paymentMode || 'Cash'}
Reference: ${receiptData.refNumber || 'N/A'}
Date: ${receivedDate}
Status: ${receiptData.approvalStatus || 'Pending'}`;

      let qrCodeImage = '';
      try {
        qrCodeImage = await QRCode.toDataURL(qrText, {
          width: 150,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
        qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
            <rect width="150" height="150" fill="white"/>
            <rect x="10" y="10" width="130" height="130" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
            <text x="75" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">QR CODE</text>
            <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${receiptData.refNumber || ''}</text>
          </svg>
        `);
      }

      const receiptHTML = generateReceiptHTML(receiptData, qrCodeImage, receivedDate, currentDate);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };
      
    } catch (err) {
      console.error('Error fetching receipt details:', err);
      showError('Failed to load receipt. Please try again.');
    }
  };

  // ============ GENERATE RECEIPT HTML ============
  const generateReceiptHTML = (receiptData, qrCodeImage, receivedDate, currentDate) => {
    const receiptNumber = receiptData.refNumber || receiptData._id || 'N/A';
    const subdealerName = receiptData.subdealer?.name || 'N/A';
    const amount = receiptData.amount || 0;
    const paymentMode = receiptData.paymentMode || 'Cash';
    const remark = receiptData.remark || '';
    const branch = receiptData.branch || {};
    const receivedByName = receiptData.receivedByName || receiptData.receivedBy?.name || 'System';
    const approvalStatus = receiptData.approvalStatus || 'Pending';
    
    // Format amount in words (simplified version)
    const amountInWords = numberToWordsSimple(amount);

    return `<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${receiptNumber}</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: #333;
    }
    .page {
      width: 210mm;
      margin: 0 auto;
    }
    .receipt-copy {
      height: auto;
      min-height: 130mm;
      page-break-inside: avoid;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      align-items: flex-start;
    }
    .header-left {
      width: 60%;
    }
    .header-right {
      width: 40%;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo-qr-container {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-end;
      margin-bottom: 5px;
      width: 100%;
    }
    .logo {
      height: 50px;
    }
    .qr-code-small {
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 12px;
      line-height: 1.2;
    }
    .dealer-name {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 3px 0;
    }
    .customer-info-container {
      display: flex;
      font-size: 12px;
      margin: 10px 0;
    }
    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 2mm 0;
      line-height: 1.2;
    }
    .divider {
      border-top: 2px solid #AAAAAA;
      margin: 3mm 0;
    }
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 8px;
      margin: 10px 0;
      font-size: 12px;
    }
    .payment-info-box {
      margin: 10px 0;
    }
    .signature-box {
      margin-top: 15mm;
      font-size: 10pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 40mm;
      display: inline-block;
      margin: 0 5mm;
    }
    .cutting-line {
      border-top: 2px dashed #333;
      margin: 15mm 0 10mm 0;
      text-align: center;
      position: relative;
    }
    .cutting-line::before {
      content: "✂ Cut Here ✂";
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0 10px;
      font-size: 12px;
      color: #666;
    }
    .note {
      padding: 1px;
      margin: 2px;
      font-size: 11px;
    }
    .amount-in-words {
      font-style: italic;
      margin-top: 8px;
      padding: 5px;
      font-size: 12px;
      border-top: 1px dashed #ccc;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
      color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
      border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
    }
    .footer-note {
      font-size: 9px;
      color: #777;
      text-align: center;
      margin-top: 5mm;
    }
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      body {
        padding: 0;
      }
      .receipt-copy {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- FIRST COPY -->
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik - 422101<br>
            Phone: 7498903672<br>
            GSTIN: ${branch.gst_number || '27AACCG1234E1Z5'}<br>
            ${branch.name || 'GANDHI TVS NASHIK'}
          </div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
            ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
          </div>
          <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
        </div>
      </div>
      
      <div class="divider"></div>

      <div class="receipt-info">
        <div><strong>SUBDEALER PAYMENT RECEIPT</strong></div>
        <div><strong>Receipt Date:</strong> ${receivedDate}</div>
        <div><span class="status-badge">${approvalStatus}</span></div>
      </div>

      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Subdealer Name:</strong> ${subdealerName}</div>
          <div class="customer-info-row"><strong>Receipt Number:</strong> ${receiptNumber}</div>
          <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Reference No:</strong> ${receiptData.refNumber || '-'}</div>
          <div class="customer-info-row"><strong>Received By:</strong> ${receivedByName}</div>
          <div class="customer-info-row"><strong>Bank:</strong> ${receiptData.bank?.name || '-'}</div>
        </div>
      </div>

      <div class="payment-info-box">
        <div class="receipt-info">
          <div style="display: flex; justify-content: space-between;">
            <span><strong>Receipt Amount:</strong></span>
            <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
          </div>
          ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
        </div>
        
        <div class="amount-in-words">
          <strong>Amount in words:</strong> ${amountInWords} Only
        </div>
      </div>

      <div class="note">
        <strong>Notes:</strong> This is a system generated receipt for On-Account payment.
      </div>
      
      <div class="divider"></div>

      <div class="signature-box">
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Subdealer's Signature</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Authorised Signatory</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Accountant</div>
          </div>
        </div>
      </div>
      
      <div class="footer-note">
        This is a computer generated receipt - valid without signature
      </div>
    </div>

    <!-- CUTTING LINE -->
    <div class="cutting-line"></div>

    <!-- SECOND COPY (DUPLICATE) -->
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik - 422101<br>
            Phone: 7498903672<br>
            GSTIN: ${branch.gst_number || '27AACCG1234E1Z5'}<br>
            ${branch.name || 'GANDHI TVS NASHIK'}
          </div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
            ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
          </div>
          <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
        </div>
      </div>
      
      <div class="divider"></div>

      <div class="receipt-info">
        <div><strong>SUBDEALER PAYMENT RECEIPT (DUPLICATE)</strong></div>
        <div><strong>Receipt Date:</strong> ${receivedDate}</div>
        <div><span class="status-badge">${approvalStatus}</span></div>
      </div>

      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Subdealer Name:</strong> ${subdealerName}</div>
          <div class="customer-info-row"><strong>Receipt Number:</strong> ${receiptNumber}</div>
          <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Reference No:</strong> ${receiptData.refNumber || '-'}</div>
          <div class="customer-info-row"><strong>Received By:</strong> ${receivedByName}</div>
          <div class="customer-info-row"><strong>Bank:</strong> ${receiptData.bank?.name || '-'}</div>
        </div>
      </div>

      <div class="payment-info-box">
        <div class="receipt-info">
          <div style="display: flex; justify-content: space-between;">
            <span><strong>Receipt Amount:</strong></span>
            <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
          </div>
          ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
        </div>
        
        <div class="amount-in-words">
          <strong>Amount in words:</strong> ${amountInWords} Only
        </div>
      </div>

      <div class="note">
        <strong>Notes:</strong> This is a system generated receipt for On-Account payment.
      </div>
      
      <div class="divider"></div>

      <div class="signature-box">
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Subdealer's Signature</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Authorised Signatory</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Accountant</div>
          </div>
        </div>
      </div>
      
      <div class="footer-note">
        This is a computer generated receipt - valid without signature
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // ============ SIMPLE NUMBER TO WORDS FUNCTION ============
  const numberToWordsSimple = (num) => {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWords = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };
    
    return numToWords(Math.floor(num)) + (num % 1 ? ' point ' + num.toString().split('.')[1] : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    let formErrors = {};

    if (!formData.subdealerId) formErrors.subdealerId = 'Subdealer is required';
    if (!formData.refNumber) formErrors.refNumber = 'UTR Number is required';
    if (!formData.amount || formData.amount <= 0) formErrors.amount = 'Valid amount is required';
    if (!formData.paymentMode) formErrors.paymentMode = 'Payment mode is required';
    if (formData.paymentMode === 'Bank') {
      if (!formData.bank) formErrors.bank = 'Bank location is required for bank payments';
      if (!formData.subPaymentMode) formErrors.subPaymentMode = 'Subpayment mode is required for bank payments';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        subdealerId: formData.subdealerId,
        refNumber: formData.refNumber,
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
        bank: formData.bank || null,
        subPaymentMode: formData.subPaymentMode,
        remark: formData.remark || ''
      };
      
      const response = await axiosInstance.post(`/subdealersonaccount/${formData.subdealerId}/on-account/receipts`, submissionData);

      await showFormSubmitToast('Account balance added successfully!');
      
      // Get the newly created receipt ID from response
      const receiptId = response.data.data?._id || response.data._id;
      
      // Navigate back to the list page
      navigate('/subdealer-account/onaccount-balance');
      
      // Print the receipt after successful submission
      if (receiptId) {
        setTimeout(() => {
          printSubdealerReceipt(receiptId);
        }, 500); // Small delay to ensure navigation completes
      }
      
    } catch (error) {
      console.error('Error details:', error);
      
      // Check if error has response data with the specific message
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Check if error has the "error" field with the specific message
        if (errorData.error) {
          // Display the specific error message (e.g., "Duplicate UTR/REF for this subdealer")
          setError(errorData.error);
        } else if (errorData.message) {
          // Fallback to message field
          setError(errorData.message);
        } else {
          // Use the generic error handler
          showFormSubmitError(error);
        }
      } else {
        // Use the generic error handler
        showFormSubmitError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/subdealer-account/onaccount-balance');
  };

  return (
    <div className="form-container">
      {/* Inline Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className='title'>{id ? 'Edit' : 'Add'} On Account Balance</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Subdealer Name</span>
                  <span className="required">*</span>
                </div>
                {isSubdealer ? (
                  <div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        value={`${userSubdealerName || 'Your Subdealer Account'}`}
                        readOnly
                        disabled
                      />
                    </CInputGroup>
                    <div className="text-muted small mt-1">
                      Subdealers can only add balance to their own account
                    </div>
                  </div>
                ) : (
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect name="subdealerId" value={formData.subdealerId} onChange={handleChange} invalid={!!errors.subdealerId}>
                      <option value="">-Select-</option>
                      {subdealers.map((subdealer) => (
                        <option key={subdealer._id} value={subdealer._id}>
                          {subdealer.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                )}
                {errors.subdealerId && <p className="error">{errors.subdealerId}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Reference Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="refNumber"
                    value={formData.refNumber}
                    onChange={handleChange}
                    invalid={!!errors.refNumber}
                  />
                </CInputGroup>
                {errors.refNumber && <p className="error">{errors.refNumber}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Amount</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    invalid={!!errors.amount}
                  />
                </CInputGroup>
                {errors.amount && <p className="error">{errors.amount}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment Mode</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect name="paymentMode" value={formData.paymentMode} onChange={handleChange} invalid={!!errors.paymentMode}>
                    <option value="">-Select-</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="UPI">UPI</option>
                    <option value="RTGS">RTGS</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Pay Order">Pay Order</option>
                    <option value="Other">Other</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.paymentMode && <p className="error">{errors.paymentMode}</p>}
              </div>

              {formData.paymentMode === 'Bank' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Submode</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBank} />
                      </CInputGroupText>
                      <CFormSelect name="subPaymentMode" value={formData.subPaymentMode} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {submodes.map((submode) => (
                          <option key={submode._id} value={submode._id}>
                            {submode.payment_mode}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.subPaymentMode && <p className="error">{errors.subPaymentMode}</p>}
                  </div>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Bank Location</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBank} />
                      </CInputGroupText>
                      <CFormSelect name="bank" value={formData.bank} onChange={handleChange} invalid={!!errors.bank}>
                        <option value="">-Select-</option>
                        {banks.map((bank) => (
                          <option key={bank._id} value={bank._id}>
                            {bank.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.bank && <p className="error">{errors.bank}</p>}
                  </div>
                </>
              )}

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Remarks</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput type="text" name="remark" value={formData.remark} onChange={handleChange} placeholder="Optional remarks" />
                </CInputGroup>
              </div>
            </div>

            <FormButtons onCancel={handleCancel} isSubmitting={isSubmitting} submitText={id ? 'Update' : 'Add'} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAmount;
