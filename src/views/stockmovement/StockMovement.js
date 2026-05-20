import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import './challan.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CFormInput,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CCard,
  CCardHeader,
  CCardBody,
  CSpinner,
  CFormLabel,
  CFormTextarea,
  CButtonGroup
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilSearch, cilTransfer, cilLocationPin, cilFile, cilCheck, cilX } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../context/AuthContext';
import TransferChallan from '../purchase/StockChallan';

const StockMovement = () => {
  const [formData, setFormData] = useState({
    sourceDatabase: '',
    sourceLocationType: 'branch',
    sourceLocationId: '',
    targetDatabase: '',
    targetLocationType: 'branch',
    targetLocationId: '',
    notes: '',
    transferAllVehicles: false,
    validateUniqueness: true
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState({});
  const [databases, setDatabases] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanData, setChallanData] = useState(null);

  const navigate = useNavigate();
  const { permissions = [] } = useAuth();

  // Database display names mapping
  const databaseDisplayNames = {
    'db1': '14588',
    'db2': '14589'
  };

  // Get database display name
  const getDatabaseDisplayName = (dbKey) => {
    return databaseDisplayNames[dbKey] || dbKey?.toUpperCase() || '';
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (locations && Object.keys(locations).length > 0) {
      const dbKeys = Object.keys(locations).filter(key => locations[key] && (locations[key].branches || locations[key].subdealers));
      setDatabases(dbKeys);
    }
  }, [locations]);

  useEffect(() => {
    if (formData.sourceDatabase && formData.sourceLocationType && formData.sourceLocationId) {
      fetchVehicles();
    } else {
      setVehicles([]);
      setFilteredVehicles([]);
      setSelectedVehicles([]);
    }
  }, [formData.sourceDatabase, formData.sourceLocationType, formData.sourceLocationId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehicles.filter((vehicle) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (vehicle.chassisNumber && vehicle.chassisNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.modelName && vehicle.modelName.toLowerCase().includes(searchLower)) ||
          (vehicle.type && vehicle.type.toLowerCase().includes(searchLower)) ||
          (vehicle.color?.name && vehicle.color.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await axiosInstance.get('/crossData/locations');
      if (response.data.status === 'success') {
        setLocations(response.data.data);
      } else {
        showError('Failed to fetch locations');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchVehicles = async () => {
    setIsLoadingVehicles(true);
    try {
      const { sourceDatabase, sourceLocationType, sourceLocationId } = formData;
      const url = `/crossData/vehicles?database=${sourceDatabase}&locationType=${sourceLocationType}&locationId=${sourceLocationId}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        const inStockVehicles = (response.data.data.vehicles || []).filter(
          (vehicle) => vehicle.status === 'in_stock'
        );
        setVehicles(inStockVehicles);
        setFilteredVehicles(inStockVehicles);
        setSelectedVehicles([]);
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'sourceDatabase') {
      setFormData(prevData => ({
        ...prevData,
        sourceLocationId: '',
        targetDatabase: '',
        targetLocationId: ''
      }));
      setVehicles([]);
      setFilteredVehicles([]);
      setSelectedVehicles([]);
    }

    if (name === 'sourceLocationType') {
      setFormData(prevData => ({
        ...prevData,
        sourceLocationId: ''
      }));
      setVehicles([]);
      setFilteredVehicles([]);
      setSelectedVehicles([]);
    }

    if (name === 'targetDatabase') {
      setFormData(prevData => ({
        ...prevData,
        targetLocationId: ''
      }));
    }

    if (name === 'targetLocationType') {
      setFormData(prevData => ({
        ...prevData,
        targetLocationId: ''
      }));
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleVehicleSelect = (vehicleId, isSelected) => {
    if (isSelected) {
      setSelectedVehicles(prev => [...prev, vehicleId]);
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVehicleIds = filteredVehicles.map(vehicle => vehicle._id);
      setSelectedVehicles(allVehicleIds);
    } else {
      setSelectedVehicles([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sourceDatabase) {
      newErrors.sourceDatabase = 'Source database is required';
    }

    if (!formData.sourceLocationId) {
      newErrors.sourceLocationId = 'Source location is required';
    }

    if (!formData.targetDatabase) {
      newErrors.targetDatabase = 'Target database is required';
    }

    if (!formData.targetLocationId) {
      newErrors.targetLocationId = 'Target location is required';
    }

    if (!formData.transferAllVehicles && selectedVehicles.length === 0) {
      newErrors.vehicles = 'Please select at least one vehicle to transfer';
    }

    if (formData.sourceDatabase === formData.targetDatabase && 
        formData.sourceLocationId === formData.targetLocationId &&
        formData.sourceDatabase && formData.targetDatabase) {
      newErrors.targetLocationId = 'Source and target locations cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        sourceDatabase: formData.sourceDatabase,
        targetDatabase: formData.targetDatabase,
        sourceLocationType: formData.sourceLocationType,
        sourceLocationId: formData.sourceLocationId,
        targetLocationType: formData.targetLocationType,
        targetLocationId: formData.targetLocationId,
        vehicleIds: formData.transferAllVehicles ? [] : selectedVehicles,
        transferAllVehicles: formData.transferAllVehicles,
        validateUniqueness: formData.validateUniqueness,
        notes: formData.notes || ''
      };

      const response = await axiosInstance.post('/crossData/transfer-vehicles', payload);

      if (response.data.status === 'success') {
        showSuccess('Vehicles transferred successfully!');
        
        // Prepare challan data
        const sourceLocationData = getSourceLocationDetails();
        const targetLocationData = getTargetLocationDetails();
        const transferredVehicles = getTransferredVehiclesDetails();
        
        setChallanData({
          transferDetails: response.data,
          fromType: formData.sourceLocationType,
          fromBranch: formData.sourceLocationType === 'branch' ? sourceLocationData : null,
          fromSubdealer: formData.sourceLocationType === 'subdealer' ? sourceLocationData : null,
          toType: formData.targetLocationType,
          toBranch: formData.targetLocationType === 'branch' ? targetLocationData : null,
          toSubdealer: formData.targetLocationType === 'subdealer' ? targetLocationData : null,
          vehicles: transferredVehicles,
          destinationName: targetLocationData?.name || '',
        });
        
        setShowChallanModal(true);
        
        // Reset form
        setFormData({
          sourceDatabase: '',
          sourceLocationType: 'branch',
          sourceLocationId: '',
          targetDatabase: '',
          targetLocationType: 'branch',
          targetLocationId: '',
          notes: '',
          transferAllVehicles: false,
          validateUniqueness: true
        });
        setSelectedVehicles([]);
        setVehicles([]);
        setFilteredVehicles([]);
      } else {
        showError(response.data.message || 'Failed to transfer vehicles');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSourceLocationDetails = () => {
    if (!formData.sourceDatabase || !formData.sourceLocationId) return null;
    const locationsData = locations[formData.sourceDatabase];
    if (!locationsData) return null;
    
    const branches = locationsData.branches || [];
    const subdealers = locationsData.subdealers || [];
    
    const branch = branches.find(b => b._id === formData.sourceLocationId || b.id === formData.sourceLocationId);
    if (branch) return branch;
    
    const subdealer = subdealers.find(s => s._id === formData.sourceLocationId || s.id === formData.sourceLocationId);
    return subdealer || null;
  };

  const getTargetLocationDetails = () => {
    if (!formData.targetDatabase || !formData.targetLocationId) return null;
    const locationsData = locations[formData.targetDatabase];
    if (!locationsData) return null;
    
    const branches = locationsData.branches || [];
    const subdealers = locationsData.subdealers || [];
    
    const branch = branches.find(b => b._id === formData.targetLocationId || b.id === formData.targetLocationId);
    if (branch) return branch;
    
    const subdealer = subdealers.find(s => s._id === formData.targetLocationId || s.id === formData.targetLocationId);
    return subdealer || null;
  };

  const getTransferredVehiclesDetails = () => {
    if (formData.transferAllVehicles) {
      return vehicles;
    }
    return vehicles.filter(v => selectedVehicles.includes(v._id));
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleCloseModal = () => {
    setShowChallanModal(false);
    setChallanData(null);
  };

  const getLocationOptions = (databaseKey, locationType) => {
    if (!databaseKey || !locations[databaseKey]) return [];
    const locationsData = locations[databaseKey][locationType === 'branch' ? 'branches' : 'subdealers'] || [];
    return locationsData;
  };

  const getSourceLocationName = () => {
    if (!formData.sourceDatabase || !formData.sourceLocationId) return '';
    const locationsData = locations[formData.sourceDatabase];
    if (!locationsData) return '';
    
    const branches = locationsData.branches || [];
    const subdealers = locationsData.subdealers || [];
    
    const branch = branches.find(b => b._id === formData.sourceLocationId || b.id === formData.sourceLocationId);
    if (branch) return branch.name;
    
    const subdealer = subdealers.find(s => s._id === formData.sourceLocationId || s.id === formData.sourceLocationId);
    if (subdealer) return subdealer.name;
    
    return '';
  };

  const getTargetLocationName = () => {
    if (!formData.targetDatabase || !formData.targetLocationId) return '';
    const locationsData = locations[formData.targetDatabase];
    if (!locationsData) return '';
    
    const branches = locationsData.branches || [];
    const subdealers = locationsData.subdealers || [];
    
    const branch = branches.find(b => b._id === formData.targetLocationId || b.id === formData.targetLocationId);
    if (branch) return branch.name;
    
    const subdealer = subdealers.find(s => s._id === formData.targetLocationId || s.id === formData.targetLocationId);
    if (subdealer) return subdealer.name;
    
    return '';
  };

  const isSourceSelected = formData.sourceDatabase && formData.sourceLocationId;
  const isTargetSelected = formData.targetDatabase && formData.targetLocationId;

  return (
    <div>
      <div className='title'>Stock Movement (Cross Database)</div>

      <CCard className='table-container mt-4'>
      
        
        <CCardBody>
          <div className="form-container">
            {error && <CAlert color="danger">{error}</CAlert>}
            <div className="form-card">
              <div className="form-body">
                <form onSubmit={handleSubmit}>
                  <div className="user-details">
                    {/* Source Database */}
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Source Database</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilLocationPin} />
                        </CInputGroupText>
                        <CFormSelect
                          name="sourceDatabase"
                          value={formData.sourceDatabase}
                          onChange={handleChange}
                          invalid={!!errors.sourceDatabase}
                          disabled={isLoadingLocations || isSubmitting}
                        >
                          <option value="">-Select Source Database-</option>
                          {databases.map((db) => (
                            <option key={db} value={db}>
                              {getDatabaseDisplayName(db)}
                            </option>
                          ))}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.sourceDatabase && <div className="invalid-feedback">{errors.sourceDatabase}</div>}
                    </div>

                    {/* Source Location Type */}
                    {formData.sourceDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Source Location Type</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormSelect
                            name="sourceLocationType"
                            value={formData.sourceLocationType}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="branch">Branch</option>
                            <option value="subdealer">Subdealer</option>
                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    )}

                    {/* Source Location */}
                    {formData.sourceDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Source Location</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilLocationPin} />
                          </CInputGroupText>
                          <CFormSelect
                            name="sourceLocationId"
                            value={formData.sourceLocationId}
                            onChange={handleChange}
                            invalid={!!errors.sourceLocationId}
                            disabled={isSubmitting}
                          >
                            <option value="">-Select Source Location-</option>
                            {getLocationOptions(formData.sourceDatabase, formData.sourceLocationType).map((location) => (
                              <option key={location._id || location.id} value={location._id || location.id}>
                                {location.name} {location.city ? `(${location.city})` : ''}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.sourceLocationId && <div className="invalid-feedback">{errors.sourceLocationId}</div>}
                      </div>
                    )}

                    {/* Target Database */}
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Target Database</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilLocationPin} />
                        </CInputGroupText>
                        <CFormSelect
                          name="targetDatabase"
                          value={formData.targetDatabase}
                          onChange={handleChange}
                          invalid={!!errors.targetDatabase}
                          disabled={isLoadingLocations || isSubmitting || !formData.sourceDatabase}
                        >
                          <option value="">-Select Target Database-</option>
                          {databases
                            .filter(db => db !== formData.sourceDatabase)
                            .map((db) => (
                              <option key={db} value={db}>
                                {getDatabaseDisplayName(db)}
                              </option>
                            ))}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.targetDatabase && <div className="invalid-feedback">{errors.targetDatabase}</div>}
                    </div>

                    {/* Target Location Type */}
                    {formData.targetDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Target Location Type</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormSelect
                            name="targetLocationType"
                            value={formData.targetLocationType}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="branch">Branch</option>
                            <option value="subdealer">Subdealer</option>
                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    )}

                    {/* Target Location */}
                    {formData.targetDatabase && (
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Target Location</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilLocationPin} />
                          </CInputGroupText>
                          <CFormSelect
                            name="targetLocationId"
                            value={formData.targetLocationId}
                            onChange={handleChange}
                            invalid={!!errors.targetLocationId}
                            disabled={isSubmitting}
                          >
                            <option value="">-Select Target Location-</option>
                            {getLocationOptions(formData.targetDatabase, formData.targetLocationType).map((location) => (
                              <option key={location._id || location.id} value={location._id || location.id}>
                                {location.name} {location.city ? `(${location.city})` : ''}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.targetLocationId && <div className="invalid-feedback">{errors.targetLocationId}</div>}
                      </div>
                    )}

                   {/* Transfer Options - Yes/No buttons like permissions */}
<div className="input-box full-width">
  <div className="details-container">
    <span className="details">Transfer Options</span>
  </div>
  <div className="mt-2">
    <div className="row">
      <div className="col-md-6 mb-3">
        <div className="d-flex align-items-center">
          <span className="me-3" style={{ minWidth: '200px' }}>Transfer all in-stock vehicles</span>
          <CButtonGroup size="sm">
            <CButton 
              color={formData.transferAllVehicles ? "success" : "secondary"} 
              variant={formData.transferAllVehicles ? "solid" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, transferAllVehicles: true }))}
              disabled={isSubmitting}
              style={formData.transferAllVehicles ? { backgroundColor: '#28a745', borderColor: '#28a745' } : {}}
            >
              <CIcon icon={cilCheck} /> Yes
            </CButton>
            <CButton 
              color={!formData.transferAllVehicles ? "danger" : "secondary"} 
              variant={!formData.transferAllVehicles ? "solid" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, transferAllVehicles: false }))}
              disabled={isSubmitting}
              style={!formData.transferAllVehicles ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
            >
              <CIcon icon={cilX} /> No
            </CButton>
          </CButtonGroup>
        </div>
        {formData.transferAllVehicles && vehicles.length > 0 && (
          <small className="text-muted d-block mt-1 ms-3">
            This will transfer all {vehicles.length} in-stock vehicles from the source location
          </small>
        )}
      </div>
      <div className="col-md-6">
        <div className="d-flex align-items-center">
          <span className="me-3" style={{ minWidth: '200px' }}>Validate chassis number uniqueness</span>
          <CButtonGroup size="sm">
            <CButton 
              color={formData.validateUniqueness ? "success" : "secondary"} 
              variant={formData.validateUniqueness ? "solid" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, validateUniqueness: true }))}
              disabled={isSubmitting}
              style={formData.validateUniqueness ? { backgroundColor: '#28a745', borderColor: '#28a745' } : {}}
            >
              <CIcon icon={cilCheck} /> Yes
            </CButton>
            <CButton 
              color={!formData.validateUniqueness ? "danger" : "secondary"} 
              variant={!formData.validateUniqueness ? "solid" : "outline"}
              onClick={() => setFormData(prev => ({ ...prev, validateUniqueness: false }))}
              disabled={isSubmitting}
              style={!formData.validateUniqueness ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
            >
              <CIcon icon={cilX} /> No
            </CButton>
          </CButtonGroup>
        </div>
      </div>
    </div>
  </div>
</div>

                    {/* Notes */}
                    <div className="input-box full-width">
                      <div className="details-container">
                        <span className="details">Notes (Optional)</span>
                      </div>
                      <CFormInput
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any notes about this transfer"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Vehicles selection error message */}
                  {errors.vehicles && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger mt-2">{errors.vehicles}</div>
                      </div>
                    </div>
                  )}

                  <div className="form-footer">
                    <button 
                      type="submit" 
                      className="submit-button" 
                      disabled={isSubmitting || !isSourceSelected || !isTargetSelected}
                    >
                      {isSubmitting ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Transferring...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilTransfer} className="me-2" />
                          Transfer Vehicles
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button" 
                      onClick={handleCancel} 
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Vehicles Table */}
                {isSourceSelected && !formData.transferAllVehicles && (
                  <div className="vehicle-table mt-4 p-3">
                    <h5>In-Stock Vehicle Details ({vehicles.length} vehicles available)</h5>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilSearch} style={{ width: '20px' }} />
                          </CInputGroupText>
                          <CFormInput
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by chassis, model, type..."
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol md={6} className="text-end">
                        <span className="badge bg-info">
                          Selected: {selectedVehicles.length} vehicles
                        </span>
                        <CFormCheck
                          label={`Select All (${filteredVehicles.length})`}
                          onChange={handleSelectAll}
                          checked={selectedVehicles.length === filteredVehicles.length && filteredVehicles.length > 0}
                          indeterminate={selectedVehicles.length > 0 && selectedVehicles.length < filteredVehicles.length}
                          className="d-inline-block ms-3"
                        />
                      </CCol>
                    </CRow>

                    {isLoadingVehicles ? (
                      <div className="text-center py-5">
                        <CSpinner />
                        <p className="mt-3">Loading vehicles...</p>
                      </div>
                    ) : (
                      <CTable striped bordered hover responsive>
                        <CTableHead className="table-header-fixed">
                          <CTableRow>
                            <CTableHeaderCell>Select</CTableHeaderCell>
                            <CTableHeaderCell>Sr. No</CTableHeaderCell>
                            <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                            <CTableHeaderCell>Model Name</CTableHeaderCell>
                            <CTableHeaderCell>Type</CTableHeaderCell>
                            <CTableHeaderCell>Color</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Inward Date</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle, index) => (
                              <CTableRow key={vehicle._id}>
                                <CTableDataCell>
                                  <CFormCheck
                                    onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
                                    checked={selectedVehicles.includes(vehicle._id)}
                                    disabled={isSubmitting}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell className="fw-mono">{vehicle.chassisNumber}</CTableDataCell>
                                <CTableDataCell>{vehicle.modelName}</CTableDataCell>
                                <CTableDataCell>
                                  <span className="badge bg-secondary">{vehicle.type}</span>
                                </CTableDataCell>
                                <CTableDataCell>{vehicle.color?.name || '-'}</CTableDataCell>
                                <CTableDataCell>
                                  <span className={`badge bg-${vehicle.status === 'in_stock' ? 'success' : 'warning'}`}>
                                    {vehicle.status?.replace('_', ' ') || vehicle.status}
                                  </span>
                                </CTableDataCell>
                                <CTableDataCell>
                                  {formatDate(vehicle.inwardDate)}
                                </CTableDataCell>
                              </CTableRow>
                            ))
                          ) : (
                            <CTableRow>
                              <CTableDataCell colSpan={8} className="text-center">
                                {searchTerm ? 'No vehicles match your search criteria' : 'No in-stock vehicles found'}
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                    )}
                  </div>
                )}

                {formData.transferAllVehicles && isSourceSelected && vehicles.length > 0 && (
                  <div className="alert alert-warning mt-4">
                    <strong>Note:</strong> You have selected "Transfer all in-stock vehicles". 
                    All {vehicles.length} in-stock vehicles from {getSourceLocationName()} will be transferred to {getTargetLocationName()}.
                  </div>
                )}

                {isSourceSelected && !formData.transferAllVehicles && vehicles.length === 0 && !isLoadingVehicles && (
                  <div className="alert alert-info mt-4">
                    No in-stock vehicles found at the selected source location.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* Transfer Challan Modal */}
      <CModal visible={showChallanModal} onClose={handleCloseModal} size="xl" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>Transfer Challan Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {challanData && <TransferChallan {...challanData} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockMovement;