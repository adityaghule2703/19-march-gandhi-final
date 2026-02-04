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
  CRow,
  CCol
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import Swal from 'sweetalert2';
import '../../../css/form.css';

const AddRates = ({ show, onClose, onRateSaved, editingRate }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // REMOVED: All branch filtering logic

  const [formData, setFormData] = useState({
    branchId: '', // Start with empty selection
    providerId: '',
    gcRate: ''
  });
  const [branches, setBranches] = useState([]);
  const [providers, setProviders] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingRate) {
      setFormData({
        branchId: editingRate.branch || '',
        providerId: editingRate.financeProvider || '',
        gcRate: editingRate.gcRate || ''
      });
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

    fetchBranches();
    fetchProviders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.branchId) {
      errors.branchId = 'Branch is required';
    }
    
    if (!formData.providerId) {
      errors.providerId = 'Financer is required';
    }
    
    if (!formData.gcRate) {
      errors.gcRate = 'GC Rate is required';
    } else if (isNaN(parseFloat(formData.gcRate))) {
      errors.gcRate = 'GC Rate must be a valid number';
    } else if (parseFloat(formData.gcRate) < 0) {
      errors.gcRate = 'GC Rate cannot be negative';
    }

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
      const payload = {
        ...formData,
        gcRate: parseFloat(formData.gcRate)
      };

      let response;
      if (editingRate) {
        response = await axiosInstance.put(`/financers/rates/${editingRate.id}`, payload);
        onRateSaved('Finance rate updated successfully');
      } else {
        response = await axiosInstance.post('/financers/rates', payload);
        onRateSaved('Finance rate added successfully');
      }
      
      // Reset form on successful submission
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error saving finance rate:', error);
      
      // Handle specific "rate already exists" error
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage && errorMessage.includes('already exists')) {
        // Show a more informative error message
        Swal.fire({
          title: 'Duplicate Rate!',
          text: errorMessage,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f0ad4e'
        });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = error.response.data.errors;
        setFormErrors(serverErrors);
        
        // Also show a general error message if there's one
        if (error.response?.data?.message) {
          showError(error.response.data.message);
        }
      } else {
        // Show generic error for other cases
        showError(errorMessage || 'Failed to save finance rate');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      branchId: '', // Reset to empty
      providerId: '',
      gcRate: ''
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
        <CModalTitle>{editingRate ? 'Edit Finance Rate' : 'Add New Finance Rate'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="branchId">Branch Name <span className="required">*</span></CFormLabel>
                <CInputGroup>
                  <CFormSelect 
                    id="branchId"
                    name="branchId" 
                    value={formData.branchId} 
                    onChange={handleInputChange}
                    invalid={!!formErrors.branchId}
                  >
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {formErrors.branchId && (
                  <div className="error-text">
                    {formErrors.branchId}
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="providerId">Financer Name <span className="required">*</span></CFormLabel>
                <CInputGroup>
                  <CFormSelect 
                    id="providerId"
                    name="providerId" 
                    value={formData.providerId} 
                    onChange={handleInputChange}
                    invalid={!!formErrors.providerId}
                  >
                    <option value="">-Select-</option>
                    {providers.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {formErrors.providerId && (
                  <div className="error-text">
                    {formErrors.providerId}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="gcRate">GC Rate <span className="required">*</span></CFormLabel>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    id="gcRate"
                    name="gcRate"
                    value={formData.gcRate}
                    onChange={handleInputChange}
                    placeholder="Enter GC Rate"
                    invalid={!!formErrors.gcRate}
                    step="0.01"
                    min="0"
                  />
                </CInputGroup>
                {formErrors.gcRate && (
                  <div className="error-text">
                    {formErrors.gcRate}
                  </div>
                )}
                <div className="text-muted small mt-1">
                  Enter the GC rate as a decimal number (e.g., 2.5 for 2.5%)
                </div>
              </div>
            </CCol>
          </CRow>
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
            {submitting ? <CSpinner size="sm" /> : (editingRate ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddRates;