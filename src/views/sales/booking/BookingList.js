// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Link, Menu, MenuItem,
//   getDefaultSearchFields, useTableFilter, usePagination,
//   showError, axiosInstance, showSuccess, confirmDelete,
// } from '../../../utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import {
//   cilCloudUpload, cilPrint, cilPlus, cilSettings, cilPencil, cilTrash,
//   cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle, cilFile,
//   cilChevronLeft, cilChevronRight, cilDescription,
// } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import {
//   CNav, CNavItem, CNavLink, CTabContent, CTabPane,
//   CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
//   CCard, CCardBody, CCardHeader,
//   CButton, CFormInput, CSpinner, CFormLabel,
//   CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
//   CFormTextarea, CAlert, CPagination, CPaginationItem, CFormSelect,
//   CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
// import {
//   hasSafePagePermission, MODULES, PAGES, TABS, ACTIONS,
//   canViewPage, canCreateInPage, canUpdateInPage, canDeleteInPage,
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// // ─── Tab constants ─────────────────────────────────────────────────────────────
// const TAB = {
//   PENDING: 0, APPROVED: 1, PENDING_ALLOCATED: 2,
//   ALLOCATED: 3, REJECTED: 4, CANCELLED: 5, REJECTED_CANCELLED: 6,
// };

// const TAB_STATUSES = {
//   [TAB.PENDING]:           ['PENDING_APPROVAL', 'PENDING_APPROVAL (Discount_Exceeded)', 'FREEZZED'],
//   [TAB.APPROVED]:          ['APPROVED'],
//   [TAB.PENDING_ALLOCATED]: ['ON_HOLD', 'PENDING_GM_APPROVAL'],
//   [TAB.ALLOCATED]:         ['ALLOCATED'],
//   [TAB.REJECTED]:          ['REJECTED'],
// };

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT     = 50;

// const emptyTab = () => ({
//   docs: [], total: 0, pages: 0, currentPage: 1,
//   limit: DEFAULT_LIMIT, loading: false, search: '',
// });

// // ─── Component ─────────────────────────────────────────────────────────────────
// const BookingList = () => {
//   const [anchorEl, setAnchorEl]   = useState(null);
//   const [menuId, setMenuId]       = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate]     = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [error, setError]                       = useState(null);

//   // ── Separate local search state — NEVER tied to async tabData ──
//   const [localSearch, setLocalSearch] = useState('');

//   // Per-tab paginated state
//   const [tabData, setTabData] = useState(() =>
//     Object.values(TAB).reduce((acc, i) => { acc[i] = emptyTab(); return acc; }, {})
//   );

//   // Cancellation tabs (separate API)
//   const [cancelledPendingData,  setCancelledPendingData]  = useState([]);
//   const [cancelledRejectedData, setCancelledRejectedData] = useState([]);
//   const [cancelledPendingPage,  setCancelledPendingPage]  = useState(1);
//   const [cancelledRejectedPage, setCancelledRejectedPage] = useState(1);
//   const [cancelledLimit,        setCancelledLimit]        = useState(DEFAULT_LIMIT);
//   const [cancelledLoading,      setCancelledLoading]      = useState(false);
//   const [cancelledSearch,       setCancelledSearch]       = useState('');

//   // Debounce timer ref
//   const searchTimer = useRef(null);

//   // ── Stable ref for search input so it NEVER loses focus on re-render ──
//   const searchInputRef = useRef(null);

//   // Export modal
//   const [exportLoading,   setExportLoading]   = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate:   new Date().toISOString().split('T')[0],
//   });

//   // Chassis approval
//   const [chassisApprovalModal,       setChassisApprovalModal]       = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction,             setApprovalAction]             = useState('');
//   const [approvalNote,               setApprovalNote]               = useState('');
//   const [approvalLoading,            setApprovalLoading]            = useState(false);

//   // Cancellation approval
//   const [cancelApprovalModal,             setCancelApprovalModal]             = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction,            setCancelApprovalAction]            = useState('');
//   const [editedReason,                    setEditedReason]                    = useState('');
//   const [cancellationCharges,             setCancellationCharges]             = useState(0);
//   const [notes,                           setNotes]                           = useState('');
//   const [rejectionReason,                 setRejectionReason]                 = useState('');
//   const [cancelActionLoading,             setCancelActionLoading]             = useState(false);

//   // Chassis modal
//   const [showChassisModal,          setShowChassisModal]          = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading,            setChassisLoading]            = useState(false);
//   const [isUpdateChassis,           setIsUpdateChassis]           = useState(false);
//   const [chassisError,              setChassisError]              = useState('');

//   // Available docs modal
//   const [availableDocsModal,     setAvailableDocsModal]     = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates,     setAvailableTemplates]     = useState(null);
//   const [loadingTemplates,       setLoadingTemplates]       = useState(false);
//   const [selectedTemplateIds,    setSelectedTemplateIds]    = useState([]);
//   const [templateNotes,          setTemplateNotes]          = useState('');
//   const [submittingSelection,    setSubmittingSelection]    = useState(false);

//   // Restore
//   const [restoreBookingModal,    setRestoreBookingModal]    = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason,          setRestoreReason]          = useState('');
//   const [restoreNotes,           setRestoreNotes]           = useState('');
//   const [restoreLoading,         setRestoreLoading]         = useState(false);
//   const [restoreType,            setRestoreType]            = useState('');

//   // View / KYC / Finance / Print
//   const [viewModalVisible,        setViewModalVisible]        = useState(false);
//   const [selectedBooking,         setSelectedBooking]         = useState(null);
//   const [kycModalVisible,         setKycModalVisible]         = useState(false);
//   const [kycBookingId,            setKycBookingId]            = useState(null);
//   const [kycData,                 setKycData]                 = useState(null);
//   const [financeModalVisible,     setFinanceModalVisible]     = useState(false);
//   const [financeBookingId,        setFinanceBookingId]        = useState(null);
//   const [financeData,             setFinanceData]             = useState(null);
//   const [printModalVisible,       setPrintModalVisible]       = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [actionLoadingId,         setActionLoadingId]         = useState(null);
//   const [loadingId,               setLoadingId]               = useState(null);

//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PERMISSIONS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const canViewPendingApprovalsTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canViewApprovedTab                     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.APPROVED);
//   const canViewPendingAllocatedTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canViewAllocatedTab                    = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.ALLOCATED);
//   const canViewRejectedDiscountTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canViewCancelledBookingTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canViewRejectedCancelledBookingTab     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canCreateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canCreateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.APPROVED);
//   const canCreateInPendingAllocatedTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canCreateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canCreateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canCreateInCancelledBookingTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canUpdateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canUpdateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.APPROVED);
//   const canUpdateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canUpdateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canDeleteInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canDeleteInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);

//   const canApproveChassis               = canCreateInPendingAllocatedTab;
//   const canRejectChassis                = canCreateInPendingAllocatedTab;
//   const canApproveCancellation          = canCreateInCancelledBookingTab;
//   const canRejectCancellation           = canCreateInCancelledBookingTab;
//   const canRestoreFromRejectedDiscount  = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
//   const canApproveUpdate                = canCreateInPendingApprovalsTab;
//   const canRejectUpdate                 = canCreateInPendingApprovalsTab;
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
//   const canUpdateChassisInAllocatedTab  = canCreateInAllocatedTab;
//   const canEditInPendingApprovalsTab    = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab    = canUpdateInRejectedDiscountTab;
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
//   const canUploadKycInPendingApprovals     = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab          = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab         = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount     = canCreateInRejectedDiscountTab;
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab      = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab     = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;

//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab, 1: canCreateInApprovedTab,
//     2: canCreateInPendingAllocatedTab, 3: canCreateInAllocatedTab,
//     4: canCreateInRejectedDiscountTab, 5: canCreateInCancelledBookingTab,
//     6: canCreateInRejectedCancelledBookingTab,
//   };
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,     1: canViewApprovedTab,
//     2: canViewPendingAllocatedTab,     3: canViewAllocatedTab,
//     4: canViewRejectedDiscountTab,     5: canViewCancelledBookingTab,
//     6: canViewRejectedCancelledBookingTab,
//   };
//   const canViewAnyTab     = Object.values(canViewBookingInTab).some(Boolean);
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // HELPER — update a single tab's state slice
//   // ═══════════════════════════════════════════════════════════════════════════
//   const setTab = useCallback((tabIndex, updates) =>
//     setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
//   []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CORE FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
// const fetchTab = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
//   if (tabIndex >= TAB.CANCELLED) return;
//   setTab(tabIndex, { loading: true });

//   try {
//     const statuses  = TAB_STATUSES[tabIndex];
//     const trimmed   = search ? search.trim() : '';

//     if (statuses.length === 1) {
//       const params = { 
//         bookingType: 'BRANCH', 
//         status: statuses[0], 
//         page, 
//         limit 
//       };
      
//       // Only add search params if there's a search term
//       if (trimmed) {
//         params.search = trimmed;
//         // Restrict search to booking ID and customer name only
//         params.searchFields = 'bookingNumber,customerDetails.name';
//       }

//       const res = await axiosInstance.get('/bookings', { params });
//       const d   = res.data.data;

//       setTab(tabIndex, {
//         docs:        d.bookings || [],
//         total:       d.total    || 0,
//         pages:       d.pages    || 1,
//         currentPage: page,
//         limit,
//         loading:     false,
//         search,
//         _allDocs:    undefined,
//       });

//     } else {
//       // For tabs with multiple statuses
//       const responses = await Promise.all(
//         statuses.map(status => {
//           const params = { 
//             bookingType: 'BRANCH', 
//             status, 
//             page: 1, 
//             limit: 200 
//           };
          
//           if (trimmed) {
//             params.search = trimmed;
//             // Restrict search to booking ID and customer name only
//             params.searchFields = 'bookingNumber,customerDetails.name';
//           }
          
//           return axiosInstance.get('/bookings', { params });
//         })
//       );

//       let allDocs = [];
//       responses.forEach(r => {
//         allDocs = allDocs.concat(r.data.data.bookings || []);
//       });

//       // Remove duplicates
//       const seen = new Set();
//       allDocs = allDocs.filter(d => {
//         const id = String(d._id);
//         if (seen.has(id)) return false;
//         seen.add(id);
//         return true;
//       });

//       // If there's a search term, apply client-side filtering as fallback
//       // This ensures we only keep results that match booking ID or customer name
//       if (trimmed) {
//         const searchLower = trimmed.toLowerCase();
//         allDocs = allDocs.filter(booking => {
//           const bookingNumber = (booking.bookingNumber || '').toLowerCase();
//           const customerName = (booking.customerDetails?.name || '').toLowerCase();
          
//           return bookingNumber.includes(searchLower) || customerName.includes(searchLower);
//         });
//       }

//       allDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       const total    = allDocs.length;
//       const pages    = Math.max(1, Math.ceil(total / limit));
//       const safePage = Math.min(Math.max(1, page), pages);
//       const start    = (safePage - 1) * limit;
//       const docs     = allDocs.slice(start, start + limit);

//       setTab(tabIndex, {
//         docs, total, pages,
//         currentPage: safePage,
//         limit, loading: false, search,
//         _allDocs: allDocs,
//       });
//     }
//   } catch (err) {
//     console.error(`[fetchTab] tab ${tabIndex}`, err);
//     showError(err);
//     setTab(tabIndex, { loading: false });
//   }
// }, [setTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const fetchCancellationData = useCallback(async () => {
//     try {
//       setCancelledLoading(true);
//       const [pRes, rRes] = await Promise.all([
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'PENDING'  } }),
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'REJECTED' } }),
//       ]);
//       setCancelledPendingData(pRes.data.data  || []);
//       setCancelledRejectedData(rRes.data.data || []);
//     } catch (err) { showError(err); }
//     finally { setCancelledLoading(false); }
//   }, []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LIFECYCLE
//   // ═══════════════════════════════════════════════════════════════════════════
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
//     fetchTab(activeTab, 1, DEFAULT_LIMIT);
//     fetchCancellationData();
//   }, []);

//   useEffect(() => {
//     if (!canViewAnyTab) return;
//     const visible = [0,1,2,3,4,5,6].filter(i => canViewBookingInTab[i]);
//     if (visible.length > 0 && !visible.includes(activeTab)) setActiveTab(visible[0]);
//   }, [canViewAnyTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // REFRESH after mutations
//   // ═══════════════════════════════════════════════════════════════════════════
//   const refreshCurrentTab = useCallback(() => {
//     if (activeTab < TAB.CANCELLED) {
//       // Preserve current limit but reset everything else including search
//       const limit = tabData[activeTab].limit || DEFAULT_LIMIT;
//       // Reset tab to empty (clears search string, docs, pagination)
//       setTab(activeTab, { ...emptyTab(), limit });
//       // Clear local search display state
//       setLocalSearch('');
//       // Clear the uncontrolled DOM input value
//       if (searchInputRef.current) searchInputRef.current.value = '';
//       // Fetch fresh data with no search
//       fetchTab(activeTab, 1, limit, '');
//     } else {
//       fetchCancellationData();
//     }
//   }, [activeTab, tabData, setTab, fetchTab, fetchCancellationData, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TAB CHANGE — always fetch fresh with empty search when switching tabs
//   // FIX: Previously tabs kept stale search results when revisited because
//   //      fetchTab was only called if docs.length === 0. Now we ALWAYS
//   //      re-fetch with empty search on every tab switch, so coming back
//   //      to a previously-searched tab shows the full unfiltered list.
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleTabChange = useCallback((tab) => {
//     // Cancel any pending debounced search for the tab we're leaving
//     clearTimeout(searchTimer.current);

//     setActiveTab(tab);

//     // Clear local search display state
//     setLocalSearch('');

//     // Clear the uncontrolled DOM input value
//     if (searchInputRef.current) searchInputRef.current.value = '';

//     if (tab < TAB.CANCELLED) {
//       setTabData(prev => {
//         const td    = prev[tab];
//         const limit = td.limit || DEFAULT_LIMIT;

//         // Reset the tab's search string immediately so the "No results for X"
//         // empty-state message never flashes when returning to the tab
//         const resetTab = { ...td, search: '' };

//         // Always re-fetch fresh data with no search filter when switching tabs.
//         // Using setTimeout(0) so the state update above is flushed first.
//         setTimeout(() => fetchTab(tab, 1, limit, ''), 0);

//         return { ...prev, [tab]: resetTab };
//       });
//     }
//     // Cancellation tabs (5 & 6) don't need a re-fetch here;
//     // their data is already loaded and they do client-side filtering only.
//   }, [fetchTab, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handlePageChange = useCallback((tabIndex, newPage) => {
//     if (newPage < 1) return;
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (newPage > td.pages) return prev;

//       if (td._allDocs) {
//         const start = (newPage - 1) * td.limit;
//         const docs  = td._allDocs.slice(start, start + td.limit);
//         return { ...prev, [tabIndex]: { ...td, docs, currentPage: newPage } };
//       } else {
//         fetchTab(tabIndex, newPage, td.limit, td.search);
//         return prev;
//       }
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ROWS PER PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleLimitChange = useCallback((tabIndex, newLimit) => {
//     const limit = parseInt(newLimit, 10);
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (td._allDocs) {
//         const pages = Math.max(1, Math.ceil(td._allDocs.length / limit));
//         return { ...prev, [tabIndex]: { ...td, docs: td._allDocs.slice(0, limit), limit, currentPage: 1, pages } };
//       } else {
//         fetchTab(tabIndex, 1, limit, td.search);
//         return prev;
//       }
//     });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // SEARCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const activeTabRef = useRef(activeTab);
//   useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

//   const handleSearch = useCallback((value) => {
//     if (activeTabRef.current >= TAB.CANCELLED) {
//       setCancelledSearch(value);
//       setCancelledPendingPage(1);
//       setCancelledRejectedPage(1);
//       return;
//     }

//     setLocalSearch(value);

//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       const tab = activeTabRef.current;
//       setTabData(prev => {
//         const limit = prev[tab]?.limit || DEFAULT_LIMIT;
//         fetchTab(tab, 1, limit, value);
//         return prev;
//       });
//     }, 500);
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION CLIENT-SIDE FILTER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const getFilteredCancelled = useCallback((data) => {
//   if (!cancelledSearch) return data;
//   const t = cancelledSearch.toLowerCase();
//   return data.filter(c =>
//     // Only search by customer name for cancellation tabs (booking ID not available)
//     (c.customer?.name || '').toLowerCase().includes(t)
//   );
// }, [cancelledSearch]);

//   const getCancelledPage = useCallback((data, page) => {
//     const start = (page - 1) * cancelledLimit;
//     return data.slice(start, start + cancelledLimit);
//   }, [cancelledLimit]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGINATION RENDERERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderPagination = (tabIndex) => {
//     const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
//     if (!total) return null;

//     const start = (currentPage - 1) * limit + 1;
//     const end   = Math.min(currentPage * limit, total);

//     let sp = Math.max(1, currentPage - 2);
//     let ep = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3)         ep = Math.min(5, pages);
//     if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
//     const pageNums = [];
//     for (let i = sp; i <= ep; i++) pageNums.push(i);

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={limit} onChange={e => handleLimitChange(tabIndex, e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm" disabled={loading}>
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {sp > 1 && <><CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>{sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}</>}
//             {pageNums.map(p => <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(tabIndex, p)} disabled={loading}>{p}</CPaginationItem>)}
//             {ep < pages && <>{ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}<CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem></>}
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}><CIcon icon={cilChevronRight} /></CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   const renderCancelledPagination = (data, page, setPage) => {
//     const total = data.length;
//     if (total <= cancelledLimit) return null;
//     const pages = Math.ceil(total / cancelledLimit);
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={cancelledLimit} onChange={e => { setCancelledLimit(parseInt(e.target.value, 10)); setPage(1); }}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm">
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             Showing {(page - 1) * cancelledLimit + 1}–{Math.min(page * cancelledLimit, total)} of {total}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {Array.from({ length: pages }, (_, i) => i + 1).map(p =>
//               <CPaginationItem key={p} active={p === page} onClick={() => setPage(p)}>{p}</CPaginationItem>
//             )}
//             <CPaginationItem onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}><CIcon icon={cilChevronRight} /></CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ACTION HANDLERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleClick = (e, id) => { setAnchorEl(e.currentTarget); setMenuId(id); };
//   const handleClose = () => { setAnchorEl(null); setMenuId(null); };

//   const handleOpenRestoreModal = (bookingId, type) => {
//     if (type === 'rejected_discount' && !canRestoreFromRejectedDiscount) { showError('No permission to restore'); return; }
//     if (type === 'cancelled'         && !canRestoreFromRejectedCancelled) { showError('No permission to restore'); return; }
//     setSelectedRestoreBooking(bookingId); setRestoreType(type);
//     setRestoreReason(''); setRestoreNotes(''); setRestoreBookingModal(true); handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     const ok = restoreType === 'cancelled' ? canRestoreFromRejectedCancelled : canRestoreFromRejectedDiscount;
//     if (!ok || !selectedRestoreBooking) return;
//     try {
//       setRestoreLoading(true);
//       const url = restoreType === 'cancelled'
//         ? `/bookings/${selectedRestoreBooking}/restore`
//         : `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
//       await axiosInstance.put(url, { reason: restoreReason.trim() || undefined, notes: restoreNotes.trim() || undefined });
//       showSuccess('Booking restored successfully!');
//       setRestoreBookingModal(false); setSelectedRestoreBooking(null); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to restore booking'); }
//     finally { setRestoreLoading(false); }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!canViewAllBooking) { showError('No permission to view available documents'); return; }
//     try {
//       setLoadingTemplates(true); setSelectedBookingForDocs(bookingId);
//       const res = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(res.data.data); setAvailableDocsModal(true);
//       setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError('Failed to fetch available documents'); }
//     finally { setLoadingTemplates(false); }
//     handleClose();
//   };

//   const handleTemplateSelection = (id, canDownload) => {
//     if (!canDownload) return;
//     setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const handleSelectAllAvailable = () =>
//     setSelectedTemplateIds((availableTemplates?.available_templates?.templates || []).filter(t => t.can_download).map(t => t.template_id));

//   const handleSubmitTemplateSelection = async () => {
//     if (!canUpdateInApprovedTab) { showError('No permission to select templates'); return; }
//     if (!selectedBookingForDocs || !selectedTemplateIds.length) { showError('Please select at least one template'); return; }
//     try {
//       setSubmittingSelection(true);
//       await axiosInstance.post('/booking-templates/select', { bookingId: selectedBookingForDocs, templateIds: selectedTemplateIds, notes: templateNotes.trim() || undefined });
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false); setSelectedBookingForDocs(null);
//       setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError(err.response?.data?.message || 'Failed to select templates'); }
//     finally { setSubmittingSelection(false); }
//   };

//   const handleApproveCancellation = (c) => {
//     if (!canApproveCancellation) { showError('No permission to approve cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('APPROVE');
//     setEditedReason(c.cancellationRequest?.reason || '');
//     setCancellationCharges(c.cancellationRequest?.cancellationCharges || 0);
//     setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (c) => {
//     if (!canRejectCancellation) { showError('No permission to reject cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('REJECT');
//     setRejectionReason(''); setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleCancelActionSubmit = async () => {
//     if (!selectedCancellationForApproval) return;
//     try {
//       setCancelActionLoading(true);
//       if (cancelApprovalAction === 'APPROVE') {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, {
//           reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
//           editedReason, cancellationCharges, notes,
//         });
//         showSuccess('Cancellation approved!');
//       } else {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, { rejectionReason, notes });
//         showSuccess('Cancellation rejected!');
//       }
//       setCancelApprovalModal(false); setSelectedCancellationForApproval(null);
//       setEditedReason(''); setCancellationCharges(0); setNotes(''); setRejectionReason('');
//       fetchCancellationData();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process cancellation'); }
//     finally { setCancelActionLoading(false); }
//   };

//   const handleApproveChassis = (id) => {
//     if (!canApproveChassis) { showError('No permission to approve chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('APPROVE'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleRejectChassis = (id) => {
//     if (!canRejectChassis) { showError('No permission to reject chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('REJECT'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval || !approvalNote.trim()) { showError('Please enter approval/rejection note'); return; }
//     try {
//       setApprovalLoading(true);
//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, { action: approvalAction, approvalNote: approvalNote.trim() });
//       showSuccess(`Chassis ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'}!`);
//       setChassisApprovalModal(false); setSelectedBookingForApproval(null); setApprovalNote(''); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process chassis'); }
//     finally { setApprovalLoading(false); }
//   };

//   const handleViewBooking = async (id) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view booking'); return; }
//     try {
//       const res = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(res.data.data); setViewModalVisible(true); handleClose();
//     } catch (err) { showError('Failed to fetch booking details'); }
//   };

//   const handlePrint = (id) => {
//     if (!canPrintInTab[activeTab]) { showError('No permission to print in this tab'); return; }
//     setSelectedBookingForPrint(id); setPrintModalVisible(true); handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view KYC'); return; }
//     try {
//       setKycBookingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       const res = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       setKycData({ ...res.data.data, status: booking.documentStatus?.kyc?.status || 'PENDING', customerName: booking.customerDetails.name, address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}` });
//       setKycModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       setFinanceData({ status: booking.documentStatus?.financeLetter?.status || 'PENDING', customerName: booking.customerDetails.name, bookingId: booking._id });
//       setFinanceBookingId(bookingId); setFinanceModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//     finally { setActionLoadingId(null); }
//   };

//   const handleViewFinanceLetterReceipt = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const [bRes, dRes] = await Promise.all([
//         axiosInstance.get(`/bookings/${bookingId}`),
//         axiosInstance.get(`/disbursements/bookings/${bookingId}/disbursements`),
//       ]);
//       const bd  = bRes.data.data;
//       const dis = dRes.data.success && dRes.data.data.disbursements.length > 0
//         ? dRes.data.data.disbursements[0]?.disbursementAmount || 0 : 0;
//       const tab = window.open('', '_blank');
//       tab.document.write(generateFinanceLetterHTML(bd, dis));
//       tab.document.close();
//     } catch (err) { showError('Failed to fetch finance letter data'); }
//     finally { setActionLoadingId(null); handleClose(); }
//   };

//   const generateFinanceLetterHTML = (bd, disbursementAmount) => {
//     const today       = new Date().toLocaleDateString('en-GB');
//     const dealAmount  = bd?.discountedAmount || 0;
//     const gcAmount    = bd?.payment?.gcAmount || 0;
//     const exchAmt     = bd?.exchangeDetails?.price || 0;
//     const downPayment = (dealAmount + gcAmount) - disbursementAmount - exchAmt;
//     return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>FINANCER'S ASSURANCE LETTER</title><style>@page{size:A4;margin:20mm}body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.4;margin:0;padding:0;background:#f5f5f5}.page{width:210mm;min-height:297mm;margin:10mm auto;padding:15mm;background:white;box-shadow:0 0 10px rgba(0,0,0,.1);box-sizing:border-box}.details-table{width:100%;border-collapse:collapse;margin:20px 0}.details-table,.details-table td{border:1px solid black}.details-table td{padding:8px;vertical-align:top}.left-col{width:70%;font-weight:bold}.instruction-text{margin:15px 0;text-align:justify}.signature-box{width:25%;border-top:1px dashed black;margin-top:5px;margin-left:auto;padding:1px 0;text-align:right;color:#555;font-weight:bold}@media print{body{background:white}.page{box-shadow:none;margin:0;padding:0;width:100%}}</style></head><body><div class="page"><div style="text-align:right">Date: <strong>${today}</strong></div><div style="margin:15px 0">To,<br>The Director/Manager,<br>Gandhi Motors Pvt Ltd,<br>Nasik</div><div style="font-weight:bold;margin:15px 0">Sub:- Delivery Order &amp; Disbursement Assurance letter.</div><div style="margin:15px 0">Dear sir,</div><div>We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:</div><div style="margin:15px 0">Name : Mr./Mrs. : <strong>${bd?.customerDetails?.name||''}</strong></div><div style="margin:15px 0">Vehicle make &amp; model : <strong>${bd?.model?.model_name||bd?.model?.name||''}</strong> &nbsp;&nbsp; Booking Number: <strong>${bd?.bookingNumber||''}</strong></div><table class="details-table"><tr><td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td><td>${dealAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Disbursement Amount assured by finance company</td><td>${disbursementAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Net Down Payment to be taken from Customer</td><td>${downPayment.toLocaleString('en-IN')}</td></tr></table><div class="instruction-text">The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.</div><div class="instruction-text">This letter is non revokable &amp; we promise to pay you the above-mentioned loan amount within stipulated time.</div><div class="instruction-text">You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office &amp; give us the details of RTO registration along with the invoice, insurance &amp; Down payment receipt.</div><div class="instruction-text">Please do the needful.</div><div style="margin-top:40px"><div>For &amp; on behalf of</div><div>Financer's / Bank</div><div>Name: <strong>${bd?.payment?.financer?.name||''}</strong></div><div style="margin-top:15px">Employee Name: ________________________________</div><div style="margin-top:15px">Mobile No: ________________________________</div></div><div class="signature-box"><strong>Authorised Signature</strong></div></div></body></html>`;
//   };

//   const handleAllocateChassis = (id) => {
//     if (!canAllocateChassisInApprovedTab) { showError('No permission to allocate chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(false); setShowChassisModal(true); handleClose();
//   };

//   const handleUpdateChassis = (id) => {
//     if (!canUpdateChassisInAllocatedTab) { showError('No permission to update chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(true); setShowChassisModal(true); handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     const ok = isUpdateChassis ? canUpdateChassisInAllocatedTab : canAllocateChassisInApprovedTab;
//     if (!ok) { showError('No permission to save chassis number'); return; }
//     try {
//       setChassisLoading(true); setChassisError('');
//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       if (payload.reason) url += `?reason=${encodeURIComponent(payload.reason)}`;
//       const fd = new FormData();
//       fd.append('chassisNumber', payload.chassisNumber);
//       fd.append('is_deviation', payload.is_deviation);
//       if (payload.note) fd.append('note', payload.note);
//       if (payload.claimDetails) {
//         fd.append('hasClaim', 'true');
//         fd.append('priceClaim', payload.claimDetails.price);
//         fd.append('description', payload.claimDetails.description);
//         payload.claimDetails.documents.forEach(f => fd.append('documents', f));
//       } else { fd.append('hasClaim', 'false'); }
//       const res = await axiosInstance.put(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//       showSuccess(res.data.message);
//       setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError('');
//       refreshCurrentTab();
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || 'Failed to save chassis number';
//       setChassisError(msg); showError(msg);
//     } finally { setChassisLoading(false); }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     if (!canViewPendingApprovalsTab) { showError('No permission to view alteration requests'); return; }
//     setSelectedUpdate(booking); setDetailsModalOpen(true); handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!canApproveUpdate) { showError('No permission to approve updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/approve-update`, payload); showSuccess('Update approved'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!canRejectUpdate) { showError('No permission to reject updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/reject-update`, payload); showSuccess('Update rejected'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleDelete = async (id) => {
//     const ok = activeTab === 0 ? canDeleteBookingInPendingApprovals : canDeleteBookingInRejectedDiscount;
//     if (!ok) { showError('No permission to delete bookings'); return; }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try { await axiosInstance.delete(`/bookings/${id}`); showSuccess('Booking deleted'); refreshCurrentTab(); }
//       catch (err) { showError(err.response?.data?.message || 'Failed to delete booking'); }
//     }
//   };

//   const getAuthToken = () => token || localStorage.getItem('token') || localStorage.getItem('authToken');

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
//       const authToken = getAuthToken();
//       if (!authToken) { showError('Please login'); setExportLoading(false); setShowExportModal(false); return; }
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420';
//       const { startDate, endDate } = exportDateRange;
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a'); a.href = url;
//           a.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(a); a.click(); document.body.removeChild(a);
//           window.URL.revokeObjectURL(url);
//           showSuccess('Excel downloaded!'); setShowExportModal(false);
//         } else { showError(xhr.status === 401 ? 'Please login' : 'Download failed'); }
//         setExportLoading(false);
//       };
//       xhr.onerror = () => { showError('Network error'); setExportLoading(false); };
//       xhr.send();
//     } catch (err) { showError('Export failed'); setExportLoading(false); }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TABLE RENDERER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderBookingTable = (tabIndex) => {
//     if (!canViewBookingInTab[tabIndex]) {
//       const names = ['PENDING APPROVALS','APPROVED','PENDING ALLOCATED','ALLOCATED','REJECTED DISCOUNT','CANCELLED BOOKING','REJECTED CANCELLED BOOKING'];
//       return <CAlert color="warning">You do not have permission to view the {names[tabIndex]} tab.</CAlert>;
//     }

//     const canCreate    = canPrintInTab[tabIndex];
//     const canUploadKyc = () => [canUploadKycInPendingApprovals, canUploadKycInApprovedTab, false, canUploadKycInAllocatedTab, canUploadKycInRejectedDiscount][tabIndex] ?? false;
//     const canUploadFin = () => [canUploadFinanceInPendingApprovals, canUploadFinanceInApprovedTab, false, canUploadFinanceInAllocatedTab, canUploadFinanceInRejectedDiscount][tabIndex] ?? false;
//     const canEditThis  = () => tabIndex === 0 ? canEditInPendingApprovalsTab : tabIndex === 4 ? canEditInRejectedDiscountTab : false;
//     const getDocumentUrl = path => `https://gmplmis.com/dealership-api/api/v1/uploads${path}`;

//     // ── Cancellation tabs ────────────────────────────────────────────────────
//     if (tabIndex === TAB.CANCELLED || tabIndex === TAB.REJECTED_CANCELLED) {
//       const raw      = tabIndex === TAB.CANCELLED ? cancelledPendingData : cancelledRejectedData;
//       const filtered = getFilteredCancelled(raw);
//       const page     = tabIndex === TAB.CANCELLED ? cancelledPendingPage  : cancelledRejectedPage;
//       const setPage  = tabIndex === TAB.CANCELLED ? setCancelledPendingPage : setCancelledRejectedPage;
//       const records  = getCancelledPage(filtered, page);

//       return (
//         <>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Contact</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell>Requested At</CTableHeaderCell>
//                   <CTableHeaderCell>Requested By</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell>Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Refund Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {tabIndex === TAB.REJECTED_CANCELLED && <CTableHeaderCell>Rejection Reason</CTableHeaderCell>}
//                   <CTableHeaderCell>Options</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {records.length === 0 ? (
//                   <CTableRow><CTableDataCell colSpan={13} className="text-center text-danger">No cancellation requests available</CTableDataCell></CTableRow>
//                 ) : records.map((c, i) => (
//                   <CTableRow key={c._id || i}>
//                     <CTableDataCell>{(page - 1) * cancelledLimit + i + 1}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.name  || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.phone || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.bookingDate ? new Date(c.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedAt ? new Date(c.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.cancellationCharges || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.received            || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.refundAmount        || 0}</CTableDataCell>
//                     <CTableDataCell><span className={`status-badge ${c.cancellationRequest?.status?.toLowerCase() || ''}`}>{c.cancellationRequest?.status || 'N/A'}</span></CTableDataCell>
//                     {tabIndex === TAB.REJECTED_CANCELLED && <CTableDataCell>{c.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>
//                       {tabIndex === TAB.CANCELLED && (
//                         <div className="d-flex gap-1">
//                           <CButton size="sm" color="success" onClick={() => handleApproveCancellation(c)} disabled={!canApproveCancellation}><CIcon icon={cilCheck} /> Approve</CButton>
//                           <CButton size="sm" color="danger"  onClick={() => handleRejectCancellation(c)}  disabled={!canRejectCancellation}><CIcon icon={cilX} /> Reject</CButton>
//                         </div>
//                       )}
//                       {tabIndex === TAB.REJECTED_CANCELLED && (
//                         <CButton size="sm" color="primary" onClick={() => handleOpenRestoreModal(c._id, 'cancelled')} disabled={!canRestoreFromRejectedCancelled}>Back to Normal</CButton>
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </div>
//           {renderCancelledPagination(filtered, page, setPage)}
//         </>
//       );
//     }

//     // ── Booking tabs 0–4 ─────────────────────────────────────────────────────
//     const td      = tabData[tabIndex];
//     const records = td.docs;

//     return (
//       <>
//         {td.loading && (
//           <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//             <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//           </div>
//         )}
//         <div className="responsive-table-wrapper" style={{ opacity: td.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//           <CTable striped bordered hover className="responsive-table">
//             <CTableHead>
//               <CTableRow>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Sr.no</CTableHeaderCell>}
//                 <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Type</CTableHeaderCell>}
//                 <CTableHeaderCell>Color</CTableHeaderCell>
//                 <CTableHeaderCell>Fullname</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Contact1</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Finance Letter</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Upload Finance</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Upload KYC</CTableHeaderCell>}
//                 <CTableHeaderCell>Status</CTableHeaderCell>
//                 {tabIndex === 0 && <CTableHeaderCell>Altration Request</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Is Claim</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Claim Documents</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Print</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Note</CTableHeaderCell>}
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.length === 0 && !td.loading ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={20} className="text-center text-danger">
//                     {td.search ? `No results found for "${td.search}"` : 'No booking available'}
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : records.map((booking, index) => {
//                 const globalIndex = (td.currentPage - 1) * td.limit + index + 1;
//                 const bid = booking._id || booking.id;
//                 return (
//                   <CTableRow key={bid}>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
//                     <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && canCreate && (
//                           <CButton size="sm" className="view-button" onClick={() => handlePrint(bid)}>Print</CButton>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && (
//                           <>
//                             {canUploadFin() && ['NOT_UPLOADED','REJECTED'].includes(booking.documentStatus?.financeLetter?.status) ? (
//                               <Link to={`/upload-finance/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//                                 <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></CButton>
//                               </Link>
//                             ) : null}
//                             {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                               <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.financeLetter?.status || ''}</span>
//                             )}
//                           </>
//                         )}
//                       </CTableDataCell>
//                     )}

//                 {tabIndex !== 2 && tabIndex !== 4 && (
//   <CTableDataCell>
//     {(booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' || booking.documentStatus?.kyc?.status === 'INCOMPLETE') ? (
//       <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//         <CButton 
//           size="sm" 
//           className="upload-kyc-btn icon-only"
//           style={{
//             backgroundColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//             borderColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//             color: 'white'
//           }}
//         >
//           <CIcon icon={cilCloudUpload} />
//         </CButton>
//       </Link>
//     ) : (
//       <div className="d-flex align-items-center">
//         <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.kyc?.status || ''}</span>
//         {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//           <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }} className="ms-2">
//             <button className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></button>
//           </Link>
//         )}
//       </div>
//     )}
//   </CTableDataCell>
// )}

//                     <CTableDataCell>
//                       <span className="status-badge" style={{
//                         backgroundColor:
//                           booking.status === 'FREEZZED'                              ? '#ffc107' :
//                           booking.status === 'PENDING_APPROVAL'                      ? '#0d6efd' :
//                           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'  ? '#fd7e14' :
//                           booking.status === 'APPROVED'                              ? '#198754' :
//                           booking.status === 'REJECTED'                              ? '#dc3545' :
//                           booking.status === 'ALLOCATED'                             ? '#6f42c1' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
//                         fontWeight: '500', display: 'inline-block',
//                       }}>
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
//                         {booking.claimDetails?.hasClaim
//                           ? <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                           : <CIcon icon={cilXCircle}    className="status-icon inactive-icon" />}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                     {tabIndex === 3 && (
//                       <CTableDataCell>
//                         {booking.claimDetails?.hasClaim && booking.claimDetails?.documents?.length > 0 ? (
//                           <CDropdown>
//                             <CDropdownToggle size="sm" color="info" variant="outline">{booking.claimDetails.documents.length} Doc{booking.claimDetails.documents.length > 1 ? 's' : ''}</CDropdownToggle>
//                             <CDropdownMenu>
//                               {booking.claimDetails.documents.map((doc, di) => (
//                                 <CDropdownItem key={di} onClick={() => window.open(getDocumentUrl(doc.path), '_blank')}>
//                                   <CIcon icon={cilDescription} className="me-2" />
//                                   <strong>{doc.originalName || `Document ${di + 1}`}</strong>
//                                   <small className="ms-2">{(doc.size / 1024).toFixed(2)} KB</small>
//                                 </CDropdownItem>
//                               ))}
//                             </CDropdownMenu>
//                           </CDropdown>
//                         ) : booking.claimDetails?.hasClaim
//                           ? <span className="text-muted">No documents</span>
//                           : <span className="text-muted">-</span>}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.formPath && (
//                           user?.is_sales_executive && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : canCreate ? (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilPrint} /></CButton>
//                             </a>
//                           ) : null
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}

//                     <CTableDataCell>
//                       <CButton size="sm" className="option-button btn-sm" onClick={e => handleClick(e, bid)}>
//                         <CIcon icon={cilSettings} /> Options
//                       </CButton>
//                       <Menu id={`action-menu-${bid}`} anchorEl={anchorEl} open={menuId === bid} onClose={handleClose}>
//                         {canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewBooking(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Booking</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.updateRequestStatus === 'PENDING' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Altration Req</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex === 4 && canRestoreFromRejectedDiscount && (
//                           <MenuItem onClick={() => handleOpenRestoreModal(bid, 'rejected_discount')} style={{ color: 'black' }}><CIcon icon={cilCheck} className="me-2" /> Back to Normal</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.payment?.type === 'FINANCE' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewFinanceLetterReceipt(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilDescription} className="me-2" /> View Finance Letter Receipt</MenuItem>
//                         )}
//                         {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter</MenuItem>
//                         )}
//                         {canViewBookingInTab[tabIndex] && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewKYC(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View KYC</MenuItem>
//                         )}
//                         {tabIndex === 1 && canAllocateChassisInApprovedTab && booking.status === 'APPROVED' && (booking.payment?.type === 'CASH' || (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status === 'APPROVED')) && (
//                           <MenuItem onClick={() => handleAllocateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Allocate Chassis</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateChassisInAllocatedTab && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                           <MenuItem onClick={() => handleUpdateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Change Vehicle</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
//                           <>
//                             {canApproveChassis && <MenuItem onClick={() => handleApproveChassis(bid)} style={{ color: 'green' }}><CIcon icon={cilCheck} className="me-2" /> Approve Chassis</MenuItem>}
//                             {canRejectChassis  && <MenuItem onClick={() => handleRejectChassis(bid)}  style={{ color: 'red'   }}><CIcon icon={cilX}     className="me-2" /> Reject Chassis</MenuItem>}
//                           </>
//                         )}
//                         {tabIndex === 1 && booking.status === 'APPROVED' && canViewBookingInTab[1] && (
//                           <MenuItem onClick={() => handleOpenAvailableDocs(bid)} style={{ color: 'black' }}><CIcon icon={cilFile} className="me-2" /> Available Documents</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.status === 'FREEZZED' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => window.location.href = '/#/self-insurance'} style={{ color: 'black' }}><CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance</MenuItem>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   </CTableRow>
//                 );
//               })}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination(tabIndex)}
//       </>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LOADING / PERMISSION GUARDS
//   // ═══════════════════════════════════════════════════════════════════════════
//   if (!canViewAnyTab) {
//     return <div className="alert alert-danger m-3">You do not have permission to view any tabs in All Booking.</div>;
//   }

//   const currentSearch = activeTab >= TAB.CANCELLED ? cancelledSearch : localSearch;

//   // ═══════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════════════════
//   return (
//     <div>
//       <div className="title">Booking List</div>
//       {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1"><CIcon icon={cilPlus} className="icon" /> New Booking</CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           {/* ── Tab nav ── */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {[
//               [TAB.PENDING,            'Pending Approvals',  canViewPendingApprovalsTab],
//               [TAB.APPROVED,           'Approved',           canViewApprovedTab],
//               [TAB.PENDING_ALLOCATED,  'Pending Allocated',  canViewPendingAllocatedTab],
//               [TAB.ALLOCATED,          'Allocated',          canViewAllocatedTab],
//               [TAB.REJECTED,           'Rejected Discount',  canViewRejectedDiscountTab],
//               [TAB.CANCELLED,          'Cancelled Booking',  canViewCancelledBookingTab],
//               [TAB.REJECTED_CANCELLED, 'Rejected Cancelled', canViewRejectedCancelledBookingTab],
//             ].map(([idx, label, perm]) => perm && (
//               <CNavItem key={idx}>
//                 <CNavLink
//                   active={activeTab === idx}
//                   onClick={() => handleTabChange(idx)}
//                   style={{ cursor: 'pointer', borderTop: activeTab === idx ? '4px solid #2759a2' : '3px solid transparent', borderBottom: 'none', color: 'black' }}
//                 >
//                   {label}
//                 </CNavLink>
//               </CNavItem>
//             ))}
//           </CNav>

//           {/* ── Search bar (uncontrolled input to prevent focus loss) ── */}
//           <div className="d-flex justify-content-end mb-3">
//             <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//             <input
//   ref={searchInputRef}
//   type="text"
//   defaultValue=""
//   style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
//   className="d-inline-block square-search"
//   onChange={e => handleSearch(e.target.value)}
//   placeholder="Search by Booking ID or Customer Name..."
//   autoComplete="off"
// />
//           </div>

//           {/* ── Tab content ── */}
//           <CTabContent>
//             {[TAB.PENDING, TAB.APPROVED, TAB.PENDING_ALLOCATED, TAB.ALLOCATED, TAB.REJECTED].map(idx =>
//               canViewBookingInTab[idx] && (
//                 <CTabPane key={idx} visible={activeTab === idx}>
//                   {activeTab === idx && renderBookingTable(idx)}
//                 </CTabPane>
//               )
//             )}
//             {canViewCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.CANCELLED}>
//                 {activeTab === TAB.CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//             {canViewRejectedCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.REJECTED_CANCELLED}>
//                 {activeTab === TAB.REJECTED_CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.REJECTED_CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* ═══ MODALS ═══ */}

//       {/* Export */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Export Excel Report</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Start Date:</CFormLabel><CFormInput type="date" value={exportDateRange.startDate} onChange={e => setExportDateRange(p => ({ ...p, startDate: e.target.value }))} /></div>
//           <div className="mb-3"><CFormLabel>End Date:</CFormLabel><CFormInput type="date" value={exportDateRange.endDate} onChange={e => setExportDateRange(p => ({ ...p, endDate: e.target.value }))} min={exportDateRange.startDate} /></div>
//           <CAlert color="info"><small>This will export the branch sales report for the selected date range.</small></CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleExportConfirm} disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}>
//             {exportLoading ? <><CSpinner size="sm" className="me-2" />Exporting…</> : 'Export Excel'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Restore */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader><CModalTitle>Restore Booking to Normal</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Reason:</CFormLabel><CFormTextarea value={restoreReason} onChange={e => setRestoreReason(e.target.value)} rows={2} placeholder="Enter reason" /></div>
//           <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={restoreNotes} onChange={e => setRestoreNotes(e.target.value)} rows={2} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleRestoreBooking} disabled={restoreLoading}>
//             {restoreLoading ? <><CSpinner size="sm" className="me-2" />Processing…</> : 'Restore Booking'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Available Docs */}
//       <CModal visible={availableDocsModal} onClose={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }} size="lg">
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Available Documents - {availableTemplates?.booking_number || ''}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5"><CSpinner color="primary" /><p className="mt-3">Loading…</p></div>
//           ) : availableTemplates ? (
//             <div>
//               <h6>Customer: {availableTemplates.customer_name}</h6>
//               <div className="alert alert-info mb-3"><small><strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} available.</small></div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0">Templates ({availableTemplates.available_templates.count})</h6>
//                 <div className="d-flex gap-2">
//                   <CButton size="sm" color="primary" variant="outline" onClick={handleSelectAllAvailable}>Select All</CButton>
//                   <CButton size="sm" color="secondary" variant="outline" onClick={() => setSelectedTemplateIds([])}>Clear All</CButton>
//                 </div>
//               </div>
//               <div className="border rounded p-3">
//                 {(availableTemplates.available_templates.templates || []).map(t => (
//                   <div key={t.template_id} className="mb-3">
//                     <div className="form-check">
//                       <input className="form-check-input" type="checkbox" id={`tpl-${t.template_id}`} checked={selectedTemplateIds.includes(t.template_id)} onChange={() => handleTemplateSelection(t.template_id, t.can_download)} disabled={!t.can_download} />
//                       <label className="form-check-label d-flex justify-content-between align-items-center w-100" htmlFor={`tpl-${t.template_id}`} style={{ cursor: t.can_download ? 'pointer' : 'not-allowed', opacity: t.can_download ? 1 : 0.6 }}>
//                         <div><strong>{t.template_name}</strong><br /><small className="text-muted">{t.can_download ? 'Available' : 'Not available'}</small></div>
//                         {!t.can_download && <small className="text-danger"><CIcon icon={cilXCircle} className="me-1" />Disabled</small>}
//                       </label>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={templateNotes} onChange={e => setTemplateNotes(e.target.value)} rows={2} /></div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }}>Cancel</CButton>
//           <CButton color="primary" onClick={handleSubmitTemplateSelection} disabled={!selectedTemplateIds.length || submittingSelection}>
//             {submittingSelection ? <><CSpinner size="sm" className="me-2" />Processing…</> : `Select (${selectedTemplateIds.length}) Templates`}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation' : 'Reject Cancellation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3"><CFormLabel>Original Reason:</CFormLabel><CFormInput type="text" value={selectedCancellationForApproval?.cancellationRequest?.reason || ''} readOnly /></div>
//               <div className="mb-3"><CFormLabel>Edited Reason (Optional):</CFormLabel><CFormTextarea value={editedReason} onChange={e => setEditedReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Cancellation Charges:</CFormLabel><CFormInput type="number" value={cancellationCharges} onChange={e => setCancellationCharges(Number(e.target.value))} min="0" /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3"><CFormLabel>Rejection Reason:</CFormLabel><CFormTextarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleCancelActionSubmit} disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}>
//             {cancelActionLoading ? <CSpinner size="sm" /> : cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>{approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}</CFormLabel><CFormTextarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={3} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleChassisApprovalSubmit} disabled={approvalLoading}>
//             {approvalLoading ? <CSpinner size="sm" /> : approvalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Sub-components */}
//       <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={refreshCurrentTab} />
//       <KYCView open={kycModalVisible} onClose={() => { setKycModalVisible(false); setKycBookingId(null); }} kycData={kycData} refreshData={refreshCurrentTab} bookingId={kycBookingId} />
//       <FinanceView open={financeModalVisible} onClose={() => { setFinanceModalVisible(false); setFinanceBookingId(null); }} financeData={financeData} refreshData={refreshCurrentTab} bookingId={financeBookingId} />
//       <ChassisNumberModal show={showChassisModal} onClose={() => { setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError(''); }} onSave={handleSaveChassisNumber} isLoading={chassisLoading} booking={tabData[activeTab]?.docs?.find(b => b._id === selectedBookingForChassis || b.id === selectedBookingForChassis)} isUpdate={isUpdateChassis} errorMessage={chassisError} onClearError={() => setChassisError('')} />
//       <PrintModal show={printModalVisible} onClose={() => { setPrintModalVisible(false); setSelectedBookingForPrint(null); }} bookingId={selectedBookingForPrint} />
//       <PendingUpdateDetailsModal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} updateData={selectedUpdate} onApprove={payload => handleApproveUpdate(selectedUpdate._id, payload)} onReject={payload => handleRejectUpdate(selectedUpdate._id, payload)} />
//     </div>
//   );
// };

// export default BookingList;










// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Link, Menu, MenuItem,
//   getDefaultSearchFields, useTableFilter, usePagination,
//   showError, axiosInstance, showSuccess, confirmDelete,
// } from '../../../utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import {
//   cilCloudUpload, cilPrint, cilPlus, cilSettings, cilPencil, cilTrash,
//   cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle, cilFile,
//   cilChevronLeft, cilChevronRight, cilDescription,
// } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import {
//   CNav, CNavItem, CNavLink, CTabContent, CTabPane,
//   CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
//   CCard, CCardBody, CCardHeader,
//   CButton, CFormInput, CSpinner, CFormLabel,
//   CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
//   CFormTextarea, CAlert, CPagination, CPaginationItem, CFormSelect,
//   CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
// import {
//   hasSafePagePermission, MODULES, PAGES, TABS, ACTIONS,
//   canViewPage, canCreateInPage, canUpdateInPage, canDeleteInPage,
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// // ─── Tab constants ─────────────────────────────────────────────────────────────
// const TAB = {
//   PENDING: 0, APPROVED: 1, PENDING_ALLOCATED: 2,
//   ALLOCATED: 3, REJECTED: 4, CANCELLED: 5, REJECTED_CANCELLED: 6,
// };

// const TAB_STATUSES = {
//   [TAB.PENDING]:           ['PENDING_APPROVAL', 'PENDING_APPROVAL (Discount_Exceeded)', 'FREEZZED'],
//   [TAB.APPROVED]:          ['APPROVED'],
//   [TAB.PENDING_ALLOCATED]: ['ON_HOLD', 'PENDING_GM_APPROVAL'],
//   [TAB.ALLOCATED]:         ['ALLOCATED'],
//   [TAB.REJECTED]:          ['REJECTED'],
// };

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT     = 50;

// // ── Roles allowed to upload scratch cards (always visible for these roles) ──
// const SCRATCH_CARD_ALLOWED_ROLES = ['MANAGER', 'GENERAL_MANAGER', 'ADMIN', 'SUPERADMIN'];

// const emptyTab = () => ({
//   docs: [], total: 0, pages: 0, currentPage: 1,
//   limit: DEFAULT_LIMIT, loading: false, search: '',
// });

// // ─── Component ─────────────────────────────────────────────────────────────────
// const BookingList = () => {
//   const [anchorEl, setAnchorEl]   = useState(null);
//   const [menuId, setMenuId]       = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate]     = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [error, setError]                       = useState(null);

//   // ── Separate local search state — NEVER tied to async tabData ──
//   const [localSearch, setLocalSearch] = useState('');

//   // Per-tab paginated state
//   const [tabData, setTabData] = useState(() =>
//     Object.values(TAB).reduce((acc, i) => { acc[i] = emptyTab(); return acc; }, {})
//   );

//   // Cancellation tabs (separate API)
//   const [cancelledPendingData,  setCancelledPendingData]  = useState([]);
//   const [cancelledRejectedData, setCancelledRejectedData] = useState([]);
//   const [cancelledPendingPage,  setCancelledPendingPage]  = useState(1);
//   const [cancelledRejectedPage, setCancelledRejectedPage] = useState(1);
//   const [cancelledLimit,        setCancelledLimit]        = useState(DEFAULT_LIMIT);
//   const [cancelledLoading,      setCancelledLoading]      = useState(false);
//   const [cancelledSearch,       setCancelledSearch]       = useState('');

//   // Debounce timer ref
//   const searchTimer = useRef(null);

//   // ── Stable ref for search input so it NEVER loses focus on re-render ──
//   const searchInputRef = useRef(null);

//   // Export modal
//   const [exportLoading,   setExportLoading]   = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate:   new Date().toISOString().split('T')[0],
//   });

//   // Chassis approval
//   const [chassisApprovalModal,       setChassisApprovalModal]       = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction,             setApprovalAction]             = useState('');
//   const [approvalNote,               setApprovalNote]               = useState('');
//   const [approvalLoading,            setApprovalLoading]            = useState(false);

//   // Cancellation approval
//   const [cancelApprovalModal,             setCancelApprovalModal]             = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction,            setCancelApprovalAction]            = useState('');
//   const [editedReason,                    setEditedReason]                    = useState('');
//   const [cancellationCharges,             setCancellationCharges]             = useState(0);
//   const [notes,                           setNotes]                           = useState('');
//   const [rejectionReason,                 setRejectionReason]                 = useState('');
//   const [cancelActionLoading,             setCancelActionLoading]             = useState(false);

//   // Chassis modal
//   const [showChassisModal,          setShowChassisModal]          = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading,            setChassisLoading]            = useState(false);
//   const [isUpdateChassis,           setIsUpdateChassis]           = useState(false);
//   const [chassisError,              setChassisError]              = useState('');

//   // Available docs modal
//   const [availableDocsModal,     setAvailableDocsModal]     = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates,     setAvailableTemplates]     = useState(null);
//   const [loadingTemplates,       setLoadingTemplates]       = useState(false);
//   const [selectedTemplateIds,    setSelectedTemplateIds]    = useState([]);
//   const [templateNotes,          setTemplateNotes]          = useState('');
//   const [submittingSelection,    setSubmittingSelection]    = useState(false);

//   // Restore
//   const [restoreBookingModal,    setRestoreBookingModal]    = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason,          setRestoreReason]          = useState('');
//   const [restoreNotes,           setRestoreNotes]           = useState('');
//   const [restoreLoading,         setRestoreLoading]         = useState(false);
//   const [restoreType,            setRestoreType]            = useState('');

//   // View / KYC / Finance / Print
//   const [viewModalVisible,        setViewModalVisible]        = useState(false);
//   const [selectedBooking,         setSelectedBooking]         = useState(null);
//   const [kycModalVisible,         setKycModalVisible]         = useState(false);
//   const [kycBookingId,            setKycBookingId]            = useState(null);
//   const [kycData,                 setKycData]                 = useState(null);
//   const [financeModalVisible,     setFinanceModalVisible]     = useState(false);
//   const [financeBookingId,        setFinanceBookingId]        = useState(null);
//   const [financeData,             setFinanceData]             = useState(null);
//   const [printModalVisible,       setPrintModalVisible]       = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [actionLoadingId,         setActionLoadingId]         = useState(null);
//   const [loadingId,               setLoadingId]               = useState(null);

//   // ── Scratch Card (Upload) ─────────────────────────────────────────────────
//   const [scratchCardModal,          setScratchCardModal]          = useState(false);
//   const [selectedBookingForScratch, setSelectedBookingForScratch] = useState(null);
//   const [scratchCardLoading,        setScratchCardLoading]        = useState(false);
//   const [schemes,                   setSchemes]                   = useState([]);
//   const [schemesLoading,            setSchemesLoading]            = useState(false);
//   const [scratchCardForm,           setScratchCardForm]           = useState({
//     scheme: '',
//     scratch_card_amount: '',
//     scratch_card_document: null,
//     scheme_document: null,
//   });
//   const [scratchCardErrors,         setScratchCardErrors]         = useState({});

//   // ── Scratch Card (View) ───────────────────────────────────────────────────
//   const [viewScratchModal,               setViewScratchModal]               = useState(false);
//   const [selectedBookingForViewScratch,  setSelectedBookingForViewScratch]  = useState(null);
//   const [scratchDocsData,                setScratchDocsData]                = useState(null);
//   const [scratchDocsLoading,             setScratchDocsLoading]             = useState(false);

//   // ── Scheme Form PDF generation state ──────────────────────────────────────
//   const [isGeneratingSchemeForm, setIsGeneratingSchemeForm] = useState(false);

//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PERMISSIONS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const canViewPendingApprovalsTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canViewApprovedTab                     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.APPROVED);
//   const canViewPendingAllocatedTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canViewAllocatedTab                    = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.ALLOCATED);
//   const canViewRejectedDiscountTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canViewCancelledBookingTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canViewRejectedCancelledBookingTab     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canCreateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canCreateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.APPROVED);
//   const canCreateInPendingAllocatedTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canCreateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canCreateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canCreateInCancelledBookingTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canUpdateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canUpdateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.APPROVED);
//   const canUpdateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canUpdateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canDeleteInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canDeleteInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);

//   const canApproveChassis               = canCreateInPendingAllocatedTab;
//   const canRejectChassis                = canCreateInPendingAllocatedTab;
//   const canApproveCancellation          = canCreateInCancelledBookingTab;
//   const canRejectCancellation           = canCreateInCancelledBookingTab;
//   const canRestoreFromRejectedDiscount  = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
//   const canApproveUpdate                = canCreateInPendingApprovalsTab;
//   const canRejectUpdate                 = canCreateInPendingApprovalsTab;
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
//   const canUpdateChassisInAllocatedTab  = canCreateInAllocatedTab;
//   const canEditInPendingApprovalsTab    = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab    = canUpdateInRejectedDiscountTab;
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
//   const canUploadKycInPendingApprovals     = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab          = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab         = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount     = canCreateInRejectedDiscountTab;
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab      = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab     = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;

//   // ── ROLE-BASED PERMISSION FOR SCRATCH CARD UPLOAD ─────────────────────────
//   // Upload Scratch Card is always visible in the Allocated tab for these roles.
//   //
//   // /me returns user.roles as an array of objects:
//   //   [{ _id, name: 'MANAGER', isSuperAdmin: false, permissionsCount: 0 }]
//   //
//   // We also honour the boolean role flags returned by /me as a fallback.
//   const userRoleNames = (Array.isArray(user?.roles) ? user.roles : [])
//     .map(r => {
//       if (typeof r === 'string') return r.toUpperCase();
//       if (r && typeof r === 'object' && r.name) return r.name.toString().toUpperCase();
//       return '';
//     })
//     .filter(Boolean);

//   // Fallback: boolean flags on user
//   const hasRoleFlag =
//     user?.is_superadmin === true ||
//     user?.is_admin === true ||
//     user?.is_general_manager === true ||
//     user?.is_sales_manager === true;

//   const canUploadScratchCard =
//     hasRoleFlag || userRoleNames.some(r => SCRATCH_CARD_ALLOWED_ROLES.includes(r));
//   // ──────────────────────────────────────────────────────────────────────────

//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab, 1: canCreateInApprovedTab,
//     2: canCreateInPendingAllocatedTab, 3: canCreateInAllocatedTab,
//     4: canCreateInRejectedDiscountTab, 5: canCreateInCancelledBookingTab,
//     6: canCreateInRejectedCancelledBookingTab,
//   };
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,     1: canViewApprovedTab,
//     2: canViewPendingAllocatedTab,     3: canViewAllocatedTab,
//     4: canViewRejectedDiscountTab,     5: canViewCancelledBookingTab,
//     6: canViewRejectedCancelledBookingTab,
//   };
//   const canViewAnyTab     = Object.values(canViewBookingInTab).some(Boolean);
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // HELPER — update a single tab's state slice
//   // ═══════════════════════════════════════════════════════════════════════════
//   const setTab = useCallback((tabIndex, updates) =>
//     setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
//   []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CORE FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const fetchTab = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
//     if (tabIndex >= TAB.CANCELLED) return;
//     setTab(tabIndex, { loading: true });

//     try {
//       const statuses  = TAB_STATUSES[tabIndex];
//       const trimmed   = search ? search.trim() : '';

//       if (statuses.length === 1) {
//         const params = {
//           bookingType: 'BRANCH',
//           status: statuses[0],
//           page,
//           limit
//         };

//         if (trimmed) {
//           params.search = trimmed;
//           params.searchFields = 'bookingNumber,customerDetails.name';
//         }

//         const res = await axiosInstance.get('/bookings', { params });
//         const d   = res.data.data;

//         setTab(tabIndex, {
//           docs:        d.bookings || [],
//           total:       d.total    || 0,
//           pages:       d.pages    || 1,
//           currentPage: page,
//           limit,
//           loading:     false,
//           search,
//           _allDocs:    undefined,
//         });

//       } else {
//         const responses = await Promise.all(
//           statuses.map(status => {
//             const params = {
//               bookingType: 'BRANCH',
//               status,
//               page: 1,
//               limit: 200
//             };

//             if (trimmed) {
//               params.search = trimmed;
//               params.searchFields = 'bookingNumber,customerDetails.name';
//             }

//             return axiosInstance.get('/bookings', { params });
//           })
//         );

//         let allDocs = [];
//         responses.forEach(r => {
//           allDocs = allDocs.concat(r.data.data.bookings || []);
//         });

//         const seen = new Set();
//         allDocs = allDocs.filter(d => {
//           const id = String(d._id);
//           if (seen.has(id)) return false;
//           seen.add(id);
//           return true;
//         });

//         if (trimmed) {
//           const searchLower = trimmed.toLowerCase();
//           allDocs = allDocs.filter(booking => {
//             const bookingNumber = (booking.bookingNumber || '').toLowerCase();
//             const customerName = (booking.customerDetails?.name || '').toLowerCase();

//             return bookingNumber.includes(searchLower) || customerName.includes(searchLower);
//           });
//         }

//         allDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         const total    = allDocs.length;
//         const pages    = Math.max(1, Math.ceil(total / limit));
//         const safePage = Math.min(Math.max(1, page), pages);
//         const start    = (safePage - 1) * limit;
//         const docs     = allDocs.slice(start, start + limit);

//         setTab(tabIndex, {
//           docs, total, pages,
//           currentPage: safePage,
//           limit, loading: false, search,
//           _allDocs: allDocs,
//         });
//       }
//     } catch (err) {
//       console.error(`[fetchTab] tab ${tabIndex}`, err);
//       showError(err);
//       setTab(tabIndex, { loading: false });
//     }
//   }, [setTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const fetchCancellationData = useCallback(async () => {
//     try {
//       setCancelledLoading(true);
//       const [pRes, rRes] = await Promise.all([
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'PENDING'  } }),
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'REJECTED' } }),
//       ]);
//       setCancelledPendingData(pRes.data.data  || []);
//       setCancelledRejectedData(rRes.data.data || []);
//     } catch (err) { showError(err); }
//     finally { setCancelledLoading(false); }
//   }, []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LIFECYCLE
//   // ═══════════════════════════════════════════════════════════════════════════
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
//     fetchTab(activeTab, 1, DEFAULT_LIMIT);
//     fetchCancellationData();
//   }, []);

//   useEffect(() => {
//     if (!canViewAnyTab) return;
//     const visible = [0,1,2,3,4,5,6].filter(i => canViewBookingInTab[i]);
//     if (visible.length > 0 && !visible.includes(activeTab)) setActiveTab(visible[0]);
//   }, [canViewAnyTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // REFRESH after mutations
//   // ═══════════════════════════════════════════════════════════════════════════
//   const refreshCurrentTab = useCallback(() => {
//     if (activeTab < TAB.CANCELLED) {
//       const limit = tabData[activeTab].limit || DEFAULT_LIMIT;
//       setTab(activeTab, { ...emptyTab(), limit });
//       setLocalSearch('');
//       if (searchInputRef.current) searchInputRef.current.value = '';
//       fetchTab(activeTab, 1, limit, '');
//     } else {
//       fetchCancellationData();
//     }
//   }, [activeTab, tabData, setTab, fetchTab, fetchCancellationData, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TAB CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleTabChange = useCallback((tab) => {
//     clearTimeout(searchTimer.current);
//     setActiveTab(tab);
//     setLocalSearch('');
//     if (searchInputRef.current) searchInputRef.current.value = '';

//     if (tab < TAB.CANCELLED) {
//       setTabData(prev => {
//         const td    = prev[tab];
//         const limit = td.limit || DEFAULT_LIMIT;
//         const resetTab = { ...td, search: '' };
//         setTimeout(() => fetchTab(tab, 1, limit, ''), 0);
//         return { ...prev, [tab]: resetTab };
//       });
//     }
//   }, [fetchTab, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handlePageChange = useCallback((tabIndex, newPage) => {
//     if (newPage < 1) return;
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (newPage > td.pages) return prev;

//       if (td._allDocs) {
//         const start = (newPage - 1) * td.limit;
//         const docs  = td._allDocs.slice(start, start + td.limit);
//         return { ...prev, [tabIndex]: { ...td, docs, currentPage: newPage } };
//       } else {
//         fetchTab(tabIndex, newPage, td.limit, td.search);
//         return prev;
//       }
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ROWS PER PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleLimitChange = useCallback((tabIndex, newLimit) => {
//     const limit = parseInt(newLimit, 10);
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (td._allDocs) {
//         const pages = Math.max(1, Math.ceil(td._allDocs.length / limit));
//         return { ...prev, [tabIndex]: { ...td, docs: td._allDocs.slice(0, limit), limit, currentPage: 1, pages } };
//       } else {
//         fetchTab(tabIndex, 1, limit, td.search);
//         return prev;
//       }
//     });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // SEARCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const activeTabRef = useRef(activeTab);
//   useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

//   const handleSearch = useCallback((value) => {
//     if (activeTabRef.current >= TAB.CANCELLED) {
//       setCancelledSearch(value);
//       setCancelledPendingPage(1);
//       setCancelledRejectedPage(1);
//       return;
//     }

//     setLocalSearch(value);

//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       const tab = activeTabRef.current;
//       setTabData(prev => {
//         const limit = prev[tab]?.limit || DEFAULT_LIMIT;
//         fetchTab(tab, 1, limit, value);
//         return prev;
//       });
//     }, 500);
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION CLIENT-SIDE FILTER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const getFilteredCancelled = useCallback((data) => {
//     if (!cancelledSearch) return data;
//     const t = cancelledSearch.toLowerCase();
//     return data.filter(c =>
//       (c.customer?.name || '').toLowerCase().includes(t)
//     );
//   }, [cancelledSearch]);

//   const getCancelledPage = useCallback((data, page) => {
//     const start = (page - 1) * cancelledLimit;
//     return data.slice(start, start + cancelledLimit);
//   }, [cancelledLimit]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGINATION RENDERERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderPagination = (tabIndex) => {
//     const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
//     if (!total) return null;

//     const start = (currentPage - 1) * limit + 1;
//     const end   = Math.min(currentPage * limit, total);

//     let sp = Math.max(1, currentPage - 2);
//     let ep = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3)         ep = Math.min(5, pages);
//     if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
//     const pageNums = [];
//     for (let i = sp; i <= ep; i++) pageNums.push(i);

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={limit} onChange={e => handleLimitChange(tabIndex, e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm" disabled={loading}>
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {sp > 1 && <><CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>{sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}</>}
//             {pageNums.map(p => <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(tabIndex, p)} disabled={loading}>{p}</CPaginationItem>)}
//             {ep < pages && <>{ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}<CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem></>}
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}><CIcon icon={cilChevronRight} /></CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   const renderCancelledPagination = (data, page, setPage) => {
//     const total = data.length;
//     if (total <= cancelledLimit) return null;
//     const pages = Math.ceil(total / cancelledLimit);
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={cancelledLimit} onChange={e => { setCancelledLimit(parseInt(e.target.value, 10)); setPage(1); }}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm">
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             Showing {(page - 1) * cancelledLimit + 1}–{Math.min(page * cancelledLimit, total)} of {total}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {Array.from({ length: pages }, (_, i) => i + 1).map(p =>
//               <CPaginationItem key={p} active={p === page} onClick={() => setPage(p)}>{p}</CPaginationItem>
//             )}
//             <CPaginationItem onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}><CIcon icon={cilChevronRight} /></CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ACTION HANDLERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleClick = (e, id) => { setAnchorEl(e.currentTarget); setMenuId(id); };
//   const handleClose = () => { setAnchorEl(null); setMenuId(null); };

//   const handleOpenRestoreModal = (bookingId, type) => {
//     if (type === 'rejected_discount' && !canRestoreFromRejectedDiscount) { showError('No permission to restore'); return; }
//     if (type === 'cancelled'         && !canRestoreFromRejectedCancelled) { showError('No permission to restore'); return; }
//     setSelectedRestoreBooking(bookingId); setRestoreType(type);
//     setRestoreReason(''); setRestoreNotes(''); setRestoreBookingModal(true); handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     const ok = restoreType === 'cancelled' ? canRestoreFromRejectedCancelled : canRestoreFromRejectedDiscount;
//     if (!ok || !selectedRestoreBooking) return;
//     try {
//       setRestoreLoading(true);
//       const url = restoreType === 'cancelled'
//         ? `/bookings/${selectedRestoreBooking}/restore`
//         : `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
//       await axiosInstance.put(url, { reason: restoreReason.trim() || undefined, notes: restoreNotes.trim() || undefined });
//       showSuccess('Booking restored successfully!');
//       setRestoreBookingModal(false); setSelectedRestoreBooking(null); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to restore booking'); }
//     finally { setRestoreLoading(false); }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!canViewAllBooking) { showError('No permission to view available documents'); return; }
//     try {
//       setLoadingTemplates(true); setSelectedBookingForDocs(bookingId);
//       const res = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(res.data.data); setAvailableDocsModal(true);
//       setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError('Failed to fetch available documents'); }
//     finally { setLoadingTemplates(false); }
//     handleClose();
//   };

//   const handleTemplateSelection = (id, canDownload) => {
//     if (!canDownload) return;
//     setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const handleSelectAllAvailable = () =>
//     setSelectedTemplateIds((availableTemplates?.available_templates?.templates || []).filter(t => t.can_download).map(t => t.template_id));

//   const handleSubmitTemplateSelection = async () => {
//     if (!canUpdateInApprovedTab) { showError('No permission to select templates'); return; }
//     if (!selectedBookingForDocs || !selectedTemplateIds.length) { showError('Please select at least one template'); return; }
//     try {
//       setSubmittingSelection(true);
//       await axiosInstance.post('/booking-templates/select', { bookingId: selectedBookingForDocs, templateIds: selectedTemplateIds, notes: templateNotes.trim() || undefined });
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false); setSelectedBookingForDocs(null);
//       setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError(err.response?.data?.message || 'Failed to select templates'); }
//     finally { setSubmittingSelection(false); }
//   };

//   const handleApproveCancellation = (c) => {
//     if (!canApproveCancellation) { showError('No permission to approve cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('APPROVE');
//     setEditedReason(c.cancellationRequest?.reason || '');
//     setCancellationCharges(c.cancellationRequest?.cancellationCharges || 0);
//     setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (c) => {
//     if (!canRejectCancellation) { showError('No permission to reject cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('REJECT');
//     setRejectionReason(''); setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleCancelActionSubmit = async () => {
//     if (!selectedCancellationForApproval) return;
//     try {
//       setCancelActionLoading(true);
//       if (cancelApprovalAction === 'APPROVE') {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, {
//           reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
//           editedReason, cancellationCharges, notes,
//         });
//         showSuccess('Cancellation approved!');
//       } else {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, { rejectionReason, notes });
//         showSuccess('Cancellation rejected!');
//       }
//       setCancelApprovalModal(false); setSelectedCancellationForApproval(null);
//       setEditedReason(''); setCancellationCharges(0); setNotes(''); setRejectionReason('');
//       fetchCancellationData();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process cancellation'); }
//     finally { setCancelActionLoading(false); }
//   };

//   const handleApproveChassis = (id) => {
//     if (!canApproveChassis) { showError('No permission to approve chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('APPROVE'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleRejectChassis = (id) => {
//     if (!canRejectChassis) { showError('No permission to reject chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('REJECT'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval || !approvalNote.trim()) { showError('Please enter approval/rejection note'); return; }
//     try {
//       setApprovalLoading(true);
//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, { action: approvalAction, approvalNote: approvalNote.trim() });
//       showSuccess(`Chassis ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'}!`);
//       setChassisApprovalModal(false); setSelectedBookingForApproval(null); setApprovalNote(''); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process chassis'); }
//     finally { setApprovalLoading(false); }
//   };

//   const handleViewBooking = async (id) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view booking'); return; }
//     try {
//       const res = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(res.data.data); setViewModalVisible(true); handleClose();
//     } catch (err) { showError('Failed to fetch booking details'); }
//   };

//   const handlePrint = (id) => {
//     if (!canPrintInTab[activeTab]) { showError('No permission to print in this tab'); return; }
//     setSelectedBookingForPrint(id); setPrintModalVisible(true); handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view KYC'); return; }
//     try {
//       setKycBookingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       const res = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       setKycData({ ...res.data.data, status: booking.documentStatus?.kyc?.status || 'PENDING', customerName: booking.customerDetails.name, address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}` });
//       setKycModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       setFinanceData({ status: booking.documentStatus?.financeLetter?.status || 'PENDING', customerName: booking.customerDetails.name, bookingId: booking._id });
//       setFinanceBookingId(bookingId); setFinanceModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//     finally { setActionLoadingId(null); }
//   };

//   const handleViewFinanceLetterReceipt = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const [bRes, dRes] = await Promise.all([
//         axiosInstance.get(`/bookings/${bookingId}`),
//         axiosInstance.get(`/disbursements/bookings/${bookingId}/disbursements`),
//       ]);
//       const bd  = bRes.data.data;
//       const dis = dRes.data.success && dRes.data.data.disbursements.length > 0
//         ? dRes.data.data.disbursements[0]?.disbursementAmount || 0 : 0;
//       const tab = window.open('', '_blank');
//       tab.document.write(generateFinanceLetterHTML(bd, dis));
//       tab.document.close();
//     } catch (err) { showError('Failed to fetch finance letter data'); }
//     finally { setActionLoadingId(null); handleClose(); }
//   };

//   const generateFinanceLetterHTML = (bd, disbursementAmount) => {
//     const today       = new Date().toLocaleDateString('en-GB');
//     const dealAmount  = bd?.discountedAmount || 0;
//     const gcAmount    = bd?.payment?.gcAmount || 0;
//     const exchAmt     = bd?.exchangeDetails?.price || 0;
//     const downPayment = (dealAmount + gcAmount) - disbursementAmount - exchAmt;
//     return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>FINANCER'S ASSURANCE LETTER</title><style>@page{size:A4;margin:20mm}body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.4;margin:0;padding:0;background:#f5f5f5}.page{width:210mm;min-height:297mm;margin:10mm auto;padding:15mm;background:white;box-shadow:0 0 10px rgba(0,0,0,.1);box-sizing:border-box}.details-table{width:100%;border-collapse:collapse;margin:20px 0}.details-table,.details-table td{border:1px solid black}.details-table td{padding:8px;vertical-align:top}.left-col{width:70%;font-weight:bold}.instruction-text{margin:15px 0;text-align:justify}.signature-box{width:25%;border-top:1px dashed black;margin-top:5px;margin-left:auto;padding:1px 0;text-align:right;color:#555;font-weight:bold}@media print{body{background:white}.page{box-shadow:none;margin:0;padding:0;width:100%}}</style></head><body><div class="page"><div style="text-align:right">Date: <strong>${today}</strong></div><div style="margin:15px 0">To,<br>The Director/Manager,<br>Gandhi Motors Pvt Ltd,<br>Nasik</div><div style="font-weight:bold;margin:15px 0">Sub:- Delivery Order &amp; Disbursement Assurance letter.</div><div style="margin:15px 0">Dear sir,</div><div>We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:</div><div style="margin:15px 0">Name : Mr./Mrs. : <strong>${bd?.customerDetails?.name||''}</strong></div><div style="margin:15px 0">Vehicle make &amp; model : <strong>${bd?.model?.model_name||bd?.model?.name||''}</strong> &nbsp;&nbsp; Booking Number: <strong>${bd?.bookingNumber||''}</strong></div><table class="details-table"><tr><td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td><td>${dealAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Disbursement Amount assured by finance company</td><td>${disbursementAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Net Down Payment to be taken from Customer</td><td>${downPayment.toLocaleString('en-IN')}</td></tr></table><div class="instruction-text">The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.</div><div class="instruction-text">This letter is non revokable &amp; we promise to pay you the above-mentioned loan amount within stipulated time.</div><div class="instruction-text">You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office &amp; give us the details of RTO registration along with the invoice, insurance &amp; Down payment receipt.</div><div class="instruction-text">Please do the needful.</div><div style="margin-top:40px"><div>For &amp; on behalf of</div><div>Financer's / Bank</div><div>Name: <strong>${bd?.payment?.financer?.name||''}</strong></div><div style="margin-top:15px">Employee Name: ________________________________</div><div style="margin-top:15px">Mobile No: ________________________________</div></div><div class="signature-box"><strong>Authorised Signature</strong></div></div></body></html>`;
//   };

//   const handleAllocateChassis = (id) => {
//     if (!canAllocateChassisInApprovedTab) { showError('No permission to allocate chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(false); setShowChassisModal(true); handleClose();
//   };

//   const handleUpdateChassis = (id) => {
//     if (!canUpdateChassisInAllocatedTab) { showError('No permission to update chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(true); setShowChassisModal(true); handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     const ok = isUpdateChassis ? canUpdateChassisInAllocatedTab : canAllocateChassisInApprovedTab;
//     if (!ok) { showError('No permission to save chassis number'); return; }
//     try {
//       setChassisLoading(true); setChassisError('');
//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       if (payload.reason) url += `?reason=${encodeURIComponent(payload.reason)}`;
//       const fd = new FormData();
//       fd.append('chassisNumber', payload.chassisNumber);
//       fd.append('is_deviation', payload.is_deviation);
//       if (payload.note) fd.append('note', payload.note);
//       if (payload.claimDetails) {
//         fd.append('hasClaim', 'true');
//         fd.append('priceClaim', payload.claimDetails.price);
//         fd.append('description', payload.claimDetails.description);
//         payload.claimDetails.documents.forEach(f => fd.append('documents', f));
//       } else { fd.append('hasClaim', 'false'); }
//       const res = await axiosInstance.put(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//       showSuccess(res.data.message);
//       setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError('');
//       refreshCurrentTab();
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || 'Failed to save chassis number';
//       setChassisError(msg); showError(msg);
//     } finally { setChassisLoading(false); }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     if (!canViewPendingApprovalsTab) { showError('No permission to view alteration requests'); return; }
//     setSelectedUpdate(booking); setDetailsModalOpen(true); handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!canApproveUpdate) { showError('No permission to approve updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/approve-update`, payload); showSuccess('Update approved'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!canRejectUpdate) { showError('No permission to reject updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/reject-update`, payload); showSuccess('Update rejected'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleDelete = async (id) => {
//     const ok = activeTab === 0 ? canDeleteBookingInPendingApprovals : canDeleteBookingInRejectedDiscount;
//     if (!ok) { showError('No permission to delete bookings'); return; }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try { await axiosInstance.delete(`/bookings/${id}`); showSuccess('Booking deleted'); refreshCurrentTab(); }
//       catch (err) { showError(err.response?.data?.message || 'Failed to delete booking'); }
//     }
//   };

//   const getAuthToken = () => token || localStorage.getItem('token') || localStorage.getItem('authToken');

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
//       const authToken = getAuthToken();
//       if (!authToken) { showError('Please login'); setExportLoading(false); setShowExportModal(false); return; }
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420';
//       const { startDate, endDate } = exportDateRange;
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a'); a.href = url;
//           a.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(a); a.click(); document.body.removeChild(a);
//           window.URL.revokeObjectURL(url);
//           showSuccess('Excel downloaded!'); setShowExportModal(false);
//         } else { showError(xhr.status === 401 ? 'Please login' : 'Download failed'); }
//         setExportLoading(false);
//       };
//       xhr.onerror = () => { showError('Network error'); setExportLoading(false); };
//       xhr.send();
//     } catch (err) { showError('Export failed'); setExportLoading(false); }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // SCRATCH CARD HANDLERS (UPLOAD)
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleOpenScratchCardModal = async (booking) => {
//     // Role-based permission check
//     if (!canUploadScratchCard) {
//       showError('You do not have permission to upload scratch cards');
//       return;
//     }

//     setSelectedBookingForScratch(booking);
//     setScratchCardForm({
//       scheme: '',
//       scratch_card_amount: '',
//       scratch_card_document: null,
//       scheme_document: null,
//     });
//     setScratchCardErrors({});
//     setScratchCardModal(true);
//     handleClose();

//     try {
//       setSchemesLoading(true);
//       const res = await axiosInstance.get('/schemes');
//       setSchemes(res.data.data.schemes || []);
//     } catch (err) {
//       showError('Failed to fetch schemes');
//       setSchemes([]);
//     } finally {
//       setSchemesLoading(false);
//     }
//   };

//   const handleScratchCardFormChange = (field, value) => {
//     setScratchCardForm(prev => ({ ...prev, [field]: value }));
//     if (scratchCardErrors[field]) {
//       setScratchCardErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const handleScratchCardFileChange = (field, file) => {
//     setScratchCardForm(prev => ({ ...prev, [field]: file }));
//     if (scratchCardErrors[field]) {
//       setScratchCardErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateScratchCardForm = () => {
//     const errors = {};
//     if (!scratchCardForm.scheme) errors.scheme = 'Scheme is required';
//     if (!scratchCardForm.scratch_card_amount) {
//       errors.scratch_card_amount = 'Scratch card amount is required';
//     } else if (isNaN(scratchCardForm.scratch_card_amount) || Number(scratchCardForm.scratch_card_amount) < 0) {
//       errors.scratch_card_amount = 'Enter a valid amount';
//     }
//     if (!scratchCardForm.scratch_card_document) {
//       errors.scratch_card_document = 'Scratch card document is required';
//     }
//     if (!scratchCardForm.scheme_document) {
//       errors.scheme_document = 'Scheme document is required';
//     }
//     setScratchCardErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmitScratchCard = async () => {
//     if (!validateScratchCardForm()) return;

//     try {
//       setScratchCardLoading(true);

//       const formData = new FormData();
//       formData.append('booking', selectedBookingForScratch._id || selectedBookingForScratch.id);
//       formData.append('scheme', scratchCardForm.scheme);
//       formData.append('scratch_card_amount', scratchCardForm.scratch_card_amount);
//       formData.append('scratch_card_document', scratchCardForm.scratch_card_document);
//       formData.append('scheme_document', scratchCardForm.scheme_document);

//       await axiosInstance.post('/scratch-cards', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       showSuccess('Scratch card uploaded successfully!');
//       setScratchCardModal(false);
//       setSelectedBookingForScratch(null);
//       refreshCurrentTab();
//     } catch (err) {
//       showError(err.response?.data?.message || 'Failed to upload scratch card');
//     } finally {
//       setScratchCardLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // SCRATCH CARD HANDLERS (VIEW)
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleViewScratchDocs = async (booking) => {
//     setSelectedBookingForViewScratch(booking);
//     setScratchDocsData(null);
//     setViewScratchModal(true);
//     handleClose();

//     try {
//       setScratchDocsLoading(true);
//       const bookingId = booking._id || booking.id;
//       const res = await axiosInstance.get(`/scratch-cards/booking/${bookingId}`);
//       setScratchDocsData(res.data.data);
//     } catch (err) {
//       showError(err.response?.data?.message || 'Failed to fetch scratch card documents');
//       setScratchDocsData(null);
//     } finally {
//       setScratchDocsLoading(false);
//     }
//   };

//   const getScratchDocUrl = (path) => {
//     if (!path) return '';
//     const idx = path.indexOf('/uploads');
//     const rel = idx !== -1 ? path.slice(idx) : path;
//     return `https://gmplmis.com/dealership-api/api/v1${rel}`;
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // DOWNLOAD SCHEME FORM (as PDF via html2pdf.js — no print header/footer)
//   // ═══════════════════════════════════════════════════════════════════════════

//   // Lazily loads html2pdf.js from CDN once, caches on window.html2pdf
//   const loadHtml2Pdf = () => {
//     return new Promise((resolve, reject) => {
//       if (window.html2pdf) {
//         resolve(window.html2pdf);
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
//       script.onload = () => resolve(window.html2pdf);
//       script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
//       document.body.appendChild(script);
//     });
//   };

//   const handleDownloadSchemeForm = async (booking) => {
//     if (!booking) return;
//     if (booking?.scheme?.toLowerCase() !== 'yes') return;

//     const customerName = booking?.customerDetails?.name || '';
//     const address = [
//       booking?.customerDetails?.address,
//       booking?.customerDetails?.taluka,
//       booking?.customerDetails?.district,
//       booking?.customerDetails?.pincode,
//     ].filter(Boolean).join(', ');

//     const contactNumber = booking?.customerDetails?.mobile1 || booking?.customerDetails?.mobile || '';
//     const vehicleModel = booking?.model?.model_name || booking?.model?.name || '';
//     const bookingNumber = booking?.bookingNumber || '';
//     const financierName = booking?.payment?.financer?.name || '';
//     const today = new Date().toLocaleDateString('en-GB');

//     // Two explicit A4 pages. min-height 290mm (< A4's 297mm) prevents a
//     // phantom third page from being emitted when html2canvas rounds up.
//     const innerHtml = `
//       <div id="scheme-form-page">
//         <!-- ================= PAGE 1 ================= -->
//         <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto 0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;">

//           <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;">
//             <p style="font-size:20px;font-weight:bold;letter-spacing:0.5px;margin:0;">GANDHI MOTORS PVT. LTD.</p>
//             <p style="font-size:16px;font-weight:bold;margin:6px 0 2px;text-decoration:underline;">"SCRATCH &amp; WIN" OFFER</p>
//             <p style="font-size:13px;font-style:italic;margin:0 0 4px;">Customer Acknowledgment &amp; Consent Form</p>
//           </div>

//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Customer Name:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Address:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${address}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Contact Number:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${contactNumber}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Vehicle Model / Variant:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${vehicleModel}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Booking / Invoice No.:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${bookingNumber}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Financier (Bank / NBFC) Name:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${financierName}</span>
//           </div>
//           <div style="display:flex;align-items:flex-end;margin-bottom:12px;">
//             <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span>
//             <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
//           </div>

//           <div style="font-weight:bold;font-size:14px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Terms &amp; Conditions of the Offer</div>
//           <ol style="padding-left:20px;margin:0 0 10px;">
//             <li style="margin-bottom:6px;text-align:justify;">This "Scratch &amp; Win" offer ("the Offer") is available only to customers who purchase a vehicle through select bank/NBFC finance (loan) from GANDHI MOTORS PVT. LTD. ("the Dealership").</li>
//             <li style="margin-bottom:6px;text-align:justify;">Participation in the Offer is entirely free. No separate fee, charge, deposit, or additional amount is payable by the customer to become eligible for, or to participate in, the Offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The price of the vehicle is identical for every customer, whether the vehicle is purchased on cash or on finance. The vehicle's price has not been increased or altered in any way on account of the Offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The customer will select one scratch card from multiple cards placed in a pot/box at the time of purchase. Every card carries a guaranteed discount of not less than ₹3,000 and not more than ₹10,000. No card carries a nil or "try again" outcome — every participating customer receives a discount within this range.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The discount amount is determined entirely by random selection at the time the card is drawn, and bears no relation to the vehicle model, variant, colour, accessories, or any other factor.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The discount amount shown on the scratch card will be applied as a discount in the customer's final deal form / tax invoice for the vehicle.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The Offer is limited to one scratch card per customer, per vehicle booking.</li>
//             <li style="margin-bottom:6px;text-align:justify;">Once revealed, the discount amount is final. It is not transferable, not exchangeable for cash or any other benefit, and cannot be combined with any other offer unless the Dealership states otherwise in writing.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The Offer is valid from 16/09/2026 to 30/11/2026, or until withdrawn earlier at the Dealership's discretion.</li>
//             <li style="margin-bottom:6px;text-align:justify;">This is a promotional discount scheme offered voluntarily by the Dealership, funded entirely from its own margin, to make vehicle finance more attractive to customers. As no payment, fee, or other consideration is charged to the customer for the chance to receive a discount, the Offer does not constitute a lottery, prize competition, or game of chance for consideration.</li>
//           </ol>
//         </div>

//         <!-- ================= PAGE 2 ================= -->
//         <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;page-break-before:always;break-before:page;">

//           <ol start="11" style="padding-left:20px;margin:0 0 10px;">
//             <li style="margin-bottom:6px;text-align:justify;">For any queries or grievances relating to the Offer, customers may write to us contact us at gandhitvsnashik@gmail.com.</li>
//             <li style="margin-bottom:6px;text-align:justify;">The Dealership may amend these terms at any time. Any such change will apply prospectively only and will not affect a discount already confirmed to a customer.</li>
//             <li style="margin-bottom:6px;text-align:justify;">Nothing in these terms, or in the acknowledgment below, limits or affects any right available to the customer under the Consumer Protection Act, 2019, or any other applicable law.</li>
//           </ol>

//           <div style="font-weight:bold;font-size:13px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Customer Acknowledgment &amp; Declaration</div>
//           <p style="margin-bottom:8px;">I, the undersigned, confirm and declare that:</p>
//           <ul style="list-style:none;padding-left:0;margin:0 0 12px;">
//             <li style="margin-bottom:6px;text-align:justify;"><b>(a)</b> I have been shown and explained the above Terms &amp; Conditions, in a language I understand, before participating in the Offer &amp; I have voluntarily participated in the Dealer Scratch &amp; Win offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(b)</b> I have not paid, and have not been asked to pay, any amount over and above the standard price of the vehicle in order to participate in the Offer.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(c)</b> My decision to purchase this vehicle on finance was made independently, and my participation in the Offer is entirely voluntary.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(d)</b> I selected my scratch card of my own free will, and understand that the discount amount shown on it — between ₹3,000 and ₹10,000 — was determined randomly.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(e)</b> The discount amount revealed on my card is ₹_______________________, which I accept as final and understand will be deducted from the deal amount / price in my vehicle's tax invoice.</li>
//             <li style="margin-bottom:6px;text-align:justify;"><b>(f)</b> I understand and acknowledge that, as no fee or other consideration was charged to me for the Offer, it is a promotional discount and not a lottery, prize competition, or game of chance requiring payment.</li>
//           </ul>

//           <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
//             <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;"></div>
//             <div style="font-size:11.5px;font-weight:bold;">Signature of Customer</div>
//             <div style="display:flex;align-items:flex-end;margin-top:10px;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Full Name (Block Letters):</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span>
//             </div>
//             <div style="display:flex;align-items:flex-end;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Date:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
//               <span style="font-weight:bold;white-space:nowrap;margin:0 6px 0 10px;min-width:60px;">Place:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">Sangamner</span>
//             </div>
//           </div>

//           <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
//             <p style="font-weight:bold;margin-bottom:8px;">For GANDHI MOTORS PVT. LTD.</p>
//             <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;width:60%;"></div>
//             <div style="font-size:11.5px;font-weight:bold;">Signature of Dealership Manager / Representative</div>
//             <div style="display:flex;align-items:flex-end;margin-top:10px;width:60%;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Name &amp; Designation:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;"></span>
//             </div>
//             <div style="display:flex;align-items:flex-end;width:60%;">
//               <span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span>
//               <span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;

//     // Isolated iframe, off-screen horizontally only
//     const iframe = document.createElement('iframe');
//     iframe.style.position = 'fixed';
//     iframe.style.left = '-10000px';
//     iframe.style.top = '0';
//     iframe.style.border = '0';
//     iframe.style.width = '900px';
//     iframe.style.height = '1400px';
//     iframe.style.visibility = 'hidden';
//     document.body.appendChild(iframe);

//     const frameDoc = iframe.contentDocument;
//     frameDoc.open();
//     frameDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;">${innerHtml}</body></html>`);
//     frameDoc.close();

//     await new Promise((resolve) => setTimeout(resolve, 100));

//     const pageEl = frameDoc.getElementById('scheme-form-page');

//     setIsGeneratingSchemeForm(true);
//     try {
//       const html2pdf = await loadHtml2Pdf();
//       await html2pdf()
//         .set({
//           margin: 0,
//           filename: `Scratch_Win_Customer_Acknowledgment_${bookingNumber || 'form'}.pdf`,
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: {
//             scale: 2,
//             useCORS: true,
//             backgroundColor: '#ffffff',
//             scrollX: 0,
//             scrollY: 0,
//           },
//           jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//           pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page + .pdf-page', avoid: '.pdf-page' },
//         })
//         .from(pageEl)
//         .save();
//       showSuccess('Scheme form PDF downloaded!');
//     } catch (err) {
//       console.error('Scheme form PDF generation failed:', err);
//       showError('Could not generate the scheme form PDF. Please try again.');
//     } finally {
//       document.body.removeChild(iframe);
//       setIsGeneratingSchemeForm(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TABLE RENDERER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderBookingTable = (tabIndex) => {
//     if (!canViewBookingInTab[tabIndex]) {
//       const names = ['PENDING APPROVALS','APPROVED','PENDING ALLOCATED','ALLOCATED','REJECTED DISCOUNT','CANCELLED BOOKING','REJECTED CANCELLED BOOKING'];
//       return <CAlert color="warning">You do not have permission to view the {names[tabIndex]} tab.</CAlert>;
//     }

//     const canCreate    = canPrintInTab[tabIndex];
//     const canUploadKyc = () => [canUploadKycInPendingApprovals, canUploadKycInApprovedTab, false, canUploadKycInAllocatedTab, canUploadKycInRejectedDiscount][tabIndex] ?? false;
//     const canUploadFin = () => [canUploadFinanceInPendingApprovals, canUploadFinanceInApprovedTab, false, canUploadFinanceInAllocatedTab, canUploadFinanceInRejectedDiscount][tabIndex] ?? false;
//     const canEditThis  = () => tabIndex === 0 ? canEditInPendingApprovalsTab : tabIndex === 4 ? canEditInRejectedDiscountTab : false;
//     const getDocumentUrl = path => `https://gmplmis.com/dealership-api/api/v1/uploads${path}`;

//     // ── Cancellation tabs ────────────────────────────────────────────────────
//     if (tabIndex === TAB.CANCELLED || tabIndex === TAB.REJECTED_CANCELLED) {
//       const raw      = tabIndex === TAB.CANCELLED ? cancelledPendingData : cancelledRejectedData;
//       const filtered = getFilteredCancelled(raw);
//       const page     = tabIndex === TAB.CANCELLED ? cancelledPendingPage  : cancelledRejectedPage;
//       const setPage  = tabIndex === TAB.CANCELLED ? setCancelledPendingPage : setCancelledRejectedPage;
//       const records  = getCancelledPage(filtered, page);

//       return (
//         <>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Contact</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell>Requested At</CTableHeaderCell>
//                   <CTableHeaderCell>Requested By</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell>Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Refund Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {tabIndex === TAB.REJECTED_CANCELLED && <CTableHeaderCell>Rejection Reason</CTableHeaderCell>}
//                   <CTableHeaderCell>Options</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {records.length === 0 ? (
//                   <CTableRow><CTableDataCell colSpan={13} className="text-center text-danger">No cancellation requests available</CTableDataCell></CTableRow>
//                 ) : records.map((c, i) => (
//                   <CTableRow key={c._id || i}>
//                     <CTableDataCell>{(page - 1) * cancelledLimit + i + 1}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.name  || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.phone || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.bookingDate ? new Date(c.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedAt ? new Date(c.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.cancellationCharges || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.received            || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.refundAmount        || 0}</CTableDataCell>
//                     <CTableDataCell><span className={`status-badge ${c.cancellationRequest?.status?.toLowerCase() || ''}`}>{c.cancellationRequest?.status || 'N/A'}</span></CTableDataCell>
//                     {tabIndex === TAB.REJECTED_CANCELLED && <CTableDataCell>{c.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>
//                       {tabIndex === TAB.CANCELLED && (
//                         <div className="d-flex gap-1">
//                           <CButton size="sm" color="success" onClick={() => handleApproveCancellation(c)} disabled={!canApproveCancellation}><CIcon icon={cilCheck} /> Approve</CButton>
//                           <CButton size="sm" color="danger"  onClick={() => handleRejectCancellation(c)}  disabled={!canRejectCancellation}><CIcon icon={cilX} /> Reject</CButton>
//                         </div>
//                       )}
//                       {tabIndex === TAB.REJECTED_CANCELLED && (
//                         <CButton size="sm" color="primary" onClick={() => handleOpenRestoreModal(c._id, 'cancelled')} disabled={!canRestoreFromRejectedCancelled}>Back to Normal</CButton>
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </div>
//           {renderCancelledPagination(filtered, page, setPage)}
//         </>
//       );
//     }

//     // ── Booking tabs 0–4 ─────────────────────────────────────────────────────
//     const td      = tabData[tabIndex];
//     const records = td.docs;

//     return (
//       <>
//         {td.loading && (
//           <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//             <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//           </div>
//         )}
//         <div className="responsive-table-wrapper" style={{ opacity: td.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//           <CTable striped bordered hover className="responsive-table">
//             <CTableHead>
//               <CTableRow>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Sr.no</CTableHeaderCell>}
//                 <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Type</CTableHeaderCell>}
//                 <CTableHeaderCell>Color</CTableHeaderCell>
//                 <CTableHeaderCell>Fullname</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Contact1</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Finance Letter</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Upload Finance</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Upload KYC</CTableHeaderCell>}
//                 <CTableHeaderCell>Status</CTableHeaderCell>
//                 {tabIndex === 0 && <CTableHeaderCell>Altration Request</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Is Claim</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Claim Documents</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Scheme</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Print</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Note</CTableHeaderCell>}
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.length === 0 && !td.loading ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={21} className="text-center text-danger">
//                     {td.search ? `No results found for "${td.search}"` : 'No booking available'}
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : records.map((booking, index) => {
//                 const globalIndex = (td.currentPage - 1) * td.limit + index + 1;
//                 const bid = booking._id || booking.id;
//                 return (
//                   <CTableRow key={bid}>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
//                     <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && canCreate && (
//                           <CButton size="sm" className="view-button" onClick={() => handlePrint(bid)}>Print</CButton>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && (
//                           <>
//                             {canUploadFin() && ['NOT_UPLOADED','REJECTED'].includes(booking.documentStatus?.financeLetter?.status) ? (
//                               <Link to={`/upload-finance/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//                                 <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></CButton>
//                               </Link>
//                             ) : null}
//                             {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                               <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.financeLetter?.status || ''}</span>
//                             )}
//                           </>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {(booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' || booking.documentStatus?.kyc?.status === 'INCOMPLETE') ? (
//                           <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//                             <CButton
//                               size="sm"
//                               className="upload-kyc-btn icon-only"
//                               style={{
//                                 backgroundColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//                                 borderColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//                                 color: 'white'
//                               }}
//                             >
//                               <CIcon icon={cilCloudUpload} />
//                             </CButton>
//                           </Link>
//                         ) : (
//                           <div className="d-flex align-items-center">
//                             <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.kyc?.status || ''}</span>
//                             {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//                               <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }} className="ms-2">
//                                 <button className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></button>
//                               </Link>
//                             )}
//                           </div>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     <CTableDataCell>
//                       <span className="status-badge" style={{
//                         backgroundColor:
//                           booking.status === 'FREEZZED'                              ? '#ffc107' :
//                           booking.status === 'PENDING_APPROVAL'                      ? '#0d6efd' :
//                           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'  ? '#fd7e14' :
//                           booking.status === 'APPROVED'                              ? '#198754' :
//                           booking.status === 'REJECTED'                              ? '#dc3545' :
//                           booking.status === 'ALLOCATED'                             ? '#6f42c1' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
//                         fontWeight: '500', display: 'inline-block',
//                       }}>
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
//                         {booking.claimDetails?.hasClaim
//                           ? <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                           : <CIcon icon={cilXCircle}    className="status-icon inactive-icon" />}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                     {tabIndex === 3 && (
//                       <CTableDataCell>
//                         {booking.claimDetails?.hasClaim && booking.claimDetails?.documents?.length > 0 ? (
//                           <CDropdown>
//                             <CDropdownToggle size="sm" color="info" variant="outline">{booking.claimDetails.documents.length} Doc{booking.claimDetails.documents.length > 1 ? 's' : ''}</CDropdownToggle>
//                             <CDropdownMenu>
//                               {booking.claimDetails.documents.map((doc, di) => (
//                                 <CDropdownItem key={di} onClick={() => window.open(getDocumentUrl(doc.path), '_blank')}>
//                                   <CIcon icon={cilDescription} className="me-2" />
//                                   <strong>{doc.originalName || `Document ${di + 1}`}</strong>
//                                   <small className="ms-2">{(doc.size / 1024).toFixed(2)} KB</small>
//                                 </CDropdownItem>
//                               ))}
//                             </CDropdownMenu>
//                           </CDropdown>
//                         ) : booking.claimDetails?.hasClaim
//                           ? <span className="text-muted">No documents</span>
//                           : <span className="text-muted">-</span>}
//                       </CTableDataCell>
//                     )}

//                     {/* ── Scheme column (Allocated tab only) ── */}
//                     {tabIndex === 3 && (
//                       <CTableDataCell>
//                         {booking.scheme === 'yes' ? (
//                           <CDropdown>
//                             <CDropdownToggle size="sm" color="success" variant="outline">
//                               Scheme
//                             </CDropdownToggle>
//                             <CDropdownMenu>
//                               {/* Upload Scratch Card — always shown for MANAGER / GENERAL_MANAGER / ADMIN / SUPERADMIN */}
//                               {canUploadScratchCard && booking.status === 'ALLOCATED' && (
//                                 <CDropdownItem
//                                   onClick={() => handleOpenScratchCardModal(booking)}
//                                   style={{ color: 'black', cursor: 'pointer' }}
//                                 >
//                                   <CIcon icon={cilCloudUpload} className="me-2" /> Upload Scratch Card
//                                 </CDropdownItem>
//                               )}

//                               {/* View Scratch Docs */}
//                               {canViewBookingInTab[3] && booking.status === 'ALLOCATED' && (
//                                 <CDropdownItem
//                                   onClick={() => handleViewScratchDocs(booking)}
//                                   style={{ color: 'black', cursor: 'pointer' }}
//                                 >
//                                   <CIcon icon={cilFile} className="me-2" /> View Scratch Docs
//                                 </CDropdownItem>
//                               )}

//                               {/* Download Scheme Form */}
//                               <CDropdownItem
//                                 onClick={() => handleDownloadSchemeForm(booking)}
//                                 disabled={isGeneratingSchemeForm}
//                                 style={{
//                                   color: 'black',
//                                   cursor: isGeneratingSchemeForm ? 'not-allowed' : 'pointer',
//                                   opacity: isGeneratingSchemeForm ? 0.6 : 1,
//                                 }}
//                               >
//                                 {isGeneratingSchemeForm ? (
//                                   <>
//                                     <CSpinner size="sm" className="me-2" /> Preparing PDF…
//                                   </>
//                                 ) : (
//                                   <>
//                                     <CIcon icon={cilDescription} className="me-2" /> Download Scheme Form
//                                   </>
//                                 )}
//                               </CDropdownItem>
//                             </CDropdownMenu>
//                           </CDropdown>
//                         ) : (
//                           <span className="text-muted">-</span>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.formPath && (
//                           user?.is_sales_executive && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : canCreate ? (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilPrint} /></CButton>
//                             </a>
//                           ) : null
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}

//                     <CTableDataCell>
//                       <CButton size="sm" className="option-button btn-sm" onClick={e => handleClick(e, bid)}>
//                         <CIcon icon={cilSettings} /> Options
//                       </CButton>
//                       <Menu id={`action-menu-${bid}`} anchorEl={anchorEl} open={menuId === bid} onClose={handleClose}>
//                         {canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewBooking(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Booking</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.updateRequestStatus === 'PENDING' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Altration Req</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex === 4 && canRestoreFromRejectedDiscount && (
//                           <MenuItem onClick={() => handleOpenRestoreModal(bid, 'rejected_discount')} style={{ color: 'black' }}><CIcon icon={cilCheck} className="me-2" /> Back to Normal</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.payment?.type === 'FINANCE' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewFinanceLetterReceipt(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilDescription} className="me-2" /> View Finance Letter Receipt</MenuItem>
//                         )}
//                         {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter</MenuItem>
//                         )}
//                         {canViewBookingInTab[tabIndex] && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewKYC(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View KYC</MenuItem>
//                         )}
//                         {tabIndex === 1 && canAllocateChassisInApprovedTab && booking.status === 'APPROVED' && (booking.payment?.type === 'CASH' || (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status === 'APPROVED')) && (
//                           <MenuItem onClick={() => handleAllocateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Allocate Chassis</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateChassisInAllocatedTab && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                           <MenuItem onClick={() => handleUpdateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Change Vehicle</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
//                           <>
//                             {canApproveChassis && <MenuItem onClick={() => handleApproveChassis(bid)} style={{ color: 'green' }}><CIcon icon={cilCheck} className="me-2" /> Approve Chassis</MenuItem>}
//                             {canRejectChassis  && <MenuItem onClick={() => handleRejectChassis(bid)}  style={{ color: 'red'   }}><CIcon icon={cilX}     className="me-2" /> Reject Chassis</MenuItem>}
//                           </>
//                         )}
//                         {tabIndex === 1 && booking.status === 'APPROVED' && canViewBookingInTab[1] && (
//                           <MenuItem onClick={() => handleOpenAvailableDocs(bid)} style={{ color: 'black' }}><CIcon icon={cilFile} className="me-2" /> Available Documents</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.status === 'FREEZZED' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => window.location.href = '/#/self-insurance'} style={{ color: 'black' }}><CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance</MenuItem>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   </CTableRow>
//                 );
//               })}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination(tabIndex)}
//       </>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LOADING / PERMISSION GUARDS
//   // ═══════════════════════════════════════════════════════════════════════════
//   if (!canViewAnyTab) {
//     return <div className="alert alert-danger m-3">You do not have permission to view any tabs in All Booking.</div>;
//   }

//   const currentSearch = activeTab >= TAB.CANCELLED ? cancelledSearch : localSearch;

//   // ═══════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════════════════
//   return (
//     <div>
//       <div className="title">Booking List</div>
//       {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1"><CIcon icon={cilPlus} className="icon" /> New Booking</CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           {/* ── Tab nav ── */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {[
//               [TAB.PENDING,            'Pending Approvals',  canViewPendingApprovalsTab],
//               [TAB.APPROVED,           'Approved',           canViewApprovedTab],
//               [TAB.PENDING_ALLOCATED,  'Pending Allocated',  canViewPendingAllocatedTab],
//               [TAB.ALLOCATED,          'Allocated',          canViewAllocatedTab],
//               [TAB.REJECTED,           'Rejected Discount',  canViewRejectedDiscountTab],
//               [TAB.CANCELLED,          'Cancelled Booking',  canViewCancelledBookingTab],
//               [TAB.REJECTED_CANCELLED, 'Rejected Cancelled', canViewRejectedCancelledBookingTab],
//             ].map(([idx, label, perm]) => perm && (
//               <CNavItem key={idx}>
//                 <CNavLink
//                   active={activeTab === idx}
//                   onClick={() => handleTabChange(idx)}
//                   style={{ cursor: 'pointer', borderTop: activeTab === idx ? '4px solid #2759a2' : '3px solid transparent', borderBottom: 'none', color: 'black' }}
//                 >
//                   {label}
//                 </CNavLink>
//               </CNavItem>
//             ))}
//           </CNav>

//           {/* ── Search bar ── */}
//           <div className="d-flex justify-content-end mb-3">
//             <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//             <input
//               ref={searchInputRef}
//               type="text"
//               defaultValue=""
//               style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
//               className="d-inline-block square-search"
//               onChange={e => handleSearch(e.target.value)}
//               placeholder="Search by Booking ID or Customer Name..."
//               autoComplete="off"
//             />
//           </div>

//           {/* ── Tab content ── */}
//           <CTabContent>
//             {[TAB.PENDING, TAB.APPROVED, TAB.PENDING_ALLOCATED, TAB.ALLOCATED, TAB.REJECTED].map(idx =>
//               canViewBookingInTab[idx] && (
//                 <CTabPane key={idx} visible={activeTab === idx}>
//                   {activeTab === idx && renderBookingTable(idx)}
//                 </CTabPane>
//               )
//             )}
//             {canViewCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.CANCELLED}>
//                 {activeTab === TAB.CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//             {canViewRejectedCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.REJECTED_CANCELLED}>
//                 {activeTab === TAB.REJECTED_CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.REJECTED_CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* ═══ MODALS ═══ */}

//       {/* Export */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Export Excel Report</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Start Date:</CFormLabel><CFormInput type="date" value={exportDateRange.startDate} onChange={e => setExportDateRange(p => ({ ...p, startDate: e.target.value }))} /></div>
//           <div className="mb-3"><CFormLabel>End Date:</CFormLabel><CFormInput type="date" value={exportDateRange.endDate} onChange={e => setExportDateRange(p => ({ ...p, endDate: e.target.value }))} min={exportDateRange.startDate} /></div>
//           <CAlert color="info"><small>This will export the branch sales report for the selected date range.</small></CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleExportConfirm} disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}>
//             {exportLoading ? <><CSpinner size="sm" className="me-2" />Exporting…</> : 'Export Excel'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Restore */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader><CModalTitle>Restore Booking to Normal</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Reason:</CFormLabel><CFormTextarea value={restoreReason} onChange={e => setRestoreReason(e.target.value)} rows={2} placeholder="Enter reason" /></div>
//           <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={restoreNotes} onChange={e => setRestoreNotes(e.target.value)} rows={2} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleRestoreBooking} disabled={restoreLoading}>
//             {restoreLoading ? <><CSpinner size="sm" className="me-2" />Processing…</> : 'Restore Booking'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Available Docs */}
//       <CModal visible={availableDocsModal} onClose={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }} size="lg">
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Available Documents - {availableTemplates?.booking_number || ''}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5"><CSpinner color="primary" /><p className="mt-3">Loading…</p></div>
//           ) : availableTemplates ? (
//             <div>
//               <h6>Customer: {availableTemplates.customer_name}</h6>
//               <div className="alert alert-info mb-3"><small><strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} available.</small></div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0">Templates ({availableTemplates.available_templates.count})</h6>
//                 <div className="d-flex gap-2">
//                   <CButton size="sm" color="primary" variant="outline" onClick={handleSelectAllAvailable}>Select All</CButton>
//                   <CButton size="sm" color="secondary" variant="outline" onClick={() => setSelectedTemplateIds([])}>Clear All</CButton>
//                 </div>
//               </div>
//               <div className="border rounded p-3">
//                 {(availableTemplates.available_templates.templates || []).map(t => (
//                   <div key={t.template_id} className="mb-3">
//                     <div className="form-check">
//                       <input className="form-check-input" type="checkbox" id={`tpl-${t.template_id}`} checked={selectedTemplateIds.includes(t.template_id)} onChange={() => handleTemplateSelection(t.template_id, t.can_download)} disabled={!t.can_download} />
//                       <label className="form-check-label d-flex justify-content-between align-items-center w-100" htmlFor={`tpl-${t.template_id}`} style={{ cursor: t.can_download ? 'pointer' : 'not-allowed', opacity: t.can_download ? 1 : 0.6 }}>
//                         <div><strong>{t.template_name}</strong><br /><small className="text-muted">{t.can_download ? 'Available' : 'Not available'}</small></div>
//                         {!t.can_download && <small className="text-danger"><CIcon icon={cilXCircle} className="me-1" />Disabled</small>}
//                       </label>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={templateNotes} onChange={e => setTemplateNotes(e.target.value)} rows={2} /></div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }}>Cancel</CButton>
//           <CButton color="primary" onClick={handleSubmitTemplateSelection} disabled={!selectedTemplateIds.length || submittingSelection}>
//             {submittingSelection ? <><CSpinner size="sm" className="me-2" />Processing…</> : `Select (${selectedTemplateIds.length}) Templates`}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation' : 'Reject Cancellation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3"><CFormLabel>Original Reason:</CFormLabel><CFormInput type="text" value={selectedCancellationForApproval?.cancellationRequest?.reason || ''} readOnly /></div>
//               <div className="mb-3"><CFormLabel>Edited Reason (Optional):</CFormLabel><CFormTextarea value={editedReason} onChange={e => setEditedReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Cancellation Charges:</CFormLabel><CFormInput type="number" value={cancellationCharges} onChange={e => setCancellationCharges(Number(e.target.value))} min="0" /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3"><CFormLabel>Rejection Reason:</CFormLabel><CFormTextarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleCancelActionSubmit} disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}>
//             {cancelActionLoading ? <CSpinner size="sm" /> : cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>{approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}</CFormLabel><CFormTextarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={3} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleChassisApprovalSubmit} disabled={approvalLoading}>
//             {approvalLoading ? <CSpinner size="sm" /> : approvalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Scratch Card Upload Modal */}
//       <CModal visible={scratchCardModal} onClose={() => setScratchCardModal(false)} size="lg">
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilCloudUpload} className="me-2" />
//             Upload Scratch Card
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>Booking ID:</CFormLabel>
//             <CFormInput
//               type="text"
//               value={selectedBookingForScratch?.bookingNumber || ''}
//               readOnly
//             />
//           </div>

//           <div className="mb-3">
//             <CFormLabel>
//               Scheme <span className="text-danger">*</span>
//             </CFormLabel>
//             <CFormSelect
//               value={scratchCardForm.scheme}
//               onChange={e => handleScratchCardFormChange('scheme', e.target.value)}
//               disabled={schemesLoading}
//             >
//               <option value="">{schemesLoading ? 'Loading schemes...' : 'Select Scheme'}</option>
//               {schemes.map(s => (
//                 <option key={s._id} value={s._id}>
//                   {s.scheme_name}
//                 </option>
//               ))}
//             </CFormSelect>
//             {scratchCardErrors.scheme && (
//               <small className="text-danger">{scratchCardErrors.scheme}</small>
//             )}
//           </div>

//           <div className="mb-3">
//             <CFormLabel>
//               Scratch Card Amount <span className="text-danger">*</span>
//             </CFormLabel>
//             <CFormInput
//               type="number"
//               min="0"
//               value={scratchCardForm.scratch_card_amount}
//               onChange={e => handleScratchCardFormChange('scratch_card_amount', e.target.value)}
//               placeholder="Enter amount"
//             />
//             {scratchCardErrors.scratch_card_amount && (
//               <small className="text-danger">{scratchCardErrors.scratch_card_amount}</small>
//             )}
//           </div>

//           <div className="mb-3">
//             <CFormLabel>
//               Scratch Card Document <span className="text-danger">*</span>
//             </CFormLabel>
//             <CFormInput
//               type="file"
//               accept="image/*,.pdf"
//               onChange={e => handleScratchCardFileChange('scratch_card_document', e.target.files[0])}
//             />
//             {scratchCardErrors.scratch_card_document && (
//               <small className="text-danger">{scratchCardErrors.scratch_card_document}</small>
//             )}
//           </div>

//           <div className="mb-3">
//             <CFormLabel>
//               Scheme Document <span className="text-danger">*</span>
//             </CFormLabel>
//             <CFormInput
//               type="file"
//               accept="image/*,.pdf"
//               onChange={e => handleScratchCardFileChange('scheme_document', e.target.files[0])}
//             />
//             {scratchCardErrors.scheme_document && (
//               <small className="text-danger">{scratchCardErrors.scheme_document}</small>
//             )}
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setScratchCardModal(false)}>
//             Cancel
//           </CButton>
//           <CButton
//             color="primary"
//             onClick={handleSubmitScratchCard}
//             disabled={scratchCardLoading || schemesLoading}
//           >
//             {scratchCardLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Uploading...
//               </>
//             ) : (
//               'Upload'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* View Scratch Docs Modal */}
//       <CModal
//         visible={viewScratchModal}
//         onClose={() => { setViewScratchModal(false); setSelectedBookingForViewScratch(null); setScratchDocsData(null); }}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             <CIcon icon={cilFile} className="me-2" />
//             Scratch Card Documents
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {scratchDocsLoading ? (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading scratch card documents…</p>
//             </div>
//           ) : !scratchDocsData ? (
//             <CAlert color="warning">No scratch card data available.</CAlert>
//           ) : (
//             <>
//               {/* Booking summary */}
//               <div className="mb-3 p-3 border rounded bg-light">
//                 <div className="row">
//                   <div className="col-md-6 mb-2">
//                     <strong>Booking ID:</strong> {scratchDocsData.booking?.bookingNumber || 'N/A'}
//                   </div>
//                   <div className="col-md-6 mb-2">
//                     <strong>Customer:</strong> {scratchDocsData.booking?.customerName || 'N/A'}
//                   </div>
//                   <div className="col-md-6 mb-2">
//                     <strong>Status:</strong>{' '}
//                     <span className="status-badge">{scratchDocsData.booking?.status || 'N/A'}</span>
//                   </div>
//                   <div className="col-md-6 mb-2">
//                     <strong>Total Scratch Card Amount:</strong>{' '}
//                     <span className="text-success fw-bold">
//                       ₹{(scratchDocsData.totalScratchCardAmount || 0).toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Scratch cards list */}
//               {(!scratchDocsData.scratchCards || scratchDocsData.scratchCards.length === 0) ? (
//                 <CAlert color="info">No scratch cards found for this booking.</CAlert>
//               ) : (
//                 <div className="table-responsive">
//                   <CTable striped bordered hover>
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                         <CTableHeaderCell>Scheme</CTableHeaderCell>
//                         <CTableHeaderCell>Amount</CTableHeaderCell>
//                         <CTableHeaderCell>Status</CTableHeaderCell>
//                         <CTableHeaderCell>Created By</CTableHeaderCell>
//                         <CTableHeaderCell>Created At</CTableHeaderCell>
//                         <CTableHeaderCell>Scratch Card Doc</CTableHeaderCell>
//                         <CTableHeaderCell>Scheme Doc</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {scratchDocsData.scratchCards.map((card, i) => (
//                         <CTableRow key={card._id || i}>
//                           <CTableDataCell>{i + 1}</CTableDataCell>
//                           <CTableDataCell>{card.schemeDetails?.scheme_name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>₹{(card.scratch_card_amount || 0).toLocaleString('en-IN')}</CTableDataCell>
//                           <CTableDataCell>
//                             <span className={`status-badge ${card.status?.toLowerCase() || ''}`}>
//                               {card.status || 'N/A'}
//                             </span>
//                           </CTableDataCell>
//                           <CTableDataCell>{card.createdByDetails?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>
//                             {card.createdAt ? new Date(card.createdAt).toLocaleDateString('en-GB') : 'N/A'}
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             {card.scratch_card_document?.path ? (
//                               <CButton
//                                 size="sm"
//                                 color="primary"
//                                 variant="outline"
//                                 onClick={() => window.open(getScratchDocUrl(card.scratch_card_document.path), '_blank')}
//                               >
//                                 <CIcon icon={cilFile} className="me-1" />
//                                 {card.scratch_card_document.originalName || 'View'}
//                               </CButton>
//                             ) : (
//                               <span className="text-muted">N/A</span>
//                             )}
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             {card.scheme_document?.path ? (
//                               <CButton
//                                 size="sm"
//                                 color="primary"
//                                 variant="outline"
//                                 onClick={() => window.open(getScratchDocUrl(card.scheme_document.path), '_blank')}
//                               >
//                                 <CIcon icon={cilFile} className="me-1" />
//                                 {card.scheme_document.originalName || 'View'}
//                               </CButton>
//                             ) : (
//                               <span className="text-muted">N/A</span>
//                             )}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               )}
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton
//             color="secondary"
//             onClick={() => { setViewScratchModal(false); setSelectedBookingForViewScratch(null); setScratchDocsData(null); }}
//           >
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Sub-components */}
//       <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={refreshCurrentTab} />
//       <KYCView open={kycModalVisible} onClose={() => { setKycModalVisible(false); setKycBookingId(null); }} kycData={kycData} refreshData={refreshCurrentTab} bookingId={kycBookingId} />
//       <FinanceView open={financeModalVisible} onClose={() => { setFinanceModalVisible(false); setFinanceBookingId(null); }} financeData={financeData} refreshData={refreshCurrentTab} bookingId={financeBookingId} />
//       <ChassisNumberModal show={showChassisModal} onClose={() => { setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError(''); }} onSave={handleSaveChassisNumber} isLoading={chassisLoading} booking={tabData[activeTab]?.docs?.find(b => b._id === selectedBookingForChassis || b.id === selectedBookingForChassis)} isUpdate={isUpdateChassis} errorMessage={chassisError} onClearError={() => setChassisError('')} />
//       <PrintModal show={printModalVisible} onClose={() => { setPrintModalVisible(false); setSelectedBookingForPrint(null); }} bookingId={selectedBookingForPrint} />
//       <PendingUpdateDetailsModal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} updateData={selectedUpdate} onApprove={payload => handleApproveUpdate(selectedUpdate._id, payload)} onReject={payload => handleRejectUpdate(selectedUpdate._id, payload)} />
//     </div>
//   );
// };

// export default BookingList;










import '../../../css/table.css';
import '../../../css/form.css';
import '../../../css/invoice.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Link, Menu, MenuItem,
  getDefaultSearchFields, useTableFilter, usePagination,
  showError, axiosInstance, showSuccess, confirmDelete,
} from '../../../utils/tableImports';
import CIcon from '@coreui/icons-react';
import {
  cilCloudUpload, cilPrint, cilPlus, cilSettings, cilPencil, cilTrash,
  cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle, cilFile,
  cilChevronLeft, cilChevronRight, cilDescription, cilSwapHorizontal,
} from '@coreui/icons';
import config from '../../../config';
import ViewBooking from './BookingDetails';
import KYCView from './KYCView';
import FinanceView from './FinanceView';
import ChassisNumberModal from './ChassisModel';
import SwapVehicleModal from './SwapVehicleModal';
import {
  CNav, CNavItem, CNavLink, CTabContent, CTabPane,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CCard, CCardBody, CCardHeader,
  CButton, CFormInput, CSpinner, CFormLabel,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormTextarea, CAlert, CPagination, CPaginationItem, CFormSelect,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
} from '@coreui/react';
import PrintModal from './PrintFinance';
import PendingUpdateDetailsModal from './ViewPendingUpdates';
import {
  hasSafePagePermission, MODULES, PAGES, TABS, ACTIONS,
  canViewPage, canCreateInPage, canUpdateInPage, canDeleteInPage,
} from '../../../utils/modulePermissions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// ─── Tab constants ─────────────────────────────────────────────────────────────
const TAB = {
  PENDING: 0, APPROVED: 1, PENDING_ALLOCATED: 2,
  ALLOCATED: 3, REJECTED: 4, CANCELLED: 5, REJECTED_CANCELLED: 6,
};

const TAB_STATUSES = {
  [TAB.PENDING]:           ['PENDING_APPROVAL', 'PENDING_APPROVAL (Discount_Exceeded)', 'FREEZZED'],
  [TAB.APPROVED]:          ['APPROVED'],
  [TAB.PENDING_ALLOCATED]: ['ON_HOLD', 'PENDING_GM_APPROVAL'],
  [TAB.ALLOCATED]:         ['ALLOCATED'],
  [TAB.REJECTED]:          ['REJECTED'],
};

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_LIMIT     = 50;

const TAB_LABELS = [
  'Pending Approvals', 'Approved', 'Pending Allocated',
  'Allocated', 'Rejected Discount', 'Cancelled Booking', 'Rejected Cancelled',
];

// ── Roles allowed to upload scratch cards (always visible for these roles) ──
const SCRATCH_CARD_ALLOWED_ROLES = ['MANAGER', 'GENERAL_MANAGER', 'ADMIN', 'SUPERADMIN'];

const emptyTab = () => ({
  docs: [], total: 0, pages: 0, currentPage: 1,
  limit: DEFAULT_LIMIT, loading: false, search: '',
});

// ─── Component ─────────────────────────────────────────────────────────────────
const BookingList = () => {
  const [anchorEl, setAnchorEl]   = useState(null);
  const [menuId, setMenuId]       = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUpdate, setSelectedUpdate]     = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [error, setError]                       = useState(null);

  // ── Separate local search state — NEVER tied to async tabData ──
  const [localSearch, setLocalSearch] = useState('');

  // Per-tab paginated state
  const [tabData, setTabData] = useState(() =>
    Object.values(TAB).reduce((acc, i) => { acc[i] = emptyTab(); return acc; }, {})
  );

  // Cancellation tabs (separate API)
  const [cancelledPendingData,  setCancelledPendingData]  = useState([]);
  const [cancelledRejectedData, setCancelledRejectedData] = useState([]);
  const [cancelledPendingPage,  setCancelledPendingPage]  = useState(1);
  const [cancelledRejectedPage, setCancelledRejectedPage] = useState(1);
  const [cancelledLimit,        setCancelledLimit]        = useState(DEFAULT_LIMIT);
  const [cancelledLoading,      setCancelledLoading]      = useState(false);
  const [cancelledSearch,       setCancelledSearch]       = useState('');

  // Debounce timer refs
  const searchTimer        = useRef(null);
  const globalSearchTimer  = useRef(null);

  // ── Stable refs so inputs never lose focus on re-render ──
  const searchInputRef       = useRef(null);
  const globalSearchInputRef = useRef(null);

  // Export modal
  const [exportLoading,   setExportLoading]   = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate:   new Date().toISOString().split('T')[0],
  });

  // Chassis approval
  const [chassisApprovalModal,       setChassisApprovalModal]       = useState(false);
  const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
  const [approvalAction,             setApprovalAction]             = useState('');
  const [approvalNote,               setApprovalNote]               = useState('');
  const [approvalLoading,            setApprovalLoading]            = useState(false);

  // Cancellation approval
  const [cancelApprovalModal,             setCancelApprovalModal]             = useState(false);
  const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
  const [cancelApprovalAction,            setCancelApprovalAction]            = useState('');
  const [editedReason,                    setEditedReason]                    = useState('');
  const [cancellationCharges,             setCancellationCharges]             = useState(0);
  const [notes,                           setNotes]                           = useState('');
  const [rejectionReason,                 setRejectionReason]                 = useState('');
  const [cancelActionLoading,             setCancelActionLoading]             = useState(false);

  // Chassis modal
  const [showChassisModal,          setShowChassisModal]          = useState(false);
  const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
  const [chassisLoading,            setChassisLoading]            = useState(false);
  const [isUpdateChassis,           setIsUpdateChassis]           = useState(false);
  const [chassisError,              setChassisError]              = useState('');

  // ── Swap Vehicle modal ────────────────────────────────────────────────────
  const [swapVehicleModal,       setSwapVehicleModal]       = useState(false);
  const [selectedBookingForSwap, setSelectedBookingForSwap] = useState(null);
  const [swapVehicleLoading,     setSwapVehicleLoading]     = useState(false);
  const [swapVehicleError,       setSwapVehicleError]       = useState('');

  // Available docs modal
  const [availableDocsModal,     setAvailableDocsModal]     = useState(false);
  const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
  const [availableTemplates,     setAvailableTemplates]     = useState(null);
  const [loadingTemplates,       setLoadingTemplates]       = useState(false);
  const [selectedTemplateIds,    setSelectedTemplateIds]    = useState([]);
  const [templateNotes,          setTemplateNotes]          = useState('');
  const [submittingSelection,    setSubmittingSelection]    = useState(false);

  // Restore
  const [restoreBookingModal,    setRestoreBookingModal]    = useState(false);
  const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
  const [restoreReason,          setRestoreReason]          = useState('');
  const [restoreNotes,           setRestoreNotes]           = useState('');
  const [restoreLoading,         setRestoreLoading]         = useState(false);
  const [restoreType,            setRestoreType]            = useState('');

  // View / KYC / Finance / Print
  const [viewModalVisible,        setViewModalVisible]        = useState(false);
  const [selectedBooking,         setSelectedBooking]         = useState(null);
  const [kycModalVisible,         setKycModalVisible]         = useState(false);
  const [kycBookingId,            setKycBookingId]            = useState(null);
  const [kycData,                 setKycData]                 = useState(null);
  const [financeModalVisible,     setFinanceModalVisible]     = useState(false);
  const [financeBookingId,        setFinanceBookingId]        = useState(null);
  const [financeData,             setFinanceData]             = useState(null);
  const [printModalVisible,       setPrintModalVisible]       = useState(false);
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
  const [actionLoadingId,         setActionLoadingId]         = useState(null);
  const [loadingId,               setLoadingId]               = useState(null);

  // ── Scratch Card (Upload) ─────────────────────────────────────────────────
  const [scratchCardModal,          setScratchCardModal]          = useState(false);
  const [selectedBookingForScratch, setSelectedBookingForScratch] = useState(null);
  const [scratchCardLoading,        setScratchCardLoading]        = useState(false);
  const [schemes,                   setSchemes]                   = useState([]);
  const [schemesLoading,            setSchemesLoading]            = useState(false);
  const [scratchCardForm,           setScratchCardForm]           = useState({
    scheme: '',
    scratch_card_amount: '',
    scratch_card_document: null,
    scheme_document: null,
  });
  const [scratchCardErrors,         setScratchCardErrors]         = useState({});

  // ── Scratch Card (View) ───────────────────────────────────────────────────
  const [viewScratchModal,               setViewScratchModal]               = useState(false);
  const [selectedBookingForViewScratch,  setSelectedBookingForViewScratch]  = useState(null);
  const [scratchDocsData,                setScratchDocsData]                = useState(null);
  const [scratchDocsLoading,             setScratchDocsLoading]             = useState(false);

  // ── Scheme Form PDF generation state ──────────────────────────────────────
  const [isGeneratingSchemeForm, setIsGeneratingSchemeForm] = useState(false);

  const { permissions = [], token, user } = useAuth();
  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════════════════════
  // PERMISSIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const canViewPendingApprovalsTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_APPROVALS);
  const canViewApprovedTab                     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.APPROVED);
  const canViewPendingAllocatedTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_ALLOCATED);
  const canViewAllocatedTab                    = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.ALLOCATED);
  const canViewRejectedDiscountTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_DISCOUNT);
  const canViewCancelledBookingTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.CANCELLED_BOOKING);
  const canViewRejectedCancelledBookingTab     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
  const canCreateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
  const canCreateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.APPROVED);
  const canCreateInPendingAllocatedTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_ALLOCATED);
  const canCreateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.ALLOCATED);
  const canCreateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
  const canCreateInCancelledBookingTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.CANCELLED_BOOKING);
  const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
  const canUpdateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
  const canUpdateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.APPROVED);
  const canUpdateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.ALLOCATED);
  const canUpdateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
  const canDeleteInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.PENDING_APPROVALS);
  const canDeleteInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);

  const canApproveChassis               = canCreateInPendingAllocatedTab;
  const canRejectChassis                = canCreateInPendingAllocatedTab;
  const canApproveCancellation          = canCreateInCancelledBookingTab;
  const canRejectCancellation           = canCreateInCancelledBookingTab;
  const canRestoreFromRejectedDiscount  = canCreateInRejectedDiscountTab;
  const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
  const canApproveUpdate                = canCreateInPendingApprovalsTab;
  const canRejectUpdate                 = canCreateInPendingApprovalsTab;
  const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
  const canUpdateChassisInAllocatedTab  = canCreateInAllocatedTab;
  const canEditInPendingApprovalsTab    = canUpdateInPendingApprovalsTab;
  const canEditInRejectedDiscountTab    = canUpdateInRejectedDiscountTab;
  const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
  const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
  const canUploadKycInPendingApprovals     = canCreateInPendingApprovalsTab;
  const canUploadKycInApprovedTab          = canCreateInApprovedTab;
  const canUploadKycInAllocatedTab         = canCreateInAllocatedTab;
  const canUploadKycInRejectedDiscount     = canCreateInRejectedDiscountTab;
  const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
  const canUploadFinanceInApprovedTab      = canCreateInApprovedTab;
  const canUploadFinanceInAllocatedTab     = canCreateInAllocatedTab;
  const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;

  const canSwapVehicleInPendingApprovals = canUpdateInPendingApprovalsTab;
  const canSwapVehicleInApprovedTab      = canUpdateInApprovedTab;

  const userRoleNames = (Array.isArray(user?.roles) ? user.roles : [])
    .map(r => {
      if (typeof r === 'string') return r.toUpperCase();
      if (r && typeof r === 'object' && r.name) return r.name.toString().toUpperCase();
      return '';
    })
    .filter(Boolean);

  const hasRoleFlag =
    user?.is_superadmin === true ||
    user?.is_admin === true ||
    user?.is_general_manager === true ||
    user?.is_sales_manager === true;

  const canUploadScratchCard =
    hasRoleFlag || userRoleNames.some(r => SCRATCH_CARD_ALLOWED_ROLES.includes(r));

  const canPrintInTab = {
    0: canCreateInPendingApprovalsTab, 1: canCreateInApprovedTab,
    2: canCreateInPendingAllocatedTab, 3: canCreateInAllocatedTab,
    4: canCreateInRejectedDiscountTab, 5: canCreateInCancelledBookingTab,
    6: canCreateInRejectedCancelledBookingTab,
  };
  const canViewBookingInTab = {
    0: canViewPendingApprovalsTab,     1: canViewApprovedTab,
    2: canViewPendingAllocatedTab,     3: canViewAllocatedTab,
    4: canViewRejectedDiscountTab,     5: canViewCancelledBookingTab,
    6: canViewRejectedCancelledBookingTab,
  };
  const canViewAnyTab     = Object.values(canViewBookingInTab).some(Boolean);
  const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
  const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER — update a single tab's state slice
  // ═══════════════════════════════════════════════════════════════════════════
  const setTab = useCallback((tabIndex, updates) =>
    setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
  []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE FETCH
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchTab = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
    if (tabIndex >= TAB.CANCELLED) return;
    setTab(tabIndex, { loading: true });

    try {
      const statuses  = TAB_STATUSES[tabIndex];
      const trimmed   = search ? search.trim() : '';

      if (statuses.length === 1) {
        const params = {
          bookingType: 'BRANCH',
          status: statuses[0],
          page,
          limit
        };

        if (trimmed) {
          params.search = trimmed;
          params.searchFields = 'bookingNumber,customerDetails.name';
        }

        const res = await axiosInstance.get('/bookings', { params });
        const d   = res.data.data;

        setTab(tabIndex, {
          docs:        d.bookings || [],
          total:       d.total    || 0,
          pages:       d.pages    || 1,
          currentPage: page,
          limit,
          loading:     false,
          search,
          _allDocs:    undefined,
        });

      } else {
        const responses = await Promise.all(
          statuses.map(status => {
            const params = {
              bookingType: 'BRANCH',
              status,
              page: 1,
              limit: 200
            };

            if (trimmed) {
              params.search = trimmed;
              params.searchFields = 'bookingNumber,customerDetails.name';
            }

            return axiosInstance.get('/bookings', { params });
          })
        );

        let allDocs = [];
        responses.forEach(r => {
          allDocs = allDocs.concat(r.data.data.bookings || []);
        });

        const seen = new Set();
        allDocs = allDocs.filter(d => {
          const id = String(d._id);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });

        if (trimmed) {
          const searchLower = trimmed.toLowerCase();
          allDocs = allDocs.filter(booking => {
            const bookingNumber = (booking.bookingNumber || '').toLowerCase();
            const customerName = (booking.customerDetails?.name || '').toLowerCase();

            return bookingNumber.includes(searchLower) || customerName.includes(searchLower);
          });
        }

        allDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const total    = allDocs.length;
        const pages    = Math.max(1, Math.ceil(total / limit));
        const safePage = Math.min(Math.max(1, page), pages);
        const start    = (safePage - 1) * limit;
        const docs     = allDocs.slice(start, start + limit);

        setTab(tabIndex, {
          docs, total, pages,
          currentPage: safePage,
          limit, loading: false, search,
          _allDocs: allDocs,
        });
      }
    } catch (err) {
      console.error(`[fetchTab] tab ${tabIndex}`, err);
      showError(err);
      setTab(tabIndex, { loading: false });
    }
  }, [setTab]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CANCELLATION FETCH
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchCancellationData = useCallback(async () => {
    try {
      setCancelledLoading(true);
      const [pRes, rRes] = await Promise.all([
        axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'PENDING'  } }),
        axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'REJECTED' } }),
      ]);
      setCancelledPendingData(pRes.data.data  || []);
      setCancelledRejectedData(rRes.data.data || []);
    } catch (err) { showError(err); }
    finally { setCancelledLoading(false); }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!canViewAnyTab) {
      showError('You do not have permission to view any All Booking tabs');
      navigate('/dashboard');
      return;
    }
    fetchTab(activeTab, 1, DEFAULT_LIMIT);
    fetchCancellationData();
  }, []);

  useEffect(() => {
    if (!canViewAnyTab) return;
    const visible = [0,1,2,3,4,5,6].filter(i => canViewBookingInTab[i]);
    if (visible.length > 0 && !visible.includes(activeTab)) setActiveTab(visible[0]);
  }, [canViewAnyTab]);

  // ═══════════════════════════════════════════════════════════════════════════
  // REFRESH after mutations
  // ═══════════════════════════════════════════════════════════════════════════
  const refreshCurrentTab = useCallback(() => {
    if (activeTab < TAB.CANCELLED) {
      const limit = tabData[activeTab].limit || DEFAULT_LIMIT;
      setTab(activeTab, { ...emptyTab(), limit });
      setLocalSearch('');
      if (searchInputRef.current) searchInputRef.current.value = '';
      fetchTab(activeTab, 1, limit, '');
    } else {
      fetchCancellationData();
    }
  }, [activeTab, tabData, setTab, fetchTab, fetchCancellationData, searchInputRef]);

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB CHANGE
  // ═══════════════════════════════════════════════════════════════════════════
  const handleTabChange = useCallback((tab) => {
    clearTimeout(searchTimer.current);
    clearTimeout(globalSearchTimer.current);
    setActiveTab(tab);
    setLocalSearch('');
    if (searchInputRef.current) searchInputRef.current.value = '';
    if (globalSearchInputRef.current) globalSearchInputRef.current.value = '';

    if (tab < TAB.CANCELLED) {
      setTabData(prev => {
        const td    = prev[tab];
        const limit = td.limit || DEFAULT_LIMIT;
        const resetTab = { ...td, search: '' };
        setTimeout(() => fetchTab(tab, 1, limit, ''), 0);
        return { ...prev, [tab]: resetTab };
      });
    }
  }, [fetchTab, searchInputRef]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE CHANGE
  // ═══════════════════════════════════════════════════════════════════════════
  const handlePageChange = useCallback((tabIndex, newPage) => {
    if (newPage < 1) return;
    setTabData(prev => {
      const td = prev[tabIndex];
      if (newPage > td.pages) return prev;

      if (td._allDocs) {
        const start = (newPage - 1) * td.limit;
        const docs  = td._allDocs.slice(start, start + td.limit);
        return { ...prev, [tabIndex]: { ...td, docs, currentPage: newPage } };
      } else {
        fetchTab(tabIndex, newPage, td.limit, td.search);
        return prev;
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchTab]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ROWS PER PAGE CHANGE
  // ═══════════════════════════════════════════════════════════════════════════
  const handleLimitChange = useCallback((tabIndex, newLimit) => {
    const limit = parseInt(newLimit, 10);
    setTabData(prev => {
      const td = prev[tabIndex];
      if (td._allDocs) {
        const pages = Math.max(1, Math.ceil(td._allDocs.length / limit));
        return { ...prev, [tabIndex]: { ...td, docs: td._allDocs.slice(0, limit), limit, currentPage: 1, pages } };
      } else {
        fetchTab(tabIndex, 1, limit, td.search);
        return prev;
      }
    });
  }, [fetchTab]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PER-TAB SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  const handleSearch = useCallback((value) => {
    if (activeTabRef.current >= TAB.CANCELLED) {
      setCancelledSearch(value);
      setCancelledPendingPage(1);
      setCancelledRejectedPage(1);
      return;
    }

    setLocalSearch(value);

    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const tab = activeTabRef.current;
      setTabData(prev => {
        const limit = prev[tab]?.limit || DEFAULT_LIMIT;
        fetchTab(tab, 1, limit, value);
        return prev;
      });
    }, 500);
  }, [fetchTab]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOBAL SEARCH
  // ═══════════════════════════════════════════════════════════════════════════

  // Map a booking status to the tab it belongs in
  const getTabFromStatus = (status) => {
    if (!status) return null;
    if (TAB_STATUSES[TAB.PENDING].includes(status))           return TAB.PENDING;
    if (TAB_STATUSES[TAB.APPROVED].includes(status))          return TAB.APPROVED;
    if (TAB_STATUSES[TAB.PENDING_ALLOCATED].includes(status)) return TAB.PENDING_ALLOCATED;
    if (TAB_STATUSES[TAB.ALLOCATED].includes(status))         return TAB.ALLOCATED;
    if (TAB_STATUSES[TAB.REJECTED].includes(status))          return TAB.REJECTED;
    return null; // cancelled tabs use a different API
  };

  const runGlobalSearch = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const res = await axiosInstance.get('/bookings', {
        params: {
          search: trimmed,
          bookingType: 'BRANCH',
          page: 1,
          limit: 10,
          searchFields: 'bookingNumber,customerDetails.name',
        },
      });

      const bookings = res.data?.data?.bookings || [];
      if (bookings.length === 0) {
        showError(`No booking found for "${trimmed}"`);
        return;
      }

      // Prefer exact bookingNumber match
      const q = trimmed.toLowerCase();
      const exact = bookings.find(b => (b.bookingNumber || '').toLowerCase() === q);
      const match = exact || bookings[0];

      const targetTab = getTabFromStatus(match.status);
      if (targetTab === null) {
        showError(
          `Booking "${match.bookingNumber}" is in a status ("${match.status}") not shown in any tab.`
        );
        return;
      }

      if (!canViewBookingInTab[targetTab]) {
        showError(`You don't have permission to view the tab containing this booking.`);
        return;
      }

      // Clear per-tab debounce & switch tab
      clearTimeout(searchTimer.current);
      setActiveTab(targetTab);

      // Fill the per-tab search box too, so the user sees the filter
      setLocalSearch(match.bookingNumber || trimmed);
      if (searchInputRef.current) searchInputRef.current.value = match.bookingNumber || trimmed;

      const limit = tabData[targetTab]?.limit || DEFAULT_LIMIT;
      fetchTab(targetTab, 1, limit, match.bookingNumber || trimmed);

      // No success popup — silent, as requested
    } catch (err) {
      showError(err.response?.data?.message || 'Global search failed');
    }
  }, [canViewBookingInTab, fetchTab, tabData]);

  const handleGlobalSearchChange = useCallback((value) => {
    clearTimeout(globalSearchTimer.current);

    // ── If cleared → revert back to normal tab data (unfiltered) ──
    if (!value.trim()) {
      const tab = activeTabRef.current;
      if (tab < TAB.CANCELLED) {
        // Clear per-tab search so the visible list matches the reset
        setLocalSearch('');
        if (searchInputRef.current) searchInputRef.current.value = '';

        const limit = tabData[tab]?.limit || DEFAULT_LIMIT;
        setTab(tab, { ...emptyTab(), limit });
        fetchTab(tab, 1, limit, '');
      }
      return;
    }

    // Otherwise debounce and run the global search
    globalSearchTimer.current = setTimeout(() => {
      runGlobalSearch(value);
    }, 500);
  }, [runGlobalSearch, setTab, fetchTab, tabData]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CANCELLATION CLIENT-SIDE FILTER
  // ═══════════════════════════════════════════════════════════════════════════
  const getFilteredCancelled = useCallback((data) => {
    if (!cancelledSearch) return data;
    const t = cancelledSearch.toLowerCase();
    return data.filter(c =>
      (c.customer?.name || '').toLowerCase().includes(t)
    );
  }, [cancelledSearch]);

  const getCancelledPage = useCallback((data, page) => {
    const start = (page - 1) * cancelledLimit;
    return data.slice(start, start + cancelledLimit);
  }, [cancelledLimit]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGINATION RENDERERS
  // ═══════════════════════════════════════════════════════════════════════════
  const renderPagination = (tabIndex) => {
    const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
    if (!total) return null;

    const start = (currentPage - 1) * limit + 1;
    const end   = Math.min(currentPage * limit, total);

    let sp = Math.max(1, currentPage - 2);
    let ep = Math.min(pages, currentPage + 2);
    if (currentPage <= 3)         ep = Math.min(5, pages);
    if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
    const pageNums = [];
    for (let i = sp; i <= ep; i++) pageNums.push(i);

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
            <CFormSelect value={limit} onChange={e => handleLimitChange(tabIndex, e.target.value)}
              style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm" disabled={loading}>
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}><CIcon icon={cilChevronLeft} /></CPaginationItem>
            {sp > 1 && <><CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>{sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}</>}
            {pageNums.map(p => <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(tabIndex, p)} disabled={loading}>{p}</CPaginationItem>)}
            {ep < pages && <>{ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}<CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem></>}
            <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}><CIcon icon={cilChevronRight} /></CPaginationItem>
            <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  const renderCancelledPagination = (data, page, setPage) => {
    const total = data.length;
    if (total <= cancelledLimit) return null;
    const pages = Math.ceil(total / cancelledLimit);
    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
            <CFormSelect value={cancelledLimit} onChange={e => { setCancelledLimit(parseInt(e.target.value, 10)); setPage(1); }}
              style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm">
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </CFormSelect>
          </div>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            Showing {(page - 1) * cancelledLimit + 1}–{Math.min(page * cancelledLimit, total)} of {total}
          </span>
        </div>
        {pages > 1 && (
          <CPagination align="center" size="sm">
            <CPaginationItem onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><CIcon icon={cilChevronLeft} /></CPaginationItem>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p =>
              <CPaginationItem key={p} active={p === page} onClick={() => setPage(p)}>{p}</CPaginationItem>
            )}
            <CPaginationItem onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}><CIcon icon={cilChevronRight} /></CPaginationItem>
          </CPagination>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  const handleClick = (e, id) => { setAnchorEl(e.currentTarget); setMenuId(id); };
  const handleClose = () => { setAnchorEl(null); setMenuId(null); };

  const handleOpenRestoreModal = (bookingId, type) => {
    if (type === 'rejected_discount' && !canRestoreFromRejectedDiscount) { showError('No permission to restore'); return; }
    if (type === 'cancelled'         && !canRestoreFromRejectedCancelled) { showError('No permission to restore'); return; }
    setSelectedRestoreBooking(bookingId); setRestoreType(type);
    setRestoreReason(''); setRestoreNotes(''); setRestoreBookingModal(true); handleClose();
  };

  const handleRestoreBooking = async () => {
    const ok = restoreType === 'cancelled' ? canRestoreFromRejectedCancelled : canRestoreFromRejectedDiscount;
    if (!ok || !selectedRestoreBooking) return;
    try {
      setRestoreLoading(true);
      const url = restoreType === 'cancelled'
        ? `/bookings/${selectedRestoreBooking}/restore`
        : `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
      await axiosInstance.put(url, { reason: restoreReason.trim() || undefined, notes: restoreNotes.trim() || undefined });
      showSuccess('Booking restored successfully!');
      setRestoreBookingModal(false); setSelectedRestoreBooking(null); refreshCurrentTab();
    } catch (err) { showError(err.response?.data?.message || 'Failed to restore booking'); }
    finally { setRestoreLoading(false); }
  };

  const handleOpenAvailableDocs = async (bookingId) => {
    if (!canViewAllBooking) { showError('No permission to view available documents'); return; }
    try {
      setLoadingTemplates(true); setSelectedBookingForDocs(bookingId);
      const res = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
      setAvailableTemplates(res.data.data); setAvailableDocsModal(true);
      setSelectedTemplateIds([]); setTemplateNotes('');
    } catch (err) { showError('Failed to fetch available documents'); }
    finally { setLoadingTemplates(false); }
    handleClose();
  };

  const handleTemplateSelection = (id, canDownload) => {
    if (!canDownload) return;
    setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAllAvailable = () =>
    setSelectedTemplateIds((availableTemplates?.available_templates?.templates || []).filter(t => t.can_download).map(t => t.template_id));

  const handleSubmitTemplateSelection = async () => {
    if (!canUpdateInApprovedTab) { showError('No permission to select templates'); return; }
    if (!selectedBookingForDocs || !selectedTemplateIds.length) { showError('Please select at least one template'); return; }
    try {
      setSubmittingSelection(true);
      await axiosInstance.post('/booking-templates/select', { bookingId: selectedBookingForDocs, templateIds: selectedTemplateIds, notes: templateNotes.trim() || undefined });
      showSuccess('Templates selected successfully!');
      setAvailableDocsModal(false); setSelectedBookingForDocs(null);
      setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes('');
    } catch (err) { showError(err.response?.data?.message || 'Failed to select templates'); }
    finally { setSubmittingSelection(false); }
  };

  const handleApproveCancellation = (c) => {
    if (!canApproveCancellation) { showError('No permission to approve cancellations'); return; }
    setSelectedCancellationForApproval(c); setCancelApprovalAction('APPROVE');
    setEditedReason(c.cancellationRequest?.reason || '');
    setCancellationCharges(c.cancellationRequest?.cancellationCharges || 0);
    setNotes(''); setCancelApprovalModal(true);
  };

  const handleRejectCancellation = (c) => {
    if (!canRejectCancellation) { showError('No permission to reject cancellations'); return; }
    setSelectedCancellationForApproval(c); setCancelApprovalAction('REJECT');
    setRejectionReason(''); setNotes(''); setCancelApprovalModal(true);
  };

  const handleCancelActionSubmit = async () => {
    if (!selectedCancellationForApproval) return;
    try {
      setCancelActionLoading(true);
      if (cancelApprovalAction === 'APPROVE') {
        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, {
          reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
          editedReason, cancellationCharges, notes,
        });
        showSuccess('Cancellation approved!');
      } else {
        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, { rejectionReason, notes });
        showSuccess('Cancellation rejected!');
      }
      setCancelApprovalModal(false); setSelectedCancellationForApproval(null);
      setEditedReason(''); setCancellationCharges(0); setNotes(''); setRejectionReason('');
      fetchCancellationData();
    } catch (err) { showError(err.response?.data?.message || 'Failed to process cancellation'); }
    finally { setCancelActionLoading(false); }
  };

  const handleApproveChassis = (id) => {
    if (!canApproveChassis) { showError('No permission to approve chassis'); return; }
    setSelectedBookingForApproval(id); setApprovalAction('APPROVE'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
  };

  const handleRejectChassis = (id) => {
    if (!canRejectChassis) { showError('No permission to reject chassis'); return; }
    setSelectedBookingForApproval(id); setApprovalAction('REJECT'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
  };

  const handleChassisApprovalSubmit = async () => {
    if (!selectedBookingForApproval || !approvalNote.trim()) { showError('Please enter approval/rejection note'); return; }
    try {
      setApprovalLoading(true);
      await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, { action: approvalAction, approvalNote: approvalNote.trim() });
      showSuccess(`Chassis ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'}!`);
      setChassisApprovalModal(false); setSelectedBookingForApproval(null); setApprovalNote(''); refreshCurrentTab();
    } catch (err) { showError(err.response?.data?.message || 'Failed to process chassis'); }
    finally { setApprovalLoading(false); }
  };

  const handleViewBooking = async (id) => {
    if (!canViewBookingInTab[activeTab]) { showError('No permission to view booking'); return; }
    try {
      const res = await axiosInstance.get(`/bookings/${id}`);
      setSelectedBooking(res.data.data); setViewModalVisible(true); handleClose();
    } catch (err) { showError('Failed to fetch booking details'); }
  };

  const handlePrint = (id) => {
    if (!canPrintInTab[activeTab]) { showError('No permission to print in this tab'); return; }
    setSelectedBookingForPrint(id); setPrintModalVisible(true); handleClose();
  };

  const handleViewKYC = async (bookingId) => {
    if (!canViewBookingInTab[activeTab]) { showError('No permission to view KYC'); return; }
    try {
      setKycBookingId(bookingId);
      const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
      if (!booking) { showError('Booking not found'); return; }
      const res = await axiosInstance.get(`/kyc/${bookingId}/documents`);
      setKycData({ ...res.data.data, status: booking.documentStatus?.kyc?.status || 'PENDING', customerName: booking.customerDetails.name, address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}` });
      setKycModalVisible(true); handleClose();
    } catch (err) { showError(err); }
  };

  const handleViewFinanceLetter = async (bookingId) => {
    if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
    try {
      setActionLoadingId(bookingId);
      const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
      if (!booking) { showError('Booking not found'); return; }
      setFinanceData({ status: booking.documentStatus?.financeLetter?.status || 'PENDING', customerName: booking.customerDetails.name, bookingId: booking._id });
      setFinanceBookingId(bookingId); setFinanceModalVisible(true); handleClose();
    } catch (err) { showError(err); }
    finally { setActionLoadingId(null); }
  };

  const handleViewFinanceLetterReceipt = async (bookingId) => {
    if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
    try {
      setActionLoadingId(bookingId);
      const [bRes, dRes] = await Promise.all([
        axiosInstance.get(`/bookings/${bookingId}`),
        axiosInstance.get(`/disbursements/bookings/${bookingId}/disbursements`),
      ]);
      const bd  = bRes.data.data;
      const dis = dRes.data.success && dRes.data.data.disbursements.length > 0
        ? dRes.data.data.disbursements[0]?.disbursementAmount || 0 : 0;
      const tab = window.open('', '_blank');
      tab.document.write(generateFinanceLetterHTML(bd, dis));
      tab.document.close();
    } catch (err) { showError('Failed to fetch finance letter data'); }
    finally { setActionLoadingId(null); handleClose(); }
  };

  const generateFinanceLetterHTML = (bd, disbursementAmount) => {
    const today       = new Date().toLocaleDateString('en-GB');
    const dealAmount  = bd?.discountedAmount || 0;
    const gcAmount    = bd?.payment?.gcAmount || 0;
    const exchAmt     = bd?.exchangeDetails?.price || 0;
    const downPayment = (dealAmount + gcAmount) - disbursementAmount - exchAmt;
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>FINANCER'S ASSURANCE LETTER</title><style>@page{size:A4;margin:20mm}body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.4;margin:0;padding:0;background:#f5f5f5}.page{width:210mm;min-height:297mm;margin:10mm auto;padding:15mm;background:white;box-shadow:0 0 10px rgba(0,0,0,.1);box-sizing:border-box}.details-table{width:100%;border-collapse:collapse;margin:20px 0}.details-table,.details-table td{border:1px solid black}.details-table td{padding:8px;vertical-align:top}.left-col{width:70%;font-weight:bold}.instruction-text{margin:15px 0;text-align:justify}.signature-box{width:25%;border-top:1px dashed black;margin-top:5px;margin-left:auto;padding:1px 0;text-align:right;color:#555;font-weight:bold}@media print{body{background:white}.page{box-shadow:none;margin:0;padding:0;width:100%}}</style></head><body><div class="page"><div style="text-align:right">Date: <strong>${today}</strong></div><div style="margin:15px 0">To,<br>The Director/Manager,<br>Gandhi Motors Pvt Ltd,<br>Nasik</div><div style="font-weight:bold;margin:15px 0">Sub:- Delivery Order &amp; Disbursement Assurance letter.</div><div style="margin:15px 0">Dear sir,</div><div>We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:</div><div style="margin:15px 0">Name : Mr./Mrs. : <strong>${bd?.customerDetails?.name||''}</strong></div><div style="margin:15px 0">Vehicle make &amp; model : <strong>${bd?.model?.model_name||bd?.model?.name||''}</strong> &nbsp;&nbsp; Booking Number: <strong>${bd?.bookingNumber||''}</strong></div><table class="details-table"><tr><td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td><td>${dealAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Disbursement Amount assured by finance company</td><td>${disbursementAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Net Down Payment to be taken from Customer</td><td>${downPayment.toLocaleString('en-IN')}</td></tr></table><div class="instruction-text">The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.</div><div class="instruction-text">This letter is non revokable &amp; we promise to pay you the above-mentioned loan amount within stipulated time.</div><div class="instruction-text">You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office &amp; give us the details of RTO registration along with the invoice, insurance &amp; Down payment receipt.</div><div class="instruction-text">Please do the needful.</div><div style="margin-top:40px"><div>For &amp; on behalf of</div><div>Financer's / Bank</div><div>Name: <strong>${bd?.payment?.financer?.name||''}</strong></div><div style="margin-top:15px">Employee Name: ________________________________</div><div style="margin-top:15px">Mobile No: ________________________________</div></div><div class="signature-box"><strong>Authorised Signature</strong></div></div></body></html>`;
  };

  const handleAllocateChassis = (id) => {
    if (!canAllocateChassisInApprovedTab) { showError('No permission to allocate chassis'); return; }
    setSelectedBookingForChassis(id); setIsUpdateChassis(false); setShowChassisModal(true); handleClose();
  };

  const handleUpdateChassis = (id) => {
    if (!canUpdateChassisInAllocatedTab) { showError('No permission to update chassis'); return; }
    setSelectedBookingForChassis(id); setIsUpdateChassis(true); setShowChassisModal(true); handleClose();
  };

  const handleSaveChassisNumber = async (payload) => {
    const ok = isUpdateChassis ? canUpdateChassisInAllocatedTab : canAllocateChassisInApprovedTab;
    if (!ok) { showError('No permission to save chassis number'); return; }
    try {
      setChassisLoading(true); setChassisError('');
      let url = `/bookings/${selectedBookingForChassis}/allocate`;
      if (payload.reason) url += `?reason=${encodeURIComponent(payload.reason)}`;
      const fd = new FormData();
      fd.append('chassisNumber', payload.chassisNumber);
      fd.append('is_deviation', payload.is_deviation);
      if (payload.note) fd.append('note', payload.note);
      if (payload.claimDetails) {
        fd.append('hasClaim', 'true');
        fd.append('priceClaim', payload.claimDetails.price);
        fd.append('description', payload.claimDetails.description);
        payload.claimDetails.documents.forEach(f => fd.append('documents', f));
      } else { fd.append('hasClaim', 'false'); }
      const res = await axiosInstance.put(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showSuccess(res.data.message);
      setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError('');
      refreshCurrentTab();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save chassis number';
      setChassisError(msg); showError(msg);
    } finally { setChassisLoading(false); }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SWAP VEHICLE HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  const handleOpenSwapVehicle = (id) => {
    const allowed =
      (activeTab === TAB.PENDING  && canSwapVehicleInPendingApprovals) ||
      (activeTab === TAB.APPROVED && canSwapVehicleInApprovedTab);

    if (!allowed) { showError('No permission to swap vehicle'); return; }

    const booking = tabData[activeTab]?.docs?.find(b => b._id === id || b.id === id);
    if (!booking) { showError('Booking not found'); return; }

    setSelectedBookingForSwap(booking);
    setSwapVehicleError('');
    setSwapVehicleModal(true);
    handleClose();
  };

  const handleSwapVehicleSubmit = async ({ newChassisNumber, reason }) => {
    if (!selectedBookingForSwap) return;
    const ok =
      (activeTab === TAB.PENDING  && canSwapVehicleInPendingApprovals) ||
      (activeTab === TAB.APPROVED && canSwapVehicleInApprovedTab);
    if (!ok) { showError('No permission to swap vehicle'); return; }

    try {
      setSwapVehicleLoading(true);
      setSwapVehicleError('');

      const bookingId = selectedBookingForSwap._id || selectedBookingForSwap.id;

      await axiosInstance.post(
        `/bookingvehicleswap/${bookingId}/swap-vehicle`,
        { newChassisNumber, reason }
      );

      showSuccess('Vehicle swapped successfully!');
      setSwapVehicleModal(false);
      setSelectedBookingForSwap(null);
      refreshCurrentTab();
    } catch (err) {
      const data = err.response?.data || {};
      const msg =
        data.error ||
        data.message ||
        (Array.isArray(data.errors) && data.errors[0]?.msg) ||
        err.message ||
        'Failed to swap vehicle';

      setSwapVehicleError(msg);
      showError(msg);
    } finally {
      setSwapVehicleLoading(false);
    }
  };

  const handleViewAltrationRequest = (booking) => {
    if (!canViewPendingApprovalsTab) { showError('No permission to view alteration requests'); return; }
    setSelectedUpdate(booking); setDetailsModalOpen(true); handleClose();
  };

  const handleApproveUpdate = async (id, payload) => {
    if (!canApproveUpdate) { showError('No permission to approve updates'); return; }
    try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/approve-update`, payload); showSuccess('Update approved'); refreshCurrentTab(); setDetailsModalOpen(false); }
    catch (err) { showError(err); } finally { setLoadingId(null); }
  };

  const handleRejectUpdate = async (id, payload) => {
    if (!canRejectUpdate) { showError('No permission to reject updates'); return; }
    try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/reject-update`, payload); showSuccess('Update rejected'); refreshCurrentTab(); setDetailsModalOpen(false); }
    catch (err) { showError(err); } finally { setLoadingId(null); }
  };

  const handleDelete = async (id) => {
    const ok = activeTab === 0 ? canDeleteBookingInPendingApprovals : canDeleteBookingInRejectedDiscount;
    if (!ok) { showError('No permission to delete bookings'); return; }
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try { await axiosInstance.delete(`/bookings/${id}`); showSuccess('Booking deleted'); refreshCurrentTab(); }
      catch (err) { showError(err.response?.data?.message || 'Failed to delete booking'); }
    }
  };

  const getAuthToken = () => token || localStorage.getItem('token') || localStorage.getItem('authToken');

  const handleExportConfirm = async () => {
    try {
      setExportLoading(true);
      const authToken = getAuthToken();
      if (!authToken) { showError('Please login'); setExportLoading(false); setShowExportModal(false); return; }
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const branchId = userData.branchId || '695a32b2e3a6522ef7138420';
      const { startDate, endDate } = exportDateRange;
      const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', exportUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url;
          a.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          showSuccess('Excel downloaded!'); setShowExportModal(false);
        } else { showError(xhr.status === 401 ? 'Please login' : 'Download failed'); }
        setExportLoading(false);
      };
      xhr.onerror = () => { showError('Network error'); setExportLoading(false); };
      xhr.send();
    } catch (err) { showError('Export failed'); setExportLoading(false); }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCRATCH CARD HANDLERS (UPLOAD)
  // ═══════════════════════════════════════════════════════════════════════════
  const handleOpenScratchCardModal = async (booking) => {
    if (!canUploadScratchCard) {
      showError('You do not have permission to upload scratch cards');
      return;
    }

    setSelectedBookingForScratch(booking);
    setScratchCardForm({
      scheme: '',
      scratch_card_amount: '',
      scratch_card_document: null,
      scheme_document: null,
    });
    setScratchCardErrors({});
    setScratchCardModal(true);
    handleClose();

    try {
      setSchemesLoading(true);
      const res = await axiosInstance.get('/schemes');
      setSchemes(res.data.data.schemes || []);
    } catch (err) {
      showError('Failed to fetch schemes');
      setSchemes([]);
    } finally {
      setSchemesLoading(false);
    }
  };

  const handleScratchCardFormChange = (field, value) => {
    setScratchCardForm(prev => ({ ...prev, [field]: value }));
    if (scratchCardErrors[field]) {
      setScratchCardErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleScratchCardFileChange = (field, file) => {
    setScratchCardForm(prev => ({ ...prev, [field]: file }));
    if (scratchCardErrors[field]) {
      setScratchCardErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateScratchCardForm = () => {
    const errors = {};
    if (!scratchCardForm.scheme) errors.scheme = 'Scheme is required';
    if (!scratchCardForm.scratch_card_amount) {
      errors.scratch_card_amount = 'Scratch card amount is required';
    } else if (isNaN(scratchCardForm.scratch_card_amount) || Number(scratchCardForm.scratch_card_amount) < 0) {
      errors.scratch_card_amount = 'Enter a valid amount';
    }
    if (!scratchCardForm.scratch_card_document) {
      errors.scratch_card_document = 'Scratch card document is required';
    }
    if (!scratchCardForm.scheme_document) {
      errors.scheme_document = 'Scheme document is required';
    }
    setScratchCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitScratchCard = async () => {
    if (!validateScratchCardForm()) return;

    try {
      setScratchCardLoading(true);

      const formData = new FormData();
      formData.append('booking', selectedBookingForScratch._id || selectedBookingForScratch.id);
      formData.append('scheme', scratchCardForm.scheme);
      formData.append('scratch_card_amount', scratchCardForm.scratch_card_amount);
      formData.append('scratch_card_document', scratchCardForm.scratch_card_document);
      formData.append('scheme_document', scratchCardForm.scheme_document);

      await axiosInstance.post('/scratch-cards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showSuccess('Scratch card uploaded successfully!');
      setScratchCardModal(false);
      setSelectedBookingForScratch(null);
      refreshCurrentTab();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload scratch card');
    } finally {
      setScratchCardLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCRATCH CARD HANDLERS (VIEW)
  // ═══════════════════════════════════════════════════════════════════════════
  const handleViewScratchDocs = async (booking) => {
    setSelectedBookingForViewScratch(booking);
    setScratchDocsData(null);
    setViewScratchModal(true);
    handleClose();

    try {
      setScratchDocsLoading(true);
      const bookingId = booking._id || booking.id;
      const res = await axiosInstance.get(`/scratch-cards/booking/${bookingId}`);
      setScratchDocsData(res.data.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch scratch card documents');
      setScratchDocsData(null);
    } finally {
      setScratchDocsLoading(false);
    }
  };

  const getScratchDocUrl = (path) => {
    if (!path) return '';
    const idx = path.indexOf('/uploads');
    const rel = idx !== -1 ? path.slice(idx) : path;
    return `https://gmplmis.com/dealership-api/api/v1${rel}`;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DOWNLOAD SCHEME FORM (PDF)
  // ═══════════════════════════════════════════════════════════════════════════
  const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
      document.body.appendChild(script);
    });
  };

  const handleDownloadSchemeForm = async (booking) => {
    if (!booking) return;
    if (booking?.scheme?.toLowerCase() !== 'yes') return;

    const customerName = booking?.customerDetails?.name || '';
    const address = [
      booking?.customerDetails?.address,
      booking?.customerDetails?.taluka,
      booking?.customerDetails?.district,
      booking?.customerDetails?.pincode,
    ].filter(Boolean).join(', ');

    const contactNumber = booking?.customerDetails?.mobile1 || booking?.customerDetails?.mobile || '';
    const vehicleModel = booking?.model?.model_name || booking?.model?.name || '';
    const bookingNumber = booking?.bookingNumber || '';
    const financierName = booking?.payment?.financer?.name || '';
    const today = new Date().toLocaleDateString('en-GB');

    const innerHtml = `
      <div id="scheme-form-page">
        <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto 0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;">
          <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:14px;">
            <p style="font-size:20px;font-weight:bold;letter-spacing:0.5px;margin:0;">GANDHI MOTORS PVT. LTD.</p>
            <p style="font-size:16px;font-weight:bold;margin:6px 0 2px;text-decoration:underline;">"SCRATCH &amp; WIN" OFFER</p>
            <p style="font-size:13px;font-style:italic;margin:0 0 4px;">Customer Acknowledgment &amp; Consent Form</p>
          </div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Customer Name:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span></div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Address:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${address}</span></div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Contact Number:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${contactNumber}</span></div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Vehicle Model / Variant:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${vehicleModel}</span></div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Booking / Invoice No.:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${bookingNumber}</span></div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Financier (Bank / NBFC) Name:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${financierName}</span></div>
          <div style="display:flex;align-items:flex-end;margin-bottom:12px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span></div>
          <div style="font-weight:bold;font-size:14px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Terms &amp; Conditions of the Offer</div>
          <ol style="padding-left:20px;margin:0 0 10px;">
            <li style="margin-bottom:6px;text-align:justify;">This "Scratch &amp; Win" offer ("the Offer") is available only to customers who purchase a vehicle through select bank/NBFC finance (loan) from GANDHI MOTORS PVT. LTD. ("the Dealership").</li>
            <li style="margin-bottom:6px;text-align:justify;">Participation in the Offer is entirely free. No separate fee, charge, deposit, or additional amount is payable by the customer to become eligible for, or to participate in, the Offer.</li>
            <li style="margin-bottom:6px;text-align:justify;">The price of the vehicle is identical for every customer, whether the vehicle is purchased on cash or on finance. The vehicle's price has not been increased or altered in any way on account of the Offer.</li>
            <li style="margin-bottom:6px;text-align:justify;">The customer will select one scratch card from multiple cards placed in a pot/box at the time of purchase. Every card carries a guaranteed discount of not less than ₹3,000 and not more than ₹10,000. No card carries a nil or "try again" outcome — every participating customer receives a discount within this range.</li>
            <li style="margin-bottom:6px;text-align:justify;">The discount amount is determined entirely by random selection at the time the card is drawn, and bears no relation to the vehicle model, variant, colour, accessories, or any other factor.</li>
            <li style="margin-bottom:6px;text-align:justify;">The discount amount shown on the scratch card will be applied as a discount in the customer's final deal form / tax invoice for the vehicle.</li>
            <li style="margin-bottom:6px;text-align:justify;">The Offer is limited to one scratch card per customer, per vehicle booking.</li>
            <li style="margin-bottom:6px;text-align:justify;">Once revealed, the discount amount is final. It is not transferable, not exchangeable for cash or any other benefit, and cannot be combined with any other offer unless the Dealership states otherwise in writing.</li>
            <li style="margin-bottom:6px;text-align:justify;">The Offer is valid from 16/09/2026 to 30/11/2026, or until withdrawn earlier at the Dealership's discretion.</li>
            <li style="margin-bottom:6px;text-align:justify;">This is a promotional discount scheme offered voluntarily by the Dealership, funded entirely from its own margin, to make vehicle finance more attractive to customers. As no payment, fee, or other consideration is charged to the customer for the chance to receive a discount, the Offer does not constitute a lottery, prize competition, or game of chance for consideration.</li>
          </ol>
        </div>
        <div class="pdf-page" style="width:210mm;min-height:290mm;padding:12mm 14mm 18mm 14mm;margin:0 auto;background:#fff;font-family:'Times New Roman',serif;font-size:12.5px;line-height:1.55;color:#000;box-sizing:border-box;page-break-before:always;break-before:page;">
          <ol start="11" style="padding-left:20px;margin:0 0 10px;">
            <li style="margin-bottom:6px;text-align:justify;">For any queries or grievances relating to the Offer, customers may write to us contact us at gandhitvsnashik@gmail.com.</li>
            <li style="margin-bottom:6px;text-align:justify;">The Dealership may amend these terms at any time. Any such change will apply prospectively only and will not affect a discount already confirmed to a customer.</li>
            <li style="margin-bottom:6px;text-align:justify;">Nothing in these terms, or in the acknowledgment below, limits or affects any right available to the customer under the Consumer Protection Act, 2019, or any other applicable law.</li>
          </ol>
          <div style="font-weight:bold;font-size:13px;margin:18px 0 8px;text-align:center;text-decoration:underline;">Customer Acknowledgment &amp; Declaration</div>
          <p style="margin-bottom:8px;">I, the undersigned, confirm and declare that:</p>
          <ul style="list-style:none;padding-left:0;margin:0 0 12px;">
            <li style="margin-bottom:6px;text-align:justify;"><b>(a)</b> I have been shown and explained the above Terms &amp; Conditions, in a language I understand, before participating in the Offer &amp; I have voluntarily participated in the Dealer Scratch &amp; Win offer.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(b)</b> I have not paid, and have not been asked to pay, any amount over and above the standard price of the vehicle in order to participate in the Offer.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(c)</b> My decision to purchase this vehicle on finance was made independently, and my participation in the Offer is entirely voluntary.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(d)</b> I selected my scratch card of my own free will, and understand that the discount amount shown on it — between ₹3,000 and ₹10,000 — was determined randomly.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(e)</b> The discount amount revealed on my card is ₹_______________________, which I accept as final and understand will be deducted from the deal amount / price in my vehicle's tax invoice.</li>
            <li style="margin-bottom:6px;text-align:justify;"><b>(f)</b> I understand and acknowledge that, as no fee or other consideration was charged to me for the Offer, it is a promotional discount and not a lottery, prize competition, or game of chance requiring payment.</li>
          </ul>
          <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
            <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;"></div>
            <div style="font-size:11.5px;font-weight:bold;">Signature of Customer</div>
            <div style="display:flex;align-items:flex-end;margin-top:10px;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Full Name (Block Letters):</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${customerName}</span></div>
            <div style="display:flex;align-items:flex-end;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:130px;">Date:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span><span style="font-weight:bold;white-space:nowrap;margin:0 6px 0 10px;min-width:60px;">Place:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">Sangamner</span></div>
          </div>
          <div style="margin-top:26px;page-break-inside:avoid;break-inside:avoid;">
            <p style="font-weight:bold;margin-bottom:8px;">For GANDHI MOTORS PVT. LTD.</p>
            <div style="border-bottom:1px dotted #000;height:32px;margin-bottom:4px;width:60%;"></div>
            <div style="font-size:11.5px;font-weight:bold;">Signature of Dealership Manager / Representative</div>
            <div style="display:flex;align-items:flex-end;margin-top:10px;width:60%;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Name &amp; Designation:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;"></span></div>
            <div style="display:flex;align-items:flex-end;width:60%;"><span style="font-weight:bold;white-space:nowrap;margin-right:6px;min-width:170px;">Date:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:18px;padding:0 4px;">${today}</span></div>
          </div>
        </div>
      </div>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.style.top = '0';
    iframe.style.border = '0';
    iframe.style.width = '900px';
    iframe.style.height = '1400px';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentDocument;
    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;">${innerHtml}</body></html>`);
    frameDoc.close();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const pageEl = frameDoc.getElementById('scheme-form-page');

    setIsGeneratingSchemeForm(true);
    try {
      const html2pdf = await loadHtml2Pdf();
      await html2pdf()
        .set({
          margin: 0,
          filename: `Scratch_Win_Customer_Acknowledgment_${bookingNumber || 'form'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page + .pdf-page', avoid: '.pdf-page' },
        })
        .from(pageEl)
        .save();
      showSuccess('Scheme form PDF downloaded!');
    } catch (err) {
      console.error('Scheme form PDF generation failed:', err);
      showError('Could not generate the scheme form PDF. Please try again.');
    } finally {
      document.body.removeChild(iframe);
      setIsGeneratingSchemeForm(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // TABLE RENDERER
  // ═══════════════════════════════════════════════════════════════════════════
  const renderBookingTable = (tabIndex) => {
    if (!canViewBookingInTab[tabIndex]) {
      const names = ['PENDING APPROVALS','APPROVED','PENDING ALLOCATED','ALLOCATED','REJECTED DISCOUNT','CANCELLED BOOKING','REJECTED CANCELLED BOOKING'];
      return <CAlert color="warning">You do not have permission to view the {names[tabIndex]} tab.</CAlert>;
    }

    const canCreate    = canPrintInTab[tabIndex];
    const canUploadKyc = () => [canUploadKycInPendingApprovals, canUploadKycInApprovedTab, false, canUploadKycInAllocatedTab, canUploadKycInRejectedDiscount][tabIndex] ?? false;
    const canUploadFin = () => [canUploadFinanceInPendingApprovals, canUploadFinanceInApprovedTab, false, canUploadFinanceInAllocatedTab, canUploadFinanceInRejectedDiscount][tabIndex] ?? false;
    const canEditThis  = () => tabIndex === 0 ? canEditInPendingApprovalsTab : tabIndex === 4 ? canEditInRejectedDiscountTab : false;
    const getDocumentUrl = path => `https://gmplmis.com/dealership-api/api/v1/uploads${path}`;

    if (tabIndex === TAB.CANCELLED || tabIndex === TAB.REJECTED_CANCELLED) {
      const raw      = tabIndex === TAB.CANCELLED ? cancelledPendingData : cancelledRejectedData;
      const filtered = getFilteredCancelled(raw);
      const page     = tabIndex === TAB.CANCELLED ? cancelledPendingPage  : cancelledRejectedPage;
      const setPage  = tabIndex === TAB.CANCELLED ? setCancelledPendingPage : setCancelledRejectedPage;
      const records  = getCancelledPage(filtered, page);

      return (
        <>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Contact</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Cancellation Reason</CTableHeaderCell>
                  <CTableHeaderCell>Requested At</CTableHeaderCell>
                  <CTableHeaderCell>Requested By</CTableHeaderCell>
                  <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
                  <CTableHeaderCell>Received Amount</CTableHeaderCell>
                  <CTableHeaderCell>Refund Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {tabIndex === TAB.REJECTED_CANCELLED && <CTableHeaderCell>Rejection Reason</CTableHeaderCell>}
                  <CTableHeaderCell>Options</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {records.length === 0 ? (
                  <CTableRow><CTableDataCell colSpan={13} className="text-center text-danger">No cancellation requests available</CTableDataCell></CTableRow>
                ) : records.map((c, i) => (
                  <CTableRow key={c._id || i}>
                    <CTableDataCell>{(page - 1) * cancelledLimit + i + 1}</CTableDataCell>
                    <CTableDataCell>{c.customer?.name  || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{c.customer?.phone || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{c.bookingDate ? new Date(c.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{c.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{c.cancellationRequest?.requestedAt ? new Date(c.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{c.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>₹{c.financials?.cancellationCharges || 0}</CTableDataCell>
                    <CTableDataCell>₹{c.financials?.received            || 0}</CTableDataCell>
                    <CTableDataCell>₹{c.financials?.refundAmount        || 0}</CTableDataCell>
                    <CTableDataCell><span className={`status-badge ${c.cancellationRequest?.status?.toLowerCase() || ''}`}>{c.cancellationRequest?.status || 'N/A'}</span></CTableDataCell>
                    {tabIndex === TAB.REJECTED_CANCELLED && <CTableDataCell>{c.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>}
                    <CTableDataCell>
                      {tabIndex === TAB.CANCELLED && (
                        <div className="d-flex gap-1">
                          <CButton size="sm" color="success" onClick={() => handleApproveCancellation(c)} disabled={!canApproveCancellation}><CIcon icon={cilCheck} /> Approve</CButton>
                          <CButton size="sm" color="danger"  onClick={() => handleRejectCancellation(c)}  disabled={!canRejectCancellation}><CIcon icon={cilX} /> Reject</CButton>
                        </div>
                      )}
                      {tabIndex === TAB.REJECTED_CANCELLED && (
                        <CButton size="sm" color="primary" onClick={() => handleOpenRestoreModal(c._id, 'cancelled')} disabled={!canRestoreFromRejectedCancelled}>Back to Normal</CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
          {renderCancelledPagination(filtered, page, setPage)}
        </>
      );
    }

    const td      = tabData[tabIndex];
    const records = td.docs;

    return (
      <>
        {td.loading && (
          <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
            <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
          </div>
        )}
        <div className="responsive-table-wrapper" style={{ opacity: td.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <CTable striped bordered hover className="responsive-table">
            <CTableHead>
              <CTableRow>
                {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Sr.no</CTableHeaderCell>}
                <CTableHeaderCell>Booking ID</CTableHeaderCell>
                <CTableHeaderCell>Model Name</CTableHeaderCell>
                {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Type</CTableHeaderCell>}
                <CTableHeaderCell>Color</CTableHeaderCell>
                <CTableHeaderCell>Fullname</CTableHeaderCell>
                {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Contact1</CTableHeaderCell>}
                {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Finance Letter</CTableHeaderCell>}
                {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Upload Finance</CTableHeaderCell>}
                {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Upload KYC</CTableHeaderCell>}
                <CTableHeaderCell>Status</CTableHeaderCell>
                {tabIndex === 0 && <CTableHeaderCell>Altration Request</CTableHeaderCell>}
                {tabIndex === 2 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
                {tabIndex === 2 && <CTableHeaderCell>Is Claim</CTableHeaderCell>}
                {tabIndex === 3 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
                {tabIndex === 3 && <CTableHeaderCell>Claim Documents</CTableHeaderCell>}
                {tabIndex === 3 && <CTableHeaderCell>Scheme</CTableHeaderCell>}
                {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Print</CTableHeaderCell>}
                {tabIndex === 2 && <CTableHeaderCell>Note</CTableHeaderCell>}
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {records.length === 0 && !td.loading ? (
                <CTableRow>
                  <CTableDataCell colSpan={21} className="text-center text-danger">
                    {td.search ? `No results found for "${td.search}"` : 'No booking available'}
                  </CTableDataCell>
                </CTableRow>
              ) : records.map((booking, index) => {
                const globalIndex = (td.currentPage - 1) * td.limit + index + 1;
                const bid = booking._id || booking.id;
                return (
                  <CTableRow key={bid}>
                    {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
                    <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                    <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
                    {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
                    <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
                    <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
                    {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}

                    {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
                      <CTableDataCell>
                        {booking.payment?.type === 'FINANCE' && canCreate && (
                          <CButton size="sm" className="view-button" onClick={() => handlePrint(bid)}>Print</CButton>
                        )}
                      </CTableDataCell>
                    )}

                    {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
                      <CTableDataCell>
                        {booking.payment?.type === 'FINANCE' && (
                          <>
                            {canUploadFin() && ['NOT_UPLOADED','REJECTED'].includes(booking.documentStatus?.financeLetter?.status) ? (
                              <Link to={`/upload-finance/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
                                <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></CButton>
                              </Link>
                            ) : null}
                            {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
                              <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.financeLetter?.status || ''}</span>
                            )}
                          </>
                        )}
                      </CTableDataCell>
                    )}

                    {tabIndex !== 2 && tabIndex !== 4 && (
                      <CTableDataCell>
                        {(booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' || booking.documentStatus?.kyc?.status === 'INCOMPLETE') ? (
                          <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
                            <CButton
                              size="sm"
                              className="upload-kyc-btn icon-only"
                              style={{
                                backgroundColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
                                borderColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
                                color: 'white'
                              }}
                            >
                              <CIcon icon={cilCloudUpload} />
                            </CButton>
                          </Link>
                        ) : (
                          <div className="d-flex align-items-center">
                            <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.kyc?.status || ''}</span>
                            {booking.documentStatus?.kyc?.status === 'REJECTED' && (
                              <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }} className="ms-2">
                                <button className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></button>
                              </Link>
                            )}
                          </div>
                        )}
                      </CTableDataCell>
                    )}

                    <CTableDataCell>
                      <span className="status-badge" style={{
                        backgroundColor:
                          booking.status === 'FREEZZED'                              ? '#ffc107' :
                          booking.status === 'PENDING_APPROVAL'                      ? '#0d6efd' :
                          booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'  ? '#fd7e14' :
                          booking.status === 'APPROVED'                              ? '#198754' :
                          booking.status === 'REJECTED'                              ? '#dc3545' :
                          booking.status === 'ALLOCATED'                             ? '#6f42c1' : '#6c757d',
                        color: booking.status === 'FREEZZED' ? '#000' : '#fff',
                        padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
                        fontWeight: '500', display: 'inline-block',
                      }}>
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
                        {booking.claimDetails?.hasClaim
                          ? <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
                          : <CIcon icon={cilXCircle}    className="status-icon inactive-icon" />}
                      </CTableDataCell>
                    )}

                    {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
                    {tabIndex === 3 && (
                      <CTableDataCell>
                        {booking.claimDetails?.hasClaim && booking.claimDetails?.documents?.length > 0 ? (
                          <CDropdown>
                            <CDropdownToggle size="sm" color="info" variant="outline">{booking.claimDetails.documents.length} Doc{booking.claimDetails.documents.length > 1 ? 's' : ''}</CDropdownToggle>
                            <CDropdownMenu>
                              {booking.claimDetails.documents.map((doc, di) => (
                                <CDropdownItem key={di} onClick={() => window.open(getDocumentUrl(doc.path), '_blank')}>
                                  <CIcon icon={cilDescription} className="me-2" />
                                  <strong>{doc.originalName || `Document ${di + 1}`}</strong>
                                  <small className="ms-2">{(doc.size / 1024).toFixed(2)} KB</small>
                                </CDropdownItem>
                              ))}
                            </CDropdownMenu>
                          </CDropdown>
                        ) : booking.claimDetails?.hasClaim
                          ? <span className="text-muted">No documents</span>
                          : <span className="text-muted">-</span>}
                      </CTableDataCell>
                    )}

                    {tabIndex === 3 && (
                      <CTableDataCell>
                        {booking.scheme === 'yes' ? (
                          <CDropdown>
                            <CDropdownToggle size="sm" color="success" variant="outline">
                              Scheme
                            </CDropdownToggle>
                            <CDropdownMenu>
                              {canUploadScratchCard && booking.status === 'ALLOCATED' && (
                                <CDropdownItem
                                  onClick={() => handleOpenScratchCardModal(booking)}
                                  style={{ color: 'black', cursor: 'pointer' }}
                                >
                                  <CIcon icon={cilCloudUpload} className="me-2" /> Upload Scratch Card
                                </CDropdownItem>
                              )}

                              {canViewBookingInTab[3] && booking.status === 'ALLOCATED' && (
                                <CDropdownItem
                                  onClick={() => handleViewScratchDocs(booking)}
                                  style={{ color: 'black', cursor: 'pointer' }}
                                >
                                  <CIcon icon={cilFile} className="me-2" /> View Scratch Docs
                                </CDropdownItem>
                              )}

                              <CDropdownItem
                                onClick={() => handleDownloadSchemeForm(booking)}
                                disabled={isGeneratingSchemeForm}
                                style={{
                                  color: 'black',
                                  cursor: isGeneratingSchemeForm ? 'not-allowed' : 'pointer',
                                  opacity: isGeneratingSchemeForm ? 0.6 : 1,
                                }}
                              >
                                {isGeneratingSchemeForm ? (
                                  <>
                                    <CSpinner size="sm" className="me-2" /> Preparing PDF…
                                  </>
                                ) : (
                                  <>
                                    <CIcon icon={cilDescription} className="me-2" /> Download Scheme Form
                                  </>
                                )}
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                    )}

                    {tabIndex !== 2 && tabIndex !== 4 && (
                      <CTableDataCell>
                        {booking.formPath && (
                          user?.is_sales_executive && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
                            <span className="awaiting-approval-text">Awaiting for Approval</span>
                          ) : canCreate ? (
                            <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
                              <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilPrint} /></CButton>
                            </a>
                          ) : null
                        )}
                      </CTableDataCell>
                    )}

                    {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}

                    <CTableDataCell>
                      <CButton size="sm" className="option-button btn-sm" onClick={e => handleClick(e, bid)}>
                        <CIcon icon={cilSettings} /> Options
                      </CButton>
                      <Menu id={`action-menu-${bid}`} anchorEl={anchorEl} open={menuId === bid} onClose={handleClose}>
                        {canViewBookingInTab[tabIndex] && (
                          <MenuItem onClick={() => handleViewBooking(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Booking</MenuItem>
                        )}
                        {tabIndex === 0 && booking.updateRequestStatus === 'PENDING' && canViewBookingInTab[0] && (
                          <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Altration Req</MenuItem>
                        )}
                        {canEditThis() && tabIndex === 4 && canRestoreFromRejectedDiscount && (
                          <MenuItem onClick={() => handleOpenRestoreModal(bid, 'rejected_discount')} style={{ color: 'black' }}><CIcon icon={cilCheck} className="me-2" /> Back to Normal</MenuItem>
                        )}
                        {canEditThis() && tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
                          <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
                            <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
                          </Link>
                        )}
                        {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
                          <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
                            <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
                          </Link>
                        )}
                        {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
                          <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
                        )}
                        {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
                          <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
                        )}

                        {tabIndex === 0 && canSwapVehicleInPendingApprovals && (
                          <MenuItem onClick={() => handleOpenSwapVehicle(bid)} style={{ color: 'black' }}>
                            <CIcon icon={cilSwapHorizontal} className="me-2" /> Swap Vehicle
                          </MenuItem>
                        )}
                        {tabIndex === 1 && canSwapVehicleInApprovedTab && (
                          <MenuItem onClick={() => handleOpenSwapVehicle(bid)} style={{ color: 'black' }}>
                            <CIcon icon={cilSwapHorizontal} className="me-2" /> Swap Vehicle
                          </MenuItem>
                        )}

                        {tabIndex === 0 && booking.payment?.type === 'FINANCE' && canViewBookingInTab[0] && (
                          <MenuItem onClick={() => handleViewFinanceLetterReceipt(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilDescription} className="me-2" /> View Finance Letter Receipt</MenuItem>
                        )}
                        {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewBookingInTab[tabIndex] && (
                          <MenuItem onClick={() => handleViewFinanceLetter(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter</MenuItem>
                        )}
                        {canViewBookingInTab[tabIndex] && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
                          <MenuItem onClick={() => handleViewKYC(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View KYC</MenuItem>
                        )}
                        {tabIndex === 1 && canAllocateChassisInApprovedTab && booking.status === 'APPROVED' && (booking.payment?.type === 'CASH' || (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status === 'APPROVED')) && (
                          <MenuItem onClick={() => handleAllocateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Allocate Chassis</MenuItem>
                        )}
                        {tabIndex === 3 && canUpdateChassisInAllocatedTab && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
                          <MenuItem onClick={() => handleUpdateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Change Vehicle</MenuItem>
                        )}
                        {tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
                          <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
                            <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
                          </Link>
                        )}
                        {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
                          <>
                            {canApproveChassis && <MenuItem onClick={() => handleApproveChassis(bid)} style={{ color: 'green' }}><CIcon icon={cilCheck} className="me-2" /> Approve Chassis</MenuItem>}
                            {canRejectChassis  && <MenuItem onClick={() => handleRejectChassis(bid)}  style={{ color: 'red'   }}><CIcon icon={cilX}     className="me-2" /> Reject Chassis</MenuItem>}
                          </>
                        )}
                        {tabIndex === 1 && booking.status === 'APPROVED' && canViewBookingInTab[1] && (
                          <MenuItem onClick={() => handleOpenAvailableDocs(bid)} style={{ color: 'black' }}><CIcon icon={cilFile} className="me-2" /> Available Documents</MenuItem>
                        )}
                        {tabIndex === 0 && booking.status === 'FREEZZED' && canViewBookingInTab[0] && (
                          <MenuItem onClick={() => window.location.href = '/#/self-insurance'} style={{ color: 'black' }}><CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance</MenuItem>
                        )}
                      </Menu>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </div>
        {renderPagination(tabIndex)}
      </>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LOADING / PERMISSION GUARDS
  // ═══════════════════════════════════════════════════════════════════════════
  if (!canViewAnyTab) {
    return <div className="alert alert-danger m-3">You do not have permission to view any tabs in All Booking.</div>;
  }

  const currentSearch = activeTab >= TAB.CANCELLED ? cancelledSearch : localSearch;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div>
      <div className="title">Booking List</div>
      {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            {canCreateAllBooking && (
              <Link to="/new-booking">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className="icon" /> New Booking
                </CButton>
              </Link>
            )}
          </div>

          {/* ── Global Search (inline) ── */}
          <div className="d-flex align-items-center gap-2">
            <CFormLabel className="mb-0 text-nowrap" style={{ fontSize: '14px' }}>
              Global Search:
            </CFormLabel>
            <input
              ref={globalSearchInputRef}
              type="text"
              defaultValue=""
              style={{
                maxWidth: '320px',
                height: '30px',
                borderRadius: '0',
                border: '1px solid #ced4da',
                padding: '0 8px',
                outline: 'none',
                fontSize: '14px',
              }}
              className="d-inline-block square-search"
              onChange={e => handleGlobalSearchChange(e.target.value)}
              placeholder="Search Booking ID / Customer in all tabs…"
              autoComplete="off"
            />
          </div>
        </CCardHeader>

        <CCardBody>
          {/* ── Tab nav ── */}
          <CNav variant="tabs" className="mb-3 border-bottom">
            {[
              [TAB.PENDING,            'Pending Approvals',  canViewPendingApprovalsTab],
              [TAB.APPROVED,           'Approved',           canViewApprovedTab],
              [TAB.PENDING_ALLOCATED,  'Pending Allocated',  canViewPendingAllocatedTab],
              [TAB.ALLOCATED,          'Allocated',          canViewAllocatedTab],
              [TAB.REJECTED,           'Rejected Discount',  canViewRejectedDiscountTab],
              [TAB.CANCELLED,          'Cancelled Booking',  canViewCancelledBookingTab],
              [TAB.REJECTED_CANCELLED, 'Rejected Cancelled', canViewRejectedCancelledBookingTab],
            ].map(([idx, label, perm]) => perm && (
              <CNavItem key={idx}>
                <CNavLink
                  active={activeTab === idx}
                  onClick={() => handleTabChange(idx)}
                  style={{ cursor: 'pointer', borderTop: activeTab === idx ? '4px solid #2759a2' : '3px solid transparent', borderBottom: 'none', color: 'black' }}
                >
                  {label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          {/* ── Per-tab search bar ── */}
          <div className="d-flex justify-content-end mb-3">
            <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
            <input
              ref={searchInputRef}
              type="text"
              defaultValue=""
              style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
              className="d-inline-block square-search"
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by Booking ID or Customer Name..."
              autoComplete="off"
            />
          </div>

          {/* ── Tab content ── */}
          <CTabContent>
            {[TAB.PENDING, TAB.APPROVED, TAB.PENDING_ALLOCATED, TAB.ALLOCATED, TAB.REJECTED].map(idx =>
              canViewBookingInTab[idx] && (
                <CTabPane key={idx} visible={activeTab === idx}>
                  {activeTab === idx && renderBookingTable(idx)}
                </CTabPane>
              )
            )}
            {canViewCancelledBookingTab && (
              <CTabPane visible={activeTab === TAB.CANCELLED}>
                {activeTab === TAB.CANCELLED && (
                  cancelledLoading
                    ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
                    : renderBookingTable(TAB.CANCELLED)
                )}
              </CTabPane>
            )}
            {canViewRejectedCancelledBookingTab && (
              <CTabPane visible={activeTab === TAB.REJECTED_CANCELLED}>
                {activeTab === TAB.REJECTED_CANCELLED && (
                  cancelledLoading
                    ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
                    : renderBookingTable(TAB.REJECTED_CANCELLED)
                )}
              </CTabPane>
            )}
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* ═══ MODALS ═══ */}

      {/* Export */}
      <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
        <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Export Excel Report</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="mb-3"><CFormLabel>Start Date:</CFormLabel><CFormInput type="date" value={exportDateRange.startDate} onChange={e => setExportDateRange(p => ({ ...p, startDate: e.target.value }))} /></div>
          <div className="mb-3"><CFormLabel>End Date:</CFormLabel><CFormInput type="date" value={exportDateRange.endDate} onChange={e => setExportDateRange(p => ({ ...p, endDate: e.target.value }))} min={exportDateRange.startDate} /></div>
          <CAlert color="info"><small>This will export the branch sales report for the selected date range.</small></CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowExportModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleExportConfirm} disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}>
            {exportLoading ? <><CSpinner size="sm" className="me-2" />Exporting…</> : 'Export Excel'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Restore */}
      <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
        <CModalHeader><CModalTitle>Restore Booking to Normal</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="mb-3"><CFormLabel>Reason:</CFormLabel><CFormTextarea value={restoreReason} onChange={e => setRestoreReason(e.target.value)} rows={2} placeholder="Enter reason" /></div>
          <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={restoreNotes} onChange={e => setRestoreNotes(e.target.value)} rows={2} /></div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleRestoreBooking} disabled={restoreLoading}>
            {restoreLoading ? <><CSpinner size="sm" className="me-2" />Processing…</> : 'Restore Booking'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Available Docs */}
      <CModal visible={availableDocsModal} onClose={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }} size="lg">
        <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Available Documents - {availableTemplates?.booking_number || ''}</CModalTitle></CModalHeader>
        <CModalBody>
          {loadingTemplates ? (
            <div className="text-center py-5"><CSpinner color="primary" /><p className="mt-3">Loading…</p></div>
          ) : availableTemplates ? (
            <div>
              <h6>Customer: {availableTemplates.customer_name}</h6>
              <div className="alert alert-info mb-3"><small><strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} available.</small></div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Templates ({availableTemplates.available_templates.count})</h6>
                <div className="d-flex gap-2">
                  <CButton size="sm" color="primary" variant="outline" onClick={handleSelectAllAvailable}>Select All</CButton>
                  <CButton size="sm" color="secondary" variant="outline" onClick={() => setSelectedTemplateIds([])}>Clear All</CButton>
                </div>
              </div>
              <div className="border rounded p-3">
                {(availableTemplates.available_templates.templates || []).map(t => (
                  <div key={t.template_id} className="mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id={`tpl-${t.template_id}`} checked={selectedTemplateIds.includes(t.template_id)} onChange={() => handleTemplateSelection(t.template_id, t.can_download)} disabled={!t.can_download} />
                      <label className="form-check-label d-flex justify-content-between align-items-center w-100" htmlFor={`tpl-${t.template_id}`} style={{ cursor: t.can_download ? 'pointer' : 'not-allowed', opacity: t.can_download ? 1 : 0.6 }}>
                        <div><strong>{t.template_name}</strong><br /><small className="text-muted">{t.can_download ? 'Available' : 'Not available'}</small></div>
                        {!t.can_download && <small className="text-danger"><CIcon icon={cilXCircle} className="me-1" />Disabled</small>}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={templateNotes} onChange={e => setTemplateNotes(e.target.value)} rows={2} /></div>
            </div>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }}>Cancel</CButton>
          <CButton color="primary" onClick={handleSubmitTemplateSelection} disabled={!selectedTemplateIds.length || submittingSelection}>
            {submittingSelection ? <><CSpinner size="sm" className="me-2" />Processing…</> : `Select (${selectedTemplateIds.length}) Templates`}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Cancellation Approval */}
      <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
        <CModalHeader><CModalTitle>{cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation' : 'Reject Cancellation'}</CModalTitle></CModalHeader>
        <CModalBody>
          {cancelApprovalAction === 'APPROVE' ? (
            <>
              <div className="mb-3"><CFormLabel>Original Reason:</CFormLabel><CFormInput type="text" value={selectedCancellationForApproval?.cancellationRequest?.reason || ''} readOnly /></div>
              <div className="mb-3"><CFormLabel>Edited Reason (Optional):</CFormLabel><CFormTextarea value={editedReason} onChange={e => setEditedReason(e.target.value)} rows={2} /></div>
              <div className="mb-3"><CFormLabel>Cancellation Charges:</CFormLabel><CFormInput type="number" value={cancellationCharges} onChange={e => setCancellationCharges(Number(e.target.value))} min="0" /></div>
              <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
            </>
          ) : (
            <>
              <div className="mb-3"><CFormLabel>Rejection Reason:</CFormLabel><CFormTextarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={2} /></div>
              <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleCancelActionSubmit} disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}>
            {cancelActionLoading ? <CSpinner size="sm" /> : cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Chassis Approval */}
      <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
        <CModalHeader><CModalTitle>{approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="mb-3"><CFormLabel>{approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}</CFormLabel><CFormTextarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={3} /></div>
        </CModalBody>
        <CModalFooter>
          <CButton className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleChassisApprovalSubmit} disabled={approvalLoading}>
            {approvalLoading ? <CSpinner size="sm" /> : approvalAction === 'APPROVE' ? 'Approve' : 'Reject'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Scratch Card Upload Modal */}
      <CModal visible={scratchCardModal} onClose={() => setScratchCardModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilCloudUpload} className="me-2" />
            Upload Scratch Card
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Booking ID:</CFormLabel>
            <CFormInput
              type="text"
              value={selectedBookingForScratch?.bookingNumber || ''}
              readOnly
            />
          </div>

          <div className="mb-3">
            <CFormLabel>
              Scheme <span className="text-danger">*</span>
            </CFormLabel>
            <CFormSelect
              value={scratchCardForm.scheme}
              onChange={e => handleScratchCardFormChange('scheme', e.target.value)}
              disabled={schemesLoading}
            >
              <option value="">{schemesLoading ? 'Loading schemes...' : 'Select Scheme'}</option>
              {schemes.map(s => (
                <option key={s._id} value={s._id}>
                  {s.scheme_name}
                </option>
              ))}
            </CFormSelect>
            {scratchCardErrors.scheme && (
              <small className="text-danger">{scratchCardErrors.scheme}</small>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel>
              Scratch Card Amount <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              type="number"
              min="0"
              value={scratchCardForm.scratch_card_amount}
              onChange={e => handleScratchCardFormChange('scratch_card_amount', e.target.value)}
              placeholder="Enter amount"
            />
            {scratchCardErrors.scratch_card_amount && (
              <small className="text-danger">{scratchCardErrors.scratch_card_amount}</small>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel>
              Scratch Card Document <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              type="file"
              accept="image/*,.pdf"
              onChange={e => handleScratchCardFileChange('scratch_card_document', e.target.files[0])}
            />
            {scratchCardErrors.scratch_card_document && (
              <small className="text-danger">{scratchCardErrors.scratch_card_document}</small>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel>
              Scheme Document <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              type="file"
              accept="image/*,.pdf"
              onChange={e => handleScratchCardFileChange('scheme_document', e.target.files[0])}
            />
            {scratchCardErrors.scheme_document && (
              <small className="text-danger">{scratchCardErrors.scheme_document}</small>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setScratchCardModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSubmitScratchCard}
            disabled={scratchCardLoading || schemesLoading}
          >
            {scratchCardLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Scratch Docs Modal */}
      <CModal
        visible={viewScratchModal}
        onClose={() => { setViewScratchModal(false); setSelectedBookingForViewScratch(null); setScratchDocsData(null); }}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilFile} className="me-2" />
            Scratch Card Documents
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {scratchDocsLoading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading scratch card documents…</p>
            </div>
          ) : !scratchDocsData ? (
            <CAlert color="warning">No scratch card data available.</CAlert>
          ) : (
            <>
              <div className="mb-3 p-3 border rounded bg-light">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong>Booking ID:</strong> {scratchDocsData.booking?.bookingNumber || 'N/A'}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Customer:</strong> {scratchDocsData.booking?.customerName || 'N/A'}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Status:</strong>{' '}
                    <span className="status-badge">{scratchDocsData.booking?.status || 'N/A'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Total Scratch Card Amount:</strong>{' '}
                    <span className="text-success fw-bold">
                      ₹{(scratchDocsData.totalScratchCardAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {(!scratchDocsData.scratchCards || scratchDocsData.scratchCards.length === 0) ? (
                <CAlert color="info">No scratch cards found for this booking.</CAlert>
              ) : (
                <div className="table-responsive">
                  <CTable striped bordered hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Sr.no</CTableHeaderCell>
                        <CTableHeaderCell>Scheme</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Created By</CTableHeaderCell>
                        <CTableHeaderCell>Created At</CTableHeaderCell>
                        <CTableHeaderCell>Scratch Card Doc</CTableHeaderCell>
                        <CTableHeaderCell>Scheme Doc</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {scratchDocsData.scratchCards.map((card, i) => (
                        <CTableRow key={card._id || i}>
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>{card.schemeDetails?.scheme_name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>₹{(card.scratch_card_amount || 0).toLocaleString('en-IN')}</CTableDataCell>
                          <CTableDataCell>
                            <span className={`status-badge ${card.status?.toLowerCase() || ''}`}>
                              {card.status || 'N/A'}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{card.createdByDetails?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            {card.createdAt ? new Date(card.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {card.scratch_card_document?.path ? (
                              <CButton
                                size="sm"
                                color="primary"
                                variant="outline"
                                onClick={() => window.open(getScratchDocUrl(card.scratch_card_document.path), '_blank')}
                              >
                                <CIcon icon={cilFile} className="me-1" />
                                {card.scratch_card_document.originalName || 'View'}
                              </CButton>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {card.scheme_document?.path ? (
                              <CButton
                                size="sm"
                                color="primary"
                                variant="outline"
                                onClick={() => window.open(getScratchDocUrl(card.scheme_document.path), '_blank')}
                              >
                                <CIcon icon={cilFile} className="me-1" />
                                {card.scheme_document.originalName || 'View'}
                              </CButton>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => { setViewScratchModal(false); setSelectedBookingForViewScratch(null); setScratchDocsData(null); }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Sub-components */}
      <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={refreshCurrentTab} />
      <KYCView open={kycModalVisible} onClose={() => { setKycModalVisible(false); setKycBookingId(null); }} kycData={kycData} refreshData={refreshCurrentTab} bookingId={kycBookingId} />
      <FinanceView open={financeModalVisible} onClose={() => { setFinanceModalVisible(false); setFinanceBookingId(null); }} financeData={financeData} refreshData={refreshCurrentTab} bookingId={financeBookingId} />
      <ChassisNumberModal show={showChassisModal} onClose={() => { setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError(''); }} onSave={handleSaveChassisNumber} isLoading={chassisLoading} booking={tabData[activeTab]?.docs?.find(b => b._id === selectedBookingForChassis || b.id === selectedBookingForChassis)} isUpdate={isUpdateChassis} errorMessage={chassisError} onClearError={() => setChassisError('')} />

      <SwapVehicleModal
        show={swapVehicleModal}
        onClose={() => { setSwapVehicleModal(false); setSelectedBookingForSwap(null); setSwapVehicleError(''); }}
        onSave={handleSwapVehicleSubmit}
        isLoading={swapVehicleLoading}
        booking={selectedBookingForSwap}
        errorMessage={swapVehicleError}
        onClearError={() => setSwapVehicleError('')}
      />

      <PrintModal show={printModalVisible} onClose={() => { setPrintModalVisible(false); setSelectedBookingForPrint(null); }} bookingId={selectedBookingForPrint} />
      <PendingUpdateDetailsModal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} updateData={selectedUpdate} onApprove={payload => handleApproveUpdate(selectedUpdate._id, payload)} onReject={payload => handleRejectUpdate(selectedUpdate._id, payload)} />
    </div>
  );
};

export default BookingList;




// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Link, Menu, MenuItem,
//   getDefaultSearchFields, useTableFilter, usePagination,
//   showError, axiosInstance, showSuccess, confirmDelete,
// } from '../../../utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import {
//   cilCloudUpload, cilPrint, cilPlus, cilSettings, cilPencil, cilTrash,
//   cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle, cilFile,
//   cilChevronLeft, cilChevronRight, cilDescription,
// } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import {
//   CNav, CNavItem, CNavLink, CTabContent, CTabPane,
//   CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
//   CCard, CCardBody, CCardHeader,
//   CButton, CFormInput, CSpinner, CFormLabel,
//   CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
//   CFormTextarea, CAlert, CPagination, CPaginationItem, CFormSelect,
//   CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
// import {
//   hasSafePagePermission, MODULES, PAGES, TABS, ACTIONS,
//   canViewPage, canCreateInPage, canUpdateInPage, canDeleteInPage,
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// // ─── Tab constants ─────────────────────────────────────────────────────────────
// const TAB = {
//   PENDING: 0, APPROVED: 1, PENDING_ALLOCATED: 2,
//   ALLOCATED: 3, REJECTED: 4, CANCELLED: 5, REJECTED_CANCELLED: 6,
// };

// const TAB_STATUSES = {
//   [TAB.PENDING]:           ['PENDING_APPROVAL', 'PENDING_APPROVAL (Discount_Exceeded)', 'FREEZZED'],
//   [TAB.APPROVED]:          ['APPROVED'],
//   [TAB.PENDING_ALLOCATED]: ['ON_HOLD', 'PENDING_GM_APPROVAL'],
//   [TAB.ALLOCATED]:         ['ALLOCATED'],
//   [TAB.REJECTED]:          ['REJECTED'],
// };

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT     = 50;

// const emptyTab = () => ({
//   docs: [], total: 0, pages: 0, currentPage: 1,
//   limit: DEFAULT_LIMIT, loading: false, search: '',
// });

// // ─── Component ─────────────────────────────────────────────────────────────────
// const BookingList = () => {
//   const [anchorEl, setAnchorEl]   = useState(null);
//   const [menuId, setMenuId]       = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate]     = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [error, setError]                       = useState(null);

//   // ── Separate local search state — NEVER tied to async tabData ──
//   const [localSearch, setLocalSearch] = useState('');

//   // Per-tab paginated state
//   const [tabData, setTabData] = useState(() =>
//     Object.values(TAB).reduce((acc, i) => { acc[i] = emptyTab(); return acc; }, {})
//   );

//   // Cancellation tabs (separate API)
//   const [cancelledPendingData,  setCancelledPendingData]  = useState([]);
//   const [cancelledRejectedData, setCancelledRejectedData] = useState([]);
//   const [cancelledPendingPage,  setCancelledPendingPage]  = useState(1);
//   const [cancelledRejectedPage, setCancelledRejectedPage] = useState(1);
//   const [cancelledLimit,        setCancelledLimit]        = useState(DEFAULT_LIMIT);
//   const [cancelledLoading,      setCancelledLoading]      = useState(false);
//   const [cancelledSearch,       setCancelledSearch]       = useState('');

//   // Debounce timer ref
//   const searchTimer = useRef(null);

//   // ── Stable ref for search input so it NEVER loses focus on re-render ──
//   const searchInputRef = useRef(null);

//   // Export modal
//   const [exportLoading,   setExportLoading]   = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate:   new Date().toISOString().split('T')[0],
//   });

//   // Chassis approval
//   const [chassisApprovalModal,       setChassisApprovalModal]       = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction,             setApprovalAction]             = useState('');
//   const [approvalNote,               setApprovalNote]               = useState('');
//   const [approvalLoading,            setApprovalLoading]            = useState(false);

//   // Cancellation approval
//   const [cancelApprovalModal,             setCancelApprovalModal]             = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction,            setCancelApprovalAction]            = useState('');
//   const [editedReason,                    setEditedReason]                    = useState('');
//   const [cancellationCharges,             setCancellationCharges]             = useState(0);
//   const [notes,                           setNotes]                           = useState('');
//   const [rejectionReason,                 setRejectionReason]                 = useState('');
//   const [cancelActionLoading,             setCancelActionLoading]             = useState(false);

//   // Chassis modal
//   const [showChassisModal,          setShowChassisModal]          = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading,            setChassisLoading]            = useState(false);
//   const [isUpdateChassis,           setIsUpdateChassis]           = useState(false);
//   const [chassisError,              setChassisError]              = useState('');

//   // Available docs modal
//   const [availableDocsModal,     setAvailableDocsModal]     = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates,     setAvailableTemplates]     = useState(null);
//   const [loadingTemplates,       setLoadingTemplates]       = useState(false);
//   const [selectedTemplateIds,    setSelectedTemplateIds]    = useState([]);
//   const [templateNotes,          setTemplateNotes]          = useState('');
//   const [submittingSelection,    setSubmittingSelection]    = useState(false);

//   // Restore
//   const [restoreBookingModal,    setRestoreBookingModal]    = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason,          setRestoreReason]          = useState('');
//   const [restoreNotes,           setRestoreNotes]           = useState('');
//   const [restoreLoading,         setRestoreLoading]         = useState(false);
//   const [restoreType,            setRestoreType]            = useState('');

//   // View / KYC / Finance / Print
//   const [viewModalVisible,        setViewModalVisible]        = useState(false);
//   const [selectedBooking,         setSelectedBooking]         = useState(null);
//   const [kycModalVisible,         setKycModalVisible]         = useState(false);
//   const [kycBookingId,            setKycBookingId]            = useState(null);
//   const [kycData,                 setKycData]                 = useState(null);
//   const [financeModalVisible,     setFinanceModalVisible]     = useState(false);
//   const [financeBookingId,        setFinanceBookingId]        = useState(null);
//   const [financeData,             setFinanceData]             = useState(null);
//   const [printModalVisible,       setPrintModalVisible]       = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [actionLoadingId,         setActionLoadingId]         = useState(null);
//   const [loadingId,               setLoadingId]               = useState(null);

//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PERMISSIONS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const canViewPendingApprovalsTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canViewApprovedTab                     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.APPROVED);
//   const canViewPendingAllocatedTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canViewAllocatedTab                    = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.ALLOCATED);
//   const canViewRejectedDiscountTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canViewCancelledBookingTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canViewRejectedCancelledBookingTab     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canCreateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canCreateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.APPROVED);
//   const canCreateInPendingAllocatedTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canCreateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canCreateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canCreateInCancelledBookingTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canUpdateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canUpdateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.APPROVED);
//   const canUpdateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canUpdateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canDeleteInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canDeleteInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);

//   const canApproveChassis               = canCreateInPendingAllocatedTab;
//   const canRejectChassis                = canCreateInPendingAllocatedTab;
//   const canApproveCancellation          = canCreateInCancelledBookingTab;
//   const canRejectCancellation           = canCreateInCancelledBookingTab;
//   const canRestoreFromRejectedDiscount  = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
//   const canApproveUpdate                = canCreateInPendingApprovalsTab;
//   const canRejectUpdate                 = canCreateInPendingApprovalsTab;
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
//   const canUpdateChassisInAllocatedTab  = canCreateInAllocatedTab;
//   const canEditInPendingApprovalsTab    = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab    = canUpdateInRejectedDiscountTab;
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
//   const canUploadKycInPendingApprovals     = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab          = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab         = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount     = canCreateInRejectedDiscountTab;
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab      = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab     = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;

//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab, 1: canCreateInApprovedTab,
//     2: canCreateInPendingAllocatedTab, 3: canCreateInAllocatedTab,
//     4: canCreateInRejectedDiscountTab, 5: canCreateInCancelledBookingTab,
//     6: canCreateInRejectedCancelledBookingTab,
//   };
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,     1: canViewApprovedTab,
//     2: canViewPendingAllocatedTab,     3: canViewAllocatedTab,
//     4: canViewRejectedDiscountTab,     5: canViewCancelledBookingTab,
//     6: canViewRejectedCancelledBookingTab,
//   };
//   const canViewAnyTab     = Object.values(canViewBookingInTab).some(Boolean);
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // HELPER — update a single tab's state slice
//   // ═══════════════════════════════════════════════════════════════════════════
//   const setTab = useCallback((tabIndex, updates) =>
//     setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
//   []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CORE FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
// const fetchTab = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
//   if (tabIndex >= TAB.CANCELLED) return;
//   setTab(tabIndex, { loading: true });

//   try {
//     const statuses  = TAB_STATUSES[tabIndex];
//     const trimmed   = search ? search.trim() : '';

//     if (statuses.length === 1) {
//       const params = { 
//         bookingType: 'BRANCH', 
//         status: statuses[0], 
//         page, 
//         limit 
//       };
      
//       // Only add search params if there's a search term
//       if (trimmed) {
//         params.search = trimmed;
//         // Restrict search to booking ID and customer name only
//         params.searchFields = 'bookingNumber,customerDetails.name';
//       }

//       const res = await axiosInstance.get('/bookings', { params });
//       const d   = res.data.data;

//       setTab(tabIndex, {
//         docs:        d.bookings || [],
//         total:       d.total    || 0,
//         pages:       d.pages    || 1,
//         currentPage: page,
//         limit,
//         loading:     false,
//         search,
//         _allDocs:    undefined,
//       });

//     } else {
//       // For tabs with multiple statuses
//       const responses = await Promise.all(
//         statuses.map(status => {
//           const params = { 
//             bookingType: 'BRANCH', 
//             status, 
//             page: 1, 
//             limit: 200 
//           };
          
//           if (trimmed) {
//             params.search = trimmed;
//             // Restrict search to booking ID and customer name only
//             params.searchFields = 'bookingNumber,customerDetails.name';
//           }
          
//           return axiosInstance.get('/bookings', { params });
//         })
//       );

//       let allDocs = [];
//       responses.forEach(r => {
//         allDocs = allDocs.concat(r.data.data.bookings || []);
//       });

//       // Remove duplicates
//       const seen = new Set();
//       allDocs = allDocs.filter(d => {
//         const id = String(d._id);
//         if (seen.has(id)) return false;
//         seen.add(id);
//         return true;
//       });

//       // If there's a search term, apply client-side filtering as fallback
//       // This ensures we only keep results that match booking ID or customer name
//       if (trimmed) {
//         const searchLower = trimmed.toLowerCase();
//         allDocs = allDocs.filter(booking => {
//           const bookingNumber = (booking.bookingNumber || '').toLowerCase();
//           const customerName = (booking.customerDetails?.name || '').toLowerCase();
          
//           return bookingNumber.includes(searchLower) || customerName.includes(searchLower);
//         });
//       }

//       allDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       const total    = allDocs.length;
//       const pages    = Math.max(1, Math.ceil(total / limit));
//       const safePage = Math.min(Math.max(1, page), pages);
//       const start    = (safePage - 1) * limit;
//       const docs     = allDocs.slice(start, start + limit);

//       setTab(tabIndex, {
//         docs, total, pages,
//         currentPage: safePage,
//         limit, loading: false, search,
//         _allDocs: allDocs,
//       });
//     }
//   } catch (err) {
//     console.error(`[fetchTab] tab ${tabIndex}`, err);
//     showError(err);
//     setTab(tabIndex, { loading: false });
//   }
// }, [setTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const fetchCancellationData = useCallback(async () => {
//     try {
//       setCancelledLoading(true);
//       const [pRes, rRes] = await Promise.all([
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'PENDING'  } }),
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'REJECTED' } }),
//       ]);
//       setCancelledPendingData(pRes.data.data  || []);
//       setCancelledRejectedData(rRes.data.data || []);
//     } catch (err) { showError(err); }
//     finally { setCancelledLoading(false); }
//   }, []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LIFECYCLE
//   // ═══════════════════════════════════════════════════════════════════════════
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
//     fetchTab(activeTab, 1, DEFAULT_LIMIT);
//     fetchCancellationData();
//   }, []);

//   useEffect(() => {
//     if (!canViewAnyTab) return;
//     const visible = [0,1,2,3,4,5,6].filter(i => canViewBookingInTab[i]);
//     if (visible.length > 0 && !visible.includes(activeTab)) setActiveTab(visible[0]);
//   }, [canViewAnyTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // REFRESH after mutations
//   // ═══════════════════════════════════════════════════════════════════════════
//   const refreshCurrentTab = useCallback(() => {
//     if (activeTab < TAB.CANCELLED) {
//       // Preserve current limit but reset everything else including search
//       const limit = tabData[activeTab].limit || DEFAULT_LIMIT;
//       // Reset tab to empty (clears search string, docs, pagination)
//       setTab(activeTab, { ...emptyTab(), limit });
//       // Clear local search display state
//       setLocalSearch('');
//       // Clear the uncontrolled DOM input value
//       if (searchInputRef.current) searchInputRef.current.value = '';
//       // Fetch fresh data with no search
//       fetchTab(activeTab, 1, limit, '');
//     } else {
//       fetchCancellationData();
//     }
//   }, [activeTab, tabData, setTab, fetchTab, fetchCancellationData, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TAB CHANGE — always fetch fresh with empty search when switching tabs
//   // FIX: Previously tabs kept stale search results when revisited because
//   //      fetchTab was only called if docs.length === 0. Now we ALWAYS
//   //      re-fetch with empty search on every tab switch, so coming back
//   //      to a previously-searched tab shows the full unfiltered list.
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleTabChange = useCallback((tab) => {
//     // Cancel any pending debounced search for the tab we're leaving
//     clearTimeout(searchTimer.current);

//     setActiveTab(tab);

//     // Clear local search display state
//     setLocalSearch('');

//     // Clear the uncontrolled DOM input value
//     if (searchInputRef.current) searchInputRef.current.value = '';

//     if (tab < TAB.CANCELLED) {
//       setTabData(prev => {
//         const td    = prev[tab];
//         const limit = td.limit || DEFAULT_LIMIT;

//         // Reset the tab's search string immediately so the "No results for X"
//         // empty-state message never flashes when returning to the tab
//         const resetTab = { ...td, search: '' };

//         // Always re-fetch fresh data with no search filter when switching tabs.
//         // Using setTimeout(0) so the state update above is flushed first.
//         setTimeout(() => fetchTab(tab, 1, limit, ''), 0);

//         return { ...prev, [tab]: resetTab };
//       });
//     }
//     // Cancellation tabs (5 & 6) don't need a re-fetch here;
//     // their data is already loaded and they do client-side filtering only.
//   }, [fetchTab, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handlePageChange = useCallback((tabIndex, newPage) => {
//     if (newPage < 1) return;
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (newPage > td.pages) return prev;

//       if (td._allDocs) {
//         const start = (newPage - 1) * td.limit;
//         const docs  = td._allDocs.slice(start, start + td.limit);
//         return { ...prev, [tabIndex]: { ...td, docs, currentPage: newPage } };
//       } else {
//         fetchTab(tabIndex, newPage, td.limit, td.search);
//         return prev;
//       }
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ROWS PER PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleLimitChange = useCallback((tabIndex, newLimit) => {
//     const limit = parseInt(newLimit, 10);
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (td._allDocs) {
//         const pages = Math.max(1, Math.ceil(td._allDocs.length / limit));
//         return { ...prev, [tabIndex]: { ...td, docs: td._allDocs.slice(0, limit), limit, currentPage: 1, pages } };
//       } else {
//         fetchTab(tabIndex, 1, limit, td.search);
//         return prev;
//       }
//     });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // SEARCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const activeTabRef = useRef(activeTab);
//   useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

//   const handleSearch = useCallback((value) => {
//     if (activeTabRef.current >= TAB.CANCELLED) {
//       setCancelledSearch(value);
//       setCancelledPendingPage(1);
//       setCancelledRejectedPage(1);
//       return;
//     }

//     setLocalSearch(value);

//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       const tab = activeTabRef.current;
//       setTabData(prev => {
//         const limit = prev[tab]?.limit || DEFAULT_LIMIT;
//         fetchTab(tab, 1, limit, value);
//         return prev;
//       });
//     }, 500);
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION CLIENT-SIDE FILTER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const getFilteredCancelled = useCallback((data) => {
//   if (!cancelledSearch) return data;
//   const t = cancelledSearch.toLowerCase();
//   return data.filter(c =>
//     // Only search by customer name for cancellation tabs (booking ID not available)
//     (c.customer?.name || '').toLowerCase().includes(t)
//   );
// }, [cancelledSearch]);

//   const getCancelledPage = useCallback((data, page) => {
//     const start = (page - 1) * cancelledLimit;
//     return data.slice(start, start + cancelledLimit);
//   }, [cancelledLimit]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGINATION RENDERERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderPagination = (tabIndex) => {
//     const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
//     if (!total) return null;

//     const start = (currentPage - 1) * limit + 1;
//     const end   = Math.min(currentPage * limit, total);

//     let sp = Math.max(1, currentPage - 2);
//     let ep = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3)         ep = Math.min(5, pages);
//     if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
//     const pageNums = [];
//     for (let i = sp; i <= ep; i++) pageNums.push(i);

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={limit} onChange={e => handleLimitChange(tabIndex, e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm" disabled={loading}>
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {sp > 1 && <><CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>{sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}</>}
//             {pageNums.map(p => <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(tabIndex, p)} disabled={loading}>{p}</CPaginationItem>)}
//             {ep < pages && <>{ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}<CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem></>}
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}><CIcon icon={cilChevronRight} /></CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   const renderCancelledPagination = (data, page, setPage) => {
//     const total = data.length;
//     if (total <= cancelledLimit) return null;
//     const pages = Math.ceil(total / cancelledLimit);
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={cancelledLimit} onChange={e => { setCancelledLimit(parseInt(e.target.value, 10)); setPage(1); }}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm">
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             Showing {(page - 1) * cancelledLimit + 1}–{Math.min(page * cancelledLimit, total)} of {total}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {Array.from({ length: pages }, (_, i) => i + 1).map(p =>
//               <CPaginationItem key={p} active={p === page} onClick={() => setPage(p)}>{p}</CPaginationItem>
//             )}
//             <CPaginationItem onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}><CIcon icon={cilChevronRight} /></CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ACTION HANDLERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleClick = (e, id) => { setAnchorEl(e.currentTarget); setMenuId(id); };
//   const handleClose = () => { setAnchorEl(null); setMenuId(null); };

//   const handleOpenRestoreModal = (bookingId, type) => {
//     if (type === 'rejected_discount' && !canRestoreFromRejectedDiscount) { showError('No permission to restore'); return; }
//     if (type === 'cancelled'         && !canRestoreFromRejectedCancelled) { showError('No permission to restore'); return; }
//     setSelectedRestoreBooking(bookingId); setRestoreType(type);
//     setRestoreReason(''); setRestoreNotes(''); setRestoreBookingModal(true); handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     const ok = restoreType === 'cancelled' ? canRestoreFromRejectedCancelled : canRestoreFromRejectedDiscount;
//     if (!ok || !selectedRestoreBooking) return;
//     try {
//       setRestoreLoading(true);
//       const url = restoreType === 'cancelled'
//         ? `/bookings/${selectedRestoreBooking}/restore`
//         : `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
//       await axiosInstance.put(url, { reason: restoreReason.trim() || undefined, notes: restoreNotes.trim() || undefined });
//       showSuccess('Booking restored successfully!');
//       setRestoreBookingModal(false); setSelectedRestoreBooking(null); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to restore booking'); }
//     finally { setRestoreLoading(false); }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!canViewAllBooking) { showError('No permission to view available documents'); return; }
//     try {
//       setLoadingTemplates(true); setSelectedBookingForDocs(bookingId);
//       const res = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(res.data.data); setAvailableDocsModal(true);
//       setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError('Failed to fetch available documents'); }
//     finally { setLoadingTemplates(false); }
//     handleClose();
//   };

//   const handleTemplateSelection = (id, canDownload) => {
//     if (!canDownload) return;
//     setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const handleSelectAllAvailable = () =>
//     setSelectedTemplateIds((availableTemplates?.available_templates?.templates || []).filter(t => t.can_download).map(t => t.template_id));

//   const handleSubmitTemplateSelection = async () => {
//     if (!canUpdateInApprovedTab) { showError('No permission to select templates'); return; }
//     if (!selectedBookingForDocs || !selectedTemplateIds.length) { showError('Please select at least one template'); return; }
//     try {
//       setSubmittingSelection(true);
//       await axiosInstance.post('/booking-templates/select', { bookingId: selectedBookingForDocs, templateIds: selectedTemplateIds, notes: templateNotes.trim() || undefined });
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false); setSelectedBookingForDocs(null);
//       setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError(err.response?.data?.message || 'Failed to select templates'); }
//     finally { setSubmittingSelection(false); }
//   };

//   const handleApproveCancellation = (c) => {
//     if (!canApproveCancellation) { showError('No permission to approve cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('APPROVE');
//     setEditedReason(c.cancellationRequest?.reason || '');
//     setCancellationCharges(c.cancellationRequest?.cancellationCharges || 0);
//     setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (c) => {
//     if (!canRejectCancellation) { showError('No permission to reject cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('REJECT');
//     setRejectionReason(''); setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleCancelActionSubmit = async () => {
//     if (!selectedCancellationForApproval) return;
//     try {
//       setCancelActionLoading(true);
//       if (cancelApprovalAction === 'APPROVE') {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, {
//           reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
//           editedReason, cancellationCharges, notes,
//         });
//         showSuccess('Cancellation approved!');
//       } else {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, { rejectionReason, notes });
//         showSuccess('Cancellation rejected!');
//       }
//       setCancelApprovalModal(false); setSelectedCancellationForApproval(null);
//       setEditedReason(''); setCancellationCharges(0); setNotes(''); setRejectionReason('');
//       fetchCancellationData();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process cancellation'); }
//     finally { setCancelActionLoading(false); }
//   };

//   const handleApproveChassis = (id) => {
//     if (!canApproveChassis) { showError('No permission to approve chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('APPROVE'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleRejectChassis = (id) => {
//     if (!canRejectChassis) { showError('No permission to reject chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('REJECT'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval || !approvalNote.trim()) { showError('Please enter approval/rejection note'); return; }
//     try {
//       setApprovalLoading(true);
//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, { action: approvalAction, approvalNote: approvalNote.trim() });
//       showSuccess(`Chassis ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'}!`);
//       setChassisApprovalModal(false); setSelectedBookingForApproval(null); setApprovalNote(''); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process chassis'); }
//     finally { setApprovalLoading(false); }
//   };

//   const handleViewBooking = async (id) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view booking'); return; }
//     try {
//       const res = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(res.data.data); setViewModalVisible(true); handleClose();
//     } catch (err) { showError('Failed to fetch booking details'); }
//   };

//   const handlePrint = (id) => {
//     if (!canPrintInTab[activeTab]) { showError('No permission to print in this tab'); return; }
//     setSelectedBookingForPrint(id); setPrintModalVisible(true); handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view KYC'); return; }
//     try {
//       setKycBookingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       const res = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       setKycData({ ...res.data.data, status: booking.documentStatus?.kyc?.status || 'PENDING', customerName: booking.customerDetails.name, address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}` });
//       setKycModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       setFinanceData({ status: booking.documentStatus?.financeLetter?.status || 'PENDING', customerName: booking.customerDetails.name, bookingId: booking._id });
//       setFinanceBookingId(bookingId); setFinanceModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//     finally { setActionLoadingId(null); }
//   };

//   const handleViewFinanceLetterReceipt = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const [bRes, dRes] = await Promise.all([
//         axiosInstance.get(`/bookings/${bookingId}`),
//         axiosInstance.get(`/disbursements/bookings/${bookingId}/disbursements`),
//       ]);
//       const bd  = bRes.data.data;
//       const dis = dRes.data.success && dRes.data.data.disbursements.length > 0
//         ? dRes.data.data.disbursements[0]?.disbursementAmount || 0 : 0;
//       const tab = window.open('', '_blank');
//       tab.document.write(generateFinanceLetterHTML(bd, dis));
//       tab.document.close();
//     } catch (err) { showError('Failed to fetch finance letter data'); }
//     finally { setActionLoadingId(null); handleClose(); }
//   };

//   const generateFinanceLetterHTML = (bd, disbursementAmount) => {
//     const today       = new Date().toLocaleDateString('en-GB');
//     const dealAmount  = bd?.discountedAmount || 0;
//     const gcAmount    = bd?.payment?.gcAmount || 0;
//     const exchAmt     = bd?.exchangeDetails?.price || 0;
//     const downPayment = (dealAmount + gcAmount) - disbursementAmount - exchAmt;
//     return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>FINANCER'S ASSURANCE LETTER</title><style>@page{size:A4;margin:20mm}body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.4;margin:0;padding:0;background:#f5f5f5}.page{width:210mm;min-height:297mm;margin:10mm auto;padding:15mm;background:white;box-shadow:0 0 10px rgba(0,0,0,.1);box-sizing:border-box}.details-table{width:100%;border-collapse:collapse;margin:20px 0}.details-table,.details-table td{border:1px solid black}.details-table td{padding:8px;vertical-align:top}.left-col{width:70%;font-weight:bold}.instruction-text{margin:15px 0;text-align:justify}.signature-box{width:25%;border-top:1px dashed black;margin-top:5px;margin-left:auto;padding:1px 0;text-align:right;color:#555;font-weight:bold}@media print{body{background:white}.page{box-shadow:none;margin:0;padding:0;width:100%}}</style></head><body><div class="page"><div style="text-align:right">Date: <strong>${today}</strong></div><div style="margin:15px 0">To,<br>The Director/Manager,<br>Gandhi Motors Pvt Ltd,<br>Nasik</div><div style="font-weight:bold;margin:15px 0">Sub:- Delivery Order &amp; Disbursement Assurance letter.</div><div style="margin:15px 0">Dear sir,</div><div>We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:</div><div style="margin:15px 0">Name : Mr./Mrs. : <strong>${bd?.customerDetails?.name||''}</strong></div><div style="margin:15px 0">Vehicle make &amp; model : <strong>${bd?.model?.model_name||bd?.model?.name||''}</strong> &nbsp;&nbsp; Booking Number: <strong>${bd?.bookingNumber||''}</strong></div><table class="details-table"><tr><td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td><td>${dealAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Disbursement Amount assured by finance company</td><td>${disbursementAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Net Down Payment to be taken from Customer</td><td>${downPayment.toLocaleString('en-IN')}</td></tr></table><div class="instruction-text">The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.</div><div class="instruction-text">This letter is non revokable &amp; we promise to pay you the above-mentioned loan amount within stipulated time.</div><div class="instruction-text">You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office &amp; give us the details of RTO registration along with the invoice, insurance &amp; Down payment receipt.</div><div class="instruction-text">Please do the needful.</div><div style="margin-top:40px"><div>For &amp; on behalf of</div><div>Financer's / Bank</div><div>Name: <strong>${bd?.payment?.financer?.name||''}</strong></div><div style="margin-top:15px">Employee Name: ________________________________</div><div style="margin-top:15px">Mobile No: ________________________________</div></div><div class="signature-box"><strong>Authorised Signature</strong></div></div></body></html>`;
//   };

//   const handleAllocateChassis = (id) => {
//     if (!canAllocateChassisInApprovedTab) { showError('No permission to allocate chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(false); setShowChassisModal(true); handleClose();
//   };

//   const handleUpdateChassis = (id) => {
//     if (!canUpdateChassisInAllocatedTab) { showError('No permission to update chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(true); setShowChassisModal(true); handleClose();
//   };

// const handleSaveChassisNumber = async (payload) => {
//   const ok = isUpdateChassis ? canUpdateChassisInAllocatedTab : canAllocateChassisInApprovedTab;
//   if (!ok) { 
//     showError('No permission to save chassis number'); 
//     return; 
//   }
  
//   try {
//     setChassisLoading(true); 
//     setChassisError('');
    
//     let url = `/bookings/${selectedBookingForChassis}/allocate`;
//     if (payload.reason) url += `?reason=${encodeURIComponent(payload.reason)}`;
    
//     const fd = new FormData();
    
//     // Required fields
//     fd.append('chassisNumber', payload.chassisNumber);
//     fd.append('is_deviation', payload.is_deviation || 'NO');
    
//     // Optional fields
//     if (payload.note) fd.append('note', payload.note);
//     if (payload.engineNumber) fd.append('engineNumber', payload.engineNumber);
    
//     // Claim details
//     if (payload.claimDetails) {
//       fd.append('hasClaim', 'true');
//       fd.append('priceClaim', payload.claimDetails.price || '');
//       fd.append('description', payload.claimDetails.description || '');
//       if (payload.claimDetails.documents && payload.claimDetails.documents.length > 0) {
//         payload.claimDetails.documents.forEach(f => fd.append('documents', f));
//       }
//     } else { 
//       fd.append('hasClaim', 'false'); 
//     }
    
//     // ✅ ADDITIONAL FIELDS - Always send these
//     fd.append('rsaOptIn', payload.rsaOptIn || 'YES');
//     fd.append('extendedWarranty', payload.extendedWarranty || 'NO');
    
//     // Insurance addons - send as JSON string array
//     if (payload.insuranceAddons && payload.insuranceAddons.length > 0) {
//       fd.append('insuranceAddons', JSON.stringify(payload.insuranceAddons));
//     } else {
//       fd.append('insuranceAddons', '[]');
//     }
    
//     console.log('Sending FormData with fields:', {
//       chassisNumber: payload.chassisNumber,
//       is_deviation: payload.is_deviation,
//       note: payload.note,
//       hasClaim: payload.hasClaim,
//       rsaOptIn: payload.rsaOptIn,
//       extendedWarranty: payload.extendedWarranty,
//       insuranceAddons: payload.insuranceAddons
//     });
    
//     const res = await axiosInstance.put(url, fd, { 
//       headers: { 'Content-Type': 'multipart/form-data' } 
//     });
    
//     showSuccess(res.data.message);
//     setShowChassisModal(false); 
//     setIsUpdateChassis(false); 
//     setSelectedBookingForChassis(null); 
//     setChassisError('');
//     refreshCurrentTab();
    
//   } catch (err) {
//     const msg = err.response?.data?.message || err.message || 'Failed to save chassis number';
//     setChassisError(msg); 
//     showError(msg);
//   } finally { 
//     setChassisLoading(false); 
//   }
// };

//   const handleViewAltrationRequest = (booking) => {
//     if (!canViewPendingApprovalsTab) { showError('No permission to view alteration requests'); return; }
//     setSelectedUpdate(booking); setDetailsModalOpen(true); handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!canApproveUpdate) { showError('No permission to approve updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/approve-update`, payload); showSuccess('Update approved'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!canRejectUpdate) { showError('No permission to reject updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/reject-update`, payload); showSuccess('Update rejected'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleDelete = async (id) => {
//     const ok = activeTab === 0 ? canDeleteBookingInPendingApprovals : canDeleteBookingInRejectedDiscount;
//     if (!ok) { showError('No permission to delete bookings'); return; }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try { await axiosInstance.delete(`/bookings/${id}`); showSuccess('Booking deleted'); refreshCurrentTab(); }
//       catch (err) { showError(err.response?.data?.message || 'Failed to delete booking'); }
//     }
//   };

//   const getAuthToken = () => token || localStorage.getItem('token') || localStorage.getItem('authToken');

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
//       const authToken = getAuthToken();
//       if (!authToken) { showError('Please login'); setExportLoading(false); setShowExportModal(false); return; }
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420';
//       const { startDate, endDate } = exportDateRange;
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a'); a.href = url;
//           a.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(a); a.click(); document.body.removeChild(a);
//           window.URL.revokeObjectURL(url);
//           showSuccess('Excel downloaded!'); setShowExportModal(false);
//         } else { showError(xhr.status === 401 ? 'Please login' : 'Download failed'); }
//         setExportLoading(false);
//       };
//       xhr.onerror = () => { showError('Network error'); setExportLoading(false); };
//       xhr.send();
//     } catch (err) { showError('Export failed'); setExportLoading(false); }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TABLE RENDERER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderBookingTable = (tabIndex) => {
//     if (!canViewBookingInTab[tabIndex]) {
//       const names = ['PENDING APPROVALS','APPROVED','PENDING ALLOCATED','ALLOCATED','REJECTED DISCOUNT','CANCELLED BOOKING','REJECTED CANCELLED BOOKING'];
//       return <CAlert color="warning">You do not have permission to view the {names[tabIndex]} tab.</CAlert>;
//     }

//     const canCreate    = canPrintInTab[tabIndex];
//     const canUploadKyc = () => [canUploadKycInPendingApprovals, canUploadKycInApprovedTab, false, canUploadKycInAllocatedTab, canUploadKycInRejectedDiscount][tabIndex] ?? false;
//     const canUploadFin = () => [canUploadFinanceInPendingApprovals, canUploadFinanceInApprovedTab, false, canUploadFinanceInAllocatedTab, canUploadFinanceInRejectedDiscount][tabIndex] ?? false;
//     const canEditThis  = () => tabIndex === 0 ? canEditInPendingApprovalsTab : tabIndex === 4 ? canEditInRejectedDiscountTab : false;
//     const getDocumentUrl = path => `https://gmplmis.com/dealership-api/api/v1/uploads${path}`;

//     // ── Cancellation tabs ────────────────────────────────────────────────────
//     if (tabIndex === TAB.CANCELLED || tabIndex === TAB.REJECTED_CANCELLED) {
//       const raw      = tabIndex === TAB.CANCELLED ? cancelledPendingData : cancelledRejectedData;
//       const filtered = getFilteredCancelled(raw);
//       const page     = tabIndex === TAB.CANCELLED ? cancelledPendingPage  : cancelledRejectedPage;
//       const setPage  = tabIndex === TAB.CANCELLED ? setCancelledPendingPage : setCancelledRejectedPage;
//       const records  = getCancelledPage(filtered, page);

//       return (
//         <>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Contact</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell>Requested At</CTableHeaderCell>
//                   <CTableHeaderCell>Requested By</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell>Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Refund Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {tabIndex === TAB.REJECTED_CANCELLED && <CTableHeaderCell>Rejection Reason</CTableHeaderCell>}
//                   <CTableHeaderCell>Options</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {records.length === 0 ? (
//                   <CTableRow><CTableDataCell colSpan={13} className="text-center text-danger">No cancellation requests available</CTableDataCell></CTableRow>
//                 ) : records.map((c, i) => (
//                   <CTableRow key={c._id || i}>
//                     <CTableDataCell>{(page - 1) * cancelledLimit + i + 1}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.name  || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.phone || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.bookingDate ? new Date(c.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedAt ? new Date(c.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.cancellationCharges || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.received            || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.refundAmount        || 0}</CTableDataCell>
//                     <CTableDataCell><span className={`status-badge ${c.cancellationRequest?.status?.toLowerCase() || ''}`}>{c.cancellationRequest?.status || 'N/A'}</span></CTableDataCell>
//                     {tabIndex === TAB.REJECTED_CANCELLED && <CTableDataCell>{c.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>
//                       {tabIndex === TAB.CANCELLED && (
//                         <div className="d-flex gap-1">
//                           <CButton size="sm" color="success" onClick={() => handleApproveCancellation(c)} disabled={!canApproveCancellation}><CIcon icon={cilCheck} /> Approve</CButton>
//                           <CButton size="sm" color="danger"  onClick={() => handleRejectCancellation(c)}  disabled={!canRejectCancellation}><CIcon icon={cilX} /> Reject</CButton>
//                         </div>
//                       )}
//                       {tabIndex === TAB.REJECTED_CANCELLED && (
//                         <CButton size="sm" color="primary" onClick={() => handleOpenRestoreModal(c._id, 'cancelled')} disabled={!canRestoreFromRejectedCancelled}>Back to Normal</CButton>
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </div>
//           {renderCancelledPagination(filtered, page, setPage)}
//         </>
//       );
//     }

//     // ── Booking tabs 0–4 ─────────────────────────────────────────────────────
//     const td      = tabData[tabIndex];
//     const records = td.docs;

//     return (
//       <>
//         {td.loading && (
//           <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//             <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//           </div>
//         )}
//         <div className="responsive-table-wrapper" style={{ opacity: td.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//           <CTable striped bordered hover className="responsive-table">
//             <CTableHead>
//               <CTableRow>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Sr.no</CTableHeaderCell>}
//                 <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Type</CTableHeaderCell>}
//                 <CTableHeaderCell>Color</CTableHeaderCell>
//                 <CTableHeaderCell>Fullname</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Contact1</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Finance Letter</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Upload Finance</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Upload KYC</CTableHeaderCell>}
//                 <CTableHeaderCell>Status</CTableHeaderCell>
//                 {tabIndex === 0 && <CTableHeaderCell>Altration Request</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Is Claim</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Claim Documents</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Print</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Note</CTableHeaderCell>}
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.length === 0 && !td.loading ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={20} className="text-center text-danger">
//                     {td.search ? `No results found for "${td.search}"` : 'No booking available'}
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : records.map((booking, index) => {
//                 const globalIndex = (td.currentPage - 1) * td.limit + index + 1;
//                 const bid = booking._id || booking.id;
//                 return (
//                   <CTableRow key={bid}>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
//                     <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.customerDetails?.name || ''}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && canCreate && (
//                           <CButton size="sm" className="view-button" onClick={() => handlePrint(bid)}>Print</CButton>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && (
//                           <>
//                             {canUploadFin() && ['NOT_UPLOADED','REJECTED'].includes(booking.documentStatus?.financeLetter?.status) ? (
//                               <Link to={`/upload-finance/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//                                 <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></CButton>
//                               </Link>
//                             ) : null}
//                             {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                               <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.financeLetter?.status || ''}</span>
//                             )}
//                           </>
//                         )}
//                       </CTableDataCell>
//                     )}

//                 {tabIndex !== 2 && tabIndex !== 4 && (
//   <CTableDataCell>
//     {(booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' || booking.documentStatus?.kyc?.status === 'INCOMPLETE') ? (
//       <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//         <CButton 
//           size="sm" 
//           className="upload-kyc-btn icon-only"
//           style={{
//             backgroundColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//             borderColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//             color: 'white'
//           }}
//         >
//           <CIcon icon={cilCloudUpload} />
//         </CButton>
//       </Link>
//     ) : (
//       <div className="d-flex align-items-center">
//         <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.kyc?.status || ''}</span>
//         {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//           <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: booking.customerDetails?.name, address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }} className="ms-2">
//             <button className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></button>
//           </Link>
//         )}
//       </div>
//     )}
//   </CTableDataCell>
// )}

//                     <CTableDataCell>
//                       <span className="status-badge" style={{
//                         backgroundColor:
//                           booking.status === 'FREEZZED'                              ? '#ffc107' :
//                           booking.status === 'PENDING_APPROVAL'                      ? '#0d6efd' :
//                           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'  ? '#fd7e14' :
//                           booking.status === 'APPROVED'                              ? '#198754' :
//                           booking.status === 'REJECTED'                              ? '#dc3545' :
//                           booking.status === 'ALLOCATED'                             ? '#6f42c1' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
//                         fontWeight: '500', display: 'inline-block',
//                       }}>
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
//                         {booking.claimDetails?.hasClaim
//                           ? <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                           : <CIcon icon={cilXCircle}    className="status-icon inactive-icon" />}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                     {tabIndex === 3 && (
//                       <CTableDataCell>
//                         {booking.claimDetails?.hasClaim && booking.claimDetails?.documents?.length > 0 ? (
//                           <CDropdown>
//                             <CDropdownToggle size="sm" color="info" variant="outline">{booking.claimDetails.documents.length} Doc{booking.claimDetails.documents.length > 1 ? 's' : ''}</CDropdownToggle>
//                             <CDropdownMenu>
//                               {booking.claimDetails.documents.map((doc, di) => (
//                                 <CDropdownItem key={di} onClick={() => window.open(getDocumentUrl(doc.path), '_blank')}>
//                                   <CIcon icon={cilDescription} className="me-2" />
//                                   <strong>{doc.originalName || `Document ${di + 1}`}</strong>
//                                   <small className="ms-2">{(doc.size / 1024).toFixed(2)} KB</small>
//                                 </CDropdownItem>
//                               ))}
//                             </CDropdownMenu>
//                           </CDropdown>
//                         ) : booking.claimDetails?.hasClaim
//                           ? <span className="text-muted">No documents</span>
//                           : <span className="text-muted">-</span>}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.formPath && (
//                           user?.is_sales_executive && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : canCreate ? (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilPrint} /></CButton>
//                             </a>
//                           ) : null
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}

//                     <CTableDataCell>
//                       <CButton size="sm" className="option-button btn-sm" onClick={e => handleClick(e, bid)}>
//                         <CIcon icon={cilSettings} /> Options
//                       </CButton>
//                       <Menu id={`action-menu-${bid}`} anchorEl={anchorEl} open={menuId === bid} onClose={handleClose}>
//                         {canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewBooking(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Booking</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.updateRequestStatus === 'PENDING' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Altration Req</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex === 4 && canRestoreFromRejectedDiscount && (
//                           <MenuItem onClick={() => handleOpenRestoreModal(bid, 'rejected_discount')} style={{ color: 'black' }}><CIcon icon={cilCheck} className="me-2" /> Back to Normal</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.payment?.type === 'FINANCE' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewFinanceLetterReceipt(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilDescription} className="me-2" /> View Finance Letter Receipt</MenuItem>
//                         )}
//                         {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter</MenuItem>
//                         )}
//                         {canViewBookingInTab[tabIndex] && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewKYC(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View KYC</MenuItem>
//                         )}
//                         {tabIndex === 1 && canAllocateChassisInApprovedTab && booking.status === 'APPROVED' && (booking.payment?.type === 'CASH' || (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status === 'APPROVED')) && (
//                           <MenuItem onClick={() => handleAllocateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Allocate Chassis</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateChassisInAllocatedTab && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                           <MenuItem onClick={() => handleUpdateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Change Vehicle</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
//                           <>
//                             {canApproveChassis && <MenuItem onClick={() => handleApproveChassis(bid)} style={{ color: 'green' }}><CIcon icon={cilCheck} className="me-2" /> Approve Chassis</MenuItem>}
//                             {canRejectChassis  && <MenuItem onClick={() => handleRejectChassis(bid)}  style={{ color: 'red'   }}><CIcon icon={cilX}     className="me-2" /> Reject Chassis</MenuItem>}
//                           </>
//                         )}
//                         {tabIndex === 1 && booking.status === 'APPROVED' && canViewBookingInTab[1] && (
//                           <MenuItem onClick={() => handleOpenAvailableDocs(bid)} style={{ color: 'black' }}><CIcon icon={cilFile} className="me-2" /> Available Documents</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.status === 'FREEZZED' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => window.location.href = '/#/self-insurance'} style={{ color: 'black' }}><CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance</MenuItem>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   </CTableRow>
//                 );
//               })}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination(tabIndex)}
//       </>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LOADING / PERMISSION GUARDS
//   // ═══════════════════════════════════════════════════════════════════════════
//   if (!canViewAnyTab) {
//     return <div className="alert alert-danger m-3">You do not have permission to view any tabs in All Booking.</div>;
//   }

//   const currentSearch = activeTab >= TAB.CANCELLED ? cancelledSearch : localSearch;

//   // ═══════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════════════════
//   return (
//     <div>
//       <div className="title">Booking List</div>
//       {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1"><CIcon icon={cilPlus} className="icon" /> New Booking</CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           {/* ── Tab nav ── */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {[
//               [TAB.PENDING,            'Pending Approvals',  canViewPendingApprovalsTab],
//               [TAB.APPROVED,           'Approved',           canViewApprovedTab],
//               [TAB.PENDING_ALLOCATED,  'Pending Allocated',  canViewPendingAllocatedTab],
//               [TAB.ALLOCATED,          'Allocated',          canViewAllocatedTab],
//               [TAB.REJECTED,           'Rejected Discount',  canViewRejectedDiscountTab],
//               [TAB.CANCELLED,          'Cancelled Booking',  canViewCancelledBookingTab],
//               [TAB.REJECTED_CANCELLED, 'Rejected Cancelled', canViewRejectedCancelledBookingTab],
//             ].map(([idx, label, perm]) => perm && (
//               <CNavItem key={idx}>
//                 <CNavLink
//                   active={activeTab === idx}
//                   onClick={() => handleTabChange(idx)}
//                   style={{ cursor: 'pointer', borderTop: activeTab === idx ? '4px solid #2759a2' : '3px solid transparent', borderBottom: 'none', color: 'black' }}
//                 >
//                   {label}
//                 </CNavLink>
//               </CNavItem>
//             ))}
//           </CNav>

//           {/* ── Search bar (uncontrolled input to prevent focus loss) ── */}
//           <div className="d-flex justify-content-end mb-3">
//             <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//             <input
//   ref={searchInputRef}
//   type="text"
//   defaultValue=""
//   style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
//   className="d-inline-block square-search"
//   onChange={e => handleSearch(e.target.value)}
//   placeholder="Search by Booking ID or Customer Name..."
//   autoComplete="off"
// />
//           </div>

//           {/* ── Tab content ── */}
//           <CTabContent>
//             {[TAB.PENDING, TAB.APPROVED, TAB.PENDING_ALLOCATED, TAB.ALLOCATED, TAB.REJECTED].map(idx =>
//               canViewBookingInTab[idx] && (
//                 <CTabPane key={idx} visible={activeTab === idx}>
//                   {activeTab === idx && renderBookingTable(idx)}
//                 </CTabPane>
//               )
//             )}
//             {canViewCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.CANCELLED}>
//                 {activeTab === TAB.CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//             {canViewRejectedCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.REJECTED_CANCELLED}>
//                 {activeTab === TAB.REJECTED_CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.REJECTED_CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* ═══ MODALS ═══ */}

//       {/* Export */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Export Excel Report</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Start Date:</CFormLabel><CFormInput type="date" value={exportDateRange.startDate} onChange={e => setExportDateRange(p => ({ ...p, startDate: e.target.value }))} /></div>
//           <div className="mb-3"><CFormLabel>End Date:</CFormLabel><CFormInput type="date" value={exportDateRange.endDate} onChange={e => setExportDateRange(p => ({ ...p, endDate: e.target.value }))} min={exportDateRange.startDate} /></div>
//           <CAlert color="info"><small>This will export the branch sales report for the selected date range.</small></CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleExportConfirm} disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}>
//             {exportLoading ? <><CSpinner size="sm" className="me-2" />Exporting…</> : 'Export Excel'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Restore */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader><CModalTitle>Restore Booking to Normal</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Reason:</CFormLabel><CFormTextarea value={restoreReason} onChange={e => setRestoreReason(e.target.value)} rows={2} placeholder="Enter reason" /></div>
//           <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={restoreNotes} onChange={e => setRestoreNotes(e.target.value)} rows={2} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleRestoreBooking} disabled={restoreLoading}>
//             {restoreLoading ? <><CSpinner size="sm" className="me-2" />Processing…</> : 'Restore Booking'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Available Docs */}
//       <CModal visible={availableDocsModal} onClose={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }} size="lg">
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Available Documents - {availableTemplates?.booking_number || ''}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5"><CSpinner color="primary" /><p className="mt-3">Loading…</p></div>
//           ) : availableTemplates ? (
//             <div>
//               <h6>Customer: {availableTemplates.customer_name}</h6>
//               <div className="alert alert-info mb-3"><small><strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} available.</small></div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0">Templates ({availableTemplates.available_templates.count})</h6>
//                 <div className="d-flex gap-2">
//                   <CButton size="sm" color="primary" variant="outline" onClick={handleSelectAllAvailable}>Select All</CButton>
//                   <CButton size="sm" color="secondary" variant="outline" onClick={() => setSelectedTemplateIds([])}>Clear All</CButton>
//                 </div>
//               </div>
//               <div className="border rounded p-3">
//                 {(availableTemplates.available_templates.templates || []).map(t => (
//                   <div key={t.template_id} className="mb-3">
//                     <div className="form-check">
//                       <input className="form-check-input" type="checkbox" id={`tpl-${t.template_id}`} checked={selectedTemplateIds.includes(t.template_id)} onChange={() => handleTemplateSelection(t.template_id, t.can_download)} disabled={!t.can_download} />
//                       <label className="form-check-label d-flex justify-content-between align-items-center w-100" htmlFor={`tpl-${t.template_id}`} style={{ cursor: t.can_download ? 'pointer' : 'not-allowed', opacity: t.can_download ? 1 : 0.6 }}>
//                         <div><strong>{t.template_name}</strong><br /><small className="text-muted">{t.can_download ? 'Available' : 'Not available'}</small></div>
//                         {!t.can_download && <small className="text-danger"><CIcon icon={cilXCircle} className="me-1" />Disabled</small>}
//                       </label>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={templateNotes} onChange={e => setTemplateNotes(e.target.value)} rows={2} /></div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }}>Cancel</CButton>
//           <CButton color="primary" onClick={handleSubmitTemplateSelection} disabled={!selectedTemplateIds.length || submittingSelection}>
//             {submittingSelection ? <><CSpinner size="sm" className="me-2" />Processing…</> : `Select (${selectedTemplateIds.length}) Templates`}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation' : 'Reject Cancellation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3"><CFormLabel>Original Reason:</CFormLabel><CFormInput type="text" value={selectedCancellationForApproval?.cancellationRequest?.reason || ''} readOnly /></div>
//               <div className="mb-3"><CFormLabel>Edited Reason (Optional):</CFormLabel><CFormTextarea value={editedReason} onChange={e => setEditedReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Cancellation Charges:</CFormLabel><CFormInput type="number" value={cancellationCharges} onChange={e => setCancellationCharges(Number(e.target.value))} min="0" /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3"><CFormLabel>Rejection Reason:</CFormLabel><CFormTextarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleCancelActionSubmit} disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}>
//             {cancelActionLoading ? <CSpinner size="sm" /> : cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>{approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}</CFormLabel><CFormTextarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={3} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleChassisApprovalSubmit} disabled={approvalLoading}>
//             {approvalLoading ? <CSpinner size="sm" /> : approvalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Sub-components */}
//       <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={refreshCurrentTab} />
//       <KYCView open={kycModalVisible} onClose={() => { setKycModalVisible(false); setKycBookingId(null); }} kycData={kycData} refreshData={refreshCurrentTab} bookingId={kycBookingId} />
//       <FinanceView open={financeModalVisible} onClose={() => { setFinanceModalVisible(false); setFinanceBookingId(null); }} financeData={financeData} refreshData={refreshCurrentTab} bookingId={financeBookingId} />
//       <ChassisNumberModal show={showChassisModal} onClose={() => { setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError(''); }} onSave={handleSaveChassisNumber} isLoading={chassisLoading} booking={tabData[activeTab]?.docs?.find(b => b._id === selectedBookingForChassis || b.id === selectedBookingForChassis)} isUpdate={isUpdateChassis} errorMessage={chassisError} onClearError={() => setChassisError('')} />
//       <PrintModal show={printModalVisible} onClose={() => { setPrintModalVisible(false); setSelectedBookingForPrint(null); }} bookingId={selectedBookingForPrint} />
//       <PendingUpdateDetailsModal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} updateData={selectedUpdate} onApprove={payload => handleApproveUpdate(selectedUpdate._id, payload)} onReject={payload => handleRejectUpdate(selectedUpdate._id, payload)} />
//     </div>
//   );
// };

// export default BookingList;






// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Link, Menu, MenuItem,
//   getDefaultSearchFields, useTableFilter, usePagination,
//   showError, axiosInstance, showSuccess, confirmDelete,
// } from '../../../utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import {
//   cilCloudUpload, cilPrint, cilPlus, cilSettings, cilPencil, cilTrash,
//   cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle, cilFile,
//   cilChevronLeft, cilChevronRight, cilDescription,
// } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import {
//   CNav, CNavItem, CNavLink, CTabContent, CTabPane,
//   CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
//   CCard, CCardBody, CCardHeader,
//   CButton, CFormInput, CSpinner, CFormLabel,
//   CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
//   CFormTextarea, CAlert, CPagination, CPaginationItem, CFormSelect,
//   CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
// import {
//   hasSafePagePermission, MODULES, PAGES, TABS, ACTIONS,
//   canViewPage, canCreateInPage, canUpdateInPage, canDeleteInPage,
// } from '../../../utils/modulePermissions';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';

// // ─── Helper function to get full customer name ──────────────────────────────────
// const getFullCustomerName = (customerDetails) => {
//   if (!customerDetails) return '';
//   const { firstName = '', middleName = '', lastName = '' } = customerDetails;
//   // Filter out empty strings and join with spaces
//   const fullName = [firstName, middleName, lastName]
//     .filter(part => part && part.trim() !== '')
//     .join(' ');
//   return fullName || '';
// };

// // ─── Tab constants ─────────────────────────────────────────────────────────────
// const TAB = {
//   PENDING: 0, APPROVED: 1, PENDING_ALLOCATED: 2,
//   ALLOCATED: 3, REJECTED: 4, CANCELLED: 5, REJECTED_CANCELLED: 6,
// };

// const TAB_STATUSES = {
//   [TAB.PENDING]:           ['PENDING_APPROVAL', 'PENDING_APPROVAL (Discount_Exceeded)', 'FREEZZED'],
//   [TAB.APPROVED]:          ['APPROVED'],
//   [TAB.PENDING_ALLOCATED]: ['ON_HOLD', 'PENDING_GM_APPROVAL'],
//   [TAB.ALLOCATED]:         ['ALLOCATED'],
//   [TAB.REJECTED]:          ['REJECTED'],
// };

// const PAGE_SIZE_OPTIONS = [25, 50, 100];
// const DEFAULT_LIMIT     = 50;

// const emptyTab = () => ({
//   docs: [], total: 0, pages: 0, currentPage: 1,
//   limit: DEFAULT_LIMIT, loading: false, search: '',
// });

// // ─── Component ─────────────────────────────────────────────────────────────────
// const BookingList = () => {
//   const [anchorEl, setAnchorEl]   = useState(null);
//   const [menuId, setMenuId]       = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate]     = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [error, setError]                       = useState(null);

//   // ── Separate local search state — NEVER tied to async tabData ──
//   const [localSearch, setLocalSearch] = useState('');

//   // Per-tab paginated state
//   const [tabData, setTabData] = useState(() =>
//     Object.values(TAB).reduce((acc, i) => { acc[i] = emptyTab(); return acc; }, {})
//   );

//   // Cancellation tabs (separate API)
//   const [cancelledPendingData,  setCancelledPendingData]  = useState([]);
//   const [cancelledRejectedData, setCancelledRejectedData] = useState([]);
//   const [cancelledPendingPage,  setCancelledPendingPage]  = useState(1);
//   const [cancelledRejectedPage, setCancelledRejectedPage] = useState(1);
//   const [cancelledLimit,        setCancelledLimit]        = useState(DEFAULT_LIMIT);
//   const [cancelledLoading,      setCancelledLoading]      = useState(false);
//   const [cancelledSearch,       setCancelledSearch]       = useState('');

//   // Debounce timer ref
//   const searchTimer = useRef(null);

//   // ── Stable ref for search input so it NEVER loses focus on re-render ──
//   const searchInputRef = useRef(null);

//   // Export modal
//   const [exportLoading,   setExportLoading]   = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportDateRange, setExportDateRange] = useState({
//     startDate: new Date().toISOString().split('T')[0],
//     endDate:   new Date().toISOString().split('T')[0],
//   });

//   // Chassis approval
//   const [chassisApprovalModal,       setChassisApprovalModal]       = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction,             setApprovalAction]             = useState('');
//   const [approvalNote,               setApprovalNote]               = useState('');
//   const [approvalLoading,            setApprovalLoading]            = useState(false);

//   // Cancellation approval
//   const [cancelApprovalModal,             setCancelApprovalModal]             = useState(false);
//   const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
//   const [cancelApprovalAction,            setCancelApprovalAction]            = useState('');
//   const [editedReason,                    setEditedReason]                    = useState('');
//   const [cancellationCharges,             setCancellationCharges]             = useState(0);
//   const [notes,                           setNotes]                           = useState('');
//   const [rejectionReason,                 setRejectionReason]                 = useState('');
//   const [cancelActionLoading,             setCancelActionLoading]             = useState(false);

//   // Chassis modal
//   const [showChassisModal,          setShowChassisModal]          = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading,            setChassisLoading]            = useState(false);
//   const [isUpdateChassis,           setIsUpdateChassis]           = useState(false);
//   const [chassisError,              setChassisError]              = useState('');

//   // Available docs modal
//   const [availableDocsModal,     setAvailableDocsModal]     = useState(false);
//   const [selectedBookingForDocs, setSelectedBookingForDocs] = useState(null);
//   const [availableTemplates,     setAvailableTemplates]     = useState(null);
//   const [loadingTemplates,       setLoadingTemplates]       = useState(false);
//   const [selectedTemplateIds,    setSelectedTemplateIds]    = useState([]);
//   const [templateNotes,          setTemplateNotes]          = useState('');
//   const [submittingSelection,    setSubmittingSelection]    = useState(false);

//   // Restore
//   const [restoreBookingModal,    setRestoreBookingModal]    = useState(false);
//   const [selectedRestoreBooking, setSelectedRestoreBooking] = useState(null);
//   const [restoreReason,          setRestoreReason]          = useState('');
//   const [restoreNotes,           setRestoreNotes]           = useState('');
//   const [restoreLoading,         setRestoreLoading]         = useState(false);
//   const [restoreType,            setRestoreType]            = useState('');

//   // View / KYC / Finance / Print
//   const [viewModalVisible,        setViewModalVisible]        = useState(false);
//   const [selectedBooking,         setSelectedBooking]         = useState(null);
//   const [kycModalVisible,         setKycModalVisible]         = useState(false);
//   const [kycBookingId,            setKycBookingId]            = useState(null);
//   const [kycData,                 setKycData]                 = useState(null);
//   const [financeModalVisible,     setFinanceModalVisible]     = useState(false);
//   const [financeBookingId,        setFinanceBookingId]        = useState(null);
//   const [financeData,             setFinanceData]             = useState(null);
//   const [printModalVisible,       setPrintModalVisible]       = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [actionLoadingId,         setActionLoadingId]         = useState(null);
//   const [loadingId,               setLoadingId]               = useState(null);

//   const { permissions = [], token, user } = useAuth();
//   const navigate = useNavigate();

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PERMISSIONS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const canViewPendingApprovalsTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canViewApprovedTab                     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.APPROVED);
//   const canViewPendingAllocatedTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canViewAllocatedTab                    = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.ALLOCATED);
//   const canViewRejectedDiscountTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canViewCancelledBookingTab             = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canViewRejectedCancelledBookingTab     = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.VIEW,   TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canCreateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canCreateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.APPROVED);
//   const canCreateInPendingAllocatedTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.PENDING_ALLOCATED);
//   const canCreateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canCreateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canCreateInCancelledBookingTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.CANCELLED_BOOKING);
//   const canCreateInRejectedCancelledBookingTab = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.CREATE, TABS.ALL_BOOKING.REJECTED_CANCELLED_BOOKING);
//   const canUpdateInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canUpdateInApprovedTab                 = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.APPROVED);
//   const canUpdateInAllocatedTab                = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.ALLOCATED);
//   const canUpdateInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.UPDATE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);
//   const canDeleteInPendingApprovalsTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.PENDING_APPROVALS);
//   const canDeleteInRejectedDiscountTab         = hasSafePagePermission(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING, ACTIONS.DELETE, TABS.ALL_BOOKING.REJECTED_DISCOUNT);

//   const canApproveChassis               = canCreateInPendingAllocatedTab;
//   const canRejectChassis                = canCreateInPendingAllocatedTab;
//   const canApproveCancellation          = canCreateInCancelledBookingTab;
//   const canRejectCancellation           = canCreateInCancelledBookingTab;
//   const canRestoreFromRejectedDiscount  = canCreateInRejectedDiscountTab;
//   const canRestoreFromRejectedCancelled = canCreateInRejectedCancelledBookingTab;
//   const canApproveUpdate                = canCreateInPendingApprovalsTab;
//   const canRejectUpdate                 = canCreateInPendingApprovalsTab;
//   const canAllocateChassisInApprovedTab = canCreateInApprovedTab;
//   const canUpdateChassisInAllocatedTab  = canCreateInAllocatedTab;
//   const canEditInPendingApprovalsTab    = canUpdateInPendingApprovalsTab;
//   const canEditInRejectedDiscountTab    = canUpdateInRejectedDiscountTab;
//   const canDeleteBookingInPendingApprovals = canDeleteInPendingApprovalsTab;
//   const canDeleteBookingInRejectedDiscount = canDeleteInRejectedDiscountTab;
//   const canUploadKycInPendingApprovals     = canCreateInPendingApprovalsTab;
//   const canUploadKycInApprovedTab          = canCreateInApprovedTab;
//   const canUploadKycInAllocatedTab         = canCreateInAllocatedTab;
//   const canUploadKycInRejectedDiscount     = canCreateInRejectedDiscountTab;
//   const canUploadFinanceInPendingApprovals = canCreateInPendingApprovalsTab;
//   const canUploadFinanceInApprovedTab      = canCreateInApprovedTab;
//   const canUploadFinanceInAllocatedTab     = canCreateInAllocatedTab;
//   const canUploadFinanceInRejectedDiscount = canCreateInRejectedDiscountTab;

//   const canPrintInTab = {
//     0: canCreateInPendingApprovalsTab, 1: canCreateInApprovedTab,
//     2: canCreateInPendingAllocatedTab, 3: canCreateInAllocatedTab,
//     4: canCreateInRejectedDiscountTab, 5: canCreateInCancelledBookingTab,
//     6: canCreateInRejectedCancelledBookingTab,
//   };
//   const canViewBookingInTab = {
//     0: canViewPendingApprovalsTab,     1: canViewApprovedTab,
//     2: canViewPendingAllocatedTab,     3: canViewAllocatedTab,
//     4: canViewRejectedDiscountTab,     5: canViewCancelledBookingTab,
//     6: canViewRejectedCancelledBookingTab,
//   };
//   const canViewAnyTab     = Object.values(canViewBookingInTab).some(Boolean);
//   const canViewAllBooking = canViewPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);
//   const canCreateAllBooking = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.ALL_BOOKING);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // HELPER — update a single tab's state slice
//   // ═══════════════════════════════════════════════════════════════════════════
//   const setTab = useCallback((tabIndex, updates) =>
//     setTabData(prev => ({ ...prev, [tabIndex]: { ...prev[tabIndex], ...updates } })),
//   []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CORE FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
// const fetchTab = useCallback(async (tabIndex, page = 1, limit = DEFAULT_LIMIT, search = '') => {
//   if (tabIndex >= TAB.CANCELLED) return;
//   setTab(tabIndex, { loading: true });

//   try {
//     const statuses  = TAB_STATUSES[tabIndex];
//     const trimmed   = search ? search.trim() : '';

//     if (statuses.length === 1) {
//       const params = { 
//         bookingType: 'BRANCH', 
//         status: statuses[0], 
//         page, 
//         limit 
//       };
      
//       // Only add search params if there's a search term
//       if (trimmed) {
//         params.search = trimmed;
//         // Restrict search to booking ID and customer name only
//         params.searchFields = 'bookingNumber,customerDetails.firstName,customerDetails.middleName,customerDetails.lastName';
//       }

//       const res = await axiosInstance.get('/bookings', { params });
//       const d   = res.data.data;

//       setTab(tabIndex, {
//         docs:        d.bookings || [],
//         total:       d.total    || 0,
//         pages:       d.pages    || 1,
//         currentPage: page,
//         limit,
//         loading:     false,
//         search,
//         _allDocs:    undefined,
//       });

//     } else {
//       // For tabs with multiple statuses
//       const responses = await Promise.all(
//         statuses.map(status => {
//           const params = { 
//             bookingType: 'BRANCH', 
//             status, 
//             page: 1, 
//             limit: 200 
//           };
          
//           if (trimmed) {
//             params.search = trimmed;
//             // Restrict search to booking ID and customer name only
//             params.searchFields = 'bookingNumber,customerDetails.firstName,customerDetails.middleName,customerDetails.lastName';
//           }
          
//           return axiosInstance.get('/bookings', { params });
//         })
//       );

//       let allDocs = [];
//       responses.forEach(r => {
//         allDocs = allDocs.concat(r.data.data.bookings || []);
//       });

//       // Remove duplicates
//       const seen = new Set();
//       allDocs = allDocs.filter(d => {
//         const id = String(d._id);
//         if (seen.has(id)) return false;
//         seen.add(id);
//         return true;
//       });

//       // If there's a search term, apply client-side filtering as fallback
//       // This ensures we only keep results that match booking ID or customer name
//       if (trimmed) {
//         const searchLower = trimmed.toLowerCase();
//         allDocs = allDocs.filter(booking => {
//           const bookingNumber = (booking.bookingNumber || '').toLowerCase();
//           const customerName = getFullCustomerName(booking.customerDetails).toLowerCase();
          
//           return bookingNumber.includes(searchLower) || customerName.includes(searchLower);
//         });
//       }

//       allDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       const total    = allDocs.length;
//       const pages    = Math.max(1, Math.ceil(total / limit));
//       const safePage = Math.min(Math.max(1, page), pages);
//       const start    = (safePage - 1) * limit;
//       const docs     = allDocs.slice(start, start + limit);

//       setTab(tabIndex, {
//         docs, total, pages,
//         currentPage: safePage,
//         limit, loading: false, search,
//         _allDocs: allDocs,
//       });
//     }
//   } catch (err) {
//     console.error(`[fetchTab] tab ${tabIndex}`, err);
//     showError(err);
//     setTab(tabIndex, { loading: false });
//   }
// }, [setTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION FETCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const fetchCancellationData = useCallback(async () => {
//     try {
//       setCancelledLoading(true);
//       const [pRes, rRes] = await Promise.all([
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'PENDING'  } }),
//         axiosInstance.get('/cancelbooking/cancellations', { params: { status: 'REJECTED' } }),
//       ]);
//       setCancelledPendingData(pRes.data.data  || []);
//       setCancelledRejectedData(rRes.data.data || []);
//     } catch (err) { showError(err); }
//     finally { setCancelledLoading(false); }
//   }, []);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LIFECYCLE
//   // ═══════════════════════════════════════════════════════════════════════════
//   useEffect(() => {
//     if (!canViewAnyTab) {
//       showError('You do not have permission to view any All Booking tabs');
//       navigate('/dashboard');
//       return;
//     }
//     fetchTab(activeTab, 1, DEFAULT_LIMIT);
//     fetchCancellationData();
//   }, []);

//   useEffect(() => {
//     if (!canViewAnyTab) return;
//     const visible = [0,1,2,3,4,5,6].filter(i => canViewBookingInTab[i]);
//     if (visible.length > 0 && !visible.includes(activeTab)) setActiveTab(visible[0]);
//   }, [canViewAnyTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // REFRESH after mutations
//   // ═══════════════════════════════════════════════════════════════════════════
//   const refreshCurrentTab = useCallback(() => {
//     if (activeTab < TAB.CANCELLED) {
//       // Preserve current limit but reset everything else including search
//       const limit = tabData[activeTab].limit || DEFAULT_LIMIT;
//       // Reset tab to empty (clears search string, docs, pagination)
//       setTab(activeTab, { ...emptyTab(), limit });
//       // Clear local search display state
//       setLocalSearch('');
//       // Clear the uncontrolled DOM input value
//       if (searchInputRef.current) searchInputRef.current.value = '';
//       // Fetch fresh data with no search
//       fetchTab(activeTab, 1, limit, '');
//     } else {
//       fetchCancellationData();
//     }
//   }, [activeTab, tabData, setTab, fetchTab, fetchCancellationData, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TAB CHANGE — always fetch fresh with empty search when switching tabs
//   // FIX: Previously tabs kept stale search results when revisited because
//   //      fetchTab was only called if docs.length === 0. Now we ALWAYS
//   //      re-fetch with empty search on every tab switch, so coming back
//   //      to a previously-searched tab shows the full unfiltered list.
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleTabChange = useCallback((tab) => {
//     // Cancel any pending debounced search for the tab we're leaving
//     clearTimeout(searchTimer.current);

//     setActiveTab(tab);

//     // Clear local search display state
//     setLocalSearch('');

//     // Clear the uncontrolled DOM input value
//     if (searchInputRef.current) searchInputRef.current.value = '';

//     if (tab < TAB.CANCELLED) {
//       setTabData(prev => {
//         const td    = prev[tab];
//         const limit = td.limit || DEFAULT_LIMIT;

//         // Reset the tab's search string immediately so the "No results for X"
//         // empty-state message never flashes when returning to the tab
//         const resetTab = { ...td, search: '' };

//         // Always re-fetch fresh data with no search filter when switching tabs.
//         // Using setTimeout(0) so the state update above is flushed first.
//         setTimeout(() => fetchTab(tab, 1, limit, ''), 0);

//         return { ...prev, [tab]: resetTab };
//       });
//     }
//     // Cancellation tabs (5 & 6) don't need a re-fetch here;
//     // their data is already loaded and they do client-side filtering only.
//   }, [fetchTab, searchInputRef]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handlePageChange = useCallback((tabIndex, newPage) => {
//     if (newPage < 1) return;
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (newPage > td.pages) return prev;

//       if (td._allDocs) {
//         const start = (newPage - 1) * td.limit;
//         const docs  = td._allDocs.slice(start, start + td.limit);
//         return { ...prev, [tabIndex]: { ...td, docs, currentPage: newPage } };
//       } else {
//         fetchTab(tabIndex, newPage, td.limit, td.search);
//         return prev;
//       }
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ROWS PER PAGE CHANGE
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleLimitChange = useCallback((tabIndex, newLimit) => {
//     const limit = parseInt(newLimit, 10);
//     setTabData(prev => {
//       const td = prev[tabIndex];
//       if (td._allDocs) {
//         const pages = Math.max(1, Math.ceil(td._allDocs.length / limit));
//         return { ...prev, [tabIndex]: { ...td, docs: td._allDocs.slice(0, limit), limit, currentPage: 1, pages } };
//       } else {
//         fetchTab(tabIndex, 1, limit, td.search);
//         return prev;
//       }
//     });
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // SEARCH
//   // ═══════════════════════════════════════════════════════════════════════════
//   const activeTabRef = useRef(activeTab);
//   useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

//   const handleSearch = useCallback((value) => {
//     if (activeTabRef.current >= TAB.CANCELLED) {
//       setCancelledSearch(value);
//       setCancelledPendingPage(1);
//       setCancelledRejectedPage(1);
//       return;
//     }

//     setLocalSearch(value);

//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       const tab = activeTabRef.current;
//       setTabData(prev => {
//         const limit = prev[tab]?.limit || DEFAULT_LIMIT;
//         fetchTab(tab, 1, limit, value);
//         return prev;
//       });
//     }, 500);
//   }, [fetchTab]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // CANCELLATION CLIENT-SIDE FILTER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const getFilteredCancelled = useCallback((data) => {
//   if (!cancelledSearch) return data;
//   const t = cancelledSearch.toLowerCase();
//   return data.filter(c =>
//     // Only search by customer name for cancellation tabs (booking ID not available)
//     (c.customer?.name || '').toLowerCase().includes(t)
//   );
// }, [cancelledSearch]);

//   const getCancelledPage = useCallback((data, page) => {
//     const start = (page - 1) * cancelledLimit;
//     return data.slice(start, start + cancelledLimit);
//   }, [cancelledLimit]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   // PAGINATION RENDERERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderPagination = (tabIndex) => {
//     const { currentPage, pages, total, limit, loading } = tabData[tabIndex];
//     if (!total) return null;

//     const start = (currentPage - 1) * limit + 1;
//     const end   = Math.min(currentPage * limit, total);

//     let sp = Math.max(1, currentPage - 2);
//     let ep = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3)         ep = Math.min(5, pages);
//     if (currentPage >= pages - 2) sp = Math.max(1, pages - 4);
//     const pageNums = [];
//     for (let i = sp; i <= ep; i++) pageNums.push(i);

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={limit} onChange={e => handleLimitChange(tabIndex, e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm" disabled={loading}>
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} records`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={currentPage === 1 || loading}>«</CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage - 1)} disabled={currentPage === 1 || loading}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {sp > 1 && <><CPaginationItem onClick={() => handlePageChange(tabIndex, 1)} disabled={loading}>1</CPaginationItem>{sp > 2 && <CPaginationItem disabled>…</CPaginationItem>}</>}
//             {pageNums.map(p => <CPaginationItem key={p} active={p === currentPage} onClick={() => handlePageChange(tabIndex, p)} disabled={loading}>{p}</CPaginationItem>)}
//             {ep < pages && <>{ep < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}<CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={loading}>{pages}</CPaginationItem></>}
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, currentPage + 1)} disabled={currentPage === pages || loading}><CIcon icon={cilChevronRight} /></CPaginationItem>
//             <CPaginationItem onClick={() => handlePageChange(tabIndex, pages)} disabled={currentPage === pages || loading}>»</CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   const renderCancelledPagination = (data, page, setPage) => {
//     const total = data.length;
//     if (total <= cancelledLimit) return null;
//     const pages = Math.ceil(total / cancelledLimit);
//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Rows per page:</CFormLabel>
//             <CFormSelect value={cancelledLimit} onChange={e => { setCancelledLimit(parseInt(e.target.value, 10)); setPage(1); }}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }} size="sm">
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             Showing {(page - 1) * cancelledLimit + 1}–{Math.min(page * cancelledLimit, total)} of {total}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><CIcon icon={cilChevronLeft} /></CPaginationItem>
//             {Array.from({ length: pages }, (_, i) => i + 1).map(p =>
//               <CPaginationItem key={p} active={p === page} onClick={() => setPage(p)}>{p}</CPaginationItem>
//             )}
//             <CPaginationItem onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}><CIcon icon={cilChevronRight} /></CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ACTION HANDLERS
//   // ═══════════════════════════════════════════════════════════════════════════
//   const handleClick = (e, id) => { setAnchorEl(e.currentTarget); setMenuId(id); };
//   const handleClose = () => { setAnchorEl(null); setMenuId(null); };

//   const handleOpenRestoreModal = (bookingId, type) => {
//     if (type === 'rejected_discount' && !canRestoreFromRejectedDiscount) { showError('No permission to restore'); return; }
//     if (type === 'cancelled'         && !canRestoreFromRejectedCancelled) { showError('No permission to restore'); return; }
//     setSelectedRestoreBooking(bookingId); setRestoreType(type);
//     setRestoreReason(''); setRestoreNotes(''); setRestoreBookingModal(true); handleClose();
//   };

//   const handleRestoreBooking = async () => {
//     const ok = restoreType === 'cancelled' ? canRestoreFromRejectedCancelled : canRestoreFromRejectedDiscount;
//     if (!ok || !selectedRestoreBooking) return;
//     try {
//       setRestoreLoading(true);
//       const url = restoreType === 'cancelled'
//         ? `/bookings/${selectedRestoreBooking}/restore`
//         : `/bookings/${selectedRestoreBooking}/reset-rejected-status`;
//       await axiosInstance.put(url, { reason: restoreReason.trim() || undefined, notes: restoreNotes.trim() || undefined });
//       showSuccess('Booking restored successfully!');
//       setRestoreBookingModal(false); setSelectedRestoreBooking(null); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to restore booking'); }
//     finally { setRestoreLoading(false); }
//   };

//   const handleOpenAvailableDocs = async (bookingId) => {
//     if (!canViewAllBooking) { showError('No permission to view available documents'); return; }
//     try {
//       setLoadingTemplates(true); setSelectedBookingForDocs(bookingId);
//       const res = await axiosInstance.get(`/templates/booking/${bookingId}/available`);
//       setAvailableTemplates(res.data.data); setAvailableDocsModal(true);
//       setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError('Failed to fetch available documents'); }
//     finally { setLoadingTemplates(false); }
//     handleClose();
//   };

//   const handleTemplateSelection = (id, canDownload) => {
//     if (!canDownload) return;
//     setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const handleSelectAllAvailable = () =>
//     setSelectedTemplateIds((availableTemplates?.available_templates?.templates || []).filter(t => t.can_download).map(t => t.template_id));

//   const handleSubmitTemplateSelection = async () => {
//     if (!canUpdateInApprovedTab) { showError('No permission to select templates'); return; }
//     if (!selectedBookingForDocs || !selectedTemplateIds.length) { showError('Please select at least one template'); return; }
//     try {
//       setSubmittingSelection(true);
//       await axiosInstance.post('/booking-templates/select', { bookingId: selectedBookingForDocs, templateIds: selectedTemplateIds, notes: templateNotes.trim() || undefined });
//       showSuccess('Templates selected successfully!');
//       setAvailableDocsModal(false); setSelectedBookingForDocs(null);
//       setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes('');
//     } catch (err) { showError(err.response?.data?.message || 'Failed to select templates'); }
//     finally { setSubmittingSelection(false); }
//   };

//   const handleApproveCancellation = (c) => {
//     if (!canApproveCancellation) { showError('No permission to approve cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('APPROVE');
//     setEditedReason(c.cancellationRequest?.reason || '');
//     setCancellationCharges(c.cancellationRequest?.cancellationCharges || 0);
//     setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleRejectCancellation = (c) => {
//     if (!canRejectCancellation) { showError('No permission to reject cancellations'); return; }
//     setSelectedCancellationForApproval(c); setCancelApprovalAction('REJECT');
//     setRejectionReason(''); setNotes(''); setCancelApprovalModal(true);
//   };

//   const handleCancelActionSubmit = async () => {
//     if (!selectedCancellationForApproval) return;
//     try {
//       setCancelActionLoading(true);
//       if (cancelApprovalAction === 'APPROVE') {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, {
//           reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
//           editedReason, cancellationCharges, notes,
//         });
//         showSuccess('Cancellation approved!');
//       } else {
//         await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, { rejectionReason, notes });
//         showSuccess('Cancellation rejected!');
//       }
//       setCancelApprovalModal(false); setSelectedCancellationForApproval(null);
//       setEditedReason(''); setCancellationCharges(0); setNotes(''); setRejectionReason('');
//       fetchCancellationData();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process cancellation'); }
//     finally { setCancelActionLoading(false); }
//   };

//   const handleApproveChassis = (id) => {
//     if (!canApproveChassis) { showError('No permission to approve chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('APPROVE'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleRejectChassis = (id) => {
//     if (!canRejectChassis) { showError('No permission to reject chassis'); return; }
//     setSelectedBookingForApproval(id); setApprovalAction('REJECT'); setApprovalNote(''); setChassisApprovalModal(true); handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!selectedBookingForApproval || !approvalNote.trim()) { showError('Please enter approval/rejection note'); return; }
//     try {
//       setApprovalLoading(true);
//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, { action: approvalAction, approvalNote: approvalNote.trim() });
//       showSuccess(`Chassis ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'}!`);
//       setChassisApprovalModal(false); setSelectedBookingForApproval(null); setApprovalNote(''); refreshCurrentTab();
//     } catch (err) { showError(err.response?.data?.message || 'Failed to process chassis'); }
//     finally { setApprovalLoading(false); }
//   };

//   const handleViewBooking = async (id) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view booking'); return; }
//     try {
//       const res = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(res.data.data); setViewModalVisible(true); handleClose();
//     } catch (err) { showError('Failed to fetch booking details'); }
//   };

//   const handlePrint = (id) => {
//     if (!canPrintInTab[activeTab]) { showError('No permission to print in this tab'); return; }
//     setSelectedBookingForPrint(id); setPrintModalVisible(true); handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view KYC'); return; }
//     try {
//       setKycBookingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       const res = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       setKycData({ 
//         ...res.data.data, 
//         status: booking.documentStatus?.kyc?.status || 'PENDING', 
//         customerName: getFullCustomerName(booking.customerDetails), 
//         address: `${booking.customerDetails?.address || ''}, ${booking.customerDetails?.taluka || ''}, ${booking.customerDetails?.district || ''}, ${booking.customerDetails?.pincode || ''}` 
//       });
//       setKycModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const booking = tabData[activeTab].docs.find(b => b._id === bookingId || b.id === bookingId);
//       if (!booking) { showError('Booking not found'); return; }
//       setFinanceData({ 
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING', 
//         customerName: getFullCustomerName(booking.customerDetails), 
//         bookingId: booking._id 
//       });
//       setFinanceBookingId(bookingId); setFinanceModalVisible(true); handleClose();
//     } catch (err) { showError(err); }
//     finally { setActionLoadingId(null); }
//   };

//   const handleViewFinanceLetterReceipt = async (bookingId) => {
//     if (!canViewBookingInTab[activeTab]) { showError('No permission to view finance letters'); return; }
//     try {
//       setActionLoadingId(bookingId);
//       const [bRes, dRes] = await Promise.all([
//         axiosInstance.get(`/bookings/${bookingId}`),
//         axiosInstance.get(`/disbursements/bookings/${bookingId}/disbursements`),
//       ]);
//       const bd  = bRes.data.data;
//       const dis = dRes.data.success && dRes.data.data.disbursements.length > 0
//         ? dRes.data.data.disbursements[0]?.disbursementAmount || 0 : 0;
//       const tab = window.open('', '_blank');
//       tab.document.write(generateFinanceLetterHTML(bd, dis));
//       tab.document.close();
//     } catch (err) { showError('Failed to fetch finance letter data'); }
//     finally { setActionLoadingId(null); handleClose(); }
//   };

//   const generateFinanceLetterHTML = (bd, disbursementAmount) => {
//     const today       = new Date().toLocaleDateString('en-GB');
//     const dealAmount  = bd?.discountedAmount || 0;
//     const gcAmount    = bd?.payment?.gcAmount || 0;
//     const exchAmt     = bd?.exchangeDetails?.price || 0;
//     const downPayment = (dealAmount + gcAmount) - disbursementAmount - exchAmt;
//     const customerName = getFullCustomerName(bd?.customerDetails);
//     return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>FINANCER'S ASSURANCE LETTER</title><style>@page{size:A4;margin:20mm}body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.4;margin:0;padding:0;background:#f5f5f5}.page{width:210mm;min-height:297mm;margin:10mm auto;padding:15mm;background:white;box-shadow:0 0 10px rgba(0,0,0,.1);box-sizing:border-box}.details-table{width:100%;border-collapse:collapse;margin:20px 0}.details-table,.details-table td{border:1px solid black}.details-table td{padding:8px;vertical-align:top}.left-col{width:70%;font-weight:bold}.instruction-text{margin:15px 0;text-align:justify}.signature-box{width:25%;border-top:1px dashed black;margin-top:5px;margin-left:auto;padding:1px 0;text-align:right;color:#555;font-weight:bold}@media print{body{background:white}.page{box-shadow:none;margin:0;padding:0;width:100%}}</style></head><body><div class="page"><div style="text-align:right">Date: <strong>${today}</strong></div><div style="margin:15px 0">To,<br>The Director/Manager,<br>Gandhi Motors Pvt Ltd,<br>Nasik</div><div style="font-weight:bold;margin:15px 0">Sub:- Delivery Order &amp; Disbursement Assurance letter.</div><div style="margin:15px 0">Dear sir,</div><div>We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:</div><div style="margin:15px 0">Name : Mr./Mrs. : <strong>${customerName}</strong></div><div style="margin:15px 0">Vehicle make &amp; model : <strong>${bd?.model?.model_name||bd?.model?.name||''}</strong> &nbsp;&nbsp; Booking Number: <strong>${bd?.bookingNumber||''}</strong></div><table class="details-table"><tr><td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td><td>${dealAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Disbursement Amount assured by finance company</td><td>${disbursementAmount.toLocaleString('en-IN')}</td></tr><tr><td class="left-col">Net Down Payment to be taken from Customer</td><td>${downPayment.toLocaleString('en-IN')}</td></tr></table><div class="instruction-text">The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.</div><div class="instruction-text">This letter is non revokable &amp; we promise to pay you the above-mentioned loan amount within stipulated time.</div><div class="instruction-text">You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office &amp; give us the details of RTO registration along with the invoice, insurance &amp; Down payment receipt.</div><div class="instruction-text">Please do the needful.</div><div style="margin-top:40px"><div>For &amp; on behalf of</div><div>Financer's / Bank</div><div>Name: <strong>${bd?.payment?.financer?.name||''}</strong></div><div style="margin-top:15px">Employee Name: ________________________________</div><div style="margin-top:15px">Mobile No: ________________________________</div></div><div class="signature-box"><strong>Authorised Signature</strong></div></div></body></html>`;
//   };

//   const handleAllocateChassis = (id) => {
//     if (!canAllocateChassisInApprovedTab) { showError('No permission to allocate chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(false); setShowChassisModal(true); handleClose();
//   };

//   const handleUpdateChassis = (id) => {
//     if (!canUpdateChassisInAllocatedTab) { showError('No permission to update chassis'); return; }
//     setSelectedBookingForChassis(id); setIsUpdateChassis(true); setShowChassisModal(true); handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     const ok = isUpdateChassis ? canUpdateChassisInAllocatedTab : canAllocateChassisInApprovedTab;
//     if (!ok) { showError('No permission to save chassis number'); return; }
//     try {
//       setChassisLoading(true); setChassisError('');
//       let url = `/bookings/${selectedBookingForChassis}/allocate`;
//       if (payload.reason) url += `?reason=${encodeURIComponent(payload.reason)}`;
//       const fd = new FormData();
//       fd.append('chassisNumber', payload.chassisNumber);
//       fd.append('is_deviation', payload.is_deviation);
//       if (payload.note) fd.append('note', payload.note);
//       if (payload.claimDetails) {
//         fd.append('hasClaim', 'true');
//         fd.append('priceClaim', payload.claimDetails.price);
//         fd.append('description', payload.claimDetails.description);
//         payload.claimDetails.documents.forEach(f => fd.append('documents', f));
//       } else { fd.append('hasClaim', 'false'); }
//       const res = await axiosInstance.put(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//       showSuccess(res.data.message);
//       setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError('');
//       refreshCurrentTab();
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || 'Failed to save chassis number';
//       setChassisError(msg); showError(msg);
//     } finally { setChassisLoading(false); }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     if (!canViewPendingApprovalsTab) { showError('No permission to view alteration requests'); return; }
//     setSelectedUpdate(booking); setDetailsModalOpen(true); handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     if (!canApproveUpdate) { showError('No permission to approve updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/approve-update`, payload); showSuccess('Update approved'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     if (!canRejectUpdate) { showError('No permission to reject updates'); return; }
//     try { setLoadingId(id); await axiosInstance.post(`/bookings/${id}/reject-update`, payload); showSuccess('Update rejected'); refreshCurrentTab(); setDetailsModalOpen(false); }
//     catch (err) { showError(err); } finally { setLoadingId(null); }
//   };

//   const handleDelete = async (id) => {
//     const ok = activeTab === 0 ? canDeleteBookingInPendingApprovals : canDeleteBookingInRejectedDiscount;
//     if (!ok) { showError('No permission to delete bookings'); return; }
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try { await axiosInstance.delete(`/bookings/${id}`); showSuccess('Booking deleted'); refreshCurrentTab(); }
//       catch (err) { showError(err.response?.data?.message || 'Failed to delete booking'); }
//     }
//   };

//   const getAuthToken = () => token || localStorage.getItem('token') || localStorage.getItem('authToken');

//   const handleExportConfirm = async () => {
//     try {
//       setExportLoading(true);
//       const authToken = getAuthToken();
//       if (!authToken) { showError('Please login'); setExportLoading(false); setShowExportModal(false); return; }
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const branchId = userData.branchId || '695a32b2e3a6522ef7138420';
//       const { startDate, endDate } = exportDateRange;
//       const exportUrl = `${config.baseURL}/reports/branch-sales?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&format=excel`;
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', exportUrl, true);
//       xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
//       xhr.responseType = 'blob';
//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a'); a.href = url;
//           a.download = `branch-sales-${startDate}-to-${endDate}.xlsx`;
//           document.body.appendChild(a); a.click(); document.body.removeChild(a);
//           window.URL.revokeObjectURL(url);
//           showSuccess('Excel downloaded!'); setShowExportModal(false);
//         } else { showError(xhr.status === 401 ? 'Please login' : 'Download failed'); }
//         setExportLoading(false);
//       };
//       xhr.onerror = () => { showError('Network error'); setExportLoading(false); };
//       xhr.send();
//     } catch (err) { showError('Export failed'); setExportLoading(false); }
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // TABLE RENDERER
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderBookingTable = (tabIndex) => {
//     if (!canViewBookingInTab[tabIndex]) {
//       const names = ['PENDING APPROVALS','APPROVED','PENDING ALLOCATED','ALLOCATED','REJECTED DISCOUNT','CANCELLED BOOKING','REJECTED CANCELLED BOOKING'];
//       return <CAlert color="warning">You do not have permission to view the {names[tabIndex]} tab.</CAlert>;
//     }

//     const canCreate    = canPrintInTab[tabIndex];
//     const canUploadKyc = () => [canUploadKycInPendingApprovals, canUploadKycInApprovedTab, false, canUploadKycInAllocatedTab, canUploadKycInRejectedDiscount][tabIndex] ?? false;
//     const canUploadFin = () => [canUploadFinanceInPendingApprovals, canUploadFinanceInApprovedTab, false, canUploadFinanceInAllocatedTab, canUploadFinanceInRejectedDiscount][tabIndex] ?? false;
//     const canEditThis  = () => tabIndex === 0 ? canEditInPendingApprovalsTab : tabIndex === 4 ? canEditInRejectedDiscountTab : false;
//     const getDocumentUrl = path => `https://gmplmis.com/dealership-api/api/v1/uploads${path}`;

//     // ── Cancellation tabs ────────────────────────────────────────────────────
//     if (tabIndex === TAB.CANCELLED || tabIndex === TAB.REJECTED_CANCELLED) {
//       const raw      = tabIndex === TAB.CANCELLED ? cancelledPendingData : cancelledRejectedData;
//       const filtered = getFilteredCancelled(raw);
//       const page     = tabIndex === TAB.CANCELLED ? cancelledPendingPage  : cancelledRejectedPage;
//       const setPage  = tabIndex === TAB.CANCELLED ? setCancelledPendingPage : setCancelledRejectedPage;
//       const records  = getCancelledPage(filtered, page);

//       return (
//         <>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className="responsive-table">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Contact</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Reason</CTableHeaderCell>
//                   <CTableHeaderCell>Requested At</CTableHeaderCell>
//                   <CTableHeaderCell>Requested By</CTableHeaderCell>
//                   <CTableHeaderCell>Cancellation Charges</CTableHeaderCell>
//                   <CTableHeaderCell>Received Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Refund Amount</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {tabIndex === TAB.REJECTED_CANCELLED && <CTableHeaderCell>Rejection Reason</CTableHeaderCell>}
//                   <CTableHeaderCell>Options</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {records.length === 0 ? (
//                   <CTableRow><CTableDataCell colSpan={13} className="text-center text-danger">No cancellation requests available</CTableDataCell></CTableRow>
//                 ) : records.map((c, i) => (
//                   <CTableRow key={c._id || i}>
//                     <CTableDataCell>{(page - 1) * cancelledLimit + i + 1}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.name  || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.customer?.phone || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.bookingDate ? new Date(c.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedAt ? new Date(c.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
//                     <CTableDataCell>{c.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.cancellationCharges || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.received            || 0}</CTableDataCell>
//                     <CTableDataCell>₹{c.financials?.refundAmount        || 0}</CTableDataCell>
//                     <CTableDataCell><span className={`status-badge ${c.cancellationRequest?.status?.toLowerCase() || ''}`}>{c.cancellationRequest?.status || 'N/A'}</span></CTableDataCell>
//                     {tabIndex === TAB.REJECTED_CANCELLED && <CTableDataCell>{c.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>
//                       {tabIndex === TAB.CANCELLED && (
//                         <div className="d-flex gap-1">
//                           <CButton size="sm" color="success" onClick={() => handleApproveCancellation(c)} disabled={!canApproveCancellation}><CIcon icon={cilCheck} /> Approve</CButton>
//                           <CButton size="sm" color="danger"  onClick={() => handleRejectCancellation(c)}  disabled={!canRejectCancellation}><CIcon icon={cilX} /> Reject</CButton>
//                         </div>
//                       )}
//                       {tabIndex === TAB.REJECTED_CANCELLED && (
//                         <CButton size="sm" color="primary" onClick={() => handleOpenRestoreModal(c._id, 'cancelled')} disabled={!canRestoreFromRejectedCancelled}>Back to Normal</CButton>
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </div>
//           {renderCancelledPagination(filtered, page, setPage)}
//         </>
//       );
//     }

//     // ── Booking tabs 0–4 ─────────────────────────────────────────────────────
//     const td      = tabData[tabIndex];
//     const records = td.docs;

//     return (
//       <>
//         {td.loading && (
//           <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//             <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//           </div>
//         )}
//         <div className="responsive-table-wrapper" style={{ opacity: td.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//           <CTable striped bordered hover className="responsive-table">
//             <CTableHead>
//               <CTableRow>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Sr.no</CTableHeaderCell>}
//                 <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                 <CTableHeaderCell>Model Name</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Type</CTableHeaderCell>}
//                 <CTableHeaderCell>Color</CTableHeaderCell>
//                 <CTableHeaderCell>Fullname</CTableHeaderCell>
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Contact1</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Finance Letter</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && <CTableHeaderCell>Upload Finance</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Upload KYC</CTableHeaderCell>}
//                 <CTableHeaderCell>Status</CTableHeaderCell>
//                 {tabIndex === 0 && <CTableHeaderCell>Altration Request</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Is Claim</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Chassis Number</CTableHeaderCell>}
//                 {tabIndex === 3 && <CTableHeaderCell>Claim Documents</CTableHeaderCell>}
//                 {tabIndex !== 2 && tabIndex !== 4 && <CTableHeaderCell>Print</CTableHeaderCell>}
//                 {tabIndex === 2 && <CTableHeaderCell>Note</CTableHeaderCell>}
//                 <CTableHeaderCell>Action</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.length === 0 && !td.loading ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan={20} className="text-center text-danger">
//                     {td.search ? `No results found for "${td.search}"` : 'No booking available'}
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : records.map((booking, index) => {
//                 const globalIndex = (td.currentPage - 1) * td.limit + index + 1;
//                 const bid = booking._id || booking.id;
//                 return (
//                   <CTableRow key={bid}>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{globalIndex}</CTableDataCell>}
//                     <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                     <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.model?.type || 'N/A'}</CTableDataCell>}
//                     <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                     <CTableDataCell>{getFullCustomerName(booking.customerDetails)}</CTableDataCell>
//                     {tabIndex !== 2 && tabIndex !== 4 && <CTableDataCell>{booking.customerDetails?.mobile1 || ''}</CTableDataCell>}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && canCreate && (
//                           <CButton size="sm" className="view-button" onClick={() => handlePrint(bid)}>Print</CButton>
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.payment?.type === 'FINANCE' && (
//                           <>
//                             {canUploadFin() && ['NOT_UPLOADED','REJECTED'].includes(booking.documentStatus?.financeLetter?.status) ? (
//                               <Link to={`/upload-finance/${bid}`} state={{ bookingId: bid, customerName: getFullCustomerName(booking.customerDetails), address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//                                 <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></CButton>
//                               </Link>
//                             ) : null}
//                             {booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                               <span className={`status-badge ${booking.documentStatus?.financeLetter?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.financeLetter?.status || ''}</span>
//                             )}
//                           </>
//                         )}
//                       </CTableDataCell>
//                     )}

//                 {tabIndex !== 2 && tabIndex !== 4 && (
//   <CTableDataCell>
//     {(booking.documentStatus?.kyc?.status === 'NOT_UPLOADED' || booking.documentStatus?.kyc?.status === 'INCOMPLETE') ? (
//       <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: getFullCustomerName(booking.customerDetails), address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }}>
//         <CButton 
//           size="sm" 
//           className="upload-kyc-btn icon-only"
//           style={{
//             backgroundColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//             borderColor: booking.documentStatus?.kyc?.status === 'INCOMPLETE' ? '#FD7E14' : '#0d6efd',
//             color: 'white'
//           }}
//         >
//           <CIcon icon={cilCloudUpload} />
//         </CButton>
//       </Link>
//     ) : (
//       <div className="d-flex align-items-center">
//         <span className={`status-badge ${booking.documentStatus?.kyc?.status?.toLowerCase() || ''}`}>{booking.documentStatus?.kyc?.status || ''}</span>
//         {booking.documentStatus?.kyc?.status === 'REJECTED' && (
//           <Link to={`/upload-kyc/${bid}`} state={{ bookingId: bid, customerName: getFullCustomerName(booking.customerDetails), address: `${booking.customerDetails?.address||''}, ${booking.customerDetails?.taluka||''}, ${booking.customerDetails?.district||''}, ${booking.customerDetails?.pincode||''}` }} className="ms-2">
//             <button className="upload-kyc-btn icon-only"><CIcon icon={cilCloudUpload} /></button>
//           </Link>
//         )}
//       </div>
//     )}
//   </CTableDataCell>
// )}

//                     <CTableDataCell>
//                       <span className="status-badge" style={{
//                         backgroundColor:
//                           booking.status === 'FREEZZED'                              ? '#ffc107' :
//                           booking.status === 'PENDING_APPROVAL'                      ? '#0d6efd' :
//                           booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'  ? '#fd7e14' :
//                           booking.status === 'APPROVED'                              ? '#198754' :
//                           booking.status === 'REJECTED'                              ? '#dc3545' :
//                           booking.status === 'ALLOCATED'                             ? '#6f42c1' : '#6c757d',
//                         color: booking.status === 'FREEZZED' ? '#000' : '#fff',
//                         padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
//                         fontWeight: '500', display: 'inline-block',
//                       }}>
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
//                         {booking.claimDetails?.hasClaim
//                           ? <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                           : <CIcon icon={cilXCircle}    className="status-icon inactive-icon" />}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                     {tabIndex === 3 && (
//                       <CTableDataCell>
//                         {booking.claimDetails?.hasClaim && booking.claimDetails?.documents?.length > 0 ? (
//                           <CDropdown>
//                             <CDropdownToggle size="sm" color="info" variant="outline">{booking.claimDetails.documents.length} Doc{booking.claimDetails.documents.length > 1 ? 's' : ''}</CDropdownToggle>
//                             <CDropdownMenu>
//                               {booking.claimDetails.documents.map((doc, di) => (
//                                 <CDropdownItem key={di} onClick={() => window.open(getDocumentUrl(doc.path), '_blank')}>
//                                   <CIcon icon={cilDescription} className="me-2" />
//                                   <strong>{doc.originalName || `Document ${di + 1}`}</strong>
//                                   <small className="ms-2">{(doc.size / 1024).toFixed(2)} KB</small>
//                                 </CDropdownItem>
//                               ))}
//                             </CDropdownMenu>
//                           </CDropdown>
//                         ) : booking.claimDetails?.hasClaim
//                           ? <span className="text-muted">No documents</span>
//                           : <span className="text-muted">-</span>}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex !== 2 && tabIndex !== 4 && (
//                       <CTableDataCell>
//                         {booking.formPath && (
//                           user?.is_sales_executive && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                             <span className="awaiting-approval-text">Awaiting for Approval</span>
//                           ) : canCreate ? (
//                             <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                               <CButton size="sm" className="upload-kyc-btn icon-only"><CIcon icon={cilPrint} /></CButton>
//                             </a>
//                           ) : null
//                         )}
//                       </CTableDataCell>
//                     )}

//                     {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}

//                     <CTableDataCell>
//                       <CButton size="sm" className="option-button btn-sm" onClick={e => handleClick(e, bid)}>
//                         <CIcon icon={cilSettings} /> Options
//                       </CButton>
//                       <Menu id={`action-menu-${bid}`} anchorEl={anchorEl} open={menuId === bid} onClose={handleClose}>
//                         {canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewBooking(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Booking</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.updateRequestStatus === 'PENDING' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Altration Req</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex === 4 && canRestoreFromRejectedDiscount && (
//                           <MenuItem onClick={() => handleOpenRestoreModal(bid, 'rejected_discount')} style={{ color: 'black' }}><CIcon icon={cilCheck} className="me-2" /> Back to Normal</MenuItem>
//                         )}
//                         {canEditThis() && tabIndex !== 2 && tabIndex !== 3 && tabIndex !== 4 && booking.status !== 'FREEZZED' && booking.status !== 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 1 && canUpdateInApprovedTab && booking.status === 'APPROVED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 0 && canDeleteBookingInPendingApprovals && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 4 && canDeleteBookingInRejectedDiscount && (
//                           <MenuItem onClick={() => handleDelete(bid)} style={{ color: 'black' }}><CIcon icon={cilTrash} className="me-2" /> Delete</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.payment?.type === 'FINANCE' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => handleViewFinanceLetterReceipt(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilDescription} className="me-2" /> View Finance Letter Receipt</MenuItem>
//                         )}
//                         {booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && canViewBookingInTab[tabIndex] && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id || bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter</MenuItem>
//                         )}
//                         {canViewBookingInTab[tabIndex] && booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewKYC(bid)} style={{ color: 'black' }}><CIcon icon={cilZoomOut} className="me-2" /> View KYC</MenuItem>
//                         )}
//                         {tabIndex === 1 && canAllocateChassisInApprovedTab && booking.status === 'APPROVED' && (booking.payment?.type === 'CASH' || (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status === 'APPROVED')) && (
//                           <MenuItem onClick={() => handleAllocateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Allocate Chassis</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateChassisInAllocatedTab && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                           <MenuItem onClick={() => handleUpdateChassis(bid)} style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Change Vehicle</MenuItem>
//                         )}
//                         {tabIndex === 3 && canUpdateInAllocatedTab && booking.status === 'ALLOCATED' && (
//                           <Link className="Link" to={`/booking-form/${bid}`} style={{ textDecoration: 'none' }}>
//                             <MenuItem style={{ color: 'black' }}><CIcon icon={cilPencil} className="me-2" /> Edit</MenuItem>
//                           </Link>
//                         )}
//                         {tabIndex === 2 && (booking.status === 'ON_HOLD' || booking.status === 'PENDING_GM_APPROVAL') && (
//                           <>
//                             {canApproveChassis && <MenuItem onClick={() => handleApproveChassis(bid)} style={{ color: 'green' }}><CIcon icon={cilCheck} className="me-2" /> Approve Chassis</MenuItem>}
//                             {canRejectChassis  && <MenuItem onClick={() => handleRejectChassis(bid)}  style={{ color: 'red'   }}><CIcon icon={cilX}     className="me-2" /> Reject Chassis</MenuItem>}
//                           </>
//                         )}
//                         {tabIndex === 1 && booking.status === 'APPROVED' && canViewBookingInTab[1] && (
//                           <MenuItem onClick={() => handleOpenAvailableDocs(bid)} style={{ color: 'black' }}><CIcon icon={cilFile} className="me-2" /> Available Documents</MenuItem>
//                         )}
//                         {tabIndex === 0 && booking.status === 'FREEZZED' && canViewBookingInTab[0] && (
//                           <MenuItem onClick={() => window.location.href = '/#/self-insurance'} style={{ color: 'black' }}><CIcon icon={cilSettings} className="me-2" /> Manage Self Insurance</MenuItem>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   </CTableRow>
//                 );
//               })}
//             </CTableBody>
//           </CTable>
//         </div>
//         {renderPagination(tabIndex)}
//       </>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   // LOADING / PERMISSION GUARDS
//   // ═══════════════════════════════════════════════════════════════════════════
//   if (!canViewAnyTab) {
//     return <div className="alert alert-danger m-3">You do not have permission to view any tabs in All Booking.</div>;
//   }

//   const currentSearch = activeTab >= TAB.CANCELLED ? cancelledSearch : localSearch;

//   // ═══════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════════════════
//   return (
//     <div>
//       <div className="title">Booking List</div>
//       {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}

//       <CCard className="table-container mt-4">
//         <CCardHeader className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             {canCreateAllBooking && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1"><CIcon icon={cilPlus} className="icon" /> New Booking</CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           {/* ── Tab nav ── */}
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             {[
//               [TAB.PENDING,            'Pending Approvals',  canViewPendingApprovalsTab],
//               [TAB.APPROVED,           'Approved',           canViewApprovedTab],
//               [TAB.PENDING_ALLOCATED,  'Pending Allocated',  canViewPendingAllocatedTab],
//               [TAB.ALLOCATED,          'Allocated',          canViewAllocatedTab],
//               [TAB.REJECTED,           'Rejected Discount',  canViewRejectedDiscountTab],
//               [TAB.CANCELLED,          'Cancelled Booking',  canViewCancelledBookingTab],
//               [TAB.REJECTED_CANCELLED, 'Rejected Cancelled', canViewRejectedCancelledBookingTab],
//             ].map(([idx, label, perm]) => perm && (
//               <CNavItem key={idx}>
//                 <CNavLink
//                   active={activeTab === idx}
//                   onClick={() => handleTabChange(idx)}
//                   style={{ cursor: 'pointer', borderTop: activeTab === idx ? '4px solid #2759a2' : '3px solid transparent', borderBottom: 'none', color: 'black' }}
//                 >
//                   {label}
//                 </CNavLink>
//               </CNavItem>
//             ))}
//           </CNav>

//           {/* ── Search bar (uncontrolled input to prevent focus loss) ── */}
//           <div className="d-flex justify-content-end mb-3">
//             <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
//             <input
//   ref={searchInputRef}
//   type="text"
//   defaultValue=""
//   style={{ maxWidth: '350px', height: '30px', borderRadius: '0', border: '1px solid #ced4da', padding: '0 8px', outline: 'none', fontSize: '14px' }}
//   className="d-inline-block square-search"
//   onChange={e => handleSearch(e.target.value)}
//   placeholder="Search by Booking ID or Customer Name..."
//   autoComplete="off"
// />
//           </div>

//           {/* ── Tab content ── */}
//           <CTabContent>
//             {[TAB.PENDING, TAB.APPROVED, TAB.PENDING_ALLOCATED, TAB.ALLOCATED, TAB.REJECTED].map(idx =>
//               canViewBookingInTab[idx] && (
//                 <CTabPane key={idx} visible={activeTab === idx}>
//                   {activeTab === idx && renderBookingTable(idx)}
//                 </CTabPane>
//               )
//             )}
//             {canViewCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.CANCELLED}>
//                 {activeTab === TAB.CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//             {canViewRejectedCancelledBookingTab && (
//               <CTabPane visible={activeTab === TAB.REJECTED_CANCELLED}>
//                 {activeTab === TAB.REJECTED_CANCELLED && (
//                   cancelledLoading
//                     ? <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>
//                     : renderBookingTable(TAB.REJECTED_CANCELLED)
//                 )}
//               </CTabPane>
//             )}
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* ═══ MODALS ═══ */}

//       {/* Export */}
//       <CModal visible={showExportModal} onClose={() => setShowExportModal(false)}>
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Export Excel Report</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Start Date:</CFormLabel><CFormInput type="date" value={exportDateRange.startDate} onChange={e => setExportDateRange(p => ({ ...p, startDate: e.target.value }))} /></div>
//           <div className="mb-3"><CFormLabel>End Date:</CFormLabel><CFormInput type="date" value={exportDateRange.endDate} onChange={e => setExportDateRange(p => ({ ...p, endDate: e.target.value }))} min={exportDateRange.startDate} /></div>
//           <CAlert color="info"><small>This will export the branch sales report for the selected date range.</small></CAlert>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowExportModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleExportConfirm} disabled={exportLoading || !exportDateRange.startDate || !exportDateRange.endDate}>
//             {exportLoading ? <><CSpinner size="sm" className="me-2" />Exporting…</> : 'Export Excel'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Restore */}
//       <CModal visible={restoreBookingModal} onClose={() => setRestoreBookingModal(false)}>
//         <CModalHeader><CModalTitle>Restore Booking to Normal</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>Reason:</CFormLabel><CFormTextarea value={restoreReason} onChange={e => setRestoreReason(e.target.value)} rows={2} placeholder="Enter reason" /></div>
//           <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={restoreNotes} onChange={e => setRestoreNotes(e.target.value)} rows={2} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setRestoreBookingModal(false)}>Cancel</CButton>
//           <CButton color="primary" onClick={handleRestoreBooking} disabled={restoreLoading}>
//             {restoreLoading ? <><CSpinner size="sm" className="me-2" />Processing…</> : 'Restore Booking'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Available Docs */}
//       <CModal visible={availableDocsModal} onClose={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }} size="lg">
//         <CModalHeader><CModalTitle><CIcon icon={cilFile} className="me-2" />Available Documents - {availableTemplates?.booking_number || ''}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {loadingTemplates ? (
//             <div className="text-center py-5"><CSpinner color="primary" /><p className="mt-3">Loading…</p></div>
//           ) : availableTemplates ? (
//             <div>
//               <h6>Customer: {availableTemplates.customer_name}</h6>
//               <div className="alert alert-info mb-3"><small><strong>Summary:</strong> {availableTemplates.summary.available_for_download} of {availableTemplates.summary.total_templates} available.</small></div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0">Templates ({availableTemplates.available_templates.count})</h6>
//                 <div className="d-flex gap-2">
//                   <CButton size="sm" color="primary" variant="outline" onClick={handleSelectAllAvailable}>Select All</CButton>
//                   <CButton size="sm" color="secondary" variant="outline" onClick={() => setSelectedTemplateIds([])}>Clear All</CButton>
//                 </div>
//               </div>
//               <div className="border rounded p-3">
//                 {(availableTemplates.available_templates.templates || []).map(t => (
//                   <div key={t.template_id} className="mb-3">
//                     <div className="form-check">
//                       <input className="form-check-input" type="checkbox" id={`tpl-${t.template_id}`} checked={selectedTemplateIds.includes(t.template_id)} onChange={() => handleTemplateSelection(t.template_id, t.can_download)} disabled={!t.can_download} />
//                       <label className="form-check-label d-flex justify-content-between align-items-center w-100" htmlFor={`tpl-${t.template_id}`} style={{ cursor: t.can_download ? 'pointer' : 'not-allowed', opacity: t.can_download ? 1 : 0.6 }}>
//                         <div><strong>{t.template_name}</strong><br /><small className="text-muted">{t.can_download ? 'Available' : 'Not available'}</small></div>
//                         {!t.can_download && <small className="text-danger"><CIcon icon={cilXCircle} className="me-1" />Disabled</small>}
//                       </label>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={templateNotes} onChange={e => setTemplateNotes(e.target.value)} rows={2} /></div>
//             </div>
//           ) : null}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => { setAvailableDocsModal(false); setSelectedBookingForDocs(null); setAvailableTemplates(null); setSelectedTemplateIds([]); setTemplateNotes(''); }}>Cancel</CButton>
//           <CButton color="primary" onClick={handleSubmitTemplateSelection} disabled={!selectedTemplateIds.length || submittingSelection}>
//             {submittingSelection ? <><CSpinner size="sm" className="me-2" />Processing…</> : `Select (${selectedTemplateIds.length}) Templates`}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Cancellation Approval */}
//       <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation' : 'Reject Cancellation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           {cancelApprovalAction === 'APPROVE' ? (
//             <>
//               <div className="mb-3"><CFormLabel>Original Reason:</CFormLabel><CFormInput type="text" value={selectedCancellationForApproval?.cancellationRequest?.reason || ''} readOnly /></div>
//               <div className="mb-3"><CFormLabel>Edited Reason (Optional):</CFormLabel><CFormTextarea value={editedReason} onChange={e => setEditedReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Cancellation Charges:</CFormLabel><CFormInput type="number" value={cancellationCharges} onChange={e => setCancellationCharges(Number(e.target.value))} min="0" /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           ) : (
//             <>
//               <div className="mb-3"><CFormLabel>Rejection Reason:</CFormLabel><CFormTextarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={2} /></div>
//               <div className="mb-3"><CFormLabel>Notes (Optional):</CFormLabel><CFormTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleCancelActionSubmit} disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}>
//             {cancelActionLoading ? <CSpinner size="sm" /> : cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Chassis Approval */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader><CModalTitle>{approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}</CModalTitle></CModalHeader>
//         <CModalBody>
//           <div className="mb-3"><CFormLabel>{approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}</CFormLabel><CFormTextarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={3} /></div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'} onClick={handleChassisApprovalSubmit} disabled={approvalLoading}>
//             {approvalLoading ? <CSpinner size="sm" /> : approvalAction === 'APPROVE' ? 'Approve' : 'Reject'}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Sub-components */}
//       <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={refreshCurrentTab} />
//       <KYCView open={kycModalVisible} onClose={() => { setKycModalVisible(false); setKycBookingId(null); }} kycData={kycData} refreshData={refreshCurrentTab} bookingId={kycBookingId} />
//       <FinanceView open={financeModalVisible} onClose={() => { setFinanceModalVisible(false); setFinanceBookingId(null); }} financeData={financeData} refreshData={refreshCurrentTab} bookingId={financeBookingId} />
//       <ChassisNumberModal show={showChassisModal} onClose={() => { setShowChassisModal(false); setIsUpdateChassis(false); setSelectedBookingForChassis(null); setChassisError(''); }} onSave={handleSaveChassisNumber} isLoading={chassisLoading} booking={tabData[activeTab]?.docs?.find(b => b._id === selectedBookingForChassis || b.id === selectedBookingForChassis)} isUpdate={isUpdateChassis} errorMessage={chassisError} onClearError={() => setChassisError('')} />
//       <PrintModal show={printModalVisible} onClose={() => { setPrintModalVisible(false); setSelectedBookingForPrint(null); }} bookingId={selectedBookingForPrint} />
//       <PendingUpdateDetailsModal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} updateData={selectedUpdate} onApprove={payload => handleApproveUpdate(selectedUpdate._id, payload)} onReject={payload => handleRejectUpdate(selectedUpdate._id, payload)} />
//     </div>
//   );
// };

// export default BookingList;
