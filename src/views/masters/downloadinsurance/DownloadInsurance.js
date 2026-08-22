import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance,
} from '../../../utils/tableImports';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  TABS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../../utils/modulePermissions';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormInput, 
  CFormLabel, 
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilTrash, 
  cilCheckCircle, 
  cilXCircle,
  cilCloudDownload
} from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const DownloadInsurance = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const baseURL = 'https://gmplmis.com/dealership-api';

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  const { permissions } = useAuth();
  
  // Page-level permission checks - Using INSURANCE module
  const hasInsuranceView = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW
  );
  
  // Tab-level permission check for Complete Insurance tab
  const canViewCompleteInsuranceTab = hasSafePagePermission(
    permissions, 
    MODULES.INSURANCE, 
    PAGES.INSURANCE.INSURANCE_DETAILS, 
    ACTIONS.VIEW,
    TABS.INSURANCE_DETAILS.COMPLETE_INSURANCE
  );

  useEffect(() => {
    if (!hasInsuranceView || !canViewCompleteInsuranceTab) {
      showError('You do not have permission to view Insurance Policies');
      return;
    }
    fetchData();
  }, [hasInsuranceView, canViewCompleteInsuranceTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/insurance-panel/completed');
      const insuranceData = response.data.data || [];
      setData(insuranceData);
      setFilteredData(insuranceData);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('insurance'));
  };

  // Fix date formatting - handle DD/MM/YYYY format from API
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Check if date is in DD/MM/YYYY format
    if (dateString.includes('/')) {
      const parts = dateString.split(' ');
      const dateParts = parts[0].split('/');
      if (dateParts.length === 3) {
        // Convert DD/MM/YYYY to Date object
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const year = parseInt(dateParts[2]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }
    
    // Try standard date parsing
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      return 'N/A';
    }
    
    return 'N/A';
  };

  // Handle download policy document using the download API
  const handleDownloadPolicy = async (bookingNumber) => {
    if (!bookingNumber) {
      showError('No booking number available');
      return;
    }
    
    setDownloadingId(bookingNumber);
    
    try {
      const response = await axiosInstance.get(`/insurance-panel/download/${bookingNumber}`, {
        responseType: 'blob' // Important for file download
      });
      
      // Create a blob URL from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `Policy_${bookingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      showSuccess('Policy downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showError(error.response?.data?.message || 'Failed to download policy document');
    } finally {
      setDownloadingId(null);
    }
  };

  // Get insurance company name (clean up the field)
  const getInsuranceCompany = (insuranceCompany) => {
    if (!insuranceCompany) return 'N/A';
    const cleaned = insuranceCompany.replace(/DOWNLOAD POLICY BUY ANOTHER POLICY GO TO MYACCOUNT\s*/i, '');
    return cleaned || 'N/A';
  };

  if (!hasInsuranceView || !canViewCompleteInsuranceTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Insurance Policies.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Insurance Policies</div>
      
      {/* ⚠️ IMPORTANT NOTE - Please verify policy details */}
      <div className="alert alert-warning mt-3 mb-3" role="alert" style={{ borderLeft: '4px solid #ffc107' }}>
        <strong>Important:</strong> Please verify the <strong>Model Name</strong>, <strong>Variant</strong>, and <strong>Chassis Number</strong> after downloading the policy document to ensure they match the vehicle details.
      </div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CBadge color="info" className="me-2">
              Total: {filteredData?.length || 0}
            </CBadge>
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by booking, chassis, customer..."
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking #</CTableHeaderCell>
                  <CTableHeaderCell>Chassis #</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Policy #</CTableHeaderCell>
                  <CTableHeaderCell>Premium (₹)</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Policy Period</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
                      No insurance policies available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((policy, index) => (
                    <CTableRow key={policy._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">
                          {policy.bookingNumber || 'N/A'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: '12px' }}>
                        {policy.chassisNumber || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>{policy.customerName || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{policy.customerMobile || 'N/A'}</CTableDataCell>
                      <CTableDataCell style={{ fontSize: '12px' }}>
                        {policy.modelName || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">
                          {policy.policyNumber || 'N/A'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>₹{policy.premiumPaid?.toLocaleString() || '0'}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={policy.insuranceStatus === 'COMPLETED' ? 'success' : 'warning'}>
                          {policy.insuranceStatus || 'PENDING'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: '11px' }}>
                        <div>
                          <span className="text-muted">From:</span> {formatDate(policy.policyStartDate)}
                        </div>
                        <div>
                          <span className="text-muted">To:</span> {formatDate(policy.policyEndDate)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="success"
                          onClick={() => handleDownloadPolicy(policy.bookingNumber)}
                          disabled={downloadingId === policy.bookingNumber}
                        >
                          {downloadingId === policy.bookingNumber ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilCloudDownload} className="me-1" />
                              Download
                            </>
                          )}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default DownloadInsurance;