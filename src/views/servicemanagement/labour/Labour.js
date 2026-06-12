import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  axiosInstance,
  showError,
  showSuccess,
  confirmDelete,
  Menu,
  MenuItem
} from '../../../utils/tableImports';
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
  CPagination,
  CPaginationItem,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormCheck,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilList,
  cilMoney,
  cilClock,
  cilTag,
  cilCheckCircle,
  cilXCircle,
  cilBuilding
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Category options based on enum
const CATEGORY_OPTIONS = [
  { value: 'Service', label: 'Service' },
  { value: 'Repair', label: 'Repair' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Diagnostic', label: 'Diagnostic' },
  { value: 'Other', label: 'Other' }
];

const Labour = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Branch state
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [userRoles, setUserRoles] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Data state
  const [labourItems, setLabourItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);
  const searchInputRef = useRef(null);
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form state - Updated to match new schema
  const [formData, setFormData] = useState({
    branchId: '',
    labourCode: '',
    description: '',
    charges: '',
    category: 'Service',
    estimatedHours: '',
    taxApplicable: true,
    gstRate: '',
    isActive: true
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch labour items when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchLabourItems();
    }
  }, [selectedBranchId, pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchLabourItems(1, pagination.limit, searchTerm);
      }
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      if (response.data.success) {
        setBranches(response.data.data || []);
        setUserRoles(response.data.userRoles || []);
        setIsSuperAdmin(response.data.isSuperAdmin || false);
        
        // Set selected branch
        if (response.data.isSuperAdmin) {
          // For super admin, no branch pre-selected
          setSelectedBranchId('');
        } else if (response.data.userBranch && response.data.userBranch._id) {
          // For non-super admin, set their branch
          setSelectedBranchId(response.data.userBranch._id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError('Failed to fetch branches');
    }
  };

  const fetchLabourItems = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    if (!selectedBranchId) {
      setLabourItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      params.append('branchId', selectedBranchId);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/labour?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setLabourItems(response.data.data || []);
        setPagination({
          page: response.data.currentPage || page,
          limit: limit,
          totalCount: response.data.total || response.data.data.length,
          totalPages: response.data.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching labour items:', error);
      setError(error.response?.data?.message || 'Failed to fetch labour items');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit, 10),
      page: 1
    }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleAddClick = () => {
    resetForm();
    setAddModalVisible(true);
  };

  const handleEditClick = (labour) => {
    setSelectedLabour(labour);
    setFormData({
      branchId: labour.branchId || '',
      labourCode: labour.labourCode || '',
      description: labour.description || '',
      charges: labour.charges || '',
      category: labour.category || 'Service',
      estimatedHours: labour.estimatedHours || '',
      taxApplicable: labour.taxApplicable !== undefined ? labour.taxApplicable : true,
      gstRate: labour.gstRate || '',
      isActive: labour.isActive !== undefined ? labour.isActive : true
    });
    setEditModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (labour) => {
    setSelectedLabour(labour);
    setDeleteModalVisible(true);
    handleClose();
  };

  const resetForm = () => {
    // For super admin, default to empty branch selection
    // For non-super admin, use their branch
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setFormData({
      branchId: defaultBranchId,
      labourCode: '',
      description: '',
      charges: '',
      category: 'Service',
      estimatedHours: '',
      taxApplicable: true,
      gstRate: '',
      isActive: true
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.branchId && isSuperAdmin) errors.branchId = 'Branch is required';
    if (!formData.labourCode) errors.labourCode = 'Labour code is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.charges) errors.charges = 'Charges are required';
    if (formData.charges && parseFloat(formData.charges) < 0) errors.charges = 'Charges cannot be negative';
    if (!formData.category) errors.category = 'Category is required';
    if (formData.estimatedHours && parseFloat(formData.estimatedHours) < 0) errors.estimatedHours = 'Estimated hours cannot be negative';
    if (formData.taxApplicable && !formData.gstRate) errors.gstRate = 'GST rate is required when tax is applicable';
    if (formData.gstRate && (formData.gstRate < 0 || formData.gstRate > 100)) errors.gstRate = 'GST rate must be between 0 and 100';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    
    setFormLoading(true);
    try {
      const payload = {
        branchId: formData.branchId,
        labourCode: formData.labourCode,
        description: formData.description,
        charges: parseFloat(formData.charges),
        category: formData.category,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        taxApplicable: formData.taxApplicable,
        gstRate: formData.taxApplicable ? parseFloat(formData.gstRate) : 0,
        isActive: formData.isActive
      };
      
      const response = await axiosInstance.post('/labour', payload);
      if (response.data.success) {
        showSuccess('Labour item added successfully!');
        setAddModalVisible(false);
        resetForm();
        
        // If the added labour belongs to the currently selected branch, refresh the list
        if (formData.branchId === selectedBranchId) {
          fetchLabourItems(1, pagination.limit, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error adding labour item:', error);
      showError(error.response?.data?.message || 'Failed to add labour item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedLabour) return;
    
    setFormLoading(true);
    try {
      const payload = {
        branchId: formData.branchId,
        labourCode: formData.labourCode,
        description: formData.description,
        charges: parseFloat(formData.charges),
        category: formData.category,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        taxApplicable: formData.taxApplicable,
        gstRate: formData.taxApplicable ? parseFloat(formData.gstRate) : 0,
        isActive: formData.isActive
      };
      
      const response = await axiosInstance.put(`/labour/${selectedLabour._id}`, payload);
      if (response.data.success) {
        showSuccess('Labour item updated successfully!');
        setEditModalVisible(false);
        resetForm();
        
        // If the updated labour belongs to the currently selected branch, refresh the list
        if (formData.branchId === selectedBranchId) {
          fetchLabourItems(pagination.page, pagination.limit, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error updating labour item:', error);
      showError(error.response?.data?.message || 'Failed to update labour item');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLabour) return;
    
    try {
      const response = await axiosInstance.delete(`/labour/${selectedLabour._id}`);
      if (response.data.success) {
        showSuccess('Labour item deleted successfully!');
        setDeleteModalVisible(false);
        setSelectedLabour(null);
        fetchLabourItems(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error deleting labour item:', error);
      showError(error.response?.data?.message || 'Failed to delete labour item');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Service': return 'primary';
      case 'Repair': return 'warning';
      case 'Maintenance': return 'info';
      case 'Diagnostic': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <CBadge color="success"><CIcon icon={cilCheckCircle} className="me-1" />Active</CBadge>;
    } else {
      return <CBadge color="danger"><CIcon icon={cilXCircle} className="me-1" />Inactive</CBadge>;
    }
  };

  // Pagination calculation
  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);
  
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  if (pagination.page <= 3) endPage = Math.min(5, pagination.totalPages);
  if (pagination.page >= pagination.totalPages - 2) startPage = Math.max(1, pagination.totalPages - 4);
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

  // Render pagination component
  const renderPagination = () => {
    if (!pagination.totalCount || pagination.totalPages <= 1) return null;

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={pagination.limit}
              onChange={e => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} entries`}
          </span>
        </div>
        {pagination.totalPages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={pagination.page === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {displayedPages.map(p => (
              <CPaginationItem key={p} active={p === pagination.page} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}

            {endPage < pagination.totalPages && (
              <>
                {endPage < pagination.totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={loading}>{pagination.totalPages}</CPaginationItem>
              </>
            )}

            <CPaginationItem onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  if (error && labourItems.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Labour Management</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
              <CIcon icon={cilPlus} className='icon' /> Add Labour
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Branch Selection - Only show for Super Admin */}
          {isSuperAdmin && (
            <div className="mb-3">
              <CFormLabel className="fw-bold">Select Branch <span className="required">*</span></CFormLabel>
              <CFormSelect
                value={selectedBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                style={{ maxWidth: '400px' }}
              >
                <option value="">-- Select Branch --</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </CFormSelect>
              {!selectedBranchId && (
                <small className="text-danger d-block mt-1">Please select a branch to view labour items</small>
              )}
            </div>
          )}

          {/* Branch Info for non-super admin */}
          {!isSuperAdmin && branches.length > 0 && (
            <div className="mb-3">
              <CAlert color="info" className="mb-0">
                <CIcon icon={cilBuilding} className="me-2" />
                <strong>Branch:</strong> {branches[0]?.name} - {branches[0]?.city}
              </CAlert>
            </div>
          )}

          {/* Search Bar - Only show when branch is selected */}
          {selectedBranchId && (
            <div className="d-flex justify-content-between mb-3">
              <div></div>
              <div className='d-flex'>
                <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                <input
                  ref={searchInputRef}
                  type="text"
                  defaultValue=""
                  style={{
                    maxWidth: '350px',
                    height: '30px',
                    borderRadius: '0',
                    border: '1px solid #ced4da',
                    padding: '0 8px',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                  className="d-inline-block square-search"
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by labour code, description..."
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && selectedBranchId && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          {/* No Branch Selected Message */}
          {!selectedBranchId && isSuperAdmin && (
            <div className="text-center py-5">
              <CIcon icon={cilBuilding} style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5 className="text-muted">Please select a branch to view labour items</h5>
              <p className="text-muted">Select a branch from the dropdown above to manage labour items for that branch</p>
            </div>
          )}

          {/* Labour Table */}
          {selectedBranchId && (
            <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Labour Code</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Charges</CTableHeaderCell>
                    <CTableHeaderCell>Est. Hours</CTableHeaderCell>
                    <CTableHeaderCell>GST Rate</CTableHeaderCell>
                    <CTableHeaderCell>Tax Applicable</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {labourItems.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={11} style={{ color: 'red', textAlign: 'center' }}>
                        {searchTerm ? `No results found for "${searchTerm}"` : 'No labour items found for this branch.'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    labourItems.map((labour, index) => {
                      const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                      return (
                        <CTableRow key={labour._id}>
                          <CTableDataCell>{globalIndex}</CTableDataCell>
                          <CTableDataCell><strong>{labour.labourCode}</strong></CTableDataCell>
                          <CTableDataCell>{labour.description}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getCategoryBadgeColor(labour.category)}>
                              {labour.category}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{formatCurrency(labour.charges)}</CTableDataCell>
                          <CTableDataCell>{labour.estimatedHours ? `${labour.estimatedHours} hrs` : '-'}</CTableDataCell>
                          <CTableDataCell>{labour.gstRate ? `${labour.gstRate}%` : '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={labour.taxApplicable ? 'info' : 'secondary'}>
                              {labour.taxApplicable ? 'Yes' : 'No'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{getStatusBadge(labour.isActive)}</CTableDataCell>
                          <CTableDataCell>{formatDate(labour.createdAt)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, labour._id)}
                            >
                              <CIcon icon={cilOptions} /> Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${labour._id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === labour._id} 
                              onClose={handleClose}
                            >
                              <MenuItem onClick={() => handleEditClick(labour)}>
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteClick(labour)}>
                                <CIcon icon={cilTrash} className="me-2" /> Delete
                              </MenuItem>
                            </Menu>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}

          {/* Pagination */}
          {selectedBranchId && renderPagination()}
        </CCardBody>
      </CCard>

      {/* Add Labour Modal */}
      <CModal size="lg" visible={addModalVisible} onClose={() => setAddModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Add New Labour
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {formErrors.general && <CAlert color="danger">{formErrors.general}</CAlert>}
          
          {/* Branch Selection in Add Form - Only show for Super Admin */}
          {isSuperAdmin && (
            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Branch <span className="required">*</span></label>
                <CFormSelect
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                >
                  <option value="">-- Select Branch --</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name} - {branch.city}
                    </option>
                  ))}
                </CFormSelect>
                {formErrors.branchId && <small className="text-danger">{formErrors.branchId}</small>}
              </CCol>
            </CRow>
          )}

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Labour Code <span className="required">*</span></label>
              <CFormInput
                value={formData.labourCode}
                onChange={(e) => setFormData({ ...formData, labourCode: e.target.value.toUpperCase() })}
                placeholder="Enter labour code"
              />
              {formErrors.labourCode && <small className="text-danger">{formErrors.labourCode}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Category <span className="required">*</span></label>
              <CFormSelect
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.category && <small className="text-danger">{formErrors.category}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Description <span className="required">*</span></label>
              <CFormInput
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
              {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Charges (₹) <span className="required">*</span></label>
              <CFormInput
                type="number"
                step="1"
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                placeholder="Enter charges"
              />
              {formErrors.charges && <small className="text-danger">{formErrors.charges}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Estimated Hours</label>
              <CFormInput
                type="number"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="Enter estimated hours"
              />
              {formErrors.estimatedHours && <small className="text-danger">{formErrors.estimatedHours}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Tax Applicable</label>
              <div>
                <CFormCheck
                  inline
                  label="Yes"
                  type="radio"
                  name="taxApplicable"
                  checked={formData.taxApplicable === true}
                  onChange={() => {
                    setFormData({ ...formData, taxApplicable: true });
                    setFormErrors({ ...formErrors, gstRate: null });
                  }}
                />
                <CFormCheck
                  inline
                  label="No"
                  type="radio"
                  name="taxApplicable"
                  checked={formData.taxApplicable === false}
                  onChange={() => {
                    setFormData({ ...formData, taxApplicable: false, gstRate: '' });
                    setFormErrors({ ...formErrors, gstRate: null });
                  }}
                />
              </div>
            </CCol>
            {formData.taxApplicable && (
              <CCol md={6}>
                <label className="form-label">GST Rate (%) <span className="required">*</span></label>
                <CFormInput
                  type="number"
                  step="0.01"
                  value={formData.gstRate}
                  onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                  placeholder="Enter GST rate (e.g., 18)"
                />
                {formErrors.gstRate && <small className="text-danger">{formErrors.gstRate}</small>}
              </CCol>
            )}
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Status</label>
              <div>
                <CFormCheck
                  inline
                  label="Active"
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === true}
                  onChange={() => setFormData({ ...formData, isActive: true })}
                />
                <CFormCheck
                  inline
                  label="Inactive"
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === false}
                  onChange={() => setFormData({ ...formData, isActive: false })}
                />
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddSubmit} disabled={formLoading}>
            {formLoading ? <><CSpinner size="sm" className="me-2" />Adding...</> : 'Add Labour'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Labour Modal */}
      <CModal size="lg" visible={editModalVisible} onClose={() => setEditModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPencil} className="me-2" />
            Edit Labour
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {formErrors.general && <CAlert color="danger">{formErrors.general}</CAlert>}
          
          {/* Branch Selection in Edit Form - Only show for Super Admin */}
          {isSuperAdmin && (
            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Branch <span className="required">*</span></label>
                <CFormSelect
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                >
                  <option value="">-- Select Branch --</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name} - {branch.city}
                    </option>
                  ))}
                </CFormSelect>
                {formErrors.branchId && <small className="text-danger">{formErrors.branchId}</small>}
              </CCol>
            </CRow>
          )}

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Labour Code <span className="required">*</span></label>
              <CFormInput
                value={formData.labourCode}
                onChange={(e) => setFormData({ ...formData, labourCode: e.target.value.toUpperCase() })}
                placeholder="Enter labour code"
              />
              {formErrors.labourCode && <small className="text-danger">{formErrors.labourCode}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Category <span className="required">*</span></label>
              <CFormSelect
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.category && <small className="text-danger">{formErrors.category}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Description <span className="required">*</span></label>
              <CFormInput
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
              {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Charges (₹) <span className="required">*</span></label>
              <CFormInput
                type="number"
                step="1"
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                placeholder="Enter charges"
              />
              {formErrors.charges && <small className="text-danger">{formErrors.charges}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Estimated Hours</label>
              <CFormInput
                type="number"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="Enter estimated hours"
              />
              {formErrors.estimatedHours && <small className="text-danger">{formErrors.estimatedHours}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Tax Applicable</label>
              <div>
                <CFormCheck
                  inline
                  label="Yes"
                  type="radio"
                  name="taxApplicable"
                  checked={formData.taxApplicable === true}
                  onChange={() => {
                    setFormData({ ...formData, taxApplicable: true });
                    setFormErrors({ ...formErrors, gstRate: null });
                  }}
                />
                <CFormCheck
                  inline
                  label="No"
                  type="radio"
                  name="taxApplicable"
                  checked={formData.taxApplicable === false}
                  onChange={() => {
                    setFormData({ ...formData, taxApplicable: false, gstRate: '' });
                    setFormErrors({ ...formErrors, gstRate: null });
                  }}
                />
              </div>
            </CCol>
            {formData.taxApplicable && (
              <CCol md={6}>
                <label className="form-label">GST Rate (%) <span className="required">*</span></label>
                <CFormInput
                  type="number"
                  step="0.01"
                  value={formData.gstRate}
                  onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                  placeholder="Enter GST rate (e.g., 18)"
                />
                {formErrors.gstRate && <small className="text-danger">{formErrors.gstRate}</small>}
              </CCol>
            )}
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Status</label>
              <div>
                <CFormCheck
                  inline
                  label="Active"
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === true}
                  onChange={() => setFormData({ ...formData, isActive: true })}
                />
                <CFormCheck
                  inline
                  label="Inactive"
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === false}
                  onChange={() => setFormData({ ...formData, isActive: false })}
                />
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditSubmit} disabled={formLoading}>
            {formLoading ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Labour'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this labour item?</p>
          <p><strong>Labour Code:</strong> {selectedLabour?.labourCode}</p>
          <p><strong>Description:</strong> {selectedLabour?.description}</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            <CIcon icon={cilTrash} className="me-1" /> Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Labour;