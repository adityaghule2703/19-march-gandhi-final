// import React, { useState, useEffect } from 'react';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormLabel,
//   CFormInput,
//   CFormSelect,
//   CSpinner,
//   CAlert,
//   CFormTextarea,
//   CInputGroup,
//   CNav,
//   CNavItem,
//   CNavLink
// } from '@coreui/react';
// import axiosInstance from 'src/axiosInstance';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSearch } from '@coreui/icons';
// import { showError } from '../../../utils/sweetAlerts';

// function SubdealerCustomerManagement() {
//   const [subdealers, setSubdealers] = useState([]);
//   const [selectedSubdealer, setSelectedSubdealer] = useState('');
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [filteredAccessories, setFilteredAccessories] = useState([]);
//   const [receipts, setReceipts] = useState([]);
//   const [selectedReceipt, setSelectedReceipt] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingAccessories, setLoadingAccessories] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [subdealerData, setSubdealerData] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [accessorySearchTerm, setAccessorySearchTerm] = useState('');
//   const [activeView, setActiveView] = useState('bookings');

//   // Booking Payment Modal States
//   const [bookingModalVisible, setBookingModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [bookingPaymentData, setBookingPaymentData] = useState({
//     amount: '',
//     remark: ''
//   });
//   const [submittingBookingPayment, setSubmittingBookingPayment] = useState(false);

//   // Accessory Payment Modal States
//   const [accessoryModalVisible, setAccessoryModalVisible] = useState(false);
//   const [selectedAccessory, setSelectedAccessory] = useState(null);
//   const [accessoryPaymentData, setAccessoryPaymentData] = useState({
//     amount: '',
//     remark: ''
//   });
//   const [submittingAccessoryPayment, setSubmittingAccessoryPayment] = useState(false);

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };

//     fetchSubdealers();
//   }, []);

//   useEffect(() => {
//     if (selectedSubdealer) {
//       fetchSubdealerFinancialSummary();
//       fetchSubdealerReceipts();
//       fetchSubdealerAccessories();
//     } else {
//       setBookings([]);
//       setFilteredBookings([]);
//       setAccessories([]);
//       setFilteredAccessories([]);
//       setReceipts([]);
//       setSubdealerData(null);
//       setSelectedReceipt('');
//       setSearchTerm('');
//       setAccessorySearchTerm('');
//     }
//   }, [selectedSubdealer]);

//   useEffect(() => {
//     if (bookings.length > 0) {
//       let filtered = bookings.filter((booking) => booking.balanceAmount != 0);

//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         filtered = filtered.filter(
//           (booking) => booking.customerDetails.name.toLowerCase().includes(term) || booking.bookingNumber.toLowerCase().includes(term)
//         );
//       }

//       setFilteredBookings(filtered);
//     } else {
//       setFilteredBookings([]);
//     }
//   }, [bookings, searchTerm]);

//   useEffect(() => {
//     if (accessories.length > 0) {
//       // Filter out paid accessories and show only pending ones
//       let filtered = accessories.filter(accessory => {
//         const balance = calculateAccessoryBalance(accessory);
//         return balance > 0; // Only show accessories with balance > 0
//       });

//       if (accessorySearchTerm) {
//         const term = accessorySearchTerm.toLowerCase();
//         filtered = filtered.filter(
//           (accessory) => 
//             accessory._id.toLowerCase().includes(term) ||
//             accessory.remark?.toLowerCase().includes(term)
//         );
//       }

//       setFilteredAccessories(filtered);
//     } else {
//       setFilteredAccessories([]);
//     }
//   }, [accessories, accessorySearchTerm]);

//   const fetchSubdealerFinancialSummary = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axiosInstance.get(`/subdealers/${selectedSubdealer}/financial-summary`);
//       setSubdealerData(response.data.data);
//       setBookings(response.data.data.recentTransactions || []);
//     } catch (error) {
//       console.error('Error fetching subdealer financial summary:', error);
//       setError('Failed to load financial data for this subdealer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubdealerReceipts = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
//       setReceipts(response.data.docs || []);
//     } catch (error) {
//       console.error('Error fetching subdealer receipts:', error);
//       setError('Failed to load receipt data');
//     }
//   };

//   const fetchSubdealerAccessories = async () => {
//     setLoadingAccessories(true);
//     try {
//       const response = await axiosInstance.get(`/accessory-billing/subdealer/${selectedSubdealer}`);
//       console.log('Accessories response:', response.data);
//       setAccessories(response.data.data.billings || []);
//     } catch (error) {
//       console.error('Error fetching subdealer accessories:', error);
//       setError('Failed to load accessory data: ' + error.message);
//     } finally {
//       setLoadingAccessories(false);
//     }
//   };

//   const handleSubdealerChange = (e) => {
//     setSelectedSubdealer(e.target.value);
//     setSelectedReceipt('');
//     setActiveView('bookings');
//   };

//   const handleReceiptChange = (e) => {
//     setSelectedReceipt(e.target.value);
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleAccessorySearchChange = (e) => {
//     setAccessorySearchTerm(e.target.value);
//   };

//   // Booking Payment Functions
//   const openBookingPaymentModal = (booking) => {
//     setSelectedBooking(booking);
//     setBookingPaymentData({
//       amount: '',
//       remark: ''
//     });
//     setBookingModalVisible(true);
//   };

//   const handleBookingPaymentChange = (e) => {
//     const { name, value } = e.target;
//     setBookingPaymentData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmitBookingPayment = async () => {
//     if (!bookingPaymentData.amount || parseFloat(bookingPaymentData.amount) <= 0) {
//       setError('Valid amount is required');
//       return;
//     }

//     if (!selectedReceipt) {
//       setError('Please select a UTR receipt first');
//       return;
//     }

//     if (!selectedBooking || !selectedBooking._id) {
//       setError('Booking information is missing');
//       return;
//     }

//     if (parseFloat(bookingPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
//       setError('Amount cannot exceed the remaining amount of the selected UTR');
//       return;
//     }

//     setSubmittingBookingPayment(true);
//     try {
//       const payload = {
//         allocations: [
//           {
//             bookingId: selectedBooking._id,
//             amount: parseFloat(bookingPaymentData.amount),
//             remark: bookingPaymentData.remark || ''
//           }
//         ]
//       };

//       await axiosInstance.post(`/subdealersonaccount/receipts/${selectedReceipt}/allocate`, payload);

//       setSuccess('Payment allocated successfully!');
//       setBookingModalVisible(false);

//       // Refresh data
//       fetchSubdealerFinancialSummary();
//       fetchSubdealerReceipts();
//     } catch (error) {
//       console.error('Error allocating payment:', error);
//       setError('Failed to allocate payment: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setSubmittingBookingPayment(false);
//     }
//   };

//   // Accessory Payment Functions
//   const openAccessoryPaymentModal = (accessory) => {
//     setSelectedAccessory(accessory);
//     const balance = calculateAccessoryBalance(accessory);
//     setAccessoryPaymentData({
//       amount: balance.toString(), // Pre-fill with full balance
//       remark: ''
//     });
//     setAccessoryModalVisible(true);
//   };

//   const handleAccessoryPaymentChange = (e) => {
//     const { name, value } = e.target;
//     setAccessoryPaymentData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmitAccessoryPayment = async () => {
//     if (!accessoryPaymentData.amount || parseFloat(accessoryPaymentData.amount) <= 0) {
//       setError('Valid amount is required');
//       return;
//     }

//     if (!selectedReceipt) {
//       setError('Please select a UTR receipt first');
//       return;
//     }

//     if (!selectedAccessory || !selectedAccessory._id) {
//       setError('Accessory information is missing');
//       return;
//     }

//     if (parseFloat(accessoryPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
//       setError('Amount cannot exceed the remaining amount of the selected UTR');
//       return;
//     }

//     const accessoryBalance = calculateAccessoryBalance(selectedAccessory);
//     if (parseFloat(accessoryPaymentData.amount) > accessoryBalance) {
//       setError(`Amount cannot exceed the accessory balance of ₹${accessoryBalance.toLocaleString()}`);
//       return;
//     }

//     setSubmittingAccessoryPayment(true);
//     try {
//       const payload = {
//         receiptId: selectedReceipt,
//         amount: parseFloat(accessoryPaymentData.amount),
//         remark: accessoryPaymentData.remark || ''
//       };

//       // Use the API endpoint for accessory payments
//       await axiosInstance.post(`/subdealersonaccount/accessory-billings/${selectedAccessory._id}/pay-from-on-account`, payload);

//       setSuccess('Accessory payment allocated successfully!');
//       setAccessoryModalVisible(false);

//       // Refresh data
//       fetchSubdealerAccessories();
//       fetchSubdealerReceipts();
//     } catch (error) {
//       console.error('Error allocating accessory payment:', error);
//       setError('Failed to allocate accessory payment: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setSubmittingAccessoryPayment(false);
//     }
//   };

//   const getRemainingAmount = (receiptId) => {
//     const receipt = receipts.find((r) => r._id === receiptId);
//     if (!receipt) return 0;
//     return receipt.amount - receipt.allocatedTotal;
//   };

//   const calculateAccessoryBalance = (accessory) => {
//     // For accessories with CREDIT payment_type, calculate balance
//     if (accessory.payment_type === 'CREDIT' && accessory.payment_status !== 'Paid') {
//       return accessory.net_amount;
//     }
//     return 0;
//   };

//   return (
//     <div>
//       <h4>Distribute OnAccount Balance</h4>
//       {error && (
//         <CAlert color="danger" dismissible onClose={() => setError('')}>
//           {error}
//         </CAlert>
//       )}

//       {success && (
//         <CAlert color="success" dismissible onClose={() => setSuccess('')}>
//           {success}
//         </CAlert>
//       )}

//       <CRow>
//         <CCol xs={12}>
//           <CCard className="mb-4">
//             <CCardHeader>
//               <h5>Subdealer Payment Allocation</h5>
//             </CCardHeader>
//             <CCardBody>
//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
//                   <CFormSelect id="subdealerSelect" value={selectedSubdealer} onChange={handleSubdealerChange}>
//                     <option value="">-- Select Subdealer --</option>
//                     {subdealers.map((subdealer) => (
//                       <option key={subdealer._id} value={subdealer._id}>
//                         {subdealer.name} - {subdealer.location}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>

//                 <CCol md={6}>
//                   <CFormLabel htmlFor="receiptSelect">Select UTR/Receipt</CFormLabel>
//                   <CFormSelect id="receiptSelect" value={selectedReceipt} onChange={handleReceiptChange} disabled={!selectedSubdealer}>
//                     <option value="">-- Select UTR/Receipt --</option>
//                     {receipts.map((receipt) => {
//                       const remainingAmount = receipt.amount - receipt.allocatedTotal;
//                       return (
//                         <option key={receipt._id} value={receipt._id} disabled={remainingAmount <= 0}>
//                           {receipt.refNumber} - ₹{remainingAmount.toLocaleString()} remaining
//                         </option>
//                       );
//                     })}
//                   </CFormSelect>
//                   <small className="text-muted">Select a UTR to allocate payments against available funds</small>
//                 </CCol>
//               </CRow>

//               {subdealerData && (
//                 <CCard className="mb-4">
//                   <CCardHeader>
//                     <h6>Subdealer Summary: {subdealerData.subdealer.name}</h6>
//                   </CCardHeader>
//                   <CCardBody>
//                     <CRow>
//                       <CCol md={3}>
//                         <strong>Total Bookings:</strong> {subdealerData.bookingSummary.totalBookings}
//                       </CCol>
//                       <CCol md={3}>
//                         <strong>Total Amount:</strong> ₹{subdealerData.bookingSummary.totalBookingAmount.toLocaleString()}
//                       </CCol>
//                       <CCol md={3}>
//                         <strong>Received:</strong> ₹{subdealerData.bookingSummary.totalReceivedAmount.toLocaleString()}
//                       </CCol>
//                       <CCol md={3}>
//                         <strong>Remaining:</strong> ₹{subdealerData.financialOverview.totalOutstanding.toLocaleString()}
//                       </CCol>
//                     </CRow>
//                     {receipts.length > 0 && (
//                       <CRow className="mt-3">
//                         <CCol>
//                           <strong>OnAccount Balance:</strong> ₹
//                           {receipts.reduce((sum, receipt) => sum + (receipt.amount - receipt.allocatedTotal), 0).toLocaleString()}
//                         </CCol>
//                       </CRow>
//                     )}
//                   </CCardBody>
//                 </CCard>
//               )}

//               {selectedSubdealer && (
//                 <>
//                   <CNav variant="tabs" className="mb-3">
//                     <CNavItem>
//                       <CNavLink
//                         active={activeView === 'bookings'}
//                         onClick={() => setActiveView('bookings')}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Bookings
//                       </CNavLink>
//                     </CNavItem>
//                     <CNavItem>
//                       <CNavLink
//                         active={activeView === 'accessories'}
//                         onClick={() => setActiveView('accessories')}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Accessories
//                       </CNavLink>
//                     </CNavItem>
//                   </CNav>

//                   {activeView === 'bookings' && (
//                     <>
//                       {!loading && selectedSubdealer && (
//                         <CRow className="mb-3">
//                           <CCol md={4}>
//                             <CInputGroup>
//                               <CFormInput
//                                 placeholder="Search by customer name or booking number..."
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                               />
//                               <CButton type="button" color="secondary">
//                                 <CIcon icon={cilSearch} style={{ height: '25px' }} />
//                               </CButton>
//                             </CInputGroup>
//                             <small className="text-muted">Showing only NPF customers</small>
//                           </CCol>
//                         </CRow>
//                       )}

//                       {loading && (
//                         <div className="text-center py-4">
//                           <CSpinner />
//                           <p>Loading booking data...</p>
//                         </div>
//                       )}

//                       {!loading && selectedSubdealer && filteredBookings.length > 0 && (
//                         <CTable striped hover responsive>
//                           <CTableHead>
//                             <CTableRow>
//                               <CTableHeaderCell>Sr No</CTableHeaderCell>
//                               <CTableHeaderCell>Booking #</CTableHeaderCell>
//                               <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                               <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Received (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Date</CTableHeaderCell>
//                               <CTableHeaderCell>Action</CTableHeaderCell>
//                             </CTableRow>
//                           </CTableHead>
//                           <CTableBody>
//                             {filteredBookings.map((booking, index) => (
//                               <CTableRow key={index}>
//                                  <CTableDataCell>{index+1}</CTableDataCell>
//                                 <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                                 <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                                 <CTableDataCell>₹{booking.totalAmount.toLocaleString()}</CTableDataCell>
//                                 <CTableDataCell>₹{booking.receivedAmount.toLocaleString()}</CTableDataCell>
//                                 <CTableDataCell>₹{booking.balanceAmount.toLocaleString()}</CTableDataCell>
//                                 <CTableDataCell>{new Date(booking.createdAt).toLocaleDateString()}</CTableDataCell>
//                                 <CTableDataCell>
//                                   <CButton
//                                     color="primary"
//                                     size="sm"
//                                     onClick={() => openBookingPaymentModal(booking)}
//                                     disabled={!selectedReceipt}
//                                     title={!selectedReceipt ? 'Please select a UTR first' : 'Add payment'}
//                                   >
//                                     <CIcon icon={cilPlus} style={{ height: '15px' }} />
//                                   </CButton>
//                                 </CTableDataCell>
//                               </CTableRow>
//                             ))}
//                           </CTableBody>
//                         </CTable>
//                       )}

//                       {!loading && selectedSubdealer && filteredBookings.length === 0 && (
//                         <div className="text-center py-4">
//                           <p>
//                             {searchTerm
//                               ? `No bookings found with zero balance matching "${searchTerm}"`
//                               : 'No bookings found with zero balance for this subdealer.'}
//                           </p>
//                         </div>
//                       )}
//                     </>
//                   )}

//                   {activeView === 'accessories' && (
//                     <>
//                       {!loadingAccessories && selectedSubdealer && (
//                         <CRow className="mb-3">
//                           <CCol md={4}>
//                             <CInputGroup>
//                               <CFormInput
//                                 placeholder="Search by ID or remark..."
//                                 value={accessorySearchTerm}
//                                 onChange={handleAccessorySearchChange}
//                               />
//                               <CButton type="button" color="secondary">
//                                 <CIcon icon={cilSearch} style={{ height: '25px' }} />
//                               </CButton>
//                             </CInputGroup>
//                             <small className="text-muted">Showing accessories with pending payments</small>
//                           </CCol>
//                         </CRow>
//                       )}

//                       {loadingAccessories && (
//                         <div className="text-center py-4">
//                           <CSpinner />
//                           <p>Loading accessory data...</p>
//                         </div>
//                       )}

//                       {!loadingAccessories && selectedSubdealer && filteredAccessories.length > 0 && (
//                         <CTable striped hover responsive>
//                           <CTableHead>
//                             <CTableRow>
//                               <CTableHeaderCell>Sr No</CTableHeaderCell>
//                               <CTableHeaderCell>Invoice ID</CTableHeaderCell>
//                               <CTableHeaderCell>Payment Type</CTableHeaderCell>
//                               <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Net Amount (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Date</CTableHeaderCell>
//                               <CTableHeaderCell>Remark</CTableHeaderCell>
//                               <CTableHeaderCell>Action</CTableHeaderCell>
//                             </CTableRow>
//                           </CTableHead>
//                           <CTableBody>
//                             {filteredAccessories.map((accessory, index) => {
//                               const balance = calculateAccessoryBalance(accessory);
//                               return (
//                                 <CTableRow key={index}>
//                                   <CTableDataCell>{index+1}</CTableDataCell>
//                                   <CTableDataCell>{accessory._id.substring(accessory._id.length - 6)}</CTableDataCell>
//                                   <CTableDataCell>{accessory.payment_type}</CTableDataCell>
//                                   <CTableDataCell>₹{accessory.total_amount?.toLocaleString()}</CTableDataCell>
//                                   <CTableDataCell>₹{accessory.net_amount?.toLocaleString()}</CTableDataCell>
//                                   <CTableDataCell>{new Date(accessory.createdAt).toLocaleDateString()}</CTableDataCell>
//                                   <CTableDataCell>{accessory.remark || '-'}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <CButton
//                                       color="primary"
//                                       size="sm"
//                                       onClick={() => openAccessoryPaymentModal(accessory)}
//                                       disabled={!selectedReceipt}
//                                       title={!selectedReceipt ? 'Please select a UTR first' : 'Add payment'}
//                                     >
//                                       <CIcon icon={cilPlus} style={{ height: '15px' }} />
//                                     </CButton>
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               );
//                             })}
//                           </CTableBody>
//                         </CTable>
//                       )}

//                       {!loadingAccessories && selectedSubdealer && filteredAccessories.length === 0 && (
//                         <div className="text-center py-4">
//                           <p>
//                             {accessorySearchTerm
//                               ? `No pending accessories found matching "${accessorySearchTerm}"`
//                               : 'No pending accessory billings found for this subdealer.'}
//                           </p>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Booking Payment Allocation Modal */}
//       <CModal visible={bookingModalVisible} onClose={() => setBookingModalVisible(false)}>
//         <CModalHeader onClose={() => setBookingModalVisible(false)}>
//           <CModalTitle>Allocate Payment to Booking</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <CRow>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel>Customer Name</CFormLabel>
//                   <CFormInput type="text" value={selectedBooking?.customerDetails?.name || ''} disabled readOnly />
//                 </div>
//               </CCol>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel>Booking Number</CFormLabel>
//                   <CFormInput type="text" value={selectedBooking?.bookingNumber || ''} disabled readOnly />
//                 </div>
//               </CCol>
//             </CRow>

//             <div className="mb-3">
//               <CFormLabel>Booking ID</CFormLabel>
//               <CFormInput type="text" value={selectedBooking?._id || ''} disabled readOnly />
//             </div>

//             <CRow>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="amount">Amount to Allocate (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="amount"
//                     name="amount"
//                     value={bookingPaymentData.amount}
//                     onChange={handleBookingPaymentChange}
//                     placeholder="Enter amount"
//                     required
//                     min="0.01"
//                     step="0.01"
//                     max={selectedReceipt ? getRemainingAmount(selectedReceipt) : undefined}
//                   />
//                   {selectedReceipt && <small className="text-muted">Max: ₹{getRemainingAmount(selectedReceipt).toLocaleString()}</small>}
//                 </div>
//               </CCol>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="remark">Remark (Optional)</CFormLabel>
//                   <CFormInput
//                     id="remark"
//                     name="remark"
//                     value={bookingPaymentData.remark}
//                     onChange={handleBookingPaymentChange}
//                     placeholder="Enter any remarks"
//                   />
//                 </div>
//               </CCol>
//             </CRow>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setBookingModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleSubmitBookingPayment} disabled={submittingBookingPayment}>
//             {submittingBookingPayment ? (
//               <>
//                 <CSpinner component="span" size="sm" aria-hidden="true" />
//                 Allocating...
//               </>
//             ) : (
//               <>Allocate Payment</>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Accessory Payment Allocation Modal */}
//       <CModal visible={accessoryModalVisible} onClose={() => setAccessoryModalVisible(false)}>
//         <CModalHeader onClose={() => setAccessoryModalVisible(false)}>
//           <CModalTitle>Allocate Payment to Accessory</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <div className="mb-3">
//               <CFormLabel>Accessory Invoice ID</CFormLabel>
//               <CFormInput 
//                 type="text" 
//                 value={selectedAccessory ? selectedAccessory._id.substring(selectedAccessory._id.length - 6) : ''} 
//                 disabled 
//                 readOnly 
//               />
//             </div>

//             <div className="mb-3">
//               <CFormLabel>Net Amount</CFormLabel>
//               <CFormInput 
//                 type="text" 
//                 value={selectedAccessory ? `₹${selectedAccessory.net_amount?.toLocaleString()}` : ''} 
//                 disabled 
//                 readOnly 
//               />
//             </div>

//             <div className="mb-3">
//               <CFormLabel>Balance Amount</CFormLabel>
//               <CFormInput 
//                 type="text" 
//                 value={selectedAccessory ? `₹${calculateAccessoryBalance(selectedAccessory).toLocaleString()}` : ''} 
//                 disabled 
//                 readOnly 
//               />
//             </div>

//             <div className="mb-3">
//               <CFormLabel htmlFor="accessoryAmount">Amount to Allocate (₹)</CFormLabel>
//               <CFormInput
//                 type="number"
//                 id="accessoryAmount"
//                 name="amount"
//                 value={accessoryPaymentData.amount}
//                 onChange={handleAccessoryPaymentChange}
//                 placeholder="Enter amount"
//                 required
//                 min="0.01"
//                 step="0.01"
//                 max={Math.min(
//                   selectedReceipt ? getRemainingAmount(selectedReceipt) : 0,
//                   selectedAccessory ? calculateAccessoryBalance(selectedAccessory) : 0
//                 )}
//               />
//               <small className="text-muted">
//                 {selectedReceipt && selectedAccessory && (
//                   `Max: ₹${Math.min(
//                     getRemainingAmount(selectedReceipt),
//                     calculateAccessoryBalance(selectedAccessory)
//                   ).toLocaleString()}`
//                 )}
//               </small>
//             </div>

//             <div className="mb-3">
//               <CFormLabel htmlFor="accessoryRemark">Remark (Optional)</CFormLabel>
//               <CFormTextarea
//                 id="accessoryRemark"
//                 name="remark"
//                 value={accessoryPaymentData.remark}
//                 onChange={handleAccessoryPaymentChange}
//                 placeholder="Enter any remarks"
//                 rows={3}
//               />
//             </div>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setAccessoryModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleSubmitAccessoryPayment} disabled={submittingAccessoryPayment}>
//             {submittingAccessoryPayment ? (
//               <>
//                 <CSpinner component="span" size="sm" aria-hidden="true" />
//                 Allocating...
//               </>
//             ) : (
//               <>Allocate Payment</>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// }

// export default SubdealerCustomerManagement;










// import React, { useState, useEffect } from 'react';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CForm,
//   CFormLabel,
//   CFormInput,
//   CFormSelect,
//   CSpinner,
//   CAlert,
//   CFormTextarea,
//   CInputGroup,
//   CNav,
//   CNavItem,
//   CNavLink
// } from '@coreui/react';
// import axiosInstance from 'src/axiosInstance';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSearch } from '@coreui/icons';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';

// function SubdealerCustomerManagement() {
//   const [subdealers, setSubdealers] = useState([]);
//   const [selectedSubdealer, setSelectedSubdealer] = useState('');
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [filteredAccessories, setFilteredAccessories] = useState([]);
//   const [receipts, setReceipts] = useState([]);
//   const [selectedReceipt, setSelectedReceipt] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingAccessories, setLoadingAccessories] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [subdealerData, setSubdealerData] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [accessorySearchTerm, setAccessorySearchTerm] = useState('');
//   const [activeView, setActiveView] = useState('bookings');

//   // Get user from auth context
//   const { user: authUser } = useAuth();
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;

//   // Booking Payment Modal States
//   const [bookingModalVisible, setBookingModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [bookingPaymentData, setBookingPaymentData] = useState({
//     amount: '',
//     remark: ''
//   });
//   const [submittingBookingPayment, setSubmittingBookingPayment] = useState(false);

//   // Accessory Payment Modal States
//   const [accessoryModalVisible, setAccessoryModalVisible] = useState(false);
//   const [selectedAccessory, setSelectedAccessory] = useState(null);
//   const [accessoryPaymentData, setAccessoryPaymentData] = useState({
//     amount: '',
//     remark: ''
//   });
//   const [submittingAccessoryPayment, setSubmittingAccessoryPayment] = useState(false);

//   useEffect(() => {
//     const fetchSubdealers = async () => {
//       try {
//         const response = await axiosInstance.get('/subdealers');
//         setSubdealers(response.data.data.subdealers || []);
        
//         // If user is a subdealer, automatically set the subdealer to their own account
//         if (isSubdealer && userSubdealerId) {
//           setSelectedSubdealer(userSubdealerId);
//         }
//       } catch (error) {
//         const message = showError(error);
//         if (message) {
//           setError(message);
//         }
//       }
//     };

//     fetchSubdealers();
//   }, [isSubdealer, userSubdealerId]);

//   useEffect(() => {
//     if (selectedSubdealer) {
//       fetchSubdealerFinancialSummary();
//       fetchSubdealerReceipts();
//       fetchSubdealerAccessories();
//     } else {
//       setBookings([]);
//       setFilteredBookings([]);
//       setAccessories([]);
//       setFilteredAccessories([]);
//       setReceipts([]);
//       setSubdealerData(null);
//       setSelectedReceipt('');
//       setSearchTerm('');
//       setAccessorySearchTerm('');
//     }
//   }, [selectedSubdealer]);

//   useEffect(() => {
//     if (bookings.length > 0) {
//       let filtered = bookings.filter((booking) => booking.balanceAmount != 0);

//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         filtered = filtered.filter(
//           (booking) => booking.customerDetails.name.toLowerCase().includes(term) || booking.bookingNumber.toLowerCase().includes(term)
//         );
//       }

//       setFilteredBookings(filtered);
//     } else {
//       setFilteredBookings([]);
//     }
//   }, [bookings, searchTerm]);

//   useEffect(() => {
//     if (accessories.length > 0) {
//       // Filter out paid accessories and show only pending ones
//       let filtered = accessories.filter(accessory => {
//         const balance = calculateAccessoryBalance(accessory);
//         return balance > 0; // Only show accessories with balance > 0
//       });

//       if (accessorySearchTerm) {
//         const term = accessorySearchTerm.toLowerCase();
//         filtered = filtered.filter(
//           (accessory) => 
//             accessory._id.toLowerCase().includes(term) ||
//             accessory.remark?.toLowerCase().includes(term)
//         );
//       }

//       setFilteredAccessories(filtered);
//     } else {
//       setFilteredAccessories([]);
//     }
//   }, [accessories, accessorySearchTerm]);

//   const fetchSubdealerFinancialSummary = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axiosInstance.get(`/subdealers/${selectedSubdealer}/financial-summary`);
//       setSubdealerData(response.data.data);
//       setBookings(response.data.data.recentTransactions || []);
//     } catch (error) {
//       console.error('Error fetching subdealer financial summary:', error);
//       setError('Failed to load financial data for this subdealer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubdealerReceipts = async () => {
//     try {
//       // Try the specific receipts endpoint first
//       const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/receipts`);
      
//       console.log('Receipts API Response:', response.data);
      
//       // Handle different response structures
//       let receiptsData = [];
      
//       if (response.data && response.data.data) {
//         // Check for different possible structures
//         if (Array.isArray(response.data.data)) {
//           receiptsData = response.data.data;
//         } else if (response.data.data.docs) {
//           receiptsData = response.data.data.docs;
//         } else if (response.data.data.receipts) {
//           receiptsData = response.data.data.receipts;
//         } else if (response.data.docs) {
//           receiptsData = response.data.docs;
//         }
//       } else if (response.data && response.data.docs) {
//         receiptsData = response.data.docs;
//       } else if (Array.isArray(response.data)) {
//         receiptsData = response.data;
//       }
      
//       console.log('Processed receipts data:', receiptsData);
      
//       // Transform the data to match expected format
//       const formattedReceipts = receiptsData.map(receipt => ({
//         _id: receipt._id || receipt.id,
//         refNumber: receipt.refNumber || receipt.receiptNo || receipt.utrNumber || `REC-${receipt._id?.substring(receipt._id?.length - 6) || ''}`,
//         amount: receipt.amount || receipt.credit || 0,
//         allocatedTotal: receipt.allocatedTotal || receipt.allocatedAmount || 0,
//         date: receipt.date || receipt.createdAt || '',
//         description: receipt.description || '',
//         approvalStatus: receipt.approvalStatus || 'Approved',
//         paymentMode: receipt.paymentMode || 'Cash',
//         remark: receipt.remark || ''
//       }));
      
//       setReceipts(formattedReceipts);
      
//     } catch (error) {
//       console.error('Error fetching subdealer receipts:', error);
//       console.error('Error details:', error.response?.data);
      
//       // Fallback: Try the ledger endpoint
//       try {
//         console.log('Trying fallback endpoint...');
//         const ledgerResponse = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
        
//         if (ledgerResponse.data.data?.entries) {
//           const entries = ledgerResponse.data.data.entries;
          
//           // Filter for ON_ACCOUNT_RECEIPT entries (CREDIT entries)
//           const receiptEntries = entries
//             .filter(entry => entry.source === 'ON_ACCOUNT_RECEIPT' && entry.type === 'CREDIT')
//             .map(entry => ({
//               _id: entry.id,
//               refNumber: entry.receiptNo,
//               amount: entry.credit,
//               allocatedTotal: 0, // This would need to be calculated from allocations
//               date: entry.date,
//               description: entry.description,
//               approvalStatus: entry.approvalStatus,
//               paymentMode: entry.paymentMode,
//               remark: entry.remark
//             }));
          
//           console.log('Fallback receipts from ledger:', receiptEntries);
//           setReceipts(receiptEntries);
//         } else {
//           setReceipts([]);
//         }
//       } catch (fallbackError) {
//         console.error('Fallback also failed:', fallbackError);
//         setReceipts([]);
//         setError('Failed to load receipt data. Please check the API endpoint.');
//       }
//     }
//   };

//   const fetchSubdealerAccessories = async () => {
//     setLoadingAccessories(true);
//     try {
//       const response = await axiosInstance.get(`/accessory-billing/subdealer/${selectedSubdealer}`);
//       console.log('Accessories response:', response.data);
//       setAccessories(response.data.data.billings || []);
//     } catch (error) {
//       console.error('Error fetching subdealer accessories:', error);
//       setError('Failed to load accessory data: ' + error.message);
//     } finally {
//       setLoadingAccessories(false);
//     }
//   };

//   const handleSubdealerChange = (e) => {
//     setSelectedSubdealer(e.target.value);
//     setSelectedReceipt('');
//     setActiveView('bookings');
//   };

//   const handleReceiptChange = (e) => {
//     setSelectedReceipt(e.target.value);
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleAccessorySearchChange = (e) => {
//     setAccessorySearchTerm(e.target.value);
//   };

//   // Booking Payment Functions
//   const openBookingPaymentModal = (booking) => {
//     setSelectedBooking(booking);
//     setBookingPaymentData({
//       amount: '',
//       remark: ''
//     });
//     setBookingModalVisible(true);
//   };

//   const handleBookingPaymentChange = (e) => {
//     const { name, value } = e.target;
//     setBookingPaymentData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmitBookingPayment = async () => {
//     if (!bookingPaymentData.amount || parseFloat(bookingPaymentData.amount) <= 0) {
//       setError('Valid amount is required');
//       return;
//     }

//     if (!selectedReceipt) {
//       setError('Please select a UTR receipt first');
//       return;
//     }

//     if (!selectedBooking || !selectedBooking._id) {
//       setError('Booking information is missing');
//       return;
//     }

//     if (parseFloat(bookingPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
//       setError('Amount cannot exceed the remaining amount of the selected UTR');
//       return;
//     }

//     setSubmittingBookingPayment(true);
//     try {
//       const payload = {
//         allocations: [
//           {
//             bookingId: selectedBooking._id,
//             amount: parseFloat(bookingPaymentData.amount),
//             remark: bookingPaymentData.remark || ''
//           }
//         ]
//       };

//       await axiosInstance.post(`/subdealersonaccount/receipts/${selectedReceipt}/allocate`, payload);

//       setSuccess('Payment allocated successfully!');
//       setBookingModalVisible(false);

//       // Refresh data
//       fetchSubdealerFinancialSummary();
//       fetchSubdealerReceipts();
//     } catch (error) {
//       console.error('Error allocating payment:', error);
//       setError('Failed to allocate payment: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setSubmittingBookingPayment(false);
//     }
//   };

//   // Accessory Payment Functions
//   const openAccessoryPaymentModal = (accessory) => {
//     setSelectedAccessory(accessory);
//     const balance = calculateAccessoryBalance(accessory);
//     setAccessoryPaymentData({
//       amount: balance.toString(), // Pre-fill with full balance
//       remark: ''
//     });
//     setAccessoryModalVisible(true);
//   };

//   const handleAccessoryPaymentChange = (e) => {
//     const { name, value } = e.target;
//     setAccessoryPaymentData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmitAccessoryPayment = async () => {
//     if (!accessoryPaymentData.amount || parseFloat(accessoryPaymentData.amount) <= 0) {
//       setError('Valid amount is required');
//       return;
//     }

//     if (!selectedReceipt) {
//       setError('Please select a UTR receipt first');
//       return;
//     }

//     if (!selectedAccessory || !selectedAccessory._id) {
//       setError('Accessory information is missing');
//       return;
//     }

//     if (parseFloat(accessoryPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
//       setError('Amount cannot exceed the remaining amount of the selected UTR');
//       return;
//     }

//     const accessoryBalance = calculateAccessoryBalance(selectedAccessory);
//     if (parseFloat(accessoryPaymentData.amount) > accessoryBalance) {
//       setError(`Amount cannot exceed the accessory balance of ₹${accessoryBalance.toLocaleString()}`);
//       return;
//     }

//     setSubmittingAccessoryPayment(true);
//     try {
//       const payload = {
//         receiptId: selectedReceipt,
//         amount: parseFloat(accessoryPaymentData.amount),
//         remark: accessoryPaymentData.remark || ''
//       };

//       // Use the API endpoint for accessory payments
//       await axiosInstance.post(`/subdealersonaccount/accessory-billings/${selectedAccessory._id}/pay-from-on-account`, payload);

//       setSuccess('Accessory payment allocated successfully!');
//       setAccessoryModalVisible(false);

//       // Refresh data
//       fetchSubdealerAccessories();
//       fetchSubdealerReceipts();
//     } catch (error) {
//       console.error('Error allocating accessory payment:', error);
//       setError('Failed to allocate accessory payment: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setSubmittingAccessoryPayment(false);
//     }
//   };

//   const getRemainingAmount = (receiptId) => {
//     const receipt = receipts.find((r) => r._id === receiptId);
//     if (!receipt) return 0;
//     return receipt.amount - receipt.allocatedTotal;
//   };

//   const calculateAccessoryBalance = (accessory) => {
//     // For accessories with CREDIT payment_type, calculate balance
//     if (accessory.payment_type === 'CREDIT' && accessory.payment_status !== 'Paid') {
//       return accessory.net_amount;
//     }
//     return 0;
//   };

//   return (
//     <div>
//       <h4>Distribute OnAccount Balance</h4>
//       {error && (
//         <CAlert color="danger" dismissible onClose={() => setError('')}>
//           {error}
//         </CAlert>
//       )}

//       {success && (
//         <CAlert color="success" dismissible onClose={() => setSuccess('')}>
//           {success}
//         </CAlert>
//       )}

//       <CRow>
//         <CCol xs={12}>
//           <CCard className="mb-4">
//             <CCardHeader>
//               <h5>Subdealer Payment Allocation</h5>
//             </CCardHeader>
//             <CCardBody>
//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
//                   {isSubdealer ? (
//                     <div>
//                       <CFormInput
//                         type="text"
//                         value={`${userSubdealerName || 'Your Subdealer Account'}`}
//                         readOnly
//                         disabled
//                         className="mb-2"
//                       />
//                       <div className="text-muted small">
//                         Subdealers can only manage payments for their own account
//                       </div>
//                     </div>
//                   ) : (
//                     <CFormSelect id="subdealerSelect" value={selectedSubdealer} onChange={handleSubdealerChange}>
//                       <option value="">-- Select Subdealer --</option>
//                       {subdealers.map((subdealer) => (
//                         <option key={subdealer._id} value={subdealer._id}>
//                           {subdealer.name} - {subdealer.location}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   )}
//                 </CCol>

//                 <CCol md={6}>
//                   <CFormLabel htmlFor="receiptSelect">Select UTR/Receipt</CFormLabel>
//                   <CFormSelect id="receiptSelect" value={selectedReceipt} onChange={handleReceiptChange} disabled={!selectedSubdealer || receipts.length === 0}>
//                     <option value="">-- Select UTR/Receipt --</option>
//                     {receipts.map((receipt) => {
//                       const remainingAmount = getRemainingAmount(receipt._id);
//                       return (
//                         <option key={receipt._id} value={receipt._id} disabled={remainingAmount <= 0}>
//                           {receipt.refNumber || 'No Ref'} - ₹{remainingAmount.toLocaleString()} remaining
//                         </option>
//                       );
//                     })}
//                   </CFormSelect>
//                   {receipts.length === 0 && selectedSubdealer && (
//                     <small className="text-danger">No receipts found for this subdealer</small>
//                   )}
//                   <small className="text-muted">Select a UTR to allocate payments against available funds</small>
//                 </CCol>
//               </CRow>

//               {subdealerData && (
//                 <CCard className="mb-4">
//                   <CCardHeader>
//                     <h6>Subdealer Summary: {subdealerData.subdealer.name}</h6>
//                   </CCardHeader>
//                   <CCardBody>
//                     <CRow>
//                       <CCol md={3}>
//                         <strong>Total Bookings:</strong> {subdealerData.bookingSummary.totalBookings}
//                       </CCol>
//                       <CCol md={3}>
//                         <strong>Total Amount:</strong> ₹{subdealerData.bookingSummary.totalBookingAmount.toLocaleString()}
//                       </CCol>
//                       <CCol md={3}>
//                         <strong>Received:</strong> ₹{subdealerData.bookingSummary.totalReceivedAmount.toLocaleString()}
//                       </CCol>
//                       <CCol md={3}>
//                         <strong>Remaining:</strong> ₹{subdealerData.financialOverview.totalOutstanding.toLocaleString()}
//                       </CCol>
//                     </CRow>
//                     {receipts.length > 0 && (
//                       <CRow className="mt-3">
//                         <CCol>
//                           <strong>OnAccount Balance:</strong> ₹
//                           {receipts.reduce((sum, receipt) => sum + getRemainingAmount(receipt._id), 0).toLocaleString()}
//                         </CCol>
//                       </CRow>
//                     )}
//                   </CCardBody>
//                 </CCard>
//               )}

//               {selectedSubdealer && (
//                 <>
//                   <CNav variant="tabs" className="mb-3">
//                     <CNavItem>
//                       <CNavLink
//                         active={activeView === 'bookings'}
//                         onClick={() => setActiveView('bookings')}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Bookings
//                       </CNavLink>
//                     </CNavItem>
//                     <CNavItem>
//                       <CNavLink
//                         active={activeView === 'accessories'}
//                         onClick={() => setActiveView('accessories')}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Accessories
//                       </CNavLink>
//                     </CNavItem>
//                   </CNav>

//                   {activeView === 'bookings' && (
//                     <>
//                       {!loading && selectedSubdealer && (
//                         <CRow className="mb-3">
//                           <CCol md={4}>
//                             <CInputGroup>
//                               <CFormInput
//                                 placeholder="Search by customer name or booking number..."
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                               />
//                               <CButton type="button" color="secondary">
//                                 <CIcon icon={cilSearch} style={{ height: '25px' }} />
//                               </CButton>
//                             </CInputGroup>
//                             <small className="text-muted">Showing only NPF customers</small>
//                           </CCol>
//                         </CRow>
//                       )}

//                       {loading && (
//                         <div className="text-center py-4">
//                           <CSpinner />
//                           <p>Loading booking data...</p>
//                         </div>
//                       )}

//                       {!loading && selectedSubdealer && filteredBookings.length > 0 && (
//                         <CTable striped hover responsive>
//                           <CTableHead>
//                             <CTableRow>
//                               <CTableHeaderCell>Sr No</CTableHeaderCell>
//                               <CTableHeaderCell>Booking #</CTableHeaderCell>
//                               <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                               <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Received (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Date</CTableHeaderCell>
//                               <CTableHeaderCell>Action</CTableHeaderCell>
//                             </CTableRow>
//                           </CTableHead>
//                           <CTableBody>
//                             {filteredBookings.map((booking, index) => (
//                               <CTableRow key={index}>
//                                  <CTableDataCell>{index+1}</CTableDataCell>
//                                 <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                                 <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
//                                 <CTableDataCell>₹{booking.totalAmount.toLocaleString()}</CTableDataCell>
//                                 <CTableDataCell>₹{booking.receivedAmount.toLocaleString()}</CTableDataCell>
//                                 <CTableDataCell>₹{booking.balanceAmount.toLocaleString()}</CTableDataCell>
//                                 <CTableDataCell>{new Date(booking.createdAt).toLocaleDateString()}</CTableDataCell>
//                                 <CTableDataCell>
//                                   <CButton
//                                     color="primary"
//                                     size="sm"
//                                     onClick={() => openBookingPaymentModal(booking)}
//                                     disabled={!selectedReceipt}
//                                     title={!selectedReceipt ? 'Please select a UTR first' : 'Add payment'}
//                                   >
//                                     <CIcon icon={cilPlus} style={{ height: '15px' }} />
//                                   </CButton>
//                                 </CTableDataCell>
//                               </CTableRow>
//                             ))}
//                           </CTableBody>
//                         </CTable>
//                       )}

//                       {!loading && selectedSubdealer && filteredBookings.length === 0 && (
//                         <div className="text-center py-4">
//                           <p>
//                             {searchTerm
//                               ? `No bookings found with zero balance matching "${searchTerm}"`
//                               : 'No bookings found with zero balance for this subdealer.'}
//                           </p>
//                         </div>
//                       )}
//                     </>
//                   )}

//                   {activeView === 'accessories' && (
//                     <>
//                       {!loadingAccessories && selectedSubdealer && (
//                         <CRow className="mb-3">
//                           <CCol md={4}>
//                             <CInputGroup>
//                               <CFormInput
//                                 placeholder="Search by ID or remark..."
//                                 value={accessorySearchTerm}
//                                 onChange={handleAccessorySearchChange}
//                               />
//                               <CButton type="button" color="secondary">
//                                 <CIcon icon={cilSearch} style={{ height: '25px' }} />
//                               </CButton>
//                             </CInputGroup>
//                             <small className="text-muted">Showing accessories with pending payments</small>
//                           </CCol>
//                         </CRow>
//                       )}

//                       {loadingAccessories && (
//                         <div className="text-center py-4">
//                           <CSpinner />
//                           <p>Loading accessory data...</p>
//                         </div>
//                       )}

//                       {!loadingAccessories && selectedSubdealer && filteredAccessories.length > 0 && (
//                         <CTable striped hover responsive>
//                           <CTableHead>
//                             <CTableRow>
//                               <CTableHeaderCell>Sr No</CTableHeaderCell>
//                               <CTableHeaderCell>Invoice ID</CTableHeaderCell>
//                               <CTableHeaderCell>Payment Type</CTableHeaderCell>
//                               <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Net Amount (₹)</CTableHeaderCell>
//                               <CTableHeaderCell>Date</CTableHeaderCell>
//                               <CTableHeaderCell>Remark</CTableHeaderCell>
//                               <CTableHeaderCell>Action</CTableHeaderCell>
//                             </CTableRow>
//                           </CTableHead>
//                           <CTableBody>
//                             {filteredAccessories.map((accessory, index) => {
//                               const balance = calculateAccessoryBalance(accessory);
//                               return (
//                                 <CTableRow key={index}>
//                                   <CTableDataCell>{index+1}</CTableDataCell>
//                                   <CTableDataCell>{accessory._id.substring(accessory._id.length - 6)}</CTableDataCell>
//                                   <CTableDataCell>{accessory.payment_type}</CTableDataCell>
//                                   <CTableDataCell>₹{accessory.total_amount?.toLocaleString()}</CTableDataCell>
//                                   <CTableDataCell>₹{accessory.net_amount?.toLocaleString()}</CTableDataCell>
//                                   <CTableDataCell>{new Date(accessory.createdAt).toLocaleDateString()}</CTableDataCell>
//                                   <CTableDataCell>{accessory.remark || '-'}</CTableDataCell>
//                                   <CTableDataCell>
//                                     <CButton
//                                       color="primary"
//                                       size="sm"
//                                       onClick={() => openAccessoryPaymentModal(accessory)}
//                                       disabled={!selectedReceipt}
//                                       title={!selectedReceipt ? 'Please select a UTR first' : 'Add payment'}
//                                     >
//                                       <CIcon icon={cilPlus} style={{ height: '15px' }} />
//                                     </CButton>
//                                   </CTableDataCell>
//                                 </CTableRow>
//                               );
//                             })}
//                           </CTableBody>
//                         </CTable>
//                       )}

//                       {!loadingAccessories && selectedSubdealer && filteredAccessories.length === 0 && (
//                         <div className="text-center py-4">
//                           <p>
//                             {accessorySearchTerm
//                               ? `No pending accessories found matching "${accessorySearchTerm}"`
//                               : 'No pending accessory billings found for this subdealer.'}
//                           </p>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Booking Payment Allocation Modal */}
//       <CModal visible={bookingModalVisible} onClose={() => setBookingModalVisible(false)}>
//         <CModalHeader onClose={() => setBookingModalVisible(false)}>
//           <CModalTitle>Allocate Payment to Booking</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <CRow>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel>Customer Name</CFormLabel>
//                   <CFormInput type="text" value={selectedBooking?.customerDetails?.name || ''} disabled readOnly />
//                 </div>
//               </CCol>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel>Booking Number</CFormLabel>
//                   <CFormInput type="text" value={selectedBooking?.bookingNumber || ''} disabled readOnly />
//                 </div>
//               </CCol>
//             </CRow>

//             <div className="mb-3">
//               <CFormLabel>Booking ID</CFormLabel>
//               <CFormInput type="text" value={selectedBooking?._id || ''} disabled readOnly />
//             </div>

//             <CRow>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="amount">Amount to Allocate (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="amount"
//                     name="amount"
//                     value={bookingPaymentData.amount}
//                     onChange={handleBookingPaymentChange}
//                     placeholder="Enter amount"
//                     required
//                     min="0.01"
//                     step="0.01"
//                     max={selectedReceipt ? getRemainingAmount(selectedReceipt) : undefined}
//                   />
//                   {selectedReceipt && <small className="text-muted">Max: ₹{getRemainingAmount(selectedReceipt).toLocaleString()}</small>}
//                 </div>
//               </CCol>
//               <CCol md={6}>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="remark">Remark (Optional)</CFormLabel>
//                   <CFormInput
//                     id="remark"
//                     name="remark"
//                     value={bookingPaymentData.remark}
//                     onChange={handleBookingPaymentChange}
//                     placeholder="Enter any remarks"
//                   />
//                 </div>
//               </CCol>
//             </CRow>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setBookingModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleSubmitBookingPayment} disabled={submittingBookingPayment}>
//             {submittingBookingPayment ? (
//               <>
//                 <CSpinner component="span" size="sm" aria-hidden="true" />
//                 Allocating...
//               </>
//             ) : (
//               <>Allocate Payment</>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Accessory Payment Allocation Modal */}
//       <CModal visible={accessoryModalVisible} onClose={() => setAccessoryModalVisible(false)}>
//         <CModalHeader onClose={() => setAccessoryModalVisible(false)}>
//           <CModalTitle>Allocate Payment to Accessory</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <div className="mb-3">
//               <CFormLabel>Accessory Invoice ID</CFormLabel>
//               <CFormInput 
//                 type="text" 
//                 value={selectedAccessory ? selectedAccessory._id.substring(selectedAccessory._id.length - 6) : ''} 
//                 disabled 
//                 readOnly 
//               />
//             </div>

//             <div className="mb-3">
//               <CFormLabel>Net Amount</CFormLabel>
//               <CFormInput 
//                 type="text" 
//                 value={selectedAccessory ? `₹${selectedAccessory.net_amount?.toLocaleString()}` : ''} 
//                 disabled 
//                 readOnly 
//               />
//             </div>

//             <div className="mb-3">
//               <CFormLabel>Balance Amount</CFormLabel>
//               <CFormInput 
//                 type="text" 
//                 value={selectedAccessory ? `₹${calculateAccessoryBalance(selectedAccessory).toLocaleString()}` : ''} 
//                 disabled 
//                 readOnly 
//               />
//             </div>

//             <div className="mb-3">
//               <CFormLabel htmlFor="accessoryAmount">Amount to Allocate (₹)</CFormLabel>
//               <CFormInput
//                 type="number"
//                 id="accessoryAmount"
//                 name="amount"
//                 value={accessoryPaymentData.amount}
//                 onChange={handleAccessoryPaymentChange}
//                 placeholder="Enter amount"
//                 required
//                 min="0.01"
//                 step="0.01"
//                 max={Math.min(
//                   selectedReceipt ? getRemainingAmount(selectedReceipt) : 0,
//                   selectedAccessory ? calculateAccessoryBalance(selectedAccessory) : 0
//                 )}
//               />
//               <small className="text-muted">
//                 {selectedReceipt && selectedAccessory && (
//                   `Max: ₹${Math.min(
//                     getRemainingAmount(selectedReceipt),
//                     calculateAccessoryBalance(selectedAccessory)
//                   ).toLocaleString()}`
//                 )}
//               </small>
//             </div>

//             <div className="mb-3">
//               <CFormLabel htmlFor="accessoryRemark">Remark (Optional)</CFormLabel>
//               <CFormTextarea
//                 id="accessoryRemark"
//                 name="remark"
//                 value={accessoryPaymentData.remark}
//                 onChange={handleAccessoryPaymentChange}
//                 placeholder="Enter any remarks"
//                 rows={3}
//               />
//             </div>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setAccessoryModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleSubmitAccessoryPayment} disabled={submittingAccessoryPayment}>
//             {submittingAccessoryPayment ? (
//               <>
//                 <CSpinner component="span" size="sm" aria-hidden="true" />
//                 Allocating...
//               </>
//             ) : (
//               <>Allocate Payment</>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// }

// export default SubdealerCustomerManagement;








import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
  CAlert,
  CFormTextarea,
  CInputGroup,
  CNav,
  CNavItem,
  CNavLink,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import axiosInstance from 'src/axiosInstance';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSearch } from '@coreui/icons';
import { showError } from '../../../utils/sweetAlerts';
import { useAuth } from '../../../context/AuthContext';

function SubdealerCustomerManagement() {
  const [subdealers, setSubdealers] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [filteredPenalties, setFilteredPenalties] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [loadingPenalties, setLoadingPenalties] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subdealerData, setSubdealerData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accessorySearchTerm, setAccessorySearchTerm] = useState('');
  const [penaltySearchTerm, setPenaltySearchTerm] = useState('');
  const [activeView, setActiveView] = useState('bookings');

  // Penalty pagination states
  const [penaltyPage, setPenaltyPage] = useState(1);
  const [penaltyTotalPages, setPenaltyTotalPages] = useState(1);
  const [penaltyLimit] = useState(20);

  // Get user from auth context
  const { user: authUser } = useAuth();
  
  // Check if user has SUBDEALER role
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
  // Get subdealer ID from user data if user is a subdealer
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;

  // Booking Payment Modal States
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingPaymentData, setBookingPaymentData] = useState({
    amount: '',
    remark: ''
  });
  const [submittingBookingPayment, setSubmittingBookingPayment] = useState(false);

  // Accessory Payment Modal States
  const [accessoryModalVisible, setAccessoryModalVisible] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [accessoryPaymentData, setAccessoryPaymentData] = useState({
    amount: '',
    remark: ''
  });
  const [submittingAccessoryPayment, setSubmittingAccessoryPayment] = useState(false);

  // Penalty Payment Modal States
  const [penaltyModalVisible, setPenaltyModalVisible] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [penaltyPaymentData, setPenaltyPaymentData] = useState({
    amount: '',
    paymentDate: '',
    remark: ''
  });
  const [submittingPenaltyPayment, setSubmittingPenaltyPayment] = useState(false);
  const [penaltyModalError, setPenaltyModalError] = useState('');
  const [penaltyModalSuccess, setPenaltyModalSuccess] = useState('');

  useEffect(() => {
    const fetchSubdealers = async () => {
      try {
        const response = await axiosInstance.get('/subdealers');
        setSubdealers(response.data.data.subdealers || []);
        
        // If user is a subdealer, automatically set the subdealer to their own account
        if (isSubdealer && userSubdealerId) {
          setSelectedSubdealer(userSubdealerId);
        }
      } catch (error) {
        const message = showError(error);
        if (message) {
          setError(message);
        }
      }
    };

    fetchSubdealers();
  }, [isSubdealer, userSubdealerId]);

  useEffect(() => {
    if (selectedSubdealer) {
      fetchSubdealerFinancialSummary();
      fetchSubdealerReceipts();
      fetchSubdealerAccessories();
      fetchSubdealerPenalties(1); // Fetch first page of penalties
    } else {
      setBookings([]);
      setFilteredBookings([]);
      setAccessories([]);
      setFilteredAccessories([]);
      setPenalties([]);
      setFilteredPenalties([]);
      setReceipts([]);
      setSubdealerData(null);
      setSelectedReceipt('');
      setSearchTerm('');
      setAccessorySearchTerm('');
      setPenaltySearchTerm('');
      setPenaltyPage(1);
    }
  }, [selectedSubdealer]);

  useEffect(() => {
    if (bookings.length > 0) {
      let filtered = bookings.filter((booking) => booking.balanceAmount != 0);

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (booking) => booking.customerDetails.name.toLowerCase().includes(term) || booking.bookingNumber.toLowerCase().includes(term)
        );
      }

      setFilteredBookings(filtered);
    } else {
      setFilteredBookings([]);
    }
  }, [bookings, searchTerm]);

  useEffect(() => {
    if (accessories.length > 0) {
      // Filter out paid accessories and show only pending ones
      let filtered = accessories.filter(accessory => {
        const balance = calculateAccessoryBalance(accessory);
        return balance > 0; // Only show accessories with balance > 0
      });

      if (accessorySearchTerm) {
        const term = accessorySearchTerm.toLowerCase();
        filtered = filtered.filter(
          (accessory) => 
            accessory._id.toLowerCase().includes(term) ||
            accessory.remark?.toLowerCase().includes(term)
        );
      }

      setFilteredAccessories(filtered);
    } else {
      setFilteredAccessories([]);
    }
  }, [accessories, accessorySearchTerm]);

  useEffect(() => {
    if (penalties.length > 0) {
      let filtered = penalties;

      if (penaltySearchTerm) {
        const term = penaltySearchTerm.toLowerCase();
        filtered = filtered.filter(
          (penalty) => 
            penalty.referenceNumber?.toLowerCase().includes(term) ||
            penalty.reason?.toLowerCase().includes(term) ||
            penalty.status?.toLowerCase().includes(term)
        );
      }

      // Filter only active penalties with balance
      filtered = filtered.filter(penalty => 
        penalty.status === 'ACTIVE' && 
        (penalty.balance > 0 || !penalty.isPaid)
      );

      setFilteredPenalties(filtered);
    } else {
      setFilteredPenalties([]);
    }
  }, [penalties, penaltySearchTerm]);

  const fetchSubdealerFinancialSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/subdealers/${selectedSubdealer}/financial-summary`);
      setSubdealerData(response.data.data);
      setBookings(response.data.data.recentTransactions || []);
    } catch (error) {
      console.error('Error fetching subdealer financial summary:', error);
      setError('Failed to load financial data for this subdealer');
    } finally {
      setLoading(false);
    }
  };

 const fetchSubdealerReceipts = async () => {
  try {
    const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
    
    console.log('On-account receipts API Response:', response.data);
    
    if (response.data && response.data.data && response.data.data.entries) {
      const entries = response.data.data.entries;
      
      // Filter for ON_ACCOUNT_RECEIPT entries with type CREDIT and approvalStatus Approved
      const receiptEntries = entries
        .filter(entry => 
          entry.source === 'ON_ACCOUNT_RECEIPT' && 
          entry.type === 'CREDIT' && 
          entry.approvalStatus === 'Approved' &&
          entry.receiptDetails?.receiptRemaining > 0
        )
        .map(entry => {
          // Extract receiptRemaining from receiptDetails if available
          const receiptRemaining = entry.receiptDetails?.receiptRemaining || 0;
          const creditAmount = entry.credit || 0;
          const receiptAllocated = entry.receiptDetails?.receiptAllocated || 0;
          
          return {
            _id: entry.id,
            refNumber: entry.receiptNo || `REC-${entry.id?.substring(entry.id?.length - 6) || ''}`,
            amount: creditAmount,
            allocatedTotal: receiptAllocated,
            receiptRemaining: receiptRemaining,
            date: entry.date || '',
            description: entry.description || '',
            approvalStatus: entry.approvalStatus || 'Approved',
            paymentMode: entry.paymentMode || 'Cash',
            remark: entry.remark || '',
            receiptDetails: entry.receiptDetails || null
          };
        });
      
      console.log('Processed receipts data:', receiptEntries);
      setReceipts(receiptEntries);
    } else {
      setReceipts([]);
    }
  } catch (error) {
    console.error('Error fetching subdealer receipts:', error);
    console.error('Error details:', error.response?.data);
    setReceipts([]);
    setError('Failed to load receipt data. Please check the API endpoint.');
  }
};
  const fetchSubdealerAccessories = async () => {
    setLoadingAccessories(true);
    try {
      const response = await axiosInstance.get(`/accessory-billing/subdealer/${selectedSubdealer}`);
      console.log('Accessories response:', response.data);
      setAccessories(response.data.data.billings || []);
    } catch (error) {
      console.error('Error fetching subdealer accessories:', error);
      setError('Failed to load accessory data: ' + error.message);
    } finally {
      setLoadingAccessories(false);
    }
  };

  const fetchSubdealerPenalties = async (page = 1) => {
    setLoadingPenalties(true);
    try {
      const response = await axiosInstance.get(`/penalty/subdealer/${selectedSubdealer}`, {
        params: {
          page,
          limit: penaltyLimit
        }
      });
      console.log('Penalties response:', response.data);
      setPenalties(response.data.data.penalties || []);
      setPenaltyTotalPages(response.data.data.pagination?.pages || 1);
      setPenaltyPage(page);
    } catch (error) {
      console.error('Error fetching subdealer penalties:', error);
      setError('Failed to load penalty data: ' + error.message);
    } finally {
      setLoadingPenalties(false);
    }
  };

  const handleSubdealerChange = (e) => {
    setSelectedSubdealer(e.target.value);
    setSelectedReceipt('');
    setActiveView('bookings');
  };

  const handleReceiptChange = (e) => {
    setSelectedReceipt(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAccessorySearchChange = (e) => {
    setAccessorySearchTerm(e.target.value);
  };

  const handlePenaltySearchChange = (e) => {
    setPenaltySearchTerm(e.target.value);
  };

  const handlePenaltyPageChange = (page) => {
    if (page >= 1 && page <= penaltyTotalPages) {
      fetchSubdealerPenalties(page);
    }
  };

  // Booking Payment Functions
  const openBookingPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setBookingPaymentData({
      amount: '',
      remark: ''
    });
    setBookingModalVisible(true);
  };

  const handleBookingPaymentChange = (e) => {
    const { name, value } = e.target;
    setBookingPaymentData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBookingPayment = async () => {
    if (!bookingPaymentData.amount || parseFloat(bookingPaymentData.amount) <= 0) {
      setError('Valid amount is required');
      return;
    }

    if (!selectedReceipt) {
      setError('Please select a UTR receipt first');
      return;
    }

    if (!selectedBooking || !selectedBooking._id) {
      setError('Booking information is missing');
      return;
    }

    if (parseFloat(bookingPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
      setError('Amount cannot exceed the remaining amount of the selected UTR');
      return;
    }

    setSubmittingBookingPayment(true);
    try {
      const payload = {
        allocations: [
          {
            bookingId: selectedBooking._id,
            amount: parseFloat(bookingPaymentData.amount),
            remark: bookingPaymentData.remark || ''
          }
        ]
      };

      await axiosInstance.post(`/subdealersonaccount/receipts/${selectedReceipt}/allocate`, payload);

      setSuccess('Payment allocated successfully!');
      setBookingModalVisible(false);

      // Refresh data
      fetchSubdealerFinancialSummary();
      fetchSubdealerReceipts();
    } catch (error) {
      console.error('Error allocating payment:', error);
      setError('Failed to allocate payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingBookingPayment(false);
    }
  };

  // Accessory Payment Functions
  const openAccessoryPaymentModal = (accessory) => {
    setSelectedAccessory(accessory);
    const balance = calculateAccessoryBalance(accessory);
    setAccessoryPaymentData({
      amount: balance.toString(), // Pre-fill with full balance
      remark: ''
    });
    setAccessoryModalVisible(true);
  };

  const handleAccessoryPaymentChange = (e) => {
    const { name, value } = e.target;
    setAccessoryPaymentData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAccessoryPayment = async () => {
    if (!accessoryPaymentData.amount || parseFloat(accessoryPaymentData.amount) <= 0) {
      setError('Valid amount is required');
      return;
    }

    if (!selectedReceipt) {
      setError('Please select a UTR receipt first');
      return;
    }

    if (!selectedAccessory || !selectedAccessory._id) {
      setError('Accessory information is missing');
      return;
    }

    if (parseFloat(accessoryPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
      setError('Amount cannot exceed the remaining amount of the selected UTR');
      return;
    }

    const accessoryBalance = calculateAccessoryBalance(selectedAccessory);
    if (parseFloat(accessoryPaymentData.amount) > accessoryBalance) {
      setError(`Amount cannot exceed the accessory balance of ₹${accessoryBalance.toLocaleString()}`);
      return;
    }

    setSubmittingAccessoryPayment(true);
    try {
      const payload = {
        receiptId: selectedReceipt,
        amount: parseFloat(accessoryPaymentData.amount),
        remark: accessoryPaymentData.remark || ''
      };

      // Use the API endpoint for accessory payments
      await axiosInstance.post(`/subdealersonaccount/accessory-billings/${selectedAccessory._id}/pay-from-on-account`, payload);

      setSuccess('Accessory payment allocated successfully!');
      setAccessoryModalVisible(false);

      // Refresh data
      fetchSubdealerAccessories();
      fetchSubdealerReceipts();
    } catch (error) {
      console.error('Error allocating accessory payment:', error);
      setError('Failed to allocate accessory payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingAccessoryPayment(false);
    }
  };

  // Penalty Payment Functions
  const openPenaltyPaymentModal = (penalty) => {
    setSelectedPenalty(penalty);
    const balance = calculatePenaltyBalance(penalty);
    // Pre-fill the amount with the full balance
    setPenaltyPaymentData({
      amount: balance.toString(),
      paymentDate: new Date().toISOString().split('T')[0], // Default to today's date
      remark: ''
    });
    setPenaltyModalError('');
    setPenaltyModalSuccess('');
    setPenaltyModalVisible(true);
  };

  const handlePenaltyPaymentChange = (e) => {
    const { name, value } = e.target;
    setPenaltyPaymentData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPenaltyPayment = async () => {
    // Clear previous messages
    setPenaltyModalError('');
    setPenaltyModalSuccess('');

    if (!penaltyPaymentData.amount || parseFloat(penaltyPaymentData.amount) <= 0) {
      setPenaltyModalError('Valid amount is required');
      return;
    }

    if (!selectedReceipt) {
      setPenaltyModalError('Please select a UTR receipt first');
      return;
    }

    if (!selectedPenalty || !selectedPenalty._id) {
      setPenaltyModalError('Penalty information is missing');
      return;
    }

    // Validate amount doesn't exceed UTR remaining balance
    if (parseFloat(penaltyPaymentData.amount) > getRemainingAmount(selectedReceipt)) {
      setPenaltyModalError('Amount cannot exceed the remaining amount of the selected UTR');
      return;
    }

    // Validate amount doesn't exceed penalty balance
    const penaltyBalance = calculatePenaltyBalance(selectedPenalty);
    if (parseFloat(penaltyPaymentData.amount) > penaltyBalance) {
      setPenaltyModalError(`Amount cannot exceed the penalty balance of ₹${penaltyBalance.toLocaleString()}`);
      return;
    }

    setSubmittingPenaltyPayment(true);
    try {
      const payload = {
        receiptId: selectedReceipt,
        amount: parseFloat(penaltyPaymentData.amount),
        remark: penaltyPaymentData.remark || ''
      };

      // Add paymentDate if provided
      if (penaltyPaymentData.paymentDate) {
        // Convert date to ISO string with time component
        const date = new Date(penaltyPaymentData.paymentDate);
        date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        payload.paymentDate = date.toISOString();
      }

      console.log('Submitting penalty payment payload:', payload);
      console.log('API endpoint:', `/subdealersonaccount/${selectedPenalty._id}/pay`);

      // Use the provided API endpoint for penalty payments
      const response = await axiosInstance.post(`/subdealersonaccount/${selectedPenalty._id}/pay`, payload);

      console.log('Penalty payment response:', response.data);

      // Check if response is successful based on status or success field
      if (response.data.status === 'success' || response.data.success === true) {
        setPenaltyModalSuccess(response.data.message || 'Penalty payment allocated successfully!');
        setSuccess(response.data.message || 'Penalty payment allocated successfully!');
        
        // Refresh data immediately
        fetchSubdealerPenalties(penaltyPage);
        fetchSubdealerReceipts();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setPenaltyModalVisible(false);
        }, 2000);
      } else {
        // Handle case where API returns success: false but with a message
        setPenaltyModalError(response.data.message || 'Payment allocation failed');
      }
    } catch (error) {
      console.error('Error allocating penalty payment:', error);
      console.error('Error details:', error.response?.data);
      
      // Check if error response has data
      if (error.response?.data) {
        const errorData = error.response.data;
        // Check different possible error response structures
        if (errorData.status === 'error' || errorData.success === false) {
          const errorMessage = errorData.message || 'Failed to allocate penalty payment';
          const errorDetail = errorData.error || error.message;
          setPenaltyModalError(`${errorMessage}: ${errorDetail}`);
        } else {
          setPenaltyModalError('An unexpected error occurred: ' + error.message);
        }
      } else {
        setPenaltyModalError('Network error: ' + error.message);
      }
    } finally {
      setSubmittingPenaltyPayment(false);
    }
  };

 const getRemainingAmount = (receiptId) => {
  const receipt = receipts.find((r) => r._id === receiptId);
  if (!receipt) return 0;
  
  // Use receiptRemaining if available, otherwise calculate from amount - allocatedTotal
  if (receipt.receiptRemaining !== undefined) {
    return receipt.receiptRemaining;
  }
  
  return receipt.amount - receipt.allocatedTotal;
};

  const calculateAccessoryBalance = (accessory) => {
    // For accessories with CREDIT payment_type, calculate balance
    if (accessory.payment_type === 'CREDIT' && accessory.payment_status !== 'Paid') {
      return accessory.net_amount;
    }
    return 0;
  };

  const calculatePenaltyBalance = (penalty) => {
    // Calculate remaining balance for penalty
    return penalty.balance || (penalty.amount - (penalty.paidAmount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h4>Distribute OnAccount Balance</h4>
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError('')}>
          {error}
        </CAlert>
      )}

      {success && (
        <CAlert color="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </CAlert>
      )}

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5>Subdealer Payment Allocation</h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
                  {isSubdealer ? (
                    <div>
                      <CFormInput
                        type="text"
                        value={`${userSubdealerName || 'Your Subdealer Account'}`}
                        readOnly
                        disabled
                        className="mb-2"
                      />
                      <div className="text-muted small">
                        Subdealers can only manage payments for their own account
                      </div>
                    </div>
                  ) : (
                    <CFormSelect id="subdealerSelect" value={selectedSubdealer} onChange={handleSubdealerChange}>
                      <option value="">-- Select Subdealer --</option>
                      {subdealers.map((subdealer) => (
                        <option key={subdealer._id} value={subdealer._id}>
                          {subdealer.name} - {subdealer.location}
                        </option>
                      ))}
                    </CFormSelect>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="receiptSelect">Select UTR/Receipt</CFormLabel>
                  <CFormSelect id="receiptSelect" value={selectedReceipt} onChange={handleReceiptChange} disabled={!selectedSubdealer || receipts.length === 0}>
                    <option value="">-- Select UTR/Receipt --</option>
                    {receipts.map((receipt) => {
                      const remainingAmount = getRemainingAmount(receipt._id);
                      return (
                        <option key={receipt._id} value={receipt._id} disabled={remainingAmount <= 0}>
                          {receipt.refNumber || 'No Ref'} - ₹{remainingAmount.toLocaleString()} remaining
                        </option>
                      );
                    })}
                  </CFormSelect>
                  {receipts.length === 0 && selectedSubdealer && (
                    <small className="text-danger">No receipts found for this subdealer</small>
                  )}
                  <small className="text-muted">Select a UTR to allocate payments against available funds</small>
                </CCol>
              </CRow>

              {subdealerData && (
                <CCard className="mb-4">
                  <CCardHeader>
                    <h6>Subdealer Summary: {subdealerData.subdealer.name}</h6>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol md={3}>
                        <strong>Total Bookings:</strong> {subdealerData.bookingSummary.totalBookings}
                      </CCol>
                      <CCol md={3}>
                        <strong>Total Amount:</strong> ₹{subdealerData.bookingSummary.totalBookingAmount.toLocaleString()}
                      </CCol>
                      <CCol md={3}>
                        <strong>Received:</strong> ₹{subdealerData.bookingSummary.totalReceivedAmount.toLocaleString()}
                      </CCol>
                      <CCol md={3}>
                        <strong>Remaining:</strong> ₹{subdealerData.financialOverview.totalOutstanding.toLocaleString()}
                      </CCol>
                    </CRow>
                    {receipts.length > 0 && (
                      <CRow className="mt-3">
                        <CCol>
                          <strong>OnAccount Balance:</strong> ₹
                          {receipts.reduce((sum, receipt) => sum + getRemainingAmount(receipt._id), 0).toLocaleString()}
                        </CCol>
                      </CRow>
                    )}
                  </CCardBody>
                </CCard>
              )}

              {selectedSubdealer && (
                <>
                  <CNav variant="tabs" className="mb-3">
                    <CNavItem>
                      <CNavLink
                        active={activeView === 'bookings'}
                        onClick={() => setActiveView('bookings')}
                        style={{ cursor: 'pointer' }}
                      >
                        Bookings
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeView === 'accessories'}
                        onClick={() => setActiveView('accessories')}
                        style={{ cursor: 'pointer' }}
                      >
                        Accessories
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeView === 'penalties'}
                        onClick={() => setActiveView('penalties')}
                        style={{ cursor: 'pointer' }}
                      >
                        Penalties
                      </CNavLink>
                    </CNavItem>
                  </CNav>

                  {activeView === 'bookings' && (
                    <>
                      {!loading && selectedSubdealer && (
                        <CRow className="mb-3">
                          <CCol md={4}>
                            <CInputGroup>
                              <CFormInput
                                placeholder="Search by customer name or booking number..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                              />
                              <CButton type="button" color="secondary">
                                <CIcon icon={cilSearch} style={{ height: '25px' }} />
                              </CButton>
                            </CInputGroup>
                            <small className="text-muted">Showing only NPF customers</small>
                          </CCol>
                        </CRow>
                      )}

                      {loading && (
                        <div className="text-center py-4">
                          <CSpinner />
                          <p>Loading booking data...</p>
                        </div>
                      )}

                      {!loading && selectedSubdealer && filteredBookings.length > 0 && (
                        <CTable striped hover responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Sr No</CTableHeaderCell>
                              <CTableHeaderCell>Booking #</CTableHeaderCell>
                              <CTableHeaderCell>Customer Name</CTableHeaderCell>
                              <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
                              <CTableHeaderCell>Received (₹)</CTableHeaderCell>
                              <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
                              <CTableHeaderCell>Date</CTableHeaderCell>
                              <CTableHeaderCell>Action</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {filteredBookings.map((booking, index) => (
                              <CTableRow key={index}>
                                 <CTableDataCell>{index+1}</CTableDataCell>
                                <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                                <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                                <CTableDataCell>₹{booking.totalAmount.toLocaleString()}</CTableDataCell>
                                <CTableDataCell>₹{booking.receivedAmount.toLocaleString()}</CTableDataCell>
                                <CTableDataCell>₹{booking.balanceAmount.toLocaleString()}</CTableDataCell>
                                <CTableDataCell>{new Date(booking.createdAt).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => openBookingPaymentModal(booking)}
                                    disabled={!selectedReceipt}
                                    title={!selectedReceipt ? 'Please select a UTR first' : 'Add payment'}
                                  >
                                    <CIcon icon={cilPlus} style={{ height: '15px' }} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      )}

                      {!loading && selectedSubdealer && filteredBookings.length === 0 && (
                        <div className="text-center py-4">
                          <p>
                            {searchTerm
                              ? `No bookings found with zero balance matching "${searchTerm}"`
                              : 'No bookings found with zero balance for this subdealer.'}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {activeView === 'accessories' && (
                    <>
                      {!loadingAccessories && selectedSubdealer && (
                        <CRow className="mb-3">
                          <CCol md={4}>
                            <CInputGroup>
                              <CFormInput
                                placeholder="Search by ID or remark..."
                                value={accessorySearchTerm}
                                onChange={handleAccessorySearchChange}
                              />
                              <CButton type="button" color="secondary">
                                <CIcon icon={cilSearch} style={{ height: '25px' }} />
                              </CButton>
                            </CInputGroup>
                            <small className="text-muted">Showing accessories with pending payments</small>
                          </CCol>
                        </CRow>
                      )}

                      {loadingAccessories && (
                        <div className="text-center py-4">
                          <CSpinner />
                          <p>Loading accessory data...</p>
                        </div>
                      )}

                      {!loadingAccessories && selectedSubdealer && filteredAccessories.length > 0 && (
                        <CTable striped hover responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Sr No</CTableHeaderCell>
                              <CTableHeaderCell>Invoice ID</CTableHeaderCell>
                              <CTableHeaderCell>Payment Type</CTableHeaderCell>
                              <CTableHeaderCell>Total Amount (₹)</CTableHeaderCell>
                              <CTableHeaderCell>Net Amount (₹)</CTableHeaderCell>
                              <CTableHeaderCell>Date</CTableHeaderCell>
                              <CTableHeaderCell>Remark</CTableHeaderCell>
                              <CTableHeaderCell>Action</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {filteredAccessories.map((accessory, index) => {
                              const balance = calculateAccessoryBalance(accessory);
                              return (
                                <CTableRow key={index}>
                                  <CTableDataCell>{index+1}</CTableDataCell>
                                  <CTableDataCell>{accessory._id.substring(accessory._id.length - 6)}</CTableDataCell>
                                  <CTableDataCell>{accessory.payment_type}</CTableDataCell>
                                  <CTableDataCell>₹{accessory.total_amount?.toLocaleString()}</CTableDataCell>
                                  <CTableDataCell>₹{accessory.net_amount?.toLocaleString()}</CTableDataCell>
                                  <CTableDataCell>{new Date(accessory.createdAt).toLocaleDateString()}</CTableDataCell>
                                  <CTableDataCell>{accessory.remark || '-'}</CTableDataCell>
                                  <CTableDataCell>
                                    <CButton
                                      color="primary"
                                      size="sm"
                                      onClick={() => openAccessoryPaymentModal(accessory)}
                                      disabled={!selectedReceipt}
                                      title={!selectedReceipt ? 'Please select a UTR first' : 'Add payment'}
                                    >
                                      <CIcon icon={cilPlus} style={{ height: '15px' }} />
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              );
                            })}
                          </CTableBody>
                        </CTable>
                      )}

                      {!loadingAccessories && selectedSubdealer && filteredAccessories.length === 0 && (
                        <div className="text-center py-4">
                          <p>
                            {accessorySearchTerm
                              ? `No pending accessories found matching "${accessorySearchTerm}"`
                              : 'No pending accessory billings found for this subdealer.'}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {activeView === 'penalties' && (
                    <>
                      {!loadingPenalties && selectedSubdealer && (
                        <CRow className="mb-3">
                          <CCol md={4}>
                            <CInputGroup>
                              <CFormInput
                                placeholder="Search by reference number or reason..."
                                value={penaltySearchTerm}
                                onChange={handlePenaltySearchChange}
                              />
                              <CButton type="button" color="secondary">
                                <CIcon icon={cilSearch} style={{ height: '25px' }} />
                              </CButton>
                            </CInputGroup>
                            <small className="text-muted">Showing active penalties with pending payments</small>
                          </CCol>
                        </CRow>
                      )}

                      {loadingPenalties && (
                        <div className="text-center py-4">
                          <CSpinner />
                          <p>Loading penalty data...</p>
                        </div>
                      )}

                      {!loadingPenalties && selectedSubdealer && filteredPenalties.length > 0 && (
                        <>
                          <CTable striped hover responsive>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Sr No</CTableHeaderCell>
                                <CTableHeaderCell>Reference Number</CTableHeaderCell>
                                <CTableHeaderCell>Amount (₹)</CTableHeaderCell>
                                <CTableHeaderCell>Paid Amount (₹)</CTableHeaderCell>
                                <CTableHeaderCell>Balance (₹)</CTableHeaderCell>
                                <CTableHeaderCell>Reason</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Penalty Date</CTableHeaderCell>
                                <CTableHeaderCell>Created By</CTableHeaderCell>
                                <CTableHeaderCell>Action</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {filteredPenalties.map((penalty, index) => {
                                const balance = calculatePenaltyBalance(penalty);
                                return (
                                  <CTableRow key={index}>
                                    <CTableDataCell>{(penaltyPage - 1) * penaltyLimit + index + 1}</CTableDataCell>
                                    <CTableDataCell>{penalty.referenceNumber || '-'}</CTableDataCell>
                                    <CTableDataCell>₹{penalty.amount?.toLocaleString()}</CTableDataCell>
                                    <CTableDataCell>₹{penalty.paidAmount?.toLocaleString()}</CTableDataCell>
                                    <CTableDataCell>₹{balance.toLocaleString()}</CTableDataCell>
                                    <CTableDataCell>{penalty.reason || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      <span className={`badge ${penalty.status === 'ACTIVE' ? 'bg-warning' : 'bg-success'}`}>
                                        {penalty.status}
                                      </span>
                                    </CTableDataCell>
                                    <CTableDataCell>{formatDate(penalty.penaltyDate)}</CTableDataCell>
                                    <CTableDataCell>{penalty.createdByDetails?.name || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={() => openPenaltyPaymentModal(penalty)}
                                        disabled={!selectedReceipt || balance <= 0}
                                        title={
                                          !selectedReceipt 
                                            ? 'Please select a UTR first' 
                                            : balance <= 0 
                                            ? 'Penalty already paid'
                                            : 'Add payment'
                                        }
                                      >
                                        <CIcon icon={cilPlus} style={{ height: '15px' }} />
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                );
                              })}
                            </CTableBody>
                          </CTable>

                          {penaltyTotalPages > 1 && (
                            <div className="d-flex justify-content-center mt-3">
                              <CPagination>
                                <CPaginationItem
                                  onClick={() => handlePenaltyPageChange(penaltyPage - 1)}
                                  disabled={penaltyPage === 1}
                                >
                                  Previous
                                </CPaginationItem>
                                {Array.from({ length: penaltyTotalPages }, (_, i) => i + 1).map(page => (
                                  <CPaginationItem
                                    key={page}
                                    active={page === penaltyPage}
                                    onClick={() => handlePenaltyPageChange(page)}
                                  >
                                    {page}
                                  </CPaginationItem>
                                ))}
                                <CPaginationItem
                                  onClick={() => handlePenaltyPageChange(penaltyPage + 1)}
                                  disabled={penaltyPage === penaltyTotalPages}
                                >
                                  Next
                                </CPaginationItem>
                              </CPagination>
                            </div>
                          )}
                        </>
                      )}

                      {!loadingPenalties && selectedSubdealer && filteredPenalties.length === 0 && (
                        <div className="text-center py-4">
                          <p>
                            {penaltySearchTerm
                              ? `No penalties found matching "${penaltySearchTerm}"`
                              : 'No active penalties found for this subdealer.'}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Booking Payment Allocation Modal */}
      <CModal visible={bookingModalVisible} onClose={() => setBookingModalVisible(false)}>
        <CModalHeader onClose={() => setBookingModalVisible(false)}>
          <CModalTitle>Allocate Payment to Booking</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Customer Name</CFormLabel>
                  <CFormInput type="text" value={selectedBooking?.customerDetails?.name || ''} disabled readOnly />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Booking Number</CFormLabel>
                  <CFormInput type="text" value={selectedBooking?.bookingNumber || ''} disabled readOnly />
                </div>
              </CCol>
            </CRow>

            <div className="mb-3">
              <CFormLabel>Booking ID</CFormLabel>
              <CFormInput type="text" value={selectedBooking?._id || ''} disabled readOnly />
            </div>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="amount">Amount to Allocate (₹)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="amount"
                    name="amount"
                    value={bookingPaymentData.amount}
                    onChange={handleBookingPaymentChange}
                    placeholder="Enter amount"
                    required
                    min="0.01"
                    step="0.01"
                    max={selectedReceipt ? getRemainingAmount(selectedReceipt) : undefined}
                  />
                  {selectedReceipt && <small className="text-muted">Max: ₹{getRemainingAmount(selectedReceipt).toLocaleString()}</small>}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="remark">Remark (Optional)</CFormLabel>
                  <CFormInput
                    id="remark"
                    name="remark"
                    value={bookingPaymentData.remark}
                    onChange={handleBookingPaymentChange}
                    placeholder="Enter any remarks"
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBookingModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmitBookingPayment} disabled={submittingBookingPayment}>
            {submittingBookingPayment ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                Allocating...
              </>
            ) : (
              <>Allocate Payment</>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Accessory Payment Allocation Modal */}
      <CModal visible={accessoryModalVisible} onClose={() => setAccessoryModalVisible(false)}>
        <CModalHeader onClose={() => setAccessoryModalVisible(false)}>
          <CModalTitle>Allocate Payment to Accessory</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Accessory Invoice ID</CFormLabel>
              <CFormInput 
                type="text" 
                value={selectedAccessory ? selectedAccessory._id.substring(selectedAccessory._id.length - 6) : ''} 
                disabled 
                readOnly 
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Net Amount</CFormLabel>
              <CFormInput 
                type="text" 
                value={selectedAccessory ? `₹${selectedAccessory.net_amount?.toLocaleString()}` : ''} 
                disabled 
                readOnly 
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Balance Amount</CFormLabel>
              <CFormInput 
                type="text" 
                value={selectedAccessory ? `₹${calculateAccessoryBalance(selectedAccessory).toLocaleString()}` : ''} 
                disabled 
                readOnly 
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="accessoryAmount">Amount to Allocate (₹)</CFormLabel>
              <CFormInput
                type="number"
                id="accessoryAmount"
                name="amount"
                value={accessoryPaymentData.amount}
                onChange={handleAccessoryPaymentChange}
                placeholder="Enter amount"
                required
                min="0.01"
                step="0.01"
                max={Math.min(
                  selectedReceipt ? getRemainingAmount(selectedReceipt) : 0,
                  selectedAccessory ? calculateAccessoryBalance(selectedAccessory) : 0
                )}
              />
              <small className="text-muted">
                {selectedReceipt && selectedAccessory && (
                  `Max: ₹${Math.min(
                    getRemainingAmount(selectedReceipt),
                    calculateAccessoryBalance(selectedAccessory)
                  ).toLocaleString()}`
                )}
              </small>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="accessoryRemark">Remark (Optional)</CFormLabel>
              <CFormTextarea
                id="accessoryRemark"
                name="remark"
                value={accessoryPaymentData.remark}
                onChange={handleAccessoryPaymentChange}
                placeholder="Enter any remarks"
                rows={3}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAccessoryModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmitAccessoryPayment} disabled={submittingAccessoryPayment}>
            {submittingAccessoryPayment ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                Allocating...
              </>
            ) : (
              <>Allocate Payment</>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Penalty Payment Allocation Modal - Simplified */}
      <CModal visible={penaltyModalVisible} onClose={() => setPenaltyModalVisible(false)}>
        <CModalHeader onClose={() => setPenaltyModalVisible(false)}>
          <CModalTitle>Allocate Payment to Penalty</CModalTitle>
          <div className="small text-muted">
            {selectedPenalty && (
              <>
                Ref: {selectedPenalty.referenceNumber} | 
                Balance: ₹{calculatePenaltyBalance(selectedPenalty).toLocaleString()} | 
                Reason: {selectedPenalty.reason}
              </>
            )}
          </div>
        </CModalHeader>
        <CModalBody>
          {/* Show error message only in modal */}
          {penaltyModalError && (
            <CAlert color="danger" dismissible onClose={() => setPenaltyModalError('')}>
              {penaltyModalError}
            </CAlert>
          )}

          {/* Show success message only in modal */}
          {penaltyModalSuccess && (
            <CAlert color="success" dismissible onClose={() => setPenaltyModalSuccess('')}>
              {penaltyModalSuccess}
            </CAlert>
          )}

          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="penaltyAmount">Amount to Allocate (₹)</CFormLabel>
              <CFormInput
                type="number"
                id="penaltyAmount"
                name="amount"
                value={penaltyPaymentData.amount}
                onChange={handlePenaltyPaymentChange}
                placeholder="Enter amount"
                required
                min="0.01"
                step="0.01"
                max={Math.min(
                  selectedReceipt ? getRemainingAmount(selectedReceipt) : 0,
                  selectedPenalty ? calculatePenaltyBalance(selectedPenalty) : 0
                )}
              />
              <small className="text-muted">
                {selectedReceipt && selectedPenalty && (
                  `Max: ₹${Math.min(
                    getRemainingAmount(selectedReceipt),
                    calculatePenaltyBalance(selectedPenalty)
                  ).toLocaleString()}`
                )}
              </small>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="paymentDate">Payment Date (Optional)</CFormLabel>
              <CFormInput
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={penaltyPaymentData.paymentDate}
                onChange={handlePenaltyPaymentChange}
              />
              <small className="text-muted">Leave empty to use current date</small>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="penaltyRemark">Remark (Optional)</CFormLabel>
              <CFormTextarea
                id="penaltyRemark"
                name="remark"
                value={penaltyPaymentData.remark}
                onChange={handlePenaltyPaymentChange}
                placeholder="Enter any remarks"
                rows={3}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPenaltyModalVisible(false)} disabled={submittingPenaltyPayment}>
            {penaltyModalSuccess ? 'Close' : 'Cancel'}
          </CButton>
          <CButton color="primary" onClick={handleSubmitPenaltyPayment} disabled={submittingPenaltyPayment || penaltyModalSuccess}>
            {submittingPenaltyPayment ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                Allocating...
              </>
            ) : penaltyModalSuccess ? (
              'Success!'
            ) : (
              <>Allocate Payment</>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default SubdealerCustomerManagement;