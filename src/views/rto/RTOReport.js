// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import * as XLSX from 'xlsx';
// import '../../css/report.css';
// import { toast } from 'react-toastify';
// import axiosInstance from '../../axiosInstance';

// // Import the new permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const RTOReport = () => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(new Date());
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Report page under RTO module
//   const canViewRTOReport = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.REPORT
//   );
  
//   const canExportRTOReport = canCreateInPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.REPORT
//   );

//   const fetchRTOReport = async () => {
//     if (!canViewRTOReport) {
//       toast.error('You do not have permission to view RTO Report');
//       return;
//     }

//     if (!fromDate || !toDate) {
//       toast.error('Please select both from and to dates');
//       return;
//     }

//     if (fromDate > toDate) {
//       toast.error('From date cannot be after To date');
//       return;
//     }

//     try {
//       setLoading(true);
//       const formattedFromDate = fromDate.toISOString();
//       const formattedToDate = toDate.toISOString();
//       const response = await axiosInstance(`/rtoProcess/records?startDate=${formattedFromDate}&endDate=${formattedToDate}`);
//       const data = await response.json();

//       if (data.success) {
//         setReportData(data.data);
//         toast.success(`Found ${data.count} records`);
//       } else {
//         toast.error('Failed to fetch RTO report data');
//       }
//     } catch (error) {
//       console.error('Error fetching RTO report:', error);
//       toast.error('Error fetching RTO report data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (!canExportRTOReport) {
//       toast.error('You do not have permission to export RTO Report');
//       return;
//     }

//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const excelData = reportData.map((item) => ({
//       'Booking Number': item.bookingId.bookingNumber,
//       'Customer Name': item.bookingId.customerDetails.name,
//       Mobile: item.bookingId.customerDetails.mobile1,
//       'Model Name': item.bookingId.model.model_name,
//       'Chassis Number': item.bookingId.chassisNumber,
//       'Application Number': item.applicationNumber,
//       'RTO Status': item.rtoStatus,
//       'Paper Status': item.rtoPaperStatus,
//       Amount: item.rtoAmount,
//       'Number Plate': item.numberPlate,
//       'Receipt Number': item.receiptNumber,
//       'HSRP Ordered': item.hsrbOrdering ? 'Yes' : 'No',
//       'HSRP Installed': item.hsrbInstallation ? 'Yes' : 'No',
//       'RC Confirmed': item.rcConfirmation ? 'Yes' : 'No',
//       'RTO Date': new Date(item.rtoDate).toLocaleDateString(),
//       'Created At': new Date(item.createdAt).toLocaleDateString()
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'RTO Report');

//     const fromDateStr = fromDate ? fromDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const toDateStr = toDate ? toDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const fileName = `RTO_Report_${fromDateStr}_to_${toDateStr}.xlsx`;

//     XLSX.writeFile(workbook, fileName);
//   };

//   useEffect(() => {
//     if (!canViewRTOReport) {
//       return;
//     }
    
//     if (fromDate && toDate) {
//       fetchRTOReport();
//     }
//   }, [fromDate, toDate]);

//   // Check if user has permission to view the page
//   if (!canViewRTOReport) {
//     return (
//       <div className="rto-report-container">
//         <div className="alert alert-danger m-3" role="alert">
//           You do not have permission to view RTO Report.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rto-report-container">
//       <h4 className="rto-report-title">Main RTO Report</h4>

//       <div className="rto-report-card">
//         <div className="date-filter-container">
//           <div className="date-filter-group">
//             <label className="date-filter-label">From Date:</label>
//             <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               className="date-picker"
//               maxDate={new Date()}
//               selectsStart
//               startDate={fromDate}
//               endDate={toDate}
//               placeholderText="Select start date"
//             />
//           </div>

//           <div className="date-filter-group">
//             <label className="date-filter-label">To Date:</label>
//             <DatePicker
//               selected={toDate}
//               onChange={(date) => setToDate(date)}
//               className="date-picker"
//               maxDate={new Date()}
//               selectsEnd
//               startDate={fromDate}
//               endDate={toDate}
//               minDate={fromDate}
//               placeholderText="Select end date"
//             />
//           </div>

//           <button 
//             className="export-button" 
//             onClick={exportToExcel} 
//             disabled={loading || reportData.length === 0 || !canExportRTOReport}
//           >
//             {loading ? 'Loading...' : 'Export'}
//           </button>
//         </div>
//         {reportData.length > 0 && (
//           <div className="report-summary">
//             <p>Total Records: {reportData.length}</p>
//             <p>
//               Date Range: {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RTOReport;







// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import * as XLSX from 'xlsx';
// import '../../css/report.css';
// import { toast } from 'react-toastify';
// import axiosInstance from '../../axiosInstance';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const RTOReport = () => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(new Date());
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Report page under RTO module
//   const canViewRTOReport = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.REPORT
//   );
  
//   // For exporting, we need CREATE permission
//   const canExportRTOReport = hasSafePagePermission(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.REPORT,
//     ACTIONS.CREATE
//   );

//   const fetchRTOReport = async () => {
//     if (!canViewRTOReport) {
//       toast.error('You do not have permission to view RTO Report');
//       return;
//     }

//     if (!fromDate || !toDate) {
//       toast.error('Please select both from and to dates');
//       return;
//     }

//     if (fromDate > toDate) {
//       toast.error('From date cannot be after To date');
//       return;
//     }

//     try {
//       setLoading(true);
//       const formattedFromDate = fromDate.toISOString();
//       const formattedToDate = toDate.toISOString();
//       const response = await axiosInstance(`/rtoProcess/records?startDate=${formattedFromDate}&endDate=${formattedToDate}`);
//       const data = await response.json();

//       if (data.success) {
//         setReportData(data.data);
//         toast.success(`Found ${data.count} records`);
//       } else {
//         toast.error('Failed to fetch RTO report data');
//       }
//     } catch (error) {
//       console.error('Error fetching RTO report:', error);
//       toast.error('Error fetching RTO report data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (!canExportRTOReport) {
//       toast.error('You do not have permission to export RTO Report');
//       return;
//     }

//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const excelData = reportData.map((item) => ({
//       'Booking Number': item.bookingId.bookingNumber,
//       'Customer Name': item.bookingId.customerDetails.name,
//       Mobile: item.bookingId.customerDetails.mobile1,
//       'Model Name': item.bookingId.model.model_name,
//       'Chassis Number': item.bookingId.chassisNumber,
//       'Application Number': item.applicationNumber,
//       'RTO Status': item.rtoStatus,
//       'Paper Status': item.rtoPaperStatus,
//       Amount: item.rtoAmount,
//       'Number Plate': item.numberPlate,
//       'Receipt Number': item.receiptNumber,
//       'HSRP Ordered': item.hsrbOrdering ? 'Yes' : 'No',
//       'HSRP Installed': item.hsrbInstallation ? 'Yes' : 'No',
//       'RC Confirmed': item.rcConfirmation ? 'Yes' : 'No',
//       'RTO Date': new Date(item.rtoDate).toLocaleDateString(),
//       'Created At': new Date(item.createdAt).toLocaleDateString()
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'RTO Report');

//     const fromDateStr = fromDate ? fromDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const toDateStr = toDate ? toDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const fileName = `RTO_Report_${fromDateStr}_to_${toDateStr}.xlsx`;

//     XLSX.writeFile(workbook, fileName);
//   };

//   useEffect(() => {
//     if (!canViewRTOReport) {
//       return;
//     }
    
//     if (fromDate && toDate) {
//       fetchRTOReport();
//     }
//   }, [fromDate, toDate]);

//   // Check if user has permission to view the page
//   if (!canViewRTOReport) {
//     return (
//       <div className="rto-report-container">
//         <div className="alert alert-danger m-3" role="alert">
//           You do not have permission to view RTO Report.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rto-report-container">
//       <h4 className="rto-report-title">Main RTO Report</h4>

//       <div className="rto-report-card">
//         <div className="date-filter-container">
//           <div className="date-filter-group">
//             <label className="date-filter-label">From Date:</label>
//             <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               className="date-picker"
//               maxDate={new Date()}
//               selectsStart
//               startDate={fromDate}
//               endDate={toDate}
//               placeholderText="Select start date"
//             />
//           </div>

//           <div className="date-filter-group">
//             <label className="date-filter-label">To Date:</label>
//             <DatePicker
//               selected={toDate}
//               onChange={(date) => setToDate(date)}
//               className="date-picker"
//               maxDate={new Date()}
//               selectsEnd
//               startDate={fromDate}
//               endDate={toDate}
//               minDate={fromDate}
//               placeholderText="Select end date"
//             />
//           </div>

//           {canExportRTOReport ? (
//             <button 
//               className="export-button" 
//               onClick={exportToExcel} 
//               disabled={loading || reportData.length === 0}
//             >
//               {loading ? 'Loading...' : 'Export'}
//             </button>
//           ) : (
//             <button 
//               className="export-button" 
//               disabled={true}
//               title="You don't have permission to export"
//             >
//               Export (No Permission)
//             </button>
//           )}
//         </div>
//         {reportData.length > 0 && (
//           <div className="report-summary">
//             <p>Total Records: {reportData.length}</p>
//             <p>
//               Date Range: {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RTOReport;









import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import '../../css/report.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../axiosInstance';

// Import the permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

const RTOReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { permissions } = useAuth();
  
  // Page-level permission checks for Report page under RTO module
  const canViewRTOReport = canViewPage(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.REPORT
  );
  
  // For exporting, we need CREATE permission
  const canExportRTOReport = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.REPORT,
    ACTIONS.CREATE
  );

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const fetchRTOReport = async () => {
    if (!canViewRTOReport) {
      toast.error('You do not have permission to view RTO Report');
      return;
    }

    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates');
      return;
    }

    if (fromDate > toDate) {
      toast.error('From date cannot be after To date');
      return;
    }

    try {
      setLoading(true);
      const formattedFromDate = fromDate.toISOString();
      const formattedToDate = toDate.toISOString();
      
      // Note: axiosInstance is already a function that returns a promise
      const response = await axiosInstance(`/rtoProcess/records?startDate=${formattedFromDate}&endDate=${formattedToDate}`);
      
      // Since you're using response.data (not response.json()), I'll assume it's already parsed
      const data = response.data;

      if (data.success) {
        setReportData(data.data);
        toast.success(`Found ${data.count} records`);
      } else {
        toast.error('Failed to fetch RTO report data');
      }
    } catch (error) {
      console.error('Error fetching RTO report:', error);
      toast.error('Error fetching RTO report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!canExportRTOReport) {
      toast.error('You do not have permission to export RTO Report');
      return;
    }

    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const excelData = reportData.map((item) => ({
      'Booking Number': item.bookingId?.bookingNumber || '',
      'Customer Name': item.bookingId?.customerDetails?.name || '',
      Mobile: item.bookingId?.customerDetails?.mobile1 || '',
      'Model Name': item.bookingId?.model?.model_name || '',
      'Chassis Number': item.bookingId?.chassisNumber || '',
      'Application Number': item.applicationNumber || '',
      'RTO Status': item.rtoStatus || '',
      'Paper Status': item.rtoPaperStatus || '',
      Amount: item.rtoAmount || 0,
      'Number Plate': item.numberPlate || '',
      'Receipt Number': item.receiptNumber || '',
      'HSRP Ordered': item.hsrbOrdering ? 'Yes' : 'No',
      'HSRP Installed': item.hsrbInstallation ? 'Yes' : 'No',
      'RC Confirmed': item.rcConfirmation ? 'Yes' : 'No',
      'RTO Date': formatDate(item.rtoDate),
      'Created At': formatDate(item.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RTO Report');

    const fromDateStr = fromDate ? formatDate(fromDate) : '';
    const toDateStr = toDate ? formatDate(toDate) : '';
    const fileName = `RTO_Report_${fromDateStr}_to_${toDateStr}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    if (!canViewRTOReport) {
      return;
    }
    
    if (fromDate && toDate) {
      fetchRTOReport();
    }
  }, [fromDate, toDate]);

  // Check if user has permission to view the page
  if (!canViewRTOReport) {
    return (
      <div className="rto-report-container">
        <div className="alert alert-danger m-3" role="alert">
          You do not have permission to view RTO Report.
        </div>
      </div>
    );
  }

  return (
    <div className="rto-report-container">
      <h4 className="rto-report-title">Main RTO Report</h4>

      <div className="rto-report-card">
        <div className="date-filter-container">
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

          {canExportRTOReport ? (
            <button 
              className="export-button" 
              onClick={exportToExcel} 
              disabled={loading || reportData.length === 0}
            >
              {loading ? 'Loading...' : 'Export'}
            </button>
          ) : (
            <button 
              className="export-button" 
              disabled={true}
              title="You don't have permission to export"
            >
              Export (No Permission)
            </button>
          )}
        </div>
        {reportData.length > 0 && (
          <div className="report-summary">
            <p>Total Records: {reportData.length}</p>
            <p>
              Date Range: {fromDate ? formatDate(fromDate) : ''} to {toDate ? formatDate(toDate) : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RTOReport;