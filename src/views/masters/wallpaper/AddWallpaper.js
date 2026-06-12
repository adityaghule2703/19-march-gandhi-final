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
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [screenName, setScreenName] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Screen name options
  const screenOptions = [
    { value: 'login', label: 'Login' },
    { value: 'dashboard', label: 'Dashboard' }
  ];

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
      if (wallpaperData.image_url) {
        setImagePreview(wallpaperData.image_url);
        setExistingImageUrl(wallpaperData.image_url);
      }
      if (wallpaperData.screen_name) {
        setScreenName(wallpaperData.screen_name);
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
    setApiError('');
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 10MB' });
        return;
      }

      try {
        const dimensions = await validateImageDimensions(file);
        setImageDimensions(dimensions);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors({ ...errors, image: '' });
      } catch (dimensionError) {
        setErrors({ ...errors, image: dimensionError });
        setImageFile(null);
        setImagePreview(existingImageUrl);
        setImageDimensions({ width: 0, height: 0 });
      }
    } else {
      setImageFile(null);
      setImagePreview(existingImageUrl);
      setImageDimensions({ width: 0, height: 0 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    setApiError('');

    if (!screenName) {
      formErrors.screenName = 'Screen name is required';
    }

    if (!id && !imageFile) {
      formErrors.image = 'Image is required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      
      if (id) {
        // For UPDATE operation
        if (imageFile) {
          // User selected a new image - send as FormData with file
          const formDataToSend = new FormData();
          formDataToSend.append('screen_name', screenName);
          formDataToSend.append('image', imageFile);
          
          const response = await axiosInstance.put(`/wallpaper/${id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          // No new image selected - send the existing image URL as a string in the image field
          const updateData = {
            screen_name: screenName,
            image: existingImageUrl // Pass the existing image URL
          };
          
          const response = await axiosInstance.put(`/wallpaper/${id}`, updateData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        
        await showFormSubmitToast('Wallpaper updated successfully!', () => navigate('/wallpaper/wallpaper'));
      } else {
        // For CREATE operation
        if (!imageFile) {
          setErrors({ image: 'Image is required' });
          setLoading(false);
          return;
        }
        
        const formDataToSend = new FormData();
        formDataToSend.append('screen_name', screenName);
        formDataToSend.append('image', imageFile);
        
        const response = await axiosInstance.post('/wallpapers/upload', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        await showFormSubmitToast('Wallpaper added successfully!', () => navigate('/wallpaper/wallpaper'));
      }
    } catch (error) {
      console.error('Error details:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.message) {
          setApiError(errorData.message);
          if (errorData.message.toLowerCase().includes('image')) {
            setErrors({ ...errors, image: errorData.message });
          }
        } else {
          showFormSubmitError(error);
        }
      } else {
        showFormSubmitError(error);
      }
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
          <form onSubmit={handleSubmit}>
            {apiError && (
              <CAlert color="danger" className="mb-3" onClose={() => setApiError('')} closeButton>
                <strong>Error!</strong> {apiError}
              </CAlert>
            )}

            <div className="user-details">
              {/* Screen Name Field */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Screen Name</span>
                  <span className="required">*</span>
                </div>
                <select
                  value={screenName}
                  onChange={(e) => {
                    setScreenName(e.target.value);
                    setErrors({ ...errors, screenName: '' });
                    setApiError('');
                  }}
                  className={`form-select ${errors.screenName ? 'is-invalid' : ''}`}
                  style={{ display: 'block', width: '100%', padding: '0.375rem 2.25rem 0.375rem 0.75rem', fontSize: '1rem', lineHeight: '1.5', color: '#212529', backgroundColor: '#fff', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px 12px', border: '1px solid #ced4da', borderRadius: '0.25rem', appearance: 'none' }}
                >
                  <option value="" disabled>Select Screen Name</option>
                  {screenOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.screenName && <p className="error">{errors.screenName}</p>}
              </div>

              {/* Wallpaper Image Field */}
              <div className="input-box full-width">
                <div className="details-container">
                  <span className="details">Wallpaper Image</span>
                  {!id && <span className="required">*</span>}
                  {id && existingImageUrl && !imageFile && (
                    <span className="text-muted" style={{ fontSize: '12px', marginLeft: '10px' }}>
                      (Current image will be kept if no new image is selected)
                    </span>
                  )}
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
                      ✓ New image dimensions: {imageDimensions.width} x {imageDimensions.height} pixels
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
                    {id && imageFile && (
                      <div className="mt-2">
                        <span className="text-info">
                          ℹ️ New image selected. This will replace the existing wallpaper.
                        </span>
                      </div>
                    )}
                    {id && !imageFile && existingImageUrl && (
                      <div className="mt-2">
                        <span className="text-muted">
                          ℹ️ Current wallpaper will be preserved
                        </span>
                      </div>
                    )}
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