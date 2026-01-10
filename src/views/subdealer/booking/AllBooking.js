// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCloudUpload, 
//   cilPrint, 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash, 
//   cilZoomOut, 
//   cilCheck, 
//   cilX, 
//   cilCheckCircle, 
//   cilXCircle,
//   cilFile,
// } from '@coreui/icons';
// import config from 'src/config.js';
// import KYCView from 'src/views/sales/booking/KYCView';
// import FinanceView from 'src/views/sales/booking/FinanceView';
// import ViewBooking from 'src/views/sales/booking/BookingDetails';
// import SubDealerChassisNumberModal from './SubdealerChassisModel';
// import PrintModal from 'src/views/sales/booking/PrintFinance.js';
// import PendingUpdateDetailsModal from 'src/views/sales/booking/ViewPendingUpdates.js';
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
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from 'src/utils/modulePermissions';

// const AllBooking = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);

//   // Data states for each tab
//   const [allData, setAllData] = useState([]);
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
  
//   const { permissions } = useAuth();
//   const userRole = localStorage.getItem('userRole') || '';
  
//   // Page-level permission checks for Subdealer Booking - All Booking page
//   const hasViewPermission = canViewPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasCreatePermission = canCreateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasUpdatePermission = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasDeletePermission = canDeleteInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  
//   // Check specific actions for chassis allocation (using CREATE permission)
//   const hasChassisAllocatePermission = hasCreatePermission;
  
//   // Check for chassis approval permission (using CREATE permission for approve, DELETE for reject)
//   const hasChassisApprovePermission = hasCreatePermission; // Approving chassis is a CREATE action
//   const hasChassisRejectPermission = hasDeletePermission; // Rejecting chassis is a DELETE action
  
//   // Check for document management permission (using CREATE permission)
//   const hasDocumentManagePermission = hasCreatePermission;

//   // Permission for viewing finance documents (using VIEW permission)
//   const hasFinanceViewPermission = hasViewPermission;

//   // Permission for viewing KYC documents (using VIEW permission)
//   const hasKYCViewPermission = hasViewPermission;

//   // Permission for printing documents (using VIEW permission)
//   const hasPrintPermission = hasViewPermission;

//   useEffect(() => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view Subdealer Bookings');
//       return;
//     }
//     fetchAllData();
//   }, [hasViewPermission]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await fetchData();
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings?bookingType=SUBDEALER`);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setAllData(subdealerBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = subdealerBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = subdealerBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = subdealerBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = subdealerBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!hasDocumentManagePermission) {
//       showError('You do not have permission to manage documents');
//       return;
//     }
    
//     try {
//       setLoadingTemplates(true);
//       setSelectedBookingForDocs(bookingId);
      
//       const response = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(response.data.data);
//       setAvailableDocsModal(true);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error fetching available templates:', error);
//       showError('Failed to fetch available documents');
//     } finally {
//       setLoadingTemplates(false);
//     }
//     handleClose();
//   };

//   const handleTemplateSelection = (templateId, canDownload) => {
//     if (!canDownload) return;
    
//     setSelectedTemplateIds(prev => {
//       if (prev.includes(templateId)) {
//         return prev.filter(id => id !== templateId);
//       } else {
//         return [...prev, templateId];
//       }
//     });
//   };

//   const handleSelectAllAvailable = () => {
//     if (availableTemplates?.available_templates?.templates) {
//       const allAvailableIds = availableTemplates.available_templates.templates
//         .filter(template => template.can_download)
//         .map(template => template.template_id);
//       setSelectedTemplateIds(allAvailableIds);
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedTemplateIds([]);
//   };

//   const handleSubmitTemplateSelection = async () => {
//     if (!selectedBookingForDocs || selectedTemplateIds.length === 0) {
//       showError('Please select at least one template');
//       return;
//     }

//     try {
//       setSubmittingSelection(true);
      
//       const payload = {
//         bookingId: selectedBookingForDocs,
//         templateIds: selectedTemplateIds,
//         notes: templateNotes.trim() || undefined
//       };

//       await axiosInstance.post('/booking-templates/select', payload);
      
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false);
//       setSelectedBookingForDocs(null);
//       setAvailableTemplates(null);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error selecting templates:', error);
//       showError(error.response?.data?.message || 'Failed to select templates');
//     } finally {
//       setSubmittingSelection(false);
//     }
//   };

//   const handleApproveChassis = (bookingId) => {
//     if (!hasChassisApprovePermission) {
//       showError('You do not have permission to approve chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     if (!hasChassisRejectPermission) {
//       showError('You do not have permission to reject chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewBooking = async (id) => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view booking details');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     if (!hasPrintPermission) {
//       showError('You do not have permission to print documents');
//       return;
//     }
    
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!hasKYCViewPermission) {
//       showError('You do not have permission to view KYC documents');
//       return;
//     }
    
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//         bookingType: 'SUBDEALER'
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!hasFinanceViewPermission) {
//       showError('You do not have permission to view finance letters');
//       return;
//     }
    
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         bookingId: booking._id,
//         bookingType: 'SUBDEALER'
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to update chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to allocate chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       const queryParams = [];
      
//       if (isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }
    
//       if (!isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }

//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);

//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
      
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       const response = await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(response.data.message);
      
//       await fetchAllData();
      
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//       setSelectedBookingForChassis(null);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to approve updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to reject updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!hasDeletePermission) {
//       showError('You do not have permission to delete bookings');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         showSuccess('Booking deleted successfully');
        
//         await fetchAllData();
        
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
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
//         You do not have permission to view Subdealer Bookings.
//       </div>
//     );
//   }

//   const renderBookingTable = (records, tabIndex) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex !== 2 && hasPrintPermission && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                   No subdealer bookings available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                   {tabIndex !== 2 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || booking.model?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.model?.type || ''}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <>
//                           {booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus?.financeLetter?.status === 'REJECTED' ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                               {booking.documentStatus?.financeLetter?.status || ''}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && (
//                     <CTableDataCell>
//                       {booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                         <Link
//                           to={`/upload-kyc/${booking.id}`}
//                           state={{
//                             bookingId: booking.id,
//                             customerName: booking.customerDetails?.name || '',
//                             address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                             bookingType: 'SUBDEALER'
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <div className="d-flex align-items-center">
//                           <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                             {booking.documentStatus?.kyc?.status || ''}
//                           </span>
//                           {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                             <Link
//                               to={`/upload-kyc/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                               className="ms-2"
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           )}
//                         </div>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>
//                     <span 
//                       className="status-badge" 
//                       style={{
//                         backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                         booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                         booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                         booking.status === 'APPROVED' ? '#198754' : 
//                                         booking.status === 'REJECTED' ? '#dc3545' : 
//                                         booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                         booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px',
//                         borderRadius: '12px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         display: 'inline-block'
//                       }}
//                     >
//                       {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                     </span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                       <span className={`status-text ${booking.status}`}>
//                         {booking.claimDetails?.hasClaim ? (
//                           <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                         ) : (
//                           <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                         )}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && hasPrintPermission && (
//                     <CTableDataCell>
//                       {booking.formPath && (
//                         <>
//                           {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilPrint} />
//                               </CButton>
//                             </a>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.note || ''}</CTableDataCell>}
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={(event) => handleClick(event, booking.id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     <Menu 
//                       id={`action-menu-${booking.id}`} 
//                       anchorEl={anchorEl} 
//                       open={menuId === booking.id} 
//                       onClose={handleClose}
//                     >
//                       <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                         <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                       </MenuItem>
//                       {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
//                         <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                         </MenuItem>
//                       )}

//                       {hasUpdatePermission && (
//                         <>
//                           {tabIndex !== 2 && tabIndex !== 3 && booking.status !== 'FREEZZED' && (
//                             <Link className="Link" to={`/update-subdealer-booking/${booking.id}`} style={{ textDecoration: 'none' }}>
//                               <MenuItem style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             </Link>
//                           )}
//                         </>
//                       )}

//                       {hasDeletePermission && (
//                         <>
//                           {(tabIndex === 0) && (
//                             <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && hasFinanceViewPermission && (
//                         <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                         </MenuItem>
//                       )}

//                       {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && hasKYCViewPermission && (
//                         <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                         </MenuItem>
//                       )}

//                       {hasChassisAllocatePermission && (
//                         <>
//                           {tabIndex === 1 &&
//                             booking.status === 'APPROVED' &&
//                             (booking.payment?.type === 'CASH' ||
//                               (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                               <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                               </MenuItem>
//                             )}
//                           {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                             <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Update Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {hasChassisApprovePermission && hasChassisRejectPermission && tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                         <>
//                           {hasChassisApprovePermission && (
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                           )}
//                           {hasChassisRejectPermission && (
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {tabIndex === 1 && booking.status === 'APPROVED' && hasDocumentManagePermission && (
//                         <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilFile} className="me-2" /> Available Documents
//                         </MenuItem>
//                       )}
                      
//                       {tabIndex === 0 && booking.status === 'FREEZZED' && hasUpdatePermission && (
//                         <MenuItem 
//                           onClick={() => window.location.href = '/#/self-insurance'} 
//                           style={{ color: 'black' }}
//                         >
//                           <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
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
//       <div className='title'>Subdealers Booking</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/subdealer-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
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
//                 Pending Approvals
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
//                 Approved
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
//                 Pending Allocated
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 3}
//                 onClick={() => handleTabChange(3)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Allocated
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
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderBookingTable(pendingRecords, 0)}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderBookingTable(approvedRecords, 1)}
//             </CTabPane>
//             <CTabPane visible={activeTab === 2}>
//               {renderBookingTable(pendingAllocatedRecords, 2)}
//             </CTabPane>
//             <CTabPane visible={activeTab === 3}>
//               {renderBookingTable(allocatedRecords, 3)}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Available Documents Modal */}
//       <CModal 
//         visible={availableDocsModal} 
//         onClose={() => {
//           setAvailableDocsModal(false);
//           setSelectedBookingForDocs(null);
//           setAvailableTemplates(null);
//           setSelectedTemplateIds([]);
//           setTemplateNotes('');
//         }}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Available Documents - {availableTemplates?.booking_number || ''}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading available documents...</p>
//             </div>
//           ) : availableTemplates ? (
//             <div>
//               <div className="mb-3">
//                 <h6>Customer: {availableTemplates.customer_name}</h6>
//                 <div className="alert alert-info mb-3">
//                   <small>
//                     <strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} templates are available for download.
//                   </small>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Available Templates ({availableTemplates.available_templates.count})</h6>
//                   <div className="d-flex gap-2">
//                     <CButton 
//                       size="sm" 
//                       color="primary" 
//                       variant="outline"
//                       onClick={handleSelectAllAvailable}
//                       disabled={!availableTemplates?.available_templates?.templates?.length}
//                     >
//                       Select All
//                     </CButton>
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       variant="outline"
//                       onClick={handleClearSelection}
//                     >
//                       Clear All
//                     </CButton>
//                   </div>
//                 </div>
                
//                 {availableTemplates.available_templates.templates.length > 0 ? (
//                   <div className="border rounded p-3">
//                     {availableTemplates.available_templates.templates.map((template) => (
//                       <div key={template.template_id} className="mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`template-${template.template_id}`}
//                             checked={selectedTemplateIds.includes(template.template_id)}
//                             onChange={() => handleTemplateSelection(template.template_id, template.can_download)}
//                             disabled={!template.can_download}
//                           />
//                           <label 
//                             className="form-check-label d-flex justify-content-between align-items-center w-100"
//                             htmlFor={`template-${template.template_id}`}
//                             style={{ cursor: template.can_download ? 'pointer' : 'not-allowed', opacity: template.can_download ? 1 : 0.6 }}
//                           >
//                             <div>
//                               <strong>{template.template_name}</strong>
//                               <br />
//                               <small className="text-muted">
//                                 {template.can_download ? 'Available for download' : 'Not available for download'}
//                               </small>
//                             </div>
//                             {!template.can_download && (
//                               <small className="text-danger">
//                                 <CIcon icon={cilXCircle} className="me-1" />
//                                 Disabled
//                               </small>
//                             )}
//                           </label>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-3 border rounded">
//                     <CIcon icon={cilFile} size="lg" className="text-muted mb-2" />
//                     <p className="text-muted mb-0">No templates available for download</p>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <CFormLabel>Notes (Optional):</CFormLabel>
//                   <CFormTextarea
//                     value={templateNotes}
//                     onChange={(e) => setTemplateNotes(e.target.value)}
//                     rows={2}
//                     placeholder="Add any notes about the selected templates..."
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setAvailableDocsModal(false);
//               setSelectedBookingForDocs(null);
//               setAvailableTemplates(null);
//               setSelectedTemplateIds([]);
//               setTemplateNotes('');
//             }}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary"
//             onClick={handleSubmitTemplateSelection}
//             disabled={selectedTemplateIds.length === 0 || submittingSelection}
//           >
//             {submittingSelection ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               `Select (${selectedTemplateIds.length}) Templates`
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking 
//         open={viewModalVisible} 
//         onClose={() => setViewModalVisible(false)} 
//         booking={selectedBooking} 
//         refreshData={fetchAllData}
//       />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchAllData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchAllData}
//         bookingId={financeBookingId}
//       />
//       <SubDealerChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//         bookingType="SUBDEALER"
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default AllBooking;






// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCloudUpload, 
//   cilPrint, 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash, 
//   cilZoomOut, 
//   cilCheck, 
//   cilX, 
//   cilCheckCircle, 
//   cilXCircle,
//   cilFile,
// } from '@coreui/icons';
// import config from 'src/config.js';
// import KYCView from 'src/views/sales/booking/KYCView';
// import FinanceView from 'src/views/sales/booking/FinanceView';
// import ViewBooking from 'src/views/sales/booking/BookingDetails';
// import SubDealerChassisNumberModal from './SubdealerChassisModel';
// import PrintModal from 'src/views/sales/booking/PrintFinance.js';
// import PendingUpdateDetailsModal from 'src/views/sales/booking/ViewPendingUpdates.js';
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
//   TABS, // Add TABS import
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from 'src/utils/modulePermissions';

// const AllBooking = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);

//   // Data states for each tab
//   const [allData, setAllData] = useState([]);
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
  
//   const { permissions } = useAuth();
//   const userRole = localStorage.getItem('userRole') || '';
  
//   // Page-level permission checks for Subdealer Booking - All Booking page
//   const hasViewPermission = canViewPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasCreatePermission = canCreateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasUpdatePermission = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasDeletePermission = canDeleteInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  
//   // Tab-level VIEW permission checks
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_APPROVALS // Assuming this constant exists in TABS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.APPROVED // Assuming this constant exists in TABS
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED // Assuming this constant exists in TABS
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.ALLOCATED // Assuming this constant exists in TABS
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewPendingApprovalsTab) availableTabs.push(0);
//     if (canViewApprovedTab) availableTabs.push(1);
//     if (canViewPendingAllocatedTab) availableTabs.push(2);
//     if (canViewAllocatedTab) availableTabs.push(3);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, canViewAllocatedTab, activeTab]);

//   // Check specific actions for chassis allocation (using CREATE permission)
//   const hasChassisAllocatePermission = hasCreatePermission;
  
//   // Check for chassis approval permission (using CREATE permission for approve, DELETE for reject)
//   const hasChassisApprovePermission = hasCreatePermission; // Approving chassis is a CREATE action
//   const hasChassisRejectPermission = hasDeletePermission; // Rejecting chassis is a DELETE action
  
//   // Check for document management permission (using CREATE permission)
//   const hasDocumentManagePermission = hasCreatePermission;

//   // Permission for viewing finance documents (using VIEW permission)
//   const hasFinanceViewPermission = hasViewPermission;

//   // Permission for viewing KYC documents (using VIEW permission)
//   const hasKYCViewPermission = hasViewPermission;

//   // Permission for printing documents (using VIEW permission)
//   const hasPrintPermission = hasViewPermission;

//   useEffect(() => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view Subdealer Bookings');
//       return;
//     }
//     fetchAllData();
//   }, [hasViewPermission]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await fetchData();
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axiosInstance.get(`/bookings?bookingType=SUBDEALER`);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setAllData(subdealerBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = subdealerBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = subdealerBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = subdealerBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = subdealerBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!hasDocumentManagePermission) {
//       showError('You do not have permission to manage documents');
//       return;
//     }
    
//     try {
//       setLoadingTemplates(true);
//       setSelectedBookingForDocs(bookingId);
      
//       const response = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(response.data.data);
//       setAvailableDocsModal(true);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error fetching available templates:', error);
//       showError('Failed to fetch available documents');
//     } finally {
//       setLoadingTemplates(false);
//     }
//     handleClose();
//   };

//   const handleTemplateSelection = (templateId, canDownload) => {
//     if (!canDownload) return;
    
//     setSelectedTemplateIds(prev => {
//       if (prev.includes(templateId)) {
//         return prev.filter(id => id !== templateId);
//       } else {
//         return [...prev, templateId];
//       }
//     });
//   };

//   const handleSelectAllAvailable = () => {
//     if (availableTemplates?.available_templates?.templates) {
//       const allAvailableIds = availableTemplates.available_templates.templates
//         .filter(template => template.can_download)
//         .map(template => template.template_id);
//       setSelectedTemplateIds(allAvailableIds);
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedTemplateIds([]);
//   };

//   const handleSubmitTemplateSelection = async () => {
//     if (!selectedBookingForDocs || selectedTemplateIds.length === 0) {
//       showError('Please select at least one template');
//       return;
//     }

//     try {
//       setSubmittingSelection(true);
      
//       const payload = {
//         bookingId: selectedBookingForDocs,
//         templateIds: selectedTemplateIds,
//         notes: templateNotes.trim() || undefined
//       };

//       await axiosInstance.post('/booking-templates/select', payload);
      
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false);
//       setSelectedBookingForDocs(null);
//       setAvailableTemplates(null);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error selecting templates:', error);
//       showError(error.response?.data?.message || 'Failed to select templates');
//     } finally {
//       setSubmittingSelection(false);
//     }
//   };

//   const handleApproveChassis = (bookingId) => {
//     if (!hasChassisApprovePermission) {
//       showError('You do not have permission to approve chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     if (!hasChassisRejectPermission) {
//       showError('You do not have permission to reject chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewBooking = async (id) => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view booking details');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     if (!hasPrintPermission) {
//       showError('You do not have permission to print documents');
//       return;
//     }
    
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!hasKYCViewPermission) {
//       showError('You do not have permission to view KYC documents');
//       return;
//     }
    
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//         bookingType: 'SUBDEALER'
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!hasFinanceViewPermission) {
//       showError('You do not have permission to view finance letters');
//       return;
//     }
    
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         bookingId: booking._id,
//         bookingType: 'SUBDEALER'
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to update chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to allocate chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       const queryParams = [];
      
//       if (isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }
    
//       if (!isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }

//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);

//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
      
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       const response = await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(response.data.message);
      
//       await fetchAllData();
      
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//       setSelectedBookingForChassis(null);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to approve updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to reject updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!hasDeletePermission) {
//       showError('You do not have permission to delete bookings');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         showSuccess('Booking deleted successfully');
        
//         await fetchAllData();
        
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
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
//         You do not have permission to view Subdealer Bookings.
//       </div>
//     );
//   }

//   const renderBookingTable = (records, tabIndex) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex !== 2 && hasPrintPermission && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                   No subdealer bookings available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                   {tabIndex !== 2 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || booking.model?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.model?.type || ''}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <>
//                           {booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus?.financeLetter?.status === 'REJECTED' ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                               {booking.documentStatus?.financeLetter?.status || ''}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && (
//                     <CTableDataCell>
//                       {booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                         <Link
//                           to={`/upload-kyc/${booking.id}`}
//                           state={{
//                             bookingId: booking.id,
//                             customerName: booking.customerDetails?.name || '',
//                             address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                             bookingType: 'SUBDEALER'
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <div className="d-flex align-items-center">
//                           <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                             {booking.documentStatus?.kyc?.status || ''}
//                           </span>
//                           {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                             <Link
//                               to={`/upload-kyc/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                               className="ms-2"
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           )}
//                         </div>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>
//                     <span 
//                       className="status-badge" 
//                       style={{
//                         backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                         booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                         booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                         booking.status === 'APPROVED' ? '#198754' : 
//                                         booking.status === 'REJECTED' ? '#dc3545' : 
//                                         booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                         booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px',
//                         borderRadius: '12px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         display: 'inline-block'
//                       }}
//                     >
//                       {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                     </span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                       <span className={`status-text ${booking.status}`}>
//                         {booking.claimDetails?.hasClaim ? (
//                           <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                         ) : (
//                           <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                         )}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && hasPrintPermission && (
//                     <CTableDataCell>
//                       {booking.formPath && (
//                         <>
//                           {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilPrint} />
//                               </CButton>
//                             </a>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.note || ''}</CTableDataCell>}
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={(event) => handleClick(event, booking.id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     <Menu 
//                       id={`action-menu-${booking.id}`} 
//                       anchorEl={anchorEl} 
//                       open={menuId === booking.id} 
//                       onClose={handleClose}
//                     >
//                       <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                         <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                       </MenuItem>
//                       {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
//                         <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                         </MenuItem>
//                       )}

//                       {hasUpdatePermission && (
//                         <>
//                           {tabIndex !== 2 && tabIndex !== 3 && booking.status !== 'FREEZZED' && (
//                             <Link className="Link" to={`/update-subdealer-booking/${booking.id}`} style={{ textDecoration: 'none' }}>
//                               <MenuItem style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             </Link>
//                           )}
//                         </>
//                       )}

//                       {hasDeletePermission && (
//                         <>
//                           {(tabIndex === 0) && (
//                             <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && hasFinanceViewPermission && (
//                         <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                         </MenuItem>
//                       )}

//                       {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && hasKYCViewPermission && (
//                         <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                         </MenuItem>
//                       )}

//                       {hasChassisAllocatePermission && (
//                         <>
//                           {tabIndex === 1 &&
//                             booking.status === 'APPROVED' &&
//                             (booking.payment?.type === 'CASH' ||
//                               (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                               <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                               </MenuItem>
//                             )}
//                           {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                             <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Update Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {hasChassisApprovePermission && hasChassisRejectPermission && tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                         <>
//                           {hasChassisApprovePermission && (
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                           )}
//                           {hasChassisRejectPermission && (
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {tabIndex === 1 && booking.status === 'APPROVED' && hasDocumentManagePermission && (
//                         <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilFile} className="me-2" /> Available Documents
//                         </MenuItem>
//                       )}
                      
//                       {tabIndex === 0 && booking.status === 'FREEZZED' && hasUpdatePermission && (
//                         <MenuItem 
//                           onClick={() => window.location.href = '/#/self-insurance'} 
//                           style={{ color: 'black' }}
//                         >
//                           <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
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
//       <div className='title'>Subdealers Booking</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/subdealer-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
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
//                   Pending Approvals
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
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
//                   Approved
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
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
//                   Pending Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 3}
//                   onClick={() => handleTabChange(3)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
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
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             {/* Only render Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderBookingTable(pendingRecords, 0)}
//               </CTabPane>
//             )}
//             {/* Only render Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
//               <CTabPane visible={activeTab === 1}>
//                 {renderBookingTable(approvedRecords, 1)}
//               </CTabPane>
//             )}
//             {/* Only render Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
//               <CTabPane visible={activeTab === 2}>
//                 {renderBookingTable(pendingAllocatedRecords, 2)}
//               </CTabPane>
//             )}
//             {/* Only render Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CTabPane visible={activeTab === 3}>
//                 {renderBookingTable(allocatedRecords, 3)}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Available Documents Modal */}
//       <CModal 
//         visible={availableDocsModal} 
//         onClose={() => {
//           setAvailableDocsModal(false);
//           setSelectedBookingForDocs(null);
//           setAvailableTemplates(null);
//           setSelectedTemplateIds([]);
//           setTemplateNotes('');
//         }}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Available Documents - {availableTemplates?.booking_number || ''}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading available documents...</p>
//             </div>
//           ) : availableTemplates ? (
//             <div>
//               <div className="mb-3">
//                 <h6>Customer: {availableTemplates.customer_name}</h6>
//                 <div className="alert alert-info mb-3">
//                   <small>
//                     <strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} templates are available for download.
//                   </small>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Available Templates ({availableTemplates.available_templates.count})</h6>
//                   <div className="d-flex gap-2">
//                     <CButton 
//                       size="sm" 
//                       color="primary" 
//                       variant="outline"
//                       onClick={handleSelectAllAvailable}
//                       disabled={!availableTemplates?.available_templates?.templates?.length}
//                     >
//                       Select All
//                     </CButton>
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       variant="outline"
//                       onClick={handleClearSelection}
//                     >
//                       Clear All
//                     </CButton>
//                   </div>
//                 </div>
                
//                 {availableTemplates.available_templates.templates.length > 0 ? (
//                   <div className="border rounded p-3">
//                     {availableTemplates.available_templates.templates.map((template) => (
//                       <div key={template.template_id} className="mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`template-${template.template_id}`}
//                             checked={selectedTemplateIds.includes(template.template_id)}
//                             onChange={() => handleTemplateSelection(template.template_id, template.can_download)}
//                             disabled={!template.can_download}
//                           />
//                           <label 
//                             className="form-check-label d-flex justify-content-between align-items-center w-100"
//                             htmlFor={`template-${template.template_id}`}
//                             style={{ cursor: template.can_download ? 'pointer' : 'not-allowed', opacity: template.can_download ? 1 : 0.6 }}
//                           >
//                             <div>
//                               <strong>{template.template_name}</strong>
//                               <br />
//                               <small className="text-muted">
//                                 {template.can_download ? 'Available for download' : 'Not available for download'}
//                               </small>
//                             </div>
//                             {!template.can_download && (
//                               <small className="text-danger">
//                                 <CIcon icon={cilXCircle} className="me-1" />
//                                 Disabled
//                               </small>
//                             )}
//                           </label>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-3 border rounded">
//                     <CIcon icon={cilFile} size="lg" className="text-muted mb-2" />
//                     <p className="text-muted mb-0">No templates available for download</p>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <CFormLabel>Notes (Optional):</CFormLabel>
//                   <CFormTextarea
//                     value={templateNotes}
//                     onChange={(e) => setTemplateNotes(e.target.value)}
//                     rows={2}
//                     placeholder="Add any notes about the selected templates..."
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setAvailableDocsModal(false);
//               setSelectedBookingForDocs(null);
//               setAvailableTemplates(null);
//               setSelectedTemplateIds([]);
//               setTemplateNotes('');
//             }}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary"
//             onClick={handleSubmitTemplateSelection}
//             disabled={selectedTemplateIds.length === 0 || submittingSelection}
//           >
//             {submittingSelection ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               `Select (${selectedTemplateIds.length}) Templates`
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking 
//         open={viewModalVisible} 
//         onClose={() => setViewModalVisible(false)} 
//         booking={selectedBooking} 
//         refreshData={fetchAllData}
//       />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchAllData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchAllData}
//         bookingId={financeBookingId}
//       />
//       <SubDealerChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//         bookingType="SUBDEALER"
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default AllBooking;








// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCloudUpload, 
//   cilPrint, 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash, 
//   cilZoomOut, 
//   cilCheck, 
//   cilX, 
//   cilCheckCircle, 
//   cilXCircle,
//   cilFile,
// } from '@coreui/icons';
// import config from 'src/config.js';
// import KYCView from 'src/views/sales/booking/KYCView';
// import FinanceView from 'src/views/sales/booking/FinanceView';
// import ViewBooking from 'src/views/sales/booking/BookingDetails';
// import SubDealerChassisNumberModal from './SubdealerChassisModel';
// import PrintModal from 'src/views/sales/booking/PrintFinance.js';
// import PendingUpdateDetailsModal from 'src/views/sales/booking/ViewPendingUpdates.js';
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
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from 'src/utils/modulePermissions';

// const AllBooking = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);

//   // Data states for each tab
//   const [allData, setAllData] = useState([]);
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
  
//   const { permissions, user: authUser } = useAuth();
  
//   // Check if user has SUBDEALER role
//   const isSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   const userRole = localStorage.getItem('userRole') || '';
  
//   // Page-level permission checks for Subdealer Booking - All Booking page
//   const hasViewPermission = canViewPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasCreatePermission = canCreateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasUpdatePermission = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasDeletePermission = canDeleteInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  
//   // Tab-level VIEW permission checks
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.ALLOCATED
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewPendingApprovalsTab) availableTabs.push(0);
//     if (canViewApprovedTab) availableTabs.push(1);
//     if (canViewPendingAllocatedTab) availableTabs.push(2);
//     if (canViewAllocatedTab) availableTabs.push(3);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, canViewAllocatedTab, activeTab]);

//   // Check specific actions for chassis allocation (using CREATE permission)
//   const hasChassisAllocatePermission = hasCreatePermission;
  
//   // Check for chassis approval permission (using CREATE permission for approve, DELETE for reject)
//   const hasChassisApprovePermission = hasCreatePermission;
//   const hasChassisRejectPermission = hasDeletePermission;
  
//   // Check for document management permission (using CREATE permission)
//   const hasDocumentManagePermission = hasCreatePermission;

//   // Permission for viewing finance documents (using VIEW permission)
//   const hasFinanceViewPermission = hasViewPermission;

//   // Permission for viewing KYC documents (using VIEW permission)
//   const hasKYCViewPermission = hasViewPermission;

//   // Permission for printing documents (using VIEW permission)
//   const hasPrintPermission = hasViewPermission;

//   useEffect(() => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view Subdealer Bookings');
//       return;
//     }
//     fetchAllData();
//   }, [hasViewPermission]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await fetchData();
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       let url = `/bookings?bookingType=SUBDEALER`;
      
//       // If user is a subdealer, filter by their subdealer ID
//       if (isSubdealer && userSubdealerId) {
//         url = `/bookings?bookingType=SUBDEALER&subdealer=${userSubdealerId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       setAllData(subdealerBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = subdealerBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = subdealerBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = subdealerBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = subdealerBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!hasDocumentManagePermission) {
//       showError('You do not have permission to manage documents');
//       return;
//     }
    
//     try {
//       setLoadingTemplates(true);
//       setSelectedBookingForDocs(bookingId);
      
//       const response = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(response.data.data);
//       setAvailableDocsModal(true);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error fetching available templates:', error);
//       showError('Failed to fetch available documents');
//     } finally {
//       setLoadingTemplates(false);
//     }
//     handleClose();
//   };

//   const handleTemplateSelection = (templateId, canDownload) => {
//     if (!canDownload) return;
    
//     setSelectedTemplateIds(prev => {
//       if (prev.includes(templateId)) {
//         return prev.filter(id => id !== templateId);
//       } else {
//         return [...prev, templateId];
//       }
//     });
//   };

//   const handleSelectAllAvailable = () => {
//     if (availableTemplates?.available_templates?.templates) {
//       const allAvailableIds = availableTemplates.available_templates.templates
//         .filter(template => template.can_download)
//         .map(template => template.template_id);
//       setSelectedTemplateIds(allAvailableIds);
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedTemplateIds([]);
//   };

//   const handleSubmitTemplateSelection = async () => {
//     if (!selectedBookingForDocs || selectedTemplateIds.length === 0) {
//       showError('Please select at least one template');
//       return;
//     }

//     try {
//       setSubmittingSelection(true);
      
//       const payload = {
//         bookingId: selectedBookingForDocs,
//         templateIds: selectedTemplateIds,
//         notes: templateNotes.trim() || undefined
//       };

//       await axiosInstance.post('/booking-templates/select', payload);
      
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false);
//       setSelectedBookingForDocs(null);
//       setAvailableTemplates(null);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error selecting templates:', error);
//       showError(error.response?.data?.message || 'Failed to select templates');
//     } finally {
//       setSubmittingSelection(false);
//     }
//   };

//   const handleApproveChassis = (bookingId) => {
//     if (!hasChassisApprovePermission) {
//       showError('You do not have permission to approve chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     if (!hasChassisRejectPermission) {
//       showError('You do not have permission to reject chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewBooking = async (id) => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view booking details');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     if (!hasPrintPermission) {
//       showError('You do not have permission to print documents');
//       return;
//     }
    
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!hasKYCViewPermission) {
//       showError('You do not have permission to view KYC documents');
//       return;
//     }
    
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//         bookingType: 'SUBDEALER'
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!hasFinanceViewPermission) {
//       showError('You do not have permission to view finance letters');
//       return;
//     }
    
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         bookingId: booking._id,
//         bookingType: 'SUBDEALER'
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to update chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to allocate chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       const queryParams = [];
      
//       if (isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }
    
//       if (!isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }

//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);

//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
      
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       const response = await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(response.data.message);
      
//       await fetchAllData();
      
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//       setSelectedBookingForChassis(null);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to approve updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to reject updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!hasDeletePermission) {
//       showError('You do not have permission to delete bookings');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         showSuccess('Booking deleted successfully');
        
//         await fetchAllData();
        
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
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
//         You do not have permission to view Subdealer Bookings.
//       </div>
//     );
//   }

//   const renderBookingTable = (records, tabIndex) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               {!isSubdealer && <CTableHeaderCell scope="col">Subdealer</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex !== 2 && hasPrintPermission && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? (isSubdealer ? 15 : 16) : (isSubdealer ? 16 : 17)} style={{ color: 'red', textAlign: 'center' }}>
//                   No subdealer bookings available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                   {tabIndex !== 2 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   {!isSubdealer && (
//                     <CTableDataCell>{booking.subdealer?.name || ''}</CTableDataCell>
//                   )}
//                   <CTableDataCell>{booking.model?.model_name || booking.model?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.model?.type || ''}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <>
//                           {booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus?.financeLetter?.status === 'REJECTED' ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                               {booking.documentStatus?.financeLetter?.status || ''}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && (
//                     <CTableDataCell>
//                       {booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                         <Link
//                           to={`/upload-kyc/${booking.id}`}
//                           state={{
//                             bookingId: booking.id,
//                             customerName: booking.customerDetails?.name || '',
//                             address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                             bookingType: 'SUBDEALER'
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <div className="d-flex align-items-center">
//                           <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                             {booking.documentStatus?.kyc?.status || ''}
//                           </span>
//                           {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                             <Link
//                               to={`/upload-kyc/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                               className="ms-2"
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           )}
//                         </div>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>
//                     <span 
//                       className="status-badge" 
//                       style={{
//                         backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                         booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                         booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                         booking.status === 'APPROVED' ? '#198754' : 
//                                         booking.status === 'REJECTED' ? '#dc3545' : 
//                                         booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                         booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px',
//                         borderRadius: '12px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         display: 'inline-block'
//                       }}
//                     >
//                       {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                     </span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                       <span className={`status-text ${booking.status}`}>
//                         {booking.claimDetails?.hasClaim ? (
//                           <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                         ) : (
//                           <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                         )}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && hasPrintPermission && (
//                     <CTableDataCell>
//                       {booking.formPath && (
//                         <>
//                           {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilPrint} />
//                               </CButton>
//                             </a>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.note || ''}</CTableDataCell>}
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={(event) => handleClick(event, booking.id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     <Menu 
//                       id={`action-menu-${booking.id}`} 
//                       anchorEl={anchorEl} 
//                       open={menuId === booking.id} 
//                       onClose={handleClose}
//                     >
//                       <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                         <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                       </MenuItem>
//                       {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
//                         <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                         </MenuItem>
//                       )}

//                       {hasUpdatePermission && (
//                         <>
//                           {tabIndex !== 2 && tabIndex !== 3 && booking.status !== 'FREEZZED' && (
//                             <Link className="Link" to={`/update-subdealer-booking/${booking.id}`} style={{ textDecoration: 'none' }}>
//                               <MenuItem style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             </Link>
//                           )}
//                         </>
//                       )}

//                       {hasDeletePermission && (
//                         <>
//                           {(tabIndex === 0) && (
//                             <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && hasFinanceViewPermission && (
//                         <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                         </MenuItem>
//                       )}

//                       {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && hasKYCViewPermission && (
//                         <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                         </MenuItem>
//                       )}

//                       {hasChassisAllocatePermission && (
//                         <>
//                           {tabIndex === 1 &&
//                             booking.status === 'APPROVED' &&
//                             (booking.payment?.type === 'CASH' ||
//                               (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                               <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                               </MenuItem>
//                             )}
//                           {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                             <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Update Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {hasChassisApprovePermission && hasChassisRejectPermission && tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                         <>
//                           {hasChassisApprovePermission && (
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                           )}
//                           {hasChassisRejectPermission && (
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {tabIndex === 1 && booking.status === 'APPROVED' && hasDocumentManagePermission && (
//                         <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilFile} className="me-2" /> Available Documents
//                         </MenuItem>
//                       )}
                      
//                       {tabIndex === 0 && booking.status === 'FREEZZED' && hasUpdatePermission && (
//                         <MenuItem 
//                           onClick={() => window.location.href = '/#/self-insurance'} 
//                           style={{ color: 'black' }}
//                         >
//                           <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
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
//       <div className='title'>Subdealers Booking</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/subdealer-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
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
//                   Pending Approvals
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
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
//                   Approved
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
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
//                   Pending Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 3}
//                   onClick={() => handleTabChange(3)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
           
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             {/* Only render Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderBookingTable(pendingRecords, 0)}
//               </CTabPane>
//             )}
//             {/* Only render Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
//               <CTabPane visible={activeTab === 1}>
//                 {renderBookingTable(approvedRecords, 1)}
//               </CTabPane>
//             )}
//             {/* Only render Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
//               <CTabPane visible={activeTab === 2}>
//                 {renderBookingTable(pendingAllocatedRecords, 2)}
//               </CTabPane>
//             )}
//             {/* Only render Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CTabPane visible={activeTab === 3}>
//                 {renderBookingTable(allocatedRecords, 3)}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Available Documents Modal */}
//       <CModal 
//         visible={availableDocsModal} 
//         onClose={() => {
//           setAvailableDocsModal(false);
//           setSelectedBookingForDocs(null);
//           setAvailableTemplates(null);
//           setSelectedTemplateIds([]);
//           setTemplateNotes('');
//         }}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Available Documents - {availableTemplates?.booking_number || ''}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading available documents...</p>
//             </div>
//           ) : availableTemplates ? (
//             <div>
//               <div className="mb-3">
//                 <h6>Customer: {availableTemplates.customer_name}</h6>
//                 <div className="alert alert-info mb-3">
//                   <small>
//                     <strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} templates are available for download.
//                   </small>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Available Templates ({availableTemplates.available_templates.count})</h6>
//                   <div className="d-flex gap-2">
//                     <CButton 
//                       size="sm" 
//                       color="primary" 
//                       variant="outline"
//                       onClick={handleSelectAllAvailable}
//                       disabled={!availableTemplates?.available_templates?.templates?.length}
//                     >
//                       Select All
//                     </CButton>
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       variant="outline"
//                       onClick={handleClearSelection}
//                     >
//                       Clear All
//                     </CButton>
//                   </div>
//                 </div>
                
//                 {availableTemplates.available_templates.templates.length > 0 ? (
//                   <div className="border rounded p-3">
//                     {availableTemplates.available_templates.templates.map((template) => (
//                       <div key={template.template_id} className="mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`template-${template.template_id}`}
//                             checked={selectedTemplateIds.includes(template.template_id)}
//                             onChange={() => handleTemplateSelection(template.template_id, template.can_download)}
//                             disabled={!template.can_download}
//                           />
//                           <label 
//                             className="form-check-label d-flex justify-content-between align-items-center w-100"
//                             htmlFor={`template-${template.template_id}`}
//                             style={{ cursor: template.can_download ? 'pointer' : 'not-allowed', opacity: template.can_download ? 1 : 0.6 }}
//                           >
//                             <div>
//                               <strong>{template.template_name}</strong>
//                               <br />
//                               <small className="text-muted">
//                                 {template.can_download ? 'Available for download' : 'Not available for download'}
//                               </small>
//                             </div>
//                             {!template.can_download && (
//                               <small className="text-danger">
//                                 <CIcon icon={cilXCircle} className="me-1" />
//                                 Disabled
//                               </small>
//                             )}
//                           </label>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-3 border rounded">
//                     <CIcon icon={cilFile} size="lg" className="text-muted mb-2" />
//                     <p className="text-muted mb-0">No templates available for download</p>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <CFormLabel>Notes (Optional):</CFormLabel>
//                   <CFormTextarea
//                     value={templateNotes}
//                     onChange={(e) => setTemplateNotes(e.target.value)}
//                     rows={2}
//                     placeholder="Add any notes about the selected templates..."
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setAvailableDocsModal(false);
//               setSelectedBookingForDocs(null);
//               setAvailableTemplates(null);
//               setSelectedTemplateIds([]);
//               setTemplateNotes('');
//             }}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary"
//             onClick={handleSubmitTemplateSelection}
//             disabled={selectedTemplateIds.length === 0 || submittingSelection}
//           >
//             {submittingSelection ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               `Select (${selectedTemplateIds.length}) Templates`
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking 
//         open={viewModalVisible} 
//         onClose={() => setViewModalVisible(false)} 
//         booking={selectedBooking} 
//         refreshData={fetchAllData}
//       />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchAllData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchAllData}
//         bookingId={financeBookingId}
//       />
//       <SubDealerChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//         bookingType="SUBDEALER"
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default AllBooking;










// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCloudUpload, 
//   cilPrint, 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash, 
//   cilZoomOut, 
//   cilCheck, 
//   cilX, 
//   cilCheckCircle, 
//   cilXCircle,
//   cilFile,
// } from '@coreui/icons';
// import config from 'src/config.js';
// import KYCView from 'src/views/sales/booking/KYCView';
// import FinanceView from 'src/views/sales/booking/FinanceView';
// import ViewBooking from 'src/views/sales/booking/BookingDetails';
// import SubDealerChassisNumberModal from './SubdealerChassisModel';
// import PrintModal from 'src/views/sales/booking/PrintFinance.js';
// import PendingUpdateDetailsModal from 'src/views/sales/booking/ViewPendingUpdates.js';
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
//   ACTIONS,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from 'src/utils/modulePermissions';

// const AllBooking = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);

//   // Data states for each tab
//   const [allData, setAllData] = useState([]);
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
  
//   const { permissions, user: authUser } = useAuth();
  
//   // Enhanced role and subdealer checks
//   const isSubdealer = authUser?.roles?.some(role => 
//     role.name === 'SUBDEALER' || role.name === 'Subdealer' || role.name === 'subdealer'
//   );
  
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   const userRole = localStorage.getItem('userRole') || '';
  
//   // Page-level permission checks for Subdealer Booking - All Booking page
//   const hasViewPermission = canViewPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasCreatePermission = canCreateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasUpdatePermission = canUpdateInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
//   const hasDeletePermission = canDeleteInPage(permissions, MODULES.SUBDEALER_BOOKING, PAGES.SUBDEALER_BOOKING.ALL_BOOKING);
  
//   // Tab-level VIEW permission checks
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.ALLOCATED
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewPendingApprovalsTab) availableTabs.push(0);
//     if (canViewApprovedTab) availableTabs.push(1);
//     if (canViewPendingAllocatedTab) availableTabs.push(2);
//     if (canViewAllocatedTab) availableTabs.push(3);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, canViewAllocatedTab, activeTab]);

//   // Check specific actions for chassis allocation (using CREATE permission)
//   const hasChassisAllocatePermission = hasCreatePermission;
  
//   // Check for chassis approval permission (using CREATE permission for approve, DELETE for reject)
//   const hasChassisApprovePermission = hasCreatePermission;
//   const hasChassisRejectPermission = hasDeletePermission;
  
//   // Check for document management permission (using CREATE permission)
//   const hasDocumentManagePermission = hasCreatePermission;

//   // Permission for viewing finance documents (using VIEW permission)
//   const hasFinanceViewPermission = hasViewPermission;

//   // Permission for viewing KYC documents (using VIEW permission)
//   const hasKYCViewPermission = hasViewPermission;

//   // Permission for printing documents (using VIEW permission)
//   const hasPrintPermission = hasViewPermission;

//   useEffect(() => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view Subdealer Bookings');
//       return;
//     }
//     fetchAllData();
//   }, [hasViewPermission]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await fetchData();
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       let url = `/bookings?bookingType=SUBDEALER`;
      
//       // If user is a subdealer, filter by their subdealer ID
//       if (isSubdealer && userSubdealerId) {
//         url = `/bookings?bookingType=SUBDEALER&subdealer=${userSubdealerId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       // Additional safety check: if user is subdealer, ensure we only show their bookings
//       let filteredBookings = subdealerBookings;
//       if (isSubdealer && userSubdealerId) {
//         filteredBookings = subdealerBookings.filter(booking => 
//           booking.subdealer?._id === userSubdealerId || 
//           booking.subdealer === userSubdealerId ||
//           (typeof booking.subdealer === 'object' && booking.subdealer._id === userSubdealerId)
//         );
//       }

//       setAllData(filteredBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = filteredBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = filteredBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = filteredBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = filteredBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!hasDocumentManagePermission) {
//       showError('You do not have permission to manage documents');
//       return;
//     }
    
//     try {
//       setLoadingTemplates(true);
//       setSelectedBookingForDocs(bookingId);
      
//       const response = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(response.data.data);
//       setAvailableDocsModal(true);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error fetching available templates:', error);
//       showError('Failed to fetch available documents');
//     } finally {
//       setLoadingTemplates(false);
//     }
//     handleClose();
//   };

//   const handleTemplateSelection = (templateId, canDownload) => {
//     if (!canDownload) return;
    
//     setSelectedTemplateIds(prev => {
//       if (prev.includes(templateId)) {
//         return prev.filter(id => id !== templateId);
//       } else {
//         return [...prev, templateId];
//       }
//     });
//   };

//   const handleSelectAllAvailable = () => {
//     if (availableTemplates?.available_templates?.templates) {
//       const allAvailableIds = availableTemplates.available_templates.templates
//         .filter(template => template.can_download)
//         .map(template => template.template_id);
//       setSelectedTemplateIds(allAvailableIds);
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedTemplateIds([]);
//   };

//   const handleSubmitTemplateSelection = async () => {
//     if (!selectedBookingForDocs || selectedTemplateIds.length === 0) {
//       showError('Please select at least one template');
//       return;
//     }

//     try {
//       setSubmittingSelection(true);
      
//       const payload = {
//         bookingId: selectedBookingForDocs,
//         templateIds: selectedTemplateIds,
//         notes: templateNotes.trim() || undefined
//       };

//       await axiosInstance.post('/booking-templates/select', payload);
      
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false);
//       setSelectedBookingForDocs(null);
//       setAvailableTemplates(null);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error selecting templates:', error);
//       showError(error.response?.data?.message || 'Failed to select templates');
//     } finally {
//       setSubmittingSelection(false);
//     }
//   };

//   const handleApproveChassis = (bookingId) => {
//     if (!hasChassisApprovePermission) {
//       showError('You do not have permission to approve chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     if (!hasChassisRejectPermission) {
//       showError('You do not have permission to reject chassis');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewBooking = async (id) => {
//     if (!hasViewPermission) {
//       showError('You do not have permission to view booking details');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     if (!hasPrintPermission) {
//       showError('You do not have permission to print documents');
//       return;
//     }
    
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!hasKYCViewPermission) {
//       showError('You do not have permission to view KYC documents');
//       return;
//     }
    
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//         bookingType: 'SUBDEALER'
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!hasFinanceViewPermission) {
//       showError('You do not have permission to view finance letters');
//       return;
//     }
    
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         bookingId: booking._id,
//         bookingType: 'SUBDEALER'
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to update chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     if (!hasChassisAllocatePermission) {
//       showError('You do not have permission to allocate chassis');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       const queryParams = [];
      
//       if (isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }
    
//       if (!isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }

//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);

//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
      
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       const response = await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(response.data.message);
      
//       await fetchAllData();
      
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//       setSelectedBookingForChassis(null);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to approve updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!hasUpdatePermission) {
//       showError('You do not have permission to reject updates');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!hasDeletePermission) {
//       showError('You do not have permission to delete bookings');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         showSuccess('Booking deleted successfully');
        
//         await fetchAllData();
        
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
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
//         You do not have permission to view Subdealer Bookings.
//       </div>
//     );
//   }

//   const renderBookingTable = (records, tabIndex) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               {/* Only show Subdealer column if user is NOT a subdealer */}
//               {!isSubdealer && <CTableHeaderCell scope="col">Subdealer</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex !== 2 && hasPrintPermission && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? (isSubdealer ? 15 : 16) : (isSubdealer ? 16 : 17)} style={{ color: 'red', textAlign: 'center' }}>
//                   No subdealer bookings available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                   {tabIndex !== 2 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   {/* Only show Subdealer data if user is NOT a subdealer */}
//                   {!isSubdealer && (
//                     <CTableDataCell>{booking.subdealer?.name || ''}</CTableDataCell>
//                   )}
//                   <CTableDataCell>{booking.model?.model_name || booking.model?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.model?.type || ''}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <>
//                           {booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus?.financeLetter?.status === 'REJECTED' ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                               {booking.documentStatus?.financeLetter?.status || ''}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && (
//                     <CTableDataCell>
//                       {booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                         <Link
//                           to={`/upload-kyc/${booking.id}`}
//                           state={{
//                             bookingId: booking.id,
//                             customerName: booking.customerDetails?.name || '',
//                             address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                             bookingType: 'SUBDEALER'
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <div className="d-flex align-items-center">
//                           <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                             {booking.documentStatus?.kyc?.status || ''}
//                           </span>
//                           {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                             <Link
//                               to={`/upload-kyc/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                               className="ms-2"
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           )}
//                         </div>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>
//                     <span 
//                       className="status-badge" 
//                       style={{
//                         backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                         booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                         booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                         booking.status === 'APPROVED' ? '#198754' : 
//                                         booking.status === 'REJECTED' ? '#dc3545' : 
//                                         booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                         booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px',
//                         borderRadius: '12px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         display: 'inline-block'
//                       }}
//                     >
//                       {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                     </span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                       <span className={`status-text ${booking.status}`}>
//                         {booking.claimDetails?.hasClaim ? (
//                           <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                         ) : (
//                           <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                         )}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && hasPrintPermission && (
//                     <CTableDataCell>
//                       {booking.formPath && (
//                         <>
//                           {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilPrint} />
//                               </CButton>
//                             </a>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.note || ''}</CTableDataCell>}
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={(event) => handleClick(event, booking.id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     <Menu 
//                       id={`action-menu-${booking.id}`} 
//                       anchorEl={anchorEl} 
//                       open={menuId === booking.id} 
//                       onClose={handleClose}
//                     >
//                       <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                         <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                       </MenuItem>
//                       {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
//                         <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                         </MenuItem>
//                       )}

//                       {hasUpdatePermission && (
//                         <>
//                           {tabIndex !== 2 && tabIndex !== 3 && booking.status !== 'FREEZZED' && (
//                             <Link className="Link" to={`/update-subdealer-booking/${booking.id}`} style={{ textDecoration: 'none' }}>
//                               <MenuItem style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             </Link>
//                           )}
//                         </>
//                       )}

//                       {hasDeletePermission && (
//                         <>
//                           {(tabIndex === 0) && (
//                             <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && hasFinanceViewPermission && (
//                         <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                         </MenuItem>
//                       )}

//                       {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && hasKYCViewPermission && (
//                         <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                         </MenuItem>
//                       )}

//                       {hasChassisAllocatePermission && (
//                         <>
//                           {tabIndex === 1 &&
//                             booking.status === 'APPROVED' &&
//                             (booking.payment?.type === 'CASH' ||
//                               (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                               <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                               </MenuItem>
//                             )}
//                           {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                             <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {hasChassisApprovePermission && hasChassisRejectPermission && tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                         <>
//                           {hasChassisApprovePermission && (
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                           )}
//                           {hasChassisRejectPermission && (
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {tabIndex === 1 && booking.status === 'APPROVED' && hasDocumentManagePermission && (
//                         <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilFile} className="me-2" /> Available Documents
//                         </MenuItem>
//                       )}
                      
//                       {tabIndex === 0 && booking.status === 'FREEZZED' && hasUpdatePermission && (
//                         <MenuItem 
//                           onClick={() => window.location.href = '/#/self-insurance'} 
//                           style={{ color: 'black' }}
//                         >
//                           <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
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
//       <div className='title'>Subdealers Booking</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/subdealer-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
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
//                   Pending Approvals
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
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
//                   Approved
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
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
//                   Pending Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 3}
//                   onClick={() => handleTabChange(3)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
           
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             {/* Only render Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderBookingTable(pendingRecords, 0)}
//               </CTabPane>
//             )}
//             {/* Only render Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
//               <CTabPane visible={activeTab === 1}>
//                 {renderBookingTable(approvedRecords, 1)}
//               </CTabPane>
//             )}
//             {/* Only render Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
//               <CTabPane visible={activeTab === 2}>
//                 {renderBookingTable(pendingAllocatedRecords, 2)}
//               </CTabPane>
//             )}
//             {/* Only render Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CTabPane visible={activeTab === 3}>
//                 {renderBookingTable(allocatedRecords, 3)}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Available Documents Modal */}
//       <CModal 
//         visible={availableDocsModal} 
//         onClose={() => {
//           setAvailableDocsModal(false);
//           setSelectedBookingForDocs(null);
//           setAvailableTemplates(null);
//           setSelectedTemplateIds([]);
//           setTemplateNotes('');
//         }}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Available Documents - {availableTemplates?.booking_number || ''}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading available documents...</p>
//             </div>
//           ) : availableTemplates ? (
//             <div>
//               <div className="mb-3">
//                 <h6>Customer: {availableTemplates.customer_name}</h6>
//                 <div className="alert alert-info mb-3">
//                   <small>
//                     <strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} templates are available for download.
//                   </small>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Available Templates ({availableTemplates.available_templates.count})</h6>
//                   <div className="d-flex gap-2">
//                     <CButton 
//                       size="sm" 
//                       color="primary" 
//                       variant="outline"
//                       onClick={handleSelectAllAvailable}
//                       disabled={!availableTemplates?.available_templates?.templates?.length}
//                     >
//                       Select All
//                     </CButton>
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       variant="outline"
//                       onClick={handleClearSelection}
//                     >
//                       Clear All
//                     </CButton>
//                   </div>
//                 </div>
                
//                 {availableTemplates.available_templates.templates.length > 0 ? (
//                   <div className="border rounded p-3">
//                     {availableTemplates.available_templates.templates.map((template) => (
//                       <div key={template.template_id} className="mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`template-${template.template_id}`}
//                             checked={selectedTemplateIds.includes(template.template_id)}
//                             onChange={() => handleTemplateSelection(template.template_id, template.can_download)}
//                             disabled={!template.can_download}
//                           />
//                           <label 
//                             className="form-check-label d-flex justify-content-between align-items-center w-100"
//                             htmlFor={`template-${template.template_id}`}
//                             style={{ cursor: template.can_download ? 'pointer' : 'not-allowed', opacity: template.can_download ? 1 : 0.6 }}
//                           >
//                             <div>
//                               <strong>{template.template_name}</strong>
//                               <br />
//                               <small className="text-muted">
//                                 {template.can_download ? 'Available for download' : 'Not available for download'}
//                               </small>
//                             </div>
//                             {!template.can_download && (
//                               <small className="text-danger">
//                                 <CIcon icon={cilXCircle} className="me-1" />
//                                 Disabled
//                               </small>
//                             )}
//                           </label>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-3 border rounded">
//                     <CIcon icon={cilFile} size="lg" className="text-muted mb-2" />
//                     <p className="text-muted mb-0">No templates available for download</p>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <CFormLabel>Notes (Optional):</CFormLabel>
//                   <CFormTextarea
//                     value={templateNotes}
//                     onChange={(e) => setTemplateNotes(e.target.value)}
//                     rows={2}
//                     placeholder="Add any notes about the selected templates..."
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setAvailableDocsModal(false);
//               setSelectedBookingForDocs(null);
//               setAvailableTemplates(null);
//               setSelectedTemplateIds([]);
//               setTemplateNotes('');
//             }}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary"
//             onClick={handleSubmitTemplateSelection}
//             disabled={selectedTemplateIds.length === 0 || submittingSelection}
//           >
//             {submittingSelection ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               `Select (${selectedTemplateIds.length}) Templates`
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking 
//         open={viewModalVisible} 
//         onClose={() => setViewModalVisible(false)} 
//         booking={selectedBooking} 
//         refreshData={fetchAllData}
//       />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchAllData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchAllData}
//         bookingId={financeBookingId}
//       />
//       <SubDealerChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//         bookingType="SUBDEALER"
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default AllBooking;






// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from 'src/utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilCloudUpload, 
//   cilPrint, 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash, 
//   cilZoomOut, 
//   cilCheck, 
//   cilX, 
//   cilCheckCircle, 
//   cilXCircle,
//   cilFile,
// } from '@coreui/icons';
// import config from 'src/config.js';
// import KYCView from 'src/views/sales/booking/KYCView';
// import FinanceView from 'src/views/sales/booking/FinanceView';
// import ViewBooking from 'src/views/sales/booking/BookingDetails';
// import SubDealerChassisNumberModal from './SubdealerChassisModel';
// import PrintModal from 'src/views/sales/booking/PrintFinance.js';
// import PendingUpdateDetailsModal from 'src/views/sales/booking/ViewPendingUpdates.js';
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

// const AllBooking = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);

//   // Data states for each tab
//   const [allData, setAllData] = useState([]);
//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
  
//   const { permissions, user: authUser } = useAuth();
  
//   // Enhanced role and subdealer checks
//   const isSubdealer = authUser?.roles?.some(role => 
//     role.name === 'SUBDEALER' || role.name === 'Subdealer' || role.name === 'subdealer'
//   );
  
//   const userSubdealerId = authUser?.subdealer?._id;
//   const userSubdealerName = authUser?.subdealer?.name;
  
//   const userRole = localStorage.getItem('userRole') || '';
  
//   // ========== TAB-LEVEL VIEW PERMISSIONS ==========
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_ALL_BOOKING.APPROVED
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.VIEW,
//     TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
//   );
  
//   // ========== TAB-LEVEL CREATE PERMISSIONS ==========
//   const canCreateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canCreateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_ALL_BOOKING.APPROVED
//   );
  
//   const canCreateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canCreateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
//   );
  
//   // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
//   const canUpdateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canUpdateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_ALL_BOOKING.APPROVED
//   );
  
//   const canUpdateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canUpdateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
//   );
  
//   // ========== TAB-LEVEL DELETE PERMISSIONS ==========
//   const canDeleteInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canDeleteInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_ALL_BOOKING.APPROVED
//   );
  
//   const canDeleteInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canDeleteInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
//   );
  
//   // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
//   // Approve Chassis - uses CREATE permission in PENDING ALLOCATED tab
//   const canApproveChassis = canCreateInPendingAllocatedTab;
  
//   // Reject Chassis - uses DELETE permission in PENDING ALLOCATED tab
//   const canRejectChassis = canDeleteInPendingAllocatedTab;
  
//   // Approve Update - uses CREATE permission in PENDING APPROVALS tab
//   const canApproveUpdate = canCreateInPendingApprovalsTab;
  
//   // Reject Update - uses DELETE permission in PENDING APPROVALS tab
//   const canRejectUpdate = canDeleteInPendingApprovalsTab;
  
//   // CORRECTED: Allocate/Update Chassis - uses CREATE permission in respective tabs
//   // (Allocating/Changing chassis is a CREATE action, not UPDATE)
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
//   const canUpdateChassisInAllocatedTab = canCreateInAllocatedTab;
  
//   // Edit Booking - uses UPDATE permission in respective tabs
//   const canEditInPendingApprovalsTab = canUpdateInPendingApprovalsTab;
  
//   // Delete Booking - uses DELETE permission in respective tabs
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
  
//   // Upload KYC - uses CREATE permission in respective tabs
//   const canUploadKycInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab = canCreateInAllocatedTab;
  
//   // Upload Finance - uses CREATE permission in respective tabs
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab = canCreateInAllocatedTab;
  
//   // CORRECTED: View Finance Letter - uses VIEW permission in respective tabs
//   const canViewFinanceLetterInPendingApprovals = canViewPendingApprovalsTab;
//   const canViewFinanceLetterInApprovedTab = canViewApprovedTab;
//   const canViewFinanceLetterInAllocatedTab = canViewAllocatedTab;
  
//   // CORRECTED: View Available Documents - uses VIEW permission in APPROVED tab
//   const canViewAvailableDocumentsInApprovedTab = canViewApprovedTab;
  
//   // View specific permissions for tabs
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,  // PENDING APPROVALS
//     1: canViewApprovedTab,          // APPROVED
//     2: canViewPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canViewAllocatedTab          // ALLOCATED
//   };
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingApprovalsTab || canViewApprovedTab || 
//                        canViewPendingAllocatedTab || canViewAllocatedTab;

//   // Check if user can create a new booking (page-level CREATE)
//   const canCreateNewBooking = hasSafePagePermission(
//     permissions,
//     MODULES.SUBDEALER_BOOKING,
//     PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
//     ACTIONS.CREATE
//   );

//   // Adjust activeTab when permissions change
//   useEffect(() => {
//     const availableTabs = [];
//     if (canViewPendingApprovalsTab) availableTabs.push(0);
//     if (canViewApprovedTab) availableTabs.push(1);
//     if (canViewPendingAllocatedTab) availableTabs.push(2);
//     if (canViewAllocatedTab) availableTabs.push(3);
    
//     // If current activeTab is not in availableTabs, switch to first available tab
//     if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, canViewAllocatedTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any Subdealer Booking tabs');
//       return;
//     }
//     fetchAllData();
//   }, [canViewAnyTab]);

//   // Helper function to get tab-level permission for current tab
//   const getCurrentTabPermission = (action) => {
//     switch(activeTab) {
//       case 0: // PENDING APPROVALS
//         if (action === ACTIONS.CREATE) return canCreateInPendingApprovalsTab;
//         if (action === ACTIONS.UPDATE) return canUpdateInPendingApprovalsTab;
//         if (action === ACTIONS.DELETE) return canDeleteInPendingApprovalsTab;
//         return canViewPendingApprovalsTab;
//       case 1: // APPROVED
//         if (action === ACTIONS.CREATE) return canCreateInApprovedTab;
//         if (action === ACTIONS.UPDATE) return canUpdateInApprovedTab;
//         if (action === ACTIONS.DELETE) return canDeleteInApprovedTab;
//         return canViewApprovedTab;
//       case 2: // PENDING ALLOCATED
//         if (action === ACTIONS.CREATE) return canCreateInPendingAllocatedTab;
//         if (action === ACTIONS.UPDATE) return canUpdateInPendingAllocatedTab;
//         if (action === ACTIONS.DELETE) return canDeleteInPendingAllocatedTab;
//         return canViewPendingAllocatedTab;
//       case 3: // ALLOCATED
//         if (action === ACTIONS.CREATE) return canCreateInAllocatedTab;
//         if (action === ACTIONS.UPDATE) return canUpdateInAllocatedTab;
//         if (action === ACTIONS.DELETE) return canDeleteInAllocatedTab;
//         return canViewAllocatedTab;
//       default:
//         return false;
//     }
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await fetchData();
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       let url = `/bookings?bookingType=SUBDEALER`;
      
//       // If user is a subdealer, filter by their subdealer ID
//       if (isSubdealer && userSubdealerId) {
//         url = `/bookings?bookingType=SUBDEALER&subdealer=${userSubdealerId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

//       // Additional safety check: if user is subdealer, ensure we only show their bookings
//       let filteredBookings = subdealerBookings;
//       if (isSubdealer && userSubdealerId) {
//         filteredBookings = subdealerBookings.filter(booking => 
//           booking.subdealer?._id === userSubdealerId || 
//           booking.subdealer === userSubdealerId ||
//           (typeof booking.subdealer === 'object' && booking.subdealer._id === userSubdealerId)
//         );
//       }

//       setAllData(filteredBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = filteredBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = filteredBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = filteredBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = filteredBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     // CORRECTED: Check VIEW permission for viewing available documents
//     if (!canViewAvailableDocumentsInApprovedTab) {
//       showError('You do not have permission to view available documents in APPROVED tab');
//       return;
//     }
    
//     try {
//       setLoadingTemplates(true);
//       setSelectedBookingForDocs(bookingId);
      
//       const response = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(response.data.data);
//       setAvailableDocsModal(true);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error fetching available templates:', error);
//       showError('Failed to fetch available documents');
//     } finally {
//       setLoadingTemplates(false);
//     }
//     handleClose();
//   };

//   const handleTemplateSelection = (templateId, canDownload) => {
//     if (!canDownload) return;
    
//     setSelectedTemplateIds(prev => {
//       if (prev.includes(templateId)) {
//         return prev.filter(id => id !== templateId);
//       } else {
//         return [...prev, templateId];
//       }
//     });
//   };

//   const handleSelectAllAvailable = () => {
//     if (availableTemplates?.available_templates?.templates) {
//       const allAvailableIds = availableTemplates.available_templates.templates
//         .filter(template => template.can_download)
//         .map(template => template.template_id);
//       setSelectedTemplateIds(allAvailableIds);
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedTemplateIds([]);
//   };

//   const handleSubmitTemplateSelection = async () => {
//     // Selecting templates requires UPDATE permission (changing the state)
//     if (!canUpdateInApprovedTab) {
//       showError('You do not have permission to select templates in APPROVED tab');
//       return;
//     }

//     if (!selectedBookingForDocs || selectedTemplateIds.length === 0) {
//       showError('Please select at least one template');
//       return;
//     }

//     try {
//       setSubmittingSelection(true);
      
//       const payload = {
//         bookingId: selectedBookingForDocs,
//         templateIds: selectedTemplateIds,
//         notes: templateNotes.trim() || undefined
//       };

//       await axiosInstance.post('/booking-templates/select', payload);
      
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false);
//       setSelectedBookingForDocs(null);
//       setAvailableTemplates(null);
//       setSelectedTemplateIds([]);
//       setTemplateNotes('');
      
//     } catch (error) {
//       console.error('Error selecting templates:', error);
//       showError(error.response?.data?.message || 'Failed to select templates');
//     } finally {
//       setSubmittingSelection(false);
//     }
//   };

//   const handleApproveChassis = (bookingId) => {
//     // Check CREATE permission in PENDING ALLOCATED tab
//     if (!canApproveChassis) {
//       showError('You do not have permission to approve chassis in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     // Check DELETE permission in PENDING ALLOCATED tab
//     if (!canRejectChassis) {
//       showError('You do not have permission to reject chassis in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
      
//       if (approvalAction === 'APPROVE') {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canApproveChassis) {
//           showError('You do not have permission to approve chassis in PENDING ALLOCATED tab');
//           return;
//         }
//       } else {
//         // Check DELETE permission in PENDING ALLOCATED tab
//         if (!canRejectChassis) {
//           showError('You do not have permission to reject chassis in PENDING ALLOCATED tab');
//           return;
//         }
//       }

//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
      
//       await fetchAllData();
      
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleViewBooking = async (id) => {
//     // Check VIEW permission for current tab
//     const canViewCurrentTab = canViewBookingInTab[activeTab];
//     if (!canViewCurrentTab) {
//       showError('You do not have permission to view booking details in this tab');
//       return;
//     }
    
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     // Check VIEW permission for current tab
//     const canViewCurrentTab = canViewBookingInTab[activeTab];
//     if (!canViewCurrentTab) {
//       showError('You do not have permission to print documents in this tab');
//       return;
//     }
    
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     // Check VIEW permission for current tab
//     const canViewCurrentTab = canViewBookingInTab[activeTab];
//     if (!canViewCurrentTab) {
//       showError('You do not have permission to view KYC documents in this tab');
//       return;
//     }
    
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//         bookingType: 'SUBDEALER'
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     // CORRECTED: Check VIEW permission for current tab
//     const canViewCurrentTab = canViewBookingInTab[activeTab];
//     if (!canViewCurrentTab) {
//       showError('You do not have permission to view finance letters in this tab');
//       return;
//     }
    
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails?.name || '',
//         bookingId: booking._id,
//         bookingType: 'SUBDEALER'
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     // CORRECTED: Check CREATE permission in ALLOCATED tab for changing vehicle
//     if (!canUpdateChassisInAllocatedTab) {
//       showError('You do not have permission to change vehicle in ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     // CORRECTED: Check CREATE permission in APPROVED tab for allocating chassis
//     if (!canAllocateChassisInApprovedTab) {
//       showError('You do not have permission to allocate chassis in APPROVED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     // CORRECTED: Check CREATE permission in respective tab
//     let hasPermission = false;
//     if (!isUpdateChassis) {
//       // Allocating chassis in APPROVED tab - CREATE permission
//       hasPermission = canAllocateChassisInApprovedTab;
//     } else {
//       // Updating chassis in ALLOCATED tab - CREATE permission
//       hasPermission = canUpdateChassisInAllocatedTab;
//     }
    
//     if (!hasPermission) {
//       showError('You do not have permission to save chassis number');
//       return;
//     }
    
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       const queryParams = [];
      
//       if (isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }
    
//       if (!isUpdateChassis && payload.reason) {
//         queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//       }

//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);

//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
      
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       const response = await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(response.data.message);
      
//       await fetchAllData();
      
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//       setSelectedBookingForChassis(null);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     // Check VIEW permission for PENDING APPROVALS tab
//     if (!canViewPendingApprovalsTab) {
//       showError('You do not have permission to view alteration requests in PENDING APPROVALS tab');
//       return;
//     }
    
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     // Check CREATE permission in PENDING APPROVALS tab
//     if (!canApproveUpdate) {
//       showError('You do not have permission to approve updates in PENDING APPROVALS tab');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     // Check DELETE permission in PENDING APPROVALS tab
//     if (!canRejectUpdate) {
//       showError('You do not have permission to reject updates in PENDING APPROVALS tab');
//       return;
//     }
    
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
      
//       await fetchAllData();
      
//       setDetailsModalOpen(false);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     // Check DELETE permission in PENDING APPROVALS tab
//     if (!canDeleteBookingInPendingApprovals) {
//       showError('You do not have permission to delete bookings in PENDING APPROVALS tab');
//       return;
//     }
    
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         showSuccess('Booking deleted successfully');
        
//         await fetchAllData();
        
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   // Early return if no view permission for any tab
//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any Subdealer Booking tabs.
//       </div>
//     );
//   }

//   const renderBookingTable = (records, tabIndex) => {
//     // Check if user has permission to view this specific tab
//     const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
//     // If user doesn't have VIEW permission for this tab, show message
//     if (!canViewCurrentTab) {
//       const tabNames = [
//         "PENDING APPROVALS",
//         "APPROVED", 
//         "PENDING ALLOCATED",
//         "ALLOCATED"
//       ];
      
//       return (
//         <div className="text-center py-4">
//           <CAlert color="warning">
//             You do not have permission to view the {tabNames[tabIndex]} tab.
//           </CAlert>
//         </div>
//       );
//     }
    
//     // Helper function to check if user can upload KYC in this tab
//     const canUploadKycInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadKycInPendingApprovals;
//         case 1: return canUploadKycInApprovedTab;
//         case 3: return canUploadKycInAllocatedTab;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can upload Finance in this tab
//     const canUploadFinanceInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadFinanceInPendingApprovals;
//         case 1: return canUploadFinanceInApprovedTab;
//         case 3: return canUploadFinanceInAllocatedTab;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can view finance letter in this tab
//     const canViewFinanceLetterInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canViewFinanceLetterInPendingApprovals;
//         case 1: return canViewFinanceLetterInApprovedTab;
//         case 3: return canViewFinanceLetterInAllocatedTab;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can edit in this tab
//     const canEditInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canEditInPendingApprovalsTab;
//         default: return false;
//       }
//     };
    
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               {/* Only show Subdealer column if user is NOT a subdealer */}
//               {!isSubdealer && <CTableHeaderCell scope="col">Subdealer</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex !== 2 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex !== 2 && canViewCurrentTab && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? (isSubdealer ? 15 : 16) : (isSubdealer ? 16 : 17)} style={{ color: 'red', textAlign: 'center' }}>
//                   No subdealer bookings available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                   {tabIndex !== 2 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   {/* Only show Subdealer data if user is NOT a subdealer */}
//                   {!isSubdealer && (
//                     <CTableDataCell>{booking.subdealer?.name || ''}</CTableDataCell>
//                   )}
//                   <CTableDataCell>{booking.model?.model_name || booking.model?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.model?.type || ''}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                   {tabIndex !== 2 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && canViewCurrentTab && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && tabIndex !== 3 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <>
//                           {canUploadFinanceInThisTab() && (booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus?.financeLetter?.status === 'REJECTED') ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                               {booking.documentStatus?.financeLetter?.status || ''}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex !== 2 && (
//                     <CTableDataCell>
//                       {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                         <Link
//                           to={`/upload-kyc/${booking.id}`}
//                           state={{
//                             bookingId: booking.id,
//                             customerName: booking.customerDetails?.name || '',
//                             address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                             bookingType: 'SUBDEALER'
//                           }}
//                         >
//                           <CButton size="sm" className="upload-kyc-btn icon-only">
//                             <CIcon icon={cilCloudUpload} />
//                           </CButton>
//                         </Link>
//                       ) : (
//                         <div className="d-flex align-items-center">
//                           <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                             {booking.documentStatus?.kyc?.status || ''}
//                           </span>
//                           {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                             <Link
//                               to={`/upload-kyc/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name || '',
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
//                                 bookingType: 'SUBDEALER'
//                               }}
//                               className="ms-2"
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           )}
//                         </div>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>
//                     <span 
//                       className="status-badge" 
//                       style={{
//                         backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                         booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                         booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                         booking.status === 'APPROVED' ? '#198754' : 
//                                         booking.status === 'REJECTED' ? '#dc3545' : 
//                                         booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                         booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px',
//                         borderRadius: '12px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         display: 'inline-block'
//                       }}
//                     >
//                       {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                     </span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                       <span className={`status-text ${booking.status}`}>
//                         {booking.claimDetails?.hasClaim ? (
//                           <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                         ) : (
//                           <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                         )}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
//                   {tabIndex !== 2 && canViewCurrentTab && (
//                     <CTableDataCell>
//                       {booking.formPath && (
//                         <>
//                           {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilPrint} />
//                               </CButton>
//                             </a>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.note || ''}</CTableDataCell>}
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       className='option-button btn-sm'
//                       onClick={(event) => handleClick(event, booking.id)}
//                     >
//                       <CIcon icon={cilSettings} />
//                       Options
//                     </CButton>
//                     <Menu 
//                       id={`action-menu-${booking.id}`} 
//                       anchorEl={anchorEl} 
//                       open={menuId === booking.id} 
//                       onClose={handleClose}
//                     >
//                       {canViewCurrentTab && (
//                         <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                         </MenuItem>
//                       )}
//                       {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && canViewCurrentTab && (
//                         <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                         </MenuItem>
//                       )}

//                       {canEditInThisTab() && (
//                         <>
//                           {tabIndex !== 2 && tabIndex !== 3 && booking.status !== 'FREEZZED' && (
//                             <Link className="Link" to={`/update-subdealer-booking/${booking.id}`} style={{ textDecoration: 'none' }}>
//                               <MenuItem style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             </Link>
//                           )}
//                         </>
//                       )}

//                       {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                         <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilTrash} className="me-2" /> Delete
//                         </MenuItem>
//                       )}

//                       {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewFinanceLetterInThisTab() && (
//                         <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                         </MenuItem>
//                       )}

//                       {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && canViewCurrentTab && (
//                         <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                         </MenuItem>
//                       )}

//                       {tabIndex === 1 && canAllocateChassisInApprovedTab && (
//                         <>
//                           {booking.status === 'APPROVED' &&
//                             (booking.payment?.type === 'CASH' ||
//                               (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                               <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                               </MenuItem>
//                             )}
//                         </>
//                       )}
//                       {tabIndex === 3 && canUpdateChassisInAllocatedTab && (
//                         <>
//                           {booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                             <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {/* Approve/Reject Chassis - Different permissions for each */}
//                       {tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                         <>
//                           {canApproveChassis && (
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                           )}
//                           {canRejectChassis && (
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {/* Available Documents Option - Only for Approved tab */}
//                       {tabIndex === 1 && booking.status === 'APPROVED' && canViewAvailableDocumentsInApprovedTab && (
//                         <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilFile} className="me-2" /> Available Documents
//                         </MenuItem>
//                       )}
                      
//                       {tabIndex === 0 && booking.status === 'FREEZZED' && canEditInPendingApprovalsTab && canViewCurrentTab && (
//                         <MenuItem 
//                           onClick={() => window.location.href = '/#/self-insurance'} 
//                           style={{ color: 'black' }}
//                         >
//                           <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                         </MenuItem>
//                       )}
//                     </Menu>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))
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
//       <div className='title'>Subdealers Booking</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateNewBooking && (
//               <Link to="/subdealer-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {/* Only show Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
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
//                   Pending Approvals
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
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
//                   Approved
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
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
//                   Pending Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//             {/* Only show Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 3}
//                   onClick={() => handleTabChange(3)}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                     borderBottom: 'none',
//                     color: 'black'
//                   }}
//                 >
//                   Allocated
//                 </CNavLink>
//               </CNavItem>
//             )}
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
           
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             {/* Only render Pending Approvals tab if user has VIEW permission for it */}
//             {canViewPendingApprovalsTab && (
//               <CTabPane visible={activeTab === 0}>
//                 {renderBookingTable(pendingRecords, 0)}
//               </CTabPane>
//             )}
//             {/* Only render Approved tab if user has VIEW permission for it */}
//             {canViewApprovedTab && (
//               <CTabPane visible={activeTab === 1}>
//                 {renderBookingTable(approvedRecords, 1)}
//               </CTabPane>
//             )}
//             {/* Only render Pending Allocated tab if user has VIEW permission for it */}
//             {canViewPendingAllocatedTab && (
//               <CTabPane visible={activeTab === 2}>
//                 {renderBookingTable(pendingAllocatedRecords, 2)}
//               </CTabPane>
//             )}
//             {/* Only render Allocated tab if user has VIEW permission for it */}
//             {canViewAllocatedTab && (
//               <CTabPane visible={activeTab === 3}>
//                 {renderBookingTable(allocatedRecords, 3)}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Available Documents Modal */}
//       <CModal 
//         visible={availableDocsModal} 
//         onClose={() => {
//           setAvailableDocsModal(false);
//           setSelectedBookingForDocs(null);
//           setAvailableTemplates(null);
//           setSelectedTemplateIds([]);
//           setTemplateNotes('');
//         }}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Available Documents - {availableTemplates?.booking_number || ''}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading available documents...</p>
//             </div>
//           ) : availableTemplates ? (
//             <div>
//               <div className="mb-3">
//                 <h6>Customer: {availableTemplates.customer_name}</h6>
//                 <div className="alert alert-info mb-3">
//                   <small>
//                     <strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} templates are available for download.
//                   </small>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Available Templates ({availableTemplates.available_templates.count})</h6>
//                   <div className="d-flex gap-2">
//                     <CButton 
//                       size="sm" 
//                       color="primary" 
//                       variant="outline"
//                       onClick={handleSelectAllAvailable}
//                       disabled={!availableTemplates?.available_templates?.templates?.length}
//                     >
//                       Select All
//                     </CButton>
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       variant="outline"
//                       onClick={handleClearSelection}
//                     >
//                       Clear All
//                     </CButton>
//                   </div>
//                 </div>
                
//                 {availableTemplates.available_templates.templates.length > 0 ? (
//                   <div className="border rounded p-3">
//                     {availableTemplates.available_templates.templates.map((template) => (
//                       <div key={template.template_id} className="mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`template-${template.template_id}`}
//                             checked={selectedTemplateIds.includes(template.template_id)}
//                             onChange={() => handleTemplateSelection(template.template_id, template.can_download)}
//                             disabled={!template.can_download}
//                           />
//                           <label 
//                             className="form-check-label d-flex justify-content-between align-items-center w-100"
//                             htmlFor={`template-${template.template_id}`}
//                             style={{ cursor: template.can_download ? 'pointer' : 'not-allowed', opacity: template.can_download ? 1 : 0.6 }}
//                           >
//                             <div>
//                               <strong>{template.template_name}</strong>
//                               <br />
//                               <small className="text-muted">
//                                 {template.can_download ? 'Available for download' : 'Not available for download'}
//                               </small>
//                             </div>
//                             {!template.can_download && (
//                               <small className="text-danger">
//                                 <CIcon icon={cilXCircle} className="me-1" />
//                                 Disabled
//                               </small>
//                             )}
//                           </label>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-3 border rounded">
//                     <CIcon icon={cilFile} size="lg" className="text-muted mb-2" />
//                     <p className="text-muted mb-0">No templates available for download</p>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <CFormLabel>Notes (Optional):</CFormLabel>
//                   <CFormTextarea
//                     value={templateNotes}
//                     onChange={(e) => setTemplateNotes(e.target.value)}
//                     rows={2}
//                     placeholder="Add any notes about the selected templates..."
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => {
//               setAvailableDocsModal(false);
//               setSelectedBookingForDocs(null);
//               setAvailableTemplates(null);
//               setSelectedTemplateIds([]);
//               setTemplateNotes('');
//             }}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary"
//             onClick={handleSubmitTemplateSelection}
//             disabled={selectedTemplateIds.length === 0 || submittingSelection}
//           >
//             {submittingSelection ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               `Select (${selectedTemplateIds.length}) Templates`
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking 
//         open={viewModalVisible} 
//         onClose={() => setViewModalVisible(false)} 
//         booking={selectedBooking} 
//         refreshData={fetchAllData}
//       />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchAllData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchAllData}
//         bookingId={financeBookingId}
//       />
//       <SubDealerChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//         bookingType="SUBDEALER"
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default AllBooking;






import '../../../css/table.css';
import '../../../css/form.css';
import '../../../css/invoice.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  showError,
  axiosInstance,
  showSuccess,
  confirmDelete
} from 'src/utils/tableImports';
import CIcon from '@coreui/icons-react';
import { 
  cilCloudUpload, 
  cilPrint, 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash, 
  cilZoomOut, 
  cilCheck, 
  cilX, 
  cilCheckCircle, 
  cilXCircle,
  cilFile,
} from '@coreui/icons';
import config from 'src/config.js';
import KYCView from 'src/views/sales/booking/KYCView';
import FinanceView from 'src/views/sales/booking/FinanceView';
import ViewBooking from 'src/views/sales/booking/BookingDetails';
import SubDealerChassisNumberModal from './SubdealerChassisModel';
import PrintModal from 'src/views/sales/booking/PrintFinance.js';
import PendingUpdateDetailsModal from 'src/views/sales/booking/ViewPendingUpdates.js';
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

const AllBooking = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chassis Approval Modal States
  const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
  const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  
  // Available Documents States
  const [availableDocsModal, setAvailableDocsModal] = useState(false);
  const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
  const [templateNotes, setTemplateNotes] = useState('');
  const [submittingSelection, setSubmittingSelection] = useState(false);

  // Data states for each tab
  const [allData, setAllData] = useState([]);
  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPending,
    setFilteredData: setFilteredPending,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);
  const {
    data: approvedData,
    setData: setApprovedData,
    filteredData: filteredApproved,
    setFilteredData: setFilteredApproved,
    handleFilter: handleApprovedFilter
  } = useTableFilter([]);
  const {
    data: allocatedData,
    setData: setAllocatedData,
    filteredData: filteredAllocated,
    setFilteredData: setFilteredAllocated,
    handleFilter: handleAllocatedFilter
  } = useTableFilter([]);
  const {
    data: pendingAllocatedData,
    setData: setPendingAllocatedData,
    filteredData: filteredPendingAllocated,
    setFilteredData: setFilteredPendingAllocated,
    handleFilter: handlePendingAllocatedFilter
  } = useTableFilter([]);

  const { currentRecords: pendingRecords } = usePagination(filteredPending);
  const { currentRecords: approvedRecords } = usePagination(filteredApproved);
  const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
  const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [kycBookingId, setKycBookingId] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [financeModalVisible, setFinanceModalVisible] = useState(false);
  const [financeBookingId, setFinanceBookingId] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [showChassisModal, setShowChassisModal] = useState(false);
  const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
  const [chassisLoading, setChassisLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState();
  const [isUpdateChassis, setIsUpdateChassis] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  
  const { permissions, user: authUser } = useAuth();
  
  // Enhanced role and subdealer checks
  const isSubdealer = authUser?.roles?.some(role => 
    role.name === 'SUBDEALER' || role.name === 'Subdealer' || role.name === 'subdealer'
  );
  
  const userSubdealerId = authUser?.subdealer?._id;
  const userSubdealerName = authUser?.subdealer?.name;
  
  const userRole = localStorage.getItem('userRole') || '';
  
  // ========== TAB-LEVEL VIEW PERMISSIONS ==========
  const canViewPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canViewApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canViewPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canViewAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.VIEW,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== TAB-LEVEL CREATE PERMISSIONS ==========
  const canCreateInPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canCreateInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canCreateInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canCreateInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
  const canUpdateInPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canUpdateInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canUpdateInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canUpdateInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== TAB-LEVEL DELETE PERMISSIONS ==========
  const canDeleteInPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canDeleteInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.APPROVED
  );
  
  const canDeleteInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canDeleteInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.SUBDEALER_ALL_BOOKING.ALLOCATED
  );
  
  // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
  // Approve Chassis - uses CREATE permission in PENDING ALLOCATED tab
  const canApproveChassis = canCreateInPendingAllocatedTab;
  
  // Reject Chassis - uses DELETE permission in PENDING ALLOCATED tab
  const canRejectChassis = canDeleteInPendingAllocatedTab;
  
  // Approve Update - uses CREATE permission in PENDING APPROVALS tab
  const canApproveUpdate = canCreateInPendingApprovalsTab;
  
  // Reject Update - uses DELETE permission in PENDING APPROVALS tab
  const canRejectUpdate = canDeleteInPendingApprovalsTab;
  
  // CORRECTED: Allocate/Update Chassis - uses CREATE permission in respective tabs
  // (Allocating/Changing chassis is a CREATE action, not UPDATE)
  const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
  const canUpdateChassisInAllocatedTab = canCreateInAllocatedTab;
  
  // Edit Booking - uses UPDATE permission in respective tabs
  const canEditInPendingApprovalsTab = canUpdateInPendingApprovalsTab;
  
  // Delete Booking - uses DELETE permission in respective tabs
  const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
  
  // Upload KYC - uses CREATE permission in respective tabs
  const canUploadKycInPendingApprovals = canCreateInPendingApprovalsTab;
  const canUploadKycInApprovedTab = canCreateInApprovedTab;
  const canUploadKycInAllocatedTab = canCreateInAllocatedTab;
  
  // Upload Finance - uses CREATE permission in respective tabs
  const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
  const canUploadFinanceInApprovedTab = canCreateInApprovedTab;
  const canUploadFinanceInAllocatedTab = canCreateInAllocatedTab;
  
  // CORRECTED: View Finance Letter - uses VIEW permission in respective tabs
  const canViewFinanceLetterInPendingApprovals = canViewPendingApprovalsTab;
  const canViewFinanceLetterInApprovedTab = canViewApprovedTab;
  const canViewFinanceLetterInAllocatedTab = canViewAllocatedTab;
  
  // CORRECTED: View Available Documents - uses VIEW permission in APPROVED tab
  const canViewAvailableDocumentsInApprovedTab = canViewApprovedTab;
  
  // View specific permissions for tabs
  const canViewBookingInTab = {
    0: canViewPendingApprovalsTab,  // PENDING APPROVALS
    1: canViewApprovedTab,          // APPROVED
    2: canViewPendingAllocatedTab,  // PENDING ALLOCATED
    3: canViewAllocatedTab          // ALLOCATED
  };
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPendingApprovalsTab || canViewApprovedTab || 
                       canViewPendingAllocatedTab || canViewAllocatedTab;

  // Check if user can create a new booking (page-level CREATE)
  const canCreateNewBooking = hasSafePagePermission(
    permissions,
    MODULES.SUBDEALER_BOOKING,
    PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    ACTIONS.CREATE
  );

  // Check if user can print in current tab (PRINT requires CREATE permission)
  const canPrintInCurrentTab = () => {
    switch(activeTab) {
      case 0: return canCreateInPendingApprovalsTab;  // Print in PENDING APPROVALS requires CREATE
      case 1: return canCreateInApprovedTab;          // Print in APPROVED requires CREATE
      case 2: return canCreateInPendingAllocatedTab;  // Print in PENDING ALLOCATED requires CREATE
      case 3: return canCreateInAllocatedTab;         // Print in ALLOCATED requires CREATE
      default: return false;
    }
  };

  // Adjust activeTab when permissions change
  useEffect(() => {
    const availableTabs = [];
    if (canViewPendingApprovalsTab) availableTabs.push(0);
    if (canViewApprovedTab) availableTabs.push(1);
    if (canViewPendingAllocatedTab) availableTabs.push(2);
    if (canViewAllocatedTab) availableTabs.push(3);
    
    // If current activeTab is not in availableTabs, switch to first available tab
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, canViewAllocatedTab, activeTab]);

  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any Subdealer Booking tabs');
      return;
    }
    fetchAllData();
  }, [canViewAnyTab]);

  // Helper function to get tab-level permission for current tab
  const getCurrentTabPermission = (action) => {
    switch(activeTab) {
      case 0: // PENDING APPROVALS
        if (action === ACTIONS.CREATE) return canCreateInPendingApprovalsTab;
        if (action === ACTIONS.UPDATE) return canUpdateInPendingApprovalsTab;
        if (action === ACTIONS.DELETE) return canDeleteInPendingApprovalsTab;
        return canViewPendingApprovalsTab;
      case 1: // APPROVED
        if (action === ACTIONS.CREATE) return canCreateInApprovedTab;
        if (action === ACTIONS.UPDATE) return canUpdateInApprovedTab;
        if (action === ACTIONS.DELETE) return canDeleteInApprovedTab;
        return canViewApprovedTab;
      case 2: // PENDING ALLOCATED
        if (action === ACTIONS.CREATE) return canCreateInPendingAllocatedTab;
        if (action === ACTIONS.UPDATE) return canUpdateInPendingAllocatedTab;
        if (action === ACTIONS.DELETE) return canDeleteInPendingAllocatedTab;
        return canViewPendingAllocatedTab;
      case 3: // ALLOCATED
        if (action === ACTIONS.CREATE) return canCreateInAllocatedTab;
        if (action === ACTIONS.UPDATE) return canUpdateInAllocatedTab;
        if (action === ACTIONS.DELETE) return canDeleteInAllocatedTab;
        return canViewAllocatedTab;
      default:
        return false;
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await fetchData();
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      let url = `/bookings?bookingType=SUBDEALER`;
      
      // If user is a subdealer, filter by their subdealer ID
      if (isSubdealer && userSubdealerId) {
        url = `/bookings?bookingType=SUBDEALER&subdealer=${userSubdealerId}`;
      }
      
      const response = await axiosInstance.get(url);
      const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

      // Additional safety check: if user is subdealer, ensure we only show their bookings
      let filteredBookings = subdealerBookings;
      if (isSubdealer && userSubdealerId) {
        filteredBookings = subdealerBookings.filter(booking => 
          booking.subdealer?._id === userSubdealerId || 
          booking.subdealer === userSubdealerId ||
          (typeof booking.subdealer === 'object' && booking.subdealer._id === userSubdealerId)
        );
      }

      setAllData(filteredBookings);

      // Updated to include FREEZZED status in pending bookings
      const pendingBookings = filteredBookings.filter(
        (booking) => 
          booking.status === 'PENDING_APPROVAL' || 
          booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
          booking.status === 'FREEZZED'
      );
      setPendingData(pendingBookings);
      setFilteredPending(pendingBookings);

      const approvedBookings = filteredBookings.filter((booking) => booking.status === 'APPROVED');
      setApprovedData(approvedBookings);
      setFilteredApproved(approvedBookings);

      const pendingAllocatedBookings = filteredBookings.filter((booking) => booking.status === 'ON_HOLD');
      setPendingAllocatedData(pendingAllocatedBookings);
      setFilteredPendingAllocated(pendingAllocatedBookings);

      const allocatedBookings = filteredBookings.filter((booking) => booking.status === 'ALLOCATED');
      setAllocatedData(allocatedBookings);
      setFilteredAllocated(allocatedBookings);
      
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleOpenAvailableDocs = async (bookingId) => {
    // CORRECTED: Check VIEW permission for viewing available documents
    if (!canViewAvailableDocumentsInApprovedTab) {
      showError('You do not have permission to view available documents in APPROVED tab');
      return;
    }
    
    try {
      setLoadingTemplates(true);
      setSelectedBookingForDocs(bookingId);
      
      const response = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
      setAvailableTemplates(response.data.data);
      setAvailableDocsModal(true);
      setSelectedTemplateIds([]);
      setTemplateNotes('');
      
    } catch (error) {
      console.error('Error fetching available templates:', error);
      showError('Failed to fetch available documents');
    } finally {
      setLoadingTemplates(false);
    }
    handleClose();
  };

  const handleTemplateSelection = (templateId, canDownload) => {
    if (!canDownload) return;
    
    setSelectedTemplateIds(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  const handleSelectAllAvailable = () => {
    if (availableTemplates?.available_templates?.templates) {
      const allAvailableIds = availableTemplates.available_templates.templates
        .filter(template => template.can_download)
        .map(template => template.template_id);
      setSelectedTemplateIds(allAvailableIds);
    }
  };

  const handleClearSelection = () => {
    setSelectedTemplateIds([]);
  };

  const handleSubmitTemplateSelection = async () => {
    // Selecting templates requires UPDATE permission (changing the state)
    if (!canUpdateInApprovedTab) {
      showError('You do not have permission to select templates in APPROVED tab');
      return;
    }

    if (!selectedBookingForDocs || selectedTemplateIds.length === 0) {
      showError('Please select at least one template');
      return;
    }

    try {
      setSubmittingSelection(true);
      
      const payload = {
        bookingId: selectedBookingForDocs,
        templateIds: selectedTemplateIds,
        notes: templateNotes.trim() || undefined
      };

      await axiosInstance.post('/booking-templates/select', payload);
      
      showSuccess('Templates selected successfully!');
      setAvailableDocsModal(false);
      setSelectedBookingForDocs(null);
      setAvailableTemplates(null);
      setSelectedTemplateIds([]);
      setTemplateNotes('');
      
    } catch (error) {
      console.error('Error selecting templates:', error);
      showError(error.response?.data?.message || 'Failed to select templates');
    } finally {
      setSubmittingSelection(false);
    }
  };

  const handleApproveChassis = (bookingId) => {
    // Check CREATE permission in PENDING ALLOCATED tab
    if (!canApproveChassis) {
      showError('You do not have permission to approve chassis in PENDING ALLOCATED tab');
      return;
    }
    
    setSelectedBookingForApproval(bookingId);
    setApprovalAction('APPROVE');
    setApprovalNote('');
    setChassisApprovalModal(true);
    handleClose();
  };

  const handleRejectChassis = (bookingId) => {
    // Check DELETE permission in PENDING ALLOCATED tab
    if (!canRejectChassis) {
      showError('You do not have permission to reject chassis in PENDING ALLOCATED tab');
      return;
    }
    
    setSelectedBookingForApproval(bookingId);
    setApprovalAction('REJECT');
    setApprovalNote('');
    setChassisApprovalModal(true);
    handleClose();
  };

  const handleChassisApprovalSubmit = async () => {
    if (!approvalNote.trim()) {
      showError('Please enter approval note');
      return;
    }

    try {
      setApprovalLoading(true);
      
      if (approvalAction === 'APPROVE') {
        // Check CREATE permission in PENDING ALLOCATED tab
        if (!canApproveChassis) {
          showError('You do not have permission to approve chassis in PENDING ALLOCATED tab');
          return;
        }
      } else {
        // Check DELETE permission in PENDING ALLOCATED tab
        if (!canRejectChassis) {
          showError('You do not have permission to reject chassis in PENDING ALLOCATED tab');
          return;
        }
      }

      const payload = {
        action: approvalAction,
        approvalNote: approvalNote.trim()
      };

      await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
      showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
      setChassisApprovalModal(false);
      setSelectedBookingForApproval(null);
      setApprovalNote('');
      
      await fetchAllData();
      
    } catch (error) {
      console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
      showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleViewBooking = async (id) => {
    // Check VIEW permission for current tab
    const canViewCurrentTab = canViewBookingInTab[activeTab];
    if (!canViewCurrentTab) {
      showError('You do not have permission to view booking details in this tab');
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/bookings/${id}`);
      setSelectedBooking(response.data.data);
      setViewModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error fetching booking details', error);
      showError('Failed to fetch booking details');
    }
  };

  const handlePrint = (bookingId) => {
    // Check CREATE permission for current tab (Print requires CREATE)
    if (!canPrintInCurrentTab()) {
      showError('You do not have permission to print documents in this tab');
      return;
    }
    
    setSelectedBookingForPrint(bookingId);
    setPrintModalVisible(true);
    handleClose();
  };

  const handleViewKYC = async (bookingId) => {
    // Check VIEW permission for current tab
    const canViewCurrentTab = canViewBookingInTab[activeTab];
    if (!canViewCurrentTab) {
      showError('You do not have permission to view KYC documents in this tab');
      return;
    }
    
    try {
      console.log('Fetching KYC for booking ID:', bookingId);
      setKycBookingId(bookingId);
      const booking = allData.find((b) => b._id === bookingId);
      if (!booking) {
        showError('Booking not found');
        return;
      }
      const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
      console.log('KYC Response:', response.data);

      const kycDataWithStatus = {
        ...response.data.data,
        status: booking.documentStatus?.kyc?.status || 'PENDING',
        customerName: booking.customerDetails?.name || '',
        address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
        bookingType: 'SUBDEALER'
      };

      setKycData(kycDataWithStatus);
      setKycModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error fetching KYC details', error);
      showError('Failed to fetch KYC details');
    }
  };

  const handleViewFinanceLetter = async (bookingId) => {
    // CORRECTED: Check VIEW permission for current tab
    const canViewCurrentTab = canViewBookingInTab[activeTab];
    if (!canViewCurrentTab) {
      showError('You do not have permission to view finance letters in this tab');
      return;
    }
    
    try {
      setActionLoadingId(bookingId);
      setFinanceBookingId(bookingId);

      const booking = allData.find((b) => b._id === bookingId);
      if (!booking) {
        showError('Booking not found');
        return;
      }

      const financeDataWithStatus = {
        status: booking.documentStatus?.financeLetter?.status || 'PENDING',
        customerName: booking.customerDetails?.name || '',
        bookingId: booking._id,
        bookingType: 'SUBDEALER'
      };

      setFinanceData(financeDataWithStatus);
      setFinanceModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error viewing finance letter', error);
      showError(error.response?.data?.message || 'Failed to view finance letter');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateChassis = (bookingId) => {
    // CORRECTED: Check CREATE permission in ALLOCATED tab for changing vehicle
    if (!canUpdateChassisInAllocatedTab) {
      showError('You do not have permission to change vehicle in ALLOCATED tab');
      return;
    }
    
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(true);
    setShowChassisModal(true);
    handleClose();
  };

  const handleAllocateChassis = async (bookingId) => {
    // CORRECTED: Check CREATE permission in APPROVED tab for allocating chassis
    if (!canAllocateChassisInApprovedTab) {
      showError('You do not have permission to allocate chassis in APPROVED tab');
      return;
    }
    
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(false);
    setShowChassisModal(true);
    handleClose();
  };

  const handleSaveChassisNumber = async (payload) => {
    // CORRECTED: Check CREATE permission in respective tab
    let hasPermission = false;
    if (!isUpdateChassis) {
      // Allocating chassis in APPROVED tab - CREATE permission
      hasPermission = canAllocateChassisInApprovedTab;
    } else {
      // Updating chassis in ALLOCATED tab - CREATE permission
      hasPermission = canUpdateChassisInAllocatedTab;
    }
    
    if (!hasPermission) {
      showError('You do not have permission to save chassis number');
      return;
    }
    
    try {
      setChassisLoading(true);

      let url = `/bookings/${selectedBookingForChassis}/allocate`;
      const queryParams = [];
      
      if (isUpdateChassis && payload.reason) {
        queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
      }
    
      if (!isUpdateChassis && payload.reason) {
        queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const formData = new FormData();
      formData.append('chassisNumber', payload.chassisNumber);
      formData.append('is_deviation', payload.is_deviation);

      if (payload.note) {
        formData.append('note', payload.note);
      }
      
      if (payload.claimDetails) {
        formData.append('hasClaim', 'true');
        formData.append('priceClaim', payload.claimDetails.price);
        formData.append('description', payload.claimDetails.description);

        payload.claimDetails.documents.forEach((file, index) => {
          formData.append(`documents`, file);
        });
      } else {
        formData.append('hasClaim', 'false');
      }

      const response = await axiosInstance.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess(response.data.message);
      
      await fetchAllData();
      
      setShowChassisModal(false);
      setIsUpdateChassis(false);
      setSelectedBookingForChassis(null);
    } catch (error) {
      console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
      showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
    } finally {
      setChassisLoading(false);
    }
  };

  const handleViewAltrationRequest = (booking) => {
    // Check VIEW permission for PENDING APPROVALS tab
    if (!canViewPendingApprovalsTab) {
      showError('You do not have permission to view alteration requests in PENDING APPROVALS tab');
      return;
    }
    
    setSelectedUpdate(booking);
    setDetailsModalOpen(true);
    handleClose();
  };

  const handleApproveUpdate = async (id, payload) => {
    // Check CREATE permission in PENDING APPROVALS tab
    if (!canApproveUpdate) {
      showError('You do not have permission to approve updates in PENDING APPROVALS tab');
      return;
    }
    
    try {
      setLoadingId(id);
      await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
      showSuccess('Update approved successfully');
      
      await fetchAllData();
      
      setDetailsModalOpen(false);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectUpdate = async (id, payload) => {
    // Check DELETE permission in PENDING APPROVALS tab
    if (!canRejectUpdate) {
      showError('You do not have permission to reject updates in PENDING APPROVALS tab');
      return;
    }
    
    try {
      setLoadingId(id);
      await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
      showSuccess('Update rejected successfully');
      
      await fetchAllData();
      
      setDetailsModalOpen(false);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    // Check DELETE permission in PENDING APPROVALS tab
    if (!canDeleteBookingInPendingApprovals) {
      showError('You do not have permission to delete bookings in PENDING APPROVALS tab');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/bookings/${id}`);
        showSuccess('Booking deleted successfully');
        
        await fetchAllData();
        
      } catch (error) {
        console.log(error);
        showError(error.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Early return if no view permission for any tab
  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any Subdealer Booking tabs.
      </div>
    );
  }

  const renderBookingTable = (records, tabIndex) => {
    // Check if user has permission to view this specific tab
    const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
    // If user doesn't have VIEW permission for this tab, show message
    if (!canViewCurrentTab) {
      const tabNames = [
        "PENDING APPROVALS",
        "APPROVED", 
        "PENDING ALLOCATED",
        "ALLOCATED"
      ];
      
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view the {tabNames[tabIndex]} tab.
          </CAlert>
        </div>
      );
    }
    
    // Helper function to check if user can upload KYC in this tab
    const canUploadKycInThisTab = () => {
      switch(tabIndex) {
        case 0: return canUploadKycInPendingApprovals;
        case 1: return canUploadKycInApprovedTab;
        case 3: return canUploadKycInAllocatedTab;
        default: return false;
      }
    };
    
    // Helper function to check if user can upload Finance in this tab
    const canUploadFinanceInThisTab = () => {
      switch(tabIndex) {
        case 0: return canUploadFinanceInPendingApprovals;
        case 1: return canUploadFinanceInApprovedTab;
        case 3: return canUploadFinanceInAllocatedTab;
        default: return false;
      }
    };
    
    // Helper function to check if user can view finance letter in this tab
    const canViewFinanceLetterInThisTab = () => {
      switch(tabIndex) {
        case 0: return canViewFinanceLetterInPendingApprovals;
        case 1: return canViewFinanceLetterInApprovedTab;
        case 3: return canViewFinanceLetterInAllocatedTab;
        default: return false;
      }
    };
    
    // Helper function to check if user can edit in this tab
    const canEditInThisTab = () => {
      switch(tabIndex) {
        case 0: return canEditInPendingApprovalsTab;
        default: return false;
      }
    };
    
    // Helper function to check if user can print in this tab (PRINT requires CREATE)
    const canPrintInThisTab = () => {
      switch(tabIndex) {
        case 0: return canCreateInPendingApprovalsTab;  // Print in PENDING APPROVALS requires CREATE
        case 1: return canCreateInApprovedTab;          // Print in APPROVED requires CREATE
        case 2: return canCreateInPendingAllocatedTab;  // Print in PENDING ALLOCATED requires CREATE
        case 3: return canCreateInAllocatedTab;         // Print in ALLOCATED requires CREATE
        default: return false;
      }
    };
    
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              {tabIndex !== 2 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              {/* Only show Subdealer column if user is NOT a subdealer */}
              {!isSubdealer && <CTableHeaderCell scope="col">Subdealer</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              {tabIndex !== 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Color</CTableHeaderCell>
              <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
              {tabIndex !== 2 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
              {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
              {tabIndex !== 2 && tabIndex !== 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
              {tabIndex !== 2 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
              {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
              {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
              {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
              {tabIndex !== 2 && canViewCurrentTab && canPrintInThisTab() && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
              {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {records.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? (isSubdealer ? 15 : 16) : (isSubdealer ? 16 : 17)} style={{ color: 'red', textAlign: 'center' }}>
                  No subdealer bookings available
                </CTableDataCell>
              </CTableRow>
            ) : (
              records.map((booking, index) => (
                <CTableRow key={index}>
                  {tabIndex !== 2 && <CTableDataCell>{index + 1}</CTableDataCell>}
                  <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                  {/* Only show Subdealer data if user is NOT a subdealer */}
                  {!isSubdealer && (
                    <CTableDataCell>{booking.subdealer?.name || ''}</CTableDataCell>
                  )}
                  <CTableDataCell>{booking.model?.model_name || booking.model?.name || ''}</CTableDataCell>
                  {tabIndex !== 2 && <CTableDataCell>{booking.model?.type || ''}</CTableDataCell>}
                  <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
                  {tabIndex !== 2 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
                  {tabIndex !== 2 && tabIndex !== 3 && (
                    <CTableDataCell>
                      {booking.payment?.type === 'FINANCE' && canViewCurrentTab && canPrintInThisTab() && (
                        <CButton 
                          size="sm" 
                          className="view-button"
                          onClick={() => handlePrint(booking.id)}
                        >
                          Print
                        </CButton>
                      )}
                    </CTableDataCell>
                  )}
                  {tabIndex !== 2 && tabIndex !== 3 && (
                    <CTableDataCell>
                      {booking.payment?.type === 'FINANCE' && (
                        <>
                          {canUploadFinanceInThisTab() && (booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
                          booking.documentStatus?.financeLetter?.status === 'REJECTED') ? (
                            <Link
                              to={`/upload-finance/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails?.name || '',
                                address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
                                bookingType: 'SUBDEALER'
                              }}
                            >
                              <CButton size="sm" className="upload-kyc-btn icon-only">
                                <CIcon icon={cilCloudUpload} />
                              </CButton>
                            </Link>
                          ) : null}
                          {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
                            <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
                              {booking.documentStatus?.financeLetter?.status || ''}
                            </span>
                          )}
                        </>
                      )}
                    </CTableDataCell>
                  )}
                  {tabIndex !== 2 && (
                    <CTableDataCell>
                      {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
                        <Link
                          to={`/upload-kyc/${booking.id}`}
                          state={{
                            bookingId: booking.id,
                            customerName: booking.customerDetails?.name || '',
                            address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
                            bookingType: 'SUBDEALER'
                          }}
                        >
                          <CButton size="sm" className="upload-kyc-btn icon-only">
                            <CIcon icon={cilCloudUpload} />
                          </CButton>
                        </Link>
                      ) : (
                        <div className="d-flex align-items-center">
                          <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
                            {booking.documentStatus?.kyc?.status || ''}
                          </span>
                          {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'REJECTED' && (
                            <Link
                              to={`/upload-kyc/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails?.name || '',
                                address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`,
                                bookingType: 'SUBDEALER'
                              }}
                              className="ms-2"
                            >
                              <CButton size="sm" className="upload-kyc-btn icon-only">
                                <CIcon icon={cilCloudUpload} />
                              </CButton>
                            </Link>
                          )}
                        </div>
                      )}
                    </CTableDataCell>
                  )}
                  <CTableDataCell>
                    <span 
                      className="status-badge" 
                      style={{
                        backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
                                        booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
                                        booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
                                        booking.status === 'APPROVED' ? '#198754' : 
                                        booking.status === 'REJECTED' ? '#dc3545' : 
                                        booking.status === 'ALLOCATED' ? '#6f42c1' : 
                                        booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
                        color: booking.status === 'FREEZZED' ? '#000' : '#fff',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}
                    >
                      {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
                    </span>
                  </CTableDataCell>
                  {tabIndex === 0 && (
                    <CTableDataCell>
                      <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
                        {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
                      </span>
                    </CTableDataCell>
                  )}
                  {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
                  {tabIndex === 2 && (
                    <CTableDataCell>
                      <span className={`status-text ${booking.status}`}>
                        {booking.claimDetails?.hasClaim ? (
                          <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
                        ) : (
                          <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
                        )}
                      </span>
                    </CTableDataCell>
                  )}
                  {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber || ''}</CTableDataCell>}
                  {tabIndex !== 2 && canViewCurrentTab && canPrintInThisTab() && (
                    <CTableDataCell>
                      {booking.formPath && (
                        <>
                          {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
                            <span className="awaiting-approval-text">Awaiting for Approval</span>
                          ) : (
                            <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
                              <CButton size="sm" className="upload-kyc-btn icon-only">
                                <CIcon icon={cilPrint} />
                              </CButton>
                            </a>
                          )}
                        </>
                      )}
                    </CTableDataCell>
                  )}
                  {tabIndex === 2 && <CTableDataCell>{booking.note || ''}</CTableDataCell>}
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      className='option-button btn-sm'
                      onClick={(event) => handleClick(event, booking.id)}
                    >
                      <CIcon icon={cilSettings} />
                      Options
                    </CButton>
                    <Menu 
                      id={`action-menu-${booking.id}`} 
                      anchorEl={anchorEl} 
                      open={menuId === booking.id} 
                      onClose={handleClose}
                    >
                      {canViewCurrentTab && (
                        <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
                          <CIcon icon={cilZoomOut} className="me-2" /> View Booking
                        </MenuItem>
                      )}
                      {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && canViewCurrentTab && (
                        <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
                          <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
                        </MenuItem>
                      )}

                      {canEditInThisTab() && (
                        <>
                          {tabIndex !== 2 && tabIndex !== 3 && booking.status !== 'FREEZZED' && (
                            <Link className="Link" to={`/update-subdealer-booking/${booking.id}`} style={{ textDecoration: 'none' }}>
                              <MenuItem style={{ color: 'black' }}>
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </MenuItem>
                            </Link>
                          )}
                        </>
                      )}

                      {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
                        <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
                          <CIcon icon={cilTrash} className="me-2" /> Delete
                        </MenuItem>
                      )}

                      {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewFinanceLetterInThisTab() && (
                        <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
                          <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
                        </MenuItem>
                      )}

                      {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && canViewCurrentTab && (
                        <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
                          <CIcon icon={cilZoomOut} className="me-2" /> View KYC
                        </MenuItem>
                      )}

                      {tabIndex === 1 && canAllocateChassisInApprovedTab && (
                        <>
                          {booking.status === 'APPROVED' &&
                            (booking.payment?.type === 'CASH' ||
                              (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
                              <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
                                <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
                              </MenuItem>
                            )}
                        </>
                      )}
                      {tabIndex === 3 && canUpdateChassisInAllocatedTab && (
                        <>
                          {booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
                            <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
                              <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
                            </MenuItem>
                          )}
                        </>
                      )}

                      {/* Approve/Reject Chassis - Different permissions for each */}
                      {tabIndex === 2 && booking.status === 'ON_HOLD' && (
                        <>
                          {canApproveChassis && (
                            <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
                              <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
                            </MenuItem>
                          )}
                          {canRejectChassis && (
                            <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
                              <CIcon icon={cilX} className="me-2" /> Reject Chassis
                            </MenuItem>
                          )}
                        </>
                      )}

                      {/* Available Documents Option - Only for Approved tab */}
                      {tabIndex === 1 && booking.status === 'APPROVED' && canViewAvailableDocumentsInApprovedTab && (
                        <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
                          <CIcon icon={cilFile} className="me-2" /> Available Documents
                        </MenuItem>
                      )}
                      
                      {tabIndex === 0 && booking.status === 'FREEZZED' && canEditInPendingApprovalsTab && canViewCurrentTab && (
                        <MenuItem 
                          onClick={() => window.location.href = '/#/self-insurance'} 
                          style={{ color: 'black' }}
                        >
                          <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
                        </MenuItem>
                      )}
                    </Menu>
                  </CTableDataCell>
                </CTableRow>
              ))
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
      <div className='title'>Subdealers Booking</div>
      {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateNewBooking && (
              <Link to="/subdealer-booking">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Booking
                </CButton>
              </Link>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            {/* Only show Pending Approvals tab if user has VIEW permission for it */}
            {canViewPendingApprovalsTab && (
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
                  Pending Approvals
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Approved tab if user has VIEW permission for it */}
            {canViewApprovedTab && (
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
                  Approved
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Pending Allocated tab if user has VIEW permission for it */}
            {canViewPendingAllocatedTab && (
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
                  Pending Allocated
                </CNavLink>
              </CNavItem>
            )}
            {/* Only show Allocated tab if user has VIEW permission for it */}
            {canViewAllocatedTab && (
              <CNavItem>
                <CNavLink
                  active={activeTab === 3}
                  onClick={() => handleTabChange(3)}
                  style={{ 
                    cursor: 'pointer',
                    borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
                    borderBottom: 'none',
                    color: 'black'
                  }}
                >
                  Allocated
                </CNavLink>
              </CNavItem>
            )}
          </CNav>

          <div className="d-flex justify-content-between mb-3">
           
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
                }}
              />
            </div>
          </div>

          <CTabContent>
            {/* Only render Pending Approvals tab if user has VIEW permission for it */}
            {canViewPendingApprovalsTab && (
              <CTabPane visible={activeTab === 0}>
                {renderBookingTable(pendingRecords, 0)}
              </CTabPane>
            )}
            {/* Only render Approved tab if user has VIEW permission for it */}
            {canViewApprovedTab && (
              <CTabPane visible={activeTab === 1}>
                {renderBookingTable(approvedRecords, 1)}
              </CTabPane>
            )}
            {/* Only render Pending Allocated tab if user has VIEW permission for it */}
            {canViewPendingAllocatedTab && (
              <CTabPane visible={activeTab === 2}>
                {renderBookingTable(pendingAllocatedRecords, 2)}
              </CTabPane>
            )}
            {/* Only render Allocated tab if user has VIEW permission for it */}
            {canViewAllocatedTab && (
              <CTabPane visible={activeTab === 3}>
                {renderBookingTable(allocatedRecords, 3)}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Available Documents Modal */}
      <CModal 
        visible={availableDocsModal} 
        onClose={() => {
          setAvailableDocsModal(false);
          setSelectedBookingForDocs(null);
          setAvailableTemplates(null);
          setSelectedTemplateIds([]);
          setTemplateNotes('');
        }}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Available Documents - {availableTemplates?.booking_number || ''}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingTemplates ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading available documents...</p>
            </div>
          ) : availableTemplates ? (
            <div>
              <div className="mb-3">
                <h6>Customer: {availableTemplates.customer_name}</h6>
                <div className="alert alert-info mb-3">
                  <small>
                    <strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} templates are available for download.
                  </small>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Available Templates ({availableTemplates.available_templates.count})</h6>
                  <div className="d-flex gap-2">
                    <CButton 
                      size="sm" 
                      color="primary" 
                      variant="outline"
                      onClick={handleSelectAllAvailable}
                      disabled={!availableTemplates?.available_templates?.templates?.length}
                    >
                      Select All
                    </CButton>
                    <CButton 
                      size="sm" 
                      color="secondary" 
                      variant="outline"
                      onClick={handleClearSelection}
                    >
                      Clear All
                    </CButton>
                  </div>
                </div>
                
                {availableTemplates.available_templates.templates.length > 0 ? (
                  <div className="border rounded p-3">
                    {availableTemplates.available_templates.templates.map((template) => (
                      <div key={template.template_id} className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`template-${template.template_id}`}
                            checked={selectedTemplateIds.includes(template.template_id)}
                            onChange={() => handleTemplateSelection(template.template_id, template.can_download)}
                            disabled={!template.can_download}
                          />
                          <label 
                            className="form-check-label d-flex justify-content-between align-items-center w-100"
                            htmlFor={`template-${template.template_id}`}
                            style={{ cursor: template.can_download ? 'pointer' : 'not-allowed', opacity: template.can_download ? 1 : 0.6 }}
                          >
                            <div>
                              <strong>{template.template_name}</strong>
                              <br />
                              <small className="text-muted">
                                {template.can_download ? 'Available for download' : 'Not available for download'}
                              </small>
                            </div>
                            {!template.can_download && (
                              <small className="text-danger">
                                <CIcon icon={cilXCircle} className="me-1" />
                                Disabled
                              </small>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 border rounded">
                    <CIcon icon={cilFile} size="lg" className="text-muted mb-2" />
                    <p className="text-muted mb-0">No templates available for download</p>
                  </div>
                )}

                <div className="mt-4">
                  <CFormLabel>Notes (Optional):</CFormLabel>
                  <CFormTextarea
                    value={templateNotes}
                    onChange={(e) => setTemplateNotes(e.target.value)}
                    rows={2}
                    placeholder="Add any notes about the selected templates..."
                  />
                </div>
              </div>
            </div>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setAvailableDocsModal(false);
              setSelectedBookingForDocs(null);
              setAvailableTemplates(null);
              setSelectedTemplateIds([]);
              setTemplateNotes('');
            }}
          >
            Cancel
          </CButton>
          <CButton 
            color="primary"
            onClick={handleSubmitTemplateSelection}
            disabled={selectedTemplateIds.length === 0 || submittingSelection}
          >
            {submittingSelection ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `Select (${selectedTemplateIds.length}) Templates`
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Chassis Approval Modal */}
      <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>
              {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
            </CFormLabel>
            <CFormTextarea
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              rows={3}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
            onClick={handleChassisApprovalSubmit}
            disabled={approvalLoading}
          >
            {approvalLoading ? (
              <CSpinner size="sm" />
            ) : (
              approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      <ViewBooking 
        open={viewModalVisible} 
        onClose={() => setViewModalVisible(false)} 
        booking={selectedBooking} 
        refreshData={fetchAllData}
      />
      <KYCView
        open={kycModalVisible}
        onClose={() => {
          setKycModalVisible(false);
          setKycBookingId(null);
        }}
        kycData={kycData}
        refreshData={fetchAllData}
        bookingId={kycBookingId}
      />
      <FinanceView
        open={financeModalVisible}
        onClose={() => {
          setFinanceModalVisible(false);
          setFinanceBookingId(null);
        }}
        financeData={financeData}
        refreshData={fetchAllData}
        bookingId={financeBookingId}
      />
      <SubDealerChassisNumberModal
        show={showChassisModal}
        onClose={() => {
          setShowChassisModal(false);
          setIsUpdateChassis(false);
          setSelectedBookingForChassis(null);
        }}
        onSave={handleSaveChassisNumber}
        isLoading={chassisLoading}
        booking={allData.find((b) => b._id === selectedBookingForChassis)}
        isUpdate={isUpdateChassis}
      />
      <PrintModal
        show={printModalVisible}
        onClose={() => {
          setPrintModalVisible(false);
          setSelectedBookingForPrint(null);
        }}
        bookingId={selectedBookingForPrint}
        bookingType="SUBDEALER"
      />
      <PendingUpdateDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        updateData={selectedUpdate}
        onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
        onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
      />
    </div>
  );
};

export default AllBooking;