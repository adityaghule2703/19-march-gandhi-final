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
  CProgress
} from '@coreui/react';
import { 
  cilZoomOut, 
  cilChevronLeft, 
  cilChevronRight,
  cilReload
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
  const [modelsTotals, setModelsTotals] = useState(null);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState(null);
  const [modelsSearchTerm, setModelsSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  
  // Branch wise state
  const [branches, setBranches] = useState([]);
  const [branchesTotals, setBranchesTotals] = useState(null);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState(null);
  const [branchesSearchTerm, setBranchesSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  
  // Executive wise state
  const [executives, setExecutives] = useState([]);
  const [executivesTotals, setExecutivesTotals] = useState(null);
  const [executivesLoading, setExecutivesLoading] = useState(true);
  const [executivesError, setExecutivesError] = useState(null);
  const [executivesSearchTerm, setExecutivesSearchTerm] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [executiveModalVisible, setExecutiveModalVisible] = useState(false);
  const [executiveModalTab, setExecutiveModalTab] = useState('bookings');
  
  // Pagination state for model list (server-side)
  const [modelPagination, setModelPagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Pagination state for branch list (server-side)
  const [branchPagination, setBranchPagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Pagination state for executive list (server-side)
  const [executivePagination, setExecutivePagination] = useState({
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Pagination state for bookings inside modals
  const [modelBookingPagination, setModelBookingPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    bookings: []
  });

  const [branchBookingPagination, setBranchBookingPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    bookings: []
  });

  const [executiveBookingPagination, setExecutiveBookingPagination] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    bookings: []
  });

  // Debounce timers
  const modelsSearchTimer = useRef(null);
  const branchesSearchTimer = useRef(null);
  const executivesSearchTimer = useRef(null);
  
  // Input refs to maintain focus
  const modelsSearchInputRef = useRef(null);
  const branchesSearchInputRef = useRef(null);
  const executivesSearchInputRef = useRef(null);

  // Fetch Model Wise Data with server-side pagination and search
  const fetchModelWiseData = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    try {
      setModelsLoading(true);
      setModelsError(null);
      
      const params = {
        page,
        limit,
        search: search.trim()
      };
      
      const response = await axiosInstance.get('/dashboard/sales/model-wise', { params });
      
      if (response.data?.success && response.data?.data) {
        setModels(response.data.data.models || []);
        setModelsTotals(response.data.data.totals || null);
        
        const pagination = response.data.data.pagination;
        if (pagination) {
          setModelPagination({
            currentPage: pagination.page || page,
            limit: pagination.limit || limit,
            total: pagination.total || 0,
            pages: pagination.pages || 0,
            hasNextPage: pagination.hasNextPage || false,
            hasPrevPage: pagination.hasPrevPage || false
          });
        }
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
  }, []);

  // Fetch Branch Wise Data with server-side pagination and search
  const fetchBranchWiseData = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    try {
      setBranchesLoading(true);
      setBranchesError(null);
      
      const params = {
        page,
        limit,
        search: search.trim()
      };
      
      const response = await axiosInstance.get('/dashboard/sales/branch-wise', { params });
      
      if (response.data?.success && response.data?.data) {
        setBranches(response.data.data.branches || []);
        setBranchesTotals(response.data.data.totals || null);
        
        const pagination = response.data.data.pagination;
        if (pagination) {
          setBranchPagination({
            currentPage: pagination.page || page,
            limit: pagination.limit || limit,
            total: pagination.total || 0,
            pages: pagination.pages || 0,
            hasNextPage: pagination.hasNextPage || false,
            hasPrevPage: pagination.hasPrevPage || false
          });
        }
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
  }, []);

  // Fetch Executive Wise Data with server-side pagination and search
  const fetchExecutiveWiseData = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    try {
      setExecutivesLoading(true);
      setExecutivesError(null);
      
      const params = {
        page,
        limit,
        search: search.trim()
      };
      
      const response = await axiosInstance.get('/dashboard/sales/executive-wise', { params });
      
      if (response.data?.success && response.data?.data) {
        setExecutives(response.data.data.executives || []);
        setExecutivesTotals(response.data.data.totals || null);
        
        const pagination = response.data.data.pagination;
        if (pagination) {
          setExecutivePagination({
            currentPage: pagination.page || page,
            limit: pagination.limit || limit,
            total: pagination.total || 0,
            pages: pagination.pages || 0,
            hasNextPage: pagination.hasNextPage || false,
            hasPrevPage: pagination.hasPrevPage || false
          });
        }
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
  }, []);

  // Fetch Model Bookings (server-side)
  const fetchModelBookings = useCallback(async (modelId, page = 1, limit = 10) => {
    if (!modelId) return;
    
    try {
      const params = { page, limit };
      const response = await axiosInstance.get(`/dashboard/sales/model/${modelId}/bookings`, { params });
      
      if (response.data?.success && response.data?.data) {
        const pagination = response.data.data.pagination;
        setModelBookingPagination({
          currentPage: pagination?.page || page,
          limit: pagination?.limit || limit,
          total: pagination?.total || 0,
          pages: pagination?.pages || 0,
          hasNextPage: pagination?.hasNextPage || false,
          hasPrevPage: pagination?.hasPrevPage || false,
          bookings: response.data.data.bookings || []
        });
      }
    } catch (err) {
      console.error('Error fetching model bookings:', err);
      showError(err);
    }
  }, []);

  // Fetch Branch Bookings (server-side)
  const fetchBranchBookings = useCallback(async (branchId, page = 1, limit = 10) => {
    if (!branchId) return;
    
    try {
      const params = { page, limit };
      const response = await axiosInstance.get(`/dashboard/sales/branch/${branchId}/bookings`, { params });
      
      if (response.data?.success && response.data?.data) {
        const pagination = response.data.data.pagination;
        setBranchBookingPagination({
          currentPage: pagination?.page || page,
          limit: pagination?.limit || limit,
          total: pagination?.total || 0,
          pages: pagination?.pages || 0,
          hasNextPage: pagination?.hasNextPage || false,
          hasPrevPage: pagination?.hasPrevPage || false,
          bookings: response.data.data.bookings || []
        });
      }
    } catch (err) {
      console.error('Error fetching branch bookings:', err);
      showError(err);
    }
  }, []);

  // Fetch Executive Bookings (server-side)
  const fetchExecutiveBookings = useCallback(async (executiveId, page = 1, limit = 10) => {
    if (!executiveId) return;
    
    try {
      const params = { page, limit };
      const response = await axiosInstance.get(`/dashboard/sales/executive/${executiveId}/bookings`, { params });
      
      if (response.data?.success && response.data?.data) {
        const pagination = response.data.data.pagination;
        setExecutiveBookingPagination({
          currentPage: pagination?.page || page,
          limit: pagination?.limit || limit,
          total: pagination?.total || 0,
          pages: pagination?.pages || 0,
          hasNextPage: pagination?.hasNextPage || false,
          hasPrevPage: pagination?.hasPrevPage || false,
          bookings: response.data.data.bookings || []
        });
        
        // Also update selected executive with new data
        if (response.data.data.executive) {
          setSelectedExecutive(prev => ({
            ...prev,
            ...response.data.data.executive
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching executive bookings:', err);
      showError(err);
    }
  }, []);

  // Fetch Executive Breakdown (server-side)
  const fetchExecutiveBreakdown = useCallback(async (executiveId) => {
    if (!executiveId) return;
    
    try {
      const response = await axiosInstance.get(`/dashboard/sales/executive/${executiveId}/breakdown`);
      
      if (response.data?.success && response.data?.data) {
        setSelectedExecutive(prev => ({
          ...prev,
          modelBreakdown: response.data.data.modelBreakdown,
          totalSales: response.data.data.totalSales
        }));
      }
    } catch (err) {
      console.error('Error fetching executive breakdown:', err);
      showError(err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchModelWiseData(1, DEFAULT_LIMIT, '');
    fetchBranchWiseData(1, DEFAULT_LIMIT, '');
    fetchExecutiveWiseData(1, DEFAULT_LIMIT, '');
  }, [fetchModelWiseData, fetchBranchWiseData, fetchExecutiveWiseData]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (modelsSearchTimer.current) clearTimeout(modelsSearchTimer.current);
      if (branchesSearchTimer.current) clearTimeout(branchesSearchTimer.current);
      if (executivesSearchTimer.current) clearTimeout(executivesSearchTimer.current);
    };
  }, []);

  // Handle model search with debounce
  const handleModelsSearch = useCallback((value) => {
    setModelsSearchTerm(value);
    
    if (modelsSearchTimer.current) {
      clearTimeout(modelsSearchTimer.current);
    }
    
    modelsSearchTimer.current = setTimeout(() => {
      fetchModelWiseData(1, modelPagination.limit, value);
    }, 500);
  }, [fetchModelWiseData, modelPagination.limit]);

  // Handle branch search with debounce
  const handleBranchesSearch = useCallback((value) => {
    setBranchesSearchTerm(value);
    
    if (branchesSearchTimer.current) {
      clearTimeout(branchesSearchTimer.current);
    }
    
    branchesSearchTimer.current = setTimeout(() => {
      fetchBranchWiseData(1, branchPagination.limit, value);
    }, 500);
  }, [fetchBranchWiseData, branchPagination.limit]);

  // Handle executive search with debounce
  const handleExecutivesSearch = useCallback((value) => {
    setExecutivesSearchTerm(value);
    
    if (executivesSearchTimer.current) {
      clearTimeout(executivesSearchTimer.current);
    }
    
    executivesSearchTimer.current = setTimeout(() => {
      fetchExecutiveWiseData(1, executivePagination.limit, value);
    }, 500);
  }, [fetchExecutiveWiseData, executivePagination.limit]);

  const resetModelsSearch = () => {
    setModelsSearchTerm('');
    if (modelsSearchInputRef.current) {
      modelsSearchInputRef.current.value = '';
    }
    fetchModelWiseData(1, modelPagination.limit, '');
  };

  const resetBranchesSearch = () => {
    setBranchesSearchTerm('');
    if (branchesSearchInputRef.current) {
      branchesSearchInputRef.current.value = '';
    }
    fetchBranchWiseData(1, branchPagination.limit, '');
  };

  const resetExecutivesSearch = () => {
    setExecutivesSearchTerm('');
    if (executivesSearchInputRef.current) {
      executivesSearchInputRef.current.value = '';
    }
    fetchExecutiveWiseData(1, executivePagination.limit, '');
  };

  // Handle model pagination
  const handleModelPageChange = (newPage) => {
    if (newPage < 1 || newPage > modelPagination.pages) return;
    fetchModelWiseData(newPage, modelPagination.limit, modelsSearchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModelLimitChange = (newLimit) => {
    fetchModelWiseData(1, parseInt(newLimit, 10), modelsSearchTerm);
  };

  // Handle branch pagination
  const handleBranchPageChange = (newPage) => {
    if (newPage < 1 || newPage > branchPagination.pages) return;
    fetchBranchWiseData(newPage, branchPagination.limit, branchesSearchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBranchLimitChange = (newLimit) => {
    fetchBranchWiseData(1, parseInt(newLimit, 10), branchesSearchTerm);
  };

  // Handle executive pagination
  const handleExecutivePageChange = (newPage) => {
    if (newPage < 1 || newPage > executivePagination.pages) return;
    fetchExecutiveWiseData(newPage, executivePagination.limit, executivesSearchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExecutiveLimitChange = (newLimit) => {
    fetchExecutiveWiseData(1, parseInt(newLimit, 10), executivesSearchTerm);
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

  // Pagination calculations for display
  const modelStart = modelPagination.total === 0 ? 0 : (modelPagination.currentPage - 1) * modelPagination.limit + 1;
  const modelEnd = Math.min(modelPagination.currentPage * modelPagination.limit, modelPagination.total);

  const branchStart = branchPagination.total === 0 ? 0 : (branchPagination.currentPage - 1) * branchPagination.limit + 1;
  const branchEnd = Math.min(branchPagination.currentPage * branchPagination.limit, branchPagination.total);

  const executiveStart = executivePagination.total === 0 ? 0 : (executivePagination.currentPage - 1) * executivePagination.limit + 1;
  const executiveEnd = Math.min(executivePagination.currentPage * executivePagination.limit, executivePagination.total);

  // Booking pagination calculations
  const modelBookingStart = modelBookingPagination.total === 0 ? 0 : (modelBookingPagination.currentPage - 1) * modelBookingPagination.limit + 1;
  const modelBookingEnd = Math.min(modelBookingPagination.currentPage * modelBookingPagination.limit, modelBookingPagination.total);

  const branchBookingStart = branchBookingPagination.total === 0 ? 0 : (branchBookingPagination.currentPage - 1) * branchBookingPagination.limit + 1;
  const branchBookingEnd = Math.min(branchBookingPagination.currentPage * branchBookingPagination.limit, branchBookingPagination.total);

  const executiveBookingStart = executiveBookingPagination.total === 0 ? 0 : (executiveBookingPagination.currentPage - 1) * executiveBookingPagination.limit + 1;
  const executiveBookingEnd = Math.min(executiveBookingPagination.currentPage * executiveBookingPagination.limit, executiveBookingPagination.total);

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
    if (modelsLoading && models.length === 0) {
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
              <CButton size="sm" variant="outline" onClick={resetModelsSearch}>
                <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
              </CButton>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0">Search:</CFormLabel>
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
              value={modelsSearchTerm}
              onChange={(e) => handleModelsSearch(e.target.value)}
              placeholder="Search by model name, type..."
              autoComplete="off"
            />
            {modelsLoading && <CSpinner size="sm" color="primary" />}
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
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {models.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center text-danger">
                    {modelsSearchTerm ? `No models found matching "${modelsSearchTerm}"` : 'No sales data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                models.map((model, index) => (
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
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>

        {renderPagination(
          modelPagination.currentPage,
          modelPagination.pages,
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
    if (branchesLoading && branches.length === 0) {
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
              <CButton size="sm" variant="outline" onClick={resetBranchesSearch}>
                <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
              </CButton>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0">Search:</CFormLabel>
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
              value={branchesSearchTerm}
              onChange={(e) => handleBranchesSearch(e.target.value)}
              placeholder="Search by branch name, city..."
              autoComplete="off"
            />
            {branchesLoading && <CSpinner size="sm" color="primary" />}
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
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {branches.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center text-danger">
                    {branchesSearchTerm ? `No branches found matching "${branchesSearchTerm}"` : 'No branch sales data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                branches.map((branch, index) => (
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
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>

        {renderPagination(
          branchPagination.currentPage,
          branchPagination.pages,
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
    if (executivesLoading && executives.length === 0) {
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
              <CButton size="sm" variant="outline" onClick={resetExecutivesSearch}>
                <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
              </CButton>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0">Search:</CFormLabel>
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
              value={executivesSearchTerm}
              onChange={(e) => handleExecutivesSearch(e.target.value)}
              placeholder="Search by name, email, mobile..."
              autoComplete="off"
            />
            {executivesLoading && <CSpinner size="sm" color="primary" />}
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
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {executives.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center text-danger">
                    {executivesSearchTerm ? `No executives found matching "${executivesSearchTerm}"` : 'No executive sales data available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                executives.map((executive, index) => (
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
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>

        {renderPagination(
          executivePagination.currentPage,
          executivePagination.pages,
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
      {activeTab === 0 && modelsTotals && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Models</h5>
                <h2 className="mb-0 text-primary">{modelsTotals.totalModels?.toLocaleString() || 0}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Units Sold</h5>
                <h2 className="mb-0 text-success">{modelsTotals.totalQuantity?.toLocaleString() || 0}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Revenue</h5>
                <h2 className="mb-0 text-info">{formatCurrency(modelsTotals.totalRevenue)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-warning">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Discount</h5>
                <h2 className="mb-0 text-warning">{formatCurrency(modelsTotals.totalDiscount)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Summary Cards - Branch Wise */}
      {activeTab === 1 && branchesTotals && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Branches</h5>
                <h2 className="mb-0 text-primary">{branchesTotals.totalBranches?.toLocaleString() || 0}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Units Sold</h5>
                <h2 className="mb-0 text-success">{branchesTotals.totalQuantity?.toLocaleString() || 0}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Revenue</h5>
                <h2 className="mb-0 text-info">{formatCurrency(branchesTotals.totalRevenue)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-secondary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Bookings</h5>
                <h2 className="mb-0 text-secondary">
                  {((branchesTotals.totalBranchBookings || 0) + (branchesTotals.totalSubdealerBookings || 0)).toLocaleString()}
                </h2>
                <small className="text-muted">
                  Branch: {branchesTotals.totalBranchBookings?.toLocaleString() || 0} | 
                  Subdealer: {branchesTotals.totalSubdealerBookings?.toLocaleString() || 0}
                </small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Summary Cards - Executive Wise */}
      {activeTab === 2 && executivesTotals && (
        <CRow className="mt-3 mb-4">
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-primary">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Executives</h5>
                <h2 className="mb-0 text-primary">{executivesTotals.totalExecutives?.toLocaleString() || 0}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-success">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Sales</h5>
                <h2 className="mb-0 text-success">{executivesTotals.totalSales?.toLocaleString() || 0}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-info">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Revenue</h5>
                <h2 className="mb-0 text-info">{formatCurrency(executivesTotals.totalRevenue)}</h2>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3} sm={6} className="mb-3">
            <CCard className="text-center border-warning">
              <CCardBody>
                <h5 className="text-muted mb-2">Total Discount</h5>
                <h2 className="mb-0 text-warning">{formatCurrency(executivesTotals.totalDiscount)}</h2>
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
    </div>
  );
};

export default SalesDetailedReport;