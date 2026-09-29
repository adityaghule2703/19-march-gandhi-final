// SchemaMaster.jsx
import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from '../../../utils/tableImports';
import {
  MODULES,
  PAGES,
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
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCloudDownload } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const SchemeList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  const { currentRecords, PaginationOptions } = usePagination(
    Array.isArray(filteredData) ? filteredData : []
  );

  const { permissions } = useAuth();

  const canViewOffer = canViewPage(permissions, MODULES.MASTERS, PAGES.MASTERS.OFFER);
  const canCreateOffer = canCreateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.OFFER);
  const canUpdateOffer = canUpdateInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.OFFER);
  const canDeleteOffer = canDeleteInPage(permissions, MODULES.MASTERS, PAGES.MASTERS.OFFER);

  const showActionColumn = canUpdateOffer || canDeleteOffer;

  useEffect(() => {
    if (!canViewOffer) {
      showError('You do not have permission to view Schemes');
      return;
    }

    fetchData();
  }, [canViewOffer]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/schemes');
      const schemes = response.data.data.schemes || [];
      setData(schemes);
      setFilteredData(schemes);
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    if (!canDeleteOffer) {
      showError('You do not have permission to delete schemes');
      return;
    }

    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/schemes/${id}`);
        setData(data.filter((scheme) => scheme._id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, ['scheme_name', 'type', 'description', 'status']);
  };

  const getTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'cash': return 'success';
      case 'finance': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      default: return 'warning';
    }
  };

  // Export handlers
  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExportClose = () => {
    setShowExportModal(false);
    setExportStartDate('');
    setExportEndDate('');
  };

  const handleExportSubmit = async () => {
    if (!exportStartDate || !exportEndDate) {
      showError('Please select both start and end dates');
      return;
    }

    try {
      setExportLoading(true);
      const response = await axiosInstance.get(
        `/reports/branch-sales-with-scheme?startDate=${exportStartDate}&endDate=${exportEndDate}&format=excel`,
        { responseType: 'blob' }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `branch-sales-with-scheme_${exportStartDate}_to_${exportEndDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess('Export downloaded successfully');
      handleExportClose();
    } catch (error) {
      console.error('Export error:', error);
      showError(error);
    } finally {
      setExportLoading(false);
    }
  };

  if (!canViewOffer) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Schemes.
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
      <div className="title">Schemes</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            {canCreateOffer && (
              <Link to="/schemes/add-scheme">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className="icon" /> New Scheme
                </CButton>
              </Link>
            )}
            {/* Export Button */}
            <CButton
              size="sm"
              className="action-btn me-1"
              onClick={handleExportClick}
            >
              <CIcon icon={cilCloudDownload} className="icon" /> Export
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className="d-flex">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Scheme Name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Applicable Models</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "8" : "7"} className="text-center">
                      No schemes available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((scheme, index) => (
                    <CTableRow key={scheme._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{scheme.scheme_name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getTypeBadgeColor(scheme.type)}>
                          {scheme.type?.toUpperCase()}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {scheme.description
                          ? scheme.description.length > 60
                            ? `${scheme.description.substring(0, 60)}...`
                            : scheme.description
                          : <CBadge color="secondary">—</CBadge>}
                      </CTableDataCell>
                      <CTableDataCell>
                        {Array.isArray(scheme.applicableModelsDetails) &&
                        scheme.applicableModelsDetails.length > 0
                          ? scheme.applicableModelsDetails
                              .map((m) => m.model_name)
                              .join(', ')
                          : <CBadge color="secondary">—</CBadge>}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadgeColor(scheme.status)}>
                          {scheme.status
                            ? scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)
                            : '—'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {scheme.createdByDetails?.name || '—'}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className="option-button btn-sm"
                            onClick={(event) => handleClick(event, scheme._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu
                            id={`action-menu-${scheme._id}`}
                            anchorEl={anchorEl}
                            open={menuId === scheme._id}
                            onClose={handleClose}
                          >
                            {canUpdateOffer && (
                              <Link
                                className="Link"
                                to={`/schemes/update-scheme/${scheme._id}`}
                              >
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canDeleteOffer && (
                              <MenuItem onClick={() => handleDelete(scheme._id)}>
                                <CIcon icon={cilTrash} className="me-2" />
                                Delete
                              </MenuItem>
                            )}
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Export Modal */}
      <CModal visible={showExportModal} onClose={handleExportClose}>
        <CModalHeader>
          <h5>Export Branch Sales with Scheme</h5>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="exportStartDate">Start Date</CFormLabel>
            <CFormInput
              type="date"
              id="exportStartDate"
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="exportEndDate">End Date</CFormLabel>
            <CFormInput
              type="date"
              id="exportEndDate"
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleExportClose}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleExportSubmit} disabled={exportLoading}>
            {exportLoading ? <CSpinner size="sm" /> : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default SchemeList;