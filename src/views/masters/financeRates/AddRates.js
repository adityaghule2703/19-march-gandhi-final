// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormInput,
//   CFormLabel,
//   CFormSelect,
//   CButton,
//   CSpinner,
//   CInputGroup,
//   CRow,
//   CCol
// } from '@coreui/react';
// import { showError, axiosInstance } from '../../../utils/tableImports';
// import '../../../css/form.css';

// const AddRates = ({ show, onClose, onRateSaved, editingRate }) => {
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
//   // Check if user has a branch
//   const hasBranch = !!storedUser.branch?._id;
  
//   // Check if user is superadmin by looking at roles array
//   const isSuperAdmin = storedUser.roles?.some(role => role.isSuperAdmin === true);
  
//   // Branch dropdown should be enabled if user is superadmin OR doesn't have a branch
//   const isBranchSelectable = isSuperAdmin || !hasBranch;
  
//   // Default branch ID: for non-superadmin users with a branch, use their branch ID
//   const defaultBranchId = hasBranch && !isSuperAdmin ? storedUser.branch?._id : '';

//   const [formData, setFormData] = useState({
//     branchId: defaultBranchId,
//     providerId: '',
//     gcRate: ''
//   });
//   const [branches, setBranches] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [formErrors, setFormErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (editingRate) {
//       setFormData({
//         branchId: editingRate.branch || '',
//         providerId: editingRate.financeProvider || '',
//         gcRate: editingRate.gcRate || ''
//       });
//     } else {
//       resetForm();
//     }
//   }, [editingRate, show]);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//         showError(error);
//       }
//     };

//     const fetchProviders = async () => {
//       try {
//         const response = await axiosInstance.get('/financers/providers');
//         setProviders(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching finance providers:', error);
//         showError(error);
//       }
//     };

//     fetchBranches();
//     fetchProviders();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.branchId) {
//       errors.branchId = 'Branch is required';
//     }
    
//     if (!formData.providerId) {
//       errors.providerId = 'Financer is required';
//     }
    
//     if (!formData.gcRate) {
//       errors.gcRate = 'GC Rate is required';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         gcRate: parseFloat(formData.gcRate)
//       };

//       if (editingRate) {
//         await axiosInstance.put(`/financers/rates/${editingRate.id}`, payload);
//         onRateSaved('Finance rate updated successfully');
//       } else {
//         await axiosInstance.post('/financers/rates', payload);
//         onRateSaved('Finance rate added successfully');
//       }
//     } catch (error) {
//       console.error('Error saving finance rate:', error);
//       showError(error);
    
//       if (error.response?.data?.errors) {
//         setFormErrors(error.response.data.errors);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       branchId: defaultBranchId,
//       providerId: '',
//       gcRate: ''
//     });
//     setFormErrors({});
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <CModal size="lg" visible={show} onClose={handleClose}>
//       <CModalHeader>
//         <CModalTitle>{editingRate ? 'Edit Finance Rate' : 'Add New Finance Rate'}</CModalTitle>
//       </CModalHeader>
//       <CForm onSubmit={handleSubmit}>
//         <CModalBody>
//           <CRow className="mb-3">
//             <CCol md={6}>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="branchId">Branch Name <span className="required">*</span></CFormLabel>
//                 <CInputGroup>
//                   <CFormSelect 
//                     id="branchId"
//                     name="branchId" 
//                     value={formData.branchId} 
//                     onChange={handleInputChange}
//                     invalid={!!formErrors.branchId}
//                     disabled={!isBranchSelectable}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {formErrors.branchId && (
//                   <div className="error-text">
//                     {formErrors.branchId}
//                   </div>
//                 )}
//                 {/* Optional: Show a note for non-superadmin users */}
//                 {!isSuperAdmin && hasBranch && (
//                   <div className="text-muted small mt-1">
//                     Your branch is automatically selected
//                   </div>
//                 )}
//               </div>
//             </CCol>
//             <CCol md={6}>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="providerId">Financer Name <span className="required">*</span></CFormLabel>
//                 <CInputGroup>
//                   <CFormSelect 
//                     id="providerId"
//                     name="providerId" 
//                     value={formData.providerId} 
//                     onChange={handleInputChange}
//                     invalid={!!formErrors.providerId}
//                   >
//                     <option value="">-Select-</option>
//                     {providers.map((provider) => (
//                       <option key={provider._id} value={provider._id}>
//                         {provider.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {formErrors.providerId && (
//                   <div className="error-text">
//                     {formErrors.providerId}
//                   </div>
//                 )}
//               </div>
//             </CCol>
//           </CRow>
//           <CRow>
//             <CCol md={6}>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="gcRate">GC Rate <span className="required">*</span></CFormLabel>
//                 <CInputGroup>
//                   <CFormInput
//                     type="number"
//                     id="gcRate"
//                     name="gcRate"
//                     value={formData.gcRate}
//                     onChange={handleInputChange}
//                     placeholder="Enter GC Rate"
//                     invalid={!!formErrors.gcRate}
//                     step="0.01"
//                   />
//                 </CInputGroup>
//                 {formErrors.gcRate && (
//                   <div className="error-text">
//                     {formErrors.gcRate}
//                   </div>
//                 )}
//               </div>
//             </CCol>
//           </CRow>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className='submit-button'
//             type="submit"
//             disabled={submitting}
//           >
//             {submitting ? <CSpinner size="sm" /> : (editingRate ? 'Update' : 'Submit')}
//           </CButton>
//         </CModalFooter>
//       </CForm>
//     </CModal>
//   );
// };

// export default AddRates;



import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilDollar, cilPlus, cilMinus } from '@coreui/icons';
import { showError, axiosInstance } from '../../../utils/tableImports';
import Swal from 'sweetalert2';
import '../../../css/form.css';

const AddRates = ({ show, onClose, onRateSaved, editingRate }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    providerId: '',
    branchRates: [
      {
        branchId: '',
        gcRate: ''
      }
    ]
  });
  const [branches, setBranches] = useState([]);
  const [providers, setProviders] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingRate) {
      // When editing, we receive the grouped provider data
      if (editingRate.providerId && editingRate.branchRates) {
        setFormData({
          providerId: editingRate.providerId,
          branchRates: editingRate.branchRates.map(rate => ({
            branchId: rate.branchId,
            gcRate: rate.gcRate,
            rateId: rate.rateId // Store rateId for updates
          }))
        });
      }
    } else {
      resetForm();
    }
  }, [editingRate, show]);

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

    const fetchProviders = async () => {
      try {
        const response = await axiosInstance.get('/financers/providers');
        setProviders(response.data.data || []);
      } catch (error) {
        console.error('Error fetching finance providers:', error);
        showError(error);
      }
    };

    if (show) {
      fetchBranches();
      fetchProviders();
    }
  }, [show]);

  const handleProviderChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      providerId: value
    }));
    if (formErrors.providerId) {
      setFormErrors(prev => ({ ...prev, providerId: '' }));
    }
  };

  const handleBranchRateChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBranchRates = [...formData.branchRates];
    updatedBranchRates[index] = {
      ...updatedBranchRates[index],
      [name]: value
    };

    setFormData(prev => ({
      ...prev,
      branchRates: updatedBranchRates
    }));

    // Clear error for this specific field
    if (formErrors[`branchId-${index}`] || formErrors[`gcRate-${index}`]) {
      const newErrors = { ...formErrors };
      delete newErrors[`branchId-${index}`];
      delete newErrors[`gcRate-${index}`];
      setFormErrors(newErrors);
    }
  };

  const addBranchRate = () => {
    setFormData(prev => ({
      ...prev,
      branchRates: [
        ...prev.branchRates,
        {
          branchId: '',
          gcRate: ''
        }
      ]
    }));
  };

  const removeBranchRate = (index) => {
    if (formData.branchRates.length <= 1) return;
    
    const updatedBranchRates = formData.branchRates.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      branchRates: updatedBranchRates
    }));

    // Clean up errors for removed branch
    const newErrors = { ...formErrors };
    delete newErrors[`branchId-${index}`];
    delete newErrors[`gcRate-${index}`];
    setFormErrors(newErrors);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.providerId) {
      errors.providerId = 'Financer is required';
    }

    formData.branchRates.forEach((branchRate, index) => {
      if (!branchRate.branchId) {
        errors[`branchId-${index}`] = 'Branch is required';
      }
      
      if (!branchRate.gcRate && branchRate.gcRate !== 0) {
        errors[`gcRate-${index}`] = 'GC Rate is required';
      } else if (isNaN(parseFloat(branchRate.gcRate))) {
        errors[`gcRate-${index}`] = 'GC Rate must be a valid number';
      } else if (parseFloat(branchRate.gcRate) < 0) {
        errors[`gcRate-${index}`] = 'GC Rate cannot be negative';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (editingRate) {
        // For editing, we need to update each rate individually
        // since there's no bulk update API
        const updatePromises = formData.branchRates.map(branchRate => {
          // If rate has an ID, update existing rate
          if (branchRate.rateId) {
            const payload = {
              branchId: branchRate.branchId,
              providerId: formData.providerId,
              gcRate: parseFloat(branchRate.gcRate)
            };
            return axiosInstance.put(`/financers/rates/${branchRate.rateId}`, payload);
          } else {
            // If no ID, create new rate
            const payload = {
              branchId: branchRate.branchId,
              providerId: formData.providerId,
              gcRate: parseFloat(branchRate.gcRate)
            };
            return axiosInstance.post('/financers/rates', payload);
          }
        });

        await Promise.all(updatePromises);
        onRateSaved('Finance rates updated successfully');
      } else {
        // For new rates, we need to create each one individually
        const createPromises = formData.branchRates.map(branchRate => {
          const payload = {
            branchId: branchRate.branchId,
            providerId: formData.providerId,
            gcRate: parseFloat(branchRate.gcRate)
          };
          return axiosInstance.post('/financers/rates', payload);
        });

        await Promise.all(createPromises);
        onRateSaved('Finance rates added successfully');
      }
      
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error saving finance rate:', error);
      
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage && errorMessage.includes('already exists')) {
        Swal.fire({
          title: 'Duplicate Rate!',
          text: errorMessage,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f0ad4e'
        });
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setFormErrors(serverErrors);
        
        if (error.response?.data?.message) {
          showError(error.response.data.message);
        }
      } else {
        showError(errorMessage || 'Failed to save finance rate');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      providerId: '',
      branchRates: [
        {
          branchId: '',
          gcRate: ''
        }
      ]
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingRate ? 'Edit Finance Rates' : 'Add New Finance Rates'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {/* Financer Selection */}
          <CRow className="mb-4">
            <CCol md={12}>
              <div className="mb-3">
                <CFormLabel htmlFor="providerId" className="fw-semibold">
                  Financer Name <span className="required">*</span>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormSelect 
                    id="providerId"
                    name="providerId" 
                    value={formData.providerId} 
                    onChange={handleProviderChange}
                    invalid={!!formErrors.providerId}
                    disabled={editingRate} // Disable provider selection when editing
                  >
                    <option value="">-Select Financer-</option>
                    {providers.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {formErrors.providerId && (
                  <div className="error-text">{formErrors.providerId}</div>
                )}
              </div>
            </CCol>
          </CRow>

          {/* Branch Rates Section */}
          <div className="branches-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Branch Rates</h5>
              <CButton 
                color="primary" 
                size="sm" 
                onClick={addBranchRate}
                type="button"
              >
                <CIcon icon={cilPlus} className="me-1" />
                Add Branch Rate
              </CButton>
            </div>

            {formData.branchRates.map((branchRate, index) => (
              <CCard key={index} className="mb-3">
                <CCardHeader className="bg-light d-flex justify-content-between align-items-center py-2">
                  <h6 className="mb-0">Branch {index + 1}</h6>
                  {formData.branchRates.length > 1 && (
                    <CButton 
                      color="danger" 
                      size="sm" 
                      onClick={() => removeBranchRate(index)}
                      type="button"
                    >
                      <CIcon icon={cilMinus} style={{ height: '15px' }} />
                    </CButton>
                  )}
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel htmlFor={`branchId-${index}`} className="fw-semibold">
                          Branch Name <span className="required">*</span>
                        </CFormLabel>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilBuilding} />
                          </CInputGroupText>
                          <CFormSelect 
                            id={`branchId-${index}`}
                            name="branchId" 
                            value={branchRate.branchId} 
                            onChange={(e) => handleBranchRateChange(index, e)}
                            invalid={!!formErrors[`branchId-${index}`]}
                          >
                            <option value="">-Select Branch-</option>
                            {branches.map((branch) => (
                              <option key={branch._id} value={branch._id}>
                                {branch.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {formErrors[`branchId-${index}`] && (
                          <div className="error-text">{formErrors[`branchId-${index}`]}</div>
                        )}
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel htmlFor={`gcRate-${index}`} className="fw-semibold">
                          GC Rate <span className="required">*</span>
                        </CFormLabel>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilDollar} />
                          </CInputGroupText>
                          <CFormInput
                            type="number"
                            id={`gcRate-${index}`}
                            name="gcRate"
                            value={branchRate.gcRate}
                            onChange={(e) => handleBranchRateChange(index, e)}
                            placeholder="Enter GC Rate"
                            invalid={!!formErrors[`gcRate-${index}`]}
                            step="0.01"
                            min="0"
                          />
                        </CInputGroup>
                        {formErrors[`gcRate-${index}`] && (
                          <div className="error-text">{formErrors[`gcRate-${index}`]}</div>
                        )}
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            ))}

            <div className="text-muted small mt-2">
              <i className="fas fa-info-circle me-1"></i>
              Enter GC rates as decimal numbers (e.g., 2.5 for 2.5%)
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            type="submit"
            disabled={submitting}
          >
            {submitting ? <CSpinner size="sm" /> : (editingRate ? 'Update All' : 'Submit All')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddRates;