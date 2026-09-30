import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilText, cilUser, cilCalendar } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddGrantBuffer() {
  const [formData, setFormData] = useState({
    salesExecutiveId: '',
    bookingId: '',
    bufferDays: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch sales executives (role = SALES EXECUTIVE)
  useEffect(() => {
    const fetchSalesExecutives = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const users = Array.isArray(response.data.data) ? response.data.data : [];

        const filtered = users.filter((user) =>
          Array.isArray(user.roles)
            ? user.roles.some((r) => {
                if (typeof r?.name !== 'string') return false;
                const normalized = r.name.trim().toUpperCase().replace(/[\s-]+/g, '_');
                return normalized === 'SALES_EXECUTIVE';
              })
            : false
        );

        setSalesExecutives(filtered);
      } catch (error) {
        console.error('Failed to fetch sales executives:', error);
        setApiError(
          error?.response?.data?.message ||
          'Failed to fetch sales executives. Please refresh the page.'
        );
      }
    };
    fetchSalesExecutives();
  }, []);

  // Fetch bookings whenever sales executive changes
  useEffect(() => {
    const fetchBookings = async () => {
      if (!formData.salesExecutiveId) {
        setBookings([]);
        return;
      }
      try {
        setLoadingBookings(true);
        const response = await axiosInstance.get(
          `/bookings?salesExecutive=${formData.salesExecutiveId}`
        );
        const list = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.bookings || [];
        setBookings(list);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setBookings([]);
        setApiError(
          error?.response?.data?.message ||
          'Failed to fetch bookings. Please try again.'
        );
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [formData.salesExecutiveId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'salesExecutiveId') {
        return { ...prev, salesExecutiveId: value, bookingId: '' };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  // ---- Extract error message from various API error shapes ----
  const extractApiError = (error) => {
    // 1. Axios error with response body
    const data = error?.response?.data;
    if (data) {
      // e.g. { success: false, message: "..." }
      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
      }
      // e.g. { success: false, error: "..." }
      if (typeof data.error === 'string' && data.error.trim()) {
        return data.error;
      }
      // e.g. { success: false, errors: [{ message: "..." }] } or { errors: { field: "msg" } }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === 'string') return first;
        if (first?.message) return first.message;
      }
      if (data.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey) {
          const val = data.errors[firstKey];
          if (typeof val === 'string') return val;
          if (Array.isArray(val) && val.length) return val[0];
          if (val?.message) return val.message;
        }
      }
    }

    // 2. Generic axios message
    if (error?.message) return error.message;

    // 3. Fallback
    return 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    let formErrors = {};
    if (!formData.salesExecutiveId) formErrors.salesExecutiveId = 'Sales Executive is required';
    if (!formData.bookingId) formErrors.bookingId = 'Booking is required';
    if (!formData.bufferDays || Number(formData.bufferDays) <= 0)
      formErrors.bufferDays = 'Buffer Days must be greater than 0';
    if (!formData.reason) formErrors.reason = 'Reason is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        bookingId: formData.bookingId,
        salesExecutiveId: formData.salesExecutiveId,
        bufferDays: Number(formData.bufferDays),
        reason: formData.reason
      };

      await axiosInstance.post('/kyc-buffer/allocations', payload);
      await showFormSubmitToast('Buffer granted successfully!');
      navigate('/kyc-buffer-master/grant-buffer');
    } catch (error) {
      console.error('Error details:', error);
      const message = extractApiError(error);

      // Show inline banner in the form
      setApiError(message);

      // Also trigger the existing toast helper (it may render its own alert)
      showFormSubmitError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/kyc-buffer-master/grant-buffer');
  };

  return (
    <div className="form-container">
      <div className="title">Grant KYC Buffer</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {/* ---------- API ERROR BANNER ---------- */}
            {apiError && (
              <div className="alert alert-danger" role="alert">
                {apiError}
              </div>
            )}

            <div className="user-details">
              {/* Sales Executive */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Sales Executive</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect
                    name="salesExecutiveId"
                    value={formData.salesExecutiveId}
                    onChange={handleChange}
                  >
                    <option value="">-Select Sales Executive-</option>
                    {salesExecutives.map((se) => (
                      <option key={se._id} value={se._id}>
                        {se.name} {se.email ? `(${se.email})` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.salesExecutiveId && (
                  <p className="error">{errors.salesExecutiveId}</p>
                )}
              </div>

              {/* Booking */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Booking</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilText} />
                  </CInputGroupText>
                  <CFormSelect
                    name="bookingId"
                    value={formData.bookingId}
                    onChange={handleChange}
                    disabled={!formData.salesExecutiveId || loadingBookings}
                  >
                    <option value="">
                      {!formData.salesExecutiveId
                        ? '-Select Sales Executive first-'
                        : loadingBookings
                        ? 'Loading bookings...'
                        : '-Select Booking-'}
                    </option>
                    {bookings.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.bookingNumber || b._id}
                        {b.fullCustomerName ? ` — ${b.fullCustomerName}` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.bookingId && <p className="error">{errors.bookingId}</p>}
              </div>

              {/* Buffer Days */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Buffer Days</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    min="1"
                    name="bufferDays"
                    value={formData.bufferDays}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.bufferDays && <p className="error">{errors.bufferDays}</p>}
              </div>

              {/* Reason */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Reason</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilText} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="e.g. Customer traveling — needs extra time for KYC"
                  />
                </CInputGroup>
                {errors.reason && <p className="error">{errors.reason}</p>}
              </div>
            </div>

            <FormButtons onCancel={handleCancel} submitting={submitting} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddGrantBuffer;