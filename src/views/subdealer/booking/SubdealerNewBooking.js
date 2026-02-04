// import React, { useState, useEffect } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: ''
//   });
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${bookingId}`);
//       const bookingData = response.data.data;
//       await fetchModels(bookingData.customerType, bookingData.branch?._id);
//       const optionalComponents = bookingData.priceComponents?.filter((pc) => pc.header && pc.header._id)?.map((pc) => pc.header._id) || [];
//       setFormData({
//         model_id: bookingData.model?.id || '',
//         model_color: bookingData.color?.id || '',
//         customer_type: bookingData.customerType || 'B2C',
//         rto_type: bookingData.rto || 'MH',
//         subdealer: bookingData.subdealer?._id || '',
//         optionalComponents: optionalComponents,
//         sales_executive: bookingData.salesExecutive?._id || '',
//         gstin: bookingData.gstin || '',
//         rtoAmount: bookingData.rtoAmount || '',
//         salutation: bookingData.customerDetails?.salutation || '',
//         name: bookingData.customerDetails?.name || '',
//         pan_no: bookingData.customerDetails?.panNo || '',
//         dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//         occupation: bookingData.customerDetails?.occupation || '',
//         address: bookingData.customerDetails?.address || '',
//         taluka: bookingData.customerDetails?.taluka || '',
//         district: bookingData.customerDetails?.district || '',
//         pincode: bookingData.customerDetails?.pincode || '',
//         mobile1: bookingData.customerDetails?.mobile1 || '',
//         mobile2: bookingData.customerDetails?.mobile2 || '',
//         aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//         nomineeName: bookingData.customerDetails?.nomineeName || '',
//         nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//         nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//         type: bookingData.payment?.type?.toLowerCase() || 'cash',
//         financer_id: bookingData.payment?.financer?._id || '',
//         value: bookingData.discounts[0]?.amount || 0,
//         selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//         hpa: bookingData.hpa || false
//       });

//       setSelectedSubdealerName(bookingData.subdealer?.name || '');
//       setModelDetails(bookingData.model || null);
//       setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//       if (bookingData.model?.id) {
//         fetchModels(bookingData.customerType, bookingData.subdealer?._id);
//         fetchModelHeaders(bookingData.model.id);
//         fetchAccessories(bookingData.model.id);
//         fetchModelColors(bookingData.model.id);
//       }
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       showFormSubmitError('Failed to load booking details');
//     }
//   };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);
//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'model_id', 'subdealer'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchCustomer(id);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchCustomer = async (id) => {
//     try {
//       const res = await axiosInstance.get(`/accessories/${id}`);
//       setFormData(res.data.data.customer);
//     } catch (error) {
//       console.error('Error fetching accessories:', error);
//     }
//   };

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       const modelsData = response.data.data.models || [];
//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//   if (message) {
//     setError(message);
//   }
  
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//   if (message) {
//     setError(message);
//   }
  
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const prices = response.data.data.model.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];
//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(response.data.data.model);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/accessories/model/${modelId}`);
//       setAccessories(response.data.data.accessories || []);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//   if (message) {
//     setError(message);
//   }
  
//       }
//     };
//     fetchFinancer();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'customer_type') {
//       fetchModels(value, formData.subdealer);
//       setFormData((prev) => ({
//         ...prev,
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'subdealer') {
//       const selectedSubdealer = subdealers.find((b) => b._id === value);
//       setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//       fetchModels(formData.customer_type, value);
//       setFormData((prev) => ({
//         ...prev,
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'model_id') {
//       fetchModelHeaders(value);
//       fetchAccessories(value);
//       const selectedModel = models.find((model) => model._id === value);
//       if (selectedModel) {
//         setFormData((prev) => ({
//           ...prev,
//           model_name: selectedModel.model_name,
//           model_id: value
//         }));
//         fetchAccessories(value);
//         fetchModelColors(value);
//       }
//     }
//   };

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     return selectedModel?.modelPrices || [];
//   };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           optionalComponents: [...prev.optionalComponents, headerId]
//         };
//       } else {
//         return {
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
//         };
//       }
//     });
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId]
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
//         };
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = [
//       'model_id',
//       'model_color',
//       'subdealer',
//       'customer_type',
//       'name',
//       'address',
//       'mobile1',
//       'aadhar_number',
//       'pan_no'
//     ];
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       formErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       subdealer: formData.subdealer,
//       optionalComponents: formData.optionalComponents,
//       sales_executive: formData.sales_executive,
//       customer_details: {
//         salutation: formData.salutation,
//         name: formData.name,
//         pan_no: formData.pan_no,
//         dob: formData.dob,
//         occupation: formData.occupation,
//         address: formData.address,
//         taluka: formData.taluka,
//         district: formData.district,
//         pincode: formData.pincode,
//         mobile1: formData.mobile1,
//         mobile2: formData.mobile2,
//         aadhar_number: formData.aadhar_number,
//         nomineeName: formData.nomineeName,
//         nomineeRelation: formData.nomineeRelation,
//         nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//       },
//       payment: {
//         type: formData.type.toUpperCase(),
//         ...(formData.type.toLowerCase() === 'finance' && {
//           financer_id: formData.financer_id
//         })
//       },
//       discount: {
//         type: formData.discountType,
//         value: formData.value ? parseFloat(formData.value) : 0
//       },
//       accessories: {
//         selected: formData.selected_accessories.map((id) => ({ id }))
//       },
//       hpa: formData.hpa === true
//     };

//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rtoAmount = formData.rtoAmount;
//     }

//     try {
//       let response;
//       if (isEditMode) {
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//         navigate('/subdealer-all-bookings');
//       } else {
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       // if (error.response) {
//       //   const errorMsg =
//       //     error.response.data.message ||
//       //     (error.response.data.errors && Object.values(error.response.data.errors).join(', ')) ||
//       //     'Error submitting booking';
//       //   showFormSubmitError(errorMsg);
//       // } else {
//       //   showFormSubmitError(error.message || 'Network error');
//       // }
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                         <option value="CSD">CSD</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect name="subdealer" value={formData.subdealer} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {subdealers.map((subdealer) => (
//                           <option key={subdealer._id} value={subdealer._id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_id" value={formData.model_id} onChange={handleChange} disabled={!formData.subdealer}>
//                         <option value="">- Select a Model -</option>
//                         {models.map((model) => (
//                           <option key={model._id} value={model._id}>
//                             {model.model_name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>Model Options</h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const isChecked = isMandatory || formData.optionalComponents.includes(header._id);

//                           return (
//                             <div key={header._id} className="header-item">
//                               <CFormCheck
//                                 id={`header-${header._id}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )}
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_id" value={formData.model_id} onChange={handleChange} disabled={isEditMode}>
//                         <option value="">- Select a Model -</option>
//                         {models.map((model) => (
//                           <option key={model._id} value={model._id}>
//                             {model.model_name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => (
//                           <div key={accessory._id} className="accessory-item">
//                             <CFormCheck
//                               id={`accessory-${accessory._id}`}
//                               label={`${accessory.name} - ₹${accessory.price}`}
//                               checked={formData.selected_accessories.includes(accessory._id)}
//                               onChange={(e) => handleAccessorySelection(accessory._id, e.target.checked)}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                       <div className="accessories-total">
//                         <h6>Accessories Total: ₹{accessoriesTotal}</h6>
//                       </div>
//                     </>
//                   ) : (
//                     <p>No accessories available for this model</p>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 6 && (
//               <>
//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>Model Options</h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const isChecked = isMandatory || formData.optionalComponents.includes(header._id);

//                           return (
//                             <div key={header._id} className="header-item">
//                               <CFormCheck
//                                 id={`header-${header._id}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )}
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//                     Back
//                   </button>
//                   <button type="submit" className="submit-button" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking;




// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: ''
//   });
  
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [userVerticleIds, setUserVerticleIds] = useState([]);
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchUserProfile();
    
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const verticlesData = response.data.data?.verticles || [];
      
//       // Extract verticle IDs from the objects
//       const verticleIds = verticlesData.map(verticle => verticle._id);
//       setUserVerticleIds(verticleIds);
      
//       // Pass the full verticles data to fetchAllVerticles
//       await fetchAllVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       // Since we already have the user's verticles data, we can use it directly
//       // Filter to only include active verticles
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${bookingId}`);
//       const bookingData = response.data.data;

//       const priceComponents = bookingData.priceComponents || [];
//       setBookingPriceComponents(priceComponents);

//       const initialDiscounts = {};
//       if (priceComponents.length > 0) {
//         priceComponents.forEach(priceComponent => {
//           if (priceComponent.header && priceComponent.header._id) {
//             const discountAmount = priceComponent.discountAmount || 0;
//             initialDiscounts[priceComponent.header._id] = discountAmount;
//           }
//         });
//       }
      
//       console.log('Initial discounts from booking API:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

//       const optionalComponents = priceComponents.filter((pc) => pc.header && pc.header._id)?.map((pc) => pc.header._id) || [];

//       const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//         ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//         : '';

//       setFormData({
//         verticle_id: bookingVerticle,
//         model_id: bookingData.model?.id || '',
//         model_color: bookingData.color?.id || '',
//         customer_type: bookingData.customerType || 'B2C',
//         rto_type: bookingData.rto || 'MH',
//         subdealer: bookingData.subdealer?._id || '',
//         optionalComponents: optionalComponents,
//         sales_executive: bookingData.salesExecutive?._id || '',
//         gstin: bookingData.gstin || '',
//         rtoAmount: bookingData.rtoAmount || '',
//         salutation: bookingData.customerDetails?.salutation || '',
//         name: bookingData.customerDetails?.name || '',
//         pan_no: bookingData.customerDetails?.panNo || '',
//         dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//         occupation: bookingData.customerDetails?.occupation || '',
//         address: bookingData.customerDetails?.address || '',
//         taluka: bookingData.customerDetails?.taluka || '',
//         district: bookingData.customerDetails?.district || '',
//         pincode: bookingData.customerDetails?.pincode || '',
//         mobile1: bookingData.customerDetails?.mobile1 || '',
//         mobile2: bookingData.customerDetails?.mobile2 || '',
//         aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//         nomineeName: bookingData.customerDetails?.nomineeName || '',
//         nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//         nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//         type: bookingData.payment?.type?.toLowerCase() || 'cash',
//         financer_id: bookingData.payment?.financer?._id || '',
//         value: bookingData.discounts[0]?.amount || 0,
//         selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//         hpa: bookingData.hpa || false,
//         note: bookingData.note || ''
//       });

//       setSelectedSubdealerName(bookingData.subdealer?.name || '');
//       setModelDetails(bookingData.model || null);
//       setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//       // Store model type and name
//       if (bookingData.model) {
//         setModelType(bookingData.model.type);
//         setSelectedModelName(bookingData.model.model_name);
//       }

//       if (bookingData.model?.id) {
//         setTimeout(() => {
//           fetchModelHeadersForEdit(bookingData.model.id, initialDiscounts);
//         }, 1000);
        
//         fetchAccessories(bookingData.model.id);
//         fetchModelColors(bookingData.model.id);
//       }
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       showFormSubmitError('Failed to load booking details');
//     }
//   };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);

//   const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
//     try {
//       console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];

//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       console.log('Model prices structure:', prices);

//       const mergedDiscounts = {};
      
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           if (existingDiscounts[headerId] !== undefined) {
//             mergedDiscounts[headerId] = existingDiscounts[headerId];
//           } else {
//             mergedDiscounts[headerId] = '';
//           }
//         }
//       });
      
//       console.log('Merged discounts after fetching model headers:', mergedDiscounts);
//       setHeaderDiscounts(mergedDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
      
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id', 'subdealer'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
    
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
    
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       // Filter models by verticle if verticle is selected
//       if (formData.verticle_id) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
//         );
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];

//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts for new booking:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       // First get the model details to know the type and name
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type; // This will be "ICE" or "EV" etc.
//       const modelName = modelData.model_name;
      
//       // Store the model type and name
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       // Now fetch all accessories
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       // Filter accessories based on:
//       // 1. Accessory's category type matches model type AND
//       // 2. Accessory is applicable to this specific model (if applicable_models is defined)
//       // OR accessory has no specific model restrictions
//       const filteredAccessories = allAccessories.filter(accessory => {
//         // First check: accessory category type must match model type
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false; // Skip if type doesn't match
//         }
        
//         // Second check: if accessory has specific applicable models
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           // Check if this model is in the applicable models list
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         // If no specific model restrictions, include it (type already matched)
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
//       setAccessories(filteredAccessories);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'customer_type') {
//       fetchModels(value, formData.subdealer);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'verticle_id') {
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: value,
//         model_id: '',
//         model_name: ''
//       }));

//       if (value) {
//         const filtered = models.filter(model => 
//           model.verticle_id === value || model.verticle === value
//         );
//         setFilteredModels(filtered);
//       } else {
//         setFilteredModels(models);
//       }
//     } else if (name === 'subdealer') {
//       const selectedSubdealer = subdealers.find((b) => b._id === value);
//       setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//       fetchModels(formData.customer_type, value);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'model_id') {
//       const selectedModel = models.find((model) => model._id === value);
//       if (selectedModel) {
//         setFormData((prev) => ({
//           ...prev,
//           model_name: selectedModel.model_name,
//           model_id: value
//         }));
        
//         // Store model type and name
//         setModelType(selectedModel.type);
//         setSelectedModelName(selectedModel.model_name);
        
//         fetchAccessories(value);
//         fetchModelColors(value);
//         if (isEditMode) {
//           fetchModelHeadersForEdit(value, headerDiscounts);
//         } else {
//           fetchModelHeaders(value);
//         }
//       }
//     }
//   };

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     return selectedModel?.modelPrices || [];
//   };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           optionalComponents: [...prev.optionalComponents, headerId]
//         };
//       } else {
//         return {
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
//         };
//       }
//     });
//   };

//   const handleHeaderDiscountChange = (headerId, value) => {
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId]
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     // For B2B/B2C, calculate taxable amount
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     // For B2B/B2C, split GST equally
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = [
//       'verticle_id',
//       'model_id',
//       'model_color',
//       'subdealer',
//       'customer_type',
//       'name',
//       'address',
//       'mobile1',
//       'aadhar_number',
//       'pan_no'
//     ];
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle selection is required';
//     }

//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       formErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     const headerDiscountsArray = Object.entries(headerDiscounts)
//       .filter(([headerId, value]) => value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)))
//       .map(([headerId, value]) => ({
//         headerId,
//         discountAmount: parseFloat(value) || 0
//       }));

//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       subdealer: formData.subdealer,
//       verticles: formData.verticle_id ? [formData.verticle_id] : [],
//       optionalComponents: formData.optionalComponents,
//       sales_executive: formData.sales_executive,
//       customer_details: {
//         salutation: formData.salutation,
//         name: formData.name,
//         pan_no: formData.pan_no,
//         dob: formData.dob,
//         occupation: formData.occupation,
//         address: formData.address,
//         taluka: formData.taluka,
//         district: formData.district,
//         pincode: formData.pincode,
//         mobile1: formData.mobile1,
//         mobile2: formData.mobile2,
//         aadhar_number: formData.aadhar_number,
//         nomineeName: formData.nomineeName,
//         nomineeRelation: formData.nomineeRelation,
//         nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//       },
//       payment: {
//         type: formData.type.toUpperCase(),
//         ...(formData.type.toLowerCase() === 'finance' && {
//           financer_id: formData.financer_id
//         })
//       },
//       headerDiscounts: headerDiscountsArray,
//       discount: {
//         type: formData.discountType,
//         value: formData.value ? parseFloat(formData.value) : 0
//       },
//       accessories: {
//         selected: formData.selected_accessories.map((id) => ({ id }))
//       },
//       hpa: formData.hpa === true,
//       note: formData.note
//     };

//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rtoAmount = formData.rtoAmount;
//     }

//     console.log('Submitting request body:', requestBody);

//     try {
//       let response;
//       if (isEditMode) {
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//         navigate('/subdealer-all-bookings');
//       } else {
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const debugHeaderDiscounts = () => {
//     console.log('Current headerDiscounts:', headerDiscounts);
//     console.log('Current formData.model_id:', formData.model_id);
//     console.log('Current models:', models);
//   };

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                         {/* CSD option removed */}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect name="subdealer" value={formData.subdealer} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {subdealers.map((subdealer) => (
//                           <option key={subdealer._id} value={subdealer._id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={!formData.subdealer || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>Model Options</h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const isChecked = isMandatory || formData.optionalComponents.includes(header._id);

//                           return (
//                             <div key={header._id} className="header-item">
//                               <CFormCheck
//                                 id={`header-${header._id}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )}
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0 || isEditMode}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => (
//                           <div key={accessory._id} className="accessory-item">
//                             <CFormCheck
//                               id={`accessory-${accessory._id}`}
//                               label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                               checked={formData.selected_accessories.includes(accessory._id)}
//                               onChange={(e) => handleAccessorySelection(accessory._id, e.target.checked)}
//                             />
//                             {accessory.description && (
//                               <small className="text-muted d-block">{accessory.description}</small>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 6 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <span className="details">Note</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilList} />
//                       </CInputGroupText>
//                       <CFormInput name="note" value={formData.note} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>
//                 </div>
                
//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section" style={{ marginTop: '20px' }}>
//                     <h5>Model Options</h5>
//                     {/* Debug button */}
//                     <button 
//                       type="button" 
//                       onClick={debugHeaderDiscounts}
//                       style={{ marginBottom: '10px', padding: '5px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
//                     >
//                       Debug Discounts
//                     </button>
//                     <div className="table-responsive">
//                       <CTable striped hover responsive>
//                         <CTableHead>
//                           <CTableRow>
//                             <CTableHeaderCell>Particulars</CTableHeaderCell>
//                             <CTableHeaderCell>HSN</CTableHeaderCell>
//                             <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>CGST %</CTableHeaderCell>
//                             <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>SGST %</CTableHeaderCell>
//                             <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                           {getSelectedModelHeaders()
//                             .filter((price) => price.header && price.header._id)
//                             .map((price) => {
//                               const header = price.header;
//                               const isMandatory = header.is_mandatory;
//                               const isDiscountAllowed = header.is_discount;
//                               const isChecked = isMandatory || formData.optionalComponents.includes(header._id);
                              
//                               if (!isChecked) return null;

//                               // Get the discount amount from headerDiscounts state
//                               const discountValue = headerDiscounts[header._id] !== undefined ? headerDiscounts[header._id] : '';
//                               const unitPrice = price.value || 0;
//                               const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
//                               const netAmount = unitPrice - discountAmount;
                              
//                               // Get GST rate from metadata
//                               const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                               const hsnCode = header.metadata?.hsn_code || 'N/A';
                              
//                               // Calculate taxable amount based on customer type
//                               const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                              
//                               // Calculate CGST and SGST based on customer type
//                               const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                              
//                               // Calculate line total
//                               const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);

//                               return (
//                                 <CTableRow key={header._id}>
//                                   <CTableDataCell>
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                       <CFormCheck
//                                         id={`header-${header._id}`}
//                                         label={`${header.header_key} ${isMandatory ? '(Mandatory)' : ''}`}
//                                         checked={true}
//                                         onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                         disabled={isMandatory}
//                                         style={{ marginRight: '10px' }}
//                                       />
//                                       {header.header_key}
//                                     </div>
//                                   </CTableDataCell>
//                                   <CTableDataCell>{hsnCode}</CTableDataCell>
//                                   <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <CFormInput
//                                       type="number"
//                                       min="0"
//                                       step="0.01"
//                                       placeholder="Enter discount"
//                                       value={discountValue}
//                                       onChange={(e) => handleHeaderDiscountChange(header._id, e.target.value)}
//                                       disabled={!isDiscountAllowed}
//                                       style={{ width: '150px' }}
//                                     />
//                                     {errors[`discount_${header._id}`] && (
//                                       <small className="text-danger d-block">{errors[`discount_${header._id}`]}</small>
//                                     )}
//                                   </CTableDataCell>
//                                   <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                                   <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                                   <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <strong>₹{lineTotal.toFixed(2)}</strong>
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               );
//                             })}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//                     Back
//                   </button>
//                   <button type="submit" className="submit-button" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking;

















// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: ''
//   });
  
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [userVerticleIds, setUserVerticleIds] = useState([]);
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
//   const [isSubdealerUser, setIsSubdealerUser] = useState(false);
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchUserProfile();
    
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;
//       const verticlesData = userData?.verticles || [];
//       const userSubdealer = userData?.subdealer;
      
//       // Extract verticle IDs from the objects
//       const verticleIds = verticlesData.map(verticle => verticle._id);
//       setUserVerticleIds(verticleIds);
      
//       // Check if user is a subdealer
//       const userIsSubdealer = userData.roles?.some(role => 
//         role.name === 'SUBDEALER' || role.name === 'Subdealer'
//       );
//       setIsSubdealerUser(userIsSubdealer);
      
//       // If user is subdealer and has subdealer data, auto-select it
//       if (userIsSubdealer && userSubdealer && userSubdealer._id) {
//         setFormData(prev => ({
//           ...prev,
//           subdealer: userSubdealer._id
//         }));
//         setSelectedSubdealerName(userSubdealer.name || '');
        
//         // Also fetch models with this subdealer
//         fetchModels(formData.customer_type || 'B2C', userSubdealer._id);
//       }
      
//       // Pass the full verticles data to fetchAllVerticles
//       await fetchAllVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       // Since we already have the user's verticles data, we can use it directly
//       // Filter to only include active verticles
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${bookingId}`);
//       const bookingData = response.data.data;

//       const priceComponents = bookingData.priceComponents || [];
//       setBookingPriceComponents(priceComponents);

//       const initialDiscounts = {};
//       if (priceComponents.length > 0) {
//         priceComponents.forEach(priceComponent => {
//           if (priceComponent.header && priceComponent.header._id) {
//             const discountAmount = priceComponent.discountAmount || 0;
//             initialDiscounts[priceComponent.header._id] = discountAmount;
//           }
//         });
//       }
      
//       console.log('Initial discounts from booking API:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

//       const optionalComponents = priceComponents.filter((pc) => pc.header && pc.header._id)?.map((pc) => pc.header._id) || [];

//       const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//         ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//         : '';

//       setFormData({
//         verticle_id: bookingVerticle,
//         model_id: bookingData.model?.id || '',
//         model_color: bookingData.color?.id || '',
//         customer_type: bookingData.customerType || 'B2C',
//         rto_type: bookingData.rto || 'MH',
//         subdealer: bookingData.subdealer?._id || '',
//         optionalComponents: optionalComponents,
//         sales_executive: bookingData.salesExecutive?._id || '',
//         gstin: bookingData.gstin || '',
//         rtoAmount: bookingData.rtoAmount || '',
//         salutation: bookingData.customerDetails?.salutation || '',
//         name: bookingData.customerDetails?.name || '',
//         pan_no: bookingData.customerDetails?.panNo || '',
//         dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//         occupation: bookingData.customerDetails?.occupation || '',
//         address: bookingData.customerDetails?.address || '',
//         taluka: bookingData.customerDetails?.taluka || '',
//         district: bookingData.customerDetails?.district || '',
//         pincode: bookingData.customerDetails?.pincode || '',
//         mobile1: bookingData.customerDetails?.mobile1 || '',
//         mobile2: bookingData.customerDetails?.mobile2 || '',
//         aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//         nomineeName: bookingData.customerDetails?.nomineeName || '',
//         nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//         nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//         type: bookingData.payment?.type?.toLowerCase() || 'cash',
//         financer_id: bookingData.payment?.financer?._id || '',
//         value: bookingData.discounts[0]?.amount || 0,
//         selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//         hpa: bookingData.hpa || false,
//         note: bookingData.note || ''
//       });

//       setSelectedSubdealerName(bookingData.subdealer?.name || '');
//       setModelDetails(bookingData.model || null);
//       setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//       // Store model type and name
//       if (bookingData.model) {
//         setModelType(bookingData.model.type);
//         setSelectedModelName(bookingData.model.model_name);
//       }

//       if (bookingData.model?.id) {
//         setTimeout(() => {
//           fetchModelHeadersForEdit(bookingData.model.id, initialDiscounts);
//         }, 1000);
        
//         fetchAccessories(bookingData.model.id);
//         fetchModelColors(bookingData.model.id);
//       }
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       showFormSubmitError('Failed to load booking details');
//     }
//   };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);

//   const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
//     try {
//       console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];

//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       console.log('Model prices structure:', prices);

//       const mergedDiscounts = {};
      
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           if (existingDiscounts[headerId] !== undefined) {
//             mergedDiscounts[headerId] = existingDiscounts[headerId];
//           } else {
//             mergedDiscounts[headerId] = '';
//           }
//         }
//       });
      
//       console.log('Merged discounts after fetching model headers:', mergedDiscounts);
//       setHeaderDiscounts(mergedDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
      
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id'];
//     // Only require subdealer if user is not a subdealer
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
    
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
    
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       // Filter models by verticle if verticle is selected
//       if (formData.verticle_id) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
//         );
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];

//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts for new booking:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       // First get the model details to know the type and name
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type; // This will be "ICE" or "EV" etc.
//       const modelName = modelData.model_name;
      
//       // Store the model type and name
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       // Now fetch all accessories
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       // Filter accessories based on:
//       // 1. Accessory's category type matches model type AND
//       // 2. Accessory is applicable to this specific model (if applicable_models is defined)
//       // OR accessory has no specific model restrictions
//       const filteredAccessories = allAccessories.filter(accessory => {
//         // First check: accessory category type must match model type
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false; // Skip if type doesn't match
//         }
        
//         // Second check: if accessory has specific applicable models
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           // Check if this model is in the applicable models list
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         // If no specific model restrictions, include it (type already matched)
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
//       setAccessories(filteredAccessories);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'customer_type') {
//       fetchModels(value, formData.subdealer);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'verticle_id') {
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: value,
//         model_id: '',
//         model_name: ''
//       }));

//       if (value) {
//         const filtered = models.filter(model => 
//           model.verticle_id === value || model.verticle === value
//         );
//         setFilteredModels(filtered);
//       } else {
//         setFilteredModels(models);
//       }
//     } else if (name === 'subdealer') {
//       const selectedSubdealer = subdealers.find((b) => b._id === value);
//       setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//       fetchModels(formData.customer_type, value);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'model_id') {
//       const selectedModel = models.find((model) => model._id === value);
//       if (selectedModel) {
//         setFormData((prev) => ({
//           ...prev,
//           model_name: selectedModel.model_name,
//           model_id: value
//         }));
        
//         // Store model type and name
//         setModelType(selectedModel.type);
//         setSelectedModelName(selectedModel.model_name);
        
//         fetchAccessories(value);
//         fetchModelColors(value);
//         if (isEditMode) {
//           fetchModelHeadersForEdit(value, headerDiscounts);
//         } else {
//           fetchModelHeaders(value);
//         }
//       }
//     }
//   };

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     return selectedModel?.modelPrices || [];
//   };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           optionalComponents: [...prev.optionalComponents, headerId]
//         };
//       } else {
//         return {
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
//         };
//       }
//     });
//   };

//   const handleHeaderDiscountChange = (headerId, value) => {
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId]
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     // For B2B/B2C, calculate taxable amount
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     // For B2B/B2C, split GST equally
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = [
//       'verticle_id',
//       'model_id',
//       'model_color',
//       'customer_type',
//       'name',
//       'address',
//       'mobile1',
//       'aadhar_number',
//       'pan_no'
//     ];
    
//     // Only require subdealer if user is not a subdealer
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle selection is required';
//     }

//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       formErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     const headerDiscountsArray = Object.entries(headerDiscounts)
//       .filter(([headerId, value]) => value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)))
//       .map(([headerId, value]) => ({
//         headerId,
//         discountAmount: parseFloat(value) || 0
//       }));

//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       subdealer: formData.subdealer,
//       verticles: formData.verticle_id ? [formData.verticle_id] : [],
//       optionalComponents: formData.optionalComponents,
//       sales_executive: formData.sales_executive,
//       customer_details: {
//         salutation: formData.salutation,
//         name: formData.name,
//         pan_no: formData.pan_no,
//         dob: formData.dob,
//         occupation: formData.occupation,
//         address: formData.address,
//         taluka: formData.taluka,
//         district: formData.district,
//         pincode: formData.pincode,
//         mobile1: formData.mobile1,
//         mobile2: formData.mobile2,
//         aadhar_number: formData.aadhar_number,
//         nomineeName: formData.nomineeName,
//         nomineeRelation: formData.nomineeRelation,
//         nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//       },
//       payment: {
//         type: formData.type.toUpperCase(),
//         ...(formData.type.toLowerCase() === 'finance' && {
//           financer_id: formData.financer_id
//         })
//       },
//       headerDiscounts: headerDiscountsArray,
//       discount: {
//         type: formData.discountType,
//         value: formData.value ? parseFloat(formData.value) : 0
//       },
//       accessories: {
//         selected: formData.selected_accessories.map((id) => ({ id }))
//       },
//       hpa: formData.hpa === true,
//       note: formData.note
//     };

//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rtoAmount = formData.rtoAmount;
//     }

//     console.log('Submitting request body:', requestBody);

//     try {
//       let response;
//       if (isEditMode) {
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//         navigate('/subdealer-all-bookings');
//       } else {
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const debugHeaderDiscounts = () => {
//     console.log('Current headerDiscounts:', headerDiscounts);
//     console.log('Current formData.model_id:', formData.model_id);
//     console.log('Current models:', models);
//   };

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                         {/* CSD option removed */}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       {isSubdealerUser && formData.subdealer ? (
//                         <CFormInput 
//                           type="text" 
//                           value={selectedSubdealerName}
//                           readOnly
//                           disabled
//                         />
//                       ) : (
//                         <CFormSelect 
//                           name="subdealer" 
//                           value={formData.subdealer} 
//                           onChange={handleChange}
//                           disabled={isEditMode}
//                         >
//                           <option value="">-Select-</option>
//                           {subdealers.map((subdealer) => (
//                             <option key={subdealer._id} value={subdealer._id}>
//                               {subdealer.name}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       )}
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {isSubdealerUser && formData.subdealer && (
//                       <small className="text-muted">
//                         Subdealer auto-selected based on your account
//                       </small>
//                     )}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={!formData.subdealer || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>Model Options</h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const isChecked = isMandatory || formData.optionalComponents.includes(header._id);

//                           return (
//                             <div key={header._id} className="header-item">
//                               <CFormCheck
//                                 id={`header-${header._id}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )}
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0 || isEditMode}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => (
//                           <div key={accessory._id} className="accessory-item">
//                             <CFormCheck
//                               id={`accessory-${accessory._id}`}
//                               label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                               checked={formData.selected_accessories.includes(accessory._id)}
//                               onChange={(e) => handleAccessorySelection(accessory._id, e.target.checked)}
//                             />
//                             {accessory.description && (
//                               <small className="text-muted d-block">{accessory.description}</small>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 6 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <span className="details">Note</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilList} />
//                       </CInputGroupText>
//                       <CFormInput name="note" value={formData.note} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>
//                 </div>
                
//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section" style={{ marginTop: '20px' }}>
//                     <h5>Model Options</h5>
//                     {/* Debug button */}
//                     <button 
//                       type="button" 
//                       onClick={debugHeaderDiscounts}
//                       style={{ marginBottom: '10px', padding: '5px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
//                     >
//                       Debug Discounts
//                     </button>
//                     <div className="table-responsive">
//                       <CTable striped hover responsive>
//                         <CTableHead>
//                           <CTableRow>
//                             <CTableHeaderCell>Particulars</CTableHeaderCell>
//                             <CTableHeaderCell>HSN</CTableHeaderCell>
//                             <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>CGST %</CTableHeaderCell>
//                             <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>SGST %</CTableHeaderCell>
//                             <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                           {getSelectedModelHeaders()
//                             .filter((price) => price.header && price.header._id)
//                             .map((price) => {
//                               const header = price.header;
//                               const isMandatory = header.is_mandatory;
//                               const isDiscountAllowed = header.is_discount;
//                               const isChecked = isMandatory || formData.optionalComponents.includes(header._id);
                              
//                               if (!isChecked) return null;

//                               // Get the discount amount from headerDiscounts state
//                               const discountValue = headerDiscounts[header._id] !== undefined ? headerDiscounts[header._id] : '';
//                               const unitPrice = price.value || 0;
//                               const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
//                               const netAmount = unitPrice - discountAmount;
                              
//                               // Get GST rate from metadata
//                               const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                               const hsnCode = header.metadata?.hsn_code || 'N/A';
                              
//                               // Calculate taxable amount based on customer type
//                               const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                              
//                               // Calculate CGST and SGST based on customer type
//                               const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                              
//                               // Calculate line total
//                               const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);

//                               return (
//                                 <CTableRow key={header._id}>
//                                   <CTableDataCell>
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                       <CFormCheck
//                                         id={`header-${header._id}`}
//                                         label={`${header.header_key} ${isMandatory ? '(Mandatory)' : ''}`}
//                                         checked={true}
//                                         onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                         disabled={isMandatory}
//                                         style={{ marginRight: '10px' }}
//                                       />
//                                       {header.header_key}
//                                     </div>
//                                   </CTableDataCell>
//                                   <CTableDataCell>{hsnCode}</CTableDataCell>
//                                   <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <CFormInput
//                                       type="number"
//                                       min="0"
//                                       step="0.01"
//                                       placeholder="Enter discount"
//                                       value={discountValue}
//                                       onChange={(e) => handleHeaderDiscountChange(header._id, e.target.value)}
//                                       disabled={!isDiscountAllowed}
//                                       style={{ width: '150px' }}
//                                     />
//                                     {errors[`discount_${header._id}`] && (
//                                       <small className="text-danger d-block">{errors[`discount_${header._id}`]}</small>
//                                     )}
//                                   </CTableDataCell>
//                                   <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                                   <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                                   <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <strong>₹{lineTotal.toFixed(2)}</strong>
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               );
//                             })}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//                     Back
//                   </button>
//                   <button type="submit" className="submit-button" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking;











// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: ''
//   });
  
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [userVerticleIds, setUserVerticleIds] = useState([]);
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
//   const [isSubdealerUser, setIsSubdealerUser] = useState(false);
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchUserProfile();
    
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;
//       const verticlesData = userData?.verticles || [];
//       const userSubdealer = userData?.subdealer;
      
//       // Extract verticle IDs from the objects
//       const verticleIds = verticlesData.map(verticle => verticle._id);
//       setUserVerticleIds(verticleIds);
      
//       // Check if user is a subdealer
//       const userIsSubdealer = userData.roles?.some(role => 
//         role.name === 'SUBDEALER' || role.name === 'Subdealer'
//       );
//       setIsSubdealerUser(userIsSubdealer);
      
//       // If user is subdealer and has subdealer data, auto-select it
//       if (userIsSubdealer && userSubdealer && userSubdealer._id) {
//         setFormData(prev => ({
//           ...prev,
//           subdealer: userSubdealer._id
//         }));
//         setSelectedSubdealerName(userSubdealer.name || '');
        
//         // Also fetch models with this subdealer
//         fetchModels(formData.customer_type || 'B2C', userSubdealer._id);
//       }
      
//       // Pass the full verticles data to fetchAllVerticles
//       await fetchAllVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       // Since we already have the user's verticles data, we can use it directly
//       // Filter to only include active verticles
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${bookingId}`);
//       const bookingData = response.data.data;

//       const priceComponents = bookingData.priceComponents || [];
//       setBookingPriceComponents(priceComponents);

//       const initialDiscounts = {};
//       if (priceComponents.length > 0) {
//         priceComponents.forEach(priceComponent => {
//           if (priceComponent.header && priceComponent.header._id) {
//             const discountAmount = priceComponent.discountAmount || 0;
//             initialDiscounts[priceComponent.header._id] = discountAmount;
//           }
//         });
//       }
      
//       console.log('Initial discounts from booking API:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

//       const optionalComponents = priceComponents.filter((pc) => pc.header && pc.header._id)?.map((pc) => pc.header._id) || [];

//       const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//         ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//         : '';

//       setFormData({
//         verticle_id: bookingVerticle,
//         model_id: bookingData.model?.id || '',
//         model_color: bookingData.color?.id || '',
//         customer_type: bookingData.customerType || 'B2C',
//         rto_type: bookingData.rto || 'MH',
//         subdealer: bookingData.subdealer?._id || '',
//         optionalComponents: optionalComponents,
//         sales_executive: bookingData.salesExecutive?._id || '',
//         gstin: bookingData.gstin || '',
//         rtoAmount: bookingData.rtoAmount || '',
//         salutation: bookingData.customerDetails?.salutation || '',
//         name: bookingData.customerDetails?.name || '',
//         pan_no: bookingData.customerDetails?.panNo || '',
//         dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//         occupation: bookingData.customerDetails?.occupation || '',
//         address: bookingData.customerDetails?.address || '',
//         taluka: bookingData.customerDetails?.taluka || '',
//         district: bookingData.customerDetails?.district || '',
//         pincode: bookingData.customerDetails?.pincode || '',
//         mobile1: bookingData.customerDetails?.mobile1 || '',
//         mobile2: bookingData.customerDetails?.mobile2 || '',
//         aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//         nomineeName: bookingData.customerDetails?.nomineeName || '',
//         nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//         nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//         type: bookingData.payment?.type?.toLowerCase() || 'cash',
//         financer_id: bookingData.payment?.financer?._id || '',
//         value: bookingData.discounts[0]?.amount || 0,
//         selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//         hpa: bookingData.hpa || false,
//         note: bookingData.note || ''
//       });

//       setSelectedSubdealerName(bookingData.subdealer?.name || '');
//       setModelDetails(bookingData.model || null);
//       setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//       // Store model type and name
//       if (bookingData.model) {
//         setModelType(bookingData.model.type);
//         setSelectedModelName(bookingData.model.model_name);
//       }

//       if (bookingData.model?.id) {
//         setTimeout(() => {
//           fetchModelHeadersForEdit(bookingData.model.id, initialDiscounts);
//         }, 1000);
        
//         fetchAccessories(bookingData.model.id);
//         fetchModelColors(bookingData.model.id);
//       }
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       showFormSubmitError('Failed to load booking details');
//     }
//   };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);

//   const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
//     try {
//       console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];

//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       console.log('Model prices structure:', prices);

//       const mergedDiscounts = {};
      
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           if (existingDiscounts[headerId] !== undefined) {
//             mergedDiscounts[headerId] = existingDiscounts[headerId];
//           } else {
//             mergedDiscounts[headerId] = '';
//           }
//         }
//       });
      
//       console.log('Merged discounts after fetching model headers:', mergedDiscounts);
//       setHeaderDiscounts(mergedDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
      
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id'];
//     // Only require subdealer if user is not a subdealer
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
    
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
    
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       // Filter models by verticle if verticle is selected
//       if (formData.verticle_id) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
//         );
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];

//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: [...prev.optionalComponents, ...mandatoryHeaders]
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts for new booking:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       // First get the model details to know the type and name
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type; // This will be "ICE" or "EV" etc.
//       const modelName = modelData.model_name;
      
//       // Store the model type and name
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       // Now fetch all accessories
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       // Filter accessories based on:
//       // 1. Accessory's category type matches model type AND
//       // 2. Accessory is applicable to this specific model (if applicable_models is defined)
//       // OR accessory has no specific model restrictions
//       const filteredAccessories = allAccessories.filter(accessory => {
//         // First check: accessory category type must match model type
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false; // Skip if type doesn't match
//         }
        
//         // Second check: if accessory has specific applicable models
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           // Check if this model is in the applicable models list
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         // If no specific model restrictions, include it (type already matched)
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
//       setAccessories(filteredAccessories);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'customer_type') {
//       fetchModels(value, formData.subdealer);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'verticle_id') {
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: value,
//         model_id: '',
//         model_name: ''
//       }));

//       if (value) {
//         const filtered = models.filter(model => 
//           model.verticle_id === value || model.verticle === value
//         );
//         setFilteredModels(filtered);
//       } else {
//         setFilteredModels(models);
//       }
//     } else if (name === 'subdealer') {
//       const selectedSubdealer = subdealers.find((b) => b._id === value);
//       setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//       fetchModels(formData.customer_type, value);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: ''
//       }));
//     } else if (name === 'model_id') {
//       const selectedModel = models.find((model) => model._id === value);
//       if (selectedModel) {
//         setFormData((prev) => ({
//           ...prev,
//           model_name: selectedModel.model_name,
//           model_id: value
//         }));
        
//         // Store model type and name
//         setModelType(selectedModel.type);
//         setSelectedModelName(selectedModel.model_name);
        
//         fetchAccessories(value);
//         fetchModelColors(value);
//         if (isEditMode) {
//           fetchModelHeadersForEdit(value, headerDiscounts);
//         } else {
//           fetchModelHeaders(value);
//         }
//       }
//     }
//   };

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     return selectedModel?.modelPrices || [];
//   };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           optionalComponents: [...prev.optionalComponents, headerId]
//         };
//       } else {
//         return {
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
//         };
//       }
//     });
//   };

//   const handleHeaderDiscountChange = (headerId, value) => {
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId]
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     // For B2B/B2C, calculate taxable amount
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     // For B2B/B2C, split GST equally
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   // Calculate total deal amount - Exclude specific headers and include HPA if applicable
//   const calculateTotalDealAmount = () => {
//     const selectedHeaders = getSelectedModelHeaders()
//       .filter((price) => price.header && price.header._id)
//       .filter((price) => {
//         const header = price.header;
//         const isChecked = header.is_mandatory || formData.optionalComponents.includes(header._id);
        
//         // EXCLUDE these specific headers (summary/total headers)
//         const excludedHeaders = [
//           'ON ROAD PRICE (A)',
//           'TOTAL ONROAD + ADDON SERVICES',
//           'TOTAL ONROAD+ADDON SERVICES',
//           'ADDON SERVICES TOTAL (B)'
//         ];
        
//         return isChecked && !excludedHeaders.includes(header.header_key);
//       });

//     let totalBeforeDiscount = 0;
//     let totalAfterDiscount = 0;
//     let totalDiscount = 0;

//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const unitPrice = price.value || 0;
//       const discountValue = headerDiscounts[header._id] !== undefined ? headerDiscounts[header._id] : '';
//       const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
//       const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//       const taxableBefore = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
//       const taxableAfter = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
      
//       const { cgstAmount: cgstBefore, sgstAmount: sgstBefore } = calculateGST(taxableBefore, gstRate, formData.customer_type);
//       const { cgstAmount: cgstAfter, sgstAmount: sgstAfter } = calculateGST(taxableAfter, gstRate, formData.customer_type);
      
//       const lineTotalBefore = calculateLineTotal(taxableBefore, cgstBefore, sgstBefore);
//       const lineTotalAfter = calculateLineTotal(taxableAfter, cgstAfter, sgstAfter);
      
//       totalBeforeDiscount += lineTotalBefore;
//       totalAfterDiscount += lineTotalAfter;
//       totalDiscount += discountAmount;
//     });

//     // Add HPA amount if applicable
//     if (formData.hpa === true) {
//       // Assuming there's an HPA header in the model prices
//       const hpaHeader = getSelectedModelHeaders()
//         .find((price) => price.header && price.header.header_key === 'HYPOTHECATION CHARGES (IF APPLICABLE)');
      
//       if (hpaHeader) {
//         const hpaUnitPrice = hpaHeader.value || 0;
//         const hpaDiscountValue = headerDiscounts[hpaHeader.header._id] !== undefined ? headerDiscounts[hpaHeader.header._id] : '';
//         const hpaDiscountAmount = hpaDiscountValue !== '' ? parseFloat(hpaDiscountValue) : 0;
        
//         const hpaGstRate = hpaHeader.header.metadata?.gst_rate ? parseFloat(hpaHeader.header.metadata.gst_rate) : 0;
//         const hpaTaxableBefore = calculateTaxableAmount(hpaUnitPrice, 0, hpaGstRate, formData.customer_type);
//         const hpaTaxableAfter = calculateTaxableAmount(hpaUnitPrice, hpaDiscountAmount, hpaGstRate, formData.customer_type);
        
//         const { cgstAmount: hpaCgstBefore, sgstAmount: hpaSgstBefore } = calculateGST(hpaTaxableBefore, hpaGstRate, formData.customer_type);
//         const { cgstAmount: hpaCgstAfter, sgstAmount: hpaSgstAfter } = calculateGST(hpaTaxableAfter, hpaGstRate, formData.customer_type);
        
//         const hpaLineTotalBefore = calculateLineTotal(hpaTaxableBefore, hpaCgstBefore, hpaSgstBefore);
//         const hpaLineTotalAfter = calculateLineTotal(hpaTaxableAfter, hpaCgstAfter, hpaSgstAfter);
        
//         totalBeforeDiscount += hpaLineTotalBefore;
//         totalAfterDiscount += hpaLineTotalAfter;
//         totalDiscount += hpaDiscountAmount;
//       }
//     }

//     return {
//       totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
//       totalAfterDiscount: totalAfterDiscount.toFixed(2),
//       totalDiscount: totalDiscount.toFixed(2)
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = [
//       'verticle_id',
//       'model_id',
//       'model_color',
//       'customer_type',
//       'name',
//       'address',
//       'mobile1',
//       'aadhar_number',
//       'pan_no'
//     ];
    
//     // Only require subdealer if user is not a subdealer
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle selection is required';
//     }

//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       formErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     const headerDiscountsArray = Object.entries(headerDiscounts)
//       .filter(([headerId, value]) => value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)))
//       .map(([headerId, value]) => ({
//         headerId,
//         discountAmount: parseFloat(value) || 0
//       }));

//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       subdealer: formData.subdealer,
//       verticles: formData.verticle_id ? [formData.verticle_id] : [],
//       optionalComponents: formData.optionalComponents,
//       sales_executive: formData.sales_executive,
//       customer_details: {
//         salutation: formData.salutation,
//         name: formData.name,
//         pan_no: formData.pan_no,
//         dob: formData.dob,
//         occupation: formData.occupation,
//         address: formData.address,
//         taluka: formData.taluka,
//         district: formData.district,
//         pincode: formData.pincode,
//         mobile1: formData.mobile1,
//         mobile2: formData.mobile2,
//         aadhar_number: formData.aadhar_number,
//         nomineeName: formData.nomineeName,
//         nomineeRelation: formData.nomineeRelation,
//         nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//       },
//       payment: {
//         type: formData.type.toUpperCase(),
//         ...(formData.type.toLowerCase() === 'finance' && {
//           financer_id: formData.financer_id
//         })
//       },
//       headerDiscounts: headerDiscountsArray,
//       discount: {
//         type: formData.discountType,
//         value: formData.value ? parseFloat(formData.value) : 0
//       },
//       accessories: {
//         selected: formData.selected_accessories.map((id) => ({ id }))
//       },
//       hpa: formData.hpa === true,
//       note: formData.note
//     };

//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rtoAmount = formData.rtoAmount;
//     }

//     console.log('Submitting request body:', requestBody);

//     try {
//       let response;
//       if (isEditMode) {
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//         navigate('/subdealer-all-bookings');
//       } else {
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const debugHeaderDiscounts = () => {
//     console.log('Current headerDiscounts:', headerDiscounts);
//     console.log('Current formData.model_id:', formData.model_id);
//     console.log('Current models:', models);
//   };

//   // Calculate totals
//   const dealTotals = calculateTotalDealAmount();

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                         {/* CSD option removed */}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       {isSubdealerUser && formData.subdealer ? (
//                         <CFormInput 
//                           type="text" 
//                           value={selectedSubdealerName}
//                           readOnly
//                           disabled
//                         />
//                       ) : (
//                         <CFormSelect 
//                           name="subdealer" 
//                           value={formData.subdealer} 
//                           onChange={handleChange}
//                           disabled={isEditMode}
//                         >
//                           <option value="">-Select-</option>
//                           {subdealers.map((subdealer) => (
//                             <option key={subdealer._id} value={subdealer._id}>
//                               {subdealer.name}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       )}
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {isSubdealerUser && formData.subdealer && (
//                       <small className="text-muted">
//                         Subdealer auto-selected based on your account
//                       </small>
//                     )}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={!formData.subdealer || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

//                 {/* {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>Model Options</h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const isChecked = isMandatory || formData.optionalComponents.includes(header._id);

//                           return (
//                             <div key={header._id} className="header-item">
//                               <CFormCheck
//                                 id={`header-${header._id}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )} */}

//                 {getSelectedModelHeaders().length > 0 && (
//   <div className="model-headers-section">
//     <h5>Model Options</h5>
//     <div className="headers-list">
//       {getSelectedModelHeaders()
//         .filter((price) => price.header && price.header._id)
//         .map((price) => {
//           const header = price.header;
//           const isMandatory = header.is_mandatory;
//           // For non-mandatory headers, default to checked (true)
//           // For mandatory, always checked
//           const isChecked = isMandatory || 
//                            formData.optionalComponents.includes(header._id) ||
//                            (!isMandatory && !formData.optionalComponents.includes(header._id));

//           return (
//             <div key={header._id} className="header-item">
//               <CFormCheck
//                 id={`header-${header._id}`}
//                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                 checked={isChecked}
//                 onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                 disabled={isMandatory}
//               />
//               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//             </div>
//           );
//         })}
//     </div>
//   </div>
// )}
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0 || isEditMode}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 {/* <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => (
//                           <div key={accessory._id} className="accessory-item">
//                             <CFormCheck
//                               id={`accessory-${accessory._id}`}
//                               label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                               checked={formData.selected_accessories.includes(accessory._id)}
//                               onChange={(e) => handleAccessorySelection(accessory._id, e.target.checked)}
//                             />
//                             {accessory.description && (
//                               <small className="text-muted d-block">{accessory.description}</small>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div> */}

//                 <div>
//   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//   {accessories.length > 0 ? (
//     <>
//       <p className="text-muted mb-3">
//         Showing accessories compatible with {selectedModelName} ({modelType} type)
//       </p>
//       <div className="accessories-list">
//         {accessories.map((accessory) => {
//           // Determine if accessory should be checked by default
//           // If it's not in selected_accessories array, it's auto-checked
//           const isChecked = !formData.selected_accessories.includes(accessory._id);
          
//           return (
//             <div key={accessory._id} className="accessory-item">
//               <CFormCheck
//                 id={`accessory-${accessory._id}`}
//                 label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                 checked={isChecked}
//                 onChange={(e) => {
//                   // If checkbox is checked (default state), remove from selected_accessories
//                   // If checkbox is unchecked, add to selected_accessories
//                   if (e.target.checked) {
//                     // Remove from selected_accessories (returning to default checked state)
//                     const updatedAccessories = formData.selected_accessories.filter(id => id !== accessory._id);
//                     setFormData({...formData, selected_accessories: updatedAccessories});
//                   } else {
//                     // Add to selected_accessories (user explicitly unchecked)
//                     const updatedAccessories = [...formData.selected_accessories, accessory._id];
//                     setFormData({...formData, selected_accessories: updatedAccessories});
//                   }
//                 }}
//               />
//               {accessory.description && (
//                 <small className="text-muted d-block">{accessory.description}</small>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </>
//   ) : (
//     <div className="alert alert-info">
//       <p>No accessories available for {selectedModelName} ({modelType})</p>
//       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//     </div>
//   )}
// </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 6 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <div style={{ flex: '0 0 48%' }}>
//                       <span className="details">Note</span>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilList} />
//                         </CInputGroupText>
//                         <CFormInput name="note" value={formData.note} onChange={handleChange} />
//                       </CInputGroup>
//                     </div>
                    
//                     {/* Total Deal Amount - Right side */}
//                     <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
//                       <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
//                       <div style={{ 
//                         display: 'inline-block',
//                         backgroundColor: '#f8f9fa',
//                         padding: '10px 15px',
//                         borderRadius: '5px',
//                         border: '1px solid #dee2e6',
//                         minWidth: '200px',
//                         textAlign: 'left'
//                       }}>
//                         {parseFloat(dealTotals.totalDiscount) > 0 ? (
//                           <>
//                             <div style={{ 
//                               display: 'flex', 
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                               marginBottom: '3px'
//                             }}>
//                               <small style={{ color: '#666' }}>Before Discount:</small>
//                               <span>₹{dealTotals.totalBeforeDiscount}</span>
//                             </div>
                            
//                             <div style={{ 
//                               display: 'flex', 
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                               marginBottom: '3px',
//                               color: '#666'
//                             }}>
//                               <small>Discount:</small>
//                               <span>- ₹{dealTotals.totalDiscount}</span>
//                             </div>
                            
//                             <div style={{ 
//                               width: '100%', 
//                               height: '1px', 
//                               backgroundColor: '#ccc', 
//                               margin: '3px 0',
//                               borderTop: '1px dashed #999'
//                             }}></div>
                            
//                             <div style={{ 
//                               display: 'flex', 
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                               marginTop: '3px',
//                               fontWeight: 'bold'
//                             }}>
//                               <span>Final Amount:</span>
//                               <span style={{ color: '#198754', fontSize: '14px' }}>₹{dealTotals.totalAfterDiscount}</span>
//                             </div>
//                           </>
//                         ) : (
//                           <div style={{ 
//                             display: 'flex', 
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             fontWeight: 'bold'
//                           }}>
//                             <span>Total:</span>
//                             <span style={{ color: '#198754', fontSize: '14px' }}>₹{dealTotals.totalAfterDiscount}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section" style={{ marginTop: '20px' }}>
//                     <h5>Model Options</h5>
//                     {/* Debug button */}
//                     {/* <button 
//                       type="button" 
//                       onClick={debugHeaderDiscounts}
//                       style={{ marginBottom: '10px', padding: '5px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
//                     >
//                       Debug Discounts
//                     </button> */}
//                     <div className="table-responsive">
//                       <CTable striped hover responsive>
//                         <CTableHead>
//                           <CTableRow>
//                             <CTableHeaderCell>Particulars</CTableHeaderCell>
//                             <CTableHeaderCell>HSN</CTableHeaderCell>
//                             <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>CGST %</CTableHeaderCell>
//                             <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>SGST %</CTableHeaderCell>
//                             <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                           {getSelectedModelHeaders()
//                             .filter((price) => price.header && price.header._id)
//                             .map((price) => {
//                               const header = price.header;
//                               const isMandatory = header.is_mandatory;
//                               const isDiscountAllowed = header.is_discount;
//                               const isChecked = isMandatory || formData.optionalComponents.includes(header._id);
                              
//                               if (!isChecked) return null;

//                               // Get the discount amount from headerDiscounts state
//                               const discountValue = headerDiscounts[header._id] !== undefined ? headerDiscounts[header._id] : '';
//                               const unitPrice = price.value || 0;
//                               const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
//                               const netAmount = unitPrice - discountAmount;
                              
//                               // Get GST rate from metadata
//                               const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                               const hsnCode = header.metadata?.hsn_code || 'N/A';
                              
//                               // Calculate taxable amount based on customer type
//                               const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                              
//                               // Calculate CGST and SGST based on customer type
//                               const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                              
//                               // Calculate line total
//                               const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);

//                               return (
//                                 <CTableRow key={header._id}>
//                                   <CTableDataCell>
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                       <CFormCheck
//                                         id={`header-${header._id}`}
//                                         label={`${header.header_key} ${isMandatory ? '(Mandatory)' : ''}`}
//                                         checked={true}
//                                         onChange={(e) => !isMandatory && handleHeaderSelection(header._id, e.target.checked)}
//                                         disabled={isMandatory}
//                                         style={{ marginRight: '10px' }}
//                                       />
//                                       {header.header_key}
//                                     </div>
//                                   </CTableDataCell>
//                                   <CTableDataCell>{hsnCode}</CTableDataCell>
//                                   <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <CFormInput
//                                       type="number"
//                                       min="0"
//                                       step="0.01"
//                                       placeholder="Enter discount"
//                                       value={discountValue}
//                                       onChange={(e) => handleHeaderDiscountChange(header._id, e.target.value)}
//                                       disabled={!isDiscountAllowed}
//                                       style={{ width: '150px' }}
//                                     />
//                                     {errors[`discount_${header._id}`] && (
//                                       <small className="text-danger d-block">{errors[`discount_${header._id}`]}</small>
//                                     )}
//                                   </CTableDataCell>
//                                   <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                                   <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                                   <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <strong>₹{lineTotal.toFixed(2)}</strong>
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               );
//                             })}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//                     Back
//                   </button>
//                   <button type="submit" className="submit-button" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking;












// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: '',
//     uncheckedHeaders: [],
//     uncheckedAccessories: []
//   });
  
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [userVerticleIds, setUserVerticleIds] = useState([]);
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
//   const [isSubdealerUser, setIsSubdealerUser] = useState(false);
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchUserProfile();
    
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;
//       const verticlesData = userData?.verticles || [];
//       const userSubdealer = userData?.subdealer;
      
//       const verticleIds = verticlesData.map(verticle => verticle._id);
//       setUserVerticleIds(verticleIds);
      
//       const userIsSubdealer = userData.roles?.some(role => 
//         role.name === 'SUBDEALER' || role.name === 'Subdealer'
//       );
//       setIsSubdealerUser(userIsSubdealer);
      
//       if (userIsSubdealer && userSubdealer && userSubdealer._id) {
//         setFormData(prev => ({
//           ...prev,
//           subdealer: userSubdealer._id
//         }));
//         setSelectedSubdealerName(userSubdealer.name || '');
        
//         fetchModels(formData.customer_type || 'B2C', userSubdealer._id);
//       }
      
//       await fetchAllVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

// const fetchBookingDetails = async (bookingId) => {
//   try {
//     const response = await axiosInstance.get(`/bookings/${bookingId}`);
//     const bookingData = response.data.data;

//     console.log('=== EDIT MODE: Fetching Booking Details ===');

//     const priceComponents = bookingData.priceComponents || [];
//     setBookingPriceComponents(priceComponents);

//     // Get booked header IDs from API
//     const bookedHeaderIds = priceComponents
//       .filter(pc => pc.header && pc.header._id)
//       .map(pc => pc.header._id);

//     console.log('Booked headers from API:', bookedHeaderIds);

//     // Calculate initial discounts
//     const initialDiscounts = {};
//     priceComponents.forEach(priceComponent => {
//       if (priceComponent.header && priceComponent.header._id) {
//         const discountAmount = priceComponent.discountAmount || 0;
//         initialDiscounts[priceComponent.header._id] = discountAmount;
//       }
//     });
    
//     console.log('Initial discounts from booking API:', initialDiscounts);
//     setHeaderDiscounts(initialDiscounts);

//     await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

//     const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//       ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//       : '';

//     // Set form data - set optionalComponents to bookedHeaderIds
//     const formDataToSet = {
//       verticle_id: bookingVerticle,
//       model_id: bookingData.model?.id || '',
//       model_color: bookingData.color?.id || '',
//       customer_type: bookingData.customerType || 'B2C',
//       rto_type: bookingData.rto || 'MH',
//       subdealer: bookingData.subdealer?._id || '',
//       optionalComponents: bookedHeaderIds, // CRITICAL: Set from API
//       sales_executive: bookingData.salesExecutive?._id || '',
//       gstin: bookingData.gstin || '',
//       rtoAmount: bookingData.rtoAmount || '',
//       salutation: bookingData.customerDetails?.salutation || '',
//       name: bookingData.customerDetails?.name || '',
//       pan_no: bookingData.customerDetails?.panNo || '',
//       dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//       occupation: bookingData.customerDetails?.occupation || '',
//       address: bookingData.customerDetails?.address || '',
//       taluka: bookingData.customerDetails?.taluka || '',
//       district: bookingData.customerDetails?.district || '',
//       pincode: bookingData.customerDetails?.pincode || '',
//       mobile1: bookingData.customerDetails?.mobile1 || '',
//       mobile2: bookingData.customerDetails?.mobile2 || '',
//       aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//       nomineeName: bookingData.customerDetails?.nomineeName || '',
//       nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//       nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//       type: bookingData.payment?.type?.toLowerCase() || 'cash',
//       financer_id: bookingData.payment?.financer?._id || '',
//       value: bookingData.discounts[0]?.amount || 0,
//       selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//       hpa: bookingData.hpa || false,
//       note: bookingData.note || '',
//       uncheckedHeaders: [], // We'll calculate this differently
//       uncheckedAccessories: []
//     };

//     console.log('Form data set with optionalComponents:', bookedHeaderIds);
//     setFormData(formDataToSet);

//     setSelectedSubdealerName(bookingData.subdealer?.name || '');
//     setModelDetails(bookingData.model || null);
//     setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//     if (bookingData.model) {
//       setModelType(bookingData.model.type);
//       setSelectedModelName(bookingData.model.model_name);
//     }

//     if (bookingData.model?.id) {
//       console.log('Model found, fetching model details...');
      
//       // After model loads, we'll update uncheckedHeaders
//       setTimeout(() => {
//         const selectedModel = models.find((model) => model._id === bookingData.model.id);
//         if (selectedModel && selectedModel.modelPrices) {
//           // Get all header IDs from model
//           const allHeaders = selectedModel.modelPrices
//             .filter(price => price.header && price.header._id)
//             .map(price => price.header._id);
          
//           // Calculate unchecked headers: headers in model but NOT in optionalComponents AND not mandatory
//           const uncheckedHeaders = [];
//           selectedModel.modelPrices.forEach(price => {
//             if (price.header && price.header._id) {
//               const headerId = price.header._id;
//               const isMandatory = price.header.is_mandatory || false;
//               const isInOptionalComponents = bookedHeaderIds.includes(headerId);
              
//               if (!isMandatory && !isInOptionalComponents) {
//                 uncheckedHeaders.push(headerId);
//               }
//             }
//           });
          
//           console.log('Calculated uncheckedHeaders:', uncheckedHeaders);
          
//           // Update form data
//           setFormData(prev => ({
//             ...prev,
//             uncheckedHeaders: uncheckedHeaders
//           }));
//         }
//       }, 1000);
      
//       fetchAccessories(bookingData.model.id);
//       fetchModelColors(bookingData.model.id);
//     }
//   } catch (error) {
//     console.error('Error fetching booking details:', error);
//     showFormSubmitError('Failed to load booking details');
//   }
// };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);

//   const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
//     try {
//       console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
      
//       // For edit mode, don't override existing values
//       if (!isEditMode) {
//         const allHeaders = prices
//           .filter(price => price.header && price.header._id)
//           .map(price => price.header._id);
        
//         setFormData(prev => ({
//           ...prev,
//           optionalComponents: allHeaders,
//           uncheckedHeaders: []
//         }));
//       }

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       console.log('Model prices structure:', prices);

//       const mergedDiscounts = {};
      
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           if (existingDiscounts[headerId] !== undefined) {
//             mergedDiscounts[headerId] = existingDiscounts[headerId];
//           } else {
//             mergedDiscounts[headerId] = '';
//           }
//         }
//       });
      
//       console.log('Merged discounts after fetching model headers:', mergedDiscounts);
//       setHeaderDiscounts(mergedDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
      
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id'];
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
    
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
    
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       if (formData.verticle_id) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
//         );
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const fetchModelHeaders = async (modelId) => {
//   try {
//     const response = await axiosInstance.get(`/models/${modelId}`);
//     const modelData = response.data.data.model;
//     const prices = modelData.prices || [];

//     const selectedModel = models.find((model) => model._id === modelId);
    
//     // Get ALL headers
//     const allHeaders = prices
//       .filter(price => price.header && price.header._id)
//       .map(price => price.header._id);

//     setFormData((prev) => ({
//       ...prev,
//       optionalComponents: allHeaders, // Initialize with ALL headers
//       uncheckedHeaders: [] // Empty array = nothing unchecked = all checked
//     }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts for new booking:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type;
//       const modelName = modelData.model_name;
      
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       const filteredAccessories = allAccessories.filter(accessory => {
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false;
//         }
        
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
      
//       const accessoryIds = filteredAccessories.map(accessory => accessory._id);
      
//       setFormData(prev => ({
//         ...prev,
//         selected_accessories: accessoryIds,
//         uncheckedAccessories: []
//       }));
      
//       setAccessories(filteredAccessories);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, []);

//  const handleChange = (e) => {
//   const { name, value } = e.target;
//   setFormData((prevData) => ({ ...prevData, [name]: value }));
//   setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//   if (name === 'customer_type') {
//     fetchModels(value, formData.subdealer);
//     setFormData((prev) => ({
//       ...prev,
//       verticle_id: '',
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: []
//     }));
//   } else if (name === 'verticle_id') {
//     setFormData((prev) => ({
//       ...prev,
//       verticle_id: value,
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: []
//     }));

//     if (value) {
//       const filtered = models.filter(model => 
//         model.verticle_id === value || model.verticle === value
//       );
//       setFilteredModels(filtered);
//     } else {
//       setFilteredModels(models);
//     }
//   } else if (name === 'subdealer') {
//     const selectedSubdealer = subdealers.find((b) => b._id === value);
//     setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//     fetchModels(formData.customer_type, value);
//     setFormData((prev) => ({
//       ...prev,
//       verticle_id: '',
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: []
//     }));
//   } else if (name === 'model_id') {
//     const selectedModel = models.find((model) => model._id === value);
//     if (selectedModel) {
//       setFormData((prev) => ({
//         ...prev,
//         model_name: selectedModel.model_name,
//         model_id: value,
//         optionalComponents: [],
//         selected_accessories: [],
//         uncheckedHeaders: [], // Reset unchecked headers when model changes
//         uncheckedAccessories: []
//       }));
      
//       setModelType(selectedModel.type);
//       setSelectedModelName(selectedModel.model_name);
      
//       fetchAccessories(value);
//       fetchModelColors(value);
//       if (isEditMode) {
//         fetchModelHeadersForEdit(value, headerDiscounts);
//       } else {
//         fetchModelHeaders(value);
//       }
//     }
//   }
// };

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     return selectedModel?.modelPrices || [];
//   };

//   const handleHeaderSelection = (headerId, isChecked) => {
//   setFormData((prev) => {
//     if (isChecked) {
//       return {
//         ...prev,
//         // Add to optionalComponents
//         optionalComponents: [...prev.optionalComponents, headerId],
//         // Remove from uncheckedHeaders if it was there
//         uncheckedHeaders: prev.uncheckedHeaders?.filter(id => id !== headerId) || []
//       };
//     } else {
//       return {
//         ...prev,
//         // Remove from optionalComponents
//         optionalComponents: prev.optionalComponents.filter((id) => id !== headerId),
//         // Add to uncheckedHeaders
//         uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId]
//       };
//     }
//   });
// };

//   const handleHeaderDiscountChange = (headerId, value) => {
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId]
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };


//   const getCheckedHeadersForTab6 = () => {
//   if (!formData.model_id) return [];

//   const selectedModel = models.find((model) => model._id === formData.model_id);
//   if (!selectedModel) return [];
  
//   const modelPrices = selectedModel.modelPrices || [];
  
//   // Filter to show only headers that are checked
//   return modelPrices.filter((price) => {
//     if (!price.header || !price.header._id) return false;
    
//     const headerId = price.header._id;
//     const isMandatory = price.header.is_mandatory;
    
//     // Header is checked if:
//     // 1. It's mandatory OR
//     // 2. It's in optionalComponents (user checked it)
//     const isChecked = isMandatory || formData.optionalComponents.includes(headerId);
    
//     return isChecked;
//   });
// };

// const calculateTotalDealAmount = () => {
//   // Use getCheckedHeadersForTab6 to get only checked headers
//   const selectedHeaders = getCheckedHeadersForTab6()
//     .filter((price) => price.header && price.header._id)
//     .filter((price) => {
//       const header = price.header;
      
//       // Exclude summary/total headers - DO NOT INCLUDE IN CALCULATION
//       const excludedHeaders = [
//         'ON ROAD PRICE (A)',
        
//         'TOTAL ONROAD+ADDON SERVICES',
//         'TOTAL ONROAD + ADDON SERVICES',
//         'ADDON SERVICES TOTAL (B)',
//         'ACCESSORIES TOTAL',
       
//         'ON ROAD PRICE',
//         'ADDON SERVICES TOTAL',
//         'ADD ON SERVICES TOTAL',
//         'TOTAL AMOUNT',
//         'GRAND TOTAL',
//         'FINAL AMOUNT',
//         'TOTAL',
//         'ON-ROAD PRICE',
//         'FINAL PRICE',
//         'COMPLETE PRICE'
//       ];
      
//       const headerKey = header.header_key || '';
//       const shouldExclude = excludedHeaders.includes(headerKey);
      
//       return !shouldExclude;
//     });

//   let totalBeforeDiscount = 0;
//   let totalAfterDiscount = 0;
//   let totalDiscount = 0;

//   selectedHeaders.forEach((price) => {
//     const header = price.header;
//     const unitPrice = price.value || 0;
//     const discountValue = headerDiscounts[header._id] !== undefined ? headerDiscounts[header._id] : '';
//     const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
    
//     const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//     const taxableBefore = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
//     const taxableAfter = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
    
//     const { cgstAmount: cgstBefore, sgstAmount: sgstBefore } = calculateGST(taxableBefore, gstRate, formData.customer_type);
//     const { cgstAmount: cgstAfter, sgstAmount: sgstAfter } = calculateGST(taxableAfter, gstRate, formData.customer_type);
    
//     const lineTotalBefore = calculateLineTotal(taxableBefore, cgstBefore, sgstBefore);
//     const lineTotalAfter = calculateLineTotal(taxableAfter, cgstAfter, sgstAfter);
    
//     totalBeforeDiscount += lineTotalBefore;
//     totalAfterDiscount += lineTotalAfter;
//     totalDiscount += discountAmount;
//   });

//   // Add HPA amount if applicable
//   if (formData.hpa === true) {
//     const hpaHeader = getCheckedHeadersForTab6()
//       .find((price) => price.header && price.header.header_key === 'HYPOTHECATION CHARGES (IF APPLICABLE)');
    
//     if (hpaHeader) {
//       const hpaUnitPrice = hpaHeader.value || 0;
//       const hpaDiscountValue = headerDiscounts[hpaHeader.header._id] !== undefined ? headerDiscounts[hpaHeader.header._id] : '';
//       const hpaDiscountAmount = hpaDiscountValue !== '' ? parseFloat(hpaDiscountValue) : 0;
      
//       const hpaGstRate = hpaHeader.header.metadata?.gst_rate ? parseFloat(hpaHeader.header.metadata.gst_rate) : 0;
//       const hpaTaxableBefore = calculateTaxableAmount(hpaUnitPrice, 0, hpaGstRate, formData.customer_type);
//       const hpaTaxableAfter = calculateTaxableAmount(hpaUnitPrice, hpaDiscountAmount, hpaGstRate, formData.customer_type);
      
//       const { cgstAmount: hpaCgstBefore, sgstAmount: hpaSgstBefore } = calculateGST(hpaTaxableBefore, hpaGstRate, formData.customer_type);
//       const { cgstAmount: hpaCgstAfter, sgstAmount: hpaSgstAfter } = calculateGST(hpaTaxableAfter, hpaGstRate, formData.customer_type);
      
//       const hpaLineTotalBefore = calculateLineTotal(hpaTaxableBefore, hpaCgstBefore, hpaSgstBefore);
//       const hpaLineTotalAfter = calculateLineTotal(hpaTaxableAfter, hpaCgstAfter, hpaSgstAfter);
      
//       totalBeforeDiscount += hpaLineTotalBefore;
//       totalAfterDiscount += hpaLineTotalAfter;
//       totalDiscount += hpaDiscountAmount;
//     }
//   }

//   return {
//     totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
//     totalAfterDiscount: totalAfterDiscount.toFixed(2),
//     totalDiscount: totalDiscount.toFixed(2)
//   };
// };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   const requiredFields = [
//     'verticle_id',
//     'model_id',
//     'model_color',
//     'customer_type',
//     'name',
//     'address',
//     'mobile1',
//     'aadhar_number',
//     'pan_no'
//   ];
  
//   if (!isSubdealerUser) {
//     requiredFields.push('subdealer');
//   }
  
//   let formErrors = {};

//   requiredFields.forEach((field) => {
//     if (!formData[field]) {
//       formErrors[field] = 'This field is required';
//     }
//   });

//   if (!formData.verticle_id) {
//     formErrors.verticle_id = 'Verticle selection is required';
//   }

//   if (formData.customer_type === 'B2B' && !formData.gstin) {
//     formErrors.gstin = 'GSTIN is required for B2B customers';
//   }

//   if (Object.keys(formErrors).length > 0) {
//     setErrors(formErrors);
//     setIsSubmitting(false);
//     const firstErrorField = Object.keys(formErrors)[0];
//     document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//       behavior: 'smooth',
//       block: 'center'
//     });
//     return;
//   }

//   console.log('=== SUBMITTING BOOKING ===');
//   console.log('Current formData.optionalComponents:', formData.optionalComponents);
//   console.log('Current formData.uncheckedHeaders:', formData.uncheckedHeaders);
//   console.log('Current headerDiscounts:', headerDiscounts);

//   // For edit mode: optionalComponents already contains only checked headers
//   // For new mode: optionalComponents contains all headers (default checked)
//   // We'll use optionalComponents as-is, but ensure mandatory headers are included
  
//   // Get the selected model to find mandatory headers
//   const selectedModel = models.find((model) => model._id === formData.model_id);
//   let mandatoryHeaders = [];
  
//   if (selectedModel && selectedModel.mandatoryHeaders) {
//     mandatoryHeaders = selectedModel.mandatoryHeaders;
//   }
  
//   console.log('Mandatory headers:', mandatoryHeaders);

//   // Ensure mandatory headers are included in optionalComponents
//   const allMandatoryHeadersIncluded = mandatoryHeaders.every(headerId => 
//     formData.optionalComponents.includes(headerId)
//   );
  
//   if (!allMandatoryHeadersIncluded) {
//     // Add missing mandatory headers
//     const updatedOptionalComponents = [...formData.optionalComponents];
//     mandatoryHeaders.forEach(headerId => {
//       if (!updatedOptionalComponents.includes(headerId)) {
//         updatedOptionalComponents.push(headerId);
//       }
//     });
    
//     console.log('Added missing mandatory headers, updated optionalComponents:', updatedOptionalComponents);
    
//     // Update form state
//     setFormData(prev => ({
//       ...prev,
//       optionalComponents: updatedOptionalComponents
//     }));
//   }

//   // Final optionalComponents to send (current state)
//   const finalOptionalComponents = [...formData.optionalComponents];
  
//   console.log('Final optionalComponents to submit:', finalOptionalComponents);

//   // Process header discounts - only include for headers in finalOptionalComponents
//   const headerDiscountsArray = Object.entries(headerDiscounts)
//     .filter(([headerId, value]) => {
//       const isSelected = finalOptionalComponents.includes(headerId);
//       const hasDiscount = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value));
//       console.log(`Header ${headerId}: isSelected=${isSelected}, hasDiscount=${hasDiscount}, value=${value}`);
//       return isSelected && hasDiscount;
//     })
//     .map(([headerId, value]) => ({
//       headerId,
//       discountAmount: parseFloat(value) || 0
//     }));

//   console.log('Header discounts to submit:', headerDiscountsArray);

//   // Process accessories
//   const accessoriesToSubmit = formData.selected_accessories || [];

//   // Prepare request body
//   const requestBody = {
//     model_id: formData.model_id,
//     model_color: formData.model_color,
//     customer_type: formData.customer_type,
//     rto_type: formData.rto_type,
//     subdealer: formData.subdealer,
//     verticles: formData.verticle_id ? [formData.verticle_id] : [],
//     optionalComponents: finalOptionalComponents, // This is the key - only checked headers
//     sales_executive: formData.sales_executive,
//     customer_details: {
//       salutation: formData.salutation,
//       name: formData.name,
//       pan_no: formData.pan_no,
//       dob: formData.dob,
//       occupation: formData.occupation,
//       address: formData.address,
//       taluka: formData.taluka,
//       district: formData.district,
//       pincode: formData.pincode,
//       mobile1: formData.mobile1,
//       mobile2: formData.mobile2,
//       aadhar_number: formData.aadhar_number,
//       nomineeName: formData.nomineeName,
//       nomineeRelation: formData.nomineeRelation,
//       nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//     },
//     payment: {
//       type: formData.type.toUpperCase(),
//       ...(formData.type.toLowerCase() === 'finance' && {
//         financer_id: formData.financer_id
//       })
//     },
//     headerDiscounts: headerDiscountsArray,
//     discount: {
//       type: formData.discountType,
//       value: formData.value ? parseFloat(formData.value) : 0
//     },
//     accessories: {
//       selected: accessoriesToSubmit.map((id) => ({ id }))
//     },
//     hpa: formData.hpa === true,
//     note: formData.note || ''
//   };

//   // Add conditional fields
//   if (formData.customer_type === 'B2B') {
//     requestBody.gstin = formData.gstin;
//   }
//   if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//     requestBody.rtoAmount = formData.rtoAmount;
//   }

//   console.log('=== FINAL REQUEST BODY ===');
//   console.log('optionalComponents being sent:', requestBody.optionalComponents);
//   console.log('Number of optionalComponents:', requestBody.optionalComponents.length);
//   console.log('Full request body:', JSON.stringify(requestBody, null, 2));

//   try {
//     let response;
//     if (isEditMode) {
//       console.log(`Updating booking with ID: ${id}`);
//       response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//     } else {
//       console.log('Creating new booking');
//       response = await axiosInstance.post('/bookings', requestBody);
//     }

//     console.log('API Response:', response.data);

//     if (response.data.success) {
//       const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//       console.log('Success:', successMessage);
//       await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//       navigate('/subdealer-all-bookings');
//     } else {
//       console.error('Submission failed:', response.data);
//       showFormSubmitError(response.data.message || 'Submission failed');
//     }
//   } catch (error) {
//     console.error('Submission error:', error);
//     console.error('Error response:', error.response?.data);
//     const message = showError(error);
//     if (message) setError(message);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   const dealTotals = calculateTotalDealAmount();

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       {isSubdealerUser && formData.subdealer ? (
//                         <CFormInput 
//                           type="text" 
//                           value={selectedSubdealerName}
//                           readOnly
//                           disabled
//                         />
//                       ) : (
//                         <CFormSelect 
//                           name="subdealer" 
//                           value={formData.subdealer} 
//                           onChange={handleChange}
//                           disabled={isEditMode}
//                         >
//                           <option value="">-Select-</option>
//                           {subdealers.map((subdealer) => (
//                             <option key={subdealer._id} value={subdealer._id}>
//                               {subdealer.name}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       )}
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {isSubdealerUser && formData.subdealer && (
//                       <small className="text-muted">
//                         Subdealer auto-selected based on your account
//                       </small>
//                     )}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={!formData.subdealer || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

  
// {getSelectedModelHeaders().length > 0 && (
//   <div className="model-headers-section">
//     <h5>Model Options</h5>
//     <div className="headers-list">
//       {getSelectedModelHeaders()
//         .filter((price) => price.header && price.header._id)
//         .map((price) => {
//           const header = price.header;
//           const isMandatory = header.is_mandatory;
          
//           // Use optionalComponents as source of truth for checked state
//           const isChecked = isMandatory || formData.optionalComponents.includes(header._id);

//           return (
//             <div key={header._id} className="header-item">
//               <CFormCheck
//                 id={`header-${header._id}`}
//                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : ''}`}
//                 checked={isChecked}
//                 onChange={(e) => {
//                   if (!isMandatory) {
//                     const isNowChecked = e.target.checked;
//                     setFormData(prev => {
//                       if (isNowChecked) {
//                         // Add to optionalComponents
//                         return {
//                           ...prev,
//                           optionalComponents: [...prev.optionalComponents, header._id]
//                         };
//                       } else {
//                         // Remove from optionalComponents
//                         return {
//                           ...prev,
//                           optionalComponents: prev.optionalComponents.filter((id) => id !== header._id)
//                         };
//                       }
//                     });
//                   }
//                 }}
//                 disabled={isMandatory}
//               />
//               {isMandatory && <input type="hidden" name={`mandatory-${header._id}`} value={header._id} />}
//             </div>
//           );
//         })}
//     </div>
//   </div>
// )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0 || isEditMode}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => {
//                           const isExplicitlyUnchecked = formData.uncheckedAccessories && formData.uncheckedAccessories.includes(accessory._id);
//                           const isChecked = !isExplicitlyUnchecked;

//                           return (
//                             <div key={accessory._id} className="accessory-item">
//                               <CFormCheck
//                                 id={`accessory-${accessory._id}`}
//                                 label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                                 checked={isChecked}
//                                 onChange={(e) => {
//                                   const isNowChecked = e.target.checked;
//                                   if (!isNowChecked) {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       uncheckedAccessories: [...(prev.uncheckedAccessories || []), accessory._id],
//                                       selected_accessories: prev.selected_accessories.filter(id => id !== accessory._id)
//                                     }));
//                                   } else {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       uncheckedAccessories: prev.uncheckedAccessories?.filter(id => id !== accessory._id) || [],
//                                       selected_accessories: [...prev.selected_accessories, accessory._id]
//                                     }));
//                                   }
//                                 }}
//                               />
//                               {accessory.description && (
//                                 <small className="text-muted d-block">{accessory.description}</small>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//          {activeTab === 6 && (
//   <>
//     <div className="user-details">
//       <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <div style={{ flex: '0 0 48%' }}>
//           <span className="details">Note</span>
//           <CInputGroup>
//             <CInputGroupText className="input-icon">
//               <CIcon icon={cilList} />
//             </CInputGroupText>
//             <CFormInput name="note" value={formData.note} onChange={handleChange} />
//           </CInputGroup>
//         </div>
        
//         {/* Total Deal Amount - Right side */}
//         <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
//   <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
//   <div style={{ 
//     display: 'inline-block',
//     backgroundColor: '#f8f9fa',
//     padding: '10px 15px',
//     borderRadius: '5px',
//     border: '1px solid #dee2e6',
//     minWidth: '200px',
//     textAlign: 'left'
//   }}>
//     {(() => {
//       const dealTotals = calculateTotalDealAmount();
//       const hasDiscount = parseFloat(dealTotals.totalDiscount) > 0;
      
//       if (hasDiscount) {
//         return (
//           <>
//             {/* Before discount total */}
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '3px',
//               textDecoration: 'line-through',
//               color: '#6c757d',
//               fontSize: '12px'
//             }}>
//               <small>Before Discount:</small>
//               <span>₹{parseFloat(dealTotals.totalBeforeDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//             </div>
            
//             {/* Discount */}
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '3px',
//               color: '#dc3545',
//               fontSize: '12px'
//             }}>
//               <small>Discount:</small>
//               <span>- ₹{parseFloat(dealTotals.totalDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//             </div>
            
//             {/* Separator */}
//             <div style={{ 
//               width: '100%', 
//               height: '1px', 
//               backgroundColor: '#ccc', 
//               margin: '3px 0',
//               borderTop: '1px dashed #999'
//             }}></div>
            
//             {/* Final Amount */}
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginTop: '3px',
//               fontWeight: 'bold'
//             }}>
//               <span>Total:</span>
//               <span style={{ color: '#198754', fontSize: '16px' }}>₹{parseFloat(dealTotals.totalAfterDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//             </div>
//           </>
//         );
//       } else {
//         // No discount - just show total
//         return (
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             fontWeight: 'bold'
//           }}>
//             <span>Total:</span>
//             <span style={{ color: '#198754', fontSize: '16px' }}>₹{parseFloat(dealTotals.totalAfterDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//           </div>
//         );
//       }
//     })()}
//   </div>
// </div>
//       </div>
//     </div>
    
//     {getCheckedHeadersForTab6().length > 0 && (
//       <div className="model-headers-section" style={{ marginTop: '20px' }}>
//         <h5>Model Options ({getCheckedHeadersForTab6().length} selected)</h5>
//         <div className="table-responsive">
//           <CTable striped hover responsive>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>Particulars</CTableHeaderCell>
//                 <CTableHeaderCell>HSN</CTableHeaderCell>
//                 <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                 <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                 <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                 <CTableHeaderCell>CGST %</CTableHeaderCell>
//                 <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                 <CTableHeaderCell>SGST %</CTableHeaderCell>
//                 <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                 <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {getCheckedHeadersForTab6().map((price) => {
//                 const header = price.header;
//                 const isMandatory = header.is_mandatory;
//                 const isDiscountAllowed = header.is_discount;
                
//                 // Header is definitely checked (that's why it's in getCheckedHeadersForTab6)
//                 const isChecked = true;

//                 const discountValue = headerDiscounts[header._id] !== undefined ? headerDiscounts[header._id] : '';
//                 const unitPrice = price.value || 0;
//                 const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                
//                 const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                 const hsnCode = header.metadata?.hsn_code || 'N/A';
                
//                 const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                
//                 const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                
//                 const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);

//                 return (
//                   <CTableRow key={header._id}>
//                     <CTableDataCell>
//                       <div style={{ display: 'flex', alignItems: 'center' }}>
//                         <CFormCheck
//                           id={`tab6-header-${header._id}`}
//                           checked={isChecked}
//                           onChange={(e) => {
//                             if (!isMandatory) {
//                               const isNowChecked = e.target.checked;
//                               setFormData(prev => {
//                                 if (isNowChecked) {
//                                   // Add back to optionalComponents
//                                   return {
//                                     ...prev,
//                                     optionalComponents: [...prev.optionalComponents, header._id]
//                                   };
//                                 } else {
//                                   // Remove from optionalComponents
//                                   return {
//                                     ...prev,
//                                     optionalComponents: prev.optionalComponents.filter((id) => id !== header._id)
//                                   };
//                                 }
//                               });
//                             }
//                           }}
//                           disabled={isMandatory}
//                           style={{ marginRight: '10px' }}
//                         />
//                         <span>
//                           {header.header_key} {isMandatory ? '(Mandatory)' : ''}
//                         </span>
//                       </div>
//                     </CTableDataCell>
//                     <CTableDataCell>{hsnCode}</CTableDataCell>
//                     <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
//                     <CTableDataCell>
//                       <CFormInput
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         placeholder="Enter discount"
//                         value={discountValue}
//                         onChange={(e) => handleHeaderDiscountChange(header._id, e.target.value)}
//                         disabled={!isDiscountAllowed}
//                         style={{ width: '150px' }}
//                       />
//                       {errors[`discount_${header._id}`] && (
//                         <small className="text-danger d-block">{errors[`discount_${header._id}`]}</small>
//                       )}
//                     </CTableDataCell>
//                     <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                     <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                     <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                     <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                     <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                     <CTableDataCell>
//                       <strong>₹{lineTotal.toFixed(2)}</strong>
//                     </CTableDataCell>
//                   </CTableRow>
//                 );
//               })}
//             </CTableBody>
//           </CTable>
//         </div>
//       </div>
//     )}

//     <div className="form-footer">
//       <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//         Back
//       </button>
//       <button type="submit" className="submit-button" disabled={isSubmitting}>
//         {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//       </button>
//     </div>
//   </>
// )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking; 








// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: '',
//     uncheckedHeaders: [],
//     uncheckedAccessories: []
//   });
  
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [userVerticleIds, setUserVerticleIds] = useState([]);
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
//   const [isSubdealerUser, setIsSubdealerUser] = useState(false);
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Function to filter headers based on HPA status
//   const filterHeadersByHPAStatus = (headers, hpaEnabled) => {
//     if (hpaEnabled) {
//       return headers; // Show all headers when HPA is enabled
//     } else {
//       // Filter out headers starting with 'HP' or 'HPA' when HPA is disabled
//       return headers.filter(price => {
//         const headerKey = price.header?.header_key || '';
//         const lowerHeaderKey = headerKey.toLowerCase();
        
//         // Exclude headers related to HPA
//         return !(
//           lowerHeaderKey.startsWith('hp') ||
//           lowerHeaderKey.startsWith('hpa') ||
//           lowerHeaderKey.includes('hypothecation') ||
//           lowerHeaderKey.includes('loan')
//         );
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
    
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;
//       const verticlesData = userData?.verticles || [];
//       const userSubdealer = userData?.subdealer;
      
//       const verticleIds = verticlesData.map(verticle => verticle._id);
//       setUserVerticleIds(verticleIds);
      
//       const userIsSubdealer = userData.roles?.some(role => 
//         role.name === 'SUBDEALER' || role.name === 'Subdealer'
//       );
//       setIsSubdealerUser(userIsSubdealer);
      
//       if (userIsSubdealer && userSubdealer && userSubdealer._id) {
//         setFormData(prev => ({
//           ...prev,
//           subdealer: userSubdealer._id
//         }));
//         setSelectedSubdealerName(userSubdealer.name || '');
        
//         fetchModels(formData.customer_type || 'B2C', userSubdealer._id);
//       }
      
//       await fetchAllVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

// const fetchBookingDetails = async (bookingId) => {
//   try {
//     const response = await axiosInstance.get(`/bookings/${bookingId}`);
//     const bookingData = response.data.data;

//     console.log('=== EDIT MODE: Fetching Booking Details ===');

//     const priceComponents = bookingData.priceComponents || [];
//     setBookingPriceComponents(priceComponents);

//     // Get booked header IDs from API
//     const bookedHeaderIds = priceComponents
//       .filter(pc => pc.header && pc.header._id)
//       .map(pc => pc.header._id);

//     console.log('Booked headers from API:', bookedHeaderIds);

//     // Calculate initial discounts
//     const initialDiscounts = {};
//     priceComponents.forEach(priceComponent => {
//       if (priceComponent.header && priceComponent.header._id) {
//         const discountAmount = priceComponent.discountAmount || 0;
//         initialDiscounts[priceComponent.header._id] = discountAmount;
//       }
//     });
    
//     console.log('Initial discounts from booking API:', initialDiscounts);
//     setHeaderDiscounts(initialDiscounts);

//     await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

//     const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//       ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//       : '';

//     // Set form data - set optionalComponents to bookedHeaderIds
//     const formDataToSet = {
//       verticle_id: bookingVerticle,
//       model_id: bookingData.model?.id || '',
//       model_color: bookingData.color?.id || '',
//       customer_type: bookingData.customerType || 'B2C',
//       rto_type: bookingData.rto || 'MH',
//       subdealer: bookingData.subdealer?._id || '',
//       optionalComponents: bookedHeaderIds, // CRITICAL: Set from API
//       sales_executive: bookingData.salesExecutive?._id || '',
//       gstin: bookingData.gstin || '',
//       rtoAmount: bookingData.rtoAmount || '',
//       salutation: bookingData.customerDetails?.salutation || '',
//       name: bookingData.customerDetails?.name || '',
//       pan_no: bookingData.customerDetails?.panNo || '',
//       dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//       occupation: bookingData.customerDetails?.occupation || '',
//       address: bookingData.customerDetails?.address || '',
//       taluka: bookingData.customerDetails?.taluka || '',
//       district: bookingData.customerDetails?.district || '',
//       pincode: bookingData.customerDetails?.pincode || '',
//       mobile1: bookingData.customerDetails?.mobile1 || '',
//       mobile2: bookingData.customerDetails?.mobile2 || '',
//       aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//       nomineeName: bookingData.customerDetails?.nomineeName || '',
//       nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//       nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//       type: bookingData.payment?.type?.toLowerCase() || 'cash',
//       financer_id: bookingData.payment?.financer?._id || '',
//       value: bookingData.discounts[0]?.amount || 0,
//       selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//       hpa: bookingData.hpa || false,
//       note: bookingData.note || '',
//       uncheckedHeaders: [], // We'll calculate this below
//       uncheckedAccessories: []
//     };

//     console.log('Form data set with optionalComponents:', bookedHeaderIds);
//     setFormData(formDataToSet);

//     setSelectedSubdealerName(bookingData.subdealer?.name || '');
//     setModelDetails(bookingData.model || null);
//     setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//     if (bookingData.model) {
//       setModelType(bookingData.model.type);
//       setSelectedModelName(bookingData.model.model_name);
//     }

//     if (bookingData.model?.id) {
//       console.log('Model found, fetching model details...');
      
//       // After model loads, we'll update uncheckedHeaders
//       setTimeout(() => {
//         const selectedModel = models.find((model) => model._id === bookingData.model.id);
//         if (selectedModel && selectedModel.modelPrices) {
//           // Get all header IDs from model
//           const allHeaders = selectedModel.modelPrices
//             .filter(price => price.header && price.header._id)
//             .map(price => price.header._id);
          
//           // Calculate unchecked headers: headers in model but NOT in optionalComponents AND not mandatory
//           const uncheckedHeaders = [];
//           selectedModel.modelPrices.forEach(price => {
//             if (price.header && price.header._id) {
//               const headerId = price.header._id;
//               const isMandatory = price.header.is_mandatory || false;
//               const isInOptionalComponents = bookedHeaderIds.includes(headerId);
              
//               if (!isMandatory && !isInOptionalComponents) {
//                 uncheckedHeaders.push(headerId);
//               }
//             }
//           });
          
//           console.log('Calculated uncheckedHeaders:', uncheckedHeaders);
          
//           // Update form data
//           setFormData(prev => ({
//             ...prev,
//             uncheckedHeaders: uncheckedHeaders
//           }));
//         }
//       }, 1000);
      
//       fetchAccessories(bookingData.model.id);
//       fetchModelColors(bookingData.model.id);
//     }
//   } catch (error) {
//     console.error('Error fetching booking details:', error);
//     showFormSubmitError('Failed to load booking details');
//   }
// };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);

//   const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
//     try {
//       console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
      
//       // For edit mode, don't override existing values
//       if (!isEditMode) {
//         const allHeaders = prices
//           .filter(price => price.header && price.header._id)
//           .map(price => price.header._id);
        
//         setFormData(prev => ({
//           ...prev,
//           optionalComponents: allHeaders,
//           uncheckedHeaders: []
//         }));
//       }

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       console.log('Model prices structure:', prices);

//       const mergedDiscounts = {};
      
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           if (existingDiscounts[headerId] !== undefined) {
//             mergedDiscounts[headerId] = existingDiscounts[headerId];
//           } else {
//             mergedDiscounts[headerId] = '';
//           }
//         }
//       });
      
//       console.log('Merged discounts after fetching model headers:', mergedDiscounts);
//       setHeaderDiscounts(mergedDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
      
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id'];
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
    
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
    
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       if (formData.verticle_id) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
//         );
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     const allHeaders = selectedModel?.modelPrices || [];
    
//     // Apply HPA filter
//     return filterHeadersByHPAStatus(allHeaders, formData.hpa);
//   };

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       const selectedModel = models.find((model) => model._id === modelId);
      
//       // Get ALL headers from the model
//       const allHeaders = prices
//         .filter(price => price.header && price.header._id)
//         .map(price => price.header._id);
      
//       // For new booking: check ALL headers by default
//       if (!isEditMode) {
//         setFormData((prev) => ({
//           ...prev,
//           optionalComponents: allHeaders, // Initialize with ALL headers
//           uncheckedHeaders: [] // Empty = all are checked
//         }));
//       }

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           // Initialize all discounts as empty
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type;
//       const modelName = modelData.model_name;
      
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       const filteredAccessories = allAccessories.filter(accessory => {
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false;
//         }
        
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
      
//       const accessoryIds = filteredAccessories.map(accessory => accessory._id);
      
//       // For new booking: check ALL accessories by default
//       if (!isEditMode) {
//         setFormData(prev => ({
//           ...prev,
//           selected_accessories: accessoryIds,
//           uncheckedAccessories: [] // Empty = all are checked
//         }));
//       }
      
//       setAccessories(filteredAccessories);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, []);

//  const handleChange = (e) => {
//   const { name, value } = e.target;
  
//   if (name === 'hpa') {
//     const booleanValue = value === 'true';
//     setFormData((prevData) => ({ 
//       ...prevData, 
//       [name]: booleanValue 
//     }));
    
//     // When HPA changes, also update optionalComponents
//     if (name === 'hpa') {
//       if (!booleanValue) {
//         // If HPA is disabled, remove HP/HPA headers
//         const hpHeaders = getSelectedModelHeaders()
//           .filter(price => price.header && price.header._id)
//           .filter(price => {
//             const headerKey = price.header.header_key || '';
//             return headerKey.startsWith('HP') || headerKey.startsWith('HPA');
//           })
//           .map(price => price.header._id);
        
//         setFormData(prev => ({
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter(id => !hpHeaders.includes(id))
//         }));
//       }
//     }
//   } else {
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   }
  
//   setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//   if (name === 'customer_type') {
//     fetchModels(value, formData.subdealer);
//     setFormData((prev) => ({
//       ...prev,
//       verticle_id: '',
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: []
//     }));
//   } else if (name === 'verticle_id') {
//     setFormData((prev) => ({
//       ...prev,
//       verticle_id: value,
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: []
//     }));

//     if (value) {
//       const filtered = models.filter(model => 
//         model.verticle_id === value || model.verticle === value
//       );
//       setFilteredModels(filtered);
//     } else {
//       setFilteredModels(models);
//     }
//   } else if (name === 'subdealer') {
//     const selectedSubdealer = subdealers.find((b) => b._id === value);
//     setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//     fetchModels(formData.customer_type, value);
//     setFormData((prev) => ({
//       ...prev,
//       verticle_id: '',
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: []
//     }));
//   } else if (name === 'model_id') {
//     const selectedModel = models.find((model) => model._id === value);
//     if (selectedModel) {
//       setFormData((prev) => ({
//         ...prev,
//         model_name: selectedModel.model_name,
//         model_id: value,
//         optionalComponents: [],
//         selected_accessories: [],
//         uncheckedHeaders: [], // Reset unchecked headers when model changes
//         uncheckedAccessories: []
//       }));
      
//       setModelType(selectedModel.type);
//       setSelectedModelName(selectedModel.model_name);
      
//       fetchAccessories(value);
//       fetchModelColors(value);
//       if (isEditMode) {
//         fetchModelHeadersForEdit(value, headerDiscounts);
//       } else {
//         fetchModelHeaders(value);
//       }
//     }
//   }
// };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           optionalComponents: [...prev.optionalComponents, headerId],
//           uncheckedHeaders: prev.uncheckedHeaders?.filter(id => id !== headerId) || []
//         };
//       } else {
//         return {
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId),
//           uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId]
//         };
//       }
//     });
//   };

//   const handleHeaderDiscountChange = (headerId, value) => {
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId],
//           uncheckedAccessories: prev.uncheckedAccessories?.filter(id => id !== accessoryId) || []
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId),
//           uncheckedAccessories: [...(prev.uncheckedAccessories || []), accessoryId]
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   const getAccessoryPriceForHeader = (headerKey) => {
//     // Find accessories with matching header key
//     const matchingAccessories = accessories.filter(accessory => 
//       accessory.categoryDetails?.header_key === headerKey
//     );
    
//     if (matchingAccessories.length === 0) return 0;
    
//     // Get the highest price among matching accessories
//     return Math.max(...matchingAccessories.map(acc => acc.price || 0));
//   };

//   const getCheckedHeadersForTab6 = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     if (!selectedModel) return [];
    
//     const modelPrices = selectedModel.modelPrices || [];
    
//     // First apply HPA filter
//     const filteredByHPA = filterHeadersByHPAStatus(modelPrices, formData.hpa);
    
//     // Then filter to show only headers that should be displayed
//     return filteredByHPA.filter((price) => {
//       if (!price.header || !price.header._id) return false;
      
//       const header = price.header;
//       const headerId = header._id;
//       const isMandatory = header.is_mandatory;
      
//       if (isEditMode) {
//         // In edit mode: show headers that are in optionalComponents (were selected in original booking)
//         // AND not explicitly unchecked by the user
//         const isInOptionalComponents = formData.optionalComponents.includes(headerId);
//         const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//           formData.uncheckedHeaders.includes(headerId);
        
//         return isMandatory || (isInOptionalComponents && !isExplicitlyUnchecked);
//       } else {
//         // In new booking mode: show headers that are not explicitly unchecked
//         const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//           formData.uncheckedHeaders.includes(headerId);
//         return isMandatory || !isExplicitlyUnchecked;
//       }
//     });
//   };

//   const calculateTotalDealAmount = () => {
//     // Get headers that are currently checked (same logic as Tab 6)
//     const selectedHeaders = getCheckedHeadersForTab6()
//       .filter((price) => {
//         const header = price.header;
        
//         // Exclude summary/total headers
//         const excludedHeaders = [
//           'ON ROAD PRICE (A)',
//           'TOTAL ONROAD+ADDON SERVICES',
//           'TOTAL ONROAD + ADDON SERVICES',
//           'ADDON SERVICES TOTAL (B)',
//           'ACCESSORIES TOTAL',
//           'ON ROAD PRICE',
//           'ADDON SERVICES TOTAL',
//           'ADD ON SERVICES TOTAL',
//           'TOTAL AMOUNT',
//           'GRAND TOTAL',
//           'FINAL AMOUNT',
//           'TOTAL',
//           'ON-ROAD PRICE',
//           'FINAL PRICE',
//           'COMPLETE PRICE'
//         ];
        
//         const headerKey = header.header_key || '';
//         return !excludedHeaders.includes(headerKey);
//       });

//     let totalBeforeDiscount = 0;
//     let totalDiscount = 0;
    
//     // Calculate ORIGINAL total (without any discounts)
//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const headerKey = header.header_key;
//       const headerPrice = price.value || 0;
      
//       // Get accessory price for this header (if any)
//       const accessoryPrice = getAccessoryPriceForHeader(headerKey);
      
//       // Use whichever is higher: header price or accessory price
//       const unitPrice = Math.max(headerPrice, accessoryPrice);
      
//       const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
      
//       // Calculate original line total WITHOUT discount
//       const taxable = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
//       const { cgstAmount, sgstAmount } = calculateGST(taxable, gstRate, formData.customer_type);
//       const originalLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       console.log(`Header "${headerKey}": Header Price=${headerPrice}, Accessory Price=${accessoryPrice}, Final Price=${unitPrice}`);
      
//       totalBeforeDiscount += originalLineTotal;
//     });
    
//     // Calculate total discounts from headerDiscounts ONLY
//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const headerId = header._id;
//       const discountValue = headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : 0;
//       const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
//       if (discountAmount > 0) {
//         console.log(`Discount for ${header.header_key}: ₹${discountAmount}`);
//         totalDiscount += discountAmount;
//       }
//     });

//     const totalAllDiscounts = totalDiscount;
//     const finalTotal = totalBeforeDiscount - totalAllDiscounts;

//     console.log('Total calculation:', {
//       totalBeforeDiscount,
//       totalDiscount,
//       finalTotal
//     });

//     return {
//       totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
//       totalAfterDiscount: finalTotal.toFixed(2),
//       totalDiscount: totalAllDiscounts.toFixed(2),
//       hasDiscount: totalAllDiscounts > 0
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = [
//       'verticle_id',
//       'model_id',
//       'model_color',
//       'customer_type',
//       'name',
//       'address',
//       'mobile1',
//       'aadhar_number',
//       'pan_no'
//     ];
    
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle selection is required';
//     }

//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       formErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     console.log('=== SUBMITTING BOOKING ===');
//     console.log('Current formData.optionalComponents:', formData.optionalComponents);
//     console.log('Current formData.uncheckedHeaders:', formData.uncheckedHeaders);
//     console.log('Current headerDiscounts:', headerDiscounts);

//     // For new bookings: include all headers except explicitly unchecked ones
//     // For edit mode: use the existing optionalComponents
//     let headersToSubmit = [];
//     if (isEditMode) {
//       headersToSubmit = formData.optionalComponents;
//     } else {
//       // Get all headers and exclude the explicitly unchecked ones
//       const allHeaders = getSelectedModelHeaders()
//         .filter(price => price.header && price.header._id)
//         .map(price => price.header._id);
      
//       headersToSubmit = allHeaders.filter(headerId => 
//         !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
//       );
//     }

//     console.log('Headers to submit:', headersToSubmit);

//     // Process header discounts - only include for headers that are actually selected
//     const headerDiscountsArray = Object.entries(headerDiscounts)
//       .filter(([headerId, value]) => {
//         const isSelected = headersToSubmit.includes(headerId);
//         const hasDiscount = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
//         console.log(`Header ${headerId}: isSelected=${isSelected}, hasDiscount=${hasDiscount}, value=${value}`);
//         return isSelected && hasDiscount;
//       })
//       .map(([headerId, value]) => ({
//         headerId,
//         discountAmount: parseFloat(value) || 0
//       }));

//     console.log('Header discounts to submit:', headerDiscountsArray);

//     // Process accessories - similar logic for accessories
//     let accessoriesToSubmit = [];
//     if (isEditMode) {
//       accessoriesToSubmit = formData.selected_accessories;
//     } else {
//       const allAccessoryIds = accessories.map(accessory => accessory._id);
//       accessoriesToSubmit = allAccessoryIds.filter(accessoryId => 
//         !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
//       );
//     }

//     const accessoriesArray = accessoriesToSubmit.map((id) => ({ id }));
//     console.log('Accessories to submit:', accessoriesArray);

//     // Prepare request body
//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       subdealer: formData.subdealer,
//       verticles: formData.verticle_id ? [formData.verticle_id] : [],
//       optionalComponents: headersToSubmit, // This is the key - only checked headers
//       sales_executive: formData.sales_executive,
//       customer_details: {
//         salutation: formData.salutation,
//         name: formData.name,
//         pan_no: formData.pan_no,
//         dob: formData.dob,
//         occupation: formData.occupation,
//         address: formData.address,
//         taluka: formData.taluka,
//         district: formData.district,
//         pincode: formData.pincode,
//         mobile1: formData.mobile1,
//         mobile2: formData.mobile2,
//         aadhar_number: formData.aadhar_number,
//         nomineeName: formData.nomineeName,
//         nomineeRelation: formData.nomineeRelation,
//         nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//       },
//       payment: {
//         type: formData.type.toUpperCase(),
//         ...(formData.type.toLowerCase() === 'finance' && {
//           financer_id: formData.financer_id
//         })
//       },
//       headerDiscounts: headerDiscountsArray,
//       discount: {
//         type: formData.discountType,
//         value: formData.value ? parseFloat(formData.value) : 0
//       },
//       accessories: {
//         selected: accessoriesArray
//       },
//       hpa: formData.hpa === true,
//       note: formData.note || ''
//     };

//     // Add conditional fields
//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rtoAmount = formData.rtoAmount;
//     }

//     console.log('=== FINAL REQUEST BODY ===');
//     console.log('optionalComponents being sent:', requestBody.optionalComponents);
//     console.log('Number of optionalComponents:', requestBody.optionalComponents.length);
//     console.log('Full request body:', JSON.stringify(requestBody, null, 2));

//     try {
//       let response;
//       if (isEditMode) {
//         console.log(`Updating booking with ID: ${id}`);
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         console.log('Creating new booking');
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       console.log('API Response:', response.data);

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         console.log('Success:', successMessage);
//         await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//         navigate('/subdealer-all-bookings');
//       } else {
//         console.error('Submission failed:', response.data);
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       console.error('Error response:', error.response?.data);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const dealTotals = calculateTotalDealAmount();

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       {isSubdealerUser && formData.subdealer ? (
//                         <CFormInput 
//                           type="text" 
//                           value={selectedSubdealerName}
//                           readOnly
//                           disabled
//                         />
//                       ) : (
//                         <CFormSelect 
//                           name="subdealer" 
//                           value={formData.subdealer} 
//                           onChange={handleChange}
//                           disabled={isEditMode}
//                         >
//                           <option value="">-Select-</option>
//                           {subdealers.map((subdealer) => (
//                             <option key={subdealer._id} value={subdealer._id}>
//                               {subdealer.name}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       )}
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {isSubdealerUser && formData.subdealer && (
//                       <small className="text-muted">
//                         Subdealer auto-selected based on your account
//                       </small>
//                     )}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={!formData.subdealer || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>
//                       Model Options 
//                       {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
//                         (HPA-related options hidden as HPA is disabled)
//                       </span>}
//                     </h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const headerId = header._id;
//                           const headerKey = header.header_key || '';
                          
//                           // Check if this is an HPA-related header
//                           const isHPAHeader = headerKey.startsWith('HP') || 
//                                               headerKey.startsWith('HPA') ||
//                                               headerKey.toLowerCase().includes('hypothecation') ||
//                                               headerKey.toLowerCase().includes('loan');
                          
//                           // Determine if header should be shown based on HPA status
//                           const shouldShowHeader = formData.hpa || !isHPAHeader;
                          
//                           if (!shouldShowHeader) {
//                             return null; // Skip rendering this header
//                           }
                          
//                           let isChecked;
//                           if (isEditMode) {
//                             // In edit mode: checked if it was in the original booking AND not explicitly unchecked
//                             const isInOptionalComponents = formData.optionalComponents.includes(headerId);
//                             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                               formData.uncheckedHeaders.includes(headerId);
//                             isChecked = isMandatory || (isInOptionalComponents && !isExplicitlyUnchecked);
//                           } else {
//                             // In new booking mode: checked if not explicitly unchecked
//                             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                               formData.uncheckedHeaders.includes(headerId);
//                             isChecked = isMandatory || !isExplicitlyUnchecked;
//                           }

//                           return (
//                             <div key={headerId} className="header-item">
//                               <CFormCheck
//                                 id={`header-${headerId}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : '(Optional)'} ${isHPAHeader ? '(HPA-related)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => {
//                                   if (!isMandatory) {
//                                     const isNowChecked = e.target.checked;
//                                     handleHeaderSelection(headerId, isNowChecked);
                                    
//                                     // Also update headerDiscounts
//                                     if (!isNowChecked) {
//                                       // Remove discount when unchecking
//                                       setHeaderDiscounts(prev => {
//                                         const updated = { ...prev };
//                                         delete updated[headerId];
//                                         return updated;
//                                       });
//                                     }
//                                   }
//                                 }}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${headerId}`} value={headerId} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0 || isEditMode}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => {
//                           // For new bookings: all accessories are checked by default
//                           // For edit mode: use the existing selections
//                           let isChecked;
//                           if (isEditMode) {
//                             isChecked = formData.selected_accessories.includes(accessory._id);
//                           } else {
//                             const isExplicitlyUnchecked = formData.uncheckedAccessories && 
//                               formData.uncheckedAccessories.includes(accessory._id);
//                             isChecked = !isExplicitlyUnchecked; // Default checked
//                           }

//                           return (
//                             <div key={accessory._id} className="accessory-item">
//                               <CFormCheck
//                                 id={`accessory-${accessory._id}`}
//                                 label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                                 checked={isChecked}
//                                 onChange={(e) => {
//                                   const isNowChecked = e.target.checked;
//                                   handleAccessorySelection(accessory._id, isNowChecked);
//                                 }}
//                               />
//                               {accessory.description && (
//                                 <small className="text-muted d-block">{accessory.description}</small>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 6 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <div style={{ flex: '0 0 48%' }}>
//                       <span className="details">Note</span>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilList} />
//                         </CInputGroupText>
//                         <CFormInput name="note" value={formData.note} onChange={handleChange} />
//                       </CInputGroup>
//                     </div>
                    
//                     <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
//                       <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
//                       <div style={{ 
//                         display: 'inline-block',
//                         backgroundColor: '#f8f9fa',
//                         padding: '10px 15px',
//                         borderRadius: '5px',
//                         border: '1px solid #dee2e6',
//                         minWidth: '200px',
//                         textAlign: 'left'
//                       }}>
//                         {(() => {
//                           const totals = calculateTotalDealAmount();
//                           const totalBeforeDiscount = parseFloat(totals.totalBeforeDiscount);
//                           const totalAfterDiscount = parseFloat(totals.totalAfterDiscount);
//                           const totalDiscount = parseFloat(totals.totalDiscount);
//                           const hasDiscount = totals.hasDiscount;
                          
//                           return (
//                             <>
//                               {/* Original Total - Always shown */}
//                               <div style={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 marginBottom: '3px'
//                               }}>
//                                 <small>Original Total:</small>
//                                 <span>₹{totalBeforeDiscount.toLocaleString('en-IN')}</span>
//                               </div>
                              
//                               {/* Show discount only if there is one */}
//                               {hasDiscount && (
//                                 <>
//                                   {/* Discount amount */}
//                                   <div style={{ 
//                                     display: 'flex', 
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center',
//                                     marginBottom: '3px',
//                                     color: '#dc3545',
//                                     fontSize: '12px'
//                                   }}>
//                                     <small>Discount:</small>
//                                     <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
//                                   </div>
                                  
//                                   {/* Separator */}
//                                   <div style={{ 
//                                     width: '100%', 
//                                     height: '1px', 
//                                     backgroundColor: '#ccc', 
//                                     margin: '3px 0',
//                                     borderTop: '1px dashed #999'
//                                   }}></div>
//                                 </>
//                               )}
                              
//                               {/* Final Amount - Big and bold */}
//                               <div style={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 marginTop: '3px',
//                                 fontWeight: 'bold'
//                               }}>
//                                 <span>{hasDiscount ? 'Final Amount:' : 'Total:'}</span>
//                                 <span style={{ 
//                                   color: hasDiscount ? '#198754' : '#198754', 
//                                   fontSize: '16px' 
//                                 }}>
//                                   ₹{totalAfterDiscount.toLocaleString('en-IN')}
//                                 </span>
//                               </div>
//                             </>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {getCheckedHeadersForTab6().length > 0 && (
//                   <div className="model-headers-section" style={{ marginTop: '20px' }}>
//                     <h5>
//                       Model Options ({getCheckedHeadersForTab6().length} selected)
//                       {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
//                         (HPA-related options hidden as HPA is disabled)
//                       </span>}
//                     </h5>
                    
//                     <div className="table-responsive">
//                       <CTable striped hover responsive>
//                         <CTableHead>
//                           <CTableRow>
//                             <CTableHeaderCell>Particulars</CTableHeaderCell>
//                             <CTableHeaderCell>HSN</CTableHeaderCell>
//                             <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>CGST %</CTableHeaderCell>
//                             <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>SGST %</CTableHeaderCell>
//                             <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                           {getCheckedHeadersForTab6().map((price) => {
//                             const header = price.header;
//                             const isMandatory = header.is_mandatory;
//                             const isDiscountAllowed = header.is_discount;
                            
//                             const headerId = header._id || header.id;
//                             const headerKey = header.header_key || '';
                            
//                             // Check if this is an HPA-related header
//                             const isHPAHeader = headerKey.startsWith('HP') || 
//                                                 headerKey.startsWith('HPA') ||
//                                                 headerKey.toLowerCase().includes('hypothecation') ||
//                                                 headerKey.toLowerCase().includes('loan');
                            
//                             // Determine if header should be shown based on HPA status
//                             const shouldShowHeader = formData.hpa || !isHPAHeader;
                            
//                             if (!shouldShowHeader) {
//                               return null; // Skip rendering this header
//                             }
                            
//                             // Check if this header is currently checked
//                             // Use the same logic as in getCheckedHeadersForTab6()
//                             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                               formData.uncheckedHeaders.includes(headerId);
//                             const isChecked = isMandatory || !isExplicitlyUnchecked;

//                             const discountValue = headerDiscounts[headerId] !== undefined 
//                               ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
//                               : '';
                            
//                             const headerPrice = price.value || 0;
                            
//                             // Get accessory price for this header (if any)
//                             const accessoryPrice = getAccessoryPriceForHeader(headerKey);
                            
//                             // Use whichever is higher: header price or accessory price
//                             const unitPrice = Math.max(headerPrice, accessoryPrice);
                            
//                             const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                            
//                             const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                             const hsnCode = header.metadata?.hsn_code || 'N/A';
                            
//                             const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                            
//                             const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                            
//                             const lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);

//                             return (
//                               <CTableRow key={headerId}>
//                                 <CTableDataCell>
//                                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <CFormCheck
//                                       id={`tab6-header-${headerId}`}
//                                       checked={isChecked}
//                                       onChange={(e) => {
//                                         if (!isMandatory) {
//                                           const isNowChecked = e.target.checked;
//                                           handleHeaderSelection(headerId, isNowChecked);
                                          
//                                           // Also update headerDiscounts
//                                           if (!isNowChecked) {
//                                             // Remove discount when unchecking
//                                             setHeaderDiscounts(prev => {
//                                               const updated = { ...prev };
//                                               delete updated[headerId];
//                                               return updated;
//                                             });
//                                           } else {
//                                             // Initialize discount when checking
//                                             setHeaderDiscounts(prev => {
//                                               if (prev[headerId] === undefined) {
//                                                 return { ...prev, [headerId]: '' };
//                                               }
//                                               return prev;
//                                             });
//                                           }
//                                         }
//                                       }}
//                                       disabled={isMandatory}
//                                       style={{ marginRight: '10px' }}
//                                     />
//                                     <span>
//                                       {header.header_key} {isMandatory ? '(Mandatory)' : '(Optional)'}
//                                       {isHPAHeader && ' (HPA-related)'}
//                                       {accessoryPrice > headerPrice && (
//                                         <small className="text-muted d-block">
//                                           (Using accessory price: ₹{accessoryPrice})
//                                         </small>
//                                       )}
//                                     </span>
//                                   </div>
//                                 </CTableDataCell>
//                                 <CTableDataCell>{hsnCode}</CTableDataCell>
//                                 <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>
//                                   <CFormInput
//                                     type="number"
//                                     min="0"
//                                     step="0.01"
//                                     placeholder="Enter discount"
//                                     value={discountValue}
//                                     onChange={(e) => handleHeaderDiscountChange(headerId, e.target.value)}
//                                     disabled={!isDiscountAllowed}
//                                     style={{ width: '150px' }}
//                                   />
//                                   {errors[`discount_${headerId}`] && (
//                                     <small className="text-danger d-block">{errors[`discount_${headerId}`]}</small>
//                                   )}
//                                 </CTableDataCell>
//                                 <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                                 <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                                 <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>
//                                   <strong>₹{lineTotal.toFixed(2)}</strong>
//                                 </CTableDataCell>
//                               </CTableRow>
//                             );
//                           })}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//                     Back
//                   </button>
//                   <button type="submit" className="submit-button" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking;









// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerNewBooking() {
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     subdealer: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rtoAmount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     discountType: 'fixed',
//     value: 0,
//     selected_accessories: [],
//     hpa: true,
//     is_exchange: false,
//     broker_id: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: '',
//     uncheckedHeaders: [],
//     uncheckedAccessories: [],
//     subsidy_amount: '' // Added subsidy amount field
//   });
  
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [userVerticleIds, setUserVerticleIds] = useState([]);
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
//   const [isSubdealerUser, setIsSubdealerUser] = useState(false);
//   const [isEVModel, setIsEVModel] = useState(false); // Added state for EV model check
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Function to filter headers based on HPA status
//   const filterHeadersByHPAStatus = (headers, hpaEnabled) => {
//     if (hpaEnabled) {
//       return headers; // Show all headers when HPA is enabled
//     } else {
//       // Filter out headers starting with 'HP' or 'HPA' when HPA is disabled
//       return headers.filter(price => {
//         const headerKey = price.header?.header_key || '';
//         const lowerHeaderKey = headerKey.toLowerCase();
        
//         // Exclude headers related to HPA
//         return !(
//           lowerHeaderKey.startsWith('hp') ||
//           lowerHeaderKey.startsWith('hpa') ||
//           lowerHeaderKey.includes('hypothecation') ||
//           lowerHeaderKey.includes('loan')
//         );
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
    
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;
//       const verticlesData = userData?.verticles || [];
//       const userSubdealer = userData?.subdealer;
      
//       const verticleIds = verticlesData.map(verticle => verticle._id);
//       setUserVerticleIds(verticleIds);
      
//       const userIsSubdealer = userData.roles?.some(role => 
//         role.name === 'SUBDEALER' || role.name === 'Subdealer'
//       );
//       setIsSubdealerUser(userIsSubdealer);
      
//       if (userIsSubdealer && userSubdealer && userSubdealer._id) {
//         setFormData(prev => ({
//           ...prev,
//           subdealer: userSubdealer._id
//         }));
//         setSelectedSubdealerName(userSubdealer.name || '');
        
//         fetchModels(formData.customer_type || 'B2C', userSubdealer._id);
//       }
      
//       await fetchAllVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error);
//       if (message) setError(message);
//     }
//   };

// const fetchBookingDetails = async (bookingId) => {
//   try {
//     const response = await axiosInstance.get(`/bookings/${bookingId}`);
//     const bookingData = response.data.data;

//     console.log('=== EDIT MODE: Fetching Booking Details ===');

//     const priceComponents = bookingData.priceComponents || [];
//     setBookingPriceComponents(priceComponents);

//     // Get booked header IDs from API
//     const bookedHeaderIds = priceComponents
//       .filter(pc => pc.header && pc.header._id)
//       .map(pc => pc.header._id);

//     console.log('Booked headers from API:', bookedHeaderIds);

//     // Calculate initial discounts
//     const initialDiscounts = {};
//     priceComponents.forEach(priceComponent => {
//       if (priceComponent.header && priceComponent.header._id) {
//         const discountAmount = priceComponent.discountAmount || 0;
//         initialDiscounts[priceComponent.header._id] = discountAmount;
//       }
//     });
    
//     console.log('Initial discounts from booking API:', initialDiscounts);
//     setHeaderDiscounts(initialDiscounts);

//     await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

//     const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//       ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//       : '';

//     // Check if model is EV
//     const isEV = bookingData.model?.type === 'EV';
//     setIsEVModel(isEV);

//     // Set form data - set optionalComponents to bookedHeaderIds
//     const formDataToSet = {
//       verticle_id: bookingVerticle,
//       model_id: bookingData.model?.id || '',
//       model_color: bookingData.color?.id || '',
//       customer_type: bookingData.customerType || 'B2C',
//       rto_type: bookingData.rto || 'MH',
//       subdealer: bookingData.subdealer?._id || '',
//       optionalComponents: bookedHeaderIds, // CRITICAL: Set from API
//       sales_executive: bookingData.salesExecutive?._id || '',
//       gstin: bookingData.gstin || '',
//       rtoAmount: bookingData.rtoAmount || '',
//       salutation: bookingData.customerDetails?.salutation || '',
//       name: bookingData.customerDetails?.name || '',
//       pan_no: bookingData.customerDetails?.panNo || '',
//       dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//       occupation: bookingData.customerDetails?.occupation || '',
//       address: bookingData.customerDetails?.address || '',
//       taluka: bookingData.customerDetails?.taluka || '',
//       district: bookingData.customerDetails?.district || '',
//       pincode: bookingData.customerDetails?.pincode || '',
//       mobile1: bookingData.customerDetails?.mobile1 || '',
//       mobile2: bookingData.customerDetails?.mobile2 || '',
//       aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//       nomineeName: bookingData.customerDetails?.nomineeName || '',
//       nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//       nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//       type: bookingData.payment?.type?.toLowerCase() || 'cash',
//       financer_id: bookingData.payment?.financer?._id || '',
//       value: bookingData.discounts[0]?.amount || 0,
//       selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//       hpa: bookingData.hpa || false,
//       note: bookingData.note || '',
//       uncheckedHeaders: [], // We'll calculate this below
//       uncheckedAccessories: [],
//       // Only set subsidy amount if it's an EV model
//       subsidy_amount: isEV ? (bookingData.subsidy_amount || '') : ''
//     };

//     console.log('Form data set with optionalComponents:', bookedHeaderIds);
//     setFormData(formDataToSet);

//     setSelectedSubdealerName(bookingData.subdealer?.name || '');
//     setModelDetails(bookingData.model || null);
//     setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//     if (bookingData.model) {
//       setModelType(bookingData.model.type);
//       setSelectedModelName(bookingData.model.model_name);
//     }

//     if (bookingData.model?.id) {
//       console.log('Model found, fetching model details...');
      
//       // After model loads, we'll update uncheckedHeaders
//       setTimeout(() => {
//         const selectedModel = models.find((model) => model._id === bookingData.model.id);
//         if (selectedModel && selectedModel.modelPrices) {
//           // Get all header IDs from model
//           const allHeaders = selectedModel.modelPrices
//             .filter(price => price.header && price.header._id)
//             .map(price => price.header._id);
          
//           // Calculate unchecked headers: headers in model but NOT in optionalComponents AND not mandatory
//           const uncheckedHeaders = [];
//           selectedModel.modelPrices.forEach(price => {
//             if (price.header && price.header._id) {
//               const headerId = price.header._id;
//               const isMandatory = price.header.is_mandatory || false;
//               const isInOptionalComponents = bookedHeaderIds.includes(headerId);
              
//               if (!isMandatory && !isInOptionalComponents) {
//                 uncheckedHeaders.push(headerId);
//               }
//             }
//           });
          
//           console.log('Calculated uncheckedHeaders:', uncheckedHeaders);
          
//           // Update form data
//           setFormData(prev => ({
//             ...prev,
//             uncheckedHeaders: uncheckedHeaders
//           }));
//         }
//       }, 1000);
      
//       fetchAccessories(bookingData.model.id);
//       fetchModelColors(bookingData.model.id);
//     }
//   } catch (error) {
//     console.error('Error fetching booking details:', error);
//     showFormSubmitError('Failed to load booking details');
//   }
// };

//   useEffect(() => {
//     if (isEditMode && formData.model_id && models.length > 0) {
//       const selectedModel = models.find((model) => model._id === formData.model_id);
//       if (selectedModel) {
//         fetchAccessories(formData.model_id);
//         fetchModelColors(formData.model_id);
//       }
//     }
//   }, [isEditMode, formData.model_id, models]);

//   const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
//     try {
//       console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       // Check if model is EV
//       const isEV = modelData.type === 'EV';
//       setIsEVModel(isEV);

//       // Set subsidy amount from model data only if it's EV
//       if (isEV && modelData.subsidy_amount) {
//         setFormData(prev => ({
//           ...prev,
//           subsidy_amount: modelData.subsidy_amount
//         }));
//       }

//       const selectedModel = models.find((model) => model._id === modelId);
      
//       // For edit mode, don't override existing values
//       if (!isEditMode) {
//         const allHeaders = prices
//           .filter(price => price.header && price.header._id)
//           .map(price => price.header._id);
        
//         setFormData(prev => ({
//           ...prev,
//           optionalComponents: allHeaders,
//           uncheckedHeaders: []
//         }));
//       }

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       console.log('Model prices structure:', prices);

//       const mergedDiscounts = {};
      
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           if (existingDiscounts[headerId] !== undefined) {
//             mergedDiscounts[headerId] = existingDiscounts[headerId];
//           } else {
//             mergedDiscounts[headerId] = '';
//           }
//         }
//       });
      
//       console.log('Merged discounts after fetching model headers:', mergedDiscounts);
//       setHeaderDiscounts(mergedDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
      
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//       setIsEVModel(false);
//     }
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id'];
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
    
//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       newErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
//       newErrors.rtoAmount = 'RTO amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };

//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }

//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
    
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     fetchModels('B2C');
//   }, []);

//   const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;
//       if (subdealerId) {
//         endpoint += `&subdealer_id=${subdealerId}`;
//       }

//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       if (formData.verticle_id) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
//         );
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSubdealers();
//   }, []);

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     const allHeaders = selectedModel?.modelPrices || [];
    
//     // Apply HPA filter
//     return filterHeadersByHPAStatus(allHeaders, formData.hpa);
//   };

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       // Check if model is EV
//       const isEV = modelData.type === 'EV';
//       setIsEVModel(isEV);

//       // Set subsidy amount from model data only if it's EV
//       if (isEV && modelData.subsidy_amount) {
//         setFormData(prev => ({
//           ...prev,
//           subsidy_amount: modelData.subsidy_amount
//         }));
//       }

//       const selectedModel = models.find((model) => model._id === modelId);
      
//       // Get ALL headers from the model
//       const allHeaders = prices
//         .filter(price => price.header && price.header._id)
//         .map(price => price.header._id);
      
//       // For new booking: check ALL headers by default
//       if (!isEditMode) {
//         setFormData((prev) => ({
//           ...prev,
//           optionalComponents: allHeaders, // Initialize with ALL headers
//           uncheckedHeaders: [] // Empty = all are checked
//         }));
//       }

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           // Initialize all discounts as empty
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//       setIsEVModel(false);
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type;
//       const modelName = modelData.model_name;
      
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       const filteredAccessories = allAccessories.filter(accessory => {
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false;
//         }
        
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
      
//       const accessoryIds = filteredAccessories.map(accessory => accessory._id);
      
//       // For new booking: check ALL accessories by default
//       if (!isEditMode) {
//         setFormData(prev => ({
//           ...prev,
//           selected_accessories: accessoryIds,
//           uncheckedAccessories: [] // Empty = all are checked
//         }));
//       }
      
//       setAccessories(filteredAccessories);
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setFinancers(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, []);

//  const handleChange = (e) => {
//   const { name, value } = e.target;
  
//   if (name === 'hpa') {
//     const booleanValue = value === 'true';
//     setFormData((prevData) => ({ 
//       ...prevData, 
//       [name]: booleanValue 
//     }));
    
//     // When HPA changes, also update optionalComponents
//     if (name === 'hpa') {
//       if (!booleanValue) {
//         // If HPA is disabled, remove HP/HPA headers
//         const hpHeaders = getSelectedModelHeaders()
//           .filter(price => price.header && price.header._id)
//           .filter(price => {
//             const headerKey = price.header.header_key || '';
//             return headerKey.startsWith('HP') || headerKey.startsWith('HPA');
//           })
//           .map(price => price.header._id);
        
//         setFormData(prev => ({
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter(id => !hpHeaders.includes(id))
//         }));
//       }
//     }
//   } else {
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   }
  
//   setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//   if (name === 'customer_type') {
//     fetchModels(value, formData.subdealer);
//     setFormData(prev => ({
//       ...prev,
//       verticle_id: '',
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: [],
//       subsidy_amount: '' // Reset subsidy amount
//     }));
//     setIsEVModel(false);
//   } else if (name === 'verticle_id') {
//     setFormData(prev => ({
//       ...prev,
//       verticle_id: value,
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: [],
//       subsidy_amount: '' // Reset subsidy amount
//     }));
//     setIsEVModel(false);

//     if (value) {
//       const filtered = models.filter(model => 
//         model.verticle_id === value || model.verticle === value
//       );
//       setFilteredModels(filtered);
//     } else {
//       setFilteredModels(models);
//     }
//   } else if (name === 'subdealer') {
//     const selectedSubdealer = subdealers.find((b) => b._id === value);
//     setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
//     fetchModels(formData.customer_type, value);
//     setFormData(prev => ({
//       ...prev,
//       verticle_id: '',
//       model_id: '',
//       model_name: '',
//       optionalComponents: [],
//       selected_accessories: [],
//       uncheckedHeaders: [], // Reset unchecked headers
//       uncheckedAccessories: [],
//       subsidy_amount: '' // Reset subsidy amount
//     }));
//     setIsEVModel(false);
//   } else if (name === 'model_id') {
//     const selectedModel = models.find((model) => model._id === value);
//     if (selectedModel) {
//       // Check if model type is EV
//       const isEV = selectedModel.type === 'EV';
//       setIsEVModel(isEV);
      
//       setFormData(prev => ({
//         ...prev,
//         model_name: selectedModel.model_name,
//         model_id: value,
//         optionalComponents: [],
//         selected_accessories: [],
//         uncheckedHeaders: [], // Reset unchecked headers when model changes
//         uncheckedAccessories: [],
//         // Only set subsidy amount if it's an EV model
//         subsidy_amount: isEV ? (selectedModel.subsidy_amount || '') : ''
//       }));
      
//       setModelType(selectedModel.type);
//       setSelectedModelName(selectedModel.model_name);
      
//       fetchAccessories(value);
//       fetchModelColors(value);
//       if (isEditMode) {
//         fetchModelHeadersForEdit(value, headerDiscounts);
//       } else {
//         fetchModelHeaders(value);
//       }
//     }
//   }
// };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           optionalComponents: [...prev.optionalComponents, headerId],
//           uncheckedHeaders: prev.uncheckedHeaders?.filter(id => id !== headerId) || []
//         };
//       } else {
//         return {
//           ...prev,
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId),
//           uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId]
//         };
//       }
//     });
//   };

//   const handleHeaderDiscountChange = (headerId, value) => {
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId],
//           uncheckedAccessories: prev.uncheckedAccessories?.filter(id => id !== accessoryId) || []
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId),
//           uncheckedAccessories: [...(prev.uncheckedAccessories || []), accessoryId]
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   const getAccessoryPriceForHeader = (headerKey) => {
//     // Find accessories with matching header key
//     const matchingAccessories = accessories.filter(accessory => 
//       accessory.categoryDetails?.header_key === headerKey
//     );
    
//     if (matchingAccessories.length === 0) return 0;
    
//     // Get the highest price among matching accessories
//     return Math.max(...matchingAccessories.map(acc => acc.price || 0));
//   };

//   const getCheckedHeadersForTab6 = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     if (!selectedModel) return [];
    
//     const modelPrices = selectedModel.modelPrices || [];
    
//     // First apply HPA filter
//     const filteredByHPA = filterHeadersByHPAStatus(modelPrices, formData.hpa);
    
//     // Then filter to show only headers that should be displayed
//     return filteredByHPA.filter((price) => {
//       if (!price.header || !price.header._id) return false;
      
//       const header = price.header;
//       const headerId = header._id;
//       const isMandatory = header.is_mandatory;
      
//       if (isEditMode) {
//         // In edit mode: show headers that are in optionalComponents (were selected in original booking)
//         // AND not explicitly unchecked by the user
//         const isInOptionalComponents = formData.optionalComponents.includes(headerId);
//         const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//           formData.uncheckedHeaders.includes(headerId);
        
//         return isMandatory || (isInOptionalComponents && !isExplicitlyUnchecked);
//       } else {
//         // In new booking mode: show headers that are not explicitly unchecked
//         const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//           formData.uncheckedHeaders.includes(headerId);
//         return isMandatory || !isExplicitlyUnchecked;
//       }
//     });
//   };

//   const calculateTotalDealAmount = () => {
//     // Get headers that are currently checked (same logic as Tab 6)
//     const selectedHeaders = getCheckedHeadersForTab6()
//       .filter((price) => {
//         const header = price.header;
        
//         // Exclude summary/total headers
//         const excludedHeaders = [
//           'ON ROAD PRICE (A)',
//           'TOTAL ONROAD+ADDON SERVICES',
//           'TOTAL ONROAD + ADDON SERVICES',
//           'ADDON SERVICES TOTAL (B)',
//           'ACCESSORIES TOTAL',
//           'ON ROAD PRICE',
//           'ADDON SERVICES TOTAL',
//           'ADD ON SERVICES TOTAL',
//           'TOTAL AMOUNT',
//           'GRAND TOTAL',
//           'FINAL AMOUNT',
//           'TOTAL',
//           'ON-ROAD PRICE',
//           'FINAL PRICE',
//           'COMPLETE PRICE'
//         ];
        
//         const headerKey = header.header_key || '';
//         return !excludedHeaders.includes(headerKey);
//       });

//     let totalBeforeDiscount = 0;
//     let totalDiscount = 0;
//     let subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
    
//     console.log('Subsidy amount in calculation:', subsidyAmount);
//     console.log('Is EV Model:', isEVModel);
    
//     // Calculate ORIGINAL total (without any discounts)
//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const headerKey = header.header_key;
//       const headerPrice = price.value || 0;
      
//       // Get accessory price for this header (if any)
//       const accessoryPrice = getAccessoryPriceForHeader(headerKey);
      
//       // Use whichever is higher: header price or accessory price
//       const unitPrice = Math.max(headerPrice, accessoryPrice);
      
//       const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
      
//       // Calculate original line total WITHOUT discount
//       const taxable = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
//       const { cgstAmount, sgstAmount } = calculateGST(taxable, gstRate, formData.customer_type);
//       const originalLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       console.log(`Header "${headerKey}": Header Price=${headerPrice}, Accessory Price=${accessoryPrice}, Final Price=${unitPrice}`);
      
//       totalBeforeDiscount += originalLineTotal;
//     });
    
//     // Calculate total discounts from headerDiscounts ONLY
//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const headerId = header._id;
//       const discountValue = headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : 0;
//       const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
//       if (discountAmount > 0) {
//         console.log(`Discount for ${header.header_key}: ₹${discountAmount}`);
//         totalDiscount += discountAmount;
//       }
//     });

//     const totalAllDiscounts = totalDiscount;
//     let finalTotal = totalBeforeDiscount - totalAllDiscounts;
    
//     // Apply subsidy deduction for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
//     const exShowroomHeader = selectedHeaders.find(price => 
//       price.header.header_key === 'Ex-SHOWROOM(INCLUDING 5% GST)'
//     );
    
//     if (exShowroomHeader && subsidyAmount > 0 && isEVModel) {
//       console.log(`Applying subsidy amount of ₹${subsidyAmount} to Ex-SHOWROOM header (EV Model)`);
//       finalTotal -= subsidyAmount;
//     }

//     console.log('Total calculation:', {
//       totalBeforeDiscount,
//       totalDiscount,
//       totalAllDiscounts,
//       subsidyAmount,
//       finalTotal,
//       isEVModel
//     });

//     return {
//       totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
//       totalAfterDiscount: finalTotal.toFixed(2),
//       totalDiscount: totalAllDiscounts.toFixed(2),
//       hasDiscount: totalAllDiscounts > 0,
//       subsidyAmount: subsidyAmount.toFixed(2)
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = [
//       'verticle_id',
//       'model_id',
//       'model_color',
//       'customer_type',
//       'name',
//       'address',
//       'mobile1',
//       'aadhar_number',
//       'pan_no'
//     ];
    
//     if (!isSubdealerUser) {
//       requiredFields.push('subdealer');
//     }
    
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle selection is required';
//     }

//     if (formData.customer_type === 'B2B' && !formData.gstin) {
//       formErrors.gstin = 'GSTIN is required for B2B customers';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     console.log('=== SUBMITTING BOOKING ===');
//     console.log('Current formData.optionalComponents:', formData.optionalComponents);
//     console.log('Current formData.uncheckedHeaders:', formData.uncheckedHeaders);
//     console.log('Current headerDiscounts:', headerDiscounts);
//     console.log('Subsidy amount:', formData.subsidy_amount);
//     console.log('Is EV Model:', isEVModel);

//     // For new bookings: include all headers except explicitly unchecked ones
//     // For edit mode: use the existing optionalComponents
//     let headersToSubmit = [];
//     if (isEditMode) {
//       headersToSubmit = formData.optionalComponents;
//     } else {
//       // Get all headers and exclude the explicitly unchecked ones
//       const allHeaders = getSelectedModelHeaders()
//         .filter(price => price.header && price.header._id)
//         .map(price => price.header._id);
      
//       headersToSubmit = allHeaders.filter(headerId => 
//         !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
//       );
//     }

//     console.log('Headers to submit:', headersToSubmit);

//     // Process header discounts - only include for headers that are actually selected
//     const headerDiscountsArray = Object.entries(headerDiscounts)
//       .filter(([headerId, value]) => {
//         const isSelected = headersToSubmit.includes(headerId);
//         const hasDiscount = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
//         console.log(`Header ${headerId}: isSelected=${isSelected}, hasDiscount=${hasDiscount}, value=${value}`);
//         return isSelected && hasDiscount;
//       })
//       .map(([headerId, value]) => ({
//         headerId,
//         discountAmount: parseFloat(value) || 0
//       }));

//     console.log('Header discounts to submit:', headerDiscountsArray);

//     // Process accessories - similar logic for accessories
//     let accessoriesToSubmit = [];
//     if (isEditMode) {
//       accessoriesToSubmit = formData.selected_accessories;
//     } else {
//       const allAccessoryIds = accessories.map(accessory => accessory._id);
//       accessoriesToSubmit = allAccessoryIds.filter(accessoryId => 
//         !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
//       );
//     }

//     const accessoriesArray = accessoriesToSubmit.map((id) => ({ id }));
//     console.log('Accessories to submit:', accessoriesArray);

//     // Prepare request body
//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       subdealer: formData.subdealer,
//       verticles: formData.verticle_id ? [formData.verticle_id] : [],
//       optionalComponents: headersToSubmit, // This is the key - only checked headers
//       sales_executive: formData.sales_executive,
//       customer_details: {
//         salutation: formData.salutation,
//         name: formData.name,
//         pan_no: formData.pan_no,
//         dob: formData.dob,
//         occupation: formData.occupation,
//         address: formData.address,
//         taluka: formData.taluka,
//         district: formData.district,
//         pincode: formData.pincode,
//         mobile1: formData.mobile1,
//         mobile2: formData.mobile2,
//         aadhar_number: formData.aadhar_number,
//         nomineeName: formData.nomineeName,
//         nomineeRelation: formData.nomineeRelation,
//         nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//       },
//       payment: {
//         type: formData.type.toUpperCase(),
//         ...(formData.type.toLowerCase() === 'finance' && {
//           financer_id: formData.financer_id
//         })
//       },
//       headerDiscounts: headerDiscountsArray,
//       discount: {
//         type: formData.discountType,
//         value: formData.value ? parseFloat(formData.value) : 0
//       },
//       accessories: {
//         selected: accessoriesArray
//       },
//       hpa: formData.hpa === true,
//       note: formData.note || '',
//       // Only include subsidy amount if it's an EV model
//       ...(isEVModel && { subsidy_amount: formData.subsidy_amount ? parseFloat(formData.subsidy_amount) : 0 })
//     };

//     // Add conditional fields
//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rtoAmount = formData.rtoAmount;
//     }

//     console.log('=== FINAL REQUEST BODY ===');
//     console.log('optionalComponents being sent:', requestBody.optionalComponents);
//     console.log('Number of optionalComponents:', requestBody.optionalComponents.length);
//     console.log('Subsidy amount being sent:', isEVModel ? requestBody.subsidy_amount : 'N/A (Not EV model)');
//     console.log('Full request body:', JSON.stringify(requestBody, null, 2));

//     try {
//       let response;
//       if (isEditMode) {
//         console.log(`Updating booking with ID: ${id}`);
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         console.log('Creating new booking');
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       console.log('API Response:', response.data);

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         console.log('Success:', successMessage);
//         await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
//         navigate('/subdealer-all-bookings');
//       } else {
//         console.error('Submission failed:', response.data);
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       console.error('Error response:', error.response?.data);
//       const message = showError(error);
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const dealTotals = calculateTotalDealAmount();

//   return (
//     <div className="form-container">
//       <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>

//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C" selected>
//                           B2C
//                         </option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       {isSubdealerUser && formData.subdealer ? (
//                         <CFormInput 
//                           type="text" 
//                           value={selectedSubdealerName}
//                           readOnly
//                           disabled
//                         />
//                       ) : (
//                         <CFormSelect 
//                           name="subdealer" 
//                           value={formData.subdealer} 
//                           onChange={handleChange}
//                           disabled={isEditMode}
//                         >
//                           <option value="">-Select-</option>
//                           {subdealers.map((subdealer) => (
//                             <option key={subdealer._id} value={subdealer._id}>
//                               {subdealer.name}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       )}
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {isSubdealerUser && formData.subdealer && (
//                       <small className="text-muted">
//                         Subdealer auto-selected based on your account
//                       </small>
//                     )}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={!formData.subdealer || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
//                     </div>
//                   )}

//                   {/* Conditionally render Subsidy Amount field only for EV models */}
//                   {isEVModel && (
//                     <div className="input-box">
//                       <span className="details">Subsidy Amount</span>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="text" 
//                           name="subsidy_amount" 
//                           value={formData.subsidy_amount} 
//                           onChange={handleChange}
//                           disabled={true} // Make it read-only
//                           placeholder="Auto-filled for EV models"
//                         />
//                       </CInputGroup>
//                       <small className="text-muted">Subsidy applicable for EV models only</small>
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>
//                 </div>

//                 {getSelectedModelHeaders().length > 0 && (
//                   <div className="model-headers-section">
//                     <h5>
//                       Model Options 
//                       {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
//                         (HPA-related options hidden as HPA is disabled)
//                       </span>}
//                     </h5>
//                     <div className="headers-list">
//                       {getSelectedModelHeaders()
//                         .filter((price) => price.header && price.header._id)
//                         .map((price) => {
//                           const header = price.header;
//                           const isMandatory = header.is_mandatory;
//                           const headerId = header._id;
//                           const headerKey = header.header_key || '';
                          
//                           // Check if this is an HPA-related header
//                           const isHPAHeader = headerKey.startsWith('HP') || 
//                                               headerKey.startsWith('HPA') ||
//                                               headerKey.toLowerCase().includes('hypothecation') ||
//                                               headerKey.toLowerCase().includes('loan');
                          
//                           // Determine if header should be shown based on HPA status
//                           const shouldShowHeader = formData.hpa || !isHPAHeader;
                          
//                           if (!shouldShowHeader) {
//                             return null; // Skip rendering this header
//                           }
                          
//                           let isChecked;
//                           if (isEditMode) {
//                             // In edit mode: checked if it was in the original booking AND not explicitly unchecked
//                             const isInOptionalComponents = formData.optionalComponents.includes(headerId);
//                             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                               formData.uncheckedHeaders.includes(headerId);
//                             isChecked = isMandatory || (isInOptionalComponents && !isExplicitlyUnchecked);
//                           } else {
//                             // In new booking mode: checked if not explicitly unchecked
//                             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                               formData.uncheckedHeaders.includes(headerId);
//                             isChecked = isMandatory || !isExplicitlyUnchecked;
//                           }

//                           return (
//                             <div key={headerId} className="header-item">
//                               <CFormCheck
//                                 id={`header-${headerId}`}
//                                 label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : '(Optional)'} ${isHPAHeader ? '(HPA-related)' : ''}`}
//                                 checked={isChecked}
//                                 onChange={(e) => {
//                                   if (!isMandatory) {
//                                     const isNowChecked = e.target.checked;
//                                     handleHeaderSelection(headerId, isNowChecked);
                                    
//                                     // Also update headerDiscounts
//                                     if (!isNowChecked) {
//                                       // Remove discount when unchecking
//                                       setHeaderDiscounts(prev => {
//                                         const updated = { ...prev };
//                                         delete updated[headerId];
//                                         return updated;
//                                       });
//                                     }
//                                   }
//                                 }}
//                                 disabled={isMandatory}
//                               />
//                               {isMandatory && <input type="hidden" name={`mandatory-${headerId}`} value={headerId} />}
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0 || isEditMode}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>
//                   {formData.type === 'finance' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Financer Name</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilInstitution} />
//                           </CInputGroupText>
//                           <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
//                             <option value="">-Select Financer-</option>
//                             {financers.map((financer) => (
//                               <option key={financer._id} value={financer._id}>
//                                 {financer.name}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.financer_id && <p className="error">{errors.financer_id}</p>}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                         {accessories.map((accessory) => {
//                           // For new bookings: all accessories are checked by default
//                           // For edit mode: use the existing selections
//                           let isChecked;
//                           if (isEditMode) {
//                             isChecked = formData.selected_accessories.includes(accessory._id);
//                           } else {
//                             const isExplicitlyUnchecked = formData.uncheckedAccessories && 
//                               formData.uncheckedAccessories.includes(accessory._id);
//                             isChecked = !isExplicitlyUnchecked; // Default checked
//                           }

//                           return (
//                             <div key={accessory._id} className="accessory-item">
//                               <CFormCheck
//                                 id={`accessory-${accessory._id}`}
//                                 label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//                                 checked={isChecked}
//                                 onChange={(e) => {
//                                   const isNowChecked = e.target.checked;
//                                   handleAccessorySelection(accessory._id, isNowChecked);
//                                 }}
//                               />
//                               {accessory.description && (
//                                 <small className="text-muted d-block">{accessory.description}</small>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 6 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <div style={{ flex: '0 0 48%' }}>
//                       <span className="details">Note</span>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilList} />
//                         </CInputGroupText>
//                         <CFormInput name="note" value={formData.note} onChange={handleChange} />
//                       </CInputGroup>
//                     </div>
                    
//                     <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
//                       <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
//                       <div style={{ 
//                         display: 'inline-block',
//                         backgroundColor: '#f8f9fa',
//                         padding: '10px 15px',
//                         borderRadius: '5px',
//                         border: '1px solid #dee2e6',
//                         minWidth: '200px',
//                         textAlign: 'left'
//                       }}>
//                         {(() => {
//                           const totals = calculateTotalDealAmount();
//                           const totalBeforeDiscount = parseFloat(totals.totalBeforeDiscount);
//                           const totalAfterDiscount = parseFloat(totals.totalAfterDiscount);
//                           const totalDiscount = parseFloat(totals.totalDiscount);
//                           const subsidyAmount = parseFloat(totals.subsidyAmount);
//                           const hasDiscount = totals.hasDiscount;
                          
//                           return (
//                             <>
//                               {/* Original Total - Always shown */}
//                               <div style={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 marginBottom: '3px'
//                               }}>
//                                 <small>Original Total:</small>
//                                 <span>₹{totalBeforeDiscount.toLocaleString('en-IN')}</span>
//                               </div>
                              
//                               {/* Show discount if there is one */}
//                               {hasDiscount && (
//                                 <div style={{ 
//                                   display: 'flex', 
//                                   justifyContent: 'space-between',
//                                   alignItems: 'center',
//                                   marginBottom: '3px',
//                                   color: '#dc3545',
//                                   fontSize: '12px'
//                                 }}>
//                                   <small>Discount:</small>
//                                   <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
//                                 </div>
//                               )}
                              
//                               {/* Show subsidy if there is one AND it's an EV model */}
//                               {subsidyAmount > 0 && isEVModel && (
//                                 <div style={{ 
//                                   display: 'flex', 
//                                   justifyContent: 'space-between',
//                                   alignItems: 'center',
//                                   marginBottom: '3px',
//                                   color: '#0d6efd',
//                                   fontSize: '12px'
//                                 }}>
//                                   <small>EV Subsidy:</small>
//                                   <span>- ₹{subsidyAmount.toLocaleString('en-IN')}</span>
//                                 </div>
//                               )}
                              
//                               {/* Separator if there are any deductions */}
//                               {(hasDiscount || (subsidyAmount > 0 && isEVModel)) && (
//                                 <div style={{ 
//                                   width: '100%', 
//                                   height: '1px', 
//                                   backgroundColor: '#ccc', 
//                                   margin: '3px 0',
//                                   borderTop: '1px dashed #999'
//                                 }}></div>
//                               )}
                              
//                               {/* Final Amount - Big and bold */}
//                               <div style={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 marginTop: '3px',
//                                 fontWeight: 'bold'
//                               }}>
//                                 <span>{(hasDiscount || (subsidyAmount > 0 && isEVModel)) ? 'Final Amount:' : 'Total:'}</span>
//                                 <span style={{ 
//                                   color: (hasDiscount || (subsidyAmount > 0 && isEVModel)) ? '#198754' : '#198754', 
//                                   fontSize: '16px' 
//                                 }}>
//                                   ₹{totalAfterDiscount.toLocaleString('en-IN')}
//                                 </span>
//                               </div>
//                             </>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {getCheckedHeadersForTab6().length > 0 && (
//                   <div className="model-headers-section" style={{ marginTop: '20px' }}>
//                     <h5>
//                       Model Options ({getCheckedHeadersForTab6().length} selected)
//                       {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
//                         (HPA-related options hidden as HPA is disabled)
//                       </span>}
//                     </h5>
                    
//                     <div className="table-responsive">
//                       <CTable striped hover responsive>
//                         <CTableHead>
//                           <CTableRow>
//                             <CTableHeaderCell>Particulars</CTableHeaderCell>
//                             <CTableHeaderCell>HSN</CTableHeaderCell>
//                             <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>CGST %</CTableHeaderCell>
//                             <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>SGST %</CTableHeaderCell>
//                             <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                             <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                           {getCheckedHeadersForTab6().map((price) => {
//                             const header = price.header;
//                             const isMandatory = header.is_mandatory;
//                             const isDiscountAllowed = header.is_discount;
                            
//                             const headerId = header._id || header.id;
//                             const headerKey = header.header_key || '';
                            
//                             // Check if this is an HPA-related header
//                             const isHPAHeader = headerKey.startsWith('HP') || 
//                                                 headerKey.startsWith('HPA') ||
//                                                 headerKey.toLowerCase().includes('hypothecation') ||
//                                                 headerKey.toLowerCase().includes('loan');
                            
//                             // Determine if header should be shown based on HPA status
//                             const shouldShowHeader = formData.hpa || !isHPAHeader;
                            
//                             if (!shouldShowHeader) {
//                               return null; // Skip rendering this header
//                             }
                            
//                             // Check if this header is currently checked
//                             // Use the same logic as in getCheckedHeadersForTab6()
//                             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                               formData.uncheckedHeaders.includes(headerId);
//                             const isChecked = isMandatory || !isExplicitlyUnchecked;

//                             const discountValue = headerDiscounts[headerId] !== undefined 
//                               ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
//                               : '';
                            
//                             const headerPrice = price.value || 0;
                            
//                             // Get accessory price for this header (if any)
//                             const accessoryPrice = getAccessoryPriceForHeader(headerKey);
                            
//                             // Use whichever is higher: header price or accessory price
//                             const unitPrice = Math.max(headerPrice, accessoryPrice);
                            
//                             const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                            
//                             const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                             const hsnCode = header.metadata?.hsn_code || 'N/A';
                            
//                             const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                            
//                             const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                            
//                             // Apply subsidy deduction for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
//                             let lineTotal;
//                             if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel) {
//                               const subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
//                               const calculatedLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
//                               // Subtract subsidy amount from line total
//                               lineTotal = calculatedLineTotal - subsidyAmount;
//                               console.log(`Applying subsidy of ₹${subsidyAmount} to ${headerKey}. Original: ₹${calculatedLineTotal}, After subsidy: ₹${lineTotal}`);
//                             } else {
//                               lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
//                             }

//                             return (
//                               <CTableRow key={headerId}>
//                                 <CTableDataCell>
//                                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <CFormCheck
//                                       id={`tab6-header-${headerId}`}
//                                       checked={isChecked}
//                                       onChange={(e) => {
//                                         if (!isMandatory) {
//                                           const isNowChecked = e.target.checked;
//                                           handleHeaderSelection(headerId, isNowChecked);
                                          
//                                           // Also update headerDiscounts
//                                           if (!isNowChecked) {
//                                             // Remove discount when unchecking
//                                             setHeaderDiscounts(prev => {
//                                               const updated = { ...prev };
//                                               delete updated[headerId];
//                                               return updated;
//                                             });
//                                           } else {
//                                             // Initialize discount when checking
//                                             setHeaderDiscounts(prev => {
//                                               if (prev[headerId] === undefined) {
//                                                 return { ...prev, [headerId]: '' };
//                                               }
//                                               return prev;
//                                             });
//                                           }
//                                         }
//                                       }}
//                                       disabled={isMandatory}
//                                       style={{ marginRight: '10px' }}
//                                     />
//                                     <span>
//                                       {header.header_key} {isMandatory ? '(Mandatory)' : '(Optional)'}
//                                       {isHPAHeader && ' (HPA-related)'}
//                                       {headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel && ' (Subsidy applied)'}
//                                       {accessoryPrice > headerPrice && (
//                                         <small className="text-muted d-block">
//                                           (Using accessory price: ₹{accessoryPrice})
//                                         </small>
//                                       )}
//                                     </span>
//                                   </div>
//                                 </CTableDataCell>
//                                 <CTableDataCell>{hsnCode}</CTableDataCell>
//                                 <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>
//                                   <CFormInput
//                                     type="number"
//                                     min="0"
//                                     step="0.01"
//                                     placeholder="Enter discount"
//                                     value={discountValue}
//                                     onChange={(e) => handleHeaderDiscountChange(headerId, e.target.value)}
//                                     disabled={!isDiscountAllowed}
//                                     style={{ width: '150px' }}
//                                   />
//                                   {errors[`discount_${headerId}`] && (
//                                     <small className="text-danger d-block">{errors[`discount_${headerId}`]}</small>
//                                   )}
//                                 </CTableDataCell>
//                                 <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
//                                 <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
//                                 <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                                 <CTableDataCell>
//                                   <strong>₹{lineTotal.toFixed(2)}</strong>
//                                   {headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel && (
//                                     <div style={{ fontSize: '11px', color: '#666' }}>
//                                       (After ₹{formData.subsidy_amount} EV subsidy)
//                                     </div>
//                                   )}
//                                 </CTableDataCell>
//                               </CTableRow>
//                             );
//                           })}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//                     Back
//                   </button>
//                   <button type="submit" className="submit-button" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubdealerNewBooking;











import React, { useState, useEffect, useRef } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBank,
  cilBarcode,
  cilBike,
  cilBirthdayCake,
  cilBriefcase,
  cilCalendar,
  cilCarAlt,
  cilCreditCard,
  cilEnvelopeClosed,
  cilFingerprint,
  cilHome,
  cilInstitution,
  cilList,
  cilLocationPin,
  cilMap,
  cilMoney,
  cilPaint,
  cilPeople,
  cilPhone,
  cilShieldAlt,
  cilUser
} from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
import axiosInstance from 'src/axiosInstance';
import { showError } from '../../../utils/sweetAlerts';

function SubdealerNewBooking() {
  const [formData, setFormData] = useState({
    verticle_id: '',
    model_id: '',
    model_color: '',
    customer_type: 'B2C',
    rto_type: 'MH',
    subdealer: '',
    optionalComponents: [],
    sales_executive: '',
    gstin: '',
    rtoAmount: '',
    salutation: '',
    name: '',
    pan_no: '',
    dob: '',
    occupation: '',
    address: '',
    taluka: '',
    district: '',
    pincode: '',
    mobile1: '',
    mobile2: '',
    aadhar_number: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: '',
    type: 'cash',
    financer_id: '',
    discountType: 'fixed',
    value: 0,
    selected_accessories: [],
    hpa: true,
    is_exchange: false,
    broker_id: '',
    vehicle_number: '',
    chassis_number: '',
    note: '',
    uncheckedHeaders: [],
    uncheckedAccessories: [],
    subsidy_amount: '', // Added subsidy amount field
    rto_code: '' // Added rto_code field for MH RTO type
  });
  
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [allVerticles, setAllVerticles] = useState([]);
  const [userVerticles, setUserVerticles] = useState([]);
  const [userVerticleIds, setUserVerticleIds] = useState([]);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [financers, setFinancers] = useState([]);
  const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
  const [modelDetails, setModelDetails] = useState(null);
  const [accessoriesTotal, setAccessoriesTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modelType, setModelType] = useState('');
  const [selectedModelName, setSelectedModelName] = useState('');
  const [headerDiscounts, setHeaderDiscounts] = useState({});
  const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
  const [isSubdealerUser, setIsSubdealerUser] = useState(false);
  const [isEVModel, setIsEVModel] = useState(false);
  
  // New state for RTO codes
  const [rtoCodes, setRtoCodes] = useState([]);
  const [loadingRtoCodes, setLoadingRtoCodes] = useState(false);

  const isInitialBookingLoad = useRef(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Function to filter headers based on HPA status
  const filterHeadersByHPAStatus = (headers, hpaEnabled) => {
    if (hpaEnabled) {
      return headers; // Show all headers when HPA is enabled
    } else {
      // Filter out headers starting with 'HP' or 'HPA' when HPA is disabled
      return headers.filter(price => {
        const headerKey = price.header?.header_key || '';
        const lowerHeaderKey = headerKey.toLowerCase();
        
        // Exclude headers related to HPA
        return !(
          lowerHeaderKey.startsWith('hp') ||
          lowerHeaderKey.startsWith('hpa') ||
          lowerHeaderKey.includes('hypothecation') ||
          lowerHeaderKey.includes('loan')
        );
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
    
    if (id && !isInitialBookingLoad.current) {
      isInitialBookingLoad.current = true;
      fetchBookingDetails(id);
      setIsEditMode(true);
    }
  }, [id]);

  // Fetch RTO codes when RTO type is MH
  useEffect(() => {
    const fetchRtoCodes = async () => {
      if (formData.rto_type === 'MH') {
        setLoadingRtoCodes(true);
        try {
          const response = await axiosInstance.get('/rtos');
          // Filter active RTO codes only
          const activeRtoCodes = response.data?.data?.filter(rto => rto.is_active) || [];
          setRtoCodes(activeRtoCodes);
        } catch (error) {
          console.error('Error fetching RTO codes:', error);
          setRtoCodes([]);
          const message = showError(error);
          if (message) {
            setError(message);
          }
        } finally {
          setLoadingRtoCodes(false);
        }
      } else {
        // Clear RTO codes if not MH
        setRtoCodes([]);
        // Also clear rto_code from formData if not MH
        setFormData(prev => ({ ...prev, rto_code: '' }));
      }
    };
    
    fetchRtoCodes();
  }, [formData.rto_type]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      const userData = response.data.data;
      const verticlesData = userData?.verticles || [];
      const userSubdealer = userData?.subdealer;
      
      const verticleIds = verticlesData.map(verticle => verticle._id);
      setUserVerticleIds(verticleIds);
      
      const userIsSubdealer = userData.roles?.some(role => 
        role.name === 'SUBDEALER' || role.name === 'Subdealer'
      );
      setIsSubdealerUser(userIsSubdealer);
      
      if (userIsSubdealer && userSubdealer && userSubdealer._id) {
        setFormData(prev => ({
          ...prev,
          subdealer: userSubdealer._id
        }));
        setSelectedSubdealerName(userSubdealer.name || '');
        
        fetchModels(formData.customer_type || 'B2C', userSubdealer._id);
      }
      
      await fetchAllVerticles(verticlesData);
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  const fetchAllVerticles = async (userVerticlesData) => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setAllVerticles(verticlesData);
      
      const filteredVerticles = userVerticlesData.filter(verticle => 
        verticle.status === 'active'
      );
      setUserVerticles(filteredVerticles);
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      const bookingData = response.data.data;

      console.log('=== EDIT MODE: Fetching Booking Details ===');
      console.log('Booking data rtoCode:', bookingData.rtoCode);

      const priceComponents = bookingData.priceComponents || [];
      setBookingPriceComponents(priceComponents);

      // Get booked header IDs from API
      const bookedHeaderIds = priceComponents
        .filter(pc => pc.header && pc.header._id)
        .map(pc => pc.header._id);

      console.log('Booked headers from API:', bookedHeaderIds);

      // Calculate initial discounts
      const initialDiscounts = {};
      priceComponents.forEach(priceComponent => {
        if (priceComponent.header && priceComponent.header._id) {
          const discountAmount = priceComponent.discountAmount || 0;
          initialDiscounts[priceComponent.header._id] = discountAmount;
        }
      });
      
      console.log('Initial discounts from booking API:', initialDiscounts);
      setHeaderDiscounts(initialDiscounts);

      await fetchModels(bookingData.customerType, bookingData.subdealer?._id);

      const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
        ? bookingData.verticles[0]._id || bookingData.verticles[0] 
        : '';

      // Check if model is EV
      const isEV = bookingData.model?.type === 'EV';
      setIsEVModel(isEV);

      // Set form data - set optionalComponents to bookedHeaderIds
      const formDataToSet = {
        verticle_id: bookingVerticle,
        model_id: bookingData.model?.id || '',
        model_color: bookingData.color?.id || '',
        customer_type: bookingData.customerType || 'B2C',
        rto_type: bookingData.rto || 'MH',
        subdealer: bookingData.subdealer?._id || '',
        optionalComponents: bookedHeaderIds, // CRITICAL: Set from API
        sales_executive: bookingData.salesExecutive?._id || '',
        gstin: bookingData.gstin || '',
        rtoAmount: bookingData.rtoAmount || '',
        salutation: bookingData.customerDetails?.salutation || '',
        name: bookingData.customerDetails?.name || '',
        pan_no: bookingData.customerDetails?.panNo || '',
        dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
        occupation: bookingData.customerDetails?.occupation || '',
        address: bookingData.customerDetails?.address || '',
        taluka: bookingData.customerDetails?.taluka || '',
        district: bookingData.customerDetails?.district || '',
        pincode: bookingData.customerDetails?.pincode || '',
        mobile1: bookingData.customerDetails?.mobile1 || '',
        mobile2: bookingData.customerDetails?.mobile2 || '',
        aadhar_number: bookingData.customerDetails?.aadharNumber || '',
        nomineeName: bookingData.customerDetails?.nomineeName || '',
        nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
        nomineeAge: bookingData.customerDetails?.nomineeAge || '',
        type: bookingData.payment?.type?.toLowerCase() || 'cash',
        financer_id: bookingData.payment?.financer?._id || '',
        value: bookingData.discounts[0]?.amount || 0,
        selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
        hpa: bookingData.hpa || false,
        note: bookingData.note || '',
        uncheckedHeaders: [], // We'll calculate this below
        uncheckedAccessories: [],
        // Only set subsidy amount if it's an EV model
        subsidy_amount: isEV ? (bookingData.subsidy_amount || '') : '',
        // Set rto_code from API response
        rto_code: bookingData.rtoCode || bookingData.rto_code || ''
      };

      console.log('Form data set with optionalComponents:', bookedHeaderIds);
      console.log('Setting form data with rto_code:', formDataToSet.rto_code);
      setFormData(formDataToSet);

      setSelectedSubdealerName(bookingData.subdealer?.name || '');
      setModelDetails(bookingData.model || null);
      setAccessoriesTotal(bookingData.accessoriesTotal || 0);

      if (bookingData.model) {
        setModelType(bookingData.model.type);
        setSelectedModelName(bookingData.model.model_name);
      }

      if (bookingData.model?.id) {
        console.log('Model found, fetching model details...');
        
        // After model loads, we'll update uncheckedHeaders
        setTimeout(() => {
          const selectedModel = models.find((model) => model._id === bookingData.model.id);
          if (selectedModel && selectedModel.modelPrices) {
            // Get all header IDs from model
            const allHeaders = selectedModel.modelPrices
              .filter(price => price.header && price.header._id)
              .map(price => price.header._id);
            
            // Calculate unchecked headers: headers in model but NOT in optionalComponents AND not mandatory
            const uncheckedHeaders = [];
            selectedModel.modelPrices.forEach(price => {
              if (price.header && price.header._id) {
                const headerId = price.header._id;
                const isMandatory = price.header.is_mandatory || false;
                const isInOptionalComponents = bookedHeaderIds.includes(headerId);
                
                if (!isMandatory && !isInOptionalComponents) {
                  uncheckedHeaders.push(headerId);
                }
              }
            });
            
            console.log('Calculated uncheckedHeaders:', uncheckedHeaders);
            
            // Update form data
            setFormData(prev => ({
              ...prev,
              uncheckedHeaders: uncheckedHeaders
            }));
          }
        }, 1000);
        
        fetchAccessories(bookingData.model.id);
        fetchModelColors(bookingData.model.id);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      showFormSubmitError('Failed to load booking details');
    }
  };

  useEffect(() => {
    if (isEditMode && formData.model_id && models.length > 0) {
      const selectedModel = models.find((model) => model._id === formData.model_id);
      if (selectedModel) {
        fetchAccessories(formData.model_id);
        fetchModelColors(formData.model_id);
      }
    }
  }, [isEditMode, formData.model_id, models]);

  const fetchModelHeadersForEdit = async (modelId, existingDiscounts = {}) => {
    try {
      console.log('Fetching model headers for edit with existing discounts:', existingDiscounts);
      
      const response = await axiosInstance.get(`/models/${modelId}`);
      const modelData = response.data.data.model;
      const prices = modelData.prices || [];

      // Check if model is EV
      const isEV = modelData.type === 'EV';
      setIsEVModel(isEV);

      // Set subsidy amount from model data only if it's EV
      if (isEV && modelData.subsidy_amount) {
        setFormData(prev => ({
          ...prev,
          subsidy_amount: modelData.subsidy_amount
        }));
      }

      const selectedModel = models.find((model) => model._id === modelId);
      
      // For edit mode, don't override existing values
      if (!isEditMode) {
        const allHeaders = prices
          .filter(price => price.header && price.header._id)
          .map(price => price.header._id);
        
        setFormData(prev => ({
          ...prev,
          optionalComponents: allHeaders,
          uncheckedHeaders: []
        }));
      }

      setSelectedModelHeaders(prices);
      setModelDetails(modelData);

      console.log('Model prices structure:', prices);

      const mergedDiscounts = {};
      
      prices.forEach(price => {
        let headerId;
        
        if (price.header && price.header._id) {
          headerId = price.header._id;
        } else if (price.header_id) {
          headerId = price.header_id;
        } else if (price.headerId) {
          headerId = price.headerId;
        }
        
        if (headerId) {
          if (existingDiscounts[headerId] !== undefined) {
            mergedDiscounts[headerId] = existingDiscounts[headerId];
          } else {
            mergedDiscounts[headerId] = '';
          }
        }
      });
      
      console.log('Merged discounts after fetching model headers:', mergedDiscounts);
      setHeaderDiscounts(mergedDiscounts);

      const accessoriesTotal = calculateAccessoriesTotal(prices);
      setAccessoriesTotal(accessoriesTotal);
      
      fetchModelColors(modelId);
    } catch (error) {
      console.error('Failed to fetch model headers:', error);
      setSelectedModelHeaders([]);
      setModelDetails(null);
      setAccessoriesTotal(0);
      setHeaderDiscounts({});
      setIsEVModel(false);
    }
  };

  const validateTab1 = () => {
    const requiredFields = ['customer_type', 'verticle_id', 'model_id'];
    if (!isSubdealerUser) {
      requiredFields.push('subdealer');
    }
    
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (formData.customer_type === 'B2B' && !formData.gstin) {
      newErrors.gstin = 'GSTIN is required for B2B customers';
    }

    if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rtoAmount) {
      newErrors.rtoAmount = 'RTO amount is required';
    }

    // Add validation for RTO code when RTO type is MH
    if (formData.rto_type === 'MH' && !formData.rto_code) {
      newErrors.rto_code = 'RTO Code is required when RTO type is MH';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab2 = () => {
    const requiredFields = ['model_color'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab4 = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Payment type is required';
    }

    if (formData.type === 'finance') {
      const financeFields = ['financer_id'];
      financeFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required for finance';
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab6 = () => {
    const newErrors = {};
    
    Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
      if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
        const numValue = parseFloat(discountValue);
        if (isNaN(numValue) || numValue < 0) {
          newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobileNumber = (mobile) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const validatePAN = (pan) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  };

  const validateAadhar = (aadhar) => {
    const regex = /^\d{12}$/;
    return regex.test(aadhar);
  };

  const validatePincode = (pincode) => {
    const regex = /^\d{6}$/;
    return regex.test(pincode);
  };

  const handleNextTab = () => {
    if (activeTab === 1) {
      if (!validateTab1()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    } else if (activeTab === 2) {
      if (!validateTab2()) {
        return;
      }
    } else if (activeTab === 3) {
      const newErrors = {};
      const requiredFields = [
        'salutation',
        'name',
        'address',
        'mobile1',
        'aadhar_number',
        'pan_no',
        'dob',
        'occupation',
        'taluka',
        'district',
        'pincode',
        'nomineeName',
        'nomineeRelation',
        'nomineeAge'
      ];

      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      });

      if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
        newErrors.mobile1 = 'Invalid mobile number';
      }
      if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
        newErrors.mobile2 = 'Invalid mobile number';
      }
      if (formData.pan_no && !validatePAN(formData.pan_no)) {
        newErrors.pan_no = 'Invalid PAN number';
      }
      if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
        newErrors.aadhar_number = 'Invalid Aadhar number';
      }
      if (formData.pincode && !validatePincode(formData.pincode)) {
        newErrors.pincode = 'Pincode must be exactly 6 digits';
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = Object.keys(newErrors)[0];
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        return;
      }
    } else if (activeTab === 4) {
      if (!validateTab4()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    } else if (activeTab === 6) {
      if (!validateTab6()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    }
    
    if (activeTab < 6) {
      setActiveTab((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchModels('B2C');
  }, []);

  const fetchModels = async (customerType = 'B2C', subdealerId = null) => {
    try {
      let endpoint = `/models/with-prices?customerType=${customerType}`;
      if (subdealerId) {
        endpoint += `&subdealer_id=${subdealerId}`;
      }

      const response = await axiosInstance.get(endpoint);
      let modelsData = response.data.data.models || [];
      
      if (formData.verticle_id) {
        modelsData = modelsData.filter(model => 
          model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id
        );
      }

      const processedModels = modelsData.map((model) => {
        const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

        return {
          ...model,
          mandatoryHeaders,
          modelPrices: model.prices.filter((price) => price.header !== null)
        };
      });

      setModels(processedModels);
      setFilteredModels(processedModels);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  useEffect(() => {
    const fetchSubdealers = async () => {
      try {
        const response = await axiosInstance.get('/subdealers');
        setSubdealers(response.data.data.subdealers || []);
      } catch (error) {
        const message = showError(error);
        if (message) {
          setError(message);
        }
      }
    };
    fetchSubdealers();
  }, []);

  const getSelectedModelHeaders = () => {
    if (!formData.model_id) return [];

    const selectedModel = models.find((model) => model._id === formData.model_id);
    const allHeaders = selectedModel?.modelPrices || [];
    
    // Apply HPA filter
    return filterHeadersByHPAStatus(allHeaders, formData.hpa);
  };

  const fetchModelHeaders = async (modelId) => {
    try {
      const response = await axiosInstance.get(`/models/${modelId}`);
      const modelData = response.data.data.model;
      const prices = modelData.prices || [];

      // Check if model is EV
      const isEV = modelData.type === 'EV';
      setIsEVModel(isEV);

      // Set subsidy amount from model data only if it's EV
      if (isEV && modelData.subsidy_amount) {
        setFormData(prev => ({
          ...prev,
          subsidy_amount: modelData.subsidy_amount
        }));
      }

      const selectedModel = models.find((model) => model._id === modelId);
      
      // Get ALL headers from the model
      const allHeaders = prices
        .filter(price => price.header && price.header._id)
        .map(price => price.header._id);
      
      // For new booking: check ALL headers by default
      if (!isEditMode) {
        setFormData((prev) => ({
          ...prev,
          optionalComponents: allHeaders, // Initialize with ALL headers
          uncheckedHeaders: [] // Empty = all are checked
        }));
      }

      setSelectedModelHeaders(prices);
      setModelDetails(modelData);

      const initialDiscounts = {};
      prices.forEach(price => {
        let headerId;
        
        if (price.header && price.header._id) {
          headerId = price.header._id;
        } else if (price.header_id) {
          headerId = price.header_id;
        } else if (price.headerId) {
          headerId = price.headerId;
        }
        
        if (headerId) {
          // Initialize all discounts as empty
          initialDiscounts[headerId] = '';
        }
      });
      
      console.log('Setting initial discounts:', initialDiscounts);
      setHeaderDiscounts(initialDiscounts);

      const accessoriesTotal = calculateAccessoriesTotal(prices);
      setAccessoriesTotal(accessoriesTotal);
      fetchModelColors(modelId);
    } catch (error) {
      console.error('Failed to fetch model headers:', error);
      setSelectedModelHeaders([]);
      setModelDetails(null);
      setAccessoriesTotal(0);
      setHeaderDiscounts({});
      setIsEVModel(false);
    }
  };

  const calculateAccessoriesTotal = (prices) => {
    if (!prices || !Array.isArray(prices)) return 0;
    const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
    return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
  };

  const fetchAccessories = async (modelId) => {
    try {
      const modelResponse = await axiosInstance.get(`/models/${modelId}`);
      const modelData = modelResponse.data.data.model;
      const modelType = modelData.type;
      const modelName = modelData.model_name;
      
      setModelType(modelType);
      setSelectedModelName(modelName);
      
      const accessoriesResponse = await axiosInstance.get('/accessories');
      const allAccessories = accessoriesResponse.data.data.accessories || [];
      
      const filteredAccessories = allAccessories.filter(accessory => {
        const typeMatches = accessory.categoryDetails?.type === modelType;
        
        if (!typeMatches) {
          return false;
        }
        
        if (accessory.applicable_models && accessory.applicable_models.length > 0) {
          return accessory.applicable_models.includes(modelId);
        }
        
        return true;
      });
      
      console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
      
      const accessoryIds = filteredAccessories.map(accessory => accessory._id);
      
      // For new booking: check ALL accessories by default
      if (!isEditMode) {
        setFormData(prev => ({
          ...prev,
          selected_accessories: accessoryIds,
          uncheckedAccessories: [] // Empty = all are checked
        }));
      }
      
      setAccessories(filteredAccessories);
    } catch (error) {
      console.error('Failed to fetch accessories:', error);
      setAccessories([]);
    }
  };

  const fetchModelColors = async (modelId) => {
    try {
      const response = await axiosInstance.get(`/colors/model/${modelId}`);
      setColors(response.data.data.colors || []);
    } catch (error) {
      console.error('Failed to fetch model colors:', error);
      setColors([]);
    }
  };

  useEffect(() => {
    const fetchFinancer = async () => {
      try {
        const response = await axiosInstance.get('/financers/providers');
        setFinancers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching financers:', error);
        const message = showError(error);
        if (message) {
          setError(message);
        }
      }
    };
    fetchFinancer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'hpa') {
      const booleanValue = value === 'true';
      setFormData((prevData) => ({ 
        ...prevData, 
        [name]: booleanValue 
      }));
      
      // When HPA changes, also update optionalComponents
      if (name === 'hpa') {
        if (!booleanValue) {
          // If HPA is disabled, remove HP/HPA headers
          const hpHeaders = getSelectedModelHeaders()
            .filter(price => price.header && price.header._id)
            .filter(price => {
              const headerKey = price.header.header_key || '';
              return headerKey.startsWith('HP') || headerKey.startsWith('HPA');
            })
            .map(price => price.header._id);
          
          setFormData(prev => ({
            ...prev,
            optionalComponents: prev.optionalComponents.filter(id => !hpHeaders.includes(id))
          }));
        }
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'customer_type') {
      fetchModels(value, formData.subdealer);
      setFormData(prev => ({
        ...prev,
        verticle_id: '',
        model_id: '',
        model_name: '',
        optionalComponents: [],
        selected_accessories: [],
        uncheckedHeaders: [], // Reset unchecked headers
        uncheckedAccessories: [],
        subsidy_amount: '', // Reset subsidy amount
        rto_code: '' // Reset RTO code
      }));
      setIsEVModel(false);
    } else if (name === 'verticle_id') {
      setFormData(prev => ({
        ...prev,
        verticle_id: value,
        model_id: '',
        model_name: '',
        optionalComponents: [],
        selected_accessories: [],
        uncheckedHeaders: [], // Reset unchecked headers
        uncheckedAccessories: [],
        subsidy_amount: '', // Reset subsidy amount
        rto_code: '' // Reset RTO code
      }));
      setIsEVModel(false);

      if (value) {
        const filtered = models.filter(model => 
          model.verticle_id === value || model.verticle === value
        );
        setFilteredModels(filtered);
      } else {
        setFilteredModels(models);
      }
    } else if (name === 'subdealer') {
      const selectedSubdealer = subdealers.find((b) => b._id === value);
      setSelectedSubdealerName(selectedSubdealer ? selectedSubdealer.name : '');
      fetchModels(formData.customer_type, value);
      setFormData(prev => ({
        ...prev,
        verticle_id: '',
        model_id: '',
        model_name: '',
        optionalComponents: [],
        selected_accessories: [],
        uncheckedHeaders: [], // Reset unchecked headers
        uncheckedAccessories: [],
        subsidy_amount: '', // Reset subsidy amount
        rto_code: '' // Reset RTO code
      }));
      setIsEVModel(false);
    } else if (name === 'model_id') {
      const selectedModel = models.find((model) => model._id === value);
      if (selectedModel) {
        // Check if model type is EV
        const isEV = selectedModel.type === 'EV';
        setIsEVModel(isEV);
        
        setFormData(prev => ({
          ...prev,
          model_name: selectedModel.model_name,
          model_id: value,
          optionalComponents: [],
          selected_accessories: [],
          uncheckedHeaders: [], // Reset unchecked headers when model changes
          uncheckedAccessories: [],
          // Only set subsidy amount if it's an EV model
          subsidy_amount: isEV ? (selectedModel.subsidy_amount || '') : '',
          rto_code: '' // Reset RTO code when model changes
        }));
        
        setModelType(selectedModel.type);
        setSelectedModelName(selectedModel.model_name);
        
        fetchAccessories(value);
        fetchModelColors(value);
        if (isEditMode) {
          fetchModelHeadersForEdit(value, headerDiscounts);
        } else {
          fetchModelHeaders(value);
        }
      }
    }
    // Clear RTO code when RTO type changes (unless it's MH and we're changing from another MH value)
    else if (name === 'rto_type' && value !== 'MH') {
      setFormData(prev => ({
        ...prev,
        rto_code: ''
      }));
    }
  };

  const handleHeaderSelection = (headerId, isChecked) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          optionalComponents: [...prev.optionalComponents, headerId],
          uncheckedHeaders: prev.uncheckedHeaders?.filter(id => id !== headerId) || []
        };
      } else {
        return {
          ...prev,
          optionalComponents: prev.optionalComponents.filter((id) => id !== headerId),
          uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId]
        };
      }
    });
  };

  const handleHeaderDiscountChange = (headerId, value) => {
    setHeaderDiscounts(prev => ({
      ...prev,
      [headerId]: value
    }));
  };

  const handleAccessorySelection = (accessoryId, isChecked) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          selected_accessories: [...prev.selected_accessories, accessoryId],
          uncheckedAccessories: prev.uncheckedAccessories?.filter(id => id !== accessoryId) || []
        };
      } else {
        return {
          ...prev,
          selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId),
          uncheckedAccessories: [...(prev.uncheckedAccessories || []), accessoryId]
        };
      }
    });
  };

  const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
    const netAmount = unitCost - (discount || 0);
    const gstRateDecimal = gstRate / 100;
    
    if (gstRateDecimal === 0) {
      return netAmount;
    }
    
    return netAmount / (1 + gstRateDecimal);
  };

  const calculateGST = (taxable, gstRate, customerType) => {
    const halfRate = gstRate / 2;
    const cgstAmount = taxable * (halfRate / 100);
    const sgstAmount = taxable * (halfRate / 100);
    return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
  };

  const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
    return taxable + cgstAmount + sgstAmount;
  };

  const getAccessoryPriceForHeader = (headerKey) => {
    // Find accessories with matching header key
    const matchingAccessories = accessories.filter(accessory => 
      accessory.categoryDetails?.header_key === headerKey
    );
    
    if (matchingAccessories.length === 0) return 0;
    
    // Get the highest price among matching accessories
    return Math.max(...matchingAccessories.map(acc => acc.price || 0));
  };

  const getCheckedHeadersForTab6 = () => {
    if (!formData.model_id) return [];

    const selectedModel = models.find((model) => model._id === formData.model_id);
    if (!selectedModel) return [];
    
    const modelPrices = selectedModel.modelPrices || [];
    
    // First apply HPA filter
    const filteredByHPA = filterHeadersByHPAStatus(modelPrices, formData.hpa);
    
    // Then filter to show only headers that should be displayed
    return filteredByHPA.filter((price) => {
      if (!price.header || !price.header._id) return false;
      
      const header = price.header;
      const headerId = header._id;
      const isMandatory = header.is_mandatory;
      
      if (isEditMode) {
        // In edit mode: show headers that are in optionalComponents (were selected in original booking)
        // AND not explicitly unchecked by the user
        const isInOptionalComponents = formData.optionalComponents.includes(headerId);
        const isExplicitlyUnchecked = formData.uncheckedHeaders && 
          formData.uncheckedHeaders.includes(headerId);
        
        return isMandatory || (isInOptionalComponents && !isExplicitlyUnchecked);
      } else {
        // In new booking mode: show headers that are not explicitly unchecked
        const isExplicitlyUnchecked = formData.uncheckedHeaders && 
          formData.uncheckedHeaders.includes(headerId);
        return isMandatory || !isExplicitlyUnchecked;
      }
    });
  };

  const calculateTotalDealAmount = () => {
    // Get headers that are currently checked (same logic as Tab 6)
    const selectedHeaders = getCheckedHeadersForTab6()
      .filter((price) => {
        const header = price.header;
        
        // Exclude summary/total headers
        const excludedHeaders = [
          'ON ROAD PRICE (A)',
          'TOTAL ONROAD+ADDON SERVICES',
          'TOTAL ONROAD + ADDON SERVICES',
          'ADDON SERVICES TOTAL (B)',
          'ACCESSORIES TOTAL',
          'ON ROAD PRICE',
          'ADDON SERVICES TOTAL',
          'ADD ON SERVICES TOTAL',
          'TOTAL AMOUNT',
          'GRAND TOTAL',
          'FINAL AMOUNT',
          'TOTAL',
          'ON-ROAD PRICE',
          'FINAL PRICE',
          'COMPLETE PRICE'
        ];
        
        const headerKey = header.header_key || '';
        return !excludedHeaders.includes(headerKey);
      });

    let totalBeforeDiscount = 0;
    let totalDiscount = 0;
    let subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
    
    console.log('Subsidy amount in calculation:', subsidyAmount);
    console.log('Is EV Model:', isEVModel);
    
    // Calculate ORIGINAL total (without any discounts)
    selectedHeaders.forEach((price) => {
      const header = price.header;
      const headerKey = header.header_key;
      const headerPrice = price.value || 0;
      
      // Get accessory price for this header (if any)
      const accessoryPrice = getAccessoryPriceForHeader(headerKey);
      
      // Use whichever is higher: header price or accessory price
      const unitPrice = Math.max(headerPrice, accessoryPrice);
      
      const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
      
      // Calculate original line total WITHOUT discount
      const taxable = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
      const { cgstAmount, sgstAmount } = calculateGST(taxable, gstRate, formData.customer_type);
      const originalLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
      console.log(`Header "${headerKey}": Header Price=${headerPrice}, Accessory Price=${accessoryPrice}, Final Price=${unitPrice}`);
      
      totalBeforeDiscount += originalLineTotal;
    });
    
    // Calculate total discounts from headerDiscounts ONLY
    selectedHeaders.forEach((price) => {
      const header = price.header;
      const headerId = header._id;
      const discountValue = headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : 0;
      const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
      if (discountAmount > 0) {
        console.log(`Discount for ${header.header_key}: ₹${discountAmount}`);
        totalDiscount += discountAmount;
      }
    });

    const totalAllDiscounts = totalDiscount;
    let finalTotal = totalBeforeDiscount - totalAllDiscounts;
    
    // Apply subsidy deduction for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
    const exShowroomHeader = selectedHeaders.find(price => 
      price.header.header_key === 'Ex-SHOWROOM(INCLUDING 5% GST)'
    );
    
    if (exShowroomHeader && subsidyAmount > 0 && isEVModel) {
      console.log(`Applying subsidy amount of ₹${subsidyAmount} to Ex-SHOWROOM header (EV Model)`);
      finalTotal -= subsidyAmount;
    }

    console.log('Total calculation:', {
      totalBeforeDiscount,
      totalDiscount,
      totalAllDiscounts,
      subsidyAmount,
      finalTotal,
      isEVModel
    });

    return {
      totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
      totalAfterDiscount: finalTotal.toFixed(2),
      totalDiscount: totalAllDiscounts.toFixed(2),
      hasDiscount: totalAllDiscounts > 0,
      subsidyAmount: subsidyAmount.toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = [
      'verticle_id',
      'model_id',
      'model_color',
      'customer_type',
      'name',
      'address',
      'mobile1',
      'aadhar_number',
      'pan_no'
    ];
    
    if (!isSubdealerUser) {
      requiredFields.push('subdealer');
    }
    
    let formErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = 'This field is required';
      }
    });

    if (!formData.verticle_id) {
      formErrors.verticle_id = 'Verticle selection is required';
    }

    if (formData.customer_type === 'B2B' && !formData.gstin) {
      formErrors.gstin = 'GSTIN is required for B2B customers';
    }

    // Add RTO code validation for MH
    if (formData.rto_type === 'MH' && !formData.rto_code) {
      formErrors.rto_code = 'RTO Code is required when RTO type is MH';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      const firstErrorField = Object.keys(formErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    console.log('=== SUBMITTING BOOKING ===');
    console.log('Current formData.optionalComponents:', formData.optionalComponents);
    console.log('Current formData.uncheckedHeaders:', formData.uncheckedHeaders);
    console.log('Current headerDiscounts:', headerDiscounts);
    console.log('Subsidy amount:', formData.subsidy_amount);
    console.log('RTO Code:', formData.rto_code);
    console.log('Is EV Model:', isEVModel);

    // For new bookings: include all headers except explicitly unchecked ones
    // For edit mode: use the existing optionalComponents
    let headersToSubmit = [];
    if (isEditMode) {
      headersToSubmit = formData.optionalComponents;
    } else {
      // Get all headers and exclude the explicitly unchecked ones
      const allHeaders = getSelectedModelHeaders()
        .filter(price => price.header && price.header._id)
        .map(price => price.header._id);
      
      headersToSubmit = allHeaders.filter(headerId => 
        !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
      );
    }

    console.log('Headers to submit:', headersToSubmit);

    // Process header discounts - only include for headers that are actually selected
    const headerDiscountsArray = Object.entries(headerDiscounts)
      .filter(([headerId, value]) => {
        const isSelected = headersToSubmit.includes(headerId);
        const hasDiscount = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
        console.log(`Header ${headerId}: isSelected=${isSelected}, hasDiscount=${hasDiscount}, value=${value}`);
        return isSelected && hasDiscount;
      })
      .map(([headerId, value]) => ({
        headerId,
        discountAmount: parseFloat(value) || 0
      }));

    console.log('Header discounts to submit:', headerDiscountsArray);

    // Process accessories - similar logic for accessories
    let accessoriesToSubmit = [];
    if (isEditMode) {
      accessoriesToSubmit = formData.selected_accessories;
    } else {
      const allAccessoryIds = accessories.map(accessory => accessory._id);
      accessoriesToSubmit = allAccessoryIds.filter(accessoryId => 
        !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
      );
    }

    const accessoriesArray = accessoriesToSubmit.map((id) => ({ id }));
    console.log('Accessories to submit:', accessoriesArray);

    // Prepare request body
    const requestBody = {
      model_id: formData.model_id,
      model_color: formData.model_color,
      customer_type: formData.customer_type,
      rto_type: formData.rto_type,
      subdealer: formData.subdealer,
      verticles: formData.verticle_id ? [formData.verticle_id] : [],
      optionalComponents: headersToSubmit, // This is the key - only checked headers
      sales_executive: formData.sales_executive,
      customer_details: {
        salutation: formData.salutation,
        name: formData.name,
        pan_no: formData.pan_no,
        dob: formData.dob,
        occupation: formData.occupation,
        address: formData.address,
        taluka: formData.taluka,
        district: formData.district,
        pincode: formData.pincode,
        mobile1: formData.mobile1,
        mobile2: formData.mobile2,
        aadhar_number: formData.aadhar_number,
        nomineeName: formData.nomineeName,
        nomineeRelation: formData.nomineeRelation,
        nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
      },
      payment: {
        type: formData.type.toUpperCase(),
        ...(formData.type.toLowerCase() === 'finance' && {
          financer_id: formData.financer_id
        })
      },
      headerDiscounts: headerDiscountsArray,
      discount: {
        type: formData.discountType,
        value: formData.value ? parseFloat(formData.value) : 0
      },
      accessories: {
        selected: accessoriesArray
      },
      hpa: formData.hpa === true,
      note: formData.note || '',
      // Include RTO code when RTO type is MH
      ...(formData.rto_type === 'MH' && formData.rto_code && { rto_code: formData.rto_code }),
      // Only include subsidy amount if it's an EV model
      ...(isEVModel && { subsidy_amount: formData.subsidy_amount ? parseFloat(formData.subsidy_amount) : 0 })
    };

    // Add conditional fields
    if (formData.customer_type === 'B2B') {
      requestBody.gstin = formData.gstin;
    }
    if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
      requestBody.rtoAmount = formData.rtoAmount;
    }

    console.log('=== FINAL REQUEST BODY ===');
    console.log('optionalComponents being sent:', requestBody.optionalComponents);
    console.log('Number of optionalComponents:', requestBody.optionalComponents.length);
    console.log('RTO Code being sent:', formData.rto_type === 'MH' ? requestBody.rto_code : 'N/A (Not MH RTO)');
    console.log('Subsidy amount being sent:', isEVModel ? requestBody.subsidy_amount : 'N/A (Not EV model)');
    console.log('Full request body:', JSON.stringify(requestBody, null, 2));

    try {
      let response;
      if (isEditMode) {
        console.log(`Updating booking with ID: ${id}`);
        response = await axiosInstance.put(`/bookings/${id}`, requestBody);
      } else {
        console.log('Creating new booking');
        response = await axiosInstance.post('/bookings', requestBody);
      }

      console.log('API Response:', response.data);

      if (response.data.success) {
        const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
        console.log('Success:', successMessage);
        await showFormSubmitToast(successMessage, () => navigate('/subdealer-all-bookings'));
        navigate('/subdealer-all-bookings');
      } else {
        console.error('Submission failed:', response.data);
        showFormSubmitError(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error response:', error.response?.data);
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dealTotals = calculateTotalDealAmount();

  return (
    <div className="form-container">
      <div className='title'>{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="form-note">
              <span className="required">*</span> Field is mandatory
            </div>

            {activeTab === 1 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Customer Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C" selected>
                          B2C
                        </option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.customer_type && <p className="error">{errors.customer_type}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Subdealer</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      {isSubdealerUser && formData.subdealer ? (
                        <CFormInput 
                          type="text" 
                          value={selectedSubdealerName}
                          readOnly
                          disabled
                        />
                      ) : (
                        <CFormSelect 
                          name="subdealer" 
                          value={formData.subdealer} 
                          onChange={handleChange}
                          disabled={isEditMode}
                        >
                          <option value="">-Select-</option>
                          {subdealers.map((subdealer) => (
                            <option key={subdealer._id} value={subdealer._id}>
                              {subdealer.name}
                            </option>
                          ))}
                        </CFormSelect>
                      )}
                    </CInputGroup>
                    {errors.subdealer && <p className="error">{errors.subdealer}</p>}
                    {isSubdealerUser && formData.subdealer && (
                      <small className="text-muted">
                        Subdealer auto-selected based on your account
                      </small>
                    )}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Verticle</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilInstitution} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="verticle_id" 
                        value={formData.verticle_id} 
                        onChange={handleChange}
                        disabled={userVerticles.length === 0}
                      >
                        <option value="">- Select Verticle -</option>
                        {userVerticles.length > 0 ? (
                          userVerticles
                            .filter(vertical => vertical.status === 'active')
                            .map((vertical) => (
                              <option key={vertical._id} value={vertical._id}>
                                {vertical.name}
                              </option>
                            ))
                        ) : (
                          <option value="" disabled>
                            No verticles assigned to your account
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
                    {userVerticles.filter(v => v.status === 'active').length === 0 && (
                      <small className="text-muted">No active verticles available. Please contact administrator.</small>
                    )}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Model Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="model_id" 
                        value={formData.model_id} 
                        onChange={handleChange} 
                        disabled={!formData.subdealer || !formData.verticle_id}
                      >
                        <option value="">- Select a Model -</option>
                        {filteredModels.length > 0 ? (
                          filteredModels.map((model) => (
                            <option key={model._id} value={model._id}>
                              {model.model_name}
                            </option>
                          ))
                        ) : formData.verticle_id ? (
                          <option value="" disabled>
                            No models available for this verticle
                          </option>
                        ) : (
                          <option value="" disabled>
                            Please select a verticle first
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
                  </div>

                  {formData.customer_type === 'B2B' && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">GST Number</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilBarcode} />
                        </CInputGroupText>
                        <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
                      </CInputGroup>
                      {errors.gstin && <p className="error">{errors.gstin}</p>}
                    </div>
                  )}

                  <div className="input-box">
                    <span className="details">RTO</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCarAlt} />
                      </CInputGroupText>
                      <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="MH">MH</option>
                        <option value="BH">BH</option>
                        <option value="CRTM">CRTM</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {/* Show RTO Code dropdown only when RTO type is MH */}
                  {formData.rto_type === 'MH' && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">RTO Code</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilCarAlt} />
                        </CInputGroupText>
                        <CFormSelect 
                          name="rto_code" 
                          value={formData.rto_code} 
                          onChange={handleChange}
                          disabled={loadingRtoCodes}
                        >
                          <option value="">-Select RTO Code-</option>
                          {loadingRtoCodes ? (
                            <option value="" disabled>Loading RTO codes...</option>
                          ) : rtoCodes.length > 0 ? (
                            rtoCodes.map((rto) => (
                              <option key={rto.id} value={rto.rto_code}>
                                {rto.rto_code} - {rto.rto_name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No RTO codes available</option>
                          )}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.rto_code && <p className="error">{errors.rto_code}</p>}
                      {loadingRtoCodes && <small className="text-muted">Loading RTO codes...</small>}
                    </div>
                  )}

                  {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">RTO Amount</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilMoney} />
                        </CInputGroupText>
                        <CFormInput type="text" name="rtoAmount" value={formData.rtoAmount} onChange={handleChange} />
                      </CInputGroup>
                      {errors.rtoAmount && <p className="error">{errors.rtoAmount}</p>}
                    </div>
                  )}

                  {/* Conditionally render Subsidy Amount field only for EV models */}
                  {isEVModel && (
                    <div className="input-box">
                      <span className="details">Subsidy Amount</span>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilMoney} />
                        </CInputGroupText>
                        <CFormInput 
                          type="text" 
                          name="subsidy_amount" 
                          value={formData.subsidy_amount} 
                          onChange={handleChange}
                          disabled={true} // Make it read-only
                          placeholder="Auto-filled for EV models"
                        />
                      </CInputGroup>
                      <small className="text-muted">Subsidy applicable for EV models only</small>
                    </div>
                  )}

                  <div className="input-box">
                    <span className="details">HPA Applicable</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilShieldAlt} />
                      </CInputGroupText>
                      <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                </div>

                {getSelectedModelHeaders().length > 0 && (
                  <div className="model-headers-section">
                    <h5>
                      Model Options 
                      {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
                        (HPA-related options hidden as HPA is disabled)
                      </span>}
                    </h5>
                    <div className="headers-list">
                      {getSelectedModelHeaders()
                        .filter((price) => price.header && price.header._id)
                        .map((price) => {
                          const header = price.header;
                          const isMandatory = header.is_mandatory;
                          const headerId = header._id;
                          const headerKey = header.header_key || '';
                          
                          // Check if this is an HPA-related header
                          const isHPAHeader = headerKey.startsWith('HP') || 
                                              headerKey.startsWith('HPA') ||
                                              headerKey.toLowerCase().includes('hypothecation') ||
                                              headerKey.toLowerCase().includes('loan');
                          
                          // Determine if header should be shown based on HPA status
                          const shouldShowHeader = formData.hpa || !isHPAHeader;
                          
                          if (!shouldShowHeader) {
                            return null; // Skip rendering this header
                          }
                          
                          let isChecked;
                          if (isEditMode) {
                            // In edit mode: checked if it was in the original booking AND not explicitly unchecked
                            const isInOptionalComponents = formData.optionalComponents.includes(headerId);
                            const isExplicitlyUnchecked = formData.uncheckedHeaders && 
                              formData.uncheckedHeaders.includes(headerId);
                            isChecked = isMandatory || (isInOptionalComponents && !isExplicitlyUnchecked);
                          } else {
                            // In new booking mode: checked if not explicitly unchecked
                            const isExplicitlyUnchecked = formData.uncheckedHeaders && 
                              formData.uncheckedHeaders.includes(headerId);
                            isChecked = isMandatory || !isExplicitlyUnchecked;
                          }

                          return (
                            <div key={headerId} className="header-item">
                              <CFormCheck
                                id={`header-${headerId}`}
                                label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : '(Optional)'} ${isHPAHeader ? '(HPA-related)' : ''}`}
                                checked={isChecked}
                                onChange={(e) => {
                                  if (!isMandatory) {
                                    const isNowChecked = e.target.checked;
                                    handleHeaderSelection(headerId, isNowChecked);
                                    
                                    // Also update headerDiscounts
                                    if (!isNowChecked) {
                                      // Remove discount when unchecking
                                      setHeaderDiscounts(prev => {
                                        const updated = { ...prev };
                                        delete updated[headerId];
                                        return updated;
                                      });
                                    }
                                  }
                                }}
                                disabled={isMandatory}
                              />
                              {isMandatory && <input type="hidden" name={`mandatory-${headerId}`} value={headerId} />}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 2 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Verticle</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilInstitution} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="verticle_id" 
                        value={formData.verticle_id} 
                        onChange={handleChange}
                        disabled={userVerticles.length === 0 || isEditMode}
                      >
                        <option value="">- Select Verticle -</option>
                        {userVerticles.length > 0 ? (
                          userVerticles
                            .filter(vertical => vertical.status === 'active')
                            .map((vertical) => (
                              <option key={vertical._id} value={vertical._id}>
                                {vertical.name}
                              </option>
                            ))
                        ) : (
                          <option value="" disabled>
                            No verticles assigned to your account
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Vehicle Model</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="model_id" 
                        value={formData.model_id} 
                        onChange={handleChange} 
                        disabled={isEditMode || !formData.verticle_id}
                      >
                        <option value="">- Select a Model -</option>
                        {filteredModels.length > 0 ? (
                          filteredModels.map((model) => (
                            <option key={model._id} value={model._id}>
                              {model.model_name}
                            </option>
                          ))
                        ) : formData.verticle_id ? (
                          <option value="" disabled>
                            No models available for this verticle
                          </option>
                        ) : (
                          <option value="" disabled>
                            Please select a verticle first
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Color</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPaint} />
                      </CInputGroupText>
                      <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {colors.map((color) => (
                          <option key={color._id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_color && <p className="error">{errors.model_color}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Booking Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
                    </CInputGroup>
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 3 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Salutation</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.salutation && <p className="error">{errors.salutation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Full Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="name" value={formData.name} onChange={handleChange} />
                    </CInputGroup>
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Address</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilHome} />
                      </CInputGroupText>
                      <CFormInput name="address" value={formData.address} onChange={handleChange} />
                    </CInputGroup>
                    {errors.address && <p className="error">{errors.address}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Taluka</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
                    </CInputGroup>
                    {errors.taluka && <p className="error">{errors.taluka}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">District</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="district" value={formData.district} onChange={handleChange} />
                    </CInputGroup>
                    {errors.district && <p className="error">{errors.district}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Pin Code</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pincode && <p className="error">{errors.pincode}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Contact Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
                    </CInputGroup>
                    {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
                  </div>

                  <div className="input-box">
                    <span className="details">Alternate Contact Number</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Aadhaar Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilFingerprint} />
                      </CInputGroupText>
                      <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
                    </CInputGroup>
                    {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">PAN Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCreditCard} />
                      </CInputGroupText>
                      <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pan_no && <p className="error">{errors.pan_no}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Birth Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </CInputGroup>
                    {errors.dob && <p className="error">{errors.dob}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Occupation</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBriefcase} />
                      </CInputGroupText>
                      <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="Student">Student</option>
                        <option value="Business">Business</option>
                        <option value="Service">Service</option>
                        <option value="Farmer">Farmer</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.occupation && <p className="error">{errors.occupation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Relationship</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPeople} />
                      </CInputGroupText>
                      <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Age</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBirthdayCake} />
                      </CInputGroupText>
                      <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
                  </div>
                </div>

                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 4 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Payment Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBank} />
                      </CInputGroupText>
                      <CFormSelect name="type" value={formData.type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="cash">Cash</option>
                        <option value="finance">Finance</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.type && <p className="error">{errors.type}</p>}
                  </div>
                  {formData.type === 'finance' && (
                    <>
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Financer Name</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilInstitution} />
                          </CInputGroupText>
                          <CFormSelect name="financer_id" value={formData.financer_id} onChange={handleChange}>
                            <option value="">-Select Financer-</option>
                            {financers.map((financer) => (
                              <option key={financer._id} value={financer._id}>
                                {financer.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.financer_id && <p className="error">{errors.financer_id}</p>}
                      </div>
                    </>
                  )}
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(3)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 5 && (
              <>
                <div>
                  <h5>Accessories for {selectedModelName} ({modelType})</h5>
                  {accessories.length > 0 ? (
                    <>
                      <p className="text-muted mb-3">
                        Showing accessories compatible with {selectedModelName} ({modelType} type)
                      </p>
                      <div className="accessories-list">
                        {accessories.map((accessory) => {
                          // For new bookings: all accessories are checked by default
                          // For edit mode: use the existing selections
                          let isChecked;
                          if (isEditMode) {
                            isChecked = formData.selected_accessories.includes(accessory._id);
                          } else {
                            const isExplicitlyUnchecked = formData.uncheckedAccessories && 
                              formData.uncheckedAccessories.includes(accessory._id);
                            isChecked = !isExplicitlyUnchecked; // Default checked
                          }

                          return (
                            <div key={accessory._id} className="accessory-item">
                              <CFormCheck
                                id={`accessory-${accessory._id}`}
                                label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
                                checked={isChecked}
                                onChange={(e) => {
                                  const isNowChecked = e.target.checked;
                                  handleAccessorySelection(accessory._id, isNowChecked);
                                }}
                              />
                              {accessory.description && (
                                <small className="text-muted d-block">{accessory.description}</small>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-info">
                      <p>No accessories available for {selectedModelName} ({modelType})</p>
                      <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
                    </div>
                  )}
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 6 && (
              <>
                <div className="user-details">
                  <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: '0 0 48%' }}>
                      <span className="details">Note</span>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilList} />
                        </CInputGroupText>
                        <CFormInput name="note" value={formData.note} onChange={handleChange} />
                      </CInputGroup>
                    </div>
                    
                    <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
                      <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
                      <div style={{ 
                        display: 'inline-block',
                        backgroundColor: '#f8f9fa',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        border: '1px solid #dee2e6',
                        minWidth: '200px',
                        textAlign: 'left'
                      }}>
                        {(() => {
                          const totals = calculateTotalDealAmount();
                          const totalBeforeDiscount = parseFloat(totals.totalBeforeDiscount);
                          const totalAfterDiscount = parseFloat(totals.totalAfterDiscount);
                          const totalDiscount = parseFloat(totals.totalDiscount);
                          const subsidyAmount = parseFloat(totals.subsidyAmount);
                          const hasDiscount = totals.hasDiscount;
                          
                          return (
                            <>
                              {/* Original Total - Always shown */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '3px'
                              }}>
                                <small>Original Total:</small>
                                <span>₹{totalBeforeDiscount.toLocaleString('en-IN')}</span>
                              </div>
                              
                              {/* Show discount if there is one */}
                              {hasDiscount && (
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '3px',
                                  color: '#dc3545',
                                  fontSize: '12px'
                                }}>
                                  <small>Discount:</small>
                                  <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              
                              {/* Show subsidy if there is one AND it's an EV model */}
                              {subsidyAmount > 0 && isEVModel && (
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '3px',
                                  color: '#0d6efd',
                                  fontSize: '12px'
                                }}>
                                  <small>EV Subsidy:</small>
                                  <span>- ₹{subsidyAmount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              
                              {/* Separator if there are any deductions */}
                              {(hasDiscount || (subsidyAmount > 0 && isEVModel)) && (
                                <div style={{ 
                                  width: '100%', 
                                  height: '1px', 
                                  backgroundColor: '#ccc', 
                                  margin: '3px 0',
                                  borderTop: '1px dashed #999'
                                }}></div>
                              )}
                              
                              {/* Final Amount - Big and bold */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '3px',
                                fontWeight: 'bold'
                              }}>
                                <span>{(hasDiscount || (subsidyAmount > 0 && isEVModel)) ? 'Final Amount:' : 'Total:'}</span>
                                <span style={{ 
                                  color: (hasDiscount || (subsidyAmount > 0 && isEVModel)) ? '#198754' : '#198754', 
                                  fontSize: '16px' 
                                }}>
                                  ₹{totalAfterDiscount.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {getCheckedHeadersForTab6().length > 0 && (
                  <div className="model-headers-section" style={{ marginTop: '20px' }}>
                    <h5>
                      Model Options ({getCheckedHeadersForTab6().length} selected)
                      {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
                        (HPA-related options hidden as HPA is disabled)
                      </span>}
                    </h5>
                    
                    <div className="table-responsive">
                      <CTable striped hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Particulars</CTableHeaderCell>
                            <CTableHeaderCell>HSN</CTableHeaderCell>
                            <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
                            <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
                            <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
                            <CTableHeaderCell>CGST %</CTableHeaderCell>
                            <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
                            <CTableHeaderCell>SGST %</CTableHeaderCell>
                            <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
                            <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {getCheckedHeadersForTab6().map((price) => {
                            const header = price.header;
                            const isMandatory = header.is_mandatory;
                            const isDiscountAllowed = header.is_discount;
                            
                            const headerId = header._id || header.id;
                            const headerKey = header.header_key || '';
                            
                            // Check if this is an HPA-related header
                            const isHPAHeader = headerKey.startsWith('HP') || 
                                                headerKey.startsWith('HPA') ||
                                                headerKey.toLowerCase().includes('hypothecation') ||
                                                headerKey.toLowerCase().includes('loan');
                            
                            // Determine if header should be shown based on HPA status
                            const shouldShowHeader = formData.hpa || !isHPAHeader;
                            
                            if (!shouldShowHeader) {
                              return null; // Skip rendering this header
                            }
                            
                            // Check if this header is currently checked
                            // Use the same logic as in getCheckedHeadersForTab6()
                            const isExplicitlyUnchecked = formData.uncheckedHeaders && 
                              formData.uncheckedHeaders.includes(headerId);
                            const isChecked = isMandatory || !isExplicitlyUnchecked;

                            const discountValue = headerDiscounts[headerId] !== undefined 
                              ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
                              : '';
                            
                            const headerPrice = price.value || 0;
                            
                            // Get accessory price for this header (if any)
                            const accessoryPrice = getAccessoryPriceForHeader(headerKey);
                            
                            // Use whichever is higher: header price or accessory price
                            const unitPrice = Math.max(headerPrice, accessoryPrice);
                            
                            const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                            
                            const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
                            const hsnCode = header.metadata?.hsn_code || 'N/A';
                            
                            const taxable = calculateTaxableAmount(unitPrice, discountAmount, gstRate, formData.customer_type);
                            
                            const { cgstAmount, sgstAmount, cgstRate, sgstRate } = calculateGST(taxable, gstRate, formData.customer_type);
                            
                            // Apply subsidy deduction for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
                            let lineTotal;
                            if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel) {
                              const subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
                              const calculatedLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
                              // Subtract subsidy amount from line total
                              lineTotal = calculatedLineTotal - subsidyAmount;
                              console.log(`Applying subsidy of ₹${subsidyAmount} to ${headerKey}. Original: ₹${calculatedLineTotal}, After subsidy: ₹${lineTotal}`);
                            } else {
                              lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
                            }

                            return (
                              <CTableRow key={headerId}>
                                <CTableDataCell>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CFormCheck
                                      id={`tab6-header-${headerId}`}
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (!isMandatory) {
                                          const isNowChecked = e.target.checked;
                                          handleHeaderSelection(headerId, isNowChecked);
                                          
                                          // Also update headerDiscounts
                                          if (!isNowChecked) {
                                            // Remove discount when unchecking
                                            setHeaderDiscounts(prev => {
                                              const updated = { ...prev };
                                              delete updated[headerId];
                                              return updated;
                                            });
                                          } else {
                                            // Initialize discount when checking
                                            setHeaderDiscounts(prev => {
                                              if (prev[headerId] === undefined) {
                                                return { ...prev, [headerId]: '' };
                                              }
                                              return prev;
                                            });
                                          }
                                        }
                                      }}
                                      disabled={isMandatory}
                                      style={{ marginRight: '10px' }}
                                    />
                                    <span>
                                      {header.header_key} {isMandatory ? '(Mandatory)' : '(Optional)'}
                                      {isHPAHeader && ' (HPA-related)'}
                                      {headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel && ' (Subsidy applied)'}
                                      {accessoryPrice > headerPrice && (
                                        <small className="text-muted d-block">
                                          (Using accessory price: ₹{accessoryPrice})
                                        </small>
                                      )}
                                    </span>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell>{hsnCode}</CTableDataCell>
                                <CTableDataCell>₹{unitPrice.toFixed(2)}</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter discount"
                                    value={discountValue}
                                    onChange={(e) => handleHeaderDiscountChange(headerId, e.target.value)}
                                    disabled={!isDiscountAllowed}
                                    style={{ width: '150px' }}
                                  />
                                  {errors[`discount_${headerId}`] && (
                                    <small className="text-danger d-block">{errors[`discount_${headerId}`]}</small>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
                                <CTableDataCell>{cgstRate.toFixed(2)}%</CTableDataCell>
                                <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
                                <CTableDataCell>{sgstRate.toFixed(2)}%</CTableDataCell>
                                <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
                                <CTableDataCell>
                                  <strong>₹{lineTotal.toFixed(2)}</strong>
                                  {headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel && (
                                    <div style={{ fontSize: '11px', color: '#666' }}>
                                      (After ₹{formData.subsidy_amount} EV subsidy)
                                    </div>
                                  )}
                                </CTableDataCell>
                              </CTableRow>
                            );
                          })}
                        </CTableBody>
                      </CTable>
                    </div>
                  </div>
                )}

                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
                    Back
                  </button>
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubdealerNewBooking;