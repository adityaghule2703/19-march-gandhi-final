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

// Columns that must NOT appear in the Finance Disbursement Excel file
const FD_REMOVE_COLUMNS = [
  'Approved By',
  'Approved Date',
  'Received By',
  'Created By',
  'Notes',
  'Refund',
  'Sub Payment Mode',
  'Sub Payment'
];

// New columns added to the Finance Disbursement Excel file.
// `sources` = header names (any spelling/case/spacing) to copy the value from,
// if the backend file already has that data.
const FD_NEW_COLUMNS = [
  {
    header: 'Financer Name',
    sources: ['Financer Name', 'Financer', 'Finance Name', 'Finance Company', 'Financer Company']
  },
  {
    header: 'Net Amount (Without GC)',
    sources: ['Net Amount Without GC', 'Net Amount (Without GC)', 'Net Amount Excl GC', 'Net Amount (Excl. GC)']
  },
  {
    header: 'Amount Deposited To Customer Ledger',
    sources: [
      'Amount Deposited To Customer Ledger',
      'Amount Added To Customer Ledger',
      'Customer Ledger Amount',
      'Deposited To Customer Ledger',
      'Customer Ledger'
    ]
  }
];

// Only this payment mode is allowed in the Finance Disbursement Excel file
const FD_PAYMENT_MODE = 'finance disbursement';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const ReceiptReport = () => {
  // ========== Voucher Report section state ==========
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // ========== Finance Disbursement section state (fully independent) ==========
  // Backed by GET /reports/finance-dis-export
  const [fdFromDate, setFdFromDate] = useState(null);
  const [fdToDate, setFdToDate] = useState(new Date());
  const [fdExportLoading, setFdExportLoading] = useState(false);

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

  // FIX: use LOCAL date parts. The old version used toISOString(), which converts
  // to UTC and shifts the date back one day in timezones ahead of UTC (e.g. IST):
  // 06-10-2026 00:00 IST -> "2026-10-05".
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ========== Voucher Report: fetch on date change ==========
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

  // ========== Finance Disbursement: export ==========
  // The backend (/reports/finance-dis-export) builds the .xlsx. After downloading it,
  // we clean it here:
  //   1. keep only rows where Payment Mode = Finance Disbursement
  //   2. remove: Approved By, Approved Date, Received By, Created By, Notes, Refund
  // No data is loaded or shown on the page when dates change.
  const exportFinanceDisbursementToExcel = async () => {
    if (!canExportReceiptReport) {
      toast.error('You do not have permission to export Finance Disbursement');
      return;
    }

    if (!fdFromDate || !fdToDate) {
      toast.error('Please select both from and to dates');
      return;
    }

    if (fdFromDate > fdToDate) {
      toast.error('From date cannot be after To date');
      return;
    }

    try {
      setFdExportLoading(true);

      const response = await axiosInstance.get('/reports/finance-dis-export', {
        params: {
          startDate: formatDateForAPI(fdFromDate),
          endDate: formatDateForAPI(fdToDate)
        },
        responseType: 'blob'
      });

      // Read the downloaded file
      const buffer = await response.data.arrayBuffer();
      const sourceWorkbook = XLSX.read(buffer, { type: 'array' });
      const sourceSheet = sourceWorkbook.Sheets[sourceWorkbook.SheetNames[0]];

      // Rows as objects keyed by header; defval keeps empty cells so columns stay aligned
      const rows = XLSX.utils.sheet_to_json(sourceSheet, { defval: '' });

      if (rows.length === 0) {
        toast.info('No Finance Disbursement records found for the selected date range');
        return;
      }

      // Match header names ignoring case and extra spaces
      const compact = (value) => normalize(value).replace(/\s+/g, '');
      const removeSet = new Set(FD_REMOVE_COLUMNS.map(compact));
      const allHeaders = Object.keys(rows[0]);
      const paymentModeHeader = allHeaders.find((h) => compact(h) === 'paymentmode');
      const keepHeaders = allHeaders.filter((h) => !removeSet.has(compact(h)));

      // Keep only Finance Disbursement rows (if the Payment Mode column exists)
      const filteredRows = paymentModeHeader
        ? rows.filter((row) => normalize(row[paymentModeHeader]) === FD_PAYMENT_MODE)
        : rows;

      if (filteredRows.length === 0) {
        toast.info('No Finance Disbursement records found for the selected date range');
        return;
      }

      // Drop the unwanted columns and add the 3 new ones
      const newColumnSources = FD_NEW_COLUMNS.map((col) => ({
        header: col.header,
        sourceHeader: allHeaders.find((h) =>
          col.sources.some((src) => compact(src) === compact(h))
        )
      }));

      // Don't duplicate a column the backend already sends under the same name
      const extraHeaders = newColumnSources
        .filter((c) => !keepHeaders.some((h) => compact(h) === compact(c.header)))
        .map((c) => c.header);
      const finalHeaders = [...keepHeaders, ...extraHeaders];

      const cleanedRows = filteredRows.map((row) => {
        const cleaned = {};
        keepHeaders.forEach((header) => {
          cleaned[header] = row[header];
        });
        newColumnSources.forEach(({ header, sourceHeader }) => {
          if (extraHeaders.includes(header)) {
            cleaned[header] = sourceHeader ? row[sourceHeader] : '';
          }
        });
        return cleaned;
      });

      // Build the new Excel file
      const newSheet = XLSX.utils.json_to_sheet(cleanedRows, { header: finalHeaders });
      newSheet['!cols'] = finalHeaders.map((header) => ({
        wch: Math.max(
          String(header).length + 2,
          ...cleanedRows.map((r) => String(r[header] ?? '').length + 2),
          12
        )
      }));

      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Finance Disbursement');

      const filename = `Finance_Disbursement_${formatDate(fdFromDate)}_to_${formatDate(fdToDate)}.xlsx`;
      XLSX.writeFile(newWorkbook, filename);

      toast.success('Export completed successfully');
    } catch (error) {
      // 404 = no Finance Disbursement receipts in this date range.
      // With responseType 'blob' the JSON error body arrives as a Blob, so read it
      // to show the real backend message.
      if (error.response?.status === 404) {
        let message = 'No Finance Disbursement records found for the selected date range';
        try {
          if (error.response.data instanceof Blob) {
            const text = await error.response.data.text();
            const parsed = JSON.parse(text);
            if (parsed?.message) message = parsed.message;
          }
        } catch (parseError) {
          // keep the default message
        }
        toast.info(message);
      } else {
        console.error('Error exporting Finance Disbursement:', error);
        toast.error('Failed to export Finance Disbursement');
      }
    } finally {
      setFdExportLoading(false);
    }
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

      {/* ========== SEPARATE SECTION: Finance Disbursement ========== */}
      {/* Own From/To dates, backed by GET /reports/finance-dis-export   */}
      <h4 className="rto-report-title mt-4">Finance Disbursement</h4>

      <div className="rto-report-card">
        <div className="date-filter-container">
          <div className="date-filter-group">
            <label className="date-filter-label">From Date:</label>
            <DatePicker
              selected={fdFromDate}
              onChange={(date) => setFdFromDate(date)}
              className="date-picker"
              maxDate={new Date()}
              selectsStart
              startDate={fdFromDate}
              endDate={fdToDate}
              placeholderText="DD-MM-YYYY"
              dateFormat="dd-MM-yyyy"
              autoComplete="off"
            />
          </div>

          <div className="date-filter-group">
            <label className="date-filter-label">To Date:</label>
            <DatePicker
              selected={fdToDate}
              onChange={(date) => setFdToDate(date)}
              className="date-picker"
              maxDate={new Date()}
              selectsEnd
              startDate={fdFromDate}
              endDate={fdToDate}
              minDate={fdFromDate}
              placeholderText="DD-MM-YYYY"
              dateFormat="dd-MM-yyyy"
              autoComplete="off"
            />
          </div>

          {canExportReceiptReport ? (
            <button
              className="export-button"
              onClick={exportFinanceDisbursementToExcel}
              disabled={fdExportLoading || !fdFromDate || !fdToDate}
            >
              {fdExportLoading ? 'Exporting...' : 'Export to Excel'}
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