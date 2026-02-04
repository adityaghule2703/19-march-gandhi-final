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
//   canViewPage,
//   canCreateInPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const ReceiptReport = () => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(new Date());
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [summaryData, setSummaryData] = useState(null);

//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Receipt Report page under Account module
//   const canViewReceiptReport = canViewPage(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.REPORT
//   );
  
//   const canExportReceiptReport = canCreateInPage(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.REPORT
//   );

//   useEffect(() => {
//     if (!canViewReceiptReport) {
//       toast.error('You do not have permission to view Receipt Report');
//       return;
//     }
    
//     if (fromDate && toDate) {
//       fetchVoucherReport();
//     }
//   }, [fromDate, toDate]);

//   const fetchVoucherReport = async () => {
//     if (!canViewReceiptReport) {
//       toast.error('You do not have permission to view Receipt Report');
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

//       const formatDate = (date) => {
//         return date.toISOString().split('T')[0];
//       };

//       const formattedFromDate = formatDate(fromDate);
//       const formattedToDate = formatDate(toDate);

//       const response = await axiosInstance.get(`/vouchers/date-range?fromDate=${formattedFromDate}&toDate=${formattedToDate}`);
//       const data = response.data;

//       if (data.success) {
//         setReportData(data.transactions);
//         setSummaryData({
//           openingBalance: data.openingBalance,
//           totalDebit: data.totals.totalDebit,
//           totalCredit: data.totals.totalCredit,
//           closingBalance: data.totals.closingBalance,
//           count: data.count
//         });
//         toast.success(`Found ${data.count} records`);
//       } else {
//         toast.error('Failed to fetch voucher report data');
//       }
//     } catch (error) {
//       console.error('Error fetching voucher report:', error);
//       toast.error('Error fetching voucher report data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (!canExportReceiptReport) {
//       toast.error('You do not have permission to export Receipt Report');
//       return;
//     }

//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const excelData = reportData.map((item) => ({
//       Date: item.date,
//       'Receipt No': item.receiptNo,
//       'Account Head': item.accountHead,
//       'Voucher Type': item.voucherType,
//       'Payment Mode': item.paymentMode,
//       'Bank Location': item.bankLocation,
//       'Cash Location': item.cashLocation,
//       Debit: item.debit,
//       Credit: item.credit
//     }));

//     if (summaryData) {
//       excelData.push({});
//       excelData.push({
//         Date: '',
//         'Receipt No': '',
//         'Account Head': '',
//         'Voucher Type': '',
//         'Payment Mode': '',
//         'Bank Location': '',
//         'Cash Location': '',
//         Debit: summaryData.totalDebit,
//         Credit: summaryData.totalCredit
//       });
//     }

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Voucher Report');

//     const colWidths = [
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 25 },
//       { wch: 20 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 20 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 20 }
//     ];
//     worksheet['!cols'] = colWidths;

//     const fromDateStr = fromDate ? fromDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const toDateStr = toDate ? toDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const fileName = `Voucher_Report_${fromDateStr}_to_${toDateStr}.xlsx`;

//     XLSX.writeFile(workbook, fileName);
//   };

//   // Check if user has permission to view the page
//   if (!canViewReceiptReport) {
//     return (
//       <div className="rto-report-container">
//         <div className="alert alert-danger m-3" role="alert">
//           You do not have permission to view Receipt Report.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rto-report-container">
//       <h4 className="rto-report-title">Voucher Report</h4>

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
//             disabled={loading || reportData.length === 0 || !canExportReceiptReport}
//           >
//             {loading ? 'Loading...' : 'Export to Excel'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReceiptReport;







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

// const ReceiptReport = () => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(new Date());
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [summaryData, setSummaryData] = useState(null);

//   const { permissions } = useAuth();
  
//   // Page-level permission checks for Receipt Report page under Account module
//   const canViewReceiptReport = canViewPage(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.REPORT
//   );
  
//   // For exporting, we need CREATE permission
//   const canExportReceiptReport = hasSafePagePermission(
//     permissions, 
//     MODULES.ACCOUNT, 
//     PAGES.ACCOUNT.REPORT,
//     ACTIONS.CREATE
//   );

//   useEffect(() => {
//     if (!canViewReceiptReport) {
//       toast.error('You do not have permission to view Receipt Report');
//       return;
//     }
    
//     if (fromDate && toDate) {
//       fetchVoucherReport();
//     }
//   }, [fromDate, toDate]);

//   const fetchVoucherReport = async () => {
//     if (!canViewReceiptReport) {
//       toast.error('You do not have permission to view Receipt Report');
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

//       const formatDate = (date) => {
//         return date.toISOString().split('T')[0];
//       };

//       const formattedFromDate = formatDate(fromDate);
//       const formattedToDate = formatDate(toDate);

//       const response = await axiosInstance.get(`/vouchers/date-range?fromDate=${formattedFromDate}&toDate=${formattedToDate}`);
//       const data = response.data;

//       if (data.success) {
//         setReportData(data.transactions);
//         setSummaryData({
//           openingBalance: data.openingBalance,
//           totalDebit: data.totals.totalDebit,
//           totalCredit: data.totals.totalCredit,
//           closingBalance: data.totals.closingBalance,
//           count: data.count
//         });
//         toast.success(`Found ${data.count} records`);
//       } else {
//         toast.error('Failed to fetch voucher report data');
//       }
//     } catch (error) {
//       console.error('Error fetching voucher report:', error);
//       toast.error('Error fetching voucher report data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     if (!canExportReceiptReport) {
//       toast.error('You do not have permission to export Receipt Report');
//       return;
//     }

//     if (reportData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }

//     const excelData = reportData.map((item) => ({
//       Date: item.date,
//       'Receipt No': item.receiptNo,
//       'Account Head': item.accountHead,
//       'Voucher Type': item.voucherType,
//       'Payment Mode': item.paymentMode,
//       'Bank Location': item.bankLocation,
//       'Cash Location': item.cashLocation,
//       Debit: item.debit,
//       Credit: item.credit
//     }));

//     if (summaryData) {
//       excelData.push({});
//       excelData.push({
//         Date: '',
//         'Receipt No': '',
//         'Account Head': '',
//         'Voucher Type': '',
//         'Payment Mode': '',
//         'Bank Location': '',
//         'Cash Location': '',
//         Debit: summaryData.totalDebit,
//         Credit: summaryData.totalCredit
//       });
//     }

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Voucher Report');

//     const colWidths = [
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 25 },
//       { wch: 20 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 20 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 20 }
//     ];
//     worksheet['!cols'] = colWidths;

//     const fromDateStr = fromDate ? fromDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const toDateStr = toDate ? toDate.toLocaleDateString().replace(/\//g, '-') : '';
//     const fileName = `Voucher_Report_${fromDateStr}_to_${toDateStr}.xlsx`;

//     XLSX.writeFile(workbook, fileName);
//   };

//   // Check if user has permission to view the page
//   if (!canViewReceiptReport) {
//     return (
//       <div className="rto-report-container">
//         <div className="alert alert-danger m-3" role="alert">
//           You do not have permission to view Receipt Report.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rto-report-container">
//       <h4 className="rto-report-title">Voucher Report</h4>

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

//           {canExportReceiptReport ? (
//             <button 
//               className="export-button" 
//               onClick={exportToExcel} 
//               disabled={loading || reportData.length === 0}
//             >
//               {loading ? 'Loading...' : 'Export to Excel'}
//             </button>
//           ) : (
//             <button 
//               className="export-button" 
//               disabled={true}
//               title="You don't have permission to export"
//             >
//               Export to Excel (No Permission)
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReceiptReport;








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

const ReceiptReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  const { permissions } = useAuth();
  
  // Page-level permission checks for Receipt Report page under Account module
  const canViewReceiptReport = canViewPage(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.REPORT
  );
  
  // For exporting, we need CREATE permission
  const canExportReceiptReport = hasSafePagePermission(
    permissions, 
    MODULES.ACCOUNT, 
    PAGES.ACCOUNT.REPORT,
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

  useEffect(() => {
    if (!canViewReceiptReport) {
      toast.error('You do not have permission to view Receipt Report');
      return;
    }
    
    if (fromDate && toDate) {
      fetchVoucherReport();
    }
  }, [fromDate, toDate]);

  const fetchVoucherReport = async () => {
    if (!canViewReceiptReport) {
      toast.error('You do not have permission to view Receipt Report');
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

      const formatDateForAPI = (date) => {
        return date.toISOString().split('T')[0];
      };

      const formattedFromDate = formatDateForAPI(fromDate);
      const formattedToDate = formatDateForAPI(toDate);

      const response = await axiosInstance.get(`/vouchers/date-range?fromDate=${formattedFromDate}&toDate=${formattedToDate}`);
      const data = response.data;

      if (data.success) {
        setReportData(data.transactions);
        setSummaryData({
          openingBalance: data.openingBalance,
          totalDebit: data.totals.totalDebit,
          totalCredit: data.totals.totalCredit,
          closingBalance: data.totals.closingBalance,
          count: data.count
        });
        toast.success(`Found ${data.count} records`);
      } else {
        toast.error('Failed to fetch voucher report data');
      }
    } catch (error) {
      console.error('Error fetching voucher report:', error);
      toast.error('Error fetching voucher report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!canExportReceiptReport) {
      toast.error('You do not have permission to export Receipt Report');
      return;
    }

    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const excelData = reportData.map((item) => ({
      Date: formatDate(item.date),
      'Receipt No': item.receiptNo,
      'Account Head': item.accountHead,
      'Voucher Type': item.voucherType,
      'Payment Mode': item.paymentMode,
      'Bank Location': item.bankLocation,
      'Cash Location': item.cashLocation,
      Debit: item.debit,
      Credit: item.credit
    }));

    if (summaryData) {
      excelData.push({});
      excelData.push({
        Date: '',
        'Receipt No': '',
        'Account Head': '',
        'Voucher Type': '',
        'Payment Mode': '',
        'Bank Location': '',
        'Cash Location': '',
        Debit: summaryData.totalDebit,
        Credit: summaryData.totalCredit
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Voucher Report');

    const colWidths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 }
    ];
    worksheet['!cols'] = colWidths;

    const fromDateStr = fromDate ? formatDate(fromDate) : '';
    const toDateStr = toDate ? formatDate(toDate) : '';
    const fileName = `Voucher_Report_${fromDateStr}_to_${toDateStr}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // Check if user has permission to view the page
  if (!canViewReceiptReport) {
    return (
      <div className="rto-report-container">
        <div className="alert alert-danger m-3" role="alert">
          You do not have permission to view Receipt Report.
        </div>
      </div>
    );
  }

  return (
    <div className="rto-report-container">
      <h4 className="rto-report-title">Voucher Report</h4>

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

          {canExportReceiptReport ? (
            <button 
              className="export-button" 
              onClick={exportToExcel} 
              disabled={loading || reportData.length === 0}
            >
              {loading ? 'Loading...' : 'Export to Excel'}
            </button>
          ) : (
            <button 
              className="export-button" 
              disabled={true}
              title="You don't have permission to export"
            >
              Export to Excel (No Permission)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptReport;