// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CButton, 
//   CCol, 
//   CFormLabel, 
//   CFormSelect, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CRow, 
//   CTabContent, 
//   CTabPane,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter, showError } from 'src/utils/tableImports';
// import tvsLogo from '../../../assets/images/logo.png';
// import config from 'src/config';
// import CIcon from '@coreui/icons-react';
// import { cilPrint} from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage
// } from '../../../utils/modulePermissions';

// function SubdealerLedger() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [subdealers, setSubdealers] = useState([]);
//   const [receipts, setReceipts] = useState([]);
//   const [selectedSubdealer, setSelectedSubdealer] = useState('');
//   const [selectedReceipt, setSelectedReceipt] = useState('');
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();
 

//   // Page-level permission checks for Subdealer Ledger page under Subdealer Account module
//   const hasSubdealerLedgerView = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER, 
//     ACTIONS.VIEW
//   );

//   // Using convenience function for cleaner code
//   const canViewSubdealerLedger = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER);

//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   useEffect(() => {
//     if (!canViewSubdealerLedger) {
//       showError('You do not have permission to view Subdealer Ledger');
//       return;
//     }
    
//     fetchData();
//     fetchSubdealers();
//   }, [canViewSubdealerLedger]);

//   useEffect(() => {
//     if (selectedSubdealer) {
//       fetchSubdealerReceipts();
//     } else {
//       setReceipts([]);
//       setSelectedReceipt('');
//     }
//   }, [selectedSubdealer]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers`);
//       setData(response.data.data.subdealers);
//       setFilteredData(response.data.data.subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data.subdealers || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchSubdealerReceipts = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
//       setReceipts(response.data.docs || []);
//       setError('');
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setReceipts([]);
//     }
//   };

//   const handleSubdealerChange = (e) => {
//     setSelectedSubdealer(e.target.value);
//     setSelectedReceipt('');
//   };

//   const handleReceiptChange = (e) => {
//     setSelectedReceipt(e.target.value);
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     handleFilter(searchValue, getDefaultSearchFields('subdealer'));
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     handleFilter('', getDefaultSearchFields('subdealer'));
//   };

//  const handleViewLedger = async (subdealer) => {
//   try {
//     const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
//     const ledgerData = res.data.docs;
//     const subdealerBookings = res.data.subdealerBookings || [];
//     const accessoryBillings = res.data.accessoryBillings || [];
//     const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;
//     const onAccountBalance = res.data.totalOnAccountBalance || 0;

//     let totalCredit = 0;
//     let totalDebit = 0;
//     let runningBalance = 0;

//     const allTransactions = [];

//     // Process bookings (debit transactions)
//     subdealerBookings.forEach((booking) => {
//       allTransactions.push({
//         type: 'booking',
//         data: booking,
//         date: new Date(booking.createdAt || booking.bookingDate || booking.receivedDate),
//         debit: booking.discountedAmount || 0
//       });
//     });

//     // Process accessory billings
//     accessoryBillings.forEach((accessory) => {
//       allTransactions.push({
//         type: 'accessory',
//         data: accessory,
//         date: new Date(accessory.createdAt),
//         debit: accessory.isDebit ? accessory.amount : 0,
//         credit: !accessory.isDebit ? accessory.amount : 0
//       });
//     });

//     // Process allocations from receipts (credit transactions)
//     ledgerData.forEach((receipt) => {
//       if (receipt.allocations && receipt.allocations.length > 0) {
//         receipt.allocations.forEach((allocation) => {
//           allTransactions.push({
//             type: 'allocation',
//             data: allocation,
//             parentReceipt: receipt,
//             date: new Date(allocation.createdAt || allocation.allocatedAt),
//             credit: allocation.amount || 0
//           });
//         });
//       }
      
//       if (receipt.subdealerBookings && receipt.subdealerBookings.length > 0) {
//         receipt.subdealerBookings.forEach((booking) => {
//           allTransactions.push({
//             type: 'receipt_booking',
//             data: booking,
//             parentReceipt: receipt,
//             date: new Date(receipt.createdAt || booking.createdAt || booking.bookingDate),
//             debit: booking.discountedAmount || booking.amount || 0
//           });
//         });
//       }
//     });

//     // Sort all transactions by date (oldest first)
//     allTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());

//     // Calculate running balances with INVERTED logic
//     const transactionsWithBalance = allTransactions.map(transaction => {
//       let description = '';
//       let referenceNo = '';
//       let date = '';
//       let formattedDate = '';
      
//       if (transaction.type === 'booking' || transaction.type === 'receipt_booking') {
//         const booking = transaction.data;
        
//         // INVERTED: Debit entries INCREASE balance (make it more positive)
//         runningBalance += transaction.debit; // Changed from -= to +
//         totalDebit += transaction.debit;
        
//         description = `Booking Created<br>Customer: ${booking.customerDetails?.salutation || ''} ${booking.customerDetails?.name || 'N/A'}<br>${booking.remark || ''}`;
//         referenceNo = booking.bookingNumber || '';
        
//         const dateToFormat = transaction.date || 
//                             new Date(booking.bookingDate) || 
//                             new Date(booking.createdAt) || 
//                             (transaction.parentReceipt ? new Date(transaction.parentReceipt.createdAt) : new Date());
//         date = dateToFormat;
//         formattedDate = dateToFormat.toLocaleDateString('en-GB');
          
//       } else if (transaction.type === 'allocation') {
//         const allocation = transaction.data;
//         const receipt = transaction.parentReceipt;
        
//         // INVERTED: Credit entries DECREASE balance (make it more negative)
//         runningBalance -= transaction.credit; // Changed from += to -
//         totalCredit += transaction.credit;
        
//         description = `Allocation to Booking<br>${allocation.remark ? `Remark: ${allocation.remark}` : 'Allocation'}`;
//         referenceNo = allocation.ledger?.transactionReference || receipt?.refNumber || '';
        
//         const dateToFormat = transaction.date || 
//                             new Date(allocation.createdAt) || 
//                             new Date(allocation.allocatedAt);
//         date = dateToFormat;
//         formattedDate = dateToFormat.toLocaleDateString('en-GB');
        
//       } else if (transaction.type === 'accessory') {
//         const accessory = transaction.data;
        
//         if (accessory.isDebit) {
//           // INVERTED: Debit entries INCREASE balance
//           runningBalance += transaction.debit; // Changed from -= to +
//           totalDebit += transaction.debit;
          
//           description = `Accessory Billing - Debit<br>${accessory.remark || 'Accessory Purchase'}`;
//         } else {
//           // INVERTED: Credit entries DECREASE balance
//           runningBalance -= transaction.credit; // Changed from += to -
//           totalCredit += transaction.credit;
          
//           description = `Accessory Billing - Credit<br>${accessory.remark || 'Accessory Payment'}`;
//         }
        
//         referenceNo = accessory.transactionReference || '';
//         const dateToFormat = transaction.date || new Date(accessory.createdAt);
//         date = dateToFormat;
//         formattedDate = dateToFormat.toLocaleDateString('en-GB');
//       }
      
//       return {
//         date: formattedDate,
//         rawDate: date,
//         description,
//         referenceNo,
//         credit: transaction.credit || 0,
//         debit: transaction.debit || 0,
//         balance: runningBalance
//       };
//     });

//     // Sort transactions by raw date (just in case)
//     transactionsWithBalance.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

//     const win = window.open('', '_blank');
//     win.document.write(`
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Subdealer Ledger</title>
//     <style>
//       @page {
//         size: A4;
//         margin: 15mm 10mm;
//       }
//       body {
//         font-family: Arial;
//         width: 100%;
//         margin: 0;
//         padding: 0;
//         font-size: 14px;
//         line-height: 1.3;
//         font-family: Courier New;
//       }
//       .container {
//         width: 190mm;
//         margin: 0 auto;
//         padding: 5mm;
//       }
//       .header-container {
//         display: flex;
//         justify-content:space-between;
//         margin-bottom: 3mm;
//       }
//       .header-text{
//         font-size:20px;
//         font-weight:bold;
//       }
//       .logo {
//         width: 30mm;
//         height: auto;
//         margin-right: 5mm;
//       } 
//       .header {
//         text-align: left;
//       }
//       .divider {
//         border-top: 2px solid #AAAAAA;
//         margin: 3mm 0;
//       }
//       .header h2 {
//         margin: 2mm 0;
//         font-size: 12pt;
//         font-weight: bold;
//       }
//       .header div {
//         font-size: 14px;
//       }
//       .customer-info {
//         display: grid;
//         grid-template-columns: repeat(2, 1fr);
//         gap: 2mm;
//         margin-bottom: 5mm;
//         font-size: 14px;
//       }
//       .customer-info div {
//         display: flex;
//       }
//       .customer-info strong {
//         min-width: 30mm;
//         display: inline-block;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 5mm;
//         font-size: 14px;
//         page-break-inside: avoid;
//       }
//       th, td {
//         border: 1px solid #000;
//         padding: 2mm;
//         text-align: left;
//       }
//       th {
//         background-color: #f0f0f0;
//         font-weight: bold;
//       }
//       .footer {
//         margin-top: 10mm;
//         display: flex;
//         justify-content: space-between;
//         align-items: flex-end;
//         font-size: 14px;
//       }
//       .footer-left {
//         text-align: left;
//       }
//       .footer-right {
//         text-align: right;
//       }
//       .qr-code {
//         width: 35mm;
//         height: 35mm;
//       }
//       .text-right {
//         text-align: right;
//       }
//       .text-left {
//         text-align: left;
//       }
//       .text-center {
//         text-align: center;
//       }
//       .bold-row {
//         font-weight: bold;
//       }
//       @media print {
//         body {
//           width: 190mm;
//           height: 277mm;
//         }
//         .no-print {
//           display: none;
//         }
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <div class="header-container">
//         <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//         <div class="header-text"> GANDHI TVS</div>
//       </div>
//       <div class="header">
//         <div>
//           Authorised Main Dealer: TVS Motor Company Ltd.<br>
//           Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//           Upnagar, Nashik Road, Nashik - 422101<br>
//           Phone: 7498903672
//         </div>
//       </div>
//       <div class="divider"></div>
//       <div class="customer-info">
//         <div><strong>Subdealer Name:</strong> ${ledgerData[0]?.subdealer?.name || subdealer.name || ''}</div>
//         <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
//       </div>
      
//       <table>
//         <thead>
//           <tr>
//             <th width="15%">Date</th>
//             <th width="35%">Description</th>
//             <th width="15%">Reference No</th>
//             <th width="10%" class="text-right">Credit (₹)</th>
//             <th width="10%" class="text-right">Debit (₹)</th>
//             <th width="15%" class="text-right">Balance (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${transactionsWithBalance
//             .map(transaction => `
//               <tr>
//                 <td>${transaction.date}</td>
//                 <td>${transaction.description}</td>
//                 <td>${transaction.referenceNo}</td>
//                 <td class="text-right">${transaction.credit > 0 ? transaction.credit.toLocaleString('en-IN') : '0'}</td>
//                 <td class="text-right">${transaction.debit > 0 ? transaction.debit.toLocaleString('en-IN') : '0'}</td>
//                 <td class="text-right">${transaction.balance.toLocaleString('en-IN')}</td>
//               </tr>
//             `)
//             .join('')}
          
//           <!-- On Account Balance Row -->
//           <tr class="bold-row">
//             <td colspan="5" class="text-left">On Account Balance</td>
//             <td class="text-right">${onAccountBalance.toLocaleString('en-IN')}</td>
//           </tr>
          
//           <!-- Total Row -->
//           <tr class="bold-row">
//             <td colspan="3" class="text-left">Total</td>
//             <td class="text-right">${totalCredit.toLocaleString('en-IN')}</td>
//             <td class="text-right">${totalDebit.toLocaleString('en-IN')}</td>
//             <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
//           </tr>
//         </tbody>
//       </table>
      
//       <div class="footer">
//         <div class="footer-left">
//           <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
//                class="qr-code" 
//                alt="QR Code" />
//         </div>
//         <div class="footer-right">
//           <p>For, Gandhi TVS</p>
//           <p>Authorised Signatory</p>
//         </div>
//       </div>
//     </div>
    
//     <script>
//       window.onload = function() {
//         setTimeout(() => {
//           window.print();
//         }, 300);
//       };
//     </script>
//   </body>
// </html>
// `);
//   } catch (err) {
//     console.error('Error fetching ledger:', err);
//     showError('Failed to load ledger. Please try again.');
//   }
// };

//   if (!canViewSubdealerLedger) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer Ledger.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer Ledger</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <CNav variant="tabs" className="mb-0 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 0}
//                 onClick={() => handleTabChange(0)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                   color: 'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 Sub Dealer
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 1}
//                 onClick={() => handleTabChange(1)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Sub Dealer UTR
//               </CNavLink>
//             </CNavItem>
//           </CNav>
//         </CCardHeader>
        
//         <CCardBody>
//           <CTabContent>
//             <CTabPane visible={activeTab === 0} className="p-0">
//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => handleSearch(e.target.value)}
                   
//                   />
//                   {searchTerm && (
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       className="action-btn ms-2"
//                       onClick={handleResetSearch}
//                     >
//                       Reset
//                     </CButton>
//                   )}
//                 </div>
//               </div>
              
//               <div className="responsive-table-wrapper">
//                 <CTable striped bordered hover className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Location</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Rate Of Interest</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredData.length === 0 ? (
//                       <CTableRow>
//                         <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                           No subdealers available
//                         </CTableDataCell>
//                       </CTableRow>
//                     ) : (
//                       filteredData.map((subdealer, index) => (
//                         <CTableRow key={index}>
//                           <CTableDataCell>{index + 1}</CTableDataCell>
//                           <CTableDataCell>{subdealer.name}</CTableDataCell>
//                           <CTableDataCell>{subdealer.location}</CTableDataCell>
//                           <CTableDataCell>{subdealer.rateOfInterest}</CTableDataCell>
//                           <CTableDataCell>{subdealer.discount}</CTableDataCell>
//                           <CTableDataCell>{subdealer.type}</CTableDataCell>
//                           <CTableDataCell>
//                             <CButton 
//                               size="sm" 
//                               className="action-btn"
//                               onClick={() => handleViewLedger(subdealer)}
//                             >
//                               <CIcon icon={cilPrint} className='icon'/> View Ledger
//                             </CButton>
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </CTabPane>
            
//             <CTabPane visible={activeTab === 1} className="p-0">
//               {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

//               <CRow className="mb-4">
//                 <CCol md={5}>
//                   <CFormLabel htmlFor="subdealerSelect" className="fw-bold">Select Subdealer</CFormLabel>
//                   <CFormSelect 
//                     id="subdealerSelect" 
//                     value={selectedSubdealer} 
//                     onChange={handleSubdealerChange}
//                     className="square-select"
//                   >
//                     <option value="">-- Select Subdealer --</option>
//                     {subdealers.map((subdealer) => (
//                       <option key={subdealer._id || subdealer.id} value={subdealer._id || subdealer.id}>
//                         {subdealer.name} - {subdealer.location}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>

//                 <CCol md={5}>
//                   <CFormLabel htmlFor="receiptSelect" className="fw-bold">Select UTR/Receipt</CFormLabel>
//                   <CFormSelect
//                     id="receiptSelect"
//                     value={selectedReceipt}
//                     onChange={handleReceiptChange}
//                     disabled={!selectedSubdealer || receipts.length === 0}
//                     className="square-select"
//                   >
//                     <option value="">-- Select UTR/Receipt --</option>
//                     {receipts.map((receipt) => {
//                       const remainingAmount = receipt.amount - (receipt.allocatedTotal || 0);
//                       return (
//                         <option key={receipt._id || receipt.id} value={receipt._id || receipt.id} disabled={remainingAmount <= 0}>
//                           {receipt.refNumber || 'No reference'} - ₹{remainingAmount.toLocaleString()} remaining
//                         </option>
//                       );
//                     })}
//                   </CFormSelect>
//                   <small className="text-muted">
//                     {receipts.length === 0 && selectedSubdealer ? 'No receipts available' : 'Select a UTR to allocate payments'}
//                   </small>
//                 </CCol>
//                 <CCol md={2} className="d-flex align-items-end">
//                   <CButton className="action-btn w-100">
//                     View
//                   </CButton>
//                 </CCol>
//               </CRow>
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default SubdealerLedger;




// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CButton, 
//   CCol, 
//   CFormLabel, 
//   CFormSelect, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CRow, 
//   CTabContent, 
//   CTabPane,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter, showError } from 'src/utils/tableImports';
// import tvsLogo from '../../../assets/images/logo.png';
// import config from 'src/config';
// import CIcon from '@coreui/icons-react';
// import { cilPrint} from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS, // Import TABS constant
//   ACTIONS,
//   canViewPage
// } from '../../../utils/modulePermissions';

// function SubdealerLedger() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [subdealers, setSubdealers] = useState([]);
//   const [receipts, setReceipts] = useState([]);
//   const [selectedSubdealer, setSelectedSubdealer] = useState('');
//   const [selectedReceipt, setSelectedReceipt] = useState('');
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions } = useAuth();

//   // Page-level permission checks for Subdealer Ledger page under Subdealer Account module
//   const canViewSubdealerLedger = canViewPage(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER
//   );

//   // Tab-level VIEW permission checks
//   const canViewSubDealerTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_ACCOUNT,
//     PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_LEDGER.SUB_DEALER // Assuming this constant exists in TABS
//   );
  
//   const canViewSubDealerUTRTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_ACCOUNT,
//     PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_LEDGER.SUB_DEALER_UTR // Assuming this constant exists in TABS
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     if (!canViewSubDealerTab && activeTab === 0 && canViewSubDealerUTRTab) {
//       // If Sub Dealer tab is hidden and activeTab is 0, switch to Sub Dealer UTR tab
//       setActiveTab(1);
//     }
//   }, [canViewSubDealerTab, canViewSubDealerUTRTab, activeTab]);

//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   useEffect(() => {
//     if (!canViewSubdealerLedger) {
//       showError('You do not have permission to view Subdealer Ledger');
//       return;
//     }
    
//     fetchData();
//     fetchSubdealers();
//   }, [canViewSubdealerLedger]);

//   useEffect(() => {
//     if (selectedSubdealer) {
//       fetchSubdealerReceipts();
//     } else {
//       setReceipts([]);
//       setSelectedReceipt('');
//     }
//   }, [selectedSubdealer]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers`);
//       setData(response.data.data.subdealers);
//       setFilteredData(response.data.data.subdealers);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data.subdealers || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchSubdealerReceipts = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
//       setReceipts(response.data.docs || []);
//       setError('');
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setReceipts([]);
//     }
//   };

//   const handleSubdealerChange = (e) => {
//     setSelectedSubdealer(e.target.value);
//     setSelectedReceipt('');
//   };

//   const handleReceiptChange = (e) => {
//     setSelectedReceipt(e.target.value);
//   };

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     handleFilter(searchValue, getDefaultSearchFields('subdealer'));
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     handleFilter('', getDefaultSearchFields('subdealer'));
//   };

//  const handleViewLedger = async (subdealer) => {
//   try {
//     const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
//     const ledgerData = res.data.docs;
//     const subdealerBookings = res.data.subdealerBookings || [];
//     const accessoryBillings = res.data.accessoryBillings || [];
//     const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;
//     const onAccountBalance = res.data.totalOnAccountBalance || 0;

//     let totalCredit = 0;
//     let totalDebit = 0;
//     let runningBalance = 0;

//     const allTransactions = [];

//     // Process bookings (debit transactions)
//     subdealerBookings.forEach((booking) => {
//       allTransactions.push({
//         type: 'booking',
//         data: booking,
//         date: new Date(booking.createdAt || booking.bookingDate || booking.receivedDate),
//         debit: booking.discountedAmount || 0
//       });
//     });

//     // Process accessory billings - ONLY include if isDebit is true
//     accessoryBillings.forEach((accessory) => {
//       // Only include debit entries (isDebit: true)
//       if (accessory.isDebit) {
//         allTransactions.push({
//           type: 'accessory',
//           data: accessory,
//           date: new Date(accessory.createdAt),
//           debit: accessory.amount || 0
//         });
//       }
//       // Skip entries where isDebit is false
//     });

//     // Process allocations from receipts (credit transactions)
//     ledgerData.forEach((receipt) => {
//       if (receipt.allocations && receipt.allocations.length > 0) {
//         receipt.allocations.forEach((allocation) => {
//           allTransactions.push({
//             type: 'allocation',
//             data: allocation,
//             parentReceipt: receipt,
//             date: new Date(allocation.createdAt || allocation.allocatedAt),
//             credit: allocation.amount || 0
//           });
//         });
//       }
      
//       if (receipt.subdealerBookings && receipt.subdealerBookings.length > 0) {
//         receipt.subdealerBookings.forEach((booking) => {
//           allTransactions.push({
//             type: 'receipt_booking',
//             data: booking,
//             parentReceipt: receipt,
//             date: new Date(receipt.createdAt || booking.createdAt || booking.bookingDate),
//             debit: booking.discountedAmount || booking.amount || 0
//           });
//         });
//       }
//     });

//     // Sort all transactions by date (oldest first)
//     allTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());

//     // Calculate running balances with INVERTED logic
//     const transactionsWithBalance = allTransactions.map(transaction => {
//       let description = '';
//       let referenceNo = '';
//       let date = '';
//       let formattedDate = '';
      
//       if (transaction.type === 'booking' || transaction.type === 'receipt_booking') {
//         const booking = transaction.data;
        
//         // INVERTED: Debit entries INCREASE balance (make it more positive)
//         runningBalance += transaction.debit; // Changed from -= to +
//         totalDebit += transaction.debit;
        
//         description = `Booking Created<br>Customer: ${booking.customerDetails?.salutation || ''} ${booking.customerDetails?.name || 'N/A'}<br>${booking.remark || ''}`;
//         referenceNo = booking.bookingNumber || '';
        
//         const dateToFormat = transaction.date || 
//                             new Date(booking.bookingDate) || 
//                             new Date(booking.createdAt) || 
//                             (transaction.parentReceipt ? new Date(transaction.parentReceipt.createdAt) : new Date());
//         date = dateToFormat;
//         formattedDate = dateToFormat.toLocaleDateString('en-GB');
          
//       } else if (transaction.type === 'allocation') {
//         const allocation = transaction.data;
//         const receipt = transaction.parentReceipt;
        
//         // INVERTED: Credit entries DECREASE balance (make it more negative)
//         runningBalance -= transaction.credit; // Changed from += to -
//         totalCredit += transaction.credit;
        
//         description = `Allocation to Booking<br>${allocation.remark ? `Remark: ${allocation.remark}` : 'Allocation'}`;
//         referenceNo = allocation.ledger?.transactionReference || receipt?.refNumber || '';
        
//         const dateToFormat = transaction.date || 
//                             new Date(allocation.createdAt) || 
//                             new Date(allocation.allocatedAt);
//         date = dateToFormat;
//         formattedDate = dateToFormat.toLocaleDateString('en-GB');
        
//       } else if (transaction.type === 'accessory') {
//         const accessory = transaction.data;
        
//         // Since we only include isDebit: true entries, this will always be a debit
//         // INVERTED: Debit entries INCREASE balance
//         runningBalance += transaction.debit; // Changed from -= to +
//         totalDebit += transaction.debit;
        
//         description = `Accessory Billing<br>${accessory.remark || 'Accessory Purchase'}`;
//         referenceNo = accessory.transactionReference || '';
//         const dateToFormat = transaction.date || new Date(accessory.createdAt);
//         date = dateToFormat;
//         formattedDate = dateToFormat.toLocaleDateString('en-GB');
//       }
      
//       return {
//         date: formattedDate,
//         rawDate: date,
//         description,
//         referenceNo,
//         credit: transaction.credit || 0,
//         debit: transaction.debit || 0,
//         balance: runningBalance
//       };
//     });

//     // Sort transactions by raw date (just in case)
//     transactionsWithBalance.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

//     const win = window.open('', '_blank');
//     win.document.write(`
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Subdealer Ledger</title>
//     <style>
//       @page {
//         size: A4;
//         margin: 15mm 10mm;
//       }
//       body {
//         font-family: Arial;
//         width: 100%;
//         margin: 0;
//         padding: 0;
//         font-size: 14px;
//         line-height: 1.3;
//         font-family: Courier New;
//       }
//       .container {
//         width: 190mm;
//         margin: 0 auto;
//         padding: 5mm;
//       }
//       .header-container {
//         display: flex;
//         justify-content:space-between;
//         margin-bottom: 3mm;
//       }
//       .header-text{
//         font-size:20px;
//         font-weight:bold;
//       }
//       .logo {
//         width: 30mm;
//         height: auto;
//         margin-right: 5mm;
//       } 
//       .header {
//         text-align: left;
//       }
//       .divider {
//         border-top: 2px solid #AAAAAA;
//         margin: 3mm 0;
//       }
//       .header h2 {
//         margin: 2mm 0;
//         font-size: 12pt;
//         font-weight: bold;
//       }
//       .header div {
//         font-size: 14px;
//       }
//       .customer-info {
//         display: grid;
//         grid-template-columns: repeat(2, 1fr);
//         gap: 2mm;
//         margin-bottom: 5mm;
//         font-size: 14px;
//       }
//       .customer-info div {
//         display: flex;
//       }
//       .customer-info strong {
//         min-width: 30mm;
//         display: inline-block;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 5mm;
//         font-size: 14px;
//         page-break-inside: avoid;
//       }
//       th, td {
//         border: 1px solid #000;
//         padding: 2mm;
//         text-align: left;
//       }
//       th {
//         background-color: #f0f0f0;
//         font-weight: bold;
//       }
//       .footer {
//         margin-top: 10mm;
//         display: flex;
//         justify-content: space-between;
//         align-items: flex-end;
//         font-size: 14px;
//       }
//       .footer-left {
//         text-align: left;
//       }
//       .footer-right {
//         text-align: right;
//       }
//       .qr-code {
//         width: 35mm;
//         height: 35mm;
//       }
//       .text-right {
//         text-align: right;
//       }
//       .text-left {
//         text-align: left;
//       }
//       .text-center {
//         text-align: center;
//       }
//       .bold-row {
//         font-weight: bold;
//       }
//       @media print {
//         body {
//           width: 190mm;
//           height: 277mm;
//         }
//         .no-print {
//           display: none;
//         }
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <div class="header-container">
//         <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//         <div class="header-text"> GANDHI TVS</div>
//       </div>
//       <div class="header">
//         <div>
//           Authorised Main Dealer: TVS Motor Company Ltd.<br>
//           Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//           Upnagar, Nashik Road, Nashik - 422101<br>
//           Phone: 7498903672
//         </div>
//       </div>
//       <div class="divider"></div>
//       <div class="customer-info">
//         <div><strong>Subdealer Name:</strong> ${ledgerData[0]?.subdealer?.name || subdealer.name || ''}</div>
//         <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
//       </div>
      
//       <table>
//         <thead>
//           <tr>
//             <th width="15%">Date</th>
//             <th width="35%">Description</th>
//             <th width="15%">Reference No</th>
//             <th width="10%" class="text-right">Credit (₹)</th>
//             <th width="10%" class="text-right">Debit (₹)</th>
//             <th width="15%" class="text-right">Balance (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${transactionsWithBalance
//             .map(transaction => `
//               <tr>
//                 <td>${transaction.date}</td>
//                 <td>${transaction.description}</td>
//                 <td>${transaction.referenceNo}</td>
//                 <td class="text-right">${transaction.credit > 0 ? transaction.credit.toLocaleString('en-IN') : '0'}</td>
//                 <td class="text-right">${transaction.debit > 0 ? transaction.debit.toLocaleString('en-IN') : '0'}</td>
//                 <td class="text-right">${transaction.balance.toLocaleString('en-IN')}</td>
//               </tr>
//             `)
//             .join('')}
          
//           <!-- On Account Balance Row -->
//           <tr class="bold-row">
//             <td colspan="5" class="text-left">On Account Balance</td>
//             <td class="text-right">${onAccountBalance.toLocaleString('en-IN')}</td>
//           </tr>
          
//           <!-- Total Row -->
//           <tr class="bold-row">
//             <td colspan="3" class="text-left">Total</td>
//             <td class="text-right">${totalCredit.toLocaleString('en-IN')}</td>
//             <td class="text-right">${totalDebit.toLocaleString('en-IN')}</td>
//             <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
//           </tr>
//         </tbody>
//       </table>
      
//       <div class="footer">
//         <div class="footer-left">
//           <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
//                class="qr-code" 
//                alt="QR Code" />
//         </div>
//         <div class="footer-right">
//           <p>For, Gandhi TVS</p>
//           <p>Authorised Signatory</p>
//         </div>
//       </div>
//     </div>
    
//     <script>
//       window.onload = function() {
//         setTimeout(() => {
//           window.print();
//         }, 300);
//       };
//     </script>
//   </body>
// </html>
// `);
//   } catch (err) {
//     console.error('Error fetching ledger:', err);
//     showError('Failed to load ledger. Please try again.');
//   }
// };

//   if (!canViewSubdealerLedger) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer Ledger.
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer Ledger</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <CNav variant="tabs" className="mb-0 border-bottom">
//             {/* Only show Sub Dealer tab if user has VIEW permission for it */}
//             {canViewSubDealerTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 0}
//                   onClick={() => handleTabChange(0)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                     color: 'black',
//                     borderBottom: 'none'
//                   }}
//                 >
//                   Sub Dealer
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Sub Dealer UTR tab if user has VIEW permission for it */}
//             {canViewSubDealerUTRTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 1}
//                   onClick={() => handleTabChange(1)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Sub Dealer UTR
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>
//         </CCardHeader>
        
//         <CCardBody>
//           <CTabContent>
//             {canViewSubDealerTab && (
//               <CTabPane visible={activeTab === 0} className="p-0">
//                 <div className="d-flex justify-content-between mb-3">
//                   <div></div>
//                   <div className='d-flex'>
//                     <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                     <CFormInput
//                       type="text"
//                       style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                       className="d-inline-block square-search"
//                       value={searchTerm}
//                       onChange={(e) => handleSearch(e.target.value)}
                     
//                     />
//                     {searchTerm && (
//                       <CButton 
//                         size="sm" 
//                         color="secondary" 
//                         className="action-btn ms-2"
//                         onClick={handleResetSearch}
//                       >
//                         Reset
//                       </CButton>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="responsive-table-wrapper">
//                   <CTable striped bordered hover className='responsive-table'>
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                         <CTableHeaderCell scope="col">Name</CTableHeaderCell>
//                         <CTableHeaderCell scope="col">Location</CTableHeaderCell>
//                         <CTableHeaderCell scope="col">Rate Of Interest</CTableHeaderCell>
//                         <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
//                         <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//                         <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {filteredData.length === 0 ? (
//                         <CTableRow>
//                           <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                             No subdealers available
//                           </CTableDataCell>
//                         </CTableRow>
//                       ) : (
//                         filteredData.map((subdealer, index) => (
//                           <CTableRow key={index}>
//                             <CTableDataCell>{index + 1}</CTableDataCell>
//                             <CTableDataCell>{subdealer.name}</CTableDataCell>
//                             <CTableDataCell>{subdealer.location}</CTableDataCell>
//                             <CTableDataCell>{subdealer.rateOfInterest}</CTableDataCell>
//                             <CTableDataCell>{subdealer.discount}</CTableDataCell>
//                             <CTableDataCell>{subdealer.type}</CTableDataCell>
//                             <CTableDataCell>
//                               <CButton 
//                                 size="sm" 
//                                 className="action-btn"
//                                 onClick={() => handleViewLedger(subdealer)}
//                               >
//                                 <CIcon icon={cilPrint} className='icon'/> View Ledger
//                               </CButton>
//                             </CTableDataCell>
//                           </CTableRow>
//                         ))
//                       )}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               </CTabPane>
//             )}
            
//             {canViewSubDealerUTRTab && (
//               <CTabPane visible={activeTab === 1} className="p-0">
//                 {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

//                 <CRow className="mb-4">
//                   <CCol md={5}>
//                     <CFormLabel htmlFor="subdealerSelect" className="fw-bold">Select Subdealer</CFormLabel>
//                     <CFormSelect 
//                       id="subdealerSelect" 
//                       value={selectedSubdealer} 
//                       onChange={handleSubdealerChange}
//                       className="square-select"
//                     >
//                       <option value="">-- Select Subdealer --</option>
//                       {subdealers.map((subdealer) => (
//                         <option key={subdealer._id || subdealer.id} value={subdealer._id || subdealer.id}>
//                           {subdealer.name} - {subdealer.location}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CCol>

//                   <CCol md={5}>
//                     <CFormLabel htmlFor="receiptSelect" className="fw-bold">Select UTR/Receipt</CFormLabel>
//                     <CFormSelect
//                       id="receiptSelect"
//                       value={selectedReceipt}
//                       onChange={handleReceiptChange}
//                       disabled={!selectedSubdealer || receipts.length === 0}
//                       className="square-select"
//                     >
//                       <option value="">-- Select UTR/Receipt --</option>
//                       {receipts.map((receipt) => {
//                         const remainingAmount = receipt.amount - (receipt.allocatedTotal || 0);
//                         return (
//                           <option key={receipt._id || receipt.id} value={receipt._id || receipt.id} disabled={remainingAmount <= 0}>
//                             {receipt.refNumber || 'No reference'} - ₹{remainingAmount.toLocaleString()} remaining
//                           </option>
//                         );
//                       })}
//                     </CFormSelect>
//                     <small className="text-muted">
//                       {receipts.length === 0 && selectedSubdealer ? 'No receipts available' : 'Select a UTR to allocate payments'}
//                     </small>
//                   </CCol>
//                   <CCol md={2} className="d-flex align-items-end">
//                     <CButton className="action-btn w-100">
//                       View
//                     </CButton>
//                   </CCol>
//                 </CRow>
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default SubdealerLedger;











import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import '../../../css/table.css';
import '../../../css/form.css';
import { 
  CButton, 
  CCol, 
  CFormLabel, 
  CFormSelect, 
  CNav, 
  CNavItem, 
  CNavLink, 
  CRow, 
  CTabContent, 
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter, showError } from 'src/utils/tableImports';
import tvsLogo from '../../../assets/images/logo.png';
import config from 'src/config';
import CIcon from '@coreui/icons-react';
import { cilPrint} from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS, // Import TABS constant
  ACTIONS,
  canViewPage
} from '../../../utils/modulePermissions';

function SubdealerLedger() {
  const [activeTab, setActiveTab] = useState(0);
  const [subdealers, setSubdealers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user: authUser } = useAuth();
  const permissions = authUser?.permissions || [];
  
  // Check if user is a subdealer
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  const userSubdealer = authUser?.subdealer;

  // Page-level permission checks for Subdealer Ledger page under Subdealer Account module
  const canViewSubdealerLedger = canViewPage(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER
  );

  // Tab-level VIEW permission checks
  const canViewSubDealerTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_ACCOUNT,
    PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,
    ACTIONS.VIEW,
    TABS.SUBDEALER_LEDGER.SUB_DEALER // Assuming this constant exists in TABS
  );
  
  const canViewSubDealerUTRTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_ACCOUNT,
    PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,
    ACTIONS.VIEW,
    TABS.SUBDEALER_LEDGER.SUB_DEALER_UTR // Assuming this constant exists in TABS
  );

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewSubDealerTab && activeTab === 0 && canViewSubDealerUTRTab) {
      // If Sub Dealer tab is hidden and activeTab is 0, switch to Sub Dealer UTR tab
      setActiveTab(1);
    }
  }, [canViewSubDealerTab, canViewSubDealerUTRTab, activeTab]);

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  useEffect(() => {
    if (!canViewSubdealerLedger) {
      showError('You do not have permission to view Subdealer Ledger');
      return;
    }
    
    fetchData();
    fetchSubdealers();
  }, [canViewSubdealerLedger]);

  useEffect(() => {
    // For subdealers, auto-select their own subdealer when component loads
    if (isSubdealer && userSubdealer && !selectedSubdealer) {
      setSelectedSubdealer(userSubdealer._id);
    }
  }, [isSubdealer, userSubdealer, selectedSubdealer]);

  useEffect(() => {
    if (selectedSubdealer) {
      fetchSubdealerReceipts();
    } else {
      setReceipts([]);
      setSelectedReceipt('');
    }
  }, [selectedSubdealer]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers`);
      let allSubdealers = response.data.data.subdealers || [];
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealer) {
        allSubdealers = allSubdealers.filter(subdealer => 
          subdealer._id === userSubdealer._id || subdealer.id === userSubdealer._id
        );
      }
      
      setData(allSubdealers);
      setFilteredData(allSubdealers);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      const allSubdealers = response.data.data.subdealers || [];
      setSubdealers(allSubdealers);
      
      // For subdealers, auto-select their own subdealer
      if (isSubdealer && userSubdealer) {
        const subdealerExists = allSubdealers.some(s => s._id === userSubdealer._id || s.id === userSubdealer._id);
        if (subdealerExists) {
          setSelectedSubdealer(userSubdealer._id);
        }
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchSubdealerReceipts = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/${selectedSubdealer}/on-account/receipts`);
      setReceipts(response.data.docs || []);
      setError('');
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setReceipts([]);
    }
  };

  const handleSubdealerChange = (e) => {
    // If user is a subdealer, prevent changing the subdealer field
    if (isSubdealer) {
      return;
    }
    
    setSelectedSubdealer(e.target.value);
    setSelectedReceipt('');
  };

  const handleReceiptChange = (e) => {
    setSelectedReceipt(e.target.value);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    handleFilter(searchValue, getDefaultSearchFields('subdealer'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    handleFilter('', getDefaultSearchFields('subdealer'));
  };

const handleViewLedger = async (subdealer) => {
  try {
    const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
    
    // Check if we have the new structure or old structure
    let ledgerEntries = [];
    let subdealerBookings = [];
    let accessoryBillings = [];
    let onAccountBalance = 0;
    
    if (res.data && res.data.data) {
      // New structure
      const responseData = res.data.data;
      ledgerEntries = responseData.entries || [];
      onAccountBalance = responseData.totals?.onAccountBalance || 0;
      
      // Extract subdealer bookings from entries that are debit types
      subdealerBookings = ledgerEntries
        .filter(entry => entry.type === 'DEBIT' || entry.debit > 0)
        .map(entry => ({
          ...entry,
          // Map to expected booking structure
          customerDetails: {
            salutation: '',
            name: entry.subdealerName || subdealer.name || ''
          },
          bookingNumber: entry.receiptNo,
          discountedAmount: entry.debit,
          amount: entry.debit,
          remark: entry.remark || entry.description,
          createdAt: entry.timestamp,
          bookingDate: entry.date
        }));
    } else if (res.data && res.data.docs) {
      // Old structure
      ledgerEntries = res.data.docs || [];
      subdealerBookings = res.data.subdealerBookings || [];
      accessoryBillings = res.data.accessoryBillings || [];
      onAccountBalance = res.data.totalOnAccountBalance || 0;
    }
    
    const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;

    let totalCredit = 0;
    let totalDebit = 0;
    let runningBalance = 0;

    const allTransactions = [];

    // Process subdealer bookings (debit transactions)
    subdealerBookings.forEach((booking) => {
      allTransactions.push({
        type: 'booking',
        data: booking,
        date: new Date(booking.createdAt || booking.bookingDate || booking.receivedDate),
        debit: booking.discountedAmount || 0
      });
    });

    // Process accessory billings - ONLY include if isDebit is true
    accessoryBillings.forEach((accessory) => {
      // Only include debit entries (isDebit: true)
      if (accessory.isDebit) {
        allTransactions.push({
          type: 'accessory',
          data: accessory,
          date: new Date(accessory.createdAt),
          debit: accessory.amount || 0
        });
      }
      // Skip entries where isDebit is false
    });

    // Process ALLOCATION entries from ledger entries (on-account payments)
    ledgerEntries.forEach((entry) => {
      // Only process ALLOCATION entries
      if (entry.source === 'ALLOCATION') {
        allTransactions.push({
          type: 'allocation',
          data: entry,
          date: new Date(entry.timestamp || entry.createdAt),
          credit: entry.credit || 0,
          debit: entry.debit || 0
        });
      }
    });

    // Sort all transactions by date (oldest first)
    allTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate running balances with INVERTED logic (only for bookings and accessories)
    const transactionsWithBalance = allTransactions.map(transaction => {
      let description = '';
      let referenceNo = '';
      let date = '';
      let formattedDate = '';
      let credit = 0;
      let debit = 0;
      
      if (transaction.type === 'booking') {
        const booking = transaction.data;
        
        // INVERTED: Debit entries INCREASE balance (make it more positive)
        debit = transaction.debit || 0;
        runningBalance += debit;
        totalDebit += debit;
        
        description = `Booking Created<br>Customer: ${booking.customerDetails?.salutation || ''} ${booking.customerDetails?.name || 'N/A'}<br>${booking.remark || ''}`;
        referenceNo = booking.bookingNumber || '';
        
        const dateToFormat = transaction.date || 
                            new Date(booking.bookingDate) || 
                            new Date(booking.createdAt) || 
                            (transaction.parentReceipt ? new Date(transaction.parentReceipt.createdAt) : new Date());
        date = dateToFormat;
        formattedDate = dateToFormat.toLocaleDateString('en-GB');
          
      } else if (transaction.type === 'accessory') {
        const accessory = transaction.data;
        
        // Since we only include isDebit: true entries, this will always be a debit
        // INVERTED: Debit entries INCREASE balance
        debit = transaction.debit || 0;
        runningBalance += debit;
        totalDebit += debit;
        
        description = `Accessory Billing<br>${accessory.remark || 'Accessory Purchase'}`;
        referenceNo = accessory.transactionReference || '';
        const dateToFormat = transaction.date || new Date(accessory.createdAt);
        date = dateToFormat;
        formattedDate = dateToFormat.toLocaleDateString('en-GB');
      } else if (transaction.type === 'allocation') {
        const allocation = transaction.data;
        
        // ALLOCATION entries can be credit or debit
        credit = allocation.credit || 0;
        debit = allocation.debit || 0;
        
        // Credit entries (payments) DECREASE balance
        // Debit entries (charges) INCREASE balance
        if (credit > 0) {
          runningBalance -= credit;
          totalCredit += credit;
        }
        if (debit > 0) {
          runningBalance += debit;
          totalDebit += debit;
        }
        
        description = allocation.description || 'Payment Allocation';
        if (allocation.remark) {
          description += `<br>${allocation.remark}`;
        }
        referenceNo = allocation.receiptNo || '';
        const dateToFormat = transaction.date || new Date(allocation.timestamp);
        date = dateToFormat;
        formattedDate = dateToFormat.toLocaleDateString('en-GB');
      }
      
      return {
        date: formattedDate,
        rawDate: date,
        description,
        referenceNo,
        credit: credit || 0,
        debit: debit || 0,
        balance: runningBalance
      };
    });

    // Sort transactions by raw date (just in case)
    transactionsWithBalance.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

    // Calculate the final balance including remaining on-account balance
    const finalBalance = runningBalance - onAccountBalance;

    const win = window.open('', '_blank');
    win.document.write(`
<!DOCTYPE html>
<html>
  <head>
    <title>Subdealer Ledger</title>
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
      .bold-row {
        font-weight: bold;
        background-color: #f8f9fa;
      }
      .total-row {
        font-weight: bold;
        background-color: #e9ecef;
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
        <div><strong>Subdealer Name:</strong> ${subdealer.name || ''}</div>
        <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="35%">Description</th>
            <th width="15%">Reference No</th>
            <th width="10%" class="text-right">Credit (₹)</th>
            <th width="10%" class="text-right">Debit (₹)</th>
            <th width="15%" class="text-right">Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${transactionsWithBalance
            .map(transaction => `
              <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.referenceNo}</td>
                <td class="text-right">${transaction.credit > 0 ? transaction.credit.toLocaleString('en-IN') : '0'}</td>
                <td class="text-right">${transaction.debit > 0 ? transaction.debit.toLocaleString('en-IN') : '0'}</td>
                <td class="text-right">${transaction.balance.toLocaleString('en-IN')}</td>
              </tr>
            `)
            .join('')}
          
          <!-- Total Row -->
          <tr class="total-row">
            <td colspan="3" class="text-left">Total</td>
            <td class="text-right">${totalCredit.toLocaleString('en-IN')}</td>
            <td class="text-right">${totalDebit.toLocaleString('en-IN')}</td>
            <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
          </tr>
          
          <!-- On Account Balance Row - shown below total -->
          <tr class="bold-row">
            <td colspan="5" class="text-left">On Account Balance</td>
            <td class="text-right">${onAccountBalance.toLocaleString('en-IN')}</td>
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
    showError('Failed to load ledger. Please try again.');
  }
};

  if (!canViewSubdealerLedger) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer Ledger.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Subdealer Ledger</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <CNav variant="tabs" className="mb-0 border-bottom">
            {/* Only show Sub Dealer tab if user has VIEW permission for it */}
            {canViewSubDealerTab && (
              <CNavItem>
                <CNavLink
                  active={activeTab === 0}
                  onClick={() => handleTabChange(0)}
                  style={{ 
                    cursor: 'pointer',
                    borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                    color: 'black',
                    borderBottom: 'none'
                  }}
                >
                  Sub Dealer
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Sub Dealer UTR tab if user has VIEW permission for it */}
            {canViewSubDealerUTRTab && (
              <CNavItem>
                <CNavLink
                  active={activeTab === 1}
                  onClick={() => handleTabChange(1)}
                  style={{ 
                    cursor: 'pointer',
                    borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                    borderBottom: 'none',
                    color: 'black'
                  }}
                >
                  Sub Dealer UTR
                </CNavLink>
              </CNavItem>
            )}
          </CNav>
        </CCardHeader>
        
        <CCardBody>
          <CTabContent>
            {canViewSubDealerTab && (
              <CTabPane visible={activeTab === 0} className="p-0">
               
                
                <div className="d-flex justify-content-between mb-3">
                  <div></div>
                  <div className='d-flex'>
                    <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                    <CFormInput
                      type="text"
                      style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                      className="d-inline-block square-search"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                     
                    />
                    {searchTerm && (
                      <CButton 
                        size="sm" 
                        color="secondary" 
                        className="action-btn ms-2"
                        onClick={handleResetSearch}
                      >
                        Reset
                      </CButton>
                    )}
                  </div>
                </div>
                
                <div className="responsive-table-wrapper">
                  <CTable striped bordered hover className='responsive-table'>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Rate Of Interest</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col">Discount</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredData.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
                            {isSubdealer 
                              ? 'No ledger data available for your account' 
                              : 'No subdealers available'}
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        filteredData.map((subdealer, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{subdealer.name}</CTableDataCell>
                            <CTableDataCell>{subdealer.location}</CTableDataCell>
                            <CTableDataCell>{subdealer.rateOfInterest}</CTableDataCell>
                            {/* <CTableDataCell>{subdealer.discount}</CTableDataCell> */}
                            <CTableDataCell>{subdealer.type}</CTableDataCell>
                            <CTableDataCell>
                              <CButton 
                                size="sm" 
                                className="action-btn"
                                onClick={() => handleViewLedger(subdealer)}
                              >
                                <CIcon icon={cilPrint} className='icon'/> View Ledger
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              </CTabPane>
            )}
            
            {canViewSubDealerUTRTab && (
              <CTabPane visible={activeTab === 1} className="p-0">
                {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

                <CRow className="mb-4">
                  <CCol md={5}>
                    <CFormLabel htmlFor="subdealerSelect" className="fw-bold">Select Subdealer</CFormLabel>
                    {isSubdealer ? (
                      <div>
                        <CFormSelect 
                          id="subdealerSelect" 
                          value={selectedSubdealer} 
                          className="square-select bg-light"
                          disabled
                        >
                          <option value={selectedSubdealer}>
                            {userSubdealer?.name || 'Your Subdealer Account'}
                          </option>
                        </CFormSelect>
                        <div className="text-muted small mt-1">
                          Subdealers can only view their own ledger
                        </div>
                      </div>
                    ) : (
                      <CFormSelect 
                        id="subdealerSelect" 
                        value={selectedSubdealer} 
                        onChange={handleSubdealerChange}
                        className="square-select"
                      >
                        <option value="">-- Select Subdealer --</option>
                        {subdealers.map((subdealer) => (
                          <option key={subdealer._id || subdealer.id} value={subdealer._id || subdealer.id}>
                            {subdealer.name} - {subdealer.location}
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  </CCol>

                  <CCol md={5}>
                    <CFormLabel htmlFor="receiptSelect" className="fw-bold">Select UTR/Receipt</CFormLabel>
                    <CFormSelect
                      id="receiptSelect"
                      value={selectedReceipt}
                      onChange={handleReceiptChange}
                      disabled={!selectedSubdealer || receipts.length === 0}
                      className="square-select"
                    >
                      <option value="">-- Select UTR/Receipt --</option>
                      {receipts.map((receipt) => {
                        const remainingAmount = receipt.amount - (receipt.allocatedTotal || 0);
                        return (
                          <option key={receipt._id || receipt.id} value={receipt._id || receipt.id} disabled={remainingAmount <= 0}>
                            {receipt.refNumber || 'No reference'} - ₹{remainingAmount.toLocaleString()} remaining
                          </option>
                        );
                      })}
                    </CFormSelect>
                    <small className="text-muted">
                      {receipts.length === 0 && selectedSubdealer ? 'No receipts available' : 'Select a UTR to allocate payments'}
                    </small>
                  </CCol>
                  <CCol md={2} className="d-flex align-items-end">
                    <CButton className="action-btn w-100">
                      View
                    </CButton>
                  </CCol>
                </CRow>
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default SubdealerLedger;