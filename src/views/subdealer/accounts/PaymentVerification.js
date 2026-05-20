// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CBadge, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess} from 'src/utils/tableImports';
// import { confirmVerify } from 'src/utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle} from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES, 
//   PAGES
// } from '../../../utils/modulePermissions';

// function PaymentVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
//   const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
//   const [searchValue, setSearchValue] = useState('');
//   const [error, setError] = useState(null);
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Payment Verification page under Subdealer Account module
//   const canViewPaymentVerification = canViewPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION);
  
//   // Verify action = CREATE permission (creating verification record)
//   const canCreatePaymentVerification = canCreateInPage(permissions, MODULES.SUBDEALER_ACCOUNT, PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION);

//   useEffect(() => {
//     if (!canViewPaymentVerification) {
//       showError('You do not have permission to view Payment Verification');
//       return;
//     }
    
//     fetchPendingPayments();
//     fetchVerifiedPayments();
//   }, [canViewPaymentVerification]);

//   const fetchPendingPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/payments/pending`);
//       setPendingPaymentsData(response.data.data.pendingPayments || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setPendingPaymentsData([]);
//     }
//   };

//   const fetchVerifiedPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
//       setVerifiedPaymentsData(response.data.data.approvedPayments || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
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

//   const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchValue);
//   const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchValue);

//   const handleVerifyPayment = async (entry) => {
//     // Check CREATE permission for verification action
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
//         await axiosInstance.patch(`/subdealersonaccount/payments/${entry._id}/approve`, {
//           remark: ''
//         });
//         await showSuccess('Payment verified successfully!');
//         fetchPendingPayments();
//         fetchVerifiedPayments();
//       }
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       showError(error, 'Failed to verify payment');
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchValue('');
//   };

//   const handleResetSearch = () => {
//     setSearchValue('');
//   };

//   if (!canViewPaymentVerification) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Payment Verification.
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
    
//       {canViewPaymentVerification && !canCreatePaymentVerification && (
//         <CAlert color="warning" className="mb-3">
//           You have VIEW permission but cannot verify payments.
//         </CAlert>
//       )}
    
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
//                 Payment Verification
//                 <CBadge color="danger" className="ms-2">
//                   {pendingPaymentsData.length}
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
//                 Verified List
//                 <CBadge color="success" className="ms-2">
//                   {verifiedPaymentsData.length}
//                 </CBadge>
//               </CNavLink>
//             </CNavItem>
//           </CNav>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 disabled={!canViewPaymentVerification}
//               />
//               {searchValue && (
//                 <CButton 
//                   size="sm" 
//                   color="secondary" 
//                   className="action-btn ms-2"
//                   onClick={handleResetSearch}
//                 >
//                   Reset
//                 </CButton>
//               )}
//             </div>
//           </div>
          
//           <CTabContent>
//             <CTabPane visible={activeTab === 0} className="p-0">
//               <div className="responsive-table-wrapper">
//                 <CTable striped bordered hover className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Location</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                       {canCreatePaymentVerification && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredPendingLedgerEntries.length === 0 ? (
//                       <CTableRow>
//                         <CTableDataCell colSpan={canCreatePaymentVerification ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                           {searchValue ? 'No matching pending payments found' : 'No pending payments available'}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ) : (
//                       filteredPendingLedgerEntries.map((entry, index) => (
//                         <CTableRow key={index}>
//                           <CTableDataCell>{index + 1}</CTableDataCell>
//                           <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{entry.subdealer?.location || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
//                           <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
//                               {entry.approvalStatus === 'Pending' ? 'PENDING' : 'COMPLETE'}
//                             </CBadge>
//                           </CTableDataCell>
//                           {canCreatePaymentVerification && (
//                             <CTableDataCell>
//                               <CButton 
//                                 size="sm" 
//                                 className="action-btn"
//                                 onClick={() => handleVerifyPayment(entry)}
//                                 disabled={entry.approvalStatus !== 'Pending'}
//                               >
//                                 <CIcon icon={cilCheckCircle} className='icon'/> Verify
//                               </CButton>
//                             </CTableDataCell>
//                           )}
//                         </CTableRow>
//                       ))
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </CTabPane>
            
//             <CTabPane visible={activeTab === 1} className="p-0">
//               <div className="responsive-table-wrapper">
//                 <CTable striped bordered hover className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//                       <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredVerifiedLedgerEntries.length === 0 ? (
//                       <CTableRow>
//                         <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
//                           {searchValue ? 'No matching verified payments found' : 'No verified payments available'}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ) : (
//                       filteredVerifiedLedgerEntries.map((entry, index) => (
//                         <CTableRow key={index}>
//                           <CTableDataCell>{index + 1}</CTableDataCell>
//                           <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
//                           <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{entry.approvedBy?.name || 'N/A'}</CTableDataCell>
//                         </CTableRow>
//                       ))
//                     )}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default PaymentVerification;




// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CBadge, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess} from 'src/utils/tableImports';
// import { confirmVerify } from 'src/utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle} from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../../utils/modulePermissions';

// function PaymentVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
//   const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
//   const [searchValue, setSearchValue] = useState('');
//   const [error, setError] = useState(null);
//   const { permissions } = useAuth();
  
//   // Tab-level VIEW permission checks
//   const canViewPaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
//   );
  
//   const canViewVerifiedListTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.PAYMENT_VERIFICATION.VERIFIED_LIST
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPaymentVerificationTab || canViewVerifiedListTab;

//   // Tab-level CREATE permission for PAYMENT VERIFICATION tab
//   const canCreatePaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
//     ACTIONS.CREATE,
//     TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
//   );

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPaymentVerificationTab) visibleTabs.push(0);
//     if (canViewVerifiedListTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPaymentVerificationTab, canViewVerifiedListTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Payment Verification tabs');
//       return;
//     }
    
//     fetchPendingPayments();
//     fetchVerifiedPayments();
//   }, [canViewAnyTab]);

//   const fetchPendingPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/payments/pending`);
//       setPendingPaymentsData(response.data.data.pendingPayments || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setPendingPaymentsData([]);
//     }
//   };

//   const fetchVerifiedPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
//       setVerifiedPaymentsData(response.data.data.approvedPayments || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
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

//   const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchValue);
//   const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchValue);

//   const handleVerifyPayment = async (entry) => {
//     // Check CREATE permission for PAYMENT VERIFICATION tab
//     if (!canCreatePaymentVerificationTab) {
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
//         await axiosInstance.patch(`/subdealersonaccount/payments/${entry._id}/approve`, {
//           remark: ''
//         });
//         await showSuccess('Payment verified successfully!');
//         fetchPendingPayments();
//         fetchVerifiedPayments();
//       }
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       showError(error, 'Failed to verify payment');
//     }
//   };

//   const handleTabChange = (tab) => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setSearchValue('');
//   };

//   const handleResetSearch = () => {
//     setSearchValue('');
//   };

//   const renderPaymentVerificationTab = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPaymentVerificationTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Payment Verification tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Location</CTableHeaderCell>
//               <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {canCreatePaymentVerificationTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendingLedgerEntries.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreatePaymentVerificationTab ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                   {searchValue ? 'No matching pending payments found' : 'No pending payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendingLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.location || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
//                   <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
//                       {entry.approvalStatus === 'Pending' ? 'PENDING' : 'COMPLETE'}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canCreatePaymentVerificationTab && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifyPayment(entry)}
//                         disabled={entry.approvalStatus !== 'Pending'}
//                       >
//                         <CIcon icon={cilCheckCircle} className='icon'/> Verify
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedListTab = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedListTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Verified List tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
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
//                   {searchValue ? 'No matching verified payments found' : 'No verified payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredVerifiedLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
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

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any Payment Verification tabs.
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
    
//       {!canCreatePaymentVerificationTab && canViewPaymentVerificationTab && (
//         <CAlert color="warning" className="mb-3">
//           You can view the Payment Verification tab but cannot verify payments.
//         </CAlert>
//       )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <CNav variant="tabs" className="mb-0 border-bottom">
//               {canViewPaymentVerificationTab && (
//                 <CNavItem>
//                   <CNavLink
//                     active={activeTab === 0}
//                     onClick={() => handleTabChange(0)}
//                     style={{ 
//                       cursor: 'pointer',
//                       borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                       color: 'black',
//                       borderBottom: 'none'
//                     }}
//                   >
//                     Payment Verification
//                     <CBadge color="danger" className="ms-2">
//                       {pendingPaymentsData.length}
//                     </CBadge>
//                     {!canCreatePaymentVerificationTab && (
//                       <span className="ms-1 text-muted small">(View Only)</span>
//                     )}
//                   </CNavLink>
//                 </CNavItem>
//               )}
//               {canViewVerifiedListTab && (
//                 <CNavItem>
//                   <CNavLink
//                     active={activeTab === 1}
//                     onClick={() => handleTabChange(1)}
//                     style={{ 
//                       cursor: 'pointer',
//                       borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                       borderBottom: 'none',
//                       color: 'black'
//                     }}
//                   >
//                     Verified List
//                     <CBadge color="success" className="ms-2">
//                       {verifiedPaymentsData.length}
//                     </CBadge>
//                   </CNavLink>
//                 </CNavItem>
//               )}
//             </CNav>
//           ) : (
//             <div className="alert alert-warning py-2 mb-0" role="alert">
//               You don't have permission to view any tabs in Payment Verification.
//             </div>
//           )}
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 disabled={!canViewAnyTab}
//               />
//               {searchValue && (
//                 <CButton 
//                   size="sm" 
//                   color="secondary" 
//                   className="action-btn ms-2"
//                   onClick={handleResetSearch}
//                   disabled={!canViewAnyTab}
//                 >
//                   Reset
//                 </CButton>
//               )}
//             </div>
//           </div>
          
//           <CTabContent>
//             {canViewPaymentVerificationTab && (
//               <CTabPane visible={activeTab === 0} className="p-0">
//                 {renderPaymentVerificationTab()}
//               </CTabPane>
//             )}
            
//             {canViewVerifiedListTab && (
//               <CTabPane visible={activeTab === 1} className="p-0">
//                 {renderVerifiedListTab()}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default PaymentVerification;










// import React, { useState, useEffect } from 'react';
// import '../../../css/invoice.css';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import { 
//   CBadge, 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
// import { axiosInstance, getDefaultSearchFields, showError, showSuccess} from 'src/utils/tableImports';
// import { confirmVerify } from 'src/utils/sweetAlerts';
// import CIcon from '@coreui/icons-react';
// import { cilCheckCircle} from '@coreui/icons';
// import { useAuth } from '../../../context/AuthContext';
// import { 
//   hasSafePagePermission,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from '../../../utils/modulePermissions';

// function PaymentVerification() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
//   const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
//   const [searchValue, setSearchValue] = useState('');
//   const [error, setError] = useState(null);
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
//   // Get subdealer ID from user data if user is a subdealer
//   const userSubdealerId = authUser?.subdealer?._id;
  
//   // Tab-level VIEW permission checks
//   const canViewPaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
//   );
  
//   const canViewVerifiedListTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
//     ACTIONS.VIEW,
//     TABS.PAYMENT_VERIFICATION.VERIFIED_LIST
//   );
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPaymentVerificationTab || canViewVerifiedListTab;

//   // Tab-level CREATE permission for PAYMENT VERIFICATION tab
//   const canCreatePaymentVerificationTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SUBDEALER_ACCOUNT, 
//     PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
//     ACTIONS.CREATE,
//     TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
//   );

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPaymentVerificationTab) visibleTabs.push(0);
//     if (canViewVerifiedListTab) visibleTabs.push(1);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPaymentVerificationTab, canViewVerifiedListTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Payment Verification tabs');
//       return;
//     }
    
//     fetchPendingPayments();
//     fetchVerifiedPayments();
//   }, [canViewAnyTab]);

//   const fetchPendingPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/payments/pending`);
//       let pendingPayments = response.data.data.pendingPayments || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         pendingPayments = pendingPayments.filter(payment => 
//           payment.subdealer?._id === userSubdealerId
//         );
//       }
      
//       setPendingPaymentsData(pendingPayments);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setPendingPaymentsData([]);
//     }
//   };

//   const fetchVerifiedPayments = async () => {
//     try {
//       const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
//       let verifiedPayments = response.data.data.approvedPayments || [];
      
//       // Filter by subdealer ID if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         verifiedPayments = verifiedPayments.filter(payment => 
//           payment.subdealer?._id === userSubdealerId
//         );
//       }
      
//       setVerifiedPaymentsData(verifiedPayments);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
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

//   const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchValue);
//   const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchValue);

//   const handleVerifyPayment = async (entry) => {
//     // Check CREATE permission for PAYMENT VERIFICATION tab
//     if (!canCreatePaymentVerificationTab) {
//       showError('You do not have permission to verify payments');
//       return;
//     }
    
//     // Subdealers should not be able to verify payments (even their own)
//     if (isSubdealer) {
//       showError('Subdealers cannot verify payments');
//       return;
//     }
    
//     try {
//       const result = await confirmVerify({
//         title: 'Confirm Payment Verification',
//         text: `Are you sure you want to verify the payment of ₹${entry.amount || 0}?`,
//         confirmButtonText: 'Yes, verify it!'
//       });
//       if (result.isConfirmed) {
//         await axiosInstance.patch(`/subdealersonaccount/payments/${entry._id}/approve`, {
//           remark: ''
//         });
//         await showSuccess('Payment verified successfully!');
//         fetchPendingPayments();
//         fetchVerifiedPayments();
//       }
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       showError(error, 'Failed to verify payment');
//     }
//   };

//   const handleTabChange = (tab) => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     setActiveTab(tab);
//     setSearchValue('');
//   };

//   const handleResetSearch = () => {
//     setSearchValue('');
//   };

//   const renderPaymentVerificationTab = () => {
//     // Check if user has permission to view this tab
//     if (!canViewPaymentVerificationTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Payment Verification tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Location</CTableHeaderCell>
//               <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Date</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {canCreatePaymentVerificationTab && !isSubdealer && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {filteredPendingLedgerEntries.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={canCreatePaymentVerificationTab && !isSubdealer ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
//                   {searchValue ? 'No matching pending payments found' : 'No pending payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredPendingLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.location || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
//                   <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
//                       {entry.approvalStatus === 'Pending' ? 'PENDING' : 'COMPLETE'}
//                     </CBadge>
//                   </CTableDataCell>
//                   {canCreatePaymentVerificationTab && !isSubdealer && (
//                     <CTableDataCell>
//                       <CButton 
//                         size="sm" 
//                         className="action-btn"
//                         onClick={() => handleVerifyPayment(entry)}
//                         disabled={entry.approvalStatus !== 'Pending'}
//                       >
//                         <CIcon icon={cilCheckCircle} className='icon'/> Verify
//                       </CButton>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   const renderVerifiedListTab = () => {
//     // Check if user has permission to view this tab
//     if (!canViewVerifiedListTab) {
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the Verified List tab.
//           </CAlert>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
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
//                   {searchValue ? 'No matching verified payments found' : 'No verified payments available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               filteredVerifiedLedgerEntries.map((entry, index) => (
//                 <CTableRow key={index}>
//                   <CTableDataCell>{index + 1}</CTableDataCell>
//                   <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
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

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any Payment Verification tabs.
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
    
//       {!canCreatePaymentVerificationTab && canViewPaymentVerificationTab && (
//         <CAlert color="warning" className="mb-3">
//           You can view the Payment Verification tab but cannot verify payments.
//         </CAlert>
//       )}
      
      
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <CNav variant="tabs" className="mb-0 border-bottom">
//               {canViewPaymentVerificationTab && (
//                 <CNavItem>
//                   <CNavLink
//                     active={activeTab === 0}
//                     onClick={() => handleTabChange(0)}
//                     style={{ 
//                       cursor: 'pointer',
//                       borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                       color: 'black',
//                       borderBottom: 'none'
//                     }}
//                   >
//                     Payment Verification
//                     <CBadge color="danger" className="ms-2">
//                       {pendingPaymentsData.length}
//                     </CBadge>
//                     {!canCreatePaymentVerificationTab && (
//                       <span className="ms-1 text-muted small">(View Only)</span>
//                     )}
                   
//                   </CNavLink>
//                 </CNavItem>
//               )}
//               {canViewVerifiedListTab && (
//                 <CNavItem>
//                   <CNavLink
//                     active={activeTab === 1}
//                     onClick={() => handleTabChange(1)}
//                     style={{ 
//                       cursor: 'pointer',
//                       borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                       borderBottom: 'none',
//                       color: 'black'
//                     }}
//                   >
//                     Verified List
//                     <CBadge color="success" className="ms-2">
//                       {verifiedPaymentsData.length}
//                     </CBadge>
                   
//                   </CNavLink>
//                 </CNavItem>
//               )}
//             </CNav>
//           ) : (
//             <div className="alert alert-warning py-2 mb-0" role="alert">
//               You don't have permission to view any tabs in Payment Verification.
//             </div>
//           )}
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 disabled={!canViewAnyTab}
//               />
//               {searchValue && (
//                 <CButton 
//                   size="sm" 
//                   color="secondary" 
//                   className="action-btn ms-2"
//                   onClick={handleResetSearch}
//                   disabled={!canViewAnyTab}
//                 >
//                   Reset
//                 </CButton>
//               )}
//             </div>
//           </div>
          
//           <CTabContent>
//             {canViewPaymentVerificationTab && (
//               <CTabPane visible={activeTab === 0} className="p-0">
//                 {renderPaymentVerificationTab()}
//               </CTabPane>
//             )}
            
//             {canViewVerifiedListTab && (
//               <CTabPane visible={activeTab === 1} className="p-0">
//                 {renderVerifiedListTab()}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// }

// export default PaymentVerification;






import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../../css/invoice.css';
import '../../../css/table.css';
import '../../../css/form.css';
import { 
  CBadge, 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CSpinner
} from '@coreui/react';
import { axiosInstance, showError, showSuccess} from 'src/utils/tableImports';
import { confirmVerify } from 'src/utils/sweetAlerts';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilXCircle, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../../utils/modulePermissions';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT = 50;

const emptyTab = () => ({
  docs: [],
  total: 0,
  pages: 0,
  currentPage: 1,
  limit: DEFAULT_LIMIT,
  loading: false,
  search: '',
  _allDocs: undefined
});

function PaymentVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const { permissions, user: authUser } = useAuth();
  
  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Separate local search state for each tab
  const [localSearchPending, setLocalSearchPending] = useState('');
  const [localSearchVerified, setLocalSearchVerified] = useState('');
  const [localSearchRejected, setLocalSearchRejected] = useState('');
  
  // Per-tab paginated state
  const [tabData, setTabData] = useState(() => ({
    0: emptyTab(), // Pending
    1: emptyTab(), // Verified
    2: emptyTab()  // Rejected
  }));
  
  // Debounce timer refs
  const searchTimerPending = useRef(null);
  const searchTimerVerified = useRef(null);
  const searchTimerRejected = useRef(null);
  
  // Stable refs for search inputs
  const searchInputPendingRef = useRef(null);
  const searchInputVerifiedRef = useRef(null);
  const searchInputRejectedRef = useRef(null);
  
  // Check if user has SUBDEALER role
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  
  // Get subdealer ID from user data if user is a subdealer
  const userSubdealerId = authUser?.subdealer?._id;
  
  // Tab-level VIEW permission checks
  const canViewPaymentVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
  );
  
  const canViewVerifiedListTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.PAYMENT_VERIFICATION.VERIFIED_LIST
  );

  const canViewRejectedListTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
    ACTIONS.VIEW,
    TABS.PAYMENT_VERIFICATION.REJECTED_LIST
  );
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPaymentVerificationTab || canViewVerifiedListTab || canViewRejectedListTab;

  // Tab-level CREATE permission for PAYMENT VERIFICATION tab
  const canCreatePaymentVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
    ACTIONS.CREATE,
    TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
  );

  // Helper to update a single tab's state
  const setTab = useCallback((tabIndex, updates) =>
    setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
  []);

  // Fetch pending payments with pagination and search
  const fetchPendingPayments = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewPaymentVerificationTab) return;
    
    setTab(0, { loading: true });
    
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const response = await axiosInstance.get(`/subdealersonaccount/payments/pending`, { params });
      let pendingPayments = response.data.data?.pendingPayments || [];
      const pagination = response.data.pagination || {};
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        pendingPayments = pendingPayments.filter(payment => 
          payment.subdealer?._id === userSubdealerId
        );
      }
      
      setTab(0, {
        docs: pendingPayments,
        total: pagination.totalRecords || pagination.total || pendingPayments.length,
        pages: Math.ceil((pagination.totalRecords || pagination.total || pendingPayments.length) / limit),
        currentPage: page,
        limit,
        loading: false,
        search: search || '',
        _allDocs: undefined
      });
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      showError(error, 'Failed to fetch pending payments');
      setTab(0, { docs: [], total: 0, pages: 0, loading: false });
    }
  }, [canViewPaymentVerificationTab, isSubdealer, userSubdealerId, setTab]);

  // Fetch verified payments with pagination and search
  const fetchVerifiedPayments = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewVerifiedListTab) return;
    
    setTab(1, { loading: true });
    
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`, { params });
      let verifiedPayments = response.data.data?.approvedPayments || [];
      const pagination = response.data.data?.pagination || {};
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        verifiedPayments = verifiedPayments.filter(payment => 
          payment.subdealer?._id === userSubdealerId
        );
      }
      
      setTab(1, {
        docs: verifiedPayments,
        total: pagination.total || verifiedPayments.length,
        pages: pagination.pages || Math.ceil(verifiedPayments.length / limit),
        currentPage: page,
        limit,
        loading: false,
        search: search || '',
        _allDocs: undefined
      });
    } catch (error) {
      console.error('Error fetching verified payments:', error);
      showError(error, 'Failed to fetch verified payments');
      setTab(1, { docs: [], total: 0, pages: 0, loading: false });
    }
  }, [canViewVerifiedListTab, isSubdealer, userSubdealerId, setTab]);

  // Fetch rejected payments with pagination and search
  const fetchRejectedPayments = useCallback(async (page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (!canViewRejectedListTab) return;
    
    setTab(2, { loading: true });
    
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/reject`, { params });
      let rejectedPayments = response.data.data?.rejectedPayments || [];
      const pagination = response.data.data?.pagination || {};
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        rejectedPayments = rejectedPayments.filter(payment => 
          payment.subdealer?._id === userSubdealerId
        );
      }
      
      setTab(2, {
        docs: rejectedPayments,
        total: pagination.total || rejectedPayments.length,
        pages: pagination.pages || Math.ceil(rejectedPayments.length / limit),
        currentPage: page,
        limit,
        loading: false,
        search: search || '',
        _allDocs: undefined
      });
    } catch (error) {
      console.error('Error fetching rejected payments:', error);
      showError(error, 'Failed to fetch rejected payments');
      setTab(2, { docs: [], total: 0, pages: 0, loading: false });
    }
  }, [canViewRejectedListTab, isSubdealer, userSubdealerId, setTab]);

  // Initial data fetch
  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Payment Verification tabs');
      return;
    }
    
    if (canViewPaymentVerificationTab) {
      fetchPendingPayments(1, DEFAULT_LIMIT, '');
    }
    if (canViewVerifiedListTab) {
      fetchVerifiedPayments(1, DEFAULT_LIMIT, '');
    }
    if (canViewRejectedListTab) {
      fetchRejectedPayments(1, DEFAULT_LIMIT, '');
    }
  }, [canViewAnyTab]);

// Tab change handler - FIXED to refresh data when switching tabs
const handleTabChange = useCallback((tab) => {
  clearTimeout(searchTimerPending.current);
  clearTimeout(searchTimerVerified.current);
  clearTimeout(searchTimerRejected.current);
  
  // First, set active tab
  setActiveTab(tab);
  
  // Clear local search states and input values when switching tabs
  if (tab === 0) {
    setLocalSearchPending('');
    if (searchInputPendingRef.current) searchInputPendingRef.current.value = '';
    // Refresh pending tab data without search
    fetchPendingPayments(1, tabData[0].limit, '');
  } else if (tab === 1) {
    setLocalSearchVerified('');
    if (searchInputVerifiedRef.current) searchInputVerifiedRef.current.value = '';
    // Refresh verified tab data without search
    fetchVerifiedPayments(1, tabData[1].limit, '');
  } else if (tab === 2) {
    setLocalSearchRejected('');
    if (searchInputRejectedRef.current) searchInputRejectedRef.current.value = '';
    // Refresh rejected tab data without search
    fetchRejectedPayments(1, tabData[2].limit, '');
  }
}, [fetchPendingPayments, fetchVerifiedPayments, fetchRejectedPayments, tabData]);

  // Search handlers with debounce
  const handlePendingSearch = useCallback((value) => {
    setLocalSearchPending(value);
    clearTimeout(searchTimerPending.current);
    searchTimerPending.current = setTimeout(() => {
      fetchPendingPayments(1, tabData[0].limit, value);
    }, 500);
  }, [fetchPendingPayments, tabData]);

  const handleVerifiedSearch = useCallback((value) => {
    setLocalSearchVerified(value);
    clearTimeout(searchTimerVerified.current);
    searchTimerVerified.current = setTimeout(() => {
      fetchVerifiedPayments(1, tabData[1].limit, value);
    }, 500);
  }, [fetchVerifiedPayments, tabData]);

  const handleRejectedSearch = useCallback((value) => {
    setLocalSearchRejected(value);
    clearTimeout(searchTimerRejected.current);
    searchTimerRejected.current = setTimeout(() => {
      fetchRejectedPayments(1, tabData[2].limit, value);
    }, 500);
  }, [fetchRejectedPayments, tabData]);

  // Page change handlers
  const handlePendingPageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > tabData[0].pages) return;
    fetchPendingPayments(newPage, tabData[0].limit, tabData[0].search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchPendingPayments, tabData]);

  const handleVerifiedPageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > tabData[1].pages) return;
    fetchVerifiedPayments(newPage, tabData[1].limit, tabData[1].search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchVerifiedPayments, tabData]);

  const handleRejectedPageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > tabData[2].pages) return;
    fetchRejectedPayments(newPage, tabData[2].limit, tabData[2].search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchRejectedPayments, tabData]);

  // Limit change handlers
  const handlePendingLimitChange = useCallback((newLimit) => {
    fetchPendingPayments(1, parseInt(newLimit, 10), tabData[0].search);
  }, [fetchPendingPayments, tabData]);

  const handleVerifiedLimitChange = useCallback((newLimit) => {
    fetchVerifiedPayments(1, parseInt(newLimit, 10), tabData[1].search);
  }, [fetchVerifiedPayments, tabData]);

  const handleRejectedLimitChange = useCallback((newLimit) => {
    fetchRejectedPayments(1, parseInt(newLimit, 10), tabData[2].search);
  }, [fetchRejectedPayments, tabData]);

  const handleVerifyPayment = async (entry) => {
    if (!canCreatePaymentVerificationTab) {
      showError('You do not have permission to verify payments');
      return;
    }
    
    if (isSubdealer) {
      showError('Subdealers cannot verify payments');
      return;
    }
    
    try {
      const result = await confirmVerify({
        title: 'Confirm Payment Verification',
        text: `Are you sure you want to verify the payment of ₹${entry.amount || 0}?`,
        confirmButtonText: 'Yes, verify it!'
      });
      if (result.isConfirmed) {
        await axiosInstance.patch(`/subdealersonaccount/payments/${entry._id}/approve`, {
          remark: ''
        });
        await showSuccess('Payment verified successfully!');
        // Refresh current tabs
        fetchPendingPayments(tabData[0].currentPage, tabData[0].limit, tabData[0].search);
        fetchVerifiedPayments(tabData[1].currentPage, tabData[1].limit, tabData[1].search);
        if (canViewRejectedListTab) {
          fetchRejectedPayments(tabData[2].currentPage, tabData[2].limit, tabData[2].search);
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showError(error, 'Failed to verify payment');
    }
  };

  const handleRejectPayment = (entry) => {
    if (!canCreatePaymentVerificationTab) {
      showError('You do not have permission to reject payments');
      return;
    }
    
    if (isSubdealer) {
      showError('Subdealers cannot reject payments');
      return;
    }
    
    setSelectedPayment(entry);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      showError('Please provide a rejection reason');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/subdealersonaccount/payments/${selectedPayment._id}/reject`, {
        rejectionReason: rejectionReason
      });
      await showSuccess('Payment rejected successfully!');
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectionReason('');
      // Refresh current tabs
      fetchPendingPayments(tabData[0].currentPage, tabData[0].limit, tabData[0].search);
      fetchVerifiedPayments(tabData[1].currentPage, tabData[1].limit, tabData[1].search);
      if (canViewRejectedListTab) {
        fetchRejectedPayments(tabData[2].currentPage, tabData[2].limit, tabData[2].search);
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      showError(error, 'Failed to reject payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination renderer
  const renderPagination = (tabIndex) => {
    const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
    if (!total || total === 0) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    let sp = Math.max(1, currentPage - 2);
    let ep = Math.min(pages, currentPage + 2);
    if (currentPage <= 3) ep = Math.min(5, pages);
    if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
    const pageNums = [];
    for (let i = sp; i <= ep; i++) pageNums.push(i);

    const getPageChangeHandler = () => {
      if (tabIndex === 0) return handlePendingPageChange;
      if (tabIndex === 1) return handleVerifiedPageChange;
      return handleRejectedPageChange;
    };

    const getLimitChangeHandler = () => {
      if (tabIndex === 0) return handlePendingLimitChange;
      if (tabIndex === 1) return handleVerifiedLimitChange;
      return handleRejectedLimitChange;
    };

    const pageChangeHandler = getPageChangeHandler();
    const limitChangeHandler = getLimitChangeHandler();

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
            <CFormSelect 
              value={limit} 
              onChange={e => limitChangeHandler(e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }} 
              size="sm" 
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => pageChangeHandler(1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => pageChangeHandler(currentPage - 1)} disabled={currentPage === 1 || loading}>
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>
            {sp > 1 && (
              <>
                <CPaginationItem onClick={() => pageChangeHandler(1)} disabled={loading}>1</CPaginationItem>
                {sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}
              </>
            )}
            {pageNums.map(p => (
              <CPaginationItem key={p} active={p === currentPage} onClick={() => pageChangeHandler(p)} disabled={loading}>
                {p}
              </CPaginationItem>
            ))}
            {ep < pages && (
              <>
                {ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
                <CPaginationItem onClick={() => pageChangeHandler(pages)} disabled={loading}>{pages}</CPaginationItem>
              </>
            )}
            <CPaginationItem onClick={() => pageChangeHandler(currentPage + 1)} disabled={currentPage === pages || loading}>
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
            <CPaginationItem onClick={() => pageChangeHandler(pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const renderPaymentVerificationTab = () => {
    if (!canViewPaymentVerificationTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Payment Verification tab.
          </CAlert>
        </div>
      );
    }

    const { docs, loading, search, total } = tabData[0];
    const startIndex = (tabData[0].currentPage - 1) * tabData[0].limit;

    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                {canCreatePaymentVerificationTab && !isSubdealer && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {docs.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={canCreatePaymentVerificationTab && !isSubdealer ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No pending payments available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                docs.map((entry, index) => (
                  <CTableRow key={entry._id}>
                    <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                    <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.subdealer?.location || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
                    <CTableDataCell>{entry.receivedDate ? new Date(entry.receivedDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
                        {entry.approvalStatus === 'Pending' ? 'PENDING' : 'COMPLETE'}
                      </CBadge>
                    </CTableDataCell>
                    {canCreatePaymentVerificationTab && !isSubdealer && (
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton 
                            size="sm" 
                            className="action-btn"
                            onClick={() => handleVerifyPayment(entry)}
                            disabled={entry.approvalStatus !== 'Pending'}
                          >
                            <CIcon icon={cilCheckCircle} className='icon'/> Verify
                          </CButton>
                          <CButton 
                            size="sm" 
                            color="danger"
                            className="action-btn"
                            onClick={() => handleRejectPayment(entry)}
                            disabled={entry.approvalStatus !== 'Pending'}
                          >
                            <CIcon icon={cilXCircle} className='icon'/> Reject
                          </CButton>
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(0)}
      </>
    );
  };

  const renderVerifiedListTab = () => {
    if (!canViewVerifiedListTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Verified List tab.
          </CAlert>
        </div>
      );
    }

    const { docs, loading, search, total } = tabData[1];
    const startIndex = (tabData[1].currentPage - 1) * tabData[1].limit;

    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {docs.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No verified payments available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                docs.map((entry, index) => (
                  <CTableRow key={entry._id}>
                    <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                    <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
                    <CTableDataCell>{entry.receivedDate ? new Date(entry.receivedDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.approvedBy?.name || 'N/A'}</CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(1)}
      </>
    );
  };

  const renderRejectedListTab = () => {
    if (!canViewRejectedListTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Rejected List tab.
          </CAlert>
        </div>
      );
    }

    const { docs, loading, search, total } = tabData[2];
    const startIndex = (tabData[2].currentPage - 1) * tabData[2].limit;

    return (
      <>
        {loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Received Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Rejected Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Rejected By</CTableHeaderCell>
                <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {docs.length === 0 && !loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                    {search ? `No results found for "${search}"` : 'No rejected payments available'}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                docs.map((entry, index) => (
                  <CTableRow key={entry._id}>
                    <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                    <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
                    <CTableDataCell>{entry.receivedDate ? new Date(entry.receivedDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.rejectedAt ? new Date(entry.rejectedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.rejectedBy?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{entry.rejectionReason || 'N/A'}</CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(2)}
      </>
    );
  };

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any Payment Verification tabs.
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Payment Verification</div>
    
      {!canCreatePaymentVerificationTab && canViewPaymentVerificationTab && (
        <CAlert color="warning" className="mb-3">
          You can view the Payment Verification tab but cannot verify or reject payments.
        </CAlert>
      )}
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          {canViewAnyTab ? (
            <CNav variant="tabs" className="mb-0 border-bottom">
              {canViewPaymentVerificationTab && (
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
                    Payment Verification
                    <CBadge color="danger" className="ms-2">
                      {tabData[0].total}
                    </CBadge>
                    {!canCreatePaymentVerificationTab && (
                      <span className="ms-1 text-muted small">(View Only)</span>
                    )}
                  </CNavLink>
                </CNavItem>
              )}
              {canViewVerifiedListTab && (
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
                    Verified List
                    <CBadge color="success" className="ms-2">
                      {tabData[1].total}
                    </CBadge>
                  </CNavLink>
                </CNavItem>
              )}
              {canViewRejectedListTab && (
                <CNavItem>
                  <CNavLink
                    active={activeTab === 2}
                    onClick={() => handleTabChange(2)}
                    style={{ 
                      cursor: 'pointer',
                      borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                      borderBottom: 'none',
                      color: 'black'
                    }}
                  >
                    Rejected List
                    <CBadge color="warning" className="ms-2">
                      {tabData[2].total}
                    </CBadge>
                  </CNavLink>
                </CNavItem>
              )}
            </CNav>
          ) : (
            <div className="alert alert-warning py-2 mb-0" role="alert">
              You don't have permission to view any tabs in Payment Verification.
            </div>
          )}
        </CCardHeader>
        
        <CCardBody>
          {/* Search bars for each tab */}
          {activeTab === 0 && canViewPaymentVerificationTab && (
            <div className="d-flex justify-content-end mb-3">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <input
                ref={searchInputPendingRef}
                type="text"
                defaultValue=""
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
                className="d-inline-block square-search"
                onChange={e => handlePendingSearch(e.target.value)}
                placeholder="Search by REF Number, Subdealer Name..."
                autoComplete="off"
              />
            </div>
          )}
          
          {activeTab === 1 && canViewVerifiedListTab && (
            <div className="d-flex justify-content-end mb-3">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <input
                ref={searchInputVerifiedRef}
                type="text"
                defaultValue=""
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
                className="d-inline-block square-search"
                onChange={e => handleVerifiedSearch(e.target.value)}
                placeholder="Search by REF Number, Subdealer Name..."
                autoComplete="off"
              />
            </div>
          )}
          
          {activeTab === 2 && canViewRejectedListTab && (
            <div className="d-flex justify-content-end mb-3">
              <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
              <input
                ref={searchInputRejectedRef}
                type="text"
                defaultValue=""
                style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
                className="d-inline-block square-search"
                onChange={e => handleRejectedSearch(e.target.value)}
                placeholder="Search by REF Number, Subdealer Name..."
                autoComplete="off"
              />
            </div>
          )}
          
          <CTabContent>
            {canViewPaymentVerificationTab && (
              <CTabPane visible={activeTab === 0} className="p-0">
                {renderPaymentVerificationTab()}
              </CTabPane>
            )}
            
            {canViewVerifiedListTab && (
              <CTabPane visible={activeTab === 1} className="p-0">
                {renderVerifiedListTab()}
              </CTabPane>
            )}

            {canViewRejectedListTab && (
              <CTabPane visible={activeTab === 2} className="p-0">
                {renderRejectedListTab()}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Rejection Modal */}
      <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <CModalHeader>
          <CModalTitle>Reject Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to reject this payment of <strong>₹{selectedPayment?.amount || 0}</strong>?</p>
          <p><strong>REF Number:</strong> {selectedPayment?.refNumber || 'N/A'}</p>
          <p><strong>Subdealer:</strong> {selectedPayment?.subdealer?.name || 'N/A'}</p>
          <div className="mt-3">
            <CFormLabel>Rejection Reason <span className="text-danger">*</span></CFormLabel>
            <CFormTextarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this payment..."
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleConfirmReject} disabled={isSubmitting}>
            {isSubmitting ? 'Rejecting...' : 'Reject Payment'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default PaymentVerification;