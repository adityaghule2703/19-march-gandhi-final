// AddBranchAuditModal.js
import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CAlert
} from '@coreui/react';
import {
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';

const AddBranchAuditModal = ({
  show,
  onClose,
  onSaved,
  editingAudit,
  branches,
  isBranchUser,
  userBranchId,
  userBranchName
}) => {
  const [formData, setFormData] = useState({
    branch: '',
    auditType: 'weekly',
    day: 'monday',
    dayOfMonth: '',
    remarks: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingAudit) {
      setFormData({
        branch: editingAudit.branch,
        auditType: editingAudit.auditType,
        day: editingAudit.day,
        dayOfMonth: editingAudit.dayOfMonth || '',
        remarks: editingAudit.remarks,
        status: editingAudit.status
      });
    } else {
      // Set default branch for branch users
      if (isBranchUser && userBranchId) {
        setFormData(prev => ({
          ...prev,
          branch: userBranchId
        }));
      } else {
        setFormData({
          branch: '',
          auditType: 'weekly',
          day: 'monday',
          dayOfMonth: '',
          remarks: '',
          status: 'active'
        });
      }
    }
  }, [editingAudit, isBranchUser, userBranchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      const payload = {
        branch: formData.branch,
        auditType: formData.auditType,
        remarks: formData.remarks,
        status: formData.status
      };

      // Add day or dayOfMonth based on audit type
      if (formData.auditType === 'weekly') {
        payload.day = formData.day;
      } else if (formData.auditType === 'monthly') {
        payload.dayOfMonth = parseInt(formData.dayOfMonth);
      }

      if (editingAudit) {
        // Update existing audit
        await axiosInstance.put(`/branch-audits/schedule/${editingAudit._id}`, payload);
        showSuccess('Audit schedule updated successfully!');
        onSaved('Audit schedule updated successfully!');
      } else {
        // Create new audit
        await axiosInstance.post('/branch-audits/schedule', payload);
        showSuccess('Audit schedule created successfully!');
        onSaved('Audit schedule created successfully!');
      }
    } catch (err) {
      const message = showError(err);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const monthDays = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `Day ${i + 1}`
  }));

  return (
    <CModal size="lg" visible={show} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{editingAudit ? 'Edit Branch Audit Schedule' : 'Add New Branch Audit Schedule'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}
        
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel>Branch</CFormLabel>
            {isBranchUser ? (
              <CFormInput
                type="text"
                value={userBranchName || 'Your Branch'}
                readOnly
                disabled
              />
            ) : (
              <CFormSelect
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Branch</option>
                {branches
                  .filter(branch => branch.is_active !== false)
                  .map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name} - {branch.city}, {branch.state}
                    </option>
                  ))}
              </CFormSelect>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel>Audit Type</CFormLabel>
            <CFormSelect
              name="auditType"
              value={formData.auditType}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              {/* Removed quarterly and annual options */}
            </CFormSelect>
          </div>

          {formData.auditType === 'weekly' && (
            <div className="mb-3">
              <CFormLabel>Day of Week</CFormLabel>
              <CFormSelect
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </CFormSelect>
            </div>
          )}

          {formData.auditType === 'monthly' && (
            <div className="mb-3">
              <CFormLabel>Day of Month</CFormLabel>
              <CFormSelect
                name="dayOfMonth"
                value={formData.dayOfMonth}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Day</option>
                {monthDays.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </CFormSelect>
            </div>
          )}

          <div className="mb-3">
            <CFormLabel>Remarks</CFormLabel>
            <CFormTextarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              placeholder="Enter remarks for this audit schedule"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Status</CFormLabel>
            <CFormSelect
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </CFormSelect>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSubmit}
          disabled={loading || (!isBranchUser && !formData.branch)}
        >
          {loading ? 'Saving...' : editingAudit ? 'Update' : 'Save'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddBranchAuditModal;