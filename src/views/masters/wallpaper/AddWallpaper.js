import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormLabel, CImage, CSpinner, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilImage } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddWallpaper() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const { id } = useParams();
  const baseURL = 'https://gandhitvs.in/dealership';

  useEffect(() => {
    if (id) {
      fetchWallpaper(id);
    }
  }, [id]);

  const fetchWallpaper = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/wallpapers/${id}`);
      const wallpaperData = res.data.data;
      // Set image preview for existing image
      if (wallpaperData.image_url) {
        setImagePreview(wallpaperData.image_url);
      }
    } catch (error) {
      console.error('Error fetching wallpaper:', error);
      showFormSubmitError('Failed to fetch wallpaper details');
    } finally {
      setLoading(false);
    }
  };

  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const minWidth = 1169;
        const minHeight = 781;
        
        if (width < minWidth || height < minHeight) {
          reject(`Image must be at least ${minWidth}x${minHeight} pixels. Current size: ${width}x${height} pixels`);
        } else {
          resolve({ width, height });
        }
        URL.revokeObjectURL(objectUrl);
      };
      
      img.onerror = () => {
        reject('Failed to load image');
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
        return;
      }
      
      // Validate file size (max 10MB for high-res images)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 10MB' });
        return;
      }

      // Validate image dimensions
      try {
        const dimensions = await validateImageDimensions(file);
        setImageDimensions(dimensions);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors({ ...errors, image: '' });
      } catch (dimensionError) {
        setErrors({ ...errors, image: dimensionError });
        setImageFile(null);
        setImagePreview(null);
        setImageDimensions({ width: 0, height: 0 });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!id && !imageFile) {
      formErrors.image = 'Image is required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (id) {
        // Update existing wallpaper
        await axiosInstance.put(`/wallpaper/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        await showFormSubmitToast('Wallpaper updated successfully!', () => navigate('/wallpaper/wallpaper'));
      } else {
        // Create new wallpaper
        await axiosInstance.post('/wallpapers/upload', formDataToSend, {
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
              <div className="input-box full-width">
                <div className="details-container">
                  <span className="details">Wallpaper Image</span>
                  {!id && <span className="required">*</span>}
                </div>
                
                <CAlert color="info" className="mb-3">
                  <strong>Image Requirements:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Minimum resolution: <strong>1169x781 pixels</strong></li>
                    <li>Supported formats: JPEG, JPG, PNG, GIF, WEBP</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Recommended aspect ratio: ~3:2 (1169:781 ≈ 1.5:1)</li>
                    <li>For best quality, use images that are 1169x781 or larger</li>
                  </ul>
                </CAlert>

                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilImage} />
                  </CInputGroupText>
                  <CFormInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </CInputGroup>
                {errors.image && <p className="error">{errors.image}</p>}
                
                {imageDimensions.width > 0 && imageDimensions.height > 0 && !errors.image && (
                  <div className="mt-2">
                    <span className="text-success">
                      ✓ Image dimensions: {imageDimensions.width} x {imageDimensions.height} pixels
                    </span>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="mt-3">
                    <CFormLabel>Preview:</CFormLabel>
                    <div>
                      <CImage 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
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