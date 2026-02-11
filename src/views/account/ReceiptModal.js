// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CRow,
//   CCol,
//   CBackdrop,
//   CAlert
// } from '@coreui/react';
// import '../../css/receipt.css';
// import '../../css/form.css';
// import axiosInstance from '../../axiosInstance';
// import { useNavigate } from 'react-router-dom';

// const ReceiptModal = ({ show, onClose, bookingData, canCreateReceipts, cashLocations }) => {
//   const [formData, setFormData] = useState({
//     bookingId: bookingData?._id || '',
//     totalAmount: bookingData?.discountedAmount || 0,
//     balanceAmount: bookingData?.balanceAmount || 0,
//     modeOfPayment: '',
//     amount: '',
//     remark: '',
//     cashLocation: '',
//     bank: '',
//     subPaymentMode: '',
//     gcAmount: bookingData?.payment?.gcAmount || 0,
//     transactionReference: '',
//     amountToBeCredited: 0
//   });

//   const [cashLocationsList, setCashLocationsList] = useState(cashLocations || []);
//   const [bankLocations, setBankLocations] = useState([]);
//   const [paymentSubModes, setPaymentSubModes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const updatedData = {
//         ...prev,
//         [name]: value
//       };
//       if (name === 'amount') {
//         const amountValue = parseFloat(value) || 0;
//         const gcAmountValue = parseFloat(prev.gcAmount) || 0;

//         updatedData.amountToBeCredited = amountValue - gcAmountValue;
//       }

//       return updatedData;
//     });
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!canCreateReceipts) {
//     setError('You do not have permission to create receipts');
//     return;
//   }
  
//   setIsLoading(true);
//   setError(null);
//   setSuccess(null);

//   try {
//     let paymentData = {
//       bookingId: formData.bookingId,
//       paymentMode: formData.modeOfPayment,
//       amount: parseFloat(parseFloat(formData.amount).toFixed(2)),
//       remark: formData.remark,
//       transactionReference: formData.transactionReference
//     };

//     switch (formData.modeOfPayment) {
//       case 'Cash':
//         paymentData.cashLocation = formData.cashLocation;
//         break;
//       case 'Bank':
//         paymentData.bank = formData.bank;
//         paymentData.subPaymentMode = formData.subPaymentMode;
//         break;
//       case 'Finance Disbursement':
//         paymentData.financer = bookingData?.payment?.financer?._id || bookingData?.payment?.financer;
//         paymentData.gcAmount = parseFloat(parseFloat(formData.gcAmount).toFixed(2));
//         paymentData.amountToBeCredited = parseFloat(parseFloat(formData.amountToBeCredited).toFixed(2));
//         break;
//       case 'Exchange':
//       case 'Pay Order':
//         paymentData.bank = formData.bank;
//         break;
//       default:
//         break;
//     }

//     // Submit payment
//     const response = await axiosInstance.post('/ledger/receipt', paymentData);
    
//     // IMPORTANT: Log the response to see exact structure
//     console.log('Payment response:', response.data);
    
//     // Try to get receipt data - first check if there's a receipt field
//     // If not, check if there's a ledger field and use that
//     let receiptData = response.data.data?.receipt || response.data.data?.ledger || response.data.data;
    
//     if (!receiptData) {
//       throw new Error('No receipt data returned from server');
//     }
    
//     // Create a proper receipt object with all required fields
//     const receipt = {
//       _id: receiptData._id,
//       id: receiptData.id || receiptData._id,
//       receiptNumber: receiptData.receiptNumber,
//       amount: receiptData.amount,
//       receiptDate: receiptData.receiptDate || receiptData.createdAt,
//       paymentMode: receiptData.paymentMode,
//       transactionReference: receiptData.transactionReference,
//       display: {
//         amount: receiptData.display?.amount || `₹${receiptData.amount}`,
//         date: receiptData.display?.date || (receiptData.receiptDate ? 
//           new Date(receiptData.receiptDate).toLocaleDateString('en-GB') : 
//           new Date().toLocaleDateString('en-GB'))
//       }
//     };
    
//     const newReceiptId = receipt._id || receipt.id;
    
//     if (!newReceiptId) {
//       throw new Error('Receipt ID not returned from server');
//     }
    
//     setSuccess('Payment successfully recorded! Opening receipt...');
    
//     // Reset form
//     setFormData({
//       bookingId: bookingData?._id || '',
//       totalAmount: bookingData?.discountedAmount || 0,
//       balanceAmount: bookingData?.balanceAmount || 0,
//       modeOfPayment: '',
//       amount: '',
//       remark: '',
//       cashLocation: '',
//       bank: '',
//       subPaymentMode: '',
//       gcAmount: bookingData?.payment?.gcAmount || 0,
//       transactionReference: '',
//       amountToBeCredited: 0
//     });
    
//     // Wait for receipt to be saved, then fetch and print
//     setTimeout(async () => {
//       try {
//         // Fetch ALL receipts for this booking
//         const receiptsResponse = await axiosInstance.get(`/ledger/booking/${formData.bookingId}`);
//         const allReceipts = receiptsResponse.data.data.allReceipts || [];
        
//         console.log('All receipts:', allReceipts);
        
//         // Find the position/index of our new receipt
//         const newReceiptIndex = allReceipts.findIndex(r => 
//           r._id === newReceiptId || r.id === newReceiptId || r.receiptNumber === receipt.receiptNumber
//         );
        
//         console.log('New receipt index:', newReceiptIndex);
        
//         // Determine if this is the FIRST receipt EVER for this booking
//         const isFirstReceiptEver = allReceipts.length === 1;
        
//         console.log('Total receipts:', allReceipts.length, 'Is first receipt ever:', isFirstReceiptEver);
        
//         if (typeof window.printReceiptCallback === 'function') {
//           console.log('Calling printReceiptCallback with:', newReceiptId, formData.bookingId, isFirstReceiptEver ? 0 : 1);
//           window.printReceiptCallback(newReceiptId, formData.bookingId, isFirstReceiptEver ? 0 : 1);
//         } else {
//           console.error('printReceiptCallback is not defined on window!');
//         }
//       } catch (fetchError) {
//         console.error('Error fetching receipts:', fetchError);
//         // Fallback - assume it's not the first receipt
//         if (typeof window.printReceiptCallback === 'function') {
//           window.printReceiptCallback(newReceiptId, formData.bookingId, 1);
//         }
//       }
//     }, 1500);
    
//     setTimeout(() => {
//       onClose();
//       // setTimeout(() => navigate('/view-ledgers'), 500);
//     }, 1000);
    
//   } catch (err) {
//     console.error('Payment error:', err);
//     setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to process payment. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };


//   useEffect(() => {
//     const fetchBankLocations = async () => {
//       try {
//         const response = await axiosInstance.get('/banks');
//         setBankLocations(response.data.data.banks);
//       } catch (error) {
//         console.error('Error fetching bank locations:', error);
//       }
//     };

//     const fetchPaymentSubModes = async () => {
//       try {
//         const response = await axiosInstance.get('/banksubpaymentmodes');
//         setPaymentSubModes(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching payment sub-modes:', error);
//         setPaymentSubModes([]);
//       }
//     };

//     if (show) {
//       // Use passed cashLocations or fetch them
//       if (cashLocations && cashLocations.length > 0) {
//         setCashLocationsList(cashLocations);
//       } else {
//         // Fallback fetch if not passed
//         const fetchCashLocations = async () => {
//           try {
//             const response = await axiosInstance.get('/cash-locations');
//             setCashLocationsList(response.data.data.cashLocations);
//           } catch (error) {
//             console.error('Error fetching cash locations:', error);
//           }
//         };
//         fetchCashLocations();
//       }
      
//       fetchBankLocations();
//       fetchPaymentSubModes();

//       const gcAmount = bookingData?.payment?.gcAmount || 0;
//       setFormData({
//         bookingId: bookingData?._id || '',
//         totalAmount: bookingData?.discountedAmount || 0,
//         balanceAmount: bookingData?.balanceAmount || 0,
//         modeOfPayment: '',
//         amount: '',
//         remark: '',
//         cashLocation: '',
//         bank: '',
//         subPaymentMode: '',
//         gcAmount: gcAmount,
//         transactionReference: '',
//         amountToBeCredited: 0 - gcAmount
//       });
//       setError(null);
//       setSuccess(null);
//     }
//   }, [show, bookingData, cashLocations]);

//   const renderPaymentSpecificFields = () => {
//     switch (formData.modeOfPayment) {
//       case 'Cash':
//         return (
//           <CCol md={6}>
//             <label className="form-label">Cash Location</label>
//             <CFormSelect 
//               name="cashLocation" 
//               value={formData.cashLocation} 
//               onChange={handleChange} 
//               required 
//               disabled={isLoading}
//             >
//               <option value="">Select Cash Location</option>
//               {cashLocationsList.map((location) => (
//                 <option key={location.id || location._id} value={location.id || location._id}>
//                   {location.name || location.locationName || 'Unnamed Location'}
//                 </option>
//               ))}
//             </CFormSelect>
//           </CCol>
//         );
//       case 'Bank':
//         return (
//           <>
//             <CCol md={6}>
//               <label className="form-label">Payment Sub Mode</label>
//               <CFormSelect name="subPaymentMode" value={formData.subPaymentMode} onChange={handleChange} required disabled={isLoading}>
//                 <option value="">Select Payment Sub Mode</option>
//                 {paymentSubModes.map((subMode) => (
//                   <option key={subMode.id || subMode._id} value={subMode.id || subMode._id}>
//                     {subMode.payment_mode || subMode.name}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Bank Location</label>
//               <CFormSelect name="bank" value={formData.bank} onChange={handleChange} required disabled={isLoading}>
//                 <option value="">Select Bank Location</option>
//                 {bankLocations.map((location) => (
//                   <option key={location.id || location._id} value={location.id || location._id}>
//                     {location.name}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//           </>
//         );
//       case 'Finance Disbursement':
//         return (
//           <>
//             <CCol md={6}>
//               <label className="form-label">Financer Name</label>
//               <CFormInput type="text" value={bookingData?.payment?.financer?.name || 'N/A'} readOnly className="bg-light" />
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">GC Amount (₹)</label>
//               <CFormInput 
//                 type="number" 
//                 name="gcAmount" 
//                 value={formData.gcAmount ? parseFloat(formData.gcAmount).toFixed(2) : '0.00'} 
//                 readOnly 
//                 className="bg-light" 
//               />
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label mt-3">Amount Credited To Customer Ledger (₹)</label>
//               <CFormInput 
//                 type="number" 
//                 name="amountToBeCredited" 
//                 value={formData.amountToBeCredited ? parseFloat(formData.amountToBeCredited).toFixed(2) : '0.00'} 
//                 readOnly 
//                 className="bg-light" 
//               />
//             </CCol>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
//       <CModal visible={show} onClose={onClose} size="lg" alignment="center">
//         <CModalHeader>
//           <CModalTitle>Account Receipt</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {error && <CAlert color="danger">{error}</CAlert>}
//           {success && (
//             <CAlert color="success">
//               {success}
//               {isLoading && (
//                 <div className="mt-2">
//                   <small>Processing payment and generating receipt...</small>
//                 </div>
//               )}
//             </CAlert>
//           )}

//           <CRow className="mb-3">
//             <CCol md={6}>
//               <label className="form-label">Customer Name</label>
//               <CFormInput type="text" value={bookingData?.customerDetails?.name || ''} readOnly className="bg-light" />
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Chassis Number</label>
//               <CFormInput type="text" value={bookingData?.chassisNumber || ''} readOnly className="bg-light" />
//             </CCol>
//           </CRow>

//           <CRow className="mb-3">
//             <CCol md={6}>
//               <label className="form-label">Total Amount (₹)</label>
//               <CFormInput 
//                 type="number" 
//                 name="totalAmount" 
//                 value={formData.totalAmount ? parseFloat(formData.totalAmount).toFixed(2) : '0.00'} 
//                 readOnly 
//                 className="bg-light font-weight-bold" 
//               />
//             </CCol>
//             <CCol md={6}>
//               <label className="form-label">Balance Amount (₹)</label>
//               <CFormInput
//                 type="number"
//                 name="balanceAmount"
//                 value={formData.balanceAmount ? parseFloat(formData.balanceAmount).toFixed(2) : '0.00'}
//                 readOnly
//                 className={`bg-light font-weight-bold ${parseFloat(formData.balanceAmount) > 0 ? 'text-danger' : 'text-success'}`}
//               />
//             </CCol>
//           </CRow>

//           <CForm onSubmit={handleSubmit}>
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <label className="form-label">Amount (₹)</label>
//                 <CFormInput
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   required
//                   min="0"
//                   step="0.01"
//                   disabled={isLoading}
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <label className="form-label">Mode of Payment</label>
//                 <CFormSelect 
//                   name="modeOfPayment" 
//                   value={formData.modeOfPayment} 
//                   onChange={handleChange} 
//                   required
//                   disabled={isLoading}
//                 >
//                   <option value="">--Select--</option>
//                   <option value="Cash">Cash</option>
//                   <option value="Bank">Bank</option>
//                   <option value="Finance Disbursement">Finance Disbursement</option>
//                   <option value="Exchange">Exchange</option>
//                   <option value="Pay Order">Pay Order</option>
//                 </CFormSelect>
//               </CCol>
//             </CRow>

//             <CRow className="mb-3">{renderPaymentSpecificFields()}</CRow>
//             <CRow className="mb-3">
//               <CCol md={6}>
//                 <label className="form-label">Reference Number</label>
//                 <CFormInput 
//                   type="text" 
//                   name="transactionReference" 
//                   value={formData.transactionReference} 
//                   onChange={handleChange}
//                   disabled={isLoading}
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <label className="form-label">Remark</label>
//                 <CFormInput 
//                   type="text" 
//                   name="remark" 
//                   value={formData.remark} 
//                   onChange={handleChange} 
//                   placeholder="Enter any remarks..."
//                   disabled={isLoading}
//                 />
//               </CCol>
//             </CRow>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <div>
//             <CButton 
//               color="primary" 
//               onClick={handleSubmit} 
//               className="me-2 submit-button" 
//               disabled={isLoading || !canCreateReceipts}
//             >
//               {isLoading ? 'Processing...' : 'Save Payment & Print Receipt'}
//             </CButton>
//           </div>
//           <CButton color="secondary" onClick={onClose} disabled={isLoading}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// export default ReceiptModal;

//////****************** Harshali changes **************/


import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CBackdrop,
  CAlert
} from '@coreui/react';
import '../../css/receipt.css';
import '../../css/form.css';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { showError } from '../../utils/sweetAlerts';

const ReceiptModal = ({ show, onClose, bookingData, canCreateReceipts, cashLocations,  onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    bookingId: bookingData?._id || '',
    totalAmount: bookingData?.discountedAmount || 0,
    balanceAmount: bookingData?.balanceAmount || 0,
    modeOfPayment: '',
    amount: '',
    remark: '',
    cashLocation: '',
    bank: '',
    subPaymentMode: '',
    gcAmount: bookingData?.payment?.gcAmount || 0,
    transactionReference: '',
    amountToBeCredited: 0
  });

  const [cashLocationsList, setCashLocationsList] = useState(cashLocations || []);
  const [bankLocations, setBankLocations] = useState([]);
  const [paymentSubModes, setPaymentSubModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value
      };
      if (name === 'amount') {
        const amountValue = parseFloat(value) || 0;
        const gcAmountValue = parseFloat(prev.gcAmount) || 0;

        updatedData.amountToBeCredited = amountValue - gcAmountValue;
      }

      return updatedData;
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!canCreateReceipts) {
    setError('You do not have permission to create receipts');
    return;
  }
  
  setIsLoading(true);
  setError(null);
  setSuccess(null);

  try {
    let paymentData = {
      bookingId: formData.bookingId,
      paymentMode: formData.modeOfPayment,
      amount: parseFloat(parseFloat(formData.amount).toFixed(2)),
      remark: formData.remark,
      transactionReference: formData.transactionReference
    };

    switch (formData.modeOfPayment) {
      case 'Cash':
        paymentData.cashLocation = formData.cashLocation;
        break;
      case 'Bank':
        paymentData.bank = formData.bank;
        paymentData.subPaymentMode = formData.subPaymentMode;
        break;
      case 'Finance Disbursement':
        paymentData.financer = bookingData?.payment?.financer?._id || bookingData?.payment?.financer;
        paymentData.gcAmount = parseFloat(parseFloat(formData.gcAmount).toFixed(2));
        paymentData.amountToBeCredited = parseFloat(parseFloat(formData.amountToBeCredited).toFixed(2));
        break;
      case 'Exchange':
      case 'Pay Order':
        paymentData.bank = formData.bank;
        break;
      default:
        break;
    }

  
    const response = await axiosInstance.post('/ledger/receipt', paymentData);
    
    console.log('Payment response:', response.data);

    let receiptData = response.data.data?.receipt || response.data.data?.ledger || response.data.data;
    
    if (!receiptData) {
      throw new Error('No receipt data returned from server');
    }
    
    const receipt = {
      _id: receiptData._id,
      id: receiptData.id || receiptData._id,
      receiptNumber: receiptData.receiptNumber,
      amount: receiptData.amount,
      receiptDate: receiptData.receiptDate || receiptData.createdAt,
      paymentMode: receiptData.paymentMode,
      transactionReference: receiptData.transactionReference,
      display: {
        amount: receiptData.display?.amount || `₹${receiptData.amount}`,
        date: receiptData.display?.date || (receiptData.receiptDate ? 
          new Date(receiptData.receiptDate).toLocaleDateString('en-GB') : 
          new Date().toLocaleDateString('en-GB'))
      }
    };
    
    const newReceiptId = receipt._id || receipt.id;
    
    if (!newReceiptId) {
      throw new Error('Receipt ID not returned from server');
    }
    
    setSuccess('Payment successfully recorded! Opening receipt...');
    
    // Reset form
    setFormData({
      bookingId: bookingData?._id || '',
      totalAmount: bookingData?.discountedAmount || 0,
      balanceAmount: bookingData?.balanceAmount || 0,
      modeOfPayment: '',
      amount: '',
      remark: '',
      cashLocation: '',
      bank: '',
      subPaymentMode: '',
      gcAmount: bookingData?.payment?.gcAmount || 0,
      transactionReference: '',
      amountToBeCredited: 0
    });
    if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    
    setTimeout(async () => {
      try {
        const receiptsResponse = await axiosInstance.get(`/ledger/booking/${formData.bookingId}`);
        const allReceipts = receiptsResponse.data.data.allReceipts || [];
        
        console.log('All receipts:', allReceipts);
        
        const newReceiptIndex = allReceipts.findIndex(r => 
          r._id === newReceiptId || r.id === newReceiptId || r.receiptNumber === receipt.receiptNumber
        );
        
        console.log('New receipt index:', newReceiptIndex);
        
       
        const isFirstReceiptEver = allReceipts.length === 1;
        
        console.log('Total receipts:', allReceipts.length, 'Is first receipt ever:', isFirstReceiptEver);
        
        if (typeof window.printReceiptCallback === 'function') {
          console.log('Calling printReceiptCallback with:', newReceiptId, formData.bookingId, isFirstReceiptEver ? 0 : 1);
          window.printReceiptCallback(newReceiptId, formData.bookingId, isFirstReceiptEver ? 0 : 1);
        } else {
          console.error('printReceiptCallback is not defined on window!');
        }
      } catch (fetchError) {
        console.error('Error fetching receipts:', fetchError);
        
        if (typeof window.printReceiptCallback === 'function') {
          window.printReceiptCallback(newReceiptId, formData.bookingId, 1);
        }
      }
    }, 1500);
    
    setTimeout(() => {
      onClose();
      // setTimeout(() => navigate('/account/receipt'), 500);
    }, 1000);
    
  } catch (err) {
    console.error('Payment error:', err);
    setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to process payment. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    const fetchBankLocations = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        setBankLocations(response.data.data.banks);
      } catch (error) {
        console.error('Error fetching bank locations:', error);
      }
    };

    const fetchPaymentSubModes = async () => {
      try {
        const response = await axiosInstance.get('/banksubpaymentmodes');
        setPaymentSubModes(response.data.data || []);
      } catch (error) {
        console.error('Error fetching payment sub-modes:', error);
        setPaymentSubModes([]);
      }
    };

    if (show) {

      if (cashLocations && cashLocations.length > 0) {
        setCashLocationsList(cashLocations);
      } else {
        const fetchCashLocations = async () => {
          try {
            const response = await axiosInstance.get('/cash-locations');
            setCashLocationsList(response.data.data.cashLocations);
          } catch (error) {
            console.error('Error fetching cash locations:', error);
          }
        };
        fetchCashLocations();
      }
      
      fetchBankLocations();
      fetchPaymentSubModes();

      const gcAmount = bookingData?.payment?.gcAmount || 0;
      setFormData({
        bookingId: bookingData?._id || '',
        totalAmount: bookingData?.discountedAmount || 0,
        balanceAmount: bookingData?.balanceAmount || 0,
        modeOfPayment: '',
        amount: '',
        remark: '',
        cashLocation: '',
        bank: '',
        subPaymentMode: '',
        gcAmount: gcAmount,
        transactionReference: '',
        amountToBeCredited: 0 - gcAmount
      });
      setError(null);
      setSuccess(null);
    }
  }, [show, bookingData, cashLocations]);

  const renderPaymentSpecificFields = () => {
    switch (formData.modeOfPayment) {
      case 'Cash':
        return (
          <CCol md={6}>
            <label className="form-label">Cash Location</label>
            <CFormSelect 
              name="cashLocation" 
              value={formData.cashLocation} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            >
              <option value="">Select Cash Location</option>
              {cashLocationsList.map((location) => (
                <option key={location.id || location._id} value={location.id || location._id}>
                  {location.name || location.locationName || 'Unnamed Location'}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        );
      case 'Bank':
        return (
          <>
            <CCol md={6}>
              <label className="form-label">Payment Sub Mode</label>
              <CFormSelect name="subPaymentMode" value={formData.subPaymentMode} onChange={handleChange} required disabled={isLoading}>
                <option value="">Select Payment Sub Mode</option>
                {paymentSubModes.map((subMode) => (
                  <option key={subMode.id || subMode._id} value={subMode.id || subMode._id}>
                    {subMode.payment_mode || subMode.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Bank Location</label>
              <CFormSelect name="bank" value={formData.bank} onChange={handleChange} required disabled={isLoading}>
                <option value="">Select Bank Location</option>
                {bankLocations.map((location) => (
                  <option key={location.id || location._id} value={location.id || location._id}>
                    {location.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </>
        );
      case 'Finance Disbursement':
        return (
          <>
            <CCol md={6}>
              <label className="form-label">Financer Name</label>
              <CFormInput type="text" value={bookingData?.payment?.financer?.name || 'N/A'} readOnly className="bg-light" />
            </CCol>
            <CCol md={6}>
              <label className="form-label">GC Amount (₹)</label>
              <CFormInput 
                type="number" 
                name="gcAmount" 
                value={formData.gcAmount ? parseFloat(formData.gcAmount).toFixed(2) : '0.00'} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label mt-3">Amount Credited To Customer Ledger (₹)</label>
              <CFormInput 
                type="number" 
                name="amountToBeCredited" 
                value={formData.amountToBeCredited ? parseFloat(formData.amountToBeCredited).toFixed(2) : '0.00'} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center">
        <CModalHeader>
          <CModalTitle>Account Receipt</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && (
            <CAlert color="success">
              {success}
              {isLoading && (
                <div className="mt-2">
                  <small>Processing payment and generating receipt...</small>
                </div>
              )}
            </CAlert>
          )}

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput type="text" value={bookingData?.customerDetails?.name || ''} readOnly className="bg-light" />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput type="text" value={bookingData?.chassisNumber || ''} readOnly className="bg-light" />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Total Amount (₹)</label>
              <CFormInput 
                type="number" 
                name="totalAmount" 
                value={formData.totalAmount ? parseFloat(formData.totalAmount).toFixed(2) : '0.00'} 
                readOnly 
                className="bg-light font-weight-bold" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Balance Amount (₹)</label>
              <CFormInput
                type="number"
                name="balanceAmount"
                value={formData.balanceAmount ? parseFloat(formData.balanceAmount).toFixed(2) : '0.00'}
                readOnly
                className={`bg-light font-weight-bold ${parseFloat(formData.balanceAmount) > 0 ? 'text-danger' : 'text-success'}`}
              />
            </CCol>
          </CRow>

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Amount (₹)</label>
                <CFormInput
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Mode of Payment</label>
                <CFormSelect 
                  name="modeOfPayment" 
                  value={formData.modeOfPayment} 
                  onChange={handleChange} 
                  required
                  disabled={isLoading}
                >
                  <option value="">--Select--</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Finance Disbursement">Finance Disbursement</option>
                  <option value="Exchange">Exchange</option>
                  <option value="Pay Order">Pay Order</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">{renderPaymentSpecificFields()}</CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Reference Number</label>
                <CFormInput 
                  type="text" 
                  name="transactionReference" 
                  value={formData.transactionReference} 
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Remark</label>
                <CFormInput 
                  type="text" 
                  name="remark" 
                  value={formData.remark} 
                  onChange={handleChange} 
                  placeholder="Enter any remarks..."
                  disabled={isLoading}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <div>
            <CButton 
              color="primary" 
              onClick={handleSubmit} 
              className="me-2 submit-button" 
              disabled={isLoading || !canCreateReceipts}
            >
              {isLoading ? 'Processing...' : 'Save Payment & Print Receipt'}
            </CButton>
          </div>
          <CButton color="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ReceiptModal;

