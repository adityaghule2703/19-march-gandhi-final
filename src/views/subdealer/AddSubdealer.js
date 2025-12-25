import React, { useState, useEffect, useCallback } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CCard, CCardBody } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDollar, cilList, cilLocationPin, cilUser, cilGlobeAlt } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts.js';
import axiosInstance from 'src/axiosInstance.js';
import FormButtons from 'src/utils/FormButtons';
import { showError } from '../../utils/sweetAlerts';

// Import Leaflet components
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default icons in Leaflet
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Default center: India
const DEFAULT_MAP_CENTER = [20.5937, 78.9629]; // [lat, lng]
const DEFAULT_MAP_ZOOM = 5;

// Component to handle map clicks
function LocationMarker({ position, setPosition, setMapCenter }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setMapCenter([lat, lng]);
      map.flyTo([lat, lng], map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
          setMapCenter([position.lat, position.lng]);
        }
      }}
    >
      <Popup>Subdealer Location</Popup>
    </Marker>
  );
}

function AddSubdealer() {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    latLong: {
      coordinates: ['', ''], // [longitude, latitude]
      address: ''
    },
    rateOfInterest: '',
    type: '',
    discount: ''
  });

  // State for map
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchSubdealer(id);
    }
    fetchBranches();
  }, [id]);

  const fetchSubdealer = async (id) => {
    try {
      const res = await axiosInstance.get(`/subdealers/${id}`);
      const subdealerData = res.data.data.subdealer;

      const coords = subdealerData.latLong?.coordinates || ['', ''];
      const address = subdealerData.latLong?.address || '';

      setFormData({
        ...subdealerData,
        latLong: { coordinates: coords, address }
      });

      if (coords[0] && coords[1]) {
        const lat = parseFloat(coords[1]);
        const lng = parseFloat(coords[0]);
        const position = [lat, lng];
        setMarkerPosition(position);
        setMapCenter(position);
      }
    } catch (error) {
      console.error('Error fetching subdealer:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError(error);
    }
  };

  // Fetch address using OpenStreetMap Nominatim API
  const fetchAddressFromCoordinates = useCallback(async (lat, lng) => {
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data.display_name) {
        setFormData(prevData => ({
          ...prevData,
          latLong: {
            ...prevData.latLong,
            address: data.display_name
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setIsFetchingAddress(false);
    }
  }, []);

  // Handle location updates
  const updateLocation = useCallback((lat, lng) => {
    const newPosition = [lat, lng];
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);

    setFormData(prevData => ({
      ...prevData,
      latLong: {
        ...prevData.latLong,
        coordinates: [lng.toString(), lat.toString()]
      }
    }));

    fetchAddressFromCoordinates(lat, lng);
  }, [fetchAddressFromCoordinates]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('latLong.')) {
      const path = name.split('.');
      if (path[1] === 'coordinates') {
        const index = parseInt(path[2]);
        setFormData(prevData => ({
          ...prevData,
          latLong: {
            ...prevData.latLong,
            coordinates: prevData.latLong.coordinates.map((coord, i) =>
              i === index ? value : coord
            )
          }
        }));

        // Update marker when coordinates are manually entered
        if (index === 0 && formData.latLong.coordinates[1]) {
          const lng = parseFloat(value);
          const lat = parseFloat(formData.latLong.coordinates[1]);
          if (!isNaN(lng) && !isNaN(lat)) {
            setMarkerPosition([lat, lng]);
            setMapCenter([lat, lng]);
          }
        } else if (index === 1 && formData.latLong.coordinates[0]) {
          const lat = parseFloat(value);
          const lng = parseFloat(formData.latLong.coordinates[0]);
          if (!isNaN(lat) && !isNaN(lng)) {
            setMarkerPosition([lat, lng]);
            setMapCenter([lat, lng]);
          }
        }
      } else if (path[1] === 'address') {
        setFormData(prevData => ({
          ...prevData,
          latLong: {
            ...prevData.latLong,
            address: value
          }
        }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.name) formErrors.name = 'This field is required';
    if (!formData.branch) formErrors.branch = 'This field is required';
    if (!formData.rateOfInterest) formErrors.rateOfInterest = 'This field is required';
    if (!formData.type) formErrors.type = 'This field is required';
    if (!formData.discount) formErrors.discount = 'This field is required';

    if (!formData.latLong.address) formErrors['latLong.address'] = 'Address is required';
    if (!formData.latLong.coordinates[0] || !formData.latLong.coordinates[1]) {
      formErrors['latLong.coordinates'] = 'Both longitude and latitude are required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        branch: formData.branch,
        latLong: {
          coordinates: [
            parseFloat(formData.latLong.coordinates[0]),
            parseFloat(formData.latLong.coordinates[1])
          ],
          address: formData.latLong.address
        },
        rateOfInterest: parseFloat(formData.rateOfInterest),
        type: formData.type,
        discount: parseFloat(formData.discount)
      };

      if (id) {
        await axiosInstance.put(`/subdealers/${id}`, submitData);
        await showFormSubmitToast('Subdealer updated successfully!', () => navigate('/subdealer-list'));
        navigate('/subdealer-list');
      } else {
        await axiosInstance.post('/subdealers', submitData);
        await showFormSubmitToast('Subdealer added successfully!', () => navigate('/subdealer-list'));
        navigate('/subdealer-list');
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/subdealer-list');
  };

  return (
    <div className="form-container">
      <div className='title'>{id ? 'Edit' : 'Add'} Subdealer</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              {/* First row: Name and Branch (2 fields) */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter subdealer name"
                  />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    {branches.map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.branch && <p className="error">{errors.branch}</p>}
              </div>

              {/* Second row: Full width Map */}
              <div className="input-box full-width-map">
                <div className="details-container">
                  <span className="details">Select Location on Map</span>
                  <span className="required">*</span>
                </div>
                <p className="text-muted small mb-2">
                  Click on the map or drag the marker to set the location. Coordinates and address will update automatically.
                </p>
                <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={DEFAULT_MAP_ZOOM}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker 
                      position={markerPosition} 
                      setPosition={(pos) => {
                        if (pos) {
                          updateLocation(pos[0], pos[1]);
                        }
                      }}
                      setMapCenter={setMapCenter}
                    />
                  </MapContainer>
                </div>
                {errors['latLong.coordinates'] && <p className="error">{errors['latLong.coordinates']}</p>}
              </div>

              {/* Third row: Latitude, Longitude, Address (3 fields) */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Latitude</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilGlobeAlt} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    step="any"
                    name="latLong.coordinates.1"
                    value={formData.latLong.coordinates[1] || ''}
                    onChange={handleChange}
                    placeholder="Click map to set"
                  />
                </CInputGroup>
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Longitude</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilGlobeAlt} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    step="any"
                    name="latLong.coordinates.0"
                    value={formData.latLong.coordinates[0] || ''}
                    onChange={handleChange}
                    placeholder="Click map to set"
                  />
                </CInputGroup>
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Address</span>
                  <span className="required">*</span>
                  {isFetchingAddress && <span className="ms-2 small text-info">(Fetching...)</span>}
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="latLong.address"
                    value={formData.latLong.address || ''}
                    onChange={handleChange}
                    placeholder="Address will be filled from map selection"
                  />
                </CInputGroup>
                {errors['latLong.address'] && <p className="error">{errors['latLong.address']}</p>}
              </div>

              {/* Fourth row: Rate of Interest, Type, Discount (3 fields) */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Rate Of Interest (%)</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    step="any"
                    name="rateOfInterest" 
                    value={formData.rateOfInterest} 
                    onChange={handleChange} 
                    placeholder="Enter rate of interest"
                  />
                </CInputGroup>
                {errors.rateOfInterest && <p className="error">{errors.rateOfInterest}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.type && <p className="error">{errors.type}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Discount (%)</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    step="any"
                    name="discount" 
                    value={formData.discount} 
                    onChange={handleChange} 
                    placeholder="Enter discount percentage"
                  />
                </CInputGroup>
                {errors.discount && <p className="error">{errors.discount}</p>}
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSubdealer;