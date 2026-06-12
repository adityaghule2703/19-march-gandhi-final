import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilMoney, cilCalendar, cilWarning } from '@coreui/icons';
import { axiosInstance, showError, showSuccess } from '../../../utils/tableImports';
import Select from 'react-select';

const AddIncentive = ({ visible, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingColors, setLoadingColors] = useState(false);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  
  const [formData, setFormData] = useState({
    modelId: '',
    modelName: '',
    colorId: '',
    colorName: '',
    incentivePerVehicle: '',
    totalIncentivePool: '',
    validFrom: '',
    validTo: '',
    remarks: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (visible) {
      fetchModels();
      resetForm();
      setApiError(null);
      setFieldErrors({});
    }
  }, [visible]);

  // Fetch models on modal open
  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const response = await axiosInstance.get('/models/list/names');
      
      if (response.data.status === 'success') {
        const modelOptions = (response.data.data.models || []).map(model => ({
          value: model.id,
          label: model.name
        }));
        setModels(modelOptions);
      } else {
        showError(response.data.message || 'Failed to load models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Failed to load models');
      }
    } finally {
      setLoadingModels(false);
    }
  };

  // Fetch colors when model is selected
  const fetchColorsByModel = async (modelId) => {
    if (!modelId) {
      setColors([]);
      return;
    }
    
    setLoadingColors(true);
    try {
      const response = await axiosInstance.get(`/colors/model/${modelId}`);
      
      if (response.data.status === 'success') {
        const colorOptions = (response.data.data.colors || []).map(color => ({
          value: color.id,
          label: color.name
        }));
        setColors(colorOptions);
        if (colorOptions.length === 0) {
          setFieldErrors(prev => ({ ...prev, colorId: 'No colors available for this model' }));
        } else {
          setFieldErrors(prev => ({ ...prev, colorId: '' }));
        }
      } else {
        setColors([]);
        setFieldErrors(prev => ({ ...prev, colorId: response.data.message || 'Failed to load colors' }));
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
      if (error.response?.data?.message) {
        setFieldErrors(prev => ({ ...prev, colorId: error.response.data.message }));
      } else {
        setFieldErrors(prev => ({ ...prev, colorId: 'Failed to load colors for selected model' }));
      }
    } finally {
      setLoadingColors(false);
    }
  };

  // Handle model change
  const handleModelChange = (selectedOption) => {
    const modelId = selectedOption ? selectedOption.value : '';
    const modelName = selectedOption ? selectedOption.label : '';
    
    setFormData({ 
      ...formData, 
      modelId: modelId,
      modelName: modelName,
      colorId: '', // Reset color when model changes
      colorName: ''
    });
    setFormErrors({ ...formErrors, modelId: '', colorId: '' });
    setApiError(null);
    setFieldErrors({});
    
    if (modelId) {
      fetchColorsByModel(modelId);
    } else {
      setColors([]);
    }
  };

  // Handle color change
  const handleColorChange = (selectedOption) => {
    setFormData({ 
      ...formData, 
      colorId: selectedOption ? selectedOption.value : '',
      colorName: selectedOption ? selectedOption.label : ''
    });
    setFieldErrors(prev => ({ ...prev, colorId: '' }));
    setFormErrors({ ...formErrors, colorId: '' });
  };

  const resetForm = () => {
    setFormData({
      modelId: '',
      modelName: '',
      colorId: '',
      colorName: '',
      incentivePerVehicle: '',
      totalIncentivePool: '',
      validFrom: '',
      validTo: '',
      remarks: ''
    });
    setColors([]);
    setFormErrors({});
    setApiError(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.modelId) errors.modelId = 'Model is required';
    if (!formData.colorId) errors.colorId = 'Color is required';
    if (!formData.incentivePerVehicle) errors.incentivePerVehicle = 'Incentive per vehicle is required';
    if (formData.incentivePerVehicle && parseFloat(formData.incentivePerVehicle) <= 0) {
      errors.incentivePerVehicle = 'Incentive per vehicle must be greater than 0';
    }
    if (!formData.totalIncentivePool) errors.totalIncentivePool = 'Total incentive pool is required';
    if (formData.totalIncentivePool && parseFloat(formData.totalIncentivePool) <= 0) {
      errors.totalIncentivePool = 'Total incentive pool must be greater than 0';
    }
    if (!formData.validFrom) errors.validFrom = 'Valid from date is required';
    if (!formData.validTo) errors.validTo = 'Valid to date is required';
    if (formData.validFrom && formData.validTo && new Date(formData.validFrom) > new Date(formData.validTo)) {
      errors.validTo = 'Valid to date must be after valid from date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError(null);
    setFieldErrors({});
    
    try {
      const payload = {
        modelId: formData.modelId,
        colorId: formData.colorId,
        incentivePerVehicle: parseFloat(formData.incentivePerVehicle),
        totalIncentivePool: parseFloat(formData.totalIncentivePool),
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        remarks: formData.remarks
      };
      
      const response = await axiosInstance.post('/incentives/master', payload);
      if (response.data.status === 'success') {
        showSuccess('Incentive plan added successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error adding incentive plan:', error);
      
      // Handle different error formats from API
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // First check for error field (real error message)
        if (errorData.error) {
          setApiError(errorData.error);
        }
        // Then check for message field
        else if (errorData.message) {
          setApiError(errorData.message);
        }
        else {
          setApiError('Failed to add incentive plan');
        }
      } 
      else if (error.message) {
        setApiError(error.message);
      } 
      else {
        setApiError('Failed to add incentive plan');
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '38px',
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      '&:active': {
        backgroundColor: '#0d6efd'
      }
    })
  };

  return (
    <CModal size="lg" visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilPlus} className="me-2" />
          Add New Incentive Plan
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loadingModels ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-3">Loading models...</p>
          </div>
        ) : (
          <>
            {/* API Error Alert - Shows error.error field */}
            {apiError && (
              <CAlert color="danger" className="mb-3">
                <div className="d-flex align-items-start">
                  <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                  <div>
                    <strong>Error!</strong>
                    <p className="mb-0 mt-1">{apiError}</p>
                  </div>
                </div>
              </CAlert>
            )}

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Model <span className="required">*</span></label>
                <Select
                  classNamePrefix="react-select"
                  placeholder="-- Select Model --"
                  isClearable
                  options={models}
                  value={formData.modelId ? { value: formData.modelId, label: formData.modelName } : null}
                  onChange={handleModelChange}
                  styles={customSelectStyles}
                  isDisabled={loadingModels}
                />
                {(fieldErrors.modelId || formErrors.modelId) && (
                  <small className="text-danger">{fieldErrors.modelId || formErrors.modelId}</small>
                )}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Color <span className="required">*</span></label>
                <Select
                  classNamePrefix="react-select"
                  placeholder="-- Select Color --"
                  isClearable
                  options={colors}
                  value={formData.colorId ? { value: formData.colorId, label: formData.colorName } : null}
                  onChange={handleColorChange}
                  styles={customSelectStyles}
                  isDisabled={!formData.modelId || loadingColors}
                  noOptionsMessage={() => "No colors available"}
                />
                {loadingColors && (
                  <small className="text-muted d-block mt-1">
                    <CSpinner size="sm" className="me-1" /> Loading colors...
                  </small>
                )}
                {(fieldErrors.colorId || formErrors.colorId) && (
                  <small className="text-danger">{fieldErrors.colorId || formErrors.colorId}</small>
                )}
                {formData.modelId && colors.length === 0 && !loadingColors && !fieldErrors.colorId && (
                  <small className="text-warning d-block mt-1">No colors available for selected model</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Incentive per Vehicle (₹) <span className="required">*</span></label>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilMoney} /></CInputGroupText>
                  <CFormInput
                    type="number"
                    step="1"
                    value={formData.incentivePerVehicle}
                    onChange={(e) => {
                      setFormData({ ...formData, incentivePerVehicle: e.target.value });
                      setFormErrors({ ...formErrors, incentivePerVehicle: '' });
                    }}
                    placeholder="Enter incentive amount per vehicle"
                    className={formErrors.incentivePerVehicle ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {formErrors.incentivePerVehicle && <small className="text-danger">{formErrors.incentivePerVehicle}</small>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Total Incentive Pool (₹) <span className="required">*</span></label>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilMoney} /></CInputGroupText>
                  <CFormInput
                    type="number"
                    step="1"
                    value={formData.totalIncentivePool}
                    onChange={(e) => {
                      setFormData({ ...formData, totalIncentivePool: e.target.value });
                      setFormErrors({ ...formErrors, totalIncentivePool: '' });
                      setApiError(null);
                    }}
                    placeholder="Enter total incentive pool amount"
                    className={fieldErrors.totalIncentivePool || formErrors.totalIncentivePool ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {(fieldErrors.totalIncentivePool || formErrors.totalIncentivePool) && (
                  <small className="text-danger">{fieldErrors.totalIncentivePool || formErrors.totalIncentivePool}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Valid From <span className="required">*</span></label>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                  <CFormInput
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => {
                      setFormData({ ...formData, validFrom: e.target.value });
                      setFormErrors({ ...formErrors, validFrom: '' });
                      setFieldErrors(prev => ({ ...prev, validFrom: '' }));
                    }}
                    className={fieldErrors.validFrom || formErrors.validFrom ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {(fieldErrors.validFrom || formErrors.validFrom) && (
                  <small className="text-danger">{fieldErrors.validFrom || formErrors.validFrom}</small>
                )}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Valid To <span className="required">*</span></label>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                  <CFormInput
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => {
                      setFormData({ ...formData, validTo: e.target.value });
                      setFormErrors({ ...formErrors, validTo: '' });
                      setFieldErrors(prev => ({ ...prev, validTo: '' }));
                    }}
                    className={fieldErrors.validTo || formErrors.validTo ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {(fieldErrors.validTo || formErrors.validTo) && (
                  <small className="text-danger">{fieldErrors.validTo || formErrors.validTo}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Remarks</label>
                <CFormTextarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                  placeholder="Enter remarks (optional)"
                />
              </CCol>
            </CRow>
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
        <CButton 
          color="primary" 
          onClick={handleSubmit} 
          disabled={loading || loadingModels}
        >
          {loading ? <><CSpinner size="sm" className="me-2" />Adding...</> : 'Add Incentive Plan'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddIncentive;