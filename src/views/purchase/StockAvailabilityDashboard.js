import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  showError,
  axiosInstance
} from '../../utils/tableImports';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormLabel, 
  CFormSelect,
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner,
  CAlert,
  CBadge,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilReload } from '@coreui/icons';
import Select from 'react-select';

const StockAvailabilityDashboard = () => {
  const [data, setData] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [totals, setTotals] = useState(null);
  const [bookedButFreed, setBookedButFreed] = useState([]);
  
  const [branches, setBranches] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  
  const [filters, setFilters] = useState({
    branchId: 'all',
    modelType: 'all',
    modelId: 'all',
    colorId: 'all'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Big number style for all numeric cells
  const bigNumberStyle = {
    fontSize: '1.05rem',
    fontWeight: '600',
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      if (key === 'modelType') {
        newFilters.modelId = 'all';
      }
      return newFilters;
    });
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        if (response.data.success) setBranches(response.data.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axiosInstance.get('/models/all/status');
        if (response.data.status === 'success' && response.data.data?.models) {
          setModels(response.data.data.models);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axiosInstance.get('/colors');
        if (response.data.status === 'success' && response.data.data?.colors) {
          setColors(response.data.data.colors);
        } else if (Array.isArray(response.data)) {
          setColors(response.data);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    fetchColors();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('format', 'json');

      const response = await axiosInstance.get(`/godownReport/stock-availability-tracker?${params.toString()}`);
      
      if (response.data.success) {
        setData(response.data.data || []);
        setGodowns(response.data.godowns || []);
        setTotals(response.data.totals || null);
        setBookedButFreed(response.data.bookedButFreed || []);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('format', 'excel');

      const response = await axiosInstance.get(
        `/godownReport/stock-availability-tracker?${params.toString()}`,
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        showError(errorData.message || 'Failed to export Excel file');
        return;
      }

      let filename = 'Stock_Availability_Tracker.xlsx';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      const message = showError(error);
      if (message) setError(message);
    }
  };

  const renderGodownHeaders = () => {
    return godowns.map((godown) => (
      <CTableHeaderCell key={godown.id} className="text-center text-nowrap">
        {godown.columnLabel || `${godown.name} STOCK`}
      </CTableHeaderCell>
    ));
  };

  // ✅ Godown cells now use bigNumberStyle
  const renderGodownCells = (row) => {
    return godowns.map((godown) => (
      <CTableDataCell key={godown.id} style={bigNumberStyle}>
        {row[godown.columnKey] || 0}
      </CTableDataCell>
    ));
  };

  const filteredModels = filters.modelType === 'all' 
    ? models 
    : models.filter(m => m.type === filters.modelType);

  const modelOptions = filteredModels.map((m) => ({
    value: m._id,
    label: m.model_name
  }));

  const selectedModelOption = 
    filters.modelId && filters.modelId !== 'all'
      ? modelOptions.find(opt => opt.value === filters.modelId) || null
      : null;

  return (
    <div>
      <div className='title'>Stock Availability Tracker</div>

      <CCard className='table-container mt-4'>
        <CCardHeader 
          className='card-header' 
          style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}
        >
          <CRow className="align-items-end g-3">
            <CCol md={3}>
              <CFormLabel className='mb-1 text-nowrap'>Branch</CFormLabel>
              <CFormSelect 
                value={filters.branchId} 
                onChange={(e) => handleFilterChange('branchId', e.target.value)}
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={2}>
              <CFormLabel className='mb-1 text-nowrap'>Model Type</CFormLabel>
              <CFormSelect 
                value={filters.modelType} 
                onChange={(e) => handleFilterChange('modelType', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="EV">EV</option>
                <option value="ICE">ICE</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormLabel className='mb-1 text-nowrap'>Model</CFormLabel>
              <Select
                classNamePrefix="react-select"
                placeholder="Search or select a model..."
                isSearchable={true}
                isClearable={true}
                options={modelOptions}
                value={selectedModelOption}
                onChange={(selectedOption) => {
                  handleFilterChange('modelId', selectedOption ? selectedOption.value : 'all');
                }}
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
                noOptionsMessage={() => "No models found"}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '38px'
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({ ...base, zIndex: 9999 })
                }}
              />
            </CCol>

            <CCol md={2}>
              <CFormLabel className='mb-1 text-nowrap'>Color</CFormLabel>
              <CFormSelect 
                value={filters.colorId} 
                onChange={(e) => handleFilterChange('colorId', e.target.value)}
              >
                <option value="all">All Colors</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={2} className="d-flex gap-2">
              <CButton 
                size="sm" 
                color="secondary" 
                variant="outline" 
                onClick={fetchStockData}
                disabled={loading}
                className="flex-grow-1"
              >
                <CIcon icon={cilReload} className="me-1" />
                Refresh
              </CButton>
              <CButton 
                size="sm" 
                color="success" 
                onClick={handleExportExcel}
                className="flex-grow-1"
              >
                <CIcon icon={cilCloudDownload} className="me-1" />
                Excel
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        
        <CCardBody>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="responsive-table-wrapper" style={{ overflowX: 'auto' }}>
                <CTable striped bordered hover className='responsive-table' style={{ fontSize: '0.85rem' }}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>SR NO</CTableHeaderCell>
                      <CTableHeaderCell>MODEL</CTableHeaderCell>
                      <CTableHeaderCell>COLOUR</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">SHOWROOM STOCK</CTableHeaderCell>
                      {renderGodownHeaders()}
                      <CTableHeaderCell className="text-center">DAMAGE</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">TOTAL STOCK</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">BOOKINGS IN HAND / BLOCKED</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">SHORT/AVAILABLE FOR SALE</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7 + godowns.length} className="text-center">
                          No stock data available for the selected filters.
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      data.map((row, index) => (
                        <CTableRow key={row.srNo || index}>
                          <CTableDataCell>{row.srNo}</CTableDataCell>
                          <CTableDataCell>{row.model}</CTableDataCell>
                          <CTableDataCell>{row.colour}</CTableDataCell>

                          {/* ✅ Bigger, bolder numeric cells */}
                          <CTableDataCell style={bigNumberStyle}>{row.showroomStock}</CTableDataCell>
                          {renderGodownCells(row)}
                          <CTableDataCell style={bigNumberStyle}>{row.damage}</CTableDataCell>
                          <CTableDataCell style={{ ...bigNumberStyle, fontWeight: '700' }}>
                            {row.totalStock}
                          </CTableDataCell>
                          <CTableDataCell style={bigNumberStyle}>{row.bookingsInHand}</CTableDataCell>
                          <CTableDataCell style={bigNumberStyle}>
                            <CBadge 
                              color={row.shortAvailable < 0 ? 'danger' : 'success'}
                              style={{ fontSize: '0.9rem', padding: '6px 10px', fontWeight: '700' }}
                            >
                              {row.shortAvailable}
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                  
                  {totals && data.length > 0 && (
                    <CTableHead>
                      <CTableRow className="table-secondary fw-bold">
                        <CTableDataCell colSpan={3} className="text-end" style={{ fontSize: '1rem' }}>
                          TOTALS:
                        </CTableDataCell>
                        <CTableDataCell style={{ ...bigNumberStyle, fontWeight: '700' }}>
                          {totals.showroomStock}
                        </CTableDataCell>
                        {godowns.map((g) => (
                          <CTableDataCell 
                            key={g.id} 
                            style={{ ...bigNumberStyle, fontWeight: '700' }}
                          >
                            {totals[g.columnKey] || 0}
                          </CTableDataCell>
                        ))}
                        <CTableDataCell style={{ ...bigNumberStyle, fontWeight: '700' }}>
                          {totals.damage}
                        </CTableDataCell>
                        <CTableDataCell style={{ ...bigNumberStyle, fontWeight: '700' }}>
                          {totals.totalStock}
                        </CTableDataCell>
                        <CTableDataCell style={{ ...bigNumberStyle, fontWeight: '700' }}>
                          {totals.bookingsInHand}
                        </CTableDataCell>
                        <CTableDataCell style={{ ...bigNumberStyle, fontWeight: '700' }}>
                          {totals.shortAvailable}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableHead>
                  )}
                </CTable>
              </div>

              {bookedButFreed && bookedButFreed.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-3">Booked But Freed</h5>
                  <CTable striped bordered hover size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>MODEL</CTableHeaderCell>
                        <CTableHeaderCell>COLOR</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">BOOKED COUNT</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">TOTAL STOCK</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">NET AVAILABLE</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {bookedButFreed.map((item, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{item.model}</CTableDataCell>
                          <CTableDataCell>{item.color}</CTableDataCell>
                          <CTableDataCell style={bigNumberStyle}>{item.bookedCount}</CTableDataCell>
                          <CTableDataCell style={bigNumberStyle}>{item.totalStock}</CTableDataCell>
                          <CTableDataCell style={bigNumberStyle}>{item.netAvailable}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StockAvailabilityDashboard;