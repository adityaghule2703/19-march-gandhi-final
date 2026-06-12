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
  CAlert,
  CFormCheck,
  CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilPlus,
  cilPencil,
  cilTrash,
  cilPrint,
  cilWarning,
  cilCloudUpload,
  cilCheckCircle,
  cilFile,
  cilBuilding
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Category options based on enum
const CATEGORY_OPTIONS = [
  { value: 'Engine', label: 'Engine' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Body', label: 'Body' },
  { value: 'Brakes', label: 'Brakes' },
  { value: 'Suspension', label: 'Suspension' },
  { value: 'Other', label: 'Other' }
];

// GST Type options based on enum
const GST_TYPE_OPTIONS = [
  { value: 'CGST+SGST', label: 'CGST + SGST' },
  { value: 'IGST', label: 'IGST' }
];

const Parts = () => {
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
  const [parts, setParts] = useState([]);
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
  const [selectedPart, setSelectedPart] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Export state
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportCategory, setExportCategory] = useState('');
  const [exportMinStock, setExportMinStock] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);
  
  // Import state
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form state - Updated to match new schema
  const [formData, setFormData] = useState({
    branchId: '',
    partNo: '',
    partName: '',
    mrp: '',
    gstRate: '',
    gstType: 'CGST+SGST',
    hsnCode: '',
    category: 'Other',
    stock: '',
    minStock: '',
    location: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch parts when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchParts();
    }
  }, [selectedBranchId, pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchParts(1, pagination.limit, searchTerm);
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

  const fetchParts = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    if (!selectedBranchId) {
      setParts([]);
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
      
      const url = `/parts?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setParts(response.data.data || []);
        setPagination({
          page: response.data.currentPage || page,
          limit: limit,
          totalCount: response.data.total || response.data.data.length,
          totalPages: response.data.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching parts:', error);
      setError(error.response?.data?.message || 'Failed to fetch parts');
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

  const handleEditClick = (part) => {
    setSelectedPart(part);
    setFormData({
      branchId: part.branchId || '',
      partNo: part.partNo || '',
      partName: part.partName || '',
      mrp: part.mrp || '',
      gstRate: part.gstRate || '',
      gstType: part.gstType || 'CGST+SGST',
      hsnCode: part.hsnCode || '',
      category: part.category || 'Other',
      stock: part.stock || '',
      minStock: part.minStock || '',
      location: part.location || ''
    });
    setEditModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (part) => {
    setSelectedPart(part);
    setDeleteModalVisible(true);
    handleClose();
  };

  // Export handlers
  const handleExportClick = () => {
    if (!selectedBranchId && isSuperAdmin) {
      showError('Please select a branch first');
      return;
    }
    setExportError(null);
    setExportCategory('');
    setExportMinStock(false);
    setExportModalVisible(true);
    handleClose();
  };

  const resetExportModal = () => {
    setExportModalVisible(false);
    setExportCategory('');
    setExportMinStock(false);
    setExportLoading(false);
    setExportError(null);
  };

  const handleExportConfirm = async () => {
    if (!selectedBranchId && isSuperAdmin) {
      setExportError('Please select a branch first');
      return;
    }
    
    setExportLoading(true);
    setExportError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('branchId', selectedBranchId);
      
      if (exportCategory) {
        params.append('category', exportCategory);
      }
      
      if (exportMinStock) {
        params.append('minStock', 'true');
      }
      
      const url = `/parts/export/excel${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await axiosInstance.get(url, {
        responseType: 'blob',
        validateStatus: (status) => status < 500
      });
      
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        setExportError(errorData.message || 'Failed to export parts');
        setExportLoading(false);
        return;
      }
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const date = new Date();
      const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      let fileName = `parts_export_${dateStr}.xlsx`;
      
      if (exportCategory) {
        fileName = `parts_${exportCategory}_${dateStr}.xlsx`;
      }
      
      if (exportMinStock) {
        fileName = `parts_low_stock_${dateStr}.xlsx`;
      }
      
      if (exportCategory && exportMinStock) {
        fileName = `parts_${exportCategory}_low_stock_${dateStr}.xlsx`;
      }
      
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      showSuccess('Parts exported successfully!');
      resetExportModal();
    } catch (error) {
      console.error('Error exporting parts:', error);
      
      let errorMessage = 'Failed to export parts';
      
      if (error.response && error.response.data) {
        if (error.response.data instanceof Blob) {
          try {
            const text = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsText(error.response.data);
            });
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            errorMessage = error.response.statusText || errorMessage;
          }
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setExportError(errorMessage);
      setExportLoading(false);
    }
  };

  // Import handlers
  const handleImportClick = () => {
    if (!selectedBranchId && isSuperAdmin) {
      showError('Please select a branch first');
      return;
    }
    setImportError(null);
    setImportSuccess(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setImportModalVisible(true);
    handleClose();
  };

  const resetImportModal = () => {
    setImportModalVisible(false);
    setSelectedFile(null);
    setImportLoading(false);
    setImportError(null);
    setImportSuccess(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['.xlsx', '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      const fileType = file.name.split('.').pop().toLowerCase();
      
      if (fileType !== 'xlsx' && fileType !== 'xls') {
        setImportError('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
        setSelectedFile(null);
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setImportError('File size exceeds 10MB limit. Please compress or split your file.');
        setSelectedFile(null);
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
      setImportError(null);
    }
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      setImportError('Please select a file to upload');
      return;
    }

    if (!selectedBranchId && isSuperAdmin) {
      setImportError('Please select a branch first');
      return;
    }

    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('branchId', selectedBranchId);

    try {
      const response = await axiosInstance.post('/parts/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
        validateStatus: (status) => status < 500
      });

      // Check if response is successful
      if (response.data && response.data.success) {
        setImportSuccess({
          message: response.data.message || 'Parts imported successfully!',
          data: response.data.data || {}
        });
        
        showSuccess(response.data.message || 'Parts imported successfully!');
        
        // Refresh the parts list
        setTimeout(() => {
          fetchParts(1, pagination.limit, searchTerm);
        }, 2000);
      } else {
        // Handle unsuccessful response
        setImportError(response.data.message || 'Failed to import parts');
      }
    } catch (error) {
      console.error('Error importing parts:', error);
      
      let errorMessage = 'Failed to import parts';
      
      if (error.response && error.response.data) {
        if (error.response.data instanceof Blob) {
          try {
            const text = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsText(error.response.data);
            });
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
            
            // Display detailed errors if available
            if (errorData.errors && errorData.errors.length > 0) {
              errorMessage = `${errorMessage}\n\nDetails:\n${errorData.errors.join('\n')}`;
            }
          } catch (parseError) {
            errorMessage = error.response.statusText || errorMessage;
          }
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
          
          // Display detailed errors if available
          if (error.response.data.errors && error.response.data.errors.length > 0) {
            errorMessage = `${errorMessage}\n\nDetails:\n${error.response.data.errors.join('\n')}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setImportError(errorMessage);
    } finally {
      setImportLoading(false);
      setUploadProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  };

  const resetForm = () => {
    // For super admin, default to empty branch selection
    // For non-super admin, use their branch
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setFormData({
      branchId: defaultBranchId,
      partNo: '',
      partName: '',
      mrp: '',
      gstRate: '',
      gstType: 'CGST+SGST',
      hsnCode: '',
      category: 'Other',
      stock: '',
      minStock: '',
      location: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.branchId && isSuperAdmin) errors.branchId = 'Branch is required';
    if (!formData.partNo) errors.partNo = 'Part number is required';
    if (!formData.partName) errors.partName = 'Part name is required';
    if (!formData.mrp) errors.mrp = 'MRP is required';
    if (!formData.gstRate) errors.gstRate = 'GST rate is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.gstType) errors.gstType = 'GST type is required';
    if (formData.stock === '' || formData.stock === null) errors.stock = 'Stock is required';
    if (formData.minStock === '' || formData.minStock === null) errors.minStock = 'Minimum stock is required';
    
    // Validate GST rate
    if (formData.gstRate && (formData.gstRate < 0 || formData.gstRate > 100)) {
      errors.gstRate = 'GST rate must be between 0 and 100';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    
    setFormLoading(true);
    try {
      const payload = {
        branchId: formData.branchId,
        partNo: formData.partNo,
        partName: formData.partName,
        mrp: parseFloat(formData.mrp),
        gstRate: parseFloat(formData.gstRate),
        gstType: formData.gstType,
        hsnCode: formData.hsnCode,
        category: formData.category,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        location: formData.location
      };
      
      const response = await axiosInstance.post('/parts', payload);
      if (response.data.success) {
        showSuccess('Part added successfully!');
        setAddModalVisible(false);
        resetForm();
        
        // If the added part belongs to the currently selected branch, refresh the list
        if (formData.branchId === selectedBranchId) {
          fetchParts(1, pagination.limit, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error adding part:', error);
      showError(error.response?.data?.message || 'Failed to add part');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedPart) return;
    
    setFormLoading(true);
    try {
      const payload = {
        branchId: formData.branchId,
        partNo: formData.partNo,
        partName: formData.partName,
        mrp: parseFloat(formData.mrp),
        gstRate: parseFloat(formData.gstRate),
        gstType: formData.gstType,
        hsnCode: formData.hsnCode,
        category: formData.category,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        location: formData.location
      };
      
      const response = await axiosInstance.put(`/parts/${selectedPart._id}`, payload);
      if (response.data.success) {
        showSuccess('Part updated successfully!');
        setEditModalVisible(false);
        resetForm();
        
        // If the updated part belongs to the currently selected branch, refresh the list
        if (formData.branchId === selectedBranchId) {
          fetchParts(pagination.page, pagination.limit, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error updating part:', error);
      showError(error.response?.data?.message || 'Failed to update part');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPart) return;
    
    try {
      const response = await axiosInstance.delete(`/parts/${selectedPart._id}`);
      if (response.data.success) {
        showSuccess('Part deleted successfully!');
        setDeleteModalVisible(false);
        setSelectedPart(null);
        fetchParts(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error deleting part:', error);
      showError(error.response?.data?.message || 'Failed to delete part');
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

  const getStockBadge = (stock, minStock) => {
    if (stock <= 0) {
      return <CBadge color="danger">Out of Stock</CBadge>;
    } else if (stock <= minStock) {
      return <CBadge color="warning">Low Stock ({stock})</CBadge>;
    } else {
      return <CBadge color="success">In Stock ({stock})</CBadge>;
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Engine': return 'danger';
      case 'Electrical': return 'warning';
      case 'Body': return 'info';
      case 'Brakes': return 'primary';
      case 'Suspension': return 'success';
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

  // Get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find(b => b._id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  if (error && parts.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Parts Management</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
              <CIcon icon={cilPlus} className='icon' /> Add Part
            </CButton>
            {/* <CButton size="sm" className="action-btn me-1" onClick={handleImportClick}>
              <CIcon icon={cilCloudUpload} className='icon' /> Import Excel
            </CButton>
            <CButton size="sm" className="action-btn me-1" onClick={handleExportClick}>
              <CIcon icon={cilPrint} className='icon' /> Export Excel
            </CButton> */}
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
                <small className="text-danger d-block mt-1">Please select a branch to view parts</small>
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
                  placeholder="Search by part no, name, category..."
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
              <h5 className="text-muted">Please select a branch to view parts</h5>
              <p className="text-muted">Select a branch from the dropdown above to manage parts for that branch</p>
            </div>
          )}

          {/* Parts Table */}
          {selectedBranchId && (
            <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Part No</CTableHeaderCell>
                    <CTableHeaderCell>Part Name</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>MRP</CTableHeaderCell>
                    <CTableHeaderCell>GST Rate</CTableHeaderCell>
                    <CTableHeaderCell>GST Type</CTableHeaderCell>
                    <CTableHeaderCell>HSN Code</CTableHeaderCell>
                    <CTableHeaderCell>Stock Status</CTableHeaderCell>
                    <CTableHeaderCell>Min Stock</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {parts.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={13} style={{ color: 'red', textAlign: 'center' }}>
                        {searchTerm ? `No results found for "${searchTerm}"` : 'No parts found for this branch.'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    parts.map((part, index) => {
                      const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                      return (
                        <CTableRow key={part._id}>
                          <CTableDataCell>{globalIndex}</CTableDataCell>
                          <CTableDataCell><strong>{part.partNo}</strong></CTableDataCell>
                          <CTableDataCell>{part.partName}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getCategoryBadgeColor(part.category)}>
                              {part.category}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{formatCurrency(part.mrp)}</CTableDataCell>
                          <CTableDataCell>{part.gstRate}%</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={part.gstType === 'CGST+SGST' ? 'primary' : 'success'}>
                              {part.gstType}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{part.hsnCode || '-'}</CTableDataCell>
                          <CTableDataCell>{getStockBadge(part.stock, part.minStock)}</CTableDataCell>
                          <CTableDataCell>{part.minStock}</CTableDataCell>
                          <CTableDataCell>{part.location || '-'}</CTableDataCell>
                          <CTableDataCell>{formatDate(part.createdAt)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, part._id)}
                            >
                              <CIcon icon={cilOptions} /> Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${part._id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === part._id} 
                              onClose={handleClose}
                            >
                              <MenuItem onClick={() => handleEditClick(part)}>
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteClick(part)}>
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

      {/* Add Part Modal */}
      <CModal size="lg" visible={addModalVisible} onClose={() => setAddModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Add New Part
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
              <label className="form-label">Part Number <span className="required">*</span></label>
              <CFormInput
                value={formData.partNo}
                onChange={(e) => setFormData({ ...formData, partNo: e.target.value.toUpperCase() })}
                placeholder="Enter part number"
              />
              {formErrors.partNo && <small className="text-danger">{formErrors.partNo}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Part Name <span className="required">*</span></label>
              <CFormInput
                value={formData.partName}
                onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                placeholder="Enter part name"
              />
              {formErrors.partName && <small className="text-danger">{formErrors.partName}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
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
            <CCol md={6}>
              <label className="form-label">GST Type <span className="required">*</span></label>
              <CFormSelect
                value={formData.gstType}
                onChange={(e) => setFormData({ ...formData, gstType: e.target.value })}
              >
                {GST_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.gstType && <small className="text-danger">{formErrors.gstType}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">MRP (₹) <span className="required">*</span></label>
              <CFormInput
                type="number"
                step="1"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                placeholder="Enter MRP"
              />
              {formErrors.mrp && <small className="text-danger">{formErrors.mrp}</small>}
            </CCol>
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
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">HSN Code</label>
              <CFormInput
                value={formData.hsnCode}
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                placeholder="Enter HSN code"
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Location</label>
              <CFormInput
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter storage location"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Current Stock <span className="required">*</span></label>
              <CFormInput
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Enter current stock quantity"
              />
              {formErrors.stock && <small className="text-danger">{formErrors.stock}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Minimum Stock <span className="required">*</span></label>
              <CFormInput
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="Enter minimum stock level"
              />
              {formErrors.minStock && <small className="text-danger">{formErrors.minStock}</small>}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddSubmit} disabled={formLoading}>
            {formLoading ? <><CSpinner size="sm" className="me-2" />Adding...</> : 'Add Part'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Part Modal */}
      <CModal size="lg" visible={editModalVisible} onClose={() => setEditModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPencil} className="me-2" />
            Edit Part
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
              <label className="form-label">Part Number <span className="required">*</span></label>
              <CFormInput
                value={formData.partNo}
                onChange={(e) => setFormData({ ...formData, partNo: e.target.value.toUpperCase() })}
                placeholder="Enter part number"
              />
              {formErrors.partNo && <small className="text-danger">{formErrors.partNo}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Part Name <span className="required">*</span></label>
              <CFormInput
                value={formData.partName}
                onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                placeholder="Enter part name"
              />
              {formErrors.partName && <small className="text-danger">{formErrors.partName}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
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
            <CCol md={6}>
              <label className="form-label">GST Type <span className="required">*</span></label>
              <CFormSelect
                value={formData.gstType}
                onChange={(e) => setFormData({ ...formData, gstType: e.target.value })}
              >
                {GST_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
              {formErrors.gstType && <small className="text-danger">{formErrors.gstType}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">MRP (₹) <span className="required">*</span></label>
              <CFormInput
                type="number"
                step="1"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                placeholder="Enter MRP"
              />
              {formErrors.mrp && <small className="text-danger">{formErrors.mrp}</small>}
            </CCol>
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
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">HSN Code</label>
              <CFormInput
                value={formData.hsnCode}
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                placeholder="Enter HSN code"
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Location</label>
              <CFormInput
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter storage location"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Current Stock <span className="required">*</span></label>
              <CFormInput
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Enter current stock quantity"
              />
              {formErrors.stock && <small className="text-danger">{formErrors.stock}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Minimum Stock <span className="required">*</span></label>
              <CFormInput
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="Enter minimum stock level"
              />
              {formErrors.minStock && <small className="text-danger">{formErrors.minStock}</small>}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditSubmit} disabled={formLoading}>
            {formLoading ? <><CSpinner size="sm" className="me-2" />Updating...</> : 'Update Part'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this part?</p>
          <p><strong>Part Number:</strong> {selectedPart?.partNo}</p>
          <p><strong>Part Name:</strong> {selectedPart?.partName}</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            <CIcon icon={cilTrash} className="me-1" /> Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Import Excel Modal */}
      <CModal visible={importModalVisible} onClose={resetImportModal} alignment="center" size="lg">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilCloudUpload} className="me-2" />
            Import Parts from Excel
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Error Alert */}
          {importError && (
            <CAlert color="danger" className="mb-3">
              <div className="d-flex align-items-start">
                <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                <div style={{ whiteSpace: 'pre-line' }}>
                  <strong>Import Failed</strong>
                  <p className="mb-0 mt-1">{importError}</p>
                </div>
              </div>
            </CAlert>
          )}

          {/* Success Alert */}
          {importSuccess && (
            <CAlert color="success" className="mb-3">
              <div className="d-flex align-items-start">
                <CIcon icon={cilCheckCircle} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                <div>
                  <strong>Import Successful!</strong>
                  <p className="mb-0 mt-1">{importSuccess.message}</p>
                  {importSuccess.data && (
                    <div className="mt-2">
                      {importSuccess.data.inserted !== undefined && (
                        <div>✅ Inserted: {importSuccess.data.inserted}</div>
                      )}
                      {importSuccess.data.updated !== undefined && (
                        <div>🔄 Updated: {importSuccess.data.updated}</div>
                      )}
                      {importSuccess.data.skipped !== undefined && (
                        <div>⚠️ Skipped: {importSuccess.data.skipped}</div>
                      )}
                      {importSuccess.data.errors && importSuccess.data.errors.length > 0 && (
                        <div className="mt-2">
                          <details>
                            <summary className="text-warning">View Errors ({importSuccess.data.errors.length})</summary>
                            <ul className="mt-2">
                              {importSuccess.data.errors.map((err, idx) => (
                                <li key={idx} className="text-danger">{err}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CAlert>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-3">
              <label className="form-label">Uploading: {uploadProgress}%</label>
              <CProgress value={uploadProgress} color="primary" animated />
            </div>
          )}

          {/* File Upload Section */}
          <div className="mb-3">
            <label className="form-label">Select Excel File <span className="required">*</span></label>
            <CFormInput
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={importLoading}
            />
            <small className="text-muted d-block mt-1">
              Supported formats: .xlsx, .xls (Max size: 10MB)
            </small>
          </div>

          {/* File Info */}
          {selectedFile && !importError && (
            <CAlert color="info" className="mb-3">
              <CIcon icon={cilFile} className="me-2" />
              <strong>Selected File:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetImportModal} disabled={importLoading}>
            {importSuccess ? 'Close' : 'Cancel'}
          </CButton>
          {!importSuccess && (
            <CButton 
              color="primary" 
              onClick={handleImportConfirm} 
              disabled={!selectedFile || importLoading}
            >
              {importLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Importing...
                </>
              ) : (
                <>
                  <CIcon icon={cilCloudUpload} className="me-1" />
                  Import Excel
                </>
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* Export Excel Modal */}
      <CModal visible={exportModalVisible} onClose={resetExportModal} alignment="center" size="md">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPrint} className="me-2" />
            Export Parts to Excel
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {exportError && (
            <CAlert color="danger" className="mb-3">
              <div className="d-flex align-items-start">
                <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
                <div>
                  <strong>Export Failed</strong>
                  <p className="mb-0 mt-1">{exportError}</p>
                </div>
              </div>
            </CAlert>
          )}

          <div className="mb-3">
            <label className="form-label">Category (Optional)</label>
            <CFormSelect
              value={exportCategory}
              onChange={(e) => {
                setExportCategory(e.target.value);
                setExportError(null);
              }}
            >
              <option value="">-- All Categories --</option>
              {CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </CFormSelect>
            <small className="text-muted">Select a category to filter parts by category</small>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center">
              <CFormCheck
                id="minStockCheck"
                checked={exportMinStock}
                onChange={(e) => {
                  setExportMinStock(e.target.checked);
                  setExportError(null);
                }}
                label="Export only parts with low stock (stock ≤ minimum stock)"
              />
            </div>
            <small className="text-muted">When checked, only parts that are at or below minimum stock level will be exported</small>
          </div>

          {(exportCategory || exportMinStock) && (
            <CAlert color="info" className="mt-2">
              <strong>Export Summary:</strong><br />
              {exportCategory && `• Category: ${CATEGORY_OPTIONS.find(c => c.value === exportCategory)?.label}\n`}
              {exportMinStock && `• Filter: Low stock parts only`}
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetExportModal} disabled={exportLoading}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleExportConfirm} disabled={exportLoading}>
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : (
              <>
                <CIcon icon={cilPrint} className="me-1" />
                Export Excel
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Parts;