import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilText, cilPlus, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

// Roles allowed to appear in the "Add Manager" dropdown.
// Compared after normalization (uppercase + spaces/hyphens → underscore).
const ALLOWED_OVERRIDE_ROLES = [
  'MANAGER',
  'GENERAL_MANAGER',
  'ACCOUNT_MANAGER',
];

const normalizeRole = (name) =>
  typeof name === 'string'
    ? name.trim().toUpperCase().replace(/[\s-]+/g, '_')
    : '';

function UpdateKycSettings() {
  const [formData, setFormData] = useState({
    defaultKYCDays: 1,
    note: '',
    managerOverrides: {}
  });
  const [errors, setErrors] = useState({});
  const [managers, setManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch existing settings + managers
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [settingsRes, usersRes] = await Promise.all([
          axiosInstance.get(`/kyc-buffer/settings`),
          axiosInstance.get(`/users`)
        ]);

        const s = settingsRes.data.data || {};
        setFormData({
          defaultKYCDays: s.defaultKYCDays ?? 1,
          note: s.note ?? '',
          managerOverrides: s.managerOverrides ?? {}
        });

        const users = Array.isArray(usersRes.data.data) ? usersRes.data.data : [];
        const managerUsers = users.filter((user) =>
          Array.isArray(user.roles)
            ? user.roles.some((r) =>
                ALLOWED_OVERRIDE_ROLES.includes(normalizeRole(r?.name))
              )
            : false
        );
        setManagers(managerUsers);
      } catch (error) {
        console.error('Error fetching KYC settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOverrideChange = (managerId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      managerOverrides: {
        ...prev.managerOverrides,
        [managerId]: {
          ...prev.managerOverrides[managerId],
          [field]: value
        }
      }
    }));
  };

  const handleAddManager = () => {
    if (!selectedManagerId) return;
    if (formData.managerOverrides[selectedManagerId]) {
      setSelectedManagerId('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      managerOverrides: {
        ...prev.managerOverrides,
        [selectedManagerId]: { maxDays: 1, reason: '' }
      }
    }));
    setSelectedManagerId('');
  };

  const handleRemoveManager = (managerId) => {
    setFormData((prev) => {
      const copy = { ...prev.managerOverrides };
      delete copy[managerId];
      return { ...prev, managerOverrides: copy };
    });
  };

  const getManagerName = (id) => {
    const m = managers.find((u) => u._id === id);
    return m ? m.name : id;
  };

  const getManagerEmail = (id) => {
    const m = managers.find((u) => u._id === id);
    return m ? m.email : '';
  };

  // Helper to display the primary role of a manager in the dropdown
  const getManagerRoleLabel = (user) => {
    if (!Array.isArray(user.roles)) return '';
    const role = user.roles.find((r) =>
      ALLOWED_OVERRIDE_ROLES.includes(normalizeRole(r?.name))
    );
    return role ? role.name : '';
  };

  const availableManagers = managers.filter(
    (m) => !formData.managerOverrides[m._id]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (formData.defaultKYCDays === '' || formData.defaultKYCDays === null) {
      formErrors.defaultKYCDays = 'Default KYC Days is required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      // Build payload
      const payloadOverrides = {};
      Object.entries(formData.managerOverrides).forEach(([id, val]) => {
        payloadOverrides[id] = {
          maxDays: Number(val.maxDays) || 0,
          reason: val.reason || ''
        };
      });

      const payload = {
        defaultKYCDays: Number(formData.defaultKYCDays) || 0,
        managerOverrides: payloadOverrides,
        note: formData.note
      };

      await axiosInstance.post(`/kyc-buffer/settings`, payload);
      await showFormSubmitToast('KYC settings updated successfully!');
      navigate('/kyc-buffer-master/kyc-settings');
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/kyc-buffer-master/kyc-settings');
  };

  if (loading) {
    return <div className="form-container">Loading...</div>;
  }

  return (
    <div className="form-container">
      <div className="title">Update KYC Buffer Settings</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              {/* Default KYC Days */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Default KYC Days</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilText} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    min="0"
                    name="defaultKYCDays"
                    value={formData.defaultKYCDays}
                    onChange={handleChange}
                  />
                </CInputGroup>
                {errors.defaultKYCDays && (
                  <p className="error">{errors.defaultKYCDays}</p>
                )}
              </div>

              {/* Note */}
              <div className="input-box">
                <span className="details">Note</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilText} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="e.g. Q1 2025 policy setting"
                  />
                </CInputGroup>
              </div>
            </div>

            {/* Manager Overrides Section */}
            <div className="offer-container">
              <h4>Manager Overrides</h4>

              {Object.keys(formData.managerOverrides).length === 0 ? (
                <p className="text-muted">No manager overrides added yet.</p>
              ) : (
                <div className="responsive-table-wrapper">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Manager</th>
                        <th>Email</th>
                        <th>Max Days</th>
                        <th>Reason</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(formData.managerOverrides).map(
                        ([managerId, override]) => (
                          <tr key={managerId}>
                            <td>
                              <strong>{getManagerName(managerId)}</strong>
                            </td>
                            <td>{getManagerEmail(managerId) || '—'}</td>
                            <td>
                              <CFormInput
                                type="number"
                                min="0"
                                value={override.maxDays ?? ''}
                                onChange={(e) =>
                                  handleOverrideChange(
                                    managerId,
                                    'maxDays',
                                    e.target.value
                                  )
                                }
                                style={{ maxWidth: '120px' }}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="text"
                                value={override.reason ?? ''}
                                onChange={(e) =>
                                  handleOverrideChange(
                                    managerId,
                                    'reason',
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. Senior Manager - extended authority"
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveManager(managerId)}
                              >
                                <CIcon icon={cilTrash} /> Remove
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add manager dropdown */}
              <div className="d-flex align-items-center mt-3">
                <label className="me-2 mb-0">Add Manager:</label>
                <CFormSelect
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  style={{ maxWidth: '420px', marginRight: '8px' }}
                >
                  <option value="">— Select a manager —</option>
                  {availableManagers.map((m) => {
                    const roleLabel = getManagerRoleLabel(m);
                    return (
                      <option key={m._id} value={m._id}>
                        {m.name}
                        {roleLabel ? ` (${roleLabel})` : ''}
                        {m.email ? ` — ${m.email}` : ''}
                      </option>
                    );
                  })}
                </CFormSelect>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleAddManager}
                  disabled={!selectedManagerId}
                >
                  <CIcon icon={cilPlus} className="me-1" /> Add
                </button>
              </div>
            </div>

            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateKycSettings;