import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  axiosInstance,
  showError
} from '../../../utils/tableImports';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormLabel, 
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner,
  CBadge,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CRow,
  CCol,
  CAlert,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilChevronLeft,
  cilChevronRight,
  cilSearch,
  cilUser,
  cilMoney,
  cilBook,
  cilChartPie,
  cilStar
} from '@coreui/icons';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

const IncentiveSummary = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [summaryData, setSummaryData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 1
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimer = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch summary data
  useEffect(() => {
    fetchSummary();
  }, []);

  // Update displayed users when search or pagination changes
  useEffect(() => {
    filterAndPaginateUsers();
  }, [allUsers, searchTerm, pagination.page, pagination.limit]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/incentives/performance/summary');
      
      if (response.data.success) {
        const data = response.data.data;
        setSummaryData(data);
        setTopPerformers(data.topPerformers || []);
        setAllUsers(data.allUsers || []);
        setDisplayUsers(data.allUsers || []);
        setPagination({
          page: 1,
          limit: DEFAULT_LIMIT,
          totalCount: data.allUsers?.length || 0,
          totalPages: Math.ceil((data.allUsers?.length || 0) / DEFAULT_LIMIT)
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError(error.response?.data?.message || 'Failed to fetch summary data');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateUsers = () => {
    let filtered = [...allUsers];
    
    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    }
    
    // Update pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    
    setDisplayUsers(filtered.slice(start, end));
    setPagination(prev => ({
      ...prev,
      totalCount: totalCount,
      totalPages: totalPages
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit, 10),
      page: 1
    }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString();
  };

  const getRankBadge = (index) => {
    if (index === 0) {
      return <CBadge color="warning" className="p-2" style={{ minWidth: '50px' }}>🥇 1st</CBadge>;
    }
    if (index === 1) {
      return <CBadge color="secondary" className="p-2" style={{ minWidth: '50px' }}>🥈 2nd</CBadge>;
    }
    if (index === 2) {
      return <CBadge color="danger" className="p-2" style={{ minWidth: '50px' }}>🥉 3rd</CBadge>;
    }
    return <CBadge color="dark" className="p-2" style={{ minWidth: '50px', color: '#fff' }}>#{index + 1}</CBadge>;
  };

  // Pagination calculation
  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.totalCount);
  
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.totalPages, pagination.page + 2);
  if (pagination.page <= 3) endPage = Math.min(5, pagination.totalPages);
  if (pagination.page >= pagination.totalPages - 2) startPage = Math.max(1, pagination.totalPages - 4);
  
  const displayedPages = [];
  for (let i = startPage; i <= endPage; i++) displayedPages.push(i);

  // Render pagination component
  const renderPagination = () => {
    if (!pagination.totalCount || pagination.totalPages <= 1) return null;

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={pagination.limit}
              onChange={e => handleLimitChange(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }}
              size="sm"
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${startRecord}–${endRecord} of ${pagination.totalCount} entries`}
          </span>
        </div>
        {pagination.totalPages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={pagination.page === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {displayedPages.map(p => (
              <CPaginationItem key={p} active={p === pagination.page} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}

            {endPage < pagination.totalPages && (
              <>
                {endPage < pagination.totalPages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={loading}>{pagination.totalPages}</CPaginationItem>
              </>
            )}

            <CPaginationItem onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  if (error && !summaryData) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Incentive Summary</div>

      {/* Summary Cards */}
      {summaryData && (
        <CRow className="mb-3">
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatNumber(summaryData.totalUsers)}</h5>
                <small className="text-muted">Total Users</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatNumber(summaryData.totalBookings)}</h5>
                <small className="text-muted">Total Bookings</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatCurrency(summaryData.totalIncentive)}</h5>
                <small className="text-muted">Total Incentive</small>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center bg-light">
              <CCardBody>
                <h5>{formatNumber(summaryData.topPerformers?.length || 0)}</h5>
                <small className="text-muted">Top Performers</small>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Combined Users Table */}
      <CCard className='table-container'>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <CIcon icon={cilStar} className="me-2" />
              All Users Performance
            </h6>
            {topPerformers.length > 0 && (
              <CBadge color="warning" className="p-2">
                <CIcon icon={cilStar} className="me-1" />
                Top {topPerformers.length} Performers Highlighted
              </CBadge>
            )}
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Search Bar */}
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <input
                ref={searchInputRef}
                type="text"
                defaultValue=""
                style={{
                  maxWidth: '350px',
                  height: '30px',
                  borderRadius: '0',
                  border: '1px solid #ced4da',
                  padding: '0 8px',
                  outline: 'none',
                  fontSize: '14px'
                }}
                className="d-inline-block square-search"
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by name, email, role..."
                autoComplete="off"
              />
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          {/* All Users Table */}
          <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                  <CTableHeaderCell>Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Total Incentive</CTableHeaderCell>
                  <CTableHeaderCell>Paid Incentive</CTableHeaderCell>
                  <CTableHeaderCell>Pending Incentive</CTableHeaderCell>
                  <CTableHeaderCell>Transactions</CTableHeaderCell>
                  <CTableHeaderCell>Deviation Available</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {displayUsers.length === 0 && !loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={9} style={{ color: 'red', textAlign: 'center' }}>
                      {searchTerm ? `No results found for "${searchTerm}"` : 'No users found.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  displayUsers.map((user, index) => {
                    const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                    // Check if user is in top performers
                    const isTopPerformer = topPerformers.some(tp => tp.userId === user.userId);
                    
                    return (
                      <CTableRow key={user.userId} style={isTopPerformer ? { backgroundColor: '#fff3cd' } : {}}>
                        <CTableDataCell>
                          {isTopPerformer ? getRankBadge(topPerformers.findIndex(tp => tp.userId === user.userId)) : globalIndex}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div><strong>{user.name}</strong></div>
                          <small className="text-muted">{user.email}</small>
                        </CTableDataCell>
                        <CTableDataCell>{user.role || '-'}</CTableDataCell>
                        <CTableDataCell>{formatNumber(user.bookings)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(user.totalIncentive)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(user.paidIncentive)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(user.pendingIncentive)}</CTableDataCell>
                        <CTableDataCell>{formatNumber(user.transactionCount)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(user.deviationAvailable)}</CTableDataCell>
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
    </div>
  );
};

export default IncentiveSummary;