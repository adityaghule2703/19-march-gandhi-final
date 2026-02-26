
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
// } from '../../../utils/tableImports';
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
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import { 
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
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CFormLabel,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea,
//   CAlert,
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
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
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// const BookingList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [allData, setAllData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Export Excel states
//   const [exportLoading, setExportLoading] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date().toISOString().split('T')[0]
//   });
//   const [showExportModal, setShowExportModal] = useState(false);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
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
//   const [chassisError, setChassisError] = useState('');
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);
  
//   // Restore Booking Modal States
//   const [restoreBookingModal, setRestoreBookingModal] = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason, setRestoreReason] = useState('');
//   const [restoreNotes, setRestoreNotes] = useState('');
//   const [restoreLoading, setRestoreLoading] = useState(false);
//   const [restoreType, setRestoreType] = useState('');

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

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);
//   const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
//   const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
//   const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);

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
  
//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem('userRole');

//   // ========== TAB-LEVEL VIEW PERMISSIONS ==========
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canViewRejectedDiscountTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canViewCancelledBookingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canViewRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL CREATE PERMISSIONS ==========
//   const canCreateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canCreateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canCreateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canCreateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canCreateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canCreateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
//   const canUpdateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canUpdateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canUpdateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canUpdateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canUpdateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canUpdateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canUpdateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL DELETE PERMISSIONS ==========
//   const canDeleteInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canDeleteInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canDeleteInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canDeleteInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canDeleteInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canDeleteInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canDeleteInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
//   // Approve Chassis - uses CREATE permission in PENDING ALLOCATED tab
//   const canApproveChassis = canCreateInPendingAllocatedTab;
  
//   // REVISED: Reject Chassis - uses CREATE permission in PENDING ALLOCATED tab (not DELETE)
//   const canRejectChassis = canCreateInPendingAllocatedTab;
  
//   // Approve Cancellation - uses CREATE permission in CANCELLED BOOKING tab
//   const canApproveCancellation = canCreateInCancelledBookingTab;
  
//   // REVISED: Reject Cancellation - uses CREATE permission in CANCELLED BOOKING tab (not DELETE)
//   const canRejectCancellation = canCreateInCancelledBookingTab;
  
//   // Restore Booking - uses CREATE permission in respective tabs
//   const canRestoreFromRejectedDiscount = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
  
//   // Approve Update - uses CREATE permission in PENDING APPROVALS tab
//   const canApproveUpdate = canCreateInPendingApprovalsTab;
  
//   // REVISED: Reject Update - uses CREATE permission in PENDING APPROVALS tab (not DELETE)
//   const canRejectUpdate = canCreateInPendingApprovalsTab;
  
//   // Allocate Chassis - uses CREATE permission in APPROVED tab (creating chassis allocation)
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
  
//   // Update/Change Vehicle - uses CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
//   const canUpdateChassisInAllocatedTab = canCreateInAllocatedTab;
  
//   // Edit Booking - uses UPDATE permission in respective tabs
//   const canEditInPendingApprovalsTab = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab = canUpdateInRejectedDiscountTab;
  
//   // Delete Booking - uses DELETE permission in respective tabs
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
  
//   // Upload KYC - uses CREATE permission in respective tabs
//   const canUploadKycInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount = canCreateInRejectedDiscountTab;
  
//   // Upload Finance - uses CREATE permission in respective tabs
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;
  
//   // REVISED: Print button - uses CREATE permission in respective tabs
//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab,  // PENDING APPROVALS
//     1: canCreateInApprovedTab,          // APPROVED
//     2: canCreateInPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canCreateInAllocatedTab,         // ALLOCATED
//     4: canCreateInRejectedDiscountTab,  // REJECTED DISCOUNT
//     5: canCreateInCancelledBookingTab,  // CANCELLED BOOKING
//     6: canCreateInRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
//   };
  
//   // View specific permissions for tabs
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,  // PENDING APPROVALS
//     1: canViewApprovedTab,          // APPROVED
//     2: canViewPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canViewAllocatedTab,         // ALLOCATED
//     4: canViewRejectedDiscountTab,  // REJECTED DISCOUNT
//     5: canViewCancelledBookingTab,  // CANCELLED BOOKING
//     6: canViewRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
//   };
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingApprovalsTab || canViewApprovedTab || 
//                        canViewPendingAllocatedTab || canViewAllocatedTab || 
//                        canViewRejectedDiscountTab || canViewCancelledBookingTab || 
//                        canViewRejectedCancelledBookingTab;

//   // Page-level permission checks (for backward compatibility)
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canUpdateAllBooking = canUpdateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canDeleteAllBooking = canDeleteInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingApprovalsTab) visibleTabs.push(0);
//     if (canViewApprovedTab) visibleTabs.push(1);
//     if (canViewPendingAllocatedTab) visibleTabs.push(2);
//     if (canViewAllocatedTab) visibleTabs.push(3);
//     if (canViewRejectedDiscountTab) visibleTabs.push(4);
//     if (canViewCancelledBookingTab) visibleTabs.push(5);
//     if (canViewRejectedCancelledBookingTab) visibleTabs.push(6);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, 
//       canViewAllocatedTab, canViewRejectedDiscountTab, canViewCancelledBookingTab, 
//       canViewRejectedCancelledBookingTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchAllData();
//   }, []);

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
//       const response = await axiosInstance.get(`/bookings`);
//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');

//       setAllData(branchBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = branchBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//       const rejectedBookings = branchBookings.filter((booking) => booking.status === 'REJECTED');
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
//         params: { status: 'PENDING' }
//       });
//       setCancelledPendingData(pendingResponse.data.data);
//       setFilteredCancelledPending(pendingResponse.data.data);
      
//       const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { status: 'REJECTED' }
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

//   // Function to get auth token
//   const getAuthToken = () => {
//     // Try to get token from useAuth context first
//     if (token) {
//       return token;
//     }
    
//     // Fallback to localStorage
//     const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
//     return storedToken;
//   };

//   // Function to handle Excel export
//   const handleExportExcel = () => {
//     setShowExportModal(true);
//   };

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
      
//       // Get auth token
//       const authToken = getAuthToken();
//       if (!authToken) {
//         showError('Please login to access this resource');
//         setExportLoading(false);
//         setShowExportModal(false);
//         return;
//       }
      
//       // Get branchId from user data or localStorage
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420'; // Default branch ID
      
//       // Format dates
//       const { startDate, endDate } = exportDateRange;
      
//       // Construct the export URL with query parameters
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
      
//       // Create a temporary link element to trigger download with authorization header
//       const link = document.createElement('a');
//       link.href = exportUrl;
//       link.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
      
//       // Set authorization header for the request
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
      
//       xhr.onload = function() {
//         if (xhr.status === 200) {
//           // Create a blob from the response
//           const blob = new Blob([xhr.response], { 
//             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//           });
          
//           // Create a URL for the blob
//           const url = window.URL.createObjectURL(blob);
          
//           // Create a temporary link and trigger download
//           const tempLink = document.createElement('a');
//           tempLink.href = url;
//           tempLink.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(tempLink);
//           tempLink.click();
//           document.body.removeChild(tempLink);
          
//           // Clean up
//           window.URL.revokeObjectURL(url);
          
//           showSuccess('Excel file downloaded successfully!');
//           setShowExportModal(false);
//         } else if (xhr.status === 401) {
//           showError('Please login to access this resource');
//         } else {
//           showError('Failed to download Excel file');
//         }
//         setExportLoading(false);
//       };
      
//       xhr.onerror = function() {
//         showError('Network error occurred while downloading Excel file');
//         setExportLoading(false);
//       };
      
//       xhr.send();
      
//     } catch (error) {
//       console.error('Error exporting Excel:', error);
//       showError('Failed to export Excel file');
//       setExportLoading(false);
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

//   const handleOpenRestoreModal = (bookingId, type) => {
//     // Check CREATE permission based on the tab
//     if (type === 'rejected_discount') {
//       if (!canRestoreFromRejectedDiscount) {
//         showError('You do not have permission to restore from REJECTED DISCOUNT tab');
//         return;
//       }
//     } else if (type === 'cancelled') {
//       if (!canRestoreFromRejectedCancelled) {
//         showError('You do not have permission to restore from REJECTED CANCELLED BOOKING tab');
//         return;
//       }
//     }
    
//     setSelectedRestoreBooking(bookingId);
//     setRestoreType(type);
//     setRestoreReason('');
//     setRestoreNotes('');
//     setRestoreBookingModal(true);
//     handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     // Check CREATE permission based on the type
//     let hasPermission = false;
//     if (restoreType === 'cancelled') {
//       hasPermission = canRestoreFromRejectedCancelled;
//     } else if (restoreType === 'rejected_discount') {
//       hasPermission = canRestoreFromRejectedDiscount;
//     }

//     if (!hasPermission) {
//       showError('You do not have permission to restore bookings');
//       return;
//     }

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

//   const handleOpenAvailableDocs = async (bookingId) => {
//     // Use VIEW permission for viewing available documents
//     if (!canViewAllBooking) {
//       showError('You do not have permission to view available documents');
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
//     // Use UPDATE permission for selecting templates in APPROVED tab
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

//   const handleApproveCancellation = (cancellation) => {
//     // Use CREATE permission in CANCELLED BOOKING tab
//     if (!canApproveCancellation) {
//       showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
//     // Use CREATE permission in CANCELLED BOOKING tab
//     if (!canRejectCancellation) {
//       showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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
//         // Check CREATE permission in CANCELLED BOOKING tab
//         if (!canApproveCancellation) {
//           showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
//         // Check CREATE permission in CANCELLED BOOKING tab
//         if (!canRejectCancellation) {
//           showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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

//   const handleApproveChassis = (bookingId) => {
//     // Use CREATE permission in PENDING ALLOCATED tab
//     if (!canApproveChassis) {
//       showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     // Use CREATE permission in PENDING ALLOCATED tab
//     if (!canRejectChassis) {
//       showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval) return;

//     try {
//       setApprovalLoading(true);
      
//       if (approvalAction === 'APPROVE') {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canApproveChassis) {
//           showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
//           return;
//         }
//       } else {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canRejectChassis) {
//           showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
//           return;
//         }
//       }

//       if (!approvalNote.trim()) {
//         showError('Please enter approval/rejection note');
//         return;
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
//     // REVISED: Check CREATE permission for current tab
//     const canCreateCurrentTab = canPrintInTab[activeTab];
//     if (!canCreateCurrentTab) {
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
//       showError('You do not have permission to view KYC in this tab');
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
//         customerName: booking.customerDetails.name,
//         address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     // Check VIEW permission for current tab
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
//         customerName: booking.customerDetails.name,
//         bookingId: booking._id
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleAllocateChassis = (bookingId) => {
//     // Check CREATE permission in APPROVED tab (creating chassis allocation)
//     if (!canAllocateChassisInApprovedTab) {
//       showError('You do not have permission to allocate chassis in APPROVED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleUpdateChassis = (bookingId) => {
//     // Check CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
//     if (!canUpdateChassisInAllocatedTab) {
//       showError('You do not have permission to update chassis in ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//   // Check CREATE permission in respective tab
//   let hasPermission = false;
//   if (!isUpdateChassis) {
//     // Allocating chassis in APPROVED tab - CREATE permission
//     hasPermission = canAllocateChassisInApprovedTab;
//   } else {
//     // Updating chassis in ALLOCATED tab - CREATE permission
//     hasPermission = canUpdateChassisInAllocatedTab;
//   }
  
//   if (!hasPermission) {
//     showError('You do not have permission to save chassis number');
//     return;
//   }
  
//   try {
//     setChassisLoading(true);
//     setChassisError(''); // Clear any previous error

//     let url = `/bookings/${selectedBookingForChassis}/allocate`;
//     const queryParams = [];
    
//     if (isUpdateChassis && payload.reason) {
//       queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//     }
  
//     if (!isUpdateChassis && payload.reason) {
//       queryParams.push(`reason=${encodeURIComponent(payload.reason)}`);
//     }

//     if (queryParams.length > 0) {
//       url += `?${queryParams.join('&')}`;
//     }

//     const formData = new FormData();
//     formData.append('chassisNumber', payload.chassisNumber);
//     formData.append('is_deviation', payload.is_deviation);

//     if (payload.note) {
//       formData.append('note', payload.note);
//     }
    
//     if (payload.claimDetails) {
//       formData.append('hasClaim', 'true');
//       formData.append('priceClaim', payload.claimDetails.price);
//       formData.append('description', payload.claimDetails.description);

//       payload.claimDetails.documents.forEach((file, index) => {
//         formData.append(`documents`, file);
//       });
//     } else {
//       formData.append('hasClaim', 'false');
//     }

//     const response = await axiosInstance.put(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     showSuccess(response.data.message);
    
//     await fetchAllData();
    
//     setShowChassisModal(false);
//     setIsUpdateChassis(false);
//     setSelectedBookingForChassis(null);
//     setChassisError(''); // Clear error on success
//   } catch (error) {
//     console.error('Error saving chassis number:', error);
    
//     // Extract error message from response
//     const errorMessage = error.response?.data?.message || 
//                         error.response?.data?.error || 
//                         error.message || 
//                         'Failed to save chassis number';
    
//     // Set the error to show in the modal
//     setChassisError(errorMessage);
    
//     // Also show the toast if needed
//     showError(errorMessage);
//   } finally {
//     setChassisLoading(false);
//   }
// };

// // Add this function to clear the chassis error
// const handleClearChassisError = () => {
//   setChassisError('');
// };

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
//     // Use CREATE permission in PENDING APPROVALS tab
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
//     // Use CREATE permission in PENDING APPROVALS tab
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
//     // Check DELETE permission based on current tab
//     let hasPermission = false;
//     if (activeTab === 0) {
//       hasPermission = canDeleteBookingInPendingApprovals;
//     } else if (activeTab === 4) {
//       hasPermission = canDeleteBookingInRejectedDiscount;
//     }
    
//     if (!hasPermission) {
//       showError('You do not have permission to delete bookings in this tab');
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
  
//   const renderBookingTable = (records, tabIndex) => {
//     // Check if user has permission to view this specific tab
//     const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
//     // REVISED: Check if user has CREATE permission for printing in this tab
//     const canCreateCurrentTab = canPrintInTab[tabIndex];
    
//     // If user doesn't have VIEW permission for this tab, show message
//     if (!canViewCurrentTab) {
//       const tabNames = [
//         "PENDING APPROVALS",
//         "APPROVED", 
//         "PENDING ALLOCATED",
//         "ALLOCATED",
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
    
//     // Helper function to check if user can upload KYC in this tab
//     const canUploadKycInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadKycInPendingApprovals;
//         case 1: return canUploadKycInApprovedTab;
//         case 3: return canUploadKycInAllocatedTab;
//         case 4: return canUploadKycInRejectedDiscount;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can upload Finance in this tab
//     const canUploadFinanceInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadFinanceInPendingApprovals;
//         case 1: return canUploadFinanceInApprovedTab;
//         case 3: return canUploadFinanceInAllocatedTab;
//         case 4: return canUploadFinanceInRejectedDiscount;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can edit in this tab
//     const canEditInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canEditInPendingApprovalsTab;
//         case 4: return canEditInRejectedDiscountTab;
//         default: return false;
//       }
//     };
    
//     if (tabIndex === 5 || tabIndex === 6) {
//       return (
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                 {tabIndex === 6 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
//                 {tabIndex === 5 && (
//                   <CTableHeaderCell scope="col">Options</CTableHeaderCell>
//                 )}
//                 {tabIndex === 6 && (
//                   <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
//                 )}
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={tabIndex === 6 ? 12 : 11} style={{ color: 'red', textAlign: 'center' }}>
//                     No cancellation requests available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 records.map((cancellation, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{index + 1}</CTableDataCell>
//                     <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
//                     <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
//                     <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
//                     <CTableDataCell>
//                       <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
//                         {cancellation.cancellationRequest?.status || 'N/A'}
//                       </span>
//                     </CTableDataCell>
//                     {tabIndex === 6 && (
//                       <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
//                     )}
//                     {tabIndex === 5 && (
//                       <CTableDataCell>
//                         <div className="d-flex">
//                           <CButton
//                             size="sm"
//                             className="me-2"
//                             color="success"
//                             onClick={() => handleApproveCancellation(cancellation)}
//                             disabled={!canApproveCancellation}
//                           >
//                             <CIcon icon={cilCheck} /> Approve
//                           </CButton>
//                           <CButton
//                             size="sm"
//                             color="danger"
//                             onClick={() => handleRejectCancellation(cancellation)}
//                             disabled={!canRejectCancellation}
//                           >
//                             <CIcon icon={cilX} /> Reject
//                           </CButton>
//                         </div>
//                       </CTableDataCell>
//                     )}
//                     {tabIndex === 6 && (
//                       <CTableDataCell>
//                         <CButton
//                           size="sm"
//                           color="primary"
//                           onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled')}
//                           disabled={!canRestoreFromRejectedCancelled}
//                         >
//                           Back to Normal
//                         </CButton>
//                       </CTableDataCell>
//                     )}
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//       );
//     }

//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//               {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 || tabIndex === 4 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                   No booking available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                   {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                   {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                   {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                   {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && canCreateCurrentTab && (
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
//                   {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                     <CTableDataCell>
//                       {booking.payment?.type === 'FINANCE' && (
//                         <>
//                           {canUploadFinanceInThisTab() && (booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus?.financeLetter?.status === 'REJECTED') ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name,
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
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
//                   {tabIndex != 2 && tabIndex != 4 && (
//                     <CTableDataCell>
//                       {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                         <Link
//                           to={`/upload-kyc/${booking.id}`}
//                           state={{
//                             bookingId: booking.id,
//                             customerName: booking.customerDetails?.name,
//                             address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
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
//                                 customerName: booking.customerDetails?.name,
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                               }}
//                               className="ms-2"
//                             >
//                               <button className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </button>
//                             </Link>
//                           )}
//                         </div>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell>
//                     {/* Show "FROZEN" for FREEZZED status */}
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
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
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
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                   {/* {tabIndex != 2 && tabIndex != 4 && (
//                     <CTableDataCell>
//                       {booking.formPath && (
//                         <>
//                           {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : canCreateCurrentTab && (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilPrint} />
//                               </CButton>
//                             </a>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )} */}

//                   {tabIndex != 2 && tabIndex != 4 && (
//   <CTableDataCell>
//     {booking.formPath && (
//       <>
//         {/* Check if user is SALES_EXECUTIVE using user.is_sales_executive */}
//         {user?.is_sales_executive &&
//         booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//           <span className="awaiting-approval-text">Awaiting for Approval</span>
//         ) : (
//           canCreateCurrentTab && (
//             <a
//               href={`${config.baseURL}${booking.formPath}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <CButton size="sm" className="upload-kyc-btn icon-only">
//                 <CIcon icon={cilPrint} />
//               </CButton>
//             </a>
//           )
//         )}
//       </>
//     )}
//   </CTableDataCell>
// )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}
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

//                      {canEditInThisTab() && (
//   <>
//     {(tabIndex === 4) && canRestoreFromRejectedDiscount && (
//       <MenuItem onClick={() => handleOpenRestoreModal(booking.id, 'rejected_discount')} style={{ color: 'black' }}>
//         <CIcon icon={cilCheck} className="me-2" /> Back to Normal
//       </MenuItem>
//     )}
//     {/* Disable edit for frozen bookings AND approved bookings */}
//     {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//       <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//         <MenuItem style={{ color: 'black' }}>
//           <CIcon icon={cilPencil} className="me-2" /> Edit
//         </MenuItem>
//       </Link>
//     )}
//   </>
// )}

//   {/* Edit button specifically for APPROVED tab */}
//   {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//     <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//       <MenuItem style={{ color: 'black' }}>
//         <CIcon icon={cilPencil} className="me-2" /> Edit
//       </MenuItem>
//     </Link>
//   )}

//                       {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                         <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilTrash} className="me-2" /> Delete
//                         </MenuItem>
//                       )}
//                       {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                         <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilTrash} className="me-2" /> Delete
//                         </MenuItem>
//                       )}

//                       {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewCurrentTab && (
//                         <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                         </MenuItem>
//                       )}

//                       {canViewCurrentTab && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                         <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                         </MenuItem>
//                       )}

//                       {/* Allocate Chassis - Check CREATE permission in APPROVED tab */}
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
//                       {/* Change Vehicle - Check CREATE permission in ALLOCATED tab */}
//                       {tabIndex === 3 && canUpdateChassisInAllocatedTab && (
//                         <>
//                           {booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                             <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
//                             </MenuItem>
//                           )}
//                         </>
//                       )}

//                       {/* Approve/Reject Chassis - CREATE permission for both */}
//                       {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
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
//                       {tabIndex === 1 && booking.status === 'APPROVED' && canViewCurrentTab && (
//                         <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                           <CIcon icon={cilFile} className="me-2" /> Available Documents
//                         </MenuItem>
//                       )}
                      
//                       {/* Self Insurance Management Option - Only for Frozen bookings */}
//                       {tabIndex === 0 && booking.status === 'FREEZZED' && canViewCurrentTab && (
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

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in All Booking.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Booking List</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//             {/* <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleExportExcel}
//               disabled={exportLoading}
//             >
//               {exportLoading ? (
//                 <>
//                   <CSpinner size="sm" className="me-2" />
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilFile} className='icon'/> Export Excel
//                 </>
//               )}
//             </CButton> */}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingApprovalsTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       Pending Approvals
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewApprovedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Approved
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewPendingAllocatedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 2}
//                       onClick={() => handleTabChange(2)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Pending Allocated
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewAllocatedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 3}
//                       onClick={() => handleTabChange(3)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Allocated
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewRejectedDiscountTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 4}
//                       onClick={() => handleTabChange(4)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Rejected Discount
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCancelledBookingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 5}
//                       onClick={() => handleTabChange(5)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 5 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Cancelled Booking
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewRejectedCancelledBookingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 6}
//                       onClick={() => handleTabChange(6)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 6 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Rejected Cancelled Booking
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 4) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
//                       else if (activeTab === 5) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
//                       else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
//                     }}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingApprovalsTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderBookingTable(pendingRecords, 0)}
//                   </CTabPane>
//                 )}
//                 {canViewApprovedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderBookingTable(approvedRecords, 1)}
//                   </CTabPane>
//                 )}
//                 {canViewPendingAllocatedTab && (
//                   <CTabPane visible={activeTab === 2}>
//                     {renderBookingTable(pendingAllocatedRecords, 2)}
//                   </CTabPane>
//                 )}
//                 {canViewAllocatedTab && (
//                   <CTabPane visible={activeTab === 3}>
//                     {renderBookingTable(allocatedRecords, 3)}
//                   </CTabPane>
//                 )}
//                 {canViewRejectedDiscountTab && (
//                   <CTabPane visible={activeTab === 4}>
//                     {renderBookingTable(rejectedRecords, 4)}
//                   </CTabPane>
//                 )}
//                 {canViewCancelledBookingTab && (
//                   <CTabPane visible={activeTab === 5}>
//                     {cancelledLoading ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       renderBookingTable(cancelledPendingRecords, 5)
//                     )}
//                   </CTabPane>
//                 )}
//                 {canViewRejectedCancelledBookingTab && (
//                   <CTabPane visible={activeTab === 6}>
//                     {cancelledLoading ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       renderBookingTable(cancelledRejectedRecords, 6)
//                     )}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in All Booking.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Export Excel Modal */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Export Excel Report
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Start Date:</CFormLabel>
//             <CFormInput
//               type="date"
//               value={exportDateRange.startDate}
//               onChange={(e) => setExportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//             />
//           </div>
//           <div className="mb-3">
//             <CFormLabel>End Date:</CFormLabel>
//             <CFormInput
//               type="date"
//               value={exportDateRange.endDate}
//               onChange={(e) => setExportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//               min={exportDateRange.startDate}
//             />
//           </div>
//           <CAlert color="info">
//             <small>
//               This will export the branch sales report for the selected date range in Excel format.
//             </small>
//           </CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleExportConfirm}
//             disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : (
//               'Export Excel'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

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
//       <ChassisNumberModal
//   show={showChassisModal}
//   onClose={() => {
//     setShowChassisModal(false);
//     setIsUpdateChassis(false);
//     setSelectedBookingForChassis(null);
//     setChassisError(''); // Clear error when closing modal
//   }}
//   onSave={handleSaveChassisNumber}
//   isLoading={chassisLoading}
//   booking={allData.find((b) => b._id === selectedBookingForChassis)}
//   isUpdate={isUpdateChassis}
//   errorMessage={chassisError} // Pass error to modal
//   onClearError={handleClearChassisError} // Pass clear function
// />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
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

// export default BookingList;





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
// } from '../../../utils/tableImports';
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
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import { 
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
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CFormLabel,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
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
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// const BookingList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [allData, setAllData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Server-side pagination states for each tab
//   const [pagination, setPagination] = useState({
//     0: { currentPage: 1, totalPages: 1, total: 0 }, // PENDING_APPROVALS
//     1: { currentPage: 1, totalPages: 1, total: 0 }, // APPROVED
//     2: { currentPage: 1, totalPages: 1, total: 0 }, // PENDING_ALLOCATED
//     3: { currentPage: 1, totalPages: 1, total: 0 }, // ALLOCATED
//     4: { currentPage: 1, totalPages: 1, total: 0 }, // REJECTED
//     5: { currentPage: 1, totalPages: 1, total: 0 }, // CANCELLED_BOOKING
//     6: { currentPage: 1, totalPages: 1, total: 0 }  // REJECTED_CANCELLED_BOOKING
//   });
  
//   // Export Excel states
//   const [exportLoading, setExportLoading] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date().toISOString().split('T')[0]
//   });
//   const [showExportModal, setShowExportModal] = useState(false);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
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
//   const [chassisError, setChassisError] = useState('');
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);
  
//   // Restore Booking Modal States
//   const [restoreBookingModal, setRestoreBookingModal] = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason, setRestoreReason] = useState('');
//   const [restoreNotes, setRestoreNotes] = useState('');
//   const [restoreLoading, setRestoreLoading] = useState(false);
//   const [restoreType, setRestoreType] = useState('');

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

//   const { currentRecords: pendingRecords } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);
//   const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
//   const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
//   const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);

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
  
//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem('userRole');

//   // ========== TAB-LEVEL VIEW PERMISSIONS ==========
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canViewRejectedDiscountTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canViewCancelledBookingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canViewRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL CREATE PERMISSIONS ==========
//   const canCreateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canCreateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canCreateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canCreateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canCreateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canCreateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
//   const canUpdateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canUpdateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canUpdateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canUpdateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canUpdateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canUpdateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canUpdateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL DELETE PERMISSIONS ==========
//   const canDeleteInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canDeleteInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canDeleteInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canDeleteInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canDeleteInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canDeleteInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canDeleteInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
//   // Approve Chassis - uses CREATE permission in PENDING ALLOCATED tab
//   const canApproveChassis = canCreateInPendingAllocatedTab;
  
//   // REVISED: Reject Chassis - uses CREATE permission in PENDING ALLOCATED tab (not DELETE)
//   const canRejectChassis = canCreateInPendingAllocatedTab;
  
//   // Approve Cancellation - uses CREATE permission in CANCELLED BOOKING tab
//   const canApproveCancellation = canCreateInCancelledBookingTab;
  
//   // REVISED: Reject Cancellation - uses CREATE permission in CANCELLED BOOKING tab (not DELETE)
//   const canRejectCancellation = canCreateInCancelledBookingTab;
  
//   // Restore Booking - uses CREATE permission in respective tabs
//   const canRestoreFromRejectedDiscount = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
  
//   // Approve Update - uses CREATE permission in PENDING APPROVALS tab
//   const canApproveUpdate = canCreateInPendingApprovalsTab;
  
//   // REVISED: Reject Update - uses CREATE permission in PENDING APPROVALS tab (not DELETE)
//   const canRejectUpdate = canCreateInPendingApprovalsTab;
  
//   // Allocate Chassis - uses CREATE permission in APPROVED tab (creating chassis allocation)
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
  
//   // Update/Change Vehicle - uses CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
//   const canUpdateChassisInAllocatedTab = canCreateInAllocatedTab;
  
//   // Edit Booking - uses UPDATE permission in respective tabs
//   const canEditInPendingApprovalsTab = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab = canUpdateInRejectedDiscountTab;
  
//   // Delete Booking - uses DELETE permission in respective tabs
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
  
//   // Upload KYC - uses CREATE permission in respective tabs
//   const canUploadKycInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount = canCreateInRejectedDiscountTab;
  
//   // Upload Finance - uses CREATE permission in respective tabs
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;
  
//   // REVISED: Print button - uses CREATE permission in respective tabs
//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab,  // PENDING APPROVALS
//     1: canCreateInApprovedTab,          // APPROVED
//     2: canCreateInPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canCreateInAllocatedTab,         // ALLOCATED
//     4: canCreateInRejectedDiscountTab,  // REJECTED DISCOUNT
//     5: canCreateInCancelledBookingTab,  // CANCELLED BOOKING
//     6: canCreateInRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
//   };
  
//   // View specific permissions for tabs
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,  // PENDING APPROVALS
//     1: canViewApprovedTab,          // APPROVED
//     2: canViewPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canViewAllocatedTab,         // ALLOCATED
//     4: canViewRejectedDiscountTab,  // REJECTED DISCOUNT
//     5: canViewCancelledBookingTab,  // CANCELLED BOOKING
//     6: canViewRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
//   };
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingApprovalsTab || canViewApprovedTab || 
//                        canViewPendingAllocatedTab || canViewAllocatedTab || 
//                        canViewRejectedDiscountTab || canViewCancelledBookingTab || 
//                        canViewRejectedCancelledBookingTab;

//   // Page-level permission checks (for backward compatibility)
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canUpdateAllBooking = canUpdateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canDeleteAllBooking = canDeleteInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingApprovalsTab) visibleTabs.push(0);
//     if (canViewApprovedTab) visibleTabs.push(1);
//     if (canViewPendingAllocatedTab) visibleTabs.push(2);
//     if (canViewAllocatedTab) visibleTabs.push(3);
//     if (canViewRejectedDiscountTab) visibleTabs.push(4);
//     if (canViewCancelledBookingTab) visibleTabs.push(5);
//     if (canViewRejectedCancelledBookingTab) visibleTabs.push(6);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, 
//       canViewAllocatedTab, canViewRejectedDiscountTab, canViewCancelledBookingTab, 
//       canViewRejectedCancelledBookingTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchAllData();
//   }, []);

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

//   const fetchData = async (page = 1, search = '') => {
//     try {
//       const params = {
//         page,
//         limit: 100,
//         bookingType: 'BRANCH'
//       };
      
//       if (search) {
//         params.search = search;
//       }
      
//       const response = await axiosInstance.get(`/bookings`, { params });
//       const branchBookings = response.data.data.bookings;

//       setAllData(branchBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = branchBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//       const rejectedBookings = branchBookings.filter((booking) => booking.status === 'REJECTED');
//       setRejectedData(rejectedBookings);
//       setFilteredRejected(rejectedBookings);
      
//       // Update pagination info
//       setPagination(prev => ({
//         ...prev,
//         0: { currentPage: page, totalPages: response.data.data.pages, total: response.data.data.total },
//         1: { currentPage: page, totalPages: response.data.data.pages, total: response.data.data.total },
//         2: { currentPage: page, totalPages: response.data.data.pages, total: response.data.data.total },
//         3: { currentPage: page, totalPages: response.data.data.pages, total: response.data.data.total },
//         4: { currentPage: page, totalPages: response.data.data.pages, total: response.data.data.total }
//       }));
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchCancellationData = async (page = 1, search = '') => {
//     try {
//       const params = { 
//         page,
//         limit: 10
//       };
      
//       if (search) {
//         params.search = search;
//       }
      
//       const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { ...params, status: 'PENDING' }
//       });
//       setCancelledPendingData(pendingResponse.data.data);
//       setFilteredCancelledPending(pendingResponse.data.data);
      
//       const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { ...params, status: 'REJECTED' }
//       });
//       setCancelledRejectedData(rejectedResponse.data.data);
//       setFilteredCancelledRejected(rejectedResponse.data.data);
      
//       // Update pagination for cancellation tabs
//       setPagination(prev => ({
//         ...prev,
//         5: { currentPage: page, totalPages: 1, total: pendingResponse.data.data.length },
//         6: { currentPage: page, totalPages: 1, total: rejectedResponse.data.data.length }
//       }));
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   // Function to handle page change for each tab
//   const handlePageChange = (tabIndex, newPage) => {
//     setPagination(prev => ({
//       ...prev,
//       [tabIndex]: { ...prev[tabIndex], currentPage: newPage }
//     }));
    
//     // Fetch data for the new page
//     if (tabIndex === 5 || tabIndex === 6) {
//       fetchCancellationData(newPage, searchTerm);
//     } else {
//       fetchData(newPage, searchTerm);
//     }
//   };

//   // Function to get auth token
//   const getAuthToken = () => {
//     // Try to get token from useAuth context first
//     if (token) {
//       return token;
//     }
    
//     // Fallback to localStorage
//     const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
//     return storedToken;
//   };

//   // Function to handle Excel export
//   const handleExportExcel = () => {
//     setShowExportModal(true);
//   };

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
      
//       // Get auth token
//       const authToken = getAuthToken();
//       if (!authToken) {
//         showError('Please login to access this resource');
//         setExportLoading(false);
//         setShowExportModal(false);
//         return;
//       }
      
//       // Get branchId from user data or localStorage
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420'; // Default branch ID
      
//       // Format dates
//       const { startDate, endDate } = exportDateRange;
      
//       // Construct the export URL with query parameters
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
      
//       // Create a temporary link element to trigger download with authorization header
//       const link = document.createElement('a');
//       link.href = exportUrl;
//       link.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
      
//       // Set authorization header for the request
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
      
//       xhr.onload = function() {
//         if (xhr.status === 200) {
//           // Create a blob from the response
//           const blob = new Blob([xhr.response], { 
//             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//           });
          
//           // Create a URL for the blob
//           const url = window.URL.createObjectURL(blob);
          
//           // Create a temporary link and trigger download
//           const tempLink = document.createElement('a');
//           tempLink.href = url;
//           tempLink.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(tempLink);
//           tempLink.click();
//           document.body.removeChild(tempLink);
          
//           // Clean up
//           window.URL.revokeObjectURL(url);
          
//           showSuccess('Excel file downloaded successfully!');
//           setShowExportModal(false);
//         } else if (xhr.status === 401) {
//           showError('Please login to access this resource');
//         } else {
//           showError('Failed to download Excel file');
//         }
//         setExportLoading(false);
//       };
      
//       xhr.onerror = function() {
//         showError('Network error occurred while downloading Excel file');
//         setExportLoading(false);
//       };
      
//       xhr.send();
      
//     } catch (error) {
//       console.error('Error exporting Excel:', error);
//       showError('Failed to export Excel file');
//       setExportLoading(false);
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

//   const handleOpenRestoreModal = (bookingId, type) => {
//     // Check CREATE permission based on the tab
//     if (type === 'rejected_discount') {
//       if (!canRestoreFromRejectedDiscount) {
//         showError('You do not have permission to restore from REJECTED DISCOUNT tab');
//         return;
//       }
//     } else if (type === 'cancelled') {
//       if (!canRestoreFromRejectedCancelled) {
//         showError('You do not have permission to restore from REJECTED CANCELLED BOOKING tab');
//         return;
//       }
//     }
    
//     setSelectedRestoreBooking(bookingId);
//     setRestoreType(type);
//     setRestoreReason('');
//     setRestoreNotes('');
//     setRestoreBookingModal(true);
//     handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     // Check CREATE permission based on the type
//     let hasPermission = false;
//     if (restoreType === 'cancelled') {
//       hasPermission = canRestoreFromRejectedCancelled;
//     } else if (restoreType === 'rejected_discount') {
//       hasPermission = canRestoreFromRejectedDiscount;
//     }

//     if (!hasPermission) {
//       showError('You do not have permission to restore bookings');
//       return;
//     }

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

//   const handleOpenAvailableDocs = async (bookingId) => {
//     // Use VIEW permission for viewing available documents
//     if (!canViewAllBooking) {
//       showError('You do not have permission to view available documents');
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
//     // Use UPDATE permission for selecting templates in APPROVED tab
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

//   const handleApproveCancellation = (cancellation) => {
//     // Use CREATE permission in CANCELLED BOOKING tab
//     if (!canApproveCancellation) {
//       showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
//     // Use CREATE permission in CANCELLED BOOKING tab
//     if (!canRejectCancellation) {
//       showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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
//         // Check CREATE permission in CANCELLED BOOKING tab
//         if (!canApproveCancellation) {
//           showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
//         // Check CREATE permission in CANCELLED BOOKING tab
//         if (!canRejectCancellation) {
//           showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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

//   const handleApproveChassis = (bookingId) => {
//     // Use CREATE permission in PENDING ALLOCATED tab
//     if (!canApproveChassis) {
//       showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     // Use CREATE permission in PENDING ALLOCATED tab
//     if (!canRejectChassis) {
//       showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval) return;

//     try {
//       setApprovalLoading(true);
      
//       if (approvalAction === 'APPROVE') {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canApproveChassis) {
//           showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
//           return;
//         }
//       } else {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canRejectChassis) {
//           showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
//           return;
//         }
//       }

//       if (!approvalNote.trim()) {
//         showError('Please enter approval/rejection note');
//         return;
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
//     // REVISED: Check CREATE permission for current tab
//     const canCreateCurrentTab = canPrintInTab[activeTab];
//     if (!canCreateCurrentTab) {
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
//       showError('You do not have permission to view KYC in this tab');
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
//         customerName: booking.customerDetails.name,
//         address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     // Check VIEW permission for current tab
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
//         customerName: booking.customerDetails.name,
//         bookingId: booking._id
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleAllocateChassis = (bookingId) => {
//     // Check CREATE permission in APPROVED tab (creating chassis allocation)
//     if (!canAllocateChassisInApprovedTab) {
//       showError('You do not have permission to allocate chassis in APPROVED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleUpdateChassis = (bookingId) => {
//     // Check CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
//     if (!canUpdateChassisInAllocatedTab) {
//       showError('You do not have permission to update chassis in ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     // Check CREATE permission in respective tab
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
//       setChassisError(''); // Clear any previous error

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
//       setChassisError(''); // Clear error on success
//     } catch (error) {
//       console.error('Error saving chassis number:', error);
      
//       // Extract error message from response
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message || 
//                           'Failed to save chassis number';
      
//       // Set the error to show in the modal
//       setChassisError(errorMessage);
      
//       // Also show the toast if needed
//       showError(errorMessage);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   // Add this function to clear the chassis error
//   const handleClearChassisError = () => {
//     setChassisError('');
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
//     // Use CREATE permission in PENDING APPROVALS tab
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
//     // Use CREATE permission in PENDING APPROVALS tab
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
//     // Check DELETE permission based on current tab
//     let hasPermission = false;
//     if (activeTab === 0) {
//       hasPermission = canDeleteBookingInPendingApprovals;
//     } else if (activeTab === 4) {
//       hasPermission = canDeleteBookingInRejectedDiscount;
//     }
    
//     if (!hasPermission) {
//       showError('You do not have permission to delete bookings in this tab');
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
//     // Reset to page 1 when changing tabs
//     handlePageChange(tab, 1);
//   };
  
//   const renderPagination = (tabIndex) => {
//     const tabPagination = pagination[tabIndex];
//     if (!tabPagination || tabPagination.totalPages <= 1) {
//       return null;
//     }
    
//     return (
//       <div className="d-flex justify-content-center mt-3">
//         <CPagination aria-label="Page navigation example">
//           <CPaginationItem 
//             disabled={tabPagination.currentPage === 1} 
//             onClick={() => handlePageChange(tabIndex, tabPagination.currentPage - 1)}
//           >
//             <CIcon icon={cilChevronLeft} />
//           </CPaginationItem>
          
//           {[...Array(tabPagination.totalPages)].map((_, index) => {
//             const pageNumber = index + 1;
//             // Show limited page numbers
//             if (
//               pageNumber === 1 ||
//               pageNumber === tabPagination.totalPages ||
//               (pageNumber >= tabPagination.currentPage - 1 && pageNumber <= tabPagination.currentPage + 1)
//             ) {
//               return (
//                 <CPaginationItem 
//                   key={pageNumber}
//                   active={pageNumber === tabPagination.currentPage}
//                   onClick={() => handlePageChange(tabIndex, pageNumber)}
//                 >
//                   {pageNumber}
//                 </CPaginationItem>
//               );
//             } else if (
//               pageNumber === tabPagination.currentPage - 2 ||
//               pageNumber === tabPagination.currentPage + 2
//             ) {
//               return <CPaginationItem key={pageNumber}>...</CPaginationItem>;
//             }
//             return null;
//           })}
          
//           <CPaginationItem 
//             disabled={tabPagination.currentPage === tabPagination.totalPages}
//             onClick={() => handlePageChange(tabIndex, tabPagination.currentPage + 1)}
//           >
//             <CIcon icon={cilChevronRight} />
//           </CPaginationItem>
//         </CPagination>
//         <div className="ms-3 align-self-center">
//           <small className="text-muted">
//             Showing {((tabPagination.currentPage - 1) * 10) + 1} to {Math.min(tabPagination.currentPage * 10, tabPagination.total)} of {tabPagination.total} records
//           </small>
//         </div>
//       </div>
//     );
//   };
  
//   const renderBookingTable = (records, tabIndex) => {
//     // Check if user has permission to view this specific tab
//     const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
//     // REVISED: Check if user has CREATE permission for printing in this tab
//     const canCreateCurrentTab = canPrintInTab[tabIndex];
    
//     // If user doesn't have VIEW permission for this tab, show message
//     if (!canViewCurrentTab) {
//       const tabNames = [
//         "PENDING APPROVALS",
//         "APPROVED", 
//         "PENDING ALLOCATED",
//         "ALLOCATED",
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
    
//     // Helper function to check if user can upload KYC in this tab
//     const canUploadKycInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadKycInPendingApprovals;
//         case 1: return canUploadKycInApprovedTab;
//         case 3: return canUploadKycInAllocatedTab;
//         case 4: return canUploadKycInRejectedDiscount;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can upload Finance in this tab
//     const canUploadFinanceInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadFinanceInPendingApprovals;
//         case 1: return canUploadFinanceInApprovedTab;
//         case 3: return canUploadFinanceInAllocatedTab;
//         case 4: return canUploadFinanceInRejectedDiscount;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can edit in this tab
//     const canEditInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canEditInPendingApprovalsTab;
//         case 4: return canEditInRejectedDiscountTab;
//         default: return false;
//       }
//     };
    
//     if (tabIndex === 5 || tabIndex === 6) {
//       return (
//         <>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   {tabIndex === 6 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
//                   {tabIndex === 5 && (
//                     <CTableHeaderCell scope="col">Options</CTableHeaderCell>
//                   )}
//                   {tabIndex === 6 && (
//                     <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
//                   )}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {records.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={tabIndex === 6 ? 12 : 11} style={{ color: 'red', textAlign: 'center' }}>
//                       No cancellation requests available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   records.map((cancellation, index) => (
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
//                       {tabIndex === 6 && (
//                         <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
//                       )}
//                       {tabIndex === 5 && (
//                         <CTableDataCell>
//                           <div className="d-flex">
//                             <CButton
//                               size="sm"
//                               className="me-2"
//                               color="success"
//                               onClick={() => handleApproveCancellation(cancellation)}
//                               disabled={!canApproveCancellation}
//                             >
//                               <CIcon icon={cilCheck} /> Approve
//                             </CButton>
//                             <CButton
//                               size="sm"
//                               color="danger"
//                               onClick={() => handleRejectCancellation(cancellation)}
//                               disabled={!canRejectCancellation}
//                             >
//                               <CIcon icon={cilX} /> Reject
//                             </CButton>
//                           </div>
//                         </CTableDataCell>
//                       )}
//                       {tabIndex === 6 && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled')}
//                             disabled={!canRestoreFromRejectedCancelled}
//                           >
//                             Back to Normal
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//           {renderPagination(tabIndex)}
//         </>
//       );
//     }

//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                 {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 || tabIndex === 4 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                     No booking available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 records.map((booking, index) => (
//                   <CTableRow key={index}>
//                     {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{index + 1}</CTableDataCell>}
//                     <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                     {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                     {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                     {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && canCreateCurrentTab && (
//                           <CButton 
//                             size="sm" 
//                             className="view-button"
//                             onClick={() => handlePrint(booking.id)}
//                           >
//                             Print
//                           </CButton>
//                         )}
//                       </CTableDataCell>
//                     )}
//                     {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && (
//                           <>
//                             {canUploadFinanceInThisTab() && (booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                             booking.documentStatus?.financeLetter?.status === 'REJECTED') ? (
//                               <Link
//                                 to={`/upload-finance/${booking.id}`}
//                                 state={{
//                                   bookingId: booking.id,
//                                   customerName: booking.customerDetails?.name,
//                                   address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                                 }}
//                               >
//                                 <CButton size="sm" className="upload-kyc-btn icon-only">
//                                   <CIcon icon={cilCloudUpload} />
//                                 </CButton>
//                               </Link>
//                             ) : null}
//                             {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                               <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                                 {booking.documentStatus?.financeLetter?.status || ''}
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </CTableDataCell>
//                     )}
//                     {tabIndex != 2 && tabIndex != 4 && (
//                       <CTableDataCell>
//                         {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                           <Link
//                             to={`/upload-kyc/${booking.id}`}
//                             state={{
//                               bookingId: booking.id,
//                               customerName: booking.customerDetails?.name,
//                               address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                             }}
//                           >
//                             <CButton size="sm" className="upload-kyc-btn icon-only">
//                               <CIcon icon={cilCloudUpload} />
//                             </CButton>
//                           </Link>
//                         ) : (
//                           <div className="d-flex align-items-center">
//                             <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                               {booking.documentStatus?.kyc?.status || ''}
//                             </span>
//                             {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                               <Link
//                                 to={`/upload-kyc/${booking.id}`}
//                                 state={{
//                                   bookingId: booking.id,
//                                   customerName: booking.customerDetails?.name,
//                                   address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                                 }}
//                                 className="ms-2"
//                               >
//                                 <button className="upload-kyc-btn icon-only">
//                                   <CIcon icon={cilCloudUpload} />
//                                 </button>
//                               </Link>
//                             )}
//                           </div>
//                         )}
//                       </CTableDataCell>
//                     )}
//                     <CTableDataCell>
//                       {/* Show "FROZEN" for FREEZZED status */}
//                       <span 
//                         className="status-badge" 
//                         style={{
//                           backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                           booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                           booking.status === 'APPROVED' ? '#198754' : 
//                                           booking.status === 'REJECTED' ? '#dc3545' : 
//                                           booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                           booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                           color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                           padding: '2px 8px',
//                           borderRadius: '12px',
//                           fontSize: '12px',
//                           fontWeight: '500',
//                           display: 'inline-block'
//                         }}
//                       >
//                         {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                       </span>
//                     </CTableDataCell>
//                     {tabIndex === 0 && (
//                       <CTableDataCell>
//                         <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                           {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                         </span>
//                       </CTableDataCell>
//                     )}
//                     {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                     {tabIndex === 2 && (
//                       <CTableDataCell>
//                         <span className={`status-text ${booking.status}`}>
//                           {booking.claimDetails?.hasClaim ? (
//                             <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                           ) : (
//                             <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                           )}
//                         </span>
//                       </CTableDataCell>
//                     )}
//                     {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                     {tabIndex != 2 && tabIndex != 4 && (
//                       <CTableDataCell>
//                         {booking.formPath && (
//                           <>
//                             {/* Check if user is SALES_EXECUTIVE using user.is_sales_executive */}
//                             {user?.is_sales_executive &&
//                             booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                               <span className="awaiting-approval-text">Awaiting for Approval</span>
//                             ) : (
//                               canCreateCurrentTab && (
//                                 <a
//                                   href={`${config.baseURL}${booking.formPath}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   <CButton size="sm" className="upload-kyc-btn icon-only">
//                                     <CIcon icon={cilPrint} />
//                                   </CButton>
//                                 </a>
//                               )
//                             )}
//                           </>
//                         )}
//                       </CTableDataCell>
//                     )}
//                     {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}
//                     <CTableDataCell>
//                       <CButton
//                         size="sm"
//                         className='option-button btn-sm'
//                         onClick={(event) => handleClick(event, booking.id)}
//                       >
//                         <CIcon icon={cilSettings} />
//                         Options
//                       </CButton>
//                       <Menu 
//                         id={`action-menu-${booking.id}`} 
//                         anchorEl={anchorEl} 
//                         open={menuId === booking.id} 
//                         onClose={handleClose}
//                       >
//                         {canViewCurrentTab && (
//                           <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                           </MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && canViewCurrentTab && (
//                           <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                             <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                           </MenuItem>
//                         )}

//                         {canEditInThisTab() && (
//                           <>
//                             {(tabIndex === 4) && canRestoreFromRejectedDiscount && (
//                               <MenuItem onClick={() => handleOpenRestoreModal(booking.id, 'rejected_discount')} style={{ color: 'black' }}>
//                                 <CIcon icon={cilCheck} className="me-2" /> Back to Normal
//                               </MenuItem>
//                             )}
//                             {/* Disable edit for frozen bookings AND approved bookings */}
//                             {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//                               <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                           </>
//                         )}

//                         {/* Edit button specifically for APPROVED tab */}
//                         {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}>
//                               <CIcon icon={cilPencil} className="me-2" /> Edit
//                             </MenuItem>
//                           </Link>
//                         )}

//                         {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                           <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilTrash} className="me-2" /> Delete
//                           </MenuItem>
//                         )}
//                         {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                           <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilTrash} className="me-2" /> Delete
//                           </MenuItem>
//                         )}

//                         {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewCurrentTab && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                           </MenuItem>
//                         )}

//                         {canViewCurrentTab && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                           </MenuItem>
//                         )}

//                         {/* Allocate Chassis - Check CREATE permission in APPROVED tab */}
//                         {tabIndex === 1 && canAllocateChassisInApprovedTab && (
//                           <>
//                             {booking.status === 'APPROVED' &&
//                               (booking.payment?.type === 'CASH' ||
//                                 (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                                 <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                                 </MenuItem>
//                               )}
//                           </>
//                         )}
//                         {/* Change Vehicle - Check CREATE permission in ALLOCATED tab */}
//                         {tabIndex === 3 && canUpdateChassisInAllocatedTab && (
//                           <>
//                             {booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                               <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {/* Approve/Reject Chassis - CREATE permission for both */}
//                         {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
//                           <>
//                             {canApproveChassis && (
//                               <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                                 <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                               </MenuItem>
//                             )}
//                             {canRejectChassis && (
//                               <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                                 <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {/* Available Documents Option - Only for Approved tab */}
//                         {tabIndex === 1 && booking.status === 'APPROVED' && canViewCurrentTab && (
//                           <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilFile} className="me-2" /> Available Documents
//                           </MenuItem>
//                         )}
                        
//                         {/* Self Insurance Management Option - Only for Frozen bookings */}
//                         {tabIndex === 0 && booking.status === 'FREEZZED' && canViewCurrentTab && (
//                           <MenuItem 
//                             onClick={() => window.location.href = '/#/self-insurance'} 
//                             style={{ color: 'black' }}
//                           >
//                             <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                           </MenuItem>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination(tabIndex)}
//       </>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in All Booking.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Booking List</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//             {/* <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleExportExcel}
//               disabled={exportLoading}
//             >
//               {exportLoading ? (
//                 <>
//                   <CSpinner size="sm" className="me-2" />
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilFile} className='icon'/> Export Excel
//                 </>
//               )}
//             </CButton> */}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingApprovalsTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       Pending Approvals
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewApprovedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Approved
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewPendingAllocatedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 2}
//                       onClick={() => handleTabChange(2)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Pending Allocated
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewAllocatedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 3}
//                       onClick={() => handleTabChange(3)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Allocated
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewRejectedDiscountTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 4}
//                       onClick={() => handleTabChange(4)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Rejected Discount
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCancelledBookingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 5}
//                       onClick={() => handleTabChange(5)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 5 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Cancelled Booking
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewRejectedCancelledBookingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 6}
//                       onClick={() => handleTabChange(6)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 6 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Rejected Cancelled Booking
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => {
//                       const searchValue = e.target.value;
//                       setSearchTerm(searchValue);
//                       // Reset to page 1 when searching
//                       if (activeTab === 5 || activeTab === 6) {
//                         fetchCancellationData(1, searchValue);
//                       } else {
//                         fetchData(1, searchValue);
//                       }
//                       // Update local filter for immediate UI feedback
//                       if (activeTab === 0) handlePendingFilter(searchValue, getDefaultSearchFields('booking'));
//                       else if (activeTab === 1) handleApprovedFilter(searchValue, getDefaultSearchFields('booking'));
//                       else if (activeTab === 2) handlePendingAllocatedFilter(searchValue, getDefaultSearchFields('booking'));
//                       else if (activeTab === 3) handleAllocatedFilter(searchValue, getDefaultSearchFields('booking'));
//                       else if (activeTab === 4) handleRejectedFilter(searchValue, getDefaultSearchFields('booking'));
//                       else if (activeTab === 5) handleCancelledPendingFilter(searchValue, ['customer.name', 'customer.phone']);
//                       else handleCancelledRejectedFilter(searchValue, ['customer.name', 'customer.phone']);
//                     }}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingApprovalsTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderBookingTable(pendingRecords, 0)}
//                   </CTabPane>
//                 )}
//                 {canViewApprovedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderBookingTable(approvedRecords, 1)}
//                   </CTabPane>
//                 )}
//                 {canViewPendingAllocatedTab && (
//                   <CTabPane visible={activeTab === 2}>
//                     {renderBookingTable(pendingAllocatedRecords, 2)}
//                   </CTabPane>
//                 )}
//                 {canViewAllocatedTab && (
//                   <CTabPane visible={activeTab === 3}>
//                     {renderBookingTable(allocatedRecords, 3)}
//                   </CTabPane>
//                 )}
//                 {canViewRejectedDiscountTab && (
//                   <CTabPane visible={activeTab === 4}>
//                     {renderBookingTable(rejectedRecords, 4)}
//                   </CTabPane>
//                 )}
//                 {canViewCancelledBookingTab && (
//                   <CTabPane visible={activeTab === 5}>
//                     {cancelledLoading ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       renderBookingTable(cancelledPendingRecords, 5)
//                     )}
//                   </CTabPane>
//                 )}
//                 {canViewRejectedCancelledBookingTab && (
//                   <CTabPane visible={activeTab === 6}>
//                     {cancelledLoading ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       renderBookingTable(cancelledRejectedRecords, 6)
//                     )}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in All Booking.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Export Excel Modal */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Export Excel Report
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Start Date:</CFormLabel>
//             <CFormInput
//               type="date"
//               value={exportDateRange.startDate}
//               onChange={(e) => setExportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//             />
//           </div>
//           <div className="mb-3">
//             <CFormLabel>End Date:</CFormLabel>
//             <CFormInput
//               type="date"
//               value={exportDateRange.endDate}
//               onChange={(e) => setExportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//               min={exportDateRange.startDate}
//             />
//           </div>
//           <CAlert color="info">
//             <small>
//               This will export the branch sales report for the selected date range in Excel format.
//             </small>
//           </CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleExportConfirm}
//             disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : (
//               'Export Excel'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

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
//       <ChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//           setChassisError(''); // Clear error when closing modal
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//         errorMessage={chassisError} // Pass error to modal
//         onClearError={handleClearChassisError} // Pass clear function
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
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

// export default BookingList;




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
// } from '../../../utils/tableImports';
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
//   cilChevronLeft,
//   cilChevronRight
// } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import { 
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
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CFormLabel,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CFormSelect
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
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
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// const BookingList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [allData, setAllData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // ============ CLIENT-SIDE PAGINATION STATES ============
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage, setRecordsPerPage] = useState(50);
//   const [totalPages, setTotalPages] = useState(1);
//   const [displayedPages, setDisplayedPages] = useState([]);
  
//   // Export Excel states
//   const [exportLoading, setExportLoading] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date().toISOString().split('T')[0]
//   });
//   const [showExportModal, setShowExportModal] = useState(false);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
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
//   const [chassisError, setChassisError] = useState('');
  
//   // Available Documents States
//   const [availableDocsModal, setAvailableDocsModal] = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates, setAvailableTemplates] = useState(null);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
//   const [templateNotes, setTemplateNotes] = useState('');
//   const [submittingSelection, setSubmittingSelection] = useState(false);
  
//   // Restore Booking Modal States
//   const [restoreBookingModal, setRestoreBookingModal] = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason, setRestoreReason] = useState('');
//   const [restoreNotes, setRestoreNotes] = useState('');
//   const [restoreLoading, setRestoreLoading] = useState(false);
//   const [restoreType, setRestoreType] = useState('');

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
  
//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem('userRole');

//   // ========== TAB-LEVEL VIEW PERMISSIONS ==========
//   const canViewPendingApprovalsTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canViewApprovedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canViewPendingAllocatedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canViewAllocatedTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canViewRejectedDiscountTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canViewCancelledBookingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canViewRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions, 
//     MODULES.SALES, 
//     PAGES.SALES.ALL_BOOKING, 
//     ACTIONS.VIEW,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL CREATE PERMISSIONS ==========
//   const canCreateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canCreateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canCreateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canCreateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canCreateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canCreateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.CREATE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
//   const canUpdateInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canUpdateInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canUpdateInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canUpdateInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canUpdateInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canUpdateInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canUpdateInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.UPDATE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== TAB-LEVEL DELETE PERMISSIONS ==========
//   const canDeleteInPendingApprovalsTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.PENDING_APPROVALS
//   );
  
//   const canDeleteInApprovedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.APPROVED
//   );
  
//   const canDeleteInPendingAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.PENDING_ALLOCATED
//   );
  
//   const canDeleteInAllocatedTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.ALLOCATED
//   );
  
//   const canDeleteInRejectedDiscountTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.REJECTED_DISCOUNT
//   );
  
//   const canDeleteInCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.CANCELLED_BOOKING
//   );
  
//   const canDeleteInRejectedCancelledBookingTab = hasSafePagePermission(
//     permissions,
//     MODULES.SALES,
//     PAGES.SALES.ALL_BOOKING,
//     ACTIONS.DELETE,
//     TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
//   );
  
//   // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
//   // Approve Chassis - uses CREATE permission in PENDING ALLOCATED tab
//   const canApproveChassis = canCreateInPendingAllocatedTab;
  
//   // REVISED: Reject Chassis - uses CREATE permission in PENDING ALLOCATED tab (not DELETE)
//   const canRejectChassis = canCreateInPendingAllocatedTab;
  
//   // Approve Cancellation - uses CREATE permission in CANCELLED BOOKING tab
//   const canApproveCancellation = canCreateInCancelledBookingTab;
  
//   // REVISED: Reject Cancellation - uses CREATE permission in CANCELLED BOOKING tab (not DELETE)
//   const canRejectCancellation = canCreateInCancelledBookingTab;
  
//   // Restore Booking - uses CREATE permission in respective tabs
//   const canRestoreFromRejectedDiscount = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
  
//   // Approve Update - uses CREATE permission in PENDING APPROVALS tab
//   const canApproveUpdate = canCreateInPendingApprovalsTab;
  
//   // REVISED: Reject Update - uses CREATE permission in PENDING APPROVALS tab (not DELETE)
//   const canRejectUpdate = canCreateInPendingApprovalsTab;
  
//   // Allocate Chassis - uses CREATE permission in APPROVED tab (creating chassis allocation)
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
  
//   // Update/Change Vehicle - uses CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
//   const canUpdateChassisInAllocatedTab = canCreateInAllocatedTab;
  
//   // Edit Booking - uses UPDATE permission in respective tabs
//   const canEditInPendingApprovalsTab = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab = canUpdateInRejectedDiscountTab;
  
//   // Delete Booking - uses DELETE permission in respective tabs
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
  
//   // Upload KYC - uses CREATE permission in respective tabs
//   const canUploadKycInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount = canCreateInRejectedDiscountTab;
  
//   // Upload Finance - uses CREATE permission in respective tabs
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;
  
//   // REVISED: Print button - uses CREATE permission in respective tabs
//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab,  // PENDING APPROVALS
//     1: canCreateInApprovedTab,          // APPROVED
//     2: canCreateInPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canCreateInAllocatedTab,         // ALLOCATED
//     4: canCreateInRejectedDiscountTab,  // REJECTED DISCOUNT
//     5: canCreateInCancelledBookingTab,  // CANCELLED BOOKING
//     6: canCreateInRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
//   };
  
//   // View specific permissions for tabs
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,  // PENDING APPROVALS
//     1: canViewApprovedTab,          // APPROVED
//     2: canViewPendingAllocatedTab,  // PENDING ALLOCATED
//     3: canViewAllocatedTab,         // ALLOCATED
//     4: canViewRejectedDiscountTab,  // REJECTED DISCOUNT
//     5: canViewCancelledBookingTab,  // CANCELLED BOOKING
//     6: canViewRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
//   };
  
//   // Check if user can view at least one tab
//   const canViewAnyTab = canViewPendingApprovalsTab || canViewApprovedTab || 
//                        canViewPendingAllocatedTab || canViewAllocatedTab || 
//                        canViewRejectedDiscountTab || canViewCancelledBookingTab || 
//                        canViewRejectedCancelledBookingTab;

//   // Page-level permission checks (for backward compatibility)
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canUpdateAllBooking = canUpdateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canDeleteAllBooking = canDeleteInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // Adjust activeTab based on tab-level permissions
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       return;
//     }
    
//     // If current active tab is hidden due to permissions, find first visible tab
//     const visibleTabs = [];
//     if (canViewPendingApprovalsTab) visibleTabs.push(0);
//     if (canViewApprovedTab) visibleTabs.push(1);
//     if (canViewPendingAllocatedTab) visibleTabs.push(2);
//     if (canViewAllocatedTab) visibleTabs.push(3);
//     if (canViewRejectedDiscountTab) visibleTabs.push(4);
//     if (canViewCancelledBookingTab) visibleTabs.push(5);
//     if (canViewRejectedCancelledBookingTab) visibleTabs.push(6);
    
//     if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//     }
//   }, [canViewAnyTab, canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, 
//       canViewAllocatedTab, canViewRejectedDiscountTab, canViewCancelledBookingTab, 
//       canViewRejectedCancelledBookingTab, activeTab]);

//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchAllData();
//   }, []);

//   // ============ PAGINATION CALCULATION ============
//   const calculatePagination = (filteredDataLength) => {
//     const total = filteredDataLength;
//     const totalPagesCount = Math.ceil(total / recordsPerPage);
//     setTotalPages(totalPagesCount);
    
//     // Calculate displayed page numbers (max 5 pages shown)
//     const pages = [];
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPagesCount, currentPage + 2);
    
//     // Adjust if we're near the beginning
//     if (currentPage <= 3) {
//       endPage = Math.min(5, totalPagesCount);
//     }
    
//     // Adjust if we're near the end
//     if (currentPage >= totalPagesCount - 2) {
//       startPage = Math.max(1, totalPagesCount - 4);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     setDisplayedPages(pages);
//   };

//   // ============ GET CURRENT RECORDS FOR PAGE ============
//   const getCurrentRecords = (filteredDataArray) => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredDataArray.slice(indexOfFirstRecord, indexOfLastRecord);
//   };

//   // ============ HANDLE PAGE CHANGE ============
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     // Scroll to top when page changes
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // ============ HANDLE RECORDS PER PAGE CHANGE ============
//   const handleRecordsPerPageChange = (e) => {
//     setRecordsPerPage(parseInt(e.target.value, 10));
//     setCurrentPage(1); // Reset to first page
//   };

//   useEffect(() => {
//     // Recalculate pagination when filtered data changes for active tab
//     const getFilteredDataLength = () => {
//       switch(activeTab) {
//         case 0: return filteredPending.length;
//         case 1: return filteredApproved.length;
//         case 2: return filteredPendingAllocated.length;
//         case 3: return filteredAllocated.length;
//         case 4: return filteredRejected.length;
//         case 5: return filteredCancelledPending.length;
//         case 6: return filteredCancelledRejected.length;
//         default: return 0;
//       }
//     };
    
//     calculatePagination(getFilteredDataLength());
//   }, [filteredPending, filteredApproved, filteredPendingAllocated, filteredAllocated, 
//       filteredRejected, filteredCancelledPending, filteredCancelledRejected, currentPage, recordsPerPage, activeTab]);

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
//       const params = {
//         bookingType: 'BRANCH'
//       };
      
//       const response = await axiosInstance.get(`/bookings`, { params });
//       const branchBookings = response.data.data.bookings;

//       setAllData(branchBookings);

//       // Updated to include FREEZZED status in pending bookings
//       const pendingBookings = branchBookings.filter(
//         (booking) => 
//           booking.status === 'PENDING_APPROVAL' || 
//           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
//           booking.status === 'FREEZZED'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//       const rejectedBookings = branchBookings.filter((booking) => booking.status === 'REJECTED');
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
//       const params = {};
      
//       const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { ...params, status: 'PENDING' }
//       });
//       setCancelledPendingData(pendingResponse.data.data);
//       setFilteredCancelledPending(pendingResponse.data.data);
      
//       const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
//         params: { ...params, status: 'REJECTED' }
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

//   // Function to get auth token
//   const getAuthToken = () => {
//     // Try to get token from useAuth context first
//     if (token) {
//       return token;
//     }
    
//     // Fallback to localStorage
//     const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
//     return storedToken;
//   };

//   // Function to handle Excel export
//   const handleExportExcel = () => {
//     setShowExportModal(true);
//   };

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
      
//       // Get auth token
//       const authToken = getAuthToken();
//       if (!authToken) {
//         showError('Please login to access this resource');
//         setExportLoading(false);
//         setShowExportModal(false);
//         return;
//       }
      
//       // Get branchId from user data or localStorage
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420'; // Default branch ID
      
//       // Format dates
//       const { startDate, endDate } = exportDateRange;
      
//       // Construct the export URL with query parameters
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
      
//       // Create a temporary link element to trigger download with authorization header
//       const link = document.createElement('a');
//       link.href = exportUrl;
//       link.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
      
//       // Set authorization header for the request
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
      
//       xhr.onload = function() {
//         if (xhr.status === 200) {
//           // Create a blob from the response
//           const blob = new Blob([xhr.response], { 
//             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//           });
          
//           // Create a URL for the blob
//           const url = window.URL.createObjectURL(blob);
          
//           // Create a temporary link and trigger download
//           const tempLink = document.createElement('a');
//           tempLink.href = url;
//           tempLink.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(tempLink);
//           tempLink.click();
//           document.body.removeChild(tempLink);
          
//           // Clean up
//           window.URL.revokeObjectURL(url);
          
//           showSuccess('Excel file downloaded successfully!');
//           setShowExportModal(false);
//         } else if (xhr.status === 401) {
//           showError('Please login to access this resource');
//         } else {
//           showError('Failed to download Excel file');
//         }
//         setExportLoading(false);
//       };
      
//       xhr.onerror = function() {
//         showError('Network error occurred while downloading Excel file');
//         setExportLoading(false);
//       };
      
//       xhr.send();
      
//     } catch (error) {
//       console.error('Error exporting Excel:', error);
//       showError('Failed to export Excel file');
//       setExportLoading(false);
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

//   const handleOpenRestoreModal = (bookingId, type) => {
//     // Check CREATE permission based on the tab
//     if (type === 'rejected_discount') {
//       if (!canRestoreFromRejectedDiscount) {
//         showError('You do not have permission to restore from REJECTED DISCOUNT tab');
//         return;
//       }
//     } else if (type === 'cancelled') {
//       if (!canRestoreFromRejectedCancelled) {
//         showError('You do not have permission to restore from REJECTED CANCELLED BOOKING tab');
//         return;
//       }
//     }
    
//     setSelectedRestoreBooking(bookingId);
//     setRestoreType(type);
//     setRestoreReason('');
//     setRestoreNotes('');
//     setRestoreBookingModal(true);
//     handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     // Check CREATE permission based on the type
//     let hasPermission = false;
//     if (restoreType === 'cancelled') {
//       hasPermission = canRestoreFromRejectedCancelled;
//     } else if (restoreType === 'rejected_discount') {
//       hasPermission = canRestoreFromRejectedDiscount;
//     }

//     if (!hasPermission) {
//       showError('You do not have permission to restore bookings');
//       return;
//     }

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

//   const handleOpenAvailableDocs = async (bookingId) => {
//     // Use VIEW permission for viewing available documents
//     if (!canViewAllBooking) {
//       showError('You do not have permission to view available documents');
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
//     // Use UPDATE permission for selecting templates in APPROVED tab
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

//   const handleApproveCancellation = (cancellation) => {
//     // Use CREATE permission in CANCELLED BOOKING tab
//     if (!canApproveCancellation) {
//       showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
//     // Use CREATE permission in CANCELLED BOOKING tab
//     if (!canRejectCancellation) {
//       showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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
//         // Check CREATE permission in CANCELLED BOOKING tab
//         if (!canApproveCancellation) {
//           showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
//         // Check CREATE permission in CANCELLED BOOKING tab
//         if (!canRejectCancellation) {
//           showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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

//   const handleApproveChassis = (bookingId) => {
//     // Use CREATE permission in PENDING ALLOCATED tab
//     if (!canApproveChassis) {
//       showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     // Use CREATE permission in PENDING ALLOCATED tab
//     if (!canRejectChassis) {
//       showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval) return;

//     try {
//       setApprovalLoading(true);
      
//       if (approvalAction === 'APPROVE') {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canApproveChassis) {
//           showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
//           return;
//         }
//       } else {
//         // Check CREATE permission in PENDING ALLOCATED tab
//         if (!canRejectChassis) {
//           showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
//           return;
//         }
//       }

//       if (!approvalNote.trim()) {
//         showError('Please enter approval/rejection note');
//         return;
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
//     // REVISED: Check CREATE permission for current tab
//     const canCreateCurrentTab = canPrintInTab[activeTab];
//     if (!canCreateCurrentTab) {
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
//       showError('You do not have permission to view KYC in this tab');
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
//         customerName: booking.customerDetails.name,
//         address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     // Check VIEW permission for current tab
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
//         customerName: booking.customerDetails.name,
//         bookingId: booking._id
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleAllocateChassis = (bookingId) => {
//     // Check CREATE permission in APPROVED tab (creating chassis allocation)
//     if (!canAllocateChassisInApprovedTab) {
//       showError('You do not have permission to allocate chassis in APPROVED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(false);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleUpdateChassis = (bookingId) => {
//     // Check CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
//     if (!canUpdateChassisInAllocatedTab) {
//       showError('You do not have permission to update chassis in ALLOCATED tab');
//       return;
//     }
    
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     // Check CREATE permission in respective tab
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
//       setChassisError(''); // Clear any previous error

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
//       setChassisError(''); // Clear error on success
//     } catch (error) {
//       console.error('Error saving chassis number:', error);
      
//       // Extract error message from response
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message || 
//                           'Failed to save chassis number';
      
//       // Set the error to show in the modal
//       setChassisError(errorMessage);
      
//       // Also show the toast if needed
//       showError(errorMessage);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   // Add this function to clear the chassis error
//   const handleClearChassisError = () => {
//     setChassisError('');
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
//     // Use CREATE permission in PENDING APPROVALS tab
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
//     // Use CREATE permission in PENDING APPROVALS tab
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
//     // Check DELETE permission based on current tab
//     let hasPermission = false;
//     if (activeTab === 0) {
//       hasPermission = canDeleteBookingInPendingApprovals;
//     } else if (activeTab === 4) {
//       hasPermission = canDeleteBookingInRejectedDiscount;
//     }
    
//     if (!hasPermission) {
//       showError('You do not have permission to delete bookings in this tab');
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
//     setCurrentPage(1); // Reset to page 1 when changing tabs
//   };
  
//   const handleSearch = (value) => {
//     setSearchTerm(value);
    
//     // Apply filter based on active tab
//     switch(activeTab) {
//       case 0:
//         handlePendingFilter(value, getDefaultSearchFields('booking'));
//         break;
//       case 1:
//         handleApprovedFilter(value, getDefaultSearchFields('booking'));
//         break;
//       case 2:
//         handlePendingAllocatedFilter(value, getDefaultSearchFields('booking'));
//         break;
//       case 3:
//         handleAllocatedFilter(value, getDefaultSearchFields('booking'));
//         break;
//       case 4:
//         handleRejectedFilter(value, getDefaultSearchFields('booking'));
//         break;
//       case 5:
//         handleCancelledPendingFilter(value, ['customer.name', 'customer.phone']);
//         break;
//       case 6:
//         handleCancelledRejectedFilter(value, ['customer.name', 'customer.phone']);
//         break;
//     }
    
//     setCurrentPage(1); // Reset to first page when searching
//   };
  
//   // ============ PAGINATION RENDER FUNCTION ============
//   const renderPagination = (filteredDataArray) => {
//     if (filteredDataArray.length <= recordsPerPage) {
//       return null;
//     }
    
//     return (
//       <div className="mt-4">
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <div className="d-flex align-items-center">
//             <CFormLabel className="me-2 mb-0">Records per page:</CFormLabel>
//             <CFormSelect
//               value={recordsPerPage}
//               onChange={handleRecordsPerPageChange}
//               style={{ width: '80px' }}
//               size="sm"
//             >
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//               <option value={200}>200</option>
//               <option value={500}>500</option>
//             </CFormSelect>
//           </div>
//           <div className="text-muted">
//             Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredDataArray.length)} of {filteredDataArray.length} entries
//           </div>
//         </div>
        
//         <CPagination align="center" aria-label="Page navigation example">
//           {/* Previous Button */}
//           <CPaginationItem 
//             aria-label="Previous" 
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={currentPage === 1 ? 'disabled' : ''}
//           >
//             <CIcon icon={cilChevronLeft} />
//           </CPaginationItem>
          
//           {/* First Page */}
//           {currentPage > 3 && totalPages > 5 && (
//             <>
//               <CPaginationItem 
//                 onClick={() => handlePageChange(1)}
//                 active={currentPage === 1}
//               >
//                 1
//               </CPaginationItem>
//               {currentPage > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//             </>
//           )}
          
//           {/* Page Numbers */}
//           {displayedPages.map(page => (
//             <CPaginationItem 
//               key={page}
//               onClick={() => handlePageChange(page)}
//               active={currentPage === page}
//             >
//               {page}
//             </CPaginationItem>
//           ))}
          
//           {/* Last Page */}
//           {currentPage < totalPages - 2 && totalPages > 5 && (
//             <>
//               {currentPage < totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//               <CPaginationItem 
//                 onClick={() => handlePageChange(totalPages)}
//                 active={currentPage === totalPages}
//               >
//                 {totalPages}
//               </CPaginationItem>
//             </>
//           )}
          
//           {/* Next Button */}
//           <CPaginationItem 
//             aria-label="Next" 
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={currentPage === totalPages ? 'disabled' : ''}
//           >
//             <CIcon icon={cilChevronRight} />
//           </CPaginationItem>
//         </CPagination>
//       </div>
//     );
//   };
  
//   const renderBookingTable = (records, tabIndex) => {
//     // Check if user has permission to view this specific tab
//     const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
//     // REVISED: Check if user has CREATE permission for printing in this tab
//     const canCreateCurrentTab = canPrintInTab[tabIndex];
    
//     // Get current page records
//     const currentRecords = getCurrentRecords(records);
    
//     // If user doesn't have VIEW permission for this tab, show message
//     if (!canViewCurrentTab) {
//       const tabNames = [
//         "PENDING APPROVALS",
//         "APPROVED", 
//         "PENDING ALLOCATED",
//         "ALLOCATED",
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
    
//     // Helper function to check if user can upload KYC in this tab
//     const canUploadKycInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadKycInPendingApprovals;
//         case 1: return canUploadKycInApprovedTab;
//         case 3: return canUploadKycInAllocatedTab;
//         case 4: return canUploadKycInRejectedDiscount;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can upload Finance in this tab
//     const canUploadFinanceInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canUploadFinanceInPendingApprovals;
//         case 1: return canUploadFinanceInApprovedTab;
//         case 3: return canUploadFinanceInAllocatedTab;
//         case 4: return canUploadFinanceInRejectedDiscount;
//         default: return false;
//       }
//     };
    
//     // Helper function to check if user can edit in this tab
//     const canEditInThisTab = () => {
//       switch(tabIndex) {
//         case 0: return canEditInPendingApprovalsTab;
//         case 4: return canEditInRejectedDiscountTab;
//         default: return false;
//       }
//     };
    
//     if (tabIndex === 5 || tabIndex === 6) {
//       return (
//         <>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
//                   <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   {tabIndex === 6 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
//                   {tabIndex === 5 && (
//                     <CTableHeaderCell scope="col">Options</CTableHeaderCell>
//                   )}
//                   {tabIndex === 6 && (
//                     <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
//                   )}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={tabIndex === 6 ? 12 : 11} style={{ color: 'red', textAlign: 'center' }}>
//                       No cancellation requests available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((cancellation, index) => {
//                     const globalIndex = (currentPage - 1) * recordsPerPage + index + 1;
//                     return (
//                       <CTableRow key={index}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>₹{cancellation.financials?.cancellationCharges || 0}</CTableDataCell>
//                         <CTableDataCell>₹{cancellation.financials?.received || 0}</CTableDataCell>
//                         <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
//                         <CTableDataCell>
//                           <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
//                             {cancellation.cancellationRequest?.status || 'N/A'}
//                           </span>
//                         </CTableDataCell>
//                         {tabIndex === 6 && (
//                           <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
//                         )}
//                         {tabIndex === 5 && (
//                           <CTableDataCell>
//                             <div className="d-flex">
//                               <CButton
//                                 size="sm"
//                                 className="me-2"
//                                 color="success"
//                                 onClick={() => handleApproveCancellation(cancellation)}
//                                 disabled={!canApproveCancellation}
//                               >
//                                 <CIcon icon={cilCheck} /> Approve
//                               </CButton>
//                               <CButton
//                                 size="sm"
//                                 color="danger"
//                                 onClick={() => handleRejectCancellation(cancellation)}
//                                 disabled={!canRejectCancellation}
//                               >
//                                 <CIcon icon={cilX} /> Reject
//                               </CButton>
//                             </div>
//                           </CTableDataCell>
//                         )}
//                         {tabIndex === 6 && (
//                           <CTableDataCell>
//                             <CButton
//                               size="sm"
//                               color="primary"
//                               onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled')}
//                               disabled={!canRestoreFromRejectedCancelled}
//                             >
//                               Back to Normal
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
//           {renderPagination(records)}
//         </>
//       );
//     }

//     return (
//       <>
//         <div className="responsive-table-wrapper">
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//                 <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                 {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//                 {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//                 <CTableHeaderCell scope="col">Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {currentRecords.length === 0 ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 || tabIndex === 4 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                     No booking available
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : (
//                 currentRecords.map((booking, index) => {
//                   const globalIndex = (currentPage - 1) * recordsPerPage + index + 1;
//                   return (
//                     <CTableRow key={index}>
//                       {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
//                       <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                       {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                       <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                       {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
//                       {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                         <CTableDataCell>
//                           {booking.payment?.type === 'FINANCE' && canCreateCurrentTab && (
//                             <CButton 
//                               size="sm" 
//                               className="view-button"
//                               onClick={() => handlePrint(booking.id)}
//                             >
//                               Print
//                             </CButton>
//                           )}
//                         </CTableDataCell>
//                       )}
//                       {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                         <CTableDataCell>
//                           {booking.payment?.type === 'FINANCE' && (
//                             <>
//                               {canUploadFinanceInThisTab() && (booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
//                               booking.documentStatus?.financeLetter?.status === 'REJECTED') ? (
//                                 <Link
//                                   to={`/upload-finance/${booking.id}`}
//                                   state={{
//                                     bookingId: booking.id,
//                                     customerName: booking.customerDetails?.name,
//                                     address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                                   }}
//                                 >
//                                   <CButton size="sm" className="upload-kyc-btn icon-only">
//                                     <CIcon icon={cilCloudUpload} />
//                                   </CButton>
//                                 </Link>
//                               ) : null}
//                               {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                                 <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>
//                                   {booking.documentStatus?.financeLetter?.status || ''}
//                                 </span>
//                               )}
//                             </>
//                           )}
//                         </CTableDataCell>
//                       )}
//                       {tabIndex != 2 && tabIndex != 4 && (
//                         <CTableDataCell>
//                           {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
//                             <Link
//                               to={`/upload-kyc/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails?.name,
//                                 address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : (
//                             <div className="d-flex align-items-center">
//                               <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>
//                                 {booking.documentStatus?.kyc?.status || ''}
//                               </span>
//                               {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                                 <Link
//                                   to={`/upload-kyc/${booking.id}`}
//                                   state={{
//                                     bookingId: booking.id,
//                                     customerName: booking.customerDetails?.name,
//                                     address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
//                                   }}
//                                   className="ms-2"
//                                 >
//                                   <button className="upload-kyc-btn icon-only">
//                                     <CIcon icon={cilCloudUpload} />
//                                   </button>
//                                 </Link>
//                               )}
//                             </div>
//                           )}
//                         </CTableDataCell>
//                       )}
//                       <CTableDataCell>
//                         {/* Show "FROZEN" for FREEZZED status */}
//                         <span 
//                           className="status-badge" 
//                           style={{
//                             backgroundColor: booking.status === 'FREEZZED' ? '#ffc107' : 
//                                             booking.status === 'PENDING_APPROVAL' ? '#0d6efd' : 
//                                             booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? '#fd7e14' : 
//                                             booking.status === 'APPROVED' ? '#198754' : 
//                                             booking.status === 'REJECTED' ? '#dc3545' : 
//                                             booking.status === 'ALLOCATED' ? '#6f42c1' : 
//                                             booking.status === 'ON_HOLD' ? '#6c757d' : '#6c757d',
//                             color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                             padding: '2px 8px',
//                             borderRadius: '12px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             display: 'inline-block'
//                           }}
//                         >
//                           {booking.status === 'FREEZZED' ? 'FROZEN (self insurance)' : booking.status}
//                         </span>
//                       </CTableDataCell>
//                       {tabIndex === 0 && (
//                         <CTableDataCell>
//                           <span className={`status-badge ${booking.updateRequestStatus?.toLowerCase() || ''}`}>
//                             {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                           </span>
//                         </CTableDataCell>
//                       )}
//                       {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                       {tabIndex === 2 && (
//                         <CTableDataCell>
//                           <span className={`status-text ${booking.status}`}>
//                             {booking.claimDetails?.hasClaim ? (
//                               <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                             ) : (
//                               <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                             )}
//                           </span>
//                         </CTableDataCell>
//                       )}
//                       {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                       {tabIndex != 2 && tabIndex != 4 && (
//                         <CTableDataCell>
//                           {booking.formPath && (
//                             <>
//                               {/* Check if user is SALES_EXECUTIVE using user.is_sales_executive */}
//                               {user?.is_sales_executive &&
//                               booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                                 <span className="awaiting-approval-text">Awaiting for Approval</span>
//                               ) : (
//                                 canCreateCurrentTab && (
//                                   <a
//                                     href={`${config.baseURL}${booking.formPath}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     <CButton size="sm" className="upload-kyc-btn icon-only">
//                                       <CIcon icon={cilPrint} />
//                                     </CButton>
//                                   </a>
//                                 )
//                               )}
//                             </>
//                           )}
//                         </CTableDataCell>
//                       )}
//                       {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}
//                       <CTableDataCell>
//                         <CButton
//                           size="sm"
//                           className='option-button btn-sm'
//                           onClick={(event) => handleClick(event, booking.id)}
//                         >
//                           <CIcon icon={cilSettings} />
//                           Options
//                         </CButton>
//                         <Menu 
//                           id={`action-menu-${booking.id}`} 
//                           anchorEl={anchorEl} 
//                           open={menuId === booking.id} 
//                           onClose={handleClose}
//                         >
//                           {canViewCurrentTab && (
//                             <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                             </MenuItem>
//                           )}
//                           {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && canViewCurrentTab && (
//                             <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                               <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                             </MenuItem>
//                           )}

//                           {canEditInThisTab() && (
//                             <>
//                               {(tabIndex === 4) && canRestoreFromRejectedDiscount && (
//                                 <MenuItem onClick={() => handleOpenRestoreModal(booking.id, 'rejected_discount')} style={{ color: 'black' }}>
//                                   <CIcon icon={cilCheck} className="me-2" /> Back to Normal
//                                 </MenuItem>
//                               )}
//                               {/* Disable edit for frozen bookings AND approved bookings */}
//                               {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//                                 <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//                                   <MenuItem style={{ color: 'black' }}>
//                                     <CIcon icon={cilPencil} className="me-2" /> Edit
//                                   </MenuItem>
//                                 </Link>
//                               )}
//                             </>
//                           )}

//                           {/* Edit button specifically for APPROVED tab */}
//                           {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//                             <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//                               <MenuItem style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Edit
//                               </MenuItem>
//                             </Link>
//                           )}

//                           {/* {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//   <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//     <MenuItem style={{ color: 'black' }}>
//       <CIcon icon={cilPencil} className="me-2" /> Edit
//     </MenuItem>
//   </Link>
// )}


// {tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
//   <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
//     <MenuItem style={{ color: 'black' }}>
//       <CIcon icon={cilPencil} className="me-2" /> Edit
//     </MenuItem>
//   </Link>
// )} */}

//                           {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                             <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}
//                           {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                             <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilTrash} className="me-2" /> Delete
//                             </MenuItem>
//                           )}

//                           {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewCurrentTab && (
//                             <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                             </MenuItem>
//                           )}

//                           {canViewCurrentTab && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                             <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                             </MenuItem>
//                           )}

//                           {/* Allocate Chassis - Check CREATE permission in APPROVED tab */}
//                           {tabIndex === 1 && canAllocateChassisInApprovedTab && (
//                             <>
//                               {booking.status === 'APPROVED' &&
//                                 (booking.payment?.type === 'CASH' ||
//                                   (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                                   <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                     <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                                   </MenuItem>
//                                 )}
//                             </>
//                           )}
//                           {/* Change Vehicle - Check CREATE permission in ALLOCATED tab */}
//                           {tabIndex === 3 && canUpdateChassisInAllocatedTab && (
//                             <>
//                               {booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                                 <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
//                                 </MenuItem>
//                               )}
//                             </>
//                           )}

//                           {/* Approve/Reject Chassis - CREATE permission for both */}
//                           {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
//                             <>
//                               {canApproveChassis && (
//                                 <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                                   <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                                 </MenuItem>
//                               )}
//                               {canRejectChassis && (
//                                 <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                                   <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                                 </MenuItem>
//                               )}
//                             </>
//                           )}

//                           {/* Available Documents Option - Only for Approved tab */}
//                           {tabIndex === 1 && booking.status === 'APPROVED' && canViewCurrentTab && (
//                             <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilFile} className="me-2" /> Available Documents
//                             </MenuItem>
//                           )}
                          
//                           {/* Self Insurance Management Option - Only for Frozen bookings */}
//                           {tabIndex === 0 && booking.status === 'FREEZZED' && canViewCurrentTab && (
//                             <MenuItem 
//                               onClick={() => window.location.href = '/#/self-insurance'} 
//                               style={{ color: 'black' }}
//                             >
//                               <CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance
//                             </MenuItem>
//                           )}
//                         </Menu>
//                       </CTableDataCell>
//                     </CTableRow>
//                   );
//                 })
//               )}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination(records)}
//       </>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (!canViewAnyTab) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view any tabs in All Booking.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Booking List</div>
//       {error && (
//           <CAlert color="danger" className="mb-3">
//             {error}
//           </CAlert>
//         )}
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//             {/* <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleExportExcel}
//               disabled={exportLoading}
//             >
//               {exportLoading ? (
//                 <>
//                   <CSpinner size="sm" className="me-2" />
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilFile} className='icon'/> Export Excel
//                 </>
//               )}
//             </CButton> */}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {/* Show tabs only if user has permission to view at least one */}
//           {canViewAnyTab ? (
//             <>
//               <CNav variant="tabs" className="mb-3 border-bottom">
//                 {canViewPendingApprovalsTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 0}
//                       onClick={() => handleTabChange(0)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                         color: 'black',
//                         borderBottom: 'none'
//                       }}
//                     >
//                       Pending Approvals
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewApprovedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 1}
//                       onClick={() => handleTabChange(1)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Approved
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewPendingAllocatedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 2}
//                       onClick={() => handleTabChange(2)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Pending Allocated
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewAllocatedTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 3}
//                       onClick={() => handleTabChange(3)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Allocated
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewRejectedDiscountTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 4}
//                       onClick={() => handleTabChange(4)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Rejected Discount
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewCancelledBookingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 5}
//                       onClick={() => handleTabChange(5)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 5 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Cancelled Booking
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//                 {canViewRejectedCancelledBookingTab && (
//                   <CNavItem>
//                     <CNavLink
//                       active={activeTab === 6}
//                       onClick={() => handleTabChange(6)}
//                       style={{ 
//                         cursor: 'pointer',
//                         borderTop: activeTab === 6 ? '4px solid #2759a2' : '3px solid transparent',
//                         borderBottom: 'none',
//                         color: 'black'
//                       }}
//                     >
//                       Rejected Cancelled Booking
//                     </CNavLink>
//                   </CNavItem>
//                 )}
//               </CNav>

//               <div className="d-flex justify-content-between mb-3">
//                 <div></div>
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => handleSearch(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <CTabContent>
//                 {canViewPendingApprovalsTab && (
//                   <CTabPane visible={activeTab === 0}>
//                     {renderBookingTable(filteredPending, 0)}
//                   </CTabPane>
//                 )}
//                 {canViewApprovedTab && (
//                   <CTabPane visible={activeTab === 1}>
//                     {renderBookingTable(filteredApproved, 1)}
//                   </CTabPane>
//                 )}
//                 {canViewPendingAllocatedTab && (
//                   <CTabPane visible={activeTab === 2}>
//                     {renderBookingTable(filteredPendingAllocated, 2)}
//                   </CTabPane>
//                 )}
//                 {canViewAllocatedTab && (
//                   <CTabPane visible={activeTab === 3}>
//                     {renderBookingTable(filteredAllocated, 3)}
//                   </CTabPane>
//                 )}
//                 {canViewRejectedDiscountTab && (
//                   <CTabPane visible={activeTab === 4}>
//                     {renderBookingTable(filteredRejected, 4)}
//                   </CTabPane>
//                 )}
//                 {canViewCancelledBookingTab && (
//                   <CTabPane visible={activeTab === 5}>
//                     {cancelledLoading ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       renderBookingTable(filteredCancelledPending, 5)
//                     )}
//                   </CTabPane>
//                 )}
//                 {canViewRejectedCancelledBookingTab && (
//                   <CTabPane visible={activeTab === 6}>
//                     {cancelledLoading ? (
//                       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//                         <CSpinner color="primary" />
//                       </div>
//                     ) : (
//                       renderBookingTable(filteredCancelledRejected, 6)
//                     )}
//                   </CTabPane>
//                 )}
//               </CTabContent>
//             </>
//           ) : (
//             <CAlert color="warning" className="text-center">
//               You don't have permission to view any tabs in All Booking.
//             </CAlert>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Export Excel Modal */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Export Excel Report
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Start Date:</CFormLabel>
//             <CFormInput
//               type="date"
//               value={exportDateRange.startDate}
//               onChange={(e) => setExportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//             />
//           </div>
//           <div className="mb-3">
//             <CFormLabel>End Date:</CFormLabel>
//             <CFormInput
//               type="date"
//               value={exportDateRange.endDate}
//               onChange={(e) => setExportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//               min={exportDateRange.startDate}
//             />
//           </div>
//           <CAlert color="info">
//             <small>
//               This will export the branch sales report for the selected date range in Excel format.
//             </small>
//           </CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleExportConfirm}
//             disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}
//           >
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Exporting...
//               </>
//             ) : (
//               'Export Excel'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

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
//       <ChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//           setSelectedBookingForChassis(null);
//           setChassisError(''); // Clear error when closing modal
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//         errorMessage={chassisError} // Pass error to modal
//         onClearError={handleClearChassisError} // Pass clear function
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
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

// export default BookingList;




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
} from '../../../utils/tableImports';
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
  cilChevronLeft,
  cilChevronRight,
  cilDescription
} from '@coreui/icons';
import config from '../../../config';
import ViewBooking from './BookingDetails';
import KYCView from './KYCView';
import FinanceView from './FinanceView';
import ChassisNumberModal from './ChassisModel';
import { 
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
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import PrintModal from './PrintFinance';
import PendingUpdateDetailsModal from './ViewPendingUpdates';
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../../utils/modulePermissions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const BookingList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ============ CLIENT-SIDE PAGINATION STATES ============
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedPages, setDisplayedPages] = useState([]);
  
  // Export Excel states
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Chassis Approval Modal States
  const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
  const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  
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
  const [chassisError, setChassisError] = useState('');
  
  // Available Documents States
  const [availableDocsModal, setAvailableDocsModal] = useState(false);
  const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
  const [templateNotes, setTemplateNotes] = useState('');
  const [submittingSelection, setSubmittingSelection] = useState(false);
  
  // Restore Booking Modal States
  const [restoreBookingModal, setRestoreBookingModal] = useState(false);
  const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
  const [restoreReason, setRestoreReason] = useState('');
  const [restoreNotes, setRestoreNotes] = useState('');
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreType, setRestoreType] = useState('');

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
  
  const { permissions = [], token, user } = useAuth();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  // ========== TAB-LEVEL VIEW PERMISSIONS ==========
  const canViewPendingApprovalsTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canViewApprovedTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.APPROVED
  );
  
  const canViewPendingAllocatedTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canViewAllocatedTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.ALLOCATED
  );
  
  const canViewRejectedDiscountTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.REJECTED_DISCOUNT
  );
  
  const canViewCancelledBookingTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.CANCELLED_BOOKING
  );
  
  const canViewRejectedCancelledBookingTab = hasSafePagePermission(
    permissions, 
    MODULES.SALES, 
    PAGES.SALES.ALL_BOOKING, 
    ACTIONS.VIEW,
    TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== TAB-LEVEL CREATE PERMISSIONS ==========
  const canCreateInPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canCreateInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.APPROVED
  );
  
  const canCreateInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canCreateInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.ALLOCATED
  );
  
  const canCreateInRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.REJECTED_DISCOUNT
  );
  
  const canCreateInCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.CANCELLED_BOOKING
  );
  
  const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.CREATE,
    TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== TAB-LEVEL UPDATE PERMISSIONS ==========
  const canUpdateInPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canUpdateInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.APPROVED
  );
  
  const canUpdateInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canUpdateInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.ALLOCATED
  );
  
  const canUpdateInRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.REJECTED_DISCOUNT
  );
  
  const canUpdateInCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.CANCELLED_BOOKING
  );
  
  const canUpdateInRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.UPDATE,
    TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== TAB-LEVEL DELETE PERMISSIONS ==========
  const canDeleteInPendingApprovalsTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.PENDING_APPROVALS
  );
  
  const canDeleteInApprovedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.APPROVED
  );
  
  const canDeleteInPendingAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.PENDING_ALLOCATED
  );
  
  const canDeleteInAllocatedTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.ALLOCATED
  );
  
  const canDeleteInRejectedDiscountTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.REJECTED_DISCOUNT
  );
  
  const canDeleteInCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.CANCELLED_BOOKING
  );
  
  const canDeleteInRejectedCancelledBookingTab = hasSafePagePermission(
    permissions,
    MODULES.SALES,
    PAGES.SALES.ALL_BOOKING,
    ACTIONS.DELETE,
    TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING
  );
  
  // ========== SPECIFIC TAB ACTION PERMISSIONS ==========
  
  // Approve Chassis - uses CREATE permission in PENDING ALLOCATED tab
  const canApproveChassis = canCreateInPendingAllocatedTab;
  
  // REVISED: Reject Chassis - uses CREATE permission in PENDING ALLOCATED tab (not DELETE)
  const canRejectChassis = canCreateInPendingAllocatedTab;
  
  // Approve Cancellation - uses CREATE permission in CANCELLED BOOKING tab
  const canApproveCancellation = canCreateInCancelledBookingTab;
  
  // REVISED: Reject Cancellation - uses CREATE permission in CANCELLED BOOKING tab (not DELETE)
  const canRejectCancellation = canCreateInCancelledBookingTab;
  
  // Restore Booking - uses CREATE permission in respective tabs
  const canRestoreFromRejectedDiscount = canCreateInRejectedDiscountTab;
  const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
  
  // Approve Update - uses CREATE permission in PENDING APPROVALS tab
  const canApproveUpdate = canCreateInPendingApprovalsTab;
  
  // REVISED: Reject Update - uses CREATE permission in PENDING APPROVALS tab (not DELETE)
  const canRejectUpdate = canCreateInPendingApprovalsTab;
  
  // Allocate Chassis - uses CREATE permission in APPROVED tab (creating chassis allocation)
  const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
  
  // Update/Change Vehicle - uses CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
  const canUpdateChassisInAllocatedTab = canCreateInAllocatedTab;
  
  // Edit Booking - uses UPDATE permission in respective tabs
  const canEditInPendingApprovalsTab = canUpdateInPendingApprovalsTab;
  const canEditInRejectedDiscountTab = canUpdateInRejectedDiscountTab;
  
  // Delete Booking - uses DELETE permission in respective tabs
  const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
  const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
  
  // Upload KYC - uses CREATE permission in respective tabs
  const canUploadKycInPendingApprovals = canCreateInPendingApprovalsTab;
  const canUploadKycInApprovedTab = canCreateInApprovedTab;
  const canUploadKycInAllocatedTab = canCreateInAllocatedTab;
  const canUploadKycInRejectedDiscount = canCreateInRejectedDiscountTab;
  
  // Upload Finance - uses CREATE permission in respective tabs
  const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
  const canUploadFinanceInApprovedTab = canCreateInApprovedTab;
  const canUploadFinanceInAllocatedTab = canCreateInAllocatedTab;
  const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;
  
  // REVISED: Print button - uses CREATE permission in respective tabs
  const canPrintInTab = {
    0: canCreateInPendingApprovalsTab,  // PENDING APPROVALS
    1: canCreateInApprovedTab,          // APPROVED
    2: canCreateInPendingAllocatedTab,  // PENDING ALLOCATED
    3: canCreateInAllocatedTab,         // ALLOCATED
    4: canCreateInRejectedDiscountTab,  // REJECTED DISCOUNT
    5: canCreateInCancelledBookingTab,  // CANCELLED BOOKING
    6: canCreateInRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
  };
  
  // View specific permissions for tabs
  const canViewBookingInTab = {
    0: canViewPendingApprovalsTab,  // PENDING APPROVALS
    1: canViewApprovedTab,          // APPROVED
    2: canViewPendingAllocatedTab,  // PENDING ALLOCATED
    3: canViewAllocatedTab,         // ALLOCATED
    4: canViewRejectedDiscountTab,  // REJECTED DISCOUNT
    5: canViewCancelledBookingTab,  // CANCELLED BOOKING
    6: canViewRejectedCancelledBookingTab // REJECTED CANCELLED BOOKING
  };
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPendingApprovalsTab || canViewApprovedTab || 
                       canViewPendingAllocatedTab || canViewAllocatedTab || 
                       canViewRejectedDiscountTab || canViewCancelledBookingTab || 
                       canViewRejectedCancelledBookingTab;

  // Page-level permission checks (for backward compatibility)
  const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
  const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
  const canUpdateAllBooking = canUpdateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
  const canDeleteAllBooking = canDeleteInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

  // Adjust activeTab based on tab-level permissions
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewPendingApprovalsTab) visibleTabs.push(0);
    if (canViewApprovedTab) visibleTabs.push(1);
    if (canViewPendingAllocatedTab) visibleTabs.push(2);
    if (canViewAllocatedTab) visibleTabs.push(3);
    if (canViewRejectedDiscountTab) visibleTabs.push(4);
    if (canViewCancelledBookingTab) visibleTabs.push(5);
    if (canViewRejectedCancelledBookingTab) visibleTabs.push(6);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingApprovalsTab, canViewApprovedTab, canViewPendingAllocatedTab, 
      canViewAllocatedTab, canViewRejectedDiscountTab, canViewCancelledBookingTab, 
      canViewRejectedCancelledBookingTab, activeTab]);

  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any All Booking tabs');
      navigate('/dashboard');
      return;
    }
    
    fetchAllData();
  }, []);

  // ============ PAGINATION CALCULATION ============
  const calculatePagination = (filteredDataLength) => {
    const total = filteredDataLength;
    const totalPagesCount = Math.ceil(total / recordsPerPage);
    setTotalPages(totalPagesCount);
    
    // Calculate displayed page numbers (max 5 pages shown)
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPagesCount, currentPage + 2);
    
    // Adjust if we're near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPagesCount);
    }
    
    // Adjust if we're near the end
    if (currentPage >= totalPagesCount - 2) {
      startPage = Math.max(1, totalPagesCount - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    setDisplayedPages(pages);
  };

  // ============ GET CURRENT RECORDS FOR PAGE ============
  const getCurrentRecords = (filteredDataArray) => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return filteredDataArray.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  // ============ HANDLE PAGE CHANGE ============
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============ HANDLE RECORDS PER PAGE CHANGE ============
  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    // Recalculate pagination when filtered data changes for active tab
    const getFilteredDataLength = () => {
      switch(activeTab) {
        case 0: return filteredPending.length;
        case 1: return filteredApproved.length;
        case 2: return filteredPendingAllocated.length;
        case 3: return filteredAllocated.length;
        case 4: return filteredRejected.length;
        case 5: return filteredCancelledPending.length;
        case 6: return filteredCancelledRejected.length;
        default: return 0;
      }
    };
    
    calculatePagination(getFilteredDataLength());
  }, [filteredPending, filteredApproved, filteredPendingAllocated, filteredAllocated, 
      filteredRejected, filteredCancelledPending, filteredCancelledRejected, currentPage, recordsPerPage, activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setCancelledLoading(true);
      await Promise.all([
        fetchData(),
        fetchCancellationData()
      ]);
      
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
      const params = {
        bookingType: 'BRANCH'
      };
      
      const response = await axiosInstance.get(`/bookings`, { params });
      const branchBookings = response.data.data.bookings;

      setAllData(branchBookings);

      // Updated to include FREEZZED status in pending bookings
      const pendingBookings = branchBookings.filter(
        (booking) => 
          booking.status === 'PENDING_APPROVAL' || 
          booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ||
          booking.status === 'FREEZZED'
      );
      setPendingData(pendingBookings);
      setFilteredPending(pendingBookings);

      const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
      setApprovedData(approvedBookings);
      setFilteredApproved(approvedBookings);

      const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL');
      setPendingAllocatedData(pendingAllocatedBookings);
      setFilteredPendingAllocated(pendingAllocatedBookings);

      const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
      setAllocatedData(allocatedBookings);
      setFilteredAllocated(allocatedBookings);
      
      const rejectedBookings = branchBookings.filter((booking) => booking.status === 'REJECTED');
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
      const params = {};
      
      const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: { ...params, status: 'PENDING' }
      });
      setCancelledPendingData(pendingResponse.data.data);
      setFilteredCancelledPending(pendingResponse.data.data);
      
      const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: { ...params, status: 'REJECTED' }
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

  // Function to get auth token
  const getAuthToken = () => {
    // Try to get token from useAuth context first
    if (token) {
      return token;
    }
    
    // Fallback to localStorage
    const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    return storedToken;
  };

  // Function to handle Excel export
  const handleExportExcel = () => {
    setShowExportModal(true);
  };

  const handleExportConfirm = async () => {
    try {
      setExportLoading(true);
      
      // Get auth token
      const authToken = getAuthToken();
      if (!authToken) {
        showError('Please login to access this resource');
        setExportLoading(false);
        setShowExportModal(false);
        return;
      }
      
      // Get branchId from user data or localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const branchId = userData.branchId || '695a32b2e3a6522ef7138420'; // Default branch ID
      
      // Format dates
      const { startDate, endDate } = exportDateRange;
      
      // Construct the export URL with query parameters
      const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
      
      // Create a temporary link element to trigger download with authorization header
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
      
      // Set authorization header for the request
      const xhr = new XMLHttpRequest();
      xhr.open('GET', exportUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.responseType = 'blob';
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          // Create a blob from the response
          const blob = new Blob([xhr.response], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link and trigger download
          const tempLink = document.createElement('a');
          tempLink.href = url;
          tempLink.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          
          // Clean up
          window.URL.revokeObjectURL(url);
          
          showSuccess('Excel file downloaded successfully!');
          setShowExportModal(false);
        } else if (xhr.status === 401) {
          showError('Please login to access this resource');
        } else {
          showError('Failed to download Excel file');
        }
        setExportLoading(false);
      };
      
      xhr.onerror = function() {
        showError('Network error occurred while downloading Excel file');
        setExportLoading(false);
      };
      
      xhr.send();
      
    } catch (error) {
      console.error('Error exporting Excel:', error);
      showError('Failed to export Excel file');
      setExportLoading(false);
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

  const handleOpenRestoreModal = (bookingId, type) => {
    // Check CREATE permission based on the tab
    if (type === 'rejected_discount') {
      if (!canRestoreFromRejectedDiscount) {
        showError('You do not have permission to restore from REJECTED DISCOUNT tab');
        return;
      }
    } else if (type === 'cancelled') {
      if (!canRestoreFromRejectedCancelled) {
        showError('You do not have permission to restore from REJECTED CANCELLED BOOKING tab');
        return;
      }
    }
    
    setSelectedRestoreBooking(bookingId);
    setRestoreType(type);
    setRestoreReason('');
    setRestoreNotes('');
    setRestoreBookingModal(true);
    handleClose();
  };

  const handleRestoreBooking = async () => {
    // Check CREATE permission based on the type
    let hasPermission = false;
    if (restoreType === 'cancelled') {
      hasPermission = canRestoreFromRejectedCancelled;
    } else if (restoreType === 'rejected_discount') {
      hasPermission = canRestoreFromRejectedDiscount;
    }

    if (!hasPermission) {
      showError('You do not have permission to restore bookings');
      return;
    }

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

  const handleOpenAvailableDocs = async (bookingId) => {
    // Use VIEW permission for viewing available documents
    if (!canViewAllBooking) {
      showError('You do not have permission to view available documents');
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
    // Use UPDATE permission for selecting templates in APPROVED tab
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

  const handleApproveCancellation = (cancellation) => {
    // Use CREATE permission in CANCELLED BOOKING tab
    if (!canApproveCancellation) {
      showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
    // Use CREATE permission in CANCELLED BOOKING tab
    if (!canRejectCancellation) {
      showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
      return;
    }
    
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('REJECT');
    setRejectionReason('');
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleCancelActionSubmit = async () => {
    if (!selectedCancellationForApproval) return;

    try {
      setCancelActionLoading(true);
      
      if (cancelApprovalAction === 'APPROVE') {
        // Check CREATE permission in CANCELLED BOOKING tab
        if (!canApproveCancellation) {
          showError('You do not have permission to approve cancellations in CANCELLED BOOKING tab');
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
        // Check CREATE permission in CANCELLED BOOKING tab
        if (!canRejectCancellation) {
          showError('You do not have permission to reject cancellations in CANCELLED BOOKING tab');
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

  const handleApproveChassis = (bookingId) => {
    // Use CREATE permission in PENDING ALLOCATED tab
    if (!canApproveChassis) {
      showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
      return;
    }
    
    setSelectedBookingForApproval(bookingId);
    setApprovalAction('APPROVE');
    setApprovalNote('');
    setChassisApprovalModal(true);
    handleClose();
  };

  const handleRejectChassis = (bookingId) => {
    // Use CREATE permission in PENDING ALLOCATED tab
    if (!canRejectChassis) {
      showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
      return;
    }
    
    setSelectedBookingForApproval(bookingId);
    setApprovalAction('REJECT');
    setApprovalNote('');
    setChassisApprovalModal(true);
    handleClose();
  };

  const handleChassisApprovalSubmit = async () => {
    if (!selectedBookingForApproval) return;

    try {
      setApprovalLoading(true);
      
      if (approvalAction === 'APPROVE') {
        // Check CREATE permission in PENDING ALLOCATED tab
        if (!canApproveChassis) {
          showError('You do not have permission to approve chassis allocation in PENDING ALLOCATED tab');
          return;
        }
      } else {
        // Check CREATE permission in PENDING ALLOCATED tab
        if (!canRejectChassis) {
          showError('You do not have permission to reject chassis allocation in PENDING ALLOCATED tab');
          return;
        }
      }

      if (!approvalNote.trim()) {
        showError('Please enter approval/rejection note');
        return;
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
    // REVISED: Check CREATE permission for current tab
    const canCreateCurrentTab = canPrintInTab[activeTab];
    if (!canCreateCurrentTab) {
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
      showError('You do not have permission to view KYC in this tab');
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
        customerName: booking.customerDetails.name,
        address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
      };

      setKycData(kycDataWithStatus);
      setKycModalVisible(true);
      handleClose();
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleViewFinanceLetter = async (bookingId) => {
    // Check VIEW permission for current tab
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
        customerName: booking.customerDetails.name,
        bookingId: booking._id
      };

      setFinanceData(financeDataWithStatus);
      setFinanceModalVisible(true);
      handleClose();
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // ============ NEW FUNCTION: Generate and View Finance Letter in New Tab (EXACT SAME DESIGN) ============
const handleViewFinanceLetterReceipt = async (bookingId) => {
  // Check VIEW permission for current tab
  const canViewCurrentTab = canViewBookingInTab[activeTab];
  if (!canViewCurrentTab) {
    showError('You do not have permission to view finance letters in this tab');
    return;
  }

  try {
    setActionLoadingId(bookingId);
    
    // Fetch booking details
    const bookingResponse = await axiosInstance.get(`/bookings/${bookingId}`);
    const bookingData = bookingResponse.data.data;
    
    // Fetch disbursement data for the booking
    const disbursementResponse = await axiosInstance.get(`/disbursements/bookings/${bookingId}/disbursements`);
    
    let disbursementAmount = 0;
    if (disbursementResponse.data.success && disbursementResponse.data.data.disbursements.length > 0) {
      // Get the latest disbursement amount
      disbursementAmount = disbursementResponse.data.data.disbursements[0]?.disbursementAmount || 0;
    }
    
    // Generate the finance letter HTML with exact same design as PrintModal
    const financeLetterHTML = generateFinanceLetterHTML(bookingData, disbursementAmount);
    
    // Open in new tab
    const newTab = window.open('', '_blank');
    newTab.document.write(financeLetterHTML);
    newTab.document.close();
  } catch (error) {
    console.error('Error fetching finance letter data:', error);
    showError('Failed to fetch finance letter data');
  } finally {
    setActionLoadingId(null);
    handleClose();
  }
};

// ============ Function to generate Finance Letter HTML with EXACT SAME DESIGN as PrintModal ============
const generateFinanceLetterHTML = (bookingData, disbursementAmount) => {
  const today = new Date().toLocaleDateString('en-GB');
  
  const dealAmount = bookingData?.discountedAmount || 0;
  const gcAmount = bookingData?.payment?.gcAmount || 0;
  const exchangeAmount = bookingData?.exchangeDetails?.price || 0;
  
  // Calculate down payment exactly as in PrintModal
  const downPayment = (dealAmount + gcAmount) - disbursementAmount - exchangeAmount;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FINANCER's ASSURANCE LETTER</title>
        <style>
            @page {
                size: A4;
                margin: 20mm;
            }
            body {
                font-family: 'Times New Roman', serif;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                background: #f5f5f5;
            }
            .page {
                width: 210mm;
                min-height: 297mm;
                margin: 10mm auto;
                padding: 15mm;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                box-sizing: border-box;
            }
            .content {
                width: 100%;
            }
            .subject {
                font-weight: bold;
                margin: 15px 0;
                text-align: left;
            }
            .salutation {
                margin: 15px 0;
            }
            .details-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .details-table, .details-table td {
                border: 1px solid black;
            }
            .details-table td {
                padding: 8px;
                vertical-align: top;
            }
            .left-col {
                width: 70%;
                font-weight: bold;
            }
            .instruction-text {
                margin: 15px 0;
                text-align: justify;
            }
            .signature-block {
                margin-top: 40px;
            }
            .signature-line {
                border-top: 1px solid black;
                width: 70%;
                margin-top: 40px;
                padding-top: 5px;
            }
            .signature-box {
                width: 25%;
                border-top: 1px dashed black;
                margin-top: 5px;
                margin-left: auto;
                padding: 1px 0;
                text-align: right;
                color: #555555;
                font-weight: bold;
            }
            @media print {
                body {
                    background: white;
                }
                .page {
                    box-shadow: none;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="content">
                <div style="text-align: right;">Date: <strong>${today}</strong></div>
                
                <div class="salutation">
                    To,<br>
                    The Director/Manager,<br>
                    Gandhi Motors Pvt Ltd,<br>
                    Nasik
                </div>
                
                <div class="subject">
                    Sub:- Delivery Order & Disbursement Assurance letter.
                </div>
                
                <div class="salutation">
                    Dear sir,
                </div>
                
                <div>
                    We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:
                </div>
                
                <div style="margin: 15px 0;">
                    Name : Mr./Mrs. : <strong>${bookingData?.customerDetails?.name || ''}</strong>
                </div>
                
                <div style="margin: 15px 0;">
                    Vehicle make & model : <strong>${bookingData?.model?.model_name || bookingData?.model?.name || ''}</strong> &nbsp;&nbsp;&nbsp;
                    Booking Number: <strong>${bookingData?.bookingNumber || ''}</strong>
                </div>
                
                <table class="details-table">
                    <tr>
                        <td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td>
                        <td>${dealAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td class="left-col">Disbursement Amount assured by finance company</td>
                        <td>${disbursementAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td class="left-col">Net Down Payment to be taken from Customer</td>
                        <td>${downPayment.toLocaleString('en-IN')}</td>
                    </tr>
                </table>
                
                <div class="instruction-text">
                    The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.
                </div>
                
                <div class="instruction-text">
                    This letter is non revokable & we promise to pay you the above-mentioned loan amount within stipulated time.
                </div>
                
                <div class="instruction-text">
                    You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office & give us the details of RTO registration along with the invoice, insurance & Down payment receipt.
                </div>
                
                <div class="instruction-text">
                    Please do the needful.
                </div>
                
                <div class="signature-block">
                    <div>For & on behalf of</div>
                    <div>Financer's / Bank</div>
                    <div>Name: <strong>${bookingData?.payment?.financer?.name || ''}</strong></div>
                    <div style="margin-top: 15px;">Employee Name: ________________________________</div>
                    <div style="margin-top: 15px;">Mobile No: ________________________________</div>
                </div>
                <div class="signature-box">
                    <div><strong>Authorised Signature</strong></div>
                </div>
            </div>
        </div>
        
        <script>
            // Auto print removed - this is for viewing only
            // window.onload = function() { window.print(); };
        </script>
    </body>
    </html>
  `;
};

  const handleAllocateChassis = (bookingId) => {
    // Check CREATE permission in APPROVED tab (creating chassis allocation)
    if (!canAllocateChassisInApprovedTab) {
      showError('You do not have permission to allocate chassis in APPROVED tab');
      return;
    }
    
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(false);
    setShowChassisModal(true);
    handleClose();
  };

  const handleUpdateChassis = (bookingId) => {
    // Check CREATE permission in ALLOCATED tab (creating a new vehicle allocation)
    if (!canUpdateChassisInAllocatedTab) {
      showError('You do not have permission to update chassis in ALLOCATED tab');
      return;
    }
    
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(true);
    setShowChassisModal(true);
    handleClose();
  };

  const handleSaveChassisNumber = async (payload) => {
    // Check CREATE permission in respective tab
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
      setChassisError(''); // Clear any previous error

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
      setChassisError(''); // Clear error on success
    } catch (error) {
      console.error('Error saving chassis number:', error);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to save chassis number';
      
      // Set the error to show in the modal
      setChassisError(errorMessage);
      
      // Also show the toast if needed
      showError(errorMessage);
    } finally {
      setChassisLoading(false);
    }
  };

  // Add this function to clear the chassis error
  const handleClearChassisError = () => {
    setChassisError('');
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
    // Use CREATE permission in PENDING APPROVALS tab
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
    // Use CREATE permission in PENDING APPROVALS tab
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
    // Check DELETE permission based on current tab
    let hasPermission = false;
    if (activeTab === 0) {
      hasPermission = canDeleteBookingInPendingApprovals;
    } else if (activeTab === 4) {
      hasPermission = canDeleteBookingInRejectedDiscount;
    }
    
    if (!hasPermission) {
      showError('You do not have permission to delete bookings in this tab');
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
    setCurrentPage(1); // Reset to page 1 when changing tabs
  };
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Apply filter based on active tab
    switch(activeTab) {
      case 0:
        handlePendingFilter(value, getDefaultSearchFields('booking'));
        break;
      case 1:
        handleApprovedFilter(value, getDefaultSearchFields('booking'));
        break;
      case 2:
        handlePendingAllocatedFilter(value, getDefaultSearchFields('booking'));
        break;
      case 3:
        handleAllocatedFilter(value, getDefaultSearchFields('booking'));
        break;
      case 4:
        handleRejectedFilter(value, getDefaultSearchFields('booking'));
        break;
      case 5:
        handleCancelledPendingFilter(value, ['customer.name', 'customer.phone']);
        break;
      case 6:
        handleCancelledRejectedFilter(value, ['customer.name', 'customer.phone']);
        break;
    }
    
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // ============ PAGINATION RENDER FUNCTION ============
  const renderPagination = (filteredDataArray) => {
    if (filteredDataArray.length <= recordsPerPage) {
      return null;
    }
    
    return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <CFormLabel className="me-2 mb-0">Records per page:</CFormLabel>
            <CFormSelect
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              style={{ width: '80px' }}
              size="sm"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </CFormSelect>
          </div>
          <div className="text-muted">
            Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredDataArray.length)} of {filteredDataArray.length} entries
          </div>
        </div>
        
        <CPagination align="center" aria-label="Page navigation example">
          {/* Previous Button */}
          <CPaginationItem 
            aria-label="Previous" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? 'disabled' : ''}
          >
            <CIcon icon={cilChevronLeft} />
          </CPaginationItem>
          
          {/* First Page */}
          {currentPage > 3 && totalPages > 5 && (
            <>
              <CPaginationItem 
                onClick={() => handlePageChange(1)}
                active={currentPage === 1}
              >
                1
              </CPaginationItem>
              {currentPage > 4 && <CPaginationItem disabled>...</CPaginationItem>}
            </>
          )}
          
          {/* Page Numbers */}
          {displayedPages.map(page => (
            <CPaginationItem 
              key={page}
              onClick={() => handlePageChange(page)}
              active={currentPage === page}
            >
              {page}
            </CPaginationItem>
          ))}
          
          {/* Last Page */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
              <CPaginationItem 
                onClick={() => handlePageChange(totalPages)}
                active={currentPage === totalPages}
              >
                {totalPages}
              </CPaginationItem>
            </>
          )}
          
          {/* Next Button */}
          <CPaginationItem 
            aria-label="Next" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'disabled' : ''}
          >
            <CIcon icon={cilChevronRight} />
          </CPaginationItem>
        </CPagination>
      </div>
    );
  };
  
  const renderBookingTable = (records, tabIndex) => {
    // Check if user has permission to view this specific tab
    const canViewCurrentTab = canViewBookingInTab[tabIndex];
    
    // REVISED: Check if user has CREATE permission for printing in this tab
    const canCreateCurrentTab = canPrintInTab[tabIndex];
    
    // Get current page records
    const currentRecords = getCurrentRecords(records);
    
    // If user doesn't have VIEW permission for this tab, show message
    if (!canViewCurrentTab) {
      const tabNames = [
        "PENDING APPROVALS",
        "APPROVED", 
        "PENDING ALLOCATED",
        "ALLOCATED",
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
    
    // Helper function to check if user can upload KYC in this tab
    const canUploadKycInThisTab = () => {
      switch(tabIndex) {
        case 0: return canUploadKycInPendingApprovals;
        case 1: return canUploadKycInApprovedTab;
        case 3: return canUploadKycInAllocatedTab;
        case 4: return canUploadKycInRejectedDiscount;
        default: return false;
      }
    };
    
    // Helper function to check if user can upload Finance in this tab
    const canUploadFinanceInThisTab = () => {
      switch(tabIndex) {
        case 0: return canUploadFinanceInPendingApprovals;
        case 1: return canUploadFinanceInApprovedTab;
        case 3: return canUploadFinanceInAllocatedTab;
        case 4: return canUploadFinanceInRejectedDiscount;
        default: return false;
      }
    };
    
    // Helper function to check if user can edit in this tab
    const canEditInThisTab = () => {
      switch(tabIndex) {
        case 0: return canEditInPendingApprovalsTab;
        case 4: return canEditInRejectedDiscountTab;
        default: return false;
      }
    };
    
    if (tabIndex === 5 || tabIndex === 6) {
      return (
        <>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Received Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  {tabIndex === 6 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
                  {tabIndex === 5 && (
                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                  )}
                  {tabIndex === 6 && (
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={tabIndex === 6 ? 12 : 11} style={{ color: 'red', textAlign: 'center' }}>
                      No cancellation requests available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((cancellation, index) => {
                    const globalIndex = (currentPage - 1) * recordsPerPage + index + 1;
                    return (
                      <CTableRow key={index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
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
                        {tabIndex === 6 && (
                          <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
                        )}
                        {tabIndex === 5 && (
                          <CTableDataCell>
                            <div className="d-flex">
                              <CButton
                                size="sm"
                                className="me-2"
                                color="success"
                                onClick={() => handleApproveCancellation(cancellation)}
                                disabled={!canApproveCancellation}
                              >
                                <CIcon icon={cilCheck} /> Approve
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                onClick={() => handleRejectCancellation(cancellation)}
                                disabled={!canRejectCancellation}
                              >
                                <CIcon icon={cilX} /> Reject
                              </CButton>
                            </div>
                          </CTableDataCell>
                        )}
                        {tabIndex === 6 && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color="primary"
                              onClick={() => handleOpenRestoreModal(cancellation._id, 'cancelled')}
                              disabled={!canRestoreFromRejectedCancelled}
                            >
                              Back to Normal
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
          {renderPagination(records)}
        </>
      );
    }

    return (
      <>
        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
                <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
                {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
                <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
                {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
                {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
                {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
                {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
                {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
                {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
                {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
                {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
                {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentRecords.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 || tabIndex === 4 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
                    No booking available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((booking, index) => {
                  const globalIndex = (currentPage - 1) * recordsPerPage + index + 1;
                  return (
                    <CTableRow key={index}>
                      {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
                      <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
                      {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
                      <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
                      {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}
                      {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
                        <CTableDataCell>
                          {booking.payment?.type === 'FINANCE' && canCreateCurrentTab && (
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
                      {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
                        <CTableDataCell>
                          {booking.payment?.type === 'FINANCE' && (
                            <>
                              {canUploadFinanceInThisTab() && (booking.documentStatus?.financeLetter?.status === 'NOT_UPLOADED' ||
                              booking.documentStatus?.financeLetter?.status === 'REJECTED') ? (
                                <Link
                                  to={`/upload-finance/${booking.id}`}
                                  state={{
                                    bookingId: booking.id,
                                    customerName: booking.customerDetails?.name,
                                    address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
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
                      {tabIndex != 2 && tabIndex != 4 && (
                        <CTableDataCell>
                          {canUploadKycInThisTab() && booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' ? (
                            <Link
                              to={`/upload-kyc/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails?.name,
                                address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
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
                                    customerName: booking.customerDetails?.name,
                                    address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}`
                                  }}
                                  className="ms-2"
                                >
                                  <button className="upload-kyc-btn icon-only">
                                    <CIcon icon={cilCloudUpload} />
                                  </button>
                                </Link>
                              )}
                            </div>
                          )}
                        </CTableDataCell>
                      )}
                      <CTableDataCell>
                        {/* Show "FROZEN" for FREEZZED status */}
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
                      {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
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
                      {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
                      {tabIndex != 2 && tabIndex != 4 && (
                        <CTableDataCell>
                          {booking.formPath && (
                            <>
                              {/* Check if user is SALES_EXECUTIVE using user.is_sales_executive */}
                              {user?.is_sales_executive &&
                              booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
                                <span className="awaiting-approval-text">Awaiting for Approval</span>
                              ) : (
                                canCreateCurrentTab && (
                                  <a
                                    href={`${config.baseURL}${booking.formPath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <CButton size="sm" className="upload-kyc-btn icon-only">
                                      <CIcon icon={cilPrint} />
                                    </CButton>
                                  </a>
                                )
                              )}
                            </>
                          )}
                        </CTableDataCell>
                      )}
                      {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}
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
                              {(tabIndex === 4) && canRestoreFromRejectedDiscount && (
                                <MenuItem onClick={() => handleOpenRestoreModal(booking.id, 'rejected_discount')} style={{ color: 'black' }}>
                                  <CIcon icon={cilCheck} className="me-2" /> Back to Normal
                                </MenuItem>
                              )}
                              {/* Disable edit for frozen bookings AND approved bookings */}
                              {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
                                <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
                                  <MenuItem style={{ color: 'black' }}>
                                    <CIcon icon={cilPencil} className="me-2" /> Edit
                                  </MenuItem>
                                </Link>
                              )}
                            </>
                          )}

                          {/* Edit button specifically for APPROVED tab */}
                          {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
                            <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
                              <MenuItem style={{ color: 'black' }}>
                                <CIcon icon={cilPencil} className="me-2" /> Edit
                              </MenuItem>
                            </Link>
                          )}

                          {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
                            <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
                              <CIcon icon={cilTrash} className="me-2" /> Delete
                            </MenuItem>
                          )}
                          {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
                            <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
                              <CIcon icon={cilTrash} className="me-2" /> Delete
                            </MenuItem>
                          )}

                          {/* ============ NEW VIEW FINANCE LETTER RECEIPT OPTION ============ */}
                          {/* View Finance Letter Receipt - Only for PENDING APPROVALS tab with FINANCE payment type */}
                          {tabIndex === 0 && booking.payment?.type === 'FINANCE' && canViewCurrentTab && (
                            <MenuItem onClick={() => handleViewFinanceLetterReceipt(booking._id || booking.id)} style={{ color: 'black' }}>
                              <CIcon icon={cilDescription} className="me-2" /> View Finance Letter Receipt
                            </MenuItem>
                          )}

                          {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewCurrentTab && (
                            <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
                              <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
                            </MenuItem>
                          )}

                          {canViewCurrentTab && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
                            <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
                              <CIcon icon={cilZoomOut} className="me-2" /> View KYC
                            </MenuItem>
                          )}

                          {/* Allocate Chassis - Check CREATE permission in APPROVED tab */}
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
                          {/* Change Vehicle - Check CREATE permission in ALLOCATED tab */}
                          {tabIndex === 3 && canUpdateChassisInAllocatedTab && (
                            <>
                              {booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
                                <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" /> Change Vehicle
                                </MenuItem>
                              )}
                            </>
                          )}

                          {/* Edit button specifically for ALLOCATED tab */}
{tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
  <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
    <MenuItem style={{ color: 'black' }}>
      <CIcon icon={cilPencil} className="me-2" /> Edit
    </MenuItem>
  </Link>
)}

                          {/* Approve/Reject Chassis - CREATE permission for both */}
                          {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
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
                          {tabIndex === 1 && booking.status === 'APPROVED' && canViewCurrentTab && (
                            <MenuItem onClick={() => handleOpenAvailableDocs(booking.id)} style={{ color: 'black' }}>
                              <CIcon icon={cilFile} className="me-2" /> Available Documents
                            </MenuItem>
                          )}
                          
                          {/* Self Insurance Management Option - Only for Frozen bookings */}
                          {tabIndex === 0 && booking.status === 'FREEZZED' && canViewCurrentTab && (
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
                  );
                })
              )}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(records)}
      </>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!canViewAnyTab) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view any tabs in All Booking.
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Booking List</div>
      {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateAllBooking && (
              <Link to="/new-booking">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Booking
                </CButton>
              </Link>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
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
                {canViewRejectedDiscountTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 4}
                      onClick={() => handleTabChange(4)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      Rejected Discount
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCancelledBookingTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 5}
                      onClick={() => handleTabChange(5)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 5 ? '4px solid #2759a2' : '3px solid transparent',
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
                      active={activeTab === 6}
                      onClick={() => handleTabChange(6)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 6 ? '4px solid #2759a2' : '3px solid transparent',
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
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewPendingApprovalsTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderBookingTable(filteredPending, 0)}
                  </CTabPane>
                )}
                {canViewApprovedTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderBookingTable(filteredApproved, 1)}
                  </CTabPane>
                )}
                {canViewPendingAllocatedTab && (
                  <CTabPane visible={activeTab === 2}>
                    {renderBookingTable(filteredPendingAllocated, 2)}
                  </CTabPane>
                )}
                {canViewAllocatedTab && (
                  <CTabPane visible={activeTab === 3}>
                    {renderBookingTable(filteredAllocated, 3)}
                  </CTabPane>
                )}
                {canViewRejectedDiscountTab && (
                  <CTabPane visible={activeTab === 4}>
                    {renderBookingTable(filteredRejected, 4)}
                  </CTabPane>
                )}
                {canViewCancelledBookingTab && (
                  <CTabPane visible={activeTab === 5}>
                    {cancelledLoading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <CSpinner color="primary" />
                      </div>
                    ) : (
                      renderBookingTable(filteredCancelledPending, 5)
                    )}
                  </CTabPane>
                )}
                {canViewRejectedCancelledBookingTab && (
                  <CTabPane visible={activeTab === 6}>
                    {cancelledLoading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <CSpinner color="primary" />
                      </div>
                    ) : (
                      renderBookingTable(filteredCancelledRejected, 6)
                    )}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in All Booking.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {/* Export Excel Modal */}
      <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Export Excel Report
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Start Date:</CFormLabel>
            <CFormInput
              type="date"
              value={exportDateRange.startDate}
              onChange={(e) => setExportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="mb-3">
            <CFormLabel>End Date:</CFormLabel>
            <CFormInput
              type="date"
              value={exportDateRange.endDate}
              onChange={(e) => setExportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              min={exportDateRange.startDate}
            />
          </div>
          <CAlert color="info">
            <small>
              This will export the branch sales report for the selected date range in Excel format.
            </small>
          </CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowExportModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleExportConfirm}
            disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}
          >
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Exporting...
              </>
            ) : (
              'Export Excel'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

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
      <ChassisNumberModal
        show={showChassisModal}
        onClose={() => {
          setShowChassisModal(false);
          setIsUpdateChassis(false);
          setSelectedBookingForChassis(null);
          setChassisError(''); // Clear error when closing modal
        }}
        onSave={handleSaveChassisNumber}
        isLoading={chassisLoading}
        booking={allData.find((b) => b._id === selectedBookingForChassis)}
        isUpdate={isUpdateChassis}
        errorMessage={chassisError} // Pass error to modal
        onClearError={handleClearChassisError} // Pass clear function
      />
      <PrintModal
        show={printModalVisible}
        onClose={() => {
          setPrintModalVisible(false);
          setSelectedBookingForPrint(null);
        }}
        bookingId={selectedBookingForPrint}
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

export default BookingList;