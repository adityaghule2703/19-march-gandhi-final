import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  confirmDelete,
  showError,
  axiosInstance
} from '../../../utils/tableImports';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormInput, 
  CFormLabel, 
  CFormSelect,
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner,
  CBadge,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons';
import AddGodown from './AddGodown';

const Godowns = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGodown, setEditingGodown] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [togglingId, setTogglingId] = useState(null);

  // Branch filter
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch branches once for filter dropdown
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, selectedBranch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { page, limit };
      if (selectedBranch) {
        params.branch = selectedBranch;
      }

      const response = await axiosInstance.get(`/godowns`, { params });

      const godownsData = response.data.data || [];
      setData(godownsData);
      setFilteredData(godownsData);
      setTotalPages(response.data.pages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
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

  const handleDelete = async (godownId) => {
    const result = await confirmDelete('Are you sure you want to delete this godown?');
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/godowns/${godownId}`);
        fetchData();
        setSuccessMessage('Godown deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleToggleStatus = async (godown) => {
    handleClose();
    try {
      setTogglingId(godown._id);
      const newStatus = !godown.is_active;
      await axiosInstance.patch(`/godowns/${godown._id}/status`, {
        is_active: newStatus
      });
      setData((prev) =>
        prev.map((g) =>
          g._id === godown._id ? { ...g, is_active: newStatus } : g
        )
      );
      setFilteredData((prev) =>
        prev.map((g) =>
          g._id === godown._id ? { ...g, is_active: newStatus } : g
        )
      );
      setSuccessMessage(
        `Godown ${newStatus ? 'activated' : 'deactivated'} successfully`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.log(error);
      showError(error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = data.filter(godown =>
      godown.name?.toLowerCase().includes(value.toLowerCase()) ||
      godown.mobile?.toString().includes(value) ||
      godown.branchDetails?.name?.toLowerCase().includes(value.toLowerCase()) ||
      godown.branchDetails?.city?.toLowerCase().includes(value.toLowerCase()) ||
      godown.branchDetails?.state?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleBranchFilterChange = (e) => {
    setSelectedBranch(e.target.value);
    setPage(1); // reset to page 1 whenever filter changes
  };

  const handleShowAddModal = () => {
    setEditingGodown(null);
    setShowModal(true);
  };

  const handleShowEditModal = (godown) => {
    setEditingGodown(godown);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGodown(null);
  };

  const handleGodownSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
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
      <div className='title'>Godowns</div>

      {/* Success Alert */}
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
              onClick={handleShowAddModal}
            >
              <CIcon icon={cilPlus} className='icon' /> New Godown
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
            {/* Branch Filter */}
            <div className='d-flex align-items-center'>
              <CFormLabel className='mt-1 m-1'>Branch:</CFormLabel>
              <CFormSelect
                className="square-search"
                style={{ minWidth: '220px' }}
                value={selectedBranch}
                onChange={handleBranchFilterChange}
                disabled={branchesLoading}
              >
                <option value="">
                  {branchesLoading ? 'Loading...' : 'All Branches'}
                </option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                    {branch.city ? ` - ${branch.city}` : ''}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Search */}
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, mobile or branch..."
              />
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Godown Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      <CBadge color="secondary">No godowns available</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((godown, index) => (
                    <CTableRow key={godown._id}>
                      <CTableDataCell>{(page - 1) * limit + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{godown.name}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{godown.mobile || '-'}</CTableDataCell>
                      <CTableDataCell>
                        {godown.branchDetails ? (
                          <CBadge color="info">
                            {godown.branchDetails.name}
                            {godown.branchDetails.city
                              ? ` - ${godown.branchDetails.city}`
                              : ''}
                          </CBadge>
                        ) : (
                          <span className="text-muted">No branch</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={godown.is_active ? 'success' : 'danger'}>
                          {godown.is_active ? 'Active' : 'Inactive'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, godown._id)}
                          disabled={togglingId === godown._id}
                        >
                          {togglingId === godown._id ? (
                            <CSpinner size="sm" />
                          ) : (
                            <>
                              <CIcon icon={cilSettings} />
                              Options
                            </>
                          )}
                        </CButton>
                        <Menu
                          id={`action-menu-${godown._id}`}
                          anchorEl={anchorEl}
                          open={menuId === godown._id}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={() => handleShowEditModal(godown)}
                            style={{ color: 'black' }}
                          >
                            <CIcon icon={cilPencil} className="me-2" />
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleToggleStatus(godown)}
                            style={{ color: 'black' }}
                          >
                            {godown.is_active ? (
                              <>
                                <CIcon icon={cilXCircle} className="me-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CIcon icon={cilCheckCircle} className="me-2" />
                                Activate
                              </>
                            )}
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDelete(godown._id)}
                            style={{ color: 'black' }}
                          >
                            <CIcon icon={cilTrash} className="me-2" />
                            Delete
                          </MenuItem>
                        </Menu>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
              </div>
              <div className="d-flex gap-2">
                <CButton
                  size="sm"
                  color="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </CButton>
                <CButton size="sm" color="secondary" disabled>
                  Page {page} of {totalPages}
                </CButton>
                <CButton
                  size="sm"
                  color="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </CButton>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>

      <AddGodown
        show={showModal}
        onClose={handleCloseModal}
        onGodownSaved={handleGodownSaved}
        editingGodown={editingGodown}
      />
    </div>
  );
};

export default Godowns;