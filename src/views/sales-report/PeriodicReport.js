import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/report.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';
import { showError } from '../../utils/sweetAlerts';
import { CFormSelect, CSpinner, CAlert } from '@coreui/react';

const PeriodicReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [exportLoading, setExportLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branchLoading, setBranchLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Get permissions from auth context
  const { permissions = [], user } = useAuth();

  // Permission check for Periodic Report page under Sales Report module
  const canViewPeriodicReport = canViewPage(permissions, MODULES.SALES_REPORT, PAGES.SALES_REPORT.PERIODIC_REPORT);

  // Format date to DD-MM-YYYY
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

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Check if user has permission to view this page
    if (!canViewPeriodicReport) {
      showError('You do not have permission to view Periodic Report');
      navigate('/dashboard');
      return;
    }
    fetchBranches();
  }, [canViewPeriodicReport, navigate]);

  const fetchBranches = async () => {
    try {
      setBranchLoading(true);
      const response = await axiosInstance.get('/branches');
      
      if (response.data.success) {
        // Filter only active branches
        const activeBranches = response.data.data.filter(branch => branch.is_active);
        setBranches(activeBranches);
        
        // If user has an assigned branch, preselect it
        if (user?.branchId) {
          const userBranch = activeBranches.find(b => b.id === user.branchId);
          if (userBranch) {
            setSelectedBranch(userBranch.id);
          }
        } else if (activeBranches.length > 0) {
          // Otherwise select the first branch
          setSelectedBranch(activeBranches[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setBranchLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    // Clear previous errors
    setApiError('');

    if (!canViewPeriodicReport) {
      showError('You do not have permission to export Periodic Report');
      return;
    }

    if (!selectedBranch) {
      toast.error('Please select a branch');
      return;
    }

    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates');
      return;
    }

    if (fromDate > toDate) {
      toast.error('From date cannot be after To date');
      return;
    }

    try {
      setExportLoading(true);
      
      const formattedFromDate = formatDateForAPI(fromDate);
      const formattedToDate = formatDateForAPI(toDate);

      // Build query parameters
      const params = new URLSearchParams({
        branchId: selectedBranch,
        startDate: formattedFromDate,
        endDate: formattedToDate,
        format: 'excel'
      });

      const response = await axiosInstance.get(
        `/reports/branch-sales?${params.toString()}`,
        { responseType: 'blob' }
      );

      // Check content type to see if it's an error
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        // It's a JSON error response, parse it
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        // Show the exact error message from API
        if (!errorData.success && errorData.message) {
          setApiError(errorData.message);
          toast.error(errorData.message);
          return;
        }
      }

      // Handle Excel file download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const branchName = branches.find(b => b.id === selectedBranch)?.name || 'Branch';
      const fromDateStr = fromDate ? formatDate(fromDate) : '';
      const toDateStr = toDate ? formatDate(toDate) : '';
      const fileName = `Periodic_Report_${branchName}_${fromDateStr}_to_${toDateStr}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully');

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
  }, [selectedBranch, fromDate, toDate]);

  // Check if user has permission to view this page
  if (!canViewPeriodicReport) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Periodic Report.
      </div>
    );
  }

  return (
    <div className="rto-report-container">
      <h4 className="rto-report-title">Periodic Report</h4>

      <div className="rto-report-card">
        {/* Display API Error at the top - only shows the exact error message */}
        {apiError && (
          <CAlert color="warning" className="mb-3">
            {apiError}
          </CAlert>
        )}

        <div className="date-filter-container">
          {/* Branch Selection */}
          <div className="date-filter-group">
            <label className="date-filter-label">Select Branch:</label>
            {branchLoading ? (
              <div className="date-picker">
                <CSpinner size="sm" />
              </div>
            ) : (
              <CFormSelect
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="date-picker"
                disabled={branches.length === 0}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
            )}
          </div>

          {/* From Date */}
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

          {/* To Date */}
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

          {/* Export to Excel Button */}
          <button 
            className="export-button" 
            onClick={handleExportToExcel} 
            disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
          >
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : 'Export to Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodicReport;