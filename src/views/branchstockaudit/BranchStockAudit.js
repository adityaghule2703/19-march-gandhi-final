import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CBadge,
  CAlert,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CRow,
  CCol,
  CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCheckCircle,
  cilXCircle,
  cilSearch,
  cilZoomOut,
  cilMenu
} from '@coreui/icons';
import {
  Menu,
  MenuItem,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

const BranchStockAuditList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [branches, setBranches] = useState([]);
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tempSelectedBranch, setTempSelectedBranch] = useState(null);
  const [tempSelectedStatus, setTempSelectedStatus] = useState('all');
  const [isFiltered, setIsFiltered] = useState(false);

  // Verification modal states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [verificationAction, setVerificationAction] = useState('approve');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifying, setVerifying] = useState(false);

  // View details modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [auditDetails, setAuditDetails] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Permissions
  const { permissions, user: authUser } = useAuth();
  
  // Check if user has BRANCH role
  const isBranchUser = authUser?.roles?.some(role => role.name === 'BRANCH');
  
  // Get branch ID from user data if user is a branch user
  const userBranchId = authUser?.branch?._id;
  const userBranchName = authUser?.branch?.name;
  
  const canViewStockAuditList = canViewPage(permissions, MODULES.BRANCH_STOCK_AUDIT, PAGES.BRANCH_STOCK_AUDIT.LIST);
  const canApproveRejectAudit = canCreateInPage(permissions, MODULES.BRANCH_STOCK_AUDIT, PAGES.BRANCH_STOCK_AUDIT.LIST);
  const showActionColumn = canViewStockAuditList;

  useEffect(() => {
    if (!canViewStockAuditList) {
      showError('You do not have permission to view Branch Stock Audit List');
      return;
    }
    
    fetchData();
    fetchBranches();
  }, [canViewStockAuditList]);

  useEffect(() => {
    filterData();
  }, [selectedBranch, selectedStatus, data]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data?.branches || response.data?.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/branch-audits/audit');
      
      // Handle different response structures
      let audits = [];
      if (response.data?.data?.branchStockAudits) {
        audits = response.data.data.branchStockAudits;
      } else if (response.data?.data) {
        audits = Array.isArray(response.data.data) ? response.data.data : [];
      }
      
      // Filter by branch ID if user is a branch user
      if (isBranchUser && userBranchId) {
        audits = audits.filter(audit => 
          audit.branch?._id === userBranchId || 
          audit.branch === userBranchId
        );
        
        // Automatically set the filter to the branch's own ID
        setSelectedBranch(userBranchId);
      }
      
      setData(audits);
      setFilteredData(audits);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = data;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(audit => audit.status === selectedStatus);
    }

    // Filter by branch
    if (selectedBranch) {
      filtered = filtered.filter(audit => 
        audit.branch?._id === selectedBranch || 
        audit.branch === selectedBranch
      );
    }

    setFilteredData(filtered);
    
    // Check if any filter is active
    const hasActiveFilter = selectedStatus !== 'all' || selectedBranch !== null;
    setIsFiltered(hasActiveFilter);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    let dataToFilter = data;
    
    // Apply current filters first
    if (selectedStatus !== 'all') {
      dataToFilter = dataToFilter.filter(audit => audit.status === selectedStatus);
    }
    
    if (selectedBranch) {
      dataToFilter = dataToFilter.filter(audit => 
        audit.branch?._id === selectedBranch || 
        audit.branch === selectedBranch
      );
    }
    
    handleFilter(searchValue, [
      'auditNumber',
      'branch.name',
      'user.name',
      'remarks',
      'address',
      'chassisList.chassisNumber'
    ], dataToFilter);
  };

  const handleMenuClick = (event, audit) => {
    setAnchorEl(event.currentTarget);
    setMenuId(audit._id);
    setSelectedAudit(audit);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuId(null);
    setSelectedAudit(null);
  };

  const handleViewClick = (audit) => {
    setAuditDetails(audit);
    setActivePhotoIndex(0);
    setShowDetailsModal(true);
    handleCloseMenu();
  };

  const handleApproveClick = (audit) => {
    if (!canApproveRejectAudit) {
      showError('You do not have permission to approve/reject audits');
      return;
    }
    
    setSelectedAudit(audit);
    setVerificationAction('approve');
    setVerificationNotes('');
    setRejectionReason('');
    setShowVerificationModal(true);
    handleCloseMenu();
  };

  const handleRejectClick = (audit) => {
    if (!canApproveRejectAudit) {
      showError('You do not have permission to approve/reject audits');
      return;
    }
    
    setSelectedAudit(audit);
    setVerificationAction('reject');
    setVerificationNotes('');
    setRejectionReason('');
    setShowVerificationModal(true);
    handleCloseMenu();
  };

  const handleVerifyAudit = async () => {
    if (!selectedAudit || !canApproveRejectAudit) {
      showError('Permission denied or no audit selected');
      return;
    }

    setVerifying(true);
    try {
      const payload = {
        action: verificationAction,
        verificationNotes: verificationNotes,
        rejectionReason: verificationAction === 'reject' ? rejectionReason : ''
      };

      await axiosInstance.post(`/branch-audits/audit/${selectedAudit._id}/verify`, payload);
      
      // Update the audit status in the state
      const updatedAudits = data.map(audit => 
        audit._id === selectedAudit._id 
          ? { ...audit, status: verificationAction === 'approve' ? 'approved' : 'rejected' }
          : audit
      );
      
      setData(updatedAudits);
      setFilteredData(updatedAudits);
      
      showSuccess(`Audit ${verificationAction === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setSuccessMessage(`Audit ${verificationAction === 'approve' ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setShowVerificationModal(false);
      setSelectedAudit(null);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter modal handlers
  const handleFilterClick = () => {
    setTempSelectedBranch(selectedBranch);
    setTempSelectedStatus(selectedStatus);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setSelectedBranch(tempSelectedBranch);
    setSelectedStatus(tempSelectedStatus);
    setShowFilterModal(false);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setTempSelectedBranch(selectedBranch);
    setTempSelectedStatus(tempSelectedStatus);
  };

  const clearFilters = () => {
    setSelectedBranch(null);
    setSelectedStatus('all');
    setIsFiltered(false);
  };

  const getBranchNameById = (branchId) => {
    const branch = branches.find(b => b._id === branchId);
    return branch ? `${branch.name} - ${branch.city || 'N/A'}` : '';
  };

  const getFilterText = () => {
    let filterText = '';
    
    if (selectedStatus !== 'all') {
      filterText += `(Status: ${selectedStatus})`;
    }
    
    if (selectedBranch) {
      if (filterText) filterText += ' ';
      filterText += `(Branch: ${getBranchNameById(selectedBranch)})`;
    }
    
    return filterText;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      submitted: 'warning',
      approved: 'success',
      rejected: 'danger',
      pending: 'info'
    };
    
    const statusLabels = {
      submitted: 'Submitted',
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending'
    };
    
    return (
      <CBadge color={statusColors[status] || 'secondary'}>
        {statusLabels[status] || status}
      </CBadge>
    );
  };

  const getChassisVerificationBadge = (verificationStatus) => {
    const statusColors = {
      verified: 'success',
      manual_review_needed: 'warning',
      verification_failed: 'danger',
      pending: 'info'
    };
    
    const statusLabels = {
      verified: 'Verified',
      manual_review_needed: 'Manual Review',
      verification_failed: 'Failed',
      pending: 'Pending'
    };
    
    return (
      <CBadge color={statusColors[verificationStatus] || 'secondary'}>
        {statusLabels[verificationStatus] || verificationStatus}
      </CBadge>
    );
  };

  const extractChassisNumbers = (audit) => {
    if (audit?.chassisList && Array.isArray(audit.chassisList)) {
      return audit.chassisList.map(item => item.chassisNumber).join(', ');
    }
    return 'N/A';
  };

  const getExtractionSummary = (audit) => {
    if (audit?.extractionSummary) {
      return `${audit.extractionSummary.autoExtracted} auto / ${audit.extractionSummary.manualExtracted} manual`;
    }
    return 'N/A';
  };

  if (!canViewStockAuditList) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Branch Stock Audit List.
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
      <div className='title'>Branch Stock Audit List {getFilterText()}</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleFilterClick}
              disabled={!canViewStockAuditList}
            >
              <CIcon icon={cilSearch} className='icon' /> Filter
            </CButton>

            {isFiltered && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={clearFilters}
              >
                <CIcon icon={cilZoomOut} className='icon' /> 
                Reset Filter
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <span className="text-muted">
                Total: {filteredData.length} audit(s)
              </span>
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                placeholder="Search by audit number, branch, chassis..."
                disabled={!canViewStockAuditList}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Audit Number</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Audit Date</CTableHeaderCell>
                  <CTableHeaderCell>Submitted By</CTableHeaderCell>
                  <CTableHeaderCell>Total Vehicles</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Numbers</CTableHeaderCell>
                  <CTableHeaderCell>Extraction Summary</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Verification Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((audit, index) => (
                    <CTableRow key={audit?._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{audit?.auditNumber || 'N/A'}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit?.branch?.name || 'N/A'}
                        <div className="text-muted small">
                          {audit?.branch?.city || ''}, {audit?.branch?.state || ''}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(audit?.auditDate)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit?.user?.name || 'N/A'}
                        <div className="text-muted small">
                          {audit?.user?.email || ''}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="badge bg-info">
                          {audit?.totalVehicles || 0}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-truncate" style={{ maxWidth: '200px' }}>
                          {extractChassisNumbers(audit)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small">
                          {getExtractionSummary(audit)}
                          {audit?.extractionSummary?.needsManualCheck > 0 && (
                            <div className="text-warning">
                              {audit.extractionSummary.needsManualCheck} needs review
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-truncate" style={{ maxWidth: '150px' }}>
                          {audit?.remarks || '-'}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getStatusBadge(audit?.status)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getChassisVerificationBadge(audit?.chassisVerificationStatus)}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleMenuClick(event, audit)}
                          >
                            <CIcon icon={cilMenu} />
                            Options
                          </CButton>
                          
                          <Menu 
                            id={`action-menu-${audit?._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === audit?._id} 
                            onClose={handleCloseMenu}
                          >
                            <MenuItem 
                              onClick={() => handleViewClick(audit)}
                            >
                           
                              View Details
                            </MenuItem>
                            
                            {canApproveRejectAudit && (audit?.status === 'submitted' || audit?.status === 'pending') && (
                              <>
                                <MenuItem 
                                  onClick={() => handleApproveClick(audit)}
                                  style={{ color: 'green' }}
                                >
                                  <CIcon icon={cilCheckCircle} className="me-2" />
                                  Approve Audit
                                </MenuItem>
                                <MenuItem 
                                  onClick={() => handleRejectClick(audit)}
                                  style={{ color: 'red' }}
                                >
                                  <CIcon icon={cilXCircle} className="me-2" />
                                  Reject Audit
                                </MenuItem>
                              </>
                            )}
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "13" : "12"} className="text-center">
                      {data?.length === 0 
                        ? 'No stock audits available.'
                        : `No stock audits found for the selected filters. Try changing the filter or search term.`
                      }
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Filter Modal */}
      <CModal size='lg' visible={showFilterModal} onClose={handleCancelFilter}>
        <CModalHeader>
          <CModalTitle>Filter Stock Audits</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Select Status:</label>
              <CFormSelect
                value={tempSelectedStatus || 'all'}
                onChange={(e) => setTempSelectedStatus(e.target.value)}
                disabled={!canViewStockAuditList}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Select Branch:</label>
              {isBranchUser ? (
                <div>
                  <CFormInput
                    type="text"
                    value={`${userBranchName || 'Your Branch Account'}`}
                    readOnly
                    disabled
                    className="mb-2"
                  />
                  <div className="text-muted small">
                    Branch users can only view their own stock audits
                  </div>
                </div>
              ) : (
                <CFormSelect
                  value={tempSelectedBranch || ''}
                  onChange={(e) => setTempSelectedBranch(e.target.value || null)}
                  disabled={!canViewStockAuditList}
                >
                  <option value="">All Branches</option>
                  {branches
                    .filter(branch => branch.is_active !== false)
                    .map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name} - {branch.city || 'N/A'}, {branch.state || 'N/A'}
                      </option>
                    ))}
                </CFormSelect>
              )}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelFilter}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleApplyFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Verification Modal */}
      <CModal visible={showVerificationModal} onClose={() => !verifying && setShowVerificationModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {verificationAction === 'approve' ? 'Approve' : 'Reject'} Stock Audit
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <p>
              Audit Number: <strong>{selectedAudit?.auditNumber}</strong>
            </p>
            <p>
              Branch: <strong>{selectedAudit?.branch?.name}</strong>
            </p>
            <p>
              Total Vehicles: <strong>{selectedAudit?.totalVehicles}</strong>
            </p>
          </div>
          
          {verificationAction === 'approve' ? (
            <div className="mb-3">
              <label className="form-label">Verification Notes (Optional):</label>
              <CFormTextarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes about this approval..."
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">Rejection Reason *:</label>
              <CFormTextarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Please specify the reason for rejection..."
                required
              />
              {verificationAction === 'reject' && !rejectionReason.trim() && (
                <small className="text-danger">Rejection reason is required</small>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setShowVerificationModal(false)}
            disabled={verifying}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            onClick={handleVerifyAudit}
            disabled={
              verifying || 
              (verificationAction === 'reject' && !rejectionReason.trim())
            }
          >
            {verifying ? (
              <CSpinner size="sm" />
            ) : (
              verificationAction === 'approve' ? 'Approve Audit' : 'Reject Audit'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Details Modal */}
      <CModal size="xl" visible={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <CModalHeader>
          <CModalTitle>Audit Details - {auditDetails?.auditNumber}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {auditDetails && (
            <div>
              <CRow className="mb-4">
                <CCol md={6}>
                  <h6>Basic Information</h6>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <th>Branch:</th>
                        <td>{auditDetails?.branch?.name}</td>
                      </tr>
                      <tr>
                        <th>Audit Date:</th>
                        <td>{formatDate(auditDetails?.auditDate)}</td>
                      </tr>
                      <tr>
                        <th>Submitted By:</th>
                        <td>{auditDetails?.user?.name} ({auditDetails?.user?.email})</td>
                      </tr>
                      <tr>
                        <th>Address:</th>
                        <td>{auditDetails?.address}</td>
                      </tr>
                      <tr>
                        <th>Status:</th>
                        <td>{getStatusBadge(auditDetails?.status)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CCol>
                <CCol md={6}>
                  <h6>Audit Summary</h6>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <th>Total Vehicles:</th>
                        <td><span className="badge bg-info">{auditDetails?.totalVehicles}</span></td>
                      </tr>
                      <tr>
                        <th>Auto Extracted:</th>
                        <td>{auditDetails?.extractionSummary?.autoExtracted || 0}</td>
                      </tr>
                      <tr>
                        <th>Manual Extracted:</th>
                        <td>{auditDetails?.extractionSummary?.manualExtracted || 0}</td>
                      </tr>
                      <tr>
                        <th>Needs Manual Check:</th>
                        <td>{auditDetails?.extractionSummary?.needsManualCheck || 0}</td>
                      </tr>
                      <tr>
                        <th>Verification Status:</th>
                        <td>{getChassisVerificationBadge(auditDetails?.chassisVerificationStatus)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CCol>
              </CRow>

              <h6 className="mb-3">Remarks</h6>
              <div className="card p-3 mb-4">
                {auditDetails?.remarks || 'No remarks provided'}
              </div>

              <h6 className="mb-3">Chassis Numbers</h6>
              <div className="card p-3 mb-4">
                {auditDetails?.chassisList && auditDetails.chassisList.length > 0 ? (
                  <div className="row">
                    {auditDetails.chassisList.map((item, idx) => (
                      <div key={idx} className="col-md-6 mb-2">
                        <div className="d-flex align-items-center">
                          <span className="badge bg-light text-dark me-2">{idx + 1}</span>
                          <span className="font-monospace">{item.chassisNumber}</span>
                          {item.requiresManualCheck && (
                            <CBadge color="warning" className="ms-2">Needs Review</CBadge>
                          )}
                        </div>
                        <small className="text-muted">
                          Source: {item.source} | Confidence: {item.confidence}%
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted">No chassis numbers extracted</div>
                )}
              </div>

              <h6 className="mb-3">Vehicle Photos ({auditDetails?.vehiclesPhotos?.length || 0})</h6>
              {auditDetails?.vehiclesPhotos && auditDetails.vehiclesPhotos.length > 0 && (
                <div className="row">
                  <CCol md={8}>
                    <div className="card">
                      <div className="card-body text-center">
                        <img 
                          src={`https://gmplmis.com/dealership-api${auditDetails.vehiclesPhotos[activePhotoIndex]?.imageUrl}`} 
                          alt={`Vehicle ${activePhotoIndex + 1}`}
                          className="img-fluid"
                          style={{ maxHeight: '400px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <small className="text-muted">
                        Photo {activePhotoIndex + 1} of {auditDetails.vehiclesPhotos.length}
                      </small>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Photo Details</h6>
                      </div>
                      <div className="card-body">
                        <p><strong>Chassis:</strong> {auditDetails.vehiclesPhotos[activePhotoIndex]?.chassisNumber}</p>
                        <p><strong>Vehicle Model:</strong> {auditDetails.vehiclesPhotos[activePhotoIndex]?.vehicleModel}</p>
                        <p><strong>Color:</strong> {auditDetails.vehiclesPhotos[activePhotoIndex]?.vehicleColor}</p>
                        <p><strong>Remarks:</strong> {auditDetails.vehiclesPhotos[activePhotoIndex]?.remarks || '-'}</p>
                        <p><strong>Requires Review:</strong> 
                          {auditDetails.vehiclesPhotos[activePhotoIndex]?.requiresManualCheck ? (
                            <CBadge color="warning" className="ms-2">Yes</CBadge>
                          ) : (
                            <CBadge color="success" className="ms-2">No</CBadge>
                          )}
                        </p>
                      </div>
                    </div>
                  </CCol>
                </div>
              )}

              {auditDetails?.vehiclesPhotos && auditDetails.vehiclesPhotos.length > 1 && (
                <div className="mt-3">
                  <h6>All Photos</h6>
                  <div className="d-flex flex-wrap">
                    {auditDetails.vehiclesPhotos.map((photo, index) => (
                      <div 
                        key={index} 
                        className={`me-2 mb-2 cursor-pointer ${activePhotoIndex === index ? 'border border-primary' : ''}`}
                        onClick={() => setActivePhotoIndex(index)}
                        style={{ width: '100px', cursor: 'pointer' }}
                      >
                        <img 
                          src={`https://gmplmis.com/dealership-api${photo?.thumbnailUrl || photo?.imageUrl}`} 
                          alt={`Thumb ${index + 1}`}
                          className="img-thumbnail"
                          style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100x80?text=Thumb';
                          }}
                        />
                        <small className="d-block text-center">#{index + 1}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default BranchStockAuditList;