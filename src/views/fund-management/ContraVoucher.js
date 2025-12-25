import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBank, cilDollar, cilList, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import FormButtons from '../../utils/FormButtons';

// Import the new permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function ContraVoucher() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBranch = !!storedUser.branch?._id;
  const [formData, setFormData] = useState({
    recipientName: '',
    voucherType: 'credit',
    contraType: '',
    amount: '',
    remark: '',
    bankLocation: '',
    branch: hasBranch ? storedUser.branch?._id : ''
  });
  const [errors, setErrors] = useState({});
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { permissions } = useAuth();
  
  // Page-level permission checks for Contra Voucher page under Fund Management module
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
      await axiosInstance.post('/contra-vouchers', formData);
      await showFormSubmitToast('Contra Voucher added successfully!', () => navigate('/contra-approval'));

      navigate('/contra-approval');
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
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
                    disabled={!canCreateContraVoucher}
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
                    disabled={!canCreateContraVoucher || hasBranch}
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
                    disabled={!canCreateContraVoucher}
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
                    disabled={!canCreateContraVoucher}
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
                    disabled={!canCreateContraVoucher}
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
                      disabled={!canCreateContraVoucher}
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
              submitDisabled={!canCreateContraVoucher}
              submitTooltip={!canCreateContraVoucher ? "You don't have permission to create contra vouchers" : ""}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContraVoucher;