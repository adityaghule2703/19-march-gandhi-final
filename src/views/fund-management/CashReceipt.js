// import '../../css/table.css';
// import {
//   React,
//   useEffect,
//   useState,
//   useTableFilter,
//   axiosInstance,
//   getDefaultSearchFields,
//   showError
// } from '../../utils/tableImports';
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
//   CSpinner
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage
// } from '../../utils/modulePermissions';

// const CashReceipt = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { permissions } = useAuth();
  
//   // Page-level permission check for All Cash Receipt page under Fund Management module
//   const canViewCashReceipt = canViewPage(permissions, MODULES.FUND_MANAGEMENT, PAGES.FUND_MANAGEMENT.ALL_CASH_RECEIPT);

//   // Helper function to parse the date in DD-MM-YYYY format
//   const parseDate = (dateString) => {
//     if (!dateString) return null;
    
//     try {
//       // Split the date and time parts
//       const [datePart, timePart] = dateString.split(' ');
//       const [day, month, year] = datePart.split('-').map(Number);
      
//       if (timePart) {
//         const [hours, minutes] = timePart.split(':').map(Number);
//         // Month is 0-indexed in JavaScript Date (0 = January, 11 = December)
//         return new Date(year, month - 1, day, hours, minutes);
//       } else {
//         return new Date(year, month - 1, day);
//       }
//     } catch (error) {
//       console.error('Error parsing date:', dateString, error);
//       return null;
//     }
//   };

//   // Helper function to format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     const date = parseDate(dateString);
//     if (!date || isNaN(date.getTime())) {
//       return 'Invalid Date';
//     }
    
//     // Format as DD/MM/YYYY
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
    
//     return `${day}/${month}/${year}`;
//   };

//   useEffect(() => {
//     if (!canViewCashReceipt) {
//       showError('You do not have permission to view Cash Receipts');
//       return;
//     }
    
//     fetchData();
//   }, [canViewCashReceipt]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/vouchers`);
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

//   const handleViewPdf = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/vouchers/receipt/${id}`, {
//         responseType: 'blob'
//       });

//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `receipt_${id}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       alert('Failed to download receipt. Please try again.');
//     }
//   };

//   const getVoucherSpecificType = (item) => {
//     switch (item.voucherCategory) {
//       case 'ContraVoucher':
//         return item.contraType || '';
//       case 'CashVoucher':
//         return item.expenseType || '';
//       case 'WorkshopReceipt':
//         return item.reciptType || '';
//       default:
//         return '';
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('vouchers'));
//   };

//   if (!canViewCashReceipt) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Cash Receipts.
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
//       {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Cash Receipt</div>
    
//       <CCard className='table-container mt-4'>
        
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
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Voucher ID</CTableHeaderCell>
//                   <CTableHeaderCell>Recipient Name</CTableHeaderCell>
//                   <CTableHeaderCell>Date</CTableHeaderCell>
//                   <CTableHeaderCell>Voucher Type</CTableHeaderCell>
//                   <CTableHeaderCell>Voucher Category</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Debit</CTableHeaderCell>
//                   <CTableHeaderCell>Credit</CTableHeaderCell>
//                   <CTableHeaderCell>Payment Mode</CTableHeaderCell>
//                   <CTableHeaderCell>Bank Location</CTableHeaderCell>
//                   <CTableHeaderCell>Cash Location</CTableHeaderCell>
//                   <CTableHeaderCell>Action</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="13" className="text-center">
//                       No cash receipt available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   filteredData.map((item, index) => (
//                     <CTableRow key={item.id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{item.receiptNo}</CTableDataCell>
//                       <CTableDataCell>{item.accountHead}</CTableDataCell>
//                       <CTableDataCell>
//                         {/* Use the formatDate function instead of new Date().toLocaleDateString() */}
//                         {formatDate(item.date)}
//                       </CTableDataCell>
//                       <CTableDataCell>{item.type}</CTableDataCell>
//                       <CTableDataCell>{item.voucherCategory}</CTableDataCell>
//                       <CTableDataCell>{getVoucherSpecificType(item)}</CTableDataCell>
//                       <CTableDataCell>{item.debit || ''}</CTableDataCell>
//                       <CTableDataCell>{item.credit || ''}</CTableDataCell>
//                       <CTableDataCell>{item.paymentMode || ''}</CTableDataCell>
//                       <CTableDataCell>{item.bankLocation || ''}</CTableDataCell>
//                       <CTableDataCell>{item.cashLocation || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <CButton
//                           size="sm"
//                           className='option-button btn-sm'
//                           onClick={() => handleViewPdf(item.id)}
//                         >
//                           View PDF
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

// export default CashReceipt;




import '../../css/table.css';
import {
  React,
  useEffect,
  useState,
  useTableFilter,
  axiosInstance,
  getDefaultSearchFields,
  showError
} from '../../utils/tableImports';
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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useAuth } from '../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage
} from '../../utils/modulePermissions';

const CashReceipt = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { permissions } = useAuth();
  
  // Page-level permission check for All Cash Receipt page under Fund Management module
  const canViewCashReceipt = canViewPage(permissions, MODULES.FUND_MANAGEMENT, PAGES.FUND_MANAGEMENT.ALL_CASH_RECEIPT);

  // Helper function to parse the date in DD-MM-YYYY format
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Split the date and time parts
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-').map(Number);
      
      if (timePart) {
        const [hours, minutes] = timePart.split(':').map(Number);
        // Month is 0-indexed in JavaScript Date (0 = January, 11 = December)
        return new Date(year, month - 1, day, hours, minutes);
      } else {
        return new Date(year, month - 1, day);
      }
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return null;
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Format as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!canViewCashReceipt) {
      showError('You do not have permission to view Cash Receipts');
      return;
    }
    
    fetchData();
  }, [canViewCashReceipt]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/vouchers`);
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

  const handleViewPdf = async (id) => {
    try {
      const response = await axiosInstance.get(`/vouchers/receipt/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `receipt_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const getVoucherSpecificType = (item) => {
    switch (item.voucherCategory) {
      case 'ContraVoucher':
        return item.contraType || '';
      case 'CashVoucher':
        return item.expenseType || '';
      case 'WorkshopReceipt':
        return item.reciptType || '';
      default:
        return '';
    }
  };

  // Custom search function that searches through the specified fields
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      // If search is empty, show all data
      setFilteredData(data);
      return;
    }

    const searchValue = value.toLowerCase().trim();
    
    // Filter the data based on search criteria
    const filtered = data.filter(item => {
      // Search in Voucher ID (receiptNo)
      const voucherId = (item.receiptNo || '').toLowerCase();
      
      // Search in Recipient Name (accountHead)
      const recipientName = (item.accountHead || '').toLowerCase();
      
      // You can add more fields to search here if needed
      
      return voucherId.includes(searchValue) || 
             recipientName.includes(searchValue);
    });
    
    setFilteredData(filtered);
  };

  if (!canViewCashReceipt) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Cash Receipts.
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
    
      <CCard className='table-container mt-4'>
        
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
                placeholder="Search by Voucher ID or Recipient Name..."
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Voucher ID</CTableHeaderCell>
                  <CTableHeaderCell>Recipient Name</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Voucher Type</CTableHeaderCell>
                  <CTableHeaderCell>Voucher Category</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Debit</CTableHeaderCell>
                  <CTableHeaderCell>Credit</CTableHeaderCell>
                  <CTableHeaderCell>Payment Mode</CTableHeaderCell>
                  <CTableHeaderCell>Bank Location</CTableHeaderCell>
                  <CTableHeaderCell>Cash Location</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="13" className="text-center">
                      {searchTerm ? 'No matching records found' : 'No cash receipt available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.receiptNo}</CTableDataCell>
                      <CTableDataCell>{item.accountHead}</CTableDataCell>
                      <CTableDataCell>
                        {formatDate(item.date)}
                      </CTableDataCell>
                      <CTableDataCell>{item.type}</CTableDataCell>
                      <CTableDataCell>{item.voucherCategory}</CTableDataCell>
                      <CTableDataCell>{getVoucherSpecificType(item)}</CTableDataCell>
                      <CTableDataCell>{item.debit || ''}</CTableDataCell>
                      <CTableDataCell>{item.credit || ''}</CTableDataCell>
                      <CTableDataCell>{item.paymentMode || ''}</CTableDataCell>
                      <CTableDataCell>{item.bankLocation || ''}</CTableDataCell>
                      <CTableDataCell>{item.cashLocation || ''}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => handleViewPdf(item.id)}
                        >
                          View PDF
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

export default CashReceipt;