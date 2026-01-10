// import React, { useEffect, useState, useRef } from 'react';
// import '../../css/table.css';
// import '../../css/importCsv.css';
// import './uploadChallan.css';
// import { getDefaultSearchFields, useTableFilter } from '../../utils/tableFilters';
// import { usePagination } from '../../utils/pagination.js';
// import axiosInstance from '../../axiosInstance';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
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
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilPaperclip } from '@coreui/icons';
// import { 
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   hasSafePagePermission,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const UploadChallan = () => {
//   const [fileInputs, setFileInputs] = useState({});
//   const [error, setError] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const fileInputRef = useRef({});
//   const { permissions = [] } = useAuth();

//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords } = usePagination(Array.isArray(filteredData) ? filteredData : []);

//   // Page-level permission checks for Upload Challan page under Purchase module
//   const canViewUploadChallan = canViewPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.UPLOAD_CHALLAN
//   );
  
//   const canCreateUploadChallan = canCreateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.UPLOAD_CHALLAN
//   );

//   const canUpdateUploadChallan = canUpdateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.UPLOAD_CHALLAN
//   );

//   useEffect(() => {
//     if (!canViewUploadChallan) {
//       showError('You do not have permission to view Upload Challan');
//       return;
//     }
    
//     fetchData();
//   }, [canViewUploadChallan]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/transfers`);
//       const transfers = response.data.data.transfers || [];
//       setData(transfers);
//       setFilteredData(transfers);
//       const hasOverdueChallan = transfers.some(transfer => 
//         transfer.challanStatus === 'pending' && 
//         transfer.challanInfo?.isOver48Hours === true
//       );

//       if (hasOverdueChallan) {
//         setShowAlert(true);
//       } else {
//         setShowAlert(false);
//       }

//       const inputs = {};
//       transfers.forEach((transfer) => {
//         inputs[transfer._id] = null;
//       });
//       setFileInputs(inputs);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (transferId, e) => {
//     if (!canCreateUploadChallan) {
//       showError('You do not have permission to upload challans');
//       return;
//     }
    
//     setFileInputs((prev) => ({
//       ...prev,
//       [transferId]: e.target.files[0]
//     }));
//   };

//   const handleUploadClick = (transferId) => {
//     if (!canCreateUploadChallan) {
//       showError('You do not have permission to upload challans');
//       return;
//     }
    
//     fileInputRef.current[transferId]?.click();
//   };

//   const handleUpload = async (transferId) => {
//     if (!canCreateUploadChallan) {
//       showError('You do not have permission to upload challans');
//       return;
//     }
    
//     if (!fileInputs[transferId]) {
//       showError('Please select a file first');
//       return;
//     }

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('challan', fileInputs[transferId]);

//       await axiosInstance.post(`/transfers/${transferId}/challan`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess('Challan uploaded successfully!');
//       fetchData();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('stockTransfer'));
//   };

//   if (!canViewUploadChallan) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Upload Challan.
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
//       <div className='title'>Upload Stock Transfer Challan</div>
      
//       {showAlert && (
//         <CAlert color="warning" className="mt-3">
//           48 hours have passed! Please upload the challan immediately.
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
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>From Branch</CTableHeaderCell>
//                   <CTableHeaderCell>To Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Transfer Date</CTableHeaderCell>
//                   <CTableHeaderCell>Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Challan Status</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="8" className="text-center">
//                       No transfers available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((transfer, index) => (
//                     <React.Fragment key={`transfer-${index}`}>
//                       <CTableRow>
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{index + 1}</CTableDataCell>
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{transfer.fromBranchDetails?.name || 'N/A'}</CTableDataCell>
                        
// <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{transfer.toBranchDetails?.name || transfer.toSubdealerDetails?.name || ''}</CTableDataCell>
 
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>
//                           {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString('en-GB') : 'N/A'}
//                         </CTableDataCell>
//                       </CTableRow>

//                       {transfer.items?.map((item, itemIndex) => (
//                         <CTableRow key={`item-${index}-${itemIndex}`}>
//                           <CTableDataCell>{item.vehicle?.modelName || item.vehicle?.model?.model_name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{item.vehicle?.color?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{item.vehicle?.chassisNumber || 'N/A'}</CTableDataCell>
//                           {itemIndex === 0 && (
//                             <CTableDataCell rowSpan={transfer.items.length} style={{ maxWidth: '200px' }}>
//                               {transfer.challanStatus === 'pending' ? (
//                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                                   <input
//                                     type="file"
//                                     ref={(el) => (fileInputRef.current[transfer._id] = el)}
//                                     onChange={(e) => handleFileChange(transfer._id, e)}
//                                     accept=".pdf,.jpg,.jpeg,.png"
//                                     style={{ display: 'none' }}
//                                   />
//                                   <CButton 
//                                     size="sm" 
//                                     color="primary"
//                                     onClick={() => handleUploadClick(transfer._id)} 
//                                     disabled={uploading || !canCreateUploadChallan}
//                                     className="action-btn"
//                                   >
//                                     <CIcon icon={cilCloudUpload} className="me-1" />
//                                     Upload
//                                   </CButton>
//                                   {fileInputs[transfer._id] && (
//                                     <div className="d-flex align-items-center gap-2">
//                                       <small className="text-muted">
//                                         <CIcon icon={cilPaperclip} className="me-1" />
//                                         {fileInputs[transfer._id].name}
//                                       </small>
//                                       <CButton
//                                         size="sm"
//                                         color="success"
//                                         onClick={() => handleUpload(transfer._id)}
//                                         disabled={uploading || !canCreateUploadChallan}
//                                         className="action-btn"
//                                       >
//                                         {uploading ? 'Uploading...' : 'Upload'}
//                                       </CButton>
//                                     </div>
//                                   )}
//                                 </div>
//                               ) : transfer.challanDocument ? (
//                                 <div className="document-preview">
//                                   <CButton
//                                     size="sm"
//                                     color="info"
//                                     href={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="mt-2 action-btn"
//                                   >
//                                     View Full
//                                   </CButton>
//                                 </div>
//                               ) : (
//                                 <span>No Document</span>
//                               )}
//                             </CTableDataCell>
//                           )}
//                         </CTableRow>
//                       ))}
//                     </React.Fragment>
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

// export default UploadChallan;








// import React, { useEffect, useState, useRef } from 'react';
// import '../../css/table.css';
// import '../../css/importCsv.css';
// import './uploadChallan.css';
// import { getDefaultSearchFields, useTableFilter } from '../../utils/tableFilters';
// import { usePagination } from '../../utils/pagination.js';
// import axiosInstance from '../../axiosInstance';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
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
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilPaperclip } from '@coreui/icons';
// import { 
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   hasSafePagePermission,
//   canViewPage,
//   canCreateInPage,
//   canUpdateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const UploadChallan = () => {
//   const [fileInputs, setFileInputs] = useState({});
//   const [error, setError] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const fileInputRef = useRef({});
//   const { permissions = [] } = useAuth();

//   // Get user data from localStorage
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = localStorage.getItem('userRole') || 
//                    (storedUser.roles?.[0]?.name || '').toUpperCase();

//   // Check if user is SUPERADMIN
//   const isSuperAdmin = userRole === 'SUPERADMIN' || 
//                        (storedUser.roles?.[0]?.isSuperAdmin === true);

//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
//   const { currentRecords } = usePagination(Array.isArray(filteredData) ? filteredData : []);

//   // Page-level permission checks for Upload Challan page under Purchase module
//   const canViewUploadChallan = canViewPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.UPLOAD_CHALLAN
//   );
  
//   const canCreateUploadChallan = canCreateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.UPLOAD_CHALLAN
//   );

//   const canUpdateUploadChallan = canUpdateInPage(
//     permissions, 
//     MODULES.PURCHASE, 
//     PAGES.PURCHASE.UPLOAD_CHALLAN
//   );

//   useEffect(() => {
//     if (!canViewUploadChallan) {
//       showError('You do not have permission to view Upload Challan');
//       return;
//     }
    
//     fetchData();
//   }, [canViewUploadChallan]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       let url = '/transfers';
      
//       // Add branch filter for non-super admins
//       // For transfers, we need to check both fromBranch and toBranch
//       if (!isSuperAdmin && branchId) {
//         url += `?branchId=${branchId}`;
//       }
      
//       const response = await axiosInstance.get(url);
//       let transfers = response.data.data.transfers || [];
      
//       // Additional client-side filtering for non-super admins
//       if (!isSuperAdmin && branchId) {
//         transfers = transfers.filter(transfer => 
//           // Show transfers where:
//           // 1. Transfer is FROM the user's branch
//           // 2. Transfer is TO the user's branch
//           transfer.fromBranchDetails?._id === branchId ||
//           transfer.fromBranchDetails === branchId ||
//           transfer.toBranchDetails?._id === branchId ||
//           transfer.toBranchDetails === branchId ||
//           transfer.toSubdealerDetails?._id === branchId ||
//           transfer.toSubdealerDetails === branchId
//         );
//       }
      
//       setData(transfers);
//       setFilteredData(transfers);
      
//       const hasOverdueChallan = transfers.some(transfer => 
//         transfer.challanStatus === 'pending' && 
//         transfer.challanInfo?.isOver48Hours === true
//       );

//       if (hasOverdueChallan) {
//         setShowAlert(true);
//       } else {
//         setShowAlert(false);
//       }

//       const inputs = {};
//       transfers.forEach((transfer) => {
//         inputs[transfer._id] = null;
//       });
//       setFileInputs(inputs);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (transferId, e) => {
//     if (!canCreateUploadChallan) {
//       showError('You do not have permission to upload challans');
//       return;
//     }
    
//     setFileInputs((prev) => ({
//       ...prev,
//       [transferId]: e.target.files[0]
//     }));
//   };

//   const handleUploadClick = (transferId) => {
//     if (!canCreateUploadChallan) {
//       showError('You do not have permission to upload challans');
//       return;
//     }
    
//     fileInputRef.current[transferId]?.click();
//   };

//   const handleUpload = async (transferId) => {
//     if (!canCreateUploadChallan) {
//       showError('You do not have permission to upload challans');
//       return;
//     }
    
//     if (!fileInputs[transferId]) {
//       showError('Please select a file first');
//       return;
//     }

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('challan', fileInputs[transferId]);

//       await axiosInstance.post(`/transfers/${transferId}/challan`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess('Challan uploaded successfully!');
//       fetchData();
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('stockTransfer'));
//   };

//   if (!canViewUploadChallan) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Upload Challan.
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
//       <div className='title'>Upload Stock Transfer Challan</div>
      
     
      
//       {showAlert && (
//         <CAlert color="warning" className="mt-3">
//           48 hours have passed! Please upload the challan immediately.
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
//               placeholder="Search transfers..."
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="responsive-table-wrapper">
//             <CTable bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>From Branch</CTableHeaderCell>
//                   <CTableHeaderCell>To Branch</CTableHeaderCell>
//                   <CTableHeaderCell>Transfer Date</CTableHeaderCell>
//                   <CTableHeaderCell>Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis Number</CTableHeaderCell>
//                   <CTableHeaderCell>Challan Status</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan="8" className="text-center">
//                       {isSuperAdmin ? 'No transfers available' : 'No transfers available for your branch'}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((transfer, index) => (
//                     <React.Fragment key={`transfer-${index}`}>
//                       <CTableRow>
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{index + 1}</CTableDataCell>
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{transfer.fromBranchDetails?.name || 'N/A'}</CTableDataCell>
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{transfer.toBranchDetails?.name || transfer.toSubdealerDetails?.name || ''}</CTableDataCell>
//                         <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>
//                           {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString('en-GB') : 'N/A'}
//                         </CTableDataCell>
//                       </CTableRow>

//                       {transfer.items?.map((item, itemIndex) => (
//                         <CTableRow key={`item-${index}-${itemIndex}`}>
//                           <CTableDataCell>{item.vehicle?.modelName || item.vehicle?.model?.model_name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{item.vehicle?.color?.name || 'N/A'}</CTableDataCell>
//                           <CTableDataCell>{item.vehicle?.chassisNumber || 'N/A'}</CTableDataCell>
//                           {itemIndex === 0 && (
//                             <CTableDataCell rowSpan={transfer.items.length} style={{ maxWidth: '200px' }}>
//                               {transfer.challanStatus === 'pending' ? (
//                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                                   <input
//                                     type="file"
//                                     ref={(el) => (fileInputRef.current[transfer._id] = el)}
//                                     onChange={(e) => handleFileChange(transfer._id, e)}
//                                     accept=".pdf,.jpg,.jpeg,.png"
//                                     style={{ display: 'none' }}
//                                   />
//                                   <CButton 
//                                     size="sm" 
//                                     color="primary"
//                                     onClick={() => handleUploadClick(transfer._id)} 
//                                     disabled={uploading || !canCreateUploadChallan}
//                                     className="action-btn"
//                                   >
//                                     <CIcon icon={cilCloudUpload} className="me-1" />
//                                     Upload
//                                   </CButton>
//                                   {fileInputs[transfer._id] && (
//                                     <div className="d-flex align-items-center gap-2">
//                                       <small className="text-muted">
//                                         <CIcon icon={cilPaperclip} className="me-1" />
//                                         {fileInputs[transfer._id].name}
//                                       </small>
//                                       <CButton
//                                         size="sm"
//                                         color="success"
//                                         onClick={() => handleUpload(transfer._id)}
//                                         disabled={uploading || !canCreateUploadChallan}
//                                         className="action-btn"
//                                       >
//                                         {uploading ? 'Uploading...' : 'Upload'}
//                                       </CButton>
//                                     </div>
//                                   )}
//                                 </div>
//                               ) : transfer.challanDocument ? (
//                                 <div className="document-preview">
//                                   <CButton
//                                     size="sm"
//                                     color="info"
//                                     href={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="mt-2 action-btn"
//                                   >
//                                     View Full
//                                   </CButton>
//                                 </div>
//                               ) : (
//                                 <span>No Document</span>
//                               )}
//                             </CTableDataCell>
//                           )}
//                         </CTableRow>
//                       ))}
//                     </React.Fragment>
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

// export default UploadChallan;








import React, { useEffect, useState, useRef } from 'react';
import '../../css/table.css';
import '../../css/importCsv.css';
import './uploadChallan.css';
import { getDefaultSearchFields, useTableFilter } from '../../utils/tableFilters';
import { usePagination } from '../../utils/pagination.js';
import axiosInstance from '../../axiosInstance';
import { showError, showSuccess } from '../../utils/sweetAlerts';
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
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilPaperclip } from '@coreui/icons';
import { 
  MODULES, 
  PAGES,
  ACTIONS,
  hasSafePagePermission,
  canViewPage,
  canCreateInPage,
  canUpdateInPage
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

const UploadChallan = () => {
  const [fileInputs, setFileInputs] = useState({});
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef({});
  const { permissions = [] } = useAuth();

  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('userRole') || 
                   (storedUser.roles?.[0]?.name || '').toUpperCase();

  // Check if user is SUPERADMIN
  const isSuperAdmin = userRole === 'SUPERADMIN' || 
                       (storedUser.roles?.[0]?.isSuperAdmin === true);

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords } = usePagination(Array.isArray(filteredData) ? filteredData : []);

  // Page-level permission checks for Upload Challan page under Purchase module
  const canViewUploadChallan = canViewPage(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.UPLOAD_CHALLAN
  );
  
  const canCreateUploadChallan = canCreateInPage(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.UPLOAD_CHALLAN
  );

  const canUpdateUploadChallan = canUpdateInPage(
    permissions, 
    MODULES.PURCHASE, 
    PAGES.PURCHASE.UPLOAD_CHALLAN
  );

  useEffect(() => {
    if (!canViewUploadChallan) {
      showError('You do not have permission to view Upload Challan');
      return;
    }
    
    fetchData();
  }, [canViewUploadChallan]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = '/transfers';
      
      // REMOVED: Branch filter for non-super admins
      // All users can see all transfers regardless of role
      
      const response = await axiosInstance.get(url);
      let transfers = response.data.data.transfers || [];
      
      // REMOVED: Client-side filtering for non-super admins
      // All transfers are shown to all users
      
      setData(transfers);
      setFilteredData(transfers);
      
      const hasOverdueChallan = transfers.some(transfer => 
        transfer.challanStatus === 'pending' && 
        transfer.challanInfo?.isOver48Hours === true
      );

      if (hasOverdueChallan) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }

      const inputs = {};
      transfers.forEach((transfer) => {
        inputs[transfer._id] = null;
      });
      setFileInputs(inputs);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (transferId, e) => {
    if (!canCreateUploadChallan) {
      showError('You do not have permission to upload challans');
      return;
    }
    
    setFileInputs((prev) => ({
      ...prev,
      [transferId]: e.target.files[0]
    }));
  };

  const handleUploadClick = (transferId) => {
    if (!canCreateUploadChallan) {
      showError('You do not have permission to upload challans');
      return;
    }
    
    fileInputRef.current[transferId]?.click();
  };

  const handleUpload = async (transferId) => {
    if (!canCreateUploadChallan) {
      showError('You do not have permission to upload challans');
      return;
    }
    
    if (!fileInputs[transferId]) {
      showError('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('challan', fileInputs[transferId]);

      await axiosInstance.post(`/transfers/${transferId}/challan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Challan uploaded successfully!');
      fetchData();
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('stockTransfer'));
  };

  if (!canViewUploadChallan) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Upload Challan.
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
      <div className='title'>Upload Stock Transfer Challan</div>
      
     
      
      {showAlert && (
        <CAlert color="warning" className="mt-3">
          48 hours have passed! Please upload the challan immediately.
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div></div>
          <div className='d-flex'>
            <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search transfers..."
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="responsive-table-wrapper">
            <CTable bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>From Branch</CTableHeaderCell>
                  <CTableHeaderCell>To Branch</CTableHeaderCell>
                  <CTableHeaderCell>Transfer Date</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Challan Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No transfers available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((transfer, index) => (
                    <React.Fragment key={`transfer-${index}`}>
                      <CTableRow>
                        <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{index + 1}</CTableDataCell>
                        <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{transfer.fromBranchDetails?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>{transfer.toBranchDetails?.name || transfer.toSubdealerDetails?.name || ''}</CTableDataCell>
                        <CTableDataCell rowSpan={transfer.items?.length + 1 || 1}>
                          {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString('en-GB') : 'N/A'}
                        </CTableDataCell>
                      </CTableRow>

                      {transfer.items?.map((item, itemIndex) => (
                        <CTableRow key={`item-${index}-${itemIndex}`}>
                          <CTableDataCell>{item.vehicle?.modelName || item.vehicle?.model?.model_name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{item.vehicle?.color?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{item.vehicle?.chassisNumber || 'N/A'}</CTableDataCell>
                          {itemIndex === 0 && (
                            <CTableDataCell rowSpan={transfer.items.length} style={{ maxWidth: '200px' }}>
                              {transfer.challanStatus === 'pending' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <input
                                    type="file"
                                    ref={(el) => (fileInputRef.current[transfer._id] = el)}
                                    onChange={(e) => handleFileChange(transfer._id, e)}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    style={{ display: 'none' }}
                                  />
                                  <CButton 
                                    size="sm" 
                                    color="primary"
                                    onClick={() => handleUploadClick(transfer._id)} 
                                    disabled={uploading || !canCreateUploadChallan}
                                    className="action-btn"
                                  >
                                    <CIcon icon={cilCloudUpload} className="me-1" />
                                    Upload
                                  </CButton>
                                  {fileInputs[transfer._id] && (
                                    <div className="d-flex align-items-center gap-2">
                                      <small className="text-muted">
                                        <CIcon icon={cilPaperclip} className="me-1" />
                                        {fileInputs[transfer._id].name}
                                      </small>
                                      <CButton
                                        size="sm"
                                        color="success"
                                        onClick={() => handleUpload(transfer._id)}
                                        disabled={uploading || !canCreateUploadChallan}
                                        className="action-btn"
                                      >
                                        {uploading ? 'Uploading...' : 'Upload'}
                                      </CButton>
                                    </div>
                                  )}
                                </div>
                              ) : transfer.challanDocument ? (
                                <div className="document-preview">
                                  <CButton
                                    size="sm"
                                    color="info"
                                    href={`${axiosInstance.defaults.baseURL}/${transfer.challanDocument}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 action-btn"
                                  >
                                    View Full
                                  </CButton>
                                </div>
                              ) : (
                                <span>No Document</span>
                              )}
                            </CTableDataCell>
                          )}
                        </CTableRow>
                      ))}
                    </React.Fragment>
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

export default UploadChallan;