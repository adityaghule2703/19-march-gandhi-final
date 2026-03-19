import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance,
  showError
} from '../../utils/tableImports';
import tvsLogo from '../../assets/images/logo.png';
import config from '../../config';
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
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';

// Import permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';

// Pagination constants
const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
const DEFAULT_LIMIT = 50;

const ViewLedgers = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pagination states
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: ''
  });

  const { permissions } = useAuth();

  // Debounce timer for search
  const searchTimer = React.useRef(null);
  // Reference to track if component is mounted
  const isMounted = React.useRef(true);

  // Page-level permission checks for Ledgers under ACCOUNT module
  const canViewLedgers = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.LEDGERS);
  const canCreateLedgers = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.LEDGERS);
  const canUpdateLedgers = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.LEDGERS);
  const canDeleteLedgers = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.LEDGERS);

  useEffect(() => {
    isMounted.current = true;
    if (!canViewLedgers) {
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
    
    return () => {
      isMounted.current = false;
      // Clear any pending search timers
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [canViewLedgers]);

  // Fetch data with pagination and search
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    // Don't set loading if component is unmounting
    if (!isMounted.current) return;
    
    try {
      // Set loading state
      setPagination(prev => ({ ...prev, loading: true }));
      setError(null); // Clear any previous errors
      
      const params = { 
        bookingType: 'BRANCH',
        page, 
        limit 
      };
      
      // Add search parameter if provided - RESTRICTED to ONLY Booking ID and Customer Name
      if (search && search.trim()) {
        params.search = search.trim();
        // Explicitly restrict search to only these two fields
        params.searchFields = 'bookingNumber,customerDetails.name';
        // Remove any other search parameters that might be present
        delete params.searchIn;
        delete params.searchAll;
      }
      
      const response = await axiosInstance.get(`/bookings`, { params });

      if (!isMounted.current) return;

      if (response.data && response.data.success) {
        const responseData = response.data.data || {};
        const bookings = responseData.bookings || [];
        const total = responseData.total || bookings.length;
        const pages = responseData.pages || Math.ceil(total / limit) || 1;

        // CRITICAL: Always set loading to false, even with empty results
        setPagination({
          docs: bookings,
          total: total,
          pages: pages,
          currentPage: page,
          limit: limit,
          loading: false, // ALWAYS set loading to false
          search: search
        });
        
        // Also update data and filteredData for backward compatibility
        setData(bookings);
        setFilteredData(bookings);
      } else {
        // Handle case where response.success is false
        if (isMounted.current) {
          setPagination({
            docs: [],
            total: 0,
            pages: 1,
            currentPage: 1,
            limit: limit,
            loading: false,
            search: search
          });
          setError('Failed to fetch bookings');
        }
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      console.error('Fetch error:', error);
      const message = showError(error);
      if (message) {
        setError(message);
      }
      
      // CRITICAL: Always set loading to false and provide empty docs
      setPagination({
        docs: [],
        total: 0,
        pages: 1,
        currentPage: 1,
        limit: limit,
        loading: false, // ALWAYS set loading to false
        search: search
      });
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    if (!canViewLedgers) {
      return;
    }
    
    setSearchTerm(value);
    setError(null); // Clear any previous errors when starting new search
    
    // Clear any pending search timer
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      // Only fetch if component is still mounted
      if (isMounted.current) {
        // If search is empty or just spaces, fetch without search parameter
        if (!value.trim()) {
          fetchData(1, pagination.limit, '');
        } else {
          fetchData(1, pagination.limit, value);
        }
      }
    }, 400);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchData(newPage, pagination.limit, pagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchData(1, limit, pagination.search);
  };

  // Render pagination component
  const renderPagination = () => {
    const { currentPage, pages, total, limit, loading } = pagination;
    if (!total || pages <= 1) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(5, pages);
    if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

    const pageNums = [];
    for (let i = startPage; i <= endPage; i++) pageNums.push(i);

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
            <CFormSelect
              value={limit}
              onChange={e => handleLimitChange(e.target.value)}
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
            <CPaginationItem 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1 || loading}
            >
              «
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem 
                  onClick={() => handlePageChange(1)} 
                  disabled={loading}
                >
                  1
                </CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {pageNums.map(p => (
              <CPaginationItem 
                key={p} 
                active={p === currentPage} 
                onClick={() => handlePageChange(p)} 
                disabled={loading}
              >
                {p}
              </CPaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem 
                  onClick={() => handlePageChange(pages)} 
                  disabled={loading}
                >
                  {pages}
                </CPaginationItem>
              </>
            )}

            <CPaginationItem 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === pages || loading}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem 
              onClick={() => handlePageChange(pages)} 
              disabled={currentPage === pages || loading}
            >
              »
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const handleViewLedger = async (booking) => {
    if (!canViewLedgers) {
      showError('You do not have permission to view ledgers');
      return;
    }
    
    try {
      const res = await axiosInstance.get(`/ledger/report/${booking._id}`);
      const ledgerData = res.data.data;
      const ledgerUrl = `${config.baseURL}/ledger.html?bookingId=${booking._id}`;

      // First filter approved entries
      let approvedEntries = ledgerData.entries.filter((entry) => entry.approvalStatus !== 'Pending');

      // Filter entries based on chassis allocation status
      let filteredEntries = approvedEntries;
      if (ledgerData.vehicleDetails?.isChassisAllocated === true) {
        // Show all entries where debit field exists (debit entries)
        filteredEntries = approvedEntries.filter((entry) => 
          entry.debit !== undefined && entry.debit !== null
        );
      }

      // Recalculate totals based on filtered entries
      const totals = {
        totalCredit: filteredEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0),
        totalDebit: filteredEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0),
        finalBalance: filteredEntries.reduce((sum, entry) => {
          const credit = entry.credit || 0;
          const debit = entry.debit || 0;
          return sum + (debit - credit);
        }, 0)
      };

      const win = window.open('', '_blank');
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Customer Ledger</title>
            <style>
              @page {
                size: A4;
                margin: 15mm 10mm;
              }
              body {
                font-family: Arial;
                width: 100%;
                margin: 0;
                padding: 0;
                font-size: 14px;
                line-height: 1.3;
                font-family: Courier New;
              }
              .container {
                width: 190mm;
                margin: 0 auto;
                padding: 5mm;
              }
              .header-container {
                display: flex;
                justify-content:space-between;
                margin-bottom: 3mm;
              }
              .header-text{
                font-size:20px;
                font-weight:bold;
              }
              .logo {
                width: 30mm;
                height: auto;
                margin-right: 5mm;
              } 
              .header {
                text-align: left;
              }
              .divider {
                border-top: 2px solid #AAAAAA;
                margin: 3mm 0;
              }
              .header h2 {
                margin: 2mm 0;
                font-size: 12pt;
                font-weight: bold;
              }
              .header div {
                font-size: 14px;
              }
              .customer-info {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2mm;
                margin-bottom: 5mm;
                font-size: 14px;
              }
              .customer-info div {
                display: flex;
              }
              .customer-info strong {
                min-width: 30mm;
                display: inline-block;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 5mm;
                font-size: 14px;
                page-break-inside: avoid;
              }
              th, td {
                border: 1px solid #000;
                padding: 2mm;
                text-align: left;
              }
              th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              .footer {
                margin-top: 10mm;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                font-size: 14px;
              }
              .footer-left {
                text-align: left;
              }
              .footer-right {
                text-align: right;
              }
              .qr-code {
                width: 35mm;
                height: 35mm;
              }
              .text-right {
                text-align: right;
              }
              .text-left {
                text-align: left;
              }
              .text-center {
                text-align: center;
              }
              .note {
                font-style: italic;
                color: #666;
                margin-bottom: 5mm;
                text-align: center;
              }
              @media print {
                body {
                  width: 190mm;
                  height: 277mm;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header-container">
                <img src="${tvsLogo}" class="logo" alt="TVS Logo">
                <div class="header-text"> GANDHI TVS</div>
              </div>
              <div class="header">
                <div>
                  Authorised Main Dealer: TVS Motor Company Ltd.<br>
                  Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
                  Upnagar, Nashik Road, Nashik - 422101<br>
                  Phone: 7498903672
                </div>
              </div>
              <div class="divider"></div>
              <div class="customer-info">
                <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.name || 'N/A'}</div>
                <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
                <div><strong>Customer Address:</strong> ${ledgerData.customerDetails?.address || 'N/A'}</div>
                <div><strong>Customer Phone:</strong> ${ledgerData.customerDetails?.phone || 'N/A'}</div>
                <div><strong>Chassis No:</strong> ${ledgerData.vehicleDetails?.isChassisAllocated ? (ledgerData.vehicleDetails?.chassisNo || 'N/A') : '-'}</div>
                <div><strong>Engine No:</strong> ${ledgerData.vehicleDetails?.engineNo || 'N/A'}</div>
                <div><strong>Chassis Allocated:</strong> ${ledgerData.vehicleDetails?.isChassisAllocated ? 'Yes' : 'No'}</div>
                <div><strong>Finance Name:</strong> ${ledgerData.financeDetails?.financer || 'N/A'}</div>
                <div><strong>Sale Executive:</strong> ${ledgerData.salesExecutive || 'N/A'}</div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th width="15%">Date</th>
                    <th width="35%">Description</th>
                    <th width="15%">Receipt/VC No</th>
                    <th width="10%" class="text-right">Credit (₹)</th>
                    <th width="10%" class="text-right">Debit (₹)</th>
                    <th width="15%" class="text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    filteredEntries.length > 0
                      ? filteredEntries
                          .map(
                            (entry) => `
                              <tr>
                                <td>${entry.date || 'N/A'}</td>
                                <td>
                                  ${entry.description || 'N/A'}
                                  ${
                                    entry.transactionReference 
                                      ? `<br>Ref: ${entry.transactionReference}` 
                                      : ''
                                  }
                                </td>
                                <td>${entry.receiptNo || 'N/A'}</td>
                                <td class="text-right">${entry.credit ? entry.credit.toLocaleString('en-IN') : '-'}</td>
                                <td class="text-right">${entry.debit !== undefined ? entry.debit.toLocaleString('en-IN') : '-'}</td>
                                <td class="text-right">${entry.balance ? entry.balance.toLocaleString('en-IN') : '-'}</td>
                              </tr>
                            `
                          )
                          .join('')
                      : `<tr><td colspan="6" class="text-center">No approved entries found</td></tr>`
                  }
                  ${
                    filteredEntries.length > 0
                      ? `<tr>
                          <td colspan="3" class="text-left"><strong>Total</strong></td>
                          <td class="text-right"><strong>${totals.totalCredit.toLocaleString('en-IN')}</strong></td>
                          <td class="text-right"><strong>${totals.totalDebit.toLocaleString('en-IN')}</strong></td>
                          <td class="text-right"><strong>${totals.finalBalance.toLocaleString('en-IN')}</strong></td>
                        </tr>`
                      : ''
                  }
                </tbody>
              </table>
              
              <div class="footer">
                <div class="footer-left">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
                       class="qr-code" 
                       alt="QR Code" />
                </div>
                <div class="footer-right">
                  <p>For, Gandhi TVS</p>
                  <p>Authorised Signatory</p>
                </div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('Error fetching ledger:', err);
      const message = showError(err);
      if (message) {
        setError(message);
      }
    }
  };

  if (!canViewLedgers) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Ledgers.
      </div>
    );
  }

  // Show initial loading only on first load
  if (loading && pagination.docs.length === 0 && !pagination.search) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Customer Ledger</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
      
      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}
          
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className="text-muted">
            Total Records: {pagination.total}
          </div>
          <div className='d-flex'>
            <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={!canViewLedgers}
              style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
              placeholder="Search by Booking ID or Customer Name..."
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          {pagination.loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Searching records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                  {canViewLedgers && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 && !pagination.loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={canViewLedgers ? "10" : "9"} className="text-center">
                      {pagination.search ? `No matching bookings found for "${pagination.search}"` : 'No booking details available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((booking, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={booking._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                            ? (booking.chassisNumber || 'N/A')
                            : 'N/A'
                          }
                        </CTableDataCell>
                        <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                        <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                        <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                        {canViewLedgers && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color="info"
                              className="action-btn"
                              onClick={() => handleViewLedger(booking)}
                              disabled={!canViewLedgers}
                              title={canViewLedgers ? "View Ledger" : "No permission to view ledger"}
                            >
                              View
                            </CButton>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Component - only show if there are records */}
          {pagination.total > 0 && renderPagination()}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ViewLedgers;