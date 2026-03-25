import React, { useState, useEffect, useRef } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';

import { cilSearch } from '@coreui/icons';
import {
  cilBank,
  cilBarcode,
  cilBike,
  cilBirthdayCake,
  cilBriefcase,
  cilCalendar,
  cilCarAlt,
  cilChartLine,
  cilCreditCard,
  cilEnvelopeClosed,
  cilFingerprint,
  cilHome,
  cilInstitution,
  cilList,
  cilListRich,
  cilLocationPin,
  cilMap,
  cilMoney,
  cilPaint,
  cilPeople,
  cilPhone,
  cilShieldAlt,
  cilSwapVertical,
  cilTask,
  cilUser
} from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import Select from "react-select";

function BookingForm() {
  const [userData, setUserData] = useState(null);
  const [isSalesExecutive, setIsSalesExecutive] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasCSDAccess, setHasCSDAccess] = useState(false);
  
  // ===== Discount limits state (only used in edit mode) =====
  const [discountLimits, setDiscountLimits] = useState({
    onRoadPrice: 0,
    addOnServices: 0,
    accessories: 0
  });

  const [remainingDiscounts, setRemainingDiscounts] = useState({
    onRoadPrice: 0,        // Amount in rupees
    addOnServices: 0,      // Percentage
    addOnServicesAmount: 0, // Amount in rupees (for display)
    addOnServicesPercentage: 0, // Remaining percentage based on total
    accessories: 0,        // Percentage
    accessoriesAmount: 0,   // Amount in rupees (for display)
    accessoriesPercentage: 0, // Remaining percentage based on total
    totalUsed: 0
  });

  const [discountUsageByCategory, setDiscountUsageByCategory] = useState({
    vehicle_price: 0,
    AddONservices: 0,
    Accessories: 0,
    other: 0
  });

  // State to store the total values of special headers
  const [specialHeaderValues, setSpecialHeaderValues] = useState({
    addOnServicesTotal: 0,
    accessoriesTotal: 0,
    onRoadPriceTotal: 0
  });
  // ===== END =====
  
  const [formData, setFormData] = useState({
    verticle_id: '',
    model_id: '',
    model_color: '',
    customer_type: 'B2C',
    rto_type: 'MH',
    branch: '',
    optionalComponents: [],
    sales_executive: '',
    gstin: '',
    rto_amount: '',
    salutation: '',
    name: '',
    pan_no: '',
    dob: '',
    occupation: '',
    address: '',
    taluka: '',
    district: '',
    pincode: '',
    mobile1: '',
    mobile2: '',
    aadhar_number: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: '',
    type: 'cash',
    financer_id: '',
    scheme: '',
    emi_plan: '',
    gc_applicable: true,
    gc_amount: '',
    discountType: 'fixed',
    selected_accessories: [],
    hpa: true,
    selfInsurance: false,
    insuranceFivePlusFive: false,
    is_exchange: false,
    broker_id: '',
    exchange_price: '',
    vehicle_number: '',
    chassis_number: '',
    note: '',
    uncheckedHeaders: [],
    uncheckedAccessories: [],
    subsidy_amount: '',
    rto_code: '' // Start empty, will be set to MH 15 only for new bookings
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [allVerticles, setAllVerticles] = useState([]); 
  const [userVerticles, setUserVerticles] = useState([]); 
  const [userVerticleIds, setUserVerticleIds] = useState([]); 
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [financers, setFinancers] = useState([]);
  const [filteredFinancers, setFilteredFinancers] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [modelDetails, setModelDetails] = useState(null);
  const [accessoriesTotal, setAccessoriesTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [modelType, setModelType] = useState('');
  const [selectedModelName, setSelectedModelName] = useState('');
  const [isEVModel, setIsEVModel] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [headerDiscounts, setHeaderDiscounts] = useState({});
  const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
  const [selectedFinancerGC, setSelectedFinancerGC] = useState('');
  
  // New state for RTO codes
  const [rtoCodes, setRtoCodes] = useState([]);
  const [loadingRtoCodes, setLoadingRtoCodes] = useState(false);
  
  const isInitialBookingLoad = useRef(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Filter financers based on branch
  useEffect(() => {
    if (formData.branch) {
      const filtered = financers.filter(financer => 
        financer.branchRates.some(rate => rate.branchId === formData.branch)
      );
      setFilteredFinancers(filtered);
    } else {
      setFilteredFinancers([]);
    }
  }, [formData.branch, financers]);

  // ===== Function to calculate discount usage by category (only for edit mode) =====
  const calculateDiscountUsageByCategory = (headers, discounts) => {
    const usage = {
      vehicle_price: 0,
      AddONservices: 0,
      Accessories: 0,
      other: 0
    };
    
    headers.forEach((price) => {
      const header = price.header;
      if (!header) return;
      
      const headerId = header._id || header.id;
      const categoryKey = header.category_key || '';
      const discountValue = discounts[headerId] !== undefined ? discounts[headerId] : 0;
      const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
      if (discountAmount > 0) {
        if (categoryKey === 'vehicle_price') {
          usage.vehicle_price += discountAmount;
        } else if (categoryKey === 'AddONservices') {
          usage.AddONservices += discountAmount;
        } else if (categoryKey === 'Accesories' || categoryKey === 'Accessories') {
          usage.Accessories += discountAmount;
        } else {
          usage.other += discountAmount;
        }
      }
    });
    
    return usage;
  };
  // ===== END =====

  // ===== Function to extract special header values =====
  const extractSpecialHeaderValues = (headers) => {
    let addOnServicesTotal = 0;
    let accessoriesTotal = 0;
    let onRoadPriceTotal = 0;
    
    headers.forEach((price) => {
      const header = price.header;
      if (!header) return;
      
      const headerKey = header.header_key || '';
      
      if (headerKey.includes('ADD ON SERVICES TOTAL') || headerKey.includes('ADDON SERVICES TOTAL')) {
        addOnServicesTotal = price.value || 0;
      } else if (headerKey === 'ACCESSORIES TOTAL') {
        accessoriesTotal = price.value || 0;
      } else if (headerKey.includes('ON ROAD PRICE') || headerKey.includes('ON-ROAD PRICE')) {
        onRoadPriceTotal = price.value || 0;
      }
    });
    
    return { addOnServicesTotal, accessoriesTotal, onRoadPriceTotal };
  };
  // ===== END =====

  // Function to filter headers based on HPA status
  const filterHeadersByHPAStatus = (headers, hpaEnabled) => {
    if (hpaEnabled) {
      return headers; // Show all headers when HPA is enabled
    } else {
      // Filter out headers starting with 'HP' or 'HPA' when HPA is disabled
      return headers.filter(price => {
        const headerKey = price.header?.header_key || '';
        const lowerHeaderKey = headerKey.toLowerCase();
        
        // Exclude headers related to HPA
        return !(
          lowerHeaderKey.startsWith('hp') ||
          lowerHeaderKey.startsWith('hpa') ||
          lowerHeaderKey.includes('hypothecation') ||
          lowerHeaderKey.includes('loan')
        );
      });
    }
  };

  // Updated function to filter out insurance headers based on insurance settings
  const filterInsuranceHeaders = (headers) => {
    return headers.filter(price => {
      if (!price.header || !price.header.header_key) return true;
      
      const headerKey = price.header.header_key;
      
      // Case 1: Self Insurance is true - hide all insurance-related headers
      if (formData.selfInsurance === true) {
        if (headerKey.includes('INSURANCE') || 
            headerKey === 'INSURANCE' || 
            headerKey === 'INSURANCE CHARGES' || 
            headerKey === 'Insurance: 5 + 5 Years') {
          return false;
        }
      }
      
      // Case 2: Insurance 5+5 is true and Self Insurance is false - 
      // Show Insurance: 5 + 5 Years, hide INSURANCE CHARGES
      if (formData.selfInsurance === false && formData.insuranceFivePlusFive === true) {
        if (headerKey === 'INSURANCE CHARGES') {
          return false;
        }
        // Insurance: 5 + 5 Years should be shown in this case
        return true;
      }
      
      // Case 3: Both Self Insurance and Insurance 5+5 are false - 
      // Show INSURANCE CHARGES, hide Insurance: 5 + 5 Years
      if (formData.selfInsurance === false && formData.insuranceFivePlusFive === false) {
        if (headerKey === 'Insurance: 5 + 5 Years') {
          return false;
        }
        // INSURANCE CHARGES should be shown in this case
        return true;
      }
      
      return true;
    });
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        const response = await axiosInstance.get('/auth/me');
        const userData = response.data.data;
        setUserData(userData);
        
        // ===== Set discount limits from user data =====
        setDiscountLimits({
          onRoadPrice: userData.onRoadPrice || 0,
          addOnServices: userData.addOnServices || 0,
          accessories: userData.accessories || 0
        });
        
        setRemainingDiscounts({
          onRoadPrice: userData.onRoadPrice || 0,
          addOnServices: userData.addOnServices || 0,
          addOnServicesAmount: 0,
          addOnServicesPercentage: userData.addOnServices || 0,
          accessories: userData.accessories || 0,
          accessoriesAmount: 0,
          accessoriesPercentage: userData.accessories || 0,
          totalUsed: 0
        });
        // ===== END =====
        
        const csdAccess = userData.csd || false;
        setHasCSDAccess(csdAccess);
        
        const isSalesExec = userData.roles?.some(role => role.name === 'SALES_EXECUTIVE') || false;
        setIsSalesExecutive(isSalesExec);
        
        if (isSalesExec && userData.branch?._id) {
          setFormData(prev => ({
            ...prev,
            branch: userData.branch._id,
            sales_executive: userData._id
          }));
        }
        
        const verticlesData = userData.verticles || [];
        const verticleIds = verticlesData.map(verticle => verticle._id);
        setUserVerticleIds(verticleIds);
        
        await fetchAllVerticles(verticlesData);
        
        // ONLY fetch initial models if NOT in edit mode
        if (!id) {
          if (isSalesExec && userData.branch?._id) {
            fetchModels('B2C', userData.branch._id);
          } else {
            fetchModels('B2C');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const storedUserRole = localStorage.getItem('userRole');
        const isSalesExec = storedUser.roles?.some(role => role.name === 'SALES_EXECUTIVE') || 
                           storedUserRole === 'SALES_EXECUTIVE' || 
                           false;
        setIsSalesExecutive(isSalesExec);
        
        const storedCSD = storedUser.csd || false;
        setHasCSDAccess(storedCSD);
      } finally {
        setLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, [id]);

  // ===== Effect to recalculate discount usage when header discounts change (only in edit mode) =====
  useEffect(() => {
    if (isEditMode && Object.keys(headerDiscounts).length > 0) {
      const tab6Headers = getSelectedHeadersForTab6();
      const newUsage = calculateDiscountUsageByCategory(tab6Headers, headerDiscounts);
      setDiscountUsageByCategory(newUsage);
      
      // Extract special header values
      const specialValues = extractSpecialHeaderValues(tab6Headers);
      setSpecialHeaderValues(specialValues);
      
      // Calculate remaining percentages based on special header values
      const maxAddOnAmount = (specialValues.addOnServicesTotal * discountLimits.addOnServices) / 100;
      const maxAccessoriesAmount = (specialValues.accessoriesTotal * discountLimits.accessories) / 100;
      
      const remainingAddOnAmount = Math.max(0, maxAddOnAmount - newUsage.AddONservices);
      const remainingAddOnPercentage = specialValues.addOnServicesTotal > 0 
        ? ((remainingAddOnAmount / specialValues.addOnServicesTotal) * 100).toFixed(1)
        : 0;
      
      const remainingAccessoriesAmount = Math.max(0, maxAccessoriesAmount - newUsage.Accessories);
      const remainingAccessoriesPercentage = specialValues.accessoriesTotal > 0 
        ? ((remainingAccessoriesAmount / specialValues.accessoriesTotal) * 100).toFixed(1)
        : 0;
      
      setRemainingDiscounts({
        onRoadPrice: Math.max(0, discountLimits.onRoadPrice - newUsage.vehicle_price),
        addOnServices: discountLimits.addOnServices,
        addOnServicesAmount: remainingAddOnAmount,
        addOnServicesPercentage: remainingAddOnPercentage,
        accessories: discountLimits.accessories,
        accessoriesAmount: remainingAccessoriesAmount,
        accessoriesPercentage: remainingAccessoriesPercentage,
        totalUsed: newUsage.vehicle_price + newUsage.AddONservices + newUsage.Accessories + newUsage.other
      });
    }
  }, [headerDiscounts, discountLimits, isEditMode, accessories, formData.selected_accessories, formData.uncheckedAccessories, formData.selfInsurance, formData.insuranceFivePlusFive]);

  // Fetch RTO codes when RTO type is MH
  useEffect(() => {
    const fetchRtoCodes = async () => {
      if (formData.rto_type === 'MH') {
        setLoadingRtoCodes(true);
        try {
          const response = await axiosInstance.get('/rtos');
          // Filter active RTO codes only
          const activeRtoCodes = response.data?.data?.filter(rto => rto.is_active) || [];
          setRtoCodes(activeRtoCodes);
          
          // Only set default MH 15 for NEW bookings (not in edit mode)
          // AND only if rto_code is currently empty
          if (!isEditMode && activeRtoCodes.length > 0 && !formData.rto_code) {
            const mh15Code = activeRtoCodes.find(rto => rto.rto_code === 'MH 15');
            if (mh15Code) {
              setFormData(prev => ({ ...prev, rto_code: 'MH 15' }));
            }
          }
        } catch (error) {
          console.error('Error fetching RTO codes:', error);
          setRtoCodes([]);
          const message = showError(error);
          if (message) {
            setError(message);
          }
        } finally {
          setLoadingRtoCodes(false);
        }
      } else {
        // Clear RTO codes if not MH
        setRtoCodes([]);
        // Also clear rto_code from formData if not MH
        setFormData(prev => ({ ...prev, rto_code: '' }));
      }
    };
    
    fetchRtoCodes();
  }, [formData.rto_type, isEditMode, formData.rto_code]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        const message = showError(error);
        if (message) {
          setError(message);
        }
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    // When in edit mode and form data changes, refilter models
    if (isEditMode && formData.branch && formData.verticle_id) {
      // Filter the already fetched models
      const filtered = models.filter(model => 
        // Filter by branch (if model has branch info)
        (!model.branch_id || model.branch_id === formData.branch || model.branch === formData.branch) &&
        // Filter by verticle
        (model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id)
      );
      setFilteredModels(filtered);
    }
  }, [isEditMode, formData.branch, formData.verticle_id, models]);

  useEffect(() => {
    if (id && !isInitialBookingLoad.current) {
      isInitialBookingLoad.current = true;
      fetchBookingDetails(id);
      setIsEditMode(true);
    }
  }, [id]);

  // Initialize headerDiscounts from bookingPriceComponents in edit mode
  useEffect(() => {
    if (isEditMode && bookingPriceComponents.length > 0 && Object.keys(headerDiscounts).length === 0) {
      const initialDiscounts = {};
      bookingPriceComponents.forEach(priceComponent => {
        if (priceComponent.header && priceComponent.header._id) {
          const headerId = priceComponent.header._id;
          const discountAmount = priceComponent.discountAmount || 0;
          initialDiscounts[headerId] = discountAmount;
        }
      });
      console.log('Initializing headerDiscounts from bookingPriceComponents:', initialDiscounts);
      setHeaderDiscounts(initialDiscounts);
    }
  }, [isEditMode, bookingPriceComponents]);

  const fetchAllVerticles = async (userVerticlesData) => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setAllVerticles(verticlesData);
      
      const filteredVerticles = userVerticlesData.filter(verticle => 
        verticle.status === 'active'
      );
      setUserVerticles(filteredVerticles);
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  const handleCustomerSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter PAN or Aadhar number');
      return;
    }

    setSearchLoading(true);
    setSearchError('');

    try {
      const response = await axiosInstance.get(`/customer-ledgers/search?q=${encodeURIComponent(searchQuery)}`);

      if (response.data.success && response.data.data.customers.length > 0) {
        const customer = response.data.data.customers[0];

        const dobFromApi = customer.bookings?.[0]?.customerDetails?.dob;
        const formattedDob = dobFromApi ? dobFromApi.split('T')[0] : '';

        setFormData((prev) => ({
          ...prev,
          salutation: customer.bookings?.[0]?.customerDetails?.salutation || '',
          name: customer.name || '',
          pan_no: customer.pan || '',
          address: customer.address || '',
          taluka: customer.taluka || '',
          district: customer.district || '',
          mobile1: customer.mobile1 || '',
          mobile2: customer.mobile2 || '',
          aadhar_number: customer.aadhaar || '',
          pincode: customer.bookings?.[0]?.customerDetails?.pincode || '',
          dob: formattedDob,
          occupation: customer.bookings?.[0]?.customerDetails?.occupation || ''
        }));
      } else {
        setSearchError('No customer found with this PAN/Aadhar');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Error searching for customer');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBrokerChange = (e) => {
    const brokerId = e.target.value;
    const broker = brokers.find((b) => b._id === brokerId);
    setSelectedBroker(broker);
    setFormData((prev) => ({ ...prev, broker_id: brokerId }));
    setErrors((prev) => ({ ...prev, broker_id: '' }));
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
  };

  const handleSendOtp = async () => {
    try {
      if (!selectedBroker) return;

      const response = await axiosInstance.post(`/brokers/${selectedBroker._id}/send-otp`);
      if (response.data.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp('');
        showFormSubmitToast('OTP sent successfully to broker');
      } else {
        showFormSubmitError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!selectedBroker || !otp) return;

      const response = await axiosInstance.post('/brokers/verify-otp', {
        brokerId: selectedBroker._id,
        otp
      });

      if (response.data.success) {
        setOtpVerified(true);
        setOtpError('');
        showFormSubmitToast('OTP verified successfully');
      } else {
        setOtpError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.response?.data?.message || 'Error verifying OTP');
    }
  };

  // Enhanced header discount change function with limit validation (only for edit mode)
  const handleHeaderDiscountChange = (headerId, value, headerCategory, headerPrice) => {
    // Parse the new discount value
    const newDiscountValue = value === '' ? '' : parseFloat(value);
    
    // Get current usage by category
    const currentUsage = { ...discountUsageByCategory };
    
    // Calculate what the new usage would be
    const oldDiscountValue = headerDiscounts[headerId] !== undefined ? 
      (headerDiscounts[headerId] === '' ? 0 : parseFloat(headerDiscounts[headerId])) : 0;
    
    const difference = (newDiscountValue === '' ? 0 : newDiscountValue) - oldDiscountValue;
    
    // Clear any previous error for this header
    setErrors(prev => ({
      ...prev,
      [`discount_${headerId}`]: ''
    }));
    
    // Update the discount regardless of limits
    setHeaderDiscounts(prev => ({
      ...prev,
      [headerId]: value
    }));
    
    // Recalculate usage after a short delay (only in edit mode)
    if (isEditMode) {
      setTimeout(() => {
        const tab6Headers = getSelectedHeadersForTab6();
        const newUsage = calculateDiscountUsageByCategory(tab6Headers, {
          ...headerDiscounts,
          [headerId]: value
        });
        setDiscountUsageByCategory(newUsage);
        
        // Extract special header values
        const specialValues = extractSpecialHeaderValues(tab6Headers);
        setSpecialHeaderValues(specialValues);
        
        // Calculate remaining percentages based on special header values
        const maxAddOnAmount = (specialValues.addOnServicesTotal * discountLimits.addOnServices) / 100;
        const maxAccessoriesAmount = (specialValues.accessoriesTotal * discountLimits.accessories) / 100;
        
        const remainingAddOnAmount = Math.max(0, maxAddOnAmount - newUsage.AddONservices);
        const remainingAddOnPercentage = specialValues.addOnServicesTotal > 0 
          ? ((remainingAddOnAmount / specialValues.addOnServicesTotal) * 100).toFixed(1)
          : 0;
        
        const remainingAccessoriesAmount = Math.max(0, maxAccessoriesAmount - newUsage.Accessories);
        const remainingAccessoriesPercentage = specialValues.accessoriesTotal > 0 
          ? ((remainingAccessoriesAmount / specialValues.accessoriesTotal) * 100).toFixed(1)
          : 0;
        
        setRemainingDiscounts({
          onRoadPrice: Math.max(0, discountLimits.onRoadPrice - newUsage.vehicle_price),
          addOnServices: discountLimits.addOnServices,
          addOnServicesAmount: remainingAddOnAmount,
          addOnServicesPercentage: remainingAddOnPercentage,
          accessories: discountLimits.accessories,
          accessoriesAmount: remainingAccessoriesAmount,
          accessoriesPercentage: remainingAccessoriesPercentage,
          totalUsed: newUsage.vehicle_price + newUsage.AddONservices + newUsage.Accessories + newUsage.other
        });
      }, 100);
    }
  };
  // ===== END =====

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      const bookingData = response.data.data;

      console.log('=== EDIT MODE: Fetching Booking Details ===');
      console.log('Booking data rtoCode:', bookingData.rtoCode);
      console.log('Booking data insuranceFivePlusFive:', bookingData.insuranceFivePlusFive);

      // Get price components from API
      const priceComponents = bookingData.priceComponents || [];
      setBookingPriceComponents(priceComponents);

      // Extract discounts from API - EXCLUDE subsidy from discounts
      const apiDiscounts = {};
      priceComponents.forEach(priceComponent => {
        if (priceComponent.header && priceComponent.header._id) {
          const headerKey = priceComponent.header.header_key || '';
          
          // DO NOT include subsidy amount in discounts for Ex-SHOWROOM header
          if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)') {
            // For Ex-SHOWROOM header, only include actual discounts (not subsidy)
            const discountAmount = priceComponent.discountAmount || 0;
            apiDiscounts[priceComponent.header._id] = 0; // Don't include subsidy in discounts
            console.log(`Setting discount to 0 for ${headerKey} (subsidy handled separately)`);
          } else {
            const discountAmount = priceComponent.discountAmount || 0;
            apiDiscounts[priceComponent.header._id] = discountAmount;
            console.log(`API Discount for ${priceComponent.header.header_key}: ${discountAmount}`);
          }
        }
      });
      
      console.log('API Discounts extracted (subsidy excluded):', apiDiscounts);
      
      // Set discounts immediately
      setHeaderDiscounts(apiDiscounts);

      // Extract booked header IDs from the API response
      const bookedHeaderIds = priceComponents
        .filter(pc => pc.header && pc.header._id)
        .map(pc => pc.header._id);

      console.log('Booked headers from API:', bookedHeaderIds);

      // Get booking verticle
      const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
        ? bookingData.verticles[0]._id || bookingData.verticles[0] 
        : '';

      // Check if model is EV
      const isEV = bookingData.model?.type === 'EV';
      setIsEVModel(isEV);
      
      // Get subsidy amount from API response - check different possible locations
      const subsidyAmount = bookingData.subsidy_amount || 
                           bookingData.subsidyAmount || 
                           bookingData.model?.subsidy_amount || 
                           '';

      console.log('Subsidy amount from API:', subsidyAmount);
      console.log('Is EV Model:', isEV);
      console.log('RTO Code from API:', bookingData.rtoCode);

      // Set form data with subsidy amount and insuranceFivePlusFive
      const formDataToSet = {
        verticle_id: bookingVerticle,
        model_id: bookingData.model?.id || '',
        model_color: bookingData.color?.id || '',
        customer_type: bookingData.customerType || 'B2C',
        rto_type: bookingData.rto || 'MH',
        branch: bookingData.branch?._id || '',
        optionalComponents: bookedHeaderIds,
        sales_executive: bookingData.salesExecutive?._id || '',
        gstin: bookingData.gstin || '',
        rto_amount: bookingData.rtoAmount || '',
        salutation: bookingData.customerDetails?.salutation || '',
        name: bookingData.customerDetails?.name || '',
        pan_no: bookingData.customerDetails?.panNo || '',
        dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
        occupation: bookingData.customerDetails?.occupation || '',
        address: bookingData.customerDetails?.address || '',
        taluka: bookingData.customerDetails?.taluka || '',
        district: bookingData.customerDetails?.district || '',
        pincode: bookingData.customerDetails?.pincode || '',
        mobile1: bookingData.customerDetails?.mobile1 || '',
        mobile2: bookingData.customerDetails?.mobile2 || '',
        aadhar_number: bookingData.customerDetails?.aadharNumber || '',
        nomineeName: bookingData.customerDetails?.nomineeName || '',
        nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
        nomineeAge: bookingData.customerDetails?.nomineeAge || '',
        type: bookingData.payment?.type?.toLowerCase() || 'cash',
        financer_id: bookingData.payment?.financer?._id || '',
        scheme: bookingData.payment?.scheme || '',
        emi_plan: bookingData.payment?.emiPlan || '',
        gc_applicable: bookingData.payment?.gcApplicable || false,
        gc_amount: bookingData.payment?.gcAmount || 0,
        discountType: bookingData.discounts?.[0]?.type?.toLowerCase() || 'fixed',
        selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
        hpa: bookingData.hpa || false,
        selfInsurance: bookingData.selfInsurance || false,
        insuranceFivePlusFive: bookingData.insuranceFivePlusFive || false,
        is_exchange: bookingData.exchange ? 'true' : 'false',
        broker_id: bookingData.exchangeDetails?.broker?._id || '',
        exchange_price: bookingData.exchangeDetails?.price || '',
        vehicle_number: bookingData.exchangeDetails?.vehicleNumber || '',
        chassis_number: bookingData.exchangeDetails?.chassisNumber || '',
        note: bookingData.note || '',
        uncheckedHeaders: [],
        uncheckedAccessories: [],
        // Set subsidy amount from API response
        subsidy_amount: subsidyAmount,
        // FIX: Set rto_code from API response - check both camelCase and snake_case
        rto_code: bookingData.rtoCode || bookingData.rto_code || ''
      };

      console.log('Setting form data with subsidy_amount:', formDataToSet.subsidy_amount);
      console.log('Setting form data with insuranceFivePlusFive:', formDataToSet.insuranceFivePlusFive);
      console.log('Setting form data with rto_code:', formDataToSet.rto_code);
      console.log('Setting verticle_id:', bookingVerticle);
      console.log('Setting optionalComponents:', bookedHeaderIds);
      
      setFormData(formDataToSet);
      setIsEditMode(true);

      setSelectedBranchName(bookingData.branch?.name || '');
      setModelDetails(bookingData.model || null);
      setAccessoriesTotal(bookingData.accessoriesTotal || 0);

      if (bookingData.model) {
        setModelType(bookingData.model.type);
        setSelectedModelName(bookingData.model.model_name);
      }

      // Fetch models first
      console.log('Fetching models for edit mode...');
      await fetchModels(bookingData.customerType, bookingData.branch?._id);

      if (bookingData.model?.id) {
        console.log('Model found, fetching model details...');
        
        // Now fetch the model headers
        const fetchModelDetails = async () => {
          try {
            const modelResponse = await axiosInstance.get(`/models/${bookingData.model.id}`);
            const modelData = modelResponse.data.data.model;
            const modelPrices = modelData.prices || [];
            
            console.log('Model headers fetched:', modelPrices.length);
            
            // Get all headers from the model
            const allHeaders = modelPrices
              .filter(price => price.header && price.header._id)
              .map(price => price.header._id);
            
            console.log('All model headers:', allHeaders);
            
            // Get mandatory headers from the model
            const mandatoryHeaders = modelPrices
              .filter(price => price.header && price.header.is_mandatory)
              .map(price => price.header._id);
            
            console.log('Mandatory headers:', mandatoryHeaders);
            
            // For edit mode: unchecked headers are non-mandatory headers that are NOT in bookedHeaderIds
            const nonMandatoryHeaders = allHeaders.filter(headerId => 
              !mandatoryHeaders.includes(headerId)
            );
            
            const currentOptionalComponents = formDataToSet.optionalComponents || [];
            const uncheckedHeaders = nonMandatoryHeaders.filter(headerId => 
              !currentOptionalComponents.includes(headerId)
            );
            
            console.log('Unchecked headers in edit mode:', uncheckedHeaders);
            
            // Update form data with unchecked headers
            setFormData(prev => ({
              ...prev,
              uncheckedHeaders: uncheckedHeaders
            }));
            
            setSelectedModelHeaders(modelPrices);
            setModelDetails(modelData);
            
            // Set subsidy amount from model data if it's EV
            if (isEV && modelData.subsidy_amount) {
              setFormData(prev => ({
                ...prev,
                subsidy_amount: modelData.subsidy_amount
              }));
            }
            
            // Add any missing headers with 0 discount
            setHeaderDiscounts(prev => {
              const updated = { ...prev };
              modelPrices.forEach(price => {
                if (price.header && price.header._id) {
                  const headerId = price.header._id;
                  const headerKey = price.header.header_key || '';
                  
                  // For Ex-SHOWROOM header, ensure it's set to 0 (not subsidy)
                  if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)') {
                    updated[headerId] = 0;
                  } else if (updated[headerId] === undefined) {
                    updated[headerId] = 0;
                  }
                }
              });
              console.log('Updated headerDiscounts after model fetch (subsidy excluded):', updated);
              return updated;
            });
            
          } catch (error) {
            console.error('Error fetching model details:', error);
          }
        };
        
        // Fetch model details after a short delay
        setTimeout(fetchModelDetails, 500);
        
        // Fetch accessories and colors
        fetchAccessories(bookingData.model.id);
        fetchModelColors(bookingData.model.id);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  const getSelectedHeadersForTab6 = () => {
    if (!formData.model_id) return [];

    // Get all model headers
    const allModelHeaders = getSelectedModelHeaders();
    
    // Apply HPA filter
    const hpaFiltered = filterHeadersByHPAStatus(allModelHeaders, formData.hpa);
    
    // Apply insurance filters
    const insuranceFiltered = filterInsuranceHeaders(hpaFiltered);
    
    // Filter to show only headers that should be displayed
    return insuranceFiltered.filter((price) => {
      if (!price.header || !price.header._id) return false;
      
      const headerId = price.header._id;
      const isMandatory = price.header.is_mandatory;
      
      if (isEditMode) {
        // In edit mode: show headers that are in optionalComponents (were selected in original booking)
        return isMandatory || formData.optionalComponents.includes(headerId);
      } else {
        // In new booking mode: show headers that are not explicitly unchecked
        const isExplicitlyUnchecked = formData.uncheckedHeaders && 
          formData.uncheckedHeaders.includes(headerId);
        return isMandatory || !isExplicitlyUnchecked;
      }
    });
  };

  const validateGSTIN = (gstin) => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return regex.test(gstin);
  };

  const validateTab1 = () => {
    const requiredFields = ['customer_type', 'verticle_id', 'model_id', 'branch'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.customer_type === 'B2B') {
      if (!formData.gstin) {
        newErrors.gstin = 'GSTIN is required for B2B customers';
      } else if (!validateGSTIN(formData.gstin)) {
        newErrors.gstin = 'Invalid GSTIN format. Please enter a valid 15-digit GST number';
      }
    }
    if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rto_amount) {
      newErrors.rto_amount = 'RTO amount is required';
    }
    // Add validation for RTO code when RTO type is MH
    if (formData.rto_type === 'MH' && !formData.rto_code) {
      newErrors.rto_code = 'RTO Code is required when RTO type is MH';
    }

    // Updated insurance validation - cannot both be true
    if (formData.selfInsurance === true && formData.insuranceFivePlusFive === true) {
      newErrors.insurance = 'Self Insurance and Insurance 5+5 cannot both be true';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab2 = () => {
    const requiredFields = ['model_color', 'sales_executive'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    if (salesExecutives.length === 0 && formData.branch) {
      newErrors.sales_executive = 'No sales executives available for this branch';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab4 = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Payment type is required';
    }

    if (formData.is_exchange === 'true') {
      const exchangeFields = ['broker_id', 'exchange_price', 'vehicle_number', 'chassis_number'];
      exchangeFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required for exchange';
        }
      });
      if (selectedBroker?.otp_required && !otpVerified) {
        newErrors.otpVerification = 'OTP verification is required for this broker';
      }
      if (brokers.length === 0) {
        newErrors.broker_id = 'No brokers available for this branch';
      }
    }
    if (formData.type === 'finance') {
      const financeFields = ['financer_id'];
      financeFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required for finance';
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTab6 = () => {
    const newErrors = {};
    
    Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
      if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
        const numValue = parseFloat(discountValue);
        if (isNaN(numValue) || numValue < 0) {
          newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobileNumber = (mobile) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const validatePAN = (pan) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  };

  const validateAadhar = (aadhar) => {
    const regex = /^\d{12}$/;
    return regex.test(aadhar);
  };
  
  const validatePincode = (pincode) => {
    const regex = /^\d{6}$/;
    return regex.test(pincode);
  };

  const handleNextTab = () => {
    if (activeTab === 1) {
      if (!validateTab1()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    } else if (activeTab === 2) {
      if (!validateTab2()) {
        return;
      }
    } else if (activeTab === 3) {
      const newErrors = {};
      const requiredFields = [
        'salutation',
        'name',
        'address',
        'mobile1',
        'aadhar_number',
        'pan_no',
        'dob',
        'occupation',
        'taluka',
        'district',
        'pincode',
        'nomineeName',
        'nomineeRelation',
        'nomineeAge'
      ];

      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      });

      if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
        newErrors.mobile1 = 'Invalid mobile number';
      }
      if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
        newErrors.mobile2 = 'Invalid mobile number';
      }
      if (formData.pan_no && !validatePAN(formData.pan_no)) {
        newErrors.pan_no = 'Invalid PAN number';
      }
      if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
        newErrors.aadhar_number = 'Invalid Aadhar number';
      }
      if (formData.pincode && !validatePincode(formData.pincode)) {
        newErrors.pincode = 'Pincode must be exactly 6 digits';
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = Object.keys(newErrors)[0];
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        return;
      }
    } else if (activeTab === 4) {
      if (!validateTab4()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    } else if (activeTab === 6) {
      if (!validateTab6()) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        return;
      }
    }
    if (activeTab < 6) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const fetchModels = async (customerType = 'B2C', branchId = null, verticleId = null) => {
    try {
      let endpoint = `/models/with-prices?customerType=${customerType}`;

      if (isSalesExecutive && userData?.branch?._id) {
        endpoint += `&branch_id=${userData.branch._id}`;
      } else if (branchId) {
        endpoint += `&branch_id=${branchId}`;
      }

      console.log('Fetching models from endpoint:', endpoint);
      const response = await axiosInstance.get(endpoint);
      let modelsData = response.data.data.models || [];
      
      console.log('Total models fetched:', modelsData.length);

      // IMPORTANT: First filter by branch, then by verticle
      if (branchId || (isSalesExecutive && userData?.branch?._id)) {
        const targetBranchId = branchId || (isSalesExecutive ? userData.branch._id : null);
        modelsData = modelsData.filter(model => {
          const modelBranchId = model.branch_id || model.branch;
          return !modelBranchId || modelBranchId === targetBranchId;
        });
        console.log('Models after branch filter:', modelsData.length);
      }

      // Then filter by verticle if provided
      if (verticleId) {
        modelsData = modelsData.filter(model => 
          model.verticle_id === verticleId || model.verticle === verticleId
        );
        console.log('Models after verticle filter:', modelsData.length);
      }

      const processedModels = modelsData.map((model) => {
        const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

        return {
          ...model,
          mandatoryHeaders,
          modelPrices: model.prices.filter((price) => price.header !== null)
        };
      });

      console.log('Final processed models:', processedModels.length);
      setModels(processedModels);
      setFilteredModels(processedModels);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  useEffect(() => {
    const fetchSalesExecutive = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const filteredExecutives = formData.branch
          ? response.data.data.filter(
              (user) =>
                user.branch === formData.branch &&
                user.roles.some((role) => role.name === 'SALES_EXECUTIVE') &&
                user.status === 'ACTIVE' &&
                !user.isFrozen
            )
          : [];

        setSalesExecutives(filteredExecutives);

        if (formData.branch && filteredExecutives.length === 0) {
          setErrors((prev) => ({
            ...prev,
            sales_executive: 'No active sales executives available for this branch'
          }));
        }
      } catch (error) {
        console.error('Error fetching sales executive:', error);
        const message = showError(error);
        if (message) {
          setError(message);
        }
      }
    };
    fetchSalesExecutive();
  }, [formData.branch]);

  const fetchModelHeaders = async (modelId) => {
    try {
      const response = await axiosInstance.get(`/models/${modelId}`);
      const modelData = response.data.data.model;
      const prices = modelData.prices || [];

      // Check if model is EV
      const isEV = modelData.type === 'EV';
      setIsEVModel(isEV);

      // Set subsidy amount from model data only if it's EV
      if (isEV && modelData.subsidy_amount) {
        setFormData(prev => ({
          ...prev,
          subsidy_amount: modelData.subsidy_amount
        }));
      }

      const selectedModel = models.find((model) => model._id === modelId);
      const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];
      
      // Get ALL headers (both mandatory and non-mandatory)
      const allHeaders = prices
        .filter(price => price.header && price.header._id)
        .map(price => price.header._id);

      // Initialize with ALL headers checked by default
      setFormData((prev) => ({
        ...prev,
        optionalComponents: allHeaders, // Start with ALL headers checked
        uncheckedHeaders: [] // Clear any previously unchecked headers
      }));

      setSelectedModelHeaders(prices);
      setModelDetails(modelData);

      const initialDiscounts = {};
      prices.forEach(price => {
        let headerId;
        
        if (price.header && price.header._id) {
          headerId = price.header._id;
        } else if (price.header_id) {
          headerId = price.header_id;
        } else if (price.headerId) {
          headerId = price.headerId;
        }
        
        if (headerId) {
          initialDiscounts[headerId] = '';
        }
      });
      
      console.log('Setting initial discounts for new booking:', initialDiscounts);
      setHeaderDiscounts(initialDiscounts);

      const accessoriesTotal = calculateAccessoriesTotal(prices);
      setAccessoriesTotal(accessoriesTotal);
      fetchModelColors(modelId);
    } catch (error) {
      console.error('Failed to fetch model headers:', error);
      setSelectedModelHeaders([]);
      setModelDetails(null);
      setAccessoriesTotal(0);
      setHeaderDiscounts({});
      setIsEVModel(false);
    }
  };

  const calculateAccessoriesTotal = (prices) => {
    if (!prices || !Array.isArray(prices)) return 0;
    const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
    return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
  };

  const fetchAccessories = async (modelId) => {
    try {
      const modelResponse = await axiosInstance.get(`/models/${modelId}`);
      const modelData = modelResponse.data.data.model;
      const modelType = modelData.type;
      const modelName = modelData.model_name;
      
      setModelType(modelType);
      setSelectedModelName(modelName);
      
      const accessoriesResponse = await axiosInstance.get('/accessories');
      const allAccessories = accessoriesResponse.data.data.accessories || [];
      
      const filteredAccessories = allAccessories.filter(accessory => {
        const typeMatches = accessory.categoryDetails?.type === modelType;
        
        if (!typeMatches) {
          return false;
        }
        
        if (accessory.applicable_models && accessory.applicable_models.length > 0) {
          return accessory.applicable_models.includes(modelId);
        }
        
        return true;
      });
      
      console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
      
      // FIX: In edit mode, we should use the already set selected_accessories from booking data
      // The formData.selected_accessories is already set from fetchBookingDetails
      // We just need to update the accessories list
      setAccessories(filteredAccessories);
      
    } catch (error) {
      console.error('Failed to fetch accessories:', error);
      setAccessories([]);
    }
  };

  const fetchModelColors = async (modelId) => {
    try {
      const response = await axiosInstance.get(`colors/model/${modelId}`);
      setColors(response.data.data.colors || []);
    } catch (error) {
      console.error('Failed to fetch model colors:', error);
      setColors([]);
    }
  };

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        if (!formData.branch) {
          setBrokers([]);
          return;
        }

        const response = await axiosInstance.get(`/brokers/branch/${formData.branch}`);
        setBrokers(response.data.data || []);

        if (response.data.data.length === 0) {
          setErrors((prev) => ({
            ...prev,
            broker_id: 'No brokers available for this branch'
          }));
        }
      } catch (error) {
        console.error('Error fetching brokers:', error);
        const message = showError(error);
        if (message) {
          setError(message);
        }
        setBrokers([]);
      }
    };
    if (formData.branch && formData.is_exchange === 'true') {
      fetchBrokers();
    }
  }, [formData.branch, formData.is_exchange]);

  useEffect(() => {
    const fetchFinancer = async () => {
      try {
        // Use the new API endpoint
        const response = await axiosInstance.get('/financers/rates');
        
        // Extract financers from the groupedByProvider array
        const groupedData = response.data.data?.groupedByProvider || [];
        
        // Transform to array of financer objects for the dropdown with GC rates
        // FIX: Map through groupedData and create one entry per provider
        const financersList = groupedData.map(item => ({
          _id: item.providerId,
          financeProviderDetails: {
            _id: item.providerId,
            name: item.providerName
          },
          // For the branch field, we'll store multiple branches or use null
          // since one provider can serve multiple branches
          branchRates: item.branchRates || []
        }));
        
        console.log('Financers list:', financersList);
        setFinancers(financersList);
        
        // If in edit mode and financer is already selected, set the GC rate
        if (isEditMode && formData.financer_id) {
          const selectedFinancer = financersList.find(f => f._id === formData.financer_id);
          if (selectedFinancer) {
            // Find the rate for the current branch
            const branchRate = selectedFinancer.branchRates.find(
              rate => rate.branchId === formData.branch
            );
            if (branchRate) {
              setSelectedFinancerGC(branchRate.gcRate);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching financers:', error);
        const message = showError(error); 
        if (message) {
          setError(message);
        }
      }
    };
    fetchFinancer();
  }, [formData.branch, isEditMode, formData.financer_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      if (name === 'hpa' || name === 'selfInsurance') {
        const booleanValue = value === 'true';
        setFormData((prevData) => ({
          ...prevData,
          [name]: booleanValue
        }));
        
        // When HPA changes, also update optionalComponents
        if (name === 'hpa') {
          if (!booleanValue) {
            // If HPA is disabled, remove HP/HPA headers
            const hpHeaders = getSelectedModelHeaders()
              .filter(price => price.header && price.header._id)
              .filter(price => {
                const headerKey = price.header.header_key || '';
                return headerKey.startsWith('HP') || headerKey.startsWith('HPA');
              })
              .map(price => price.header._id);
            
            setFormData(prev => ({
              ...prev,
              optionalComponents: prev.optionalComponents.filter(id => !hpHeaders.includes(id))
            }));
          }
        }
        
        // When selfInsurance changes, automatically handle insuranceFivePlusFive
        if (name === 'selfInsurance') {
          if (booleanValue === true) {
            // If selfInsurance is true, set insuranceFivePlusFive to false
            setFormData(prev => ({
              ...prev,
              insuranceFivePlusFive: false
            }));
          }
        }
      } 
      else if (name === 'insuranceFivePlusFive') {
        const booleanValue = value === 'true';
        setFormData((prevData) => ({
          ...prevData,
          [name]: booleanValue
        }));
        
        // If insuranceFivePlusFive is set to true and selfInsurance is true,
        // automatically set selfInsurance to false
        if (booleanValue === true && formData.selfInsurance === true) {
          setFormData(prev => ({
            ...prev,
            selfInsurance: false
          }));
        }
        
        // When insuranceFivePlusFive changes, we need to handle header visibility
        // The filterInsuranceHeaders function will handle this automatically
      }
      else if (name === 'rto_type') {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
        // Clear RTO code when RTO type changes (unless it's MH)
        if (value !== 'MH') {
          setFormData(prev => ({
            ...prev,
            rto_code: ''
          }));
        } else if (value === 'MH' && !isEditMode) {
          // Only set default RTO code to MH 15 for NEW bookings
          // Check if MH 15 exists in rtoCodes
          const mh15Code = rtoCodes.find(rto => rto.rto_code === 'MH 15');
          if (mh15Code) {
            setFormData(prev => ({
              ...prev,
              rto_code: 'MH 15'
            }));
          }
        }
      }
      else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'customer_type') {
      fetchModels(value, formData.branch);
      if (isSalesExecutive && userData?.branch?._id) {
        fetchModels(value, userData.branch._id);
      } else {
        fetchModels(value, formData.branch);
      }
      setFormData((prev) => ({
        ...prev,
        verticle_id: '',
        model_id: '',
        model_name: '',
        uncheckedHeaders: [], // Reset unchecked headers when customer type changes
        subsidy_amount: '' // Reset subsidy amount
      }));
      setIsEVModel(false);
    } else if (name === 'verticle_id') {
      setFormData((prev) => ({
        ...prev,
        verticle_id: value,
        model_id: '',
        model_name: '',
        uncheckedHeaders: [], // Reset unchecked headers when verticle changes
        subsidy_amount: '' // Reset subsidy amount
      }));
      setIsEVModel(false);

      if (value) {
        const filtered = models.filter(model => 
          model.verticle_id === value || model.verticle === value
        );
        setFilteredModels(filtered);
      } else {
        setFilteredModels(models);
      }
    } else if (name === 'branch' && !isSalesExecutive) {
      const selectedBranch = branches.find((b) => b._id === value);
      setSelectedBranchName(selectedBranch ? selectedBranch.name : '');
      fetchModels(formData.customer_type, value);
      setFormData((prev) => ({
        ...prev,
        verticle_id: '',
        model_id: '',
        model_name: '',
        uncheckedHeaders: [], // Reset unchecked headers when branch changes
        subsidy_amount: '' // Reset subsidy amount
      }));
      setIsEVModel(false);
    } else if (name === 'financer_id') {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      
      // Find the selected financer and set its GC rate for the current branch
      const selectedFinancer = financers.find(f => f._id === value);
      if (selectedFinancer && formData.branch) {
        // Find the rate for the current branch
        const branchRate = selectedFinancer.branchRates.find(
          rate => rate.branchId === formData.branch
        );
        if (branchRate) {
          setSelectedFinancerGC(branchRate.gcRate);
          // Optionally auto-fill the GC amount field
          setFormData(prev => ({
            ...prev,
            gc_amount: branchRate.gcRate || ''
          }));
        }
      }
    } else if (name === 'model_id') {
      const selectedModel = models.find((model) => model._id === value);
      if (selectedModel) {
        // Check if model type is EV
        const isEV = selectedModel.type === 'EV';
        setIsEVModel(isEV);
        
        setFormData((prev) => ({
          ...prev,
          model_name: selectedModel.model_name,
          model_id: value,
          // Clear unchecked headers and accessories when model changes
          uncheckedHeaders: [],
          uncheckedAccessories: [],
          // Only set subsidy amount if it's an EV model
          subsidy_amount: isEV ? (selectedModel.subsidy_amount || '') : ''
        }));
        
        setModelType(selectedModel.type);
        setSelectedModelName(selectedModel.model_name);
        
        fetchAccessories(value);
        fetchModelColors(value);
        
        if (isEditMode) {
          // For edit mode, keep existing discounts from API
          const fetchModelForEdit = async () => {
            try {
              const response = await axiosInstance.get(`/models/${value}`);
              const modelData = response.data.data.model;
              const modelPrices = modelData.prices || [];
              
              // Set subsidy amount from model data only if it's EV
              if (isEV && modelData.subsidy_amount) {
                setFormData(prev => ({
                  ...prev,
                  subsidy_amount: modelData.subsidy_amount
                }));
              }
              
              setSelectedModelHeaders(modelPrices);
              setModelDetails(modelData);
              
              // Don't overwrite discounts - just add missing ones
              setHeaderDiscounts(prev => {
                const updated = { ...prev };
                modelPrices.forEach(price => {
                  if (price.header && price.header._id) {
                    const headerId = price.header._id;
                    if (updated[headerId] === undefined) {
                      updated[headerId] = 0;
                    }
                  }
                });
                return updated;
              });
            } catch (error) {
              console.error('Error fetching model for edit:', error);
            }
          };
          fetchModelForEdit();
        } else {
          fetchModelHeaders(value);
        }
      }
    }
  };

  const getSelectedModelHeaders = () => {
    if (!formData.model_id) return [];

    const selectedModel = models.find((model) => model._id === formData.model_id);
    const allHeaders = selectedModel?.modelPrices || [];
    
    // Apply HPA filter
    return filterHeadersByHPAStatus(allHeaders, formData.hpa);
  };

  const handleHeaderSelection = (headerId, isChecked) => {
    setFormData((prev) => {
      if (isChecked) {
        // When checking: remove from uncheckedHeaders and add to optionalComponents
        return {
          ...prev,
          uncheckedHeaders: prev.uncheckedHeaders.filter((id) => id !== headerId),
          optionalComponents: [...(prev.optionalComponents || []), headerId]
        };
      } else {
        // When unchecking: add to uncheckedHeaders and remove from optionalComponents
        return {
          ...prev,
          uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId],
          optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
        };
      }
    });
  };

  const getAccessoryPriceToShow = (accessory) => {
    // Get the header key from categoryDetails
    const headerKey = accessory.categoryDetails?.header_key;
    
    if (!headerKey) {
      return accessory.price;
    }
    
    // Find the corresponding header price for this accessory
    const matchingHeader = getSelectedModelHeaders().find(
      (price) => price.header?.header_key === headerKey
    );
    
    if (!matchingHeader) {
      return accessory.price;
    }
    
    const headerPrice = matchingHeader.value || 0;
    const accessoryPrice = accessory.price || 0;
    
    // Return whichever is higher
    return Math.max(headerPrice, accessoryPrice);
  };

  const hasAccessoryHigherPrice = (accessory) => {
    const headerKey = accessory.categoryDetails?.header_key;
    
    if (!headerKey) {
      return false;
    }
    
    const matchingHeader = getSelectedModelHeaders().find(
      (price) => price.header?.header_key === headerKey
    );
    
    if (!matchingHeader) {
      return false;
    }
    
    const headerPrice = matchingHeader.value || 0;
    const accessoryPrice = accessory.price || 0;
    
    return accessoryPrice > headerPrice;
  };

  const handleAccessorySelection = (accessoryId, isChecked) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          selected_accessories: [...prev.selected_accessories, accessoryId]
        };
      } else {
        return {
          ...prev,
          selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
        };
      }
    });
  };

  const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
    const netAmount = unitCost - (discount || 0);
    const gstRateDecimal = gstRate / 100;
    
    if (customerType === 'CSD') {
      return netAmount;
    }
    
    if (gstRateDecimal === 0) {
      return netAmount;
    }
    
    return netAmount / (1 + gstRateDecimal);
  };

  const calculateGST = (taxable, gstRate, customerType) => {
    if (customerType === 'CSD') {
      const halfRate = gstRate / 2;
      const cgstAmount = 0;
      const sgstAmount = taxable * (halfRate / 100);
      return { cgstAmount, sgstAmount, halfRate, cgstRate: 0, sgstRate: halfRate };
    }
    
    const halfRate = gstRate / 2;
    const cgstAmount = taxable * (halfRate / 100);
    const sgstAmount = taxable * (halfRate / 100);
    return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
  };

  const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
    return taxable + cgstAmount + sgstAmount;
  };

  // Calculate total deal amount - Exclude specific headers and include accessories with higher prices
  const calculateTotalDealAmount = () => {
    const selectedHeaders = getSelectedHeadersForTab6()
      .filter((price) => price.header && price.header._id)
      .filter((price) => {
        // EXCLUDE these specific summary/total headers
        const excludedHeaders = [
          'ON ROAD PRICE (A)',
          'TOTAL ONROAD + ADDON SERVICES',
          'TOTAL ONROAD+ADDON SERVICES',
          'ADDON SERVICES TOTAL (B)',
          'ACCESSORIES TOTAL',
          'ON ROAD PRICE',
          'ADDON SERVICES TOTAL',
          'ADD ON SERVICES TOTAL',
          'TOTAL AMOUNT',
          'GRAND TOTAL',
          'FINAL AMOUNT',
          'TOTAL',
          'ON-ROAD PRICE',
          'FINAL PRICE',
          'LESS:- CENTER SUBSIDY(FAME-II)',
          'COMPLETE PRICE'
        ];
        
        const headerKey = price.header.header_key || '';
        return !excludedHeaders.includes(headerKey);
      });

    let totalBeforeDiscount = 0;
    let totalDiscount = 0;
    let subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
    
    console.log('Selected headers for total calculation:', selectedHeaders.length);
    console.log('Accessories count:', accessories.length);
    console.log('Subsidy amount:', subsidyAmount);
    console.log('Is EV Model:', isEVModel);
    
    // Calculate ORIGINAL total (without any discounts)
    selectedHeaders.forEach((price) => {
      const header = price.header;
      const headerKey = header.header_key;
      
      // Determine if this is the RTO header
      const isRTOHeader = headerKey === 'RTO TAX & REGISTRATION CHARGES' || 
                          headerKey.includes('RTO TAX') || 
                          headerKey.includes('REGISTRATION CHARGES');
      
      // Find matching accessories for this header
      const selectedMatchingAccessories = accessories.filter(accessory => 
        accessory.categoryDetails?.header_key === header.header_key &&
        (isEditMode ? 
          formData.selected_accessories.includes(accessory._id) : // In edit mode
          !formData.uncheckedAccessories?.includes(accessory._id) // In new mode
        )
      );

      // Get TOTAL accessory price (SUM of all selected accessories for this header)
      const accessoryPrice = selectedMatchingAccessories.length > 0 
        ? selectedMatchingAccessories.reduce((sum, acc) => sum + (acc.price || 0), 0)
        : 0;
      
      let unitPrice = Math.max(price.value || 0, accessoryPrice);
      
      // Special handling for RTO header when RTO type is BH or CRTM
      if (isRTOHeader && (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && formData.rto_amount) {
        unitPrice = parseFloat(formData.rto_amount) || 0;
      }
      
      const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
      
      // Calculate original line total WITHOUT discount
      const taxable = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
      const { cgstAmount, sgstAmount } = calculateGST(taxable, gstRate, formData.customer_type);
      const originalLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
      totalBeforeDiscount += originalLineTotal;
    });
    
    // Calculate total discounts from headerDiscounts ONLY (separate from subsidy)
    selectedHeaders.forEach((price) => {
      const header = price.header;
      const headerId = header._id || header.id;
      const discountValue = headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : 0;
      const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
      totalDiscount += discountAmount;
    });

    let finalTotal = totalBeforeDiscount - totalDiscount;
    
    // Apply subsidy deduction SEPARATELY (not as discount) for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
    const exShowroomHeader = selectedHeaders.find(price => 
      price.header.header_key === 'Ex-SHOWROOM(INCLUDING 5% GST)'
    );
    
    if (exShowroomHeader && subsidyAmount > 0 && isEVModel) {
      console.log(`Applying subsidy amount of ₹${subsidyAmount} SEPARATELY (not as discount) to Ex-SHOWROOM header (EV Model)`);
      finalTotal -= subsidyAmount;
    }

    console.log('Total calculation:', {
      totalBeforeDiscount,
      totalDiscount,
      subsidyAmount,
      finalTotal,
      isEVModel
    });

    return {
      totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
      totalAfterDiscount: finalTotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2), // This is only actual discounts
      subsidyAmount: subsidyAmount.toFixed(2), // This is subsidy (separate from discounts)
      hasDiscount: totalDiscount > 0,
      hasSubsidy: subsidyAmount > 0
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ['verticle_id', 'model_id', 'model_color', 'branch', 'customer_type', 'name', 'address', 'mobile1', 'aadhar_number', 'pan_no'];
    let formErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = 'This field is required';
      }
    });

    if (!formData.verticle_id) {
      formErrors.verticle_id = 'Verticle selection is required';
    }

    // Add RTO code validation for MH
    if (formData.rto_type === 'MH' && !formData.rto_code) {
      formErrors.rto_code = 'RTO Code is required when RTO type is MH';
    }

    // Updated insurance validation - cannot both be true
    if (formData.selfInsurance === true && formData.insuranceFivePlusFive === true) {
      formErrors.insurance = 'Self Insurance and Insurance 5+5 cannot both be true';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      const firstErrorField = Object.keys(formErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    console.log('=== SUBMITTING BOOKING ===');
    console.log('Current optionalComponents:', formData.optionalComponents);
    console.log('Current uncheckedHeaders:', formData.uncheckedHeaders);
    console.log('Current headerDiscounts:', headerDiscounts);
    console.log('Subsidy amount:', formData.subsidy_amount);
    console.log('RTO Code:', formData.rto_code);
    console.log('Is EV Model:', isEVModel);
    console.log('Self Insurance:', formData.selfInsurance);
    console.log('Insurance 5+5:', formData.insuranceFivePlusFive);

    // FIX 1: Proper headers logic for edit mode
    let headersToSubmit = [];
    if (isEditMode) {
      // In edit mode: Use the existing optionalComponents (already contains booked headers)
      // But remove any that are now explicitly unchecked
      headersToSubmit = formData.optionalComponents.filter(headerId => 
        !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
      );
    } else {
      // For new bookings: include all headers except explicitly unchecked ones
      const allHeaders = getSelectedHeadersForTab6()
        .filter(price => price.header && price.header._id)
        .map(price => price.header._id);
      
      headersToSubmit = allHeaders.filter(headerId => 
        !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
      );
    }

    console.log('Headers to submit:', headersToSubmit);
    console.log('Number of headers:', headersToSubmit.length);

    // FIX 2: Prepare header discounts including existing discounts from edit mode
    const headerDiscountsArray = Object.entries(headerDiscounts)
      .filter(([headerId, value]) => {
        // Only include discounts for headers that are actually selected
        const isSelected = headersToSubmit.includes(headerId);
        const hasDiscount = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)) && parseFloat(value) !== 0;
        
        // Also check if this is the Ex-SHOWROOM header with subsidy
        const header = getSelectedHeadersForTab6().find(p => p.header && (p.header._id === headerId || p.header.id === headerId));
        const isExShowroomWithSubsidy = header && header.header.header_key === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel;
        
        console.log(`Header ${headerId}: isSelected=${isSelected}, hasDiscount=${hasDiscount}, value=${value}`);
        
        // If it's Ex-SHOWROOM with subsidy, don't include any discount (subsidy is separate)
        if (isExShowroomWithSubsidy) {
          return false;
        }
        
        return isSelected && hasDiscount;
      })
      .map(([headerId, value]) => ({
        headerId,
        discountAmount: parseFloat(value) || 0
      }));

    console.log('Header discounts to submit:', headerDiscountsArray);

    // FIX 3: Proper accessories logic for edit mode
    let accessoriesToSubmit = [];
    if (isEditMode) {
      // In edit mode: Use selected_accessories but remove any that are explicitly unchecked
      accessoriesToSubmit = formData.selected_accessories.filter(accessoryId => 
        !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
      );
    } else {
      // For new bookings
      const allAccessoryIds = accessories.map(accessory => accessory._id);
      accessoriesToSubmit = allAccessoryIds.filter(accessoryId => 
        !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
      );
    }

    const accessoriesArray = accessoriesToSubmit.map((id) => ({ id }));
    console.log('Accessories to submit:', accessoriesArray);

    // Prepare exchange details
    const exchangeDetails = {
      is_exchange: formData.is_exchange === 'true',
      ...(formData.is_exchange === 'true' && {
        broker_id: formData.broker_id,
        exchange_price: formData.exchange_price ? parseFloat(formData.exchange_price) : 0,
        vehicle_number: formData.vehicle_number || '',
        chassis_number: formData.chassis_number || '',
        ...(selectedBroker?.otp_required && otpVerified && { otp })
      })
    };

    console.log('Exchange details:', exchangeDetails);

    // Prepare payment details
    const paymentDetails = {
      type: formData.type.toUpperCase(),
      ...(formData.type.toLowerCase() === 'finance' && {
        financer_id: formData.financer_id,
        scheme: formData.scheme || '',
        emi_plan: formData.emi_plan || '',
        gc_applicable: formData.gc_applicable,
        gc_amount: formData.gc_applicable ? parseFloat(formData.gc_amount) || 0 : 0
      })
    };

    console.log('Payment details:', paymentDetails);

    // Prepare customer details
    const customerDetails = {
      salutation: formData.salutation,
      name: formData.name,
      pan_no: formData.pan_no,
      dob: formData.dob,
      occupation: formData.occupation,
      address: formData.address,
      taluka: formData.taluka,
      district: formData.district,
      pincode: formData.pincode,
      mobile1: formData.mobile1,
      mobile2: formData.mobile2 || '',
      aadhar_number: formData.aadhar_number,
      nomineeName: formData.nomineeName,
      nomineeRelation: formData.nomineeRelation,
      nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
    };

    // Build the complete request body
    const requestBody = {
      model_id: formData.model_id,
      model_color: formData.model_color,
      customer_type: formData.customer_type,
      rto_type: formData.rto_type,
      branch: formData.branch,
      verticles: formData.verticle_id ? [formData.verticle_id] : [],
      optionalComponents: headersToSubmit,
      sales_executive: formData.sales_executive,
      customer_details: customerDetails,
      payment: paymentDetails,
      headerDiscounts: headerDiscountsArray,
      accessories: {
        selected: accessoriesArray
      },
      hpa: formData.hpa === true,
      selfInsurance: formData.selfInsurance === true,
      insuranceFivePlusFive: formData.insuranceFivePlusFive === true,
      exchange: exchangeDetails,
      note: formData.note || '',
      // Include RTO code when RTO type is MH
      ...(formData.rto_type === 'MH' && formData.rto_code && { rto_code: formData.rto_code }),
      // Include RTO amount for BH/CRTM (this will be used to override the RTO header)
      ...((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && { rto_amount: formData.rto_amount ? parseFloat(formData.rto_amount) : 0 }),
      // Only include subsidy amount if it's an EV model
      ...(isEVModel && { subsidy_amount: formData.subsidy_amount ? parseFloat(formData.subsidy_amount) : 0 })
    };

    // Add conditional fields
    if (formData.customer_type === 'B2B') {
      requestBody.gstin = formData.gstin;
    }

    console.log('=== FINAL REQUEST BODY ===');
    console.log('optionalComponents being sent:', requestBody.optionalComponents);
    console.log('Number of optionalComponents:', requestBody.optionalComponents.length);
    console.log('Header discounts being sent:', requestBody.headerDiscounts);
    console.log('Number of discounts:', requestBody.headerDiscounts.length);
    console.log('RTO Code being sent:', formData.rto_type === 'MH' ? requestBody.rto_code : 'N/A (Not MH RTO)');
    console.log('RTO Amount being sent:', (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') ? requestBody.rto_amount : 'N/A (Not BH/CRTM RTO)');
    console.log('Subsidy amount being sent:', isEVModel ? requestBody.subsidy_amount : 'N/A (Not EV model)');
    console.log('Self Insurance being sent:', requestBody.selfInsurance);
    console.log('Insurance 5+5 being sent:', requestBody.insuranceFivePlusFive);
    console.log('Full request body:', JSON.stringify(requestBody, null, 2));

    try {
      let response;
      if (isEditMode) {
        console.log(`Updating booking with ID: ${id}`);
        response = await axiosInstance.put(`/bookings/${id}`, requestBody);
      } else {
        console.log('Creating new booking');
        response = await axiosInstance.post('/bookings', requestBody);
      }

      console.log('API Response:', response.data);

      if (response.data.success) {
        const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
        console.log('Success:', successMessage);
        await showFormSubmitToast(successMessage, () => navigate('/booking-list'));
        navigate('/booking-list');
      } else {
        console.error('Submission failed:', response.data);
        showFormSubmitError(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error response:', error.response?.data);
      const message = showError(error); 
      if (message) setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const debugHeaderDiscounts = () => {
    console.log('Current headerDiscounts:', headerDiscounts);
    console.log('Current formData.model_id:', formData.model_id);
    console.log('Current models:', models);
  };

  if (loadingUser) {
    return <div>Loading user data...</div>;
  }

  // Calculate totals
  const dealTotals = calculateTotalDealAmount();

  return (
    <div className="form-container">
      <div className="title">{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
      {error && <CAlert color="danger">{error}</CAlert>}
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit} id="bookingForm">
            {activeTab === 1 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Customer Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                        {/* Show CSD option only if user has CSD access AND is not a sales executive */}
                        {hasCSDAccess && !isSalesExecutive && <option value="CSD">CSD</option>}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.customer_type && <p className="error">{errors.customer_type}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Branch</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      {isSalesExecutive && userData?.branch ? (
                        <CFormInput 
                          value={`${userData.branch.name} - ${userData.branch.branch_city || userData.branch.city}`} 
                          readOnly 
                        />
                      ) : (
                        <CFormSelect name="branch" value={formData.branch} onChange={handleChange}>
                          <option value="">-Select-</option>
                          {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name} - {branch.branch_city || branch.city}
                            </option>
                          ))}
                        </CFormSelect>
                      )}
                    </CInputGroup>
                    {errors.branch && <p className="error">{errors.branch}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Verticle</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilInstitution} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="verticle_id" 
                        value={formData.verticle_id} 
                        onChange={handleChange}
                        disabled={userVerticles.length === 0}
                      >
                        <option value="">- Select Verticle -</option>
                        {userVerticles.length > 0 ? (
                          userVerticles
                            .filter(vertical => vertical.status === 'active')
                            .map((vertical) => (
                              <option key={vertical._id} value={vertical._id}>
                                {vertical.name}
                              </option>
                            ))
                        ) : (
                          <option value="" disabled>
                            No verticles assigned to your account
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
                    {userVerticles.filter(v => v.status === 'active').length === 0 && (
                      <small className="text-muted">No active verticles available. Please contact administrator.</small>
                    )}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Model Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <div style={{ flex: 1 }}>
                        <Select
                          name="model_id"
                          isDisabled={!formData.branch || !formData.verticle_id}
                          placeholder={
                            !formData.branch ? "Select branch first" :
                            !formData.verticle_id ? "Select verticle first" :
                            filteredModels.length === 0 ? "No models available" :
                            "Search Model"
                          }
                          value={
                            filteredModels.find((m) => m._id === formData.model_id)
                              ? {
                                  label: filteredModels.find(
                                    (m) => m._id === formData.model_id
                                  ).model_name,
                                  value: formData.model_id,
                                }
                              : null
                          }
                          onChange={(selected) =>
                            handleChange({
                              target: {
                                name: "model_id",
                                value: selected ? selected.value : "",
                              },
                            })
                          }
                          options={
                            filteredModels.length > 0
                              ? filteredModels.map((model) => ({
                                  label: model.model_name,
                                  value: model._id,
                                }))
                              : []
                          }
                          noOptionsMessage={() => {
                            if (!formData.branch) return "Please select a branch first";
                            if (!formData.verticle_id) return "Please select a verticle first";
                            return "No models available for this branch and verticle";
                          }}
                          classNamePrefix="react-select"
                          className={`react-select-container ${
                            errors.model_id ? "error-input" : formData.model_id ? "valid-input" : ""
                          }`}
                        />
                      </div>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
                  </div>

                  {formData.customer_type === 'B2B' && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">GST Number</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilBarcode} />
                        </CInputGroupText>
                        <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
                      </CInputGroup>
                      {errors.gstin && <p className="error">{errors.gstin}</p>}
                    </div>
                  )}

                  <div className="input-box">
                    <span className="details">RTO</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCarAlt} />
                      </CInputGroupText>
                      <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="MH">MH</option>
                        <option value="BH">BH</option>
                        <option value="CRTM">CRTM</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {/* Show RTO Code dropdown only when RTO type is MH */}
                  {formData.rto_type === 'MH' && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">RTO Code</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilCarAlt} />
                        </CInputGroupText>
                        <CFormSelect 
                          name="rto_code" 
                          value={formData.rto_code} 
                          onChange={handleChange}
                          disabled={loadingRtoCodes}
                        >
                          <option value="">-Select RTO Code-</option>
                          {loadingRtoCodes ? (
                            <option value="" disabled>Loading RTO codes...</option>
                          ) : rtoCodes.length > 0 ? (
                            rtoCodes.map((rto) => (
                              <option key={rto.id} value={rto.rto_code}>
                                {rto.rto_code} - {rto.rto_name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No RTO codes available</option>
                          )}
                        </CFormSelect>
                      </CInputGroup>
                      {errors.rto_code && <p className="error">{errors.rto_code}</p>}
                      {loadingRtoCodes && <small className="text-muted">Loading RTO codes...</small>}
                    </div>
                  )}

                  {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">RTO Amount</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilMoney} />
                        </CInputGroupText>
                        <CFormInput 
                          type="number" 
                          name="rto_amount" 
                          value={formData.rto_amount} 
                          onChange={handleChange}
                          placeholder="Enter RTO amount"
                        />
                      </CInputGroup>
                      {errors.rto_amount && <p className="error">{errors.rto_amount}</p>}
                      <small className="text-muted">This amount will override the RTO header value in calculations</small>
                    </div>
                  )}

                  {/* Subsidy Amount Field - Only show for EV models */}
                  {isEVModel && (
                    <div className="input-box">
                      <span className="details">Subsidy Amount</span>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilMoney} />
                        </CInputGroupText>
                        <CFormInput 
                          type="text" 
                          name="subsidy_amount" 
                          value={formData.subsidy_amount} 
                          onChange={handleChange}
                          disabled={true}
                          placeholder="Auto-filled for EV models"
                        />
                      </CInputGroup>
                      <small className="text-muted">Subsidy applicable for EV models only</small>
                    </div>
                  )}

                  <div className="input-box">
                    <span className="details">HPA Applicable</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilShieldAlt} />
                      </CInputGroupText>
                      <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <span className="details">Self Insurance</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilShieldAlt} />
                      </CInputGroupText>
                      <CFormSelect name="selfInsurance" value={formData.selfInsurance} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {/* Insurance 5+5 Field - Show always */}
                  <div className="input-box">
                    <span className="details">Insurance 5+5</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilShieldAlt} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="insuranceFivePlusFive" 
                        value={formData.insuranceFivePlusFive} 
                        onChange={handleChange}
                      >
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                  </div>

                  {/* Insurance validation error message */}
                  {errors.insurance && (
                    <div className="input-box" style={{ width: '100%' }}>
                      <p className="error" style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                        {errors.insurance}
                      </p>
                    </div>
                  )}

                  {/* Insurance status message */}
                  {formData.selfInsurance === true && 
                    formData.insuranceFivePlusFive === true && (
                      <div className="input-box" style={{ width: '100%' }}>
                        <p className="error" style={{ color: '#dc3545', fontSize: '0.9em' }}>
                          Both Self Insurance and Insurance 5+5 cannot be selected together
                        </p>
                      </div>
                    )
                  }
                </div>

              {getSelectedModelHeaders().length > 0 && (
                <div className="model-headers-section">
                  <h5>
                    Model Options 
                    {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
                      (HPA-related options hidden as HPA is disabled)
                    </span>}
                    {formData.selfInsurance === true && <span style={{ color: '#28a745', fontSize: '0.9em', marginLeft: '10px' }}>
                      (Insurance headers hidden as Self Insurance is enabled)
                    </span>}
                    {formData.selfInsurance === false && formData.insuranceFivePlusFive === true && <span style={{ color: '#ffc107', fontSize: '0.9em', marginLeft: '10px' }}>
                      (INSURANCE CHARGES header hidden for Insurance 5+5, Insurance: 5 + 5 Years shown)
                    </span>}
                    {formData.selfInsurance === false && formData.insuranceFivePlusFive === false && <span style={{ color: '#6c757d', fontSize: '0.9em', marginLeft: '10px' }}>
                      (Standard insurance - INSURANCE CHARGES shown)
                    </span>}
                  </h5>
                  <div className="headers-list">
                    {getSelectedModelHeaders()
                      .filter((price) => {
                        // Apply insurance filters here as well
                        const headerKey = price.header?.header_key || '';
                        
                        // Case 1: Self Insurance is true - hide all insurance headers
                        if (formData.selfInsurance === true) {
                          if (headerKey.includes('INSURANCE') || 
                              headerKey === 'INSURANCE' || 
                              headerKey === 'INSURANCE CHARGES' || 
                              headerKey === 'Insurance: 5 + 5 Years') {
                            return false;
                          }
                        }
                        
                        // Case 2: Insurance 5+5 is true and Self Insurance is false - 
                        // Show Insurance: 5 + 5 Years, hide INSURANCE CHARGES
                        if (formData.selfInsurance === false && formData.insuranceFivePlusFive === true) {
                          if (headerKey === 'INSURANCE CHARGES') {
                            return false;
                          }
                          // Insurance: 5 + 5 Years should be shown
                          return true;
                        }
                        
                        // Case 3: Both Self Insurance and Insurance 5+5 are false - 
                        // Show INSURANCE CHARGES, hide Insurance: 5 + 5 Years
                        if (formData.selfInsurance === false && formData.insuranceFivePlusFive === false) {
                          if (headerKey === 'Insurance: 5 + 5 Years') {
                            return false;
                          }
                          // INSURANCE CHARGES should be shown
                          return true;
                        }
                        
                        return true;
                      })
                      .filter((price) => price.header && price.header._id)
                      .map((price) => {
                        const header = price.header;
                        const isMandatory = header.is_mandatory;
                        const headerId = header._id;
                        const headerKey = header.header_key || '';
                        
                        // Check if this is an HPA-related header
                        const isHPAHeader = headerKey.startsWith('HP') || 
                                            headerKey.startsWith('HPA') ||
                                            headerKey.toLowerCase().includes('hypothecation') ||
                                            headerKey.toLowerCase().includes('loan');
                        
                        // Determine if header should be shown based on HPA status
                        const shouldShowHeader = formData.hpa || !isHPAHeader;
                        
                        if (!shouldShowHeader) {
                          return null; // Skip rendering this header
                        }
                        
                        let isChecked;
                        if (isEditMode) {
                          isChecked = isMandatory || formData.optionalComponents.includes(headerId);
                        } else {
                          const isExplicitlyUnchecked = formData.uncheckedHeaders && 
                            formData.uncheckedHeaders.includes(headerId);
                          isChecked = isMandatory || !isExplicitlyUnchecked;
                        }

                        return (
                          <div key={headerId} className="header-item">
                            <CFormCheck
                              id={`header-${headerId}`}
                              label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : '(Optional)'} ${isHPAHeader ? '(HPA-related)' : ''}`}
                              checked={isChecked}
                              onChange={(e) => {
                                if (!isMandatory) {
                                  const isNowChecked = e.target.checked;
                                  if (!isNowChecked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId],
                                      optionalComponents: prev.optionalComponents.filter(id => id !== headerId)
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      uncheckedHeaders: prev.uncheckedHeaders?.filter(id => id !== headerId) || [],
                                      optionalComponents: [...prev.optionalComponents, headerId]
                                    }));
                                  }
                                }
                              }}
                              disabled={isMandatory}
                            />
                            {isMandatory && <input type="hidden" name={`mandatory-${headerId}`} value={headerId} />}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 2 && (
  <>
    <div className="user-details">
      <div className="input-box">
        <div className="details-container">
          <span className="details">Verticle</span>
          <span className="required">*</span>
        </div>
        <CInputGroup>
          <CInputGroupText className="input-icon">
            <CIcon icon={cilInstitution} />
          </CInputGroupText>
          <CFormSelect 
            name="verticle_id" 
            value={formData.verticle_id} 
            onChange={handleChange}
            disabled={userVerticles.length === 0 || isEditMode}
          >
            <option value="">- Select Verticle -</option>
            {userVerticles.length > 0 ? (
              userVerticles
                .filter(vertical => vertical.status === 'active')
                .map((vertical) => (
                  <option key={vertical._id} value={vertical._id}>
                    {vertical.name}
                  </option>
                ))
            ) : (
              <option value="" disabled>
                No verticles assigned to your account
              </option>
            )}
          </CFormSelect>
        </CInputGroup>
        {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
      </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Vehicle Model</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBike} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="model_id" 
                        value={formData.model_id} 
                        onChange={handleChange} 
                        disabled={isEditMode || !formData.verticle_id}
                      >
                        <option value="">- Select a Model -</option>
                        {filteredModels.length > 0 ? (
                          filteredModels.map((model) => (
                            <option key={model._id} value={model._id}>
                              {model.model_name}
                            </option>
                          ))
                        ) : formData.verticle_id ? (
                          <option value="" disabled>
                            No models available for this verticle
                          </option>
                        ) : (
                          <option value="" disabled>
                            Please select a verticle first
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_id && <p className="error">{errors.model_id}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Color</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPaint} />
                      </CInputGroupText>
                      <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {colors.map((color) => (
                          <option key={color._id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.model_color && <p className="error">{errors.model_color}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Booking Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Sales Executive</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect
                        name="sales_executive"
                        value={formData.sales_executive || ''}
                        onChange={handleChange}
                        disabled={salesExecutives.length === 0}
                      >
                        <option value="">-Select-</option>
                        {salesExecutives.length > 0 ? (
                          salesExecutives.map((sales) => (
                            <option key={sales._id} value={sales._id}>
                              {sales.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No sales executives available for this branch
                          </option>
                        )}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.sales_executive && <p className="error">{errors.sales_executive}</p>}
                  </div>
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 3 && (
              <>
                <div
                  className="search-section"
                  style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                >
                  <h5>Search Existing Customer</h5>
                  <div className="user-details">
                    <div className="input-box">
                      <span className="details">Search by PAN or Aadhar</span>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Enter PAN or Aadhar number"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CButton color="primary" onClick={handleCustomerSearch}>
                          Search
                        </CButton>
                      </CInputGroup>
                      {searchError && <p className="error">{searchError}</p>}
                      {searchLoading && <p>Searching...</p>}
                    </div>
                  </div>
                </div>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Salutation</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.salutation && <p className="error">{errors.salutation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Full Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="name" value={formData.name} onChange={handleChange} />
                    </CInputGroup>
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Address</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilHome} />
                      </CInputGroupText>
                      <CFormInput name="address" value={formData.address} onChange={handleChange} />
                    </CInputGroup>
                    {errors.address && <p className="error">{errors.address}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Taluka</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
                    </CInputGroup>
                    {errors.taluka && <p className="error">{errors.taluka}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">District</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMap} />
                      </CInputGroupText>
                      <CFormInput name="district" value={formData.district} onChange={handleChange} />
                    </CInputGroup>
                    {errors.district && <p className="error">{errors.district}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Pin Code</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pincode && <p className="error">{errors.pincode}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Contact Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
                    </CInputGroup>
                    {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
                  </div>

                  <div className="input-box">
                    <span className="details">Alternate Contact Number</span>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPhone} />
                      </CInputGroupText>
                      <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
                    </CInputGroup>
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Aadhaar Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilFingerprint} />
                      </CInputGroupText>
                      <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
                    </CInputGroup>
                    {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">PAN Number</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCreditCard} />
                      </CInputGroupText>
                      <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
                    </CInputGroup>
                    {errors.pan_no && <p className="error">{errors.pan_no}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Birth Date</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </CInputGroup>
                    {errors.dob && <p className="error">{errors.dob}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Occupation</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBriefcase} />
                      </CInputGroupText>
                      <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="Student">Student</option>
                        <option value="Business">Business</option>
                        <option value="Service">Service</option>
                        <option value="Farmer">Farmer</option>
                        <option value="Self Employed">Self Employed</option>
                        <option value="Government Servant">Government Servant</option>

                      </CFormSelect>
                    </CInputGroup>
                    {errors.occupation && <p className="error">{errors.occupation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Name</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Relationship</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilPeople} />
                      </CInputGroupText>
                      <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Nominee Age</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBirthdayCake} />
                      </CInputGroupText>
                      <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
                    </CInputGroup>
                    {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
                  </div>
                </div>

                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 4 && (
              <>
                <div className="user-details">
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Exchange Mode</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilSwapVertical} />
                      </CInputGroupText>
                      <CFormSelect name="is_exchange" value={formData.is_exchange} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.is_exchange && <p className="error">{errors.is_exchange}</p>}
                  </div>

                  {formData.is_exchange === 'true' && (
                    <>
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Exchange Broker</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilPeople} />
                          </CInputGroupText>
                          <CFormSelect name="broker_id" value={formData.broker_id} onChange={handleBrokerChange}>
                            <option value="">-Select-</option>
                            {brokers.map((broker) => (
                              <option key={broker._id} value={broker._id}>
                                {broker.name} {broker.otp_required ? '(OTP Required)' : ''}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {errors.broker_id && <p className="error">{errors.broker_id}</p>}
                      </div>

                      {selectedBroker && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Broker Mobile</span>
                          </div>
                          <CInputGroup>
                            <CInputGroupText className="input-icon">
                              <CIcon icon={cilPhone} />
                            </CInputGroupText>
                            <CFormInput value={selectedBroker.mobile} readOnly />
                          </CInputGroup>
                        </div>
                      )}

                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Exchange Vehicle Number</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilBike} />
                          </CInputGroupText>
                          <CFormInput name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} />
                        </CInputGroup>
                        {errors.vehicle_number && <p className="error">{errors.vehicle_number}</p>}
                      </div>

                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Exchange Price</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilMoney} />
                          </CInputGroupText>
                          <CFormInput name="exchange_price" value={formData.exchange_price} onChange={handleChange} />
                        </CInputGroup>
                        {errors.exchange_price && <p className="error">{errors.exchange_price}</p>}
                      </div>
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Exchange Chassis Number</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilBarcode} />
                          </CInputGroupText>
                          <CFormInput name="chassis_number" value={formData.chassis_number} onChange={handleChange} />
                        </CInputGroup>
                        {errors.chassis_number && <p className="error">{errors.chassis_number}</p>}
                      </div>
                      {selectedBroker?.otp_required && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">OTP Verification</span>
                            <span className="required">*</span>
                          </div>
                          {!otpSent ? (
                            <CButton color="primary" onClick={handleSendOtp}>
                              Send OTP
                            </CButton>
                          ) : (
                            <>
                              <CInputGroup>
                                <CInputGroupText className="input-icon">
                                  <CIcon icon={cilFingerprint} />
                                </CInputGroupText>
                                <CFormInput placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                <CButton color="success" onClick={handleVerifyOtp}>
                                  Verify OTP
                                </CButton>
                              </CInputGroup>
                              {otpError && <p className="error">{otpError}</p>}
                            </>
                          )}
                          {otpVerified && <div className="alert alert-success mt-2">OTP verified successfully</div>}
                        </div>
                      )}
                    </>
                  )}

                  <div
                    style={{
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#e0e0e0',
                      margin: '5px 0',
                      borderRadius: '2px'
                    }}
                  ></div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Payment Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilBank} />
                      </CInputGroupText>
                      <CFormSelect name="type" value={formData.type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="cash">Cash</option>
                        <option value="finance">Finance</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.type && <p className="error">{errors.type}</p>}
                  </div>

                {formData.type === 'finance' && (
  <>
    <div className="input-box">
      <div className="details-container">
        <span className="details">Financer Name</span>
        <span className="required">*</span>
      </div>
      <CInputGroup>
        <CInputGroupText className="input-icon">
          <CIcon icon={cilInstitution} />
        </CInputGroupText>
        <div style={{ flex: 1 }}>
          <Select
            name="financer_id"
            isDisabled={!formData.branch}
            placeholder={
              !formData.branch 
                ? "Select branch first" 
                : filteredFinancers.length === 0 
                  ? "No financers available" 
                  : "Search Financer"
            }
            value={
              financers.find((f) => f._id === formData.financer_id)
                ? {
                    label: financers.find((f) => f._id === formData.financer_id)?.financeProviderDetails?.name || 'Unknown',
                    value: formData.financer_id,
                  }
                : null
            }
            onChange={(selected) =>
              handleChange({
                target: {
                  name: "financer_id",
                  value: selected ? selected.value : "",
                },
              })
            }
            options={filteredFinancers.map((financer) => ({
              label: financer.financeProviderDetails?.name || 'Unknown',
              value: financer._id,
              ...(financer.branchRates[0]?.gcRate > 0 && { 
                description: `GC: ₹${financer.branchRates[0].gcRate}` 
              })
            }))}
            formatOptionLabel={(option) => (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{option.label}</span>
                {option.description && (
                  <small style={{ color: '#666', marginLeft: '10px' }}>
                    {option.description}
                  </small>
                )}
              </div>
            )}
            noOptionsMessage={() => {
              if (!formData.branch) return "Please select a branch first";
              if (financers.length === 0) return "No financers available";
              return "No matching financers found";
            }}
            classNamePrefix="react-select"
            className={`react-select-container ${
              errors.financer_id ? "error-input" : formData.financer_id ? "valid-input" : ""
            }`}
          />
        </div>
      </CInputGroup>
      {errors.financer_id && <p className="error">{errors.financer_id}</p>}
      
      {/* Show message if no financers available for selected branch */}
      {formData.branch && filteredFinancers.length === 0 && (
        <small className="text-muted">No financers available for this branch</small>
      )}
    </div>

    {/* GC Applicable and GC Amount fields - ONLY SHOW IN EDIT MODE */}
    {isEditMode && (
      <>
        <div className="input-box">
          <div className="details-container">
            <span className="details">GC Applicable</span>
            <span className="required">*</span>
          </div>
          <CInputGroup>
            <CInputGroupText className="input-icon">
              <CIcon icon={cilTask} />
            </CInputGroupText>
            <CFormSelect 
              name="gc_applicable" 
              value={formData.gc_applicable} 
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </CFormSelect>
          </CInputGroup>
          {errors.gc_applicable && <p className="error">{errors.gc_applicable}</p>}
        </div>

        {formData.gc_applicable && (
          <div className="input-box">
            <div className="details-container">
              <span className="details">GC Amount</span>
              {selectedFinancerGC > 0 && (
                <span className="text-muted small ms-2">
                  (Rate: ₹{selectedFinancerGC})
                </span>
              )}
            </div>
            <CInputGroup>
              <CInputGroupText className="input-icon">
                <CIcon icon={cilMoney} />
              </CInputGroupText>
              <CFormInput 
                name="gc_amount" 
                type="number"
                value={formData.gc_amount} 
                onChange={handleChange}
                placeholder={selectedFinancerGC > 0 ? `Suggested: ₹${selectedFinancerGC}` : "Enter GC amount"}
              />
            </CInputGroup>
            {errors.gc_amount && <p className="error">{errors.gc_amount}</p>}
          </div>
        )}
      </>
    )}

  
  </>
)}
                </div>
                <div className="form-footer">
                  <button type="button" className="submit-button" onClick={() => setActiveTab(3)}>
                    Back
                  </button>
                  <button type="button" className="cancel-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

            {activeTab === 5 && (
              <>
                <div>
                  <h5>Accessories for {selectedModelName} ({modelType})</h5>
                  {accessories.length > 0 ? (
                    <>
                      <p className="text-muted mb-3">
                        Showing accessories compatible with {selectedModelName} ({modelType} type)
                      </p>
                      <div className="accessories-list">
                       {accessories.map((accessory) => {
  
  const isExplicitlyUnchecked = formData.uncheckedAccessories && 
                               formData.uncheckedAccessories.includes(accessory._id);
  
  let isChecked;
  if (isEditMode) {
    // In edit mode: accessory is checked if it's in selected_accessories
    isChecked = formData.selected_accessories.includes(accessory._id);
  } else {
    // In new booking mode: default to checked unless explicitly unchecked
    isChecked = !isExplicitlyUnchecked;
  }

  return (
    <div key={accessory._id} className="accessory-item">
      <CFormCheck
        id={`accessory-${accessory._id}`}
        label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
        checked={isChecked}
        onChange={(e) => {
          const isNowChecked = e.target.checked;
          if (!isNowChecked) {
            // Add to unchecked accessories
            setFormData(prev => ({
              ...prev,
              uncheckedAccessories: [...(prev.uncheckedAccessories || []), accessory._id],
              // Also remove from selected_accessories
              selected_accessories: prev.selected_accessories.filter(id => id !== accessory._id)
            }));
          } else {
            // Remove from unchecked accessories
            setFormData(prev => ({
              ...prev,
              uncheckedAccessories: prev.uncheckedAccessories?.filter(id => id !== accessory._id) || [],
              // Also add to selected_accessories
              selected_accessories: [...prev.selected_accessories, accessory._id]
            }));
          }
        }}
      />
      {accessory.description && (
        <small className="text-muted d-block">{accessory.description}</small>
      )}
    </div>
  );
})}
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-info">
                      <p>No accessories available for {selectedModelName} ({modelType})</p>
                      <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
                    </div>
                  )}
                </div>
                <div className="form-footer">
                  <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
                    Back
                  </button>
                  <button type="button" className="submit-button" onClick={handleNextTab}>
                    Next
                  </button>
                </div>
              </>
            )}

      {activeTab === 6 && (
  <>
    <div className="user-details">
      <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 48%' }}>
          <span className="details">Note</span>
          <CInputGroup>
            <CInputGroupText className="input-icon">
              <CIcon icon={cilList} />
            </CInputGroupText>
            <CFormInput name="note" value={formData.note} onChange={handleChange} />
          </CInputGroup>
        </div>
        
        <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
          {/* Total Deal Amount display - same as before */}
          <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
          <div style={{ 
            display: 'inline-block',
            backgroundColor: '#f8f9fa',
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid #dee2e6',
            minWidth: '200px',
            textAlign: 'left'
          }}>
            {(() => {
              const totals = calculateTotalDealAmount();
              const totalBeforeDiscount = parseFloat(totals.totalBeforeDiscount);
              const totalAfterDiscount = parseFloat(totals.totalAfterDiscount);
              const totalDiscount = parseFloat(totals.totalDiscount);
              const subsidyAmount = parseFloat(totals.subsidyAmount);
              const hasDiscount = totals.hasDiscount;
              const hasSubsidy = totals.hasSubsidy;
              
              return (
                <>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3px'
                  }}>
                    <small>Original Total:</small>
                    <span>₹{totalBeforeDiscount.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {hasDiscount && (
                    <>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '3px',
                        fontSize: '12px'
                      }}>
                        <small>Discount:</small>
                        <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                  
                  {hasSubsidy && isEVModel && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                        alignItems: 'center',
                      marginBottom: '3px',
                      fontSize: '12px'
                    }}>
                      <small>EV Subsidy:</small>
                      <span>- ₹{subsidyAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  {(hasDiscount || hasSubsidy) && (
                    <div style={{ 
                      width: '100%', 
                      height: '1px', 
                      backgroundColor: '#ccc', 
                      margin: '3px 0'
                    }}></div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '3px',
                    fontWeight: 'bold'
                  }}>
                    <span>{(hasDiscount || hasSubsidy) ? 'Final Amount:' : 'Total:'}</span>
                    <span style={{ fontSize: '16px' }}>
                      ₹{totalAfterDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
    
    {/* ===== Discount Limits Information (only shown in edit mode) ===== */}
    {isEditMode && (
      <div className="discount-limits-info" style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <h6 style={{ marginBottom: '10px', color: '#495057' }}>Available Discount Limits</h6>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <small style={{ display: 'block', color: '#6c757d' }}>Vehicle Price Discount</small>
            <strong style={{ fontSize: '1.1em' }}>
              ₹{(discountLimits.onRoadPrice || 0).toLocaleString('en-IN')}
            </strong>
            {discountUsageByCategory.vehicle_price > 0 && (
              <div style={{ fontSize: '0.9em', color: '#28a745' }}>
                Used: ₹{discountUsageByCategory.vehicle_price.toLocaleString('en-IN')}
                <br />
                Remaining: ₹{remainingDiscounts.onRoadPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <small style={{ display: 'block', color: '#6c757d' }}>Add-On Services Discount</small>
            <strong>{discountLimits.addOnServices || 0}%</strong>
            {discountUsageByCategory.AddONservices > 0 && (
              <div style={{ fontSize: '0.9em', color: '#28a745' }}>
                Used: ₹{discountUsageByCategory.AddONservices.toLocaleString('en-IN')}
                <br />
                Remaining: {remainingDiscounts.addOnServicesPercentage}% (₹{remainingDiscounts.addOnServicesAmount.toLocaleString('en-IN')})
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <small style={{ display: 'block', color: '#6c757d' }}>Accessories Discount</small>
            <strong>{discountLimits.accessories || 0}%</strong>
            {discountUsageByCategory.Accessories > 0 && (
              <div style={{ fontSize: '0.9em', color: '#28a745' }}>
                Used: ₹{discountUsageByCategory.Accessories.toLocaleString('en-IN')}
                <br />
                Remaining: {remainingDiscounts.accessoriesPercentage}% (₹{remainingDiscounts.accessoriesAmount.toLocaleString('en-IN')})
              </div>
            )}
          </div>
          
          {remainingDiscounts.totalUsed > 0 && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <small style={{ display: 'block', color: '#6c757d' }}>Total Discount Used</small>
              <strong>₹{remainingDiscounts.totalUsed.toLocaleString('en-IN')}</strong>
            </div>
          )}
        </div>
      </div>
    )}
    {/* ===== END ===== */}
    
    {(() => {
      // Get headers for Tab 6 with proper branch filtering and insurance filtering
      const getTab6Headers = () => {
        if (!formData.model_id) return [];

        const selectedModel = models.find((model) => model._id === formData.model_id);
        if (!selectedModel) return [];

        const allPrices = selectedModel.modelPrices || [];
        
        // Get the prices that match the selected branch OR have null branch_id
        const filteredPrices = allPrices.filter(price => {
          // If price has no branch_id, include it (default/fallback)
          if (!price.branch_id && price.branch_id !== null) {
            return true;
          }
          
          // If price has branch_id, check if it matches selected branch
          return price.branch_id === formData.branch;
        });
        
        // Apply HPA filter
        const hpaFiltered = filterHeadersByHPAStatus(filteredPrices, formData.hpa);
        
        // Apply insurance filters
        const insuranceFiltered = filterInsuranceHeaders(hpaFiltered);
        
        // Now filter to show only headers that should be displayed
        return insuranceFiltered.filter((price) => {
          if (!price.header || !price.header._id) {
            return false;
          }
          
          const headerId = price.header._id;
          const isMandatory = price.header.is_mandatory;
          
          if (isEditMode) {
            // In edit mode: show headers that are in optionalComponents (were selected in original booking)
            const isInOptionalComponents = formData.optionalComponents.includes(headerId);
            return isMandatory || isInOptionalComponents;
          } else {
            // In new booking mode: show headers that are not explicitly unchecked
            const isExplicitlyUnchecked = formData.uncheckedHeaders && 
              formData.uncheckedHeaders.includes(headerId);
            return isMandatory || !isExplicitlyUnchecked;
          }
        });
      };
      
      const tab6Headers = getTab6Headers();
      
      if (tab6Headers.length > 0) {
        return (
          <div className="model-headers-section" style={{ marginTop: '20px' }}>
            <h5>
              Model Options ({tab6Headers.length} selected)
              {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
                (HPA-related options hidden as HPA is disabled)
              </span>}
              {formData.selfInsurance === true && <span style={{ color: '#28a745', fontSize: '0.9em', marginLeft: '10px' }}>
                (Insurance headers hidden as Self Insurance is enabled)
              </span>}
              {formData.selfInsurance === false && formData.insuranceFivePlusFive === true && <span style={{ color: '#ffc107', fontSize: '0.9em', marginLeft: '10px' }}>
                (INSURANCE CHARGES header hidden for Insurance 5+5, Insurance: 5 + 5 Years shown)
              </span>}
              {formData.selfInsurance === false && formData.insuranceFivePlusFive === false && <span style={{ color: '#6c757d', fontSize: '0.9em', marginLeft: '10px' }}>
                (Standard insurance - INSURANCE CHARGES shown)
              </span>}
            </h5>
            
            <div className="table-responsive">
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Particulars</CTableHeaderCell>
                    <CTableHeaderCell>HSN</CTableHeaderCell>
                    <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
                    <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
                    <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
                    <CTableHeaderCell>CGST %</CTableHeaderCell>
                    <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
                    <CTableHeaderCell>SGST %</CTableHeaderCell>
                    <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
                    <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {(() => {
                    // First, calculate total discounts by category (ONLY FOR EDIT MODE)
                    let totalDiscountFromVehiclePrice = 0;
                    let totalDiscountFromAddOnServices = 0;
                    let totalDiscountFromAccessories = 0;
                    let totalDiscountFromOtherCategories = 0;
                    
                    // Only calculate these totals in edit mode
                    if (isEditMode) {
                      tab6Headers.forEach((price) => {
                        const header = price.header;
                        const headerId = header._id || header.id;
                        const headerKey = header.header_key || '';
                        const categoryKey = header.category_key || '';
                        
                        // Check if this is an HPA-related header
                        const isHPAHeader = headerKey.startsWith('HP') || 
                                            headerKey.startsWith('HPA') ||
                                            headerKey.toLowerCase().includes('hypothecation') ||
                                            headerKey.toLowerCase().includes('loan');
                        
                        // Determine if header should be shown based on HPA status
                        const shouldShowHeader = formData.hpa || !isHPAHeader;
                        
                        if (!shouldShowHeader) {
                          return;
                        }
                        
                        const isSpecialHeader = headerKey.includes('ON ROAD PRICE') || 
                                               headerKey.includes('ADDON SERVICES TOTAL') || 
                                               headerKey.includes('ADD ON SERVICES TOTAL') || 
                                               headerKey === 'ACCESSORIES TOTAL';
                        
                        // Skip special headers themselves from discount calculations
                        if (isSpecialHeader) {
                          return;
                        }
                        
                        const discountValue = headerDiscounts[headerId] !== undefined 
                          ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
                          : '';
                        
                        const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                        
                        // Categorize discounts
                        if (discountAmount > 0) {
                          if (categoryKey === 'vehicle_price') {
                            totalDiscountFromVehiclePrice += discountAmount;
                          } else if (categoryKey === 'AddONservices') {
                            totalDiscountFromAddOnServices += discountAmount;
                          } else if (categoryKey === 'Accesories' || categoryKey === 'Accessories') {
                            totalDiscountFromAccessories += discountAmount;
                          } else {
                            totalDiscountFromOtherCategories += discountAmount;
                          }
                        }
                      });
                    }
                    
                    const headersWithCalculations = [];
                    
                    // Collect all headers
                    tab6Headers.forEach((price) => {
                      const header = price.header;
                      const headerId = header._id || header.id;
                      const headerKey = header.header_key || '';
                      
                      // Determine if this is the RTO header
                      const isRTOHeader = headerKey === 'RTO TAX & REGISTRATION CHARGES' || 
                                          headerKey.includes('RTO TAX') || 
                                          headerKey.includes('REGISTRATION CHARGES');
                      
                      // Check if this is an HPA-related header
                      const isHPAHeader = headerKey.startsWith('HP') || 
                                          headerKey.startsWith('HPA') ||
                                          headerKey.toLowerCase().includes('hypothecation') ||
                                          headerKey.toLowerCase().includes('loan');
                      
                      // Determine if header should be shown based on HPA status
                      const shouldShowHeader = formData.hpa || !isHPAHeader;
                      
                      if (!shouldShowHeader) {
                        return;
                      }
                      
                      const isSpecialHeader = headerKey.includes('ON ROAD PRICE') || 
                                             headerKey.includes('ADDON SERVICES TOTAL') || 
                                             headerKey.includes('ADD ON SERVICES TOTAL') || 
                                             headerKey === 'ACCESSORIES TOTAL';
                      
                      const discountValue = headerDiscounts[headerId] !== undefined 
                        ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
                        : '';
                      
                      const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                      
                      headersWithCalculations.push({
                        price,
                        header,
                        headerId,
                        headerKey,
                        isSpecialHeader,
                        isRTOHeader,
                        discountAmount
                      });
                    });
                    
                    // Second pass: render rows with adjusted calculations
                    return headersWithCalculations.map((item) => {
                      const { price, header, headerId, headerKey, isSpecialHeader, isRTOHeader, discountAmount } = item;
                      const isMandatory = header.is_mandatory;
                      const isDiscountAllowed = header.is_discount;
                      const isAccessoriesTotal = headerKey === 'ACCESSORIES TOTAL';
                      
                      const isExplicitlyUnchecked = formData.uncheckedHeaders && 
                        formData.uncheckedHeaders.includes(headerId);
                      // For all headers, check if they are selected
                      const isChecked = isMandatory || !isExplicitlyUnchecked;
                      
                      // Find matching accessories for this header
                      const selectedMatchingAccessories = accessories.filter(accessory => 
                        accessory.categoryDetails?.header_key === header.header_key &&
                        (isEditMode ? 
                          formData.selected_accessories.includes(accessory._id) : // In edit mode
                          !formData.uncheckedAccessories?.includes(accessory._id) // In new mode
                        )
                      );

                      // Get TOTAL accessory price (SUM of all selected accessories for this header)
                      const accessoryPrice = selectedMatchingAccessories.length > 0 
                        ? selectedMatchingAccessories.reduce((sum, acc) => sum + (acc.price || 0), 0)
                        : 0;
                                      
                      const headerPrice = price.value || 0;
                      
                      // Start with the higher of header price or accessory price
                      let finalPrice = Math.max(headerPrice, accessoryPrice);
                      
                      // Special handling for RTO header when RTO type is BH or CRTM
                      if (isRTOHeader && (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && formData.rto_amount) {
                        finalPrice = parseFloat(formData.rto_amount) || 0;
                      }
                      
                      // For special headers in EDIT MODE only, apply appropriate discounts based on category
                      let adjustedPrice = finalPrice;
                      let discountApplied = 0;
                      
                      if (isSpecialHeader && isEditMode) {
                        if (headerKey.includes('ON ROAD PRICE') || headerKey.includes('TOTAL ONROAD')) {
                          // Apply vehicle_price discounts to ON ROAD PRICE
                          discountApplied = totalDiscountFromVehiclePrice;
                          adjustedPrice = Math.max(0, finalPrice - discountApplied);
                        } else if (headerKey.includes('ADDON SERVICES TOTAL') || headerKey.includes('ADD ON SERVICES TOTAL')) {
                          // Apply AddONservices discounts to ADDON SERVICES TOTAL
                          discountApplied = totalDiscountFromAddOnServices;
                          adjustedPrice = Math.max(0, finalPrice - discountApplied);
                        } else if (headerKey === 'ACCESSORIES TOTAL') {
                          // ACCESSORIES TOTAL - apply accessories category discounts
                          discountApplied = totalDiscountFromAccessories;
                          adjustedPrice = Math.max(0, finalPrice - discountApplied);
                        }
                      }
                      
                      const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
                      const hsnCode = header.metadata?.hsn_code || 'N/A';
                      
                      let taxable, cgstAmount, sgstAmount, cgstRate, sgstRate, lineTotal;
                      
                      if (isSpecialHeader && isEditMode) {
                        // For special headers in EDIT MODE, use the adjusted price (after auto-discount)
                        taxable = calculateTaxableAmount(adjustedPrice, 0, gstRate, formData.customer_type);
                        const gstCalculation = calculateGST(taxable, gstRate, formData.customer_type);
                        cgstAmount = gstCalculation.cgstAmount;
                        sgstAmount = gstCalculation.sgstAmount;
                        cgstRate = gstCalculation.cgstRate;
                        sgstRate = gstCalculation.sgstRate;
                        lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
                      } else {
                        // For non-special headers OR special headers in CREATE MODE, use regular discount calculation
                        taxable = calculateTaxableAmount(finalPrice, discountAmount, gstRate, formData.customer_type);
                        const gstCalculation = calculateGST(taxable, gstRate, formData.customer_type);
                        cgstAmount = gstCalculation.cgstAmount;
                        sgstAmount = gstCalculation.sgstAmount;
                        cgstRate = gstCalculation.cgstRate;
                        sgstRate = gstCalculation.sgstRate;
                        lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
                      }
                      
                      // Apply subsidy deduction SEPARATELY (not as discount) for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
                      if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel) {
                        const subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
                        // Subtract subsidy from line total, but NOT from discount field
                        lineTotal = lineTotal - subsidyAmount;
                      }

                      return (
                        <CTableRow key={headerId}>
                          <CTableDataCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <CFormCheck
                                id={`tab6-header-${headerId}`}
                                checked={isChecked}
                                onChange={(e) => {
                                  if (!isMandatory) {
                                    const isNowChecked = e.target.checked;
                                    handleHeaderSelection(headerId, isNowChecked);
                                  }
                                }}
                                disabled={isMandatory}
                                style={{ marginRight: '10px' }}
                              />
                              <span>
                                {header.header_key} 
                                {isMandatory ? '(Mandatory)' : '(Optional)'}
                                {headerKey.startsWith('HP') || headerKey.startsWith('HPA') ? ' (HPA-related)' : ''}
                                {isRTOHeader && (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && formData.rto_amount ? 
                                  ' (Using entered RTO amount)' : ''}
                              </span>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>{hsnCode}</CTableDataCell>
                          <CTableDataCell>₹{finalPrice.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>
                            {isSpecialHeader && isEditMode ? (
                              // In EDIT MODE, show the auto-calculated discount for special headers
                              <div style={{ 
                                padding: '8px', 
                                backgroundColor: '#f8f9fa', 
                                borderRadius: '4px', 
                                textAlign: 'center'
                              }}>
                                ₹{adjustedPrice.toFixed(2)}
                                {discountApplied > 0 && (
                                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                    Discount: -₹{discountApplied.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              // For CREATE MODE, treat special headers like regular headers - show discount input if allowed
                              <div>
                                <CFormInput
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder={isDiscountAllowed ? "Enter discount" : "Discount not allowed"}
                                  value={headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : ''}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '') {
                                      const category = header.category_key || '';
                                      handleHeaderDiscountChange(headerId, '', category, finalPrice);
                                    } else {
                                      const numValue = parseFloat(value);
                                      if (!isNaN(numValue) && numValue >= 0) {
                                        const category = header.category_key || '';
                                        handleHeaderDiscountChange(headerId, numValue, category, finalPrice);
                                      }
                                    }
                                  }}
                                  disabled={!isDiscountAllowed}
                                  style={{ width: '150px' }}
                                  className={`no-spinner ${headerDiscounts[headerId] ? 'has-value' : ''}`}
                                  onWheel={(e) => e.target.blur()}
                                />
                              </div>
                            )}
                            {errors[`discount_${headerId}`] && (
                              <small className="text-danger d-block">{errors[`discount_${headerId}`]}</small>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{cgstRate?.toFixed(2) || '0.00'}%</CTableDataCell>
                          <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{sgstRate?.toFixed(2) || '0.00'}%</CTableDataCell>
                          <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>
                            <strong>₹{lineTotal.toFixed(2)}</strong>
                            {headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel && (
                              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                (After ₹{formData.subsidy_amount} EV subsidy)
                              </div>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      );
                    });
                  })()}
                </CTableBody>
              </CTable>
            </div>
          </div>
        );
      }
      
      return null;
    })()}

    <div className="form-footer">
      <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
        Back
      </button>
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
      </button>
    </div>
  </>
)}
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;










// import React, { useState, useEffect, useRef } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CFormCheck, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert } from '@coreui/react';
// import CIcon from '@coreui/icons-react';

// import { cilSearch } from '@coreui/icons';
// import {
//   cilBank,
//   cilBarcode,
//   cilBike,
//   cilBirthdayCake,
//   cilBriefcase,
//   cilCalendar,
//   cilCarAlt,
//   cilChartLine,
//   cilCreditCard,
//   cilEnvelopeClosed,
//   cilFingerprint,
//   cilHome,
//   cilInstitution,
//   cilList,
//   cilListRich,
//   cilLocationPin,
//   cilMap,
//   cilMoney,
//   cilPaint,
//   cilPeople,
//   cilPhone,
//   cilShieldAlt,
//   cilSwapVertical,
//   cilTask,
//   cilUser
// } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
// import axiosInstance from '../../../axiosInstance';
// import Select from "react-select";

// function BookingForm() {
//   const [userData, setUserData] = useState(null);
//   const [isSalesExecutive, setIsSalesExecutive] = useState(false);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [hasCSDAccess, setHasCSDAccess] = useState(false);
  
//   // ===== Discount limits state (only used in edit mode) =====
//   const [discountLimits, setDiscountLimits] = useState({
//     onRoadPrice: 0,
//     addOnServices: 0,
//     accessories: 0
//   });

//   const [remainingDiscounts, setRemainingDiscounts] = useState({
//     onRoadPrice: 0,        // Amount in rupees
//     addOnServices: 0,      // Percentage
//     addOnServicesAmount: 0, // Amount in rupees (for display)
//     addOnServicesPercentage: 0, // Remaining percentage based on total
//     accessories: 0,        // Percentage
//     accessoriesAmount: 0,   // Amount in rupees (for display)
//     accessoriesPercentage: 0, // Remaining percentage based on total
//     totalUsed: 0
//   });

//   const [discountUsageByCategory, setDiscountUsageByCategory] = useState({
//     vehicle_price: 0,
//     AddONservices: 0,
//     Accessories: 0,
//     other: 0
//   });

//   // State to store the total values of special headers
//   const [specialHeaderValues, setSpecialHeaderValues] = useState({
//     addOnServicesTotal: 0,
//     accessoriesTotal: 0,
//     onRoadPriceTotal: 0
//   });
//   // ===== END =====
  
//   const [formData, setFormData] = useState({
//     verticle_id: '',
//     model_id: '',
//     model_color: '',
//     customer_type: 'B2C',
//     rto_type: 'MH',
//     branch: '',
//     optionalComponents: [],
//     sales_executive: '',
//     gstin: '',
//     rto_amount: '',
//     salutation: '',
//     name: '',
//     pan_no: '',
//     dob: '',
//     occupation: '',
//     address: '',
//     taluka: '',
//     district: '',
//     pincode: '',
//     mobile1: '',
//     mobile2: '',
//     aadhar_number: '',
//     nomineeName: '',
//     nomineeRelation: '',
//     nomineeAge: '',
//     type: 'cash',
//     financer_id: '',
//     scheme: '',
//     emi_plan: '',
//     gc_applicable: true,
//     gc_amount: '',
//     discountType: 'fixed',
//     selected_accessories: [],
//     hpa: true,
//     selfInsurance: false,
//     insuranceFivePlusFive: false,
//     is_exchange: false,
//     broker_id: '',
//     exchange_price: '',
//     vehicle_number: '',
//     chassis_number: '',
//     note: '',
//     uncheckedHeaders: [],
//     uncheckedAccessories: [],
//     subsidy_amount: '',
//     rto_code: '' // Start empty, will be set to MH 15 only for new bookings
//   });

//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState(null);
//   const [allVerticles, setAllVerticles] = useState([]); 
//   const [userVerticles, setUserVerticles] = useState([]); 
//   const [userVerticleIds, setUserVerticleIds] = useState([]); 
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [brokers, setBrokers] = useState([]);
//   const [salesExecutives, setSalesExecutives] = useState([]);
//   const [financers, setFinancers] = useState([]);
//   const [filteredFinancers, setFilteredFinancers] = useState([]);
//   const [selectedBranchName, setSelectedBranchName] = useState('');
//   const [modelDetails, setModelDetails] = useState(null);
//   const [accessoriesTotal, setAccessoriesTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(1);
//   const [selectedModelHeaders, setSelectedModelHeaders] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedBroker, setSelectedBroker] = useState(null);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [modelType, setModelType] = useState('');
//   const [selectedModelName, setSelectedModelName] = useState('');
//   const [isEVModel, setIsEVModel] = useState(false);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchError, setSearchError] = useState('');

//   const [headerDiscounts, setHeaderDiscounts] = useState({});
//   const [bookingPriceComponents, setBookingPriceComponents] = useState([]);
//   const [selectedFinancerGC, setSelectedFinancerGC] = useState('');
  
//   // New state for RTO codes
//   const [rtoCodes, setRtoCodes] = useState([]);
//   const [loadingRtoCodes, setLoadingRtoCodes] = useState(false);
  
//   const isInitialBookingLoad = useRef(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Filter financers based on branch
//   useEffect(() => {
//     if (formData.branch) {
//       const filtered = financers.filter(financer => 
//         financer.branchRates.some(rate => rate.branchId === formData.branch)
//       );
//       setFilteredFinancers(filtered);
//     } else {
//       setFilteredFinancers([]);
//     }
//   }, [formData.branch, financers]);

//   // ===== Function to calculate discount usage by category (only for edit mode) =====
//   const calculateDiscountUsageByCategory = (headers, discounts) => {
//     const usage = {
//       vehicle_price: 0,
//       AddONservices: 0,
//       Accessories: 0,
//       other: 0
//     };
    
//     headers.forEach((price) => {
//       const header = price.header;
//       if (!header) return;
      
//       const headerId = header._id || header.id;
//       const categoryKey = header.category_key || '';
//       const discountValue = discounts[headerId] !== undefined ? discounts[headerId] : 0;
//       const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
//       if (discountAmount > 0) {
//         if (categoryKey === 'vehicle_price') {
//           usage.vehicle_price += discountAmount;
//         } else if (categoryKey === 'AddONservices') {
//           usage.AddONservices += discountAmount;
//         } else if (categoryKey === 'Accesories' || categoryKey === 'Accessories') {
//           usage.Accessories += discountAmount;
//         } else {
//           usage.other += discountAmount;
//         }
//       }
//     });
    
//     return usage;
//   };
//   // ===== END =====

//   // ===== Function to extract special header values =====
//   const extractSpecialHeaderValues = (headers) => {
//     let addOnServicesTotal = 0;
//     let accessoriesTotal = 0;
//     let onRoadPriceTotal = 0;
    
//     headers.forEach((price) => {
//       const header = price.header;
//       if (!header) return;
      
//       const headerKey = header.header_key || '';
      
//       if (headerKey.includes('ADD ON SERVICES TOTAL') || headerKey.includes('ADDON SERVICES TOTAL')) {
//         addOnServicesTotal = price.value || 0;
//       } else if (headerKey === 'ACCESSORIES TOTAL') {
//         accessoriesTotal = price.value || 0;
//       } else if (headerKey.includes('ON ROAD PRICE') || headerKey.includes('ON-ROAD PRICE')) {
//         onRoadPriceTotal = price.value || 0;
//       }
//     });
    
//     return { addOnServicesTotal, accessoriesTotal, onRoadPriceTotal };
//   };
//   // ===== END =====

//   // Function to filter headers based on HPA status
//   const filterHeadersByHPAStatus = (headers, hpaEnabled) => {
//     if (hpaEnabled) {
//       return headers; // Show all headers when HPA is enabled
//     } else {
//       // Filter out headers starting with 'HP' or 'HPA' when HPA is disabled
//       return headers.filter(price => {
//         const headerKey = price.header?.header_key || '';
//         const lowerHeaderKey = headerKey.toLowerCase();
        
//         // Exclude headers related to HPA
//         return !(
//           lowerHeaderKey.startsWith('hp') ||
//           lowerHeaderKey.startsWith('hpa') ||
//           lowerHeaderKey.includes('hypothecation') ||
//           lowerHeaderKey.includes('loan')
//         );
//       });
//     }
//   };

//   // Updated function to filter out insurance headers based on insurance settings
//   const filterInsuranceHeaders = (headers) => {
//     return headers.filter(price => {
//       if (!price.header || !price.header.header_key) return true;
      
//       const headerKey = price.header.header_key;
      
//       // Case 1: Self Insurance is true - hide all insurance-related headers
//       if (formData.selfInsurance === true) {
//         if (headerKey.includes('INSURANCE') || 
//             headerKey === 'INSURANCE' || 
//             headerKey === 'INSURANCE CHARGES' || 
//             headerKey === 'Insurance: 5 + 5 Years') {
//           return false;
//         }
//       }
      
//       // Case 2: Insurance 5+5 is true and Self Insurance is false - 
//       // Show Insurance: 5 + 5 Years, hide INSURANCE CHARGES
//       if (formData.selfInsurance === false && formData.insuranceFivePlusFive === true) {
//         if (headerKey === 'INSURANCE CHARGES') {
//           return false;
//         }
//         // Insurance: 5 + 5 Years should be shown in this case
//         return true;
//       }
      
//       // Case 3: Both Self Insurance and Insurance 5+5 are false - 
//       // Show INSURANCE CHARGES, hide Insurance: 5 + 5 Years
//       if (formData.selfInsurance === false && formData.insuranceFivePlusFive === false) {
//         if (headerKey === 'Insurance: 5 + 5 Years') {
//           return false;
//         }
//         // INSURANCE CHARGES should be shown in this case
//         return true;
//       }
      
//       return true;
//     });
//   };

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoadingUser(true);
//         const response = await axiosInstance.get('/auth/me');
//         const userData = response.data.data;
//         setUserData(userData);
        
//         // ===== Set discount limits from user data =====
//         setDiscountLimits({
//           onRoadPrice: userData.onRoadPrice || 0,
//           addOnServices: userData.addOnServices || 0,
//           accessories: userData.accessories || 0
//         });
        
//         setRemainingDiscounts({
//           onRoadPrice: userData.onRoadPrice || 0,
//           addOnServices: userData.addOnServices || 0,
//           addOnServicesAmount: 0,
//           addOnServicesPercentage: userData.addOnServices || 0,
//           accessories: userData.accessories || 0,
//           accessoriesAmount: 0,
//           accessoriesPercentage: userData.accessories || 0,
//           totalUsed: 0
//         });
//         // ===== END =====
        
//         const csdAccess = userData.csd || false;
//         setHasCSDAccess(csdAccess);
        
//         const isSalesExec = userData.roles?.some(role => role.name === 'SALES_EXECUTIVE') || false;
//         setIsSalesExecutive(isSalesExec);
        
//         if (isSalesExec && userData.branch?._id) {
//           setFormData(prev => ({
//             ...prev,
//             branch: userData.branch._id,
//             sales_executive: userData._id
//           }));
//         }
        
//         const verticlesData = userData.verticles || [];
//         const verticleIds = verticlesData.map(verticle => verticle._id);
//         setUserVerticleIds(verticleIds);
        
//         await fetchAllVerticles(verticlesData);
        
//         // ONLY fetch initial models if NOT in edit mode
//         if (!id) {
//           if (isSalesExec && userData.branch?._id) {
//             fetchModels('B2C', userData.branch._id);
//           } else {
//             fetchModels('B2C');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//         const storedUserRole = localStorage.getItem('userRole');
//         const isSalesExec = storedUser.roles?.some(role => role.name === 'SALES_EXECUTIVE') || 
//                            storedUserRole === 'SALES_EXECUTIVE' || 
//                            false;
//         setIsSalesExecutive(isSalesExec);
        
//         const storedCSD = storedUser.csd || false;
//         setHasCSDAccess(storedCSD);
//       } finally {
//         setLoadingUser(false);
//       }
//     };
    
//     fetchUserData();
//   }, [id]);

//   // ===== Effect to recalculate discount usage when header discounts change (only in edit mode) =====
//   useEffect(() => {
//     if (isEditMode && Object.keys(headerDiscounts).length > 0) {
//       const tab6Headers = getSelectedHeadersForTab6();
//       const newUsage = calculateDiscountUsageByCategory(tab6Headers, headerDiscounts);
//       setDiscountUsageByCategory(newUsage);
      
//       // Extract special header values
//       const specialValues = extractSpecialHeaderValues(tab6Headers);
//       setSpecialHeaderValues(specialValues);
      
//       // Calculate remaining percentages based on special header values
//       const maxAddOnAmount = (specialValues.addOnServicesTotal * discountLimits.addOnServices) / 100;
//       const maxAccessoriesAmount = (specialValues.accessoriesTotal * discountLimits.accessories) / 100;
      
//       const remainingAddOnAmount = Math.max(0, maxAddOnAmount - newUsage.AddONservices);
//       const remainingAddOnPercentage = specialValues.addOnServicesTotal > 0 
//         ? ((remainingAddOnAmount / specialValues.addOnServicesTotal) * 100).toFixed(1)
//         : 0;
      
//       const remainingAccessoriesAmount = Math.max(0, maxAccessoriesAmount - newUsage.Accessories);
//       const remainingAccessoriesPercentage = specialValues.accessoriesTotal > 0 
//         ? ((remainingAccessoriesAmount / specialValues.accessoriesTotal) * 100).toFixed(1)
//         : 0;
      
//       setRemainingDiscounts({
//         onRoadPrice: Math.max(0, discountLimits.onRoadPrice - newUsage.vehicle_price),
//         addOnServices: discountLimits.addOnServices,
//         addOnServicesAmount: remainingAddOnAmount,
//         addOnServicesPercentage: remainingAddOnPercentage,
//         accessories: discountLimits.accessories,
//         accessoriesAmount: remainingAccessoriesAmount,
//         accessoriesPercentage: remainingAccessoriesPercentage,
//         totalUsed: newUsage.vehicle_price + newUsage.AddONservices + newUsage.Accessories + newUsage.other
//       });
//     }
//   }, [headerDiscounts, discountLimits, isEditMode, accessories, formData.selected_accessories, formData.uncheckedAccessories, formData.selfInsurance, formData.insuranceFivePlusFive]);

//   // Fetch RTO codes when RTO type is MH
//   useEffect(() => {
//     const fetchRtoCodes = async () => {
//       if (formData.rto_type === 'MH') {
//         setLoadingRtoCodes(true);
//         try {
//           const response = await axiosInstance.get('/rtos');
//           // Filter active RTO codes only
//           const activeRtoCodes = response.data?.data?.filter(rto => rto.is_active) || [];
//           setRtoCodes(activeRtoCodes);
          
//           // Only set default MH 15 for NEW bookings (not in edit mode)
//           // AND only if rto_code is currently empty
//           if (!isEditMode && activeRtoCodes.length > 0 && !formData.rto_code) {
//             const mh15Code = activeRtoCodes.find(rto => rto.rto_code === 'MH 15');
//             if (mh15Code) {
//               setFormData(prev => ({ ...prev, rto_code: 'MH 15' }));
//             }
//           }
//         } catch (error) {
//           console.error('Error fetching RTO codes:', error);
//           setRtoCodes([]);
//           const message = showError(error);
//           if (message) {
//             setError(message);
//           }
//         } finally {
//           setLoadingRtoCodes(false);
//         }
//       } else {
//         // Clear RTO codes if not MH
//         setRtoCodes([]);
//         // Also clear rto_code from formData if not MH
//         setFormData(prev => ({ ...prev, rto_code: '' }));
//       }
//     };
    
//     fetchRtoCodes();
//   }, [formData.rto_type, isEditMode, formData.rto_code]);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchBranches();
//   }, []);

//   useEffect(() => {
//     // When in edit mode and form data changes, refilter models
//     if (isEditMode && formData.branch && formData.verticle_id) {
//       // Filter the already fetched models
//       const filtered = models.filter(model => 
//         // Filter by branch (if model has branch info)
//         (!model.branch_id || model.branch_id === formData.branch || model.branch === formData.branch) &&
//         // Filter by verticle
//         (model.verticle_id === formData.verticle_id || model.verticle === formData.verticle_id)
//       );
//       setFilteredModels(filtered);
//     }
//   }, [isEditMode, formData.branch, formData.verticle_id, models]);

//   useEffect(() => {
//     if (id && !isInitialBookingLoad.current) {
//       isInitialBookingLoad.current = true;
//       fetchBookingDetails(id);
//       setIsEditMode(true);
//     }
//   }, [id]);

//   // Initialize headerDiscounts from bookingPriceComponents in edit mode
//   useEffect(() => {
//     if (isEditMode && bookingPriceComponents.length > 0 && Object.keys(headerDiscounts).length === 0) {
//       const initialDiscounts = {};
//       bookingPriceComponents.forEach(priceComponent => {
//         if (priceComponent.header && priceComponent.header._id) {
//           const headerId = priceComponent.header._id;
//           const discountAmount = priceComponent.discountAmount || 0;
//           initialDiscounts[headerId] = discountAmount;
//         }
//       });
//       console.log('Initializing headerDiscounts from bookingPriceComponents:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);
//     }
//   }, [isEditMode, bookingPriceComponents]);

//   const fetchAllVerticles = async (userVerticlesData) => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setAllVerticles(verticlesData);
      
//       const filteredVerticles = userVerticlesData.filter(verticle => 
//         verticle.status === 'active'
//       );
//       setUserVerticles(filteredVerticles);
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const handleCustomerSearch = async () => {
//     if (!searchQuery.trim()) {
//       setSearchError('Please enter PAN or Aadhar number');
//       return;
//     }

//     setSearchLoading(true);
//     setSearchError('');

//     try {
//       const response = await axiosInstance.get(`/customer-ledgers/search?q=${encodeURIComponent(searchQuery)}`);

//       if (response.data.success && response.data.data.customers.length > 0) {
//         const customer = response.data.data.customers[0];

//         const dobFromApi = customer.bookings?.[0]?.customerDetails?.dob;
//         const formattedDob = dobFromApi ? dobFromApi.split('T')[0] : '';

//         setFormData((prev) => ({
//           ...prev,
//           salutation: customer.bookings?.[0]?.customerDetails?.salutation || '',
//           name: customer.name || '',
//           pan_no: customer.pan || '',
//           address: customer.address || '',
//           taluka: customer.taluka || '',
//           district: customer.district || '',
//           mobile1: customer.mobile1 || '',
//           mobile2: customer.mobile2 || '',
//           aadhar_number: customer.aadhaar || '',
//           pincode: customer.bookings?.[0]?.customerDetails?.pincode || '',
//           dob: formattedDob,
//           occupation: customer.bookings?.[0]?.customerDetails?.occupation || ''
//         }));
//       } else {
//         setSearchError('No customer found with this PAN/Aadhar');
//       }
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchError('Error searching for customer');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleBrokerChange = (e) => {
//     const brokerId = e.target.value;
//     const broker = brokers.find((b) => b._id === brokerId);
//     setSelectedBroker(broker);
//     setFormData((prev) => ({ ...prev, broker_id: brokerId }));
//     setErrors((prev) => ({ ...prev, broker_id: '' }));
//     setOtpSent(false);
//     setOtpVerified(false);
//     setOtp('');
//   };

//   const handleSendOtp = async () => {
//     try {
//       if (!selectedBroker) return;

//       const response = await axiosInstance.post(`/brokers/${selectedBroker._id}/send-otp`);
//       if (response.data.success) {
//         setOtpSent(true);
//         setOtpVerified(false);
//         setOtp('');
//         showFormSubmitToast('OTP sent successfully to broker');
//       } else {
//         showFormSubmitError(response.data.message || 'Failed to send OTP');
//       }
//     } catch (error) {
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       if (!selectedBroker || !otp) return;

//       const response = await axiosInstance.post('/brokers/verify-otp', {
//         brokerId: selectedBroker._id,
//         otp
//       });

//       if (response.data.success) {
//         setOtpVerified(true);
//         setOtpError('');
//         showFormSubmitToast('OTP verified successfully');
//       } else {
//         setOtpError(response.data.message || 'Invalid OTP');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       setOtpError(error.response?.data?.message || 'Error verifying OTP');
//     }
//   };

//   // Enhanced header discount change function with limit validation (only for edit mode)
//   const handleHeaderDiscountChange = (headerId, value, headerCategory, headerPrice) => {
//     // Parse the new discount value
//     const newDiscountValue = value === '' ? '' : parseFloat(value);
    
//     // Get current usage by category
//     const currentUsage = { ...discountUsageByCategory };
    
//     // Calculate what the new usage would be
//     const oldDiscountValue = headerDiscounts[headerId] !== undefined ? 
//       (headerDiscounts[headerId] === '' ? 0 : parseFloat(headerDiscounts[headerId])) : 0;
    
//     const difference = (newDiscountValue === '' ? 0 : newDiscountValue) - oldDiscountValue;
    
//     // Clear any previous error for this header
//     setErrors(prev => ({
//       ...prev,
//       [`discount_${headerId}`]: ''
//     }));
    
//     // Update the discount regardless of limits
//     setHeaderDiscounts(prev => ({
//       ...prev,
//       [headerId]: value
//     }));
    
//     // Recalculate usage after a short delay (only in edit mode)
//     if (isEditMode) {
//       setTimeout(() => {
//         const tab6Headers = getSelectedHeadersForTab6();
//         const newUsage = calculateDiscountUsageByCategory(tab6Headers, {
//           ...headerDiscounts,
//           [headerId]: value
//         });
//         setDiscountUsageByCategory(newUsage);
        
//         // Extract special header values
//         const specialValues = extractSpecialHeaderValues(tab6Headers);
//         setSpecialHeaderValues(specialValues);
        
//         // Calculate remaining percentages based on special header values
//         const maxAddOnAmount = (specialValues.addOnServicesTotal * discountLimits.addOnServices) / 100;
//         const maxAccessoriesAmount = (specialValues.accessoriesTotal * discountLimits.accessories) / 100;
        
//         const remainingAddOnAmount = Math.max(0, maxAddOnAmount - newUsage.AddONservices);
//         const remainingAddOnPercentage = specialValues.addOnServicesTotal > 0 
//           ? ((remainingAddOnAmount / specialValues.addOnServicesTotal) * 100).toFixed(1)
//           : 0;
        
//         const remainingAccessoriesAmount = Math.max(0, maxAccessoriesAmount - newUsage.Accessories);
//         const remainingAccessoriesPercentage = specialValues.accessoriesTotal > 0 
//           ? ((remainingAccessoriesAmount / specialValues.accessoriesTotal) * 100).toFixed(1)
//           : 0;
        
//         setRemainingDiscounts({
//           onRoadPrice: Math.max(0, discountLimits.onRoadPrice - newUsage.vehicle_price),
//           addOnServices: discountLimits.addOnServices,
//           addOnServicesAmount: remainingAddOnAmount,
//           addOnServicesPercentage: remainingAddOnPercentage,
//           accessories: discountLimits.accessories,
//           accessoriesAmount: remainingAccessoriesAmount,
//           accessoriesPercentage: remainingAccessoriesPercentage,
//           totalUsed: newUsage.vehicle_price + newUsage.AddONservices + newUsage.Accessories + newUsage.other
//         });
//       }, 100);
//     }
//   };
//   // ===== END =====

//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${bookingId}`);
//       const bookingData = response.data.data;

//       console.log('=== EDIT MODE: Fetching Booking Details ===');
//       console.log('Booking data rtoCode:', bookingData.rtoCode);
//       console.log('Booking data insuranceFivePlusFive:', bookingData.insuranceFivePlusFive);

//       // Get price components from API
//       const priceComponents = bookingData.priceComponents || [];
//       setBookingPriceComponents(priceComponents);

//       // Extract discounts from API - EXCLUDE subsidy from discounts
//       const apiDiscounts = {};
//       priceComponents.forEach(priceComponent => {
//         if (priceComponent.header && priceComponent.header._id) {
//           const headerKey = priceComponent.header.header_key || '';
          
//           // DO NOT include subsidy amount in discounts for Ex-SHOWROOM header
//           if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)') {
//             // For Ex-SHOWROOM header, only include actual discounts (not subsidy)
//             const discountAmount = priceComponent.discountAmount || 0;
//             apiDiscounts[priceComponent.header._id] = 0; // Don't include subsidy in discounts
//             console.log(`Setting discount to 0 for ${headerKey} (subsidy handled separately)`);
//           } else {
//             const discountAmount = priceComponent.discountAmount || 0;
//             apiDiscounts[priceComponent.header._id] = discountAmount;
//             console.log(`API Discount for ${priceComponent.header.header_key}: ${discountAmount}`);
//           }
//         }
//       });
      
//       console.log('API Discounts extracted (subsidy excluded):', apiDiscounts);
      
//       // Set discounts immediately
//       setHeaderDiscounts(apiDiscounts);

//       // Extract booked header IDs from the API response
//       const bookedHeaderIds = priceComponents
//         .filter(pc => pc.header && pc.header._id)
//         .map(pc => pc.header._id);

//       console.log('Booked headers from API:', bookedHeaderIds);

//       // Get booking verticle
//       const bookingVerticle = bookingData.verticles && bookingData.verticles.length > 0 
//         ? bookingData.verticles[0]._id || bookingData.verticles[0] 
//         : '';

//       // Check if model is EV
//       const isEV = bookingData.model?.type === 'EV';
//       setIsEVModel(isEV);
      
//       // Get subsidy amount from API response - check different possible locations
//       const subsidyAmount = bookingData.subsidy_amount || 
//                            bookingData.subsidyAmount || 
//                            bookingData.model?.subsidy_amount || 
//                            '';

//       console.log('Subsidy amount from API:', subsidyAmount);
//       console.log('Is EV Model:', isEV);
//       console.log('RTO Code from API:', bookingData.rtoCode);

//       // Set form data with subsidy amount and insuranceFivePlusFive
//       const formDataToSet = {
//         verticle_id: bookingVerticle,
//         model_id: bookingData.model?.id || '',
//         model_color: bookingData.color?.id || '',
//         customer_type: bookingData.customerType || 'B2C',
//         rto_type: bookingData.rto || 'MH',
//         branch: bookingData.branch?._id || '',
//         optionalComponents: bookedHeaderIds,
//         sales_executive: bookingData.salesExecutive?._id || '',
//         gstin: bookingData.gstin || '',
//         rto_amount: bookingData.rtoAmount || '',
//         salutation: bookingData.customerDetails?.salutation || '',
//         name: bookingData.customerDetails?.name || '',
//         pan_no: bookingData.customerDetails?.panNo || '',
//         dob: bookingData.customerDetails?.dob?.split('T')[0] || '',
//         occupation: bookingData.customerDetails?.occupation || '',
//         address: bookingData.customerDetails?.address || '',
//         taluka: bookingData.customerDetails?.taluka || '',
//         district: bookingData.customerDetails?.district || '',
//         pincode: bookingData.customerDetails?.pincode || '',
//         mobile1: bookingData.customerDetails?.mobile1 || '',
//         mobile2: bookingData.customerDetails?.mobile2 || '',
//         aadhar_number: bookingData.customerDetails?.aadharNumber || '',
//         nomineeName: bookingData.customerDetails?.nomineeName || '',
//         nomineeRelation: bookingData.customerDetails?.nomineeRelation || '',
//         nomineeAge: bookingData.customerDetails?.nomineeAge || '',
//         type: bookingData.payment?.type?.toLowerCase() || 'cash',
//         financer_id: bookingData.payment?.financer?._id || '',
//         scheme: bookingData.payment?.scheme || '',
//         emi_plan: bookingData.payment?.emiPlan || '',
//         gc_applicable: bookingData.payment?.gcApplicable || false,
//         gc_amount: bookingData.payment?.gcAmount || 0,
//         discountType: bookingData.discounts?.[0]?.type?.toLowerCase() || 'fixed',
//         selected_accessories: bookingData.accessories?.map((a) => a.accessory?._id).filter(Boolean) || [],
//         hpa: bookingData.hpa || false,
//         selfInsurance: bookingData.selfInsurance || false,
//         insuranceFivePlusFive: bookingData.insuranceFivePlusFive || false,
//         is_exchange: bookingData.exchange ? 'true' : 'false',
//         broker_id: bookingData.exchangeDetails?.broker?._id || '',
//         exchange_price: bookingData.exchangeDetails?.price || '',
//         vehicle_number: bookingData.exchangeDetails?.vehicleNumber || '',
//         chassis_number: bookingData.exchangeDetails?.chassisNumber || '',
//         note: bookingData.note || '',
//         uncheckedHeaders: [],
//         uncheckedAccessories: [],
//         // Set subsidy amount from API response
//         subsidy_amount: subsidyAmount,
//         // FIX: Set rto_code from API response - check both camelCase and snake_case
//         rto_code: bookingData.rtoCode || bookingData.rto_code || ''
//       };

//       console.log('Setting form data with subsidy_amount:', formDataToSet.subsidy_amount);
//       console.log('Setting form data with insuranceFivePlusFive:', formDataToSet.insuranceFivePlusFive);
//       console.log('Setting form data with rto_code:', formDataToSet.rto_code);
//       console.log('Setting verticle_id:', bookingVerticle);
//       console.log('Setting optionalComponents:', bookedHeaderIds);
      
//       setFormData(formDataToSet);
//       setIsEditMode(true);

//       setSelectedBranchName(bookingData.branch?.name || '');
//       setModelDetails(bookingData.model || null);
//       setAccessoriesTotal(bookingData.accessoriesTotal || 0);

//       if (bookingData.model) {
//         setModelType(bookingData.model.type);
//         setSelectedModelName(bookingData.model.model_name);
//       }

//       // Fetch models first
//       console.log('Fetching models for edit mode...');
//       await fetchModels(bookingData.customerType, bookingData.branch?._id);

//       if (bookingData.model?.id) {
//         console.log('Model found, fetching model details...');
        
//         // Now fetch the model headers
//         const fetchModelDetails = async () => {
//           try {
//             const modelResponse = await axiosInstance.get(`/models/${bookingData.model.id}`);
//             const modelData = modelResponse.data.data.model;
//             const modelPrices = modelData.prices || [];
            
//             console.log('Model headers fetched:', modelPrices.length);
            
//             // Get all headers from the model
//             const allHeaders = modelPrices
//               .filter(price => price.header && price.header._id)
//               .map(price => price.header._id);
            
//             console.log('All model headers:', allHeaders);
            
//             // Get mandatory headers from the model
//             const mandatoryHeaders = modelPrices
//               .filter(price => price.header && price.header.is_mandatory)
//               .map(price => price.header._id);
            
//             console.log('Mandatory headers:', mandatoryHeaders);
            
//             // For edit mode: unchecked headers are non-mandatory headers that are NOT in bookedHeaderIds
//             const nonMandatoryHeaders = allHeaders.filter(headerId => 
//               !mandatoryHeaders.includes(headerId)
//             );
            
//             const currentOptionalComponents = formDataToSet.optionalComponents || [];
//             const uncheckedHeaders = nonMandatoryHeaders.filter(headerId => 
//               !currentOptionalComponents.includes(headerId)
//             );
            
//             console.log('Unchecked headers in edit mode:', uncheckedHeaders);
            
//             // Update form data with unchecked headers
//             setFormData(prev => ({
//               ...prev,
//               uncheckedHeaders: uncheckedHeaders
//             }));
            
//             setSelectedModelHeaders(modelPrices);
//             setModelDetails(modelData);
            
//             // Set subsidy amount from model data if it's EV
//             if (isEV && modelData.subsidy_amount) {
//               setFormData(prev => ({
//                 ...prev,
//                 subsidy_amount: modelData.subsidy_amount
//               }));
//             }
            
//             // Add any missing headers with 0 discount
//             setHeaderDiscounts(prev => {
//               const updated = { ...prev };
//               modelPrices.forEach(price => {
//                 if (price.header && price.header._id) {
//                   const headerId = price.header._id;
//                   const headerKey = price.header.header_key || '';
                  
//                   // For Ex-SHOWROOM header, ensure it's set to 0 (not subsidy)
//                   if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)') {
//                     updated[headerId] = 0;
//                   } else if (updated[headerId] === undefined) {
//                     updated[headerId] = 0;
//                   }
//                 }
//               });
//               console.log('Updated headerDiscounts after model fetch (subsidy excluded):', updated);
//               return updated;
//             });
            
//           } catch (error) {
//             console.error('Error fetching model details:', error);
//           }
//         };
        
//         // Fetch model details after a short delay
//         setTimeout(fetchModelDetails, 500);
        
//         // Fetch accessories and colors
//         fetchAccessories(bookingData.model.id);
//         fetchModelColors(bookingData.model.id);
//       }
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       const message = showError(error); 
//       if (message) setError(message);
//     }
//   };

//   const getSelectedHeadersForTab6 = () => {
//     if (!formData.model_id) return [];

//     // Get all model headers
//     const allModelHeaders = getSelectedModelHeaders();
    
//     // Apply HPA filter
//     const hpaFiltered = filterHeadersByHPAStatus(allModelHeaders, formData.hpa);
    
//     // Apply insurance filters
//     const insuranceFiltered = filterInsuranceHeaders(hpaFiltered);
    
//     // Filter to show only headers that should be displayed
//     return insuranceFiltered.filter((price) => {
//       if (!price.header || !price.header._id) return false;
      
//       const headerId = price.header._id;
//       const isMandatory = price.header.is_mandatory;
      
//       if (isEditMode) {
//         // In edit mode: show headers that are in optionalComponents (were selected in original booking)
//         return isMandatory || formData.optionalComponents.includes(headerId);
//       } else {
//         // In new booking mode: show headers that are not explicitly unchecked
//         const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//           formData.uncheckedHeaders.includes(headerId);
//         return isMandatory || !isExplicitlyUnchecked;
//       }
//     });
//   };

//   const validateGSTIN = (gstin) => {
//     const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
//     return regex.test(gstin);
//   };

//   const validateTab1 = () => {
//     const requiredFields = ['customer_type', 'verticle_id', 'model_id', 'branch'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });

//     if (formData.customer_type === 'B2B') {
//       if (!formData.gstin) {
//         newErrors.gstin = 'GSTIN is required for B2B customers';
//       } else if (!validateGSTIN(formData.gstin)) {
//         newErrors.gstin = 'Invalid GSTIN format. Please enter a valid 15-digit GST number';
//       }
//     }
//     if ((formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && !formData.rto_amount) {
//       newErrors.rto_amount = 'RTO amount is required';
//     }
//     // Add validation for RTO code when RTO type is MH
//     if (formData.rto_type === 'MH' && !formData.rto_code) {
//       newErrors.rto_code = 'RTO Code is required when RTO type is MH';
//     }

//     // Updated insurance validation - cannot both be true
//     if (formData.selfInsurance === true && formData.insuranceFivePlusFive === true) {
//       newErrors.insurance = 'Self Insurance and Insurance 5+5 cannot both be true';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab2 = () => {
//     const requiredFields = ['model_color', 'sales_executive'];
//     const newErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
//     if (salesExecutives.length === 0 && formData.branch) {
//       newErrors.sales_executive = 'No sales executives available for this branch';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab4 = () => {
//     const newErrors = {};

//     if (!formData.type) {
//       newErrors.type = 'Payment type is required';
//     }

//     if (formData.is_exchange === 'true') {
//       const exchangeFields = ['broker_id', 'exchange_price', 'vehicle_number', 'chassis_number'];
//       exchangeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for exchange';
//         }
//       });
//       if (selectedBroker?.otp_required && !otpVerified) {
//         newErrors.otpVerification = 'OTP verification is required for this broker';
//       }
//       if (brokers.length === 0) {
//         newErrors.broker_id = 'No brokers available for this branch';
//       }
//     }
//     if (formData.type === 'finance') {
//       const financeFields = ['financer_id'];
//       financeFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required for finance';
//         }
//       });
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateTab6 = () => {
//     const newErrors = {};
    
//     Object.entries(headerDiscounts).forEach(([headerId, discountValue]) => {
//       if (discountValue !== '' && discountValue !== null && discountValue !== undefined) {
//         const numValue = parseFloat(discountValue);
//         if (isNaN(numValue) || numValue < 0) {
//           newErrors[`discount_${headerId}`] = 'Discount must be a positive number';
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateMobileNumber = (mobile) => {
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobile);
//   };

//   const validatePAN = (pan) => {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return regex.test(pan);
//   };

//   const validateAadhar = (aadhar) => {
//     const regex = /^\d{12}$/;
//     return regex.test(aadhar);
//   };
  
//   const validatePincode = (pincode) => {
//     const regex = /^\d{6}$/;
//     return regex.test(pincode);
//   };

//   const handleNextTab = () => {
//     if (activeTab === 1) {
//       if (!validateTab1()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 2) {
//       if (!validateTab2()) {
//         return;
//       }
//     } else if (activeTab === 3) {
//       const newErrors = {};
//       const requiredFields = [
//         'salutation',
//         'name',
//         'address',
//         'mobile1',
//         'aadhar_number',
//         'pan_no',
//         'dob',
//         'occupation',
//         'taluka',
//         'district',
//         'pincode',
//         'nomineeName',
//         'nomineeRelation',
//         'nomineeAge'
//       ];

//       requiredFields.forEach((field) => {
//         if (!formData[field]) {
//           newErrors[field] = 'This field is required';
//         }
//       });

//       if (formData.mobile1 && !validateMobileNumber(formData.mobile1)) {
//         newErrors.mobile1 = 'Invalid mobile number';
//       }
//       if (formData.mobile2 && !validateMobileNumber(formData.mobile2)) {
//         newErrors.mobile2 = 'Invalid mobile number';
//       }
//       if (formData.pan_no && !validatePAN(formData.pan_no)) {
//         newErrors.pan_no = 'Invalid PAN number';
//       }
//       if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
//         newErrors.aadhar_number = 'Invalid Aadhar number';
//       }
//       if (formData.pincode && !validatePincode(formData.pincode)) {
//         newErrors.pincode = 'Pincode must be exactly 6 digits';
//       }
//       setErrors(newErrors);
//       if (Object.keys(newErrors).length > 0) {
//         const firstErrorField = Object.keys(newErrors)[0];
//         document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         });
//         return;
//       }
//     } else if (activeTab === 4) {
//       if (!validateTab4()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     } else if (activeTab === 6) {
//       if (!validateTab6()) {
//         const firstErrorField = Object.keys(errors)[0];
//         if (firstErrorField) {
//           document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center'
//           });
//         }
//         return;
//       }
//     }
//     if (activeTab < 6) {
//       setActiveTab((prev) => prev + 1);
//     }
//   };

//   const fetchModels = async (customerType = 'B2C', branchId = null, verticleId = null) => {
//     try {
//       let endpoint = `/models/with-prices?customerType=${customerType}`;

//       if (isSalesExecutive && userData?.branch?._id) {
//         endpoint += `&branch_id=${userData.branch._id}`;
//       } else if (branchId) {
//         endpoint += `&branch_id=${branchId}`;
//       }

//       console.log('Fetching models from endpoint:', endpoint);
//       const response = await axiosInstance.get(endpoint);
//       let modelsData = response.data.data.models || [];
      
//       console.log('Total models fetched:', modelsData.length);

//       // IMPORTANT: First filter by branch, then by verticle
//       if (branchId || (isSalesExecutive && userData?.branch?._id)) {
//         const targetBranchId = branchId || (isSalesExecutive ? userData.branch._id : null);
//         modelsData = modelsData.filter(model => {
//           const modelBranchId = model.branch_id || model.branch;
//           return !modelBranchId || modelBranchId === targetBranchId;
//         });
//         console.log('Models after branch filter:', modelsData.length);
//       }

//       // Then filter by verticle if provided
//       if (verticleId) {
//         modelsData = modelsData.filter(model => 
//           model.verticle_id === verticleId || model.verticle === verticleId
//         );
//         console.log('Models after verticle filter:', modelsData.length);
//       }

//       const processedModels = modelsData.map((model) => {
//         const mandatoryHeaders = model.prices.filter((price) => price.header && price.header.is_mandatory).map((price) => price.header._id);

//         return {
//           ...model,
//           mandatoryHeaders,
//           modelPrices: model.prices.filter((price) => price.header !== null)
//         };
//       });

//       console.log('Final processed models:', processedModels.length);
//       setModels(processedModels);
//       setFilteredModels(processedModels);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchSalesExecutive = async () => {
//       try {
//         const response = await axiosInstance.get('/users');
//         const filteredExecutives = formData.branch
//           ? response.data.data.filter(
//               (user) =>
//                 user.branch === formData.branch &&
//                 user.roles.some((role) => role.name === 'SALES_EXECUTIVE') &&
//                 user.status === 'ACTIVE' &&
//                 !user.isFrozen
//             )
//           : [];

//         setSalesExecutives(filteredExecutives);

//         if (formData.branch && filteredExecutives.length === 0) {
//           setErrors((prev) => ({
//             ...prev,
//             sales_executive: 'No active sales executives available for this branch'
//           }));
//         }
//       } catch (error) {
//         console.error('Error fetching sales executive:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchSalesExecutive();
//   }, [formData.branch]);

//   const fetchModelHeaders = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = response.data.data.model;
//       const prices = modelData.prices || [];

//       // Check if model is EV
//       const isEV = modelData.type === 'EV';
//       setIsEVModel(isEV);

//       // Set subsidy amount from model data only if it's EV
//       if (isEV && modelData.subsidy_amount) {
//         setFormData(prev => ({
//           ...prev,
//           subsidy_amount: modelData.subsidy_amount
//         }));
//       }

//       const selectedModel = models.find((model) => model._id === modelId);
//       const mandatoryHeaders = selectedModel?.mandatoryHeaders || [];
      
//       // Get ALL headers (both mandatory and non-mandatory)
//       const allHeaders = prices
//         .filter(price => price.header && price.header._id)
//         .map(price => price.header._id);

//       // Initialize with ALL headers checked by default
//       setFormData((prev) => ({
//         ...prev,
//         optionalComponents: allHeaders, // Start with ALL headers checked
//         uncheckedHeaders: [] // Clear any previously unchecked headers
//       }));

//       setSelectedModelHeaders(prices);
//       setModelDetails(modelData);

//       const initialDiscounts = {};
//       prices.forEach(price => {
//         let headerId;
        
//         if (price.header && price.header._id) {
//           headerId = price.header._id;
//         } else if (price.header_id) {
//           headerId = price.header_id;
//         } else if (price.headerId) {
//           headerId = price.headerId;
//         }
        
//         if (headerId) {
//           initialDiscounts[headerId] = '';
//         }
//       });
      
//       console.log('Setting initial discounts for new booking:', initialDiscounts);
//       setHeaderDiscounts(initialDiscounts);

//       const accessoriesTotal = calculateAccessoriesTotal(prices);
//       setAccessoriesTotal(accessoriesTotal);
//       fetchModelColors(modelId);
//     } catch (error) {
//       console.error('Failed to fetch model headers:', error);
//       setSelectedModelHeaders([]);
//       setModelDetails(null);
//       setAccessoriesTotal(0);
//       setHeaderDiscounts({});
//       setIsEVModel(false);
//     }
//   };

//   const calculateAccessoriesTotal = (prices) => {
//     if (!prices || !Array.isArray(prices)) return 0;
//     const accessoriesTotalHeader = prices.find((item) => item.header_key === 'ACCESSORIES TOTAL');
//     return accessoriesTotalHeader ? accessoriesTotalHeader.value : 0;
//   };

//   const fetchAccessories = async (modelId) => {
//     try {
//       const modelResponse = await axiosInstance.get(`/models/${modelId}`);
//       const modelData = modelResponse.data.data.model;
//       const modelType = modelData.type;
//       const modelName = modelData.model_name;
      
//       setModelType(modelType);
//       setSelectedModelName(modelName);
      
//       const accessoriesResponse = await axiosInstance.get('/accessories');
//       const allAccessories = accessoriesResponse.data.data.accessories || [];
      
//       const filteredAccessories = allAccessories.filter(accessory => {
//         const typeMatches = accessory.categoryDetails?.type === modelType;
        
//         if (!typeMatches) {
//           return false;
//         }
        
//         if (accessory.applicable_models && accessory.applicable_models.length > 0) {
//           return accessory.applicable_models.includes(modelId);
//         }
        
//         return true;
//       });
      
//       console.log('Filtered accessories for model', modelName, 'type', modelType, ':', filteredAccessories);
      
//       // FIX: In edit mode, we should use the already set selected_accessories from booking data
//       // The formData.selected_accessories is already set from fetchBookingDetails
//       // We just need to update the accessories list
//       setAccessories(filteredAccessories);
      
//     } catch (error) {
//       console.error('Failed to fetch accessories:', error);
//       setAccessories([]);
//     }
//   };

//   const fetchModelColors = async (modelId) => {
//     try {
//       const response = await axiosInstance.get(`colors/model/${modelId}`);
//       setColors(response.data.data.colors || []);
//     } catch (error) {
//       console.error('Failed to fetch model colors:', error);
//       setColors([]);
//     }
//   };

//   useEffect(() => {
//     const fetchBrokers = async () => {
//       try {
//         if (!formData.branch) {
//           setBrokers([]);
//           return;
//         }

//         const response = await axiosInstance.get(`/brokers/branch/${formData.branch}`);
//         setBrokers(response.data.data || []);

//         if (response.data.data.length === 0) {
//           setErrors((prev) => ({
//             ...prev,
//             broker_id: 'No brokers available for this branch'
//           }));
//         }
//       } catch (error) {
//         console.error('Error fetching brokers:', error);
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//         setBrokers([]);
//       }
//     };
//     if (formData.branch && formData.is_exchange === 'true') {
//       fetchBrokers();
//     }
//   }, [formData.branch, formData.is_exchange]);

//   useEffect(() => {
//     const fetchFinancer = async () => {
//       try {
//         // Use the new API endpoint
//         const response = await axiosInstance.get('/financers/rates');
        
//         // Extract financers from the groupedByProvider array
//         const groupedData = response.data.data?.groupedByProvider || [];
        
//         // Transform to array of financer objects for the dropdown with GC rates
//         // FIX: Map through groupedData and create one entry per provider
//         const financersList = groupedData.map(item => ({
//           _id: item.providerId,
//           financeProviderDetails: {
//             _id: item.providerId,
//             name: item.providerName
//           },
//           // For the branch field, we'll store multiple branches or use null
//           // since one provider can serve multiple branches
//           branchRates: item.branchRates || []
//         }));
        
//         console.log('Financers list:', financersList);
//         setFinancers(financersList);
        
//         // If in edit mode and financer is already selected, set the GC rate
//         if (isEditMode && formData.financer_id) {
//           const selectedFinancer = financersList.find(f => f._id === formData.financer_id);
//           if (selectedFinancer) {
//             // Find the rate for the current branch
//             const branchRate = selectedFinancer.branchRates.find(
//               rate => rate.branchId === formData.branch
//             );
//             if (branchRate) {
//               setSelectedFinancerGC(branchRate.gcRate);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching financers:', error);
//         const message = showError(error); 
//         if (message) {
//           setError(message);
//         }
//       }
//     };
//     fetchFinancer();
//   }, [formData.branch, isEditMode, formData.financer_id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox') {
//       setFormData((prevData) => ({ ...prevData, [name]: checked }));
//     } else {
//       if (name === 'hpa' || name === 'selfInsurance') {
//         const booleanValue = value === 'true';
//         setFormData((prevData) => ({
//           ...prevData,
//           [name]: booleanValue
//         }));
        
//         // When HPA changes, also update optionalComponents
//         if (name === 'hpa') {
//           if (!booleanValue) {
//             // If HPA is disabled, remove HP/HPA headers
//             const hpHeaders = getSelectedModelHeaders()
//               .filter(price => price.header && price.header._id)
//               .filter(price => {
//                 const headerKey = price.header.header_key || '';
//                 return headerKey.startsWith('HP') || headerKey.startsWith('HPA');
//               })
//               .map(price => price.header._id);
            
//             setFormData(prev => ({
//               ...prev,
//               optionalComponents: prev.optionalComponents.filter(id => !hpHeaders.includes(id))
//             }));
//           }
//         }
        
//         // When selfInsurance changes, automatically handle insuranceFivePlusFive
//         if (name === 'selfInsurance') {
//           if (booleanValue === true) {
//             // If selfInsurance is true, set insuranceFivePlusFive to false
//             setFormData(prev => ({
//               ...prev,
//               insuranceFivePlusFive: false
//             }));
//           }
//         }
//       } 
//       else if (name === 'insuranceFivePlusFive') {
//         const booleanValue = value === 'true';
//         setFormData((prevData) => ({
//           ...prevData,
//           [name]: booleanValue
//         }));
        
//         // If insuranceFivePlusFive is set to true and selfInsurance is true,
//         // automatically set selfInsurance to false
//         if (booleanValue === true && formData.selfInsurance === true) {
//           setFormData(prev => ({
//             ...prev,
//             selfInsurance: false
//           }));
//         }
        
//         // When insuranceFivePlusFive changes, we need to handle header visibility
//         // The filterInsuranceHeaders function will handle this automatically
//       }
//       else if (name === 'rto_type') {
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
        
//         // Clear RTO code when RTO type changes (unless it's MH)
//         if (value !== 'MH') {
//           setFormData(prev => ({
//             ...prev,
//             rto_code: ''
//           }));
//         } else if (value === 'MH' && !isEditMode) {
//           // Only set default RTO code to MH 15 for NEW bookings
//           // Check if MH 15 exists in rtoCodes
//           const mh15Code = rtoCodes.find(rto => rto.rto_code === 'MH 15');
//           if (mh15Code) {
//             setFormData(prev => ({
//               ...prev,
//               rto_code: 'MH 15'
//             }));
//           }
//         }
//       }
//       else {
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//       }
//     }
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

//     if (name === 'customer_type') {
//       fetchModels(value, formData.branch);
//       if (isSalesExecutive && userData?.branch?._id) {
//         fetchModels(value, userData.branch._id);
//       } else {
//         fetchModels(value, formData.branch);
//       }
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: '',
//         uncheckedHeaders: [], // Reset unchecked headers when customer type changes
//         subsidy_amount: '' // Reset subsidy amount
//       }));
//       setIsEVModel(false);
//     } else if (name === 'verticle_id') {
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: value,
//         model_id: '',
//         model_name: '',
//         uncheckedHeaders: [], // Reset unchecked headers when verticle changes
//         subsidy_amount: '' // Reset subsidy amount
//       }));
//       setIsEVModel(false);

//       if (value) {
//         const filtered = models.filter(model => 
//           model.verticle_id === value || model.verticle === value
//         );
//         setFilteredModels(filtered);
//       } else {
//         setFilteredModels(models);
//       }
//     } else if (name === 'branch' && !isSalesExecutive) {
//       const selectedBranch = branches.find((b) => b._id === value);
//       setSelectedBranchName(selectedBranch ? selectedBranch.name : '');
//       fetchModels(formData.customer_type, value);
//       setFormData((prev) => ({
//         ...prev,
//         verticle_id: '',
//         model_id: '',
//         model_name: '',
//         uncheckedHeaders: [], // Reset unchecked headers when branch changes
//         subsidy_amount: '' // Reset subsidy amount
//       }));
//       setIsEVModel(false);
//     } else if (name === 'financer_id') {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
      
//       // Find the selected financer and set its GC rate for the current branch
//       const selectedFinancer = financers.find(f => f._id === value);
//       if (selectedFinancer && formData.branch) {
//         // Find the rate for the current branch
//         const branchRate = selectedFinancer.branchRates.find(
//           rate => rate.branchId === formData.branch
//         );
//         if (branchRate) {
//           setSelectedFinancerGC(branchRate.gcRate);
//           // Optionally auto-fill the GC amount field
//           setFormData(prev => ({
//             ...prev,
//             gc_amount: branchRate.gcRate || ''
//           }));
//         }
//       }
//     } else if (name === 'model_id') {
//       const selectedModel = models.find((model) => model._id === value);
//       if (selectedModel) {
//         // Check if model type is EV
//         const isEV = selectedModel.type === 'EV';
//         setIsEVModel(isEV);
        
//         setFormData((prev) => ({
//           ...prev,
//           model_name: selectedModel.model_name,
//           model_id: value,
//           // Clear unchecked headers and accessories when model changes
//           uncheckedHeaders: [],
//           uncheckedAccessories: [],
//           // Only set subsidy amount if it's an EV model
//           subsidy_amount: isEV ? (selectedModel.subsidy_amount || '') : ''
//         }));
        
//         setModelType(selectedModel.type);
//         setSelectedModelName(selectedModel.model_name);
        
//         fetchAccessories(value);
//         fetchModelColors(value);
        
//         if (isEditMode) {
//           // For edit mode, keep existing discounts from API
//           const fetchModelForEdit = async () => {
//             try {
//               const response = await axiosInstance.get(`/models/${value}`);
//               const modelData = response.data.data.model;
//               const modelPrices = modelData.prices || [];
              
//               // Set subsidy amount from model data only if it's EV
//               if (isEV && modelData.subsidy_amount) {
//                 setFormData(prev => ({
//                   ...prev,
//                   subsidy_amount: modelData.subsidy_amount
//                 }));
//               }
              
//               setSelectedModelHeaders(modelPrices);
//               setModelDetails(modelData);
              
//               // Don't overwrite discounts - just add missing ones
//               setHeaderDiscounts(prev => {
//                 const updated = { ...prev };
//                 modelPrices.forEach(price => {
//                   if (price.header && price.header._id) {
//                     const headerId = price.header._id;
//                     if (updated[headerId] === undefined) {
//                       updated[headerId] = 0;
//                     }
//                   }
//                 });
//                 return updated;
//               });
//             } catch (error) {
//               console.error('Error fetching model for edit:', error);
//             }
//           };
//           fetchModelForEdit();
//         } else {
//           fetchModelHeaders(value);
//         }
//       }
//     }
//   };

//   const getSelectedModelHeaders = () => {
//     if (!formData.model_id) return [];

//     const selectedModel = models.find((model) => model._id === formData.model_id);
//     const allHeaders = selectedModel?.modelPrices || [];
    
//     // Apply HPA filter
//     return filterHeadersByHPAStatus(allHeaders, formData.hpa);
//   };

//   const handleHeaderSelection = (headerId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         // When checking: remove from uncheckedHeaders and add to optionalComponents
//         return {
//           ...prev,
//           uncheckedHeaders: prev.uncheckedHeaders.filter((id) => id !== headerId),
//           optionalComponents: [...(prev.optionalComponents || []), headerId]
//         };
//       } else {
//         // When unchecking: add to uncheckedHeaders and remove from optionalComponents
//         return {
//           ...prev,
//           uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId],
//           optionalComponents: prev.optionalComponents.filter((id) => id !== headerId)
//         };
//       }
//     });
//   };

//   const getAccessoryPriceToShow = (accessory) => {
//     // Get the header key from categoryDetails
//     const headerKey = accessory.categoryDetails?.header_key;
    
//     if (!headerKey) {
//       return accessory.price;
//     }
    
//     // Find the corresponding header price for this accessory
//     const matchingHeader = getSelectedModelHeaders().find(
//       (price) => price.header?.header_key === headerKey
//     );
    
//     if (!matchingHeader) {
//       return accessory.price;
//     }
    
//     const headerPrice = matchingHeader.value || 0;
//     const accessoryPrice = accessory.price || 0;
    
//     // Return whichever is higher
//     return Math.max(headerPrice, accessoryPrice);
//   };

//   const hasAccessoryHigherPrice = (accessory) => {
//     const headerKey = accessory.categoryDetails?.header_key;
    
//     if (!headerKey) {
//       return false;
//     }
    
//     const matchingHeader = getSelectedModelHeaders().find(
//       (price) => price.header?.header_key === headerKey
//     );
    
//     if (!matchingHeader) {
//       return false;
//     }
    
//     const headerPrice = matchingHeader.value || 0;
//     const accessoryPrice = accessory.price || 0;
    
//     return accessoryPrice > headerPrice;
//   };

//   const handleAccessorySelection = (accessoryId, isChecked) => {
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           selected_accessories: [...prev.selected_accessories, accessoryId]
//         };
//       } else {
//         return {
//           ...prev,
//           selected_accessories: prev.selected_accessories.filter((id) => id !== accessoryId)
//         };
//       }
//     });
//   };

//   const calculateTaxableAmount = (unitCost, discount, gstRate, customerType) => {
//     const netAmount = unitCost - (discount || 0);
//     const gstRateDecimal = gstRate / 100;
    
//     if (customerType === 'CSD') {
//       return netAmount;
//     }
    
//     if (gstRateDecimal === 0) {
//       return netAmount;
//     }
    
//     return netAmount / (1 + gstRateDecimal);
//   };

//   const calculateGST = (taxable, gstRate, customerType) => {
//     if (customerType === 'CSD') {
//       const halfRate = gstRate / 2;
//       const cgstAmount = 0;
//       const sgstAmount = taxable * (halfRate / 100);
//       return { cgstAmount, sgstAmount, halfRate, cgstRate: 0, sgstRate: halfRate };
//     }
    
//     const halfRate = gstRate / 2;
//     const cgstAmount = taxable * (halfRate / 100);
//     const sgstAmount = taxable * (halfRate / 100);
//     return { cgstAmount, sgstAmount, halfRate, cgstRate: halfRate, sgstRate: halfRate };
//   };

//   const calculateLineTotal = (taxable, cgstAmount, sgstAmount) => {
//     return taxable + cgstAmount + sgstAmount;
//   };

//   // Calculate total deal amount - Exclude specific headers and include accessories with higher prices
//   const calculateTotalDealAmount = () => {
//     const selectedHeaders = getSelectedHeadersForTab6()
//       .filter((price) => price.header && price.header._id)
//       .filter((price) => {
//         // EXCLUDE these specific summary/total headers
//         const excludedHeaders = [
//           'ON ROAD PRICE (A)',
//           'TOTAL ONROAD + ADDON SERVICES',
//           'TOTAL ONROAD+ADDON SERVICES',
//           'ADDON SERVICES TOTAL (B)',
//           'ACCESSORIES TOTAL',
//           'ON ROAD PRICE',
//           'ADDON SERVICES TOTAL',
//           'ADD ON SERVICES TOTAL',
//           'TOTAL AMOUNT',
//           'GRAND TOTAL',
//           'FINAL AMOUNT',
//           'TOTAL',
//           'ON-ROAD PRICE',
//           'FINAL PRICE',
//           'LESS:- CENTER SUBSIDY(FAME-II)',
//           'COMPLETE PRICE'
//         ];
        
//         const headerKey = price.header.header_key || '';
//         return !excludedHeaders.includes(headerKey);
//       });

//     let totalBeforeDiscount = 0;
//     let totalDiscount = 0;
//     let subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
    
//     console.log('Selected headers for total calculation:', selectedHeaders.length);
//     console.log('Accessories count:', accessories.length);
//     console.log('Subsidy amount:', subsidyAmount);
//     console.log('Is EV Model:', isEVModel);
    
//     // Calculate ORIGINAL total (without any discounts)
//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const headerKey = header.header_key;
      
//       // Find matching accessories for this header
//       const selectedMatchingAccessories = accessories.filter(accessory => 
//         accessory.categoryDetails?.header_key === header.header_key &&
//         (isEditMode ? 
//           formData.selected_accessories.includes(accessory._id) : // In edit mode
//           !formData.uncheckedAccessories?.includes(accessory._id) // In new mode
//         )
//       );

//       // Get TOTAL accessory price (SUM of all selected accessories for this header)
//       const accessoryPrice = selectedMatchingAccessories.length > 0 
//         ? selectedMatchingAccessories.reduce((sum, acc) => sum + (acc.price || 0), 0)
//         : 0;
      
//       // Use whichever is higher: header price or accessory price
//       const unitPrice = Math.max(price.value || 0, accessoryPrice);
      
//       const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
      
//       // Calculate original line total WITHOUT discount
//       const taxable = calculateTaxableAmount(unitPrice, 0, gstRate, formData.customer_type);
//       const { cgstAmount, sgstAmount } = calculateGST(taxable, gstRate, formData.customer_type);
//       const originalLineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
      
//       totalBeforeDiscount += originalLineTotal;
//     });
    
//     // Calculate total discounts from headerDiscounts ONLY (separate from subsidy)
//     selectedHeaders.forEach((price) => {
//       const header = price.header;
//       const headerId = header._id || header.id;
//       const discountValue = headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : 0;
//       const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
      
//       totalDiscount += discountAmount;
//     });

//     let finalTotal = totalBeforeDiscount - totalDiscount;
    
//     // Apply subsidy deduction SEPARATELY (not as discount) for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
//     const exShowroomHeader = selectedHeaders.find(price => 
//       price.header.header_key === 'Ex-SHOWROOM(INCLUDING 5% GST)'
//     );
    
//     if (exShowroomHeader && subsidyAmount > 0 && isEVModel) {
//       console.log(`Applying subsidy amount of ₹${subsidyAmount} SEPARATELY (not as discount) to Ex-SHOWROOM header (EV Model)`);
//       finalTotal -= subsidyAmount;
//     }

//     console.log('Total calculation:', {
//       totalBeforeDiscount,
//       totalDiscount,
//       subsidyAmount,
//       finalTotal,
//       isEVModel
//     });

//     return {
//       totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
//       totalAfterDiscount: finalTotal.toFixed(2),
//       totalDiscount: totalDiscount.toFixed(2), // This is only actual discounts
//       subsidyAmount: subsidyAmount.toFixed(2), // This is subsidy (separate from discounts)
//       hasDiscount: totalDiscount > 0,
//       hasSubsidy: subsidyAmount > 0
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const requiredFields = ['verticle_id', 'model_id', 'model_color', 'branch', 'customer_type', 'name', 'address', 'mobile1', 'aadhar_number', 'pan_no'];
//     let formErrors = {};

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         formErrors[field] = 'This field is required';
//       }
//     });

//     if (!formData.verticle_id) {
//       formErrors.verticle_id = 'Verticle selection is required';
//     }

//     // Add RTO code validation for MH
//     if (formData.rto_type === 'MH' && !formData.rto_code) {
//       formErrors.rto_code = 'RTO Code is required when RTO type is MH';
//     }

//     // Updated insurance validation - cannot both be true
//     if (formData.selfInsurance === true && formData.insuranceFivePlusFive === true) {
//       formErrors.insurance = 'Self Insurance and Insurance 5+5 cannot both be true';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       const firstErrorField = Object.keys(formErrors)[0];
//       document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center'
//       });
//       return;
//     }

//     console.log('=== SUBMITTING BOOKING ===');
//     console.log('Current optionalComponents:', formData.optionalComponents);
//     console.log('Current uncheckedHeaders:', formData.uncheckedHeaders);
//     console.log('Current headerDiscounts:', headerDiscounts);
//     console.log('Subsidy amount:', formData.subsidy_amount);
//     console.log('RTO Code:', formData.rto_code);
//     console.log('Is EV Model:', isEVModel);
//     console.log('Self Insurance:', formData.selfInsurance);
//     console.log('Insurance 5+5:', formData.insuranceFivePlusFive);

//     // FIX 1: Proper headers logic for edit mode
//     let headersToSubmit = [];
//     if (isEditMode) {
//       // In edit mode: Use the existing optionalComponents (already contains booked headers)
//       // But remove any that are now explicitly unchecked
//       headersToSubmit = formData.optionalComponents.filter(headerId => 
//         !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
//       );
//     } else {
//       // For new bookings: include all headers except explicitly unchecked ones
//       const allHeaders = getSelectedHeadersForTab6()
//         .filter(price => price.header && price.header._id)
//         .map(price => price.header._id);
      
//       headersToSubmit = allHeaders.filter(headerId => 
//         !formData.uncheckedHeaders || !formData.uncheckedHeaders.includes(headerId)
//       );
//     }

//     console.log('Headers to submit:', headersToSubmit);
//     console.log('Number of headers:', headersToSubmit.length);

//     // FIX 2: Prepare header discounts including existing discounts from edit mode
//     const headerDiscountsArray = Object.entries(headerDiscounts)
//       .filter(([headerId, value]) => {
//         // Only include discounts for headers that are actually selected
//         const isSelected = headersToSubmit.includes(headerId);
//         const hasDiscount = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value)) && parseFloat(value) !== 0;
        
//         // Also check if this is the Ex-SHOWROOM header with subsidy
//         const header = getSelectedHeadersForTab6().find(p => p.header && (p.header._id === headerId || p.header.id === headerId));
//         const isExShowroomWithSubsidy = header && header.header.header_key === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel;
        
//         console.log(`Header ${headerId}: isSelected=${isSelected}, hasDiscount=${hasDiscount}, value=${value}`);
        
//         // If it's Ex-SHOWROOM with subsidy, don't include any discount (subsidy is separate)
//         if (isExShowroomWithSubsidy) {
//           return false;
//         }
        
//         return isSelected && hasDiscount;
//       })
//       .map(([headerId, value]) => ({
//         headerId,
//         discountAmount: parseFloat(value) || 0
//       }));

//     console.log('Header discounts to submit:', headerDiscountsArray);

//     // FIX 3: Proper accessories logic for edit mode
//     let accessoriesToSubmit = [];
//     if (isEditMode) {
//       // In edit mode: Use selected_accessories but remove any that are explicitly unchecked
//       accessoriesToSubmit = formData.selected_accessories.filter(accessoryId => 
//         !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
//       );
//     } else {
//       // For new bookings
//       const allAccessoryIds = accessories.map(accessory => accessory._id);
//       accessoriesToSubmit = allAccessoryIds.filter(accessoryId => 
//         !formData.uncheckedAccessories || !formData.uncheckedAccessories.includes(accessoryId)
//       );
//     }

//     const accessoriesArray = accessoriesToSubmit.map((id) => ({ id }));
//     console.log('Accessories to submit:', accessoriesArray);

//     // Prepare exchange details
//     const exchangeDetails = {
//       is_exchange: formData.is_exchange === 'true',
//       ...(formData.is_exchange === 'true' && {
//         broker_id: formData.broker_id,
//         exchange_price: formData.exchange_price ? parseFloat(formData.exchange_price) : 0,
//         vehicle_number: formData.vehicle_number || '',
//         chassis_number: formData.chassis_number || '',
//         ...(selectedBroker?.otp_required && otpVerified && { otp })
//       })
//     };

//     console.log('Exchange details:', exchangeDetails);

//     // Prepare payment details
//     const paymentDetails = {
//       type: formData.type.toUpperCase(),
//       ...(formData.type.toLowerCase() === 'finance' && {
//         financer_id: formData.financer_id,
//         scheme: formData.scheme || '',
//         emi_plan: formData.emi_plan || '',
//         gc_applicable: formData.gc_applicable,
//         gc_amount: formData.gc_applicable ? parseFloat(formData.gc_amount) || 0 : 0
//       })
//     };

//     console.log('Payment details:', paymentDetails);

//     // Prepare customer details
//     const customerDetails = {
//       salutation: formData.salutation,
//       name: formData.name,
//       pan_no: formData.pan_no,
//       dob: formData.dob,
//       occupation: formData.occupation,
//       address: formData.address,
//       taluka: formData.taluka,
//       district: formData.district,
//       pincode: formData.pincode,
//       mobile1: formData.mobile1,
//       mobile2: formData.mobile2 || '',
//       aadhar_number: formData.aadhar_number,
//       nomineeName: formData.nomineeName,
//       nomineeRelation: formData.nomineeRelation,
//       nomineeAge: formData.nomineeAge ? parseInt(formData.nomineeAge) : undefined
//     };

//     // Build the complete request body
//     const requestBody = {
//       model_id: formData.model_id,
//       model_color: formData.model_color,
//       customer_type: formData.customer_type,
//       rto_type: formData.rto_type,
//       branch: formData.branch,
//       verticles: formData.verticle_id ? [formData.verticle_id] : [],
//       optionalComponents: headersToSubmit,
//       sales_executive: formData.sales_executive,
//       customer_details: customerDetails,
//       payment: paymentDetails,
//       headerDiscounts: headerDiscountsArray,
//       accessories: {
//         selected: accessoriesArray
//       },
//       hpa: formData.hpa === true,
//       selfInsurance: formData.selfInsurance === true,
//       insuranceFivePlusFive: formData.insuranceFivePlusFive === true,
//       exchange: exchangeDetails,
//       note: formData.note || '',
//       // Include RTO code when RTO type is MH
//       ...(formData.rto_type === 'MH' && formData.rto_code && { rto_code: formData.rto_code }),
//       // Only include subsidy amount if it's an EV model
//       ...(isEVModel && { subsidy_amount: formData.subsidy_amount ? parseFloat(formData.subsidy_amount) : 0 })
//     };

//     // Add conditional fields
//     if (formData.customer_type === 'B2B') {
//       requestBody.gstin = formData.gstin;
//     }
    
//     if (formData.rto_type === 'BH' || formData.rto_type === 'CRTM') {
//       requestBody.rto_amount = formData.rto_amount;
//     }

//     console.log('=== FINAL REQUEST BODY ===');
//     console.log('optionalComponents being sent:', requestBody.optionalComponents);
//     console.log('Number of optionalComponents:', requestBody.optionalComponents.length);
//     console.log('Header discounts being sent:', requestBody.headerDiscounts);
//     console.log('Number of discounts:', requestBody.headerDiscounts.length);
//     console.log('RTO Code being sent:', formData.rto_type === 'MH' ? requestBody.rto_code : 'N/A (Not MH RTO)');
//     console.log('Subsidy amount being sent:', isEVModel ? requestBody.subsidy_amount : 'N/A (Not EV model)');
//     console.log('Self Insurance being sent:', requestBody.selfInsurance);
//     console.log('Insurance 5+5 being sent:', requestBody.insuranceFivePlusFive);
//     console.log('Full request body:', JSON.stringify(requestBody, null, 2));

//     try {
//       let response;
//       if (isEditMode) {
//         console.log(`Updating booking with ID: ${id}`);
//         response = await axiosInstance.put(`/bookings/${id}`, requestBody);
//       } else {
//         console.log('Creating new booking');
//         response = await axiosInstance.post('/bookings', requestBody);
//       }

//       console.log('API Response:', response.data);

//       if (response.data.success) {
//         const successMessage = isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
//         console.log('Success:', successMessage);
//         await showFormSubmitToast(successMessage, () => navigate('/booking-list'));
//         navigate('/booking-list');
//       } else {
//         console.error('Submission failed:', response.data);
//         showFormSubmitError(response.data.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       console.error('Error response:', error.response?.data);
//       const message = showError(error); 
//       if (message) setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const debugHeaderDiscounts = () => {
//     console.log('Current headerDiscounts:', headerDiscounts);
//     console.log('Current formData.model_id:', formData.model_id);
//     console.log('Current models:', models);
//   };

//   if (loadingUser) {
//     return <div>Loading user data...</div>;
//   }

//   // Calculate totals
//   const dealTotals = calculateTotalDealAmount();

//   return (
//     <div className="form-container">
//       <div className="title">{isEditMode ? 'Edit Booking' : 'Create New Booking'}</div>
//       {error && <CAlert color="danger">{error}</CAlert>}
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit} id="bookingForm">
//             {activeTab === 1 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Customer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="B2B">B2B</option>
//                         <option value="B2C">B2C</option>
//                         {/* Show CSD option only if user has CSD access AND is not a sales executive */}
//                         {hasCSDAccess && !isSalesExecutive && <option value="CSD">CSD</option>}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.customer_type && <p className="error">{errors.customer_type}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Branch</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       {isSalesExecutive && userData?.branch ? (
//                         <CFormInput 
//                           value={`${userData.branch.name} - ${userData.branch.branch_city || userData.branch.city}`} 
//                           readOnly 
//                         />
//                       ) : (
//                         <CFormSelect name="branch" value={formData.branch} onChange={handleChange}>
//                           <option value="">-Select-</option>
//                           {branches.map((branch) => (
//                             <option key={branch._id} value={branch._id}>
//                               {branch.name} - {branch.branch_city || branch.city}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       )}
//                     </CInputGroup>
//                     {errors.branch && <p className="error">{errors.branch}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Verticle</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilInstitution} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="verticle_id" 
//                         value={formData.verticle_id} 
//                         onChange={handleChange}
//                         disabled={userVerticles.length === 0}
//                       >
//                         <option value="">- Select Verticle -</option>
//                         {userVerticles.length > 0 ? (
//                           userVerticles
//                             .filter(vertical => vertical.status === 'active')
//                             .map((vertical) => (
//                               <option key={vertical._id} value={vertical._id}>
//                                 {vertical.name}
//                               </option>
//                             ))
//                         ) : (
//                           <option value="" disabled>
//                             No verticles assigned to your account
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//                     {userVerticles.filter(v => v.status === 'active').length === 0 && (
//                       <small className="text-muted">No active verticles available. Please contact administrator.</small>
//                     )}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Model Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <div style={{ flex: 1 }}>
//                         <Select
//                           name="model_id"
//                           isDisabled={!formData.branch || !formData.verticle_id}
//                           placeholder={
//                             !formData.branch ? "Select branch first" :
//                             !formData.verticle_id ? "Select verticle first" :
//                             filteredModels.length === 0 ? "No models available" :
//                             "Search Model"
//                           }
//                           value={
//                             filteredModels.find((m) => m._id === formData.model_id)
//                               ? {
//                                   label: filteredModels.find(
//                                     (m) => m._id === formData.model_id
//                                   ).model_name,
//                                   value: formData.model_id,
//                                 }
//                               : null
//                           }
//                           onChange={(selected) =>
//                             handleChange({
//                               target: {
//                                 name: "model_id",
//                                 value: selected ? selected.value : "",
//                               },
//                             })
//                           }
//                           options={
//                             filteredModels.length > 0
//                               ? filteredModels.map((model) => ({
//                                   label: model.model_name,
//                                   value: model._id,
//                                 }))
//                               : []
//                           }
//                           noOptionsMessage={() => {
//                             if (!formData.branch) return "Please select a branch first";
//                             if (!formData.verticle_id) return "Please select a verticle first";
//                             return "No models available for this branch and verticle";
//                           }}
//                           classNamePrefix="react-select"
//                           className={`react-select-container ${
//                             errors.model_id ? "error-input" : formData.model_id ? "valid-input" : ""
//                           }`}
//                         />
//                       </div>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>

//                   {formData.customer_type === 'B2B' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">GST Number</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBarcode} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.gstin && <p className="error">{errors.gstin}</p>}
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">RTO</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCarAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="rto_type" value={formData.rto_type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="MH">MH</option>
//                         <option value="BH">BH</option>
//                         <option value="CRTM">CRTM</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {/* Show RTO Code dropdown only when RTO type is MH */}
//                   {formData.rto_type === 'MH' && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Code</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilCarAlt} />
//                         </CInputGroupText>
//                         <CFormSelect 
//                           name="rto_code" 
//                           value={formData.rto_code} 
//                           onChange={handleChange}
//                           disabled={loadingRtoCodes}
//                         >
//                           <option value="">-Select RTO Code-</option>
//                           {loadingRtoCodes ? (
//                             <option value="" disabled>Loading RTO codes...</option>
//                           ) : rtoCodes.length > 0 ? (
//                             rtoCodes.map((rto) => (
//                               <option key={rto.id} value={rto.rto_code}>
//                                 {rto.rto_code} - {rto.rto_name}
//                               </option>
//                             ))
//                           ) : (
//                             <option value="" disabled>No RTO codes available</option>
//                           )}
//                         </CFormSelect>
//                       </CInputGroup>
//                       {errors.rto_code && <p className="error">{errors.rto_code}</p>}
//                       {loadingRtoCodes && <small className="text-muted">Loading RTO codes...</small>}
//                     </div>
//                   )}

//                   {(formData.rto_type === 'BH' || formData.rto_type === 'CRTM') && (
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">RTO Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput type="text" name="rto_amount" value={formData.rto_amount} onChange={handleChange} />
//                       </CInputGroup>
//                       {errors.rto_amount && <p className="error">{errors.rto_amount}</p>}
//                     </div>
//                   )}

//                   {/* Subsidy Amount Field - Only show for EV models */}
//                   {isEVModel && (
//                     <div className="input-box">
//                       <span className="details">Subsidy Amount</span>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilMoney} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="text" 
//                           name="subsidy_amount" 
//                           value={formData.subsidy_amount} 
//                           onChange={handleChange}
//                           disabled={true}
//                           placeholder="Auto-filled for EV models"
//                         />
//                       </CInputGroup>
//                       <small className="text-muted">Subsidy applicable for EV models only</small>
//                     </div>
//                   )}

//                   <div className="input-box">
//                     <span className="details">HPA Applicable</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="hpa" value={formData.hpa} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Self Insurance</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect name="selfInsurance" value={formData.selfInsurance} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {/* Insurance 5+5 Field - Show always */}
//                   <div className="input-box">
//                     <span className="details">Insurance 5+5</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilShieldAlt} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="insuranceFivePlusFive" 
//                         value={formData.insuranceFivePlusFive} 
//                         onChange={handleChange}
//                       >
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                   </div>

//                   {/* Insurance validation error message */}
//                   {errors.insurance && (
//                     <div className="input-box" style={{ width: '100%' }}>
//                       <p className="error" style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
//                         {errors.insurance}
//                       </p>
//                     </div>
//                   )}

//                   {/* Insurance status message */}
//                   {formData.selfInsurance === true && 
//                     formData.insuranceFivePlusFive === true && (
//                       <div className="input-box" style={{ width: '100%' }}>
//                         <p className="error" style={{ color: '#dc3545', fontSize: '0.9em' }}>
//                           Both Self Insurance and Insurance 5+5 cannot be selected together
//                         </p>
//                       </div>
//                     )
//                   }
//                 </div>

//               {getSelectedModelHeaders().length > 0 && (
//                 <div className="model-headers-section">
//                   <h5>
//                     Model Options 
//                     {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
//                       (HPA-related options hidden as HPA is disabled)
//                     </span>}
//                     {formData.selfInsurance === true && <span style={{ color: '#28a745', fontSize: '0.9em', marginLeft: '10px' }}>
//                       (Insurance headers hidden as Self Insurance is enabled)
//                     </span>}
//                     {formData.selfInsurance === false && formData.insuranceFivePlusFive === true && <span style={{ color: '#ffc107', fontSize: '0.9em', marginLeft: '10px' }}>
//                       (INSURANCE CHARGES header hidden for Insurance 5+5, Insurance: 5 + 5 Years shown)
//                     </span>}
//                     {formData.selfInsurance === false && formData.insuranceFivePlusFive === false && <span style={{ color: '#6c757d', fontSize: '0.9em', marginLeft: '10px' }}>
//                       (Standard insurance - INSURANCE CHARGES shown)
//                     </span>}
//                   </h5>
//                   <div className="headers-list">
//                     {getSelectedModelHeaders()
//                       .filter((price) => {
//                         // Apply insurance filters here as well
//                         const headerKey = price.header?.header_key || '';
                        
//                         // Case 1: Self Insurance is true - hide all insurance headers
//                         if (formData.selfInsurance === true) {
//                           if (headerKey.includes('INSURANCE') || 
//                               headerKey === 'INSURANCE' || 
//                               headerKey === 'INSURANCE CHARGES' || 
//                               headerKey === 'Insurance: 5 + 5 Years') {
//                             return false;
//                           }
//                         }
                        
//                         // Case 2: Insurance 5+5 is true and Self Insurance is false - 
//                         // Show Insurance: 5 + 5 Years, hide INSURANCE CHARGES
//                         if (formData.selfInsurance === false && formData.insuranceFivePlusFive === true) {
//                           if (headerKey === 'INSURANCE CHARGES') {
//                             return false;
//                           }
//                           // Insurance: 5 + 5 Years should be shown
//                           return true;
//                         }
                        
//                         // Case 3: Both Self Insurance and Insurance 5+5 are false - 
//                         // Show INSURANCE CHARGES, hide Insurance: 5 + 5 Years
//                         if (formData.selfInsurance === false && formData.insuranceFivePlusFive === false) {
//                           if (headerKey === 'Insurance: 5 + 5 Years') {
//                             return false;
//                           }
//                           // INSURANCE CHARGES should be shown
//                           return true;
//                         }
                        
//                         return true;
//                       })
//                       .filter((price) => price.header && price.header._id)
//                       .map((price) => {
//                         const header = price.header;
//                         const isMandatory = header.is_mandatory;
//                         const headerId = header._id;
//                         const headerKey = header.header_key || '';
                        
//                         // Check if this is an HPA-related header
//                         const isHPAHeader = headerKey.startsWith('HP') || 
//                                             headerKey.startsWith('HPA') ||
//                                             headerKey.toLowerCase().includes('hypothecation') ||
//                                             headerKey.toLowerCase().includes('loan');
                        
//                         // Determine if header should be shown based on HPA status
//                         const shouldShowHeader = formData.hpa || !isHPAHeader;
                        
//                         if (!shouldShowHeader) {
//                           return null; // Skip rendering this header
//                         }
                        
//                         let isChecked;
//                         if (isEditMode) {
//                           isChecked = isMandatory || formData.optionalComponents.includes(headerId);
//                         } else {
//                           const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                             formData.uncheckedHeaders.includes(headerId);
//                           isChecked = isMandatory || !isExplicitlyUnchecked;
//                         }

//                         return (
//                           <div key={headerId} className="header-item">
//                             <CFormCheck
//                               id={`header-${headerId}`}
//                               label={`${header.header_key} (₹${price.value}) ${isMandatory ? '(Mandatory)' : '(Optional)'} ${isHPAHeader ? '(HPA-related)' : ''}`}
//                               checked={isChecked}
//                               onChange={(e) => {
//                                 if (!isMandatory) {
//                                   const isNowChecked = e.target.checked;
//                                   if (!isNowChecked) {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       uncheckedHeaders: [...(prev.uncheckedHeaders || []), headerId],
//                                       optionalComponents: prev.optionalComponents.filter(id => id !== headerId)
//                                     }));
//                                   } else {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       uncheckedHeaders: prev.uncheckedHeaders?.filter(id => id !== headerId) || [],
//                                       optionalComponents: [...prev.optionalComponents, headerId]
//                                     }));
//                                   }
//                                 }
//                               }}
//                               disabled={isMandatory}
//                             />
//                             {isMandatory && <input type="hidden" name={`mandatory-${headerId}`} value={headerId} />}
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </div>
//               )}

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 2 && (
//   <>
//     <div className="user-details">
//       <div className="input-box">
//         <div className="details-container">
//           <span className="details">Verticle</span>
//           <span className="required">*</span>
//         </div>
//         <CInputGroup>
//           <CInputGroupText className="input-icon">
//             <CIcon icon={cilInstitution} />
//           </CInputGroupText>
//           <CFormSelect 
//             name="verticle_id" 
//             value={formData.verticle_id} 
//             onChange={handleChange}
//             disabled={userVerticles.length === 0 || isEditMode}
//           >
//             <option value="">- Select Verticle -</option>
//             {userVerticles.length > 0 ? (
//               userVerticles
//                 .filter(vertical => vertical.status === 'active')
//                 .map((vertical) => (
//                   <option key={vertical._id} value={vertical._id}>
//                     {vertical.name}
//                   </option>
//                 ))
//             ) : (
//               <option value="" disabled>
//                 No verticles assigned to your account
//               </option>
//             )}
//           </CFormSelect>
//         </CInputGroup>
//         {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
//       </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Vehicle Model</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBike} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="model_id" 
//                         value={formData.model_id} 
//                         onChange={handleChange} 
//                         disabled={isEditMode || !formData.verticle_id}
//                       >
//                         <option value="">- Select a Model -</option>
//                         {filteredModels.length > 0 ? (
//                           filteredModels.map((model) => (
//                             <option key={model._id} value={model._id}>
//                               {model.model_name}
//                             </option>
//                           ))
//                         ) : formData.verticle_id ? (
//                           <option value="" disabled>
//                             No models available for this verticle
//                           </option>
//                         ) : (
//                           <option value="" disabled>
//                             Please select a verticle first
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_id && <p className="error">{errors.model_id}</p>}
//                   </div>
                  
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Color</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPaint} />
//                       </CInputGroupText>
//                       <CFormSelect name="model_color" value={formData.model_color || ''} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         {colors.map((color) => (
//                           <option key={color._id} value={color.id}>
//                             {color.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.model_color && <p className="error">{errors.model_color}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Booking Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" value={formData.booking_date || new Date().toISOString().split('T')[0]} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Sales Executive</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect
//                         name="sales_executive"
//                         value={formData.sales_executive || ''}
//                         onChange={handleChange}
//                         disabled={salesExecutives.length === 0}
//                       >
//                         <option value="">-Select-</option>
//                         {salesExecutives.length > 0 ? (
//                           salesExecutives.map((sales) => (
//                             <option key={sales._id} value={sales._id}>
//                               {sales.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option value="" disabled>
//                             No sales executives available for this branch
//                           </option>
//                         )}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.sales_executive && <p className="error">{errors.sales_executive}</p>}
//                   </div>
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(1)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 3 && (
//               <>
//                 <div
//                   className="search-section"
//                   style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
//                 >
//                   <h5>Search Existing Customer</h5>
//                   <div className="user-details">
//                     <div className="input-box">
//                       <span className="details">Search by PAN or Aadhar</span>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilSearch} />
//                         </CInputGroupText>
//                         <CFormInput
//                           placeholder="Enter PAN or Aadhar number"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <CButton color="primary" onClick={handleCustomerSearch}>
//                           Search
//                         </CButton>
//                       </CInputGroup>
//                       {searchError && <p className="error">{searchError}</p>}
//                       {searchLoading && <p>Searching...</p>}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Salutation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect name="salutation" value={formData.salutation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Mr.">Mr.</option>
//                         <option value="Mrs.">Mrs.</option>
//                         <option value="Miss">Miss</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.salutation && <p className="error">{errors.salutation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Full Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="name" value={formData.name} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.name && <p className="error">{errors.name}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Address</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilHome} />
//                       </CInputGroupText>
//                       <CFormInput name="address" value={formData.address} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.address && <p className="error">{errors.address}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Taluka</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="taluka" value={formData.taluka} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.taluka && <p className="error">{errors.taluka}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">District</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilMap} />
//                       </CInputGroupText>
//                       <CFormInput name="district" value={formData.district} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.district && <p className="error">{errors.district}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Pin Code</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilEnvelopeClosed} />
//                       </CInputGroupText>
//                       <CFormInput name="pincode" value={formData.pincode} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pincode && <p className="error">{errors.pincode}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Contact Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile1" value={formData.mobile1} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.mobile1 && <p className="error">{errors.mobile1}</p>}
//                   </div>

//                   <div className="input-box">
//                     <span className="details">Alternate Contact Number</span>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPhone} />
//                       </CInputGroupText>
//                       <CFormInput name="mobile2" value={formData.mobile2} onChange={handleChange} />
//                     </CInputGroup>
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Aadhaar Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilFingerprint} />
//                       </CInputGroupText>
//                       <CFormInput name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.aadhar_number && <p className="error">{errors.aadhar_number}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">PAN Number</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCreditCard} />
//                       </CInputGroupText>
//                       <CFormInput name="pan_no" value={formData.pan_no} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.pan_no && <p className="error">{errors.pan_no}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Birth Date</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilCalendar} />
//                       </CInputGroupText>
//                       <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.dob && <p className="error">{errors.dob}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Occupation</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBriefcase} />
//                       </CInputGroupText>
//                       <CFormSelect name="occupation" value={formData.occupation} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="Student">Student</option>
//                         <option value="Business">Business</option>
//                         <option value="Service">Service</option>
//                         <option value="Farmer">Farmer</option>
//                         <option value="Self Employed">Self Employed</option>
//                         <option value="Government Servant">Government Servant</option>

//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.occupation && <p className="error">{errors.occupation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Name</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Relationship</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilPeople} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Nominee Age</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBirthdayCake} />
//                       </CInputGroupText>
//                       <CFormInput name="nomineeAge" value={formData.nomineeAge} onChange={handleChange} />
//                     </CInputGroup>
//                     {errors.nomineeName && <p className="error">{errors.nomineeName}</p>}
//                   </div>
//                 </div>

//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(2)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 4 && (
//               <>
//                 <div className="user-details">
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Exchange Mode</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilSwapVertical} />
//                       </CInputGroupText>
//                       <CFormSelect name="is_exchange" value={formData.is_exchange} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.is_exchange && <p className="error">{errors.is_exchange}</p>}
//                   </div>

//                   {formData.is_exchange === 'true' && (
//                     <>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Exchange Broker</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilPeople} />
//                           </CInputGroupText>
//                           <CFormSelect name="broker_id" value={formData.broker_id} onChange={handleBrokerChange}>
//                             <option value="">-Select-</option>
//                             {brokers.map((broker) => (
//                               <option key={broker._id} value={broker._id}>
//                                 {broker.name} {broker.otp_required ? '(OTP Required)' : ''}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         </CInputGroup>
//                         {errors.broker_id && <p className="error">{errors.broker_id}</p>}
//                       </div>

//                       {selectedBroker && (
//                         <div className="input-box">
//                           <div className="details-container">
//                             <span className="details">Broker Mobile</span>
//                           </div>
//                           <CInputGroup>
//                             <CInputGroupText className="input-icon">
//                               <CIcon icon={cilPhone} />
//                             </CInputGroupText>
//                             <CFormInput value={selectedBroker.mobile} readOnly />
//                           </CInputGroup>
//                         </div>
//                       )}

//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Exchange Vehicle Number</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilBike} />
//                           </CInputGroupText>
//                           <CFormInput name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} />
//                         </CInputGroup>
//                         {errors.vehicle_number && <p className="error">{errors.vehicle_number}</p>}
//                       </div>

//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Exchange Price</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilMoney} />
//                           </CInputGroupText>
//                           <CFormInput name="exchange_price" value={formData.exchange_price} onChange={handleChange} />
//                         </CInputGroup>
//                         {errors.exchange_price && <p className="error">{errors.exchange_price}</p>}
//                       </div>
//                       <div className="input-box">
//                         <div className="details-container">
//                           <span className="details">Exchange Chassis Number</span>
//                           <span className="required">*</span>
//                         </div>
//                         <CInputGroup>
//                           <CInputGroupText className="input-icon">
//                             <CIcon icon={cilBarcode} />
//                           </CInputGroupText>
//                           <CFormInput name="chassis_number" value={formData.chassis_number} onChange={handleChange} />
//                         </CInputGroup>
//                         {errors.chassis_number && <p className="error">{errors.chassis_number}</p>}
//                       </div>
//                       {selectedBroker?.otp_required && (
//                         <div className="input-box">
//                           <div className="details-container">
//                             <span className="details">OTP Verification</span>
//                             <span className="required">*</span>
//                           </div>
//                           {!otpSent ? (
//                             <CButton color="primary" onClick={handleSendOtp}>
//                               Send OTP
//                             </CButton>
//                           ) : (
//                             <>
//                               <CInputGroup>
//                                 <CInputGroupText className="input-icon">
//                                   <CIcon icon={cilFingerprint} />
//                                 </CInputGroupText>
//                                 <CFormInput placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
//                                 <CButton color="success" onClick={handleVerifyOtp}>
//                                   Verify OTP
//                                 </CButton>
//                               </CInputGroup>
//                               {otpError && <p className="error">{otpError}</p>}
//                             </>
//                           )}
//                           {otpVerified && <div className="alert alert-success mt-2">OTP verified successfully</div>}
//                         </div>
//                       )}
//                     </>
//                   )}

//                   <div
//                     style={{
//                       width: '100%',
//                       height: '2px',
//                       backgroundColor: '#e0e0e0',
//                       margin: '5px 0',
//                       borderRadius: '2px'
//                     }}
//                   ></div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Payment Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilBank} />
//                       </CInputGroupText>
//                       <CFormSelect name="type" value={formData.type} onChange={handleChange}>
//                         <option value="">-Select-</option>
//                         <option value="cash">Cash</option>
//                         <option value="finance">Finance</option>
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.type && <p className="error">{errors.type}</p>}
//                   </div>

//                 {formData.type === 'finance' && (
//   <>
//     <div className="input-box">
//       <div className="details-container">
//         <span className="details">Financer Name</span>
//         <span className="required">*</span>
//       </div>
//       <CInputGroup>
//         <CInputGroupText className="input-icon">
//           <CIcon icon={cilInstitution} />
//         </CInputGroupText>
//         <div style={{ flex: 1 }}>
//           <Select
//             name="financer_id"
//             isDisabled={!formData.branch}
//             placeholder={
//               !formData.branch 
//                 ? "Select branch first" 
//                 : filteredFinancers.length === 0 
//                   ? "No financers available" 
//                   : "Search Financer"
//             }
//             value={
//               financers.find((f) => f._id === formData.financer_id)
//                 ? {
//                     label: financers.find((f) => f._id === formData.financer_id)?.financeProviderDetails?.name || 'Unknown',
//                     value: formData.financer_id,
//                   }
//                 : null
//             }
//             onChange={(selected) =>
//               handleChange({
//                 target: {
//                   name: "financer_id",
//                   value: selected ? selected.value : "",
//                 },
//               })
//             }
//             options={filteredFinancers.map((financer) => ({
//               label: financer.financeProviderDetails?.name || 'Unknown',
//               value: financer._id,
//               ...(financer.branchRates[0]?.gcRate > 0 && { 
//                 description: `GC: ₹${financer.branchRates[0].gcRate}` 
//               })
//             }))}
//             formatOptionLabel={(option) => (
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span>{option.label}</span>
//                 {option.description && (
//                   <small style={{ color: '#666', marginLeft: '10px' }}>
//                     {option.description}
//                   </small>
//                 )}
//               </div>
//             )}
//             noOptionsMessage={() => {
//               if (!formData.branch) return "Please select a branch first";
//               if (financers.length === 0) return "No financers available";
//               return "No matching financers found";
//             }}
//             classNamePrefix="react-select"
//             className={`react-select-container ${
//               errors.financer_id ? "error-input" : formData.financer_id ? "valid-input" : ""
//             }`}
//           />
//         </div>
//       </CInputGroup>
//       {errors.financer_id && <p className="error">{errors.financer_id}</p>}
      
//       {/* Show message if no financers available for selected branch */}
//       {formData.branch && filteredFinancers.length === 0 && (
//         <small className="text-muted">No financers available for this branch</small>
//       )}
//     </div>

//     {/* GC Applicable and GC Amount fields - ONLY SHOW IN EDIT MODE */}
//     {isEditMode && (
//       <>
//         <div className="input-box">
//           <div className="details-container">
//             <span className="details">GC Applicable</span>
//             <span className="required">*</span>
//           </div>
//           <CInputGroup>
//             <CInputGroupText className="input-icon">
//               <CIcon icon={cilTask} />
//             </CInputGroupText>
//             <CFormSelect 
//               name="gc_applicable" 
//               value={formData.gc_applicable} 
//               onChange={handleChange}
//             >
//               <option value="">-Select-</option>
//               <option value={true}>Yes</option>
//               <option value={false}>No</option>
//             </CFormSelect>
//           </CInputGroup>
//           {errors.gc_applicable && <p className="error">{errors.gc_applicable}</p>}
//         </div>

//         {formData.gc_applicable && (
//           <div className="input-box">
//             <div className="details-container">
//               <span className="details">GC Amount</span>
//               {selectedFinancerGC > 0 && (
//                 <span className="text-muted small ms-2">
//                   (Rate: ₹{selectedFinancerGC})
//                 </span>
//               )}
//             </div>
//             <CInputGroup>
//               <CInputGroupText className="input-icon">
//                 <CIcon icon={cilMoney} />
//               </CInputGroupText>
//               <CFormInput 
//                 name="gc_amount" 
//                 type="number"
//                 value={formData.gc_amount} 
//                 onChange={handleChange}
//                 placeholder={selectedFinancerGC > 0 ? `Suggested: ₹${selectedFinancerGC}` : "Enter GC amount"}
//               />
//             </CInputGroup>
//             {errors.gc_amount && <p className="error">{errors.gc_amount}</p>}
//           </div>
//         )}
//       </>
//     )}

  
//   </>
// )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="submit-button" onClick={() => setActiveTab(3)}>
//                     Back
//                   </button>
//                   <button type="button" className="cancel-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 5 && (
//               <>
//                 <div>
//                   <h5>Accessories for {selectedModelName} ({modelType})</h5>
//                   {accessories.length > 0 ? (
//                     <>
//                       <p className="text-muted mb-3">
//                         Showing accessories compatible with {selectedModelName} ({modelType} type)
//                       </p>
//                       <div className="accessories-list">
//                        {accessories.map((accessory) => {
  
//   const isExplicitlyUnchecked = formData.uncheckedAccessories && 
//                                formData.uncheckedAccessories.includes(accessory._id);
  
//   let isChecked;
//   if (isEditMode) {
//     // In edit mode: accessory is checked if it's in selected_accessories
//     isChecked = formData.selected_accessories.includes(accessory._id);
//   } else {
//     // In new booking mode: default to checked unless explicitly unchecked
//     isChecked = !isExplicitlyUnchecked;
//   }

//   return (
//     <div key={accessory._id} className="accessory-item">
//       <CFormCheck
//         id={`accessory-${accessory._id}`}
//         label={`${accessory.name} - ₹${accessory.price} ${accessory.applicableModelsDetails?.length > 0 ? '(Model Specific)' : '(General)'}`}
//         checked={isChecked}
//         onChange={(e) => {
//           const isNowChecked = e.target.checked;
//           if (!isNowChecked) {
//             // Add to unchecked accessories
//             setFormData(prev => ({
//               ...prev,
//               uncheckedAccessories: [...(prev.uncheckedAccessories || []), accessory._id],
//               // Also remove from selected_accessories
//               selected_accessories: prev.selected_accessories.filter(id => id !== accessory._id)
//             }));
//           } else {
//             // Remove from unchecked accessories
//             setFormData(prev => ({
//               ...prev,
//               uncheckedAccessories: prev.uncheckedAccessories?.filter(id => id !== accessory._id) || [],
//               // Also add to selected_accessories
//               selected_accessories: [...prev.selected_accessories, accessory._id]
//             }));
//           }
//         }}
//       />
//       {accessory.description && (
//         <small className="text-muted d-block">{accessory.description}</small>
//       )}
//     </div>
//   );
// })}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       <p>No accessories available for {selectedModelName} ({modelType})</p>
//                       <small>Accessories must match both the model type ({modelType}) and be applicable to this specific model</small>
//                     </div>
//                   )}
//                 </div>
//                 <div className="form-footer">
//                   <button type="button" className="cancel-button" onClick={() => setActiveTab(4)}>
//                     Back
//                   </button>
//                   <button type="button" className="submit-button" onClick={handleNextTab}>
//                     Next
//                   </button>
//                 </div>
//               </>
//             )}

//       {activeTab === 6 && (
//   <>
//     <div className="user-details">
//       <div className="input-box" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <div style={{ flex: '0 0 48%' }}>
//           <span className="details">Note</span>
//           <CInputGroup>
//             <CInputGroupText className="input-icon">
//               <CIcon icon={cilList} />
//             </CInputGroupText>
//             <CFormInput name="note" value={formData.note} onChange={handleChange} />
//           </CInputGroup>
//         </div>
        
//         <div style={{ flex: '0 0 48%', textAlign: 'right' }}>
//           {/* Total Deal Amount display - same as before */}
//           <div className="details" style={{ marginBottom: '5px', display: 'block' }}>Total Deal Amount</div>
//           <div style={{ 
//             display: 'inline-block',
//             backgroundColor: '#f8f9fa',
//             padding: '10px 15px',
//             borderRadius: '5px',
//             border: '1px solid #dee2e6',
//             minWidth: '200px',
//             textAlign: 'left'
//           }}>
//             {(() => {
//               const totals = calculateTotalDealAmount();
//               const totalBeforeDiscount = parseFloat(totals.totalBeforeDiscount);
//               const totalAfterDiscount = parseFloat(totals.totalAfterDiscount);
//               const totalDiscount = parseFloat(totals.totalDiscount);
//               const subsidyAmount = parseFloat(totals.subsidyAmount);
//               const hasDiscount = totals.hasDiscount;
//               const hasSubsidy = totals.hasSubsidy;
              
//               return (
//                 <>
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: '3px'
//                   }}>
//                     <small>Original Total:</small>
//                     <span>₹{totalBeforeDiscount.toLocaleString('en-IN')}</span>
//                   </div>
                  
//                   {hasDiscount && (
//                     <>
//                       <div style={{ 
//                         display: 'flex', 
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         marginBottom: '3px',
//                         fontSize: '12px'
//                       }}>
//                         <small>Discount:</small>
//                         <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
//                       </div>
//                     </>
//                   )}
                  
//                   {hasSubsidy && isEVModel && (
//                     <div style={{ 
//                       display: 'flex', 
//                       justifyContent: 'space-between',
//                         alignItems: 'center',
//                       marginBottom: '3px',
//                       fontSize: '12px'
//                     }}>
//                       <small>EV Subsidy:</small>
//                       <span>- ₹{subsidyAmount.toLocaleString('en-IN')}</span>
//                     </div>
//                   )}
                  
//                   {(hasDiscount || hasSubsidy) && (
//                     <div style={{ 
//                       width: '100%', 
//                       height: '1px', 
//                       backgroundColor: '#ccc', 
//                       margin: '3px 0'
//                     }}></div>
//                   )}
                  
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginTop: '3px',
//                     fontWeight: 'bold'
//                   }}>
//                     <span>{(hasDiscount || hasSubsidy) ? 'Final Amount:' : 'Total:'}</span>
//                     <span style={{ fontSize: '16px' }}>
//                       ₹{totalAfterDiscount.toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 </>
//               );
//             })()}
//           </div>
//         </div>
//       </div>
//     </div>
    
//     {/* ===== Discount Limits Information (only shown in edit mode) ===== */}
//     {isEditMode && (
//       <div className="discount-limits-info" style={{ 
//         marginBottom: '20px', 
//         padding: '15px', 
//         backgroundColor: '#f8f9fa', 
//         borderRadius: '5px',
//         border: '1px solid #dee2e6'
//       }}>
//         <h6 style={{ marginBottom: '10px', color: '#495057' }}>Available Discount Limits</h6>
//         <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//           <div style={{ flex: 1, minWidth: '200px' }}>
//             <small style={{ display: 'block', color: '#6c757d' }}>Vehicle Price Discount</small>
//             <strong style={{ fontSize: '1.1em' }}>
//               ₹{(discountLimits.onRoadPrice || 0).toLocaleString('en-IN')}
//             </strong>
//             {discountUsageByCategory.vehicle_price > 0 && (
//               <div style={{ fontSize: '0.9em', color: '#28a745' }}>
//                 Used: ₹{discountUsageByCategory.vehicle_price.toLocaleString('en-IN')}
//                 <br />
//                 Remaining: ₹{remainingDiscounts.onRoadPrice.toLocaleString('en-IN')}
//               </div>
//             )}
//           </div>
          
//           <div style={{ flex: 1, minWidth: '200px' }}>
//             <small style={{ display: 'block', color: '#6c757d' }}>Add-On Services Discount</small>
//             <strong>{discountLimits.addOnServices || 0}%</strong>
//             {discountUsageByCategory.AddONservices > 0 && (
//               <div style={{ fontSize: '0.9em', color: '#28a745' }}>
//                 Used: ₹{discountUsageByCategory.AddONservices.toLocaleString('en-IN')}
//                 <br />
//                 Remaining: {remainingDiscounts.addOnServicesPercentage}% (₹{remainingDiscounts.addOnServicesAmount.toLocaleString('en-IN')})
//               </div>
//             )}
//           </div>
          
//           <div style={{ flex: 1, minWidth: '200px' }}>
//             <small style={{ display: 'block', color: '#6c757d' }}>Accessories Discount</small>
//             <strong>{discountLimits.accessories || 0}%</strong>
//             {discountUsageByCategory.Accessories > 0 && (
//               <div style={{ fontSize: '0.9em', color: '#28a745' }}>
//                 Used: ₹{discountUsageByCategory.Accessories.toLocaleString('en-IN')}
//                 <br />
//                 Remaining: {remainingDiscounts.accessoriesPercentage}% (₹{remainingDiscounts.accessoriesAmount.toLocaleString('en-IN')})
//               </div>
//             )}
//           </div>
          
//           {remainingDiscounts.totalUsed > 0 && (
//             <div style={{ flex: 1, minWidth: '200px' }}>
//               <small style={{ display: 'block', color: '#6c757d' }}>Total Discount Used</small>
//               <strong>₹{remainingDiscounts.totalUsed.toLocaleString('en-IN')}</strong>
//             </div>
//           )}
//         </div>
//       </div>
//     )}
//     {/* ===== END ===== */}
    
//     {(() => {
//       // Get headers for Tab 6 with proper branch filtering and insurance filtering
//       const getTab6Headers = () => {
//         if (!formData.model_id) return [];

//         const selectedModel = models.find((model) => model._id === formData.model_id);
//         if (!selectedModel) return [];

//         const allPrices = selectedModel.modelPrices || [];
        
//         // Get the prices that match the selected branch OR have null branch_id
//         const filteredPrices = allPrices.filter(price => {
//           // If price has no branch_id, include it (default/fallback)
//           if (!price.branch_id && price.branch_id !== null) {
//             return true;
//           }
          
//           // If price has branch_id, check if it matches selected branch
//           return price.branch_id === formData.branch;
//         });
        
//         // Apply HPA filter
//         const hpaFiltered = filterHeadersByHPAStatus(filteredPrices, formData.hpa);
        
//         // Apply insurance filters
//         const insuranceFiltered = filterInsuranceHeaders(hpaFiltered);
        
//         // Now filter to show only headers that should be displayed
//         return insuranceFiltered.filter((price) => {
//           if (!price.header || !price.header._id) {
//             return false;
//           }
          
//           const headerId = price.header._id;
//           const isMandatory = price.header.is_mandatory;
          
//           if (isEditMode) {
//             // In edit mode: show headers that are in optionalComponents (were selected in original booking)
//             const isInOptionalComponents = formData.optionalComponents.includes(headerId);
//             return isMandatory || isInOptionalComponents;
//           } else {
//             // In new booking mode: show headers that are not explicitly unchecked
//             const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//               formData.uncheckedHeaders.includes(headerId);
//             return isMandatory || !isExplicitlyUnchecked;
//           }
//         });
//       };
      
//       const tab6Headers = getTab6Headers();
      
//       if (tab6Headers.length > 0) {
//         return (
//           <div className="model-headers-section" style={{ marginTop: '20px' }}>
//             <h5>
//               Model Options ({tab6Headers.length} selected)
//               {!formData.hpa && <span style={{ color: '#dc3545', fontSize: '0.9em', marginLeft: '10px' }}>
//                 (HPA-related options hidden as HPA is disabled)
//               </span>}
//               {formData.selfInsurance === true && <span style={{ color: '#28a745', fontSize: '0.9em', marginLeft: '10px' }}>
//                 (Insurance headers hidden as Self Insurance is enabled)
//               </span>}
//               {formData.selfInsurance === false && formData.insuranceFivePlusFive === true && <span style={{ color: '#ffc107', fontSize: '0.9em', marginLeft: '10px' }}>
//                 (INSURANCE CHARGES header hidden for Insurance 5+5, Insurance: 5 + 5 Years shown)
//               </span>}
//               {formData.selfInsurance === false && formData.insuranceFivePlusFive === false && <span style={{ color: '#6c757d', fontSize: '0.9em', marginLeft: '10px' }}>
//                 (Standard insurance - INSURANCE CHARGES shown)
//               </span>}
//             </h5>
            
//             <div className="table-responsive">
//               <CTable striped hover responsive>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>Particulars</CTableHeaderCell>
//                     <CTableHeaderCell>HSN</CTableHeaderCell>
//                     <CTableHeaderCell>Unit Cost (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>Discount (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>Taxable (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>CGST %</CTableHeaderCell>
//                     <CTableHeaderCell>CGST Amount (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>SGST %</CTableHeaderCell>
//                     <CTableHeaderCell>SGST Amount (₹)</CTableHeaderCell>
//                     <CTableHeaderCell>LINE TOTAL (₹)</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {(() => {
//                     // First, calculate total discounts by category (ONLY FOR EDIT MODE)
//                     let totalDiscountFromVehiclePrice = 0;
//                     let totalDiscountFromAddOnServices = 0;
//                     let totalDiscountFromAccessories = 0;
//                     let totalDiscountFromOtherCategories = 0;
                    
//                     // Only calculate these totals in edit mode
//                     if (isEditMode) {
//                       tab6Headers.forEach((price) => {
//                         const header = price.header;
//                         const headerId = header._id || header.id;
//                         const headerKey = header.header_key || '';
//                         const categoryKey = header.category_key || '';
                        
//                         // Check if this is an HPA-related header
//                         const isHPAHeader = headerKey.startsWith('HP') || 
//                                             headerKey.startsWith('HPA') ||
//                                             headerKey.toLowerCase().includes('hypothecation') ||
//                                             headerKey.toLowerCase().includes('loan');
                        
//                         // Determine if header should be shown based on HPA status
//                         const shouldShowHeader = formData.hpa || !isHPAHeader;
                        
//                         if (!shouldShowHeader) {
//                           return;
//                         }
                        
//                         const isSpecialHeader = headerKey.includes('ON ROAD PRICE') || 
//                                                headerKey.includes('ADDON SERVICES TOTAL') || 
//                                                headerKey.includes('ADD ON SERVICES TOTAL') || 
//                                                headerKey === 'ACCESSORIES TOTAL';
                        
//                         // Skip special headers themselves from discount calculations
//                         if (isSpecialHeader) {
//                           return;
//                         }
                        
//                         const discountValue = headerDiscounts[headerId] !== undefined 
//                           ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
//                           : '';
                        
//                         const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                        
//                         // Categorize discounts
//                         if (discountAmount > 0) {
//                           if (categoryKey === 'vehicle_price') {
//                             totalDiscountFromVehiclePrice += discountAmount;
//                           } else if (categoryKey === 'AddONservices') {
//                             totalDiscountFromAddOnServices += discountAmount;
//                           } else if (categoryKey === 'Accesories' || categoryKey === 'Accessories') {
//                             totalDiscountFromAccessories += discountAmount;
//                           } else {
//                             totalDiscountFromOtherCategories += discountAmount;
//                           }
//                         }
//                       });
//                     }
                    
//                     const headersWithCalculations = [];
                    
//                     // Collect all headers
//                     tab6Headers.forEach((price) => {
//                       const header = price.header;
//                       const headerId = header._id || header.id;
//                       const headerKey = header.header_key || '';
                      
//                       // Check if this is an HPA-related header
//                       const isHPAHeader = headerKey.startsWith('HP') || 
//                                           headerKey.startsWith('HPA') ||
//                                           headerKey.toLowerCase().includes('hypothecation') ||
//                                           headerKey.toLowerCase().includes('loan');
                      
//                       // Determine if header should be shown based on HPA status
//                       const shouldShowHeader = formData.hpa || !isHPAHeader;
                      
//                       if (!shouldShowHeader) {
//                         return;
//                       }
                      
//                       const isSpecialHeader = headerKey.includes('ON ROAD PRICE') || 
//                                              headerKey.includes('ADDON SERVICES TOTAL') || 
//                                              headerKey.includes('ADD ON SERVICES TOTAL') || 
//                                              headerKey === 'ACCESSORIES TOTAL';
                      
//                       const discountValue = headerDiscounts[headerId] !== undefined 
//                         ? (headerDiscounts[headerId] === 0 ? '0' : headerDiscounts[headerId].toString())
//                         : '';
                      
//                       const discountAmount = discountValue !== '' ? parseFloat(discountValue) : 0;
                      
//                       headersWithCalculations.push({
//                         price,
//                         header,
//                         headerId,
//                         headerKey,
//                         isSpecialHeader,
//                         discountAmount
//                       });
//                     });
                    
//                     // Second pass: render rows with adjusted calculations
//                     return headersWithCalculations.map((item) => {
//                       const { price, header, headerId, headerKey, isSpecialHeader, discountAmount } = item;
//                       const isMandatory = header.is_mandatory;
//                       const isDiscountAllowed = header.is_discount;
//                       const isAccessoriesTotal = headerKey === 'ACCESSORIES TOTAL';
                      
//                       const isExplicitlyUnchecked = formData.uncheckedHeaders && 
//                         formData.uncheckedHeaders.includes(headerId);
//                       // For all headers, check if they are selected
//                       const isChecked = isMandatory || !isExplicitlyUnchecked;
                      
//                       // Find matching accessories for this header
//                       const selectedMatchingAccessories = accessories.filter(accessory => 
//                         accessory.categoryDetails?.header_key === header.header_key &&
//                         (isEditMode ? 
//                           formData.selected_accessories.includes(accessory._id) : // In edit mode
//                           !formData.uncheckedAccessories?.includes(accessory._id) // In new mode
//                         )
//                       );

//                       // Get TOTAL accessory price (SUM of all selected accessories for this header)
//                       const accessoryPrice = selectedMatchingAccessories.length > 0 
//                         ? selectedMatchingAccessories.reduce((sum, acc) => sum + (acc.price || 0), 0)
//                         : 0;
                                      
//                       const headerPrice = price.value || 0;
//                       // Use whichever is higher: header price or accessory price
//                       let finalPrice = Math.max(headerPrice, accessoryPrice);
                      
//                       // For special headers in EDIT MODE only, apply appropriate discounts based on category
//                       let adjustedPrice = finalPrice;
//                       let discountApplied = 0;
                      
//                       if (isSpecialHeader && isEditMode) {
//                         if (headerKey.includes('ON ROAD PRICE') || headerKey.includes('TOTAL ONROAD')) {
//                           // Apply vehicle_price discounts to ON ROAD PRICE
//                           discountApplied = totalDiscountFromVehiclePrice;
//                           adjustedPrice = Math.max(0, finalPrice - discountApplied);
//                         } else if (headerKey.includes('ADDON SERVICES TOTAL') || headerKey.includes('ADD ON SERVICES TOTAL')) {
//                           // Apply AddONservices discounts to ADDON SERVICES TOTAL
//                           discountApplied = totalDiscountFromAddOnServices;
//                           adjustedPrice = Math.max(0, finalPrice - discountApplied);
//                         } else if (headerKey === 'ACCESSORIES TOTAL') {
//                           // ACCESSORIES TOTAL - apply accessories category discounts
//                           discountApplied = totalDiscountFromAccessories;
//                           adjustedPrice = Math.max(0, finalPrice - discountApplied);
//                         }
//                       }
                      
//                       const gstRate = header.metadata?.gst_rate ? parseFloat(header.metadata.gst_rate) : 0;
//                       const hsnCode = header.metadata?.hsn_code || 'N/A';
                      
//                       let taxable, cgstAmount, sgstAmount, cgstRate, sgstRate, lineTotal;
                      
//                       if (isSpecialHeader && isEditMode) {
//                         // For special headers in EDIT MODE, use the adjusted price (after auto-discount)
//                         taxable = calculateTaxableAmount(adjustedPrice, 0, gstRate, formData.customer_type);
//                         const gstCalculation = calculateGST(taxable, gstRate, formData.customer_type);
//                         cgstAmount = gstCalculation.cgstAmount;
//                         sgstAmount = gstCalculation.sgstAmount;
//                         cgstRate = gstCalculation.cgstRate;
//                         sgstRate = gstCalculation.sgstRate;
//                         lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
//                       } else {
//                         // For non-special headers OR special headers in CREATE MODE, use regular discount calculation
//                         taxable = calculateTaxableAmount(finalPrice, discountAmount, gstRate, formData.customer_type);
//                         const gstCalculation = calculateGST(taxable, gstRate, formData.customer_type);
//                         cgstAmount = gstCalculation.cgstAmount;
//                         sgstAmount = gstCalculation.sgstAmount;
//                         cgstRate = gstCalculation.cgstRate;
//                         sgstRate = gstCalculation.sgstRate;
//                         lineTotal = calculateLineTotal(taxable, cgstAmount, sgstAmount);
//                       }
                      
//                       // Apply subsidy deduction SEPARATELY (not as discount) for "Ex-SHOWROOM(INCLUDING 5% GST)" header ONLY for EV models
//                       if (headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel) {
//                         const subsidyAmount = parseFloat(formData.subsidy_amount) || 0;
//                         // Subtract subsidy from line total, but NOT from discount field
//                         lineTotal = lineTotal - subsidyAmount;
//                       }

//                       return (
//                         <CTableRow key={headerId}>
//                           <CTableDataCell>
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                               <CFormCheck
//                                 id={`tab6-header-${headerId}`}
//                                 checked={isChecked}
//                                 onChange={(e) => {
//                                   if (!isMandatory) {
//                                     const isNowChecked = e.target.checked;
//                                     handleHeaderSelection(headerId, isNowChecked);
//                                   }
//                                 }}
//                                 disabled={isMandatory}
//                                 style={{ marginRight: '10px' }}
//                               />
//                               <span>
//                                 {header.header_key} 
//                                 {isMandatory ? '(Mandatory)' : '(Optional)'}
//                                 {headerKey.startsWith('HP') || headerKey.startsWith('HPA') ? ' (HPA-related)' : ''}
//                               </span>
//                             </div>
//                           </CTableDataCell>
//                           <CTableDataCell>{hsnCode}</CTableDataCell>
//                           <CTableDataCell>₹{finalPrice.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>
//                             {isSpecialHeader && isEditMode ? (
//                               // In EDIT MODE, show the auto-calculated discount for special headers
//                               <div style={{ 
//                                 padding: '8px', 
//                                 backgroundColor: '#f8f9fa', 
//                                 borderRadius: '4px', 
//                                 textAlign: 'center'
//                               }}>
//                                 ₹{adjustedPrice.toFixed(2)}
//                                 {discountApplied > 0 && (
//                                   <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
//                                     Discount: -₹{discountApplied.toFixed(2)}
//                                   </div>
//                                 )}
//                               </div>
//                             ) : (
//                               // For CREATE MODE, treat special headers like regular headers - show discount input if allowed
//                               <div>
//                            <CFormInput
//   type="number"
//   step="0.01"
//   min="0"
//   placeholder={isDiscountAllowed ? "Enter discount" : "Discount not allowed"}
//   value={headerDiscounts[headerId] !== undefined ? headerDiscounts[headerId] : ''}
//   onChange={(e) => {
//     const value = e.target.value;
//     if (value === '') {
//       const category = header.category_key || '';
//       handleHeaderDiscountChange(headerId, '', category, finalPrice);
//     } else {
//       const numValue = parseFloat(value);
//       if (!isNaN(numValue) && numValue >= 0) {
//         const category = header.category_key || '';
//         handleHeaderDiscountChange(headerId, numValue, category, finalPrice);
//       }
//     }
//   }}
//   disabled={!isDiscountAllowed}
//   style={{ width: '150px' }}
//   className={`no-spinner ${headerDiscounts[headerId] ? 'has-value' : ''}`}
//   onWheel={(e) => e.target.blur()}
// />
//                               </div>
//                             )}
//                             {errors[`discount_${headerId}`] && (
//                               <small className="text-danger d-block">{errors[`discount_${headerId}`]}</small>
//                             )}
//                           </CTableDataCell>
//                           <CTableDataCell>₹{taxable.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>{cgstRate?.toFixed(2) || '0.00'}%</CTableDataCell>
//                           <CTableDataCell>₹{cgstAmount.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>{sgstRate?.toFixed(2) || '0.00'}%</CTableDataCell>
//                           <CTableDataCell>₹{sgstAmount.toFixed(2)}</CTableDataCell>
//                           <CTableDataCell>
//                             <strong>₹{lineTotal.toFixed(2)}</strong>
//                             {headerKey === 'Ex-SHOWROOM(INCLUDING 5% GST)' && formData.subsidy_amount && isEVModel && (
//                               <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
//                                 (After ₹{formData.subsidy_amount} EV subsidy)
//                               </div>
//                             )}
//                           </CTableDataCell>
//                         </CTableRow>
//                       );
//                     });
//                   })()}
//                 </CTableBody>
//               </CTable>
//             </div>
//           </div>
//         );
//       }
      
//       return null;
//     })()}

//     <div className="form-footer">
//       <button type="button" className="cancel-button" onClick={() => setActiveTab(5)}>
//         Back
//       </button>
//       <button type="submit" className="submit-button" disabled={isSubmitting}>
//         {isSubmitting ? 'Submitting...' : 'Apply for Approval'}
//       </button>
//     </div>
//   </>
// )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BookingForm;


