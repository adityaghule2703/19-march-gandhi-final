import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CFormInput, CFormSelect, CAlert } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitToast } from '../../utils/sweetAlerts';
import FormButtons from '../../utils/FormButtons';
import axiosInstance from '../../axiosInstance';
import Select from "react-select";

function InwardStock() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    model: { _id: '', model_name: '', type: '' },
    locationType: '',
    unloadLocation: storedUser.branch?._id || '',
    godownLocation: '',
    type: '',
    color: { id: '' },
    batteryNumber: '',
    keyNumber: '',
    chassisNumber: '',
    engineNumber: '',
    motorNumber: '',
    chargerNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [models, setModels] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const filteredModels = models.filter((model) => {
    if (formData.type === 'EV') return model.type === 'EV';
    if (formData.type === 'ICE') return model.type === 'ICE';
    return false;
  });

  useEffect(() => {
    if (id) fetchInward(id);
  }, [id]);

  const fetchInward = async (id) => {
    try {
      const res = await axiosInstance.get(`/vehicles/${id}`);
      const vehicle = res.data.data.vehicle;

      setFormData({
        ...vehicle,
        model: {
          _id: vehicle.model,
          model_name: vehicle.modelName
        },
        color: vehicle.color || { id: '', name: '' },
        locationType: vehicle.locationType || '',
        unloadLocation: vehicle.unloadLocation?._id || '',
        godownLocation: vehicle.godownLocation?._id || vehicle.godownLocation || '',
      });
    } catch (error) {
      console.error('Error fetching inward:', error);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axiosInstance.get('/models');
        setModels(response.data.data.models);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        showError(error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const fetchColorsForModel = async () => {
      if (formData.model._id) {
        try {
          const response = await axiosInstance.get(`/colors/model/${formData.model._id}`);
          setAvailableColors(response.data.data.colors || []);
          if (!id) {
            setFormData((prev) => ({ ...prev, color: { id: '' } }));
          }
        } catch (error) {
          console.error('Failed to fetch colors:', error);
          setAvailableColors([]);
        }
      } else {
        setAvailableColors([]);
      }
    };
    fetchColorsForModel();
  }, [formData.model._id, id]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showError(error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchGodowns = async () => {
      try {
        const response = await axiosInstance.get('/godowns');
        setGodowns(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error fetching godowns:', error);
        showError(error);
      }
    };
    fetchGodowns();
  }, []);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.locationType) {
      formErrors.locationType = 'Location Type is required';
      isValid = false;
    }

    if (formData.locationType === 'branch' && !formData.unloadLocation) {
      formErrors.unloadLocation = 'Unload location is required';
      isValid = false;
    }

    if (formData.locationType === 'godown' && !formData.godownLocation) {
      formErrors.godownLocation = 'Godown location is required';
      isValid = false;
    }

    if (!formData.model._id) {
      formErrors.model = 'Model is required';
      isValid = false;
    }

    if (!formData.type) {
      formErrors.type = 'Type is required';
      isValid = false;
    }

    if (!formData.color.id) {
      formErrors.color = 'Color is required';
      isValid = false;
    }

    if (!formData.keyNumber) {
      formErrors.keyNumber = 'Key number is required';
      isValid = false;
    }

    if (!formData.chassisNumber) {
      formErrors.chassisNumber = 'Chassis number is required';
      isValid = false;
    }

    if (formData.type === 'EV') {
      if (!formData.batteryNumber) {
        formErrors.batteryNumber = 'Battery number is required';
        isValid = false;
      }
      if (!formData.engineNumber) {
        formErrors.engineNumber = 'Engine number is required';
        isValid = false;
      }
      if (!formData.motorNumber) {
        formErrors.motorNumber = 'Motor number is required';
        isValid = false;
      }
      if (!formData.chargerNumber) {
        formErrors.chargerNumber = 'Charger number is required';
        isValid = false;
      }
    } else if (formData.type === 'ICE') {
      if (!formData.engineNumber) {
        formErrors.engineNumber = 'Engine number is required';
        isValid = false;
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'locationType') {
      setFormData((prev) => ({
        ...prev,
        locationType: value,
        unloadLocation: value === 'branch' ? (storedUser.branch?._id || '') : '',
        godownLocation: '',
      }));
    } else if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        type: value,
        model: { _id: '', model_name: '' },
        color: { id: '' },
        batteryNumber: '',
        keyNumber: '',
        chassisNumber: '',
        engineNumber: '',
        motorNumber: '',
        chargerNumber: '',
      }));
    } else if (name === 'model') {
      const selectedModel = models.find((m) => m._id === value);
      setFormData((prev) => ({
        ...prev,
        model: {
          _id: selectedModel?._id || '',
          model_name: selectedModel?.model_name || ''
        },
        color: { id: '' }
      }));
    } else if (name === 'color') {
      const selectedColor = availableColors.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        color: {
          id: selectedColor?.id || '',
          name: selectedColor?.name || ''
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let payload;

      if (formData.locationType === 'godown') {
        // Godown payload - includes all fields now
        payload = {
          chassisNumber: formData.chassisNumber,
          locationType: 'godown',
          godownLocation: formData.godownLocation,
          model: formData.model._id,
          modelName: formData.model.model_name,
          type: formData.type,
          color: {
            id: formData.color.id,
            name: formData.color.name
          },
          engineNumber: formData.engineNumber,
          keyNumber: formData.keyNumber,
          batteryNumber: formData.batteryNumber,
          motorNumber: formData.motorNumber,
          chargerNumber: formData.chargerNumber,
          hasDamage: false,
        };
      } else {
        // Branch payload
        payload = {
          modelName: formData.model.model_name,
          model: formData.model._id,
          unloadLocation: formData.unloadLocation,
          locationType: 'branch',
          type: formData.type,
          color: {
            id: formData.color.id,
            name: formData.color.name
          },
          batteryNumber: formData.batteryNumber,
          keyNumber: formData.keyNumber,
          chassisNumber: formData.chassisNumber,
          engineNumber: formData.engineNumber,
          motorNumber: formData.motorNumber,
          chargerNumber: formData.chargerNumber,
        };
      }

      if (id) {
        await axiosInstance.put(`/vehicles/${id}`, payload);
        await showFormSubmitToast('Vehicle updated successfully!', () => navigate('/inward-list'));
      } else {
        await axiosInstance.post('/vehicles', payload);
        await showFormSubmitToast('Vehicle added successfully!', () => navigate('/inward-list'));
      }
      navigate('/inward-list');
    } catch (error) {
      console.error('Error details:', error);
      const message = showError(error);
      if (message) setError(message);
    }
  };

  const handleCancel = () => {
    navigate('/inward-list');
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Vehicle Inward</div>
      {error && <CAlert color="danger">{error}</CAlert>}
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              {/* Location Type */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details label">Location Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormSelect name="locationType" value={formData.locationType} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="branch">Branch</option>
                    <option value="godown">Godown</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.locationType && <p className="error">{errors.locationType}</p>}
              </div>

              {/* Conditional Location */}
              {formData.locationType === 'branch' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details label">Unload Location</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CFormSelect name="unloadLocation" value={formData.unloadLocation} onChange={handleChange}>
                      <option value="">-Select-</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.unloadLocation && <p className="error">{errors.unloadLocation}</p>}
                </div>
              )}

              {formData.locationType === 'godown' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details label">Godown Location</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CFormSelect name="godownLocation" value={formData.godownLocation} onChange={handleChange}>
                      <option value="">-Select-</option>
                      {godowns.map((godown) => (
                        <option key={godown._id || godown.id} value={godown._id || godown.id}>
                          {godown.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.godownLocation && <p className="error">{errors.godownLocation}</p>}
                </div>
              )}

              {!id && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Inward Date</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CFormInput type="date" value={new Date().toISOString().split('T')[0]} readOnly />
                  </CInputGroup>
                </div>
              )}

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormSelect name="type" value={formData.type} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="EV">EV</option>
                    <option value="ICE">ICE</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.type && <p className="error">{errors.type}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Model Name</span>
                  <span className="required">*</span>
                </div>

                <Select
                  classNamePrefix="react-select"
                  placeholder="- Select a Model -"
                  isDisabled={!formData.type}
                  options={filteredModels.map((model) => ({
                    value: model._id,
                    label: model.model_name,
                  }))}
                  value={
                    formData.model && formData.model._id
                      ? { value: formData.model._id, label: formData.model.model_name }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      model: selectedOption
                        ? { _id: selectedOption.value, model_name: selectedOption.label }
                        : null,
                    }));
                    setErrors((prev) => ({ ...prev, model: "" }));
                  }}
                />

                {errors.model && <p className="error">{errors.model}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Color</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormSelect
                    name="color"
                    value={formData.color.id}
                    onChange={handleChange}
                    disabled={!formData.model._id || availableColors.length === 0}
                  >
                    <option value="">-Select a color-</option>
                    {availableColors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.color && <p className="error">{errors.color}</p>}
                {formData.model._id && availableColors.length === 0 && <p className="error">No colors available for the selected model</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Chassis No.</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormInput type="text" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} />
                </CInputGroup>
                {errors.chassisNumber && <p className="error">{errors.chassisNumber}</p>}
              </div>

              {/* Key No - SHOWN FOR BOTH */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Key No.</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormInput type="text" name="keyNumber" value={formData.keyNumber} onChange={handleChange} />
                </CInputGroup>
                {errors.keyNumber && <p className="error">{errors.keyNumber}</p>}
              </div>

              {/* Battery No - SHOWN FOR BOTH */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Battery No.</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormInput type="text" name="batteryNumber" value={formData.batteryNumber} onChange={handleChange} />
                </CInputGroup>
                {errors.batteryNumber && <p className="error">{errors.batteryNumber}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Engine No.</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CFormInput type="text" name="engineNumber" value={formData.engineNumber} onChange={handleChange} />
                </CInputGroup>
                {errors.engineNumber && <p className="error">{errors.engineNumber}</p>}
              </div>

              {/* EV-specific fields - SHOWN FOR BOTH */}
              {formData.type === 'EV' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Motor No.</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CFormInput type="text" name="motorNumber" value={formData.motorNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.motorNumber && <p className="error">{errors.motorNumber}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Charger No.</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CFormInput type="text" name="chargerNumber" value={formData.chargerNumber} onChange={handleChange} />
                    </CInputGroup>
                    {errors.chargerNumber && <p className="error">{errors.chargerNumber}</p>}
                  </div>
                </>
              )}
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default InwardStock;