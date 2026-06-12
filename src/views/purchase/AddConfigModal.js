import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/form.css';
import { 
  CInputGroup, 
  CInputGroupText, 
  CFormInput, 
  CFormSelect, 
  CButton, 
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
  CAlert,
  CButtonGroup
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilMoney, 
  cilCalendar, 
  cilBell, 
  cilChartLine, 
  cilCloudDownload,
  cilWarning,
  cilList,
  cilTask,
  cilCheck,
  cilX
} from '@coreui/icons';
import { axiosInstance, showError, showSuccess } from '../../utils/tableImports';

const AddConfigModal = ({ visible, onClose, model, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [error, setError] = useState(null);
  
  // Form state - all fields empty by default
  const [formData, setFormData] = useState({
    configType: '',
    thirtyDayConfig: {
      safetyStockPercentage: '',
      leadTimeDays: '',
      alertThresholds: {
        critical: '',
        high: '',
        medium: ''
      },
      minStockLevel: '',
      reorderMethod: ''
    },
    hundredTwentyDayConfig: {
      trendAnalysisDays: '',
      safetyStockPercentage: '',
      leadTimeDays: '',
      alertThresholds: {
        critical: '',
        high: '',
        medium: ''
      },
      minStockLevel: '',
      reorderMethod: '',
      trendWeight: '',
      seasonalAdjustment: false
    },
    autoReorder: {
      enabled: false,
      minOrderQuantity: '',
      maxOrderQuantity: '',
      reorderFrequency: ''
    },
    notifications: {
      emailAlerts: false,
      dashboardAlerts: false,
      minimumAlertLevel: ''
    },
    seasonalFactors: {
      jan: '', feb: '', mar: '', apr: '',
      may: '', jun: '', jul: '', aug: '',
      sep: '', oct: '', nov: '', dec: ''
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
        alertThresholds: { ...prev[configKey].alertThresholds, [level]: value ? parseInt(value) : '' }
      }
    }));
  };

  const handleSeasonalFactorChange = (month, value) => {
    setFormData(prev => ({
      ...prev,
      seasonalFactors: { ...prev.seasonalFactors, [month]: value ? parseFloat(value) : '' }
    }));
  };

  const validateSection = (section) => {
    const newErrors = {};
    
    if (section === 1) {
      if (!formData.configType) newErrors.configType = 'Configuration type is required';
    } else if (section === 2) {
      // Validate based on config type
      if (formData.configType === '30_DAYS' || formData.configType === 'BOTH') {
        if (!formData.thirtyDayConfig.safetyStockPercentage) newErrors.safetyStockPercentage = 'Safety stock percentage is required';
        if (!formData.thirtyDayConfig.leadTimeDays) newErrors.leadTimeDays = 'Lead time days is required';
        if (!formData.thirtyDayConfig.minStockLevel) newErrors.minStockLevel = 'Min stock level is required';
        if (!formData.thirtyDayConfig.reorderMethod) newErrors.reorderMethod = 'Reorder method is required';
      }
      if (formData.configType === '120_DAYS' || formData.configType === 'BOTH') {
        if (!formData.hundredTwentyDayConfig.trendAnalysisDays) newErrors.trendAnalysisDays = 'Trend analysis days is required';
        if (!formData.hundredTwentyDayConfig.safetyStockPercentage) newErrors.safetyStockPercentage120 = 'Safety stock percentage is required';
        if (!formData.hundredTwentyDayConfig.leadTimeDays) newErrors.leadTimeDays120 = 'Lead time days is required';
        if (!formData.hundredTwentyDayConfig.minStockLevel) newErrors.minStockLevel120 = 'Min stock level is required';
        if (!formData.hundredTwentyDayConfig.reorderMethod) newErrors.reorderMethod120 = 'Reorder method is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(activeSection)) {
      if (activeSection < 5) setActiveSection(prev => prev + 1);
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
          thirtyDayConfig: {
            safetyStockPercentage: formData.thirtyDayConfig.safetyStockPercentage ? parseInt(formData.thirtyDayConfig.safetyStockPercentage) : 0,
            leadTimeDays: formData.thirtyDayConfig.leadTimeDays ? parseInt(formData.thirtyDayConfig.leadTimeDays) : 0,
            alertThresholds: {
              critical: formData.thirtyDayConfig.alertThresholds.critical ? parseInt(formData.thirtyDayConfig.alertThresholds.critical) : 0,
              high: formData.thirtyDayConfig.alertThresholds.high ? parseInt(formData.thirtyDayConfig.alertThresholds.high) : 0,
              medium: formData.thirtyDayConfig.alertThresholds.medium ? parseInt(formData.thirtyDayConfig.alertThresholds.medium) : 0
            },
            minStockLevel: formData.thirtyDayConfig.minStockLevel ? parseInt(formData.thirtyDayConfig.minStockLevel) : 0,
            reorderMethod: formData.thirtyDayConfig.reorderMethod
          },
          hundredTwentyDayConfig: {
            trendAnalysisDays: formData.hundredTwentyDayConfig.trendAnalysisDays ? parseInt(formData.hundredTwentyDayConfig.trendAnalysisDays) : 0,
            safetyStockPercentage: formData.hundredTwentyDayConfig.safetyStockPercentage ? parseInt(formData.hundredTwentyDayConfig.safetyStockPercentage) : 0,
            leadTimeDays: formData.hundredTwentyDayConfig.leadTimeDays ? parseInt(formData.hundredTwentyDayConfig.leadTimeDays) : 0,
            alertThresholds: {
              critical: formData.hundredTwentyDayConfig.alertThresholds.critical ? parseInt(formData.hundredTwentyDayConfig.alertThresholds.critical) : 0,
              high: formData.hundredTwentyDayConfig.alertThresholds.high ? parseInt(formData.hundredTwentyDayConfig.alertThresholds.high) : 0,
              medium: formData.hundredTwentyDayConfig.alertThresholds.medium ? parseInt(formData.hundredTwentyDayConfig.alertThresholds.medium) : 0
            },
            minStockLevel: formData.hundredTwentyDayConfig.minStockLevel ? parseInt(formData.hundredTwentyDayConfig.minStockLevel) : 0,
            reorderMethod: formData.hundredTwentyDayConfig.reorderMethod,
            trendWeight: formData.hundredTwentyDayConfig.trendWeight ? parseFloat(formData.hundredTwentyDayConfig.trendWeight) : 0,
            seasonalAdjustment: formData.hundredTwentyDayConfig.seasonalAdjustment
          },
          autoReorder: {
            enabled: formData.autoReorder.enabled,
            minOrderQuantity: formData.autoReorder.minOrderQuantity ? parseInt(formData.autoReorder.minOrderQuantity) : 0,
            maxOrderQuantity: formData.autoReorder.maxOrderQuantity ? parseInt(formData.autoReorder.maxOrderQuantity) : 0,
            reorderFrequency: formData.autoReorder.reorderFrequency
          },
          notifications: {
            emailAlerts: formData.notifications.emailAlerts,
            dashboardAlerts: formData.notifications.dashboardAlerts,
            minimumAlertLevel: formData.notifications.minimumAlertLevel
          }
        },
        seasonalFactors: {
          jan: formData.seasonalFactors.jan ? parseFloat(formData.seasonalFactors.jan) : 1.0,
          feb: formData.seasonalFactors.feb ? parseFloat(formData.seasonalFactors.feb) : 1.0,
          mar: formData.seasonalFactors.mar ? parseFloat(formData.seasonalFactors.mar) : 1.0,
          apr: formData.seasonalFactors.apr ? parseFloat(formData.seasonalFactors.apr) : 1.0,
          may: formData.seasonalFactors.may ? parseFloat(formData.seasonalFactors.may) : 1.0,
          jun: formData.seasonalFactors.jun ? parseFloat(formData.seasonalFactors.jun) : 1.0,
          jul: formData.seasonalFactors.jul ? parseFloat(formData.seasonalFactors.jul) : 1.0,
          aug: formData.seasonalFactors.aug ? parseFloat(formData.seasonalFactors.aug) : 1.0,
          sep: formData.seasonalFactors.sep ? parseFloat(formData.seasonalFactors.sep) : 1.0,
          oct: formData.seasonalFactors.oct ? parseFloat(formData.seasonalFactors.oct) : 1.0,
          nov: formData.seasonalFactors.nov ? parseFloat(formData.seasonalFactors.nov) : 1.0,
          dec: formData.seasonalFactors.dec ? parseFloat(formData.seasonalFactors.dec) : 1.0
        },
        notes: formData.notes
      };

      const response = await axiosInstance.post('/low-stock/config', payload);
      if (response.data.success) {
        showSuccess('Configuration added successfully!');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
        navigate('/purchase-config-list');
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

  // Helper to check if field should be shown
  const show30DayConfig = () => {
    return formData.configType === '30_DAYS' || formData.configType === 'BOTH';
  };

  const show120DayConfig = () => {
    return formData.configType === '120_DAYS' || formData.configType === 'BOTH';
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
                        <option value="">- Select -</option>
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

            {/* Section 2: Configuration Settings (Combined - No Duplicates) */}
            {activeSection === 2 && (
              <>
                <div className="user-details">
                  
                  {/* 30 DAY CONFIGURATION */}
                  {show30DayConfig() && (
                    <>
                      <div className="input-box full-width">
                        <h5 style={{ marginBottom: '15px', color: '#4e73df', borderBottom: '2px solid #4e73df', paddingBottom: '8px' }}>
                          <CIcon icon={cilCalendar} className="me-2" />
                          30-Day Configuration
                        </h5>
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
                            value={formData.thirtyDayConfig.safetyStockPercentage}
                            onChange={(e) => handleChange('thirtyDayConfig', 'safetyStockPercentage', e.target.value)}
                            placeholder="Enter safety stock percentage"
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
                            onChange={(e) => handleChange('thirtyDayConfig', 'leadTimeDays', e.target.value)}
                            placeholder="Enter lead time in days"
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
                            onChange={(e) => handleChange('thirtyDayConfig', 'minStockLevel', e.target.value)}
                            placeholder="Enter minimum stock level"
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
                            <option value="">- Select -</option>
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="ABSOLUTE">Absolute</option>
                            <option value="DAYS_OF_INVENTORY">Days of Inventory</option>
                            <option value="SMART">Smart</option>
                          </CFormSelect>
                        </CInputGroup>
                        {errors.reorderMethod && <p className="error">{errors.reorderMethod}</p>}
                      </div>

                      <div className="input-box" style={{ width: '100%' }}>
                        <h6 style={{ marginBottom: '15px', marginTop: '10px' }}>Alert Thresholds</h6>
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
                            placeholder="Enter critical threshold"
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
                            placeholder="Enter high threshold"
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
                            placeholder="Enter medium threshold"
                          />
                        </CInputGroup>
                      </div>

                      <div style={{ width: '100%', height: '2px', backgroundColor: '#e0e0e0', margin: '20px 0', borderRadius: '2px' }}></div>
                    </>
                  )}

                  {/* 120 DAY CONFIGURATION */}
                  {show120DayConfig() && (
                    <>
                      <div className="input-box full-width">
                        <h5 style={{ marginBottom: '15px', color: '#4e73df', borderBottom: '2px solid #4e73df', paddingBottom: '8px' }}>
                          <CIcon icon={cilChartLine} className="me-2" />
                          120-Day Configuration
                        </h5>
                      </div>

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
                            onChange={(e) => handleChange('hundredTwentyDayConfig', 'trendAnalysisDays', e.target.value)}
                            placeholder="Enter trend analysis days"
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
                            onChange={(e) => handleChange('hundredTwentyDayConfig', 'safetyStockPercentage', e.target.value)}
                            placeholder="Enter safety stock percentage"
                          />
                        </CInputGroup>
                        {errors.safetyStockPercentage120 && <p className="error">{errors.safetyStockPercentage120}</p>}
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
                            onChange={(e) => handleChange('hundredTwentyDayConfig', 'leadTimeDays', e.target.value)}
                            placeholder="Enter lead time in days"
                          />
                        </CInputGroup>
                        {errors.leadTimeDays120 && <p className="error">{errors.leadTimeDays120}</p>}
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
                            onChange={(e) => handleChange('hundredTwentyDayConfig', 'minStockLevel', e.target.value)}
                            placeholder="Enter minimum stock level"
                          />
                        </CInputGroup>
                        {errors.minStockLevel120 && <p className="error">{errors.minStockLevel120}</p>}
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
                            <option value="">- Select -</option>
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="ABSOLUTE">Absolute</option>
                            <option value="DAYS_OF_INVENTORY">Days of Inventory</option>
                            <option value="SMART">Smart</option>
                          </CFormSelect>
                        </CInputGroup>
                        {errors.reorderMethod120 && <p className="error">{errors.reorderMethod120}</p>}
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
                            onChange={(e) => handleChange('hundredTwentyDayConfig', 'trendWeight', e.target.value)}
                            placeholder="Enter trend weight (0-1)"
                          />
                        </CInputGroup>
                      </div>

                      <div className="input-box full-width">
                        <div className="details-container">
                          <span className="details">Seasonal Adjustment</span>
                        </div>
                        <div className="mt-2">
                          <div className="d-flex align-items-center">
                            <CButtonGroup size="sm">
                              <CButton 
                                color={formData.hundredTwentyDayConfig.seasonalAdjustment ? "success" : "secondary"} 
                                variant={formData.hundredTwentyDayConfig.seasonalAdjustment ? "solid" : "outline"}
                                onClick={() => handleChange('hundredTwentyDayConfig', 'seasonalAdjustment', true)}
                                style={formData.hundredTwentyDayConfig.seasonalAdjustment ? { backgroundColor: '#28a745', borderColor: '#28a745' } : {}}
                              >
                                <CIcon icon={cilCheck} /> Yes
                              </CButton>
                              <CButton 
                                color={!formData.hundredTwentyDayConfig.seasonalAdjustment ? "danger" : "secondary"} 
                                variant={!formData.hundredTwentyDayConfig.seasonalAdjustment ? "solid" : "outline"}
                                onClick={() => handleChange('hundredTwentyDayConfig', 'seasonalAdjustment', false)}
                                style={!formData.hundredTwentyDayConfig.seasonalAdjustment ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
                              >
                                <CIcon icon={cilX} /> No
                              </CButton>
                            </CButtonGroup>
                          </div>
                        </div>
                      </div>

                      <div className="input-box" style={{ width: '100%' }}>
                        <h6 style={{ marginBottom: '15px', marginTop: '10px' }}>Alert Thresholds</h6>
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
                            placeholder="Enter critical threshold"
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
                            placeholder="Enter high threshold"
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
                            placeholder="Enter medium threshold"
                          />
                        </CInputGroup>
                      </div>
                    </>
                  )}

                  {!show30DayConfig() && !show120DayConfig() && (
                    <div className="alert alert-info">
                      Please select a configuration type in the previous section.
                    </div>
                  )}
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleBack}>Back</button>
                  <button type="button" className="submit-button" onClick={handleNext}>Next</button>
                </div>
              </>
            )}

            {/* Section 3: Auto Reorder */}
            {activeSection === 3 && (
              <>
                <div className="user-details">
                  <div className="input-box full-width">
                    <div className="details-container">
                      <span className="details">Enable Auto Reorder</span>
                    </div>
                    <div className="mt-2">
                      <div className="d-flex align-items-center">
                        <CButtonGroup size="sm">
                          <CButton 
                            color={formData.autoReorder.enabled ? "success" : "secondary"} 
                            variant={formData.autoReorder.enabled ? "solid" : "outline"}
                            onClick={() => handleChange('autoReorder', 'enabled', true)}
                            style={formData.autoReorder.enabled ? { backgroundColor: '#28a745', borderColor: '#28a745' } : {}}
                          >
                            <CIcon icon={cilCheck} /> Yes
                          </CButton>
                          <CButton 
                            color={!formData.autoReorder.enabled ? "danger" : "secondary"} 
                            variant={!formData.autoReorder.enabled ? "solid" : "outline"}
                            onClick={() => handleChange('autoReorder', 'enabled', false)}
                            style={!formData.autoReorder.enabled ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
                          >
                            <CIcon icon={cilX} /> No
                          </CButton>
                        </CButtonGroup>
                      </div>
                    </div>
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
                        onChange={(e) => handleChange('autoReorder', 'minOrderQuantity', e.target.value)}
                        placeholder="Enter minimum order quantity"
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
                        onChange={(e) => handleChange('autoReorder', 'maxOrderQuantity', e.target.value)}
                        placeholder="Enter maximum order quantity"
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
                        <option value="">- Select -</option>
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

            {/* Section 4: Notifications */}
            {activeSection === 4 && (
              <>
                <div className="user-details">
                  <div className="input-box full-width">
                    <div className="details-container">
                      <span className="details">Email Alerts</span>
                    </div>
                    <div className="mt-2">
                      <div className="d-flex align-items-center">
                        <CButtonGroup size="sm">
                          <CButton 
                            color={formData.notifications.emailAlerts ? "success" : "secondary"} 
                            variant={formData.notifications.emailAlerts ? "solid" : "outline"}
                            onClick={() => handleChange('notifications', 'emailAlerts', true)}
                            style={formData.notifications.emailAlerts ? { backgroundColor: '#28a745', borderColor: '#28a745' } : {}}
                          >
                            <CIcon icon={cilCheck} /> Yes
                          </CButton>
                          <CButton 
                            color={!formData.notifications.emailAlerts ? "danger" : "secondary"} 
                            variant={!formData.notifications.emailAlerts ? "solid" : "outline"}
                            onClick={() => handleChange('notifications', 'emailAlerts', false)}
                            style={!formData.notifications.emailAlerts ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
                          >
                            <CIcon icon={cilX} /> No
                          </CButton>
                        </CButtonGroup>
                      </div>
                    </div>
                  </div>

                  <div className="input-box full-width">
                    <div className="details-container">
                      <span className="details">Dashboard Alerts</span>
                    </div>
                    <div className="mt-2">
                      <div className="d-flex align-items-center">
                        <CButtonGroup size="sm">
                          <CButton 
                            color={formData.notifications.dashboardAlerts ? "success" : "secondary"} 
                            variant={formData.notifications.dashboardAlerts ? "solid" : "outline"}
                            onClick={() => handleChange('notifications', 'dashboardAlerts', true)}
                            style={formData.notifications.dashboardAlerts ? { backgroundColor: '#28a745', borderColor: '#28a745' } : {}}
                          >
                            <CIcon icon={cilCheck} /> Yes
                          </CButton>
                          <CButton 
                            color={!formData.notifications.dashboardAlerts ? "danger" : "secondary"} 
                            variant={!formData.notifications.dashboardAlerts ? "solid" : "outline"}
                            onClick={() => handleChange('notifications', 'dashboardAlerts', false)}
                            style={!formData.notifications.dashboardAlerts ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
                          >
                            <CIcon icon={cilX} /> No
                          </CButton>
                        </CButtonGroup>
                      </div>
                    </div>
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
                        <option value="">- Select -</option>
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

            {/* Section 5: Seasonal Factors */}
            {activeSection === 5 && (
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
                          placeholder="Enter seasonal factor"
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
    </CModal>
  );
};

export default AddConfigModal;