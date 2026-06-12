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
import { cilPencil, cilMoney, cilCalendar, cilWarning } from '@coreui/icons';
import { axiosInstance, showError, showSuccess } from '../../../utils/tableImports';

const EditIncentive = ({ visible, onClose, onSuccess, planId }) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingColors, setLoadingColors] = useState(false);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [planDetails, setPlanDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    modelId: '',
    colorId: '',
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
    if (visible && planId) {
      console.log('Edit modal opened with planId:', planId);
      fetchPlanDetails(planId);
      fetchModels();
    }
  }, [visible, planId]);

  // Fetch plan details by ID
  const fetchPlanDetails = async (id) => {
    setLoadingData(true);
    try {
      const response = await axiosInstance.get(`/incentives/master/${id}`);
      console.log('Plan details response:', response.data);
      
      if (response.data.status === 'success') {
        const plan = response.data.data.plan;
        setPlanDetails(plan);
        
        // Extract model ID and color ID from the response
        const modelId = plan.model?.id || plan.model?._id || '';
        const colorId = plan.color?.id?._id || plan.color?.id || '';
        
        console.log('Extracted IDs:', { modelId, colorId });
        
        setFormData({
          modelId: modelId,
          colorId: colorId,
          incentivePerVehicle: plan.incentivePerVehicle || '',
          totalIncentivePool: plan.totalIncentivePool || '',
          validFrom: plan.validFrom ? plan.validFrom.split('T')[0] : '',
          validTo: plan.validTo ? plan.validTo.split('T')[0] : '',
          remarks: plan.remarks || ''
        });
        
        // Fetch colors for the selected model
        if (modelId) {
          fetchColorsByModel(modelId);
        }
      } else {
        showError('Failed to load plan details');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
      showError(error.response?.data?.message || 'Failed to load plan details');
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch models list
  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const response = await axiosInstance.get('/models/list/names');
      console.log('Models API response:', response.data);
      
      if (response.data.status === 'success') {
        setModels(response.data.data.models || []);
      } else {
        showError(response.data.message || 'Failed to load models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      showError('Failed to load models');
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
      const url = `/colors/model/${modelId}`;
      console.log('Fetching colors from URL:', url);
      
      const response = await axiosInstance.get(url);
      console.log('Colors API response:', response.data);
      
      if (response.data.status === 'success') {
        const colorsData = response.data.data.colors || [];
        console.log('Colors received:', colorsData);
        setColors(colorsData);
        
        if (colorsData.length === 0) {
          setFieldErrors(prev => ({ ...prev, colorId: 'No colors available for this model' }));
        } else {
          setFieldErrors(prev => ({ ...prev, colorId: '' }));
        }
      } else {
        console.error('Failed to load colors:', response.data.message);
        setColors([]);
        setFieldErrors(prev => ({ ...prev, colorId: response.data.message || 'Failed to load colors' }));
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
      setFieldErrors(prev => ({ ...prev, colorId: 'Failed to load colors for selected model' }));
    } finally {
      setLoadingColors(false);
    }
  };

  // Handle model change
  const handleModelChange = (modelId) => {
    console.log('Model changed to:', modelId);
    setFormData({ 
      ...formData, 
      modelId: modelId,
      colorId: '' // Reset color when model changes
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
    if (!planId) return;
    
    setLoading(true);
    setApiError(null);
    setFieldErrors({});
    
    try {
      const payload = {
        incentivePerVehicle: parseFloat(formData.incentivePerVehicle),
        totalIncentivePool: parseFloat(formData.totalIncentivePool),
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        remarks: formData.remarks
      };
      
      console.log('Updating with payload:', payload);
      console.log('Plan ID:', planId);
      
      const response = await axiosInstance.patch(`/incentives/master/${planId}`, payload);
      console.log('Update response:', response.data);
      
      if (response.data.status === 'success') {
        showSuccess('Incentive plan updated successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error updating incentive plan:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        console.error('Error data:', errorData);
        
        // First check for error field (real error message)
        if (errorData.error) {
          setApiError(errorData.error);
        }
        // Then check for message field
        else if (errorData.message) {
          setApiError(errorData.message);
        }
        else {
          setApiError('Failed to update incentive plan');
        }
      } 
      else if (error.message) {
        setApiError(error.message);
      } 
      else {
        setApiError('Failed to update incentive plan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal size="lg" visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilPencil} className="me-2" />
          Edit Incentive Plan - {planDetails?.modelName || planDetails?.model?.model_name || ''}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loadingData || loadingModels ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-3">Loading plan details...</p>
          </div>
        ) : (
          <>
            {/* API Error Alert */}
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
                <CFormSelect
                  value={formData.modelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className={fieldErrors.modelId || formErrors.modelId ? 'is-invalid' : ''}
                  disabled={true} // Model cannot be changed in edit mode
                >
                  <option value="">-- Select Model --</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </CFormSelect>
                <small className="text-muted">Model cannot be changed in edit mode</small>
                {(fieldErrors.modelId || formErrors.modelId) && (
                  <small className="text-danger">{fieldErrors.modelId || formErrors.modelId}</small>
                )}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Color <span className="required">*</span></label>
                <CFormSelect
                  value={formData.colorId}
                  onChange={(e) => {
                    console.log('Color selected:', e.target.value);
                    setFormData({ ...formData, colorId: e.target.value });
                    setFieldErrors(prev => ({ ...prev, colorId: '' }));
                    setFormErrors({ ...formErrors, colorId: '' });
                  }}
                  disabled={!formData.modelId || loadingColors || true} // Color cannot be changed in edit mode
                  className={fieldErrors.colorId || formErrors.colorId ? 'is-invalid' : ''}
                >
                  <option value="">-- Select Color --</option>
                  {colors.map(color => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </CFormSelect>
                <small className="text-muted">Color cannot be changed in edit mode</small>
                {loadingColors && (
                  <small className="text-muted d-block mt-1">
                    <CSpinner size="sm" className="me-1" /> Loading colors...
                  </small>
                )}
                {(fieldErrors.colorId || formErrors.colorId) && (
                  <small className="text-danger">{fieldErrors.colorId || formErrors.colorId}</small>
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

            {/* Info Alert showing max vehicles */}
            {/* {formData.totalIncentivePool && formData.incentivePerVehicle && (
              <CAlert color="info" className="mt-2">
                <small>
                  <strong>Note:</strong> Max vehicles that can be covered: <strong>
                    {Math.floor(formData.totalIncentivePool / formData.incentivePerVehicle)}
                  </strong>
                </small>
              </CAlert>
            )} */}
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
        <CButton 
          color="primary" 
          onClick={handleSubmit} 
          disabled={loading || loadingData}
        >
          {loading ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Incentive Plan'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditIncentive;