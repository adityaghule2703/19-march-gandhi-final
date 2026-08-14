import React, { useEffect, useState } from 'react';
import './insuranceform.css'; 
import { CInputGroup, CInputGroupText, CFormInput, CFormSwitch, CAlert, CButton, CFormTextarea } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilCheckCircle, cilList } from '@coreui/icons';
import { cilMoney } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

const API_ENDPOINT = '/insurancePercentage';

function UpdateInsurancePercentage() {
  const [formData, setFormData] = useState({
    insuranceCompany: '',
    motorPercentage: '',
    scooterPercentage: '',
    evPercentage: '',
    priority: '',
    isActive: true,
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Debug: Log the ID to ensure it's being passed correctly
  console.log('Update ID:', id);

  useEffect(() => {
    if (id) {
      fetchInsurancePercentage(id);
    } else {
      console.error('No ID provided in URL');
      setError('Invalid ID provided');
    }
  }, [id]);

  const fetchInsurancePercentage = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching insurance percentage with ID: ${id}`);
      
      const res = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
      console.log('Full API Response:', res);
      console.log('Response data:', res.data);
      
      let record = {};
      
      if (res.data) {
        if (res.data.data) {
          record = res.data.data;
        } else {
          record = res.data;
        }
      }

      console.log('Extracted record:', record);

      setFormData({
        insuranceCompany: record.insuranceCompany || '',
        motorPercentage: record.percentages?.motor ?? '',
        scooterPercentage: record.percentages?.scooter ?? '',
        evPercentage: record.percentages?.ev ?? '',
        priority: record.priority ?? '1',
        isActive: record.isActive !== undefined ? record.isActive : true,
        description: record.description || ''
      });
    } catch (error) {
      console.error('Error fetching insurance percentage:', error);
      const message = showError(error);
      if (message) {
        setError(message);
      } else {
        setError('Failed to load insurance percentage details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: val }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: checked }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.insuranceCompany.trim()) {
      formErrors.insuranceCompany = 'Insurance company name is required';
    }
    
    // Validate Motor Percentage
    if (formData.motorPercentage === '' || Number(formData.motorPercentage) < 0 || Number(formData.motorPercentage) > 100) {
      formErrors.motorPercentage = 'Valid motor percentage between 0 and 100 is required';
    }
    
    // Validate Scooter Percentage
    if (formData.scooterPercentage === '' || Number(formData.scooterPercentage) < 0 || Number(formData.scooterPercentage) > 100) {
      formErrors.scooterPercentage = 'Valid scooter percentage between 0 and 100 is required';
    }
    
    // Validate EV Percentage
    if (formData.evPercentage === '' || Number(formData.evPercentage) < 0 || Number(formData.evPercentage) > 100) {
      formErrors.evPercentage = 'Valid EV percentage between 0 and 100 is required';
    }
    
    if (!formData.priority || formData.priority === '') {
      formErrors.priority = 'Priority is required';
    } else if (isNaN(formData.priority) || Number(formData.priority) < 1) {
      formErrors.priority = 'Priority must be a number greater than 0';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      insuranceCompany: formData.insuranceCompany.trim(),
      percentages: {
        motor: Number(formData.motorPercentage),
        scooter: Number(formData.scooterPercentage),
        ev: Number(formData.evPercentage)
      },
      priority: Number(formData.priority),
      isActive: formData.isActive,
      description: formData.description ? formData.description.trim() : ''
    };

    try {
      setLoading(true);
      await axiosInstance.put(`${API_ENDPOINT}/${id}`, payload);
      await showFormSubmitToast('Insurance Percentage updated successfully!', () => navigate('/insurance-percentage'));
    } catch (error) {
      console.error('Error submitting form:', error);
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/insurance-percentage');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading insurance percentage details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="alert alert-danger" role="alert">
          {error}
          <br />
          <CButton 
            className="mt-2" 
            color="primary" 
            size="sm" 
            onClick={() => navigate('/insurance-percentage')}
          >
            Go Back
          </CButton>
        </div>
      </div>
    );
  }

  return (
    <div className="insurance-form-container">
      <div className="insurance-title">Update Insurance Percentage</div>
      <div className="insurance-form-card">
        <div className="insurance-form-body">
          <form onSubmit={handleSubmit}>
            <div className="insurance-user-details">
              {/* Row 1: Insurance Company */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">Insurance Company</span>
                  <span className="insurance-required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="insuranceCompany"
                    value={formData.insuranceCompany}
                    onChange={handleChange}
                    placeholder="Enter insurance company name"
                    className="insurance-form-control"
                  />
                </CInputGroup>
                {errors.insuranceCompany && <p className="insurance-error">{errors.insuranceCompany}</p>}
              </div>

              {/* Row 2: Motor Percentage */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">Motor Percentage</span>
                  <span className="insurance-required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilMoney} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="motorPercentage"
                    value={formData.motorPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter motor percentage (0-100)"
                    className="insurance-form-control"
                  />
                </CInputGroup>
                {errors.motorPercentage && <p className="insurance-error">{errors.motorPercentage}</p>}
              </div>

              {/* Row 3: Scooter Percentage */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">Scooter Percentage</span>
                  <span className="insurance-required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilMoney} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="scooterPercentage"
                    value={formData.scooterPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter scooter percentage (0-100)"
                    className="insurance-form-control"
                  />
                </CInputGroup>
                {errors.scooterPercentage && <p className="insurance-error">{errors.scooterPercentage}</p>}
              </div>

              {/* Row 4: EV Percentage */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">EV Percentage</span>
                  <span className="insurance-required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilMoney} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="evPercentage"
                    value={formData.evPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter EV percentage (0-100)"
                    className="insurance-form-control"
                  />
                </CInputGroup>
                {errors.evPercentage && <p className="insurance-error">{errors.evPercentage}</p>}
              </div>

              {/* Row 5: Priority */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">Priority</span>
                  <span className="insurance-required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    placeholder="Enter priority (1 = highest)"
                    className="insurance-form-control"
                  />
                </CInputGroup>
                <small className="text-muted" style={{ display: 'block', marginTop: '5px' }}>
                  Lower number means higher priority (1 = highest)
                </small>
                {errors.priority && <p className="insurance-error">{errors.priority}</p>}
              </div>

              {/* Row 6: Description */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">Description</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter description (optional)"
                    className="insurance-form-control"
                  />
                </CInputGroup>
              </div>

              {/* Row 7: Status */}
              <div className="insurance-input-box insurance-full-width">
                <div className="insurance-details-container">
                  <span className="insurance-details">Status</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="insurance-input-icon">
                    <CIcon icon={cilCheckCircle} />
                  </CInputGroupText>
                  <CFormSwitch
                    name="isActive"
                    label={formData.isActive ? 'Active' : 'Inactive'}
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    className="insurance-form-control insurance-switch"
                  />
                </CInputGroup>
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateInsurancePercentage;