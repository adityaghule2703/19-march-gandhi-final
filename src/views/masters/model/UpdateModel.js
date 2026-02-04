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






import axiosInstance from '../../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import '../../../css/form.css';
import FormButtons from '../../../utils/FormButtons';
import { CFormInput, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
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
    subsidy_amount: 0, // Added subsidy_amount field
    verticle_id: '',
    type: '',
    prices: []
  });
  const [allVerticles, setAllVerticles] = useState([]);
  const [userVerticles, setUserVerticles] = useState([]);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Fetch user profile and model details
    const initializeData = async () => {
      await fetchUserProfile();
      await fetchModelDetails();
    };
    initializeData();
  }, [id, branchId]);

  // Fetch user profile to get role and assigned verticles
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
    }
  };

  // Fetch all verticles and filter based on user's role and verticles
  const fetchAllVerticles = async (userVerticleIds, role) => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setAllVerticles(verticlesData);
      
      // Filter verticles based on role
      const filteredVerticles = role === 'SUPERADMIN' 
        ? verticlesData 
        : verticlesData.filter(verticle => 
            userVerticleIds.includes(verticle._id)
          );
      setUserVerticles(filteredVerticles);
    } catch (error) {
      console.error('Error fetching verticles:', error);
    }
  };

  const fetchModelDetails = async () => {
    try {
      const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
      const model = res.data.data.model;
      
      // Extract subsidy_amount from model data
      const subsidyAmount = model.subsidy_amount || 0;
      
      // Extract verticle_id from model data
      const verticleId = model.verticle_id || model.verticle || '';
      
      setFormData({
        model_name: model.model_name,
        model_discount: model.model_discount || 0,
        subsidy_amount: subsidyAmount, // Set subsidy amount
        verticle_id: verticleId,
        type: model.type || '',
        prices: model.prices
      });
    } catch (err) {
      showError('Failed to load model details');
    }
  };

  const handlePriceChange = (headerId, newValue) => {
    setFormData((prev) => ({
      ...prev,
      prices: prev.prices.map((price) => (price.header_id === headerId ? { ...price, value: Number(newValue) } : price))
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      const payload = {
        model_name: formData.model_name.trim(),
        model_discount: Number(formData.model_discount),
        subsidy_amount: Number(formData.subsidy_amount), // Include subsidy amount
        verticle_id: formData.verticle_id,
        type: formData.type,
        prices: formData.prices.map(({ header_id, value }) => ({
          header_id,
          value,
          branch_id: branchId
        }))
      };

      console.log('Payload being sent:', payload);
      
      await axiosInstance.put(`/models/${id}/prices`, payload);
      showFormSubmitToast('Model updated successfully!');
      navigate('/model/model-list');
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to update model');
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
                    // Removed readOnly and disabled
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
                  <span className="details">Branch ID</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput type="text" value={branchId} readOnly disabled />
                </CInputGroup>
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
                  />
                </CInputGroup>
              </div>
              
              {formData.prices.map((price, index) => (
                <div className="input-box" key={price.header_id}>
                  <div className="details-container">
                    <span className="details">{price.header_key}</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBike} />
                    </CInputGroupText>
                    <CFormInput 
                      type="number" 
                      value={price.value} 
                      onChange={(e) => handlePriceChange(price.header_id, e.target.value)} 
                    />
                  </CInputGroup>
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