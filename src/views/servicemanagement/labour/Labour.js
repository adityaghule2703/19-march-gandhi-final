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
  cilBuilding,
  cilCloudUpload,
  cilWarning,
  cilCheckCircle,
  cilMinus,
  cilReload
} from '@coreui/icons';
import {
  hasSafePagePermission,
  MODULES,
  PAGES,
  ACTIONS,
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';

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
  const { permissions = [], user } = useAuth();
  
  // Permission checks using the modulePermissions utility
  const canViewLabour = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.LABOUR_LIST, 
    ACTIONS.VIEW
  );
  
  const canCreateLabour = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.LABOUR_LIST, 
    ACTIONS.CREATE
  );
  
  const canUpdateLabour = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.LABOUR_LIST, 
    ACTIONS.UPDATE
  );
  
  const canDeleteLabour = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.LABOUR_LIST, 
    ACTIONS.DELETE
  );

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
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  
  // Form state - Added hsnCode
  const [formData, setFormData] = useState({
    branchId: '',
    description: '',
    category: 'Service',
    hsnCode: ''
  });
  
  // Bulk form state - Added hsnCode
  const [bulkItems, setBulkItems] = useState([
    {
      id: 1,
      description: '',
      category: 'Service',
      hsnCode: ''
    }
  ]);
  const [bulkBranchId, setBulkBranchId] = useState('');
  
  const [formErrors, setFormErrors] = useState({});
  const [bulkErrors, setBulkErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [bulkApiError, setBulkApiError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);
  const [nextId, setNextId] = useState(2);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch labour items when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId && canViewLabour) {
      fetchLabourItems();
    }
  }, [selectedBranchId, pagination.page, pagination.limit, canViewLabour]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId && canViewLabour) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchLabourItems(1, pagination.limit, searchTerm);
      }
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm, canViewLabour]);

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
    if (!selectedBranchId || !canViewLabour) {
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
    if (!canCreateLabour) {
      showError('You do not have permission to add labour items');
      return;
    }
    // For super admin, default to empty branch selection
    // For non-super admin, use their branch
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setFormData({
      branchId: defaultBranchId,
      description: '',
      category: 'Service',
      hsnCode: ''
    });
    setFormErrors({});
    setApiError(null);
    setAddModalVisible(true);
  };

  const handleBulkClick = () => {
    if (!canCreateLabour) {
      showError('You do not have permission to bulk create labour items');
      return;
    }
    // For super admin, default to empty branch selection
    // For non-super admin, use their branch
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setBulkBranchId(defaultBranchId);
    setBulkItems([
      {
        id: 1,
        description: '',
        category: 'Service',
        hsnCode: ''
      }
    ]);
    setNextId(2);
    setBulkErrors({});
    setBulkApiError(null);
    setBulkSuccess(null);
    setBulkModalVisible(true);
    handleClose();
  };

  // Add new row in bulk form
  const handleAddRow = () => {
    setBulkItems([
      ...bulkItems,
      {
        id: nextId,
        description: '',
        category: 'Service',
        hsnCode: ''
      }
    ]);
    setNextId(nextId + 1);
    // Clear row-specific errors when adding new row
    if (bulkErrors.rows) {
      const newErrors = { ...bulkErrors };
      delete newErrors.rows;
      setBulkErrors(newErrors);
    }
  };

  // Remove row from bulk form
  const handleRemoveRow = (id) => {
    if (bulkItems.length <= 1) {
      setBulkErrors({ rows: 'At least one labour item is required' });
      return;
    }
    setBulkItems(bulkItems.filter(item => item.id !== id));
    // Clear row-specific errors
    if (bulkErrors.rows) {
      const newErrors = { ...bulkErrors };
      delete newErrors.rows;
      setBulkErrors(newErrors);
    }
  };

  // Update bulk item field
  const handleBulkItemChange = (id, field, value) => {
    setBulkItems(bulkItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    // Clear errors for this field
    if (bulkErrors.rows) {
      const newErrors = { ...bulkErrors };
      delete newErrors.rows;
      setBulkErrors(newErrors);
    }
    setBulkApiError(null);
    setBulkSuccess(null);
  };

  const handleEditClick = (labour) => {
    if (!canUpdateLabour) {
      showError('You do not have permission to edit labour items');
      return;
    }
    setSelectedLabour(labour);
    setFormData({
      branchId: labour.branchId || '',
      description: labour.description || '',
      category: labour.category || 'Service',
      hsnCode: labour.hsnCode || ''
    });
    setFormErrors({});
    setApiError(null);
    setEditModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (labour) => {
    if (!canDeleteLabour) {
      showError('You do not have permission to delete labour items');
      return;
    }
    setSelectedLabour(labour);
    setDeleteModalVisible(true);
    handleClose();
  };

  // Toggle status handler - requires UPDATE permission
  const handleToggleStatus = async (labour) => {
    if (!canUpdateLabour) {
      showError('You do not have permission to update labour status');
      return;
    }
    try {
      setTogglingId(labour._id);
      setToggleLoading(true);
      
      const response = await axiosInstance.patch(`/labour/${labour._id}/toggle-status`);
      
      if (response.data.success) {
        const newStatus = response.data.data?.isActive ?? !labour.isActive;
        showSuccess(`Labour item ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        
        // Update the labour item in the list
        setLabourItems(prevItems => 
          prevItems.map(item => 
            item._id === labour._id 
              ? { ...item, isActive: newStatus }
              : item
          )
        );
        
        // Close the menu after action
        handleClose();
      } else {
        showError(response.data.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showError(error.response?.data?.message || 'Failed to toggle status');
    } finally {
      setToggleLoading(false);
      setTogglingId(null);
    }
  };

  const resetForm = () => {
    // For super admin, default to empty branch selection
    // For non-super admin, use their branch
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setFormData({
      branchId: defaultBranchId,
      description: '',
      category: 'Service',
      hsnCode: ''
    });
    setFormErrors({});
    setApiError(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.branchId && isSuperAdmin) errors.branchId = 'Branch is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    // hsnCode is optional, no validation needed
    
    setFormErrors(errors);
    setApiError(null);
    return Object.keys(errors).length === 0;
  };

  const validateBulkForm = () => {
    const errors = {};
    const rowErrors = [];
    
    if (!bulkBranchId && isSuperAdmin) errors.branchId = 'Branch is required';
    
    // Validate each row
    bulkItems.forEach((item, index) => {
      const rowNum = index + 1;
      if (!item.description) {
        rowErrors.push(`Row ${rowNum}: Description is required`);
      }
      if (!item.category) {
        rowErrors.push(`Row ${rowNum}: Category is required`);
      }
      // hsnCode is optional, no validation needed
    });
    
    if (rowErrors.length > 0) {
      errors.rows = rowErrors.join('\n');
    }
    
    setBulkErrors(errors);
    setBulkApiError(null);
    return Object.keys(errors).length === 0;
  };

  // Helper function to extract error message from API response
  const extractErrorMessage = (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const handleAddSubmit = async () => {
    if (!canCreateLabour) {
      showError('You do not have permission to add labour items');
      return;
    }
    if (!validateForm()) return;
    
    setFormLoading(true);
    setApiError(null);
    
    try {
      const payload = {
        branchId: formData.branchId,
        description: formData.description,
        category: formData.category,
        hsnCode: formData.hsnCode || undefined // Only send if has value
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
      const errorMessage = extractErrorMessage(error);
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!canCreateLabour) {
      showError('You do not have permission to bulk create labour items');
      return;
    }
    if (!validateBulkForm()) return;

    // Prepare payload
    const labours = bulkItems.map(item => ({
      description: item.description,
      category: item.category,
      hsnCode: item.hsnCode || undefined // Only send if has value
    }));

    setBulkLoading(true);
    setBulkApiError(null);
    setBulkSuccess(null);
    
    try {
      const payload = {
        branchId: bulkBranchId,
        labours: labours
      };
      
      const response = await axiosInstance.post('/labour/bulk', payload);
      
      if (response.data.success) {
        const result = response.data.data || {};
        const successMessage = result.inserted !== undefined 
          ? `${result.inserted} labour items created successfully!` 
          : 'Labour items created successfully!';
        
        showSuccess(successMessage);
        
        // Refresh the labour list
        await fetchLabourItems(1, pagination.limit, searchTerm);
        
        // Close the modal and reset all states
        setBulkModalVisible(false);
        setBulkItems([
          {
            id: 1,
            description: '',
            category: 'Service',
            hsnCode: ''
          }
        ]);
        setNextId(2);
        setBulkErrors({});
        setBulkApiError(null);
        setBulkSuccess(null);
      } else {
        setBulkApiError(response.data.message || 'Failed to create labour items');
        showError(response.data.message || 'Failed to create labour items');
      }
    } catch (error) {
      console.error('Error creating bulk labour items:', error);
      const errorMessage = extractErrorMessage(error);
      setBulkApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!canUpdateLabour) {
      showError('You do not have permission to update labour items');
      return;
    }
    if (!validateForm()) return;
    if (!selectedLabour) return;
    
    setFormLoading(true);
    setApiError(null);
    
    try {
      const payload = {
        branchId: formData.branchId,
        description: formData.description,
        category: formData.category,
        hsnCode: formData.hsnCode || undefined // Only send if has value
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
      const errorMessage = extractErrorMessage(error);
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!canDeleteLabour) {
      showError('You do not have permission to delete labour items');
      return;
    }
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

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Service': return 'primary';
      case 'Repair': return 'warning';
      case 'Maintenance': return 'info';
      case 'Diagnostic': return 'success';
      default: return 'secondary';
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

  // Check if user has permission to view labour items
  if (!canViewLabour) {
    return (
      <div className="text-center py-5">
        <CIcon icon={cilWarning} style={{ fontSize: '48px' }} className="text-warning mb-3" />
        <h5 className="text-warning">Access Denied</h5>
        <p className="text-muted">You don't have permission to view labour items.</p>
      </div>
    );
  }

  if (error && labourItems.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Labour Management</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {/* Only show Add Labour button if user has CREATE permission */}
            {canCreateLabour && (
              <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
                <CIcon icon={cilPlus} className='icon' /> Add Labour
              </CButton>
            )}
            
            {/* Only show Bulk Create button if user has CREATE permission */}
            {canCreateLabour && (
              <CButton size="sm" className="action-btn me-1" onClick={handleBulkClick}>
                <CIcon icon={cilCloudUpload} className='icon' /> Bulk Create
              </CButton>
            )}
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

          {/* Search Bar - Only show when branch is selected and user has VIEW permission */}
          {selectedBranchId && canViewLabour && (
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

          {/* Labour Table - Only show if user has VIEW permission */}
          {selectedBranchId && canViewLabour && (
            <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Labour Code</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>HSN Code</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {labourItems.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={8} style={{ color: 'red', textAlign: 'center' }}>
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
                          <CTableDataCell>{labour.hsnCode || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge 
                              color={labour.isActive ? 'success' : 'danger'}
                            >
                              {labour.isActive ? 'Active' : 'Inactive'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{formatDate(labour.createdAt)}</CTableDataCell>
                          <CTableDataCell>
                            {/* Show action buttons based on permissions */}
                            {(canUpdateLabour || canDeleteLabour) ? (
                              <>
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
                                  {canUpdateLabour && (
                                    <MenuItem onClick={() => handleEditClick(labour)}>
                                      <CIcon icon={cilPencil} className="me-2" /> Edit
                                    </MenuItem>
                                  )}
                                  {canUpdateLabour && (
                                    <MenuItem onClick={() => handleToggleStatus(labour)} disabled={togglingId === labour._id}>
                                      {togglingId === labour._id ? (
                                        <><CSpinner size="sm" className="me-2" /> Toggling...</>
                                      ) : (
                                        <>
                                          <CIcon icon={cilReload} className="me-2" />
                                          {labour.isActive ? 'Deactivate' : 'Activate'}
                                        </>
                                      )}
                                    </MenuItem>
                                  )}
                                  {canDeleteLabour && (
                                    <MenuItem onClick={() => handleDeleteClick(labour)}>
                                      <CIcon icon={cilTrash} className="me-2" /> Delete
                                    </MenuItem>
                                  )}
                                </Menu>
                              </>
                            ) : (
                              <span className="text-muted">No actions</span>
                            )}
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
          {selectedBranchId && canViewLabour && renderPagination()}
        </CCardBody>
      </CCard>

      {/* Add Labour Modal - Only show if user has CREATE permission */}
      {canCreateLabour && (
        <CModal size="lg" visible={addModalVisible} onClose={() => setAddModalVisible(false)} alignment="center">
          <CModalHeader>
            <CModalTitle>
              <CIcon icon={cilPlus} className="me-2" />
              Add New Labour
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* API Error Alert */}
            {apiError && (
              <CAlert color="danger" className="mb-3" onClose={() => setApiError(null)} dismissible>
                <div className="d-flex align-items-start">
                  <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                  <div>
                    <strong>Error!</strong>
                    <p className="mb-0 mt-1">{apiError}</p>
                  </div>
                </div>
              </CAlert>
            )}
            
            {/* Form Validation Errors */}
            {Object.keys(formErrors).length > 0 && (
              <CAlert color="danger" className="mb-3">
                <strong>Please fix the following errors:</strong>
                <ul className="mb-0 mt-1">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CAlert>
            )}
            
            {/* Branch Selection in Add Form - Only show for Super Admin */}
            {isSuperAdmin && (
              <CRow className="mb-3">
                <CCol md={12}>
                  <label className="form-label">Branch <span className="required">*</span></label>
                  <CFormSelect
                    value={formData.branchId}
                    onChange={(e) => {
                      setFormData({ ...formData, branchId: e.target.value });
                      if (formErrors.branchId) {
                        setFormErrors({ ...formErrors, branchId: '' });
                      }
                      setApiError(null);
                    }}
                    className={formErrors.branchId ? 'is-invalid' : ''}
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
                <label className="form-label">Category <span className="required">*</span></label>
                <CFormSelect
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (formErrors.category) {
                      setFormErrors({ ...formErrors, category: '' });
                    }
                    setApiError(null);
                  }}
                  className={formErrors.category ? 'is-invalid' : ''}
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </CFormSelect>
                {formErrors.category && <small className="text-danger">{formErrors.category}</small>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Description <span className="required">*</span></label>
                <CFormInput
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formErrors.description) {
                      setFormErrors({ ...formErrors, description: '' });
                    }
                    setApiError(null);
                  }}
                  placeholder="Enter description"
                  className={formErrors.description ? 'is-invalid' : ''}
                />
                {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">HSN Code</label>
                <CFormInput
                  value={formData.hsnCode}
                  onChange={(e) => {
                    setFormData({ ...formData, hsnCode: e.target.value });
                    setApiError(null);
                  }}
                  placeholder="Enter HSN code (optional)"
                />
                <small className="text-muted">Optional field</small>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => {
              setAddModalVisible(false);
              setApiError(null);
              setFormErrors({});
            }}>Cancel</CButton>
            <CButton color="primary" onClick={handleAddSubmit} disabled={formLoading}>
              {formLoading ? <><CSpinner size="sm" className="me-2" />Adding...</> : 'Add Labour'}
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* Bulk Create Labour Modal - Only show if user has CREATE permission */}
      {canCreateLabour && (
        <CModal 
          size="lg" 
          visible={bulkModalVisible} 
          onClose={() => {
            setBulkModalVisible(false);
            setBulkItems([
              {
                id: 1,
                description: '',
                category: 'Service',
                hsnCode: ''
              }
            ]);
            setNextId(2);
            setBulkErrors({});
            setBulkApiError(null);
            setBulkSuccess(null);
          }} 
          alignment="center" 
          scrollable
        >
          <CModalHeader>
            <CModalTitle>
              <CIcon icon={cilCloudUpload} className="me-2" />
              Bulk Create Labour Items
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* API Error Alert */}
            {bulkApiError && (
              <CAlert color="danger" className="mb-3" onClose={() => setBulkApiError(null)} dismissible>
                <div className="d-flex align-items-start">
                  <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                  <div>
                    <strong>Error!</strong>
                    <p className="mb-0 mt-1">{bulkApiError}</p>
                  </div>
                </div>
              </CAlert>
            )}
            
            {/* Success Alert */}
            {bulkSuccess && (
              <CAlert color="success" className="mb-3" onClose={() => setBulkSuccess(null)} dismissible>
                <div className="d-flex align-items-start">
                  <CIcon icon={cilCheckCircle} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                  <div>
                    <strong>Success!</strong>
                    <p className="mb-0 mt-1">{bulkSuccess.message}</p>
                    {bulkSuccess.data && (
                      <div className="mt-2">
                        {bulkSuccess.data.inserted !== undefined && (
                          <div>✅ Inserted: {bulkSuccess.data.inserted}</div>
                        )}
                        {bulkSuccess.data.updated !== undefined && (
                          <div>🔄 Updated: {bulkSuccess.data.updated}</div>
                        )}
                        {bulkSuccess.data.skipped !== undefined && (
                          <div>⚠️ Skipped: {bulkSuccess.data.skipped}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CAlert>
            )}
            
            {/* Form Validation Errors */}
            {Object.keys(bulkErrors).length > 0 && (
              <CAlert color="danger" className="mb-3">
                <strong>Please fix the following errors:</strong>
                <ul className="mb-0 mt-1">
                  {Object.values(bulkErrors).map((error, index) => (
                    <li key={index} style={{ whiteSpace: 'pre-line' }}>{error}</li>
                  ))}
                </ul>
              </CAlert>
            )}
            
            {/* Branch Selection - Only show for Super Admin */}
            {isSuperAdmin && (
              <CRow className="mb-3">
                <CCol md={12}>
                  <label className="form-label">Branch <span className="required">*</span></label>
                  <CFormSelect
                    value={bulkBranchId}
                    onChange={(e) => {
                      setBulkBranchId(e.target.value);
                      if (bulkErrors.branchId) {
                        setBulkErrors({ ...bulkErrors, branchId: '' });
                      }
                      setBulkApiError(null);
                      setBulkSuccess(null);
                    }}
                    className={bulkErrors.branchId ? 'is-invalid' : ''}
                  >
                    <option value="">-- Select Branch --</option>
                    {branches.map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name} - {branch.city}
                      </option>
                    ))}
                  </CFormSelect>
                  {bulkErrors.branchId && <small className="text-danger">{bulkErrors.branchId}</small>}
                </CCol>
              </CRow>
            )}

            {/* Labour Items Rows - Added hsnCode field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <CFormLabel className="fw-bold mb-0">Labour Items <span className="required">*</span></CFormLabel>
                <CButton size="sm" color="primary" onClick={handleAddRow} disabled={bulkLoading}>
                  <CIcon icon={cilPlus} className="me-1" /> Add More
                </CButton>
              </div>
              
              {bulkItems.map((item, index) => (
                <div key={item.id} className="border p-3 mb-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <strong className="text-primary">Item #{index + 1}</strong>
                    <CButton
                      size="sm"
                      color="danger"
                      variant="outline"
                      onClick={() => handleRemoveRow(item.id)}
                      disabled={bulkItems.length <= 1 || bulkLoading}
                    >
                      <CIcon icon={cilMinus} /> Remove
                    </CButton>
                  </div>
                  <CRow>
                    <CCol md={6}>
                      <label className="form-label">Category <span className="required">*</span></label>
                      <CFormSelect
                        value={item.category}
                        onChange={(e) => handleBulkItemChange(item.id, 'category', e.target.value)}
                        className={bulkErrors.rows && !item.category ? 'is-invalid' : ''}
                        disabled={bulkLoading}
                      >
                        {CATEGORY_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <label className="form-label">Description <span className="required">*</span></label>
                      <CFormInput
                        value={item.description}
                        onChange={(e) => handleBulkItemChange(item.id, 'description', e.target.value)}
                        placeholder="Enter description"
                        className={bulkErrors.rows && !item.description ? 'is-invalid' : ''}
                        disabled={bulkLoading}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-2">
                    <CCol md={12}>
                      <label className="form-label">HSN Code</label>
                      <CFormInput
                        value={item.hsnCode}
                        onChange={(e) => handleBulkItemChange(item.id, 'hsnCode', e.target.value)}
                        placeholder="Enter HSN code (optional)"
                        disabled={bulkLoading}
                      />
                      <small className="text-muted">Optional field</small>
                    </CCol>
                  </CRow>
                </div>
              ))}
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton 
              color="secondary" 
              onClick={() => {
                setBulkModalVisible(false);
                setBulkItems([
                  {
                    id: 1,
                    description: '',
                    category: 'Service',
                    hsnCode: ''
                  }
                ]);
                setNextId(2);
                setBulkErrors({});
                setBulkApiError(null);
                setBulkSuccess(null);
              }} 
              disabled={bulkLoading}
            >
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleBulkSubmit} disabled={bulkLoading || !!bulkSuccess}>
              {bulkLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                <>
                  <CIcon icon={cilCloudUpload} className="me-1" />
                  Bulk Create
                </>
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* Edit Labour Modal - Only show if user has UPDATE permission */}
      {canUpdateLabour && (
        <CModal size="lg" visible={editModalVisible} onClose={() => setEditModalVisible(false)} alignment="center">
          <CModalHeader>
            <CModalTitle>
              <CIcon icon={cilPencil} className="me-2" />
              Edit Labour
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* API Error Alert */}
            {apiError && (
              <CAlert color="danger" className="mb-3" onClose={() => setApiError(null)} dismissible>
                <div className="d-flex align-items-start">
                  <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                  <div>
                    <strong>Error!</strong>
                    <p className="mb-0 mt-1">{apiError}</p>
                  </div>
                </div>
              </CAlert>
            )}
            
            {/* Form Validation Errors */}
            {Object.keys(formErrors).length > 0 && (
              <CAlert color="danger" className="mb-3">
                <strong>Please fix the following errors:</strong>
                <ul className="mb-0 mt-1">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CAlert>
            )}
            
            {/* Branch Selection in Edit Form - Only show for Super Admin */}
            {isSuperAdmin && (
              <CRow className="mb-3">
                <CCol md={12}>
                  <label className="form-label">Branch <span className="required">*</span></label>
                  <CFormSelect
                    value={formData.branchId}
                    onChange={(e) => {
                      setFormData({ ...formData, branchId: e.target.value });
                      if (formErrors.branchId) {
                        setFormErrors({ ...formErrors, branchId: '' });
                      }
                      setApiError(null);
                    }}
                    className={formErrors.branchId ? 'is-invalid' : ''}
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
                <label className="form-label">Category <span className="required">*</span></label>
                <CFormSelect
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (formErrors.category) {
                      setFormErrors({ ...formErrors, category: '' });
                    }
                    setApiError(null);
                  }}
                  className={formErrors.category ? 'is-invalid' : ''}
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </CFormSelect>
                {formErrors.category && <small className="text-danger">{formErrors.category}</small>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Description <span className="required">*</span></label>
                <CFormInput
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formErrors.description) {
                      setFormErrors({ ...formErrors, description: '' });
                    }
                    setApiError(null);
                  }}
                  placeholder="Enter description"
                  className={formErrors.description ? 'is-invalid' : ''}
                />
                {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">HSN Code</label>
                <CFormInput
                  value={formData.hsnCode}
                  onChange={(e) => {
                    setFormData({ ...formData, hsnCode: e.target.value });
                    setApiError(null);
                  }}
                  placeholder="Enter HSN code (optional)"
                />
                <small className="text-muted">Optional field</small>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => {
              setEditModalVisible(false);
              setApiError(null);
              setFormErrors({});
            }}>Cancel</CButton>
            <CButton color="primary" onClick={handleEditSubmit} disabled={formLoading}>
              {formLoading ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Labour'}
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* Delete Confirmation Modal - Only show if user has DELETE permission */}
      {canDeleteLabour && (
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
      )}
    </div>
  );
};

export default Labour;