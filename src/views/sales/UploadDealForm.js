// // import '../../css/table.css';
// // import {
// //   React,
// //   useState,
// //   useEffect,
// //   SearchOutlinedIcon,
// //   getDefaultSearchFields,
// //   useTableFilter,
// //   usePagination,
// //   showError,
// //   showSuccess,
// //   axiosInstance
// // } from '../../utils/tableImports';
// // import { 
// //   CButton, 
// //   CCard, 
// //   CCardBody, 
// //   CCardHeader, 
// //   CFormInput, 
// //   CFormLabel, 
// //   CTable, 
// //   CTableBody, 
// //   CTableHead, 
// //   CTableHeaderCell, 
// //   CTableRow,
// //   CTableDataCell,
// //   CSpinner,
// //   CAlert
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilCloudUpload } from '@coreui/icons';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage,
// //   canCreateInPage 
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';

// // const UploadDealForm = () => {
// //   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
// //   const { currentRecords, PaginationOptions } = usePagination(filteredData);
// //   const [uploading, setUploading] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   // Get permissions from auth context
// //   const { permissions = [] } = useAuth();

// //   // Permission checks for Upload Deal Form page under Sales module
// //   const canViewUploadDealForm = canViewPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);
// //   const canCreateUploadDealForm = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);

// //   useEffect(() => {
// //     // Check if user has permission to view this page
// //     if (!canViewUploadDealForm) {
// //       showError('You do not have permission to view Upload Deal Form & Delivery Challan');
// //       navigate('/dashboard');
// //       return;
// //     }
    
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/bookings`);
// //       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
// //       setData(branchBookings);
// //       setFilteredData(branchBookings);
// //     } catch (error) {
// //       const message = showError(error);
// //       if (message) {
// //         setError(message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFileUpload = async (bookingId, fileType, event) => {
// //     // Check CREATE permission before uploading
// //     if (!canCreateUploadDealForm) {
// //       showError('You do not have permission to upload documents');
// //       return;
// //     }

// //     const file = event.target.files[0];
// //     if (!file) return;

// //     const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
// //     if (!validFileTypes.includes(file.type)) {
// //       showError('Please upload a PDF, JPEG, or PNG file');
// //       return;
// //     }

// //     if (file.size > 5 * 1024 * 1024) {
// //       showError('File size should be less than 5MB');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('file', file);

// //     setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: true }));

// //     try {
// //       const endpoint = fileType === 'dealForm' ? `/bookings/${bookingId}/deal-form` : `/bookings/${bookingId}/delivery-challan`;

// //       const response = await axiosInstance.post(endpoint, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data'
// //         }
// //       });

// //       showSuccess(`${fileType === 'dealForm' ? 'Deal form' : 'Delivery challan'} uploaded successfully!`);

// //       fetchData();
// //     } catch (error) {
// //       console.error(`Error uploading ${fileType}:`, error);
// //       showError(`Failed to upload ${fileType === 'dealForm' ? 'deal form' : 'delivery challan'}`);
// //     } finally {
// //       setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: false }));
// //       event.target.value = '';
// //     }
// //   };

// //   const handleViewDocument = (documentPath) => {
// //     if (documentPath) {
// //       const fullUrl = `${axiosInstance.defaults.baseURL}${documentPath}`;
// //       window.open(fullUrl, '_blank');
// //     }
// //   };

// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //     handleFilter(value, getDefaultSearchFields('booking'));
// //   };

// //   // Check if user has permission to view this page
// //   if (!canViewUploadDealForm) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Upload Deal Form & Delivery Challan.
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
// //         <CSpinner color="primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className='title'>Upload Deal Form & Delivery Challan</div>
// //       {error && (
// //         <CAlert color="danger" className="mb-3">
// //           {error}
// //         </CAlert>
// //       )}
      
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div></div>
// //           <div className='d-flex'>
// //             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //             <CFormInput
// //               type="text"
// //               className="d-inline-block square-search"
// //               value={searchTerm}
// //               onChange={(e) => handleSearch(e.target.value)}
// //             />
// //           </div>
// //         </CCardHeader>
        
// //         <CCardBody>
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
// //                   <CTableHeaderCell>Booking Number</CTableHeaderCell>
// //                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Model Name</CTableHeaderCell>
// //                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
// //                   <CTableHeaderCell>Deal Form</CTableHeaderCell>
// //                   <CTableHeaderCell>Delivery Challan</CTableHeaderCell>
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {currentRecords.length === 0 ? (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan="7" className="text-center">
// //                       No pending bookings available
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 ) : (
// //                   currentRecords.map((booking, index) => (
// //                     <CTableRow key={booking._id || index}>
// //                       <CTableDataCell>{index + 1}</CTableDataCell>
// //                       <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
// //                       <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
// //                       <CTableDataCell>{booking.model?.model_name}</CTableDataCell>
// //                       <CTableDataCell>
// //                         {booking.status === "ALLOCATED" && booking.chassisAllocationStatus === "ALLOCATED" ? 
// //                           (booking.chassisNumber || '') : ''
// //                         }
// //                       </CTableDataCell>
                      
// //                       {/* Deal Form Column */}
// //                       <CTableDataCell>
// //                         {booking.documentStatus?.dealForm?.status === 'COMPLETED' && booking.dealForm ? (
// //                           // Show View button for uploaded documents (requires VIEW permission)
// //                           canViewUploadDealForm && (
// //                             <CButton
// //                               size="sm"
// //                               color="info"
// //                               className="action-btn"
// //                               onClick={() => handleViewDocument(booking.dealForm.path)}
// //                             >
                          
// //                               View
// //                             </CButton>
// //                           )
// //                         ) : (
// //                           // Show Upload button for missing documents (requires CREATE permission)
// //                           canCreateUploadDealForm && (
// //                             <div className="file-upload-container">
// //                               <input
// //                                 type="file"
// //                                 id={`deal-form-${booking._id}`}
// //                                 style={{ display: 'none' }}
// //                                 onChange={(e) => handleFileUpload(booking._id, 'dealForm', e)}
// //                                 accept=".pdf,.jpg,.jpeg,.png"
// //                               />
// //                               <CButton
// //                                 size="sm"
// //                                 color="primary"
// //                                 className="action-btn"
// //                                 onClick={() => document.getElementById(`deal-form-${booking._id}`).click()}
// //                                 disabled={uploading[`${booking._id}-dealForm`]}
// //                               >
// //                                 <CIcon icon={cilCloudUpload} className="me-1" />
// //                                 {uploading[`${booking._id}-dealForm`] ? 'Uploading...' : 'Upload'}
// //                               </CButton>
// //                             </div>
// //                           )
// //                         )}
// //                       </CTableDataCell>
                      
// //                       {/* Delivery Challan Column */}
// //                       <CTableDataCell>
// //                         {booking.documentStatus?.deliveryChallan?.status === 'COMPLETED' && booking.deliveryChallan ? (
// //                           // Show View button for uploaded documents (requires VIEW permission)
// //                           canViewUploadDealForm && (
// //                             <CButton
// //                               size="sm"
// //                               color="info"
// //                               className="action-btn"
// //                               onClick={() => handleViewDocument(booking.deliveryChallan.path)}
// //                             >
                            
// //                               View
// //                             </CButton>
// //                           )
// //                         ) : (
// //                           // Show Upload button for missing documents (requires CREATE permission)
// //                           canCreateUploadDealForm && (
// //                             <div className="file-upload-container">
// //                               <input
// //                                 type="file"
// //                                 id={`delivery-challan-${booking._id}`}
// //                                 style={{ display: 'none' }}
// //                                 onChange={(e) => handleFileUpload(booking._id, 'deliveryChallan', e)}
// //                                 accept=".pdf,.jpg,.jpeg,.png"
// //                               />
// //                               <CButton
// //                                 size="sm"
// //                                 color="primary"
// //                                 className="action-btn"
// //                                 onClick={() => document.getElementById(`delivery-challan-${booking._id}`).click()}
// //                                 disabled={uploading[`${booking._id}-deliveryChallan`]}
// //                               >
// //                                 <CIcon icon={cilCloudUpload} className="me-1" />
// //                                 {uploading[`${booking._id}-deliveryChallan`] ? 'Uploading...' : 'Upload'}
// //                               </CButton>
// //                             </div>
// //                           )
// //                         )}
// //                       </CTableDataCell>
// //                     </CTableRow>
// //                   ))
// //                 )}
// //               </CTableBody>
// //             </CTable>
// //           </div>
// //         </CCardBody>
// //       </CCard>
// //     </div>
// //   );
// // };

// // export default UploadDealForm;




// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   SearchOutlinedIcon,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   showSuccess,
//   axiosInstance
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
//   CSpinner,
//   CAlert,
//   CPagination,
//   CPaginationItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const UploadDealForm = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [uploading, setUploading] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(100);
//   const [totalPages, setTotalPages] = useState(1);
//   const [displayedPages, setDisplayedPages] = useState([]);

//   const navigate = useNavigate();

//   // Get permissions from auth context
//   const { permissions = [] } = useAuth();

//   // Permission checks for Upload Deal Form page under Sales module
//   const canViewUploadDealForm = canViewPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);
//   const canCreateUploadDealForm = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);

//   useEffect(() => {
//     // Check if user has permission to view this page
//     if (!canViewUploadDealForm) {
//       showError('You do not have permission to view Upload Deal Form & Delivery Challan');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Recalculate pagination when filteredData changes
//     calculatePagination(filteredData);
//   }, [filteredData, currentPage]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings?page=1&limit=1000`); // Fetch more records initially
//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
//       setData(branchBookings);
//       setFilteredData(branchBookings);
//       setCurrentPage(1); // Reset to first page when data changes
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate pagination
//   const calculatePagination = (filteredData) => {
//     const total = filteredData.length;
//     const totalPages = Math.ceil(total / recordsPerPage);
//     setTotalPages(totalPages);
    
//     // Calculate displayed page numbers (max 5 pages shown)
//     const pages = [];
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, currentPage + 2);
    
//     // Adjust if we're near the beginning
//     if (currentPage <= 3) {
//       endPage = Math.min(5, totalPages);
//     }
    
//     // Adjust if we're near the end
//     if (currentPage >= totalPages - 2) {
//       startPage = Math.max(1, totalPages - 4);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     setDisplayedPages(pages);
//   };

//   // Get current records for the page
//   const getCurrentRecords = () => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
//   };

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     // Scroll to top when page changes
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleFileUpload = async (bookingId, fileType, event) => {
//     // Check CREATE permission before uploading
//     if (!canCreateUploadDealForm) {
//       showError('You do not have permission to upload documents');
//       return;
//     }

//     const file = event.target.files[0];
//     if (!file) return;

//     const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
//     if (!validFileTypes.includes(file.type)) {
//       showError('Please upload a PDF, JPEG, or PNG file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       showError('File size should be less than 5MB');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: true }));

//     try {
//       const endpoint = fileType === 'dealForm' ? `/bookings/${bookingId}/deal-form` : `/bookings/${bookingId}/delivery-challan`;

//       const response = await axiosInstance.post(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(`${fileType === 'dealForm' ? 'Deal form' : 'Delivery challan'} uploaded successfully!`);

//       fetchData();
//     } catch (error) {
//       console.error(`Error uploading ${fileType}:`, error);
//       showError(`Failed to upload ${fileType === 'dealForm' ? 'deal form' : 'delivery challan'}`);
//     } finally {
//       setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: false }));
//       event.target.value = '';
//     }
//   };

//   const handleViewDocument = (documentPath) => {
//     if (documentPath) {
//       const fullUrl = `${axiosInstance.defaults.baseURL}${documentPath}`;
//       window.open(fullUrl, '_blank');
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('booking'));
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   // Check if user has permission to view this page
//   if (!canViewUploadDealForm) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Upload Deal Form & Delivery Challan.
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

//   return (
//     <div>
//       <div className='title'>Upload Deal Form & Delivery Challan</div>
//       {error && (
//         <CAlert color="danger" className="mb-3">
//           {error}
//         </CAlert>
//       )}
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div className="text-muted">
//             Total Records: {filteredData.length}
//           </div>
//           <div className='d-flex'>
//             <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//             <CFormInput
//               type="text"
//               className="d-inline-block square-search"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Booking Number</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Deal Form</CTableHeaderCell>
//                   <CTableHeaderCell>Delivery Challan</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {getCurrentRecords().length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="7" className="text-center">
//                       No pending bookings available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   getCurrentRecords().map((booking, index) => {
//                     const globalIndex = (currentPage - 1) * recordsPerPage + index + 1;
//                     return (
//                       <CTableRow key={booking._id || index}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
//                         <CTableDataCell>{booking.model?.model_name}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.status === "ALLOCATED" && booking.chassisAllocationStatus === "ALLOCATED" ? 
//                             (booking.chassisNumber || '') : ''
//                           }
//                         </CTableDataCell>
                        
//                         {/* Deal Form Column */}
//                         <CTableDataCell>
//                           {booking.documentStatus?.dealForm?.status === 'COMPLETED' && booking.dealForm ? (
//                             // Show View button for uploaded documents (requires VIEW permission)
//                             canViewUploadDealForm && (
//                               <CButton
//                                 size="sm"
//                                 color="info"
//                                 className="action-btn"
//                                 onClick={() => handleViewDocument(booking.dealForm.path)}
//                               >
//                                 View
//                               </CButton>
//                             )
//                           ) : (
//                             // Show Upload button for missing documents (requires CREATE permission)
//                             canCreateUploadDealForm && (
//                               <div className="file-upload-container">
//                                 <input
//                                   type="file"
//                                   id={`deal-form-${booking._id}`}
//                                   style={{ display: 'none' }}
//                                   onChange={(e) => handleFileUpload(booking._id, 'dealForm', e)}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                 />
//                                 <CButton
//                                   size="sm"
//                                   color="primary"
//                                   className="action-btn"
//                                   onClick={() => document.getElementById(`deal-form-${booking._id}`).click()}
//                                   disabled={uploading[`${booking._id}-dealForm`]}
//                                 >
//                                   <CIcon icon={cilCloudUpload} className="me-1" />
//                                   {uploading[`${booking._id}-dealForm`] ? 'Uploading...' : 'Upload'}
//                                 </CButton>
//                               </div>
//                             )
//                           )}
//                         </CTableDataCell>
                        
//                         {/* Delivery Challan Column */}
//                         <CTableDataCell>
//                           {booking.documentStatus?.deliveryChallan?.status === 'COMPLETED' && booking.deliveryChallan ? (
//                             // Show View button for uploaded documents (requires VIEW permission)
//                             canViewUploadDealForm && (
//                               <CButton
//                                 size="sm"
//                                 color="info"
//                                 className="action-btn"
//                                 onClick={() => handleViewDocument(booking.deliveryChallan.path)}
//                               >
//                                 View
//                               </CButton>
//                             )
//                           ) : (
//                             // Show Upload button for missing documents (requires CREATE permission)
//                             canCreateUploadDealForm && (
//                               <div className="file-upload-container">
//                                 <input
//                                   type="file"
//                                   id={`delivery-challan-${booking._id}`}
//                                   style={{ display: 'none' }}
//                                   onChange={(e) => handleFileUpload(booking._id, 'deliveryChallan', e)}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                 />
//                                 <CButton
//                                   size="sm"
//                                   color="primary"
//                                   className="action-btn"
//                                   onClick={() => document.getElementById(`delivery-challan-${booking._id}`).click()}
//                                   disabled={uploading[`${booking._id}-deliveryChallan`]}
//                                 >
//                                   <CIcon icon={cilCloudUpload} className="me-1" />
//                                   {uploading[`${booking._id}-deliveryChallan`] ? 'Uploading...' : 'Upload'}
//                                 </CButton>
//                               </div>
//                             )
//                           )}
//                         </CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>

//           {/* Pagination Component */}
//           {filteredData.length > recordsPerPage && (
//             <div className="mt-4">
//               <CPagination align="center" aria-label="Page navigation example">
//                 {/* Previous Button */}
//                 <CPaginationItem 
//                   aria-label="Previous" 
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={currentPage === 1 ? 'disabled' : ''}
//                 >
//                   <CIcon icon={cilChevronLeft} />
//                 </CPaginationItem>
                
//                 {/* First Page */}
//                 {currentPage > 3 && totalPages > 5 && (
//                   <>
//                     <CPaginationItem 
//                       onClick={() => handlePageChange(1)}
//                       active={currentPage === 1}
//                     >
//                       1
//                     </CPaginationItem>
//                     {currentPage > 4 && <CPaginationItem disabled>...</CPaginationItem>}
//                   </>
//                 )}
                
//                 {/* Page Numbers */}
//                 {displayedPages.map(page => (
//                   <CPaginationItem 
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     active={currentPage === page}
//                   >
//                     {page}
//                   </CPaginationItem>
//                 ))}
                
//                 {/* Last Page */}
//                 {currentPage < totalPages - 2 && totalPages > 5 && (
//                   <>
//                     {currentPage < totalPages - 3 && <CPaginationItem disabled>...</CPaginationItem>}
//                     <CPaginationItem 
//                       onClick={() => handlePageChange(totalPages)}
//                       active={currentPage === totalPages}
//                     >
//                       {totalPages}
//                     </CPaginationItem>
//                   </>
//                 )}
                
//                 {/* Next Button */}
//                 <CPaginationItem 
//                   aria-label="Next" 
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={currentPage === totalPages ? 'disabled' : ''}
//                 >
//                   <CIcon icon={cilChevronRight} />
//                 </CPaginationItem>
//               </CPagination>
              
//               {/* Pagination Info */}
//               <div className="text-center text-muted mt-2">
//                 Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} entries
//               </div>
//             </div>
//           )}
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default UploadDealForm;







// import '../../css/table.css';
// import {
//   React,
//   useState,
//   useEffect,
//   SearchOutlinedIcon,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   showError,
//   showSuccess,
//   axiosInstance
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
//   CSpinner,
//   CAlert,
//   CPagination,
//   CPaginationItem,
//   CFormSelect
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage,
//   canCreateInPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// // Pagination constants
// const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
// const DEFAULT_LIMIT = 100;

// const UploadDealForm = () => {
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const [uploading, setUploading] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
  
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

//   const navigate = useNavigate();

//   // Debounce timer for search
//   const searchTimer = React.useRef(null);

//   // Get permissions from auth context
//   const { permissions = [] } = useAuth();

//   // Permission checks for Upload Deal Form page under Sales module
//   const canViewUploadDealForm = canViewPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);
//   const canCreateUploadDealForm = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);

//   useEffect(() => {
//     // Check if user has permission to view this page
//     if (!canViewUploadDealForm) {
//       showError('You do not have permission to view Upload Deal Form & Delivery Challan');
//       navigate('/dashboard');
//       return;
//     }
    
//     fetchData(1, DEFAULT_LIMIT, '');
//   }, []);

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

//   const handleFileUpload = async (bookingId, fileType, event) => {
//     // Check CREATE permission before uploading
//     if (!canCreateUploadDealForm) {
//       showError('You do not have permission to upload documents');
//       return;
//     }

//     const file = event.target.files[0];
//     if (!file) return;

//     const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
//     if (!validFileTypes.includes(file.type)) {
//       showError('Please upload a PDF, JPEG, or PNG file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       showError('File size should be less than 5MB');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: true }));

//     try {
//       const endpoint = fileType === 'dealForm' ? `/bookings/${bookingId}/deal-form` : `/bookings/${bookingId}/delivery-challan`;

//       const response = await axiosInstance.post(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(`${fileType === 'dealForm' ? 'Deal form' : 'Delivery challan'} uploaded successfully!`);

//       // Refresh the current page after upload
//       fetchData(pagination.currentPage, pagination.limit, pagination.search);
//     } catch (error) {
//       console.error(`Error uploading ${fileType}:`, error);
//       showError(`Failed to upload ${fileType === 'dealForm' ? 'deal form' : 'delivery challan'}`);
//     } finally {
//       setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: false }));
//       event.target.value = '';
//     }
//   };

//   const handleViewDocument = (documentPath) => {
//     if (documentPath) {
//       const fullUrl = `${axiosInstance.defaults.baseURL}${documentPath}`;
//       window.open(fullUrl, '_blank');
//     }
//   };

//   // Check if user has permission to view this page
//   if (!canViewUploadDealForm) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Upload Deal Form & Delivery Challan.
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
//       <div className='title'>Upload Deal Form & Delivery Challan</div>
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
//                   <CTableHeaderCell>Booking Number</CTableHeaderCell>
//                   <CTableHeaderCell>Customer Name</CTableHeaderCell>
//                   <CTableHeaderCell>Model Name</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Deal Form</CTableHeaderCell>
//                   <CTableHeaderCell>Delivery Challan</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {pagination.docs.length === 0 && !pagination.loading ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="7" className="text-center">
//                       {pagination.search ? 'No matching bookings found' : 'No branch bookings available'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   pagination.docs.map((booking, index) => {
//                     const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
//                     return (
//                       <CTableRow key={booking._id || index}>
//                         <CTableDataCell>{globalIndex}</CTableDataCell>
//                         <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
//                         <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
//                         <CTableDataCell>{booking.model?.model_name}</CTableDataCell>
//                         <CTableDataCell>
//                           {booking.status === "ALLOCATED" && booking.chassisAllocationStatus === "ALLOCATED" ? 
//                             (booking.chassisNumber || '') : ''
//                           }
//                         </CTableDataCell>
                        
//                         {/* Deal Form Column */}
//                         <CTableDataCell>
//                           {booking.documentStatus?.dealForm?.status === 'COMPLETED' && booking.dealForm ? (
//                             // Show View button for uploaded documents (requires VIEW permission)
//                             canViewUploadDealForm && (
//                               <CButton
//                                 size="sm"
//                                 color="info"
//                                 className="action-btn"
//                                 onClick={() => handleViewDocument(booking.dealForm.path)}
//                               >
//                                 View
//                               </CButton>
//                             )
//                           ) : (
//                             // Show Upload button for missing documents (requires CREATE permission)
//                             canCreateUploadDealForm && (
//                               <div className="file-upload-container">
//                                 <input
//                                   type="file"
//                                   id={`deal-form-${booking._id}`}
//                                   style={{ display: 'none' }}
//                                   onChange={(e) => handleFileUpload(booking._id, 'dealForm', e)}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                 />
//                                 <CButton
//                                   size="sm"
//                                   color="primary"
//                                   className="action-btn"
//                                   onClick={() => document.getElementById(`deal-form-${booking._id}`).click()}
//                                   disabled={uploading[`${booking._id}-dealForm`]}
//                                 >
//                                   <CIcon icon={cilCloudUpload} className="me-1" />
//                                   {uploading[`${booking._id}-dealForm`] ? 'Uploading...' : 'Upload'}
//                                 </CButton>
//                               </div>
//                             )
//                           )}
//                         </CTableDataCell>
                        
//                         {/* Delivery Challan Column */}
//                         <CTableDataCell>
//                           {booking.documentStatus?.deliveryChallan?.status === 'COMPLETED' && booking.deliveryChallan ? (
//                             // Show View button for uploaded documents (requires VIEW permission)
//                             canViewUploadDealForm && (
//                               <CButton
//                                 size="sm"
//                                 color="info"
//                                 className="action-btn"
//                                 onClick={() => handleViewDocument(booking.deliveryChallan.path)}
//                               >
//                                 View
//                               </CButton>
//                             )
//                           ) : (
//                             // Show Upload button for missing documents (requires CREATE permission)
//                             canCreateUploadDealForm && (
//                               <div className="file-upload-container">
//                                 <input
//                                   type="file"
//                                   id={`delivery-challan-${booking._id}`}
//                                   style={{ display: 'none' }}
//                                   onChange={(e) => handleFileUpload(booking._id, 'deliveryChallan', e)}
//                                   accept=".pdf,.jpg,.jpeg,.png"
//                                 />
//                                 <CButton
//                                   size="sm"
//                                   color="primary"
//                                   className="action-btn"
//                                   onClick={() => document.getElementById(`delivery-challan-${booking._id}`).click()}
//                                   disabled={uploading[`${booking._id}-deliveryChallan`]}
//                                 >
//                                   <CIcon icon={cilCloudUpload} className="me-1" />
//                                   {uploading[`${booking._id}-deliveryChallan`] ? 'Uploading...' : 'Upload'}
//                                 </CButton>
//                               </div>
//                             )
//                           )}
//                         </CTableDataCell>
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
//     </div>
//   );
// };

// export default UploadDealForm;







import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  SearchOutlinedIcon,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  showError,
  showSuccess,
  axiosInstance
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
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage,
  canCreateInPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

// Pagination constants
const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
const DEFAULT_LIMIT = 100;

const UploadDealForm = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
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

  const navigate = useNavigate();

  // Add this ref to track component mount status
  const isMounted = React.useRef(true);
  
  // Debounce timer for search
  const searchTimer = React.useRef(null);

  // Get permissions from auth context
  const { permissions = [] } = useAuth();

  // Permission checks for Upload Deal Form page under Sales module
  const canViewUploadDealForm = canViewPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);
  const canCreateUploadDealForm = canCreateInPage(permissions, MODULES.SALES, PAGES.SALES.UPLOAD_DEAL_FORM);

  // Add this to your useEffect that fetches data initially
  useEffect(() => {
    isMounted.current = true;
    
    // Check if user has permission to view this page
    if (!canViewUploadDealForm) {
      showError('You do not have permission to view Upload Deal Form & Delivery Challan');
      navigate('/dashboard');
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
  }, []);

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

  // Handle search with debounce
  const handleSearch = (value) => {
    if (!canViewUploadDealForm) {
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

  const handleFileUpload = async (bookingId, fileType, event) => {
    // Check CREATE permission before uploading
    if (!canCreateUploadDealForm) {
      showError('You do not have permission to upload documents');
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      showError('Please upload a PDF, JPEG, or PNG file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: true }));

    try {
      const endpoint = fileType === 'dealForm' ? `/bookings/${bookingId}/deal-form` : `/bookings/${bookingId}/delivery-challan`;

      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess(`${fileType === 'dealForm' ? 'Deal form' : 'Delivery challan'} uploaded successfully!`);

      // Refresh the current page after upload
      fetchData(pagination.currentPage, pagination.limit, pagination.search);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      showError(`Failed to upload ${fileType === 'dealForm' ? 'deal form' : 'delivery challan'}`);
    } finally {
      setUploading((prev) => ({ ...prev, [`${bookingId}-${fileType}`]: false }));
      event.target.value = '';
    }
  };

  const handleViewDocument = (documentPath) => {
    if (documentPath) {
      const fullUrl = `${axiosInstance.defaults.baseURL}${documentPath}`;
      window.open(fullUrl, '_blank');
    }
  };

  // Check if user has permission to view this page
  if (!canViewUploadDealForm) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Upload Deal Form & Delivery Challan.
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
      <div className='title'>Upload Deal Form & Delivery Challan</div>
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
                  <CTableHeaderCell>Booking Number</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Deal Form</CTableHeaderCell>
                  <CTableHeaderCell>Delivery Challan</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pagination.docs.length === 0 && !pagination.loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      {pagination.search ? `No matching bookings found for "${pagination.search}"` : 'No branch bookings available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  pagination.docs.map((booking, index) => {
                    const globalIndex = (pagination.currentPage - 1) * pagination.limit + index + 1;
                    return (
                      <CTableRow key={booking._id || index}>
                        <CTableDataCell>{globalIndex}</CTableDataCell>
                        <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.name}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name}</CTableDataCell>
                        <CTableDataCell>
                          {booking.status === "ALLOCATED" && booking.chassisAllocationStatus === "ALLOCATED" ? 
                            (booking.chassisNumber || '') : ''
                          }
                        </CTableDataCell>
                        
                        {/* Deal Form Column */}
                        <CTableDataCell>
                          {booking.documentStatus?.dealForm?.status === 'COMPLETED' && booking.dealForm ? (
                            // Show View button for uploaded documents (requires VIEW permission)
                            canViewUploadDealForm && (
                              <CButton
                                size="sm"
                                color="info"
                                className="action-btn"
                                onClick={() => handleViewDocument(booking.dealForm.path)}
                              >
                                View
                              </CButton>
                            )
                          ) : (
                            // Show Upload button for missing documents (requires CREATE permission)
                            canCreateUploadDealForm && (
                              <div className="file-upload-container">
                                <input
                                  type="file"
                                  id={`deal-form-${booking._id}`}
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileUpload(booking._id, 'dealForm', e)}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <CButton
                                  size="sm"
                                  color="primary"
                                  className="action-btn"
                                  onClick={() => document.getElementById(`deal-form-${booking._id}`).click()}
                                  disabled={uploading[`${booking._id}-dealForm`]}
                                >
                                  <CIcon icon={cilCloudUpload} className="me-1" />
                                  {uploading[`${booking._id}-dealForm`] ? 'Uploading...' : 'Upload'}
                                </CButton>
                              </div>
                            )
                          )}
                        </CTableDataCell>
                        
                        {/* Delivery Challan Column */}
                        <CTableDataCell>
                          {booking.documentStatus?.deliveryChallan?.status === 'COMPLETED' && booking.deliveryChallan ? (
                            // Show View button for uploaded documents (requires VIEW permission)
                            canViewUploadDealForm && (
                              <CButton
                                size="sm"
                                color="info"
                                className="action-btn"
                                onClick={() => handleViewDocument(booking.deliveryChallan.path)}
                              >
                                View
                              </CButton>
                            )
                          ) : (
                            // Show Upload button for missing documents (requires CREATE permission)
                            canCreateUploadDealForm && (
                              <div className="file-upload-container">
                                <input
                                  type="file"
                                  id={`delivery-challan-${booking._id}`}
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileUpload(booking._id, 'deliveryChallan', e)}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <CButton
                                  size="sm"
                                  color="primary"
                                  className="action-btn"
                                  onClick={() => document.getElementById(`delivery-challan-${booking._id}`).click()}
                                  disabled={uploading[`${booking._id}-deliveryChallan`]}
                                >
                                  <CIcon icon={cilCloudUpload} className="me-1" />
                                  {uploading[`${booking._id}-deliveryChallan`] ? 'Uploading...' : 'Upload'}
                                </CButton>
                              </div>
                            )
                          )}
                        </CTableDataCell>
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
    </div>
  );
};

export default UploadDealForm;