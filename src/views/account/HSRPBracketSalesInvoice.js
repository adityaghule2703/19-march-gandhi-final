import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CBadge,
  CCardHeader
} from '@coreui/react';
import { axiosInstance, showError, showSuccess } from '../../utils/tableImports';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilChevronLeft, cilChevronRight, cilPrint, cilSettings } from '@coreui/icons';
import Swal from 'sweetalert2';
import { Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { confirmDelete } from '../../utils/sweetAlerts';
import Select from 'react-select';
import '../../css/invoice.css';
import '../../css/form.css';
import '../../css/table.css';

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
const DEFAULT_LIMIT = 50;

const HSRPBracketSalesInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuInvoiceId, setMenuInvoiceId] = useState(null);

  // Booking select states
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotal, setBookingTotal] = useState(0);
  const [bookingPages, setBookingPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    bookingId: '',
    bracketType: 'Both',
    bracketQuantity: 1,
    bracketPrice: 150,
    vehicleRegNo: '',
    paymentMode: 'Cash',
    notes: ''
  });

  const { user } = useAuth();
  const searchTimer = useRef(null);
  const bookingSearchTimer = useRef(null);
  const searchInputRef = useRef(null);

  // ── Fetch Invoices ──────────────────────────────────────────────────────────
  const fetchInvoices = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const response = await axiosInstance.get('/hsrp-bracket-invoices', { params });
      const data = response.data.data || [];
      setInvoices(data);
      setTotal(response.data.total || data.length);
      setPages(response.data.pages || 1);
      setCurrentPage(page);
      setLimit(limit);
      setError(null);
    } catch (error) {
      console.error('Error fetching HSRP bracket invoices:', error);
      const msg = showError(error);
      setError(msg || 'Failed to fetch invoices');
      setInvoices([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch Bookings ──────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async (page = 1, search = '') => {
    setBookingLoading(true);
    try {
      const params = {
        bookingType: 'BRANCH',
        status: 'ALLOCATED',
        page,
        limit: 10
      };
      if (search) params.search = search;
      
      const response = await axiosInstance.get('/bookings', { params });
      const data = response.data.data || {};
      const bookingsList = data.bookings || [];
      
      // Format bookings for react-select
      const formattedBookings = bookingsList.map(booking => ({
        value: booking._id,
        label: `BK${booking.bookingNumber} - ${booking.customerDetails?.name || 'N/A'} (${booking.chassisNumber || 'N/A'})`,
        booking: booking
      }));
      
      if (page === 1) {
        setBookings(formattedBookings);
      } else {
        setBookings(prev => [...prev, ...formattedBookings]);
      }
      
      setBookingTotal(data.total || bookingsList.length);
      setBookingPages(data.pages || 1);
      setBookingPage(page);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError(error, 'Failed to fetch bookings');
    } finally {
      setBookingLoading(false);
    }
  }, []);

  // ── Initial Load ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchInvoices(1, DEFAULT_LIMIT, '');
  }, [fetchInvoices]);

  // ── Load bookings when modal opens ──────────────────────────────────────────
  useEffect(() => {
    if (showModal) {
      setBookings([]);
      setBookingSearch('');
      setBookingPage(1);
      setSelectedBooking(null);
      fetchBookings(1, '');
    }
  }, [showModal, fetchBookings]);

  // ── Search Handler ──────────────────────────────────────────────────────────
  const handleSearch = useCallback((value) => {
    setLocalSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value);
      fetchInvoices(1, limit, value);
    }, 400);
  }, [fetchInvoices, limit]);

  // ── Booking Search Handler ──────────────────────────────────────────────────
  const handleBookingSearch = useCallback((inputValue) => {
    setBookingSearch(inputValue);
    clearTimeout(bookingSearchTimer.current);
    bookingSearchTimer.current = setTimeout(() => {
      setBookings([]);
      setBookingPage(1);
      fetchBookings(1, inputValue);
    }, 400);
  }, [fetchBookings]);

  // ── Load More Bookings ──────────────────────────────────────────────────────
  const handleLoadMoreBookings = useCallback(() => {
    if (bookingPage < bookingPages && !bookingLoading) {
      fetchBookings(bookingPage + 1, bookingSearch);
    }
  }, [bookingPage, bookingPages, bookingLoading, fetchBookings, bookingSearch]);

  // ── Select Booking ──────────────────────────────────────────────────────────
  const handleSelectBooking = (selectedOption) => {
    if (selectedOption) {
      const booking = selectedOption.booking;
      setSelectedBooking(selectedOption);
      setFormData(prev => ({
        ...prev,
        bookingId: booking._id,
        vehicleRegNo: booking.chassisNumber || prev.vehicleRegNo
      }));
    } else {
      setSelectedBooking(null);
      setFormData(prev => ({
        ...prev,
        bookingId: '',
        vehicleRegNo: ''
      }));
    }
  };

  // ── Pagination ──────────────────────────────────────────────────────────────
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pages) return;
    fetchInvoices(newPage, limit, search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchInvoices, limit, search, pages]);

  const handleLimitChange = useCallback((newLimit) => {
    const parsedLimit = parseInt(newLimit, 10);
    setLimit(parsedLimit);
    fetchInvoices(1, parsedLimit, search);
  }, [fetchInvoices, search]);

  // ── Menu Handlers ──────────────────────────────────────────────────────────
  const handleMenuClick = (event, invoiceId) => {
    setAnchorEl(event.currentTarget);
    setMenuInvoiceId(invoiceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInvoiceId(null);
  };

  // ── Generate Invoice HTML ──────────────────────────────────────────────────
  const generateInvoiceHTML = (invoice) => {
    const date = new Date(invoice.invoiceDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const bracketTypeDisplay = invoice.bracketType === 'Both' ? 'Front & Rear Brackets' : invoice.bracketType + ' Bracket';
    const totalAmount = invoice.totalAmount || (invoice.bracketQuantity * invoice.bracketPrice);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>HSRP Bracket Invoice - ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: "Courier New", Courier, monospace;
          margin: 0;
          padding: 8mm;
          font-size: 15px;
          color: #555555;
        }
        .page {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
        }
        .invoice-title {
          text-align: center;
          font-size: 26px;
          font-weight: bold;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3mm;
        }
        .header-left {
          width: 70%;
        }
        .header-right {
          width: 30%;
          text-align: right;
        }
        .logo {
          height: 55px;
          margin-bottom: 2mm;
        }
        .dealer-info {
          text-align: left;
          font-size: 15px;
          line-height: 1.3;
        }
        .customer-info-container {
          display: flex;
          font-size: 15px;
          line-height: 1.4;
        }
        .customer-info-left {
          width: 50%;
        }
        .customer-info-right {
          width: 50%;
        }
        .customer-info-row {
          margin: 1.5mm 0;
          line-height: 1.4;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10pt;
          margin: 3mm 0;
        }
        th, td {
          padding: 1.5mm;
          border: 1px solid #000;
          vertical-align: top;
        }
        th {
          font-size: 10.5pt;
          font-weight: bold;
          background-color: #f0f0f0;
        }
        .no-border { 
          border: none !important; 
          font-size: 15px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold, .customer-info-row strong, .section-title strong { 
          font-weight: bold; 
        }
        .section-title {
          font-weight: bold;
          margin: 2mm 0;
          font-size: 16px;
        }
        .signature-box {
          margin-top: 12mm;
          display: flex;
          justify-content: flex-end;
          font-size: 10pt;
        }
        .signature-line {
          border-top: 1px dashed #000;
          width: 50mm;
          display: inline-block;
          margin-bottom: 2px;
        }
        .signature-item {
          text-align: center;
          width: 60mm;
        }
        .footer {
          font-size: 9pt;
          text-align: justify;
          line-height: 1.3;
          margin-top: 4mm;
        }
        .divider {
          border-top: 2px solid #AAAAAA;
          margin: 2mm 0;
        }
        .totals-table {
          width: 100%;
          border-collapse: collapse;
          margin: 3mm 0;
          font-size: 15px;
        }
        .totals-table td {
          border: none;
          padding: 1.5mm;
        }
        .total-divider {
          border-top: 2px solid #AAAAAA;
          height: 1px;
          margin: 3px 0;
        }
        .status-badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-active {
          background: #d4edda;
          color: #155724;
        }
        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }
        .note {
          padding: 1px;
          margin: 2px;
          font-size: 15px;
        }
        .payment-details {
          margin: 3mm 0;
          padding: 3mm;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 15px;
        }
        .payment-details strong {
          font-weight: bold;
        }
        .invoice-number-bold {
          font-weight: bold;
        }
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            padding: 5mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Title -->
        <div class="invoice-title">HSRP Bracket Sales Invoice</div>
        
        <!-- Header Section -->
        <div class="header">
          <div class="header-left">
            <h2 style="margin:3;font-size:16pt;">GANDHI MOTORS PVT LTD</h2>
            <div class="dealer-info">
              Authorized Main Dealer: TVS Motor Company Ltd.<br>
              Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
              Upnagar, Nashik Road, Nashik - 422101<br>
              Phone: 7498993672
            </div>
          </div>
          <div class="header-right">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            <div>Date: ${date}</div>
            <div style="margin-top: 2mm;">
              <span class="status-badge ${invoice.Status === 'Active' ? 'status-active' : 'status-inactive'}">
                ${invoice.Status || 'Active'}
              </span>
            </div>
          </div>
        </div>
        <div class="divider"></div>

        <!-- Customer Information -->
        <div class="customer-info-container">
          <div class="customer-info-left">
            <div class="customer-info-row"><strong>Invoice Number:</strong> <span class="invoice-number-bold">${invoice.invoiceNumber}</span></div>
            <div class="customer-info-row"><strong>Customer Name:</strong> ${invoice.C_Name}</div>
            <div class="customer-info-row"><strong>Mobile No.:</strong> ${invoice.MobileNO}</div>
            <div class="customer-info-row"><strong>Vehicle Reg No:</strong> ${invoice.vehicleRegNo}</div>
          </div>
          <div class="customer-info-right">
            <div class="customer-info-row"><strong>Chassis Number:</strong> ${invoice.Chasis_No}</div>
            <div class="customer-info-row"><strong>Booking ID:</strong> ${invoice.bookingId?._id || invoice.bookingId || 'N/A'}</div>
            <div class="customer-info-row"><strong>Booking Number:</strong> ${invoice.bookingId?.bookingNumber || 'N/A'}</div>
          </div>
        </div>
        <div class="divider"></div>

        <!-- Bracket Details -->
        <div class="section-title">Bracket Details:</div>
        <table class="no-border">
          <tr>
            <td class="no-border" style="width:33%"><strong>Bracket Type:</strong> ${invoice.bracketType}</td>
            <td class="no-border" style="width:33%"><strong>Quantity:</strong> ${invoice.bracketQuantity}</td>
            <td class="no-border" style="width:34%"><strong>Price per Unit:</strong> ₹${invoice.bracketPrice.toFixed(2)}</td>
          </tr>
        </table>

        <!-- Price Breakdown Table -->
        <table>
          <thead>
            <tr>
              <th style="width:5%">#</th>
              <th style="width:35%">Particulars</th>
              <th style="width:15%">Quantity</th>
              <th style="width:20%">Rate (₹)</th>
              <th style="width:25%">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">1</td>
              <td>${bracketTypeDisplay}</td>
              <td class="text-center">${invoice.bracketQuantity}</td>
              <td class="text-right">${invoice.bracketPrice.toFixed(2)}</td>
              <td class="text-right">${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals Section -->
        <table class="totals-table">
          <tr>
            <td colspan="2" class="no-border"><div class="total-divider"></div></td>
          </tr>
          <tr>
            <td class="no-border" style="width:80%"><strong>Total Amount</strong></td>
            <td class="no-border text-right"><strong>₹ ${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </table>

        <!-- Payment Details -->
        <div class="payment-details">
          <div><strong>Payment Mode:</strong> ${invoice.paymentMode}</div>
          ${invoice.notes ? `<div style="margin-top: 2mm;"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
        </div>

        <div class="divider"></div>

        <!-- Notes -->
        <div class="note"><strong>Notes:</strong> This is a system generated invoice for HSRP bracket sales.</div>
        <div class="divider"></div>

        <!-- Signature Section -->
        <div class="signature-box">
          <div class="signature-item">
            <div class="signature-line"></div>
            <div><strong>AUTHORIZED SIGNATORY OF GANDHI MOTORS</strong></div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your business! This invoice is valid for all purposes.</p>
        </div>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
    `;
  };

  // ── Print Invoice ──────────────────────────────────────────────────────────
  const handlePrintInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');
    const htmlContent = generateInvoiceHTML(invoice);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
    };
    handleMenuClose();
  };

  // ── Delete Invoice ─────────────────────────────────────────────────────────
  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const result = await confirmDelete({
        title: 'Delete HSRP Bracket Invoice',
        text: 'Are you sure you want to delete this invoice? This action cannot be undone.',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`/hsrp-bracket-invoices/${invoiceId}`);
        showSuccess('Invoice deleted successfully!');
        fetchInvoices(currentPage, limit, search);
        handleMenuClose();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showError(error, 'Failed to delete invoice');
    }
  };

  // ── Open Add Modal ─────────────────────────────────────────────────────────
  const handleAddClick = () => {
    setIsEditing(false);
    setSelectedInvoice(null);
    setSelectedBooking(null);
    setFormData({
      bookingId: '',
      bracketType: 'Both',
      bracketQuantity: 1,
      bracketPrice: 150,
      vehicleRegNo: '',
      paymentMode: 'Cash',
      notes: ''
    });
    setShowModal(true);
  };

  // ── Open Edit Modal ────────────────────────────────────────────────────────
  const handleEditClick = (invoice) => {
    setIsEditing(true);
    setSelectedInvoice(invoice);
    
    // Set selected booking if exists
    if (invoice.bookingId) {
      const bookingObj = invoice.bookingId;
      setSelectedBooking({
        value: bookingObj._id || bookingObj,
        label: `BK${bookingObj.bookingNumber || ''} - ${bookingObj.C_Name || bookingObj.customerDetails?.name || 'N/A'}`,
        booking: bookingObj
      });
    } else {
      setSelectedBooking(null);
    }
    
    setFormData({
      bookingId: invoice.bookingId?._id || invoice.bookingId || '',
      bracketType: invoice.bracketType || 'Both',
      bracketQuantity: invoice.bracketQuantity || 1,
      bracketPrice: invoice.bracketPrice || 150,
      vehicleRegNo: invoice.vehicleRegNo || '',
      paymentMode: invoice.paymentMode || 'Cash',
      notes: invoice.notes || ''
    });
    setShowModal(true);
    handleMenuClose();
  };

  // ── Form Change Handler ────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bracketQuantity' || name === 'bracketPrice' ? parseFloat(value) || 0 : value
    }));
  };

  // ── Submit Form ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.bookingId.trim()) {
        showError('Please select a Booking');
        setSubmitting(false);
        return;
      }
      if (!formData.vehicleRegNo.trim()) {
        showError('Please enter Vehicle Registration Number');
        setSubmitting(false);
        return;
      }
      if (formData.bracketQuantity < 1) {
        showError('Bracket quantity must be at least 1');
        setSubmitting(false);
        return;
      }
      if (formData.bracketPrice < 0) {
        showError('Bracket price cannot be negative');
        setSubmitting(false);
        return;
      }

      const payload = {
        bookingId: formData.bookingId.trim(),
        bracketType: formData.bracketType,
        bracketQuantity: formData.bracketQuantity,
        bracketPrice: formData.bracketPrice,
        vehicleRegNo: formData.vehicleRegNo.trim(),
        paymentMode: formData.paymentMode,
        notes: formData.notes.trim()
      };

      if (isEditing && selectedInvoice) {
        await axiosInstance.put(`/hsrp-bracket-invoices/${selectedInvoice._id}`, payload);
        showSuccess('Invoice updated successfully!');
      } else {
        await axiosInstance.post('/hsrp-bracket-invoices', payload);
        showSuccess('Invoice created successfully!');
      }

      setShowModal(false);
      fetchInvoices(1, limit, search);
    } catch (error) {
      console.error('Error saving invoice:', error);
      showError(error, isEditing ? 'Failed to update invoice' : 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render Pagination ──────────────────────────────────────────────────────
  const renderPagination = () => {
    if (total === 0 || pages <= 1) return null;

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
            <CPaginationItem onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {startPage > 1 && (
              <>
                <CPaginationItem onClick={() => handlePageChange(1)} disabled={loading}>1</CPaginationItem>
                {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}

            {pageNums.map(p => (
              <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}

            {endPage < pages && (
              <>
                {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => handlePageChange(pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}

            <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // ── Custom React-Select Styles ─────────────────────────────────────────────
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '38px',
      borderColor: state.isFocused ? '#80bdff' : '#d4d4d4',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,0.25)' : 'none',
      '&:hover': {
        borderColor: '#80bdff'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1050,
      maxHeight: '300px'
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '250px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : 'transparent',
      color: state.isSelected ? '#fff' : '#212529',
      '&:active': {
        backgroundColor: '#0d6efd',
        color: '#fff'
      }
    })
  };

  // ── Render Table ───────────────────────────────────────────────────────────
  const renderTable = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner color="primary" />
        </div>
      );
    }

    if (error) {
      return <CAlert color="danger">{error}</CAlert>;
    }

    if (invoices.length === 0) {
      return (
        <div className="text-center py-5">
          <CAlert color="info">
            {search ? `No results found for "${search}"` : 'No HSRP bracket invoices found'}
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className="responsive-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Invoice No</CTableHeaderCell>
              <CTableHeaderCell>Customer Name</CTableHeaderCell>
              <CTableHeaderCell>Mobile No</CTableHeaderCell>
              <CTableHeaderCell>Vehicle Reg No</CTableHeaderCell>
              <CTableHeaderCell>Bracket Type</CTableHeaderCell>
              <CTableHeaderCell>Qty</CTableHeaderCell>
              <CTableHeaderCell>Price (₹)</CTableHeaderCell>
              <CTableHeaderCell>Total (₹)</CTableHeaderCell>
              <CTableHeaderCell>Payment Mode</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {invoices.map((invoice, index) => {
              const globalIndex = (currentPage - 1) * limit + index + 1;
              const date = new Date(invoice.invoiceDate).toLocaleDateString('en-GB');

              const bracketTypeColors = {
                'Front': 'primary',
                'Rear': 'warning',
                'Both': 'success'
              };

              return (
                <CTableRow key={invoice._id}>
                  <CTableDataCell>{globalIndex}</CTableDataCell>
                  <CTableDataCell>
                    <strong>{invoice.invoiceNumber}</strong>
                  </CTableDataCell>
                  <CTableDataCell>{invoice.C_Name}</CTableDataCell>
                  <CTableDataCell>{invoice.MobileNO}</CTableDataCell>
                  <CTableDataCell>{invoice.vehicleRegNo}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={bracketTypeColors[invoice.bracketType] || 'secondary'}>
                      {invoice.bracketType}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{invoice.bracketQuantity}</CTableDataCell>
                  <CTableDataCell className="text-right">₹{invoice.bracketPrice.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-right">
                    <strong>₹{invoice.totalAmount.toFixed(2)}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={invoice.paymentMode === 'Cash' ? 'success' : 'info'}>
                      {invoice.paymentMode}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{date}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      className="option-button"
                      onClick={(e) => handleMenuClick(e, invoice._id)}
                    >
                      <CIcon icon={cilSettings} />
                    </CButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuInvoiceId === invoice._id}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem onClick={() => handlePrintInvoice(invoice)}>
                        <CIcon icon={cilPrint} className="me-2" /> Print Invoice
                      </MenuItem>
                      <MenuItem onClick={() => handleEditClick(invoice)}>
                        <CIcon icon={cilSettings} className="me-2" /> Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteInvoice(invoice._id)} style={{ color: 'red' }}>
                        Delete
                      </MenuItem>
                    </Menu>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="container-table">
      <h4 className="mb-4">HSRP Bracket Sales Invoice</h4>

     <CCard className="table-container">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <CButton 
              className="submit-button" 
              onClick={handleAddClick}
            >
              <CIcon icon={cilPlus} className="me-2" /> Add Invoice
            </CButton>
          </div>
          <div className="d-flex align-items-center">
            <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
              placeholder="Search by name, mobile, reg no, invoice..."
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          {renderTable()}
          {renderPagination()}
        </CCardBody>
      </CCard>

      {/* Add/Edit Modal */}
      <CModal
        alignment="center"
        visible={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {isEditing ? 'Edit HSRP Bracket Invoice' : 'Create HSRP Bracket Invoice'}
          </CModalTitle>
        </CModalHeader>
        <form onSubmit={handleSubmit}>
          <CModalBody>
            <div className="row g-3">
              <div className="col-12">
                <CFormLabel className="fw-bold">Booking <span className="text-danger">*</span></CFormLabel>
                <Select
                  classNamePrefix="react-select"
                  placeholder="Search and select a booking..."
                  isClearable
                  options={bookings}
                  value={selectedBooking}
                  onChange={handleSelectBooking}
                  onInputChange={handleBookingSearch}
                  isLoading={bookingLoading}
                  styles={customSelectStyles}
                  loadingMessage={() => 'Loading bookings...'}
                  noOptionsMessage={() => 'No bookings found'}
                  filterOption={() => true} // Disable default filtering since we use server-side
                />
                <small className="text-muted" style={{ display: 'block', marginTop: '4px' }}>
                  Type to search by booking number, customer name, or chassis number
                </small>
              </div>
              <div className="col-md-6">
                <CFormLabel className="fw-bold">Vehicle Registration No <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  name="vehicleRegNo"
                  value={formData.vehicleRegNo}
                  onChange={handleFormChange}
                  placeholder="e.g., MH12AB1234"
                  required
                />
              </div>
              <div className="col-md-6">
                <CFormLabel className="fw-bold">Bracket Type <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="bracketType"
                  value={formData.bracketType}
                  onChange={handleFormChange}
                >
                  <option value="Front">Front</option>
                  <option value="Rear">Rear</option>
                  <option value="Both">Both</option>
                </CFormSelect>
              </div>
              <div className="col-md-4">
                <CFormLabel className="fw-bold">Bracket Quantity <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  name="bracketQuantity"
                  value={formData.bracketQuantity}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>
              <div className="col-md-4">
                <CFormLabel className="fw-bold">Bracket Price (₹) <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  name="bracketPrice"
                  value={formData.bracketPrice}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-md-4">
                <CFormLabel className="fw-bold">Payment Mode <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleFormChange}
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Finance Disbursement">Finance Disbursement</option>
                  <option value="Exchange">Exchange</option>
                  <option value="Pay Order">Pay Order</option>
                </CFormSelect>
              </div>
              <div className="col-md-12">
                <CFormLabel className="fw-bold">Notes</CFormLabel>
                <CFormInput
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Optional notes"
                />
              </div>
              {isEditing && (
                <div className="col-12">
                  <div className="p-3 bg-light rounded">
                    <p className="mb-1"><strong>Invoice Number:</strong> {selectedInvoice?.invoiceNumber}</p>
                    <p className="mb-0"><strong>Current Total:</strong> ₹{selectedInvoice?.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </CButton>
            <CButton
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Invoice' : 'Create Invoice'
              )}
            </CButton>
          </CModalFooter>
        </form>
      </CModal>
    </div>
  );
};

export default HSRPBracketSalesInvoice;