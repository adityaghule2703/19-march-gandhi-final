import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSwitch, CFormCheck, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilLocationPin, cilMap, cilPhone, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './customer.css';
import Swal from 'sweetalert2';

function AddCustomer() {
  const [activeTab, setActiveTab] = useState(1);
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    taluka: '',
    district: '',
    mobile1: '',
    mobile2: '',
    expected_delivery_date: '',
    finance_needed: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchModels();
    if (id) {
      fetchCustomer(id);
    }
  }, [id]);

  const fetchModels = async () => {
    try {
      const res = await axiosInstance.get('/models');
      setModels(res.data.data.models || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchCustomer = async (id) => {
    try {
      const res = await axiosInstance.get(`/customers/${id}`);
      const customerData = res.data.data.customer;
      setFormData({
        name: customerData.name || '',
        address: customerData.address || '',
        taluka: customerData.taluka || '',
        district: customerData.district || '',
        mobile1: customerData.mobile1 || '',
        mobile2: customerData.mobile2 || '',
        expected_delivery_date: customerData.expected_delivery_date || '',
        finance_needed: customerData.finance_needed || false
      });

      if (customerData.selectedModels) {
        setSelectedModels(customerData.selectedModels);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleModelSelection = (modelId) => {
    if (selectedModels.some((model) => model.model_id === modelId)) {
      setSelectedModels(selectedModels.filter((model) => model.model_id !== modelId));
    } else {
      if (selectedModels.length < 2) {
        setSelectedModels([...selectedModels, { model_id: modelId }]);
      } else {
        alert('You can only select up to 2 models');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'expected_delivery_date' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (selectedDate < today) {
        setErrors((prevErrors) => ({ 
          ...prevErrors, 
          expected_delivery_date: 'Past dates are not allowed. Please select today or a future date.' 
        }));
        return;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, expected_delivery_date: '' }));
      }
    }
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateTab1 = () => {
    if (selectedModels.length === 0) {
      alert('Please select at least one model');
      return false;
    }
    if (selectedModels.length > 2) {
      alert('You can select maximum 2 models');
      return false;
    }
    return true;
  };

  const validateTab2 = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'This field is required';
    if (!formData.address) formErrors.address = 'This field is required';
    if (!formData.taluka) formErrors.taluka = 'This field is required';
    if (!formData.district) formErrors.district = 'This field is required';
    if (!formData.mobile1) formErrors.mobile1 = 'This field is required';
    if (!formData.mobile2) formErrors.mobile2 = 'This field is required';
    if (!formData.expected_delivery_date) formErrors.expected_delivery_date = 'This field is required';
    
    // Additional date validation
    if (formData.expected_delivery_date) {
      const selectedDate = new Date(formData.expected_delivery_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        formErrors.expected_delivery_date = 'Past dates are not allowed. Please select today or a future date.';
      }
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return false;
    }
    return true;
  };

  const handleNextTab = () => {
    if (activeTab === 1) {
      if (validateTab1()) {
        setActiveTab(2);
      }
    }
  };

  const handlePrevTab = () => {
    setActiveTab(1);
  };


const downloadQuotationPdfInSameTab = (quotationNumber, pdfUrl) => {
  try {
    const baseURL = axiosInstance.defaults.baseURL;
    const fullUrl = `${baseURL}/${pdfUrl}`;
    
    console.log('Opening PDF in same tab:', fullUrl);
    
  
    const iframe = document.createElement('iframe');
    iframe.src = fullUrl;
    iframe.style.display = 'none';
    iframe.onload = () => {
   
      setTimeout(() => {
       
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = `quotation_${quotationNumber}.pdf`;
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
   
        document.body.removeChild(iframe);
      }, 500);
    };
    document.body.appendChild(iframe);
    
  } catch (error) {
    console.error('Error opening PDF:', error);
    
   
    const baseURL = axiosInstance.defaults.baseURL;
    const fullUrl = `${baseURL}/${pdfUrl}`;
    
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = `quotation_${quotationNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateTab2()) return;

  setIsSubmitting(true);

  const payload = {
    customerDetails: {
      name: formData.name,
      address: formData.address,
      taluka: formData.taluka,
      district: formData.district,
      mobile1: formData.mobile1,
      mobile2: formData.mobile2
    },
    selectedModels: selectedModels,
    expected_delivery_date: formData.expected_delivery_date,
    finance_needed: formData.finance_needed
  };

  try {
    if (id) {
      // For update - still show success message
      await axiosInstance.patch(`/customers/${id}`, payload);
      
      if (typeof showFormSubmitError !== 'function') {
        await Swal.fire({
          title: 'Success!',
          text: 'Customer updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        showFormSubmitError('Customer updated successfully!');
      }
      navigate('/quotation-list');
      
    } else {
      // For new quotation - NO success message, directly show PDF
      const response = await axiosInstance.post('/quotations', payload);
      
      // Get quotation data
      const quotation = response.data?.data?.quotation || response.data?.data;
      const quotationNumber = quotation?.quotation_number;
      const pdfUrl = quotation?.pdfUrl;
      
      if (pdfUrl) {
        console.log('PDF URL found:', pdfUrl);
        
        // Download PDF in SAME tab (no new tab)
        downloadQuotationPdfInSameTab(quotationNumber || 'quotation', pdfUrl);
        
        // Navigate to list page after a short delay
        setTimeout(() => {
          navigate('/quotation-list');
        }, 2000);
        
      } else {
        // If no PDF URL, show minimal message and navigate
        console.log('No PDF URL found, navigating to list');
        navigate('/quotation-list');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    
    // Show error only if something goes wrong
    if (typeof showFormSubmitError === 'function') {
      showFormSubmitError(error);
    } else {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancel = () => {
    navigate('/quotation-list');
  };

  return (
    <div className="form-container">
      <div className="title">Add New</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {activeTab === 1 && (
              <>
                <div>
                  <div className="full-width">
                    <div className="details-container">
                      <span className="details"><strong>Select Models (Max 2)</strong></span>
                      <span className="required">*</span>
                    </div>
                    <div className="models-list">
                      {models.map((model) => (
                        <div key={model._id} className="model-checkbox">
                          <CFormCheck
                            id={`model-${model._id}`}
                            label={model.model_name}
                            checked={selectedModels.some((m) => m.model_id === model._id)}
                            onChange={() => handleModelSelection(model._id)}
                            disabled={selectedModels.length >= 2 && !selectedModels.some((m) => m.model_id === model._id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-footer">
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="submit-button" 
                    onClick={handleNextTab}
                    disabled={isSubmitting}
                  >
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
                      <span className="details">Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
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
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormInput 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                      />
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
                      <CFormInput 
                        type="text" 
                        name="taluka" 
                        value={formData.taluka} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                      />
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
                      <CFormInput 
                        type="text" 
                        name="district" 
                        value={formData.district} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.district && <p className="error">{errors.district}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Mobile 1</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput 
                        type="text" 
                        name="mobile1" 
                        value={formData.mobile1} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Mobile 2</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput 
                        type="text" 
                        name="mobile2" 
                        value={formData.mobile2} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.mobile2 && <p className="error">{errors.mobile2}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Expected Delivery Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput
                        type="date"
                        name="expected_delivery_date"
                        value={formData.expected_delivery_date}
                        onChange={handleChange}
                        min={getTodayDate()} // This disables past dates in the date picker
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                    {errors.expected_delivery_date && <p className="error">{errors.expected_delivery_date}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Finance Needed</span>
                    </div>
                    <CInputGroup>
                      <CFormSwitch
                        id="finance_needed"
                        label={formData.finance_needed ? 'Yes' : 'No'}
                        checked={formData.finance_needed}
                        onChange={handleChange}
                        name="finance_needed"
                        className="custom-switch-toggle"
                        disabled={isSubmitting}
                      />
                    </CInputGroup>
                  </div>
                </div>

                <div className="form-footer">
                  <button 
                    type="button"
                    className="cancel-button" 
                    onClick={handlePrevTab}
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CSpinner component="span" size="sm" className="me-2" />
                        {id ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      id ? 'Update' : 'Submit'
                    )}
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

export default AddCustomer;