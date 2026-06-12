import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../css/report.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage 
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';
import { showError } from '../../../utils/sweetAlerts';
import { CFormSelect, CSpinner, CAlert, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CFormInput } from '@coreui/react';

const SubdealerReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [exportLoading, setExportLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedType, setSelectedType] = useState('');
  const [subdealers, setSubdealers] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [subdealerLoading, setSubdealerLoading] = useState(false);
  const [subdealerSearchTerm, setSubdealerSearchTerm] = useState('');
  const [showSubdealerDropdown, setShowSubdealerDropdown] = useState(false);
  const navigate = useNavigate();

  const { permissions = [], user } = useAuth();

  // Use the correct permission for Subdealer Report
  const canViewSubdealerReport = canViewPage(permissions, MODULES.SUBDEALER_REPORT, PAGES.SUBDEALER_REPORT.SUBDEALER_REPORT);
  
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
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!canViewSubdealerReport) {
      showError('You do not have permission to view Subdealer Reports');
      navigate('/dashboard');
      return;
    }
    fetchSubdealers();
  }, [canViewSubdealerReport, navigate]);

  const fetchSubdealers = async () => {
    try {
      setSubdealerLoading(true);
      const response = await axiosInstance.get('/subdealers');
      
      if (response.data?.data?.subdealers) {
        // Filter only active subdealers
        const activeSubdealers = response.data.data.subdealers.filter(
          subdealer => subdealer.status === 'active'
        );
        setSubdealers(activeSubdealers);
      }
    } catch (error) {
      console.error('Error fetching subdealers:', error);
      toast.error('Failed to load subdealers');
    } finally {
      setSubdealerLoading(false);
    }
  };

  // Filter subdealers based on search term
  const filteredSubdealers = subdealers.filter(subdealer =>
    subdealer.name.toLowerCase().includes(subdealerSearchTerm.toLowerCase())
  );

  const getReportName = (tab) => {
    switch(tab) {
      case 'sales': return 'Sales Report';
      case 'outstanding': return 'Outstanding Report';
      case 'booking': return 'Booking Report';
      case 'stock': return 'Stock Report';
      default: return 'Report';
    }
  };

  const getAPIEndpoint = () => {
    switch(activeTab) {
      case 'sales':
        return '/reports/branch-sales';
      case 'outstanding':
        return '/reports/outstanding';
      case 'booking':
        return '/reports/bookings';
      case 'stock':
        return '/reports/stock/current';
      default:
        return '/reports/branch-sales';
    }
  };

  const getFileName = (subdealerName, fromDateStr, toDateStr) => {
    const reportType = getReportName(activeTab).replace(' ', '_');
    if (activeTab === 'stock') {
      return `${reportType}_${subdealerName}.xlsx`;
    }
    return `${reportType}_${subdealerName}_${fromDateStr}_to_${toDateStr}.xlsx`;
  };

  const handleExportToExcel = async () => {
    setApiError('');

    if (!canViewSubdealerReport) {
      showError('You do not have permission to export Subdealer Reports');
      return;
    }

    if (!selectedSubdealer) {
      toast.error('Please select a subdealer');
      return;
    }

    // Only validate dates for tabs that require them (sales and booking)
    if (activeTab === 'sales' || activeTab === 'booking') {
      if (!fromDate || !toDate) {
        toast.error('Please select both from and to dates');
        return;
      }

      if (fromDate > toDate) {
        toast.error('From date cannot be after To date');
        return;
      }
    }

    // For stock report, no date validation needed
    if (activeTab === 'stock') {
      if (!selectedType) {
        toast.error('Please select a model type');
        return;
      }
    }

    try {
      setExportLoading(true);
      
      const apiEndpoint = getAPIEndpoint();

      const params = new URLSearchParams({
        format: 'excel'
      });

      // Add modelType for stock report and other reports
      if (selectedType) {
        params.append('modelType', selectedType);
      }

      // For stock report, always set locationType to subdealer
      if (activeTab === 'stock') {
        params.append('locationType', 'subdealer');
      }

      // Add dates only for sales and booking tabs
      if (activeTab === 'sales' || activeTab === 'booking') {
        const formattedFromDate = formatDateForAPI(fromDate);
        const formattedToDate = formatDateForAPI(toDate);
        params.append('startDate', formattedFromDate);
        params.append('endDate', formattedToDate);
      }

      // Handle Subdealer selection
      if (selectedSubdealer === 'all') {
        if (activeTab === 'stock') {
          params.append('subdealerId', 'all');
        } else {
          params.append('sourceType', 'SUBDEALER');
          params.append('subdealerId', 'all');
        }
      } else {
        if (activeTab === 'stock') {
          params.append('subdealerId', selectedSubdealer);
        } else {
          params.append('sourceType', 'SUBDEALER');
          params.append('subdealerId', selectedSubdealer);
        }
      }

      const response = await axiosInstance.get(
        `${apiEndpoint}?${params.toString()}`,
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        if (!errorData.success && errorData.message) {
          setApiError(errorData.message);
          toast.error(errorData.message);
          return;
        }
      }

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get subdealer name for filename
      let subdealerName = 'Subdealer';
      if (selectedSubdealer === 'all') {
        subdealerName = 'All_Subdealers';
      } else {
        const subdealer = subdealers.find(s => s._id === selectedSubdealer);
        subdealerName = subdealer?.name || 'Subdealer';
      }
      
      let fileName;
      if (activeTab === 'outstanding') {
        // For outstanding report, don't include dates in filename
        fileName = `${getReportName(activeTab).replace(' ', '_')}_${subdealerName}.xlsx`;
      } else if (activeTab === 'stock') {
        // For stock report, include model type in filename
        fileName = `${getReportName(activeTab).replace(' ', '_')}_${subdealerName}_${selectedType || 'All'}.xlsx`;
      } else {
        const fromDateStr = fromDate ? formatDate(fromDate) : '';
        const toDateStr = toDate ? formatDate(toDate) : '';
        fileName = getFileName(subdealerName, fromDateStr, toDateStr);
      }
      
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      toast.success(`${getReportName(activeTab)} exported successfully`);

    } catch (error) {
      console.error('Error exporting report:', error);
      
      // For blob errors, we need to read the blob
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(error.response.data);
          });
          
          const errorData = JSON.parse(text);
          
          // Show the exact error message from API
          if (errorData.message) {
            setApiError(errorData.message);
            toast.error(errorData.message);
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setApiError('Failed to export report');
          toast.error('Failed to export report');
        }
      } else if (error.response?.data?.message) {
        // Regular error with message in response
        setApiError(error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.message) {
        // Network or other errors
        setApiError(error.message);
        toast.error(error.message);
      } else {
        setApiError('Failed to export report');
        toast.error('Failed to export report');
      }
      
    } finally {
      setExportLoading(false);
    }
  };

  // Clear error when user changes filters
  useEffect(() => {
    setApiError('');
  }, [selectedSubdealer, fromDate, toDate, selectedType, activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubdealerDropdown && !event.target.closest('.subdealer-dropdown-container')) {
        setShowSubdealerDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSubdealerDropdown]);

  // Check if user has permission to view this page
  if (!canViewSubdealerReport) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer Reports.
      </div>
    );
  }

  return (
    <div className="rto-report-container">
      <h4 className="rto-report-title">Subdealer Reports</h4>

      <div className="rto-report-card">
        {/* Display API Error at the top - only shows the exact error message */}
        {apiError && (
          <CAlert color="danger" className="mb-3">
            {apiError}
          </CAlert>
        )}

        {/* Tabs for different report types */}
        <CCard>
          <CCardHeader>
            <CNav variant="tabs" className="card-header-tabs">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'sales'}
                  onClick={() => setActiveTab('sales')}
                  style={{ cursor: 'pointer' }}
                >
                  Sales Report
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'outstanding'}
                  onClick={() => setActiveTab('outstanding')}
                  style={{ cursor: 'pointer' }}
                >
                  Outstanding Report
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'booking'}
                  onClick={() => setActiveTab('booking')}
                  style={{ cursor: 'pointer' }}
                >
                  Booking Report
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'stock'}
                  onClick={() => setActiveTab('stock')}
                  style={{ cursor: 'pointer' }}
                >
                  Stock Report
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>
          <CCardBody>
            <CTabContent>
              <CTabPane visible={activeTab === 'sales'}>
                <h5 className="mb-3">Sales Report</h5>
                <div className="date-filter-container mt-3">

                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  
                  {/* Subdealer Filter */}
                  <div className="date-filter-group subdealer-dropdown-container" style={{ position: 'relative' }}>
                    <label className="date-filter-label">Select Subdealer:</label>
                    {subdealerLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <CFormInput
                          type="text"
                          placeholder="Search and select subdealer..."
                          value={selectedSubdealer ? 
                            (selectedSubdealer === 'all' ? 'All Subdealers' : 
                              subdealers.find(s => s._id === selectedSubdealer)?.name || '') 
                            : subdealerSearchTerm}
                          onChange={(e) => {
                            if (selectedSubdealer) {
                              setSelectedSubdealer('');
                            }
                            setSubdealerSearchTerm(e.target.value);
                            setShowSubdealerDropdown(true);
                          }}
                          onFocus={() => setShowSubdealerDropdown(true)}
                          className="date-picker"
                        />
                        {showSubdealerDropdown && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            zIndex: 1000,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <div
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: selectedSubdealer === 'all' ? '#f0f0f0' : 'white',
                                borderBottom: '1px solid #eee'
                              }}
                              onClick={() => {
                                setSelectedSubdealer('all');
                                setSubdealerSearchTerm('');
                                setShowSubdealerDropdown(false);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === 'all' ? '#f0f0f0' : 'white'}
                            >
                              <strong>All Subdealers</strong>
                            </div>
                            {filteredSubdealers.length > 0 ? (
                              filteredSubdealers.map((subdealer) => (
                                <div
                                  key={subdealer._id}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'
                                  }}
                                  onClick={() => {
                                    setSelectedSubdealer(subdealer._id);
                                    setSubdealerSearchTerm('');
                                    setShowSubdealerDropdown(false);
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'}
                                >
                                  {subdealer.name}
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '8px 12px', color: '#999' }}>
                                No subdealers found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">From Date:</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">To Date:</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      minDate={fromDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedSubdealer || !fromDate || !toDate}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>

              <CTabPane visible={activeTab === 'outstanding'}>
                <h5>Outstanding Report</h5>
                <div className="date-filter-container mt-3">
                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  
                  {/* Subdealer Filter */}
                  <div className="date-filter-group subdealer-dropdown-container" style={{ position: 'relative' }}>
                    <label className="date-filter-label">Select Subdealer:</label>
                    {subdealerLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <CFormInput
                          type="text"
                          placeholder="Search and select subdealer..."
                          value={selectedSubdealer ? 
                            (selectedSubdealer === 'all' ? 'All Subdealers' : 
                              subdealers.find(s => s._id === selectedSubdealer)?.name || '') 
                            : subdealerSearchTerm}
                          onChange={(e) => {
                            if (selectedSubdealer) {
                              setSelectedSubdealer('');
                            }
                            setSubdealerSearchTerm(e.target.value);
                            setShowSubdealerDropdown(true);
                          }}
                          onFocus={() => setShowSubdealerDropdown(true)}
                          className="date-picker"
                        />
                        {showSubdealerDropdown && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            zIndex: 1000,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <div
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: selectedSubdealer === 'all' ? '#f0f0f0' : 'white',
                                borderBottom: '1px solid #eee'
                              }}
                              onClick={() => {
                                setSelectedSubdealer('all');
                                setSubdealerSearchTerm('');
                                setShowSubdealerDropdown(false);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === 'all' ? '#f0f0f0' : 'white'}
                            >
                              <strong>All Subdealers</strong>
                            </div>
                            {filteredSubdealers.length > 0 ? (
                              filteredSubdealers.map((subdealer) => (
                                <div
                                  key={subdealer._id}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'
                                  }}
                                  onClick={() => {
                                    setSelectedSubdealer(subdealer._id);
                                    setSubdealerSearchTerm('');
                                    setShowSubdealerDropdown(false);
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'}
                                >
                                  {subdealer.name}
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '8px 12px', color: '#999' }}>
                                No subdealers found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedSubdealer}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>

              {/* Booking Report Tab */}
              <CTabPane visible={activeTab === 'booking'}>
                <h5>Booking Report</h5>
                <div className="date-filter-container mt-3">
                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  
                  {/* Subdealer Filter */}
                  <div className="date-filter-group subdealer-dropdown-container" style={{ position: 'relative' }}>
                    <label className="date-filter-label">Select Subdealer:</label>
                    {subdealerLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <CFormInput
                          type="text"
                          placeholder="Search and select subdealer..."
                          value={selectedSubdealer ? 
                            (selectedSubdealer === 'all' ? 'All Subdealers' : 
                              subdealers.find(s => s._id === selectedSubdealer)?.name || '') 
                            : subdealerSearchTerm}
                          onChange={(e) => {
                            if (selectedSubdealer) {
                              setSelectedSubdealer('');
                            }
                            setSubdealerSearchTerm(e.target.value);
                            setShowSubdealerDropdown(true);
                          }}
                          onFocus={() => setShowSubdealerDropdown(true)}
                          className="date-picker"
                        />
                        {showSubdealerDropdown && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            zIndex: 1000,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <div
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: selectedSubdealer === 'all' ? '#f0f0f0' : 'white',
                                borderBottom: '1px solid #eee'
                              }}
                              onClick={() => {
                                setSelectedSubdealer('all');
                                setSubdealerSearchTerm('');
                                setShowSubdealerDropdown(false);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === 'all' ? '#f0f0f0' : 'white'}
                            >
                              <strong>All Subdealers</strong>
                            </div>
                            {filteredSubdealers.length > 0 ? (
                              filteredSubdealers.map((subdealer) => (
                                <div
                                  key={subdealer._id}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'
                                  }}
                                  onClick={() => {
                                    setSelectedSubdealer(subdealer._id);
                                    setSubdealerSearchTerm('');
                                    setShowSubdealerDropdown(false);
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'}
                                >
                                  {subdealer.name}
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '8px 12px', color: '#999' }}>
                                No subdealers found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">From Date:</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">To Date:</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      minDate={fromDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedSubdealer || !fromDate || !toDate}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>

              {/* Stock Report Tab */}
              <CTabPane visible={activeTab === 'stock'}>
                <h5 className="mb-3">Stock Report</h5>
                <div className="date-filter-container mt-3">

                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  
                  {/* Subdealer Filter */}
                  <div className="date-filter-group subdealer-dropdown-container" style={{ position: 'relative' }}>
                    <label className="date-filter-label">Select Subdealer:</label>
                    {subdealerLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <CFormInput
                          type="text"
                          placeholder="Search and select subdealer..."
                          value={selectedSubdealer ? 
                            (selectedSubdealer === 'all' ? 'All Subdealers' : 
                              subdealers.find(s => s._id === selectedSubdealer)?.name || '') 
                            : subdealerSearchTerm}
                          onChange={(e) => {
                            if (selectedSubdealer) {
                              setSelectedSubdealer('');
                            }
                            setSubdealerSearchTerm(e.target.value);
                            setShowSubdealerDropdown(true);
                          }}
                          onFocus={() => setShowSubdealerDropdown(true)}
                          className="date-picker"
                        />
                        {showSubdealerDropdown && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            zIndex: 1000,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <div
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: selectedSubdealer === 'all' ? '#f0f0f0' : 'white',
                                borderBottom: '1px solid #eee'
                              }}
                              onClick={() => {
                                setSelectedSubdealer('all');
                                setSubdealerSearchTerm('');
                                setShowSubdealerDropdown(false);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === 'all' ? '#f0f0f0' : 'white'}
                            >
                              <strong>All Subdealers</strong>
                            </div>
                            {filteredSubdealers.length > 0 ? (
                              filteredSubdealers.map((subdealer) => (
                                <div
                                  key={subdealer._id}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'
                                  }}
                                  onClick={() => {
                                    setSelectedSubdealer(subdealer._id);
                                    setSubdealerSearchTerm('');
                                    setShowSubdealerDropdown(false);
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'}
                                >
                                  {subdealer.name}
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '8px 12px', color: '#999' }}>
                                No subdealers found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedSubdealer || !selectedType}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </div>
    </div>
  );
};

export default SubdealerReport;