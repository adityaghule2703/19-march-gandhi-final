// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../axiosInstance';

// const MOCK_RESPONSE = {
//   "success": true,
//   "summaryCards": {
//     "totalReceipts": 2635,
//     "approvedCount": 2635,
//     "pendingCount": 0,
//     "rejectedCount": 0,
//     "totalAmount": 107884726.06000002,
//     "approvedAmount": 107884726.06000002,
//     "pendingAmount": 0,
//     "rejectedAmount": 0,
//     "totalNetAmount": 107238076.06000002,
//     "totalGCAmount": 646650,
//     "paymentCount": 2246,
//     "paymentAmount": 95211677.01,
//     "refundCount": 30,
//     "refundAmount": 39295,
//     "adjustmentCount": 0,
//     "adjustmentAmount": 0,
//     "approvalRate": 100
//   },
//   "paymentModeSplit": [
//     { "paymentMode": "Finance Disbursement", "count": 486, "amount": 44045548, "approvedCount": 486, "approvedAmount": 44045548 },
//     { "paymentMode": "Bank", "count": 1313, "amount": 39187890.02, "approvedCount": 1313, "approvedAmount": 39187890.02 },
//     { "paymentMode": "Cash", "count": 731, "amount": 21980535.01, "approvedCount": 731, "approvedAmount": 21980535.01 },
//     { "paymentMode": "Pay Order", "count": 104, "amount": 2670553.03, "approvedCount": 104, "approvedAmount": 2670553.03 },
//     { "paymentMode": "Exchange", "count": 1, "amount": 200, "approvedCount": 1, "approvedAmount": 200 }
//   ],
//   "receiptTypeSplit": [
//     { "receiptType": "PAYMENT", "count": 2605, "amount": 107845431.06000002, "approvedCount": 2605, "approvedAmount": 107845431.06000002 },
//     { "receiptType": "REFUND", "count": 30, "amount": 39295, "approvedCount": 30, "approvedAmount": 39295 }
//   ],
//   "groupedData": { "groupBy": "branch", "data": [ { "branchId": "695a32b2e3a6522ef7138420", "branchName": "GANDHI TVS NASHIK", "totalCount": 2635, "totalAmount": 107884726.06000002, "approvedCount": 2635, "approvedAmount": 107884726.06000002, "approvalRate": 100 } ] },
//   "monthlyTrend": [
//     { "month": "2026-02", "label": "Feb 2026", "totalCount": 605, "totalAmount": 23084463.06, "approvedCount": 605, "approvedAmount": 23084463.06, "cumulativeAmount": 23084463.06, "approvalRate": 100 },
//     { "month": "2026-03", "label": "Mar 2026", "totalCount": 944, "totalAmount": 39607174, "approvedCount": 944, "approvedAmount": 39607174, "cumulativeAmount": 62691637.06, "approvalRate": 100 },
//     { "month": "2026-04", "label": "Apr 2026", "totalCount": 757, "totalAmount": 30529346, "approvedCount": 757, "approvedAmount": 30529346, "cumulativeAmount": 93220983.06, "approvalRate": 100 },
//     { "month": "2026-05", "label": "May 2026", "totalCount": 329, "totalAmount": 14663743, "approvedCount": 329, "approvedAmount": 14663743, "cumulativeAmount": 107884726.06, "approvalRate": 100 }
//   ],
//   "payoutAccrual": { "totalAccrued": 1317292.79, "totalPaid": 0, "totalUnpaid": 1317292.79, "collectionVsUnpaid": { "totalCollection": 107884726.06, "unpaidPayout": 1317292.79, "coverage": 1.22 }, "bySubdealer": [] },
//   "detailTable": {
//     "data": [
//       { "_id": "6a09a47fe90a982f50b76e3b", "receiptNumber": "RCPT-1779016831152-230", "formattedDate": "17/05/2026", "amount": 65000, "netAmount": 65000, "gcAmount": 0, "paymentMode": "Bank", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002264", "customerName": "Mr. PARAMANAND RAMDAS BAIRAGI", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "T2605171546237845521188" },
//       { "_id": "6a09a1afe90a982f50b71347", "receiptNumber": "RCPT-1779016111142-9", "formattedDate": "17/05/2026", "amount": 20000, "netAmount": 20000, "gcAmount": 0, "paymentMode": "Bank", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002265", "customerName": "Mrs. JYOTI  SANDIP  PAGARE", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "T2605171636354241450077" },
//       { "_id": "6a09907ee90a982f50b554fd", "receiptNumber": "RCPT-1779011710532-37", "formattedDate": "17/05/2026", "amount": 1000, "netAmount": 1000, "gcAmount": 0, "paymentMode": "Bank", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002263", "customerName": "Mr. RUSHIKESH RAVINDRA GAIKWAD", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "T2605171524105639977558" },
//       { "_id": "6a098cf2e90a982f50b4b39d", "receiptNumber": "RCPT-1779010802917-824", "formattedDate": "17/05/2026", "amount": 14000, "netAmount": 14000, "gcAmount": 0, "paymentMode": "Cash", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002261", "customerName": "Mr. ADIL  YUSUF BAGWAN", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "" },
//       { "_id": "6a098852e90a982f50b31e14", "receiptNumber": "RCPT-1779009618525-623", "formattedDate": "17/05/2026", "amount": 72000, "netAmount": 72000, "gcAmount": 0, "paymentMode": "Cash", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002253", "customerName": "Mrs. PUSHPA VISHNU WAJE", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "" },
//       { "_id": "6a0986a0e90a982f50b2a141", "receiptNumber": "RCPT-1779009184721-308", "formattedDate": "17/05/2026", "amount": 111000, "netAmount": 111000, "gcAmount": 0, "paymentMode": "Cash", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002239", "customerName": "Mrs. SRUSHTI MARUTI GITE", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "" },
//       { "_id": "6a097f5ee90a982f50b0730f", "receiptNumber": "RCPT-1779007326209-861", "formattedDate": "17/05/2026", "amount": 70900, "netAmount": 70900, "gcAmount": 0, "paymentMode": "Cash", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002081", "customerName": "Mrs. SHWETA ASHIWIN TAJANPURE", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "" },
//       { "_id": "6a0969bfe90a982f50adf2e9", "receiptNumber": "RCPT-1779001791448-391", "formattedDate": "17/05/2026", "amount": 1000, "netAmount": 1000, "gcAmount": 0, "paymentMode": "Bank", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002259", "customerName": "Mr. PUNIT DURGADAS BHOJWANI", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "T2605171238243855703609" },
//       { "_id": "6a096348e90a982f50ac7cbb", "receiptNumber": "RCPT-1779000136682-937", "formattedDate": "17/05/2026", "amount": 1000, "netAmount": 1000, "gcAmount": 0, "paymentMode": "Cash", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002257", "customerName": "Mrs. RUPALI RAJENDRA KULE", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "" },
//       { "_id": "6a0878fae90a982f50a351cc", "receiptNumber": "RCPT-1778940154305-746", "formattedDate": "16/05/2026", "amount": 1000, "netAmount": 1000, "gcAmount": 0, "paymentMode": "Bank", "receiptType": "PAYMENT", "approvalStatus": "Approved", "bookingNumber": "BK002255", "customerName": "Mr. SONU RAHUL NAGODE", "branchName": "GANDHI TVS NASHIK", "createdBy": "SAMARTH KULKARNI", "transactionReference": "T2605161806441385464314" }
//     ],
//     "pagination": { "total": 2635, "page": 1, "limit": 10, "totalPages": 264 }
//   },
//   "availableBranches": [
//     { "_id": "all", "name": "All Branches", "address": "", "city": "" },
//     { "_id": "695a3464e3a6522ef713be79", "name": "GANDHI TVS CIDCO", "address": "17,307/ASAHYADRI COMPLEX,NEXT TO HDFC BANK,OPP SYMBOSIS COLLEGE,CIDCO-PATHARDI PHATA ROAD,UPENDRA NAGAR,NASHIK", "city": "NASHIK" },
//     { "_id": "695a32b2e3a6522ef7138420", "name": "GANDHI TVS NASHIK", "address": "'JOGPREET',ASHER ESTATE, NEAR UPNAGAR SIGNAL,NASHIK ROAD,NASHIK", "city": "NASHIK" },
//     { "_id": "695a35bae3a6522ef7145cd8", "name": "GANDHI TVS PIMPALGAON BASWANT", "address": "PATIL ESTATE, NEXT TO HYUNDAI SHOWROOM, AGRA ROAD, PIMPALGAON BASWANT,NASHIK", "city": "PIMPALGAON BASWANT" }
//   ],
//   "availableSubdealers": [ { "_id": "695a362fe3a6522ef7146f86", "name": "RAJ AUTO LASALGAON", "type": "B2C", "status": "active", "branch": "695a32b2e3a6522ef7138420" } ],
//   "userAccessInfo": { "hasAllBranchesAccess": true, "branchAccess": "ALL", "isADBDM": false, "accessibleBranchesCount": 0, "assignedSubdealersCount": 0, "userBranch": { "_id": "695a32b2e3a6522ef7138420", "name": "GANDHI TVS NASHIK" } },
//   "filters": { "branchId": "695a32b2e3a6522ef7138420", "subdealerId": null, "startDate": "2026-02-01", "endDate": "2026-05-30", "approvalStatus": "Approved", "groupBy": "branch", "reportType": "RECEIPT_PAYOUT_DASHBOARD" }
// };

// const FinanceReceiptsDashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [resp, setResp] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get('/finance/receipt-dashboard', {
//           params: {
//             branchId: '695a32b2e3a6522ef7138420',
//             startDate: '2026-02-01',
//             endDate: '2026-05-30',
//             approvalStatus: 'Approved',
//             page: 1,
//             limit: 10,
//           },
//         });

//         setResp(res.data && res.data.success ? res.data : MOCK_RESPONSE);
//       } catch (err) {
//         console.warn('Failed to fetch receipt dashboard, using mock', err);
//         setResp(MOCK_RESPONSE);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div>Loading receipts...</div>;
//   if (!resp) return <div>No data</div>;

//   const { summaryCards, paymentModeSplit, receiptTypeSplit, groupedData, monthlyTrend, payoutAccrual, detailTable } = resp;

//   return (
//     <div style={{ padding: 12 }}>
//       <h2>Finance Receipts Dashboard</h2>

//       <section>
//         <h3>Summary</h3>
//         <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//           <div><strong>Total Receipts:</strong> {summaryCards.totalReceipts}</div>
//           <div><strong>Approved:</strong> {summaryCards.approvedCount}</div>
//           <div><strong>Total Amount:</strong> {summaryCards.totalAmount}</div>
//           <div><strong>Net Amount:</strong> {summaryCards.totalNetAmount}</div>
//           <div><strong>GC Amount:</strong> {summaryCards.totalGCAmount}</div>
//           <div><strong>Approval Rate:</strong> {summaryCards.approvalRate}%</div>
//         </div>
//       </section>

//       <section style={{ marginTop: 16 }}>
//         <h3>Payment Mode Split</h3>
//         <table border="1" cellPadding="6">
//           <thead>
//             <tr><th>Mode</th><th>Count</th><th>Amount</th></tr>
//           </thead>
//           <tbody>
//             {paymentModeSplit.map((p) => (
//               <tr key={p.paymentMode}><td>{p.paymentMode}</td><td>{p.count}</td><td>{p.amount}</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section style={{ marginTop: 16 }}>
//         <h3>Receipt Type Split</h3>
//         <table border="1" cellPadding="6">
//           <thead><tr><th>Type</th><th>Count</th><th>Amount</th></tr></thead>
//           <tbody>
//             {receiptTypeSplit.map((r) => (
//               <tr key={r.receiptType}><td>{r.receiptType}</td><td>{r.count}</td><td>{r.amount}</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section style={{ marginTop: 16 }}>
//         <h3>Grouped ({groupedData.groupBy})</h3>
//         <table border="1" cellPadding="6">
//           <thead><tr><th>Branch</th><th>Count</th><th>Amount</th><th>Approval %</th></tr></thead>
//           <tbody>
//             {groupedData.data.map((g) => (
//               <tr key={g.branchId}><td>{g.branchName}</td><td>{g.totalCount}</td><td>{g.totalAmount}</td><td>{g.approvalRate}%</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section style={{ marginTop: 16 }}>
//         <h3>Monthly Trend</h3>
//         <table border="1" cellPadding="6">
//           <thead><tr><th>Month</th><th>Count</th><th>Amount</th><th>Cumulative</th></tr></thead>
//           <tbody>
//             {monthlyTrend.map((m) => (
//               <tr key={m.month}><td>{m.label}</td><td>{m.totalCount}</td><td>{m.totalAmount}</td><td>{m.cumulativeAmount}</td></tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section style={{ marginTop: 16 }}>
//         <h3>Payout Accrual</h3>
//         <div><strong>Total Accrued:</strong> {payoutAccrual.totalAccrued}</div>
//         <div><strong>Total Unpaid:</strong> {payoutAccrual.totalUnpaid}</div>
//         <div><strong>Coverage:</strong> {payoutAccrual.collectionVsUnpaid.coverage}</div>
//       </section>

//       <section style={{ marginTop: 16 }}>
//         <h3>Details (first {detailTable.data.length} rows)</h3>
//         <table border="1" cellPadding="6">
//           <thead>
//             <tr>
//               <th>Receipt #</th>
//               <th>Date</th>
//               <th>Amount</th>
//               <th>Payment Mode</th>
//               <th>Booking #</th>
//               <th>Customer</th>
//               <th>Branch</th>
//               <th>Created By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {detailTable.data.map((d) => (
//               <tr key={d._id}>
//                 <td>{d.receiptNumber}</td>
//                 <td>{d.formattedDate}</td>
//                 <td>{d.amount}</td>
//                 <td>{d.paymentMode}</td>
//                 <td>{d.bookingNumber}</td>
//                 <td>{d.customerName}</td>
//                 <td>{d.branchName}</td>
//                 <td>{d.createdBy}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div style={{ marginTop: 8 }}><strong>Pagination:</strong> {detailTable.pagination.page} / {detailTable.pagination.totalPages} (total {detailTable.pagination.total})</div>
//       </section>
//     </div>
//   );
// };

// export default FinanceReceiptsDashboard;

// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CButton,
//   CBadge,
//   CFormSelect,
//   CFormInput,
//   CProgress,
//   CAlert,
//   CSpinner,
//   CPagination,
//   CPaginationItem,
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CModalTitle,
// } from '@coreui/react';
// import {
//   FiRefreshCw,
//   FiXCircle,
//   FiCalendar,
//   FiPieChart,
//   FiBarChart2,
//   FiArrowUpRight,
//   FiTrendingUp,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiDollarSign,
//   FiUsers,
//   FiFileText,
//   FiSearch,
//   FiFilter,
//   FiEye,
//   FiChevronLeft,
//   FiChevronRight,
//   FiCreditCard,
//   FiHome,
//   FiCornerDownLeft,
//   FiRepeat,
// } from 'react-icons/fi';
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   AreaChart,
//   Area,
//   Line,
// } from 'recharts';
// import axiosInstance from '../../axiosInstance';

// const FinanceReceiptsDashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [selectedReceipt, setSelectedReceipt] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [filters, setFilters] = useState({
//     branchId: '695a32b2e3a6522ef7138420',
//     subdealerId: 'all',
//     startDate: '2026-02-01',
//     endDate: '2026-05-30',
//     approvalStatus: 'Approved',
//     paymentMode: 'all',
//     receiptType: 'all',
//     page: 1,
//     limit: 10,
//   });

//   const fetchDashboard = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = new URLSearchParams();
//       if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
//       if (filters.subdealerId && filters.subdealerId !== 'all') params.append('subdealerId', filters.subdealerId);
//       if (filters.startDate) params.append('startDate', filters.startDate);
//       if (filters.endDate) params.append('endDate', filters.endDate);
//       if (filters.approvalStatus && filters.approvalStatus !== 'all') params.append('approvalStatus', filters.approvalStatus);
//       if (filters.paymentMode && filters.paymentMode !== 'all') params.append('paymentMode', filters.paymentMode);
//       if (filters.receiptType && filters.receiptType !== 'all') params.append('receiptType', filters.receiptType);
//       params.append('page', filters.page);
//       params.append('limit', filters.limit);

//       const response = await axiosInstance.get(`/finance/receipt-dashboard?${params.toString()}`);
//       if (response.data?.success) {
//         setData(response.data);
//       } else {
//         setError(response.data?.message || 'Failed to load receipt dashboard');
//       }
//     } catch (err) {
//       console.error('Failed to fetch receipt dashboard:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setFilters((prev) => ({ ...prev, page }));
//   };

//   const formatCurrency = (value) => {
//     if (value === undefined || value === null) return '₹0';
//     const num = Number(value);
//     if (isNaN(num)) return '₹0';
//     return `₹${num.toLocaleString('en-IN')}`;
//   };

//   const formatCompactCurrency = (value) => {
//     if (value === undefined || value === null) return '₹0';
//     const num = Number(value);
//     if (isNaN(num)) return '₹0';
//     if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
//     if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
//     if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
//     return `₹${num.toLocaleString('en-IN')}`;
//   };

//   const getPaymentModeIcon = (mode) => {
//     switch (mode) {
//       case 'Bank': return FiHome;
//       case 'Cash': return FiCornerDownLeft;
//       case 'Finance Disbursement': return FiCreditCard;
//       case 'Pay Order': return FiFileText;
//       default: return FiCreditCard;
//     }
//   };

//   if (loading && !data) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px', background: '#f0f2f5' }}>
//         <div className="text-center">
//           <CSpinner style={{ width: '3rem', height: '3rem' }} color="primary" />
//           <p className="mt-3 text-muted">Loading receipt dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !data) {
//     return (
//       <div className="p-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
//         <CAlert color="danger" className="d-flex align-items-center gap-3 border-0 shadow-sm rounded-3">
//           <FiXCircle size={24} />
//           <div className="flex-grow-1">{error}</div>
//           <CButton color="danger" size="sm" onClick={fetchDashboard} className="rounded-pill">
//             <FiRefreshCw className="me-1" /> Retry
//           </CButton>
//         </CAlert>
//       </div>
//     );
//   }

//   if (!data) return null;

//   const { summaryCards, paymentModeSplit, receiptTypeSplit, groupedData, monthlyTrend, payoutAccrual, detailTable, availableBranches, availableSubdealers } = data;

//   // Prepare pie chart data
//   const paymentModePieData = paymentModeSplit?.map(item => ({
//     name: item.paymentMode,
//     value: item.amount,
//     count: item.count,
//     color: item.paymentMode === 'Finance Disbursement' ? '#3b82f6' : 
//            item.paymentMode === 'Bank' ? '#10b981' : 
//            item.paymentMode === 'Cash' ? '#f59e0b' : 
//            item.paymentMode === 'Pay Order' ? '#8b5cf6' : '#6b7280'
//   })) || [];

//   const receiptTypePieData = receiptTypeSplit?.map(item => ({
//     name: item.receiptType,
//     value: item.amount,
//     count: item.count,
//     color: item.receiptType === 'PAYMENT' ? '#10b981' : '#ef4444'
//   })) || [];

//   const StatCard = ({ label, value, subtitle, icon: Icon, color, trend }) => (
//     <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
//       <CCardBody className="p-3">
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <div className={`p-2 rounded-3`} style={{ backgroundColor: `${color === 'primary' ? '#eef2ff' : color === 'success' ? '#ecfdf5' : color === 'warning' ? '#fffbeb' : color === 'danger' ? '#fef2f2' : '#f0f9ff'}` }}>
//             <Icon size={20} color={color === 'primary' ? '#3b82f6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : color === 'danger' ? '#ef4444' : '#06b6d4'} />
//           </div>
//           {trend && (
//             <CBadge color={trend > 0 ? 'success' : 'danger'} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
//               <FiArrowUpRight size={10} />
//               <span>{Math.abs(trend)}%</span>
//             </CBadge>
//           )}
//         </div>
//         <h6 className="text-muted mb-1 small text-uppercase fw-semibold" style={{ fontSize: '11px' }}>{label}</h6>
//         <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>{value}</h4>
//         {subtitle && <p className="text-muted small mb-0" style={{ fontSize: '10px' }}>{subtitle}</p>}
//       </CCardBody>
//     </CCard>
//   );

//   return (
//     <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
//       {/* Header */}
//       <div className="mb-4">
//         <div className="d-flex flex-wrap justify-content-between align-items-center">
//           <div>
//             <h1 className="mb-1 fw-bold" style={{ fontSize: '24px', color: '#1e293b' }}>Payout Accrual Receipts Dashboard</h1>
//             <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Track payment receipts, approval status, and financial metrics</p>
//           </div>
//           <div className="d-flex gap-2 mt-2 mt-sm-0">
//             <CButton color="light" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3" style={{ fontSize: '12px' }} onClick={fetchDashboard}>
//               <FiRefreshCw size={14} /> Refresh
//             </CButton>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
//         <CCardBody className="p-3">
//           <div className="d-flex align-items-center gap-2 mb-3">
//             <FiFilter size={14} className="text-muted" />
//             <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Filters</h6>
//           </div>
//           <CRow className="g-2 align-items-end">
//             <CCol lg={3} md={6}>
//               <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Branch</label>
//               <CFormSelect value={filters.branchId} onChange={(e) => handleFilterChange('branchId', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '12px' }}>
//                 <option value="all">All Branches</option>
//                 {availableBranches?.filter(b => b._id !== 'all').map((branch) => (
//                   <option key={branch._id} value={branch._id}>{branch.name}</option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//             <CCol lg={3} md={6}>
//               <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Subdealer</label>
//               <CFormSelect value={filters.subdealerId} onChange={(e) => handleFilterChange('subdealerId', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '12px' }}>
//                 <option value="all">All Subdealers</option>
//                 {availableSubdealers?.map((subdealer) => (
//                   <option key={subdealer._id} value={subdealer._id}>{subdealer.name}</option>
//                 ))}
//               </CFormSelect>
//             </CCol>
//             <CCol lg={2} md={6}>
//               <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Approval Status</label>
//               <CFormSelect value={filters.approvalStatus} onChange={(e) => handleFilterChange('approvalStatus', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '12px' }}>
//                 <option value="all">All Status</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Rejected">Rejected</option>
//               </CFormSelect>
//             </CCol>
//             <CCol lg={2} md={6}>
//               <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Date Range</label>
//               <div className="d-flex gap-1">
//                 <CFormInput type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
//                 <CFormInput type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
//               </div>
//             </CCol>
//             <CCol lg={2} md={6}>
//               <CButton color="primary" onClick={fetchDashboard} className="w-100 rounded-pill" size="sm" style={{ fontSize: '12px', padding: '6px 12px' }}>
//                 <FiSearch className="me-1" size={12} /> Apply Filters
//               </CButton>
//             </CCol>
//           </CRow>
//         </CCardBody>
//       </CCard>

//       {/* Summary Cards */}
//       <CRow className="g-2 mb-4">
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Total Receipts" value={summaryCards?.totalReceipts || 0} subtitle="Total receipts" icon={FiFileText} color="primary" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Total Amount" value={formatCompactCurrency(summaryCards?.totalAmount || 0)} subtitle="Total receipt amount" icon={FiDollarSign} color="info" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Approved" value={summaryCards?.approvedCount || 0} subtitle={`${formatCompactCurrency(summaryCards?.approvedAmount || 0)} amount`} icon={FiCheckCircle} color="success" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Approval Rate" value={`${summaryCards?.approvalRate || 0}%`} subtitle="Success rate" icon={FiTrendingUp} color="success" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Net Amount" value={formatCompactCurrency(summaryCards?.totalNetAmount || 0)} subtitle="After adjustments" icon={FiBarChart2} color="warning" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Total GC" value={formatCompactCurrency(summaryCards?.totalGCAmount || 0)} subtitle="GC amount" icon={FiAlertCircle} color="danger" />
//         </CCol>
//       </CRow>

//       {/* Secondary Stats Row */}
//       <CRow className="g-2 mb-4">
//         <CCol xl={4} lg={4} md={6} sm={12}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Payment Summary</h6>
//                 <FiCreditCard className="text-muted" size={16} />
//               </div>
//               <div className="row g-2">
//                 <div className="col-4">
//                   <div className="p-2 rounded text-center" style={{ background: '#ecfdf5' }}>
//                     <small className="text-muted d-block" style={{ fontSize: '9px' }}>Payments</small>
//                     <h6 className="mb-0 fw-bold text-success">{summaryCards?.paymentCount || 0}</h6>
//                     <small style={{ fontSize: '8px' }}>{formatCompactCurrency(summaryCards?.paymentAmount || 0)}</small>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="p-2 rounded text-center" style={{ background: '#fef2f2' }}>
//                     <small className="text-muted d-block" style={{ fontSize: '9px' }}>Refunds</small>
//                     <h6 className="mb-0 fw-bold text-danger">{summaryCards?.refundCount || 0}</h6>
//                     <small style={{ fontSize: '8px' }}>{formatCompactCurrency(summaryCards?.refundAmount || 0)}</small>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="p-2 rounded text-center" style={{ background: '#fffbeb' }}>
//                     <small className="text-muted d-block" style={{ fontSize: '9px' }}>Adjustments</small>
//                     <h6 className="mb-0 fw-bold text-warning">{summaryCards?.adjustmentCount || 0}</h6>
//                     <small style={{ fontSize: '8px' }}>{formatCompactCurrency(summaryCards?.adjustmentAmount || 0)}</small>
//                   </div>
//                 </div>
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xl={4} lg={4} md={6} sm={12}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Payout Accrual</h6>
//                 <FiTrendingUp className="text-muted" size={16} />
//               </div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '11px' }}>Total Accrued</span>
//                 <strong className="text-primary">{formatCompactCurrency(payoutAccrual?.totalAccrued || 0)}</strong>
//               </div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '11px' }}>Total Paid</span>
//                 <strong className="text-success">{formatCompactCurrency(payoutAccrual?.totalPaid || 0)}</strong>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted" style={{ fontSize: '11px' }}>Total Unpaid</span>
//                 <strong className="text-danger">{formatCompactCurrency(payoutAccrual?.totalUnpaid || 0)}</strong>
//               </div>
//               <CProgress height="3px" className="mt-2 rounded-pill">
//                 <CProgress value={payoutAccrual?.totalPaid > 0 ? (payoutAccrual.totalPaid / payoutAccrual.totalAccrued) * 100 : 0} color="success" />
//               </CProgress>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xl={4} lg={4} md={12} sm={12}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Collection vs Payout</h6>
//                 <FiDollarSign className="text-muted" size={16} />
//               </div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '11px' }}>Total Collection</span>
//                 <strong className="text-success">{formatCompactCurrency(payoutAccrual?.collectionVsUnpaid?.totalCollection || 0)}</strong>
//               </div>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="text-muted" style={{ fontSize: '11px' }}>Unpaid Payout</span>
//                 <strong className="text-danger">{formatCompactCurrency(payoutAccrual?.collectionVsUnpaid?.unpaidPayout || 0)}</strong>
//               </div>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="text-muted" style={{ fontSize: '11px' }}>Coverage Ratio</span>
//                 <strong className="text-info">{payoutAccrual?.collectionVsUnpaid?.coverage || 0}%</strong>
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Charts Section */}
//       <CRow className="g-3 mb-4">
//         <CCol xl={7}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Monthly Receipt Trend</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Receipt amount & count over time</p>
//                 </div>
//                 <CBadge color="secondary" className="px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
//                   <FiCalendar className="me-1" size={10} /> 2026
//                 </CBadge>
//               </div>
//               {monthlyTrend?.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={280}>
//                   <AreaChart data={monthlyTrend.map((item) => ({ name: item.label, amount: item.totalAmount / 100000, count: item.totalCount }))}>
//                     <defs>
//                       <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                     <XAxis dataKey="name" tick={{ fontSize: 10 }} />
//                     <YAxis yAxisId="left" tickFormatter={(value) => `${value}L`} tick={{ fontSize: 10 }} />
//                     <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
//                     <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
//                     <Legend wrapperStyle={{ fontSize: '11px' }} />
//                     <Area yAxisId="left" type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmount)" name="Amount (Lakhs)" strokeWidth={2} />
//                     <Line yAxisId="right" type="monotone" dataKey="count" stroke="#10b981" name="Count" strokeWidth={2} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="text-center text-muted py-5"><FiBarChart2 size={48} className="mb-2 opacity-25" /><p>No trend data available</p></div>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xl={5}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Payment Mode Distribution</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Breakdown by payment method</p>
//                 </div>
//                 <FiPieChart className="text-muted" size={16} />
//               </div>
//               {paymentModePieData.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={240}>
//                   <PieChart>
//                     <Pie data={paymentModePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
//                       {paymentModePieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
//                     </Pie>
//                     <Tooltip formatter={(value) => formatCompactCurrency(value)} contentStyle={{ fontSize: '11px' }} />
//                     <Legend wrapperStyle={{ fontSize: '10px' }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="text-center text-muted py-4"><p style={{ fontSize: '12px' }}>No payment mode data available</p></div>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Receipt Type and Branch Performance */}
//       <CRow className="g-3 mb-4">
//         <CCol xl={4}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Receipt Type Split</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Payment vs Refund</p>
//                 </div>
//                 <FiRepeat className="text-muted" size={16} />
//               </div>
//               {receiptTypePieData.length > 0 ? (
//                 <>
//                   <div className="row g-2 mb-3">
//                     {receiptTypePieData.map((item, idx) => (
//                       <div key={idx} className="col-6">
//                         <div className="p-2 rounded text-center" style={{ background: `${item.color}10` }}>
//                           <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{item.count.toLocaleString()}</h6>
//                           <small className="text-muted" style={{ fontSize: '9px' }}>{item.name}</small>
//                           <div className="text-muted" style={{ fontSize: '9px' }}>{formatCompactCurrency(item.value)}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <ResponsiveContainer width="100%" height={140}>
//                     <PieChart>
//                       <Pie data={receiptTypePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={3}>
//                         {receiptTypePieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
//                       </Pie>
//                       <Tooltip formatter={(value) => formatCompactCurrency(value)} contentStyle={{ fontSize: '11px' }} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </>
//               ) : (
//                 <div className="text-center text-muted py-4"><p>No receipt type data available</p></div>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xl={8}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Branch Performance</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Receipt distribution by branch</p>
//                 </div>
//                 <FiUsers className="text-muted" size={16} />
//               </div>
//               <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
//                 {groupedData?.data?.map((branch, idx) => (
//                   <div key={idx} className="mb-2 p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <div className="d-flex justify-content-between align-items-center mb-1">
//                       <small className="fw-semibold" style={{ fontSize: '12px' }}>{branch.branchName}</small>
//                       <CBadge color="success" className="rounded-pill px-2" style={{ fontSize: '9px' }}>{branch.approvalRate}%</CBadge>
//                     </div>
//                     <div className="d-flex justify-content-between mb-1">
//                       <small className="text-muted" style={{ fontSize: '9px' }}>Receipts: {branch.totalCount}</small>
//                       <small className="text-muted" style={{ fontSize: '9px' }}>Amount: {formatCompactCurrency(branch.totalAmount)}</small>
//                     </div>
//                     <CProgress height="3px" className="rounded-pill">
//                       <CProgress value={branch.approvalRate} color="success" />
//                     </CProgress>
//                   </div>
//                 ))}
//                 {(!groupedData?.data || groupedData.data.length === 0) && (
//                   <div className="text-center text-muted py-4"><FiUsers size={32} className="mb-2 opacity-25" /><p>No branch data available</p></div>
//                 )}
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Details Table */}
//       <CCard className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
//         <CCardBody className="p-0">
//           <div className="p-3 border-bottom">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Receipt Details</h6>
//                 <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Recent receipt transactions</p>
//               </div>
//               <div className="text-muted" style={{ fontSize: '12px' }}>Total: {detailTable?.pagination?.total || 0} receipts</div>
//             </div>
//           </div>
//           <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//             <table className="table table-hover mb-0" style={{ fontSize: '12px' }}>
//               <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
//                 <tr>
//                   <th className="border-0">Receipt #</th>
//                   <th className="border-0">Date</th>
//                   <th className="border-0">Customer</th>
//                   <th className="border-0">Booking #</th>
//                   <th className="border-0">Payment Mode</th>
//                   <th className="border-0 text-end">Amount</th>
//                   <th className="border-0 text-end">Net Amount</th>
//                   <th className="border-0 text-center">Status</th>
//                   <th className="border-0">Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detailTable?.data?.map((receipt) => {
//                   const PaymentIcon = getPaymentModeIcon(receipt.paymentMode);
//                   return (
//                     <tr key={receipt._id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedReceipt(receipt); setModalVisible(true); }}>
//                       <td className="fw-semibold">{receipt.receiptNumber}</td>
//                       <td>{receipt.formattedDate}</td>
//                       <td>{receipt.customerName}</td>
//                       <td>{receipt.bookingNumber}</td>
//                       <td>
//                         <div className="d-flex align-items-center gap-1">
//                           <PaymentIcon size={12} className="text-muted" />
//                           <span>{receipt.paymentMode}</span>
//                         </div>
//                       </td>
//                       <td className="text-end">{formatCompactCurrency(receipt.amount)}</td>
//                       <td className="text-end">{formatCompactCurrency(receipt.netAmount)}</td>
//                       <td className="text-center">
//                         <CBadge color={receipt.approvalStatus === 'Approved' ? 'success' : receipt.approvalStatus === 'Pending' ? 'warning' : 'danger'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
//                           {receipt.approvalStatus}
//                         </CBadge>
//                       </td>
//                       <td>{receipt.createdBy}</td>
//                     </tr>
//                   );
//                 })}
//                 {(!detailTable?.data || detailTable.data.length === 0) && (
//                   <tr><td colSpan={9} className="text-center text-muted py-5">No receipt details available</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {detailTable?.pagination && detailTable.pagination.totalPages > 1 && (
//             <div className="p-3 border-top">
//               <CPagination className="justify-content-center mb-0" size="sm">
//                 <CPaginationItem disabled={filters.page === 1} onClick={() => handlePageChange(filters.page - 1)}>
//                   <FiChevronLeft size={14} />
//                 </CPaginationItem>
//                 {[...Array(Math.min(5, detailTable.pagination.totalPages)).keys()].map(i => {
//                   let pageNum = i + 1;
//                   if (detailTable.pagination.totalPages > 5 && filters.page > 3) {
//                     pageNum = filters.page - 2 + i;
//                     if (pageNum > detailTable.pagination.totalPages) return null;
//                   }
//                   return (
//                     <CPaginationItem key={pageNum} active={filters.page === pageNum} onClick={() => handlePageChange(pageNum)}>
//                       {pageNum}
//                     </CPaginationItem>
//                   );
//                 })}
//                 <CPaginationItem disabled={filters.page === detailTable.pagination.totalPages} onClick={() => handlePageChange(filters.page + 1)}>
//                   <FiChevronRight size={14} />
//                 </CPaginationItem>
//               </CPagination>
//             </div>
//           )}
//         </CCardBody>
//       </CCard>

//       {/* Receipt Details Modal */}
//       <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" alignment="center">
//         <CModalHeader onClose={() => setModalVisible(false)}>
//           <CModalTitle>Receipt Details: {selectedReceipt?.receiptNumber}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedReceipt && (
//             <div className="p-2">
//               <CRow className="g-3">
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Customer Information</small>
//                     <p className="mb-1"><strong>Name:</strong> {selectedReceipt.customerName}</p>
//                     <p className="mb-1"><strong>Booking #:</strong> {selectedReceipt.bookingNumber}</p>
//                     <p className="mb-0"><strong>Branch:</strong> {selectedReceipt.branchName}</p>
//                   </div>
//                 </CCol>
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Receipt Information</small>
//                     <p className="mb-1"><strong>Receipt Date:</strong> {selectedReceipt.formattedDate}</p>
//                     <p className="mb-1"><strong>Payment Mode:</strong> {selectedReceipt.paymentMode}</p>
//                     <p className="mb-0"><strong>Receipt Type:</strong> {selectedReceipt.receiptType}</p>
//                   </div>
//                 </CCol>
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Financial Details</small>
//                     <p className="mb-1"><strong>Amount:</strong> {formatCurrency(selectedReceipt.amount)}</p>
//                     <p className="mb-1"><strong>Net Amount:</strong> {formatCurrency(selectedReceipt.netAmount)}</p>
//                     <p className="mb-0"><strong>GC Amount:</strong> {formatCurrency(selectedReceipt.gcAmount)}</p>
//                   </div>
//                 </CCol>
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Additional Information</small>
//                     <p className="mb-1"><strong>Approval Status:</strong> <CBadge color={selectedReceipt.approvalStatus === 'Approved' ? 'success' : 'warning'}>{selectedReceipt.approvalStatus}</CBadge></p>
//                     <p className="mb-1"><strong>Created By:</strong> {selectedReceipt.createdBy}</p>
//                     {selectedReceipt.transactionReference && <p className="mb-0"><strong>Transaction Ref:</strong> {selectedReceipt.transactionReference}</p>}
//                   </div>
//                 </CCol>
//               </CRow>
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setModalVisible(false)} className="rounded-pill px-4">Close</CButton>
//         </CModalFooter>
//       </CModal>

//       <style>{`
//         .table-hover tbody tr:hover {
//           background-color: #f8fafc;
//           transition: all 0.2s ease;
//         }
//         ::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FinanceReceiptsDashboard;




import React, { useEffect, useState, useCallback } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CBadge,
  CFormSelect,
  CFormInput,
  CProgress,
  CAlert,
  CSpinner,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react';
import {
  FiRefreshCw,
  FiXCircle,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiArrowUpRight,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiHome,
  FiCornerDownLeft,
  FiRepeat,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
} from 'recharts';
import axiosInstance from '../../axiosInstance';

const FinanceReceiptsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    branchId: 'all',
    subdealerId: 'all',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    approvalStatus: 'all',
    paymentMode: 'all',
    receiptType: 'all',
    page: 1,
    limit: 10,
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
      if (filters.subdealerId && filters.subdealerId !== 'all') params.append('subdealerId', filters.subdealerId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.approvalStatus && filters.approvalStatus !== 'all') params.append('approvalStatus', filters.approvalStatus);
      if (filters.paymentMode && filters.paymentMode !== 'all') params.append('paymentMode', filters.paymentMode);
      if (filters.receiptType && filters.receiptType !== 'all') params.append('receiptType', filters.receiptType);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await axiosInstance.get(`/finance/receipt-dashboard?${params.toString()}`);
      if (response.data?.success) {
        setData(response.data);
      } else {
        // Set empty data structure
        setData({
          success: false,
          summaryCards: {
            totalReceipts: 0,
            approvedCount: 0,
            pendingCount: 0,
            rejectedCount: 0,
            totalAmount: 0,
            approvedAmount: 0,
            pendingAmount: 0,
            rejectedAmount: 0,
            totalNetAmount: 0,
            totalGCAmount: 0,
            paymentCount: 0,
            paymentAmount: 0,
            refundCount: 0,
            refundAmount: 0,
            adjustmentCount: 0,
            adjustmentAmount: 0,
            approvalRate: 0,
          },
          paymentModeSplit: [],
          receiptTypeSplit: [],
          groupedData: { groupBy: 'branch', data: [] },
          monthlyTrend: [],
          payoutAccrual: {
            totalAccrued: 0,
            totalPaid: 0,
            totalUnpaid: 0,
            collectionVsUnpaid: { totalCollection: 0, unpaidPayout: 0, coverage: 0 },
          },
          detailTable: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
          availableBranches: [],
          availableSubdealers: [],
        });
      }
    } catch (err) {
      console.error('API Error:', err);
      // Set empty data structure on error
      setData({
        success: false,
        summaryCards: {
          totalReceipts: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
          totalAmount: 0,
          approvedAmount: 0,
          pendingAmount: 0,
          rejectedAmount: 0,
          totalNetAmount: 0,
          totalGCAmount: 0,
          paymentCount: 0,
          paymentAmount: 0,
          refundCount: 0,
          refundAmount: 0,
          adjustmentCount: 0,
          adjustmentAmount: 0,
          approvalRate: 0,
        },
        paymentModeSplit: [],
        receiptTypeSplit: [],
        groupedData: { groupBy: 'branch', data: [] },
        monthlyTrend: [],
        payoutAccrual: {
          totalAccrued: 0,
          totalPaid: 0,
          totalUnpaid: 0,
          collectionVsUnpaid: { totalCollection: 0, unpaidPayout: 0, coverage: 0 },
        },
        detailTable: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
        availableBranches: [],
        availableSubdealers: [],
      });
      setError(null); // Clear error to show dashboard with zeros
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '₹0';
    const num = Number(value);
    if (isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const formatCompactCurrency = (value) => {
    if (value === undefined || value === null) return '₹0';
    const num = Number(value);
    if (isNaN(num)) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const getPaymentModeIcon = (mode) => {
    switch (mode) {
      case 'Bank': return FiHome;
      case 'Cash': return FiCornerDownLeft;
      case 'Finance Disbursement': return FiCreditCard;
      case 'Pay Order': return FiFileText;
      default: return FiCreditCard;
    }
  };

  if (loading && !data) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px', background: '#f0f2f5' }}>
        <div className="text-center">
          <CSpinner style={{ width: '3rem', height: '3rem' }} color="primary" />
          <p className="mt-3 text-muted">Loading receipt dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <CAlert color="danger" className="d-flex align-items-center gap-3 border-0 shadow-sm rounded-3">
          <FiXCircle size={24} />
          <div className="flex-grow-1">{error}</div>
          <CButton color="danger" size="sm" onClick={fetchDashboard} className="rounded-pill">
            <FiRefreshCw className="me-1" /> Retry
          </CButton>
        </CAlert>
      </div>
    );
  }

  if (!data) return null;

  const { summaryCards, paymentModeSplit, receiptTypeSplit, groupedData, monthlyTrend, payoutAccrual, detailTable, availableBranches, availableSubdealers } = data;

  const paymentModePieData = paymentModeSplit?.map(item => ({
    name: item.paymentMode,
    value: item.amount,
    count: item.count,
    color: item.paymentMode === 'Finance Disbursement' ? '#3b82f6' : 
           item.paymentMode === 'Bank' ? '#10b981' : 
           item.paymentMode === 'Cash' ? '#f59e0b' : 
           item.paymentMode === 'Pay Order' ? '#8b5cf6' : '#6b7280'
  })) || [];

  const receiptTypePieData = receiptTypeSplit?.map(item => ({
    name: item.receiptType,
    value: item.amount,
    count: item.count,
    color: item.receiptType === 'PAYMENT' ? '#10b981' : '#ef4444'
  })) || [];

  const StatCard = ({ label, value, subtitle, icon: Icon, color, trend }) => (
    <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
      <CCardBody className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className={`p-2 rounded-3`} style={{ backgroundColor: `${color === 'primary' ? '#eef2ff' : color === 'success' ? '#ecfdf5' : color === 'warning' ? '#fffbeb' : color === 'danger' ? '#fef2f2' : '#f0f9ff'}` }}>
            <Icon size={20} color={color === 'primary' ? '#3b82f6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : color === 'danger' ? '#ef4444' : '#06b6d4'} />
          </div>
          {trend && (
            <CBadge color={trend > 0 ? 'success' : 'danger'} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
              <FiArrowUpRight size={10} />
              <span>{Math.abs(trend)}%</span>
            </CBadge>
          )}
        </div>
        <h6 className="text-muted mb-1 small text-uppercase fw-semibold" style={{ fontSize: '11px' }}>{label}</h6>
        <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>{value}</h4>
        {subtitle && <p className="text-muted small mb-0" style={{ fontSize: '10px' }}>{subtitle}</p>}
      </CCardBody>
    </CCard>
  );

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="mb-1 fw-bold" style={{ fontSize: '24px', color: '#1e293b' }}>Payout Accrual Receipts Dashboard</h1>
            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Track payment receipts, approval status, and financial metrics</p>
          </div>
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <CButton color="light" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3" style={{ fontSize: '12px' }} onClick={fetchDashboard}>
              <FiRefreshCw size={14} /> Refresh
            </CButton>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <CCardBody className="p-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <FiFilter size={14} className="text-muted" />
            <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Filters</h6>
          </div>
          <CRow className="g-2 align-items-end">
            <CCol lg={3} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Branch</label>
              <CFormSelect value={filters.branchId} onChange={(e) => handleFilterChange('branchId', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '12px' }}>
                <option value="all">All Branches</option>
                {availableBranches?.filter(b => b._id !== 'all').map((branch) => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol lg={3} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Subdealer</label>
              <CFormSelect value={filters.subdealerId} onChange={(e) => handleFilterChange('subdealerId', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '12px' }}>
                <option value="all">All Subdealers</option>
                {availableSubdealers?.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>{subdealer.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol lg={2} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Approval Status</label>
              <CFormSelect value={filters.approvalStatus} onChange={(e) => handleFilterChange('approvalStatus', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '12px' }}>
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </CFormSelect>
            </CCol>
            <CCol lg={2} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Date Range</label>
              <div className="d-flex gap-1">
                <CFormInput type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
                <CFormInput type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
              </div>
            </CCol>
            <CCol lg={2} md={6}>
              <CButton color="primary" onClick={fetchDashboard} className="w-100 rounded-pill" size="sm" style={{ fontSize: '12px', padding: '6px 12px' }}>
                <FiSearch className="me-1" size={12} /> Apply Filters
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Summary Cards */}
      <CRow className="g-2 mb-4">
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Total Receipts" value={summaryCards?.totalReceipts || 0} subtitle="Total receipts" icon={FiFileText} color="primary" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Total Amount" value={formatCompactCurrency(summaryCards?.totalAmount || 0)} subtitle="Total receipt amount" icon={FiDollarSign} color="info" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Approved" value={summaryCards?.approvedCount || 0} subtitle={`${formatCompactCurrency(summaryCards?.approvedAmount || 0)} amount`} icon={FiCheckCircle} color="success" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Approval Rate" value={`${summaryCards?.approvalRate || 0}%`} subtitle="Success rate" icon={FiTrendingUp} color="success" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Net Amount" value={formatCompactCurrency(summaryCards?.totalNetAmount || 0)} subtitle="After adjustments" icon={FiBarChart2} color="warning" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Total GC" value={formatCompactCurrency(summaryCards?.totalGCAmount || 0)} subtitle="GC amount" icon={FiAlertCircle} color="danger" />
        </CCol>
      </CRow>

      {/* Secondary Stats Row */}
      <CRow className="g-2 mb-4">
        <CCol xl={4} lg={4} md={6} sm={12}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Payment Summary</h6>
                <FiCreditCard className="text-muted" size={16} />
              </div>
              <div className="row g-2">
                <div className="col-4">
                  <div className="p-2 rounded text-center" style={{ background: '#ecfdf5' }}>
                    <small className="text-muted d-block" style={{ fontSize: '9px' }}>Payments</small>
                    <h6 className="mb-0 fw-bold text-success">{summaryCards?.paymentCount || 0}</h6>
                    <small style={{ fontSize: '8px' }}>{formatCompactCurrency(summaryCards?.paymentAmount || 0)}</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded text-center" style={{ background: '#fef2f2' }}>
                    <small className="text-muted d-block" style={{ fontSize: '9px' }}>Refunds</small>
                    <h6 className="mb-0 fw-bold text-danger">{summaryCards?.refundCount || 0}</h6>
                    <small style={{ fontSize: '8px' }}>{formatCompactCurrency(summaryCards?.refundAmount || 0)}</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded text-center" style={{ background: '#fffbeb' }}>
                    <small className="text-muted d-block" style={{ fontSize: '9px' }}>Adjustments</small>
                    <h6 className="mb-0 fw-bold text-warning">{summaryCards?.adjustmentCount || 0}</h6>
                    <small style={{ fontSize: '8px' }}>{formatCompactCurrency(summaryCards?.adjustmentAmount || 0)}</small>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xl={4} lg={4} md={6} sm={12}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Payout Accrual</h6>
                <FiTrendingUp className="text-muted" size={16} />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '11px' }}>Total Accrued</span>
                <strong className="text-primary">{formatCompactCurrency(payoutAccrual?.totalAccrued || 0)}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '11px' }}>Total Paid</span>
                <strong className="text-success">{formatCompactCurrency(payoutAccrual?.totalPaid || 0)}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted" style={{ fontSize: '11px' }}>Total Unpaid</span>
                <strong className="text-danger">{formatCompactCurrency(payoutAccrual?.totalUnpaid || 0)}</strong>
              </div>
              <CProgress height="3px" className="mt-2 rounded-pill">
                <CProgress value={payoutAccrual?.totalPaid > 0 ? (payoutAccrual.totalPaid / payoutAccrual.totalAccrued) * 100 : 0} color="success" />
              </CProgress>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xl={4} lg={4} md={12} sm={12}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>Collection vs Payout</h6>
                <FiDollarSign className="text-muted" size={16} />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '11px' }}>Total Collection</span>
                <strong className="text-success">{formatCompactCurrency(payoutAccrual?.collectionVsUnpaid?.totalCollection || 0)}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted" style={{ fontSize: '11px' }}>Unpaid Payout</span>
                <strong className="text-danger">{formatCompactCurrency(payoutAccrual?.collectionVsUnpaid?.unpaidPayout || 0)}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted" style={{ fontSize: '11px' }}>Coverage Ratio</span>
                <strong className="text-info">{payoutAccrual?.collectionVsUnpaid?.coverage || 0}%</strong>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Charts Section */}
      <CRow className="g-3 mb-4">
        <CCol xl={7}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Monthly Receipt Trend</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Receipt amount & count over time</p>
                </div>
                <CBadge color="secondary" className="px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
                  <FiCalendar className="me-1" size={10} /> 2026
                </CBadge>
              </div>
              {monthlyTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={monthlyTrend.map((item) => ({ name: item.label, amount: item.totalAmount / 100000, count: item.totalCount }))}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value}L`} tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmount)" name="Amount (Lakhs)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="count" stroke="#10b981" name="Count" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5"><FiBarChart2 size={48} className="mb-2 opacity-25" /><p>No trend data available</p></div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xl={5}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Payment Mode Distribution</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Breakdown by payment method</p>
                </div>
                <FiPieChart className="text-muted" size={16} />
              </div>
              {paymentModePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={paymentModePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                      {paymentModePieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCompactCurrency(value)} contentStyle={{ fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-4"><p style={{ fontSize: '12px' }}>No payment mode data available</p></div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Receipt Type and Branch Performance */}
      <CRow className="g-3 mb-4">
        <CCol xl={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Receipt Type Split</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Payment vs Refund</p>
                </div>
                <FiRepeat className="text-muted" size={16} />
              </div>
              {receiptTypePieData.length > 0 ? (
                <>
                  <div className="row g-2 mb-3">
                    {receiptTypePieData.map((item, idx) => (
                      <div key={idx} className="col-6">
                        <div className="p-2 rounded text-center" style={{ background: `${item.color}10` }}>
                          <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{item.count.toLocaleString()}</h6>
                          <small className="text-muted" style={{ fontSize: '9px' }}>{item.name}</small>
                          <div className="text-muted" style={{ fontSize: '9px' }}>{formatCompactCurrency(item.value)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={receiptTypePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={3}>
                        {receiptTypePieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCompactCurrency(value)} contentStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="text-center text-muted py-4"><p>No receipt type data available</p></div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xl={8}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Branch Performance</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Receipt distribution by branch</p>
                </div>
                <FiUsers className="text-muted" size={16} />
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {groupedData?.data?.length > 0 ? (
                  groupedData.data.map((branch, idx) => (
                    <div key={idx} className="mb-2 p-2 rounded" style={{ background: '#f8fafc' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="fw-semibold" style={{ fontSize: '12px' }}>{branch.branchName}</small>
                        <CBadge color="success" className="rounded-pill px-2" style={{ fontSize: '9px' }}>{branch.approvalRate}%</CBadge>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted" style={{ fontSize: '9px' }}>Receipts: {branch.totalCount}</small>
                        <small className="text-muted" style={{ fontSize: '9px' }}>Amount: {formatCompactCurrency(branch.totalAmount)}</small>
                      </div>
                      <CProgress height="3px" className="rounded-pill">
                        <CProgress value={branch.approvalRate} color="success" />
                      </CProgress>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4"><FiUsers size={32} className="mb-2 opacity-25" /><p>No branch data available</p></div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Details Table */}
      <CCard className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <CCardBody className="p-0">
          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Receipt Details</h6>
                <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Recent receipt transactions</p>
              </div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Total: {detailTable?.pagination?.total || 0} receipts</div>
            </div>
          </div>
          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table table-hover mb-0" style={{ fontSize: '12px' }}>
              <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th className="border-0">Receipt #</th>
                  <th className="border-0">Date</th>
                  <th className="border-0">Customer</th>
                  <th className="border-0">Booking #</th>
                  <th className="border-0">Payment Mode</th>
                  <th className="border-0 text-end">Amount</th>
                  <th className="border-0 text-end">Net Amount</th>
                  <th className="border-0 text-center">Status</th>
                  <th className="border-0">Created By</th>
                </tr>
              </thead>
              <tbody>
                {detailTable?.data?.length > 0 ? (
                  detailTable.data.map((receipt) => {
                    const PaymentIcon = getPaymentModeIcon(receipt.paymentMode);
                    return (
                      <tr key={receipt._id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedReceipt(receipt); setModalVisible(true); }}>
                        <td className="fw-semibold">{receipt.receiptNumber}</td>
                        <td>{receipt.formattedDate}</td>
                        <td>{receipt.customerName}</td>
                        <td>{receipt.bookingNumber}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <PaymentIcon size={12} className="text-muted" />
                            <span>{receipt.paymentMode}</span>
                          </div>
                        </td>
                        <td className="text-end">{formatCompactCurrency(receipt.amount)}</td>
                        <td className="text-end">{formatCompactCurrency(receipt.netAmount)}</td>
                        <td className="text-center">
                          <CBadge color={receipt.approvalStatus === 'Approved' ? 'success' : receipt.approvalStatus === 'Pending' ? 'warning' : 'danger'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
                            {receipt.approvalStatus}
                          </CBadge>
                        </td>
                        <td>{receipt.createdBy}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-5">No receipt details available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {detailTable?.pagination && detailTable.pagination.totalPages > 1 && (
            <div className="p-3 border-top">
              <CPagination className="justify-content-center mb-0" size="sm">
                <CPaginationItem disabled={filters.page === 1} onClick={() => handlePageChange(filters.page - 1)}>
                  <FiChevronLeft size={14} />
                </CPaginationItem>
                {[...Array(Math.min(5, detailTable.pagination.totalPages)).keys()].map(i => {
                  let pageNum = i + 1;
                  if (detailTable.pagination.totalPages > 5 && filters.page > 3) {
                    pageNum = filters.page - 2 + i;
                    if (pageNum > detailTable.pagination.totalPages) return null;
                  }
                  return (
                    <CPaginationItem key={pageNum} active={filters.page === pageNum} onClick={() => handlePageChange(pageNum)}>
                      {pageNum}
                    </CPaginationItem>
                  );
                })}
                <CPaginationItem disabled={filters.page === detailTable.pagination.totalPages} onClick={() => handlePageChange(filters.page + 1)}>
                  <FiChevronRight size={14} />
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Receipt Details Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" alignment="center">
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Receipt Details: {selectedReceipt?.receiptNumber}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedReceipt && (
            <div className="p-2">
              <CRow className="g-3">
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Customer Information</small>
                    <p className="mb-1"><strong>Name:</strong> {selectedReceipt.customerName}</p>
                    <p className="mb-1"><strong>Booking #:</strong> {selectedReceipt.bookingNumber}</p>
                    <p className="mb-0"><strong>Branch:</strong> {selectedReceipt.branchName}</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Receipt Information</small>
                    <p className="mb-1"><strong>Receipt Date:</strong> {selectedReceipt.formattedDate}</p>
                    <p className="mb-1"><strong>Payment Mode:</strong> {selectedReceipt.paymentMode}</p>
                    <p className="mb-0"><strong>Receipt Type:</strong> {selectedReceipt.receiptType}</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Financial Details</small>
                    <p className="mb-1"><strong>Amount:</strong> {formatCurrency(selectedReceipt.amount)}</p>
                    <p className="mb-1"><strong>Net Amount:</strong> {formatCurrency(selectedReceipt.netAmount)}</p>
                    <p className="mb-0"><strong>GC Amount:</strong> {formatCurrency(selectedReceipt.gcAmount)}</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Additional Information</small>
                    <p className="mb-1"><strong>Approval Status:</strong> <CBadge color={selectedReceipt.approvalStatus === 'Approved' ? 'success' : 'warning'}>{selectedReceipt.approvalStatus}</CBadge></p>
                    <p className="mb-1"><strong>Created By:</strong> {selectedReceipt.createdBy}</p>
                    {selectedReceipt.transactionReference && <p className="mb-0"><strong>Transaction Ref:</strong> {selectedReceipt.transactionReference}</p>}
                  </div>
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)} className="rounded-pill px-4">Close</CButton>
        </CModalFooter>
      </CModal>

      <style>{`
        .table-hover tbody tr:hover {
          background-color: #f8fafc;
          transition: all 0.2s ease;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default FinanceReceiptsDashboard;