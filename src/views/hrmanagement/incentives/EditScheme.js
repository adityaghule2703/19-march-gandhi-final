// EditScheme.js
import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CFormTextarea,
  CRow,
  CCol,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CCloseButton,
  CSpinner,
  CFormSwitch
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilBuilding,
  cilPeople,
  cilTag,
  cilList,
  cilPlus,
  cilTrash,
  cilWarning,
  cilInfo,
  cilCalendar,
  cilPencil,
  cilUser
} from '@coreui/icons';
import { axiosInstance, showError } from '../../../utils/tableImports';

// Period Type options - UPPERCASE
const PERIOD_TYPE_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CUSTOM', label: 'Custom' },
  { value: 'QUARTERLY', label: 'Quarterly' }
];

// Quarter options
const QUARTER_OPTIONS = [
  { value: 'Q1', label: 'Q1 (Jan - Mar)' },
  { value: 'Q2', label: 'Q2 (Apr - Jun)' },
  { value: 'Q3', label: 'Q3 (Jul - Sep)' },
  { value: 'Q4', label: 'Q4 (Oct - Dec)' }
];

// Month options
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString('default', { month: 'long' })
}));

// Year options - Only current year
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [{ value: currentYear, label: currentYear }];

// Status options - Only ACTIVE
const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', color: 'success' }
];

const SLAB_TYPE_OPTIONS = [
  { value: 'FLAT', label: 'Flat' },
  { value: 'SLAB', label: 'Slab' }
];

const EditScheme = ({
  visible,
  onClose,
  formData,
  setFormData,
  formErrors,
  apiError,
  setApiError,
  formLoading,
  allBranches,
  subdealers,
  headers,
  accessories,
  models,
  isSuperAdmin,
  branches,
  selectedScheme,
  handleScopeChange,
  removeScopeItem,
  getSelectedScopeNames,
  handleHeaderChange,
  removeHeader,
  getSelectedHeaderNames,
  handleAccessoryChange,
  removeAccessory,
  getSelectedAccessoryNames,
  addSlab,
  removeSlab,
  updateSlab,
  addModelIncentive,
  removeModelIncentive,
  updateModelIncentive,
  onSubmit
}) => {
  // State for roles
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Fetch roles when modal opens
  useEffect(() => {
    if (visible) {
      fetchRoles();
    }
  }, [visible]);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await axiosInstance.get('/roles');
      if (response.data.status === 'success') {
        const activeRoles = response.data.data.filter(role => role.is_active === true);
        setRoles(activeRoles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      showError(error);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleRoleChange = (roleId) => {
    if (!roleId) return;
    
    const selectedRoleObj = roles.find(r => r._id === roleId);
    if (!selectedRoleObj) return;
    
    if (formData.applicableRoles && formData.applicableRoles.includes(roleId)) {
      setSelectedRole('');
      return;
    }
    
    const updatedRoles = [...(formData.applicableRoles || []), roleId];
    setFormData({ ...formData, applicableRoles: updatedRoles });
    setSelectedRole('');
    setApiError(null);
  };

  const removeRole = (roleId) => {
    const updatedRoles = (formData.applicableRoles || []).filter(id => id !== roleId);
    setFormData({ ...formData, applicableRoles: updatedRoles });
    setApiError(null);
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r._id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  // Helper function to get error message from API response
  const getErrorMessage = (error) => {
    if (!error) return 'An unexpected error occurred';
    if (typeof error === 'string') return error;
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (data.error) return data.error;
      if (data.message) return data.message;
    }
    if (error.data) {
      if (error.data.error) return error.data.error;
      if (error.data.message) return error.data.message;
    }
    if (error.error) return error.error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  };

  const displayErrorMessage = apiError ? getErrorMessage(apiError) : '';

  // Check if we have formData
  if (!formData || !formData.params) {
    return null;
  }

  // Safely get addon services data with fallback
  const getAddonServices = () => {
    return formData.params.addonServicesAndAccessories || formData.params.addonServices || {
      isEnabled: false,
      deductItemDiscount: false,
      applicableHeaders: [],
      applicableAccessories: [],
      slabs: []
    };
  };

  const addonServices = getAddonServices();

  return (
    <CModal size="xl" visible={visible} onClose={onClose} alignment="center" scrollable>
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilPencil} className="me-2" />
          Edit Scheme - {selectedScheme?.title || ''}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* API Error Alert */}
        {apiError && (
          <CAlert color="danger" className="mb-3" onClose={() => setApiError(null)} dismissible>
            <div className="d-flex align-items-start">
              <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
              <div>
                <strong>Error!</strong>
                <p className="mb-0 mt-1">{displayErrorMessage}</p>
              </div>
            </div>
          </CAlert>
        )}
        
        {/* Form Validation Errors */}
        {Object.keys(formErrors).length > 0 && (
          <CAlert color="danger" className="mb-3">
            <strong>Please fix the following errors:</strong>
            <ul className="mb-0 mt-1">
              {Object.values(formErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </CAlert>
        )}

        <CRow className="mb-3">
          <CCol md={8}>
            <label className="form-label">Title <span className="required">*</span></label>
            <CFormInput
              value={formData.title || ''}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) {
                  const newErrors = { ...formErrors };
                  delete newErrors.title;
                  setFormErrors(newErrors);
                }
                setApiError(null);
              }}
              placeholder="Enter scheme title"
              className={formErrors.title ? 'is-invalid' : ''}
            />
            {formErrors.title && <small className="text-danger">{formErrors.title}</small>}
          </CCol>
          <CCol md={4}>
            <label className="form-label">Period Type <span className="required">*</span></label>
            <CFormSelect
              value={formData.periodType || 'MONTHLY'}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  periodType: e.target.value,
                  month: '',
                  year: currentYear,
                  validFrom: '',
                  validTo: '',
                  quarter: ''
                });
                if (formErrors.periodType) {
                  const newErrors = { ...formErrors };
                  delete newErrors.periodType;
                  setFormErrors(newErrors);
                }
                setApiError(null);
              }}
              className={formErrors.periodType ? 'is-invalid' : ''}
            >
              {PERIOD_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </CFormSelect>
            {formErrors.periodType && <small className="text-danger">{formErrors.periodType}</small>}
          </CCol>
        </CRow>

        {/* Monthly Fields */}
        {formData.periodType === 'MONTHLY' && (
          <CRow className="mb-3">
            <CCol md={4}>
              <label className="form-label">Month <span className="required">*</span></label>
              <CFormSelect
                value={formData.month || ''}
                onChange={(e) => {
                  setFormData({ ...formData, month: parseInt(e.target.value) });
                  if (formErrors.month) {
                    const newErrors = { ...formErrors };
                    delete newErrors.month;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.month ? 'is-invalid' : ''}
              >
                <option value="">-- Select Month --</option>
                {MONTH_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.month && <small className="text-danger">{formErrors.month}</small>}
            </CCol>
            <CCol md={4}>
              <label className="form-label">Year <span className="required">*</span></label>
              <CFormSelect
                value={formData.year || currentYear}
                onChange={(e) => {
                  setFormData({ ...formData, year: parseInt(e.target.value) });
                  if (formErrors.year) {
                    const newErrors = { ...formErrors };
                    delete newErrors.year;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.year ? 'is-invalid' : ''}
                disabled
              >
                {YEAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.year && <small className="text-danger">{formErrors.year}</small>}
            </CCol>
          </CRow>
        )}

        {/* Custom Fields */}
        {formData.periodType === 'CUSTOM' && (
          <CRow className="mb-3">
            <CCol md={4}>
              <label className="form-label">Valid From <span className="required">*</span></label>
              <CFormInput
                type="date"
                value={formData.validFrom || ''}
                onChange={(e) => {
                  setFormData({ ...formData, validFrom: e.target.value });
                  if (formErrors.validFrom) {
                    const newErrors = { ...formErrors };
                    delete newErrors.validFrom;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.validFrom ? 'is-invalid' : ''}
              />
              {formErrors.validFrom && <small className="text-danger">{formErrors.validFrom}</small>}
            </CCol>
            <CCol md={4}>
              <label className="form-label">Valid To <span className="required">*</span></label>
              <CFormInput
                type="date"
                value={formData.validTo || ''}
                onChange={(e) => {
                  setFormData({ ...formData, validTo: e.target.value });
                  if (formErrors.validTo) {
                    const newErrors = { ...formErrors };
                    delete newErrors.validTo;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.validTo ? 'is-invalid' : ''}
              />
              {formErrors.validTo && <small className="text-danger">{formErrors.validTo}</small>}
            </CCol>
          </CRow>
        )}

        {/* Quarterly Fields */}
        {formData.periodType === 'QUARTERLY' && (
          <CRow className="mb-3">
            <CCol md={4}>
              <label className="form-label">Quarter <span className="required">*</span></label>
              <CFormSelect
                value={formData.quarter || ''}
                onChange={(e) => {
                  setFormData({ ...formData, quarter: e.target.value });
                  if (formErrors.quarter) {
                    const newErrors = { ...formErrors };
                    delete newErrors.quarter;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.quarter ? 'is-invalid' : ''}
              >
                <option value="">-- Select Quarter --</option>
                {QUARTER_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.quarter && <small className="text-danger">{formErrors.quarter}</small>}
            </CCol>
            <CCol md={4}>
              <label className="form-label">Year <span className="required">*</span></label>
              <CFormSelect
                value={formData.year || currentYear}
                onChange={(e) => {
                  setFormData({ ...formData, year: parseInt(e.target.value) });
                  if (formErrors.year) {
                    const newErrors = { ...formErrors };
                    delete newErrors.year;
                    setFormErrors(newErrors);
                  }
                  setApiError(null);
                }}
                className={formErrors.year ? 'is-invalid' : ''}
                disabled
              >
                {YEAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.year && <small className="text-danger">{formErrors.year}</small>}
            </CCol>
          </CRow>
        )}

        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">Total Incentive Pool (₹) <span className="required">*</span></label>
            <CFormInput
              type="number"
              step="1"
              value={formData.totalIncentivePool || ''}
              onChange={(e) => {
                setFormData({ ...formData, totalIncentivePool: parseInt(e.target.value) || 0 });
                if (formErrors.totalIncentivePool) {
                  const newErrors = { ...formErrors };
                  delete newErrors.totalIncentivePool;
                  setFormErrors(newErrors);
                }
                setApiError(null);
              }}
              placeholder="Enter total incentive pool amount"
              className={formErrors.totalIncentivePool ? 'is-invalid' : ''}
            />
            {formErrors.totalIncentivePool && <small className="text-danger">{formErrors.totalIncentivePool}</small>}
          </CCol>
          <CCol md={6}>
            <label className="form-label">Subdealer Scheme</label>
            <CFormCheck
              label="Enable for Subdealers"
              checked={formData.isSubdealerScheme || false}
              onChange={(e) => {
                setFormData({ ...formData, isSubdealerScheme: e.target.checked, scope: { branches: [], subdealers: [] } });
                setApiError(null);
              }}
            />
          </CCol>
        </CRow>

        {/* Applicable Roles */}
        <CRow className="mb-3">
          <CCol md={12}>
            <label className="form-label">Applicable Roles</label>
            <CInputGroup>
              <CInputGroupText className="input-icon">
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormSelect
                value={selectedRole}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    handleRoleChange(value);
                  }
                }}
                disabled={rolesLoading || formLoading}
              >
                <option value="">{rolesLoading ? 'Loading roles...' : '-Select Role-'}</option>
                {roles
                  .filter(role => !(formData.applicableRoles || []).includes(role._id))
                  .map(role => (
                    <option key={role._id} value={role._id}>
                      {role.name} {role.description ? `- ${role.description}` : ''}
                    </option>
                  ))}
              </CFormSelect>
            </CInputGroup>
            
            <div className="mt-2">
              <div className="d-flex flex-wrap gap-2">
                {(formData.applicableRoles || []).map((roleId) => (
                  <CBadge 
                    key={roleId} 
                    color="info"
                    className="d-flex align-items-center"
                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                  >
                    <CIcon icon={cilUser} className="me-1" size="sm" />
                    {getRoleName(roleId)}
                    <CCloseButton 
                      className="ms-2"
                      onClick={() => removeRole(roleId)}
                      style={{ fontSize: '0.75rem' }}
                      disabled={formLoading}
                    />
                  </CBadge>
                ))}
              </div>
              <small className="text-muted">
                {(formData.applicableRoles || []).length} role(s) selected
              </small>
            </div>
          </CCol>
        </CRow>

        {/* Scope Section - Branches/Subdealers */}
        <CRow className="mb-3">
          <CCol md={12}>
            <label className="form-label">
              {formData.isSubdealerScheme ? 'Applicable Subdealers' : 'Applicable Branches'}
            </label>
            <CInputGroup>
              <CInputGroupText className="input-icon">
                <CIcon icon={formData.isSubdealerScheme ? cilPeople : cilBuilding} />
              </CInputGroupText>
              <CFormSelect
                value=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    handleScopeChange(formData.isSubdealerScheme ? 'subdealers' : 'branches', value);
                    e.target.value = '';
                  }
                }}
                disabled={formLoading}
              >
                <option value="">-Select {formData.isSubdealerScheme ? 'Subdealer' : 'Branch'}-</option>
                {formData.isSubdealerScheme ? (
                  subdealers
                    .filter(s => !formData.scope.subdealers.includes(s._id))
                    .map(subdealer => (
                      <option key={subdealer._id} value={subdealer._id}>
                        {subdealer.name} - {subdealer.branchDetails?.name || 'N/A'}
                      </option>
                    ))
                ) : (
                  allBranches
                    .filter(b => !formData.scope.branches.includes(b._id))
                    .map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name} - {branch.city}
                      </option>
                    ))
                )}
              </CFormSelect>
            </CInputGroup>
            
            <div className="mt-2">
              <div className="d-flex flex-wrap gap-2">
                {getSelectedScopeNames(formData.isSubdealerScheme ? 'subdealers' : 'branches').map((name, index) => {
                  const id = formData.scope[formData.isSubdealerScheme ? 'subdealers' : 'branches'][index];
                  return (
                    <CBadge 
                      key={`${id}_${index}`} 
                      color="primary"
                      className="d-flex align-items-center"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                    >
                      {String(name)}
                      <CCloseButton 
                        className="ms-2"
                        onClick={() => removeScopeItem(formData.isSubdealerScheme ? 'subdealers' : 'branches', id)}
                        style={{ fontSize: '0.75rem' }}
                        disabled={formLoading}
                      />
                    </CBadge>
                  );
                })}
              </div>
              <small className="text-muted">
                {formData.scope[formData.isSubdealerScheme ? 'subdealers' : 'branches'].length} selected
              </small>
            </div>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={12}>
            <label className="form-label">Remarks</label>
            <CFormTextarea
              value={formData.remarks || ''}
              onChange={(e) => {
                setFormData({ ...formData, remarks: e.target.value });
                setApiError(null);
              }}
              rows={2}
              placeholder="Enter remarks (optional)"
            />
          </CCol>
        </CRow>

        {/* Volume Slab Section */}
        <div className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Volume Slab</h6>
            <CFormSwitch
              label="Enable"
              checked={formData.params?.volumeSlab?.isEnabled || false}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setFormData({
                  ...formData,
                  params: {
                    ...formData.params,
                    volumeSlab: {
                      isEnabled: isEnabled,
                      slabType: isEnabled ? (formData.params?.volumeSlab?.slabType || 'SLAB') : 'SLAB',
                      slabs: isEnabled ? (formData.params?.volumeSlab?.slabs || []) : []
                    }
                  }
                });
                setApiError(null);
              }}
            />
          </div>
          
          {formData.params?.volumeSlab?.isEnabled && (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <label className="form-label">Slab Type</label>
                  <CFormSelect
                    value={formData.params.volumeSlab.slabType || 'SLAB'}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        params: {
                          ...formData.params,
                          volumeSlab: {
                            ...formData.params.volumeSlab,
                            isEnabled: true,
                            slabType: e.target.value
                          }
                        }
                      });
                      setApiError(null);
                    }}
                  >
                    {SLAB_TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Volume Slabs</strong>
                <CButton size="sm" color="primary" onClick={() => addSlab('volumeSlab')}>
                  <CIcon icon={cilPlus} className="me-1" /> Add Slab
                </CButton>
              </div>
              {formData.params.volumeSlab.slabs?.map((slab, index) => (
                <CRow key={index} className="mb-2 align-items-end">
                  <CCol md={3}>
                    <label className="form-label">From</label>
                    <CFormInput
                      type="number"
                      value={slab.from}
                      onChange={(e) => updateSlab('volumeSlab', index, 'from', e.target.value)}
                      placeholder="From"
                      className={formErrors[`volume_from_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`volume_from_${index}`] && <small className="text-danger">{formErrors[`volume_from_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">To</label>
                    <CFormInput
                      type="number"
                      value={slab.to}
                      onChange={(e) => updateSlab('volumeSlab', index, 'to', e.target.value)}
                      placeholder="To"
                      className={formErrors[`volume_to_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`volume_to_${index}`] && <small className="text-danger">{formErrors[`volume_to_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">Amount (₹)</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={slab.amount}
                      onChange={(e) => updateSlab('volumeSlab', index, 'amount', e.target.value)}
                      placeholder="Amount"
                      className={formErrors[`volume_amount_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`volume_amount_${index}`] && <small className="text-danger">{formErrors[`volume_amount_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <CButton color="danger" size="sm" onClick={() => removeSlab('volumeSlab', index)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              ))}
              {(!formData.params.volumeSlab.slabs || formData.params.volumeSlab.slabs.length === 0) && (
                <p className="text-muted text-center mb-0">No slabs added. Click "Add Slab" to create one.</p>
              )}
            </>
          )}
        </div>

        {/* Addon Services Section */}
        <div className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Addon Services & Accessories</h6>
            <CFormSwitch
              label="Enable"
              checked={addonServices.isEnabled || false}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setFormData({
                  ...formData,
                  params: {
                    ...formData.params,
                    addonServicesAndAccessories: {
                      isEnabled: isEnabled,
                      deductItemDiscount: false,
                      applicableHeaders: [],
                      applicableAccessories: [],
                      slabs: []
                    }
                  }
                });
                setApiError(null);
              }}
            />
          </div>
          
          {addonServices.isEnabled && (
            <>
              {/* Deduct Item Discount */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormCheck
                    label="Deduct Item Discount"
                    checked={addonServices.deductItemDiscount || false}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        params: {
                          ...formData.params,
                          addonServicesAndAccessories: {
                            ...addonServices,
                            isEnabled: true,
                            deductItemDiscount: e.target.checked
                          }
                        }
                      });
                      setApiError(null);
                    }}
                  />
                  <small className="text-muted">Enable to deduct item discount from addon services</small>
                </CCol>
              </CRow>

              {/* Applicable Headers */}
              <div className="mb-3">
                <label className="form-label">Applicable Headers</label>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormSelect
                    value=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        handleHeaderChange(value);
                        e.target.value = '';
                      }
                    }}
                    disabled={formLoading}
                  >
                    <option value="">-Select Header-</option>
                    {headers
                      .filter(h => !(addonServices.applicableHeaders || []).some(
                        item => item.header === h._id
                      ))
                      .map(header => (
                        <option key={header._id} value={header._id}>
                          {header.header_key} - {header.category_key} ({header.type})
                        </option>
                      ))}
                  </CFormSelect>
                </CInputGroup>
                
                <div className="mt-2">
                  <div className="d-flex flex-wrap gap-2">
                    {(addonServices.applicableHeaders || []).map((item) => (
                      <CBadge 
                        key={item.header} 
                        color="info"
                        className="d-flex align-items-center"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      >
                        {item.headerName || item.header}
                        <CCloseButton 
                          className="ms-2"
                          onClick={() => removeHeader(item.header)}
                          style={{ fontSize: '0.75rem' }}
                          disabled={formLoading}
                        />
                      </CBadge>
                    ))}
                  </div>
                  <small className="text-muted">
                    {(addonServices.applicableHeaders || []).length} header(s) selected
                  </small>
                </div>
              </div>

              {/* Applicable Accessories */}
              <div className="mb-3">
                <label className="form-label">Applicable Accessories</label>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormSelect
                    value=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        handleAccessoryChange(value);
                        e.target.value = '';
                      }
                    }}
                    disabled={formLoading}
                  >
                    <option value="">-Select Accessory-</option>
                    {accessories
                      .filter(a => !(addonServices.applicableAccessories || []).some(
                        item => item.accessory === a._id
                      ))
                      .map(accessory => (
                        <option key={accessory._id} value={accessory._id}>
                          {accessory.name} - ₹{accessory.price}
                        </option>
                      ))}
                  </CFormSelect>
                </CInputGroup>
                
                <div className="mt-2">
                  <div className="d-flex flex-wrap gap-2">
                    {(addonServices.applicableAccessories || []).map((item) => (
                      <CBadge 
                        key={item.accessory} 
                        color="success"
                        className="d-flex align-items-center"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      >
                        {item.accessoryName || item.accessory}
                        <CCloseButton 
                          className="ms-2"
                          onClick={() => removeAccessory(item.accessory)}
                          style={{ fontSize: '0.75rem' }}
                          disabled={formLoading}
                        />
                      </CBadge>
                    ))}
                  </div>
                  <small className="text-muted">
                    {(addonServices.applicableAccessories || []).length} accessory(ies) selected
                  </small>
                </div>
              </div>

              {/* Addon Slabs */}
              <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                <strong>Addon Slabs</strong>
                <CButton size="sm" color="primary" onClick={() => addSlab('addonServicesAndAccessories')}>
                  <CIcon icon={cilPlus} className="me-1" /> Add Slab
                </CButton>
              </div>
              {(addonServices.slabs || []).map((slab, index) => (
                <CRow key={index} className="mb-2 align-items-end">
                  <CCol md={3}>
                    <label className="form-label">From (₹)</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={slab.from}
                      onChange={(e) => updateSlab('addonServicesAndAccessories', index, 'from', e.target.value)}
                      placeholder="From"
                      className={formErrors[`addon_from_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`addon_from_${index}`] && <small className="text-danger">{formErrors[`addon_from_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">To (₹)</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={slab.to}
                      onChange={(e) => updateSlab('addonServicesAndAccessories', index, 'to', e.target.value)}
                      placeholder="To"
                      className={formErrors[`addon_to_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`addon_to_${index}`] && <small className="text-danger">{formErrors[`addon_to_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">Amount</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={slab.amount}
                      onChange={(e) => updateSlab('addonServicesAndAccessories', index, 'amount', e.target.value)}
                      placeholder="Amount"
                      className={formErrors[`addon_amount_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`addon_amount_${index}`] && <small className="text-danger">{formErrors[`addon_amount_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <CButton color="danger" size="sm" onClick={() => removeSlab('addonServicesAndAccessories', index)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              ))}
              {(!addonServices.slabs || addonServices.slabs.length === 0) && (
                <p className="text-muted text-center mb-0">No slabs added. Click "Add Slab" to create one.</p>
              )}
            </>
          )}
        </div>

        {/* Model Incentive Section */}
        <div className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Model Incentive</h6>
            <CFormSwitch
              label="Enable"
              checked={formData.params?.modelIncentive?.isEnabled || false}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setFormData({
                  ...formData,
                  params: {
                    ...formData.params,
                    modelIncentive: {
                      isEnabled: isEnabled,
                      modelIncentives: []
                    }
                  }
                });
                setApiError(null);
              }}
            />
          </div>
          
          {formData.params?.modelIncentive?.isEnabled && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Model Incentives</strong>
                <CButton size="sm" color="primary" onClick={addModelIncentive}>
                  <CIcon icon={cilPlus} className="me-1" /> Add Model
                </CButton>
              </div>
              {(formData.params.modelIncentive.modelIncentives || []).map((item, index) => (
                <CRow key={index} className="mb-2 align-items-end">
                  <CCol md={4}>
                    <label className="form-label">Model</label>
                    <CFormSelect
                      value={item.model || ''}
                      onChange={(e) => {
                        const selectedModel = models.find(m => m.id === e.target.value);
                        updateModelIncentive(index, 'model', e.target.value);
                        updateModelIncentive(index, 'modelName', selectedModel?.name || '');
                        if (formErrors[`model_name_${index}`]) {
                          const newErrors = { ...formErrors };
                          delete newErrors[`model_name_${index}`];
                          setFormErrors(newErrors);
                        }
                        setApiError(null);
                      }}
                      className={formErrors[`model_name_${index}`] ? 'is-invalid' : ''}
                    >
                      <option value="">-- Select Model --</option>
                      {models.map(model => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </CFormSelect>
                    {formErrors[`model_name_${index}`] && <small className="text-danger">{formErrors[`model_name_${index}`]}</small>}
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label">Amount Per Unit (₹)</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={item.amountPerUnit || ''}
                      onChange={(e) => {
                        updateModelIncentive(index, 'amountPerUnit', parseInt(e.target.value) || 0);
                        if (formErrors[`model_amount_${index}`]) {
                          const newErrors = { ...formErrors };
                          delete newErrors[`model_amount_${index}`];
                          setFormErrors(newErrors);
                        }
                        setApiError(null);
                      }}
                      placeholder="Amount"
                      className={formErrors[`model_amount_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`model_amount_${index}`] && <small className="text-danger">{formErrors[`model_amount_${index}`]}</small>}
                  </CCol>
                  <CCol md={4}>
                    <CButton color="danger" size="sm" onClick={() => removeModelIncentive(index)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              ))}
              {(!formData.params.modelIncentive.modelIncentives || 
                formData.params.modelIncentive.modelIncentives.length === 0) && (
                <p className="text-muted text-center mb-0">No models added. Click "Add Model" to create one.</p>
              )}
            </>
          )}
        </div>

        {/* Exchange Slab Section */}
        <div className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Exchange Slab</h6>
            <CFormSwitch
              label="Enable"
              checked={formData.params?.exchangeSlab?.isEnabled || false}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setFormData({
                  ...formData,
                  params: {
                    ...formData.params,
                    exchangeSlab: {
                      isEnabled: isEnabled,
                      slabs: []
                    }
                  }
                });
                setApiError(null);
              }}
            />
          </div>
          
          {formData.params?.exchangeSlab?.isEnabled && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Exchange Slabs</strong>
                <CButton size="sm" color="primary" onClick={() => addSlab('exchangeSlab')}>
                  <CIcon icon={cilPlus} className="me-1" /> Add Slab
                </CButton>
              </div>
              {(formData.params.exchangeSlab.slabs || []).map((slab, index) => (
                <CRow key={index} className="mb-2 align-items-end">
                  <CCol md={3}>
                    <label className="form-label">From</label>
                    <CFormInput
                      type="number"
                      value={slab.from}
                      onChange={(e) => updateSlab('exchangeSlab', index, 'from', e.target.value)}
                      placeholder="From"
                      className={formErrors[`exchange_from_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`exchange_from_${index}`] && <small className="text-danger">{formErrors[`exchange_from_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">To</label>
                    <CFormInput
                      type="number"
                      value={slab.to}
                      onChange={(e) => updateSlab('exchangeSlab', index, 'to', e.target.value)}
                      placeholder="To"
                      className={formErrors[`exchange_to_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`exchange_to_${index}`] && <small className="text-danger">{formErrors[`exchange_to_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">Amount (₹)</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={slab.amount}
                      onChange={(e) => updateSlab('exchangeSlab', index, 'amount', e.target.value)}
                      placeholder="Amount"
                      className={formErrors[`exchange_amount_${index}`] ? 'is-invalid' : ''}
                    />
                    {formErrors[`exchange_amount_${index}`] && <small className="text-danger">{formErrors[`exchange_amount_${index}`]}</small>}
                  </CCol>
                  <CCol md={3}>
                    <CButton color="danger" size="sm" onClick={() => removeSlab('exchangeSlab', index)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              ))}
              {(!formData.params.exchangeSlab.slabs || 
                formData.params.exchangeSlab.slabs.length === 0) && (
                <p className="text-muted text-center mb-0">No slabs added. Click "Add Slab" to create one.</p>
              )}
            </>
          )}
        </div>

        {/* Manager Incentive Section */}
        <div className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Manager Incentive</h6>
            <CFormSwitch
              label="Enable"
              checked={formData.params?.managerIncentive?.isEnabled || false}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setFormData({
                  ...formData,
                  params: {
                    ...formData.params,
                    managerIncentive: {
                      isEnabled: isEnabled,
                      perChassisAmount: 0,
                      volumeSlab: []
                    }
                  }
                });
                setApiError(null);
              }}
            />
          </div>
          
          {formData.params?.managerIncentive?.isEnabled && (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <label className="form-label">Per Chassis Amount (₹)</label>
                  <CFormInput
                    type="number"
                    step="1"
                    value={formData.params.managerIncentive.perChassisAmount || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        params: {
                          ...formData.params,
                          managerIncentive: {
                            ...formData.params.managerIncentive,
                            isEnabled: true,
                            perChassisAmount: parseInt(e.target.value) || 0
                          }
                        }
                      });
                      setApiError(null);
                    }}
                    placeholder="Enter per chassis amount"
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Volume Slabs</strong>
                <CButton size="sm" color="primary" onClick={() => {
                  const slabs = formData.params.managerIncentive.volumeSlab || [];
                  setFormData({
                    ...formData,
                    params: {
                      ...formData.params,
                      managerIncentive: {
                        ...formData.params.managerIncentive,
                        isEnabled: true,
                        volumeSlab: [...slabs, { from: 0, to: null, amount: 0 }]
                      }
                    }
                  });
                }}>
                  <CIcon icon={cilPlus} className="me-1" /> Add Slab
                </CButton>
              </div>
              {(formData.params.managerIncentive.volumeSlab || []).map((slab, index) => (
                <CRow key={index} className="mb-2 align-items-end">
                  <CCol md={3}>
                    <label className="form-label">From</label>
                    <CFormInput
                      type="number"
                      value={slab.from}
                      onChange={(e) => {
                        const slabs = [...(formData.params.managerIncentive.volumeSlab || [])];
                        slabs[index].from = parseInt(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          params: {
                            ...formData.params,
                            managerIncentive: {
                              ...formData.params.managerIncentive,
                              isEnabled: true,
                              volumeSlab: slabs
                            }
                          }
                        });
                      }}
                      placeholder="From"
                    />
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">To</label>
                    <CFormInput
                      type="number"
                      value={slab.to}
                      onChange={(e) => {
                        const slabs = [...(formData.params.managerIncentive.volumeSlab || [])];
                        slabs[index].to = e.target.value ? parseInt(e.target.value) : null;
                        setFormData({
                          ...formData,
                          params: {
                            ...formData.params,
                            managerIncentive: {
                              ...formData.params.managerIncentive,
                              isEnabled: true,
                              volumeSlab: slabs
                            }
                          }
                        });
                      }}
                      placeholder="To"
                    />
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label">Amount (₹)</label>
                    <CFormInput
                      type="number"
                      step="1"
                      value={slab.amount}
                      onChange={(e) => {
                        const slabs = [...(formData.params.managerIncentive.volumeSlab || [])];
                        slabs[index].amount = parseInt(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          params: {
                            ...formData.params,
                            managerIncentive: {
                              ...formData.params.managerIncentive,
                              isEnabled: true,
                              volumeSlab: slabs
                            }
                          }
                        });
                      }}
                      placeholder="Amount"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CButton color="danger" size="sm" onClick={() => {
                      const slabs = [...(formData.params.managerIncentive.volumeSlab || [])];
                      slabs.splice(index, 1);
                      setFormData({
                        ...formData,
                        params: {
                          ...formData.params,
                          managerIncentive: {
                            ...formData.params.managerIncentive,
                            isEnabled: true,
                            volumeSlab: slabs
                          }
                        }
                      });
                    }}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              ))}
              {(!formData.params.managerIncentive.volumeSlab || 
                formData.params.managerIncentive.volumeSlab.length === 0) && (
                <p className="text-muted text-center mb-0">No slabs added. Click "Add Slab" to create one.</p>
              )}
            </>
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
        <CButton color="primary" onClick={onSubmit} disabled={formLoading}>
          {formLoading ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Scheme'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditScheme;