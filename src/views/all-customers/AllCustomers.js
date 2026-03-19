// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   useTableFilter,
// //   usePagination,
// //   axiosInstance,
// //   getDefaultSearchFields,
// //   showError
// // } from '../../utils/tableImports';
// // import tvsLogo from '../../assets/images/logo.png';
// // import config from '../../config';
// // import { 
// //   CButton, 
// //   CCard, 
// //   CCardBody, 
// //   CCardHeader, 
// //   CFormInput, 
// //   CFormLabel, 
// //   CTable, 
// //   CTableBody, 
// //   CTableHead, 
// //   CTableHeaderCell, 
// //   CTableRow,
// //   CTableDataCell,
// //   CSpinner,
// //   CAlert
// // } from '@coreui/react';
// // import { useAuth } from '../../context/AuthContext';
// // import { 
// //   canViewPage,
// //   canCreateInPage,
// //   canUpdateInPage,
// //   canDeleteInPage,
// //   MODULES,
// //   PAGES 
// // } from '../../utils/modulePermissions';

// // const AllCustomers = () => {
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const { permissions } = useAuth();
  
// //   // Page-level permission checks for Customers page under Customers module
// //   const canViewCustomers = canViewPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
// //   const canCreateCustomers = canCreateInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
// //   const canUpdateCustomers = canUpdateInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
// //   const canDeleteCustomers = canDeleteInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
  
// //   // Check if user can view ledger (likely VIEW permission is enough for viewing ledger)
// //   const canViewLedger = canViewPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);

// //   useEffect(() => {
// //     if (!canViewCustomers) {
// //       showError('You do not have permission to view Customers');
// //       return;
// //     }
    
// //     fetchData();
// //   }, [canViewCustomers]);

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/customers`);
// //       setData(response.data.data.customers);
// //       setFilteredData(response.data.data.customers);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleViewLedger = async (customer) => {
// //     if (!canViewLedger) {
// //       showError('You do not have permission to view customer ledger');
// //       return;
// //     }
    
// //     try {
// //       const res = await axiosInstance.get(`/ledger/customer/${customer._id}`);
// //       const ledgerData = res.data.data;
// //       const ledgerUrl = `${config.baseURL}/ledger.html?customerId=${customer._id}`;
// //       const bookingSummaryRows = ledgerData.bookingWiseSummary
// //         .map((booking) => {
// //           const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
// //           const bookingRow = `
// //             <tr>
// //               <td>${new Date(booking.lastTransactionDate).toLocaleDateString('en-GB')}</td>
// //               <td>Booking: ${booking.vehicleModel || 'Unknown Model'}</td>
// //               <td>${booking.bookingNumber}</td>
// //               <td class="text-right">-</td>
// //               <td class="text-right">${hasChassisNumber ? booking.totalDebited.toLocaleString('en-IN') : '-'}</td>
// //               <td class="text-right">${hasChassisNumber ? booking.totalDebited.toLocaleString('en-IN') : '-'}</td>
// //             </tr>
// //           `;

// //           const paymentRows = booking.ledgerEntries
// //             .filter((entry) => entry.type === 'CREDIT')
// //             .map(
// //               (entry) => `
// //               <tr>
// //                 <td>${new Date(entry.date).toLocaleDateString('en-GB')}</td>
// //                 <td>${entry.description}</td>
// //                 <td>${booking.bookingNumber}</td>
// //                 <td class="text-right">${entry.credit.toLocaleString('en-IN')}</td>
// //                 <td class="text-right">-</td>
// //                 <td class="text-right">${entry.balance.toLocaleString('en-IN')}</td>
// //               </tr>
// //             `
// //             )
// //             .join('');

// //           return bookingRow + paymentRows;
// //         })
// //         .join('');

// //       const accessoryBillingRows = ledgerData.transactions
// //         .filter((transaction) => transaction.type.includes('ACCESSORY_BILLING'))
// //         .map((transaction) => {
// //           const amount = transaction.netAmount || transaction.amount;
// //           const bookingNumber = transaction.booking?.bookingNumber || '-';
// //           const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
// //           const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';

// //           return `
// //             <tr>
// //               <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
// //               <td>${transaction.type}: ${transaction.remark || ''}</td>
// //               <td>${bookingNumber}</td>
// //               <td class="text-right">-</td>
// //               <td class="text-right">${hasChassisNumber ? amount.toLocaleString('en-IN') : '-'}</td>
// //               <td class="text-right">${''}</td>
// //             </tr>
// //           `;
// //         })
// //         .join('');

// //       const exchangeCreditRows = ledgerData.transactions
// //         .filter((transaction) => transaction.type.includes('EXCHANGE_CREDIT'))
// //         .map((transaction) => {
// //           const amount = transaction.netAmount || transaction.amount;
// //           const bookingNumber = transaction.booking?.bookingNumber || '-';

// //           return `
// //             <tr>
// //               <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
// //               <td>${transaction.type}: ${transaction.remark || ''}</td>
// //               <td>${bookingNumber}</td>
// //               <td class="text-right">${amount.toLocaleString('en-IN')}</td>
// //               <td class="text-right">-</td>
// //               <td class="text-right">${''}</td>
// //             </tr>
// //           `;
// //         })
// //         .join('');
// //       let totalDebited = 0;
// //       let totalBalance = 0;
      
// //       ledgerData.bookingWiseSummary.forEach((booking) => {
// //         const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
// //         if (hasChassisNumber) {
// //           totalDebited += booking.totalDebited || 0;
// //           const accessoryBillingAmounts = ledgerData.transactions
// //             .filter(t => t.type.includes('ACCESSORY_BILLING') && 
// //                         t.booking?.bookingNumber === booking.bookingNumber)
// //             .reduce((sum, t) => sum + (t.netAmount || t.amount || 0), 0);
// //           totalDebited += accessoryBillingAmounts;
// //         }
// //       });

// //       ledgerData.transactions.forEach((transaction) => {
// //         const isDebit = transaction.isDebit === true;
// //         const bookingNumber = transaction.booking?.bookingNumber || '-';
// //         const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
// //         const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
        
// //         if (isDebit && hasChassisNumber) {
// //           totalDebited += transaction.netAmount || transaction.amount || 0;
// //         }
// //       });

// //       const totalReceived = ledgerData.customerDetails?.totalReceived || 0;
// //       totalBalance = totalReceived - totalDebited;
// //       const transactionRows = ledgerData.transactions
// //         .map((transaction) => {
// //           const amount = transaction.netAmount || transaction.amount;
// //           const bookingNumber = transaction.booking?.bookingNumber || '-';
// //           const date = transaction.receiptDate || transaction.createdAt;
// //           const isDebit = transaction.isDebit === true;
// //           const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
// //           const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
          
// //           return `
// //             <tr>
// //               <td>${new Date(date).toLocaleDateString('en-GB')}</td>
// //               <td>${transaction.remark || ''}</td>
// //               <td>${bookingNumber}</td>
// //               <td class="text-right">${!isDebit ? amount.toLocaleString('en-IN') : '-'}</td>
// //               <td class="text-right">${(isDebit && hasChassisNumber) ? amount.toLocaleString('en-IN') : '-'}</td>
// //               <td class="text-right">${''}</td>
// //             </tr>
// //           `;
// //         })
// //         .join('');

// //       const win = window.open('', '_blank');
// //       win.document.write(`
// //           <!DOCTYPE html>
// //           <html>
// //             <head>
// //               <title>Customer Ledger - Booking Summary</title>
// //               <style>
// //                 @page {
// //                   size: A4;
// //                   margin: 15mm 10mm;
// //                 }
// //                 body {
// //                   font-family: Arial;
// //                   width: 100%;
// //                   margin: 0;
// //                   padding: 0;
// //                   font-size: 14px;
// //                   line-height: 1.3;
// //                   font-family: Courier New;
// //                 }
// //                 .container {
// //                   width: 190mm;
// //                   margin: 0 auto;
// //                   padding: 5mm;
// //                 }
// //                 .header-container {
// //                   display: flex;
// //                   justify-content:space-between;
// //                   margin-bottom: 3mm;
// //                 }
// //                 .header-text{
// //                   font-size:20px;
// //                   font-weight:bold;
// //                 }
// //                 .logo {
// //                   width: 30mm;
// //                   height: auto;
// //                   margin-right: 5mm;
// //                 }
// //                 .header {
// //                   text-align: left;
// //                 }
// //                 .divider {
// //                   border-top: 2px solid #AAAAAA;
// //                   margin: 3mm 0;
// //                 }
// //                 .header h2 {
// //                   margin: 2mm 0;
// //                   font-size: 12pt;
// //                   font-weight: bold;
// //                 }
// //                 .header div {
// //                   font-size: 14px;
// //                 }
// //                 .customer-info {
// //                   display: grid;
// //                   grid-template-columns: repeat(2, 1fr);
// //                   gap: 2mm;
// //                   margin-bottom: 5mm;
// //                   font-size: 14px;
// //                 }
// //                 .customer-info div {
// //                   display: flex;
// //                 }
// //                 .customer-info strong {
// //                   min-width: 30mm;
// //                   display: inline-block;
// //                 }
// //                 table {
// //                   width: 100%;
// //                   border-collapse: collapse;
// //                   margin-bottom: 5mm;
// //                   font-size: 14px;
// //                   page-break-inside: avoid;
// //                 }
// //                 th, td {
// //                   border: 1px solid #000;
// //                   padding: 2mm;
// //                   text-align: left;
// //                 }
// //                 th {
// //                   background-color: #f0f0f0;
// //                   font-weight: bold;
// //                 }
// //                 .footer {
// //                   margin-top: 10mm;
// //                   display: flex;
// //                   justify-content: space-between;
// //                   align-items: flex-end;
// //                   font-size: 14px;
// //                 }
// //                 .footer-left {
// //                   text-align: left;
// //                 }
// //                 .footer-right {
// //                   text-align: right;
// //                 }
// //                 .qr-code {
// //                   width: 35mm;
// //                   height: 35mm;
// //                 }
// //                 .text-right {
// //                   text-align: right;
// //                 }
// //                 .text-left {
// //                   text-align: left;
// //                 }
// //                 .text-center {
// //                   text-align: center;
// //                 }
// //                 .note {
// //                   font-style: italic;
// //                   color: #666;
// //                   margin-bottom: 5mm;
// //                   text-align: center;
// //                 }
// //                 @media print {
// //                   body {
// //                     width: 190mm;
// //                     height: 277mm;
// //                   }
// //                   .no-print {
// //                     display: none;
// //                   }
// //                 }
// //               </style>
// //             </head>
// //             <body>
// //               <div class="container">
// //                 <div class="header-container">
// //                   <img src="${tvsLogo}" class="logo" alt="TVS Logo">
// //                   <div class="header-text"> GANDHI TVS</div>
// //                 </div>
// //                 <div class="header">
// //                   <div>
// //                     Authorised Main Dealer: TVS Motor Company Ltd.<br>
// //                     Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
// //                     Upnagar, Nashik Road, Nashik - 422101<br>
// //                     Phone: 7498903672
// //                   </div>
// //                 </div>
// //                 <div class="divider"></div>
// //                 <div class="customer-info">
// //                   <div><strong>Customer ID:</strong> ${ledgerData.customerDetails?.custId || ''}</div>
// //                   <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.customerName || ''}</div>
// //                   <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
// //                   <div><strong>Aadhar No:</strong> ${ledgerData.customerDetails?.customerAadhaar || ''}</div>
// //                   <div><strong>Pan No:</strong> ${ledgerData.customerDetails?.customerPan || ''}</div>
// //                   <div><strong>Current Balance:</strong> ₹${totalBalance.toLocaleString('en-IN')}</div>
// //                 </div>

// //                 <table>
// //                   <thead>
// //                     <tr>
// //                       <th width="15%">Date</th>
// //                       <th width="25%">Description</th>
// //                       <th width="20%">Booking No</th>
// //                       <th width="10%" class="text-right">Credit (₹)</th>
// //                       <th width="10%" class="text-right">Debit (₹)</th>
// //                       <th width="20%" class="text-right">Balance (₹)</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     ${bookingSummaryRows}
// //                     ${accessoryBillingRows}
// //                     ${exchangeCreditRows}
// //                     ${transactionRows}
// //                     <tr>
// //                       <td colspan="2" class="text-left"><strong>Total</strong></td>
// //                       <td class="text-center"><strong>-</strong></td>
// //                       <td class="text-right"><strong>${totalReceived.toLocaleString('en-IN')}</strong></td>
// //                       <td class="text-right"><strong>${totalDebited.toLocaleString('en-IN')}</strong></td>
// //                       <td class="text-right"><strong>${totalBalance.toLocaleString('en-IN')}</strong></td>
// //                     </tr>
// //                   </tbody>
// //                 </table>

// //                 <div class="footer">
// //                   <div class="footer-left">
// //                     <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}"
// //                          class="qr-code"
// //                          alt="QR Code" />
// //                   </div>
// //                   <div class="footer-right">
// //                     <p>For, Gandhi TVS</p>
// //                     <p>Authorised Signatory</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               <script>
// //                 window.onload = function() {
// //                   setTimeout(() => {
// //                     window.print();
// //                   }, 300);
// //                 };
// //               </script>
// //             </body>
// //           </html>
// //         `);
// //     } catch (err) {
// //       console.error('Error fetching ledger:', err);
// //       setError('Failed to load ledger. Please try again.');
// //     }
// //   };

// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //     handleFilter(value, getDefaultSearchFields('allCustomers'));
// //   };

// //   if (!canViewCustomers) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Customers.
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
// //         <CSpinner color="primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className='title'>Customer Ledger</div>
// //       {error && (
// //             <CAlert color="danger" className="mb-3">
// //               {error}
// //             </CAlert>
// //           )}
          
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div>
// //             {canCreateCustomers && (
// //               <CButton 
// //                 size="sm" 
// //                 className="action-btn me-1"
// //                 // You can add onClick for creating new customer here
// //                 disabled={!canCreateCustomers}
// //               >
// //                 New Customer
// //               </CButton>
// //             )}
// //           </div>
// //         </CCardHeader>
        
// //         <CCardBody>
// //           <div className="d-flex justify-content-between mb-3">
// //             <div></div>
// //             <div className='d-flex'>
// //               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //               <CFormInput
// //                 type="text"
// //                 className="d-inline-block square-search"
// //                 value={searchTerm}
// //                 onChange={(e) => handleSearch(e.target.value)}
// //                 disabled={!canViewCustomers}
// //               />
// //             </div>
// //           </div>
          
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //                   <CTableHeaderCell>Customer ID</CTableHeaderCell>
// //                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Address</CTableHeaderCell>
// //                   <CTableHeaderCell>Mobile1</CTableHeaderCell>
// //                   <CTableHeaderCell>Mobile2</CTableHeaderCell>
// //                   <CTableHeaderCell>Date</CTableHeaderCell>
// //                   <CTableHeaderCell>Aadhar Number</CTableHeaderCell>
// //                   <CTableHeaderCell>PAN Number</CTableHeaderCell>
// //                   {canViewLedger && <CTableHeaderCell>Action</CTableHeaderCell>}
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {currentRecords.length === 0 ? (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan={canViewLedger ? "10" : "9"} className="text-center">
// //                       No ledger details available
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 ) : (
// //                   currentRecords.map((customer, index) => (
// //                     <CTableRow key={customer._id || index}>
// //                       <CTableDataCell>{index + 1}</CTableDataCell>
// //                       <CTableDataCell>{customer.custId || ''}</CTableDataCell>
// //                       <CTableDataCell>{customer.name || ''}</CTableDataCell>
// //                       <CTableDataCell>{customer.address || ''}</CTableDataCell>
// //                       <CTableDataCell>{customer.mobile1 || ''}</CTableDataCell>
// //                       <CTableDataCell>{customer.mobile2 || ''}</CTableDataCell>
// //                       <CTableDataCell>
// //                         {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB') : ''}
// //                       </CTableDataCell>
// //                       <CTableDataCell>{customer.aadhaar || ''}</CTableDataCell>
// //                       <CTableDataCell>{customer.pan || ''}</CTableDataCell>
// //                       {canViewLedger && (
// //                         <CTableDataCell>
// //                           <CButton
// //                             size="sm"
// //                             className='option-button btn-sm'
// //                             onClick={() => handleViewLedger(customer)}
// //                             disabled={!canViewLedger}
// //                           >
// //                             View Ledger
// //                           </CButton>
// //                         </CTableDataCell>
// //                       )}
// //                     </CTableRow>
// //                   ))
// //                 )}
// //               </CTableBody>
// //             </CTable>
// //           </div>
// //         </CCardBody>
// //       </CCard>
// //     </div>
// //   );
// // };

// // export default AllCustomers;







// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   getDefaultSearchFields,
//   showError
// } from '../../utils/tableImports';
// import tvsLogo from '../../assets/images/logo.png';
// import config from '../../config';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCardHeader, 
//   CFormInput, 
//   CFormLabel, 
//   CTable, 
//   CTableBody, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CAlert
// } from '@coreui/react';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES,
//   PAGES 
// } from '../../utils/modulePermissions';

// const AllCustomers = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Customers page under Customers module
//   const canViewCustomers = canViewPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
//   const canCreateCustomers = canCreateInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
//   const canUpdateCustomers = canUpdateInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
//   const canDeleteCustomers = canDeleteInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
  
//   // Check if user can view ledger (likely VIEW permission is enough for viewing ledger)
//   const canViewLedger = canViewPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);

//   useEffect(() => {
//     if (!canViewCustomers) {
//       showError('You do not have permission to view Customers');
//       return;
//     }
    
//     fetchData();
//   }, [canViewCustomers]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/customers`);
//       setData(response.data.data.customers);
//       setFilteredData(response.data.data.customers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleViewLedger = async (customer) => {
//   //   if (!canViewLedger) {
//   //     showError('You do not have permission to view customer ledger');
//   //     return;
//   //   }
    
//   //   try {
//   //     const res = await axiosInstance.get(`/ledger/customer/${customer._id}`);
//   //     const ledgerData = res.data.data;
//   //     const ledgerUrl = `${config.baseURL}/ledger.html?customerId=${customer._id}`;
//   //     const bookingSummaryRows = ledgerData.bookingWiseSummary
//   //       .map((booking) => {
//   //         const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
//   //         const bookingRow = `
//   //           <tr>
//   //             <td>${new Date(booking.lastTransactionDate).toLocaleDateString('en-GB')}</td>
//   //             <td>Booking: ${booking.vehicleModel || 'Unknown Model'}</td>
//   //             <td>${booking.bookingNumber}</td>
//   //             <td class="text-right">-</td>
//   //             <td class="text-right">${hasChassisNumber ? booking.totalDebited.toLocaleString('en-IN') : '-'}</td>
//   //             <td class="text-right">${hasChassisNumber ? booking.totalDebited.toLocaleString('en-IN') : '-'}</td>
//   //           </tr>
//   //         `;

//   //         const paymentRows = booking.ledgerEntries
//   //           .filter((entry) => entry.type === 'CREDIT')
//   //           .map(
//   //             (entry) => `
//   //             <tr>
//   //               <td>${new Date(entry.date).toLocaleDateString('en-GB')}</td>
//   //               <td>${entry.description}</td>
//   //               <td>${booking.bookingNumber}</td>
//   //               <td class="text-right">${entry.credit.toLocaleString('en-IN')}</td>
//   //               <td class="text-right">-</td>
//   //               <td class="text-right">${entry.balance.toLocaleString('en-IN')}</td>
//   //             </tr>
//   //           `
//   //           )
//   //           .join('');

//   //         return bookingRow + paymentRows;
//   //       })
//   //       .join('');

//   //     const accessoryBillingRows = ledgerData.transactions
//   //       .filter((transaction) => transaction.type.includes('ACCESSORY_BILLING'))
//   //       .map((transaction) => {
//   //         const amount = transaction.netAmount || transaction.amount;
//   //         const bookingNumber = transaction.booking?.bookingNumber || '-';
//   //         const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//   //         const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';

//   //         return `
//   //           <tr>
//   //             <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
//   //             <td>${transaction.type}: ${transaction.remark || ''}</td>
//   //             <td>${bookingNumber}</td>
//   //             <td class="text-right">-</td>
//   //             <td class="text-right">${hasChassisNumber ? amount.toLocaleString('en-IN') : '-'}</td>
//   //             <td class="text-right">${''}</td>
//   //           </tr>
//   //         `;
//   //       })
//   //       .join('');

//   //     const exchangeCreditRows = ledgerData.transactions
//   //       .filter((transaction) => transaction.type.includes('EXCHANGE_CREDIT'))
//   //       .map((transaction) => {
//   //         const amount = transaction.netAmount || transaction.amount;
//   //         const bookingNumber = transaction.booking?.bookingNumber || '-';

//   //         return `
//   //           <tr>
//   //             <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
//   //             <td>${transaction.type}: ${transaction.remark || ''}</td>
//   //             <td>${bookingNumber}</td>
//   //             <td class="text-right">${amount.toLocaleString('en-IN')}</td>
//   //             <td class="text-right">-</td>
//   //             <td class="text-right">${''}</td>
//   //           </tr>
//   //         `;
//   //       })
//   //       .join('');
//   //     let totalDebited = 0;
//   //     let totalBalance = 0;
      
//   //     ledgerData.bookingWiseSummary.forEach((booking) => {
//   //       const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
//   //       if (hasChassisNumber) {
//   //         totalDebited += booking.totalDebited || 0;
//   //         const accessoryBillingAmounts = ledgerData.transactions
//   //           .filter(t => t.type.includes('ACCESSORY_BILLING') && 
//   //                       t.booking?.bookingNumber === booking.bookingNumber)
//   //           .reduce((sum, t) => sum + (t.netAmount || t.amount || 0), 0);
//   //         totalDebited += accessoryBillingAmounts;
//   //       }
//   //     });

//   //     ledgerData.transactions.forEach((transaction) => {
//   //       const isDebit = transaction.isDebit === true;
//   //       const bookingNumber = transaction.booking?.bookingNumber || '-';
//   //       const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//   //       const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
        
//   //       if (isDebit && hasChassisNumber) {
//   //         totalDebited += transaction.netAmount || transaction.amount || 0;
//   //       }
//   //     });

//   //     const totalReceived = ledgerData.customerDetails?.totalReceived || 0;
//   //     totalBalance = totalReceived - totalDebited;
//   //     // const transactionRows = ledgerData.transactions
//   //     //   .map((transaction) => {
//   //     //     const amount = transaction.netAmount || transaction.amount;
//   //     //     const bookingNumber = transaction.booking?.bookingNumber || '-';
//   //     //     const date = transaction.receiptDate || transaction.createdAt;
//   //     //     const isDebit = transaction.isDebit === true;
//   //     //     const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//   //     //     const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
          
//   //     //     return `
//   //     //       <tr>
//   //     //         <td>${new Date(date).toLocaleDateString('en-GB')}</td>
//   //     //         <td>${transaction.remark || ''}</td>
//   //     //         <td>${bookingNumber}</td>
//   //     //         <td class="text-right">${!isDebit ? amount.toLocaleString('en-IN') : '-'}</td>
//   //     //         <td class="text-right">${(isDebit && hasChassisNumber) ? amount.toLocaleString('en-IN') : '-'}</td>
//   //     //         <td class="text-right">${''}</td>
//   //     //       </tr>
//   //     //     `;
//   //     //   })
//   //     //   .join('');
//   //      const transactionRows = ledgerData.transactions
//   // .filter((transaction) => !transaction.type.includes('EXCHANGE_CREDIT')) // Add this filter
//   // .map((transaction) => {
//   //   const amount = transaction.netAmount || transaction.amount;
//   //   const bookingNumber = transaction.booking?.bookingNumber || '-';
//   //   const date = transaction.receiptDate || transaction.createdAt;
//   //   const isDebit = transaction.isDebit === true;
//   //   const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//   //   const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
    
//   //   return `
//   //     <tr>
//   //       <td>${new Date(date).toLocaleDateString('en-GB')}</td>
//   //       <td>${transaction.remark || ''}</td>
//   //       <td>${bookingNumber}</td>
//   //       <td class="text-right">${!isDebit ? amount.toLocaleString('en-IN') : '-'}</td>
//   //       <td class="text-right">${(isDebit && hasChassisNumber) ? amount.toLocaleString('en-IN') : '-'}</td>
//   //       <td class="text-right">${''}</td>
//   //     </tr>
//   //   `;
//   // })
//   // .join('');
//   //     const win = window.open('', '_blank');
//   //     win.document.write(`
//   //         <!DOCTYPE html>
//   //         <html>
//   //           <head>
//   //             <title>Customer Ledger - Booking Summary</title>
//   //             <style>
//   //               @page {
//   //                 size: A4;
//   //                 margin: 15mm 10mm;
//   //               }
//   //               body {
//   //                 font-family: Arial;
//   //                 width: 100%;
//   //                 margin: 0;
//   //                 padding: 0;
//   //                 font-size: 14px;
//   //                 line-height: 1.3;
//   //                 font-family: Courier New;
//   //               }
//   //               .container {
//   //                 width: 190mm;
//   //                 margin: 0 auto;
//   //                 padding: 5mm;
//   //               }
//   //               .header-container {
//   //                 display: flex;
//   //                 justify-content:space-between;
//   //                 margin-bottom: 3mm;
//   //               }
//   //               .header-text{
//   //                 font-size:20px;
//   //                 font-weight:bold;
//   //               }
//   //               .logo {
//   //                 width: 30mm;
//   //                 height: auto;
//   //                 margin-right: 5mm;
//   //               }
//   //               .header {
//   //                 text-align: left;
//   //               }
//   //               .divider {
//   //                 border-top: 2px solid #AAAAAA;
//   //                 margin: 3mm 0;
//   //               }
//   //               .header h2 {
//   //                 margin: 2mm 0;
//   //                 font-size: 12pt;
//   //                 font-weight: bold;
//   //               }
//   //               .header div {
//   //                 font-size: 14px;
//   //               }
//   //               .customer-info {
//   //                 display: grid;
//   //                 grid-template-columns: repeat(2, 1fr);
//   //                 gap: 2mm;
//   //                 margin-bottom: 5mm;
//   //                 font-size: 14px;
//   //               }
//   //               .customer-info div {
//   //                 display: flex;
//   //               }
//   //               .customer-info strong {
//   //                 min-width: 30mm;
//   //                 display: inline-block;
//   //               }
//   //               table {
//   //                 width: 100%;
//   //                 border-collapse: collapse;
//   //                 margin-bottom: 5mm;
//   //                 font-size: 14px;
//   //                 page-break-inside: avoid;
//   //               }
//   //               th, td {
//   //                 border: 1px solid #000;
//   //                 padding: 2mm;
//   //                 text-align: left;
//   //               }
//   //               th {
//   //                 background-color: #f0f0f0;
//   //                 font-weight: bold;
//   //               }
//   //               .footer {
//   //                 margin-top: 10mm;
//   //                 display: flex;
//   //                 justify-content: space-between;
//   //                 align-items: flex-end;
//   //                 font-size: 14px;
//   //               }
//   //               .footer-left {
//   //                 text-align: left;
//   //               }
//   //               .footer-right {
//   //                 text-align: right;
//   //               }
//   //               .qr-code {
//   //                 width: 35mm;
//   //                 height: 35mm;
//   //               }
//   //               .text-right {
//   //                 text-align: right;
//   //               }
//   //               .text-left {
//   //                 text-align: left;
//   //               }
//   //               .text-center {
//   //                 text-align: center;
//   //               }
//   //               .note {
//   //                 font-style: italic;
//   //                 color: #666;
//   //                 margin-bottom: 5mm;
//   //                 text-align: center;
//   //               }
//   //               @media print {
//   //                 body {
//   //                   width: 190mm;
//   //                   height: 277mm;
//   //                 }
//   //                 .no-print {
//   //                   display: none;
//   //                 }
//   //               }
//   //             </style>
//   //           </head>
//   //           <body>
//   //             <div class="container">
//   //               <div class="header-container">
//   //                 <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//   //                 <div class="header-text"> GANDHI TVS</div>
//   //               </div>
//   //               <div class="header">
//   //                 <div>
//   //                   Authorised Main Dealer: TVS Motor Company Ltd.<br>
//   //                   Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//   //                   Upnagar, Nashik Road, Nashik - 422101<br>
//   //                   Phone: 7498903672
//   //                 </div>
//   //               </div>
//   //               <div class="divider"></div>
//   //               <div class="customer-info">
//   //                 <div><strong>Customer ID:</strong> ${ledgerData.customerDetails?.custId || ''}</div>
//   //                 <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.customerName || ''}</div>
//   //                 <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
//   //                 <div><strong>Aadhar No:</strong> ${ledgerData.customerDetails?.customerAadhaar || ''}</div>
//   //                 <div><strong>Pan No:</strong> ${ledgerData.customerDetails?.customerPan || ''}</div>
//   //                 <div><strong>Current Balance:</strong> ₹${totalBalance.toLocaleString('en-IN')}</div>
//   //               </div>

//   //               <table>
//   //                 <thead>
//   //                   <tr>
//   //                     <th width="15%">Date</th>
//   //                     <th width="25%">Description</th>
//   //                     <th width="20%">Booking No</th>
//   //                     <th width="10%" class="text-right">Credit (₹)</th>
//   //                     <th width="10%" class="text-right">Debit (₹)</th>
//   //                     <th width="20%" class="text-right">Balance (₹)</th>
//   //                   </tr>
//   //                 </thead>
//   //                 <tbody>
//   //                   ${bookingSummaryRows}
//   //                   ${accessoryBillingRows}
//   //                   ${exchangeCreditRows}
//   //                   ${transactionRows}
//   //                   <tr>
//   //                     <td colspan="2" class="text-left"><strong>Total</strong></td>
//   //                     <td class="text-center"><strong>-</strong></td>
//   //                     <td class="text-right"><strong>${totalReceived.toLocaleString('en-IN')}</strong></td>
//   //                     <td class="text-right"><strong>${totalDebited.toLocaleString('en-IN')}</strong></td>
//   //                     <td class="text-right"><strong>${totalBalance.toLocaleString('en-IN')}</strong></td>
//   //                   </tr>
//   //                 </tbody>
//   //               </table>

//   //               <div class="footer">
//   //                 <div class="footer-left">
//   //                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}"
//   //                        class="qr-code"
//   //                        alt="QR Code" />
//   //                 </div>
//   //                 <div class="footer-right">
//   //                   <p>For, Gandhi TVS</p>
//   //                   <p>Authorised Signatory</p>
//   //                 </div>
//   //               </div>
//   //             </div>

//   //             <script>
//   //               window.onload = function() {
//   //                 setTimeout(() => {
//   //                   window.print();
//   //                 }, 300);
//   //               };
//   //             </script>
//   //           </body>
//   //         </html>
//   //       `);
//   //   } catch (err) {
//   //     console.error('Error fetching ledger:', err);
//   //     setError('Failed to load ledger. Please try again.');
//   //   }
//   // };


// const handleViewLedger = async (customer) => {
//   if (!canViewLedger) {
//     showError('You do not have permission to view customer ledger');
//     return;
//   }
  
//   try {
//     const res = await axiosInstance.get(`/ledger/customer/${customer._id}`);
//     const ledgerData = res.data.data;
//     const ledgerUrl = `${config.baseURL}/ledger.html?customerId=${customer._id}`;
    
//     // Filter ledger entries to show only approved ones in the booking summary
//     const approvedBookingSummaryRows = ledgerData.bookingWiseSummary
//       .map((booking) => {
//         const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
        
//         // Filter booking ledger entries to show only approved ones
//         const approvedLedgerEntries = booking.ledgerEntries.filter(entry => 
//           entry.approvalStatus === 'Approved'
//         );
        
//         // Find the initial approved booking creation entry
//         const initialBookingEntry = approvedLedgerEntries.find(entry => 
//           entry.description && entry.description.includes('Initial booking creation')
//         );
        
//         const bookingRow = initialBookingEntry ? `
//           <tr>
//             <td>${new Date(initialBookingEntry.date).toLocaleDateString('en-GB')}</td>
//             <td>Booking: ${booking.vehicleModel || 'Unknown Model'}</td>
//             <td>${booking.bookingNumber}</td>
//             <td class="text-right">-</td>
//             <td class="text-right">${hasChassisNumber ? initialBookingEntry.debit.toLocaleString('en-IN') : '-'}</td>
//             <td class="text-right">${initialBookingEntry.balance.toLocaleString('en-IN')}</td>
//           </tr>
//         ` : '';
        
//         // Filter payment entries to show only approved ones
//         const approvedPaymentEntries = approvedLedgerEntries.filter(entry => 
//           entry.type === 'CREDIT' && entry.approvalStatus === 'Approved'
//         );
        
//         const paymentRows = approvedPaymentEntries
//           .map(
//             (entry) => `
//             <tr>
//               <td>${new Date(entry.date).toLocaleDateString('en-GB')}</td>
//               <td>${entry.description}</td>
//               <td>${booking.bookingNumber}</td>
//               <td class="text-right">${entry.credit.toLocaleString('en-IN')}</td>
//               <td class="text-right">-</td>
//               <td class="text-right">${entry.balance.toLocaleString('en-IN')}</td>
//             </tr>
//           `
//           )
//           .join('');

//         return bookingRow + paymentRows;
//       })
//       .join('');
    
//     // Process transactions - show ONLY approved transactions
//     const approvedTransactions = ledgerData.transactions.filter(
//       transaction => transaction.approvalStatus === 'Approved'
//     );
    
//     const transactionRows = ledgerData.transactions
//   .filter((transaction) => 
//     !transaction.type.includes('EXCHANGE_CREDIT') && 
//     !transaction.type.includes('ACCESSORY_BILLING') &&
//     !transaction.type.includes('BOOKING_PAYMENT')  // Add this filter
//   )
//   .map((transaction) => {
//     const amount = transaction.netAmount || transaction.amount;
//     const bookingNumber = transaction.booking?.bookingNumber || '-';
//     const date = transaction.receiptDate || transaction.createdAt;
//     const isDebit = transaction.isDebit === true;
//     const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//     const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
    
//     return `
//       <tr>
//         <td>${new Date(date).toLocaleDateString('en-GB')}</td>
//         <td>${transaction.remark || ''}</td>
//         <td>${bookingNumber}</td>
//         <td class="text-right">${!isDebit ? amount.toLocaleString('en-IN') : '-'}</td>
//         <td class="text-right">${(isDebit && hasChassisNumber) ? amount.toLocaleString('en-IN') : '-'}</td>
//         <td class="text-right">${''}</td>
//       </tr>
//     `;
//   })
//   .join('');
    
//     // Show accessory billing transactions - ONLY approved
//     const accessoryBillingRows = ledgerData.transactions
//       .filter((transaction) => 
//         transaction.type.includes('ACCESSORY_BILLING') && 
//         transaction.approvalStatus === 'Approved'
//       )
//       .map((transaction) => {
//         const amount = transaction.netAmount || transaction.amount;
//         const bookingNumber = transaction.booking?.bookingNumber || '-';
//         const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//         const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
        
//         return `
//           <tr>
//             <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
//             <td>${transaction.type}: ${transaction.remark || ''}</td>
//             <td>${bookingNumber}</td>
//             <td class="text-right">-</td>
//             <td class="text-right">${hasChassisNumber ? amount.toLocaleString('en-IN') : '-'}</td>
//             <td class="text-right">${''}</td>
//           </tr>
//         `;
//       })
//       .join('');
    
//     // Show exchange credit transactions - ONLY approved
//     const exchangeCreditRows = ledgerData.transactions
//       .filter((transaction) => 
//         transaction.type.includes('EXCHANGE_CREDIT') && 
//         transaction.approvalStatus === 'Approved'
//       )
//       .map((transaction) => {
//         const amount = transaction.netAmount || transaction.amount;
//         const bookingNumber = transaction.booking?.bookingNumber || '-';
        
//         return `
//           <tr>
//             <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
//             <td>${transaction.type}: ${transaction.remark || ''}</td>
//             <td>${bookingNumber}</td>
//             <td class="text-right">${amount.toLocaleString('en-IN')}</td>
//             <td class="text-right">-</td>
//             <td class="text-right">${''}</td>
//           </tr>
//         `;
//       })
//       .join('');
    
//     // Calculate totals - include ONLY approved transactions
//     let totalDebited = 0;
//     let totalReceived = 0;
//     let totalBalance = 0;
    
//     // Calculate from booking summaries (approved entries only)
//     ledgerData.bookingWiseSummary.forEach((booking) => {
//       const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
//       if (hasChassisNumber) {
//         const approvedEntries = booking.ledgerEntries.filter(entry => 
//           entry.approvalStatus === 'Approved'
//         );
        
//         approvedEntries.forEach(entry => {
//           if (entry.type === 'DEBIT' && entry.approvalStatus === 'Approved') {
//             totalDebited += entry.debit || 0;
//           }
//         });
//       }
//     });
    
//     // Calculate from transactions - include ONLY approved
//     const approvedDebitTransactions = ledgerData.transactions.filter(
//       transaction => transaction.isDebit === true && transaction.approvalStatus === 'Approved'
//     );
    
//     const approvedCreditTransactions = ledgerData.transactions.filter(
//       transaction => transaction.isDebit === false && transaction.approvalStatus === 'Approved'
//     );
    
//     approvedDebitTransactions.forEach((transaction) => {
//       const bookingNumber = transaction.booking?.bookingNumber || '-';
//       const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
//       const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
      
//       if (hasChassisNumber) {
//         totalDebited += transaction.netAmount || transaction.amount || 0;
//       }
//     });
    
//     approvedCreditTransactions.forEach((transaction) => {
//       totalReceived += transaction.netAmount || transaction.amount || 0;
//     });
    
//     totalBalance = totalReceived - totalDebited;
    
//     const win = window.open('', '_blank');
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Customer Ledger - Booking Summary</title>
//           <style>
//             @page {
//               size: A4;
//               margin: 15mm 10mm;
//             }
//             body {
//               font-family: Arial;
//               width: 100%;
//               margin: 0;
//               padding: 0;
//               font-size: 14px;
//               line-height: 1.3;
//               font-family: Courier New;
//             }
//             .container {
//               width: 190mm;
//               margin: 0 auto;
//               padding: 5mm;
//             }
//             .header-container {
//               display: flex;
//               justify-content:space-between;
//               margin-bottom: 3mm;
//             }
//             .header-text{
//               font-size:20px;
//               font-weight:bold;
//             }
//             .logo {
//               width: 30mm;
//               height: auto;
//               margin-right: 5mm;
//             }
//             .header {
//               text-align: left;
//             }
//             .divider {
//               border-top: 2px solid #AAAAAA;
//               margin: 3mm 0;
//             }
//             .header h2 {
//               margin: 2mm 0;
//               font-size: 12pt;
//               font-weight: bold;
//             }
//             .header div {
//               font-size: 14px;
//             }
//             .customer-info {
//               display: grid;
//               grid-template-columns: repeat(2, 1fr);
//               gap: 2mm;
//               margin-bottom: 5mm;
//               font-size: 14px;
//             }
//             .customer-info div {
//               display: flex;
//             }
//             .customer-info strong {
//               min-width: 30mm;
//               display: inline-block;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-bottom: 5mm;
//               font-size: 14px;
//               page-break-inside: avoid;
//             }
//             th, td {
//               border: 1px solid #000;
//               padding: 2mm;
//               text-align: left;
//             }
//             th {
//               background-color: #f0f0f0;
//               font-weight: bold;
//             }
//             .footer {
//               margin-top: 10mm;
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-end;
//               font-size: 14px;
//             }
//             .footer-left {
//               text-align: left;
//             }
//             .footer-right {
//               text-align: right;
//             }
//             .qr-code {
//               width: 35mm;
//               height: 35mm;
//             }
//             .text-right {
//               text-align: right;
//             }
//             .text-left {
//               text-align: left;
//             }
//             .text-center {
//               text-align: center;
//             }
//             @media print {
//               body {
//                 width: 190mm;
//                 height: 277mm;
//               }
//               .no-print {
//                 display: none;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header-container">
//               <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//               <div class="header-text"> GANDHI TVS</div>
//             </div>
//             <div class="header">
//               <div>
//                 Authorised Main Dealer: TVS Motor Company Ltd.<br>
//                 Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//                 Upnagar, Nashik Road, Nashik - 422101<br>
//                 Phone: 7498903672
//               </div>
//             </div>
//             <div class="divider"></div>
//             <div class="customer-info">
//               <div><strong>Customer ID:</strong> ${ledgerData.customerDetails?.custId || ''}</div>
//               <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.customerName || ''}</div>
//               <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
//               <div><strong>Aadhar No:</strong> ${ledgerData.customerDetails?.customerAadhaar || ''}</div>
//               <div><strong>Pan No:</strong> ${ledgerData.customerDetails?.customerPan || ''}</div>
//               <div><strong>Current Balance:</strong> ₹${totalBalance.toLocaleString('en-IN')}</div>
//             </div>

//             <table>
//               <thead>
//                 <tr>
//                   <th width="15%">Date</th>
//                   <th width="25%">Description</th>
//                   <th width="20%">Booking No</th>
//                   <th width="10%" class="text-right">Credit (₹)</th>
//                   <th width="10%" class="text-right">Debit (₹)</th>
//                   <th width="20%" class="text-right">Balance (₹)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${approvedBookingSummaryRows}
//                 ${accessoryBillingRows}
//                 ${exchangeCreditRows}
//                 ${transactionRows}
//                 <tr>
//                   <td colspan="2" class="text-left"><strong>Total</strong></td>
//                   <td class="text-center"><strong>-</strong></td>
//                   <td class="text-right"><strong>${totalReceived.toLocaleString('en-IN')}</strong></td>
//                   <td class="text-right"><strong>${totalDebited.toLocaleString('en-IN')}</strong></td>
//                   <td class="text-right"><strong>${totalBalance.toLocaleString('en-IN')}</strong></td>
//                 </tr>
//               </tbody>
//             </table>

//             <div class="footer">
//               <div class="footer-left">
//                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}"
//                      class="qr-code"
//                      alt="QR Code" />
//               </div>
//               <div class="footer-right">
//                 <p>For, Gandhi TVS</p>
//                 <p>Authorised Signatory</p>
//               </div>
//             </div>
//           </div>

//           <script>
//             window.onload = function() {
//               setTimeout(() => {
//                 window.print();
//               }, 300);
//             };
//           </script>
//         </body>
//       </html>
//     `);
//   } catch (err) {
//     console.error('Error fetching ledger:', err);
//     setError('Failed to load ledger. Please try again.');
//   }
// };


//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('allCustomers'));
//   };

//   if (!canViewCustomers) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Customers.
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Customer Ledger</div>
//       {error && (
//             <CAlert color="danger" className="mb-3">
//               {error}
//             </CAlert>
//           )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateCustomers && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 // You can add onClick for creating new customer here
//                 disabled={!canCreateCustomers}
//               >
//                 New Customer
//               </CButton>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 disabled={!canViewCustomers}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Customer ID</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Address</CTableHeaderCell>
//                   <CTableHeaderCell>Mobile1</CTableHeaderCell>
//                   <CTableHeaderCell>Mobile2</CTableHeaderCell>
//                   <CTableHeaderCell>Date</CTableHeaderCell>
//                   <CTableHeaderCell>Aadhar Number</CTableHeaderCell>
//                   <CTableHeaderCell>PAN Number</CTableHeaderCell>
//                   {canViewLedger && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={canViewLedger ? "10" : "9"} className="text-center">
//                       No ledger details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((customer, index) => (
//                     <CTableRow key={customer._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{customer.custId || ''}</CTableDataCell>
//                       <CTableDataCell>{customer.name || ''}</CTableDataCell>
//                       <CTableDataCell>{customer.address || ''}</CTableDataCell>
//                       <CTableDataCell>{customer.mobile1 || ''}</CTableDataCell>
//                       <CTableDataCell>{customer.mobile2 || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB') : ''}
//                       </CTableDataCell>
//                       <CTableDataCell>{customer.aadhaar || ''}</CTableDataCell>
//                       <CTableDataCell>{customer.pan || ''}</CTableDataCell>
//                       {canViewLedger && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={() => handleViewLedger(customer)}
//                             disabled={!canViewLedger}
//                           >
//                             View Ledger
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default AllCustomers;






import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  useTableFilter,
  usePagination,
  axiosInstance,
  getDefaultSearchFields,
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
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const AllCustomers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { permissions } = useAuth();

  // Pagination states
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: '',
    hasNextPage: false,
    hasPrevPage: false
  });

  // Debounce timer for search
  const searchTimer = React.useRef(null);
  
  // Page-level permission checks for Customers page under Customers module
  const canViewCustomers = canViewPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
  const canCreateCustomers = canCreateInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
  const canUpdateCustomers = canUpdateInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
  const canDeleteCustomers = canDeleteInPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);
  
  // Check if user can view ledger (likely VIEW permission is enough for viewing ledger)
  const canViewLedger = canViewPage(permissions, MODULES.CUSTOMERS, PAGES.CUSTOMERS.ALL_CUSTOMERS);

  useEffect(() => {
    if (!canViewCustomers) {
      showError('You do not have permission to view Customers');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewCustomers]);

  // Fetch data with pagination and search
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    if (!canViewCustomers) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Add search parameter if provided (if API supports it)
      if (search) {
        params.append('search', search);
      }
      
      const response = await axiosInstance.get(`/customers?${params.toString()}`);

      if (response.data.success) {
        const customers = response.data.data?.customers || [];
        const total = response.data.data?.total || customers.length;
        const pages = response.data.data?.pages || Math.ceil(total / limit);
        const hasNextPage = response.data.data?.hasNextPage || false;
        const hasPrevPage = response.data.data?.hasPrevPage || false;
        const currentPage = response.data.data?.currentPage || page;

        setPagination({
          docs: customers,
          total: total,
          pages: pages,
          currentPage: currentPage,
          limit: limit,
          loading: false,
          search: search,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage
        });
        
        setData(customers);
        setFilteredData(customers);
      } else {
        throw new Error('Failed to fetch customers');
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
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

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, search: value }));
    
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchData(1, pagination.limit, value);
    }, 400);
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

  const handleViewLedger = async (customer) => {
    if (!canViewLedger) {
      showError('You do not have permission to view customer ledger');
      return;
    }
    
    try {
      const res = await axiosInstance.get(`/ledger/customer/${customer._id}`);
      const ledgerData = res.data.data;
      const ledgerUrl = `${config.baseURL}/ledger.html?customerId=${customer._id}`;
      
      // Filter ledger entries to show only approved ones in the booking summary
      const approvedBookingSummaryRows = ledgerData.bookingWiseSummary
        .map((booking) => {
          const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
          
          // Filter booking ledger entries to show only approved ones
          const approvedLedgerEntries = booking.ledgerEntries.filter(entry => 
            entry.approvalStatus === 'Approved'
          );
          
          // Find the initial approved booking creation entry
          const initialBookingEntry = approvedLedgerEntries.find(entry => 
            entry.description && entry.description.includes('Initial booking creation')
          );
          
          const bookingRow = initialBookingEntry ? `
            <tr>
              <td>${new Date(initialBookingEntry.date).toLocaleDateString('en-GB')}</td>
              <td>Booking: ${booking.vehicleModel || 'Unknown Model'}</td>
              <td>${booking.bookingNumber}</td>
              <td class="text-right">-</td>
              <td class="text-right">${hasChassisNumber ? initialBookingEntry.debit.toLocaleString('en-IN') : '-'}</td>
              <td class="text-right">${initialBookingEntry.balance.toLocaleString('en-IN')}</td>
            </tr>
          ` : '';
          
          // Filter payment entries to show only approved ones
          const approvedPaymentEntries = approvedLedgerEntries.filter(entry => 
            entry.type === 'CREDIT' && entry.approvalStatus === 'Approved'
          );
          
          const paymentRows = approvedPaymentEntries
            .map(
              (entry) => `
              <tr>
                <td>${new Date(entry.date).toLocaleDateString('en-GB')}</td>
                <td>${entry.description}</td>
                <td>${booking.bookingNumber}</td>
                <td class="text-right">${entry.credit.toLocaleString('en-IN')}</td>
                <td class="text-right">-</td>
                <td class="text-right">${entry.balance.toLocaleString('en-IN')}</td>
              </tr>
            `
            )
            .join('');

          return bookingRow + paymentRows;
        })
        .join('');
      
      // Process transactions - show ONLY approved transactions
      const approvedTransactions = ledgerData.transactions.filter(
        transaction => transaction.approvalStatus === 'Approved'
      );
      
      const transactionRows = ledgerData.transactions
    .filter((transaction) => 
      !transaction.type.includes('EXCHANGE_CREDIT') && 
      !transaction.type.includes('ACCESSORY_BILLING') &&
      !transaction.type.includes('BOOKING_PAYMENT')  // Add this filter
    )
    .map((transaction) => {
      const amount = transaction.netAmount || transaction.amount;
      const bookingNumber = transaction.booking?.bookingNumber || '-';
      const date = transaction.receiptDate || transaction.createdAt;
      const isDebit = transaction.isDebit === true;
      const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
      const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
      
      return `
        <tr>
          <td>${new Date(date).toLocaleDateString('en-GB')}</td>
          <td>${transaction.remark || ''}</td>
          <td>${bookingNumber}</td>
          <td class="text-right">${!isDebit ? amount.toLocaleString('en-IN') : '-'}</td>
          <td class="text-right">${(isDebit && hasChassisNumber) ? amount.toLocaleString('en-IN') : '-'}</td>
          <td class="text-right">${''}</td>
        </tr>
      `;
    })
    .join('');
      
      // Show accessory billing transactions - ONLY approved
      const accessoryBillingRows = ledgerData.transactions
        .filter((transaction) => 
          transaction.type.includes('ACCESSORY_BILLING') && 
          transaction.approvalStatus === 'Approved'
        )
        .map((transaction) => {
          const amount = transaction.netAmount || transaction.amount;
          const bookingNumber = transaction.booking?.bookingNumber || '-';
          const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
          const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
          
          return `
            <tr>
              <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
              <td>${transaction.type}: ${transaction.remark || ''}</td>
              <td>${bookingNumber}</td>
              <td class="text-right">-</td>
              <td class="text-right">${hasChassisNumber ? amount.toLocaleString('en-IN') : '-'}</td>
              <td class="text-right">${''}</td>
            </tr>
          `;
        })
        .join('');
      
      // Show exchange credit transactions - ONLY approved
      const exchangeCreditRows = ledgerData.transactions
        .filter((transaction) => 
          transaction.type.includes('EXCHANGE_CREDIT') && 
          transaction.approvalStatus === 'Approved'
        )
        .map((transaction) => {
          const amount = transaction.netAmount || transaction.amount;
          const bookingNumber = transaction.booking?.bookingNumber || '-';
          
          return `
            <tr>
              <td>${new Date(transaction.receiptDate || transaction.createdAt).toLocaleDateString('en-GB')}</td>
              <td>${transaction.type}: ${transaction.remark || ''}</td>
              <td>${bookingNumber}</td>
              <td class="text-right">${amount.toLocaleString('en-IN')}</td>
              <td class="text-right">-</td>
              <td class="text-right">${''}</td>
            </tr>
          `;
        })
        .join('');
      
      // Calculate totals - include ONLY approved transactions
      let totalDebited = 0;
      let totalReceived = 0;
      let totalBalance = 0;
      
      // Calculate from booking summaries (approved entries only)
      ledgerData.bookingWiseSummary.forEach((booking) => {
        const hasChassisNumber = booking.chassisNumber && booking.chassisNumber.trim() !== '';
        if (hasChassisNumber) {
          const approvedEntries = booking.ledgerEntries.filter(entry => 
            entry.approvalStatus === 'Approved'
          );
          
          approvedEntries.forEach(entry => {
            if (entry.type === 'DEBIT' && entry.approvalStatus === 'Approved') {
              totalDebited += entry.debit || 0;
            }
          });
        }
      });
      
      // Calculate from transactions - include ONLY approved
      const approvedDebitTransactions = ledgerData.transactions.filter(
        transaction => transaction.isDebit === true && transaction.approvalStatus === 'Approved'
      );
      
      const approvedCreditTransactions = ledgerData.transactions.filter(
        transaction => transaction.isDebit === false && transaction.approvalStatus === 'Approved'
      );
      
      approvedDebitTransactions.forEach((transaction) => {
        const bookingNumber = transaction.booking?.bookingNumber || '-';
        const booking = ledgerData.bookingWiseSummary.find(b => b.bookingNumber === bookingNumber);
        const hasChassisNumber = booking?.chassisNumber && booking.chassisNumber.trim() !== '';
        
        if (hasChassisNumber) {
          totalDebited += transaction.netAmount || transaction.amount || 0;
        }
      });
      
      approvedCreditTransactions.forEach((transaction) => {
        totalReceived += transaction.netAmount || transaction.amount || 0;
      });
      
      totalBalance = totalReceived - totalDebited;
      
      const win = window.open('', '_blank');
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Customer Ledger - Booking Summary</title>
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
                <div><strong>Customer ID:</strong> ${ledgerData.customerDetails?.custId || ''}</div>
                <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.customerName || ''}</div>
                <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
                <div><strong>Aadhar No:</strong> ${ledgerData.customerDetails?.customerAadhaar || ''}</div>
                <div><strong>Pan No:</strong> ${ledgerData.customerDetails?.customerPan || ''}</div>
                <div><strong>Current Balance:</strong> ₹${totalBalance.toLocaleString('en-IN')}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th width="15%">Date</th>
                    <th width="25%">Description</th>
                    <th width="20%">Booking No</th>
                    <th width="10%" class="text-right">Credit (₹)</th>
                    <th width="10%" class="text-right">Debit (₹)</th>
                    <th width="20%" class="text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${approvedBookingSummaryRows}
                  ${accessoryBillingRows}
                  ${exchangeCreditRows}
                  ${transactionRows}
                  <tr>
                    <td colspan="2" class="text-left"><strong>Total</strong></td>
                    <td class="text-center"><strong>-</strong></td>
                    <td class="text-right"><strong>${totalReceived.toLocaleString('en-IN')}</strong></td>
                    <td class="text-right"><strong>${totalDebited.toLocaleString('en-IN')}</strong></td>
                    <td class="text-right"><strong>${totalBalance.toLocaleString('en-IN')}</strong></td>
                  </tr>
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
      setError('Failed to load ledger. Please try again.');
    }
  };

  if (!canViewCustomers) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Customers.
      </div>
    );
  }

  if (loading && pagination.docs.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Customer Ledger</div>
      {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}
          
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateCustomers && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                // You can add onClick for creating new customer here
                disabled={!canCreateCustomers}
              >
                New Customer
              </CButton>
            )}
          </div>
          <div className="text-muted">
            Total Records: {pagination.total || 0}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={!canViewCustomers}
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search by name, ID, mobile..."
              />
            </div>
          </div>
          
          {pagination.loading && pagination.docs.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Customer ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>Mobile1</CTableHeaderCell>
                  <CTableHeaderCell>Mobile2</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Aadhar Number</CTableHeaderCell>
                  <CTableHeaderCell>PAN Number</CTableHeaderCell>
                  {canViewLedger && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={canViewLedger ? "10" : "9"} className="text-center">
                      {pagination.search ? 'No matching customers found' : 'No customers available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((customer, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={customer._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{customer.custId || ''}</CTableDataCell>
                        <CTableDataCell>{customer.name || ''}</CTableDataCell>
                        <CTableDataCell>{customer.address || ''}</CTableDataCell>
                        <CTableDataCell>{customer.mobile1 || ''}</CTableDataCell>
                        <CTableDataCell>{customer.mobile2 || ''}</CTableDataCell>
                        <CTableDataCell>
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB') : ''}
                        </CTableDataCell>
                        <CTableDataCell>{customer.aadhaar || ''}</CTableDataCell>
                        <CTableDataCell>{customer.pan || ''}</CTableDataCell>
                        {canViewLedger && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className='option-button btn-sm'
                              onClick={() => handleViewLedger(customer)}
                              disabled={!canViewLedger}
                            >
                              View Ledger
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

          {/* Pagination Component */}
          {renderPagination()}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AllCustomers;