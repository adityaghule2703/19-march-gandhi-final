// import React, { useState, useEffect } from 'react';
// import { 
//   CBadge, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CFormLabel,
//   CAlert
// } from '@coreui/react';
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess } from '../../../utils/tableImports';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import { confirmVerify } from '../../../utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle } from '@coreui/icons';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage 
// } from '../../../utils/modulePermissions';
// import { useAuth } from '../../../context/AuthContext';

// function PaymentVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
//   const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [pagination, setPagination] = useState({
//     current: 1,
//     total: 1,
//     count: 0,
//     totalRecords: 0
//   });

//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Payment Verification page under Account module
//   const hasPaymentVerificationView = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION, 
//     ACTIONS.VIEW
//   );
  
//   // For verifying payments, use CREATE permission since we're creating a verification record
//   const hasPaymentVerificationCreate = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION, 
//     ACTIONS.CREATE
//   );
  
//   // Using convenience functions for cleaner code
//   const canViewPaymentVerification = canViewPage(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION
//   );
  
//   // Use CREATE permission for verifying payments
//   const canCreatePaymentVerification = canCreateInPage(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION
//   );

//   useEffect(() => {
//     if (!canViewPaymentVerification) {
//       showError('You do not have permission to view Payment Verification');
//       return;
//     }
    
//     fetchPendingPayments();
//     fetchVerifiedPayments();
//   }, [canViewPaymentVerification]);

//   const fetchPendingPayments = async (page = 1) => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/broker-ledger/pending-on-account-payments?page=${page}`);
//       setPendingPaymentsData(response.data.data.pendingOnAccountPayments || []);
//       setPagination(
//         response.data.data.pagination || {
//           current: 1,
//           total: 1,
//           count: 0,
//           totalRecords: 0
//         }
//       );
//     } catch (error) {
//       console.log('Error fetching pending payments', error);
//       setPendingPaymentsData([]);
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVerifiedPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
//       setVerifiedPaymentsData(response.data.data.approvedPayments || []);
//     } catch (error) {
//       console.log('Error fetching verified payments', error);
//       setVerifiedPaymentsData([]);
//     }
//   };

//   const filterData = (data, searchTerm) => {
//     if (!searchTerm || !data) return data || [];

//     const searchFields = getDefaultSearchFields('receipts');
//     const term = searchTerm.toLowerCase();

//     return data.filter((row) =>
//       searchFields.some((field) => {
//         const value = field.split('.').reduce((obj, key) => {
//           if (!obj) return '';
//           if (key.match(/^\d+$/)) return obj[parseInt(key)];
//           return obj[key];
//         }, row);

//         if (value === undefined || value === null) return false;

//         if (typeof value === 'boolean') {
//           return (value ? 'yes' : 'no').includes(term);
//         }
//         if (field === 'createdAt' && value instanceof Date) {
//           return value.toLocaleDateString('en-GB').includes(term);
//         }
//         if (typeof value === 'number') {
//           return String(value).includes(term);
//         }
//         return String(value).toLowerCase().includes(term);
//       })
//     );
//   };

//   const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchTerm);
//   const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchTerm);

//   const handleVerifyPayment = async (entry) => {
//     // Use CREATE permission for verification
//     if (!canCreatePaymentVerification) {
//       showError('You do not have permission to verify payments');
//       return;
//     }
    
//     try {
//       const result = await confirmVerify({
//         title: 'Confirm Payment Verification',
//         text: `Are you sure you want to verify the payment of ₹${entry.amount || 0}?`,
//         confirmButtonText: 'Yes, verify it!'
//       });

//       if (result.isConfirmed) {
//         await axiosInstance.patch(`/broker-ledger/approve-on-account/${entry.broker._id}/${entry.branch._id}/${entry._id}`, {
//           remark: ''
//         });
//         setSuccessMessage('Payment verified successfully!');
//         setTimeout(() => setSuccessMessage(''), 3000);
//         fetchPendingPayments();
//         fetchVerifiedPayments();
//       }
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       showError(error, 'Failed to verify payment');
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.total) {
//       fetchPendingPayments(newPage);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const renderPendingTable = () => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Broker Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Email</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Branch</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Reference Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {canCreatePaymentVerification && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendingLedgerEntries.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreatePaymentVerification ? "11" : "10"} style={{ color: 'red', textAlign: 'center' }}>
//                   {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendingLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{(pagination.current - 1) * 10 + index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.broker?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.broker?.mobile || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.broker?.email || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.branch?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.referenceNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {entry.modeOfPayment || 'N/A'}
//                     {entry.subPaymentMode ? ` (${entry.subPaymentMode.payment_mode})` : ''}
//                   </CTableDataCell>
//                   <CTableDataCell>₹{entry.amount ? entry.amount.toLocaleString('en-IN') : '0'}</CTableDataCell>
//                   <CTableDataCell>{entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="danger" shape="rounded-pill">
//                       PENDING
//                     </CBadge>
//                   </CTableDataCell>
//                   {canCreatePaymentVerification && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifyPayment(entry)} 
//                         title="Verify Payment"
//                       >
//                         <CIcon icon={cilCheckCircle} className="me-1" />
//                         Verify
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>

//         {pagination.total > 1 && (
//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing {(pagination.current - 1) * 10 + 1} to {(pagination.current - 1) * 10 + filteredPendingLedgerEntries.length} of{' '}
//               {pagination.totalRecords} entries
//             </div>
//             <div>
//               <CButton
//                 size="sm"
//                 color="outline-primary"
//                 className="me-2"
//                 onClick={() => handlePageChange(pagination.current - 1)}
//                 disabled={pagination.current === 1}
//               >
//                 Previous
//               </CButton>
//               <span className="mx-2">
//                 Page {pagination.current} of {pagination.total}
//               </span>
//               <CButton
//                 size="sm"
//                 color="outline-primary"
//                 className="ms-2"
//                 onClick={() => handlePageChange(pagination.current + 1)}
//                 disabled={pagination.current === pagination.total}
//               >
//                 Next
//               </CButton>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderVerifiedTable = () => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Broker Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredVerifiedLedgerEntries.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                   {searchTerm ? 'No matching verified payments found' : 'No verified payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredVerifiedLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{entry.amount ? entry.amount.toLocaleString('en-IN') : '0'}</CTableDataCell>
//                   <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.approvedBy?.name || 'N/A'}</CTableDataCell>
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   // Check if user has permission to view the page
//   if (!canViewPaymentVerification) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Payment Verification.
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
//       <div className='title'>Payment Verification</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
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
//                 Pending Verification
//                 <CBadge color="danger" shape="rounded-pill" className="ms-2">
//                   {pagination.totalRecords}
//                 </CBadge>
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
//                 Verified Payments
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderPendingTable()}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderVerifiedTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default PaymentVerification;




import React, { useState, useEffect } from 'react';
import { 
  CBadge, 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel,
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, showSuccess } from '../../../utils/tableImports';
import '../../../css/invoice.css';
import '../../../css/table.css';
import { confirmVerify } from '../../../utils/sweetAlerts';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle } from '@coreui/icons';

// Import the permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage 
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';

function PaymentVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
  const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0
  });

  const { permissions } = useAuth();
  
  // Tab-level VIEW permission checks
  const canViewPendingVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.BROKER_PAYMENT_VERIFICATION.PENDING_VERIFICATION
  );
  
  const canViewVerifiedPaymentsTab = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.BROKER_PAYMENT_VERIFICATION.VERIFIED_PAYMENTS
  );
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPendingVerificationTab || canViewVerifiedPaymentsTab;

  // For verifying payments, use CREATE permission for PENDING VERIFICATION tab
  const canCreatePendingVerification = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION, 
    ACTIONS.CREATE,
    TABS.BROKER_PAYMENT_VERIFICATION.PENDING_VERIFICATION
  );

  // Adjust activeTab based on tab-level permissions
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewPendingVerificationTab) visibleTabs.push(0);
    if (canViewVerifiedPaymentsTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingVerificationTab, canViewVerifiedPaymentsTab, activeTab]);

  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Payment Verification tabs');
      setLoading(false);
      return;
    }
    
    fetchPendingPayments();
    fetchVerifiedPayments();
  }, [canViewAnyTab]);

  const fetchPendingPayments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/broker-ledger/pending-on-account-payments?page=${page}`);
      setPendingPaymentsData(response.data.data.pendingOnAccountPayments || []);
      setPagination(
        response.data.data.pagination || {
          current: 1,
          total: 1,
          count: 0,
          totalRecords: 0
        }
      );
    } catch (error) {
      console.log('Error fetching pending payments', error);
      setPendingPaymentsData([]);
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifiedPayments = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
      setVerifiedPaymentsData(response.data.data.approvedPayments || []);
    } catch (error) {
      console.log('Error fetching verified payments', error);
      setVerifiedPaymentsData([]);
    }
  };

  const filterData = (data, searchTerm) => {
    if (!searchTerm || !data) return data || [];

    const searchFields = getDefaultSearchFields('receipts');
    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          if (key.match(/^\d+$/)) return obj[parseInt(key)];
          return obj[key];
        }, row);

        if (value === undefined || value === null) return false;

        if (typeof value === 'boolean') {
          return (value ? 'yes' : 'no').includes(term);
        }
        if (field === 'createdAt' && value instanceof Date) {
          return value.toLocaleDateString('en-GB').includes(term);
        }
        if (typeof value === 'number') {
          return String(value).includes(term);
        }
        return String(value).toLowerCase().includes(term);
      })
    );
  };

  const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchTerm);
  const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchTerm);

  const handleVerifyPayment = async (entry) => {
    // Use CREATE permission for verification on PENDING VERIFICATION tab
    if (!canCreatePendingVerification) {
      showError('You do not have permission to verify payments');
      return;
    }
    
    try {
      const result = await confirmVerify({
        title: 'Confirm Payment Verification',
        text: `Are you sure you want to verify the payment of ₹${entry.amount || 0}?`,
        confirmButtonText: 'Yes, verify it!'
      });

      if (result.isConfirmed) {
        await axiosInstance.patch(`/broker-ledger/approve-on-account/${entry.broker._id}/${entry.branch._id}/${entry._id}`, {
          remark: ''
        });
        setSuccessMessage('Payment verified successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchPendingPayments();
        fetchVerifiedPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showError(error, 'Failed to verify payment');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total) {
      fetchPendingPayments(newPage);
    }
  };

  const handleTabChange = (tab) => {
    if (!canViewAnyTab) {
      return;
    }
    
    setActiveTab(tab);
    setSearchTerm('');
  };

  const renderPendingTable = () => {
    // Check if user has permission to view this tab
    if (!canViewPendingVerificationTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Pending Verification tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Broker Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Branch</CTableHeaderCell>
              <CTableHeaderCell scope="col">Reference Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              {canCreatePendingVerification && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendingLedgerEntries.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canCreatePendingVerification ? "11" : "10"} style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendingLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{(pagination.current - 1) * 10 + index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.broker?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.broker?.mobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.broker?.email || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.branch?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.referenceNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {entry.modeOfPayment || 'N/A'}
                    {entry.subPaymentMode ? ` (${entry.subPaymentMode.payment_mode})` : ''}
                  </CTableDataCell>
                  <CTableDataCell>₹{entry.amount ? entry.amount.toLocaleString('en-IN') : '0'}</CTableDataCell>
                  <CTableDataCell>{entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="danger" shape="rounded-pill">
                      PENDING
                    </CBadge>
                  </CTableDataCell>
                  {canCreatePendingVerification && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleVerifyPayment(entry)} 
                        title="Verify Payment"
                      >
                        <CIcon icon={cilCheckCircle} className="me-1" />
                        Verify
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>

        {pagination.total > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(pagination.current - 1) * 10 + 1} to {(pagination.current - 1) * 10 + filteredPendingLedgerEntries.length} of{' '}
              {pagination.totalRecords} entries
            </div>
            <div>
              <CButton
                size="sm"
                color="outline-primary"
                className="me-2"
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
              >
                Previous
              </CButton>
              <span className="mx-2">
                Page {pagination.current} of {pagination.total}
              </span>
              <CButton
                size="sm"
                color="outline-primary"
                className="ms-2"
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.total}
              >
                Next
              </CButton>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVerifiedTable = () => {
    // Check if user has permission to view this tab
    if (!canViewVerifiedPaymentsTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Verified Payments tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Broker Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredVerifiedLedgerEntries.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching verified payments found' : 'No verified payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredVerifiedLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{entry.amount ? entry.amount.toLocaleString('en-IN') : '0'}</CTableDataCell>
                  <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.approvedBy?.name || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any Payment Verification tabs.
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
      <div className='title'>Payment Verification</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewPendingVerificationTab && (
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
                      Pending Verification
                      <CBadge color="danger" shape="rounded-pill" className="ms-2">
                        {pagination.totalRecords}
                      </CBadge>
                      {!canCreatePendingVerification && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewVerifiedPaymentsTab && (
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
                      Verified Payments
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!canViewAnyTab}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewPendingVerificationTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderPendingTable()}
                  </CTabPane>
                )}
                {canViewVerifiedPaymentsTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderVerifiedTable()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in Payment Verification.
            </CAlert>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default PaymentVerification;