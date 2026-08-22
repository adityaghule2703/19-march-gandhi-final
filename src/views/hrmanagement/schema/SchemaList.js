// SchemaList.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CAlert,
  CPagination,
  CPaginationItem,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSearch, 
  cilSettings, 
  cilPencil, 
  cilTrash, 
  cilZoomOut,
  cilInfo,
  cilWarning,
  cilChevronLeft,
  cilChevronRight,
  cilCalendar,
  cilOptions
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  showError, 
  showSuccess, 
  axiosInstance,
  Menu,
  MenuItem
} from '../../../utils/tableImports';
import '../../../css/table.css';
import '../../../css/form.css';
import AddSchemaModal from './AddSchemaModal';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT = 100;

const SchemaList = () => {
  const navigate = useNavigate();
  const { permissions = [], user } = useAuth();

  // State management
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);

  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  // Modal states
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [editingSchema, setEditingSchema] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // View schema details modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState(null);

  // Delete schema modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return '';
    }
  };

  const formatDateFull = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Fetch schemas with pagination, search, filters
  const fetchSchemas = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);

      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      if (filterStatus) {
        params.append('status', filterStatus);
      }

      if (filterType) {
        params.append('scheme_type', filterType);
      }

      const response = await axiosInstance.get(`/master-schema?${params.toString()}`);
      
      const responseData = response.data;
      let schemesData = [];
      let paginationData = {};

      if (responseData.data?.schemes) {
        schemesData = responseData.data.schemes;
        paginationData = responseData.data.pagination || {};
      } else if (responseData.data && Array.isArray(responseData.data)) {
        schemesData = responseData.data;
        paginationData = responseData.pagination || {};
      } else if (Array.isArray(responseData)) {
        schemesData = responseData;
      } else {
        schemesData = responseData.data?.schemes || [];
        paginationData = responseData.data?.pagination || responseData.pagination || {};
      }

      setSchemas(schemesData);
      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        totalCount: paginationData.totalCount || schemesData.length,
        totalPages: paginationData.totalPages || Math.ceil((paginationData.totalCount || schemesData.length) / limit),
        hasNextPage: paginationData.hasNextPage || false,
        hasPrevPage: paginationData.hasPrevPage || false
      });

    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch schemas';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSchemas();
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchSchemas(1, pagination.limit, searchTerm);
    }, 500);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchTerm]);

  // Fetch when pagination/filters change
  useEffect(() => {
    if (pagination.page !== 1 || pagination.limit !== DEFAULT_LIMIT) {
      fetchSchemas(pagination.page, pagination.limit, searchTerm);
    }
  }, [pagination.page, pagination.limit]);

  // Handle filter application
  const applyFilter = () => {
    if (filterStatus || filterType) {
      setIsFilterApplied(true);
      setFilterModalOpen(false);
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchSchemas(1, pagination.limit, searchTerm);
    } else {
      showError('Please select status or type to apply filter');
    }
  };

  const clearFilter = () => {
    setFilterStatus('');
    setFilterType('');
    setIsFilterApplied(false);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSchemas(1, pagination.limit, searchTerm);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle rows per page change
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit, 10),
      page: 1
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Menu handlers
  const handleClickMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  // Handle modal operations
  const handleOpenCreateModal = () => {
    setEditingSchema(null);
    setSchemaModalOpen(true);
  };

  const handleOpenEditModal = (schema) => {
    setEditingSchema(schema);
    setSchemaModalOpen(true);
    handleCloseMenu();
  };

  const handleModalClose = () => {
    setSchemaModalOpen(false);
    setEditingSchema(null);
  };

  const handleModalSuccess = () => {
    fetchSchemas(pagination.page, pagination.limit, searchTerm);
  };

  // Handle view schema details
  const handleViewSchema = (schema) => {
    setSelectedSchema(schema);
    setViewModalOpen(true);
    handleCloseMenu();
  };

  // Handle delete schema
  const handleDeleteSchema = (schema) => {
    setSchemaToDelete(schema);
    setDeleteModalOpen(true);
    handleCloseMenu();
  };

  const confirmDeleteSchema = async () => {
    if (!schemaToDelete) return;
    
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/master-schema/${schemaToDelete._id}`);
      showSuccess('Schema deleted successfully!');
      setDeleteModalOpen(false);
      setSchemaToDelete(null);
      fetchSchemas(pagination.page, pagination.limit, searchTerm);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to delete schema');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    if (!status) return 'secondary';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'active') return 'success';
    if (lowerStatus === 'inactive') return 'danger';
    if (lowerStatus === 'draft') return 'warning';
    if (lowerStatus === 'completed') return 'info';
    return 'secondary';
  };

  // Get scheme type badge color
  const getTypeBadgeColor = (type) => {
    if (!type) return 'secondary';
    const lowerType = type.toLowerCase();
    if (lowerType === 'volume') return 'primary';
    if (lowerType === 'model') return 'info';
    if (lowerType === 'accessories') return 'warning';
    return 'secondary';
  };

  // Render slab details as proper text
  const renderSlabDetails = (schema) => {
    let slabTexts = [];

    if (schema.scheme_type === 'VOLUME' && schema.volume_slabs) {
      slabTexts = schema.volume_slabs.map((slab) => 
        `${slab.no}+ units: ${formatCurrency(slab.amount)}`
      );
      return slabTexts.length > 0 ? slabTexts.join(' | ') : 'No slabs defined';
    }

    if (schema.scheme_type === 'ACCESSORIES' && schema.accessory_slabs) {
      slabTexts = schema.accessory_slabs.map((slab) => 
        `Amount ${formatCurrency(slab.amount)}: Incentive ${formatCurrency(slab.incentive_amount)}`
      );
      return slabTexts.length > 0 ? slabTexts.join(' | ') : 'No slabs defined';
    }

    if (schema.scheme_type === 'MODEL' && schema.model_slabs) {
      slabTexts = schema.model_slabs.map((modelSlab) => {
        const modelName = modelSlab.model_id?.display_name || 
                         modelSlab.model_id?.model_name || 
                         'Model';
        const slabStr = modelSlab.slabs?.map(s => 
          `${s.no}+ units: ${formatCurrency(s.amount)}`
        ).join(', ');
        return `${modelName}: ${slabStr}`;
      });
      return slabTexts.length > 0 ? slabTexts.join(' | ') : 'No slabs defined';
    }

    return 'No slabs defined';
  };

  // Get slab count
  const getSlabCount = (schema) => {
    if (schema.scheme_type === 'VOLUME' && schema.volume_slabs) {
      return schema.volume_slabs.length;
    }
    if (schema.scheme_type === 'ACCESSORIES' && schema.accessory_slabs) {
      return schema.accessory_slabs.length;
    }
    if (schema.scheme_type === 'MODEL' && schema.model_slabs) {
      return schema.model_slabs.length;
    }
    return 0;
  };

  // Calculate displayed pages
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  
  if (pagination.page <= 3) {
    endPage = Math.min(5, pagination.totalPages);
  }
  if (pagination.page >= pagination.totalPages - 2) {
    startPage = Math.max(1, pagination.totalPages - 4);
  }
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) {
    displayedPages.push(i);
  }

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  if (loading && schemas.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="title">Schemas / Master Data</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <CButton
              size="sm"
              className="action-btn me-1"
              onClick={handleOpenCreateModal}
            >
              <CIcon icon={cilPlus} className="icon" /> New Schema
            </CButton>

            <CButton
              size="sm"
              className="action-btn me-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <CIcon icon={cilSearch} className="icon" /> Filter
            </CButton>

            {isFilterApplied && (
              <CButton
                size="sm"
                className="action-btn me-1"
                onClick={clearFilter}
              >
                <CIcon icon={cilZoomOut} className="icon" /> Clear Filters
              </CButton>
            )}
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Search and Rows per page */}
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <div className="d-flex align-items-center">
              <CFormLabel className="mb-0 me-2">Rows per page:</CFormLabel>
              <CFormSelect
                value={pagination.limit}
                onChange={(e) => handleLimitChange(e.target.value)}
                style={{ width: '80px' }}
                size="sm"
              >
                {PAGE_SIZE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </CFormSelect>
            </div>
            <div className="d-flex align-items-center">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, type..."
                style={{ width: '280px' }}
              />
            </div>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          {/* Table */}
          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '60px' }}>#</CTableHeaderCell>
                  <CTableHeaderCell>Schema Name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Period</CTableHeaderCell>
                  <CTableHeaderCell>Slabs</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '120px' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {schemas.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No schemas available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  schemas.map((schema, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    const slabCount = getSlabCount(schema);
                    return (
                      <CTableRow key={schema._id}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>
                          <strong>{schema.scheme_name}</strong>
                          <div className="text-muted small">
                            Created: {formatDate(schema.createdAt)}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getTypeBadgeColor(schema.scheme_type)}>
                            {schema.scheme_type || 'N/A'}
                          </CBadge>
                          <div className="text-muted small">
                            {slabCount} slab{slabCount !== 1 ? 's' : ''}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-column">
                            <span className="small">
                              <CIcon icon={cilCalendar} className="me-1" size="sm" />
                              From: {formatDateFull(schema.start_date)}
                            </span>
                            <span className="small">
                              <CIcon icon={cilCalendar} className="me-1" size="sm" />
                              To: {formatDateFull(schema.end_date)}
                            </span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div 
                            className="text-wrap" 
                            style={{ 
                              maxWidth: '300px', 
                              fontSize: '13px',
                              wordBreak: 'break-word'
                            }}
                          >
                            {renderSlabDetails(schema)}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadgeColor(schema.status)}>
                            {schema.status || 'Unknown'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={(event) => handleClickMenu(event, schema._id)}
                          >
                            <CIcon icon={cilOptions} /> Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${schema._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === schema._id} 
                            onClose={handleCloseMenu}
                          >
                            <MenuItem onClick={() => handleViewSchema(schema)}>
                              <CIcon icon={cilInfo} className="me-2" /> View Details
                            </MenuItem>
                            <MenuItem onClick={() => handleOpenEditModal(schema)}>
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteSchema(schema)}>
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

          {/* Pagination */}
          {pagination.totalCount > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} records`}
                </span>
              </div>

              {pagination.totalPages > 1 && (
                <CPagination align="center" aria-label="Page navigation">
                  <CPaginationItem
                    aria-label="Previous"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                  >
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>

                  {pagination.page > 3 && pagination.totalPages > 5 && (
                    <>
                      <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>
                        1
                      </CPaginationItem>
                      {pagination.page > 4 && <CPaginationItem disabled>...</CPaginationItem>}
                    </>
                  )}

                  {displayedPages.map(page => (
                    <CPaginationItem
                      key={page}
                      onClick={() => handlePageChange(page)}
                      active={pagination.page === page}
                      disabled={loading}
                    >
                      {page}
                    </CPaginationItem>
                  ))}

                  {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
                      <CPaginationItem 
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={loading}
                      >
                        {pagination.totalPages}
                      </CPaginationItem>
                    </>
                  )}

                  <CPaginationItem
                    aria-label="Next"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                  >
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Add/Edit Schema Modal */}
      <AddSchemaModal
        visible={schemaModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={editingSchema}
      />

      {/* Filter Modal */}
      <CModal visible={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Filter Schemas</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Status:</label>
            <CFormSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">-- All Status --</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Scheme Type:</label>
            <CFormSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- All Types --</option>
              <option value="VOLUME">Volume</option>
              <option value="MODEL">Model</option>
              <option value="ACCESSORIES">Accessories</option>
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setFilterModalOpen(false)}>
            Cancel
          </CButton>
          <CButton className="submit-button" onClick={applyFilter}>
            Apply Filters
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Schema Modal */}
      <CModal visible={viewModalOpen} onClose={() => setViewModalOpen(false)} size="lg" scrollable>
        <CModalHeader>
          <CModalTitle>Schema Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedSchema && (
            <>
              {/* Basic Information */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Basic Information</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Schema Name</small>
                  <div><strong>{selectedSchema.scheme_name}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Type</small>
                  <div>
                    <CBadge color={getTypeBadgeColor(selectedSchema.scheme_type)}>
                      {selectedSchema.scheme_type}
                    </CBadge>
                  </div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Status</small>
                  <div>
                    <CBadge color={getStatusBadgeColor(selectedSchema.status)}>
                      {selectedSchema.status}
                    </CBadge>
                  </div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Created By</small>
                  <div><strong>{selectedSchema.created_by?.name || 'Unknown'}</strong></div>
                </CCol>
              </CRow>

              {/* Validity Period */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Validity Period</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Start Date</small>
                  <div><strong>{formatDateFull(selectedSchema.start_date)}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">End Date</small>
                  <div><strong>{formatDateFull(selectedSchema.end_date)}</strong></div>
                </CCol>
              </CRow>

              {/* Slabs Details */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Slabs Details</h6>
              </div>
              
              {selectedSchema.scheme_type === 'VOLUME' && selectedSchema.volume_slabs && (
                <CTable bordered size="sm" className="mb-3">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Min Units</CTableHeaderCell>
                      <CTableHeaderCell>Incentive Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedSchema.volume_slabs.map((slab, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>{slab.no}+</CTableDataCell>
                        <CTableDataCell>{formatCurrency(slab.amount)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {selectedSchema.scheme_type === 'ACCESSORIES' && selectedSchema.accessory_slabs && (
                <CTable bordered size="sm" className="mb-3">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell>Incentive Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedSchema.accessory_slabs.map((slab, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(slab.amount)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(slab.incentive_amount)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {selectedSchema.scheme_type === 'MODEL' && selectedSchema.model_slabs && (
                <>
                  {selectedSchema.model_slabs.map((modelSlab, modelIdx) => (
                    <div key={modelIdx} className="mb-3">
                      <div className="fw-bold mb-2">
                        Model: {modelSlab.model_id?.display_name || modelSlab.model_id?.model_name || 'N/A'}
                      </div>
                      <CTable bordered size="sm">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>#</CTableHeaderCell>
                            <CTableHeaderCell>Min Units</CTableHeaderCell>
                            <CTableHeaderCell>Incentive Amount</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {modelSlab.slabs?.map((slab, slabIdx) => (
                            <CTableRow key={slabIdx}>
                              <CTableDataCell>{slabIdx + 1}</CTableDataCell>
                              <CTableDataCell>{slab.no}+</CTableDataCell>
                              <CTableDataCell>{formatCurrency(slab.amount)}</CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </div>
                  ))}
                </>
              )}

              {/* Additional Information */}
              <div className="border-bottom pb-2 mb-3">
                <h6>Additional Information</h6>
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Created At</small>
                  <div><strong>{new Date(selectedSchema.createdAt).toLocaleString()}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Last Updated</small>
                  <div><strong>{new Date(selectedSchema.updatedAt).toLocaleString()}</strong></div>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger">
            <CIcon icon={cilWarning} className="me-2" />
            Are you sure you want to delete the schema "{schemaToDelete?.scheme_name}"?
          </CAlert>
          <p className="text-muted">This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
            Cancel
          </CButton>
          <CButton 
            color="danger" 
            onClick={confirmDeleteSchema}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Schema'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default SchemaList;