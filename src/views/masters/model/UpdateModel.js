// import axiosInstance from '../../../axiosInstance';
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
// import '../../../css/form.css';
// import FormButtons from '../../../utils/FormButtons';
// import { CFormInput, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
// import { cilBike, cilDollar, cilTag } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';

// const UpdateModel = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const branchId = queryParams.get('branch_id') || '';
//   const [formData, setFormData] = useState({
//     model_name: '',
//     model_discount: 0,
//     verticle_id: '',
//     prices: []
//   });
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Fetch user profile and model details
//     const initializeData = async () => {
//       await fetchUserProfile();
//       await fetchModelDetails();
//     };
//     initializeData();
//   }, [id, branchId]);

//   // Fetch user profile to get role and assigned verticles
//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;

//       const role = userData.roles?.[0]?.name || '';
//       setUserRole(role);
      
//       const userVerticleIds = userData.verticles || [];
//       await fetchAllVerticles(userVerticleIds, role);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   // Fetch all verticles and filter based on user's role and verticles
//   const fetchAllVerticles = async (userVerticleIds, role) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       // Filter verticles based on role
//       const filteredVerticles = role === 'SUPERADMIN' 
//         ? verticlesData 
//         : verticlesData.filter(verticle => 
//             userVerticleIds.includes(verticle._id)
//           );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       console.error('Error fetching verticles:', error);
//     }
//   };

//   const fetchModelDetails = async () => {
//     try {
//       const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
//       const model = res.data.data.model;
      
//       // Extract verticle_id from model data
//       const verticleId = model.verticle_id || model.verticle || '';
      
//       setFormData({
//         model_name: model.model_name,
//         model_discount: model.model_discount || 0,
//         verticle_id: verticleId,
//         prices: model.prices
//       });
//     } catch (err) {
//       showError('Failed to load model details');
//     }
//   };

//   const handlePriceChange = (headerId, newValue) => {
//     setFormData((prev) => ({
//       ...prev,
//       prices: prev.prices.map((price) => (price.header_id === headerId ? { ...price, value: Number(newValue) } : price))
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate verticle field
//     let formErrors = {};
//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle is required';
//     }
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }
    
//     try {
//       const payload = {
//         model_name: formData.model_name,
//         model_discount: Number(formData.model_discount),
//         verticle_id: formData.verticle_id,
//         prices: formData.prices.map(({ header_id, value }) => ({
//           header_id,
//           value,
//           branch_id: branchId
//         }))
//       };

//       console.log('Payload being sent:', payload);
      
//       await axiosInstance.put(`/models/${id}/prices`, payload);
//       showFormSubmitToast('Model updated successfully!');
//       navigate('/model/model-list');
//     } catch (err) {
//       console.error(err);
//       showError(err.response?.data?.message || 'Failed to update model');
//     }
//   };

//   const handleCancel = () => {
//     navigate('/model/model-list');
//   };

//   return (
//     <div className="form-container">
//       <div className="title">Edit Model</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Model name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="model_name" value={formData.model_name} onChange={handleChange} readOnly disabled />
//                 </CInputGroup>
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Verticle</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilTag} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="verticle_id"
//                     value={formData.verticle_id}
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select Verticle-</option>
//                     {userVerticles
//                       .filter(vertical => vertical.status === 'active')
//                       .map((vertical) => (
//                         <option key={vertical._id} value={vertical._id}>
//                           {vertical.name}
//                         </option>
//                       ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                 {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                   <small className="text-muted">No active verticles available.</small>
//                 )}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch ID</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput type="text" value={branchId} readOnly disabled />
//                 </CInputGroup>
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Discount</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput type="number" name="model_discount" value={formData.model_discount} onChange={handleChange} />
//                 </CInputGroup>
//               </div>
              
//               {formData.prices.map((price, index) => (
//                 <div className="input-box" key={price.header_id}>
//                   <div className="details-container">
//                     <span className="details">{price.header_key}</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilBike} />
//                     </CInputGroupText>
//                     <CFormInput type="number" value={price.value} onChange={(e) => handlePriceChange(price.header_id, e.target.value)} />
//                   </CInputGroup>
//                 </div>
//               ))}
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateModel; 







// import axiosInstance from '../../../axiosInstance';
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
// import '../../../css/form.css';
// import FormButtons from '../../../utils/FormButtons';
// import { CFormInput, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
// import { cilBike, cilDollar, cilTag } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';

// const UpdateModel = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const branchId = queryParams.get('branch_id') || '';
//   const [formData, setFormData] = useState({
//     model_name: '',
//     model_discount: 0,
//     verticle_id: '',
//     type: '', // Added type field if needed from your AddModel
//     prices: []
//   });
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Fetch user profile and model details
//     const initializeData = async () => {
//       await fetchUserProfile();
//       await fetchModelDetails();
//     };
//     initializeData();
//   }, [id, branchId]);

//   // Fetch user profile to get role and assigned verticles
//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;

//       const role = userData.roles?.[0]?.name || '';
//       setUserRole(role);
      
//       const userVerticleIds = userData.verticles || [];
//       await fetchAllVerticles(userVerticleIds, role);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   // Fetch all verticles and filter based on user's role and verticles
//   const fetchAllVerticles = async (userVerticleIds, role) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       // Filter verticles based on role
//       const filteredVerticles = role === 'SUPERADMIN' 
//         ? verticlesData 
//         : verticlesData.filter(verticle => 
//             userVerticleIds.includes(verticle._id)
//           );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       console.error('Error fetching verticles:', error);
//     }
//   };

//   const fetchModelDetails = async () => {
//     try {
//       const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
//       const model = res.data.data.model;
      
//       // Extract verticle_id from model data
//       const verticleId = model.verticle_id || model.verticle || '';
      
//       setFormData({
//         model_name: model.model_name,
//         model_discount: model.model_discount || 0,
//         verticle_id: verticleId,
//         type: model.type || '', // Add type if available
//         prices: model.prices
//       });
//     } catch (err) {
//       showError('Failed to load model details');
//     }
//   };

//   const handlePriceChange = (headerId, newValue) => {
//     setFormData((prev) => ({
//       ...prev,
//       prices: prev.prices.map((price) => (price.header_id === headerId ? { ...price, value: Number(newValue) } : price))
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     let formErrors = {};
//     if (!formData.model_name.trim()) {
//       formErrors.model_name = 'Model name is required';
//     }
//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle is required';
//     }
//     if (!formData.type) {
//       formErrors.type = 'Type is required';
//     }
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }
    
//     try {
//       const payload = {
//         model_name: formData.model_name.trim(),
//         model_discount: Number(formData.model_discount),
//         verticle_id: formData.verticle_id,
//         type: formData.type, // Include type if needed
//         prices: formData.prices.map(({ header_id, value }) => ({
//           header_id,
//           value,
//           branch_id: branchId
//         }))
//       };

//       console.log('Payload being sent:', payload);
      
//       await axiosInstance.put(`/models/${id}/prices`, payload);
//       showFormSubmitToast('Model updated successfully!');
//       navigate('/model/model-list');
//     } catch (err) {
//       console.error(err);
//       showError(err.response?.data?.message || 'Failed to update model');
//     }
//   };

//   const handleCancel = () => {
//     navigate('/model/model-list');
//   };

//   return (
//     <div className="form-container">
//       <div className="title">Edit Model</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Model name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="model_name" 
//                     value={formData.model_name} 
//                     onChange={handleChange} 
//                     // Removed readOnly and disabled
//                   />
//                 </CInputGroup>
//                 {errors.model_name && <p className="error">{errors.model_name}</p>}
//               </div>
              
//               {/* Add Type field if needed (similar to AddModel) */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="type"
//                     value={formData.type}
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     <option value="EV">EV</option>
//                     <option value="ICE">ICE</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.type && <p className="error">{errors.type}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Verticle</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilTag} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="verticle_id"
//                     value={formData.verticle_id}
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select Verticle-</option>
//                     {userVerticles
//                       .filter(vertical => vertical.status === 'active')
//                       .map((vertical) => (
//                         <option key={vertical._id} value={vertical._id}>
//                           {vertical.name}
//                         </option>
//                       ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                 {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                   <small className="text-muted">No active verticles available.</small>
//                 )}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch ID</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput type="text" value={branchId} readOnly disabled />
//                 </CInputGroup>
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Discount</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput type="number" name="model_discount" value={formData.model_discount} onChange={handleChange} />
//                 </CInputGroup>
//               </div>
              
//               {formData.prices.map((price, index) => (
//                 <div className="input-box" key={price.header_id}>
//                   <div className="details-container">
//                     <span className="details">{price.header_key}</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilBike} />
//                     </CInputGroupText>
//                     <CFormInput type="number" value={price.value} onChange={(e) => handlePriceChange(price.header_id, e.target.value)} />
//                   </CInputGroup>
//                 </div>
//               ))}
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateModel;






// import axiosInstance from '../../../axiosInstance';
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
// import '../../../css/form.css';
// import FormButtons from '../../../utils/FormButtons';
// import { CFormInput, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
// import { cilBike, cilDollar, cilTag } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';

// const UpdateModel = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const branchId = queryParams.get('branch_id') || '';
//   const [formData, setFormData] = useState({
//     model_name: '',
//     model_discount: 0,
//     subsidy_amount: 0, // Added subsidy_amount field
//     verticle_id: '',
//     type: '',
//     prices: []
//   });
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [userRole, setUserRole] = useState('');

//   useEffect(() => {
//     // Fetch user profile and model details
//     const initializeData = async () => {
//       await fetchUserProfile();
//       await fetchModelDetails();
//     };
//     initializeData();
//   }, [id, branchId]);

//   // Fetch user profile to get role and assigned verticles
//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;

//       const role = userData.roles?.[0]?.name || '';
//       setUserRole(role);
      
//       const userVerticleIds = userData.verticles || [];
//       await fetchAllVerticles(userVerticleIds, role);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   // Fetch all verticles and filter based on user's role and verticles
//   const fetchAllVerticles = async (userVerticleIds, role) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       // Filter verticles based on role
//       const filteredVerticles = role === 'SUPERADMIN' 
//         ? verticlesData 
//         : verticlesData.filter(verticle => 
//             userVerticleIds.includes(verticle._id)
//           );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       console.error('Error fetching verticles:', error);
//     }
//   };

//   const fetchModelDetails = async () => {
//     try {
//       const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
//       const model = res.data.data.model;
      
//       // Extract subsidy_amount from model data
//       const subsidyAmount = model.subsidy_amount || 0;
      
//       // Extract verticle_id from model data
//       const verticleId = model.verticle_id || model.verticle || '';
      
//       setFormData({
//         model_name: model.model_name,
//         model_discount: model.model_discount || 0,
//         subsidy_amount: subsidyAmount, // Set subsidy amount
//         verticle_id: verticleId,
//         type: model.type || '',
//         prices: model.prices
//       });
//     } catch (err) {
//       showError('Failed to load model details');
//     }
//   };

//   const handlePriceChange = (headerId, newValue) => {
//     setFormData((prev) => ({
//       ...prev,
//       prices: prev.prices.map((price) => (price.header_id === headerId ? { ...price, value: Number(newValue) } : price))
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     let formErrors = {};
//     if (!formData.model_name.trim()) {
//       formErrors.model_name = 'Model name is required';
//     }
//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle is required';
//     }
//     if (!formData.type) {
//       formErrors.type = 'Type is required';
//     }
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }
    
//     try {
//       const payload = {
//         model_name: formData.model_name.trim(),
//         model_discount: Number(formData.model_discount),
//         subsidy_amount: Number(formData.subsidy_amount), // Include subsidy amount
//         verticle_id: formData.verticle_id,
//         type: formData.type,
//         prices: formData.prices.map(({ header_id, value }) => ({
//           header_id,
//           value,
//           branch_id: branchId
//         }))
//       };

//       console.log('Payload being sent:', payload);
      
//       await axiosInstance.put(`/models/${id}/prices`, payload);
//       showFormSubmitToast('Model updated successfully!');
//       navigate('/model/model-list');
//     } catch (err) {
//       console.error(err);
//       showError(err.response?.data?.message || 'Failed to update model');
//     }
//   };

//   const handleCancel = () => {
//     navigate('/model/model-list');
//   };

//   return (
//     <div className="form-container">
//       <div className="title">Edit Model</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Model name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="model_name" 
//                     value={formData.model_name} 
//                     onChange={handleChange} 
//                     // Removed readOnly and disabled
//                   />
//                 </CInputGroup>
//                 {errors.model_name && <p className="error">{errors.model_name}</p>}
//               </div>
              
//               {/* Type field */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="type"
//                     value={formData.type}
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     <option value="EV">EV</option>
//                     <option value="ICE">ICE</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.type && <p className="error">{errors.type}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Verticle</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilTag} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="verticle_id"
//                     value={formData.verticle_id}
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select Verticle-</option>
//                     {userVerticles
//                       .filter(vertical => vertical.status === 'active')
//                       .map((vertical) => (
//                         <option key={vertical._id} value={vertical._id}>
//                           {vertical.name}
//                         </option>
//                       ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                 {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                   <small className="text-muted">No active verticles available.</small>
//                 )}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch ID</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput type="text" value={branchId} readOnly disabled />
//                 </CInputGroup>
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Discount</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="number" 
//                     name="model_discount" 
//                     value={formData.model_discount} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//               </div>
              
//               {/* Added Subsidy field */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Subsidy Amount</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="number" 
//                     name="subsidy_amount" 
//                     value={formData.subsidy_amount} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//               </div>
              
//               {formData.prices.map((price, index) => (
//                 <div className="input-box" key={price.header_id}>
//                   <div className="details-container">
//                     <span className="details">{price.header_key}</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilBike} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       value={price.value} 
//                       onChange={(e) => handlePriceChange(price.header_id, e.target.value)} 
//                     />
//                   </CInputGroup>
//                 </div>
//               ))}
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateModel;










// import axiosInstance from '../../../axiosInstance';
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
// import '../../../css/form.css';
// import FormButtons from '../../../utils/FormButtons';
// import { CFormInput, CInputGroup, CInputGroupText, CFormSelect, CAlert } from '@coreui/react';
// import { cilBike, cilDollar, cilTag } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';

// const UpdateModel = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const branchId = queryParams.get('branch_id') || '';
//   const [formData, setFormData] = useState({
//     model_name: '',
//     model_discount: 0,
//     subsidy_amount: 0,
//     verticle_id: '',
//     type: '',
//     prices: []
//   });
//   const [allVerticles, setAllVerticles] = useState([]);
//   const [userVerticles, setUserVerticles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [userRole, setUserRole] = useState('');
//   const [submitError, setSubmitError] = useState(''); // For form-level errors
//   const [priceErrors, setPriceErrors] = useState({}); // For price-specific errors

//   useEffect(() => {
//     const initializeData = async () => {
//       await fetchUserProfile();
//       await fetchModelDetails();
//     };
//     initializeData();
//   }, [id, branchId]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get('/auth/me');
//       const userData = response.data.data;

//       const role = userData.roles?.[0]?.name || '';
//       setUserRole(role);
      
//       const userVerticleIds = userData.verticles || [];
//       await fetchAllVerticles(userVerticleIds, role);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       showError('Failed to load user profile');
//     }
//   };

//   const fetchAllVerticles = async (userVerticleIds, role) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       const filteredVerticles = role === 'SUPERADMIN' 
//         ? verticlesData 
//         : verticlesData.filter(verticle => 
//             userVerticleIds.includes(verticle._id)
//           );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       console.error('Error fetching verticles:', error);
//       showError('Failed to load verticles');
//     }
//   };

//   const fetchModelDetails = async () => {
//     try {
//       const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
//       const model = res.data.data.model;
      
//       const subsidyAmount = model.subsidy_amount || 0;
//       const verticleId = model.verticle_id || model.verticle || '';
      
//       setFormData({
//         model_name: model.model_name,
//         model_discount: model.model_discount || 0,
//         subsidy_amount: subsidyAmount,
//         verticle_id: verticleId,
//         type: model.type || '',
//         prices: model.prices
//       });
      
//       // Clear any previous errors
//       setSubmitError('');
//       setPriceErrors({});
//     } catch (err) {
//       console.error('Error fetching model details:', err);
//       if (err.response?.data?.message) {
//         showError(err.response.data.message);
//       } else if (err.response?.data?.error) {
//         showError(err.response.data.error);
//       } else {
//         showError('Failed to load model details');
//       }
//     }
//   };

//   const handlePriceChange = (headerId, newValue) => {
//     setFormData((prev) => ({
//       ...prev,
//       prices: prev.prices.map((price) => 
//         price.header_id === headerId ? { ...price, value: Number(newValue) } : price
//       )
//     }));
    
//     // Clear error for this specific price when user makes a change
//     if (priceErrors[headerId]) {
//       setPriceErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[headerId];
//         return newErrors;
//       });
//     }
    
//     // Clear submit error when any price changes
//     if (submitError) {
//       setSubmitError('');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    
//     // Clear submit error when any field changes
//     if (submitError) {
//       setSubmitError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Clear previous errors
//     setSubmitError('');
//     setPriceErrors({});
    
//     // Validate required fields
//     let formErrors = {};
//     if (!formData.model_name.trim()) {
//       formErrors.model_name = 'Model name is required';
//     }
//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle is required';
//     }
//     if (!formData.type) {
//       formErrors.type = 'Type is required';
//     }
    
//     // Validate that all price values are numbers
//     let hasInvalidPrice = false;
//     const newPriceErrors = {};
    
//     formData.prices.forEach((price, index) => {
//       if (isNaN(price.value) || price.value === '' || price.value === null) {
//         hasInvalidPrice = true;
//         newPriceErrors[price.header_id] = `${price.header_key} must be a valid number`;
//       }
//     });
    
//     if (hasInvalidPrice) {
//       setPriceErrors(newPriceErrors);
//     }
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }
    
//     if (hasInvalidPrice) {
//       return;
//     }
    
//     try {
//       const payload = {
//         model_name: formData.model_name.trim(),
//         model_discount: Number(formData.model_discount),
//         subsidy_amount: Number(formData.subsidy_amount),
//         verticle_id: formData.verticle_id,
//         type: formData.type,
//         prices: formData.prices.map(({ header_id, value }) => ({
//           header_id,
//           value,
//           branch_id: branchId
//         }))
//       };

//       console.log('Payload being sent:', payload);
      
//       const response = await axiosInstance.put(`/models/${id}/prices`, payload);
      
//       if (response.data.success) {
//         showFormSubmitToast('Model updated successfully!');
//         navigate('/model/model-list');
//       } else {
//         // Handle unsuccessful response
//         if (response.data.message) {
//           setSubmitError(response.data.message);
//           showError(response.data.message);
//         } else {
//           setSubmitError('Failed to update model');
//           showError('Failed to update model');
//         }
//       }
//     } catch (err) {
//       console.error('Error updating model:', err);
      
//       // Handle the specific error about price validation
//       if (err.response && err.response.data) {
//         const errorData = err.response.data;
        
//         // Check for the specific price validation error
//         if (errorData.error && errorData.error.includes('Price at index')) {
//           // Parse the error message to identify which price has the issue
//           const errorMessage = errorData.error;
//           setSubmitError(errorMessage);
          
//           // Try to extract which price index has the issue
//           const match = errorMessage.match(/Price at index (\d+)/);
//           if (match && match[1]) {
//             const index = parseInt(match[1], 10);
//             if (formData.prices[index]) {
//               const priceWithError = formData.prices[index];
//               setPriceErrors({
//                 [priceWithError.header_id]: `This price must have either branch_id or subdealer_id`
//               });
//             }
//           }
          
//           showError(errorMessage);
//         } else if (errorData.message) {
//           setSubmitError(errorData.message);
//           showError(errorData.message);
//         } else if (errorData.error) {
//           setSubmitError(errorData.error);
//           showError(errorData.error);
//         } else {
//           setSubmitError('Failed to update model');
//           showError('Failed to update model');
//         }
//       } else if (err.message) {
//         setSubmitError(err.message);
//         showError(err.message);
//       } else {
//         setSubmitError('Failed to update model');
//         showError('Failed to update model');
//       }
//     }
//   };

//   const handleCancel = () => {
//     navigate('/model/model-list');
//   };

//   return (
//     <div className="form-container">
//       <div className="title">Edit Model</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             {/* Display submit error if any */}
//             {submitError && (
//               <CAlert color="danger" className="mb-4">
//                 <strong>Error:</strong> {submitError}
//               </CAlert>
//             )}
            
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Model name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="model_name" 
//                     value={formData.model_name} 
//                     onChange={handleChange} 
//                     className={errors.model_name ? 'is-invalid' : ''}
//                   />
//                 </CInputGroup>
//                 {errors.model_name && <p className="error">{errors.model_name}</p>}
//               </div>
              
//               {/* Type field */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="type"
//                     value={formData.type}
//                     onChange={handleChange}
//                     className={errors.type ? 'is-invalid' : ''}
//                   >
//                     <option value="">-Select-</option>
//                     <option value="EV">EV</option>
//                     <option value="ICE">ICE</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.type && <p className="error">{errors.type}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Verticle</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilTag} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="verticle_id"
//                     value={formData.verticle_id}
//                     onChange={handleChange}
//                     className={errors.verticle_id ? 'is-invalid' : ''}
//                   >
//                     <option value="">-Select Verticle-</option>
//                     {userVerticles
//                       .filter(vertical => vertical.status === 'active')
//                       .map((vertical) => (
//                         <option key={vertical._id} value={vertical._id}>
//                           {vertical.name}
//                         </option>
//                       ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                 {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                   <small className="text-muted">No active verticles available.</small>
//                 )}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch ID</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBike} />
//                   </CInputGroupText>
//                   <CFormInput type="text" value={branchId} readOnly disabled />
//                 </CInputGroup>
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Discount</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="number" 
//                     name="model_discount" 
//                     value={formData.model_discount} 
//                     onChange={handleChange} 
//                     min="0"
//                     step="0.01"
//                   />
//                 </CInputGroup>
//               </div>
              
//               {/* Added Subsidy field */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Subsidy Amount</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="number" 
//                     name="subsidy_amount" 
//                     value={formData.subsidy_amount} 
//                     onChange={handleChange} 
//                     min="0"
//                     step="0.01"
//                   />
//                 </CInputGroup>
//               </div>
              
//               {formData.prices.map((price, index) => (
//                 <div className="input-box" key={price.header_id}>
//                   <div className="details-container">
//                     <span className="details">{price.header_key}</span>
//                     {priceErrors[price.header_id] && (
//                       <span className="required ms-2" title={priceErrors[price.header_id]}>⚠️</span>
//                     )}
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilBike} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       value={price.value} 
//                       onChange={(e) => handlePriceChange(price.header_id, e.target.value)} 
//                       min="0"
//                       step="0.01"
//                       className={priceErrors[price.header_id] ? 'is-invalid' : ''}
//                     />
//                   </CInputGroup>
//                   {priceErrors[price.header_id] && (
//                     <p className="error">{priceErrors[price.header_id]}</p>
//                   )}
//                   {/* <small className="text-muted">
//                     Price for {branchId ? `branch: ${branchId}` : 'selected location'}
//                   </small> */}
//                 </div>
//               ))}
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateModel;







import axiosInstance from '../../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import '../../../css/form.css';
import FormButtons from '../../../utils/FormButtons';
import { CFormInput, CInputGroup, CInputGroupText, CFormSelect, CAlert } from '@coreui/react';
import { cilBike, cilDollar, cilTag } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const UpdateModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const branchId = queryParams.get('branch_id') || '';
  const [formData, setFormData] = useState({
    model_name: '',
    model_discount: 0,
    subsidy_amount: 0,
    verticle_id: '',
    type: '',
    prices: []
  });
  const [branchInfo, setBranchInfo] = useState({
    id: '',
    name: '',
    city: ''
  });
  const [allVerticles, setAllVerticles] = useState([]);
  const [userVerticles, setUserVerticles] = useState([]);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState('');
  const [submitError, setSubmitError] = useState(''); // For form-level errors
  const [priceErrors, setPriceErrors] = useState({}); // For price-specific errors

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserProfile();
      await fetchModelDetails();
    };
    initializeData();
  }, [id, branchId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      const userData = response.data.data;

      const role = userData.roles?.[0]?.name || '';
      setUserRole(role);
      
      const userVerticleIds = userData.verticles || [];
      await fetchAllVerticles(userVerticleIds, role);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      showError('Failed to load user profile');
    }
  };

  const fetchAllVerticles = async (userVerticleIds, role) => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setAllVerticles(verticlesData);
      
      const filteredVerticles = role === 'SUPERADMIN' 
        ? verticlesData 
        : verticlesData.filter(verticle => 
            userVerticleIds.includes(verticle._id)
          );
      setUserVerticles(filteredVerticles);
    } catch (error) {
      console.error('Error fetching verticles:', error);
      showError('Failed to load verticles');
    }
  };

  const fetchModelDetails = async () => {
    try {
      const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
      const model = res.data.data.model;
      
      const subsidyAmount = model.subsidy_amount || 0;
      const verticleId = model.verticle_id || model.verticle || '';
      
      // Extract branch info from the first price (all prices have same branch)
      const firstPrice = model.prices[0];
      if (firstPrice) {
        setBranchInfo({
          id: firstPrice.branch_id || branchId,
          name: firstPrice.branch_name || 'Unknown Branch',
          city: firstPrice.branch_city || ''
        });
      }
      
      setFormData({
        model_name: model.model_name,
        model_discount: model.model_discount || 0,
        subsidy_amount: subsidyAmount,
        verticle_id: verticleId,
        type: model.type || '',
        prices: model.prices
      });
      
      // Clear any previous errors
      setSubmitError('');
      setPriceErrors({});
    } catch (err) {
      console.error('Error fetching model details:', err);
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else if (err.response?.data?.error) {
        showError(err.response.data.error);
      } else {
        showError('Failed to load model details');
      }
    }
  };

  const handlePriceChange = (headerId, newValue) => {
    setFormData((prev) => ({
      ...prev,
      prices: prev.prices.map((price) => 
        price.header_id === headerId ? { ...price, value: Number(newValue) } : price
      )
    }));
    
    // Clear error for this specific price when user makes a change
    if (priceErrors[headerId]) {
      setPriceErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[headerId];
        return newErrors;
      });
    }
    
    // Clear submit error when any price changes
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    
    // Clear submit error when any field changes
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setSubmitError('');
    setPriceErrors({});
    
    // Validate required fields
    let formErrors = {};
    if (!formData.model_name.trim()) {
      formErrors.model_name = 'Model name is required';
    }
    if (!formData.verticle_id) {
      formErrors.verticle_id = 'Verticle is required';
    }
    if (!formData.type) {
      formErrors.type = 'Type is required';
    }
    
    // Validate that all price values are numbers
    let hasInvalidPrice = false;
    const newPriceErrors = {};
    
    formData.prices.forEach((price, index) => {
      if (isNaN(price.value) || price.value === '' || price.value === null) {
        hasInvalidPrice = true;
        newPriceErrors[price.header_id] = `${price.header_key} must be a valid number`;
      }
    });
    
    if (hasInvalidPrice) {
      setPriceErrors(newPriceErrors);
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    if (hasInvalidPrice) {
      return;
    }
    
    try {
      const payload = {
        model_name: formData.model_name.trim(),
        model_discount: Number(formData.model_discount),
        subsidy_amount: Number(formData.subsidy_amount),
        verticle_id: formData.verticle_id,
        type: formData.type,
        prices: formData.prices.map(({ header_id, value }) => ({
          header_id,
          value,
          branch_id: branchId
        }))
      };

      console.log('Payload being sent:', payload);
      
      const response = await axiosInstance.put(`/models/${id}/prices`, payload);
      
      // Check for success based on the actual API response structure
      if (response.data.status === 'success' || response.status === 200) {
        showFormSubmitToast('Model updated successfully!');
        navigate('/model/model-list');
      } else {
        // Handle unsuccessful response
        if (response.data.message) {
          setSubmitError(response.data.message);
          showError(response.data.message);
        } else {
          setSubmitError('Failed to update model');
          showError('Failed to update model');
        }
      }
    } catch (err) {
      console.error('Error updating model:', err);
      
      // Handle error response from API
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        // Check for error field in the response
        if (errorData.error) {
          const errorMessage = errorData.error;
          setSubmitError(errorMessage);
          showError(errorMessage);
        }
        // Check for message field
        else if (errorData.message) {
          const errorMessage = errorData.message;
          setSubmitError(errorMessage);
          showError(errorMessage);
        }
        // Handle array of errors if present
        else if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessage = errorData.errors.join(', ');
          setSubmitError(errorMessage);
          showError(errorMessage);
        }
        // Handle the specific price validation error
        else if (errorData.error && errorData.error.includes('Price at index')) {
          // Parse the error message to identify which price has the issue
          const errorMessage = errorData.error;
          setSubmitError(errorMessage);
          
          // Try to extract which price index has the issue
          const match = errorMessage.match(/Price at index (\d+)/);
          if (match && match[1]) {
            const index = parseInt(match[1], 10);
            if (formData.prices[index]) {
              const priceWithError = formData.prices[index];
              setPriceErrors({
                [priceWithError.header_id]: `This price must have either branch_id or subdealer_id`
              });
            }
          }
          
          showError(errorMessage);
        }
        else {
          // Fallback error message
          const defaultMessage = 'Failed to update model';
          setSubmitError(defaultMessage);
          showError(defaultMessage);
        }
      } else if (err.message) {
        setSubmitError(err.message);
        showError(err.message);
      } else {
        setSubmitError('Failed to update model');
        showError('Failed to update model');
      }
    }
  };

  const handleCancel = () => {
    navigate('/model/model-list');
  };

  return (
    <div className="form-container">
      <div className="title">Edit Model</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {/* Display submit error if any */}
            {submitError && (
              <CAlert color="danger" className="mb-4">
                <strong>Error:</strong> {submitError}
              </CAlert>
            )}
            
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Model name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="model_name" 
                    value={formData.model_name} 
                    onChange={handleChange} 
                    className={errors.model_name ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.model_name && <p className="error">{errors.model_name}</p>}
              </div>
              
              {/* Type field */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={errors.type ? 'is-invalid' : ''}
                  >
                    <option value="">-Select-</option>
                    <option value="EV">EV</option>
                    <option value="ICE">ICE</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.type && <p className="error">{errors.type}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Verticle</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="verticle_id"
                    value={formData.verticle_id}
                    onChange={handleChange}
                    className={errors.verticle_id ? 'is-invalid' : ''}
                  >
                    <option value="">-Select Verticle-</option>
                    {userVerticles
                      .filter(vertical => vertical.status === 'active')
                      .map((vertical) => (
                        <option key={vertical._id} value={vertical._id}>
                          {vertical.name}
                        </option>
                      ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
                {userVerticles.filter(v => v.status === 'active').length === 0 && (
                  <small className="text-muted">No active verticles available.</small>
                )}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    value={branchInfo.name || branchId} 
                    readOnly 
                    disabled 
                  />
                </CInputGroup>
                {branchInfo.city && (
                  <small className="text-muted">
                    City: {branchInfo.city}
                  </small>
                )}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Discount</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="model_discount" 
                    value={formData.model_discount} 
                    onChange={handleChange} 
                    min="0"
                    step="0.01"
                  />
                </CInputGroup>
              </div>
              
              {/* Added Subsidy field */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Subsidy Amount</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="subsidy_amount" 
                    value={formData.subsidy_amount} 
                    onChange={handleChange} 
                    min="0"
                    step="0.01"
                  />
                </CInputGroup>
              </div>
              
              {formData.prices.map((price, index) => (
                <div className="input-box" key={price.header_id}>
                  <div className="details-container">
                    <span className="details">{price.header_key}</span>
                    {priceErrors[price.header_id] && (
                      <span className="required ms-2" title={priceErrors[price.header_id]}>⚠️</span>
                    )}
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBike} />
                    </CInputGroupText>
                    <CFormInput 
                      type="number" 
                      value={price.value} 
                      onChange={(e) => handlePriceChange(price.header_id, e.target.value)} 
                      min="0"
                      step="0.01"
                      className={priceErrors[price.header_id] ? 'is-invalid' : ''}
                    />
                  </CInputGroup>
                  {priceErrors[price.header_id] && (
                    <p className="error">{priceErrors[price.header_id]}</p>
                  )}
                </div>
              ))}
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModel;