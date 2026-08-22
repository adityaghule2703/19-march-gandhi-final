import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { 
  CInputGroup, 
  CFormInput, 
  CFormSelect, 
  CAlert, 
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilInfo } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';
import Select from 'react-select';

const AddSchemaModal = ({ visible, onClose, onSuccess, editData }) => {
  const isEditMode = !!editData;
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    scheme_name: '',
    start_date: '',
    end_date: '',
    scheme_type: '',
    volume_slabs: [{ no: '', amount: '' }],
    model_slabs: [{ model_id: null, slabs: [{ no: '', amount: '' }] }],
    accessory_slabs: [{ amount: '', incentive_amount: '' }]
  });

  const [errors, setErrors] = useState({});

  // Fetch models for dropdown
  useEffect(() => {
    if (visible) {
      fetchModels();
    }
  }, [visible]);

  // Load edit data when modal opens
  useEffect(() => {
    if (visible && editData) {
      setFormData({
        scheme_name: editData.scheme_name || '',
        start_date: editData.start_date ? new Date(editData.start_date).toISOString().split('T')[0] : '',
        end_date: editData.end_date ? new Date(editData.end_date).toISOString().split('T')[0] : '',
        scheme_type: editData.scheme_type || '',
        volume_slabs: editData.volume_slabs?.length ? editData.volume_slabs : [{ no: '', amount: '' }],
        model_slabs: editData.model_slabs?.length ? editData.model_slabs : [{ model_id: null, slabs: [{ no: '', amount: '' }] }],
        accessory_slabs: editData.accessory_slabs?.length ? editData.accessory_slabs : [{ amount: '', incentive_amount: '' }]
      });
    } else if (visible) {
      // Reset form when opening for create
      setFormData({
        scheme_name: '',
        start_date: '',
        end_date: '',
        scheme_type: '',
        volume_slabs: [{ no: '', amount: '' }],
        model_slabs: [{ model_id: null, slabs: [{ no: '', amount: '' }] }],
        accessory_slabs: [{ amount: '', incentive_amount: '' }]
      });
      setErrors({});
      setError(null);
    }
  }, [visible, editData]);

  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const response = await axiosInstance.get('/models');
      const modelData = response.data.data.models || [];
      setModels(modelData);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ========== VOLUME SLABS HANDLERS ==========
  const addVolumeSlab = () => {
    setFormData(prev => ({
      ...prev,
      volume_slabs: [...prev.volume_slabs, { no: '', amount: '' }]
    }));
  };

  const removeVolumeSlab = (index) => {
    if (formData.volume_slabs.length <= 1) {
      showError('At least one slab is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      volume_slabs: prev.volume_slabs.filter((_, i) => i !== index)
    }));
  };

  const handleVolumeSlabChange = (index, field, value) => {
    const updatedSlabs = [...formData.volume_slabs];
    updatedSlabs[index][field] = value;
    setFormData(prev => ({ ...prev, volume_slabs: updatedSlabs }));
  };

  // ========== ACCESSORY SLABS HANDLERS ==========
  const addAccessorySlab = () => {
    setFormData(prev => ({
      ...prev,
      accessory_slabs: [...prev.accessory_slabs, { amount: '', incentive_amount: '' }]
    }));
  };

  const removeAccessorySlab = (index) => {
    if (formData.accessory_slabs.length <= 1) {
      showError('At least one slab is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      accessory_slabs: prev.accessory_slabs.filter((_, i) => i !== index)
    }));
  };

  const handleAccessorySlabChange = (index, field, value) => {
    const updatedSlabs = [...formData.accessory_slabs];
    updatedSlabs[index][field] = value;
    setFormData(prev => ({ ...prev, accessory_slabs: updatedSlabs }));
  };

  // ========== MODEL SLABS HANDLERS ==========
  const addModelSlab = () => {
    setFormData(prev => ({
      ...prev,
      model_slabs: [...prev.model_slabs, { model_id: null, slabs: [{ no: '', amount: '' }] }]
    }));
  };

  const removeModelSlab = (index) => {
    if (formData.model_slabs.length <= 1) {
      showError('At least one model slab is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      model_slabs: prev.model_slabs.filter((_, i) => i !== index)
    }));
  };

  const handleModelSelect = (index, selectedOption) => {
    const updatedSlabs = [...formData.model_slabs];
    updatedSlabs[index].model_id = selectedOption ? selectedOption.value : null;
    setFormData(prev => ({ ...prev, model_slabs: updatedSlabs }));
  };

  const addModelSubSlab = (modelIndex) => {
    const updatedSlabs = [...formData.model_slabs];
    updatedSlabs[modelIndex].slabs.push({ no: '', amount: '' });
    setFormData(prev => ({ ...prev, model_slabs: updatedSlabs }));
  };

  const removeModelSubSlab = (modelIndex, slabIndex) => {
    const updatedSlabs = [...formData.model_slabs];
    if (updatedSlabs[modelIndex].slabs.length <= 1) {
      showError('At least one slab is required');
      return;
    }
    updatedSlabs[modelIndex].slabs = updatedSlabs[modelIndex].slabs.filter((_, i) => i !== slabIndex);
    setFormData(prev => ({ ...prev, model_slabs: updatedSlabs }));
  };

  const handleModelSubSlabChange = (modelIndex, slabIndex, field, value) => {
    const updatedSlabs = [...formData.model_slabs];
    updatedSlabs[modelIndex].slabs[slabIndex][field] = value;
    setFormData(prev => ({ ...prev, model_slabs: updatedSlabs }));
  };

  // ========== VALIDATION ==========
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.scheme_name.trim()) {
      newErrors.scheme_name = 'Scheme name is required';
      isValid = false;
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
      isValid = false;
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
      isValid = false;
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
      isValid = false;
    }

    if (!formData.scheme_type) {
      newErrors.scheme_type = 'Scheme type is required';
      isValid = false;
    }

    if (formData.scheme_type === 'VOLUME') {
      formData.volume_slabs.forEach((slab, index) => {
        if (!slab.no || slab.no <= 0) {
          newErrors[`volume_${index}_no`] = 'Valid number is required';
          isValid = false;
        }
        if (!slab.amount || slab.amount <= 0) {
          newErrors[`volume_${index}_amount`] = 'Valid amount is required';
          isValid = false;
        }
      });
    }

    if (formData.scheme_type === 'ACCESSORIES') {
      formData.accessory_slabs.forEach((slab, index) => {
        if (!slab.amount || slab.amount <= 0) {
          newErrors[`accessory_${index}_amount`] = 'Valid amount is required';
          isValid = false;
        }
        if (!slab.incentive_amount || slab.incentive_amount <= 0) {
          newErrors[`accessory_${index}_incentive`] = 'Valid incentive amount is required';
          isValid = false;
        }
      });
    }

    if (formData.scheme_type === 'MODEL') {
      formData.model_slabs.forEach((modelSlab, modelIndex) => {
        if (!modelSlab.model_id) {
          newErrors[`model_${modelIndex}_id`] = 'Please select a model';
          isValid = false;
        }
        modelSlab.slabs.forEach((slab, slabIndex) => {
          if (!slab.no || slab.no <= 0) {
            newErrors[`model_${modelIndex}_slab_${slabIndex}_no`] = 'Valid number is required';
            isValid = false;
          }
          if (!slab.amount || slab.amount <= 0) {
            newErrors[`model_${modelIndex}_slab_${slabIndex}_amount`] = 'Valid amount is required';
            isValid = false;
          }
        });
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  // ========== SUBMIT ==========
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let payload = {
        scheme_name: formData.scheme_name.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        scheme_type: formData.scheme_type
      };

      if (formData.scheme_type === 'VOLUME') {
        payload.volume_slabs = formData.volume_slabs.map(slab => ({
          no: parseInt(slab.no),
          amount: parseInt(slab.amount)
        }));
      } else if (formData.scheme_type === 'ACCESSORIES') {
        payload.accessory_slabs = formData.accessory_slabs.map(slab => ({
          amount: parseInt(slab.amount),
          incentive_amount: parseInt(slab.incentive_amount)
        }));
      } else if (formData.scheme_type === 'MODEL') {
        payload.model_slabs = formData.model_slabs.map(modelSlab => ({
          model_id: modelSlab.model_id,
          slabs: modelSlab.slabs.map(slab => ({
            no: parseInt(slab.no),
            amount: parseInt(slab.amount)
          }))
        }));
      }

      if (isEditMode) {
        await axiosInstance.put(`/master-schema/${editData._id}`, payload);
        showSuccess('Schema updated successfully!');
      } else {
        await axiosInstance.post('/master-schema', payload);
        showSuccess('Schema created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving schema:', error);
      const message = error.response?.data?.message || 'Failed to save schema';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const modelOptions = models.map(model => ({
    value: model._id,
    label: model.model_name || model.display_name || model.name
  }));

  // Render scheme type specific fields
  const renderSchemeFields = () => {
    const { scheme_type } = formData;

    if (scheme_type === 'VOLUME') {
      return (
        <div className="scheme-fields-section">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Volume Slabs</h6>
            <CButton size="sm" color="primary" onClick={addVolumeSlab}>
              <CIcon icon={cilPlus} className="me-1" /> Add Slab
            </CButton>
          </div>
          {formData.volume_slabs.map((slab, index) => (
            <div key={index} className="card p-3 mb-2">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex flex-wrap gap-3 flex-grow-1">
                  <div style={{ minWidth: '140px' }}>
                    <CFormLabel className="small text-muted">Min Units</CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="e.g., 50"
                      value={slab.no}
                      onChange={(e) => handleVolumeSlabChange(index, 'no', e.target.value)}
                      className={errors[`volume_${index}_no`] ? 'is-invalid' : ''}
                    />
                    {errors[`volume_${index}_no`] && (
                      <div className="invalid-feedback">{errors[`volume_${index}_no`]}</div>
                    )}
                  </div>
                  <div style={{ minWidth: '140px' }}>
                    <CFormLabel className="small text-muted">Incentive (₹)</CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="e.g., 10000"
                      value={slab.amount}
                      onChange={(e) => handleVolumeSlabChange(index, 'amount', e.target.value)}
                      className={errors[`volume_${index}_amount`] ? 'is-invalid' : ''}
                    />
                    {errors[`volume_${index}_amount`] && (
                      <div className="invalid-feedback">{errors[`volume_${index}_amount`]}</div>
                    )}
                  </div>
                </div>
                <CButton
                  size="sm"
                  color="danger"
                  variant="outline"
                  onClick={() => removeVolumeSlab(index)}
                  className="ms-2"
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (scheme_type === 'ACCESSORIES') {
      return (
        <div className="scheme-fields-section">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Accessory Slabs</h6>
            <CButton size="sm" color="primary" onClick={addAccessorySlab}>
              <CIcon icon={cilPlus} className="me-1" /> Add Slab
            </CButton>
          </div>
          {formData.accessory_slabs.map((slab, index) => (
            <div key={index} className="card p-3 mb-2">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex flex-wrap gap-3 flex-grow-1">
                  <div style={{ minWidth: '140px' }}>
                    <CFormLabel className="small text-muted">Amount (₹)</CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="e.g., 5000"
                      value={slab.amount}
                      onChange={(e) => handleAccessorySlabChange(index, 'amount', e.target.value)}
                      className={errors[`accessory_${index}_amount`] ? 'is-invalid' : ''}
                    />
                    {errors[`accessory_${index}_amount`] && (
                      <div className="invalid-feedback">{errors[`accessory_${index}_amount`]}</div>
                    )}
                  </div>
                  <div style={{ minWidth: '140px' }}>
                    <CFormLabel className="small text-muted">Incentive (₹)</CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="e.g., 500"
                      value={slab.incentive_amount}
                      onChange={(e) => handleAccessorySlabChange(index, 'incentive_amount', e.target.value)}
                      className={errors[`accessory_${index}_incentive`] ? 'is-invalid' : ''}
                    />
                    {errors[`accessory_${index}_incentive`] && (
                      <div className="invalid-feedback">{errors[`accessory_${index}_incentive`]}</div>
                    )}
                  </div>
                </div>
                <CButton
                  size="sm"
                  color="danger"
                  variant="outline"
                  onClick={() => removeAccessorySlab(index)}
                  className="ms-2"
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (scheme_type === 'MODEL') {
      return (
        <div className="scheme-fields-section">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Model Slabs</h6>
            <CButton size="sm" color="primary" onClick={addModelSlab}>
              <CIcon icon={cilPlus} className="me-1" /> Add Model
            </CButton>
          </div>
          {formData.model_slabs.map((modelSlab, modelIndex) => (
            <div key={modelIndex} className="card p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="mb-3" style={{ maxWidth: '350px' }}>
                    <CFormLabel className="small text-muted">Select Model</CFormLabel>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Search model..."
                      options={modelOptions}
                      value={modelOptions.find(opt => opt.value === modelSlab.model_id)}
                      onChange={(selected) => handleModelSelect(modelIndex, selected)}
                      isLoading={loadingModels}
                      isClearable
                    />
                    {errors[`model_${modelIndex}_id`] && (
                      <div className="text-danger small mt-1">{errors[`model_${modelIndex}_id`]}</div>
                    )}
                  </div>

                  <div className="sub-slabs-container">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-muted">Slabs for this model</span>
                      <CButton
                        size="sm"
                        color="primary"
                        variant="outline"
                        onClick={() => addModelSubSlab(modelIndex)}
                      >
                        <CIcon icon={cilPlus} className="me-1" size="sm" /> Add Slab
                      </CButton>
                    </div>
                    {modelSlab.slabs.map((slab, slabIndex) => (
                      <div key={slabIndex} className="d-flex align-items-end gap-3 mb-2">
                        <div style={{ minWidth: '120px' }}>
                          <CFormLabel className="small text-muted">Min Units</CFormLabel>
                          <CFormInput
                            type="number"
                            placeholder="e.g., 50"
                            value={slab.no}
                            onChange={(e) => handleModelSubSlabChange(modelIndex, slabIndex, 'no', e.target.value)}
                            className={errors[`model_${modelIndex}_slab_${slabIndex}_no`] ? 'is-invalid' : ''}
                            size="sm"
                          />
                          {errors[`model_${modelIndex}_slab_${slabIndex}_no`] && (
                            <div className="invalid-feedback">{errors[`model_${modelIndex}_slab_${slabIndex}_no`]}</div>
                          )}
                        </div>
                        <div style={{ minWidth: '120px' }}>
                          <CFormLabel className="small text-muted">Incentive (₹)</CFormLabel>
                          <CFormInput
                            type="number"
                            placeholder="e.g., 10000"
                            value={slab.amount}
                            onChange={(e) => handleModelSubSlabChange(modelIndex, slabIndex, 'amount', e.target.value)}
                            className={errors[`model_${modelIndex}_slab_${slabIndex}_amount`] ? 'is-invalid' : ''}
                            size="sm"
                          />
                          {errors[`model_${modelIndex}_slab_${slabIndex}_amount`] && (
                            <div className="invalid-feedback">{errors[`model_${modelIndex}_slab_${slabIndex}_amount`]}</div>
                          )}
                        </div>
                        <CButton
                          size="sm"
                          color="danger"
                          variant="outline"
                          onClick={() => removeModelSubSlab(modelIndex, slabIndex)}
                          className="mb-1"
                        >
                          <CIcon icon={cilTrash} size="sm" />
                        </CButton>
                      </div>
                    ))}
                  </div>
                </div>
                <CButton
                  size="sm"
                  color="danger"
                  variant="outline"
                  onClick={() => removeModelSlab(modelIndex)}
                  className="ms-2"
                >
                  <CIcon icon={cilTrash} /> Remove
                </CButton>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <CModal 
      visible={visible} 
      onClose={handleClose} 
      size="xl" 
      scrollable
      alignment="center"
    >
      {/* Remove the close button from CModalHeader by using closeButton={false} */}
      <CModalHeader closeButton={false}>
        <CModalTitle>
          {isEditMode ? 'Edit Schema' : 'Add New Schema'}
        </CModalTitle>
        {/* Add only one close button at the right end */}
        <CButton 
          color="close" 
          onClick={handleClose} 
          disabled={loading}
          aria-label="Close"
        >
          ×
        </CButton>
      </CModalHeader>
      
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        
        <div>
          <div className="row">
            {/* Scheme Name */}
            <div className="col-md-6 mb-3">
              <CFormLabel className="fw-bold">Scheme Name <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="text"
                name="scheme_name"
                placeholder="Enter scheme name"
                value={formData.scheme_name}
                onChange={handleChange}
                className={errors.scheme_name ? 'is-invalid' : ''}
              />
              {errors.scheme_name && <div className="invalid-feedback">{errors.scheme_name}</div>}
            </div>

            {/* Scheme Type */}
            <div className="col-md-6 mb-3">
              <CFormLabel className="fw-bold">Scheme Type <span className="text-danger">*</span></CFormLabel>
              <CFormSelect
                name="scheme_type"
                value={formData.scheme_type}
                onChange={handleChange}
                className={errors.scheme_type ? 'is-invalid' : ''}
                disabled={isEditMode}
              >
                <option value="">- Select Type -</option>
                <option value="VOLUME">Volume</option>
                <option value="MODEL">Model</option>
                <option value="ACCESSORIES">Accessories</option>
              </CFormSelect>
              {errors.scheme_type && <div className="invalid-feedback">{errors.scheme_type}</div>}
              {isEditMode && (
                <small className="text-muted">Type cannot be changed in edit mode</small>
              )}
            </div>

            {/* Start Date */}
            <div className="col-md-6 mb-3">
              <CFormLabel className="fw-bold">Start Date <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) => handleDateChange('start_date', e.target.value)}
                className={errors.start_date ? 'is-invalid' : ''}
              />
              {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
            </div>

            {/* End Date */}
            <div className="col-md-6 mb-3">
              <CFormLabel className="fw-bold">End Date <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) => handleDateChange('end_date', e.target.value)}
                className={errors.end_date ? 'is-invalid' : ''}
              />
              {errors.end_date && <div className="invalid-feedback">{errors.end_date}</div>}
            </div>
          </div>

          {/* Dynamic Scheme Fields */}
          <div className="mt-3">
            {renderSchemeFields()}
          </div>
        </div>
      </CModalBody>
      
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </CButton>
        <CButton 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditMode ? 'Update Schema' : 'Create Schema'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddSchemaModal;