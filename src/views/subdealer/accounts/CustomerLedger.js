// // import '../../../css/table.css';
// // import '../../../css/form.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   SearchOutlinedIcon,
// //   getDefaultSearchFields,
// //   useTableFilter,
// //   axiosInstance
// // } from 'src/utils/tableImports';
// // import tvsLogo from '../../../assets/images/logo.png';
// // import config from 'src/config';
// // import { cilPrint } from '@coreui/icons';
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
// //   CTableDataCell,
// //   CAlert
// // } from '@coreui/react';
// // import { showError } from '../../../utils/sweetAlerts';
// // import { useAuth } from '../../../context/AuthContext';
// // import { 
// //   hasSafePagePermission,
// //   MODULES, 
// //   PAGES,
// //   ACTIONS,
// //   canViewPage
// // } from '../../../utils/modulePermissions';

// // const CustomerLedger = () => {
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for Customer Ledger page under Subdealer Account module
// //   const hasCustomerLedgerView = hasSafePagePermission(
// //     permissions, 
// //     MODULES.SUBDEALER_ACCOUNT, 
// //     PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER, 
// //     ACTIONS.VIEW
// //   );

// //   // Using convenience function for cleaner code
// //   const canViewCustomerLedger = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER);

// //   useEffect(() => {
// //     if (!canViewCustomerLedger) {
// //       showError('You do not have permission to view Customer Ledger');
// //       return;
// //     }
    
// //     fetchData();
// //   }, [canViewCustomerLedger]);

// //   const fetchData = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/bookings`);
// //       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');
// //       setData(subdealerBookings);
// //       setFilteredData(subdealerBookings);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const handleViewLedger = async (booking) => {
// //     try {
// //       const res = await axiosInstance.get(`/ledger/report/${booking._id}`);
// //       const ledgerData = res.data.data;
// //       const ledgerUrl = `${config.baseURL}/ledger.html?bookingId=${booking._id}`;

// //       const win = window.open('', '_blank');
// //       win.document.write(`
// //           <!DOCTYPE html>
// //           <html>
// //             <head>
// //               <title>Customer Ledger</title>
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
// //                 <div><strong>Subdealer Name:</strong> ${ledgerData.subdealerDetails?.name || ''}</div>
// //                   <div><strong>Subdealer Address:</strong> ${ledgerData.subdealerDetails?.address || ''}</div>
// //                   <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.name || ''}</div>
// //                   <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
// //                   <div><strong>Customer Address:</strong> ${ledgerData.customerDetails?.address || ''}</div>
// //                   <div><strong>Customer Phone:</strong> ${ledgerData.customerDetails?.phone || ''}</div>
// //                   <div><strong>Chassis No:</strong> ${ledgerData.vehicleDetails?.chassisNo || ''}</div>
// //                   <div><strong>Engine No:</strong> ${ledgerData.vehicleDetails?.engineNo || ''}</div>
// //                   <div><strong>Finance Name:</strong> ${ledgerData.financeDetails?.financer || ''}</div>
// //                 </div>
                
// //                 <table>
// //                   <thead>
// //                     <tr>
// //                       <th width="15%">Date</th>
// //                       <th width="35%">Description</th>
// //                       <th width="15%">Receipt/VC No</th>
// //                       <th width="10%" class="text-right">Credit (₹)</th>
// //                       <th width="10%" class="text-right">Debit (₹)</th>
// //                       <th width="15%" class="text-right">Balance (₹)</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     ${ledgerData.entries
// //                       ?.map(
// //                         (entry) => `
// //                       <tr>
// //                         <td>${entry.date}</td>
// //                         <td>${entry.description || ''}</td>
// //                         <td>${entry.receiptNo || ''}</td>
// //                         <td class="text-right">${entry.credit ? entry.credit.toLocaleString('en-IN') : '-'}</td>
// //                         <td class="text-right">${entry.debit ? entry.debit.toLocaleString('en-IN') : '-'}</td>
// //                         <td class="text-right">${entry.balance ? entry.balance.toLocaleString('en-IN') : '-'}</td>
// //                       </tr>
// //                     `
// //                       )
// //                       .join('')}
// //                     <tr>
// //                       <td colspan="3" class="text-left"><strong>Total</strong></td>
// //                       <td class="text-right"><strong>${ledgerData.totals?.totalCredit?.toLocaleString('en-IN') || '0'}</strong></td>
// //                       <td class="text-right"><strong>${ledgerData.totals?.totalDebit?.toLocaleString('en-IN') || '0'}</strong></td>
// //                       <td class="text-right"><strong>${ledgerData.totals?.finalBalance?.toLocaleString('en-IN') || '0'}</strong></td>
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

// //   const handleSearch = (searchValue) => {
// //     handleFilter(searchValue, getDefaultSearchFields('booking'));
// //   };

// //   if (!canViewCustomerLedger) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Customer Ledger.
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
// //       <div className='title'>Customer Ledger</div>
    
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div>
// //           </div>
// //         </CCardHeader>
        
// //         <CCardBody>
// //           {error && <CAlert color="danger">{error}</CAlert>}
          
// //           <div className="d-flex justify-content-between mb-3">
// //             <div></div>
// //             <div className='d-flex'>
// //               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //               <CFormInput
// //                 type="text"
// //                 className="d-inline-block square-search"
// //                 value={searchTerm}
// //                 onChange={(e) => {
// //                   setSearchTerm(e.target.value);
// //                   handleSearch(e.target.value);
// //                 }}
// //                 // placeholder="Search bookings..."
// //               />
// //             </div>
// //           </div>
          
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
// //                   <CTableHeaderCell>Model Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
// //                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
// //                   <CTableHeaderCell>Total</CTableHeaderCell>
// //                   <CTableHeaderCell>Received</CTableHeaderCell>
// //                   <CTableHeaderCell>Balance</CTableHeaderCell>
// //                   <CTableHeaderCell>Action</CTableHeaderCell>
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {filteredData.length === 0 ? (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan="10" className="text-center">
// //                       No ledger details available
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 ) : (
// //                   filteredData.map((booking, index) => (
// //                     <CTableRow key={index}>
// //                       <CTableDataCell>{index + 1}</CTableDataCell>
// //                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
// //                       <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
// //                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
// //                       <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
// //                       <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>
// //                       <CTableDataCell>{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                       <CTableDataCell>{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                       <CTableDataCell>{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                       <CTableDataCell>
// //                         <CButton 
// //                           size="sm" 
// //                           className="action-btn"
// //                           onClick={() => handleViewLedger(booking)}
// //                         >
// //                           <CIcon icon={cilPrint} className='icon'/> View Ledger
// //                         </CButton>
// //                       </CTableDataCell>
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

// // export default CustomerLedger;










// import '../../../css/table.css';
// import '../../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   SearchOutlinedIcon,
//   getDefaultSearchFields,
//   useTableFilter,
//   axiosInstance
// } from 'src/utils/tableImports';
// import tvsLogo from '../../../assets/images/logo.png';
// import config from 'src/config';
// import { cilPrint } from '@coreui/icons';
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
//   CAlert
// } from '@coreui/react';
// import { showError } from '../../../utils/sweetAlerts';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage
// } from '../../../utils/modulePermissions';

// const CustomerLedger = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { permissions, user: authUser } = useAuth();

//   // Check if user is a subdealer
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   // Page-level permission checks for Customer Ledger page under Subdealer Account module
//   const hasCustomerLedgerView = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER, 
//     ACTIONS.VIEW
//   );

//   // Using convenience function for cleaner code
//   const canViewCustomerLedger = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER);

//   useEffect(() => {
//     if (!canViewCustomerLedger) {
//       showError('You do not have permission to view Customer Ledger');
//       return;
//     }
    
//     fetchData();
//   }, [canViewCustomerLedger]);

//   const fetchData = async () => {
//     try {
//       let url = `/bookings`;
      
//       // If user is a subdealer, filter by their subdealer ID
//       if (isSubdealer && userSubdealerId) {
//         url += `?subdealer=${userSubdealerId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');
//       setData(subdealerBookings);
//       setFilteredData(subdealerBookings);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleViewLedger = async (booking) => {
//     try {
//       const res = await axiosInstance.get(`/ledger/report/${booking._id}`);
//       const ledgerData = res.data.data;
//       const ledgerUrl = `${config.baseURL}/ledger.html?bookingId=${booking._id}`;

//       const win = window.open('', '_blank');
//       win.document.write(`
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <title>Customer Ledger</title>
//               <style>
//                 @page {
//                   size: A4;
//                   margin: 15mm 10mm;
//                 }
//                 body {
//                   font-family: Arial;
//                   width: 100%;
//                   margin: 0;
//                   padding: 0;
//                   font-size: 14px;
//                   line-height: 1.3;
//                   font-family: Courier New;
//                 }
//                 .container {
//                   width: 190mm;
//                   margin: 0 auto;
//                   padding: 5mm;
//                 }
//                 .header-container {
//                   display: flex;
//                   justify-content:space-between;
//                   margin-bottom: 3mm;
//                 }
//                 .header-text{
//                   font-size:20px;
//                   font-weight:bold;
//                 }
//                 .logo {
//                   width: 30mm;
//                   height: auto;
//                   margin-right: 5mm;
//                 } 
//                 .header {
//                   text-align: left;
//                 }
//                 .divider {
//                   border-top: 2px solid #AAAAAA;
//                   margin: 3mm 0;
//                 }
//                 .header h2 {
//                   margin: 2mm 0;
//                   font-size: 12pt;
//                   font-weight: bold;
//                 }
//                 .header div {
//                   font-size: 14px;
//                 }
//                 .customer-info {
//                   display: grid;
//                   grid-template-columns: repeat(2, 1fr);
//                   gap: 2mm;
//                   margin-bottom: 5mm;
//                   font-size: 14px;
//                 }
//                 .customer-info div {
//                   display: flex;
//                 }
//                 .customer-info strong {
//                   min-width: 30mm;
//                   display: inline-block;
//                 }
//                 table {
//                   width: 100%;
//                   border-collapse: collapse;
//                   margin-bottom: 5mm;
//                   font-size: 14px;
//                   page-break-inside: avoid;
//                 }
//                 th, td {
//                   border: 1px solid #000;
//                   padding: 2mm;
//                   text-align: left;
//                 }
//                 th {
//                   background-color: #f0f0f0;
//                   font-weight: bold;
//                 }
//                 .footer {
//                   margin-top: 10mm;
//                   display: flex;
//                   justify-content: space-between;
//                   align-items: flex-end;
//                   font-size: 14px;
//                 }
//                 .footer-left {
//                   text-align: left;
//                 }
//                 .footer-right {
//                   text-align: right;
//                 }
//                 .qr-code {
//                   width: 35mm;
//                   height: 35mm;
//                 }
//                 .text-right {
//                   text-align: right;
//                 }
//                 .text-left {
//                   text-align: left;
//                 }
//                 .text-center {
//                   text-align: center;
//                 }
//                 @media print {
//                   body {
//                     width: 190mm;
//                     height: 277mm;
//                   }
//                   .no-print {
//                     display: none;
//                   }
//                 }
//               </style>
//             </head>
//             <body>
//               <div class="container">
//                 <div class="header-container">
//                   <img src="${tvsLogo}" class="logo" alt="TVS Logo">
//                   <div class="header-text"> GANDHI TVS</div>
//                 </div>
//                 <div class="header">
//                   <div>
//                     Authorised Main Dealer: TVS Motor Company Ltd.<br>
//                     Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//                     Upnagar, Nashik Road, Nashik - 422101<br>
//                     Phone: 7498903672
//                   </div>
//                 </div>
//                 <div class="divider"></div>
//                 <div class="customer-info">
//                 <div><strong>Subdealer Name:</strong> ${ledgerData.subdealerDetails?.name || ''}</div>
//                   <div><strong>Subdealer Address:</strong> ${ledgerData.subdealerDetails?.address || ''}</div>
//                   <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.name || ''}</div>
//                   <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
//                   <div><strong>Customer Address:</strong> ${ledgerData.customerDetails?.address || ''}</div>
//                   <div><strong>Customer Phone:</strong> ${ledgerData.customerDetails?.phone || ''}</div>
//                   <div><strong>Chassis No:</strong> ${ledgerData.vehicleDetails?.chassisNo || ''}</div>
//                   <div><strong>Engine No:</strong> ${ledgerData.vehicleDetails?.engineNo || ''}</div>
//                   <div><strong>Finance Name:</strong> ${ledgerData.financeDetails?.financer || ''}</div>
//                 </div>
                
//                 <table>
//                   <thead>
//                     <tr>
//                       <th width="15%">Date</th>
//                       <th width="35%">Description</th>
//                       <th width="15%">Receipt/VC No</th>
//                       <th width="10%" class="text-right">Credit (₹)</th>
//                       <th width="10%" class="text-right">Debit (₹)</th>
//                       <th width="15%" class="text-right">Balance (₹)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${ledgerData.entries
//                       ?.map(
//                         (entry) => `
//                       <tr>
//                         <td>${entry.date}</td>
//                         <td>${entry.description || ''}</td>
//                         <td>${entry.receiptNo || ''}</td>
//                         <td class="text-right">${entry.credit ? entry.credit.toLocaleString('en-IN') : '-'}</td>
//                         <td class="text-right">${entry.debit ? entry.debit.toLocaleString('en-IN') : '-'}</td>
//                         <td class="text-right">${entry.balance ? entry.balance.toLocaleString('en-IN') : '-'}</td>
//                       </tr>
//                     `
//                       )
//                       .join('')}
//                     <tr>
//                       <td colspan="3" class="text-left"><strong>Total</strong></td>
//                       <td class="text-right"><strong>${ledgerData.totals?.totalCredit?.toLocaleString('en-IN') || '0'}</strong></td>
//                       <td class="text-right"><strong>${ledgerData.totals?.totalDebit?.toLocaleString('en-IN') || '0'}</strong></td>
//                       <td class="text-right"><strong>${ledgerData.totals?.finalBalance?.toLocaleString('en-IN') || '0'}</strong></td>
//                     </tr>
//                   </tbody>
//                 </table>
                
//                 <div class="footer">
//                   <div class="footer-left">
//                     <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}" 
//                          class="qr-code" 
//                          alt="QR Code" />
//                   </div>
//                   <div class="footer-right">
//                     <p>For, Gandhi TVS</p>
//                     <p>Authorised Signatory</p>
//                   </div>
//                 </div>
//               </div>
              
//               <script>
//                 window.onload = function() {
//                   setTimeout(() => {
//                     window.print();
//                   }, 300);
//                 };
//               </script>
//             </body>
//           </html>
//         `);
//     } catch (err) {
//       console.error('Error fetching ledger:', err);
//       setError('Failed to load ledger. Please try again.');
//     }
//   };

//   const handleSearch = (searchValue) => {
//     handleFilter(searchValue, getDefaultSearchFields('booking'));
//   };

//   if (!canViewCustomerLedger) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Customer Ledger.
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
//       <div className='title'>Customer Ledger</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
         
//         </CCardHeader>
        
//         <CCardBody>
//           {error && <CAlert color="danger">{error}</CAlert>}
          
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   handleSearch(e.target.value);
//                 }}
//                 // placeholder="Search bookings..."
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="10" className="text-center">
//                       {isSubdealer 
//                         ? "No customer ledgers available for your account" 
//                         : "No ledger details available"}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredData.map((booking, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.customerDetails?.name || ''}
                       
//                       </CTableDataCell>
//                       <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>
//                         <CButton 
//                           size="sm" 
//                           className="action-btn"
//                           onClick={() => handleViewLedger(booking)}
//                         >
//                           <CIcon icon={cilPrint} className='icon'/> View Ledger
//                         </CButton>
//                       </CTableDataCell>
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

// export default CustomerLedger;






import '../../../css/table.css';
import '../../../css/form.css';
import {
  React,
  useState,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance
} from 'src/utils/tableImports';
import tvsLogo from '../../../assets/images/logo.png';
import config from 'src/config';
import { cilPrint, cilChevronLeft, cilChevronRight } from '@coreui/icons';
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
  CAlert,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import { showError } from '../../../utils/sweetAlerts';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage
} from '../../../utils/modulePermissions';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const CustomerLedger = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions, user: authUser } = useAuth();

  // Pagination states
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: ''
  });

  // Debounce timer for search
  const searchTimer = React.useRef(null);

  // Check if user is a subdealer
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;
  
  // Page-level permission checks for Customer Ledger page under Subdealer Account module
  const hasCustomerLedgerView = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER, 
    ACTIONS.VIEW
  );

  // Using convenience function for cleaner code
  const canViewCustomerLedger = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER);

  useEffect(() => {
    if (!canViewCustomerLedger) {
      showError('You do not have permission to view Customer Ledger');
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
  }, [canViewCustomerLedger]);

  // Fetch data with pagination and search
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    if (!canViewCustomerLedger) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('bookingType', 'SUBDEALER');
      params.append('page', page);
      params.append('limit', limit);
      
      // Add search parameter if provided
      if (search) {
        params.append('search', search);
      }
      
      // If user is a subdealer, filter by their subdealer ID
      if (isSubdealer && userSubdealerId) {
        params.append('subdealer', userSubdealerId);
      }
      
      const url = `/bookings?${params.toString()}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        const subdealerBookings = response.data.data.bookings || [];
        const total = response.data.data.total || subdealerBookings.length;
        const pages = response.data.data.pages || Math.ceil(total / limit);

        setPagination({
          docs: subdealerBookings,
          total: total,
          pages: pages,
          currentPage: response.data.data.currentPage || page,
          limit: limit,
          loading: false,
          search: search
        });
        
        setData(subdealerBookings);
        setFilteredData(subdealerBookings);
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
      setData([]);
      setFilteredData([]);
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

  const handleViewLedger = async (booking) => {
    try {
      const res = await axiosInstance.get(`/ledger/report/${booking._id}`);
      const ledgerData = res.data.data;
      const ledgerUrl = `${config.baseURL}/ledger.html?bookingId=${booking._id}`;

      const win = window.open('', '_blank');
      win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Customer Ledger</title>
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
                <div><strong>Subdealer Name:</strong> ${ledgerData.subdealerDetails?.name || ''}</div>
                  <div><strong>Subdealer Address:</strong> ${ledgerData.subdealerDetails?.address || ''}</div>
                  <div><strong>Customer Name:</strong> ${ledgerData.customerDetails?.name || ''}</div>
                  <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
                  <div><strong>Customer Address:</strong> ${ledgerData.customerDetails?.address || ''}</div>
                  <div><strong>Customer Phone:</strong> ${ledgerData.customerDetails?.phone || ''}</div>
                  <div><strong>Chassis No:</strong> ${ledgerData.vehicleDetails?.chassisNo || ''}</div>
                  <div><strong>Engine No:</strong> ${ledgerData.vehicleDetails?.engineNo || ''}</div>
                  <div><strong>Finance Name:</strong> ${ledgerData.financeDetails?.financer || ''}</div>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th width="15%">Date</th>
                      <th width="35%">Description</th>
                      <th width="15%">Receipt/VC No</th>
                      <th width="10%" class="text-right">Credit (₹)</th>
                      <th width="10%" class="text-right">Debit (₹)</th>
                      <th width="15%" class="text-right">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ledgerData.entries
                      ?.map(
                        (entry) => `
                      <tr>
                        <td>${entry.date}</td>
                        <td>${entry.description || ''}</td>
                        <td>${entry.receiptNo || ''}</td>
                        <td class="text-right">${entry.credit ? entry.credit.toLocaleString('en-IN') : '-'}</td>
                        <td class="text-right">${entry.debit ? entry.debit.toLocaleString('en-IN') : '-'}</td>
                        <td class="text-right">${entry.balance ? entry.balance.toLocaleString('en-IN') : '-'}</td>
                      </tr>
                    `
                      )
                      .join('')}
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${ledgerData.totals?.totalCredit?.toLocaleString('en-IN') || '0'}</strong></td>
                      <td class="text-right"><strong>${ledgerData.totals?.totalDebit?.toLocaleString('en-IN') || '0'}</strong></td>
                      <td class="text-right"><strong>${ledgerData.totals?.finalBalance?.toLocaleString('en-IN') || '0'}</strong></td>
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

  if (!canViewCustomerLedger) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Customer Ledger.
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
      <div className='title'>Customer Ledger</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className="text-muted">
            Total Records: {pagination.total || 0}
          </div>
        </CCardHeader>
        
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search by booking, customer, chassis..."
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
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="10" className="text-center">
                      {pagination.search 
                        ? 'No matching customer ledgers found' 
                        : isSubdealer 
                          ? "No customer ledgers available for your account" 
                          : "No ledger details available"}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((booking, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={booking._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
                        <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                        <CTableDataCell>
                          {booking.customerDetails?.name || ''}
                        </CTableDataCell>
                        <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>
                        <CTableDataCell>₹{(booking.discountedAmount || 0).toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>₹{(booking.receivedAmount || 0).toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>₹{(booking.balanceAmount || 0).toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handleViewLedger(booking)}
                          >
                            <CIcon icon={cilPrint} className='icon'/> View Ledger
                          </CButton>
                        </CTableDataCell>
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

export default CustomerLedger;