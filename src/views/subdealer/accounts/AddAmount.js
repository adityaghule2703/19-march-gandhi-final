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
      
      await axiosInstance.post(`/subdealersonaccount/${formData.subdealerId}/on-account/receipts`, submissionData);

      await showFormSubmitToast('Account balance added successfully!');
      navigate('/subdealer-account/onaccount-balance');
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
