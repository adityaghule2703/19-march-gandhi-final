// import React, { useEffect, useState } from 'react';
// import '../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CButton } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilBarcode, cilUser, cilCash, cilPrint } from '@coreui/icons';
// import Select from 'react-select';
// import { generateReceiptHTML } from '../../utils/receiptTemplate';
// import axiosInstance from '../../axiosInstance';
// import '../../css/downPaymentReceipt.css';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS 
// } from '../../utils/modulePermissions';
// import { showError } from '../../utils/sweetAlerts';

// function DownPaymentReceipt() {
//   const [bookings, setBookings] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [customerName, setCustomerName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [paymentMode, setPaymentMode] = useState('CASH');
//   const [referenceNo, setReferenceNo] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fetchingDetails, setFetchingDetails] = useState(false);
//   const [error, setError] = useState('');
//   const [generatingReceipt, setGeneratingReceipt] = useState(false);
  
//   const { permissions = [] } = useAuth();

//   // ============ DP RECEIPT PERMISSIONS ============
//   const canViewDPReceipt = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.DP_RECEIPT, 
//     ACTIONS.VIEW
//   );

//   const canCreateDPReceipt = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.DP_RECEIPT, 
//     ACTIONS.CREATE
//   );

//   const canUpdateDPReceipt = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.DP_RECEIPT, 
//     ACTIONS.UPDATE
//   );

//   const canDeleteDPReceipt = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.DP_RECEIPT, 
//     ACTIONS.DELETE
//   );

//   // Combined permissions
//   const canGenerateReceipt = canCreateDPReceipt; // Only CREATE permission for generating new receipts
//   const canEditReceipt = canCreateDPReceipt || canUpdateDPReceipt; // For editing capabilities if needed later
 
//   useEffect(() => {
//     if (!canViewDPReceipt) {
//       showError('You do not have permission to view Down Payment Receipt');
//       return;
//     }
//     fetchBookings();
//   }, [canViewDPReceipt]);
 
//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get('/bookings');
      
//       if (response.data.success && response.data.data.bookings) {
//         const bookingOptions = response.data.data.bookings.map(booking => ({
//           value: booking._id,
//           label: `${booking.bookingNumber}`,
//           customerName: booking.customerDetails?.name || 'N/A',
//           bookingNumber: booking.bookingNumber,
//           bookingData: booking
//         }));
//         setBookings(bookingOptions);
//       }
//     } catch (err) {
//       setError('Failed to fetch bookings');
//       console.error('Error fetching bookings:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const fetchBookingDetails = async (bookingId) => {
//     setFetchingDetails(true);
//     try {
//       const response = await axiosInstance.get(`/bookings/${bookingId}`);
      
//       if (response.data.success && response.data.data) {
//         setBookingDetails(response.data.data);
//         setCustomerName(response.data.data.customerDetails?.fullName ||
//                        response.data.data.customerDetails?.name || 'N/A');
//       }
//     } catch (err) {
//       setError('Failed to fetch booking details');
//       console.error('Error fetching booking details:', err);
//     } finally {
//       setFetchingDetails(false);
//     }
//   };
 
//   const handleBookingChange = (selectedOption) => {
//     setSelectedBooking(selectedOption);
    
//     if (selectedOption) {
//       fetchBookingDetails(selectedOption.value);
//     } else {
//       setSelectedBooking(null);
//       setBookingDetails(null);
//       setCustomerName('');
//       setAmount('');
//       setReferenceNo('');
//     }
//   };
 
//   const generateReceiptNumber = () => {
//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     return `RCP${year}${month}${day}${random}`;
//   };
 
//   const getCurrentDate = () => {
//     const date = new Date();
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };
 
//   const handleGenerateReceipt = async () => {
//     if (!canGenerateReceipt) {
//       showError('You do not have permission to generate DP receipts');
//       return;
//     }

//     if (!selectedBooking) {
//       showError('Please select a booking');
//       return;
//     }
//     if (!amount || parseFloat(amount) <= 0) {
//       showError('Please enter a valid amount');
//       return;
//     }
//     if (!paymentMode) {
//       showError('Please select payment mode');
//       return;
//     }
//     if ((paymentMode === 'CHEQUE' || paymentMode === 'DD') && !referenceNo) {
//       showError('Please enter reference number for cheque/DD');
//       return;
//     }
 
//     setGeneratingReceipt(true);
 
//     try {
//       const receiptData = {
//         ...bookingDetails,
//         recentPaymentAmount: parseFloat(amount),
//         recentPaymentAmountRef: referenceNo || `REF${Date.now()}`,
//         recentPaymentAmountType: paymentMode,
//         receiptNumber: generateReceiptNumber(),
//         receiptDate: getCurrentDate()
//       };
 
//       const receiptHTML = generateReceiptHTML(receiptData);
 
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(receiptHTML);
//       printWindow.document.close();
//       printWindow.focus();
//       printWindow.print();
 
//     } catch (error) {
//       console.error('Error generating receipt:', error);
//       showError('Failed to generate receipt');
//     } finally {
//       setGeneratingReceipt(false);
//     }
//   };
  
//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       borderTopLeftRadius: 0,
//       borderBottomLeftRadius: 0,
//       border: '1px solid #d8dbe0',
//       '&:hover': {
//         border: '1px solid #b1b7c1',
//       },
//       boxShadow: 'none',
//       minHeight: '38px',
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected ? '#321fdb' : state.isFocused ? '#e6e6e6' : 'white',
//       color: state.isSelected ? 'white' : 'black',
//       cursor: 'pointer',
//     }),
//   };
  
//   // Early return if no permission to view
//   if (!canViewDPReceipt) {
//     return (
//       <div className="form-container">
//         <div className="title">Down Payment Receipt</div>
//         <div className="form-card">
//           <div className="form-body">
//             <div className="alert alert-danger m-3" role="alert">
//               You do not have permission to view Down Payment Receipt.
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
 
//   return (
//     <div className="form-container">
//       <div className="title">Down Payment Receipt</div>
      
//       {/* Permission info badges */}
//       <div className="mb-3 d-flex gap-2">
//         {canGenerateReceipt && (
//           <span className="badge bg-success">You can generate receipts</span>
//         )}
//         {!canGenerateReceipt && canViewDPReceipt && (
//           <span className="badge bg-warning text-dark">View Only Mode</span>
//         )}
//       </div>
      
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div className="user-details">
 
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Booking Number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilBarcode} />
//                   </CInputGroupText>
//                   <Select
//                     options={bookings}
//                     value={selectedBooking}
//                     onChange={handleBookingChange}
//                     placeholder="-Select-"
//                     isClearable
//                     isSearchable
//                     isLoading={loading}
//                     styles={customSelectStyles}
//                     noOptionsMessage={() => error || 'No bookings found'}
//                     loadingMessage={() => 'Loading bookings...'}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     isDisabled={!canViewDPReceipt}
//                   />
//                 </CInputGroup>
//                 {error && <div className="error-message">{error}</div>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Customer Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     value={customerName}
//                     placeholder={fetchingDetails ? "Loading..." : "Customer name will auto-fill"}
//                     readOnly
//                     disabled={fetchingDetails}
//                   />
//                 </CInputGroup>
//               </div>
              
//              <div className="input-box">
//   <div className="details-container">
//     <span className="details">Receipt Amount (₹)</span>
//     <span className="required">*</span>
//   </div>
//   <CInputGroup>
//     <CInputGroupText className="input-icon">
//       <CIcon icon={cilCash} />
//     </CInputGroupText>
//     <CFormInput
//       type="number"
//       value={amount}
//       onChange={(e) => setAmount(e.target.value)}
//       placeholder="Enter down payment amount"
//       min="0"
//       step="0.01"
//       disabled={!canGenerateReceipt}
//       readOnly={!canGenerateReceipt}
//       className="no-spinner"  // Add this class
//       onWheel={(e) => e.target.blur()}  // Prevent mouse wheel
//       onKeyDown={(e) => {
//         // Prevent up/down arrow keys from changing value
//         if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
//           e.preventDefault();
//         }
//       }}
//     />
//   </CInputGroup>
//   {!canGenerateReceipt && (
//     <small className="text-muted">(View only - cannot edit amount)</small>
//   )}
// </div>
 
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Payment Mode</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilCash} />
//                   </CInputGroupText>
//                   <CFormSelect
//                     value={paymentMode}
//                     onChange={(e) => setPaymentMode(e.target.value)}
//                     disabled={!canGenerateReceipt}
//                   >
//                     <option value="CASH">Cash</option>
//                     <option value="CHEQUE">Cheque</option>
//                     <option value="ONLINE">Online Transfer</option>
//                     <option value="DD">Demand Draft</option>
//                     <option value="CARD">Card Payment</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {!canGenerateReceipt && (
//                   <small className="text-muted">(View only - cannot change payment mode)</small>
//                 )}
//               </div>
 
//               {(paymentMode === 'CHEQUE' || paymentMode === 'DD' || paymentMode === 'ONLINE') && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">
//                       {paymentMode === 'CHEQUE' ? 'Cheque Number' :
//                        paymentMode === 'DD' ? 'DD Number' : 'Transaction ID'}
//                     </span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilBarcode} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       value={referenceNo}
//                       onChange={(e) => setReferenceNo(e.target.value)}
//                       placeholder={`Enter ${paymentMode === 'CHEQUE' ? 'cheque' :
//                                              paymentMode === 'DD' ? 'DD' : 'transaction'} number`}
//                       disabled={!canGenerateReceipt}
//                       readOnly={!canGenerateReceipt}
//                     />
//                   </CInputGroup>
//                   {!canGenerateReceipt && (
//                     <small className="text-muted">(View only - cannot edit reference)</small>
//                   )}
//                 </div>
//               )}
//             </div>
//             <hr />
//             <div className="form-actions">
//               <CButton
//                 color="primary"
//                 onClick={handleGenerateReceipt}
//                 disabled={generatingReceipt || !selectedBooking || !amount || !paymentMode || !canGenerateReceipt}
//                 className="submit-button"
//                 title={
//                   !canGenerateReceipt ? "You don't have permission to generate receipts" :
//                   !selectedBooking ? "Select a booking first" :
//                   !amount ? "Enter an amount" :
//                   !paymentMode ? "Select payment mode" :
//                   ""
//                 }
//               >
//                 <CIcon icon={cilPrint} className="me-2" />
//                 {generatingReceipt ? 'Generating Receipt...' : 
//                  canGenerateReceipt ? 'Generate Receipt' : 'View Only'}
//               </CButton>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
 
// export default DownPaymentReceipt;





import React, { useEffect, useState } from 'react';
import '../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBarcode, cilUser, cilCash, cilPrint } from '@coreui/icons';
import Select from 'react-select';
import { generateReceiptHTML } from '../../utils/receiptTemplate';
import axiosInstance from '../../axiosInstance';
import '../../css/downPaymentReceipt.css';
import { useAuth } from '../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS 
} from '../../utils/modulePermissions';
import { showError } from '../../utils/sweetAlerts';

function DownPaymentReceipt() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [referenceNo, setReferenceNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [error, setError] = useState('');
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  
  const { permissions = [] } = useAuth();

  // ============ DP RECEIPT PERMISSIONS ============
  const canViewDPReceipt = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.DP_RECEIPT, 
    ACTIONS.VIEW
  );

  const canCreateDPReceipt = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.DP_RECEIPT, 
    ACTIONS.CREATE
  );

  const canUpdateDPReceipt = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.DP_RECEIPT, 
    ACTIONS.UPDATE
  );

  const canDeleteDPReceipt = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.DP_RECEIPT, 
    ACTIONS.DELETE
  );

  // Combined permissions
  const canGenerateReceipt = canCreateDPReceipt; // Only CREATE permission for generating new receipts
  const canEditReceipt = canCreateDPReceipt || canUpdateDPReceipt; // For editing capabilities if needed later
 
  useEffect(() => {
    if (!canViewDPReceipt) {
      showError('You do not have permission to view Down Payment Receipt');
      return;
    }
    fetchBookings();
  }, [canViewDPReceipt]);
 
 const fetchBookings = async () => {
  setLoading(true);
  try {
    let allBookings = [];
    let currentPage = 1;
    let totalPages = 1;
    
    // First request to get total pages
    const firstResponse = await axiosInstance.get('/bookings?page=1&limit=100');
    
    if (firstResponse.data.success && firstResponse.data.data.bookings) {
      allBookings = [...firstResponse.data.data.bookings];
      totalPages = firstResponse.data.data.pages || 1;
      
      // Fetch remaining pages
      for (let page = 2; page <= totalPages; page++) {
        const response = await axiosInstance.get(`/bookings?page=${page}&limit=100`);
        if (response.data.success && response.data.data.bookings) {
          allBookings = [...allBookings, ...response.data.data.bookings];
        }
      }
      
      const bookingOptions = allBookings.map(booking => ({
        value: booking._id,
        label: `${booking.bookingNumber}`,
        customerName: booking.customerDetails?.name || 'N/A',
        bookingNumber: booking.bookingNumber,
        bookingData: booking
      }));
      
      setBookings(bookingOptions);
    }
  } catch (err) {
    setError('Failed to fetch bookings');
    console.error('Error fetching bookings:', err);
  } finally {
    setLoading(false);
  }
};
 
  const fetchBookingDetails = async (bookingId) => {
    setFetchingDetails(true);
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      
      if (response.data.success && response.data.data) {
        setBookingDetails(response.data.data);
        setCustomerName(response.data.data.customerDetails?.fullName ||
                       response.data.data.customerDetails?.name || 'N/A');
      }
    } catch (err) {
      setError('Failed to fetch booking details');
      console.error('Error fetching booking details:', err);
    } finally {
      setFetchingDetails(false);
    }
  };
 
  const handleBookingChange = (selectedOption) => {
    setSelectedBooking(selectedOption);
    
    if (selectedOption) {
      fetchBookingDetails(selectedOption.value);
    } else {
      setSelectedBooking(null);
      setBookingDetails(null);
      setCustomerName('');
      setAmount('');
      setReferenceNo('');
    }
  };
 
  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RCP${year}${month}${day}${random}`;
  };
 
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
 
  const handleGenerateReceipt = async () => {
    if (!canGenerateReceipt) {
      showError('You do not have permission to generate DP receipts');
      return;
    }

    if (!selectedBooking) {
      showError('Please select a booking');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showError('Please enter a valid amount');
      return;
    }
    if (!paymentMode) {
      showError('Please select payment mode');
      return;
    }
    if ((paymentMode === 'CHEQUE' || paymentMode === 'DD') && !referenceNo) {
      showError('Please enter reference number for cheque/DD');
      return;
    }
 
    setGeneratingReceipt(true);
 
    try {
      const receiptData = {
        ...bookingDetails,
        recentPaymentAmount: parseFloat(amount),
        recentPaymentAmountRef: referenceNo || `REF${Date.now()}`,
        recentPaymentAmountType: paymentMode,
        receiptNumber: generateReceiptNumber(),
        receiptDate: getCurrentDate()
      };
 
      const receiptHTML = generateReceiptHTML(receiptData);
 
      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
 
    } catch (error) {
      console.error('Error generating receipt:', error);
      showError('Failed to generate receipt');
    } finally {
      setGeneratingReceipt(false);
    }
  };
  
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      border: '1px solid #d8dbe0',
      '&:hover': {
        border: '1px solid #b1b7c1',
      },
      boxShadow: 'none',
      minHeight: '38px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#321fdb' : state.isFocused ? '#e6e6e6' : 'white',
      color: state.isSelected ? 'white' : 'black',
      cursor: 'pointer',
    }),
  };
  
  // Early return if no permission to view
  if (!canViewDPReceipt) {
    return (
      <div className="form-container">
        <div className="title">Down Payment Receipt</div>
        <div className="form-card">
          <div className="form-body">
            <div className="alert alert-danger m-3" role="alert">
              You do not have permission to view Down Payment Receipt.
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="form-container">
      <div className="title">Down Payment Receipt</div>
      
      {/* Permission info badges */}
      <div className="mb-3 d-flex gap-2">
        {canGenerateReceipt && (
          <span className="badge bg-success">You can generate receipts</span>
        )}
        {!canGenerateReceipt && canViewDPReceipt && (
          <span className="badge bg-warning text-dark">View Only Mode</span>
        )}
      </div>
      
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="user-details">
 
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Booking Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBarcode} />
                  </CInputGroupText>
                  <Select
                    options={bookings}
                    value={selectedBooking}
                    onChange={handleBookingChange}
                    placeholder="-Select-"
                    isClearable
                    isSearchable
                    isLoading={loading}
                    styles={customSelectStyles}
                    noOptionsMessage={() => error || 'No bookings found'}
                    loadingMessage={() => 'Loading bookings...'}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!canViewDPReceipt}
                  />
                </CInputGroup>
                {error && <div className="error-message">{error}</div>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Customer Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    value={customerName}
                    placeholder={fetchingDetails ? "Loading..." : "Customer name will auto-fill"}
                    readOnly
                    disabled={fetchingDetails}
                  />
                </CInputGroup>
              </div>
              
             <div className="input-box">
  <div className="details-container">
    <span className="details">Receipt Amount (₹)</span>
    <span className="required">*</span>
  </div>
  <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilCash} />
    </CInputGroupText>
    <CFormInput
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Enter down payment amount"
      min="0"
      step="0.01"
      disabled={!canGenerateReceipt}
      readOnly={!canGenerateReceipt}
      className="no-spinner"  // Add this class
      onWheel={(e) => e.target.blur()}  // Prevent mouse wheel
      onKeyDown={(e) => {
        // Prevent up/down arrow keys from changing value
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
        }
      }}
    />
  </CInputGroup>
  {!canGenerateReceipt && (
    <small className="text-muted">(View only - cannot edit amount)</small>
  )}
</div>
 
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Payment Mode</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCash} />
                  </CInputGroupText>
                  <CFormSelect
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    disabled={!canGenerateReceipt}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ONLINE">Online Transfer</option>
                    <option value="DD">Demand Draft</option>
                    <option value="CARD">Card Payment</option>
                  </CFormSelect>
                </CInputGroup>
                {!canGenerateReceipt && (
                  <small className="text-muted">(View only - cannot change payment mode)</small>
                )}
              </div>
 
              {(paymentMode === 'CHEQUE' || paymentMode === 'DD' || paymentMode === 'ONLINE') && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">
                      {paymentMode === 'CHEQUE' ? 'Cheque Number' :
                       paymentMode === 'DD' ? 'DD Number' : 'Transaction ID'}
                    </span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBarcode} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      placeholder={`Enter ${paymentMode === 'CHEQUE' ? 'cheque' :
                                             paymentMode === 'DD' ? 'DD' : 'transaction'} number`}
                      disabled={!canGenerateReceipt}
                      readOnly={!canGenerateReceipt}
                    />
                  </CInputGroup>
                  {!canGenerateReceipt && (
                    <small className="text-muted">(View only - cannot edit reference)</small>
                  )}
                </div>
              )}
            </div>
            <hr />
            <div className="form-actions">
              <CButton
                color="primary"
                onClick={handleGenerateReceipt}
                disabled={generatingReceipt || !selectedBooking || !amount || !paymentMode || !canGenerateReceipt}
                className="submit-button"
                title={
                  !canGenerateReceipt ? "You don't have permission to generate receipts" :
                  !selectedBooking ? "Select a booking first" :
                  !amount ? "Enter an amount" :
                  !paymentMode ? "Select payment mode" :
                  ""
                }
              >
                <CIcon icon={cilPrint} className="me-2" />
                {generatingReceipt ? 'Generating Receipt...' : 
                 canGenerateReceipt ? 'Generate Receipt' : 'View Only'}
              </CButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DownPaymentReceipt;