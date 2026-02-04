import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CRow,
  CCol,
  CAlert
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';
import Select from "react-select"; // Add this import

const AddMinimumBookingAmount = ({ show, onClose, onSaved, editingItem }) => {
  const [formData, setFormData] = useState({
    type: '',
    model_id: '',
    min_amount: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelType, setModelType] = useState('');
  const [filteredModels, setFilteredModels] = useState([]); // Add this state

  useEffect(() => {
    if (editingItem) {
      setFormData({
        type: editingItem.type || '',
        model_id: editingItem.model_id?._id || '',
        min_amount: editingItem.min_amount || ''
      });
      setModelType(editingItem.type || '');
      if (editingItem.type) {
        fetchModelsByType(editingItem.type);
      }
    } else {
      resetForm();
    }
  }, [editingItem, show]);

  useEffect(() => {
    if (formData.type && formData.type !== modelType) {
      setModelType(formData.type);
      fetchModelsByType(formData.type);
      setFormData(prev => ({
        ...prev,
        model_id: ''
      }));
    }
  }, [formData.type]);

  const fetchModelsByType = async (type) => {
    if (!type) {
      setModels([]);
      setFilteredModels([]); // Clear filtered models too
      return;
    }

    try {
      setLoadingModels(true);
      const response = await axiosInstance.get('/models/all/status', {
        params: { type }
      });
      const modelsData = response.data.data?.models || response.data.data || [];
      setModels(modelsData);
      setFilteredModels(modelsData); // Initialize filtered models with all models
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
      setFilteredModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Add this handler for react-select
  const handleModelChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      model_id: selectedOption ? selectedOption.value : ''
    }));
    
    if (formErrors.model_id) {
      setFormErrors(prev => ({
        ...prev,
        model_id: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.type.trim()) {
      errors.type = 'Type is required';
    }
    
    if (!formData.model_id.trim()) {
      errors.model_id = 'Model is required';
    }
    
    if (!formData.min_amount) {
      errors.min_amount = 'Minimum booking amount is required';
    } else if (isNaN(formData.min_amount) || parseFloat(formData.min_amount) <= 0) {
      errors.min_amount = 'Please enter a valid positive amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: formData.type,
        model_id: formData.model_id,
        min_amount: parseFloat(formData.min_amount)
      };

      if (editingItem) {
        await axiosInstance.put(`/booking-min-amount/${editingItem._id}`, payload);
        onSaved('Minimum booking amount updated successfully');
      } else {
        await axiosInstance.post('/booking-min-amount', payload);
        onSaved('Minimum booking amount added successfully');
      }
    } catch (error) {
      console.error('Error saving minimum booking amount:', error);
      showError(error);
      
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      model_id: '',
      min_amount: ''
    });
    setFormErrors({});
    setModels([]);
    setFilteredModels([]);
    setModelType('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getTypeOptions = () => {
    return [
      { value: '', label: 'Select Type' },
      { value: 'ICE', label: 'ICE' },
      { value: 'EV', label: 'EV' },
    ];
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingItem ? 'Edit Minimum Booking Amount' : 'Add New Minimum Booking Amount'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {formErrors.general && (
            <CAlert color="danger" className="mb-3">
              {formErrors.general}
            </CAlert>
          )}
          
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="type">Type <span className="required">*</span></CFormLabel>
                <CFormSelect
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  invalid={!!formErrors.type}
                  disabled={loadingModels || submitting}
                >
                  {getTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
                {formErrors.type && (
                  <div className="error-text">
                    {formErrors.type}
                  </div>
                )}
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="model_id">Model <span className="required">*</span></CFormLabel>
                <div className={`react-select-container ${formErrors.model_id ? 'error-input' : ''}`}>
                  <Select
                    id="model_id"
                    name="model_id"
                    isDisabled={!formData.type || loadingModels || submitting}
                    placeholder={
                      !formData.type ? "Select type first" :
                      loadingModels ? "Loading models..." :
                      filteredModels.length === 0 ? "No models available" :
                      "Search Model"
                    }
                    value={
                      filteredModels.find((m) => m._id === formData.model_id)
                        ? {
                            label: filteredModels.find(
                              (m) => m._id === formData.model_id
                            ).model_name,
                            value: formData.model_id,
                          }
                        : null
                    }
                    onChange={handleModelChange}
                    options={
                      filteredModels.length > 0
                        ? filteredModels.map((model) => ({
                            label: model.model_name,
                            value: model._id,
                          }))
                        : []
                    }
                    noOptionsMessage={() => {
                      if (!formData.type) return "Please select type first";
                      if (loadingModels) return "Loading models...";
                      return "No models available";
                    }}
                    classNamePrefix="react-select"
                    isLoading={loadingModels}
                    isClearable={true}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: formErrors.model_id ? '#dc3545' : base.borderColor,
                        '&:hover': {
                          borderColor: formErrors.model_id ? '#dc3545' : base.borderColor,
                        }
                      })
                    }}
                  />
                </div>
                {loadingModels && (
                  <div className="text-muted small mt-1">
                    <CSpinner size="sm" /> Loading models...
                  </div>
                )}
                {formErrors.model_id && (
                  <div className="error-text">
                    {formErrors.model_id}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
          
          <CRow className="mb-3">
            <CCol md={12}>
              <div className="mb-3">
                <CFormLabel htmlFor="min_amount">
                  Minimum Booking Amount (₹) <span className="required">*</span>
                </CFormLabel>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <CFormInput
                    type="number"
                    id="min_amount"
                    name="min_amount"
                    value={formData.min_amount}
                    onChange={handleInputChange}
                    invalid={!!formErrors.min_amount}
                    disabled={submitting}
                    step="0.01"
                    min="0"
                    placeholder="Enter minimum booking amount"
                  />
                </div>
                <div className="form-text">
                  Enter the minimum booking amount in rupees
                </div>
                {formErrors.min_amount && (
                  <div className="error-text">
                    {formErrors.min_amount}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            type="submit"
            disabled={submitting || loadingModels}
          >
            {submitting ? <CSpinner size="sm" /> : (editingItem ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddMinimumBookingAmount;