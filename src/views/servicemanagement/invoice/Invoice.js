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
  cilBuilding,
  cilPeople,
  cilWarning,
  cilHome,
  cilBank,
  cilCalendar,
  cilQrCode
} from '@coreui/icons';
import {
  hasSafePagePermission,
  MODULES,
  PAGES,
  ACTIONS,
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';

// API Base URL - update this based on your environment
const API_BASE_URL = 'https://gmplmis.com/dealership-api/api/v1';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Status options based on enum
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'secondary' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'danger' }
];

// Payment Method options - Only Cash and Bank
const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash', color: 'success' },
  { value: 'bank', label: 'Bank Transfer', color: 'warning' }
];

// Job Type options
const JOB_TYPE_OPTIONS = [
  { value: 'paid_service', label: 'Paid Service' },
  { value: 'free_service', label: 'Free Service' },
  { value: 'warranty', label: 'Warranty' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' }
];

// Payment Status options based on enum
const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'partial', label: 'Partial', color: 'info' },
  { value: 'paid', label: 'Paid', color: 'success' }
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
  const { permissions = [], user } = useAuth();
  
  // Permission checks using the modulePermissions utility
  const canViewInvoices = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.INVOICE_LIST, 
    ACTIONS.VIEW
  );
  
  const canCreateInvoices = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.INVOICE_LIST, 
    ACTIONS.CREATE
  );
  
  const canUpdateInvoices = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.INVOICE_LIST, 
    ACTIONS.UPDATE
  );
  
  const canDeleteInvoices = hasSafePagePermission(
    permissions, 
    MODULES.SERVICE_MANAGEMENT, 
    PAGES.SERVICE_MANAGEMENT.INVOICE_LIST, 
    ACTIONS.DELETE
  );

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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Customer states
  const [customers, setCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerPage, setCustomerPage] = useState(1);
  const [hasMoreCustomers, setHasMoreCustomers] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const customerDropdownRef = useRef(null);
  const customerSearchTimer = useRef(null);
  
  // Form state - Updated to match new schema
  const [formData, setFormData] = useState({
    branchId: '',
    jobType: 'paid_service',
    nextDueDate: '',
    customerName: '',
    customerMobile: '',
    customerEmail: '',
    customerAddress: '',
    vehicleNo: '',
    vehicleModel: '',
    vehicleMake: '',
    odoMeter: '',
    items: [],
    gstRate: 18,
    discount: 0,
    discountType: 'fixed',
    notes: '',
    paymentMode: 'cash',
    cashAccountId: '',
    bankId: '',
    bankTransactionId: '',
    bankPaymentDate: '',
    amountPaid: '',
    serviceAdvisor: '',
    mechanic: '',
    status: 'confirmed'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState(null);
  
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

  // Cash Locations and Banks state
  const [cashLocations, setCashLocations] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch invoices when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId && canViewInvoices) {
      fetchInvoices();
    }
  }, [selectedBranchId, pagination.page, pagination.limit, canViewInvoices]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId && canViewInvoices) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchInvoices(1, pagination.limit, searchTerm);
      }
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm, canViewInvoices]);

  // Debounced customer search
  useEffect(() => {
    clearTimeout(customerSearchTimer.current);
    customerSearchTimer.current = setTimeout(() => {
      const branchId = formData.branchId || selectedBranchId;
      if (customerSearchTerm.length >= 2 && branchId && canCreateInvoices) {
        setCustomerPage(1);
        fetchCustomers(1, customerSearchTerm);
      } else if (customerSearchTerm.length === 0) {
        setCustomers([]);
        setHasMoreCustomers(true);
        setTotalCustomers(0);
      }
    }, 300);
    
    return () => clearTimeout(customerSearchTimer.current);
  }, [customerSearchTerm, formData.branchId, canCreateInvoices]);

  // Fetch parts, labour, vehicle models, and accounts when modal opens
  useEffect(() => {
    if ((addModalVisible || editModalVisible) && selectedBranchId && canCreateInvoices) {
      fetchPartsAndLabour();
      fetchVehicleModels();
      fetchCashLocationsAndBanks();
      // Reset customer search when modal opens
      setCustomerSearchTerm('');
      setCustomers([]);
      setShowCustomerDropdown(false);
    }
  }, [addModalVisible, editModalVisible, selectedBranchId, canCreateInvoices]);

  // Click outside handler for customer dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        
        if (response.data.isSuperAdmin) {
          setSelectedBranchId('');
        } else if (response.data.userBranch && response.data.userBranch._id) {
          setSelectedBranchId(response.data.userBranch._id);
          setFormData(prev => ({ ...prev, branchId: response.data.userBranch._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError('Failed to fetch branches');
    }
  };

  const fetchInvoices = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    if (!selectedBranchId || !canViewInvoices) {
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

  const fetchCustomers = async (page = 1, search = '') => {
    // Use formData.branchId or selectedBranchId
    const branchId = formData.branchId || selectedBranchId;
    
    if (!branchId || !canCreateInvoices) {
      setCustomers([]);
      setLoadingCustomers(false);
      return;
    }
    
    setLoadingCustomers(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 50);
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/customers-invoice?branchId=${branchId}&${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        const newCustomers = response.data.data || [];
        if (page === 1) {
          setCustomers(newCustomers);
        } else {
          setCustomers(prev => [...prev, ...newCustomers]);
        }
        setTotalCustomers(response.data.count || 0);
        setHasMoreCustomers(newCustomers.length === 50);
        setCustomerPage(page);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showError('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const loadMoreCustomers = () => {
    if (!loadingCustomers && hasMoreCustomers && canCreateInvoices) {
      fetchCustomers(customerPage + 1, customerSearchTerm);
    }
  };

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      customerName: customer.customer.name,
      customerMobile: customer.customer.mobile,
      customerAddress: customer.customer.address || ''
    });
    setCustomerSearchTerm(customer.displayText);
    setShowCustomerDropdown(false);
    setCustomers([]);
    // Clear any customer-related errors
    if (formErrors.customerName) {
      setFormErrors({ ...formErrors, customerName: '' });
    }
    if (formErrors.customerMobile) {
      setFormErrors({ ...formErrors, customerMobile: '' });
    }
  };

  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setCustomerSearchTerm(value);
    setFormData({
      ...formData,
      customerName: value,
      customerMobile: '',
      customerAddress: ''
    });
    setShowCustomerDropdown(true);
    
    // Check if branch is selected
    const branchId = formData.branchId || selectedBranchId;
    if (!branchId || !canCreateInvoices) {
      setCustomers([]);
      setHasMoreCustomers(true);
      setTotalCustomers(0);
      return;
    }
    
    if (value.length >= 2) {
      // Fetch will be triggered by debounce
    } else if (value.length === 0) {
      setCustomers([]);
      setHasMoreCustomers(true);
      setTotalCustomers(0);
    }
  };

  const fetchPartsAndLabour = async () => {
    if (!selectedBranchId || !canCreateInvoices) return;
    
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
    if (!canCreateInvoices) return;
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

  const fetchCashLocationsAndBanks = async () => {
    if (!selectedBranchId || !canCreateInvoices) return;
    
    setLoadingAccounts(true);
    try {
      const [cashRes, bankRes] = await Promise.all([
        axiosInstance.get(`/cash-locations?branchId=${selectedBranchId}`),
        axiosInstance.get(`/banks?branchId=${selectedBranchId}`)
      ]);
      
      // Handle cash locations response
      if (cashRes.data.status === 'success' && cashRes.data.data?.cashLocations) {
        setCashLocations(cashRes.data.data.cashLocations);
      } else {
        setCashLocations([]);
      }
      
      // Handle banks response
      if (bankRes.data.status === 'success' && bankRes.data.data?.banks) {
        setBanks(bankRes.data.data.banks);
      } else {
        setBanks([]);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showError('Failed to load payment accounts');
    } finally {
      setLoadingAccounts(false);
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

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleAddClick = () => {
    if (!canCreateInvoices) {
      showError('You do not have permission to create invoices');
      return;
    }
    setIsEditMode(false);
    resetForm();
    setAddModalVisible(true);
  };

  const handleEditClick = (invoice) => {
    if (!canUpdateInvoices) {
      showError('You do not have permission to edit invoices');
      return;
    }
    setIsEditMode(true);
    setEditInvoiceId(invoice._id);
    populateFormForEdit(invoice);
    setEditModalVisible(true);
    handleClose();
  };

  const populateFormForEdit = (invoice) => {
    setFormData({
      branchId: invoice.branchId?._id || invoice.branchId || '',
      jobType: invoice.jobType || 'paid_service',
      nextDueDate: invoice.nextDueDate ? invoice.nextDueDate.split('T')[0] : '',
      customerName: invoice.customerName || '',
      customerMobile: invoice.customerMobile || '',
      customerEmail: invoice.customerEmail || '',
      customerAddress: invoice.customerAddress || '',
      vehicleNo: invoice.vehicleNo || '',
      vehicleModel: invoice.vehicleModel || '',
      vehicleMake: invoice.vehicleMake || '',
      odoMeter: invoice.odoMeter || '',
      items: invoice.items || [],
      gstRate: invoice.gstRate || 18,
      discount: invoice.discount || 0,
      discountType: invoice.discountType || 'fixed',
      notes: invoice.notes || '',
      paymentMode: invoice.paymentMode || 'cash',
      cashAccountId: invoice.cashAccountId || '',
      bankId: invoice.bankId || '',
      bankTransactionId: invoice.bankTransactionId || '',
      bankPaymentDate: invoice.bankPaymentDate ? invoice.bankPaymentDate.split('T')[0] : '',
      amountPaid: invoice.amountPaid || '',
      serviceAdvisor: invoice.serviceAdvisor || '',
      mechanic: invoice.mechanic || '',
      status: invoice.status || 'confirmed'
    });
    setFormErrors({});
    setApiError(null);
    // Set customer search term for display
    setCustomerSearchTerm(invoice.customerName || '');
  };

  const handleViewClick = (invoice) => {
    if (!canViewInvoices) {
      showError('You do not have permission to view invoices');
      return;
    }
    setSelectedInvoice(invoice);
    setViewModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (invoice) => {
    if (!canDeleteInvoices) {
      showError('You do not have permission to delete invoices');
      return;
    }
    setInvoiceToDelete(invoice);
    setDeleteModalVisible(true);
    handleClose();
  };

  const resetForm = () => {
    const defaultBranchId = isSuperAdmin ? '' : selectedBranchId;
    
    setFormData({
      branchId: defaultBranchId,
      jobType: 'paid_service',
      nextDueDate: '',
      customerName: '',
      customerMobile: '',
      customerEmail: '',
      customerAddress: '',
      vehicleNo: '',
      vehicleModel: '',
      vehicleMake: '',
      odoMeter: '',
      items: [],
      gstRate: 18,
      discount: 0,
      discountType: 'fixed',
      notes: '',
      paymentMode: 'cash',
      cashAccountId: '',
      bankId: '',
      bankTransactionId: '',
      bankPaymentDate: '',
      amountPaid: '',
      serviceAdvisor: '',
      mechanic: '',
      status: 'confirmed'
    });
    setFormErrors({});
    setApiError(null);
    setModelSearchTerm('');
    setShowModelDropdown(false);
    setCustomerSearchTerm('');
    setCustomers([]);
    setShowCustomerDropdown(false);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemType: 'part', itemId: '', unitPrice: '', quantity: 1 }]
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

  const handleItemSelect = (index, itemId) => {
    const item = formData.items[index];
    const details = getItemDetails(item.itemType, itemId);
    if (details) {
      updateItem(index, 'itemId', itemId);
      updateItem(index, 'unitPrice', details.unitPrice);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.branchId && isSuperAdmin) errors.branchId = 'Branch is required';
    if (!formData.customerName) errors.customerName = 'Customer name is required';
    if (!formData.customerMobile) errors.customerMobile = 'Customer mobile is required';
    if (!formData.vehicleNo) errors.vehicleNo = 'Vehicle number is required';
    if (formData.items.length === 0) errors.items = 'At least one item is required';
    
    if (formData.paymentMode === 'cash') {
      if (!formData.cashAccountId) errors.cashAccountId = 'Cash account is required';
    } else if (formData.paymentMode === 'bank') {
      if (!formData.bankId) errors.bankId = 'Bank is required';
      if (!formData.bankTransactionId) errors.bankTransactionId = 'Bank transaction ID is required';
      if (!formData.bankPaymentDate) errors.bankPaymentDate = 'Bank payment date is required';
    }
    
    for (let i = 0; i < formData.items.length; i++) {
      if (!formData.items[i].itemId) {
        errors[`item_${i}`] = 'Please select an item';
      }
      if (!formData.items[i].unitPrice || formData.items[i].unitPrice <= 0) {
        errors[`item_price_${i}`] = 'Please enter a valid unit price';
      }
    }
    
    setFormErrors(errors);
    setApiError(null);
    return Object.keys(errors).length === 0;
  };

  const extractErrorMessage = (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const calculateTotal = () => {
    let total = 0;
    
    formData.items.forEach(item => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      total += unitPrice * quantity;
    });
    
    return total;
  };

  const handleAddSubmit = async () => {
    if (!canCreateInvoices) {
      showError('You do not have permission to create invoices');
      return;
    }
    if (!validateForm()) return;
    
    setFormLoading(true);
    setApiError(null);
    
    try {
      const items = formData.items.map(item => ({
        itemType: item.itemType,
        itemId: item.itemId,
        unitPrice: parseFloat(item.unitPrice),
        quantity: parseInt(item.quantity)
      }));
      
      const payload = {
        branchId: formData.branchId,
        jobType: formData.jobType || 'paid_service',
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        paymentMode: formData.paymentMode,
        items: items,
        status: 'confirmed'
      };

      // Add optional fields
      if (formData.nextDueDate) payload.nextDueDate = formData.nextDueDate;
      if (formData.customerEmail) payload.customerEmail = formData.customerEmail;
      if (formData.customerAddress) payload.customerAddress = formData.customerAddress;
      if (formData.vehicleNo) payload.vehicleNo = formData.vehicleNo;
      if (formData.vehicleModel) payload.vehicleModel = formData.vehicleModel;
      if (formData.vehicleMake) payload.vehicleMake = formData.vehicleMake;
      if (formData.odoMeter) payload.odoMeter = parseInt(formData.odoMeter);
      if (formData.gstRate) payload.gstRate = parseFloat(formData.gstRate);
      if (formData.discount) payload.discount = parseFloat(formData.discount);
      if (formData.discountType) payload.discountType = formData.discountType;
      if (formData.notes) payload.notes = formData.notes;
      if (formData.serviceAdvisor) payload.serviceAdvisor = formData.serviceAdvisor;
      if (formData.mechanic) payload.mechanic = formData.mechanic;

      // Add payment mode specific fields
      if (formData.paymentMode === 'cash') {
        payload.cashAccountId = formData.cashAccountId;
        payload.bankId = null;
        payload.bankTransactionId = null;
        payload.bankPaymentDate = null;
      } else if (formData.paymentMode === 'bank') {
        payload.bankId = formData.bankId;
        payload.bankTransactionId = formData.bankTransactionId;
        payload.bankPaymentDate = formData.bankPaymentDate;
        payload.cashAccountId = null;
      }
      
      let response;
      let createdInvoice = null;
      
      if (isEditMode && editInvoiceId) {
        response = await axiosInstance.put(`/invoices/${editInvoiceId}`, payload);
        if (response.data.success) {
          showSuccess('Invoice updated successfully!');
          setAddModalVisible(false);
          setEditModalVisible(false);
          resetForm();
          
          if (formData.branchId === selectedBranchId) {
            fetchInvoices(1, pagination.limit, searchTerm);
          }
        }
      } else {
        response = await axiosInstance.post('/invoices', payload);
        if (response.data.success) {
          createdInvoice = response.data.data;
          showSuccess('Invoice created successfully!');
          setAddModalVisible(false);
          resetForm();
          
          if (formData.branchId === selectedBranchId) {
            await fetchInvoices(1, pagination.limit, searchTerm);
          }
          
          // Auto-print the created invoice
          if (createdInvoice) {
            // Fetch the complete invoice data with all details
            const invoiceResponse = await axiosInstance.get(`/invoices/${createdInvoice._id}`);
            if (invoiceResponse.data.success) {
              const fullInvoice = invoiceResponse.data.data;
              // Auto-print after a short delay to ensure everything is loaded
              setTimeout(() => {
                handlePrintInvoice(fullInvoice);
              }, 500);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      const errorMessage = extractErrorMessage(error);
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!canDeleteInvoices) {
      showError('You do not have permission to delete invoices');
      return;
    }
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

  const getJobTypeLabel = (jobType) => {
    const option = JOB_TYPE_OPTIONS.find(j => j.value === jobType);
    return option ? option.label : jobType;
  };

  const generateInvoiceHTML = (invoice) => {
    const branch = invoice.branchId || {};
    const logoUrl = getFullImageUrl(branch.logo2 || branch.logo1);

    const partItems   = (invoice.items || []).filter(i => i.itemType === 'part');
    const labourItems2 = (invoice.items || []).filter(i => i.itemType === 'labour');
    const allItems    = [...partItems, ...labourItems2];

    const partsQty      = partItems.reduce((s, i) => s + (i.quantity || 0), 0);
    const partsTaxable  = partItems.reduce((s, i) => s + (i.basicAmount || 0), 0);
    const partsSgst     = partItems.reduce((s, i) => s + (i.sgst || 0), 0);
    const partsCgst     = partItems.reduce((s, i) => s + (i.cgst || 0), 0);

    const labQty        = labourItems2.reduce((s, i) => s + (i.quantity || 0), 0);
    const labTaxable    = labourItems2.reduce((s, i) => s + (i.basicAmount || 0), 0);
    const labSgst       = labourItems2.reduce((s, i) => s + (i.sgst || 0), 0);
    const labCgst       = labourItems2.reduce((s, i) => s + (i.cgst || 0), 0);

    const subTotalQty     = partsQty + labQty;
    const subTotalTaxable = partsTaxable + labTaxable;
    const subTotalSgst    = partsSgst + labSgst;
    const subTotalCgst    = partsCgst + labCgst;

    const grandTotal  = invoice.grandTotal  || 0;
    const discount    = invoice.discount    || 0;
    const netAmount   = invoice.netAmount   || invoice.netPayable || grandTotal - discount;
    const roundOff    = parseFloat((Math.round(netAmount) - netAmount).toFixed(2));
    const netTotal    = Math.round(netAmount);

    const numToWords = (n) => {
      const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
        'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
        'Seventeen','Eighteen','Nineteen'];
      const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
      if (n === 0) return 'Zero';
      const inWords = (num) => {
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num/10)] + (num%10 ? ' ' + a[num%10] : '');
        if (num < 1000) return a[Math.floor(num/100)] + ' Hundred' + (num%100 ? ' ' + inWords(num%100) : '');
        if (num < 100000) return inWords(Math.floor(num/1000)) + ' Thousand' + (num%1000 ? ' ' + inWords(num%1000) : '');
        if (num < 10000000) return inWords(Math.floor(num/100000)) + ' Lakh' + (num%100000 ? ' ' + inWords(num%100000) : '');
        return inWords(Math.floor(num/10000000)) + ' Crore' + (num%10000000 ? ' ' + inWords(num%10000000) : '');
      };
      return inWords(n);
    };

    const amountInWords = `( Rupees ${numToWords(netTotal)} Only )`;

    const fmtDate = (d) => {
      if (!d) return '-';
      const dt = new Date(d);
      return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
    };
    const fmtDateTime = (d) => {
      if (!d) return '-';
      const dt = new Date(d);
      return `${fmtDate(d)} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
    };
    const fmt2 = (n) => (parseFloat(n) || 0).toFixed(2);

    const itemRow = (item) => {
      const basicAmt = item.basicAmount || (item.unitPrice * item.quantity);
      const sgstRate = basicAmt > 0 ? ((item.sgst || 0) / basicAmt * 100) : 9;
      const cgstRate = basicAmt > 0 ? ((item.cgst || 0) / basicAmt * 100) : 9;
      return `<tr>
        <td style="font-size:8px">${item.partNo || ''}</td>
        <td>${item.description || '-'}</td>
        <td style="text-align:center">${(item.quantity || 0).toFixed(2)}</td>
        <td style="text-align:right">${fmt2(item.unitPrice)}</td>
        <td style="text-align:right">${fmt2(item.discount || 0)}</td>
        <td style="text-align:right">${fmt2(basicAmt)}</td>
        <td style="text-align:center;font-size:8px">${item.hsnCode || ''}</td>
        <td style="text-align:center">${fmt2(sgstRate)}</td>
        <td style="text-align:right">${fmt2(item.sgst || 0)}</td>
        <td style="text-align:center">${fmt2(cgstRate)}</td>
        <td style="text-align:right">${fmt2(item.cgst || 0)}</td>

        <td style="text-align:right">${fmt2(item.totalAmount || basicAmt)}</td>
      </tr>`;
    };

    return `<!DOCTYPE html>
  <html>
  <head>
    <title>Service Invoice - ${invoice.invoiceNo || ''}</title>
    <meta charset="UTF-8">
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9.5px;
        color: #111;
        background: #fff;
        padding: 6mm 7mm 10mm 7mm;
        width: 210mm;
      }

      /* ── HEADER ── */
      .hdr {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1.5px solid #333;
        padding-bottom: 3mm;
        margin-bottom: 2mm;
      }
      .hdr-meta { font-size: 9px; color: #555; }
      .hdr-title { text-align: center; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
      .hdr-logo img { height: 55px; width: auto; display: block; }

      /* ── INV NUMBER ROW ── */
      .inv-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2mm;
        font-size: 10px;
      }
      .inv-row .inv-no { font-weight: bold; font-size: 11px; }
      .inv-row .inv-title { font-weight: bold; font-size: 13px; }
      .inv-row .inv-date { font-size: 10px; }

      /* ── TWO COL INFO ── */
      .two-col {
        display: flex;
        border: 1px solid #bbb;
        margin-bottom: 1.5mm;
      }
      .two-col > div {
        width: 50%;
        padding: 2mm 3mm;
        font-size: 9.5px;
        line-height: 1.55;
      }
      .two-col > div:first-child { border-right: 1px solid #bbb; }
      .biz-name { font-size: 12px; font-weight: bold; margin-bottom: 1mm; }

      /* ── JOB STRIP — 2 rows ── */
      .job-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border: 1px solid #bbb;
        border-bottom: none;
        margin-bottom: 2mm;
        font-size: 9px;
      }
      .job-cell {
        padding: 1.5mm 2mm;
        border-right: 1px solid #bbb;
        border-bottom: 1px solid #bbb;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .job-cell:nth-child(4n) { border-right: none; }
      .job-cell b { font-weight: bold; margin-right: 2px; }

      /* ── ITEMS TABLE ── */
      table.items {
        width: 100%;
        border-collapse: collapse;
        font-size: 8.5px;
        margin-bottom: 1mm;
        table-layout: fixed;
      }
      table.items colgroup col:nth-child(1)  { width: 8%; }
      table.items colgroup col:nth-child(2)  { width: 20%; }
      table.items colgroup col:nth-child(3)  { width: 6%; }
      table.items colgroup col:nth-child(4)  { width: 7%; }
      table.items colgroup col:nth-child(5)  { width: 6%; }
      table.items colgroup col:nth-child(6)  { width: 8%; }
      table.items colgroup col:nth-child(7)  { width: 7%; }
      table.items colgroup col:nth-child(8)  { width: 7%; }
      table.items colgroup col:nth-child(9)  { width: 5%; }
      table.items colgroup col:nth-child(10) { width: 7%; }
      table.items colgroup col:nth-child(11) { width: 5%; }
      table.items colgroup col:nth-child(12) { width: 9%; }

      table.items th {
        background: #f0f0f0;
        border: 1px solid #aaa;
        padding: 1.5mm 1mm;
        text-align: center;
        font-size: 8.5px;
        white-space: nowrap;
        overflow: hidden;
      }
      table.items td {
        border: 1px solid #ccc;
        padding: 1.2mm 1mm;
        vertical-align: top;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sub-row td {
        background: #f5f5f5;
        font-weight: bold;
        border: 1px solid #aaa;
        padding: 1.2mm 1mm;
      }

      /* ── TOTALS ── */
      .totals-wrap {
        display: flex;
        justify-content: flex-end;
        margin-top: 1mm;
      }
      .totals-box {
        width: 190px;
        font-size: 9.5px;
        border-collapse: collapse;
      }
      .totals-box td { padding: 1mm 2mm; }
      .totals-box .tdivider td { border-top: 1px dashed #aaa; padding-top: 1.5mm; }
      .totals-box .net td {
        font-weight: bold;
        font-size: 11px;
        border-top: 1.5px solid #333;
        padding-top: 2mm;
      }

      /* ── AMOUNT WORDS ── */
      .words {
        font-size: 9px;
        font-style: italic;
        border: 1px dashed #bbb;
        padding: 1.5mm 3mm;
        margin: 2mm 0;
        background: #fafafa;
      }

      /* ── PAY STRIP ── */
      .pay-row {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #bbb;
        margin: 2mm 0;
        font-size: 9px;
      }
      .pay-cell {
        padding: 1.5mm 3mm;
        border-right: 1px solid #bbb;
      }
      .pay-cell:last-child { border-right: none; }

      /* ── NOTES ── */
      .note { font-size: 8.5px; color: #444; line-height: 1.45; margin: 2mm 0; }

      /* ── SIGNATURE ── */
      .sig {
        display: flex;
        justify-content: flex-end;
        margin-top: 7mm;
        font-size: 9px;
        text-align: right;
      }
      .sig-line {
        border-top: 1px solid #333;
        width: 45mm;
        display: block;
        margin-bottom: 1.5mm;
      }

      @page { size: A4 portrait; margin: 0; }
      @media print {
        body { padding: 5mm 6mm 8mm 6mm; }
      }
    </style>
  </head>
  <body>

    <!-- HEADER -->
    <div class="hdr">
      <div>
        <div class="hdr-meta">${fmtDateTime(new Date())}</div>
        <div style="margin-top:3mm">
          <div class="hdr-title">Service Labour Invoice</div>
        </div>
      </div>
      <div class="hdr-logo">
        ${logoUrl ? `<img src="${logoUrl}" alt="logo" onerror="this.style.display='none'">` : ''}
      </div>
    </div>

    <!-- INVOICE NUMBER ROW -->
    <div class="inv-row">
      <div class="inv-no">Invoice No &nbsp;:&nbsp; ${invoice.invoiceNo || '-'}</div>
      <div class="inv-title">SERVICE INVOICE</div>
      <div class="inv-date">Invoice Date: ${fmtDateTime(invoice.invoiceDate)}</div>
    </div>

    <!-- DEALER + CUSTOMER -->
    <div class="two-col">
      <div>
        <div class="biz-name">${branch.name || 'GANDHI MOTORS PVT LTD'}</div>
        ${branch.address ? branch.address.replace(/'/g,'') + '<br>' : ''}
        ${branch.city ? branch.city + ' - ' + (branch.pincode || '') + '<br>' : ''}
        Ph: ${branch.phone || ''}<br>
        GST IN No.: ${branch.gst_number || ''}
      </div>
      <div>
        <b>${invoice.customerName || 'N/A'}</b><br>
        ${invoice.customerAddress ? invoice.customerAddress + '<br>' : ''}
        ${invoice.customerAddress && branch.city ? branch.city + ' - ' + (branch.pincode || '') + '<br>' : ''}
        Mob: ${invoice.customerMobile || ''}
        ${invoice.customerEmail ? '<br>' + invoice.customerEmail : ''}
      </div>
    </div>

    <!-- JOB STRIP: 3 columns × 2 rows -->
    <div class="job-grid" style="grid-template-columns: repeat(3, 1fr)">
      <div class="job-cell"><b>BillType:</b> ${invoice.paymentMode === 'bank' ? 'Bank' : 'Cash'}</div>
      <div class="job-cell"><b>JobType:</b> ${getJobTypeLabel(invoice.jobType || 'paid_service').toUpperCase()}</div>
      <div class="job-cell"><b>NxtDue:</b> ${invoice.nextDueDate ? fmtDate(invoice.nextDueDate) : '-'}</div>

      <div class="job-cell"><b>KMs:</b> ${invoice.odoMeter || '-'}</div>
      <div class="job-cell"><b>RegnNo.:</b> ${invoice.vehicleNo || '-'}</div>
      <div class="job-cell"><b>Model:</b> ${invoice.vehicleModel || '-'}</div>
    </div>

    <!-- ITEMS TABLE -->
    <table class="items">
      <colgroup>
        <col><col><col><col><col><col><col><col><col><col><col><col>
      </colgroup>
      <thead>
        <tr>
          <th>Item No</th>
          <th style="text-align:left">Particulars</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Disc</th>
          <th>Taxable</th>
          <th>HSN</th>
          <th>SGST Rate</th>
          <th>SGST</th>
          <th>CGST Rate</th>
          <th>CGST</th>
          <th>MRP</th>
        </tr>
      </thead>
      <tbody>
        ${allItems.map(item => itemRow(item)).join('')}

        ${partItems.length > 0 ? `
        <tr class="sub-row">
          <td colspan="2">Parts Total</td>
          <td style="text-align:center">${partsQty.toFixed(2)}</td>
          <td></td>
          <td style="text-align:right">0.00</td>
          <td style="text-align:right">${fmt2(partsTaxable)}</td>
          <td></td>
          <td style="text-align:center"></td>
          <td style="text-align:right">${fmt2(partsSgst)}</td>
          <td style="text-align:center"></td>
          <td style="text-align:right">${fmt2(partsCgst)}</td>
          <td></td>
        </tr>` : ''}

        ${labourItems2.length > 0 ? `
        <tr class="sub-row">
          <td colspan="2">Labour Total</td>
          <td style="text-align:center">${labQty.toFixed(2)}</td>
          <td></td>
          <td style="text-align:right">0.00</td>
          <td style="text-align:right">${fmt2(labTaxable)}</td>
          <td></td>
          <td style="text-align:center"></td>
          <td style="text-align:right">${fmt2(labSgst)}</td>
          <td style="text-align:center"></td>
          <td style="text-align:right">${fmt2(labCgst)}</td>
          <td></td>
        </tr>` : ''}

        <tr class="sub-row">
          <td colspan="2">Sub Total</td>
          <td style="text-align:center">${subTotalQty.toFixed(2)}</td>
          <td></td>
          <td style="text-align:right">0.00</td>
          <td style="text-align:right">${fmt2(subTotalTaxable)}</td>
          <td></td>
          <td style="text-align:center"></td>
          <td style="text-align:right">${fmt2(subTotalSgst)}</td>
          <td style="text-align:center"></td>
          <td style="text-align:right">${fmt2(subTotalCgst)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <!-- GRAND TOTAL RIGHT-ALIGNED -->
    <div class="totals-wrap">
      <table class="totals-box">
        <tr>
          <td>Grand Total</td>
          <td style="text-align:right">${fmt2(grandTotal)}</td>
        </tr>
        ${discount > 0 ? `<tr><td>Discount</td><td style="text-align:right">${fmt2(discount)}</td></tr>` : ''}
        ${roundOff !== 0 ? `<tr><td>Round Off</td><td style="text-align:right">${fmt2(roundOff)}</td></tr>` : ''}
        <tr class="tdivider"><td colspan="2"></td></tr>
        <tr class="net">
          <td>Net Total</td>
          <td style="text-align:right">&#8377;${netTotal.toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>

    <!-- AMOUNT IN WORDS -->
    <div class="words">${amountInWords}</div>

    <!-- PAYMENT STRIP -->
    <div class="pay-row">
      <div class="pay-cell"><b>Payment:</b> ${invoice.paymentMode === 'bank' ? 'Bank Transfer' : 'Cash'}</div>
      ${invoice.paymentMode === 'bank' && invoice.bankTransactionId ? `<div class="pay-cell"><b>Txn ID:</b> ${invoice.bankTransactionId}</div>` : ''}
      ${invoice.paymentMode === 'bank' && invoice.bankPaymentDate ? `<div class="pay-cell"><b>Pay Date:</b> ${fmtDate(invoice.bankPaymentDate)}</div>` : ''}
      ${invoice.serviceAdvisor ? `<div class="pay-cell"><b>Advisor:</b> ${invoice.serviceAdvisor}</div>` : ''}
      ${invoice.mechanic ? `<div class="pay-cell"><b>Mechanic:</b> ${invoice.mechanic}</div>` : ''}
    </div>

    <!-- NOTES -->
    ${invoice.notes ? `<div class="note">Note: ${invoice.notes}</div>` : ''}
    <div class="note">Note: Take Care of Your Vehicle with Regular Service</div>

    <!-- SIGNATURE -->
    <div class="sig">
      <div>
        For <b>${branch.name || 'GANDHI MOTORS PVT LTD'}</b><br><br><br>
        <span class="sig-line"></span><br>
        <b>Authorised Signatory</b>
      </div>
    </div>

  </body>
  </html>`;
  };

  const handlePrintInvoice = (invoice) => {
    if (!canViewInvoices) {
      showError('You do not have permission to print invoices');
      return;
    }
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

  // Check if user has permission to view invoices
  if (!canViewInvoices) {
    return (
      <div className="text-center py-5">
        <CIcon icon={cilWarning} style={{ fontSize: '48px' }} className="text-warning mb-3" />
        <h5 className="text-warning">Access Denied</h5>
        <p className="text-muted">You don't have permission to view invoices.</p>
      </div>
    );
  }

  if (error && invoices.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  const totalAmount = calculateTotal();

  // Render Invoice Form
  const renderInvoiceForm = () => {
    const isCash = formData.paymentMode === 'cash';
    const isBank = formData.paymentMode === 'bank';

    return (
      <>
        {/* API Error Alert */}
        {apiError && (
          <CAlert color="danger" className="mb-3" onClose={() => setApiError(null)} dismissible>
            <div className="d-flex align-items-start">
              <CIcon icon={cilWarning} className="me-2 mt-1" style={{ fontSize: '1.2rem' }} />
              <div>
                <strong>Error!</strong>
                <p className="mb-0 mt-1">{apiError}</p>
              </div>
            </div>
          </CAlert>
        )}
        
        {/* Form Validation Errors */}
        {Object.keys(formErrors).length > 0 && (
          <CAlert color="danger" className="mb-3">
            <strong>Please fix the following errors:</strong>
            <ul className="mb-0 mt-1">
              {Object.values(formErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </CAlert>
        )}
        
        {/* Branch Selection - Only show for Super Admin */}
        {isSuperAdmin && (
          <div className="mb-3">
            <label className="form-label">Branch <span className="required">*</span></label>
            <CFormSelect
              value={formData.branchId}
              onChange={(e) => {
                setFormData({ ...formData, branchId: e.target.value });
                if (formErrors.branchId) {
                  setFormErrors({ ...formErrors, branchId: '' });
                }
                setApiError(null);
              }}
              className={formErrors.branchId ? 'is-invalid' : ''}
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
        
        {/* Customer Details with Search */}
        <h6 className="mb-3">Customer Details</h6>
        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">Customer Name <span className="required">*</span></label>
            <div ref={customerDropdownRef} style={{ position: 'relative' }}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput
                  value={customerSearchTerm}
                  onChange={handleCustomerInputChange}
                  onFocus={() => {
                    const branchId = formData.branchId || selectedBranchId;
                    if (customerSearchTerm.length >= 2 && branchId && canCreateInvoices) {
                      setShowCustomerDropdown(true);
                    } else if (!branchId) {
                      setShowCustomerDropdown(true);
                    }
                  }}
                  placeholder="Search existing customer or type new name"
                  className={formErrors.customerName ? 'is-invalid' : ''}
                  autoComplete="off"
                />
              </CInputGroup>
              {showCustomerDropdown && (
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
                  {!formData.branchId && !selectedBranchId ? (
                    <div className="p-2 text-center text-danger">
                      Please select a branch first to search customers
                    </div>
                  ) : loadingCustomers ? (
                    <div className="p-2 text-center">
                      <CSpinner size="sm" /> Loading customers...
                    </div>
                  ) : customers.length > 0 ? (
                    <>
                      {customers.map((customer) => (
                        <div
                          key={customer.id}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee'
                          }}
                          onClick={() => handleCustomerSelect(customer)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <div><strong>{customer.customer.name}</strong></div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {customer.customer.mobile} {customer.customer.address ? `- ${customer.customer.address}` : ''}
                          </div>
                        </div>
                      ))}
                      {hasMoreCustomers && (
                        <div
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            borderTop: '1px solid #eee',
                            color: '#007bff'
                          }}
                          onClick={loadMoreCustomers}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          {loadingCustomers ? 'Loading...' : 'Load More...'}
                        </div>
                      )}
                      {totalCustomers > 0 && (
                        <div style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          color: '#999',
                          borderTop: '1px solid #eee',
                          textAlign: 'center'
                        }}>
                          Total: {totalCustomers} customers
                        </div>
                      )}
                    </>
                  ) : customerSearchTerm.length >= 2 ? (
                    <div className="p-2 text-center text-muted">
                      No customers found. Type to add new customer.
                    </div>
                  ) : (
                    <div className="p-2 text-center text-muted">
                      Type at least 2 characters to search
                    </div>
                  )}
                </div>
              )}
              {formErrors.customerName && <small className="text-danger">{formErrors.customerName}</small>}
            </div>
          </CCol>
          <CCol md={6}>
            <label className="form-label">Customer Mobile <span className="required">*</span></label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
              <CFormInput
                value={formData.customerMobile}
                onChange={(e) => {
                  setFormData({ ...formData, customerMobile: e.target.value });
                  if (formErrors.customerMobile) {
                    setFormErrors({ ...formErrors, customerMobile: '' });
                  }
                  setApiError(null);
                }}
                placeholder="Enter mobile number"
                className={formErrors.customerMobile ? 'is-invalid' : ''}
              />
            </CInputGroup>
            {formErrors.customerMobile && <small className="text-danger">{formErrors.customerMobile}</small>}
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">Customer Email</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
              <CFormInput
                type="email"
                value={formData.customerEmail}
                onChange={(e) => {
                  setFormData({ ...formData, customerEmail: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter email address"
              />
            </CInputGroup>
          </CCol>
          <CCol md={6}>
            <label className="form-label">Customer Address</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilHome} /></CInputGroupText>
              <CFormInput
                value={formData.customerAddress}
                onChange={(e) => {
                  setFormData({ ...formData, customerAddress: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter customer address"
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
                onChange={(e) => {
                  setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() });
                  if (formErrors.vehicleNo) {
                    setFormErrors({ ...formErrors, vehicleNo: '' });
                  }
                  setApiError(null);
                }}
                placeholder="Enter vehicle number"
                className={formErrors.vehicleNo ? 'is-invalid' : ''}
              />
            </CInputGroup>
            {formErrors.vehicleNo && <small className="text-danger">{formErrors.vehicleNo}</small>}
          </CCol>
          <CCol md={6}>
            <label className="form-label">Vehicle Model</label>
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
                    if (formErrors.vehicleModel) {
                      setFormErrors({ ...formErrors, vehicleModel: '' });
                    }
                    setApiError(null);
                  }}
                  placeholder="Search or select vehicle model"
                  autoComplete="off"
                  className={formErrors.vehicleModel ? 'is-invalid' : ''}
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
                          setFormData({ ...formData, vehicleModel: model.model_name, vehicleMake: model.type || '' });
                          setModelSearchTerm(model.model_name);
                          setShowModelDropdown(false);
                          if (formErrors.vehicleModel) {
                            setFormErrors({ ...formErrors, vehicleModel: '' });
                          }
                          setApiError(null);
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
            <label className="form-label">Vehicle Make</label>
            <CFormInput
              value={formData.vehicleMake}
              onChange={(e) => {
                setFormData({ ...formData, vehicleMake: e.target.value });
                setApiError(null);
              }}
              placeholder="Enter vehicle make (e.g., TVS)"
            />
          </CCol>
          <CCol md={6}>
            <label className="form-label">Odometer Reading (km)</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilSpeedometer} /></CInputGroupText>
              <CFormInput
                type="number"
                value={formData.odoMeter}
                onChange={(e) => {
                  setFormData({ ...formData, odoMeter: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter odometer reading"
              />
            </CInputGroup>
          </CCol>
        </CRow>

        {/* Job Type and Next Due Date */}
        <h6 className="mb-3 mt-3">Service Details</h6>
        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">Job Type</label>
            <CFormSelect
              value={formData.jobType}
              onChange={(e) => {
                setFormData({ ...formData, jobType: e.target.value });
                setApiError(null);
              }}
            >
              {JOB_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <label className="form-label">Next Due Date</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
              <CFormInput
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => {
                  setFormData({ ...formData, nextDueDate: e.target.value });
                  setApiError(null);
                }}
              />
            </CInputGroup>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">Service Advisor</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilPeople} /></CInputGroupText>
              <CFormInput
                value={formData.serviceAdvisor}
                onChange={(e) => {
                  setFormData({ ...formData, serviceAdvisor: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter service advisor name"
              />
            </CInputGroup>
          </CCol>
          <CCol md={6}>
            <label className="form-label">Mechanic</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilPeople} /></CInputGroupText>
              <CFormInput
                value={formData.mechanic}
                onChange={(e) => {
                  setFormData({ ...formData, mechanic: e.target.value });
                  setApiError(null);
                }}
                placeholder="Enter mechanic name"
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
                  <label className="form-label">PARTICULARS type <span className="required">*</span></label>
                  <CFormSelect
                    value={item.itemType}
                    onChange={(e) => {
                      updateItem(index, 'itemType', e.target.value);
                      updateItem(index, 'itemId', '');
                      updateItem(index, 'unitPrice', '');
                      setApiError(null);
                    }}
                  >
                    <option value="part">Part</option>
                    <option value="labour">Labour</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <label className="form-label">Select Item <span className="required">*</span></label>
                  <CFormSelect
                    value={item.itemId}
                    onChange={(e) => {
                      handleItemSelect(index, e.target.value);
                      if (formErrors[`item_${index}`]) {
                        const newErrors = { ...formErrors };
                        delete newErrors[`item_${index}`];
                        setFormErrors(newErrors);
                      }
                      setApiError(null);
                    }}
                    className={formErrors[`item_${index}`] ? 'is-invalid' : ''}
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
                  <label className="form-label">Unit Price (₹) <span className="required">*</span></label>
                  <CFormInput
                    type="number"
                    step="1"
                    value={item.unitPrice}
                    onChange={(e) => {
                      updateItem(index, 'unitPrice', e.target.value);
                      if (formErrors[`item_price_${index}`]) {
                        const newErrors = { ...formErrors };
                        delete newErrors[`item_price_${index}`];
                        setFormErrors(newErrors);
                      }
                      setApiError(null);
                    }}
                    placeholder="0"
                    className={formErrors[`item_price_${index}`] ? 'is-invalid' : ''}
                  />
                  {formErrors[`item_price_${index}`] && <small className="text-danger">{formErrors[`item_price_${index}`]}</small>}
                </CCol>
                <CCol md={2}>
                  <label className="form-label">Quantity <span className="required">*</span></label>
                  <CFormInput
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      updateItem(index, 'quantity', parseInt(e.target.value) || 1);
                      setApiError(null);
                    }}
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
        
        <CButton color="info" size="sm" onClick={() => {
          addItem();
          setApiError(null);
        }} className="mb-3">
          <CIcon icon={cilPlus} className="me-1" /> Add Item
        </CButton>

        {/* GST and Discount */}
        <h6 className="mb-3 mt-3">Tax & Discount</h6>
        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">GST Rate (%)</label>
            <CFormInput
              type="number"
              step="1"
              value={formData.gstRate}
              onChange={(e) => {
                setFormData({ ...formData, gstRate: e.target.value });
                setApiError(null);
              }}
              placeholder="18"
            />
          </CCol>
          <CCol md={6}>
            <label className="form-label">Discount (₹)</label>
            <CFormInput
              type="number"
              step="1"
              value={formData.discount}
              onChange={(e) => {
                setFormData({ ...formData, discount: e.target.value });
                setApiError(null);
              }}
              placeholder="0"
            />
          </CCol>
        </CRow>

        {/* Payment Details */}
        <h6 className="mb-3 mt-3">Payment Details</h6>
        
        <CRow className="mb-3">
          <CCol md={6}>
            <label className="form-label">Payment Mode <span className="required">*</span></label>
            <CFormSelect
              value={formData.paymentMode}
              onChange={(e) => {
                const newPaymentMode = e.target.value;
                setFormData({ 
                  ...formData, 
                  paymentMode: newPaymentMode,
                  // Reset payment-specific fields when switching modes
                  cashAccountId: '',
                  bankId: '',
                  bankTransactionId: '',
                  bankPaymentDate: ''
                });
                setApiError(null);
              }}
            >
              {PAYMENT_METHOD_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <label className="form-label">Total Amount</label>
            <CFormInput
              type="text"
              value={formatCurrency(totalAmount)}
              readOnly
              disabled
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </CCol>
        </CRow>

        {/* Cash Payment Fields - Show only when payment mode is cash */}
        {isCash && (
          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label">Cash Account <span className="required">*</span></label>
              <CFormSelect
                value={formData.cashAccountId}
                onChange={(e) => {
                  setFormData({ ...formData, cashAccountId: e.target.value });
                  if (formErrors.cashAccountId) {
                    setFormErrors({ ...formErrors, cashAccountId: '' });
                  }
                  setApiError(null);
                }}
                className={formErrors.cashAccountId ? 'is-invalid' : ''}
                disabled={loadingAccounts}
              >
                <option value="">-- Select Cash Account --</option>
                {loadingAccounts ? (
                  <option value="">Loading cash accounts...</option>
                ) : (
                  cashLocations.map(location => (
                    <option key={location._id} value={location._id}>
                      {location.name} {location.branchDetails?.name ? `(${location.branchDetails.name})` : ''}
                    </option>
                  ))
                )}
              </CFormSelect>
              {formErrors.cashAccountId && <small className="text-danger">{formErrors.cashAccountId}</small>}
              {loadingAccounts && <small className="text-muted d-block mt-1">Loading cash accounts...</small>}
            </CCol>
          </CRow>
        )}

        {/* Bank Payment Fields - Show only when payment mode is bank */}
        {isBank && (
          <>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Bank <span className="required">*</span></label>
                <CFormSelect
                  value={formData.bankId}
                  onChange={(e) => {
                    setFormData({ ...formData, bankId: e.target.value });
                    if (formErrors.bankId) {
                      setFormErrors({ ...formErrors, bankId: '' });
                    }
                    setApiError(null);
                  }}
                  className={formErrors.bankId ? 'is-invalid' : ''}
                  disabled={loadingAccounts}
                >
                  <option value="">-- Select Bank --</option>
                  {loadingAccounts ? (
                    <option value="">Loading banks...</option>
                  ) : (
                    banks.map(bank => (
                      <option key={bank._id} value={bank._id}>
                        {bank.name}
                      </option>
                    ))
                  )}
                </CFormSelect>
                {formErrors.bankId && <small className="text-danger">{formErrors.bankId}</small>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Transaction ID <span className="required">*</span></label>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilQrCode} /></CInputGroupText>
                  <CFormInput
                    value={formData.bankTransactionId}
                    onChange={(e) => {
                      setFormData({ ...formData, bankTransactionId: e.target.value });
                      if (formErrors.bankTransactionId) {
                        setFormErrors({ ...formErrors, bankTransactionId: '' });
                      }
                      setApiError(null);
                    }}
                    placeholder="Enter bank transaction ID"
                    className={formErrors.bankTransactionId ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {formErrors.bankTransactionId && <small className="text-danger">{formErrors.bankTransactionId}</small>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Payment Date <span className="required">*</span></label>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                  <CFormInput
                    type="date"
                    value={formData.bankPaymentDate}
                    onChange={(e) => {
                      setFormData({ ...formData, bankPaymentDate: e.target.value });
                      if (formErrors.bankPaymentDate) {
                        setFormErrors({ ...formErrors, bankPaymentDate: '' });
                      }
                      setApiError(null);
                    }}
                    className={formErrors.bankPaymentDate ? 'is-invalid' : ''}
                  />
                </CInputGroup>
                {formErrors.bankPaymentDate && <small className="text-danger">{formErrors.bankPaymentDate}</small>}
              </CCol>
            </CRow>
          </>
        )}

        {/* Notes */}
        <CRow className="mb-3">
          <CCol md={12}>
            <label className="form-label">Notes</label>
            <CFormInput
              value={formData.notes}
              onChange={(e) => {
                setFormData({ ...formData, notes: e.target.value });
                setApiError(null);
              }}
              placeholder="Additional notes"
            />
          </CCol>
        </CRow>
      </>
    );
  };

  return (
    <div>
      <div className='title'>Invoice Management</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {/* Only show Create Invoice button if user has CREATE permission */}
            {canCreateInvoices && (
              <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
                <CIcon icon={cilPlus} className='icon' /> Create Invoice
              </CButton>
            )}
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

          {/* Search Bar - Only show when branch is selected and user has VIEW permission */}
          {selectedBranchId && canViewInvoices && (
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

          {/* Invoices Table - Only show if user has VIEW permission */}
          {selectedBranchId && canViewInvoices && (
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
                    <CTableHeaderCell>Payment Mode</CTableHeaderCell>
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
                          <CTableDataCell>{getPaymentMethodBadge(invoice.paymentMode)}</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(invoice.status)}</CTableDataCell>
                          <CTableDataCell>{formatDate(invoice.invoiceDate)}</CTableDataCell>
                          <CTableDataCell>
                            {/* Show action buttons based on permissions */}
                            {(canUpdateInvoices || canDeleteInvoices || canViewInvoices) ? (
                              <>
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
                                  {canViewInvoices && (
                                    <MenuItem onClick={() => handleViewClick(invoice)}>
                                      <CIcon icon={cilInfo} className="me-2" /> View Details
                                    </MenuItem>
                                  )}
                                  {canViewInvoices && (
                                    <MenuItem onClick={() => handlePrintInvoice(invoice)}>
                                      <CIcon icon={cilPrint} className="me-2" /> Print Invoice
                                    </MenuItem>
                                  )}
                                  {/* {canUpdateInvoices && (
                                    <MenuItem onClick={() => handleEditClick(invoice)}>
                                      <CIcon icon={cilPencil} className="me-2" /> Edit
                                    </MenuItem>
                                  )} */}
                                  {canDeleteInvoices && (
                                    <MenuItem onClick={() => handleDeleteClick(invoice)}>
                                      <CIcon icon={cilTrash} className="me-2" /> Delete
                                    </MenuItem>
                                  )}
                                </Menu>
                              </>
                            ) : (
                              <span className="text-muted">No actions</span>
                            )}
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
          {selectedBranchId && canViewInvoices && renderPagination()}
        </CCardBody>
      </CCard>

      {/* Create/Edit Invoice Modal - Only show if user has CREATE or UPDATE permission */}
      {(canCreateInvoices || canUpdateInvoices) && (
        <CModal 
          size="xl" 
          visible={addModalVisible || editModalVisible} 
          onClose={() => {
            setAddModalVisible(false);
            setEditModalVisible(false);
            setApiError(null);
            setFormErrors({});
            setCustomerSearchTerm('');
            setCustomers([]);
            setShowCustomerDropdown(false);
          }} 
          alignment="center" 
          scrollable
        >
          <CModalHeader>
            <CModalTitle>
              <CIcon icon={isEditMode ? cilPencil : cilPlus} className="me-2" />
              {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {renderInvoiceForm()}
          </CModalBody>
          <CModalFooter>
            <CButton 
              color="secondary" 
              onClick={() => {
                setAddModalVisible(false);
                setEditModalVisible(false);
                setApiError(null);
                setFormErrors({});
                setCustomerSearchTerm('');
                setCustomers([]);
                setShowCustomerDropdown(false);
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleAddSubmit} disabled={formLoading}>
              {formLoading ? (
                <><CSpinner size="sm" className="me-2" />{isEditMode ? 'Updating...' : 'Creating...'}</>
              ) : (
                isEditMode ? 'Update Invoice' : 'Create Invoice'
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* View Invoice Modal - Only show if user has VIEW permission */}
      {canViewInvoices && (
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
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Email:</small>
                      <div><strong>{selectedInvoice.customerEmail}</strong></div>
                    </CCol>
                  )}
                  {selectedInvoice.customerAddress && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Address:</small>
                      <div><strong>{selectedInvoice.customerAddress}</strong></div>
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
                  {selectedInvoice.vehicleMake && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Vehicle Make:</small>
                      <div><strong>{selectedInvoice.vehicleMake}</strong></div>
                    </CCol>
                  )}
                  {selectedInvoice.odoMeter && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Odometer:</small>
                      <div><strong>{selectedInvoice.odoMeter} km</strong></div>
                    </CCol>
                  )}
                  {selectedInvoice.jobType && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Job Type:</small>
                      <div><strong>{getJobTypeLabel(selectedInvoice.jobType)}</strong></div>
                    </CCol>
                  )}
                  {selectedInvoice.nextDueDate && (
                    <CCol md={6} className="mt-2">
                      <small className="text-muted">Next Due Date:</small>
                      <div><strong>{formatDate(selectedInvoice.nextDueDate)}</strong></div>
                    </CCol>
                  )}
                </CRow>

                <CRow className="mb-3">
                  {selectedInvoice.serviceAdvisor && (
                    <CCol md={6}>
                      <small className="text-muted">Service Advisor:</small>
                      <div><strong>{selectedInvoice.serviceAdvisor}</strong></div>
                    </CCol>
                  )}
                  {selectedInvoice.mechanic && (
                    <CCol md={6}>
                      <small className="text-muted">Mechanic:</small>
                      <div><strong>{selectedInvoice.mechanic}</strong></div>
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
                      <CTableHeaderCell>Basic Amount</CTableHeaderCell>
                      <CTableHeaderCell>CGST</CTableHeaderCell>
                      <CTableHeaderCell>SGST</CTableHeaderCell>
                      <CTableHeaderCell>Total Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedInvoice.items.map((item, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>{item.description}</CTableDataCell>
                        <CTableDataCell>{item.quantity}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(item.unitPrice)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(item.basicAmount || item.unitPrice * item.quantity)}</CTableDataCell>
                        <CTableDataCell>{item.cgst ? formatCurrency(item.cgst) : '-'}</CTableDataCell>
                        <CTableDataCell>{item.sgst ? formatCurrency(item.sgst) : '-'}</CTableDataCell>
                        <CTableDataCell><strong>{formatCurrency(item.totalAmount || item.unitPrice * item.quantity)}</strong></CTableDataCell>
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
                            <td className="text-end">{formatCurrency(selectedInvoice.subtotal || 0)}</td>
                          </tr>
                          {selectedInvoice.totalCgst > 0 && (
                            <tr>
                              <td className="text-end"><strong>CGST:</strong></td>
                              <td className="text-end">{formatCurrency(selectedInvoice.totalCgst)}</td>
                            </tr>
                          )}
                          {selectedInvoice.totalSgst > 0 && (
                            <tr>
                              <td className="text-end"><strong>SGST:</strong></td>
                              <td className="text-end">{formatCurrency(selectedInvoice.totalSgst)}</td>
                            </tr>
                          )}
                          {selectedInvoice.discount && selectedInvoice.discount > 0 && (
                            <tr>
                              <td className="text-end"><strong>Discount:</strong></td>
                              <td className="text-end">- {formatCurrency(selectedInvoice.discount)}</td>
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
                      <small className="text-muted">Payment Mode:</small>
                      <div>{getPaymentMethodBadge(selectedInvoice.paymentMode)}</div>
                    </CCol>
                    {selectedInvoice.paymentMode === 'bank' && selectedInvoice.bankTransactionId && (
                      <CCol md={6} className="mt-2">
                        <small className="text-muted">Transaction ID:</small>
                        <div><strong>{selectedInvoice.bankTransactionId}</strong></div>
                      </CCol>
                    )}
                    {selectedInvoice.paymentMode === 'bank' && selectedInvoice.bankPaymentDate && (
                      <CCol md={6} className="mt-2">
                        <small className="text-muted">Payment Date:</small>
                        <div><strong>{formatDate(selectedInvoice.bankPaymentDate)}</strong></div>
                      </CCol>
                    )}
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
      )}

      {/* Delete Confirmation Modal - Only show if user has DELETE permission */}
      {canDeleteInvoices && (
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
      )}
    </div>
  );
};

export default Invoice;