// src/components/harita/HaritaModels.jsx
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
  axiosInstance,
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';

const HaritaModels = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(
    Array.isArray(filteredData) ? filteredData : []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/harita');
      // API returns { success, count, data: [...] }
      const models = response.data.data || [];
      setData(models);
      setFilteredData(models);
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
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/harita/${id}`);
        setData((prev) => prev.filter((item) => item._id !== id));
        setFilteredData((prev) => prev.filter((item) => item._id !== id));
        showSuccess('Harita model deleted successfully');
      } catch (error) {
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, [
      'harita_model',
      'harita_variant',
      'advantage_model',
      'advantage_variant',
    ]);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '50vh' }}
      >
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
      <div className="title">Harita Models</div>

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <Link to="/add-harita-model">
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className="icon" /> New Harita Model
              </CButton>
            </Link>
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
                  <CTableHeaderCell>Harita Model</CTableHeaderCell>
                  <CTableHeaderCell>Harita Variant</CTableHeaderCell>
                  <CTableHeaderCell>Advantage Model</CTableHeaderCell>
                  <CTableHeaderCell>Advantage Variant</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableHeaderCell>Updated At</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No Harita models available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((model, index) => (
                    <CTableRow key={model._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{model.harita_model}</CTableDataCell>
                      <CTableDataCell>{model.harita_variant}</CTableDataCell>
                      <CTableDataCell>{model.advantage_model}</CTableDataCell>
                      <CTableDataCell>{model.advantage_variant}</CTableDataCell>
                      <CTableDataCell>
                        {model.createdAt
                          ? new Date(model.createdAt).toLocaleDateString()
                          : '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {model.updatedAt
                          ? new Date(model.updatedAt).toLocaleDateString()
                          : '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className="option-button btn-sm"
                          onClick={(event) => handleClick(event, model._id)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        <Menu
                          id={`action-menu-${model._id}`}
                          anchorEl={anchorEl}
                          open={menuId === model._id}
                          onClose={handleClose}
                        >
                          <Link
                            className="Link"
                            to={`/update-harita-model/${model._id}`}
                          >
                            <MenuItem style={{ color: 'black' }}>
                              <CIcon icon={cilPencil} className="me-2" />
                              Edit
                            </MenuItem>
                          </Link>
                          <MenuItem onClick={() => handleDelete(model._id)}>
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
        </CCardBody>
      </CCard>
    </div>
  );
};

export default HaritaModels;