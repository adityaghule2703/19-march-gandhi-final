// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSettings, 
//   cilCheck, 
//   cilX,
//   cilArrowLeft
// } from '@coreui/icons';
// import { 
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
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea,
//   CAlert,
// } from '@coreui/react';
// import { useAuth } from 'src/context/AuthContext';
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from 'src/utils/modulePermissions';

// const SubdealerManagement = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Cancellation states
//   const [cancelledLoading, setCancelledLoading] = useState(false);
  
//   // Cancellation Approval/Reject Modal States
//   const [cancelApprovalModal, setCancelApprovalModal] = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction, setCancelApprovalAction] = useState('');
//   const [editedReason, setEditedReason] = useState('');
//   const [cancellationCharges, setCancellationCharges] = useState(0);
//   const [notes, setNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [cancelActionLoading, setCancelActionLoading] = useState(false);
  
//   // Restore Booking Modal States
//   const [restoreBookingModal, setRestoreBookingModal] = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason, setRestoreReason] = useState('');
//   const [restoreNotes, setRestoreNotes] = useState('');
//   const [restoreLoading, setRestoreLoading] = useState(false);
//   const [restoreType, setRestoreType] = useState('');

//   // Data states
//   const [allData, setAllData] = useState([]);
//   const {
//     data: rejectedData,
//     setData: setRejectedData,
//     filteredData: filteredRejected,
//     setFilteredData: setFilteredRejected,
//     handleFilter: handleRejectedFilter
//   } = useTableFilter([]);
  
//   const {
//     data: cancelledPendingData,
//     setData: setCancelledPendingData,
//     filteredData: filteredCancelledPending,
//     setFilteredData: setFilteredCancelledPending,
//     handleFilter: handleCancelledPendingFilter
//   } = useTableFilter([]);
//   const {
//     data: cancelledRejectedData,
//     setData: setCancelledRejectedData,
//     filteredData: filteredCancelledRejected,
//     setFilteredData: setFilteredCancelledRejected,
//     handleFilter: handleCancelledRejectedFilter
//   } = useTableFilter([]);

//   const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
//   const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
//   const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);
  
//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Subdealer Management page
//   const hasViewPermission = canViewPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasCreatePermission = canCreateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasUpdatePermission = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasDeletePermission = canDeleteInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  
//   // Check for cancellation management permission
//   const hasCancellationApprovePermission = hasCreatePermission; // Approving cancellation is CREATE
//   const hasCancellationRejectPermission = hasDeletePermission; // Rejecting cancellation is DELETE
  
//   // Check for restore booking permission (using CREATE permission since restoring creates a new status)
//   const hasRestorePermission = hasCreatePermission;

//   useEffect(() => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view Subdealer Management');
//       return;
//     }
//     fetchAllData();
//   }, [hasViewPermission]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setCancelledLoading(true);
//       await Promise.all([
//         fetchData(),
//         fetchCancellationData()
//       ]);
      
//       setLoading(false);
//       setCancelledLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//       setCancelledLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings?bookingType=SUBDEALER`);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setAllData(subdealerBookings);
      
//       const rejectedBookings = subdealerBookings.filter((booking) => booking.status === 'REJECTED');
//       setRejectedData(rejectedBookings);
//       setFilteredRejected(rejectedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchCancellationData = async () => {
//     try {
//       const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { status: 'PENDING', bookingType: 'SUBDEALER' }
//       });
//       setCancelledPendingData(pendingResponse.data.data);
//       setFilteredCancelledPending(pendingResponse.data.data);
      
//       const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { status: 'REJECTED', bookingType: 'SUBDEALER' }
//       });
//       setCancelledRejectedData(rejectedResponse.data.data);
//       setFilteredCancelledRejected(rejectedResponse.data.data);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenRestoreModal = (bookingId, type) => {
//     if (!hasRestorePermission) {
//       showError('You do not have permission to restore bookings');
//       return;
//     }
    
//     setSelectedRestoreBooking(bookingId);
//     setRestoreType(type);
//     setRestoreReason('');
//     setRestoreNotes('');
//     setRestoreBookingModal(true);
//   };

//   const handleRestoreBooking = async () => {
//     if (!selectedRestoreBooking) return;

//     try {
//       setRestoreLoading(true);
      
//       const payload = {
//         reason: restoreReason.trim() || undefined,
//         notes: restoreNotes.trim() || undefined
//       };

//       let apiUrl = '';
      
//       if (restoreType === 'cancelled') {
//         apiUrl = `/bookings/${selectedRestoreBooking}/restore`;
//       } else if (restoreType === 'rejected_discount') {
//         apiUrl = `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
//       }

//       await axiosInstance.put(apiUrl, payload);
      
//       showSuccess('Booking restored successfully!');
//       setRestoreBookingModal(false);
//       setSelectedRestoreBooking(null);
//       setRestoreReason('');
//       setRestoreNotes('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error('Error restoring booking:', error);
//       showError(error.response?.data?.message || 'Failed to restore booking');
//     } finally {
//       setRestoreLoading(false);
//     }
//   };

//   const handleApproveCancellation = (cancellation) => {
//     if (!hasCancellationApprovePermission) {
//       showError('You do not have permission to approve cancellations');
//       return;
//     }
    
//     setSelectedCancellationForApproval(cancellation);
//     setCancelApprovalAction('APPROVE');
//     setEditedReason(cancellation.cancellationRequest?.reason || '');
//     setCancellationCharges(cancellation.cancellationRequest?.cancellationCharges || 0);
//     setNotes('');
//     setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (cancellation) => {
//     if (!hasCancellationRejectPermission) {
//       showError('You do not have permission to reject cancellations');
//       return;
//     }
    
//     setSelectedCancellationForApproval(cancellation);
//     setCancelApprovalAction('REJECT');
//     setRejectionReason('');
//     setNotes('');
//     setCancelApprovalModal(true);
//   };

//   const handleCancelActionSubmit = async () => {
//     if (!selectedCancellationForApproval) return;

//     try {
//       setCancelActionLoading(true);
      
//       if (cancelApprovalAction === 'APPROVE') {
//         const payload = {
//           reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
//           editedReason: editedReason,
//           cancellationCharges: cancellationCharges,
//           notes: notes
//         };

//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, payload);
//         showSuccess('Cancellation approved successfully!');
//       } else {
//         const payload = {
//           rejectionReason: rejectionReason,
//           notes: notes
//         };

//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, payload);
//         showSuccess('Cancellation rejected successfully!');
//       }

//       setCancelApprovalModal(false);
//       setSelectedCancellationForApproval(null);
//       setEditedReason('');
//       setCancellationCharges(0);
//       setNotes('');
//       setRejectionReason('');

//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${cancelApprovalAction === 'APPROVE' ? 'approving' : 'rejecting'} cancellation:`, error);
//       showError(error.response?.data?.message || `Failed to ${cancelApprovalAction === 'APPROVE' ? 'approve' : 'reject'} cancellation`);
//     } finally {
//       setCancelActionLoading(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   // Early return if no view permission
//   if (!hasViewPermission) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer Management.
//       </div>
//     );
//   }

//   const renderManagementTable = (records, tabIndex) => {
//     const showCancelOptionsColumn = tabIndex === 1 && (hasCancellationApprovePermission || hasCancellationRejectPermission);
//     const showRestoreActionsColumn = (tabIndex === 0 && hasRestorePermission) || (tabIndex === 2 && hasRestorePermission);
    
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//               {tabIndex === 1 || tabIndex === 2 ? (
//                 <>
//                   <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
//                 </>
//               ) : (
//                 <>
//                   <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 </>
//               )}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
//               {showCancelOptionsColumn && <CTableHeaderCell scope="col">Options</CTableHeaderCell>}
//               {showRestoreActionsColumn && <CTableHeaderCell scope="col">Actions</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={
//                   5 + // Base columns
//                   (tabIndex === 1 || tabIndex === 2 ? 5 : 4) + // Additional columns based on tab
//                   (tabIndex === 2 ? 1 : 0) + // Rejection reason column
//                   (showCancelOptionsColumn ? 1 : 0) + // Cancel options column
//                   (showRestoreActionsColumn ? 1 : 0) // Restore actions column
//                 } style={{ color: 'red', textAlign: 'center' }}>
//                   {tabIndex === 0 ? 'No rejected discount bookings available' : 
//                    tabIndex === 1 ? 'No cancellation requests available' : 
//                    'No rejected cancellation requests available'}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((record, index) => {
//                 if (tabIndex === 1 || tabIndex === 2) {
//                   // Cancellation records
//                   const cancellation = record;
//                   return (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
//                       <CTableDataCell>
//                         <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
//                           {cancellation.cancellationRequest?.status || 'N/A'}
//                         </span>
//                       </CTableDataCell>
//                       {tabIndex === 2 && (
//                         <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
//                       )}
//                       {showCancelOptionsColumn && (
//                         <CTableDataCell>
//                           <div className="d-flex">
//                             {hasCancellationApprovePermission && (
//                               <CButton
//                                 size="sm"
//                                 className="me-2"
//                                 color="success"
//                                 onClick={() => handleApproveCancellation(cancellation)}
//                               >
//                                 <CIcon icon={cilCheck} /> Approve
//                               </CButton>
//                             )}
//                             {hasCancellationRejectPermission && (
//                               <CButton
//                                 size="sm"
//                                 color="danger"
//                                 onClick={() => handleRejectCancellation(cancellation)}
//                               >
//                                 <CIcon icon={cilX} /> Reject
//                               </CButton>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                       )}
//                       {showRestoreActionsColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled')}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 } else {
//                   // Rejected discount booking records
//                   const booking = record;
//                   return (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.mobile1 || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.model.type}</CTableDataCell>
//                       <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <span 
//                           className="status-badge" 
//                           style={{
//                             backgroundColor: '#dc3545',
//                             color: '#fff',
//                             padding: '2px 8px',
//                             borderRadius: '12px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             display: 'inline-block'
//                           }}
//                         >
//                           {booking.status}
//                         </span>
//                       </CTableDataCell>
//                       {showRestoreActionsColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(booking._id, 'rejected_discount')}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 }
//               })
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer Management</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         {/* <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <Link to="/all-subdealer-booking">
//               <CButton size="sm" color="secondary" className="me-1">
//                 <CIcon icon={cilArrowLeft} className='icon'/> Back to Bookings
//               </CButton>
//             </Link>
//           </div>
//         </CCardHeader> */}
        
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
//                 Rejected Discount
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
//                 Cancelled Booking
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 2}
//                 onClick={() => handleTabChange(2)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Rejected Cancelled Booking
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
//                   else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderManagementTable(rejectedRecords, 0)}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {cancelledLoading ? (
//                 <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                   <CSpinner color="primary" />
//                 </div>
//               ) : (
//                 renderManagementTable(cancelledPendingRecords, 1)
//               )}
//             </CTabPane>
//             <CTabPane visible={activeTab === 2}>
//               {cancelledLoading ? (
//                 <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                   <CSpinner color="primary" />
//                 </div>
//               ) : (
//                 renderManagementTable(cancelledRejectedRecords, 2)
//               )}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Restore Booking Modal */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon className="me-2" />
//             Restore Booking to Normal
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Reason:</CFormLabel>
//             <CFormTextarea
//               value={restoreReason}
//               onChange={(e) => setRestoreReason(e.target.value)}
//               rows={2}
//               placeholder="Enter reason for restoring booking"
//             />
//           </div>
//           <div className="mb-3">
//             <CFormLabel>Notes (Optional):</CFormLabel>
//             <CFormTextarea
//               value={restoreNotes}
//               onChange={(e) => setRestoreNotes(e.target.value)}
//               rows={2}
//               placeholder="Enter any additional notes"
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleRestoreBooking}
//             disabled={restoreLoading}
//           >
//             {restoreLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               'Restore Booking'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval Modal */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation Request' : 'Reject Cancellation Request'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3">
//                 <CFormLabel>Original Reason:</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   value={selectedCancellationForApproval?.cancellationRequest?.reason || ''}
//                   readOnly
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Edited Reason (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={editedReason}
//                   onChange={(e) => setEditedReason(e.target.value)}
//                   rows={2}
//                   placeholder="Enter edited reason if needed"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Cancellation Charges:</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   value={cancellationCharges}
//                   onChange={(e) => setCancellationCharges(Number(e.target.value))}
//                   min="0"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Notes (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={2}
//                   placeholder="Enter any additional notes"
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3">
//                 <CFormLabel>Rejection Reason:</CFormLabel>
//                 <CFormTextarea
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   rows={2}
//                   placeholder="Enter reason for rejection"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Notes (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={2}
//                   placeholder="Enter any additional notes"
//                 />
//               </div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleCancelActionSubmit}
//             disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}
//           >
//             {cancelActionLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default SubdealerManagement;















// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSettings, 
//   cilCheck, 
//   cilX,
//   cilArrowLeft
// } from '@coreui/icons';
// import { 
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
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea,
//   CAlert,
// } from '@coreui/react';
// import { useAuth } from 'src/context/AuthContext';
// import { 
//   MODULES, 
//   PAGES,
//   TABS,  // Import TABS constant
//   canViewTab,  // Import tab-level permission function
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from 'src/utils/modulePermissions';

// const SubdealerManagement = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Cancellation states
//   const [cancelledLoading, setCancelledLoading] = useState(false);
  
//   // Cancellation Approval/Reject Modal States
//   const [cancelApprovalModal, setCancelApprovalModal] = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction, setCancelApprovalAction] = useState('');
//   const [editedReason, setEditedReason] = useState('');
//   const [cancellationCharges, setCancellationCharges] = useState(0);
//   const [notes, setNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [cancelActionLoading, setCancelActionLoading] = useState(false);
  
//   // Restore Booking Modal States
//   const [restoreBookingModal, setRestoreBookingModal] = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason, setRestoreReason] = useState('');
//   const [restoreNotes, setRestoreNotes] = useState('');
//   const [restoreLoading, setRestoreLoading] = useState(false);
//   const [restoreType, setRestoreType] = useState('');

//   // Data states
//   const [allData, setAllData] = useState([]);
//   const {
//     data: rejectedData,
//     setData: setRejectedData,
//     filteredData: filteredRejected,
//     setFilteredData: setFilteredRejected,
//     handleFilter: handleRejectedFilter
//   } = useTableFilter([]);
  
//   const {
//     data: cancelledPendingData,
//     setData: setCancelledPendingData,
//     filteredData: filteredCancelledPending,
//     setFilteredData: setFilteredCancelledPending,
//     handleFilter: handleCancelledPendingFilter
//   } = useTableFilter([]);
//   const {
//     data: cancelledRejectedData,
//     setData: setCancelledRejectedData,
//     filteredData: filteredCancelledRejected,
//     setFilteredData: setFilteredCancelledRejected,
//     handleFilter: handleCancelledRejectedFilter
//   } = useTableFilter([]);

//   const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
//   const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
//   const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);
  
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user is a subdealer
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   // Define page name for this component (adjust based on your actual page name)
//   const pageName = 'Subdealer Management'; // Make sure this matches your PAGES constant
  
//   // Tab-level permission checks
//   const hasRejectedDiscountPermission = canViewTab(permissions, MODULES.SUBDEALER_BOOKING, pageName, TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT);
//   const hasCancelledBookingPermission = canViewTab(permissions, MODULES.SUBDEALER_BOOKING, pageName, TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING);
//   const hasRejectedCancelledBookingPermission = canViewTab(permissions, MODULES.SUBDEALER_BOOKING, pageName, TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING);
  
//   // Page-level permission check - user needs at least ONE tab permission
//   const hasViewPermission = hasRejectedDiscountPermission || hasCancelledBookingPermission || hasRejectedCancelledBookingPermission;
  
//   // Tab-specific permission checks for actions
//   const hasRejectedDiscountActions = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, pageName, TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT);
//   const hasCancelledBookingActions = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, pageName, TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING);
//   const hasRejectedCancelledBookingActions = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, pageName, TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING);

//   useEffect(() => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view Subdealer Management');
//       return;
//     }
    
//     // If user has permission for any tab, fetch data
//     fetchAllData();
//   }, [hasViewPermission]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setCancelledLoading(true);
      
//       // Only fetch data for tabs the user has permission to view
//       const fetchPromises = [];
      
//       if (hasRejectedDiscountPermission) {
//         fetchPromises.push(fetchData());
//       }
      
//       if (hasCancelledBookingPermission || hasRejectedCancelledBookingPermission) {
//         fetchPromises.push(fetchCancellationData());
//       }
      
//       if (fetchPromises.length > 0) {
//         await Promise.all(fetchPromises);
//       }
      
//       setLoading(false);
//       setCancelledLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//       setCancelledLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       let url = `/bookings?bookingType=SUBDEALER`;
      
//       // If user is a subdealer, filter by their subdealer ID
//       if (isSubdealer && userSubdealerId) {
//         url += `&subdealer=${userSubdealerId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setAllData(subdealerBookings);
      
//       const rejectedBookings = subdealerBookings.filter((booking) => booking.status === 'REJECTED');
//       setRejectedData(rejectedBookings);
//       setFilteredRejected(rejectedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchCancellationData = async () => {
//     try {
//       // Prepare base params
//       const pendingParams = {
//         status: 'PENDING',
//         bookingType: 'SUBDEALER'
//       };
      
//       const rejectedParams = {
//         status: 'REJECTED',
//         bookingType: 'SUBDEALER'
//       };
      
//       // Add subdealer filter if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         pendingParams.subdealer = userSubdealerId;
//         rejectedParams.subdealer = userSubdealerId;
//       }
      
//       const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: pendingParams
//       });
//       setCancelledPendingData(pendingResponse.data.data);
//       setFilteredCancelledPending(pendingResponse.data.data);
      
//       const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: rejectedParams
//       });
//       setCancelledRejectedData(rejectedResponse.data.data);
//       setFilteredCancelledRejected(rejectedResponse.data.data);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenRestoreModal = (bookingId, type, tabType) => {
//     let hasPermission = false;
    
//     // Check permission based on tab type
//     if (tabType === 'rejected_discount') {
//       hasPermission = hasRejectedDiscountActions;
//     } else if (tabType === 'cancelled') {
//       hasPermission = hasCancelledBookingActions;
//     }
    
//     if (!hasPermission) {
//       showError('You do not have permission to restore bookings in this tab');
//       return;
//     }
    
//     setSelectedRestoreBooking(bookingId);
//     setRestoreType(type);
//     setRestoreReason('');
//     setRestoreNotes('');
//     setRestoreBookingModal(true);
//   };

//   const handleApproveCancellation = (cancellation) => {
//     if (!hasCancelledBookingActions) {
//       showError('You do not have permission to approve cancellations');
//       return;
//     }
    
//     setSelectedCancellationForApproval(cancellation);
//     setCancelApprovalAction('APPROVE');
//     setEditedReason(cancellation.cancellationRequest?.reason || '');
//     setCancellationCharges(cancellation.cancellationRequest?.cancellationCharges || 0);
//     setNotes('');
//     setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (cancellation) => {
//     if (!hasCancelledBookingActions) {
//       showError('You do not have permission to reject cancellations');
//       return;
//     }
    
//     setSelectedCancellationForApproval(cancellation);
//     setCancelApprovalAction('REJECT');
//     setRejectionReason('');
//     setNotes('');
//     setCancelApprovalModal(true);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   // Early return if no view permission for any tab
//   if (!hasViewPermission) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Subdealer Management.
//       </div>
//     );
//   }

//   const renderManagementTable = (records, tabIndex) => {
//     // Determine which tab this is
//     const isRejectedDiscountTab = tabIndex === 0;
//     const isCancelledBookingTab = tabIndex === 1;
//     const isRejectedCancelledBookingTab = tabIndex === 2;
    
//     // Check if user has permission for this specific tab
//     const hasTabPermission = 
//       (isRejectedDiscountTab && hasRejectedDiscountPermission) ||
//       (isCancelledBookingTab && hasCancelledBookingPermission) ||
//       (isRejectedCancelledBookingTab && hasRejectedCancelledBookingPermission);
    
//     // If user doesn't have permission for this tab, show message
//     if (!hasTabPermission) {
//       return (
//         <div className="alert alert-warning mt-3" role="alert">
//           You do not have permission to view this tab.
//         </div>
//       );
//     }
    
//     const showCancelOptionsColumn = isCancelledBookingTab && hasCancelledBookingActions;
//     const showRestoreActionsColumn = 
//       (isRejectedDiscountTab && hasRejectedDiscountActions) || 
//       (isRejectedCancelledBookingTab && hasRejectedCancelledBookingActions);
    
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//               {isCancelledBookingTab || isRejectedCancelledBookingTab ? (
//                 <>
//                   <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
//                 </>
//               ) : (
//                 <>
//                   <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 </>
//               )}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {isRejectedCancelledBookingTab && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
//               {showCancelOptionsColumn && <CTableHeaderCell scope="col">Options</CTableHeaderCell>}
//               {showRestoreActionsColumn && <CTableHeaderCell scope="col">Actions</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={
//                   5 + // Base columns
//                   (isCancelledBookingTab || isRejectedCancelledBookingTab ? 5 : 4) + // Additional columns based on tab
//                   (isRejectedCancelledBookingTab ? 1 : 0) + // Rejection reason column
//                   (showCancelOptionsColumn ? 1 : 0) + // Cancel options column
//                   (showRestoreActionsColumn ? 1 : 0) // Restore actions column
//                 } style={{ color: 'red', textAlign: 'center' }}>
//                   {isSubdealer ? (
//                     isRejectedDiscountTab ? 'No rejected discount bookings available for your account' : 
//                     isCancelledBookingTab ? 'No cancellation requests available for your account' : 
//                     'No rejected cancellation requests available for your account'
//                   ) : (
//                     isRejectedDiscountTab ? 'No rejected discount bookings available' : 
//                     isCancelledBookingTab ? 'No cancellation requests available' : 
//                     'No rejected cancellation requests available'
//                   )}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((record, index) => {
//                 if (isCancelledBookingTab || isRejectedCancelledBookingTab) {
//                   // Cancellation records
//                   const cancellation = record;
//                   return (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
//                       <CTableDataCell>
//                         <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
//                           {cancellation.cancellationRequest?.status || 'N/A'}
//                         </span>
//                       </CTableDataCell>
//                       {isRejectedCancelledBookingTab && (
//                         <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
//                       )}
//                       {showCancelOptionsColumn && (
//                         <CTableDataCell>
//                           <div className="d-flex">
//                             {hasCancelledBookingActions && (
//                               <>
//                                 <CButton
//                                   size="sm"
//                                   className="me-2"
//                                   color="success"
//                                   onClick={() => handleApproveCancellation(cancellation)}
//                                 >
//                                   <CIcon icon={cilCheck} /> Approve
//                                 </CButton>
//                                 <CButton
//                                   size="sm"
//                                   color="danger"
//                                   onClick={() => handleRejectCancellation(cancellation)}
//                                 >
//                                   <CIcon icon={cilX} /> Reject
//                                 </CButton>
//                               </>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                       )}
//                       {showRestoreActionsColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled', 'cancelled')}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 } else {
//                   // Rejected discount booking records
//                   const booking = record;
//                   return (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.mobile1 || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.model.type}</CTableDataCell>
//                       <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <span 
//                           className="status-badge" 
//                           style={{
//                             backgroundColor: '#dc3545',
//                             color: '#fff',
//                             padding: '2px 8px',
//                             borderRadius: '12px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             display: 'inline-block'
//                           }}
//                         >
//                           {booking.status}
//                         </span>
//                       </CTableDataCell>
//                       {showRestoreActionsColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(booking._id, 'rejected_discount', 'rejected_discount')}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 }
//               })
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer Management</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardBody>
          
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show tabs that user has permission to view */}
//             {hasRejectedDiscountPermission && (
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
//                   Rejected Discount
//                 </CNavLink>
//               </CNavItem>
//             )}
            
//             {hasCancelledBookingPermission && (
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
//                   Cancelled Booking
//                 </CNavLink>
//               </CNavItem>
//             )}
            
//             {hasRejectedCancelledBookingPermission && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 2}
//                   onClick={() => handleTabChange(2)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Rejected Cancelled Booking
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               {hasViewPermission && (
//                 <>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 1) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
//                       else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
//                     }}
//                   />
//                 </>
//               )}
//             </div>
//           </div>

//           <CTabContent>
//             {hasRejectedDiscountPermission && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderManagementTable(rejectedRecords, 0)}
//               </CTabPane>
//             )}
            
//             {hasCancelledBookingPermission && (
//               <CTabPane visible={activeTab === 1}>
//                 {cancelledLoading ? (
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                     <CSpinner color="primary" />
//                   </div>
//                 ) : (
//                   renderManagementTable(cancelledPendingRecords, 1)
//                 )}
//               </CTabPane>
//             )}
            
//             {hasRejectedCancelledBookingPermission && (
//               <CTabPane visible={activeTab === 2}>
//                 {cancelledLoading ? (
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                     <CSpinner color="primary" />
//                   </div>
//                 ) : (
//                   renderManagementTable(cancelledRejectedRecords, 2)
//                 )}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Restore Booking Modal */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon className="me-2" />
//             Restore Booking to Normal
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Reason:</CFormLabel>
//             <CFormTextarea
//               value={restoreReason}
//               onChange={(e) => setRestoreReason(e.target.value)}
//               rows={2}
//               placeholder="Enter reason for restoring booking"
//             />
//           </div>
//           <div className="mb-3">
//             <CFormLabel>Notes (Optional):</CFormLabel>
//             <CFormTextarea
//               value={restoreNotes}
//               onChange={(e) => setRestoreNotes(e.target.value)}
//               rows={2}
//               placeholder="Enter any additional notes"
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleRestoreBooking}
//             disabled={restoreLoading}
//           >
//             {restoreLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               'Restore Booking'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval Modal */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation Request' : 'Reject Cancellation Request'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3">
//                 <CFormLabel>Original Reason:</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   value={selectedCancellationForApproval?.cancellationRequest?.reason || ''}
//                   readOnly
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Edited Reason (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={editedReason}
//                   onChange={(e) => setEditedReason(e.target.value)}
//                   rows={2}
//                   placeholder="Enter edited reason if needed"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Cancellation Charges:</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   value={cancellationCharges}
//                   onChange={(e) => setCancellationCharges(Number(e.target.value))}
//                   min="0"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Notes (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={2}
//                   placeholder="Enter any additional notes"
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3">
//                 <CFormLabel>Rejection Reason:</CFormLabel>
//                 <CFormTextarea
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   rows={2}
//                   placeholder="Enter reason for rejection"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Notes (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={2}
//                   placeholder="Enter any additional notes"
//                 />
//               </div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleCancelActionSubmit}
//             disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}
//           >
//             {cancelActionLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default SubdealerManagement;










// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSettings, 
//   cilCheck, 
//   cilX,
//   cilArrowLeft
// } from '@coreui/icons';
// import { 
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
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea,
//   CAlert,
// } from '@coreui/react';
// import { useAuth } from 'src/context/AuthContext';
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   TABS,
//   ACTIONS
// } from 'src/utils/modulePermissions';

// const SubdealerManagement = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Cancellation states
//   const [cancelledLoading, setCancelledLoading] = useState(false);
  
//   // Cancellation Approval/Reject Modal States
//   const [cancelApprovalModal, setCancelApprovalModal] = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction, setCancelApprovalAction] = useState('');
//   const [editedReason, setEditedReason] = useState('');
//   const [cancellationCharges, setCancellationCharges] = useState(0);
//   const [notes, setNotes] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [cancelActionLoading, setCancelActionLoading] = useState(false);
  
//   // Restore Booking Modal States
//   const [restoreBookingModal, setRestoreBookingModal] = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason, setRestoreReason] = useState('');
//   const [restoreNotes, setRestoreNotes] = useState('');
//   const [restoreLoading, setRestoreLoading] = useState(false);
//   const [restoreType, setRestoreType] = useState('');

//   // Data states
//   const [allData, setAllData] = useState([]);
//   const {
//     data: rejectedData,
//     setData: setRejectedData,
//     filteredData: filteredRejected,
//     setFilteredData: setFilteredRejected,
//     handleFilter: handleRejectedFilter
//   } = useTableFilter([]);
  
//   const {
//     data: cancelledPendingData,
//     setData: setCancelledPendingData,
//     filteredData: filteredCancelledPending,
//     setFilteredData: setFilteredCancelledPending,
//     handleFilter: handleCancelledPendingFilter
//   } = useTableFilter([]);
//   const {
//     data: cancelledRejectedData,
//     setData: setCancelledRejectedData,
//     filteredData: filteredCancelledRejected,
//     setFilteredData: setFilteredCancelledRejected,
//     handleFilter: handleCancelledRejectedFilter
//   } = useTableFilter([]);

//   const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
//   const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
//   const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);
  
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user is a subdealer
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   // Define page name for this component
//   const pageName = PAGES.SUBDEALER_MANAGEMENT.SUBDEALER_MANAGEMENT;
  
//   // ========== TAB-LEVEL VIEW PERMISSIONS ==========
//   const canViewRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
//   );
  
//   const canViewCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
//   );
  
//   const canViewRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL CREATE PERMISSIONS ==========
//   const canCreateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
//   );
  
//   const canCreateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
//   );
  
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
//   const canUpdateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
//   );
  
//   const canUpdateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
//   );
  
//   const canUpdateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL DELETE PERMISSIONS ==========
//   const canDeleteInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
//   );
  
//   const canDeleteInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
//   );
  
//   const canDeleteInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
//   // Restore booking in Rejected Discount tab - uses CREATE permission (restoring creates a new state)
//   const canRestoreInRejectedDiscountTab = canCreateInRejectedDiscountTab;
  
//   // Approve cancellation - uses CREATE permission in Cancelled Booking tab
//   const canApproveCancellation = canCreateInCancelledBookingTab;
  
//   // Reject cancellation - uses DELETE permission in Cancelled Booking tab
//   const canRejectCancellation = canDeleteInCancelledBookingTab;
  
//   // Restore booking in Cancelled Booking tab - uses CREATE permission (restoring creates a new state)
//   const canRestoreInCancelledBookingTab = canCreateInCancelledBookingTab;
  
//   // Restore booking in Rejected Cancelled Booking tab - uses CREATE permission (restoring creates a new state)
//   const canRestoreInRejectedCancelledBookingTab = canCreateInRejectedCancelledBookingTab;
  
//   // View specific permissions for tabs
//   const canViewBookingInTab = {
//     0: canViewRejectedDiscountTab,           // REJECTED DISCOUNT
//     1: canViewCancelledBookingTab,           // CANCELLED BOOKING
//     2: canViewRejectedCancelledBookingTab    // REJECTED CANCELLED BOOKING
//   };
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewRejectedDiscountTab || canViewCancelledBookingTab || 
//                        canViewRejectedCancelledBookingTab;

//   // Check if user can create a new entry (page-level CREATE)
//   const canCreateNewEntry = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_MANAGEMENT,
//     pageName,
//     ACTIONS.CREATE
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewRejectedDiscountTab) availableTabs.push(0);
//     if (canViewCancelledBookingTab) availableTabs.push(1);
//     if (canViewRejectedCancelledBookingTab) availableTabs.push(2);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewRejectedDiscountTab, canViewCancelledBookingTab, canViewRejectedCancelledBookingTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       console.log('No permission to view any Subdealer Management tabs');
//       showError('You do not have permission to view any Subdealer Management tabs');
//       return;
//     }
    
//     console.log('User has permission, fetching data...');
//     fetchAllData();
//   }, [canViewAnyTab]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setCancelledLoading(true);
      
//       // Only fetch data for tabs the user has permission to view
//       const fetchPromises = [];
      
//       if (canViewRejectedDiscountTab) {
//         fetchPromises.push(fetchData());
//       }
      
//       if (canViewCancelledBookingTab || canViewRejectedCancelledBookingTab) {
//         fetchPromises.push(fetchCancellationData());
//       }
      
//       if (fetchPromises.length > 0) {
//         await Promise.all(fetchPromises);
//       }
      
//       setLoading(false);
//       setCancelledLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//       setCancelledLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       let url = `/bookings?bookingType=SUBDEALER`;
      
//       // If user is a subdealer, filter by their subdealer ID
//       if (isSubdealer && userSubdealerId) {
//         url += `&subdealer=${userSubdealerId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setAllData(subdealerBookings);
      
//       const rejectedBookings = subdealerBookings.filter((booking) => booking.status === 'REJECTED');
//       setRejectedData(rejectedBookings);
//       setFilteredRejected(rejectedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchCancellationData = async () => {
//     try {
//       // Prepare base params
//       const pendingParams = {
//         status: 'PENDING',
//         bookingType: 'SUBDEALER'
//       };
      
//       const rejectedParams = {
//         status: 'REJECTED',
//         bookingType: 'SUBDEALER'
//       };
      
//       // Add subdealer filter if user is a subdealer
//       if (isSubdealer && userSubdealerId) {
//         pendingParams.subdealer = userSubdealerId;
//         rejectedParams.subdealer = userSubdealerId;
//       }
      
//       const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: pendingParams
//       });
//       setCancelledPendingData(pendingResponse.data.data);
//       setFilteredCancelledPending(pendingResponse.data.data);
      
//       const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: rejectedParams
//       });
//       setCancelledRejectedData(rejectedResponse.data.data);
//       setFilteredCancelledRejected(rejectedResponse.data.data);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleCancelActionSubmit = async () => {
//     if (!selectedCancellationForApproval) return;

//     try {
//       setCancelActionLoading(true);
      
//       if (cancelApprovalAction === 'APPROVE') {
//         // Check CREATE permission in Cancelled Booking tab
//         if (!canApproveCancellation) {
//           showError('You do not have permission to approve cancellations in Cancelled Booking tab');
//           setCancelActionLoading(false);
//           return;
//         }
        
//         const payload = {
//           reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
//           editedReason: editedReason,
//           cancellationCharges: cancellationCharges,
//           notes: notes
//         };

//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, payload);
//         showSuccess('Cancellation approved successfully!');
//       } else {
//         // Check DELETE permission in Cancelled Booking tab
//         if (!canRejectCancellation) {
//           showError('You do not have permission to reject cancellations in Cancelled Booking tab');
//           setCancelActionLoading(false);
//           return;
//         }
        
//         const payload = {
//           rejectionReason: rejectionReason,
//           notes: notes
//         };

//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, payload);
//         showSuccess('Cancellation rejected successfully!');
//       }

//       setCancelApprovalModal(false);
//       setSelectedCancellationForApproval(null);
//       setEditedReason('');
//       setCancellationCharges(0);
//       setNotes('');
//       setRejectionReason('');

//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${cancelApprovalAction === 'APPROVE' ? 'approving' : 'rejecting'} cancellation:`, error);
//       showError(error.response?.data?.message || `Failed to ${cancelApprovalAction === 'APPROVE' ? 'approve' : 'reject'} cancellation`);
//     } finally {
//       setCancelActionLoading(false);
//     }
//   };

//   const handleOpenRestoreModal = (bookingId, type, tabType) => {
//     let hasPermission = false;
    
//     // Check permission based on tab type - using CREATE permission for restoration
//     if (tabType === 'rejected_discount') {
//       hasPermission = canRestoreInRejectedDiscountTab; // Uses CREATE permission
//     } else if (tabType === 'cancelled') {
//       hasPermission = canRestoreInCancelledBookingTab; // Uses CREATE permission
//     } else if (tabType === 'rejected_cancelled') {
//       hasPermission = canRestoreInRejectedCancelledBookingTab; // Uses CREATE permission
//     }
    
//     if (!hasPermission) {
//       showError('You do not have permission to restore bookings in this tab');
//       return;
//     }
    
//     setSelectedRestoreBooking(bookingId);
//     setRestoreType(type);
//     setRestoreReason('');
//     setRestoreNotes('');
//     setRestoreBookingModal(true);
//   };

//   const handleRestoreBooking = async () => {
//     if (!selectedRestoreBooking) return;

//     try {
//       setRestoreLoading(true);
      
//       const payload = {
//         reason: restoreReason.trim() || undefined,
//         notes: restoreNotes.trim() || undefined
//       };

//       let apiUrl = '';
      
//       if (restoreType === 'cancelled') {
//         apiUrl = `/bookings/${selectedRestoreBooking}/restore`;
//       } else if (restoreType === 'rejected_discount') {
//         apiUrl = `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
//       }

//       await axiosInstance.put(apiUrl, payload);
      
//       showSuccess('Booking restored successfully!');
//       setRestoreBookingModal(false);
//       setSelectedRestoreBooking(null);
//       setRestoreReason('');
//       setRestoreNotes('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error('Error restoring booking:', error);
//       showError(error.response?.data?.message || 'Failed to restore booking');
//     } finally {
//       setRestoreLoading(false);
//     }
//   };

//   const handleApproveCancellation = (cancellation) => {
//     if (!canApproveCancellation) {
//       showError('You do not have permission to approve cancellations in Cancelled Booking tab');
//       return;
//     }
    
//     setSelectedCancellationForApproval(cancellation);
//     setCancelApprovalAction('APPROVE');
//     setEditedReason(cancellation.cancellationRequest?.reason || '');
//     setCancellationCharges(cancellation.cancellationRequest?.cancellationCharges || 0);
//     setNotes('');
//     setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (cancellation) => {
//     if (!canRejectCancellation) {
//       showError('You do not have permission to reject cancellations in Cancelled Booking tab');
//       return;
//     }
    
//     setSelectedCancellationForApproval(cancellation);
//     setCancelApprovalAction('REJECT');
//     setRejectionReason('');
//     setNotes('');
//     setCancelApprovalModal(true);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   // Early return if no view permission for any tab
//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any Subdealer Management tabs.
//       </div>
//     );
//   }

//   const renderManagementTable = (records, tabIndex) => {
//     // Check if user has permission to view this specific tab
//     const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
//     // If user doesn't have VIEW permission for this tab, show message
//     if (!canViewCurrentTab) {
//       const tabNames = [
//         "REJECTED DISCOUNT",
//         "CANCELLED BOOKING", 
//         "REJECTED CANCELLED BOOKING"
//       ];
      
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the {tabNames[tabIndex]} tab.
//           </CAlert>
//         </div>
//       );
//     }
    
//     const isRejectedDiscountTab = tabIndex === 0;
//     const isCancelledBookingTab = tabIndex === 1;
//     const isRejectedCancelledBookingTab = tabIndex === 2;
    
//     // Determine which actions are allowed based on the tab
//     const showCancelOptionsColumn = isCancelledBookingTab && 
//                                     (canApproveCancellation || canRejectCancellation);
    
//     const showRestoreActionsColumn = 
//       (isRejectedDiscountTab && canRestoreInRejectedDiscountTab) || 
//       (isCancelledBookingTab && canRestoreInCancelledBookingTab) ||
//       (isRejectedCancelledBookingTab && canRestoreInRejectedCancelledBookingTab);
    
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//               {isCancelledBookingTab || isRejectedCancelledBookingTab ? (
//                 <>
//                   <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
//                 </>
//               ) : (
//                 <>
//                   <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Type</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 </>
//               )}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {isRejectedCancelledBookingTab && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
//               {showCancelOptionsColumn && <CTableHeaderCell scope="col">Options</CTableHeaderCell>}
//               {showRestoreActionsColumn && <CTableHeaderCell scope="col">Actions</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={
//                   5 + // Base columns
//                   (isCancelledBookingTab || isRejectedCancelledBookingTab ? 5 : 4) + // Additional columns based on tab
//                   (isRejectedCancelledBookingTab ? 1 : 0) + // Rejection reason column
//                   (showCancelOptionsColumn ? 1 : 0) + // Cancel options column
//                   (showRestoreActionsColumn ? 1 : 0) // Restore actions column
//                 } style={{ color: 'red', textAlign: 'center' }}>
//                   {isSubdealer ? (
//                     isRejectedDiscountTab ? 'No rejected discount bookings available for your account' : 
//                     isCancelledBookingTab ? 'No cancellation requests available for your account' : 
//                     'No rejected cancellation requests available for your account'
//                   ) : (
//                     isRejectedDiscountTab ? 'No rejected discount bookings available' : 
//                     isCancelledBookingTab ? 'No cancellation requests available' : 
//                     'No rejected cancellation requests available'
//                   )}
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((record, index) => {
//                 if (isCancelledBookingTab || isRejectedCancelledBookingTab) {
//                   // Cancellation records
//                   const cancellation = record;
//                   return (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
//                       <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
//                       <CTableDataCell>
//                         <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
//                           {cancellation.cancellationRequest?.status || 'N/A'}
//                         </span>
//                       </CTableDataCell>
//                       {isRejectedCancelledBookingTab && (
//                         <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
//                       )}
//                       {showCancelOptionsColumn && (
//                         <CTableDataCell>
//                           <div className="d-flex">
//                             {canApproveCancellation && (
//                               <CButton
//                                 size="sm"
//                                 className="me-2"
//                                 color="success"
//                                 onClick={() => handleApproveCancellation(cancellation)}
//                               >
//                                 <CIcon icon={cilCheck} /> Approve
//                               </CButton>
//                             )}
//                             {canRejectCancellation && (
//                               <CButton
//                                 size="sm"
//                                 color="danger"
//                                 onClick={() => handleRejectCancellation(cancellation)}
//                               >
//                                 <CIcon icon={cilX} /> Reject
//                               </CButton>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                       )}
//                       {showRestoreActionsColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(
//                               cancellation._id, 
//                               'cancelled', 
//                               isCancelledBookingTab ? 'cancelled' : 'rejected_cancelled'
//                             )}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 } else {
//                   // Rejected discount booking records
//                   const booking = record;
//                   return (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails.mobile1 || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.model.type}</CTableDataCell>
//                       <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <span 
//                           className="status-badge" 
//                           style={{
//                             backgroundColor: '#dc3545',
//                             color: '#fff',
//                             padding: '2px 8px',
//                             borderRadius: '12px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             display: 'inline-block'
//                           }}
//                         >
//                           {booking.status}
//                         </span>
//                       </CTableDataCell>
//                       {showRestoreActionsColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(booking._id, 'rejected_discount', 'rejected_discount')}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 }
//               })
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Subdealer Management</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardBody>
          
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show tabs that user has permission to view */}
//             {canViewRejectedDiscountTab && (
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
//                   Rejected Discount
//                 </CNavLink>
//               </CNavItem>
//             )}
            
//             {canViewCancelledBookingTab && (
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
//                   Cancelled Booking
//                 </CNavLink>
//               </CNavItem>
//             )}
            
//             {canViewRejectedCancelledBookingTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 2}
//                   onClick={() => handleTabChange(2)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Rejected Cancelled Booking
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               {canViewAnyTab && (
//                 <>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 1) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
//                       else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
//                     }}
//                   />
//                 </>
//               )}
//             </div>
//           </div>

//           <CTabContent>
//             {canViewRejectedDiscountTab && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderManagementTable(rejectedRecords, 0)}
//               </CTabPane>
//             )}
            
//             {canViewCancelledBookingTab && (
//               <CTabPane visible={activeTab === 1}>
//                 {cancelledLoading ? (
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                     <CSpinner color="primary" />
//                   </div>
//                 ) : (
//                   renderManagementTable(cancelledPendingRecords, 1)
//                 )}
//               </CTabPane>
//             )}
            
//             {canViewRejectedCancelledBookingTab && (
//               <CTabPane visible={activeTab === 2}>
//                 {cancelledLoading ? (
//                   <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                     <CSpinner color="primary" />
//                   </div>
//                 ) : (
//                   renderManagementTable(cancelledRejectedRecords, 2)
//                 )}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Restore Booking Modal */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon className="me-2" />
//             Restore Booking to Normal
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Reason:</CFormLabel>
//             <CFormTextarea
//               value={restoreReason}
//               onChange={(e) => setRestoreReason(e.target.value)}
//               rows={2}
//               placeholder="Enter reason for restoring booking"
//             />
//           </div>
//           <div className="mb-3">
//             <CFormLabel>Notes (Optional):</CFormLabel>
//             <CFormTextarea
//               value={restoreNotes}
//               onChange={(e) => setRestoreNotes(e.target.value)}
//               rows={2}
//               placeholder="Enter any additional notes"
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleRestoreBooking}
//             disabled={restoreLoading}
//           >
//             {restoreLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               'Restore Booking'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval Modal */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation Request' : 'Reject Cancellation Request'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3">
//                 <CFormLabel>Original Reason:</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   value={selectedCancellationForApproval?.cancellationRequest?.reason || ''}
//                   readOnly
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Edited Reason (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={editedReason}
//                   onChange={(e) => setEditedReason(e.target.value)}
//                   rows={2}
//                   placeholder="Enter edited reason if needed"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Cancellation Charges:</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   value={cancellationCharges}
//                   onChange={(e) => setCancellationCharges(Number(e.target.value))}
//                   min="0"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Notes (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={2}
//                   placeholder="Enter any additional notes"
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3">
//                 <CFormLabel>Rejection Reason:</CFormLabel>
//                 <CFormTextarea
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   rows={2}
//                   placeholder="Enter reason for rejection"
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Notes (Optional):</CFormLabel>
//                 <CFormTextarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows={2}
//                   placeholder="Enter any additional notes"
//                 />
//               </div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleCancelActionSubmit}
//             disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}
//           >
//             {cancelActionLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default SubdealerManagement;










import '../../../css/table.css';
import '../../../css/form.css';
import '../../../css/invoice.css';
import {
  React,
  useState,
  useEffect,
  Link,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  showError,
  axiosInstance,
  showSuccess
} from 'src/utils/tableImports';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilCheck, 
  cilX,
  cilArrowLeft
} from '@coreui/icons';
import { 
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
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CAlert,
} from '@coreui/react';
import { useAuth } from 'src/context/AuthContext';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from 'src/utils/modulePermissions';

const SubdealerManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cancellation states
  const [cancelledLoading, setCancelledLoading] = useState(false);
  
  // Cancellation Approval/Reject Modal States
  const [cancelApprovalModal, setCancelApprovalModal] = useState(false);
  const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
  const [cancelApprovalAction, setCancelApprovalAction] = useState('');
  const [editedReason, setEditedReason] = useState('');
  const [cancellationCharges, setCancellationCharges] = useState(0);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [cancelActionLoading, setCancelActionLoading] = useState(false);
  
  // Restore Booking Modal States
  const [restoreBookingModal, setRestoreBookingModal] = useState(false);
  const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
  const [restoreReason, setRestoreReason] = useState('');
  const [restoreNotes, setRestoreNotes] = useState('');
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreType, setRestoreType] = useState('');

  // Data states
  const [allData, setAllData] = useState([]);
  const {
    data: rejectedData,
    setData: setRejectedData,
    filteredData: filteredRejected,
    setFilteredData: setFilteredRejected,
    handleFilter: handleRejectedFilter
  } = useTableFilter([]);
  
  const {
    data: cancelledPendingData,
    setData: setCancelledPendingData,
    filteredData: filteredCancelledPending,
    setFilteredData: setFilteredCancelledPending,
    handleFilter: handleCancelledPendingFilter
  } = useTableFilter([]);
  const {
    data: cancelledRejectedData,
    setData: setCancelledRejectedData,
    filteredData: filteredCancelledRejected,
    setFilteredData: setFilteredCancelledRejected,
    handleFilter: handleCancelledRejectedFilter
  } = useTableFilter([]);

  const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
  const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
  const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);
  
  const { permissions, user: authUser } = useAuth();
  
  // Check if user is a subdealer
  const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;
  
  // Define page name for this component
  const pageName = PAGES.SUBDEALER_MANAGEMENT.SUBDEALER_MANAGEMENT;
  
  // ========== TAB-LEVEL VIEW PERMISSIONS ==========
  const canViewRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.VIEW,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
  );
  
  const canViewCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.VIEW,
    TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
  );
  
  const canViewRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.VIEW,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== TAB-LEVEL CREATE PERMISSIONS ==========
  const canCreateInRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.CREATE,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
  );
  
  const canCreateInCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.CREATE,
    TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
  );
  
  const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.CREATE,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
  const canUpdateInRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
  );
  
  const canUpdateInCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
  );
  
  const canUpdateInRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== TAB-LEVEL DELETE PERMISSIONS ==========
  const canDeleteInRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.DELETE,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_DISCOUNT
  );
  
  const canDeleteInCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.DELETE,
    TABS.SUBDEALER_MANAGEMENT.CANCELLED_BOOKING
  );
  
  const canDeleteInRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.DELETE,
    TABS.SUBDEALER_MANAGEMENT.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
  // Restore booking in Rejected Discount tab - uses CREATE permission (restoring creates a new state)
  const canRestoreInRejectedDiscountTab = canCreateInRejectedDiscountTab;
  
  // Approve cancellation - uses CREATE permission in Cancelled Booking tab
  const canApproveCancellation = canCreateInCancelledBookingTab;
  
  // Reject cancellation - uses CREATE permission in Cancelled Booking tab (Reject button should also check for CREATE permission)
  const canRejectCancellation = canCreateInCancelledBookingTab;
  
  // Restore booking in Cancelled Booking tab - uses CREATE permission (restoring creates a new state)
  const canRestoreInCancelledBookingTab = canCreateInCancelledBookingTab;
  
  // Restore booking in Rejected Cancelled Booking tab - uses CREATE permission (restoring creates a new state)
  const canRestoreInRejectedCancelledBookingTab = canCreateInRejectedCancelledBookingTab;
  
  // View specific permissions for tabs
  const canViewBookingInTab = {
    0: canViewRejectedDiscountTab,           // REJECTED DISCOUNT
    1: canViewCancelledBookingTab,           // CANCELLED BOOKING
    2: canViewRejectedCancelledBookingTab    // REJECTED CANCELLED BOOKING
  };
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewRejectedDiscountTab || canViewCancelledBookingTab || 
                       canViewRejectedCancelledBookingTab;

  // Check if user can create a new entry (page-level CREATE)
  const canCreateNewEntry = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_MANAGEMENT,
    pageName,
    ACTIONS.CREATE
  );

  // Adjust activeTab when permissions change
  useEffect(() => {
    const availableTabs = [];
    if (canViewRejectedDiscountTab) availableTabs.push(0);
    if (canViewCancelledBookingTab) availableTabs.push(1);
    if (canViewRejectedCancelledBookingTab) availableTabs.push(2);
    
    // If current activeTab is not in availableTabs, switch to first available tab
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [canViewRejectedDiscountTab, canViewCancelledBookingTab, canViewRejectedCancelledBookingTab, activeTab]);

  useEffect(() => {
    if (!canViewAnyTab) {
      console.log('No permission to view any Subdealer Management tabs');
      showError('You do not have permission to view any Subdealer Management tabs');
      return;
    }
    
    console.log('User has permission, fetching data...');
    fetchAllData();
  }, [canViewAnyTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setCancelledLoading(true);
      
      // Only fetch data for tabs the user has permission to view
      const fetchPromises = [];
      
      if (canViewRejectedDiscountTab) {
        fetchPromises.push(fetchData());
      }
      
      if (canViewCancelledBookingTab || canViewRejectedCancelledBookingTab) {
        fetchPromises.push(fetchCancellationData());
      }
      
      if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises);
      }
      
      setLoading(false);
      setCancelledLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
      setLoading(false);
      setCancelledLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      let url = `/bookings?bookingType=SUBDEALER`;
      
      // If user is a subdealer, filter by their subdealer ID
      if (isSubdealer && userSubdealerId) {
        url += `&subdealer=${userSubdealerId}`;
      }
      
      const response = await axiosInstance.get(url);
      const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

      setAllData(subdealerBookings);
      
      const rejectedBookings = subdealerBookings.filter((booking) => booking.status === 'REJECTED');
      setRejectedData(rejectedBookings);
      setFilteredRejected(rejectedBookings);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchCancellationData = async () => {
    try {
      // Prepare base params
      const pendingParams = {
        status: 'PENDING',
        bookingType: 'SUBDEALER'
      };
      
      const rejectedParams = {
        status: 'REJECTED',
        bookingType: 'SUBDEALER'
      };
      
      // Add subdealer filter if user is a subdealer
      if (isSubdealer && userSubdealerId) {
        pendingParams.subdealer = userSubdealerId;
        rejectedParams.subdealer = userSubdealerId;
      }
      
      const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: pendingParams
      });
      setCancelledPendingData(pendingResponse.data.data);
      setFilteredCancelledPending(pendingResponse.data.data);
      
      const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: rejectedParams
      });
      setCancelledRejectedData(rejectedResponse.data.data);
      setFilteredCancelledRejected(rejectedResponse.data.data);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleCancelActionSubmit = async () => {
    if (!selectedCancellationForApproval) return;

    try {
      setCancelActionLoading(true);
      
      if (cancelApprovalAction === 'APPROVE') {
        // Check CREATE permission in Cancelled Booking tab
        if (!canApproveCancellation) {
          showError('You do not have permission to approve cancellations in Cancelled Booking tab');
          setCancelActionLoading(false);
          return;
        }
        
        const payload = {
          reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
          editedReason: editedReason,
          cancellationCharges: cancellationCharges,
          notes: notes
        };

        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, payload);
        showSuccess('Cancellation approved successfully!');
      } else {
        // Reject button should also check CREATE permission
        if (!canRejectCancellation) {
          showError('You do not have permission to reject cancellations in Cancelled Booking tab');
          setCancelActionLoading(false);
          return;
        }
        
        const payload = {
          rejectionReason: rejectionReason,
          notes: notes
        };

        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, payload);
        showSuccess('Cancellation rejected successfully!');
      }

      setCancelApprovalModal(false);
      setSelectedCancellationForApproval(null);
      setEditedReason('');
      setCancellationCharges(0);
      setNotes('');
      setRejectionReason('');

      await fetchAllData();
      
    } catch (error) {
      console.error(`Error ${cancelApprovalAction === 'APPROVE' ? 'approving' : 'rejecting'} cancellation:`, error);
      showError(error.response?.data?.message || `Failed to ${cancelApprovalAction === 'APPROVE' ? 'approve' : 'reject'} cancellation`);
    } finally {
      setCancelActionLoading(false);
    }
  };

  const handleOpenRestoreModal = (bookingId, type, tabType) => {
    let hasPermission = false;
    
    // Check permission based on tab type - using CREATE permission for restoration
    if (tabType === 'rejected_discount') {
      hasPermission = canRestoreInRejectedDiscountTab; // Uses CREATE permission
    } else if (tabType === 'cancelled') {
      hasPermission = canRestoreInCancelledBookingTab; // Uses CREATE permission
    } else if (tabType === 'rejected_cancelled') {
      hasPermission = canRestoreInRejectedCancelledBookingTab; // Uses CREATE permission
    }
    
    if (!hasPermission) {
      showError('You do not have permission to restore bookings in this tab');
      return;
    }
    
    setSelectedRestoreBooking(bookingId);
    setRestoreType(type);
    setRestoreReason('');
    setRestoreNotes('');
    setRestoreBookingModal(true);
  };

  const handleRestoreBooking = async () => {
    if (!selectedRestoreBooking) return;

    try {
      setRestoreLoading(true);
      
      const payload = {
        reason: restoreReason.trim() || undefined,
        notes: restoreNotes.trim() || undefined
      };

      let apiUrl = '';
      
      if (restoreType === 'cancelled') {
        apiUrl = `/bookings/${selectedRestoreBooking}/restore`;
      } else if (restoreType === 'rejected_discount') {
        apiUrl = `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
      }

      await axiosInstance.put(apiUrl, payload);
      
      showSuccess('Booking restored successfully!');
      setRestoreBookingModal(false);
      setSelectedRestoreBooking(null);
      setRestoreReason('');
      setRestoreNotes('');
      
      await fetchAllData();
      
    } catch (error) {
      console.error('Error restoring booking:', error);
      showError(error.response?.data?.message || 'Failed to restore booking');
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleApproveCancellation = (cancellation) => {
    if (!canApproveCancellation) {
      showError('You do not have permission to approve cancellations in Cancelled Booking tab');
      return;
    }
    
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('APPROVE');
    setEditedReason(cancellation.cancellationRequest?.reason || '');
    setCancellationCharges(cancellation.cancellationRequest?.cancellationCharges || 0);
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleRejectCancellation = (cancellation) => {
    if (!canRejectCancellation) {
      showError('You do not have permission to reject cancellations in Cancelled Booking tab');
      return;
    }
    
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('REJECT');
    setRejectionReason('');
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Early return if no view permission for any tab
  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any Subdealer Management tabs.
      </div>
    );
  }

  const renderManagementTable = (records, tabIndex) => {
    // Check if user has permission to view this specific tab
    const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
    // If user doesn't have VIEW permission for this tab, show message
    if (!canViewCurrentTab) {
      const tabNames = [
        "REJECTED DISCOUNT",
        "CANCELLED BOOKING", 
        "REJECTED CANCELLED BOOKING"
      ];
      
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the {tabNames[tabIndex]} tab.
          </CAlert>
        </div>
      );
    }
    
    const isRejectedDiscountTab = tabIndex === 0;
    const isCancelledBookingTab = tabIndex === 1;
    const isRejectedCancelledBookingTab = tabIndex === 2;
    
    // Determine which actions are allowed based on the tab
    const showCancelOptionsColumn = isCancelledBookingTab && 
                                    (canApproveCancellation || canRejectCancellation);
    
    const showRestoreActionsColumn = 
      (isRejectedDiscountTab && canRestoreInRejectedDiscountTab) || 
      (isCancelledBookingTab && canRestoreInCancelledBookingTab) ||
      (isRejectedCancelledBookingTab && canRestoreInRejectedCancelledBookingTab);
    
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
              {isCancelledBookingTab || isRejectedCancelledBookingTab ? (
                <>
                  <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
                </>
              ) : (
                <>
                  <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                </>
              )}
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              {isRejectedCancelledBookingTab && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
              {showCancelOptionsColumn && <CTableHeaderCell scope="col">Options</CTableHeaderCell>}
              {showRestoreActionsColumn && <CTableHeaderCell scope="col">Actions</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {records.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={
                  5 + // Base columns
                  (isCancelledBookingTab || isRejectedCancelledBookingTab ? 5 : 4) + // Additional columns based on tab
                  (isRejectedCancelledBookingTab ? 1 : 0) + // Rejection reason column
                  (showCancelOptionsColumn ? 1 : 0) + // Cancel options column
                  (showRestoreActionsColumn ? 1 : 0) // Restore actions column
                } style={{ color: 'red', textAlign: 'center' }}>
                  {isSubdealer ? (
                    isRejectedDiscountTab ? 'No rejected discount bookings available for your account' : 
                    isCancelledBookingTab ? 'No cancellation requests available for your account' : 
                    'No rejected cancellation requests available for your account'
                  ) : (
                    isRejectedDiscountTab ? 'No rejected discount bookings available' : 
                    isCancelledBookingTab ? 'No cancellation requests available' : 
                    'No rejected cancellation requests available'
                  )}
                </CTableDataCell>
              </CTableRow>
            ) : (
              records.map((record, index) => {
                if (isCancelledBookingTab || isRejectedCancelledBookingTab) {
                  // Cancellation records
                  const cancellation = record;
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
                      <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
                      <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
                          {cancellation.cancellationRequest?.status || 'N/A'}
                        </span>
                      </CTableDataCell>
                      {isRejectedCancelledBookingTab && (
                        <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
                      )}
                      {showCancelOptionsColumn && (
                        <CTableDataCell>
                          <div className="d-flex">
                            {canApproveCancellation && (
                              <CButton
                                size="sm"
                                className="me-2"
                                color="success"
                                onClick={() => handleApproveCancellation(cancellation)}
                              >
                                <CIcon icon={cilCheck} /> Approve
                              </CButton>
                            )}
                            {canRejectCancellation && (
                              <CButton
                                size="sm"
                                color="danger"
                                onClick={() => handleRejectCancellation(cancellation)}
                              >
                                <CIcon icon={cilX} /> Reject
                              </CButton>
                            )}
                          </div>
                        </CTableDataCell>
                      )}
                      {showRestoreActionsColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => handleOpenRestoreModal(
                              cancellation._id, 
                              'cancelled', 
                              isCancelledBookingTab ? 'cancelled' : 'rejected_cancelled'
                            )}
                            disabled={!canRestoreInCancelledBookingTab && !canRestoreInRejectedCancelledBookingTab}
                          >
                            Back to Normal
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                } else {
                  // Rejected discount booking records
                  const booking = record;
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails.mobile1 || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
                      <CTableDataCell>{booking.model.type}</CTableDataCell>
                      <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                      <CTableDataCell>
                        <span 
                          className="status-badge" 
                          style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block'
                          }}
                        >
                          {booking.status}
                        </span>
                      </CTableDataCell>
                      {showRestoreActionsColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="primary"
                            onClick={() => handleOpenRestoreModal(booking._id, 'rejected_discount', 'rejected_discount')}
                            disabled={!canRestoreInRejectedDiscountTab}
                          >
                            Back to Normal
                          </CButton>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                }
              })
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Subdealer Management</div>
      {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
    
      <CCard className='table-container mt-4'>
        <CCardBody>
          
          <CNav variant="tabs" className="mb-3 border-bottom">
            {/* Only show tabs that user has permission to view */}
            {canViewRejectedDiscountTab && (
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
                  Rejected Discount
                </CNavLink>
              </CNavItem>
            )}
            
            {canViewCancelledBookingTab && (
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
                  Cancelled Booking
                </CNavLink>
              </CNavItem>
            )}
            
            {canViewRejectedCancelledBookingTab && (
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
                  Rejected Cancelled Booking
                </CNavLink>
              </CNavItem>
            )}
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              {canViewAnyTab && (
                <>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (activeTab === 0) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
                      else if (activeTab === 1) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
                      else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
                    }}
                  />
                </>
              )}
            </div>
          </div>

          <CTabContent>
            {canViewRejectedDiscountTab && (
              <CTabPane visible={activeTab === 0}>
                {renderManagementTable(rejectedRecords, 0)}
              </CTabPane>
            )}
            
            {canViewCancelledBookingTab && (
              <CTabPane visible={activeTab === 1}>
                {cancelledLoading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <CSpinner color="primary" />
                  </div>
                ) : (
                  renderManagementTable(cancelledPendingRecords, 1)
                )}
              </CTabPane>
            )}
            
            {canViewRejectedCancelledBookingTab && (
              <CTabPane visible={activeTab === 2}>
                {cancelledLoading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <CSpinner color="primary" />
                  </div>
                ) : (
                  renderManagementTable(cancelledRejectedRecords, 2)
                )}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Restore Booking Modal */}
      <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon className="me-2" />
            Restore Booking to Normal
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Reason:</CFormLabel>
            <CFormTextarea
              value={restoreReason}
              onChange={(e) => setRestoreReason(e.target.value)}
              rows={2}
              placeholder="Enter reason for restoring booking"
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Notes (Optional):</CFormLabel>
            <CFormTextarea
              value={restoreNotes}
              onChange={(e) => setRestoreNotes(e.target.value)}
              rows={2}
              placeholder="Enter any additional notes"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleRestoreBooking}
            disabled={restoreLoading}
          >
            {restoreLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Restore Booking'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Cancellation Approval Modal */}
      <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation Request' : 'Reject Cancellation Request'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {cancelApprovalAction === 'APPROVE' ? (
            <>
              <div className="mb-3">
                <CFormLabel>Original Reason:</CFormLabel>
                <CFormInput
                  type="text"
                  value={selectedCancellationForApproval?.cancellationRequest?.reason || ''}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Edited Reason (Optional):</CFormLabel>
                <CFormTextarea
                  value={editedReason}
                  onChange={(e) => setEditedReason(e.target.value)}
                  rows={2}
                  placeholder="Enter edited reason if needed"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Cancellation Charges:</CFormLabel>
                <CFormInput
                  type="number"
                  value={cancellationCharges}
                  onChange={(e) => setCancellationCharges(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Notes (Optional):</CFormLabel>
                <CFormTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter any additional notes"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <CFormLabel>Rejection Reason:</CFormLabel>
                <CFormTextarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                  placeholder="Enter reason for rejection"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Notes (Optional):</CFormLabel>
                <CFormTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter any additional notes"
                />
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
            onClick={handleCancelActionSubmit}
            disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}
          >
            {cancelActionLoading ? (
              <CSpinner size="sm" />
            ) : (
              cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default SubdealerManagement;





















