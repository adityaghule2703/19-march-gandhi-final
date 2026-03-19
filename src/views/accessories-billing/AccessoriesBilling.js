import React, { useState, useEffect} from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBank, cilLocationPin, cilUser, cilMoney, cilDescription } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError,showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import FormButtons from '../../utils/FormButtons';
import '../../css/offer.css';
import '../../css/accessoriesBilling.css';
import tvsLogo from '../../assets/images/logo.png';

function AccessoriesBilling() {
  const [formData, setFormData] = useState({
    customer_type: '',
    branch_id: '',
    booking_id: '',
    subdealer_id: '',
    payment_mode: '',
    bankLocation: '',
    subPaymentMode: '',
    cashLocation: '',
    items: [],
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    customer_id: '',
    customer_name: '',
    sales_executive: '',
    payment_type: '',
    remark: ''
  });
  const [errors, setErrors] = useState({});
  const [accessories, setAccessories] = useState([]);
  const [bookings, setBookings] = useState([]); // Changed from customers to bookings
  const [subdealers, setSubdealers] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // Changed from selectedCustomer to selectedBooking
  const [branches, setBranches] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [banks, setBanks] = useState([]);
  const [cashLocations, setCashLocations] = useState([]);
  const [submodes, setSubModes] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [error, setError] = useState(null);
  const [savedInvoiceId, setSavedInvoiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axiosInstance.get('/accessories');
        setAccessories(response.data.data.accessories || []);
      } catch (error) {
        const message = showError(error);
        if (message) {
          setError(message);
        }
        setAccessories([]);
      }
    };

    fetchAccessories();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchBookings(), // Changed from fetchCustomers to fetchBookings
          fetchBranches(),
          fetchPaymentSubmodes(),
          fetchCashLocation(),
          fetchSalesExecutives()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // New function to fetch bookings
  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings?bookingType=BRANCH');
      const bookingsData = response.data.data?.bookings || response.data.bookings || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setBookings([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      const branchesData = response.data.data || response.data || [];
      setBranches(Array.isArray(branchesData) ? branchesData : []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setBranches([]);
    }
  };

  const fetchPaymentSubmodes = async () => {
    try {
      const response = await axiosInstance.get('/banksubpaymentmodes');
      const submodesData = response.data.data || response.data || [];
      setSubModes(Array.isArray(submodesData) ? submodesData : []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setSubModes([]);
    }
  };

  const fetchCashLocation = async () => {
    try {
      const response = await axiosInstance.get('/cash-locations');
      const cashLocationsData = response.data.data?.cashLocations || response.data.cashLocations || response.data.data || response.data || [];
      setCashLocations(Array.isArray(cashLocationsData) ? cashLocationsData : []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setCashLocations([]);
    }
  };

  const fetchSalesExecutives = async () => {
    try {
      const response = await axiosInstance.get('/users');
      const executivesData = response.data.data?.salesExecutives || response.data.salesExecutives || response.data.data || response.data || [];
      setSalesExecutives(Array.isArray(executivesData) ? executivesData : []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setSalesExecutives([]);
    }
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        const banksData = response.data.data?.banks || response.data.banks || response.data.data || response.data || [];
        setBanks(Array.isArray(banksData) ? banksData : []);
      } catch (error) {
        const message = showError(error);
        if (message) {
          setError(message);
        }
        setBanks([]);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchSubdealers = async () => {
      try {
        const response = await axiosInstance.get('/subdealers');
        const subdealersData = response.data.data?.subdealers || response.data.subdealers || response.data.data || response.data || [];
        setSubdealers(Array.isArray(subdealersData) ? subdealersData : []);
      } catch (error) {
        console.error('Error fetching subdealers:', error);
        const message = showError(error);
        if (message) {
          setError(message);
        }
        setSubdealers([]);
      }
    };
    fetchSubdealers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'customer_type') {
      // Reset all fields when customer type changes
      if (value === 'SUBDEALER') {
        setFormData(prevData => ({
          ...prevData,
          customer_type: value,
          branch_id: '',
          booking_id: '',
          customer_id: '',
          customer_name: '',
          sales_executive: '',
          payment_type: '',
          payment_mode: '',
          cashLocation: '',
          bankLocation: '',
          subPaymentMode: ''
        }));
        setSelectedBooking(null); // Changed from setSelectedCustomer
      } else if (value === 'CUSTOMER') {
        setFormData(prevData => ({
          ...prevData,
          customer_type: value,
          subdealer_id: '',
          payment_type: '',
          payment_mode: '',
          cashLocation: '',
          bankLocation: '',
          subPaymentMode: ''
        }));
        setSelectedSubdealer(null);
      }
    } else if (name === 'booking_id') {
      // Find the selected booking
      const booking = bookings.find((b) => b._id === value);
      if (booking) {
        setSelectedBooking(booking);
        // Extract customer details from the booking
        const customerDetails = booking.customerDetails || {};
        setFormData(prevData => ({
          ...prevData,
          customer_id: customerDetails.custId || '',
          customer_name: customerDetails.name || '',
          branch_id: booking.branch?._id || prevData.branch_id, // Set branch from booking if available
          sales_executive: booking.salesExecutive?._id || prevData.sales_executive // Set sales executive from booking if available
        }));
      } else {
        setSelectedBooking(null);
        setFormData(prevData => ({
          ...prevData,
          customer_id: '',
          customer_name: ''
        }));
      }
    } else if (name === 'subdealer_id') {
      const subdealer = subdealers.find((s) => s._id === value);
      setSelectedSubdealer(subdealer || null);
      if (subdealer) {
        setFormData(prevData => ({
          ...prevData,
          customer_name: subdealer.name || ''
        }));
      }
    } else if (name === 'payment_type') {
      // Reset payment-related fields when payment type changes
      if (value === 'PAY_LETTER') {
        setFormData(prevData => ({
          ...prevData,
          payment_mode: '',
          cashLocation: '',
          bankLocation: '',
          subPaymentMode: ''
        }));
      }
    }
  };

  const handleAccessorySelect = (accessoryId) => {
    setFormData((prevData) => {
      const isSelected = prevData.items.some((a) => a.accessory_id === accessoryId);
      if (isSelected) {
        return {
          ...prevData,
          items: prevData.items.filter((a) => a.accessory_id !== accessoryId)
        };
      } else {
        const accessory = accessories.find((a) => a._id === accessoryId || a.id === accessoryId);
        if (accessory) {
          return {
            ...prevData,
            items: [
              ...prevData.items,
              {
                accessory_id: accessoryId,
                quantity: 1,
                price: accessory.price, // This price already includes GST
                name: accessory.name,
                part_number: accessory.part_number
              }
            ]
          };
        }
        return prevData;
      }
    });
  };

  const handleQuantityChange = (accessoryId, quantity) => {
    if (quantity < 1) return;

    setFormData((prevData) => {
      const updatedItems = prevData.items.map((item) => {
        if (item.accessory_id === accessoryId) {
          return {
            ...item,
            quantity: parseInt(quantity)
          };
        }
        return item;
      });

      return { ...prevData, items: updatedItems };
    });
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const generateInvoiceContent = () => {
    return `
      <div class="invoice">
        <div class="invoice-header">
          <div class="company-info">
            <img src="${tvsLogo}" alt="Company Logo" class="company-logo" />
            <p>
              Authorized Main Dealer: TVS Motor Company Ltd.<br>
              Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br> Upnagar, Nashik Road, Nashik, 7498993672<br>
              <strong>GSTIN:</strong>27AAAAP0267H2ZN
            </p>
          </div>
          <div class="invoice-info">
            <h5>INVOICE</h5>
            <p>Invoice #: ${formData.invoiceNumber}</p>
            <p>Date: ${new Date(formData.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="invoice-body">
          <div class="billing-details">
            <div class="billed-to">
              <h5>Billed To:</h5>
              ${
                formData.customer_type === 'CUSTOMER' && selectedBooking
                  ? `
                <p>${selectedBooking.customerDetails?.name || ''}</p>
                <p>Customer ID: ${selectedBooking.customerDetails?.custId || ''}</p>
                <p>Booking #: ${selectedBooking.bookingNumber || ''}</p>
                <p>${selectedBooking.customerDetails?.address || ''}</p>
                <p>${selectedBooking.customerDetails?.mobile1 || ''}</p>
                <p>Model: ${selectedBooking.model?.model_name || ''}</p>
              `
                  : formData.customer_type === 'SUBDEALER' && selectedSubdealer
                    ? `
                <p>${selectedSubdealer.name}</p>
                <p>${selectedSubdealer.address}</p>
                <p>${selectedSubdealer.contactNumber}</p>
                <p>GSTIN: ${selectedSubdealer.gstin}</p>
              `
                    : ''
              }
              ${formData.remark ? `<p><strong>Remark:</strong> ${formData.remark}</p>` : ''}
              ${formData.customer_type === 'CUSTOMER' && formData.payment_type ? `<p><strong>Payment Type:</strong> ${formData.payment_type === 'INSTANT_PAYMENT' ? 'Instant Payment' : 'Pay Letter'}</p>` : ''}
              ${formData.customer_type === 'CUSTOMER' && formData.payment_mode ? `<p><strong>Payment Mode:</strong> ${formData.payment_mode}</p>` : ''}
            </div>
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Part Number</th>
                <th>Price (incl. GST)</th>
                <th>Quantity</th>
                <th>Total (incl. GST)</th>
              </tr>
            </thead>
            <tbody>
              ${formData.items
                .map(
                  (item, index) => `
                <tr key="${item.accessory_id}">
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.part_number}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>₹${calculateItemTotal(item).toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">
                  Grand Total:
                </td>
                <td></td>
                <td style="font-weight: bold;">₹${calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="terms">
            <h5>Terms & Conditions:</h5>
            <p>1. Goods once sold will not be taken back.</p>
            <p>2. Warranty as per company policy.</p>
            <p>3. Subject to Gandhi TVS.</p>
          </div>

          <div class="signature">
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>
    `;
  };

  const openInvoiceInNewTab = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    const invoiceContent = generateInvoiceContent();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${formData.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f5f5f5;
          }
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .invoice {
            border: 1px solid #ddd;
            padding: 20px;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .company-info {
            flex: 2;
          }
          .company-logo {
            max-width: 120px;
            margin-bottom: 10px;
          }
          .invoice-info {
            flex: 1;
            text-align: right;
          }
          .invoice-info h5 {
            margin: 0 0 10px 0;
            font-size: 24px;
            color: #333;
          }
          .billing-details {
            margin-bottom: 20px;
          }
        
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .invoice-table th {
            background-color: #f5f5f5;
          }
          .terms {
            margin-bottom: 30px;
          }
          .terms h5 {
            margin-bottom: 10px;
          }
          .signature {
            margin-top: 60px;
            text-align: right;
          }
          .print-instructions {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .print-buttons {
            text-align: center;
            margin: 20px 0;
          }
          .print-buttons button {
            margin: 0 10px;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          .btn-print {
            background-color: #007bff;
            color: white;
          }
          .btn-close {
            background-color: #6c757d;
            color: white;
          }
          @media print {
            body {
              padding: 0;
              background-color: white;
            }
            .invoice-container {
              box-shadow: none;
              padding: 0;
            }
            .invoice {
              border: none;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${invoiceContent}
          
          <div class="print-instructions no-print">
            <h3>Invoice Ready</h3>
            <p>Your invoice has been generated successfully. You can:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac) to print</li>
              <li>Use the print button below</li>
              <li>Right-click and select "Print" from the menu</li>
            </ul>
          </div>
          
          <div class="print-buttons no-print">
            <button class="btn-print" onclick="window.print()">Print Invoice</button>
            <button class="btn-close" onclick="window.close()">Close Window</button>
          </div>
        </div>
        
        <script>
          // Auto-focus on the new window and attempt to print
          window.focus();
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.customer_type) formErrors.customer_type = 'Type is required';
    
    if (formData.customer_type === 'CUSTOMER') {
      if (!formData.booking_id) formErrors.booking_id = 'Customer is required';
      if (!formData.branch_id) formErrors.branch_id = 'Branch is required';
      if (!formData.sales_executive) formErrors.sales_executive = 'Sales Executive is required';
      if (!formData.payment_type) formErrors.payment_type = 'Payment Type is required';
      
      if (formData.payment_type === 'INSTANT_PAYMENT') {
        if (!formData.payment_mode) formErrors.payment_mode = 'Payment Mode is required';
        if (formData.payment_mode === 'Cash' && !formData.cashLocation) formErrors.cashLocation = 'Cash Location is required';
        if (formData.payment_mode === 'Bank') {
          if (!formData.subPaymentMode) formErrors.subPaymentMode = 'Submode is required';
          if (!formData.bankLocation) formErrors.bankLocation = 'Bank Location is required';
        }
      }
    } else if (formData.customer_type === 'SUBDEALER') {
      if (!formData.subdealer_id) formErrors.subdealer_id = 'Subdealer is required';
      // No payment type or payment mode validation for SUBDEALER
    }
    
    if (formData.items.length === 0) formErrors.items = 'Please select at least one accessory';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    await handleSave();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    try {
      // Prepare payload based on customer type
      let payload = {
        customer_type: formData.customer_type,
        items: formData.items.map((item) => ({
          accessory_id: item.accessory_id,
          quantity: item.quantity
        })),
        remark: formData.remark || ''
      };

      // Add fields based on customer type
      if (formData.customer_type === 'CUSTOMER') {
        payload = {
          ...payload,
          branch_id: formData.branch_id,
          booking_id: formData.booking_id, // This is the booking ID
          customer_id: formData.customer_id,
          customer_name: formData.customer_name,
          sales_executive: formData.sales_executive,
          payment_type: formData.payment_type
        };

        // Add payment details only for INSTANT_PAYMENT
        if (formData.payment_type === 'INSTANT_PAYMENT') {
          payload.payment_mode = formData.payment_mode;

          if (formData.payment_mode === 'Cash') {
            payload.cashLocation = formData.cashLocation;
          } else if (formData.payment_mode === 'Bank') {
            payload.subPaymentMode = formData.subPaymentMode;
            payload.bankLocation = formData.bankLocation;
          }
        }
        // For PAY_LETTER, no payment_mode, cashLocation, or bankLocation is included
      } else if (formData.customer_type === 'SUBDEALER') {
        payload = {
          ...payload,
          subdealer_id: formData.subdealer_id
        };
        // SUBDEALER doesn't include payment_type, payment_mode, or location fields
      }

      const response = await axiosInstance.post('/accessory-billing', payload);

      setSavedInvoiceId(response.data.data._id);
      showFormSubmitToast('Invoice saved successfully!');

      openInvoiceInNewTab();
    } catch (error) {
      console.error('Error saving invoice:', error);
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  if (loading) {
    return <div className="form-container">Loading...</div>;
  }
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  return (
    <div className="form-container">
      <div className="title">Accessories Billing</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect name="customer_type" value={formData.customer_type} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="SUBDEALER">Subdealer</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.customer_type && <p className="error">{errors.customer_type}</p>}
              </div>

              {formData.customer_type === 'CUSTOMER' && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Branch</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilLocationPin} />
                      </CInputGroupText>
                      <CFormSelect name="branch_id" value={formData.branch_id} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {Array.isArray(branches) && branches.map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.branch_id && <p className="error">{errors.branch_id}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Customer</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect name="booking_id" value={formData.booking_id} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {Array.isArray(bookings) && bookings.map((booking) => (
                          <option key={booking._id} value={booking._id}>
                            {booking.customerDetails?.name || 'Unknown'} 
                            {booking.customerDetails?.custId ? ` (ID: ${booking.customerDetails.custId})` : ''} 
                            - Booking: {booking.bookingNumber || 'N/A'}
                            {booking.model?.model_name ? ` - ${booking.model.model_name}` : ''}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.booking_id && <p className="error">{errors.booking_id}</p>}
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
                      <CFormSelect name="sales_executive" value={formData.sales_executive} onChange={handleChange}>
                        <option value="">-Select-</option>
                        {Array.isArray(salesExecutives) && salesExecutives.map((executive) => (
                          <option key={executive._id} value={executive._id}>
                            {executive.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.sales_executive && <p className="error">{errors.sales_executive}</p>}
                  </div>
                  
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Payment Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilMoney} />
                      </CInputGroupText>
                      <CFormSelect name="payment_type" value={formData.payment_type} onChange={handleChange}>
                        <option value="">-Select-</option>
                        <option value="INSTANT_PAYMENT">Instant Payment</option>
                        <option value="PAY_LETTER">Pay Letter</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.payment_type && <p className="error">{errors.payment_type}</p>}
                  </div>

                  {formData.payment_type === 'INSTANT_PAYMENT' && (
                    <>
                      <div className="input-box">
                        <div className="details-container">
                          <span className="details">Payment Mode</span>
                          <span className="required">*</span>
                        </div>
                        <CInputGroup>
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilMoney} />
                          </CInputGroupText>
                          <CFormSelect name="payment_mode" value={formData.payment_mode} onChange={handleChange}>
                            <option value="">-Select-</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                          </CFormSelect>
                        </CInputGroup>
                        {errors.payment_mode && <p className="error">{errors.payment_mode}</p>}
                      </div>

                      {formData.payment_mode === 'Bank' && (
                        <>
                          <div className="input-box">
                            <div className="details-container">
                              <span className="details">Submode</span>
                              <span className="required">*</span>
                            </div>
                            <CInputGroup>
                              <CInputGroupText className="input-icon">
                                <CIcon icon={cilBank} />
                              </CInputGroupText>
                              <CFormSelect name="subPaymentMode" value={formData.subPaymentMode} onChange={handleChange}>
                                <option value="">-Select-</option>
                                {Array.isArray(submodes) && submodes.map((submode) => (
                                  <option key={submode._id} value={submode._id}>
                                    {submode.payment_mode}
                                  </option>
                                ))}
                              </CFormSelect>
                            </CInputGroup>
                            {errors.subPaymentMode && <p className="error">{errors.subPaymentMode}</p>}
                          </div>
                          <div className="input-box">
                            <div className="details-container">
                              <span className="details">Bank Location</span>
                              <span className="required">*</span>
                            </div>
                            <CInputGroup>
                              <CInputGroupText className="input-icon">
                                <CIcon icon={cilBank} />
                              </CInputGroupText>
                              <CFormSelect
                                name="bankLocation"
                                value={formData.bankLocation}
                                onChange={handleChange}
                                invalid={!!errors.bankLocation}
                              >
                                <option value="">-Select-</option>
                                {Array.isArray(banks) && banks.map((bank) => (
                                  <option key={bank._id} value={bank._id}>
                                    {bank.name}
                                  </option>
                                ))}
                              </CFormSelect>
                            </CInputGroup>
                            {errors.bankLocation && <p className="error">{errors.bankLocation}</p>}
                          </div>
                        </>
                      )}

                      {formData.payment_mode === 'Cash' && (
                        <div className="input-box">
                          <div className="details-container">
                            <span className="details">Cash Location</span>
                            <span className="required">*</span>
                          </div>
                          <CInputGroup>
                            <CInputGroupText className="input-icon">
                              <CIcon icon={cilBank} />
                            </CInputGroupText>
                            <CFormSelect name="cashLocation" value={formData.cashLocation} onChange={handleChange} invalid={!!errors.cashLocation}>
                              <option value="">-Select-</option>
                              {Array.isArray(cashLocations) && cashLocations.map((cash) => (
                                <option key={cash._id} value={cash._id}>
                                  {cash.name}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>
                          {errors.cashLocation && <p className="error">{errors.cashLocation}</p>}
                        </div>
                      )}
                    </>
                  )}
                  
                  {formData.customer_id && (
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Customer ID</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.customer_id}
                          readOnly
                          disabled
                        />
                      </CInputGroup>
                    </div>
                  )}
                </>
              )}

              {formData.customer_type === 'SUBDEALER' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Subdealer</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilLocationPin} />
                    </CInputGroupText>
                    <CFormSelect name="subdealer_id" value={formData.subdealer_id} onChange={handleChange}>
                      <option value="">-Select-</option>
                      {Array.isArray(subdealers) && subdealers.map((subdealer) => (
                        <option key={subdealer._id} value={subdealer._id}>
                          {subdealer.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.subdealer_id && <p className="error">{errors.subdealer_id}</p>}
                </div>
              )}

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Remark</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDescription} />
                  </CInputGroupText>
                  <input
                    type="text"
                    className="form-control"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="Enter any remarks"
                  />
                </CInputGroup>
              </div>
            </div>

            <div className="offer-container">
              <div className="permissions-form">
                <h4>
                  Select Accessories <span className="required">*</span>
                </h4>
                <div className="permissions-grid">
                  {Array.isArray(accessories) && accessories.map((accessory) => {
                    const accessoryId = accessory._id || accessory.id;
                    const isSelected = formData.items.some((a) => a.accessory_id === accessoryId);

                    return (
                      <div key={accessoryId} className="permission-item accessory-item">
                        <label>
                          <input type="checkbox" checked={isSelected} onChange={() => handleAccessorySelect(accessoryId)} />
                          {accessory.name} - ₹{accessory.price.toFixed(2)} (incl. GST)
                        </label>
                        {isSelected && (
                          <div className="quantity-control">
                            <span>Qty: </span>
                            <input
                              type="number"
                              min="1"
                              value={formData.items.find((a) => a.accessory_id === accessoryId)?.quantity || 1}
                              onChange={(e) => handleQuantityChange(accessoryId, e.target.value)}
                              className="quantity-input"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {errors.items && <p className="error">{errors.items}</p>}
                </div>
              </div>
            </div>

            <div className="selected-items">
              <h4>Selected Accessories</h4>
              {formData.items.length > 0 ? (
                <ul>
                  {formData.items.map((item) => (
                    <li key={item.accessory_id}>
                      {item.name} - ₹{item.price} x {item.quantity} = ₹{calculateItemTotal(item).toFixed(2)}
                    </li>
                  ))}
                  <li className="total">Grand Total: ₹{calculateTotal().toFixed(2)}</li>
                </ul>
              ) : (
                <p>No accessories selected</p>
              )}
            </div>

            <FormButtons onCancel={handleCancel} submitText="Save Invoice" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccessoriesBilling;