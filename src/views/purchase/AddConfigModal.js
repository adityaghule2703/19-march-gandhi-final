import React, { useState } from 'react';
import '../../css/form.css';
import { 
  CInputGroup, 
  CInputGroupText, 
  CFormInput, 
  CFormSelect, 
  CFormCheck, 
  CButton, 
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilMoney, 
  cilCalendar, 
  cilBell, 
  cilChartLine, 
  cilCloudDownload,
  cilCheckCircle,
  cilWarning,
  cilUser,
  cilInstitution,
  cilList,
  cilTask,
  cilShieldAlt
} from '@coreui/icons';
import { axiosInstance, showError, showSuccess } from '../../utils/tableImports';

const AddConfigModal = ({ visible, onClose, model, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    configType: 'BOTH',
    thirtyDayConfig: {
      safetyStockPercentage: 40,
      leadTimeDays: 10,
      alertThresholds: {
        critical: 3,
        high: 10,
        medium: 20
      },
      minStockLevel: 8,
      reorderMethod: 'PERCENTAGE'
    },
    hundredTwentyDayConfig: {
      trendAnalysisDays: 150,
      safetyStockPercentage: 50,
      leadTimeDays: 12,
      alertThresholds: {
        critical: 5,
        high: 12,
        medium: 25
      },
      minStockLevel: 10,
      reorderMethod: 'SMART',
      trendWeight: 0.65,
      seasonalAdjustment: true
    },
    autoReorder: {
      enabled: true,
      minOrderQuantity: 10,
      maxOrderQuantity: 60,
      reorderFrequency: 'WEEKLY'
    },
    notifications: {
      emailAlerts: true,
      dashboardAlerts: true,
      minimumAlertLevel: 'MEDIUM'
    },
    seasonalFactors: {
      jan: 1.0, feb: 1.0, mar: 1.0, apr: 1.0,
      may: 1.0, jun: 1.0, jul: 1.0, aug: 1.0,
      sep: 1.0, oct: 1.0, nov: 1.0, dec: 1.0
    },
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleThresholdChange = (configType, level, value) => {
    const configKey = configType === '30_DAYS' ? 'thirtyDayConfig' : 'hundredTwentyDayConfig';
    setFormData(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey],
        alertThresholds: { ...prev[configKey].alertThresholds, [level]: parseInt(value) }
      }
    }));
  };

  const handleSeasonalFactorChange = (month, value) => {
    setFormData(prev => ({
      ...prev,
      seasonalFactors: { ...prev.seasonalFactors, [month]: parseFloat(value) }
    }));
  };

  const validateSection = (section) => {
    const newErrors = {};
    
    if (section === 1) {
      if (!formData.configType) newErrors.configType = 'Configuration type is required';
    } else if (section === 2) {
      if (!formData.thirtyDayConfig.safetyStockPercentage) newErrors.safetyStockPercentage = 'Safety stock percentage is required';
      if (!formData.thirtyDayConfig.leadTimeDays) newErrors.leadTimeDays = 'Lead time days is required';
      if (!formData.thirtyDayConfig.minStockLevel) newErrors.minStockLevel = 'Min stock level is required';
      if (!formData.thirtyDayConfig.reorderMethod) newErrors.reorderMethod = 'Reorder method is required';
    } else if (section === 3) {
      if (!formData.hundredTwentyDayConfig.trendAnalysisDays) newErrors.trendAnalysisDays = 'Trend analysis days is required';
      if (!formData.hundredTwentyDayConfig.safetyStockPercentage) newErrors.safetyStockPercentage = 'Safety stock percentage is required';
      if (!formData.hundredTwentyDayConfig.leadTimeDays) newErrors.leadTimeDays = 'Lead time days is required';
      if (!formData.hundredTwentyDayConfig.minStockLevel) newErrors.minStockLevel = 'Min stock level is required';
      if (!formData.hundredTwentyDayConfig.reorderMethod) newErrors.reorderMethod = 'Reorder method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(activeSection)) {
      if (activeSection < 6) setActiveSection(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeSection > 1) setActiveSection(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateSection(activeSection)) return;
    
    if (!model) {
      showError('Model information is missing');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        modelId: model.modelId,
        branchId: null,
        configType: formData.configType,
        settings: {
          thirtyDayConfig: formData.thirtyDayConfig,
          hundredTwentyDayConfig: formData.hundredTwentyDayConfig,
          autoReorder: formData.autoReorder,
          notifications: formData.notifications
        },
        seasonalFactors: formData.seasonalFactors,
        notes: formData.notes
      };

      const response = await axiosInstance.post('/low-stock/config', payload);
      if (response.data.success) {
        showSuccess('Configuration added successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving config:', error);
      const message = error.response?.data?.message || 'Failed to save configuration';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal size="xl" visible={visible} onClose={onClose} scrollable>
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilSettings} className="me-2" />
          Add Configuration - {model?.modelName || 'Model'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        
        <div className="form-card">
          <div className="form-body">
            {/* Section 1: General Settings */}
            {activeSection === 1 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Configuration Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilSettings} /></CInputGroupText>
                      <CFormSelect
                        value={formData.configType}
                        onChange={(e) => handleChange(null, 'configType', e.target.value)}
                      >
                        <option value="30_DAYS">30 Days Only</option>
                        <option value="120_DAYS">120 Days Only</option>
                        <option value="BOTH">Both</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.configType && <p className="error">{errors.configType}</p>}
                  </div>

                  <div className="input-box">
                    <span className="details">Notes</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilList} /></CInputGroupText>
                      <CFormInput
                        value={formData.notes}
                        onChange={(e) => handleChange(null, 'notes', e.target.value)}
                        placeholder="Additional notes..."
                      />
                    </CInputGroup>
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                  <button type="button" className="submit-button" onClick={handleNext}>Next</button>
                </div>
              </>
            )}

            {/* Section 2: 30-Day Config */}
            {activeSection === 2 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Safety Stock Percentage (%)</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilMoney} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.thirtyDayConfig.safetyStockPercentage}
                        onChange={(e) => handleChange('thirtyDayConfig', 'safetyStockPercentage', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.safetyStockPercentage && <p className="error">{errors.safetyStockPercentage}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Lead Time (Days)</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCalendar} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.thirtyDayConfig.leadTimeDays}
                        onChange={(e) => handleChange('thirtyDayConfig', 'leadTimeDays', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.leadTimeDays && <p className="error">{errors.leadTimeDays}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Min Stock Level</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCloudDownload} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.thirtyDayConfig.minStockLevel}
                        onChange={(e) => handleChange('thirtyDayConfig', 'minStockLevel', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.minStockLevel && <p className="error">{errors.minStockLevel}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Reorder Method</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilTask} /></CInputGroupText>
                      <CFormSelect
                        value={formData.thirtyDayConfig.reorderMethod}
                        onChange={(e) => handleChange('thirtyDayConfig', 'reorderMethod', e.target.value)}
                      >
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="ABSOLUTE">Absolute</option>
                        <option value="DAYS_OF_INVENTORY">Days of Inventory</option>
                        <option value="SMART">Smart</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.reorderMethod && <p className="error">{errors.reorderMethod}</p>}
                  </div>

                  <div style={{ width: '100%', height: '2px', backgroundColor: '#e0e0e0', margin: '15px 0', borderRadius: '2px' }}></div>

                  <div className="input-box" style={{ width: '100%' }}>
                    <h6 style={{ marginBottom: '15px' }}>Alert Thresholds</h6>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Critical (units)</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilWarning} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.thirtyDayConfig.alertThresholds.critical}
                        onChange={(e) => handleThresholdChange('30_DAYS', 'critical', e.target.value)}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">High (units)</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilWarning} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.thirtyDayConfig.alertThresholds.high}
                        onChange={(e) => handleThresholdChange('30_DAYS', 'high', e.target.value)}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Medium (units)</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilWarning} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.thirtyDayConfig.alertThresholds.medium}
                        onChange={(e) => handleThresholdChange('30_DAYS', 'medium', e.target.value)}
                      />
                    </CInputGroup>
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleBack}>Back</button>
                  <button type="button" className="submit-button" onClick={handleNext}>Next</button>
                </div>
              </>
            )}

            {/* Section 3: 120-Day Config */}
            {activeSection === 3 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Trend Analysis Days</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilChartLine} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.trendAnalysisDays}
                        onChange={(e) => handleChange('hundredTwentyDayConfig', 'trendAnalysisDays', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.trendAnalysisDays && <p className="error">{errors.trendAnalysisDays}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Safety Stock Percentage (%)</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilMoney} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.safetyStockPercentage}
                        onChange={(e) => handleChange('hundredTwentyDayConfig', 'safetyStockPercentage', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.safetyStockPercentage && <p className="error">{errors.safetyStockPercentage}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Lead Time (Days)</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCalendar} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.leadTimeDays}
                        onChange={(e) => handleChange('hundredTwentyDayConfig', 'leadTimeDays', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.leadTimeDays && <p className="error">{errors.leadTimeDays}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Min Stock Level</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCloudDownload} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.minStockLevel}
                        onChange={(e) => handleChange('hundredTwentyDayConfig', 'minStockLevel', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                    {errors.minStockLevel && <p className="error">{errors.minStockLevel}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Reorder Method</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilTask} /></CInputGroupText>
                      <CFormSelect
                        value={formData.hundredTwentyDayConfig.reorderMethod}
                        onChange={(e) => handleChange('hundredTwentyDayConfig', 'reorderMethod', e.target.value)}
                      >
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="ABSOLUTE">Absolute</option>
                        <option value="DAYS_OF_INVENTORY">Days of Inventory</option>
                        <option value="SMART">Smart</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.reorderMethod && <p className="error">{errors.reorderMethod}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Trend Weight</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilChartLine} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        step="0.05"
                        value={formData.hundredTwentyDayConfig.trendWeight}
                        onChange={(e) => handleChange('hundredTwentyDayConfig', 'trendWeight', parseFloat(e.target.value))}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <CFormCheck
                      label="Seasonal Adjustment"
                      checked={formData.hundredTwentyDayConfig.seasonalAdjustment}
                      onChange={(e) => handleChange('hundredTwentyDayConfig', 'seasonalAdjustment', e.target.checked)}
                    />
                  </div>

                  <div style={{ width: '100%', height: '2px', backgroundColor: '#e0e0e0', margin: '15px 0', borderRadius: '2px' }}></div>

                  <div className="input-box" style={{ width: '100%' }}>
                    <h6 style={{ marginBottom: '15px' }}>Alert Thresholds</h6>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Critical (units)</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilWarning} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.alertThresholds.critical}
                        onChange={(e) => handleThresholdChange('120_DAYS', 'critical', e.target.value)}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">High (units)</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilWarning} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.alertThresholds.high}
                        onChange={(e) => handleThresholdChange('120_DAYS', 'high', e.target.value)}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Medium (units)</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilWarning} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.hundredTwentyDayConfig.alertThresholds.medium}
                        onChange={(e) => handleThresholdChange('120_DAYS', 'medium', e.target.value)}
                      />
                    </CInputGroup>
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleBack}>Back</button>
                  <button type="button" className="submit-button" onClick={handleNext}>Next</button>
                </div>
              </>
            )}

            {/* Section 4: Auto Reorder */}
            {activeSection === 4 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <CFormCheck
                      label="Enable Auto Reorder"
                      checked={formData.autoReorder.enabled}
                      onChange={(e) => handleChange('autoReorder', 'enabled', e.target.checked)}
                    />
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Min Order Quantity</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCloudDownload} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.autoReorder.minOrderQuantity}
                        onChange={(e) => handleChange('autoReorder', 'minOrderQuantity', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Max Order Quantity</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCloudDownload} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        value={formData.autoReorder.maxOrderQuantity}
                        onChange={(e) => handleChange('autoReorder', 'maxOrderQuantity', parseInt(e.target.value))}
                      />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Reorder Frequency</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilCalendar} /></CInputGroupText>
                      <CFormSelect
                        value={formData.autoReorder.reorderFrequency}
                        onChange={(e) => handleChange('autoReorder', 'reorderFrequency', e.target.value)}
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="BIWEEKLY">Bi-Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleBack}>Back</button>
                  <button type="button" className="submit-button" onClick={handleNext}>Next</button>
                </div>
              </>
            )}

            {/* Section 5: Notifications */}
            {activeSection === 5 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <CFormCheck
                      label="Email Alerts"
                      checked={formData.notifications.emailAlerts}
                      onChange={(e) => handleChange('notifications', 'emailAlerts', e.target.checked)}
                    />
                  </div>

                  <div className="input-box">
                    <CFormCheck
                      label="Dashboard Alerts"
                      checked={formData.notifications.dashboardAlerts}
                      onChange={(e) => handleChange('notifications', 'dashboardAlerts', e.target.checked)}
                    />
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Minimum Alert Level</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon"><CIcon icon={cilBell} /></CInputGroupText>
                      <CFormSelect
                        value={formData.notifications.minimumAlertLevel}
                        onChange={(e) => handleChange('notifications', 'minimumAlertLevel', e.target.value)}
                      >
                        <option value="INFO">Info</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleBack}>Back</button>
                  <button type="button" className="submit-button" onClick={handleNext}>Next</button>
                </div>
              </>
            )}

            {/* Section 6: Seasonal Factors */}
            {activeSection === 6 && (
              <>
                <div className="user-details">
                  {Object.entries(formData.seasonalFactors).map(([month, value]) => (
                    <div key={month} className="input-box">
                      <div className="details-container">
                        <span className="details text-capitalize">{month}</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon"><CIcon icon={cilChartLine} /></CInputGroupText>
                        <CFormInput
                          type="number"
                          step="0.1"
                          value={value}
                          onChange={(e) => handleSeasonalFactorChange(month, e.target.value)}
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleBack}>Back</button>
                  <button type="submit" className="submit-button" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Configuration'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CModalBody>
      <CModalFooter style={{ display: 'none' }}>
        {/* Hidden footer as we have buttons inside each section */}
      </CModalFooter>
    </CModal>
  );
};

export default AddConfigModal;