import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSwitch, CFormLabel, CImage, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilImage, cilListRich, cilSortNumericUp } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddWallpaper() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    displayOrder: 1,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const baseURL = 'https://gmplmis.com/dealership-api';

  useEffect(() => {
    if (id) {
      fetchWallpaper(id);
    }
  }, [id]);

  const fetchWallpaper = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/wallpaper/${id}`);
      const wallpaperData = res.data.data;
      setFormData({
        title: wallpaperData.title,
        description: wallpaperData.description,
        displayOrder: wallpaperData.displayOrder,
        isActive: wallpaperData.isActive
      });
      // Set image preview for existing image
      if (wallpaperData.image) {
        setImagePreview(`${baseURL}${wallpaperData.image}`);
      }
    } catch (error) {
      console.error('Error fetching wallpaper:', error);
      showFormSubmitError('Failed to fetch wallpaper details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.title) formErrors.title = 'Title is required';
    if (!formData.description) formErrors.description = 'Description is required';
    if (!formData.displayOrder) formErrors.displayOrder = 'Display order is required';
    if (!id && !imageFile) formErrors.image = 'Image is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // Append all fields to FormData
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('displayOrder', formData.displayOrder);
      formDataToSend.append('isActive', formData.isActive);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (id) {
        await axiosInstance.put(`/wallpaper/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        await showFormSubmitToast('Wallpaper updated successfully!', () => navigate('/wallpaper/wallpaper'));
      } else {
        await axiosInstance.post('/wallpaper', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        await showFormSubmitToast('Wallpaper added successfully!', () => navigate('/wallpaper/wallpaper'));
      }
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/wallpaper/wallpaper');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Wallpaper</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Title</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilImage} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="Enter wallpaper title"
                  />
                </CInputGroup>
                {errors.title && <p className="error">{errors.title}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Description</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilListRich} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    placeholder="Enter wallpaper description"
                  />
                </CInputGroup>
                {errors.description && <p className="error">{errors.description}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Display Order</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilSortNumericUp} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="displayOrder" 
                    value={formData.displayOrder} 
                    onChange={handleChange}
                    min="1"
                    placeholder="Enter display order"
                  />
                </CInputGroup>
                {errors.displayOrder && <p className="error">{errors.displayOrder}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Status</span>
                </div>
                <CInputGroup>
                  <CFormSwitch
                    className="custom-switch-toggle"
                    name="isActive"
                    label={formData.isActive ? 'Active' : 'Inactive'}
                    checked={formData.isActive}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        isActive: e.target.checked
                      });
                    }}
                  />
                </CInputGroup>
              </div>

              <div className="input-box full-width">
                <div className="details-container">
                  <span className="details">Wallpaper Image</span>
                  {!id && <span className="required">*</span>}
                </div>
                <CInputGroup>
                  <CFormInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </CInputGroup>
                {errors.image && <p className="error">{errors.image}</p>}
                
                {imagePreview && (
                  <div className="mt-3">
                    <CFormLabel>Preview:</CFormLabel>
                    <div>
                      <CImage 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                        rounded
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <FormButtons 
              onCancel={handleCancel} 
              submitLabel={id ? 'Update' : 'Save'}
              loading={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWallpaper;