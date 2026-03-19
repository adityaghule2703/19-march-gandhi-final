// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   Menu,
// //   MenuItem,
// //   useTableFilter,
// //   usePagination,
// //   axiosInstance,
// //   showError
// // } from '../../utils/tableImports';
// // import tvsLogo from '../../assets/images/logo.png';
// // import '../../css/invoice.css';
// // import config from '../../config';
// // import ExchangeLedgerModel from './ExchangeLedgerModel';
// // import {
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
// //   CModal,
// //   CModalHeader,
// //   CModalTitle,
// //   CModalBody,
// //   CModalFooter,
// //   CButton,
// //   CFormSelect,
// //   CAlert,
// //   CDropdown,
// //   CDropdownToggle,
// //   CDropdownMenu,
// //   CDropdownItem
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilPlus, cilSettings, cilSearch, cilZoomOut, cilPrint, cilCloudDownload } from '@coreui/icons';
// // import { useAuth } from '../../context/AuthContext';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faFileExcel, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import TextField from '@mui/material/TextField';
// // import Swal from 'sweetalert2';
// // import QRCode from 'qrcode';

// // // Import date-fns locale for Indian date format
// // import { enIN } from 'date-fns/locale';

// // // Import permission utilities
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   canCreateInPage,
// //   canUpdateInPage,
// //   canDeleteInPage 
// // } from '../../utils/modulePermissions';
// // import { useCallback } from 'react';

// // const ExchangeLedger = () => {
// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const [menuId, setMenuId] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedledger, setSelectedledger] = useState(null);
// //   const [groupedData, setGroupedData] = useState([]);
// //   const [expandedBrokers, setExpandedBrokers] = useState({});
// //   const [showFilterModal, setShowFilterModal] = useState(false);
// //   const [branches, setBranches] = useState([]);
// //   const [selectedBranch, setSelectedBranch] = useState('');
// //   const [isFiltered, setIsFiltered] = useState(false);
// //   const [selectedBranchName, setSelectedBranchName] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
  
// //   // ============ RECEIPTS FETCHING STATES ============
// //   const [transactionsData, setTransactionsData] = useState({});
// //   const [loadingTransactions, setLoadingTransactions] = useState({});
// //   const [transactionsFetched, setTransactionsFetched] = useState({});
  
// //   // Export modal state
// //   const [showExportModal, setShowExportModal] = useState(false);
// //   const [exportStartDate, setExportStartDate] = useState(null);
// //   const [exportEndDate, setExportEndDate] = useState(null);
// //   const [exportBranchId, setExportBranchId] = useState('');
// //   const [exportError, setExportError] = useState('');
// //   const [exportLoading, setExportLoading] = useState(false);

// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for Exchange Ledger under ACCOUNT module
// //   const canViewExchangeLedger = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
// //   const canCreateExchangeLedger = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
// //   const canUpdateExchangeLedger = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
// //   const canDeleteExchangeLedger = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  
// //   const showActionColumn = canCreateExchangeLedger || canViewExchangeLedger;

// //   // Format date to DD-MM-YYYY for display
// //   const formatDateDDMMYYYY = (date) => {
// //     if (!date) return '';
// //     const day = String(date.getDate()).padStart(2, '0');
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const year = date.getFullYear();
// //     return `${day}-${month}-${year}`;
// //   };

// //   // Format date to YYYY-MM-DD for API
// //   const formatDateForAPI = (date) => {
// //     if (!date) return '';
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const day = String(date.getDate()).padStart(2, '0');
// //     return `${year}-${month}-${day}`;
// //   };

// //   useEffect(() => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     fetchData();
// //     fetchBranches();
// //   }, [canViewExchangeLedger]);

// //   useEffect(() => {
// //     if (data.length > 0) {
// //       const grouped = groupDataByBroker(data, isFiltered);
// //       setGroupedData(grouped);
// //       setFilteredData(grouped);
      
// //       // Initialize transactions data structure
// //       const initialTransactionsMap = {};
// //       grouped.forEach(brokerData => {
// //         const key = brokerData.broker._id;
// //         initialTransactionsMap[key] = [];
        
// //         // Also initialize for branches if needed
// //         if (!isFiltered && brokerData.branches) {
// //           brokerData.branches.forEach(branch => {
// //             const branchKey = `${brokerData.broker._id}-${branch.branchId}`;
// //             initialTransactionsMap[branchKey] = [];
// //           });
// //         }
// //       });
// //       setTransactionsData(initialTransactionsMap);
// //     }
// //   }, [data, isFiltered]);

// //   const fetchBranches = async () => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     try {
// //       const response = await axiosInstance.get('/branches');
// //       setBranches(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const fetchData = async (branchId = null) => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
// //       let url = '/broker-ledger/summary/detailed';
// //       if (branchId) {
// //         url = `/broker-ledger/summary/branch/${branchId}`;
// //       }

// //       const response = await axiosInstance.get(url);

// //       if (branchId) {
// //         const branchName = branches.find((b) => b._id === branchId)?.name || 'Selected Branch';
// //         setSelectedBranchName(branchName);

// //         const branchData = response.data.data.brokers.map((broker) => ({
// //           broker: broker.broker,
// //           branch: {
// //             _id: response.data.data.branch,
// //             name: branchName
// //           },
// //           bookings: {
// //             total: broker.totalBookings,
// //             details: []
// //           },
// //           financials: {
// //             totalExchangeAmount: broker.totalExchangeAmount,
// //             ledger: {
// //               currentBalance: broker.ledger.currentBalance,
// //               onAccount: broker.ledger.onAccount,
// //               totalCredit: broker.ledger.totalCredit || 0,
// //               totalDebit: broker.ledger.totalDebit || 0,
// //               outstandingAmount: broker.ledger.outstandingAmount || 0,
// //               transactions: broker.ledger.transactions || 0
// //             },
// //             summary: {
// //               totalReceived: broker.summary?.totalReceived || 0,
// //               totalPayable: broker.summary?.totalPayable || 0,
// //               netBalance: broker.ledger.currentBalance
// //             }
// //           },
// //           recentTransactions: [],
// //           association: {
// //             isActive: true
// //           }
// //         }));

// //         setData(branchData);
// //         setIsFiltered(true);
// //       } else {
// //         setData(response.data.data.brokers);
// //         setIsFiltered(false);
// //         setSelectedBranchName('');
// //       }
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ============ FETCH TRANSACTIONS FOR BROKER (REQUIRES BOTH IDs) ============
// //   const fetchTransactionsForBroker = useCallback(async (brokerId, branchId) => {
// //     // Both IDs are required - don't proceed if either is missing
// //     if (!brokerId || !branchId) {
// //       console.log('Cannot fetch transactions: Both brokerId and branchId are required');
// //       return;
// //     }
    
// //     const key = `${brokerId}-${branchId}`;
    
// //     if (transactionsFetched[key] || loadingTransactions[key]) {
// //       return;
// //     }

// //     try {
// //       setLoadingTransactions(prev => ({ ...prev, [key]: true }));
      
// //       const response = await axiosInstance.get(`/broker-ledger/branch-transactions/${brokerId}/${branchId}`);
      
// //       const transactions = response.data.data.transactions || [];
      
// //       setTransactionsData(prev => ({
// //         ...prev,
// //         [key]: transactions
// //       }));
      
// //       setTransactionsFetched(prev => ({
// //         ...prev,
// //         [key]: true
// //       }));
// //     } catch (error) {
// //       console.error(`Error fetching transactions for broker ${brokerId} and branch ${branchId}:`, error);
// //       setTransactionsData(prev => ({
// //         ...prev,
// //         [key]: []
// //       }));
// //       setTransactionsFetched(prev => ({
// //         ...prev,
// //         [key]: true
// //       }));
// //     } finally {
// //       setLoadingTransactions(prev => ({ ...prev, [key]: false }));
// //     }
// //   }, [transactionsFetched, loadingTransactions]);

// //   // ============ PRINT RECEIPT FUNCTION - FIXED ============
// //   const printBrokerReceipt = async (transactionId) => {
// //     try {
// //       console.log('Fetching transaction with ID:', transactionId);
      
// //       const response = await axiosInstance.get(`/broker-ledger/transaction/${transactionId}`);
// //       console.log('Transaction response:', response.data);
      
// //       const transaction = response.data.data;
      
// //       if (!transaction) {
// //         showError('Transaction data not found');
// //         return;
// //       }
      
// //       const receivedDate = transaction.dateFormatted || 
// //                           new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
      
// //       const currentDate = new Date().toLocaleDateString('en-GB');
      
// //       const brokerName = transaction.broker?.name || 'N/A';
// //       const branchName = transaction.branch?.name || 'N/A';
// //       const branchAddress = transaction.branch?.address || '';
// //       const branchPhone = transaction.branch?.phone || '';
// //       const branchEmail = transaction.branch?.email || '';
      
// //       const qrText = `GANDHI MOTORS PVT LTD
// // Broker: ${brokerName}
// // Branch: ${branchName}
// // Receipt No: ${transaction.referenceNumber || transaction._id}
// // Amount: ₹${transaction.amount || 0}
// // Payment Mode: ${transaction.modeOfPayment || 'Cash'}
// // Date: ${receivedDate}`;

// //       let qrCodeImage = '';
// //       try {
// //         qrCodeImage = await QRCode.toDataURL(qrText, {
// //           width: 150,
// //           margin: 2,
// //           color: {
// //             dark: '#000000',
// //             light: '#FFFFFF'
// //           },
// //           errorCorrectionLevel: 'H'
// //         });
// //       } catch (error) {
// //         console.error('Error generating QR code:', error);
// //         qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
// //           <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
// //             <rect width="150" height="150" fill="white"/>
// //             <rect x="10" y="10" width="130" height="130" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
// //             <text x="75" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">QR CODE</text>
// //             <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${transaction.referenceNumber || ''}</text>
// //           </svg>
// //         `);
// //       }

// //       const receiptHTML = generateReceiptHTML(transaction, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail);

// //       const printWindow = window.open('', '_blank');
// //       printWindow.document.write(receiptHTML);
// //       printWindow.document.close();
      
// //       printWindow.onload = function() {
// //         printWindow.focus();
// //         printWindow.print();
// //       };
      
// //     } catch (err) {
// //       console.error('Error fetching transaction details:', err);
// //       console.error('Error response:', err.response?.data);
// //       showError('Failed to load receipt. Please try again.');
// //     }
// //   };

// //   // ============ GENERATE RECEIPT HTML ============
// //   const generateReceiptHTML = (transaction, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail) => {
// //     const receiptNumber = transaction.referenceNumber || transaction._id || 'N/A';
// //     const amount = transaction.amount || 0;
// //     const paymentMode = transaction.modeOfPayment || 'Cash';
// //     const remark = transaction.remark || '';
// //     const referenceNumber = transaction.referenceNumber || '';
// //     const approvalStatus = transaction.approvalStatus || 'Pending';
// //     const cashLocation = transaction.cashLocation?.name || '';
// //     const bankName = transaction.bank?.name || '';
// //     const subPaymentMode = transaction.subPaymentMode?.payment_mode || '';
    
// //     const amountInWords = numberToWordsSimple(amount);

// //     return `<!DOCTYPE html>
// // <html>
// // <head>
// //   <title>Broker Payment Receipt - ${receiptNumber}</title>
// //   <style>
// //     body {
// //       font-family: "Courier New", Courier, monospace;
// //       margin: 0;
// //       padding: 10mm;
// //       font-size: 14px;
// //       color: #333;
// //     }
// //     .page {
// //       width: 210mm;
// //       margin: 0 auto;
// //     }
// //     .receipt-copy {
// //       height: auto;
// //       min-height: 130mm;
// //       page-break-inside: avoid;
// //     }
// //     .header-container {
// //       display: flex;
// //       justify-content: space-between;
// //       margin-bottom: 2mm;
// //       align-items: flex-start;
// //     }
// //     .header-left {
// //       width: 60%;
// //     }
// //     .header-right {
// //       width: 40%;
// //       text-align: right;
// //       display: flex;
// //       flex-direction: column;
// //       align-items: flex-end;
// //     }
// //     .logo-qr-container {
// //       display: flex;
// //       align-items: center;
// //       gap: 10px;
// //       justify-content: flex-end;
// //       margin-bottom: 5px;
// //       width: 100%;
// //     }
// //     .logo {
// //       height: 50px;
// //     }
// //     .qr-code-small {
// //       width: 80px;
// //       height: 80px;
// //       border: 1px solid #ccc;
// //     }
// //     .dealer-info {
// //       text-align: left;
// //       font-size: 12px;
// //       line-height: 1.2;
// //     }
// //     .dealer-name {
// //       font-size: 16px;
// //       font-weight: bold;
// //       margin: 0 0 3px 0;
// //     }
// //     .broker-info-container {
// //       display: flex;
// //       font-size: 12px;
// //       margin: 10px 0;
// //     }
// //     .broker-info-left {
// //       width: 50%;
// //     }
// //     .broker-info-right {
// //       width: 50%;
// //     }
// //     .info-row {
// //       margin: 2mm 0;
// //       line-height: 1.2;
// //     }
// //     .divider {
// //       border-top: 2px solid #AAAAAA;
// //       margin: 3mm 0;
// //     }
// //     .receipt-info {
// //       background-color: #f8f9fa;
// //       border: 1px solid #dee2e6;
// //       border-radius: 4px;
// //       padding: 8px;
// //       margin: 10px 0;
// //       font-size: 12px;
// //     }
// //     .payment-info-box {
// //       margin: 10px 0;
// //     }
// //     .signature-box {
// //       margin-top: 15mm;
// //       font-size: 10pt;
// //     }
// //     .signature-line {
// //       border-top: 1px dashed #000;
// //       width: 40mm;
// //       display: inline-block;
// //       margin: 0 5mm;
// //     }
// //     .cutting-line {
// //       border-top: 2px dashed #333;
// //       margin: 15mm 0 10mm 0;
// //       text-align: center;
// //       position: relative;
// //     }
// //     .cutting-line::before {
// //       content: "✂ Cut Here ✂";
// //       position: absolute;
// //       top: -10px;
// //       left: 50%;
// //       transform: translateX(-50%);
// //       background: white;
// //       padding: 0 10px;
// //       font-size: 12px;
// //       color: #666;
// //     }
// //     .note {
// //       padding: 1px;
// //       margin: 2px;
// //       font-size: 11px;
// //     }
// //     .amount-in-words {
// //       font-style: italic;
// //       margin-top: 8px;
// //       padding: 5px;
// //       font-size: 12px;
// //       border-top: 1px dashed #ccc;
// //     }
// //     .status-badge {
// //       display: inline-block;
// //       padding: 3px 8px;
// //       border-radius: 12px;
// //       font-size: 11px;
// //       font-weight: bold;
// //       background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
// //       color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
// //       border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
// //     }
// //     .footer-note {
// //       font-size: 9px;
// //       color: #777;
// //       text-align: center;
// //       margin-top: 5mm;
// //     }
// //     .payment-details {
// //       margin-top: 10px;
// //       border-collapse: collapse;
// //       width: 100%;
// //     }
// //     .payment-details td {
// //       padding: 4px;
// //       border: none;
// //     }
// //     @page {
// //       size: A4;
// //       margin: 10mm;
// //     }
// //     @media print {
// //       body {
// //         padding: 0;
// //       }
// //       .receipt-copy {
// //         page-break-inside: avoid;
// //       }
// //     }
// //   </style>
// // </head>
// // <body>
// //   <div class="page">
// //     <!-- FIRST COPY -->
// //     <div class="receipt-copy">
// //       <div class="header-container">
// //         <div class="header-left">
// //           <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
// //           <div class="dealer-info">
// //             Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
// //             Upnagar, Nashik Road, Nashik - 422101<br>
// //             Phone: 7498903672
// //           </div>
// //         </div>
// //         <div class="header-right">
// //           <div class="logo-qr-container">
// //             <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
// //             ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
// //           </div>
// //           <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
// //           <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
// //         </div>
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="receipt-info">
// //         <div><strong>BROKER PAYMENT RECEIPT</strong></div>
// //         <div><strong>Receipt Date:</strong> ${receivedDate}</div>
        
// //       </div>

// //       <div class="broker-info-container">
// //         <div class="broker-info-left">
// //           <div class="info-row"><strong>Broker Name:</strong> ${brokerName}</div>
// //           <div class="info-row"><strong>Branch:</strong> ${branchName}</div>
// //           <div class="info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
// //           ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> ${cashLocation}</div>` : ''}
// //           ${bankName ? `<div class="info-row"><strong>Bank:</strong> ${bankName}</div>` : ''}
// //         </div>
// //         <div class="broker-info-right">
// //           <div class="info-row"><strong>Reference No:</strong> ${referenceNumber}</div>
// //           ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> ${subPaymentMode}</div>` : ''}
// //           <div class="info-row"><strong>Branch Address:</strong> ${branchAddress}</div>
// //           <div class="info-row"><strong>Branch Phone:</strong> ${branchPhone}</div>
// //         </div>
// //       </div>

// //       <div class="payment-info-box">
// //         <div class="receipt-info">
// //           <div style="display: flex; justify-content: space-between;">
// //             <span><strong>Receipt Amount:</strong></span>
// //             <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
// //           </div>
// //           ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
// //         </div>
        
// //         <div class="amount-in-words">
// //           <strong>Amount in words:</strong> ${amountInWords} Only
// //         </div>
// //       </div>

// //       <div class="note">
// //         <strong>Notes:</strong> This is a system generated receipt for Broker On-Account payment.
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="signature-box">
// //         <div style="display: flex; justify-content: space-between;">
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Broker's Signature</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Authorised Signatory</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Accountant</div>
// //           </div>
// //         </div>
// //       </div>
      
// //       <div class="footer-note">
// //         This is a computer generated receipt - valid without signature
// //       </div>
// //     </div>

// //     <!-- CUTTING LINE -->
// //     <div class="cutting-line"></div>

// //     <!-- SECOND COPY (DUPLICATE) -->
// //     <div class="receipt-copy">
// //       <div class="header-container">
// //         <div class="header-left">
// //           <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
// //           <div class="dealer-info">
// //             Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
// //             Upnagar, Nashik Road, Nashik - 422101<br>
// //             Phone: 7498903672
// //           </div>
// //         </div>
// //         <div class="header-right">
// //           <div class="logo-qr-container">
// //             <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
// //             ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
// //           </div>
// //           <div style="margin-top: 3px; font-size: 11px;">Date: ${currentDate}</div>
// //           <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
// //         </div>
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="receipt-info">
// //         <div><strong>BROKER PAYMENT RECEIPT (DUPLICATE)</strong></div>
// //         <div><strong>Receipt Date:</strong> ${receivedDate}</div>
    
// //       </div>

// //       <div class="broker-info-container">
// //         <div class="broker-info-left">
// //           <div class="info-row"><strong>Broker Name:</strong> ${brokerName}</div>
// //           <div class="info-row"><strong>Branch:</strong> ${branchName}</div>
// //           <div class="info-row"><strong>Payment Mode:</strong> ${paymentMode}</div>
// //           ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> ${cashLocation}</div>` : ''}
// //           ${bankName ? `<div class="info-row"><strong>Bank:</strong> ${bankName}</div>` : ''}
// //         </div>
// //         <div class="broker-info-right">
// //           <div class="info-row"><strong>Reference No:</strong> ${referenceNumber}</div>
// //           ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> ${subPaymentMode}</div>` : ''}
// //           <div class="info-row"><strong>Branch Address:</strong> ${branchAddress}</div>
// //           <div class="info-row"><strong>Branch Phone:</strong> ${branchPhone}</div>
// //         </div>
// //       </div>

// //       <div class="payment-info-box">
// //         <div class="receipt-info">
// //           <div style="display: flex; justify-content: space-between;">
// //             <span><strong>Receipt Amount:</strong></span>
// //             <span style="font-size: 16px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</span>
// //           </div>
// //           ${remark ? `<div style="margin-top: 5px;"><strong>Remark:</strong> ${remark}</div>` : ''}
// //         </div>
        
// //         <div class="amount-in-words">
// //           <strong>Amount in words:</strong> ${amountInWords} Only
// //         </div>
// //       </div>

// //       <div class="note">
// //         <strong>Notes:</strong> This is a system generated receipt for Broker On-Account payment.
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="signature-box">
// //         <div style="display: flex; justify-content: space-between;">
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Broker's Signature</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Authorised Signatory</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Accountant</div>
// //           </div>
// //         </div>
// //       </div>
      
// //       <div class="footer-note">
// //         This is a computer generated receipt - valid without signature
// //       </div>
// //     </div>
// //   </div>
// // </body>
// // </html>`;
// //   };

// //   // ============ SIMPLE NUMBER TO WORDS FUNCTION ============
// //   const numberToWordsSimple = (num) => {
// //     if (num === 0) return 'Zero';
    
// //     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
// //                   'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
// //                   'Seventeen', 'Eighteen', 'Nineteen'];
// //     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
// //     const numToWords = (n) => {
// //       if (n < 20) return ones[n];
// //       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
// //       if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
// //       if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
// //       if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
// //       return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
// //     };
    
// //     return numToWords(Math.floor(num)) + (num % 1 ? ' point ' + num.toString().split('.')[1] : '');
// //   };

// //   const handleBranchFilter = async () => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     if (selectedBranch) {
// //       await fetchData(selectedBranch);
// //     } else {
// //       await fetchData();
// //     }
// //     setShowFilterModal(false);
// //   };

// //   const clearFilter = async () => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     setSelectedBranch('');
// //     await fetchData();
// //     setShowFilterModal(false);
// //   };

// //   const groupDataByBroker = (brokersData, isFilteredMode = false) => {
// //     const brokerMap = {};

// //     brokersData.forEach((item) => {
// //       const brokerId = item.broker._id;

// //       if (!brokerMap[brokerId]) {
// //         brokerMap[brokerId] = {
// //           broker: item.broker,
// //           branches: [],
// //           totalBookings: 0,
// //           totalExchangeAmount: 0,
// //           totalCredit: 0,
// //           totalDebit: 0,
// //           onAccount: 0,
// //           currentBalance: 0,
// //           outstandingAmount: 0
// //         };
// //       }

// //       if (isFilteredMode) {
// //         brokerMap[brokerId].branches = [
// //           {
// //             name: item.branch.name,
// //             branchId: item.branch._id,
// //             bookings: item.bookings.total,
// //             exchangeAmount: item.financials.totalExchangeAmount,
// //             credit: item.financials.ledger.totalCredit,
// //             debit: item.financials.ledger.totalDebit,
// //             onAccount: item.financials.ledger.onAccount,
// //             currentBalance: item.financials.ledger.currentBalance,
// //             outstandingAmount: item.financials.ledger.outstandingAmount
// //           }
// //         ];

// //         brokerMap[brokerId].totalBookings = item.bookings.total;
// //         brokerMap[brokerId].totalExchangeAmount = item.financials.totalExchangeAmount;
// //         brokerMap[brokerId].totalCredit = item.financials.ledger.totalCredit;
// //         brokerMap[brokerId].totalDebit = item.financials.ledger.totalDebit;
// //         brokerMap[brokerId].onAccount = item.financials.ledger.onAccount;
// //         brokerMap[brokerId].currentBalance = item.financials.ledger.currentBalance;
// //         brokerMap[brokerId].outstandingAmount = item.financials.ledger.outstandingAmount;
// //       } else {
// //         brokerMap[brokerId].branches.push({
// //           name: item.branch.name,
// //           branchId: item.branch._id,
// //           bookings: item.bookings.total,
// //           exchangeAmount: item.financials.totalExchangeAmount,
// //           credit: item.financials.ledger.totalCredit,
// //           debit: item.financials.ledger.totalDebit,
// //           onAccount: item.financials.ledger.onAccount,
// //           currentBalance: item.financials.ledger.currentBalance,
// //           outstandingAmount: item.financials.ledger.outstandingAmount
// //         });

// //         brokerMap[brokerId].totalBookings += item.bookings.total;
// //         brokerMap[brokerId].totalExchangeAmount += item.financials.totalExchangeAmount;
// //         brokerMap[brokerId].totalCredit += item.financials.ledger.totalCredit;
// //         brokerMap[brokerId].totalDebit += item.financials.ledger.totalDebit;
// //         brokerMap[brokerId].onAccount += item.financials.ledger.onAccount;
// //         brokerMap[brokerId].currentBalance += item.financials.ledger.currentBalance;
// //         brokerMap[brokerId].outstandingAmount += item.financials.ledger.outstandingAmount;
// //       }
// //     });

// //     return Object.values(brokerMap);
// //   };

// //   const toggleBrokerExpansion = (brokerId) => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     if (!isFiltered) {
// //       setExpandedBrokers((prev) => ({
// //         ...prev,
// //         [brokerId]: !prev[brokerId]
// //       }));
// //     }
// //   };

// //   const handleClick = (event, id, brokerData = null, branchId = null) => {
// //     if (!canViewExchangeLedger && !canCreateExchangeLedger) {
// //       return;
// //     }
    
// //     setAnchorEl(event.currentTarget);
// //     setMenuId(id);
// //     if (brokerData) {
// //       setSelectedledger({ ...brokerData, branchId });
// //     }
// //   };

// //   const handleClose = () => {
// //     setAnchorEl(null);
// //     setMenuId(null);
// //   };

// //   const handleAddClick = (brokerData, branchId = null) => {
// //     if (!canCreateExchangeLedger) {
// //       showError('You do not have permission to add payments');
// //       return;
// //     }
    
// //     setSelectedledger({ ...brokerData, branchId });
// //     setShowModal(true);
// //     handleClose();
// //   };

// //   const handleViewLedger = async (brokerData, branchId = null) => {
// //     if (!canViewExchangeLedger) {
// //       showError('You do not have permission to view ledgers');
// //       return;
// //     }
    
// //     try {
// //       let url = `/broker-ledger/statement/${brokerData.broker?._id}`;
// //       if (branchId) {
// //         url += `?branchId=${branchId}`;
// //       }

// //       const res = await axiosInstance.get(url);
// //       const ledgerData = res.data.data;
// //       const ledgerUrl = `${config.baseURL}/brokerData.html?ledgerId=${brokerData._id}`;
// //       let totalCredit = 0;
// //       let totalDebit = 0;
// //       const totalOnAccount = ledgerData.summary?.totalOnAccount ?? ledgerData.onAccountBalance ?? 0;

// //       ledgerData.transactions?.forEach((entry) => {
// //         if (entry.type === 'CREDIT') {
// //           totalCredit += entry.amount;
// //         } else if (entry.type === 'DEBIT') {
// //           totalDebit += entry.amount;
// //         }
// //       });
// //       const finalBalance = totalDebit - totalCredit;
// //       const availableOnAccount2 = totalOnAccount - totalCredit;

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
// //                   <div><strong>Broker Name:</strong> ${ledgerData.broker?.name || 'N/A'}</div>
// //                   <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
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
// //                     ${ledgerData.transactions
// //   ?.map(
// //     (entry) => {
// //       let exchangeVehicleNumber = '';
// //       let exchangeChassisNumber = '';
// //       let exchangePrice = '';
// //       let exchangeStatus = '';
// //       let bookingNumber = entry.booking?.bookingNumber || '';
      
// //       if (entry.exchangeVehicle && entry.exchangeVehicle.VehicleNumber) {
// //         exchangeVehicleNumber = entry.exchangeVehicle.VehicleNumber || '';
// //         exchangeChassisNumber = entry.exchangeVehicle.ChassisNumber || '';
// //         exchangePrice = entry.exchangeVehicle.PriceFormatted || '';
// //         exchangeStatus = entry.exchangeVehicle.Status || '';
// //       } else if (entry.exchangeDisplay && entry.exchangeDisplay.VehicleNumber) {
// //         exchangeVehicleNumber = entry.exchangeDisplay.VehicleNumber || '';
// //         exchangeChassisNumber = entry.exchangeDisplay.ChassisNumber || '';
// //         exchangePrice = entry.exchangeDisplay.Price || '';
// //         exchangeStatus = entry.exchangeDisplay.Status || '';
// //       } else if (entry.booking?.exchange?.display) {
// //         const exchangeDisplay = entry.booking.exchange.display;
// //         exchangeVehicleNumber = exchangeDisplay.vehicleNumber || '';
// //         exchangeChassisNumber = exchangeDisplay.chassisNumber || '';
// //         exchangePrice = exchangeDisplay.price ? `₹${exchangeDisplay.price.toLocaleString('en-IN')}` : '';
// //         exchangeStatus = exchangeDisplay.status || '';
// //       } else if (entry.booking?.exchange?.details) {
// //         const exchangeDetails = entry.booking.exchange.details;
// //         exchangeVehicleNumber = exchangeDetails.vehicleNumber || '';
// //         exchangeChassisNumber = exchangeDetails.chassisNumber || '';
// //         exchangePrice = exchangeDetails.price ? `₹${exchangeDetails.price.toLocaleString('en-IN')}` : '';
// //         exchangeStatus = exchangeDetails.status || '';
// //       }
      
// //       return `
// //       <tr>
// //         <td>${new Date(entry.date).toLocaleDateString() || 'N/A'}</td>
// //         <td>
// //           Booking No: ${bookingNumber || '-'}<br>
// //           Customer: ${entry.booking?.customer?.name || '-'}<br>
       
// //           ${entry.mode || ''}
// //           ${exchangeVehicleNumber ? `<br>Exchange Vehicle: ${exchangeVehicleNumber}` : ''}
// //           ${exchangeChassisNumber ? `<br>Exchange Chassis: ${exchangeChassisNumber}` : ''}
// //         </td>
// //         <td>${entry.receiptNumber || ''}</td>
// //         <td class="text-right">${entry.type === 'CREDIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
// //         <td class="text-right">${entry.type === 'DEBIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
// //         <td class="text-right"></td>
// //       </tr>
// //     `;
// //     }
// //   )
// //   .join('')}
// //                       <tr>
// //                       <td colspan="3" class="text-left"><strong>Total OnAccount</strong></td>
// //                       <td class="text-right"></td>
// //                       <td class="text-right"></td>
// //                       <td class="text-right"><strong>${availableOnAccount2.toLocaleString('en-IN')}</strong></td>
// //                     </tr>
// //                     <tr>
// //                       <td colspan="3" class="text-left"><strong>Total</strong></td>
// //                       <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
// //                       <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
// //                       <td class="text-right"><strong>${finalBalance.toLocaleString('en-IN')}</strong></td>
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
// //       const message = showError(err);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //     handleClose();
// //   };

// //   const handleSearch = (value) => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     setSearchTerm(value);
// //     handleFilter(value, ['broker.name']);
// //   };

// //   const handlePaymentSaved = (message) => {
// //     setSuccessMessage(message);
// //     setTimeout(() => setSuccessMessage(''), 3000);
// //     fetchData();
// //   };

// //   const handleOpenExportModal = () => {
// //     if (!canCreateExchangeLedger) {
// //       showError('You do not have permission to export reports');
// //       return;
// //     }
    
// //     setShowExportModal(true);
// //     setExportError('');
// //     if (isFiltered && selectedBranch) {
// //       setExportBranchId(selectedBranch);
// //     }
// //   };

// //   const handleCloseExportModal = () => {
// //     setShowExportModal(false);
// //     setExportStartDate(null);
// //     setExportEndDate(null);
// //     setExportBranchId('');
// //     setExportError('');
// //     setExportLoading(false);
// //   };

// //   const handleExcelExport = async () => {
// //     if (!canCreateExchangeLedger) {
// //       showError('You do not have permission to export reports');
// //       return;
// //     }
    
// //     setExportError('');
    
// //     if (!exportBranchId) {
// //       setExportError('Please select a branch');
// //       return;
// //     }

// //     if (!exportStartDate || !exportEndDate) {
// //       setExportError('Please select both start and end dates');
// //       return;
// //     }

// //     if (exportStartDate > exportEndDate) {
// //       setExportError('Start date cannot be after end date');
// //       return;
// //     }

// //     try {
// //       setExportLoading(true);
      
// //       const formattedStartDate = formatDateForAPI(exportStartDate);
// //       const formattedEndDate = formatDateForAPI(exportEndDate);

// //       const params = new URLSearchParams({
// //         branchId: exportBranchId,
// //         startDate: formattedStartDate,
// //         endDate: formattedEndDate
// //       });

// //       const response = await axiosInstance.get(
// //         `/reports/brokers?${params.toString()}`,
// //         { responseType: 'blob' }
// //       );

// //       const contentType = response.headers['content-type'];
      
// //       if (contentType && contentType.includes('application/json')) {
// //         const text = await new Promise((resolve, reject) => {
// //           const reader = new FileReader();
// //           reader.onload = () => resolve(reader.result);
// //           reader.onerror = reject;
// //           reader.readAsText(response.data);
// //         });
        
// //         const errorData = JSON.parse(text);
        
// //         if (!errorData.success && errorData.message) {
// //           setExportError(errorData.message);
// //           Swal.fire({
// //             icon: 'error',
// //             title: 'Export Failed',
// //             text: errorData.message,
// //           });
// //           return;
// //         }
// //       }

// //       const blob = new Blob([response.data], { 
// //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
// //       });
      
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement('a');
// //       link.href = url;
      
// //       const branchName = branches.find(b => b._id === exportBranchId)?.name || 'Branch';
// //       const startDateStr = formatDateDDMMYYYY(exportStartDate);
// //       const endDateStr = formatDateDDMMYYYY(exportEndDate);
// //       const fileName = `Brokers_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
// //       link.setAttribute('download', fileName);
      
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
      
// //       window.URL.revokeObjectURL(url);
      
// //       Swal.fire({
// //         toast: true,
// //         position: 'top-end',
// //         icon: 'success',
// //         title: 'Excel exported successfully!',
// //         showConfirmButton: false,
// //         timer: 3000,
// //         timerProgressBar: true
// //       });

// //       handleCloseExportModal();
      
// //     } catch (error) {
// //       console.error('Error exporting report:', error);
      
// //       if (error.response && error.response.data instanceof Blob) {
// //         try {
// //           const text = await new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onload = () => resolve(reader.result);
// //             reader.onerror = reject;
// //             reader.readAsText(error.response.data);
// //           });
          
// //           const errorData = JSON.parse(text);
          
// //           if (errorData.message) {
// //             setExportError(errorData.message);
// //             Swal.fire({
// //               icon: 'error',
// //               title: 'Export Failed',
// //               text: errorData.message,
// //             });
// //           }
// //         } catch (parseError) {
// //           console.error('Error parsing error response:', parseError);
// //           setExportError('Failed to export report');
// //           Swal.fire({
// //             icon: 'error',
// //             title: 'Export Failed',
// //             text: 'Failed to export report',
// //           });
// //         }
// //       } else if (error.response?.data?.message) {
// //         setExportError(error.response.data.message);
// //         Swal.fire({
// //           icon: 'error',
// //           title: 'Export Failed',
// //           text: error.response.data.message,
// //         });
// //       } else if (error.message) {
// //         setExportError(error.message);
// //         Swal.fire({
// //           icon: 'error',
// //           title: 'Export Failed',
// //           text: error.message,
// //         });
// //       } else {
// //         setExportError('Failed to export report');
// //         Swal.fire({
// //           icon: 'error',
// //           title: 'Export Failed',
// //           text: 'Failed to export report',
// //         });
// //       }
      
// //     } finally {
// //       setExportLoading(false);
// //     }
// //   };

// //   if (!canViewExchangeLedger) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Exchange Ledger.
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

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         {error}
// //       </div>
// //     );
// //   }

// //   const totalColumns = isFiltered ? 12 : 13;
// //   const actionColumnIndex = showActionColumn ? 1 : 0;

// //   return (
// //     <div>
// //       <div className='title'>Exchange Ledger {isFiltered && `- ${selectedBranchName}`}</div>
      
// //       {successMessage && (
// //         <CAlert color="success" className="mb-3">
// //           {successMessage}
// //         </CAlert>
// //       )}
    
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div>
// //             <CButton 
// //               size="sm" 
// //               className="action-btn me-1"
// //               onClick={() => setShowFilterModal(true)}
// //               disabled={!canViewExchangeLedger}
// //             >
// //               <CIcon icon={cilSearch} className='me-1' />
// //               Search
// //             </CButton>
// //             {isFiltered && (
// //               <CButton 
// //                 size="sm" 
// //                 className="action-btn me-1"
// //                 onClick={clearFilter}
// //                 disabled={!canViewExchangeLedger}
// //               >
// //                 <CIcon icon={cilZoomOut} className='me-1' />
// //                 Clear Filter
// //               </CButton>
// //             )}
            
// //             {canCreateExchangeLedger && (
// //               <CButton 
// //                 size="sm" 
// //                 className="action-btn me-1"
// //                 onClick={handleOpenExportModal}
// //                 title="Export Excel Report"
// //               >
// //                 <FontAwesomeIcon icon={faFileExcel} className='me-1' />
// //                 Export Report
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
// //                 disabled={!canViewExchangeLedger}
// //               />
// //             </div>
// //           </div>
          
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   {!isFiltered && <CTableHeaderCell></CTableHeaderCell>}
// //                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //                   <CTableHeaderCell>Exchange Broker Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Mobile</CTableHeaderCell>
// //                   {!isFiltered && <CTableHeaderCell>Branch</CTableHeaderCell>}
// //                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Exchange Amount</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Received</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Payable</CTableHeaderCell>
// //                   <CTableHeaderCell>Opening Balance</CTableHeaderCell>
// //                   <CTableHeaderCell>Current Balance</CTableHeaderCell>
// //                   <CTableHeaderCell>Outstanding Amount</CTableHeaderCell>
// //                   <CTableHeaderCell>Receipts</CTableHeaderCell>
// //                   {showActionColumn && <CTableHeaderCell>Actions</CTableHeaderCell>}
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {currentRecords.length === 0 ? (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan={totalColumns + actionColumnIndex} className="text-center">
// //                       No ledger details available
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 ) : (
// //                   currentRecords.map((brokerData, index) => {
// //                     const brokerId = brokerData.broker._id;
// //                     const hasTransactions = transactionsFetched[brokerId] && transactionsData[brokerId]?.length > 0;
// //                     const isLoading = loadingTransactions[brokerId];
// //                     const transactions = transactionsData[brokerId] || [];
                    
// //                     const sortedTransactions = [...transactions].sort((a, b) => {
// //                       const dateA = new Date(a.date || a.createdAt || 0);
// //                       const dateB = new Date(b.date || b.createdAt || 0);
// //                       return dateB - dateA;
// //                     });
                    
// //                     return (
// //                       <>
// //                         <CTableRow key={brokerData.broker._id} className="broker-summary-row">
// //                           {!isFiltered && (
// //                             <CTableDataCell>
// //                               <CButton
// //                                 color="link"
// //                                 size="sm"
// //                                 onClick={() => toggleBrokerExpansion(brokerData.broker._id)}
// //                                 disabled={!canViewExchangeLedger}
// //                               >
// //                                 {expandedBrokers[brokerData.broker._id] ? '▼' : '►'}
// //                               </CButton>
// //                             </CTableDataCell>
// //                           )}
// //                           <CTableDataCell>{index + 1}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.broker.name || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.broker.mobile || 'N/A'}</CTableDataCell>
// //                           {!isFiltered && <CTableDataCell>All Branches</CTableDataCell>}
// //                           <CTableDataCell>{brokerData.totalBookings || 0}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.totalExchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.totalCredit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.totalDebit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          
// //                           {/* Receipts Column - Only show for filtered view or expanded branches */}
// //                           <CTableDataCell>
// //                             {isFiltered ? (
// //                               // When filtered by branch, we can show receipts
// //                               isLoading ? (
// //                                 <CSpinner size="sm" color="info" />
// //                               ) : sortedTransactions.length > 0 ? (
// //                                 <CDropdown>
// //                                   <CDropdownToggle size="sm" color="info" variant="outline">
// //                                     {sortedTransactions.length} Receipt{sortedTransactions.length > 1 ? 's' : ''}
// //                                   </CDropdownToggle>
// //                                   <CDropdownMenu>
// //                                     {sortedTransactions.map((transaction, txIndex) => {
// //                                       const transactionId = transaction._id;
// //                                       const transactionNumber = transaction.referenceNumber || 'N/A';
// //                                       const transactionAmount = transaction.amount || 0;
// //                                       const transactionDate = transaction.dateFormatted || 
// //                                                             new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                      
// //                                       return (
// //                                         <CDropdownItem 
// //                                           key={transactionId || txIndex} 
// //                                           onClick={() => printBrokerReceipt(transactionId)}
// //                                         >
// //                                           <div className="d-flex align-items-center">
// //                                             <CIcon icon={cilPrint} className="me-2" />
// //                                             <div>
// //                                               <div><strong>Receipt #{txIndex + 1}</strong></div>
// //                                               <small>
// //                                                 ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
// //                                               </small>
// //                                             </div>
// //                                           </div>
// //                                         </CDropdownItem>
// //                                       );
// //                                     })}
// //                                   </CDropdownMenu>
// //                                 </CDropdown>
// //                               ) : transactionsFetched[brokerId] ? (
// //                                 <span className="text-muted">No receipts</span>
// //                               ) : (
// //                                 brokerData.branches && brokerData.branches.length > 0 ? (
// //                                   <CButton
// //                                     size="sm"
// //                                     color="light"
// //                                     onClick={() => fetchTransactionsForBroker(brokerId, brokerData.branches[0].branchId)}
// //                                     disabled={isLoading}
// //                                   >
// //                                     <CIcon icon={cilCloudDownload} className="me-1" />
// //                                     Load Receipts
// //                                   </CButton>
// //                                 ) : (
// //                                   <span className="text-muted">No branch data</span>
// //                                 )
// //                               )
// //                             ) : (
// //                               // When showing all branches, show message to expand
// //                               <span className="text-muted small">Expand to view receipts</span>
// //                             )}
// //                           </CTableDataCell>
                          
// //                           {showActionColumn && (
// //                             <CTableDataCell>
// //                               <CButton
// //                                 size="sm"
// //                                 className='option-button btn-sm'
// //                                 onClick={(event) => handleClick(event, brokerData.broker._id, brokerData)}
// //                                 disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
// //                               >
// //                                 <CIcon icon={cilSettings} />
// //                                 Options
// //                               </CButton>
// //                               <Menu
// //                                 id={`action-menu-${brokerData.broker._id}`}
// //                                 anchorEl={anchorEl}
// //                                 open={menuId === brokerData.broker._id}
// //                                 onClose={handleClose}
// //                               >
// //                                 {canCreateExchangeLedger && (
// //                                   <MenuItem onClick={() => handleAddClick(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}>
// //                                     <CIcon icon={cilPlus} className="me-2" />
// //                                     Add Payment
// //                                   </MenuItem>
// //                                 )}
// //                                 {canViewExchangeLedger && (
// //                                   <MenuItem
// //                                     onClick={() => handleViewLedger(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}
// //                                   >
// //                                     View Ledger
// //                                   </MenuItem>
// //                                 )}
// //                               </Menu>
// //                             </CTableDataCell>
// //                           )}
// //                         </CTableRow>
                        
// //                         {!isFiltered &&
// //                           expandedBrokers[brokerData.broker._id] &&
// //                           brokerData.branches.map((branch, branchIndex) => {
// //                             const branchKey = `${brokerId}-${branch.branchId}`;
// //                             const hasBranchTransactions = transactionsFetched[branchKey] && transactionsData[branchKey]?.length > 0;
// //                             const isBranchLoading = loadingTransactions[branchKey];
// //                             const branchTransactions = transactionsData[branchKey] || [];
                            
// //                             const sortedBranchTransactions = [...branchTransactions].sort((a, b) => {
// //                               const dateA = new Date(a.date || a.createdAt || 0);
// //                               const dateB = new Date(b.date || b.createdAt || 0);
// //                               return dateB - dateA;
// //                             });
                            
// //                             return (
// //                               <CTableRow key={`${brokerData.broker._id}-${branch.branchId}`} className="branch-detail-row">
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell>{branch.name || 'N/A'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.bookings || 0}</CTableDataCell>
// //                                 <CTableDataCell>{branch.exchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.credit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.debit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                
// //                                 {/* Receipts Column for Branch */}
// //                                 <CTableDataCell>
// //                                   {isBranchLoading ? (
// //                                     <CSpinner size="sm" color="info" />
// //                                   ) : sortedBranchTransactions.length > 0 ? (
// //                                     <CDropdown>
// //                                       <CDropdownToggle size="sm" color="info" variant="outline">
// //                                         {sortedBranchTransactions.length} Receipt{sortedBranchTransactions.length > 1 ? 's' : ''}
// //                                       </CDropdownToggle>
// //                                       <CDropdownMenu>
// //                                         {sortedBranchTransactions.map((transaction, txIndex) => {
// //                                           const transactionId = transaction._id;
// //                                           const transactionNumber = transaction.referenceNumber || 'N/A';
// //                                           const transactionAmount = transaction.amount || 0;
// //                                           const transactionDate = transaction.dateFormatted || 
// //                                                                 new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                          
// //                                           return (
// //                                             <CDropdownItem 
// //                                               key={transactionId || txIndex} 
// //                                               onClick={() => printBrokerReceipt(transactionId)}
// //                                             >
// //                                               <div className="d-flex align-items-center">
// //                                                 <CIcon icon={cilPrint} className="me-2" />
// //                                                 <div>
// //                                                   <div><strong>Receipt #{txIndex + 1}</strong></div>
// //                                                   <small>
// //                                                     ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
// //                                                   </small>
// //                                                 </div>
// //                                               </div>
// //                                             </CDropdownItem>
// //                                           );
// //                                         })}
// //                                       </CDropdownMenu>
// //                                     </CDropdown>
// //                                   ) : transactionsFetched[branchKey] ? (
// //                                     <span className="text-muted">No receipts</span>
// //                                   ) : (
// //                                     <CButton
// //                                       size="sm"
// //                                       color="light"
// //                                       onClick={() => fetchTransactionsForBroker(brokerId, branch.branchId)}
// //                                       disabled={isBranchLoading}
// //                                     >
// //                                       <CIcon icon={cilCloudDownload} className="me-1" />
// //                                       Load Receipts
// //                                     </CButton>
// //                                   )}
// //                                 </CTableDataCell>
                                
// //                                 {showActionColumn && (
// //                                   <CTableDataCell>
// //                                     <CButton
// //                                       size="sm"
// //                                       className='option-button btn-sm'
// //                                       onClick={(event) =>
// //                                         handleClick(event, `${brokerData.broker._id}-${branch.branchId}`, brokerData, branch.branchId)
// //                                       }
// //                                       disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
// //                                     >
// //                                       <CIcon icon={cilSettings} />
// //                                       Options
// //                                     </CButton>
// //                                     <Menu
// //                                       id={`action-menu-${brokerData.broker._id}-${branch.branchId}`}
// //                                       anchorEl={anchorEl}
// //                                       open={menuId === `${brokerData.broker._id}-${branch.branchId}`}
// //                                       onClose={handleClose}
// //                                     >
// //                                       {canCreateExchangeLedger && (
// //                                         <MenuItem onClick={() => handleAddClick(brokerData, branch.branchId)}>
// //                                           <CIcon icon={cilPlus} className="me-2" />
// //                                           Add Payment
// //                                         </MenuItem>
// //                                       )}
// //                                       {canViewExchangeLedger && (
// //                                         <MenuItem onClick={() => handleViewLedger(brokerData, branch.branchId)}>
// //                                           View Ledger
// //                                         </MenuItem>
// //                                       )}
// //                                     </Menu>
// //                                   </CTableDataCell>
// //                                 )}
// //                               </CTableRow>
// //                             );
// //                           })}
// //                       </>
// //                     );
// //                   })
// //                 )}
// //               </CTableBody>
// //             </CTable>
// //           </div>
// //         </CCardBody>
// //       </CCard>

// //       <CModal alignment="center" visible={showFilterModal} onClose={() => setShowFilterModal(false)}>
// //         <CModalHeader>
// //           <CModalTitle>Search</CModalTitle>
// //         </CModalHeader>
// //         <CModalBody>
// //           <div className="mb-3">
// //             <CFormLabel>Select Branch</CFormLabel>
// //             <CFormSelect 
// //               value={selectedBranch} 
// //               onChange={(e) => setSelectedBranch(e.target.value)}
// //               disabled={!canViewExchangeLedger}
// //             >
// //               <option value="ALL">All Branches</option>
             
// //               {branches.map((branch) => (
// //                 <option key={branch._id} value={branch._id}>
// //                   {branch.name || 'N/A'}
// //                 </option>
// //               ))}
// //             </CFormSelect>
// //           </div>
// //         </CModalBody>
// //         <CModalFooter>
// //           <CButton 
// //             color="primary" 
// //             onClick={handleBranchFilter}
// //             disabled={!canViewExchangeLedger}
// //           >
// //             Search
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>
      
// //       {/* Export Report Modal */}
// //       <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal} size="lg">
// //         <CModalHeader>
// //           <CModalTitle>
// //             <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
// //             Export Brokers Report
// //           </CModalTitle>
// //         </CModalHeader>
// //         <CModalBody>
// //           {exportError && (
// //             <CAlert color="warning" className="mb-3">
// //               {exportError}
// //             </CAlert>
// //           )}
          
// //           <LocalizationProvider 
// //             dateAdapter={AdapterDateFns} 
// //             adapterLocale={enIN}
// //           >
// //             <div className="mb-3">
// //               <CFormLabel>Select Branch</CFormLabel>
// //               <CFormSelect 
// //                 value={exportBranchId} 
// //                 onChange={(e) => {
// //                   setExportBranchId(e.target.value);
// //                   setExportError('');
// //                 }}
// //                 disabled={!canCreateExchangeLedger}
// //               >
// //                 <option value="">-- Select Branch --</option>
// //                 <option value="ALL">All Branches</option>
// //                 {branches.map((branch) => (
// //                   <option key={branch._id} value={branch._id}>
// //                     {branch.name || 'N/A'}
// //                   </option>
// //                 ))}
// //               </CFormSelect>
// //             </div>
            
// //             <div className="mb-3">
// //               <DatePicker
// //                 label="Start Date"
// //                 value={exportStartDate}
// //                 onChange={(newValue) => {
// //                   setExportStartDate(newValue);
// //                   setExportError('');
// //                 }}
// //                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
// //                 inputFormat="dd/MM/yyyy"
// //                 mask="__/__/____"
// //                 views={['day', 'month', 'year']}
// //                 disabled={!canCreateExchangeLedger}
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <DatePicker
// //                 label="End Date"
// //                 value={exportEndDate}
// //                 onChange={(newValue) => {
// //                   setExportEndDate(newValue);
// //                   setExportError('');
// //                 }}
// //                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
// //                 inputFormat="dd/MM/yyyy"
// //                 mask="__/__/____"
// //                 minDate={exportStartDate}
// //                 views={['day', 'month', 'year']}
// //                 disabled={!canCreateExchangeLedger}
// //               />
// //             </div>
// //           </LocalizationProvider>
// //         </CModalBody>
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={handleCloseExportModal}>
// //             Cancel
// //           </CButton>
// //           <CButton 
// //             className="submit-button"
// //             onClick={handleExcelExport}
// //             disabled={!exportStartDate || !exportEndDate || !exportBranchId || !canCreateExchangeLedger || exportLoading}
// //           >
// //             {exportLoading ? (
// //               <>
// //                 <CSpinner size="sm" className="me-2" />
// //                 Exporting...
// //               </>
// //             ) : 'Export Excel'}
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>
      
// //       <ExchangeLedgerModel 
// //         show={showModal} 
// //         onClose={() => setShowModal(false)} 
// //         brokerData={selectedledger} 
// //         refreshData={fetchData}
// //         onPaymentSaved={handlePaymentSaved}
// //         canCreateExchangeLedger={canCreateExchangeLedger}
// //         onPaymentSuccess={(receiptId) => {
// //           if (receiptId) {
// //             setTimeout(() => {
// //               printBrokerReceipt(receiptId);
// //             }, 500);
// //           }
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // export default ExchangeLedger;









// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   Menu,
// //   MenuItem,
// //   useTableFilter,
// //   usePagination,
// //   axiosInstance,
// //   showError
// // } from '../../utils/tableImports';
// // import tvsLogo from '../../assets/images/logo.png';
// // import '../../css/invoice.css';
// // import config from '../../config';
// // import ExchangeLedgerModel from './ExchangeLedgerModel';
// // import {
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
// //   CModal,
// //   CModalHeader,
// //   CModalTitle,
// //   CModalBody,
// //   CModalFooter,
// //   CButton,
// //   CFormSelect,
// //   CAlert,
// //   CDropdown,
// //   CDropdownToggle,
// //   CDropdownMenu,
// //   CDropdownItem
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilPlus, cilSettings, cilSearch, cilZoomOut, cilPrint, cilCloudDownload } from '@coreui/icons';
// // import { useAuth } from '../../context/AuthContext';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faFileExcel, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import TextField from '@mui/material/TextField';
// // import Swal from 'sweetalert2';
// // import QRCode from 'qrcode';

// // // Import date-fns locale for Indian date format
// // import { enIN } from 'date-fns/locale';

// // // Import permission utilities
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   canCreateInPage,
// //   canUpdateInPage,
// //   canDeleteInPage 
// // } from '../../utils/modulePermissions';
// // import { useCallback } from 'react';

// // const ExchangeLedger = () => {
// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const [menuId, setMenuId] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedledger, setSelectedledger] = useState(null);
// //   const [groupedData, setGroupedData] = useState([]);
// //   const [expandedBrokers, setExpandedBrokers] = useState({});
// //   const [showFilterModal, setShowFilterModal] = useState(false);
// //   const [branches, setBranches] = useState([]);
// //   const [selectedBranch, setSelectedBranch] = useState('');
// //   const [isFiltered, setIsFiltered] = useState(false);
// //   const [selectedBranchName, setSelectedBranchName] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
  
// //   // ============ RECEIPTS FETCHING STATES ============
// //   const [transactionsData, setTransactionsData] = useState({});
// //   const [loadingTransactions, setLoadingTransactions] = useState({});
// //   const [transactionsFetched, setTransactionsFetched] = useState({});
  
// //   // Export modal state
// //   const [showExportModal, setShowExportModal] = useState(false);
// //   const [exportStartDate, setExportStartDate] = useState(null);
// //   const [exportEndDate, setExportEndDate] = useState(null);
// //   const [exportBranchId, setExportBranchId] = useState('');
// //   const [exportError, setExportError] = useState('');
// //   const [exportLoading, setExportLoading] = useState(false);

// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const { permissions } = useAuth();

// //   // Page-level permission checks for Exchange Ledger under ACCOUNT module
// //   const canViewExchangeLedger = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
// //   const canCreateExchangeLedger = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
// //   const canUpdateExchangeLedger = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
// //   const canDeleteExchangeLedger = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  
// //   const showActionColumn = canCreateExchangeLedger || canViewExchangeLedger;

// //   // Format date to DD-MM-YYYY for display
// //   const formatDateDDMMYYYY = (date) => {
// //     if (!date) return '';
// //     const day = String(date.getDate()).padStart(2, '0');
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const year = date.getFullYear();
// //     return `${day}-${month}-${year}`;
// //   };

// //   // Format date to YYYY-MM-DD for API
// //   const formatDateForAPI = (date) => {
// //     if (!date) return '';
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const day = String(date.getDate()).padStart(2, '0');
// //     return `${year}-${month}-${day}`;
// //   };

// //   useEffect(() => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     fetchData();
// //     fetchBranches();
// //   }, [canViewExchangeLedger]);

// //   useEffect(() => {
// //     if (data.length > 0) {
// //       const grouped = groupDataByBroker(data, isFiltered);
// //       setGroupedData(grouped);
// //       setFilteredData(grouped);
      
// //       // Initialize transactions data structure
// //       const initialTransactionsMap = {};
// //       grouped.forEach(brokerData => {
// //         const key = brokerData.broker._id;
// //         initialTransactionsMap[key] = [];
        
// //         // Also initialize for branches if needed
// //         if (!isFiltered && brokerData.branches) {
// //           brokerData.branches.forEach(branch => {
// //             const branchKey = `${brokerData.broker._id}-${branch.branchId}`;
// //             initialTransactionsMap[branchKey] = [];
// //           });
// //         }
// //       });
// //       setTransactionsData(initialTransactionsMap);
// //     }
// //   }, [data, isFiltered]);

// //   const fetchBranches = async () => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     try {
// //       const response = await axiosInstance.get('/branches');
// //       setBranches(response.data.data);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //   };

// //   const fetchData = async (branchId = null) => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
// //       let url = '/broker-ledger/summary/detailed';
// //       if (branchId) {
// //         url = `/broker-ledger/summary/branch/${branchId}`;
// //       }

// //       const response = await axiosInstance.get(url);

// //       if (branchId) {
// //         const branchName = branches.find((b) => b._id === branchId)?.name || 'Selected Branch';
// //         setSelectedBranchName(branchName);

// //         const branchData = response.data.data.brokers.map((broker) => ({
// //           broker: broker.broker,
// //           branch: {
// //             _id: response.data.data.branch,
// //             name: branchName
// //           },
// //           bookings: {
// //             total: broker.totalBookings,
// //             details: []
// //           },
// //           financials: {
// //             totalExchangeAmount: broker.totalExchangeAmount,
// //             ledger: {
// //               currentBalance: broker.ledger.currentBalance,
// //               onAccount: broker.ledger.onAccount,
// //               totalCredit: broker.ledger.totalCredit || 0,
// //               totalDebit: broker.ledger.totalDebit || 0,
// //               outstandingAmount: broker.ledger.outstandingAmount || 0,
// //               transactions: broker.ledger.transactions || 0
// //             },
// //             summary: {
// //               totalReceived: broker.summary?.totalReceived || 0,
// //               totalPayable: broker.summary?.totalPayable || 0,
// //               netBalance: broker.ledger.currentBalance
// //             }
// //           },
// //           recentTransactions: [],
// //           association: {
// //             isActive: true
// //           }
// //         }));

// //         setData(branchData);
// //         setIsFiltered(true);
// //       } else {
// //         setData(response.data.data.brokers);
// //         setIsFiltered(false);
// //         setSelectedBranchName('');
// //       }
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ============ FETCH TRANSACTIONS FOR BROKER (REQUIRES BOTH IDs) ============
// //   const fetchTransactionsForBroker = useCallback(async (brokerId, branchId) => {
// //     // Both IDs are required - don't proceed if either is missing
// //     if (!brokerId || !branchId) {
// //       console.log('Cannot fetch transactions: Both brokerId and branchId are required');
// //       return;
// //     }
    
// //     const key = `${brokerId}-${branchId}`;
    
// //     if (transactionsFetched[key] || loadingTransactions[key]) {
// //       return;
// //     }

// //     try {
// //       setLoadingTransactions(prev => ({ ...prev, [key]: true }));
      
// //       const response = await axiosInstance.get(`/broker-ledger/branch-transactions/${brokerId}/${branchId}`);
      
// //       const transactions = response.data.data.transactions || [];
      
// //       setTransactionsData(prev => ({
// //         ...prev,
// //         [key]: transactions
// //       }));
      
// //       setTransactionsFetched(prev => ({
// //         ...prev,
// //         [key]: true
// //       }));
// //     } catch (error) {
// //       console.error(`Error fetching transactions for broker ${brokerId} and branch ${branchId}:`, error);
// //       setTransactionsData(prev => ({
// //         ...prev,
// //         [key]: []
// //       }));
// //       setTransactionsFetched(prev => ({
// //         ...prev,
// //         [key]: true
// //       }));
// //     } finally {
// //       setLoadingTransactions(prev => ({ ...prev, [key]: false }));
// //     }
// //   }, [transactionsFetched, loadingTransactions]);

// //   // ============ PRINT RECEIPT FUNCTION - FIXED ============
// //   const printBrokerReceipt = async (transactionId) => {
// //     try {
// //       console.log('Fetching transaction with ID:', transactionId);
      
// //       const response = await axiosInstance.get(`/broker-ledger/transaction/${transactionId}`);
// //       console.log('Transaction response:', response.data);
      
// //       const transaction = response.data.data;
      
// //       if (!transaction) {
// //         showError('Transaction data not found');
// //         return;
// //       }
      
// //       const receivedDate = transaction.dateFormatted || 
// //                           new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
      
// //       const currentDate = new Date().toLocaleDateString('en-GB');
      
// //       const brokerName = transaction.broker?.name || 'N/A';
// //       const branchName = transaction.branch?.name || 'N/A';
// //       const branchAddress = transaction.branch?.address || '';
// //       const branchPhone = transaction.branch?.phone || '';
// //       const branchEmail = transaction.branch?.email || '';
      
// //       const qrText = `GANDHI MOTORS PVT LTD
// // Broker: ${brokerName}
// // Branch: ${branchName}
// // Receipt No: ${transaction.referenceNumber || transaction._id}
// // Amount: ₹${transaction.amount || 0}
// // Payment Mode: ${transaction.modeOfPayment || 'Cash'}
// // Date: ${receivedDate}`;

// //       let qrCodeImage = '';
// //       try {
// //         qrCodeImage = await QRCode.toDataURL(qrText, {
// //           width: 150,
// //           margin: 2,
// //           color: {
// //             dark: '#000000',
// //             light: '#FFFFFF'
// //           },
// //           errorCorrectionLevel: 'H'
// //         });
// //       } catch (error) {
// //         console.error('Error generating QR code:', error);
// //         qrCodeImage = 'data:image/svg+xml;base64,' + btoa(`
// //           <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
// //             <rect width="150" height="150" fill="white"/>
// //             <rect x="10" y="10" width="130" height="130" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
// //             <text x="75" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">QR CODE</text>
// //             <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${transaction.referenceNumber || ''}</text>
// //           </svg>
// //         `);
// //       }

// //       const receiptHTML = generateReceiptHTML(transaction, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail);

// //       const printWindow = window.open('', '_blank');
// //       printWindow.document.write(receiptHTML);
// //       printWindow.document.close();
      
// //       printWindow.onload = function() {
// //         printWindow.focus();
// //         printWindow.print();
// //       };
      
// //     } catch (err) {
// //       console.error('Error fetching transaction details:', err);
// //       console.error('Error response:', err.response?.data);
// //       showError('Failed to load receipt. Please try again.');
// //     }
// //   };

// //   // ============ GENERATE RECEIPT HTML ============
// //   // ============ GENERATE RECEIPT HTML ============
// // const generateReceiptHTML = (transaction, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail) => {
// //   const receiptNumber = transaction.referenceNumber || transaction._id || 'N/A';
// //   const amount = transaction.amount || 0;
// //   const paymentMode = transaction.modeOfPayment || 'Cash';
// //   const remark = transaction.remark || '';
// //   const referenceNumber = transaction.referenceNumber || '';
// //   const approvalStatus = transaction.approvalStatus || 'Pending';
// //   const cashLocation = transaction.cashLocation?.name || '';
// //   const bankName = transaction.bank?.name || '';
// //   const subPaymentMode = transaction.subPaymentMode?.payment_mode || '';
  
// //   const amountInWords = numberToWordsSimple(amount);

// //   return `<!DOCTYPE html>
// // <html>
// // <head>
// //   <title>Broker Payment Receipt - ${receiptNumber}</title>
// //   <style>
// //     body {
// //       font-family: "Courier New", Courier, monospace;
// //       margin: 0;
// //       padding: 10mm;
// //       font-size: 15px;
// //       color: #333;
// //     }
// //     .page {
// //       width: 210mm;
// //       margin: 0 auto;
// //     }
// //     .receipt-copy {
// //       height: auto;
// //       min-height: 130mm;
// //       page-break-inside: avoid;
// //     }
// //     .header-container {
// //       display: flex;
// //       justify-content: space-between;
// //       margin-bottom: 2mm;
// //       align-items: flex-start;
// //     }
// //     .header-left {
// //       width: 60%;
// //     }
// //     .header-right {
// //       width: 40%;
// //       text-align: right;
// //       display: flex;
// //       flex-direction: column;
// //       align-items: flex-end;
// //     }
// //     .logo-qr-container {
// //       display: flex;
// //       align-items: center;
// //       gap: 10px;
// //       justify-content: flex-end;
// //       margin-bottom: 5px;
// //       width: 100%;
// //     }
// //     .logo {
// //       height: 51px;
// //     }
// //     .qr-code-small {
// //       width: 81px;
// //       height: 81px;
// //       border: 1px solid #ccc;
// //     }
// //     .dealer-info {
// //       text-align: left;
// //       font-size: 13px;
// //       line-height: 1.2;
// //     }
// //     .dealer-name {
// //       font-size: 17px;
// //       font-weight: bold;
// //       margin: 0 0 3px 0;
// //     }
// //     .broker-info-container {
// //       display: flex;
// //       font-size: 14px;
// //       margin: 10px 0;
// //     }
// //     .broker-info-left {
// //       width: 50%;
// //     }
// //     .broker-info-right {
// //       width: 50%;
// //     }
// //     .info-row {
// //       margin: 2mm 0;
// //       line-height: 1.2;
// //     }
// //     /* Style for values in info rows */
// //     .info-row .value {
// //       font-weight: 700;
// //     }
// //     .divider {
// //       border-top: 2px solid #AAAAAA;
// //       margin: 3mm 0;
// //     }
// //     .receipt-info {
// //       background-color: #f8f9fa;
// //       border: 1px solid #dee2e6;
// //       border-radius: 4px;
// //       padding: 9px;
// //       margin: 11px 0;
// //       font-size: 14px;
// //     }
// //     .receipt-info .value {
// //       font-weight: 700;
// //     }
// //     .payment-info-box {
// //       margin: 11px 0;
// //     }
// //     .signature-box {
// //       margin-top: 16mm;
// //       font-size: 11pt;
// //     }
// //     .signature-line {
// //       border-top: 1px dashed #000;
// //       width: 41mm;
// //       display: inline-block;
// //       margin: 0 5mm;
// //     }
// //     .cutting-line {
// //       border-top: 2px dashed #333;
// //       margin: 16mm 0 11mm 0;
// //       text-align: center;
// //       position: relative;
// //     }
// //     .cutting-line::before {
// //       content: "✂ Cut Here ✂";
// //       position: absolute;
// //       top: -11px;
// //       left: 50%;
// //       transform: translateX(-50%);
// //       background: white;
// //       padding: 0 11px;
// //       font-size: 13px;
// //       color: #666;
// //     }
// //     .note {
// //       padding: 2px;
// //       margin: 3px;
// //       font-size: 12px;
// //     }
// //     .note .value {
// //       font-weight: 700;
// //     }
// //     .amount-in-words {
// //       font-style: italic;
// //       margin-top: 9px;
// //       padding: 6px;
// //       font-size: 13px;
// //       border-top: 1px dashed #ccc;
// //     }
// //     .amount-in-words .value {
// //       font-weight: 700;
// //       font-style: normal;
// //     }
// //     .status-badge {
// //       display: inline-block;
// //       padding: 4px 9px;
// //       border-radius: 12px;
// //       font-size: 12px;
// //       font-weight: bold;
// //       background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
// //       color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
// //       border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
// //     }
// //     .footer-note {
// //       font-size: 10px;
// //       color: #777;
// //       text-align: center;
// //       margin-top: 5mm;
// //     }
// //     .payment-details {
// //       margin-top: 10px;
// //       border-collapse: collapse;
// //       width: 100%;
// //     }
// //     .payment-details td {
// //       padding: 4px;
// //       border: none;
// //     }
// //     /* 2-column grid for payment info */
// //     .payment-grid-2col {
// //       display: grid;
// //       grid-template-columns: 1fr 1fr;
// //       gap: 4px 15px;
// //       padding: 4px;
// //       font-size: 14px;
// //     }
// //     .payment-grid-item {
// //       padding: 2px 0;
// //       line-height: 1.3;
// //     }
// //     .payment-grid-item strong {
// //       font-weight: 600;
// //       margin-right: 5px;
// //       min-width: 110px;
// //       display: inline-block;
// //     }
// //     .payment-grid-item .value {
// //       font-weight: 700;
// //     }
// //     @page {
// //       size: A4;
// //       margin: 10mm;
// //     }
// //     @media print {
// //       body {
// //         padding: 0;
// //       }
// //       .receipt-copy {
// //         page-break-inside: avoid;
// //       }
// //     }
// //   </style>
// // </head>
// // <body>
// //   <div class="page">
// //     <!-- FIRST COPY -->
// //     <div class="receipt-copy">
// //       <div class="header-container">
// //         <div class="header-left">
// //           <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
// //           <div class="dealer-info">
// //             Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
// //             Upnagar, Nashik Road, Nashik - 422101<br>
// //             Phone: 7498903672
// //           </div>
// //         </div>
// //         <div class="header-right">
// //           <div class="logo-qr-container">
// //             <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
// //             ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
// //           </div>
// //           <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
// //           <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
// //         </div>
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="receipt-info">
// //         <div><strong>BROKER PAYMENT RECEIPT</strong></div>
// //         <div><strong>Receipt Date:</strong> <span class="value">${receivedDate}</span></div>
// //       </div>

// //       <div class="broker-info-container">
// //         <div class="broker-info-left">
// //           <div class="info-row"><strong>Broker Name:</strong> <span class="value">${brokerName}</span></div>
// //           <div class="info-row"><strong>Branch:</strong> <span class="value">${branchName}</span></div>
// //           <div class="info-row"><strong>Payment Mode:</strong> <span class="value">${paymentMode}</span></div>
// //           ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> <span class="value">${cashLocation}</span></div>` : ''}
// //           ${bankName ? `<div class="info-row"><strong>Bank:</strong> <span class="value">${bankName}</span></div>` : ''}
// //         </div>
// //         <div class="broker-info-right">
// //           <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
// //           ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> <span class="value">${subPaymentMode}</span></div>` : ''}
// //           <div class="info-row"><strong>Branch Address:</strong> <span class="value">${branchAddress}</span></div>
// //           <div class="info-row"><strong>Branch Phone:</strong> <span class="value">${branchPhone}</span></div>
// //         </div>
// //       </div>

// //       <div class="payment-info-box">
// //         <div class="receipt-info" style="padding: 5px;">
// //           <!-- Payment Information Grid - 2 columns (2 rows) with existing fields only -->
// //           <div class="payment-grid-2col">
// //             <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
           
// //           </div>
// //         </div>
        
// //         <div class="amount-in-words">
// //           <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
// //         </div>
// //       </div>

// //       <div class="note">
// //         <strong>Notes:</strong> <span class="value">This is a system generated receipt for Broker On-Account payment.</span>
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="signature-box">
// //         <div style="display: flex; justify-content: space-between;">
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Broker's Signature</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Authorised Signatory</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Accountant</div>
// //           </div>
// //         </div>
// //       </div>
      
// //       <div class="footer-note">
// //         This is a computer generated receipt - valid without signature
// //       </div>
// //     </div>

// //     <!-- CUTTING LINE -->
// //     <div class="cutting-line"></div>

// //     <!-- SECOND COPY (DUPLICATE) -->
// //     <div class="receipt-copy">
// //       <div class="header-container">
// //         <div class="header-left">
// //           <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
// //           <div class="dealer-info">
// //             Authorized Main Dealer: TVS Motor Company Ltd.<br>
// //             Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
// //             Upnagar, Nashik Road, Nashik - 422101<br>
// //             Phone: 7498903672
// //           </div>
// //         </div>
// //         <div class="header-right">
// //           <div class="logo-qr-container">
// //             <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
// //             ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
// //           </div>
// //           <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
// //           <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
// //         </div>
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="receipt-info">
// //         <div><strong>BROKER PAYMENT RECEIPT (DUPLICATE)</strong></div>
// //         <div><strong>Receipt Date:</strong> <span class="value">${receivedDate}</span></div>
// //       </div>

// //       <div class="broker-info-container">
// //         <div class="broker-info-left">
// //           <div class="info-row"><strong>Broker Name:</strong> <span class="value">${brokerName}</span></div>
// //           <div class="info-row"><strong>Branch:</strong> <span class="value">${branchName}</span></div>
// //           <div class="info-row"><strong>Payment Mode:</strong> <span class="value">${paymentMode}</span></div>
// //           ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> <span class="value">${cashLocation}</span></div>` : ''}
// //           ${bankName ? `<div class="info-row"><strong>Bank:</strong> <span class="value">${bankName}</span></div>` : ''}
// //         </div>
// //         <div class="broker-info-right">
// //           <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
// //           ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> <span class="value">${subPaymentMode}</span></div>` : ''}
// //           <div class="info-row"><strong>Branch Address:</strong> <span class="value">${branchAddress}</span></div>
// //           <div class="info-row"><strong>Branch Phone:</strong> <span class="value">${branchPhone}</span></div>
// //         </div>
// //       </div>

// //       <div class="payment-info-box">
// //         <div class="receipt-info" style="padding: 5px;">
// //           <!-- Payment Information Grid - 2 columns (2 rows) with existing fields only -->
// //           <div class="payment-grid-2col">
// //             <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
            
// //         </div>
        
// //         <div class="amount-in-words">
// //           <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
// //         </div>
// //       </div>

// //       <div class="note">
// //         <strong>Notes:</strong> <span class="value">This is a system generated receipt for Broker On-Account payment.</span>
// //       </div>
      
// //       <div class="divider"></div>

// //       <div class="signature-box">
// //         <div style="display: flex; justify-content: space-between;">
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Broker's Signature</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Authorised Signatory</div>
// //           </div>
// //           <div style="text-align:center; width: 30%;">
// //             <div class="signature-line"></div>
// //             <div>Accountant</div>
// //           </div>
// //         </div>
// //       </div>
      
// //       <div class="footer-note">
// //         This is a computer generated receipt - valid without signature
// //       </div>
// //     </div>
// //   </div>
// // </body>
// // </html>`;
// // };

// //   // ============ SIMPLE NUMBER TO WORDS FUNCTION ============
// //   const numberToWordsSimple = (num) => {
// //     if (num === 0) return 'Zero';
    
// //     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
// //                   'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
// //                   'Seventeen', 'Eighteen', 'Nineteen'];
// //     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
// //     const numToWords = (n) => {
// //       if (n < 20) return ones[n];
// //       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
// //       if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
// //       if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
// //       if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
// //       return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
// //     };
    
// //     return numToWords(Math.floor(num)) + (num % 1 ? ' point ' + num.toString().split('.')[1] : '');
// //   };

// //   const handleBranchFilter = async () => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     if (selectedBranch) {
// //       await fetchData(selectedBranch);
// //     } else {
// //       await fetchData();
// //     }
// //     setShowFilterModal(false);
// //   };

// //   const clearFilter = async () => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     setSelectedBranch('');
// //     await fetchData();
// //     setShowFilterModal(false);
// //   };

// //   const groupDataByBroker = (brokersData, isFilteredMode = false) => {
// //     const brokerMap = {};

// //     brokersData.forEach((item) => {
// //       const brokerId = item.broker._id;

// //       if (!brokerMap[brokerId]) {
// //         brokerMap[brokerId] = {
// //           broker: item.broker,
// //           branches: [],
// //           totalBookings: 0,
// //           totalExchangeAmount: 0,
// //           totalCredit: 0,
// //           totalDebit: 0,
// //           onAccount: 0,
// //           currentBalance: 0,
// //           outstandingAmount: 0
// //         };
// //       }

// //       if (isFilteredMode) {
// //         brokerMap[brokerId].branches = [
// //           {
// //             name: item.branch.name,
// //             branchId: item.branch._id,
// //             bookings: item.bookings.total,
// //             exchangeAmount: item.financials.totalExchangeAmount,
// //             credit: item.financials.ledger.totalCredit,
// //             debit: item.financials.ledger.totalDebit,
// //             onAccount: item.financials.ledger.onAccount,
// //             currentBalance: item.financials.ledger.currentBalance,
// //             outstandingAmount: item.financials.ledger.outstandingAmount
// //           }
// //         ];

// //         brokerMap[brokerId].totalBookings = item.bookings.total;
// //         brokerMap[brokerId].totalExchangeAmount = item.financials.totalExchangeAmount;
// //         brokerMap[brokerId].totalCredit = item.financials.ledger.totalCredit;
// //         brokerMap[brokerId].totalDebit = item.financials.ledger.totalDebit;
// //         brokerMap[brokerId].onAccount = item.financials.ledger.onAccount;
// //         brokerMap[brokerId].currentBalance = item.financials.ledger.currentBalance;
// //         brokerMap[brokerId].outstandingAmount = item.financials.ledger.outstandingAmount;
// //       } else {
// //         brokerMap[brokerId].branches.push({
// //           name: item.branch.name,
// //           branchId: item.branch._id,
// //           bookings: item.bookings.total,
// //           exchangeAmount: item.financials.totalExchangeAmount,
// //           credit: item.financials.ledger.totalCredit,
// //           debit: item.financials.ledger.totalDebit,
// //           onAccount: item.financials.ledger.onAccount,
// //           currentBalance: item.financials.ledger.currentBalance,
// //           outstandingAmount: item.financials.ledger.outstandingAmount
// //         });

// //         brokerMap[brokerId].totalBookings += item.bookings.total;
// //         brokerMap[brokerId].totalExchangeAmount += item.financials.totalExchangeAmount;
// //         brokerMap[brokerId].totalCredit += item.financials.ledger.totalCredit;
// //         brokerMap[brokerId].totalDebit += item.financials.ledger.totalDebit;
// //         brokerMap[brokerId].onAccount += item.financials.ledger.onAccount;
// //         brokerMap[brokerId].currentBalance += item.financials.ledger.currentBalance;
// //         brokerMap[brokerId].outstandingAmount += item.financials.ledger.outstandingAmount;
// //       }
// //     });

// //     return Object.values(brokerMap);
// //   };

// //   const toggleBrokerExpansion = (brokerId) => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     if (!isFiltered) {
// //       setExpandedBrokers((prev) => ({
// //         ...prev,
// //         [brokerId]: !prev[brokerId]
// //       }));
// //     }
// //   };

// //   const handleClick = (event, id, brokerData = null, branchId = null) => {
// //     if (!canViewExchangeLedger && !canCreateExchangeLedger) {
// //       return;
// //     }
    
// //     setAnchorEl(event.currentTarget);
// //     setMenuId(id);
// //     if (brokerData) {
// //       setSelectedledger({ ...brokerData, branchId });
// //     }
// //   };

// //   const handleClose = () => {
// //     setAnchorEl(null);
// //     setMenuId(null);
// //   };

// //   const handleAddClick = (brokerData, branchId = null) => {
// //     if (!canCreateExchangeLedger) {
// //       showError('You do not have permission to add payments');
// //       return;
// //     }
    
// //     setSelectedledger({ ...brokerData, branchId });
// //     setShowModal(true);
// //     handleClose();
// //   };

// //   const handleViewLedger = async (brokerData, branchId = null) => {
// //     if (!canViewExchangeLedger) {
// //       showError('You do not have permission to view ledgers');
// //       return;
// //     }
    
// //     try {
// //       let url = `/broker-ledger/statement/${brokerData.broker?._id}`;
// //       if (branchId) {
// //         url += `?branchId=${branchId}`;
// //       }

// //       const res = await axiosInstance.get(url);
// //       const ledgerData = res.data.data;
// //       const ledgerUrl = `${config.baseURL}/brokerData.html?ledgerId=${brokerData._id}`;
// //       let totalCredit = 0;
// //       let totalDebit = 0;
// //       const totalOnAccount = ledgerData.summary?.totalOnAccount ?? ledgerData.onAccountBalance ?? 0;

// //       ledgerData.transactions?.forEach((entry) => {
// //         if (entry.type === 'CREDIT') {
// //           totalCredit += entry.amount;
// //         } else if (entry.type === 'DEBIT') {
// //           totalDebit += entry.amount;
// //         }
// //       });
// //       const finalBalance = totalDebit - totalCredit;
// //       const availableOnAccount2 = totalOnAccount - totalCredit;

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
// //                   <div><strong>Broker Name:</strong> ${ledgerData.broker?.name || 'N/A'}</div>
// //                   <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
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
// //                     ${ledgerData.transactions
// //   ?.map(
// //     (entry) => {
// //       let exchangeVehicleNumber = '';
// //       let exchangeChassisNumber = '';
// //       let exchangePrice = '';
// //       let exchangeStatus = '';
// //       let bookingNumber = entry.booking?.bookingNumber || '';
      
// //       if (entry.exchangeVehicle && entry.exchangeVehicle.VehicleNumber) {
// //         exchangeVehicleNumber = entry.exchangeVehicle.VehicleNumber || '';
// //         exchangeChassisNumber = entry.exchangeVehicle.ChassisNumber || '';
// //         exchangePrice = entry.exchangeVehicle.PriceFormatted || '';
// //         exchangeStatus = entry.exchangeVehicle.Status || '';
// //       } else if (entry.exchangeDisplay && entry.exchangeDisplay.VehicleNumber) {
// //         exchangeVehicleNumber = entry.exchangeDisplay.VehicleNumber || '';
// //         exchangeChassisNumber = entry.exchangeDisplay.ChassisNumber || '';
// //         exchangePrice = entry.exchangeDisplay.Price || '';
// //         exchangeStatus = entry.exchangeDisplay.Status || '';
// //       } else if (entry.booking?.exchange?.display) {
// //         const exchangeDisplay = entry.booking.exchange.display;
// //         exchangeVehicleNumber = exchangeDisplay.vehicleNumber || '';
// //         exchangeChassisNumber = exchangeDisplay.chassisNumber || '';
// //         exchangePrice = exchangeDisplay.price ? `₹${exchangeDisplay.price.toLocaleString('en-IN')}` : '';
// //         exchangeStatus = exchangeDisplay.status || '';
// //       } else if (entry.booking?.exchange?.details) {
// //         const exchangeDetails = entry.booking.exchange.details;
// //         exchangeVehicleNumber = exchangeDetails.vehicleNumber || '';
// //         exchangeChassisNumber = exchangeDetails.chassisNumber || '';
// //         exchangePrice = exchangeDetails.price ? `₹${exchangeDetails.price.toLocaleString('en-IN')}` : '';
// //         exchangeStatus = exchangeDetails.status || '';
// //       }
      
// //       return `
// //       <tr>
// //         <td>${new Date(entry.date).toLocaleDateString() || 'N/A'}</td>
// //         <td>
// //           Booking No: ${bookingNumber || '-'}<br>
// //           Customer: ${entry.booking?.customer?.name || '-'}<br>
       
// //           ${entry.mode || ''}
// //           ${exchangeVehicleNumber ? `<br>Exchange Vehicle: ${exchangeVehicleNumber}` : ''}
// //           ${exchangeChassisNumber ? `<br>Exchange Chassis: ${exchangeChassisNumber}` : ''}
// //         </td>
// //         <td>${entry.receiptNumber || ''}</td>
// //         <td class="text-right">${entry.type === 'CREDIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
// //         <td class="text-right">${entry.type === 'DEBIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
// //         <td class="text-right"></td>
// //       </tr>
// //     `;
// //     }
// //   )
// //   .join('')}
// //                       <tr>
// //                       <td colspan="3" class="text-left"><strong>Total OnAccount</strong></td>
// //                       <td class="text-right"></td>
// //                       <td class="text-right"></td>
// //                       <td class="text-right"><strong>${availableOnAccount2.toLocaleString('en-IN')}</strong></td>
// //                     </tr>
// //                     <tr>
// //                       <td colspan="3" class="text-left"><strong>Total</strong></td>
// //                       <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
// //                       <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
// //                       <td class="text-right"><strong>${finalBalance.toLocaleString('en-IN')}</strong></td>
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
// //       const message = showError(err);
// //       if (message) {
// //         setError(message);
// //       }
// //     }
// //     handleClose();
// //   };

// //   const handleSearch = (value) => {
// //     if (!canViewExchangeLedger) {
// //       return;
// //     }
    
// //     setSearchTerm(value);
// //     handleFilter(value, ['broker.name']);
// //   };

// //   const handlePaymentSaved = (message) => {
// //     setSuccessMessage(message);
// //     setTimeout(() => setSuccessMessage(''), 3000);
// //     fetchData();
// //   };

// //   const handleOpenExportModal = () => {
// //     if (!canCreateExchangeLedger) {
// //       showError('You do not have permission to export reports');
// //       return;
// //     }
    
// //     setShowExportModal(true);
// //     setExportError('');
// //     if (isFiltered && selectedBranch) {
// //       setExportBranchId(selectedBranch);
// //     }
// //   };

// //   const handleCloseExportModal = () => {
// //     setShowExportModal(false);
// //     setExportStartDate(null);
// //     setExportEndDate(null);
// //     setExportBranchId('');
// //     setExportError('');
// //     setExportLoading(false);
// //   };

// //   const handleExcelExport = async () => {
// //     if (!canCreateExchangeLedger) {
// //       showError('You do not have permission to export reports');
// //       return;
// //     }
    
// //     setExportError('');
    
// //     if (!exportBranchId) {
// //       setExportError('Please select a branch');
// //       return;
// //     }

// //     if (!exportStartDate || !exportEndDate) {
// //       setExportError('Please select both start and end dates');
// //       return;
// //     }

// //     if (exportStartDate > exportEndDate) {
// //       setExportError('Start date cannot be after end date');
// //       return;
// //     }

// //     try {
// //       setExportLoading(true);
      
// //       const formattedStartDate = formatDateForAPI(exportStartDate);
// //       const formattedEndDate = formatDateForAPI(exportEndDate);

// //       const params = new URLSearchParams({
// //         branchId: exportBranchId,
// //         startDate: formattedStartDate,
// //         endDate: formattedEndDate
// //       });

// //       const response = await axiosInstance.get(
// //         `/reports/brokers?${params.toString()}`,
// //         { responseType: 'blob' }
// //       );

// //       const contentType = response.headers['content-type'];
      
// //       if (contentType && contentType.includes('application/json')) {
// //         const text = await new Promise((resolve, reject) => {
// //           const reader = new FileReader();
// //           reader.onload = () => resolve(reader.result);
// //           reader.onerror = reject;
// //           reader.readAsText(response.data);
// //         });
        
// //         const errorData = JSON.parse(text);
        
// //         if (!errorData.success && errorData.message) {
// //           setExportError(errorData.message);
// //           Swal.fire({
// //             icon: 'error',
// //             title: 'Export Failed',
// //             text: errorData.message,
// //           });
// //           return;
// //         }
// //       }

// //       const blob = new Blob([response.data], { 
// //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
// //       });
      
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement('a');
// //       link.href = url;
      
// //       const branchName = branches.find(b => b._id === exportBranchId)?.name || 'Branch';
// //       const startDateStr = formatDateDDMMYYYY(exportStartDate);
// //       const endDateStr = formatDateDDMMYYYY(exportEndDate);
// //       const fileName = `Brokers_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
// //       link.setAttribute('download', fileName);
      
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
      
// //       window.URL.revokeObjectURL(url);
      
// //       Swal.fire({
// //         toast: true,
// //         position: 'top-end',
// //         icon: 'success',
// //         title: 'Excel exported successfully!',
// //         showConfirmButton: false,
// //         timer: 3000,
// //         timerProgressBar: true
// //       });

// //       handleCloseExportModal();
      
// //     } catch (error) {
// //       console.error('Error exporting report:', error);
      
// //       if (error.response && error.response.data instanceof Blob) {
// //         try {
// //           const text = await new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onload = () => resolve(reader.result);
// //             reader.onerror = reject;
// //             reader.readAsText(error.response.data);
// //           });
          
// //           const errorData = JSON.parse(text);
          
// //           if (errorData.message) {
// //             setExportError(errorData.message);
// //             Swal.fire({
// //               icon: 'error',
// //               title: 'Export Failed',
// //               text: errorData.message,
// //             });
// //           }
// //         } catch (parseError) {
// //           console.error('Error parsing error response:', parseError);
// //           setExportError('Failed to export report');
// //           Swal.fire({
// //             icon: 'error',
// //             title: 'Export Failed',
// //             text: 'Failed to export report',
// //           });
// //         }
// //       } else if (error.response?.data?.message) {
// //         setExportError(error.response.data.message);
// //         Swal.fire({
// //           icon: 'error',
// //           title: 'Export Failed',
// //           text: error.response.data.message,
// //         });
// //       } else if (error.message) {
// //         setExportError(error.message);
// //         Swal.fire({
// //           icon: 'error',
// //           title: 'Export Failed',
// //           text: error.message,
// //         });
// //       } else {
// //         setExportError('Failed to export report');
// //         Swal.fire({
// //           icon: 'error',
// //           title: 'Export Failed',
// //           text: 'Failed to export report',
// //         });
// //       }
      
// //     } finally {
// //       setExportLoading(false);
// //     }
// //   };

// //   if (!canViewExchangeLedger) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Exchange Ledger.
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

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         {error}
// //       </div>
// //     );
// //   }

// //   const totalColumns = isFiltered ? 12 : 13;
// //   const actionColumnIndex = showActionColumn ? 1 : 0;

// //   return (
// //     <div>
// //       <div className='title'>Exchange Ledger {isFiltered && `- ${selectedBranchName}`}</div>
      
// //       {successMessage && (
// //         <CAlert color="success" className="mb-3">
// //           {successMessage}
// //         </CAlert>
// //       )}
    
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div>
// //             <CButton 
// //               size="sm" 
// //               className="action-btn me-1"
// //               onClick={() => setShowFilterModal(true)}
// //               disabled={!canViewExchangeLedger}
// //             >
// //               <CIcon icon={cilSearch} className='me-1' />
// //               Search
// //             </CButton>
// //             {isFiltered && (
// //               <CButton 
// //                 size="sm" 
// //                 className="action-btn me-1"
// //                 onClick={clearFilter}
// //                 disabled={!canViewExchangeLedger}
// //               >
// //                 <CIcon icon={cilZoomOut} className='me-1' />
// //                 Clear Filter
// //               </CButton>
// //             )}
            
// //             {canCreateExchangeLedger && (
// //               <CButton 
// //                 size="sm" 
// //                 className="action-btn me-1"
// //                 onClick={handleOpenExportModal}
// //                 title="Export Excel Report"
// //               >
// //                 <FontAwesomeIcon icon={faFileExcel} className='me-1' />
// //                 Export Report
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
// //                 disabled={!canViewExchangeLedger}
// //               />
// //             </div>
// //           </div>
          
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   {!isFiltered && <CTableHeaderCell></CTableHeaderCell>}
// //                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //                   <CTableHeaderCell>Exchange Broker Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Mobile</CTableHeaderCell>
// //                   {!isFiltered && <CTableHeaderCell>Branch</CTableHeaderCell>}
// //                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Exchange Amount</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Received</CTableHeaderCell>
// //                   <CTableHeaderCell>Total Payable</CTableHeaderCell>
// //                   <CTableHeaderCell>Opening Balance</CTableHeaderCell>
// //                   <CTableHeaderCell>Current Balance</CTableHeaderCell>
// //                   <CTableHeaderCell>Outstanding Amount</CTableHeaderCell>
// //                   <CTableHeaderCell>Receipts</CTableHeaderCell>
// //                   {showActionColumn && <CTableHeaderCell>Actions</CTableHeaderCell>}
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {currentRecords.length === 0 ? (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan={totalColumns + actionColumnIndex} className="text-center">
// //                       No ledger details available
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 ) : (
// //                   currentRecords.map((brokerData, index) => {
// //                     const brokerId = brokerData.broker._id;
// //                     const hasTransactions = transactionsFetched[brokerId] && transactionsData[brokerId]?.length > 0;
// //                     const isLoading = loadingTransactions[brokerId];
// //                     const transactions = transactionsData[brokerId] || [];
                    
// //                     const sortedTransactions = [...transactions].sort((a, b) => {
// //                       const dateA = new Date(a.date || a.createdAt || 0);
// //                       const dateB = new Date(b.date || b.createdAt || 0);
// //                       return dateB - dateA;
// //                     });
                    
// //                     return (
// //                       <>
// //                         <CTableRow key={brokerData.broker._id} className="broker-summary-row">
// //                           {!isFiltered && (
// //                             <CTableDataCell>
// //                               <CButton
// //                                 color="link"
// //                                 size="sm"
// //                                 onClick={() => toggleBrokerExpansion(brokerData.broker._id)}
// //                                 disabled={!canViewExchangeLedger}
// //                               >
// //                                 {expandedBrokers[brokerData.broker._id] ? '▼' : '►'}
// //                               </CButton>
// //                             </CTableDataCell>
// //                           )}
// //                           <CTableDataCell>{index + 1}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.broker.name || 'N/A'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.broker.mobile || 'N/A'}</CTableDataCell>
// //                           {!isFiltered && <CTableDataCell>All Branches</CTableDataCell>}
// //                           <CTableDataCell>{brokerData.totalBookings || 0}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.totalExchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.totalCredit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.totalDebit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                           <CTableDataCell>{brokerData.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          
// //                           {/* Receipts Column - Only show for filtered view or expanded branches */}
// //                           <CTableDataCell>
// //                             {isFiltered ? (
// //                               // When filtered by branch, we can show receipts
// //                               isLoading ? (
// //                                 <CSpinner size="sm" color="info" />
// //                               ) : sortedTransactions.length > 0 ? (
// //                                 <CDropdown>
// //                                   <CDropdownToggle size="sm" color="info" variant="outline">
// //                                     {sortedTransactions.length} Receipt{sortedTransactions.length > 1 ? 's' : ''}
// //                                   </CDropdownToggle>
// //                                   <CDropdownMenu>
// //                                     {sortedTransactions.map((transaction, txIndex) => {
// //                                       const transactionId = transaction._id;
// //                                       const transactionNumber = transaction.referenceNumber || 'N/A';
// //                                       const transactionAmount = transaction.amount || 0;
// //                                       const transactionDate = transaction.dateFormatted || 
// //                                                             new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                      
// //                                       return (
// //                                         <CDropdownItem 
// //                                           key={transactionId || txIndex} 
// //                                           onClick={() => printBrokerReceipt(transactionId)}
// //                                         >
// //                                           <div className="d-flex align-items-center">
// //                                             <CIcon icon={cilPrint} className="me-2" />
// //                                             <div>
// //                                               <div><strong>Receipt #{txIndex + 1}</strong></div>
// //                                               <small>
// //                                                 ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
// //                                               </small>
// //                                             </div>
// //                                           </div>
// //                                         </CDropdownItem>
// //                                       );
// //                                     })}
// //                                   </CDropdownMenu>
// //                                 </CDropdown>
// //                               ) : transactionsFetched[brokerId] ? (
// //                                 <span className="text-muted">No receipts</span>
// //                               ) : (
// //                                 brokerData.branches && brokerData.branches.length > 0 ? (
// //                                   <CButton
// //                                     size="sm"
// //                                     color="light"
// //                                     onClick={() => fetchTransactionsForBroker(brokerId, brokerData.branches[0].branchId)}
// //                                     disabled={isLoading}
// //                                   >
// //                                     <CIcon icon={cilCloudDownload} className="me-1" />
// //                                     Load Receipts
// //                                   </CButton>
// //                                 ) : (
// //                                   <span className="text-muted">No branch data</span>
// //                                 )
// //                               )
// //                             ) : (
// //                               // When showing all branches, show message to expand
// //                               <span className="text-muted small">Expand to view receipts</span>
// //                             )}
// //                           </CTableDataCell>
                          
// //                           {showActionColumn && (
// //                             <CTableDataCell>
// //                               <CButton
// //                                 size="sm"
// //                                 className='option-button btn-sm'
// //                                 onClick={(event) => handleClick(event, brokerData.broker._id, brokerData)}
// //                                 disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
// //                               >
// //                                 <CIcon icon={cilSettings} />
// //                                 Options
// //                               </CButton>
// //                               <Menu
// //                                 id={`action-menu-${brokerData.broker._id}`}
// //                                 anchorEl={anchorEl}
// //                                 open={menuId === brokerData.broker._id}
// //                                 onClose={handleClose}
// //                               >
// //                                 {canCreateExchangeLedger && (
// //                                   <MenuItem onClick={() => handleAddClick(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}>
// //                                     <CIcon icon={cilPlus} className="me-2" />
// //                                     Add Payment
// //                                   </MenuItem>
// //                                 )}
// //                                 {canViewExchangeLedger && (
// //                                   <MenuItem
// //                                     onClick={() => handleViewLedger(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}
// //                                   >
// //                                     View Ledger
// //                                   </MenuItem>
// //                                 )}
// //                               </Menu>
// //                             </CTableDataCell>
// //                           )}
// //                         </CTableRow>
                        
// //                         {!isFiltered &&
// //                           expandedBrokers[brokerData.broker._id] &&
// //                           brokerData.branches.map((branch, branchIndex) => {
// //                             const branchKey = `${brokerId}-${branch.branchId}`;
// //                             const hasBranchTransactions = transactionsFetched[branchKey] && transactionsData[branchKey]?.length > 0;
// //                             const isBranchLoading = loadingTransactions[branchKey];
// //                             const branchTransactions = transactionsData[branchKey] || [];
                            
// //                             const sortedBranchTransactions = [...branchTransactions].sort((a, b) => {
// //                               const dateA = new Date(a.date || a.createdAt || 0);
// //                               const dateB = new Date(b.date || b.createdAt || 0);
// //                               return dateB - dateA;
// //                             });
                            
// //                             return (
// //                               <CTableRow key={`${brokerData.broker._id}-${branch.branchId}`} className="branch-detail-row">
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell></CTableDataCell>
// //                                 <CTableDataCell>{branch.name || 'N/A'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.bookings || 0}</CTableDataCell>
// //                                 <CTableDataCell>{branch.exchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.credit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.debit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
// //                                 <CTableDataCell>{branch.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                
// //                                 {/* Receipts Column for Branch */}
// //                                 <CTableDataCell>
// //                                   {isBranchLoading ? (
// //                                     <CSpinner size="sm" color="info" />
// //                                   ) : sortedBranchTransactions.length > 0 ? (
// //                                     <CDropdown>
// //                                       <CDropdownToggle size="sm" color="info" variant="outline">
// //                                         {sortedBranchTransactions.length} Receipt{sortedBranchTransactions.length > 1 ? 's' : ''}
// //                                       </CDropdownToggle>
// //                                       <CDropdownMenu>
// //                                         {sortedBranchTransactions.map((transaction, txIndex) => {
// //                                           const transactionId = transaction._id;
// //                                           const transactionNumber = transaction.referenceNumber || 'N/A';
// //                                           const transactionAmount = transaction.amount || 0;
// //                                           const transactionDate = transaction.dateFormatted || 
// //                                                                 new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                          
// //                                           return (
// //                                             <CDropdownItem 
// //                                               key={transactionId || txIndex} 
// //                                               onClick={() => printBrokerReceipt(transactionId)}
// //                                             >
// //                                               <div className="d-flex align-items-center">
// //                                                 <CIcon icon={cilPrint} className="me-2" />
// //                                                 <div>
// //                                                   <div><strong>Receipt #{txIndex + 1}</strong></div>
// //                                                   <small>
// //                                                     ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
// //                                                   </small>
// //                                                 </div>
// //                                               </div>
// //                                             </CDropdownItem>
// //                                           );
// //                                         })}
// //                                       </CDropdownMenu>
// //                                     </CDropdown>
// //                                   ) : transactionsFetched[branchKey] ? (
// //                                     <span className="text-muted">No receipts</span>
// //                                   ) : (
// //                                     <CButton
// //                                       size="sm"
// //                                       color="light"
// //                                       onClick={() => fetchTransactionsForBroker(brokerId, branch.branchId)}
// //                                       disabled={isBranchLoading}
// //                                     >
// //                                       <CIcon icon={cilCloudDownload} className="me-1" />
// //                                       Load Receipts
// //                                     </CButton>
// //                                   )}
// //                                 </CTableDataCell>
                                
// //                                 {showActionColumn && (
// //                                   <CTableDataCell>
// //                                     <CButton
// //                                       size="sm"
// //                                       className='option-button btn-sm'
// //                                       onClick={(event) =>
// //                                         handleClick(event, `${brokerData.broker._id}-${branch.branchId}`, brokerData, branch.branchId)
// //                                       }
// //                                       disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
// //                                     >
// //                                       <CIcon icon={cilSettings} />
// //                                       Options
// //                                     </CButton>
// //                                     <Menu
// //                                       id={`action-menu-${brokerData.broker._id}-${branch.branchId}`}
// //                                       anchorEl={anchorEl}
// //                                       open={menuId === `${brokerData.broker._id}-${branch.branchId}`}
// //                                       onClose={handleClose}
// //                                     >
// //                                       {canCreateExchangeLedger && (
// //                                         <MenuItem onClick={() => handleAddClick(brokerData, branch.branchId)}>
// //                                           <CIcon icon={cilPlus} className="me-2" />
// //                                           Add Payment
// //                                         </MenuItem>
// //                                       )}
// //                                       {canViewExchangeLedger && (
// //                                         <MenuItem onClick={() => handleViewLedger(brokerData, branch.branchId)}>
// //                                           View Ledger
// //                                         </MenuItem>
// //                                       )}
// //                                     </Menu>
// //                                   </CTableDataCell>
// //                                 )}
// //                               </CTableRow>
// //                             );
// //                           })}
// //                       </>
// //                     );
// //                   })
// //                 )}
// //               </CTableBody>
// //             </CTable>
// //           </div>
// //         </CCardBody>
// //       </CCard>

// //       <CModal alignment="center" visible={showFilterModal} onClose={() => setShowFilterModal(false)}>
// //         <CModalHeader>
// //           <CModalTitle>Search</CModalTitle>
// //         </CModalHeader>
// //         <CModalBody>
// //           <div className="mb-3">
// //             <CFormLabel>Select Branch</CFormLabel>
// //             <CFormSelect 
// //               value={selectedBranch} 
// //               onChange={(e) => setSelectedBranch(e.target.value)}
// //               disabled={!canViewExchangeLedger}
// //             >
// //               <option value="ALL">All Branches</option>
             
// //               {branches.map((branch) => (
// //                 <option key={branch._id} value={branch._id}>
// //                   {branch.name || 'N/A'}
// //                 </option>
// //               ))}
// //             </CFormSelect>
// //           </div>
// //         </CModalBody>
// //         <CModalFooter>
// //           <CButton 
// //             color="primary" 
// //             onClick={handleBranchFilter}
// //             disabled={!canViewExchangeLedger}
// //           >
// //             Search
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>
      
// //       {/* Export Report Modal */}
// //       <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal} size="lg">
// //         <CModalHeader>
// //           <CModalTitle>
// //             <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
// //             Export Brokers Report
// //           </CModalTitle>
// //         </CModalHeader>
// //         <CModalBody>
// //           {exportError && (
// //             <CAlert color="warning" className="mb-3">
// //               {exportError}
// //             </CAlert>
// //           )}
          
// //           <LocalizationProvider 
// //             dateAdapter={AdapterDateFns} 
// //             adapterLocale={enIN}
// //           >
// //             <div className="mb-3">
// //               <CFormLabel>Select Branch</CFormLabel>
// //               <CFormSelect 
// //                 value={exportBranchId} 
// //                 onChange={(e) => {
// //                   setExportBranchId(e.target.value);
// //                   setExportError('');
// //                 }}
// //                 disabled={!canCreateExchangeLedger}
// //               >
// //                 <option value="">-- Select Branch --</option>
// //                 <option value="ALL">All Branches</option>
// //                 {branches.map((branch) => (
// //                   <option key={branch._id} value={branch._id}>
// //                     {branch.name || 'N/A'}
// //                   </option>
// //                 ))}
// //               </CFormSelect>
// //             </div>
            
// //             <div className="mb-3">
// //               <DatePicker
// //                 label="Start Date"
// //                 value={exportStartDate}
// //                 onChange={(newValue) => {
// //                   setExportStartDate(newValue);
// //                   setExportError('');
// //                 }}
// //                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
// //                 inputFormat="dd/MM/yyyy"
// //                 mask="__/__/____"
// //                 views={['day', 'month', 'year']}
// //                 disabled={!canCreateExchangeLedger}
// //               />
// //             </div>
// //             <div className="mb-3">
// //               <DatePicker
// //                 label="End Date"
// //                 value={exportEndDate}
// //                 onChange={(newValue) => {
// //                   setExportEndDate(newValue);
// //                   setExportError('');
// //                 }}
// //                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
// //                 inputFormat="dd/MM/yyyy"
// //                 mask="__/__/____"
// //                 minDate={exportStartDate}
// //                 views={['day', 'month', 'year']}
// //                 disabled={!canCreateExchangeLedger}
// //               />
// //             </div>
// //           </LocalizationProvider>
// //         </CModalBody>
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={handleCloseExportModal}>
// //             Cancel
// //           </CButton>
// //           <CButton 
// //             className="submit-button"
// //             onClick={handleExcelExport}
// //             disabled={!exportStartDate || !exportEndDate || !exportBranchId || !canCreateExchangeLedger || exportLoading}
// //           >
// //             {exportLoading ? (
// //               <>
// //                 <CSpinner size="sm" className="me-2" />
// //                 Exporting...
// //               </>
// //             ) : 'Export Excel'}
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>
      
// //       <ExchangeLedgerModel 
// //         show={showModal} 
// //         onClose={() => setShowModal(false)} 
// //         brokerData={selectedledger} 
// //         refreshData={fetchData}
// //         onPaymentSaved={handlePaymentSaved}
// //         canCreateExchangeLedger={canCreateExchangeLedger}
// //         onPaymentSuccess={(receiptId) => {
// //           if (receiptId) {
// //             setTimeout(() => {
// //               printBrokerReceipt(receiptId);
// //             }, 500);
// //           }
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // export default ExchangeLedger;





// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Menu,
//   MenuItem,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   showError
// } from '../../utils/tableImports';
// import tvsLogo from '../../assets/images/logo.png';
// import '../../css/invoice.css';
// import config from '../../config';
// import ExchangeLedgerModel from './ExchangeLedgerModel';
// import {
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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CFormSelect,
//   CAlert,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilSearch, cilZoomOut, cilPrint, cilCloudDownload } from '@coreui/icons';
// import { useAuth } from '../../context/AuthContext';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileExcel, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import TextField from '@mui/material/TextField';
// import Swal from 'sweetalert2';
// import QRCode from 'qrcode';

// // Import date-fns locale for Indian date format
// import { enIN } from 'date-fns/locale';

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useCallback } from 'react';

// const ExchangeLedger = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedledger, setSelectedledger] = useState(null);
//   const [groupedData, setGroupedData] = useState([]);
//   const [expandedBrokers, setExpandedBrokers] = useState({});
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [isFiltered, setIsFiltered] = useState(false);
//   const [selectedBranchName, setSelectedBranchName] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
  
//   // ============ RECEIPTS FETCHING STATES ============
//   const [transactionsData, setTransactionsData] = useState({});
//   const [loadingTransactions, setLoadingTransactions] = useState({});
//   const [transactionsFetched, setTransactionsFetched] = useState({});
  
//   // Export modal state
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportStartDate, setExportStartDate] = useState(null);
//   const [exportEndDate, setExportEndDate] = useState(null);
//   const [exportBranchId, setExportBranchId] = useState('');
//   const [exportError, setExportError] = useState('');
//   const [exportLoading, setExportLoading] = useState(false);

//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const { permissions } = useAuth();

//   // Page-level permission checks for Exchange Ledger under ACCOUNT module
//   const canViewExchangeLedger = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
//   const canCreateExchangeLedger = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
//   const canUpdateExchangeLedger = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
//   const canDeleteExchangeLedger = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  
//   const showActionColumn = canCreateExchangeLedger || canViewExchangeLedger;

//   // Format date to DD-MM-YYYY for display
//   const formatDateDDMMYYYY = (date) => {
//     if (!date) return '';
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Format date to YYYY-MM-DD for API
//   const formatDateForAPI = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     fetchData();
//     fetchBranches();
//   }, [canViewExchangeLedger]);

//   useEffect(() => {
//     if (data.length > 0) {
//       const grouped = groupDataByBroker(data, isFiltered);
//       setGroupedData(grouped);
//       setFilteredData(grouped);
      
//       // Initialize transactions data structure
//       const initialTransactionsMap = {};
//       grouped.forEach(brokerData => {
//         const key = brokerData.broker._id;
//         initialTransactionsMap[key] = [];
        
//         // Also initialize for branches if needed
//         if (!isFiltered && brokerData.branches) {
//           brokerData.branches.forEach(branch => {
//             const branchKey = `${brokerData.broker._id}-${branch.branchId}`;
//             initialTransactionsMap[branchKey] = [];
//           });
//         }
//       });
//       setTransactionsData(initialTransactionsMap);
//     }
//   }, [data, isFiltered]);

//   const fetchBranches = async () => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchData = async (branchId = null) => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     try {
//       setLoading(true);
//       let url = '/broker-ledger/summary/detailed';
//       if (branchId) {
//         url = `/broker-ledger/summary/branch/${branchId}`;
//       }

//       const response = await axiosInstance.get(url);

//       if (branchId) {
//         const branchName = branches.find((b) => b._id === branchId)?.name || 'Selected Branch';
//         setSelectedBranchName(branchName);

//         const branchData = response.data.data.brokers.map((broker) => ({
//           broker: broker.broker,
//           branch: {
//             _id: response.data.data.branch,
//             name: branchName
//           },
//           bookings: {
//             total: broker.totalBookings,
//             details: []
//           },
//           financials: {
//             totalExchangeAmount: broker.totalExchangeAmount,
//             ledger: {
//               currentBalance: broker.ledger.currentBalance,
//               onAccount: broker.ledger.onAccount,
//               totalCredit: broker.ledger.totalCredit || 0,
//               totalDebit: broker.ledger.totalDebit || 0,
//               outstandingAmount: broker.ledger.outstandingAmount || 0,
//               transactions: broker.ledger.transactions || 0
//             },
//             summary: {
//               totalReceived: broker.summary?.totalReceived || 0,
//               totalPayable: broker.summary?.totalPayable || 0,
//               netBalance: broker.ledger.currentBalance
//             }
//           },
//           recentTransactions: [],
//           association: {
//             isActive: true
//           }
//         }));

//         setData(branchData);
//         setIsFiltered(true);
//       } else {
//         setData(response.data.data.brokers);
//         setIsFiltered(false);
//         setSelectedBranchName('');
//       }
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============ FETCH TRANSACTIONS FOR BROKER (REQUIRES BOTH IDs) ============
//   const fetchTransactionsForBroker = useCallback(async (brokerId, branchId) => {
//     // Both IDs are required - don't proceed if either is missing
//     if (!brokerId || !branchId) {
//       console.log('Cannot fetch transactions: Both brokerId and branchId are required');
//       return;
//     }
    
//     const key = `${brokerId}-${branchId}`;
    
//     if (transactionsFetched[key] || loadingTransactions[key]) {
//       return;
//     }

//     try {
//       setLoadingTransactions(prev => ({ ...prev, [key]: true }));
      
//       const response = await axiosInstance.get(`/broker-ledger/branch-transactions/${brokerId}/${branchId}`);
      
//       const transactions = response.data.data.transactions || [];
      
//       setTransactionsData(prev => ({
//         ...prev,
//         [key]: transactions
//       }));
      
//       setTransactionsFetched(prev => ({
//         ...prev,
//         [key]: true
//       }));
//     } catch (error) {
//       console.error(`Error fetching transactions for broker ${brokerId} and branch ${branchId}:`, error);
//       setTransactionsData(prev => ({
//         ...prev,
//         [key]: []
//       }));
//       setTransactionsFetched(prev => ({
//         ...prev,
//         [key]: true
//       }));
//     } finally {
//       setLoadingTransactions(prev => ({ ...prev, [key]: false }));
//     }
//   }, [transactionsFetched, loadingTransactions]);

//   // ============ PRINT RECEIPT FUNCTION - USING BRANCH TRANSACTIONS API ============
//   const printBrokerReceipt = async (transactionId, brokerId, branchId) => {
//     try {
//       console.log('Fetching transactions for broker:', brokerId, 'branch:', branchId);
      
//       // Fetch all transactions for this broker and branch
//       const response = await axiosInstance.get(`/broker-ledger/branch-transactions/${brokerId}/${branchId}`);
//       console.log('Transactions response:', response.data);
      
//       const transactionData = response.data.data;
      
//       // Find the specific transaction by ID
//       const transaction = transactionData.transactions?.find(t => t._id === transactionId);
      
//       if (!transaction) {
//         showError('Transaction not found');
//         return;
//       }
      
//       console.log('Found transaction:', transaction);
      
//       // Get the amount from the transaction object
//       const amount = transaction.amount || 0;
//       console.log('Amount being used:', amount);
      
//       const receivedDate = transaction.dateFormatted || 
//                           new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
      
//       const currentDate = new Date().toLocaleDateString('en-GB');
      
//       const brokerName = transactionData.broker?.name || 'N/A';
//       const branchName = transactionData.branch?.name || 'N/A';
//       const branchAddress = transactionData.branch?.address || '';
//       const branchPhone = transactionData.branch?.phone || '';
//       const branchEmail = transactionData.branch?.email || '';
      
//       const qrText = `GANDHI MOTORS PVT LTD
// Broker: ${brokerName}
// Branch: ${branchName}
// Receipt No: ${transaction.referenceNumber || transaction._id}
// Amount: ₹${amount}
// Payment Mode: ${transaction.modeOfPayment || 'Cash'}
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
//             <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${transaction.referenceNumber || ''}</text>
//           </svg>
//         `);
//       }

//       // Pass the transaction object and the transactionData
//       const receiptHTML = generateReceiptHTML(transaction, transactionData, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail);

//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(receiptHTML);
//       printWindow.document.close();
      
//       printWindow.onload = function() {
//         printWindow.focus();
//         printWindow.print();
//       };
      
//     } catch (err) {
//       console.error('Error fetching transaction details:', err);
//       console.error('Error response:', err.response?.data);
//       showError('Failed to load receipt. Please try again.');
//     }
//   };

//   // ============ GENERATE RECEIPT HTML ============
//   const generateReceiptHTML = (transaction, transactionData, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail) => {
//     const receiptNumber = transaction.referenceNumber || transaction._id || 'N/A';
//     const amount = transaction.amount || 0;
//     const paymentMode = transaction.modeOfPayment || 'Cash';
//     const remark = transaction.remark || '';
//     const referenceNumber = transaction.referenceNumber || '';
//     const approvalStatus = transaction.approvalStatus || 'Pending';
//     const cashLocation = transaction.cashLocation?.name || '';
//     const bankName = transaction.bank?.name || '';
//     const subPaymentMode = transaction.subPaymentMode?.payment_mode || '';
    
//     const amountInWords = numberToWordsSimple(amount);

//     return `<!DOCTYPE html>
//   <html>
//   <head>
//     <title>Broker Payment Receipt - ${receiptNumber}</title>
//     <style>
//       body {
//         font-family: "Courier New", Courier, monospace;
//         margin: 0;
//         padding: 10mm;
//         font-size: 15px;
//         color: #333;
//       }
//       .page {
//         width: 210mm;
//         margin: 0 auto;
//       }
//       .receipt-copy {
//         height: auto;
//         min-height: 130mm;
//         page-break-inside: avoid;
//       }
//       .header-container {
//         display: flex;
//         justify-content: space-between;
//         margin-bottom: 2mm;
//         align-items: flex-start;
//       }
//       .header-left {
//         width: 60%;
//       }
//       .header-right {
//         width: 40%;
//         text-align: right;
//         display: flex;
//         flex-direction: column;
//         align-items: flex-end;
//       }
//       .logo-qr-container {
//         display: flex;
//         align-items: center;
//         gap: 10px;
//         justify-content: flex-end;
//         margin-bottom: 5px;
//         width: 100%;
//       }
//       .logo {
//         height: 51px;
//       }
//       .qr-code-small {
//         width: 81px;
//         height: 81px;
//         border: 1px solid #ccc;
//       }
//       .dealer-info {
//         text-align: left;
//         font-size: 13px;
//         line-height: 1.2;
//       }
//       .dealer-name {
//         font-size: 17px;
//         font-weight: bold;
//         margin: 0 0 3px 0;
//       }
//       .broker-info-container {
//         display: flex;
//         font-size: 14px;
//         margin: 10px 0;
//       }
//       .broker-info-left {
//         width: 50%;
//       }
//       .broker-info-right {
//         width: 50%;
//       }
//       .info-row {
//         margin: 2mm 0;
//         line-height: 1.2;
//       }
//       /* Style for values in info rows */
//       .info-row .value {
//         font-weight: 700;
//       }
//       .divider {
//         border-top: 2px solid #AAAAAA;
//         margin: 3mm 0;
//       }
//       .receipt-info {
//         background-color: #f8f9fa;
//         border: 1px solid #dee2e6;
//         border-radius: 4px;
//         padding: 9px;
//         margin: 11px 0;
//         font-size: 14px;
//       }
//       .receipt-info .value {
//         font-weight: 700;
//       }
//       .payment-info-box {
//         margin: 11px 0;
//       }
//       .signature-box {
//         margin-top: 16mm;
//         font-size: 11pt;
//       }
//       .signature-line {
//         border-top: 1px dashed #000;
//         width: 41mm;
//         display: inline-block;
//         margin: 0 5mm;
//       }
//       .cutting-line {
//         border-top: 2px dashed #333;
//         margin: 16mm 0 11mm 0;
//         text-align: center;
//         position: relative;
//       }
//       .cutting-line::before {
//         content: "✂ Cut Here ✂";
//         position: absolute;
//         top: -11px;
//         left: 50%;
//         transform: translateX(-50%);
//         background: white;
//         padding: 0 11px;
//         font-size: 13px;
//         color: #666;
//       }
//       .note {
//         padding: 2px;
//         margin: 3px;
//         font-size: 12px;
//       }
//       .note .value {
//         font-weight: 700;
//       }
//       .amount-in-words {
//         font-style: italic;
//         margin-top: 9px;
//         padding: 6px;
//         font-size: 13px;
//         border-top: 1px dashed #ccc;
//       }
//       .amount-in-words .value {
//         font-weight: 700;
//         font-style: normal;
//       }
//       .status-badge {
//         display: inline-block;
//         padding: 4px 9px;
//         border-radius: 12px;
//         font-size: 12px;
//         font-weight: bold;
//         background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
//         color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
//         border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
//       }
//       .footer-note {
//         font-size: 10px;
//         color: #777;
//         text-align: center;
//         margin-top: 5mm;
//       }
//       .payment-details {
//         margin-top: 10px;
//         border-collapse: collapse;
//         width: 100%;
//       }
//       .payment-details td {
//         padding: 4px;
//         border: none;
//       }
//       /* 2-column grid for payment info */
//       .payment-grid-2col {
//         display: grid;
//         grid-template-columns: 1fr 1fr;
//         gap: 4px 15px;
//         padding: 4px;
//         font-size: 14px;
//       }
//       .payment-grid-item {
//         padding: 2px 0;
//         line-height: 1.3;
//       }
//       .payment-grid-item strong {
//         font-weight: 600;
//         margin-right: 5px;
//         min-width: 110px;
//         display: inline-block;
//       }
//       .payment-grid-item .value {
//         font-weight: 700;
//       }
//       @page {
//         size: A4;
//         margin: 10mm;
//       }
//       @media print {
//         body {
//           padding: 0;
//         }
//         .receipt-copy {
//           page-break-inside: avoid;
//         }
//       }
//     </style>
//   </head>
//   <body>
//     <div class="page">
//       <!-- FIRST COPY -->
//       <div class="receipt-copy">
//         <div class="header-container">
//           <div class="header-left">
//             <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
//             <div class="dealer-info">
//               Authorized Main Dealer: TVS Motor Company Ltd.<br>
//               Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//               Upnagar, Nashik Road, Nashik - 422101<br>
//               Phone: 7498903672
//             </div>
//           </div>
//           <div class="header-right">
//             <div class="logo-qr-container">
//               <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
//               ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
//             </div>
//             <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
//             <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
//           </div>
//         </div>
        
//         <div class="divider"></div>
  
//         <div class="receipt-info">
//           <div><strong>BROKER PAYMENT RECEIPT</strong></div>
//           <div><strong>Receipt Date:</strong> <span class="value">${receivedDate}</span></div>
//         </div>
  
//         <div class="broker-info-container">
//           <div class="broker-info-left">
//             <div class="info-row"><strong>Broker Name:</strong> <span class="value">${brokerName}</span></div>
//             <div class="info-row"><strong>Branch:</strong> <span class="value">${branchName}</span></div>
//             <div class="info-row"><strong>Payment Mode:</strong> <span class="value">${paymentMode}</span></div>
//             ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> <span class="value">${cashLocation}</span></div>` : ''}
//             ${bankName ? `<div class="info-row"><strong>Bank:</strong> <span class="value">${bankName}</span></div>` : ''}
//           </div>
//           <div class="broker-info-right">
//             <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
//             ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> <span class="value">${subPaymentMode}</span></div>` : ''}
//             <div class="info-row"><strong>Branch Address:</strong> <span class="value">${branchAddress}</span></div>
//             <div class="info-row"><strong>Branch Phone:</strong> <span class="value">${branchPhone}</span></div>
//           </div>
//         </div>
  
//         <div class="payment-info-box">
//           <div class="receipt-info" style="padding: 5px;">
//             <!-- Payment Information Grid - 2 columns (2 rows) with existing fields only -->
//             <div class="payment-grid-2col">
//               <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
             
//             </div>
//           </div>
          
//           <div class="amount-in-words">
//             <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
//           </div>
//         </div>
  
//         <div class="note">
//           <strong>Notes:</strong> <span class="value">This is a system generated receipt for Broker On-Account payment.</span>
//         </div>
        
//         <div class="divider"></div>
  
//         <div class="signature-box">
//           <div style="display: flex; justify-content: space-between;">
//             <div style="text-align:center; width: 30%;">
//               <div class="signature-line"></div>
//               <div>Broker's Signature</div>
//             </div>
//             <div style="text-align:center; width: 30%;">
//               <div class="signature-line"></div>
//               <div>Authorised Signatory</div>
//             </div>
//             <div style="text-align:center; width: 30%;">
//               <div class="signature-line"></div>
//               <div>Accountant</div>
//             </div>
//           </div>
//         </div>
        
//         <div class="footer-note">
//           This is a computer generated receipt - valid without signature
//         </div>
//       </div>
  
//       <!-- CUTTING LINE -->
//       <div class="cutting-line"></div>
  
//       <!-- SECOND COPY (DUPLICATE) -->
//       <div class="receipt-copy">
//         <div class="header-container">
//           <div class="header-left">
//             <div class="dealer-name">GANDHI MOTORS PVT LTD</div>
//             <div class="dealer-info">
//               Authorized Main Dealer: TVS Motor Company Ltd.<br>
//               Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
//               Upnagar, Nashik Road, Nashik - 422101<br>
//               Phone: 7498903672
//             </div>
//           </div>
//           <div class="header-right">
//             <div class="logo-qr-container">
//               <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
//               ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
//             </div>
//             <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
//             <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
//           </div>
//         </div>
        
//         <div class="divider"></div>
  
//         <div class="receipt-info">
//           <div><strong>BROKER PAYMENT RECEIPT (DUPLICATE)</strong></div>
//           <div><strong>Receipt Date:</strong> <span class="value">${receivedDate}</span></div>
//         </div>
  
//         <div class="broker-info-container">
//           <div class="broker-info-left">
//             <div class="info-row"><strong>Broker Name:</strong> <span class="value">${brokerName}</span></div>
//             <div class="info-row"><strong>Branch:</strong> <span class="value">${branchName}</span></div>
//             <div class="info-row"><strong>Payment Mode:</strong> <span class="value">${paymentMode}</span></div>
//             ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> <span class="value">${cashLocation}</span></div>` : ''}
//             ${bankName ? `<div class="info-row"><strong>Bank:</strong> <span class="value">${bankName}</span></div>` : ''}
//           </div>
//           <div class="broker-info-right">
//             <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
//             ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> <span class="value">${subPaymentMode}</span></div>` : ''}
//             <div class="info-row"><strong>Branch Address:</strong> <span class="value">${branchAddress}</span></div>
//             <div class="info-row"><strong>Branch Phone:</strong> <span class="value">${branchPhone}</span></div>
//           </div>
//         </div>
  
//         <div class="payment-info-box">
//           <div class="receipt-info" style="padding: 5px;">
//             <!-- Payment Information Grid - 2 columns (2 rows) with existing fields only -->
//             <div class="payment-grid-2col">
//               <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
              
//           </div>
          
//           <div class="amount-in-words">
//             <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
//           </div>
//         </div>
  
//         <div class="note">
//           <strong>Notes:</strong> <span class="value">This is a system generated receipt for Broker On-Account payment.</span>
//         </div>
        
//         <div class="divider"></div>
  
//         <div class="signature-box">
//           <div style="display: flex; justify-content: space-between;">
//             <div style="text-align:center; width: 30%;">
//               <div class="signature-line"></div>
//               <div>Broker's Signature</div>
//             </div>
//             <div style="text-align:center; width: 30%;">
//               <div class="signature-line"></div>
//               <div>Authorised Signatory</div>
//             </div>
//             <div style="text-align:center; width: 30%;">
//               <div class="signature-line"></div>
//               <div>Accountant</div>
//             </div>
//           </div>
//         </div>
        
//         <div class="footer-note">
//           This is a computer generated receipt - valid without signature
//         </div>
//       </div>
//     </div>
//   </body>
//   </html>`;
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

//   const handleBranchFilter = async () => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     if (selectedBranch) {
//       await fetchData(selectedBranch);
//     } else {
//       await fetchData();
//     }
//     setShowFilterModal(false);
//   };

//   const clearFilter = async () => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     setSelectedBranch('');
//     await fetchData();
//     setShowFilterModal(false);
//   };

//   const groupDataByBroker = (brokersData, isFilteredMode = false) => {
//     const brokerMap = {};

//     brokersData.forEach((item) => {
//       const brokerId = item.broker._id;

//       if (!brokerMap[brokerId]) {
//         brokerMap[brokerId] = {
//           broker: item.broker,
//           branches: [],
//           totalBookings: 0,
//           totalExchangeAmount: 0,
//           totalCredit: 0,
//           totalDebit: 0,
//           onAccount: 0,
//           currentBalance: 0,
//           outstandingAmount: 0
//         };
//       }

//       if (isFilteredMode) {
//         brokerMap[brokerId].branches = [
//           {
//             name: item.branch.name,
//             branchId: item.branch._id,
//             bookings: item.bookings.total,
//             exchangeAmount: item.financials.totalExchangeAmount,
//             credit: item.financials.ledger.totalCredit,
//             debit: item.financials.ledger.totalDebit,
//             onAccount: item.financials.ledger.onAccount,
//             currentBalance: item.financials.ledger.currentBalance,
//             outstandingAmount: item.financials.ledger.outstandingAmount
//           }
//         ];

//         brokerMap[brokerId].totalBookings = item.bookings.total;
//         brokerMap[brokerId].totalExchangeAmount = item.financials.totalExchangeAmount;
//         brokerMap[brokerId].totalCredit = item.financials.ledger.totalCredit;
//         brokerMap[brokerId].totalDebit = item.financials.ledger.totalDebit;
//         brokerMap[brokerId].onAccount = item.financials.ledger.onAccount;
//         brokerMap[brokerId].currentBalance = item.financials.ledger.currentBalance;
//         brokerMap[brokerId].outstandingAmount = item.financials.ledger.outstandingAmount;
//       } else {
//         brokerMap[brokerId].branches.push({
//           name: item.branch.name,
//           branchId: item.branch._id,
//           bookings: item.bookings.total,
//           exchangeAmount: item.financials.totalExchangeAmount,
//           credit: item.financials.ledger.totalCredit,
//           debit: item.financials.ledger.totalDebit,
//           onAccount: item.financials.ledger.onAccount,
//           currentBalance: item.financials.ledger.currentBalance,
//           outstandingAmount: item.financials.ledger.outstandingAmount
//         });

//         brokerMap[brokerId].totalBookings += item.bookings.total;
//         brokerMap[brokerId].totalExchangeAmount += item.financials.totalExchangeAmount;
//         brokerMap[brokerId].totalCredit += item.financials.ledger.totalCredit;
//         brokerMap[brokerId].totalDebit += item.financials.ledger.totalDebit;
//         brokerMap[brokerId].onAccount += item.financials.ledger.onAccount;
//         brokerMap[brokerId].currentBalance += item.financials.ledger.currentBalance;
//         brokerMap[brokerId].outstandingAmount += item.financials.ledger.outstandingAmount;
//       }
//     });

//     return Object.values(brokerMap);
//   };

//   const toggleBrokerExpansion = (brokerId) => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     if (!isFiltered) {
//       setExpandedBrokers((prev) => ({
//         ...prev,
//         [brokerId]: !prev[brokerId]
//       }));
//     }
//   };

//   const handleClick = (event, id, brokerData = null, branchId = null) => {
//     if (!canViewExchangeLedger && !canCreateExchangeLedger) {
//       return;
//     }
    
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//     if (brokerData) {
//       setSelectedledger({ ...brokerData, branchId });
//     }
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleAddClick = (brokerData, branchId = null) => {
//     if (!canCreateExchangeLedger) {
//       showError('You do not have permission to add payments');
//       return;
//     }
    
//     setSelectedledger({ ...brokerData, branchId });
//     setShowModal(true);
//     handleClose();
//   };

//   const handleViewLedger = async (brokerData, branchId = null) => {
//     if (!canViewExchangeLedger) {
//       showError('You do not have permission to view ledgers');
//       return;
//     }
    
//     try {
//       let url = `/broker-ledger/statement/${brokerData.broker?._id}`;
//       if (branchId) {
//         url += `?branchId=${branchId}`;
//       }

//       const res = await axiosInstance.get(url);
//       const ledgerData = res.data.data;
//       const ledgerUrl = `${config.baseURL}/brokerData.html?ledgerId=${brokerData._id}`;
//       let totalCredit = 0;
//       let totalDebit = 0;
//       const totalOnAccount = ledgerData.summary?.totalOnAccount ?? ledgerData.onAccountBalance ?? 0;

//       ledgerData.transactions?.forEach((entry) => {
//         if (entry.type === 'CREDIT') {
//           totalCredit += entry.amount;
//         } else if (entry.type === 'DEBIT') {
//           totalDebit += entry.amount;
//         }
//       });
//       const finalBalance = totalDebit - totalCredit;
//       const availableOnAccount2 = totalOnAccount - totalCredit;

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
//                   <div><strong>Broker Name:</strong> ${ledgerData.broker?.name || 'N/A'}</div>
//                   <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
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
//                     ${ledgerData.transactions
//   ?.map(
//     (entry) => {
//       let exchangeVehicleNumber = '';
//       let exchangeChassisNumber = '';
//       let exchangePrice = '';
//       let exchangeStatus = '';
//       let bookingNumber = entry.booking?.bookingNumber || '';
      
//       if (entry.exchangeVehicle && entry.exchangeVehicle.VehicleNumber) {
//         exchangeVehicleNumber = entry.exchangeVehicle.VehicleNumber || '';
//         exchangeChassisNumber = entry.exchangeVehicle.ChassisNumber || '';
//         exchangePrice = entry.exchangeVehicle.PriceFormatted || '';
//         exchangeStatus = entry.exchangeVehicle.Status || '';
//       } else if (entry.exchangeDisplay && entry.exchangeDisplay.VehicleNumber) {
//         exchangeVehicleNumber = entry.exchangeDisplay.VehicleNumber || '';
//         exchangeChassisNumber = entry.exchangeDisplay.ChassisNumber || '';
//         exchangePrice = entry.exchangeDisplay.Price || '';
//         exchangeStatus = entry.exchangeDisplay.Status || '';
//       } else if (entry.booking?.exchange?.display) {
//         const exchangeDisplay = entry.booking.exchange.display;
//         exchangeVehicleNumber = exchangeDisplay.vehicleNumber || '';
//         exchangeChassisNumber = exchangeDisplay.chassisNumber || '';
//         exchangePrice = exchangeDisplay.price ? `₹${exchangeDisplay.price.toLocaleString('en-IN')}` : '';
//         exchangeStatus = exchangeDisplay.status || '';
//       } else if (entry.booking?.exchange?.details) {
//         const exchangeDetails = entry.booking.exchange.details;
//         exchangeVehicleNumber = exchangeDetails.vehicleNumber || '';
//         exchangeChassisNumber = exchangeDetails.chassisNumber || '';
//         exchangePrice = exchangeDetails.price ? `₹${exchangeDetails.price.toLocaleString('en-IN')}` : '';
//         exchangeStatus = exchangeDetails.status || '';
//       }
      
//       return `
//       <tr>
//         <td>${new Date(entry.date).toLocaleDateString() || 'N/A'}</td>
//         <td>
//           Booking No: ${bookingNumber || '-'}<br>
//           Customer: ${entry.booking?.customer?.name || '-'}<br>
       
//           ${entry.mode || ''}
//           ${exchangeVehicleNumber ? `<br>Exchange Vehicle: ${exchangeVehicleNumber}` : ''}
//           ${exchangeChassisNumber ? `<br>Exchange Chassis: ${exchangeChassisNumber}` : ''}
//         </td>
//         <td>${entry.receiptNumber || ''}</td>
//         <td class="text-right">${entry.type === 'CREDIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
//         <td class="text-right">${entry.type === 'DEBIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
//         <td class="text-right"></td>
//       </tr>
//     `;
//     }
//   )
//   .join('')}
//                       <tr>
//                       <td colspan="3" class="text-left"><strong>Total OnAccount</strong></td>
//                       <td class="text-right"></td>
//                       <td class="text-right"></td>
//                       <td class="text-right"><strong>${availableOnAccount2.toLocaleString('en-IN')}</strong></td>
//                     </tr>
//                     <tr>
//                       <td colspan="3" class="text-left"><strong>Total</strong></td>
//                       <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
//                       <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
//                       <td class="text-right"><strong>${finalBalance.toLocaleString('en-IN')}</strong></td>
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
//       const message = showError(err);
//       if (message) {
//         setError(message);
//       }
//     }
//     handleClose();
//   };

//   const handleSearch = (value) => {
//     if (!canViewExchangeLedger) {
//       return;
//     }
    
//     setSearchTerm(value);
//     handleFilter(value, ['broker.name']);
//   };

//   const handlePaymentSaved = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     fetchData();
//   };

//   const handleOpenExportModal = () => {
//     if (!canCreateExchangeLedger) {
//       showError('You do not have permission to export reports');
//       return;
//     }
    
//     setShowExportModal(true);
//     setExportError('');
//     if (isFiltered && selectedBranch) {
//       setExportBranchId(selectedBranch);
//     }
//   };

//   const handleCloseExportModal = () => {
//     setShowExportModal(false);
//     setExportStartDate(null);
//     setExportEndDate(null);
//     setExportBranchId('');
//     setExportError('');
//     setExportLoading(false);
//   };

//   const handleExcelExport = async () => {
//     if (!canCreateExchangeLedger) {
//       showError('You do not have permission to export reports');
//       return;
//     }
    
//     setExportError('');
    
//     if (!exportBranchId) {
//       setExportError('Please select a branch');
//       return;
//     }

//     if (!exportStartDate || !exportEndDate) {
//       setExportError('Please select both start and end dates');
//       return;
//     }

//     if (exportStartDate > exportEndDate) {
//       setExportError('Start date cannot be after end date');
//       return;
//     }

//     try {
//       setExportLoading(true);
      
//       const formattedStartDate = formatDateForAPI(exportStartDate);
//       const formattedEndDate = formatDateForAPI(exportEndDate);

//       const params = new URLSearchParams({
//         branchId: exportBranchId,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate
//       });

//       const response = await axiosInstance.get(
//         `/reports/brokers?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       const contentType = response.headers['content-type'];
      
//       if (contentType && contentType.includes('application/json')) {
//         const text = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsText(response.data);
//         });
        
//         const errorData = JSON.parse(text);
        
//         if (!errorData.success && errorData.message) {
//           setExportError(errorData.message);
//           Swal.fire({
//             icon: 'error',
//             title: 'Export Failed',
//             text: errorData.message,
//           });
//           return;
//         }
//       }

//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       const branchName = branches.find(b => b._id === exportBranchId)?.name || 'Branch';
//       const startDateStr = formatDateDDMMYYYY(exportStartDate);
//       const endDateStr = formatDateDDMMYYYY(exportEndDate);
//       const fileName = `Brokers_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       window.URL.revokeObjectURL(url);
      
//       Swal.fire({
//         toast: true,
//         position: 'top-end',
//         icon: 'success',
//         title: 'Excel exported successfully!',
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true
//       });

//       handleCloseExportModal();
      
//     } catch (error) {
//       console.error('Error exporting report:', error);
      
//       if (error.response && error.response.data instanceof Blob) {
//         try {
//           const text = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsText(error.response.data);
//           });
          
//           const errorData = JSON.parse(text);
          
//           if (errorData.message) {
//             setExportError(errorData.message);
//             Swal.fire({
//               icon: 'error',
//               title: 'Export Failed',
//               text: errorData.message,
//             });
//           }
//         } catch (parseError) {
//           console.error('Error parsing error response:', parseError);
//           setExportError('Failed to export report');
//           Swal.fire({
//             icon: 'error',
//             title: 'Export Failed',
//             text: 'Failed to export report',
//           });
//         }
//       } else if (error.response?.data?.message) {
//         setExportError(error.response.data.message);
//         Swal.fire({
//           icon: 'error',
//           title: 'Export Failed',
//           text: error.response.data.message,
//         });
//       } else if (error.message) {
//         setExportError(error.message);
//         Swal.fire({
//           icon: 'error',
//           title: 'Export Failed',
//           text: error.message,
//         });
//       } else {
//         setExportError('Failed to export report');
//         Swal.fire({
//           icon: 'error',
//           title: 'Export Failed',
//           text: 'Failed to export report',
//         });
//       }
      
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   if (!canViewExchangeLedger) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Exchange Ledger.
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

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const totalColumns = isFiltered ? 12 : 13;
//   const actionColumnIndex = showActionColumn ? 1 : 0;

//   return (
//     <div>
//       <div className='title'>Exchange Ledger {isFiltered && `- ${selectedBranchName}`}</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setShowFilterModal(true)}
//               disabled={!canViewExchangeLedger}
//             >
//               <CIcon icon={cilSearch} className='me-1' />
//               Search
//             </CButton>
//             {isFiltered && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={clearFilter}
//                 disabled={!canViewExchangeLedger}
//               >
//                 <CIcon icon={cilZoomOut} className='me-1' />
//                 Clear Filter
//               </CButton>
//             )}
            
//             {canCreateExchangeLedger && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleOpenExportModal}
//                 title="Export Excel Report"
//               >
//                 <FontAwesomeIcon icon={faFileExcel} className='me-1' />
//                 Export Report
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
//                 disabled={!canViewExchangeLedger}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   {!isFiltered && <CTableHeaderCell></CTableHeaderCell>}
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Exchange Broker Name</CTableHeaderCell>
//                   <CTableHeaderCell>Mobile</CTableHeaderCell>
//                   {!isFiltered && <CTableHeaderCell>Branch</CTableHeaderCell>}
//                   <CTableHeaderCell>Total Bookings</CTableHeaderCell>
//                   <CTableHeaderCell>Total Exchange Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Total Received</CTableHeaderCell>
//                   <CTableHeaderCell>Total Payable</CTableHeaderCell>
//                   <CTableHeaderCell>Opening Balance</CTableHeaderCell>
//                   <CTableHeaderCell>Current Balance</CTableHeaderCell>
//                   <CTableHeaderCell>Outstanding Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Receipts</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Actions</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={totalColumns + actionColumnIndex} className="text-center">
//                       No ledger details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((brokerData, index) => {
//                     const brokerId = brokerData.broker._id;
//                     const hasTransactions = transactionsFetched[brokerId] && transactionsData[brokerId]?.length > 0;
//                     const isLoading = loadingTransactions[brokerId];
//                     const transactions = transactionsData[brokerId] || [];
                    
//                // Sort transactions in DESCENDING order (newest first)
// const sortedTransactions = [...transactions].sort((a, b) => {
//   const dateA = new Date(a.date || a.createdAt || 0);
//   const dateB = new Date(b.date || b.createdAt || 0);
//   return dateB - dateA; // DESCENDING order (newest first)
// });

// // In the dropdown mapping:
// {sortedTransactions.map((transaction, txIndex) => {
//   const transactionId = transaction._id;
//   const transactionNumber = transaction.referenceNumber || 'N/A';
//   const transactionAmount = transaction.amount || 0;
//   const transactionDate = transaction.dateFormatted || 
//                         new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
  
//   // Log to verify the order
//   console.log(`Receipt #${txIndex + 1}:`, {
//     id: transactionId,
//     date: transaction.date,
//     formattedDate: transactionDate,
//     amount: transactionAmount
//   });
  
//   return (
//     <CDropdownItem 
//       key={transactionId || txIndex} 
//       onClick={() => printBrokerReceipt(transactionId, brokerId, brokerData.branches[0]?.branchId)}
//     >
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilPrint} className="me-2" />
//         <div>
//           <div><strong>Receipt #{txIndex + 1}</strong></div>
//           <small>
//             ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
//           </small>
//         </div>
//       </div>
//     </CDropdownItem>
//   );
// })}
                    
//                     return (
//                       <React.Fragment key={brokerData.broker._id}>
//                         <CTableRow className="broker-summary-row">
//                           {!isFiltered && (
//                             <CTableDataCell>
//                               <CButton
//                                 color="link"
//                                 size="sm"
//                                 onClick={() => toggleBrokerExpansion(brokerData.broker._id)}
//                                 disabled={!canViewExchangeLedger}
//                               >
//                                 {expandedBrokers[brokerData.broker._id] ? '▼' : '►'}
//                               </CButton>
//                             </CTableDataCell>
//                           )}
//                           <CTableDataCell>{index + 1}</CTableDataCell>
//                           <CTableDataCell>{brokerData.broker.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{brokerData.broker.mobile || 'N/A'}</CTableDataCell>
//                           {!isFiltered && <CTableDataCell>All Branches</CTableDataCell>}
//                           <CTableDataCell>{brokerData.totalBookings || 0}</CTableDataCell>
//                           <CTableDataCell>{brokerData.totalExchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                           <CTableDataCell>{brokerData.totalCredit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                           <CTableDataCell>{brokerData.totalDebit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                           <CTableDataCell>{brokerData.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                           <CTableDataCell>{brokerData.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                           <CTableDataCell>{brokerData.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          
//                           {/* Receipts Column - Only show for filtered view or expanded branches */}
//                           <CTableDataCell>
//                             {isFiltered ? (
//                               // When filtered by branch, we can show receipts
//                               isLoading ? (
//                                 <CSpinner size="sm" color="info" />
//                               ) : sortedTransactions.length > 0 ? (
//                                 <CDropdown>
//                                   <CDropdownToggle size="sm" color="info" variant="outline">
//                                     {sortedTransactions.length} Receipt{sortedTransactions.length > 1 ? 's' : ''}
//                                   </CDropdownToggle>
//                                   <CDropdownMenu>
//                                     {sortedTransactions.map((transaction, txIndex) => {
//                                       const transactionId = transaction._id;
//                                       const transactionNumber = transaction.referenceNumber || 'N/A';
//                                       const transactionAmount = transaction.amount || 0;
//                                       const transactionDate = transaction.dateFormatted || 
//                                                             new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                      
//                                       return (
//                                         <CDropdownItem 
//                                           key={transactionId || txIndex} 
//                                           onClick={() => printBrokerReceipt(transactionId, brokerId, brokerData.branches[0]?.branchId)}
//                                         >
//                                           <div className="d-flex align-items-center">
//                                             <CIcon icon={cilPrint} className="me-2" />
//                                             <div>
//                                               <div><strong>Receipt #{txIndex + 1}</strong></div>
//                                               <small>
//                                                 ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
//                                               </small>
//                                             </div>
//                                           </div>
//                                         </CDropdownItem>
//                                       );
//                                     })}
//                                   </CDropdownMenu>
//                                 </CDropdown>
//                               ) : transactionsFetched[brokerId] ? (
//                                 <span className="text-muted">No receipts</span>
//                               ) : (
//                                 brokerData.branches && brokerData.branches.length > 0 ? (
//                                   <CButton
//                                     size="sm"
//                                     color="light"
//                                     onClick={() => fetchTransactionsForBroker(brokerId, brokerData.branches[0].branchId)}
//                                     disabled={isLoading}
//                                   >
//                                     <CIcon icon={cilCloudDownload} className="me-1" />
//                                     Load Receipts
//                                   </CButton>
//                                 ) : (
//                                   <span className="text-muted">No branch data</span>
//                                 )
//                               )
//                             ) : (
//                               // When showing all branches, show message to expand
//                               <span className="text-muted small">Expand to view receipts</span>
//                             )}
//                           </CTableDataCell>
                          
//                           {showActionColumn && (
//                             <CTableDataCell>
//                               <CButton
//                                 size="sm"
//                                 className='option-button btn-sm'
//                                 onClick={(event) => handleClick(event, brokerData.broker._id, brokerData)}
//                                 disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
//                               >
//                                 <CIcon icon={cilSettings} />
//                                 Options
//                               </CButton>
//                               <Menu
//                                 id={`action-menu-${brokerData.broker._id}`}
//                                 anchorEl={anchorEl}
//                                 open={menuId === brokerData.broker._id}
//                                 onClose={handleClose}
//                               >
//                                 {canCreateExchangeLedger && (
//                                   <MenuItem onClick={() => handleAddClick(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}>
//                                     <CIcon icon={cilPlus} className="me-2" />
//                                     Add Payment
//                                   </MenuItem>
//                                 )}
//                                 {canViewExchangeLedger && (
//                                   <MenuItem
//                                     onClick={() => handleViewLedger(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}
//                                   >
//                                     View Ledger
//                                   </MenuItem>
//                                 )}
//                               </Menu>
//                             </CTableDataCell>
//                           )}
//                         </CTableRow>
                        
//                         {!isFiltered &&
//                           expandedBrokers[brokerData.broker._id] &&
//                           brokerData.branches.map((branch, branchIndex) => {
//                             const branchKey = `${brokerId}-${branch.branchId}`;
//                             const hasBranchTransactions = transactionsFetched[branchKey] && transactionsData[branchKey]?.length > 0;
//                             const isBranchLoading = loadingTransactions[branchKey];
//                             const branchTransactions = transactionsData[branchKey] || [];
                            
//                          // Sort branch transactions in DESCENDING order (newest first)
// const sortedBranchTransactions = [...branchTransactions].sort((a, b) => {
//   const dateA = new Date(a.date || a.createdAt || 0);
//   const dateB = new Date(b.date || b.createdAt || 0);
//   return dateB - dateA; // DESCENDING order (newest first)
// });

// // In the branch dropdown mapping:
// {sortedBranchTransactions.map((transaction, txIndex) => {
//   const transactionId = transaction._id;
//   const transactionNumber = transaction.referenceNumber || 'N/A';
//   const transactionAmount = transaction.amount || 0;
//   const transactionDate = transaction.dateFormatted || 
//                         new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
  
//   // Log to verify the order
//   console.log(`Branch Receipt #${txIndex + 1}:`, {
//     id: transactionId,
//     date: transaction.date,
//     formattedDate: transactionDate,
//     amount: transactionAmount
//   });
  
//   return (
//     <CDropdownItem 
//       key={transactionId || txIndex} 
//       onClick={() => printBrokerReceipt(transactionId, brokerId, branch.branchId)}
//     >
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilPrint} className="me-2" />
//         <div>
//           <div><strong>Receipt #{txIndex + 1}</strong></div>
//           <small>
//             ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
//           </small>
//         </div>
//       </div>
//     </CDropdownItem>
//   );
// })}
                            
//                             return (
//                               <CTableRow key={`${brokerData.broker._id}-${branch.branchId}`} className="branch-detail-row">
//                                 <CTableDataCell></CTableDataCell>
//                                 <CTableDataCell></CTableDataCell>
//                                 <CTableDataCell></CTableDataCell>
//                                 <CTableDataCell></CTableDataCell>
//                                 <CTableDataCell>{branch.name || 'N/A'}</CTableDataCell>
//                                 <CTableDataCell>{branch.bookings || 0}</CTableDataCell>
//                                 <CTableDataCell>{branch.exchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                                 <CTableDataCell>{branch.credit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                                 <CTableDataCell>{branch.debit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                                 <CTableDataCell>{branch.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                                 <CTableDataCell>{branch.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                                 <CTableDataCell>{branch.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                
//                                 {/* Receipts Column for Branch */}
//                                 <CTableDataCell>
//                                   {isBranchLoading ? (
//                                     <CSpinner size="sm" color="info" />
//                                   ) : sortedBranchTransactions.length > 0 ? (
//                                     <CDropdown>
//                                       <CDropdownToggle size="sm" color="info" variant="outline">
//                                         {sortedBranchTransactions.length} Receipt{sortedBranchTransactions.length > 1 ? 's' : ''}
//                                       </CDropdownToggle>
//                                       <CDropdownMenu>
//                                         {sortedBranchTransactions.map((transaction, txIndex) => {
//                                           const transactionId = transaction._id;
//                                           const transactionNumber = transaction.referenceNumber || 'N/A';
//                                           const transactionAmount = transaction.amount || 0;
//                                           const transactionDate = transaction.dateFormatted || 
//                                                                 new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                          
//                                           return (
//                                             <CDropdownItem 
//                                               key={transactionId || txIndex} 
//                                               onClick={() => printBrokerReceipt(transactionId, brokerId, branch.branchId)}
//                                             >
//                                               <div className="d-flex align-items-center">
//                                                 <CIcon icon={cilPrint} className="me-2" />
//                                                 <div>
//                                                   <div><strong>Receipt #{txIndex + 1}</strong></div>
//                                                   <small>
//                                                     ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
//                                                   </small>
//                                                 </div>
//                                               </div>
//                                             </CDropdownItem>
//                                           );
//                                         })}
//                                       </CDropdownMenu>
//                                     </CDropdown>
//                                   ) : transactionsFetched[branchKey] ? (
//                                     <span className="text-muted">No receipts</span>
//                                   ) : (
//                                     <CButton
//                                       size="sm"
//                                       color="light"
//                                       onClick={() => fetchTransactionsForBroker(brokerId, branch.branchId)}
//                                       disabled={isBranchLoading}
//                                     >
//                                       <CIcon icon={cilCloudDownload} className="me-1" />
//                                       Load Receipts
//                                     </CButton>
//                                   )}
//                                 </CTableDataCell>
                                
//                                 {showActionColumn && (
//                                   <CTableDataCell>
//                                     <CButton
//                                       size="sm"
//                                       className='option-button btn-sm'
//                                       onClick={(event) =>
//                                         handleClick(event, `${brokerData.broker._id}-${branch.branchId}`, brokerData, branch.branchId)
//                                       }
//                                       disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
//                                     >
//                                       <CIcon icon={cilSettings} />
//                                       Options
//                                     </CButton>
//                                     <Menu
//                                       id={`action-menu-${brokerData.broker._id}-${branch.branchId}`}
//                                       anchorEl={anchorEl}
//                                       open={menuId === `${brokerData.broker._id}-${branch.branchId}`}
//                                       onClose={handleClose}
//                                     >
//                                       {canCreateExchangeLedger && (
//                                         <MenuItem onClick={() => handleAddClick(brokerData, branch.branchId)}>
//                                           <CIcon icon={cilPlus} className="me-2" />
//                                           Add Payment
//                                         </MenuItem>
//                                       )}
//                                       {canViewExchangeLedger && (
//                                         <MenuItem onClick={() => handleViewLedger(brokerData, branch.branchId)}>
//                                           View Ledger
//                                         </MenuItem>
//                                       )}
//                                     </Menu>
//                                   </CTableDataCell>
//                                 )}
//                               </CTableRow>
//                             );
//                           })}
//                       </React.Fragment>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       <CModal alignment="center" visible={showFilterModal} onClose={() => setShowFilterModal(false)}>
//         <CModalHeader>
//           <CModalTitle>Search</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Select Branch</CFormLabel>
//             <CFormSelect 
//               value={selectedBranch} 
//               onChange={(e) => setSelectedBranch(e.target.value)}
//               disabled={!canViewExchangeLedger}
//             >
//               <option value="ALL">All Branches</option>
             
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name || 'N/A'}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="primary" 
//             onClick={handleBranchFilter}
//             disabled={!canViewExchangeLedger}
//           >
//             Search
//           </CButton>
//         </CModalFooter>
//       </CModal>
      
//       {/* Export Report Modal */}
//       <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal} size="lg">
//         <CModalHeader>
//           <CModalTitle>
//             <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
//             Export Brokers Report
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {exportError && (
//             <CAlert color="warning" className="mb-3">
//               {exportError}
//             </CAlert>
//           )}
          
//           <LocalizationProvider 
//             dateAdapter={AdapterDateFns} 
//             adapterLocale={enIN}
//           >
//             <div className="mb-3">
//               <CFormLabel>Select Branch</CFormLabel>
//               <CFormSelect 
//                 value={exportBranchId} 
//                 onChange={(e) => {
//                   setExportBranchId(e.target.value);
//                   setExportError('');
//                 }}
//                 disabled={!canCreateExchangeLedger}
//               >
//                 <option value="">-- Select Branch --</option>
//                 <option value="ALL">All Branches</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name || 'N/A'}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>
            
//             <div className="mb-3">
//               <DatePicker
//                 label="Start Date"
//                 value={exportStartDate}
//                 onChange={(newValue) => {
//                   setExportStartDate(newValue);
//                   setExportError('');
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy"
//                 mask="__/__/____"
//                 views={['day', 'month', 'year']}
//                 disabled={!canCreateExchangeLedger}
//               />
//             </div>
//             <div className="mb-3">
//               <DatePicker
//                 label="End Date"
//                 value={exportEndDate}
//                 onChange={(newValue) => {
//                   setExportEndDate(newValue);
//                   setExportError('');
//                 }}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//                 inputFormat="dd/MM/yyyy"
//                 mask="__/__/____"
//                 minDate={exportStartDate}
//                 views={['day', 'month', 'year']}
//                 disabled={!canCreateExchangeLedger}
//               />
//             </div>
//           </LocalizationProvider>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCloseExportModal}>
//             Cancel
//           </CButton>
//           <CButton 
//             className="submit-button"
//             onClick={handleExcelExport}
//             disabled={!exportStartDate || !exportEndDate || !exportBranchId || !canCreateExchangeLedger || exportLoading}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : 'Export Excel'}
//           </CButton>
//         </CModalFooter>
//       </CModal>
      
//       <ExchangeLedgerModel 
//         show={showModal} 
//         onClose={() => setShowModal(false)} 
//         brokerData={selectedledger} 
//         refreshData={fetchData}
//         onPaymentSaved={handlePaymentSaved}
//         canCreateExchangeLedger={canCreateExchangeLedger}
//         onPaymentSuccess={(receiptId, brokerId, branchId) => {
//           if (receiptId && brokerId && branchId) {
//             setTimeout(() => {
//               printBrokerReceipt(receiptId, brokerId, branchId);
//             }, 500);
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default ExchangeLedger;





import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  useTableFilter,
  usePagination,
  axiosInstance,
  showError
} from '../../utils/tableImports';
import tvsLogo from '../../assets/images/logo.png';
import '../../css/invoice.css';
import config from '../../config';
import ExchangeLedgerModel from './ExchangeLedgerModel';
import {
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilSearch, cilZoomOut, cilPrint, cilCloudDownload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';

// Import date-fns locale for Indian date format
import { enIN } from 'date-fns/locale';

// Import permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';
import { useCallback } from 'react';

// Pagination constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;

const ExchangeLedger = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedledger, setSelectedledger] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [expandedBrokers, setExpandedBrokers] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add ref for mount status
  const isMounted = React.useRef(true);
  
  // Debounce timer for search
  const searchTimer = React.useRef(null);
  
  // Pagination states - ADD SEARCH TO PAGINATION STATE
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: '', // ADD SEARCH FIELD
    totalRecords: 0,
    hasNext: false,
    hasPrev: false
  });

  // ============ RECEIPTS FETCHING STATES ============
  const [transactionsData, setTransactionsData] = useState({});
  const [loadingTransactions, setLoadingTransactions] = useState({});
  const [transactionsFetched, setTransactionsFetched] = useState({});
  
  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState(null);
  const [exportEndDate, setExportEndDate] = useState(null);
  const [exportBranchId, setExportBranchId] = useState('');
  const [exportError, setExportError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { permissions } = useAuth();

  // Page-level permission checks for Exchange Ledger under ACCOUNT module
  const canViewExchangeLedger = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  const canCreateExchangeLedger = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  const canUpdateExchangeLedger = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  const canDeleteExchangeLedger = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.EXCHANGE_LEDGER);
  
  const showActionColumn = canCreateExchangeLedger || canViewExchangeLedger;

  // Format date to DD-MM-YYYY for display
  const formatDateDDMMYYYY = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    isMounted.current = true;
    
    if (!canViewExchangeLedger) {
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, ''); // ADD EMPTY SEARCH PARAM
    fetchBranches();
    
    return () => {
      isMounted.current = false;
      // Clear any pending search timers
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [canViewExchangeLedger]);

  useEffect(() => {
    if (pagination.docs.length > 0) {
      const grouped = groupDataByBroker(pagination.docs, isFiltered);
      setGroupedData(grouped);
      setFilteredData(grouped);
      
      // Initialize transactions data structure
      const initialTransactionsMap = {};
      grouped.forEach(brokerData => {
        const key = brokerData.broker._id;
        initialTransactionsMap[key] = [];
        
        // Also initialize for branches if needed
        if (!isFiltered && brokerData.branches) {
          brokerData.branches.forEach(branch => {
            const branchKey = `${brokerData.broker._id}-${branch.branchId}`;
            initialTransactionsMap[branchKey] = [];
          });
        }
      });
      setTransactionsData(initialTransactionsMap);
    }
  }, [pagination.docs, isFiltered]);

  const fetchBranches = async () => {
    if (!canViewExchangeLedger) {
      return;
    }
    
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  // Fetch data with pagination and search - ADD SEARCH PARAMETER
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search, branchId = null) => {
    if (!canViewExchangeLedger || !isMounted.current) {
      return;
    }
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      setError(null); // Clear any previous errors
      
      // Build URL with query parameters
      let url = '/broker-ledger/summary/detailed';
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // ADD SEARCH PARAMETER IF PROVIDED
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      if (branchId) {
        url = `/broker-ledger/summary/branch/${branchId}`;
        // Add pagination params to branch URL as well
        url += `?${params.toString()}`;
      } else {
        url += `?${params.toString()}`;
      }

      const response = await axiosInstance.get(url);

      if (!isMounted.current) return;

      if (response.data.success) {
        const responseData = response.data.data;
        const brokers = responseData.brokers || [];
        const paginationInfo = responseData.pagination || {
          current: page,
          total: 1,
          count: brokers.length,
          totalRecords: brokers.length,
          hasNext: false,
          hasPrev: false
        };

        if (branchId) {
          const branchName = branches.find((b) => b._id === branchId)?.name || 'Selected Branch';
          setSelectedBranchName(branchName);

          const branchData = brokers.map((broker) => ({
            broker: broker.broker,
            branch: {
              _id: responseData.branch,
              name: branchName
            },
            bookings: {
              total: broker.bookings?.total || 0,
              details: broker.bookings?.details || []
            },
            financials: {
              totalExchangeAmount: broker.financials?.totalExchangeAmount || 0,
              ledger: {
                currentBalance: broker.financials?.ledger?.currentBalance || 0,
                onAccount: broker.financials?.ledger?.onAccount || 0,
                totalCredit: broker.financials?.ledger?.totalCredit || 0,
                totalDebit: broker.financials?.ledger?.totalDebit || 0,
                outstandingAmount: broker.financials?.ledger?.outstandingAmount || 0,
                transactions: broker.financials?.ledger?.transactions || 0
              },
              summary: {
                totalReceived: broker.financials?.summary?.totalReceived || 0,
                totalPayable: broker.financials?.summary?.totalPayable || 0,
                netBalance: broker.financials?.ledger?.currentBalance || 0
              }
            },
            recentTransactions: broker.recentTransactions || [],
            association: {
              isActive: broker.association?.isActive || true
            }
          }));

          setPagination({
            docs: branchData,
            total: paginationInfo.totalRecords || branchData.length,
            pages: paginationInfo.total || 1,
            currentPage: paginationInfo.current || page,
            limit: limit,
            loading: false,
            search: search, // STORE SEARCH TERM
            totalRecords: paginationInfo.totalRecords || branchData.length,
            hasNext: paginationInfo.hasNext || false,
            hasPrev: paginationInfo.hasPrev || false
          });

          setData(branchData);
          setIsFiltered(true);
        } else {
          setPagination({
            docs: brokers,
            total: paginationInfo.totalRecords || brokers.length,
            pages: paginationInfo.total || 1,
            currentPage: paginationInfo.current || page,
            limit: limit,
            loading: false,
            search: search, // STORE SEARCH TERM
            totalRecords: paginationInfo.totalRecords || brokers.length,
            hasNext: paginationInfo.hasNext || false,
            hasPrev: paginationInfo.hasPrev || false
          });

          setData(brokers);
          setIsFiltered(false);
          setSelectedBranchName('');
        }
      } else {
        throw new Error('Failed to fetch exchange ledger data');
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      const message = showError(error);
      if (message) {
        setError(message);
      }
      
      setPagination(prev => ({ 
        ...prev, 
        loading: false, 
        docs: [], 
        total: 0,
        totalRecords: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchData(newPage, pagination.limit, pagination.search, isFiltered ? selectedBranch : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchData(1, limit, pagination.search, isFiltered ? selectedBranch : null);
  };

  // Handle search with debounce - SIMILAR TO REFUND COMPONENT
  const handleSearch = (value) => {
    if (!canViewExchangeLedger) {
      return;
    }
    
    setSearchTerm(value);
    setError(null); // Clear any previous errors when starting new search
    
    // Clear any pending search timer
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    searchTimer.current = setTimeout(() => {
      // Only fetch if component is still mounted
      if (isMounted.current) {
        // If search is empty or just spaces, fetch without search parameter
        if (!value.trim()) {
          fetchData(1, pagination.limit, '', isFiltered ? selectedBranch : null);
        } else {
          fetchData(1, pagination.limit, value, isFiltered ? selectedBranch : null);
        }
      }
    }, 400); // 400ms debounce delay
  };

  // Render pagination component
  const renderPagination = () => {
    const { currentPage, pages, totalRecords, limit, loading, hasNext, hasPrev } = pagination;
    if (!totalRecords || pages <= 1) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalRecords);

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
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${totalRecords} entries`}
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

  // ============ FETCH TRANSACTIONS FOR BROKER (REQUIRES BOTH IDs) ============
  const fetchTransactionsForBroker = useCallback(async (brokerId, branchId) => {
    // Both IDs are required - don't proceed if either is missing
    if (!brokerId || !branchId) {
      console.log('Cannot fetch transactions: Both brokerId and branchId are required');
      return;
    }
    
    const key = `${brokerId}-${branchId}`;
    
    if (transactionsFetched[key] || loadingTransactions[key]) {
      return;
    }

    try {
      setLoadingTransactions(prev => ({ ...prev, [key]: true }));
      
      const response = await axiosInstance.get(`/broker-ledger/branch-transactions/${brokerId}/${branchId}`);
      
      const transactions = response.data.data.transactions || [];
      
      setTransactionsData(prev => ({
        ...prev,
        [key]: transactions
      }));
      
      setTransactionsFetched(prev => ({
        ...prev,
        [key]: true
      }));
    } catch (error) {
      console.error(`Error fetching transactions for broker ${brokerId} and branch ${branchId}:`, error);
      setTransactionsData(prev => ({
        ...prev,
        [key]: []
      }));
      setTransactionsFetched(prev => ({
        ...prev,
        [key]: true
      }));
    } finally {
      setLoadingTransactions(prev => ({ ...prev, [key]: false }));
    }
  }, [transactionsFetched, loadingTransactions]);

  // ============ PRINT RECEIPT FUNCTION - USING BRANCH TRANSACTIONS API ============
  const printBrokerReceipt = async (transactionId, brokerId, branchId) => {
    try {
      console.log('Fetching transactions for broker:', brokerId, 'branch:', branchId);
      
      // Fetch all transactions for this broker and branch
      const response = await axiosInstance.get(`/broker-ledger/branch-transactions/${brokerId}/${branchId}`);
      console.log('Transactions response:', response.data);
      
      const transactionData = response.data.data;
      
      // Find the specific transaction by ID
      const transaction = transactionData.transactions?.find(t => t._id === transactionId);
      
      if (!transaction) {
        showError('Transaction not found');
        return;
      }
      
      console.log('Found transaction:', transaction);
      
      // Get the amount from the transaction object
      const amount = transaction.amount || 0;
      console.log('Amount being used:', amount);
      
      const receivedDate = transaction.dateFormatted || 
                          new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
      
      const currentDate = new Date().toLocaleDateString('en-GB');
      
      const brokerName = transactionData.broker?.name || 'N/A';
      const branchName = transactionData.branch?.name || 'N/A';
      const branchAddress = transactionData.branch?.address || '';
      const branchPhone = transactionData.branch?.phone || '';
      const branchEmail = transactionData.branch?.email || '';
      
      const qrText = `GANDHI MOTORS PVT LTD
Broker: ${brokerName}
Branch: ${branchName}
Receipt No: ${transaction.referenceNumber || transaction._id}
Amount: ₹${amount}
Payment Mode: ${transaction.modeOfPayment || 'Cash'}
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
            <text x="75" y="90" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Receipt: ${transaction.referenceNumber || ''}</text>
          </svg>
        `);
      }

      // Pass the transaction object and the transactionData
      const receiptHTML = generateReceiptHTML(transaction, transactionData, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };
      
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      console.error('Error response:', err.response?.data);
      showError('Failed to load receipt. Please try again.');
    }
  };

  // ============ GENERATE RECEIPT HTML ============
  const generateReceiptHTML = (transaction, transactionData, qrCodeImage, receivedDate, currentDate, brokerName, branchName, branchAddress, branchPhone, branchEmail) => {
    const receiptNumber = transaction.referenceNumber || transaction._id || 'N/A';
    const amount = transaction.amount || 0;
    const paymentMode = transaction.modeOfPayment || 'Cash';
    const remark = transaction.remark || '';
    const referenceNumber = transaction.referenceNumber || '';
    const approvalStatus = transaction.approvalStatus || 'Pending';
    const cashLocation = transaction.cashLocation?.name || '';
    const bankName = transaction.bank?.name || '';
    const subPaymentMode = transaction.subPaymentMode?.payment_mode || '';
    
    const amountInWords = numberToWordsSimple(amount);

    return `<!DOCTYPE html>
  <html>
  <head>
    <title>Broker Payment Receipt - ${receiptNumber}</title>
    <style>
      body {
        font-family: "Courier New", Courier, monospace;
        margin: 0;
        padding: 10mm;
        font-size: 15px;
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
        height: 51px;
      }
      .qr-code-small {
        width: 81px;
        height: 81px;
        border: 1px solid #ccc;
      }
      .dealer-info {
        text-align: left;
        font-size: 13px;
        line-height: 1.2;
      }
      .dealer-name {
        font-size: 17px;
        font-weight: bold;
        margin: 0 0 3px 0;
      }
      .broker-info-container {
        display: flex;
        font-size: 14px;
        margin: 10px 0;
      }
      .broker-info-left {
        width: 50%;
      }
      .broker-info-right {
        width: 50%;
      }
      .info-row {
        margin: 2mm 0;
        line-height: 1.2;
      }
      /* Style for values in info rows */
      .info-row .value {
        font-weight: 700;
      }
      .divider {
        border-top: 2px solid #AAAAAA;
        margin: 3mm 0;
      }
      .receipt-info {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 9px;
        margin: 11px 0;
        font-size: 14px;
      }
      .receipt-info .value {
        font-weight: 700;
      }
      .payment-info-box {
        margin: 11px 0;
      }
      .signature-box {
        margin-top: 16mm;
        font-size: 11pt;
      }
      .signature-line {
        border-top: 1px dashed #000;
        width: 41mm;
        display: inline-block;
        margin: 0 5mm;
      }
      .cutting-line {
        border-top: 2px dashed #333;
        margin: 16mm 0 11mm 0;
        text-align: center;
        position: relative;
      }
      .cutting-line::before {
        content: "✂ Cut Here ✂";
        position: absolute;
        top: -11px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 0 11px;
        font-size: 13px;
        color: #666;
      }
      .note {
        padding: 2px;
        margin: 3px;
        font-size: 12px;
      }
      .note .value {
        font-weight: 700;
      }
      .amount-in-words {
        font-style: italic;
        margin-top: 9px;
        padding: 6px;
        font-size: 13px;
        border-top: 1px dashed #ccc;
      }
      .amount-in-words .value {
        font-weight: 700;
        font-style: normal;
      }
      .status-badge {
        display: inline-block;
        padding: 4px 9px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        background-color: ${approvalStatus === 'Approved' ? '#d4edda' : approvalStatus === 'Rejected' ? '#f8d7da' : '#fff3cd'};
        color: ${approvalStatus === 'Approved' ? '#155724' : approvalStatus === 'Rejected' ? '#721c24' : '#856404'};
        border: 1px solid ${approvalStatus === 'Approved' ? '#c3e6cb' : approvalStatus === 'Rejected' ? '#f5c6cb' : '#ffeeba'};
      }
      .footer-note {
        font-size: 10px;
        color: #777;
        text-align: center;
        margin-top: 5mm;
      }
      .payment-details {
        margin-top: 10px;
        border-collapse: collapse;
        width: 100%;
      }
      .payment-details td {
        padding: 4px;
        border: none;
      }
      /* 2-column grid for payment info */
      .payment-grid-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 15px;
        padding: 4px;
        font-size: 14px;
      }
      .payment-grid-item {
        padding: 2px 0;
        line-height: 1.3;
      }
      .payment-grid-item strong {
        font-weight: 600;
        margin-right: 5px;
        min-width: 110px;
        display: inline-block;
      }
      .payment-grid-item .value {
        font-weight: 700;
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
              Phone: 7498903672
            </div>
          </div>
          <div class="header-right">
            <div class="logo-qr-container">
              <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
              ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
            </div>
            <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
            <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
          </div>
        </div>
        
        <div class="divider"></div>
  
        <div class="receipt-info">
          <div><strong>BROKER PAYMENT RECEIPT</strong></div>
          <div><strong>Receipt Date:</strong> <span class="value">${receivedDate}</span></div>
        </div>
  
        <div class="broker-info-container">
          <div class="broker-info-left">
            <div class="info-row"><strong>Broker Name:</strong> <span class="value">${brokerName}</span></div>
            <div class="info-row"><strong>Branch:</strong> <span class="value">${branchName}</span></div>
            <div class="info-row"><strong>Payment Mode:</strong> <span class="value">${paymentMode}</span></div>
            ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> <span class="value">${cashLocation}</span></div>` : ''}
            ${bankName ? `<div class="info-row"><strong>Bank:</strong> <span class="value">${bankName}</span></div>` : ''}
          </div>
          <div class="broker-info-right">
            <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
            ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> <span class="value">${subPaymentMode}</span></div>` : ''}
            <div class="info-row"><strong>Branch Address:</strong> <span class="value">${branchAddress}</span></div>
            <div class="info-row"><strong>Branch Phone:</strong> <span class="value">${branchPhone}</span></div>
          </div>
        </div>
  
        <div class="payment-info-box">
          <div class="receipt-info" style="padding: 5px;">
            <!-- Payment Information Grid - 2 columns (2 rows) with existing fields only -->
            <div class="payment-grid-2col">
              <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
             
            </div>
          </div>
          
          <div class="amount-in-words">
            <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
          </div>
        </div>
  
        <div class="note">
          <strong>Notes:</strong> <span class="value">This is a system generated receipt for Broker On-Account payment.</span>
        </div>
        
        <div class="divider"></div>
  
        <div class="signature-box">
          <div style="display: flex; justify-content: space-between;">
            <div style="text-align:center; width: 30%;">
              <div class="signature-line"></div>
              <div>Broker's Signature</div>
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
              Phone: 7498903672
            </div>
          </div>
          <div class="header-right">
            <div class="logo-qr-container">
              <img src="${tvsLogo}" class="logo" alt="TVS Logo" onerror="this.style.display='none'">
              ${qrCodeImage ? `<img src="${qrCodeImage}" class="qr-code-small" alt="QR Code" />` : ''}
            </div>
            <div style="margin-top: 4px; font-size: 12px;">Date: ${currentDate}</div>
            <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
          </div>
        </div>
        
        <div class="divider"></div>
  
        <div class="receipt-info">
          <div><strong>BROKER PAYMENT RECEIPT (DUPLICATE)</strong></div>
          <div><strong>Receipt Date:</strong> <span class="value">${receivedDate}</span></div>
        </div>
  
        <div class="broker-info-container">
          <div class="broker-info-left">
            <div class="info-row"><strong>Broker Name:</strong> <span class="value">${brokerName}</span></div>
            <div class="info-row"><strong>Branch:</strong> <span class="value">${branchName}</span></div>
            <div class="info-row"><strong>Payment Mode:</strong> <span class="value">${paymentMode}</span></div>
            ${cashLocation ? `<div class="info-row"><strong>Cash Location:</strong> <span class="value">${cashLocation}</span></div>` : ''}
            ${bankName ? `<div class="info-row"><strong>Bank:</strong> <span class="value">${bankName}</span></div>` : ''}
          </div>
          <div class="broker-info-right">
            <div class="info-row"><strong>Reference No:</strong> <span class="value">${referenceNumber}</span></div>
            ${subPaymentMode ? `<div class="info-row"><strong>Sub Mode:</strong> <span class="value">${subPaymentMode}</span></div>` : ''}
            <div class="info-row"><strong>Branch Address:</strong> <span class="value">${branchAddress}</span></div>
            <div class="info-row"><strong>Branch Phone:</strong> <span class="value">${branchPhone}</span></div>
          </div>
        </div>
  
        <div class="payment-info-box">
          <div class="receipt-info" style="padding: 5px;">
            <!-- Payment Information Grid - 2 columns (2 rows) with existing fields only -->
            <div class="payment-grid-2col">
              <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹${amount.toLocaleString('en-IN')}</span></div>
              
          </div>
          
          <div class="amount-in-words">
            <strong>Amount in words:</strong> <span class="value">${amountInWords} Only</span>
          </div>
        </div>
  
        <div class="note">
          <strong>Notes:</strong> <span class="value">This is a system generated receipt for Broker On-Account payment.</span>
        </div>
        
        <div class="divider"></div>
  
        <div class="signature-box">
          <div style="display: flex; justify-content: space-between;">
            <div style="text-align:center; width: 30%;">
              <div class="signature-line"></div>
              <div>Broker's Signature</div>
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

  const handleBranchFilter = async () => {
    if (!canViewExchangeLedger) {
      return;
    }
    
    if (selectedBranch) {
      await fetchData(1, pagination.limit, pagination.search, selectedBranch);
    } else {
      await fetchData(1, pagination.limit, pagination.search);
    }
    setShowFilterModal(false);
  };

  const clearFilter = async () => {
    if (!canViewExchangeLedger) {
      return;
    }
    
    setSelectedBranch('');
    setSearchTerm(''); // Clear search input
    await fetchData(1, pagination.limit, ''); // Clear search parameter
    setShowFilterModal(false);
  };

  const groupDataByBroker = (brokersData, isFilteredMode = false) => {
    const brokerMap = {};

    brokersData.forEach((item) => {
      const brokerId = item.broker._id;

      if (!brokerMap[brokerId]) {
        brokerMap[brokerId] = {
          broker: item.broker,
          branches: [],
          totalBookings: 0,
          totalExchangeAmount: 0,
          totalCredit: 0,
          totalDebit: 0,
          onAccount: 0,
          currentBalance: 0,
          outstandingAmount: 0
        };
      }

      if (isFilteredMode) {
        brokerMap[brokerId].branches = [
          {
            name: item.branch.name,
            branchId: item.branch._id,
            bookings: item.bookings.total,
            exchangeAmount: item.financials.totalExchangeAmount,
            credit: item.financials.ledger.totalCredit,
            debit: item.financials.ledger.totalDebit,
            onAccount: item.financials.ledger.onAccount,
            currentBalance: item.financials.ledger.currentBalance,
            outstandingAmount: item.financials.ledger.outstandingAmount
          }
        ];

        brokerMap[brokerId].totalBookings = item.bookings.total;
        brokerMap[brokerId].totalExchangeAmount = item.financials.totalExchangeAmount;
        brokerMap[brokerId].totalCredit = item.financials.ledger.totalCredit;
        brokerMap[brokerId].totalDebit = item.financials.ledger.totalDebit;
        brokerMap[brokerId].onAccount = item.financials.ledger.onAccount;
        brokerMap[brokerId].currentBalance = item.financials.ledger.currentBalance;
        brokerMap[brokerId].outstandingAmount = item.financials.ledger.outstandingAmount;
      } else {
        brokerMap[brokerId].branches.push({
          name: item.branch.name,
          branchId: item.branch._id,
          bookings: item.bookings.total,
          exchangeAmount: item.financials.totalExchangeAmount,
          credit: item.financials.ledger.totalCredit,
          debit: item.financials.ledger.totalDebit,
          onAccount: item.financials.ledger.onAccount,
          currentBalance: item.financials.ledger.currentBalance,
          outstandingAmount: item.financials.ledger.outstandingAmount
        });

        brokerMap[brokerId].totalBookings += item.bookings.total;
        brokerMap[brokerId].totalExchangeAmount += item.financials.totalExchangeAmount;
        brokerMap[brokerId].totalCredit += item.financials.ledger.totalCredit;
        brokerMap[brokerId].totalDebit += item.financials.ledger.totalDebit;
        brokerMap[brokerId].onAccount += item.financials.ledger.onAccount;
        brokerMap[brokerId].currentBalance += item.financials.ledger.currentBalance;
        brokerMap[brokerId].outstandingAmount += item.financials.ledger.outstandingAmount;
      }
    });

    return Object.values(brokerMap);
  };

  const toggleBrokerExpansion = (brokerId) => {
    if (!canViewExchangeLedger) {
      return;
    }
    
    if (!isFiltered) {
      setExpandedBrokers((prev) => ({
        ...prev,
        [brokerId]: !prev[brokerId]
      }));
    }
  };

  const handleClick = (event, id, brokerData = null, branchId = null) => {
    if (!canViewExchangeLedger && !canCreateExchangeLedger) {
      return;
    }
    
    setAnchorEl(event.currentTarget);
    setMenuId(id);
    if (brokerData) {
      setSelectedledger({ ...brokerData, branchId });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleAddClick = (brokerData, branchId = null) => {
    if (!canCreateExchangeLedger) {
      showError('You do not have permission to add payments');
      return;
    }
    
    setSelectedledger({ ...brokerData, branchId });
    setShowModal(true);
    handleClose();
  };

  const handleViewLedger = async (brokerData, branchId = null) => {
    if (!canViewExchangeLedger) {
      showError('You do not have permission to view ledgers');
      return;
    }
    
    try {
      let url = `/broker-ledger/statement/${brokerData.broker?._id}`;
      if (branchId) {
        url += `?branchId=${branchId}`;
      }

      const res = await axiosInstance.get(url);
      const ledgerData = res.data.data;
      const ledgerUrl = `${config.baseURL}/brokerData.html?ledgerId=${brokerData._id}`;
      let totalCredit = 0;
      let totalDebit = 0;
      const totalOnAccount = ledgerData.summary?.totalOnAccount ?? ledgerData.onAccountBalance ?? 0;

      ledgerData.transactions?.forEach((entry) => {
        if (entry.type === 'CREDIT') {
          totalCredit += entry.amount;
        } else if (entry.type === 'DEBIT') {
          totalDebit += entry.amount;
        }
      });
      const finalBalance = totalDebit - totalCredit;
      const availableOnAccount2 = totalOnAccount - totalCredit;

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
                  <div><strong>Broker Name:</strong> ${ledgerData.broker?.name || 'N/A'}</div>
                  <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
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
                    ${ledgerData.transactions
  ?.map(
    (entry) => {
      let exchangeVehicleNumber = '';
      let exchangeChassisNumber = '';
      let exchangePrice = '';
      let exchangeStatus = '';
      let bookingNumber = entry.booking?.bookingNumber || '';
      
      if (entry.exchangeVehicle && entry.exchangeVehicle.VehicleNumber) {
        exchangeVehicleNumber = entry.exchangeVehicle.VehicleNumber || '';
        exchangeChassisNumber = entry.exchangeVehicle.ChassisNumber || '';
        exchangePrice = entry.exchangeVehicle.PriceFormatted || '';
        exchangeStatus = entry.exchangeVehicle.Status || '';
      } else if (entry.exchangeDisplay && entry.exchangeDisplay.VehicleNumber) {
        exchangeVehicleNumber = entry.exchangeDisplay.VehicleNumber || '';
        exchangeChassisNumber = entry.exchangeDisplay.ChassisNumber || '';
        exchangePrice = entry.exchangeDisplay.Price || '';
        exchangeStatus = entry.exchangeDisplay.Status || '';
      } else if (entry.booking?.exchange?.display) {
        const exchangeDisplay = entry.booking.exchange.display;
        exchangeVehicleNumber = exchangeDisplay.vehicleNumber || '';
        exchangeChassisNumber = exchangeDisplay.chassisNumber || '';
        exchangePrice = exchangeDisplay.price ? `₹${exchangeDisplay.price.toLocaleString('en-IN')}` : '';
        exchangeStatus = exchangeDisplay.status || '';
      } else if (entry.booking?.exchange?.details) {
        const exchangeDetails = entry.booking.exchange.details;
        exchangeVehicleNumber = exchangeDetails.vehicleNumber || '';
        exchangeChassisNumber = exchangeDetails.chassisNumber || '';
        exchangePrice = exchangeDetails.price ? `₹${exchangeDetails.price.toLocaleString('en-IN')}` : '';
        exchangeStatus = exchangeDetails.status || '';
      }
      
      return `
      <tr>
        <td>${new Date(entry.date).toLocaleDateString() || 'N/A'}</td>
        <td>
          Booking No: ${bookingNumber || '-'}<br>
          Customer: ${entry.booking?.customer?.name || '-'}<br>
       
          ${entry.mode || ''}
          ${exchangeVehicleNumber ? `<br>Exchange Vehicle: ${exchangeVehicleNumber}` : ''}
          ${exchangeChassisNumber ? `<br>Exchange Chassis: ${exchangeChassisNumber}` : ''}
        </td>
        <td>${entry.receiptNumber || ''}</td>
        <td class="text-right">${entry.type === 'CREDIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
        <td class="text-right">${entry.type === 'DEBIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
        <td class="text-right"></td>
      </tr>
    `;
    }
  )
  .join('')}
                      <tr>
                      <td colspan="3" class="text-left"><strong>Total OnAccount</strong></td>
                      <td class="text-right"></td>
                      <td class="text-right"></td>
                      <td class="text-right"><strong>${availableOnAccount2.toLocaleString('en-IN')}</strong></td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
                      <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
                      <td class="text-right"><strong>${finalBalance.toLocaleString('en-IN')}</strong></td>
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
      const message = showError(err);
      if (message) {
        setError(message);
      }
    }
    handleClose();
  };

  // REMOVE THIS FUNCTION - WE'RE USING SERVER-SIDE SEARCH NOW
  // const handleSearch = (value) => {
  //   if (!canViewExchangeLedger) {
  //     return;
  //   }
  //   
  //   setSearchTerm(value);
  //   handleFilter(value, ['broker.name']);
  // };

  const handlePaymentSaved = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    // Refresh current page after payment
    fetchData(pagination.currentPage, pagination.limit, pagination.search, isFiltered ? selectedBranch : null);
  };

  const handleOpenExportModal = () => {
    if (!canCreateExchangeLedger) {
      showError('You do not have permission to export reports');
      return;
    }
    
    setShowExportModal(true);
    setExportError('');
    if (isFiltered && selectedBranch) {
      setExportBranchId(selectedBranch);
    }
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setExportStartDate(null);
    setExportEndDate(null);
    setExportBranchId('');
    setExportError('');
    setExportLoading(false);
  };

  const handleExcelExport = async () => {
    if (!canCreateExchangeLedger) {
      showError('You do not have permission to export reports');
      return;
    }
    
    setExportError('');
    
    if (!exportBranchId) {
      setExportError('Please select a branch');
      return;
    }

    if (!exportStartDate || !exportEndDate) {
      setExportError('Please select both start and end dates');
      return;
    }

    if (exportStartDate > exportEndDate) {
      setExportError('Start date cannot be after end date');
      return;
    }

    try {
      setExportLoading(true);
      
      const formattedStartDate = formatDateForAPI(exportStartDate);
      const formattedEndDate = formatDateForAPI(exportEndDate);

      const params = new URLSearchParams({
        branchId: exportBranchId,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      const response = await axiosInstance.get(
        `/reports/brokers?${params.toString()}`,
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        if (!errorData.success && errorData.message) {
          setExportError(errorData.message);
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: errorData.message,
          });
          return;
        }
      }

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const branchName = branches.find(b => b._id === exportBranchId)?.name || 'Branch';
      const startDateStr = formatDateDDMMYYYY(exportStartDate);
      const endDateStr = formatDateDDMMYYYY(exportEndDate);
      const fileName = `Brokers_Report_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Excel exported successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });

      handleCloseExportModal();
      
    } catch (error) {
      console.error('Error exporting report:', error);
      
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(error.response.data);
          });
          
          const errorData = JSON.parse(text);
          
          if (errorData.message) {
            setExportError(errorData.message);
            Swal.fire({
              icon: 'error',
              title: 'Export Failed',
              text: errorData.message,
            });
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setExportError('Failed to export report');
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'Failed to export report',
          });
        }
      } else if (error.response?.data?.message) {
        setExportError(error.response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: error.response.data.message,
        });
      } else if (error.message) {
        setExportError(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: error.message,
        });
      } else {
        setExportError('Failed to export report');
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: 'Failed to export report',
        });
      }
      
    } finally {
      setExportLoading(false);
    }
  };

  if (!canViewExchangeLedger) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Exchange Ledger.
      </div>
    );
  }

  if (loading && pagination.docs.length === 0 && !pagination.search) {
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

  const totalColumns = isFiltered ? 12 : 13;
  const actionColumnIndex = showActionColumn ? 1 : 0;

  return (
    <div>
      <div className='title'>Exchange Ledger {isFiltered && `- ${selectedBranchName}`}</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setShowFilterModal(true)}
              disabled={!canViewExchangeLedger}
            >
              <CIcon icon={cilSearch} className='me-1' />
              Search
            </CButton>
            {isFiltered && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={clearFilter}
                disabled={!canViewExchangeLedger}
              >
                <CIcon icon={cilZoomOut} className='me-1' />
                Clear Filter
              </CButton>
            )}
            
            {canCreateExchangeLedger && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleOpenExportModal}
                title="Export Excel Report"
              >
                <FontAwesomeIcon icon={faFileExcel} className='me-1' />
                Export Report
              </CButton>
            )}
          </div>
          <div className="text-muted">
            Total Records: {pagination.totalRecords || 0}
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
                disabled={!canViewExchangeLedger}
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
                placeholder="Search by broker name..."
              />
            </div>
          </div>
          
          {pagination.loading && pagination.docs.length > 0 && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Searching records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  {!isFiltered && <CTableHeaderCell></CTableHeaderCell>}
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Exchange Broker Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  {!isFiltered && <CTableHeaderCell>Branch</CTableHeaderCell>}
                  <CTableHeaderCell>Total Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Total Exchange Amount</CTableHeaderCell>
                  <CTableHeaderCell>Total Received</CTableHeaderCell>
                  <CTableHeaderCell>Total Payable</CTableHeaderCell>
                  <CTableHeaderCell>Opening Balance</CTableHeaderCell>
                  <CTableHeaderCell>Current Balance</CTableHeaderCell>
                  <CTableHeaderCell>Outstanding Amount</CTableHeaderCell>
                  <CTableHeaderCell>Receipts</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Actions</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {groupedData.length === 0 && !pagination.loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={totalColumns + actionColumnIndex} className="text-center">
                      {pagination.search ? `No matching ledger details found for "${pagination.search}"` : 'No ledger details available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  groupedData.map((brokerData, index) => {
                    const brokerId = brokerData.broker._id;
                    const hasTransactions = transactionsFetched[brokerId] && transactionsData[brokerId]?.length > 0;
                    const isLoading = loadingTransactions[brokerId];
                    const transactions = transactionsData[brokerId] || [];
                    
                    // Sort transactions in DESCENDING order (newest first)
                    const sortedTransactions = [...transactions].sort((a, b) => {
                      const dateA = new Date(a.date || a.createdAt || 0);
                      const dateB = new Date(b.date || b.createdAt || 0);
                      return dateB - dateA; // DESCENDING order (newest first)
                    });

                    // Calculate global index based on pagination
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    
                    return (
                      <React.Fragment key={brokerData.broker._id}>
                        <CTableRow className="broker-summary-row">
                          {!isFiltered && (
                            <CTableDataCell>
                              <CButton
                                color="link"
                                size="sm"
                                onClick={() => toggleBrokerExpansion(brokerData.broker._id)}
                                disabled={!canViewExchangeLedger}
                              >
                                {expandedBrokers[brokerData.broker._id] ? '▼' : '►'}
                              </CButton>
                            </CTableDataCell>
                          )}
                          <CTableDataCell>{globalIndex}</CTableDataCell>
                          <CTableDataCell>{brokerData.broker.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{brokerData.broker.mobile || 'N/A'}</CTableDataCell>
                          {!isFiltered && <CTableDataCell>All Branches</CTableDataCell>}
                          <CTableDataCell>{brokerData.totalBookings || 0}</CTableDataCell>
                          <CTableDataCell>{brokerData.totalExchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          <CTableDataCell>{brokerData.totalCredit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          <CTableDataCell>{brokerData.totalDebit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          <CTableDataCell>{brokerData.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          <CTableDataCell>{brokerData.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          <CTableDataCell>{brokerData.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                          
                          {/* Receipts Column - Only show for filtered view or expanded branches */}
                          <CTableDataCell>
                            {isFiltered ? (
                              // When filtered by branch, we can show receipts
                              isLoading ? (
                                <CSpinner size="sm" color="info" />
                              ) : sortedTransactions.length > 0 ? (
                                <CDropdown>
                                  <CDropdownToggle size="sm" color="info" variant="outline">
                                    {sortedTransactions.length} Receipt{sortedTransactions.length > 1 ? 's' : ''}
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    {sortedTransactions.map((transaction, txIndex) => {
                                      const transactionId = transaction._id;
                                      const transactionNumber = transaction.referenceNumber || 'N/A';
                                      const transactionAmount = transaction.amount || 0;
                                      const transactionDate = transaction.dateFormatted || 
                                                            new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                      
                                      return (
                                        <CDropdownItem 
                                          key={transactionId || txIndex} 
                                          onClick={() => printBrokerReceipt(transactionId, brokerId, brokerData.branches[0]?.branchId)}
                                        >
                                          <div className="d-flex align-items-center">
                                            <CIcon icon={cilPrint} className="me-2" />
                                            <div>
                                              <div><strong>Receipt #{txIndex + 1}</strong></div>
                                              <small>
                                                ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
                                              </small>
                                            </div>
                                          </div>
                                        </CDropdownItem>
                                      );
                                    })}
                                  </CDropdownMenu>
                                </CDropdown>
                              ) : transactionsFetched[brokerId] ? (
                                <span className="text-muted">No receipts</span>
                              ) : (
                                brokerData.branches && brokerData.branches.length > 0 ? (
                                  <CButton
                                    size="sm"
                                    color="light"
                                    onClick={() => fetchTransactionsForBroker(brokerId, brokerData.branches[0].branchId)}
                                    disabled={isLoading}
                                  >
                                    <CIcon icon={cilCloudDownload} className="me-1" />
                                    Load Receipts
                                  </CButton>
                                ) : (
                                  <span className="text-muted">No branch data</span>
                                )
                              )
                            ) : (
                              // When showing all branches, show message to expand
                              <span className="text-muted small">Expand to view receipts</span>
                            )}
                          </CTableDataCell>
                          
                          {showActionColumn && (
                            <CTableDataCell>
                              <CButton
                                size="sm"
                                className='option-button btn-sm'
                                onClick={(event) => handleClick(event, brokerData.broker._id, brokerData)}
                                disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
                              >
                                <CIcon icon={cilSettings} />
                                Options
                              </CButton>
                              <Menu
                                id={`action-menu-${brokerData.broker._id}`}
                                anchorEl={anchorEl}
                                open={menuId === brokerData.broker._id}
                                onClose={handleClose}
                              >
                                {canCreateExchangeLedger && (
                                  <MenuItem onClick={() => handleAddClick(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}>
                                    <CIcon icon={cilPlus} className="me-2" />
                                    Add Payment
                                  </MenuItem>
                                )}
                                {canViewExchangeLedger && (
                                  <MenuItem
                                    onClick={() => handleViewLedger(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}
                                  >
                                    View Ledger
                                  </MenuItem>
                                )}
                              </Menu>
                            </CTableDataCell>
                          )}
                        </CTableRow>
                        
                        {!isFiltered &&
                          expandedBrokers[brokerData.broker._id] &&
                          brokerData.branches.map((branch, branchIndex) => {
                            const branchKey = `${brokerId}-${branch.branchId}`;
                            const hasBranchTransactions = transactionsFetched[branchKey] && transactionsData[branchKey]?.length > 0;
                            const isBranchLoading = loadingTransactions[branchKey];
                            const branchTransactions = transactionsData[branchKey] || [];
                            
                            // Sort branch transactions in DESCENDING order (newest first)
                            const sortedBranchTransactions = [...branchTransactions].sort((a, b) => {
                              const dateA = new Date(a.date || a.createdAt || 0);
                              const dateB = new Date(b.date || b.createdAt || 0);
                              return dateB - dateA; // DESCENDING order (newest first)
                            });
                            
                            return (
                              <CTableRow key={`${brokerData.broker._id}-${branch.branchId}`} className="branch-detail-row">
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell>{branch.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{branch.bookings || 0}</CTableDataCell>
                                <CTableDataCell>{branch.exchangeAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                <CTableDataCell>{branch.credit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                <CTableDataCell>{branch.debit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                <CTableDataCell>{branch.onAccount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                <CTableDataCell>{branch.currentBalance?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                <CTableDataCell>{branch.outstandingAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                                
                                {/* Receipts Column for Branch */}
                                <CTableDataCell>
                                  {isBranchLoading ? (
                                    <CSpinner size="sm" color="info" />
                                  ) : sortedBranchTransactions.length > 0 ? (
                                    <CDropdown>
                                      <CDropdownToggle size="sm" color="info" variant="outline">
                                        {sortedBranchTransactions.length} Receipt{sortedBranchTransactions.length > 1 ? 's' : ''}
                                      </CDropdownToggle>
                                      <CDropdownMenu>
                                        {sortedBranchTransactions.map((transaction, txIndex) => {
                                          const transactionId = transaction._id;
                                          const transactionNumber = transaction.referenceNumber || 'N/A';
                                          const transactionAmount = transaction.amount || 0;
                                          const transactionDate = transaction.dateFormatted || 
                                                                new Date(transaction.date || transaction.createdAt).toLocaleDateString('en-GB');
                                          
                                          return (
                                            <CDropdownItem 
                                              key={transactionId || txIndex} 
                                              onClick={() => printBrokerReceipt(transactionId, brokerId, branch.branchId)}
                                            >
                                              <div className="d-flex align-items-center">
                                                <CIcon icon={cilPrint} className="me-2" />
                                                <div>
                                                  <div><strong>Receipt #{txIndex + 1}</strong></div>
                                                  <small>
                                                    ₹{transactionAmount.toLocaleString('en-IN')} - {transactionNumber} - {transactionDate}
                                                  </small>
                                                </div>
                                              </div>
                                            </CDropdownItem>
                                          );
                                        })}
                                      </CDropdownMenu>
                                    </CDropdown>
                                  ) : transactionsFetched[branchKey] ? (
                                    <span className="text-muted">No receipts</span>
                                  ) : (
                                    <CButton
                                      size="sm"
                                      color="light"
                                      onClick={() => fetchTransactionsForBroker(brokerId, branch.branchId)}
                                      disabled={isBranchLoading}
                                    >
                                      <CIcon icon={cilCloudDownload} className="me-1" />
                                      Load Receipts
                                    </CButton>
                                  )}
                                </CTableDataCell>
                                
                                {showActionColumn && (
                                  <CTableDataCell>
                                    <CButton
                                      size="sm"
                                      className='option-button btn-sm'
                                      onClick={(event) =>
                                        handleClick(event, `${brokerData.broker._id}-${branch.branchId}`, brokerData, branch.branchId)
                                      }
                                      disabled={!canCreateExchangeLedger && !canViewExchangeLedger}
                                    >
                                      <CIcon icon={cilSettings} />
                                      Options
                                    </CButton>
                                    <Menu
                                      id={`action-menu-${brokerData.broker._id}-${branch.branchId}`}
                                      anchorEl={anchorEl}
                                      open={menuId === `${brokerData.broker._id}-${branch.branchId}`}
                                      onClose={handleClose}
                                    >
                                      {canCreateExchangeLedger && (
                                        <MenuItem onClick={() => handleAddClick(brokerData, branch.branchId)}>
                                          <CIcon icon={cilPlus} className="me-2" />
                                          Add Payment
                                        </MenuItem>
                                      )}
                                      {canViewExchangeLedger && (
                                        <MenuItem onClick={() => handleViewLedger(brokerData, branch.branchId)}>
                                          View Ledger
                                        </MenuItem>
                                      )}
                                    </Menu>
                                  </CTableDataCell>
                                )}
                              </CTableRow>
                            );
                          })}
                      </React.Fragment>
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

      <CModal alignment="center" visible={showFilterModal} onClose={() => setShowFilterModal(false)}>
        <CModalHeader>
          <CModalTitle>Search</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Select Branch</CFormLabel>
            <CFormSelect 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={!canViewExchangeLedger}
            >
              <option value="ALL">All Branches</option>
             
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name || 'N/A'}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="primary" 
            onClick={handleBranchFilter}
            disabled={!canViewExchangeLedger}
          >
            Search
          </CButton>
        </CModalFooter>
      </CModal>
      
      {/* Export Report Modal */}
      <CModal alignment="center" visible={showExportModal} onClose={handleCloseExportModal} size="lg">
        <CModalHeader>
          <CModalTitle>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Export Brokers Report
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {exportError && (
            <CAlert color="warning" className="mb-3">
              {exportError}
            </CAlert>
          )}
          
          <LocalizationProvider 
            dateAdapter={AdapterDateFns} 
            adapterLocale={enIN}
          >
            <div className="mb-3">
              <CFormLabel>Select Branch</CFormLabel>
              <CFormSelect 
                value={exportBranchId} 
                onChange={(e) => {
                  setExportBranchId(e.target.value);
                  setExportError('');
                }}
                disabled={!canCreateExchangeLedger}
              >
                <option value="">-- Select Branch --</option>
                <option value="ALL">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name || 'N/A'}
                  </option>
                ))}
              </CFormSelect>
            </div>
            
            <div className="mb-3">
              <DatePicker
                label="Start Date"
                value={exportStartDate}
                onChange={(newValue) => {
                  setExportStartDate(newValue);
                  setExportError('');
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                inputFormat="dd/MM/yyyy"
                mask="__/__/____"
                views={['day', 'month', 'year']}
                disabled={!canCreateExchangeLedger}
              />
            </div>
            <div className="mb-3">
              <DatePicker
                label="End Date"
                value={exportEndDate}
                onChange={(newValue) => {
                  setExportEndDate(newValue);
                  setExportError('');
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                inputFormat="dd/MM/yyyy"
                mask="__/__/____"
                minDate={exportStartDate}
                views={['day', 'month', 'year']}
                disabled={!canCreateExchangeLedger}
              />
            </div>
          </LocalizationProvider>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseExportModal}>
            Cancel
          </CButton>
          <CButton 
            className="submit-button"
            onClick={handleExcelExport}
            disabled={!exportStartDate || !exportEndDate || !exportBranchId || !canCreateExchangeLedger || exportLoading}
          >
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : 'Export Excel'}
          </CButton>
        </CModalFooter>
      </CModal>
      
      <ExchangeLedgerModel 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        brokerData={selectedledger} 
        refreshData={() => fetchData(pagination.currentPage, pagination.limit, pagination.search, isFiltered ? selectedBranch : null)}
        onPaymentSaved={handlePaymentSaved}
        canCreateExchangeLedger={canCreateExchangeLedger}
        onPaymentSuccess={(receiptId, brokerId, branchId) => {
          if (receiptId && brokerId && branchId) {
            setTimeout(() => {
              printBrokerReceipt(receiptId, brokerId, branchId);
            }, 500);
          }
        }}
      />
    </div>
  );
};

export default ExchangeLedger;