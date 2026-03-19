// // import config from 'src/config';
// // import '../../../css/table.css';
// // import '../../../css/form.css';
// // import {
// //   React,
// //   useEffect,
// //   getDefaultSearchFields,
// //   useTableFilter,
// //   axiosInstance,
// //   showError,
// //   Link
// // } from 'src/utils/tableImports';
// // import tvsLogo from '../../../assets/images/logo.png';
// // import CIcon from '@coreui/icons-react';
// // import {
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CButton,
// //   CFormInput,
// //   CFormLabel,
// //   CTable,
// //   CTableHead,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableBody,
// //   CTableDataCell
// // } from '@coreui/react';
// // import { useState } from 'react';
// // import { useAuth } from '../../../context/AuthContext';
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   ACTIONS,
// //   canViewPage,
// //   canCreateInPage
// // } from '../../../utils/modulePermissions';
// // import { cilPlus, cilPrint } from '@coreui/icons';

// // const OnAccountBalance = () => {
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const [error, setError] = useState(null);
// //   const { permissions } = useAuth();
  
// //   // Page-level permission checks for OnAccount Balance page under Subdealer Account module
// //   const hasOnAccountView = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE, 
// //     ACTIONS.VIEW
// //   );
  
// //   const hasOnAccountCreate = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE, 
// //     ACTIONS.CREATE
// //   );

// //   // Using convenience functions for cleaner code
// //   const canViewOnAccount = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);
// //   const canCreateOnAccount = canCreateInPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);
  
// //   useEffect(() => {
// //     if (!canViewOnAccount) {
// //       showError('You do not have permission to view OnAccount Balance');
// //       return;
// //     }
    
// //     fetchData();
// //   }, [canViewOnAccount]);

// //   const fetchData = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/subdealers/financials/all`);
// //       setData(response.data.data.subdealers);
// //       setFilteredData(response.data.data.subdealers);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const handleViewLedger = async (subdealer) => {
// //     try {
// //       const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
// //       const ledgerData = res.data.docs;
// //       const subdealerBookings = res.data.subdealerBookings || [];
// //       const accessoryBillings = res.data.accessoryBillings || [];
// //       const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;
// //       const totalOnAccountBalance = res.data.totalOnAccountBalance;

// //       let totalCredit = 0;
// //       let totalDebit = 0;
// //       let runningBalance = 0;

// //       const win = window.open('', '_blank');
// //       win.document.write(`
// //         <!DOCTYPE html>
// //         <html>
// //           <head>
// //             <title>Subdealer Ledger</title>
// //             <style>
// //               @page {
// //                 size: A4;
// //                 margin: 15mm 10mm;
// //               }
// //               body {
// //                 font-family: Arial;
// //                 width: 100%;
// //                 margin: 0;
// //                 padding: 0;
// //                 font-size: 14px;
// //                 line-height: 1.3;
// //                 font-family: Courier New;
// //               }
// //               .container {
// //                 width: 190mm;
// //                 margin: 0 auto;
// //                 padding: 5mm;
// //               }
// //               .header-container {
// //                 display: flex;
// //                 justify-content:space-between;
// //                 margin-bottom: 3mm;
// //               }
// //               .header-text{
// //                 font-size:20px;
// //                 font-weight:bold;
// //               }
// //               .logo {
// //                 width: 30mm;
// //                 height: auto;
// //                 margin-right: 5mm;
// //               } 
// //               .header {
// //                 text-align: left;
// //               }
// //               .divider {
// //                 border-top: 2px solid #AAAAAA;
// //                 margin: 3mm 0;
// //               }
// //               .header h2 {
// //                 margin: 2mm 0;
// //                 font-size: 12pt;
// //                 font-weight: bold;
// //               }
// //               .header div {
// //                 font-size: 14px;
// //               }
// //               .customer-info {
// //                 display: grid;
// //                 grid-template-columns: repeat(2, 1fr);
// //                 gap: 2mm;
// //                 margin-bottom: 5mm;
// //                 font-size: 14px;
// //               }
// //               .customer-info div {
// //                 display: flex;
// //               }
// //               .customer-info strong {
// //                 min-width: 30mm;
// //                 display: inline-block;
// //               }
// //               table {
// //                 width: 100%;
// //                 border-collapse: collapse;
// //                 margin-bottom: 5mm;
// //                 font-size: 14px;
// //                 page-break-inside: avoid;
// //               }
// //               th, td {
// //                 border: 1px solid #000;
// //                 padding: 2mm;
// //                 text-align: left;
// //               }
// //               th {
// //                 background-color: #f0f0f0;
// //                 font-weight: bold;
// //               }
// //               .footer {
// //                 margin-top: 10mm;
// //                 display: flex;
// //                 justify-content: space-between;
// //                 align-items: flex-end;
// //                 font-size: 14px;
// //               }
// //               .footer-left {
// //                 text-align: left;
// //               }
// //               .footer-right {
// //                 text-align: right;
// //               }
// //               .qr-code {
// //                 width: 35mm;
// //                 height: 35mm;
// //               }
// //               .text-right {
// //                 text-align: right;
// //               }
// //               .text-left {
// //                 text-align: left;
// //               }
// //               .text-center {
// //                 text-align: center;
// //               }
// //               @media print {
// //                 body {
// //                   width: 190mm;
// //                   height: 277mm;
// //                 }
// //                 .no-print {
// //                   display: none;
// //                 }
// //               }
// //             </style>
// //           </head>
// //           <body>
// //             <div class="container">
// //               <div class="header-container">
// //                 <img src="${tvsLogo}" class="logo" alt="TVS Logo">
// //                 <div class="header-text"> GANDHI TVS</div>
// //               </div>
// //               <div class="header">
// //                 <div>
// //                   Authorised Main Dealer: TVS Motor Company Ltd.<br>
// //                   Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
// //                   Upnagar, Nashik Road, Nashik - 422101<br>
// //                   Phone: 7498903672
// //                 </div>
// //               </div>
// //               <div class="divider"></div>
// //               <div class="customer-info">
// //                 <div><strong>Subdealer Name:</strong> ${ledgerData[0]?.subdealer?.name || subdealer.name || ''}</div>
// //                 <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
// //               </div>
              
// //               <table>
// //                 <thead>
// //                   <tr>
// //                     <th width="15%">Date</th>
// //                     <th width="35%">Description</th>
// //                     <th width="15%">Reference No</th>
// //                     <th width="10%" class="text-right">Credit (₹)</th>
// //                     <th width="10%" class="text-right">Debit (₹)</th>
// //                     <th width="15%" class="text-right">Balance (₹)</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   ${ledgerData
// //                     .map((receipt) => {
// //                       let rows = '';
// //                       const receiptCredit = receipt.amount;
// //                       runningBalance += receiptCredit;
// //                       totalCredit += receiptCredit;

// //                       if (receipt.allocations && receipt.allocations.length > 0) {
// //                         receipt.allocations.forEach((allocation) => {
// //                           const allocationDebit = allocation.amount;
// //                           runningBalance -= allocationDebit;
// //                           totalDebit += allocationDebit;

// //                           rows += `
// //                             <tr>
// //                               <td>${new Date(allocation.allocatedAt).toLocaleDateString('en-GB')}</td>
// //                               <td>
// //                                 Allocation to Booking<br>
// //                                 Customer: ${allocation.booking?.customerDetails?.name || 'N/A'}<br>
// //                                 Booking No: ${allocation.booking?.bookingNumber || 'N/A'}
// //                               </td>
// //                               <td>${allocation.ledger?.transactionReference || receipt.refNumber || ''}</td>
// //                               <td class="text-right">${allocationDebit.toLocaleString('en-IN')}</td>
// //                               <td class="text-right">0</td>
// //                               <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
// //                             </tr>
// //                           `;
// //                         });
// //                       }

// //                       return rows;
// //                     })
// //                     .join('')}

// //                       ${subdealerBookings
// //                         .map((booking) => {
// //                           const bookingDebit = booking.discountedAmount;
// //                           runningBalance -= bookingDebit;
// //                           totalDebit += bookingDebit;

// //                           return `
// //                             <tr>
// //                               <td>${new Date(booking.bookingDate).toLocaleDateString('en-GB')}</td>
// //                               <td>
// //                                 Booking Created<br>
// //                                 Customer: ${booking.customerDetails?.salutation || ''} ${booking.customerDetails?.name || 'N/A'}<br>
// //                                 ${booking.remark || ''}
// //                               </td>
// //                               <td>${booking.bookingNumber || ''}</td>
// //                               <td class="text-right">0</td>
// //                               <td class="text-right">${bookingDebit.toLocaleString('en-IN')}</td>
// //                               <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
// //                             </tr>
// //                           `;
// //                         })
// //                         .join('')}
                        
// //                         ${accessoryBillings
// //                           .map((booking) => {
// //                             const bookingDebit = booking.amount;
// //                             runningBalance -= bookingDebit;
// //                             totalDebit += bookingDebit;

// //                             return `
// //                           <tr>
// //                             <td>${new Date(booking.createdAt).toLocaleDateString('en-GB')}</td>
// //                             <td>
// //                              Accessory Billing<br>
// //                               ${booking.cashLocation.name || ''} ${booking.paymentMode || 'N/A'}<br>
// //                             </td>
// //                             <td>${booking.bookingNumber || ''}</td>
// //                             <td class="text-right">0</td>
// //                             <td class="text-right">${bookingDebit.toLocaleString('en-IN')}</td>
// //                             <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
// //                           </tr>
// //                         `;
// //                           })
// //                           .join('')}

// //                    <tr>
// //                     <td colspan="3" class="text-left"><strong>OnAccount Balance</strong></td>
// //                     <td></td>
// //                       <td></td>
// //                     <td class="text-right"><strong>${totalOnAccountBalance.toLocaleString('en-IN') || '0'}</strong></td>
// //                   </tr>
// //                   <tr>
// //                     <td colspan="3" class="text-left"><strong>Total</strong></td>
// //                     <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
// //                     <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
// //                     <td class="text-right"><strong>${runningBalance.toLocaleString('en-IN')}</strong></td>
// //                   </tr>
// //                 </tbody>
// //               </table>
              
// //               <div class="footer">
// //                 <div class="footer-left">
// //                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
// //                        class="qr-code" 
// //                        alt="QR Code" />
// //                 </div>
// //                 <div class="footer-right">
// //                   <p>For, Gandhi TVS</p>
// //                   <p>Authorised Signatory</p>
// //                 </div>
// //               </div>
// //             </div>
            
// //             <script>
// //               window.onload = function() {
// //                 setTimeout(() => {
// //                   window.print();
// //                 }, 300);
// //               };
// //             </script>
// //           </body>
// //         </html>
// //       `);
// //     } catch (err) {
// //       console.error('Error fetching ledger:', err);
// //       showError('Failed to load ledger. Please try again.');
// //     }
// //   };

// //   const handleSearch = (searchValue) => {
// //     handleFilter(searchValue, getDefaultSearchFields('subdealer'));
// //   };

// //   if (!canViewOnAccount) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view OnAccount Balance.
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         {error}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className='title'>OnAccount Balance</div>
    
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div>
// //             {canCreateOnAccount && (
// //               <Link to="/subdealer-account/add-amount">
// //                 <CButton size="sm" className="action-btn me-1">
// //                   <CIcon icon={cilPlus} className='icon'/> New Balance
// //                 </CButton>
// //               </Link>
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
// //                 onChange={(e) => handleSearch(e.target.value)}
// //               />
// //             </div>
// //           </div>
          
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //                   <CTableHeaderCell>Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Amount</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Received</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Balance</CTableHeaderCell>
// //                   <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
// //                   {canViewOnAccount && <CTableHeaderCell>Action</CTableHeaderCell>}
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {filteredData.length === 0 ? (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan={canViewOnAccount ? "8" : "7"} className="text-center">
// //                       No subdealers available
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 ) : (
// //                   filteredData.map((subdealer, index) => (
// //                     <CTableRow key={index}>
// //                       <CTableDataCell>{index + 1}</CTableDataCell>
// //                       <CTableDataCell>{subdealer.name}</CTableDataCell>
// //                       <CTableDataCell>{subdealer.financials.bookingSummary.totalBookings}</CTableDataCell>
// //                       <CTableDataCell>{subdealer.financials.bookingSummary.totalBookingAmount}</CTableDataCell>
// //                       <CTableDataCell>{subdealer.financials.bookingSummary.totalReceivedAmount}</CTableDataCell>
// //                       <CTableDataCell>{subdealer.financials.bookingSummary.totalBalanceAmount}</CTableDataCell>
// //                       <CTableDataCell>{subdealer.financials.onAccountSummary.totalBalance}</CTableDataCell>
// //                       {canViewOnAccount && (
// //                         <CTableDataCell>
// //                           <CButton 
// //                             size="sm" 
// //                             className="action-btn"
// //                             onClick={() => handleViewLedger(subdealer)}
// //                           >
// //                             <CIcon icon={cilPrint} className='icon'/> View Ledger
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

// // export default OnAccountBalance;



// import config from 'src/config';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import {
//   React,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   axiosInstance,
//   showError,
//   Link
// } from 'src/utils/tableImports';
// import tvsLogo from '../../../assets/images/logo.png';
// import CIcon from '@coreui/icons-react';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CFormLabel,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
//   CSpinner
// } from '@coreui/react';
// import { useState, useCallback } from 'react';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage
// } from '../../../utils/modulePermissions';
// import { cilPlus, cilPrint, cilCloudDownload } from '@coreui/icons';
// import QRCode from 'qrcode';

// const OnAccountBalance = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [error, setError] = useState(null);
//   const { permissions, user: authUser } = useAuth();
  
//   // ============ RECEIPTS FETCHING STATES ============
//   const [receiptsData, setReceiptsData] = useState({});
//   const [loadingReceipts, setLoadingReceipts] = useState({});
//   const [receiptsFetched, setReceiptsFetched] = useState({});
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   // Page-level permission checks for OnAccount Balance page under Subdealer Account module
//   const hasOnAccountView = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE, 
//     ACTIONS.VIEW
//   );
  
//   const hasOnAccountCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE, 
//     ACTIONS.CREATE
//   );

//   // Using convenience functions for cleaner code
//   const canViewOnAccount = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);
//   const canCreateOnAccount = canCreateInPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);
  
//   useEffect(() => {
//     if (!canViewOnAccount) {
//       showError('You do not have permission to view OnAccount Balance');
//       return;
//     }
    
//     fetchData();
//   }, [canViewOnAccount]);

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealers/financials/all`);
//       let subdealers = response.data.data.subdealers || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         subdealers = subdealers.filter(subdealer => 
//           subdealer._id === userSubdealerId
//         );
//       }
      
//       setData(subdealers);
//       setFilteredData(subdealers);
      
//       // Initialize receipts data structure
//       const initialReceiptsMap = {};
//       subdealers.forEach(subdealer => {
//         initialReceiptsMap[subdealer._id] = [];
//       });
//       setReceiptsData(initialReceiptsMap);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   // ============ FETCH RECEIPTS FOR SUBDEALER ============
//   const fetchReceiptsForSubdealer = useCallback(async (subdealerId) => {
//     if (receiptsFetched[subdealerId] || loadingReceipts[subdealerId]) {
//       return;
//     }

//     try {
//       setLoadingReceipts(prev => ({ ...prev, [subdealerId]: true }));
      
//       const response = await axiosInstance.get(`/subdealersonaccount/${subdealerId}/on-account/receipts`);
      
//       let receipts = [];
      
//       // Handle both new and old API response structures
//       if (response.data && response.data.data && response.data.data.entries) {
//         // New structure - filter for credit entries (receipts)
//         receipts = response.data.data.entries.filter(entry => 
//           entry.type === 'CREDIT' || entry.credit > 0
//         ) || [];
//       } else if (response.data && response.data.docs) {
//         // Old structure
//         receipts = response.data.docs || [];
//       }
      
//       setReceiptsData(prev => ({
//         ...prev,
//         [subdealerId]: receipts
//       }));
      
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [subdealerId]: true
//       }));
//     } catch (error) {
//       console.error(`Error fetching receipts for subdealer ${subdealerId}:`, error);
//       setReceiptsData(prev => ({
//         ...prev,
//         [subdealerId]: []
//       }));
//       setReceiptsFetched(prev => ({
//         ...prev,
//         [subdealerId]: true
//       }));
//     } finally {
//       setLoadingReceipts(prev => ({ ...prev, [subdealerId]: false }));
//     }
//   }, [receiptsFetched, loadingReceipts]);

//   // ============ PRINT RECEIPT FUNCTION (similar to Receipt component) ============
//   const printSubdealerReceipt = async (receiptId) => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/receipts/${receiptId}`);
//       const receiptData = response.data.data;
      
//       // Format dates
//       const receivedDate = receiptData.receivedDateFormatted || 
//                           new Date(receiptData.receivedDate || receiptData.createdAt).toLocaleDateString('en-GB');
      
//       const currentDate = new Date().toLocaleDateString('en-GB');
      
//       // Generate QR Code
//       const qrText = `GANDHI MOTORS PVT LTD
// Subdealer: ${receiptData.subdealer?.name || 'N/A'}
// Receipt No: ${receiptData.refNumber || receiptData._id}
// Amount: ₹${receiptData.amount || 0}
// Payment Mode: ${receiptData.paymentMode || 'Cash'}
// Reference: ${receiptData.refNumber || 'N/A'}
// Date: ${receivedDate}`;

//       let qrCodeImage = '';
//       try {
//         qrCodeImage = await QRCode.toDataURL(qrText, {
//           width: 150,
//           margin: 2,
//           color: {
//             dark: '#000000',
//             light: '#FFFFFF'
//           },
//           errorCorrectionLevel: 'H'
//         });
//       } catch (error) {
//         console.error('Error generating QR code:', error);
//         qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
//           <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
//             <rect width="150" height="150" fill="white"/>
//             <rect x="10" y="10" width="130" height="130" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
//             <text x="75" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">QR CODE</text>
//             <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${receiptData.refNumber || ''}</text>
//           </svg>
//         `);
//       }

//       const receiptHTML = generateReceiptHTML(receiptData, qrCodeImage, receivedDate, currentDate);

//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(receiptHTML);
//       printWindow.document.close();
      
//       printWindow.onload = function() {
//         printWindow.focus();
//         printWindow.print();
//       };
      
//     } catch (err) {
//       console.error('Error fetching receipt details:', err);
//       showError('Failed to load receipt. Please try again.');
//     }
//   };

//   // ============ GENERATE RECEIPT HTML (similar to Receipt component's second receipt design) ============
//   const generateReceiptHTML = (receiptData, qrCodeImage, receivedDate, currentDate) => {
//     const receiptNumber = receiptData.refNumber || receiptData._id || 'N/A';
//     const subdealerName = receiptData.subdealer?.name || 'N/A';
//     const amount = receiptData.amount || 0;
//     const paymentMode = receiptData.paymentMode || 'Cash';
//     const remark = receiptData.remark || '';
//     const branch = receiptData.branch || {};
//     const receivedByName = receiptData.receivedByName || receiptData.receivedBy?.name || 'System';
//     const approvalStatus = receiptData.approvalStatus || 'Pending';
    
//     // Format amount in words (simplified version)
//     const amountInWords = numberToWordsSimple(amount);

//     return `<!DOCTYPE html>
// <html>
// <head>
//   <title>Payment Receipt - ${receiptNumber}</title>
//   <style>
//     body {
//       font-family: "Courier New", Courier, monospace;
//       margin: 0;
//       padding: 10mm;
//       font-size: 14px;
//       color: #333;
//     }
//     .page {
//       width: 210mm;
//       margin: 0 auto;
//     }
//     .receipt-copy {
//       height: auto;
//       min-height: 130mm;
//       page-break-inside: avoid;
//     }
//     .header-container {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 2mm;
//       align-items: flex-start;
//     }
//     .header-left {
//       width: 60%;
//     }
//     .header-right {
//       width: 40%;
//       text-align: right;
//       display: flex;
//       flex-direction: column;
//       align-items: flex-end;
//     }
//     .logo-qr-container {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       justify-content: flex-end;
//       margin-bottom: 5px;
//       width: 100%;
//     }
//     .logo {
//       height: 50px;
//     }
//     .qr-code-small {
//       width: 80px;
//       height: 80px;
//       border: 1px solid #ccc;
//     }
//     .dealer-info {
//       text-align: left;
//       font-size: 12px;
//       line-height: 1.2;
//     }
//     .dealer-name {
//       font-size: 16px;
//       font-weight: bold;
//       margin: 0 0 3px 0;
//     }
//     .customer-info-container {
//       display: flex;
//       font-size: 12px;
//       margin: 10px 0;
//     }
//     .customer-info-left {
//       width: 50%;
//     }
//     .customer-info-right {
//       width: 50%;
//     }
//     .customer-info-row {
//       margin: 2mm 0;
//       line-height: 1.2;
//     }
//     .divider {
//       border-top: 2px solid #AAAAAA;
//       margin: 3mm 0;
//     }
//     .receipt-info {
//       background-color: #f8f9fa;
//       border: 1px solid #dee2e6;
//       border-radius: 4px;
//       padding: 8px;
//       margin: 10px 0;
//       font-size: 12px;
//     }
//     .payment-info-box {
//       margin: 10px 0;
//     }
//     .signature-box {
//       margin-top: 15mm;
//       font-size: 10pt;
//     }
//     .signature-line {
//       border-top: 1px dashed #000;
//       width: 40mm;
//       display: inline-block;
//       margin: 0 5mm;
//     }
//     .cutting-line {
//       border-top: 2px dashed #333;
//       margin: 15mm 0 10mm 0;
//       text-align: center;
//       position: relative;
//     }
//     .cutting-line::before {
//       content: "✂ Cut Here ✂";
//       position: absolute;
//       top: -10px;
//       left: 50%;
//       transform: translateX(-50%);
//       background: white;
//       padding: 0 10px;
//       font-size: 12px;
//       color: #666;
//     }
//     .note {
//       padding: 1px;
//       margin: 2px;
//       font-size: 11px;
//     }
//     .amount-in-words {
//       font-style: italic;
//       margin-top: 8px;
//       padding: 5px;
//       font-size: 12px;
//       border-top: 1px dashed #ccc;
//     }
//     .status-badge {
//       display: inline-block;
//       padding: 3px 8px;
//       border-radius: 12px;
//       font-size: 11px;
//       font-weight: bold;
//       background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
//       color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
//       border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
//     }
//     .footer-note {
//       font-size: 9px;
//       color: #777;
//       text-align: center;
//       margin-top: 5mm;
//     }
//     @page {
//       size: A4;
//       margin: 10mm;
//     }
//     @media print {
//       body {
//         padding: 0;
//       }
//       .receipt-copy {
//         page-break-inside: avoid;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <!-- FIRST COPY -->
//     <div class="receipt-copy">
//       <div class="header-container">
//         <div class="header-left">
//           <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
//           <div class="dealer-info">
//             Authorized Main Dealer: TVS Motor Company Ltd.<br>
//             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//             Upnagar, Nashik Road, Nashik - 422101<br>
//             Phone: 7498903672<br>
//             GSTIN: ${branch.gst_number || '27AACCG1234E1Z5'}<br>
//             ${branch.name || 'GANDHI TVS NASHIK'}
//           </div>
//         </div>
//         <div class="header-right">
//           <div class="logo-qr-container">
//             <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
//             ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
//           </div>
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
//         </div>
//       </div>
      
//       <div class="divider"></div>

//       <div class="receipt-info">
//         <div><strong>SUBDEALER PAYMENT RECEIPT</strong></div>
//         <div><strong>Receipt Date:</strong> ${receivedDate}</div>
       
//       </div>

//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Subdealer Name:</strong> ${subdealerName}</div>
//           <div class="customer-info-row"><strong>Receipt Number:</strong> ${receiptNumber}</div>
//           <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
//         </div>
//         <div class="customer-info-right">
//           <div class="customer-info-row"><strong>Reference No:</strong> ${receiptData.refNumber || '-'}</div>
//           <div class="customer-info-row"><strong>Received By:</strong> ${receivedByName}</div>
//           <div class="customer-info-row"><strong>Bank:</strong> ${receiptData.bank?.name || '-'}</div>
//         </div>
//       </div>

//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div style="display: flex; justify-content: space-between;">
//             <span><strong>Receipt Amount:</strong></span>
//             <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
//           </div>
//           ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
//         </div>
        
//         <div class="amount-in-words">
//           <strong>Amount in words:</strong> ${amountInWords} Only
//         </div>
//       </div>

//       <div class="note">
//         <strong>Notes:</strong> This is a system generated receipt for On-Account payment.
//       </div>
      
//       <div class="divider"></div>

//       <div class="signature-box">
//         <div style="display: flex; justify-content: space-between;">
//           <div style="text-align:center; width: 30%;">
//             <div class="signature-line"></div>
//             <div>Subdealer's Signature</div>
//           </div>
//           <div style="text-align:center; width: 30%;">
//             <div class="signature-line"></div>
//             <div>Authorised Signatory</div>
//           </div>
//           <div style="text-align:center; width: 30%;">
//             <div class="signature-line"></div>
//             <div>Accountant</div>
//           </div>
//         </div>
//       </div>
      
//       <div class="footer-note">
//         This is a computer generated receipt - valid without signature
//       </div>
//     </div>

//     <!-- CUTTING LINE -->
//     <div class="cutting-line"></div>

//     <!-- SECOND COPY (DUPLICATE) -->
//     <div class="receipt-copy">
//       <div class="header-container">
//         <div class="header-left">
//           <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
//           <div class="dealer-info">
//             Authorized Main Dealer: TVS Motor Company Ltd.<br>
//             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//             Upnagar, Nashik Road, Nashik - 422101<br>
//             Phone: 7498903672<br>
//             GSTIN: ${branch.gst_number || '27AACCG1234E1Z5'}<br>
//             ${branch.name || 'GANDHI TVS NASHIK'}
//           </div>
//         </div>
//         <div class="header-right">
//           <div class="logo-qr-container">
//             <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
//             ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
//           </div>
//           <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
//           <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
//         </div>
//       </div>
      
//       <div class="divider"></div>

//       <div class="receipt-info">
//         <div><strong>SUBDEALER PAYMENT RECEIPT (DUPLICATE)</strong></div>
//         <div><strong>Receipt Date:</strong> ${receivedDate}</div>
      
//       </div>

//       <div class="customer-info-container">
//         <div class="customer-info-left">
//           <div class="customer-info-row"><strong>Subdealer Name:</strong> ${subdealerName}</div>
//           <div class="customer-info-row"><strong>Receipt Number:</strong> ${receiptNumber}</div>
//           <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
//         </div>
//         <div class="customer-info-right">
//           <div class="customer-info-row"><strong>Reference No:</strong> ${receiptData.refNumber || '-'}</div>
//           <div class="customer-info-row"><strong>Received By:</strong> ${receivedByName}</div>
//           <div class="customer-info-row"><strong>Bank:</strong> ${receiptData.bank?.name || '-'}</div>
//         </div>
//       </div>

//       <div class="payment-info-box">
//         <div class="receipt-info">
//           <div style="display: flex; justify-content: space-between;">
//             <span><strong>Receipt Amount:</strong></span>
//             <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
//           </div>
//           ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
//         </div>
        
//         <div class="amount-in-words">
//           <strong>Amount in words:</strong> ${amountInWords} Only
//         </div>
//       </div>

//       <div class="note">
//         <strong>Notes:</strong> This is a system generated receipt for On-Account payment.
//       </div>
      
//       <div class="divider"></div>

//       <div class="signature-box">
//         <div style="display: flex; justify-content: space-between;">
//           <div style="text-align:center; width: 30%;">
//             <div class="signature-line"></div>
//             <div>Subdealer's Signature</div>
//           </div>
//           <div style="text-align:center; width: 30%;">
//             <div class="signature-line"></div>
//             <div>Authorised Signatory</div>
//           </div>
//           <div style="text-align:center; width: 30%;">
//             <div class="signature-line"></div>
//             <div>Accountant</div>
//           </div>
//         </div>
//       </div>
      
//       <div class="footer-note">
//         This is a computer generated receipt - valid without signature
//       </div>
//     </div>
//   </div>
// </body>
// </html>`;
//   };

//   // ============ SIMPLE NUMBER TO WORDS FUNCTION ============
//   const numberToWordsSimple = (num) => {
//     if (num === 0) return 'Zero';
    
//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
//                   'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
//                   'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
//     const numToWords = (n) => {
//       if (n < 20) return ones[n];
//       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//       if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
//       if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
//       if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
//       return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
//     };
    
//     return numToWords(Math.floor(num)) + (num % 1 ? ' point ' + num.toString().split('.')[1] : '');
//   };

//   const handleViewLedger = async (subdealer) => {
//     try {
//       const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
      
//       // Handle both old and new API response structures
//       let ledgerEntries = [];
//       let subdealerBookings = [];
//       let accessoryBillings = [];
//       let onAccountBalance = 0;
//       let totalOnAccountBalance = 0;
      
//       if (res.data && res.data.data && res.data.data.entries) {
//         // New structure (from your API response)
//         const responseData = res.data.data;
//         ledgerEntries = responseData.entries || [];
//         onAccountBalance = responseData.totals?.onAccountBalance || 0;
//         totalOnAccountBalance = onAccountBalance;
        
//         // Extract credit entries (receipts) and debit entries (bookings)
//         const creditEntries = ledgerEntries.filter(entry => entry.type === 'CREDIT' || entry.credit > 0);
//         const debitEntries = ledgerEntries.filter(entry => entry.type === 'DEBIT' || entry.debit > 0);
        
//         // Process debit entries as subdealer bookings
//         subdealerBookings = debitEntries.map(entry => ({
//           ...entry,
//           // Map to expected booking structure
//           customerDetails: {
//             salutation: '',
//             name: entry.subdealerName || subdealer.name || ''
//           },
//           bookingNumber: entry.receiptNo || entry.id,
//           discountedAmount: entry.debit,
//           totalAmount: entry.debit,
//           amount: entry.debit,
//           remark: entry.remark || entry.description,
//           createdAt: entry.timestamp,
//           bookingDate: entry.date
//         }));
        
//         // Use credit entries as ledger data
//         ledgerEntries = creditEntries;
//       } else if (res.data && res.data.docs) {
//         // Old structure
//         ledgerEntries = res.data.docs || [];
//         subdealerBookings = res.data.subdealerBookings || [];
//         accessoryBillings = res.data.accessoryBillings || [];
//         totalOnAccountBalance = res.data.totalOnAccountBalance || 0;
//         onAccountBalance = totalOnAccountBalance;
//       }
      
//       const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;

//       let totalCredit = 0;
//       let totalDebit = 0;
//       let runningBalance = 0;

//       const win = window.open('', '_blank');
//       win.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>Subdealer Ledger</title>
//             <style>
//               @page {
//                 size: A4;
//                 margin: 15mm 10mm;
//               }
//               body {
//                 font-family: Arial;
//                 width: 100%;
//                 margin: 0;
//                 padding: 0;
//                 font-size: 14px;
//                 line-height: 1.3;
//                 font-family: Courier New;
//               }
//               .container {
//                 width: 190mm;
//                 margin: 0 auto;
//                 padding: 5mm;
//               }
//               .header-container {
//                 display: flex;
//                 justify-content:space-between;
//                 margin-bottom: 3mm;
//               }
//               .header-text{
//                 font-size:20px;
//                 font-weight:bold;
//               }
//               .logo {
//                 width: 30mm;
//                 height: auto;
//                 margin-right: 5mm;
//               } 
//               .header {
//                 text-align: left;
//               }
//               .divider {
//                 border-top: 2px solid #AAAAAA;
//                 margin: 3mm 0;
//               }
//               .header h2 {
//                 margin: 2mm 0;
//                 font-size: 12pt;
//                 font-weight: bold;
//               }
//               .header div {
//                 font-size: 14px;
//               }
//               .customer-info {
//                 display: grid;
//                 grid-template-columns: repeat(2, 1fr);
//                 gap: 2mm;
//                 margin-bottom: 5mm;
//                 font-size: 14px;
//               }
//               .customer-info div {
//                 display: flex;
//               }
//               .customer-info strong {
//                 min-width: 30mm;
//                 display: inline-block;
//               }
//               table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-bottom: 5mm;
//                 font-size: 14px;
//                 page-break-inside: avoid;
//               }
//               th, td {
//                 border: 1px solid #000;
//                 padding: 2mm;
//                 text-align: left;
//               }
//               th {
//                 background-color: #f0f0f0;
//                 font-weight: bold;
//               }
//               .footer {
//                 margin-top: 10mm;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: flex-end;
//                 font-size: 14px;
//               }
//               .footer-left {
//                 text-align: left;
//               }
//               .footer-right {
//                 text-align: right;
//               }
//               .qr-code {
//                 width: 35mm;
//                 height: 35mm;
//               }
//               .text-right {
//                 text-align: right;
//               }
//               .text-left {
//                 text-align: left;
//               }
//               .text-center {
//                 text-align: center;
//               }
//               .no-data {
//                 text-align: center;
//                 padding: 20mm;
//                 color: #666;
//               }
//               @media print {
//                 body {
//                   width: 190mm;
//                   height: 277mm;
//                 }
//                 .no-print {
//                   display: none;
//                 }
//               }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <div class="header-container">
//                 <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//                 <div class="header-text"> GANDHI TVS</div>
//               </div>
//               <div class="header">
//                 <div>
//                   Authorised Main Dealer: TVS Motor Company Ltd.<br>
//                   Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//                   Upnagar, Nashik Road, Nashik - 422101<br>
//                   Phone: 7498903672
//                 </div>
//               </div>
//               <div class="divider"></div>
//               <div class="customer-info">
//                 <div><strong>Subdealer Name:</strong> ${subdealer.name || ''}</div>
//                 <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
//               </div>
              
//               <table>
//                 <thead>
//                   <tr>
//                     <th width="15%">Date</th>
//                     <th width="35%">Description</th>
//                     <th width="15%">Reference No</th>
//                     <th width="10%" class="text-right">Credit (₹)</th>
//                     <th width="10%" class="text-right">Debit (₹)</th>
//                     <th width="15%" class="text-right">Balance (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${ledgerEntries.length > 0 ? ledgerEntries
//                     .map((entry) => {
//                       // Check if this is a new structure entry or old structure receipt
//                       const isNewStructure = entry.type !== undefined;
                      
//                       let receiptCredit = 0;
//                       let receiptDate = '';
//                       let receiptRemark = '';
//                       let receiptRefNumber = '';
//                       let receiptPaymentMode = '';
                      
//                       if (isNewStructure) {
//                         // New structure
//                         receiptCredit = entry.credit || 0;
//                         receiptDate = entry.date || new Date(entry.timestamp).toLocaleDateString('en-GB');
//                         receiptRemark = entry.remark || entry.description || '';
//                         receiptRefNumber = entry.receiptNo || entry.id || '';
//                         receiptPaymentMode = entry.paymentMode || 'N/A';
//                       } else {
//                         // Old structure
//                         receiptCredit = entry.amount || 0;
//                         receiptDate = new Date(entry.createdAt).toLocaleDateString('en-GB');
//                         receiptRemark = entry.remark || '';
//                         receiptRefNumber = entry.refNumber || '';
//                         receiptPaymentMode = entry.paymentMode || 'N/A';
//                       }
                      
//                       // Calculate running balance (credit increases balance)
//                       runningBalance += receiptCredit;
//                       totalCredit += receiptCredit;
                      
//                       let rows = '';
                      
//                       // Add receipt row
//                       rows += `
//                         <tr>
//                           <td>${receiptDate}</td>
//                           <td>
//                             ${isNewStructure ? 'On-Account Payment' : 'OnAccount Receipt'}<br>
//                             Mode: ${receiptPaymentMode}<br>
//                             ${receiptRemark}
//                           </td>
//                           <td>${receiptRefNumber}</td>
//                           <td class="text-right">${receiptCredit.toLocaleString('en-IN')}</td>
//                           <td class="text-right">0</td>
//                           <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
//                         </tr>
//                       `;

//                       // Only process allocations for old structure (new structure doesn't have allocations)
//                       if (!isNewStructure && entry.allocations && entry.allocations.length > 0) {
//                         entry.allocations.forEach((allocation) => {
//                           const allocationDebit = allocation.amount || 0;
//                           runningBalance -= allocationDebit;
//                           totalDebit += allocationDebit;

//                           rows += `
//                             <tr>
//                               <td>${new Date(allocation.allocatedAt).toLocaleDateString('en-GB')}</td>
//                               <td>
//                                 Allocation to Booking<br>
//                                 Customer: ${allocation.booking?.customerDetails?.name || 'N/A'}<br>
//                                 Booking No: ${allocation.booking?.bookingNumber || 'N/A'}
//                               </td>
//                               <td>${allocation.ledger?.transactionReference || entry.refNumber || ''}</td>
//                               <td class="text-right">0</td>
//                               <td class="text-right">${allocationDebit.toLocaleString('en-IN')}</td>
//                               <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
//                             </tr>
//                           `;
//                         });
//                       }

//                       return rows;
//                     })
//                     .join('') : 
//                     `<tr><td colspan="6" class="no-data">No receipt data available</td></tr>`
//                   }

//                   ${subdealerBookings.length > 0 ? subdealerBookings
//                     .map((booking) => {
//                       const isNewStructure = booking.type !== undefined;
                      
//                       let bookingDebit = 0;
//                       let bookingDate = '';
//                       let customerName = '';
//                       let bookingRemark = '';
//                       let bookingRefNumber = '';
                      
//                       if (isNewStructure) {
//                         // New structure (already mapped above)
//                         bookingDebit = booking.discountedAmount || booking.debit || 0;
//                         bookingDate = booking.date || new Date(booking.timestamp).toLocaleDateString('en-GB');
//                         customerName = booking.customerDetails?.name || booking.subdealerName || 'N/A';
//                         bookingRemark = booking.remark || booking.description || '';
//                         bookingRefNumber = booking.bookingNumber || booking.receiptNo || booking.id || '';
//                       } else {
//                         // Old structure
//                         bookingDebit = booking.discountedAmount || booking.totalAmount || booking.amount || 0;
//                         bookingDate = new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-GB');
//                         customerName = booking.customerDetails?.name || 'N/A';
//                         bookingRemark = booking.remark || '';
//                         bookingRefNumber = booking.bookingNumber || booking._id || '';
//                       }
                      
//                       runningBalance -= bookingDebit;
//                       totalDebit += bookingDebit;

//                       return `
//                         <tr>
//                           <td>${bookingDate}</td>
//                           <td>
//                             Booking Created<br>
//                             Customer: ${customerName}<br>
//                             ${bookingRemark}
//                           </td>
//                           <td>${bookingRefNumber}</td>
//                           <td class="text-right">0</td>
//                           <td class="text-right">${bookingDebit.toLocaleString('en-IN')}</td>
//                           <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
//                         </tr>
//                       `;
//                     })
//                     .join('') : ''
//                   }
                  
//                   ${accessoryBillings.length > 0 ? accessoryBillings
//                     .map((accessory) => {
//                       const accessoryDebit = accessory.amount || 0;
//                       runningBalance -= accessoryDebit;
//                       totalDebit += accessoryDebit;

//                       const cashLocationName = accessory.cashLocation?.name || '';
//                       const paymentMode = accessory.paymentMode || 'N/A';
//                       const remark = accessory.remark || 'Accessory Billing';

//                       return `
//                         <tr>
//                           <td>${new Date(accessory.createdAt).toLocaleDateString('en-GB')}</td>
//                           <td>
//                             ${remark}<br>
//                             ${cashLocationName} ${paymentMode}
//                           </td>
//                           <td>${accessory.transactionReference || accessory._id || ''}</td>
//                           <td class="text-right">0</td>
//                           <td class="text-right">${accessoryDebit.toLocaleString('en-IN')}</td>
//                           <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
//                         </tr>
//                       `;
//                     })
//                     .join('') : ''
//                   }

//                   <tr>
//                     <td colspan="3" class="text-left"><strong>OnAccount Balance</strong></td>
//                     <td></td>
//                       <td></td>
//                     <td class="text-right"><strong>${onAccountBalance.toLocaleString('en-IN') || '0'}</strong></td>
//                   </tr>
//                   <tr>
//                     <td colspan="3" class="text-left"><strong>Total</strong></td>
//                     <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
//                     <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
//                     <td class="text-right"><strong>${runningBalance.toLocaleString('en-IN')}</strong></td>
//                   </tr>
//                 </tbody>
//               </table>
              
//               <div class="footer">
//                 <div class="footer-left">
//                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
//                        class="qr-code" 
//                        alt="QR Code" />
//                 </div>
//                 <div class="footer-right">
//                   <p>For, Gandhi TVS</p>
//                   <p>Authorised Signatory</p>
//                 </div>
//               </div>
//             </div>
            
//             <script>
//               window.onload = function() {
//                 setTimeout(() => {
//                   window.print();
//                 }, 300);
//               };
//             </script>
//           </body>
//         </html>
//       `);
//     } catch (err) {
//       console.error('Error fetching ledger:', err);
//       showError('Failed to load ledger. Please try again.');
//     }
//   };

//   const handleSearch = (searchValue) => {
//     handleFilter(searchValue, getDefaultSearchFields('subdealer'));
//   };

//   // ============ RENDER PAGINATION (optional) ============
//   const renderPagination = () => {
//     // Add pagination logic here if needed
//     return null;
//   };

//   if (!canViewOnAccount) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view OnAccount Balance.
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
//       <div className='title'>OnAccount Balance</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {/* "New Balance" button should not be visible to subdealers */}
//             {canCreateOnAccount && !isSubdealer && (
//               <Link to="/subdealer-account/add-amount">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Balance
//                 </CButton>
//               </Link>
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
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
//                   <CTableHeaderCell>Total Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Total Received</CTableHeaderCell>
//                   <CTableHeaderCell>Total Balance</CTableHeaderCell>
//                   <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
//                   <CTableHeaderCell>Receipts</CTableHeaderCell>
//                   {canViewOnAccount && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={canViewOnAccount ? "9" : "8"} className="text-center">
//                       {isSubdealer 
//                         ? 'No on-account balance data available for your account' 
//                         : 'No subdealers available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredData.map((subdealer, index) => {
//                     const hasReceipts = receiptsFetched[subdealer._id] && receiptsData[subdealer._id]?.length > 0;
//                     const isLoading = loadingReceipts[subdealer._id];
//                     const receipts = receiptsData[subdealer._id] || [];
                    
//                     // Sort receipts by date (newest first)
//                     const sortedReceipts = [...receipts].sort((a, b) => {
//                       const dateA = new Date(a.timestamp || a.receivedDate || a.createdAt || 0);
//                       const dateB = new Date(b.timestamp || b.receivedDate || b.createdAt || 0);
//                       return dateB - dateA; // descending (newest first)
//                     });
                    
//                     return (
//                       <CTableRow key={index}>
//                         <CTableDataCell>{index + 1}</CTableDataCell>
//                         <CTableDataCell>{subdealer.name}</CTableDataCell>
//                         <CTableDataCell>{subdealer.financials.bookingSummary.totalBookings}</CTableDataCell>
//                         <CTableDataCell>{subdealer.financials.bookingSummary.totalBookingAmount}</CTableDataCell>
//                         <CTableDataCell>{subdealer.financials.bookingSummary.totalReceivedAmount}</CTableDataCell>
//                         <CTableDataCell>{subdealer.financials.bookingSummary.totalBalanceAmount}</CTableDataCell>
//                         <CTableDataCell>{subdealer.financials.onAccountSummary.totalBalance}</CTableDataCell>
                        
//                         {/* Receipts Column */}
//                         <CTableDataCell>
//                           {isLoading ? (
//                             <CSpinner size="sm" color="info" />
//                           ) : sortedReceipts.length > 0 ? (
//                             <CDropdown>
//                               <CDropdownToggle size="sm" color="info" variant="outline">
//                                 {sortedReceipts.length} Receipt{sortedReceipts.length > 1 ? 's' : ''}
//                               </CDropdownToggle>
//                               <CDropdownMenu>
//                                 {sortedReceipts.map((receipt, receiptIndex) => {
//                                   // Determine receipt ID and display info
//                                   const receiptId = receipt.id || receipt._id;
//                                   const receiptNumber = receipt.receiptNo || receipt.refNumber || 'N/A';
//                                   const receiptAmount = receipt.credit || receipt.amount || 0;
//                                   const receiptDate = receipt.date || 
//                                                       (receipt.receivedDateFormatted) || 
//                                                       (receipt.receivedDate ? new Date(receipt.receivedDate).toLocaleDateString('en-GB') : '') ||
//                                                       (receipt.createdAt ? new Date(receipt.createdAt).toLocaleDateString('en-GB') : '');
                                  
//                                   return (
//                                     <CDropdownItem 
//                                       key={receiptId || receiptIndex} 
//                                       onClick={() => printSubdealerReceipt(receiptId)}
//                                     >
//                                       <div className="d-flex align-items-center">
//                                         <CIcon icon={cilPrint} className="me-2" />
//                                         <div>
//                                           <div><strong>Receipt #{receiptIndex + 1}</strong></div>
//                                           <small>
//                                             ₹{receiptAmount} - {receiptNumber} - {receiptDate}
//                                           </small>
//                                         </div>
//                                       </div>
//                                     </CDropdownItem>
//                                   );
//                                 })}
//                               </CDropdownMenu>
//                             </CDropdown>
//                           ) : receiptsFetched[subdealer._id] ? (
//                             <span className="text-muted">No receipts</span>
//                           ) : (
//                             <CButton
//                               size="sm"
//                               color="light"
//                               onClick={() => fetchReceiptsForSubdealer(subdealer._id)}
//                               disabled={isLoading}
//                             >
//                               <CIcon icon={cilCloudDownload} className="me-1" />
//                               Load Receipts
//                             </CButton>
//                           )}
//                         </CTableDataCell>
                        
//                         {canViewOnAccount && (
//                           <CTableDataCell>
//                             <CButton 
//                               size="sm" 
//                               className="action-btn"
//                               onClick={() => handleViewLedger(subdealer)}
//                             >
//                               <CIcon icon={cilPrint} className='icon'/> View Ledger
//                             </CButton>
//                           </CTableDataCell>
//                         )}
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//           {renderPagination()}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default OnAccountBalance;






import config from 'src/config';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  React,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance,
  showError,
  Link
} from 'src/utils/tableImports';
import tvsLogo from '../../../assets/images/logo.png';
import CIcon from '@coreui/icons-react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CAlert
} from '@coreui/react';
import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage,
  canCreateInPage
} from '../../../utils/modulePermissions';
import { cilPlus, cilPrint, cilCloudDownload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import QRCode from 'qrcode';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const OnAccountBalance = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions, user: authUser } = useAuth();
  
  // ============ PAGINATION STATES ============
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: '',
    hasNext: false,
    hasPrev: false
  });

  // Debounce timer for search
  const searchTimer = React.useRef(null);
  
  // ============ RECEIPTS FETCHING STATES ============
  const [receiptsData, setReceiptsData] = useState({});
  const [loadingReceipts, setLoadingReceipts] = useState({});
  const [receiptsFetched, setReceiptsFetched] = useState({});
  
  // Check if user has SUBDEALER role
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
  // Get subdealer ID from user data if user is a subdealer
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;
  
  // Page-level permission checks for OnAccount Balance page under Subdealer Account module
  const hasOnAccountView = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE, 
    ACTIONS.VIEW
  );
  
  const hasOnAccountCreate = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE, 
    ACTIONS.CREATE
  );

  // Using convenience functions for cleaner code
  const canViewOnAccount = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);
  const canCreateOnAccount = canCreateInPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);
  
  useEffect(() => {
    if (!canViewOnAccount) {
      showError('You do not have permission to view OnAccount Balance');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewOnAccount]);

  // Fetch data with pagination
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    if (!canViewOnAccount) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Add search parameter if provided
      if (search) {
        params.append('search', search);
      }
      
      const response = await axiosInstance.get(`/subdealers/financials/all?${params.toString()}`);
      
      if (response.data.status === 'success') {
        let subdealers = response.data.data.subdealers || [];
        const paginationInfo = response.data.data.pagination || {
          total: subdealers.length,
          pages: 1,
          page: page,
          limit: limit,
          hasNext: false,
          hasPrev: false
        };
        
        // Filter by subdealer ID if user is a subdealer
        if (isSubdealer && userSubdealerId) {
          subdealers = subdealers.filter(subdealer => 
            subdealer._id === userSubdealerId
          );
          // Recalculate pagination after filtering
          paginationInfo.total = subdealers.length;
          paginationInfo.pages = Math.ceil(subdealers.length / limit);
          paginationInfo.hasNext = page < paginationInfo.pages;
          paginationInfo.hasPrev = page > 1;
        }

        setPagination({
          docs: subdealers,
          total: paginationInfo.total,
          pages: paginationInfo.pages,
          currentPage: paginationInfo.page || page,
          limit: limit,
          loading: false,
          search: search,
          hasNext: paginationInfo.hasNext || false,
          hasPrev: paginationInfo.hasPrev || false
        });
        
        setData(subdealers);
        setFilteredData(subdealers);
        
        // Initialize receipts data structure
        const initialReceiptsMap = {};
        subdealers.forEach(subdealer => {
          initialReceiptsMap[subdealer._id] = [];
        });
        setReceiptsData(initialReceiptsMap);
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
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

  // ============ FETCH RECEIPTS FOR SUBDEALER ============
  const fetchReceiptsForSubdealer = useCallback(async (subdealerId) => {
    if (receiptsFetched[subdealerId] || loadingReceipts[subdealerId]) {
      return;
    }

    try {
      setLoadingReceipts(prev => ({ ...prev, [subdealerId]: true }));
      
      const response = await axiosInstance.get(`/subdealersonaccount/${subdealerId}/on-account/receipts`);
      
      let receipts = [];
      
      // Handle both new and old API response structures
      if (response.data && response.data.data && response.data.data.entries) {
        // New structure - filter for credit entries (receipts)
        receipts = response.data.data.entries.filter(entry => 
          entry.type === 'CREDIT' || entry.credit > 0
        ) || [];
      } else if (response.data && response.data.docs) {
        // Old structure
        receipts = response.data.docs || [];
      }
      
      setReceiptsData(prev => ({
        ...prev,
        [subdealerId]: receipts
      }));
      
      setReceiptsFetched(prev => ({
        ...prev,
        [subdealerId]: true
      }));
    } catch (error) {
      console.error(`Error fetching receipts for subdealer ${subdealerId}:`, error);
      setReceiptsData(prev => ({
        ...prev,
        [subdealerId]: []
      }));
      setReceiptsFetched(prev => ({
        ...prev,
        [subdealerId]: true
      }));
    } finally {
      setLoadingReceipts(prev => ({ ...prev, [subdealerId]: false }));
    }
  }, [receiptsFetched, loadingReceipts]);

  // ============ PRINT RECEIPT FUNCTION ============
  const printSubdealerReceipt = async (receiptId) => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/receipts/${receiptId}`);
      const receiptData = response.data.data;
      
      // Format dates
      const receivedDate = receiptData.receivedDateFormatted || 
                          new Date(receiptData.receivedDate || receiptData.createdAt).toLocaleDateString('en-GB');
      
      const currentDate = new Date().toLocaleDateString('en-GB');
      
      // Generate QR Code
      const qrText = `GANDHI MOTORS PVT LTD
Subdealer: ${receiptData.subdealer?.name || 'N/A'}
Receipt No: ${receiptData.refNumber || receiptData._id}
Amount: ₹${receiptData.amount || 0}
Payment Mode: ${receiptData.paymentMode || 'Cash'}
Reference: ${receiptData.refNumber || 'N/A'}
Date: ${receivedDate}`;

      let qrCodeImage = '';
      try {
        qrCodeImage = await QRCode.toDataURL(qrText, {
          width: 150,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
        qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
            <rect width="150" height="150" fill="white"/>
            <rect x="10" y="10" width="130" height="130" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
            <text x="75" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">QR CODE</text>
            <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${receiptData.refNumber || ''}</text>
          </svg>
        `);
      }

      const receiptHTML = generateReceiptHTML(receiptData, qrCodeImage, receivedDate, currentDate);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };
      
    } catch (err) {
      console.error('Error fetching receipt details:', err);
      showError('Failed to load receipt. Please try again.');
    }
  };

  // ============ GENERATE RECEIPT HTML ============
  const generateReceiptHTML = (receiptData, qrCodeImage, receivedDate, currentDate) => {
    const receiptNumber = receiptData.refNumber || receiptData._id || 'N/A';
    const subdealerName = receiptData.subdealer?.name || 'N/A';
    const amount = receiptData.amount || 0;
    const paymentMode = receiptData.paymentMode || 'Cash';
    const remark = receiptData.remark || '';
    const branch = receiptData.branch || {};
    const receivedByName = receiptData.receivedByName || receiptData.receivedBy?.name || 'System';
    const approvalStatus = receiptData.approvalStatus || 'Pending';
    
    // Format amount in words (simplified version)
    const amountInWords = numberToWordsSimple(amount);

    return `<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${receiptNumber}</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: #333;
    }
    .page {
      width: 210mm;
      margin: 0 auto;
    }
    .receipt-copy {
      height: auto;
      min-height: 130mm;
      page-break-inside: avoid;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      align-items: flex-start;
    }
    .header-left {
      width: 60%;
    }
    .header-right {
      width: 40%;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo-qr-container {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-end;
      margin-bottom: 5px;
      width: 100%;
    }
    .logo {
      height: 50px;
    }
    .qr-code-small {
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 12px;
      line-height: 1.2;
    }
    .dealer-name {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 3px 0;
    }
    .customer-info-container {
      display: flex;
      font-size: 12px;
      margin: 10px 0;
    }
    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 2mm 0;
      line-height: 1.2;
    }
    .divider {
      border-top: 2px solid #AAAAAA;
      margin: 3mm 0;
    }
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 8px;
      margin: 10px 0;
      font-size: 12px;
    }
    .payment-info-box {
      margin: 10px 0;
    }
    .signature-box {
      margin-top: 15mm;
      font-size: 10pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 40mm;
      display: inline-block;
      margin: 0 5mm;
    }
    .cutting-line {
      border-top: 2px dashed #333;
      margin: 15mm 0 10mm 0;
      text-align: center;
      position: relative;
    }
    .cutting-line::before {
      content: "✂ Cut Here ✂";
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0 10px;
      font-size: 12px;
      color: #666;
    }
    .note {
      padding: 1px;
      margin: 2px;
      font-size: 11px;
    }
    .amount-in-words {
      font-style: italic;
      margin-top: 8px;
      padding: 5px;
      font-size: 12px;
      border-top: 1px dashed #ccc;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
      color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
      border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
    }
    .footer-note {
      font-size: 9px;
      color: #777;
      text-align: center;
      margin-top: 5mm;
    }
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      body {
        padding: 0;
      }
      .receipt-copy {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- FIRST COPY -->
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik - 422101<br>
            Phone: 7498903672<br>
            GSTIN: ${branch.gst_number || '27AACCG1234E1Z5'}<br>
            ${branch.name || 'GANDHI TVS NASHIK'}
          </div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
            ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
          </div>
          <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
        </div>
      </div>
      
      <div class="divider"></div>

      <div class="receipt-info">
        <div><strong>SUBDEALER PAYMENT RECEIPT</strong></div>
        <div><strong>Receipt Date:</strong> ${receivedDate}</div>
       
      </div>

      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Subdealer Name:</strong> ${subdealerName}</div>
          <div class="customer-info-row"><strong>Receipt Number:</strong> ${receiptNumber}</div>
          <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Reference No:</strong> ${receiptData.refNumber || '-'}</div>
          <div class="customer-info-row"><strong>Received By:</strong> ${receivedByName}</div>
          <div class="customer-info-row"><strong>Bank:</strong> ${receiptData.bank?.name || '-'}</div>
        </div>
      </div>

      <div class="payment-info-box">
        <div class="receipt-info">
          <div style="display: flex; justify-content: space-between;">
            <span><strong>Receipt Amount:</strong></span>
            <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
          </div>
          ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
        </div>
        
        <div class="amount-in-words">
          <strong>Amount in words:</strong> ${amountInWords} Only
        </div>
      </div>

      <div class="note">
        <strong>Notes:</strong> This is a system generated receipt for On-Account payment.
      </div>
      
      <div class="divider"></div>

      <div class="signature-box">
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Subdealer's Signature</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Authorised Signatory</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Accountant</div>
          </div>
        </div>
      </div>
      
      <div class="footer-note">
        This is a computer generated receipt - valid without signature
      </div>
    </div>

    <!-- CUTTING LINE -->
    <div class="cutting-line"></div>

    <!-- SECOND COPY (DUPLICATE) -->
    <div class="receipt-copy">
      <div class="header-container">
        <div class="header-left">
          <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik - 422101<br>
            Phone: 7498903672<br>
            GSTIN: ${branch.gst_number || '27AACCG1234E1Z5'}<br>
            ${branch.name || 'GANDHI TVS NASHIK'}
          </div>
        </div>
        <div class="header-right">
          <div class="logo-qr-container">
            <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
            ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
          </div>
          <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
        </div>
      </div>
      
      <div class="divider"></div>

      <div class="receipt-info">
        <div><strong>SUBDEALER PAYMENT RECEIPT (DUPLICATE)</strong></div>
        <div><strong>Receipt Date:</strong> ${receivedDate}</div>
      
      </div>

      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Subdealer Name:</strong> ${subdealerName}</div>
          <div class="customer-info-row"><strong>Receipt Number:</strong> ${receiptNumber}</div>
          <div class="customer-info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Reference No:</strong> ${receiptData.refNumber || '-'}</div>
          <div class="customer-info-row"><strong>Received By:</strong> ${receivedByName}</div>
          <div class="customer-info-row"><strong>Bank:</strong> ${receiptData.bank?.name || '-'}</div>
        </div>
      </div>

      <div class="payment-info-box">
        <div class="receipt-info">
          <div style="display: flex; justify-content: space-between;">
            <span><strong>Receipt Amount:</strong></span>
            <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
          </div>
          ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
        </div>
        
        <div class="amount-in-words">
          <strong>Amount in words:</strong> ${amountInWords} Only
        </div>
      </div>

      <div class="note">
        <strong>Notes:</strong> This is a system generated receipt for On-Account payment.
      </div>
      
      <div class="divider"></div>

      <div class="signature-box">
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Subdealer's Signature</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Authorised Signatory</div>
          </div>
          <div style="text-align:center; width: 30%;">
            <div class="signature-line"></div>
            <div>Accountant</div>
          </div>
        </div>
      </div>
      
      <div class="footer-note">
        This is a computer generated receipt - valid without signature
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // ============ SIMPLE NUMBER TO WORDS FUNCTION ============
  const numberToWordsSimple = (num) => {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWords = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };
    
    return numToWords(Math.floor(num)) + (num % 1 ? ' point ' + num.toString().split('.')[1] : '');
  };

  const handleViewLedger = async (subdealer) => {
    try {
      const res = await axiosInstance.get(`/subdealersonaccount/${subdealer._id}/on-account/receipts`);
      
      // Handle both old and new API response structures
      let ledgerEntries = [];
      let subdealerBookings = [];
      let accessoryBillings = [];
      let onAccountBalance = 0;
      let totalOnAccountBalance = 0;
      
      if (res.data && res.data.data && res.data.data.entries) {
        // New structure (from your API response)
        const responseData = res.data.data;
        ledgerEntries = responseData.entries || [];
        onAccountBalance = responseData.totals?.onAccountBalance || 0;
        totalOnAccountBalance = onAccountBalance;
        
        // Extract credit entries (receipts) and debit entries (bookings)
        const creditEntries = ledgerEntries.filter(entry => entry.type === 'CREDIT' || entry.credit > 0);
        const debitEntries = ledgerEntries.filter(entry => entry.type === 'DEBIT' || entry.debit > 0);
        
        // Process debit entries as subdealer bookings
        subdealerBookings = debitEntries.map(entry => ({
          ...entry,
          // Map to expected booking structure
          customerDetails: {
            salutation: '',
            name: entry.subdealerName || subdealer.name || ''
          },
          bookingNumber: entry.receiptNo || entry.id,
          discountedAmount: entry.debit,
          totalAmount: entry.debit,
          amount: entry.debit,
          remark: entry.remark || entry.description,
          createdAt: entry.timestamp,
          bookingDate: entry.date
        }));
        
        // Use credit entries as ledger data
        ledgerEntries = creditEntries;
      } else if (res.data && res.data.docs) {
        // Old structure
        ledgerEntries = res.data.docs || [];
        subdealerBookings = res.data.subdealerBookings || [];
        accessoryBillings = res.data.accessoryBillings || [];
        totalOnAccountBalance = res.data.totalOnAccountBalance || 0;
        onAccountBalance = totalOnAccountBalance;
      }
      
      const ledgerUrl = `${config.baseURL}/ledger.html?ledgerId=${subdealer._id}`;

      let totalCredit = 0;
      let totalDebit = 0;
      let runningBalance = 0;

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
              .no-data {
                text-align: center;
                padding: 20mm;
                color: #666;
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
                  ${ledgerEntries.length > 0 ? ledgerEntries
                    .map((entry) => {
                      // Check if this is a new structure entry or old structure receipt
                      const isNewStructure = entry.type !== undefined;
                      
                      let receiptCredit = 0;
                      let receiptDate = '';
                      let receiptRemark = '';
                      let receiptRefNumber = '';
                      let receiptPaymentMode = '';
                      
                      if (isNewStructure) {
                        // New structure
                        receiptCredit = entry.credit || 0;
                        receiptDate = entry.date || new Date(entry.timestamp).toLocaleDateString('en-GB');
                        receiptRemark = entry.remark || entry.description || '';
                        receiptRefNumber = entry.receiptNo || entry.id || '';
                        receiptPaymentMode = entry.paymentMode || 'N/A';
                      } else {
                        // Old structure
                        receiptCredit = entry.amount || 0;
                        receiptDate = new Date(entry.createdAt).toLocaleDateString('en-GB');
                        receiptRemark = entry.remark || '';
                        receiptRefNumber = entry.refNumber || '';
                        receiptPaymentMode = entry.paymentMode || 'N/A';
                      }
                      
                      // Calculate running balance (credit increases balance)
                      runningBalance += receiptCredit;
                      totalCredit += receiptCredit;
                      
                      let rows = '';
                      
                      // Add receipt row
                      rows += `
                        <tr>
                          <td>${receiptDate}</td>
                          <td>
                            ${isNewStructure ? 'On-Account Payment' : 'OnAccount Receipt'}<br>
                            Mode: ${receiptPaymentMode}<br>
                            ${receiptRemark}
                          </td>
                          <td>${receiptRefNumber}</td>
                          <td class="text-right">${receiptCredit.toLocaleString('en-IN')}</td>
                          <td class="text-right">0</td>
                          <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                        </tr>
                      `;

                      // Only process allocations for old structure (new structure doesn't have allocations)
                      if (!isNewStructure && entry.allocations && entry.allocations.length > 0) {
                        entry.allocations.forEach((allocation) => {
                          const allocationDebit = allocation.amount || 0;
                          runningBalance -= allocationDebit;
                          totalDebit += allocationDebit;

                          rows += `
                            <tr>
                              <td>${new Date(allocation.allocatedAt).toLocaleDateString('en-GB')}</td>
                              <td>
                                Allocation to Booking<br>
                                Customer: ${allocation.booking?.customerDetails?.name || 'N/A'}<br>
                                Booking No: ${allocation.booking?.bookingNumber || 'N/A'}
                              </td>
                              <td>${allocation.ledger?.transactionReference || entry.refNumber || ''}</td>
                              <td class="text-right">0</td>
                              <td class="text-right">${allocationDebit.toLocaleString('en-IN')}</td>
                              <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                            </tr>
                          `;
                        });
                      }

                      return rows;
                    })
                    .join('') : 
                    `<tr><td colspan="6" class="no-data">No receipt data available</td></tr>`
                  }

                  ${subdealerBookings.length > 0 ? subdealerBookings
                    .map((booking) => {
                      const isNewStructure = booking.type !== undefined;
                      
                      let bookingDebit = 0;
                      let bookingDate = '';
                      let customerName = '';
                      let bookingRemark = '';
                      let bookingRefNumber = '';
                      
                      if (isNewStructure) {
                        // New structure (already mapped above)
                        bookingDebit = booking.discountedAmount || booking.debit || 0;
                        bookingDate = booking.date || new Date(booking.timestamp).toLocaleDateString('en-GB');
                        customerName = booking.customerDetails?.name || booking.subdealerName || 'N/A';
                        bookingRemark = booking.remark || booking.description || '';
                        bookingRefNumber = booking.bookingNumber || booking.receiptNo || booking.id || '';
                      } else {
                        // Old structure
                        bookingDebit = booking.discountedAmount || booking.totalAmount || booking.amount || 0;
                        bookingDate = new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-GB');
                        customerName = booking.customerDetails?.name || 'N/A';
                        bookingRemark = booking.remark || '';
                        bookingRefNumber = booking.bookingNumber || booking._id || '';
                      }
                      
                      runningBalance -= bookingDebit;
                      totalDebit += bookingDebit;

                      return `
                        <tr>
                          <td>${bookingDate}</td>
                          <td>
                            Booking Created<br>
                            Customer: ${customerName}<br>
                            ${bookingRemark}
                          </td>
                          <td>${bookingRefNumber}</td>
                          <td class="text-right">0</td>
                          <td class="text-right">${bookingDebit.toLocaleString('en-IN')}</td>
                          <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                        </tr>
                      `;
                    })
                    .join('') : ''
                  }
                  
                  ${accessoryBillings.length > 0 ? accessoryBillings
                    .map((accessory) => {
                      const accessoryDebit = accessory.amount || 0;
                      runningBalance -= accessoryDebit;
                      totalDebit += accessoryDebit;

                      const cashLocationName = accessory.cashLocation?.name || '';
                      const paymentMode = accessory.paymentMode || 'N/A';
                      const remark = accessory.remark || 'Accessory Billing';

                      return `
                        <tr>
                          <td>${new Date(accessory.createdAt).toLocaleDateString('en-GB')}</td>
                          <td>
                            ${remark}<br>
                            ${cashLocationName} ${paymentMode}
                          </td>
                          <td>${accessory.transactionReference || accessory._id || ''}</td>
                          <td class="text-right">0</td>
                          <td class="text-right">${accessoryDebit.toLocaleString('en-IN')}</td>
                          <td class="text-right">${runningBalance.toLocaleString('en-IN')}</td>
                        </tr>
                      `;
                    })
                    .join('') : ''
                  }

                  <tr>
                    <td colspan="3" class="text-left"><strong>OnAccount Balance</strong></td>
                    <td></td>
                      <td></td>
                    <td class="text-right"><strong>${onAccountBalance.toLocaleString('en-IN') || '0'}</strong></td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-left"><strong>Total</strong></td>
                    <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
                    <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
                    <td class="text-right"><strong>${runningBalance.toLocaleString('en-IN')}</strong></td>
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

  if (!canViewOnAccount) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view OnAccount Balance.
      </div>
    );
  }

  if (pagination.loading && pagination.docs.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
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
      <div className='title'>OnAccount Balance</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {/* "New Balance" button should not be visible to subdealers */}
            {canCreateOnAccount && !isSubdealer && (
              <Link to="/subdealer-account/add-amount">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Balance
                </CButton>
              </Link>
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
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search subdealers..."
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
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Total Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Total Received</CTableHeaderCell>
                  <CTableHeaderCell>Total Balance</CTableHeaderCell>
                  <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
                  <CTableHeaderCell>Receipts</CTableHeaderCell>
                  {canViewOnAccount && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={canViewOnAccount ? "9" : "8"} className="text-center">
                      {pagination.search 
                        ? 'No matching subdealers found' 
                        : isSubdealer 
                          ? 'No on-account balance data available for your account' 
                          : 'No subdealers available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((subdealer, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    const hasReceipts = receiptsFetched[subdealer._id] && receiptsData[subdealer._id]?.length > 0;
                    const isLoading = loadingReceipts[subdealer._id];
                    const receipts = receiptsData[subdealer._id] || [];
                    
                    // Sort receipts by date (newest first)
                    const sortedReceipts = [...receipts].sort((a, b) => {
                      const dateA = new Date(a.timestamp || a.receivedDate || a.createdAt || 0);
                      const dateB = new Date(b.timestamp || b.receivedDate || b.createdAt || 0);
                      return dateB - dateA; // descending (newest first)
                    });
                    
                    return (
                      <CTableRow key={subdealer._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{subdealer.name}</CTableDataCell>
                        <CTableDataCell>{subdealer.financials?.bookingSummary?.totalBookings || 0}</CTableDataCell>
                        <CTableDataCell>₹{(subdealer.financials?.bookingSummary?.totalBookingAmount || 0).toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>₹{(subdealer.financials?.bookingSummary?.totalReceivedAmount || 0).toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>₹{(subdealer.financials?.bookingSummary?.totalBalanceAmount || 0).toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>₹{(subdealer.financials?.onAccountSummary?.totalBalance || 0).toLocaleString('en-IN')}</CTableDataCell>
                        
                        {/* Receipts Column */}
                        <CTableDataCell>
                          {isLoading ? (
                            <CSpinner size="sm" color="info" />
                          ) : sortedReceipts.length > 0 ? (
                            <CDropdown>
                              <CDropdownToggle size="sm" color="info" variant="outline">
                                {sortedReceipts.length} Receipt{sortedReceipts.length > 1 ? 's' : ''}
                              </CDropdownToggle>
                              <CDropdownMenu>
                                {sortedReceipts.map((receipt, receiptIndex) => {
                                  // Determine receipt ID and display info
                                  const receiptId = receipt.id || receipt._id;
                                  const receiptNumber = receipt.receiptNo || receipt.refNumber || 'N/A';
                                  const receiptAmount = receipt.credit || receipt.amount || 0;
                                  const receiptDate = receipt.date || 
                                                      (receipt.receivedDateFormatted) || 
                                                      (receipt.receivedDate ? new Date(receipt.receivedDate).toLocaleDateString('en-GB') : '') ||
                                                      (receipt.createdAt ? new Date(receipt.createdAt).toLocaleDateString('en-GB') : '');
                                  
                                  return (
                                    <CDropdownItem 
                                      key={receiptId || receiptIndex} 
                                      onClick={() => printSubdealerReceipt(receiptId)}
                                    >
                                      <div className="d-flex align-items-center">
                                        <CIcon icon={cilPrint} className="me-2" />
                                        <div>
                                          <div><strong>Receipt #{receiptIndex + 1}</strong></div>
                                          <small>
                                            ₹{receiptAmount.toLocaleString('en-IN')} - {receiptNumber} - {receiptDate}
                                          </small>
                                        </div>
                                      </div>
                                    </CDropdownItem>
                                  );
                                })}
                              </CDropdownMenu>
                            </CDropdown>
                          ) : receiptsFetched[subdealer._id] ? (
                            <span className="text-muted">No receipts</span>
                          ) : (
                            <CButton
                              size="sm"
                              color="light"
                              onClick={() => fetchReceiptsForSubdealer(subdealer._id)}
                              disabled={isLoading}
                            >
                              <CIcon icon={cilCloudDownload} className="me-1" />
                              Load Receipts
                            </CButton>
                          )}
                        </CTableDataCell>
                        
                        {canViewOnAccount && (
                          <CTableDataCell>
                            <CButton 
                              size="sm" 
                              className="action-btn"
                              onClick={() => handleViewLedger(subdealer)}
                            >
                              <CIcon icon={cilPrint} className='icon'/> View Ledger
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
          {renderPagination()}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default OnAccountBalance;