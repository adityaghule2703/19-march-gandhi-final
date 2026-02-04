// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBank, cilDollar, cilList, cilLocationPin, cilUser } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import FormButtons from '../../utils/FormButtons';

// function WorkshopReceipt() {
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const hasBranch = !!storedUser.branch?._id;
//   const [formData, setFormData] = useState({
//     recipientName: '',
//     voucherType: 'debit',
//     receiptType: '',
//     amount: '',
//     remark: '',
//     bankLocation: '',
//     branch: hasBranch ? storedUser.branch?._id : ''
//   });
//   const [errors, setErrors] = useState({});
//   const [branches, setBranches] = useState([]);
//   const [banks, setBanks] = useState([]);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };
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

//     fetchBranches();
//   }, []);
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await axiosInstance.get('/banks');
//         setBanks(response.data.data.banks || []);
//       } catch (error) {
//         console.error('Error fetching banks:', error);
//         showError(error);
//       }
//     };

//     fetchBanks();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formErrors = {};

//     if (!formData.recipientName) formErrors.recipientName = 'This field is required';
//     if (!formData.receiptType) formErrors.receiptType = 'This field is required';
//     if (!formData.amount) formErrors.amount = 'This field is required';
//     // if (!formData.voucherType) formErrors.voucherType = 'This field is required';
//     if (!formData.bankLocation) formErrors.bankLocation = 'This field is required';

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       await axiosInstance.post('/workshop-receipts', formData);
//       await showFormSubmitToast('Data added successfully!', () => navigate('/cash-receipt'));

//       navigate('/cash-receipt');
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/cash-receipt');
//   };
//   return (
//     <div className="form-container">
//        <div className="title">Workshop Cash Receipt</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Receipant Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.recipientName && <p className="error">{errors.recipientName}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormSelect name="branch" value={formData.branch} onChange={handleChange}>
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.branch && <p className="error">{errors.branch}</p>}
//               </div>
//               {/* <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Voucher Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect type="text" name="voucherType" value={formData.voucherType} onChange={handleChange}>
//                     <option value="">-Select</option>
//                     <option value="credit">Credit</option>
//                     <option value="debit">Debit</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.voucherType && <p className="error">{errors.voucherType}</p>}
//               </div> */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Receipt Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect type="text" name="receiptType" value={formData.receiptType} onChange={handleChange}>
//                     <option value="">-Select</option>
//                     <option value="Workshop">Workshop</option>
//                     <option value="Other">Other</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.receiptType && <p className="error">{errors.receiptType}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Amount</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="amount" value={formData.amount} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.amount && <p className="error">{errors.amount}</p>}
//               </div>
//               <div className="input-box">
//                 <span className="details">Remark</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilList} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="remark" value={formData.remark} onChange={handleChange} />
//                 </CInputGroup>
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Bank Location</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBank} />
//                   </CInputGroupText>
//                   <CFormSelect name="bankLocation" value={formData.bankLocation} onChange={handleChange}>
//                     <option value="">-Select-</option>
//                     {banks.map((bank) => (
//                       <option key={bank._id} value={bank.name}>
//                         {bank.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.bankLocation && <p className="error">{errors.bankLocation}</p>}
//               </div>
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default WorkshopReceipt;









// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBank, cilDollar, cilList, cilLocationPin, cilUser } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import FormButtons from '../../utils/FormButtons';

// function WorkshopReceipt() {
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const hasBranch = !!storedUser.branch?._id;
//   const [formData, setFormData] = useState({
//     recipientName: '',
//     voucherType: 'debit',
//     receiptType: '',
//     amount: '',
//     remark: '',
//     cashLocation: '', // Changed from bankLocation to cashLocation (this will store the ID)
//     branch: hasBranch ? storedUser.branch?._id : ''
//   });
//   const [errors, setErrors] = useState({});
//   const [branches, setBranches] = useState([]);
//   const [cashLocations, setCashLocations] = useState([]); // Changed from banks to cashLocations
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };
  
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

//     fetchBranches();
//   }, []);
  
//   useEffect(() => {
//     const fetchCashLocations = async () => {
//       try {
//         const response = await axiosInstance.get('/cash-locations'); // Changed endpoint
//         setCashLocations(response.data.data.cashLocations || []); // Changed data path
//       } catch (error) {
//         console.error('Error fetching cash locations:', error);
//         showError(error);
//       }
//     };

//     fetchCashLocations();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formErrors = {};

//     if (!formData.recipientName) formErrors.recipientName = 'This field is required';
//     if (!formData.receiptType) formErrors.receiptType = 'This field is required';
//     if (!formData.amount) formErrors.amount = 'This field is required';
//     // if (!formData.voucherType) formErrors.voucherType = 'This field is required';
//     if (!formData.cashLocation) formErrors.cashLocation = 'This field is required'; // Changed from bankLocation

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       await axiosInstance.post('/workshop-receipts', formData);
//       await showFormSubmitToast('Data added successfully!', () => navigate('/cash-receipt'));

//       navigate('/cash-receipt');
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/cash-receipt');
//   };
  
//   return (
//     <div className="form-container">
//        <div className="title">Workshop Cash Receipt</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Receipant Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.recipientName && <p className="error">{errors.recipientName}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormSelect name="branch" value={formData.branch} onChange={handleChange}>
//                     <option value="">-Select-</option>
//                     {branches.map((branch) => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.branch && <p className="error">{errors.branch}</p>}
//               </div>
//               {/* <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Voucher Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect type="text" name="voucherType" value={formData.voucherType} onChange={handleChange}>
//                     <option value="">-Select</option>
//                     <option value="credit">Credit</option>
//                     <option value="debit">Debit</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.voucherType && <p className="error">{errors.voucherType}</p>}
//               </div> */}
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Receipt Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect type="text" name="receiptType" value={formData.receiptType} onChange={handleChange}>
//                     <option value="">-Select</option>
//                     <option value="Workshop">Workshop</option>
//                     <option value="Other">Other</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.receiptType && <p className="error">{errors.receiptType}</p>}
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Amount</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="amount" value={formData.amount} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.amount && <p className="error">{errors.amount}</p>}
//               </div>
//               <div className="input-box">
//                 <span className="details">Remark</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilList} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="remark" value={formData.remark} onChange={handleChange} />
//                 </CInputGroup>
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Cash Location</span> {/* Changed label */}
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBank} />
//                   </CInputGroupText>
//                   <CFormSelect name="cashLocation" value={formData.cashLocation} onChange={handleChange}> {/* Changed name */}
//                     <option value="">-Select-</option>
//                     {cashLocations.map((location) => ( // Changed from banks to cashLocations
//                       <option key={location._id} value={location._id}> {/* Store ID instead of name */}
//                         {location.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.cashLocation && <p className="error">{errors.cashLocation}</p>} {/* Changed from bankLocation */}
//               </div>
//             </div>
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default WorkshopReceipt;




import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBank, cilDollar, cilList, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import FormButtons from '../../utils/FormButtons';

function WorkshopReceipt() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBranch = !!storedUser.branch?._id;
  const [formData, setFormData] = useState({
    recipientName: '',
    voucherType: 'debit',
    receiptType: '',
    amount: '',
    remark: '',
    cashLocation: '', // Changed from bankLocation to cashLocation (this will store the ID)
    branch: hasBranch ? storedUser.branch?._id : ''
  });
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [cashLocations, setCashLocations] = useState([]); // Changed from banks to cashLocations
  const [submitting, setSubmitting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showPdfLoader, setShowPdfLoader] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };
  
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
    const fetchCashLocations = async () => {
      try {
        const response = await axiosInstance.get('/cash-locations'); // Changed endpoint
        setCashLocations(response.data.data.cashLocations || []); // Changed data path
      } catch (error) {
        console.error('Error fetching cash locations:', error);
        showError(error);
      }
    };

    fetchCashLocations();
  }, []);

  const openPdfInNewTab = (pdfBlob) => {
    // Hide PDF loader
    setShowPdfLoader(false);
    setGeneratingPdf(false);
    
    // Create a blob URL for the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Open the PDF in a new tab
    const newTab = window.open(pdfUrl, '_blank');
    
    // Release the blob URL after the tab is loaded
    if (newTab) {
      newTab.onload = () => {
        URL.revokeObjectURL(pdfUrl);
      };
    } else {
      // If popup blocked, fall back to download
      showFormSubmitError('Popup blocked! Please allow popups to view the PDF.');
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `workshop_receipt_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    }
  };

  const showPdfGenerationLoader = () => {
    setGeneratingPdf(true);
    setShowPdfLoader(true);
    
    // Auto-hide the loader after 30 seconds as a safety measure
    setTimeout(() => {
      if (generatingPdf) {
        setShowPdfLoader(false);
        setGeneratingPdf(false);
        showFormSubmitError('PDF generation is taking too long. Please check from the list later.');
      }
    }, 30000);
  };

  const tryPdfEndpoints = async (receiptNo, receiptId) => {
    const endpoints = [];
    
    // Try workshop receipt specific endpoints
    if (receiptNo) {
      endpoints.push(
        `/workshop-receipts/receipt/${receiptNo}`,
        `/receipts/workshop/${receiptNo}`,
        `/workshop-receipts/print/${receiptNo}`,
        `/receipts/${receiptNo}`,
        `/vouchers/receipt/${receiptNo}` // Also try general voucher endpoint
      );
    }
    
    if (receiptId) {
      endpoints.push(
        `/workshop-receipts/receipt/${receiptId}`,
        `/workshop-receipts/print/${receiptId}`,
        `/receipts/workshop/${receiptId}`,
        `/vouchers/receipt/${receiptId}`, // Also try general voucher endpoint
        `/cash-receipts/receipt/${receiptId}` // Try cash-receipts endpoint as fallback
      );
    }

    let pdfFound = false;
    
    for (const endpoint of endpoints) {
      try {
        const pdfResponse = await axiosInstance.get(endpoint, {
          responseType: 'blob'
        });
        
        // Check if response is actually a PDF
        if (pdfResponse.data && pdfResponse.data.type === 'application/pdf') {
          openPdfInNewTab(pdfResponse.data);
          pdfFound = true;
          break;
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error.message);
        continue;
      }
    }
    
    if (!pdfFound) {
      showFormSubmitError('Receipt created but PDF generation failed. Please view it from the list.');
      setGeneratingPdf(false);
      setShowPdfLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.recipientName) formErrors.recipientName = 'This field is required';
    if (!formData.receiptType) formErrors.receiptType = 'This field is required';
    if (!formData.amount) formErrors.amount = 'This field is required';
    if (!formData.cashLocation) formErrors.cashLocation = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setSubmitting(true);
      
      // Submit the workshop receipt
      const response = await axiosInstance.post('/workshop-receipts', formData);
      
      // Show success message
      await showFormSubmitToast('Data added successfully! Generating PDF...');
      
      // Show PDF generation loader
      showPdfGenerationLoader();
      
      // Try to get the PDF from the response
      const receiptNo = response.data.data?.receiptNo || response.data.data?.receiptNumber;
      const receiptId = response.data.data?._id || response.data.data?.id;
      
      if (receiptNo || receiptId) {
        await tryPdfEndpoints(receiptNo, receiptId);
      } else {
        showFormSubmitError('Receipt created but could not generate PDF. Please view it from the list.');
        setGeneratingPdf(false);
        setShowPdfLoader(false);
      }

      // Navigate after successful submission (after PDF is opened)
      navigate('/cash-receipt');
      
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
      setGeneratingPdf(false);
      setShowPdfLoader(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/cash-receipt');
  };
  
  return (
    <div className="form-container">
       <div className="title">Workshop Cash Receipt</div>
       
      {/* PDF Generation Loader Overlay - Same as Cash Voucher */}
      {showPdfLoader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px 40px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <CSpinner color="primary" size="lg" />
            <p style={{ marginTop: '15px', marginBottom: '5px', fontSize: '16px', fontWeight: '500' }}>
              Generating PDF, please wait...
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
              This may take a few seconds
            </p>
          </div>
        </div>
      )}
      
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Receipant Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="recipientName" 
                    value={formData.recipientName} 
                    onChange={handleChange}
                    disabled={submitting || generatingPdf}
                  />
                </CInputGroup>
                {errors.recipientName && <p className="error">{errors.recipientName}</p>}
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
                    disabled={submitting || generatingPdf}
                  >
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.branch && <p className="error">{errors.branch}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Receipt Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    type="text" 
                    name="receiptType" 
                    value={formData.receiptType} 
                    onChange={handleChange}
                    disabled={submitting || generatingPdf}
                  >
                    <option value="">-Select</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Other">Other</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.receiptType && <p className="error">{errors.receiptType}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Amount</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleChange}
                    disabled={submitting || generatingPdf}
                  />
                </CInputGroup>
                {errors.amount && <p className="error">{errors.amount}</p>}
              </div>
              <div className="input-box">
                <span className="details">Remark</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilList} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="remark" 
                    value={formData.remark} 
                    onChange={handleChange}
                    disabled={submitting || generatingPdf}
                  />
                </CInputGroup>
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Cash Location</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBank} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="cashLocation" 
                    value={formData.cashLocation} 
                    onChange={handleChange}
                    disabled={submitting || generatingPdf}
                  >
                    <option value="">-Select-</option>
                    {cashLocations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.cashLocation && <p className="error">{errors.cashLocation}</p>}
              </div>
            </div>
            <FormButtons 
              onCancel={handleCancel} 
              submitDisabled={submitting || generatingPdf}
              submitLabel={submitting ? "Creating..." : generatingPdf ? "Generating PDF..." : "Create"}
              cancelDisabled={submitting || generatingPdf}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
export default WorkshopReceipt;
