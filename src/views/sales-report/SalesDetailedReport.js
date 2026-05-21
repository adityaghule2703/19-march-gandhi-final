import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CBadge,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormLabel,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTooltip,
  CProgress
} from '@coreui/react';
import { 
  cilZoomOut, 
  cilChevronLeft, 
  cilChevronRight, 
  cilInfo, 
  cilBuilding, 
  cilUser,
  cilChartPie
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { axiosInstance, showError } from '../../utils/tableImports';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const SalesDetailedReport = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Model wise state
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState(null);
  const [modelsSearchTerm, setModelsSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  
  // Branch wise state
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState(null);
  const [branchesSearchTerm, setBranchesSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  
  // Executive wise state
  const [executives, setExecutives] = useState([]);
  const [executivesLoading, setExecutivesLoading] = useState(true);
  const [executivesError, setExecutivesError] = useState(null);
  const [executivesSearchTerm, setExecutivesSearchTerm] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [executiveModalVisible, setExecutiveModalVisible] = useState(false);
  const [executiveModalTab, setExecutiveModalTab] = useState('bookings'); // 'bookings' or 'breakdown'
  
  // Pagination state for model list
  const [modelPagination, setModelPagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    filteredModels: []
  });

  // Pagination state for branch list
  const [branchPagination, setBranchPagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    filteredBranches: []
  });

  // Pagination state for executive list
  const [executivePagination, setExecutivePagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    filteredExecutives: []
  });

  // Pagination state for bookings inside model modal
  const [modelBookingPagination, setModelBookingPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    filteredBookings: []
  });

  // Pagination state for bookings inside branch modal
  const [branchBookingPagination, setBranchBookingPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    filteredBookings: []
  });

  // Pagination state for bookings inside executive modal
  const [executiveBookingPagination, setExecutiveBookingPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    filteredBookings: []
  });

  const modelsSearchTimer = useRef(null);
  const branchesSearchTimer = useRef(null);
  const executivesSearchTimer = useRef(null);
  const modelsSearchInputRef = useRef(null);
  const branchesSearchInputRef = useRef(null);
  const executivesSearchInputRef = useRef(null);

  // Fetch Model Wise Data
  const fetchModelWiseData = async () => {
    try {
      setModelsLoading(true);
      setModelsError(null);
      const response = await axiosInstance.get('/dashboard/sales/model-wise');
      
      if (response.data?.success && response.data?.data?.models) {
        setModels(response.data.data.models);
        setModelPagination(prev => ({
          ...prev,
          total: response.data.data.models.length,
          filteredModels: response.data.data.models
        }));
      } else {
        setModelsError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching model-wise data:', err);
      const errorMsg = showError(err);
      setModelsError(errorMsg || 'Failed to fetch model-wise sales data');
    } finally {
      setModelsLoading(false);
    }
  };

  // Fetch Branch Wise Data
  const fetchBranchWiseData = async () => {
    try {
      setBranchesLoading(true);
      setBranchesError(null);
      const response = await axiosInstance.get('/dashboard/sales/branch-wise');
      
      if (response.data?.success && response.data?.data?.branches) {
        setBranches(response.data.data.branches);
        setBranchPagination(prev => ({
          ...prev,
          total: response.data.data.branches.length,
          filteredBranches: response.data.data.branches
        }));
      } else {
        setBranchesError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching branch-wise data:', err);
      const errorMsg = showError(err);
      setBranchesError(errorMsg || 'Failed to fetch branch-wise sales data');
    } finally {
      setBranchesLoading(false);
    }
  };

  // Fetch Executive Wise Data
  const fetchExecutiveWiseData = async () => {
    try {
      setExecutivesLoading(true);
      setExecutivesError(null);
      const response = await axiosInstance.get('/dashboard/sales/executive-wise');
      
      if (response.data?.success && response.data?.data?.executives) {
        setExecutives(response.data.data.executives);
        setExecutivePagination(prev => ({
          ...prev,
          total: response.data.data.executives.length,
          filteredExecutives: response.data.data.executives
        }));
      } else {
        setExecutivesError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching executive-wise data:', err);
      const errorMsg = showError(err);
      setExecutivesError(errorMsg || 'Failed to fetch executive-wise sales data');
    } finally {
      setExecutivesLoading(false);
    }
  };

  useEffect(() => {
    fetchModelWiseData();
    fetchBranchWiseData();
    fetchExecutiveWiseData();
  }, []);

  // Filter models based on search term
  const filterModels = useCallback(() => {
    if (!models.length) return [];
    
    let filtered = [...models];
    
    if (modelsSearchTerm.trim()) {
      const term = modelsSearchTerm.toLowerCase();
      filtered = filtered.filter(model => 
        model.name?.toLowerCase().includes(term) ||
        model.type?.toLowerCase().includes(term) ||
        model.manufacturer?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [models, modelsSearchTerm]);

  // Filter branches based on search term
  const filterBranches = useCallback(() => {
    if (!branches.length) return [];
    
    let filtered = [...branches];
    
    if (branchesSearchTerm.trim()) {
      const term = branchesSearchTerm.toLowerCase();
      filtered = filtered.filter(branch => 
        branch.name?.toLowerCase().includes(term) ||
        branch.city?.toLowerCase().includes(term) ||
        branch.address?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [branches, branchesSearchTerm]);

  // Filter executives based on search term
  const filterExecutives = useCallback(() => {
    if (!executives.length) return [];
    
    let filtered = [...executives];
    
    if (executivesSearchTerm.trim()) {
      const term = executivesSearchTerm.toLowerCase();
      filtered = filtered.filter(executive => 
        executive.name?.toLowerCase().includes(term) ||
        executive.email?.toLowerCase().includes(term) ||
        executive.mobile?.includes(term) ||
        executive.type?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [executives, executivesSearchTerm]);

  // Update pagination when models or search term changes
  useEffect(() => {
    const filtered = filterModels();
    const start = (modelPagination.currentPage - 1) * modelPagination.limit;
    const paginated = filtered.slice(start, start + modelPagination.limit);
    
    setModelPagination(prev => ({
      ...prev,
      total: filtered.length,
      filteredModels: paginated
    }));
  }, [models, modelsSearchTerm, modelPagination.currentPage, modelPagination.limit, filterModels]);

  // Update pagination when branches or search term changes
  useEffect(() => {
    const filtered = filterBranches();
    const start = (branchPagination.currentPage - 1) * branchPagination.limit;
    const paginated = filtered.slice(start, start + branchPagination.limit);
    
    setBranchPagination(prev => ({
      ...prev,
      total: filtered.length,
      filteredBranches: paginated
    }));
  }, [branches, branchesSearchTerm, branchPagination.currentPage, branchPagination.limit, filterBranches]);

  // Update pagination when executives or search term changes
  useEffect(() => {
    const filtered = filterExecutives();
    const start = (executivePagination.currentPage - 1) * executivePagination.limit;
    const paginated = filtered.slice(start, start + executivePagination.limit);
    
    setExecutivePagination(prev => ({
      ...prev,
      total: filtered.length,
      filteredExecutives: paginated
    }));
  }, [executives, executivesSearchTerm, executivePagination.currentPage, executivePagination.limit, filterExecutives]);

  // Reset to first page when search term changes
  useEffect(() => {
    setModelPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [modelsSearchTerm]);

  useEffect(() => {
    setBranchPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [branchesSearchTerm]);

  useEffect(() => {
    setExecutivePagination(prev => ({ ...prev, currentPage: 1 }));
  }, [executivesSearchTerm]);

  // Handle search with debounce
  const handleModelsSearch = (value) => {
    clearTimeout(modelsSearchTimer.current);
    modelsSearchTimer.current = setTimeout(() => {
      setModelsSearchTerm(value);
    }, 300);
  };

  const handleBranchesSearch = (value) => {
    clearTimeout(branchesSearchTimer.current);
    branchesSearchTimer.current = setTimeout(() => {
      setBranchesSearchTerm(value);
    }, 300);
  };

  const handleExecutivesSearch = (value) => {
    clearTimeout(executivesSearchTimer.current);
    executivesSearchTimer.current = setTimeout(() => {
      setExecutivesSearchTerm(value);
    }, 300);
  };

  const resetModelsSearch = () => {
    setModelsSearchTerm('');
    if (modelsSearchInputRef.current) {
      modelsSearchInputRef.current.value = '';
    }
  };

  const resetBranchesSearch = () => {
    setBranchesSearchTerm('');
    if (branchesSearchInputRef.current) {
      branchesSearchInputRef.current.value = '';
    }
  };

  const resetExecutivesSearch = () => {
    setExecutivesSearchTerm('');
    if (executivesSearchInputRef.current) {
      executivesSearchInputRef.current.value = '';
    }
  };

  // Handle model pagination
  const handleModelPageChange = (newPage) => {
    if (newPage < 1 || newPage > totalModelPages) return;
    setModelPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModelLimitChange = (newLimit) => {
    setModelPagination({
      currentPage: 1,
      limit: parseInt(newLimit, 10),
      total: modelPagination.total,
      filteredModels: []
    });
  };

  // Handle branch pagination
  const handleBranchPageChange = (newPage) => {
    if (newPage < 1 || newPage > totalBranchPages) return;
    setBranchPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBranchLimitChange = (newLimit) => {
    setBranchPagination({
      currentPage: 1,
      limit: parseInt(newLimit, 10),
      total: branchPagination.total,
      filteredBranches: []
    });
  };

  // Handle executive pagination
  const handleExecutivePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalExecutivePages) return;
    setExecutivePagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExecutiveLimitChange = (newLimit) => {
    setExecutivePagination({
      currentPage: 1,
      limit: parseInt(newLimit, 10),
      total: executivePagination.total,
      filteredExecutives: []
    });
  };

  // Handle modal open with selected model
  const handleViewModelBookings = (model) => {
    setSelectedModel(model);
    setModelBookingPagination({
      currentPage: 1,
      limit: 10,
      total: model.bookings?.length || 0,
      filteredBookings: model.bookings?.slice(0, 10) || []
    });
    setModelModalVisible(true);
  };

  // Handle modal open with selected branch
  const handleViewBranchBookings = (branch) => {
    setSelectedBranch(branch);
    setBranchBookingPagination({
      currentPage: 1,
      limit: 10,
      total: branch.bookings?.length || 0,
      filteredBookings: branch.bookings?.slice(0, 10) || []
    });
    setBranchModalVisible(true);
  };

  // Handle modal open with selected executive
  const handleViewExecutiveDetails = (executive) => {
    setSelectedExecutive(executive);
    setExecutiveModalTab('bookings');
    setExecutiveBookingPagination({
      currentPage: 1,
      limit: 10,
      total: executive.bookings?.length || 0,
      filteredBookings: executive.bookings?.slice(0, 10) || []
    });
    setExecutiveModalVisible(true);
  };

  // Handle model booking pagination
  const handleModelBookingPageChange = (newPage) => {
    if (!selectedModel) return;
    
    const bookings = selectedModel.bookings || [];
    const start = (newPage - 1) * modelBookingPagination.limit;
    const paginated = bookings.slice(start, start + modelBookingPagination.limit);
    
    setModelBookingPagination({
      ...modelBookingPagination,
      currentPage: newPage,
      filteredBookings: paginated
    });
  };

  const handleModelBookingLimitChange = (newLimit) => {
    if (!selectedModel) return;
    
    const bookings = selectedModel.bookings || [];
    const limit = parseInt(newLimit, 10);
    const paginated = bookings.slice(0, limit);
    
    setModelBookingPagination({
      currentPage: 1,
      limit: limit,
      total: bookings.length,
      filteredBookings: paginated
    });
  };

  // Handle branch booking pagination
  const handleBranchBookingPageChange = (newPage) => {
    if (!selectedBranch) return;
    
    const bookings = selectedBranch.bookings || [];
    const start = (newPage - 1) * branchBookingPagination.limit;
    const paginated = bookings.slice(start, start + branchBookingPagination.limit);
    
    setBranchBookingPagination({
      ...branchBookingPagination,
      currentPage: newPage,
      filteredBookings: paginated
    });
  };

  const handleBranchBookingLimitChange = (newLimit) => {
    if (!selectedBranch) return;
    
    const bookings = selectedBranch.bookings || [];
    const limit = parseInt(newLimit, 10);
    const paginated = bookings.slice(0, limit);
    
    setBranchBookingPagination({
      currentPage: 1,
      limit: limit,
      total: bookings.length,
      filteredBookings: paginated
    });
  };

  // Handle executive booking pagination
  const handleExecutiveBookingPageChange = (newPage) => {
    if (!selectedExecutive) return;
    
    const bookings = selectedExecutive.bookings || [];
    const start = (newPage - 1) * executiveBookingPagination.limit;
    const paginated = bookings.slice(start, start + executiveBookingPagination.limit);
    
    setExecutiveBookingPagination({
      ...executiveBookingPagination,
      currentPage: newPage,
      filteredBookings: paginated
    });
  };

  const handleExecutiveBookingLimitChange = (newLimit) => {
    if (!selectedExecutive) return;
    
    const bookings = selectedExecutive.bookings || [];
    const limit = parseInt(newLimit, 10);
    const paginated = bookings.slice(0, limit);
    
    setExecutiveBookingPagination({
      currentPage: 1,
      limit: limit,
      total: bookings.length,
      filteredBookings: paginated
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate totals for models
  const totalModels = models.length;
  const totalModelQuantity = models.reduce((sum, model) => sum + (model.quantity || 0), 0);
  const totalModelRevenue = models.reduce((sum, model) => sum + (model.totalRevenue || 0), 0);
  const totalModelDiscount = models.reduce((sum, model) => sum + (model.totalDiscount || 0), 0);

  // Calculate totals for branches
  const totalBranches = branches.length;
  const totalBranchQuantity = branches.reduce((sum, branch) => sum + (branch.quantity || 0), 0);
  const totalBranchRevenue = branches.reduce((sum, branch) => sum + (branch.totalRevenue || 0), 0);
  const totalBranchBookings = branches.reduce((sum, branch) => sum + (branch.branchBookings || 0), 0);
  const totalSubdealerBookings = branches.reduce((sum, branch) => sum + (branch.subdealerBookings || 0), 0);

  // Calculate totals for executives
  const totalExecutives = executives.length;
  const totalExecutiveSales = executives.reduce((sum, exec) => sum + (exec.totalSales || 0), 0);
  const totalExecutiveRevenue = executives.reduce((sum, exec) => sum + (exec.totalRevenue || 0), 0);
  const totalExecutiveDiscount = executives.reduce((sum, exec) => sum + (exec.totalDiscount || 0), 0);

  // Pagination calculations
  const totalModelPages = Math.ceil(modelPagination.total / modelPagination.limit);
  const modelStart = (modelPagination.currentPage - 1) * modelPagination.limit + 1;
  const modelEnd = Math.min(modelPagination.currentPage * modelPagination.limit, modelPagination.total);

  const totalBranchPages = Math.ceil(branchPagination.total / branchPagination.limit);
  const branchStart = (branchPagination.currentPage - 1) * branchPagination.limit + 1;
  const branchEnd = Math.min(branchPagination.currentPage * branchPagination.limit, branchPagination.total);

  const totalExecutivePages = Math.ceil(executivePagination.total / executivePagination.limit);
  const executiveStart = (executivePagination.currentPage - 1) * executivePagination.limit + 1;
  const executiveEnd = Math.min(executivePagination.currentPage * executivePagination.limit, executivePagination.total);

  // Booking pagination calculations
  const totalModelBookingPages = Math.ceil(modelBookingPagination.total / modelBookingPagination.limit);
  const modelBookingStart = (modelBookingPagination.currentPage - 1) * modelBookingPagination.limit + 1;
  const modelBookingEnd = Math.min(modelBookingPagination.currentPage * modelBookingPagination.limit, modelBookingPagination.total);

  const totalBranchBookingPages = Math.ceil(branchBookingPagination.total / branchBookingPagination.limit);
  const branchBookingStart = (branchBookingPagination.currentPage - 1) * branchBookingPagination.limit + 1;
  const branchBookingEnd = Math.min(branchBookingPagination.currentPage * branchBookingPagination.limit, branchBookingPagination.total);

  const totalExecutiveBookingPages = Math.ceil(executiveBookingPagination.total / executiveBookingPagination.limit);
  const executiveBookingStart = (executiveBookingPagination.currentPage - 1) * executiveBookingPagination.limit + 1;
  const executiveBookingEnd = Math.min(executiveBookingPagination.currentPage * executiveBookingPagination.limit, executiveBookingPagination.total);

  // Get top models for executive breakdown
  const getTopModels = (modelBreakdown) => {
    if (!modelBreakdown) return [];
    return Object.entries(modelBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  // Render pagination component
  const renderPagination = (currentPage, totalPages, onPageChange, onLimitChange, currentLimit, total, start, end, isLoading = false) => {
    if (total === 0) return null;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }
    
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>
              Rows per page:
            </CFormLabel>
            <CFormSelect
              value={currentLimit}
              onChange={(e) => onLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={isLoading}
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {isLoading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
          </span>
        </div>
        
        {totalPages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || isLoading}
            >
              «
            </CPaginationItem>
            <CPaginationItem
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            
            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => onPageChange(1)} disabled={isLoading}>
                  1
                </CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            
            {pageNumbers.map(page => (
              <CPaginationItem
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
              >
                {page}
              </CPaginationItem>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => onPageChange(totalPages)} disabled={isLoading}>
                  {totalPages}
                </CPaginationItem>
              </>
            )}
            
            <CPaginationItem
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // Render Model Wise Tab
  const renderModelWiseTab = () => {
    if (modelsLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (modelsError) {
      return <CAlert color="danger">{modelsError}</CAlert>;
    }

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <div>
            {modelsSearchTerm && (
              <CButton size="sm" className="action-btn" onClick={resetModelsSearch}>
                <CIcon icon={cilZoomOut} className="icon" /> Reset Search
              </CButton>
            )}
          </div>
          <div className="d-flex align-items-center">
            <CFormLabel className="mb-0 me-2">Search:</CFormLabel>
            <input
              ref={modelsSearchInputRef}
              type="text"
              style={{ 
                width: '250px', 
                height: '32px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da', 
                padding: '0 8px', 
                outline: 'none', 
                fontSize: '14px' 
              }}
              className="d-inline-block"
              onChange={(e) => handleModelsSearch(e.target.value)}
              placeholder="Search by model name, type..."
              autoComplete="off"
            />
          </div>
        </div>

        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className="responsive-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" style={{ width: '50px' }}>#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">Manufacturer</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Quantity</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Total Revenue</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Total Discount</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Avg. Price</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Avg. Discount</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">Discount %</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {modelPagination.filteredModels.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" className="text-center text-danger">
                    {modelsSearchTerm ? `No models found matching "${modelsSearchTerm}"` : 'No sales data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                modelPagination.filteredModels.map((model, index) => (
                  <CTableRow key={model.id || index}>
                    <CTableDataCell>{modelStart + index}</CTableDataCell>
                    <CTableDataCell>
                      <strong>{model.name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={model.type === 'ICE' ? 'primary' : 'success'}>
                        {model.type || 'N/A'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{model.manufacturer || '—'}</CTableDataCell>
                    <CTableDataCell className="text-end">{model.quantity?.toLocaleString() || 0}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(model.totalRevenue)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(model.totalDiscount)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(model.averagePrice)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(model.averageDiscount)}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="secondary">
                        {model.discountPercentage?.toFixed(2)}%
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CTooltip content="View Bookings">
                        <CButton
                          size="sm"
                          variant="outline"
                          color="info"
                          onClick={() => handleViewModelBookings(model)}
                        >
                          <CIcon icon={cilInfo} /> Bookings
                        </CButton>
                      </CTooltip>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>

        {renderPagination(
          modelPagination.currentPage,
          totalModelPages,
          handleModelPageChange,
          handleModelLimitChange,
          modelPagination.limit,
          modelPagination.total,
          modelStart,
          modelEnd,
          modelsLoading
        )}
      </>
    );
  };

  // Render Branch Wise Tab
  const renderBranchWiseTab = () => {
    if (branchesLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (branchesError) {
      return <CAlert color="danger">{branchesError}</CAlert>;
    }

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <div>
            {branchesSearchTerm && (
              <CButton size="sm" className="action-btn" onClick={resetBranchesSearch}>
                <CIcon icon={cilZoomOut} className="icon" /> Reset Search
              </CButton>
            )}
          </div>
          <div className="d-flex align-items-center">
            <CFormLabel className="mb-0 me-2">Search:</CFormLabel>
            <input
              ref={branchesSearchInputRef}
              type="text"
              style={{ 
                width: '250px', 
                height: '32px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da', 
                padding: '0 8px', 
                outline: 'none', 
                fontSize: '14px' 
              }}
              className="d-inline-block"
              onChange={(e) => handleBranchesSearch(e.target.value)}
              placeholder="Search by branch name, city..."
              autoComplete="off"
            />
          </div>
        </div>

        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className="responsive-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" style={{ width: '50px' }}>#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Branch Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">City</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Quantity</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Total Revenue</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Branch Bookings</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Subdealer Bookings</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {branchPagination.filteredBranches.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" className="text-center text-danger">
                    {branchesSearchTerm ? `No branches found matching "${branchesSearchTerm}"` : 'No branch sales data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                branchPagination.filteredBranches.map((branch, index) => (
                  <CTableRow key={branch.id || index}>
                    <CTableDataCell>{branchStart + index}</CTableDataCell>
                    <CTableDataCell>
                      <strong>{branch.name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{branch.city || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <div style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                        {branch.address || '—'}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-end">{branch.quantity?.toLocaleString() || 0}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(branch.totalRevenue)}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CBadge color="success">
                        {branch.branchBookings?.toLocaleString() || 0}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CBadge color="info">
                        {branch.subdealerBookings?.toLocaleString() || 0}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CTooltip content="View Bookings">
                        <CButton
                          size="sm"
                          variant="outline"
                          color="info"
                          onClick={() => handleViewBranchBookings(branch)}
                        >
                          <CIcon icon={cilBuilding} /> Bookings
                        </CButton>
                      </CTooltip>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>

        {renderPagination(
          branchPagination.currentPage,
          totalBranchPages,
          handleBranchPageChange,
          handleBranchLimitChange,
          branchPagination.limit,
          branchPagination.total,
          branchStart,
          branchEnd,
          branchesLoading
        )}
      </>
    );
  };

  // Render Executive Wise Tab
  const renderExecutiveWiseTab = () => {
    if (executivesLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (executivesError) {
      return <CAlert color="danger">{executivesError}</CAlert>;
    }

    return (
      <>
        <div className="d-flex justify-content-between mb-3">
          <div>
            {executivesSearchTerm && (
              <CButton size="sm" className="action-btn" onClick={resetExecutivesSearch}>
                <CIcon icon={cilZoomOut} className="icon" /> Reset Search
              </CButton>
            )}
          </div>
          <div className="d-flex align-items-center">
            <CFormLabel className="mb-0 me-2">Search:</CFormLabel>
            <input
              ref={executivesSearchInputRef}
              type="text"
              style={{ 
                width: '250px', 
                height: '32px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da', 
                padding: '0 8px', 
                outline: 'none', 
                fontSize: '14px' 
              }}
              className="d-inline-block"
              onChange={(e) => handleExecutivesSearch(e.target.value)}
              placeholder="Search by name, email, mobile..."
              autoComplete="off"
            />
          </div>
        </div>

        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className="responsive-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" style={{ width: '50px' }}>#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Executive Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Total Sales</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Total Revenue</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Total Discount</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Branch Bookings</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end">Subdealer Bookings</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {executivePagination.filteredExecutives.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" className="text-center text-danger">
                    {executivesSearchTerm ? `No executives found matching "${executivesSearchTerm}"` : 'No executive sales data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                executivePagination.filteredExecutives.map((executive, index) => {
                  const topModels = getTopModels(executive.modelBreakdown);
                  return (
                    <CTableRow key={executive.id || index}>
                      <CTableDataCell>{executiveStart + index}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{executive.name}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{executive.email || '—'}</CTableDataCell>
                      <CTableDataCell>{executive.mobile || '—'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={executive.type === 'BRANCH_EXECUTIVE' ? 'primary' : 'secondary'}>
                          {executive.type?.replace('_', ' ') || '—'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">{executive.totalSales?.toLocaleString() || 0}</CTableDataCell>
                      <CTableDataCell className="text-end">{formatCurrency(executive.totalRevenue)}</CTableDataCell>
                      <CTableDataCell className="text-end">{formatCurrency(executive.totalDiscount)}</CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CBadge color="success">
                          {executive.branchBookings?.toLocaleString() || 0}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CBadge color="info">
                          {executive.subdealerBookings?.toLocaleString() || 0}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          <CTooltip content="View Details">
                            <CButton
                              size="sm"
                              variant="outline"
                              color="info"
                              onClick={() => handleViewExecutiveDetails(executive)}
                            >
                              <CIcon icon={cilUser} /> Details
                            </CButton>
                          </CTooltip>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              )}
            </CTableBody>
          </CTable>
        </div>

        {renderPagination(
          executivePagination.currentPage,
          totalExecutivePages,
          handleExecutivePageChange,
          handleExecutiveLimitChange,
          executivePagination.limit,
          executivePagination.total,
          executiveStart,
          executiveEnd,
          executivesLoading
        )}
      </>
    );
  };

  return (
    <div>
      <div className="title">Sales Detailed Report</div>

      {/* Summary Cards - Model Wise */}
      {activeTab === 0 && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Models</h5>
                <h2 className="mb-0 text-primary">{totalModels}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Units Sold</h5>
                <h2 className="mb-0 text-success">{totalModelQuantity.toLocaleString()}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Revenue</h5>
                <h2 className="mb-0 text-info">{formatCurrency(totalModelRevenue)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-warning">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Discount</h5>
                <h2 className="mb-0 text-warning">{formatCurrency(totalModelDiscount)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Summary Cards - Branch Wise */}
      {activeTab === 1 && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Branches</h5>
                <h2 className="mb-0 text-primary">{totalBranches}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Units Sold</h5>
                <h2 className="mb-0 text-success">{totalBranchQuantity.toLocaleString()}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Revenue</h5>
                <h2 className="mb-0 text-info">{formatCurrency(totalBranchRevenue)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-secondary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Bookings</h5>
                <h2 className="mb-0 text-secondary">{(totalBranchBookings + totalSubdealerBookings).toLocaleString()}</h2>
                <small className="text-muted">
                  Branch: {totalBranchBookings.toLocaleString()} | Subdealer: {totalSubdealerBookings.toLocaleString()}
                </small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Summary Cards - Executive Wise */}
      {activeTab === 2 && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Executives</h5>
                <h2 className="mb-0 text-primary">{totalExecutives}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Sales</h5>
                <h2 className="mb-0 text-success">{totalExecutiveSales.toLocaleString()}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Revenue</h5>
                <h2 className="mb-0 text-info">{formatCurrency(totalExecutiveRevenue)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-warning">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Discount</h5>
                <h2 className="mb-0 text-warning">{formatCurrency(totalExecutiveDiscount)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CCard className="table-container">
        <CCardHeader className="card-header">
          <CNav variant="tabs" className="mb-0">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none'
                }}
              >
                Model Wise
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Branch Wise
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Executive Wise
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>

        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderModelWiseTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderBranchWiseTab()}
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              {renderExecutiveWiseTab()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Model Bookings Modal */}
      <CModal 
        visible={modelModalVisible} 
        onClose={() => setModelModalVisible(false)} 
        size="lg"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            Bookings for {selectedModel?.name}
            {selectedModel && (
              <span className="ms-2 text-muted small">
                (Total: {selectedModel.bookingsCount || selectedModel.bookings?.length || 0} bookings)
              </span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedModel && (
            <>
              <div className="mb-3 p-2 bg-light rounded">
                <CRow>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Total Revenue</small>
                    <div className="fw-bold">{formatCurrency(selectedModel.totalRevenue)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Total Discount</small>
                    <div className="fw-bold">{formatCurrency(selectedModel.totalDiscount)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Avg. Price</small>
                    <div className="fw-bold">{formatCurrency(selectedModel.averagePrice)}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Discount %</small>
                    <div className="fw-bold">{selectedModel.discountPercentage?.toFixed(2)}%</div>
                  </CCol>
                </CRow>
              </div>

              <div className="responsive-table-wrapper">
                <CTable striped bordered hover size="sm">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                      <CTableHeaderCell>Booking No.</CTableHeaderCell>
                      <CTableHeaderCell>Customer Name</CTableHeaderCell>
                      <CTableHeaderCell>Branch</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Discount</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {modelBookingPagination.filteredBookings.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="text-center text-danger">
                          No bookings available
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      modelBookingPagination.filteredBookings.map((booking, idx) => (
                        <CTableRow key={booking.bookingNumber || idx}>
                          <CTableDataCell>{modelBookingStart + idx}</CTableDataCell>
                          <CTableDataCell>
                            <span className="fw-medium">{booking.bookingNumber}</span>
                          </CTableDataCell>
                          <CTableDataCell>{booking.customerName || '—'}</CTableDataCell>
                          <CTableDataCell>{booking.branchName || '—'}</CTableDataCell>
                          <CTableDataCell className="text-end">{formatCurrency(booking.amount)}</CTableDataCell>
                          <CTableDataCell className="text-end">{formatCurrency(booking.discount)}</CTableDataCell>
                          <CTableDataCell>{formatDate(booking.date)}</CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>

              {renderPagination(
                modelBookingPagination.currentPage,
                totalModelBookingPages,
                handleModelBookingPageChange,
                handleModelBookingLimitChange,
                modelBookingPagination.limit,
                modelBookingPagination.total,
                modelBookingStart,
                modelBookingEnd,
                false
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModelModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Branch Bookings Modal */}
      <CModal 
        visible={branchModalVisible} 
        onClose={() => setBranchModalVisible(false)} 
        size="lg"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            Bookings for {selectedBranch?.name}
            {selectedBranch && (
              <span className="ms-2 text-muted small">
                (Total: {selectedBranch.bookings?.length || 0} bookings)
              </span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBranch && (
            <>
              <div className="mb-3 p-2 bg-light rounded">
                <CRow>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Total Revenue</small>
                    <div className="fw-bold">{formatCurrency(selectedBranch.totalRevenue)}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Branch Bookings</small>
                    <div className="fw-bold text-success">{selectedBranch.branchBookings?.toLocaleString() || 0}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Subdealer Bookings</small>
                    <div className="fw-bold text-info">{selectedBranch.subdealerBookings?.toLocaleString() || 0}</div>
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol md={12}>
                    <small className="text-muted">Address</small>
                    <div className="small">{selectedBranch.address || '—'}</div>
                  </CCol>
                </CRow>
              </div>

              <div className="responsive-table-wrapper">
                <CTable striped bordered hover size="sm">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                      <CTableHeaderCell>Booking No.</CTableHeaderCell>
                      <CTableHeaderCell>Model Name</CTableHeaderCell>
                      <CTableHeaderCell>Customer Name</CTableHeaderCell>
                      <CTableHeaderCell>Booking Type</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {branchBookingPagination.filteredBookings.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="text-center text-danger">
                          No bookings available
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      branchBookingPagination.filteredBookings.map((booking, idx) => (
                        <CTableRow key={booking.bookingNumber || idx}>
                          <CTableDataCell>{branchBookingStart + idx}</CTableDataCell>
                          <CTableDataCell>
                            <span className="fw-medium">{booking.bookingNumber}</span>
                          </CTableDataCell>
                          <CTableDataCell>{booking.modelName || '—'}</CTableDataCell>
                          <CTableDataCell>{booking.customerName || '—'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={booking.bookingType === 'BRANCH' ? 'success' : 'info'}>
                              {booking.bookingType || '—'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-end">{formatCurrency(booking.amount)}</CTableDataCell>
                          <CTableDataCell>{formatDate(booking.date)}</CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>

              {renderPagination(
                branchBookingPagination.currentPage,
                totalBranchBookingPages,
                handleBranchBookingPageChange,
                handleBranchBookingLimitChange,
                branchBookingPagination.limit,
                branchBookingPagination.total,
                branchBookingStart,
                branchBookingEnd,
                false
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBranchModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Executive Details Modal */}
      <CModal 
        visible={executiveModalVisible} 
        onClose={() => setExecutiveModalVisible(false)} 
        size="xl"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            Executive Details: {selectedExecutive?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedExecutive && (
            <>
              {/* Executive Info */}
              <div className="mb-3 p-3 bg-light rounded">
                <CRow>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Email</small>
                    <div className="fw-bold">{selectedExecutive.email || '—'}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Mobile</small>
                    <div className="fw-bold">{selectedExecutive.mobile || '—'}</div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Type</small>
                    <div>
                      <CBadge color={selectedExecutive.type === 'BRANCH_EXECUTIVE' ? 'primary' : 'secondary'}>
                        {selectedExecutive.type?.replace('_', ' ') || '—'}
                      </CBadge>
                    </div>
                  </CCol>
                  <CCol md={3} sm={6}>
                    <small className="text-muted">Total Sales</small>
                    <div className="fw-bold text-success">{selectedExecutive.totalSales?.toLocaleString() || 0}</div>
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Total Revenue</small>
                    <div className="fw-bold text-info">{formatCurrency(selectedExecutive.totalRevenue)}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Total Discount</small>
                    <div className="fw-bold text-warning">{formatCurrency(selectedExecutive.totalDiscount)}</div>
                  </CCol>
                  <CCol md={4} sm={6}>
                    <small className="text-muted">Avg. Discount per Sale</small>
                    <div className="fw-bold">
                      {selectedExecutive.totalSales > 0 
                        ? formatCurrency(selectedExecutive.totalDiscount / selectedExecutive.totalSales)
                        : formatCurrency(0)}
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Tabs inside modal */}
              <CNav variant="tabs" className="mb-3">
                <CNavItem>
                  <CNavLink
                    active={executiveModalTab === 'bookings'}
                    onClick={() => setExecutiveModalTab('bookings')}
                    style={{ cursor: 'pointer' }}
                  >
                    Bookings ({selectedExecutive.bookings?.length || 0})
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={executiveModalTab === 'breakdown'}
                    onClick={() => setExecutiveModalTab('breakdown')}
                    style={{ cursor: 'pointer' }}
                  >
                    Model Breakdown
                  </CNavLink>
                </CNavItem>
              </CNav>

              {/* Bookings Tab */}
              {executiveModalTab === 'bookings' && (
                <>
                  <div className="responsive-table-wrapper">
                    <CTable striped bordered hover size="sm">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                          <CTableHeaderCell>Booking No.</CTableHeaderCell>
                          <CTableHeaderCell>Model Name</CTableHeaderCell>
                          <CTableHeaderCell>Customer Name</CTableHeaderCell>
                          <CTableHeaderCell>Branch</CTableHeaderCell>
                          <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                          <CTableHeaderCell className="text-end">Discount</CTableHeaderCell>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {executiveBookingPagination.filteredBookings.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan="8" className="text-center text-danger">
                              No bookings available
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          executiveBookingPagination.filteredBookings.map((booking, idx) => (
                            <CTableRow key={booking.bookingNumber || idx}>
                              <CTableDataCell>{executiveBookingStart + idx}</CTableDataCell>
                              <CTableDataCell>
                                <span className="fw-medium">{booking.bookingNumber}</span>
                              </CTableDataCell>
                              <CTableDataCell>{booking.modelName || '—'}</CTableDataCell>
                              <CTableDataCell>{booking.customerName || '—'}</CTableDataCell>
                              <CTableDataCell>{booking.branchName || '—'}</CTableDataCell>
                              <CTableDataCell className="text-end">{formatCurrency(booking.amount)}</CTableDataCell>
                              <CTableDataCell className="text-end">{formatCurrency(booking.discount)}</CTableDataCell>
                              <CTableDataCell>{formatDate(booking.date)}</CTableDataCell>
                            </CTableRow>
                          ))
                        )}
                      </CTableBody>
                    </CTable>
                  </div>

                  {renderPagination(
                    executiveBookingPagination.currentPage,
                    totalExecutiveBookingPages,
                    handleExecutiveBookingPageChange,
                    handleExecutiveBookingLimitChange,
                    executiveBookingPagination.limit,
                    executiveBookingPagination.total,
                    executiveBookingStart,
                    executiveBookingEnd,
                    false
                  )}
                </>
              )}

              {/* Model Breakdown Tab */}
              {executiveModalTab === 'breakdown' && selectedExecutive.modelBreakdown && (
                <div className="responsive-table-wrapper">
                  <CTable striped bordered hover size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '50px' }}>#</CTableHeaderCell>
                        <CTableHeaderCell>Model Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Quantity Sold</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '200px' }}>Distribution</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {Object.entries(selectedExecutive.modelBreakdown).length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan="4" className="text-center text-danger">
                            No model breakdown data available
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        Object.entries(selectedExecutive.modelBreakdown)
                          .sort((a, b) => b[1] - a[1])
                          .map(([modelName, quantity], idx) => {
                            const percentage = (quantity / selectedExecutive.totalSales) * 100;
                            return (
                              <CTableRow key={idx}>
                                <CTableDataCell>{idx + 1}</CTableDataCell>
                                <CTableDataCell>
                                  <strong>{modelName}</strong>
                                </CTableDataCell>
                                <CTableDataCell className="text-end">
                                  <CBadge color="primary">{quantity.toLocaleString()}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="d-flex align-items-center gap-2">
                                    <CProgress 
                                      value={percentage} 
                                      color="primary" 
                                      style={{ height: '8px', flex: 1 }}
                                    />
                                    <span className="small text-muted" style={{ minWidth: '45px' }}>
                                      {percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            );
                          })
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setExecutiveModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default SalesDetailedReport;