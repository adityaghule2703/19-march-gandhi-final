import '../../css/table.css';
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
} from '../../utils/tableImports';
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
} from '../../utils/modulePermissions';
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
  CFormSelect,
  CAlert,
  CFormTextarea,
  CForm,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilTrash, 
  cilCheckCircle, 
  cilXCircle,
  cilCloudDownload,
  cilChevronLeft,
  cilChevronRight,
  cilCheck,
  cilX,
  cilZoomOut,
  cilPencil,
  cilInfo,
  cilWarning,
  cilThumbUp,
  cilThumbDown,
  cilSearch,
  cilSave
} from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';

// Constants
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const AdvantageTVSVehicles = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  // Server-side pagination state
  const [vehicleData, setVehicleData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCount, setFilteredCount] = useState(0);
  
  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Action Modal States
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [actionVehicle, setActionVehicle] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionModalLoading, setActionModalLoading] = useState(false);

  // Edit Modal States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editFormData, setEditFormData] = useState({
    modelName: '',
    modelId: '',
    colorName: '',
    type: 'ICE',
    unloadLocation: '',
    engineNumber: '',
    batteryNumber: '',
    keyNumber: '',
    noOfDaysInStockDLR: 0,
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  
  // Branches state for dropdown
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  
  const { permissions } = useAuth();
  
  // ========== PAGE-LEVEL PERMISSION CHECKS USING PURCHASE MODULE ==========
  const hasAdvantageTVSView = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.VIEW
  );
  
  const hasAdvantageTVSCreate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.CREATE
  );
  
  const hasAdvantageTVSUpdate = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.UPDATE
  );
  
  const hasAdvantageTVSDelete = hasSafePagePermission(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.INWARD_STOCK, 
    ACTIONS.DELETE
  );

  // Using convenience functions for cleaner code
  const canViewAdvantageTVS = canViewPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canCreateAdvantageTVS = canCreateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canUpdateAdvantageTVS = canUpdateInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);
  const canDeleteAdvantageTVS = canDeleteInPage(permissions, MODULES.PURCHASE, PAGES.PURCHASE.INWARD_STOCK);

  useEffect(() => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to view Advantage TVS Vehicles');
      return;
    }
    fetchData(1, limit, '');
    fetchBranches();
  }, [canViewAdvantageTVS]);

  // Fetch branches for dropdown
  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      const response = await axiosInstance.get('/branches');
      if (response.data && response.data.data) {
        setBranches(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setBranchesLoading(false);
    }
  };

  // Fetch data with server-side pagination and search
  const fetchData = async (page = 1, pageLimit = DEFAULT_LIMIT, search = '') => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to view Advantage TVS Vehicles');
      return;
    }
    
    try {
      setLoading(true);
      const params = { page, limit: pageLimit };
      if (search) params.search = search;
      
      const response = await axiosInstance.get('/advantage-approval/pending', { params });
      
      let docs = [];
      let totalCount = 0;
      let totalPages = 1;
      
      if (response.data) {
        docs = response.data.data?.vehicles || response.data.data || [];
        totalCount = response.data.total || response.data.results || docs.length;
        totalPages = response.data.totalPages || Math.ceil(totalCount / pageLimit);
        
        // Handle different response structures
        if (response.data.pagination) {
          totalCount = response.data.pagination.total || docs.length;
          totalPages = response.data.pagination.totalPages || 1;
        }
      }
      
      setVehicleData(docs);
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
      setVehicleData([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to search Advantage TVS Vehicles');
      return;
    }
    
    setSearchTerm(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchData(1, limit, value);
    }, 400);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (!canViewAdvantageTVS) return;
    if (newPage < 1 || newPage > pages) return;
    fetchData(newPage, limit, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    if (!canViewAdvantageTVS) return;
    const newLimitValue = parseInt(newLimit, 10);
    fetchData(1, newLimitValue, searchQuery);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  // Handle view vehicle details - opens modal
  const handleViewVehicle = (vehicle, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!canViewAdvantageTVS) {
      showError('You do not have permission to view vehicle details');
      return;
    }
    setSelectedVehicle(vehicle);
    setViewModalVisible(true);
  };

  // Open action modal for approve/reject
  const openActionModal = (vehicle, type, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (type === 'approve' && !canUpdateAdvantageTVS) {
      showError('You do not have permission to approve vehicles');
      return;
    }
    
    if (type === 'reject' && !canUpdateAdvantageTVS) {
      showError('You do not have permission to reject vehicles');
      return;
    }
    
    setActionVehicle(vehicle);
    setActionType(type);
    setActionNotes('');
    setRejectionReason('');
    setActionModalVisible(true);
  };

  // Handle approve vehicle from modal
  const handleApproveFromModal = async () => {
    if (!actionVehicle) return;
    
    try {
      setActionModalLoading(true);
      const chassisNumber = actionVehicle.stockData?.chassisNumber || actionVehicle.chassisNumber;
      
      await axiosInstance.post(`/advantage-approval/approve/${chassisNumber}`, {
        notes: actionNotes || 'Approved'
      });
      
      showSuccess('Vehicle approved successfully!');
      setActionModalVisible(false);
      setActionVehicle(null);
      setActionType(null);
      fetchData(currentPage, limit, searchQuery);
    } catch (error) {
      console.error('Error approving vehicle:', error);
      showError(error.response?.data?.message || 'Failed to approve vehicle');
    } finally {
      setActionModalLoading(false);
    }
  };

  // Handle reject vehicle from modal
  const handleRejectFromModal = async () => {
    if (!actionVehicle) return;
    
    if (!rejectionReason.trim()) {
      showError('Please provide a rejection reason');
      return;
    }
    
    try {
      setActionModalLoading(true);
      const chassisNumber = actionVehicle.stockData?.chassisNumber || actionVehicle.chassisNumber;
      
      await axiosInstance.post(`/advantage-approval/reject/${chassisNumber}`, {
        rejectionReason: rejectionReason,
        notes: actionNotes || 'Rejected'
      });
      
      showSuccess('Vehicle rejected successfully!');
      setActionModalVisible(false);
      setActionVehicle(null);
      setActionType(null);
      fetchData(currentPage, limit, searchQuery);
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
      showError(error.response?.data?.message || 'Failed to reject vehicle');
    } finally {
      setActionModalLoading(false);
    }
  };

  // ========== EDIT FUNCTIONS ==========
  
  // Open edit modal
  const openEditModal = (vehicle, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!canUpdateAdvantageTVS) {
      showError('You do not have permission to edit vehicles');
      return;
    }
    
    // Get chassis number
    const chassisNumber = vehicle.stockData?.chassisNumber || vehicle.chassisNumber;
    if (!chassisNumber) {
      showError('Vehicle chassis number not found');
      return;
    }
    
    // Populate form data from approvalPreview object
    const preview = vehicle.approvalPreview || {};
    const modelInfo = preview.model || {};
    const colorInfo = preview.color || {};
    const branchInfo = preview.branch || {};
    const vehicleData = preview.vehicleData || {};
    const stockData = vehicle.stockData || {};
    
    setEditVehicle(vehicle);
    setEditFormData({
      modelName: modelInfo.name || vehicleData.modelName || stockData.vehicleModel || '',
      modelId: modelInfo.id || '',
      colorName: colorInfo.name || colorInfo.suggestedName || vehicleData.colorName || stockData.vehicleColor || '',
      type: modelInfo.type || vehicleData.type || 'ICE',
      unloadLocation: branchInfo.id || branchInfo.name || stockData.location || '',
      engineNumber: vehicleData.engineNumber || stockData.engineNo || '',
      batteryNumber: vehicleData.batteryNumber || '',
      keyNumber: vehicleData.keyNumber || '',
      noOfDaysInStockDLR: vehicleData.noOfDaysInStockDLR || 0,
      notes: vehicleData.notes || ''
    });
    setEditError(null);
    setEditModalVisible(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit form submit
  const handleEditSubmit = async () => {
    if (!editVehicle) return;
    
    // Validation
    if (!editFormData.modelName.trim()) {
      setEditError('Model Name is required');
      return;
    }
    
    const chassisNumber = editVehicle.stockData?.chassisNumber || editVehicle.chassisNumber;
    if (!chassisNumber) {
      setEditError('Chassis number not found');
      return;
    }
    
    try {
      setEditLoading(true);
      setEditError(null);
      
      // Prepare payload
      const payload = {
        modelName: editFormData.modelName,
        model: editFormData.modelId || '',
        color: {
          name: editFormData.colorName
        },
        type: editFormData.type,
        unloadLocation: editFormData.unloadLocation,
        engineNumber: editFormData.engineNumber,
        batteryNumber: editFormData.batteryNumber,
        keyNumber: editFormData.keyNumber,
        noOfDaysInStockDLR: Number(editFormData.noOfDaysInStockDLR) || 0,
        notes: editFormData.notes
      };
      
      // Make API call
      await axiosInstance.post(`/approvals/edit-and-save/${chassisNumber}`, payload);
      
      showSuccess('Vehicle updated successfully!');
      setEditModalVisible(false);
      setEditVehicle(null);
      fetchData(currentPage, limit, searchQuery);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update vehicle';
      setEditError(errorMsg);
      showError(errorMsg);
    } finally {
      setEditLoading(false);
    }
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

  if (!canViewAdvantageTVS) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Advantage TVS Vehicles.
      </div>
    );
  }

  if (loading && !vehicleData.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Advantage TVS Vehicles - Pending Approval</div>
      
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
            <CBadge color="warning" className="me-2">
              Status: Pending
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
                placeholder="Search by chassis, model, branch..."
              />
            </div>
          </div>
          
          {loading && vehicleData.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: loading && vehicleData.length > 0 ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Chassis #</CTableHeaderCell>
                  <CTableHeaderCell>Engine #</CTableHeaderCell>
                  <CTableHeaderCell>DMS Model</CTableHeaderCell>
                  <CTableHeaderCell>DMS Color</CTableHeaderCell>
                  <CTableHeaderCell>MIS Model</CTableHeaderCell>
                  <CTableHeaderCell>MIS Color</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Approval Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vehicleData.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
                      {searchQuery ? `No results found for "${searchQuery}"` : 'No pending vehicles available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  vehicleData.map((item, index) => {
                    const startRecord = (currentPage - 1) * limit + 1;
                    // Extract stockData properly
                    const vehicle = item.stockData || item;
                    const preview = item.approvalPreview || {};
                    // This "pending" endpoint only ever returns pending items,
                    // so default to 'pending' unless the API explicitly says otherwise.
                    const approvalStatus = item.approvalStatus || vehicle.approvalStatus || 'pending';
                    const chassisNumber = vehicle.chassisNumber || item.chassisNumber;
                    
                    return (
                      <CTableRow key={vehicle.chassisNumber || index}>
                        <CTableDataCell>{startRecord + index}</CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          <CBadge color="primary">
                            {chassisNumber || 'N/A'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {vehicle.engineNo || vehicle.engineNumber || 'N/A'}
                        </CTableDataCell>
                        {/* DMS Model - from stockData */}
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {vehicle.vehicleModel || 'N/A'}
                        </CTableDataCell>
                        {/* DMS Color - from stockData */}
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {vehicle.vehicleColor || 'N/A'}
                        </CTableDataCell>
                        {/* MIS Model - from approvalPreview.model */}
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {preview.model?.name || preview.model?.suggestedName || 'N/A'}
                        </CTableDataCell>
                        {/* MIS Color - from approvalPreview.color */}
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {preview.color?.name || preview.color?.suggestedName || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {vehicle.branch || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>
                          {vehicle.location || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={approvalStatus === 'pending' ? 'warning' : 'success'}>
                            {approvalStatus || 'PENDING'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1 flex-wrap">
                            <CButton
                              color="info"
                              size="sm"
                              onClick={(e) => handleViewVehicle(item, e)}
                              disabled={!canViewAdvantageTVS}
                              className="px-2 py-1"
                              title="View Vehicle Details"
                            >
                              <CIcon icon={cilSearch} size="sm" />
                            </CButton>
                            {/* EDIT BUTTON - Added here */}
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={(e) => openEditModal(item, e)}
                              disabled={!canUpdateAdvantageTVS}
                              className="px-2 py-1"
                              title="Edit Vehicle"
                            >
                              <CIcon icon={cilPencil} size="sm" />
                            </CButton>
                            <CButton
                              color="success"
                              size="sm"
                              onClick={(e) => openActionModal(item, 'approve', e)}
                              disabled={!canUpdateAdvantageTVS || actionLoadingId === chassisNumber}
                              className="px-2 py-1"
                              title="Approve Vehicle"
                            >
                              <CIcon icon={cilThumbUp} size="sm" />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={(e) => openActionModal(item, 'reject', e)}
                              disabled={!canUpdateAdvantageTVS || actionLoadingId === chassisNumber}
                              className="px-2 py-1"
                              title="Reject Vehicle"
                            >
                              <CIcon icon={cilThumbDown} size="sm" />
                            </CButton>
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

      {/* Action Modal - Approve/Reject */}
      <CModal 
        visible={actionModalVisible} 
        onClose={() => {
          setActionModalVisible(false);
          setActionVehicle(null);
          setActionType(null);
          setActionNotes('');
          setRejectionReason('');
        }}
        size="md"
      >
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center">
            <CIcon 
              icon={actionType === 'approve' ? cilThumbUp : cilThumbDown} 
              className={`me-2 ${actionType === 'approve' ? 'text-success' : 'text-danger'}`} 
            />
            {actionType === 'approve' ? 'Approve Vehicle' : 'Reject Vehicle'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {actionVehicle && (
            <div>
              {/* Vehicle Summary */}
              <div className="card border-0 bg-light mb-3">
                <div className="card-body">
                  <h6 className="card-title mb-3">Vehicle Details</h6>
                  <div className="row">
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Chassis Number</label>
                      <p className="mb-1 fw-bold">
                        {actionVehicle.stockData?.chassisNumber || actionVehicle.chassisNumber || 'N/A'}
                      </p>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Vehicle Model</label>
                      <p className="mb-1">{actionVehicle.stockData?.vehicleModel || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Vehicle Color</label>
                      <p className="mb-1">{actionVehicle.stockData?.vehicleColor || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small fw-bold">Branch</label>
                      <p className="mb-1">{actionVehicle.stockData?.branch || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Form */}
              {actionType === 'reject' && (
                <div className="mb-3">
                  <CFormLabel className="fw-bold">
                    Rejection Reason <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mb-2"
                  >
                    <option value="">Select rejection reason...</option>
                    <option value="Missing required documents">Missing required documents</option>
                    <option value="Invalid vehicle details">Invalid vehicle details</option>
                    <option value="Duplicate entry">Duplicate entry</option>
                    <option value="Customer requested cancellation">Customer requested cancellation</option>
                    <option value="Model/Color mismatch">Model/Color mismatch</option>
                    <option value="Incomplete information">Incomplete information</option>
                    <option value="Other">Other</option>
                  </CFormSelect>
                  {!rejectionReason && (
                    <div className="text-danger small">Please select a rejection reason</div>
                  )}
                </div>
              )}

              <div className="mb-3">
                <CFormLabel className="fw-bold">
                  {actionType === 'approve' ? 'Approval Notes' : 'Additional Notes'}
                </CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={actionType === 'approve' 
                    ? 'Add notes for approval (optional)' 
                    : 'Add additional notes for rejection (optional)'
                  }
                  className="form-control"
                />
                <div className="text-muted small mt-1">
                  {actionType === 'approve' ? 'Example: "Approved - existing model and color"' : 'Additional context for rejection'}
                </div>
              </div>

              {/* Warning/Info Alert */}
              {actionType === 'approve' && (
                <CAlert color="info" className="mt-3">
                  <CIcon icon={cilInfo} className="me-2" />
                  <span>
                    <strong>Approve:</strong> This will create the vehicle in the system. 
                    {actionVehicle.approvalPreview?.model?.found === false && ' New model will be created.'}
                    {actionVehicle.approvalPreview?.color?.found === false && ' New color will be created.'}
                    {actionVehicle.approvalPreview?.branch?.found === false && ' New branch assignment will be created.'}
                  </span>
                </CAlert>
              )}

              {actionType === 'reject' && (
                <CAlert color="warning" className="mt-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  <span>
                    <strong>Reject:</strong> This will reject the vehicle and it will not be added to the system.
                    The vehicle record will be marked as rejected.
                  </span>
                </CAlert>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setActionModalVisible(false);
              setActionVehicle(null);
              setActionType(null);
              setActionNotes('');
              setRejectionReason('');
            }}
            disabled={actionModalLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color={actionType === 'approve' ? 'success' : 'danger'}
            onClick={actionType === 'approve' ? handleApproveFromModal : handleRejectFromModal}
            disabled={actionModalLoading || (actionType === 'reject' && !rejectionReason.trim())}
          >
            {actionModalLoading ? (
              <><CSpinner size="sm" className="me-2" /> Processing...</>
            ) : (
              <><CIcon icon={actionType === 'approve' ? cilCheck : cilX} className="me-1" /> 
              {actionType === 'approve' ? 'Approve' : 'Reject'}
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ========== EDIT MODAL ========== */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => {
          setEditModalVisible(false);
          setEditVehicle(null);
          setEditError(null);
        }}
        size="lg"
        scrollable
      >
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilPencil} className="me-2 text-warning" />
            Edit Vehicle Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editVehicle && (
            <div>
              {/* Vehicle Info Banner */}
              <div className="alert alert-info d-flex align-items-center mb-4">
                <CIcon icon={cilInfo} className="me-2" />
                <span>
                  <strong>Editing:</strong> Chassis #{editVehicle.stockData?.chassisNumber || editVehicle.chassisNumber || 'N/A'}
                </span>
              </div>

              {editError && (
                <CAlert color="danger" className="mb-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  {editError}
                </CAlert>
              )}

              <CForm>
                {/* Hidden fields for modelName and modelId - passed in payload but not shown in UI */}
                <input type="hidden" name="modelName" value={editFormData.modelName} />
                <input type="hidden" name="modelId" value={editFormData.modelId} />

                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Color Name</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.colorName}
                      onChange={(e) => handleEditInputChange('colorName', e.target.value)}
                      placeholder="Enter color name"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Vehicle Type</CFormLabel>
                    <CFormSelect
                      value={editFormData.type}
                      onChange={(e) => handleEditInputChange('type', e.target.value)}
                    >
                      <option value="ICE">ICE</option>
                      <option value="EV">EV</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="12">
                    <CFormLabel className="fw-bold">Unload Location / Branch</CFormLabel>
                    <CFormSelect
                      value={editFormData.unloadLocation}
                      onChange={(e) => handleEditInputChange('unloadLocation', e.target.value)}
                      disabled={branchesLoading}
                    >
                      <option value="">Select a branch...</option>
                      {branches.map((branch) => (
                        <option key={branch._id || branch.id} value={branch._id || branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </CFormSelect>
                    {branchesLoading && (
                      <div className="text-muted small mt-1">
                        <CSpinner size="sm" className="me-1" /> Loading branches...
                      </div>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Engine Number</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.engineNumber}
                      onChange={(e) => handleEditInputChange('engineNumber', e.target.value)}
                      placeholder="Enter engine number"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Battery Number</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.batteryNumber}
                      onChange={(e) => handleEditInputChange('batteryNumber', e.target.value)}
                      placeholder="Enter battery number"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Key Number</CFormLabel>
                    <CFormInput
                      type="text"
                      value={editFormData.keyNumber}
                      onChange={(e) => handleEditInputChange('keyNumber', e.target.value)}
                      placeholder="Enter key number"
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel className="fw-bold">Days in Stock DLR</CFormLabel>
                    <CFormInput
                      type="number"
                      value={editFormData.noOfDaysInStockDLR}
                      onChange={(e) => handleEditInputChange('noOfDaysInStockDLR', e.target.value)}
                      placeholder="Enter days in stock"
                      min="0"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="12">
                    <CFormLabel className="fw-bold">Notes</CFormLabel>
                    <CFormTextarea
                      rows={3}
                      value={editFormData.notes}
                      onChange={(e) => handleEditInputChange('notes', e.target.value)}
                      placeholder="Enter any additional notes"
                    />
                  </CCol>
                </CRow>

                {/* Preview of what will be updated */}
                <CAlert color="secondary" className="mt-3">
                  <h6 className="mb-2">
                    <CIcon icon={cilInfo} className="me-2" />
                    Summary of Changes
                  </h6>
                  <div className="small">
                    <p className="mb-1"><strong>Color:</strong> {editFormData.colorName || '(empty)'}</p>
                    <p className="mb-1"><strong>Type:</strong> {editFormData.type}</p>
                    <p className="mb-1"><strong>Branch:</strong> {
                      branches.find(b => (b._id || b.id) === editFormData.unloadLocation)?.name || 
                      editFormData.unloadLocation || 
                      '(not selected)'
                    }</p>
                    <p className="mb-0"><strong>Engine:</strong> {editFormData.engineNumber || '(empty)'}</p>
                  </div>
                </CAlert>
              </CForm>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setEditModalVisible(false);
              setEditVehicle(null);
              setEditError(null);
            }}
            disabled={editLoading}
          >
            Cancel
          </CButton>
          <CButton 
            color="warning" 
            onClick={handleEditSubmit}
            disabled={editLoading || !editFormData.modelName.trim()}
          >
            {editLoading ? (
              <><CSpinner size="sm" className="me-2" /> Saving...</>
            ) : (
              <><CIcon icon={cilSave} className="me-1" /> Save Changes</>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Vehicle Modal - Beautiful Design */}
      <CModal 
        visible={viewModalVisible} 
        onClose={() => {
          setViewModalVisible(false);
          setSelectedVehicle(null);
        }}
        size="lg"
        scrollable
      >
        <CModalHeader className="border-bottom-0">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilInfo} className="me-2 text-primary" />
            Vehicle Preview After Approval
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-0">
          {selectedVehicle && (
            <div className="vehicle-details">
              {(() => {
                // IMPORTANT: These keys match the ACTUAL API response shape:
                // item.approvalPreview.{model,color,branch,vehicleData}, item.summary
                const preview = selectedVehicle.approvalPreview || {};
                const stockData = selectedVehicle.stockData || {};
                const approvalInfo = selectedVehicle.summary || {};

                const vehiclePreviewData = preview.vehicleData || {};
                const modelInfo = preview.model || {};
                const colorInfo = preview.color || {};
                const branchInfo = preview.branch || {};

                return (
                  <>
                    {/* Status Banner */}
                    <div className="alert alert-info d-flex align-items-center mb-4">
                      <CIcon icon={cilCheck} className="me-2" />
                      <span>
                        <strong>Preview:</strong> This is how the vehicle will appear in the system after approval.
                        {modelInfo.found && colorInfo.found && ' All matches found!'}
                      </span>
                    </div>

                    {/* Vehicle Preview Card */}
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                          <CIcon icon={cilCheckCircle} className="me-2" />
                          Vehicle Preview
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Chassis Number</label>
                              <p className="fw-bold mb-0">{vehiclePreviewData.chassisNumber || stockData.chassisNumber || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Engine Number</label>
                              <p className="mb-0">{vehiclePreviewData.engineNumber || stockData.engineNo || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Model Name</label>
                              <p className="mb-0">{vehiclePreviewData.modelName || stockData.vehicleModel || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Type</label>
                              <p className="mb-0">
                                <CBadge color={vehiclePreviewData.type === 'EV' ? 'success' : 'primary'}>
                                  {vehiclePreviewData.type || 'N/A'}
                                </CBadge>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Color</label>
                              <p className="mb-0">{vehiclePreviewData.colorName || stockData.vehicleColor || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Location Type</label>
                              <p className="mb-0">
                                <CBadge color="secondary">
                                  {vehiclePreviewData.locationType || 'N/A'}
                                </CBadge>
                              </p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small fw-bold">Status</label>
                              <p className="mb-0">
                                <CBadge color={vehiclePreviewData.status === 'in_stock' ? 'success' : 'warning'}>
                                  {vehiclePreviewData.status || 'N/A'}
                                </CBadge>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Status Cards */}
                    <div className="row g-3 mb-4">
                      {/* Model Match Card */}
                      <div className="col-md-4">
                        <div className={`card border-0 shadow-sm h-100 ${modelInfo.found ? 'border-success border-2' : 'border-danger border-2'}`}>
                          <div className="card-body text-center">
                            <CIcon icon={modelInfo.found ? cilCheckCircle : cilXCircle} 
                              size="2xl" 
                              className={`mb-2 ${modelInfo.found ? 'text-success' : 'text-danger'}`} 
                            />
                            <h6 className="fw-bold">Model Match</h6>
                            <CBadge color={modelInfo.found ? 'success' : 'danger'}>
                              {modelInfo.found ? 'Found ✓' : 'Will Be Created ✗'}
                            </CBadge>
                            {(modelInfo.name || modelInfo.suggestedName) && (
                              <p className="small text-muted mt-2 mb-0">{modelInfo.name || modelInfo.suggestedName}</p>
                            )}
                            {!modelInfo.found && modelInfo.action && (
                              <p className="small text-danger mt-1 mb-0">{modelInfo.action}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Color Match Card */}
                      <div className="col-md-4">
                        <div className={`card border-0 shadow-sm h-100 ${colorInfo.found ? 'border-success border-2' : 'border-danger border-2'}`}>
                          <div className="card-body text-center">
                            <CIcon icon={colorInfo.found ? cilCheckCircle : cilXCircle} 
                              size="2xl" 
                              className={`mb-2 ${colorInfo.found ? 'text-success' : 'text-danger'}`} 
                            />
                            <h6 className="fw-bold">Color Match</h6>
                            <CBadge color={colorInfo.found ? 'success' : 'danger'}>
                              {colorInfo.found ? 'Found ✓' : 'Will Be Created ✗'}
                            </CBadge>
                            {(colorInfo.name || colorInfo.suggestedName) && (
                              <p className="small text-muted mt-2 mb-0">{colorInfo.name || colorInfo.suggestedName}</p>
                            )}
                            {!colorInfo.found && colorInfo.action && (
                              <p className="small text-danger mt-1 mb-0">{colorInfo.action}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Branch Match Card */}
                      <div className="col-md-4">
                        <div className={`card border-0 shadow-sm h-100 ${branchInfo.found ? 'border-success border-2' : 'border-warning border-2'}`}>
                          <div className="card-body text-center">
                            <CIcon icon={branchInfo.found ? cilCheckCircle : cilWarning} 
                              size="2xl" 
                              className={`mb-2 ${branchInfo.found ? 'text-success' : 'text-warning'}`} 
                            />
                            <h6 className="fw-bold">Branch Match</h6>
                            <CBadge color={branchInfo.found ? 'success' : 'warning'}>
                              {branchInfo.found ? 'Found ✓' : 'Will Need Create'}
                            </CBadge>
                            {(branchInfo.name || branchInfo.suggestedName) && (
                              <p className="small text-muted mt-2 mb-0">{branchInfo.name || branchInfo.suggestedName}</p>
                            )}
                            {!branchInfo.found && (
                              <p className="small text-warning mt-1 mb-0">{branchInfo.action || 'New branch will be created'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Approval Summary */}
                    {approvalInfo && Object.keys(approvalInfo).length > 0 && (
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <CIcon icon={cilInfo} className="me-2 text-primary" />
                            Approval Summary
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Model Action</label>
                              <p className="mb-2">{approvalInfo.modelAction || 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Color Action</label>
                              <p className="mb-2">{approvalInfo.colorAction || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Branch Action</label>
                              <p className="mb-2">{approvalInfo.branchAction || 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Overall Status</label>
                              <p className="mb-2">
                                <CBadge color={approvalInfo.overallStatus === 'Ready for approval' ? 'success' : 'secondary'}>
                                  {approvalInfo.overallStatus || 'N/A'}
                                </CBadge>
                              </p>
                            </div>
                          </div>

                          {(approvalInfo.willCreateModel || approvalInfo.willCreateColor || approvalInfo.needsBranchAssignment) && (
                            <div className="alert alert-warning mt-3 mb-0">
                              <h6 className="alert-heading">
                                <CIcon icon={cilWarning} className="me-2" />
                                Actions Required On Approval
                              </h6>
                              <ul className="mb-0 ps-3">
                                {approvalInfo.willCreateModel && <li>A new model will be created</li>}
                                {approvalInfo.willCreateColor && <li>A new color will be created</li>}
                                {approvalInfo.needsBranchAssignment && <li>This vehicle needs branch assignment</li>}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stock Data Reference */}
                    {stockData && Object.keys(stockData).length > 0 && (
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <CIcon icon={cilCloudDownload} className="me-2 text-secondary" />
                            Source Stock Data (From Excel)
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Chassis</label>
                              <p className="mb-2">{stockData.chassisNumber || 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Engine</label>
                              <p className="mb-2">{stockData.engineNo || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Vehicle Model</label>
                              <p className="mb-2">{stockData.vehicleModel || 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Vehicle Color</label>
                              <p className="mb-2">{stockData.vehicleColor || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Branch</label>
                              <p className="mb-2">{stockData.branch || 'N/A'}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Location</label>
                              <p className="mb-2">{stockData.location || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="row">
                           
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">TVS Invoice No</label>
                              <p className="mb-2">{stockData.tvsInvoiceNo || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">TVS Invoice Date</label>
                              <p className="mb-2">{formatDate(stockData.tvsInvoiceDate)}</p>
                            </div>
                            <div className="col-md-6">
                              <label className="text-muted small fw-bold">Series</label>
                              <p className="mb-2">{stockData.series || 'N/A'}</p>
                            </div>
                          </div>
                          {stockData.stockTransferNo && (
                            <div className="row">
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Stock Transfer No</label>
                                <p className="mb-2">{stockData.stockTransferNo}</p>
                              </div>
                              <div className="col-md-6">
                                <label className="text-muted small fw-bold">Stock Transfer Date</label>
                                <p className="mb-2">{formatDate(stockData.stockTransferDate)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Approve/Reject Buttons - Update to use new modal */}
                    {canUpdateAdvantageTVS && (
                      <div className="mt-4 d-flex gap-2 justify-content-end border-top pt-3">
                        <CButton 
                          color="success" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewModalVisible(false);
                            openActionModal(selectedVehicle, 'approve', e);
                          }}
                          disabled={actionLoadingId === (selectedVehicle._id || selectedVehicle.id)}
                          className="px-4"
                        >
                          <CIcon icon={cilCheck} className="me-1" /> Approve
                        </CButton>
                        <CButton 
                          color="danger" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewModalVisible(false);
                            openActionModal(selectedVehicle, 'reject', e);
                          }}
                          disabled={actionLoadingId === (selectedVehicle._id || selectedVehicle.id)}
                          className="px-4"
                        >
                          <CIcon icon={cilX} className="me-1" /> Reject
                        </CButton>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="secondary" onClick={() => {
            setViewModalVisible(false);
            setSelectedVehicle(null);
          }}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdvantageTVSVehicles;