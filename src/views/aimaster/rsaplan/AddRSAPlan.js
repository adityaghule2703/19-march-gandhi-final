import React, { useEffect, useState, useMemo } from 'react';
import './rsafrom.css'; 
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormTextarea, CAlert, CButton, CFormCheck, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilShieldAlt, cilDollar, cilCalendar, cilListRich, cilCheckCircle, cilPlus, cilSearch, cilInfo } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddRSAPlan() {
  const [formData, setFormData] = useState({
    planName: '',
    sumInsured: '',
    tenure: '',
    benefits: '',
    price: '',
    models: [],
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchModels();
    if (id) {
      fetchRSAPlan(id);
    }
  }, [id]);

  const fetchModels = async () => {
    try {
      setLoadingModels(true);
      const response = await axiosInstance.get('/models');
      
      let models = [];
      if (response.data?.data?.models && Array.isArray(response.data.data.models)) {
        models = response.data.data.models;
      } else if (Array.isArray(response.data.data)) {
        models = response.data.data;
      } else if (Array.isArray(response.data)) {
        models = response.data;
      }
      
      setModelOptions(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      showError('Failed to load model options');
    } finally {
      setLoadingModels(false);
    }
  };

  const fetchRSAPlan = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/rsa-plans/${id}`);
      
      let plan = {};
      
      if (res.data) {
        if (res.data.data) {
          if (res.data.data.rsaPlan) {
            plan = res.data.data.rsaPlan;
          } 
          else if (res.data.data._id || res.data.data.id) {
            plan = res.data.data;
          }
          else if (res.data.data.plan) {
            plan = res.data.data.plan;
          }
        }
        else if (res.data._id || res.data.id) {
          plan = res.data;
        }
        else if (res.data.plan) {
          plan = res.data.plan;
        }
      }

      let modelIds = [];
      if (plan.models && Array.isArray(plan.models)) {
        modelIds = plan.models.map(m => m._id || m.id || m).filter(id => id);
      }

      setFormData({
        planName: plan.planName || '',
        sumInsured: plan.sumInsured ?? '',
        tenure: plan.tenure ?? '',
        benefits: plan.benefits || '',
        price: plan.price ?? '',
        models: modelIds,
        status: plan.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching RSA plan:', error);
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleModelSelection = (modelId) => {
    if (formData.models.includes(modelId)) {
      setFormData(prev => ({
        ...prev,
        models: prev.models.filter(id => id !== modelId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        models: [...prev.models, modelId]
      }));
    }
    setErrors(prev => ({ ...prev, models: '' }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter models based on search term
  const filteredModels = useMemo(() => {
    if (!searchTerm.trim()) {
      return modelOptions;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return modelOptions.filter(model => 
      (model.model_name || model.name || model.modelName || '').toLowerCase().includes(searchLower)
    );
  }, [modelOptions, searchTerm]);

  const getSelectedModelNames = () => {
    return formData.models.map(modelId => {
      const model = modelOptions.find(m => m._id === modelId || m.id === modelId);
      return model ? model.model_name || model.name || model.modelName || String(modelId) : String(modelId);
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.planName.trim()) formErrors.planName = 'Plan name is required';
    if (formData.sumInsured === '' || Number(formData.sumInsured) < 0) formErrors.sumInsured = 'Valid sum insured is required';
    if (formData.tenure === '' || Number(formData.tenure) < 0) formErrors.tenure = 'Valid tenure is required';
    if (!formData.benefits.trim()) formErrors.benefits = 'Benefits are required';
    if (formData.price === '' || Number(formData.price) < 0) formErrors.price = 'Valid price is required';
    if (!formData.models || formData.models.length === 0) {
      formErrors.models = 'Please select at least one model';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      planName: formData.planName.trim(),
      sumInsured: Number(formData.sumInsured),
      tenure: Number(formData.tenure),
      benefits: formData.benefits.trim(),
      price: Number(formData.price),
      models: formData.models
    };

    if (id) {
      payload.status = formData.status;
    }

    try {
      if (id) {
        await axiosInstance.put(`/rsa-plans/${id}`, payload);
        await showFormSubmitToast('RSA Plan updated successfully!', () => navigate('/rsa-plan/rsa-plan-list'));
      } else {
        await axiosInstance.post('/rsa-plans', payload);
        await showFormSubmitToast('RSA Plan added successfully!', () => navigate('/rsa-plan/rsa-plan-list'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const message = showError(error);
      if (message) setError(message);
    }
  };

  const handleCancel = () => {
    navigate('/rsa-plan/rsa-plan-list');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading RSA plan details...</span>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} RSA Plan</div>
      
      {/* Note Alert */}
      <CAlert color="info" className="mt-2">
        <div className="d-flex align-items-start">
          <CIcon icon={cilInfo} className="me-2 mt-1" />
          <div>
            <strong>Note:</strong> Please enter the plan name exactly as shown on the RSA website. This ensures consistency and proper identification across the system.
          </div>
        </div>
      </CAlert>
      
      {error && <CAlert color="danger">{error}</CAlert>}
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              {/* Plan Name - Full Width */}
              <div className="input-box full-width">
                <div className="details-container">
                  <span className="details">Plan Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilShieldAlt} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="planName"
                    value={formData.planName}
                    onChange={handleChange}
                    placeholder="Enter plan name"
                    className="form-control"
                  />
                </CInputGroup>
                {errors.planName && <p className="error">{errors.planName}</p>}
              </div>

              {/* Sum Insured */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Sum Insured</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="sumInsured"
                    value={formData.sumInsured}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter sum insured amount"
                    className="form-control"
                  />
                </CInputGroup>
                {errors.sumInsured && <p className="error">{errors.sumInsured}</p>}
              </div>

              {/* Tenure */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Tenure (years)</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter tenure in years"
                    className="form-control"
                  />
                </CInputGroup>
                {errors.tenure && <p className="error">{errors.tenure}</p>}
              </div>

              {/* Benefits - Full Width */}
              <div className="input-box full-width">
                <div className="details-container">
                  <span className="details">Benefits</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilListRich} />
                  </CInputGroupText>
                  <CFormTextarea
                    name="benefits"
                    rows="3"
                    value={formData.benefits}
                    onChange={handleChange}
                    placeholder="e.g. 24x7 roadside assistance, Towing up to 100km"
                    className="form-control"
                  />
                </CInputGroup>
                {errors.benefits && <p className="error">{errors.benefits}</p>}
              </div>

              {/* Price */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Price</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    className="form-control"
                  />
                </CInputGroup>
                {errors.price && <p className="error">{errors.price}</p>}
              </div>

              {/* Models Selection - Full Width */}
              <div className="input-box full-width">
                <div className="details-container">
                  <span className="details">Select Models</span>
                  <span className="required">*</span>
                </div>
                
                {/* Search Box for Models */}
                <div className="search-container">
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput 
                      type="text" 
                      placeholder="Search models by name..." 
                      value={searchTerm}
                      onChange={handleSearchChange}
                      disabled={loadingModels}
                    />
                  </CInputGroup>
                </div>
                
                {loadingModels ? (
                  <div className="d-flex justify-content-center align-items-center py-3">
                    <CSpinner color="primary" size="sm" />
                    <span className="ms-2">Loading models...</span>
                  </div>
                ) : (
                  <>
                    <div className="models-list">
                      {filteredModels.length > 0 ? (
                        filteredModels.map((model) => {
                          const modelId = model._id || model.id;
                          return (
                            <div key={modelId} className="model-checkbox">
                              <CFormCheck
                                id={`model-${modelId}`}
                                label={model.model_name || model.name || model.modelName}
                                checked={formData.models.includes(modelId)}
                                onChange={() => handleModelSelection(modelId)}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div className="no-results">
                          {searchTerm ? 'No models found matching your search.' : 'No models available.'}
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Models Summary */}
                    {formData.models.length > 0 && (
                      <div className="selected-summary">
                        <strong>Selected Models ({formData.models.length}):</strong>{' '}
                        {getSelectedModelNames().map((name, index) => (
                          <span key={index}>
                            {name}
                            {index < getSelectedModelNames().length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {errors.models && <p className="error">{errors.models}</p>}
                  </>
                )}
              </div>

              {/* Status (only for edit) - Full Width */}
              {id && (
                <div className="input-box full-width">
                  <div className="details-container">
                    <span className="details">Status</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilCheckCircle} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </CFormSelect>
                  </CInputGroup>
                </div>
              )}
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddRSAPlan;