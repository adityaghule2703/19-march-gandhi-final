// Schemes.js - Updated with isEnabled support and fixes
import React, { useState, useEffect, useRef } from 'react';
import '../../../css/table.css';
import '../../../css/form.css';
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
  CInputGroupText,
  CFormCheck,
  CFormTextarea,
  CCloseButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilOptions,
  cilChevronLeft,
  cilChevronRight,
  cilPlus,
  cilPencil,
  cilTrash,
  cilBuilding,
  cilWarning,
  cilCheckCircle,
  cilInfo,
  cilFile,
  cilCalendar,
  cilPeople,
  cilMoney,
  cilTag,
  cilList,
  cilSettings,
  cilUser
} from '@coreui/icons';
import AddScheme from './AddScheme';
import EditScheme from './EditScheme';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

// Period Type options - UPPERCASE
const PERIOD_TYPE_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CUSTOM', label: 'Custom' },
  { value: 'QUARTERLY', label: 'Quarterly' }
];

// Status options - UPPERCASE
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', color: 'warning' },
  { value: 'ACTIVE', label: 'Active', color: 'success' },
  { value: 'CLOSED', label: 'Closed', color: 'secondary' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'danger' }
];

// Initial form data with isEnabled fields and current year
const getInitialFormData = () => {
  const currentYear = new Date().getFullYear();
  return {
    title: '',
    periodType: 'MONTHLY',
    month: '',
    year: currentYear,
    quarter: '',
    validFrom: '',
    validTo: '',
    applicableRoles: [],
    isSubdealerScheme: false,
    scope: { branches: [], subdealers: [] },
    totalIncentivePool: '',
    status: 'ACTIVE',
    remarks: '',
    params: {
      volumeSlab: {
        isEnabled: false,
        slabType: 'FLAT',
        slabs: []
      },
      addonServicesAndAccessories: {
        isEnabled: false,
        deductItemDiscount: true,
        applicableHeaders: [],
        applicableAccessories: [],
        slabs: []
      },
      modelIncentive: {
        isEnabled: false,
        modelIncentives: []
      },
      exchangeSlab: {
        isEnabled: false,
        slabs: []
      },
      managerIncentive: {
        isEnabled: false,
        perChassisAmount: '',
        volumeSlab: []
      }
    }
  };
};

const Schemes = () => {
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
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data state
  const [schemes, setSchemes] = useState([]);
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
  
  // Dropdown data
  const [allBranches, setAllBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [models, setModels] = useState([]);
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form state - initialize with isEnabled fields
  const [formData, setFormData] = useState(getInitialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Fetch branches and schemes on component mount
  useEffect(() => {
    fetchBranches();
    fetchAllBranches();
    fetchSubdealers();
    fetchHeaders();
    fetchAccessories();
    fetchModels();
  }, []);

  // Fetch schemes when branch, page, limit, or search changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchSchemes();
    }
  }, [selectedBranchId, pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (selectedBranchId) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchSchemes(1, pagination.limit, searchTerm);
      }
    }, 400);
    
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      if (response.data.success) {
        setBranches(response.data.data || []);
        setUserRoles(response.data.userRoles || []);
        setIsSuperAdmin(response.data.isSuperAdmin || false);
        setCurrentUser(response.data.user || null);
        
        if (response.data.isSuperAdmin) {
          setSelectedBranchId('');
        } else if (response.data.userBranch && response.data.userBranch._id) {
          setSelectedBranchId(response.data.userBranch._id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError('Failed to fetch branches');
    }
  };

  const fetchAllBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      if (response.data.success) {
        setAllBranches(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching all branches:', error);
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      if (response.data.status === 'success') {
        const subdealersData = response.data.data?.subdealers || [];
        setSubdealers(subdealersData);
      }
    } catch (error) {
      console.error('Error fetching subdealers:', error);
    }
  };

  const fetchHeaders = async () => {
    try {
      const response = await axiosInstance.get('/headers?sort=priority');
      if (response.data.status === 'success') {
        const headersData = response.data.data?.headers || [];
        setHeaders(headersData);
      }
    } catch (error) {
      console.error('Error fetching headers:', error);
    }
  };

  const fetchAccessories = async () => {
    try {
      const response = await axiosInstance.get('/accessories');
      if (response.data.status === 'success') {
        const accessoriesData = response.data.data?.accessories || [];
        setAccessories(accessoriesData);
      }
    } catch (error) {
      console.error('Error fetching accessories:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axiosInstance.get('/models/list/names');
      if (response.data.status === 'success') {
        const modelsData = response.data.data?.models || [];
        setModels(modelsData);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchSchemes = async (page = pagination.page, limit = pagination.limit, search = searchTerm) => {
    if (!selectedBranchId) {
      setSchemes([]);
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
      
      const url = `/incentives/schemes?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.status === 'success') {
        const schemesData = response.data.data?.schemes || [];
        setSchemes(schemesData);
        setPagination({
          page: response.data.page || page,
          limit: limit,
          totalCount: response.data.total || schemesData.length,
          totalPages: response.data.totalPages || 1
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setError(error.response?.data?.message || 'Failed to fetch schemes');
      showError(error);
    } finally {
      setLoading(false);
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
    // Removed branch check - form opens regardless of branch selection
    resetForm();
    setAddModalVisible(true);
  };

  const handleViewClick = (scheme) => {
    setSelectedScheme(scheme);
    setViewModalVisible(true);
    handleClose();
  };

  const handleEditClick = (scheme) => {
    setSelectedScheme(scheme);
    
    // Extract branch IDs from the branch objects
    const branchIds = scheme.scope?.branches?.map(branch => {
      if (branch && typeof branch === 'object' && branch._id) {
        return branch._id;
      }
      return branch;
    }) || [];

    // Extract subdealer IDs from the subdealer objects  
    const subdealerIds = scheme.scope?.subdealers?.map(sub => {
      if (sub && typeof sub === 'object' && sub._id) {
        return sub._id;
      }
      return sub;
    }) || [];

    // Extract role IDs from the role objects
    const roleIds = scheme.applicableRoles?.map(role => {
      if (role && typeof role === 'object' && role._id) {
        return role._id;
      }
      return role;
    }) || [];

    setFormData({
      title: scheme.title || '',
      periodType: scheme.periodType ? scheme.periodType.toUpperCase() : 'MONTHLY',
      month: scheme.month || '',
      year: scheme.year || new Date().getFullYear(),
      quarter: scheme.quarter || '',
      validFrom: scheme.validFrom ? scheme.validFrom.split('T')[0] : '',
      validTo: scheme.validTo ? scheme.validTo.split('T')[0] : '',
      applicableRoles: roleIds,
      isSubdealerScheme: scheme.isSubdealerScheme || false,
      scope: {
        branches: branchIds,
        subdealers: subdealerIds
      },
      totalIncentivePool: scheme.totalIncentivePool || '',
      status: scheme.status ? scheme.status.toUpperCase() : 'ACTIVE',
      remarks: scheme.remarks || '',
      params: {
        volumeSlab: {
          isEnabled: scheme.params?.volumeSlab?.isEnabled || false,
          slabType: scheme.params?.volumeSlab?.slabType || 'FLAT',
          slabs: scheme.params?.volumeSlab?.slabs || []
        },
        addonServicesAndAccessories: {
          isEnabled: scheme.params?.addonServicesAndAccessories?.isEnabled || false,
          deductItemDiscount: scheme.params?.addonServicesAndAccessories?.deductItemDiscount !== undefined ? scheme.params.addonServicesAndAccessories.deductItemDiscount : true,
          applicableHeaders: scheme.params?.addonServicesAndAccessories?.applicableHeaders || [],
          applicableAccessories: scheme.params?.addonServicesAndAccessories?.applicableAccessories || [],
          slabs: scheme.params?.addonServicesAndAccessories?.slabs || []
        },
        modelIncentive: {
          isEnabled: scheme.params?.modelIncentive?.isEnabled || false,
          modelIncentives: scheme.params?.modelIncentive?.modelIncentives?.map(item => ({
            model: item.model || item.modelId || '',
            modelName: item.modelName || '',
            amountPerUnit: item.amountPerUnit || item.amount || ''
          })) || []
        },
        exchangeSlab: {
          isEnabled: scheme.params?.exchangeSlab?.isEnabled || false,
          slabs: scheme.params?.exchangeSlab?.slabs || []
        },
        managerIncentive: {
          isEnabled: scheme.params?.managerIncentive?.isEnabled || false,
          perChassisAmount: scheme.params?.managerIncentive?.perChassisAmount || '',
          volumeSlab: scheme.params?.managerIncentive?.volumeSlab || []
        }
      }
    });
    setFormErrors({});
    setApiError(null);
    setEditModalVisible(true);
    handleClose();
  };

  const handleDeleteClick = (scheme) => {
    setSelectedScheme(scheme);
    setDeleteModalVisible(true);
    handleClose();
  };

  // Activate handler
  const handleActivateClick = (scheme) => {
    setSelectedScheme(scheme);
    handleClose();
    
    // Confirm activation
    if (window.confirm(`Are you sure you want to activate "${scheme.title}"?`)) {
      activateScheme(scheme._id);
    }
  };

  const activateScheme = async (schemeId) => {
    try {
      const response = await axiosInstance.patch(`/incentives/schemes/${schemeId}`, {
        status: 'ACTIVE'
      });
      if (response.data.status === 'success') {
        showSuccess('Scheme activated successfully!');
        fetchSchemes(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error activating scheme:', error);
      showError(error.response?.data?.message || 'Failed to activate scheme');
    }
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setFormErrors({});
    setApiError(null);
  };

  // Helper functions for form arrays with isEnabled preservation
  const addSlab = (section) => {
    setFormData(prev => {
      const sectionData = prev.params[section];
      const updatedSection = {
        ...sectionData,
        isEnabled: sectionData.isEnabled !== undefined ? sectionData.isEnabled : true,
        slabs: [...(sectionData.slabs || []), { from: '', to: '', amount: '' }]
      };
      
      return {
        ...prev,
        params: {
          ...prev.params,
          [section]: updatedSection
        }
      };
    });
  };

  const removeSlab = (section, index) => {
    setFormData(prev => {
      const sectionData = prev.params[section];
      const newSlabs = (sectionData.slabs || []).filter((_, i) => i !== index);
      
      return {
        ...prev,
        params: {
          ...prev.params,
          [section]: {
            ...sectionData,
            isEnabled: sectionData.isEnabled !== undefined ? sectionData.isEnabled : true,
            slabs: newSlabs
          }
        }
      };
    });
  };

  const updateSlab = (section, index, field, value) => {
    setFormData(prev => {
      const sectionData = prev.params[section];
      const newSlabs = (sectionData.slabs || []).map((slab, i) => {
        if (i === index) {
          return { ...slab, [field]: value };
        }
        return slab;
      });
      
      return {
        ...prev,
        params: {
          ...prev.params,
          [section]: {
            ...sectionData,
            isEnabled: sectionData.isEnabled !== undefined ? sectionData.isEnabled : true,
            slabs: newSlabs
          }
        }
      };
    });
  };

  const addModelIncentive = () => {
    setFormData(prev => ({
      ...prev,
      params: {
        ...prev.params,
        modelIncentive: {
          ...prev.params.modelIncentive,
          isEnabled: prev.params.modelIncentive.isEnabled !== undefined ? prev.params.modelIncentive.isEnabled : true,
          modelIncentives: [...(prev.params.modelIncentive.modelIncentives || []), { 
            model: '', 
            modelName: '', 
            amountPerUnit: '' 
          }]
        }
      }
    }));
  };

  const removeModelIncentive = (index) => {
    setFormData(prev => ({
      ...prev,
      params: {
        ...prev.params,
        modelIncentive: {
          ...prev.params.modelIncentive,
          isEnabled: prev.params.modelIncentive.isEnabled !== undefined ? prev.params.modelIncentive.isEnabled : true,
          modelIncentives: prev.params.modelIncentive.modelIncentives.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateModelIncentive = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      params: {
        ...prev.params,
        modelIncentive: {
          ...prev.params.modelIncentive,
          isEnabled: prev.params.modelIncentive.isEnabled !== undefined ? prev.params.modelIncentive.isEnabled : true,
          modelIncentives: prev.params.modelIncentive.modelIncentives.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    }));
  };

  // Multi-select handlers for scope (branches/subdealers)
  const handleScopeChange = (type, value) => {
    setFormData(prev => {
      const currentScope = prev.scope[type] || [];
      if (value && !currentScope.includes(value)) {
        return {
          ...prev,
          scope: {
            ...prev.scope,
            [type]: [...currentScope, value]
          }
        };
      }
      return prev;
    });
    setApiError(null);
  };

  const removeScopeItem = (type, id) => {
    setFormData(prev => ({
      ...prev,
      scope: {
        ...prev.scope,
        [type]: prev.scope[type].filter(item => item !== id)
      }
    }));
    setApiError(null);
  };

  // Multi-select handlers for headers
  const handleHeaderChange = (value) => {
    setFormData(prev => {
      const currentHeaders = prev.params.addonServicesAndAccessories.applicableHeaders || [];
      if (value && !currentHeaders.some(item => item.header === value)) {
        const header = headers.find(h => h._id === value);
        return {
          ...prev,
          params: {
            ...prev.params,
            addonServicesAndAccessories: {
              ...prev.params.addonServicesAndAccessories,
              isEnabled: prev.params.addonServicesAndAccessories.isEnabled !== undefined ? prev.params.addonServicesAndAccessories.isEnabled : true,
              applicableHeaders: [...currentHeaders, { header: value, headerName: header?.header_key || value }]
            }
          }
        };
      }
      return prev;
    });
    setApiError(null);
  };

  const removeHeader = (id) => {
    setFormData(prev => ({
      ...prev,
      params: {
        ...prev.params,
        addonServicesAndAccessories: {
          ...prev.params.addonServicesAndAccessories,
          isEnabled: prev.params.addonServicesAndAccessories.isEnabled !== undefined ? prev.params.addonServicesAndAccessories.isEnabled : true,
          applicableHeaders: (prev.params.addonServicesAndAccessories.applicableHeaders || []).filter(
            item => item.header !== id
          )
        }
      }
    }));
    setApiError(null);
  };

  // Multi-select handlers for accessories
  const handleAccessoryChange = (value) => {
    setFormData(prev => {
      const currentAccessories = prev.params.addonServicesAndAccessories.applicableAccessories || [];
      if (value && !currentAccessories.some(item => item.accessory === value)) {
        const accessory = accessories.find(a => a._id === value);
        return {
          ...prev,
          params: {
            ...prev.params,
            addonServicesAndAccessories: {
              ...prev.params.addonServicesAndAccessories,
              isEnabled: prev.params.addonServicesAndAccessories.isEnabled !== undefined ? prev.params.addonServicesAndAccessories.isEnabled : true,
              applicableAccessories: [...currentAccessories, { accessory: value, accessoryName: accessory?.name || value }]
            }
          }
        };
      }
      return prev;
    });
    setApiError(null);
  };

  const removeAccessory = (id) => {
    setFormData(prev => ({
      ...prev,
      params: {
        ...prev.params,
        addonServicesAndAccessories: {
          ...prev.params.addonServicesAndAccessories,
          isEnabled: prev.params.addonServicesAndAccessories.isEnabled !== undefined ? prev.params.addonServicesAndAccessories.isEnabled : true,
          applicableAccessories: (prev.params.addonServicesAndAccessories.applicableAccessories || []).filter(
            item => item.accessory !== id
          )
        }
      }
    }));
    setApiError(null);
  };

  // Get display names for selected items
  const getSelectedScopeNames = (type) => {
    const ids = formData.scope[type] || [];
    if (type === 'branches') {
      return ids.map(id => {
        const branch = allBranches.find(b => b._id === id);
        return branch ? `${branch.name} - ${branch.city}` : id;
      });
    } else {
      return ids.map(id => {
        const subdealer = subdealers.find(s => s._id === id);
        return subdealer ? subdealer.name : id;
      });
    }
  };

  const getSelectedHeaderNames = () => {
    return (formData.params.addonServicesAndAccessories.applicableHeaders || []).map(item => {
      const header = headers.find(h => h._id === item.header);
      return header ? `${header.header_key} (${header.category_key})` : item.headerName || item.header;
    });
  };

  const getSelectedAccessoryNames = () => {
    return (formData.params.addonServicesAndAccessories.applicableAccessories || []).map(item => {
      const accessory = accessories.find(a => a._id === item.accessory);
      return accessory ? `${accessory.name} - ₹${accessory.price}` : item.accessoryName || item.accessory;
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.periodType) errors.periodType = 'Period type is required';
    if (!formData.totalIncentivePool) errors.totalIncentivePool = 'Total incentive pool is required';
    
    // Validate period-specific fields based on periodType
    if (formData.periodType === 'MONTHLY') {
      if (!formData.month) errors.month = 'Month is required';
      if (!formData.year) errors.year = 'Year is required';
    } else if (formData.periodType === 'CUSTOM') {
      if (!formData.validFrom) errors.validFrom = 'Valid from date is required';
      if (!formData.validTo) errors.validTo = 'Valid to date is required';
    } else if (formData.periodType === 'QUARTERLY') {
      if (!formData.quarter) errors.quarter = 'Quarter is required';
      if (!formData.year) errors.year = 'Year is required';
    }
    
    // Validate volume slabs
    formData.params.volumeSlab.slabs.forEach((slab, index) => {
      if (slab.from !== '' && slab.to !== '' && slab.amount !== '') {
        // Only validate if all fields are filled
      } else if (slab.from || slab.to || slab.amount) {
        if (!slab.from) errors[`volume_from_${index}`] = 'From is required';
        if (!slab.to) errors[`volume_to_${index}`] = 'To is required';
        if (!slab.amount) errors[`volume_amount_${index}`] = 'Amount is required';
      }
    });
    
    // Validate addon slabs
    formData.params.addonServicesAndAccessories.slabs.forEach((slab, index) => {
      if (slab.from !== '' && slab.to !== '' && slab.amount !== '') {
        // Only validate if all fields are filled
      } else if (slab.from || slab.to || slab.amount) {
        if (!slab.from) errors[`addon_from_${index}`] = 'From is required';
        if (!slab.to) errors[`addon_to_${index}`] = 'To is required';
        if (!slab.amount) errors[`addon_amount_${index}`] = 'Amount is required';
      }
    });
    
    // Validate model incentives
    formData.params.modelIncentive.modelIncentives.forEach((item, index) => {
      if (item.modelName || item.model || item.amountPerUnit) {
        if (!item.modelName && !item.model) {
          errors[`model_name_${index}`] = 'Model is required';
        }
        if (!item.amountPerUnit || item.amountPerUnit === '') {
          errors[`model_amount_${index}`] = 'Amount is required';
        }
      }
    });
    
    // Validate exchange slabs
    formData.params.exchangeSlab.slabs.forEach((slab, index) => {
      if (slab.from !== '' && slab.to !== '' && slab.amount !== '') {
        // Only validate if all fields are filled
      } else if (slab.from || slab.to || slab.amount) {
        if (!slab.from) errors[`exchange_from_${index}`] = 'From is required';
        if (!slab.to) errors[`exchange_to_${index}`] = 'To is required';
        if (!slab.amount) errors[`exchange_amount_${index}`] = 'Amount is required';
      }
    });
    
    setFormErrors(errors);
    setApiError(null);
    return Object.keys(errors).length === 0;
  };

  // Helper function to extract error message from API response
  const extractErrorMessage = (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    
    setFormLoading(true);
    setApiError(null);
    
    try {
      // Filter model incentives properly
      const modelIncentives = formData.params.modelIncentive.modelIncentives
        .filter(m => {
          const hasModel = m.modelName || m.model;
          const hasAmount = m.amountPerUnit;
          return hasModel && hasAmount;
        })
        .map(m => ({
          model: m.model || '',
          modelName: m.modelName || '',
          amountPerUnit: parseFloat(m.amountPerUnit || 0)
        }));
      
      const payload = {
        title: formData.title,
        periodType: formData.periodType,
        isSubdealerScheme: formData.isSubdealerScheme,
        scope: formData.scope,
        totalIncentivePool: parseFloat(formData.totalIncentivePool),
        status: formData.status,
        remarks: formData.remarks || undefined,
        applicableRoles: formData.applicableRoles || [],
        ...(formData.periodType === 'MONTHLY' && {
          month: parseInt(formData.month),
          year: parseInt(formData.year)
        }),
        ...(formData.periodType === 'CUSTOM' && {
          validFrom: formData.validFrom,
          validTo: formData.validTo
        }),
        ...(formData.periodType === 'QUARTERLY' && {
          quarter: formData.quarter,
          year: parseInt(formData.year)
        }),
        params: {
          volumeSlab: {
            isEnabled: formData.params.volumeSlab.isEnabled || false,
            slabType: formData.params.volumeSlab.slabType,
            slabs: formData.params.volumeSlab.slabs
              .filter(s => s.from && s.to && s.amount)
              .map(s => ({
                from: parseInt(s.from),
                to: parseInt(s.to),
                amount: parseFloat(s.amount)
              }))
          },
          addonServicesAndAccessories: {
            isEnabled: formData.params.addonServicesAndAccessories.isEnabled || false,
            deductItemDiscount: formData.params.addonServicesAndAccessories.deductItemDiscount || false,
            applicableHeaders: formData.params.addonServicesAndAccessories.applicableHeaders || [],
            applicableAccessories: formData.params.addonServicesAndAccessories.applicableAccessories || [],
            slabs: formData.params.addonServicesAndAccessories.slabs
              .filter(s => s.from && s.to && s.amount)
              .map(s => ({
                from: parseInt(s.from),
                to: parseInt(s.to),
                amount: parseFloat(s.amount)
              }))
          },
          modelIncentive: {
            isEnabled: formData.params.modelIncentive.isEnabled || false,
            modelIncentives: modelIncentives
          },
          exchangeSlab: {
            isEnabled: formData.params.exchangeSlab.isEnabled || false,
            slabs: formData.params.exchangeSlab.slabs
              .filter(s => s.from && s.to && s.amount)
              .map(s => ({
                from: parseInt(s.from),
                to: parseInt(s.to),
                amount: parseFloat(s.amount)
              }))
          },
          managerIncentive: {
            isEnabled: formData.params.managerIncentive.isEnabled || false,
            perChassisAmount: parseFloat(formData.params.managerIncentive.perChassisAmount) || 0,
            volumeSlab: (formData.params.managerIncentive.volumeSlab || [])
              .filter(s => s.from !== undefined && s.amount !== undefined)
              .map(s => ({
                from: parseInt(s.from) || 0,
                to: s.to ? parseInt(s.to) : null,
                amount: parseFloat(s.amount) || 0
              }))
          }
        }
      };
      
      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });
      
      const response = await axiosInstance.post('/incentives/schemes', payload);
      if (response.data.status === 'success') {
        showSuccess('Scheme created successfully!');
        setAddModalVisible(false);
        resetForm();
        fetchSchemes(1, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error creating scheme:', error);
      const errorMessage = extractErrorMessage(error);
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedScheme) return;
    
    setFormLoading(true);
    setApiError(null);
    
    try {
      const modelIncentives = formData.params.modelIncentive.modelIncentives
        .filter(m => {
          const hasModel = m.modelName || m.model;
          const hasAmount = m.amountPerUnit;
          return hasModel && hasAmount;
        })
        .map(m => ({
          model: m.model || '',
          modelName: m.modelName || '',
          amountPerUnit: parseFloat(m.amountPerUnit || 0)
        }));
      
      const payload = {
        title: formData.title,
        periodType: formData.periodType,
        isSubdealerScheme: formData.isSubdealerScheme,
        scope: formData.scope,
        totalIncentivePool: parseFloat(formData.totalIncentivePool),
        status: formData.status,
        remarks: formData.remarks || undefined,
        applicableRoles: formData.applicableRoles || [],
        ...(formData.periodType === 'MONTHLY' && {
          month: parseInt(formData.month),
          year: parseInt(formData.year)
        }),
        ...(formData.periodType === 'CUSTOM' && {
          validFrom: formData.validFrom,
          validTo: formData.validTo
        }),
        ...(formData.periodType === 'QUARTERLY' && {
          quarter: formData.quarter,
          year: parseInt(formData.year)
        }),
        params: {
          volumeSlab: {
            isEnabled: formData.params.volumeSlab.isEnabled || false,
            slabType: formData.params.volumeSlab.slabType,
            slabs: formData.params.volumeSlab.slabs
              .filter(s => s.from && s.to && s.amount)
              .map(s => ({
                from: parseInt(s.from),
                to: parseInt(s.to),
                amount: parseFloat(s.amount)
              }))
          },
          addonServicesAndAccessories: {
            isEnabled: formData.params.addonServicesAndAccessories.isEnabled || false,
            deductItemDiscount: formData.params.addonServicesAndAccessories.deductItemDiscount || false,
            applicableHeaders: formData.params.addonServicesAndAccessories.applicableHeaders || [],
            applicableAccessories: formData.params.addonServicesAndAccessories.applicableAccessories || [],
            slabs: formData.params.addonServicesAndAccessories.slabs
              .filter(s => s.from && s.to && s.amount)
              .map(s => ({
                from: parseInt(s.from),
                to: parseInt(s.to),
                amount: parseFloat(s.amount)
              }))
          },
          modelIncentive: {
            isEnabled: formData.params.modelIncentive.isEnabled || false,
            modelIncentives: modelIncentives
          },
          exchangeSlab: {
            isEnabled: formData.params.exchangeSlab.isEnabled || false,
            slabs: formData.params.exchangeSlab.slabs
              .filter(s => s.from && s.to && s.amount)
              .map(s => ({
                from: parseInt(s.from),
                to: parseInt(s.to),
                amount: parseFloat(s.amount)
              }))
          },
          managerIncentive: {
            isEnabled: formData.params.managerIncentive.isEnabled || false,
            perChassisAmount: parseFloat(formData.params.managerIncentive.perChassisAmount) || 0,
            volumeSlab: (formData.params.managerIncentive.volumeSlab || [])
              .filter(s => s.from !== undefined && s.amount !== undefined)
              .map(s => ({
                from: parseInt(s.from) || 0,
                to: s.to ? parseInt(s.to) : null,
                amount: parseFloat(s.amount) || 0
              }))
          }
        }
      };
      
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });
      
      const response = await axiosInstance.patch(`/incentives/schemes/${selectedScheme._id}`, payload);
      if (response.data.status === 'success') {
        showSuccess('Scheme updated successfully!');
        setEditModalVisible(false);
        resetForm();
        fetchSchemes(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error updating scheme:', error);
      const errorMessage = extractErrorMessage(error);
      setApiError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedScheme) return;
    
    try {
      const response = await axiosInstance.delete(`/incentives/schemes/${selectedScheme._id}`);
      if (response.data.status === 'success') {
        showSuccess('Scheme deleted successfully!');
        setDeleteModalVisible(false);
        setSelectedScheme(null);
        fetchSchemes(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      console.error('Error deleting scheme:', error);
      showError(error.response?.data?.message || 'Failed to delete scheme');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  const getPeriodTypeLabel = (periodType) => {
    const option = PERIOD_TYPE_OPTIONS.find(p => p.value === periodType);
    return option?.label || periodType;
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

  if (error && schemes.length === 0) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Incentive Schemes</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton size="sm" className="action-btn me-1" onClick={handleAddClick}>
              <CIcon icon={cilPlus} className='icon' /> Create Scheme
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
                <small className="text-danger d-block mt-1">Please select a branch to view schemes</small>
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

          {/* Search Bar */}
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
                  placeholder="Search by title..."
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
              <h5 className="text-muted">Please select a branch to view schemes</h5>
              <p className="text-muted">Select a branch from the dropdown above to manage incentive schemes for that branch</p>
            </div>
          )}

          {/* Schemes Table */}
          {selectedBranchId && (
            <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <CTable striped bordered hover className='responsive-table'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.no</CTableHeaderCell>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Period</CTableHeaderCell>
                    <CTableHeaderCell>Month/Quarter</CTableHeaderCell>
                    <CTableHeaderCell>Year</CTableHeaderCell>
                    <CTableHeaderCell>Pool Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {schemes.length === 0 && !loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan={8} style={{ color: 'red', textAlign: 'center' }}>
                        {searchTerm ? `No results found for "${searchTerm}"` : 'No schemes found for this branch.'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    schemes.map((scheme, index) => {
                      const globalIndex = (pagination.page - 1) * pagination.limit + index + 1;
                      return (
                        <CTableRow key={scheme._id}>
                          <CTableDataCell>{globalIndex}</CTableDataCell>
                          <CTableDataCell><strong>{scheme.title}</strong></CTableDataCell>
                          <CTableDataCell>{getPeriodTypeLabel(scheme.periodType)}</CTableDataCell>
                          <CTableDataCell>
                            {scheme.periodType && scheme.periodType.toUpperCase() === 'MONTHLY' && scheme.month ? 
                              new Date(2000, scheme.month - 1).toLocaleString('default', { month: 'long' }) :
                              scheme.quarter || '-'
                            }
                          </CTableDataCell>
                          <CTableDataCell>{scheme.year || '-'}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(scheme.totalIncentivePool)}</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(scheme.status)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className="option-button btn-sm"
                              onClick={(event) => handleClick(event, scheme._id)}
                            >
                              <CIcon icon={cilOptions} /> Options
                            </CButton>
                            <Menu 
                              id={`action-menu-${scheme._id}`} 
                              anchorEl={anchorEl} 
                              open={menuId === scheme._id} 
                              onClose={handleClose}
                            >
                              <MenuItem onClick={() => handleViewClick(scheme)}>
                                <CIcon icon={cilInfo} className="me-2" /> View Details
                              </MenuItem>
                              <MenuItem onClick={() => handleEditClick(scheme)}>
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </MenuItem>
                              {/* Activate button - only show for DRAFT schemes */}
                              {scheme.status && scheme.status.toUpperCase() === 'DRAFT' && (
                                <MenuItem onClick={() => handleActivateClick(scheme)}>
                                  <CIcon icon={cilCheckCircle} className="me-2" /> Activate
                                </MenuItem>
                              )}
                              <MenuItem onClick={() => handleDeleteClick(scheme)}>
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

      {/* Add Scheme Modal */}
      <AddScheme
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setApiError(null);
          setFormErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        apiError={apiError}
        setApiError={setApiError}
        formLoading={formLoading}
        allBranches={allBranches}
        subdealers={subdealers}
        headers={headers}
        accessories={accessories}
        models={models}
        isSuperAdmin={isSuperAdmin}
        branches={branches}
        handleScopeChange={handleScopeChange}
        removeScopeItem={removeScopeItem}
        getSelectedScopeNames={getSelectedScopeNames}
        handleHeaderChange={handleHeaderChange}
        removeHeader={removeHeader}
        getSelectedHeaderNames={getSelectedHeaderNames}
        handleAccessoryChange={handleAccessoryChange}
        removeAccessory={removeAccessory}
        getSelectedAccessoryNames={getSelectedAccessoryNames}
        addSlab={addSlab}
        removeSlab={removeSlab}
        updateSlab={updateSlab}
        addModelIncentive={addModelIncentive}
        removeModelIncentive={removeModelIncentive}
        updateModelIncentive={updateModelIncentive}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Scheme Modal */}
      <EditScheme
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setApiError(null);
          setFormErrors({});
        }}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        apiError={apiError}
        setApiError={setApiError}
        formLoading={formLoading}
        allBranches={allBranches}
        subdealers={subdealers}
        headers={headers}
        accessories={accessories}
        models={models}
        isSuperAdmin={isSuperAdmin}
        branches={branches}
        selectedScheme={selectedScheme}
        handleScopeChange={handleScopeChange}
        removeScopeItem={removeScopeItem}
        getSelectedScopeNames={getSelectedScopeNames}
        handleHeaderChange={handleHeaderChange}
        removeHeader={removeHeader}
        getSelectedHeaderNames={getSelectedHeaderNames}
        handleAccessoryChange={handleAccessoryChange}
        removeAccessory={removeAccessory}
        getSelectedAccessoryNames={getSelectedAccessoryNames}
        addSlab={addSlab}
        removeSlab={removeSlab}
        updateSlab={updateSlab}
        addModelIncentive={addModelIncentive}
        removeModelIncentive={removeModelIncentive}
        updateModelIncentive={updateModelIncentive}
        onSubmit={handleEditSubmit}
      />

      {/* View Scheme Modal */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)} alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Scheme Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedScheme && (
            <div>
              <CRow className="mb-3">
                <CCol md={8}>
                  <h5>{selectedScheme.title}</h5>
                </CCol>
                <CCol md={4} className="text-end">
                  {getStatusBadge(selectedScheme.status)}
                </CCol>
              </CRow>

              <div className="border-bottom pb-2 mb-3">
                <h6>Basic Information</h6>
              </div>
              <CRow className="mb-2">
                <CCol md={4}><strong>Period Type:</strong></CCol>
                <CCol md={8}>{getPeriodTypeLabel(selectedScheme.periodType)}</CCol>
              </CRow>
              {selectedScheme.periodType && selectedScheme.periodType.toUpperCase() === 'MONTHLY' && (
                <CRow className="mb-2">
                  <CCol md={4}><strong>Month:</strong></CCol>
                  <CCol md={8}>
                    {selectedScheme.month ? new Date(2000, selectedScheme.month - 1).toLocaleString('default', { month: 'long' }) : '-'}
                  </CCol>
                </CRow>
              )}
              {selectedScheme.periodType && selectedScheme.periodType.toUpperCase() === 'QUARTERLY' && (
                <CRow className="mb-2">
                  <CCol md={4}><strong>Quarter:</strong></CCol>
                  <CCol md={8}>{selectedScheme.quarter || '-'}</CCol>
                </CRow>
              )}
              {selectedScheme.periodType && selectedScheme.periodType.toUpperCase() === 'CUSTOM' && (
                <>
                  <CRow className="mb-2">
                    <CCol md={4}><strong>Valid From:</strong></CCol>
                    <CCol md={8}>{formatDate(selectedScheme.validFrom)}</CCol>
                  </CRow>
                  <CRow className="mb-2">
                    <CCol md={4}><strong>Valid To:</strong></CCol>
                    <CCol md={8}>{formatDate(selectedScheme.validTo)}</CCol>
                  </CRow>
                </>
              )}
              <CRow className="mb-2">
                <CCol md={4}><strong>Year:</strong></CCol>
                <CCol md={8}>{selectedScheme.year || '-'}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Total Incentive Pool:</strong></CCol>
                <CCol md={8}>{formatCurrency(selectedScheme.totalIncentivePool)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Utilized Amount:</strong></CCol>
                <CCol md={8}>{formatCurrency(selectedScheme.utilizedAmount)}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Subdealer Scheme:</strong></CCol>
                <CCol md={8}>{selectedScheme.isSubdealerScheme ? 'Yes' : 'No'}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Scope:</strong></CCol>
                <CCol md={8}>
                  {selectedScheme.isSubdealerScheme ? (
                    selectedScheme.scope?.subdealers?.length > 0 ? 
                      selectedScheme.scope.subdealers.map(s => s.name || s).join(', ') : 'All Subdealers'
                  ) : (
                    selectedScheme.scope?.branches?.length > 0 ? 
                      selectedScheme.scope.branches.map(b => b.name || b).join(', ') : 'All Branches'
                  )}
                </CCol>
              </CRow>
              {selectedScheme.remarks && (
                <CRow className="mb-2">
                  <CCol md={4}><strong>Remarks:</strong></CCol>
                  <CCol md={8}>{selectedScheme.remarks}</CCol>
                </CRow>
              )}
              <CRow className="mb-2">
                <CCol md={4}><strong>Created By:</strong></CCol>
                <CCol md={8}>{selectedScheme.createdBy?.name || 'N/A'}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Created At:</strong></CCol>
                <CCol md={8}>{formatDate(selectedScheme.createdAt)}</CCol>
              </CRow>

              {/* Volume Slab Details */}
              {selectedScheme.params?.volumeSlab?.slabs?.length > 0 && selectedScheme.params.volumeSlab.slabs[0].from && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6>Volume Slab ({selectedScheme.params.volumeSlab.slabType || 'FLAT'})</h6>
                  </div>
                  <CTable striped bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>From</CTableHeaderCell>
                        <CTableHeaderCell>To</CTableHeaderCell>
                        <CTableHeaderCell>Amount (₹)</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedScheme.params.volumeSlab.slabs.map((slab, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{slab.from}</CTableDataCell>
                          <CTableDataCell>{slab.to}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(slab.amount)}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}

              {/* Addon Services Details */}
              {selectedScheme.params?.addonServicesAndAccessories?.slabs?.length > 0 && selectedScheme.params.addonServicesAndAccessories.slabs[0].from && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6>Addon Services & Accessories</h6>
                  </div>
                  <CRow className="mb-2">
                    <CCol md={4}><strong>Deduct Item Discount:</strong></CCol>
                    <CCol md={8}>{selectedScheme.params.addonServicesAndAccessories.deductItemDiscount ? 'Yes' : 'No'}</CCol>
                  </CRow>
                  {selectedScheme.params.addonServicesAndAccessories.applicableHeaders?.length > 0 && (
                    <CRow className="mb-2">
                      <CCol md={4}><strong>Applicable Headers:</strong></CCol>
                      <CCol md={8}>
                        {selectedScheme.params.addonServicesAndAccessories.applicableHeaders.map((header, idx) => (
                          <CBadge key={idx} color="primary" className="me-1">
                            {header.headerName || header.header}
                          </CBadge>
                        ))}
                      </CCol>
                    </CRow>
                  )}
                  {selectedScheme.params.addonServicesAndAccessories.applicableAccessories?.length > 0 && (
                    <CRow className="mb-2">
                      <CCol md={4}><strong>Applicable Accessories:</strong></CCol>
                      <CCol md={8}>
                        {selectedScheme.params.addonServicesAndAccessories.applicableAccessories.map((acc, idx) => (
                          <CBadge key={idx} color="info" className="me-1">
                            {acc.accessoryName || acc.accessory}
                          </CBadge>
                        ))}
                      </CCol>
                    </CRow>
                  )}
                  <CTable striped bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>From (₹)</CTableHeaderCell>
                        <CTableHeaderCell>To (₹)</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedScheme.params.addonServicesAndAccessories.slabs.map((slab, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{slab.from}</CTableDataCell>
                          <CTableDataCell>{slab.to}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(slab.amount)}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}

              {/* Model Incentive Details */}
              {selectedScheme.params?.modelIncentive?.modelIncentives?.length > 0 && selectedScheme.params.modelIncentive.modelIncentives[0].modelName && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6>Model Incentive</h6>
                  </div>
                  <CTable striped bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Model Name</CTableHeaderCell>
                        <CTableHeaderCell>Amount Per Unit (₹)</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedScheme.params.modelIncentive.modelIncentives.map((item, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{item.modelName}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(item.amountPerUnit || item.amount)}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}

              {/* Exchange Slab Details */}
              {selectedScheme.params?.exchangeSlab?.slabs?.length > 0 && selectedScheme.params.exchangeSlab.slabs[0].from && (
                <>
                  <div className="border-bottom pb-2 mb-3 mt-4">
                    <h6>Exchange Slab</h6>
                  </div>
                  <CTable striped bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>From</CTableHeaderCell>
                        <CTableHeaderCell>To</CTableHeaderCell>
                        <CTableHeaderCell>Amount (₹)</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedScheme.params.exchangeSlab.slabs.map((slab, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{slab.from}</CTableDataCell>
                          <CTableDataCell>{slab.to}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(slab.amount)}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this scheme?</p>
          <p><strong>Title:</strong> {selectedScheme?.title}</p>
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

export default Schemes;