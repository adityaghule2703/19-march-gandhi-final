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
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilPhone, cilHome } from '@coreui/icons';
import { showError, axiosInstance } from '../../../utils/tableImports';
import Swal from 'sweetalert2';
import '../../../css/form.css';

const AddGodown = ({ show, onClose, onGodownSaved, editingGodown }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    branch: ''
  });
  const [branches, setBranches] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);

  useEffect(() => {
    if (editingGodown) {
      setFormData({
        name: editingGodown.name || '',
        mobile: editingGodown.mobile || '',
        branch:
          typeof editingGodown.branch === 'object'
            ? editingGodown.branch?._id || ''
            : editingGodown.branch || ''
      });
    } else {
      resetForm();
    }
  }, [editingGodown, show]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showError(error);
      } finally {
        setBranchesLoading(false);
      }
    };

    if (show) {
      fetchBranches();
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBranchChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, branch: value }));
    if (formErrors.branch) {
      setFormErrors((prev) => ({ ...prev, branch: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Godown name is required';
    }

    if (!formData.mobile || !formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.trim())) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.branch) {
      errors.branch = 'Branch is required';
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
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        branch: formData.branch
      };

      if (editingGodown) {
        await axiosInstance.put(`/godowns/${editingGodown._id}`, payload);
        onGodownSaved('Godown updated successfully');
      } else {
        await axiosInstance.post('/godowns', payload);
        onGodownSaved('Godown added successfully');
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving godown:', error);

      const errorMessage = error.response?.data?.message;

      if (errorMessage && errorMessage.includes('already exists')) {
        Swal.fire({
          title: 'Duplicate Godown!',
          text: errorMessage,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f0ad4e'
        });
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setFormErrors(serverErrors);
        if (error.response?.data?.message) {
          showError(error.response.data.message);
        }
      } else {
        showError(errorMessage || 'Failed to save godown');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      branch: ''
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>
          {editingGodown ? 'Edit Godown' : 'Add New Godown'}
        </CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-4">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="name" className="fw-semibold">
                  Godown Name <span className="required">*</span>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter godown name"
                    invalid={!!formErrors.name}
                  />
                </CInputGroup>
                {formErrors.name && (
                  <div className="error-text">{formErrors.name}</div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="mobile" className="fw-semibold">
                  Mobile <span className="required">*</span>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    invalid={!!formErrors.mobile}
                  />
                </CInputGroup>
                {formErrors.mobile && (
                  <div className="error-text">{formErrors.mobile}</div>
                )}
              </div>
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <CCol md={12}>
              <div className="mb-3">
                <CFormLabel htmlFor="branch" className="fw-semibold">
                  Branch <span className="required">*</span>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormSelect
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleBranchChange}
                    invalid={!!formErrors.branch}
                    disabled={branchesLoading}
                  >
                    <option value="">
                      {branchesLoading ? 'Loading branches...' : '-Select Branch-'}
                    </option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                        {branch.city ? ` - ${branch.city}` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {formErrors.branch && (
                  <div className="error-text">{formErrors.branch}</div>
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
            disabled={submitting}
          >
            {submitting ? (
              <CSpinner size="sm" />
            ) : editingGodown ? (
              'Update Godown'
            ) : (
              'Create Godown'
            )}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddGodown;