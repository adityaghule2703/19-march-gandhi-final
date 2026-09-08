import React, { useState, useEffect } from 'react';
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
  cilSearch,
  cilChevronLeft,
  cilChevronRight,
  cilInfo,
  cilWarning,
  cilCheckCircle,
  cilXCircle,
  cilCloudDownload,
  cilLocationPin,
  cilCalendar,
  cilLayers,
  cilList,
  cilFile,
  cilTags,
  cilQrCode,
  cilZoomOut,
  cilPencil,
  cilThumbUp,
  cilThumbDown
} from '@coreui/icons';
import { showError, showSuccess, axiosInstance } from '../../utils/tableImports';
import { useAuth } from '../../context/AuthContext';
import {
  hasSafePagePermission,
  MODULES,
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage
} from '../../utils/modulePermissions';
import '../../css/table.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const MisOnlyVehicles = () => {
  const { permissions } = useAuth();

  // Permission checks
  const canViewMisOnly = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.INWARD_STOCK,
    ACTIONS.VIEW
  );

  const canUpdateMisOnly = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.INWARD_STOCK,
    ACTIONS.UPDATE
  );

  const canDeleteMisOnly = hasSafePagePermission(
    permissions,
    MODULES.PURCHASE,
    PAGES.PURCHASE.INWARD_STOCK,
    ACTIONS.DELETE
  );

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCount, setFilteredCount] = useState(0);

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    byType: {},
    byLocation: {},
    ageDistribution: {
      under10Days: 0,
      under30Days: 0,
      under60Days: 0,
      over60Days: 0
    },
    frozen: 0,
    withBooking: 0,
    gmApprovalRequired: 0
  });

  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Get base URL from axios instance or window location
  const getBaseUrl = () => {
    if (axiosInstance.defaults?.baseURL) {
      return axiosInstance.defaults.baseURL;
    }
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  };

  // Fetch data
  const fetchData = async (page = 1, pageLimit = DEFAULT_LIMIT, search = '') => {
    if (!canViewMisOnly) {
      showError('You do not have permission to view MIS Only vehicles');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = { page, limit: pageLimit };
      if (search) params.search = search;

      const response = await axiosInstance.get('/advantage-approval/mis-only', { params });

      if (response.data && response.data.status === 'success') {
        const data = response.data.data || {};
        const vehicles = data.vehicles || [];
        const stats = data.statistics || {};

        // Set total from response
        const totalCount = response.data.total || 0;
        const totalPages = response.data.totalPages || 1;

        setVehicleData(vehicles);
        setTotal(totalCount);
        setPages(totalPages);
        setCurrentPage(page);
        setLimit(pageLimit);
        setSearchQuery(search);
        setFilteredCount(vehicles.length);

        setStatistics({
          total: stats.total || 0,
          byType: stats.byType || {},
          byLocation: stats.byLocation || {},
          ageDistribution: stats.ageDistribution || {
            under10Days: 0,
            under30Days: 0,
            under60Days: 0,
            over60Days: 0
          },
          frozen: stats.frozen || 0,
          withBooking: stats.withBooking || 0,
          gmApprovalRequired: stats.gmApprovalRequired || 0
        });
      } else {
        setVehicleData([]);
        setTotal(0);
        setPages(1);
        if (response.data?.message) {
          console.warn(response.data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching MIS Only vehicles:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load MIS Only vehicles';
      setError(errorMsg);
      showError(errorMsg);
      setVehicleData([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchData(1, limit, value);
    }, 400);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (!canViewMisOnly) return;
    if (newPage < 1 || newPage > pages) return;
    fetchData(newPage, limit, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    if (!canViewMisOnly) return;
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

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (e) {
      return 'N/A';
    }
    return 'N/A';
  };

  // Get full QR code URL
  const getQrCodeUrl = (qrPath) => {
    if (!qrPath) return null;
    const cleanPath = qrPath.startsWith('/') ? qrPath : `/${qrPath}`;
    const baseUrl = getBaseUrl();
    return `${baseUrl}${cleanPath}`;
  };

  // Handle view vehicle details
  const handleViewVehicle = (vehicle, event) => {
    if (event) event.stopPropagation();

    if (!canViewMisOnly) {
      showError('You do not have permission to view vehicle details');
      return;
    }

    setViewLoading(true);
    setSelectedVehicle(vehicle);
    setViewModalVisible(true);
    setTimeout(() => setViewLoading(false), 300);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'booked': return 'warning';
      case 'sold': return 'info';
      case 'in_transit': return 'primary';
      case 'damaged': return 'danger';
      default: return 'secondary';
    }
  };

  // Get location type badge
  const getLocationBadge = (locationType) => {
    switch (locationType) {
      case 'branch': return <CBadge color="primary">Branch</CBadge>;
      case 'subdealer': return <CBadge color="info">Subdealer</CBadge>;
      case 'warehouse': return <CBadge color="secondary">Warehouse</CBadge>;
      default: return <CBadge color="secondary">{locationType || 'N/A'}</CBadge>;
    }
  };

  // Initial load
  useEffect(() => {
    if (!canViewMisOnly) {
      showError('You do not have permission to view MIS Only vehicles');
      setLoading(false);
      return;
    }
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewMisOnly]);

  if (!canViewMisOnly) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <CIcon icon={cilWarning} className="me-2" />
        You do not have permission to view MIS Only vehicles.
      </div>
    );
  }

  if (loading && !vehicleData.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
        <span className="ms-3 text-muted">Loading vehicles...</span>
      </div>
    );
  }

  if (error && !vehicleData.length) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <CIcon icon={cilWarning} className="me-2" />
        {error}
      </div>
    );
  }

  // Calculate pagination values
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(pages, currentPage + 2);
  if (currentPage <= 3) endPage = Math.min(5, pages);
  if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

  const pageNums = [];
  for (let i = startPage; i <= endPage; i++) pageNums.push(i);

  return (
    <div>
      <div className="title d-flex align-items-center gap-2">
        <CIcon icon={cilList} className="text-primary" />
        MIS Only Vehicles - In Stock (Not in DMS)
      </div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CBadge color="info" className="me-1">
              Total: {total || 0}
            </CBadge>
            {searchQuery && (
              <CBadge color="secondary">
                Filtered: {filteredCount}
              </CBadge>
            )}
            <CBadge color="warning">
              Status: In Stock
            </CBadge>
            <small className="text-muted ms-2">
              <CIcon icon={cilInfo} size="sm" className="me-1" />
              {statistics.byLocation?.branch || 0} at Branches, {statistics.byLocation?.subdealer || 0} at Subdealers
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <CButton
              color="outline-primary"
              size="sm"
              onClick={() => fetchData(currentPage, limit, searchQuery)}
              disabled={loading}
            >
              {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} className="me-1" />}
              Refresh
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
            <div className="text-muted small">
              <CIcon icon={cilFile} className="me-1" />
              {statistics.total} vehicles found in MIS only (not in DMS)
            </div>
            <div className="d-flex align-items-center gap-2">
              <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by chassis, model, branch..."
                style={{ width: '250px' }}
              />
            </div>
          </div>

          {loading && vehicleData.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          <div className="responsive-table-wrapper" style={{ opacity: loading && vehicleData.length > 0 ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Engine Number</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Location</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Age</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '100px' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vehicleData.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center py-4">
                      <CIcon icon={cilWarning} className="me-2 text-muted" />
                      {searchQuery ? `No results found for "${searchQuery}"` : 'No MIS only vehicles available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  vehicleData.map((item, index) => {
                    const startRecord = (currentPage - 1) * limit + 1;
                    const vehicle = item.vehicle || item;
                    const vehicleDataObj = vehicle || {};
                    const chassisNumber = vehicleDataObj.chassisNumber || item.chassisNumber || 'N/A';
                    const engineNumber = vehicleDataObj.engineNumber || item.engineNumber || 'N/A';
                    const modelName = vehicleDataObj.modelName || vehicleDataObj.model?.model_name || item.modelName || 'N/A';
                    const colorName = vehicleDataObj.color?.name || vehicleDataObj.colorName || item.colorName || 'N/A';
                    const locationType = vehicleDataObj.locationType || item.locationType || 'N/A';
                    const status = vehicleDataObj.status || item.status || 'in_stock';
                    const ageInDays = vehicleDataObj.ageInDays || item.ageInDays || 0;
                    const isUnder10Days = vehicleDataObj.isUnder10DaysCluster || item.isUnder10DaysCluster || false;
                    const canBeSold = item.summary?.canBeSold || vehicleDataObj.bookingEligibility?.canSellFreely || false;

                    let locationName = 'N/A';
                    if (locationType === 'branch' && vehicleDataObj.unloadLocation) {
                      locationName = vehicleDataObj.unloadLocation.name || 'Branch';
                    } else if (locationType === 'subdealer' && vehicleDataObj.subdealerLocation) {
                      locationName = vehicleDataObj.subdealerLocation.name || 'Subdealer';
                    }

                    return (
                      <CTableRow key={chassisNumber || index}>
                        <CTableDataCell>{startRecord + index}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="primary" className="fw-normal" style={{ fontSize: '12px' }}>
                            {chassisNumber}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>{engineNumber}</CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>{modelName}</CTableDataCell>
                        <CTableDataCell style={{ fontSize: '12px' }}>{colorName}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-column">
                            {getLocationBadge(locationType)}
                            <small className="text-muted" style={{ fontSize: '10px' }}>{locationName}</small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadgeColor(status)}>
                            {status ? status.replace('_', ' ').toUpperCase() : 'N/A'}
                          </CBadge>
                          {!canBeSold && (
                            <CBadge color="danger" className="ms-1" size="sm">Locked</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-column">
                            <CBadge color={isUnder10Days ? 'success' : ageInDays > 60 ? 'danger' : 'warning'}>
                              {ageInDays} days
                            </CBadge>
                            {isUnder10Days && (
                              <small className="text-success" style={{ fontSize: '9px' }}>New</small>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleViewVehicle(item, e)}
                            disabled={!canViewMisOnly}
                            className="px-2 py-1"
                            title="View Details"
                          >
                            <CIcon icon={cilSearch} size="sm" />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination - same as AdvantageTVSVehicles */}
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
        </CCardBody>
      </CCard>

      {/* View Vehicle Modal */}
      <CModal
        visible={viewModalVisible}
        onClose={() => {
          setViewModalVisible(false);
          setSelectedVehicle(null);
        }}
        size="lg"
        scrollable
      >
        <CModalHeader className="border-bottom">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilInfo} className="me-2 text-primary" />
            Vehicle Details - MIS Only
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewLoading ? (
            <div className="d-flex justify-content-center py-4">
              <CSpinner color="primary" />
            </div>
          ) : selectedVehicle ? (
            (() => {
              const vehicle = selectedVehicle.vehicle || selectedVehicle;
              const summary = selectedVehicle.summary || {};
              const allocationInfo = selectedVehicle.allocationInfo || {};
              const freezeInfo = selectedVehicle.freezeInfo || {};
              const approvalStatus = selectedVehicle.approvalStatus || {};
              const ageDescription = selectedVehicle.ageDescription || 'N/A';

              const qrCodeUrl = getQrCodeUrl(vehicle.qrCode);

              return (
                <div className="vehicle-details">
                  <div className="alert alert-info d-flex align-items-center mb-4">
                    <CIcon icon={cilInfo} className="me-2" />
                    <span>
                      <strong>MIS Only Vehicle:</strong> This vehicle exists in MIS but is not in DMS stock.
                      {summary.canBeSold && ' It can be sold normally in the system.'}
                      {!summary.canBeSold && ' This vehicle may require GM approval before sale.'}
                    </span>
                  </div>

                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Vehicle Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Chassis Number</label>
                            <p className="fw-bold mb-0">{vehicle.chassisNumber || 'N/A'}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Engine Number</label>
                            <p className="mb-0">{vehicle.engineNumber || 'N/A'}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Model</label>
                            <p className="mb-0">{vehicle.modelName || vehicle.model?.model_name || 'N/A'}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Type</label>
                            <p className="mb-0">
                              <CBadge color={vehicle.type === 'EV' ? 'success' : 'primary'}>
                                {vehicle.type || 'N/A'}
                              </CBadge>
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Color</label>
                            <p className="mb-0">{vehicle.color?.name || vehicle.colorName || 'N/A'}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Location Type</label>
                            <p className="mb-0">{getLocationBadge(vehicle.locationType)}</p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Location</label>
                            <p className="mb-0">
                              {vehicle.locationType === 'branch' && vehicle.unloadLocation?.name}
                              {vehicle.locationType === 'subdealer' && vehicle.subdealerLocation?.name}
                              {!vehicle.locationType && 'N/A'}
                            </p>
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-bold">Status</label>
                            <p className="mb-0">
                              <CBadge color={getStatusBadgeColor(vehicle.status)}>
                                {vehicle.status ? vehicle.status.replace('_', ' ').toUpperCase() : 'N/A'}
                              </CBadge>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <CIcon icon={cilCalendar} size="2xl" className="text-primary mb-2" />
                          <h6 className="fw-bold">Vehicle Age</h6>
                          <p className="mb-0">
                            <CBadge color={vehicle.isUnder10DaysCluster ? 'success' : 'warning'}>
                              {vehicle.ageInDays || 0} days
                            </CBadge>
                          </p>
                          <small className="text-muted">{ageDescription}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <CIcon icon={freezeInfo.isFrozen ? cilXCircle : cilCheckCircle}
                            size="2xl"
                            className={freezeInfo.isFrozen ? 'text-danger mb-2' : 'text-success mb-2'}
                          />
                          <h6 className="fw-bold">Freeze Status</h6>
                          <CBadge color={freezeInfo.isFrozen ? 'danger' : 'success'}>
                            {freezeInfo.isFrozen ? 'Frozen' : 'Active'}
                          </CBadge>
                          {freezeInfo.isFrozen && (
                            <small className="text-muted d-block mt-1">Vehicle is frozen</small>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <CIcon icon={summary.hasBooking ? cilCheckCircle : cilXCircle}
                            size="2xl"
                            className={summary.hasBooking ? 'text-warning mb-2' : 'text-secondary mb-2'}
                          />
                          <h6 className="fw-bold">Booking Status</h6>
                          <CBadge color={summary.hasBooking ? 'warning' : 'secondary'}>
                            {summary.hasBooking ? 'Booked' : 'Available'}
                          </CBadge>
                          {allocationInfo.allocatedBooking && (
                            <small className="text-muted d-block mt-1">
                              Amount: ₹{allocationInfo.bookingReceivedAmount || 0}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approval Status */}
                  {approvalStatus && Object.keys(approvalStatus).length > 0 && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <CIcon icon={cilInfo} className="me-2 text-primary" />
                          Approval Status
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="text-muted small fw-bold">Source</label>
                            <p className="mb-0">
                              <CBadge color="info">{approvalStatus.source || 'N/A'}</CBadge>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <label className="text-muted small fw-bold">In DMS</label>
                            <p className="mb-0">
                              <CBadge color={approvalStatus.isInDms ? 'success' : 'danger'}>
                                {approvalStatus.isInDms ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <label className="text-muted small fw-bold">Has Pending Approval</label>
                            <p className="mb-0">
                              <CBadge color={approvalStatus.hasPendingApproval ? 'warning' : 'success'}>
                                {approvalStatus.hasPendingApproval ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {summary && Object.keys(summary).length > 0 && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <CIcon icon={cilCloudDownload} className="me-2 text-secondary" />
                          Vehicle Summary
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Has Booking</label>
                            <p className="mb-2">
                              <CBadge color={summary.hasBooking ? 'warning' : 'secondary'}>
                                {summary.hasBooking ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Is Frozen</label>
                            <p className="mb-2">
                              <CBadge color={summary.isFrozen ? 'danger' : 'success'}>
                                {summary.isFrozen ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Is In Stock</label>
                            <p className="mb-2">
                              <CBadge color={summary.isInStock ? 'success' : 'danger'}>
                                {summary.isInStock ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">Can Be Sold</label>
                            <p className="mb-2">
                              <CBadge color={summary.canBeSold ? 'success' : 'danger'}>
                                {summary.canBeSold ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="text-muted small fw-bold">GM Approval Required</label>
                            <p className="mb-0">
                              <CBadge color={summary.gmApprovalRequired ? 'warning' : 'success'}>
                                {summary.gmApprovalRequired ? 'Yes' : 'No'}
                              </CBadge>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <CIcon icon={cilInfo} className="me-2 text-muted" />
                        Additional Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold">Battery Number</label>
                          <p className="mb-2">{vehicle.batteryNumber || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold">Key Number</label>
                          <p className="mb-2">{vehicle.keyNumber || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold">Inward Date</label>
                          <p className="mb-2">{formatDateTime(vehicle.inwardDate)}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold">Created At</label>
                          <p className="mb-0">{formatDateTime(vehicle.createdAt)}</p>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <label className="text-muted small fw-bold">QR Code</label>
                          <p className="mb-0">
                            {qrCodeUrl ? (
                              <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                                <CIcon icon={cilQrCode} className="me-1" />
                                View QR Code
                              </a>
                            ) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2 justify-content-end border-top pt-3">
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setViewModalVisible(false);
                        setSelectedVehicle(null);
                      }}
                    >
                      Close
                    </CButton>
                    {canUpdateMisOnly && summary.canBeSold && (
                      <CButton
                        color="success"
                        onClick={() => {
                          showSuccess('This vehicle is available for sale');
                        }}
                      >
                        <CIcon icon={cilCheckCircle} className="me-1" />
                        Available for Sale
                      </CButton>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-4 text-muted">No vehicle data available</div>
          )}
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton
            color="secondary"
            onClick={() => {
              setViewModalVisible(false);
              setSelectedVehicle(null);
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default MisOnlyVehicles;