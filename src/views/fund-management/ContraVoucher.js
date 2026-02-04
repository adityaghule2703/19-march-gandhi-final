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

function ContraVoucher() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    recipientName: '',
    voucherType: 'credit',
    contraType: '',
    amount: '',
    remark: '',
    bankLocation: '',
    branch: ''
  });
  const [errors, setErrors] = useState({});
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showPdfLoader, setShowPdfLoader] = useState(false);
  const navigate = useNavigate();
  
  const { permissions } = useAuth();
  
  const canViewContraVoucher = canViewPage(
    permissions, 
    MODULES.FUND_MANAGEMENT, 
    PAGES.FUND_MANAGEMENT.CONTRA_VOUCHER
  );
  
  const canCreateContraVoucher = canCreateInPage(
    permissions, 
    MODULES.FUND_MANAGEMENT, 
    PAGES.FUND_MANAGEMENT.CONTRA_VOUCHER
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };
  
  useEffect(() => {
    if (!canViewContraVoucher) {
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

    const fetchBanks = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        setBanks(response.data.data.banks || []);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBranches(),
        fetchBanks()
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [canViewContraVoucher]);

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
      link.download = `contra_voucher_${new Date().getTime()}.pdf`;
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
    
    if (!canCreateContraVoucher) {
      showFormSubmitError('You do not have permission to create Contra Voucher');
      return;
    }
    
    let formErrors = {};

    if (!formData.recipientName) formErrors.recipientName = 'This field is required';
    if (!formData.contraType) formErrors.contraType = 'This field is required';
    if (!formData.amount) formErrors.amount = 'This field is required';
    if (!formData.branch) formErrors.branch = 'This field is required';
    if (formData.contraType === 'cash_at_bank' && !formData.bankLocation) {
      formErrors.bankLocation = 'This field is required';
    }
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setSubmitting(true);
      
      // Submit the contra voucher
      const response = await axiosInstance.post('/contra-vouchers', formData);
      
      // Show success message
      await showFormSubmitToast('Contra Voucher added successfully! Generating PDF...');
      
      // Show PDF generation loader
      showPdfGenerationLoader();
      
      // Try to get the PDF from the response
      const voucherId = response.data.data?._id || response.data.data?.id;
      const receiptNo = response.data.data?.receiptNo || response.data.data?.receiptNumber;
      
      if (receiptNo) {
        // Try to get PDF using receipt number
        try {
          const pdfResponse = await axiosInstance.get(`/contra-vouchers/receipt/${receiptNo}`, {
            responseType: 'blob'
          });
          openPdfInNewTab(pdfResponse.data);
        } catch (pdfError) {
          console.error('Error fetching PDF with receiptNo:', pdfError);
          // Try alternative endpoint
          await tryAlternativePdfEndpoints(voucherId, receiptNo);
        }
      } else if (voucherId) {
        // Try alternative endpoint with voucher ID
        await tryAlternativePdfEndpoints(voucherId, receiptNo);
      } else {
        showFormSubmitError('Voucher created but could not generate PDF. Please view it from the list.');
        setGeneratingPdf(false);
        setShowPdfLoader(false);
      }
      
      // Reset form after successful submission
      setFormData({
        recipientName: '',
        voucherType: 'credit',
        contraType: '',
        amount: '',
        remark: '',
        bankLocation: '',
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

  const tryAlternativePdfEndpoints = async (voucherId, receiptNo) => {
    if (!voucherId && !receiptNo) {
      showFormSubmitError('Voucher created but could not generate PDF. Please view it from the list.');
      setGeneratingPdf(false);
      setShowPdfLoader(false);
      return;
    }

    const endpoints = [
      `/contra-vouchers/receipt/${voucherId}`,
      `/vouchers/receipt/${voucherId}`,
      `/contra-vouchers/print/${voucherId}`,
      `/vouchers/print/${voucherId}`,
      `/receipts/contra-voucher/${voucherId}`,
    ];

    if (receiptNo) {
      endpoints.unshift(
        `/contra-vouchers/receipt/${receiptNo}`,
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
    navigate('/contra-approval');
  };

  // Check if user has permission to view the page
  if (!canViewContraVoucher) {
    return (
      <div className="form-container">
        <div className="alert alert-danger m-3" role="alert">
          You do not have permission to view Contra Voucher.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="form-container">
        <div className="title">Contra Voucher</div>
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
      <div className="title">Contra Voucher</div>
      
      {!canCreateContraVoucher && (
        <CAlert color="danger" className="mb-3">
          You have VIEW permission but not CREATE permission. You can see this page but cannot create new contra vouchers.
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
                    disabled={!canCreateContraVoucher || submitting || generatingPdf}
                    style={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                  />
                </CInputGroup>
                {errors.recipientName && <p className="error">{errors.recipientName}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">From</span>
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
                    disabled={!canCreateContraVoucher || submitting || generatingPdf}
                    style={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                  <span className="details">To</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    type="text" 
                    name="contraType" 
                    value={formData.contraType} 
                    onChange={handleChange}
                    disabled={!canCreateContraVoucher || submitting || generatingPdf}
                    style={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                  >
                    <option value="">-Select</option>
                    <option value="cash_at_bank">Cash At Bank</option>
                    <option value="cash_at_home">Cash At Home</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.contraType && <p className="error">{errors.contraType}</p>}
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
                    disabled={!canCreateContraVoucher || submitting || generatingPdf}
                    style={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
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
                    disabled={!canCreateContraVoucher || submitting || generatingPdf}
                    style={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                  />
                </CInputGroup>
              </div>
              {formData.contraType === 'cash_at_bank' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Bank Location</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBank} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="bankLocation" 
                      value={formData.bankLocation} 
                      onChange={handleChange}
                      disabled={!canCreateContraVoucher || submitting || generatingPdf}
                      style={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
                    >
                      <option value="">-Select-</option>
                      {banks.map((bank) => (
                        <option key={bank._id} value={bank.name}>
                          {bank.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.bankLocation && <p className="error">{errors.bankLocation}</p>}
                </div>
              )}
            </div>
            <FormButtons 
              onCancel={handleCancel} 
              submitDisabled={!canCreateContraVoucher || submitting || generatingPdf}
              submitTooltip={
                !canCreateContraVoucher ? "You don't have permission to create contra vouchers" : 
                generatingPdf ? "PDF is being generated..." : ""
              }
              submitLabel={
                submitting ? "Creating..." : 
                generatingPdf ? "Generating PDF..." : 
                "Create"
              }
              cancelDisabled={submitting || generatingPdf}
              cancelStyle={submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
              submitStyle={!canCreateContraVoucher || submitting || generatingPdf ? { cursor: 'not-allowed', opacity: 0.7 } : {}}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContraVoucher;