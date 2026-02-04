// import React, { useState, useEffect } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBank, cilDollar, cilList, cilLocationPin, cilUser } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import FormButtons from '../../utils/FormButtons';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// function CashVoucher() {
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   // Remove the hasBranch logic if you want to show all branches
//   const [formData, setFormData] = useState({
//     recipientName: '',
//     voucherType: 'credit',
//     expenseType: '',
//     amount: '',
//     remark: '',
//     cashLocation: '',
//     branch: '' // Initialize with empty string instead of user's branch
//   });
//   const [errors, setErrors] = useState({});
//   const [cashLocations, setCashLocations] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
  
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Cash Voucher page under Fund Management module
//   const canViewCashVoucher = canViewPage(
//     permissions, 
//     MODULES.FUND_MANAGEMENT, 
//     PAGES.FUND_MANAGEMENT.CASH_VOUCHER
//   );
  
//   const canCreateCashVoucher = canCreateInPage(
//     permissions, 
//     MODULES.FUND_MANAGEMENT, 
//     PAGES.FUND_MANAGEMENT.CASH_VOUCHER
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   useEffect(() => {
//     if (!canViewCashVoucher) {
//       setLoading(false);
//       return;
//     }
    
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//       }
//     };

//     const fetchCashLocations = async () => {
//       try {
//         const response = await axiosInstance.get('/cash-locations');
//         setCashLocations(response.data.data.cashLocations || []);
//       } catch (error) {
//         console.error('Error fetching cash location:', error);
//       }
//     };

//     const fetchExpense = async () => {
//       try {
//         const response = await axiosInstance.get('/expense-accounts');
//         setExpenses(response.data.data.expenseAccounts || []);
//       } catch (error) {
//         console.error('Error fetching expense:', error);
//       }
//     };

//     const fetchAllData = async () => {
//       setLoading(true);
//       await Promise.all([
//         fetchBranches(),
//         fetchCashLocations(),
//         fetchExpense()
//       ]);
//       setLoading(false);
//     };

//     fetchAllData();
//   }, [canViewCashVoucher]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!canCreateCashVoucher) {
//       showFormSubmitError('You do not have permission to create Cash Voucher');
//       return;
//     }
    
//     let formErrors = {};

//     if (!formData.recipientName) formErrors.recipientName = 'This field is required';
//     if (!formData.expenseType) formErrors.expenseType = 'This field is required';
//     if (!formData.amount) formErrors.amount = 'This field is required';
//     if (!formData.cashLocation) formErrors.cashLocation = 'This field is required';
//     if (!formData.branch) formErrors.branch = 'This field is required';

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       await axiosInstance.post('/cash-vouchers', formData);
//       await showFormSubmitToast('Cash Voucher added successfully!', () => navigate('/cash-receipt'));

//       navigate('/cash-receipt');
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/cash-receipt');
//   };

//   // Check if user has permission to view the page
//   if (!canViewCashVoucher) {
//     return (
//       <div className="form-container">
//         <div className="alert alert-danger m-3" role="alert">
//           You do not have permission to view Cash Voucher.
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="form-container">
//         <div className="title">Cash Voucher</div>
//         <div className="text-center py-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading form data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       <div className="title">Cash Voucher</div>
      
//       {!canCreateCashVoucher && (
//         <CAlert color="danger" className="mb-3">
//           You have VIEW permission but not CREATE permission. You can see this page but cannot create new cash vouchers.
//         </CAlert>
//       )}
      
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
//                   <CFormInput 
//                     type="text" 
//                     name="recipientName" 
//                     value={formData.recipientName} 
//                     onChange={handleChange}
//                     disabled={!canCreateCashVoucher}
//                   />
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
//                   <CFormSelect 
//                     name="branch" 
//                     value={formData.branch} 
//                     onChange={handleChange}
//                     disabled={!canCreateCashVoucher} // Remove the hasBranch condition
//                   >
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
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Expense Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="expenseType" 
//                     value={formData.expenseType} 
//                     onChange={handleChange}
//                     disabled={!canCreateCashVoucher}
//                   >
//                     <option value="">-Select-</option>
//                     {expenses.map((expense) => (
//                       <option key={expense._id} value={expense.name}>
//                         {expense.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.expenseType && <p className="error">{errors.expenseType}</p>}
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
//                   <CFormInput 
//                     type="text" 
//                     name="amount" 
//                     value={formData.amount} 
//                     onChange={handleChange}
//                     disabled={!canCreateCashVoucher}
//                   />
//                 </CInputGroup>
//                 {errors.amount && <p className="error">{errors.amount}</p>}
//               </div>
//               <div className="input-box">
//                 <span className="details">Remark</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilList} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="remark" 
//                     value={formData.remark} 
//                     onChange={handleChange}
//                     disabled={!canCreateCashVoucher}
//                   />
//                 </CInputGroup>
//               </div>
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Cash Location</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBank} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="cashLocation" 
//                     value={formData.cashLocation} 
//                     onChange={handleChange}
//                     disabled={!canCreateCashVoucher}
//                   >
//                     <option value="">-Select-</option>
//                     {cashLocations.map((location) => (
//                       <option key={location._id} value={location.name}>
//                         {location.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.cashLocation && <p className="error">{errors.cashLocation}</p>}
//               </div>
//             </div>
//             <FormButtons 
//               onCancel={handleCancel} 
//               submitDisabled={!canCreateCashVoucher}
//               submitTooltip={!canCreateCashVoucher ? "You don't have permission to create cash vouchers" : ""}
//             />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CashVoucher;






import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBank, cilDollar, cilList, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import FormButtons from '../../utils/FormButtons';

// Import the new permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function CashVoucher() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    recipientName: '',
    voucherType: 'credit',
    expenseType: '',
    amount: '',
    remark: '',
    cashLocation: '',
    branch: ''
  });
  const [errors, setErrors] = useState({});
  const [cashLocations, setCashLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showPdfLoader, setShowPdfLoader] = useState(false);
  const navigate = useNavigate();
  
  const { permissions } = useAuth();
  
  const canViewCashVoucher = canViewPage(
    permissions, 
    MODULES.FUND_MANAGEMENT, 
    PAGES.FUND_MANAGEMENT.CASH_VOUCHER
  );
  
  const canCreateCashVoucher = canCreateInPage(
    permissions, 
    MODULES.FUND_MANAGEMENT, 
    PAGES.FUND_MANAGEMENT.CASH_VOUCHER
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  useEffect(() => {
    if (!canViewCashVoucher) {
      setLoading(false);
      return;
    }
    
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    const fetchCashLocations = async () => {
      try {
        const response = await axiosInstance.get('/cash-locations');
        setCashLocations(response.data.data.cashLocations || []);
      } catch (error) {
        console.error('Error fetching cash location:', error);
      }
    };

    const fetchExpense = async () => {
      try {
        const response = await axiosInstance.get('/expense-accounts');
        setExpenses(response.data.data.expenseAccounts || []);
      } catch (error) {
        console.error('Error fetching expense:', error);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBranches(),
        fetchCashLocations(),
        fetchExpense()
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [canViewCashVoucher]);

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
      link.download = `cash_voucher_${new Date().getTime()}.pdf`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canCreateCashVoucher) {
      showFormSubmitError('You do not have permission to create Cash Voucher');
      return;
    }
    
    let formErrors = {};

    if (!formData.recipientName) formErrors.recipientName = 'This field is required';
    if (!formData.expenseType) formErrors.expenseType = 'This field is required';
    if (!formData.amount) formErrors.amount = 'This field is required';
    if (!formData.cashLocation) formErrors.cashLocation = 'This field is required';
    if (!formData.branch) formErrors.branch = 'This field is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setSubmitting(true);
      
      // Submit the cash voucher
      const response = await axiosInstance.post('/cash-vouchers', formData);
      
      // Show success message
      await showFormSubmitToast('Cash Voucher added successfully! Generating PDF...');
      
      // Show PDF generation loader
      showPdfGenerationLoader();
      
      // Option 1: Try to get the PDF from the response if it contains receiptNo
      const receiptNo = response.data.data?.receiptNo || response.data.data?.receiptNumber;
      
      if (receiptNo) {
        // Try to get PDF using receipt number
        try {
          const pdfResponse = await axiosInstance.get(`/cash-vouchers/receipt/${receiptNo}`, {
            responseType: 'blob'
          });
          openPdfInNewTab(pdfResponse.data);
        } catch (pdfError) {
          console.error('Error fetching PDF with receiptNo:', pdfError);
          // Try alternative endpoint
          await tryAlternativePdfEndpoints(response.data.data);
        }
      } else {
        // Try to get PDF using voucher ID
        await tryAlternativePdfEndpoints(response.data.data);
      }
      
      // Reset form after successful submission
      setFormData({
        recipientName: '',
        voucherType: 'credit',
        expenseType: '',
        amount: '',
        remark: '',
        cashLocation: '',
        branch: ''
      });
      
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
      setGeneratingPdf(false);
      setShowPdfLoader(false);
    } finally {
      setSubmitting(false);
    }
  };

  const tryAlternativePdfEndpoints = async (data) => {
    const voucherId = data?._id || data?.id;
    const receiptNo = data?.receiptNo || data?.receiptNumber;
    
    if (!voucherId && !receiptNo) {
      showFormSubmitError('Voucher created but could not generate PDF. Please view it from the list.');
      setGeneratingPdf(false);
      setShowPdfLoader(false);
      return;
    }

    const endpoints = [
      `/cash-vouchers/receipt/${voucherId}`,
      `/vouchers/receipt/${voucherId}`,
      `/cash-vouchers/print/${voucherId}`,
      `/vouchers/print/${voucherId}`,
      `/receipts/cash-voucher/${voucherId}`,
    ];

    if (receiptNo) {
      endpoints.unshift(
        `/cash-vouchers/receipt/${receiptNo}`,
        `/vouchers/receipt/${receiptNo}`,
        `/receipts/${receiptNo}`
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
      showFormSubmitError('Voucher created but PDF generation failed. Please view it from the list.');
      setGeneratingPdf(false);
      setShowPdfLoader(false);
    }
  };

  const handleCancel = () => {
    navigate('/cash-receipt');
  };

  // Check if user has permission to view the page
  if (!canViewCashVoucher) {
    return (
      <div className="form-container">
        <div className="alert alert-danger m-3" role="alert">
          You do not have permission to view Cash Voucher.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="form-container">
        <div className="title">Cash Voucher</div>
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">Cash Voucher</div>
      
      {!canCreateCashVoucher && (
        <CAlert color="danger" className="mb-3">
          You have VIEW permission but not CREATE permission. You can see this page but cannot create new cash vouchers.
        </CAlert>
      )}
      
      {/* PDF Generation Loader Overlay */}
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
                    disabled={!canCreateCashVoucher || submitting || generatingPdf}
                    style={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                    disabled={!canCreateCashVoucher || submitting || generatingPdf}
                    style={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                  <span className="details">Expense Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="expenseType" 
                    value={formData.expenseType} 
                    onChange={handleChange}
                    disabled={!canCreateCashVoucher || submitting || generatingPdf}
                    style={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                  >
                    <option value="">-Select-</option>
                    {expenses.map((expense) => (
                      <option key={expense._id} value={expense.name}>
                        {expense.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.expenseType && <p className="error">{errors.expenseType}</p>}
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
                    disabled={!canCreateCashVoucher || submitting || generatingPdf}
                    style={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                    disabled={!canCreateCashVoucher || submitting || generatingPdf}
                    style={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                    disabled={!canCreateCashVoucher || submitting || generatingPdf}
                    style={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                  >
                    <option value="">-Select-</option>
                    {cashLocations.map((location) => (
                      <option key={location._id} value={location.name}>
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
              submitDisabled={!canCreateCashVoucher || submitting || generatingPdf}
              submitTooltip={
                !canCreateCashVoucher ? "You don't have permission to create cash vouchers" : 
                generatingPdf ? "PDF is being generated..." : ""
              }
              submitLabel={
                submitting ? "Creating..." : 
                generatingPdf ? "Generating PDF..." : 
                "Create"
              }
              cancelDisabled={submitting || generatingPdf}
              cancelStyle={submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
              submitStyle={!canCreateCashVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default CashVoucher;