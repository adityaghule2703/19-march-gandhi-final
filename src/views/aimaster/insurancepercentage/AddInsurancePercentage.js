import '../../../css/table.css';
import { useNavigate } from 'react-router-dom';

import {
  React,
  useState,
  axiosInstance,
  showError
} from '../../../utils/tableImports';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CFormSelect,
  CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave } from '@coreui/icons';
import { showFormSubmitToast } from '../../../utils/sweetAlerts';

const API_ENDPOINT = '/insurancePercentage';

const initialFormState = {
  insuranceCompany: '',
  motorPercentage: '',
  scooterPercentage: '',
  evPercentage: '',
  priority: '1',
  isActive: true,
  description: ''
};

const AddInsurancePercentage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.insuranceCompany || !formData.insuranceCompany.trim()) {
      errors.insuranceCompany = 'Insurance company is required';
    }
    
    // Validate Motor Percentage
    if (formData.motorPercentage === '' || formData.motorPercentage === null || isNaN(formData.motorPercentage)) {
      errors.motorPercentage = 'Motor percentage is required and must be a number';
    } else if (Number(formData.motorPercentage) < 0 || Number(formData.motorPercentage) > 100) {
      errors.motorPercentage = 'Motor percentage must be between 0 and 100';
    }
    
    // Validate Scooter Percentage
    if (formData.scooterPercentage === '' || formData.scooterPercentage === null || isNaN(formData.scooterPercentage)) {
      errors.scooterPercentage = 'Scooter percentage is required and must be a number';
    } else if (Number(formData.scooterPercentage) < 0 || Number(formData.scooterPercentage) > 100) {
      errors.scooterPercentage = 'Scooter percentage must be between 0 and 100';
    }
    
    // Validate EV Percentage
    if (formData.evPercentage === '' || formData.evPercentage === null || isNaN(formData.evPercentage)) {
      errors.evPercentage = 'EV percentage is required and must be a number';
    } else if (Number(formData.evPercentage) < 0 || Number(formData.evPercentage) > 100) {
      errors.evPercentage = 'EV percentage must be between 0 and 100';
    }
    
    if (!formData.priority || formData.priority === '') {
      errors.priority = 'Priority is required';
    } else if (isNaN(formData.priority) || Number(formData.priority) < 1) {
      errors.priority = 'Priority must be a number greater than 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      isActive: !!formData.isActive,
      description: formData.description ? formData.description.trim() : ''
    };

    try {
      setSubmitting(true);
      await axiosInstance.post(API_ENDPOINT, payload);
      await showFormSubmitToast('Insurance Percentage added successfully!', () => navigate('/insurance-percentage'));
    } catch (error) {
      console.error('Error adding insurance percentage:', error);
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="title">Add Insurance Percentage</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <CButton size="sm" className="action-btn" onClick={() => navigate('/insurance-percentage')}>
            <CIcon icon={cilArrowLeft} className="icon me-1" />
            Back
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            {/* Insurance Company */}
            <div className="mb-3">
              <CFormLabel htmlFor="insuranceCompany">
                Insurance Company <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="insuranceCompany"
                type="text"
                value={formData.insuranceCompany}
                onChange={(e) => handleChange('insuranceCompany', e.target.value)}
                invalid={!!formErrors.insuranceCompany}
                placeholder="e.g. ABC Insurance"
              />
              {formErrors.insuranceCompany && (
                <div className="text-danger small mt-1">{formErrors.insuranceCompany}</div>
              )}
            </div>

            {/* Motor Percentage */}
            <div className="mb-3">
              <CFormLabel htmlFor="motorPercentage">
                Motor Percentage <span className="text-danger">*</span>
              </CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="motorPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.motorPercentage}
                  onChange={(e) => handleChange('motorPercentage', e.target.value)}
                  invalid={!!formErrors.motorPercentage}
                  placeholder="e.g. 75.5"
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
              {formErrors.motorPercentage && <div className="text-danger small mt-1">{formErrors.motorPercentage}</div>}
            </div>

            {/* Scooter Percentage */}
            <div className="mb-3">
              <CFormLabel htmlFor="scooterPercentage">
                Scooter Percentage <span className="text-danger">*</span>
              </CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="scooterPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.scooterPercentage}
                  onChange={(e) => handleChange('scooterPercentage', e.target.value)}
                  invalid={!!formErrors.scooterPercentage}
                  placeholder="e.g. 65.0"
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
              {formErrors.scooterPercentage && <div className="text-danger small mt-1">{formErrors.scooterPercentage}</div>}
            </div>

            {/* EV Percentage */}
            <div className="mb-3">
              <CFormLabel htmlFor="evPercentage">
                EV Percentage <span className="text-danger">*</span>
              </CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="evPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.evPercentage}
                  onChange={(e) => handleChange('evPercentage', e.target.value)}
                  invalid={!!formErrors.evPercentage}
                  placeholder="e.g. 85.5"
                />
                <CInputGroupText>%</CInputGroupText>
              </CInputGroup>
              {formErrors.evPercentage && <div className="text-danger small mt-1">{formErrors.evPercentage}</div>}
            </div>

            {/* Priority */}
            <div className="mb-3">
              <CFormLabel htmlFor="priority">
                Priority <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="priority"
                type="number"
                min="1"
                step="1"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                invalid={!!formErrors.priority}
                placeholder="e.g. 1"
              />
              <small className="text-muted">Lower number means higher priority (1 = highest)</small>
              {formErrors.priority && <div className="text-danger small mt-1">{formErrors.priority}</div>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Enter description (optional)"
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <CFormSwitch
                id="isActive"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
            </div>

            <CButton type="submit" className="action-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <CSpinner size="sm" className="me-1" />
                  Saving...
                </>
              ) : (
                <>
                  <CIcon icon={cilSave} className="me-1" />
                  Save
                </>
              )}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AddInsurancePercentage;