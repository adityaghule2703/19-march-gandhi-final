// EditDeliveryMaster.jsx
import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormSwitch,
  CButton,
  CSpinner,
  CRow,
  CCol
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';

const EditDeliveryMaster = ({ show, onClose, onSaved, deliveryMaster }) => {
  const [formData, setFormData] = useState({
    isExpected: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (deliveryMaster) {
      setFormData({
        isExpected: !!deliveryMaster.isExpected
      });
    } else {
      resetForm();
    }
  }, [deliveryMaster, show]);

  const handleToggleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      isExpected: e.target.checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.patch('/delivery-master', formData);
      onSaved('Delivery Master updated successfully');
    } catch (error) {
      console.error('Error saving Delivery Master:', error);
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ isExpected: false });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Edit Delivery Master</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="key">Key</CFormLabel>
                <div className="form-control-plaintext fw-semibold">
                  {deliveryMaster?.key || '-'}
                </div>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="isExpected">Is Expected</CFormLabel>
                <div className="d-flex align-items-center">
                  <CFormSwitch
                    id="isExpected"
                    name="isExpected"
                    checked={formData.isExpected}
                    onChange={handleToggleChange}
                  />
                  <span className="ms-2">
                    {formData.isExpected ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? <CSpinner size="sm" /> : 'Update'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default EditDeliveryMaster;