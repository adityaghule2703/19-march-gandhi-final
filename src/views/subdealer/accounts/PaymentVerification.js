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










import React, { useState, useEffect } from 'react';
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
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, showSuccess} from 'src/utils/tableImports';
import { confirmVerify } from 'src/utils/sweetAlerts';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle} from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';
import { 
  hasSafePagePermission,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../../utils/modulePermissions';

function PaymentVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
  const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);
  const { permissions, user: authUser } = useAuth();
  
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
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPaymentVerificationTab || canViewVerifiedListTab;

  // Tab-level CREATE permission for PAYMENT VERIFICATION tab
  const canCreatePaymentVerificationTab = hasSafePagePermission(
    permissions, 
    MODULES.SUBDEALER_ACCOUNT, 
    PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION, 
    ACTIONS.CREATE,
    TABS.PAYMENT_VERIFICATION.PAYMENT_VERIFICATION
  );

  // Adjust activeTab based on tab-level permissions
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewPaymentVerificationTab) visibleTabs.push(0);
    if (canViewVerifiedListTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPaymentVerificationTab, canViewVerifiedListTab, activeTab]);

  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Payment Verification tabs');
      return;
    }
    
    fetchPendingPayments();
    fetchVerifiedPayments();
  }, [canViewAnyTab]);

  const fetchPendingPayments = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/payments/pending`);
      let pendingPayments = response.data.data.pendingPayments || [];
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        pendingPayments = pendingPayments.filter(payment => 
          payment.subdealer?._id === userSubdealerId
        );
      }
      
      setPendingPaymentsData(pendingPayments);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPendingPaymentsData([]);
    }
  };

  const fetchVerifiedPayments = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
      let verifiedPayments = response.data.data.approvedPayments || [];
      
      // Filter by subdealer ID if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        verifiedPayments = verifiedPayments.filter(payment => 
          payment.subdealer?._id === userSubdealerId
        );
      }
      
      setVerifiedPaymentsData(verifiedPayments);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
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

  const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchValue);
  const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchValue);

  const handleVerifyPayment = async (entry) => {
    // Check CREATE permission for PAYMENT VERIFICATION tab
    if (!canCreatePaymentVerificationTab) {
      showError('You do not have permission to verify payments');
      return;
    }
    
    // Subdealers should not be able to verify payments (even their own)
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
        fetchPendingPayments();
        fetchVerifiedPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showError(error, 'Failed to verify payment');
    }
  };

  const handleTabChange = (tab) => {
    if (!canViewAnyTab) {
      return;
    }
    
    setActiveTab(tab);
    setSearchValue('');
  };

  const handleResetSearch = () => {
    setSearchValue('');
  };

  const renderPaymentVerificationTab = () => {
    // Check if user has permission to view this tab
    if (!canViewPaymentVerificationTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Payment Verification tab.
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
            {filteredPendingLedgerEntries.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canCreatePaymentVerificationTab && !isSubdealer ? "9" : "8"} style={{ color: 'red', textAlign: 'center' }}>
                  {searchValue ? 'No matching pending payments found' : 'No pending payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendingLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.subdealer?.location || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
                  <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
                      {entry.approvalStatus === 'Pending' ? 'PENDING' : 'COMPLETE'}
                    </CBadge>
                  </CTableDataCell>
                  {canCreatePaymentVerificationTab && !isSubdealer && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleVerifyPayment(entry)}
                        disabled={entry.approvalStatus !== 'Pending'}
                      >
                        <CIcon icon={cilCheckCircle} className='icon'/> Verify
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderVerifiedListTab = () => {
    // Check if user has permission to view this tab
    if (!canViewVerifiedListTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the Verified List tab.
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
              <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
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
                  {searchValue ? 'No matching verified payments found' : 'No verified payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredVerifiedLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
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
    
      {!canCreatePaymentVerificationTab && canViewPaymentVerificationTab && (
        <CAlert color="warning" className="mb-3">
          You can view the Payment Verification tab but cannot verify payments.
        </CAlert>
      )}
      
      
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          {/* Show tabs only if user has permission to view at least one */}
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
                      {pendingPaymentsData.length}
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
                      {verifiedPaymentsData.length}
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
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={!canViewAnyTab}
              />
              {searchValue && (
                <CButton 
                  size="sm" 
                  color="secondary" 
                  className="action-btn ms-2"
                  onClick={handleResetSearch}
                  disabled={!canViewAnyTab}
                >
                  Reset
                </CButton>
              )}
            </div>
          </div>
          
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
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default PaymentVerification;