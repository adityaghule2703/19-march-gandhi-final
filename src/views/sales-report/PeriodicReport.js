// // import React, { useState, useEffect } from 'react';
// // import DatePicker from 'react-datepicker';
// // import 'react-datepicker/dist/react-datepicker.css';
// // import '../../css/report.css';
// // import { toast } from 'react-toastify';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage 
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';
// // import { CFormSelect, CSpinner, CAlert, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs } from '@coreui/react';

// // const PeriodicReport = () => {
// //   const [fromDate, setFromDate] = useState(null);
// //   const [toDate, setToDate] = useState(new Date());
// //   const [exportLoading, setExportLoading] = useState(false);
// //   const [branches, setBranches] = useState([]);
// //   const [selectedBranch, setSelectedBranch] = useState('');
// //   const [branchLoading, setBranchLoading] = useState(true);
// //   const [apiError, setApiError] = useState('');
// //   const [activeTab, setActiveTab] = useState('sales');
// //   const [selectedType, setSelectedType] = useState('');
// //   const navigate = useNavigate();

// //   const { permissions = [], user } = useAuth();

// //   const canViewPeriodicReport = canViewPage(permissions, MODULES.SALES_REPORT, PAGES.SALES_REPORT.PERIODIC_REPORT);
   
// //   const hasAllBranchAccess = user?.branchAccess === "ALL";
  
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '';
    
// //     try {
// //       const date = new Date(dateString);
// //       if (isNaN(date.getTime())) return '';
      
// //       const day = String(date.getDate()).padStart(2, '0');
// //       const month = String(date.getMonth() + 1).padStart(2, '0');
// //       const year = date.getFullYear();
      
// //       return `${day}-${month}-${year}`;
// //     } catch (error) {
// //       console.error('Error formatting date:', error);
// //       return '';
// //     }
// //   };

// //   const formatDateForAPI = (date) => {
// //     if (!date) return '';
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const day = String(date.getDate()).padStart(2, '0');
// //     return `${year}-${month}-${day}`;
// //   };

// //   useEffect(() => {
// //     if (!canViewPeriodicReport) {
// //       showError('You do not have permission to view Periodic Reports');
// //       navigate('/dashboard');
// //       return;
// //     }
// //     fetchBranches();
// //   }, [canViewPeriodicReport, navigate]);

// //   const fetchBranches = async () => {
// //     try {
// //       setBranchLoading(true);
// //       const response = await axiosInstance.get('/branches');
      
// //       if (response.data.success) {
// //         const activeBranches = response.data.data.filter(branch => branch.is_active);
// //         setBranches(activeBranches);
      
// //         if (user?.branchId) {
// //           const userBranch = activeBranches.find(b => b.id === user.branchId);
// //           if (userBranch) {
// //             setSelectedBranch(userBranch.id);
// //           }
// //         } else if (activeBranches.length > 0) {
// //           setSelectedBranch(activeBranches[0].id);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error fetching branches:', error);
// //       toast.error('Failed to load branches');
// //     } finally {
// //       setBranchLoading(false);
// //     }
// //   };

// //   const getReportName = (tab) => {
// //     switch(tab) {
// //       case 'sales': return 'Sales Report';
// //       case 'outstanding': return 'Outstanding Report';
// //       case 'booking': return 'Booking Report';
// //       case 'gc': return 'GC Report';
// //       default: return 'Report';
// //     }
// //   };

// //   const getAPIEndpoint = () => {
// //     switch(activeTab) {
// //       case 'sales':
// //         return '/reports/branch-sales';
// //       case 'outstanding':
// //         return '/reports/outstanding';
// //       case 'booking':
// //         return '/reports/bookings';
// //       case 'gc':
// //         return '/reports/gc';
// //       default:
// //         return '/reports/branch-sales';
// //     }
// //   };

// //   const getFileName = (branchName, fromDateStr, toDateStr) => {
// //     const reportType = getReportName(activeTab).replace(' ', '_');
// //     return `${reportType}_${branchName}_${fromDateStr}_to_${toDateStr}.xlsx`;
// //   };

// //   const handleExportToExcel = async () => {
// //     setApiError('');

// //     if (!canViewPeriodicReport) {
// //       showError('You do not have permission to export Periodic Reports');
// //       return;
// //     }

// //     if (!selectedBranch) {
// //       toast.error('Please select a branch');
// //       return;
// //     }
// //     //  if (selectedType) {
// //     //   params.append('type', selectedType);
// //     //   }
// //     if (!fromDate || !toDate) {
// //       toast.error('Please select both from and to dates');
// //       return;
// //     }

// //     if (fromDate > toDate) {
// //       toast.error('From date cannot be after To date');
// //       return;
// //     }

// //     try {
// //       setExportLoading(true);
      
// //       const formattedFromDate = formatDateForAPI(fromDate);
// //       const formattedToDate = formatDateForAPI(toDate);
// //       const apiEndpoint = getAPIEndpoint();

// //       const params = new URLSearchParams({
// //         branchId: selectedBranch,
// //         modelType:selectedType,
// //         startDate: formattedFromDate,
// //         endDate: formattedToDate,
// //         format: 'excel'
// //       });

// //       const response = await axiosInstance.get(
// //         `${apiEndpoint}?${params.toString()}`,
// //         { responseType: 'blob' }
// //       );

// //       const contentType = response.headers['content-type'];
      
// //       if (contentType && contentType.includes('application/json')) {

// //         const text = await new Promise((resolve, reject) => {
// //           const reader = new FileReader();
// //           reader.onload = () => resolve(reader.result);
// //           reader.onerror = reject;
// //           reader.readAsText(response.data);
// //         });
        
// //         const errorData = JSON.parse(text);
        
// //         if (!errorData.success && errorData.message) {
// //           setApiError(errorData.message);
// //           toast.error(errorData.message);
// //           return;
// //         }
// //       }

// //       const blob = new Blob([response.data], { 
// //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
// //       });
      
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement('a');
// //       link.href = url;
      
// //       const branchName = branches.find(b => b.id === selectedBranch)?.name || 'Branch';
// //       const fromDateStr = fromDate ? formatDate(fromDate) : '';
// //       const toDateStr = toDate ? formatDate(toDate) : '';
// //       const fileName = getFileName(branchName, fromDateStr, toDateStr);
// //       link.setAttribute('download', fileName);
      
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
      
// //       window.URL.revokeObjectURL(url);
// //       toast.success(`${getReportName(activeTab)} exported successfully`);

// //     } catch (error) {
// //       console.error('Error exporting report:', error);
      
// //       // For blob errors, we need to read the blob
// //       if (error.response && error.response.data instanceof Blob) {
// //         try {
// //           const text = await new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onload = () => resolve(reader.result);
// //             reader.onerror = reject;
// //             reader.readAsText(error.response.data);
// //           });
          
// //           const errorData = JSON.parse(text);
          
// //           // Show the exact error message from API
// //           if (errorData.message) {
// //             setApiError(errorData.message);
// //             toast.error(errorData.message);
// //           }
// //         } catch (parseError) {
// //           console.error('Error parsing error response:', parseError);
// //           setApiError('Failed to export report');
// //           toast.error('Failed to export report');
// //         }
// //       } else if (error.response?.data?.message) {
// //         // Regular error with message in response
// //         setApiError(error.response.data.message);
// //         toast.error(error.response.data.message);
// //       } else if (error.message) {
// //         // Network or other errors
// //         setApiError(error.message);
// //         toast.error(error.message);
// //       } else {
// //         setApiError('Failed to export report');
// //         toast.error('Failed to export report');
// //       }
      
// //     } finally {
// //       setExportLoading(false);
// //     }
// //   };

// //   // Clear error when user changes filters
// //   useEffect(() => {
// //     setApiError('');
// //   }, [selectedBranch, fromDate, toDate,selectedType, activeTab]);

// //   // Check if user has permission to view this page
// //   if (!canViewPeriodicReport) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Periodic Reports.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="rto-report-container">
// //       <h4 className="rto-report-title">Periodic Reports</h4>

// //       <div className="rto-report-card">
// //         {/* Display API Error at the top - only shows the exact error message */}
// //         {apiError && (
// //           <CAlert color="danger" className="mb-3">
// //             {apiError}
// //           </CAlert>
// //         )}

// //         {/* Tabs for different report types - all visible since they use same permission */}
// //         <CCard>
// //           <CCardHeader>
// //             <CNav variant="tabs" className="card-header-tabs">
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'sales'}
// //                   onClick={() => setActiveTab('sales')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   Sales Report
// //                 </CNavLink>
// //               </CNavItem>
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'outstanding'}
// //                   onClick={() => setActiveTab('outstanding')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   Outstanding Report
// //                 </CNavLink>
// //               </CNavItem>
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'booking'}
// //                   onClick={() => setActiveTab('booking')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   Booking Report
// //                 </CNavLink>
// //               </CNavItem>
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'gc'}
// //                   onClick={() => setActiveTab('gc')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   GC Report
// //                 </CNavLink>
// //               </CNavItem>
// //             </CNav>
// //           </CCardHeader>
// //           <CCardBody>
// //             <CTabContent>
// //               <CTabPane visible={activeTab === 'sales'}>
// //                    <h5 className="mb-3">Sales Report</h5>
// //                 <div className="date-filter-container mt-3">

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>

           
// //               <CTabPane visible={activeTab === 'outstanding'}>
// //                   <h5>Outstanding Report</h5>
// //                 <div className="date-filter-container mt-3">
// //                    <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>

// //               {/* Booking Report Tab */}
// //               <CTabPane visible={activeTab === 'booking'}>
// //                  <h5>Booking Report</h5>
// //                 <div className="date-filter-container mt-3">
// //                    <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>

// //               {/* GC Report Tab */}
// //               <CTabPane visible={activeTab === 'gc'}>
// //                  <h5>GC Report</h5>
// //                 <div className="date-filter-container mt-3">
            
// //                     <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>
// //             </CTabContent>
// //           </CCardBody>
// //         </CCard>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PeriodicReport;




// // import React, { useState, useEffect } from 'react';
// // import DatePicker from 'react-datepicker';
// // import 'react-datepicker/dist/react-datepicker.css';
// // import '../../css/report.css';
// // import { toast } from 'react-toastify';
// // import axiosInstance from '../../axiosInstance';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   MODULES, 
// //   PAGES,
// //   canViewPage 
// // } from '../../utils/modulePermissions';
// // import { useAuth } from '../../context/AuthContext';
// // import { showError } from '../../utils/sweetAlerts';
// // import { CFormSelect, CSpinner, CAlert, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs } from '@coreui/react';

// // const PeriodicReport = () => {
// //   const [fromDate, setFromDate] = useState(null);
// //   const [toDate, setToDate] = useState(new Date());
// //   const [exportLoading, setExportLoading] = useState(false);
// //   const [branches, setBranches] = useState([]);
// //   const [selectedBranch, setSelectedBranch] = useState('');
// //   const [branchLoading, setBranchLoading] = useState(true);
// //   const [apiError, setApiError] = useState('');
// //   const [activeTab, setActiveTab] = useState('sales');
// //   const [selectedType, setSelectedType] = useState('');
// //   const navigate = useNavigate();

// //   const { permissions = [], user } = useAuth();

// //   const canViewPeriodicReport = canViewPage(permissions, MODULES.SALES_REPORT, PAGES.SALES_REPORT.PERIODIC_REPORT);
   
// //   const hasAllBranchAccess = user?.branchAccess === "ALL";
  
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '';
    
// //     try {
// //       const date = new Date(dateString);
// //       if (isNaN(date.getTime())) return '';
      
// //       const day = String(date.getDate()).padStart(2, '0');
// //       const month = String(date.getMonth() + 1).padStart(2, '0');
// //       const year = date.getFullYear();
      
// //       return `${day}-${month}-${year}`;
// //     } catch (error) {
// //       console.error('Error formatting date:', error);
// //       return '';
// //     }
// //   };

// //   const formatDateForAPI = (date) => {
// //     if (!date) return '';
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     const day = String(date.getDate()).padStart(2, '0');
// //     return `${year}-${month}-${day}`;
// //   };

// //   useEffect(() => {
// //     if (!canViewPeriodicReport) {
// //       showError('You do not have permission to view Periodic Reports');
// //       navigate('/dashboard');
// //       return;
// //     }
// //     fetchBranches();
// //   }, [canViewPeriodicReport, navigate]);

// //   const fetchBranches = async () => {
// //     try {
// //       setBranchLoading(true);
// //       const response = await axiosInstance.get('/branches');
      
// //       if (response.data.success) {
// //         const activeBranches = response.data.data.filter(branch => branch.is_active);
// //         setBranches(activeBranches);
      
// //         if (user?.branchId) {
// //           const userBranch = activeBranches.find(b => b.id === user.branchId);
// //           if (userBranch) {
// //             setSelectedBranch(userBranch.id);
// //           }
// //         } else if (activeBranches.length > 0) {
// //           setSelectedBranch(activeBranches[0].id);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error fetching branches:', error);
// //       toast.error('Failed to load branches');
// //     } finally {
// //       setBranchLoading(false);
// //     }
// //   };

// //   const getReportName = (tab) => {
// //     switch(tab) {
// //       case 'sales': return 'Sales Report';
// //       case 'outstanding': return 'Outstanding Report';
// //       case 'booking': return 'Booking Report';
// //       case 'gc': return 'GC Report';
// //       default: return 'Report';
// //     }
// //   };

// //   const getAPIEndpoint = () => {
// //     switch(activeTab) {
// //       case 'sales':
// //         return '/reports/branch-sales';
// //       case 'outstanding':
// //         return '/reports/outstanding';
// //       case 'booking':
// //         return '/reports/bookings';
// //       case 'gc':
// //         return '/reports/gc';
// //       default:
// //         return '/reports/branch-sales';
// //     }
// //   };

// //   const getFileName = (branchName, fromDateStr, toDateStr) => {
// //     const reportType = getReportName(activeTab).replace(' ', '_');
// //     return `${reportType}_${branchName}_${fromDateStr}_to_${toDateStr}.xlsx`;
// //   };

// //   const handleExportToExcel = async () => {
// //     setApiError('');

// //     if (!canViewPeriodicReport) {
// //       showError('You do not have permission to export Periodic Reports');
// //       return;
// //     }

// //     if (!selectedBranch) {
// //       toast.error('Please select a branch');
// //       return;
// //     }

// //     if (!fromDate || !toDate) {
// //       toast.error('Please select both from and to dates');
// //       return;
// //     }

// //     if (fromDate > toDate) {
// //       toast.error('From date cannot be after To date');
// //       return;
// //     }

// //     try {
// //       setExportLoading(true);
      
// //       const formattedFromDate = formatDateForAPI(fromDate);
// //       const formattedToDate = formatDateForAPI(toDate);
// //       const apiEndpoint = getAPIEndpoint();

// //       const params = new URLSearchParams({
// //         modelType: selectedType,
// //         startDate: formattedFromDate,
// //         endDate: formattedToDate,
// //         format: 'excel'
// //       });

// //       // Only for Sales Report tab, check if "Branch and subdealer" option is selected (value = 'both')
// //       if (activeTab === 'sales' && selectedBranch === 'both') {
// //         // Don't send branchId, send bookingSource=BOTH instead
// //         params.append('bookingSource', 'BOTH');
// //       } else {
// //         // Send normal branchId for all other cases
// //         params.append('branchId', selectedBranch);
// //       }

// //       const response = await axiosInstance.get(
// //         `${apiEndpoint}?${params.toString()}`,
// //         { responseType: 'blob' }
// //       );

// //       const contentType = response.headers['content-type'];
      
// //       if (contentType && contentType.includes('application/json')) {

// //         const text = await new Promise((resolve, reject) => {
// //           const reader = new FileReader();
// //           reader.onload = () => resolve(reader.result);
// //           reader.onerror = reject;
// //           reader.readAsText(response.data);
// //         });
        
// //         const errorData = JSON.parse(text);
        
// //         if (!errorData.success && errorData.message) {
// //           setApiError(errorData.message);
// //           toast.error(errorData.message);
// //           return;
// //         }
// //       }

// //       const blob = new Blob([response.data], { 
// //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
// //       });
      
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement('a');
// //       link.href = url;
      
// //       // Get branch name for filename - handle the 'both' case only for sales tab
// //       let branchName = 'Branch';
// //       if (activeTab === 'sales' && selectedBranch === 'both') {
// //         branchName = 'Branch_And_Subdealer';
// //       } else {
// //         branchName = branches.find(b => b.id === selectedBranch)?.name || 'Branch';
// //       }
      
// //       const fromDateStr = fromDate ? formatDate(fromDate) : '';
// //       const toDateStr = toDate ? formatDate(toDate) : '';
// //       const fileName = getFileName(branchName, fromDateStr, toDateStr);
// //       link.setAttribute('download', fileName);
      
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
      
// //       window.URL.revokeObjectURL(url);
// //       toast.success(`${getReportName(activeTab)} exported successfully`);

// //     } catch (error) {
// //       console.error('Error exporting report:', error);
      
// //       // For blob errors, we need to read the blob
// //       if (error.response && error.response.data instanceof Blob) {
// //         try {
// //           const text = await new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onload = () => resolve(reader.result);
// //             reader.onerror = reject;
// //             reader.readAsText(error.response.data);
// //           });
          
// //           const errorData = JSON.parse(text);
          
// //           // Show the exact error message from API
// //           if (errorData.message) {
// //             setApiError(errorData.message);
// //             toast.error(errorData.message);
// //           }
// //         } catch (parseError) {
// //           console.error('Error parsing error response:', parseError);
// //           setApiError('Failed to export report');
// //           toast.error('Failed to export report');
// //         }
// //       } else if (error.response?.data?.message) {
// //         // Regular error with message in response
// //         setApiError(error.response.data.message);
// //         toast.error(error.response.data.message);
// //       } else if (error.message) {
// //         // Network or other errors
// //         setApiError(error.message);
// //         toast.error(error.message);
// //       } else {
// //         setApiError('Failed to export report');
// //         toast.error('Failed to export report');
// //       }
      
// //     } finally {
// //       setExportLoading(false);
// //     }
// //   };

// //   // Clear error when user changes filters
// //   useEffect(() => {
// //     setApiError('');
// //   }, [selectedBranch, fromDate, toDate, selectedType, activeTab]);

// //   // Check if user has permission to view this page
// //   if (!canViewPeriodicReport) {
// //     return (
// //       <div className="alert alert-danger m-3" role="alert">
// //         You do not have permission to view Periodic Reports.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="rto-report-container">
// //       <h4 className="rto-report-title">Periodic Reports</h4>

// //       <div className="rto-report-card">
// //         {/* Display API Error at the top - only shows the exact error message */}
// //         {apiError && (
// //           <CAlert color="danger" className="mb-3">
// //             {apiError}
// //           </CAlert>
// //         )}

// //         {/* Tabs for different report types - all visible since they use same permission */}
// //         <CCard>
// //           <CCardHeader>
// //             <CNav variant="tabs" className="card-header-tabs">
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'sales'}
// //                   onClick={() => setActiveTab('sales')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   Sales Report
// //                 </CNavLink>
// //               </CNavItem>
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'outstanding'}
// //                   onClick={() => setActiveTab('outstanding')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   Outstanding Report
// //                 </CNavLink>
// //               </CNavItem>
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'booking'}
// //                   onClick={() => setActiveTab('booking')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   Booking Report
// //                 </CNavLink>
// //               </CNavItem>
// //               <CNavItem>
// //                 <CNavLink
// //                   active={activeTab === 'gc'}
// //                   onClick={() => setActiveTab('gc')}
// //                   style={{ cursor: 'pointer' }}
// //                 >
// //                   GC Report
// //                 </CNavLink>
// //               </CNavItem>
// //             </CNav>
// //           </CCardHeader>
// //           <CCardBody>
// //             <CTabContent>
// //               <CTabPane visible={activeTab === 'sales'}>
// //                    <h5 className="mb-3">Sales Report</h5>
// //                 <div className="date-filter-container mt-3">

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {/* New option for Branch and Subdealer - ONLY IN SALES TAB */}
// //                         <option value="both">Branch and Subdealer</option>
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>

           
// //               <CTabPane visible={activeTab === 'outstanding'}>
// //                   <h5>Outstanding Report</h5>
// //                 <div className="date-filter-container mt-3">
// //                    <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {/* NO "Branch and Subdealer" option here */}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>

// //               {/* Booking Report Tab */}
// //               <CTabPane visible={activeTab === 'booking'}>
// //                  <h5>Booking Report</h5>
// //                 <div className="date-filter-container mt-3">
// //                    <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {/* NO "Branch and Subdealer" option here */}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>

// //               {/* GC Report Tab */}
// //               <CTabPane visible={activeTab === 'gc'}>
// //                  <h5>GC Report</h5>
// //                 <div className="date-filter-container mt-3">
            
// //                     <div className="date-filter-group">
// //                     <label className="date-filter-label">Model Type:</label>
                   
// //                       <CFormSelect
// //                         value={selectedType}
// //                         onChange={(e) => setSelectedType(e.target.value)}
// //                         className="date-picker"
      
// //                       >
// //                         <option value="">Select</option>
// //                          <option value="EV">EV</option>
// //                           <option value="ICE">ICE</option>
                      
// //                       </CFormSelect>
                  
// //                   </div>
// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">Select Branch:</label>
// //                     {branchLoading ? (
// //                       <div className="date-picker">
// //                         <CSpinner size="sm" />
// //                       </div>
// //                     ) : (
// //                       <CFormSelect
// //                         value={selectedBranch}
// //                         onChange={(e) => setSelectedBranch(e.target.value)}
// //                         className="date-picker"
// //                         disabled={branches.length === 0}
// //                       >
// //                         <option value="">Select Branch</option>
// //                         {hasAllBranchAccess && (
// //                           <option value="all">All Branch</option>
// //                         )}
// //                         {/* NO "Branch and Subdealer" option here */}
// //                         {branches.map((branch) => (
// //                           <option key={branch.id} value={branch.id}>
// //                             {branch.name}
// //                           </option>
// //                         ))}
// //                       </CFormSelect>
// //                     )}
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">From Date:</label>
// //                     <DatePicker
// //                       selected={fromDate}
// //                       onChange={(date) => setFromDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsStart
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <div className="date-filter-group">
// //                     <label className="date-filter-label">To Date:</label>
// //                     <DatePicker
// //                       selected={toDate}
// //                       onChange={(date) => setToDate(date)}
// //                       className="date-picker"
// //                       maxDate={new Date()}
// //                       selectsEnd
// //                       startDate={fromDate}
// //                       endDate={toDate}
// //                       minDate={fromDate}
// //                       placeholderText="DD-MM-YYYY"
// //                       dateFormat="dd-MM-yyyy"
// //                       showYearDropdown
// //                       scrollableYearDropdown
// //                       yearDropdownItemNumber={15}
// //                     />
// //                   </div>

// //                   <button 
// //                     className="export-button" 
// //                     onClick={handleExportToExcel} 
// //                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
// //                   >
// //                     {exportLoading ? (
// //                       <>
// //                         <CSpinner size="sm" className="me-2" />
// //                         Exporting...
// //                       </>
// //                     ) : 'Export to Excel'}
// //                   </button>
// //                 </div>
// //               </CTabPane>
// //             </CTabContent>
// //           </CCardBody>
// //         </CCard>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PeriodicReport;




// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import '../../css/report.css';
// import { toast } from 'react-toastify';
// import axiosInstance from '../../axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { 
//   MODULES, 
//   PAGES,
//   canViewPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';
// import { showError } from '../../utils/sweetAlerts';
// import { CFormSelect, CSpinner, CAlert, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs } from '@coreui/react';

// const PeriodicReport = () => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(new Date());
//   const [exportLoading, setExportLoading] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [branchLoading, setBranchLoading] = useState(true);
//   const [apiError, setApiError] = useState('');
//   const [activeTab, setActiveTab] = useState('sales');
//   const [selectedType, setSelectedType] = useState('');
//   const navigate = useNavigate();

//   const { permissions = [], user } = useAuth();

//   const canViewPeriodicReport = canViewPage(permissions, MODULES.SALES_REPORT, PAGES.SALES_REPORT.PERIODIC_REPORT);
   
//   const hasAllBranchAccess = user?.branchAccess === "ALL";
  
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '';
      
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return '';
//     }
//   };

//   const formatDateForAPI = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     if (!canViewPeriodicReport) {
//       showError('You do not have permission to view Periodic Reports');
//       navigate('/dashboard');
//       return;
//     }
//     fetchBranches();
//   }, [canViewPeriodicReport, navigate]);

//   const fetchBranches = async () => {
//     try {
//       setBranchLoading(true);
//       const response = await axiosInstance.get('/branches');
      
//       if (response.data.success) {
//         const activeBranches = response.data.data.filter(branch => branch.is_active);
//         setBranches(activeBranches);
      
//         if (user?.branchId) {
//           const userBranch = activeBranches.find(b => b.id === user.branchId);
//           if (userBranch) {
//             setSelectedBranch(userBranch.id);
//           }
//         } else if (activeBranches.length > 0) {
//           setSelectedBranch(activeBranches[0].id);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       toast.error('Failed to load branches');
//     } finally {
//       setBranchLoading(false);
//     }
//   };

//   const getReportName = (tab) => {
//     switch(tab) {
//       case 'sales': return 'Sales Report';
//       case 'outstanding': return 'Outstanding Report';
//       case 'booking': return 'Booking Report';
//       case 'gc': return 'GC Report';
//       default: return 'Report';
//     }
//   };

//   const getAPIEndpoint = () => {
//     switch(activeTab) {
//       case 'sales':
//         return '/reports/branch-sales';
//       case 'outstanding':
//         return '/reports/outstanding';
//       case 'booking':
//         return '/reports/bookings';
//       case 'gc':
//         return '/reports/gc';
//       default:
//         return '/reports/branch-sales';
//     }
//   };

//   const getFileName = (branchName, fromDateStr, toDateStr) => {
//     const reportType = getReportName(activeTab).replace(' ', '_');
//     return `${reportType}_${branchName}_${fromDateStr}_to_${toDateStr}.xlsx`;
//   };

//   const handleExportToExcel = async () => {
//     setApiError('');

//     if (!canViewPeriodicReport) {
//       showError('You do not have permission to export Periodic Reports');
//       return;
//     }

//     if (!selectedBranch) {
//       toast.error('Please select a branch');
//       return;
//     }

//     // Only validate dates for tabs that require them
//     if (activeTab !== 'outstanding') {
//       if (!fromDate || !toDate) {
//         toast.error('Please select both from and to dates');
//         return;
//       }

//       if (fromDate > toDate) {
//         toast.error('From date cannot be after To date');
//         return;
//       }
//     }

//     try {
//       setExportLoading(true);
      
//       const apiEndpoint = getAPIEndpoint();

//       const params = new URLSearchParams({
//         modelType: selectedType,
//         format: 'excel'
//       });

//       // Add dates only for non-outstanding tabs
//       if (activeTab !== 'outstanding') {
//         const formattedFromDate = formatDateForAPI(fromDate);
//         const formattedToDate = formatDateForAPI(toDate);
//         params.append('startDate', formattedFromDate);
//         params.append('endDate', formattedToDate);
//       }

//       // Only for Sales Report tab, check if "Branch and subdealer" option is selected (value = 'both')
//       if (activeTab === 'sales' && selectedBranch === 'both') {
//         // Don't send branchId, send bookingSource=BOTH instead
//         params.append('bookingSource', 'BOTH');
//       } else {
//         // Send normal branchId for all other cases
//         params.append('branchId', selectedBranch);
//       }

//       const response = await axiosInstance.get(
//         `${apiEndpoint}?${params.toString()}`,
//         { responseType: 'blob' }
//       );

//       const contentType = response.headers['content-type'];
      
//       if (contentType && contentType.includes('application/json')) {

//         const text = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsText(response.data);
//         });
        
//         const errorData = JSON.parse(text);
        
//         if (!errorData.success && errorData.message) {
//           setApiError(errorData.message);
//           toast.error(errorData.message);
//           return;
//         }
//       }

//       const blob = new Blob([response.data], { 
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Get branch name for filename - handle the 'both' case only for sales tab
//       let branchName = 'Branch';
//       if (activeTab === 'sales' && selectedBranch === 'both') {
//         branchName = 'Branch_And_Subdealer';
//       } else {
//         branchName = branches.find(b => b.id === selectedBranch)?.name || 'Branch';
//       }
      
//       let fileName;
//       if (activeTab === 'outstanding') {
//         // For outstanding report, don't include dates in filename
//         fileName = `${getReportName(activeTab).replace(' ', '_')}_${branchName}.xlsx`;
//       } else {
//         const fromDateStr = fromDate ? formatDate(fromDate) : '';
//         const toDateStr = toDate ? formatDate(toDate) : '';
//         fileName = getFileName(branchName, fromDateStr, toDateStr);
//       }
      
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       window.URL.revokeObjectURL(url);
//       toast.success(`${getReportName(activeTab)} exported successfully`);

//     } catch (error) {
//       console.error('Error exporting report:', error);
      
//       // For blob errors, we need to read the blob
//       if (error.response && error.response.data instanceof Blob) {
//         try {
//           const text = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsText(error.response.data);
//           });
          
//           const errorData = JSON.parse(text);
          
//           // Show the exact error message from API
//           if (errorData.message) {
//             setApiError(errorData.message);
//             toast.error(errorData.message);
//           }
//         } catch (parseError) {
//           console.error('Error parsing error response:', parseError);
//           setApiError('Failed to export report');
//           toast.error('Failed to export report');
//         }
//       } else if (error.response?.data?.message) {
//         // Regular error with message in response
//         setApiError(error.response.data.message);
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         // Network or other errors
//         setApiError(error.message);
//         toast.error(error.message);
//       } else {
//         setApiError('Failed to export report');
//         toast.error('Failed to export report');
//       }
      
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // Clear error when user changes filters
//   useEffect(() => {
//     setApiError('');
//   }, [selectedBranch, fromDate, toDate, selectedType, activeTab]);

//   // Check if user has permission to view this page
//   if (!canViewPeriodicReport) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view Periodic Reports.
//       </div>
//     );
//   }

//   return (
//     <div className="rto-report-container">
//       <h4 className="rto-report-title">Periodic Reports</h4>

//       <div className="rto-report-card">
//         {/* Display API Error at the top - only shows the exact error message */}
//         {apiError && (
//           <CAlert color="danger" className="mb-3">
//             {apiError}
//           </CAlert>
//         )}

//         {/* Tabs for different report types - all visible since they use same permission */}
//         <CCard>
//           <CCardHeader>
//             <CNav variant="tabs" className="card-header-tabs">
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 'sales'}
//                   onClick={() => setActiveTab('sales')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Sales Report
//                 </CNavLink>
//               </CNavItem>
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 'outstanding'}
//                   onClick={() => setActiveTab('outstanding')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Outstanding Report
//                 </CNavLink>
//               </CNavItem>
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 'booking'}
//                   onClick={() => setActiveTab('booking')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Booking Report
//                 </CNavLink>
//               </CNavItem>
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 'gc'}
//                   onClick={() => setActiveTab('gc')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   GC Report
//                 </CNavLink>
//               </CNavItem>
//             </CNav>
//           </CCardHeader>
//           <CCardBody>
//             <CTabContent>
//               <CTabPane visible={activeTab === 'sales'}>
//                    <h5 className="mb-3">Sales Report</h5>
//                 <div className="date-filter-container mt-3">

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">Model Type:</label>
                   
//                       <CFormSelect
//                         value={selectedType}
//                         onChange={(e) => setSelectedType(e.target.value)}
//                         className="date-picker"
      
//                       >
//                         <option value="">Select</option>
//                          <option value="EV">EV</option>
//                           <option value="ICE">ICE</option>
                      
//                       </CFormSelect>
                  
//                   </div>
//                   <div className="date-filter-group">
//                     <label className="date-filter-label">Select Branch:</label>
//                     {branchLoading ? (
//                       <div className="date-picker">
//                         <CSpinner size="sm" />
//                       </div>
//                     ) : (
//                       <CFormSelect
//                         value={selectedBranch}
//                         onChange={(e) => setSelectedBranch(e.target.value)}
//                         className="date-picker"
//                         disabled={branches.length === 0}
//                       >
//                         <option value="">Select Branch</option>
//                         {hasAllBranchAccess && (
//                           <option value="all">All Branch</option>
//                         )}
//                         {/* New option for Branch and Subdealer - ONLY IN SALES TAB */}
//                         <option value="both">Branch and Subdealer</option>
//                         {branches.map((branch) => (
//                           <option key={branch.id} value={branch.id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     )}
//                   </div>

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">From Date:</label>
//                     <DatePicker
//                       selected={fromDate}
//                       onChange={(date) => setFromDate(date)}
//                       className="date-picker"
//                       maxDate={new Date()}
//                       selectsStart
//                       startDate={fromDate}
//                       endDate={toDate}
//                       placeholderText="DD-MM-YYYY"
//                       dateFormat="dd-MM-yyyy"
//                       showYearDropdown
//                       scrollableYearDropdown
//                       yearDropdownItemNumber={15}
//                     />
//                   </div>

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">To Date:</label>
//                     <DatePicker
//                       selected={toDate}
//                       onChange={(date) => setToDate(date)}
//                       className="date-picker"
//                       maxDate={new Date()}
//                       selectsEnd
//                       startDate={fromDate}
//                       endDate={toDate}
//                       minDate={fromDate}
//                       placeholderText="DD-MM-YYYY"
//                       dateFormat="dd-MM-yyyy"
//                       showYearDropdown
//                       scrollableYearDropdown
//                       yearDropdownItemNumber={15}
//                     />
//                   </div>

//                   <button 
//                     className="export-button" 
//                     onClick={handleExportToExcel} 
//                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
//                   >
//                     {exportLoading ? (
//                       <>
//                         <CSpinner size="sm" className="me-2" />
//                         Exporting...
//                       </>
//                     ) : 'Export to Excel'}
//                   </button>
//                 </div>
//               </CTabPane>

           
//               <CTabPane visible={activeTab === 'outstanding'}>
//                   <h5>Outstanding Report</h5>
//                 <div className="date-filter-container mt-3">
//                    <div className="date-filter-group">
//                     <label className="date-filter-label">Model Type:</label>
                   
//                       <CFormSelect
//                         value={selectedType}
//                         onChange={(e) => setSelectedType(e.target.value)}
//                         className="date-picker"
      
//                       >
//                         <option value="">Select</option>
//                          <option value="EV">EV</option>
//                           <option value="ICE">ICE</option>
                      
//                       </CFormSelect>
                  
//                   </div>
//                   <div className="date-filter-group">
//                     <label className="date-filter-label">Select Branch:</label>
//                     {branchLoading ? (
//                       <div className="date-picker">
//                         <CSpinner size="sm" />
//                       </div>
//                     ) : (
//                       <CFormSelect
//                         value={selectedBranch}
//                         onChange={(e) => setSelectedBranch(e.target.value)}
//                         className="date-picker"
//                         disabled={branches.length === 0}
//                       >
//                         <option value="">Select Branch</option>
//                         {hasAllBranchAccess && (
//                           <option value="all">All Branch</option>
//                         )}
//                         {/* NO "Branch and Subdealer" option here */}
//                         {branches.map((branch) => (
//                           <option key={branch.id} value={branch.id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     )}
//                   </div>

//                   <button 
//                     className="export-button" 
//                     onClick={handleExportToExcel} 
//                     disabled={exportLoading || !selectedBranch}
//                   >
//                     {exportLoading ? (
//                       <>
//                         <CSpinner size="sm" className="me-2" />
//                         Exporting...
//                       </>
//                     ) : 'Export to Excel'}
//                   </button>
//                 </div>
//               </CTabPane>

//               {/* Booking Report Tab */}
//               <CTabPane visible={activeTab === 'booking'}>
//                  <h5>Booking Report</h5>
//                 <div className="date-filter-container mt-3">
//                    <div className="date-filter-group">
//                     <label className="date-filter-label">Model Type:</label>
                   
//                       <CFormSelect
//                         value={selectedType}
//                         onChange={(e) => setSelectedType(e.target.value)}
//                         className="date-picker"
      
//                       >
//                         <option value="">Select</option>
//                          <option value="EV">EV</option>
//                           <option value="ICE">ICE</option>
                      
//                       </CFormSelect>
                  
//                   </div>
//                   <div className="date-filter-group">
//                     <label className="date-filter-label">Select Branch:</label>
//                     {branchLoading ? (
//                       <div className="date-picker">
//                         <CSpinner size="sm" />
//                       </div>
//                     ) : (
//                       <CFormSelect
//                         value={selectedBranch}
//                         onChange={(e) => setSelectedBranch(e.target.value)}
//                         className="date-picker"
//                         disabled={branches.length === 0}
//                       >
//                         <option value="">Select Branch</option>
//                         {hasAllBranchAccess && (
//                           <option value="all">All Branch</option>
//                         )}
//                         {/* NO "Branch and Subdealer" option here */}
//                         {branches.map((branch) => (
//                           <option key={branch.id} value={branch.id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     )}
//                   </div>

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">From Date:</label>
//                     <DatePicker
//                       selected={fromDate}
//                       onChange={(date) => setFromDate(date)}
//                       className="date-picker"
//                       maxDate={new Date()}
//                       selectsStart
//                       startDate={fromDate}
//                       endDate={toDate}
//                       placeholderText="DD-MM-YYYY"
//                       dateFormat="dd-MM-yyyy"
//                       showYearDropdown
//                       scrollableYearDropdown
//                       yearDropdownItemNumber={15}
//                     />
//                   </div>

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">To Date:</label>
//                     <DatePicker
//                       selected={toDate}
//                       onChange={(date) => setToDate(date)}
//                       className="date-picker"
//                       maxDate={new Date()}
//                       selectsEnd
//                       startDate={fromDate}
//                       endDate={toDate}
//                       minDate={fromDate}
//                       placeholderText="DD-MM-YYYY"
//                       dateFormat="dd-MM-yyyy"
//                       showYearDropdown
//                       scrollableYearDropdown
//                       yearDropdownItemNumber={15}
//                     />
//                   </div>

//                   <button 
//                     className="export-button" 
//                     onClick={handleExportToExcel} 
//                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
//                   >
//                     {exportLoading ? (
//                       <>
//                         <CSpinner size="sm" className="me-2" />
//                         Exporting...
//                       </>
//                     ) : 'Export to Excel'}
//                   </button>
//                 </div>
//               </CTabPane>

//               {/* GC Report Tab */}
//               <CTabPane visible={activeTab === 'gc'}>
//                  <h5>GC Report</h5>
//                 <div className="date-filter-container mt-3">
            
//                     <div className="date-filter-group">
//                     <label className="date-filter-label">Model Type:</label>
                   
//                       <CFormSelect
//                         value={selectedType}
//                         onChange={(e) => setSelectedType(e.target.value)}
//                         className="date-picker"
      
//                       >
//                         <option value="">Select</option>
//                          <option value="EV">EV</option>
//                           <option value="ICE">ICE</option>
                      
//                       </CFormSelect>
                  
//                   </div>
//                   <div className="date-filter-group">
//                     <label className="date-filter-label">Select Branch:</label>
//                     {branchLoading ? (
//                       <div className="date-picker">
//                         <CSpinner size="sm" />
//                       </div>
//                     ) : (
//                       <CFormSelect
//                         value={selectedBranch}
//                         onChange={(e) => setSelectedBranch(e.target.value)}
//                         className="date-picker"
//                         disabled={branches.length === 0}
//                       >
//                         <option value="">Select Branch</option>
//                         {hasAllBranchAccess && (
//                           <option value="all">All Branch</option>
//                         )}
//                         {/* NO "Branch and Subdealer" option here */}
//                         {branches.map((branch) => (
//                           <option key={branch.id} value={branch.id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     )}
//                   </div>

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">From Date:</label>
//                     <DatePicker
//                       selected={fromDate}
//                       onChange={(date) => setFromDate(date)}
//                       className="date-picker"
//                       maxDate={new Date()}
//                       selectsStart
//                       startDate={fromDate}
//                       endDate={toDate}
//                       placeholderText="DD-MM-YYYY"
//                       dateFormat="dd-MM-yyyy"
//                       showYearDropdown
//                       scrollableYearDropdown
//                       yearDropdownItemNumber={15}
//                     />
//                   </div>

//                   <div className="date-filter-group">
//                     <label className="date-filter-label">To Date:</label>
//                     <DatePicker
//                       selected={toDate}
//                       onChange={(date) => setToDate(date)}
//                       className="date-picker"
//                       maxDate={new Date()}
//                       selectsEnd
//                       startDate={fromDate}
//                       endDate={toDate}
//                       minDate={fromDate}
//                       placeholderText="DD-MM-YYYY"
//                       dateFormat="dd-MM-yyyy"
//                       showYearDropdown
//                       scrollableYearDropdown
//                       yearDropdownItemNumber={15}
//                     />
//                   </div>

//                   <button 
//                     className="export-button" 
//                     onClick={handleExportToExcel} 
//                     disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
//                   >
//                     {exportLoading ? (
//                       <>
//                         <CSpinner size="sm" className="me-2" />
//                         Exporting...
//                       </>
//                     ) : 'Export to Excel'}
//                   </button>
//                 </div>
//               </CTabPane>
//             </CTabContent>
//           </CCardBody>
//         </CCard>
//       </div>
//     </div>
//   );
// };

// export default PeriodicReport;







import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/report.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  MODULES, 
  PAGES,
  canViewPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';
import { showError } from '../../utils/sweetAlerts';
import { CFormSelect, CSpinner, CAlert, CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs, CFormInput } from '@coreui/react';

const PeriodicReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [exportLoading, setExportLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branchLoading, setBranchLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedType, setSelectedType] = useState('');
  const [subdealers, setSubdealers] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [subdealerLoading, setSubdealerLoading] = useState(false);
  const [subdealerSearchTerm, setSubdealerSearchTerm] = useState('');
  const [showSubdealerDropdown, setShowSubdealerDropdown] = useState(false);
  const navigate = useNavigate();

  const { permissions = [], user } = useAuth();

  const canViewPeriodicReport = canViewPage(permissions, MODULES.SALES_REPORT, PAGES.SALES_REPORT.PERIODIC_REPORT);
   
  const hasAllBranchAccess = user?.branchAccess === "ALL";
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!canViewPeriodicReport) {
      showError('You do not have permission to view Periodic Reports');
      navigate('/dashboard');
      return;
    }
    fetchBranches();
    fetchSubdealers();
  }, [canViewPeriodicReport, navigate]);

  const fetchBranches = async () => {
    try {
      setBranchLoading(true);
      const response = await axiosInstance.get('/branches');
      
      if (response.data.success) {
        const activeBranches = response.data.data.filter(branch => branch.is_active);
        setBranches(activeBranches);
      
        if (user?.branchId) {
          const userBranch = activeBranches.find(b => b.id === user.branchId);
          if (userBranch) {
            setSelectedBranch(userBranch.id);
          }
        } else if (activeBranches.length > 0) {
          setSelectedBranch(activeBranches[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setBranchLoading(false);
    }
  };

  const fetchSubdealers = async () => {
    try {
      setSubdealerLoading(true);
      const response = await axiosInstance.get('/subdealers');
      
      if (response.data?.data?.subdealers) {
        // Filter only active subdealers
        const activeSubdealers = response.data.data.subdealers.filter(
          subdealer => subdealer.status === 'active'
        );
        setSubdealers(activeSubdealers);
      }
    } catch (error) {
      console.error('Error fetching subdealers:', error);
      toast.error('Failed to load subdealers');
    } finally {
      setSubdealerLoading(false);
    }
  };

  // Filter subdealers based on search term
  const filteredSubdealers = subdealers.filter(subdealer =>
    subdealer.name.toLowerCase().includes(subdealerSearchTerm.toLowerCase())
  );

  const getReportName = (tab) => {
    switch(tab) {
      case 'sales': return 'Sales Report';
      case 'outstanding': return 'Outstanding Report';
      case 'booking': return 'Booking Report';
      case 'gc': return 'GC Report';
      default: return 'Report';
    }
  };

  const getAPIEndpoint = () => {
    switch(activeTab) {
      case 'sales':
        return '/reports/branch-sales'; // Keeping the original endpoint
      case 'outstanding':
        return '/reports/outstanding';
      case 'booking':
        return '/reports/bookings';
      case 'gc':
        return '/reports/gc';
      default:
        return '/reports/branch-sales';
    }
  };

  const getFileName = (branchName, fromDateStr, toDateStr) => {
    const reportType = getReportName(activeTab).replace(' ', '_');
    return `${reportType}_${branchName}_${fromDateStr}_to_${toDateStr}.xlsx`;
  };

  const handleExportToExcel = async () => {
    setApiError('');

    if (!canViewPeriodicReport) {
      showError('You do not have permission to export Periodic Reports');
      return;
    }

    if (activeTab === 'sales') {
      // For sales report, check if branch selection is required
      if (!selectedBranch && !selectedSubdealer) {
        toast.error('Please select either a branch or subdealer');
        return;
      }
    } else {
      if (!selectedBranch) {
        toast.error('Please select a branch');
        return;
      }
    }

    // Only validate dates for tabs that require them
    if (activeTab !== 'outstanding') {
      if (!fromDate || !toDate) {
        toast.error('Please select both from and to dates');
        return;
      }

      if (fromDate > toDate) {
        toast.error('From date cannot be after To date');
        return;
      }
    }

    try {
      setExportLoading(true);
      
      const apiEndpoint = getAPIEndpoint();

      const params = new URLSearchParams({
        modelType: selectedType,
        format: 'excel'
      });

      // Add dates only for non-outstanding tabs
      if (activeTab !== 'outstanding') {
        const formattedFromDate = formatDateForAPI(fromDate);
        const formattedToDate = formatDateForAPI(toDate);
        params.append('startDate', formattedFromDate);
        params.append('endDate', formattedToDate);
      }

      // Handle Sales Report specific logic
      if (activeTab === 'sales') {
        // Check if subdealer is selected
        if (selectedSubdealer) {
          if (selectedSubdealer === 'all') {
            params.append('sourceType', 'SUBDEALER');
            params.append('subdealerId', 'all');
          } else {
            params.append('sourceType', 'SUBDEALER');
            params.append('subdealerId', selectedSubdealer);
          }
        } 
        // Check if Branch and Subdealer option is selected
        else if (selectedBranch === 'both') {
          params.append('bookingSource', 'BOTH');
        }
        // Normal branch selection
        else if (selectedBranch) {
          params.append('branchId', selectedBranch);
        }
      } else {
        // For other tabs, send branchId normally
        params.append('branchId', selectedBranch);
      }

      const response = await axiosInstance.get(
        `${apiEndpoint}?${params.toString()}`,
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {

        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(response.data);
        });
        
        const errorData = JSON.parse(text);
        
        if (!errorData.success && errorData.message) {
          setApiError(errorData.message);
          toast.error(errorData.message);
          return;
        }
      }

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get branch name for filename - handle different cases
      let branchName = 'Branch';
      if (activeTab === 'sales') {
        if (selectedSubdealer) {
          if (selectedSubdealer === 'all') {
            branchName = 'All_Subdealers';
          } else {
            const subdealer = subdealers.find(s => s._id === selectedSubdealer);
            branchName = subdealer?.name || 'Subdealer';
          }
        } else if (selectedBranch === 'both') {
          branchName = 'Branch_And_Subdealer';
        } else {
          branchName = branches.find(b => b.id === selectedBranch)?.name || 'Branch';
        }
      } else {
        branchName = branches.find(b => b.id === selectedBranch)?.name || 'Branch';
      }
      
      let fileName;
      if (activeTab === 'outstanding') {
        // For outstanding report, don't include dates in filename
        fileName = `${getReportName(activeTab).replace(' ', '_')}_${branchName}.xlsx`;
      } else {
        const fromDateStr = fromDate ? formatDate(fromDate) : '';
        const toDateStr = toDate ? formatDate(toDate) : '';
        fileName = getFileName(branchName, fromDateStr, toDateStr);
      }
      
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      toast.success(`${getReportName(activeTab)} exported successfully`);

    } catch (error) {
      console.error('Error exporting report:', error);
      
      // For blob errors, we need to read the blob
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(error.response.data);
          });
          
          const errorData = JSON.parse(text);
          
          // Show the exact error message from API
          if (errorData.message) {
            setApiError(errorData.message);
            toast.error(errorData.message);
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setApiError('Failed to export report');
          toast.error('Failed to export report');
        }
      } else if (error.response?.data?.message) {
        // Regular error with message in response
        setApiError(error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.message) {
        // Network or other errors
        setApiError(error.message);
        toast.error(error.message);
      } else {
        setApiError('Failed to export report');
        toast.error('Failed to export report');
      }
      
    } finally {
      setExportLoading(false);
    }
  };

  // Clear error when user changes filters
  useEffect(() => {
    setApiError('');
  }, [selectedBranch, fromDate, toDate, selectedType, activeTab, selectedSubdealer]);

  // Reset subdealer selection when branch changes
  useEffect(() => {
    if (selectedBranch !== 'both' && selectedBranch !== 'all') {
      setSelectedSubdealer('');
    }
  }, [selectedBranch]);

  // Reset branch selection when subdealer is selected
  useEffect(() => {
    if (selectedSubdealer) {
      setSelectedBranch('');
    }
  }, [selectedSubdealer]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubdealerDropdown && !event.target.closest('.subdealer-dropdown-container')) {
        setShowSubdealerDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSubdealerDropdown]);

  // Check if user has permission to view this page
  if (!canViewPeriodicReport) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Periodic Reports.
      </div>
    );
  }

  return (
    <div className="rto-report-container">
      <h4 className="rto-report-title">Periodic Reports</h4>

      <div className="rto-report-card">
        {/* Display API Error at the top - only shows the exact error message */}
        {apiError && (
          <CAlert color="danger" className="mb-3">
            {apiError}
          </CAlert>
        )}

        {/* Tabs for different report types - all visible since they use same permission */}
        <CCard>
          <CCardHeader>
            <CNav variant="tabs" className="card-header-tabs">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'sales'}
                  onClick={() => setActiveTab('sales')}
                  style={{ cursor: 'pointer' }}
                >
                  Sales Report
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'outstanding'}
                  onClick={() => setActiveTab('outstanding')}
                  style={{ cursor: 'pointer' }}
                >
                  Outstanding Report
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'booking'}
                  onClick={() => setActiveTab('booking')}
                  style={{ cursor: 'pointer' }}
                >
                  Booking Report
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'gc'}
                  onClick={() => setActiveTab('gc')}
                  style={{ cursor: 'pointer' }}
                >
                  GC Report
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>
          <CCardBody>
            <CTabContent>
              <CTabPane visible={activeTab === 'sales'}>
                <h5 className="mb-3">Sales Report</h5>
                <div className="date-filter-container mt-3">

                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  
                  <div className="date-filter-group">
                    <label className="date-filter-label">Select Branch:</label>
                    {branchLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <CFormSelect
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="date-picker"
                        disabled={branches.length === 0 || selectedSubdealer !== ''}
                      >
                        <option value="">Select Branch</option>
                        {hasAllBranchAccess && (
                          <option value="all">All Branch</option>
                        )}
                        {/* Option for Branch and Subdealer - ONLY IN SALES TAB */}
                        <option value="both">Branch and Subdealer</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  </div>

                  {/* Subdealer Filter - Only visible in Sales Report tab */}
                  <div className="date-filter-group subdealer-dropdown-container" style={{ position: 'relative' }}>
                    <label className="date-filter-label">Select Subdealer:</label>
                    {subdealerLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <CFormInput
                          type="text"
                          placeholder="Search and select subdealer..."
                          value={selectedSubdealer ? 
                            (selectedSubdealer === 'all' ? 'All Subdealers' : 
                              subdealers.find(s => s._id === selectedSubdealer)?.name || '') 
                            : subdealerSearchTerm}
                          onChange={(e) => {
                            if (selectedSubdealer) {
                              setSelectedSubdealer('');
                            }
                            setSubdealerSearchTerm(e.target.value);
                            setShowSubdealerDropdown(true);
                          }}
                          onFocus={() => setShowSubdealerDropdown(true)}
                          disabled={selectedBranch !== '' && selectedBranch !== 'both'}
                          className="date-picker"
                        />
                        {showSubdealerDropdown && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            zIndex: 1000,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <div
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: selectedSubdealer === 'all' ? '#f0f0f0' : 'white',
                                borderBottom: '1px solid #eee'
                              }}
                              onClick={() => {
                                setSelectedSubdealer('all');
                                setSubdealerSearchTerm('');
                                setShowSubdealerDropdown(false);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === 'all' ? '#f0f0f0' : 'white'}
                            >
                              <strong>All Subdealers</strong>
                            </div>
                            {filteredSubdealers.length > 0 ? (
                              filteredSubdealers.map((subdealer) => (
                                <div
                                  key={subdealer._id}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'
                                  }}
                                  onClick={() => {
                                    setSelectedSubdealer(subdealer._id);
                                    setSubdealerSearchTerm('');
                                    setShowSubdealerDropdown(false);
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedSubdealer === subdealer._id ? '#f0f0f0' : 'white'}
                                >
                                  {subdealer.name}
                                </div>
                              ))
                            ) : (
                              <div style={{ padding: '8px 12px', color: '#999' }}>
                                No subdealers found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">From Date:</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">To Date:</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      minDate={fromDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || (!selectedBranch && !selectedSubdealer) || !fromDate || !toDate}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>

              <CTabPane visible={activeTab === 'outstanding'}>
                <h5>Outstanding Report</h5>
                <div className="date-filter-container mt-3">
                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  <div className="date-filter-group">
                    <label className="date-filter-label">Select Branch:</label>
                    {branchLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <CFormSelect
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="date-picker"
                        disabled={branches.length === 0}
                      >
                        <option value="">Select Branch</option>
                        {hasAllBranchAccess && (
                          <option value="all">All Branch</option>
                        )}
                        {/* NO "Branch and Subdealer" option here */}
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedBranch}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>

              {/* Booking Report Tab */}
              <CTabPane visible={activeTab === 'booking'}>
                <h5>Booking Report</h5>
                <div className="date-filter-container mt-3">
                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  <div className="date-filter-group">
                    <label className="date-filter-label">Select Branch:</label>
                    {branchLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <CFormSelect
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="date-picker"
                        disabled={branches.length === 0}
                      >
                        <option value="">Select Branch</option>
                        {hasAllBranchAccess && (
                          <option value="all">All Branch</option>
                        )}
                        {/* NO "Branch and Subdealer" option here */}
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">From Date:</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">To Date:</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      minDate={fromDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>

              {/* GC Report Tab */}
              <CTabPane visible={activeTab === 'gc'}>
                <h5>GC Report</h5>
                <div className="date-filter-container mt-3">
                  <div className="date-filter-group">
                    <label className="date-filter-label">Model Type:</label>
                    <CFormSelect
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-picker"
                    >
                      <option value="">Select</option>
                      <option value="EV">EV</option>
                      <option value="ICE">ICE</option>
                    </CFormSelect>
                  </div>
                  <div className="date-filter-group">
                    <label className="date-filter-label">Select Branch:</label>
                    {branchLoading ? (
                      <div className="date-picker">
                        <CSpinner size="sm" />
                      </div>
                    ) : (
                      <CFormSelect
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="date-picker"
                        disabled={branches.length === 0}
                      >
                        <option value="">Select Branch</option>
                        {hasAllBranchAccess && (
                          <option value="all">All Branch</option>
                        )}
                        {/* NO "Branch and Subdealer" option here */}
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">From Date:</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsStart
                      startDate={fromDate}
                      endDate={toDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <div className="date-filter-group">
                    <label className="date-filter-label">To Date:</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="date-picker"
                      maxDate={new Date()}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      minDate={fromDate}
                      placeholderText="DD-MM-YYYY"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                    />
                  </div>

                  <button 
                    className="export-button" 
                    onClick={handleExportToExcel} 
                    disabled={exportLoading || !selectedBranch || !fromDate || !toDate}
                  >
                    {exportLoading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : 'Export to Excel'}
                  </button>
                </div>
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </div>
    </div>
  );
};

export default PeriodicReport;