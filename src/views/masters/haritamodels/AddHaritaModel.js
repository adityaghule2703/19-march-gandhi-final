// src/components/harita/AddHaritaModel.jsx
import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilText,
  cilColorBorder,
  cilList,
  cilTag,
  cilBadge,
} from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  showFormSubmitError,
  showFormSubmitToast,
} from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddHaritaModel() {
  const [formData, setFormData] = useState({
    harita_model: '',
    harita_variant: '',
    advantage_model: '',
    advantage_variant: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchHaritaModel(id);
    }
  }, [id]);

  const fetchHaritaModel = async (id) => {
    try {
      const res = await axiosInstance.get(`/harita/${id}`);
      // Handle either { data: {...} } or { data: { data: {...} } }
      const model = res.data?.data || res.data;
      setFormData({
        harita_model: model.harita_model || '',
        harita_variant: model.harita_variant || '',
        advantage_model: model.advantage_model || '',
        advantage_variant: model.advantage_variant || '',
      });
    } catch (error) {
      console.error('Error fetching Harita model:', error);
      showFormSubmitError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.harita_model) formErrors.harita_model = 'This field is required';
    if (!formData.harita_variant) formErrors.harita_variant = 'This field is required';
    if (!formData.advantage_model) formErrors.advantage_model = 'This field is required';
    if (!formData.advantage_variant) formErrors.advantage_variant = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/harita/${id}`, formData);
        await showFormSubmitToast('Harita model updated successfully!', () =>
          navigate('/harita-models')
        );
      } else {
        await axiosInstance.post('/harita', formData);
        await showFormSubmitToast('Harita model added successfully!', () =>
          navigate('/harita-models')
        );
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/harita-models');
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Harita Model</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Harita Model</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilText} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="harita_model"
                    value={formData.harita_model}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.harita_model && (
                  <p className="error">{errors.harita_model}</p>
                )}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Harita Variant</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="harita_variant"
                    value={formData.harita_variant}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.harita_variant && (
                  <p className="error">{errors.harita_variant}</p>
                )}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Advantage Model</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="advantage_model"
                    value={formData.advantage_model}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.advantage_model && (
                  <p className="error">{errors.advantage_model}</p>
                )}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Advantage Variant</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBadge} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="advantage_variant"
                    value={formData.advantage_variant}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.advantage_variant && (
                  <p className="error">{errors.advantage_variant}</p>
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

export default AddHaritaModel;