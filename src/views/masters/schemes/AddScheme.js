// AddScheme.jsx
import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDescription, cilText, cilTag, cilCalendar, cilSearch } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  showFormSubmitError,
  showFormSubmitToast
} from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';
import '../../../css/offer.css';

function AddScheme() {
  const [formData, setFormData] = useState({
    scheme_name: '',
    type: '',
    description: '',
    status: 'active',
    applicable_models: [],
    valid_from: '',
    valid_till: ''
  });
  const [errors, setErrors] = useState({});
  const [models, setModels] = useState([]);
  const [modelSearch, setModelSearch] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch models list
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axiosInstance.get('/models');
        setModels(response.data.data.models || []);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };
    fetchModels();
  }, []);

  // Fetch scheme for edit
  useEffect(() => {
    if (id) fetchScheme(id);
  }, [id]);

  const fetchScheme = async (id) => {
    try {
      const res = await axiosInstance.get(`/schemes/${id}`);
      const scheme = res.data.data.scheme || res.data.data;
      setFormData({
        scheme_name: scheme.scheme_name || '',
        type: scheme.type || '',
        description: scheme.description || '',
        status: scheme.status || 'active',
        applicable_models: scheme.applicable_models || [],
        valid_from: scheme.valid_from
          ? new Date(scheme.valid_from).toISOString().split('T')[0]
          : '',
        valid_till: scheme.valid_till
          ? new Date(scheme.valid_till).toISOString().split('T')[0]
          : ''
      });
    } catch (error) {
      console.error('Error fetching scheme', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleModelSelect = (modelId) => {
    setFormData((prev) => {
      const isSelected = prev.applicable_models.includes(modelId);
      return {
        ...prev,
        applicable_models: isSelected
          ? prev.applicable_models.filter((mid) => mid !== modelId)
          : [...prev.applicable_models, modelId]
      };
    });
    setErrors((prev) => ({ ...prev, applicable_models: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.scheme_name) formErrors.scheme_name = 'Scheme name is required';
    if (!formData.type) formErrors.type = 'Type is required';
    if (!formData.description) formErrors.description = 'Description is required';
    if (!formData.status) formErrors.status = 'Status is required';
    if (formData.applicable_models.length === 0) {
      formErrors.applicable_models = 'Select at least one model';
    }
    if (!formData.valid_from) formErrors.valid_from = 'Valid from date is required';
    if (!formData.valid_till) formErrors.valid_till = 'Valid till date is required';
    if (
      formData.valid_from &&
      formData.valid_till &&
      new Date(formData.valid_from) > new Date(formData.valid_till)
    ) {
      formErrors.valid_till = 'Valid till must be after valid from';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      scheme_name: formData.scheme_name,
      type: formData.type,
      applicable_models: formData.applicable_models,
      description: formData.description,
      status: formData.status,
      valid_from: new Date(formData.valid_from).toISOString(),
      valid_till: new Date(`${formData.valid_till}T23:59:59`).toISOString()
    };

    try {
      if (id) {
        await axiosInstance.put(`/schemes/${id}`, payload);
        await showFormSubmitToast('Scheme updated successfully!');
      } else {
        await axiosInstance.post('/schemes', payload);
        await showFormSubmitToast('Scheme added successfully!');
      }
      navigate('/schemes/scheme-list');
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/schemes/scheme-list');
  };

  // Filter models based on search input
  const filteredModels = models.filter((model) =>
    model.model_name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Scheme</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              {/* Scheme Name */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Scheme Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilText} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="scheme_name"
                    value={formData.scheme_name}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.scheme_name && <p className="error">{errors.scheme_name}</p>}
              </div>

              {/* Type */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormSelect
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    <option value="cash">Cash</option>
                    <option value="finance">Finance</option>
                    <option value="both">Both</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.type && <p className="error">{errors.type}</p>}
              </div>

              {/* Status */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Status</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormSelect
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.status && <p className="error">{errors.status}</p>}
              </div>

              {/* Valid From */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Valid From</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="date"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.valid_from && <p className="error">{errors.valid_from}</p>}
              </div>

              {/* Valid Till */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Valid Till</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="date"
                    name="valid_till"
                    value={formData.valid_till}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.valid_till && <p className="error">{errors.valid_till}</p>}
              </div>

              {/* Description */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Description</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDescription} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.description && <p className="error">{errors.description}</p>}
              </div>
            </div>

            {/* Applicable Models */}
            <div className="offer-container">
              <div className="permissions-form">
                <div className="details-container">
                  <h4>Applicable Models</h4>
                  <span className="required">*</span>
                </div>

                {/* Search input for models */}
                <div className="model-search-box" style={{ marginBottom: '15px' }}>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                    />
                  </CInputGroup>
                </div>

                <div className="permissions-grid">
                  {filteredModels.length > 0 ? (
                    filteredModels.map((model) => {
                      const isSelected = formData.applicable_models.includes(model._id);
                      return (
                        <div key={model._id} className="permission-item">
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleModelSelect(model._id)}
                            />
                            {model.model_name}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-results">No models found</p>
                  )}
                </div>
                {errors.applicable_models && (
                  <p className="error">{errors.applicable_models}</p>
                )}
              </div>
            </div>

            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddScheme;