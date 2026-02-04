import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDollar, cilList, cilLocationPin, cilUser, cilGlobeAlt, cilCalendar } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts.js';
import axiosInstance from 'src/axiosInstance.js';
import FormButtons from 'src/utils/FormButtons';
import { showError } from '../../utils/sweetAlerts';

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
    discount: '',
    creditPeriodDays: '' // New field added
  });

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
    if (!formData.creditPeriodDays) formErrors.creditPeriodDays = 'This field is required';

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
        discount: parseFloat(formData.discount),
        creditPeriodDays: parseInt(formData.creditPeriodDays) // New field added
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

              {/* Second row: Latitude, Longitude, Address (3 fields) */}
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
                    placeholder="Enter longitude"
                  />
                </CInputGroup>
              </div>

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
                    placeholder="Enter latitude"
                  />
                </CInputGroup>
                {errors['latLong.coordinates'] && <p className="error">{errors['latLong.coordinates']}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Address</span>
                  <span className="required">*</span>
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
                    placeholder="Enter address"
                  />
                </CInputGroup>
                {errors['latLong.address'] && <p className="error">{errors['latLong.address']}</p>}
              </div>

              {/* Third row: Rate of Interest, Type, Discount, Credit Period Days (4 fields) */}
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

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Credit Period (Days)</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="creditPeriodDays" 
                    value={formData.creditPeriodDays} 
                    onChange={handleChange} 
                    placeholder="Enter credit period in days"
                    min="0"
                  />
                </CInputGroup>
                {errors.creditPeriodDays && <p className="error">{errors.creditPeriodDays}</p>}
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