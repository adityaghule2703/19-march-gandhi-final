// import '../../../css/table.css'
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   showError,
// } from '../../../utils/tableImports'
// import AddDebitNote from './AddDebitNote'
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
// } from '../../../utils/modulePermissions';
// import { useAuth } from '../../../context/AuthContext';

// const DebitNote = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([])
//   const { currentRecords, PaginationOptions } = usePagination(filteredData || [])
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [selectedBooking, setSelectedBooking] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [successMessage, setSuccessMessage] = useState('')

//   const { permissions } = useAuth();

//   // Page-level permission checks for Debit Note under ACCOUNT module
//   const canViewDebitNote = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
//   const canCreateDebitNote = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
//   const canUpdateDebitNote = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
//   const canDeleteDebitNote = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
  
//   const showActionColumn = canCreateDebitNote;

//   useEffect(() => {
//     if (!canViewDebitNote) {
//       return;
//     }
    
//     fetchData()
//   }, [canViewDebitNote])

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const response = await axiosInstance.get(`/bookings`)
//       const branchBookings = response.data.data.bookings.filter(
//         (booking) => booking.bookingType === 'BRANCH',
//       )
//       setData(branchBookings)
//       setFilteredData(branchBookings)
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddClick = (booking) => {
//     if (!canCreateDebitNote) {
//       showError('You do not have permission to add debit notes');
//       return;
//     }
    
//     console.log('Selected booking:', booking)
//     setSelectedBooking(booking)
//     setShowModal(true)
//   }

//   const handleSearch = (value) => {
//     setSearchTerm(value)
//     handleFilter(value, getDefaultSearchFields('booking'))
//   }

//   const handleDebitNoteSaved = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     fetchData();
//   };

//   if (!canViewDebitNote) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Debit Notes.
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className='title'>Debit Note</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
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
//               disabled={!canViewDebitNote}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
//                       No booking details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((booking, index) => (
//                     <CTableRow key={booking._id || index}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.createdAt
//                           ? new Date(booking.createdAt).toLocaleDateString('en-GB')
//                           : 'N/A'}
//                       </CTableDataCell>
//                       <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                       <CTableDataCell>
//                         {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                           ? (booking.chassisNumber || 'N/A')
//                           : 'N/A'
//                         }
//                       </CTableDataCell>
//                       <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             color="primary"
//                             className="action-btn"
//                             onClick={() => handleAddClick(booking)}
//                             disabled={!canCreateDebitNote}
//                           >
//                             Add
//                           </CButton>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
      
//       <AddDebitNote
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         bookingData={selectedBooking}
//         onDebitNoteSaved={handleDebitNoteSaved}
//         canCreateDebitNote={canCreateDebitNote}
//       />
//     </div>
//   )
// }

// export default DebitNote



// import '../../../css/table.css'
// import {
//   React,
//   useState,
//   useEffect,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   showError,
// } from '../../../utils/tableImports'
// import AddDebitNote from './AddDebitNote'
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
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CFormSelect
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilChevronLeft, cilChevronRight } from '@coreui/icons';

// // Import permission utilities
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage,
//   canDeleteInPage 
// } from '../../../utils/modulePermissions';
// import { useAuth } from '../../../context/AuthContext';

// // Pagination constants
// const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
// const DEFAULT_LIMIT = 50;

// const DebitNote = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([])
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [selectedBooking, setSelectedBooking] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [successMessage, setSuccessMessage] = useState('')

//   // Pagination states - similar to other components
//   const [pagination, setPagination] = useState({
//     docs: [],
//     total: 0,
//     pages: 1,
//     currentPage: 1,
//     limit: DEFAULT_LIMIT,
//     loading: false,
//     search: ''
//   });

//   const { permissions } = useAuth();

//   // Debounce timer for search
//   const searchTimer = React.useRef(null);

//   // Page-level permission checks for Debit Note under ACCOUNT module
//   const canViewDebitNote = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
//   const canCreateDebitNote = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
//   const canUpdateDebitNote = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
//   const canDeleteDebitNote = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
  
//   const showActionColumn = canCreateDebitNote;

//   useEffect(() => {
//     if (!canViewDebitNote) {
//       return;
//     }
    
//     fetchData(1, DEFAULT_LIMIT, '');
//   }, [canViewDebitNote]);

//   // Fetch data with pagination and search - server-side pagination
//   const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
//     try {
//       setPagination(prev => ({ ...prev, loading: true }));
      
//       const params = { 
//         bookingType: 'BRANCH',
//         page, 
//         limit 
//       };
      
//       // Add search parameter if provided
//       if (search) {
//         params.search = search;
//       }
      
//       const response = await axiosInstance.get(`/bookings`, { params });
      
//       const responseData = response.data.data;
//       const bookings = responseData.bookings || [];
//       const total = responseData.total || bookings.length;
//       const pages = responseData.pages || Math.ceil(total / limit);

//       setPagination({
//         docs: bookings,
//         total: total,
//         pages: pages,
//         currentPage: page,
//         limit: limit,
//         loading: false,
//         search: search
//       });
      
//       // Also update data and filteredData for backward compatibility
//       setData(bookings);
//       setFilteredData(bookings);
      
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//       setPagination(prev => ({ ...prev, loading: false, docs: [], total: 0 }));
//     }
//   };

//   const handleAddClick = (booking) => {
//     if (!canCreateDebitNote) {
//       showError('You do not have permission to add debit notes');
//       return;
//     }
    
//     console.log('Selected booking:', booking);
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   // Handle search with debounce
//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, search: value }));
    
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       fetchData(1, pagination.limit, value);
//     }, 400);
//   };

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     fetchData(newPage, pagination.limit, pagination.search);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle limit change
//   const handleLimitChange = (newLimit) => {
//     const limit = parseInt(newLimit, 10);
//     fetchData(1, limit, pagination.search);
//   };

//   // Render pagination component
//   const renderPagination = () => {
//     const { currentPage, pages, total, limit, loading } = pagination;
//     if (!total || pages <= 1) return null;

//     const start = (currentPage - 1) * limit + 1;
//     const end = Math.min(currentPage * limit, total);

//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(pages, currentPage + 2);
//     if (currentPage <= 3) endPage = Math.min(5, pages);
//     if (currentPage >= pages - 2) startPage = Math.max(1, pages - 4);

//     const pageNums = [];
//     for (let i = startPage; i <= endPage; i++) pageNums.push(i);

//     return (
//       <div className="mt-3 border-top pt-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
//           <div className="d-flex align-items-center gap-2">
//             <CFormLabel className="mb-0 text-muted" style={{ fontSize: '13px' }}>Records per page:</CFormLabel>
//             <CFormSelect
//               value={limit}
//               onChange={e => handleLimitChange(e.target.value)}
//               style={{ width: '80px', height: '32px', fontSize: '13px' }}
//               size="sm"
//               disabled={loading}
//             >
//               {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
//             </CFormSelect>
//           </div>
//           <span className="text-muted" style={{ fontSize: '13px' }}>
//             {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
//           </span>
//         </div>
//         {pages > 1 && (
//           <CPagination align="center" size="sm">
//             <CPaginationItem 
//               onClick={() => handlePageChange(1)} 
//               disabled={currentPage === 1 || loading}
//             >
//               «
//             </CPaginationItem>
//             <CPaginationItem 
//               onClick={() => handlePageChange(currentPage - 1)} 
//               disabled={currentPage === 1 || loading}
//             >
//               <CIcon icon={cilChevronLeft} />
//             </CPaginationItem>

//             {startPage > 1 && (
//               <>
//                 <CPaginationItem 
//                   onClick={() => handlePageChange(1)} 
//                   disabled={loading}
//                 >
//                   1
//                 </CPaginationItem>
//                 {startPage > 2 && <CPaginationItem disabled>…</CPaginationItem>}
//               </>
//             )}

//             {pageNums.map(p => (
//               <CPaginationItem 
//                 key={p} 
//                 active={p === currentPage} 
//                 onClick={() => handlePageChange(p)} 
//                 disabled={loading}
//               >
//                 {p}
//               </CPaginationItem>
//             ))}

//             {endPage < pages && (
//               <>
//                 {endPage < pages - 1 && <CPaginationItem disabled>…</CPaginationItem>}
//                 <CPaginationItem 
//                   onClick={() => handlePageChange(pages)} 
//                   disabled={loading}
//                 >
//                   {pages}
//                 </CPaginationItem>
//               </>
//             )}

//             <CPaginationItem 
//               onClick={() => handlePageChange(currentPage + 1)} 
//               disabled={currentPage === pages || loading}
//             >
//               <CIcon icon={cilChevronRight} />
//             </CPaginationItem>
//             <CPaginationItem 
//               onClick={() => handlePageChange(pages)} 
//               disabled={currentPage === pages || loading}
//             >
//               »
//             </CPaginationItem>
//           </CPagination>
//         )}
//       </div>
//     );
//   };

//   const handleDebitNoteSaved = (message) => {
//     setSuccessMessage(message);
//     setTimeout(() => setSuccessMessage(''), 3000);
//     // Refresh the current page after saving
//     fetchData(pagination.currentPage, pagination.limit, pagination.search);
//   };

//   if (!canViewDebitNote) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Debit Notes.
//       </div>
//     );
//   }

//   if (loading && pagination.docs.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Debit Note</div>
      
//       {successMessage && (
//         <CAlert color="success" className="mb-3">
//           {successMessage}
//         </CAlert>
//       )}
      
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
          
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div className="text-muted">
//             Total Records: {pagination.total}
//           </div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               disabled={!canViewDebitNote}
//               style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
//               placeholder="Search by booking, customer, chassis..."
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           {pagination.loading && pagination.docs.length > 0 && (
//             <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
//               <CSpinner size="sm" color="primary" className="me-2" /> Loading records…
//             </div>
//           )}
          
//           <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking ID</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Date</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Total</CTableHeaderCell>
//                   <CTableHeaderCell>Received</CTableHeaderCell>
//                   <CTableHeaderCell>Balance</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {pagination.docs.length === 0 && !pagination.loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
//                       {pagination.search ? 'No matching bookings found' : 'No booking details available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   pagination.docs.map((booking, index) => {
//                     const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={booking._id || index}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.createdAt
//                             ? new Date(booking.createdAt).toLocaleDateString('en-GB')
//                             : 'N/A'}
//                         </CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
//                             ? (booking.chassisNumber || 'N/A')
//                             : 'N/A'
//                           }
//                         </CTableDataCell>
//                         <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                         <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                         <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
//                         {showActionColumn && (
//                           <CTableDataCell>
//                             <CButton
//                               size="sm"
//                               color="primary"
//                               className="action-btn"
//                               onClick={() => handleAddClick(booking)}
//                               disabled={!canCreateDebitNote}
//                             >
//                               Add
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

//           {/* Pagination Component */}
//           {renderPagination()}
//         </CCardBody>
//       </CCard>
      
//       <AddDebitNote
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         bookingData={selectedBooking}
//         onDebitNoteSaved={handleDebitNoteSaved}
//         canCreateDebitNote={canCreateDebitNote}
//       />
//     </div>
//   );
// };

// export default DebitNote;




import '../../../css/table.css'
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
  showError,
} from '../../../utils/tableImports'
import AddDebitNote from './AddDebitNote'
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
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronLeft, cilChevronRight } from '@coreui/icons';

// Import permission utilities
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage 
} from '../../../utils/modulePermissions';
import { useAuth } from '../../../context/AuthContext';

// Pagination constants
const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
const DEFAULT_LIMIT = 50;

const DebitNote = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Pagination states - similar to other components
  const [pagination, setPagination] = useState({
    docs: [],
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: DEFAULT_LIMIT,
    loading: false,
    search: ''
  });

  const { permissions } = useAuth();

  // Add this ref to track component mount status
  const isMounted = React.useRef(true);
  
  // Debounce timer for search
  const searchTimer = React.useRef(null);

  // Page-level permission checks for Debit Note under ACCOUNT module
  const canViewDebitNote = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
  const canCreateDebitNote = canCreateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
  const canUpdateDebitNote = canUpdateInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
  const canDeleteDebitNote = canDeleteInPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DEBIT_NOTE);
  
  const showActionColumn = canCreateDebitNote;

  // Add this to your useEffect that fetches data initially
  useEffect(() => {
    isMounted.current = true;
    
    if (!canViewDebitNote) {
      return;
    }
    
    fetchData(1, DEFAULT_LIMIT, '');
    
    return () => {
      isMounted.current = false;
      // Clear any pending search timers
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [canViewDebitNote]);

  // Fetch data with pagination and search - server-side pagination
  const fetchData = async (page = pagination.currentPage, limit = pagination.limit, search = pagination.search) => {
    // Don't set loading if component is unmounting
    if (!isMounted.current) return;
    
    try {
      setPagination(prev => ({ ...prev, loading: true }));
      setError(null); // Clear any previous errors
      
      const params = { 
        bookingType: 'BRANCH',
        page, 
        limit 
      };
      
      // Add search parameter if provided
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const response = await axiosInstance.get(`/bookings`, { params });
      
      if (!isMounted.current) return;
      
      const responseData = response.data.data || {};
      const bookings = responseData.bookings || [];
      const total = responseData.total || bookings.length;
      const pages = responseData.pages || Math.ceil(total / limit) || 1;

      // CRITICAL: Always set loading to false, even with empty results
      setPagination({
        docs: bookings,
        total: total,
        pages: pages,
        currentPage: page,
        limit: limit,
        loading: false, // ALWAYS set loading to false
        search: search
      });
      
      // Also update data and filteredData for backward compatibility
      setData(bookings);
      setFilteredData(bookings);
      
    } catch (error) {
      if (!isMounted.current) return;
      
      const message = showError(error);
      if (message) {
        setError(message);
      }
      
      // CRITICAL: Always set loading to false and provide empty docs
      setPagination({
        docs: [],
        total: 0,
        pages: 1,
        currentPage: 1,
        limit: limit,
        loading: false, // ALWAYS set loading to false
        search: search
      });
    }
  };

  const handleAddClick = (booking) => {
    if (!canCreateDebitNote) {
      showError('You do not have permission to add debit notes');
      return;
    }
    
    console.log('Selected booking:', booking);
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    if (!canViewDebitNote) {
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
          fetchData(1, pagination.limit, '');
        } else {
          fetchData(1, pagination.limit, value);
        }
      }
    }, 400);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchData(newPage, pagination.limit, pagination.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    const limit = parseInt(newLimit, 10);
    fetchData(1, limit, pagination.search);
  };

  // Render pagination component
  const renderPagination = () => {
    const { currentPage, pages, total, limit, loading } = pagination;
    if (!total || pages <= 1) return null;

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

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
            {loading ? 'Loading…' : `Showing ${start}–${end} of ${total} entries`}
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

  const handleDebitNoteSaved = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    // Refresh the current page after saving
    fetchData(pagination.currentPage, pagination.limit, pagination.search);
  };

  if (!canViewDebitNote) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Debit Notes.
      </div>
    );
  }

  // Show initial loading only on first load
  if (loading && pagination.docs.length === 0 && !pagination.search) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Debit Note</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </CAlert>
      )}
      
      {error && (
        <CAlert color="danger" className="mb-3" onClose={() => setError(null)} dismissible>
          {error}
        </CAlert>
      )}
          
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className="text-muted">
            Total Records: {pagination.total}
          </div>
          <div className='d-flex'>
            <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={!canViewDebitNote}
              style={{ maxWidth: '350px', height: '30px', borderRadius: '0' }}
              placeholder="Search by booking, customer, chassis..."
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          {pagination.loading && (
            <div className="d-flex align-items-center py-2 text-muted" style={{ fontSize: '13px' }}>
              <CSpinner size="sm" color="primary" className="me-2" /> Searching records…
            </div>
          )}
          
          <div className="responsive-table-wrapper" style={{ opacity: pagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 && !pagination.loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "10" : "9"} className="text-center">
                      {pagination.search ? `No matching bookings found for "${pagination.search}"` : 'No booking details available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((booking, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={booking._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString('en-GB')
                            : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                            ? (booking.chassisNumber || 'N/A')
                            : 'N/A'
                          }
                        </CTableDataCell>
                        <CTableDataCell>₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                        <CTableDataCell>₹{booking.receivedAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                        <CTableDataCell>₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}</CTableDataCell>
                        {showActionColumn && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color="primary"
                              className="action-btn"
                              onClick={() => handleAddClick(booking)}
                              disabled={!canCreateDebitNote}
                            >
                              Add
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

          {/* Pagination Component - only show if there are records */}
          {pagination.total > 0 && renderPagination()}
        </CCardBody>
      </CCard>
      
      <AddDebitNote
        show={showModal}
        onClose={() => setShowModal(false)}
        bookingData={selectedBooking}
        onDebitNoteSaved={handleDebitNoteSaved}
        canCreateDebitNote={canCreateDebitNote}
      />
    </div>
  );
};

export default DebitNote;