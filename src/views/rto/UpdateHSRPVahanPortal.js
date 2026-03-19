import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CRow,
  CCol,
  CBackdrop,
  CAlert
} from '@coreui/react';
import '../../css/receipt.css';
import '../../css/form.css';
import axiosInstance from '../../axiosInstance';
import { showSuccess } from '../../utils/sweetAlerts';

const UpdateHSRPVahanPortal = ({ show, onClose, record, onUpdateSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [vahanPortalDate, setVahanPortalDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!vahanPortalDate) {
      setError('Please select Vahan Portal Date');
      setIsLoading(false);
      return;
    }

    try {
      if (!record || !record._id) {
        throw new Error('Invalid record data');
      }

      // Using the specific PATCH API endpoint with the record ID
      const response = await axiosInstance.patch(`/rtoProcess/update-vahan-portal-date/${record._id}`, {
        vahanPortalDate: vahanPortalDate
      });

      setSuccess('HSRP Vahan Portal date successfully updated!');
      showSuccess('HSRP Vahan Portal date updated successfully!');
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      // Close modal after success
      setTimeout(() => {
        onClose();
        setVahanPortalDate('');
      }, 1500);
    } catch (err) {
      console.error('HSRP Vahan Portal update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update HSRP Vahan Portal date. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(null);
      // Reset date field when modal opens
      setVahanPortalDate('');
    }
  }, [show]);

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center">
        <CModalHeader>
          <CModalTitle>HSRP UPDATE ON VAHAN PORTAL</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput 
                type="text" 
                value={record?.bookingId?.customerName || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput 
                type="text" 
                value={record?.bookingId?.chassisNumber || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
          </CRow>
          
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Booking Number</label>
              <CFormInput 
                type="text" 
                value={record?.bookingId?.bookingNumber || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Model Name</label>
              <CFormInput 
                type="text" 
                value={record?.bookingId?.model?.model_name || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
          </CRow>
          
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Vahan Portal Date *</label>
              <CFormInput 
                type="date" 
                value={vahanPortalDate} 
                onChange={(e) => setVahanPortalDate(e.target.value)} 
                required 
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between">
          <div>
            <CButton 
              color="primary" 
              onClick={handleSubmit} 
              className="me-2" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'UPDATE VAHAN PORTAL DATE'}
            </CButton>
          </div>
          <CButton 
            color="secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UpdateHSRPVahanPortal;