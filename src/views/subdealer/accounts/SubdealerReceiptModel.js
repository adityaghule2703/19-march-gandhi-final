import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CBackdrop,
  CAlert
} from '@coreui/react';
import '../../../css/receipt.css';
import axiosInstance from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SubdealerReceiptModal = ({ show, onClose, bookingData }) => {
  const [formData, setFormData] = useState({
    bookingId: bookingData?._id || '',
    totalAmount: bookingData?.discountedAmount || 0,
    balanceAmount: bookingData?.balanceAmount || bookingData?.discountedAmount || 0,
    financeProviderId: '',
    disbursementReference: '',
    amount: '',
  });

  const [selectedFinancer, setSelectedFinancer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'amount') {
      const amountValue = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        balanceAmount: parseFloat(prev.totalAmount) - amountValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let paymentData = {
        bookingId: formData.bookingId,
        financeProviderId: formData.financeProviderId,
        disbursementReference: formData.disbursementReference,
        amount: parseFloat(formData.amount)
      };

      const response = await axiosInstance.post('/finance-disbursements', paymentData);

      setSuccess('Payment successfully recorded!');
      console.log('Payment response:', response.data);

      setFormData({
        bookingId: bookingData?._id || '',
        totalAmount: bookingData?.discountedAmount || 0,
        balanceAmount: bookingData?.discountedAmount || 0,
        financeProviderId: '',
        disbursementReference: '',
        amount: ''
      });

      setTimeout(() => {
        onClose();
      }, 2000);
      navigate('/view-ledgers');
    } catch (err) {
      console.error('Payment error:', err);
      const apiError = err.response?.data;
      setError(
        apiError?.error || apiError?.message || 'Failed to process payment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show && bookingData) {
      // Extract the financer from the booking data
      const financer = bookingData.payment?.financer;
      
      if (financer && financer._id && financer.name) {
        setSelectedFinancer(financer);
        // Auto-select the financer from the booking
        setFormData(prev => ({
          ...prev,
          bookingId: bookingData._id || '',
          totalAmount: bookingData.discountedAmount || 0,
          balanceAmount: bookingData.balanceAmount || bookingData.discountedAmount || 0,
          financeProviderId: financer._id // Auto-set the finance provider ID
        }));
      } else {
        setSelectedFinancer(null);
        setFormData(prev => ({
          ...prev,
          bookingId: bookingData._id || '',
          totalAmount: bookingData.discountedAmount || 0,
          balanceAmount: bookingData.balanceAmount || bookingData.discountedAmount || 0,
          financeProviderId: ''
        }));
        if (!financer) {
          setError('No financer information found for this booking');
        }
      }
      
      setError(null);
      setSuccess(null);
    }
  }, [show, bookingData]);

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center">
        <CModalHeader className="text-white" style={{ backgroundColor: '#243c7c' }}>
          <CModalTitle className="text-white">Account Receipt</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          <div className="booking-header mb-2 p-1 bg-light rounded">
            <h5 className="mb-0">
              Booking Number: <strong>{bookingData?.bookingNumber || ''}</strong>
            </h5>
          </div>
          <hr></hr>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput type="text" value={bookingData?.customerDetails?.name || ''} readOnly className="bg-light" />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput type="text" value={bookingData?.chassisNumber || ''} readOnly className="bg-light" />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Total Amount (₹)</label>
              <CFormInput type="number" name="totalAmount" value={formData.totalAmount} readOnly className="bg-light font-weight-bold" />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Balance Amount (₹)</label>
              <CFormInput
                type="number"
                name="balanceAmount"
                value={formData.balanceAmount}
                readOnly
                className={`bg-light font-weight-bold ${parseFloat(formData.balanceAmount) > 0 ? 'text-danger' : 'text-success'}`}
              />
            </CCol>
          </CRow>

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Mode of Payment</label>
                <CFormSelect 
                  name="modeOfPayment" 
                  value="Finance Disbursement" 
                  disabled={true}
                >
                  <option value="Finance Disbursement">Finance Disbursement</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label className="form-label">Finance Provider</label>
                <CFormInput
                  type="text"
                  value={selectedFinancer?.name || 'No financer assigned'}
                  readOnly
                  className="bg-light"
                  disabled={isLoading}
                />
                {/* Hidden input to store the financeProviderId */}
                <input
                  type="hidden"
                  name="financeProviderId"
                  value={formData.financeProviderId}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Amount (₹)</label>
                <CFormInput
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  max={formData.balanceAmount}
                  step="0.01"
                  disabled={isLoading || !selectedFinancer}
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Disbursement Reference</label>
                <CFormInput
                  type="text"
                  name="disbursementReference"
                  value={formData.disbursementReference}
                  onChange={handleChange}
                  placeholder="Enter disbursement reference number..."
                  disabled={isLoading}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between">
          <div>
            <CButton 
              color="primary" 
              onClick={handleSubmit} 
              className="me-2" 
              disabled={isLoading || !selectedFinancer || !formData.amount || parseFloat(formData.amount) <= 0}
            >
              {isLoading ? 'Processing...' : 'Save Payment'}
            </CButton>
          </div>
          <CButton color="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default SubdealerReceiptModal;