import React, { useEffect, useState } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBarcode, cilBuilding, cilEnvelopeClosed, cilHome, cilImage, cilLocationPin, cilMap, cilPhone } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import FormButtons from '../../../utils/FormButtons';

function AddBranch() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    gst_number: '',
    logo1: '',
    logo2: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [logo1Preview, setLogo1Preview] = useState('');
  const [logo2Preview, setLogo2Preview] = useState('');
  const [originalData, setOriginalData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchBranch(id);
    }
  }, [id]);

  const fetchBranch = async (id) => {
    try {
      const res = await axiosInstance.get(`/branches/${id}`);
      const branchData = res.data.data;
      
      // Store original data
      setOriginalData(branchData);
      
      // Create full URLs for logo previews
      if (branchData.logo1) {
        setLogo1Preview(`${axiosInstance.defaults.baseURL}${branchData.logo1}`);
      }
      if (branchData.logo2) {
        setLogo2Preview(`${axiosInstance.defaults.baseURL}${branchData.logo2}`);
      }
      
      // Set form data without logo files
      setFormData({
        ...branchData,
        logo1: '', // Clear file input
        logo2: ''  // Clear file input
      });
      
    } catch (error) {
      console.error('Error fetching branch:', error);
      showFormSubmitError('Failed to fetch branch data');
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        if (name === 'logo1') {
          setLogo1Preview(previewUrl);
        } else if (name === 'logo2') {
          setLogo2Preview(previewUrl);
        }
        
        setFormData((prevData) => ({
          ...prevData,
          [name]: file
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Clear previous errors
  setErrors({});
  
  let formErrors = {};

  if (!formData.name) formErrors.name = 'This field is required';
  if (!formData.address) formErrors.address = 'This field is required';
  if (!formData.city) formErrors.city = 'This field is required';
  if (!formData.state) formErrors.state = 'This field is required';
  if (!formData.pincode) formErrors.pincode = 'This field is required';
  if (!formData.phone) formErrors.phone = 'This field is required';
  if (!formData.email) formErrors.email = 'This field is required';
  if (!formData.gst_number) {
    formErrors.gst_number = 'This field is required';
  } else {
    const gstRegex = /^([0][1-9]|[1-2][0-9]|3[0-5])[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!gstRegex.test(formData.gst_number)) {
      formErrors.gst_number = 'Please enter a valid GST number';
    }
  }

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  try {
    const form = new FormData();
    
    // Append all form data except empty file fields in edit mode
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Skip logo fields in edit mode if no new file was selected
        if (id && (key === 'logo1' || key === 'logo2')) {
          if (value !== '') {
            form.append(key, value);
          }
        } else {
          form.append(key, value);
        }
      }
    });

    if (id) {
      const response = await axiosInstance.put(`/branches/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Handle API validation errors
      if (response.data && response.data.errors) {
        setErrors(response.data.errors);
        return;
      }
      
      await showFormSubmitToast('Location updated successfully!', () => navigate('/branch/branch-list'));
    } else {
      const response = await axiosInstance.post('/branches', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Handle API validation errors
      if (response.data && response.data.errors) {
        setErrors(response.data.errors);
        return;
      }
      
      await showFormSubmitToast('Location added successfully!', () => navigate('/branch/branch-list'));
    }
  } catch (error) {
    console.error('Error details:', error);
    
    // Handle API response errors
    if (error.response && error.response.data) {
      const apiError = error.response.data;
      
      // Check for error message in different possible fields
      let errorMessage = '';
      
      if (apiError.error) {
        // Message is in 'error' field
        errorMessage = apiError.error;
      } else if (apiError.message) {
        // Message is in 'message' field
        errorMessage = apiError.message;
      } else if (apiError.errors) {
        // Handle validation errors object
        setErrors(apiError.errors);
        return;
      } else if (typeof apiError === 'string') {
        // API returned a string
        errorMessage = apiError;
      } else {
        // Try to stringify the entire error object
        errorMessage = JSON.stringify(apiError);
      }
      
      if (errorMessage) {
        setErrors({ api: errorMessage });
        showFormSubmitError(errorMessage);
      }
    } else if (error.message) {
      // Network or other errors
      setErrors({ api: error.message });
      showFormSubmitError(error.message);
    }
  }
};

  const handleCancel = () => {
    navigate('/branch/branch-list');
  };

  const handleRemoveLogo = (logoNumber) => {
    if (logoNumber === 1) {
      setLogo1Preview('');
      setFormData(prev => ({...prev, logo1: ''}));
      // Clear any logo1 errors
      setErrors(prev => ({...prev, logo1: ''}));
    } else {
      setLogo2Preview('');
      setFormData(prev => ({...prev, logo2: ''}));
      // Clear any logo2 errors
      setErrors(prev => ({...prev, logo2: ''}));
    }
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Branch</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {/* Display general API errors */}
            {errors.api && (
              <div className="alert alert-danger mb-3">
                {errors.api}
              </div>
            )}
            
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className={errors.name ? 'is-invalid' : ''}
                  />
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
                    <CIcon icon={cilMap} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    className={errors.address ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.address && <p className="error">{errors.address}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">City</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    className={errors.city ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.city && <p className="error">{errors.city}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">State</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    className={errors.state ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.state && <p className="error">{errors.state}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Pincode</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="pincode" 
                    onChange={handleChange} 
                    value={formData.pincode}
                    className={errors.pincode ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.pincode && <p className="error">{errors.pincode}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Phone</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    className={errors.phone ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Email</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilEnvelopeClosed} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={errors.email ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">GST Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBarcode} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="gst_number" 
                    onChange={handleChange} 
                    value={formData.gst_number}
                    className={errors.gst_number ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {errors.gst_number && <p className="error">{errors.gst_number}</p>}
              </div>
              
              <div className="input-box">
                <span className="details">Logo1</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilImage} />
                  </CInputGroupText>
                  <CFormInput 
                    type="file" 
                    name="logo1" 
                    onChange={handleChange} 
                    accept="image/*"
                    className={errors.logo1 ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {/* Show logo preview */}
                {logo1Preview && (
                  <div className="logo-preview mt-2">
                    <img 
                      src={logo1Preview} 
                      alt="Logo1 preview" 
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleRemoveLogo(1)}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {errors.logo1 && <p className="error">{errors.logo1}</p>}
              </div>

              <div className="input-box">
                <span className="details">Logo2</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilImage} />
                  </CInputGroupText>
                  <CFormInput 
                    type="file" 
                    name="logo2" 
                    onChange={handleChange} 
                    accept="image/*"
                    className={errors.logo2 ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {/* Show logo preview */}
                {logo2Preview && (
                  <div className="logo-preview mt-2">
                    <img 
                      src={logo2Preview} 
                      alt="Logo2 preview" 
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleRemoveLogo(2)}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {errors.logo2 && <p className="error">{errors.logo2}</p>}
              </div>
              
              <div className="input-box">
                <span className="details">Is active?</span>
                <CFormSwitch
                  className="custom-switch-toggle"
                  name="is_active"
                  label={formData.is_active ? 'true' : 'false'}
                  checked={formData.is_active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                />
              </div>
            </div>
            
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBranch;