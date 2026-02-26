// import '../../css/table.css';
// import '../../css/bill.css';
// import {
//   React,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   showError
// } from '../../utils/tableImports';
// import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';
// import config from '../../config';
// import { useState } from 'react';
// import tvsLogo from '../../assets/images/logo.png';
// import tvssangamner from '../../assets/images/tvssangamner.png';
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

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const AllReceipt = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords, PaginationOptions } = usePagination(filteredData);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   const { permissions } = useAuth();

//   // Page-level permission checks for All Receipts under ACCOUNT module
//   const canViewAllReceipts = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);
//   const canCreateAllReceipts = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);
//   const canUpdateAllReceipts = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);
//   const canDeleteAllReceipts = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);

//   useEffect(() => {
//     if (!canViewAllReceipts) {
//       return;
//     }
    
//     fetchData();
//   }, [canViewAllReceipts]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/vouchers`);
//       console.log('API Response:', response.data);
//       setData(response.data.transactions);
//       setFilteredData(response.data.transactions);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrintReceipt = async (id) => {
//     if (!canViewAllReceipts) {
//       showError('You do not have permission to view receipts');
//       return;
//     }
    
//     try {
//       const res = await axiosInstance.get(`/vouchers/${id}`);
//       const data = res.data.data;

//       const receiptHTML = generateReceiptHTML(data);

//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(receiptHTML);
//       printWindow.document.close();
//       printWindow.focus();
//     } catch (err) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const getFileIcon = (fileUrl) => {
//     if (!fileUrl) return null;

//     const extension = fileUrl.split('.').pop().toLowerCase();

//     if (extension === 'pdf') {
//       return <FaFilePdf className="file-icon pdf" />;
//     } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
//       return <FaFileImage className="file-icon image" />;
//     } else {
//       return <FaFileAlt className="file-icon other" />;
//     }
//   };

//   const handleViewBill = (billUrl) => {
//     if (!canViewAllReceipts) {
//       showError('You do not have permission to view bills');
//       return;
//     }
    
//     if (!billUrl) return;

//     const fullUrl = `${config.baseURL}${billUrl}`;
//     const extension = billUrl.split('.').pop().toLowerCase();

//     if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
//       window.open(fullUrl, '_blank');
//     } else if (extension === 'pdf') {
//       window.open(fullUrl, '_blank');
//     } else {
//       const link = document.createElement('a');
//       link.href = fullUrl;
//       link.download = billUrl.split('/').pop();
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const numberToWords = (num) => {
//     if (num === 0) return 'Zero';

//     const a = [
//       '',
//       'One',
//       'Two',
//       'Three',
//       'Four',
//       'Five',
//       'Six',
//       'Seven',
//       'Eight',
//       'Nine',
//       'Ten',
//       'Eleven',
//       'Twelve',
//       'Thirteen',
//       'Fourteen',
//       'Fifteen',
//       'Sixteen',
//       'Seventeen',
//       'Eighteen',
//       'Nineteen'
//     ];
//     const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//     const g = ['', 'Thousand', 'Lakh', 'Crore'];

//     const toWords999 = (n) => {
//       if (n === 0) return '';
//       if (n < 20) return a[n];
//       if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
//       return `${a[Math.floor(n / 100)]} Hundred ${toWords999(n % 100)}`.trim();
//     };

//     let res = '';
//     let i = 0;
//     while (num > 0) {
//       const chunk = num % 1000;
//       if (chunk) res = `${toWords999(chunk)} ${g[i]} ${res}`.trim();
//       num = Math.floor(num / 1000);
//       i++;
//     }
//     return res;
//   };

//   const generateReceiptHTML = (receipt) => {
//     const amountWords = numberToWords(receipt.amount);
//     const ledgerUrl = `${config.baseURL}/ledger.html?customerId=${receipt._id}`;
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Account Customer Receipt</title>
//         <style>
//           body { 
//           font-family: Courier New;
//           width: 210mm;
//           margin: 0 auto;
//           padding: 10mm; 
//           }

//           .header-container {
//           margin-bottom: 10px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//            border-bottom: 2px solid #AAAAAA;
//         }
//         .logo-left {
//           width: 30mm;
//           height: auto;
//         }
//         .logo-right {
//           width: 30mm;
//           height: auto;
//         }
//         .header-text {
//           flex-grow: 1;
//         }
//         .header-text h1 {
//           margin: 0;
//           font-size: 24px;
//         }
//         .header-text p {
//           margin: 2px 0;
//           font-size: 14px;
//         }
        
        
//           .section { 
//           margin-bottom: 10px; 
//           }
        
//           .signature { margin-top: 30px; text-align: right; font-weight: bold; }
//           hr { margin: 15px 0; }
//           @page { size: A4; margin: 20mm; }

//           .header2 h4{
//              padding:5px;
//             font-weight:700;
//             color:#555555;
//           }
//             .divider{
//             border: 1px solid #AAAAAA;
//             }
//             .main-section{
//               display:flex;
//               justify-content:space-between;
//             }
//                .footer {
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
//         </style>
//       </head>
//       <body>

//        <div class="header-container">
//               <div>
//              <img src="${tvsLogo}" class="logo-left" alt="TVS Logo">
//                   <div class="header-text">
//                       <h1>GANDHI TVS</h1>
//                        <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
//                       <p>Registered office:'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar,<br> Nashik Road, Nashik ,7498903672</p>
//                      </div>
//               </div>
//               <div>
//                 <img src="${tvssangamner}" class="logo-right" alt="TVS Logo">
//                 </div>
//       </div>
//         <div class="main-section">
//           <div class="section"><strong>Receipt No:</strong> ${receipt.voucherId}</div>
//           <div class="section"><strong>Receipt Date:</strong> ${new Date(receipt.date).toLocaleDateString('en-GB')}</div>
//         </div>
    
//         <div class="section"><strong>Recipient:</strong> ${receipt.recipientName}</div>
//         <div class="section"><strong>Payment Mode:</strong> ${receipt.paymentMode}</div>
//         <div class="section">Amount: ₹${receipt.amount}</div>
//         <div class="section">( In Words ) &nbsp; ${amountWords} Only</div>
//         <div class="divider"></div>

//         <div class='header2'>
//         <h4>NOTE- THIS RECEIPT IS VALID SUBJECT TO BANK REALISATION</h4>
//         </div>
       
//        <div class="footer">
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
//       </body>
//       </html>
//     `;
//   };

//   const handleSearch = (value) => {
//     if (!canViewAllReceipts) {
//       return;
//     }
    
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('allReceipts'));
//   };

//   if (!canViewAllReceipts) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view All Receipts.
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
  
//   return (
//     <div>
//       <div className='title'>Cash Receipt</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div></div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewAllReceipts}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Voucher ID</CTableHeaderCell>
//                   <CTableHeaderCell>Recipient Name</CTableHeaderCell>
//                   <CTableHeaderCell>Date</CTableHeaderCell>
//                   <CTableHeaderCell>Debit</CTableHeaderCell>
//                   <CTableHeaderCell>Credit</CTableHeaderCell>
//                   <CTableHeaderCell>Payment Mode</CTableHeaderCell>
//                   <CTableHeaderCell>Bank Location</CTableHeaderCell>
//                   <CTableHeaderCell>Cash Location</CTableHeaderCell>
//                   <CTableHeaderCell>Bill</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="11" className="text-center">
//                       No cash receipts available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((item, index) => (
//                     <CTableRow key={item.id || item._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{item.receiptNo || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{item.accountHead || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{item.date || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{item.debit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{item.credit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>{item.paymentMode || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{item.bankLocation || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{item.cashLocation || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {item.billUrl ? (
//                           <div 
//                             className="bill-cell" 
//                             onClick={() => handleViewBill(item.billUrl)}
//                             style={{ cursor: canViewAllReceipts ? 'pointer' : 'not-allowed' }}
//                             title={canViewAllReceipts ? "View Bill" : "No permission to view bill"}
//                           >
//                             {getFileIcon(item.billUrl)}
//                             <span className="bill-text">View Bill</span>
//                           </div>
//                         ) : (
//                           'No bill'
//                         )}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <CButton
//                           size="sm"
//                           color="info"
//                           className="action-btn"
//                           onClick={() => handlePrintReceipt(item.id || item._id)}
//                           disabled={!canViewAllReceipts}
//                           title={canViewAllReceipts ? "View Receipt" : "No permission to view receipt"}
//                         >
//                           View
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

// export default AllReceipt;










import '../../css/table.css';
import '../../css/bill.css';
import {
  React,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance,
  showError
} from '../../utils/tableImports';
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';
import config from '../../config';
import { useState } from 'react';
import tvsLogo from '../../assets/images/logo.png';
import tvssangamner from '../../assets/images/tvssangamner.png';
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
  CAlert
} from '@coreui/react';

// Import permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

const AllReceipt = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { permissions } = useAuth();

  // Page-level permission checks for All Receipts under ACCOUNT module
  const canViewAllReceipts = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);
  const canCreateAllReceipts = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);
  const canUpdateAllReceipts = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);
  const canDeleteAllReceipts = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.ALL_RECEIPTS);

  useEffect(() => {
    if (!canViewAllReceipts) {
      return;
    }
    
    fetchData();
  }, [canViewAllReceipts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/vouchers`);
      console.log('API Response:', response.data);
      setData(response.data.transactions);
      setFilteredData(response.data.transactions);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = async (id) => {
    if (!canViewAllReceipts) {
      showError('You do not have permission to view receipts');
      return;
    }
    
    try {
      const res = await axiosInstance.get(`/vouchers/${id}`);
      const data = res.data.data;

      const receiptHTML = generateReceiptHTML(data);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
    } catch (err) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return null;

    const extension = fileUrl.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
      return <FaFilePdf className="file-icon pdf" />;
    } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
      return <FaFileImage className="file-icon image" />;
    } else {
      return <FaFileAlt className="file-icon other" />;
    }
  };

  const handleViewBill = (billUrl) => {
    if (!canViewAllReceipts) {
      showError('You do not have permission to view bills');
      return;
    }
    
    if (!billUrl) return;

    const fullUrl = `${config.baseURL}${billUrl}`;
    const extension = billUrl.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
      window.open(fullUrl, '_blank');
    } else if (extension === 'pdf') {
      window.open(fullUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = billUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const numberToWords = (num) => {
    if (num === 0) return 'Zero';

    const a = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const g = ['', 'Thousand', 'Lakh', 'Crore'];

    const toWords999 = (n) => {
      if (n === 0) return '';
      if (n < 20) return a[n];
      if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
      return `${a[Math.floor(n / 100)]} Hundred ${toWords999(n % 100)}`.trim();
    };

    let res = '';
    let i = 0;
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk) res = `${toWords999(chunk)} ${g[i]} ${res}`.trim();
      num = Math.floor(num / 1000);
      i++;
    }
    return res;
  };

  const generateReceiptHTML = (receipt) => {
    const amountWords = numberToWords(receipt.amount);
    const ledgerUrl = `${config.baseURL}/ledger.html?customerId=${receipt._id}`;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Account Customer Receipt</title>
        <style>
          body { 
          font-family: Courier New;
          width: 210mm;
          margin: 0 auto;
          padding: 10mm; 
          }

          .header-container {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
           border-bottom: 2px solid #AAAAAA;
        }
        .logo-left {
          width: 30mm;
          height: auto;
        }
        .logo-right {
          width: 30mm;
          height: auto;
        }
        .header-text {
          flex-grow: 1;
        }
        .header-text h1 {
          margin: 0;
          font-size: 24px;
        }
        .header-text p {
          margin: 2px 0;
          font-size: 14px;
        }
        
        
          .section { 
          margin-bottom: 10px; 
          }
        
          .signature { margin-top: 30px; text-align: right; font-weight: bold; }
          hr { margin: 15px 0; }
          @page { size: A4; margin: 20mm; }

          .header2 h4{
             padding:5px;
            font-weight:700;
            color:#555555;
          }
            .divider{
            border: 1px solid #AAAAAA;
            }
            .main-section{
              display:flex;
              justify-content:space-between;
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
        </style>
      </head>
      <body>

       <div class="header-container">
              <div>
             <img src="${tvsLogo}" class="logo-left" alt="TVS Logo">
                  <div class="header-text">
                      <h1>GANDHI TVS</h1>
                       <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
                      <p>Registered office:'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar,<br> Nashik Road, Nashik ,7498903672</p>
                     </div>
              </div>
              <div>
                <img src="${tvssangamner}" class="logo-right" alt="TVS Logo">
                </div>
      </div>
        <div class="main-section">
          <div class="section"><strong>Receipt No:</strong> ${receipt.voucherId}</div>
          <div class="section"><strong>Receipt Date:</strong> ${new Date(receipt.date).toLocaleDateString('en-GB')}</div>
        </div>
    
        <div class="section"><strong>Recipient:</strong> ${receipt.recipientName}</div>
        <div class="section"><strong>Payment Mode:</strong> ${receipt.paymentMode}</div>
        <div class="section">Amount: ₹${receipt.amount}</div>
        <div class="section">( In Words ) &nbsp; ${amountWords} Only</div>
        <div class="divider"></div>

        <div class='header2'>
        <h4>NOTE- THIS RECEIPT IS VALID SUBJECT TO BANK REALISATION</h4>
        </div>
       
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
      </body>
      </html>
    `;
  };

  const handleSearch = (value) => {
    if (!canViewAllReceipts) {
      return;
    }
    
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('allReceipts'));
  };

  if (!canViewAllReceipts) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view All Receipts.
      </div>
    );
  }

  if (loading) {
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
      <div className='title'>Cash Receipt</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div></div>
          <div className='d-flex'>
            <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={!canViewAllReceipts}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Voucher ID</CTableHeaderCell>
                  <CTableHeaderCell>Recipient Name</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Debit</CTableHeaderCell>
                  <CTableHeaderCell>Credit</CTableHeaderCell>
                  <CTableHeaderCell>Payment Mode</CTableHeaderCell>
                  <CTableHeaderCell>Bank Location</CTableHeaderCell>
                  <CTableHeaderCell>Cash Location</CTableHeaderCell>
                  <CTableHeaderCell>Bill</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
                      No cash receipts available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <CTableRow key={item.id || item._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.receiptNo || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.accountHead || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.date || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{item.debit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>₹{item.credit?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                      <CTableDataCell>{item.paymentMode || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.bankLocation || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{item.cashLocation || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {item.billUrl ? (
                          <div 
                            className="bill-cell" 
                            onClick={() => handleViewBill(item.billUrl)}
                            style={{ cursor: canViewAllReceipts ? 'pointer' : 'not-allowed' }}
                            title={canViewAllReceipts ? "View Bill" : "No permission to view bill"}
                          >
                            {getFileIcon(item.billUrl)}
                            <span className="bill-text">View Bill</span>
                          </div>
                        ) : (
                          'No bill'
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="info"
                          className="action-btn"
                          onClick={() => handlePrintReceipt(item.id || item._id)}
                          disabled={!canViewAllReceipts}
                          title={canViewAllReceipts ? "View Receipt" : "No permission to view receipt"}
                        >
                          View
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AllReceipt;