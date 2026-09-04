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
  CModalFooter,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilTrash, 
  cilCheckCircle, 
  cilXCircle,
  cilCloudDownload,
  cilChevronLeft,
  cilChevronRight
} from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

// Constants
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const SubdealerInsuranceDownload = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadingRsaId, setDownloadingRsaId] = useState(null);
  
  // Server-side pagination state
  const [insuranceData, setInsuranceData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCount, setFilteredCount] = useState(0);
  
  // User data state
  const [userData, setUserData] = useState(null);
  const [isSubdealer, setIsSubdealer] = useState(false);
  const [subdealerId, setSubdealerId] = useState('');
  const [subdealerName, setSubdealerName] = useState('');
  
  const baseURL = 'https://gmplmis.com/dealership-api';
  const { permissions, user } = useAuth();
  
  // ========== TAB-LEVEL VIEW PERMISSIONS FOR SUBDEALER BOOKING ==========
  const canViewApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canViewPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canViewAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== TAB-LEVEL CREATE PERMISSIONS ==========
  const canCreateInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canCreateInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canCreateInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
  const canUpdateInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canUpdateInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canUpdateInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== TAB-LEVEL DELETE PERMISSIONS ==========
  const canDeleteInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canDeleteInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canDeleteInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );

  // Check if user can view at least one tab
  const canViewAnyTab = canViewApprovedTab || canViewPendingAllocatedTab || canViewAllocatedTab;

const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    if (response.data && response.data.data) {
      const userData = response.data.data;
      setUserData(userData);

      const hasSubdealerRole = userData.roles && userData.roles.some(role => role.name === 'SUBDEALER');
      setIsSubdealer(hasSubdealerRole);

      let sId = '';
      let sName = '';
      if (hasSubdealerRole && userData.subdealer) {
        sId = userData.subdealer._id || userData.subdealer.id || '';
        sName = userData.subdealer.name || '';
        setSubdealerId(sId);
        setSubdealerName(sName);
      } else {
        setSubdealerId('');
        setSubdealerName('');
      }

      // Return the fresh values directly — state (isSubdealer/subdealerId) won't
      // be updated yet on this render pass, so callers should use this return
      // value instead of reading state right after calling fetchUserData().
      return { userData, isSubdealer: hasSubdealerRole, subdealerId: sId, subdealerName: sName };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    showError('Failed to fetch user information');
    return null;
  }
};

  useEffect(() => {
  const initialize = async () => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view Subdealer Insurance Policies');
      setLoading(false);
      return;
    }

    const userInfo = await fetchUserData();

    // Pass the fresh values straight through instead of relying on
    // isSubdealer/subdealerId state, which hasn't re-rendered yet here.
    fetchData(
      1,
      limit,
      '',
      userInfo ? { isSubdealer: userInfo.isSubdealer, subdealerId: userInfo.subdealerId } : null
    );
  };

  initialize();
}, [canViewAnyTab]);

  // Fetch data with server-side pagination and search - Filter by SUBDEALER bookingType
  const fetchData = async (page = 1, pageLimit = DEFAULT_LIMIT, search = '', subdealerOverride = null) => {
  if (!canViewAnyTab) {
    showError('You do not have permission to view Subdealer Insurance Policies');
    return;
  }

  try {
    setLoading(true);

    const params = {
      page,
      limit: pageLimit,
      bookingType: 'SUBDEALER'
    };

    // Prefer the override (fresh values, e.g. right after fetchUserData resolves)
    // over state, since state can be stale at that point.
    const effectiveIsSubdealer = subdealerOverride ? subdealerOverride.isSubdealer : isSubdealer;
    const effectiveSubdealerId = subdealerOverride ? subdealerOverride.subdealerId : subdealerId;

    if (effectiveIsSubdealer && effectiveSubdealerId) {
      params.subdealer = effectiveSubdealerId;
      console.log('Adding subdealer filter with ID:', effectiveSubdealerId);
    }

    if (search) params.search = search;

    console.log('Final params being sent:', params);
    console.log('Full URL:', `/insurance-panel/completed?${new URLSearchParams(params).toString()}`);

    const response = await axiosInstance.get('/insurance-panel/completed', { params });
      
      console.log('API Response:', response.data);
      
      let docs = [];
      let totalCount = 0;
      let totalPages = 1;
      
      if (response.data) {
        docs = response.data.data || [];
        totalCount = response.data.total || response.data.totalCount || docs.length;
        totalPages = response.data.pages || response.data.totalPages || Math.ceil(totalCount / pageLimit);
        
        // Handle different response structures
        if (response.data.pagination) {
          totalCount = response.data.pagination.total || docs.length;
          totalPages = response.data.pagination.totalPages || 1;
        }
      }
      
      setInsuranceData(docs);
      setTotal(totalCount);
      setPages(totalPages);
      setCurrentPage(page);
      setLimit(pageLimit);
      setSearchQuery(search);
      setFilteredCount(totalCount);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setInsuranceData([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    if (!canViewAnyTab) {
      showError('You do not have permission to search Subdealer Insurance Policies');
      return;
    }
    
    setSearchTerm(value);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchData(1, limit, value);
    }, 400);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (!canViewAnyTab) return;
    if (newPage < 1 || newPage > pages) return;
    fetchData(newPage, limit, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    if (!canViewAnyTab) return;
    const newLimitValue = parseInt(newLimit, 10);
    fetchData(1, newLimitValue, searchQuery);
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

  // Handle download Harita policy document
  const handleDownloadPolicy = async (bookingNumber) => {
    if (!canViewAnyTab) {
      showError('You do not have permission to download Harita Policy');
      return;
    }
    
    if (!bookingNumber) {
      showError('No booking number available');
      return;
    }
    
    setDownloadingId(bookingNumber);
    
    try {
      const response = await axiosInstance.get(`/insurance-panel/download/${bookingNumber}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Harita_Policy_${bookingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      showSuccess('Harita Policy downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showError(error.response?.data?.message || 'Failed to download Harita policy document');
    } finally {
      setDownloadingId(null);
    }
  };

  // Handle download RSA policy document
  const handleDownloadRsa = async (bookingNumber) => {
    if (!canViewAnyTab) {
      showError('You do not have permission to download RSA Policy');
      return;
    }
    
    if (!bookingNumber) {
      showError('No booking number available');
      return;
    }
    
    setDownloadingRsaId(bookingNumber);
    
    try {
      const response = await axiosInstance.get(`/insurance-panel/download-rsa/${bookingNumber}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `RSA_Policy_${bookingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      showSuccess('RSA Policy downloaded successfully!');
    } catch (error) {
      console.error('RSA Download error:', error);
      showError(error.response?.data?.message || 'Failed to download RSA policy document');
    } finally {
      setDownloadingRsaId(null);
    }
  };

  // Get insurance company name (clean up the field)
  const getInsuranceCompany = (insuranceCompany) => {
    if (!insuranceCompany) return 'N/A';
    const cleaned = insuranceCompany.replace(/DOWNLOAD POLICY BUY ANOTHER POLICY GO TO MYACCOUNT\s*/i, '');
    return cleaned || 'N/A';
  };

  // Render pagination
  const renderPagination = () => {
    if (!total || pages <= 1) return null;
    
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(5, pages);
    if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);
    
    const pageNums = [];
    for (let i = startPage; i <= endPage; i++) pageNums.push(i);
    
    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            
            {pageNums.map(p => (
              <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}
            
            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}
            
            <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer Insurance Policies.
      </div>
    );
  }

  if (loading && !insuranceData.length) {
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
      <div className='title'>Subdealer Insurance Policies</div>
      
     
      
      {/* ⚠️ IMPORTANT NOTE - Please verify policy details */}
      <div className="alert alert-warning mt-3 mb-3" role="alert" style={{ borderLeft: '4px solid #ffc107' }}>
        <strong>Important:</strong> Please verify the <strong>Model Name</strong>, <strong>Variant</strong>, and <strong>Chassis Number</strong> after downloading the policy document to ensure they match the vehicle details.
      </div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CBadge color="info" className="me-2">
              Total: {total || 0}
            </CBadge>
            {searchQuery && (
              <CBadge color="secondary" className="me-2">
                Filtered: {filteredCount}
              </CBadge>
            )}
            <CBadge color="primary" className="me-2">
              Type: Subdealer
            </CBadge>
            {isSubdealer && subdealerName && (
              <CBadge color="success" className="me-2">
                {subdealerName}
              </CBadge>
            )}
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
          
          {loading && insuranceData.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: loading && insuranceData.length > 0 ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking #</CTableHeaderCell>
                  <CTableHeaderCell>Subdealer Name</CTableHeaderCell>
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
                {insuranceData.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="12" className="text-center">
                      {searchQuery ? `No results found for "${searchQuery}"` : 
                       isSubdealer ? `No insurance policies found for ${subdealerName}` : 
                       'No subdealer insurance policies available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  insuranceData.map((policy, index) => {
                    const startRecord = (currentPage - 1) * limit + 1;
                    return (
                      <CTableRow key={policy._id || index}>
                        <CTableDataCell>{startRecord + index}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="primary">
                            {policy.bookingNumber || 'N/A'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {policy.subdealerName || 'N/A'}
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
                          <div className="d-flex gap-1 flex-wrap">
                            <CButton
                              size="sm"
                              color="success"
                              onClick={() => handleDownloadPolicy(policy.bookingNumber)}
                              disabled={downloadingId === policy.bookingNumber}
                              className="mb-1"
                            >
                              {downloadingId === policy.bookingNumber ? (
                                <>
                                  <CSpinner size="sm" className="me-1" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <CIcon icon={cilCloudDownload} className="me-1" />
                                  Harita
                                </>
                              )}
                            </CButton>
                            
                            {/* RSA button only visible when status is COMPLETED */}
                            {policy.insuranceStatus === 'COMPLETED' && (
                              <CButton
                                size="sm"
                                color="info"
                                onClick={() => handleDownloadRsa(policy.bookingNumber)}
                                disabled={downloadingRsaId === policy.bookingNumber}
                                className="mb-1"
                              >
                                {downloadingRsaId === policy.bookingNumber ? (
                                  <>
                                    <CSpinner size="sm" className="me-1" />
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <CIcon icon={cilCloudDownload} className="me-1" />
                                    RSA
                                  </>
                                )}
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default SubdealerInsuranceDownload;