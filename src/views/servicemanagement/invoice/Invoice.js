import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
import '../../../css/invoice.css';
import {
  axiosInstance,
  showError,
  showSuccess,
  confirmDelete,
  Menu,
  MenuItem
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
  CBadge,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CAlert,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilUser,
  cilPhone,
  cilEnvelopeClosed,
  cilSpeedometer,
  cilMoney,
  cilCreditCard,
  cilFile,
  cilPrint,
  cilInfo,
  cilCarAlt,
  cilList,
  cilReload,
  cilGift,
  cilBuilding
} from '@coreui/icons';

// API Base URL - update this based on your environment
const API_BASE_URL = 'https://gandhitvs.in/dealership/api/v1';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Status options based on enum
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'secondary' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'danger' }
];

// Payment Method options based on enum
const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash', color: 'success' },
  { value: 'card', label: 'Card', color: 'primary' },
  { value: 'upi', label: 'UPI', color: 'info' },
  { value: 'bank_transfer', label: 'Bank Transfer', color: 'warning' }
];

// Payment Status options based on enum
const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'partial', label: 'Partial', color: 'info' },
  { value: 'paid', label: 'Paid', color: 'success' }
];

// Discount Type options based on enum
const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed (₹)' }
];

// Helper function to get full image URL
const getFullImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) {
    const baseDomain = API_BASE_URL.replace('/api/v1', '');
    return `${baseDomain}${path}`;
  }
  return path;
};

const Invoice = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Branch state
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [userRoles, setUserRoles] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Data state
  const [invoices, setInvoices] = useState([]);
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
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    branchId: '',
    customerName: '',
    customerMobile: '',
    customerEmail: '',
    vehicleNo: '',
    vehicleModel: '',
    odoMeter: '',
    items: [],
    discount: '',
    discountType: 'fixed',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    amountPaid: '',
    serviceAdvisor: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Parts and Labour data for dropdowns
  const [parts, setParts] = useState([]);
  const [labourItems, setLabourItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Vehicle Models state
  const [vehicleModels, setVehicleModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelSearchTerm, setModelSearchTerm] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef(null);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch invoices when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchInvoices();
    }
  }, [selectedBranchId, pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchInvoices(1, pagination.limit, searchTerm);
      }
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  // Fetch parts, labour, and vehicle models when modal opens
  useEffect(() => {
    if (addModalVisible && selectedBranchId) {
      fetchPartsAndLabour();
      fetchVehicleModels();
    }
  }, [addModalVisible, selectedBranchId]);

  // Click outside handler for model dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      if (response.data.success) {
        setBranches(response.data.data || []);
        setUserRoles(response.data.userRoles || []);
        setIsSuperAdmin(response.data.isSuperAdmin || false);
        
        // Set selected branch
        if (response.data.isSuperAdmin) {
          // For super admin, no branch pre-selected
          setSelectedBranchId('');
        } else if (response.data.userBranch && response.data.userBranch._id) {
          // For non-super admin, set their branch
          setSelectedBranchId(response.data.userBranch._id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError('Failed to fetch branches');
    }
  };

  const fetchInvoices = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    if (!selectedBranchId) {
      setInvoices([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      params.append('branchId', selectedBranchId);
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/invoices?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setInvoices(response.data.data || []);
        setPagination({
          page: response.data.pagination?.currentPage || page,
          limit: limit,
          totalCount: response.data.pagination?.total || response.data.data.length,
          totalPages: response.data.pagination?.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError(error.response?.data?.message || 'Failed to fetch invoices');
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartsAndLabour = async () => {
    if (!selectedBranchId) return;
    
    setLoadingItems(true);
    try {
      const [partsRes, labourRes] = await Promise.all([
        axiosInstance.get(`/parts?limit=1000&branchId=${selectedBranchId}`),
        axiosInstance.get(`/labour?limit=1000&branchId=${selectedBranchId}`)
      ]);
      
      if (partsRes.data.success) {
        setParts(partsRes.data.data || []);
      }
      if (labourRes.data.success) {
        setLabourItems(labourRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching parts and labour:', error);
      showError('Failed to load parts and labour items');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchVehicleModels = async () => {
    setLoadingModels(true);
    try {
      const response = await axiosInstance.get('/models/all/status');
      if (response.data.status === 'success' && response.data.data?.models) {
        setVehicleModels(response.data.data.models);
      }
    } catch (error) {
      console.error('Error fetching vehicle models:', error);
      showError('Failed to load vehicle models');
    } finally {
      setLoadingModels(false);
    }
  };

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  // Filtered models based on search
  const filteredModels = vehicleModels.filter(model =>
    model.model_name.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

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
  };

  // Menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleAddClick = () => {
    if (!selectedBranchId && isSuperAdmin) {
      showError('Please select a branch first');
      return;
    }
    resetForm();
    setAddModalVisible(true);
  };

  const handleViewClick = (invoice) => {
    setSelectedInvoice(invoice);
    setViewModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteModalVisible(true);
    handleClose();
  };

  const resetForm = () => {
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setFormData({
      branchId: defaultBranchId,
      customerName: '',
      customerMobile: '',
      customerEmail: '',
      vehicleNo: '',
      vehicleModel: '',
      odoMeter: '',
      items: [],
      discount: '',
      discountType: 'fixed',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      amountPaid: '',
      serviceAdvisor: '',
      notes: ''
    });
    setFormErrors({});
    setModelSearchTerm('');
    setShowModelDropdown(false);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemType: 'part', itemId: '', quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getItemDetails = (itemType, itemId) => {
    if (itemType === 'part') {
      const part = parts.find(p => p._id === itemId);
      return part ? { description: part.partName, unitPrice: part.mrp } : null;
    } else {
      const labour = labourItems.find(l => l._id === itemId);
      return labour ? { description: labour.description, unitPrice: labour.charges } : null;
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.branchId && isSuperAdmin) errors.branchId = 'Branch is required';
    if (!formData.customerName) errors.customerName = 'Customer name is required';
    if (!formData.customerMobile) errors.customerMobile = 'Customer mobile is required';
    if (!formData.vehicleNo) errors.vehicleNo = 'Vehicle number is required';
    if (!formData.vehicleModel) errors.vehicleModel = 'Vehicle model is required';
    if (formData.items.length === 0) errors.items = 'At least one item is required';
    
    for (let i = 0; i < formData.items.length; i++) {
      if (!formData.items[i].itemId) {
        errors[`item_${i}`] = 'Please select an item';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = () => {
    let subtotal = 0;
    
    formData.items.forEach(item => {
      const itemDetails = getItemDetails(item.itemType, item.itemId);
      if (itemDetails) {
        subtotal += itemDetails.unitPrice * item.quantity;
      }
    });
    
    let discountAmount = 0;
    if (formData.discount && formData.discountType === 'percentage') {
      discountAmount = (subtotal * parseFloat(formData.discount)) / 100;
    } else if (formData.discount && formData.discountType === 'fixed') {
      discountAmount = parseFloat(formData.discount);
    }
    
    const grandTotal = subtotal - discountAmount;
    
    return { subtotal, discountAmount, grandTotal };
  };

  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    
    setFormLoading(true);
    try {
      const items = formData.items.map(item => ({
        itemType: item.itemType,
        itemId: item.itemId,
        quantity: parseInt(item.quantity)
      }));
      
      const payload = {
        branchId: formData.branchId,
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        customerEmail: formData.customerEmail,
        vehicleNo: formData.vehicleNo,
        vehicleModel: formData.vehicleModel,
        odoMeter: formData.odoMeter ? parseInt(formData.odoMeter) : undefined,
        items: items,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        discountType: formData.discountType,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        amountPaid: formData.amountPaid ? parseFloat(formData.amountPaid) : 0,
        serviceAdvisor: formData.serviceAdvisor,
        notes: formData.notes
      };
      
      const response = await axiosInstance.post('/invoices', payload);
      if (response.data.success) {
        showSuccess('Invoice created successfully!');
        setAddModalVisible(false);
        resetForm();
        
        // If the created invoice belongs to the currently selected branch, refresh the list
        if (formData.branchId === selectedBranchId) {
          fetchInvoices(1, pagination.limit, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      showError(error.response?.data?.message || 'Failed to create invoice');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    
    try {
      const response = await axiosInstance.delete(`/invoices/${invoiceToDelete._id}`);
      if (response.data.success) {
        showSuccess('Invoice deleted successfully!');
        setDeleteModalVisible(false);
        setInvoiceToDelete(null);
        fetchInvoices(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showError(error.response?.data?.message || 'Failed to delete invoice');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status) => {
    const option = STATUS_OPTIONS.find(s => s.value === status);
    return <CBadge color={option?.color || 'secondary'}>{option?.label || status}</CBadge>;
  };

  const getPaymentMethodBadge = (method) => {
    const option = PAYMENT_METHOD_OPTIONS.find(m => m.value === method);
    return <CBadge color={option?.color || 'secondary'}>{option?.label || method}</CBadge>;
  };

  const getPaymentStatusBadge = (status) => {
    const option = PAYMENT_STATUS_OPTIONS.find(s => s.value === status);
    return <CBadge color={option?.color || 'secondary'}>{option?.label || status}</CBadge>;
  };

  // Generate Invoice HTML for printing
const generateInvoiceHTML = (invoice) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const branch = invoice.branchId || {};
  
  // Get logo URL using the helper function
  const logoUrl = getFullImageUrl(branch.logo1);
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>TAX Invoice - ${invoice.invoiceNo}</title>
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
        margin-bottom: 5mm;
      }
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3mm;
      }
      .header-left {
        width: 60%;
      }
      .header-right {
        width: 40%;
        text-align: right;
      }
      .logo-container {
        margin-bottom: 2mm;
        text-align: right;
      }
      .logo {
        max-height: 120px;
        max-width: 250px;
        width: auto;
        height: auto;
        object-fit: contain;
      }
      .dealer-info {
        text-align: left;
        font-size: 15px;
        line-height: 1.3;
      }
      .dealer-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 2mm;
        color: #333;
      }
      .divider {
        border-top: 2px solid #AAAAAA;
        margin: 2mm 0;
      }
      .customer-info-container {
        display: flex;
        font-size: 15px;
        line-height: 1.4;
      }
      .customer-info-left, .customer-info-right {
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
        background-color: #f5f5f5;
      }
      .no-border {
        border: none !important;
        font-size: 15px;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      .bold, .customer-info-row strong {
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
      .branch-details {
        font-size: 12px;
        margin-top: 1mm;
      }
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          padding: 5mm;
        }
        .logo {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="invoice-title">TAX INVOICE</div>
      <div class="header">
        <div class="header-left">
          <div class="dealer-name">${branch.name || 'N/A'}</div>
          <div class="dealer-info">
            ${branch.address ? branch.address.replace(/'/g, '') : 'N/A'}<br>
            ${branch.city ? `${branch.city}, ${branch.state || ''} - ${branch.pincode || ''}` : 'N/A'}<br>
            Phone: ${branch.phone || 'N/A'}<br>
            Email: ${branch.email || 'N/A'}<br>
            GSTIN: ${branch.gst_number || 'N/A'}
          </div>
        </div>
        <div class="header-right">
          ${logoUrl ? `
          <div class="logo-container">
            <img src="${logoUrl}" class="logo" alt="Branch Logo" onerror="this.style.display='none'">
          </div>
          ` : ''}
          <div><strong>Invoice No:</strong> ${invoice.invoiceNo}</div>
          <div><strong>Date:</strong> ${currentDate}</div>
        </div>
      </div>
      <div class="divider"></div>

      <!-- Customer Information -->
      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Customer Name:</strong> ${invoice.customerName || 'N/A'}</div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> ${invoice.customerMobile || 'N/A'}</div>
          ${invoice.customerEmail ? `<div class="customer-info-row"><strong>Email:</strong> ${invoice.customerEmail}</div>` : ''}
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Vehicle No:</strong> ${invoice.vehicleNo || 'N/A'}</div>
          <div class="customer-info-row"><strong>Vehicle Model:</strong> ${invoice.vehicleModel || 'N/A'}</div>
          ${invoice.odoMeter ? `<div class="customer-info-row"><strong>Odometer:</strong> ${invoice.odoMeter} km</div>` : ''}
        </div>
      </div>
      <div class="divider"></div>

      <!-- Items Table -->
      <div class="section-title">Items Details:</div>
      <table>
        <thead>
          <tr>
            <th style="width:5%">#</th>
            <th style="width:45%">Description</th>
            <th style="width:10%">Qty</th>
            <th style="width:15%">Unit Price</th>
            <th style="width:25%">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items && invoice.items.length > 0 ? invoice.items.map((item, idx) => `
            <tr>
              <td class="text-center">${idx + 1}</td>
              <td>${item.description || 'N/A'}</td>
              <td class="text-center">${item.quantity || 0}</td>
              <td class="text-right">${formatCurrency(item.unitPrice)}</td>
              <td class="text-right">${formatCurrency(item.totalAmount)}</td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="5" class="text-center">No items found</td>
            </tr>
          `}
        </tbody>
      </table>

      <!-- Totals Section -->
      <table class="totals-table">
        <tr>
          <td class="no-border" style="width:80%"><strong>Subtotal</strong></td>
          <td class="no-border text-right"><strong>${formatCurrency(invoice.subtotal)}</strong></td>
        </tr>
        ${invoice.discount && invoice.discount > 0 ? `
        <tr>
          <td class="no-border"><strong>Discount (${invoice.discountType === 'percentage' ? invoice.discount + '%' : 'Fixed'})</strong></td>
          <td class="no-border text-right text-danger">-${formatCurrency(invoice.discountAmount || invoice.discount)}</td>
        </tr>
        ` : ''}
        <tr>
          <td colspan="2" class="no-border"><div class="total-divider"></div></td>
        </tr>
        ${invoice.totalCgst && invoice.totalCgst > 0 ? `
        <tr>
          <td class="no-border"><strong>CGST (${invoice.cgstRate || 9}%)</strong></td>
          <td class="no-border text-right">${formatCurrency(invoice.totalCgst)}</td>
        </tr>
        <tr>
          <td class="no-border"><strong>SGST (${invoice.sgstRate || 9}%)</strong></td>
          <td class="no-border text-right">${formatCurrency(invoice.totalSgst)}</td>
        </tr>
        ` : ''}
        ${invoice.totalIgst && invoice.totalIgst > 0 ? `
        <tr>
          <td class="no-border"><strong>IGST (${invoice.igstRate || 18}%)</strong></td>
          <td class="no-border text-right">${formatCurrency(invoice.totalIgst)}</td>
        </tr>
        ` : ''}
        <tr>
          <td colspan="2" class="no-border"><div class="total-divider"></div></td>
        </tr>
        <tr>
          <td class="no-border"><strong>GRAND TOTAL</strong></td>
          <td class="no-border text-right"><strong>${formatCurrency(invoice.netAmount || invoice.grandTotal)}</strong></td>
        </tr>
      </table>

      <!-- Payment Details -->
      <div class="divider"></div>
      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Payment Method:</strong> ${invoice.paymentMethod ? invoice.paymentMethod.toUpperCase() : 'N/A'}</div>
          ${invoice.amountPaid && invoice.amountPaid > 0 ? `<div class="customer-info-row"><strong>Amount Paid:</strong> ${formatCurrency(invoice.amountPaid)}</div>` : ''}
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Payment Status:</strong> ${invoice.paymentStatus ? invoice.paymentStatus.toUpperCase() : 'N/A'}</div>
          ${invoice.amountDue && invoice.amountDue > 0 ? `<div class="customer-info-row"><strong>Amount Due:</strong> ${formatCurrency(invoice.amountDue)}</div>` : ''}
        </div>
      </div>
      ${invoice.serviceAdvisor ? `
      <div class="customer-info-row"><strong>Service Advisor:</strong> ${invoice.serviceAdvisor}</div>
      ` : ''}
      ${invoice.notes ? `
      <div class="divider"></div>
      <div class="customer-info-row"><strong>Notes:</strong> ${invoice.notes}</div>
      ` : ''}
      <div class="divider"></div>

    

      <!-- Signature Section -->
      <div class="signature-box">
        <div class="signature-item">
          <div class="signature-line"></div>
          <div><strong>AUTHORIZED SIGNATORY</strong></div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

  // Print function
  const handlePrintInvoice = (invoice) => {
    const printContent = generateInvoiceHTML(invoice);
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      showError('Please allow pop-ups to print invoices');
      return;
    }
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    let printed = false;
    
    const triggerPrint = () => {
      if (!printed && !printWindow.closed) {
        printed = true;
        printWindow.focus();
        printWindow.print();
        
        printWindow.onafterprint = () => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        };
      }
    };
    
    if (printWindow.document.readyState === 'complete') {
      setTimeout(triggerPrint, 100);
    } else {
      printWindow.onload = () => {
        setTimeout(triggerPrint, 100);
      };
    }
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

  if (error && invoices.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  const totals = calculateTotal();

  return (
    <div>
      <div className='title'>Invoice Management</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
              <CIcon icon={cilPlus} className='icon' /> Create Invoice
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Branch Selection - Only show for Super Admin */}
          {isSuperAdmin && (
            <div className="mb-3">
              <CFormLabel className="fw-bold">Select Branch <span className="required">*</span></CFormLabel>
              <CFormSelect
                value={selectedBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                style={{ maxWidth: '400px' }}
              >
                <option value="">-- Select Branch --</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </CFormSelect>
              {!selectedBranchId && (
                <small className="text-danger d-block mt-1">Please select a branch to view invoices</small>
              )}
            </div>
          )}

          {/* Branch Info for non-super admin */}
          {!isSuperAdmin && branches.length > 0 && (
            <div className="mb-3">
              <CAlert color="info" className="mb-0">
                <CIcon icon={cilBuilding} className="me-2" />
                <strong>Branch:</strong> {branches[0]?.name} - {branches[0]?.city}
              </CAlert>
            </div>
          )}

          {/* Search Bar - Only show when branch is selected */}
          {selectedBranchId && (
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
                  placeholder="Search by invoice no, customer name, vehicle..."
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && selectedBranchId && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}

          {/* No Branch Selected Message */}
          {!selectedBranchId && isSuperAdmin && (
            <div className="text-center py-5">
              <CIcon icon={cilBuilding} style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5 className="text-muted">Please select a branch to view invoices</h5>
              <p className="text-muted">Select a branch from the dropdown above to manage invoices for that branch</p>
            </div>
          )}

          {/* Invoices Table */}
          {selectedBranchId && (
            <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Invoice No</CTableHeaderCell>
                    <CTableHeaderCell>Customer Name</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle No</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
                    <CTableHeaderCell>Grand Total</CTableHeaderCell>
                    <CTableHeaderCell>Payment Status</CTableHeaderCell>
                    <CTableHeaderCell>Invoice Status</CTableHeaderCell>
                    <CTableHeaderCell>Invoice Date</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {invoices.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={10} style={{ color: 'red', textAlign: 'center' }}>
                        {searchTerm ? `No results found for "${searchTerm}"` : 'No invoices found for this branch.'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    invoices.map((invoice, index) => {
                      const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                      return (
                        <CTableRow key={invoice._id}>
                          <CTableDataCell>{globalIndex}</CTableDataCell>
                          <CTableDataCell><strong>{invoice.invoiceNo}</strong></CTableDataCell>
                          <CTableDataCell>{invoice.customerName}</CTableDataCell>
                          <CTableDataCell>{invoice.vehicleNo}</CTableDataCell>
                          <CTableDataCell>{invoice.vehicleModel}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(invoice.netAmount || invoice.grandTotal)}</CTableDataCell>
                          <CTableDataCell>{getPaymentStatusBadge(invoice.paymentStatus)}</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(invoice.status)}</CTableDataCell>
                          <CTableDataCell>{formatDate(invoice.invoiceDate)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, invoice._id)}
                            >
                              <CIcon icon={cilOptions} /> Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${invoice._id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === invoice._id} 
                              onClose={handleClose}
                            >
                              <MenuItem onClick={() => handleViewClick(invoice)}>
                                <CIcon icon={cilInfo} className="me-2" /> View Details
                              </MenuItem>
                              <MenuItem onClick={() => handlePrintInvoice(invoice)}>
                                <CIcon icon={cilPrint} className="me-2" /> Print Invoice
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteClick(invoice)}>
                                <CIcon icon={cilTrash} className="me-2" /> Delete
                              </MenuItem>
                            </Menu>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}

          {/* Pagination */}
          {selectedBranchId && renderPagination()}
        </CCardBody>
      </CCard>

      {/* Create Invoice Modal */}
      <CModal size="xl" visible={addModalVisible} onClose={() => setAddModalVisible(false)} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Create New Invoice
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {formErrors.general && <CAlert color="danger">{formErrors.general}</CAlert>}
          
          {/* Branch Selection in Add Form - Only show for Super Admin */}
          {isSuperAdmin && (
            <div className="mb-3">
              <label className="form-label">Branch <span className="required">*</span></label>
              <CFormSelect
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
              >
                <option value="">-- Select Branch --</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </CFormSelect>
              {formErrors.branchId && <small className="text-danger">{formErrors.branchId}</small>}
            </div>
          )}
          
          {/* Customer Details */}
          <h6 className="mb-3">Customer Details</h6>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name <span className="required">*</span></label>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </CInputGroup>
              {formErrors.customerName && <small className="text-danger">{formErrors.customerName}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Customer Mobile <span className="required">*</span></label>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                <CFormInput
                  value={formData.customerMobile}
                  onChange={(e) => setFormData({ ...formData, customerMobile: e.target.value })}
                  placeholder="Enter mobile number"
                />
              </CInputGroup>
              {formErrors.customerMobile && <small className="text-danger">{formErrors.customerMobile}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Customer Email</label>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
                <CFormInput
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="Enter email address"
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Vehicle Details with Searchable Dropdown */}
          <h6 className="mb-3 mt-3">Vehicle Details</h6>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Vehicle Number <span className="required">*</span></label>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilCarAlt} /></CInputGroupText>
                <CFormInput
                  value={formData.vehicleNo}
                  onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                  placeholder="Enter vehicle number"
                />
              </CInputGroup>
              {formErrors.vehicleNo && <small className="text-danger">{formErrors.vehicleNo}</small>}
            </CCol>
            <CCol md={6}>
              <label className="form-label">Vehicle Model <span className="required">*</span></label>
              <div ref={modelDropdownRef} style={{ position: 'relative' }}>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilCarAlt} /></CInputGroupText>
                  <CFormInput
                    value={formData.vehicleModel}
                    onFocus={() => setShowModelDropdown(true)}
                    onChange={(e) => {
                      setFormData({ ...formData, vehicleModel: e.target.value });
                      setModelSearchTerm(e.target.value);
                      setShowModelDropdown(true);
                    }}
                    placeholder="Search or select vehicle model"
                    autoComplete="off"
                  />
                </CInputGroup>
                {showModelDropdown && (filteredModels.length > 0 || loadingModels) && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    zIndex: 1000,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {loadingModels ? (
                      <div className="p-2 text-center">
                        <CSpinner size="sm" /> Loading models...
                      </div>
                    ) : (
                      filteredModels.map(model => (
                        <div
                          key={model._id}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee'
                          }}
                          onClick={() => {
                            setFormData({ ...formData, vehicleModel: model.model_name });
                            setModelSearchTerm(model.model_name);
                            setShowModelDropdown(false);
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <div><strong>{model.model_name}</strong></div>
                          {model.type && <small className="text-muted">Type: {model.type}</small>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formErrors.vehicleModel && <small className="text-danger">{formErrors.vehicleModel}</small>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Odometer Reading (km)</label>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilSpeedometer} /></CInputGroupText>
                <CFormInput
                  type="number"
                  value={formData.odoMeter}
                  onChange={(e) => setFormData({ ...formData, odoMeter: e.target.value })}
                  placeholder="Enter odometer reading"
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Service Advisor</label>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput
                  value={formData.serviceAdvisor}
                  onChange={(e) => setFormData({ ...formData, serviceAdvisor: e.target.value })}
                  placeholder="Enter service advisor name"
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Items Section */}
          <h6 className="mb-3 mt-3">Invoice Items</h6>
          {formErrors.items && <small className="text-danger d-block mb-2">{formErrors.items}</small>}
          
          {formData.items.map((item, index) => {
            const itemDetails = getItemDetails(item.itemType, item.itemId);
            return (
              <div key={index} className="border rounded p-3 mb-3">
                <CRow className="align-items-end">
                  <CCol md={3}>
                    <label className="form-label">Item Type</label>
                    <CFormSelect
                      value={item.itemType}
                      onChange={(e) => updateItem(index, 'itemType', e.target.value)}
                    >
                      <option value="part">Part</option>
                      <option value="labour">Labour</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label">Select Item</label>
                    <CFormSelect
                      value={item.itemId}
                      onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {item.itemType === 'part' && parts.map(part => (
                        <option key={part._id} value={part._id}>
                          {part.partNo} - {part.partName} (₹{part.mrp})
                        </option>
                      ))}
                      {item.itemType === 'labour' && labourItems.map(labour => (
                        <option key={labour._id} value={labour._id}>
                          {labour.labourCode} - {labour.description} (₹{labour.charges})
                        </option>
                      ))}
                    </CFormSelect>
                    {formErrors[`item_${index}`] && <small className="text-danger">{formErrors[`item_${index}`]}</small>}
                  </CCol>
                  <CCol md={2}>
                    <label className="form-label">Quantity</label>
                    <CFormInput
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    />
                  </CCol>
                  <CCol md={2}>
                    <label className="form-label">Unit Price</label>
                    <CFormInput
                      type="text"
                      value={itemDetails ? formatCurrency(itemDetails.unitPrice) : '-'}
                      readOnly
                      disabled
                    />
                  </CCol>
                  <CCol md={1} className="text-end">
                    <CButton color="danger" size="sm" onClick={() => removeItem(index)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
                {itemDetails && (
                  <CRow className="mt-2">
                    <CCol md={12}>
                      <small className="text-muted">Description: {itemDetails.description}</small>
                    </CCol>
                  </CRow>
                )}
              </div>
            );
          })}
          
          <CButton color="info" size="sm" onClick={addItem} className="mb-3">
            <CIcon icon={cilPlus} className="me-1" /> Add Item
          </CButton>

          {/* Discount and Payment Details */}
          <h6 className="mb-3 mt-3">Discount & Payment</h6>
          <CRow className="mb-3">
            <CCol md={4}>
              <label className="form-label">Discount Type</label>
              <CFormSelect
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                {DISCOUNT_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <label className="form-label">
                {formData.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}
              </label>
              <CFormInput
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value})}
                placeholder={formData.discountType === 'percentage' ? 'Enter discount percentage' : 'Enter discount amount'}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}>
              <label className="form-label">Payment Method</label>
              <CFormSelect
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                {PAYMENT_METHOD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <label className="form-label">Payment Status</label>
              <CFormSelect
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                {PAYMENT_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <label className="form-label">Amount Paid (₹)</label>
              <CFormInput
                type="number"
                step="1"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                placeholder="Enter amount paid"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Notes</label>
              <CFormInput
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </CCol>
          </CRow>

          {/* Totals Summary */}
          {formData.items.length > 0 && (
            <div className="border-top pt-3 mt-3">
              <CRow>
                <CCol md={{ span: 6, offset: 6 }}>
                  <table className="table table-sm table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-end"><strong>Subtotal:</strong></td>
                        <td className="text-end">{formatCurrency(totals.subtotal)}</td>
                      </tr>
                      {totals.discountAmount > 0 && (
                        <tr>
                          <td className="text-end"><strong>Discount:</strong></td>
                          <td className="text-end text-danger">-{formatCurrency(totals.discountAmount)}</td>
                        </tr>
                      )}
                      <tr className="border-top">
                        <td className="text-end"><strong>Grand Total:</strong></td>
                        <td className="text-end"><strong>{formatCurrency(totals.grandTotal)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddSubmit} disabled={formLoading}>
            {formLoading ? <><CSpinner size="sm" className="me-2" />Creating...</> : 'Create Invoice'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Invoice Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Invoice Details - {selectedInvoice?.invoiceNo}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedInvoice && (
            <div>
              {/* Invoice Header */}
              <div className="border-bottom pb-3 mb-3">
                <CRow>
                  <CCol md={6}>
                    <h5>{selectedInvoice.branchId?.name || 'GANDHI MOTORS PVT LTD'}</h5>
                    <p className="text-muted small mb-0">{selectedInvoice.branchId?.address || 'Authorized Main Dealer: TVS Motor Company Ltd.'}</p>
                    <p className="text-muted small">
                      {selectedInvoice.branchId?.city ? `${selectedInvoice.branchId.city}, ${selectedInvoice.branchId.state} - ${selectedInvoice.branchId.pincode}` : 'Nashik Road, Nashik - 422101'}
                    </p>
                    <p className="text-muted small">GSTIN: {selectedInvoice.branchId?.gst_number || '27AAACG1234A1Z'}</p>
                  </CCol>
                  <CCol md={6} className="text-end">
                    <h6>Invoice No: {selectedInvoice.invoiceNo}</h6>
                    <p className="mb-0">Date: {formatDate(selectedInvoice.invoiceDate)}</p>
                  </CCol>
                </CRow>
              </div>

              {/* Customer Details */}
              <h6 className="mb-2">Customer Details</h6>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Name:</small>
                  <div><strong>{selectedInvoice.customerName}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Mobile:</small>
                  <div><strong>{selectedInvoice.customerMobile}</strong></div>
                </CCol>
                {selectedInvoice.customerEmail && (
                  <CCol md={12} className="mt-2">
                    <small className="text-muted">Email:</small>
                    <div><strong>{selectedInvoice.customerEmail}</strong></div>
                  </CCol>
                )}
              </CRow>

              {/* Vehicle Details */}
              <h6 className="mb-2">Vehicle Details</h6>
              <CRow className="mb-3">
                <CCol md={6}>
                  <small className="text-muted">Vehicle No:</small>
                  <div><strong>{selectedInvoice.vehicleNo}</strong></div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Vehicle Model:</small>
                  <div><strong>{selectedInvoice.vehicleModel}</strong></div>
                </CCol>
                {selectedInvoice.odoMeter && (
                  <CCol md={6} className="mt-2">
                    <small className="text-muted">Odometer:</small>
                    <div><strong>{selectedInvoice.odoMeter} km</strong></div>
                  </CCol>
                )}
                {selectedInvoice.serviceAdvisor && (
                  <CCol md={6} className="mt-2">
                    <small className="text-muted">Service Advisor:</small>
                    <div><strong>{selectedInvoice.serviceAdvisor}</strong></div>
                  </CCol>
                )}
              </CRow>

              {/* Items Table */}
              <h6 className="mb-2">Items</h6>
              <CTable striped bordered size="sm">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Qty</CTableHeaderCell>
                    <CTableHeaderCell>Unit Price</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedInvoice.items.map((item, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{idx + 1}</CTableDataCell>
                      <CTableDataCell>{item.description}</CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(item.unitPrice)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(item.totalAmount)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Totals */}
              <div className="border-top pt-3 mt-3">
                <CRow>
                  <CCol md={{ span: 6, offset: 6 }}>
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-end"><strong>Subtotal:</strong></td>
                          <td className="text-end">{formatCurrency(selectedInvoice.subtotal)}</td>
                        </tr>
                        {selectedInvoice.discount > 0 && (
                          <tr>
                            <td className="text-end"><strong>Discount:</strong></td>
                            <td className="text-end text-danger">-{formatCurrency(selectedInvoice.discountAmount || selectedInvoice.discount)}</td>
                          </tr>
                        )}
                        {selectedInvoice.totalCgst > 0 && (
                          <>
                            <tr>
                              <td className="text-end"><strong>CGST:</strong></td>
                              <td className="text-end">{formatCurrency(selectedInvoice.totalCgst)}</td>
                            </tr>
                            <tr>
                              <td className="text-end"><strong>SGST:</strong></td>
                              <td className="text-end">{formatCurrency(selectedInvoice.totalSgst)}</td>
                            </tr>
                          </>
                        )}
                        {selectedInvoice.totalIgst > 0 && (
                          <tr>
                            <td className="text-end"><strong>IGST:</strong></td>
                            <td className="text-end">{formatCurrency(selectedInvoice.totalIgst)}</td>
                          </tr>
                        )}
                        <tr className="border-top">
                          <td className="text-end"><strong>Grand Total:</strong></td>
                          <td className="text-end"><strong>{formatCurrency(selectedInvoice.netAmount || selectedInvoice.grandTotal)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                </CRow>
              </div>

              {/* Payment Details */}
              <div className="border-top pt-3 mt-3">
                <CRow>
                  <CCol md={6}>
                    <small className="text-muted">Payment Method:</small>
                    <div>{getPaymentMethodBadge(selectedInvoice.paymentMethod)}</div>
                  </CCol>
                  <CCol md={6}>
                    <small className="text-muted">Payment Status:</small>
                    <div>{getPaymentStatusBadge(selectedInvoice.paymentStatus)}</div>
                  </CCol>
                  {selectedInvoice.amountPaid > 0 && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Amount Paid:</small>
                      <div><strong>{formatCurrency(selectedInvoice.amountPaid)}</strong></div>
                    </CCol>
                  )}
                  {selectedInvoice.amountDue > 0 && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Amount Due:</small>
                      <div><strong>{formatCurrency(selectedInvoice.amountDue)}</strong></div>
                    </CCol>
                  )}
                  <CCol md={12} className="mt-2">
                    <small className="text-muted">Invoice Status:</small>
                    <div>{getStatusBadge(selectedInvoice.status)}</div>
                  </CCol>
                  {selectedInvoice.notes && (
                    <CCol md={12} className="mt-2">
                      <small className="text-muted">Notes:</small>
                      <div><strong>{selectedInvoice.notes}</strong></div>
                    </CCol>
                  )}
                </CRow>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={() => selectedInvoice && handlePrintInvoice(selectedInvoice)}>
            <CIcon icon={cilPrint} className="me-1" /> Print
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this invoice?</p>
          <p><strong>Invoice No:</strong> {invoiceToDelete?.invoiceNo}</p>
          <p><strong>Customer:</strong> {invoiceToDelete?.customerName}</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            <CIcon icon={cilTrash} className="me-1" /> Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Invoice;